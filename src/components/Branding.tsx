import type React from "react";
import { Link } from "wouter";

import "./Branding.css";

export const PromptBranding: React.FC = () => {
  return (
    <Link to="/" className="prompt-view__branding">
      <span className="prompt-view__branding-high">high</span>
      <span className="prompt-view__branding-slash">/</span>
      <span className="prompt-view__branding-low">low</span>
    </Link>
  );
};
