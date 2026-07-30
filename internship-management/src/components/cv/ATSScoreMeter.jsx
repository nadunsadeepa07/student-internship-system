import React from "react";
import { AlertCircle, CheckCircle, TrendingUp } from "lucide-react";
import "../../styles/ATSScoreMeter.css";

export default function ATSScoreMeter({ score, cvData }) {
  
  // ✅ NOW USED - Calculate percentage with bounds
  const percentage = Math.min(Math.max(score, 0), 100);

  // Score color based on value
  const getScoreColor = () => {
    if (percentage >= 80) return "high";
    if (percentage >= 60) return "medium";
    return "low";
  };

  // Score message
  const getScoreMessage = () => {
    if (percentage >= 80) {
      return {
        icon: <CheckCircle size={20} />,
        text: "Excellent! Your CV is highly ATS-compatible",
        className: "high"
      };
    }
    
    if (percentage >= 60) {
      return {
        icon: <TrendingUp size={20} />,
        text: "Good, but there's room for improvement",
        className: "medium"
      };
    }
    
    return {
      icon: <AlertCircle size={20} />,
      text: "Needs improvement to pass ATS systems",
      className: "low"
    };
  };

  // Get improvement suggestions
  const getSuggestions = () => {
    const suggestions = [];

    if (!cvData?.personalInfo?.fullName) {
      suggestions.push("Add your full name");
    }

    if (!cvData?.personalInfo?.email) {
      suggestions.push("Add your email address");
    }

    if (!cvData?.personalInfo?.phone) {
      suggestions.push("Add your phone number");
    }

    if (!cvData?.personalInfo?.summary) {
      suggestions.push("Write a professional summary");
    }

    if (!cvData?.personalInfo?.linkedin) {
      suggestions.push("Add your LinkedIn profile");
    }

    if (!cvData?.skills || cvData.skills.length < 5) {
      suggestions.push("Add at least 5 relevant skills");
    }

    if (!cvData?.experience || cvData.experience.length === 0) {
      suggestions.push("Add work experience or internships");
    }

    if (!cvData?.education || cvData.education.length === 0) {
      suggestions.push("Add your education details");
    }

    if (!cvData?.projects || cvData.projects.length === 0) {
      suggestions.push("Include relevant projects");
    }

    return suggestions;
  };

  const scoreMessage = getScoreMessage();
  const suggestions = getSuggestions();

  return (
    <div className="ats-score-meter">
      
      {/* Header */}
      <div className="meter-header">
        <h3>ATS Compatibility Score</h3>
        <span className={`score-badge ${getScoreColor()}`}>
          {percentage}%
        </span>
      </div>

      {/* Progress Bar */}
      <div className="progress-bar-container">
        <div className="progress-bar">
          <div
            className={`progress-fill ${getScoreColor()}`}
            style={{ width: `${percentage}%` }}
          >
            <span className="progress-label">{percentage}%</span>
          </div>
        </div>

        <div className="progress-markers">
          <span>0</span>
          <span>25</span>
          <span>50</span>
          <span>75</span>
          <span>100</span>
        </div>
      </div>

      {/* Score Message */}
      <div className={`score-message ${scoreMessage.className}`}>
        {scoreMessage.icon}
        <p>{scoreMessage.text}</p>
      </div>

      {/* Improvement Suggestions */}
      {suggestions.length > 0 && (
        <div className="suggestions-section">
          <h4>
            <AlertCircle size={16} /> Suggestions to Improve
          </h4>
          <ul>
            {suggestions.map((suggestion, index) => (
              <li key={index}>{suggestion}</li>
            ))}
          </ul>
        </div>
      )}

      {/* ATS Tips */}
      <div className="ats-tips">
        <h4>💡 ATS Optimization Tips</h4>
        <ul>
          <li>Use standard section headings (Experience, Education, Skills)</li>
          <li>Include relevant keywords from job descriptions</li>
          <li>Avoid images, tables, and complex formatting</li>
          <li>Use common fonts (Arial, Calibri, Times New Roman)</li>
          <li>Save as PDF or DOCX format</li>
        </ul>
      </div>

    </div>
  );
}