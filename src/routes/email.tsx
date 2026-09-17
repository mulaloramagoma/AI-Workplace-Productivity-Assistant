import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { AppLayout } from "@/components/AppLayout";
import { ResultCard } from "@/components/ResultPanel";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "Email Generator | AI Workplace Assistant" },
      {
        name: "description",
        content:
          "Draft professional workplace emails from a purpose, key points and a tone of your choice.",
      },
      { property: "og:title", content: "Email Generator" },
      {
        property: "og:description",
        content: "Generate, copy and refine workplace emails in seconds.",
      },
    ],
  }),
  component: EmailGenerator,
});

const EMAIL_TYPES = [
  "Request",
  "Follow-up",
  "Status update",
  "Introduction",
  "Thank you",
  "Apology",
  "Meeting invitation",
  "Decline / pushback",
];
const TONES = ["Professional", "Friendly", "Formal", "Concise"];

function EmailGenerator() {
  const [recipient, setRecipient] = useState("");
  const [emailType, setEmailType] = useState("Request");
  const [keyPoints, setKeyPoints] = useState("");
  const [tone, setTone] = useState("Professional");
  const [extra, setExtra] = useState("");
  const { loading, error, result, demo, run, clear } = useAi();

  const generate = () => void run("email", { recipient, emailType, keyPoints, tone, extra });

  const clearAll = () => {
    setRecipient("");
    setKeyPoints("");
    setExtra("");
    clear();
  };

  return (
    <AppLayout
      title="Email Generator"
      description="Describe the email you need and get a ready-to-review draft"
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="font-display text-base">Email details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="recipient">Recipient / purpose</Label>
              <Input
                id="recipient"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="e.g. My manager — asking for an extension on the Q3 report"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Email type</Label>
                <Select value={emailType} onValueChange={setEmailType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {EMAIL_TYPES.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Tone</Label>
                <Select value={tone} onValueChange={setTone}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TONES.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="points">Key points</Label>
              <Textarea
                id="points"
                rows={6}
                value={keyPoints}
                onChange={(e) => setKeyPoints(e.target.value)}
                placeholder={"One point per line, e.g.\n- Report is 80% complete\n- Need two extra days"}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="extra">Additional instructions</Label>
              <Textarea
                id="extra"
                rows={3}
                value={extra}
                onChange={(e) => setExtra(e.target.value)}
                placeholder="e.g. Keep it under 120 words and offer a call on Thursday"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <Button onClick={generate} disabled={loading || !recipient.trim()}>
                {loading ? "Generating…" : "Generate email"}
              </Button>
              <Button variant="ghost" onClick={clearAll}>
                Clear
              </Button>
            </div>
            {demo && (
              <p className="text-xs text-muted-foreground">
                Running in demo mode — add an AI key to get real drafts.
              </p>
            )}
          </CardContent>
        </Card>

        <ResultCard
          title="Email preview"
          loading={loading}
          error={error}
          result={result}
          onRegenerate={generate}
          onClear={clear}
          emptyHint="Your generated email will appear here. Always check names, dates and commitments before sending."
        />
      </div>
    </AppLayout>
  );
}
