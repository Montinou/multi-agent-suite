import { defineTool } from "eve/tools";
import { z } from "zod";

/**
 * Normaliza un post individual (LinkedIn, Instagram, X, etc.).
 */
export default defineTool({
  description:
    "Estructura un post individual listo para publicar. Úsala al final de la generación de un copy.",
  inputSchema: z.object({
    platform: z.enum([
      "linkedin",
      "x",
      "instagram",
      "tiktok",
      "facebook",
      "blog",
      "other",
    ]),
    content: z.string().min(10).describe("Texto completo del post"),
    hook: z.string().optional().describe("Primera línea / gancho"),
    cta: z.string().optional(),
    suggested_hashtags: z.array(z.string()).default([]),
    variations: z
      .array(z.string())
      .default([])
      .describe("Variaciones A/B del mismo post"),
    estimated_performance_notes: z.string().optional(),
  }),
  async execute(input) {
    return {
      platform: input.platform,
      format: "post",
      content: input.content,
      hook: input.hook ?? null,
      cta: input.cta ?? null,
      suggested_hashtags: input.suggested_hashtags,
      variations: input.variations,
      estimated_performance_notes: input.estimated_performance_notes ?? null,
      character_count: input.content.length,
      generated_at: new Date().toISOString(),
      status: "ready",
    };
  },
});
