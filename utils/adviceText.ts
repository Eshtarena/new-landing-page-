export const ADVICE_PREVIEW_MAX_CHARS = 120;

export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

export function isAdviceTruncated(
  text: string,
  maxChars = ADVICE_PREVIEW_MAX_CHARS
): boolean {
  return stripHtml(text).length > maxChars;
}

export function getAdvicePreview(
  text: string,
  maxChars = ADVICE_PREVIEW_MAX_CHARS
): string {
  const plain = stripHtml(text);
  if (plain.length <= maxChars) return plain;
  return `${plain.slice(0, maxChars).trimEnd()}…`;
}

export function resolveAdviceLabel(
  value: string,
  key: string,
  isArabic: boolean,
  ar: string,
  en: string
): string {
  if (!value || value === key) {
    return isArabic ? ar : en;
  }
  return value;
}
