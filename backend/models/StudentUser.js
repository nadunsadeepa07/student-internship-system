const mongoose = require("mongoose");

const StudentUserSchema = new mongoose.Schema(
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

    nic: {
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

    jobTitle: {
      type: String,
      default: "",
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      default: "Student",
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
  "StudentUser",
  StudentUserSchema,
  "student_user"
);