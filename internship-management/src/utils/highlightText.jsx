import React from "react";

export function highlightText(text, query) {
  if (!query?.trim() || !text) return text;

  /* Escape special regex characters from user input */
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex   = new RegExp(`(${escaped})`, "gi");
  const parts   = text.split(regex);

  return parts.map((part, i) =>
    regex.test(part) ? (
      <mark key={i} className="search-highlight">
        {part}
      </mark>
    ) : (
      part
    )
  );
}