import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SectionTitle } from "@/components/common/section-title";
import { ToolCard } from "@/components/tool/tool-card";
import {
  getAllCategories,
  getCategoryBySlug,
  getToolsByCategory,
  isToolCategorySlug,
} from "@/lib/tools/registry";

type CategoryPageProps = {
  params: Promise<{ category: string }>;
};

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { category } = await params;

  if (!isToolCategorySlug(category)) {
    return {
      title: "Category Not Found",
      description: "This tool category does not exist.",
    };
  }

  const categoryInfo = getCategoryBySlug(category);

  return {
    title: `${categoryInfo?.name ?? "Category"} Tools`,
    description:
      categoryInfo?.description ??
      "Explore tool categories in ToolSpark and pick the tools you need.",
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;

  if (!isToolCategorySlug(category)) {
    notFound();
  }

  const categoryInfo = getCategoryBySlug(category);

  if (!categoryInfo) {
    notFound();
  }

  const tools = getToolsByCategory(categoryInfo.slug);
  const otherCategories = getAllCategories().filter(
    (item) => item.slug !== categoryInfo.slug
  );

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-5 py-10 sm:px-8">
      <section className="rounded-2xl border border-slate-200 bg-white/95 p-6 shadow-sm">
        <SectionTitle
          badgeText="Category"
          title={categoryInfo.name}
          description={categoryInfo.description}
        />
        <div className="mt-4 flex flex-wrap gap-3">
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-900">
            {tools.length} tools in this category
          </span>
          <Link
            href="/tools"
            className="rounded-full border border-slate-300 px-3 py-1 text-xs font-semibold text-slate-700 transition hover:border-emerald-300 hover:text-emerald-800"
          >
            View all tools
          </Link>
        </div>
      </section>

      <section className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} categoryName={categoryInfo.name} />
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white/95 p-6">
        <SectionTitle
          title="Explore other categories"
          description="You can switch categories to discover more tools."
        />
        <div className="mt-4 flex flex-wrap gap-2">
          {otherCategories.map((item) => (
            <Link
              key={item.slug}
              href={`/categories/${item.slug}`}
              className="rounded-full border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-emerald-300 hover:text-emerald-800"
            >
              {item.name}
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
