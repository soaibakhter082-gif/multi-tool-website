export type TextToolSlug =
  | "word-counter"
  | "character-counter"
  | "case-converter"
  | "remove-extra-spaces";

export type CaseMode = "uppercase" | "lowercase" | "titlecase" | "sentencecase";

interface TextToolRunOptions {
  slug: TextToolSlug;
  input: string;
  caseMode?: CaseMode;
}

const TEXT_TOOL_SLUGS: TextToolSlug[] = [
  "word-counter",
  "character-counter",
  "case-converter",
  "remove-extra-spaces",
];

export function isTextToolSlug(slug: string): slug is TextToolSlug {
  return TEXT_TOOL_SLUGS.includes(slug as TextToolSlug);
}

function countWords(text: string): number {
  return text.trim().length > 0 ? text.trim().split(/\s+/).length : 0;
}

function countLines(text: string): number {
  if (text.length === 0) {
    return 0;
  }

  return text.split(/\r?\n/).length;
}

function toTitleCase(text: string): string {
  return text
    .toLowerCase()
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function toSentenceCase(text: string): string {
  const trimmed = text.trim();

  if (!trimmed) {
    return "";
  }

  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();
}

export function runTextTool({ slug, input, caseMode = "uppercase" }: TextToolRunOptions): string {
  const charactersWithSpaces = input.length;
  const charactersWithoutSpaces = input.replace(/\s/g, "").length;

  switch (slug) {
    case "word-counter": {
      return [
        `Words: ${countWords(input)}`,
        `Characters (with spaces): ${charactersWithSpaces}`,
        `Characters (without spaces): ${charactersWithoutSpaces}`,
        `Lines: ${countLines(input)}`,
      ].join("\n");
    }

    case "character-counter": {
      return [
        `Characters (with spaces): ${charactersWithSpaces}`,
        `Characters (without spaces): ${charactersWithoutSpaces}`,
        `Words: ${countWords(input)}`,
        `Lines: ${countLines(input)}`,
      ].join("\n");
    }

    case "case-converter": {
      switch (caseMode) {
        case "uppercase":
          return input.toUpperCase();
        case "lowercase":
          return input.toLowerCase();
        case "titlecase":
          return toTitleCase(input);
        case "sentencecase":
          return toSentenceCase(input);
        default:
          return input;
      }
    }

    case "remove-extra-spaces": {
      return input
        .split(/\r?\n/)
        .map((line) => line.replace(/\s+/g, " ").trim())
        .join("\n");
    }

    default:
      return input;
  }
}
