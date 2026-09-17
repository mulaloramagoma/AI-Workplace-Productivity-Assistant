import { createFileRoute } from "@tanstack/react-router";
import { Eye, Lock, ScanSearch, Scale } from "lucide-react";

import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About & Responsible AI | AI Workplace Assistant" },
      {
        name: "description",
        content:
          "How to use the AI Workplace Productivity Assistant responsibly: human oversight, verifying details, privacy and confidentiality.",
      },
      { property: "og:title", content: "About & Responsible AI" },
      {
        property: "og:description",
        content: "Guidance on safe, effective and responsible use of AI at work.",
      },
    ],
  }),
  component: About,
});

const PRINCIPLES = [
  {
    icon: Eye,
    title: "Human oversight",
    body: "Every output is a first draft. You remain accountable for what you send, share or decide. Read the whole result, edit it into your own voice, and never forward AI text you have not read end to end.",
  },
  {
    icon: ScanSearch,
    title: "Verify critical details",
    body: "AI can state wrong things confidently. Check names, job titles, dates, deadlines, prices, legal or policy claims, and any commitment made on someone's behalf against a reliable source before acting.",
  },
  {
    icon: Lock,
    title: "Privacy & confidentiality",
    body: "Do not paste personal data, customer records, credentials, or anything covered by an NDA or client contract. Anonymise names and figures where you can. Your entries are sent to the configured AI service for processing and are not stored by this app.",
  },
  {
    icon: Scale,
    title: "Responsible usage",
    body: "Use AI to accelerate your thinking, not to replace judgement. Disclose AI assistance where your organisation requires it, watch for bias or one-sided framing, and do not use it for decisions about people (hiring, performance, discipline) without human review.",
  },
];

function About() {
  return (
    <AppLayout
      title="About & Responsible AI"
      description="How this assistant works and how to use it well"
    >
      <Card>
        <CardHeader>
          <CardTitle className="font-display text-base">About this assistant</CardTitle>
          <CardDescription>
            Built for the AI Skills Acceleration programme, this assistant bundles five everyday
            workplace tools — email drafting, meeting summarising, task planning, research support
            and a general chatbot — behind one consistent interface. Each tool sends a structured
            prompt (role, task, context, output format and constraints) to the configured AI model
            and returns a draft you review.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm leading-relaxed text-muted-foreground">
          <p>
            <strong className="text-foreground">Grounded by design.</strong> The prompts instruct the
            model to use only the information you supply, to mark missing information as “Not
            specified”, and to label its own inferences as suggestions rather than facts.
          </p>
          <p>
            <strong className="text-foreground">Works out of the box.</strong> With no AI key
            configured, the app runs in demo mode and returns clearly labelled sample output so you
            can explore the interface safely.
          </p>
          <p>
            <strong className="text-foreground">Your data.</strong> Inputs live in your browser
            session only and are cleared when you clear a tool or close the tab.
          </p>
        </CardContent>
      </Card>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {PRINCIPLES.map((p) => (
          <Card key={p.title}>
            <CardHeader>
              <span className="flex size-10 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                <p.icon className="size-5" />
              </span>
              <CardTitle className="font-display mt-3 text-base">{p.title}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm leading-relaxed text-muted-foreground">
              {p.body}
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="font-display text-base">A quick checklist before you send</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-muted-foreground">
            <li>Have I read the full output rather than skimming it?</li>
            <li>Are all names, dates, numbers and owners correct?</li>
            <li>Did I avoid sharing confidential or personal information in my input?</li>
            <li>Does the tone match my relationship with the recipient?</li>
            <li>Would I be comfortable if a colleague knew AI helped draft this?</li>
          </ul>
        </CardContent>
      </Card>
    </AppLayout>
  );
}
