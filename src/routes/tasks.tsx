import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { AppLayout } from "@/components/AppLayout";
import { ResultCard } from "@/components/ResultPanel";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAi } from "@/lib/use-ai";

export const Route = createFileRoute("/tasks")({
  head: () => ({
    meta: [
      { title: "Task Planner | AI Workplace Assistant" },
      {
        name: "description",
        content:
          "Turn a goal or project into a task plan with priorities, suggested deadlines, dependencies and effort estimates.",
      },
      { property: "og:title", content: "Task Planner" },
      { property: "og:description", content: "From a goal to a sequenced, prioritised task plan." },
    ],
  }),
  component: TaskPlanner,
});

function TaskPlanner() {
  const [goal, setGoal] = useState("");
  const [timeframe, setTimeframe] = useState("");
  const [resources, setResources] = useState("");
  const { loading, error, result, demo, run, clear } = useAi();

  const generate = () => void run("tasks", { goal, timeframe, resources });

  return (
    <AppLayout title="Task Planner" description="Break a goal into a prioritised, sequenced plan">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)]">
        <Card>
          <CardHeader>
            <CardTitle className="font-display text-base">Your goal</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="goal">Goal or project</Label>
              <Textarea
                id="goal"
                rows={6}
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                placeholder="e.g. Launch an internal AI skills newsletter for 200 colleagues"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="timeframe">Timeframe</Label>
              <Input
                id="timeframe"
                value={timeframe}
                onChange={(e) => setTimeframe(e.target.value)}
                placeholder="e.g. 6 weeks, starting Monday"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="resources">People / resources available</Label>
              <Textarea
                id="resources"
                rows={3}
                value={resources}
                onChange={(e) => setResources(e.target.value)}
                placeholder="e.g. Me (2 days a week) and a designer for 3 days total"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Button onClick={generate} disabled={loading || goal.trim().length < 8}>
                {loading ? "Planning…" : "Generate plan"}
              </Button>
              <Button
                variant="ghost"
                onClick={() => {
                  setGoal("");
                  setTimeframe("");
                  setResources("");
                  clear();
                }}
              >
                Clear
              </Button>
            </div>
            {demo && (
              <p className="text-xs text-muted-foreground">
                Running in demo mode — add an AI key for real plans.
              </p>
            )}
          </CardContent>
        </Card>

        <ResultCard
          title="Task plan"
          loading={loading}
          error={error}
          result={result}
          onRegenerate={generate}
          onClear={clear}
          emptyHint="Your plan will appear here as a table of tasks with priority, deadlines, dependencies and effort."
        />
      </div>
    </AppLayout>
  );
}
