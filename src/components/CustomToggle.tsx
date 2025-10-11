import "./CustomToggle.css";

/**
 * A custom toggle switch styled to match the app's look
 */
type CustomToggleProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
};

export const CustomToggle = ({
  checked,
  onChange,
  label,
}: CustomToggleProps) => {
  return (
    <label className="custom-toggle">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="custom-toggle-input"
        aria-checked={checked}
        aria-label={label || "Toggle"}
      />
      <span className="custom-toggle-slider" />
      {label && <span className="custom-toggle-label">{label}</span>}
    </label>
  );
};
