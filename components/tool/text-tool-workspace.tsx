"use client";

import { useState } from "react";
import {
  runTextTool,
  type CaseMode,
  type TextToolSlug,
} from "@/lib/tools/text-tools";

interface TextToolWorkspaceProps {
  slug: TextToolSlug;
  toolName: string;
}

const CASE_MODES: Array<{ label: string; value: CaseMode }> = [
  { label: "UPPERCASE", value: "uppercase" },
  { label: "lowercase", value: "lowercase" },
  { label: "Title Case", value: "titlecase" },
  { label: "Sentence case", value: "sentencecase" },
];

function getPrimaryButtonLabel(slug: TextToolSlug, toolName: string): string {
  switch (slug) {
    case "word-counter":
      return "Count Words";
    case "character-counter":
      return "Count Characters";
    case "case-converter":
      return "Convert Case";
    case "remove-extra-spaces":
      return "Remove Spaces";
    default:
      return `Run ${toolName}`;
  }
}

export function TextToolWorkspace({ slug, toolName }: TextToolWorkspaceProps) {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [copyMessage, setCopyMessage] = useState("");
  const [caseMode, setCaseMode] = useState<CaseMode>("uppercase");

  const hasOutput = output.trim().length > 0;
  const primaryButtonLabel = getPrimaryButtonLabel(slug, toolName);

  function handleRun(): void {
    setCopyMessage("");

    if (input.trim().length === 0) {
      setError("Please enter some text first.");
      setOutput("");
      return;
    }

    const result = runTextTool({ slug, input, caseMode });
    setOutput(result);
    setError("");
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
    setCaseMode("uppercase");
  }

  return (
    <>
      <section className="space-y-4 rounded-2xl border border-slate-200 bg-white/95 p-6 shadow-sm">
        <h2 className="text-xl font-bold tracking-tight text-slate-900">
          Input Area and Output Area
        </h2>

        {slug === "case-converter" ? (
          <div className="flex flex-wrap gap-2">
            {CASE_MODES.map((mode) => {
              const isActive = caseMode === mode.value;

              return (
                <button
                  key={mode.value}
                  type="button"
                  onClick={() => setCaseMode(mode.value)}
                  className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                    isActive
                      ? "border-emerald-300 bg-emerald-100 text-emerald-900"
                      : "border-slate-300 bg-white text-slate-700 hover:border-emerald-300 hover:text-emerald-800"
                  }`}
                >
                  {mode.label}
                </button>
              );
            })}
          </div>
        ) : null}

        <div className="grid gap-4 lg:grid-cols-2">
          <article className="space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <h3 className="text-sm font-semibold uppercase tracking-[0.1em] text-slate-700">
              Input Area
            </h3>
            <textarea
              value={input}
              onChange={(event) => setInput(event.target.value)}
              className="min-h-44 w-full resize-y rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-emerald-300 transition focus:ring-2"
              placeholder={`Enter your ${toolName} input here...`}
            />
          </article>

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
