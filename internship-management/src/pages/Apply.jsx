import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Sparkles,
  User,
  Mail,
  FileText,
  Award,
  Upload,
  CheckCircle,
  X,
  ArrowLeft,
  Send,
  Moon,
  Sun,
} from "lucide-react";
import "../styles/Apply.css";
import { getStoredUser } from "../utils/storage";

function Apply() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [about, setAbout] = useState("");
  const [skillInput, setSkillInput] = useState("");
  const [skills, setSkills] = useState([]);
  const [file, setFile] = useState(null);
  const [popup, setPopup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [jobDetails, setJobDetails] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const query = new URLSearchParams(location.search);
  const jobId = query.get("jobId");
  const user = getStoredUser();

  // ---------- DARK MODE ----------
  useEffect(() => {
    const stored = localStorage.getItem("applyTheme");
    const prefersDark =
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initialDark = stored ? stored === "dark" : prefersDark;
    setDarkMode(initialDark);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute(
      "data-theme",
      darkMode ? "dark" : "light"
    );
    localStorage.setItem("applyTheme", darkMode ? "dark" : "light");
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  // ---------- FETCH JOB ----------
  useEffect(() => {
    if (jobId) {
      axios
        .get(`https://student-internship-system.vercel.app/api/jobs/${jobId}`)
        .then((res) => setJobDetails(res.data))
        .catch((err) => console.log(err));
    }
  }, [jobId]);

  // ---------- SKILL HANDLERS ----------
  const addSkill = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const trimmed = skillInput.trim();
      if (!trimmed) return;
      if (skills.includes(trimmed)) {
        alert("Skill already added!");
        return;
      }
      setSkills([...skills, trimmed]);
      setSkillInput("");
      setErrors((prev) => ({ ...prev, skills: "" }));
    }
  };

  const removeSkill = (index) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  // ---------- VALIDATION ----------
  const validateForm = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = "Name is required";
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Invalid email format";
    }
    if (!about.trim()) newErrors.about = "Please tell us about yourself";
    if (skills.length === 0) newErrors.skills = "Add at least one skill";
    if (!file) newErrors.file = "Please upload your resume";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ---------- PROGRESS ----------
  const getProgress = () => {
    let filled = 0;
    if (name) filled++;
    if (email) filled++;
    if (about) filled++;
    if (skills.length > 0) filled++;
    if (file) filled++;
    return (filled / 5) * 100;
  };

  const getStep = () => {
    const progress = getProgress();
    if (progress === 0) return 0;
    if (progress <= 40) return 1;
    if (progress <= 80) return 2;
    return 3;
  };

  // ---------- SUBMIT ----------
  const submitForm = async () => {
    if (!validateForm()) return;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("about", about);
      formData.append("skills", JSON.stringify(skills));
      formData.append("file", file);
      formData.append("studentId", user?._id || "");

      await axios.post(
        `https://student-internship-system.vercel.app/api/applications/${jobId}`,
        formData
      );
      setPopup(true);
      setTimeout(() => navigate("/student"), 3000);
    } catch (error) {
      console.error(error);
      alert("Error submitting application");
    } finally {
      setLoading(false);
    }
  };

  // ---------- RENDER ----------
  return (
    <div className={`apply-page ${darkMode ? "dark" : ""}`}>
      {/* Background decorations */}
      <div className="bg-blur blur-1"></div>
      <div className="bg-blur blur-2"></div>
      <div className="bg-grid"></div>

      {/* Floating Dark Mode Toggle */}
      <button className="floating-theme-toggle" onClick={toggleDarkMode}>
        {darkMode ? <Sun size={20} /> : <Moon size={20} />}
      </button>

      {/* ===== MAIN ===== */}
      <div className="apply-container">
        <div className="apply-wrapper">
          {/* LEFT: Job Info */}
          <div className="apply-left">
            <button className="back-btn" onClick={() => navigate(-1)}>
              <ArrowLeft size={20} /> Back to Jobs
            </button>

            <div className="job-info-card">
              <div className="job-info-header">
                <div className="company-logo-large">
                  {jobDetails?.companyName?.charAt(0)?.toUpperCase() || "C"}
                </div>
                <div>
                  <h2>{jobDetails?.title || "Internship Position"}</h2>
                  <p className="company-name">
                    {jobDetails?.companyName || "Company"}
                  </p>
                </div>
              </div>

              <div className="job-info-details">
                <div className="info-item">
                  <span className="info-label">Location</span>
                  <span className="info-value">
                    {jobDetails?.location || "Sri Lanka"}
                  </span>
                </div>
                <div className="info-item">
                  <span className="info-label">Category</span>
                  <span className="info-value">
                    {jobDetails?.category || "Software"}
                  </span>
                </div>
                <div className="info-item">
                  <span className="info-label">Salary</span>
                  <span className="info-value">
                    LKR {jobDetails?.salary || "Negotiable"}
                  </span>
                </div>
                <div className="info-item">
                  <span className="info-label">Positions</span>
                  <span className="info-value">
                    {jobDetails?.vacancy || "N/A"} Available
                  </span>
                </div>
              </div>

              {jobDetails?.description && (
                <div className="job-description">
                  <h3>About this position</h3>
                  <p>{jobDetails.description}</p>
                </div>
              )}

              <div className="application-tips">
                <h3>💡 Application Tips</h3>
                <ul>
                  <li>Ensure your resume is up to date</li>
                  <li>Highlight relevant skills and experience</li>
                  <li>Write a compelling personal statement</li>
                  <li>Double‑check all information before submitting</li>
                </ul>
              </div>
            </div>
          </div>

          {/* RIGHT: Form */}
          <div className="apply-right">
            <div className="form-card">
              {/* Progress */}
              <div className="progress-section">
                <div className="progress-header">
                  <h3>Application Progress</h3>
                  <span className="progress-percentage">
                    {Math.round(getProgress())}%
                  </span>
                </div>
                <div className="progress-bar-container">
                  <div
                    className="progress-bar-fill"
                    style={{ width: `${getProgress()}%` }}
                  ></div>
                </div>
                <div className="progress-steps">
                  <div className={`step ${getStep() >= 1 ? "active" : ""}`}>
                    <div className="step-icon">1</div>
                    <span>Basic Info</span>
                  </div>
                  <div className={`step ${getStep() >= 2 ? "active" : ""}`}>
                    <div className="step-icon">2</div>
                    <span>Details</span>
                  </div>
                  <div className={`step ${getStep() >= 3 ? "active" : ""}`}>
                    <div className="step-icon">3</div>
                    <span>Complete</span>
                  </div>
                </div>
              </div>

              <div className="form-header">
                <h1>Submit Your Application</h1>
                <p>Complete all fields to apply for this position</p>
              </div>

              <form className="application-form" onSubmit={(e) => e.preventDefault()}>
                {/* Name */}
                <div className="form-group">
                  <label>
                    <User size={18} /> Full Name <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      setErrors((prev) => ({ ...prev, name: "" }));
                    }}
                    className={errors.name ? "error" : ""}
                  />
                  {errors.name && <span className="error-message">{errors.name}</span>}
                </div>

                {/* Email */}
                <div className="form-group">
                  <label>
                    <Mail size={18} /> Email Address <span className="required">*</span>
                  </label>
                  <input
                    type="email"
                    placeholder="your.email@example.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setErrors((prev) => ({ ...prev, email: "" }));
                    }}
                    className={errors.email ? "error" : ""}
                  />
                  {errors.email && <span className="error-message">{errors.email}</span>}
                </div>

                {/* About */}
                <div className="form-group">
                  <label>
                    <FileText size={18} /> Why should we hire you?{" "}
                    <span className="required">*</span>
                  </label>
                  <textarea
                    placeholder="Tell us about your experience, motivation, and what makes you a great fit..."
                    value={about}
                    onChange={(e) => {
                      setAbout(e.target.value);
                      setErrors((prev) => ({ ...prev, about: "" }));
                    }}
                    rows="6"
                    className={errors.about ? "error" : ""}
                  />
                  <div className="char-count">{about.length} / 500 characters</div>
                  {errors.about && <span className="error-message">{errors.about}</span>}
                </div>

                {/* Skills */}
                <div className="form-group">
                  <label>
                    <Award size={18} /> Skills <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Type a skill and press Enter"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={addSkill}
                    className={errors.skills && skills.length === 0 ? "error" : ""}
                  />
                  {errors.skills && skills.length === 0 && (
                    <span className="error-message">{errors.skills}</span>
                  )}
                  <div className="skills-container">
                    {skills.map((skill, index) => (
                      <div className="skill-tag" key={index}>
                        <span>{skill}</span>
                        <button
                          type="button"
                          onClick={() => removeSkill(index)}
                          className="remove-skill"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                  <small className="form-hint">Press Enter after typing each skill</small>
                </div>

                {/* File Upload */}
                <div className="form-group">
                  <label>
                    <Upload size={18} /> Resume / CV <span className="required">*</span>
                  </label>
                  <div
                    className={`file-upload-box ${errors.file ? "error" : ""} ${
                      file ? "has-file" : ""
                    }`}
                    onClick={() => document.getElementById("fileInput").click()}
                  >
                    {file ? (
                      <div className="file-info">
                        <CheckCircle size={32} className="file-icon-success" />
                        <div>
                          <p className="file-name">{file.name}</p>
                          <p className="file-size">
                            {(file.size / 1024).toFixed(2)} KB
                          </p>
                        </div>
                        <button
                          type="button"
                          className="remove-file"
                          onClick={(e) => {
                            e.stopPropagation();
                            setFile(null);
                            setErrors((prev) => ({ ...prev, file: "" }));
                          }}
                        >
                          <X size={20} />
                        </button>
                      </div>
                    ) : (
                      <div className="file-upload-prompt">
                        <Upload size={48} className="upload-icon" />
                        <p className="upload-text">Click to upload your resume</p>
                        <p className="upload-hint">PDF, DOC, DOCX (Max 5MB)</p>
                      </div>
                    )}
                  </div>
                  <input
                    id="fileInput"
                    type="file"
                    hidden
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => {
                      setFile(e.target.files[0]);
                      setErrors((prev) => ({ ...prev, file: "" }));
                    }}
                  />
                  {errors.file && <span className="error-message">{errors.file}</span>}
                </div>

                <button
                  type="button"
                  className="submit-btn"
                  onClick={submitForm}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner"></span> Submitting...
                    </>
                  ) : (
                    <>
                      <Send size={20} /> Submit Application
                    </>
                  )}
                </button>

                <p className="form-footer-text">
                  By submitting this application, you agree to our Terms of
                  Service and Privacy Policy.
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Success Popup */}
      {popup && (
        <div className="success-overlay">
          <div className="success-popup">
            <div className="success-icon">
              <CheckCircle size={64} />
            </div>
            <h2>Application Submitted Successfully! 🎉</h2>
            <p>
              Thank you for applying! We will review your application and get
              back to you soon.
            </p>
            <div className="success-animation">
              {[...Array(6)].map((_, i) => (
                <div className="confetti" key={i}></div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Apply;