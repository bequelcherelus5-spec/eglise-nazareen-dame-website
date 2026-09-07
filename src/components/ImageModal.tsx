import React from 'react';
import { X, MapPin, Sparkles, ExternalLink, ShieldCheck } from 'lucide-react';
import { ChurchRealImage } from '../data/churchMedia';
import { OfficialPhoto } from './OfficialPhoto';

interface ImageModalProps {
  image: ChurchRealImage | null;
  onClose: () => void;
}

export const ImageModal: React.FC<ImageModalProps> = ({ image, onClose }) => {
  if (!image) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="relative max-w-4xl w-full bg-[#081B36] rounded-2xl overflow-hidden border border-[#D4AF37]/50 shadow-2xl text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#0F2C59]/80">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 px-3 py-0.5 text-xs font-bold uppercase tracking-wider text-[#D4AF37]">
              <Sparkles className="h-3.5 w-3.5" />
              {image.badge}
            </span>
            <span className="text-xs text-slate-300 hidden sm:inline-flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5 text-[#D4AF37]" />
              {image.location}
            </span>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-slate-300 hover:text-white hover:bg-white/10 transition-colors focus:outline-none"
            aria-label="Fermer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Image Display Area */}
        <div className="relative bg-black flex items-center justify-center max-h-[65vh] overflow-hidden">
          <OfficialPhoto
            src={image.src}
            alt={image.alt}
            fallbackCandidates={image.candidates ? [...image.candidates] : []}
            title={image.title}
            caption={image.caption}
            badge={image.badge}
            aspectRatioClass="aspect-16/9"
            className="w-full h-full max-h-[65vh] object-contain select-none"
          />
        </div>

        {/* Caption & Context Footer */}
        <div className="p-6 bg-gradient-to-b from-[#081B36] to-[#051124] space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <h3 className="text-lg sm:text-xl font-bold font-display text-white">
              {image.title}
            </h3>
            <span className="inline-flex items-center gap-1.5 text-xs text-[#D4AF37] font-semibold">
              <ShieldCheck className="h-4 w-4" />
              Patrimoine officiel de l'Église
            </span>
          </div>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
            {image.caption}
          </p>

          <div className="pt-2 flex items-center justify-between text-[11px] text-slate-400 border-t border-white/10">
            <span>ÉGLISE DU NAZARÉEN DE DAMÉ • « Sainteté à l'Éternel »</span>
            <span className="text-slate-400">{image.location}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
