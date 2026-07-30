const express = require("express");

const router = express.Router();

const Application =
require("../models/Application");



/* =========================
   GET ALL APPLICATIONS
========================= */

router.get(
  "/applications",

  async (req, res) => {

    try {

      // companyId from frontend
      const companyId =
        req.query.companyId;

      const apps =
        await Application.find({
          companyId,
        })
        .populate("studentId", "username email mobile jobTitle")
        .populate("jobId", "title");

      res.json(apps);

    } catch (err) {

      console.log(err);

      res.status(500).json({
        message:
          err.message
      });
    }
  }
);



/* =========================
   ACCEPT APPLICATION
========================= */

router.put(
  "/application/accept/:id",

  async (req, res) => {

    try {

      const app =
        await Application.findById(
          req.params.id
        );

      if (!app) {

        return res
          .status(404)
          .json({
            message:
              "Application not found",
          });
      }

      app.status =
        "Accepted";

      app.interviewDate =
        req.body.date;

      app.interviewTime =
        req.body.time;

      await app.save();

      res.json({
        message:
          "Application Accepted",
      });

    } catch (err) {

      console.log(err);

      res.status(500).json({
        message:
          "Server Error",
      });
    }
  }
);



/* =========================
   REJECT APPLICATION
========================= */

router.put(
  "/application/reject/:id",

  async (req, res) => {

    try {

      const app =
        await Application.findById(
          req.params.id
        );

      if (!app) {

        return res
          .status(404)
          .json({
            message:
              "Application not found",
          });
      }

      app.status =
        "Rejected";

      await app.save();

      res.json({
        message:
          "Application Rejected",
      });

    } catch (err) {

      console.log(err);

      res.status(500).json({
        message:
          "Server Error",
      });
    }
  }
);



module.exports = router;