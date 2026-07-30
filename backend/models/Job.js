const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    salary: {
      type: String,
      default: "",
    },

    vacancy: {
      type: String,
      default: "",
    },

    category: {
      type: String,
      default: "Engineering",
    },

    // ================= COMPANY =================
    companyId: {
      type: String,
      required: true,
    },

    companyName: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      default: "",
    },

    mobile: {
      type: String,
      default: "",
    },

    address: {
      type: String,
      default: "",
    },

    district: {
      type: String,
      default: "",
    },

    // ================= OTHER =================
    location: {
      type: String,
      default: "Sri Lanka",
    },

    requirements: {
      type: String,
      default: "Not specified",
    },

    applicants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Application",
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Job", jobSchema);