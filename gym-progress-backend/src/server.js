import express from 'express';
import cors from 'cors';
import pool from './db.js'; // PostgreSQL connection
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables

const app = express();
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json()); // Allows JSON data in requests
app.use(cookieParser()); // Enables parsing cookies

const SECRET_KEY = process.env.JWT_SECRET || "fake"; // Store securely in .env


const authMiddleware = (req, res, next) => {
  const token = req.cookies.auth_token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded; // Attach user info
    next();
  } catch (error) {
    return res.status(403).json({ message: "Forbidden: Invalid token" });
  }
};




// Test Route
app.get('/', (req, res) => {
  res.send('Server is running!');
});


// Protected
app.get("/api/dashboard", authMiddleware, (req, res) => {
  res.json({ message: "Welcome to the dashboard", user: (req).user });
});




//* Register New User
app.post("/api/register", async (req, res) => {
  const { username, password } = req.body;

  const normalizedUsername = username.toLowerCase();

  try {

    // check if username already exists
    const existingUser = await pool.query("SELECT id FROM users WHERE username = $1", [normalizedUsername]);

    if (existingUser.rows.length > 0) {
      return res.status(400).json({error: "That username is taken"});
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insert new user
    const result = await pool.query(
      "INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id;",
      [normalizedUsername, hashedPassword]
    );

    const userId = result.rows[0].id;

    // JWT token
    const token = jwt.sign({ userId, username: normalizedUsername }, SECRET_KEY, { expiresIn: "1hr" });

    // set token to cookie
    res.cookie("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
    });
    
    res.status(201).json({ message: "User registered successfully!", user: { id: userId, username: normalizedUsername } });

  } catch(e) {
    console.error("Registration error");
    console.error(e);
    res.status(500).json({ error: "Server error" });
  }
});





//* Login User (Generate JWT)
app.post("/api/login", async (req, res) => {
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
      console.log("🤔🤔🤔 Correct credentials");
    }

    // Generate JWT
    const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.json({ id: user.id, username: user.username, token }); // ✅ Ensure token is returned
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});






//* Logout User (Clear Cookie)
app.post("/api/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out successfully!" });
});





//* Fetch exercises
app.get("/api/exercises", authMiddleware, async (req, res) => {
  try {
    const result = await pool.query("SELECT name FROM exercises");
    console.log("Database Response:", result.rows); // 🔍 Debugging
    res.json(result.rows); // ✅ Sends an array
  } catch (e) {
    console.error("Database Error:", e);
    res.status(500).json({ error: "Server Error", details: e.message });
  }
});






// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
