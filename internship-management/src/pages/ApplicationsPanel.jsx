// src/components/ApplicationsPanel.jsx
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

/* ─── Design tokens — colourful blue palette ─── */
const FONT = "'DM Sans', 'Helvetica Neue', sans-serif";
const MONO = "'DM Mono', 'Fira Mono', monospace";

const INK = "#0B2545";          // deep navy — primary text
const INK_SOFT = "#173F78";     // secondary navy
const MUTED = "#7288AC";        // muted blue-grey
const FAINT = "#1c1c1c";        // faint blue-grey
const BORDER = "#97a6c5";       // light blue border
const PAGE_BG = "#66151500";      // soft blue page wash
const CARD_BG = "#FFFFFF";
const PRIMARY = "#2554E0";      // vivid cobalt — primary actions
const PRIMARY_DARK = "#17347A"; // pressed / hover
const PRIMARY_SOFT = "#E7EEFF"; // soft primary tint
const ACCENT_CYAN = "#0EA5C7";
const ACCENT_INDIGO = "#5B4EE6";
const ACCENT_TEAL = "#0D8272";
const SHADOW_BLUE = "0 4px 24px rgba(30,64,175,0.08)";
const SHADOW_BLUE_LG = "0 10px 34px rgba(30,64,175,0.12)";

/* ─── Palette & helpers ─── */
const AVATAR_PALETTE = [
  { bg: "#DCE6FF", color: "#1D4ED8" }, // cobalt
  { bg: "#D3F3FA", color: "#0891B2" }, // cyan
  { bg: "#E3E0FF", color: "#4F46E5" }, // indigo
  { bg: "#D8E4FA", color: "#1E3A78" }, // navy
  { bg: "#D2F3EC", color: "#0D8272" }, // teal
  { bg: "#E7E2FF", color: "#5B3FD1" }, // periwinkle
];

function getAvatarColor(i) {
  return AVATAR_PALETTE[i % AVATAR_PALETTE.length];
}
function getInitials(name = "") {
  return name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();
}
function formatDate(d) {
  if (!d) return "—";
  const [y, m, day] = d.split("-");
  return `${day}/${m}/${y}`;
}

const STATUS_CHIP = {
  Pending:  { bg: "#FFF3CD", color: "#7A5200", dot: "#F0A500" },
  Accepted: { bg: "#D6F0E8", color: "#0D5C3E", dot: "#1BAD7C" },
  Rejected: { bg: "#FFE1E6", color: "#96214A", dot: "#E5507A" },
};

/* ─── Micro-components ─── */

const Avatar = ({ name, index, size = 44 }) => {
  const { bg, color } = getAvatarColor(index);
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: bg, color,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: size * 0.31, fontWeight: 700, fontFamily: MONO,
      flexShrink: 0, letterSpacing: "-0.02em",
      boxShadow: `0 0 0 2px #fff, 0 0 0 3px ${color}22`,
    }}>
      {getInitials(name)}
    </div>
  );
};

const StatusChip = ({ status }) => {
  const s = STATUS_CHIP[status] || { bg: "#E7EEFF", color: PRIMARY_DARK, dot: PRIMARY };
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      fontSize: 11, fontWeight: 600, letterSpacing: "0.04em",
      padding: "4px 10px 4px 8px", borderRadius: 20,
      background: s.bg, color: s.color, fontFamily: MONO,
      textTransform: "uppercase",
    }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: s.dot, display: "inline-block" }} />
      {status}
    </span>
  );
};

const STAT_ACCENTS = {
  Pending: "#F0A500",
  Accepted: ACCENT_TEAL,
  Rejected: "#E5507A",
};

const StatCard = ({ label, value, color, sub }) => (
  <div style={{
    background: CARD_BG,
    border: `1.5px solid ${BORDER}`,
    borderTop: `3px solid ${color}`,
    borderRadius: 16,
    padding: "1.1rem 1.25rem",
    display: "flex", flexDirection: "column", gap: 4,
    transition: "box-shadow .2s, transform .2s",
    cursor: "default",
  }}
    onMouseEnter={e => { e.currentTarget.style.boxShadow = SHADOW_BLUE_LG; e.currentTarget.style.transform = "translateY(-2px)"; }}
    onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "none"; }}
  >
    <span style={{ fontSize: 11, color: FAINT, fontFamily: MONO, textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</span>
    <span style={{ fontSize: 30, fontWeight: 800, color, lineHeight: 1, fontFamily: MONO }}>{value}</span>
    {sub && <span style={{ fontSize: 11, color: FAINT }}>{sub}</span>}
  </div>
);

/* ─── Search bar ─── */
const SearchBar = ({ value, onChange }) => (
  <div style={{
    display: "flex", alignItems: "center", gap: 10,
    background: CARD_BG,
    border: `1.5px solid ${BORDER}`,
    borderRadius: 12, padding: "7px 14px",
    flex: 1, minWidth: 0,
    transition: "border-color .15s, box-shadow .15s",
  }}
    onFocus={e => { e.currentTarget.style.borderColor = PRIMARY; e.currentTarget.style.boxShadow = `0 0 0 3px ${PRIMARY_SOFT}`; }}
    onBlur={e => { e.currentTarget.style.borderColor = BORDER; e.currentTarget.style.boxShadow = "none"; }}
  >
    <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
      <circle cx="9" cy="9" r="6.5" stroke={FAINT} strokeWidth="2" />
      <path d="M14 14l4 4" stroke={FAINT} strokeWidth="2" strokeLinecap="round" />
    </svg>
    <input
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder="Search applicants..."
      style={{
        border: "none", outline: "none", background: "transparent",
        fontSize: 13, color: INK, width: "100%", fontFamily: FONT,
      }}
    />
    {value && (
      <button onClick={() => onChange("")} style={{ background: "none", border: "none", cursor: "pointer", color: FAINT, fontSize: 14, padding: 0 }}>✕</button>
    )}
  </div>
);

/* ─── Sort selector ─── */
const SortSelect = ({ value, onChange }) => (
  <select
    value={value}
    onChange={e => onChange(e.target.value)}
    style={{
      border: `1.5px solid ${BORDER}`, borderRadius: 12,
      padding: "7px 12px", fontSize: 12, fontFamily: MONO,
      color: INK_SOFT, background: CARD_BG, cursor: "pointer",
      outline: "none",
    }}
  >
    <option value="newest">Newest first</option>
    <option value="oldest">Oldest first</option>
    <option value="name_az">Name A→Z</option>
    <option value="name_za">Name Z→A</option>
  </select>
);

/* ─── View toggle ─── */
const ViewToggle = ({ view, onChange }) => (
  <div style={{ display: "flex", gap: 0, border: `1.5px solid ${BORDER}`, borderRadius: 10, overflow: "hidden" }}>
    {[
      { id: "list", icon: "▤" },
      { id: "grid", icon: "⊞" },
    ].map(({ id, icon }) => (
      <button key={id} onClick={() => onChange(id)} style={{
        padding: "6px 12px", border: "none",
        background: view === id ? PRIMARY : CARD_BG,
        color: view === id ? "#fff" : MUTED,
        cursor: "pointer", fontSize: 14, transition: "all .15s",
      }}>{icon}</button>
    ))}
  </div>
);

/* ─── Confirm Dialog ─── */
const ConfirmDialog = ({ message, onConfirm, onCancel }) => (
  <div onClick={e => e.target === e.currentTarget && onCancel()} style={{
    position: "fixed", inset: 0, background: "rgba(11,37,69,0.45)",
    display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200,
  }}>
    <div style={{
      background: CARD_BG, borderRadius: 16, padding: "1.75rem",
      maxWidth: 340, width: "100%", boxShadow: "0 20px 60px rgba(11,37,69,0.25)",
    }}>
      <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 8, fontFamily: FONT, color: INK }}>Are you sure?</div>
      <div style={{ fontSize: 13, color: MUTED, marginBottom: "1.5rem", lineHeight: 1.5 }}>{message}</div>
      <div style={{ display: "flex", gap: 8 }}>
        <button onClick={onCancel} style={{
          flex: 1, padding: "9px", borderRadius: 8, border: `1.5px solid ${BORDER}`,
          background: CARD_BG, color: INK_SOFT, cursor: "pointer", fontSize: 13, fontFamily: FONT,
        }}>Cancel</button>
        <button onClick={onConfirm} style={{
          flex: 1, padding: "9px", borderRadius: 8, border: "none",
          background: "#E5507A", color: "#fff", cursor: "pointer",
          fontSize: 13, fontWeight: 600, fontFamily: FONT,
        }}>Reject</button>
      </div>
    </div>
  </div>
);

/* ─── Interview Modal ─── */
const InterviewModal = ({ app, appIndex, onClose, onSubmit }) => {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!date || !time) return alert("Please set both a date and time.");
    setLoading(true);
    await onSubmit(app._id, date, time);
    setLoading(false);
  };

  if (!app) return null;

  return (
    <div onClick={e => e.target === e.currentTarget && onClose()} style={{
      position: "fixed", inset: 0, background: "rgba(11,37,69,0.5)",
      display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100,
    }}>
      <div style={{
        background: CARD_BG, borderRadius: 20, padding: "2rem",
        width: "100%", maxWidth: 400,
        boxShadow: "0 24px 80px rgba(11,37,69,0.3)",
        fontFamily: FONT,
      }}
        role="dialog" aria-modal="true" aria-label="Schedule interview"
      >
        {/* Modal header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 800, letterSpacing: "-0.02em", color: INK }}>Schedule Interview</div>
            <div style={{ fontSize: 12, color: FAINT, marginTop: 2 }}>Set date &amp; time for the candidate</div>
          </div>
          <button onClick={onClose} aria-label="Close" style={{
            background: PRIMARY_SOFT, border: "none", borderRadius: 8,
            width: 32, height: 32, cursor: "pointer", fontSize: 14, color: PRIMARY_DARK,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>✕</button>
        </div>

        {/* Applicant preview */}
        <div style={{
          display: "flex", alignItems: "center", gap: 12, padding: "12px 14px",
          background: PRIMARY_SOFT, borderRadius: 12, marginBottom: "1.5rem",
          border: `1.5px solid ${BORDER}`,
        }}>
          <Avatar name={app.studentName} index={appIndex} size={40} />
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: INK }}>{app.studentName}</div>
            <div style={{ fontSize: 12, color: MUTED, marginTop: 1 }}>{app.studentEmail}</div>
          </div>
        </div>

        {/* Date & Time row */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: "1.25rem" }}>
          <div>
            <label htmlFor="iDate" style={{ display: "block", fontSize: 11, color: FAINT, marginBottom: 6, fontFamily: MONO, textTransform: "uppercase", letterSpacing: "0.06em" }}>
              Date
            </label>
            <input id="iDate" type="date" value={date} onChange={e => setDate(e.target.value)}
              style={{
                width: "100%", padding: "8px 10px", borderRadius: 8,
                border: `1.5px solid ${BORDER}`, fontSize: 13, fontFamily: FONT, color: INK,
                outline: "none", boxSizing: "border-box",
              }}
            />
          </div>
          <div>
            <label htmlFor="iTime" style={{ display: "block", fontSize: 11, color: FAINT, marginBottom: 6, fontFamily: MONO, textTransform: "uppercase", letterSpacing: "0.06em" }}>
              Time
            </label>
            <input id="iTime" type="time" value={time} onChange={e => setTime(e.target.value)}
              style={{
                width: "100%", padding: "8px 10px", borderRadius: 8,
                border: `1.5px solid ${BORDER}`, fontSize: 13, fontFamily: FONT, color: INK,
                outline: "none", boxSizing: "border-box",
              }}
            />
          </div>
        </div>

        <button onClick={handleSubmit} disabled={loading} style={{
          width: "100%", padding: "11px", borderRadius: 10, border: "none",
          background: loading ? FAINT : `linear-gradient(120deg, ${PRIMARY}, ${ACCENT_INDIGO})`,
          color: "#fff",
          fontSize: 14, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer",
          fontFamily: FONT, letterSpacing: "-0.01em", transition: "background .2s",
        }}>
          {loading ? "Scheduling…" : "✓ Confirm & Schedule"}
        </button>
      </div>
    </div>
  );
};

/* ─── Application Card (List view) ─── */
const AppCardList = ({ app, index, onAccept, onReject }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div style={{
      background: CARD_BG,
      border: `1.5px solid ${BORDER}`,
      borderRadius: 16,
      overflow: "hidden",
      transition: "box-shadow .2s",
    }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = SHADOW_BLUE}
      onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}
    >
      {/* Main row */}
      <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "1.1rem 1.25rem" }}>
        <Avatar name={app.studentName} index={index} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <span style={{ fontSize: 15, fontWeight: 700, letterSpacing: "-0.01em", color: INK }}>{app.studentName}</span>
            <StatusChip status={app.status} />
          </div>
          <div style={{ fontSize: 12, color: FAINT, marginTop: 2, fontFamily: MONO }}>{app.studentEmail}</div>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
          {app.status === "Accepted" && (
            <div style={{ fontSize: 12, color: MUTED, fontFamily: MONO, textAlign: "right" }}>
              <div>📅 {formatDate(app.interviewDate)}</div>
              <div>⏰ {app.interviewTime}</div>
            </div>
          )}
          {app.status === "Pending" && (
            <>
              <button onClick={() => onAccept(app)} style={{
                fontSize: 12, padding: "6px 14px", borderRadius: 8, border: "none",
                background: "#D6F0E8", color: "#0D5C3E", cursor: "pointer",
                fontWeight: 600, fontFamily: FONT, display: "flex", alignItems: "center", gap: 4,
              }}>✓ Accept</button>
              <button onClick={() => onReject(app._id)} style={{
                fontSize: 12, padding: "6px 14px", borderRadius: 8, border: "none",
                background: "#FFE1E6", color: "#96214A", cursor: "pointer",
                fontWeight: 600, fontFamily: FONT, display: "flex", alignItems: "center", gap: 4,
              }}>✕ Reject</button>
            </>
          )}
          <button onClick={() => setExpanded(p => !p)} style={{
            background: PRIMARY_SOFT, border: "none", borderRadius: 8,
            width: 30, height: 30, cursor: "pointer", fontSize: 12, color: PRIMARY_DARK,
            display: "flex", alignItems: "center", justifyContent: "center",
            transform: expanded ? "rotate(180deg)" : "none", transition: "transform .2s",
          }}>▾</button>
        </div>
      </div>

      {/* Expanded details */}
      {expanded && (
        <div style={{
          padding: "0 1.25rem 1.25rem",
          borderTop: `1.5px solid ${BORDER}`,
          paddingTop: "1rem",
        }}>
          {app.about && (
            <p style={{ fontSize: 13, color: INK_SOFT, lineHeight: 1.65, marginBottom: 12 }}>{app.about}</p>
          )}
          {app.skills?.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 12 }}>
              {app.skills.map(s => (
                <span key={s} style={{
                  fontSize: 11, padding: "3px 10px", borderRadius: 6,
                  background: PRIMARY_SOFT, color: PRIMARY_DARK, fontFamily: MONO,
                  border: `1px solid ${BORDER}`,
                }}>{s}</span>
              ))}
            </div>
          )}
          <a href={`https://student-internship-system.vercel.app/uploads/${app.resume}`} target="_blank" rel="noreferrer"
            style={{ fontSize: 12, color: PRIMARY, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 5, fontFamily: MONO }}>
            📄 {app.resume}
          </a>
        </div>
      )}
    </div>
  );
};

/* ─── Application Card (Grid view) ─── */
const AppCardGrid = ({ app, index, onAccept, onReject }) => (
  <div style={{
    background: CARD_BG, border: `1.5px solid ${BORDER}`, borderRadius: 16,
    padding: "1.25rem", display: "flex", flexDirection: "column", gap: 10,
    transition: "box-shadow .2s",
  }}
    onMouseEnter={e => e.currentTarget.style.boxShadow = SHADOW_BLUE_LG}
    onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}
  >
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
      <Avatar name={app.studentName} index={index} size={48} />
      <StatusChip status={app.status} />
    </div>
    <div>
      <div style={{ fontSize: 15, fontWeight: 700, letterSpacing: "-0.01em", color: INK }}>{app.studentName}</div>
      <div style={{ fontSize: 12, color: FAINT, marginTop: 2, fontFamily: MONO }}>{app.studentEmail}</div>
    </div>
    {app.about && (
      <p style={{ fontSize: 12, color: MUTED, lineHeight: 1.6, margin: 0,
        display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
        {app.about}
      </p>
    )}
    {app.skills?.length > 0 && (
      <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
        {app.skills.slice(0, 3).map(s => (
          <span key={s} style={{ fontSize: 10, padding: "2px 8px", borderRadius: 5, background: PRIMARY_SOFT, color: PRIMARY_DARK, fontFamily: MONO, border: `1px solid ${BORDER}` }}>{s}</span>
        ))}
        {app.skills.length > 3 && <span style={{ fontSize: 10, color: FAINT, padding: "2px 0" }}>+{app.skills.length - 3}</span>}
      </div>
    )}
    <div style={{ marginTop: "auto", paddingTop: 10, borderTop: `1.5px solid ${BORDER}` }}>
      {app.status === "Pending" && (
        <div style={{ display: "flex", gap: 6 }}>
          <button onClick={() => onAccept(app)} style={{
            flex: 1, fontSize: 12, padding: "7px", borderRadius: 8, border: "none",
            background: "#D6F0E8", color: "#0D5C3E", cursor: "pointer", fontWeight: 600, fontFamily: FONT,
          }}>✓ Accept</button>
          <button onClick={() => onReject(app._id)} style={{
            flex: 1, fontSize: 12, padding: "7px", borderRadius: 8, border: "none",
            background: "#FFE1E6", color: "#96214A", cursor: "pointer", fontWeight: 600, fontFamily: FONT,
          }}>✕ Reject</button>
        </div>
      )}
      {app.status === "Accepted" && (
        <div style={{ fontSize: 12, color: ACCENT_TEAL, fontFamily: MONO, display: "flex", gap: 10 }}>
          <span>📅 {formatDate(app.interviewDate)}</span>
          <span>⏰ {app.interviewTime}</span>
        </div>
      )}
      {app.status === "Rejected" && (
        <div style={{ fontSize: 12, color: FAINT, fontFamily: MONO }}>Application closed</div>
      )}
    </div>
  </div>
);

/* ─── Filter Pills ─── */
const FILTERS = ["All", "Pending", "Accepted", "Rejected"];

const FilterPills = ({ active, onChange, counts }) => (
  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
    {FILTERS.map(f => {
      const isActive = active === f;
      return (
        <button key={f} onClick={() => onChange(f)} style={{
          fontSize: 12, padding: "5px 14px", borderRadius: 20,
          border: isActive ? "none" : `1.5px solid ${BORDER}`,
          background: isActive ? PRIMARY : CARD_BG,
          color: isActive ? "#fff" : INK_SOFT,
          fontWeight: isActive ? 700 : 400,
          cursor: "pointer", fontFamily: FONT,
          display: "inline-flex", alignItems: "center", gap: 5,
          transition: "all .15s",
        }}>
          {f}
          {f !== "All" && (
            <span style={{
              fontSize: 10, background: isActive ? "rgba(255,255,255,0.25)" : PRIMARY_SOFT,
              color: isActive ? "#fff" : PRIMARY_DARK,
              borderRadius: 10, padding: "1px 6px", fontFamily: MONO,
            }}>{counts[f] || 0}</span>
          )}
        </button>
      );
    })}
  </div>
);

/* ─── Toast Notification ─── */
const Toast = ({ message, type, onDone }) => {
  useEffect(() => {
    const t = setTimeout(onDone, 3000);
    return () => clearTimeout(t);
  }, [onDone]);

  const colors = { success: { bg: "#D6F0E8", color: "#0D5C3E" }, error: { bg: "#FFE1E6", color: "#96214A" } };
  const s = colors[type] || colors.success;

  return (
    <div style={{
      position: "fixed", bottom: 24, right: 24, zIndex: 300,
      background: s.bg, color: s.color,
      padding: "12px 20px", borderRadius: 12, fontSize: 13, fontWeight: 600,
      boxShadow: "0 8px 30px rgba(11,37,69,0.18)", fontFamily: FONT,
      animation: "slideUp .25s ease",
    }}>
      {message}
    </div>
  );
};

/* ─── Main Component ─── */
const ApplicationsPanel = ({ companyId, getAuthHeaders, onBack }) => {
  const [applications, setApplications] = useState([]);
  const [interviewApp, setInterviewApp] = useState(null);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");
  const [view, setView] = useState("list");
  const [rejectConfirm, setRejectConfirm] = useState(null); // id to confirm
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);

  const showToast = (message, type = "success") => setToast({ message, type });

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `https://student-internship-system.vercel.app/api/company/applications?companyId=${companyId}`,
        { headers: getAuthHeaders() }
      );
      setApplications(res.data);
    } catch (err) {
      console.log(err);
      showToast("Failed to load applications", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (companyId) fetchApplications();
  }, [companyId]);

  const acceptApplication = async (id, date, time) => {
    try {
      await axios.put(`https://student-internship-system.vercel.app/api/company/application/accept/${id}`, { date, time });
      fetchApplications();
      setInterviewApp(null);
      showToast("Interview scheduled successfully!");
    } catch (err) {
      console.log(err);
      showToast("Failed to accept application", "error");
    }
  };

  const rejectApplication = async (id) => {
    try {
      await axios.put(`https://student-internship-system.vercel.app/api/company/application/reject/${id}`);
      fetchApplications();
      setRejectConfirm(null);
      showToast("Application rejected");
    } catch (err) {
      console.log(err);
      showToast("Failed to reject application", "error");
    }
  };

  /* Filter → search → sort */
  let filtered = filter === "All" ? applications : applications.filter(a => a.status === filter);
  if (search.trim()) {
    const q = search.toLowerCase();
    filtered = filtered.filter(a =>
      a.studentName?.toLowerCase().includes(q) ||
      a.studentEmail?.toLowerCase().includes(q) ||
      a.skills?.some(s => s.toLowerCase().includes(q))
    );
  }
  filtered = [...filtered].sort((a, b) => {
    if (sort === "name_az") return (a.studentName || "").localeCompare(b.studentName || "");
    if (sort === "name_za") return (b.studentName || "").localeCompare(a.studentName || "");
    if (sort === "oldest") return (a._id || "").localeCompare(b._id || "");
    return (b._id || "").localeCompare(a._id || ""); // newest
  });

  const countOf = s => applications.filter(a => a.status === s).length;
  const counts = { Pending: countOf("Pending"), Accepted: countOf("Accepted"), Rejected: countOf("Rejected") };
  const interviewAppIndex = interviewApp ? applications.findIndex(a => a._id === interviewApp._id) : -1;

  return (
    <div style={{ background: PAGE_BG, padding: "2rem 0", minHeight: "100%" }}>
    <div style={{ padding: "0 1.5rem", fontFamily: FONT, maxWidth: 860, margin: "0 auto" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700;800&family=DM+Mono:wght@400;500&display=swap'); @keyframes slideUp { from { transform: translateY(12px); opacity:0; } to { transform: translateY(0); opacity:1; } }`}</style>

      {/* ── Header ── */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.75rem", flexWrap: "wrap", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <button onClick={onBack} style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            fontSize: 12, color: INK_SOFT, background: CARD_BG,
            border: `1.5px solid ${BORDER}`, borderRadius: 10, padding: "7px 14px",
            cursor: "pointer", fontFamily: FONT, fontWeight: 500,
          }}>← Back</button>
          <div>
            <h1 style={{
              fontSize: 22, fontWeight: 800, letterSpacing: "-0.03em", margin: 0, lineHeight: 1.1,
              background: `linear-gradient(100deg, ${INK} 30%, ${PRIMARY} 75%, ${ACCENT_CYAN})`,
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
            }}>Applications</h1>
            <p style={{ fontSize: 12, color: MUTED, margin: 0, marginTop: 2, fontFamily: MONO }}>{applications.length} total received</p>
          </div>
        </div>
        <button onClick={fetchApplications} style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          fontSize: 12, color: PRIMARY_DARK, background: PRIMARY_SOFT,
          border: `1.5px solid ${BORDER}`, borderRadius: 10, padding: "7px 14px",
          cursor: "pointer", fontFamily: FONT, fontWeight: 600,
        }}>↺ Refresh</button>
      </div>

      {/* ── Stats ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: "2rem" }}>
        <StatCard label="Pending" value={countOf("Pending")} color={STAT_ACCENTS.Pending} sub="awaiting review" />
        <StatCard label="Accepted" value={countOf("Accepted")} color={STAT_ACCENTS.Accepted} sub="scheduled" />
        <StatCard label="Rejected" value={countOf("Rejected")} color={STAT_ACCENTS.Rejected} sub="closed" />
      </div>

      {/* ── Controls ── */}
      <div style={{ display: "flex", gap: 10, marginBottom: "1.25rem", flexWrap: "wrap", alignItems: "center" }}>
        <SearchBar value={search} onChange={setSearch} />
        <SortSelect value={sort} onChange={setSort} />
        <ViewToggle view={view} onChange={setView} />
      </div>

      <div style={{ marginBottom: "1.25rem" }}>
        <FilterPills active={filter} onChange={setFilter} counts={counts} />
      </div>

      {/* ── Results header ── */}
      <div style={{ fontSize: 12, color: FAINT, fontFamily: MONO, marginBottom: "0.75rem" }}>
        {filtered.length === 0 ? "No results" : `${filtered.length} applicant${filtered.length !== 1 ? "s" : ""}`}
        {search && ` for "${search}"`}
      </div>

      {/* ── Cards ── */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "4rem", color: FAINT, fontSize: 13, fontFamily: MONO }}>Loading…</div>
      ) : filtered.length === 0 ? (
        <div style={{
          textAlign: "center", padding: "4rem 1rem",
          background: PRIMARY_SOFT, borderRadius: 16, border: `1.5px dashed ${BORDER}`,
        }}>
          <div style={{ fontSize: 36, marginBottom: 8 }}>🗂️</div>
          <div style={{ fontSize: 14, color: MUTED }}>No applications here yet</div>
        </div>
      ) : view === "list" ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {filtered.map(app => {
            const idx = applications.indexOf(app);
            return <AppCardList key={app._id} app={app} index={idx}
              onAccept={a => setInterviewApp(a)}
              onReject={id => setRejectConfirm(id)} />;
          })}
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: 12 }}>
          {filtered.map(app => {
            const idx = applications.indexOf(app);
            return <AppCardGrid key={app._id} app={app} index={idx}
              onAccept={a => setInterviewApp(a)}
              onReject={id => setRejectConfirm(id)} />;
          })}
        </div>
      )}

      {/* ── Modals ── */}
      {interviewApp && (
        <InterviewModal
          app={interviewApp}
          appIndex={interviewAppIndex}
          onClose={() => setInterviewApp(null)}
          onSubmit={acceptApplication}
        />
      )}

      {rejectConfirm && (
        <ConfirmDialog
          message="This will reject the applicant and notify them. This action cannot be undone."
          onConfirm={() => rejectApplication(rejectConfirm)}
          onCancel={() => setRejectConfirm(null)}
        />
      )}

      {toast && (
        <Toast message={toast.message} type={toast.type} onDone={() => setToast(null)} />
      )}
    </div>
    </div>
  );
};

export default ApplicationsPanel;