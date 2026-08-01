import React, { useState, useRef } from 'react';
import { useImageOptimizer } from 'jl-optimize-images-react';
import { TabType, MimeTypeOption } from './types';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { CodeView } from './components/CodeView';
import { PreviewArea } from './components/PreviewArea';

export default function App() {
  const [isDragging, setIsDragging] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('preview');

  // Compression options state
  const [quality, setQuality] = useState<number>(0.85);
  const [maxWidth, setMaxWidth] = useState<number>(1920);
  const [maxHeight, setMaxHeight] = useState<number>(1080);
  const [useMaxWidth, setUseMaxWidth] = useState<boolean>(true);
  const [mimeType, setMimeType] = useState<MimeTypeOption>('image/webp');
  const [maintainAspect] = useState<boolean>(true);

  // Hook handles everything: file listing, active image selection, queue, and zip generation!
  const {
    images,
    selectedId,
    setSelectedId,
    addFiles,
    removeFile,
    clearImages,
    downloadZip,
  } = useImageOptimizer({
    quality,
    maxWidth: useMaxWidth ? maxWidth : undefined,
    maxHeight: useMaxWidth ? maxHeight : undefined,
    mimeType,
    maintainAspectRatio: maintainAspect,
  });

  const singleFileInputRef = useRef<HTMLInputElement>(null);
  const multipleFileInputRef = useRef<HTMLInputElement>(null);

  const onSelectSingle = () => singleFileInputRef.current?.click();
  const onSelectMultiple = () => multipleFileInputRef.current?.click();

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      addFiles(e.dataTransfer.files);
    }
  };

  const [isZipping, setIsZipping] = useState(false);

  const handleDownloadZip = async () => {
    setIsZipping(true);
    try {
      await downloadZip('imagenes-optimizadas.zip');
    } catch (err) {
      console.error('Error generating zip:', err);
      alert('Hubo un error al generar el archivo ZIP.');
    } finally {
      setIsZipping(false);
    }
  };

  return (
    <div className="h-screen bg-[#09090b] text-zinc-100 flex flex-col overflow-hidden font-sans">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />

      <input
        ref={singleFileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => e.target.files && addFiles(e.target.files)}
      />
      <input
        ref={multipleFileInputRef}
        type="file"
        multiple
        accept="image/*"
        className="hidden"
        onChange={(e) => e.target.files && addFiles(e.target.files)}
      />

      {/* Main Content Area */}
      {activeTab === 'code' ? (
        <CodeView />
      ) : (
        <main className="flex-1 flex overflow-hidden">
          <Sidebar
            images={images}
            selectedId={selectedId}
            setSelectedId={setSelectedId}
            onSelectSingle={onSelectSingle}
            onSelectMultiple={onSelectMultiple}
            isDragging={isDragging}
            setIsDragging={setIsDragging}
            handleDrop={handleDrop}
            removeImage={removeFile}
            quality={quality}
            setQuality={setQuality}
            mimeType={mimeType}
            setMimeType={setMimeType}
            setImages={() => {}}
          />
          <PreviewArea 
            images={images} 
            selectedId={selectedId} 
            setSelectedId={setSelectedId} 
            onSelectSingle={onSelectSingle} 
            onSelectMultiple={onSelectMultiple} 
            mimeType={mimeType} 
            removeImage={removeFile}
            handleDownloadZip={handleDownloadZip}
            isZipping={isZipping}
            clearImages={clearImages}
          />
        </main>
      )}
    </div>
  );
}
