export type CalculatorToolSlug =
  | "age-calculator"
  | "bmi-calculator"
  | "percentage-calculator"
  | "emi-calculator"
  | "unit-converter";

export type PercentageMode = "percent-of" | "what-percent" | "change";
export type UnitCategory = "length" | "weight" | "temperature";

const CALCULATOR_TOOL_SLUGS: CalculatorToolSlug[] = [
  "age-calculator",
  "bmi-calculator",
  "percentage-calculator",
  "emi-calculator",
  "unit-converter",
];

const LENGTH_TO_METER: Record<string, number> = {
  mm: 0.001,
  cm: 0.01,
  m: 1,
  km: 1000,
  in: 0.0254,
  ft: 0.3048,
  yd: 0.9144,
  mi: 1609.344,
};

const WEIGHT_TO_KILOGRAM: Record<string, number> = {
  mg: 0.000001,
  g: 0.001,
  kg: 1,
  oz: 0.028349523125,
  lb: 0.45359237,
};

const UNIT_OPTIONS: Record<UnitCategory, string[]> = {
  length: Object.keys(LENGTH_TO_METER),
  weight: Object.keys(WEIGHT_TO_KILOGRAM),
  temperature: ["c", "f", "k"],
};

export interface AgeResult {
  years: number;
  months: number;
  days: number;
  totalDays: number;
}

export interface BmiResult {
  bmi: number;
  category: "Underweight" | "Normal" | "Overweight" | "Obesity";
}

export interface EmiResult {
  monthlyEmi: number;
  totalPayment: number;
  totalInterest: number;
}

export interface PercentageResult {
  message: string;
  value: number;
}

export function isCalculatorToolSlug(slug: string): slug is CalculatorToolSlug {
  return CALCULATOR_TOOL_SLUGS.includes(slug as CalculatorToolSlug);
}

export function getUnitOptions(category: UnitCategory): string[] {
  return UNIT_OPTIONS[category];
}

export function formatNumber(value: number, fractionDigits = 2): string {
  const fixed = value.toFixed(fractionDigits);
  return fixed.replace(/\.0+$/, "").replace(/(\.\d*?)0+$/, "$1");
}

function parseDateInput(dateValue: string): Date {
  const parsed = new Date(`${dateValue}T00:00:00`);

  if (Number.isNaN(parsed.getTime())) {
    throw new Error("Please enter a valid date.");
  }

  return parsed;
}

export function calculateAge(dateOfBirthValue: string, today = new Date()): AgeResult {
  const birthDate = parseDateInput(dateOfBirthValue);
  const currentDate = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );

  if (birthDate > currentDate) {
    throw new Error("Date of birth cannot be in the future.");
  }

  let years = currentDate.getFullYear() - birthDate.getFullYear();
  let months = currentDate.getMonth() - birthDate.getMonth();
  let days = currentDate.getDate() - birthDate.getDate();

  if (days < 0) {
    const previousMonthDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      0
    );
    days += previousMonthDate.getDate();
    months -= 1;
  }

  if (months < 0) {
    months += 12;
    years -= 1;
  }

  const millisecondsPerDay = 1000 * 60 * 60 * 24;
  const totalDays = Math.floor(
    (currentDate.getTime() - birthDate.getTime()) / millisecondsPerDay
  );

  return {
    years,
    months,
    days,
    totalDays,
  };
}

export function calculateBmi(weightKg: number, heightCm: number): BmiResult {
  if (weightKg <= 0 || heightCm <= 0) {
    throw new Error("Weight and height must be greater than zero.");
  }

  const heightM = heightCm / 100;
  const bmi = weightKg / (heightM * heightM);

  let category: BmiResult["category"];
  if (bmi < 18.5) {
    category = "Underweight";
  } else if (bmi < 25) {
    category = "Normal";
  } else if (bmi < 30) {
    category = "Overweight";
  } else {
    category = "Obesity";
  }

  return {
    bmi,
    category,
  };
}

export function calculatePercentage(
  mode: PercentageMode,
  firstValue: number,
  secondValue: number
): PercentageResult {
  if (!Number.isFinite(firstValue) || !Number.isFinite(secondValue)) {
    throw new Error("Please enter valid numbers.");
  }

  if (mode === "percent-of") {
    const value = (firstValue / 100) * secondValue;
    return {
      value,
      message: `${formatNumber(firstValue)}% of ${formatNumber(
        secondValue
      )} is ${formatNumber(value)}.`,
    };
  }

  if (mode === "what-percent") {
    if (secondValue === 0) {
      throw new Error("Second value cannot be zero for this calculation.");
    }

    const value = (firstValue / secondValue) * 100;
    return {
      value,
      message: `${formatNumber(firstValue)} is ${formatNumber(
        value
      )}% of ${formatNumber(secondValue)}.`,
    };
  }

  if (mode === "change") {
    if (firstValue === 0) {
      throw new Error("Original value cannot be zero for change calculation.");
    }

    const value = ((secondValue - firstValue) / firstValue) * 100;
    const direction = value >= 0 ? "increase" : "decrease";
    return {
      value,
      message: `${formatNumber(Math.abs(value))}% ${direction} (from ${formatNumber(
        firstValue
      )} to ${formatNumber(secondValue)}).`,
    };
  }

  throw new Error("Invalid percentage mode.");
}

export function calculateEmi(
  principal: number,
  annualInterestRate: number,
  tenureYears: number
): EmiResult {
  if (principal <= 0 || tenureYears <= 0) {
    throw new Error("Loan amount and tenure must be greater than zero.");
  }

  if (annualInterestRate < 0) {
    throw new Error("Interest rate cannot be negative.");
  }

  const months = Math.round(tenureYears * 12);
  const monthlyRate = annualInterestRate / 12 / 100;

  let monthlyEmi = 0;
  if (monthlyRate === 0) {
    monthlyEmi = principal / months;
  } else {
    const power = Math.pow(1 + monthlyRate, months);
    monthlyEmi = (principal * monthlyRate * power) / (power - 1);
  }

  const totalPayment = monthlyEmi * months;
  const totalInterest = totalPayment - principal;

  return {
    monthlyEmi,
    totalPayment,
    totalInterest,
  };
}

function convertTemperature(value: number, fromUnit: string, toUnit: string): number {
  let celsiusValue = value;

  if (fromUnit === "f") {
    celsiusValue = ((value - 32) * 5) / 9;
  } else if (fromUnit === "k") {
    celsiusValue = value - 273.15;
  }

  if (toUnit === "f") {
    return (celsiusValue * 9) / 5 + 32;
  }
  if (toUnit === "k") {
    return celsiusValue + 273.15;
  }

  return celsiusValue;
}

export function convertUnit(
  category: UnitCategory,
  value: number,
  fromUnit: string,
  toUnit: string
): number {
  if (!Number.isFinite(value)) {
    throw new Error("Please enter a valid number.");
  }

  if (category === "temperature") {
    if (!UNIT_OPTIONS.temperature.includes(fromUnit) || !UNIT_OPTIONS.temperature.includes(toUnit)) {
      throw new Error("Invalid temperature unit.");
    }
    return convertTemperature(value, fromUnit, toUnit);
  }

  if (category === "length") {
    if (!(fromUnit in LENGTH_TO_METER) || !(toUnit in LENGTH_TO_METER)) {
      throw new Error("Invalid length unit.");
    }

    const meterValue = value * LENGTH_TO_METER[fromUnit];
    return meterValue / LENGTH_TO_METER[toUnit];
  }

  if (category === "weight") {
    if (!(fromUnit in WEIGHT_TO_KILOGRAM) || !(toUnit in WEIGHT_TO_KILOGRAM)) {
      throw new Error("Invalid weight unit.");
    }

    const kilogramValue = value * WEIGHT_TO_KILOGRAM[fromUnit];
    return kilogramValue / WEIGHT_TO_KILOGRAM[toUnit];
  }

  throw new Error("Unsupported conversion category.");
}
