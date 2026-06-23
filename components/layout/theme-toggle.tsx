"use client";

import { useEffect, useState } from "react";

type ThemeMode = "light" | "dark";

const THEME_STORAGE_KEY = "toolspark-theme";

function applyTheme(theme: ThemeMode): void {
  const root = document.documentElement;
  root.classList.toggle("dark", theme === "dark");
  root.style.colorScheme = theme;
}

function getStoredTheme(): ThemeMode | null {
  if (typeof window === "undefined") {
    return null;
  }

  const value = window.localStorage.getItem(THEME_STORAGE_KEY);
  return value === "light" || value === "dark" ? value : null;
}

function getInitialMode(): ThemeMode {
  if (typeof window === "undefined") {
    return "light";
  }

  const storedTheme = getStoredTheme();
  if (storedTheme) {
    return storedTheme;
  }

  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

export function ThemeToggle() {
  const [mode, setMode] = useState<ThemeMode>(getInitialMode);

  useEffect(() => {
    applyTheme(mode);
    window.localStorage.setItem(THEME_STORAGE_KEY, mode);
  }, [mode]);

  function handleToggle(): void {
    const nextMode: ThemeMode = mode === "dark" ? "light" : "dark";
    setMode(nextMode);
  }

  const nextModeLabel = mode === "dark" ? "Light" : "Dark";
  const currentModeLabel = mode === "dark" ? "Dark" : "Light";

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-pressed={mode === "dark"}
      aria-label={`Switch to ${nextModeLabel.toLowerCase()} mode`}
      title={`Switch to ${nextModeLabel} mode`}
      className="inline-flex items-center gap-1.5 rounded-full border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 transition hover:border-emerald-300 hover:text-emerald-800 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-emerald-400 dark:hover:text-emerald-300 sm:px-3 sm:text-sm"
    >
      <span>Theme</span>
      <span
        aria-hidden="true"
        className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-700 dark:bg-slate-800 dark:text-slate-200"
      >
        {currentModeLabel}
      </span>
    </button>
  );
}
