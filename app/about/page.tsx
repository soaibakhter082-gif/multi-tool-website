import type { Metadata } from "next";
import Link from "next/link";
import { SectionTitle } from "@/components/common/section-title";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn why Toolloom was built and how this free browser-first tool website helps beginners and everyday users.",
};

export default function AboutPage() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-5 py-10 sm:px-8">
      <section className="rounded-2xl border border-slate-200 bg-white/95 p-6 shadow-sm">
        <SectionTitle
          badgeText="About Toolloom"
          title="Simple tools for real daily tasks"
          description="Toolloom is built to give people a clean and easy place to solve quick digital tasks for free."
        />
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white/95 p-6 shadow-sm">
        <h2 className="text-xl font-bold tracking-tight text-slate-900">
          Why this project exists
        </h2>
        <p className="mt-3 text-sm leading-7 text-slate-700">
          Many websites are full of noise, popups, and confusing menus.
          Toolloom focuses on clarity. You open a tool, add your input, get your
          result, and move on quickly.
        </p>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white/95 p-6 shadow-sm">
        <h2 className="text-xl font-bold tracking-tight text-slate-900">
          Version 1 focus
        </h2>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-7 text-slate-700">
          <li>Free tools with no login</li>
          <li>No backend and no database in Version 1</li>
          <li>Browser-first processing where possible</li>
          <li>Mobile-friendly and beginner-friendly interface</li>
        </ul>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white/95 p-6 shadow-sm">
        <h2 className="text-xl font-bold tracking-tight text-slate-900">
          Original design promise
        </h2>
        <p className="mt-3 text-sm leading-7 text-slate-700">
          Toolloom is built as an original project. We avoid copying other
          websites and focus on our own structure, naming, and content style.
        </p>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white/95 p-6 shadow-sm">
        <h2 className="text-xl font-bold tracking-tight text-slate-900">
          Explore next
        </h2>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href="/tools"
            className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-emerald-300 hover:text-emerald-800"
          >
            Browse All Tools
          </Link>
          <Link
            href="/blog"
            className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-emerald-300 hover:text-emerald-800"
          >
            Read Guides
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
