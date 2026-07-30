// useCV.js — FIXED VERSION

import {
  useState,
  useCallback,
} from "react";

import api from "../utils/api";

import { useToast }
  from "./useToast";

// ==========================================
// INITIAL CV DATA
// ==========================================

const initialCVData = {
  _id: null,
  studentId: null,
  template: "modern",

  personalInfo: {
    fullName: "",
    email: "",
    phone: "",
    address: "",
    linkedin: "",
    github: "",
    portfolio: "",
    summary: "",
    jobTitle: "",
  },

  skills: [],
  education: [],
  experience: [],
  projects: [],
  certifications: [],
  languages: [],
  profileImage: "",
};

// ==========================================
// CUSTOM HOOK
// ==========================================

export const useCV = () => {

  const [cvData, setCVData] = useState(initialCVData);
  const [loading, setLoading] = useState(false);
  const [atsScore, setAtsScore] = useState(0);

  const { showToast } = useToast();

  // ==========================================
  // FETCH CV
  // ==========================================

  const fetchCV = useCallback(async () => {
    setLoading(true);

    try {
      const { data } = await api.get("/cv/me");

      if (data?.data) {
        setCVData(data.data);
        setAtsScore(data.data.atsScore || 0);
      }
    } catch (err) {
      if (err.response?.status !== 404) {
        console.log(err);
        showToast("Failed to load CV", "error");
      }
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  // ==========================================
  // SAVE CV
  // ==========================================
  // 🐛 BUG (root cause of the 500 error):
  // initialCVData._id was `null`. On the very first save this `_id: null`
  // was sent straight to the backend, and Mongoose tried to cast `null`
  // into an ObjectId for the `_id` field -> CastError -> 500.
  //
  // ✅ FIX: strip out `_id` / `studentId` from the payload whenever they
  // are falsy (null/undefined), so a brand-new CV is sent with NO `_id`
  // field at all, and Mongo generates one automatically.

  const saveCV = async (cvPayload) => {
    setLoading(true);

    try {
      const payload = { ...cvPayload };

      if (!payload._id) delete payload._id;
      if (!payload.studentId) delete payload.studentId;

      const { data } = await api.post("/cv/save", payload);

      if (data) {
        setCVData(data);
        setAtsScore(data.atsScore || 0);
      }

      showToast("CV saved successfully! ✅", "success");
      return data;

    } catch (err) {
      console.error("❌ SAVE ERROR:", err.response?.data || err);
      showToast(err.response?.data?.message || "Save failed", "error");
      throw err;

    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // PERSONAL INFO
  // ==========================================

  const updatePersonalInfo = (field, value) => {
    setCVData((prev) => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [field]: value,
      },
    }));
  };

  // ==========================================
  // SKILLS
  // ==========================================

  const addSkill = (skill) => {
    if (!skill.trim() || cvData.skills.includes(skill.trim())) return;

    setCVData((prev) => ({
      ...prev,
      skills: [...prev.skills, skill.trim()],
    }));
  };

  const removeSkill = (index) => {
    setCVData((prev) => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index),
    }));
  };

  // ==========================================
  // EDUCATION
  // ==========================================

  const addEducation = (edu) => {
    setCVData((prev) => ({
      ...prev,
      education: [...prev.education, edu],
    }));
  };

  const removeEducation = (index) => {
    setCVData((prev) => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index),
    }));
  };

  // ==========================================
  // EXPERIENCE
  // ==========================================

  const addExperience = (exp) => {
    setCVData((prev) => ({
      ...prev,
      experience: [...prev.experience, exp],
    }));
  };

  // 🐛 BUG: removeExperience was used in cvbuilder.jsx but was never
  // defined/returned by this hook -> "removeExperience is not a function"
  // ✅ FIX: added below
  const removeExperience = (index) => {
    setCVData((prev) => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index),
    }));
  };

  // ==========================================
  // PROJECTS
  // ==========================================

  const addProject = (proj) => {
    setCVData((prev) => ({
      ...prev,
      projects: [...prev.projects, proj],
    }));
  };

  // 🐛 BUG: removeProject was used in cvbuilder.jsx but never defined here
  // ✅ FIX: added below
  const removeProject = (index) => {
    setCVData((prev) => ({
      ...prev,
      projects: prev.projects.filter((_, i) => i !== index),
    }));
  };

  // ==========================================
  // CERTIFICATIONS
  // ==========================================
  // 🐛 BUG: addCertification / removeCertification were used in
  // cvbuilder.jsx but never existed in this hook at all.
  // ✅ FIX: added below

  const addCertification = (cert) => {
    setCVData((prev) => ({
      ...prev,
      certifications: [...prev.certifications, cert],
    }));
  };

  const removeCertification = (index) => {
    setCVData((prev) => ({
      ...prev,
      certifications: prev.certifications.filter((_, i) => i !== index),
    }));
  };


  const resetCV = useCallback(() => {

  setCVData(initialCVData);

  setAtsScore(0);

}, []);

  // ==========================================
  // IMAGE UPLOAD
  // ==========================================

  const uploadProfileImage = async (file) => {
    const formData = new FormData();
    formData.append("image", file);

    try {
      const { data } = await api.post("/cv/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setCVData((prev) => ({
        ...prev,
        profileImage: data.imageUrl,
      }));

      showToast("Photo uploaded!", "success");

    } catch (err) {
      console.log(err);
      showToast("Upload failed", "error");
    }
  };

  // ==========================================
  // RETURN
  // ==========================================

  return {
    cvData,
    setCVData,
    loading,
    atsScore,

    fetchCV,
    saveCV,
    resetCV,

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
  };
};