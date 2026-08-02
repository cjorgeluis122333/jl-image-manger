import React from 'react';

export function GetStarted() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 mb-8 sm:mb-12">
      <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3 sm:mb-4">Getting Started</h1>
      <p className="text-slate-600 mb-6 sm:mb-8 text-sm sm:text-base leading-relaxed">
        Bienvenido a la documentación oficial de <strong className="text-slate-800">jl-optimize-images</strong>. Esta es una librería TypeScript sin dependencias para comprimir imágenes directamente en el navegador de manera eficiente y sencilla, basada en la nueva arquitectura <code>ImageCompressor</code>.
      </p>

      <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-6 shadow-xs mb-6 sm:mb-8">
        <h2 className="text-base sm:text-lg font-semibold text-slate-900 mb-3 sm:mb-4">Instalación</h2>
        <div className="bg-slate-900 rounded-lg p-3 sm:p-4 font-mono text-xs sm:text-sm text-slate-300 overflow-x-auto">
          npm install jl-optimize-images
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-6 shadow-xs mb-6 sm:mb-8">
        <h2 className="text-base sm:text-lg font-semibold text-slate-900 mb-3 sm:mb-4">Uso Rápido</h2>
        <p className="text-slate-600 mb-4 text-xs sm:text-sm leading-relaxed">
          El proceso se basa en una clase estado <code>ImageCompressor</code>. Solo tienes que inicializarla con tu imagen original y luego llamar a <code>compress()</code> con (o sin) parámetros.
        </p>
        <pre className="bg-slate-900 rounded-lg p-3 sm:p-4 font-mono text-xs sm:text-sm text-slate-300 overflow-x-auto leading-relaxed">
{`import { ImageCompressor } from 'jl-optimize-images';

// 1. Instanciar la clase con un archivo (e.g. desde un input)
const file = event.target.files[0];
const compressor = new ImageCompressor(file);

// 2. Comprimir (usa valores por defecto: calidad 85%, formato webp)
const result = await compressor.compress();

console.log('Imagen comprimida lista:', result.dataUrl);`}
        </pre>
      </div>
    </div>
  );
}
