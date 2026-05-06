export type DeveloperToolSlug =
  | "json-formatter"
  | "json-validator"
  | "base64-encode-decode"
  | "url-encode-decode"
  | "uuid-generator"
  | "password-generator"
  | "slug-generator";

export type ConversionMode = "encode" | "decode";

export interface PasswordOptions {
  length: number;
  includeUppercase: boolean;
  includeLowercase: boolean;
  includeNumbers: boolean;
  includeSymbols: boolean;
}

const DEVELOPER_TOOL_SLUGS: DeveloperToolSlug[] = [
  "json-formatter",
  "json-validator",
  "base64-encode-decode",
  "url-encode-decode",
  "uuid-generator",
  "password-generator",
  "slug-generator",
];

const UPPERCASE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const LOWERCASE_CHARS = "abcdefghijklmnopqrstuvwxyz";
const NUMBER_CHARS = "0123456789";
const SYMBOL_CHARS = "!@#$%^&*()_+[]{}<>?/|~-=";

export function isDeveloperToolSlug(slug: string): slug is DeveloperToolSlug {
  return DEVELOPER_TOOL_SLUGS.includes(slug as DeveloperToolSlug);
}

function parseJsonText(input: string): unknown {
  return JSON.parse(input);
}

export function formatJson(input: string): string {
  return JSON.stringify(parseJsonText(input), null, 2);
}

export function validateJson(input: string): string {
  const parsed = parseJsonText(input);

  if (parsed === null) {
    return "Valid JSON.\nType: null";
  }

  if (Array.isArray(parsed)) {
    return `Valid JSON.\nType: array\nItems: ${parsed.length}`;
  }

  if (typeof parsed === "object") {
    return `Valid JSON.\nType: object\nTop-level keys: ${Object.keys(parsed).length}`;
  }

  return `Valid JSON.\nType: ${typeof parsed}`;
}

function textToBase64(text: string): string {
  const bytes = new TextEncoder().encode(text);
  const binary = Array.from(bytes, (byte) => String.fromCharCode(byte)).join("");
  return btoa(binary);
}

function base64ToText(encoded: string): string {
  const binary = atob(encoded);
  const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

export function convertBase64(input: string, mode: ConversionMode): string {
  return mode === "encode" ? textToBase64(input) : base64ToText(input);
}

export function convertUrl(input: string, mode: ConversionMode): string {
  return mode === "encode"
    ? encodeURIComponent(input)
    : decodeURIComponent(input);
}

function getSecureRandomNumber(max: number): number {
  if (max <= 0) {
    return 0;
  }

  const cryptoObject = globalThis.crypto;

  if (!cryptoObject) {
    return Math.floor(Math.random() * max);
  }

  const values = new Uint32Array(1);
  cryptoObject.getRandomValues(values);
  return values[0] % max;
}

function pickCharacter(charset: string): string {
  return charset.charAt(getSecureRandomNumber(charset.length));
}

function shuffleString(value: string): string {
  const characters = value.split("");

  for (let index = characters.length - 1; index > 0; index -= 1) {
    const randomIndex = getSecureRandomNumber(index + 1);
    [characters[index], characters[randomIndex]] = [
      characters[randomIndex],
      characters[index],
    ];
  }

  return characters.join("");
}

export function generatePassword(options: PasswordOptions): string {
  const charsets: string[] = [];

  if (options.includeUppercase) {
    charsets.push(UPPERCASE_CHARS);
  }
  if (options.includeLowercase) {
    charsets.push(LOWERCASE_CHARS);
  }
  if (options.includeNumbers) {
    charsets.push(NUMBER_CHARS);
  }
  if (options.includeSymbols) {
    charsets.push(SYMBOL_CHARS);
  }

  if (charsets.length === 0) {
    throw new Error("Select at least one character set.");
  }

  const safeLength = Math.max(options.length, charsets.length);
  const allCharacters = charsets.join("");
  let password = "";

  for (const charset of charsets) {
    password += pickCharacter(charset);
  }

  while (password.length < safeLength) {
    password += pickCharacter(allCharacters);
  }

  return shuffleString(password);
}

function fallbackUuidV4(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (char) => {
    const randomValue = Math.floor(Math.random() * 16);
    const value = char === "x" ? randomValue : (randomValue & 0x3) | 0x8;
    return value.toString(16);
  });
}

export function generateUuids(count: number): string[] {
  const safeCount = Math.max(1, Math.min(count, 20));
  const list: string[] = [];

  for (let index = 0; index < safeCount; index += 1) {
    if (globalThis.crypto && typeof globalThis.crypto.randomUUID === "function") {
      list.push(globalThis.crypto.randomUUID());
    } else {
      list.push(fallbackUuidV4());
    }
  }

  return list;
}

export function generateSlug(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}
