"use client";

import { useEffect, useRef, useState } from "react";

// Open access stores a separate workspace on each browser, never a shared
// anonymous database. Keep the first render identical to server rendering.
export function useDeviceState<T>(key: string, initialValue: T) {
  const initial = useRef(initialValue);
  const [value, setValue] = useState(initialValue);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    try {
      const saved = localStorage.getItem(key);
      if (saved !== null) {
        const parsed = JSON.parse(saved);
        const valid = Array.isArray(initial.current)
          ? Array.isArray(parsed)
          : parsed !== null && typeof parsed === typeof initial.current;
        if (valid) setValue(parsed as T);
      }
    } catch { /* A blocked or corrupt local store must not prevent access. */ }
    setReady(true);
  }, [key]);
  useEffect(() => {
    if (!ready) return;
    try { localStorage.setItem(key, JSON.stringify(value)); }
    catch {
      window.dispatchEvent(new Event("noira-storage-error"));
    }
  }, [key, ready, value]);
  return [value, setValue] as const;
}
