import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env file

const { Pool } = pkg;

// PostgreSQL Connection Pool
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 5432,
});

pool.on('connect', () => {
  console.log('Connected to PostgreSQL Database');
});
pool.on("error", (err) => {
  console.error("❌ PostgreSQL connection error:", err);
});


export default pool;


/**
 * END OF INPUT
 * 
 * 
 * 
 * 
 */