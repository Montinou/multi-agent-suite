import { defineTool } from "eve/tools";
import { z } from "zod";

/**
 * Procesa texto crudo (artículo, nota, transcript, etc.) y lo convierte
 * en una nota estructurada lista para guardar o pasar a otros agentes.
 * No guarda automáticamente: el agente decide si llamar a store_note después.
 */
export default defineTool({
  description:
    "Analiza un texto crudo y genera una estructura de nota (title, summary, key_insights, tags). Úsala como primer paso de ingesta antes de guardar o sintetizar.",
  inputSchema: z.object({
    text: z.string().min(20).describe("Texto completo a procesar"),
    source: z.string().optional().describe("URL o origen del texto"),
    preferred_tags: z
      .array(z.string())
      .optional()
      .describe("Tags sugeridos por el usuario u orquestador"),
  }),
  async execute({ text, source, preferred_tags }) {
    const preview = text.slice(0, 400).replace(/\s+/g, " ").trim();

    return {
      status: "ready_for_analysis",
      text_length: text.length,
      source: source ?? null,
      preferred_tags: preferred_tags ?? [],
      preview,
      instruction:
        "Ahora genera title, summary, key_insights y tags a partir de este texto. Luego decide si llamar a store_note.",
    };
  },
});
