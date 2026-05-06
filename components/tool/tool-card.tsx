import Link from "next/link";
import type { ToolDefinition } from "@/types/tool";

interface ToolCardProps {
  tool: ToolDefinition;
  categoryName?: string;
  href?: string;
}

export function ToolCard({
  tool,
  categoryName,
  href = `/tools/${tool.slug}`,
}: ToolCardProps) {
  return (
    <article className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-md">
      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-emerald-700">
        {categoryName ?? "Tool"}
      </p>
      <h3 className="text-lg font-semibold text-slate-900">{tool.name}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-700">{tool.shortDescription}</p>
      <div className="mt-4 flex items-center justify-between gap-3">
        <p className="text-xs font-medium text-slate-500">
          {tool.browserOnly ? "Browser processing" : "May use server processing"}
        </p>
        <Link
          href={href}
          className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 transition group-hover:border-emerald-300 group-hover:text-emerald-800"
        >
          Use Tool
        </Link>
      </div>
    </article>
  );
}
