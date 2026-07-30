// CV.js — MongoDB CV schema
// Advanced fields add කළා: projects, certificates, languages, socialLinks
// ATS score calculate කිරීමටත් fields setup කළා

const mongoose = require("mongoose");

const cvSchema = new mongoose.Schema(
  {
    // student ID — JWT token ෙකෙ user id link කරනවා
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      
    },

    template: {
      type: String,
      enum: ["modern", "classic", "minimal", "dark", "creative", "executive"],
      default: "modern",
    },

    profileImage: { type: String, default: "" },

    personalInfo: {
      fullName:   { type: String, required: true },
      email:      { type: String, required: true },
      phone:      String,
      address:    String,
      linkedin:   String,   // NEW: LinkedIn URL
      github:     String,   // NEW: GitHub URL
      portfolio:  String,   // NEW: Portfolio website
      summary:    String,
      jobTitle:   String,   // NEW: "Software Engineer Intern" වගේ
    },

    skills: [String],

    // NEW: Skill categories (ATS matching සඳහා)
    skillCategories: [
      {
        category: String,        // "Programming Languages", "Frameworks"
        skills:   [String],
      },
    ],

    education: [
      {
        institute:  { type: String, required: true },
        degree:     String,
        field:      String,   // NEW: "Computer Science"
        year:       String,
        gpa:        String,   // NEW: GPA
        grade:      String,   // NEW: "A+", "First Class"
      },
    ],

    experience: [
      {
        company:     { type: String, required: true },
        role:        String,
        duration:    String,
        description: String,
        location:    String,  // NEW
        type:        String,  // NEW: "Full-time", "Internship", "Part-time"
      },
    ],

    // NEW: Projects Section
    projects: [
      {
        title:        { type: String, required: true },
        technologies: String,
        description:  String,
        github:       String,
        liveUrl:      String,  // demo link
        year:         String,
      },
    ],

    // NEW: Certifications
    certifications: [
      {
        name:         String,
        issuer:       String,
        year:         String,
        credentialId: String,
        url:          String,
      },
    ],

    // NEW: Languages
    languages: [
      {
        name:  String,
        level: String,  // "Native", "Fluent", "Intermediate", "Basic"
      },
    ],

    // NEW: ATS Score (backend calculate කරලා save කරනවා)
    atsScore: {
      type:    Number,
      default: 0,
      min: 0,
      max: 100,
    },

    isPublic: { type: Boolean, default: false },  // NEW: public share
    shareToken: String,   // NEW: unique share URL token
  },
  {
    timestamps: true,  // createdAt, updatedAt auto create
  }
);

// ATS Score calculate කිරීමේ method
cvSchema.methods.calculateAtsScore = function () {
  let score = 0;
  const info = this.personalInfo;

  // Basic info checks (40 points)
  if (info.fullName)   score += 10;
  if (info.email)      score += 10;
  if (info.phone)      score += 5;
  if (info.summary)    score += 10;
  if (info.linkedin)   score += 5;

  // Skills (20 points)
  if (this.skills.length >= 5)  score += 20;
  else score += this.skills.length * 4;

  // Experience (20 points)
  if (this.experience.length >= 1) score += 20;

  // Education (10 points)
  if (this.education.length >= 1)  score += 10;

  // Projects (10 points)
  if (this.projects.length >= 1) score += 10;

  this.atsScore = Math.min(score, 100);
  return this.atsScore;
};

module.exports = mongoose.model("CV", cvSchema);