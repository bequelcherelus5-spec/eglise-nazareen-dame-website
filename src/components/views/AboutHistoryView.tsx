import React, { useState } from 'react';
import { CHURCH_INFO, CHURCH_TIMELINE, ARTICLES_OF_FAITH } from '../../data/churchData';
import { CHURCH_ASSETS } from '../../data/churchMedia';
import { ImageModal } from '../ImageModal';
import { 
  Sparkles, 
  Calendar, 
  Flame, 
  BookOpen, 
  Users, 
  Award, 
  HeartHandshake, 
  GraduationCap, 
  Shield, 
  CheckCircle,
  Clock,
  Compass,
  Maximize2,
  ShieldCheck
} from 'lucide-react';

export const AboutHistoryView: React.FC = () => {
  const [selectedYear, setSelectedYear] = useState<number>(1979);
  const [modalSealOpen, setModalSealOpen] = useState<boolean>(false);

  const activeEvent = CHURCH_TIMELINE.find((e) => e.year === selectedYear) || CHURCH_TIMELINE[0];

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Flame': return <Flame className="h-5 w-5" />;
      case 'BookOpen': return <BookOpen className="h-5 w-5" />;
      case 'Users': return <Users className="h-5 w-5" />;
      case 'Award': return <Award className="h-5 w-5" />;
      case 'HeartHandshake': return <HeartHandshake className="h-5 w-5" />;
      case 'GraduationCap': return <GraduationCap className="h-5 w-5" />;
      case 'Sparkles': return <Sparkles className="h-5 w-5" />;
      default: return <Calendar className="h-5 w-5" />;
    }
  };

  return (
    <div className="space-y-16 pb-16">
      {/* Page Header */}
      <section className="bg-[#0F2C59] text-white py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center max-w-3xl">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#D4AF37]/20 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#D4AF37] mb-3">
            <Sparkles className="h-3.5 w-3.5" />
            Héritage Spirituel & Historique
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-display">
            À Propos de l'Église & Timeline
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-200 leading-relaxed">
            Découvrez les origines, la vision, la doctrine de la sainteté et les jalons historiques qui ont façonné l'Église du Nazaréen de Damé depuis le 23 décembre 1979.
          </p>
        </div>
      </section>

      {/* Mission, Vision, Valeurs */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Mission */}
          <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm hover:shadow-md transition-all">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#0F2C59] text-[#D4AF37] mb-4">
              <Compass className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold font-display text-[#0F2C59] mb-2">Notre Mission</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Faire des disciples à l'image du Christ dans la 3ème Section Damé et ses environs, en proclamant l'Évangile intégral qui transforme les cœurs, restaure les familles et élève la communauté.
            </p>
          </div>

          {/* Vision */}
          <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm hover:shadow-md transition-all">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#D4AF37] text-[#0F2C59] mb-4">
              <Sparkles className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold font-display text-[#0F2C59] mb-2">Notre Vision</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Être une église sainte, dynamique et solidaire, modèle d'excellence spirituelle et de développement humain durable à travers l'éducation (EPND), le soutien aux enfants (CDEJ) et l'autonomie économique.
            </p>
          </div>

          {/* Valeurs */}
          <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm hover:shadow-md transition-all">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#5C4033] text-white mb-4">
              <Shield className="h-6 w-6 text-[#D4AF37]" />
            </div>
            <h3 className="text-lg font-bold font-display text-[#0F2C59] mb-2">Nos Valeurs Fondamentales</h3>
            <ul className="text-xs sm:text-sm text-slate-600 space-y-2">
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-[#D4AF37] shrink-0" />
                <span><strong>Sainteté de cœur et de vie</strong></span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-[#D4AF37] shrink-0" />
                <span><strong>Autorité des Saintes Écritures</strong></span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-[#D4AF37] shrink-0" />
                <span><strong>Amour fraternel & Compassion</strong></span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-[#D4AF37] shrink-0" />
                <span><strong>Service communautaire dévoué</strong></span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Sceau Officiel et Symbolique Sacrée */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border-2 border-[#D4AF37]/30 bg-gradient-to-br from-[#081B36] via-[#0F2C59] to-[#081B36] p-8 sm:p-12 text-white shadow-xl overflow-hidden relative">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            {/* Seal Graphic with zoom click */}
            <div className="lg:col-span-4 flex justify-center">
              <div 
                onClick={() => setModalSealOpen(true)}
                className="group relative cursor-pointer rounded-full p-2 bg-black/40 border-4 border-[#D4AF37] shadow-2xl hover:scale-105 transition-transform duration-300 w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center overflow-hidden"
              >
                <img
                  src={CHURCH_ASSETS.logo.src}
                  alt={CHURCH_ASSETS.logo.alt}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain rounded-full select-none group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                  <div className="h-10 w-10 rounded-full bg-[#D4AF37] text-[#0F2C59] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                    <Maximize2 className="h-5 w-5" />
                  </div>
                </div>
                <div className="absolute bottom-4 inset-x-0 text-center text-[10px] font-bold uppercase tracking-wider text-[#D4AF37] bg-black/75 py-1">
                  Cliquer pour agrandir le sceau
                </div>
              </div>
            </div>

            {/* Seal Symbolic Breakdown */}
            <div className="lg:col-span-8 space-y-5">
              <div className="inline-flex items-center gap-2 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/50 px-3.5 py-1 text-xs font-bold text-[#D4AF37]">
                <ShieldCheck className="h-4 w-4" />
                Emblème & Symbolisme Sacré
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold font-display leading-tight">
                Le Sceau Officiel de l'Église du Nazaréen de Damé
              </h2>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                Le sceau officiel incarne l'héritage de sanctification de l'Église du Nazaréen dans le Bas Nord-Ouest d'Haïti. Il réunit les fondements scripturaires et pneumatologiques qui guident notre assemblée depuis 1979.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl p-4 space-y-1.5">
                  <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider">
                    « Sainteté à l'Éternel »
                  </span>
                  <p className="text-xs text-slate-300">
                    La grande devise biblique (Exode 28:36, Zacharie 14:20), pierre angulaire du mouvement de sanctification wesleyen.
                  </p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl p-4 space-y-1.5">
                  <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider">
                    La Colombe & la Flamme
                  </span>
                  <p className="text-xs text-slate-300">
                    Symbole du baptême et de l'effusion du Saint-Esprit qui purifie, illumine et sanctifie chaque croyant.
                  </p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl p-4 space-y-1.5">
                  <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider">
                    La Bible Ouverte
                  </span>
                  <p className="text-xs text-slate-300">
                    L'autorité souveraine des Saintes Écritures, règle suprême de foi, de doctrine et de vie pratique.
                  </p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl p-4 space-y-1.5">
                  <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider">
                    Couleurs Royales & Célestes
                  </span>
                  <p className="text-xs text-slate-300">
                    L'Or (gloire divine et pureté de foi), le Bleu Nuit (loyauté et ciel) et le Noir (contraste et solennité institutionnelle).
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Timeline Section */}
      <section className="bg-slate-50 py-16 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs uppercase tracking-widest text-[#0F2C59] font-bold bg-white px-3 py-1 rounded-full border border-slate-200 shadow-sm">
              1979 - 2026
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-display text-[#0F2C59] mt-3">
              Timeline Historique Interactive
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-2">
              Cliquez sur chaque date charnière pour afficher les détails du parcours de l'assemblée.
            </p>
          </div>

          {/* Timeline Year Selectors Bar */}
          <div className="flex items-center justify-start sm:justify-center overflow-x-auto gap-3 pb-4 mb-8">
            {CHURCH_TIMELINE.map((event) => {
              const isSelected = selectedYear === event.year;
              return (
                <button
                  key={event.year}
                  onClick={() => setSelectedYear(event.year)}
                  className={`flex flex-col items-center px-4 py-3 rounded-xl transition-all shrink-0 border ${
                    isSelected
                      ? 'bg-[#0F2C59] text-white border-[#0F2C59] shadow-md scale-105'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <span className="text-xs font-bold">{event.year}</span>
                  <span className={`text-[10px] mt-0.5 ${isSelected ? 'text-[#D4AF37]' : 'text-slate-400'}`}>
                    {event.badge}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Active Milestone Card */}
          <div className="max-w-3xl mx-auto bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-6 mb-6">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#0F2C59] text-[#D4AF37] shadow">
                  {getIcon(activeEvent.iconName)}
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#D4AF37]">
                    Année {activeEvent.year} • {activeEvent.badge}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold font-display text-slate-900 mt-0.5">
                    {activeEvent.title}
                  </h3>
                  {activeEvent.subtitle && (
                    <p className="text-xs font-medium text-slate-500">{activeEvent.subtitle}</p>
                  )}
                </div>
              </div>
              <div className="sm:text-right">
                <span className="inline-block rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                  Étape {CHURCH_TIMELINE.findIndex((e) => e.year === selectedYear) + 1} / {CHURCH_TIMELINE.length}
                </span>
              </div>
            </div>

            <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
              {activeEvent.description}
            </p>

            {/* Stepper Navigation */}
            <div className="flex items-center justify-between pt-6 mt-6 border-t border-slate-100">
              <button
                disabled={selectedYear === 1979}
                onClick={() => {
                  const idx = CHURCH_TIMELINE.findIndex((e) => e.year === selectedYear);
                  if (idx > 0) setSelectedYear(CHURCH_TIMELINE[idx - 1].year);
                }}
                className="text-xs font-semibold text-[#0F2C59] disabled:text-slate-300 hover:underline"
              >
                ← Étape précédente
              </button>
              <button
                disabled={selectedYear === 2026}
                onClick={() => {
                  const idx = CHURCH_TIMELINE.findIndex((e) => e.year === selectedYear);
                  if (idx < CHURCH_TIMELINE.length - 1) setSelectedYear(CHURCH_TIMELINE[idx + 1].year);
                }}
                className="text-xs font-semibold text-[#0F2C59] disabled:text-slate-300 hover:underline"
              >
                Étape suivante →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Confession de Foi Nazaréenne */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs uppercase tracking-widest text-[#0F2C59] font-bold bg-[#0F2C59]/10 px-3 py-1 rounded-full">
            Théologie Nazaréenne
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold font-display text-[#0F2C59] mt-3">
            Articles Fondamentaux de la Foi
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-2">
            Les vérités bibliques inébranlables professées par notre assemblée, ancrées dans la tradition wesleyenne de la sanctification.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ARTICLES_OF_FAITH.map((article) => (
            <div
              key={article.num}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:border-[#D4AF37] transition-colors space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0F2C59] text-xs font-bold text-[#D4AF37]">
                  {article.num}
                </span>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  Article de Foi
                </span>
              </div>
              <h3 className="text-base font-bold font-display text-slate-900">
                {article.title}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {article.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Lightbox Modal */}
      <ImageModal
        image={modalSealOpen ? CHURCH_ASSETS.logo : null}
        onClose={() => setModalSealOpen(false)}
      />
    </div>
  );
};
