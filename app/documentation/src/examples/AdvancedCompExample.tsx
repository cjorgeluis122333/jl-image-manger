import React, { useState, useRef } from 'react';
import { useImageOptimizer, ImageComparison, ImageGallery } from 'jl-optimize-images-react';
import { Upload, Sparkles, Sliders, Download, Trash2, Globe } from 'lucide-react';

export function AdvancedCompExample() {
  const [quality, setQuality] = useState<number>(0.7);
  const [mimeType, setMimeType] = useState<'image/jpeg' | 'image/webp' | 'image/png'>('image/webp');
  const [maxWidth, setMaxWidth] = useState<number>(1024);
  const [useResize, setUseResize] = useState<boolean>(true);
  const [maxHeight, setMaxHeight] = useState<number>(1024);
  const [useResizeHeight, setUseResizeHeight] = useState<boolean>(false);
  const [maintainAspectRatio, setMaintainAspectRatio] = useState<boolean>(true);
  const [locale, setLocale] = useState<'es' | 'en'>('es');

  const {
    images,
    selectedId,
    setSelectedId,
    addFiles,
    removeFile,
    clearImages,
    downloadZip,
  } = useImageOptimizer({
    quality,
    maxWidth: useResize ? maxWidth : undefined,
    maxHeight: useResizeHeight ? maxHeight : undefined,
    mimeType,
    maintainAspectRatio,
    locale,
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

  // Calculate batch metrics
  const totalOriginalSize = images.reduce((acc, img) => acc + img.originalSize, 0);
  const totalCompressedSize = images.reduce((acc, img) => acc + (img.result?.compressedSize || img.originalSize), 0);
  const totalSavedBytes = Math.max(0, totalOriginalSize - totalCompressedSize);
  const overallSavedPercentage = totalOriginalSize > 0 ? Math.round((totalSavedBytes / totalOriginalSize) * 100) : 0;

  const code = `import React, { useState } from 'react';
import { useImageOptimizer, ImageComparison, ImageGallery } from 'jl-optimize-images-react';

export default function OptimizadorSuperAvanzado() {
  const [quality, setQuality] = useState(0.7);
  const [mimeType, setMimeType] = useState<'image/webp' | 'image/jpeg' | 'image/png'>('image/webp');
  const [maxWidth, setMaxWidth] = useState(1024);
  const [maxHeight, setMaxHeight] = useState(1024);
  const [maintainAspectRatio, setMaintainAspectRatio] = useState(true);
  const [locale, setLocale] = useState<'es' | 'en'>('es');

  const {
    images,
    selectedId,
    setSelectedId,
    addFiles,
    removeFile,
    clearImages,
    downloadZip,
  } = useImageOptimizer({
    quality,
    mimeType,
    maxWidth,
    maxHeight,
    maintainAspectRatio,
    locale,
  });

  const activeImage = images.find(img => img.id === selectedId) || images[0];

  return (
    <div className="p-6 bg-slate-900 text-white rounded-2xl shadow-xl">
      <h3 className="text-lg font-bold mb-4">Múltiple Compresión Avanzada</h3>
      
      {/* Parámetros */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="text-xs font-semibold block mb-1 text-slate-300">Calidad: {Math.round(quality * 100)}%</label>
          <input 
            type="range" 
            min="0.01" 
            max="1.00" 
            step="0.01" 
            value={quality} 
            onChange={(e) => setQuality(parseFloat(e.target.value))} 
            className="w-full accent-indigo-500"
          />
        </div>
        <div>
          <label className="text-xs font-semibold block mb-1 text-slate-300">Formato de Compresión</label>
          <select 
            value={mimeType} 
            onChange={(e) => setMimeType(e.target.value as any)}
            className="w-full bg-slate-800 border border-slate-700 rounded p-1.5 text-sm focus:ring-1 focus:ring-indigo-500 text-white"
          >
            <option value="image/webp">WebP (Óptimo)</option>
            <option value="image/jpeg">JPEG (Estándar)</option>
            <option value="image/png">PNG (Sin pérdida)</option>
          </select>
        </div>
      </div>

      <div className="flex gap-4 mb-6">
        <input 
          type="file" 
          multiple 
          accept="image/*"
          onChange={(e) => e.target.files && addFiles(e.target.files)} 
          className="text-xs block w-full text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-500"
        />
        {images.length > 0 && (
          <div className="flex gap-2">
            <button 
              onClick={() => downloadZip('lote_optimizaciones.zip')}
              className="bg-emerald-600 hover:bg-emerald-500 px-4 py-2 rounded text-xs font-bold transition flex items-center gap-1.5"
            >
              Descargar ZIP
            </button>
            <button 
              onClick={clearImages}
              className="bg-rose-600 hover:bg-rose-500 px-4 py-2 rounded text-xs font-bold transition flex items-center gap-1.5"
            >
              Limpiar Todo
            </button>
          </div>
        )}
      </div>

      {activeImage && (
        <div className="space-y-4">
          <ImageComparison
            originalUrl={activeImage.originalUrl}
            originalSize={activeImage.originalSize}
            compressedUrl={activeImage.result?.dataUrl}
            compressedSize={activeImage.result?.compressedSize}
            isCompressing={activeImage.isCompressing}
            className="h-[350px] rounded-xl overflow-hidden bg-zinc-950 border border-zinc-800"
          />

          <ImageGallery
            images={images.map(img => ({
              id: img.id,
              originalUrl: img.originalUrl,
              name: img.file.name,
              isCompressing: img.isCompressing,
              hasResult: !!img.result
            }))}
            selectedId={selectedId}
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
                min="0.01"
                max="1.00"
                step="0.01"
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

            {/* Dimension Resize Width */}
            <div>
              <label className="text-xs font-medium text-slate-600 flex items-center gap-1.5 cursor-pointer mb-2">
                <input
                  type="checkbox"
                  checked={useResize}
                  onChange={(e) => setUseResize(e.target.checked)}
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5"
                />
                <span>Redimensionar Ancho</span>
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

            {/* Dimension Resize Height */}
            <div>
              <label className="text-xs font-medium text-slate-600 flex items-center gap-1.5 cursor-pointer mb-2">
                <input
                  type="checkbox"
                  checked={useResizeHeight}
                  onChange={(e) => setUseResizeHeight(e.target.checked)}
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5"
                />
                <span>Redimensionar Alto</span>
              </label>
              {useResizeHeight && (
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={maxHeight}
                    onChange={(e) => setMaxHeight(Math.max(100, parseInt(e.target.value) || 1024))}
                    className="w-full text-xs border border-slate-200 rounded-lg p-2 font-mono"
                    placeholder="Alto máx"
                  />
                  <span className="text-slate-400 text-xs">px</span>
                </div>
              )}
            </div>

            {/* Aspect Ratio Preservation */}
            <div>
              <label className="text-xs font-medium text-slate-600 flex items-center gap-1.5 cursor-pointer mb-1">
                <input
                  type="checkbox"
                  checked={maintainAspectRatio}
                  onChange={(e) => setMaintainAspectRatio(e.target.checked)}
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5"
                />
                <span>Mantener Relación de Aspecto</span>
              </label>
            </div>

            {/* Language Locale Selection */}
            <div>
              <label className="text-xs font-medium text-slate-600 flex items-center gap-1 block mb-1">
                <Globe className="w-3.5 h-3.5 text-indigo-500" /> Idioma (Locale)
              </label>
              <select
                value={locale}
                onChange={(e) => setLocale(e.target.value as 'es' | 'en')}
                className="w-full text-xs bg-white border border-slate-200 rounded-lg p-2 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="es">Español (ES)</option>
                <option value="en">English (EN)</option>
              </select>
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

            {images.length > 0 && (
              <button
                onClick={clearImages}
                className="w-full py-2 border border-rose-200 text-rose-600 hover:bg-rose-50 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition"
              >
                <Trash2 className="w-3.5 h-3.5" /> Limpiar Todo
              </button>
            )}
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
                      locale={locale}
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
                  locale={locale}
                  className="py-1"
                />

                {/* Batch Metrics / Action Panel */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="grid grid-cols-2 sm:flex sm:items-center gap-4 flex-1">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-bold uppercase">Ahorro Lote</span>
                      <span className="text-sm font-extrabold text-emerald-600">
                        -{overallSavedPercentage}%
                      </span>
                    </div>
                    <div className="sm:border-l sm:border-slate-200 sm:pl-4">
                      <span className="text-[10px] text-slate-400 block font-bold uppercase">Original Total</span>
                      <span className="text-xs font-semibold text-slate-700 font-mono">
                        {(totalOriginalSize / 1024).toFixed(0)} KB
                      </span>
                    </div>
                    <div className="sm:border-l sm:border-slate-200 sm:pl-4">
                      <span className="text-[10px] text-slate-400 block font-bold uppercase">Optimizado Total</span>
                      <span className="text-xs font-semibold text-slate-700 font-mono">
                        {(totalCompressedSize / 1024).toFixed(0)} KB
                      </span>
                    </div>
                    <div className="col-span-2 sm:col-span-1 sm:border-l sm:border-slate-200 sm:pl-4">
                      <span className="text-[10px] text-slate-400 block font-bold uppercase">Imágenes</span>
                      <span className="text-xs font-semibold text-slate-700">
                        {images.length} cargadas
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => downloadZip('imagenes_optimizadas.zip')}
                    className="flex items-center justify-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-sm transition"
                  >
                    <Download className="w-3.5 h-3.5" /> Descargar Lote (.zip)
                  </button>
                </div>
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

