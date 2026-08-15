import { defineTool } from "eve/tools";
import { z } from "zod";

/**
 * Tool de utilidad para forzar un formato de salida consistente.
 * El LLM ya es muy bueno generando el contenido; esta tool ayuda a normalizar.
 */
export default defineTool({
  description:
    "Normaliza y estructura una pieza de contenido generada. Úsala al final para devolver un resultado limpio y listo para el orquestador.",
  inputSchema: z.object({
    platform: z.enum(["linkedin", "x", "instagram", "tiktok", "youtube", "blog", "other"]),
    format: z.enum(["post", "thread", "script", "carousel", "email", "other"]),
    content: z.string().describe("El contenido principal generado"),
    variations: z.array(z.string()).default([]),
    suggested_hashtags: z.array(z.string()).default([]),
    estimated_performance_notes: z.string().optional(),
  }),
  async execute(input) {
    return {
      ...input,
      generated_at: new Date().toISOString(),
      status: "ready",
    };
  },
});
