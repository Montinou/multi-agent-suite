import { defineTool } from "eve/tools";
import { z } from "zod";

/**
 * Normaliza un análisis de performance + recomendaciones.
 */
export default defineTool({
  description:
    "Estructura un análisis de rendimiento de contenidos/campañas y genera recomendaciones de optimización.",
  inputSchema: z.object({
    period: z.string().describe("Período analizado (ej: última semana, Q2)"),
    summary: z.string().describe("Resumen ejecutivo del performance"),
    top_performing: z
      .array(
        z.object({
          title_or_id: z.string(),
          metrics: z.record(z.union([z.string(), z.number()])),
          why_it_worked: z.string().optional(),
        })
      )
      .default([]),
    underperforming: z
      .array(
        z.object({
          title_or_id: z.string(),
          metrics: z.record(z.union([z.string(), z.number()])),
          possible_reasons: z.array(z.string()).default([]),
        })
      )
      .default([]),
    key_insights: z.array(z.string()).default([]),
    experiments_to_run: z
      .array(
        z.object({
          name: z.string(),
          hypothesis: z.string(),
          how_to_test: z.string(),
          success_metric: z.string(),
        })
      )
      .default([]),
    recommended_next_actions: z.array(z.string()).default([]),
  }),
  async execute(input) {
    return {
      ...input,
      generated_at: new Date().toISOString(),
      status: "ready",
    };
  },
});
