import "dotenv/config";
import { readFileSync } from "fs";
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import express from "express";
import initRoutes from "./routes.js";

const app = express();
app.use(express.json());

let db;

async function initializeDatabase() {
  db = await open({
    filename: process.env.DATABASE || "database.db",
    driver: sqlite3.Database,
  });

  const schema = readFileSync("database.sql", "utf8");
  await db.exec(schema);
  console.log("Database initialized.");
}

const port = process.env.PORT || 3000;
async function startServer() {
  try {
    await initializeDatabase();
    app.use(initRoutes(db));
    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });
  } catch (err) {
    console.error("Failed to initialize DB:", err);
  }
}

startServer();
