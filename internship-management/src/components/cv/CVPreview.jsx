// CVPreview.jsx — Template switch කරලා correct template render කරනවා
// template prop අනුව ModernTemplate, DarkTemplate etc. show කරනවා

import React from "react";
import ModernTemplate   from "./ModernTemplate";
import ClassicTemplate  from "./ClassicTemplate";
import MinimalTemplate  from "./MinimalTemplate";
import DarkTemplate     from "./DarkTemplate";
import CreativeTemplate from "./CreativeTemplate";
import ExecutiveTemplate from "./ExecutiveTemplate";

export default function CVPreview({ cvData, template, sections }) {
  const props = { cvData, sections };

  switch (template) {
    case "modern":    return <ModernTemplate   {...props} />;
    case "classic":   return <ClassicTemplate  {...props} />;
    case "minimal":   return <MinimalTemplate  {...props} />;
    case "dark":      return <DarkTemplate     {...props} />;
    case "creative":  return <CreativeTemplate {...props} />;
    case "executive": return <ExecutiveTemplate {...props}/>;
    default:          return <ModernTemplate   {...props} />;

  }
}