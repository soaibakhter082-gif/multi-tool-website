"use client";

import { useMemo, useState } from "react";
import {
  calculateAge,
  calculateBmi,
  calculateEmi,
  calculatePercentage,
  convertUnit,
  formatNumber,
  getUnitOptions,
  type CalculatorToolSlug,
  type PercentageMode,
  type UnitCategory,
} from "@/lib/tools/calculator-tools";

interface CalculatorToolWorkspaceProps {
  slug: CalculatorToolSlug;
  toolName: string;
}

function getPrimaryButtonLabel(slug: CalculatorToolSlug, toolName: string): string {
  switch (slug) {
    case "age-calculator":
      return "Calculate Age";
    case "bmi-calculator":
      return "Calculate BMI";
    case "percentage-calculator":
      return "Calculate Percentage";
    case "emi-calculator":
      return "Calculate EMI";
    case "unit-converter":
      return "Convert Unit";
    default:
      return `Run ${toolName}`;
  }
}

export function CalculatorToolWorkspace({
  slug,
  toolName,
}: CalculatorToolWorkspaceProps) {
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [copyMessage, setCopyMessage] = useState("");

  const [dateOfBirth, setDateOfBirth] = useState("");
  const [bmiWeightKg, setBmiWeightKg] = useState("70");
  const [bmiHeightCm, setBmiHeightCm] = useState("170");
  const [percentageMode, setPercentageMode] = useState<PercentageMode>("percent-of");
  const [percentageFirst, setPercentageFirst] = useState("10");
  const [percentageSecond, setPercentageSecond] = useState("200");
  const [emiLoanAmount, setEmiLoanAmount] = useState("500000");
  const [emiAnnualRate, setEmiAnnualRate] = useState("8.5");
  const [emiTenureYears, setEmiTenureYears] = useState("5");
  const [unitCategory, setUnitCategory] = useState<UnitCategory>("length");
  const [unitValue, setUnitValue] = useState("100");
  const unitOptions = useMemo(() => getUnitOptions(unitCategory), [unitCategory]);
  const [unitFrom, setUnitFrom] = useState("m");
  const [unitTo, setUnitTo] = useState("km");

  const hasOutput = output.trim().length > 0;
  const primaryButtonLabel = getPrimaryButtonLabel(slug, toolName);

  function clearMessages(): void {
    setCopyMessage("");
    setError("");
  }

  function parseNumberInput(value: string, fieldLabel: string): number {
    const parsed = Number(value);

    if (!Number.isFinite(parsed)) {
      throw new Error(`Please enter a valid number for ${fieldLabel}.`);
    }

    return parsed;
  }

  function handleRun(): void {
    clearMessages();

    try {
      switch (slug) {
        case "age-calculator": {
          if (dateOfBirth.trim().length === 0) {
            throw new Error("Please select your date of birth.");
          }

          const result = calculateAge(dateOfBirth);
          setOutput(
            [
              `Age: ${result.years} years, ${result.months} months, ${result.days} days`,
              `Total days lived: ${result.totalDays}`,
            ].join("\n")
          );
          break;
        }

        case "bmi-calculator": {
          const weight = parseNumberInput(bmiWeightKg, "weight");
          const height = parseNumberInput(bmiHeightCm, "height");
          const result = calculateBmi(weight, height);
          setOutput(
            [
              `BMI: ${formatNumber(result.bmi)}`,
              `Category: ${result.category}`,
            ].join("\n")
          );
          break;
        }

        case "percentage-calculator": {
          const first = parseNumberInput(percentageFirst, "first value");
          const second = parseNumberInput(percentageSecond, "second value");
          const result = calculatePercentage(percentageMode, first, second);
          setOutput(`${result.message}\nResult value: ${formatNumber(result.value)}`);
          break;
        }

        case "emi-calculator": {
          const principal = parseNumberInput(emiLoanAmount, "loan amount");
          const annualRate = parseNumberInput(emiAnnualRate, "annual rate");
          const tenureYears = parseNumberInput(emiTenureYears, "tenure years");
          const result = calculateEmi(principal, annualRate, tenureYears);
          setOutput(
            [
              `Monthly EMI: ${formatNumber(result.monthlyEmi)}`,
              `Total Payment: ${formatNumber(result.totalPayment)}`,
              `Total Interest: ${formatNumber(result.totalInterest)}`,
            ].join("\n")
          );
          break;
        }

        case "unit-converter": {
          const value = parseNumberInput(unitValue, "value");
          const converted = convertUnit(unitCategory, value, unitFrom, unitTo);
          setOutput(
            `${formatNumber(value)} ${unitFrom} = ${formatNumber(converted, 6)} ${unitTo}`
          );
          break;
        }

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
    setOutput("");
    setError("");
    setCopyMessage("");

    setDateOfBirth("");
    setBmiWeightKg("70");
    setBmiHeightCm("170");
    setPercentageMode("percent-of");
    setPercentageFirst("10");
    setPercentageSecond("200");
    setEmiLoanAmount("500000");
    setEmiAnnualRate("8.5");
    setEmiTenureYears("5");
    setUnitCategory("length");
    setUnitValue("100");
    setUnitFrom("m");
    setUnitTo("km");
  }

  return (
    <>
      <section className="space-y-4 rounded-2xl border border-slate-200 bg-white/95 p-6 shadow-sm">
        <h2 className="text-xl font-bold tracking-tight text-slate-900">
          Input Area and Output Area
        </h2>

        {slug === "age-calculator" ? (
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <label className="text-sm font-semibold text-slate-800" htmlFor="dob-input">
              Date of birth
            </label>
            <input
              id="dob-input"
              type="date"
              value={dateOfBirth}
              onChange={(event) => setDateOfBirth(event.target.value)}
              className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-emerald-300 transition focus:ring-2 sm:max-w-[260px]"
            />
          </div>
        ) : null}

        {slug === "bmi-calculator" ? (
          <div className="grid gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4 sm:grid-cols-2">
            <div>
              <label className="text-sm font-semibold text-slate-800" htmlFor="bmi-weight">
                Weight (kg)
              </label>
              <input
                id="bmi-weight"
                type="number"
                min={1}
                step="0.1"
                value={bmiWeightKg}
                onChange={(event) => setBmiWeightKg(event.target.value)}
                className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-emerald-300 transition focus:ring-2"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-800" htmlFor="bmi-height">
                Height (cm)
              </label>
              <input
                id="bmi-height"
                type="number"
                min={1}
                step="0.1"
                value={bmiHeightCm}
                onChange={(event) => setBmiHeightCm(event.target.value)}
                className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-emerald-300 transition focus:ring-2"
              />
            </div>
          </div>
        ) : null}

        {slug === "percentage-calculator" ? (
          <div className="space-y-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setPercentageMode("percent-of")}
                className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                  percentageMode === "percent-of"
                    ? "border-emerald-300 bg-emerald-100 text-emerald-900"
                    : "border-slate-300 bg-white text-slate-700 hover:border-emerald-300 hover:text-emerald-800"
                }`}
              >
                X% of Y
              </button>
              <button
                type="button"
                onClick={() => setPercentageMode("what-percent")}
                className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                  percentageMode === "what-percent"
                    ? "border-emerald-300 bg-emerald-100 text-emerald-900"
                    : "border-slate-300 bg-white text-slate-700 hover:border-emerald-300 hover:text-emerald-800"
                }`}
              >
                X is what % of Y
              </button>
              <button
                type="button"
                onClick={() => setPercentageMode("change")}
                className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                  percentageMode === "change"
                    ? "border-emerald-300 bg-emerald-100 text-emerald-900"
                    : "border-slate-300 bg-white text-slate-700 hover:border-emerald-300 hover:text-emerald-800"
                }`}
              >
                % change
              </button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-sm font-semibold text-slate-800" htmlFor="pct-first">
                  {percentageMode === "percent-of"
                    ? "X (percentage)"
                    : percentageMode === "what-percent"
                      ? "X value"
                      : "Original value"}
                </label>
                <input
                  id="pct-first"
                  type="number"
                  step="any"
                  value={percentageFirst}
                  onChange={(event) => setPercentageFirst(event.target.value)}
                  className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-emerald-300 transition focus:ring-2"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-800" htmlFor="pct-second">
                  {percentageMode === "percent-of"
                    ? "Y (base value)"
                    : percentageMode === "what-percent"
                      ? "Y value"
                      : "New value"}
                </label>
                <input
                  id="pct-second"
                  type="number"
                  step="any"
                  value={percentageSecond}
                  onChange={(event) => setPercentageSecond(event.target.value)}
                  className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-emerald-300 transition focus:ring-2"
                />
              </div>
            </div>
          </div>
        ) : null}

        {slug === "emi-calculator" ? (
          <div className="grid gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4 sm:grid-cols-3">
            <div>
              <label className="text-sm font-semibold text-slate-800" htmlFor="emi-loan">
                Loan amount
              </label>
              <input
                id="emi-loan"
                type="number"
                min={1}
                step="any"
                value={emiLoanAmount}
                onChange={(event) => setEmiLoanAmount(event.target.value)}
                className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-emerald-300 transition focus:ring-2"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-800" htmlFor="emi-rate">
                Annual interest (%)
              </label>
              <input
                id="emi-rate"
                type="number"
                min={0}
                step="0.01"
                value={emiAnnualRate}
                onChange={(event) => setEmiAnnualRate(event.target.value)}
                className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-emerald-300 transition focus:ring-2"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-800" htmlFor="emi-years">
                Tenure (years)
              </label>
              <input
                id="emi-years"
                type="number"
                min={1}
                step="0.1"
                value={emiTenureYears}
                onChange={(event) => setEmiTenureYears(event.target.value)}
                className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-emerald-300 transition focus:ring-2"
              />
            </div>
          </div>
        ) : null}

        {slug === "unit-converter" ? (
          <div className="space-y-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex flex-wrap gap-2">
              {(["length", "weight", "temperature"] as UnitCategory[]).map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => {
                    setUnitCategory(category);
                    const options = getUnitOptions(category);
                    setUnitFrom(options[0]);
                    setUnitTo(options[1] ?? options[0]);
                  }}
                  className={`rounded-full border px-3 py-1.5 text-xs font-semibold uppercase transition ${
                    unitCategory === category
                      ? "border-emerald-300 bg-emerald-100 text-emerald-900"
                      : "border-slate-300 bg-white text-slate-700 hover:border-emerald-300 hover:text-emerald-800"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label className="text-sm font-semibold text-slate-800" htmlFor="unit-value">
                  Value
                </label>
                <input
                  id="unit-value"
                  type="number"
                  step="any"
                  value={unitValue}
                  onChange={(event) => setUnitValue(event.target.value)}
                  className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-emerald-300 transition focus:ring-2"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-800" htmlFor="unit-from">
                  From
                </label>
                <select
                  id="unit-from"
                  value={unitFrom}
                  onChange={(event) => setUnitFrom(event.target.value)}
                  className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-emerald-300 transition focus:ring-2"
                >
                  {unitOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-800" htmlFor="unit-to">
                  To
                </label>
                <select
                  id="unit-to"
                  value={unitTo}
                  onChange={(event) => setUnitTo(event.target.value)}
                  className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-emerald-300 transition focus:ring-2"
                >
                  {unitOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
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
