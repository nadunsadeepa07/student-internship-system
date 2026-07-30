import React, {
  useEffect,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";

import axios from "axios";

import {
  LogOut,
  Sparkles,
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

  const [notifications] = useState([
    "New internship posted",
    "Your application accepted",
    "Interview scheduled tomorrow",
  ]);

  /* ============================
     CHAT POPUP STATE
  ============================ */
  const [chatOpen, setChatOpen] = useState(false);

  /* LOGOUT */
  const handleLogout = () => {
    const confirmLogout = window.confirm(
      "Are you sure you want to logout?"
    );
    if (!confirmLogout) return;

    localStorage.removeItem("user");
    localStorage.removeItem("token");
    window.location.href = "/#";
  };

  /* LOAD USER */
  useEffect(() => {
    const stored = getStoredUser();

    if (stored) {
      setUser(stored);
      fetchMyApplications();
    } else {
      navigate("/");
    }
  }, [navigate]);

  /* LOAD JOBS */
  useEffect(() => {
    axios
      .get("https://student-internship-system-7k5pqi68j-internship-project1.vercel.app/api/jobs")
      .then((res) => setAllJobs(res.data))
      .catch((err) => console.log(err));
  }, []);

  const fetchMyApplications = async () => {
    try {
      const user = getStoredUser();
      if (!user) return;

      const res = await axios.get(
        `https://student-internship-system-7k5pqi68j-internship-project1.vercel.app/api/student/applications/${user._id}`
      );

      console.log("MY APPLICATIONS:", res.data);
      setMyApplications(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  /* DUMMY APPLICATIONS */
  useEffect(() => {
    setApplications([
      {
        id: 1,
        title: "Frontend Developer Intern",
        company: "TechCorp",
        applied: "2 days ago",
        status: "Accepted",
      },
      {
        id: 2,
        title: "UI/UX Designer",
        company: "DesignHub",
        applied: "1 week ago",
        status: "Pending",
      },
      {
        id: 3,
        title: "Backend Developer",
        company: "CloudBase",
        applied: "5 days ago",
        status: "Rejected",
      },
    ]);
  }, []);

  /* STATS */
  const stats = {
    total: applications.length,
    accepted: applications.filter(
      (a) => a.status === "Accepted"
    ).length,
    pending: applications.filter(
      (a) => a.status === "Pending"
    ).length,
    rejected: applications.filter(
      (a) => a.status === "Rejected"
    ).length,
  };

  const profileProgress = 82;

  /* FILTER JOBS */
  const filteredJobs = allJobs.filter((job) => {
    const matchesSearch = job.title
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());

    const studentJobTitle = user?.jobTitle
      ?.toLowerCase()
      .trim();

    const jobCategory = job.category
      ?.toLowerCase()
      .trim();

    const matchesStudentTitle =
      !studentJobTitle ||
      studentJobTitle === jobCategory;

    const matchesDropdown =
      selectedCategory === "All" ||
      job.category === selectedCategory;

    return (
      matchesSearch &&
      matchesStudentTitle &&
      matchesDropdown
    );
  });

  /* BOOKMARK */
  const toggleBookmark = (id) => {
    if (bookmarks.includes(id)) {
      setBookmarks(
        bookmarks.filter((b) => b !== id)
      );
    } else {
      setBookmarks([...bookmarks, id]);
    }
  };

  return (
    <div
      className={`sd-wrapper ${
        darkMode ? "dark-mode" : ""
      }`}
    >

      {/* SIDEBAR */}
      <aside className="sd-sidebar">

        <div className="logo-section">
          <div className="logo-box">
            <Sparkles size={24} />
          </div>
          <div>
            <div className="logo">
              SIMS <span>Portal</span>
            </div>
            <p>Student</p>
          </div>
        </div>

        {/* PROFILE */}
        <div className="sd-profile-card">
          <div className="sd-avatar">
            {user?.username?.charAt(0)}
          </div>
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
              <div
                className="sd-progress-fill"
                style={{
                  width: `${profileProgress}%`,
                }}
              />
            </div>
          </div>
        </div>

        {/* MENU */}
        <div className="sd-menu">
          <button>Dashboard</button>
          <button>Interviews</button>
          <button>Settings</button>
          <button
            onClick={() => navigate("/cvbuilder")}
          >
            Open Smart CV Builder
          </button>
        </div>

        {/* LOGOUT */}
        <button
          className="logout-btn"
          onClick={handleLogout}
        >
          <LogOut size={18} />
          Logout
        </button>

        {/* DARK MODE */}
        <button
          className="sd-logoutt"
          onClick={() => setDarkMode(!darkMode)}
        >
          {darkMode ? "☀ Light Mode" : "🌙 Dark Mode"}
        </button>

      </aside>

      {/* MAIN */}
      <main className="sd-main">

        <div className="sd-hero">
          <div>
            <h1>Welcome back, {user?.username}</h1>
            <p>
              Track applications and discover new
              internship opportunities.
            </p>
          </div>
          <div className="sd-hero-circle"></div>
        </div>

        {/* STATS */}
        <div className="sd-stats-grid">
          <div className="sd-stat-card">
            <h1>{stats.total}</h1>
            <p>Total Applied</p>
          </div>
          <div className="sd-stat-card accepted">
            <h1>{stats.accepted}</h1>
            <p>Accepted</p>
          </div>
          <div className="sd-stat-card pending">
            <h1>{stats.pending}</h1>
            <p>Pending</p>
          </div>
          <div className="sd-stat-card rejected">
            <h1>{stats.rejected}</h1>
            <p>Rejected</p>
          </div>
        </div>

        {/* SEARCH */}
        <div className="sd-search-box">
          <input
            type="text"
            placeholder="Search internships..."
            value={searchTerm}
            onChange={(e) =>
              setSearchTerm(e.target.value)
            }
          />
          <select
            value={selectedCategory}
            onChange={(e) =>
              setSelectedCategory(e.target.value)
            }
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
                      <h3 className="jobb-title">
                        {job.title}
                      </h3>
                      <p className="jobb-description">
                        {job.description?.slice(0, 90)}...
                      </p>
                      <div className="jobb-meta">
                        {job.category && (
                          <span className="meta-tag category">
                            {job.category}
                          </span>
                        )}
                        {job.salary && (
                          <span className="meta-tag salary">
                            Rs. {job.salary}
                          </span>
                        )}
                        {job.vacancy && (
                          <span className="meta-tag vacancy">
                            {job.vacancy} Seats
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="jobb-right">
                    <button
                      className="bookmark-btn"
                      onClick={() =>
                        toggleBookmark(job._id)
                      }
                    >
                      {bookmarks.includes(job._id)
                        ? "★"
                        : "☆"}
                    </button>
                    <button
                      className="applyy-btn"
                      onClick={() =>
                        navigate(
                          `/apply?jobId=${job._id}`
                        )
                      }
                    >
                      Apply now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>

      {/* MY APPLICATION UPDATES */}
      <div className="student-notifications">
        <h2>My Application Updates</h2>

        {myApplications.length === 0 ? (
          <div className="notify-empty">
            <p>No application updates yet</p>
          </div>
        ) : (
          myApplications.map((app) => (
            <div
              key={app._id}
              className={`notify-card notify-card--${app.status.toLowerCase()}`}
            >
              <div className="notify-card__header">
                <div className="notify-avatar">
                  {app.studentName?.charAt(0)}
                </div>
                <div className="notify-info">
                  <p className="notify-name">
                    {app.studentName}
                  </p>
                  <p className="notify-email">
                    {app.studentEmail}
                  </p>
                </div>
                <span
                  className={`notify-badge notify-badge--${app.status.toLowerCase()}`}
                >
                  <span className="notify-dot" />
                  {app.status}
                </span>
              </div>

              <div className="notify-card__meta">
                <span className="notify-meta-item">
                  🏢{" "}
                  {app.companyId?.username ||
                    "Unknown Company"}
                </span>
                {app.jobId?.title && (
                  <span className="notify-meta-item">
                    💼 {app.jobId.title}
                  </span>
                )}
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
                    Your application has been closed by
                    the company.
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

      {/* RIGHT SIDEBAR */}
     {/*} <aside className="sd-rightbar">
        <div className="sd-notification-box">
          <h3>Notifications</h3>
          {notifications.map((n, i) => (
            <div key={i} className="sd-note">
              {n}
            </div>
          ))}
        </div>
      </aside>*/}

      

    </div>
  );
}

export default StudentDashboard;