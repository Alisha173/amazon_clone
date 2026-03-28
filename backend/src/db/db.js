// db.js
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import "dotenv/config";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not set in your .env file");
}

// FIX: Added ssl configuration here!
const pool = new Pool({ 
  connectionString,
  ssl: {
    rejectUnauthorized: false // Required by Supabase for external connections
  }
});

const adapter = new PrismaPg(pool);

export const prisma = new PrismaClient({ adapter });