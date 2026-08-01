# jl-optimize-images-react 🎨⚛️

The official **React** integration layer for the powerful [jl-optimize-images](../image-compressor) in-browser image compression library.

Provides production-ready, highly interactive React components and hooks for batch image compression, real-time comparison sliders (*Before/After*), thumbnail management, and secure batch downloading in ZIP files with automatic duplicate filename collision handling.

---

## ✨ Key Features

- 🔄 **`useImageOptimizer` Hook**: Streamlines batch management, loading states, lightning-fast quality re-compression in milliseconds using `ImageBitmap` caching, and bulk ZIP exports.
- 🎚️ **`<ImageComparison />` Component (Before/After)**:
  - Highly responsive and interactive comparison slider.
  - Complete support for fluid touch gestures (`touch-none`) that do not interfere with page scrolling.
  - Fully accessible (a11y) with native keyboard support (arrow keys, Home, End).
  - Interactive wheel zoom and click-drag panning to inspect compression macroblocks and artifacts at a pixel level.
- 🖼️ **`<ImageGallery />` Component**: Displays and manages thumbnails of the active batch, letting users switch selected previews or delete files to instantly release memory resources.
- 🌐 **Native Localization (i18n)**: Out-of-the-box support for English (`'en'`) and Spanish (`'es'`), alongside fully customizable text labels and helpful hints.

---

## 📥 Installation

Install the package in your React project along with its peer dependencies:

```bash
npm install jl-optimize-images-react jl-optimize-images lucide-react jszip
```

or using yarn / pnpm / bun:

```bash
yarn add jl-optimize-images-react jl-optimize-images lucide-react jszip
pnpm add jl-optimize-images-react jl-optimize-images lucide-react jszip
bun add jl-optimize-images-react jl-optimize-images lucide-react jszip
```

---

## 🚀 Quick Start (Single Comparison Slider)

Here is a straightforward example demonstrating how to integrate an interactive image comparison slider:

```tsx
import React from 'react';
import { ImageComparison } from 'jl-optimize-images-react';

export function SimpleDemo() {
  return (
    <div className="w-full max-w-2xl mx-auto">
      <ImageComparison
        originalUrl="https://example.com/landscape-original.jpg"
        originalSize={2048576} // 2.0 MB
        compressedUrl="https://example.com/landscape-compressed.webp"
        compressedSize={307200} // 300 KB
        className="h-[400px] rounded-2xl shadow-lg bg-slate-900"
      />
    </div>
  );
}
```

---

## 💎 Advanced Usage (Batch Processing & ZIP Export)

The `useImageOptimizer` hook automates the complete lifecycle: pre-loading into GPU memory, concurrent background processing, memory deallocation, and safe ZIP packaging.

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
    locale: 'en' // Interface locale: 'en' or 'es'
  });

  return (
    <div className="flex flex-col md:flex-row gap-6 p-6 bg-slate-50 rounded-3xl border border-slate-150">
      {/* Sidebar Controls */}
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
              onClick={() => downloadZip('optimized_batch.zip')}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs transition shadow-sm"
            >
              Download Batch (.ZIP)
            </button>
            <button
              onClick={clearImages}
              className="w-full py-2.5 border border-rose-200 text-rose-600 hover:bg-rose-50 rounded-xl text-xs transition"
            >
              Clear All
            </button>
          </>
        )}
      </div>

      {/* Main Preview Container */}
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
            Upload or drag images to start optimizing
          </div>
        )}
      </div>
    </div>
  );
}
```

---

## 📖 API Reference (React)

### `useImageOptimizer(options)`

#### Parameters (`UseImageOptimizerOptions`)

| Option | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `quality` | `number` | `0.85` | Compression quality (range from `0.01` to `1.0`). |
| `mimeType` | `'image/webp' \| 'image/jpeg' \| 'image/png'` | `'image/webp'` | Export MIME format. |
| `maxWidth` | `number` | `undefined` | Maximum image width constraint in pixels. |
| `maxHeight` | `number` | `undefined` | Maximum image height constraint in pixels. |
| `maintainAspectRatio` | `boolean` | `true` | Maintain proportions while resizing. |
| `locale` | `'en' \| 'es'` | `'es'` | Locale language for component tooltips and labels. |

#### Return Value

```typescript
{
  images: OptimizerImage[];             // List of loaded images in processing or completed states
  selectedId: string | null;           // ID of the active selected image
  activeImage: OptimizerImage | null;   // Active selected image object reference
  addFiles: (files: FileList | File[]) => Promise<void>; // Add new files to optimizer batch queue
  removeFile: (id: string) => void;     // Remove file and release its object URLs and references
  clearImages: () => void;              // Reset batch queue and clean up all loaded memory references
  downloadZip: (filename?: string) => Promise<void>; // Compile active batch into a single ZIP with clean naming
}
```

---

### `<ImageComparison />` Component

| Property | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `originalUrl` | `string` | `''` | URL or Data URL of the original input image (left-hand side). |
| `originalSize` | `number` | `undefined` | Original image size in bytes for the information tags. |
| `compressedUrl` | `string` | `''` | URL or Data URL of the compressed output image (right-hand side). |
| `compressedSize` | `number` | `undefined` | Compressed image size in bytes for the information tags. |
| `isCompressing` | `boolean` | `false` | When `true`, displays a progress indicator on the comparison canvas. |
| `locale` | `'en' \| 'es'` | `'es'` | Localization language configuration. |
| `className` | `string` | `''` | Tailwind or CSS class string targeting the main layout. |

---

### `<ImageGallery />` Component

| Property | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `images` | `GalleryImage[]` | `[]` | Array of image elements following `{ id, originalUrl, compressedUrl, isCompressing, hasResult }`. |
| `selectedId` | `string \| null` | `null` | Active highlighted thumbnail ID. |
| `onSelect` | `(id: string) => void` | (Required) | Callback triggered upon clicking a thumbnail. |
| `onRemove` | `(id: string) => void` | (Required) | Callback triggered upon clicking the remove icon. |
| `locale` | `'en' \| 'es'` | `'es'` | Localization language configuration. |
| `hideIfSingle` | `boolean` | `false` | Hides the gallery element if only one thumbnail is active. |

---

## 📄 License

MIT © [jl-optimize-images-react](https://github.com/jlcpabonisquierdo)
