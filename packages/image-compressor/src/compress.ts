import { CompressionOptions, CompressionResult } from './types';
import { blobToDataURL } from './utils';

/**
 * Step-down scaling to prevent aliasing when shrinking heavily
 */
function drawImageWithStepDown(
  img: HTMLImageElement,
  targetW: number,
  targetH: number,
  origW: number,
  origH: number,
  ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
  isJpeg: boolean
) {
  if (isJpeg) {
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, targetW, targetH);
  }
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  // If scaling down by more than half, use a temporary canvas for step-down
  if (targetW < origW * 0.5) {
    let curW = origW;
    let curH = origH;
    
    let currentCanvas = typeof OffscreenCanvas !== 'undefined' 
      ? new OffscreenCanvas(curW, curH) 
      : document.createElement('canvas');
      
    if (currentCanvas instanceof HTMLCanvasElement) {
      currentCanvas.width = curW;
      currentCanvas.height = curH;
    }

    let currentCtx = currentCanvas.getContext('2d') as any;
    currentCtx.drawImage(img, 0, 0, curW, curH);

    while (curW * 0.5 > targetW) {
      let nextW = Math.floor(curW * 0.5);
      let nextH = Math.floor(curH * 0.5);
      
      let nextCanvas = typeof OffscreenCanvas !== 'undefined'
        ? new OffscreenCanvas(nextW, nextH)
        : document.createElement('canvas');
        
      if (nextCanvas instanceof HTMLCanvasElement) {
        nextCanvas.width = nextW;
        nextCanvas.height = nextH;
      }
      
      let nextCtx = nextCanvas.getContext('2d') as any;
      nextCtx.imageSmoothingEnabled = true;
      nextCtx.imageSmoothingQuality = 'high';
      nextCtx.drawImage(currentCanvas, 0, 0, curW, curH, 0, 0, nextW, nextH);
      
      currentCanvas = nextCanvas;
      curW = nextW;
      curH = nextH;
    }

    ctx.drawImage(currentCanvas, 0, 0, curW, curH, 0, 0, targetW, targetH);
  } else {
    ctx.drawImage(img, 0, 0, targetW, targetH);
  }
}

/**
 * Compresses an image File, Blob, or URL with customizable quality, dimensions, and format.
 */
export async function compressImage(
  input: File | Blob | string,
  options: CompressionOptions = {}
): Promise<CompressionResult> {
  const {
    quality = 0.8,
    maxWidth,
    maxHeight,
    mimeType = 'image/webp',
    maintainAspectRatio = true,
    onProgress,
  } = options;

  onProgress?.(10);

  // 1. Load image source into an HTMLImageElement
  let imageUrl: string;
  let originalSize = 0;
  let originalName = 'image';

  if (input instanceof File) {
    originalSize = input.size;
    originalName = input.name;
    imageUrl = URL.createObjectURL(input);
  } else if (input instanceof Blob) {
    originalSize = input.size;
    imageUrl = URL.createObjectURL(input);
  } else {
    imageUrl = input;
    // Fetch blob if URL to get original size
    try {
      const res = await fetch(input);
      const blob = await res.blob();
      originalSize = blob.size;
    } catch {
      originalSize = 0;
    }
  }

  onProgress?.(30);

  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const image = new Image();
      image.crossOrigin = 'anonymous';
      image.onload = () => resolve(image);
      image.onerror = (err) => reject(new Error('Failed to load image for compression'));
      image.src = imageUrl;
    });

    const originalWidth = img.naturalWidth || img.width;
    const originalHeight = img.naturalHeight || img.height;

    let width = originalWidth;
    let height = originalHeight;

    // 2. Calculate new dimensions if max width/height specified
    if (maxWidth || maxHeight) {
      const maxW = maxWidth || originalWidth;
      const maxH = maxHeight || originalHeight;

      if (width > maxW || height > maxH) {
        if (maintainAspectRatio) {
          const ratio = Math.min(maxW / width, maxH / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        } else {
          width = maxW;
          height = maxH;
        }
      }
    }

    onProgress?.(60);

    // 3. Draw onto OffscreenCanvas or HTML Canvas
    let outputBlob: Blob;

    const isJpeg = mimeType === 'image/jpeg';

    if (typeof OffscreenCanvas !== 'undefined') {
      const canvas = new OffscreenCanvas(width, height);
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Could not obtain OffscreenCanvas 2D context');

      drawImageWithStepDown(img, width, height, originalWidth, originalHeight, ctx as any, isJpeg);

      outputBlob = await canvas.convertToBlob({
        type: mimeType,
        quality: mimeType === 'image/png' ? undefined : quality,
      });
    } else {
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        throw new Error('Could not obtain 2D canvas context');
      }

      drawImageWithStepDown(img, width, height, originalWidth, originalHeight, ctx, isJpeg);

      // 4. Export to Blob
      outputBlob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Canvas to Blob conversion failed'));
            }
          },
          mimeType,
          mimeType === 'image/png' ? undefined : quality
        );
      });
    }

    onProgress?.(80);

    // Fallback: If output size is larger than original and we didn't resize, we might want to return original.
    // However, since they might be relying on a format change (e.g. converting to WebP), we only fallback
    // if the output is strictly larger AND it was already the same mimetype, OR the original blob is available and smaller.
    // To be safe and just optimize size, we will check if it's larger. If we didn't resize and original was smaller, and the format is the same:
    let finalBlob = outputBlob;
    let finalSize = outputBlob.size;
    let finalMime = mimeType;
    let wasOriginalUsed = false;

    if (originalSize > 0 && finalSize > originalSize && width === originalWidth && height === originalHeight) {
      if (input instanceof File || input instanceof Blob) {
        // Only fallback if the original format matches the requested output format, or if they explicitly wanted best size
        if (input.type === mimeType) {
           finalBlob = input;
           finalSize = originalSize;
           finalMime = input.type;
           wasOriginalUsed = true;
        }
      }
    }

    const compressedSize = finalSize;
    const savings = originalSize > 0 ? Math.max(0, ((originalSize - compressedSize) / originalSize) * 100) : 0;
    const dataUrl = await blobToDataURL(finalBlob);

    let fileName = originalName;
    
    // If the input was not a File, we provide a sensible default name with an extension
    if (!(input instanceof File)) {
      const extension = finalMime.split('/')[1] || 'jpg';
      fileName = `${originalName}.${extension === 'jpeg' ? 'jpg' : extension}`;
    }
    
    const compressedFile = new File([finalBlob], fileName, { type: finalMime });

    onProgress?.(100);

    return {
      blob: finalBlob,
      file: compressedFile,
      dataUrl,
      originalSize,
      compressedSize,
      savingsPercentage: parseFloat(savings.toFixed(1)),
      originalWidth,
      originalHeight,
      width,
      height,
      mimeType,
    };
  } finally {
    // Clean up object URL if created, preventing memory leaks
    if (input instanceof File || input instanceof Blob) {
      URL.revokeObjectURL(imageUrl);
    }
  }
}
