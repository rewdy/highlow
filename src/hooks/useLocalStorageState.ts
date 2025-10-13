import { useState } from "react";

/**
 * Custom hook to manage state synced with localStorage
 *
 * @param key The key to store the value under
 * @param defaultValue The default value to use if no value is found
 * @returns A tuple with the current value and a setter function
 */
export const useLocalStorageState = <T>(
  key: string,
  defaultValue: T,
): [T, (value: T | ((prev: T) => T)) => void] => {
  const [state, setState] = useState<T>(() => {
    if (typeof window === "undefined") {
      return defaultValue;
    }
    try {
      const storedValue = window.localStorage.getItem(key);
      return storedValue ? (JSON.parse(storedValue) as T) : defaultValue;
    } catch {
      return defaultValue;
    }
  });

  const setLocalStorageState = (value: T | ((prev: T) => T)) => {
    // Handle both direct values and updater functions
    const newValue = value instanceof Function ? value(state) : value;

    try {
      window.localStorage.setItem(key, JSON.stringify(newValue));
    } catch {
      // Ignore write errors. What can you do?
    }
    setState(newValue);
  };

  return [state, setLocalStorageState];
};
