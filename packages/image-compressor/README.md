# jl-optimize-images 🚀

Una librería ligera, ultra-rápida y pura en **TypeScript/JavaScript** sin dependencias externas para comprimir, pre-cargar y redimensionar imágenes directamente en el navegador de forma altamente eficiente.

Perfecta para optimizar avatares, fotos de perfil, imágenes de e-commerce y cualquier subida de archivos antes de enviarla al servidor, mejorando la experiencia de usuario y reduciendo drásticamente el consumo de ancho de banda.

---

## ✨ Características de Alto Rendimiento

- 📦 **Zero Dependencias**: Código nativo optimizado con Canvas API y APIs modernas del navegador.
- ⚡ **Caché de Decodificación de Hardware (`ImageBitmap`)**: Decodifica la imagen una sola vez en la GPU/memoria de gráficos. Las compresiones repetidas o ajustes interactivos (como barras deslizadoras de calidad) toman milisegundos sin re-decodificar el archivo de origen.
- 📸 **Rotación Automática EXIF**: Utiliza `createImageBitmap(blob, { imageOrientation: 'from-image' })` para corregir de forma nativa y automática la orientación de fotos tomadas con teléfonos móviles o cámaras.
- 📉 **Escalado Step-Down (Múltiples Pasos)**: Algoritmo de reducción progresiva a la mitad para evitar artefactos de aliasing (píxeles dentados) y conservar la máxima nitidez incluso en reducciones extremas de resolución.
- 🟢 **Prevención de Congelamiento de UI (`yieldToMain`)**: Divide el procesamiento pesado en tareas asíncronas cediendo periódicamente el control al bucle de eventos del navegador (`scheduler.yield()` o `MessageChannel`), manteniendo la interfaz a 60 FPS estables.
- 🎨 **Soporte Multi-Formato**: Exportación nativa a `image/webp`, `image/jpeg` e `image/png`.
- ⚙️ **Control de Dimensiones**: Ajuste en vivo de calidad (`quality`), dimensiones máximas (`maxWidth`, `maxHeight`) y color de fondo para transparencias (`backgroundColor`).
- 📐 **Relación de Aspecto Flexible**: Mantiene la proporción original por defecto, o permite forzar dimensiones exactas (`maintainAspectRatio: false`).
- 📊 **Analíticas Detalladas**: Retorna tamaños exactos (original vs comprimido) y el porcentaje de ahorro real de forma inmediata.

---

## 📥 Instalación

Instala el paquete usando tu gestor de paquetes favorito:

```bash
npm install jl-optimize-images
```

o con yarn / pnpm / bun:

```bash
yarn add jl-optimize-images
pnpm add jl-optimize-images
bun add jl-optimize-images
```

---

## 🚀 Uso Rápido

El proceso se basa en instanciar la clase `ImageCompressor` con tu imagen original y llamar al método `compress()`.

```typescript
import { ImageCompressor } from 'jl-optimize-images';

// 1. Instanciar la clase con un archivo (por ejemplo, desde un input HTML)
const file = event.target.files[0];
const compressor = new ImageCompressor(file);

// Opcional pero recomendado para UI interactivas: Pre-cargar el ImageBitmap en memoria
await compressor.preload();

// 2. Comprimir usando las opciones por defecto (calidad 85% y formato webp)
const result = await compressor.compress();

// 3. ¡Listo para usar o subir!
console.log(`Original: ${result.originalSize} bytes`);
console.log(`Comprimido: ${result.compressedSize} bytes`);
console.log(`Ahorro: ${result.savingsPercentage.toFixed(1)}%`);

// Puedes asignar result.dataUrl a un <img> para previsualizarlo
document.getElementById('preview-avatar').src = result.dataUrl;

// Recuerda liberar la memoria interna del compressor cuando ya no lo necesites
compressor.dispose();
```

---

## 🛠️ Ejemplos de Configuración Avanzada

### 1. Optimización Estándar para Avatares (Max 400x400)
```typescript
const result = await compressor.compress({
  maxWidth: 400,
  maxHeight: 400,
  quality: 0.8
});
```

### 2. Conversión con Fondo de Relleno (PNG transparente a JPEG blanco)
```typescript
const result = await compressor.compress({
  quality: 0.85,
  mimeType: 'image/jpeg',
  backgroundColor: '#ffffff' // Rellena el fondo transparente para evitar fondo negro en JPEG
});
```

### 3. Procesamiento en Lotes Concurrentes Eficiente
```typescript
import { compressBatch } from 'jl-optimize-images';

const files = event.target.files; // FileList
const batchResults = await compressBatch(files, {
  quality: 0.8,
  mimeType: 'image/webp',
  concurrency: 3 // Límite de procesamiento paralelo para no ahogar hilos del cliente
});
```

---

## 📖 Referencia de la API

### Clase `ImageCompressor`

```typescript
class ImageCompressor {
  constructor(source: File | Blob);
  
  /**
   * Pre-carga el recurso decodificándolo como un ImageBitmap de alto rendimiento.
   */
  preload(): Promise<void>;

  /**
   * Ejecuta la compresión aplicando las opciones especificadas.
   */
  compress(options?: CompressionOptions): Promise<CompressionResult>;

  /**
   * Libera la memoria del ImageBitmap almacenado en la caché.
   */
  dispose(): void;
}
```

### Opciones de Compresión (`CompressionOptions`)

| Propiedad | Tipo | Por Defecto | Descripción |
| :--- | :--- | :--- | :--- |
| `quality` | `number` | `0.85` | Calidad de salida de la compresión (rango de `0.01` a `1.0`). |
| `maxWidth` | `number` | `undefined` | Ancho máximo de la imagen resultante en píxeles. |
| `maxHeight` | `number` | `undefined` | Alto máximo de la imagen resultante en píxeles. |
| `mimeType` | `'image/jpeg' \| 'image/webp' \| 'image/png'` | `'image/webp'` | Formato MIME de salida deseado. |
| `maintainAspectRatio` | `boolean` | `true` | Si es `true`, redimensiona manteniendo la proporción original. |
| `backgroundColor` | `string` | `undefined` | Color de fondo (ej: `'#ffffff'`) al rellenar transparencias de PNG/WebP a formatos sin canal alfa (JPEG). |

### Resultado de la Compresión (`CompressionResult`)

El método `compress()` resuelve una promesa con un objeto que contiene:

```typescript
interface CompressionResult {
  file: File;               // El nuevo archivo comprimido en formato File
  dataUrl: string;          // Representación en base64 para previsualizaciones inmediatas
  originalSize: number;     // Peso de la imagen original en bytes
  compressedSize: number;   // Peso de la imagen comprimida resultante en bytes
  savingsPercentage: number; // Porcentaje de ahorro de peso conseguido (0 a 100)
}
```

---

## 📄 Licencia

MIT © [jl-optimize-images](https://github.com/jlcpabonisquierdo)
