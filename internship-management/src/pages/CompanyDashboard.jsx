// UltraAdvancedCompanyDashboard.jsx

import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import md5 from "crypto-js/md5";
import ApplicationsPanel from "./ApplicationsPanel"; 
import { getStoredUser } from "../utils/storage";
import "../styles/CompanyDashboard.css";

import {
  Bell,
  Briefcase,
  ChevronRight,
  ClipboardList,
  Eye,
  LogOut,
  Pencil,
  Plus,
  Search,
  Sparkles,
  Trash2,
  TrendingUp,
  Users,
  X,
  Building2,
  Filter,
  Moon,
  SunMedium,
  Clock3,
  BadgeCheck,
  CreditCard,
} from "lucide-react";

function CompanyDashboard() {

  const [user, setUser] = useState(null);

  const [jobs, setJobs] = useState([]);

  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");

  const [activeFilter, setActiveFilter] = useState("All");

  const [darkMode, setDarkMode] = useState(false);

  const [selectedJob, setSelectedJob] = useState(null);

  const [editId, setEditId] = useState(null);

  const [paymentCompleted, setPaymentCompleted] = useState(false);

  const [paymentLoading, setPaymentLoading] = useState(false);

  const [showApplications, setShowApplications] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    salary: "",
    vacancy: "",
    category: "Software Engineering",
  });

  const groupedCategories = {

  IT: [
    "Software Engineering",
    "Web Development",
    "Mobile App Development",
    "UI/UX Design",
    "Cybersecurity",
    "Data Science",
    "Artificial Intelligence",
    "Cloud Computing",
    "Networking",
    "Database Administration",
    "QA / Software Testing",
    "DevOps",
  ],

  Finance: [
    "Accounting",
    "Auditing",
    "Taxation",
    "Banking",
    "Financial Analysis",
    "Payroll Management",
    "Investment Management",
    "Insurance",
    "Bookkeeping",
  ],

  Management: [
    "Business Management",
    "Human Resource Management (HRM)",
    "Project Management",
    "Operations Management",
    "Supply Chain Management",
    "Office Administration",
    "Entrepreneurship",
    "Strategic Management",
  ],

  Marketing: [
    "Digital Marketing",
    "Social Media Marketing",
    "SEO",
    "Brand Management",
    "Sales Executive",
    "Advertising",
    "Market Research",
    "Business Development",
  ],

  Education: [
    "School Teaching",
    "Higher Education",
    "Early Childhood Education",
    "Educational Administration",
    "Training & Development",
  ],

  Creative: [
    "Graphic Design",
    "Animation",
    "Video Editing",
    "Fashion Design",
    "Interior Design",
    "Multimedia Production",
  ],

  Agriculture: [
    "Agriculture",
    "Food Technology",
    "Environmental Management",
    "Forestry",
    "Fisheries",
  ],

};

  // ===============================
  // AUTH HEADERS
  // ===============================

  const getAuthHeaders = () => {

    const token = localStorage.getItem("token");

    return token
      ? { Authorization: `Bearer ${token}` }
      : {};
  };

  // ===============================
  // INITIAL LOAD
  // ===============================

  useEffect(() => {
  const stored = getStoredUser();

  if (stored) {
    setUser(stored);
  }
}, []);

  useEffect(() => {
  if (user?._id) {
    fetchJobs();
   
  }
}, [user]);

  // ===============================
  // PAYHERE EVENTS
  // ===============================

  useEffect(() => {

    if (window.payhere) {

      window.payhere.onCompleted = function onCompleted(orderId) {

        console.log("Payment completed:", orderId);

        alert("Payment Successful!");

        setPaymentCompleted(true);
        setPaymentLoading(false);

        // ✅ trigger save automatically
        setTimeout(() => {
         saveJob();
        }, 300);
      };

      window.payhere.onDismissed = function onDismissed() {

        alert("Payment cancelled");

        setPaymentLoading(false);
      };

      window.payhere.onError = function onError(error) {

        console.log(error);

        alert("Payment failed");

        setPaymentLoading(false);
      };
    }

  },



  // ✅ AUTO SAVE AFTER PAYMENT
useEffect(() => {
  if (paymentCompleted) {
    saveJob();
  }
}, [paymentCompleted]), []);






  // ===============================
  // FETCH JOBS
  // ===============================

  const fetchJobs = async () => {

  
    try {

      const storedUser = getStoredUser();

      if (!storedUser?._id) {

        setJobs([]);

        setLoading(false);

        return;
      }

      const res = await axios.get(
        "http://localhost:5000/api/jobs",
        {
          headers: getAuthHeaders(),
        }
      );

      const companyJobs = res.data.filter(
        (job) => job.companyId === storedUser._id
      );

      setJobs(companyJobs);

    } catch (err) {

      console.error(err);

      alert("Failed to load jobs");

    } finally {

      setLoading(false);
    }
  };


  const fetchApplications =
  async () => {

  try {

    const storedUser = getStoredUser();

    if (!storedUser?._id) {
      return;
    }

    const res =
      await axios.get(
`http://localhost:5000/api/company/applications?companyId=${storedUser._id}`,
        
      );

    

  } catch (err) {

    console.log(err);
  }
};

  // ===============================
  // HANDLE CHANGE
  // ===============================

  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // ===============================
  // LOGOUT
  // ===============================

  const handleLogout = () => {

    const confirmLogout = window.confirm(
      "Are you sure you want to logout?"
    );

    if (!confirmLogout) return;

    localStorage.removeItem("user");

    localStorage.removeItem("token");

    window.location.href = "/#";
  };

  // ===============================
  // PAY NOW
  // ===============================

  const payNow = () => {

    if (!form.title.trim()) {

      alert("Please enter internship title first");

      return;
    }

    if (!window.payhere) {
      alert("PayHere SDK not loaded");
      return;
    }

    setPaymentLoading(true);

    const merchant_id = "1235866";
    const merchant_secret = "NjM2MzEwNzA1NTM3NDQ0NTUwMTQ0MjQ3Nzc2NzEwMzE0MTI2MDY=";

    const order_id = "JOB_" + new Date().getTime();
    const amount = "500.00";
    const currency = "LKR";

    // ✅ FIXED HASH (CORRECT PAYHERE FORMAT)
    
    const hash = md5(
  merchant_id + 
  order_id + 
  amount + 
  currency + 
  md5(merchant_secret).toString().toUpperCase()
).toString().toUpperCase();

    const payment = {
      sandbox: true,
      merchant_id,
      return_url: "http://localhost:3000/company",
      cancel_url: "http://localhost:3000/company",
      notify_url: "http://localhost:5000/payment-notify",
      order_id,
      items: form.title,
      amount,
      currency,
      first_name: user?.username || "Company",
      last_name: "Company",
      email: user?.email || "company@test.com",
      phone: user?.mobile || "0771234567",
      address: user?.address || "Colombo",
      city: user?.district || "Colombo",
      country: "Sri Lanka",
      hash,
    };

    window.payhere.startPayment(payment);
  };




  // ===============================
  // SAVE JOB
  // ===============================

  const saveJob = async () => {

    if (!paymentCompleted && !editId) {

      payNow();

      return;
    }

    if (!form.title.trim()) {

      alert("Job title is required");

      return;
    }

    if (!user?._id) {

      alert("Please login again");

      return;
    }

    const companyName =
      user?.username ||
      user?.companyName ||
      "Unknown Company";

    try {

      if (editId) {

        await axios.put(
          `http://localhost:5000/api/jobs/${editId}`,
          form,
          {
            headers: getAuthHeaders(),
          }
        );

        await fetchJobs();

        setEditId(null);

      } else {

        const payload = {

          ...form,

          companyId: user._id,

          companyName: companyName,

          email: user.email,

          mobile: user.mobile,

          address: user.address,

          district: user.district,

          applicants: [],

          paymentStatus: "Paid",

          paymentAmount: "500",
        };

        await axios.post(
          "http://localhost:5000/api/jobs",
          payload,
          {
            headers: getAuthHeaders(),
          }
        );

        await fetchJobs();

        alert("Internship Published!");

        setPaymentCompleted(false);
      }

      setForm({
        title: "",
        description: "",
        salary: "",
        vacancy: "",
        category: "Software Engineering",
      });

    } catch (err) {

      console.error(err);

      alert(
        err.response?.data?.message ||
        "Failed to save internship"
      );
    }
  };

  // ===============================
  // EDIT JOB
  // ===============================

  const editJob = (job) => {

    setEditId(job._id);

    setForm({
      title: job.title,
      description: job.description,
      salary: job.salary,
      vacancy: job.vacancy,
      category: job.category,
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ===============================
  // DELETE JOB
  // ===============================

  const deleteJob = async (id) => {


   


    if (!window.confirm("Delete internship?"))
      return;

    try {

      await axios.delete(
        `http://localhost:5000/api/jobs/${id}`,
        {
          headers: getAuthHeaders(),
        }
      );

      await fetchJobs();

    } catch (err) {

      console.error(err);

      alert("Delete failed");
    }
  };



   
  // ===============================
  // FILTERED JOBS
  // ===============================

  const filteredJobs = useMemo(() => {

    return jobs.filter((job) => {

      const categoryMatch =
        activeFilter === "All" ||
        job.category === activeFilter;

      const searchMatch =
        job.title
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        job.description
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase());

      return categoryMatch && searchMatch;
    });

  }, [jobs, activeFilter, searchTerm]);

  // ===============================
  // STATS
  // ===============================

  const totalApplicants = jobs.reduce(
    (sum, j) =>
      sum + (j.applicants?.length || 0),
    0
  );

  const totalVacancies = jobs.reduce(
    (sum, j) =>
      sum + Number(j.vacancy || 0),
    0
  );

  const avgApplicants =
    jobs.length > 0
      ? (
          totalApplicants / jobs.length
        ).toFixed(1)
      : 0;

  // ===============================
  // LOADING
  // ===============================

  if (showApplications) {
  return (
    <ApplicationsPanel
      companyId={user?._id}
      getAuthHeaders={getAuthHeaders}
      onBack={() => setShowApplications(false)}
    />
  );
}


return (

    <div className={darkMode ? "dashboard dark" : "dashboard"}>

      {/* SIDEBAR */}

      <aside className="sidebarr">

        <div className="logo-section">

          <div className="logo-box">
            <Sparkles size={24} />
          </div>

          <div>

            <div className="logo">
              SIMS <span>Portal</span>
            </div>

            <p>Company Workspace</p>

          </div>
        </div>

        {/* PROFILE */}

        <div className="profile-cardd">

          <div className="profile-avatar">
            {user?.username
              ?.charAt(0)
              ?.toUpperCase()}
          </div>

          <div className="profile-details">

            <h3>{user?.username}</h3>

            <span>{user?.email}</span>

            <p>📍 {user?.address}</p>

            <p>📞 {user?.mobile}</p>

            <p>🏙️ {user?.district}</p>

          </div>
        </div>

        {/* STATS */}

        <div className="mini-stats">

          <div className="mini-cardd">
            <Briefcase />
            <h1>{jobs.length}</h1>
            <p>Total Posts</p>
          </div>

          <div className="mini-cardd">
            <Users />
            <h1>{totalApplicants}</h1>
            <p>Applicants</p>
          </div>

          <div className="mini-cardd">
            <TrendingUp />
            <h1>{totalVacancies}</h1>
            <p>Vacancies</p>
          </div>

          <div className="mini-cardd">
            <BadgeCheck />
            <h1>{avgApplicants}</h1>
            <p>Average</p>
          </div>

        </div>
        <button className="applicants-btn" onClick={() => setShowApplications(true)}>
          <Users size={18} /> View Applicants
        </button>

        <button
          className="theme-btn"
          onClick={() =>
            setDarkMode(!darkMode)
          }
        >

          {darkMode ? (
            <>
              <SunMedium size={18} />
              Light Mode
            </>
          ) : (
            <>
              <Moon size={18} />
              Dark Mode
            </>
          )}
        </button>

        <button
          className="logout-btn"
          onClick={handleLogout}
        >
          <LogOut size={18} />
          Logout
        </button>

      </aside>

      {/* MAIN */}

      <main className="main-content">

        {/* TOPBAR */}

        <div className="topbar">

          <div>

            <h1>
              Welcome Back,
              {user?.username} 🙌
            </h1>

            <p>
              Manage internships and
              track company performance.
            </p>

          </div>

          <div className="topbar-right">

            <div className="search-box">

              <Search size={18} />

              <input
                type="text"
                placeholder="Search internships..."
                value={searchTerm}
                onChange={(e) =>
                  setSearchTerm(e.target.value)
                }
              />
            </div>

            <button className="notification-btn">
              <Bell size={18} />
            </button>

          </div>
        </div>

        {/* HERO */}

        <div className="hero-banner">

          <div className="hero-content">

            <span className="hero-badge">
              ✨ Premium Dashboard
            </span>

            <h1>
              Build Amazing Internship Programs
            </h1>

            <p>
              Manage internship opportunities
              with integrated payment system.
            </p>

          </div>

          <div className="hero-visual">

            <div className="glass-card card-one">
              <Building2 size={18} />
              150+ Companies
            </div>

            <div className="glass-card card-two">
              <Users size={18} />
              1200+ Students
            </div>

            <div className="hero-circle"></div>

          </div>
        </div>

        {/* FILTER */}

        {/* FILTER */}

        <div className="filter-bar">

          <div className="filter-left">

            <Filter size={18} />

            <select
              className="filter-dropdown"
              value={activeFilter}
              onChange={(e) =>
                setActiveFilter(e.target.value)
              }
            >

              <option value="All">All Categories</option>

            {Object.entries(groupedCategories).map(
              ([group, items]) => (

                <optgroup
                  key={group}
                  label={group}
                >

                  {items.map((item) => (

                    <option
                      key={item}
                      value={item}
                    >
                      {item}
                    </option>

                  ))}

                </optgroup>

          )
        )}

              

            </select>

          </div>

          <div className="live-status">

            <Clock3 size={16} />

            Live Dashboard

          </div>

        </div>

        {/* CONTENT */}

        <div className="content-grid">

          {/* FORM */}

          <div className="form-panel">

            <div className="panel-header">

              <div>

                <h2>
                  {editId
                    ? "Edit Internship"
                    : "Create Internship"}
                </h2>

                <p>
                  Publish opportunities
                </p>

              </div>

              <div className="panel-icon">
                <Plus />
              </div>

            </div>

            <div className="input-group">

              <label>Category</label>

              <select
                name="category"
                value={form.category}
                onChange={handleChange}
              >

                {Object.entries(groupedCategories).map(
                  ([group, items]) => (

                    <optgroup
                      key={group}
                      label={group}
                    >

                      {items.map((item) => (

                        <option
                          key={item}
                          value={item}
                        >
                          {item}
                        </option>

                      ))}

                    </optgroup>

                  )
                )}

              </select>

            </div>

            <div className="input-group">

              <label>Job Title</label>

              <input
                type="text"
                name="title"
                placeholder="Frontend Developer"
                value={form.title}
                onChange={handleChange}
              />

            </div>

            <div className="input-group">

              <label>Description</label>

              <textarea
                name="description"
                placeholder="Internship details..."
                value={form.description}
                onChange={handleChange}
              />

            </div>

            <div className="double-input">

              {/*<div className="input-group">

                <label>Monthly Allowance</label>

                <input
                  type="text"
                  name="salary"
                  placeholder="Rs.40000"
                  value={form.salary}
                  onChange={handleChange}
                />

              </div><br/>*/}

              <div className="input-group">

                <label>Vacancy</label>

                <input
                  type="text"
                  name="vacancy"
                  placeholder="5"
                  value={form.vacancy}
                  onChange={handleChange}
                />

              </div>

            </div>

            {/* PAYMENT STATUS */}

            {!editId && (

              <div
                style={{
                  marginBottom: "14px",
                  padding: "12px",
                  borderRadius: "14px",
                  background: paymentCompleted
                    ? "#dcfce7"
                    : "#eff6ff",
                  color: paymentCompleted
                    ? "#166534"
                    : "#1d4ed8",
                  fontWeight: "700",
                }}
              >
                {paymentCompleted
                  ? "✅ Payment completed"
                  : "🔒 Payment required"}
              </div>
            )}

            <button
              className="publish-btn"
              onClick={saveJob}
              disabled={paymentLoading}
            >

              {paymentLoading
                ? "Processing..."
                : editId
                ? "Update Internship"
                : paymentCompleted
                ? "Publish Internship"
                : "Pay Rs.500 & Publish"}

            </button>

            {editId && (

              <button
                className="cancel-btn"
                onClick={() =>
                  setEditId(null)
                }
              >
                <X size={16} />
                Cancel Edit
              </button>
            )}

          </div>

          {/* JOBS */}

          <div className="jobs-grid">

            {filteredJobs.length === 0 ? (

              <div className="empty-state">

                <h2>No Internships Found</h2>

                <p>
                  Create your first internship
                </p>

              </div>
              

            ) : (

              filteredJobs.map((job) => (

                <div
                  className="job-card"
                  key={job._id}
                >

                  <div className="job-card-top">

                    <div className="job-category">
                      {job.category}
                    </div>

                    <button
                      className="view-btn"
                      onClick={() =>
                        setSelectedJob(job)
                      }
                    >
                      <ChevronRight size={18} />
                    </button>

                  </div>

                  <h2>{job.title}</h2>

                  <p>{job.description}</p>

                  <div className="tags-row">

                    <div className="salary-tag">
                      💰 {job.salary}
                    </div>

                    <div className="vacancy-tag">
                      👥 {job.vacancy} Seats
                    </div>

                  </div>

                  <div className="tags-row">

                    <div className="salary-tag">
                      <CreditCard size={14} />
                      Paid
                    </div>

                  </div>

                  <div className="job-footer">

                    <div className="applicant-count">

                      <Users size={16} />

                      {job.applicants?.length || 0}
                      Applicants

                    </div>

                    <div className="job-actions">

                      <button
                        className="edit-btn"
                        onClick={() =>
                          editJob(job)
                        }
                      >
                        <Pencil size={16} />
                      </button>

                      <button
                        className="delete-btn"
                        onClick={() =>
                          deleteJob(job._id)
                        }
                      >
                        <Trash2 size={16} />
                      </button>

                    </div>

                  </div>

                </div>
              ))
            )}
          </div>

          
        
        </div>




      </main>

      {/* MODAL */}

      {selectedJob && (

        <div className="modal-overlay">

          <div className="job-modal">

            <button
              className="close-modal"
              onClick={() =>
                setSelectedJob(null)
              }
            >
              <X size={18} />
            </button>

            <span className="modal-category">
              {selectedJob.category}
            </span>

            <h1>{selectedJob.title}</h1>

            <p>{selectedJob.description}</p>

            <div className="modal-info">

              <div>
                💰 {selectedJob.salary}
              </div>

              <div>
                👥 {selectedJob.vacancy}
                Seats
              </div>

              <div>
                👨‍🎓
                {selectedJob.applicants?.length || 0}
                Applicants
              </div>

            </div>

          </div>

        </div>
      

      
  
        

        

      

    
  )
}

    </div>
  );
}

export default CompanyDashboard;