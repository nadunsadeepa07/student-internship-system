const express = require("express");
const router = express.Router();
const Job = require("../models/Job");

// ===============================
// GET ALL JOBS
// ===============================
router.get("/", async (req, res) => {
  try {
    const filter = {};

    // FILTER BY COMPANY
    if (req.query.companyId) {
      filter.companyId = req.query.companyId;
    }

    const jobs = await Job.find(filter).sort({
      createdAt: -1,
    });

    res.json(jobs);
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Error fetching jobs",
    });
  }
});

// ===============================
// GET SINGLE JOB
// ===============================
router.get("/:id", async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
      });
    }

    res.json(job);
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Error fetching job",
    });
  }
});

// ===============================
// CREATE JOB
// ===============================
router.post("/", async (req, res) => {
  try {
    const {
      title,
      description,
      salary,
      vacancy,
      category,

      // COMPANY
      companyId,
      companyName,
      email,
      mobile,
      address,
      district,

      // OTHER
      location,
      requirements,
      applicants,
    } = req.body;

    // VALIDATION
    if (!companyId) {
      return res.status(400).json({
        message: "companyId required",
      });
    }

    // VACANCY NUMBER
    const vacancyNumber = parseInt(vacancy, 10);

    if (isNaN(vacancyNumber)) {
      return res.status(400).json({
        message: "Vacancy must be a valid number",
      });
    }

    // CREATE JOB
    const job = await Job.create({
      title,
      description,
      salary,

      vacancy: vacancyNumber,

      category,

      // COMPANY DETAILS
      companyId,
      companyName: companyName || "Unknown Company",
      email: email || "",
      mobile: mobile || "",
      address: address || "",
      district: district || "",

      // OTHER
      location: location || "Sri Lanka",
      requirements: requirements || "Not specified",
      applicants: applicants || [],
    });

    res.status(201).json(job);
  } catch (err) {
    console.error("Full error:", err);

    res.status(500).json({
      message: "Error creating job",
    });
  }
});

// ===============================
// UPDATE JOB
// ===============================
router.put("/:id", async (req, res) => {
  try {
    const updatedData = {
      ...req.body,
    };

    // Convert vacancy to number if exists
    if (updatedData.vacancy) {
      updatedData.vacancy = parseInt(
        updatedData.vacancy,
        10
      );
    }

    const job = await Job.findByIdAndUpdate(
      req.params.id,
      updatedData,
      {
        new: true,
      }
    );

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
      });
    }

    res.json(job);
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Error updating job",
    });
  }
});

// ===============================
// DELETE JOB
// ===============================
router.delete("/:id", async (req, res) => {
  try {
    const job = await Job.findByIdAndDelete(
      req.params.id
    );

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
      });
    }

    res.json({
      message: "Deleted successfully",
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Error deleting job",
    });
  }
});

// ===============================
// APPLY FOR JOB
// ===============================
router.post("/:id/apply", async (req, res) => {
  try {
    const { userId, name } = req.body;

    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
      });
    }

    // CHECK ALREADY APPLIED
    const alreadyApplied = job.applicants.some(
      (a) => a.userId === userId
    );

    if (alreadyApplied) {
      return res.status(400).json({
        message: "Already applied",
      });
    }

    // ADD APPLICANT
    job.applicants.push({
      userId,
      name,
    });

    await job.save();

    res.json(job);
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Error applying job",
    });
  }
});

module.exports = router;