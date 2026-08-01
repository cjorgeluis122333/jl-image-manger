# JL Image Optimization Monorepo 🚀🖼️

A high-performance monorepo designed for in-browser image optimization, compression, interactive comparison sliders, and batch processing, running entirely client-side with maximum efficiency.

This workspace hosts the core TypeScript engine, the official React wrapper, and a complete interactive documentation and playground application.

---

## 📂 Monorepo Structure

This project is organized using a modern monorepo architecture with **Yarn/npm Workspaces**:

```
.
├── packages/
│   ├── image-compressor/         # "jl-optimize-images" (Core TS compression engine)
│   └── jl-optimize-images-react/ # "jl-optimize-images-react" (Official React integration)
│
├── app/
│   └── documentation/            # Interactive documentation & playground web app
│
├── server.ts                     # Express server for development and production hosting
└── package.json                  # Root configurations, workspace settings, and build scripts
```

---

## 💡 Why This Solution? (Core Technical Advantages)

1. **⚡ Hardware-Accelerated Decoding Cache (`ImageBitmap`)**:
   The compression engine decodes the graphic resource only once directly into the graphics card memory (`GPU`). This enables real-time re-compression on interactive quality sliders (from 1% to 100%) in a matter of **milliseconds** (~10-50ms) without re-decoding the original image from disk.

2. **📸 Automatic EXIF Rotation**:
   Natively and transparently corrects the orientation and rotation of photos taken on mobile devices or digital cameras using `createImageBitmap(blob, { imageOrientation: 'from-image' })`.

3. **📉 Fractional Step-Down Scaling**:
   Implements an iterative downscaling algorithm (halving resolution in steps) to prevent aliasing artifacts (jagged edges) and preserve optimal sharpness even when performing extreme resolution reductions.

4. **🟢 Smooth UI Thread Preservation (`yieldToMain`)**:
   Splits heavy batch processing into asynchronous, concurrent tasks and periodically yields control to the browser's event loop via `scheduler.yield()` or `MessageChannel`. This guarantees that the user interface remains responsive and fluid at a stable 60 FPS.

5. **📦 Intelligent ZIP Downloads**:
   Automatically manages batch downloads, avoiding duplicate filename collisions by renaming them dynamically (e.g. `photo.jpg`, `photo (1).jpg`, etc.) before exporting.

---

## 🛠️ Getting Started

### Prerequisites

Make sure you have [Node.js](https://nodejs.org/) installed (version 18 or higher).

### Installation

Clone the repository and install all dependencies for the workspace from the root directory:

```bash
npm install
```

### Available Scripts

You can run the following tasks from the root of the monorepo:

- **Development (Express Server + Vite)**:
  Starts the local development environment with Hot Module Replacement for the documentation app:
  ```bash
  npm run dev
  ```
  The application will be available at `http://localhost:3000`.

- **Production Build**:
  Compiles the library packages and bundles the web application for deployment:
  ```bash
  npm run build
  ```

- **Production Start**:
  Launches the compiled Express server to serve the static documentation app in production:
  ```bash
  npm run start
  ```

- **Type Checking & Linter**:
  ```bash
  npm run lint
  ```

---

## 📦 Monorepo Packages

### 1. Compression Core: `jl-optimize-images`

The core optimization engine written in pure TypeScript with zero external dependencies.

* **Quick Usage**:
  ```typescript
  import { ImageCompressor } from 'jl-optimize-images';

  const file = inputElement.files[0];
  const compressor = new ImageCompressor(file);

  // Optional: pre-load into GPU memory for ultra-fast response
  await compressor.preload();

  // Compress to WebP at 80% quality
  const result = await compressor.compress({
    quality: 0.8,
    mimeType: 'image/webp',
    maxWidth: 1200
  });

  console.log(`Saved ${result.savingsPercentage}%!`);
  // Render the compressed image
  imgElement.src = result.dataUrl;

  // Release memory resources
  compressor.dispose();
  ```
* [View detailed Core documentation](./packages/image-compressor/README.md)

### 2. React Integration Layer: `jl-optimize-images-react`

Provides a highly declarative React interface through hooks and fully styled, responsive components with top-tier user experience and design.

* **Quick Usage**:
  ```tsx
  import { useImageOptimizer, ImageComparison, ImageGallery } from 'jl-optimize-images-react';

  export function BatchOptimizer() {
    const {
      images,
      activeImage,
      selectedId,
      setSelectedId,
      addFiles,
      removeFile,
      downloadZip
    } = useImageOptimizer({ quality: 0.85, mimeType: 'image/webp' });

    return (
      <div>
        <input type="file" multiple onChange={(e) => e.target.files && addFiles(e.target.files)} />
        
        {activeImage && (
          <ImageComparison
            originalUrl={activeImage.originalUrl}
            originalSize={activeImage.originalSize}
            compressedUrl={activeImage.result?.dataUrl}
            compressedSize={activeImage.result?.compressedSize}
            isCompressing={activeImage.isCompressing}
          />
        )}
        
        <ImageGallery
          images={images.map(img => ({
            id: img.id,
            originalUrl: img.originalUrl,
            compressedUrl: img.result?.dataUrl,
            isCompressing: img.isCompressing,
            hasResult: !!img.result
          }))}
          selectedId={selectedId}
          onSelect={setSelectedId}
          onRemove={removeFile}
        />
        
        {images.length > 0 && <button onClick={() => downloadZip()}>Download as ZIP</button>}
      </div>
    );
  }
  ```
* [View detailed React documentation](./packages/jl-optimize-images-react/README.md)

---

## 📝 License

MIT © [jl-optimize-images](https://github.com/jlcpabonisquierdo)
