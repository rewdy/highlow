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
  defaultValue: T
): [T, (value: T) => void] => {
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

  const setLocalStorageState = (value: T) => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Ignore write errors. What can you do?
    }
    setState(value);
  };

  return [state, setLocalStorageState];
};
