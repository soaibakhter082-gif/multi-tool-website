"use client";

import { useState } from "react";
import QRCode from "qrcode";
import {
  buildMetaTags,
  buildRobotsText,
  type SeoToolSlug,
} from "@/lib/tools/seo-tools";

interface SeoToolWorkspaceProps {
  slug: SeoToolSlug;
  toolName: string;
}

function getPrimaryButtonLabel(slug: SeoToolSlug, toolName: string): string {
  switch (slug) {
    case "meta-tag-generator":
      return "Generate Meta Tags";
    case "robots-txt-generator":
      return "Generate Robots.txt";
    case "qr-code-generator":
      return "Generate QR Code";
    default:
      return `Run ${toolName}`;
  }
}

export function SeoToolWorkspace({ slug, toolName }: SeoToolWorkspaceProps) {
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [copyMessage, setCopyMessage] = useState("");

  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [metaKeywords, setMetaKeywords] = useState("");
  const [metaCanonicalUrl, setMetaCanonicalUrl] = useState("");
  const [metaRobots, setMetaRobots] = useState("index, follow");

  const [robotsUserAgent, setRobotsUserAgent] = useState("*");
  const [robotsAllowPaths, setRobotsAllowPaths] = useState("/");
  const [robotsDisallowPaths, setRobotsDisallowPaths] = useState("/private");
  const [robotsSitemapUrl, setRobotsSitemapUrl] = useState("");

  const [qrInput, setQrInput] = useState("");
  const [qrSize, setQrSize] = useState("240");
  const [qrDataUrl, setQrDataUrl] = useState("");

  const hasOutput = output.trim().length > 0;
  const primaryButtonLabel = getPrimaryButtonLabel(slug, toolName);

  function clearMessages(): void {
    setError("");
    setCopyMessage("");
  }

  async function handleRun(): Promise<void> {
    clearMessages();

    try {
      if (slug === "meta-tag-generator") {
        const result = buildMetaTags({
          title: metaTitle,
          description: metaDescription,
          keywords: metaKeywords,
          canonicalUrl: metaCanonicalUrl,
          robotsValue: metaRobots,
        });
        setOutput(result);
        return;
      }

      if (slug === "robots-txt-generator") {
        const result = buildRobotsText({
          userAgent: robotsUserAgent,
          allowPaths: robotsAllowPaths,
          disallowPaths: robotsDisallowPaths,
          sitemapUrl: robotsSitemapUrl,
        });
        setOutput(result);
        return;
      }

      if (slug === "qr-code-generator") {
        if (qrInput.trim().length === 0) {
          throw new Error("Please enter text or URL for QR code.");
        }

        const size = Number(qrSize);
        if (!Number.isFinite(size) || size < 80 || size > 1200) {
          throw new Error("QR size should be between 80 and 1200.");
        }

        const generatedDataUrl = await QRCode.toDataURL(qrInput, {
          width: size,
          margin: 1,
        });

        setQrDataUrl(generatedDataUrl);
        setOutput(
          [
            "QR code generated successfully.",
            `Content: ${qrInput}`,
            `Size: ${size}px`,
          ].join("\n")
        );
      }
    } catch (caughtError) {
      const message =
        caughtError instanceof Error
          ? caughtError.message
          : "Something went wrong. Please check your input.";
      setError(message);
      setOutput("");

      if (slug === "qr-code-generator") {
        setQrDataUrl("");
      }
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
    setOutput("");
    setError("");
    setCopyMessage("");

    setMetaTitle("");
    setMetaDescription("");
    setMetaKeywords("");
    setMetaCanonicalUrl("");
    setMetaRobots("index, follow");

    setRobotsUserAgent("*");
    setRobotsAllowPaths("/");
    setRobotsDisallowPaths("/private");
    setRobotsSitemapUrl("");

    setQrInput("");
    setQrSize("240");
    setQrDataUrl("");
  }

  function handleDownloadQr(): void {
    if (!qrDataUrl) {
      setError("Generate a QR code first, then download.");
      return;
    }

    const link = document.createElement("a");
    link.href = qrDataUrl;
    link.download = "toolloom-qr-code.png";
    link.click();
  }

  return (
    <>
      <section className="space-y-4 rounded-2xl border border-slate-200 bg-white/95 p-6 shadow-sm">
        <h2 className="text-xl font-bold tracking-tight text-slate-900">
          Input Area and Output Area
        </h2>

        {slug === "meta-tag-generator" ? (
          <div className="grid gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="text-sm font-semibold text-slate-800" htmlFor="meta-title">
                Page title
              </label>
              <input
                id="meta-title"
                type="text"
                value={metaTitle}
                onChange={(event) => setMetaTitle(event.target.value)}
                className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-emerald-300 transition focus:ring-2"
                placeholder="Example: Best Free Online Tools"
              />
            </div>
            <div className="sm:col-span-2">
              <label
                className="text-sm font-semibold text-slate-800"
                htmlFor="meta-description"
              >
                Meta description
              </label>
              <textarea
                id="meta-description"
                value={metaDescription}
                onChange={(event) => setMetaDescription(event.target.value)}
                className="mt-2 min-h-24 w-full resize-y rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-emerald-300 transition focus:ring-2"
                placeholder="Short summary for search results..."
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-800" htmlFor="meta-keywords">
                Keywords (comma separated)
              </label>
              <input
                id="meta-keywords"
                type="text"
                value={metaKeywords}
                onChange={(event) => setMetaKeywords(event.target.value)}
                className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-emerald-300 transition focus:ring-2"
                placeholder="tools, free tools, calculator"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-800" htmlFor="meta-robots">
                Robots value
              </label>
              <input
                id="meta-robots"
                type="text"
                value={metaRobots}
                onChange={(event) => setMetaRobots(event.target.value)}
                className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-emerald-300 transition focus:ring-2"
                placeholder="index, follow"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="text-sm font-semibold text-slate-800" htmlFor="meta-canonical">
                Canonical URL (optional)
              </label>
              <input
                id="meta-canonical"
                type="url"
                value={metaCanonicalUrl}
                onChange={(event) => setMetaCanonicalUrl(event.target.value)}
                className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-emerald-300 transition focus:ring-2"
                placeholder="https://example.com/page-url"
              />
            </div>
          </div>
        ) : null}

        {slug === "robots-txt-generator" ? (
          <div className="grid gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="text-sm font-semibold text-slate-800" htmlFor="robots-user-agent">
                User-agent
              </label>
              <input
                id="robots-user-agent"
                type="text"
                value={robotsUserAgent}
                onChange={(event) => setRobotsUserAgent(event.target.value)}
                className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-emerald-300 transition focus:ring-2 sm:max-w-[260px]"
                placeholder="*"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-800" htmlFor="robots-allow">
                Allow paths (comma or new line)
              </label>
              <textarea
                id="robots-allow"
                value={robotsAllowPaths}
                onChange={(event) => setRobotsAllowPaths(event.target.value)}
                className="mt-2 min-h-24 w-full resize-y rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-emerald-300 transition focus:ring-2"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-800" htmlFor="robots-disallow">
                Disallow paths (comma or new line)
              </label>
              <textarea
                id="robots-disallow"
                value={robotsDisallowPaths}
                onChange={(event) => setRobotsDisallowPaths(event.target.value)}
                className="mt-2 min-h-24 w-full resize-y rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-emerald-300 transition focus:ring-2"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="text-sm font-semibold text-slate-800" htmlFor="robots-sitemap">
                Sitemap URL (optional)
              </label>
              <input
                id="robots-sitemap"
                type="url"
                value={robotsSitemapUrl}
                onChange={(event) => setRobotsSitemapUrl(event.target.value)}
                className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-emerald-300 transition focus:ring-2"
                placeholder="https://example.com/sitemap.xml"
              />
            </div>
          </div>
        ) : null}

        {slug === "qr-code-generator" ? (
          <div className="space-y-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div>
              <label className="text-sm font-semibold text-slate-800" htmlFor="qr-input">
                Text or URL
              </label>
              <textarea
                id="qr-input"
                value={qrInput}
                onChange={(event) => setQrInput(event.target.value)}
                className="mt-2 min-h-24 w-full resize-y rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-emerald-300 transition focus:ring-2"
                placeholder="https://example.com"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-800" htmlFor="qr-size">
                QR size in pixels (80 to 1200)
              </label>
              <input
                id="qr-size"
                type="number"
                min={80}
                max={1200}
                value={qrSize}
                onChange={(event) => setQrSize(event.target.value)}
                className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-emerald-300 transition focus:ring-2 sm:max-w-[220px]"
              />
            </div>
            {qrDataUrl ? (
              <div className="rounded-lg border border-slate-200 bg-white p-4">
                <p className="mb-3 text-sm font-semibold text-slate-800">QR preview</p>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={qrDataUrl}
                  alt="Generated QR code"
                  className="h-auto max-w-full rounded-md"
                />
              </div>
            ) : null}
          </div>
        ) : null}

        <article className="space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-4">
          <h3 className="text-sm font-semibold uppercase tracking-[0.1em] text-slate-700">
            Output Area
          </h3>
          <textarea
            value={output}
            readOnly
            className="min-h-40 w-full resize-y rounded-lg border border-slate-300 bg-white px-3 py-2 font-mono text-xs leading-6 text-slate-900"
            placeholder="Your result will appear here..."
          />
        </article>

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
          {slug === "qr-code-generator" ? (
            <button
              type="button"
              onClick={handleDownloadQr}
              className="rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-emerald-300 hover:text-emerald-800"
            >
              Download QR PNG
            </button>
          ) : null}
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
