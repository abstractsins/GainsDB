import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import pool from "../src/db.js";

const router = express.Router();


router.get('/:id/profile', authMiddleware, async (req, res) => {
    const { id } = req.params;
    console.log(`Fetching profile data for user ${id}`);

    try {
        const result = await pool.query(
            `SELECT 
        username,
        custom_name 
        FROM users WHERE id = $1;`,
            [id]
        );
        res.json(result.rows);
    } catch (err) {
        console.error("Database error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});


// Update custom name
router.post('/:id/custom-name', authMiddleware, async (req, res) => {
    const { id } = req.params;
    const { customName } = req.body;

    if (!customName) {
        return res.status(400).json({ error: 'Custom name is required' });
    }

    // Ensure the authenticated user is updating their own name
    if (req.user.id !== parseInt(id, 10)) {
        return res.status(403).json({ error: "You are not authorized to update this user's name" });
    }

    let client;
    try {
        client = await pool.connect(); // Get connection from pool

        const result = await client.query(
            'UPDATE users SET custom_name = $1 WHERE id = $2 RETURNING *',
            [customName, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ message: "Custom name updated successfully dude!", user: result.rows[0] });
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({ error: 'Server error' });
    } finally {
        if (client) client.release(); // Always release connection
    }
});

export default router;
