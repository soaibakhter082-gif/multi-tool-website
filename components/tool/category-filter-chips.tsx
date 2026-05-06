import Link from "next/link";
import type { ToolCategory, ToolCategorySlug } from "@/types/tool";

interface CategoryFilterChipsProps {
  categories: ToolCategory[];
  activeCategorySlug?: ToolCategorySlug;
  basePath?: string;
  queryKey?: string;
  searchQuery?: string;
  searchQueryKey?: string;
}

function buildFilterHref(
  basePath: string,
  queryKey: string,
  slug?: string,
  searchQuery = "",
  searchQueryKey = "q"
): string {
  const params = new URLSearchParams();

  if (searchQuery.trim().length > 0) {
    params.set(searchQueryKey, searchQuery.trim());
  }

  if (slug) {
    params.set(queryKey, slug);
  }

  const query = params.toString();
  return query ? `${basePath}?${query}` : basePath;
}

export function CategoryFilterChips({
  categories,
  activeCategorySlug,
  basePath = "/tools",
  queryKey = "category",
  searchQuery = "",
  searchQueryKey = "q",
}: CategoryFilterChipsProps) {
  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="Tool categories">
      <Link
        href={buildFilterHref(
          basePath,
          queryKey,
          undefined,
          searchQuery,
          searchQueryKey
        )}
        aria-current={activeCategorySlug ? undefined : "page"}
        className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
          activeCategorySlug
            ? "border-slate-300 bg-white text-slate-700 hover:border-emerald-300 hover:text-emerald-800"
            : "border-emerald-300 bg-emerald-100 text-emerald-900"
        }`}
      >
        All
      </Link>

      {categories.map((category) => {
        const isActive = activeCategorySlug === category.slug;
        return (
          <Link
            key={category.slug}
            href={buildFilterHref(
              basePath,
              queryKey,
              category.slug,
              searchQuery,
              searchQueryKey
            )}
            aria-current={isActive ? "page" : undefined}
            className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
              isActive
                ? "border-emerald-300 bg-emerald-100 text-emerald-900"
                : "border-slate-300 bg-white text-slate-700 hover:border-emerald-300 hover:text-emerald-800"
            }`}
          >
            {category.name}
          </Link>
        );
      })}
    </div>
  );
}
