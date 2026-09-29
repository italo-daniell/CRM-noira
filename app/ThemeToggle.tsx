"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

type Theme = "light" | "dark";
const THEME_STORAGE_KEY = "noira-theme";
const THEME_CHANGE_EVENT = "noira-theme-change";

type Props = { placement?: "site" | "dashboard" };

export function ThemeToggle({ placement = "site" }: Props) {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const readTheme = (): Theme => document.documentElement.dataset.theme === "dark" ? "dark" : "light";
    const syncTheme = () => setTheme(readTheme());
    const syncStoredTheme = (event: StorageEvent) => {
      if (event.key === THEME_STORAGE_KEY) syncTheme();
    };

    syncTheme();
    window.addEventListener(THEME_CHANGE_EVENT, syncTheme);
    window.addEventListener("storage", syncStoredTheme);
    return () => {
      window.removeEventListener(THEME_CHANGE_EVENT, syncTheme);
      window.removeEventListener("storage", syncStoredTheme);
    };
  }, []);

  function toggleTheme() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    document.documentElement.dataset.themeSource = "user";
    document.documentElement.style.colorScheme = next;
    localStorage.setItem(THEME_STORAGE_KEY, next);
    setTheme(next);
    window.dispatchEvent(new CustomEvent(THEME_CHANGE_EVENT, { detail: next }));
  }

  return (
    <button
      type="button"
      className={`theme-toggle theme-toggle-${placement}`}
      onClick={toggleTheme}
      aria-pressed={theme === "dark"}
      aria-label={theme === "dark" ? "Ativar modo claro" : "Ativar modo escuro"}
      title={theme === "dark" ? "Modo claro" : "Modo escuro"}
      data-theme={theme}
    >
      <Sun className="theme-icon" aria-hidden="true" strokeWidth={2} />
      <Moon className="theme-icon" aria-hidden="true" strokeWidth={2} />
      <i aria-hidden="true" />
    </button>
  );
}
