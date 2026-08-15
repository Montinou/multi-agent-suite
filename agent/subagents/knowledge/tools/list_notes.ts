import { defineTool } from "eve/tools";
import { z } from "zod";

/**
 * Lista las notas más recientes del SharedKnowledgeStore.
 */
export default defineTool({
  description:
    "Lista las notas más recientes del SharedKnowledgeStore (sin filtrar). Útil para ver qué conocimiento ya existe.",
  inputSchema: z.object({
    limit: z.number().int().min(1).max(30).default(10),
  }),
  async execute({ limit }, ctx) {
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

    const notes: any[] = [];
    const recentIds = index.slice(-limit).reverse();

    for (const id of recentIds) {
      try {
        const raw = await sandbox.readFile(`knowledge/notes/${id}.json`);
        const note = JSON.parse(raw);
        notes.push({
          id: note.id,
          title: note.title,
          summary: note.summary,
          tags: note.tags,
          created_at: note.created_at,
        });
      } catch {
        // skip corrupted
      }
    }

    return {
      notes,
      count: notes.length,
      message: notes.length === 0 ? "No hay notas." : `Mostrando ${notes.length} nota(s) recientes.`,
    };
  },
});
