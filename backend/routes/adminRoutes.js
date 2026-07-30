const express = require("express");
const router = express.Router();
const Student = require("../models/StudentUser");
const Company = require("../models/CompanyUser");
const { protect } = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

// ✅ Email service import
const {
  sendStudentApprovalEmail,
  sendStudentRejectionEmail,
  sendCompanyApprovalEmail,
  sendCompanyRejectionEmail,
} = require("../utils/emailService");

router.use(protect);
router.use(adminMiddleware);

// =======================================
// GET PENDING USERS
// =======================================
router.get("/pending", async (req, res) => {
  try {
    const students = await Student.find({ 
      status: "pending" 
    }).select("-password");
    
    const companies = await Company.find({ 
      status: "pending" 
    }).select("-password");
    
    res.json({ students, companies });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// =======================================
// APPROVE STUDENT ✅ + EMAIL
// =======================================
router.put("/approve-student/:id", async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      { 
        status: "approved", 
        rejectionReason: null, 
        verifiedAt: new Date() 
      },
      { new: true }
    );

    if (!student) {
      return res.status(404).json({ 
        message: "Student not found" 
      });
    }

    // ✅ Approval email යවනවා
    try {
      await sendStudentApprovalEmail(
        student.email, 
        student.username
      );
      console.log(`✅ Approval email sent to: ${student.email}`);
    } catch (emailErr) {
      // Email fail වුනත් approval succeed කරනවා
      console.error("Email send failed:", emailErr.message);
    }

    res.json({ 
      message: `Student ${student.username} approved successfully` 
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// =======================================
// REJECT STUDENT ❌ + EMAIL
// =======================================
router.put("/reject-student/:id", async (req, res) => {
  try {
    const { rejectionReason } = req.body;

    const student = await Student.findByIdAndUpdate(
      req.params.id,
      { 
        status: "rejected", 
        rejectionReason: rejectionReason || "Invalid details" 
      },
      { new: true }
    );

    if (!student) {
      return res.status(404).json({ 
        message: "Student not found" 
      });
    }

    // ✅ Rejection email යවනවා
    try {
      await sendStudentRejectionEmail(
        student.email,
        student.username,
        rejectionReason
      );
      console.log(`❌ Rejection email sent to: ${student.email}`);
    } catch (emailErr) {
      console.error("Email send failed:", emailErr.message);
    }

    res.json({ 
      message: `Student ${student.username} rejected` 
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// =======================================
// APPROVE COMPANY ✅ + EMAIL
// =======================================
router.put("/approve-company/:id", async (req, res) => {
  try {
    const company = await Company.findByIdAndUpdate(
      req.params.id,
      { 
        status: "approved", 
        rejectionReason: null, 
        verifiedAt: new Date() 
      },
      { new: true }
    );

    if (!company) {
      return res.status(404).json({ 
        message: "Company not found" 
      });
    }

    // ✅ Approval email යවනවා
    try {
      await sendCompanyApprovalEmail(
        company.email, 
        company.username
      );
      console.log(`✅ Approval email sent to: ${company.email}`);
    } catch (emailErr) {
      console.error("Email send failed:", emailErr.message);
    }

    res.json({ 
      message: `Company ${company.username} approved successfully` 
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// =======================================
// REJECT COMPANY ❌ + EMAIL
// =======================================
router.put("/reject-company/:id", async (req, res) => {
  try {
    const { rejectionReason } = req.body;

    const company = await Company.findByIdAndUpdate(
      req.params.id,
      { 
        status: "rejected", 
        rejectionReason: rejectionReason || "Invalid registration" 
      },
      { new: true }
    );

    if (!company) {
      return res.status(404).json({ 
        message: "Company not found" 
      });
    }

    // ✅ Rejection email යවනවා
    try {
      await sendCompanyRejectionEmail(
        company.email,
        company.username,
        rejectionReason
      );
      console.log(`❌ Rejection email sent to: ${company.email}`);
    } catch (emailErr) {
      console.error("Email send failed:", emailErr.message);
    }

    res.json({ 
      message: `Company ${company.username} rejected` 
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// =======================================
// GET APPROVED STUDENTS
// =======================================
router.get("/students", async (req, res) => {
  try {
    const students = await Student.find({
      status: "approved",
    }).select("-password");
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// =======================================
// GET APPROVED COMPANIES
// =======================================
router.get("/companies", async (req, res) => {
  try {
    const companies = await Company.find({
      status: "approved",
    }).select("-password");
    res.json(companies);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// =======================================
// BLOCK / UNBLOCK STUDENT
// =======================================
router.put("/block-student/:id", async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      { blocked: true },
      { new: true }
    );
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    res.json(student);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put("/unblock-student/:id", async (req, res) => {
  try {
    await Student.findByIdAndUpdate(
      req.params.id, 
      { blocked: false }
    );
    res.json({ message: "Student unblocked" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// =======================================
// BLOCK / UNBLOCK COMPANY
// =======================================
router.put("/block-company/:id", async (req, res) => {
  try {
    const company = await Company.findByIdAndUpdate(
      req.params.id,
      { blocked: true },
      { new: true }
    );
    res.json(company);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put("/unblock-company/:id", async (req, res) => {
  try {
    await Company.findByIdAndUpdate(
      req.params.id, 
      { blocked: false }
    );
    res.json({ message: "Company unblocked" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// =======================================
// DELETE STUDENT
// =======================================
router.delete("/student/:id", async (req, res) => {
  try {
    await Student.findByIdAndDelete(req.params.id);
    res.json({ message: "Student removed" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// =======================================
// DELETE COMPANY
// =======================================
router.delete("/company/:id", async (req, res) => {
  try {
    await Company.findByIdAndDelete(req.params.id);
    res.json({ message: "Company removed" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;