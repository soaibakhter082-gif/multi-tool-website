"use client";

import { useEffect, useState } from "react";

type ThemeMode = "light" | "dark";

const THEME_STORAGE_KEY = "toolspark-theme";

function getSystemTheme(): ThemeMode {
  if (typeof window === "undefined") {
    return "light";
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

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

  const rootHasDarkClass = document.documentElement.classList.contains("dark");

  if (rootHasDarkClass) {
    return "dark";
  }

  return getStoredTheme() ?? getSystemTheme();
}

export function ThemeToggle() {
  const [mode, setMode] = useState<ThemeMode>(getInitialMode);

  useEffect(() => {
    applyTheme(mode);
  }, [mode]);

  function handleToggle(): void {
    const nextMode: ThemeMode = mode === "dark" ? "light" : "dark";
    setMode(nextMode);
    window.localStorage.setItem(THEME_STORAGE_KEY, nextMode);
  }

  const icon = mode === "dark" ? "☀" : "☾";
  const modeLabel = mode === "dark" ? "Light" : "Dark";

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-label="Toggle dark and light mode"
      title={`Switch to ${modeLabel} mode`}
      className="inline-flex items-center gap-1.5 rounded-full border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 transition hover:border-emerald-300 hover:text-emerald-800 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-emerald-400 dark:hover:text-emerald-300 sm:px-3 sm:text-sm"
    >
      <span className="text-base leading-none">{icon}</span>
      <span>Theme</span>
    </button>
  );
}
