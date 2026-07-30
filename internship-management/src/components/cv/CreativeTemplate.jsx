// AdvancedTemplate.jsx — Executive dossier-style CV layout
// Ideal for senior, leadership, consulting & strategy roles

import React from "react";

export default function AdvancedTemplate({ cvData }) {
  const {
    personalInfo,
    skills,
    education,
    experience,
    projects,
    certifications,
    languages,
    profileImage,
  } = cvData;

  const initials = (personalInfo.fullName || "?")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w.charAt(0).toUpperCase())
    .join("");

  const contactItems = [
    personalInfo.email,
    personalInfo.phone,
    personalInfo.address,
    personalInfo.linkedin,
    personalInfo.github,
  ].filter(Boolean);

  return (
    <div style={styles.page}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Source+Serif+4:opsz,wght@8..60,400;8..60,600;8..60,700&family=Inter:wght@400;500;600;700&display=swap');
      `}</style>

      {/* MASTHEAD */}
      <div style={styles.header}>
        <div style={styles.headerText}>
          <p style={styles.eyebrow}>Curriculum&nbsp;Vitae</p>
          <h1 style={styles.name}>{personalInfo.fullName || "Your Name"}</h1>
          {personalInfo.jobTitle && (
            <p style={styles.role}>{personalInfo.jobTitle}</p>
          )}
        </div>
        {profileImage && (
          <img src={profileImage} alt="Profile" style={styles.avatar} />
        )}
      </div>

      {contactItems.length > 0 && (
        <div style={styles.contactRow}>
          {contactItems.map((item, i) => (
            <React.Fragment key={i}>
              <span style={styles.contactItem}>{item}</span>
              {i < contactItems.length - 1 && (
                <span style={styles.contactDot}>&middot;</span>
              )}
            </React.Fragment>
          ))}
        </div>
      )}

      {/* BODY */}
      <div style={styles.body}>
        {/* LEFT RAIL */}
        <div style={styles.rail}>
          {skills?.length > 0 && (
            <div style={styles.railSection}>
              <h3 style={styles.railHeading}>Expertise</h3>
              <div style={styles.pillWrap}>
                {skills.map((s, i) => (
                  <span key={i} style={styles.pill}>{s}</span>
                ))}
              </div>
            </div>
          )}

          {education?.length > 0 && (
            <div style={styles.railSection}>
              <h3 style={styles.railHeading}>Education</h3>
              {education.map((edu, i) => (
                <div key={i} style={styles.railEntry}>
                  <p style={styles.railEntryTitle}>{edu.degree}</p>
                  <p style={styles.railEntrySub}>{edu.institute}</p>
                  <p style={styles.railEntryMeta}>{edu.year}</p>
                </div>
              ))}
            </div>
          )}

          {certifications?.length > 0 && (
            <div style={styles.railSection}>
              <h3 style={styles.railHeading}>Certifications</h3>
              {certifications.map((cert, i) => (
                <div key={i} style={styles.railEntry}>
                  <p style={styles.railEntryTitle}>{cert.name}</p>
                  {cert.issuer && (
                    <p style={styles.railEntrySub}>{cert.issuer}</p>
                  )}
                  {cert.year && (
                    <p style={styles.railEntryMeta}>{cert.year}</p>
                  )}
                </div>
              ))}
            </div>
          )}

          {languages?.length > 0 && (
            <div style={styles.railSection}>
              <h3 style={styles.railHeading}>Languages</h3>
              {languages.map((lang, i) => {
                const name = typeof lang === "string" ? lang : lang.name;
                const level = typeof lang === "string" ? null : lang.level;
                return (
                  <div key={i} style={styles.langRow}>
                    <span style={styles.railEntryTitle}>{name}</span>
                    {level && <span style={styles.railEntryMeta}>{level}</span>}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* MAIN CONTENT */}
        <div style={styles.main}>
          {personalInfo.summary && (
            <div style={styles.mainSection}>
              <h2 style={styles.mainHeading}>Profile</h2>
              <p style={styles.summaryText}>{personalInfo.summary}</p>
            </div>
          )}

          {experience?.length > 0 && (
            <div style={styles.mainSection}>
              <h2 style={styles.mainHeading}>Experience</h2>
              {experience.map((exp, i) => (
                <div
                  key={i}
                  style={{
                    ...styles.timelineRow,
                    paddingBottom: i === experience.length - 1 ? 0 : 20,
                  }}
                >
                  <div style={styles.timelineDate}>{exp.duration}</div>
                  <div style={styles.timelineRail}>
                    <div style={styles.timelineNode} />
                    {i < experience.length - 1 && (
                      <div style={styles.timelineLine} />
                    )}
                  </div>
                  <div style={styles.timelineContent}>
                    <strong style={styles.expRole}>{exp.role}</strong>
                    <p style={styles.expCompany}>{exp.company}</p>
                    {exp.description && (
                      <p style={styles.expDesc}>{exp.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {projects?.length > 0 && (
            <div style={styles.mainSection}>
              <h2 style={styles.mainHeading}>Selected Work</h2>
              {projects.map((proj, i) => (
                <div
                  key={i}
                  style={{
                    ...styles.projectRow,
                    borderBottom:
                      i === projects.length - 1 ? "none" : styles.hairlineBorder,
                    marginBottom: i === projects.length - 1 ? 0 : 14,
                    paddingBottom: i === projects.length - 1 ? 0 : 14,
                  }}
                >
                  <strong style={styles.expRole}>{proj.title}</strong>
                  {proj.technologies && (
                    <p style={styles.projectTech}>{proj.technologies}</p>
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

      {/* FOOTER */}
      <div style={styles.footer}>
        <span style={styles.footerText}>
          {personalInfo.fullName || "Your Name"}
        </span>
        <span style={styles.footerText}>01</span>
      </div>
    </div>
  );
}

const INK = "#14213D";
const BRASS = "#A8843D";
const CHARCOAL = "#1F2933";
const SLATE = "#5A6472";
const HAIRLINE = "#E4E2DC";
const PAPER = "#FFFFFF";

const styles = {
  page: {
    width: "794px",
    minHeight: "1123px",
    background: PAPER,
    fontFamily: "'Inter', sans-serif",
    fontSize: "12px",
    color: CHARCOAL,
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
  },
  header: {
    background: INK,
    padding: "40px 48px 28px",
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  headerText: { flex: 1 },
  eyebrow: {
    fontSize: "10px",
    letterSpacing: "0.22em",
    textTransform: "uppercase",
    color: BRASS,
    margin: "0 0 10px",
    fontWeight: 600,
  },
  name: {
    fontFamily: "'Source Serif 4', Georgia, serif",
    fontSize: "32px",
    fontWeight: 600,
    color: "#FBFAF7",
    margin: 0,
    lineHeight: 1.1,
  },
  role: {
    fontSize: "13px",
    color: "rgba(251,250,247,0.72)",
    margin: "8px 0 0",
    letterSpacing: "0.02em",
  },
  avatar: {
    width: "68px",
    height: "68px",
    borderRadius: "50%",
    objectFit: "cover",
    border: `2px solid ${BRASS}`,
    marginLeft: "24px",
    flexShrink: 0,
  },
  contactRow: {
    background: PAPER,
    borderBottom: `1px solid ${HAIRLINE}`,
    padding: "10px 48px",
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
  },
  contactItem: {
    fontSize: "10.5px",
    color: SLATE,
    letterSpacing: "0.01em",
  },
  contactDot: {
    color: BRASS,
    margin: "0 10px",
    fontSize: "11px",
  },
  body: {
    display: "flex",
    flex: 1,
  },
  rail: {
    width: "222px",
    flexShrink: 0,
    padding: "30px 24px 30px 48px",
    borderRight: `1px solid ${HAIRLINE}`,
  },
  railSection: { marginBottom: "26px" },
  railHeading: {
    fontFamily: "'Source Serif 4', Georgia, serif",
    fontSize: "12.5px",
    fontWeight: 600,
    color: INK,
    margin: "0 0 12px",
    paddingBottom: "6px",
    borderBottom: `1px solid ${BRASS}`,
  },
  pillWrap: { display: "flex", flexWrap: "wrap", gap: "6px" },
  pill: {
    fontSize: "10px",
    color: CHARCOAL,
    border: `1px solid ${HAIRLINE}`,
    borderRadius: "3px",
    padding: "4px 8px",
    background: "#FBFBFA",
  },
  railEntry: { marginBottom: "12px" },
  railEntryTitle: {
    fontSize: "11.5px",
    fontWeight: 600,
    color: INK,
    margin: 0,
  },
  railEntrySub: {
    fontSize: "10.5px",
    color: SLATE,
    margin: "2px 0 0",
  },
  railEntryMeta: {
    fontSize: "10px",
    color: BRASS,
    letterSpacing: "0.04em",
    margin: "2px 0 0",
    textTransform: "uppercase",
  },
  langRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "baseline",
    marginBottom: "8px",
  },
  main: { flex: 1, padding: "30px 48px" },
  mainSection: { marginBottom: "26px" },
  mainHeading: {
    fontFamily: "'Source Serif 4', Georgia, serif",
    fontSize: "16px",
    fontWeight: 600,
    color: INK,
    margin: "0 0 14px",
  },
  summaryText: {
    fontSize: "12px",
    color: SLATE,
    lineHeight: 1.75,
    margin: 0,
  },
  timelineRow: {
    display: "flex",
  },
  timelineDate: {
    width: "78px",
    flexShrink: 0,
    fontSize: "10px",
    color: BRASS,
    textTransform: "uppercase",
    letterSpacing: "0.03em",
    textAlign: "right",
    paddingRight: "14px",
    paddingTop: "2px",
  },
  timelineRail: {
    width: "14px",
    flexShrink: 0,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  timelineNode: {
    width: "7px",
    height: "7px",
    background: BRASS,
    marginTop: "5px",
    flexShrink: 0,
  },
  timelineLine: {
    width: "1px",
    flex: 1,
    background: HAIRLINE,
    marginTop: "3px",
  },
  timelineContent: {
    flex: 1,
    paddingLeft: "16px",
  },
  expRole: {
    fontSize: "13px",
    fontWeight: 600,
    color: CHARCOAL,
    display: "block",
  },
  expCompany: {
    fontSize: "11.5px",
    color: BRASS,
    fontWeight: 500,
    margin: "2px 0 0",
  },
  expDesc: {
    fontSize: "11.5px",
    color: SLATE,
    lineHeight: 1.65,
    margin: "6px 0 0",
  },
  projectRow: {},
  projectTech: {
    fontSize: "10px",
    color: BRASS,
    textTransform: "uppercase",
    letterSpacing: "0.04em",
    margin: "3px 0 0",
    fontWeight: 600,
  },
  hairlineBorder: `1px solid ${HAIRLINE}`,
  footer: {
    borderTop: `1px solid ${HAIRLINE}`,
    padding: "14px 48px",
    display: "flex",
    justifyContent: "space-between",
  },
  footerText: {
    fontSize: "9.5px",
    color: SLATE,
    letterSpacing: "0.06em",
    textTransform: "uppercase",
  },
};