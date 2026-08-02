import React from 'react';
import { Upload, X } from 'lucide-react';
import { ImageItem, MimeTypeOption } from '../types';

interface SidebarProps {
  images: ImageItem[];
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
  onSelectSingle: () => void;
  onSelectMultiple: () => void;
  isDragging: boolean;
  setIsDragging: (val: boolean) => void;
  handleDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  removeImage: (id: string, e: React.MouseEvent) => void;
  quality: number;
  setQuality: (val: number) => void;
  mimeType: MimeTypeOption;
  setMimeType: (val: MimeTypeOption) => void;
  setImages: (images: ImageItem[]) => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  images,
  selectedId,
  setSelectedId,
  onSelectSingle,
  onSelectMultiple,
  isDragging,
  setIsDragging,
  handleDrop,
  removeImage,
  quality,
  setQuality,
  mimeType,
  setMimeType,
  setImages,
  isMobileOpen = false,
  onCloseMobile,
}) => {
  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 md:hidden transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`
          border-r border-zinc-800/60 p-6 flex flex-col gap-6 bg-zinc-950/95 md:bg-zinc-950/40 overflow-y-auto shrink-0 z-50
          /* Mobile Drawer Positioning */
          max-md:fixed max-md:top-0 max-md:bottom-0 max-md:left-0 max-md:w-80 max-md:max-w-[85vw] max-md:shadow-2xl transition-transform duration-300 ease-in-out
          ${isMobileOpen ? 'max-md:translate-x-0' : 'max-md:-translate-x-full md:translate-x-0'}
          /* Desktop Static Layout */
          md:relative md:w-80
        `}
      >
        {/* Mobile Header with Close Button */}
        <div className="flex items-center justify-between md:hidden pb-2 border-b border-zinc-800">
          <span className="text-sm font-bold text-white tracking-tight">Ajustes de Compresión</span>
          <button
            onClick={onCloseMobile}
            className="p-1.5 text-zinc-400 hover:text-white bg-zinc-900 rounded-lg border border-zinc-800"
            aria-label="Cerrar panel"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div>
          <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-3">Subir Archivos</h3>
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={`border border-dashed rounded-2xl p-4 text-center transition flex flex-col items-center justify-center gap-3 ${
              isDragging
                ? 'border-blue-500 bg-blue-500/10'
                : 'border-zinc-800 bg-zinc-900/30'
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <Upload className="w-5 h-5" />
            </div>
            <p className="text-[11px] text-zinc-400 hidden sm:block">Arrastra imágenes aquí o pulsa abajo</p>
            <div className="flex gap-2 w-full mt-1">
              <button 
                onClick={(e) => { e.stopPropagation(); onSelectSingle(); onCloseMobile?.(); }}
                className="flex-1 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold rounded-xl shadow transition active:scale-95 min-h-[44px]"
              >
                + 1 Imagen
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); onSelectMultiple(); onCloseMobile?.(); }}
                className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl shadow transition active:scale-95 min-h-[44px]"
              >
                + Múltiples
              </button>
            </div>
          </div>
        </div>

        {/* Parameters */}
        <div className="flex flex-col gap-5">
          <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500">Parámetros</h3>

          {/* Quality */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-zinc-300">Calidad Target</span>
              <span className="font-mono font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                {Math.round(quality * 100)}%
              </span>
            </div>
            <input
              type="range"
              min="0.1"
              max="1.0"
              step="0.05"
              value={quality}
              onChange={(e) => setQuality(parseFloat(e.target.value))}
              className="w-full accent-blue-600 bg-zinc-800 rounded-lg cursor-pointer h-2"
            />
          </div>

          {/* Format Selector */}
          <div className="space-y-2">
            <label className="text-xs text-zinc-300 font-medium">Formato de Salida</label>
            <div className="grid grid-cols-3 gap-2">
              {(['image/jpeg', 'image/webp', 'image/png'] as const).map((fmt) => {
                const label = fmt === 'image/jpeg' ? 'JPEG' : fmt === 'image/webp' ? 'WebP' : 'PNG';
                return (
                  <button
                    key={fmt}
                    onClick={() => setMimeType(fmt)}
                    className={`py-2.5 text-xs font-semibold rounded-xl border transition min-h-[40px] ${
                      mimeType === fmt
                        ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-600/20'
                        : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

      </aside>
    </>
  );
};
