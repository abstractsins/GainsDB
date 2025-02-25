import pool from './src/db.js';
import fs from 'fs';

const USER_ID = 7; // Replace with actual user ID

// Function to parse workout data from text
function parseWorkoutData(data) {
    const lines = data.replace(/\r/g, '').split('\n').map(line => line.trim()).filter(line => line);
    let parsedRecords = [];
    let currentDate = null;
    let currentExercise = null;
    let setOrder = 1;

    const dateRegex = /^20\d{6}$/;
    const weightSetRepRegex = /^(\d+)lb (\d+)x(\d+)$/;

    lines.forEach((line) => {
        if (dateRegex.test(line)) {
            currentDate = line;
        } else if (weightSetRepRegex.test(line)) {
            if (currentExercise && currentDate) {
                const [, weight, sets, reps] = line.match(weightSetRepRegex);
                for (let i = 0; i < parseInt(sets, 10); i++) {
                    parsedRecords.push({
                        user_id: USER_ID,
                        date: currentDate,
                        exercise: normalizeExe(currentExercise),
                        weight: parseInt(weight, 10),
                        reps: parseInt(reps, 10),
                        set_order: setOrder++
                    });
                }
            }
        } else {
            currentExercise = line;
            setOrder = 1; // Reset set order when switching exercises
        }
    });

    return parsedRecords;
}

// Function to delete all workout data for a user before inserting new data
async function deleteUserData(userId) {
    const client = await pool.connect();
    try {
        await client.query("BEGIN");

        // Delete all workouts for this user (cascades to workout_exercises and sets)
        await client.query("DELETE FROM workouts WHERE user_id = $1;", [userId]);

        // Delete unused exercises (exercises with no workout_exercises reference)
        await client.query("DELETE FROM exercises WHERE id NOT IN (SELECT exercise_id FROM workout_exercises);");

        await client.query("COMMIT");
        console.log(`Deleted all workout data for user ${userId}`);
    } catch (err) {
        await client.query("ROLLBACK");
        console.error("Error deleting user data:", err);
    } finally {
        client.release();
    }
}

// Function to get or create a workout entry
async function getOrCreateWorkout(userId, workoutDate) {
    const client = await pool.connect();
    try {
        const res = await client.query(
            'SELECT id FROM workouts WHERE user_id = $1 AND workout_date = $2',
            [userId, workoutDate]
        );
        if (res.rows.length > 0) {
            return res.rows[0].id;
        } else {
            const insertRes = await client.query(
                'INSERT INTO workouts (user_id, workout_date) VALUES ($1, $2) RETURNING id',
                [userId, workoutDate]
            );
            return insertRes.rows[0].id;
        }
    } catch (err) {
        console.error('Error inserting workout:', err);
        throw err;
    } finally {
        client.release();
    }
}

// Function to get or create an exercise entry
async function getOrCreateExercise(userId, exerciseName) {
    const client = await pool.connect();
    try {
        const normalizedName = exerciseName.trim().toLowerCase();

        // Step 1: Check if the exercise exists
        let exerciseResult = await client.query(
            `SELECT id FROM exercises WHERE LOWER(name) = LOWER($1)`,
            [normalizedName]
        );

        // Step 2: If it doesn’t exist, insert it
        if (exerciseResult.rows.length === 0) {
            exerciseResult = await client.query(
                `INSERT INTO exercises (name, created_by) 
                 VALUES ($1, $2) 
                 ON CONFLICT (LOWER(name)) DO NOTHING 
                 RETURNING id`,
                [normalizedName, userId]
            );

            // If insert didn't return an ID, fetch the existing ID
            if (exerciseResult.rows.length === 0) {
                exerciseResult = await client.query(
                    `SELECT id FROM exercises WHERE LOWER(name) = LOWER($1)`,
                    [normalizedName]
                );
            }
        }

        // Ensure an ID was found before proceeding
        if (!exerciseResult.rows.length) {
            throw new Error(`Failed to find or insert exercise: ${normalizedName}`);
        }

        const exerciseId = exerciseResult.rows[0].id;

        // Step 3: Link the user to the exercise
        await client.query(
            `INSERT INTO user_exercises (user_id, exercise_id) 
             VALUES ($1, $2) 
             ON CONFLICT (user_id, exercise_id) DO NOTHING`,
            [userId, exerciseId]
        );

        return exerciseId;
    } catch (err) {
        console.error("Error inserting or retrieving exercise:", err);
        throw err;
    } finally {
        client.release();
    }
}


// Function to get or create a workout-exercise link
async function getOrCreateWorkoutExercise(workoutId, exerciseId) {
    const client = await pool.connect();
    try {
        const res = await client.query(
            'SELECT id FROM workout_exercises WHERE workout_id = $1 AND exercise_id = $2',
            [workoutId, exerciseId]
        );
        if (res.rows.length > 0) {
            return res.rows[0].id;
        } else {
            const insertRes = await client.query(
                'INSERT INTO workout_exercises (workout_id, exercise_id) VALUES ($1, $2) RETURNING id',
                [workoutId, exerciseId]
            );
            return insertRes.rows[0].id;
        }
    } catch (err) {
        console.error('Error inserting workout-exercise:', err);
        throw err;
    } finally {
        client.release();
    }
}

// Function to batch insert sets for better performance
async function insertSetsBatch(sets) {
    if (sets.length === 0) return;

    const client = await pool.connect();
    try {
        const values = sets
            .map((set, index) => `($${index * 4 + 1}, $${index * 4 + 2}, $${index * 4 + 3}, $${index * 4 + 4})`)
            .join(",");

        const query = `INSERT INTO sets (workout_exercise_id, weight, reps, set_order) VALUES ${values}`;
        const params = sets.flatMap(set => [set.workoutExerciseId, set.weight, set.reps, set.set_order]);

        await client.query(query, params);
    } catch (err) {
        console.error("Error inserting sets in batch:", err);
    } finally {
        client.release();
    }
}

// Function to process and insert all parsed data
async function insertWorkoutData(records) {
    if (records.length === 0) return;

    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        let currentWorkoutId = null;
        let exerciseCache = new Map();
        let setBatch = [];

        for (const record of records) {
            if (!currentWorkoutId || record.date !== records[0].date) {
                currentWorkoutId = await getOrCreateWorkout(record.user_id, record.date);
            }

            let exerciseId;
            if (exerciseCache.has(record.exercise)) {
                exerciseId = exerciseCache.get(record.exercise);
            } else {
                exerciseId = await getOrCreateExercise(record.user_id, record.exercise);
                exerciseCache.set(record.exercise, exerciseId);
            }

            const workoutExerciseId = await getOrCreateWorkoutExercise(currentWorkoutId, exerciseId);
            
            setBatch.push({
                workoutExerciseId,
                weight: record.weight,
                reps: record.reps,
                set_order: record.set_order
            });
        }

        // Batch insert sets instead of inserting one by one
        await insertSetsBatch(setBatch);

        await client.query('COMMIT');
        console.log(`Inserted ${records.length} sets for user ${USER_ID}`);
    } catch (err) {
        await client.query('ROLLBACK');
        console.error('Database error:', err);
    } finally {
        client.release();
    }
}


async function createTablesIfNotExist() {
    const client = await pool.connect();
    try {
        await client.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                username VARCHAR(50) UNIQUE NOT NULL,
                password_hash TEXT NOT NULL,
                role VARCHAR(10) DEFAULT 'user',
                created_at TIMESTAMP DEFAULT NOW()
            );

            CREATE TABLE IF NOT EXISTS workouts (
                id SERIAL PRIMARY KEY,
                user_id INT REFERENCES users(id) ON DELETE CASCADE,
                workout_date DATE NOT NULL,
                created_at TIMESTAMP DEFAULT NOW()
            );

            CREATE TABLE IF NOT EXISTS exercises (
                id SERIAL PRIMARY KEY,
                name VARCHAR(100) UNIQUE NOT NULL,
                created_by INT REFERENCES users(id) ON DELETE CASCADE
            );

            CREATE TABLE IF NOT EXISTS user_exercises (
                id SERIAL PRIMARY KEY,
                user_id INT REFERENCES users(id) ON DELETE CASCADE,
                exercise_id INT REFERENCES exercises(id) ON DELETE CASCADE,
                UNIQUE(user_id, exercise_id) -- ✅ Prevents duplicate links
            );

            CREATE TABLE IF NOT EXISTS workout_exercises (
                id SERIAL PRIMARY KEY,
                workout_id INT REFERENCES workouts(id) ON DELETE CASCADE,
                exercise_id INT REFERENCES exercises(id) ON DELETE CASCADE
            );

            CREATE TABLE IF NOT EXISTS sets (
                id SERIAL PRIMARY KEY,
                workout_exercise_id INT REFERENCES workout_exercises(id) ON DELETE CASCADE,
                weight DECIMAL(5,2) NOT NULL,
                reps INT NOT NULL,
                set_order INT NOT NULL
            );
        `);
        console.log("✅ Tables are ready!");
    } catch (err) {
        console.error("Error creating tables:", err);
    } finally {
        client.release();
    }
}


// Read legacy workout data and insert it
fs.readFile('legacy_data.txt', 'utf8', async (err, data) => {
    if (err) {
        console.error('Error reading file:', err);
        return;
    }

    // 🔹 Ensure tables exist before inserting data
    await createTablesIfNotExist();

    // 🔹 Optional: Delete old user data before inserting new data
    await deleteUserData(USER_ID);

    const parsedData = parseWorkoutData(data);
    console.dir(parsedData, { depth: null, colors: true });

    await insertWorkoutData(parsedData);
});

// Function to normalize exercise names
function normalizeExe(string) {
    return string.toLowerCase()
        .replace(/\blat\b/g, 'lateral')
        .replace(/\bpull\sdown\b/g, 'pulldown')
        .replace(/(\bunloaded\s\d+lbs\b)/g, '($1)')
        .trim();
}
