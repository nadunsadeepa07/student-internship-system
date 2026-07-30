// cvController.js — CV CRUD logic
// Routes ෙකෙ code කෙලින්ම ලියනවා ෙනෙ, controllers ෙකෙ separate කරනවා
// මේකෙ AI cover letter generation, ATS score calculation ද

const CV   = require("../models/CV");
const crypto = require("crypto");

// ==========================================
// CREATE or UPDATE CV
// PUT /api/cv — save or update
// ==========================================
exports.saveCV = async (req, res) => {
  try {
    const studentId = req.user._id;

    // Check CV already exists for this student
    let cv = await CV.findOne({ studentId });

    const cvData = { ...req.body, studentId };

    if (cv) {
      // Update existing — findOneAndUpdate returns updated doc
      cv = await CV.findOneAndUpdate(
        { studentId },
        cvData,
        { new: true, runValidators: true }  // new: updated doc return
      );
    } else {
      // New CV create
      cv = await CV.create(cvData);
    }

    // ATS Score calculate කරනවා
    cv.calculateAtsScore();
    await cv.save();

    res.status(200).json({ success: true, data: cv });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ==========================================
// GET MY CV — currently logged in user
// GET /api/cv/me
// ==========================================
exports.getMyCV = async (req, res) => {
  try {
    const cv = await CV.findOne({ studentId: req.user._id });
    if (!cv) return res.status(404).json({ message: "CV not found" });
    res.json({ success: true, data: cv });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ==========================================
// GENERATE SHARE LINK
// POST /api/cv/share — unique token create
// ==========================================
exports.generateShareLink = async (req, res) => {
  try {
    // crypto module — random token generate
    const token = crypto.randomBytes(20).toString("hex");
    const cv = await CV.findOneAndUpdate(
      { studentId: req.user._id },
      { shareToken: token, isPublic: true },
      { new: true }
    );
    const shareUrl = `${process.env.CLIENT_URL}/cv/public/${token}`;
    res.json({ success: true, shareUrl });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ==========================================
// PUBLIC CV VIEW — share link
// GET /api/cv/public/:token
// No auth required
// ==========================================
exports.getPublicCV = async (req, res) => {
  try {
    const cv = await CV.findOne({
      shareToken: req.params.token,
      isPublic: true,
    }).populate("studentId", "username email"); // student info include

    if (!cv) return res.status(404).json({ message: "CV not found or not public" });
    res.json({ success: true, data: cv });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ==========================================
// DELETE CV
// ==========================================
exports.deleteCV = async (req, res) => {
  try {
    await CV.findOneAndDelete({ studentId: req.user._id });
    res.json({ success: true, message: "CV deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};