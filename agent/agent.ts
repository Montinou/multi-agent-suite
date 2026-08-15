import { defineAgent } from "eve";

export default defineAgent({
  model: "anthropic/claude-sonnet-4.5",
  // El orquestador necesita más presupuesto de contexto para coordinar múltiples subagents
  // Ajusta según tu uso real
});
