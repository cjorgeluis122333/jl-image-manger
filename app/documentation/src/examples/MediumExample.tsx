import React from 'react';
import { InteractiveExample } from '../components/InteractiveExample';
import { ImageCompressor } from 'jl-optimize-images';

export function MediumExample() {
  const code = `import { ImageCompressor } from 'jl-optimize-images';

async function compressHighPerformance(file: File) {
  const compressor = new ImageCompressor(file);
  
  // Forzamos el formato a WebP y reducimos la calidad al 50%
  // para obtener archivos ultraligeros ideales para web
  const result = await compressor.compress({
    quality: 0.5,
    mimeType: 'image/webp'
  });

  return result;
}`;

  const handleCompress = async (file: File) => {
    const compressor = new ImageCompressor(file);
    const result = await compressor.compress({
      quality: 0.5,
      mimeType: 'image/webp'
    });
    
    return {
      dataUrl: result.dataUrl,
      compressedSize: result.compressedSize,
      savingsPercentage: result.savingsPercentage
    };
  };

  return (
    <InteractiveExample
      title="Ejemplo Medio: Alto Rendimiento para Web"
      description="Si estás creando un blog o un e-commerce donde la velocidad de carga es crucial, puedes forzar la conversión de todas las imágenes a WebP y aplicar una compresión más agresiva (e.g., 50% de calidad)."
      code={code}
      onCompress={handleCompress}
    />
  );
}
