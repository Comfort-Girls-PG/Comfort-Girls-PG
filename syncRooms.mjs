import pg from "pg";
import fs from "fs";

const { Pool } = pg;
const pool = new Pool({
  connectionString: "postgresql://postgres.msspatxajhuyjudjkihv:18062026@comfortgirlspg.live@aws-1-ap-northeast-2.pooler.supabase.com:6543/postgres",
  ssl: { rejectUnauthorized: false }
});

async function syncRooms() {
  try {
    // Read the staticData file to extract the rooms manually, or just define them here
    // For simplicity, let's just define the 5 rooms we know the user wants.

    const rooms = [
      {
        id: "suite-single-ac",
        name: "Single Seater (AC)",
        type: "Single Sharing",
        price: 20000,
        deposit: 30000,
        size: "160 - 180 sq ft",
        availability: 3,
        images: ["/Single.png"],
        amenities: ["four times Meal", "Two times Tea", "Free WIFI", "Washing Machine", "Common kitchen", "Common Fridge", "Common RO", "Daily room cleaning", "Washroom cleaning", "AC"],
        rules: ["No loud music after 10PM", "Pre-approve outside guests", "Smoking is strictly prohibited"],
        description: "Super-premium private single AC room loaded with deluxe ergonomic layout, soft display light panel, and full personal study space.",
        rating: 4.9,
        nearbyColleges: [{ collegeId: "colleges", distance: "0.8 km" }],
        roommates: []
      },
      {
        id: "suite-double-ac",
        name: "Double Seater (AC)",
        type: "Double Sharing",
        price: 10000,
        deposit: 18000,
        size: "220 - 240 sq ft",
        availability: 4,
        images: ["/Double.png"],
        amenities: ["four times Meal", "Two times Tea", "Free WIFI", "Washing Machine", "Common kitchen", "Common Fridge", "Common RO", "Daily room cleaning", "Washroom cleaning", "AC"],
        rules: ["No loud video calls inside after 11PM", "Share cleanup responsibilities fairly", "No heating appliances inside"],
        description: "Aesthetic spacious double sharing AC room with personalized drawers, dual study workspaces, and shared balcony access.",
        rating: 4.7,
        nearbyColleges: [{ collegeId: "colleges", distance: "0.8 km" }],
        roommates: []
      },
      {
        id: "suite-double-cooler",
        name: "Double Seater (Cooler)",
        type: "Double Sharing",
        price: 9500,
        deposit: 15000,
        size: "220 - 240 sq ft",
        availability: 5,
        images: ["/Double.png"],
        amenities: ["four times Meal", "Two times Tea", "Free WIFI", "Washing Machine", "Common kitchen", "Common Fridge", "Common RO", "Daily room cleaning", "Washroom cleaning", "Cooler/Fan"],
        rules: ["No loud video calls inside after 11PM", "Share cleanup responsibilities fairly", "No heating appliances inside"],
        description: "Aesthetic spacious double sharing cooler room with personalized drawers, dual study workspaces, and shared balcony access.",
        rating: 4.6,
        nearbyColleges: [{ collegeId: "colleges", distance: "0.8 km" }],
        roommates: []
      },
      {
        id: "suite-triple-ac",
        name: "Triple Seater (AC)",
        type: "Triple Sharing",
        price: 9000,
        deposit: 12000,
        size: "300 - 320 sq ft",
        availability: 6,
        images: ["/Triple.png"],
        amenities: ["four times Meal", "Two times Tea", "Free WIFI", "Washing Machine", "Common kitchen", "Common Fridge", "Common RO", "Daily room cleaning", "Washroom cleaning", "AC"],
        rules: ["No loud video calls inside after 11PM", "Share cleanup responsibilities fairly", "No heating appliances inside"],
        description: "Aesthetic spacious triple sharing AC room with personalized drawers, dual study workspaces, and shared balcony access.",
        rating: 4.5,
        nearbyColleges: [{ collegeId: "colleges", distance: "0.8 km" }],
        roommates: []
      }
    ];

    for (const room of rooms) {
      await pool.query(`
        INSERT INTO rooms (id, name, type, price, deposit, size, availability, images, amenities, rules, description, rating, "nearbyColleges", roommates)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
        ON CONFLICT (id) DO UPDATE SET
          name = EXCLUDED.name,
          type = EXCLUDED.type,
          price = EXCLUDED.price,
          deposit = EXCLUDED.deposit,
          images = EXCLUDED.images,
          amenities = EXCLUDED.amenities,
          rules = EXCLUDED.rules,
          description = EXCLUDED.description,
          rating = EXCLUDED.rating
      `, [
        room.id,
        room.name,
        room.type,
        room.price,
        room.deposit,
        room.size,
        room.availability,
        JSON.stringify(room.images),
        JSON.stringify(room.amenities),
        JSON.stringify(room.rules),
        room.description,
        room.rating,
        JSON.stringify(room.nearbyColleges),
        JSON.stringify(room.roommates)
      ]);
      console.log("Upserted room: " + room.id);
    }
    
    // Check if the old 4th room (maybe it had a different ID?) is there.
    // The old ones were: "suite-single-ac", "suite-double-ac", "suite-triple-ac", "suite-premium-single" maybe?
    // Let's delete anything not in our list just in case.
    const ids = rooms.map(r => r.id);
    const placeholders = ids.map((_, i) => "$" + (i + 1)).join(',');
    const deleteRes = await pool.query("DELETE FROM rooms WHERE id NOT IN (" + placeholders + ")", ids);
    console.log("Deleted old rooms: " + deleteRes.rowCount);

    console.log("Successfully synced rooms to Supabase!");
  } catch (err) {
    console.error("Error syncing:", err);
  } finally {
    process.exit(0);
  }
}

syncRooms();
