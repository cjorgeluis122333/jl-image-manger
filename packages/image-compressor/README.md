# jl-optimize-images 🚀

Una librería ligera, rápida y pura en **TypeScript/JavaScript** sin dependencias externas para comprimir y redimensionar imágenes directamente en el navegador de forma ultra-eficiente.

Perfecta para optimizar avatares, fotos de perfil, imágenes de e-commerce y cualquier subida de archivos antes de enviarla al servidor, mejorando la experiencia de usuario y reduciendo drásticamente el consumo de ancho de banda.

---

## ✨ Características

- 📦 **Zero Dependencias**: Código nativo optimizado con Canvas API.
- 🎨 **Soporte Multi-Formato**: Exportación nativa a `image/webp`, `image/jpeg` e `image/png`.
- ⚙️ **Control Total**: Ajuste en vivo de calidad (`quality`) y dimensiones máximas (`maxWidth`, `maxHeight`).
- 📐 **Relación de Aspecto Flexible**: Mantiene la proporción original por defecto, o permite forzar dimensiones exactas (`maintainAspectRatio: false`).
- 📊 **Analíticas de Compresión**: Retorna tamaños exactos (original vs comprimido) y el porcentaje de ahorro real de forma inmediata.
- ⚡ **Rápido & Reactivo**: Diseñado como una clase de estado, lo que permite múltiples compresiones instantáneas sobre la misma instancia sin re-procesar recursos.

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

// 2. Comprimir usando las opciones por defecto (calidad 85% y formato webp)
const result = await compressor.compress();

// 3. ¡Listo para usar o subir!
console.log(`Original: ${result.originalSize} bytes`);
console.log(`Comprimido: ${result.compressedSize} bytes`);
console.log(`Ahorro: ${result.savingsPercentage.toFixed(1)}%`);

// Puedes asignar result.dataUrl a un <img> para previsualizarlo
document.getElementById('preview-avatar').src = result.dataUrl;
```

---

## 🛠️ Ejemplos de Configuración

### 1. Optimización Estándar para Avatares (Max 400x400)
```typescript
const result = await compressor.compress({
  maxWidth: 400,
  maxHeight: 400,
  quality: 0.8
});
```

### 2. Conversión Agresiva a WebP para Alto Rendimiento
```typescript
const result = await compressor.compress({
  quality: 0.5,
  mimeType: 'image/webp'
});
```

### 3. Forzar Miniatura Cuadrada Exacta (Estirar si es necesario)
```typescript
const result = await compressor.compress({
  maxWidth: 200,
  maxHeight: 200,
  maintainAspectRatio: false,
  quality: 0.7
});
```

---

## 📖 Referencia de la API

### Clase `ImageCompressor`

```typescript
class ImageCompressor {
  constructor(source: File | Blob);
  
  /**
   * Ejecuta la compresión aplicando las opciones especificadas.
   */
  compress(options?: CompressionOptions): Promise<CompressionResult>;
}
```

### Opciones de Compresión (`CompressionOptions`)

| Propiedad | Tipo | Por Defecto | Descripción |
| :--- | :--- | :--- | :--- |
| `quality` | `number` | `0.85` | Calidad de salida de la compresión (rango de `0.0` a `1.0`). |
| `maxWidth` | `number` | `undefined` | Ancho máximo de la imagen resultante en píxeles. |
| `maxHeight` | `number` | `undefined` | Alto máximo de la imagen resultante en píxeles. |
| `mimeType` | `'image/jpeg' \| 'image/webp' \| 'image/png'` | `'image/webp'` | Formato MIME de salida deseado. |
| `maintainAspectRatio` | `boolean` | `true` | Si es `true`, redimensiona manteniendo la proporción original. |

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
