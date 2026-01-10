const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

// ==============================
// Helper function to check JWT secret
// ==============================
if (!process.env.JWT_SECRET) {
  console.error("JWT_SECRET is not set in .env!");
  process.exit(1);
}

// ==============================
// SIGNUP
// ==============================
router.post("/signup", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    // Check if user exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ msg: "User already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = new User({ username, password: hashedPassword });
    await user.save();

    console.log(`New user created: ${username}`);
    res.status(201).json({ msg: "Signup successful" });

  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ msg: "Server error during signup" });
  }
});

// ==============================
// LOGIN
// ==============================
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    // Find user
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    console.log(`User logged in: ${username}`);
    res.json({ token });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ msg: "Server error during login" });
  }
});

module.exports = router;
