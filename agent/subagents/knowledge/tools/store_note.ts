import { defineTool } from "eve/tools";
import { z } from "zod";
import { localPseudoEmbedding } from "../../../lib/embeddings.js";

/**
 * Guarda una nota estructurada + embedding en el SharedKnowledgeStore (sandbox).
 */
export default defineTool({
  description:
    "Guarda una nota de conocimiento estructurada (con embedding) en el SharedKnowledgeStore. Devuelve el ID de la nota.",
  inputSchema: z.object({
    title: z.string().min(1).describe("Título corto de la nota"),
    summary: z.string().describe("Resumen de 2-4 oraciones"),
    key_insights: z.array(z.string()).describe("Lista de insights clave"),
    tags: z.array(z.string()).default([]).describe("Tags semánticos"),
    content: z.string().describe("Contenido completo o procesado"),
    source: z.string().optional().describe("URL o origen de la información"),
  }),
  async execute({ title, summary, key_insights, tags, content, source }, ctx) {
    const sandbox = await ctx.getSandbox();
    const id = `note_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

    const embedText = [title, summary, ...key_insights, ...(tags || [])].join(" ");
    const embedding = localPseudoEmbedding(embedText);

    const note = {
      id,
      title,
      summary,
      key_insights,
      tags,
      content,
      source: source ?? null,
      embedding,
      created_at: new Date().toISOString(),
    };

    await sandbox.writeFile(
      `knowledge/notes/${id}.json`,
      JSON.stringify(note, null, 2)
    );

    let index: string[] = [];
    try {
      const existing = await sandbox.readFile("knowledge/index.json");
      index = JSON.parse(existing);
    } catch {
      // empty
    }
    index.push(id);
    await sandbox.writeFile(
      "knowledge/index.json",
      JSON.stringify(index, null, 2)
    );

    return {
      success: true,
      note_id: id,
      message: `Nota "${title}" guardada correctamente (con embedding).`,
      has_embedding: true,
    };
  },
});
