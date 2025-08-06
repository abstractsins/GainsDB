import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import pool from "../src/db.js";

const router = express.Router();

//* Dashboard
router.get("/:userId/dashboard", authMiddleware, async (req, res) => {

    const { userId } = req.params;
    console.log('Fetching Dashboard for user ' + userId);


    //* TOTAL WEEKS
    const numWeeks = await pool.query(
        `SELECT COUNT(DISTINCT DATE_TRUNC('week', workout_date)) AS total_weeks 
      FROM workouts WHERE user_id = $1`,
        [userId]
    );
    const totalWeeks = Number(numWeeks.rows[0]['total_weeks']);


    //* TOTAL WORKOUTS
    const numWorkouts = await pool.query(
        `SELECT COUNT(*) AS total_workouts FROM workouts WHERE user_id = $1`, 
        [userId]
    );
    const totalWorkouts = numWorkouts.rows[0].total_workouts;
    


    //* MOST LOGGED
    const mostLogged = await pool.query(
        `SELECT 
          e.id AS exercise_id, 
          e.name AS exercise_name, 
      COUNT(we.exercise_id) AS log_count
      FROM workout_exercises we
      JOIN workouts w ON we.workout_id = w.id
      JOIN exercises e ON we.exercise_id = e.id
      WHERE w.user_id = $1 
      GROUP BY e.id, e.name
      ORDER BY log_count DESC;`,
        [userId]
    );
    const mostLoggedExe = mostLogged.rows


    //* MOST WEIGHT
    const mostWeight = await pool.query(
        `SELECT 
          e.id AS exercise_id, 
          e.name AS exercise_name, 
          MAX(s.weight) AS max_weight
      FROM sets s
      JOIN workout_exercises we ON s.workout_exercise_id = we.id
      JOIN workouts w ON we.workout_id = w.id
      JOIN exercises e ON we.exercise_id = e.id
      WHERE w.user_id = $1
      GROUP BY e.id, e.name
      ORDER BY max_weight DESC;`,
        [userId]
    );
    const theMostWeight = mostWeight.rows;


    //* MOST CHANGE
    const mostChange = await pool.query(
        `WITH VolumeProgress AS (
          SELECT 
              we.exercise_id, 
              e.name AS exercise_name,
              MIN(SUM(s.weight * s.reps)) OVER(PARTITION BY we.exercise_id) AS min_volume,  
              MAX(SUM(s.weight * s.reps)) OVER(PARTITION BY we.exercise_id) AS max_volume  
          FROM sets s
          JOIN workout_exercises we ON s.workout_exercise_id = we.id
          JOIN workouts w ON we.workout_id = w.id
          JOIN exercises e ON we.exercise_id = e.id
          WHERE w.user_id = $1
          GROUP BY we.exercise_id, e.name, w.workout_date
      )
      SELECT 
          exercise_id, 
          exercise_name, 
          min_volume, 
          max_volume, 
          (max_volume - min_volume) AS volume_change
      FROM VolumeProgress
      WHERE min_volume IS NOT NULL AND max_volume IS NOT NULL
      ORDER BY volume_change DESC LIMIT 1;`,
        [userId]
    )
    const mostVolumeChange = mostChange.rows;



    const dashboardObj = {
        totalWorkouts,
        totalWeeks,
        mostLoggedExe,
        theMostWeight,
        mostVolumeChange
    }

    res.json(dashboardObj);
});

export default router;