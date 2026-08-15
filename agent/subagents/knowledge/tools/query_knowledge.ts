import { defineTool } from "eve/tools";
import { z } from "zod";
import {
  localPseudoEmbedding,
  rankBySimilarity,
} from "../../../lib/embeddings.js";

/**
 * Consulta el SharedKnowledgeStore con búsqueda semántica (embeddings) + filtros.
 */
export default defineTool({
  description:
    "Busca y recupera notas del SharedKnowledgeStore usando similitud semántica (embeddings) y/o filtros por tags.",
  inputSchema: z.object({
    query: z
      .string()
      .optional()
      .describe("Consulta en lenguaje natural (búsqueda semántica)"),
    tags: z
      .array(z.string())
      .optional()
      .describe("Filtrar notas que contengan alguno de estos tags"),
    limit: z.number().int().min(1).max(20).default(5),
  }),
  async execute({ query, tags, limit }, ctx) {
    const sandbox = await ctx.getSandbox();

    let index: string[] = [];
    try {
      const raw = await sandbox.readFile("knowledge/index.json");
      index = JSON.parse(raw);
    } catch {
      return {
        notes: [],
        message: "El Knowledge Store está vacío todavía.",
      };
    }

    const candidates: any[] = [];

    for (const id of index) {
      try {
        const raw = await sandbox.readFile(`knowledge/notes/${id}.json`);
        const note = JSON.parse(raw);

        if (tags && tags.length > 0) {
          const hasTag = tags.some((t) =>
            (note.tags || [])
              .map((x: string) => x.toLowerCase())
              .includes(t.toLowerCase())
          );
          if (!hasTag) continue;
        }

        candidates.push({
          id: note.id,
          title: note.title,
          summary: note.summary,
          key_insights: note.key_insights,
          tags: note.tags,
          source: note.source,
          created_at: note.created_at,
          embedding:
            note.embedding ||
            localPseudoEmbedding(note.title + " " + note.summary),
        });
      } catch {
        // skip
      }
    }

    let results = candidates;

    if (query && query.trim()) {
      const qEmb = localPseudoEmbedding(query);
      results = rankBySimilarity(qEmb, candidates, limit);
    } else {
      results = candidates
        .sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )
        .slice(0, limit);
    }

    const notes = results.map(({ embedding, ...rest }) => rest);

    return {
      notes,
      count: notes.length,
      search_mode: query ? "semantic" : "recency",
      message:
        notes.length === 0
          ? "No se encontraron notas que coincidan con los criterios."
          : `Se recuperaron ${notes.length} nota(s) (${
              query ? "búsqueda semántica" : "más recientes"
            }).`,
    };
  },
});
