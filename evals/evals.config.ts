import { defineEvalConfig } from "eve/evals";

export default defineEvalConfig({
  // Modelo usado como juez cuando se necesite LLM-as-judge
  judge: { model: "anthropic/claude-sonnet-4.5" },
});
