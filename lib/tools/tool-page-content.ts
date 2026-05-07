import type { ToolDefinition } from "@/types/tool";

export interface ToolFaqItem {
  question: string;
  answer: string;
}

export interface ToolPageContent {
  howToSteps: string[];
  exampleInput: string;
  exampleOutput: string;
  faqItems: ToolFaqItem[];
}

function getCategoryExample(tool: ToolDefinition): {
  input: string;
  output: string;
} {
  if (tool.slug === "word-counter") {
    return {
      input: "Team Sahil makes beginner coding easier.",
      output:
        "Words: 5\nCharacters (with spaces): 36\nCharacters (without spaces): 31\nLines: 1",
    };
  }

  if (tool.slug === "character-counter") {
    return {
      input: "Hello world",
      output:
        "Characters (with spaces): 11\nCharacters (without spaces): 10\nWords: 2\nLines: 1",
    };
  }

  if (tool.slug === "case-converter") {
    return {
      input: "welcome to team sahil",
      output: "WELCOME TO TEAM SAHIL",
    };
  }

  if (tool.slug === "remove-extra-spaces") {
    return {
      input: "Hello    Team Sahil    user",
      output: "Hello Team Sahil user",
    };
  }

  if (tool.slug === "json-formatter") {
    return {
      input: '{"name":"Team Sahil","year":2026,"tags":["tools","web"]}',
      output:
        '{\n  "name": "Team Sahil",\n  "year": 2026,\n  "tags": [\n    "tools",\n    "web"\n  ]\n}',
    };
  }

  if (tool.slug === "json-validator") {
    return {
      input: '{"name":"Team Sahil","active":true}',
      output: "Valid JSON.\nType: object\nTop-level keys: 2",
    };
  }

  if (tool.slug === "base64-encode-decode") {
    return {
      input: "hello world",
      output: "aGVsbG8gd29ybGQ=",
    };
  }

  if (tool.slug === "url-encode-decode") {
    return {
      input: "https://example.com/search?q=hello world",
      output: "https%3A%2F%2Fexample.com%2Fsearch%3Fq%3Dhello%20world",
    };
  }

  if (tool.slug === "uuid-generator") {
    return {
      input: "Count: 3",
      output:
        "de305d54-75b4-431b-adb2-eb6b9e546014\nf47ac10b-58cc-4372-a567-0e02b2c3d479\n8a0f2f0d-5f7b-4d96-a2cc-eeb5ce725ece",
    };
  }

  if (tool.slug === "password-generator") {
    return {
      input: "Length: 16, include numbers and uppercase",
      output: "A7m#kP2r!xQ9tL4n",
    };
  }

  if (tool.slug === "slug-generator") {
    return {
      input: "My First Blog Post 2026!",
      output: "my-first-blog-post-2026",
    };
  }

  if (tool.slug === "age-calculator") {
    return {
      input: "Date of birth: 1998-04-12",
      output: "Age: 28 years, 0 months, 24 days\nTotal days lived: 10250",
    };
  }

  if (tool.slug === "bmi-calculator") {
    return {
      input: "Weight: 70 kg, Height: 170 cm",
      output: "BMI: 24.22\nCategory: Normal",
    };
  }

  if (tool.slug === "percentage-calculator") {
    return {
      input: "X% of Y mode: X=15, Y=200",
      output: "15% of 200 is 30.\nResult value: 30",
    };
  }

  if (tool.slug === "emi-calculator") {
    return {
      input: "Loan: 500000, Rate: 8.5%, Tenure: 5 years",
      output:
        "Monthly EMI: 10258.64\nTotal Payment: 615518.49\nTotal Interest: 115518.49",
    };
  }

  if (tool.slug === "unit-converter") {
    return {
      input: "Category: length, Value: 1000, From: m, To: km",
      output: "1000 m = 1 km",
    };
  }

  if (tool.slug === "meta-tag-generator") {
    return {
      input:
        "Title: Best Free Online Tools\nDescription: Fast and free browser tools for daily tasks.",
      output:
        '<title>Best Free Online Tools</title>\n<meta name="description" content="Fast and free browser tools for daily tasks." />\n<meta name="robots" content="index, follow" />',
    };
  }

  if (tool.slug === "robots-txt-generator") {
    return {
      input: "User-agent: *\nAllow: /\nDisallow: /private",
      output: "User-agent: *\nAllow: /\nDisallow: /private",
    };
  }

  if (tool.slug === "qr-code-generator") {
    return {
      input: "https://example.com",
      output: "QR code generated successfully.\nContent: https://example.com\nSize: 240px",
    };
  }

  if (tool.slug === "color-picker") {
    return {
      input: "HEX: #22C55E",
      output:
        "HEX: #22C55E\nRGB: rgb(34, 197, 94)\nHSL: hsl(142, 71%, 45%)",
    };
  }

  if (tool.slug === "image-resizer") {
    return {
      input: "Upload image + Width: 800",
      output:
        "Original: 1600x1200 (2.40 MB)\nResized: 800x600 (780.25 KB)\nOutput file: photo-resized.jpg",
    };
  }

  if (tool.slug === "image-compressor") {
    return {
      input: "Upload image + Quality: 0.75 + Max width: 1920",
      output:
        "Original: 2400x1600 (3.10 MB)\nCompressed: 1920x1280 (1.22 MB)\nSaved: 1.88 MB (60.65%)",
    };
  }

  if (tool.slug === "image-to-pdf") {
    return {
      input: "Upload images: note-1.jpg, note-2.jpg",
      output:
        "Input images: 2\nInput size: 1.85 MB\nPDF size: 1.22 MB\nOutput file: images-to-pdf.pdf",
    };
  }

  if (tool.slug === "pdf-merge") {
    return {
      input: "Upload PDFs: part-a.pdf, part-b.pdf",
      output:
        "Input PDFs: 2\nTotal pages merged: 14\nOutput size: 2.41 MB\nOutput file: merged.pdf",
    };
  }

  if (tool.slug === "pdf-split") {
    return {
      input: "Upload report.pdf + Pages: 1,3-5",
      output:
        "Original pages: 20\nSelected pages: 1, 3, 4, 5\nOutput size: 856.20 KB\nOutput file: report-split.pdf",
    };
  }

  switch (tool.categorySlug) {
    case "text-tools":
      return {
        input: "Hello   Team Sahil   user",
        output: "Clean and transformed text result appears here.",
      };
    case "developer-tools":
      return {
        input: '{"user":"alex","role":"dev"}',
        output: "Formatted or converted developer output appears here.",
      };
    case "image-tools":
      return {
        input: "Upload image: profile-photo.jpg",
        output: "Processed image preview and file details appear here.",
      };
    case "pdf-tools":
      return {
        input: "Upload PDF files: a.pdf, b.pdf",
        output: "New PDF result details appear here.",
      };
    case "seo-tools":
      return {
        input: "Page title: Best Travel Tips",
        output: "Generated SEO text or file content appears here.",
      };
    case "calculator-converter-tools":
      return {
        input: "Value 1: 120, Value 2: 15%",
        output: "Calculated result appears here.",
      };
    default:
      return {
        input: "Example input",
        output: "Example output",
      };
  }
}

export function getToolPageContent(tool: ToolDefinition): ToolPageContent {
  const example = getCategoryExample(tool);

  const howToSteps = [
    `Enter your data in the input area for ${tool.name}.`,
    `Click the main action button to process your input.`,
    "Review the result in the output area.",
    "Use Copy or Reset buttons as needed.",
  ];

  if (tool.browserOnly) {
    howToSteps.push(
      "Your data is processed in your browser for this tool."
    );
  }

  const faqItems: ToolFaqItem[] = [
    {
      question: `Is ${tool.name} free to use?`,
      answer:
        "Yes. This tool is free in Team Sahil Version 1 and does not require login.",
    },
    {
      question: "Is my input data private?",
      answer: tool.browserOnly
        ? "For this tool, processing happens in your browser on your device."
        : "Some tools may need different processing in future versions. Privacy notes will always be shown clearly.",
    },
    {
      question: "Can I use this tool on mobile?",
      answer:
        "Yes. The page layout is designed to work on both mobile and desktop screens.",
    },
  ];

  return {
    howToSteps,
    exampleInput: example.input,
    exampleOutput: example.output,
    faqItems,
  };
}
