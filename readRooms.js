import pg from "pg";
const { Pool } = pg;

const pool = new Pool({
  connectionString: "postgresql://postgres.msspatxajhuyjudjkihv:18062026@comfortgirlspg.live@aws-1-ap-northeast-2.pooler.supabase.com:6543/postgres",
  ssl: { rejectUnauthorized: false }
});

async function read() {
  try {
    const res = await pool.query("SELECT * FROM rooms");
    console.log("Rooms count:", res.rows.length);
    if (res.rows.length > 0) {
      console.log("First room image:", res.rows[0].images);
      console.log("First room price:", res.rows[0].price);
    }
  } catch (err) {
    console.error("Error:", err);
  } finally {
    process.exit(0);
  }
}
read();
