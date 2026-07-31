import React from 'react';
import { Upload, Trash2, Download } from 'lucide-react';
import { formatBytes } from 'jl-optimize-images';
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
  useMaxWidth: boolean;
  setUseMaxWidth: (val: boolean) => void;
  maxWidth: number;
  setMaxWidth: (val: number) => void;
  maxHeight: number;
  setMaxHeight: (val: number) => void;
  setImages: (images: ImageItem[]) => void;
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
  useMaxWidth,
  setUseMaxWidth,
  maxWidth,
  setMaxWidth,
  maxHeight,
  setMaxHeight,
  setImages,
}) => {
  const selectedImage = images.find((img) => img.id === selectedId) || images[0];

  return (
    <aside className="w-80 border-r border-zinc-800/60 p-6 flex flex-col gap-6 bg-zinc-950/20 overflow-y-auto shrink-0">
      <div>
        <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-3">Input Library</h3>
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
          <div className="flex gap-2 w-full mt-2">
            <button 
              onClick={(e) => { e.stopPropagation(); onSelectSingle(); }}
              className="flex-1 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-white text-[10px] font-semibold rounded-lg shadow transition"
            >
              + 1 Imagen
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); onSelectMultiple(); }}
              className="flex-1 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-semibold rounded-lg shadow transition"
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
            <span className="font-mono text-blue-400">{Math.round(quality * 100)}%</span>
          </div>
          <input
            type="range"
            min="0.1"
            max="1.0"
            step="0.05"
            value={quality}
            onChange={(e) => setQuality(parseFloat(e.target.value))}
            className="w-full accent-blue-600 bg-zinc-800 rounded-lg cursor-pointer h-1.5"
          />
        </div>

        {/* Format Selector */}
        <div className="space-y-2">
          <label className="text-xs text-zinc-300">Formato de Salida</label>
          <div className="grid grid-cols-3 gap-2">
            {(['image/jpeg', 'image/webp', 'image/png'] as const).map((fmt) => {
              const label = fmt === 'image/jpeg' ? 'JPEG' : fmt === 'image/webp' ? 'WebP' : 'PNG';
              return (
                <button
                  key={fmt}
                  onClick={() => setMimeType(fmt)}
                  className={`py-2 text-xs font-medium rounded-lg border transition ${
                    mimeType === fmt
                      ? 'bg-blue-600 border-blue-500 text-white shadow'
                      : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Resolution Max */}
        <div className="space-y-3 pt-2 border-t border-zinc-800/60">
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-300">Redimensionar Max</span>
            <input
              type="checkbox"
              checked={useMaxWidth}
              onChange={(e) => setUseMaxWidth(e.target.checked)}
              className="accent-blue-600 rounded"
            />
          </div>
          {useMaxWidth && (
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-[10px] text-zinc-500">Ancho Máx</span>
                <input
                  type="number"
                  value={maxWidth}
                  onChange={(e) => setMaxWidth(parseInt(e.target.value) || 1200)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-2 py-1 text-xs text-white"
                />
              </div>
              <div>
                <span className="text-[10px] text-zinc-500">Alto Máx</span>
                <input
                  type="number"
                  value={maxHeight}
                  onChange={(e) => setMaxHeight(parseInt(e.target.value) || 1200)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-2 py-1 text-xs text-white"
                />
              </div>
            </div>
          )}
        </div>
      </div>

    </aside>
  );
};
