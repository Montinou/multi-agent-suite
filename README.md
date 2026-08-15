# Multi-Agent Suite (Eve)

Suite modular multi-agente construida con **Eve** (Vercel).

Orquestador + especialistas: **knowledge · creator · strategy · analytics**

## Agentes

| Agente       | Rol                                                                 |
|--------------|---------------------------------------------------------------------|
| **Root**     | Supervisor / Orquestador                                            |
| **knowledge**| Ingesta (texto + URL), embeddings, SharedKnowledgeStore             |
| **creator**  | Posts, hilos, variaciones A/B                                       |
| **strategy** | Campañas, calendarios, embudos, KPIs                                |
| **analytics**| Análisis de performance + experimentos                              |

## Estructura

```text
agent/
├── agent.ts
├── instructions.md
├── lib/
│   └── embeddings.ts              # cosine + pseudo-embeddings
├── skills/
│   └── content-guidelines.md
├── subagents/
│   ├── knowledge/   (fetch_url, ingest, store, query, list)
│   ├── creator/     (post, thread, variations)
│   ├── strategy/
│   └── analytics/
└── channels/eve.ts

evals/
├── evals.config.ts
├── smoke.eval.ts
├── routing-knowledge.eval.ts
└── routing-creator.eval.ts
```

## Features implementadas

### 1. Fetch / scrape de URL
`knowledge` → tool `fetch_url`  
Descarga la página, extrae título + texto limpio y lo deja listo para `ingest_text` / `store_note`.

### 3. SharedKnowledgeStore con embeddings
- Cada nota guarda un **embedding** (pseudo-embedding local por ahora).
- `query_knowledge` hace ranking por **similitud coseno**.
- Listo para reemplazar `localPseudoEmbedding` por `embed()` del AI SDK + modelo real (`openai/text-embedding-3-small`, etc.).

### 4. Agente Analytics
Nuevo subagent `analytics` con tool `analyze_performance`.  
Analiza métricas, identifica top/underperforming y propone experimentos.

### 5. Evals básicos
```bash
npx eve eval                  # corre todos
npx eve eval smoke
npx eve eval routing-knowledge
```

### 6. Variaciones A/B potentes
`creator` → tool `generate_variations`  
Fuerza ángulos distintos (storytelling, dato duro, pregunta, polarizante…) y recomienda cuál testear.

## Cómo correrlo

```bash
cd multi-agent-suite
npm install
npx eve dev          # TUI interactivo
npx eve eval         # correr evals
npx eve deploy       # producción en Vercel
```

## Flujos de ejemplo

```text
# URL → knowledge
"Procesá esta URL y guardala como nota: https://..."

# Knowledge → Creator + variaciones
"Con el conocimiento que tengamos, crea un hilo de LinkedIn y 3 variaciones A/B"

# Strategy
"Diseña un calendario de 4 semanas para LinkedIn + X sobre IA en marketing"

# Analytics
"Analiza el rendimiento de estos posts y dime qué experimentos correr:
Post A: 12k impresiones, 3.2% engagement
Post B: 8k impresiones, 1.1% engagement
..."
```

## Próximo upgrade recomendado (embeddings reales)

En `agent/lib/embeddings.ts` reemplazá `localPseudoEmbedding` por:

```ts
import { embed } from "ai";
// ...
const { embedding } = await embed({
  model: "openai/text-embedding-3-small", // vía AI Gateway
  value: text,
});
```

Y asegurate de tener credenciales de AI Gateway / provider.

## Agregar más agentes

```bash
mkdir -p agent/subagents/emailing/tools
# crear agent.ts + instructions.md
# actualizar agent/instructions.md
```

Eve los descubre solo.
