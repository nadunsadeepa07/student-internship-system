const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // DEBUG — backend terminal එකේ පේනවා
    console.log("Admin login attempt:", email);

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const admin = await Admin.findOne({ email });
    console.log("Admin found:", admin ? "YES" : "NO");

    if (!admin) {
      return res.status(401).json({ message: "Invalid admin credentials" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    console.log("Password match:", isMatch);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid admin credentials" });
    }

    const token = jwt.sign(
      { id: admin._id, role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      user: {
        username: admin.username,
        email: admin.email,
        role: "admin",
      },
    });

  } catch (err) {
    console.error("Admin login error:", err.message);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;