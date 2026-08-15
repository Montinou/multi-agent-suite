import { defineTool } from "eve/tools";
import { z } from "zod";

/**
 * Descarga el contenido de una URL y extrae texto legible.
 * Implementación simple (fetch + strip HTML básico).
 * Para sitios complejos o JS-heavy se puede mejorar con un browser tool / MCP.
 */
export default defineTool({
  description:
    "Descarga una URL y extrae el texto principal (título + contenido). Úsala como primer paso cuando el usuario pase un link en vez de texto.",
  inputSchema: z.object({
    url: z.string().url().describe("URL completa a procesar"),
    max_chars: z
      .number()
      .int()
      .min(500)
      .max(30000)
      .default(12000)
      .describe("Límite de caracteres del texto extraído"),
  }),
  async execute({ url, max_chars }) {
    try {
      const res = await fetch(url, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (compatible; MultiAgentSuite/1.0; +https://example.com/bot)",
          Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        },
        signal: AbortSignal.timeout(15000),
      });

      if (!res.ok) {
        return {
          success: false,
          error: `HTTP ${res.status} ${res.statusText}`,
          url,
        };
      }

      const contentType = res.headers.get("content-type") || "";
      const raw = await res.text();

      if (contentType.includes("text/plain")) {
        const text = raw.slice(0, max_chars);
        return {
          success: true,
          url,
          title: null,
          text,
          char_count: text.length,
          content_type: contentType,
        };
      }

      let title: string | null = null;
      const titleMatch = raw.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
      if (titleMatch) {
        title = titleMatch[1].replace(/\s+/g, " ").trim();
      }

      let text = raw
        .replace(/<script[\s\S]*?<\/script>/gi, " ")
        .replace(/<style[\s\S]*?<\/style>/gi, " ")
        .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ")
        .replace(/<!--[\s\S]*?-->/g, " ")
        .replace(/<[^>]+>/g, " ")
        .replace(/&nbsp;/g, " ")
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/\s+/g, " ")
        .trim();

      text = text.slice(0, max_chars);

      return {
        success: true,
        url,
        title,
        text,
        char_count: text.length,
        content_type: contentType,
        instruction:
          "Ahora usa ingest_text o analiza este contenido y genera una nota estructurada. Luego decide si guardar con store_note.",
      };
    } catch (err: any) {
      return {
        success: false,
        error: err?.message || String(err),
        url,
      };
    }
  },
});
