# Documentación Contextual para Agentes e Inteligencia Artificial
## Librería: `jl-optimize-images-react` (`/packages/jl-optimize-images-react`)

`jl-optimize-images-react` es una biblioteca React de alto rendimiento diseñada para la optimización, compresión, comparación visual y gestión por lotes de imágenes en el navegador. Funciona sobre la librería base pura de TypeScript `jl-optimize-images` (`/packages/image-compressor`).

---

## 1. Arquitectura y Estructura del Proyecto

```
packages/
├── image-compressor/               # Motor TypeScript Puro ("jl-optimize-images")
│   ├── src/
│   │   ├── compress.ts            # Algoritmo principal, createImageBitmap y step-down canvas scaling
│   │   ├── class.ts               # Clase ImageCompressor con caché de ImageBitmap (.preload(), .clearCache())
│   │   ├── batch.ts               # Procesamiento por lotes concurrente
│   │   ├── utils.ts               # Helpers (yieldToMain, blobToDataURL, formatBytes)
│   │   └── types.ts               # Tipos e interfaces de compresión
│   └── package.json
│
└── jl-optimize-images-react/       # Capa de Integración React ("jl-optimize-images-react")
    ├── src/
    │   ├── components/
    │   │   ├── ImageComparison.tsx  # Componente comparador visual Slider (Original vs Comprimida)
    │   │   └── ImageGallery.tsx     # Galería de miniaturas y estado de selección/eliminación
    │   ├── hooks/
    │   │   └── useImageOptimizer.ts # Hook principal para gestionar estado, lote, re-compresión y ZIP
    │   ├── i18n.ts                  # Sistema de internacionalización (es/en) y mensajes
    │   └── index.ts                 # Exportaciones públicas
    └── package.json
```

---

## 2. Componentes y Hooks Principales

### A. `useImageOptimizer(options)`
Hook React que encapsula la compresión por lotes, gestión de memoria (liberación de `ObjectURL` y caché bitmap), re-compresión individual ultra rápida y descarga en archivo ZIP.

* **Parámetros (`UseImageOptimizerOptions`)**:
  - `quality`: number (0 a 1, por defecto 0.85)
  - `maxWidth?`: number
  - `maxHeight?`: number
  - `mimeType`: string (`'image/webp'`, `'image/jpeg'`, `'image/png'`)
  - `maintainAspectRatio?`: boolean
  - `locale?`: `'es'` | `'en'` (por defecto `'es'`)
  - `labels?`: `Partial<LibraryLabels>` (personalización opcional de textos)

* **Retorno**:
  - `images`: Array de `OptimizerImage` (`id`, `file`, `originalUrl`, `compressor`, `result`, `isCompressing`, `error`)
  - `selectedId` / `setSelectedId`: ID de la imagen seleccionada para previsualizar
  - `activeImage`: Objeto de la imagen activa en la selección
  - `addImages(files)`: Procesa y añade imágenes al lote usando caché bitmap pre-cargado
  - `removeImage(id)`: Elimina la imagen y libera sus recursos en memoria (`URL.revokeObjectURL` + `compressor.dispose()`)
  - `clearImages()`: Limpia todo el lote y libera recursos
  - `recompressSingle(id, options)`: Re-comprime una sola imagen en tiempo real (~10-50ms)
  - `downloadZip(customZipName?)`: Genera un ZIP con JSZip previniendo colisiones de nombres duplicados
  - `stats`: Métricas generales (`totalOriginalSize`, `totalCompressedSize`, `totalSavedBytes`, `overallSavedPercentage`)

### B. `ImageComparison`
Componente React comparador tipo *Before/After* con slider interactivo.

* **Características Clave**:
  - **Accesibilidad (a11y)**: Soporta navegación por teclado con flechas (`ArrowLeft`, `ArrowRight`, `ArrowUp`, `ArrowDown`, `Home`, `End`), tiene atributos ARIA (`role="slider"`, `aria-valuenow`, `aria-label`).
  - **Uso Móvil Fluid**: Implementa `touch-none` / `touchAction: 'none'` para prevenir que la página se desplace verticalmente mientras el usuario arrastra la barra comparadora.
  - **i18n**: Acepta `locale` ('es' | 'en') y propiedad `labels` para traducir todos los textos del visor.

### C. `ImageGallery`
Galería de miniaturas para cambiar de imagen activa o eliminar elementos.

* **Características Clave**:
  - **Comportamiento con 1 imagen**: Prop `hideIfSingle?: boolean` (por defecto `false`), permitiendo que el usuario vea y gestione la miniatura incluso si sube solo 1 imagen.
  - **i18n**: Textos de tooltips e indicios personalizables vía `locale` y `labels`.

---

## 3. Características Técnicas y Rendimiento

1. **Caché Bitmap (`ImageBitmap`)**:
   - `ImageCompressor.preload()` decodifica la imagen una sola vez en memoria de tarjeta gráfica/navegador. Las re-compresiones subsiguientes en sliders de calidad tardan milisegundos en lugar de volver a decodificar el archivo.

2. **Rotación Automática EXIF**:
   - Uso nativo de `createImageBitmap(blob, { imageOrientation: 'from-image' })` para corregir la orientación de fotografías tomadas en dispositivos móviles o cámaras digitales.

3. **Escalado Step-Down Canvas**:
   - Algoritmo de reducción por pasos a la mitad para evitar artefactos de aliasing y conservar nitidez extrema en imágenes reducidas a baja resolución.

4. **Prevención de Congelamiento de UI (`yieldToMain`)**:
   - Cede el control al bucle de eventos mediante `scheduler.yield()` o `MessageChannel` en lotes pesados, manteniendo la interfaz fluida a 60 FPS.

5. **Sanitización de Nombres en ZIP**:
   - `useImageOptimizer.downloadZip` rastrea nombres duplicados en la lista y renombra automáticamente (`foto.jpg`, `foto (1).jpg`, `foto (2).jpg`) evitando que archivos con el mismo nombre se sobrescriban.

6. **Relleno de Fondo (`backgroundColor`)**:
   - Permite especificar color de fondo (e.g. `'#ffffff'`) al convertir imágenes con transparencia (PNG/WebP) a JPEG sin canal alfa.

---

## 4. Ejemplo de Uso Rápido

```tsx
import React from 'react';
import { useImageOptimizer, ImageComparison, ImageGallery } from 'jl-optimize-images-react';

export function OptimizerDemo() {
  const {
    images,
    activeImage,
    selectedId,
    setSelectedId,
    addImages,
    removeImage,
    downloadZip,
    stats,
  } = useImageOptimizer({
    quality: 0.8,
    mimeType: 'image/webp',
    locale: 'es', // 'es' | 'en'
  });

  return (
    <div>
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={(e) => e.target.files && addImages(e.target.files)}
      />

      {activeImage && (
        <ImageComparison
          originalUrl={activeImage.originalUrl}
          originalSize={activeImage.file.size}
          compressedUrl={activeImage.result?.dataUrl}
          compressedSize={activeImage.result?.size}
          isCompressing={activeImage.isCompressing}
          locale="es"
        />
      )}

      <ImageGallery
        images={images.map((img) => ({
          id: img.id,
          originalUrl: img.originalUrl,
          compressedUrl: img.result?.dataUrl,
          isCompressing: img.isCompressing,
          hasResult: !!img.result,
        }))}
        selectedId={selectedId}
        onSelect={setSelectedId}
        onRemove={(id) => removeImage(id)}
        hideIfSingle={false}
      />

      {images.length > 0 && (
        <button onClick={() => downloadZip('mis_imagenes.zip')}>
          Descargar ZIP ({stats.overallSavedPercentage}% ahorrado)
        </button>
      )}
    </div>
  );
}
```
