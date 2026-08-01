# Documentación Contextual de la Librería Base: `jl-optimize-images` (`/packages/image-compressor`)

`jl-optimize-images` es un motor puro en TypeScript (sin dependencias de ningún framework de UI) diseñado para la decodificación, compresión, redimensionamiento, ajuste de calidad y conversión de formatos de imágenes en el navegador con un rendimiento extremadamente alto.

---

## 1. Arquitectura de Módulos

```
packages/image-compressor/src/
├── compress.ts   # Algoritmo principal: decodificación EXIF, step-down scaling y Canvas/OffscreenCanvas
├── class.ts      # Clase stateful ImageCompressor con caché de ImageBitmap (.preload(), .clearCache())
├── batch.ts      # Procesamiento concurrente por lotes con yieldToMain y control de flujo
├── utils.ts      # Helpers de formato de bytes, conversión a DataURL y liberación de hilo (yieldToMain)
├── types.ts      # Interfaces TypeScript de opciones, resultados y configuración de lotes
└── index.ts      # Exportación pública completa de la librería
```

### A. Módulo Principal (`compress.ts`)
- **`loadImageSource(input, cachedSource?)`**:
  Decodifica la imagen de entrada (`File | Blob | string`) en un `ImageBitmap` aprovechando `createImageBitmap` con `{ imageOrientation: 'from-image' }`. Esto corrige automáticamente la rotación EXIF de fotos tomadas desde smartphones o cámaras. Si el entorno no soporta `ImageBitmap` o falla, realiza un fallback transparente hacia un elemento `HTMLImageElement`.
- **`drawImageWithStepDown(...)`**:
  Aplica un algoritmo de reducción por pasos (múltiples iteraciones al 50%) para evitar que las imágenes redimensionadas a baja resolución sufran aliasing, manteniendo bordes limpios y nitidez. Maneja colores de fondo transparentes (`backgroundColor`) o blanco por defecto para formato JPEG.
- **`compressImage(input, options)`**:
  Procesa la imagen a través de `OffscreenCanvas` (o `HTMLCanvasElement` si `OffscreenCanvas` no está disponible) devolviendo un objeto `CompressionResult`.

### B. Clase Stateful (`class.ts` - `ImageCompressor`)
- Diseñada para aplicaciones interactivas (por ejemplo, sliders de calidad en tiempo real).
- **`.preload()`**: Decodifica la imagen una sola vez en la memoria gráfica (`ImageBitmap`). Las llamadas posteriores a `.compress(...)` no vuelven a decodificar el archivo original, reduciendo el tiempo de procesamiento de ~300ms a ~10-30ms por ajuste.
- **`.clearCache()` / `.dispose()`**: Libera explícitamente los recursos del `ImageBitmap` para prevenir fugas de memoria GPU.

### C. Procesamiento Concurrente (`batch.ts` - `compressImages`)
- Procesa un arreglo de archivos de imagen respetando un límite de concurrencia configurable (por defecto `2`).
- Ejecuta `yieldToMain()` entre imágenes para ceder el control al event loop del navegador, evitando que la interfaz de usuario se congele durante el procesamiento masivo.
- Omite imágenes fallidas devolviendo solo las compresiones exitosas sin interrumpir todo el lote.

### D. Utilidades (`utils.ts`)
- **`formatBytes(bytes, decimals)`**: Convierte bytes a formato humano (`2.4 MB`, `450 KB`).
- **`blobToDataURL(blob)`**: Convierte un `Blob` a base64 `DataURL`.
- **`yieldToMain()`**: Utiliza `scheduler.yield()`, `MessageChannel` o `setTimeout` para fragmentar tareas pesadas.

---

## 2. Definición de Tipos (`types.ts`)

### `CompressionOptions`
```ts
export interface CompressionOptions {
  /** Calidad entre 0 y 1 (por defecto: 0.85) */
  quality?: number;
  /** Ancho máximo en píxeles */
  maxWidth?: number;
  /** Alto máximo en píxeles */
  maxHeight?: number;
  /** MIME type de salida ('image/jpeg' | 'image/webp' | 'image/png') */
  mimeType?: 'image/jpeg' | 'image/webp' | 'image/png';
  /** Mantener relación de aspecto al redimensionar (por defecto: true) */
  maintainAspectRatio?: boolean;
  /** Color de fondo para transparencia (ej: '#ffffff') */
  backgroundColor?: string;
  /** Fuente precargada (ImageBitmap o HTMLImageElement) */
  sourceImage?: ImageBitmap | HTMLImageElement;
  /** Callback de progreso (0 a 100) */
  onProgress?: (progress: number) => void;
}
```

### `CompressionResult`
```ts
export interface CompressionResult {
  blob: Blob;
  file: File;
  dataUrl: string;
  originalSize: number;
  compressedSize: number;
  savingsPercentage: number;
  originalWidth: number;
  originalHeight: number;
  width: number;
  height: number;
  mimeType: string;
}
```

### `BatchCompressionOptions`
```ts
export interface BatchCompressionOptions extends CompressionOptions {
  /** Concurrencia máxima simultánea (por defecto: 2) */
  concurrency?: number;
  /** Máximo de imágenes por lote (por defecto: 50) */
  maxImages?: number;
}
```

---

## 3. Ejemplos Completos de Código

### Ejemplo 1: Compresión Simple de un Archivo
```ts
import { compressImage, formatBytes } from 'jl-optimize-images';

async function handleFileUpload(file: File) {
  const result = await compressImage(file, {
    quality: 0.8,
    maxWidth: 1920,
    maxHeight: 1080,
    mimeType: 'image/webp',
    onProgress: (p) => console.log(`Progreso: ${p}%`),
  });

  console.log('Imagen comprimida:', result.file);
  console.log(`Ahorro: ${result.savingsPercentage}% (${formatBytes(result.compressedSize)})`);
}
```

### Ejemplo 2: Ajuste Interactivo con Caché Bitmap
```ts
import { ImageCompressor } from 'jl-optimize-images';

const compressor = new ImageCompressor(file);

// 1. Decodificación única previa
await compressor.preload();

// 2. Re-compresiones instantáneas
const highQuality = await compressor.compress({ quality: 0.9, mimeType: 'image/webp' });
const mediumQuality = await compressor.compress({ quality: 0.5, mimeType: 'image/webp' });

// 3. Limpieza de memoria
compressor.dispose();
```

### Ejemplo 3: Procesamiento por Lotes
```ts
import { compressImages } from 'jl-optimize-images';

async function handleBatch(files: File[]) {
  const results = await compressImages(
    files,
    {
      quality: 0.85,
      mimeType: 'image/jpeg',
      concurrency: 3,
      maxImages: 50,
    },
    (completed, total) => {
      console.log(`Procesados ${completed} de ${total} archivos`);
    }
  );

  console.log('Resultados del lote:', results);
}
```
