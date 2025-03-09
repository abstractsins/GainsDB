import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "../src/db.js";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();
const SECRET_KEY = process.env.JWT_SECRET || "fake_secret_key";

//* Register New User
router.post("/register", async (req, res) => {
  const { username, password, date } = req.body;
  const normalizedUsername = username.toLowerCase();

  try {
    // Check if username exists
    const existingUser = await pool.query("SELECT id FROM users WHERE username = $1", [normalizedUsername]);

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: "That username is taken" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user & initialize preferences with default JSON object
    const result = await pool.query(
      "INSERT INTO users (username, password, created_on, preferences) VALUES ($1, $2, $3, $4) RETURNING id, preferences;",
      [normalizedUsername, hashedPassword, date, JSON.stringify({ theme: "light", unit: "lbs" })]
    );

    const userId = result.rows[0].id;
    const preferences = result.rows[0].preferences;

    // Generate JWT token
    const token = jwt.sign({ userId, username: normalizedUsername }, SECRET_KEY, { expiresIn: "3h" });

    // Set auth cookie
    res.cookie("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict"
    });

    res.status(201).json({
      message: "User registered successfully!",
      user: { id: userId, username: normalizedUsername, preferences }
    });
  } catch (error) {
    console.error("Registration error", error);
    res.status(500).json({ error: "Server error" });
  }
});

//* Login User (Generate JWT)
router.post("/login", async (req, res) => {
  console.log("Attempting login");
  const { username, password } = req.body;

  try {
    // Fetch user by username (case-insensitive)
    const userResult = await pool.query(
      "SELECT id, username, password, preferences FROM users WHERE username = $1",
      [username.toLowerCase()]
    );

    if (userResult.rows.length === 0) {
      console.log('error: "userResult.rows.length === 0"');
      return res.status(401).json({ error: "userResult.rows.length === 0" });
    }

    const user = userResult.rows[0];

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      console.log('error: "error: "isValidPassword"');

      return res.status(401).json({ error: "isValidPassword" });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, { expiresIn: "3h" });

    // Set auth cookie
    res.cookie("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict"
    });

    res.json({
      message: "Login successful",
      user: { id: user.id, username: user.username, preferences: user.preferences },
      token
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Server error" });
  } finally {
    console.log('login success');
  }
});

//* Logout User
router.post("/logout", (req, res) => {
  res.clearCookie("auth_token");
  res.json({ message: "Logged out successfully" });
});

export default router;
