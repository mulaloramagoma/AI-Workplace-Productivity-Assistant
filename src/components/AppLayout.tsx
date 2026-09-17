import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Mail,
  NotebookPen,
  ListChecks,
  Microscope,
  MessagesSquare,
  ShieldQuestion,
  Menu,
  X,
  Sparkles,
} from "lucide-react";
import { useState, type ReactNode } from "react";

import { cn } from "@/lib/utils";

export const NAV_ITEMS = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/email", label: "Email Generator", icon: Mail },
  { to: "/meetings", label: "Meeting Summarizer", icon: NotebookPen },
  { to: "/tasks", label: "Task Planner", icon: ListChecks },
  { to: "/research", label: "Research Assistant", icon: Microscope },
  { to: "/chat", label: "AI Chatbot", icon: MessagesSquare },
  { to: "/about", label: "About / Help", icon: ShieldQuestion },
] as const;

export function AppLayout({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-72 border-r border-sidebar-border bg-sidebar transition-transform duration-200 lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-16 items-center gap-2 border-b border-sidebar-border px-5">
          <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Sparkles className="size-5" />
          </span>
          <div className="leading-tight">
            <p className="font-display text-sm font-semibold text-sidebar-foreground">
              AI Workplace
            </p>
            <p className="text-xs text-muted-foreground">Productivity Assistant</p>
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close navigation"
            className="ml-auto rounded-md p-1 text-muted-foreground lg:hidden"
          >
            <X className="size-5" />
          </button>
        </div>
        <nav className="space-y-1 p-3">
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                )}
              >
                <item.icon className="size-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <p className="absolute bottom-4 left-5 right-5 text-xs text-muted-foreground">
          AI Skills Acceleration programme. Always review AI output before acting on it.
        </p>
      </aside>

      {open && (
        <button
          type="button"
          aria-label="Close navigation overlay"
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-30 bg-foreground/40 lg:hidden"
        />
      )}

      <div className="lg:pl-72">
        <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-border bg-background/90 px-4 backdrop-blur sm:px-8">
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Open navigation"
            className="rounded-md p-2 text-muted-foreground hover:bg-accent lg:hidden"
          >
            <Menu className="size-5" />
          </button>
          <div className="min-w-0">
            <h1 className="font-display truncate text-lg font-semibold">{title}</h1>
            <p className="truncate text-xs text-muted-foreground">{description}</p>
          </div>
        </header>
        <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-8">{children}</main>
      </div>
    </div>
  );
}
