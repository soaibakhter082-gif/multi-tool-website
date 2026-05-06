import Link from "next/link";

const FOOTER_LINKS = [
  { label: "Home", href: "/" },
  { label: "All Tools", href: "/tools" },
  { label: "Guides", href: "/blog" },
  { label: "About Us", href: "/about" },
  { label: "Contact Us", href: "/contact" },
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms of Use", href: "/terms-of-use" },
  { label: "Disclaimer", href: "/disclaimer" },
  { label: "Sitemap", href: "/sitemap" },
];

export function SiteFooter() {
  return (
    <footer className="mt-12 border-t border-black/10 bg-white/80">
      <div className="mx-auto grid w-full max-w-6xl gap-6 px-5 py-8 sm:grid-cols-2 sm:px-8">
        <div>
          <p className="text-base font-semibold text-slate-900">Toolloom</p>
          <p className="mt-2 max-w-sm text-sm leading-6 text-slate-600">
            Free browser-first tools for everyday tasks. We design for speed,
            clarity, and beginner-friendly usage.
          </p>
        </div>

        <nav aria-label="Footer links" className="sm:justify-self-end">
          <ul className="flex flex-wrap gap-2 sm:justify-end">
            {FOOTER_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="rounded-lg px-2.5 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-900"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </footer>
  );
}
