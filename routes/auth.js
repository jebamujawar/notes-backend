const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

// Ensure JWT_SECRET exists
if (!process.env.JWT_SECRET) {
  console.error("JWT_SECRET is not set in .env!");
  process.exit(1);
}

// ==============================
// SIGNUP
// ==============================
router.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password)
      return res.status(400).json({ msg: "All fields are required" });

    // Check for existing username or email
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) return res.status(400).json({ msg: "Username or email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword });
    await user.save();

    console.log(`New user created: ${username} (${email})`);
    res.status(201).json({ msg: "Signup successful" });

  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ msg: "Server error during signup", error: error.message });
  }
});

// ==============================
// LOGIN
// ==============================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body; // use email

    if (!email || !password)
      return res.status(400).json({ msg: "All fields are required" });

    const user = await User.findOne({ email }); // find by email
    if (!user) return res.status(400).json({ msg: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    const token = jwt.sign(
      { userId: user._id, username: user.username, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    console.log(`User logged in: ${email}`);
    res.json({ token, username: user.username, email: user.email });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ msg: "Server error during login", error: error.message });
  }
});

module.exports = router;
