import pg from "pg";
const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.SUPABASE_DB_URL || "postgresql://postgres.msspatxajhuyjudjkihv:18062026@comfortgirlspg.live@aws-1-ap-northeast-2.pooler.supabase.com:6543/postgres",
  ssl: { rejectUnauthorized: false }
});

async function clear() {
  try {
    await pool.query("DELETE FROM rooms");
    console.log("Rooms cleared from Supabase.");
  } catch (err) {
    console.error("Error clearing rooms:", err);
  } finally {
    process.exit(0);
  }
}
clear();
