import Link from "next/link";
import { ThemeToggleShell } from "@/components/layout/theme-toggle-shell";

const NAV_ITEMS = [
  { label: "Home", href: "/" },
  { label: "All Tools", href: "/tools" },
  { label: "Guides", href: "/blog", mobileHidden: true },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-black/10 bg-white/85 backdrop-blur dark:border-slate-700 dark:bg-slate-950/85">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:px-8">
        <div className="flex w-full items-center justify-between gap-3 sm:w-auto sm:flex-none sm:justify-start">
          <Link href="/" className="inline-flex min-w-0 items-center gap-2">
            <span className="h-3 w-3 shrink-0 rounded-full bg-emerald-600" />
            <span className="truncate text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100">
              ToolSpark
            </span>
          </Link>
          <div className="shrink-0 sm:hidden">
            <ThemeToggleShell />
          </div>
        </div>

        <nav aria-label="Main navigation" className="w-full sm:w-auto">
          <ul className="grid grid-cols-4 gap-2 sm:flex sm:flex-wrap sm:justify-end sm:gap-3">
            {NAV_ITEMS.map((item) => (
              <li
                key={item.href}
                className={item.mobileHidden ? "hidden sm:block" : "min-w-0"}
              >
                <Link
                  href={item.href}
                  className="inline-flex w-full items-center justify-center rounded-full px-2.5 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-white sm:w-auto sm:px-3 sm:text-sm"
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li className="hidden sm:block">
              <ThemeToggleShell />
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
