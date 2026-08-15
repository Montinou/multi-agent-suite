import { defineAgent } from "eve";

export default defineAgent({
  description:
    "Diseña campañas, calendarios editoriales, embudos y KPIs a partir de objetivos de negocio y del repositorio de conocimiento. Usar para estrategia de contenido y marketing de largo plazo.",
  model: "anthropic/claude-sonnet-4.5",
});
