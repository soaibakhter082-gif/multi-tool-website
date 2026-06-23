import type { Metadata } from "next";
import Link from "next/link";
import { SectionTitle } from "@/components/common/section-title";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Read how ToolSpark handles your data and privacy for browser-based tools.",
};

export default function PrivacyPolicyPage() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-5 py-10 sm:px-8">
      <section className="rounded-2xl border border-slate-200 bg-white/95 p-6 shadow-sm">
        <SectionTitle
          badgeText="Privacy Policy"
          title="Your privacy matters"
          description="This policy explains how data is handled on ToolSpark Version 1."
        />
        <p className="mt-4 text-xs text-slate-500">Last updated: May 6, 2026</p>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white/95 p-6 shadow-sm">
        <h2 className="text-xl font-bold tracking-tight text-slate-900">
          1. Browser processing
        </h2>
        <p className="mt-3 text-sm leading-7 text-slate-700">
          In Version 1, tools are designed to process text or files directly in
          your browser when possible. This means your data stays on your device
          during tool usage for those browser-based tools.
        </p>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white/95 p-6 shadow-sm">
        <h2 className="text-xl font-bold tracking-tight text-slate-900">
          2. Accounts and payments
        </h2>
        <p className="mt-3 text-sm leading-7 text-slate-700">
          ToolSpark Version 1 has no login system and no payment system. We do
          not ask for account creation.
        </p>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white/95 p-6 shadow-sm">
        <h2 className="text-xl font-bold tracking-tight text-slate-900">
          3. Analytics and ads
        </h2>
        <p className="mt-3 text-sm leading-7 text-slate-700">
          Version 1 does not include ads. If analytics or ads are added in
          future versions, this policy will be updated clearly before or at the
          time of change.
        </p>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white/95 p-6 shadow-sm">
        <h2 className="text-xl font-bold tracking-tight text-slate-900">
          4. Policy updates
        </h2>
        <p className="mt-3 text-sm leading-7 text-slate-700">
          We may update this policy when the product changes. The latest update
          date will always be shown on this page.
        </p>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white/95 p-6 shadow-sm">
        <h2 className="text-xl font-bold tracking-tight text-slate-900">
          Related pages
        </h2>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href="/terms-of-use"
            className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-emerald-300 hover:text-emerald-800"
          >
            Terms of Use
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
