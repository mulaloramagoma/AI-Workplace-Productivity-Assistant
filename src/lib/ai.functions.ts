import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { runAi } from "./ai.server";

const RequestSchema = z.object({
  tool: z.enum(["email", "meeting", "tasks", "research", "chat"]),
  fields: z.record(z.string()),
  history: z
    .array(z.object({ role: z.enum(["user", "assistant"]), content: z.string() }))
    .max(20)
    .optional(),
});

export const generateAi = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => RequestSchema.parse(input))
  .handler(async ({ data }) => {
    return runAi({ ...data, history: data.history ?? [] });
  });
