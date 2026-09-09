import React, { useState } from 'react';
import { PageTab } from '../../types';
import { CHURCH_ASSETS, ChurchRealImage } from '../../data/churchMedia';
import { MEDIA_GALLERY } from '../../data/churchData';
import { ImageModal } from '../ImageModal';
import { OfficialPhoto } from '../OfficialPhoto';
import { 
  Sparkles, 
  Maximize2, 
  MapPin, 
  ShieldCheck, 
  Users, 
  GraduationCap, 
  Trees, 
  Camera, 
  Calendar, 
  Tag
} from 'lucide-react';

interface GalleryViewProps {
  onNavigate?: (tab: PageTab) => void;
}

export const GalleryView: React.FC<GalleryViewProps> = ({ onNavigate }) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [modalImage, setModalImage] = useState<ChurchRealImage | null>(null);

  // Official high quality church photo assets
  const galleryItems = [
    {
      id: 'logo',
      category: 'institution',
      categoryLabel: 'Sceau Officiel',
      asset: CHURCH_ASSETS.logo,
      icon: <Sparkles className="h-4 w-4 text-[#D4AF37]" />,
      badge: "Armoiries Officielles",
      year: "1979",
      caption: "Le sceau officiel gravé de la devise « Sainteté à l’Éternel », de la croix et des Saintes Écritures."
    },
    {
      id: 'comite',
      category: 'direction',
      categoryLabel: 'Direction & Comité',
      asset: CHURCH_ASSETS.comite,
      icon: <Users className="h-4 w-4 text-sky-400" />,
      badge: "Corps Dirigeant",
      year: "2026",
      caption: "Membres du conseil de l'église et corps enseignant de l'école réunis devant l'estrade d'honneur."
    },
    {
      id: 'ecole',
      category: 'education',
      categoryLabel: 'Bâtiments Scolaires',
      asset: CHURCH_ASSETS.ecoleFacade,
      icon: <GraduationCap className="h-4 w-4 text-emerald-400" />,
      badge: "École Fondamentale & EPND",
      year: "1985 / 2022",
      caption: "Bâtiment principal de l'école fondamentale Nazareth et centre de formation professionnelle de Damé."
    },
    {
      id: 'cour',
      category: 'cadre',
      categoryLabel: 'Cour & Cadre de Vie',
      asset: CHURCH_ASSETS.courPaysage,
      icon: <Trees className="h-4 w-4 text-amber-400" />,
      badge: "Cadre Naturel",
      year: "2026",
      caption: "Espace vert, cour de récréation et environnement serein entourant l'enceinte de l'Église à la 3ème Section."
    },
    {
      id: 'culte-1',
      category: 'culte',
      categoryLabel: 'Cultes & Célébrations',
      asset: {
        src: "/images/culte_adoration.jpg",
        alt: "Culte d'adoration dominicale à Damé",
        title: "Assemblée des Fidèles en Adoration",
        caption: "Moment de louange, de chant collectif et d'élévation spirituelle lors du culte dominical du matin.",
        candidates: ["/images/culte_adoration.jpg"]
      },
      icon: <Sparkles className="h-4 w-4 text-[#D4AF37]" />,
      badge: "Culte Dominical",
      year: "2026",
      caption: "Moment de louange, de chant collectif et d'élévation spirituelle lors du culte dominical du matin."
    }
  ];

  const categories = [
    { id: 'all', label: 'Toutes les Photos' },
    { id: 'institution', label: 'Sceau & Identité' },
    { id: 'direction', label: 'Direction & Comité' },
    { id: 'education', label: 'École Nazareth & EPND' },
    { id: 'cadre', label: 'Cour & Environnement' },
    { id: 'culte', label: 'Cultes & Adoration' }
  ];

  const filteredItems = activeCategory === 'all' 
    ? galleryItems 
    : galleryItems.filter(item => item.category === activeCategory);

  return (
    <div className="space-y-16 pb-16">
      {/* Header */}
      <section className="bg-gradient-to-b from-[#081B36] to-[#0F2C59] text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center max-w-3xl space-y-4">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#D4AF37]/20 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#D4AF37]">
            <Camera className="h-4 w-4" />
            Patrimoine Visuel & Archives Vivantes
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-display">
            Galerie de l'Église de Damé
          </h1>
          <p className="text-sm sm:text-base text-slate-200 leading-relaxed max-w-2xl mx-auto">
            Plongez dans le quotidien de notre communauté de foi : notre sanctuaire, nos pasteurs et dirigeants, notre école et notre cadre de vie à Môle-Saint-Nicolas.
          </p>
        </div>
      </section>

      {/* Categories Filter */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-4 custom-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                activeCategory === cat.id
                  ? 'bg-[#0F2C59] text-[#D4AF37] shadow-md ring-2 ring-[#D4AF37]'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setModalImage(item.asset)}
              className="group rounded-3xl border border-slate-200 bg-white overflow-hidden shadow-sm hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-16/10 bg-slate-900 overflow-hidden">
                  <OfficialPhoto
                    src={item.asset.src}
                    alt={item.asset.alt}
                    fallbackCandidates={item.asset.candidates ? [...item.asset.candidates] : []}
                    title={item.asset.title}
                    caption={item.asset.caption}
                    aspectRatioClass="aspect-16/10"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
                  
                  {/* Category badge */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded-full bg-[#081B36]/90 backdrop-blur-md px-3 py-1 text-[11px] font-bold text-[#D4AF37] border border-[#D4AF37]/40 shadow">
                    {item.icon}
                    <span>{item.categoryLabel}</span>
                  </div>

                  {/* Zoom button */}
                  <div className="absolute top-3 right-3 h-8 w-8 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[#D4AF37] hover:text-[#0F2C59]">
                    <Maximize2 className="h-4 w-4" />
                  </div>

                  {/* Year tag */}
                  <div className="absolute bottom-3 left-3 text-[10px] text-slate-300 font-mono">
                    Damé • {item.year}
                  </div>
                </div>

                <div className="p-6 space-y-2">
                  <span className="text-[10px] uppercase tracking-wider font-bold text-[#D4AF37] bg-[#0F2C59] px-2.5 py-0.5 rounded-md">
                    {item.badge}
                  </span>
                  <h3 className="text-base font-bold font-display text-slate-900 group-hover:text-[#0F2C59] transition-colors">
                    {item.asset.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                    {item.caption}
                  </p>
                </div>
              </div>

              <div className="p-6 pt-0 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#0F2C59] group-hover:text-[#D4AF37] transition-colors">
                <span>Agrandir en haute résolution</span>
                <Maximize2 className="h-4 w-4" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Modal Zoom */}
      <ImageModal
        isOpen={!!modalImage}
        onClose={() => setModalImage(null)}
        image={modalImage || undefined}
      />
    </div>
  );
};
