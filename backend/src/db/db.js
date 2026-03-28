// db.js
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
// Keeping your custom output path
import { PrismaClient } from "../generated/prisma/client.ts"; 
import "dotenv/config";
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not set in your .env file");
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

// Export 'prisma' so we can import it anywhere in our app
export const prisma = new PrismaClient({ adapter });