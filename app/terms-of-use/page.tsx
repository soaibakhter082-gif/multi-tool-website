import type { Metadata } from "next";
import Link from "next/link";
import { SectionTitle } from "@/components/common/section-title";

export const metadata: Metadata = {
  title: "Terms of Use",
  description:
    "Read the basic terms for using Toolloom and its free online tools.",
};

export default function TermsOfUsePage() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-5 py-10 sm:px-8">
      <section className="rounded-2xl border border-slate-200 bg-white/95 p-6 shadow-sm">
        <SectionTitle
          badgeText="Terms of Use"
          title="Simple rules for using Toolloom"
          description="By using this website, you agree to these basic terms."
        />
        <p className="mt-4 text-xs text-slate-500">Last updated: May 6, 2026</p>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white/95 p-6 shadow-sm">
        <h2 className="text-xl font-bold tracking-tight text-slate-900">
          1. Fair use
        </h2>
        <p className="mt-3 text-sm leading-7 text-slate-700">
          You can use Toolloom tools for personal and professional tasks. Do
          not use the site for harmful, illegal, or abusive activity.
        </p>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white/95 p-6 shadow-sm">
        <h2 className="text-xl font-bold tracking-tight text-slate-900">
          2. Accuracy
        </h2>
        <p className="mt-3 text-sm leading-7 text-slate-700">
          We aim for correct results, but we do not guarantee that every result
          is perfect in every case. Please verify important outputs before final
          use.
        </p>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white/95 p-6 shadow-sm">
        <h2 className="text-xl font-bold tracking-tight text-slate-900">
          3. Service changes
        </h2>
        <p className="mt-3 text-sm leading-7 text-slate-700">
          We may add, remove, or update tools and pages at any time to improve
          the website.
        </p>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white/95 p-6 shadow-sm">
        <h2 className="text-xl font-bold tracking-tight text-slate-900">
          4. Acceptance
        </h2>
        <p className="mt-3 text-sm leading-7 text-slate-700">
          Continued use of Toolloom means you accept the latest version of these
          terms.
        </p>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white/95 p-6 shadow-sm">
        <h2 className="text-xl font-bold tracking-tight text-slate-900">
          Related pages
        </h2>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href="/privacy-policy"
            className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-emerald-300 hover:text-emerald-800"
          >
            Privacy Policy
          </Link>
          <Link
            href="/disclaimer"
            className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-emerald-300 hover:text-emerald-800"
          >
            Disclaimer
          </Link>
        </div>
      </section>
    </main>
  );
}
