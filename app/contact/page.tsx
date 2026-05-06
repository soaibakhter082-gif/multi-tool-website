import type { Metadata } from "next";
import Link from "next/link";
import { SectionTitle } from "@/components/common/section-title";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Contact Toolloom for feedback, tool suggestions, or bug reports.",
};

export default function ContactPage() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-5 py-10 sm:px-8">
      <section className="rounded-2xl border border-slate-200 bg-white/95 p-6 shadow-sm">
        <SectionTitle
          badgeText="Contact"
          title="We would love to hear from you"
          description="You can share feedback, report issues, or suggest new tools."
        />
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white/95 p-6 shadow-sm">
        <h2 className="text-xl font-bold tracking-tight text-slate-900">
          Contact options
        </h2>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-7 text-slate-700">
          <li>Email: support@toolloom.dev</li>
          <li>Subject examples: Bug report, New tool request, Feedback</li>
          <li>Response time: usually within 2 to 5 business days</li>
        </ul>
        <p className="mt-4 text-sm leading-7 text-slate-700">
          A contact form can be added in a future version when backend support
          is introduced.
        </p>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white/95 p-6 shadow-sm">
        <h2 className="text-xl font-bold tracking-tight text-slate-900">
          Helpful links
        </h2>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href="/tools"
            className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-emerald-300 hover:text-emerald-800"
          >
            Browse All Tools
          </Link>
          <Link
            href="/privacy-policy"
            className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-emerald-300 hover:text-emerald-800"
          >
            Privacy Policy
          </Link>
        </div>
      </section>
    </main>
  );
}
