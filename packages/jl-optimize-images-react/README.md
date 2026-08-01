# jl-optimize-images-react 🎨⚛️

La capa de integración oficial de **React** para la potente librería de compresión de imágenes [jl-optimize-images](../image-compressor). 

Ofrece componentes interactivos y hooks de alto rendimiento listos para producción para la compresión por lotes, previsualización en tiempo real tipo slider (*Before/After*), gestor de miniaturas y descargas seguras en archivos ZIP con renombrado automático contra colisiones de nombres.

---

## ✨ Características Principales

- 🔄 **`useImageOptimizer` Hook**: Gestiona lotes, estados de carga, re-compresión individual ultra rápida en milisegundos gracias al caché de `ImageBitmap`, y descargas en archivos ZIP.
- 🎚️ **Componente `ImageComparison` (Antes/Después)**: 
  - Slider interactivo y responsivo.
  - Soporte completo para gestos táctiles fluidos (`touch-none`) que no interfieren con el scroll vertical de la página.
  - Accesibilidad integrada (a11y) con soporte para teclado (flechas, Home, End).
  - Soporte de Zoom y Pan (arrastre) interactivo para inspeccionar macrobloques de compresión a nivel de píxel.
- 🖼️ **Componente `ImageGallery`**: Visualiza y gestiona las miniaturas del lote actual, permitiendo cambiar la imagen activa o eliminar elementos liberando recursos de memoria de inmediato.
- 🌐 **Internacionalización (i18n) Nativa**: Soporta configuraciones de idioma en español (`'es'`) e inglés (`'en'`) out-of-the-box, además de permitir la personalización completa de etiquetas y textos de ayuda.

---

## 📥 Instalación

Instala el paquete en tu proyecto de React junto con sus dependencias:

```bash
npm install jl-optimize-images-react jl-optimize-images lucide-react jszip
```

o con yarn / pnpm / bun:

```bash
yarn add jl-optimize-images-react jl-optimize-images lucide-react jszip
pnpm add jl-optimize-images-react jl-optimize-images lucide-react jszip
bun add jl-optimize-images-react jl-optimize-images lucide-react jszip
```

---

## 🚀 Uso Básico (Compresor Simple)

A continuación se muestra un ejemplo simple de cómo integrar un comparador interactivo para una sola imagen:

```tsx
import React from 'react';
import { ImageComparison } from 'jl-optimize-images-react';

export function SimpleDemo() {
  return (
    <div className="w-full max-w-2xl mx-auto">
      <ImageComparison
        originalUrl="https://ejemplo.com/paisaje-original.jpg"
        originalSize={2048576} // 2.0 MB
        compressedUrl="https://ejemplo.com/paisaje-comprimido.webp"
        compressedSize={307200} // 300 KB
        className="h-[400px] rounded-2xl shadow-lg bg-slate-900"
      />
    </div>
  );
}
```

---

## 💎 Uso Avanzado (Procesamiento por Lotes y Descarga ZIP)

El hook `useImageOptimizer` se encarga de automatizar todo el ciclo de vida: pre-carga de memoria, compresión concurrente en segundo plano, y generación segura del archivo comprimido `.zip`.

```tsx
import React from 'react';
import { useImageOptimizer, ImageComparison, ImageGallery } from 'jl-optimize-images-react';

export function AdvancedDemo() {
  const {
    images,
    activeImage,
    selectedId,
    setSelectedId,
    addFiles,
    removeFile,
    clearImages,
    downloadZip,
    stats,
  } = useImageOptimizer({
    quality: 0.8,
    mimeType: 'image/webp',
    maxWidth: 1200,
    locale: 'es' // Idioma de ayuda: 'es' o 'en'
  });

  return (
    <div className="flex flex-col md:flex-row gap-6 p-6 bg-slate-50 rounded-3xl border border-slate-150">
      {/* Panel Lateral de Controles */}
      <div className="w-full md:w-80 flex flex-col gap-4">
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => e.target.files && addFiles(e.target.files)}
          className="text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-500 cursor-pointer"
        />

        {images.length > 0 && (
          <>
            <button
              onClick={() => downloadZip('mis_imagenes_optimizadas.zip')}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs transition shadow-sm"
            >
              Descargar Lote (.ZIP)
            </button>
            <button
              onClick={clearImages}
              className="w-full py-2.5 border border-rose-200 text-rose-600 hover:bg-rose-50 rounded-xl text-xs transition"
            >
              Limpiar Todo
            </button>
          </>
        )}
      </div>

      {/* Visor Principal */}
      <div className="flex-1 flex flex-col gap-4">
        {activeImage ? (
          <>
            <ImageComparison
              originalUrl={activeImage.originalUrl}
              originalSize={activeImage.originalSize}
              compressedUrl={activeImage.result?.dataUrl}
              compressedSize={activeImage.result?.compressedSize}
              isCompressing={activeImage.isCompressing}
              className="h-[450px] rounded-2xl overflow-hidden shadow-inner bg-slate-900 border border-slate-200"
            />

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
              onRemove={removeFile}
            />
          </>
        ) : (
          <div className="h-[450px] border border-dashed border-slate-300 rounded-2xl flex items-center justify-center text-slate-400 bg-white">
            Sube o arrastra imágenes para comenzar a optimizar
          </div>
        )}
      </div>
    </div>
  );
}
```

---

## 📖 Referencia de la API (React)

### `useImageOptimizer(options)`

#### Parámetros (`UseImageOptimizerOptions`)

| Opción | Tipo | Por Defecto | Descripción |
| :--- | :--- | :--- | :--- |
| `quality` | `number` | `0.85` | Calidad de la compresión (rango de `0.01` a `1.0`). |
| `mimeType` | `'image/webp' \| 'image/jpeg' \| 'image/png'` | `'image/webp'` | Formato MIME de las imágenes optimizadas. |
| `maxWidth` | `number` | `undefined` | Ancho máximo en píxeles. |
| `maxHeight` | `number` | `undefined` | Alto máximo en píxeles. |
| `maintainAspectRatio` | `boolean` | `true` | Mantener proporciones al redimensionar. |
| `locale` | `'es' \| 'en'` | `'es'` | Selector de idioma de visualización de los componentes. |

#### Valores de Retorno

```typescript
{
  images: OptimizerImage[];             // Lista de imágenes procesadas y en procesamiento
  selectedId: string | null;           // ID de la imagen seleccionada para previsualización
  activeImage: OptimizerImage | null;   // Atajo al objeto de la imagen activa seleccionada
  addFiles: (files: FileList | File[]) => Promise<void>; // Función para agregar imágenes al lote
  removeFile: (id: string) => void;     // Elimina una imagen y libera sus ObjectURL
  clearImages: () => void;              // Vacía el lote completo y libera todos los recursos
  downloadZip: (filename?: string) => Promise<void>; // Genera y descarga un archivo ZIP con nombres sanos
}
```

---

### Componente `<ImageComparison />`

| Propiedad | Tipo | Por Defecto | Descripción |
| :--- | :--- | :--- | :--- |
| `originalUrl` | `string` | `''` | URL o Data URL de la imagen original (lado izquierdo). |
| `originalSize` | `number` | `undefined` | Peso original en bytes para mostrar en la etiqueta. |
| `compressedUrl` | `string` | `''` | URL o Data URL de la imagen comprimida (lado derecho). |
| `compressedSize` | `number` | `undefined` | Peso comprimido en bytes para mostrar en la etiqueta. |
| `isCompressing` | `boolean` | `false` | Indica si el motor de fondo sigue procesando la imagen. |
| `locale` | `'es' \| 'en'` | `'es'` | Idioma para el slider y los textos de control. |
| `className` | `string` | `''` | Clases Tailwind personalizadas para el contenedor exterior. |

---

### Componente `<ImageGallery />`

| Propiedad | Tipo | Por Defecto | Descripción |
| :--- | :--- | :--- | :--- |
| `images` | `GalleryImage[]` | `[]` | Listado de miniaturas con formato `{ id, originalUrl, compressedUrl, isCompressing, hasResult }`. |
| `selectedId` | `string \| null` | `null` | ID del elemento seleccionado activamente. |
| `onSelect` | `(id: string) => void` | (Requerido) | Callback invocado al hacer clic en una miniatura. |
| `onRemove` | `(id: string) => void` | (Requerido) | Callback invocado al pulsar el botón de eliminar. |
| `locale` | `'es' \| 'en'` | `'es'` | Idioma de los tooltips de interactividad. |
| `hideIfSingle` | `boolean` | `false` | Oculta la galería si sólo hay una imagen disponible. |

---

## 📄 Licencia

MIT © [jl-optimize-images-react](https://github.com/jlcpabonisquierdo)
