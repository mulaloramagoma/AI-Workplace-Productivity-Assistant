import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { AppLayout } from "@/components/AppLayout";
import { ResultCard } from "@/components/ResultPanel";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useAi } from "@/lib/use-ai";

export const Route = createFileRoute("/meetings")({
  head: () => ({
    meta: [
      { title: "Meeting Summarizer | AI Workplace Assistant" },
      {
        name: "description",
        content:
          "Turn meeting notes or transcripts into a summary, decisions, action items with owners, and outstanding questions.",
      },
      { property: "og:title", content: "Meeting Summarizer" },
      {
        property: "og:description",
        content: "Structured, grounded meeting records from your raw notes.",
      },
    ],
  }),
  component: MeetingSummarizer,
});

const LENGTHS = ["Short", "Standard", "Detailed"];
const TYPES = [
  "Team stand-up",
  "Project review",
  "Client meeting",
  "One-to-one",
  "Workshop",
  "Board / steering",
];

function MeetingSummarizer() {
  const [notes, setNotes] = useState("");
  const [length, setLength] = useState("Standard");
  const [meetingType, setMeetingType] = useState("Project review");
  const { loading, error, result, demo, run, clear } = useAi();

  const generate = () => void run("meeting", { notes, length, meetingType });

  return (
    <AppLayout
      title="Meeting Summarizer"
      description="Grounded summaries built only from the notes you paste"
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="font-display text-base">Notes or transcript</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Meeting type</Label>
                <Select value={meetingType} onValueChange={setMeetingType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TYPES.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Summary length</Label>
                <Select value={length} onValueChange={setLength}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {LENGTHS.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Paste your notes</Label>
              <Textarea
                id="notes"
                rows={16}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Paste raw meeting notes or a transcript here…"
              />
              <p className="text-xs text-muted-foreground">
                Nothing is invented: anything missing is returned as “Not specified” or an open
                question.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button onClick={generate} disabled={loading || notes.trim().length < 20}>
                {loading ? "Summarising…" : "Summarise meeting"}
              </Button>
              <Button
                variant="ghost"
                onClick={() => {
                  setNotes("");
                  clear();
                }}
              >
                Clear
              </Button>
            </div>
            {demo && (
              <p className="text-xs text-muted-foreground">
                Running in demo mode — add an AI key to summarise real notes.
              </p>
            )}
          </CardContent>
        </Card>

        <ResultCard
          title="Structured summary"
          loading={loading}
          error={error}
          result={result}
          onRegenerate={generate}
          onClear={clear}
          emptyHint="Summary, key discussion points, decisions, action items and outstanding questions will appear here."
        />
      </div>
    </AppLayout>
  );
}
