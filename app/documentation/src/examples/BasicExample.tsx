import React from 'react';
import { InteractiveExample } from '../components/InteractiveExample';
import { ImageCompressor } from 'jl-optimize-images';

export function BasicExample() {
  const code = `import { ImageCompressor } from 'jl-optimize-images';

async function compressAvatar(file: File) {
  const compressor = new ImageCompressor(file);
  
  // Reducimos el tamaño a máximo 400x400 para avatares
  const result = await compressor.compress({
    maxWidth: 400,
    maxHeight: 400
  });

  return result;
}`;

  const handleCompress = async (file: File) => {
    const compressor = new ImageCompressor(file);
    const result = await compressor.compress({
      maxWidth: 400,
      maxHeight: 400
    });
    
    return {
      dataUrl: result.dataUrl,
      compressedSize: result.compressedSize,
      savingsPercentage: result.savingsPercentage
    };
  };

  return (
    <InteractiveExample
      title="Ejemplo Básico: Subida de perfil (Avatar)"
      description="Este ejemplo muestra cómo recibir una imagen, redimensionarla al tamaño típico de un avatar (e.g., 400x400) manteniendo la relación de aspecto original, y comprimirla para ahorrar ancho de banda."
      code={code}
      onCompress={handleCompress}
    />
  );
}
