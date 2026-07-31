import React, { useEffect, useState } from 'react';
import { ImageComparison } from 'jl-optimize-images-react';

export function BasicCompExample() {
  const [images, setImages] = useState<{ original: string; compressed: string } | null>(null);

  useEffect(() => {
    // Generate high-quality original canvas
    const origCanvas = document.createElement('canvas');
    origCanvas.width = 800;
    origCanvas.height = 600;
    const ctx1 = origCanvas.getContext('2d');
    if (ctx1) {
      // Background gradient
      const grad = ctx1.createLinearGradient(0, 0, 800, 600);
      grad.addColorStop(0, '#6366f1');
      grad.addColorStop(1, '#a855f7');
      ctx1.fillStyle = grad;
      ctx1.fillRect(0, 0, 800, 600);

      // Draw sharp text & shapes (representing original quality)
      ctx1.fillStyle = 'white';
      ctx1.font = 'bold 50px sans-serif';
      ctx1.textAlign = 'center';
      ctx1.fillText('Original: Nitidez Máxima', 400, 250);
      ctx1.font = '24px sans-serif';
      ctx1.fillText('Mueve el slider para comparar', 400, 320);

      // Draw sharp circles
      for (let i = 0; i < 5; i++) {
        ctx1.beginPath();
        ctx1.arc(150 + i * 120, 450, 40, 0, Math.PI * 2);
        ctx1.fillStyle = 'rgba(255, 255, 255, 0.85)';
        ctx1.fill();
        ctx1.lineWidth = 4;
        ctx1.strokeStyle = '#f43f5e';
        ctx1.stroke();
      }
    }

    // Generate low-quality compressed canvas (compressed image simulation)
    const compCanvas = document.createElement('canvas');
    compCanvas.width = 800;
    compCanvas.height = 600;
    const ctx2 = compCanvas.getContext('2d');
    if (ctx2) {
      // Blur and blocky artifacts simulation for compressed look
      const grad = ctx2.createLinearGradient(0, 0, 800, 600);
      grad.addColorStop(0, '#4f46e5');
      grad.addColorStop(1, '#9333ea');
      ctx2.fillStyle = grad;
      ctx2.fillRect(0, 0, 800, 600);

      ctx2.fillStyle = '#cbd5e1';
      ctx2.font = 'bold 48px sans-serif'; // Slightly softer font
      ctx2.textAlign = 'center';
      ctx2.fillText('Comprimido (WebP 60%)', 400, 250);
      ctx2.font = '24px sans-serif';
      ctx2.fillText('Ahorro del 84% en peso', 400, 320);

      // Draw "blurred/low-quality" circles
      for (let i = 0; i < 5; i++) {
        ctx2.beginPath();
        ctx2.arc(150 + i * 120, 450, 40, 0, Math.PI * 2);
        ctx2.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx2.fill();
        ctx2.lineWidth = 3;
        ctx2.strokeStyle = 'rgba(244, 63, 94, 0.6)';
        ctx2.stroke();
      }
    }

    const origUrl = origCanvas.toDataURL('image/jpeg', 1.0);
    const compUrl = compCanvas.toDataURL('image/jpeg', 0.2); // Compressed JPEG representation

    setImages({
      original: origUrl,
      compressed: compUrl,
    });
  }, []);

  const code = `import React from 'react';
import { ImageComparison } from 'jl-optimize-images-react';

export default function MiComparador() {
  return (
    <ImageComparison
      originalUrl="url_original.jpg"
      originalSize={1024 * 1024 * 2} // 2 MB
      compressedUrl="url_comprimido.webp"
      compressedSize={1024 * 150}    // 150 KB
      className="h-[400px] rounded-2xl shadow-xl"
    />
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
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Previsualización en tiempo real</h2>
        {images ? (
          <ImageComparison
            originalUrl={images.original}
            originalSize={1024 * 1024 * 2.1} // 2.1 MB
            compressedUrl={images.compressed}
            compressedSize={1024 * 340} // 340 KB
            className="h-[400px] border border-slate-200 rounded-2xl overflow-hidden bg-slate-900 shadow-inner"
          />
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
