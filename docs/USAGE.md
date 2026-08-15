# Guía de uso rápida

## Arrancar

```bash
cd multi-agent-suite
npm install
npx eve dev
```

## Prompts de prueba

### Knowledge + URL
```
Procesá esta URL, generá una nota estructurada y guardala:
https://ejemplo.com/articulo
```

### Creator + variaciones A/B
```
Con el conocimiento disponible, crea un post de LinkedIn sobre el tema principal
y genera 3 variaciones A/B con ángulos distintos.
```

### Strategy
```
Diseña un calendario editorial de 4 semanas para LinkedIn y X centrado en IA aplicada a marketing.
Incluye pillars, frecuencia y KPIs.
```

### Analytics
```
Analiza estas métricas y proponé experimentos:

Post A – "5 formas de usar IA": 14.2k impresiones, 4.1% engagement, 89 comentarios
Post B – "Por qué fallan los prompts": 6.8k impresiones, 1.3% engagement, 12 comentarios
Post C – hilo de 8 tweets: 22k impresiones, 2.8% engagement
```

### Flujo completo
```
Quiero una mini-campaña sobre "productividad con agentes de IA":
1. Estructura el conocimiento base (puedo pasarte texto o URL)
2. Define la estrategia de 2 semanas
3. Genera el primer hilo de LinkedIn + 3 variaciones A/B
```

## Evals

```bash
npx eve eval
npx eve eval smoke
npx eve eval routing-knowledge
npx eve eval routing-creator
```

## SharedKnowledgeStore

Las notas viven en el sandbox de la sesión:
```
knowledge/
  index.json
  notes/note_xxx.json   # incluye embedding
```

La búsqueda semántica usa similitud coseno sobre los embeddings.
