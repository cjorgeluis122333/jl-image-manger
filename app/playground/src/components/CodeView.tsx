import React from 'react';
import { FileText } from 'lucide-react';

export const CodeView: React.FC = () => {
  return (
    <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-8 overflow-y-auto">
      <div className="bg-zinc-950/80 border border-zinc-800/80 rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-2xl backdrop-blur">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <FileText className="w-6 h-6 text-blue-400 shrink-0" />
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">Librería Core Sin Dependencias de Framework</h2>
              <p className="text-xs sm:text-sm text-zinc-400">
                Ubicada en <code className="text-blue-400 font-mono">packages/image-compressor/src/index.ts</code>. Pura lógica TypeScript reutilizable.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 overflow-x-auto text-xs font-mono text-zinc-300 leading-relaxed shadow-inner">
          <pre>{`import { ImageCompressor, formatBytes } from 'jl-optimize-images';

// 1. Inicializa el compresor pasándole la imagen original (File, Blob, o URL)
// Puedes guardarla o pasarla directamente (e.g. desde un input type="file")
const compressor = new ImageCompressor(file);

// Ejemplo de uso simple, p.ej. en un useEffect o función manejadora:
const procesar = async () => {
  // 2. Comprime llamando al método. Tiene valores por defecto (quality: 0.85, webp)
  // Puedes pasar un parámetro para reescribir solo lo que necesites
  const result = await compressor.compress({
    quality: 0.70 // Modificar la calidad sobre la marcha
  });

  // 3. Usa el resultado para la previsualización y analíticas
  console.log('Original:', formatBytes(result.originalSize));
  console.log('Comprimida:', formatBytes(result.compressedSize));
  console.log('Ahorro:', result.savingsPercentage + '%');
  
  // Puedes asignar result.dataUrl a una etiqueta <img> para previsualizar instantáneamente
  // ej: document.getElementById('preview').src = result.dataUrl;
};`}</pre>
        </div>
      </div>
    </main>
  );
};
