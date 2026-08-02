# jl-optimize-images-react 🎨⚛️

[![npm version](https://img.shields.io/npm/v/jl-optimize-images-react?color=indigo&style=flat-square)](https://www.npmjs.com/package/jl-optimize-images-react)
[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg?style=flat-square)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-18%20%7C%2019-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![GitHub Repository](https://img.shields.io/badge/GitHub-Repository-181717?style=flat-square&logo=github)](https://github.com/cjorgeluis122333/jl-image-manger)

> **Official React integration for [jl-optimize-images](https://www.npmjs.com/package/jl-optimize-images).**
> Production-ready React hooks and interactive UI components for in-browser batch image compression, real-time *Before/After* comparison sliders, thumbnail management, and ZIP batch downloads.

---

## 🔗 Quick Links & Live Demos

| Resource | URL |
| :--- | :--- |
| 🌐 **Interactive Documentation** | [https://jl-image-manger.vercel.app/app/documentation/](https://jl-image-manger.vercel.app/app/documentation/) |
| ⚡ **Live Playground** | [https://jl-image-manger.vercel.app/app/playground/](https://jl-image-manger.vercel.app/app/playground/) |
| 🐙 **GitHub Repository** | [https://github.com/cjorgeluis122333/jl-image-manger](https://github.com/cjorgeluis122333/jl-image-manger) |

---

## 📋 Table of Contents

- [Key Features](#-key-features)
- [Installation](#-installation)
- [Quick Start](#-quick-start)
- [Advanced Batch Processing & ZIP Export](#-advanced-batch-processing--zip-export)
- [API Reference](#-api-reference)
  - [useImageOptimizer Hook](#useimageoptimizer-hook)
  - [ImageComparison Component](#imagecomparison-component)
  - [ImageGallery Component](#imagegallery-component)
- [i18n & Localization](#-i18n--localization)
- [SEO & Indexing Keywords](#-keywords)
- [License](#-license)

---

## ✨ Key Features

- 🔄 **`useImageOptimizer` Hook**: Manages image batch state, memory deallocation, instant quality re-compression (~10-50ms) using `ImageBitmap` caching, and bulk ZIP packaging.
- 🎚️ **`<ImageComparison />` Before/After Slider**:
  - Interactive split-screen comparison canvas.
  - Mobile-optimized touch gestures (`touch-none` prevents page scrolling during slider movement).
  - Wheel zoom and click-and-drag panning to inspect image artifacts at 100%+ scale.
  - Accessible (a11y) keyboard navigation (`ArrowLeft`, `ArrowRight`, `Home`, `End`).
- 🖼️ **`<ImageGallery />` Thumbnail Manager**: Displays thumbnails for quick preview switching or item deletion with immediate memory cleanup.
- 📦 **Intelligent ZIP Export**: Packs compressed images into a `.zip` archive with automatic duplicate filename conflict resolution (`photo.jpg`, `photo (1).jpg`).
- 🌐 **Built-in i18n**: Out-of-the-box support for English (`'en'`) and Spanish (`'es'`), with fully customizable labels.

---

## 📥 Installation

Install `jl-optimize-images-react` and its peer dependencies:

```bash
npm install jl-optimize-images-react jl-optimize-images lucide-react jszip
```

Or using **yarn**, **pnpm**, or **bun**:

```bash
# Yarn
yarn add jl-optimize-images-react jl-optimize-images lucide-react jszip

# pnpm
pnpm add jl-optimize-images-react jl-optimize-images lucide-react jszip

# Bun
bun add jl-optimize-images-react jl-optimize-images lucide-react jszip
```

---

## 🚀 Quick Start (Single Comparison Slider)

```tsx
import React from 'react';
import { ImageComparison } from 'jl-optimize-images-react';

export function SingleComparisonDemo() {
  return (
    <div className="w-full max-w-3xl mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">Image Quality Comparison</h2>
      <ImageComparison
        originalUrl="https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200"
        originalSize={2450000} // ~2.45 MB
        compressedUrl="https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200&q=60"
        compressedSize={320000} // ~320 KB
        locale="en"
        className="h-[450px] rounded-2xl shadow-xl border border-slate-200"
      />
    </div>
  );
}
```

---

## 💎 Advanced Batch Processing & ZIP Export

The `useImageOptimizer` hook automates background processing, memory deallocation, and batch ZIP downloading:

```tsx
import React from 'react';
import { useImageOptimizer, ImageComparison, ImageGallery } from 'jl-optimize-images-react';

export function FullOptimizerApp() {
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
    maxWidth: 1600,
    locale: 'en', // 'en' or 'es'
  });

  return (
    <div className="max-w-6xl mx-auto p-6 bg-slate-50 rounded-3xl border border-slate-200 flex flex-col gap-6">
      {/* Header Stats */}
      <div className="flex items-center justify-between bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <h1 className="text-lg font-bold text-slate-800">Batch Image Optimizer</h1>
          <p className="text-xs text-slate-500">
            {images.length} file(s) loaded • Saved: {stats.overallSavedPercentage}% ({ (stats.totalSavedBytes / 1024 / 1024).toFixed(2) } MB)
          </p>
        </div>
        
        {images.length > 0 && (
          <div className="flex gap-2">
            <button
              onClick={() => downloadZip('optimized_images.zip')}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs rounded-xl transition shadow-sm"
            >
              Download ZIP
            </button>
            <button
              onClick={clearImages}
              className="px-4 py-2 border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs rounded-xl transition"
            >
              Clear
            </button>
          </div>
        )}
      </div>

      {/* Upload Zone & Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1 flex flex-col gap-4">
          <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-300 hover:border-indigo-500 rounded-2xl cursor-pointer bg-white transition">
            <span className="text-xs font-semibold text-slate-600 mb-1">Click to upload</span>
            <span className="text-[10px] text-slate-400">PNG, JPG, WebP</span>
            <input
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={(e) => e.target.files && addFiles(e.target.files)}
            />
          </label>

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
            locale="en"
          />
        </div>

        {/* Active Image Comparison */}
        <div className="md:col-span-3">
          {activeImage ? (
            <ImageComparison
              originalUrl={activeImage.originalUrl}
              originalSize={activeImage.originalSize}
              compressedUrl={activeImage.result?.dataUrl}
              compressedSize={activeImage.result?.compressedSize}
              isCompressing={activeImage.isCompressing}
              locale="en"
              className="h-[500px] rounded-2xl shadow-md border border-slate-200"
            />
          ) : (
            <div className="h-[500px] border border-dashed border-slate-300 rounded-2xl flex items-center justify-center text-slate-400 bg-white">
              Select or upload images to preview compression
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
```

---

## 📖 API Reference

### `useImageOptimizer(options)`

#### Parameters (`UseImageOptimizerOptions`)

| Option | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `quality` | `number` | `0.85` | Target quality between `0.01` and `1.0`. |
| `mimeType` | `'image/webp' \| 'image/jpeg' \| 'image/png'` | `'image/webp'` | Target export format. |
| `maxWidth` | `number` | `undefined` | Maximum width constraint in pixels. |
| `maxHeight` | `number` | `undefined` | Maximum height constraint in pixels. |
| `maintainAspectRatio` | `boolean` | `true` | Preserves width/height ratio during resizing. |
| `locale` | `'en' \| 'es'` | `'es'` | Locale language for UI tooltips and labels. |

#### Return Value

```typescript
{
  images: OptimizerImage[];              // Loaded images with compression state
  selectedId: string | null;            // Currently active thumbnail ID
  activeImage: OptimizerImage | null;    // Reference to active selected image
  addFiles: (files: FileList | File[]) => Promise<void>; // Add files to optimizer queue
  removeFile: (id: string) => void;      // Remove file and free Object URLs & GPU cache
  clearImages: () => void;               // Clear all files and release all memory
  downloadZip: (filename?: string) => Promise<void>; // Export batch as a ZIP archive
  recompressSingle: (id: string, opts?: Partial<CompressionOptions>) => Promise<void>; // Fast re-compress
  stats: {
    totalOriginalSize: number;
    totalCompressedSize: number;
    totalSavedBytes: number;
    overallSavedPercentage: number;
  };
}
```

---

### `<ImageComparison />` Component

| Property | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `originalUrl` | `string` | `''` | Original image URL (left side). |
| `originalSize` | `number` | `undefined` | Original size in bytes for tag display. |
| `compressedUrl` | `string` | `''` | Compressed image URL (right side). |
| `compressedSize` | `number` | `undefined` | Compressed size in bytes for tag display. |
| `isCompressing` | `boolean` | `false` | Shows loading spinner over canvas during processing. |
| `locale` | `'en' \| 'es'` | `'es'` | Language for component text. |
| `className` | `string` | `''` | Tailwind or CSS classes applied to container. |

---

### `<ImageGallery />` Component

| Property | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `images` | `GalleryImage[]` | `[]` | Array of thumbnails `{ id, originalUrl, compressedUrl, isCompressing, hasResult }`. |
| `selectedId` | `string \| null` | `null` | Active highlighted thumbnail ID. |
| `onSelect` | `(id: string) => void` | (Required) | Callback when thumbnail is clicked. |
| `onRemove` | `(id: string) => void` | (Required) | Callback when delete button is clicked. |
| `hideIfSingle` | `boolean` | `false` | Hides gallery row if only 1 image exists. |
| `locale` | `'en' \| 'es'` | `'es'` | Language configuration. |

---

## 🌐 i18n & Localization

Switch between English and Spanish effortlessly via the `locale` prop:

```tsx
<ImageComparison locale="en" ... />
<ImageGallery locale="es" ... />
```

---

## 🏷️ Keywords

`react image optimizer` `react image compression` `image comparison slider` `before after slider react` `batch image compressor react` `useImageOptimizer` `react webp converter` `react image resizer` `react canvas image compression`

---

## 📄 License

MIT © [Jorge Luis Pabón Izquierdo](https://github.com/cjorgeluis122333) — [jl-image-manger Repository](https://github.com/cjorgeluis122333/jl-image-manger)

