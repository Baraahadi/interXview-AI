// server/app.js
process.env.PDF_PARSE_DISABLE_TESTS = "true";

import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import { testDBConnection } from "./config/db.js";
import cors from "cors";
import interviewRoutes from "./routes/interview.js";
import cvRoutes from "./routes/cv.js";
import cvTextRoutes from "./routes/cvText.js";
import { multerErrorHandler } from "./middleware/multerErrorHandler.js";
// const interviewRoutes = require("./routes/interview.js");
import dashboardRoutes from "./routes/dashboardRoutes.js";

dotenv.config();
const app = express();

// Middleware
const allowedOrigins = [
  "http://localhost:5173",
  "https://interxview-ai-1.onrender.com",
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  }),
);
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/interview", interviewRoutes);
app.use("/api/cv", cvRoutes);
app.use(multerErrorHandler);
app.use("/api/cv-text", cvTextRoutes);
app.use("/api/dashboard", dashboardRoutes);

// Root route
app.get("/", (req, res) => {
  res.send("InterXview API with PostgreSQL is running!");
});
app.get("/test", (req, res) => {
  res.json({ message: "API is working" });
});

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
  testDBConnection();
});
