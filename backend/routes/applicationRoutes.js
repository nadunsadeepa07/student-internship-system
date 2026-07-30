const express = require("express");

const router = express.Router();

const upload = require("../middleware/upload");

const Application = require("../models/Application");

const Job = require("../models/Job");


// GET /api/applications/company/:companyId
router.get("/company/:companyId", async (req, res) => {
  try {
    const applications = await Application.find({ companyId: req.params.companyId });
    res.json(applications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post(
  "/:jobId",
  upload.single("file"),

  async (req, res) => {
    try {
      const job = await Job.findById(
        req.params.jobId
      );

      if (!job) {
        return res
          .status(404)
          .json({
            message: "Job not found",
          });
      }

      const application =
        new Application({
          jobId: job._id,

          companyId: job.companyId,

          studentId:
            req.body.studentId,

          studentName:
            req.body.name,

          studentEmail:
            req.body.email,

          about: req.body.about,

          skills: JSON.parse(
            req.body.skills
          ),

          resume:
            req.file?.filename,
        });

      await application.save();

      res.json({
        message:
          "Application submitted",
      });

    } catch (err) {

      console.log(err);

      res.status(500).json({
        message: "Server error",
      });
    }
  }
);

module.exports = router;