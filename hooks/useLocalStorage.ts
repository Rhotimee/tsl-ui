import { useState, Dispatch, SetStateAction } from 'react';

export function useLocalStorage<T>(
  key: string,
  initialValue: T | (() => T)
): [T, Dispatch<SetStateAction<T>>] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue instanceof Function ? initialValue() : initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        return JSON.parse(item);
      }
    } catch {
      // Fall through to return initialValue
    }

    return initialValue instanceof Function ? initialValue() : initialValue;
  });

  const setValue: Dispatch<SetStateAction<T>> = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);

      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch {
      // Silently fail - state is still updated even if localStorage fails
    }
  };

  return [storedValue, setValue];
}
