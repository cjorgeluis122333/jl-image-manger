import React from 'react';
import { InteractiveExample } from '../components/InteractiveExample';
import { ImageCompressor } from 'jl-optimize-images';

export function AdvancedExample() {
  const code = `import { ImageCompressor } from 'jl-optimize-images';

async function generateExactThumbnail(file: File) {
  const compressor = new ImageCompressor(file);
  
  // Generamos un thumbnail de dimensiones EXACTAS (e.g. 200x200)
  // ignorando la relación de aspecto original (forzando estiramiento si es necesario)
  // y aplicamos una calidad del 60%
  const result = await compressor.compress({
    maxWidth: 200,
    maxHeight: 200,
    maintainAspectRatio: false,
    quality: 0.6
  });

  return result;
}`;

  const handleCompress = async (file: File) => {
    const compressor = new ImageCompressor(file);
    const result = await compressor.compress({
      maxWidth: 200,
      maxHeight: 200,
      maintainAspectRatio: false,
      quality: 0.6
    });
    
    return {
      dataUrl: result.dataUrl,
      compressedSize: result.compressedSize,
      savingsPercentage: result.savingsPercentage
    };
  };

  return (
    <InteractiveExample
      title="Ejemplo Avanzado: Generación de Miniaturas Exactas"
      description="En algunas interfaces necesitas que todas las imágenes encajen en un recuadro perfecto (como 200x200), incluso si eso significa deformar ligeramente la imagen original. Aquí desactivamos 'maintainAspectRatio'."
      code={code}
      onCompress={handleCompress}
    />
  );
}
