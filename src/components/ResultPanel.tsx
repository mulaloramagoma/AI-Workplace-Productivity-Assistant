import { Check, Copy, Loader2, RefreshCw } from "lucide-react";
import { useState, type ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function useCopy() {
  const [copied, setCopied] = useState(false);
  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };
  return { copied, copy };
}

export function CopyButton({ text, label = "Copy" }: { text: string; label?: string }) {
  const { copied, copy } = useCopy();
  return (
    <Button type="button" variant="outline" size="sm" onClick={() => void copy(text)}>
      {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
      {copied ? "Copied" : label}
    </Button>
  );
}

/** Lightweight renderer for the markdown-ish text the assistant returns. */
export function FormattedOutput({ text }: { text: string }) {
  const blocks: ReactNode[] = [];
  const lines = text.split("\n");
  let i = 0;
  let key = 0;

  while (i < lines.length) {
    const line = lines[i] ?? "";
    const trimmed = line.trim();

    if (!trimmed) {
      i++;
      continue;
    }

    if (trimmed.startsWith("|") && (lines[i + 1] ?? "").trim().startsWith("|")) {
      const rows: string[][] = [];
      while (i < lines.length && (lines[i] ?? "").trim().startsWith("|")) {
        const cells = (lines[i] ?? "")
          .trim()
          .replace(/^\||\|$/g, "")
          .split("|")
          .map((c) => c.trim());
        if (!cells.every((c) => /^:?-{2,}:?$/.test(c))) rows.push(cells);
        i++;
      }
      const [head, ...body] = rows;
      blocks.push(
        <div key={key++} className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead className="bg-muted">
              <tr>
                {(head ?? []).map((cell, idx) => (
                  <th key={idx} className="px-3 py-2 text-left font-semibold">
                    {cell}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {body.map((row, ri) => (
                <tr key={ri} className="border-t border-border align-top">
                  {row.map((cell, ci) => (
                    <td key={ci} className="px-3 py-2">
                      {renderCell(cell)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>,
      );
      continue;
    }

    if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      const items: string[] = [];
      while (i < lines.length && /^\s*[-*]\s+/.test(lines[i] ?? "")) {
        items.push((lines[i] ?? "").replace(/^\s*[-*]\s+/, ""));
        i++;
      }
      blocks.push(
        <ul key={key++} className="list-disc space-y-1 pl-5 text-sm leading-relaxed">
          {items.map((item, idx) => (
            <li key={idx}>{renderCell(item)}</li>
          ))}
        </ul>,
      );
      continue;
    }

    if (trimmed.startsWith(">")) {
      blocks.push(
        <p
          key={key++}
          className="rounded-md border-l-4 border-primary bg-accent px-3 py-2 text-sm text-accent-foreground"
        >
          {trimmed.replace(/^>\s?/, "")}
        </p>,
      );
      i++;
      continue;
    }

    const heading = /^(#{1,4})\s+(.*)$/.exec(trimmed);
    if (heading) {
      const level = heading[1]?.length ?? 2;
      blocks.push(
        <p
          key={key++}
          className={
            level <= 2
              ? "font-display mt-2 text-base font-semibold"
              : "font-display mt-2 text-sm font-semibold text-muted-foreground"
          }
        >
          {heading[2]}
        </p>,
      );
      i++;
      continue;
    }

    blocks.push(
      <p key={key++} className="text-sm leading-relaxed whitespace-pre-wrap">
        {renderCell(trimmed)}
      </p>,
    );
    i++;
  }

  return <div className="space-y-3">{blocks}</div>;
}

function renderCell(text: string): ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/g).filter(Boolean);
  return parts.map((part, idx) =>
    part.startsWith("**") && part.endsWith("**") ? (
      <strong key={idx}>{part.slice(2, -2)}</strong>
    ) : (
      <span key={idx}>{part}</span>
    ),
  );
}

export function ResultCard({
  title,
  loading,
  error,
  result,
  onRegenerate,
  onClear,
  emptyHint,
}: {
  title: string;
  loading: boolean;
  error: string | null;
  result: string;
  onRegenerate?: () => void;
  onClear: () => void;
  emptyHint: string;
}) {
  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0">
        <CardTitle className="font-display text-base">{title}</CardTitle>
        <div className="flex flex-wrap gap-2">
          {result && <CopyButton text={result} />}
          {result && onRegenerate && (
            <Button type="button" variant="outline" size="sm" onClick={onRegenerate}>
              <RefreshCw className="size-4" /> Regenerate
            </Button>
          )}
          {(result || error) && (
            <Button type="button" variant="ghost" size="sm" onClick={onClear}>
              Clear
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {loading && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin" /> Generating…
          </div>
        )}
        {!loading && error && (
          <p className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {error}
          </p>
        )}
        {!loading && !error && !result && <p className="text-sm text-muted-foreground">{emptyHint}</p>}
        {!loading && !error && result && <FormattedOutput text={result} />}
      </CardContent>
    </Card>
  );
}
