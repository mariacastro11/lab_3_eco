
import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

async function listColumns() {
  console.log("Listing columns for table 'orders'...");
  try {
    const res = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'orders'
    `);
    console.log("Columns:", res.rows);
  } catch (err) {
    console.error("DB ERROR:", err);
  } finally {
    await pool.end();
  }
}

listColumns();
