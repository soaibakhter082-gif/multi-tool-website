import Link from "next/link";
import type { ReactNode } from "react";
import { SectionTitle } from "@/components/common/section-title";
import { ToolCard } from "@/components/tool/tool-card";
import type { ToolFaqItem } from "@/lib/tools/tool-page-content";
import type { ToolDefinition } from "@/types/tool";

interface RelatedToolItem {
  tool: ToolDefinition;
  categoryName: string;
}

interface ToolShellProps {
  tool: ToolDefinition;
  categoryName: string;
  howToSteps: string[];
  exampleInput: string;
  exampleOutput: string;
  faqItems: ToolFaqItem[];
  relatedTools: RelatedToolItem[];
  interactivePanel?: ReactNode;
}

export function ToolShell({
  tool,
  categoryName,
  howToSteps,
  exampleInput,
  exampleOutput,
  faqItems,
  relatedTools,
  interactivePanel,
}: ToolShellProps) {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-5 py-10 sm:px-8">
      <section className="rounded-3xl border border-slate-200 bg-white/95 p-6 shadow-sm sm:p-8">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.13em] text-emerald-900">
            {categoryName}
          </span>
          {tool.browserOnly ? (
            <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.13em] text-sky-900">
              Browser Processing
            </span>
          ) : null}
        </div>

        <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          {tool.name}
        </h1>
        <p className="mt-3 max-w-3xl text-base leading-7 text-slate-700">
          {tool.shortDescription}
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/tools"
            className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-emerald-300 hover:text-emerald-800"
          >
            Back to All Tools
          </Link>
          <Link
            href={`/categories/${tool.categorySlug}`}
            className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-emerald-300 hover:text-emerald-800"
          >
            View Category
          </Link>
          <Link
            href="/blog"
            className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-emerald-300 hover:text-emerald-800"
          >
            Read Guides
          </Link>
          <Link
            href="/contact"
            className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-emerald-300 hover:text-emerald-800"
          >
            Contact Us
          </Link>
        </div>

        <p className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
          {tool.browserOnly
            ? "Privacy note: this tool processes your data in your browser."
            : "Privacy note: processing details for this tool will always be shown clearly."}
        </p>
      </section>

      {interactivePanel ? (
        interactivePanel
      ) : (
        <>
          <section className="space-y-4 rounded-2xl border border-slate-200 bg-white/95 p-6 shadow-sm">
            <SectionTitle title="Input Area and Output Area" />
            <div className="grid gap-4 lg:grid-cols-2">
              <article className="space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-4">
                <h2 className="text-sm font-semibold uppercase tracking-[0.1em] text-slate-700">
                  Input Area
                </h2>
                <textarea
                  className="min-h-44 w-full resize-y rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-emerald-300 transition focus:ring-2"
                  placeholder={`Enter your ${tool.name} input here...`}
                />
              </article>

              <article className="space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-4">
                <h2 className="text-sm font-semibold uppercase tracking-[0.1em] text-slate-700">
                  Output Area
                </h2>
                <div className="min-h-44 rounded-lg border border-dashed border-slate-300 bg-white px-3 py-2 text-sm leading-6 text-slate-600">
                  Your result will appear here after the tool action is added.
                </div>
              </article>
            </div>
          </section>

          <section className="space-y-3 rounded-2xl border border-slate-200 bg-white/95 p-6 shadow-sm">
            <SectionTitle title="Action Buttons" />
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                disabled
                className="cursor-not-allowed rounded-xl bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white opacity-70"
              >
                Run {tool.name}
              </button>
              <button
                type="button"
                disabled
                className="cursor-not-allowed rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 opacity-70"
              >
                Copy Output
              </button>
              <button
                type="button"
                disabled
                className="cursor-not-allowed rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 opacity-70"
              >
                Reset/Clear
              </button>
            </div>
            <p className="text-sm text-slate-600">
              Functional tool logic will be connected in the next implementation
              steps.
            </p>
          </section>
        </>
      )}

      <section className="space-y-4 rounded-2xl border border-slate-200 bg-white/95 p-6 shadow-sm">
        <SectionTitle title="How to Use" />
        <ol className="list-decimal space-y-2 pl-5 text-sm leading-7 text-slate-700">
          {howToSteps.map((step, index) => (
            <li key={`${tool.slug}-how-to-${index}`}>{step}</li>
          ))}
        </ol>
      </section>

      <section className="space-y-4 rounded-2xl border border-slate-200 bg-white/95 p-6 shadow-sm">
        <SectionTitle title="Example" />
        <div className="grid gap-4 lg:grid-cols-2">
          <article className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <h2 className="text-xs font-semibold uppercase tracking-[0.1em] text-slate-700">
              Example Input
            </h2>
            <pre className="mt-2 break-words whitespace-pre-wrap text-sm leading-6 text-slate-800">
              {exampleInput}
            </pre>
          </article>

          <article className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <h2 className="text-xs font-semibold uppercase tracking-[0.1em] text-slate-700">
              Example Output
            </h2>
            <pre className="mt-2 break-words whitespace-pre-wrap text-sm leading-6 text-slate-800">
              {exampleOutput}
            </pre>
          </article>
        </div>
      </section>

      <section className="space-y-4 rounded-2xl border border-slate-200 bg-white/95 p-6 shadow-sm">
        <SectionTitle title="FAQ" />
        <div className="space-y-3">
          {faqItems.map((item, index) => (
            <details
              key={`${tool.slug}-faq-${index}`}
              className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3"
            >
              <summary className="cursor-pointer text-sm font-semibold text-slate-900">
                {item.question}
              </summary>
              <p className="mt-2 text-sm leading-6 text-slate-700">{item.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <SectionTitle
          title="Related Tools"
          description="You may also find these tools helpful."
        />
        {relatedTools.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {relatedTools.map((item) => (
              <ToolCard
                key={item.tool.id}
                tool={item.tool}
                categoryName={item.categoryName}
              />
            ))}
          </div>
        ) : (
          <p className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700">
            Related tools will appear here.
          </p>
        )}
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white/95 p-6 shadow-sm">
        <SectionTitle
          title="More Pages"
          description="You can learn more about this project using these quick links."
        />
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href="/about"
            className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-emerald-300 hover:text-emerald-800"
          >
            About Us
          </Link>
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
