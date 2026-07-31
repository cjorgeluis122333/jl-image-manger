import React, { useState, useRef } from 'react';
import { useImageOptimizer, ImageComparison, ImageGallery } from 'jl-optimize-images-react';
import { Upload, Sparkles, Sliders, Download, Trash2, ArrowRight } from 'lucide-react';

export function AdvancedCompExample() {
  const [quality, setQuality] = useState<number>(0.7);
  const [mimeType, setMimeType] = useState<'image/jpeg' | 'image/webp' | 'image/png'>('image/webp');
  const [maxWidth, setMaxWidth] = useState<number>(1024);
  const [useResize, setUseResize] = useState<boolean>(true);

  const {
    images,
    selectedId,
    setSelectedId,
    addFiles,
    removeFile,
    clearImages,
  } = useImageOptimizer({
    quality,
    maxWidth: useResize ? maxWidth : undefined,
    mimeType,
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      addFiles(e.target.files);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      addFiles(e.dataTransfer.files);
    }
  };

  const activeImage = images.find((img) => img.id === selectedId) || images[0];

  const code = `import React, { useState } from 'react';
import { useImageOptimizer, ImageComparison, ImageGallery } from 'jl-optimize-images-react';

export default function OptimizadorAvanzado() {
  const [quality, setQuality] = useState(0.7);
  const [mimeType, setMimeType] = useState<'image/webp' | 'image/jpeg'>('image/webp');

  const {
    images,
    selectedId,
    setSelectedId,
    addFiles,
    removeFile
  } = useImageOptimizer({
    quality,
    mimeType,
    maxWidth: 1080
  });

  const selectedImage = images.find(img => img.id === selectedId) || images[0];

  return (
    <div className="p-6 bg-slate-900 text-white rounded-2xl">
      {/* Controles */}
      <div className="flex gap-4 mb-4">
        <label className="text-sm">Calidad: {Math.round(quality * 100)}%</label>
        <input 
          type="range" 
          min="0.1" 
          max="1" 
          step="0.05" 
          value={quality} 
          onChange={(e) => setQuality(parseFloat(e.target.value))} 
        />
      </div>

      <input 
        type="file" 
        multiple 
        onChange={(e) => e.target.files && addFiles(e.target.files)} 
        className="mb-4"
      />

      {selectedImage && (
        <div className="space-y-4">
          <ImageComparison
            originalUrl={selectedImage.originalUrl}
            originalSize={selectedImage.originalSize}
            compressedUrl={selectedImage.result?.dataUrl}
            compressedSize={selectedImage.result?.compressedSize}
            isCompressing={selectedImage.isCompressing}
            className="h-[350px] rounded-xl overflow-hidden bg-black"
          />

          <ImageGallery
            images={images.map(img => ({
              id: img.id,
              originalUrl: img.originalUrl,
              name: img.file.name,
              isCompressing: img.isCompressing,
              hasResult: !!img.result
            }))}
            selectedId={selectedImage.id}
            onSelect={setSelectedId}
            onRemove={removeFile}
          />
        </div>
      )}
    </div>
  );
}`;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 mb-12">
      <h1 className="text-3xl font-bold text-slate-900 mb-2">Componente Avanzado: Dashboard de Optimización</h1>
      <p className="text-slate-600 mb-8 leading-relaxed">
        Combina <code>useImageOptimizer</code> con <code>ImageGallery</code> e <code>ImageComparison</code> para crear un flujo
        completo de carga, compresión en lote y comparación en paralelo con un par de líneas de código.
      </p>

      {/* Visual Workspace Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm mb-8">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Área de Trabajo Interactiva</h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          {/* Controls Panel */}
          <div className="md:col-span-1 bg-slate-50 border border-slate-150 rounded-xl p-4 flex flex-col gap-4">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-indigo-500" /> Parámetros
            </h3>

            {/* Quality control */}
            <div>
              <label className="text-xs font-medium text-slate-600 flex justify-between mb-1">
                <span>Calidad</span>
                <span className="font-semibold text-indigo-600">{Math.round(quality * 100)}%</span>
              </label>
              <input
                type="range"
                min="0.1"
                max="1.0"
                step="0.05"
                value={quality}
                onChange={(e) => setQuality(parseFloat(e.target.value))}
                className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
            </div>

            {/* Mimetype selector */}
            <div>
              <label className="text-xs font-medium text-slate-600 block mb-1">Formato</label>
              <select
                value={mimeType}
                onChange={(e) => setMimeType(e.target.value as any)}
                className="w-full text-xs bg-white border border-slate-200 rounded-lg p-2 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="image/webp">WebP (Recomendado)</option>
                <option value="image/jpeg">JPEG (Estándar)</option>
                <option value="image/png">PNG (Sin pérdida)</option>
              </select>
            </div>

            {/* Dimension Resize */}
            <div>
              <label className="text-xs font-medium text-slate-600 flex items-center gap-1.5 cursor-pointer mb-2">
                <input
                  type="checkbox"
                  checked={useResize}
                  onChange={(e) => setUseResize(e.target.checked)}
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5"
                />
                <span>Redimensionar</span>
              </label>
              {useResize && (
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={maxWidth}
                    onChange={(e) => setMaxWidth(Math.max(100, parseInt(e.target.value) || 1024))}
                    className="w-full text-xs border border-slate-200 rounded-lg p-2 font-mono"
                    placeholder="Ancho máx"
                  />
                  <span className="text-slate-400 text-xs">px</span>
                </div>
              )}
            </div>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="mt-2 w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/10 flex items-center justify-center gap-1.5 transition"
            >
              <Upload className="w-3.5 h-3.5" /> Subir Imagen
            </button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>

          {/* Core Interactive Area */}
          <div className="md:col-span-3 min-h-[350px] flex flex-col">
            {images.length === 0 ? (
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 border-2 border-dashed border-slate-300 hover:border-indigo-400 rounded-2xl bg-slate-50 flex flex-col items-center justify-center p-8 text-center cursor-pointer transition duration-200"
              >
                <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mb-4">
                  <Upload className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-semibold text-slate-800 mb-1">Arrastra o selecciona tus imágenes</h4>
                <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
                  Sube tus propios archivos JPG, PNG, o WebP y mira cómo los componentes y hooks de la librería procesan todo localmente.
                </p>
              </div>
            ) : (
              <div className="flex-1 flex flex-col gap-4">
                {activeImage && (
                  <div className="flex-1 min-h-[250px] relative rounded-2xl overflow-hidden border border-slate-200 shadow-inner flex flex-col">
                    <ImageComparison
                      originalUrl={activeImage.originalUrl}
                      originalSize={activeImage.originalSize}
                      compressedUrl={activeImage.result?.dataUrl}
                      compressedSize={activeImage.result?.compressedSize}
                      isCompressing={activeImage.isCompressing}
                      className="flex-1 h-full min-h-[200px]"
                    />
                  </div>
                )}

                {/* Thumbnail list */}
                <ImageGallery
                  images={images.map((img) => ({
                    id: img.id,
                    originalUrl: img.originalUrl,
                    name: img.file.name,
                    isCompressing: img.isCompressing,
                    hasResult: !!img.result,
                  }))}
                  selectedId={activeImage?.id || null}
                  onSelect={setSelectedId}
                  onRemove={removeFile}
                  className="py-1"
                />

                {/* Metrics */}
                {activeImage?.result && (
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-slate-50 border border-slate-150 rounded-xl p-3 text-center">
                      <span className="text-[10px] text-slate-400 block font-bold uppercase">Optimización</span>
                      <span className="text-sm font-bold text-emerald-600">-{activeImage.result.savingsPercentage.toFixed(1)}%</span>
                    </div>
                    <div className="bg-slate-50 border border-slate-150 rounded-xl p-3 text-center">
                      <span className="text-[10px] text-slate-400 block font-bold uppercase">Original</span>
                      <span className="text-sm font-medium text-slate-700 font-mono">{(activeImage.originalSize / 1024).toFixed(0)} KB</span>
                    </div>
                    <div className="bg-slate-50 border border-slate-150 rounded-xl p-3 text-center">
                      <span className="text-[10px] text-slate-400 block font-bold uppercase">Final</span>
                      <span className="text-sm font-medium text-slate-700 font-mono">{(activeImage.result.compressedSize / 1024).toFixed(0)} KB</span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Code panel */}
      <div className="bg-slate-900 rounded-xl overflow-hidden shadow-sm">
        <div className="px-4 py-3 border-b border-slate-800 flex justify-between items-center">
          <span className="text-sm font-medium text-slate-300">Código del Ejemplo</span>
          <button
            onClick={() => navigator.clipboard.writeText(code)}
            className="text-xs text-slate-400 hover:text-white transition"
          >
            Copiar
          </button>
        </div>
        <pre className="p-6 overflow-x-auto text-sm font-mono text-slate-300 leading-relaxed">
          {code}
        </pre>
      </div>
    </div>
  );
}
