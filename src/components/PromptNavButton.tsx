import type React from "react";
import "./PromptNavButton.css";

export type ArrowButtonProps = {
  direction: "up" | "down";
  className?: string;
  disabled?: boolean;
  onClick: () => void;
};

/**
 * A reusable arrow button component for navigation
 *
 * @param direction - The direction of the arrow (up or down)
 * @param onClick - The click handler for the button
 * @param disabled - Whether the button is disabled
 * @returns A button element with an arrow icon
 */
export const PromptNavButton: React.FC<ArrowButtonProps> = ({
  direction,
  onClick,
  disabled,
}) => {
  const Svg = direction === "up" ? SvgUp : SvgDown;
  const className =
    direction === "up"
      ? "prompt-view__nav--previous"
      : "prompt-view__nav--next";
  const label = direction === "up" ? "Previous Prompt" : "Next Prompt";
  const shortLabel = direction === "up" ? "Previous" : "Next";
  return (
    <button
      type="button"
      className={`prompt-view__nav ${className}`}
      onClick={() => onClick()}
      disabled={disabled}
      aria-label={label}
    >
      <Svg label={shortLabel} />
    </button>
  );
};

function SvgUp({ label }: { label?: string }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {label && <title>{label}</title>}
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function SvgDown({ label }: { label?: string }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {label && <title>{label}</title>}
      <polyline points="18 15 12 9 6 15" />
    </svg>
  );
}
