import { TOOL_CATEGORIES, TOOLS } from "@/data/tool-registry";
import type { ToolCategory, ToolCategorySlug, ToolDefinition } from "@/types/tool";

export function getAllCategories(): ToolCategory[] {
  return TOOL_CATEGORIES;
}

export function getAllTools(): ToolDefinition[] {
  return TOOLS;
}

export function getCategoryBySlug(slug: string): ToolCategory | undefined {
  return TOOL_CATEGORIES.find((category) => category.slug === slug);
}

export function isToolCategorySlug(slug?: string): slug is ToolCategorySlug {
  if (!slug) {
    return false;
  }

  return TOOL_CATEGORIES.some((category) => category.slug === slug);
}

export function getToolBySlug(slug: string): ToolDefinition | undefined {
  return TOOLS.find((tool) => tool.slug === slug);
}

export function getToolsByCategory(categorySlug: ToolCategorySlug): ToolDefinition[] {
  return TOOLS.filter((tool) => tool.categorySlug === categorySlug);
}

export function getRelatedTools(toolSlug: string, limit = 4): ToolDefinition[] {
  const currentTool = getToolBySlug(toolSlug);

  if (!currentTool) {
    return [];
  }

  const sameCategory = TOOLS.filter(
    (tool) =>
      tool.categorySlug === currentTool.categorySlug &&
      tool.slug !== currentTool.slug
  );

  if (sameCategory.length >= limit) {
    return sameCategory.slice(0, limit);
  }

  const fallback = TOOLS.filter(
    (tool) =>
      tool.categorySlug !== currentTool.categorySlug &&
      tool.slug !== currentTool.slug
  );

  return [...sameCategory, ...fallback].slice(0, limit);
}

export function getAllToolSlugs(): string[] {
  return TOOLS.map((tool) => tool.slug);
}
