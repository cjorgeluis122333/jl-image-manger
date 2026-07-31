import { CompressionOptions, CompressionResult } from './types';
import { compressImage } from './compress';

/**
 * A stateful compressor class that stores the original image
 * and allows compressing it multiple times with different settings easily.
 */
export class ImageCompressor {
  private originalImage: File | Blob | string | null = null;

  constructor(input?: File | Blob | string) {
    if (input) {
      this.originalImage = input;
    }
  }

  /**
   * Sets the original image to be compressed.
   * Can be a File, Blob, or URL string.
   */
  setOriginalImage(input: File | Blob | string): void {
    this.originalImage = input;
  }

  /**
   * Returns the original image if set.
   */
  getOriginalImage(): File | Blob | string | null {
    return this.originalImage;
  }

  /**
   * Compresses the stored original image using the provided options.
   * Defaults to quality = 0.85 and webp format if no options are passed.
   */
  async compress(options: CompressionOptions = {}): Promise<CompressionResult> {
    if (!this.originalImage) {
      throw new Error('No original image set. Use setOriginalImage() first.');
    }

    return compressImage(this.originalImage, options);
  }
}
