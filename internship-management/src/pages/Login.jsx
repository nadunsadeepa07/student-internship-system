// Login.jsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

import loginImg from "../assets/login.avif";
import companyImg from "../assets/cregi.png";
import studentImg from "../assets/cregi.png";
import "../styles/Login.css";

function Login({ initialMode = "login", onClose }) {
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(initialMode === "login");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState("");

  // role select modal
  const [showRoleBox, setShowRoleBox] = useState(false);

  const [form, setForm] = useState({
    username: "",
    email: "",
    address: "",
    mobile: "",
    district: "",
    jobTitle: "",
    password: "",
    confirmPassword: "",
    role: "Student",
    nic: "",
    companyRegNo: "",
  });

  // ලංකාවේ දිස්ත්‍රික්ක 25
  const sriLankaDistricts = [
    "Colombo",
    "Gampaha",
    "Kalutara",
    "Kandy",
    "Matale",
    "Nuwara Eliya",
    "Galle",
    "Matara",
    "Hambantota",
    "Jaffna",
    "Kilinochchi",
    "Mannar",
    "Vavuniya",
    "Mullaitivu",
    "Batticaloa",
    "Ampara",
    "Trincomalee",
    "Kurunegala",
    "Puttalam",
    "Anuradhapura",
    "Polonnaruwa",
    "Badulla",
    "Monaragala",
    "Ratnapura",
    "Kegalle",
  ];

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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  // ================= REDIRECT =================
  const redirectUser = (role, status) => {
    // ----- තාවකාලිකව pending check එක අක්‍රිය කර ඇත -----
    // if (status === "pending") {
    //   navigate("/waiting");
    //   return;
    // }

    if (status === "rejected") {
      alert("Your account is rejected");
      return;
    }

    if (role === "Student") {
      navigate("/student");
    } else if (role === "Company") {
      navigate("/company");
    }
  };

  // ================= SAVE SESSION =================
  const saveSession = (token, user) => {
    if (remember) {
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      sessionStorage.setItem("token", token);
      sessionStorage.setItem("user", JSON.stringify(user));
    }
  };

  // ================= LOGIN / REGISTER =================
  const handleAuth = async () => {
    try {
      setLoading(true);
      setError("");

      if (!isLogin) {
        if (!form.username || !form.email || !form.password || !form.role) {
          setLoading(false);
          return setError("Please fill all required fields");
        }

        // Student නම් NIC check
        if (form.role === "Student" && !form.nic) {
          setLoading(false);
          return setError("NIC number is required");
        }

        // Company නම් RegNo check
        if (form.role === "Company" && !form.companyRegNo) {
          setLoading(false);
          return setError("Company Registration No is required");
        }

        if (form.password !== form.confirmPassword) {
          setLoading(false);
          return setError("Passwords do not match");
        }

        const res = await api.post("/register", {
          username: form.username,
          email: form.email,
          address: form.address,
          mobile: form.mobile,
          district: form.district,
          jobTitle: form.jobTitle,
          password: form.password,
          role: form.role,
          nic: form.nic,
          companyRegNo: form.companyRegNo,
          status: "approved",
        });

        const { token, user } = res.data;

        // ----- තාවකාලිකව status එක "approved" ලෙස override කරන්න -----
        user.status = "approved"; // හෝ "active"

        saveSession(token, user);
        redirectUser(user.role, user.status);
        return;
      }

      // LOGIN
      const res = await api.post("/login", {
        email: form.email,
        password: form.password,
      });

      const { token, user } = res.data;
      saveSession(token, user);
      redirectUser(user.role, user.status);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // ================= PASSWORD STRENGTH =================
  const getPasswordStrength = () => {
    const p = form.password;

    if (p.length > 10) return "Strong 🔥";
    if (p.length > 5) return "Medium ⚡";
    if (p.length > 0) return "Weak ⚠️";

    return "";
  };

  // ================= SELECT ROLE =================
  const chooseRole = (role) => {
    setForm({ ...form, role });
    setIsLogin(false);
    setShowRoleBox(false);
  };

  return (
    <>
      {/* ================= BACKDROP OVERLAY ================= */}
      <div className="login-backdrop" onClick={onClose}></div>

      <div className="login-page">
        {/* ================= ROLE MODAL ================= */}
        {showRoleBox && (
          <div className="role-modal-overlay">
            <div className="role-modal">
              <div className="role-box">
                <h2>Select Account Type</h2>
                <p className="role-subtitle">Choose your registration type</p>

                <div className="role-buttons">
                  <button className="role-btn company-btn" onClick={() => chooseRole("Company")}>
                    <div className="role-icon">🏢</div>
                    <div className="role-info">
                      <h3>Company</h3>
                      <p>Post internships & hire students</p>
                    </div>
                  </button>

                  <button className="role-btn student-btn" onClick={() => chooseRole("Student")}>
                    <div className="role-icon">🎓</div>
                    <div className="role-info">
                      <h3>Student</h3>
                      <p>Find & apply for internships</p>
                    </div>
                  </button>
                </div>

                <button className="cancel-btn" onClick={() => setShowRoleBox(false)}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ================= MAIN CARD ================= */}
        <div className={`main-card ${isLogin ? "login-card" : "register-card"}`}>
          {/* ================= CLOSE BUTTON ================= */}
          {onClose && (
            <button className="top-close" onClick={onClose}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M18 6L6 18M6 6l12 12" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          )}

          {/* ================= LEFT IMAGE ================= */}
          <div className="left-side">
            <div className="image-wrapper">
              <img
                src={isLogin ? loginImg : form.role === "Company" ? companyImg : studentImg}
                alt="auth"
              />
              <div className="image-overlay"></div>
            </div>
            <div className="left-content">
              <h2>Student Internship Management System</h2>
              <p>Connect students with amazing internship opportunities</p>
            </div>
          </div>

          {/* ================= RIGHT SIDE ================= */}
          <div className="right-side">
            {/* HEADER */}
            <div className="header">
              <h1>{isLogin ? "Welcome Back 👋" : "Create Account 🚀"}</h1>

              {!isLogin && (
                <div className="role-badge">
                  {form.role === "Company" ? "🏢" : "🎓"} {form.role}
                </div>
              )}

              {isLogin && <p>Sign in to access your dashboard</p>}
            </div>

            {/* ================= WARNING BANNER - ENGLISH ONLY ================= */}
            <div className="warning-banner">
              <div className="warning-icon">⚠️</div>
              <div className="warning-content">
                <h4>Important Notification</h4>
                <p>
                  <strong>Standard Workflow:</strong>
                  <br />
                  • Every account must be approved by the Admin upon Registration.
                  <br />
                  • Only Admin-approved accounts can be used for Login.
                </p>
                <p style={{ marginTop: "6px", color: "#d97706" }}>
                  <em>
                    <strong>For this Demo:</strong>
                    <br />
                    • Admin approval for Registration has been temporarily disabled.
                    <br />
                    Therefore, you can access the system immediately after registering.
                    <br />
                    • Please note that Login still requires existing accounts to be Admin-approved.
                  </em>
                </p>
              </div>
            </div>

            {/* ERROR */}
            {error && (
              <div className="error-box">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                </svg>
                {error}
              </div>
            )}

            {/* ================= FORM ================= */}
            <div className="form-area">
              {/* LOGIN */}
              {isLogin ? (
                <>
                  <div className="input-group">
                    <label>Email Address</label>
                    <input
                      type="email"
                      name="email"
                      placeholder="Enter your email"
                      value={form.email}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="input-group">
                    <label>Password</label>
                    <div className="password-box">
                      <input
                        type={showPass ? "text" : "password"}
                        name="password"
                        placeholder="Enter your password"
                        value={form.password}
                        onChange={handleChange}
                      />
                      <span className="toggle-pass" onClick={() => setShowPass(!showPass)}>
                        {showPass ? (
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24M1 1l22 22" strokeWidth="2" strokeLinecap="round" />
                          </svg>
                        ) : (
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" strokeWidth="2" />
                            <circle cx="12" cy="12" r="3" strokeWidth="2" />
                          </svg>
                        )}
                      </span>
                    </div>
                  </div>

                  <div className="remember-forgot">
                    <label className="remember-box">
                      <input type="checkbox" checked={remember} onChange={() => setRemember(!remember)} />
                      <span>Remember me</span>
                    </label>
                    <a href="#" className="forgot-link">
                      Forgot password?
                    </a>
                  </div>

                  <button className="auth-btn" onClick={handleAuth} disabled={loading}>
                    {loading ? (
                      <>
                        <span className="spinner"></span>
                        Loading...
                      </>
                    ) : (
                      "Login"
                    )}
                  </button>

                  <p className="switch-text">
                    Don't have an account?{" "}
                    <span onClick={() => setShowRoleBox(true)}>Create new account</span>
                  </p>
                </>
              ) : (
                <>
                  {/* REGISTER FORM */}
                  <div className="register-form">
                    {form.role === "Company" ? (
                      <>
                        <div className="input-group">
                          <label>Company Name</label>
                          <input
                            type="text"
                            name="username"
                            placeholder="Enter company name"
                            value={form.username}
                            onChange={handleChange}
                          />
                        </div>

                        <div className="input-group">
                          <label>Email</label>
                          <input
                            type="email"
                            name="email"
                            placeholder="company@example.com"
                            value={form.email}
                            onChange={handleChange}
                          />
                        </div>

                        <div className="input-group">
                          <label>Company Registration No</label>
                          <input
                            type="text"
                            name="companyRegNo"
                            placeholder="Enter Company Reg No"
                            value={form.companyRegNo}
                            onChange={handleChange}
                          />
                        </div>

                        <div className="input-row">
                          <div className="input-group">
                            <label>Address</label>
                            <input
                              type="text"
                              name="address"
                              placeholder="Company address"
                              value={form.address}
                              onChange={handleChange}
                            />
                          </div>

                          <div className="input-group">
                            <label>District</label>
                            <select
                              name="district"
                              value={form.district}
                              onChange={handleChange}
                            >
                              <option value="">Select District</option>
                              {sriLankaDistricts.map((d) => (
                                <option key={d} value={d}>
                                  {d}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div className="input-group">
                          <label>Mobile No</label>
                          <input
                            type="text"
                            name="mobile"
                            placeholder="07X XXX XXXX"
                            value={form.mobile}
                            onChange={handleChange}
                          />
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="input-group">
                          <label>Full Name</label>
                          <input
                            type="text"
                            name="username"
                            placeholder="Enter your full name"
                            value={form.username}
                            onChange={handleChange}
                          />
                        </div>

                        <div className="input-group">
                          <label>Email</label>
                          <input
                            type="email"
                            name="email"
                            placeholder="your@email.com"
                            value={form.email}
                            onChange={handleChange}
                          />
                        </div>

                        <div className="input-group">
                          <label>NIC Number</label>
                          <input
                            type="text"
                            name="nic"
                            placeholder="Enter NIC"
                            value={form.nic}
                            onChange={handleChange}
                          />
                        </div>

                        <div className="input-row">
                          <div className="input-group">
                            <label>Address</label>
                            <input
                              type="text"
                              name="address"
                              placeholder="Your address"
                              value={form.address}
                              onChange={handleChange}
                            />
                          </div>

                          <div className="input-group">
                            <label>District</label>
                            <select
                              name="district"
                              value={form.district}
                              onChange={handleChange}
                            >
                              <option value="">Select District</option>
                              {sriLankaDistricts.map((d) => (
                                <option key={d} value={d}>
                                  {d}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div className="input-row">
                          <div className="input-group">
                            <label>Mobile No</label>
                            <input
                              type="text"
                              name="mobile"
                              placeholder="07X XXX XXXX"
                              value={form.mobile}
                              onChange={handleChange}
                            />
                          </div>

                          <div className="input-group">
                            <label>Job Title</label>
                            <select
                              name="jobTitle"
                              value={form.jobTitle}
                              onChange={handleChange}
                            >
                              <option value="">Select Job Title</option>
                              {Object.entries(groupedCategories).map(
                                ([category, jobs]) => (
                                  <optgroup label={category} key={category}>
                                    {jobs.map((job) => (
                                      <option key={job} value={job}>
                                        {job}
                                      </option>
                                    ))}
                                  </optgroup>
                                )
                              )}
                            </select>
                          </div>
                        </div>
                      </>
                    )}

                    <div className="input-group">
                      <label>Password</label>
                      <div className="password-box">
                        <input
                          type={showPass ? "text" : "password"}
                          name="password"
                          placeholder="Create password"
                          value={form.password}
                          onChange={handleChange}
                        />
                        <span className="toggle-pass" onClick={() => setShowPass(!showPass)}>
                          {showPass ? "👁️" : "👁️‍🗨️"}
                        </span>
                      </div>
                      {form.password && (
                        <small className="strength">{getPasswordStrength()}</small>
                      )}
                    </div>

                    <div className="input-group">
                      <label>Confirm Password</label>
                      <input
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm your password"
                        value={form.confirmPassword}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <button className="auth-btn" onClick={handleAuth} disabled={loading}>
                    {loading ? (
                      <>
                        <span className="spinner"></span>
                        Creating Account...
                      </>
                    ) : (
                      "Create Account"
                    )}
                  </button>

                  <p className="switch-text">
                    Already have an account? <span onClick={() => setIsLogin(true)}>Sign in</span>
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;