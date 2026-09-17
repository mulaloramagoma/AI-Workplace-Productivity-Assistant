import { createFileRoute } from "@tanstack/react-router";
import { Loader2, Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { AppLayout } from "@/components/AppLayout";
import { CopyButton, FormattedOutput } from "@/components/ResultPanel";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { generateAi } from "@/lib/ai.functions";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "AI Chatbot | AI Workplace Assistant" },
      {
        name: "description",
        content:
          "Chat with a workplace productivity assistant: ask questions, draft ideas and keep the conversation in one place.",
      },
      { property: "og:title", content: "AI Chatbot" },
      { property: "og:description", content: "A conversational assistant for everyday work tasks." },
    ],
  }),
  component: Chatbot,
});

type Message = { role: "user" | "assistant"; content: string };

function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const send = async () => {
    const message = input.trim();
    if (!message || loading) return;
    const history = messages.slice(-10);
    setMessages((prev) => [...prev, { role: "user", content: message }]);
    setInput("");
    setLoading(true);
    setError(null);
    try {
      const res = await generateAi({ data: { tool: "chat", fields: { message }, history } });
      setMessages((prev) => [...prev, { role: "assistant", content: res.text }]);
    } catch (err) {
      setError(
        err instanceof Error && err.message
          ? err.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout title="AI Chatbot" description="Ask questions and work through ideas in conversation">
      <Card className="flex h-[70vh] flex-col overflow-hidden">
        <CardContent className="flex-1 space-y-4 overflow-y-auto p-4 sm:p-6">
          {messages.length === 0 && !loading && (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <p className="font-display text-base font-semibold">How can I help today?</p>
              <p className="mt-2 max-w-md text-sm text-muted-foreground">
                Try “Help me prepare talking points for a project update” or “Explain this policy in
                plain English”. Check anything important before you rely on it.
              </p>
            </div>
          )}

          {messages.map((m, i) => (
            <div
              key={i}
              className={m.role === "user" ? "flex justify-end" : "flex flex-col items-start gap-1"}
            >
              <div
                className={
                  m.role === "user"
                    ? "max-w-[85%] rounded-2xl rounded-br-sm bg-primary px-4 py-2.5 text-sm text-primary-foreground"
                    : "max-w-[90%] rounded-2xl rounded-bl-sm border border-border bg-card px-4 py-3"
                }
              >
                {m.role === "user" ? (
                  <p className="whitespace-pre-wrap">{m.content}</p>
                ) : (
                  <FormattedOutput text={m.content} />
                )}
              </div>
              {m.role === "assistant" && <CopyButton text={m.content} label="Copy response" />}
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" /> Assistant is thinking…
            </div>
          )}
          {error && (
            <p className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </p>
          )}
          <div ref={endRef} />
        </CardContent>

        <div className="border-t border-border bg-background p-3 sm:p-4">
          <div className="flex items-end gap-2">
            <Textarea
              rows={2}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  void send();
                }
              }}
              placeholder="Type a message and press Enter…"
              className="resize-none"
            />
            <Button onClick={() => void send()} disabled={loading || !input.trim()}>
              <Send className="size-4" />
              <span className="sr-only sm:not-sr-only">Send</span>
            </Button>
          </div>
          <div className="mt-2 flex justify-between">
            <p className="text-xs text-muted-foreground">Shift + Enter for a new line.</p>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setMessages([]);
                setError(null);
              }}
              disabled={messages.length === 0}
            >
              Clear conversation
            </Button>
          </div>
        </div>
      </Card>
    </AppLayout>
  );
}
