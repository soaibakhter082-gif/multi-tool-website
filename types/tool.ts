export type ToolCategorySlug =
  | "text-tools"
  | "developer-tools"
  | "image-tools"
  | "pdf-tools"
  | "seo-tools"
  | "calculator-converter-tools";

export interface ToolCategory {
  slug: ToolCategorySlug;
  name: string;
  description: string;
}

export interface ToolDefinition {
  id: string;
  name: string;
  slug: string;
  categorySlug: ToolCategorySlug;
  shortDescription: string;
  searchTerms: string[];
  browserOnly: boolean;
  mvpOrder: number;
}
