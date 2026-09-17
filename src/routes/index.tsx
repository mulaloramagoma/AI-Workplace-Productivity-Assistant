import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Mail,
  NotebookPen,
  ListChecks,
  Microscope,
  MessagesSquare,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";

import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AI Workplace Productivity Assistant | Dashboard" },
      {
        name: "description",
        content:
          "Draft emails, summarise meetings, plan tasks, research topics and chat with an AI assistant built for the AI Skills Acceleration programme.",
      },
      { property: "og:title", content: "AI Workplace Productivity Assistant" },
      {
        property: "og:description",
        content: "Five AI tools for everyday workplace productivity, with responsible-AI guidance.",
      },
    ],
  }),
  component: Dashboard,
});

const TOOLS = [
  {
    to: "/email" as const,
    icon: Mail,
    title: "Email Generator",
    description:
      "Turn a purpose and a few bullet points into a polished email in the tone you choose.",
  },
  {
    to: "/meetings" as const,
    icon: NotebookPen,
    title: "Meeting Summarizer",
    description:
      "Paste notes or a transcript and get a summary, decisions, action items and open questions.",
  },
  {
    to: "/tasks" as const,
    icon: ListChecks,
    title: "Task Planner",
    description:
      "Break a goal into tasks with priority, suggested deadlines, dependencies and effort.",
  },
  {
    to: "/research" as const,
    icon: Microscope,
    title: "Research Assistant",
    description:
      "Explore a topic with summaries, pros and cons, and questions worth investigating next.",
  },
  {
    to: "/chat" as const,
    icon: MessagesSquare,
    title: "AI Chatbot",
    description: "Ask anything about your work and keep the conversation going in one place.",
  },
];

function Dashboard() {
  return (
    <AppLayout
      title="Dashboard"
      description="Your AI toolkit for everyday workplace productivity"
    >
      <section className="rounded-2xl bg-primary p-8 text-primary-foreground shadow-sm">
        <p className="text-sm font-medium opacity-80">AI Skills Acceleration programme</p>
        <h2 className="font-display mt-2 text-3xl font-semibold">
          Welcome to your AI Workplace Productivity Assistant
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed opacity-90">
          Five practical tools that help you write, summarise, plan and research faster. Everything
          you type stays in your session, and every result is a first draft for you to review — not
          a final answer.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button asChild variant="secondary">
            <Link to="/email">Start with an email</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="border-primary-foreground/40 bg-transparent text-primary-foreground hover:bg-primary-foreground/10"
          >
            <Link to="/about">Responsible use guide</Link>
          </Button>
        </div>
      </section>

      <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {TOOLS.map((tool) => (
          <Card key={tool.to} className="flex flex-col">
            <CardHeader>
              <span className="flex size-10 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                <tool.icon className="size-5" />
              </span>
              <CardTitle className="font-display mt-3 text-base">{tool.title}</CardTitle>
              <CardDescription>{tool.description}</CardDescription>
            </CardHeader>
            <CardContent className="mt-auto">
              <Button asChild size="sm" className="w-full">
                <Link to={tool.to}>
                  Launch <ArrowRight className="size-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}

        <Card className="flex flex-col border-dashed">
          <CardHeader>
            <span className="flex size-10 items-center justify-center rounded-xl bg-muted text-muted-foreground">
              <ShieldCheck className="size-5" />
            </span>
            <CardTitle className="font-display mt-3 text-base">Human oversight first</CardTitle>
            <CardDescription>
              Check names, numbers, dates and commitments before you send or share anything.
            </CardDescription>
          </CardHeader>
          <CardContent className="mt-auto">
            <Button asChild size="sm" variant="outline" className="w-full">
              <Link to="/about">Read the guide</Link>
            </Button>
          </CardContent>
        </Card>
      </section>
    </AppLayout>
  );
}
