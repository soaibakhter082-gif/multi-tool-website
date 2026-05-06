import type { Metadata } from "next";
import Link from "next/link";
import { CategoryCard } from "@/components/common/category-card";
import { SectionTitle } from "@/components/common/section-title";
import { ToolCard } from "@/components/tool/tool-card";
import { getAllCategories, getAllTools, getToolsByCategory } from "@/lib/tools/registry";

export const metadata: Metadata = {
  title: "Home",
  description:
    "Free online text, developer, image, PDF, SEO, and calculator tools in one original browser-first website.",
};

export default function HomePage() {
  const categories = getAllCategories();
  const tools = getAllTools().slice(0, 6);

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-5 py-10 sm:px-8">
      <section className="rounded-3xl border border-emerald-100 bg-white/95 p-7 shadow-sm sm:p-10">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">
          Free Browser Tools
        </p>
        <h1 className="max-w-3xl text-3xl font-bold tracking-tight text-slate-900 sm:text-5xl">
          One clean place for quick online tools you can trust.
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-slate-700 sm:text-lg">
          Toolloom helps with text, developer, image, PDF, SEO, and calculator
          tasks. Version 1 focuses on simple tools that run in your browser.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/tools"
            className="rounded-xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800"
          >
            Explore All Tools
          </Link>
          <Link
            href="/categories/text-tools"
            className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-emerald-300 hover:text-emerald-800"
          >
            Start with Text Tools
          </Link>
        </div>
      </section>

      <section className="space-y-5">
        <SectionTitle
          badgeText="Categories"
          title="Choose a tool category"
          description="Each category groups related tools so you can find what you need faster."
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <CategoryCard
              key={category.slug}
              category={category}
              toolCount={getToolsByCategory(category.slug).length}
            />
          ))}
        </div>
      </section>

      <section className="space-y-5">
        <SectionTitle
          badgeText="Popular Start"
          title="Featured tools for quick tasks"
          description="These are beginner-friendly tools from our first release set."
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool) => {
            const categoryName =
              categories.find((category) => category.slug === tool.categorySlug)
                ?.name ?? "Tool";

            return (
              <ToolCard key={tool.id} tool={tool} categoryName={categoryName} />
            );
          })}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white/90 p-6">
        <SectionTitle
          title="Privacy-first by design"
          description="When a tool works in browser only, your input or file is processed in your browser on your device."
        />
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white/95 p-6 shadow-sm">
        <SectionTitle
          title="Helpful links"
          description="Use these pages to understand Toolloom better and navigate faster."
        />
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href="/blog"
            className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-emerald-300 hover:text-emerald-800"
          >
            Guides
          </Link>
          <Link
            href="/about"
            className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-emerald-300 hover:text-emerald-800"
          >
            About Us
          </Link>
          <Link
            href="/contact"
            className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-emerald-300 hover:text-emerald-800"
          >
            Contact Us
          </Link>
          <Link
            href="/sitemap"
            className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-emerald-300 hover:text-emerald-800"
          >
            Sitemap
          </Link>
        </div>
      </section>
    </main>
  );
}
