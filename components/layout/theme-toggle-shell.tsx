"use client";

import dynamic from "next/dynamic";

const ThemeToggleNoSsr = dynamic(
  () =>
    import("@/components/layout/theme-toggle").then(
      (module) => module.ThemeToggle
    ),
  {
    ssr: false,
    loading: () => (
      <span className="inline-flex items-center rounded-full border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-200 sm:px-3 sm:text-sm">
        Theme
      </span>
    ),
  }
);

export function ThemeToggleShell() {
  return <ThemeToggleNoSsr />;
}
