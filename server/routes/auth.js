// server/routes/auth.js
import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "../config/db.js";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

// POST /register
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password)
      return res.status(400).json({ message: "Please provide all fields." });

    // Check if user exists
    const userExists = await pool.query("SELECT * FROM users WHERE email=$1", [
      email,
    ]);
    if (userExists.rows.length > 0)
      return res.status(409).json({ message: "Email already registered." });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert user
    const newUser = await pool.query(
      "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING user_id, username, email",
      [username, email, hashedPassword],
    );

    res.status(201).json({
      message: "User registered successfully!",
      user: newUser.rows[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error." });
  }
});

// POST /login
// router.post("/login", async (req, res) => {
//     try {
//         const { email, password } = req.body;

//         if (!email || !password)
//             return res.status(400).json({ message: "Please provide email and password." });

//         // Find user
//         const userQuery = await pool.query("SELECT * FROM users WHERE email=$1", [
//             email,
//         ]);
//         const user = userQuery.rows[0];
//         if (!user)
//             return res.status(401).json({ message: "Invalid email or password." });

//         // Check password
//         const isMatch = await bcrypt.compare(password, user.password);
//         if (!isMatch)
//             return res.status(401).json({ message: "Invalid email or password." });

//         // Generate JWT
//         const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
//             expiresIn: "1h",
//         });

//         res.status(200).json({ message: "Login successful!", token });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: "Internal server error." });
//     }
// });
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res
        .status(400)
        .json({ message: "Please provide email and password." });

    // Find user
    const userQuery = await pool.query("SELECT * FROM users WHERE email=$1", [
      email,
    ]);
    const user = userQuery.rows[0];

    if (!user) {
      return res.status(401).json({ message: "Email is incorrect." });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Password is incorrect." });
    }

    // Generate JWT
    const token = jwt.sign({ user_id: user.user_id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(200).json({ message: "Login successful!", token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error." });
  }
});

export default router;
