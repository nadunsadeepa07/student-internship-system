// ClassicTemplate.jsx — Traditional black & white formal CV
// Recruiters/corporate companies සඳහා

import React from "react";

export default function ClassicTemplate({ cvData }) {
  const { personalInfo, skills, education, experience, projects, certifications } = cvData;

  return (
    <div style={styles.page}>

      {/* HEADER */}
      <div style={styles.header}>
        {cvData.profileImage && (
          <img src={cvData.profileImage} alt="Profile" style={styles.avatar} />
        )}
        <div style={styles.headerText}>
          <h1 style={styles.name}>{personalInfo.fullName || "Your Name"}</h1>
          {personalInfo.jobTitle && (
            <p style={styles.jobTitle}>{personalInfo.jobTitle}</p>
          )}
          <p style={styles.contactLine}>
            {[personalInfo.email, personalInfo.phone, personalInfo.address]
              .filter(Boolean)
              .join("  |  ")}
          </p>
          {(personalInfo.linkedin || personalInfo.github) && (
            <p style={styles.contactLine}>
              {[personalInfo.linkedin, personalInfo.github]
                .filter(Boolean)
                .join("  |  ")}
            </p>
          )}
        </div>
      </div>

      {personalInfo.summary && (
        <Section title="OBJECTIVE">
          <p style={styles.bodyText}>{personalInfo.summary}</p>
        </Section>
      )}

      {experience?.length > 0 && (
        <Section title="WORK EXPERIENCE">
          {experience.map((exp, i) => (
            <div key={i} style={styles.item}>
              <div style={styles.itemRow}>
                <strong style={styles.itemTitle}>{exp.role} — {exp.company}</strong>
                <span style={styles.meta}>{exp.duration}</span>
              </div>
              {exp.description && (
                <p style={styles.bodyText}>{exp.description}</p>
              )}
            </div>
          ))}
        </Section>
      )}

      {education?.length > 0 && (
        <Section title="EDUCATION">
          {education.map((edu, i) => (
            <div key={i} style={styles.item}>
              <div style={styles.itemRow}>
                <strong style={styles.itemTitle}>
                  {edu.degree}{edu.field ? `, ${edu.field}` : ""}
                </strong>
                <span style={styles.meta}>{edu.year}</span>
              </div>
              <p style={styles.bodyText}>
                {edu.institute}{edu.gpa ? ` | GPA: ${edu.gpa}` : ""}
              </p>
            </div>
          ))}
        </Section>
      )}

      {skills?.length > 0 && (
        <Section title="SKILLS">
          <p style={styles.bodyText}>{skills.join(" • ")}</p>
        </Section>
      )}

      {projects?.length > 0 && (
        <Section title="PROJECTS">
          {projects.map((proj, i) => (
            <div key={i} style={styles.item}>
              <strong style={styles.itemTitle}>{proj.title}</strong>
              {proj.technologies && (
                <p style={{ ...styles.bodyText, fontStyle: "italic" }}>
                  Technologies: {proj.technologies}
                </p>
              )}
              {proj.description && (
                <p style={styles.bodyText}>{proj.description}</p>
              )}
            </div>
          ))}
        </Section>
      )}

      {certifications?.length > 0 && (
        <Section title="CERTIFICATIONS">
          {certifications.map((cert, i) => (
            <p key={i} style={styles.bodyText}>
              <strong>{cert.name}</strong>
              {cert.issuer && ` — ${cert.issuer}`}
              {cert.year   && ` (${cert.year})`}
            </p>
          ))}
        </Section>
      )}

    </div>
  );
}

// Reusable section component
function Section({ title, children }) {
  return (
    <div style={{ marginBottom: "18px" }}>
      <h2 style={{
        fontSize: "13px", fontWeight: 700,
        letterSpacing: "0.08em", color: "#1a1a1a",
        margin: "0 0 4px", textTransform: "uppercase",
        borderBottom: "2px solid #1a1a1a", paddingBottom: "3px",
      }}>
        {title}
      </h2>
      <div style={{ paddingTop: "8px" }}>{children}</div>
    </div>
  );
}

const styles = {
  page: {
    width: "794px", minHeight: "1123px",
    background: "#fff", padding: "52px 56px",
    fontFamily: "'Times New Roman', Georgia, serif",
    color: "#1a1a1a", fontSize: "13px",
    lineHeight: 1.5, boxSizing: "border-box",
  },
  header: {
    display: "flex", alignItems: "center",
    gap: "20px", marginBottom: "24px",
    paddingBottom: "16px", borderBottom: "2px solid #1a1a1a",
  },
  avatar: {
    width: "80px", height: "80px",
    borderRadius: "4px", objectFit: "cover",
    border: "1px solid #333",
  },
  headerText: { flex: 1, textAlign: "center" },
  name: {
    fontSize: "26px", fontWeight: 700,
    margin: "0 0 4px", letterSpacing: "1px",
  },
  jobTitle: {
    fontSize: "14px", color: "#444",
    margin: "0 0 6px", fontStyle: "italic",
  },
  contactLine: {
    fontSize: "12px", color: "#555",
    margin: "2px 0",
  },
  item: { marginBottom: "12px" },
  itemRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "baseline",
  },
  itemTitle: { fontSize: "13px", color: "#1a1a1a" },
  meta: { fontSize: "12px", color: "#555" },
  bodyText: { fontSize: "12px", color: "#333", margin: "4px 0 0", lineHeight: 1.6 },
};