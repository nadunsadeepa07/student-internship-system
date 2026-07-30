// ModernTemplate.jsx — Default purple/indigo themed template
// ATS friendly layout — clean sections, proper headings

import React from "react";

export default function ModernTemplate({ cvData }) {
  const { personalInfo, skills, education, experience, projects, certifications } = cvData;

  return (
    <div style={styles.page}>

      {/* ===== HEADER ===== */}
      <div style={styles.header}>
        {cvData.profileImage && (
          <img src={cvData.profileImage} alt="Profile" style={styles.avatar} />
        )}
        <div style={styles.headerInfo}>
          <h1 style={styles.name}>{personalInfo.fullName || "Your Name"}</h1>
          {personalInfo.jobTitle && (
            <p style={styles.jobTitle}>{personalInfo.jobTitle}</p>
          )}
          <div style={styles.contactRow}>
            {personalInfo.email   && <span>✉ {personalInfo.email}</span>}
            {personalInfo.phone   && <span>📞 {personalInfo.phone}</span>}
            {personalInfo.address && <span>📍 {personalInfo.address}</span>}
          </div>
          <div style={styles.contactRow}>
            {personalInfo.linkedin  && <span>🔗 {personalInfo.linkedin}</span>}
            {personalInfo.github    && <span>💻 {personalInfo.github}</span>}
            {personalInfo.portfolio && <span>🌐 {personalInfo.portfolio}</span>}
          </div>
        </div>
      </div>

      {/* ===== SUMMARY ===== */}
      {personalInfo.summary && (
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Professional Summary</h2>
          <div style={styles.divider} />
          <p style={styles.summaryText}>{personalInfo.summary}</p>
        </div>
      )}

      {/* ===== SKILLS ===== */}
      {skills?.length > 0 && (
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Skills</h2>
          <div style={styles.divider} />
          <div style={styles.skillsGrid}>
            {skills.map((skill, i) => (
              <span key={i} style={styles.skillPill}>{skill}</span>
            ))}
          </div>
        </div>
      )}

      {/* ===== EXPERIENCE ===== */}
      {experience?.length > 0 && (
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Work Experience</h2>
          <div style={styles.divider} />
          {experience.map((exp, i) => (
            <div key={i} style={styles.itemBlock}>
              <div style={styles.itemHeader}>
                <div>
                  <h3 style={styles.itemTitle}>{exp.role}</h3>
                  <p style={styles.itemSubtitle}>{exp.company}</p>
                </div>
                <div style={styles.itemRight}>
                  <span style={styles.duration}>{exp.duration}</span>
                  {exp.type && <span style={styles.typeBadge}>{exp.type}</span>}
                </div>
              </div>
              {exp.description && (
                <p style={styles.itemDesc}>{exp.description}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ===== EDUCATION ===== */}
      {education?.length > 0 && (
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Education</h2>
          <div style={styles.divider} />
          {education.map((edu, i) => (
            <div key={i} style={styles.itemBlock}>
              <div style={styles.itemHeader}>
                <div>
                  <h3 style={styles.itemTitle}>{edu.degree} {edu.field && `— ${edu.field}`}</h3>
                  <p style={styles.itemSubtitle}>{edu.institute}</p>
                </div>
                <div style={styles.itemRight}>
                  <span style={styles.duration}>{edu.year}</span>
                  {edu.gpa && <span style={styles.duration}>GPA: {edu.gpa}</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ===== PROJECTS ===== */}
      {projects?.length > 0 && (
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Projects</h2>
          <div style={styles.divider} />
          {projects.map((proj, i) => (
            <div key={i} style={styles.itemBlock}>
              <div style={styles.itemHeader}>
                <h3 style={styles.itemTitle}>{proj.title}</h3>
                {proj.github && (
                  <span style={styles.link}>{proj.github}</span>
                )}
              </div>
              {proj.technologies && (
                <p style={styles.techLine}>🛠 {proj.technologies}</p>
              )}
              {proj.description && (
                <p style={styles.itemDesc}>{proj.description}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ===== CERTIFICATIONS ===== */}
      {certifications?.length > 0 && (
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Certifications</h2>
          <div style={styles.divider} />
          {certifications.map((cert, i) => (
            <div key={i} style={styles.certItem}>
              <strong style={{ color: "#1e293b" }}>{cert.name}</strong>
              <span style={styles.certMeta}>{cert.issuer} {cert.year && `— ${cert.year}`}</span>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}

// ===== INLINE STYLES =====
// PDF export හොඳ වෙන්න inline styles use කරනවා
// External CSS PDF-ලේ work කරන්නේ නෑ!
const accent = "#6366f1";

const styles = {
  page: {
    width: "794px",
    minHeight: "1123px",
    background: "#ffffff",
    padding: "48px 52px",
    fontFamily: "'Inter', 'Segoe UI', sans-serif",
    color: "#1e293b",
    fontSize: "13px",
    lineHeight: 1.6,
    boxSizing: "border-box",
  },
  header: {
    display: "flex",
    alignItems: "flex-start",
    gap: "20px",
    marginBottom: "28px",
    paddingBottom: "24px",
    borderBottom: `3px solid ${accent}`,
  },
  avatar: {
    width: "90px",
    height: "90px",
    borderRadius: "50%",
    objectFit: "cover",
    border: `3px solid ${accent}`,
    flexShrink: 0,
  },
  headerInfo: { flex: 1 },
  name: {
    fontSize: "28px",
    fontWeight: 700,
    color: "#0f172a",
    margin: "0 0 4px",
    letterSpacing: "-0.5px",
  },
  jobTitle: {
    fontSize: "15px",
    color: accent,
    fontWeight: 600,
    margin: "0 0 8px",
  },
  contactRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: "12px",
    fontSize: "12px",
    color: "#64748b",
    marginBottom: "4px",
  },
  section: { marginBottom: "24px" },
  sectionTitle: {
    fontSize: "14px",
    fontWeight: 700,
    color: accent,
    margin: "0 0 6px",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
  },
  divider: {
    height: "2px",
    background: `linear-gradient(to right, ${accent}, transparent)`,
    marginBottom: "12px",
  },
  summaryText: {
    color: "#475569",
    fontSize: "13px",
    lineHeight: 1.7,
    margin: 0,
  },
  skillsGrid: {
    display: "flex",
    flexWrap: "wrap",
    gap: "6px",
  },
  skillPill: {
    background: "#ede9fe",
    color: "#5b21b6",
    padding: "4px 12px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: 500,
  },
  itemBlock: {
    marginBottom: "14px",
    paddingLeft: "12px",
    borderLeft: `3px solid #e2e8f0`,
  },
  itemHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  itemTitle: {
    fontSize: "14px",
    fontWeight: 600,
    color: "#0f172a",
    margin: "0 0 2px",
  },
  itemSubtitle: {
    fontSize: "13px",
    color: "#6366f1",
    margin: 0,
    fontWeight: 500,
  },
  itemRight: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    gap: "4px",
  },
  duration: {
    fontSize: "12px",
    color: "#64748b",
    whiteSpace: "nowrap",
  },
  typeBadge: {
    background: "#f0fdf4",
    color: "#16a34a",
    padding: "2px 8px",
    borderRadius: "4px",
    fontSize: "11px",
    fontWeight: 500,
  },
  itemDesc: {
    fontSize: "12px",
    color: "#475569",
    margin: "6px 0 0",
    lineHeight: 1.6,
  },
  techLine: {
    fontSize: "12px",
    color: "#7c3aed",
    margin: "4px 0 4px",
    fontWeight: 500,
  },
  link: {
    fontSize: "11px",
    color: "#6366f1",
    textDecoration: "underline",
  },
  certItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "6px 0",
    borderBottom: "1px solid #f1f5f9",
    fontSize: "13px",
  },
  certMeta: {
    fontSize: "12px",
    color: "#64748b",
  },
};