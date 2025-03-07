import express, { query } from 'express';
import workoutProcessing from './workoutProcessing.js';
import cors from 'cors';
import pool from './db.js'; // PostgreSQL connection
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import exerciseCategorizer from './exerciseCatagories.js';

dotenv.config(); // Load environment variables

const app = express();
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json()); // Allows JSON data in requests
app.use(cookieParser()); // Enables parsing cookies

const SECRET_KEY = process.env.JWT_SECRET || "fake"; // Store securely in .env


const authMiddleware = (req, res, next) => {
  // Get the token from the request headers or cookies
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    console.error("❌ No token provided");
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  } else {
    console.log("Token recieved: " + token.length + " characters");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('decoded:', decoded)
    req.user = decoded;
    next(); // 
  } catch (error) {
    console.error("❌ Invalid token:", error);
    return res.status(403).json({ message: "Forbidden: Invalid token" });
  }
};

const normalizeExercise = exercise => {
  exercise = exercise.toLowerCase();
  exercise = exercise.replace(/[!@#$%^&*{}:-_]/g, ' ')
  exercise = exercise.trim();
  return exercise;
}





//* Test Route
app.get('/', (req, res) => {
  res.send('Server is running!');
});



/**
 * PROTECTED ROUTES
 */

//* Dashboard
app.get("/api/user/:userId/dashboard", authMiddleware, async (req, res) => {

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
    `SELECT FROM workouts WHERE user_id = $1`, [userId]
  );
  const totalWorkouts = numWorkouts.rows.length;


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



//* Fetch exercises
app.get("/api/user/:userId/exercises", authMiddleware, async (req, res) => {
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



app.get("/api/user/:userId/exercises/:exerciseId/latest-workout", authMiddleware, async (req, res) => {
  try {
    const { userId, exerciseId } = req.params; // ✅ Get userId from URL

    const query = `
          WITH RecentWorkout AS (
              SELECT we.id AS workout_exercise_id, w.id AS workout_id, w.workout_date, w.user_id
              FROM workout_exercises we
              JOIN workouts w ON we.workout_id = w.id
              WHERE we.exercise_id = $1 AND w.user_id = $2 -- ✅ Filter by user
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

    const { rows } = await pool.query(query, [exerciseId, userId]); // ✅ Pass userId

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



app.get("/api/user/:userId/history", authMiddleware, async (req, res) => {
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




app.post("/api/user/:userId/log-workout", authMiddleware, async (req, res) => {
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




//* NEW EXERCISE
app.post("/api/user/:userId/exercises", authMiddleware, async (req, res) => {
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


app.get("/api/user/:userId/exercises/:exerciseId/volume-history", authMiddleware, async (req, res) => {

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


/**
 * END PROTECTED ROUTES
 */





//* Register New User
app.post("/api/register", async (req, res) => {
  const { username, password, date } = req.body;

  const normalizedUsername = username.toLowerCase();

  try {

    // check if username already exists
    const existingUser = await pool.query("SELECT id FROM users WHERE username = $1", [normalizedUsername]);

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: "That username is taken" });
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insert new user
    const result = await pool.query(
      "INSERT INTO users (username, password, created_on) VALUES ($1, $2, $3) RETURNING id;",
      [normalizedUsername, hashedPassword, date]
    );

    const userId = result.rows[0].id;

    // JWT token
    const token = jwt.sign({ userId, username: normalizedUsername }, SECRET_KEY, { expiresIn: "3hr" });

    // set token to cookie
    res.cookie("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
    });

    res.status(201).json({ message: "User registered successfully!", user: { id: userId, username: normalizedUsername } });

  } catch (e) {
    console.error("Registration error");
    console.error(e);
    res.status(500).json({ error: "Server error" });
  }
});





//* Login User (Generate JWT)
app.post("/api/login", async (req, res) => {
  console.log("attempting login");
  const { username, password } = req.body;

  try {
    const userResult = await pool.query("SELECT * FROM users WHERE username = $1", [username.toLowerCase()]);

    if (userResult.rows.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const user = userResult.rows[0];
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({ error: "Invalid credentials" });
    } else {
      console.log("Login successful");
    }

    // Generate JWT
    const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: "3h" });

    res.cookie("auth_token", token, {
      httpOnly: true, // Prevents JavaScript access (mitigates XSS)
      secure: process.env.NODE_ENV === "production", // Use only in HTTPS in production
      sameSite: "strict" // Protects against CSRF attacks
    });

    res.json({ id: user.id, username: user.username, token }); 
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});



// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));