import Link from "next/link";
import type { ToolCategory } from "@/types/tool";

interface CategoryCardProps {
  category: ToolCategory;
  toolCount?: number;
  href?: string;
}

export function CategoryCard({
  category,
  toolCount,
  href = `/categories/${category.slug}`,
}: CategoryCardProps) {
  return (
    <article className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-md">
      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-emerald-700">
        Category
      </p>
      <h3 className="text-lg font-semibold text-slate-900">{category.name}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-700">{category.description}</p>
      <div className="mt-4 flex items-center justify-between">
        <p className="text-xs font-medium text-slate-500">
          {typeof toolCount === "number" ? `${toolCount} tools` : "Tools coming"}
        </p>
        <Link
          href={href}
          className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 transition group-hover:border-emerald-300 group-hover:text-emerald-800"
        >
          Open
        </Link>
      </div>
    </article>
  );
}
