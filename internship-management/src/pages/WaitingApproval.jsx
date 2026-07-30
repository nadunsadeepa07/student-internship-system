import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

const WaitingApproval = () => {
  const location = useLocation();
  const message = location.state?.message || "Your registration request has been submitted. Please wait for admin approval.";

  // Additional states and functions
  const [timeLeft, setTimeLeft] = useState(30); // seconds for auto-redirect
  const [showResend, setShowResend] = useState(false);
  const [resendStatus, setResendStatus] = useState("");
  const [inspirationIndex, setInspirationIndex] = useState(0);
  const [isPolling, setIsPolling] = useState(false);
  const [pollCount, setPollCount] = useState(0);

  const quotes = [
    "✨ Great things take time. Your account is being prepared.",
    "🚀 Almost there! The admin is reviewing your details.",
    "💡 Patience is the key to success. You're on the right track.",
    "🌟 Good things come to those who wait. Hang tight!",
    "⚡ While you wait, imagine all the possibilities ahead."
  ];

  // Auto redirect timer
  useEffect(() => {
    if (timeLeft <= 0) {
      window.location.href = "/login";
      return;
    }
    const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft]);

  // Rotate inspirational quotes every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setInspirationIndex((prev) => (prev + 1) % quotes.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [quotes.length]);

  // Simulate status polling (just for demo)
  const startPolling = () => {
    setIsPolling(true);
    setPollCount(0);
    const interval = setInterval(() => {
      setPollCount((prev) => prev + 1);
      if (pollCount >= 5) {
        clearInterval(interval);
        setIsPolling(false);
        setResendStatus("Still pending. We'll notify you once approved.");
      }
    }, 2000);
    // Cleanup on unmount
    return () => clearInterval(interval);
  };

  const handleResendEmail = () => {
    setResendStatus("Sending verification request...");
    setTimeout(() => {
      setResendStatus("Verification email sent! (demo)");
      setShowResend(false);
    }, 1500);
  };

  const cancelRedirect = () => {
    setTimeLeft(null); // stops auto-redirect
  };

  const goToLoginNow = () => {
    window.location.href = "/login";
  };

  return (
    <div style={styles.container}>
      <div style={styles.glassCard}>
        {/* Animated icon */}
        <div style={styles.iconWrapper}>
          <div style={styles.pulseRing}></div>
          <span style={styles.icon}>⏳</span>
        </div>

        <h3 style={styles.title}>Account Verification Pending</h3>
        <p style={styles.message}>{message}</p>

        <div style={styles.quoteBox}>
          <span style={styles.quoteIcon}>💬</span>
          <p style={styles.quoteText}>{quotes[inspirationIndex]}</p>
        </div>

        {/* Simulated progress or info */}
        <div style={styles.infoBox}>
          <div style={styles.infoRow}>
            <span>🕒 Estimated review time:</span>
            <strong>~ 2–4 hours</strong>
          </div>
          <div style={styles.infoRow}>
            <span>📧 Notifications:</span>
            <strong>You'll receive an email once approved</strong>
          </div>
        </div>

        {/* Resend / Polling options */}
        <div style={styles.actionGroup}>
          {!showResend && !isPolling && (
            <button style={styles.secondaryBtn} onClick={() => setShowResend(true)}>
              📬 Resend verification request
            </button>
          )}
          {showResend && (
            <div style={styles.resendPanel}>
              <p style={{ fontSize: "13px", marginBottom: "8px" }}>
                Request a reminder email to the admin?
              </p>
              <div style={{ display: "flex", gap: "10px" }}>
                <button style={styles.smallBtn} onClick={handleResendEmail}>
                  Yes, send request
                </button>
                <button style={styles.smallBtnOutline} onClick={() => setShowResend(false)}>
                  Cancel
                </button>
              </div>
              {resendStatus && <p style={styles.statusMsg}>{resendStatus}</p>}
            </div>
          )}

          {!isPolling && !showResend && (
            <button style={styles.secondaryBtn} onClick={startPolling}>
              🔄 Check approval status (demo)
            </button>
          )}
          {isPolling && (
            <div style={styles.pollingIndicator}>
              <span className="spinner-small"></span>
              <span>Checking status... ({pollCount}/5)</span>
            </div>
          )}
        </div>

        {/* Timer and redirect controls */}
        <div style={styles.timerSection}>
          {timeLeft !== null && timeLeft > 0 ? (
            <>
              <p style={styles.timerText}>
                Redirecting to login in <strong>{timeLeft}</strong> second{timeLeft !== 1 ? "s" : ""}
              </p>
              <div style={styles.timerButtons}>
                <button style={styles.linkBtn} onClick={cancelRedirect}>
                  Stay on this page
                </button>
                <button style={styles.linkBtn} onClick={goToLoginNow}>
                  Go to login now
                </button>
              </div>
            </>
          ) : timeLeft === null ? (
            <button style={styles.primaryBtn} onClick={goToLoginNow}>
              Back to Login
            </button>
          ) : null}
        </div>

        {/* Fallback button (always visible) */}
        <button style={styles.primaryBtnOutline} onClick={goToLoginNow}>
          Back to Login
        </button>

        <p style={styles.helpText}>
          Need help? Contact us at <a href="mailto:support@example.com">support@example.com</a>
        </p>
      </div>

      {/* Inline styles with keyframes */}
      <style>
        {`
          @keyframes pulse {
            0% { transform: scale(1); opacity: 0.6; }
            100% { transform: scale(1.5); opacity: 0; }
          }
          @keyframes float {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-8px); }
            100% { transform: translateY(0px); }
          }
          .spinner-small {
            display: inline-block;
            width: 14px;
            height: 14px;
            border: 2px solid rgba(79, 70, 229, 0.3);
            border-top-color: #4F46E5;
            border-radius: 50%;
            animation: spin 0.8s linear infinite;
            margin-right: 8px;
          }
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

// Creative CSS-in-JS with modern design
const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "rgba(0, 0, 0, 0.67)",
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    padding: "20px",
  },
  glassCard: {
    background: "rgba(255, 255, 255, 0.95)",
    backdropFilter: "blur(10px)",
    borderRadius: "32px",
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25), inset 0 1px 0 rgba(255,255,255,0.5)",
    padding: "40px 32px",
    maxWidth: "520px",
    width: "100%",
    textAlign: "center",
    transition: "transform 0.3s ease",
    border: "1px solid rgba(255,255,255,0.2)",
  },
  iconWrapper: {
    position: "relative",
    display: "inline-flex",
    marginBottom: "24px",
  },
  pulseRing: {
    position: "absolute",
    top: "-12px",
    left: "-12px",
    right: "-12px",
    bottom: "-12px",
    borderRadius: "50%",
    backgroundColor: "#4F46E5",
    animation: "pulse 1.5s infinite",
    opacity: 0,
  },
  icon: {
    fontSize: "56px",
    display: "inline-block",
    animation: "float 3s ease-in-out infinite",
    position: "relative",
    zIndex: 1,
  },
  title: {
    fontSize: "28px",
    fontWeight: "700",
    margin: "0 0 12px 0",
    background: "linear-gradient(135deg, #4F46E5, #7C3AED)",
    WebkitBackgroundClip: "text",
    backgroundClip: "text",
    color: "transparent",
  },
  message: {
    fontSize: "16px",
    color: "#4B5563",
    lineHeight: "1.5",
    marginBottom: "28px",
  },
  quoteBox: {
    background: "#F3F4F6",
    borderRadius: "20px",
    padding: "16px 20px",
    marginBottom: "24px",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    textAlign: "left",
    borderLeft: "4px solid #4F46E5",
  },
  quoteIcon: {
    fontSize: "24px",
  },
  quoteText: {
    margin: 0,
    fontSize: "14px",
    color: "#1F2937",
    fontStyle: "italic",
  },
  infoBox: {
    background: "#FFFFFF",
    borderRadius: "16px",
    padding: "16px",
    marginBottom: "24px",
    border: "1px solid #E5E7EB",
    textAlign: "left",
  },
  infoRow: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "10px",
    fontSize: "14px",
    "&:last-child": { marginBottom: 0 },
  },
  actionGroup: {
    marginBottom: "28px",
  },
  secondaryBtn: {
    background: "#EEF2FF",
    border: "none",
    padding: "10px 18px",
    borderRadius: "40px",
    fontSize: "14px",
    fontWeight: "500",
    color: "#4F46E5",
    cursor: "pointer",
    margin: "0 6px 12px 6px",
    transition: "all 0.2s",
    "&:hover": { background: "#E0E7FF", transform: "scale(0.98)" },
  },
  smallBtn: {
    background: "#4F46E5",
    border: "none",
    padding: "6px 14px",
    borderRadius: "30px",
    fontSize: "13px",
    fontWeight: "500",
    color: "white",
    cursor: "pointer",
  },
  smallBtnOutline: {
    background: "transparent",
    border: "1px solid #D1D5DB",
    padding: "6px 14px",
    borderRadius: "30px",
    fontSize: "13px",
    fontWeight: "500",
    color: "#6B7280",
    cursor: "pointer",
  },
  resendPanel: {
    marginTop: "12px",
    padding: "12px",
    background: "#F9FAFB",
    borderRadius: "16px",
  },
  statusMsg: {
    fontSize: "12px",
    color: "#10B981",
    marginTop: "8px",
  },
  pollingIndicator: {
    display: "inline-flex",
    alignItems: "center",
    background: "#F3F4F6",
    padding: "8px 16px",
    borderRadius: "40px",
    fontSize: "13px",
    color: "#4B5563",
  },
  timerSection: {
    marginBottom: "20px",
  },
  timerText: {
    fontSize: "14px",
    color: "#6B7280",
    marginBottom: "10px",
  },
  timerButtons: {
    display: "flex",
    gap: "12px",
    justifyContent: "center",
  },
  linkBtn: {
    background: "none",
    border: "none",
    color: "#4F46E5",
    fontSize: "13px",
    fontWeight: "500",
    cursor: "pointer",
    textDecoration: "underline",
  },
  primaryBtn: {
    background: "linear-gradient(135deg, #4F46E5, #7C3AED)",
    border: "none",
    padding: "12px 24px",
    borderRadius: "40px",
    fontSize: "16px",
    fontWeight: "600",
    color: "white",
    cursor: "pointer",
    width: "100%",
    marginBottom: "12px",
    transition: "opacity 0.2s",
    "&:hover": { opacity: 0.9 },
  },
  primaryBtnOutline: {
    background: "transparent",
    border: "2px solid #4F46E5",
    padding: "10px 22px",
    borderRadius: "40px",
    fontSize: "14px",
    fontWeight: "600",
    color: "#4F46E5",
    cursor: "pointer",
    width: "100%",
    transition: "all 0.2s",
    "&:hover": { background: "#EEF2FF" },
  },
  helpText: {
    fontSize: "12px",
    color: "#9CA3AF",
    marginTop: "24px",
    "& a": { color: "#4F46E5", textDecoration: "none" },
  },
};

export default WaitingApproval;