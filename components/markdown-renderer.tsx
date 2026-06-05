"use client"

import React from "react"

// Safe subset of markdown rendered entirely as React elements — no dangerouslySetInnerHTML.
// Supported: headings (# ## ###), bold (**), italic (*), inline code (`), code blocks (```),
// unordered lists (- / *), ordered lists (1.), blockquotes (>), horizontal rules (---),
// links [text](url) — only http/https/mailto, images are intentionally excluded.

const SAFE_URL = /^(https?:\/\/|mailto:)/i

function parseInline(text: string, key?: string | number): React.ReactNode {
  const parts: React.ReactNode[] = []
  let i = 0
  let buf = ""

  const flush = () => {
    if (buf) { parts.push(buf); buf = "" }
  }

  while (i < text.length) {
    // Bold **text**
    if (text.slice(i, i + 2) === "**") {
      const end = text.indexOf("**", i + 2)
      if (end !== -1) {
        flush()
        parts.push(<strong key={`b${i}`}>{parseInline(text.slice(i + 2, end))}</strong>)
        i = end + 2
        continue
      }
    }
    // Italic *text* (but not **)
    if (text[i] === "*" && text[i + 1] !== "*") {
      const end = text.indexOf("*", i + 1)
      if (end !== -1 && text[end + 1] !== "*") {
        flush()
        parts.push(<em key={`em${i}`}>{parseInline(text.slice(i + 1, end))}</em>)
        i = end + 1
        continue
      }
    }
    // Inline code `code`
    if (text[i] === "`") {
      const end = text.indexOf("`", i + 1)
      if (end !== -1) {
        flush()
        parts.push(
          <code key={`c${i}`} className="bg-muted px-1 py-0.5 rounded text-sm font-mono">
            {text.slice(i + 1, end)}
          </code>
        )
        i = end + 1
        continue
      }
    }
    // Link [text](url)
    if (text[i] === "[") {
      const labelEnd = text.indexOf("]", i + 1)
      if (labelEnd !== -1 && text[labelEnd + 1] === "(") {
        const urlEnd = text.indexOf(")", labelEnd + 2)
        if (urlEnd !== -1) {
          const url = text.slice(labelEnd + 2, urlEnd)
          if (SAFE_URL.test(url)) {
            flush()
            parts.push(
              <a
                key={`a${i}`}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline underline-offset-2 hover:opacity-80"
              >
                {parseInline(text.slice(i + 1, labelEnd))}
              </a>
            )
            i = urlEnd + 1
            continue
          }
        }
      }
    }
    buf += text[i]
    i++
  }
  flush()
  return parts.length === 1 ? parts[0] : parts
}

interface Block {
  type: "h1" | "h2" | "h3" | "p" | "ul" | "ol" | "blockquote" | "code" | "hr"
  content?: string
  items?: string[]
  lang?: string
}

function parseBlocks(markdown: string): Block[] {
  const lines = markdown.split("\n")
  const blocks: Block[] = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i]

    // Fenced code block
    if (line.startsWith("```")) {
      const lang = line.slice(3).trim()
      const codeLines: string[] = []
      i++
      while (i < lines.length && !lines[i].startsWith("```")) {
        codeLines.push(lines[i])
        i++
      }
      blocks.push({ type: "code", content: codeLines.join("\n"), lang })
      i++
      continue
    }

    // Horizontal rule
    if (/^(-{3,}|\*{3,}|_{3,})$/.test(line.trim())) {
      blocks.push({ type: "hr" })
      i++
      continue
    }

    // Headings
    const h1 = line.match(/^#\s+(.+)/)
    if (h1) { blocks.push({ type: "h1", content: h1[1] }); i++; continue }
    const h2 = line.match(/^##\s+(.+)/)
    if (h2) { blocks.push({ type: "h2", content: h2[1] }); i++; continue }
    const h3 = line.match(/^###\s+(.+)/)
    if (h3) { blocks.push({ type: "h3", content: h3[1] }); i++; continue }

    // Blockquote
    if (line.startsWith(">")) {
      const quoteLines: string[] = []
      while (i < lines.length && lines[i].startsWith(">")) {
        quoteLines.push(lines[i].slice(1).trim())
        i++
      }
      blocks.push({ type: "blockquote", content: quoteLines.join("\n") })
      continue
    }

    // Unordered list
    if (/^[-*]\s/.test(line)) {
      const items: string[] = []
      while (i < lines.length && /^[-*]\s/.test(lines[i])) {
        items.push(lines[i].slice(2))
        i++
      }
      blocks.push({ type: "ul", items })
      continue
    }

    // Ordered list
    if (/^\d+\.\s/.test(line)) {
      const items: string[] = []
      while (i < lines.length && /^\d+\.\s/.test(lines[i])) {
        items.push(lines[i].replace(/^\d+\.\s/, ""))
        i++
      }
      blocks.push({ type: "ol", items })
      continue
    }

    // Blank line — skip
    if (line.trim() === "") { i++; continue }

    // Paragraph — accumulate until blank line or block element
    const paraLines: string[] = []
    while (
      i < lines.length &&
      lines[i].trim() !== "" &&
      !/^#{1,3}\s/.test(lines[i]) &&
      !/^[-*]\s/.test(lines[i]) &&
      !/^\d+\.\s/.test(lines[i]) &&
      !lines[i].startsWith(">") &&
      !lines[i].startsWith("```") &&
      !/^(-{3,}|\*{3,}|_{3,})$/.test(lines[i].trim())
    ) {
      paraLines.push(lines[i])
      i++
    }
    if (paraLines.length) {
      blocks.push({ type: "p", content: paraLines.join(" ") })
    }
  }
  return blocks
}

interface MarkdownRendererProps {
  content: string
  className?: string
}

export function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
  const blocks = parseBlocks(content)

  return (
    <div className={`space-y-3 text-sm leading-relaxed ${className ?? ""}`}>
      {blocks.map((block, idx) => {
        switch (block.type) {
          case "h1":
            return <h1 key={idx} className="text-xl font-bold mt-4 mb-2">{parseInline(block.content!)}</h1>
          case "h2":
            return <h2 key={idx} className="text-lg font-semibold mt-3 mb-1">{parseInline(block.content!)}</h2>
          case "h3":
            return <h3 key={idx} className="text-base font-semibold mt-2 mb-1">{parseInline(block.content!)}</h3>
          case "hr":
            return <hr key={idx} className="border-border/60" />
          case "blockquote":
            return (
              <blockquote key={idx} className="border-l-2 border-primary/40 pl-4 text-muted-foreground italic">
                {parseInline(block.content!)}
              </blockquote>
            )
          case "code":
            return (
              <pre key={idx} className="bg-muted rounded-md p-3 overflow-x-auto text-xs font-mono whitespace-pre-wrap">
                <code>{block.content}</code>
              </pre>
            )
          case "ul":
            return (
              <ul key={idx} className="list-disc list-inside space-y-1 pl-2">
                {block.items!.map((item, j) => (
                  <li key={j}>{parseInline(item)}</li>
                ))}
              </ul>
            )
          case "ol":
            return (
              <ol key={idx} className="list-decimal list-inside space-y-1 pl-2">
                {block.items!.map((item, j) => (
                  <li key={j}>{parseInline(item)}</li>
                ))}
              </ol>
            )
          case "p":
          default:
            return <p key={idx}>{parseInline(block.content!)}</p>
        }
      })}
    </div>
  )
}
