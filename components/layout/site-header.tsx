import Link from "next/link";

const NAV_ITEMS = [
  { label: "Home", href: "/" },
  { label: "All Tools", href: "/tools" },
  { label: "Guides", href: "/blog" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-black/10 bg-white/85 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-4 sm:px-8">
        <Link href="/" className="inline-flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-emerald-600" />
          <span className="text-lg font-bold tracking-tight text-slate-900">
            Toolloom
          </span>
        </Link>

        <nav aria-label="Main navigation">
          <ul className="flex flex-wrap items-center gap-2 sm:gap-3">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="rounded-full px-2.5 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-900 sm:px-3 sm:text-sm"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
