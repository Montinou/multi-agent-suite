import { defineAgent } from "eve";

export default defineAgent({
  description:
    "Ingesta, clasifica, etiqueta y sintetiza conocimiento a partir de texto, URLs o notas. Escribe y consulta el SharedKnowledgeStore. Usar siempre que se necesite estructurar o recuperar información.",
  model: "anthropic/claude-sonnet-4.5",
});
