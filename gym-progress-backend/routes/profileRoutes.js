import bcrypt from "bcrypt";
import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import pool from "../src/db.js";

const router = express.Router();


//* Get Profile info
router.get('/:id/profile', authMiddleware, async (req, res) => {
    const { id } = req.params;
    console.log(`Fetching profile data for user ${id}`);

    try {
        const result = await pool.query(
            `SELECT 
        username,
        created_on,
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



//* Update custom name
router.post('/:id/custom-name', authMiddleware, async (req, res) => {
    const { id } = req.params;
    const { newCustomName } = req.body;

    if (!newCustomName) {
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
            `UPDATE users 
            SET custom_name = $1 
            WHERE id = $2 RETURNING *`,
            [newCustomName, id]
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



//* update username 
router.post('/:id/username', authMiddleware, async (req, res) => {
    const { id } = req.params;
    const { newUsername } = req.body;

    if (!newUsername) {
        return res.status(400).json({ error: 'New username is required' });
    }

    // Ensure the authenticated user is updating their own name
    if (req.user.id !== parseInt(id, 10)) {
        return res.status(403).json({ error: "You are not authorized to update this username" });
    }

    let client;
    try {
        client = await pool.connect();

        const result = await client.query(
            `UPDATE users
            SET username = $1 
            WHERE id = $2 
            RETURNING *`,
            [newUsername, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ message: "You now have a new username!", user: result.rows[0] });
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({ error: 'Server error' });
    } finally {
        if (client) client.release(); // Always release connection
    }
});



//* update password 
router.post('/:id/password', authMiddleware, async (req, res) => {
    const { id } = req.params;
    const { newPassword } = req.body;

    if (!newPassword) {
        return res.status(400).json({ error: 'New password is required' });
    }

    // Ensure the authenticated user is updating their own name
    if (req.user.id !== parseInt(id, 10)) {
        return res.status(403).json({ error: "You are not authorized to update this password" });
    }

    let client;
    try {

        const saltRounds = 10; // Adjust for security (higher = slower hashing)
        const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

        client = await pool.connect();

        const result = await client.query(
            `UPDATE users
            SET password = $1 
            WHERE id = $2 
            RETURNING *`,
            [hashedNewPassword, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ message: "Use your new password responsibly!", user: result.rows[0] });
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({ error: 'Server error' });
    } finally {
        if (client) client.release(); 
    }
});



export default router;