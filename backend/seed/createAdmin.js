const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Admin = require("../models/Admin");
require("dotenv").config();

const createAdmin = async () => {
  try {
    // 1. Database connect කරනවා
    await mongoose.connect("mongodb://127.0.0.1:27017/internshipDB");
    console.log("MongoDB connected");

    // 2. Already admin එකක් තියෙනවද check කරනවා
    const existing = await Admin.findOne({ email: "admin@gmail.com" });
    if (existing) {
      console.log("Admin already exists!");
      process.exit();
    }

    // 3. Password hash කරනවා
    const hashedPassword = await bcrypt.hash("admin123", 10);

    // 4. Admin create කරනවා
    await Admin.create({
      username: "admin",
      email: "admin@gmail.com",
      password: hashedPassword,
      role: "admin",
    });

    console.log("✅ Admin created successfully!");
    process.exit();

  } catch (err) {
    console.error("❌ Error:", err.message);
    process.exit(1);
  }
};

createAdmin();