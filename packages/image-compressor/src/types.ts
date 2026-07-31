export interface CompressionOptions {
  /** Quality between 0 and 1 (default: 0.8) */
  quality?: number;
  /** Maximum width in pixels */
  maxWidth?: number;
  /** Maximum height in pixels */
  maxHeight?: number;
  /** Output MIME type (default: 'image/webp') */
  mimeType?: 'image/jpeg' | 'image/webp' | 'image/png';
  /** Whether to maintain aspect ratio when resizing (default: true) */
  maintainAspectRatio?: boolean;
  /** Progress callback (0 to 100) */
  onProgress?: (progress: number) => void;
}

export interface BatchCompressionOptions extends CompressionOptions {
  /** Number of maximum concurrent compressions (default: 2) */
  concurrency?: number;
  /** Maximum number of images allowed in a single batch (default: 50) */
  maxImages?: number;
}

export interface CompressionResult {
  /** Compressed Blob */
  blob: Blob;
  /** Compressed File object with original filename & extension */
  file: File;
  /** Data URL for preview */
  dataUrl: string;
  /** Original file size in bytes */
  originalSize: number;
  /** Compressed file size in bytes */
  compressedSize: number;
  /** Percentage of size saved (0 - 100) */
  savingsPercentage: number;
  /** Original width */
  originalWidth: number;
  /** Original height */
  originalHeight: number;
  /** Compressed width */
  width: number;
  /** Compressed height */
  height: number;
  /** Output format MIME type */
  mimeType: string;
}
