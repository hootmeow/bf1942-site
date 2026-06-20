import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Serialize an object for safe embedding inside a <script> tag (e.g. JSON-LD).
 * JSON.stringify escapes quotes but NOT `<` or `/`, so attacker-controlled
 * strings (player names are ingested verbatim) could break out of the script
 * tag via `</script>` and run arbitrary JS. Escaping `<`, `>`, `&` to their
 * \u sequences keeps the JSON valid while making tag breakout impossible.
 */
export function safeJsonLd(obj: unknown): string {
  return JSON.stringify(obj)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026")
}

/**
 * True only for absolute http(s) URLs. Use to validate user-supplied links
 * (org website/discord, event links) before storing or rendering — blocks
 * `javascript:`, `data:`, etc. which would otherwise be XSS-on-click in an href.
 */
export function isHttpUrl(value: string | null | undefined): boolean {
  if (!value) return false
  try {
    const u = new URL(value)
    return u.protocol === "http:" || u.protocol === "https:"
  } catch {
    return false
  }
}

/**
 * Render-time guard for user-supplied href values. Returns the URL if it's a
 * safe http(s) link, otherwise undefined (so the anchor has no href).
 */
export function safeHref(value: string | null | undefined): string | undefined {
  return isHttpUrl(value) ? (value as string) : undefined
}
