import fs from "fs";
import path from "path";
import pg from "pg";
import bcrypt from "bcryptjs";

const { Pool } = pg;

// We save fallback JSON files inside src/db/data, or in /tmp if running in a serverless environment
const isServerless = !!(
  process.env.VERCEL || 
  process.env.AWS_LAMBDA_FUNCTION_VERSION || 
  process.env.NETLIFY || 
  process.env.RENDER
);

const DATA_DIR = isServerless 
  ? path.join("/tmp", "comfort_pg_data") 
  : path.join(process.cwd(), "src", "db", "data");

try {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
} catch (err) {
  console.warn("Could not create local DATA_DIR:", err);
}

let pool: pg.Pool | null = null;
let usePostgres = false;
let isInitialized = false;

function getPool(): pg.Pool | null {
  if (pool) return pool;
  if (!process.env.SUPABASE_DB_HOST) {
    return null;
  }
  try {
    pool = new Pool({
      host: process.env.SUPABASE_DB_HOST,
      port: Number(process.env.SUPABASE_DB_PORT || 5432),
      database: process.env.SUPABASE_DB_NAME,
      user: process.env.SUPABASE_DB_USER,
      password: process.env.SUPABASE_DB_PASSWORD,
      ssl: { rejectUnauthorized: false }, // Necessary for secure Supabase connections
      connectionTimeoutMillis: 5000,
    });
    pool.on("error", (err) => {
      console.error("PostgreSQL pool idle client error:", err);
    });
    console.log("Supabase Postgres connection pool initialized lazily.");
  } catch (error) {
    console.error("Failed to construct PostgreSQL database connection pool:", error);
  }
  return pool;
}

export const tableMetadata: { [tableName: string]: { [columnName: string]: string } } = {};

export async function initializeDatabase() {
  if (isInitialized) return;
  isInitialized = true;

  const activePool = getPool();
  if (!activePool) {
    console.log("No PostgreSQL host configured. Running app in Local File-based Persistence mode.");
    await seedLocalJsonDatabase();
    return;
  }
  try {
    // Quick echo query
    await activePool.query("SELECT 1");

    // Initialize required tables
    await activePool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255),
        email VARCHAR(255) UNIQUE,
        "passwordHash" VARCHAR(255),
        phone VARCHAR(255),
        college VARCHAR(255),
        avatar TEXT,
        "documentVerified" BOOLEAN DEFAULT false,
        status VARCHAR(255) DEFAULT 'Resident',
        "bookedRoomId" VARCHAR(255),
        notifications JSONB DEFAULT '[]'::jsonb,
        "emailVerified" BOOLEAN DEFAULT false,
        "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await activePool.query(`
      CREATE TABLE IF NOT EXISTS rooms (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255),
        type VARCHAR(255),
        price NUMERIC,
        deposit NUMERIC,
        size VARCHAR(255),
        availability INTEGER,
        images JSONB DEFAULT '[]'::jsonb,
        amenities JSONB DEFAULT '[]'::jsonb,
        rules JSONB DEFAULT '[]'::jsonb,
        description TEXT,
        rating NUMERIC DEFAULT 5.0,
        "nearbyColleges" JSONB DEFAULT '[]'::jsonb,
        roommates JSONB DEFAULT '[]'::jsonb,
        "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await activePool.query(`
      CREATE TABLE IF NOT EXISTS bookings (
        id VARCHAR(255) PRIMARY KEY,
        "userId" VARCHAR(255),
        "roomId" VARCHAR(255),
        "sharingType" VARCHAR(255),
        "scheduleVisitDate" VARCHAR(255),
        "documentType" VARCHAR(255),
        "documentUrl" TEXT,
        "paidAmount" NUMERIC,
        "couponCode" VARCHAR(255),
        "paymentMethod" VARCHAR(255),
        status VARCHAR(255) DEFAULT 'Pending',
        "invoiceNo" VARCHAR(255),
        "createdAt" VARCHAR(255)
      )
    `);

    await activePool.query(`
      CREATE TABLE IF NOT EXISTS visits (
        id SERIAL PRIMARY KEY,
        "userId" VARCHAR(255),
        date VARCHAR(255),
        time VARCHAR(255),
        reason TEXT,
        status VARCHAR(255) DEFAULT 'Scheduled'
      )
    `);

    await activePool.query(`
      CREATE TABLE IF NOT EXISTS complaints (
        id VARCHAR(255) PRIMARY KEY,
        "userId" VARCHAR(255),
        type VARCHAR(255),
        subject VARCHAR(255),
        details TEXT,
        status VARCHAR(255) DEFAULT 'Logged',
        urgency VARCHAR(255) DEFAULT 'Medium',
        "createdAt" VARCHAR(255),
        "resolvedAt" VARCHAR(255)
      )
    `);

    await activePool.query(`
      CREATE TABLE IF NOT EXISTS food_menus (
        id SERIAL PRIMARY KEY,
        day VARCHAR(255) UNIQUE,
        breakfast TEXT,
        lunch TEXT,
        snacks TEXT,
        dinner TEXT
      )
    `);

    // Fetch table metadata columns dynamically
    const res = await activePool.query(`
      SELECT table_name, column_name, data_type 
      FROM information_schema.columns 
      WHERE table_schema = 'public'
    `);

    for (const row of res.rows) {
      const tableName = row.table_name;
      const columnName = row.column_name;
      const dataType = row.data_type;

      if (!tableMetadata[tableName]) {
        tableMetadata[tableName] = {};
      }
      tableMetadata[tableName][columnName] = dataType;
    }

    usePostgres = true;
    console.log("Successfully connected to Supabase PostgreSQL database!");

    // Seed tables in Postgres
    await seedPostgresDatabase(activePool);

  } catch (err) {
    console.error("Warning: Unsuccessful connection to Supabase database. Falling back to local file storage.", err);
    usePostgres = false;
    await seedLocalJsonDatabase();
  }
}

export function getDbStatus() {
  return {
    connected: usePostgres,
    mode: usePostgres ? "PostgreSQL (Supabase)" : "Local JSON Files",
    configured: !!process.env.SUPABASE_DB_HOST
  };
}

const getTableName = (collectionName: string) => {
  if (collectionName === "foodMenus") return "food_menus";
  return collectionName.toLowerCase();
};

function mapRowToDoc<T>(row: any, colTypes: { [colName: string]: string }): T {
  const doc: any = {};
  for (const [colName, colType] of Object.entries(colTypes)) {
    let val = row[colName];
    if (val === undefined || val === null) {
      doc[colName] = null;
      continue;
    }
    if (colType === "jsonb") {
      if (typeof val === "string") {
        try {
          doc[colName] = JSON.parse(val);
        } catch {
          doc[colName] = val;
        }
      } else {
        doc[colName] = val;
      }
    } else if (colType === "integer") {
      doc[colName] = parseInt(val, 10);
    } else if (colType === "numeric") {
      doc[colName] = parseFloat(val);
    } else if (colType === "boolean") {
      doc[colName] = !!val;
    } else if (colType.startsWith("timestamp") && val instanceof Date) {
      doc[colName] = val.toISOString();
    } else {
      doc[colName] = val;
    }
  }
  if (doc.id !== undefined) {
    doc._id = doc.id;
  }
  return doc as T;
}

export class ModelInstance<T extends { id?: string; _id?: string }> {
  private filepath: string;

  constructor(private collectionName: string) {
    this.filepath = path.join(DATA_DIR, `${collectionName}.json`);
  }

  private read(): T[] {
    try {
      if (!fs.existsSync(this.filepath)) {
        return [];
      }
      const raw = fs.readFileSync(this.filepath, "utf-8");
      return JSON.parse(raw);
    } catch (e) {
      console.error(`Error reading database file ${this.collectionName}:`, e);
      return [];
    }
  }

  private write(data: T[]) {
    try {
      fs.writeFileSync(this.filepath, JSON.stringify(data, null, 2), "utf-8");
    } catch (e) {
      console.error(`Error writing database file ${this.collectionName}:`, e);
    }
  }

  async find(filter: Partial<T> = {}): Promise<T[]> {
    await initializeDatabase();
    const activePool = getPool();
    if (usePostgres && activePool) {
      try {
        const tableName = getTableName(this.collectionName);
        const colTypes = tableMetadata[tableName];
        if (!colTypes) throw new Error(`Metadata missing for table ${tableName}`);

        const whereClauses: string[] = [];
        const values: any[] = [];
        let index = 1;

        for (const [key, val] of Object.entries(filter)) {
          if (colTypes[key] !== undefined) {
            whereClauses.push(`"${key}" = $${index}`);
            
            const colType = colTypes[key];
            if (val !== null && (colType === 'jsonb' || typeof val === 'object')) {
              values.push(JSON.stringify(val));
            } else if (val !== null && colType === 'boolean') {
              values.push(!!val);
            } else if (val !== null && colType === 'integer') {
              values.push(parseInt(val as any, 10));
            } else if (val !== null && colType === 'numeric') {
              values.push(parseFloat(val as any));
            } else {
              values.push(val);
            }
            index++;
          }
        }

        let query = `SELECT * FROM "${tableName}"`;
        if (whereClauses.length > 0) {
          query += ` WHERE ${whereClauses.join(" AND ")}`;
        }

        const res = await activePool.query(query, values);
        const items = res.rows.map((row) => mapRowToDoc<T>(row, colTypes));
        
        return items.filter((item) => {
          for (const key in filter) {
            if (colTypes[key] === undefined) {
              const expectedValue = filter[key];
              const actualValue = (item as any)[key];
              if (actualValue !== expectedValue) {
                return false;
              }
            }
          }
          return true;
        });
      } catch (err) {
        console.error(`Postgres find error in ${this.collectionName}, falling back:`, err);
      }
    }

    const items = this.read();
    return items.filter((item) => {
      for (const key in filter) {
        if (item[key] !== filter[key]) {
          return false;
        }
      }
      return true;
    });
  }

  async findOne(filter: Partial<T>): Promise<T | null> {
    const results = await this.find(filter);
    return results.length ? results[0] : null;
  }

  async findById(id: string): Promise<T | null> {
    await initializeDatabase();
    const activePool = getPool();
    if (usePostgres && activePool) {
      try {
        const tableName = getTableName(this.collectionName);
        const colTypes = tableMetadata[tableName];
        if (!colTypes) throw new Error(`Metadata missing for table ${tableName}`);

        if (colTypes["id"] === "integer") {
          const parsed = parseInt(id, 10);
          if (isNaN(parsed)) return null;
        }
        const idValue = colTypes["id"] === "integer" ? parseInt(id, 10) : id;
        const res = await activePool.query(`SELECT * FROM "${tableName}" WHERE "id" = $1`, [idValue]);
        if (res.rows.length) {
          return mapRowToDoc<T>(res.rows[0], colTypes);
        }
        return null;
      } catch (err) {
        console.error(`Postgres findById error in ${this.collectionName}, falling back:`, err);
      }
    }

    const items = this.read();
    return items.find((item) => item.id === id || item._id === id) || null;
  }

  async create(data: Partial<T>): Promise<T> {
    await initializeDatabase();
    const id = data.id || `doc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newDoc = { ...data, id, _id: id } as unknown as T;

    const activePool = getPool();
    if (usePostgres && activePool) {
      try {
        const tableName = getTableName(this.collectionName);
        const colTypes = tableMetadata[tableName];
        if (!colTypes) throw new Error(`Metadata missing for table ${tableName}`);

        const columns: string[] = [];
        const placeholders: string[] = [];
        const values: any[] = [];
        let index = 1;

        for (const [colName, colType] of Object.entries(colTypes)) {
          let val = (newDoc as any)[colName];
          if (colName === 'id' && colType === 'integer') {
            const parsed = parseInt(val, 10);
            if (val === undefined || isNaN(parsed) || String(parsed) !== String(val).trim()) {
              continue;
            }
          }
          if (val === undefined) {
            val = null;
          }

          columns.push(`"${colName}"`);
          placeholders.push(`$${index}`);

          if (val !== null && (colType === 'jsonb' || typeof val === 'object')) {
            values.push(JSON.stringify(val));
          } else if (val !== null && colType === 'boolean') {
            values.push(!!val);
          } else if (val !== null && colType === 'integer') {
            values.push(parseInt(val, 10));
          } else if (val !== null && colType === 'numeric') {
            values.push(parseFloat(val));
          } else {
            values.push(val);
          }
          index++;
        }

        const hasIdInColumns = columns.includes('"id"');
        let query = `INSERT INTO "${tableName}" (${columns.join(", ")}) VALUES (${placeholders.join(", ")})`;
        if (hasIdInColumns) {
          const conflictCols = columns.filter((c) => c !== '"id"' && c !== '"createdAt"');
          const updateSet = conflictCols.map((c) => `${c} = EXCLUDED.${c}`).join(", ");
          if (updateSet.length > 0) {
            query += ` ON CONFLICT ("id") DO UPDATE SET ${updateSet}`;
          }
        }
        query += ` RETURNING *`;

        const res = await activePool.query(query, values);
        if (res.rows.length) {
          return mapRowToDoc<T>(res.rows[0], colTypes);
        }
        return newDoc;
      } catch (err) {
        console.error(`Postgres create error in ${this.collectionName}, falling back:`, err);
      }
    }

    const items = this.read();
    items.push(newDoc);
    this.write(items);
    return newDoc;
  }

  async findByIdAndUpdate(id: string, update: Partial<T>): Promise<T | null> {
    await initializeDatabase();
    const activePool = getPool();
    if (usePostgres && activePool) {
      try {
        const tableName = getTableName(this.collectionName);
        const colTypes = tableMetadata[tableName];
        if (!colTypes) throw new Error(`Metadata missing for table ${tableName}`);

        const updates: string[] = [];
        const values: any[] = [];
        let index = 1;

        for (const [colName, colType] of Object.entries(colTypes)) {
          if (colName === "id") continue;
          if ((update as any)[colName] === undefined) continue;

          updates.push(`"${colName}" = $${index}`);
          const val = (update as any)[colName];

          if (val !== null && (colType === 'jsonb' || typeof val === 'object')) {
            values.push(JSON.stringify(val));
          } else if (val !== null && colType === 'boolean') {
            values.push(!!val);
          } else if (val !== null && colType === 'integer') {
            values.push(parseInt(val, 10));
          } else if (val !== null && colType === 'numeric') {
            values.push(parseFloat(val));
          } else {
            values.push(val);
          }
          index++;
        }

        if (updates.length === 0) {
          return this.findById(id);
        }

        if (colTypes["id"] === "integer") {
          const parsed = parseInt(id, 10);
          if (isNaN(parsed)) return null;
        }
        const idValue = colTypes["id"] === "integer" ? parseInt(id, 10) : id;
        values.push(idValue);
        const query = `UPDATE "${tableName}" SET ${updates.join(", ")} WHERE "id" = $${index} RETURNING *`;
        const res = await activePool.query(query, values);
        if (res.rows.length) {
          return mapRowToDoc<T>(res.rows[0], colTypes);
        }
        return null;
      } catch (err) {
        console.error(`Postgres update error in ${this.collectionName}, falling back:`, err);
      }
    }

    const items = this.read();
    const idx = items.findIndex((item) => item.id === id || item._id === id);
    if (idx === -1) return null;
    const updated = { ...items[idx], ...update };
    items[idx] = updated;
    this.write(items);
    return updated;
  }

  async findByIdAndDelete(id: string): Promise<boolean> {
    await initializeDatabase();
    const activePool = getPool();
    if (usePostgres && activePool) {
      try {
        const tableName = getTableName(this.collectionName);
        const colTypes = tableMetadata[tableName];
        if (!colTypes) throw new Error(`Metadata missing for table ${tableName}`);

        if (colTypes["id"] === "integer") {
          const parsed = parseInt(id, 10);
          if (isNaN(parsed)) return false;
        }
        const idValue = colTypes["id"] === "integer" ? parseInt(id, 10) : id;
        const res = await activePool.query(`DELETE FROM "${tableName}" WHERE "id" = $1`, [idValue]);
        return (res.rowCount ?? 0) > 0;
      } catch (err) {
        console.error(`Postgres delete error in ${this.collectionName}, falling back:`, err);
      }
    }

    const items = this.read();
    const initialLen = items.length;
    const filtered = items.filter((item) => item.id !== id && item._id !== id);
    this.write(filtered);
    return filtered.length < initialLen;
  }
}

export const dbStore = {
  users: new ModelInstance<any>("users"),
  rooms: new ModelInstance<any>("rooms"),
  bookings: new ModelInstance<any>("bookings"),
  visits: new ModelInstance<any>("visits"),
  complaints: new ModelInstance<any>("complaints"),
  foodMenus: new ModelInstance<any>("foodMenus"),
};

// ==========================================
// SEEDING UTILITIES
// ==========================================

async function seedPostgresDatabase(activePool: pg.Pool) {
  try {
    // 1. Seed users
    const userCountRes = await activePool.query("SELECT COUNT(*) FROM users");
    if (parseInt(userCountRes.rows[0].count, 10) === 0) {
      const hashedAdminPassword = await bcrypt.hash("admin123", 10);
      const hashedStudentPassword = await bcrypt.hash("student123", 10);

      await activePool.query(`
        INSERT INTO users (id, name, email, "passwordHash", phone, college, avatar, "documentVerified", status, "bookedRoomId", "emailVerified")
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      `, ["usr-admin", "Admin", "contact@comfortgirlspg.live", hashedAdminPassword, "9876541201", "Comfort PG Warden Admin", "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150", true, "Admin", null, true]);

      await activePool.query(`
        INSERT INTO users (id, name, email, "passwordHash", phone, college, avatar, "documentVerified", status, "bookedRoomId", "emailVerified")
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      `, ["usr-student", "Sheel Ganvir", "student@comfortpg.com", hashedStudentPassword, "+91 77777 88888", "Symbiosis corridor", "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150", true, "Resident", "suite-double-ac", true]);
      console.log("Seeded Postgres users.");
    }

    // 2. Seed rooms
    const roomCountRes = await activePool.query("SELECT COUNT(*) FROM rooms");
    if (parseInt(roomCountRes.rows[0].count, 10) === 0) {
      const defaultRooms = getDefaultRoomArray();
      for (const room of defaultRooms) {
        await activePool.query(`
          INSERT INTO rooms (id, name, type, price, deposit, size, availability, images, amenities, rules, description, rating, "nearbyColleges", roommates)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
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
      }
      console.log("Seeded Postgres rooms.");
    }

    // 3. Seed food menus
    const foodMenuCountRes = await activePool.query("SELECT COUNT(*) FROM food_menus");
    if (parseInt(foodMenuCountRes.rows[0].count, 10) === 0) {
      const menuData = getFoodMenuArray();
      for (const item of menuData) {
        await activePool.query(`
          INSERT INTO food_menus (day, breakfast, lunch, snacks, dinner)
          VALUES ($1, $2, $3, $4, $5)
        `, [item.day, item.breakfast, item.lunch, item.snacks, item.dinner]);
      }
      console.log("Seeded Postgres food_menus.");
    }

    // 4. Seed complaints
    const complaintCountRes = await activePool.query("SELECT COUNT(*) FROM complaints");
    if (parseInt(complaintCountRes.rows[0].count, 10) === 0) {
      await activePool.query(`
        INSERT INTO complaints (id, "userId", type, subject, details, status, urgency, "createdAt")
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      `, ["CMP-01", "usr-student", "WiFi", "Slight jitter in evening hours", "Fiber's speed is dropping to 20Mbps. Warden working on router placement.", "Logged", "Medium", new Date().toISOString().split("T")[0]]);
      console.log("Seeded Postgres complaints.");
    }

    // 5. Seed bookings
    const bookingCountRes = await activePool.query("SELECT COUNT(*) FROM bookings");
    if (parseInt(bookingCountRes.rows[0].count, 10) === 0) {
      await activePool.query(`
        INSERT INTO bookings (id, "userId", "roomId", "sharingType", "scheduleVisitDate", "documentType", "documentUrl", "paidAmount", "couponCode", "paymentMethod", status, "invoiceNo", "createdAt")
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      `, ["BKG-99", "usr-student", "suite-double-ac", "Double Sharing", null, "Aadhaar Card", "https://example.com/dummy-aadhaar.pdf", 11000, "WELCOME", "UPI", "Active", "INV-8531", "2026-06-18"]);
      console.log("Seeded Postgres bookings.");
    }

  } catch (err) {
    console.error("Error seeding PostgreSQL database:", err);
  }
}

async function seedLocalJsonDatabase() {
  try {
    const users = await dbStore.users.find();
    if (users.length === 0) {
      const hashedAdminPassword = await bcrypt.hash("admin123", 10);
      const hashedStudentPassword = await bcrypt.hash("student123", 10);

      await dbStore.users.create({
        id: "usr-admin",
        name: "Admin",
        email: "contact@comfortgirlspg.live",
        passwordHash: hashedAdminPassword,
        phone: "9876541201",
        college: "Comfort PG Warden Admin",
        avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150",
        documentVerified: true,
        status: "Admin",
        bookedRoomId: null,
        emailVerified: true,
        notifications: [
          { id: "not-01", title: "Console Loaded", message: "Warden privilege keys authorized successfully.", date: new Date().toISOString().split("T")[0], read: false }
        ]
      });

      await dbStore.users.create({
        id: "usr-student",
        name: "Sheel Ganvir",
        email: "student@comfortpg.com",
        passwordHash: hashedStudentPassword,
        phone: "+91 77777 88888",
        college: "Symbiosis corridor",
        avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150",
        documentVerified: true,
        status: "Resident",
        bookedRoomId: "suite-double-ac",
        emailVerified: true,
        notifications: [
          { id: "not-02", title: "Room Allotted", message: "Your luxury room allotment is active! Safe stay journey activated.", date: new Date().toISOString().split("T")[0], read: false }
        ]
      });
    }

    const rooms = await dbStore.rooms.find();
    if (rooms.length === 0) {
      const defaultRooms = getDefaultRoomArray();
      for (const room of defaultRooms) {
        await dbStore.rooms.create(room);
      }
    }

    const food = await dbStore.foodMenus.find();
    if (food.length === 0) {
      const foodData = getFoodMenuArray();
      for (const item of foodData) {
        await dbStore.foodMenus.create(item);
      }
    }

    const complaints = await dbStore.complaints.find();
    if (complaints.length === 0) {
      await dbStore.complaints.create({
        id: "CMP-01",
        userId: "usr-student",
        type: "WiFi",
        subject: "Slight jitter in evening hours",
        details: "Fiber's speed is dropping to 20Mbps. Warden working on router placement.",
        status: "Logged",
        urgency: "Medium",
        createdAt: new Date().toISOString().split("T")[0]
      });
    }

    const bookings = await dbStore.bookings.find();
    if (bookings.length === 0) {
      await dbStore.bookings.create({
        id: "BKG-99",
        userId: "usr-student",
        roomId: "suite-double-ac",
        sharingType: "Double Sharing",
        scheduleVisitDate: null,
        documentType: "Aadhaar Card",
        documentUrl: "https://example.com/dummy-aadhaar.pdf",
        paidAmount: 11000,
        couponCode: "WELCOME",
        paymentMethod: "UPI",
        status: "Active",
        invoiceNo: "INV-8531",
        createdAt: "2026-06-18"
      });
    }
  } catch (err) {
    console.error("Local JSON database seeding failure:", err);
  }
}

function getDefaultRoomArray() {
  return [
    {
      id: "suite-single-ac",
      name: "Single Seater (AC)",
      type: "Single Sharing",
      price: 20000,
      deposit: 30000,
      priceRange: "₹20,000 - ₹28,000",
      depositRange: "₹30,000 - ₹40,000",
      size: "160 - 180 sq ft",
      availability: 3,
      images: [
        "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&q=80&w=800",
        "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&q=80&w=800",
        "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&q=80&w=800"
      ],
      amenities: ["four times Meal", "Two times Tea", "Free WIFI", "Washing Machine", "Common kitchen", "Common Fridge", "Common RO", "Daily room cleaning", "Washroom cleaning", "AC"],
      rules: ["No loud music after 10PM", "Pre-approve outside guests", "Smoking is strictly prohibited"],
      description: "Super-premium private single AC room loaded with deluxe ergonomic layout, soft display light panel, and full personal study space.",
      rating: 4.9,
      nearbyColleges: [
        { collegeId: "colleges", distance: "0.8 km" }
      ],
      roommates: []
    },
    {
      id: "suite-double-ac",
      name: "Double Seater (AC)",
      type: "Double Sharing",
      price: 11000,
      deposit: 18000,
      priceRange: "₹11,000 - ₹15,000",
      depositRange: "₹18,005 - ₹22,000",
      size: "220 - 240 sq ft",
      availability: 4,
      images: [
        "https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&q=80&w=800",
        "https://images.unsplash.com/photo-1560185127-6a2806647f81?auto=format&fit=crop&q=80&w=800"
      ],
      amenities: ["four times Meal", "Two times Tea", "Free WIFI", "Washing Machine", "Common kitchen", "Common Fridge", "Common RO", "Daily room cleaning", "Washroom cleaning", "AC"],
      rules: ["No loud video calls inside after 11PM", "Share cleanup responsibilities fairly", "No heating appliances inside"],
      description: "Aesthetic spacious double sharing AC room with personalized drawers, dual study workspaces, and shared balcony access.",
      rating: 4.7,
      nearbyColleges: [
        { collegeId: "colleges", distance: "0.8 km" }
      ],
      roommates: [
        { name: "Ananya Iyer", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150", college: "Business & Arts", hobbies: ["Reading", "Aviation", "Kathak"] }
      ]
    },
    {
      id: "suite-triple-ac",
      name: "Triple Seater (AC)",
      type: "Triple Sharing",
      price: 9000,
      deposit: 12000,
      priceRange: "₹9,000 - ₹11,000",
      depositRange: "₹12,000 - ₹15,000",
      size: "280 - 300 sq ft",
      availability: 6,
      images: [
        "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&q=80&w=800",
        "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&q=80&w=800"
      ],
      amenities: ["four times Meal", "Two times Tea", "Free WIFI", "Washing Machine", "Common kitchen", "Common Fridge", "Common RO", "Daily room cleaning", "Washroom cleaning", "AC"],
      rules: ["Lights out by 11:30 PM", "No visitors allowed overnight"],
      description: "High-comfort economic triple sharing AC room with daily deep sweep cleaning, high-speed internet, and dedicated study tables.",
      rating: 4.5,
      nearbyColleges: [
        { collegeId: "colleges", distance: "0.8 km" }
      ],
      roommates: [
        { name: "Priya Sharma", avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=150", college: "Medical & Allied", hobbies: ["Design", "Skating", "Blogging"] }
      ]
    },
    {
      id: "suite-triple-cooler",
      name: "Triple Seater (Cooler)",
      type: "Triple Sharing",
      price: 8500,
      deposit: 10000,
      priceRange: "₹8,500",
      depositRange: "₹10,000",
      size: "280 sq ft",
      availability: 8,
      images: [
        "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&q=80&w=800",
        "https://images.unsplash.com/photo-1560185127-6a2806647f81?auto=format&fit=crop&q=80&w=800"
      ],
      amenities: ["four times Meal", "Two times Tea", "Free WIFI", "Washing Machine", "Common kitchen", "Common Fridge", "Common RO", "Daily room cleaning", "Washroom cleaning", "Cooler/Fan"],
      rules: ["Regular housekeeping cooperation", "Warden permission for room assembly"],
      description: "Economical and extremely spacious non-AC room equipped with high-delivery desert cooler, direct air circulation, and spacious private Closets.",
      rating: 4.3,
      nearbyColleges: [
        { collegeId: "colleges", distance: "0.8 km" }
      ],
      roommates: [
        { name: "Sanya Roy", avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=150", college: "Management & Law", hobbies: ["Swimming", "Novels", "Sketching"] }
      ]
    }
  ];
}

function getFoodMenuArray() {
  return [
    {
      day: "Monday",
      breakfast: "Poha + Roti + Sabji (8:00 – 9:30 AM)",
      lunch: "Rice & Roti, Soyabean Aloo Sabzi (1:00 – 2:30 PM)",
      snacks: "Tea & Bread Pakauda (5:00 – 6:00 PM)",
      dinner: "Rice & Roti, Arhar Dal & Sabzi (8:00 – 9:30 PM)"
    },
    {
      day: "Tuesday",
      breakfast: "Aloo Paratha + Dahi (8:00 – 9:30 AM)",
      lunch: "Rice & Roti, Dal Sabji (1:00 – 2:30 PM)",
      snacks: "Macaroni & Tea (5:00 – 6:00 PM)",
      dinner: "Rice & Roti, White Chhole, Halwa (2) + Kheer (2) (8:00 – 9:30 PM)"
    },
    {
      day: "Wednesday",
      breakfast: "Semayi + Sabji + Roti (8:00 – 9:30 AM)",
      lunch: "Rice & Roti, Aloo Matar (1:00 – 2:30 PM)",
      snacks: "Butter Bread & Tea (5:00 – 6:00 PM)",
      dinner: "Rice & Roti, Dal Sabji (8:00 – 9:30 PM)"
    },
    {
      day: "Thursday",
      breakfast: "Paratha + Sabji (8:00 – 9:30 AM)",
      lunch: "Rice & Roti, Dal & Sabzi (1:00 – 2:30 PM)",
      snacks: "Poha & Tea (5:00 – 6:00 PM)",
      dinner: "Rice & Roti, Kadhi Pakoda & Kadhi Bundi (8:00 – 9:30 PM)"
    },
    {
      day: "Friday",
      breakfast: "Macaroni + Sabji + Roti (8:00 – 9:30 AM)",
      lunch: "Rice & Roti, Rajma (1:00 – 2:30 PM)",
      snacks: "Samosa & Tea (5:00 – 6:00 PM)",
      dinner: "Rice & Roti, Dal Makhani + Sabji (8:00 – 9:30 PM)"
    },
    {
      day: "Saturday",
      breakfast: "Matar Paratha, Aloo Puri (8:00 – 9:30 AM)",
      lunch: "Chowmein (2), Taheri + Rayta, Dal + Rice & Roti (1:00 – 2:30 PM)",
      snacks: "Namkeen + Biscuit & Tea (5:00 – 6:00 PM)",
      dinner: "Rice & Roti, Kale Chane (8:00 – 9:30 PM)"
    },
    {
      day: "Sunday",
      breakfast: "Paneer Paratha (2), Chhole Bhature (2) (8:00 – 9:30 AM)",
      lunch: "Chowmein (2), Taheri + Rayta, Dal + Rice & Roti (1:00 – 2:30 PM)",
      snacks: "Ginger Tea (5:00 – 6:00 PM)",
      dinner: "Idli Sambhar, Palak, Matar (Paneer), Kheer Puri + Aloo Sabji (8:00 – 9:30 PM)"
    }
  ];
}
