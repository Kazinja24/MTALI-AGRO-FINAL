const HTML_TAG_RE = /<[^>]*>/g;
const SCRIPT_STYLE_RE = /<(script|style)[\s\S]*?<\/\1>/gi;
const WHITESPACE_RE = /\s+/g;

function stripControlChars(value: string) {
  return Array.from(value)
    .filter((char) => {
      const code = char.charCodeAt(0);
      return code > 31 && code !== 127;
    })
    .join("");
}

export function sanitizePlainText(value?: string | null) {
  if (!value) return "";

  return stripControlChars(value)
    .replace(SCRIPT_STYLE_RE, "")
    .replace(HTML_TAG_RE, "")
    .replace(WHITESPACE_RE, " ")
    .trim();
}

export function truncatePlainText(value?: string | null, maxLength = 120) {
  const text = sanitizePlainText(value);
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trimEnd()}...`;
}
