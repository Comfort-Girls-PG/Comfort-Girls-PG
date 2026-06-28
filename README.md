# Comfort Girls PG Portal

A premium, modern full-stack web application designed to manage accommodations, bookings, and support services for a luxury girls' paying guest (PG) facility. 

The application utilizes a robust React + Vite frontend and an Express backend, featuring clean typography, smooth transitions, and high-contrast responsive layouts.

---

## 🚀 Key Features

- **Room Directory & Booking System**: Explore available room options with transparent pricing, amenity lists, and house rules. Bookings support online requests and secure document verification.
- **Physical Visit Scheduler**: Schedule a physical site visit with date, time, and reason selections.
- **Warden Support Desk**: Submit maintenance and general complaints, track ticket resolution, and coordinate with the warden team.
- **Gourmet Nutrition Tracker**: Inspect daily breakfast, lunch, high-tea, and dinner menus updated by the PG kitchen managers.
- **Passcode-Protected Profiles**: Secure, passcode-authenticated user areas preserving account security and billing details.

---

## 🗄️ Database Architecture & Fallback

The backend uses a dual-engine architecture designed to ensure zero-downtime execution:

1. **Production Engine (PostgreSQL / Supabase)**: When configured, the system connects directly to a relational PostgreSQL database to handle high-concurrency transactions, persistence, and queries.
2. **Local Fallback Engine (JSON Files)**: If PostgreSQL environment credentials are not present, the system automatically falls back to standard local file persistence inside the `backend/data` directory. This allows for fully functional local prototyping, development, and immediate testing without requiring an active database server.

---

## 🔌 Checking Database Status

The backend includes a secure debugging endpoint to inspect the current database connection state.

### How to Check Connection Status:
To determine whether the application is actively connected to your PostgreSQL instance or using the local JSON storage engine, make a GET request to the following path relative to your running app:

```http
GET /api/db-status
```

#### Example Output (Connected to Postgres):
```json
{
  "success": true,
  "connected": true,
  "mode": "PostgreSQL (Supabase)",
  "configured": true
}
```

#### Example Output (Using Local JSON Files):
```json
{
  "success": true,
  "connected": false,
  "mode": "Local JSON Files",
  "configured": false
}
```

---

## ⚙️ Configuration & Environment Setup

To transition from the local JSON file engine to your live PostgreSQL/Supabase database, configure the following environment variables in your server's environment or `.env` configuration file:

```env
# Supabase Direct Database Connection Configuration
SUPABASE_DB_HOST="your-supabase-db-host"
SUPABASE_DB_PORT="5432"
SUPABASE_DB_NAME="postgres"
SUPABASE_DB_USER="postgres"
SUPABASE_DB_PASSWORD="your-db-password"
```

Once updated, the backend will automatically initialize its PostgreSQL pool on startup and migrate tables seamlessly.

---

## 📦 Project Commands

Inside the workspace, you can execute the following commands:

- `npm run dev`: Boots both the Vite frontend development asset builder and the Express API backend.
- `npm run build`: Bundles the React assets into `dist/` and compiles the server code using `esbuild`.
- `npm run lint`: Audits types and enforces quality standards using TypeScript non-emitting compile checks.
- `npm run start`: Starts the compiled production backend.
