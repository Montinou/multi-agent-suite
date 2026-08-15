import { defineTool } from "eve/tools";
import { z } from "zod";

/**
 * Fuerza un formato limpio de hilo (especialmente útil para X / LinkedIn).
 * El LLM genera el contenido; esta tool solo normaliza la estructura.
 */
export default defineTool({
  description:
    "Estructura un hilo de contenido (X o LinkedIn) en un formato consistente listo para publicar. Usa esta tool al final de la generación de un hilo.",
  inputSchema: z.object({
    platform: z.enum(["x", "linkedin"]).describe("Plataforma objetivo del hilo"),
    tweets: z
      .array(
        z.object({
          position: z.number().int().min(1),
          text: z.string().min(1),
        })
      )
      .min(2)
      .max(15)
      .describe("Lista ordenada de tweets/posts del hilo"),
    hook: z.string().describe("El gancho principal del primer tweet"),
    cta: z.string().optional().describe("Call to action final"),
    suggested_hashtags: z.array(z.string()).default([]),
  }),
  async execute(input) {
    const formatted = input.tweets
      .sort((a, b) => a.position - b.position)
      .map((t) => `${t.position}/${input.tweets.length}\n${t.text}`)
      .join("\n\n---\n\n");

    return {
      platform: input.platform,
      format: "thread",
      hook: input.hook,
      cta: input.cta ?? null,
      tweet_count: input.tweets.length,
      content: formatted,
      tweets: input.tweets,
      suggested_hashtags: input.suggested_hashtags,
      generated_at: new Date().toISOString(),
      status: "ready",
    };
  },
});
