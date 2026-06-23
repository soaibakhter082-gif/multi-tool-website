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
      <span className="inline-flex h-9 items-center gap-3 rounded-full border border-slate-300 bg-white/95 px-2 py-1 text-xs font-semibold text-slate-700 shadow-sm dark:border-slate-600 dark:bg-slate-900/95 dark:text-slate-200 sm:h-10 sm:px-2.5 sm:text-sm">
        <span className="min-w-[2.8rem] text-left tracking-[0.04em]">Theme</span>
        <span
          aria-hidden="true"
          className="relative inline-flex h-6 w-11 shrink-0 items-center rounded-full border border-amber-200 bg-gradient-to-r from-amber-100 via-white to-emerald-100 transition duration-300 ease-out sm:w-12"
        >
          <span className="absolute left-0.5 h-5 w-5 rounded-full bg-white shadow-sm" />
        </span>
      </span>
    ),
  }
);

export function ThemeToggleShell() {
  return <ThemeToggleNoSsr />;
}
