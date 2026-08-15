import { defineEval } from "eve/evals";

/**
 * Verifica que el orquestador use creator cuando se pide generar contenido.
 */
export default defineEval({
  description:
    "Routing: cuando se pide un post o hilo, debe invocar al subagent creator (idealmente después de knowledge si hace falta).",
  async test(t) {
    await t.send(
      "Crea un post corto de LinkedIn sobre los beneficios de usar agentes de IA en marketing. No necesitas knowledge previo."
    );
    t.succeeded();
    t.calledTool("creator");
  },
});
