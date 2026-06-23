import type { Metadata } from "next";
import Link from "next/link";
import { SectionTitle } from "@/components/common/section-title";

export const metadata: Metadata = {
  title: "Disclaimer",
  description:
    "Important notice about using ToolSpark outputs and limitations.",
};

export default function DisclaimerPage() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-5 py-10 sm:px-8">
      <section className="rounded-2xl border border-slate-200 bg-white/95 p-6 shadow-sm">
        <SectionTitle
          badgeText="Disclaimer"
          title="Please review before using results"
          description="ToolSpark provides helpful utilities, but final responsibility stays with the user."
        />
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white/95 p-6 shadow-sm">
        <h2 className="text-xl font-bold tracking-tight text-slate-900">
          General information
        </h2>
        <p className="mt-3 text-sm leading-7 text-slate-700">
          Outputs from ToolSpark are provided for general utility purposes only.
          They are not legal, medical, financial, or professional advice.
        </p>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white/95 p-6 shadow-sm">
        <h2 className="text-xl font-bold tracking-tight text-slate-900">
          Verify important results
        </h2>
        <p className="mt-3 text-sm leading-7 text-slate-700">
          If your task is important, please double-check the final output before
          publishing, submitting, or making decisions from it.
        </p>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white/95 p-6 shadow-sm">
        <h2 className="text-xl font-bold tracking-tight text-slate-900">
          No liability
        </h2>
        <p className="mt-3 text-sm leading-7 text-slate-700">
          ToolSpark is not liable for direct or indirect loss resulting from the
          use of this website or tool outputs.
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
            href="/terms-of-use"
            className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-emerald-300 hover:text-emerald-800"
          >
            Terms of Use
          </Link>
        </div>
      </section>
    </main>
  );
}
