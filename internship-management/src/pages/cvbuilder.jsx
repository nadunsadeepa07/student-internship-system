import React, { useState, useRef, useEffect, useCallback } from "react";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import html2canvas from "html2canvas";
import jsPDF from "jspdf";

import {
  GripVertical,
  Plus,
  Trash2,
  Download,
  Save,
  Share2,
  Sparkles,
  Eye,
  ChevronDown,
  ChevronUp,
  User,
  Briefcase,
  GraduationCap,
  Code,
  Award,
  Globe,
  Loader2,
} from "lucide-react";

import { useCV } from "../hooks/useCV";
import CVPreview from "../components/cv/CVPreview";
import TemplateSelector from "../components/cv/TemplateSelector";
import ATSScoreMeter from "../components/cv/ATSScoreMeter";

import api from "../utils/api";

import "../styles/CVBuilder.css";

/* ===========================================================
   Sortable Section
=========================================================== */

function SortableSection({
  id,
  label,
  icon: Icon,
  children,
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.55 : 1,
  };

  const [collapsed, setCollapsed] = useState(false);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`cv-section-wrapper ${
        isDragging ? "dragging" : ""
      }`}
    >
      <div className="cv-section-header">

        <button
          className="drag-handle"
          {...attributes}
          {...listeners}
          aria-label="Drag Section"
        >
          <GripVertical size={18} />
        </button>

        <Icon
          size={18}
          className="section-icon"
        />

        <h3>{label}</h3>

        <button
          className="collapse-btn"
          onClick={() =>
            setCollapsed(!collapsed)
          }
        >
          {collapsed ? (
            <ChevronDown size={18} />
          ) : (
            <ChevronUp size={18} />
          )}
        </button>
      </div>

      {!collapsed && (
        <div className="cv-section-content">
          {children}
        </div>
      )}
    </div>
  );
}

/* ===========================================================
   CV Builder
=========================================================== */

export default function CVBuilder() {
  const cvRef = useRef(null);

  /* ===========================
     Template
  =========================== */

  const [template, setTemplate] =
    useState("modern");

  /* ===========================
     Preview
  =========================== */

  const [previewMode, setPreviewMode] =
    useState(false);

  /* ===========================
     Loading States
  =========================== */

  const [saving, setSaving] =
    useState(false);

  const [sharing, setSharing] =
    useState(false);

  const [downloading, setDownloading] =
    useState(false);

  const [aiLoading, setAiLoading] =
    useState(false);

  /* ===========================
     Share URL
  =========================== */

  const [shareUrl, setShareUrl] =
    useState("");

  /* ===========================
     Sections Order
  =========================== */

  const [sections, setSections] =
    useState([
      "personal",
      "summary",
      "skills",
      "experience",
      "education",
      "projects",
      "certifications",
    ]);

  /* ===========================
     Skill Input
  =========================== */

  const [skillInput, setSkillInput] =
    useState("");

  /* ===========================
     Education Form
  =========================== */

  const [newEdu, setNewEdu] =
    useState({
      institute: "",
      degree: "",
      field: "",
      year: "",
      gpa: "",
    });

  /* ===========================
     Experience Form
  =========================== */

  const [newExp, setNewExp] =
    useState({
      company: "",
      role: "",
      duration: "",
      description: "",
      type: "Internship",
    });

  /* ===========================
     Project Form
  =========================== */

  const [newProj, setNewProj] =
    useState({
      title: "",
      technologies: "",
      description: "",
      github: "",
      liveUrl: "",
    });

  /* ===========================
     Certification Form
  =========================== */

  const [newCert, setNewCert] =
    useState({
      name: "",
      issuer: "",
      year: "",
    });

  /* ===========================
     Custom Hook
  =========================== */

  const {
    cvData,
    loading,
    atsScore,

    fetchCV,
    saveCV,
    resetCV,

    setCVData,

    updatePersonalInfo,

    addSkill,
    removeSkill,

    addEducation,
    removeEducation,

    addExperience,
    removeExperience,

    addProject,
    removeProject,

    addCertification,
    removeCertification,

    uploadProfileImage,
  } = useCV();

  /* ===========================
     Initial Load
  =========================== */

  useEffect(() => {
    resetCV();
  }, [resetCV]);

  /* ===========================
     Validation
  =========================== */

  const validateEducation = useCallback(() => {
    if (!newEdu.institute.trim()) {
      alert("⚠️ Institute name is required");
      return false;
    }
    if (!newEdu.degree.trim()) {
      alert("⚠️ Degree is required");
      return false;
    }
    return true;
  }, [newEdu]);

  const validateExperience = useCallback(() => {
    if (!newExp.company.trim()) {
      alert("⚠️ Company name is required");
      return false;
    }
    if (!newExp.role.trim()) {
      alert("⚠️ Role is required");
      return false;
    }
    if (!newExp.duration.trim()) {
      alert("⚠️ Duration is required");
      return false;
    }
    return true;
  }, [newExp]);

  const validateProject = useCallback(() => {
    if (!newProj.title.trim()) {
      alert("⚠️ Project title is required");
      return false;
    }
    return true;
  }, [newProj]);

  const validateCertification = useCallback(() => {
    if (!newCert.name.trim()) {
      alert("⚠️ Certification name is required");
      return false;
    }
    return true;
  }, [newCert]);

  /* ===========================
     Drag & Drop Handler
  =========================== */

  const handleDragEnd = useCallback(({ active, over }) => {
    if (!over || active.id === over.id) return;

    setSections((items) => {
      const oldIndex = items.indexOf(active.id);
      const newIndex = items.indexOf(over.id);
      return arrayMove(items, oldIndex, newIndex);
    });
  }, []);

  /* ===========================
     PDF Export (Multi-Page)
  =========================== */

  const downloadPDF = async () => {
  setDownloading(true);

  const element = cvRef.current;

  // remember the preview panel's current styles so we can restore them
  const prevStyle = {
    height: element.style.height,
    maxHeight: element.style.maxHeight,
    overflow: element.style.overflow,
  };

  try {
    // force the preview to lay out at FULL height before capture —
    // this is what was causing the "half CV" download
    element.style.height = "auto";
    element.style.maxHeight = "none";
    element.style.overflow = "visible";

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: "#ffffff",
      windowWidth: element.scrollWidth,
      windowHeight: element.scrollHeight,
      height: element.scrollHeight,
      width: element.scrollWidth,
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    const imgWidth = canvas.width;
    const imgHeight = canvas.height;

    // ALWAYS fit to page width — never shrink to squeeze tall content
    // into one page. Height alone decides how many pages we need.
    const ratio = pdfWidth / imgWidth;
    const scaledHeight = imgHeight * ratio;
    const totalPages = Math.max(1, Math.ceil(scaledHeight / pdfHeight));

    for (let i = 0; i < totalPages; i++) {
      if (i > 0) pdf.addPage();
      const yOffset = -i * pdfHeight;
      pdf.addImage(imgData, "PNG", 0, yOffset, pdfWidth, scaledHeight);
    }

    const fileName = cvData.personalInfo.fullName || "CV";
    pdf.save(`${fileName}.pdf`);
    alert("✅ PDF Downloaded!");
  } catch (err) {
    console.error(err);
    alert("❌ PDF Export Failed");
  } finally {
    element.style.height = prevStyle.height;
    element.style.maxHeight = prevStyle.maxHeight;
    element.style.overflow = prevStyle.overflow;
    setDownloading(false);
  }
};

  /* ===========================
     Share Function
  =========================== */

 const handleShare = async () => {
  setSharing(true);

  try {
    let currentCV = cvData;

    // ✅ Save first if no _id
    if (!currentCV._id) {
      const savedCV = await saveCV({  // ✅ Wait for save to complete
        ...cvData,
        template
      });

      currentCV = savedCV;  // ✅ Use returned data (has _id)
    }

    // ✅ Validate _id exists
    if (!currentCV._id) {
      throw new Error("CV ID missing after save");
    }

    // ✅ Now safe to share
    const shareRes = await api.post(`/cv/share/${currentCV._id}`);
    const url = shareRes.data.shareUrl;

    setShareUrl(url);
    await navigator.clipboard.writeText(url);

    if (navigator.share) {
      await navigator.share({
        title: "My Professional CV",
        url
      });
    }

    alert("✅ Share link copied to clipboard!");

  } catch (err) {
    console.error("❌ SHARE ERROR:", err);
    alert(err.response?.data?.message || err.message || "Share failed");

  } finally {
    setSharing(false);
  }
};

  /* ===========================
     Save CV - ✅ NOW USES saveCV FROM HOOK
  =========================== */

  const handleSave = async () => {
    setSaving(true);

    try {
      await saveCV({ ...cvData, template });
      alert("✅ CV Saved Successfully!");
    } catch (err) {
      console.error(err);
      alert(
        err.response?.data?.message ||
          "❌ Save failed"
      );
    } finally {
      setSaving(false);
    }
  };

  /* ===========================
     AI Cover Letter
  =========================== */

  const generateCoverLetter = async () => {
    setAiLoading(true);

    try {
      const { data } = await api.post(
        "/cv/ai-cover-letter",
        {
          personalInfo: cvData.personalInfo,
          skills: cvData.skills,
          experience: cvData.experience,
        }
      );

      // Download as text file
      const blob = new Blob([data.coverLetter], {
        type: "text/plain",
      });

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "cover-letter.txt";
      a.click();

      alert("✅ Cover Letter Generated!");
    } catch (err) {
      console.error(err);
      alert(
        err.response?.data?.message ||
          "❌ AI generation failed"
      );
    } finally {
      setAiLoading(false);
    }
  };

  /* ===========================
     Image Upload with Validation
  =========================== */

  const handleImageUpload = (file) => {
    if (!file) return;

    const validTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
    ];

    if (!validTypes.includes(file.type)) {
      alert("⚠️ Only JPG, JPEG, PNG allowed");
      return;
    }

    const maxSize = 2 * 1024 * 1024; // 2MB

    if (file.size > maxSize) {
      alert("⚠️ Image must be less than 2MB");
      return;
    }

    uploadProfileImage(file);
  };

  /* ===========================
     Add Skill with Validation
  =========================== */

  const handleAddSkill = () => {
    const skill = skillInput.trim();

    if (!skill) {
      alert("⚠️ Skill name cannot be empty");
      return;
    }

    if (cvData.skills.includes(skill)) {
      alert("⚠️ Skill already added");
      return;
    }

    addSkill(skill);
    setSkillInput("");
  };

  /* ===========================
     Add Education
  =========================== */

  const handleAddEducation = () => {
    if (!validateEducation()) return;

    addEducation(newEdu);

    setNewEdu({
      institute: "",
      degree: "",
      field: "",
      year: "",
      gpa: "",
    });
  };

  /* ===========================
     Add Experience
  =========================== */

  const handleAddExperience = () => {
    if (!validateExperience()) return;

    addExperience(newExp);

    setNewExp({
      company: "",
      role: "",
      duration: "",
      description: "",
      type: "Internship",
    });
  };

  /* ===========================
     Add Project
  =========================== */

  const handleAddProject = () => {
    if (!validateProject()) return;

    addProject(newProj);

    setNewProj({
      title: "",
      technologies: "",
      description: "",
      github: "",
      liveUrl: "",
    });
  };

  /* ===========================
     Add Certification
  =========================== */

  const handleAddCertification = () => {
    if (!validateCertification()) return;

    addCertification(newCert);

    setNewCert({
      name: "",
      issuer: "",
      year: "",
    });
  };

  /* ===========================
     Loading Screen
  =========================== */

  if (loading) {
    return (
      <div className="cv-loading">
        <Loader2
          size={48}
          className="spinner"
        />
        <p>Loading CV...</p>
      </div>
    );
  }

  /* ===========================================================
     SECTION COMPONENTS
  =========================================================== */

  const sectionComponents = {

    /* ===========================
       PERSONAL INFO
    =========================== */

    personal: (
      <SortableSection
        key="personal"
        id="personal"
        label="Personal Information"
        icon={User}
      >
        <div className="form-grid-2">
          <input
            type="text"
            className="cv-input"
            placeholder="Full Name *"
            value={cvData.personalInfo.fullName || ""}
            onChange={(e) =>
              updatePersonalInfo("fullName", e.target.value)
            }
          />

          <input
            type="email"
            className="cv-input"
            placeholder="Email *"
            value={cvData.personalInfo.email || ""}
            onChange={(e) =>
              updatePersonalInfo("email", e.target.value)
            }
          />

          <input
            type="tel"
            className="cv-input"
            placeholder="Phone *"
            value={cvData.personalInfo.phone || ""}
            onChange={(e) =>
              updatePersonalInfo("phone", e.target.value)
            }
          />

          <input
            type="text"
            className="cv-input"
            placeholder="Address"
            value={cvData.personalInfo.address || ""}
            onChange={(e) =>
              updatePersonalInfo("address", e.target.value)
            }
          />

          <input
            type="text"
            className="cv-input"
            placeholder="Job Title *"
            value={cvData.personalInfo.jobTitle || ""}
            onChange={(e) =>
              updatePersonalInfo("jobTitle", e.target.value)
            }
          />

          <input
            type="url"
            className="cv-input"
            placeholder="LinkedIn Profile"
            value={cvData.personalInfo.linkedin || ""}
            onChange={(e) =>
              updatePersonalInfo("linkedin", e.target.value)
            }
          />

          <input
            type="url"
            className="cv-input"
            placeholder="GitHub Profile"
            value={cvData.personalInfo.github || ""}
            onChange={(e) =>
              updatePersonalInfo("github", e.target.value)
            }
          />

          <input
            type="url"
            className="cv-input"
            placeholder="Portfolio Website"
            value={cvData.personalInfo.portfolio || ""}
            onChange={(e) =>
              updatePersonalInfo("portfolio", e.target.value)
            }
          />
        </div>

        <div className="upload-area">
          <label htmlFor="profile-upload">
            {cvData.profileImage ? (
              <img
                src={cvData.profileImage}
                alt="Profile"
                className="profile-preview"
              />
            ) : (
              <div className="upload-placeholder">
                <User size={32} />
                <p>Upload Profile Photo</p>
                <span>(JPG, PNG - Max 2MB)</span>
              </div>
            )}
          </label>

          <input
            id="profile-upload"
            type="file"
            accept="image/jpeg,image/jpg,image/png"
            onChange={(e) =>
              handleImageUpload(e.target.files[0])
            }
            style={{ display: "none" }}
          />

          {cvData.profileImage && (
            <button
              className="cv-btn remove-btn"
              onClick={() =>
                setCVData({
                  ...cvData,
                  profileImage: "",
                })
              }
            >
              <Trash2 size={14} /> Remove Photo
            </button>
          )}
        </div>
      </SortableSection>
    ),

    /* ===========================
       SUMMARY
    =========================== */

    summary: (
      <SortableSection
        key="summary"
        id="summary"
        label="Professional Summary"
        icon={User}
      >
        <textarea
          className="cv-textarea"
          placeholder="Write a compelling professional summary highlighting your key achievements and career goals (2-4 sentences)..."
          rows={5}
          maxLength={500}
          value={cvData.personalInfo.summary || ""}
          onChange={(e) =>
            updatePersonalInfo("summary", e.target.value)
          }
        />

        <div className="char-count">
          {cvData.personalInfo.summary?.length || 0}/500
        </div>

        <div className="tips">
          <p>💡 <strong>Tip:</strong> Keep it concise and tailored to your target role</p>
        </div>
      </SortableSection>
    ),

    /* ===========================
       SKILLS
    =========================== */

    skills: (
      <SortableSection
        key="skills"
        id="skills"
        label="Skills"
        icon={Code}
      >
        <div className="skill-input-row">
          <input
            type="text"
            className="cv-input"
            placeholder="Add a skill (e.g., React, Python, Communication)"
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddSkill();
              }
            }}
          />

          <button
            className="cv-btn add-btn"
            onClick={handleAddSkill}
          >
            <Plus size={16} /> Add
          </button>
        </div>

        <div className="skill-tags">
          {cvData.skills && cvData.skills.length > 0 ? (
            cvData.skills.map((skill, index) => (
              <span key={index} className="skill-tag">
                {skill}
                <button
                  onClick={() => removeSkill(index)}
                  aria-label={`Remove ${skill}`}
                >
                  <Trash2 size={12} />
                </button>
              </span>
            ))
          ) : (
            <p className="empty-message">
              No skills added yet. Start adding your technical and soft skills!
            </p>
          )}
        </div>
      </SortableSection>
    ),

    /* ===========================
       EDUCATION
    =========================== */

    education: (
      <SortableSection
        key="education"
        id="education"
        label="Education"
        icon={GraduationCap}
      >
        {/* Existing Education List */}
        <div className="list-items">
          {cvData.education && cvData.education.length > 0 ? (
            cvData.education.map((edu, index) => (
              <div key={index} className="list-item-card">
                <div className="item-content">
                  <h4>{edu.degree} in {edu.field}</h4>
                  <p className="item-subtitle">
                    {edu.institute}
                  </p>
                  <p className="item-meta">
                    {edu.year}
                    {edu.gpa && ` • GPA: ${edu.gpa}`}
                  </p>
                </div>

                <button
                  className="remove-btn"
                  onClick={() => removeEducation(index)}
                  aria-label="Remove Education"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))
          ) : (
            <p className="empty-message">
              No education added yet.
            </p>
          )}
        </div>

        {/* Add New Education Form */}
        <div className="add-form">
          <h4>Add Education</h4>

          <div className="form-grid-2">
            <input
              type="text"
              className="cv-input"
              placeholder="Institute/University *"
              value={newEdu.institute}
              onChange={(e) =>
                setNewEdu({
                  ...newEdu,
                  institute: e.target.value,
                })
              }
            />

            <input
              type="text"
              className="cv-input"
              placeholder="Degree *"
              value={newEdu.degree}
              onChange={(e) =>
                setNewEdu({
                  ...newEdu,
                  degree: e.target.value,
                })
              }
            />

            <input
              type="text"
              className="cv-input"
              placeholder="Field of Study"
              value={newEdu.field}
              onChange={(e) =>
                setNewEdu({
                  ...newEdu,
                  field: e.target.value,
                })
              }
            />

            <input
              type="text"
              className="cv-input"
              placeholder="Year (e.g., 2020-2024)"
              value={newEdu.year}
              onChange={(e) =>
                setNewEdu({
                  ...newEdu,
                  year: e.target.value,
                })
              }
            />

            <input
              type="text"
              className="cv-input"
              placeholder="GPA (Optional)"
              value={newEdu.gpa}
              onChange={(e) =>
                setNewEdu({
                  ...newEdu,
                  gpa: e.target.value,
                })
              }
            />
          </div>

          <button
            className="cv-btn add-btn"
            onClick={handleAddEducation}
          >
            <Plus size={14} /> Add Education
          </button>
        </div>
      </SortableSection>
    ),

    /* ===========================
       EXPERIENCE
    =========================== */

    experience: (
      <SortableSection
        key="experience"
        id="experience"
        label="Experience"
        icon={Briefcase}
      >
        {/* Existing Experience List */}
        <div className="list-items">
          {cvData.experience && cvData.experience.length > 0 ? (
            cvData.experience.map((exp, index) => (
              <div key={index} className="list-item-card">
                <div className="item-content">
                  <h4>{exp.role}</h4>
                  <p className="item-subtitle">
                    {exp.company} • {exp.type}
                  </p>
                  <p className="item-meta">{exp.duration}</p>
                  {exp.description && (
                    <p className="item-description">
                      {exp.description}
                    </p>
                  )}
                </div>

                <button
                  className="remove-btn"
                  onClick={() => removeExperience(index)}
                  aria-label="Remove Experience"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))
          ) : (
            <p className="empty-message">
              No experience added yet.
            </p>
          )}
        </div>

        {/* Add New Experience Form */}
        <div className="add-form">
          <h4>Add Experience</h4>

          <div className="form-grid-2">
            <input
              type="text"
              className="cv-input"
              placeholder="Company *"
              value={newExp.company}
              onChange={(e) =>
                setNewExp({
                  ...newExp,
                  company: e.target.value,
                })
              }
            />

            <input
              type="text"
              className="cv-input"
              placeholder="Role/Position *"
              value={newExp.role}
              onChange={(e) =>
                setNewExp({
                  ...newExp,
                  role: e.target.value,
                })
              }
            />

            <input
              type="text"
              className="cv-input"
              placeholder="Duration (e.g., Jan 2024 - Present) *"
              value={newExp.duration}
              onChange={(e) =>
                setNewExp({
                  ...newExp,
                  duration: e.target.value,
                })
              }
            />

            <select
              className="cv-input"
              value={newExp.type}
              onChange={(e) =>
                setNewExp({
                  ...newExp,
                  type: e.target.value,
                })
              }
            >
              <option value="Internship">Internship</option>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Freelance">Freelance</option>
              <option value="Contract">Contract</option>
            </select>
          </div>

          <textarea
            className="cv-textarea"
            placeholder="Describe your key responsibilities and achievements..."
            rows={4}
            value={newExp.description}
            onChange={(e) =>
              setNewExp({
                ...newExp,
                description: e.target.value,
              })
            }
          />

          <button
            className="cv-btn add-btn"
            onClick={handleAddExperience}
          >
            <Plus size={14} /> Add Experience
          </button>
        </div>
      </SortableSection>
    ),

    /* ===========================
       PROJECTS
    =========================== */

    projects: (
      <SortableSection
        key="projects"
        id="projects"
        label="Projects"
        icon={Globe}
      >
        {/* Existing Projects List */}
        <div className="list-items">
          {cvData.projects && cvData.projects.length > 0 ? (
            cvData.projects.map((proj, index) => (
              <div key={index} className="list-item-card">
                <div className="item-content">
                  <h4>{proj.title}</h4>
                  
                  <p className="item-subtitle">
                    {proj.technologies}
                  </p>
                  
                  {proj.description && (
                    <p className="item-description">
                      {proj.description}
                    </p>
                  )}
                  
                  <div className="project-links">
                    {proj.github && (
                      <a
                        href={proj.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="project-link"
                      >
                        <Code size={14} /> GitHub
                      </a>
                    )}
                    
                    {proj.liveUrl && (
                      <a
                        href={proj.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="project-link"
                      >
                        <Globe size={14} /> Live Demo
                      </a>
                    )}
                  </div>
                </div>

                <button
                  className="remove-btn"
                  onClick={() => removeProject(index)}
                  aria-label="Remove Project"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))
          ) : (
            <p className="empty-message">
              No projects added yet.
            </p>
          )}
        </div>

        {/* Add New Project Form */}
        <div className="add-form">
          <h4>Add Project</h4>

          <div className="form-grid-2">
            <input
              type="text"
              className="cv-input"
              placeholder="Project Title *"
              value={newProj.title}
              onChange={(e) =>
                setNewProj({
                  ...newProj,
                  title: e.target.value,
                })
              }
            />

            <input
              type="text"
              className="cv-input"
              placeholder="Technologies (React, Node.js, MongoDB...)"
              value={newProj.technologies}
              onChange={(e) =>
                setNewProj({
                  ...newProj,
                  technologies: e.target.value,
                })
              }
            />

            <input
              type="url"
              className="cv-input"
              placeholder="GitHub URL"
              value={newProj.github}
              onChange={(e) =>
                setNewProj({
                  ...newProj,
                  github: e.target.value,
                })
              }
            />

            <input
              type="url"
              className="cv-input"
              placeholder="Live Demo URL"
              value={newProj.liveUrl}
              onChange={(e) =>
                setNewProj({
                  ...newProj,
                  liveUrl: e.target.value,
                })
              }
            />
          </div>

          <textarea
            className="cv-textarea"
            placeholder="Project description and key features..."
            rows={3}
            value={newProj.description}
            onChange={(e) =>
              setNewProj({
                ...newProj,
                description: e.target.value,
              })
            }
          />

          <button
            className="cv-btn add-btn"
            onClick={handleAddProject}
          >
            <Plus size={14} /> Add Project
          </button>
        </div>
      </SortableSection>
    ),

    /* ===========================
       CERTIFICATIONS
    =========================== */

    certifications: (
      <SortableSection
        key="certifications"
        id="certifications"
        label="Certifications"
        icon={Award}
      >
        {/* Existing Certifications List */}
        <div className="list-items">
          {cvData.certifications && cvData.certifications.length > 0 ? (
            cvData.certifications.map((cert, index) => (
              <div key={index} className="list-item-card">
                <div className="item-content">
                  <h4>{cert.name}</h4>
                  <p className="item-subtitle">
                    {cert.issuer}
                  </p>
                  {cert.year && (
                    <p className="item-meta">{cert.year}</p>
                  )}
                </div>

                <button
                  className="remove-btn"
                  onClick={() => removeCertification(index)}
                  aria-label="Remove Certification"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))
          ) : (
            <p className="empty-message">
              No certifications added yet.
            </p>
          )}
        </div>

        {/* Add New Certification Form */}
        <div className="add-form">
          <h4>Add Certification</h4>

          <div className="form-grid-2">
            <input
              type="text"
              className="cv-input"
              placeholder="Certification Name *"
              value={newCert.name}
              onChange={(e) =>
                setNewCert({
                  ...newCert,
                  name: e.target.value,
                })
              }
            />

            <input
              type="text"
              className="cv-input"
              placeholder="Issuing Organization"
              value={newCert.issuer}
              onChange={(e) =>
                setNewCert({
                  ...newCert,
                  issuer: e.target.value,
                })
              }
            />

            <input
              type="text"
              className="cv-input"
              placeholder="Year Obtained"
              value={newCert.year}
              onChange={(e) =>
                setNewCert({
                  ...newCert,
                  year: e.target.value,
                })
              }
            />
          </div>

          <button
            className="cv-btn add-btn"
            onClick={handleAddCertification}
          >
            <Plus size={14} /> Add Certification
          </button>
        </div>
      </SortableSection>
    ),
  };

  /* ===========================================================
     MAIN RENDER
  =========================================================== */

  return (
    <div className="cv-builder-page">
      
      {/* ===========================
          TOP TOOLBAR
      =========================== */}

      <div className="cv-toolbar">
        <div className="toolbar-left">
          <h1>
            <Sparkles size={22} /> Smart CV Builder
          </h1>
        </div>

        <div className="toolbar-actions">
          
          {/* ATS Score Display */}
          <div className="ats-badge">
            <span className="ats-label">ATS Score:</span>
            <span className={`ats-value ${
              atsScore >= 80 ? "high" :
              atsScore >= 60 ? "medium" : "low"
            }`}>
              {atsScore}%
            </span>
          </div>

          {/* AI Cover Letter Button */}
          {/*<button
            className="cv-btn ai-btn"
            onClick={generateCoverLetter}
            disabled={aiLoading}
          >
            {aiLoading ? (
              <>
                <Loader2 size={16} className="spinner" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles size={16} /> AI Cover Letter
              </>
            )}
          </button>*/}

          {/* Preview Toggle */}
          <button
            className="cv-btn"
            onClick={() => setPreviewMode(!previewMode)}
          >
            <Eye size={16} />
            {previewMode ? "Edit Mode" : "Preview"}
          </button>

          {/* Share Button */}
          <button
            className="cv-btn share-btn"
            onClick={handleShare}
            disabled={sharing}
          >
            {sharing ? (
              <>
                <Loader2 size={16} className="spinner" />
                Sharing...
              </>
            ) : (
              <>
                <Share2 size={16} /> Share
              </>
            )}
          </button>

          {/* Save Button */}
          <button
            className="cv-btn save-btn"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? (
              <>
                <Loader2 size={16} className="spinner" />
                Saving...
              </>
            ) : (
              <>
                <Save size={16} /> Save
              </>
            )}
          </button>

          {/* Download PDF Button */}
          <button
            className="cv-btn download-btn"
            onClick={downloadPDF}
            disabled={downloading}
          >
            {downloading ? (
              <>
                <Loader2 size={16} className="spinner" />
                Exporting...
              </>
            ) : (
              <>
                <Download size={16} /> 
              </>
            )}
          </button>
        </div>
      </div>

      {/* Share URL Display */}
      {shareUrl && (
        <div className="share-url-banner">
          <p>
            ✅ <strong>Share Link:</strong>{" "}
            <a
              href={shareUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              {shareUrl}
            </a>
          </p>
          <button
            className="cv-btn"
            onClick={() => {
              navigator.clipboard.writeText(shareUrl);
              alert("Link copied!");
            }}
          >
            Copy Link
          </button>
        </div>
      )}

      {/* ===========================
          MAIN CONTENT GRID
      =========================== */}

      <div className="cv-grid">

        {/* LEFT PANEL - Form (Hidden in Preview Mode) */}
        {!previewMode && (
          <div className="cv-form-panel">
            
            {/* Template Selector */}
            <TemplateSelector
              template={template}
              setTemplate={setTemplate}
            />

            {/* ATS Score Meter */}
            <ATSScoreMeter score={atsScore} cvData={cvData} />

            {/* Draggable Sections */}
            <DndContext
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={sections}
                strategy={verticalListSortingStrategy}
              >
                {sections.map((sectionId) =>
                  sectionComponents[sectionId] || null
                )}
              </SortableContext>
            </DndContext>
          </div>
        )}

        {/* RIGHT PANEL - Live Preview */}
        <div
          className={`cv-preview-panel ${
            previewMode ? "full-width" : ""
          }`}
        >
          <div ref={cvRef} className="cv-preview-container">
            <CVPreview
              cvData={cvData}
              template={template}
              sections={sections}
            />
          </div>
        </div>

      </div>
    </div>
  );
}