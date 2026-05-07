import type { Metadata } from "next";
import Link from "next/link";
import { SectionTitle } from "@/components/common/section-title";
import { getAllCategories, getAllTools, getToolsByCategory } from "@/lib/tools/registry";

export const metadata: Metadata = {
  title: "Sitemap",
  description:
    "Browse all key pages, categories, and tool links in Team Sahil.",
};

const CORE_PAGES = [
  { label: "Home", href: "/" },
  { label: "All Tools", href: "/tools" },
  { label: "Guides", href: "/blog" },
  { label: "About Us", href: "/about" },
  { label: "Contact Us", href: "/contact" },
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms of Use", href: "/terms-of-use" },
  { label: "Disclaimer", href: "/disclaimer" },
];

export default function SitemapPage() {
  const categories = getAllCategories();
  const tools = getAllTools();

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-5 py-10 sm:px-8">
      <section className="rounded-2xl border border-slate-200 bg-white/95 p-6 shadow-sm">
        <SectionTitle
          badgeText="Sitemap"
          title="All important links in one place"
          description={`This page lists core pages, ${categories.length} categories, and ${tools.length} tools.`}
        />
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white/95 p-6 shadow-sm">
        <h2 className="text-xl font-bold tracking-tight text-slate-900">
          Core pages
        </h2>
        <ul className="mt-4 grid gap-2 text-sm text-slate-700 sm:grid-cols-2">
          {CORE_PAGES.map((page) => (
            <li key={page.href}>
              <Link
                href={page.href}
                className="inline-flex rounded-lg px-2 py-1 transition hover:bg-slate-100 hover:text-slate-900"
              >
                {page.label}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-4 rounded-2xl border border-slate-200 bg-white/95 p-6 shadow-sm">
        <h2 className="text-xl font-bold tracking-tight text-slate-900">
          Categories and tools
        </h2>
        <div className="space-y-4">
          {categories.map((category) => {
            const categoryTools = getToolsByCategory(category.slug);

            return (
              <article
                key={category.slug}
                className="rounded-xl border border-slate-200 bg-slate-50 p-4"
              >
                <div className="flex flex-wrap items-center gap-3">
                  <Link
                    href={`/categories/${category.slug}`}
                    className="text-base font-semibold text-slate-900 transition hover:text-emerald-800"
                  >
                    {category.name}
                  </Link>
                  <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-900">
                    {categoryTools.length} tools
                  </span>
                </div>

                <ul className="mt-3 grid gap-2 text-sm text-slate-700 sm:grid-cols-2 lg:grid-cols-3">
                  {categoryTools.map((tool) => (
                    <li key={tool.id}>
                      <Link
                        href={`/tools/${tool.slug}`}
                        className="inline-flex rounded-lg px-2 py-1 transition hover:bg-white hover:text-slate-900"
                      >
                        {tool.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}
