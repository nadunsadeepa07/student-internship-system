// TemplateSelector.jsx — 6 template options
// Each template different color theme/layout

import React from "react";

const TEMPLATES = [
  { id: "modern",    label: "Modern",    color: "#6366f1", preview: "M" },
  { id: "classic",   label: "Classic",   color: "#374151", preview: "C" },
  { id: "minimal",   label: "Minimal",   color: "#94a3b8", preview: "Mi" },
  { id: "dark",      label: "Dark",      color: "#1e293b", preview: "D" },
  { id: "creative",  label: "Creative",  color: "#ec4899", preview: "Cr" },
  { id: "executive", label: "Executive", color: "#b45309", preview: "Ex" },
];

export default function TemplateSelector({ template, setTemplate }) {
  return (
    <div className="template-selector">
      <p className="section-label">Choose Template</p>
      <div className="template-grid">
        {TEMPLATES.map((t) => (
          <button
            key={t.id}
            onClick={() => setTemplate(t.id)}
            className={`template-btn ${template === t.id ? "active" : ""}`}
            title={t.label}
          >
            {/* Mini preview circle */}
            <div className="template-preview" style={{ background: t.color }}>
              {t.preview}
            </div>
            <span>{t.label}</span>
            {template === t.id && <div className="template-check">✓</div>}
          </button>
        ))}
      </div>
    </div>
  );
}