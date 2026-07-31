import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function AdminLoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    setError("");

    // Validation
    if (!email || !password) {
      setLoading(false);
      return setError("Email and password required");
    }

    try {
      const res = await axios.post(
        "https://student-internship-system.vercel.app/api/admin/login",
        { email, password }
      );

      // Save real JWT + user info returned by the backend
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      setLoading(false);

      // Redirect to Admin Dashboard
      navigate("/admin");
    } catch (err) {
      setLoading(false);
      setError(
        err.response?.data?.message || "Invalid admin email or password"
      );
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>

        {/* HEADER */}
        <div style={styles.header}>
          <h1 style={styles.title}>🛠️ Admin Panel</h1>
          <p style={styles.subtitle}>Student Internship Management System</p>
        </div>

        {/* ERROR */}
        {error && (
          <div style={styles.errorBox}>
            ⚠️ {error}
          </div>
        )}

        {/* FORM */}
        <div style={styles.form}>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              placeholder="admin@gmail.com"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(""); }}
              style={styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(""); }}
              style={styles.input}
            />
          </div>

          <button
            onClick={handleLogin}
            disabled={loading}
            style={loading ? styles.btnDisabled : styles.btn}
          >
            {loading ? "Logging in..." : "Login as Admin"}
          </button>

        </div>

      </div>
    </div>
  );
}

// ================= STYLES =================
const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#f0f2f5",
  },
  card: {
    background: "#ffffff",
    padding: "40px",
    borderRadius: "16px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
    width: "100%",
    maxWidth: "400px",
  },
  header: {
    textAlign: "center",
    marginBottom: "30px",
  },
  title: {
    fontSize: "28px",
    fontWeight: "700",
    color: "#1a1a2e",
    margin: "0 0 8px 0",
  },
  subtitle: {
    fontSize: "14px",
    color: "#666",
    margin: "0",
  },
  errorBox: {
    background: "#fff0f0",
    border: "1px solid #ffcccc",
    color: "#cc0000",
    padding: "10px 14px",
    borderRadius: "8px",
    marginBottom: "16px",
    fontSize: "14px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  label: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#333",
  },
  input: {
    padding: "12px 14px",
    borderRadius: "8px",
    border: "1.5px solid #ddd",
    fontSize: "14px",
    outline: "none",
    transition: "border 0.2s",
  },
  btn: {
    padding: "13px",
    background: "#1a1a2e",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "15px",
    fontWeight: "600",
    cursor: "pointer",
    marginTop: "8px",
  },
  btnDisabled: {
    padding: "13px",
    background: "#999",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "15px",
    fontWeight: "600",
    cursor: "not-allowed",
    marginTop: "8px",
  },
};

export default AdminLoginPage;