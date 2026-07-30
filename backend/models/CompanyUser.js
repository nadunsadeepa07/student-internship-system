const mongoose = require("mongoose");

const CompanyUserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    companyRegNo: {
      type: String,
      required: true,
      unique: true,   
      trim: true,
    },

    address: {
      type: String,
      default: "",
    },

    mobile: {
      type: String,
      default: "",
    },

    district: {
      type: String,
      default: "",
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      default: "Company",
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    verifiedAt: { type: Date, default: null },

    rejectionReason: { type: String, default: "" },

    blocked: { type: Boolean, default: false, },
  },
  

  { timestamps: true }
);

module.exports = mongoose.model(
  "CompanyUser",
  CompanyUserSchema,
  "company_user"
);