import React, { useEffect, useState, useCallback, useMemo } from "react";
import axios from "axios";
import "../styles/AdminDashboard.css"; 
import { useNavigate } from "react-router-dom";

const getToken = () =>
  localStorage.getItem("token") || sessionStorage.getItem("token");

const createApi = () =>
  axios.create({
    baseURL: "https://student-internship-system-7k5pqi68j-internship-project1.vercel.app/api/admin",
    headers: { Authorization: `Bearer ${getToken()}` },
  });

const TABS = ["overview", "students", "companies", "manageStudents", "manageCompanies", "jobs"];

const STATUS_BADGE = {
  pending:  { bg: "#FEF3C7", color: "#92400E", label: "Pending"  },
  approved: { bg: "#D1FAE5", color: "#065F46", label: "Approved" },
  rejected: { bg: "#FEE2E2", color: "#991B1B", label: "Rejected" },
};

export default function AdminDashboard() {
  const [students,    setStudents]    = useState([]);
  const [companies,   setCompanies]   = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [registeredStudents, setRegisteredStudents] = useState([]);
  const [registeredCompanies, setRegisteredCompanies] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [expiredJobs, setExpiredJobs] = useState([]);
  const [activeTab,   setActiveTab]   = useState("overview");
  const [search,      setSearch]      = useState("");
  const [toast,       setToast]       = useState(null);
  const [modal,       setModal]       = useState(null);
  const [rejectInput, setRejectInput] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // New state for enhanced functions
  const [studentSortKey, setStudentSortKey] = useState("username");
  const [studentSortDir, setStudentSortDir] = useState("asc");
  const [studentPage, setStudentPage] = useState(1);
  const [companySortKey, setCompanySortKey] = useState("username");
  const [companySortDir, setCompanySortDir] = useState("asc");
  const [companyPage, setCompanyPage] = useState(1);
  const [selectedStudents, setSelectedStudents] = useState(new Set());
  const [selectedCompanies, setSelectedCompanies] = useState(new Set());
  const [detailModal, setDetailModal] = useState(null);
  const [recentActions, setRecentActions] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [bulkRejectModal, setBulkRejectModal] = useState(null);
  const [bulkRejectReason, setBulkRejectReason] = useState("");
  const pageSize = 5;
  const navigate = useNavigate();

  const api = createApi();

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const addRecentAction = (action, entity, name) => {
    setRecentActions(prev => [
      { action, entity, name, time: new Date().toLocaleTimeString(), id: Date.now() },
      ...prev.slice(0, 4)
    ]);
  };

    const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");

    navigate("/");
  };

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get("/pending");
      setStudents(res.data.students  || []);
      setCompanies(res.data.companies || []);
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        showToast("Session expired. Redirecting to login…", "error");
        setTimeout(() => (window.location.href = "/login"), 1800);
      } else {
        showToast("Failed to load data", "error");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchJobs = async () => {
  try {
    const res = await axios.get(
      "https://student-internship-system-7k5pqi68j-internship-project1.vercel.app/api/jobs"
    );

    setJobs(res.data || []);

    const today = new Date();

    const expired = res.data.filter((job) => {
      const created = new Date(job.createdAt);

      const diff =
        (today - created) /
        (1000 * 60 * 60 * 24);

      return diff >= 30;
    });

    setExpiredJobs(expired);

  } catch (err) {
    console.log(err);
  }
};
const fetchRegisteredUsers = async () => {
  try {
    const token = localStorage.getItem("token");

    if (!token) return;

    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };

    const [studentRes, companyRes] = await Promise.all([
      axios.get("https://student-internship-system-7k5pqi68j-internship-project1.vercel.app/api/admin/students", config),
      axios.get("https://student-internship-system-7k5pqi68j-internship-project1.vercel.app/api/admin/companies", config),
    ]);

    setRegisteredStudents(studentRes.data || []);
    setRegisteredCompanies(companyRes.data || []);

  } catch (err) {
    console.log("fetchRegisteredUsers error:", err.response?.data || err.message);
  }
};


  useEffect(() => { fetchData(); fetchJobs();  fetchRegisteredUsers(); }, [fetchData]);

  const openApprove = (type, item) =>
    setModal({ type: "approve", entity: type, item, reason: "" });

  const openReject = (type, item) => {
    setRejectInput("");
    setModal({ type: "reject", entity: type, item });
  };

  const closeModal = () => { setModal(null); setRejectInput(""); };

  const confirmAction = async () => {
    if (!modal) return;
    setActionLoading(true);
    const { type, entity, item } = modal;
    try {
      if (type === "approve") {
        if (entity === "student") await api.put(`/approve-student/${item._id}`);
        else                      await api.put(`/approve-company/${item._id}`);
        showToast(`${entity === "student" ? "Student" : "Company"} approved successfully`);
        addRecentAction("approved", entity, item.username);
      } else {
        if (entity === "student")
          await api.put(`/reject-student/${item._id}`,  { rejectionReason: rejectInput });
        else
          await api.put(`/reject-company/${item._id}`, { rejectionReason: rejectInput });
        showToast(`${entity === "student" ? "Student" : "Company"} rejected`, "warning");
        addRecentAction("rejected", entity, item.username);
      }
      await fetchData();
      // Clear selections on data refresh
      setSelectedStudents(new Set());
      setSelectedCompanies(new Set());
    } catch {
      showToast("Action failed. Please try again.", "error");
    } finally {
      setActionLoading(false);
      closeModal();
    }
  };

  // Sorting and filtering helpers
  const sortData = (data, key, dir) => {
    return [...data].sort((a, b) => {
      let aVal = a[key] || "";
      let bVal = b[key] || "";
      if (typeof aVal === "string") aVal = aVal.toLowerCase();
      if (typeof bVal === "string") bVal = bVal.toLowerCase();
      if (dir === "asc") return aVal > bVal ? 1 : -1;
      return aVal < bVal ? 1 : -1;
    });
  };

  const filteredStudents = useMemo(() => {
    return students.filter(s =>
      s.username?.toLowerCase().includes(search.toLowerCase()) ||
      s.email?.toLowerCase().includes(search.toLowerCase()) ||
      s.nic?.toLowerCase().includes(search.toLowerCase())
    );
  }, [students, search]);

  const filteredCompanies = useMemo(() => {
    return companies.filter(c =>
      c.username?.toLowerCase().includes(search.toLowerCase()) ||
      c.email?.toLowerCase().includes(search.toLowerCase()) ||
      c.companyRegNo?.toLowerCase().includes(search.toLowerCase())
    );
  }, [companies, search]);

  const sortedStudents = useMemo(() => {
    return sortData(filteredStudents, studentSortKey, studentSortDir);
  }, [filteredStudents, studentSortKey, studentSortDir]);

  const sortedCompanies = useMemo(() => {
    return sortData(filteredCompanies, companySortKey, companySortDir);
  }, [filteredCompanies, companySortKey, companySortDir]);

  const paginatedStudents = useMemo(() => {
    const start = (studentPage - 1) * pageSize;
    return sortedStudents.slice(start, start + pageSize);
  }, [sortedStudents, studentPage]);

  const paginatedCompanies = useMemo(() => {
    const start = (companyPage - 1) * pageSize;
    return sortedCompanies.slice(start, start + pageSize);
  }, [sortedCompanies, companyPage]);

  const totalStudentPages = Math.ceil(sortedStudents.length / pageSize);
  const totalCompanyPages = Math.ceil(sortedCompanies.length / pageSize);

  const handleSort = (type, key) => {
    if (type === "student") {
      if (studentSortKey === key) {
        setStudentSortDir(studentSortDir === "asc" ? "desc" : "asc");
      } else {
        setStudentSortKey(key);
        setStudentSortDir("asc");
      }
      setStudentPage(1);
    } else {
      if (companySortKey === key) {
        setCompanySortDir(companySortDir === "asc" ? "desc" : "asc");
      } else {
        setCompanySortKey(key);
        setCompanySortDir("asc");
      }
      setCompanyPage(1);
    }
  };

  // Selection handlers
  const toggleSelectStudent = (id) => {
    const newSet = new Set(selectedStudents);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedStudents(newSet);
  };

  const toggleSelectCompany = (id) => {
    const newSet = new Set(selectedCompanies);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedCompanies(newSet);
  };

  const selectAllStudents = () => {
    if (selectedStudents.size === paginatedStudents.length) {
      setSelectedStudents(new Set());
    } else {
      setSelectedStudents(new Set(paginatedStudents.map(s => s._id)));
    }
  };

  const selectAllCompanies = () => {
    if (selectedCompanies.size === paginatedCompanies.length) {
      setSelectedCompanies(new Set());
    } else {
      setSelectedCompanies(new Set(paginatedCompanies.map(c => c._id)));
    }
  };

  // Bulk actions
  const bulkApprove = async () => {
    const selectedIds = activeTab === "students" ? selectedStudents : selectedCompanies;
    if (selectedIds.size === 0) {
      showToast("No items selected", "error");
      return;
    }
    if (!window.confirm(`Approve ${selectedIds.size} selected ${activeTab}?`)) return;
    setActionLoading(true);
    const entityType = activeTab === "students" ? "student" : "company";
    const promises = Array.from(selectedIds).map(id => {
      const endpoint = entityType === "student" ? `/approve-student/${id}` : `/approve-company/${id}`;
      return api.put(endpoint);
    });
    try {
      await Promise.all(promises);
      showToast(`Successfully approved ${selectedIds.size} ${entityType}(s)`);
      addRecentAction("bulk approved", entityType, `${selectedIds.size} items`);
      await fetchData();
      if (activeTab === "students") setSelectedStudents(new Set());
      else setSelectedCompanies(new Set());
    } catch (err) {
      showToast("Bulk approval failed", "error");
    } finally {
      setActionLoading(false);
    }
  };

  const openBulkReject = () => {
    const selectedIds = activeTab === "students" ? selectedStudents : selectedCompanies;
    if (selectedIds.size === 0) {
      showToast("No items selected", "error");
      return;
    }
    setBulkRejectModal({ type: activeTab === "students" ? "student" : "company", ids: selectedIds });
    setBulkRejectReason("");
  };

  const confirmBulkReject = async () => {
    if (!bulkRejectReason.trim()) {
      showToast("Please provide a rejection reason", "error");
      return;
    }
    setActionLoading(true);
    const { type, ids } = bulkRejectModal;
    const promises = Array.from(ids).map(id => {
      const endpoint = type === "student" ? `/reject-student/${id}` : `/reject-company/${id}`;
      return api.put(endpoint, { rejectionReason: bulkRejectReason });
    });
    try {
      await Promise.all(promises);
      showToast(`Rejected ${ids.size} ${type}(s)`, "warning");
      addRecentAction("bulk rejected", type, `${ids.size} items`);
      await fetchData();
      if (type === "student") setSelectedStudents(new Set());
      else setSelectedCompanies(new Set());
      setBulkRejectModal(null);
    } catch (err) {
      showToast("Bulk rejection failed", "error");
    } finally {
      setActionLoading(false);
    }
  };

  // Export CSV
  const exportToCSV = () => {
    const data = activeTab === "students" ? sortedStudents : sortedCompanies;
    if (data.length === 0) {
      showToast("No data to export", "error");
      return;
    }
    const headers = activeTab === "students" 
      ? ["Username", "Email", "NIC", "Status"]
      : ["Company Name", "Email", "Registration No.", "Status"];
    const rows = data.map(item => activeTab === "students"
      ? [item.username, item.email, item.nic, "Pending"]
      : [item.username, item.email, item.companyRegNo, "Pending"]
    );
    const csvContent = [headers, ...rows].map(row => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${activeTab}_pending_${new Date().toISOString().slice(0,19)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast("Export completed", "success");
  };

  // Detail modal
  const openDetailModal = (type, item) => {
    setDetailModal({ type, item });
  };

  const deleteJob = async (id) => {

  if (!window.confirm(
      "Delete this internship?"
  )) return;

  try {

    await axios.delete(
      `https://student-internship-system-7k5pqi68j-internship-project1.vercel.app/api/jobs/${id}`
    );

    showToast(
      "Internship deleted successfully"
    );

    fetchJobs();

  } catch {

    showToast(
      "Delete failed",
      "error"
    );
  }
};
  const blockStudent = async (id) => {
  try {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    const res = await axios.put(
      `https://student-internship-system-7k5pqi68j-internship-project1.vercel.app/api/admin/block-student/${id}`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    console.log(res.data);
    showToast("Student blocked successfully", "success");
  } catch (err) {
    console.log(err.response?.data || err.message);
    showToast(err.response?.data?.message || "Failed to block student", "error");
  } finally {
    await fetchRegisteredUsers(); // හැම විටම Refresh කරන්න
  }
};

const unblockStudent = async (id) => {
  try {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    await axios.put(
      `https://student-internship-system-7k5pqi68j-internship-project1.vercel.app/api/admin/unblock-student/${id}`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    showToast("Student unblocked successfully", "success");
  } catch (err) {
    console.log(err.response?.data || err.message);
    showToast(err.response?.data?.message || "Failed to unblock student", "error");
  } finally {
    await fetchRegisteredUsers();
  }
};


const blockCompany = async (id) => {
  try {

    const token =
  localStorage.getItem("token") ||
  sessionStorage.getItem("token");

    await axios.put(
      `https://student-internship-system-7k5pqi68j-internship-project1.vercel.app/api/admin/block-company/${id}`,
      {},
      {
        headers: {
          Authorization:
            `Bearer ${token}`,
        },
      }
    );

    fetchRegisteredUsers();

  } catch (err) {
    console.log(err);
  }finally {
    await fetchRegisteredUsers(); // හැම විටම Refresh කරන්න
  }
};
const unblockCompany = async (id) => {
  try {
    const token =
      localStorage.getItem("token") ||
      sessionStorage.getItem("token");

    await axios.put(
      `https://student-internship-system-7k5pqi68j-internship-project1.vercel.app/api/admin/unblock-company/${id}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    fetchRegisteredUsers();

  } catch (err) {
    console.log(err);
  }finally {
    await fetchRegisteredUsers(); // හැම විටම Refresh කරන්න
  }
};


const removeStudent = async (id) => {

  if (
    !window.confirm(
      "Delete this student?"
    )
  ) return;

  try {

    const token =
  localStorage.getItem("token") ||
  sessionStorage.getItem("token");

    await axios.delete(
      `https://student-internship-system-7k5pqi68j-internship-project1.vercel.app/api/admin/student/${id}`,
      {
        headers: {
          Authorization:
            `Bearer ${token}`,
        },
      }
    );

    fetchRegisteredUsers();

  } catch (err) {
    console.log(err);
  }
};


const removeCompany = async (id) => {

  if (
    !window.confirm(
      "Delete this company?"
    )
  ) return;

  try {

    const token =
  localStorage.getItem("token") ||
  sessionStorage.getItem("token");

    await axios.delete(
      `https://student-internship-system-7k5pqi68j-internship-project1.vercel.app/api/admin/company/${id}`,
      {
        headers: {
          Authorization:
            `Bearer ${token}`,
        },
      }
    );

    fetchRegisteredUsers();

  } catch (err) {
    console.log(err);
  }
};


  // Simple donut chart component for overview
  const DonutChart = ({ studentsCount, companiesCount }) => {
    const total = studentsCount + companiesCount;
    if (total === 0) return <div className="donut-empty">No pending data</div>;
    const studentPercent = (studentsCount / total) * 100;
    const companyPercent = (companiesCount / total) * 100;
    const radius = 60;
    const circumference = 2 * Math.PI * radius;
    const studentDash = (studentPercent / 100) * circumference;
    const companyDash = (companyPercent / 100) * circumference;
    return (
      <svg width="160" height="160" viewBox="0 0 160 160">
        <circle cx="80" cy="80" r={radius} fill="none" stroke="#E5E7EB" strokeWidth="16" />
        <circle cx="80" cy="80" r={radius} fill="none" stroke="#6366F1" strokeWidth="16"
          strokeDasharray={`${studentDash} ${circumference}`} strokeDashoffset="0"
          transform="rotate(-90 80 80)" strokeLinecap="round" />
        <circle cx="80" cy="80" r={radius} fill="none" stroke="#8B5CF6" strokeWidth="16"
          strokeDasharray={`${companyDash} ${circumference}`}
          strokeDashoffset={`-${studentDash}`} transform="rotate(-90 80 80)" strokeLinecap="round" />
        <text x="80" y="75" textAnchor="middle" fill="#111827" fontSize="20" fontWeight="700">{total}</text>
        <text x="80" y="95" textAnchor="middle" fill="#6B7280" fontSize="10">Total</text>
      </svg>
    );
  };

  const initials = (name = "") =>
    name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase() || "?";

  const avatarColor = (name = "") => {
    const colors = ["#6366F1","#8B5CF6","#EC4899","#F59E0B","#10B981","#3B82F6","#EF4444","#14B8A6"];
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
    return colors[Math.abs(hash) % colors.length];
  };

  return (
    <div className="shell">
      {/* SIDEBAR */}
      <aside className={`sidebar ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        <div className="sidebar-header">
          {sidebarOpen && (
            <div className="brand">
              <div className="brand-icon">A</div>
              <span className="brand-text">AdminHub</span>
            </div>
          )}
          <button className="collapse-btn" onClick={() => setSidebarOpen(o => !o)}>
            {sidebarOpen ? "◀" : "▶"}
          </button>
        </div>
        <nav className="sidebar-nav">
          {[
            { id: "overview",   icon: "⊞", label: "Overview"  },
            { id: "students",   icon: "🎓", label: "Students"  },
            { id: "companies",  icon: "🏢", label: "Companies" },
            { id:"manageStudents", icon:"👨‍🎓", label:"Manage Students" },
            { id:"manageCompanies", icon:"🏭", label:"Manage Companies" },
            { id: "jobs", icon: "💼", label: "Internships"},
          ].map(item => (
            <button
              key={item.id}
              className={`nav-item ${activeTab === item.id ? 'nav-item-active' : ''}`}
              onClick={() => setActiveTab(item.id)}
            >
              <span className="nav-icon">{item.icon}</span>
              {sidebarOpen && <span className="nav-label">{item.label}</span>}
              {sidebarOpen && item.id !== "overview" && (
                <span className="nav-badge">
                  {item.id === "students" ? students.length : companies.length}
                </span>
              )}
            </button>
          ))}
        </nav>
        {sidebarOpen && (
          <div className="sidebar-footer">
            <div className="avatar avatar-large" style={{ background: "linear-gradient(135deg, #4F46E5, #7C3AED)" }}>AD</div>
            <div className="sidebar-user-info">
              <div className="sidebar-user-name">Administrator</div>
              <div className="sidebar-user-email">admin@system.com</div>
            </div>
          </div>
        )}
      </aside>

      {/* MAIN CONTENT */}
      <main className="main">
        <header className="topbar">
          <div>
            <h1 className="page-title">
              {activeTab === "overview"  && "Dashboard Overview"}
              {activeTab === "students"  && "Student Approvals"}
              {activeTab === "companies" && "Company Approvals"}
              {activeTab === "manageStudents" && "Manage Students"}
              {activeTab === "manageCompanies" && "Manage Companies"}
              {activeTab === "jobs" && "Internship Jobs"} 
            </h1>
            <p className="page-subtitle">Manages and review pending registrations with powerful tools</p>
          </div>
          <div className="topbar-actions">
  {activeTab !== "overview" && (
    <>
      <div className="search-wrap"> … </div>
      <button className="export-btn" onClick={exportToCSV}>📎 Export</button>
      <button className="refresh-btn" onClick={fetchData}>↻</button>
    </>
  )}

  {activeTab === "overview" && (
    <button
      className="logout-btn"
      onClick={handleLogout}
      title="Sign out of admin panel"
    >
      🚪 Logout
    </button>
  )}
</div>
        </header>

        <div className="content">
          {loading ? (
            <div className="loading-wrap">
              <div className="spinner" />
              <p className="loading-text">Loading data…</p>
            </div>
          ) : (
            <>
              {/* OVERVIEW TAB */}
              {activeTab === "overview" && (
                <div>
                  <div className="stats-grid">
                    {[
                      { label: "Pending Students",  value: students.length,  icon: "🎓", color: "#6366F1", bg: "#EEF2FF", trend: "+12%" },
                      { label: "Pending Companies", value: companies.length, icon: "🏢", color: "#8B5CF6", bg: "#F5F3FF", trend: "+5%" },
                      { label: "Total Pending",     value: students.length + companies.length, icon: "⏳", color: "#F59E0B", bg: "#FFFBEB", trend: "" },
                      { label: "Approval Rate",     value: "0%", icon: "📈", color: "#10B981", bg: "#ECFDF5", trend: "Pending reviews" },
                    ].map((stat, i) => (
                      <div key={i} className="stat-card">
                        <div className="stat-icon" style={{ background: stat.bg, color: stat.color }}>
                          {stat.icon}
                        </div>
                        <div>
                          <div className="stat-value">{stat.value}</div>
                          <div className="stat-label">{stat.label}</div>
                          {stat.trend && <div className="stat-trend">{stat.trend}</div>}
                        </div>
                      </div>
                    ))}
                  </div>
                  {expiredJobs.length > 0 && (
                  <div className="expired-alert">
                    ⚠️ {expiredJobs.length}
                    internship(s) have exceeded
                    30 days.
                  </div>
                )}

                  <div className="overview-grid">
                    {/* Donut Chart */}
                    <div className="panel">
                      <div className="panel-header">
                        <span className="panel-title">Pending Distribution</span>
                      </div>
                      <div className="panel-body donut-wrapper">
                        <DonutChart studentsCount={students.length} companiesCount={companies.length} />
                      </div>
                      <div className="donut-legend">
                        <span><span className="legend-dot" style={{ background: "#6366F1" }}></span>Students</span>
                        <span><span className="legend-dot" style={{ background: "#8B5CF6" }}></span>Companies</span>
                      </div>
                    </div>

                    {/* Recent Activity Feed */}
                    <div className="panel">
                      <div className="panel-header">
                        <span className="panel-title">Recent Activity</span>
                      </div>
                      <div className="activity-feed">
                        {recentActions.length === 0 ? (
                          <div className="empty-small">No recent actions</div>
                        ) : (
                          recentActions.map(act => (
                            <div key={act.id} className="activity-item">
                              <span className="activity-icon">
                                {act.action === "approved" ? "✅" : act.action === "rejected" ? "❌" : "⚡"}
                              </span>
                              <div className="activity-content">
                                <div className="activity-action">{act.action} {act.entity}</div>
                                <div className="activity-meta">{act.name} • {act.time}</div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Quick lists */}
                  <div className="quick-grid">
                    {[
                      { title: "Recent Students",  items: students.slice(0, 4),  key: "username", sub: "email", entity: "student"  },
                      { title: "Recent Companies", items: companies.slice(0, 4), key: "username", sub: "email", entity: "company" },
                    ].map(panel => (
                      <div key={panel.title} className="panel">
                        <div className="panel-header">
                          <span className="panel-title">{panel.title}</span>
                          <button className="view-all-btn"
                            onClick={() => setActiveTab(panel.entity === "student" ? "students" : "companies")}>
                            View all →
                          </button>
                        </div>
                        {panel.items.length === 0 ? (
                          <div className="empty-small">No pending items</div>
                        ) : panel.items.map((item, i) => (
                          <div key={i} className="list-row">
                            <div className="avatar" style={{ background: avatarColor(item[panel.key]) }}>
                              {initials(item[panel.key])}
                            </div>
                            <div className="list-item-info">
                              <div className="list-item-title">{item[panel.key]}</div>
                              <div className="list-item-sub">{item[panel.sub]}</div>
                            </div>
                            <div className="status-pill status-pending">Pending</div>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* STUDENTS TAB */}
              {activeTab === "students" && (
                <div className="panel">
                  <div className="panel-header">
                    <span className="panel-title">Pending Student Registrations</span>
                    <div className="panel-actions">
                      {selectedStudents.size > 0 && (
                        <>
                          <button className="bulk-approve-btn" onClick={bulkApprove} disabled={actionLoading}>✓ Bulk Approve</button>
                          <button className="bulk-reject-btn" onClick={openBulkReject} disabled={actionLoading}>✕ Bulk Reject</button>
                        </>
                      )}
                      <span className="record-count">{filteredStudents.length} record(s)</span>
                    </div>
                  </div>
                  {filteredStudents.length === 0 ? (
                    <div className="empty">
                      <div className="empty-icon">🎉</div>
                      <p className="empty-text">
                        {search ? "No results match your search" : "No pending students"}
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="table-wrapper">
                        <table className="table">
                          <thead>
                            <tr>
                              <th className="th-checkbox">
                                <input type="checkbox" checked={selectedStudents.size === paginatedStudents.length && paginatedStudents.length > 0}
                                  onChange={selectAllStudents} />
                              </th>
                              {["Student", "Email", "NIC", "Actions"].map(h => (
                                <th key={h} className="th" onClick={() => handleSort("student", h === "Student" ? "username" : h === "Email" ? "email" : "nic")}>
                                  {h} {studentSortKey === (h === "Student" ? "username" : h === "Email" ? "email" : "nic") && (studentSortDir === "asc" ? "↑" : "↓")}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {paginatedStudents.map((s, i) => (
                              <tr key={s._id} className={i % 2 === 0 ? 'row-even' : 'row-odd'}>
                                <td className="td-checkbox">
                                  <input type="checkbox" checked={selectedStudents.has(s._id)} onChange={() => toggleSelectStudent(s._id)} />
                                </td>
                                <td className="td">
                                  <div className="td-user">
                                    <div className="avatar" style={{ background: avatarColor(s.username) }}>
                                      {initials(s.username)}
                                    </div>
                                    <span className="td-username">{s.username}</span>
                                  </div>
                                </td>
                                <td className="td td-email">{s.email}</td>
                                <td className="td td-nic">{s.nic}</td>
                                <td className="td td-actions">
                                  <div className="action-buttons">
                                    <button className="btn-view" onClick={() => openDetailModal("student", s)}>👁️ View</button>
                                    <button className="btn-approve" onClick={() => openApprove("student", s)}>✓ Approve</button>
                                    <button className="btn-reject" onClick={() => openReject("student", s)}>✕ Reject</button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <div className="pagination">
                        <button disabled={studentPage === 1} onClick={() => setStudentPage(p => p-1)}>◀ Prev</button>
                        <span>Page {studentPage} of {totalStudentPages}</span>
                        <button disabled={studentPage === totalStudentPages} onClick={() => setStudentPage(p => p+1)}>Next ▶</button>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* COMPANIES TAB */}
              {activeTab === "companies" && (
                <div className="panel">
                  <div className="panel-header">
                    <span className="panel-title">Pending Company Registrations</span>
                    <div className="panel-actions">
                      {selectedCompanies.size > 0 && (
                        <>
                          <button className="bulk-approve-btn" onClick={bulkApprove} disabled={actionLoading}>✓ Bulk Approve</button>
                          <button className="bulk-reject-btn" onClick={openBulkReject} disabled={actionLoading}>✕ Bulk Reject</button>
                        </>
                      )}
                      <span className="record-count">{filteredCompanies.length} record(s)</span>
                    </div>
                  </div>
                  {filteredCompanies.length === 0 ? (
                    <div className="empty">
                      <div className="empty-icon">🎉</div>
                      <p className="empty-text">
                        {search ? "No results match your search" : "No pending companies"}
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="table-wrapper">
                        <table className="table">
                          <thead>
                            <tr>
                              <th className="th-checkbox">
                                <input type="checkbox" checked={selectedCompanies.size === paginatedCompanies.length && paginatedCompanies.length > 0}
                                  onChange={selectAllCompanies} />
                              </th>
                              {["Company", "Email", "Reg No.", "Actions"].map(h => (
                                <th key={h} className="th" onClick={() => handleSort("company", h === "Company" ? "username" : h === "Email" ? "email" : "companyRegNo")}>
                                  {h} {companySortKey === (h === "Company" ? "username" : h === "Email" ? "email" : "companyRegNo") && (companySortDir === "asc" ? "↑" : "↓")}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {paginatedCompanies.map((c, i) => (
                              <tr key={c._id} className={i % 2 === 0 ? 'row-even' : 'row-odd'}>
                                <td className="td-checkbox">
                                  <input type="checkbox" checked={selectedCompanies.has(c._id)} onChange={() => toggleSelectCompany(c._id)} />
                                </td>
                                <td className="td">
                                  <div className="td-user">
                                    <div className="avatar avatar-rounded" style={{ background: avatarColor(c.username) }}>
                                      {initials(c.username)}
                                    </div>
                                    <span className="td-username">{c.username}</span>
                                  </div>
                                </td>
                                <td className="td td-email">{c.email}</td>
                                <td className="td td-regno">{c.companyRegNo}</td>
                                <td className="td td-actions">
                                  <div className="action-buttons">
                                    <button className="btn-view" onClick={() => openDetailModal("company", c)}>👁️ View</button>
                                    <button className="btn-approve" onClick={() => openApprove("company", c)}>✓ Approve</button>
                                    <button className="btn-reject" onClick={() => openReject("company", c)}>✕ Reject</button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <div className="pagination">
                        <button disabled={companyPage === 1} onClick={() => setCompanyPage(p => p-1)}>◀ Prev</button>
                        <span>Page {companyPage} of {totalCompanyPages}</span>
                        <button disabled={companyPage === totalCompanyPages} onClick={() => setCompanyPage(p => p+1)}>Next ▶</button>
                      </div>
                    </>
                  )}
                </div>
              )}

              {activeTab === "manageStudents" && (

                <div className="panel">

                  <div className="panel-header">
                    <span className="panel-title">
                      Registered Students
                    </span>
                  </div>


                  <table className="table">

                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>NIC</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>

                    <tbody>

                      {registeredStudents.map(student => (

                        <tr key={student._id}>

                          <td>{student.username}</td>

                          <td>{student.email}</td>

                          <td>{student.nic}</td>

                          <td>
                            {student.blocked
                              ? "Blocked"
                              : "Active"}
                          </td>

                          <td>

                            {
                              student.blocked ? (
                                <button
                                  className="btn-approve"
                                  onClick={() =>
                                    unblockStudent(student._id)
                                  }
                                >
                                  Unblock
                                </button>
                              ) : (
                                <button
                                  className="btn-reject"
                                  onClick={() =>
                                    blockStudent(student._id)
                                  }
                                >
                                  Block
                                </button>
                              )
                            }

                            <button
                              className="btn-delete"
                              onClick={() =>
                                removeStudent(student._id)
                              }
                            >
                              Remove
                            </button>

                          </td>

                        </tr>

                      ))}

                    </tbody>

                  </table>

                </div>

                )}

                {activeTab === "manageCompanies" && (

                  <div className="panel">

                    <div className="panel-header">
                      <span className="panel-title">
                        Registered Companies
                      </span>
                    </div>

                    <table className="table">

                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Email</th>
                          <th>Reg No</th>
                          <th>Status</th>
                          <th>Action</th>
                        </tr>
                      </thead>

                      <tbody>

                        {registeredCompanies.map(company => (

                          <tr key={company._id}>

                            <td>{company.username}</td>

                            <td>{company.email}</td>

                            <td>{company.companyRegNo}</td>

                            <td>
                              {company.blocked
                                ? "Blocked"
                                : "Active"}
                            </td>

                            <td>

                              {
                                company.blocked ? (
                                  <button
                                    className="btn-approve"
                                    onClick={() =>
                                      unblockCompany(company._id)
                                    }
                                  >
                                    Unblock
                                  </button>
                                ) : (
                                  <button
                                    className="btn-reject"
                                    onClick={() =>
                                      blockCompany(company._id)
                                    }
                                  >
                                    Block
                                  </button>
                                )
                              }

                              <button
                                className="btn-delete"
                                onClick={() =>
                                  removeCompany(company._id)
                                }
                              >
                                Remove
                              </button>

                            </td>

                          </tr>

                        ))}

                      </tbody>

                    </table>

                  </div>

                  )}
              
             {activeTab === "jobs" && (

              <div className="panel">

                <div className="panel-header">
                  <span className="panel-title">
                    Internship Jobs
                  </span>
                </div>

                {jobs.length === 0 ? (

                  <div className="empty">
                    No jobs available.
                  </div>

                ) : (

                  <table className="table">

                    <thead>
                      <tr>
                        <th>Company</th>
                        <th>Title</th>
                        <th>Category</th>
                        <th>Posted Date</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>

                    <tbody>

                      {jobs.map((job) => {

                        const days =
                          Math.floor(
                            (new Date() -
                              new Date(job.createdAt)) /
                            (1000 * 60 * 60 * 24)
                          );

                        const expired = days >= 30;

                        return (

                          <tr key={job._id}>

                            <td>{job.companyName}</td>

                            <td>{job.title}</td>

                            <td>{job.category}</td>

                            <td>
                              {new Date(
                                job.createdAt
                              ).toLocaleDateString()}
                            </td>

                            <td>

                              {expired ? (
                                <span
                                  style={{
                                    color: "red",
                                    fontWeight: "bold",
                                  }}
                                >
                                  Expired
                                </span>
                              ) : (
                                <span
                                  style={{
                                    color: "green",
                                    fontWeight: "bold",
                                  }}
                                >
                                  Active
                                </span>
                              )}

                            </td>

                            <td>

                              {expired && (
                                <button
                                  className="btn-reject"
                                  onClick={() =>
                                    deleteJob(job._id)
                                  }
                                >
                                  Delete
                                </button>
                              )}

                            </td>

                          </tr>

                        );
                      })}

                    </tbody>

                  </table>

                )}

              </div>

              )}
            </>
          )}
        </div>
      </main>

      {/* APPROVE/REJECT MODAL */}
      {modal && (
        <div className="overlay" onClick={closeModal}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title">
                {modal.type === "approve" ? "Confirm Approval" : "Confirm Rejection"}
              </span>
              <button className="close-btn" onClick={closeModal}>✕</button>
            </div>
            <div className="modal-body">
              <div className="modal-card">
                <div className="avatar" style={{ background: avatarColor(modal.item.username), width: 44, height: 44, fontSize: 16 }}>
                  {initials(modal.item.username)}
                </div>
                <div>
                  <div className="modal-username">{modal.item.username}</div>
                  <div className="modal-useremail">{modal.item.email}</div>
                </div>
              </div>
              {modal.type === "approve" ? (
                <p className="modal-message">
                  Are you sure you want to approve this {modal.entity}? They will receive access to the platform.
                </p>
              ) : (
                <div className="modal-reject">
                  <label className="modal-label">Rejection reason <span className="required-star">*</span></label>
                  <textarea
                    className="modal-textarea"
                    rows={3}
                    placeholder="Provide a clear reason for rejection…"
                    value={rejectInput}
                    onChange={e => setRejectInput(e.target.value)}
                  />
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button className="btn-cancel" onClick={closeModal} disabled={actionLoading}>
                Cancel
              </button>
              <button
                className={modal.type === "approve" ? "btn-confirm-approve" : "btn-confirm-reject"}
                onClick={confirmAction}
                disabled={actionLoading || (modal.type === "reject" && !rejectInput.trim())}
              >
                {actionLoading ? "Processing…" : modal.type === "approve" ? "✓ Approve" : "✕ Reject"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DETAIL MODAL */}
      {detailModal && (
        <div className="overlay" onClick={() => setDetailModal(null)}>
          <div className="modal-box modal-wide" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title">Details: {detailModal.item.username}</span>
              <button className="close-btn" onClick={() => setDetailModal(null)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="detail-user">
                <div className="avatar avatar-large" style={{ background: avatarColor(detailModal.item.username) }}>
                  {initials(detailModal.item.username)}
                </div>
                <div>
                  <div className="detail-username">{detailModal.item.username}</div>
                  <div className="detail-useremail">{detailModal.item.email}</div>
                </div>
              </div>
              <div className="detail-row"><strong>ID:</strong> {detailModal.item._id}</div>
              {detailModal.type === "student" && (
                <>
                  <div className="detail-row"><strong>NIC:</strong> {detailModal.item.nic}</div>
                  <div className="detail-row"><strong>Status:</strong> <span className="status-pill-pending">Pending</span></div>
                </>
              )}
              {detailModal.type === "company" && (
                <>
                  <div className="detail-row"><strong>Registration No:</strong> {detailModal.item.companyRegNo}</div>
                  <div className="detail-row"><strong>Status:</strong> <span className="status-pill-pending">Pending</span></div>
                </>
              )}
            </div>
            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setDetailModal(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* BULK REJECT MODAL */}
      {bulkRejectModal && (
        <div className="overlay" onClick={() => setBulkRejectModal(null)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title">Bulk Rejection</span>
              <button className="close-btn" onClick={() => setBulkRejectModal(null)}>✕</button>
            </div>
            <div className="modal-body">
              <p className="bulk-reject-message">You are about to reject <strong>{bulkRejectModal.ids.size}</strong> {bulkRejectModal.type}(s).</p>
              <label className="modal-label">Rejection Reason <span className="required-star">*</span></label>
              <textarea className="modal-textarea" rows={3} value={bulkRejectReason} onChange={e => setBulkRejectReason(e.target.value)} placeholder="Common reason for all selected..." />
            </div>
            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setBulkRejectModal(null)}>Cancel</button>
              <button className="btn-confirm-reject" onClick={confirmBulkReject} disabled={!bulkRejectReason.trim() || actionLoading}>
                {actionLoading ? "Processing…" : "Confirm Reject"}
              </button>
            </div>
          </div>
        </div>
      )}




                {selectedStudent && (
            <div
              className="overlay"
              onClick={() =>
                setSelectedStudent(null)
              }
            >
              <div
                className="modal-box"
                onClick={(e) =>
                  e.stopPropagation()
                }
              >
                <h2>
                  Student Details
                </h2>

                <p>
                  <strong>Name:</strong>
                  {" "}
                  {selectedStudent.username}
                </p>

                <p>
                  <strong>Email:</strong>
                  {" "}
                  {selectedStudent.email}
                </p>

                <p>
                  <strong>NIC:</strong>
                  {" "}
                  {selectedStudent.nic}
                </p>

                <p>
                  <strong>Status:</strong>
                  {" "}
                  {
                    selectedStudent.blocked
                      ? "Blocked"
                      : "Active"
                  }
                </p>

                <button
                  className="btn-cancel"
                  onClick={() =>
                    setSelectedStudent(null)
                  }
                >
                  Close
                </button>
              </div>
            </div>
          )}

      {/* TOAST */}
      {toast && (
        <div className={`toast toast-${toast.type}`}>
          {toast.type === "success" ? "✅" : toast.type === "warning" ? "⚠️" : "❌"} {toast.msg}
        </div>
      )}
    </div>
  );
  }
