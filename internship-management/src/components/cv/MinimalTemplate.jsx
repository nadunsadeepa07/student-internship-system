// MinimalTemplate.jsx — Clean, minimal design
// White space heavy, typography focused

import React from "react";

export default function MinimalTemplate({ cvData }) {
  const { personalInfo, skills, education, experience, projects } = cvData;

  return (
    <div style={styles.page}>

      <div style={styles.header}>
        {cvData.profileImage && (
          <img src={cvData.profileImage} alt="Profile" style={styles.avatar} />
        )}
        <div>
          <h1 style={styles.name}>{personalInfo.fullName || "Your Name"}</h1>
          {personalInfo.jobTitle && (
            <p style={styles.role}>{personalInfo.jobTitle}</p>
          )}
        </div>
      </div>

      <div style={styles.contactBar}>
        {[personalInfo.email, personalInfo.phone, personalInfo.address,
          personalInfo.linkedin, personalInfo.github]
          .filter(Boolean)
          .map((c, i) => <span key={i} style={styles.contact}>{c}</span>)}
      </div>

      {personalInfo.summary && (
        <div style={styles.section}>
          <p style={styles.summary}>{personalInfo.summary}</p>
        </div>
      )}

      {experience?.length > 0 && (
        <div style={styles.section}>
          <h2 style={styles.heading}>Experience</h2>
          {experience.map((exp, i) => (
            <div key={i} style={styles.row}>
              <div style={styles.rowLeft}>
                <p style={styles.smallText}>{exp.duration}</p>
                {exp.type && <p style={{ ...styles.smallText, color: "#94a3b8" }}>{exp.type}</p>}
              </div>
              <div style={styles.rowRight}>
                <strong style={styles.rowTitle}>{exp.role}</strong>
                <p style={styles.rowSub}>{exp.company}</p>
                {exp.description && <p style={styles.rowDesc}>{exp.description}</p>}
              </div>
            </div>
          ))}
        </div>
      )}

      {education?.length > 0 && (
        <div style={styles.section}>
          <h2 style={styles.heading}>Education</h2>
          {education.map((edu, i) => (
            <div key={i} style={styles.row}>
              <div style={styles.rowLeft}>
                <p style={styles.smallText}>{edu.year}</p>
              </div>
              <div style={styles.rowRight}>
                <strong style={styles.rowTitle}>{edu.degree}</strong>
                <p style={styles.rowSub}>{edu.institute}</p>
                {edu.gpa && <p style={styles.rowDesc}>GPA: {edu.gpa}</p>}
              </div>
            </div>
          ))}
        </div>
      )}

      {skills?.length > 0 && (
        <div style={styles.section}>
          <h2 style={styles.heading}>Skills</h2>
          <p style={styles.skillLine}>{skills.join("  ·  ")}</p>
        </div>
      )}

      {projects?.length > 0 && (
        <div style={styles.section}>
          <h2 style={styles.heading}>Projects</h2>
          {projects.map((proj, i) => (
            <div key={i} style={styles.row}>
              <div style={styles.rowLeft}>
                {proj.year && <p style={styles.smallText}>{proj.year}</p>}
              </div>
              <div style={styles.rowRight}>
                <strong style={styles.rowTitle}>{proj.title}</strong>
                {proj.technologies && <p style={{ ...styles.rowSub, color: "#6366f1" }}>{proj.technologies}</p>}
                {proj.description && <p style={styles.rowDesc}>{proj.description}</p>}
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}

const styles = {
  page: {
    width: "794px", minHeight: "1123px", background: "#fff",
    padding: "60px 64px", fontFamily: "'Inter', 'Helvetica Neue', sans-serif",
    color: "#1e293b", fontSize: "13px", boxSizing: "border-box",
  },
  header: {
    display: "flex", alignItems: "center",
    gap: "20px", marginBottom: "16px",
  },
  avatar: {
    width: "72px", height: "72px", borderRadius: "50%",
    objectFit: "cover", border: "1px solid #e2e8f0",
  },
  name: {
    fontSize: "30px", fontWeight: 300,
    color: "#0f172a", margin: "0 0 4px", letterSpacing: "-1px",
  },
  role: { fontSize: "14px", color: "#64748b", margin: 0, fontWeight: 400 },
  contactBar: {
    display: "flex", flexWrap: "wrap", gap: "16px",
    borderTop: "1px solid #e2e8f0", borderBottom: "1px solid #e2e8f0",
    padding: "12px 0", marginBottom: "28px",
  },
  contact: { fontSize: "12px", color: "#64748b" },
  section: { marginBottom: "28px" },
  summary: {
    color: "#475569", lineHeight: 1.7,
    fontSize: "13px", margin: 0,
    fontStyle: "italic",
  },
  heading: {
    fontSize: "11px", fontWeight: 600,
    textTransform: "uppercase", letterSpacing: "0.1em",
    color: "#94a3b8", margin: "0 0 14px",
  },
  row: {
    display: "flex", gap: "24px",
    marginBottom: "14px",
  },
  rowLeft: { width: "110px", flexShrink: 0, paddingTop: "2px" },
  rowRight: { flex: 1 },
  smallText: { fontSize: "11px", color: "#94a3b8", margin: 0 },
  rowTitle: { fontSize: "14px", fontWeight: 600, color: "#0f172a" },
  rowSub: { fontSize: "12px", color: "#6366f1", margin: "2px 0", fontWeight: 500 },
  rowDesc: { fontSize: "12px", color: "#64748b", margin: "4px 0 0", lineHeight: 1.6 },
  skillLine: { fontSize: "13px", color: "#475569", lineHeight: 2 },
};