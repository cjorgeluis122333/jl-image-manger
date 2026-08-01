import { useState, useEffect, useCallback, useRef } from 'react';
import { ImageCompressor, CompressionOptions, CompressionResult } from 'jl-optimize-images';
import JSZip from 'jszip';

export interface OptimizerImage {
  id: string;
  file: File;
  originalUrl: string;
  originalWidth?: number;
  originalHeight?: number;
  originalSize: number;
  isCompressing: boolean;
  error?: string;
  result?: CompressionResult;
  compressor: ImageCompressor;
  appliedOptions?: {
    quality: number;
    maxWidth?: number;
    maxHeight?: number;
    mimeType: string;
  };
}

export interface UseImageOptimizerProps {
  quality: number;
  maxWidth?: number;
  maxHeight?: number;
  mimeType: string;
  maintainAspectRatio?: boolean;
}

const areOptionsEqual = (
  opt1?: { quality: number; maxWidth?: number; maxHeight?: number; mimeType: string },
  opt2?: { quality: number; maxWidth?: number; maxHeight?: number; mimeType: string }
) => {
  if (!opt1 || !opt2) return false;
  return (
    opt1.quality === opt2.quality &&
    opt1.maxWidth === opt2.maxWidth &&
    opt1.maxHeight === opt2.maxHeight &&
    opt1.mimeType === opt2.mimeType
  );
};

export function useImageOptimizer(options: UseImageOptimizerProps) {
  const [images, setImages] = useState<OptimizerImage[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const imagesRef = useRef<OptimizerImage[]>(images);
  useEffect(() => {
    imagesRef.current = images;
  }, [images]);

  // Cleanup object URLs and bitmap cache on unmount
  useEffect(() => {
    return () => {
      imagesRef.current.forEach((img) => {
        URL.revokeObjectURL(img.originalUrl);
        img.compressor.dispose();
      });
    };
  }, []);

  const recompressAll = useCallback(
    async (currentOptions: CompressionOptions) => {
      const list = imagesRef.current;
      if (list.length === 0) return;

      const optCheck = {
        quality: currentOptions.quality ?? 0.65,
        maxWidth: currentOptions.maxWidth,
        maxHeight: currentOptions.maxHeight,
        mimeType: currentOptions.mimeType ?? 'image/webp',
      };

      // 1. Mark all outdated images as compressing immediately so loaders are shown
      setImages((prev) =>
        prev.map((img) => {
          const isUpToDate =
            img.appliedOptions && areOptionsEqual(img.appliedOptions, optCheck);
          if (isUpToDate) return img;
          return { ...img, isCompressing: true, error: undefined };
        })
      );

      // 2. Prioritize selected / active image to be first in the queue
      const activeId = selectedId || list[0].id;
      const sortedIds = [
        activeId,
        ...list.filter((img) => img.id !== activeId).map((img) => img.id),
      ];

      // 3. Process each sequentially
      for (const id of sortedIds) {
        const currentList = imagesRef.current;
        const item = currentList.find((img) => img.id === id);
        if (!item) continue;

        // Check if already up to date
        const isUpToDate =
          item.appliedOptions && areOptionsEqual(item.appliedOptions, optCheck);
        if (isUpToDate) {
          if (item.isCompressing) {
            setImages((prev) =>
              prev.map((img) => (img.id === id ? { ...img, isCompressing: false } : img))
            );
          }
          continue;
        }

        // Just in case it wasn't marked
        setImages((prev) =>
          prev.map((img) => (img.id === id ? { ...img, isCompressing: true, error: undefined } : img))
        );

        try {
          const result = await item.compressor.compress(currentOptions);

          setImages((prev) =>
            prev.map((img) =>
              img.id === id
                ? {
                    ...img,
                    result,
                    isCompressing: false,
                    appliedOptions: {
                      quality: currentOptions.quality ?? 0.65,
                      maxWidth: currentOptions.maxWidth,
                      maxHeight: currentOptions.maxHeight,
                      mimeType: currentOptions.mimeType ?? 'image/webp',
                    },
                  }
                : img
            )
          );
        } catch (err: any) {
          setImages((prev) =>
            prev.map((img) =>
              img.id === id
                ? { ...img, isCompressing: false, error: err.message || 'Error compressing' }
                : img
            )
          );
        }
      }
    },
    [selectedId]
  );

  // Sync / run recompress sequentially when settings change
  useEffect(() => {
    if (imagesRef.current.length === 0) return;

    const currentOptions: CompressionOptions = {
      quality: options.quality,
      maxWidth: options.maxWidth,
      maxHeight: options.maxHeight,
      mimeType: options.mimeType as any,
      maintainAspectRatio: options.maintainAspectRatio,
    };

    recompressAll(currentOptions);
  }, [
    options.quality,
    options.maxWidth,
    options.maxHeight,
    options.mimeType,
    options.maintainAspectRatio,
    recompressAll,
  ]);

  const addFiles = useCallback(
    async (newFiles: FileList | File[]) => {
      const validFiles = Array.from(newFiles).filter((f) => f.type.startsWith('image/'));
      if (validFiles.length === 0) return;

      const newItemsPromises = validFiles.map((file) => {
        return new Promise<OptimizerImage>((resolve) => {
          const originalUrl = URL.createObjectURL(file);
          const imgElement = new Image();
          imgElement.src = originalUrl;
          imgElement.onload = () => {
            const compressor = new ImageCompressor(file);
            resolve({
              id: `${file.name}-${Date.now()}-${Math.random()}`,
              file,
              originalUrl,
              originalSize: file.size,
              originalWidth: imgElement.width,
              originalHeight: imgElement.height,
              isCompressing: true, // Start in compressing state
              compressor,
            });
          };
          imgElement.onerror = () => {
            const compressor = new ImageCompressor(file);
            resolve({
              id: `${file.name}-${Date.now()}-${Math.random()}`,
              file,
              originalUrl,
              originalSize: file.size,
              isCompressing: true,
              compressor,
            });
          };
        });
      });

      const newItems = await Promise.all(newItemsPromises);

      setImages((prev) => {
        const updated = [...prev, ...newItems];
        if (!selectedId && updated.length > 0) {
          setSelectedId(updated[0].id);
        }
        return updated;
      });

      const currentOptions: CompressionOptions = {
        quality: options.quality,
        maxWidth: options.maxWidth,
        maxHeight: options.maxHeight,
        mimeType: options.mimeType as any,
        maintainAspectRatio: options.maintainAspectRatio,
      };

      // Trigger recompress sequentially after state updates
      setTimeout(() => {
        recompressAll(currentOptions);
      }, 0);
    },
    [options, selectedId, recompressAll]
  );

  const removeFile = useCallback((id: string, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }

    setImages((prev) => {
      const target = prev.find((img) => img.id === id);
      if (target) {
        URL.revokeObjectURL(target.originalUrl);
        target.compressor.dispose();
      }

      const filtered = prev.filter((img) => img.id !== id);
      
      if (selectedId === id) {
        setSelectedId(filtered.length > 0 ? filtered[0].id : null);
      }
      return filtered;
    });
  }, [selectedId]);

  const clearImages = useCallback(() => {
    imagesRef.current.forEach((img) => {
      URL.revokeObjectURL(img.originalUrl);
      img.compressor.dispose();
    });
    setImages([]);
    setSelectedId(null);
  }, []);

  const downloadZip = useCallback(async (zipName = 'imagenes_optimizadas.zip') => {
    const list = imagesRef.current;
    if (list.length === 0) return;

    const currentOptions: CompressionOptions = {
      quality: options.quality,
      maxWidth: options.maxWidth,
      maxHeight: options.maxHeight,
      mimeType: options.mimeType as any,
      maintainAspectRatio: options.maintainAspectRatio,
    };

    const optCheck = {
      quality: options.quality,
      maxWidth: options.maxWidth,
      maxHeight: options.maxHeight,
      mimeType: options.mimeType,
    };

    const zip = new JSZip();
    const updatedImages = [...list];

    // Ensure all images are fully compressed with current options before zipping
    for (let i = 0; i < updatedImages.length; i++) {
      const img = updatedImages[i];
      const isUpToDate =
        img.appliedOptions && areOptionsEqual(img.appliedOptions, optCheck);

      if (!isUpToDate || !img.result) {
        setImages((prev) =>
          prev.map((item) => (item.id === img.id ? { ...item, isCompressing: true } : item))
        );

        try {
          const result = await img.compressor.compress(currentOptions);
          
          img.result = result;
          img.appliedOptions = {
            quality: options.quality,
            maxWidth: options.maxWidth,
            maxHeight: options.maxHeight,
            mimeType: options.mimeType,
          };
          img.isCompressing = false;
        } catch (e) {
          console.error(`Error compressing ${img.file.name}:`, e);
          img.isCompressing = false;
        }
      }
    }

    // Sync state
    setImages(updatedImages);

    // Build the ZIP file
    for (const img of updatedImages) {
      if (img.result) {
        try {
          zip.file(img.result.file.name, img.result.blob);
        } catch (err) {
          console.error(`Error zipping: ${img.file.name}`, err);
        }
      }
    }

    const zipBlob = await zip.generateAsync({ type: 'blob' });
    const zipUrl = URL.createObjectURL(zipBlob);
    const link = document.createElement('a');
    link.href = zipUrl;
    link.download = zipName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(zipUrl);
  }, [options]);

  const activeId = selectedId || (images.length > 0 ? images[0].id : null);
  const activeImage = images.find((img) => img.id === activeId) || null;

  return {
    images,
    selectedId: activeId,
    setSelectedId,
    activeImage,
    addFiles,
    removeFile,
    clearImages,
    downloadZip,
  };
}
