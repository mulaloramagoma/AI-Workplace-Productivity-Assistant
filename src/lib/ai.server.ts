/**
 * AI service layer.
 *
 * Configuration (all optional):
 *   AI_API_URL  - OpenAI-compatible base URL. Defaults to the Lovable AI Gateway.
 *   AI_API_KEY  - API key for that endpoint. Falls back to LOVABLE_API_KEY.
 *   AI_MODEL    - Model identifier. Defaults to openai/gpt-6-astra.
 *
 * When no key is available at all, the layer answers in DEMO MODE with a clearly
 * labelled sample response so the app is usable out of the box.
 */

export type AiTool = "email" | "meeting" | "tasks" | "research" | "chat";

export interface AiRequest {
  tool: AiTool;
  fields: Record<string, string>;
  history?: { role: "user" | "assistant"; content: string }[];
}

export interface AiResult {
  text: string;
  demo: boolean;
  model: string;
}

const DEFAULT_URL = "https://ai.gateway.lovable.dev/v1";
const DEFAULT_MODEL = "openai/gpt-6-astra";

const SHARED_CONSTRAINTS = `Constraints:
- Use ONLY the information supplied by the user. Never invent names, dates, figures or facts.
- Where something is missing or ambiguous, write "Not specified" or list it as an open question.
- Clearly label anything that is your own suggestion rather than user-supplied fact.
- Output clean, readable plain text with markdown-style headings and bullets. No preamble, no sign-off from you.`;

function buildPrompt(req: AiRequest): { system: string; user: string } {
  const f = req.fields;
  const field = (label: string, value?: string) =>
    value && value.trim() ? `${label}: ${value.trim()}` : `${label}: Not specified`;

  switch (req.tool) {
    case "email":
      return {
        system: `Role: You are a professional workplace communication assistant.
Task: Draft a single, ready-to-send email.
Output format: "Subject: <line>", a blank line, then the email body with greeting, paragraphs and a sign-off placeholder [Your name].
${SHARED_CONSTRAINTS}`,
        user: [
          field("Recipient / purpose", f["recipient"]),
          field("Email type", f["emailType"]),
          field("Key points to cover", f["keyPoints"]),
          field("Tone", f["tone"]),
          field("Additional instructions", f["extra"]),
        ].join("\n"),
      };
    case "meeting":
      return {
        system: `Role: You are a meticulous meeting analyst.
Task: Turn raw meeting notes or a transcript into a structured record.
Output format, using exactly these headings:
## Summary
## Key Discussion Points
## Decisions Made
## Action Items
(one bullet each: task - Owner: <name or Not specified> - Deadline: <date or Not specified>)
## Outstanding Questions
${SHARED_CONSTRAINTS}
- Groundedness is critical: every line must be traceable to the supplied notes.`,
        user: [
          field("Meeting type", f["meetingType"]),
          field("Summary length", f["length"]),
          `Notes / transcript:\n${f["notes"]?.trim() || "Not specified"}`,
        ].join("\n"),
      };
    case "tasks":
      return {
        system: `Role: You are an experienced delivery planner.
Task: Break the goal or project into an actionable task plan.
Output format: a markdown table with the columns
| Task | Description | Priority | Suggested Deadline | Dependencies | Estimated Effort |
Priority must be High, Medium or Low. Deadlines are relative (e.g. "Week 1") unless the user gave real dates.
After the table add a short "### Assumptions" list naming anything you inferred.
${SHARED_CONSTRAINTS}`,
        user: [
          field("Goal / project", f["goal"]),
          field("Timeframe", f["timeframe"]),
          field("People / resources available", f["resources"]),
        ].join("\n"),
      };
    case "research":
      return {
        system: `Role: You are a careful research assistant.
Task: Help the user explore a topic without overstating certainty.
Output format: include ONLY the sections the user selected, each under a "## " heading.
Begin with a "## What you told me" section restating the user's own facts, so user-supplied information is clearly separated from your suggestions. Prefix every AI-generated inference with "AI suggestion:".
${SHARED_CONSTRAINTS}
- State plainly when a claim should be verified against a primary source.`,
        user: [
          field("Topic / question", f["topic"]),
          field("Known facts / context from the user", f["context"]),
          field("Requested sections", f["sections"]),
        ].join("\n"),
      };
    case "chat":
    default:
      return {
        system: `Role: You are a helpful workplace productivity assistant for an AI Skills Acceleration programme.
Task: Answer the user's questions clearly and practically.
Output format: concise markdown-style text; use bullets for lists.
${SHARED_CONSTRAINTS}`,
        user: f["message"] ?? "",
      };
  }
}

function demoResponse(req: AiRequest): string {
  const note =
    "> DEMO MODE - no AI key is configured, so this is a sample response. Add AI_API_KEY to get real results.\n\n";
  switch (req.tool) {
    case "email":
      return `${note}Subject: ${req.fields["recipient"] || "Quick update"}

Hi there,

Thanks for your patience. Here is a short update covering ${req.fields["keyPoints"] || "the points you listed"}.

Happy to talk through any of this if helpful.

Best regards,
[Your name]`;
    case "meeting":
      return `${note}## Summary
Sample structured summary of the notes you pasted.

## Key Discussion Points
- Point one
- Point two

## Decisions Made
- Not specified

## Action Items
- Follow up on the agreed next step - Owner: Not specified - Deadline: Not specified

## Outstanding Questions
- Who owns the follow-up?`;
    case "tasks":
      return `${note}| Task | Description | Priority | Suggested Deadline | Dependencies | Estimated Effort |
| --- | --- | --- | --- | --- | --- |
| Define scope | Agree the outcome and success measures | High | Week 1 | None | 0.5 day |
| Draft plan | Turn scope into a sequenced plan | Medium | Week 2 | Define scope | 1 day |

### Assumptions
- AI suggestion: a two-week starting horizon.`;
    case "research":
      return `${note}## What you told me
- ${req.fields["topic"] || "Not specified"}

## Summary
AI suggestion: a sample overview of the topic, to be verified against primary sources.`;
    default:
      return `${note}I'm running without an AI key, so I can only show sample replies. Ask your administrator to set AI_API_KEY.`;
  }
}

async function readStream(res: Response): Promise<string> {
  const reader = res.body?.getReader();
  if (!reader) return "";
  const decoder = new TextDecoder();
  let buffer = "";
  let text = "";
  for (;;) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";
    for (const line of lines) {
      if (!line.startsWith("data:")) continue;
      const data = line.slice(5).trim();
      if (!data || data === "[DONE]") continue;
      try {
        const evt = JSON.parse(data) as {
          type?: string;
          delta?: string;
          choices?: { delta?: { content?: string } }[];
        };
        if (evt.type === "response.output_text.delta" && evt.delta) text += evt.delta;
        else if (evt.choices?.[0]?.delta?.content) text += evt.choices[0].delta.content;
      } catch {
        // ignore malformed keep-alive lines
      }
    }
  }
  return text;
}

export async function runAi(req: AiRequest): Promise<AiResult> {
  const baseUrl = (process.env["AI_API_URL"] || DEFAULT_URL).replace(/\/$/, "");
  const model = process.env["AI_MODEL"] || DEFAULT_MODEL;
  const apiKey = process.env["AI_API_KEY"] || process.env["LOVABLE_API_KEY"];

  if (!apiKey) return { text: demoResponse(req), demo: true, model: "demo" };

  const { system, user } = buildPrompt(req);
  const input: { role: string; content: { type: string; text: string }[] }[] = [
    { role: "system", content: [{ type: "input_text", text: system }] },
  ];
  for (const turn of req.history ?? []) {
    input.push({
      role: turn.role,
      content: [
        { type: turn.role === "assistant" ? "output_text" : "input_text", text: turn.content },
      ],
    });
  }
  input.push({ role: "user", content: [{ type: "input_text", text: user }] });

  let res: Response;
  try {
    res = await fetch(`${baseUrl}/responses`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Lovable-API-Key": apiKey,
        Authorization: `Bearer ${apiKey}`,
        "X-Lovable-AIG-SDK": "fetch",
      },
      body: JSON.stringify({
        model,
        input,
        stream: true,
        store: false,
        reasoning: { effort: "low" },
      }),
    });
  } catch (error) {
    throw new Error(
      `Could not reach the AI service. ${error instanceof Error ? error.message : ""}`.trim(),
    );
  }

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    if (res.status === 429)
      throw new Error("The AI service is busy right now. Please wait a moment and try again.");
    if (res.status === 402)
      throw new Error("AI credits are exhausted. Please top up to keep using the assistant.");
    if (res.status === 401 || res.status === 403)
      throw new Error("The AI service rejected the configured key. Check AI_API_KEY.");
    throw new Error(`AI request failed (${res.status}). ${detail.slice(0, 300)}`);
  }

  const text = await readStream(res);
  if (!text.trim()) throw new Error("The AI service returned an empty response. Please try again.");
  return { text, demo: false, model };
}
