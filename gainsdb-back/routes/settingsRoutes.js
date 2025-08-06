import bcrypt from "bcrypt";
import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import pool from "../src/db.js";

const router = express.Router();


router.get('/:id/preferences', authMiddleware, async (req, res) => {
    const { id } = req.params;
    console.log(`Fetching settings for user ${id}`);

    try {
        const result = await pool.query(
            `SELECT 
        preferences
        FROM users WHERE id = $1;`,
            [id]
        );
        res.json(result.rows);
    } catch (err) {
        console.error("Database error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});



export default router;
