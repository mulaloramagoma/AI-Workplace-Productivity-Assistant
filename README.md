# AI Workplace Productivity Assistant

A responsive SaaS-style dashboard built for the **AI Skills Acceleration programme**. It bundles
five practical AI tools behind one interface, with responsible-AI guidance built in.

## Features

| Tool | What it does |
| --- | --- |
| **Dashboard** | Welcome banner, assistant overview and quick-launch cards for every tool. |
| **Email Generator** | Recipient/purpose, email type, key points, tone (Professional, Friendly, Formal, Concise) and extra instructions → formatted email preview with Generate, Copy, Clear and Regenerate. |
| **Meeting Summarizer** | Paste notes or a transcript, choose meeting type and summary length → Summary, Key Discussion Points, Decisions Made, Action Items (owner & deadline) and Outstanding Questions, strictly grounded in your notes. |
| **Task Planner** | Enter a goal, timeframe and resources → a table of Task, Description, Priority, Suggested Deadline, Dependencies and Estimated Effort, plus stated assumptions. |
| **Research Assistant** | Enter a topic and pick sections (Summary, Key points, Pros & cons, Questions to investigate, Research outline). Your own facts are restated first; AI inferences are labelled "AI suggestion:". |
| **AI Chatbot** | Conversational assistant with user/assistant bubbles, loading indicator, copy response and clear conversation. |
| **About / Help** | Responsible-AI guide: human oversight, verifying critical details, privacy & confidentiality, responsible usage, and a pre-send checklist. |

## Tech stack

- TanStack Start (React 19, file-based routing, server functions)
- TypeScript, Tailwind CSS v4, shadcn/ui, lucide-react
- Server-side AI service layer calling an OpenAI-compatible endpoint

## Getting started

```sh
npm install
cp .env.example .env   # optional — the app runs in demo mode without a key
npm run dev
```

The app starts on http://localhost:8080.

## Configuration

All variables are **optional and server-side only** (never prefix them with `VITE_`).

| Variable | Default | Purpose |
| --- | --- | --- |
| `AI_API_URL` | `https://ai.gateway.lovable.dev/v1` | OpenAI-compatible base URL. |
| `AI_API_KEY` | falls back to `LOVABLE_API_KEY` | API key for that endpoint. |
| `AI_MODEL` | `openai/gpt-6-astra` | Model identifier. |

**Demo mode:** with no key available, every tool returns a clearly labelled sample response, so the
app works immediately out of the box.

## AI service layer

`src/lib/ai.server.ts` holds the whole integration:

- **Structured prompt templates** per tool, each with Role, Task, Context, Output format and
  Constraints.
- **Groundedness rules** shared across tools — no invented names, dates or figures; missing
  information is returned as "Not specified" or an open question; AI inferences are labelled.
- **Robust error handling** — friendly messages for rate limits (429), exhausted credits (402),
  rejected keys (401/403), network failures and empty responses.
- **Streaming transport** consumed server-side, so long generations do not time out.

`src/lib/ai.functions.ts` exposes it as a validated TanStack server function, and `src/lib/use-ai.ts`
is the React hook used by every page.

## Project structure

```
src/
  components/      AppLayout (sidebar shell), ResultPanel (output rendering, copy)
  lib/             ai.server.ts, ai.functions.ts, use-ai.ts
  routes/          index, email, meetings, tasks, research, chat, about
```

## Responsible use

Outputs are drafts, not decisions. Review everything, verify names, dates, figures and commitments,
keep confidential and personal data out of your inputs, and disclose AI assistance where your
organisation requires it. See the in-app **About / Help** page for the full guide.
