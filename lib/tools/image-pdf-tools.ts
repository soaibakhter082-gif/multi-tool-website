export type ImagePdfToolSlug =
  | "color-picker"
  | "image-resizer"
  | "image-compressor"
  | "image-to-pdf"
  | "pdf-merge"
  | "pdf-split";

export interface ColorValues {
  hex: string;
  rgb: { r: number; g: number; b: number };
  hsl: { h: number; s: number; l: number };
}

const IMAGE_PDF_TOOL_SLUGS: ImagePdfToolSlug[] = [
  "color-picker",
  "image-resizer",
  "image-compressor",
  "image-to-pdf",
  "pdf-merge",
  "pdf-split",
];

export function isImagePdfToolSlug(slug: string): slug is ImagePdfToolSlug {
  return IMAGE_PDF_TOOL_SLUGS.includes(slug as ImagePdfToolSlug);
}

export function normalizeHexColor(input: string): string {
  const value = input.trim().replace(/^#/, "");

  if (!/^[0-9a-fA-F]{3}$|^[0-9a-fA-F]{6}$/.test(value)) {
    throw new Error("Please enter a valid HEX color like #22c55e.");
  }

  if (value.length === 3) {
    const expanded = value
      .split("")
      .map((character) => `${character}${character}`)
      .join("");
    return `#${expanded.toUpperCase()}`;
  }

  return `#${value.toUpperCase()}`;
}

function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  const rUnit = r / 255;
  const gUnit = g / 255;
  const bUnit = b / 255;

  const max = Math.max(rUnit, gUnit, bUnit);
  const min = Math.min(rUnit, gUnit, bUnit);
  const delta = max - min;

  let hue = 0;
  const lightness = (max + min) / 2;
  let saturation = 0;

  if (delta !== 0) {
    saturation =
      lightness > 0.5 ? delta / (2 - max - min) : delta / (max + min);

    switch (max) {
      case rUnit:
        hue = (gUnit - bUnit) / delta + (gUnit < bUnit ? 6 : 0);
        break;
      case gUnit:
        hue = (bUnit - rUnit) / delta + 2;
        break;
      default:
        hue = (rUnit - gUnit) / delta + 4;
    }

    hue /= 6;
  }

  return {
    h: Math.round(hue * 360),
    s: Math.round(saturation * 100),
    l: Math.round(lightness * 100),
  };
}

export function parseColorFromHex(input: string): ColorValues {
  const hex = normalizeHexColor(input);
  const value = hex.slice(1);
  const r = Number.parseInt(value.slice(0, 2), 16);
  const g = Number.parseInt(value.slice(2, 4), 16);
  const b = Number.parseInt(value.slice(4, 6), 16);

  return {
    hex,
    rgb: { r, g, b },
    hsl: rgbToHsl(r, g, b),
  };
}

export function formatBytes(sizeInBytes: number): string {
  if (!Number.isFinite(sizeInBytes) || sizeInBytes < 0) {
    return "0 B";
  }

  if (sizeInBytes < 1024) {
    return `${sizeInBytes} B`;
  }

  const units = ["KB", "MB", "GB"];
  let value = sizeInBytes / 1024;
  let unitIndex = 0;

  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }

  return `${value.toFixed(2)} ${units[unitIndex]}`;
}

export function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
        return;
      }

      reject(new Error("Failed to read file as data URL."));
    };

    reader.onerror = () => {
      reject(new Error("Failed to read file."));
    };

    reader.readAsDataURL(file);
  });
}

export function readFileAsArrayBuffer(file: File): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (reader.result instanceof ArrayBuffer) {
        resolve(reader.result);
        return;
      }

      reject(new Error("Failed to read file bytes."));
    };

    reader.onerror = () => {
      reject(new Error("Failed to read file bytes."));
    };

    reader.readAsArrayBuffer(file);
  });
}

export function parsePdfPageSelection(
  pageSelection: string,
  totalPages: number
): number[] {
  if (!Number.isInteger(totalPages) || totalPages <= 0) {
    throw new Error("PDF does not contain pages.");
  }

  const raw = pageSelection.trim();

  if (raw.length === 0) {
    return Array.from({ length: totalPages }, (_, index) => index);
  }

  const selectedPages = new Set<number>();
  const segments = raw.split(",");

  for (const segment of segments) {
    const value = segment.trim();

    if (!value) {
      continue;
    }

    if (value.includes("-")) {
      const [startText, endText] = value.split("-").map((part) => part.trim());
      const start = Number.parseInt(startText, 10);
      const end = Number.parseInt(endText, 10);

      if (!Number.isInteger(start) || !Number.isInteger(end) || start > end) {
        throw new Error(`Invalid page range "${value}".`);
      }

      for (let page = start; page <= end; page += 1) {
        if (page < 1 || page > totalPages) {
          throw new Error(
            `Page ${page} is out of range. This PDF has ${totalPages} pages.`
          );
        }
        selectedPages.add(page - 1);
      }
      continue;
    }

    const page = Number.parseInt(value, 10);
    if (!Number.isInteger(page)) {
      throw new Error(`Invalid page value "${value}".`);
    }

    if (page < 1 || page > totalPages) {
      throw new Error(
        `Page ${page} is out of range. This PDF has ${totalPages} pages.`
      );
    }

    selectedPages.add(page - 1);
  }

  const result = Array.from(selectedPages).sort((a, b) => a - b);

  if (result.length === 0) {
    throw new Error("Please enter at least one page number.");
  }

  return result;
}
