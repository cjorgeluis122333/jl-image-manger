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

export const PreviewArea: React.FC<PreviewAreaProps> = ({
  images,
  selectedId,
  setSelectedId,
  onSelectSingle,
  onSelectMultiple,
  mimeType,
  removeImage,
  handleDownloadZip,
  isZipping = false,
  clearImages,
}) => {
  const selectedImage = images.find((img) => img.id === selectedId) || images[0];
  const hasFinishedImages = images.some((img) => img.result && !img.isCompressing);

  return (
    <section className="flex-1 p-3 sm:p-6 md:p-8 flex flex-col gap-4 bg-[#09090b] overflow-y-auto md:overflow-hidden min-w-0">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
        <div>
          <h2 className="text-xl sm:text-2xl font-light tracking-tight text-white">Live Compression Split View</h2>
          {images.length > 1 && selectedImage && (
            <div className="text-xs text-zinc-400 flex flex-wrap items-center gap-2 mt-1.5">
              <span className="font-medium text-zinc-300 truncate max-w-[180px] sm:max-w-xs">{selectedImage.file.name}</span>
              {selectedImage.result && (
                <>
                  <span className="w-1 h-1 rounded-full bg-zinc-700 hidden sm:inline-block"></span>
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
              <span className="w-1 h-1 rounded-full bg-zinc-700 hidden sm:inline-block"></span>
              <button
                onClick={(e) => removeImage(selectedImage.id, e)}
                className="text-rose-400 hover:text-rose-300 flex items-center gap-1 transition"
              >
                <Trash2 className="w-3 h-3" /> Eliminar
              </button>
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          {images.length > 1 ? (
            <>
              <button
                onClick={clearImages}
                className="px-3 sm:px-4 py-2 bg-zinc-900 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 border border-zinc-800 hover:border-rose-500/30 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Eliminar</span> Todas
              </button>
              {handleDownloadZip && (
                <button
                  onClick={handleDownloadZip}
                  disabled={!hasFinishedImages || isZipping}
                  className="px-4 sm:px-5 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl text-xs font-bold transition shadow-lg shadow-blue-600/20 flex items-center gap-2"
                >
                  {isZipping ? (
                    <span className="animate-pulse">Empaquetando...</span>
                  ) : (
                    <>
                      <Download className="w-4 h-4" /> <span className="hidden sm:inline">Descargar</span> ZIP
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
                  className="px-3.5 py-2 bg-zinc-900 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 border border-zinc-800 hover:border-rose-500/30 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Eliminar
                </button>
                <button
                  onClick={() => {
                    const a = document.createElement('a');
                    a.href = selectedImage.result!.dataUrl;
                    a.download = selectedImage.result!.file.name;
                    a.click();
                  }}
                  className="px-4 sm:px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition shadow-lg shadow-blue-600/20 flex items-center gap-2"
                >
                  <Download className="w-4 h-4" /> Descargar
                </button>
              </>
            )
          )}
        </div>
      </div>

      {!selectedImage ? (
        <div className="flex-1 flex flex-col items-center justify-center border border-zinc-800/80 rounded-3xl bg-zinc-950/40 p-6 sm:p-12 text-center min-h-[300px]">
          <Sparkles className="w-10 h-10 sm:w-12 sm:h-12 text-blue-500 mb-4 animate-pulse" />
          <h3 className="text-base sm:text-lg font-medium text-white mb-2">Ninguna imagen seleccionada</h3>
          <p className="text-xs text-zinc-400 max-w-sm mb-6 leading-relaxed">
            Sube o arrastra una o varias imágenes para ver la comparación interactiva a pantalla completa con control deslizante.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-xs sm:max-w-none">
            <button
              onClick={onSelectSingle}
              className="w-full sm:w-auto px-6 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold rounded-xl shadow transition active:scale-95 min-h-[44px]"
            >
              Insertar una imagen
            </button>
            <button
              onClick={onSelectMultiple}
              className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl shadow transition active:scale-95 min-h-[44px]"
            >
              Insertar múltiples imágenes
            </button>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col gap-4 min-h-0">
          <ImageComparison
            leftImage={selectedImage.originalUrl}
            rightImage={selectedImage.result?.dataUrl}
            objectFit="cover"
            className="flex-1 min-h-[250px] sm:min-h-[350px] border border-zinc-800/80 rounded-2xl sm:rounded-3xl bg-black shadow-2xl overflow-hidden"
          >
            {selectedImage.isCompressing && (
              <div className="absolute inset-0 bg-zinc-950/30 backdrop-blur-md flex flex-col items-center justify-center gap-3 z-10 pointer-events-none transition-opacity duration-200">
                <div className="p-4 bg-zinc-900/90 border border-zinc-800/80 rounded-2xl flex flex-col items-center gap-2 shadow-2xl">
                  <RefreshCw className="w-6 h-6 text-blue-400 animate-spin" />
                  <span className="text-[11px] text-zinc-200 font-medium px-1">Comprimiendo...</span>
                </div>
              </div>
            )}
            
            {!selectedImage.isCompressing && (
              <div className="absolute top-2.5 right-2.5 sm:top-4 sm:right-4 z-20 px-2.5 py-1 sm:px-3 sm:py-1.5 bg-emerald-950/80 backdrop-blur-md rounded-xl text-[10px] sm:text-xs font-mono text-emerald-300 border border-emerald-500/30 shadow-lg flex items-center gap-1.5 pointer-events-none transition-opacity duration-200 group-data-[dragging=true]:opacity-0">
                <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-400"></span>
                <span>Comprimida: {selectedImage.result?.compressedSize ? formatBytes(selectedImage.result.compressedSize) : '...'}</span>
              </div>
            )}
            
            <div className="absolute top-2.5 left-2.5 sm:top-4 sm:left-4 z-20 px-2.5 py-1 sm:px-3 sm:py-1.5 bg-black/80 backdrop-blur-md rounded-xl text-[10px] sm:text-xs font-mono text-zinc-300 border border-white/10 shadow-lg flex items-center gap-1.5 pointer-events-none transition-opacity duration-200 group-data-[dragging=true]:opacity-0">
              <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-zinc-400"></span>
              <span>Original: {formatBytes(selectedImage.originalSize)}</span>
            </div>
          </ImageComparison>

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
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4 shrink-0">
            <div className="bg-zinc-900/50 border border-zinc-800/80 rounded-xl sm:rounded-2xl p-3 sm:px-4 sm:py-3 flex flex-col justify-between">
              <span className="text-[9px] sm:text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Ahorro</span>
              <span className="text-base sm:text-xl font-medium text-emerald-400">
                {selectedImage.result ? `${selectedImage.result.savingsPercentage}%` : '0%'}
              </span>
            </div>
            <div className="bg-zinc-900/50 border border-zinc-800/80 rounded-xl sm:rounded-2xl p-3 sm:px-4 sm:py-3 flex flex-col justify-between">
              <span className="text-[9px] sm:text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Ratio</span>
              <span className="text-base sm:text-xl font-medium text-white font-mono">
                {selectedImage.result && selectedImage.result.compressedSize > 0
                  ? (selectedImage.originalSize / selectedImage.result.compressedSize).toFixed(1) + 'x'
                  : '1.0x'}
              </span>
            </div>
            <div className="bg-zinc-900/50 border border-zinc-800/80 rounded-xl sm:rounded-2xl p-3 sm:px-4 sm:py-3 flex flex-col justify-between">
              <span className="text-[9px] sm:text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Resolución</span>
              <span className="text-xs sm:text-sm font-medium text-white font-mono mt-0.5 sm:mt-1 truncate">
                {selectedImage.result ? `${selectedImage.result.width}×${selectedImage.result.height}px` : '...'}
              </span>
            </div>
            <div className="bg-zinc-900/50 border border-zinc-800/80 rounded-xl sm:rounded-2xl p-3 sm:px-4 sm:py-3 flex flex-col justify-between">
              <span className="text-[9px] sm:text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Formato</span>
              <span className="text-xs sm:text-sm font-medium text-blue-400 font-mono mt-0.5 sm:mt-1 uppercase">
                {mimeType.split('/')[1]}
              </span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
