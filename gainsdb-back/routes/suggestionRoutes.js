import authMiddleware from "../middleware/authMiddleware.js";
import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "../src/db.js";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();
const SECRET_KEY = process.env.JWT_SECRET || "fake";

// post suggestion
router.post("/suggestions", authMiddleware, async (req, res) => {
    const { date, name, suggestion } = req.body;

    try {
        const result = await pool.query(`INSERT INTO suggestions (date, name, suggestion) VALUES ($1, $2, $3);`, [date, name, suggestion]);
        res.json(result.rows);
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({ error: "Internal server error" });
    }

});


router.get("/suggestions", authMiddleware, async (req, res) => {

    try {
        const result = await pool.query(`SELECT * FROM suggestions ORDER BY id DESC`);
        res.json(result.rows);
    } catch (err) {
        console.error("Database error:", err);
        res.status(500).json({ error: "Internal server error" });
    }

});


export default router;