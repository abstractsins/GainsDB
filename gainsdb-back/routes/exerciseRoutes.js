import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import pool from "../src/db.js";
import exerciseCategorizer from "../utils/exerciseCatagories.js";

const router = express.Router();

const normalizeExercise = exercise => {
    exercise = exercise.toLowerCase();
    exercise = exercise.replace(/[!@#$%^&*{}:-_]/g, ' ')
    exercise = exercise.trim();
    return exercise;
}

//* Fetch exercises
router.get("/:userId/exercises", authMiddleware, async (req, res) => {
    const { userId } = req.params;
    console.log(`Fetching exercises for user ${userId}`);

    try {
        const result = await pool.query(
            `SELECT 
            e.id, 
            e.name, 
            COALESCE(
                TO_CHAR(
                    (SELECT MAX(w.workout_date) 
                    FROM workout_exercises we
                    JOIN workouts w ON we.workout_id = w.id
                    WHERE we.exercise_id = e.id AND w.user_id = $1),
                    'YYYY-MM-DD'
                ),
                TO_CHAR(e.created_at, 'YYYY-MM-DD')
            ) AS last_logged_date
        FROM exercises e
        JOIN user_exercises ue ON e.id = ue.exercise_id
        WHERE ue.user_id = $1
        GROUP BY e.id, e.name, e.created_at
        ORDER BY last_logged_date DESC;`,
            [userId]
        );

        result.rows = exerciseCategorizer(result.rows);

        // console.log(result.rows)

        res.json(result.rows);
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});


router.get("/:userId/exercises/:exerciseId/latest-workout", authMiddleware, async (req, res) => {
    try {
        const { userId, exerciseId } = req.params;

        const query = `
            WITH RecentWorkout AS (
                SELECT we.id AS workout_exercise_id, w.id AS workout_id, w.workout_date, w.user_id
                FROM workout_exercises we
                JOIN workouts w ON we.workout_id = w.id
                WHERE we.exercise_id = $1 AND w.user_id = $2
                ORDER BY w.workout_date DESC
                LIMIT 1
            )
            SELECT 
                rw.workout_id,
                rw.workout_date,
                rw.user_id,
                s.set_order,
                s.weight,
                s.reps
            FROM RecentWorkout rw
            JOIN sets s ON rw.workout_exercise_id = s.workout_exercise_id
            ORDER BY s.set_order;
        `;

        const { rows } = await pool.query(query, [exerciseId, userId]);

        if (rows.length === 0) {
            return res.status(404).json({ error: "No recent workout found for this exercise." });
        }

        console.dir(rows);
        res.json(rows);
    } catch (error) {
        console.error("Error fetching recent workout:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});


//* NEW EXERCISE
router.post("/:userId/exercises", authMiddleware, async (req, res) => {
    const { userId } = req.params;
    const { name } = req.body
    const normalizedExercise = normalizeExercise(name);

    console.log('attempting to add exercise: ' + name);

    if (!name) {
        return res.status(400).json({ error: "Exercise name is required." });
    }

    try {

        // Step 1: Check if exercise already exists
        let exerciseResult = await pool.query(`SELECT id FROM exercises WHERE name = $1`, [normalizeExercise]);

        if (exerciseResult.rows.length === 0) {
            // Step 2: Insert new exercise if it doesn’t exist
            exerciseResult = await pool.query(
                `INSERT INTO exercises (name, created_by) 
           VALUES ($1, $2) 
           ON CONFLICT (name) DO NOTHING 
           RETURNING id`,
                [normalizedExercise, userId]
            );




            // Step 3: If insert didn't return an ID, fetch the existing ID
            if (exerciseResult.rows.length === 0) {
                exerciseResult = await pool.query(
                    `SELECT id FROM exercises WHERE LOWER(name) = LOWER($1)`,
                    [normalizedExercise]
                );
            }
        }

        // Step 4: Ensure an ID was found before proceeding
        if (!exerciseResult.rows.length) {
            throw new Error(`Failed to find or insert exercise: ${normalizedExercise}`);
        }



        const exerciseId = exerciseResult.rows[0].id;

        const user = parseInt(userId, 10);
        // Step 3: Link user to the exercise
        await pool.query(
            `INSERT INTO user_exercises (user_id, exercise_id)
        VALUES ($1, $2)
        ON CONFLICT DO NOTHING`,
            [user, exerciseId]
        );

        res.status(201).json({ message: "Exercise added successfully", exercise: exerciseId });

    } catch (error) {

        console.error("Database error:", error);
        res.status(500).json({ error: "Internal server error" });

    }
})


router.get("/:userId/exercises/:exerciseId/volume-history", authMiddleware, async (req, res) => {

    try {
        const { userId, exerciseId } = req.params;

        const query = `
        SELECT 
            w.workout_date, 
            SUM(s.weight * s.reps) AS total_volume
        FROM workouts w
        JOIN workout_exercises we ON w.id = we.workout_id
        JOIN sets s ON we.id = s.workout_exercise_id
        WHERE w.user_id = $1 AND we.exercise_id = $2
        GROUP BY w.workout_date
        ORDER BY w.workout_date;
      `;

        const { rows } = await pool.query(query, [userId, exerciseId]);

        if (rows.length === 0) {
            return res.status(404).json({ error: "No workout history found" });
        }

        console.dir(rows);

        res.json(rows);

    } catch (err) {
        console.log(err);
    }
})

export default router;
