// ExecutiveTemplate.jsx
// Premium Executive Resume Template with Enhanced Links
// ATS Friendly with Professional Link Design

import React from "react";

export default function ExecutiveTemplate({ cvData }) {
  const {
    personalInfo,
    skills,
    education,
    experience,
    projects,
    certifications = [],
  } = cvData;

  return (
    <div style={styles.page}>
      {/* ================= HEADER ================= */}

      <div style={styles.header}>
        <div>
          <h1 style={styles.name}>
            {personalInfo.fullName || "Your Name"}
          </h1>

          <h2 style={styles.role}>
            {personalInfo.jobTitle || "Executive Professional"}
          </h2>
        </div>

        {cvData.profileImage && (
          <img
            src={cvData.profileImage}
            alt=""
            style={styles.avatar}
          />
        )}
      </div>

      {/* ================= CONTACT BAR (Enhanced Links) ================= */}

      <div style={styles.contactBar}>
        {personalInfo.email && (
          <a href={`mailto:${personalInfo.email}`} style={styles.contactLink}>
            <span style={styles.linkIcon}>✉</span>
            {personalInfo.email}
          </a>
        )}

        {personalInfo.phone && (
          <a href={`tel:${personalInfo.phone}`} style={styles.contactLink}>
            <span style={styles.linkIcon}>📞</span>
            {personalInfo.phone}
          </a>
        )}

        {personalInfo.address && (
          <span style={styles.contactItem}>
            <span style={styles.linkIcon}>📍</span>
            {personalInfo.address}
          </span>
        )}

        {personalInfo.linkedin && (
          <a 
            href={personalInfo.linkedin.startsWith('http') ? personalInfo.linkedin : `https://${personalInfo.linkedin}`}
            target="_blank"
            rel="noopener noreferrer"
            style={styles.contactLink}
          >
            <span style={styles.linkIcon}>💼</span>
            LinkedIn
          </a>
        )}

        {personalInfo.github && (
          <a 
            href={personalInfo.github.startsWith('http') ? personalInfo.github : `https://${personalInfo.github}`}
            target="_blank"
            rel="noopener noreferrer"
            style={styles.contactLink}
          >
            <span style={styles.linkIcon}>💻</span>
            GitHub
          </a>
        )}

        {personalInfo.portfolio && (
          <a 
            href={personalInfo.portfolio.startsWith('http') ? personalInfo.portfolio : `https://${personalInfo.portfolio}`}
            target="_blank"
            rel="noopener noreferrer"
            style={styles.contactLink}
          >
            <span style={styles.linkIcon}>🌐</span>
            Portfolio
          </a>
        )}
      </div>

      {/* SUMMARY */}

      {personalInfo.summary && (
        <Section title="Executive Summary">
          <p style={styles.paragraph}>
            {personalInfo.summary}
          </p>
        </Section>
      )}

      {/* EXPERIENCE */}

      {experience?.length > 0 && (
        <Section title="Professional Experience">
          {experience.map((exp, index) => (
            <div key={index} style={styles.timelineItem}>
              <div style={styles.timelineTop}>
                <div>
                  <div style={styles.position}>
                    {exp.role}
                  </div>

                  <div style={styles.company}>
                    {exp.company}
                  </div>
                </div>

                <div style={styles.date}>
                  {exp.duration}
                </div>
              </div>

              {exp.description && (
                <p style={styles.paragraph}>
                  {exp.description}
                </p>
              )}
            </div>
          ))}
        </Section>
      )}

      {/* ================= PROJECTS (Enhanced Links) ================= */}

      {projects?.length > 0 && (
        <Section title="Key Projects">
          {projects.map((project, index) => (
            <div key={index} style={styles.projectCard}>
              <div style={styles.projectTitle}>
                {project.title}
              </div>

              {project.technologies && (
                <div style={styles.tech}>
                  {project.technologies}
                </div>
              )}

              {project.description && (
                <p style={styles.paragraph}>
                  {project.description}
                </p>
              )}

              {/* Enhanced Project Links */}
              {(project.github || project.liveUrl) && (
                <div style={styles.projectLinks}>
                  {project.github && (
                    <a 
                      href={project.github.startsWith('http') ? project.github : `https://${project.github}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={styles.projectLinkButton}
                    >
                      <span style={styles.projectLinkIcon}>⚙️</span>
                      View Code
                    </a>
                  )}

                  {project.liveUrl && (
                    <a 
                      href={project.liveUrl.startsWith('http') ? project.liveUrl : `https://${project.liveUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={styles.projectLinkButtonLive}
                    >
                      <span style={styles.projectLinkIcon}>🚀</span>
                      Live Demo
                    </a>
                  )}
                </div>
              )}
            </div>
          ))}
        </Section>
      )}

      {/* TWO COLUMN */}

      <div style={styles.columns}>
        {/* EDUCATION */}

        <div>
          {education?.length > 0 && (
            <Section title="Education">
              {education.map((edu, index) => (
                <div key={index} style={styles.eduCard}>
                  <div style={styles.degree}>
                    {edu.degree}
                  </div>

                  <div>
                    {edu.institute}
                  </div>

                  <div style={styles.small}>
                    {edu.field}
                  </div>

                  <div style={styles.small}>
                    {edu.year}
                  </div>

                  {edu.gpa && (
                    <div style={styles.small}>
                      GPA: {edu.gpa}
                    </div>
                  )}
                </div>
              ))}
            </Section>
          )}
        </div>

        {/* SKILLS + CERTIFICATIONS */}

        <div>
          {skills?.length > 0 && (
            <Section title="Core Skills">
              <div style={styles.skillWrap}>
                {skills.map((skill, index) => (
                  <span
                    key={index}
                    style={styles.skill}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </Section>
          )}

          {/* ================= CERTIFICATIONS (Enhanced Links) ================= */}

          {certifications?.length > 0 && (
            <Section title="Certifications">
              {certifications.map((cert, index) => (
                <div
                  key={index}
                  style={styles.certCard}
                >
                  <div style={styles.certName}>
                    {cert.name}
                  </div>

                  <div style={styles.certIssuer}>
                    {cert.issuer}
                  </div>

                  <div style={styles.small}>
                    {cert.year}
                  </div>

                  {/* Certification Link */}
                  {cert.credentialUrl && (
                    <a 
                      href={cert.credentialUrl.startsWith('http') ? cert.credentialUrl : `https://${cert.credentialUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={styles.certLink}
                    >
                      <span style={styles.certLinkIcon}>🔗</span>
                      View Credential
                    </a>
                  )}
                </div>
              ))}
            </Section>
          )}
        </div>
      </div>
    </div>
  );
}

/* ============================= */

function Section({ title, children }) {
  return (
    <div style={styles.section}>
      <h3 style={styles.heading}>
        {title}
      </h3>
      {children}
    </div>
  );
}

/* ============================= */

const styles = {
  page: {
    width: "794px",
    minHeight: "1123px",
    background: "#fff",
    padding: "45px",
    fontFamily: "Calibri, Arial",
    color: "#1e293b",
    boxSizing: "border-box"
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: "4px solid #1f2937",
    paddingBottom: "18px",
    marginBottom: "18px"
  },

  avatar: {
    width: "90px",
    height: "90px",
    borderRadius: "50%",
    objectFit: "cover",
    border: "4px solid #1f2937"
  },

  name: {
    fontSize: "34px",
    fontWeight: "700",
    margin: 0,
    letterSpacing: "1px"
  },

  role: {
    fontSize: "18px",
    fontWeight: "500",
    marginTop: "6px",
    color: "#475569"
  },

  // ================= ENHANCED CONTACT BAR STYLES =================

  contactBar: {
    display: "flex",
    flexWrap: "wrap",
    gap: "16px",
    fontSize: "12px",
    marginBottom: "24px",
    paddingBottom: "14px",
    borderBottom: "2px solid #e5e7eb"
  },

  contactLink: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    color: "#2563eb",
    textDecoration: "none",
    padding: "6px 12px",
    borderRadius: "6px",
    border: "1px solid #dbeafe",
    background: "#eff6ff",
    transition: "all 0.2s",
    fontSize: "12px",
    fontWeight: "500"
  },

  contactItem: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    padding: "6px 12px",
    borderRadius: "6px",
    background: "#f3f4f6",
    fontSize: "12px"
  },

  linkIcon: {
    fontSize: "14px"
  },

  section: {
    marginBottom: "24px"
  },

  heading: {
    fontSize: "18px",
    borderLeft: "5px solid #1f2937",
    paddingLeft: "10px",
    marginBottom: "14px",
    fontWeight: "700",
    color: "#111827"
  },

  paragraph: {
    fontSize: "13px",
    lineHeight: "1.8",
    color: "#4b5563",
    margin: "0 0 10px 0"
  },

  timelineItem: {
    marginBottom: "20px",
    paddingBottom: "14px",
    borderBottom: "1px solid #f1f5f9"
  },

  timelineTop: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "8px"
  },

  position: {
    fontWeight: "700",
    fontSize: "15px"
  },

  company: {
    fontSize: "13px",
    color: "#374151"
  },

  date: {
    fontSize: "12px",
    fontWeight: "600",
    background: "#e5e7eb",
    padding: "4px 10px",
    borderRadius: "5px",
    height: "fit-content"
  },

  columns: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "35px"
  },

  eduCard: {
    marginBottom: "15px"
  },

  degree: {
    fontWeight: "700",
    fontSize: "14px"
  },

  small: {
    fontSize: "12px",
    color: "#6b7280"
  },

  skillWrap: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px"
  },

  skill: {
    background: "#1f2937",
    color: "#fff",
    padding: "7px 12px",
    borderRadius: "4px",
    fontSize: "12px"
  },

  // ================= ENHANCED PROJECT LINK STYLES =================

  projectCard: {
    border: "1px solid #e5e7eb",
    padding: "14px",
    borderRadius: "8px",
    marginBottom: "14px",
    background: "#fafafa"
  },

  projectTitle: {
    fontWeight: "700",
    fontSize: "15px",
    marginBottom: "6px",
    color: "#111827"
  },

  tech: {
    color: "#2563eb",
    fontWeight: "600",
    fontSize: "12px",
    marginBottom: "8px"
  },

  projectLinks: {
    display: "flex",
    gap: "10px",
    marginTop: "12px",
    flexWrap: "wrap"
  },

  projectLinkButton: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    padding: "7px 14px",
    background: "#1f2937",
    color: "#fff",
    textDecoration: "none",
    borderRadius: "6px",
    fontSize: "11px",
    fontWeight: "600",
    border: "2px solid #1f2937",
    transition: "all 0.2s"
  },

  projectLinkButtonLive: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    padding: "7px 14px",
    background: "#2563eb",
    color: "#fff",
    textDecoration: "none",
    borderRadius: "6px",
    fontSize: "11px",
    fontWeight: "600",
    border: "2px solid #2563eb",
    transition: "all 0.2s"
  },

  projectLinkIcon: {
    fontSize: "13px"
  },

  // ================= CERTIFICATION LINK STYLES =================

  certCard: {
    marginBottom: "14px",
    padding: "10px",
    background: "#f9fafb",
    borderRadius: "6px",
    border: "1px solid #e5e7eb"
  },

  certName: {
    fontWeight: "700",
    fontSize: "13px",
    marginBottom: "4px"
  },

  certIssuer: {
    fontSize: "12px",
    color: "#374151",
    marginBottom: "2px"
  },

  certLink: {
    display: "inline-flex",
    alignItems: "center",
    gap: "5px",
    marginTop: "8px",
    padding: "5px 10px",
    background: "#fff",
    color: "#2563eb",
    textDecoration: "none",
    borderRadius: "5px",
    fontSize: "11px",
    fontWeight: "600",
    border: "1px solid #dbeafe"
  },

  certLinkIcon: {
    fontSize: "12px"
  }
};