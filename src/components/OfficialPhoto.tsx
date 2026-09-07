import React, { useState } from 'react';
import { Shield, Sparkles, Image as ImageIcon } from 'lucide-react';

interface OfficialPhotoProps {
  src: string;
  alt: string;
  className?: string;
  fallbackCandidates?: string[];
  title?: string;
  caption?: string;
  badge?: string;
  aspectRatioClass?: string;
}

export const OfficialPhoto: React.FC<OfficialPhotoProps> = ({
  src,
  alt,
  className = 'w-full h-full object-cover',
  fallbackCandidates = [],
  title,
  caption,
  badge,
  aspectRatioClass = 'aspect-4/3',
}) => {
  const [candidateIndex, setCandidateIndex] = useState(0);
  const [allFailed, setAllFailed] = useState(false);

  const candidateList = [src, ...fallbackCandidates];
  const currentSrc = candidateList[candidateIndex];

  const handleImageError = () => {
    if (candidateIndex < candidateList.length - 1) {
      setCandidateIndex(prev => prev + 1);
    } else {
      setAllFailed(true);
    }
  };

  if (allFailed) {
    return (
      <div className={`w-full ${aspectRatioClass} bg-gradient-to-br from-[#081B36] via-[#0F2C59] to-[#081B36] flex flex-col items-center justify-center p-6 text-center text-white border border-[#D4AF37]/30 select-none relative overflow-hidden`}>
        {/* Background watermark */}
        <div className="absolute inset-0 opacity-10 flex items-center justify-center pointer-events-none">
          <img
            src="/images/logo.svg"
            alt="Sceau Filigrane"
            className="w-48 h-48 object-contain"
          />
        </div>

        {/* Foreground Content */}
        <div className="relative z-10 flex flex-col items-center space-y-3 max-w-xs">
          <div className="h-14 w-14 rounded-2xl bg-[#081B36] border-2 border-[#D4AF37] p-1 shadow-lg flex items-center justify-center">
            <img
              src="/images/logo.svg"
              alt="Sceau Église du Nazaréen de Damé"
              className="w-full h-full object-contain"
            />
          </div>

          <div className="space-y-1">
            <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-[#D4AF37]">
              <Shield className="h-3 w-3" />
              {badge || "Archive Officielle"}
            </span>
            <h4 className="text-sm font-bold font-display text-white leading-snug">
              {title || alt}
            </h4>
            {caption && (
              <p className="text-[11px] text-slate-300 line-clamp-2 leading-relaxed font-light">
                {caption}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <img
      src={currentSrc}
      alt={alt}
      onError={handleImageError}
      referrerPolicy="no-referrer"
      className={className}
    />
  );
};
