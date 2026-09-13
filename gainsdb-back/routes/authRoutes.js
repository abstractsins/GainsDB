import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../src/prisma.js";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();
const SECRET_KEY = process.env.JWT_SECRET || "fake";

//* Register New User
router.post("/register", async (req, res) => {
  const { username, password, date } = req.body;
  const normalizedUsername = username.toLowerCase();

  console.log(">>> Attempting registration, user:  " + username);

  try {
    const existingUser = await prisma.users.findUnique({
      where: {
        username: normalizedUsername,
      },
      select: {
        id: true,
      },
    });

    if (existingUser) {
      console.error("❌ Registration unsuccessful, username already exists");
      return res
        .status(400)
        .json({ status: 400, error: "That username is taken" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const createdUser = await prisma.users.create({
      data: {
        username: normalizedUsername,
        password: hashedPassword,
        created_on: date ? new Date(date) : null,
      },
      select: {
        id: true,
      },
    });

    const userId = createdUser.id;
    const token = jwt.sign(
      { userId, username: normalizedUsername },
      SECRET_KEY,
      { expiresIn: "1m" },
    );

    console.warn("✅ Registration successful. New user Id: " + userId);

    res.cookie("auth_token", token, {
      httpOnly: true,
      secure: process.env.ENVIRONMENT === "production",
      sameSite: "Strict",
    });

    res.status(201).json({
      status: 201,
      message: "User registered successfully! You may now log in.",
      user: { id: userId, username: normalizedUsername },
    });
  } catch (e) {
    console.error("❌ Registration unsuccessful: ", e);
    res.status(500).json({ status: 500, error: "Server error" });
  }
});

//* Login User (Generate JWT)
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  console.log(">>> Attempting login, user: " + username);

  try {
    const user = await prisma.users.findUnique({
      where: {
        username: username.toLowerCase(),
      },
    });

    if (!user) {
      console.error("❌ Login unsuccessful, username not found");
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      console.error("❌ Login unsuccessful, invalid credentials");
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username },
      SECRET_KEY,
      { expiresIn: "1hr" },
    );

    res.cookie("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
    res.json({ id: user.id, username: user.username, token });
    console.log("✅ Login successful");
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
