const express = require("express");

const router = express.Router();

const Application =
require("../models/Application");



/* =========================
   GET STUDENT APPLICATIONS
========================= */

router.get("/applications/:studentId", async (req, res) => {
  try {
    const studentId = req.params.studentId;

    // ✅ studentId එක නොමැති නම් 400 Bad Request එකක් යවන්න
    if (!studentId) {
      return res.status(400).json({ message: "Student ID is required" });
    }

    const apps = await Application.find({ studentId })
      .populate("companyId", "username email mobile")
      .populate("jobId", "title");

    console.log(JSON.stringify(apps, null, 2));
    res.json(apps);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
});



module.exports = router;