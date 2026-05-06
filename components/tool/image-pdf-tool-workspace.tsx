"use client";

import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { PDFDocument } from "pdf-lib";
import {
  formatBytes,
  parseColorFromHex,
  parsePdfPageSelection,
  readFileAsArrayBuffer,
  readFileAsDataUrl,
  type ImagePdfToolSlug,
} from "@/lib/tools/image-pdf-tools";

interface ImagePdfToolWorkspaceProps {
  slug: ImagePdfToolSlug;
  toolName: string;
}

interface GeneratedFileState {
  url: string;
  name: string;
  size: number;
}

function getPrimaryButtonLabel(slug: ImagePdfToolSlug, toolName: string): string {
  switch (slug) {
    case "color-picker":
      return "Get Color Codes";
    case "image-resizer":
      return "Resize Image";
    case "image-compressor":
      return "Compress Image";
    case "image-to-pdf":
      return "Convert to PDF";
    case "pdf-merge":
      return "Merge PDFs";
    case "pdf-split":
      return "Split PDF";
    default:
      return `Run ${toolName}`;
  }
}

function stripFileExtension(fileName: string): string {
  return fileName.replace(/\.[^.]+$/, "");
}

function safePreviewUrl(file: File): string {
  return URL.createObjectURL(file);
}

function getOutputImageType(inputFile: File): "image/png" | "image/jpeg" {
  return inputFile.type === "image/png" ? "image/png" : "image/jpeg";
}

function loadImageElement(dataUrl: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Failed to load image file."));
    image.src = dataUrl;
  });
}

async function canvasToBlob(
  canvas: HTMLCanvasElement,
  mimeType: "image/png" | "image/jpeg",
  quality?: number
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Failed to create output image."));
          return;
        }
        resolve(blob);
      },
      mimeType,
      quality
    );
  });
}

function parsePositiveInteger(value: string): number {
  const parsed = Number.parseInt(value, 10);

  if (!Number.isInteger(parsed) || parsed <= 0) {
    return 0;
  }

  return parsed;
}

function parseNumber(value: string): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : Number.NaN;
}

function bytesToBlob(bytes: Uint8Array, mimeType: string): Blob {
  const arrayBuffer = new ArrayBuffer(bytes.byteLength);
  new Uint8Array(arrayBuffer).set(bytes);
  return new Blob([arrayBuffer], { type: mimeType });
}

function ensureImageFile(file: File | null, message: string): File {
  if (!file) {
    throw new Error(message);
  }
  return file;
}

export function ImagePdfToolWorkspace({
  slug,
  toolName,
}: ImagePdfToolWorkspaceProps) {
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [copyMessage, setCopyMessage] = useState("");
  const [generatedFile, setGeneratedFile] = useState<GeneratedFileState | null>(
    null
  );

  const [colorHex, setColorHex] = useState("#22C55E");

  const [resizerFile, setResizerFile] = useState<File | null>(null);
  const [resizerInputKey, setResizerInputKey] = useState(0);
  const [resizerSourcePreviewUrl, setResizerSourcePreviewUrl] = useState("");
  const [resizerResultPreviewUrl, setResizerResultPreviewUrl] = useState("");
  const [resizeWidth, setResizeWidth] = useState("");
  const [resizeHeight, setResizeHeight] = useState("");
  const [keepAspectRatio, setKeepAspectRatio] = useState(true);

  const [compressorFile, setCompressorFile] = useState<File | null>(null);
  const [compressorInputKey, setCompressorInputKey] = useState(0);
  const [compressorSourcePreviewUrl, setCompressorSourcePreviewUrl] = useState("");
  const [compressorResultPreviewUrl, setCompressorResultPreviewUrl] = useState("");
  const [compressorMaxWidth, setCompressorMaxWidth] = useState("1920");
  const [compressorQuality, setCompressorQuality] = useState("0.75");

  const [imageToPdfFiles, setImageToPdfFiles] = useState<File[]>([]);
  const [imageToPdfInputKey, setImageToPdfInputKey] = useState(0);

  const [pdfMergeFiles, setPdfMergeFiles] = useState<File[]>([]);
  const [pdfMergeInputKey, setPdfMergeInputKey] = useState(0);

  const [pdfSplitFile, setPdfSplitFile] = useState<File | null>(null);
  const [pdfSplitInputKey, setPdfSplitInputKey] = useState(0);
  const [pdfSplitPages, setPdfSplitPages] = useState("1");

  const hasOutput = output.trim().length > 0;
  const primaryButtonLabel = getPrimaryButtonLabel(slug, toolName);

  useEffect(() => {
    return () => {
      if (generatedFile?.url) {
        URL.revokeObjectURL(generatedFile.url);
      }
      if (resizerSourcePreviewUrl) {
        URL.revokeObjectURL(resizerSourcePreviewUrl);
      }
      if (resizerResultPreviewUrl) {
        URL.revokeObjectURL(resizerResultPreviewUrl);
      }
      if (compressorSourcePreviewUrl) {
        URL.revokeObjectURL(compressorSourcePreviewUrl);
      }
      if (compressorResultPreviewUrl) {
        URL.revokeObjectURL(compressorResultPreviewUrl);
      }
    };
  }, [
    generatedFile?.url,
    resizerSourcePreviewUrl,
    resizerResultPreviewUrl,
    compressorSourcePreviewUrl,
    compressorResultPreviewUrl,
  ]);

  function clearMessages(): void {
    setError("");
    setCopyMessage("");
  }

  function setGeneratedBlob(blob: Blob, fileName: string): void {
    setGeneratedFile((previous) => {
      if (previous?.url) {
        URL.revokeObjectURL(previous.url);
      }

      return {
        url: URL.createObjectURL(blob),
        name: fileName,
        size: blob.size,
      };
    });
  }

  function clearGeneratedBlob(): void {
    setGeneratedFile((previous) => {
      if (previous?.url) {
        URL.revokeObjectURL(previous.url);
      }
      return null;
    });
  }

  function replacePreview(
    setPreview: Dispatch<SetStateAction<string>>,
    nextUrl: string
  ): void {
    setPreview((previous) => {
      if (previous) {
        URL.revokeObjectURL(previous);
      }
      return nextUrl;
    });
  }

  function clearPreview(setPreview: Dispatch<SetStateAction<string>>): void {
    setPreview((previous) => {
      if (previous) {
        URL.revokeObjectURL(previous);
      }
      return "";
    });
  }

  async function runColorPicker(): Promise<void> {
    const color = parseColorFromHex(colorHex);

    setOutput(
      [
        `HEX: ${color.hex}`,
        `RGB: rgb(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b})`,
        `HSL: hsl(${color.hsl.h}, ${color.hsl.s}%, ${color.hsl.l}%)`,
        `CSS variable: --brand-color: ${color.hex};`,
      ].join("\n")
    );
    clearGeneratedBlob();
  }

  async function runImageResizer(): Promise<void> {
    const inputFile = ensureImageFile(
      resizerFile,
      "Please upload an image file first."
    );
    const dataUrl = await readFileAsDataUrl(inputFile);
    const image = await loadImageElement(dataUrl);
    const originalWidth = image.width;
    const originalHeight = image.height;

    const requestedWidth = parsePositiveInteger(resizeWidth);
    const requestedHeight = parsePositiveInteger(resizeHeight);

    let targetWidth = originalWidth;
    let targetHeight = originalHeight;

    if (keepAspectRatio) {
      if (requestedWidth > 0) {
        targetWidth = requestedWidth;
        targetHeight = Math.max(
          1,
          Math.round((originalHeight / originalWidth) * targetWidth)
        );
      } else if (requestedHeight > 0) {
        targetHeight = requestedHeight;
        targetWidth = Math.max(
          1,
          Math.round((originalWidth / originalHeight) * targetHeight)
        );
      }
    } else {
      if (requestedWidth > 0) {
        targetWidth = requestedWidth;
      }
      if (requestedHeight > 0) {
        targetHeight = requestedHeight;
      }
    }

    if (targetWidth > 10000 || targetHeight > 10000) {
      throw new Error("Please keep width and height below 10000 pixels.");
    }

    const canvas = document.createElement("canvas");
    canvas.width = targetWidth;
    canvas.height = targetHeight;

    const context = canvas.getContext("2d");
    if (!context) {
      throw new Error("Canvas is not supported in this browser.");
    }

    context.drawImage(image, 0, 0, targetWidth, targetHeight);

    const mimeType = getOutputImageType(inputFile);
    const outputBlob = await canvasToBlob(canvas, mimeType, 0.92);
    replacePreview(
      setResizerResultPreviewUrl,
      URL.createObjectURL(outputBlob)
    );

    const outputExtension = mimeType === "image/png" ? "png" : "jpg";
    const outputName = `${stripFileExtension(inputFile.name)}-resized.${outputExtension}`;
    setGeneratedBlob(outputBlob, outputName);

    setOutput(
      [
        `Original: ${originalWidth}x${originalHeight} (${formatBytes(inputFile.size)})`,
        `Resized: ${targetWidth}x${targetHeight} (${formatBytes(outputBlob.size)})`,
        `Output file: ${outputName}`,
      ].join("\n")
    );
  }

  async function runImageCompressor(): Promise<void> {
    const inputFile = ensureImageFile(
      compressorFile,
      "Please upload an image file first."
    );
    const quality = parseNumber(compressorQuality);
    if (!Number.isFinite(quality) || quality <= 0 || quality > 1) {
      throw new Error("Quality should be between 0.1 and 1.");
    }

    const maxWidth = parsePositiveInteger(compressorMaxWidth);
    const dataUrl = await readFileAsDataUrl(inputFile);
    const image = await loadImageElement(dataUrl);

    const originalWidth = image.width;
    const originalHeight = image.height;

    const targetWidth =
      maxWidth > 0 ? Math.min(maxWidth, originalWidth) : originalWidth;
    const targetHeight = Math.max(
      1,
      Math.round((originalHeight / originalWidth) * targetWidth)
    );

    const canvas = document.createElement("canvas");
    canvas.width = targetWidth;
    canvas.height = targetHeight;

    const context = canvas.getContext("2d");
    if (!context) {
      throw new Error("Canvas is not supported in this browser.");
    }

    context.drawImage(image, 0, 0, targetWidth, targetHeight);

    const mimeType = getOutputImageType(inputFile);
    const outputBlob = await canvasToBlob(canvas, mimeType, quality);
    replacePreview(
      setCompressorResultPreviewUrl,
      URL.createObjectURL(outputBlob)
    );

    const outputExtension = mimeType === "image/png" ? "png" : "jpg";
    const outputName = `${stripFileExtension(inputFile.name)}-compressed.${outputExtension}`;
    setGeneratedBlob(outputBlob, outputName);

    const savedBytes = Math.max(0, inputFile.size - outputBlob.size);
    const savedPercent = inputFile.size
      ? ((savedBytes / inputFile.size) * 100).toFixed(2)
      : "0.00";

    setOutput(
      [
        `Original: ${originalWidth}x${originalHeight} (${formatBytes(inputFile.size)})`,
        `Compressed: ${targetWidth}x${targetHeight} (${formatBytes(outputBlob.size)})`,
        `Saved: ${formatBytes(savedBytes)} (${savedPercent}%)`,
        `Output file: ${outputName}`,
      ].join("\n")
    );
  }

  async function runImageToPdf(): Promise<void> {
    if (imageToPdfFiles.length === 0) {
      throw new Error("Please upload one or more images first.");
    }

    const pdfDocument = await PDFDocument.create();

    for (const imageFile of imageToPdfFiles) {
      const imageBytes = await readFileAsArrayBuffer(imageFile);
      const contentType = imageFile.type.toLowerCase();
      const embeddedImage =
        contentType === "image/png"
          ? await pdfDocument.embedPng(imageBytes)
          : await pdfDocument.embedJpg(imageBytes);

      const page = pdfDocument.addPage([
        embeddedImage.width,
        embeddedImage.height,
      ]);

      page.drawImage(embeddedImage, {
        x: 0,
        y: 0,
        width: embeddedImage.width,
        height: embeddedImage.height,
      });
    }

    const pdfBytes = await pdfDocument.save();
    const pdfBlob = bytesToBlob(pdfBytes, "application/pdf");
    const fileName = "images-to-pdf.pdf";
    setGeneratedBlob(pdfBlob, fileName);

    const inputSize = imageToPdfFiles.reduce((total, file) => total + file.size, 0);
    setOutput(
      [
        `Input images: ${imageToPdfFiles.length}`,
        `Input size: ${formatBytes(inputSize)}`,
        `PDF size: ${formatBytes(pdfBlob.size)}`,
        `Output file: ${fileName}`,
      ].join("\n")
    );
  }

  async function runPdfMerge(): Promise<void> {
    if (pdfMergeFiles.length < 2) {
      throw new Error("Please upload at least two PDF files to merge.");
    }

    const mergedPdf = await PDFDocument.create();
    let totalPages = 0;

    for (const pdfFile of pdfMergeFiles) {
      const pdfBytes = await readFileAsArrayBuffer(pdfFile);
      const sourcePdf = await PDFDocument.load(pdfBytes);
      const pageIndices = sourcePdf.getPageIndices();
      const copiedPages = await mergedPdf.copyPages(sourcePdf, pageIndices);
      copiedPages.forEach((page) => mergedPdf.addPage(page));
      totalPages += pageIndices.length;
    }

    const mergedBytes = await mergedPdf.save();
    const mergedBlob = bytesToBlob(mergedBytes, "application/pdf");
    const fileName = "merged.pdf";
    setGeneratedBlob(mergedBlob, fileName);

    setOutput(
      [
        `Input PDFs: ${pdfMergeFiles.length}`,
        `Total pages merged: ${totalPages}`,
        `Output size: ${formatBytes(mergedBlob.size)}`,
        `Output file: ${fileName}`,
      ].join("\n")
    );
  }

  async function runPdfSplit(): Promise<void> {
    if (!pdfSplitFile) {
      throw new Error("Please upload one PDF file first.");
    }

    const sourceBytes = await readFileAsArrayBuffer(pdfSplitFile);
    const sourcePdf = await PDFDocument.load(sourceBytes);
    const totalPages = sourcePdf.getPageCount();

    const selectedPageIndices = parsePdfPageSelection(pdfSplitPages, totalPages);
    const splitPdf = await PDFDocument.create();
    const copiedPages = await splitPdf.copyPages(sourcePdf, selectedPageIndices);
    copiedPages.forEach((page) => splitPdf.addPage(page));

    const splitBytes = await splitPdf.save();
    const splitBlob = bytesToBlob(splitBytes, "application/pdf");
    const fileName = `${stripFileExtension(pdfSplitFile.name)}-split.pdf`;
    setGeneratedBlob(splitBlob, fileName);

    const selectedDisplay = selectedPageIndices
      .map((index) => String(index + 1))
      .join(", ");
    setOutput(
      [
        `Original pages: ${totalPages}`,
        `Selected pages: ${selectedDisplay}`,
        `Output size: ${formatBytes(splitBlob.size)}`,
        `Output file: ${fileName}`,
      ].join("\n")
    );
  }

  async function handleRun(): Promise<void> {
    clearMessages();

    try {
      if (slug === "color-picker") {
        await runColorPicker();
        return;
      }

      if (slug === "image-resizer") {
        await runImageResizer();
        return;
      }

      if (slug === "image-compressor") {
        await runImageCompressor();
        return;
      }

      if (slug === "image-to-pdf") {
        await runImageToPdf();
        return;
      }

      if (slug === "pdf-merge") {
        await runPdfMerge();
        return;
      }

      if (slug === "pdf-split") {
        await runPdfSplit();
      }
    } catch (caughtError) {
      const message =
        caughtError instanceof Error
          ? caughtError.message
          : "Something went wrong. Please check your input.";
      setError(message);
      setOutput("");
      clearGeneratedBlob();
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

  function handleDownload(): void {
    if (!generatedFile) {
      setError("Please generate a result file first, then download.");
      return;
    }

    const link = document.createElement("a");
    link.href = generatedFile.url;
    link.download = generatedFile.name;
    link.click();
  }

  function handleReset(): void {
    setOutput("");
    setError("");
    setCopyMessage("");
    clearGeneratedBlob();

    setColorHex("#22C55E");

    setResizerFile(null);
    clearPreview(setResizerSourcePreviewUrl);
    clearPreview(setResizerResultPreviewUrl);
    setResizeWidth("");
    setResizeHeight("");
    setKeepAspectRatio(true);
    setResizerInputKey((previous) => previous + 1);

    setCompressorFile(null);
    clearPreview(setCompressorSourcePreviewUrl);
    clearPreview(setCompressorResultPreviewUrl);
    setCompressorMaxWidth("1920");
    setCompressorQuality("0.75");
    setCompressorInputKey((previous) => previous + 1);

    setImageToPdfFiles([]);
    setImageToPdfInputKey((previous) => previous + 1);

    setPdfMergeFiles([]);
    setPdfMergeInputKey((previous) => previous + 1);

    setPdfSplitFile(null);
    setPdfSplitPages("1");
    setPdfSplitInputKey((previous) => previous + 1);
  }

  return (
    <>
      <section className="space-y-4 rounded-2xl border border-slate-200 bg-white/95 p-6 shadow-sm">
        <h2 className="text-xl font-bold tracking-tight text-slate-900">
          Input Area and Output Area
        </h2>

        {slug === "color-picker" ? (
          <div className="space-y-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex flex-wrap items-center gap-3">
              <input
                type="color"
                value={colorHex}
                onChange={(event) => setColorHex(event.target.value)}
                className="h-12 w-20 cursor-pointer rounded border border-slate-300 bg-white"
                aria-label="Pick color"
              />
              <input
                type="text"
                value={colorHex}
                onChange={(event) => setColorHex(event.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-emerald-300 transition focus:ring-2 sm:max-w-[240px]"
                placeholder="#22C55E"
              />
            </div>
            <p className="text-sm text-slate-700">
              Choose a color and click the action button to get HEX, RGB, and HSL
              values.
            </p>
          </div>
        ) : null}

        {slug === "image-resizer" ? (
          <div className="space-y-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div>
              <label className="text-sm font-semibold text-slate-800" htmlFor="resizer-file">
                Upload image
              </label>
              <input
                key={resizerInputKey}
                id="resizer-file"
                type="file"
                accept="image/png,image/jpeg,image/jpg"
                onChange={(event) => {
                  const file = event.target.files?.[0] ?? null;
                  setResizerFile(file);
                  clearPreview(setResizerResultPreviewUrl);

                  if (file) {
                    replacePreview(
                      setResizerSourcePreviewUrl,
                      safePreviewUrl(file)
                    );
                    return;
                  }

                  clearPreview(setResizerSourcePreviewUrl);
                }}
                className="mt-2 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-sm font-semibold text-slate-800" htmlFor="resize-width">
                  Width (px, optional)
                </label>
                <input
                  id="resize-width"
                  type="number"
                  min={1}
                  value={resizeWidth}
                  onChange={(event) => setResizeWidth(event.target.value)}
                  className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-emerald-300 transition focus:ring-2"
                  placeholder="Example: 800"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-800" htmlFor="resize-height">
                  Height (px, optional)
                </label>
                <input
                  id="resize-height"
                  type="number"
                  min={1}
                  value={resizeHeight}
                  onChange={(event) => setResizeHeight(event.target.value)}
                  className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-emerald-300 transition focus:ring-2"
                  placeholder="Example: 600"
                />
              </div>
            </div>

            <label className="inline-flex items-center gap-2 text-sm text-slate-800">
              <input
                type="checkbox"
                checked={keepAspectRatio}
                onChange={(event) => setKeepAspectRatio(event.target.checked)}
              />
              Keep original ratio
            </label>

            <div className="grid gap-4 sm:grid-cols-2">
              {resizerSourcePreviewUrl ? (
                <div className="rounded-lg border border-slate-200 bg-white p-3">
                  <p className="mb-2 text-sm font-semibold text-slate-800">Original preview</p>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={resizerSourcePreviewUrl}
                    alt="Original upload preview"
                    className="h-auto max-w-full rounded"
                  />
                </div>
              ) : null}

              {resizerResultPreviewUrl ? (
                <div className="rounded-lg border border-slate-200 bg-white p-3">
                  <p className="mb-2 text-sm font-semibold text-slate-800">Resized preview</p>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={resizerResultPreviewUrl}
                    alt="Resized preview"
                    className="h-auto max-w-full rounded"
                  />
                </div>
              ) : null}
            </div>
          </div>
        ) : null}

        {slug === "image-compressor" ? (
          <div className="space-y-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div>
              <label
                className="text-sm font-semibold text-slate-800"
                htmlFor="compressor-file"
              >
                Upload image
              </label>
              <input
                key={compressorInputKey}
                id="compressor-file"
                type="file"
                accept="image/png,image/jpeg,image/jpg"
                onChange={(event) => {
                  const file = event.target.files?.[0] ?? null;
                  setCompressorFile(file);
                  clearPreview(setCompressorResultPreviewUrl);

                  if (file) {
                    replacePreview(
                      setCompressorSourcePreviewUrl,
                      safePreviewUrl(file)
                    );
                    return;
                  }

                  clearPreview(setCompressorSourcePreviewUrl);
                }}
                className="mt-2 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label
                  className="text-sm font-semibold text-slate-800"
                  htmlFor="compressor-quality"
                >
                  Quality (0.1 to 1)
                </label>
                <input
                  id="compressor-quality"
                  type="number"
                  min={0.1}
                  max={1}
                  step={0.05}
                  value={compressorQuality}
                  onChange={(event) => setCompressorQuality(event.target.value)}
                  className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-emerald-300 transition focus:ring-2"
                />
              </div>
              <div>
                <label
                  className="text-sm font-semibold text-slate-800"
                  htmlFor="compressor-max-width"
                >
                  Max width (px)
                </label>
                <input
                  id="compressor-max-width"
                  type="number"
                  min={1}
                  step={1}
                  value={compressorMaxWidth}
                  onChange={(event) => setCompressorMaxWidth(event.target.value)}
                  className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-emerald-300 transition focus:ring-2"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {compressorSourcePreviewUrl ? (
                <div className="rounded-lg border border-slate-200 bg-white p-3">
                  <p className="mb-2 text-sm font-semibold text-slate-800">Original preview</p>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={compressorSourcePreviewUrl}
                    alt="Compressor source preview"
                    className="h-auto max-w-full rounded"
                  />
                </div>
              ) : null}

              {compressorResultPreviewUrl ? (
                <div className="rounded-lg border border-slate-200 bg-white p-3">
                  <p className="mb-2 text-sm font-semibold text-slate-800">
                    Compressed preview
                  </p>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={compressorResultPreviewUrl}
                    alt="Compressed preview"
                    className="h-auto max-w-full rounded"
                  />
                </div>
              ) : null}
            </div>
          </div>
        ) : null}

        {slug === "image-to-pdf" ? (
          <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <label className="text-sm font-semibold text-slate-800" htmlFor="image-to-pdf-files">
              Upload images (PNG or JPG)
            </label>
            <input
              key={imageToPdfInputKey}
              id="image-to-pdf-files"
              type="file"
              multiple
              accept="image/png,image/jpeg,image/jpg"
              onChange={(event) => {
                const files = Array.from(event.target.files ?? []);
                setImageToPdfFiles(files);
              }}
              className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900"
            />
            <p className="text-sm text-slate-700">
              Selected images: {imageToPdfFiles.length}
            </p>
          </div>
        ) : null}

        {slug === "pdf-merge" ? (
          <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <label className="text-sm font-semibold text-slate-800" htmlFor="pdf-merge-files">
              Upload PDF files (2 or more)
            </label>
            <input
              key={pdfMergeInputKey}
              id="pdf-merge-files"
              type="file"
              multiple
              accept="application/pdf,.pdf"
              onChange={(event) => {
                const files = Array.from(event.target.files ?? []);
                setPdfMergeFiles(files);
              }}
              className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900"
            />
            <p className="text-sm text-slate-700">
              Selected PDFs: {pdfMergeFiles.length}
            </p>
          </div>
        ) : null}

        {slug === "pdf-split" ? (
          <div className="space-y-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div>
              <label className="text-sm font-semibold text-slate-800" htmlFor="pdf-split-file">
                Upload one PDF file
              </label>
              <input
                key={pdfSplitInputKey}
                id="pdf-split-file"
                type="file"
                accept="application/pdf,.pdf"
                onChange={(event) => {
                  const file = event.target.files?.[0] ?? null;
                  setPdfSplitFile(file);
                }}
                className="mt-2 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-800" htmlFor="pdf-split-pages">
                Page numbers or ranges
              </label>
              <input
                id="pdf-split-pages"
                type="text"
                value={pdfSplitPages}
                onChange={(event) => setPdfSplitPages(event.target.value)}
                className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-emerald-300 transition focus:ring-2"
                placeholder="Example: 1,3-5"
              />
              <p className="mt-2 text-xs text-slate-600">
                Example: `1,3-5` means page 1 and pages 3 to 5.
              </p>
            </div>
          </div>
        ) : null}

        <article className="space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-4">
          <h3 className="text-sm font-semibold uppercase tracking-[0.1em] text-slate-700">
            Output Area
          </h3>
          <textarea
            value={output}
            readOnly
            className="min-h-40 w-full resize-y rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm leading-6 text-slate-900"
            placeholder="Your result will appear here..."
          />
          {generatedFile ? (
            <p className="text-xs text-slate-600">
              Ready to download: {generatedFile.name} ({formatBytes(generatedFile.size)})
            </p>
          ) : null}
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
            onClick={() => {
              void handleRun();
            }}
            className="rounded-xl bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800"
          >
            {primaryButtonLabel}
          </button>
          <button
            type="button"
            onClick={() => {
              void handleCopy();
            }}
            className="rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-emerald-300 hover:text-emerald-800"
          >
            Copy Output
          </button>
          <button
            type="button"
            onClick={handleDownload}
            className="rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-emerald-300 hover:text-emerald-800"
          >
            Download Result
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
