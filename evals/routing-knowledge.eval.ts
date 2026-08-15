import { defineEval } from "eve/evals";

/**
 * Verifica que el orquestador delegue a knowledge cuando se pide estructurar texto.
 */
export default defineEval({
  description:
    "Routing: cuando se pide resumir/guardar conocimiento, debe invocar al subagent knowledge.",
  async test(t) {
    await t.send(
      "Toma este texto y conviértelo en una nota estructurada (no hace falta guardarla todavía):\n\nLa inteligencia artificial generativa está cambiando la forma en que creamos contenido. Las empresas que la adoptan temprano están viendo mejoras en productividad del 30-40%."
    );
    t.succeeded();
    // Esperamos que haya llamado al subagent knowledge
    t.calledTool("knowledge");
  },
});
