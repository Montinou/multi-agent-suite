import { defineEval } from "eve/evals";
import { includes } from "eve/evals/expect";

/**
 * Smoke test: el orquestador responde y no se cae en un saludo simple.
 */
export default defineEval({
  description: "Smoke: el agente responde a un saludo básico.",
  async test(t) {
    await t.send("Hola, ¿qué agentes tienes disponibles?");
    t.succeeded();
    // Debería mencionar al menos knowledge o creator
    t.check(t.reply, includes("knowledge"));
  },
});
