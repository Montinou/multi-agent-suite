/**
 * Utilidades de embeddings para el SharedKnowledgeStore.
 *
 * En producción se recomienda usar un modelo de embeddings real vía AI Gateway
 * (ej. openai/text-embedding-3-small) o un provider directo.
 *
 * Aquí implementamos:
 * 1. Generación de embedding (cuando hay modelo disponible)
 * 2. Similaridad coseno
 * 3. Fallback a búsqueda por texto si no hay embeddings
 */

export type Embedding = number[];

/** Similaridad coseno entre dos vectores */
export function cosineSimilarity(a: Embedding, b: Embedding): number {
  if (a.length !== b.length || a.length === 0) return 0;
  let dot = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  const denom = Math.sqrt(normA) * Math.sqrt(normB);
  return denom === 0 ? 0 : dot / denom;
}

/**
 * Genera un embedding "local" determinista a partir del texto.
 * No es semántico real, pero permite que el pipeline de vector search funcione
 * end-to-end sin depender de una API key de embeddings en desarrollo.
 *
 * Reemplazar por `embed()` del AI SDK en producción.
 */
export function localPseudoEmbedding(text: string, dims = 64): Embedding {
  const vec = new Array(dims).fill(0);
  const normalized = text.toLowerCase().replace(/\s+/g, " ").trim();
  for (let i = 0; i < normalized.length; i++) {
    const code = normalized.charCodeAt(i);
    const idx = (code * (i + 1)) % dims;
    vec[idx] += 1;
  }
  // L2 normalize
  const norm = Math.sqrt(vec.reduce((s, v) => s + v * v, 0)) || 1;
  return vec.map((v) => v / norm);
}

export function rankBySimilarity(
  queryEmbedding: Embedding,
  candidates: { id: string; embedding: Embedding; [k: string]: any }[],
  topK = 5
) {
  return candidates
    .map((c) => ({
      ...c,
      score: cosineSimilarity(queryEmbedding, c.embedding),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);
}
