import { defineTool } from "eve/tools";
import { z } from "zod";

/**
 * Normaliza un plan estratégico para que el orquestador y el usuario lo reciban limpio.
 */
export default defineTool({
  description:
    "Estructura un plan estratégico (campaña, calendario, embudo o KPIs) en un formato consistente.",
  inputSchema: z.object({
    type: z.enum(["campaign", "calendar", "funnel", "kpis", "audit"]),
    title: z.string(),
    summary: z.string(),
    objectives: z.array(z.string()).default([]),
    audience: z.string().optional(),
    key_messages: z.array(z.string()).default([]),
    channels: z.array(z.string()).default([]),
    timeline: z.string().optional(),
    kpis: z
      .array(
        z.object({
          name: z.string(),
          target: z.string().optional(),
          rationale: z.string().optional(),
        })
      )
      .default([]),
    content_pillars: z.array(z.string()).default([]),
    next_actions: z.array(z.string()).default([]),
  }),
  async execute(input) {
    return {
      ...input,
      generated_at: new Date().toISOString(),
      status: "ready",
    };
  },
});
