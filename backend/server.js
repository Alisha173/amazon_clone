// server.js
import express from "express";
import { prisma } from "./src/db/db.js"; // <-- Import the database connection

const app = express();
app.use(express.json());

// Define Routes
app.get("/", async (req, res) => {
  try {
    // A simple query to test if the database is actually connected
    await prisma.$queryRaw`SELECT 1`;
    res.send("API is running and Supabase is connected!");
  } catch (error) {
    console.error("Database connection failed:", error);
    res.status(500).send("API is running, but Database failed to connect.");
  }
});

// Start Server
app.listen(5000, () => {
  console.log("Server running on port 5000");
});