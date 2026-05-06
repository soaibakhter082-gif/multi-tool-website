export type SeoToolSlug =
  | "meta-tag-generator"
  | "robots-txt-generator"
  | "qr-code-generator";

export interface MetaTagInput {
  title: string;
  description: string;
  keywords: string;
  canonicalUrl: string;
  robotsValue: string;
}

export interface RobotsInput {
  userAgent: string;
  allowPaths: string;
  disallowPaths: string;
  sitemapUrl: string;
}

const SEO_TOOL_SLUGS: SeoToolSlug[] = [
  "meta-tag-generator",
  "robots-txt-generator",
  "qr-code-generator",
];

export function isSeoToolSlug(slug: string): slug is SeoToolSlug {
  return SEO_TOOL_SLUGS.includes(slug as SeoToolSlug);
}

function htmlEscape(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export function normalizeRobotsValue(value: string): string {
  const normalized = value.trim().toLowerCase();

  if (!normalized) {
    return "index, follow";
  }

  return normalized;
}

export function buildMetaTags(input: MetaTagInput): string {
  const title = input.title.trim();
  const description = input.description.trim();
  const keywords = input.keywords.trim();
  const canonicalUrl = input.canonicalUrl.trim();
  const robotsValue = normalizeRobotsValue(input.robotsValue);

  if (!title) {
    throw new Error("Please enter a page title.");
  }

  if (!description) {
    throw new Error("Please enter a meta description.");
  }

  if (canonicalUrl && !/^https?:\/\//i.test(canonicalUrl)) {
    throw new Error("Canonical URL should start with http:// or https://");
  }

  const lines: string[] = [
    `<title>${htmlEscape(title)}</title>`,
    `<meta name="description" content="${htmlEscape(description)}" />`,
    `<meta name="robots" content="${htmlEscape(robotsValue)}" />`,
  ];

  if (keywords) {
    lines.push(`<meta name="keywords" content="${htmlEscape(keywords)}" />`);
  }

  if (canonicalUrl) {
    lines.push(`<link rel="canonical" href="${htmlEscape(canonicalUrl)}" />`);
  }

  lines.push(`<meta property="og:title" content="${htmlEscape(title)}" />`);
  lines.push(
    `<meta property="og:description" content="${htmlEscape(description)}" />`
  );
  if (canonicalUrl) {
    lines.push(`<meta property="og:url" content="${htmlEscape(canonicalUrl)}" />`);
  }

  return lines.join("\n");
}

function splitRobotPaths(value: string): string[] {
  return value
    .split(/\r?\n|,/)
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
}

export function buildRobotsText(input: RobotsInput): string {
  const userAgent = input.userAgent.trim() || "*";
  const allowPaths = splitRobotPaths(input.allowPaths);
  const disallowPaths = splitRobotPaths(input.disallowPaths);
  const sitemapUrl = input.sitemapUrl.trim();

  if (sitemapUrl && !/^https?:\/\//i.test(sitemapUrl)) {
    throw new Error("Sitemap URL should start with http:// or https://");
  }

  const lines: string[] = [`User-agent: ${userAgent}`];

  if (allowPaths.length === 0 && disallowPaths.length === 0) {
    lines.push("Allow: /");
  } else {
    for (const allowPath of allowPaths) {
      lines.push(`Allow: ${allowPath}`);
    }
    for (const disallowPath of disallowPaths) {
      lines.push(`Disallow: ${disallowPath}`);
    }
  }

  if (sitemapUrl) {
    lines.push("");
    lines.push(`Sitemap: ${sitemapUrl}`);
  }

  return lines.join("\n");
}
