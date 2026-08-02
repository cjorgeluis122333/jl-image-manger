# jl-optimize-images 🚀

[![npm version](https://img.shields.io/npm/v/jl-optimize-images?color=blue&style=flat-square)](https://www.npmjs.com/package/jl-optimize-images)
[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg?style=flat-square)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Zero Dependencies](https://img.shields.io/badge/Dependencies-0-success?style=flat-square)](https://www.npmjs.com/package/jl-optimize-images)
[![GitHub Repository](https://img.shields.io/badge/GitHub-Repository-181717?style=flat-square&logo=github)](https://github.com/cjorgeluis122333/jl-image-manger)

> **Ultra-fast, zero-dependency in-browser image compression engine for TypeScript and JavaScript.**
> Hardware-accelerated GPU decoding via `ImageBitmap`, automatic EXIF rotation, step-down downscaling, and non-blocking UI batch processing (`yieldToMain`).

---

## 🔗 Quick Links & Live Demos

| Resource | URL |
| :--- | :--- |
| 🌐 **Interactive Documentation** | [https://jl-image-manger.vercel.app/app/documentation/](https://jl-image-manger.vercel.app/app/documentation/) |
| ⚡ **Live Playground** | [https://jl-image-manger.vercel.app/app/playground/](https://jl-image-manger.vercel.app/app/playground/) |
| 🐙 **GitHub Repository** | [https://github.com/cjorgeluis122333/jl-image-manger](https://github.com/cjorgeluis122333/jl-image-manger) |

---

## 📋 Table of Contents

- [Features](#-features)
- [Why jl-optimize-images?](#-why-jl-optimize-images)
- [Installation](#-installation)
- [Quick Start](#-quick-start)
- [Advanced Usage](#-advanced-usage)
  - [Avatar Optimization](#1-avatar-optimization-400x400)
  - [Transparent PNG to White JPEG](#2-transparent-png-to-white-jpeg-conversion)
  - [Concurrent Batch Compression](#3-concurrent-batch-processing)
- [API Reference](#-api-reference)
  - [ImageCompressor Class](#imagecompressor-class)
  - [CompressionOptions](#compressionoptions)
  - [CompressionResult](#compressionresult)
  - [compressBatch Function](#compressbatch-function)
- [Browser Compatibility](#-browser-compatibility)
- [SEO & Indexing Keywords](#-keywords)
- [License](#-license)

---

## ✨ Features

- 📦 **Zero External Dependencies**: Lightweight native library built strictly on modern Canvas API and Web APIs.
- ⚡ **Hardware-Accelerated GPU Cache (`ImageBitmap`)**: Decodes the image once into GPU memory. Real-time adjustments (e.g. quality sliders) execute in milliseconds without re-decoding from disk.
- 📸 **Automatic EXIF Orientation**: Natively corrects photo orientation from mobile devices and digital cameras via `createImageBitmap(blob, { imageOrientation: 'from-image' })`.
- 📉 **Fractional Step-Down Scaling**: Progressive halving downscaling algorithm that eliminates aliasing artifacts (jagged pixels) and maintains maximum sharpness.
- 🟢 **Smooth 60 FPS UI Thread Preservation (`yieldToMain`)**: Prevents browser freeze during heavy batch operations by yielding execution control to the event loop (`scheduler.yield()` or `MessageChannel`).
- 🎨 **Multi-Format Export**: Native conversion support for `image/webp`, `image/jpeg`, and `image/png`.
- ⚙️ **Dimension & Quality Controls**: Custom target quality, maximum width/height constraints, aspect ratio locking, and custom background fill colors for transparent images.
- 📊 **Instant Metrics & Analytics**: Immediate feedback on byte sizes (original vs compressed) and percentage savings.

---

## 💡 Why `jl-optimize-images`?

Compressing images directly in the browser before sending them to a server saves **up to 80-90% of upload bandwidth**, improves mobile user experience, reduces cloud storage costs, and speeds up form submissions.

Traditional image compression libraries often cause UI stuttering or loss of sharpness during extreme resolution reduction. `jl-optimize-images` addresses these challenges with GPU decoding memory caching, non-blocking asynchronous yielding, and step-down canvas scaling.

---

## 📥 Installation

Install the package via your preferred package manager:

```bash
npm install jl-optimize-images
```

Or using **yarn**, **pnpm**, or **bun**:

```bash
# Yarn
yarn add jl-optimize-images

# pnpm
pnpm add jl-optimize-images

# Bun
bun add jl-optimize-images
```

---

## 🚀 Quick Start

```typescript
import { ImageCompressor } from 'jl-optimize-images';

// 1. Get image file from an input element
const fileInput = document.querySelector<HTMLInputElement>('#upload')!;
const file = fileInput.files![0];

// 2. Instantiate ImageCompressor
const compressor = new ImageCompressor(file);

// 3. (Optional but recommended) Pre-load into GPU memory for ultra-fast performance
await compressor.preload();

// 4. Compress to WebP at 85% quality
const result = await compressor.compress({
  quality: 0.85,
  mimeType: 'image/webp',
  maxWidth: 1200,
});

// 5. Inspect analytics & use output
console.log(`Original: ${(result.originalSize / 1024).toFixed(1)} KB`);
console.log(`Compressed: ${(result.compressedSize / 1024).toFixed(1)} KB`);
console.log(`Saved: ${result.savingsPercentage.toFixed(1)}%`);

// Display preview immediately
document.querySelector<HTMLImageElement>('#preview')!.src = result.dataUrl;

// 6. Release graphics memory when finished
compressor.dispose();
```

---

## 🛠️ Advanced Usage

### 1. Avatar Optimization (400x400)
```typescript
const avatarResult = await compressor.compress({
  maxWidth: 400,
  maxHeight: 400,
  quality: 0.8,
  mimeType: 'image/webp',
  maintainAspectRatio: true,
});
```

### 2. Transparent PNG to White JPEG Conversion
When converting transparent PNGs to JPEG format, fill transparent pixels with a solid background color to avoid black backgrounds:

```typescript
const jpegResult = await compressor.compress({
  quality: 0.85,
  mimeType: 'image/jpeg',
  backgroundColor: '#ffffff', // Fills transparent alpha channel with white
});
```

### 3. Concurrent Batch Processing
Process multiple images in parallel with controlled concurrency to prevent thread contention:

```typescript
import { compressBatch } from 'jl-optimize-images';

const fileList = fileInput.files!; // FileList or File[]

const batchResults = await compressBatch(fileList, {
  quality: 0.8,
  mimeType: 'image/webp',
  maxWidth: 1920,
  concurrency: 3, // Process 3 images concurrently
});

batchResults.forEach((res, index) => {
  console.log(`Image ${index + 1}: ${res.savingsPercentage.toFixed(1)}% saved`);
});
```

---

## 📖 API Reference

### `ImageCompressor` Class

```typescript
export class ImageCompressor {
  constructor(source: File | Blob);

  /**
   * Pre-loads and decodes the image into an ImageBitmap in GPU cache.
   */
  preload(): Promise<void>;

  /**
   * Compresses the image using the provided compression options.
   */
  compress(options?: CompressionOptions): Promise<CompressionResult>;

  /**
   * Releases stored ImageBitmap memory cache.
   */
  dispose(): void;
}
```

### `CompressionOptions`

| Option | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `quality` | `number` | `0.85` | Compression quality rating between `0.01` and `1.0`. |
| `maxWidth` | `number` | `undefined` | Maximum width constraint in pixels. |
| `maxHeight` | `number` | `undefined` | Maximum height constraint in pixels. |
| `mimeType` | `'image/webp' \| 'image/jpeg' \| 'image/png'` | `'image/webp'` | Target output image format. |
| `maintainAspectRatio` | `boolean` | `true` | Preserves width/height ratio during resizing. |
| `backgroundColor` | `string` | `undefined` | Solid color (e.g., `'#ffffff'`) to replace transparent alpha channel when converting to formats like JPEG. |

### `CompressionResult`

```typescript
export interface CompressionResult {
  file: File;                // Compressed File object ready for FormData / fetch upload
  dataUrl: string;           // Base64 Data URL string for immediate browser rendering
  originalSize: number;      // Input size in bytes
  compressedSize: number;    // Output size in bytes
  savingsPercentage: number;  // Weight reduction percentage (0% to 100%)
}
```

### `compressBatch` Function

```typescript
export function compressBatch(
  files: FileList | File[],
  options?: CompressionOptions & { concurrency?: number }
): Promise<CompressionResult[]>;
```

---

## 🌐 Browser Compatibility

`jl-optimize-images` is compatible with all modern web browsers supporting HTML5 Canvas API and `ImageBitmap`:

- **Chrome / Edge**: 79+
- **Firefox**: 84+
- **Safari**: 15+
- **Opera**: 66+
- **iOS Safari / Android Chrome**: Supported

---

## 🏷️ Keywords

`image compression` `client-side image compressor` `browser image optimization` `webp converter` `exif auto rotation` `imagebitmap gpu decoding` `typescript image resizer` `javascript image compress` `canvas image resize` `batch image compression` `vanilla js image optimizer`

---

## 📄 License

MIT © [Jorge Luis Pabón Izquierdo](https://github.com/cjorgeluis122333) — [jl-image-manger Repository](https://github.com/cjorgeluis122333/jl-image-manger)

