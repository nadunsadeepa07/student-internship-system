import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Login from "./Login";
import "../styles/JobDetails.css";

function JobDetails({ id: modalId, isModal }) {
  const params = useParams();
  const id = modalId || params.id;
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  // ✅ Login Modal State
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [pendingApplyJobId, setPendingApplyJobId] = useState(null);

  // ✅ Error Modal State
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    axios
      .get(`https://student-internship-system.vercel.app/api/jobs/${id}`)
      .then((res) => {
        setJob(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err.response?.data || err.message);
        setLoading(false);
      });
  }, [id]);

  // ✅ Helper - Company user දැයි check කරයි
  const isCompanyUser = (user) => {
    if (!user) return false;
    const role = (
      user.role ||
      user.userType ||
      user.type ||
      user.accountType ||
      ""
    )
      .toString()
      .toLowerCase();
    return role === "company";
  };

  // ✅ Helper - Student user දැයි check කරයි
  const isStudentUser = (user) => {
    if (!user) return false;
    const role = (
      user.role ||
      user.userType ||
      user.type ||
      user.accountType ||
      ""
    )
      .toString()
      .toLowerCase();
    return role === "student";
  };

  // ✅ Main Apply Handler - Role Check සහිතව
  const handleApplyClick = (jobId) => {
    const userStr = localStorage.getItem("user");

    // Case 1: Login නොවූ user → Login Modal show කරන්න
    if (!userStr) {
      setPendingApplyJobId(jobId);
      setShowLoginModal(true);
      return;
    }

    // User data parse කරන්න
    let user;
    try {
      user = JSON.parse(userStr);
    } catch (e) {
      setPendingApplyJobId(jobId);
      setShowLoginModal(true);
      return;
    }

    // Case 2: Company user → Error Modal show කරන්න
    if (isCompanyUser(user)) {
      setErrorMessage(
        "Companies cannot apply for internships! Only students are eligible to apply for internship positions. Please log in with a student account to apply."
      );
      setShowErrorModal(true);
      return;
    }

    // Case 3: Student user → Apply page වෙත යන්න
    if (isStudentUser(user)) {
      navigate(`/apply?jobId=${jobId}`);
      return;
    }

    // Case 4: Default → Apply page වෙත යන්න
    navigate(`/apply?jobId=${jobId}`);
  };

  // ✅ Login Modal Close Handler
  const handleLoginClose = () => {
    setShowLoginModal(false);

    const userStr = localStorage.getItem("user");

    if (userStr && pendingApplyJobId) {
      try {
        const user = JSON.parse(userStr);

        // Login කළ user company නම් → Error show කරන්න
        if (isCompanyUser(user)) {
          setErrorMessage(
            "You logged in as a Company! Companies cannot apply for internships. Please log in with a student account to apply."
          );
          setShowErrorModal(true);
          setPendingApplyJobId(null);
          return;
        }

        // Student නම් → Apply page redirect
        navigate(`/apply?jobId=${pendingApplyJobId}`);
      } catch (e) {
        console.error("Error parsing user:", e);
      }
    }

    setPendingApplyJobId(null);
  };

  // ─── Loading & Error States ───────────────────────────────────────────────

  if (loading)
    return (
      <div className="details-state">
        <div className="details-spinner" />
        <p>Loading job details…</p>
      </div>
    );

  if (!job)
    return (
      <div className="details-state details-state--error">
        <p>Job not found</p>
      </div>
    );

  const categoryLabel = job.category
    ? job.category.charAt(0).toUpperCase() + job.category.slice(1)
    : "—";

  const expLabel = job.experience
    ? job.experience.charAt(0).toUpperCase() + job.experience.slice(1)
    : "—";

  const requirementsList =
    job.requirements && job.requirements.trim().length > 0
      ? job.requirements
          .split(/\n|•|;/)
          .map((r) => r.trim())
          .filter(Boolean)
      : null;

  return (
    <div className={`djd-page ${isModal ? "djd-page-modal" : ""}`}>

      {/* ✅ LOGIN MODAL */}
      {showLoginModal && (
        <Login
          initialMode="login"
          onClose={handleLoginClose}
        />
      )}

      {/* ✅ ERROR MODAL - Company Users සඳහා */}
      {showErrorModal && (
        <div
          className="jd-error-overlay"
          onClick={() => setShowErrorModal(false)}
        >
          <div
            className="jd-error-modal"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Error Icon */}
            <div className="jd-error-icon">
              <svg
                width="60"
                height="60"
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

            {/* Title */}
            <h2 className="jd-error-title">Access Denied</h2>

            {/* Message */}
            <p className="jd-error-message">{errorMessage}</p>

            {/* Info Box */}
            <div className="jd-error-info-box">
              <div className="jd-error-info-row">
                <span>🏢</span>
                <span>Company accounts can only <strong>post</strong> internships</span>
              </div>
              <div className="jd-error-info-row">
                <span>🎓</span>
                <span>Student accounts can <strong>apply</strong> for internships</span>
              </div>
            </div>

            {/* Buttons */}
            <div className="jd-error-buttons">
              <button
                className="jd-error-btn-close"
                onClick={() => setShowErrorModal(false)}
              >
                Got it
              </button>

              <button
                className="jd-error-btn-switch"
                onClick={() => {
                  setShowErrorModal(false);
                  // Company logout කර Student Login modal open කරන්න
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

      {/* TOP BAR */}
      {!isModal && (
        <div className="djd-topbar">
          <button className="djd-back-btn" onClick={() => navigate(-1)}>
            ← Back
          </button>
        </div>
      )}

      {/* HERO */}
      <div className="djd-hero">
        <div className="djd-hero-inner">

          <div className="djd-logo-box">
            {job.companyName?.charAt(0)?.toUpperCase() || "C"}
          </div>

          <div className="djd-hero-meta">
            <div className="djd-badges">
              <span className="djd-badge djd-badge--blue">{categoryLabel}</span>
              <span className="djd-badge djd-badge--green">{expLabel}</span>
            </div>
            <h1 className="djd-hero-title">{job.title}</h1>
            <div className="djd-hero-sub">
              <span>🏢 {job.companyName || "Company"}</span>
              <span>📍 {job.location || "Sri Lanka"}</span>
            </div>
          </div>

          <div className="djd-hero-actions">
            {/* ✅ UPDATED Apply Button */}
            <button
              className="djd-btn-apply"
              onClick={() => handleApplyClick(job._id)}
            >
              Apply now
            </button>

            <button
              className={`djd-btn-save ${saved ? "djd-btn-save--active" : ""}`}
              onClick={() => setSaved(!saved)}
            >
              {saved ? "Saved" : "Save"}
            </button>
          </div>

        </div>
      </div>

      {/* STATS */}
      <div className="djd-stats-strip">
        <div className="djd-stats-inner">
          <div className="djd-stat">
            <span className="djd-stat-label">Salary</span>
            <span className="djd-stat-value">{job.salary || "—"}</span>
          </div>
          <div className="djd-stat">
            <span className="djd-stat-label">Vacancies</span>
            <span className="djd-stat-value">{job.vacancy || "—"}</span>
          </div>
          <div className="djd-stat">
            <span className="djd-stat-label">Category</span>
            <span className="djd-stat-value">{categoryLabel}</span>
          </div>
          <div className="djd-stat">
            <span className="djd-stat-label">Experience</span>
            <span className="djd-stat-value">{expLabel}</span>
          </div>
        </div>
      </div>

      {/* BODY */}
      <div className="djd-body">
        <div className="djd-content-grid">

          {/* LEFT */}
          <div className="djd-left">

            {/* DESCRIPTION CARD */}
            <div className="djd-card">
              <div className="djd-section-label">Description</div>
              <p className="djd-body-text">
                {job.description || "No description"}
              </p>
              <div className="djd-section-label djd-section-label--mt">
                Requirements
              </div>
              {requirementsList ? (
                <ul className="djd-req-list">
                  {requirementsList.map((req, i) => (
                    <li key={i}>
                      <span className="djd-req-dot"></span>
                      {req}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="djd-body-text">Not specified</p>
              )}
            </div>

            {/* COMPANY DETAILS CARD */}
            <div className="djd-card company-card">
              <div className="djd-section-label">Company Details</div>
              <div className="company-details-grid">

                <div className="company-detail-box">
                  <div className="company-icon">🏢</div>
                  <div>
                    <h4>Company Name</h4>
                    <p>{job.companyName || job.company?.username || "Not Provided"}</p>
                  </div>
                </div>

                <div className="company-detail-box">
                  <div className="company-icon">📍</div>
                  <div>
                    <h4>Address</h4>
                    <p>{job.address || job.company?.address || "Not Provided"}</p>
                  </div>
                </div>

                <div className="company-detail-box">
                  <div className="company-icon">📞</div>
                  <div>
                    <h4>Mobile Number</h4>
                    <p>{job.mobile || job.company?.mobile || "Not Provided"}</p>
                  </div>
                </div>

                <div className="company-detail-box">
                  <div className="company-icon">✉️</div>
                  <div>
                    <h4>Email Address</h4>
                    <p>{job.email || job.company?.email || "Not Provided"}</p>
                  </div>
                </div>

                <div className="company-detail-box">
                  <div className="company-icon">🏙️</div>
                  <div>
                    <h4>District</h4>
                    <p>{job.district || job.company?.district || "Not Provided"}</p>
                  </div>
                </div>

              </div>
            </div>

          </div>

          {/* RIGHT */}
          <div className="djd-right">

            {/* JOB INFO CARD */}
            <div className="djd-card djd-info-card">
              <div className="djd-section-label">Job Information</div>
              <div className="djd-info-rows">
                <div className="djd-info-row">
                  <span className="djd-info-key">Category</span>
                  <span className="djd-info-val">{categoryLabel}</span>
                </div>
                <div className="djd-info-row">
                  <span className="djd-info-key">Experience</span>
                  <span className="djd-info-val">{expLabel}</span>
                </div>
                <div className="djd-info-row">
                  <span className="djd-info-key">Salary</span>
                  <span className="djd-info-val">{job.salary || "—"}</span>
                </div>
                <div className="djd-info-row">
                  <span className="djd-info-key">Vacancies</span>
                  <span className="djd-info-val">{job.vacancy || "—"}</span>
                </div>
                <div className="djd-info-row">
                  <span className="djd-info-key">Location</span>
                  <span className="djd-info-val">{job.location || "—"}</span>
                </div>
              </div>
            </div>

            {/* APPLY CARD */}
            <div className="djd-apply-card">
              <h3>Ready to apply?</h3>
              <p>Submit your application now.</p>
              {/* ✅ UPDATED Apply Button */}
              <button
                className="djd-apply-card-btn"
                onClick={() => handleApplyClick(job._id)}
              >
                Apply now
              </button>
            </div>

          </div>
        </div>
      </div>

    </div>
  );
}

export default JobDetails;