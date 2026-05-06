import type { Metadata } from "next";
import Link from "next/link";
import { SectionTitle } from "@/components/common/section-title";

export const metadata: Metadata = {
  title: "Guides",
  description:
    "Beginner-friendly guides are coming soon. Learn how to use Toolloom tools in simple steps.",
};

export default function BlogPage() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-5 py-10 sm:px-8">
      <section className="rounded-2xl border border-slate-200 bg-white/95 p-6 shadow-sm">
        <SectionTitle
          badgeText="Blog and Guides"
          title="Helpful guides are coming soon"
          description="We are preparing simple, step-by-step tutorials for beginners."
        />
        <p className="mt-4 text-sm leading-7 text-slate-700">
          This page is a placeholder for Version 1. Future guides will explain
          how to use text tools, developer tools, image tools, PDF tools, SEO
          tools, and calculator tools.
        </p>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white/95 p-6 shadow-sm">
        <h2 className="text-xl font-bold tracking-tight text-slate-900">
          Planned first guides
        </h2>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-7 text-slate-700">
          <li>How to clean text quickly with Text Tools</li>
          <li>How to format and validate JSON</li>
          <li>How to resize or compress images for faster websites</li>
          <li>How to create basic SEO meta tags and robots.txt</li>
        </ul>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white/95 p-6 shadow-sm">
        <h2 className="text-xl font-bold tracking-tight text-slate-900">
          Start using tools now
        </h2>
        <p className="mt-2 text-sm leading-7 text-slate-700">
          You can already use all available tools while guides are being written.
        </p>
        <div className="mt-4">
          <Link
            href="/tools"
            className="inline-flex rounded-xl bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800"
          >
            Go to All Tools
          </Link>
        </div>
      </section>
    </main>
  );
}
