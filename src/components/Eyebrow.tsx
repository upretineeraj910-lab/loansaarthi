import React from "react";

export default function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="eyebrow">
      <span className="eyebrow-line" />
      <span className="eyebrow-text">{children}</span>
    </div>
  );
}
