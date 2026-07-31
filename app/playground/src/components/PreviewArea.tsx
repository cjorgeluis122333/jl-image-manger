import React from 'react';
import { Download, Sparkles, RefreshCw, Trash2 } from 'lucide-react';
import { formatBytes } from 'jl-optimize-images';
import { ImageComparison, ImageGallery } from 'jl-optimize-images-react';
import { ImageItem, MimeTypeOption } from '../types';

interface PreviewAreaProps {
  images: ImageItem[];
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
  onSelectSingle: () => void;
  onSelectMultiple: () => void;
  mimeType: MimeTypeOption;
  removeImage: (id: string, e: React.MouseEvent) => void;
  handleDownloadZip?: () => void;
  isZipping?: boolean;
  clearImages: () => void;
}

export const PreviewArea: React.FC<PreviewAreaProps> = ({ images, selectedId, setSelectedId, onSelectSingle, onSelectMultiple, mimeType, removeImage, handleDownloadZip, isZipping = false, clearImages }) => {
  const selectedImage = images.find((img) => img.id === selectedId) || images[0];
  const hasFinishedImages = images.some(img => img.result && !img.isCompressing);

  return (
    <section className="flex-1 p-8 flex flex-col gap-4 bg-[#09090b] overflow-hidden">
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h2 className="text-2xl font-light tracking-tight">Live Compression Split View</h2>
          {images.length > 1 && selectedImage && (
            <div className="text-xs text-zinc-400 flex items-center gap-2 mt-2">
              <span className="font-medium text-zinc-300">{selectedImage.file.name}</span>
              {selectedImage.result && (
                <>
                  <span className="w-1 h-1 rounded-full bg-zinc-700"></span>
                  <button
                    onClick={() => {
                      const a = document.createElement('a');
                      a.href = selectedImage.result!.dataUrl;
                      a.download = selectedImage.result!.file.name;
                      a.click();
                    }}
                    className="text-blue-400 hover:text-blue-300 flex items-center gap-1 transition"
                  >
                    <Download className="w-3 h-3" /> Descargar
                  </button>
                </>
              )}
              <span className="w-1 h-1 rounded-full bg-zinc-700"></span>
              <button
                onClick={(e) => removeImage(selectedImage.id, e)}
                className="text-rose-400 hover:text-rose-300 flex items-center gap-1 transition"
              >
                <Trash2 className="w-3 h-3" /> Eliminar
              </button>
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-3">
          {images.length > 1 ? (
            <>
              <button
                onClick={clearImages}
                className="px-4 py-2 bg-zinc-900 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 border border-zinc-800 hover:border-rose-500/30 rounded-xl text-xs font-bold transition flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" /> Eliminar Todas
              </button>
              {handleDownloadZip && (
                <button
                  onClick={handleDownloadZip}
                  disabled={!hasFinishedImages || isZipping}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl text-xs font-bold transition shadow-lg shadow-blue-600/20 flex items-center gap-2"
                >
                  {isZipping ? (
                    <span className="animate-pulse">Empaquetando...</span>
                  ) : (
                    <>
                      <Download className="w-4 h-4" /> Descargar Todas (ZIP)
                    </>
                  )}
                </button>
              )}
            </>
          ) : (
            selectedImage && selectedImage.result && (
              <>
                <button
                  onClick={(e) => removeImage(selectedImage.id, e)}
                  className="px-4 py-2 bg-zinc-900 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 border border-zinc-800 hover:border-rose-500/30 rounded-xl text-xs font-bold transition flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" /> Eliminar
                </button>
                <button
                  onClick={() => {
                    const a = document.createElement('a');
                    a.href = selectedImage.result!.dataUrl;
                    a.download = selectedImage.result!.file.name;
                    a.click();
                  }}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition shadow-lg shadow-blue-600/20 flex items-center gap-2"
                >
                  <Download className="w-4 h-4" /> Descargar Resultado
                </button>
              </>
            )
          )}
        </div>
      </div>

      {!selectedImage ? (
        <div className="flex-1 flex flex-col items-center justify-center border border-zinc-800/80 rounded-3xl bg-zinc-950/40 p-12 text-center">
          <Sparkles className="w-12 h-12 text-blue-500 mb-4 animate-pulse" />
          <h3 className="text-lg font-medium text-white mb-2">Ninguna imagen seleccionada</h3>
          <p className="text-xs text-zinc-400 max-w-sm mb-6">
            Sube o arrastra una o varias imágenes para ver la comparación interactiva a pantalla completa con control deslizante.
          </p>
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={onSelectSingle}
              className="px-6 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold rounded-xl shadow transition"
            >
              Insertar una imagen
            </button>
            <button
              onClick={onSelectMultiple}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl shadow transition"
            >
              Insertar múltiples imágenes
            </button>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col gap-4 min-h-0">
          <ImageComparison
            originalUrl={selectedImage.originalUrl}
            originalSize={selectedImage.originalSize}
            compressedUrl={selectedImage.result?.dataUrl}
            compressedSize={selectedImage.result?.compressedSize}
            isCompressing={selectedImage.isCompressing}
            className="flex-1 border border-zinc-800/80 rounded-3xl bg-black shadow-2xl"
          />

          <ImageGallery
            images={images.map(img => ({
              id: img.id,
              originalUrl: img.originalUrl,
              name: img.file.name,
              isCompressing: img.isCompressing,
              hasResult: !!img.result,
            }))}
            selectedId={selectedImage.id}
            onSelect={setSelectedId}
            onRemove={removeImage}
          />

          {/* Bottom Quick Metrics Bar */}
          <div className="h-20 grid grid-cols-4 gap-4 shrink-0">
            <div className="bg-zinc-900/50 border border-zinc-800/80 rounded-2xl px-4 py-3 flex flex-col justify-between">
              <span className="text-[10px] font-bold text-zinc-500 uppercase">Espacio Ahorrado</span>
              <span className="text-xl font-medium text-emerald-400">
                {selectedImage.result ? `${selectedImage.result.savingsPercentage}%` : '0%'}
              </span>
            </div>
            <div className="bg-zinc-900/50 border border-zinc-800/80 rounded-2xl px-4 py-3 flex flex-col justify-between">
              <span className="text-[10px] font-bold text-zinc-500 uppercase">Ratio</span>
              <span className="text-xl font-medium text-white font-mono">
                {selectedImage.result && selectedImage.result.compressedSize > 0
                  ? (selectedImage.originalSize / selectedImage.result.compressedSize).toFixed(1) + 'x'
                  : '1.0x'}
              </span>
            </div>
            <div className="bg-zinc-900/50 border border-zinc-800/80 rounded-2xl px-4 py-3 flex flex-col justify-between">
              <span className="text-[10px] font-bold text-zinc-500 uppercase">Resolución Salida</span>
              <span className="text-sm font-medium text-white font-mono mt-1">
                {selectedImage.result ? `${selectedImage.result.width} × ${selectedImage.result.height}px` : '...'}
              </span>
            </div>
            <div className="bg-zinc-900/50 border border-zinc-800/80 rounded-2xl px-4 py-3 flex flex-col justify-between">
              <span className="text-[10px] font-bold text-zinc-500 uppercase">Formato</span>
              <span className="text-sm font-medium text-blue-400 font-mono mt-1 uppercase">
                {mimeType.split('/')[1]}
              </span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
