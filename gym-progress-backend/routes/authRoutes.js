import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "../src/db.js";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();
const SECRET_KEY = process.env.JWT_SECRET || "fake";

//* Register New User
router.post("/register", async (req, res) => {
  const { username, password, date } = req.body;
  const normalizedUsername = username.toLowerCase();

  try {
    const existingUser = await pool.query("SELECT id FROM users WHERE username = $1", [normalizedUsername]);

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: "That username is taken" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      "INSERT INTO users (username, password, created_on) VALUES ($1, $2, $3) RETURNING id;",
      [normalizedUsername, hashedPassword, date]
    );

    const userId = result.rows[0].id;
    const token = jwt.sign({ userId, username: normalizedUsername }, SECRET_KEY, { expiresIn: "1m" });

    res.cookie("auth_token", token, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "Strict" });

    res.status(201).json({ message: "User registered successfully!", user: { id: userId, username: normalizedUsername } });
  } catch (e) {
    console.error("Registration error", e);
    res.status(500).json({ error: "Server error" });
  }
});



//* Login User (Generate JWT)
router.post("/login", async (req, res) => {
  console.log("Attempting login");
  const { username, password } = req.body;

  try {
    const userResult = await pool.query("SELECT * FROM users WHERE username = $1", [username.toLowerCase()]);
    if (userResult.rows.length === 0) return res.status(401).json({ error: "Invalid credentials" });

    const user = userResult.rows[0];
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, { expiresIn: "3hr" });

    res.cookie("auth_token", token, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict" });
    res.json({ id: user.id, username: user.username, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/verify-token", (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).send("No token");

  const token = authHeader.split(" ")[1];
  try {
    jwt.verify(token, SECRET_KEY);
    res.send("Token valid");
    var date = new Date();
    console.log("Token valid " + date);
  } catch (err) {
    res.status(401).send("Token expired or invalid");
  }
});


export default router;
