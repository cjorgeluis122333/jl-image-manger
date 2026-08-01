export type SupportedLocale = 'es' | 'en';

export interface LibraryLabels {
  compressing: string;
  compressed: string;
  original: string;
  waitingResult: string;
  ariaSliderLabel: string;
  delete: string;
  errorCompressing: string;
  defaultZipName: string;
}

export const DEFAULT_LABELS: Record<SupportedLocale, LibraryLabels> = {
  es: {
    compressing: 'Comprimiendo...',
    compressed: 'Comprimido:',
    original: 'Original:',
    waitingResult: 'Esperando resultado...',
    ariaSliderLabel: 'Comparación de imagen original y comprimida',
    delete: 'Eliminar',
    errorCompressing: 'Error al comprimir la imagen',
    defaultZipName: 'imagenes_optimizadas.zip',
  },
  en: {
    compressing: 'Compressing...',
    compressed: 'Compressed:',
    original: 'Original:',
    waitingResult: 'Waiting for result...',
    ariaSliderLabel: 'Original and compressed image comparison',
    delete: 'Delete',
    errorCompressing: 'Error compressing image',
    defaultZipName: 'optimized_images.zip',
  },
};

export function getLabels(locale: SupportedLocale = 'es', customLabels?: Partial<LibraryLabels>): LibraryLabels {
  const base = DEFAULT_LABELS[locale] || DEFAULT_LABELS.es;
  return { ...base, ...customLabels };
}
