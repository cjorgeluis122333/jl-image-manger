import React, { useState, useRef, useCallback, useEffect } from 'react';
import { MoveHorizontal } from 'lucide-react';

export interface ImageComparisonProps {
  leftImage?: string;
  rightImage?: string;
  originalUrl?: string;
  compressedUrl?: string;
  originalSize?: number;
  compressedSize?: number;
  isCompressing?: boolean;
  leftImageAlt?: string;
  rightImageAlt?: string;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  sliderColor?: string;
  /**
   * Muestra una cuadrícula de transparencia de fondo, muy útil para
   * comparar imágenes PNG/WebP con formatos sin canal alfa como JPEG.
   */
  showTransparencyGrid?: boolean;
  /**
   * Ajuste de la imagen dentro del contenedor.
   * 'contain' es ideal para visualizar la imagen completa sin recortar.
   */
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
}

export const ImageComparison: React.FC<ImageComparisonProps> = ({
  leftImage,
  rightImage,
  originalUrl,
  compressedUrl,
  originalSize,
  compressedSize,
  isCompressing,
  leftImageAlt = 'Left Image',
  rightImageAlt = 'Right Image',
  className = '',
  style,
  children,
  sliderColor = '#3b82f6', // blue-500
  showTransparencyGrid = true,
  objectFit = 'contain',
}) => {
  const [sliderPosition, setSliderPosition] = useState<number>(50);
  const [isDraggingSlider, setIsDraggingSlider] = useState<boolean>(false);
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const startPanRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const finalLeftImage = leftImage || originalUrl || '';
  const finalRightImage = rightImage || compressedUrl || '';

  // Reset zoom and pan when images change
  useEffect(() => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }, [finalLeftImage, finalRightImage]);

  const handleSliderMove = useCallback(
    (clientX: number) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
      const percentage = (x / rect.width) * 100;
      setSliderPosition(percentage);
    },
    []
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const step = e.shiftKey ? 10 : 1;
    if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
      e.preventDefault();
      setSliderPosition((prev) => Math.max(0, prev - step));
    } else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
      e.preventDefault();
      setSliderPosition((prev) => Math.min(100, prev + step));
    } else if (e.key === 'Home') {
      e.preventDefault();
      setSliderPosition(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      setSliderPosition(100);
    }
  };

  useEffect(() => {
    const handleMouseUp = () => {
      setIsDraggingSlider(false);
      setIsPanning(false);
    };
    const handleMouseMove = (e: MouseEvent) => {
      if (isDraggingSlider) {
        handleSliderMove(e.clientX);
      } else if (isPanning) {
        setPan({
          x: e.clientX - startPanRef.current.x,
          y: e.clientY - startPanRef.current.y,
        });
      }
    };
    const handleTouchEnd = () => {
      setIsDraggingSlider(false);
      setIsPanning(false);
    };
    const handleTouchMove = (e: TouchEvent) => {
      if (isDraggingSlider && e.touches[0]) {
        handleSliderMove(e.touches[0].clientX);
      } else if (isPanning && e.touches[0]) {
        setPan({
          x: e.touches[0].clientX - startPanRef.current.x,
          y: e.touches[0].clientY - startPanRef.current.y,
        });
      }
    };

    if (isDraggingSlider || isPanning) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleTouchMove, { passive: false });
      window.addEventListener('touchend', handleTouchEnd);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isDraggingSlider, isPanning, handleSliderMove]);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const zoomSensitivity = 0.005;
    setZoom((prevZoom) => {
      const newZoom = Math.max(1, Math.min(15, prevZoom - e.deltaY * zoomSensitivity));
      if (newZoom === 1) {
        setPan({ x: 0, y: 0 }); // reset pan when fully zoomed out
      }
      return newZoom;
    });
  }, []);

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      role="slider"
      aria-label="Image comparison slider"
      aria-valuenow={Math.round(sliderPosition)}
      aria-valuemin={0}
      aria-valuemax={100}
      onKeyDown={handleKeyDown}
      onWheel={handleWheel}
      onMouseDown={(e) => {
        if (containerRef.current) {
          const rect = containerRef.current.getBoundingClientRect();
          const clickX = e.clientX - rect.left;
          const sliderX = (sliderPosition / 100) * rect.width;
          const isClickNearSlider = Math.abs(clickX - sliderX) < 30; // 30px hit area
          
          if (e.button === 1 || e.altKey || e.shiftKey || (zoom > 1 && !isClickNearSlider)) {
            e.preventDefault();
            setIsPanning(true);
            startPanRef.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
            return;
          }
        }
        setIsDraggingSlider(true);
        handleSliderMove(e.clientX);
      }}
      onTouchStart={(e) => {
        if (e.touches && e.touches[0]) {
          if (containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            const touchX = e.touches[0].clientX - rect.left;
            const sliderX = (sliderPosition / 100) * rect.width;
            const isTouchNearSlider = Math.abs(touchX - sliderX) < 40;
            
            if (zoom > 1 && !isTouchNearSlider) {
              setIsPanning(true);
              startPanRef.current = { x: e.touches[0].clientX - pan.x, y: e.touches[0].clientY - pan.y };
              return;
            }
          }
          setIsDraggingSlider(true);
          handleSliderMove(e.touches[0].clientX);
        }
      }}
      data-dragging={isDraggingSlider}
      className={`group relative overflow-hidden select-none flex items-center justify-center touch-none focus:outline-none focus:ring-2 focus:ring-blue-500 ${className} ${zoom > 1 && !isDraggingSlider ? 'cursor-move' : 'cursor-ew-resize'}`}
      style={{ 
        touchAction: 'none',
        backgroundImage: showTransparencyGrid ? `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20'%3E%3Crect width='10' height='10' fill='%231e1e20'/%3E%3Crect x='10' y='10' width='10' height='10' fill='%231e1e20'/%3E%3Crect x='10' width='10' height='10' fill='%23121214'/%3E%3Crect y='10' width='10' height='10' fill='%23121214'/%3E%3C/svg%3E")` : undefined,
        backgroundRepeat: showTransparencyGrid ? 'repeat' : undefined,
        backgroundPosition: showTransparencyGrid ? 'center' : undefined,
        ...style 
      }}
    >
      {/* Background / Right Image */}
      {finalRightImage ? (
        <img
          src={finalRightImage}
          alt={rightImageAlt}
          className="absolute inset-0 w-full h-full pointer-events-none origin-center"
          style={{ objectFit, transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`, transition: isPanning ? 'none' : 'transform 0.1s ease-out' }}
        />
      ) : finalLeftImage ? (
        <img
          src={finalLeftImage}
          alt="Placeholder"
          className="absolute inset-0 w-full h-full pointer-events-none opacity-40 blur-[4px] grayscale-[50%] origin-center"
          style={{ objectFit, transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`, transition: isPanning ? 'none' : 'transform 0.1s ease-out' }}
        />
      ) : null}

      {/* Foreground / Left Image (clipped by sliderPosition) */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ 
          clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)`,
          willChange: 'clip-path'
        }}
      >
        <img
          src={finalLeftImage}
          alt={leftImageAlt}
          className="absolute inset-0 w-full h-full pointer-events-none origin-center"
          style={{ objectFit, transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`, transition: isPanning ? 'none' : 'transform 0.1s ease-out' }}
        />
      </div>

      {/* Splitter bar */}
      <div
        className="absolute top-0 bottom-0 w-1 shadow-lg z-30 pointer-events-none flex items-center justify-center transition-transform duration-75"
        style={{ left: `${sliderPosition}%`, backgroundColor: sliderColor, willChange: 'left' }}
      >
        <div 
          className="w-10 h-10 sm:w-8 sm:h-8 rounded-full border-2 border-white text-white flex items-center justify-center shadow-2xl absolute left-1/2 transform -translate-x-1/2 touch-manipulation active:scale-110 transition-transform"
          style={{ backgroundColor: sliderColor }}
        >
          <MoveHorizontal className="w-5 h-5 sm:w-4 sm:h-4" />
        </div>
      </div>

      {/* Custom Overlays (Badges, Spinners, etc.) */}
      {children}
    </div>
  );
};
