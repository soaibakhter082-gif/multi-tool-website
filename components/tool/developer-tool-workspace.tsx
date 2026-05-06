"use client";

import { useState } from "react";
import {
  convertBase64,
  convertUrl,
  formatJson,
  generatePassword,
  generateSlug,
  generateUuids,
  type ConversionMode,
  type DeveloperToolSlug,
  validateJson,
} from "@/lib/tools/developer-tools";

interface DeveloperToolWorkspaceProps {
  slug: DeveloperToolSlug;
  toolName: string;
}

interface PasswordFormState {
  length: number;
  includeUppercase: boolean;
  includeLowercase: boolean;
  includeNumbers: boolean;
  includeSymbols: boolean;
}

const DEFAULT_PASSWORD_STATE: PasswordFormState = {
  length: 16,
  includeUppercase: true,
  includeLowercase: true,
  includeNumbers: true,
  includeSymbols: false,
};

function getPrimaryButtonLabel(slug: DeveloperToolSlug, toolName: string): string {
  switch (slug) {
    case "json-formatter":
      return "Format JSON";
    case "json-validator":
      return "Validate JSON";
    case "base64-encode-decode":
      return "Run Base64";
    case "url-encode-decode":
      return "Run URL Convert";
    case "uuid-generator":
      return "Generate UUID";
    case "password-generator":
      return "Generate Password";
    case "slug-generator":
      return "Generate Slug";
    default:
      return `Run ${toolName}`;
  }
}

function getInputPlaceholder(slug: DeveloperToolSlug): string {
  switch (slug) {
    case "json-formatter":
    case "json-validator":
      return '{"name":"Toolloom","type":"project"}';
    case "base64-encode-decode":
      return "Enter plain text or Base64 text here...";
    case "url-encode-decode":
      return "Enter URL or URL-encoded text here...";
    case "slug-generator":
      return "Enter title text like: My First Blog Post";
    default:
      return "Enter your input here...";
  }
}

function isModeTool(slug: DeveloperToolSlug): boolean {
  return slug === "base64-encode-decode" || slug === "url-encode-decode";
}

function needsInput(slug: DeveloperToolSlug): boolean {
  return slug !== "uuid-generator" && slug !== "password-generator";
}

export function DeveloperToolWorkspace({
  slug,
  toolName,
}: DeveloperToolWorkspaceProps) {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [copyMessage, setCopyMessage] = useState("");
  const [mode, setMode] = useState<ConversionMode>("encode");
  const [uuidCount, setUuidCount] = useState(3);
  const [passwordOptions, setPasswordOptions] =
    useState<PasswordFormState>(DEFAULT_PASSWORD_STATE);

  const hasOutput = output.trim().length > 0;
  const primaryButtonLabel = getPrimaryButtonLabel(slug, toolName);

  function setBooleanPasswordOption(
    key:
      | "includeUppercase"
      | "includeLowercase"
      | "includeNumbers"
      | "includeSymbols",
    value: boolean
  ): void {
    setPasswordOptions((previous) => ({
      ...previous,
      [key]: value,
    }));
  }

  function updatePasswordLength(length: number): void {
    const safeLength = Math.max(4, Math.min(length, 64));
    setPasswordOptions((previous) => ({
      ...previous,
      length: safeLength,
    }));
  }

  function handleRun(): void {
    setCopyMessage("");
    setError("");

    if (needsInput(slug) && input.trim().length === 0) {
      setError("Please enter some input first.");
      setOutput("");
      return;
    }

    try {
      switch (slug) {
        case "json-formatter":
          setOutput(formatJson(input));
          break;
        case "json-validator":
          setOutput(validateJson(input));
          break;
        case "base64-encode-decode":
          setOutput(convertBase64(input, mode));
          break;
        case "url-encode-decode":
          setOutput(convertUrl(input, mode));
          break;
        case "uuid-generator":
          setOutput(generateUuids(uuidCount).join("\n"));
          break;
        case "password-generator":
          setOutput(generatePassword(passwordOptions));
          break;
        case "slug-generator":
          setOutput(generateSlug(input));
          break;
        default:
          setOutput("");
      }
    } catch (caughtError) {
      const message =
        caughtError instanceof Error
          ? caughtError.message
          : "Something went wrong. Please check your input.";
      setError(message);
      setOutput("");
    }
  }

  async function handleCopy(): Promise<void> {
    if (!hasOutput) {
      setError("Please generate output first, then copy.");
      return;
    }

    try {
      await navigator.clipboard.writeText(output);
      setCopyMessage("Output copied.");
      setError("");
    } catch {
      setError("Copy failed. Please copy manually from output.");
    }
  }

  function handleReset(): void {
    setInput("");
    setOutput("");
    setError("");
    setCopyMessage("");
    setMode("encode");
    setUuidCount(3);
    setPasswordOptions(DEFAULT_PASSWORD_STATE);
  }

  return (
    <>
      <section className="space-y-4 rounded-2xl border border-slate-200 bg-white/95 p-6 shadow-sm">
        <h2 className="text-xl font-bold tracking-tight text-slate-900">
          Input Area and Output Area
        </h2>

        {isModeTool(slug) ? (
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setMode("encode")}
              className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                mode === "encode"
                  ? "border-emerald-300 bg-emerald-100 text-emerald-900"
                  : "border-slate-300 bg-white text-slate-700 hover:border-emerald-300 hover:text-emerald-800"
              }`}
            >
              Encode
            </button>
            <button
              type="button"
              onClick={() => setMode("decode")}
              className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                mode === "decode"
                  ? "border-emerald-300 bg-emerald-100 text-emerald-900"
                  : "border-slate-300 bg-white text-slate-700 hover:border-emerald-300 hover:text-emerald-800"
              }`}
            >
              Decode
            </button>
          </div>
        ) : null}

        {slug === "uuid-generator" ? (
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <label className="text-sm font-semibold text-slate-800" htmlFor="uuid-count">
              Number of UUIDs (1 to 20)
            </label>
            <input
              id="uuid-count"
              type="number"
              min={1}
              max={20}
              value={uuidCount}
              onChange={(event) => {
                const parsed = Number(event.target.value);
                setUuidCount(Number.isNaN(parsed) ? 1 : parsed);
              }}
              className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-emerald-300 transition focus:ring-2 sm:max-w-[220px]"
            />
          </div>
        ) : null}

        {slug === "password-generator" ? (
          <div className="space-y-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div>
              <label className="text-sm font-semibold text-slate-800" htmlFor="password-length">
                Password length (4 to 64)
              </label>
              <input
                id="password-length"
                type="number"
                min={4}
                max={64}
                value={passwordOptions.length}
                onChange={(event) => {
                  const parsed = Number(event.target.value);
                  updatePasswordLength(Number.isNaN(parsed) ? 4 : parsed);
                }}
                className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-emerald-300 transition focus:ring-2 sm:max-w-[220px]"
              />
            </div>

            <div className="grid gap-2 sm:grid-cols-2">
              <label className="inline-flex items-center gap-2 text-sm text-slate-800">
                <input
                  type="checkbox"
                  checked={passwordOptions.includeUppercase}
                  onChange={(event) =>
                    setBooleanPasswordOption("includeUppercase", event.target.checked)
                  }
                />
                Uppercase (A-Z)
              </label>
              <label className="inline-flex items-center gap-2 text-sm text-slate-800">
                <input
                  type="checkbox"
                  checked={passwordOptions.includeLowercase}
                  onChange={(event) =>
                    setBooleanPasswordOption("includeLowercase", event.target.checked)
                  }
                />
                Lowercase (a-z)
              </label>
              <label className="inline-flex items-center gap-2 text-sm text-slate-800">
                <input
                  type="checkbox"
                  checked={passwordOptions.includeNumbers}
                  onChange={(event) =>
                    setBooleanPasswordOption("includeNumbers", event.target.checked)
                  }
                />
                Numbers (0-9)
              </label>
              <label className="inline-flex items-center gap-2 text-sm text-slate-800">
                <input
                  type="checkbox"
                  checked={passwordOptions.includeSymbols}
                  onChange={(event) =>
                    setBooleanPasswordOption("includeSymbols", event.target.checked)
                  }
                />
                Symbols (!@#...)
              </label>
            </div>
          </div>
        ) : null}

        <div className="grid gap-4 lg:grid-cols-2">
          {needsInput(slug) ? (
            <article className="space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-4">
              <h3 className="text-sm font-semibold uppercase tracking-[0.1em] text-slate-700">
                Input Area
              </h3>
              <textarea
                value={input}
                onChange={(event) => setInput(event.target.value)}
                className="min-h-44 w-full resize-y rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-emerald-300 transition focus:ring-2"
                placeholder={getInputPlaceholder(slug)}
              />
            </article>
          ) : (
            <article className="space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-4">
              <h3 className="text-sm font-semibold uppercase tracking-[0.1em] text-slate-700">
                Input Area
              </h3>
              <p className="rounded-lg border border-dashed border-slate-300 bg-white px-3 py-2 text-sm leading-6 text-slate-600">
                {slug === "uuid-generator"
                  ? "No text input needed. Set count and click generate."
                  : "No text input needed. Set password options and click generate."}
              </p>
            </article>
          )}

          <article className="space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <h3 className="text-sm font-semibold uppercase tracking-[0.1em] text-slate-700">
              Output Area
            </h3>
            <textarea
              value={output}
              readOnly
              className="min-h-44 w-full resize-y rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm leading-6 text-slate-900"
              placeholder="Your result will appear here..."
            />
          </article>
        </div>

        {error ? (
          <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        ) : null}

        {copyMessage ? (
          <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
            {copyMessage}
          </p>
        ) : null}
      </section>

      <section className="space-y-3 rounded-2xl border border-slate-200 bg-white/95 p-6 shadow-sm">
        <h2 className="text-xl font-bold tracking-tight text-slate-900">
          Action Buttons
        </h2>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleRun}
            className="rounded-xl bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800"
          >
            {primaryButtonLabel}
          </button>
          <button
            type="button"
            onClick={handleCopy}
            className="rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-emerald-300 hover:text-emerald-800"
          >
            Copy Output
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-emerald-300 hover:text-emerald-800"
          >
            Reset/Clear
          </button>
        </div>
      </section>
    </>
  );
}
