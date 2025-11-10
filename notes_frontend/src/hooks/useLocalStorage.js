import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Hook to persist JSON-serializable state in LocalStorage.
 * - key: string
 * - initialValue: T | () => T
 * Returns [value, setValue, clear]
 */
// PUBLIC_INTERFACE
export function useLocalStorage(key, initialValue) {
  const readInitial = useRef(false);
  const [state, setState] = useState(() => {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw != null) return JSON.parse(raw);
    } catch (_) {
      // ignore parse errors
    }
    return typeof initialValue === 'function' ? initialValue() : initialValue;
  });

  useEffect(() => {
    if (!readInitial.current) {
      readInitial.current = true;
      return;
    }
    try {
      window.localStorage.setItem(key, JSON.stringify(state));
    } catch (_) {
      // ignore quota errors
    }
  }, [key, state]);

  const clear = useCallback(() => {
    setState(typeof initialValue === 'function' ? initialValue() : initialValue);
    try {
      window.localStorage.removeItem(key);
    } catch (_) {}
  }, [initialValue, key]);

  return [state, setState, clear];
}
