// DarkTemplate.jsx — Dark themed CV template
// Dark background, light text — print-friendly version

import React from "react";

export default function DarkTemplate({ cvData }) {
  const { personalInfo, skills, education, experience, projects } = cvData;

  return (
    <div style={styles.page}>

      {/* HEADER */}
      <div style={styles.header}>
        {cvData.profileImage && (
          <img src={cvData.profileImage} alt="Profile" style={styles.avatar} />
        )}
        <div>
          <h1 style={styles.name}>{personalInfo.fullName || "Your Name"}</h1>
          {personalInfo.jobTitle && (
            <p style={styles.jobTitle}>{personalInfo.jobTitle}</p>
          )}
          <div style={styles.contactRow}>
            {personalInfo.email   && <span>{personalInfo.email}</span>}
            {personalInfo.phone   && <span>{personalInfo.phone}</span>}
            {personalInfo.address && <span>{personalInfo.address}</span>}
          </div>
        </div>
      </div>

      <div style={styles.body}>

        {/* LEFT COLUMN */}
        <div style={styles.leftCol}>

          {skills?.length > 0 && (
            <div style={styles.section}>
              <h2 style={styles.sectionTitle}>Skills</h2>
              <div style={styles.skillsList}>
                {skills.map((s, i) => (
                  <div key={i} style={styles.skillItem}>
                    <span style={styles.skillDot}>▸</span> {s}
                  </div>
                ))}
              </div>
            </div>
          )}

          {education?.length > 0 && (
            <div style={styles.section}>
              <h2 style={styles.sectionTitle}>Education</h2>
              {education.map((edu, i) => (
                <div key={i} style={styles.miniItem}>
                  <strong style={{ color: "#e2e8f0" }}>{edu.degree}</strong>
                  <p style={{ color: "#94a3b8", margin: "2px 0", fontSize: "12px" }}>
                    {edu.institute}
                  </p>
                  <p style={{ color: "#64748b", margin: 0, fontSize: "11px" }}>
                    {edu.year} {edu.gpa && `| GPA: ${edu.gpa}`}
                  </p>
                </div>
              ))}
            </div>
          )}

        </div>

        {/* RIGHT COLUMN */}
        <div style={styles.rightCol}>

          {personalInfo.summary && (
            <div style={styles.section}>
              <h2 style={styles.sectionTitle}>Summary</h2>
              <p style={styles.summaryText}>{personalInfo.summary}</p>
            </div>
          )}

          {experience?.length > 0 && (
            <div style={styles.section}>
              <h2 style={styles.sectionTitle}>Experience</h2>
              {experience.map((exp, i) => (
                <div key={i} style={styles.expItem}>
                  <div style={styles.expHeader}>
                    <h3 style={styles.expRole}>{exp.role}</h3>
                    <span style={styles.expDuration}>{exp.duration}</span>
                  </div>
                  <p style={styles.expCompany}>{exp.company}</p>
                  {exp.description && (
                    <p style={styles.expDesc}>{exp.description}</p>
                  )}
                </div>
              ))}
            </div>
          )}

          {projects?.length > 0 && (
            <div style={styles.section}>
              <h2 style={styles.sectionTitle}>Projects</h2>
              {projects.map((proj, i) => (
                <div key={i} style={styles.expItem}>
                  <h3 style={styles.expRole}>{proj.title}</h3>
                  {proj.technologies && (
                    <p style={{ color: "#a78bfa", fontSize: "12px", margin: "2px 0" }}>
                      {proj.technologies}
                    </p>
                  )}
                  {proj.description && (
                    <p style={styles.expDesc}>{proj.description}</p>
                  )}
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

const accent = "#a78bfa";

const styles = {
  page: {
    width: "794px",
    minHeight: "1123px",
    background: "#0f172a",
    fontFamily: "'Inter', 'Segoe UI', sans-serif",
    color: "#cbd5e1",
    fontSize: "13px",
    boxSizing: "border-box",
  },
  header: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
    padding: "40px 48px 32px",
    background: "#1e293b",
    borderBottom: `4px solid ${accent}`,
  },
  avatar: {
    width: "80px", height: "80px",
    borderRadius: "50%", objectFit: "cover",
    border: `3px solid ${accent}`,
  },
  name: {
    fontSize: "26px", fontWeight: 700,
    color: "#f1f5f9", margin: "0 0 4px",
  },
  jobTitle: {
    fontSize: "14px", color: accent,
    fontWeight: 600, margin: "0 0 8px",
  },
  contactRow: {
    display: "flex", flexWrap: "wrap",
    gap: "12px", fontSize: "12px", color: "#94a3b8",
  },
  body: {
    display: "flex",
    gap: 0,
    padding: "0",
  },
  leftCol: {
    width: "240px",
    padding: "28px 24px",
    background: "#1e293b",
    flexShrink: 0,
  },
  rightCol: {
    flex: 1,
    padding: "28px 36px",
  },
  section: { marginBottom: "24px" },
  sectionTitle: {
    fontSize: "11px",
    fontWeight: 700,
    color: accent,
    textTransform: "uppercase",
    letterSpacing: "0.1em",
    margin: "0 0 10px",
    paddingBottom: "6px",
    borderBottom: `1px solid #334155`,
  },
  skillsList: { display: "flex", flexDirection: "column", gap: "6px" },
  skillItem: {
    fontSize: "12px",
    color: "#cbd5e1",
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },
  skillDot: { color: accent, fontSize: "10px" },
  miniItem: { marginBottom: "12px" },
  summaryText: {
    color: "#94a3b8", fontSize: "13px",
    lineHeight: 1.7, margin: 0,
  },
  expItem: {
    marginBottom: "16px",
    paddingLeft: "12px",
    borderLeft: `2px solid #334155`,
  },
  expHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  expRole: {
    fontSize: "14px", fontWeight: 600,
    color: "#e2e8f0", margin: 0,
  },
  expDuration: {
    fontSize: "11px", color: "#64748b",
  },
  expCompany: {
    fontSize: "13px", color: accent,
    margin: "2px 0 6px", fontWeight: 500,
  },
  expDesc: {
    fontSize: "12px", color: "#64748b",
    lineHeight: 1.6, margin: 0,
  },
};