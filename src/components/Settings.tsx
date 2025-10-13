import type React from "react";
import { useState } from "react";
import { CustomToggle } from "./CustomToggle";
import { useSettings } from "./SettingsContext";

import "./Settings.css";

export const Settings: React.FC = () => {
  const [showSettings, setShowSettings] = useState(false);
  const { settings, updateSettings } = useSettings();

  const setSwipeRandom = (value: boolean) => {
    updateSettings({ swipeRandom: value });
  };

  const toggleSettings = () => setShowSettings(!showSettings);
  return (
    <div className="settings__container">
      <button
        type="button"
        onClick={toggleSettings}
        className="settings__button"
      >
        ⚙️ Settings
      </button>
      {showSettings && (
        <div className="settings__menu">
          <h2>Settings</h2>
          <div className="settings__option">
            <CustomToggle
              checked={settings.swipeRandom}
              onChange={setSwipeRandom}
              label={"Swipe to random"}
            />
          </div>
          <div>
            <button type="button" onClick={toggleSettings}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
