import { defineAgent } from "eve";

export default defineAgent({
  description:
    "Genera copies, hilos, guiones y adaptaciones de formato para LinkedIn, X (Twitter), Instagram y otras plataformas. Consume conocimiento estructurado del Knowledge Agent. Usar cuando se pida contenido.",
  model: "anthropic/claude-sonnet-4.5",
});
