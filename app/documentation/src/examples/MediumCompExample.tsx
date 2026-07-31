import React, { useState, useEffect } from 'react';
import { ImageGallery, ImageGalleryItem } from 'jl-optimize-images-react';
import { Sparkles, Trash2, Plus } from 'lucide-react';

export function MediumCompExample() {
  const [items, setItems] = useState<ImageGalleryItem[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    // Generate three mock images with distinct colors
    const colors = [
      { name: 'atardecer.jpg', from: '#f59e0b', to: '#ef4444', text: 'Atardecer' },
      { name: 'bosque.jpg', from: '#10b981', to: '#047857', text: 'Bosque' },
      { name: 'oceano.jpg', from: '#3b82f6', to: '#1d4ed8', text: 'Océano' },
    ];

    const generated = colors.map((col, idx) => {
      const canvas = document.createElement('canvas');
      canvas.width = 300;
      canvas.height = 200;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const grad = ctx.createLinearGradient(0, 0, 300, 200);
        grad.addColorStop(0, col.from);
        grad.addColorStop(1, col.to);
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 300, 200);

        ctx.fillStyle = 'white';
        ctx.font = 'bold 24px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(col.text, 150, 110);
      }
      return {
        id: `img-${idx + 1}`,
        name: col.name,
        originalUrl: canvas.toDataURL('image/jpeg'),
        isCompressing: idx === 1, // Simulated active compression for the second item
        hasResult: idx === 0,    // Simulated success for the first item
      };
    });

    setItems(generated);
    setSelectedId(generated[0].id);
  }, []);

  const handleSelect = (id: string) => {
    setSelectedId(id);
  };

  const handleRemove = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setItems((prev) => prev.filter((item) => item.id !== id));
    if (selectedId === id) {
      const remaining = items.filter((item) => item.id !== id);
      setSelectedId(remaining.length > 0 ? remaining[0].id : null);
    }
  };

  const handleAddSimulated = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 300;
    canvas.height = 200;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const colors = ['#8b5cf6', '#ec4899', '#f97316', '#06b6d4'];
      const randomCol = colors[Math.floor(Math.random() * colors.length)];
      ctx.fillStyle = randomCol;
      ctx.fillRect(0, 0, 300, 200);
      ctx.fillStyle = 'white';
      ctx.font = 'bold 24px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`Simulación ${items.length + 1}`, 150, 110);
    }

    const newItem: ImageGalleryItem = {
      id: `img-${Date.now()}`,
      name: `nuevo-archivo-${items.length + 1}.jpg`,
      originalUrl: canvas.toDataURL('image/jpeg'),
      isCompressing: false,
      hasResult: true,
    };

    setItems((prev) => [...prev, newItem]);
    setSelectedId(newItem.id);
  };

  const code = `import React, { useState } from 'react';
import { ImageGallery, ImageGalleryItem } from 'jl-optimize-images-react';

export default function MiGaleriaInteractiva() {
  const [images, setImages] = useState<ImageGalleryItem[]>([
    { id: '1', originalUrl: 'atardecer.jpg', name: 'atardecer.jpg', hasResult: true },
    { id: '2', originalUrl: 'bosque.jpg', name: 'bosque.jpg', isCompressing: true },
    { id: '3', originalUrl: 'oceano.jpg', name: 'oceano.jpg' },
  ]);
  const [selectedId, setSelectedId] = useState<string | null>('1');

  const handleSelect = (id: string) => {
    setSelectedId(id);
  };

  const handleRemove = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setImages(prev => prev.filter(img => img.id !== id));
    if (selectedId === id) {
      const rest = images.filter(img => img.id !== id);
      setSelectedId(rest.length > 0 ? rest[0].id : null);
    }
  };

  return (
    <div className="p-4 border rounded-xl bg-zinc-900">
      <h3 className="text-sm font-semibold mb-3">Imágenes cargadas ({images.length})</h3>
      <ImageGallery
        images={images}
        selectedId={selectedId}
        onSelect={handleSelect}
        onRemove={handleRemove}
        className="py-2"
      />
    </div>
  );
}`;

  const activeItemData = items.find((item) => item.id === selectedId);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 mb-12">
      <h1 className="text-3xl font-bold text-slate-900 mb-2">Componente Medio: ImageGallery</h1>
      <p className="text-slate-600 mb-8 leading-relaxed">
        El componente <code>ImageGallery</code> es ideal para manejar múltiples archivos cargados de forma simultánea.
        Muestra miniaturas de las imágenes, indicadores de estado (en proceso, terminado exitosamente) y provee accesos para remover archivos.
      </p>

      {/* Interactive preview area */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-slate-900">Galería de Imágenes en Vivo</h2>
          <button
            onClick={handleAddSimulated}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-lg text-xs font-semibold transition"
          >
            <Plus className="w-3.5 h-3.5" /> Agregar Imagen Simulación
          </button>
        </div>

        {items.length > 0 ? (
          <div className="border border-slate-100 rounded-2xl bg-slate-50 p-6 flex flex-col gap-6">
            <div className="flex gap-4">
              {/* Active Image details panel */}
              <div className="flex-1 h-[220px] rounded-xl bg-slate-900 overflow-hidden relative flex items-center justify-center border border-slate-800">
                {activeItemData ? (
                  <>
                    <img
                      src={activeItemData.originalUrl}
                      alt={activeItemData.name}
                      className="w-full h-full object-contain"
                    />
                    <div className="absolute bottom-3 left-3 bg-slate-950/85 backdrop-blur border border-slate-800 px-3 py-1 rounded-lg text-xs text-slate-200 font-medium">
                      Archivo: {activeItemData.name}
                    </div>
                    {activeItemData.isCompressing && (
                      <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm flex flex-col items-center justify-center gap-2">
                        <span className="text-sm text-indigo-400 font-bold animate-pulse">Comprimiendo...</span>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-slate-500 text-sm">Selecciona una imagen</div>
                )}
              </div>

              {/* Sidebar with properties */}
              <div className="w-[200px] flex flex-col justify-between bg-white border border-slate-150 p-4 rounded-xl shadow-inner">
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Propiedades</h4>
                  {activeItemData ? (
                    <div className="space-y-2">
                      <div>
                        <span className="text-[10px] text-slate-400 block font-medium">ID del Item</span>
                        <span className="text-xs font-mono font-medium text-slate-800">{activeItemData.id}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block font-medium">Estado</span>
                        {activeItemData.isCompressing ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-yellow-600 bg-yellow-50 px-2 py-0.5 rounded">
                            Comprimiendo...
                          </span>
                        ) : activeItemData.hasResult ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                            <Sparkles className="w-3 h-3" /> Optimizado
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 bg-slate-50 px-2 py-0.5 rounded">
                            En espera
                          </span>
                        )}
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 italic">No hay selección</p>
                  )}
                </div>

                {activeItemData && (
                  <button
                    onClick={(e) => handleRemove(activeItemData.id, e)}
                    className="w-full py-2 border border-rose-200 text-rose-600 hover:bg-rose-50 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Eliminar Item
                  </button>
                )}
              </div>
            </div>

            {/* Gallery component */}
            <div className="border-t border-slate-200/80 pt-4">
              <span className="text-xs font-bold text-slate-400 block mb-3">Imágenes Disponibles: {items.length}</span>
              {items.length <= 1 ? (
                <div className="text-xs text-slate-400 italic">Se requiere más de una imagen para que el componente ImageGallery sea visible de manera predeterminada.</div>
              ) : null}
              <ImageGallery
                images={items}
                selectedId={selectedId}
                onSelect={handleSelect}
                onRemove={handleRemove}
              />
            </div>
          </div>
        ) : (
          <div className="text-center py-12 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl">
            <p className="text-slate-500 text-sm mb-4">No quedan elementos en la galería interactiva.</p>
            <button
              onClick={handleAddSimulated}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold shadow transition"
            >
              Restaurar Galería
            </button>
          </div>
        )}
      </div>

      {/* Code panel */}
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
