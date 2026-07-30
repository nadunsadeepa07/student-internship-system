const mongoose = require("mongoose");

const applicationSchema =
new mongoose.Schema(
{
  jobId: {
    type:
    mongoose.Schema.Types.ObjectId,
    ref: "Job",
  },

  companyId: {
    type:
    mongoose.Schema.Types.ObjectId,
    ref: "CompanyUser",
  },

  studentId: {
    type:
    mongoose.Schema.Types.ObjectId,
    ref: "StudentUser",
  },

  studentName: String,

  studentEmail: String,

  about: String,

  skills: [String],

  resume: String,

  status: {
    type: String,
    default: "Pending",
  },

  interviewDate: String,

  interviewTime: String,
},
{ timestamps: true }
);

module.exports =
mongoose.model(
  "Application",
  applicationSchema
);