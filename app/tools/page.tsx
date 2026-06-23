import type { Metadata } from "next";
import Link from "next/link";
import { SectionTitle } from "@/components/common/section-title";
import { CategoryFilterChips } from "@/components/tool/category-filter-chips";
import { ToolCard } from "@/components/tool/tool-card";
import { ToolSearchBar } from "@/components/tool/tool-search-bar";
import {
  getAllCategories,
  getAllTools,
  isToolCategorySlug,
} from "@/lib/tools/registry";
import type { ToolCategorySlug, ToolDefinition } from "@/types/tool";

export const metadata: Metadata = {
  title: "All Tools",
  description:
    "Browse all free ToolSpark tools by category and search quickly for the task you need.",
};

function filterTools(
  tools: ToolDefinition[],
  searchQuery: string,
  categorySlug?: ToolCategorySlug
): ToolDefinition[] {
  const normalizedQuery = searchQuery.trim().toLowerCase();

  return tools.filter((tool) => {
    const matchesCategory = categorySlug
      ? tool.categorySlug === categorySlug
      : true;

    const matchesQuery = normalizedQuery
      ? tool.name.toLowerCase().includes(normalizedQuery) ||
        tool.shortDescription.toLowerCase().includes(normalizedQuery) ||
        tool.searchTerms.some((term) =>
          term.toLowerCase().includes(normalizedQuery)
        )
      : true;

    return matchesCategory && matchesQuery;
  });
}

export default async function AllToolsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string }>;
}) {
  const categories = getAllCategories();
  const allTools = getAllTools();
  const params = await searchParams;

  const query = params.q ?? "";
  const activeCategorySlug = isToolCategorySlug(params.category)
    ? params.category
    : undefined;

  const filteredTools = filterTools(allTools, query, activeCategorySlug);

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-5 py-10 sm:px-8">
      <SectionTitle
        badgeText="All Tools"
        title="Browse every tool in one place"
        description="Search by name and filter by category to quickly find the right tool."
      />

      <section className="rounded-2xl border border-slate-200 bg-white/95 p-5 shadow-sm">
        <div className="flex flex-col gap-4">
          <ToolSearchBar actionPath="/tools" defaultValue={query} />
          <CategoryFilterChips
            categories={categories}
            activeCategorySlug={activeCategorySlug}
            basePath="/tools"
            queryKey="category"
            searchQuery={query}
            searchQueryKey="q"
          />
        </div>
      </section>

      <section className="space-y-4">
        <p className="text-sm font-medium text-slate-600">
          Showing {filteredTools.length} of {allTools.length} tools
        </p>

        {filteredTools.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredTools.map((tool) => {
              const categoryName =
                categories.find((category) => category.slug === tool.categorySlug)
                  ?.name ?? "Tool";

              return (
                <ToolCard key={tool.id} tool={tool} categoryName={categoryName} />
              );
            })}
          </div>
        ) : (
          <article className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
            <h2 className="text-lg font-semibold text-amber-900">
              No tools matched this filter
            </h2>
            <p className="mt-2 text-sm leading-6 text-amber-800">
              Try a different keyword or choose another category.
            </p>
          </article>
        )}
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white/95 p-6 shadow-sm">
        <SectionTitle
          title="Need guidance?"
          description="If you are new, these pages can help you understand the website faster."
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
