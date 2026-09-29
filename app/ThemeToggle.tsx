"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

type Theme = "light" | "dark";

type Props = { placement?: "site" | "dashboard" };

export function ThemeToggle({ placement = "site" }: Props) {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const active = document.documentElement.dataset.theme === "dark" ? "dark" : "light";
    setTheme(active);
  }, []);

  function toggleTheme() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    document.documentElement.style.colorScheme = next;
    localStorage.setItem("noira-theme", next);
    setTheme(next);
  }

  return (
    <button
      type="button"
      className={`theme-toggle theme-toggle-${placement}`}
      onClick={toggleTheme}
      aria-label={theme === "dark" ? "Ativar modo claro" : "Ativar modo escuro"}
      title={theme === "dark" ? "Modo claro" : "Modo escuro"}
    >
      <Sun className="theme-icon" aria-hidden="true" strokeWidth={2} />
      <Moon className="theme-icon" aria-hidden="true" strokeWidth={2} />
      <i aria-hidden="true" />
    </button>
  );
}
