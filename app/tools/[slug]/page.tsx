import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CalculatorToolWorkspace } from "@/components/tool/calculator-tool-workspace";
import { DeveloperToolWorkspace } from "@/components/tool/developer-tool-workspace";
import { ImagePdfToolWorkspace } from "@/components/tool/image-pdf-tool-workspace";
import { SeoToolWorkspace } from "@/components/tool/seo-tool-workspace";
import { TextToolWorkspace } from "@/components/tool/text-tool-workspace";
import { ToolShell } from "@/components/tool/tool-shell";
import {
  getAllToolSlugs,
  getCategoryBySlug,
  getRelatedTools,
  getToolBySlug,
} from "@/lib/tools/registry";
import { isCalculatorToolSlug } from "@/lib/tools/calculator-tools";
import { isDeveloperToolSlug } from "@/lib/tools/developer-tools";
import { isImagePdfToolSlug } from "@/lib/tools/image-pdf-tools";
import { isSeoToolSlug } from "@/lib/tools/seo-tools";
import { isTextToolSlug } from "@/lib/tools/text-tools";
import { getToolPageContent } from "@/lib/tools/tool-page-content";

type ToolPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getAllToolSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: ToolPageProps): Promise<Metadata> {
  const { slug } = await params;
  const tool = getToolBySlug(slug);

  if (!tool) {
    return {
      title: "Tool Not Found",
      description: "The requested tool does not exist.",
    };
  }

  const categoryName = getCategoryBySlug(tool.categorySlug)?.name ?? "Tools";

  return {
    title: tool.name,
    description: `${tool.shortDescription} Use this free ${categoryName.toLowerCase()} tool in Team Sahil.`,
  };
}

export default async function ToolPage({ params }: ToolPageProps) {
  const { slug } = await params;
  const tool = getToolBySlug(slug);

  if (!tool) {
    notFound();
  }

  const categoryName = getCategoryBySlug(tool.categorySlug)?.name ?? "Tool";
  const content = getToolPageContent(tool);
  const related = getRelatedTools(tool.slug, 6).map((relatedTool) => ({
    tool: relatedTool,
    categoryName:
      getCategoryBySlug(relatedTool.categorySlug)?.name ?? "Related Tool",
  }));
  const interactivePanel = isTextToolSlug(tool.slug) ? (
    <TextToolWorkspace slug={tool.slug} toolName={tool.name} />
  ) : isDeveloperToolSlug(tool.slug) ? (
    <DeveloperToolWorkspace slug={tool.slug} toolName={tool.name} />
  ) : isCalculatorToolSlug(tool.slug) ? (
    <CalculatorToolWorkspace slug={tool.slug} toolName={tool.name} />
  ) : isImagePdfToolSlug(tool.slug) ? (
    <ImagePdfToolWorkspace slug={tool.slug} toolName={tool.name} />
  ) : isSeoToolSlug(tool.slug) ? (
    <SeoToolWorkspace slug={tool.slug} toolName={tool.name} />
  ) : undefined;

  return (
    <ToolShell
      tool={tool}
      categoryName={categoryName}
      howToSteps={content.howToSteps}
      exampleInput={content.exampleInput}
      exampleOutput={content.exampleOutput}
      faqItems={content.faqItems}
      relatedTools={related}
      interactivePanel={interactivePanel}
    />
  );
}
