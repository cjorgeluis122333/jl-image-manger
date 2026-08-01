import React, { useState, useRef, useEffect, useCallback } from 'react';
import { MoveHorizontal, Sparkles, RefreshCw } from 'lucide-react';
import { formatBytes } from 'jl-optimize-images';

export interface CompressionResult {
  dataUrl: string;
  originalUrl: string;
  originalSize: number;
  compressedSize: number;
  savingsPercentage: number;
  isCompressing: boolean;
}

interface InteractiveExampleProps {
  title: string;
  description: string;
  code: string;
  onCompress: (file: File) => Promise<Omit<CompressionResult, 'originalUrl' | 'originalSize' | 'isCompressing'>>;
}

export function InteractiveExample({ title, description, code, onCompress }: InteractiveExampleProps) {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<CompressionResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDraggingSlider, setIsDraggingSlider] = useState(false);

  const handleSliderMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percentage = (x / rect.width) * 100;
    setSliderPosition(percentage);
  }, []);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!isDraggingSlider) return;
      handleSliderMove(e.clientX);
    };
    const onMouseUp = () => {
      setIsDraggingSlider(false);
    };
    const onTouchMove = (e: TouchEvent) => {
      if (!isDraggingSlider || !e.touches[0]) return;
      handleSliderMove(e.touches[0].clientX);
    };
    const onTouchEnd = () => {
      setIsDraggingSlider(false);
    };

    if (isDraggingSlider) {
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
      window.addEventListener('touchmove', onTouchMove);
      window.addEventListener('touchend', onTouchEnd);
    }
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, [isDraggingSlider, handleSliderMove]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
    setFile(selectedFile);
    
    const originalUrl = URL.createObjectURL(selectedFile);
    setResult({
      originalUrl,
      originalSize: selectedFile.size,
      dataUrl: '',
      compressedSize: 0,
      savingsPercentage: 0,
      isCompressing: true
    });

    try {
      const res = await onCompress(selectedFile);
      setResult({
        ...res,
        originalUrl,
        originalSize: selectedFile.size,
        isCompressing: false
      });
    } catch (error) {
      console.error(error);
      setResult(null);
    }
  };

  const loadTestImage = async () => {
    try {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      // A beautiful autumn forest landscape photo with sharp fine details to show off compression
      img.src = 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=800&h=600&q=80';
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });

      const canvas = document.createElement('canvas');
      canvas.width = 800;
      canvas.height = 600;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0, 800, 600);
        
        // Add a clean banner text
        ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
        ctx.fillRect(20, 20, 220, 45);
        ctx.fillStyle = 'white';
        ctx.font = 'bold 18px sans-serif';
        ctx.fillText('Imagen de Prueba', 35, 48);
      }

      const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, 'image/jpeg', 1.0));
      if (!blob) throw new Error("Could not generate blob");

      const testFile = new File([blob], 'ejemplo.jpg', { type: 'image/jpeg' });
      
      setFile(testFile);
      const originalUrl = URL.createObjectURL(testFile);
      setResult({
        originalUrl,
        originalSize: testFile.size,
        dataUrl: '',
        compressedSize: 0,
        savingsPercentage: 0,
        isCompressing: true
      });
      
      const compressed = await onCompress(testFile);
      setResult({
        ...compressed,
        originalUrl,
        originalSize: testFile.size,
        isCompressing: false
      });
    } catch (e) {
      console.error("Error loading sample image", e);
    }
  };

  useEffect(() => {
    loadTestImage();
  }, []);

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 mb-12">
      <h1 className="text-3xl font-bold text-slate-900 mb-4">{title}</h1>
      <p className="text-slate-600 mb-8 leading-relaxed">{description}</p>

      {/* Interactive UI */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm mb-8">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Pruébalo ahora</h2>
        
        {!file ? (
          <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-slate-300 rounded-2xl bg-slate-50 p-12 text-center">
            <Sparkles className="w-12 h-12 text-indigo-500 mb-4 animate-pulse" />
            <h3 className="text-lg font-medium text-slate-800 mb-2">Sube una imagen para probar</h3>
            <p className="text-sm text-slate-500 max-w-sm mb-6">
              Selecciona una imagen para ver el código en acción.
            </p>
            <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
            <div className="flex gap-4">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl shadow transition"
              >
                Subir Imagen
              </button>
              <button
                onClick={loadTestImage}
                className="px-6 py-2.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-sm font-semibold rounded-xl shadow-sm transition"
              >
                Usar foto de ejemplo
              </button>
            </div>
          </div>
        ) : result ? (
          <div className="flex flex-col gap-4">
             <div className="flex justify-between items-center">
               <button onClick={() => {setFile(null); setResult(null);}} className="text-sm text-indigo-600 font-medium hover:underline">
                 Probar otra imagen
               </button>
             </div>
             <div
              ref={containerRef}
              onMouseDown={(e) => {
                setIsDraggingSlider(true);
                handleSliderMove(e.clientX);
              }}
              onTouchStart={(e) => {
                if (e.touches[0]) {
                  setIsDraggingSlider(true);
                  handleSliderMove(e.touches[0].clientX);
                }
              }}
              className="relative h-[400px] border border-slate-200 rounded-2xl overflow-hidden bg-slate-900 shadow-inner select-none cursor-ew-resize flex items-center justify-center"
            >
              {result.isCompressing ? (
                <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm flex flex-col items-center justify-center gap-3 z-10">
                  <RefreshCw className="w-8 h-8 text-indigo-400 animate-spin" />
                  <span className="text-sm text-slate-300 font-medium">Comprimiendo...</span>
                </div>
              ) : result.dataUrl ? (
                <img
                  src={result.dataUrl}
                  alt="Comprimida"
                  className="absolute inset-0 w-full h-full object-contain pointer-events-none"
                />
              ) : null}
              
              {!result.isCompressing && (
                <div className="absolute top-4 right-4 z-20 px-3 py-1.5 bg-slate-900/80 backdrop-blur-md rounded-xl text-xs font-mono text-emerald-400 border border-slate-700 shadow-lg flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  <span>Comprimido: {formatSize(result.compressedSize)}</span>
                </div>
              )}

              <div
                className="absolute inset-0 overflow-hidden pointer-events-none"
                style={{ width: `${sliderPosition}%` }}
              >
                <div
                  className="absolute inset-0 w-full h-full bg-slate-900 flex items-center justify-center"
                  style={{ width: containerRef.current ? `${containerRef.current.clientWidth}px` : '100vw', height: '100%' }}
                >
                  <img
                    src={result.originalUrl}
                    alt="Original"
                    className="absolute inset-0 w-full h-full object-contain pointer-events-none"
                    style={{ width: containerRef.current ? `${containerRef.current.clientWidth}px` : '100vw', height: '100%', maxWidth: 'none' }}
                  />
                </div>
                <div className="absolute top-4 left-4 z-20 px-3 py-1.5 bg-slate-900/80 backdrop-blur-md rounded-xl text-xs font-mono text-slate-300 border border-slate-700 shadow-lg flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-slate-400"></span>
                  <span>Original: {formatSize(result.originalSize)}</span>
                </div>
              </div>

              <div
                className="absolute top-0 bottom-0 w-1 bg-indigo-500 shadow-[0_0_12px_rgba(99,102,241,0.8)] z-30 pointer-events-none flex items-center justify-center"
                style={{ left: `${sliderPosition}%` }}
              >
                <div className="w-8 h-8 rounded-full bg-indigo-600 border-2 border-white text-white flex items-center justify-center shadow-xl">
                  <MoveHorizontal className="w-4 h-4" />
                </div>
              </div>
            </div>

            {!result.isCompressing && (
               <div className="grid grid-cols-3 gap-4">
                 <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3">
                   <span className="text-[10px] font-bold text-slate-500 uppercase">Ahorro</span>
                   <p className="text-lg font-medium text-emerald-600">{result.savingsPercentage.toFixed(1)}%</p>
                 </div>
                 <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3">
                   <span className="text-[10px] font-bold text-slate-500 uppercase">Original</span>
                   <p className="text-lg font-medium text-slate-700">{formatSize(result.originalSize)}</p>
                 </div>
                 <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3">
                   <span className="text-[10px] font-bold text-slate-500 uppercase">Final</span>
                   <p className="text-lg font-medium text-slate-700">{formatSize(result.compressedSize)}</p>
                 </div>
               </div>
            )}
          </div>
        ) : null}
      </div>

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
