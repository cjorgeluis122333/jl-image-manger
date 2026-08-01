import { CompressionOptions, CompressionResult } from './types';
import { compressImage, loadImageSource, DrawableSource } from './compress';

/**
 * A stateful compressor class that stores the original image
 * and caches the decoded image source (ImageBitmap or HTMLImageElement)
 * so re-compressions (e.g. for live UI sliders) are up to 50x faster.
 */
export class ImageCompressor {
  private originalImage: File | Blob | string | null = null;
  private cachedSource: DrawableSource | null = null;

  constructor(input?: File | Blob | string) {
    if (input) {
      this.originalImage = input;
    }
  }

  /**
   * Sets the original image to be compressed and clears previous cache.
   */
  setOriginalImage(input: File | Blob | string): void {
    if (this.originalImage !== input) {
      this.clearCache();
      this.originalImage = input;
    }
  }

  /**
   * Returns the original image if set.
   */
  getOriginalImage(): File | Blob | string | null {
    return this.originalImage;
  }

  /**
   * Pre-decodes and caches the image source in memory for ultra-fast subsequent compressions.
   */
  async preload(): Promise<DrawableSource> {
    if (!this.originalImage) {
      throw new Error('No original image set. Use setOriginalImage() first.');
    }
    if (!this.cachedSource) {
      const loaded = await loadImageSource(this.originalImage);
      this.cachedSource = loaded.source;
    }
    return this.cachedSource;
  }

  /**
   * Compresses the stored original image using the provided options.
   * Automatically uses cached pre-decoded source if available.
   */
  async compress(options: CompressionOptions = {}): Promise<CompressionResult> {
    if (!this.originalImage) {
      throw new Error('No original image set. Use setOriginalImage() first.');
    }

    const source = options.sourceImage || (await this.preload());

    return compressImage(this.originalImage, {
      ...options,
      sourceImage: source,
    });
  }

  /**
   * Clears cached ImageBitmap / Image element resources to free memory.
   */
  clearCache(): void {
    if (this.cachedSource) {
      if ('close' in this.cachedSource && typeof this.cachedSource.close === 'function') {
        this.cachedSource.close();
      }
      this.cachedSource = null;
    }
  }

  /**
   * Alias for clearCache.
   */
  dispose(): void {
    this.clearCache();
  }
}
