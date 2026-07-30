const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const CompanyUser = require("../models/CompanyUser");
const StudentUser = require("../models/StudentUser");

// ======================================================
// REGISTER
// ======================================================
router.post("/register", async (req, res) => {
  try {
    let {
      username, email, address, mobile,
      district, jobTitle, password, role,
      nic, companyRegNo,
    } = req.body;

    username = username?.trim();
    email = email?.trim().toLowerCase();
    address = address?.trim();
    mobile = mobile?.trim();
    district = district?.trim();
    jobTitle = jobTitle?.trim();
    role = role?.trim();

    if (!username || !email || !password || !role) {
      return res.status(400).json({
        message: "All required fields required",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    let user;

    if (role === "Company") {
      const existingCompany = await CompanyUser.findOne({
        $or: [{ username }, { email }, { companyRegNo }],
      });

      if (existingCompany) {
        return res.status(400).json({
          message: "Company already exists or Reg No used",
        });
      }

      user = await CompanyUser.create({
        username, email, address, mobile, district,
        companyRegNo, password: hashedPassword,
        role, status: "pending",
      });

    } else if (role === "Student") {
      const existingStudent = await StudentUser.findOne({
        $or: [{ username }, { email }, { nic }],
      });

      if (existingStudent) {
        return res.status(400).json({
          message: "Student already exists or NIC used",
        });
      }

      user = await StudentUser.create({
        username, email, address, mobile, district,
        jobTitle, nic, password: hashedPassword,
        role, status: "pending",
      });

    } else {
      return res.status(400).json({ message: "Invalid role" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(201).json({
      message: "Register successful",
      token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        address: user.address,
        mobile: user.mobile,
        district: user.district,
        jobTitle: user.jobTitle,
        role: user.role,
        status: user.status,
        nic: user.nic,
        companyRegNo: user.companyRegNo,
      },
    });

  } catch (err) {
    console.log("REGISTER ERROR:", err);
    res.status(500).json({ message: err.message });
  }
});

// ======================================================
// LOGIN - ✅ EMAIL වලින් LOGIN
// ======================================================
router.post("/login", async (req, res) => {
  try {

    // ✅ email & password - username නෙමේ!
    let { email, password } = req.body;

    console.log("=== LOGIN DEBUG ===");
    console.log("RAW body:", req.body);        // ✅ exact body බලන්න
    console.log("email:", email);
    console.log("password exists:", !!password);
    console.log("==================");

    email = email?.trim().toLowerCase();

    // ✅ EMAIL check - username නෙමේ
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password required",  // ✅ නිවැරදි message
      });
    }

    // ✅ EMAIL වලින් හොයනවා
    let user = await CompanyUser.findOne({ email });
    console.log("Company found:", !!user);

    if (!user) {
      user = await StudentUser.findOne({ email });
      console.log("Student found:", !!user);
    }

    if (!user) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    console.log("User:", user.username, "| Role:", user.role);

    const isMatch = await bcrypt.compare(password, user.password);
    console.log("Password match:", isMatch);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    if (user.blocked) {
      return res.status(403).json({
        message: "Your account has been blocked by admin.",
      });
    }

    if (user.status === "pending") {
      return res.status(403).json({
        message: "⏳ Your account is waiting for admin approval.",
        status: "pending",
      });
    }

    if (user.status === "rejected") {
      return res.status(403).json({
        message: `❌ Your registration was rejected. Reason: ${user.rejectionReason || "Not specified"}`,
        status: "rejected",
      });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        address: user.address,
        mobile: user.mobile,
        district: user.district,
        jobTitle: user.jobTitle,
        role: user.role,
        status: user.status,
      },
    });

  } catch (err) {
    console.log("LOGIN ERROR:", err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
