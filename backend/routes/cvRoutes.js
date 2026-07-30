const express = require("express");
const router = express.Router();
const CV = require("../models/CV");

const crypto = require("crypto");
const upload = require("../middleware/upload"); // shared Cloudinary middleware

// =====================
// IMAGE UPLOAD
// =====================

router.post(
  "/upload",
  upload.single("image"),
  (req, res) => {
    try {
      res.json({
        imageUrl: req.file.path, // Cloudinary URL දැනටමත් මෙතන ඇතුළත්
      });
    } catch (err) {
      res.status(500).json({
        message: err.message,
      });
    }
  }
);

// =====================
// SAVE CV
// =====================
// 🐛 BUG (root cause of "500 Internal Server Error" on /api/cv/save):
// req.body sometimes arrives with `_id: null` (because the frontend's
// initial state had `_id: null`). The old code did:
//     const cvData = req.body;
//     if (cvData._id) { ...update... } else {
//        const newCV = new CV(cvData);   // cvData._id is still `null` here!
//     }
// Passing an explicit `_id: null` into `new CV(cvData)` makes Mongoose try
// to cast `null` to an ObjectId for the `_id` path -> CastError -> the
// catch block returns HTTP 500.
//
// ✅ FIX: destructure `_id` out of req.body first, so the object used to
// create a brand-new CV never contains an `_id` field. Mongo/Mongoose will
// then generate a fresh ObjectId automatically.

router.post("/save", async (req, res) => {
  try {
    const { _id, ...cvData } = req.body; // ✅ FIX: _id removed from payload

    if (!cvData.personalInfo?.fullName || !cvData.personalInfo?.email) {
      return res.status(400).json({
        message: "Full name and email are required"
      });
    }

    // Update existing CV
    if (_id) {
      const existingCV = await CV.findById(_id);

      if (!existingCV) {
        return res.status(404).json({
          message: "CV not found"
        });
      }

      Object.assign(existingCV, cvData);
      existingCV.calculateAtsScore();
      await existingCV.save();

      return res.json(existingCV);
    }

    // Create new CV (no _id in the payload anymore -> Mongo generates one)
    const newCV = new CV(cvData);
    newCV.calculateAtsScore();
    await newCV.save();

    res.status(201).json(newCV);

  } catch (err) {
    console.error("❌ SAVE ERROR:", err);
    res.status(500).json({
      message: err.message
    });
  }
});

// =====================
// GET ALL CVS
// =====================

router.get("/", async (req, res) => {
  try {
    const cvs = await CV.find();
    res.json(cvs);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

// =====================
// SHARE CV
// =====================

router.post("/share/:id", async (req, res) => {
  try {
    const cv = await CV.findById(req.params.id);

    if (!cv) {
      return res.status(404).json({
        message: "CV not found",
      });
    }

    if (!cv.shareToken) {
      cv.shareToken = crypto.randomUUID();
    }

    cv.isPublic = true;
    await cv.save();

    const shareUrl = `${process.env.CLIENT_URL}/shared-cv/${cv.shareToken}`;

    res.json({ shareUrl });

  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

// =====================
// GET CURRENT USER'S CV
// =====================
// ⚠️ NOTE (not part of the reported errors, but worth fixing separately):
// This currently returns the single most-recently-created CV in the WHOLE
// database, not the CV that belongs to the logged-in user. Once auth
// middleware is wired up, this should filter by the user, e.g.:
//     CV.findOne({ studentId: req.user.id })
// Left as-is here since these files don't show an auth middleware.

router.get("/me", async (req, res) => {
  try {
    const cv = await CV.findOne().sort({ createdAt: -1 }); // Latest CV

    if (!cv) {
      return res.status(404).json({
        message: "No CV found"
      });
    }

    res.json({ data: cv });

  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
});

// =====================
// GET SHARED CV
// =====================

router.get("/shared/:token", async (req, res) => {
  try {
    const cv = await CV.findOne({
      shareToken: req.params.token,
      isPublic: true,
    });

    if (!cv) {
      return res.status(404).json({
        message: "Shared CV not found",
      });
    }

    res.json(cv);

  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: err.message,
    });
  }
});

module.exports = router;