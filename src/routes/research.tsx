import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { AppLayout } from "@/components/AppLayout";
import { ResultCard } from "@/components/ResultPanel";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAi } from "@/lib/use-ai";

export const Route = createFileRoute("/research")({
  head: () => ({
    meta: [
      { title: "Research Assistant | AI Workplace Assistant" },
      {
        name: "description",
        content:
          "Explore a topic with summaries, key points, pros and cons, questions to investigate and a research outline.",
      },
      { property: "og:title", content: "Research Assistant" },
      {
        property: "og:description",
        content: "Structured topic exploration that separates your facts from AI suggestions.",
      },
    ],
  }),
  component: ResearchAssistant,
});

const SECTIONS = [
  "Summary",
  "Key points",
  "Pros & cons",
  "Questions to investigate",
  "Research outline",
];

function ResearchAssistant() {
  const [topic, setTopic] = useState("");
  const [context, setContext] = useState("");
  const [selected, setSelected] = useState<string[]>(["Summary", "Key points"]);
  const { loading, error, result, demo, run, clear } = useAi();

  const toggle = (section: string) =>
    setSelected((prev) =>
      prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section],
    );

  const generate = () =>
    void run("research", { topic, context, sections: selected.join(", ") });

  return (
    <AppLayout
      title="Research Assistant"
      description="Explore a topic — your facts stay clearly separate from AI suggestions"
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="font-display text-base">What are you researching?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="topic">Topic or question</Label>
              <Input
                id="topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. Should our team adopt AI note-taking in client meetings?"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="context">What you already know (your facts)</Label>
              <Textarea
                id="context"
                rows={6}
                value={context}
                onChange={(e) => setContext(e.target.value)}
                placeholder="Add any internal facts, constraints or policies the assistant should rely on."
              />
            </div>
            <div className="space-y-3">
              <Label>Sections to include</Label>
              <div className="grid gap-2 sm:grid-cols-2">
                {SECTIONS.map((section) => (
                  <label key={section} className="flex items-center gap-2 text-sm">
                    <Checkbox
                      checked={selected.includes(section)}
                      onCheckedChange={() => toggle(section)}
                    />
                    {section}
                  </label>
                ))}
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                onClick={generate}
                disabled={loading || topic.trim().length < 5 || selected.length === 0}
              >
                {loading ? "Researching…" : "Run research"}
              </Button>
              <Button
                variant="ghost"
                onClick={() => {
                  setTopic("");
                  setContext("");
                  clear();
                }}
              >
                Clear
              </Button>
            </div>
            {demo && (
              <p className="text-xs text-muted-foreground">
                Running in demo mode — add an AI key for real research support.
              </p>
            )}
          </CardContent>
        </Card>

        <ResultCard
          title="Research notes"
          loading={loading}
          error={error}
          result={result}
          onRegenerate={generate}
          onClear={clear}
          emptyHint="Results will restate your own facts first, then label every AI-generated idea as a suggestion to verify."
        />
      </div>
    </AppLayout>
  );
}
