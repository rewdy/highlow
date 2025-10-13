import { createContext, useContext } from "react";
import { useLocalStorageState } from "../hooks/useLocalStorageState";

type AppSettings = {
  swipeRandom: boolean;
};

type SettingsContextValue = {
  settings: AppSettings;
  updateSettings: (updates: Partial<AppSettings>) => void;
};

const SettingsContext = createContext<SettingsContextValue | undefined>({
  settings: { swipeRandom: true },
  updateSettings: () => {},
});

/**
 * Provides app-wide settings management
 */
export const SettingsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [settings, setSettings] = useLocalStorageState<AppSettings>(
    "app-settings",
    {
      swipeRandom: true,
    },
  );

  const updateSettings = (updates: Partial<AppSettings>) => {
    setSettings((prev) => ({ ...prev, ...updates }));
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

/**
 * Hook to access and update app settings
 */
export const useSettings = () => {
  const context = useContext(SettingsContext);

  if (!context) {
    throw new Error("useSettings must be used within SettingsProvider");
  }

  return context;
};
