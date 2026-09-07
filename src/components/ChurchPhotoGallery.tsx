import React, { useState } from 'react';
import { CHURCH_ASSETS, ChurchRealImage } from '../data/churchMedia';
import { ImageModal } from './ImageModal';
import { OfficialPhoto } from './OfficialPhoto';
import { 
  Maximize2, 
  MapPin, 
  Sparkles, 
  GraduationCap, 
  Users, 
  Trees, 
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

interface ChurchPhotoGalleryProps {
  onNavigateToTab?: (tab: any) => void;
}

export const ChurchPhotoGallery: React.FC<ChurchPhotoGalleryProps> = ({ onNavigateToTab }) => {
  const [activeModalImage, setActiveModalImage] = useState<ChurchRealImage | null>(null);

  const imagesList = [
    {
      ...CHURCH_ASSETS.logo,
      tag: "Sceau Officiel",
      icon: <Sparkles className="h-4 w-4 text-[#D4AF37]" />,
      routeTab: 'a-propos'
    },
    {
      ...CHURCH_ASSETS.comite,
      tag: "Direction & Comité",
      icon: <Users className="h-4 w-4 text-sky-400" />,
      routeTab: 'leadership'
    },
    {
      ...CHURCH_ASSETS.ecoleFacade,
      tag: "École Nazareth",
      icon: <GraduationCap className="h-4 w-4 text-emerald-400" />,
      routeTab: 'ministeres'
    },
    {
      ...CHURCH_ASSETS.courPaysage,
      tag: "Cour & Paysage",
      icon: <Trees className="h-4 w-4 text-amber-400" />,
      routeTab: 'contact'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#D4AF37]/15 px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#0F2C59] mb-2">
            <ShieldCheck className="h-3.5 w-3.5 text-[#D4AF37]" />
            Patrimoine & Lieux Vivants
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900">
            Notre Sanctuaire, École & Comité en Images
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mt-1">
            Découvrez l'authenticité de l'Église du Nazaréen de Damé, la direction et la façade de l'École Nazareth, notre cour paysagère et notre sceau officiel.
          </p>
        </div>
        <div className="text-xs text-slate-500 flex items-center gap-1 shrink-0">
          <span>Cliquez sur une image pour l'agrandir</span>
        </div>
      </div>

      {/* Grid of 4 Real Photos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {imagesList.map((item) => (
          <div
            key={item.id}
            onClick={() => setActiveModalImage(item)}
            className="group relative rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer transform hover:-translate-y-1"
          >
            {/* Image Container with Hover Overlay */}
            <div className="relative aspect-4/3 w-full bg-slate-100 overflow-hidden">
              <OfficialPhoto
                src={item.src}
                alt={item.alt}
                fallbackCandidates={item.candidates ? [...item.candidates] : []}
                title={item.title}
                caption={item.caption}
                badge={item.tag}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 select-none"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent opacity-80 group-hover:opacity-90 transition-opacity pointer-events-none" />

              {/* Tag Badge */}
              <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded-full bg-[#081B36]/85 backdrop-blur-md px-2.5 py-1 text-[11px] font-bold text-white border border-white/20 shadow">
                {item.icon}
                <span>{item.tag}</span>
              </div>

              {/* Zoom Trigger Button */}
              <div className="absolute top-3 right-3 h-8 w-8 rounded-full bg-black/50 backdrop-blur-sm text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-[#D4AF37] hover:text-[#0F2C59]">
                <Maximize2 className="h-4 w-4" />
              </div>

              {/* Bottom Inset Location */}
              <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-white text-[11px]">
                <span className="inline-flex items-center gap-1 text-slate-200 truncate">
                  <MapPin className="h-3 w-3 text-[#D4AF37] shrink-0" />
                  {item.location}
                </span>
                <span className="text-[#D4AF37] font-semibold text-[10px] uppercase">Agrandir</span>
              </div>
            </div>

            {/* Info Card Body */}
            <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
              <div>
                <h3 className="text-sm font-bold font-display text-slate-900 group-hover:text-[#0F2C59] transition-colors leading-tight">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                  {item.caption}
                </p>
              </div>

              {onNavigateToTab && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onNavigateToTab(item.routeTab);
                  }}
                  className="pt-2 text-[11px] font-semibold text-[#0F2C59] hover:text-[#D4AF37] inline-flex items-center gap-1 border-t border-slate-100 mt-1"
                >
                  Voir dans la section
                  <ChevronRight className="h-3 w-3" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      <ImageModal
        image={activeModalImage}
        onClose={() => setActiveModalImage(null)}
      />
    </div>
  );
};
