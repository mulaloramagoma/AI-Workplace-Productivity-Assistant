import { useCallback, useState } from "react";

import { generateAi } from "./ai.functions";

export type AiTool = "email" | "meeting" | "tasks" | "research" | "chat";

export function useAi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState("");
  const [demo, setDemo] = useState(false);

  const run = useCallback(
    async (
      tool: AiTool,
      fields: Record<string, string>,
      history?: { role: "user" | "assistant"; content: string }[],
    ) => {
      setLoading(true);
      setError(null);
      try {
        const res = await generateAi({ data: { tool, fields, ...(history ? { history } : {}) } });
        setResult(res.text);
        setDemo(res.demo);
        return res.text;
      } catch (err) {
        const message =
          err instanceof Error && err.message
            ? err.message
            : "Something went wrong contacting the AI service. Please try again.";
        setError(message);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const clear = useCallback(() => {
    setResult("");
    setError(null);
  }, []);

  return { loading, error, result, demo, run, clear, setError };
}
