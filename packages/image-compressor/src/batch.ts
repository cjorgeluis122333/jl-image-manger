import { BatchCompressionOptions, CompressionResult } from './types';
import { compressImage } from './compress';
import { yieldToMain } from './utils';

/**
 * Batch compress multiple images with progress reporting and concurrency control.
 * Optimized to prevent blocking the main thread during heavy workloads.
 */
export async function compressImages(
  files: (File | Blob | string)[],
  options: BatchCompressionOptions = {},
  onBatchProgress?: (completed: number, total: number) => void
): Promise<CompressionResult[]> {
  const maxImages = options.maxImages || 50;

  if (files.length > maxImages) {
    throw new Error(`Cannot compress more than ${maxImages} images at once. You provided ${files.length}.`);
  }

  const results: (CompressionResult | null)[] = new Array(files.length).fill(null);
  const total = files.length;
  let completed = 0;
  let currentIndex = 0;
  
  // Default to 2 for concurrency to prevent memory spikes and keep the UI fluid
  // since canvas operations can be heavy on the main thread.
  const concurrency = options.concurrency || 2;

  const compressNext = async (): Promise<void> => {
    if (currentIndex >= total) return;
    const index = currentIndex++;
    
    // Yield to the main thread before starting a new heavy task
    await yieldToMain();
    
    try {
      results[index] = await compressImage(files[index], options);
    } catch (err) {
      console.error(`Failed to compress image at index ${index}:`, err);
      // We will skip failed images and filter them out later, 
      // rather than crashing the whole batch.
    }
    
    completed++;
    onBatchProgress?.(completed, total);
    
    // Yield again after the work is done before picking up the next task
    await yieldToMain();
    await compressNext();
  };

  const workers = Array.from({ length: Math.min(concurrency, total) }, () => compressNext());
  await Promise.all(workers);

  // Return only successful compressions to ensure type safety (no nulls)
  return results.filter((res): res is CompressionResult => res !== null);
}
