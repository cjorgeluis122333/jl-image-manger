# JL Image Optimization Monorepo 🚀🖼️

[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg?style=flat-square)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18%20%7C%2019-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![GitHub Repository](https://img.shields.io/badge/GitHub-Repository-181717?style=flat-square&logo=github)](https://github.com/cjorgeluis122333/jl-image-manger)

> High-performance monorepo for client-side in-browser image optimization, compression, interactive comparison sliders, and batch processing.

---

## 🔗 Live Deployments & Repository Links

| Resource | URL |
| :--- | :--- |
| 🌐 **Interactive Documentation** | [https://jl-image-manger.vercel.app/app/documentation/](https://jl-image-manger.vercel.app/app/documentation/) |
| ⚡ **Live Playground** | [https://jl-image-manger.vercel.app/app/playground/](https://jl-image-manger.vercel.app/app/playground/) |
| 🐙 **GitHub Repository** | [https://github.com/cjorgeluis122333/jl-image-manger](https://github.com/cjorgeluis122333/jl-image-manger) |

---

## 📂 Monorepo Structure

This project is organized using npm/Yarn workspaces:

```
.
├── packages/
│   ├── image-compressor/         # "jl-optimize-images" (Core TS compression engine)
│   └── jl-optimize-images-react/ # "jl-optimize-images-react" (Official React integration)
│
├── app/
│   ├── documentation/            # Interactive documentation web application
│   └── playground/               # Live interactive playground web application
│
├── server.ts                     # Development & production server
└── package.json                  # Root configurations and workspace scripts
```

---

## 📦 Core Packages & Components

### 1. `jl-optimize-images` (Core TS Library)
The core zero-dependency TypeScript image compression engine.
- ⚡ **GPU Cache (`ImageBitmap`)**: Ultra-fast re-compression (~10-50ms).
- 📸 **EXIF Auto Rotation**: Native orientation corrections.
- 📉 **Step-Down Scaling**: Sharp resolution reduction without aliasing.
- 🟢 **`yieldToMain`**: Smooth 60 FPS UI thread preservation.
- 📘 [Read package README](./packages/image-compressor/README.md)

### 2. `jl-optimize-images-react` (React Integration)
Declarative React hooks and responsive UI components.
- 🔄 **`useImageOptimizer`**: Batch management, quality sliders, ZIP downloads.
- 🎚️ **`<ImageComparison />`**: Interactive Before/After slider with touch & keyboard support.
- 🖼️ **`<ImageGallery />`**: Thumbnail manager & memory release.
- 📘 [Read package README](./packages/jl-optimize-images-react/README.md)

---

## 🛠️ Local Development & Build

```bash
# Install dependencies across all packages
npm install

# Run development server
npm run dev

# Build packages and documentation apps
npm run build
```

---

## 📄 License

MIT © [Jorge Luis Pabón Izquierdo](https://github.com/cjorgeluis122333) — [jl-image-manger](https://github.com/cjorgeluis122333/jl-image-manger)

