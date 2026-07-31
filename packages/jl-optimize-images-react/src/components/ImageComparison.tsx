import React, { useState, useRef, useCallback, useEffect } from 'react';
import { MoveHorizontal, RefreshCw } from 'lucide-react';
import { formatBytes } from 'jl-optimize-images';

export interface ImageComparisonProps {
  originalUrl: string;
  originalSize: number;
  compressedUrl?: string;
  compressedSize?: number;
  isCompressing?: boolean;
  className?: string;
  style?: React.CSSProperties;
  customClasses?: {
    container?: string;
    compressingOverlay?: string;
    compressingSpinner?: string;
    compressingText?: string;
    waitingText?: string;
    badgeCompressed?: string;
    badgeOriginal?: string;
    badgeDotCompressed?: string;
    badgeDotOriginal?: string;
    splitterBar?: string;
    splitterHandle?: string;
    splitterIcon?: string;
  };
  customStyles?: {
    container?: React.CSSProperties;
    compressingOverlay?: React.CSSProperties;
    badgeCompressed?: React.CSSProperties;
    badgeOriginal?: React.CSSProperties;
    splitterBar?: React.CSSProperties;
    splitterHandle?: React.CSSProperties;
  };
  renderCompressingOverlay?: () => React.ReactNode;
  renderCompressedBadge?: (size: number | undefined) => React.ReactNode;
  renderOriginalBadge?: (size: number) => React.ReactNode;
  renderSplitter?: (position: number) => React.ReactNode;
}

export const ImageComparison: React.FC<ImageComparisonProps> = ({
  originalUrl,
  originalSize,
  compressedUrl,
  compressedSize,
  isCompressing = false,
  className = '',
  style,
  customClasses = {},
  customStyles = {},
  renderCompressingOverlay,
  renderCompressedBadge,
  renderOriginalBadge,
  renderSplitter,
}) => {
  const [sliderPosition, setSliderPosition] = useState<number>(50);
  const [isDraggingSlider, setIsDraggingSlider] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleSliderMove = useCallback(
    (clientX: number) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = clientX - rect.left;
      const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
      setSliderPosition(percentage);
    },
    []
  );

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

  // Default renders
  const defaultRenderCompressingOverlay = () => (
    <div 
      className={customClasses.compressingOverlay || "absolute inset-0 bg-zinc-950/20 backdrop-blur-md flex flex-col items-center justify-center gap-3 z-10"}
      style={customStyles.compressingOverlay}
    >
      <div className="p-4 bg-zinc-900/90 border border-zinc-800/80 rounded-2xl flex flex-col items-center gap-2 shadow-2xl">
        <RefreshCw className={customClasses.compressingSpinner || "w-6 h-6 text-blue-400 animate-spin"} />
        <span className={customClasses.compressingText || "text-[11px] text-zinc-200 font-medium px-1"}>Comprimiendo...</span>
      </div>
    </div>
  );

  const defaultRenderCompressedBadge = () => (
    <div 
      className={customClasses.badgeCompressed || "absolute top-4 right-4 z-20 px-3 py-1.5 bg-emerald-950/80 backdrop-blur-md rounded-xl text-xs font-mono text-emerald-300 border border-emerald-500/30 shadow-lg flex items-center gap-2"}
      style={customStyles.badgeCompressed}
    >
      <span className={customClasses.badgeDotCompressed || "w-2 h-2 rounded-full bg-emerald-400"}></span>
      <span>Comprimido: {compressedSize ? formatBytes(compressedSize) : '...'}</span>
    </div>
  );

  const defaultRenderOriginalBadge = () => (
    <div 
      className={customClasses.badgeOriginal || "absolute top-4 left-4 z-20 px-3 py-1.5 bg-black/80 backdrop-blur-md rounded-xl text-xs font-mono text-zinc-300 border border-white/10 shadow-lg flex items-center gap-2"}
      style={customStyles.badgeOriginal}
    >
      <span className={customClasses.badgeDotOriginal || "w-2 h-2 rounded-full bg-zinc-400"}></span>
      <span>Original: {formatBytes(originalSize)}</span>
    </div>
  );

  const defaultRenderSplitter = () => (
    <div
      className={customClasses.splitterBar || "absolute top-0 bottom-0 w-1 bg-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.8)] z-30 pointer-events-none flex items-center justify-center"}
      style={{ left: `${sliderPosition}%`, ...customStyles.splitterBar }}
    >
      <div 
        className={customClasses.splitterHandle || "w-8 h-8 rounded-full bg-blue-600 border-2 border-white text-white flex items-center justify-center shadow-xl"}
        style={customStyles.splitterHandle}
      >
        <MoveHorizontal className={customClasses.splitterIcon || "w-4 h-4"} />
      </div>
    </div>
  );

  return (
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
      className={customClasses.container || `relative overflow-hidden select-none cursor-ew-resize flex items-center justify-center ${className}`}
      style={{ ...customStyles.container, ...style }}
      id="image-comparison-container"
    >
      {/* Background / Compressed Image (right side) */}
      {compressedUrl ? (
        <img
          src={compressedUrl}
          alt="Comprimida"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        />
      ) : originalUrl ? (
        <img
          src={originalUrl}
          alt="Original placeholder"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none opacity-40 blur-[2px]"
        />
      ) : (
        <div className={customClasses.waitingText || "absolute inset-0 flex items-center justify-center text-zinc-500 text-sm"}>
          Esperando resultado...
        </div>
      )}

      {/* Compressing Overlay (rendered on top of right side) */}
      {isCompressing && (
        renderCompressingOverlay ? renderCompressingOverlay() : defaultRenderCompressingOverlay()
      )}

      {!isCompressing && (renderCompressedBadge ? renderCompressedBadge(compressedSize) : defaultRenderCompressedBadge())}

      {/* Foreground / Original Image (left side clipped by sliderPosition) */}
      <div
        className="absolute inset-0 overflow-hidden pointer-events-none"
        style={{ width: `${sliderPosition}%` }}
      >
        <div
          className="absolute inset-0 w-full h-full"
          style={{ width: containerRef.current ? `${containerRef.current.clientWidth}px` : '100vw', height: '100%' }}
        >
          <img
            src={originalUrl}
            alt="Original"
            className="absolute inset-0 w-full h-full object-cover pointer-events-none"
            style={{ width: containerRef.current ? `${containerRef.current.clientWidth}px` : '100vw', height: '100%', maxWidth: 'none' }}
          />
        </div>

        {renderOriginalBadge ? renderOriginalBadge(originalSize) : defaultRenderOriginalBadge()}
      </div>

      {/* Splitter bar */}
      {renderSplitter ? renderSplitter(sliderPosition) : defaultRenderSplitter()}
    </div>
  );
};
