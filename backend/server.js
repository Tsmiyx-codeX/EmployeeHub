
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import db from "./config/db.js";
import employeeRoutes from "./routes/employeeRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "EmployeeHub API is running" });
});

app.get("/api/test-db", async (req, res) => {
  try {
    await db.query("SELECT 1");
    res.json({ success: true, message: "MySQL connected successfully" });
  } catch (error) {
    console.error("Database connection error:", error.message);
    res.status(500).json({ success: false, message: "Database connection failed" });
  }
});

app.use("/api/employees", employeeRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`EmployeeHub API running at http://localhost:${PORT}`);
});
