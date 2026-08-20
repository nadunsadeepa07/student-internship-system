import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import JobDetails from "./JobDetails";
import Login from "./Login";
import { Sparkles, Sun, Moon } from "lucide-react";
import "../styles/InternshipSearch.css";
import { getStoredUser, safeGetJSON } from "../utils/storage";

function InternshipSearch() {
  const [jobs, setJobs] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("");
  const [experience, setExperience] = useState("");
  const [sortBy, setSortBy] = useState("latest");
  const [savedJobs, setSavedJobs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedJobId, setSelectedJobId] = useState(null);

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [pendingApplyJobId, setPendingApplyJobId] = useState(null);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");

  // ✅ Dark Mode state
  const [darkMode, setDarkMode] = useState(false);

  const itemsPerPage = 12;

  useEffect(() => {
    axios
      .get("https://student-internship-system.vercel.app/api/jobs")
      .then((res) => setJobs(res.data))
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    const saved = safeGetJSON("savedJobs", []);
    setSavedJobs(saved);
  }, []);

  // ✅ Load saved theme (or system preference) on first mount
  useEffect(() => {
    const stored = localStorage.getItem("theme");
    const prefersDark =
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initialDark = stored ? stored === "dark" : prefersDark;
    setDarkMode(initialDark);
  }, []);

  // ✅ Apply theme to <html> so it cascades globally, and persist it
  useEffect(() => {
    document.documentElement.setAttribute(
      "data-theme",
      darkMode ? "dark" : "light"
    );
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  const toggleSaveJob = (id) => {
    let updated = savedJobs.includes(id)
      ? savedJobs.filter((i) => i !== id)
      : [...savedJobs, id];
    setSavedJobs(updated);
    localStorage.setItem("savedJobs", JSON.stringify(updated));
  };

  // ✅ Helper function - user company එකක්ද යන්න check කරයි
  // ඔබේ actual field name හා values මෙහි match කරන්න
  const isCompanyUser = (user) => {
    if (!user) return false;

    // Possible field names සියල්ල check කරන්න
    const role = (
      user.role ||
      user.userType ||
      user.type ||
      user.accountType ||
      ""
    ).toString().toLowerCase();

    return role === "company";
  };

  // ✅ Helper function - user student කෙනෙක්ද යන්න check කරයි
  const isStudentUser = (user) => {
    if (!user) return false;

    const role = (
      user.role ||
      user.userType ||
      user.type ||
      user.accountType ||
      ""
    ).toString().toLowerCase();

    return role === "student";
  };

  // ✅ FIXED: Handle Apply Button Click with Correct Role Check
  const handleApplyClick = (jobId) => {
    const userStr = localStorage.getItem("user");

    // 🔍 Debug: Console එකෙන් actual data බලන්න
    console.log("=== Apply Click Debug ===");
    console.log("Raw user string:", userStr);

    // Case 1: Not logged in → Show Login Modal
    if (!userStr) {
      console.log("Case 1: Not logged in");
      setPendingApplyJobId(jobId);
      setShowLoginModal(true);
      return;
    }

    // Parse user data
    let user;
    try {
      user = JSON.parse(userStr);
      console.log("Parsed user object:", user);
      console.log("user.role:", user.role);
      console.log("user.userType:", user.userType);
      console.log("user.type:", user.type);
    } catch (e) {
      console.log("Parse error - showing login");
      setPendingApplyJobId(jobId);
      setShowLoginModal(true);
      return;
    }

    // Case 2: Company user → Show Error
    if (isCompanyUser(user)) {
      console.log("Case 2: Company user - showing error");
      setErrorMessage(
        "⚠️ Companies cannot apply for internships! Only students can apply for internship positions. Please log in with a student account to apply."
      );
      setShowErrorModal(true);
      return;
    }

    // Case 3: Student user → Proceed to apply
    if (isStudentUser(user)) {
      console.log("Case 3: Student user - redirecting to apply");
      window.location.href = `/apply?jobId=${jobId}`;
      return;
    }

    // ⚠️ Case 4: Role field නොමැති නම් - Default student ලෙස treat කරන්න
    // (Company login විටදී role field set වෙන බව guarantee කරන්න)
    console.log("Case 4: No recognizable role found");
    console.log("Full user object:", JSON.stringify(user, null, 2));

    // Default: Student ලෙස allow කරන්න
    // (ඔබේ Login.jsx හි company users සඳහා role="company" set කරන්නේ නම්
    //  company users Case 2 හිදී catch වේ)
    window.location.href = `/apply?jobId=${jobId}`;
  };

  // ✅ FIXED: After Login Success - check role then redirect
  const handleLoginClose = () => {
    setShowLoginModal(false);

    const userStr = localStorage.getItem("user");
    console.log("=== Login Close Debug ===");
    console.log("User after login:", userStr);

    if (userStr && pendingApplyJobId) {
      try {
        const user = JSON.parse(userStr);
        console.log("Parsed user after login:", user);

        // Company user login වූවා නම් → Error show කරන්න
        if (isCompanyUser(user)) {
          setErrorMessage(
            "⚠️ You logged in as a Company! Companies cannot apply for internships. Please log in with a student account to apply."
          );
          setShowErrorModal(true);
          setPendingApplyJobId(null);
          return;
        }

        // Student user → Apply page redirect
        window.location.href = `/apply?jobId=${pendingApplyJobId}`;

      } catch (e) {
        console.error("Error parsing user data:", e);
      }
    }

    setPendingApplyJobId(null);
  };

  // ✅ Get current user info for navbar
  const getCurrentUser = () => {
    const userStr = localStorage.getItem("user");
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  };

  const currentUser = getCurrentUser();

  // ✅ Handle Logout
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setNotificationMessage("✅ Successfully logged out!");
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
    window.location.reload();
  };

  const filtered = useMemo(() => {
    let data = jobs.filter((job) => {
      const matchKeyword =
        job.title?.toLowerCase().includes(keyword.toLowerCase()) ||
        job.description?.toLowerCase().includes(keyword.toLowerCase());
      const matchLocation =
        !location ||
        job.location?.toLowerCase().includes(location.toLowerCase());
      const matchCategory =
        !category ||
        job.category?.toLowerCase().includes(category.toLowerCase());
      const matchExperience =
        !experience ||
        job.experience?.toLowerCase().includes(experience.toLowerCase());
      return matchKeyword && matchLocation && matchCategory && matchExperience;
    });

    if (sortBy === "salary-high")
      data.sort((a, b) => parseInt(b.salary) - parseInt(a.salary));
    if (sortBy === "salary-low")
      data.sort((a, b) => parseInt(a.salary) - parseInt(b.salary));
    if (sortBy === "title")
      data.sort((a, b) => a.title.localeCompare(b.title));

    return data;
  }, [jobs, keyword, location, category, experience, sortBy]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filtered.slice(startIndex, startIndex + itemsPerPage);
  const totalCompanies = [...new Set(jobs.map((j) => j.companyName))].length;

  return (
    <div className="search-page">

      {/* NOTIFICATION TOAST */}
      {showNotification && (
        <div className="notification-toast">
          {notificationMessage}
        </div>
      )}

      {/* ERROR MODAL */}
      {showErrorModal && (
        <div
          className="error-modal-overlay"
          onClick={() => setShowErrorModal(false)}
        >
          <div
            className="error-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="error-modal-icon">
              <svg
                width="64"
                height="64"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#ef4444"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="15" y1="9" x2="9" y2="15" />
                <line x1="9" y1="9" x2="15" y2="15" />
              </svg>
            </div>

            <h2 className="error-modal-title">Access Denied</h2>
            <p className="error-modal-message">{errorMessage}</p>

            <div className="error-modal-info">
              <div className="error-info-item">
                <span className="error-info-icon">🏢</span>
                <span>Company accounts → Post internships only</span>
              </div>
              <div className="error-info-item">
                <span className="error-info-icon">🎓</span>
                <span>Student accounts → Apply for internships</span>
              </div>
            </div>

            <div className="error-modal-buttons">
              <button
                className="error-modal-close-btn"
                onClick={() => setShowErrorModal(false)}
              >
                Got it
              </button>
              <button
                className="error-modal-switch-btn"
                onClick={() => {
                  setShowErrorModal(false);
                  localStorage.removeItem("user");
                  localStorage.removeItem("token");
                  setShowLoginModal(true);
                }}
              >
                Switch to Student Login
              </button>
            </div>
          </div>
        </div>
      )}

      {/* LOGIN MODAL */}
      {showLoginModal && (
        <Login
          initialMode="login"
          onClose={handleLoginClose}
        />
      )}

      {/* JOB DETAILS MODAL */}
      {selectedJobId && (
        <div
          className="job-modal-overlay"
          onClick={() => setSelectedJobId(null)}
        >
          <div
            className="job-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="job-modal-close"
              onClick={() => setSelectedJobId(null)}
            >
              ✕
            </button>
            <JobDetails id={selectedJobId} isModal={true} />
          </div>
        </div>
      )}

      <div className="bg-blur blur-1"></div>
      <div className="bg-blur blur-2"></div>
      <div className="bg-grid"></div>

      {/* Navbar */}
      <nav>
        <div className="logo-section">
          <div className="logo-box">
            <Sparkles size={24} />
          </div>
          <div className="logo">
            SIMS <span>Portal</span>
          </div>
        </div>
        <div className="nav-links"></div>
        <div className="nav-auth-section">
          {/* ✅ Dark Mode Toggle */}
          <button
            className="theme-toggle-btn"
            onClick={toggleDarkMode}
            aria-label="Toggle dark mode"
            title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            <span className={`theme-toggle-icon ${darkMode ? "spin-in" : ""}`}>
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </span>
          </button>

          {currentUser ? (
            <div className="user-info-nav">
              <div className="user-avatar-nav">
                {currentUser.name?.charAt(0)?.toUpperCase() ||
                  currentUser.email?.charAt(0)?.toUpperCase() || "U"}
              </div>
              <div className="user-details-nav">
                <span className="user-name-nav">
                  {currentUser.name || currentUser.email}
                </span>
                <span
                  className={`user-role-badge ${
                    isCompanyUser(currentUser) ? "role-company" : "role-student"
                  }`}
                >
                  {isCompanyUser(currentUser) ? "🏢 Company" : "🎓 Student"}
                </span>
              </div>
              <button className="logout-btn-nav" onClick={handleLogout}>
                Logout
              </button>
            </div>
          ) : (
            <button
              className="login-btn"
              onClick={() => setShowLoginModal(true)}
            >
              Login
            </button>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-left">
          <div className="hero-badge">🚀 2026 Internship Opportunities</div>
          <h1>
            Discover Your <span>Dream Internship</span>
          </h1>
          <p>
            Explore internships from top companies, filter by category,
            location and apply instantly.
          </p>
          <div className="hero-buttons">
            <button className="hero-primary">Browse Jobs</button>
            <button className="hero-secondary">Explore Companies</button>
          </div>
        </div>

        <div className="hero-right">
          <div className="hero-card floating-card">
            <h3>🔥 Trending Skills</h3>
            <div className="skills-wrap">
              {["React", "Node.js", "MongoDB", "UI/UX", "Java", "Python"].map(
                (skill) => (
                  <span key={skill}>{skill}</span>
                )
              )}
            </div>
          </div>
          <div className="hero-stats">
            <div className="hero-stat-card">
              <h2>{jobs.length}+</h2>
              <p>Internships</p>
            </div>
            <div className="hero-stat-card">
              <h2>{totalCompanies}+</h2>
              <p>Companies</p>
            </div>
            <div className="hero-stat-card">
              <h2>24/7</h2>
              <p>Support</p>
            </div>
          </div>
        </div>
      </section>

      {/* Search Panel */}
      <div className="search-panel">
        <div className="search-header">
          <div>
            <h2>Search Internships</h2>
            <p>Find internships that match your skills.</p>
          </div>
          <div className="result-count">{filtered.length} Results</div>
        </div>
        <div className="search-grid">
          <input
            type="text"
            placeholder="Search title or skills..."
            value={keyword}
            onChange={(e) => {
              setKeyword(e.target.value);
              setCurrentPage(1);
            }}
          />
          <select
            value={location}
            onChange={(e) => {
              setLocation(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="">All Locations</option>
            <option value="colombo">Colombo</option>
            <option value="kandy">Kandy</option>
            <option value="galle">Galle</option>
          </select>
          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="">All Categories</option>
            <option value="software">Software</option>
            <option value="marketing">Marketing</option>
            <option value="design">Design</option>
          </select>
          <select
            value={experience}
            onChange={(e) => {
              setExperience(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="">Experience</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="latest">Latest</option>
            <option value="salary-high">Salary High</option>
            <option value="salary-low">Salary Low</option>
            <option value="title">A-Z</option>
          </select>
        </div>
      </div>

      {/* Jobs Section */}
      <section className="jobs-section">
        {currentItems.length > 0 ? (
          currentItems.map((item) => (
            <div className="job-card" key={item._id}>
              <div className="job-top">
                <div className="company-logo">
                  {item.companyName?.charAt(0)?.toUpperCase() || "C"}
                </div>
                <button
                  className={
                    savedJobs.includes(item._id) ? "save-btn active" : "save-btn"
                  }
                  onClick={() => toggleSaveJob(item._id)}
                >
                  ♥
                </button>
              </div>
              <div className="job-category">{item.category || "Software"}</div>
              <h3>{item.title}</h3>
              <div className="company-line">
                {item.companyName || "Company"} • {item.location || "Sri Lanka"}
              </div>
              <p>{item.description?.slice(0, 120)}...</p>
              <div className="job-tags">
                {item.salary && (
                  <span className="salary-tag">💰 {item.salary}</span>
                )}
                {item.vacancy && (
                  <span className="vacancy-tag">👨‍🎓 {item.vacancy} Seats</span>
                )}
              </div>
              <div className="card-footer">
                <button
                  className="details-btn"
                  onClick={() => setSelectedJobId(item._id)}
                >
                  Details
                </button>
                <button
                  className="apply-btn"
                  onClick={() => handleApplyClick(item._id)}
                >
                  Apply Now
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-state">
            <h2>No internships found</h2>
            <p>Try changing filters or search keyword.</p>
          </div>
        )}
      </section>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
          >
            ←
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              className={currentPage === i + 1 ? "active" : ""}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
          >
            →
          </button>
        </div>
      )}

      {/* Footer */}
      <footer className="footer">
        <div className="footer-grid">
          <div>
            <h3>InternHub</h3>
            <p>Advanced Internship Management Platform for students and companies.</p>
          </div>
          <div>
            <h4>Quick Links</h4>
            <a href="/">Home</a>
            <a href="/student-dashboard">Student</a>
            <a href="/company-dashboard">Company</a>
          </div>
          <div>
            <h4>Contact</h4>
            <p>support@internhub.com</p>
            <p>+94 77 123 4567</p>
          </div>
        </div>
        <div className="footer-bottom">
          © 2026 Internship Management System. All Rights Reserved.
        </div>
      </footer>
    </div>
  );
}

export default InternshipSearch;