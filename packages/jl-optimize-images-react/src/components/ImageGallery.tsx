import React from 'react';
import { Sparkles, RefreshCw, Trash2 } from 'lucide-react';
import { SupportedLocale, getLabels } from '../i18n';

export interface ImageGalleryItem {
  id: string;
  originalUrl: string;
  name: string;
  isCompressing?: boolean;
  hasResult?: boolean;
}

export interface ImageGalleryLabels {
  delete?: string;
}

export interface ImageGalleryProps {
  images: ImageGalleryItem[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onRemove: (id: string, e: React.MouseEvent) => void;
  /** Whether to hide the gallery when there is only 1 image (default: false) */
  hideIfSingle?: boolean;
  /** Locale language ('es' | 'en'). Default: 'es' */
  locale?: SupportedLocale;
  /** Configurable text labels for i18n */
  labels?: ImageGalleryLabels;
  className?: string;
  style?: React.CSSProperties;
  customClasses?: {
    container?: string;
    itemContainer?: string;
    itemButton?: string;
    itemImage?: string;
    activeItem?: string;
    inactiveItem?: string;
    compressingOverlay?: string;
    compressingSpinner?: string;
    successBadge?: string;
    successIcon?: string;
    removeButton?: string;
    removeButtonIcon?: string;
  };
  customStyles?: {
    container?: React.CSSProperties;
    itemContainer?: React.CSSProperties;
    itemButton?: React.CSSProperties;
    removeButton?: React.CSSProperties;
  };
  renderItem?: (img: ImageGalleryItem, isSelected: boolean) => React.ReactNode;
  renderRemoveButton?: (id: string, onRemove: (e: React.MouseEvent) => void) => React.ReactNode;
  renderCompressingOverlay?: () => React.ReactNode;
  renderSuccessBadge?: () => React.ReactNode;
}

export const ImageGallery: React.FC<ImageGalleryProps> = ({
  images,
  selectedId,
  onSelect,
  onRemove,
  hideIfSingle = false,
  locale = 'es',
  labels = {},
  className = '',
  style,
  customClasses = {},
  customStyles = {},
  renderItem,
  renderRemoveButton,
  renderCompressingOverlay,
  renderSuccessBadge,
}) => {
  const resolvedLabels = getLabels(locale, labels as any);
  const deleteLabel = resolvedLabels.delete;

  if (images.length === 0) return null;
  if (hideIfSingle && images.length === 1) return null;

  const defaultRenderCompressingOverlay = () => (
    <div className={customClasses.compressingOverlay || "absolute inset-0 bg-black/60 flex items-center justify-center rounded-xl"}>
      <RefreshCw className={customClasses.compressingSpinner || "w-5 h-5 text-blue-400 animate-spin"} />
    </div>
  );

  const defaultRenderSuccessBadge = () => (
    <div className={customClasses.successBadge || "absolute top-1 right-1 bg-emerald-500 rounded-full p-0.5 shadow-sm"}>
      <Sparkles className={customClasses.successIcon || "w-2.5 h-2.5 text-white"} />
    </div>
  );

  const defaultRenderRemoveButton = (id: string) => (
    <button
      onClick={(e) => onRemove(id, e)}
      className={customClasses.removeButton || "absolute -top-2 -right-2 bg-rose-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"}
      style={customStyles.removeButton}
      title={deleteLabel}
      aria-label={deleteLabel}
    >
      <Trash2 className={customClasses.removeButtonIcon || "w-3 h-3"} />
    </button>
  );

  return (
    <div 
      className={customClasses.container || `flex gap-3 overflow-x-auto pb-2 shrink-0 max-h-24 no-scrollbar ${className}`}
      style={{ ...customStyles.container, ...style }}
      id="image-gallery-container"
    >
      {images.map((img) => {
        const isSelected = selectedId === img.id;
        
        if (renderItem) {
          return <React.Fragment key={img.id}>{renderItem(img, isSelected)}</React.Fragment>;
        }

        return (
          <div 
            key={img.id} 
            className={customClasses.itemContainer || "relative group shrink-0 w-24 h-16"}
            style={customStyles.itemContainer}
          >
            <button
              onClick={() => onSelect(img.id)}
              className={customClasses.itemButton || `w-full h-full rounded-xl overflow-hidden border-2 transition-all ${
                isSelected 
                  ? (customClasses.activeItem || 'border-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.3)]') 
                  : (customClasses.inactiveItem || 'border-zinc-800/80 hover:border-zinc-600')
              }`}
              style={customStyles.itemButton}
            >
              <img
                src={img.originalUrl}
                alt={img.name}
                className={customClasses.itemImage || "w-full h-full object-cover"}
              />
              {img.isCompressing ? (
                renderCompressingOverlay ? renderCompressingOverlay() : defaultRenderCompressingOverlay()
              ) : img.hasResult ? (
                renderSuccessBadge ? renderSuccessBadge() : defaultRenderSuccessBadge()
              ) : null}
            </button>
            
            {renderRemoveButton 
              ? renderRemoveButton(img.id, (e) => onRemove(img.id, e)) 
              : defaultRenderRemoveButton(img.id)}
          </div>
        );
      })}
    </div>
  );
};
