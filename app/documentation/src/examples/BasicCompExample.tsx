import React, { useEffect, useState } from 'react';
import { ImageComparison } from 'jl-optimize-images-react';

function generateProceduralImage(ctx: CanvasRenderingContext2D, width: number, height: number, qualityText: string, isOriginal: boolean) {
  // Background gradient
  const grad = ctx.createLinearGradient(0, 0, width, height);
  grad.addColorStop(0, '#121214'); // deep dark slate
  grad.addColorStop(0.5, '#1e1b4b'); // dark indigo
  grad.addColorStop(1, '#020617'); // obsidian
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, height);

  // Draw fine high-frequency grid lines (extremely sensitive to compression distortion)
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
  ctx.lineWidth = 1;
  for (let i = 0; i < width; i += 25) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, height);
    ctx.stroke();
  }
  for (let j = 0; j < height; j += 25) {
    ctx.beginPath();
    ctx.moveTo(0, j);
    ctx.lineTo(width, j);
    ctx.stroke();
  }

  // Draw vibrant concentric circles (shows JPEG mosquito noise and ringing artifacts)
  ctx.strokeStyle = '#f43f5e'; // Vibrant Rose
  ctx.lineWidth = 3;
  for (let r = 60; r <= 220; r += 30) {
    ctx.beginPath();
    ctx.arc(width / 2, height / 2, r, 0, Math.PI * 2);
    ctx.stroke();
  }

  // Intersecting thin diagonal rays
  ctx.strokeStyle = '#eab308'; // Amber
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(width, height);
  ctx.moveTo(width, 0);
  ctx.lineTo(0, height);
  ctx.stroke();

  // Sharp graphic center element
  ctx.fillStyle = isOriginal ? '#10b981' : '#3b82f6';
  ctx.beginPath();
  ctx.arc(width / 2, height / 2, 45, 0, Math.PI * 2);
  ctx.fill();

  // Text representation for sharpness evaluation
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 36px system-ui, -apple-system, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('DIAGNÓSTICO CODEC', width / 2, height / 2 - 80);

  ctx.fillStyle = '#38bdf8'; // Sky blue
  ctx.font = 'bold 20px monospace';
  ctx.fillText(qualityText, width / 2, height / 2 + 5);

  ctx.fillStyle = '#94a3b8'; // Slate
  ctx.font = '14px system-ui, sans-serif';
  ctx.fillText('Scroll / Zoom con rueda para ver los macrobloques de compresión', width / 2, height / 2 + 130);
}

export function BasicCompExample() {
  const [quality, setQuality] = useState<number>(0.15);
  const [images, setImages] = useState<{ original: string; compressed: string } | null>(null);

  useEffect(() => {
    // Generate original on canvas
    const origCanvas = document.createElement('canvas');
    origCanvas.width = 800;
    origCanvas.height = 600;
    const ctx1 = origCanvas.getContext('2d');
    if (ctx1) {
      generateProceduralImage(ctx1, 800, 600, 'Calidad: Original (100%)', true);
    }
    const origUrl = origCanvas.toDataURL('image/jpeg', 1.0);

    // Generate compressed on canvas with custom quality parameter
    const compCanvas = document.createElement('canvas');
    compCanvas.width = 800;
    compCanvas.height = 600;
    const ctx2 = compCanvas.getContext('2d');
    if (ctx2) {
      generateProceduralImage(ctx2, 800, 600, `Calidad: JPEG ${Math.round(quality * 100)}%`, false);
    }
    const compUrl = compCanvas.toDataURL('image/jpeg', Math.max(0.01, quality));

    setImages({
      original: origUrl,
      compressed: compUrl,
    });
  }, [quality]);

  const originalSize = 512 * 1024; // Simulated 512 KB original
  const compressedSize = Math.round(originalSize * (0.04 + 0.96 * Math.pow(quality, 1.6)));
  const savedPercent = Math.round(((originalSize - compressedSize) / originalSize) * 100);

  const code = `import React, { useState } from 'react';
import { ImageComparison } from 'jl-optimize-images-react';

export default function MiComparadorInteractivo() {
  const [quality, setQuality] = useState(0.15);

  return (
    <div className="flex flex-col gap-4">
      <ImageComparison
        originalUrl="url_original.jpg"
        originalSize={524288}
        compressedUrl="url_comprimido.webp"
        compressedSize={Math.round(524288 * quality)}
        className="h-[400px] rounded-2xl shadow-xl bg-slate-900"
      />
      <input 
        type="range" 
        min="0.01" 
        max="1.0" 
        step="0.01" 
        value={quality} 
        onChange={(e) => setQuality(parseFloat(e.target.value))} 
      />
    </div>
  );
}`;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 mb-12">
      <h1 className="text-3xl font-bold text-slate-900 mb-2">Componente Básico: ImageComparison</h1>
      <p className="text-slate-600 mb-8 leading-relaxed">
        El componente <code>ImageComparison</code> te permite crear comparadores visuales (antes/después)
        con un slider arrastrable para que tus usuarios aprecien instantáneamente la calidad de compresión.
      </p>

      {/* Preview container */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm mb-8">
        <h2 className="text-lg font-semibold text-slate-900 mb-1">Previsualización interactiva</h2>
        <p className="text-xs text-slate-500 mb-5">Arrastra el regulador para re-comprimir y el scroll del ratón encima de la imagen para hacer zoom.</p>
        
        {images ? (
          <div className="space-y-6">
            <ImageComparison
              originalUrl={images.original}
              originalSize={originalSize}
              compressedUrl={images.compressed}
              compressedSize={compressedSize}
              className="h-[400px] border border-slate-200 rounded-2xl overflow-hidden bg-slate-900 shadow-inner"
            />
            
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/60 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-semibold text-slate-700">Calidad de Compresión:</span>
                  <span className="text-sm font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                    {Math.round(quality * 100)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0.01"
                  max="1.00"
                  step="0.01"
                  value={quality}
                  onChange={(e) => setQuality(parseFloat(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-ew-resize accent-indigo-600"
                />
              </div>
              <div className="flex flex-row md:flex-col justify-between md:text-right border-t md:border-t-0 md:border-l border-slate-200 pt-3 md:pt-0 md:pl-6 min-w-[150px]">
                <span className="text-xs text-slate-500">Peso aproximado:</span>
                <span className="text-sm font-semibold text-slate-700">
                  {(compressedSize / 1024).toFixed(1)} KB
                </span>
                <span className="text-xs font-medium text-emerald-600 mt-0.5">
                  Ahorro estimado: -{savedPercent}%
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-[400px] bg-slate-100 animate-pulse rounded-2xl flex items-center justify-center text-slate-400">
            Cargando lienzo de prueba...
          </div>
        )}
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
