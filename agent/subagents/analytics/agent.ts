import { defineAgent } from "eve";

export default defineAgent({
  description:
    "Analiza métricas de rendimiento de contenidos y campañas. Genera insights, identifica qué funciona y recomienda optimizaciones. Usar cuando se pidan reportes, análisis de performance o recomendaciones basadas en datos.",
  model: "anthropic/claude-sonnet-4.5",
});
