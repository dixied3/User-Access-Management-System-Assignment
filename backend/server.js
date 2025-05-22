// Project: User Access Management System
// Tech Stack: React (frontend), Node.js + Express + TypeORM (backend), PostgreSQL (DB)

// ======================= BACKEND =======================

// File: backend/server.js
const express = require("express");
const app = express();
const cors = require("cors");
const { DataSource } = require("typeorm");
const dotenv = require("dotenv");
dotenv.config();

const authRoutes = require("./routes/auth");
const softwareRoutes = require("./routes/software");
const requestRoutes = require("./routes/requests");

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/software", softwareRoutes);
app.use("/api/requests", requestRoutes);

const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  synchronize: true,
  entities: ["./entities/*.js"],
});

AppDataSource.initialize()
  .then(() => {
    app.listen(5000, () => console.log("Server running on port 5000"));
  })
  .catch((err) => console.error("DB Connection Error:", err));


