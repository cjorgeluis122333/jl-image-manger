# jl-optimize-images 🚀

A lightweight, ultra-fast, pure **TypeScript/JavaScript** library with zero external dependencies to compress, pre-load, and resize images directly in the browser with high efficiency.

Perfect for optimizing avatars, profile pictures, e-commerce product photos, and any file upload before sending it to the server, improving user experience and drastically reducing bandwidth consumption.

---

## ✨ High-Performance Features

- 📦 **Zero Dependencies**: Native code optimized using the Canvas API and modern browser APIs.
- ⚡ **Hardware-Accelerated Decoding Cache (`ImageBitmap`)**: Decodes the image only once on the GPU/graphics memory. Subsequent compressions or real-time interactive adjustments (like quality sliders) take milliseconds without re-decoding the source file.
- 📸 **Automatic EXIF Orientation**: Natively and automatically corrects the orientation of photos taken with mobile phones or cameras using `createImageBitmap(blob, { imageOrientation: 'from-image' })`.
- 📉 **Fractional Step-Down Scaling**: A progressive halving downscaling algorithm to prevent aliasing artifacts (jagged pixels) and maintain maximum sharpness even during extreme resolution reductions.
- 🟢 **Smooth UI Thread Preservation (`yieldToMain`)**: Splits heavy batch processing into asynchronous tasks, periodically yielding control to the browser's event loop (`scheduler.yield()` or `MessageChannel`), keeping the UI at a stable, responsive 60 FPS.
- 🎨 **Multi-Format Support**: Native export to `image/webp`, `image/jpeg`, and `image/png`.
- ⚙️ **Dimension Control**: On-the-fly adjustment of quality (`quality`), maximum dimensions (`maxWidth`, `maxHeight`), and background color for transparencies (`backgroundColor`).
- 📐 **Flexible Aspect Ratio**: Maintains the original ratio by default, or allows forcing exact dimensions (`maintainAspectRatio: false`).
- 📊 **Detailed Analytics**: Returns exact sizes (original vs compressed) and the real weight savings percentage immediately.

---

## 📥 Installation

Install the package using your favorite package manager:

```bash
npm install jl-optimize-images
```

or with yarn / pnpm / bun:

```bash
yarn add jl-optimize-images
pnpm add jl-optimize-images
bun add jl-optimize-images
```

---

## 🚀 Quick Start

The process is based on instantiating the `ImageCompressor` class with your original image and calling the `compress()` method.

```typescript
import { ImageCompressor } from 'jl-optimize-images';

// 1. Instantiate the class with a file (e.g., from an HTML input)
const file = event.target.files[0];
const compressor = new ImageCompressor(file);

// Optional but highly recommended for interactive UIs: pre-load ImageBitmap into memory
await compressor.preload();

// 2. Compress using default options (85% quality and webp format)
const result = await compressor.compress();

// 3. Ready to use or upload!
console.log(`Original: ${result.originalSize} bytes`);
console.log(`Compressed: ${result.compressedSize} bytes`);
console.log(`Savings: ${result.savingsPercentage.toFixed(1)}%`);

// You can assign result.dataUrl to an <img> for immediate preview
document.getElementById('preview-avatar').src = result.dataUrl;

// Remember to release internal memory of the compressor when no longer needed
compressor.dispose();
```

---

## 🛠️ Advanced Configuration Examples

### 1. Standard Optimization for Avatars (Max 400x400)
```typescript
const result = await compressor.compress({
  maxWidth: 400,
  maxHeight: 400,
  quality: 0.8
});
```

### 2. Conversion with Background Fill (Transparent PNG to White JPEG)
```typescript
const result = await compressor.compress({
  quality: 0.85,
  mimeType: 'image/jpeg',
  backgroundColor: '#ffffff' // Fills transparent areas to prevent a black background in JPEG
});
```

### 3. Efficient Concurrent Batch Processing
```typescript
import { compressBatch } from 'jl-optimize-images';

const files = event.target.files; // FileList
const batchResults = await compressBatch(files, {
  quality: 0.8,
  mimeType: 'image/webp',
  concurrency: 3 // Parallel processing limit to avoid locking up client execution threads
});
```

---

## 📖 API Reference

### `ImageCompressor` Class

```typescript
class ImageCompressor {
  constructor(source: File | Blob);
  
  /**
   * Pre-loads the resource by decoding it into a high-performance ImageBitmap.
   */
  preload(): Promise<void>;

  /**
   * Performs the compression applying specified options.
   */
  compress(options?: CompressionOptions): Promise<CompressionResult>;

  /**
   * Releases the ImageBitmap memory stored in cache.
   */
  dispose(): void;
}
```

### Compression Options (`CompressionOptions`)

| Property | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `quality` | `number` | `0.85` | Compression output quality (range from `0.01` to `1.0`). |
| `maxWidth` | `number` | `undefined` | Maximum width of the resulting image in pixels. |
| `maxHeight` | `number` | `undefined` | Maximum height of the resulting image in pixels. |
| `mimeType` | `'image/jpeg' \| 'image/webp' \| 'image/png'` | `'image/webp'` | Desired output MIME format. |
| `maintainAspectRatio` | `boolean` | `true` | If `true`, resizes while maintaining the original proportions. |
| `backgroundColor` | `string` | `undefined` | Background color (e.g. `'#ffffff'`) to fill transparent areas of PNG/WebP when exporting to formats without an alpha channel (JPEG). |

### Compression Result (`CompressionResult`)

The `compress()` method resolves a promise containing:

```typescript
interface CompressionResult {
  file: File;               // The newly compressed file in File format
  dataUrl: string;          // base64 representation for immediate previews
  originalSize: number;     // Original image size in bytes
  compressedSize: number;   // Resulting compressed image size in bytes
  savingsPercentage: number; // Size savings percentage achieved (0 to 100)
}
```

---

## 📄 License

MIT © [jl-optimize-images](https://github.com/jlcpabonisquierdo)
