import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  LogOut,
  Sparkles,
  Moon,
  Sun,
  Menu,
  X,
  Bell,
  Briefcase,
  CheckCircle,
  Clock,
  XCircle,
  Bookmark,
  Search,
} from "lucide-react";
import { getStoredUser } from "../utils/storage";
import "../styles/StudentDashboard.css";

function StudentDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [applications, setApplications] = useState([]);
  const [myApplications, setMyApplications] = useState([]);
  const [allJobs, setAllJobs] = useState([]);
  const [showJobs] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [bookmarks, setBookmarks] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const notifications = [
    "New internship posted",
    "Your application accepted",
    "Interview scheduled tomorrow",
  ];

  // ---------- THEME ----------
  useEffect(() => {
    const stored = localStorage.getItem("theme");
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
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  // ---------- LOGOUT ----------
  const handleLogout = () => {
    if (!window.confirm("Are you sure you want to logout?")) return;
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    window.location.href = "/#";
  };

  // ---------- LOAD USER & APPLICATIONS ----------
  useEffect(() => {
    const stored = getStoredUser();
    if (stored) {
      setUser(stored);
      fetchMyApplications(stored._id);
    } else {
      navigate("/");
    }
  }, [navigate]);

  const fetchMyApplications = async (userId) => {
    try {
      const res = await axios.get(
        `https://student-internship-system.vercel.app/api/student/applications/${userId}`
      );
      setMyApplications(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // ---------- LOAD JOBS ----------
  useEffect(() => {
    axios
      .get("https://student-internship-system.vercel.app/api/jobs")
      .then((res) => setAllJobs(res.data))
      .catch((err) => console.log(err));
  }, []);

  // ---------- DUMMY APPLICATIONS (for stats) ----------
  useEffect(() => {
    setApplications([
      { id: 1, title: "Frontend Developer Intern", company: "TechCorp", applied: "2 days ago", status: "Accepted" },
      { id: 2, title: "UI/UX Designer", company: "DesignHub", applied: "1 week ago", status: "Pending" },
      { id: 3, title: "Backend Developer", company: "CloudBase", applied: "5 days ago", status: "Rejected" },
    ]);
  }, []);

  // ---------- STATS ----------
  const stats = {
    total: applications.length,
    accepted: applications.filter((a) => a.status === "Accepted").length,
    pending: applications.filter((a) => a.status === "Pending").length,
    rejected: applications.filter((a) => a.status === "Rejected").length,
  };

  const profileProgress = 82;

  // ---------- FILTER JOBS ----------
  const filteredJobs = allJobs.filter((job) => {
    const matchesSearch = job.title?.toLowerCase().includes(searchTerm.toLowerCase());
    const studentJobTitle = user?.jobTitle?.toLowerCase().trim();
    const jobCategory = job.category?.toLowerCase().trim();
    const matchesStudentTitle = !studentJobTitle || studentJobTitle === jobCategory;
    const matchesDropdown = selectedCategory === "All" || job.category === selectedCategory;
    return matchesSearch && matchesStudentTitle && matchesDropdown;
  });

  // ---------- BOOKMARK ----------
  const toggleBookmark = (id) => {
    if (bookmarks.includes(id)) {
      setBookmarks(bookmarks.filter((b) => b !== id));
    } else {
      setBookmarks([...bookmarks, id]);
    }
  };

  // ---------- RENDER ----------
  return (
    <div className={`sd-wrapper ${darkMode ? "dark-mode" : ""}`}>
      {/* ===== SIDEBAR TOGGLE (mobile) ===== */}
      <button className="sidebar-toggle-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* ===== SIDEBAR ===== */}
      <aside className={`sd-sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="logo-section">
          <div className="logo-box">
            <Sparkles size={24} />
          </div>
          <div>
            <div className="logo">SIMS <span>Portal</span></div>
            <p>Student</p>
          </div>
        </div>

        {/* PROFILE */}
        <div className="sd-profile-card">
          <div className="sd-avatar">{user?.username?.charAt(0)}</div>
          <h3>{user?.username}</h3>
          <span>{user?.email}</span>
          <div className="sd-user-details">
            <p>📍 {user?.address || "No Address"}</p>
            <p>📞 {user?.mobile || "No Mobile"}</p>
            <p>🏙️ {user?.district || "No District"}</p>
            <p>💼 {user?.jobTitle || "No Job Title"}</p>
          </div>
          <div className="sd-progress-area">
            <div className="sd-progress-top">
              <p>Profile Completion</p>
              <p>{profileProgress}%</p>
            </div>
            <div className="sd-progress-bar">
              <div className="sd-progress-fill" style={{ width: `${profileProgress}%` }} />
            </div>
          </div>
        </div>

        {/* MENU */}
        <div className="sd-menu">
          <button className="active">Dashboard</button>
          <button>Interviews</button>
          <button>Settings</button>
          <button onClick={() => navigate("/cvbuilder")}>Open Smart CV Builder</button>
        </div>

        <button className="logout-btn" onClick={handleLogout}>
          <LogOut size={18} /> Logout
        </button>

        <button className="theme-togglee-btn" onClick={toggleDarkMode}>
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          {darkMode ? " Light Mode" : " Dark Mode"}
        </button>
      </aside>

      {/* ===== MAIN CONTENT ===== */}
      <main className="sd-main">
        {/* HERO */}
        <div className="sd-hero">
          <div>
            <h1>Welcome back, {user?.username} 👋</h1>
            <p>Track applications and discover new internship opportunities.</p>
          </div>
          <div className="sd-hero-circle"></div>
        </div>

        {/* STATS */}
        <div className="sd-stats-grid">
          <div className="sd-stat-card">
            <Briefcase size={24} />
            <h1>{stats.total}</h1>
            <p>Total Applied</p>
          </div>
          <div className="sd-stat-card accepted">
            <CheckCircle size={24} />
            <h1>{stats.accepted}</h1>
            <p>Accepted</p>
          </div>
          <div className="sd-stat-card pending">
            <Clock size={24} />
            <h1>{stats.pending}</h1>
            <p>Pending</p>
          </div>
          <div className="sd-stat-card rejected">
            <XCircle size={24} />
            <h1>{stats.rejected}</h1>
            <p>Rejected</p>
          </div>
        </div>

        {/* SEARCH & FILTER */}
        <div className="sd-search-box">
          <div className="search-input-wrapper">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search internships..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="sd-dropdown"
          >
            <option value="All">All Categories</option>
            <option value="Engineering">Engineering</option>
            <option value="Design">Design</option>
            <option value="Data">Data</option>
            <option value="Marketing">Marketing</option>
          </select>
        </div>

        {/* JOBS */}
        {showJobs && (
          <div className="sd-jobs-wrapper">
            <div className="sd-section-header">
              <h2>Available Internships</h2>
              <span>{filteredJobs.length} Open</span>
            </div>

            <div className="jobb-grid">
              {filteredJobs.map((job) => (
                <div className="jobb-card" key={job._id}>
                  <div className="jobb-left">
                    <div className="jobb-main">
                      <h3 className="jobb-title">{job.title}</h3>
                      <p className="jobb-description">{job.description?.slice(0, 90)}...</p>
                      <div className="jobb-meta">
                        {job.category && <span className="meta-tag category">{job.category}</span>}
                        {job.salary && <span className="meta-tag salary">Rs. {job.salary}</span>}
                        {job.vacancy && <span className="meta-tag vacancy">{job.vacancy} Seats</span>}
                      </div>
                    </div>
                  </div>
                  <div className="jobb-right">
                    <button className="bookmark-btn" onClick={() => toggleBookmark(job._id)}>
                      {bookmarks.includes(job._id) ? "★" : "☆"}
                    </button>
                    <button className="applyy-btn" onClick={() => navigate(`/apply?jobId=${job._id}`)}>
                      Apply now
                    </button>
                  </div>
                </div>
              ))}
              {filteredJobs.length === 0 && (
                <div className="empty-state">No internships found</div>
              )}
            </div>
          </div>
        )}

        {/* MY APPLICATION UPDATES */}
        <div className="student-notifications">
          <h2>My Application Updates</h2>
          {myApplications.length === 0 ? (
            <div className="notify-empty">No application updates yet</div>
          ) : (
            myApplications.map((app) => (
              <div key={app._id} className={`notify-card notify-card--${app.status.toLowerCase()}`}>
                <div className="notify-card__header">
                  <div className="notify-avatar">{app.studentName?.charAt(0)}</div>
                  <div className="notify-info">
                    <p className="notify-name">{app.studentName}</p>
                    <p className="notify-email">{app.studentEmail}</p>
                  </div>
                  <span className={`notify-badge notify-badge--${app.status.toLowerCase()}`}>
                    <span className="notify-dot" /> {app.status}
                  </span>
                </div>
                <div className="notify-card__meta">
                  <span className="notify-meta-item">🏢 {app.companyId?.username || "Unknown Company"}</span>
                  {app.jobId?.title && <span className="notify-meta-item">💼 {app.jobId.title}</span>}
                </div>
                <div className="notify-card__body">
                  {app.status === "Accepted" && (
                    <div className="notify-interview">
                      <span>📅 {app.interviewDate}</span>
                      <span>⏰ {app.interviewTime}</span>
                    </div>
                  )}
                  {app.status === "Rejected" && (
                    <p className="notify-message notify-message--rejected">
                      Your application has been closed by the company.
                    </p>
                  )}
                  {app.status === "Pending" && (
                    <p className="notify-message notify-message--pending">
                      Waiting for company response.
                    </p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}

export default StudentDashboard;