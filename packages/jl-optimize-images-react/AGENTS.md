# Documentación Contextual de la Librería: `jl-optimize-images-react`

Este archivo contiene la documentación detallada y contexto técnico de la librería `jl-optimize-images-react`.

---

## Estructura de la Librería

- **`src/i18n.ts`**: Definición de tipos de idioma (`es`, `en`), interfaz `LibraryLabels` y función `getLabels()`.
- **`src/components/ImageComparison.tsx`**: Componente de comparación visual con slider, soporte de teclado (a11y) y prevención de scroll táctil (`touch-none`).
- **`src/components/ImageGallery.tsx`**: Componente de galería con soporte para `hideIfSingle?: boolean` (por defecto `false`).
- **`src/hooks/useImageOptimizer.ts`**: Hook principal con soporte para compresión en lote, re-compresión rápida individual con caché bitmap y generación de ZIP sin duplicados.
- **`src/index.ts`**: Punto de entrada de exportación.

---

## Uso Básico

```tsx
import { useImageOptimizer, ImageComparison, ImageGallery } from 'jl-optimize-images-react';

const optimizer = useImageOptimizer({
  quality: 0.85,
  mimeType: 'image/webp',
  locale: 'es',
});
```
