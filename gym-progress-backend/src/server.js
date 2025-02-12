import express from 'express';
import cors from 'cors';
import pool from './db.js'; // PostgreSQL connection

const app = express();
app.use(cors());
app.use(express.json()); // Allows JSON data in requests

// Test Route
app.get('/', (req, res) => {
  res.send('Server is running!');
});

// Fetch all workouts
app.get('/api/workouts', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM workouts');
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
