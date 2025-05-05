import "dotenv/config";
import { readFileSync } from "fs";
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import express from "express";
import initRoutes from "./routes.js";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

let db;

async function initializeDatabase() {
  db = await open({
    filename: process.env.DATABASE || "database.db",
    driver: sqlite3.Database,
  });

  const tables = await db.all(`SELECT name FROM sqlite_master WHERE type='table'`);
  if (tables.length === 0) {
    const schema = readFileSync("database.sql", "utf8");
    await db.exec(schema);
  }
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
