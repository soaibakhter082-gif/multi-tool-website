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

  const isDarkMode = mode === "dark";
  const nextModeLabel = isDarkMode ? "Light" : "Dark";
  const currentModeLabel = isDarkMode ? "Dark" : "Light";

  return (
    <button
      type="button"
      onClick={handleToggle}
      role="switch"
      aria-checked={isDarkMode}
      aria-label={`Switch to ${nextModeLabel.toLowerCase()} mode`}
      title={`Switch to ${nextModeLabel} mode`}
      className="group inline-flex h-9 items-center gap-3 rounded-full border border-slate-300 bg-white/95 px-2 py-1 text-xs font-semibold text-slate-700 shadow-sm transition hover:border-emerald-300 hover:text-emerald-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-slate-600 dark:bg-slate-900/95 dark:text-slate-200 dark:hover:border-emerald-400 dark:hover:text-emerald-300 dark:focus-visible:ring-offset-slate-950 sm:h-10 sm:px-2.5 sm:text-sm"
    >
      <span className="min-w-[2.8rem] text-left tracking-[0.04em]">
        {currentModeLabel}
      </span>
      <span
        aria-hidden="true"
        className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full border transition duration-300 ease-out sm:w-12 ${
          isDarkMode
            ? "border-emerald-400/70 bg-slate-800 shadow-[inset_0_0_0_1px_rgba(16,185,129,0.16)]"
            : "border-amber-200 bg-gradient-to-r from-amber-100 via-white to-emerald-100"
        }`}
      >
        <span
          className={`absolute left-0.5 flex h-5 w-5 items-center justify-center rounded-full shadow-sm transition duration-300 ease-out ${
            isDarkMode
              ? "translate-x-[1.25rem] bg-slate-950 text-emerald-300 sm:translate-x-[1.5rem]"
              : "translate-x-0 bg-white text-amber-500"
          }`}
        >
          <span className="text-[11px] leading-none">{isDarkMode ? "D" : "L"}</span>
        </span>
      </span>
    </button>
  );
}
