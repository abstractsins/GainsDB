import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import pool from "../src/db.js";
import workoutProcessing from "../utils/workoutProcessing.js";

const router = express.Router();

router.get("/:userId/history", authMiddleware, async (req, res) => {
    console.log(`:userId/history get request`);
    const { userId } = req.params;
    const timeframe = req.query.timeframe || "all"; // Default: all  
    const page = parseInt(req.query.page) || 1;
    const limit = timeframe === "all" ? 9 : null;
    const offset = limit ? (page - 1) * limit : null;

    console.log(`looking up workout history for user ${userId}`);
    console.log(`timeframe ${timeframe}`);

    let query, params = [userId];

    if (timeframe === "all") {
        query = `
            WITH PaginatedWorkouts AS (
                SELECT id AS workout_id, workout_date
                FROM workouts
                WHERE user_id = $1
                ORDER BY workout_date DESC
                LIMIT $2 OFFSET $3
            )
            SELECT 
                pw.workout_id, 
                pw.workout_date, 
                e.id AS exercise_id, 
                e.name AS exercise_name, 
                s.set_order, 
                s.weight, 
                s.reps
            FROM PaginatedWorkouts pw
            JOIN workout_exercises we ON pw.workout_id = we.workout_id
            JOIN exercises e ON we.exercise_id = e.id
            JOIN sets s ON we.id = s.workout_exercise_id
            ORDER BY pw.workout_date DESC, e.id, s.set_order;
        `;
        params.push(limit, offset);
    } else {
        let interval;
        switch (timeframe) {
            case "1w": interval = "7 days"; break;
            case "2w": interval = "14 days"; break;
            case "3w": interval = "21 days"; break;
            case "4w": interval = "28 days"; break;
            case "5w": interval = "35 days"; break;
            case "6w": interval = "42 days"; break;
            default: return res.status(400).json({ error: "Invalid timeframe" });
        }

        query = `
        SELECT 
            w.id AS workout_id, 
            w.workout_date, 
            e.id AS exercise_id, 
            e.name AS exercise_name, 
            s.set_order, 
            s.weight, 
            s.reps
        FROM workouts w
        JOIN workout_exercises we ON w.id = we.workout_id
        JOIN exercises e ON we.exercise_id = e.id
        JOIN sets s ON we.id = s.workout_exercise_id
        WHERE w.user_id = $1 
        AND w.workout_date >= NOW() - INTERVAL '${interval}'
        ORDER BY w.workout_date DESC, e.id, s.set_order;
      `;
    }

    try {
        const result = await pool.query(query, params);
        let totalPages = 1;
        let totalWorkouts = 0;
        const workoutsRefined = workoutProcessing(result.rows);

        if (timeframe === "all") {
            const totalResult = await pool.query(`SELECT COUNT(*) FROM workouts WHERE user_id = $1`, [userId]);
            totalWorkouts = parseInt(totalResult.rows[0].count);
            totalPages = Math.ceil(totalWorkouts / limit);
        } else {
            // console.log(result.rows);
            totalWorkouts = workoutsRefined.dates.length;
        }

        if (result.rows.length === 0) {
            return res.status(200).json({ message: "No workouts found for this user" });
        }


        // console.dir(workoutsRefined, { depth: null, colors: true });

        res.json({
            workouts: workoutsRefined,
            totalWorkouts,
            totalPages,
            currentPage: page
        } || []);
    } catch (error) {
        console.error('💩💩💩 Something went wrong ¯\_(ツ)_/¯');
        console.error(error);
    }

});


router.post("/:userId/log-workout", authMiddleware, async (req, res) => {
    console.log("post attempt");
    const { userId } = req.params;
    const { workoutDate, exercise, weight, reps } = req.body;
    const normalizedExercise = exercise.toLowerCase();

    console.log(`Logging exercise set for user ${userId}`);

    if (!workoutDate || !exercise || !weight || !reps) {
        return res.status(400).json({ error: "All fields are required" });
    }

    const client = await pool.connect();

    try {

        await client.query("BEGIN");

        // Check for workout ID
        let workoutResult = await client.query(
            "SELECT id FROM workouts WHERE user_id = $1 AND workout_date = $2;",
            [userId, workoutDate]
        )

        let workoutId = workoutResult.rows.length ? workoutResult.rows[0].id : null;

        if (!workoutId) {
            workoutResult = await client.query(
                "INSERT INTO workouts (user_id, workout_date) VALUES ($1, $2) RETURNING id;",
                [userId, workoutDate]
            );
            workoutId = workoutResult.rows[0].id;
        }


        // Check for exercise
        let exerciseResult = await client.query("SELECT id FROM exercises WHERE name = $1;", [normalizedExercise]);
        let exerciseId = exerciseResult.rows.length ? exerciseResult.rows[0].id : null;

        if (!exerciseId) {
            exerciseResult = await client.query("INSERT INTO exercises (name) VALUES ($1) RETURNING id;", [normalizedExercise]);
            exerciseId = exerciseResult.rows[0].id;
        }


        // Workout exercise link
        let workoutExerciseResult = await client.query(
            "SELECT id FROM workout_exercises WHERE workout_id = $1 AND exercise_id = $2;",
            [workoutId, exerciseId]
        );
        let workoutExerciseId = workoutExerciseResult.rows.length ? workoutExerciseResult.rows[0].id : null;

        if (!workoutExerciseId) {
            workoutExerciseResult = await client.query(
                "INSERT INTO workout_exercises (workout_id, exercise_id) VALUES ($1, $2) RETURNING id;",
                [workoutId, exerciseId]
            )
            workoutExerciseId = workoutExerciseResult.rows[0].id;
        }


        // Find next set order for workout
        const setOrderResult = await client.query(
            "SELECT COUNT(*) AS set_count FROM sets WHERE workout_exercise_id = $1;",
            [workoutExerciseId]
        )
        const setOrder = parseInt(setOrderResult.rows[0].set_count, 10) + 1;

        // insert set
        await client.query(
            "INSERT INTO sets (workout_exercise_id, weight, reps, set_order) VALUES ($1, $2, $3, $4);",
            [workoutExerciseId, weight, reps, setOrder]
        );


        await client.query("COMMIT");
        res.status(201).json({ message: "Workout set logged successfuly! LETS GOOOO!", setOrder })

    } catch (error) {
        await client.query("ROLLBACK");
        console.error('Database error: ' + error);
        res.status(500).json({ error: "Internal server error trying to POST" });

    } finally {
        client.release();
    }
});


export default router;
