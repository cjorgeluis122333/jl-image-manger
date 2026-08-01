import { CompressionOptions, CompressionResult } from './types';
import { blobToDataURL } from './utils';

export type DrawableSource = ImageBitmap | HTMLImageElement;

export interface LoadedImageSource {
  source: DrawableSource;
  width: number;
  height: number;
  isCreatedBitmap: boolean;
  originalSize: number;
  originalName: string;
}

/**
 * Loads image source into ImageBitmap (primary with EXIF orientation handling) or HTMLImageElement.
 */
export async function loadImageSource(
  input: File | Blob | string,
  cachedSource?: DrawableSource
): Promise<LoadedImageSource> {
  let originalSize = 0;
  let originalName = 'image';

  if (input instanceof File) {
    originalSize = input.size;
    originalName = input.name;
  } else if (input instanceof Blob) {
    originalSize = input.size;
  }

  if (cachedSource) {
    const width = 'width' in cachedSource ? cachedSource.width : (cachedSource as HTMLImageElement).naturalWidth || (cachedSource as HTMLImageElement).width;
    const height = 'height' in cachedSource ? cachedSource.height : (cachedSource as HTMLImageElement).naturalHeight || (cachedSource as HTMLImageElement).height;
    return {
      source: cachedSource,
      width,
      height,
      isCreatedBitmap: false,
      originalSize,
      originalName,
    };
  }

  // 1. Primary decoder: createImageBitmap with EXIF orientation correction
  let blobInput: Blob | null = null;
  if (input instanceof Blob) {
    blobInput = input;
  } else if (typeof input === 'string') {
    try {
      const res = await fetch(input);
      blobInput = await res.blob();
      if (originalSize === 0) originalSize = blobInput.size;
    } catch {
      // Ignore fetch error, fallback to Image element if applicable
    }
  }

  if (blobInput && typeof createImageBitmap !== 'undefined') {
    try {
      // EXIF Orientation Tag: 'from-image' ensures correct orientation on mobile/camera photos
      const bitmap = await createImageBitmap(blobInput, { imageOrientation: 'from-image' } as any);
      return {
        source: bitmap,
        width: bitmap.width,
        height: bitmap.height,
        isCreatedBitmap: true,
        originalSize,
        originalName,
      };
    } catch {
      // Fallback if createImageBitmap fails
    }
  }

  // 2. Fallback for DOM environment
  if (typeof Image !== 'undefined') {
    let imageUrl = typeof input === 'string' ? input : URL.createObjectURL(input as Blob);
    try {
      const img = await new Promise<HTMLImageElement>((resolve, reject) => {
        const image = new Image();
        image.crossOrigin = 'anonymous';
        image.onload = () => resolve(image);
        image.onerror = () => reject(new Error('Failed to load image element'));
        image.src = imageUrl;
      });
      const width = img.naturalWidth || img.width;
      const height = img.naturalHeight || img.height;
      return {
        source: img,
        width,
        height,
        isCreatedBitmap: false,
        originalSize,
        originalName,
      };
    } finally {
      if (input instanceof Blob) {
        URL.revokeObjectURL(imageUrl);
      }
    }
  }

  throw new Error('No valid image decoder available in the current environment.');
}

/**
 * Step-down scaling to prevent aliasing when shrinking heavily
 */
function drawImageWithStepDown(
  img: DrawableSource,
  targetW: number,
  targetH: number,
  origW: number,
  origH: number,
  ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
  options: CompressionOptions,
  isJpeg: boolean
) {
  const bgColor = options.backgroundColor;
  if (bgColor && bgColor !== 'transparent') {
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, targetW, targetH);
  } else if (!bgColor && isJpeg) {
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, targetW, targetH);
  }

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  // If scaling down by more than half, use a temporary canvas for step-down
  if (targetW < origW * 0.5) {
    let curW = origW;
    let curH = origH;

    let currentCanvas: HTMLCanvasElement | OffscreenCanvas = typeof OffscreenCanvas !== 'undefined'
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

      let nextCanvas: HTMLCanvasElement | OffscreenCanvas = typeof OffscreenCanvas !== 'undefined'
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
    sourceImage,
    onProgress,
  } = options;

  onProgress?.(10);

  const loaded = await loadImageSource(input, sourceImage);
  const { source, width: originalWidth, height: originalHeight, isCreatedBitmap, originalSize, originalName } = loaded;

  onProgress?.(30);

  let width = originalWidth;
  let height = originalHeight;

  // Calculate new dimensions if max width/height specified
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

  try {
    let outputBlob: Blob;
    const isJpeg = mimeType === 'image/jpeg';

    if (typeof OffscreenCanvas !== 'undefined') {
      const canvas = new OffscreenCanvas(width, height);
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Could not obtain OffscreenCanvas 2D context');

      drawImageWithStepDown(source, width, height, originalWidth, originalHeight, ctx as any, options, isJpeg);

      outputBlob = await canvas.convertToBlob({
        type: mimeType,
        quality: mimeType === 'image/png' ? undefined : quality,
      });
    } else if (typeof document !== 'undefined') {
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        throw new Error('Could not obtain 2D canvas context');
      }

      drawImageWithStepDown(source, width, height, originalWidth, originalHeight, ctx, options, isJpeg);

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
    } else {
      throw new Error('No Canvas execution environment available.');
    }

    onProgress?.(80);

    let finalBlob = outputBlob;
    let finalSize = outputBlob.size;
    let finalMime = mimeType;

    if (originalSize > 0 && finalSize > originalSize && width === originalWidth && height === originalHeight) {
      if ((input instanceof File || input instanceof Blob) && input.type === mimeType) {
        finalBlob = input;
        finalSize = originalSize;
        finalMime = input.type;
      }
    }

    const compressedSize = finalSize;
    const savings = originalSize > 0 ? Math.max(0, ((originalSize - compressedSize) / originalSize) * 100) : 0;
    const dataUrl = await blobToDataURL(finalBlob);

    let fileName = originalName;
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
    if (isCreatedBitmap && !sourceImage && 'close' in source && typeof source.close === 'function') {
      source.close();
    }
  }
}
