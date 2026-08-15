import { defineTool } from "eve/tools";
import { z } from "zod";

/**
 * Genera y estructura variaciones A/B/C de un contenido base.
 * El LLM produce las variaciones; esta tool las normaliza y etiqueta.
 */
export default defineTool({
  description:
    "Estructura 3-5 variaciones A/B de un post o hilo. Cada variación debe cambiar ángulo, tono o gancho manteniendo el mensaje central.",
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
    format: z.enum(["post", "thread", "script", "carousel"]).default("post"),
    base_message: z
      .string()
      .describe("Mensaje / insight central que todas las variaciones deben preservar"),
    variations: z
      .array(
        z.object({
          label: z.string().describe("A, B, C..."),
          angle: z
            .string()
            .describe("Ángulo o enfoque de esta variación (ej: storytelling, dato duro, pregunta)"),
          content: z.string().min(10),
          why_it_works: z
            .string()
            .optional()
            .describe("Por qué esta variación podría performar bien"),
        })
      )
      .min(2)
      .max(6),
    recommended: z
      .string()
      .optional()
      .describe("Label de la variación recomendada (A/B/C...)"),
    suggested_hashtags: z.array(z.string()).default([]),
  }),
  async execute(input) {
    return {
      platform: input.platform,
      format: input.format,
      base_message: input.base_message,
      variation_count: input.variations.length,
      variations: input.variations,
      recommended: input.recommended ?? input.variations[0]?.label ?? null,
      suggested_hashtags: input.suggested_hashtags,
      generated_at: new Date().toISOString(),
      status: "ready",
      testing_tip:
        "Publica las variaciones en días distintos o a audiencias segmentadas y compara engagement (CTR, comentarios, guardados).",
    };
  },
});
