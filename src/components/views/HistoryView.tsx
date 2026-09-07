import React, { useState } from 'react';
import { PageTab } from '../../types';
import { CHURCH_INFO, CHURCH_TIMELINE } from '../../data/churchData';
import { 
  Sparkles, 
  Calendar, 
  Flame, 
  BookOpen, 
  Users, 
  Award, 
  HeartHandshake, 
  GraduationCap, 
  CheckCircle,
  ArrowRight,
  Clock,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

interface HistoryViewProps {
  onNavigate?: (tab: PageTab) => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({ onNavigate }) => {
  const [selectedYear, setSelectedYear] = useState<number>(1979);

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
      <section className="bg-gradient-to-b from-[#081B36] to-[#0F2C59] text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center max-w-3xl space-y-4">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#D4AF37]/20 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#D4AF37]">
            <Clock className="h-4 w-4" />
            Héritage & Mémoire (1979 — 2026)
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-display">
            Histoire de l'Église de Damé
          </h1>
          <p className="text-sm sm:text-base text-slate-200 leading-relaxed max-w-2xl mx-auto">
            Plus de quatre décennies de fidélité divine, d'implantation évangélique et de service envers la population de Damé et du Bas Nord-Ouest d'Haïti.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => onNavigate?.('leadership')}
              className="inline-flex items-center gap-2 rounded-xl bg-[#D4AF37] px-5 py-2.5 text-xs sm:text-sm font-bold text-[#0F2C59] hover:bg-[#B38E22] transition-colors shadow-md"
            >
              <Users className="h-4 w-4" />
              Voir le Conseil et les Pasteurs
            </button>
            <button
              onClick={() => onNavigate?.('galerie')}
              className="inline-flex items-center gap-2 rounded-xl bg-white/10 hover:bg-white/20 text-white px-5 py-2.5 text-xs sm:text-sm font-semibold transition-colors border border-white/20"
            >
              <Sparkles className="h-4 w-4 text-[#D4AF37]" />
              Explorer la Galerie Patrimoine
            </button>
          </div>
        </div>
      </section>

      {/* Récit Fondateur : Saurel Alciné */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-5">
            <span className="text-xs uppercase tracking-widest text-[#0F2C59] font-bold bg-[#0F2C59]/10 px-3 py-1 rounded-full">
              Les Origines
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-display text-[#0F2C59]">
              Le 23 Décembre 1979 : La première flamme à Damé
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              C'est à l'aube de Noël 1979 que le pionnier <strong>Saurel ALCINÉ</strong> planta les premiers jalons spirituels de ce qui allait devenir l'une des communautés évangéliques les plus vibrantes du District Bas Nord-Ouest.
            </p>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              À l'époque, Damé était une section communale isolée, confrontée à d'importants défis matériels, scolaires et sanitaires. Animé par la conviction de la sainteté biblique (« Sainteté à l’Éternel »), le fondateur et les premiers convertis se rassemblèrent sous des abris de fortune pour prier, chanter des cantiques et proclamer la régénération en Christ.
            </p>

            <div className="bg-slate-50 border-l-4 border-[#D4AF37] p-4 rounded-r-xl space-y-2">
              <p className="italic text-xs sm:text-sm text-slate-700">
                « L'Église du Nazaréen à Damé n'est pas née d'une ambition humaine, mais d'une soif de voir Dieu sanctifier des cœurs et relever une communauté rurale par l'Évangile et l'instruction. »
              </p>
              <p className="text-xs font-bold text-[#0F2C59]">
                — Archives et Mémoire de l'Église
              </p>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="rounded-3xl bg-gradient-to-br from-[#081B36] to-[#0F2C59] text-white p-7 shadow-xl border border-[#D4AF37]/30 space-y-5">
              <div className="flex items-center gap-3 border-b border-white/15 pb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#D4AF37] text-[#0F2C59] shadow font-bold">
                  <Flame className="h-6 w-6" />
                </div>
                <div>
                  <span className="text-xs uppercase tracking-wider text-[#D4AF37] font-bold">Fiche Historique</span>
                  <h4 className="text-base font-bold font-display">Repères Clés</h4>
                </div>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between py-1.5 border-b border-white/10">
                  <span className="text-slate-300">Date de fondation</span>
                  <span className="font-bold text-[#D4AF37]">23 Décembre 1979</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-white/10">
                  <span className="text-slate-300">Père fondateur</span>
                  <span className="font-bold text-white">Saurel ALCINÉ</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-white/10">
                  <span className="text-slate-300">Localisation d'origine</span>
                  <span className="font-bold text-white">3ème Section Damé</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-white/10">
                  <span className="text-slate-300">District de rattachement</span>
                  <span className="font-bold text-white">District Bas Nord-Ouest</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-white/10">
                  <span className="text-slate-300">Développement scolaire</span>
                  <span className="font-bold text-white">École Nazareth (1985)</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-white/10">
                  <span className="text-slate-300">Formation professionnelle</span>
                  <span className="font-bold text-white">EPND (2022)</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-slate-300">Effectif actuel</span>
                  <span className="font-bold text-[#D4AF37]">{CHURCH_INFO.membership}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Chronologie Interactive Détaillée (Timeline 1979 - 2026) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs uppercase tracking-widest text-[#0F2C59] font-bold bg-[#0F2C59]/10 px-3 py-1 rounded-full">
            Chronologie Officielle
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold font-display text-[#0F2C59] mt-3">
            Les Grandes Étapes de Notre Histoire
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-2">
            Cliquez sur les différentes années pour explorer les tournants majeurs de l'assemblée.
          </p>
        </div>

        {/* Timeline Year Buttons */}
        <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-4 custom-scrollbar">
          {CHURCH_TIMELINE.map((item) => (
            <button
              key={item.year}
              onClick={() => setSelectedYear(item.year)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold shrink-0 transition-all ${
                selectedYear === item.year
                  ? 'bg-[#0F2C59] text-[#D4AF37] shadow-lg ring-2 ring-[#D4AF37]'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {item.year}
            </button>
          ))}
        </div>

        {/* Active Timeline Item Card */}
        <div className="mt-8 max-w-3xl mx-auto bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-lg">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#0F2C59] text-[#D4AF37] shadow-md">
              {getIcon(activeEvent.iconName)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl sm:text-2xl font-bold font-display text-[#0F2C59]">
                  {activeEvent.year}
                </span>
                {activeEvent.badge && (
                  <span className="rounded-full bg-[#D4AF37]/20 px-2.5 py-0.5 text-[10px] font-bold uppercase text-[#0F2C59]">
                    {activeEvent.badge}
                  </span>
                )}
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-800 font-display">
                {activeEvent.title}
              </h3>
            </div>
          </div>

          {activeEvent.subtitle && (
            <p className="text-xs font-semibold text-[#D4AF37] mb-3">
              {activeEvent.subtitle}
            </p>
          )}

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {activeEvent.description}
          </p>
        </div>
      </section>

      {/* L'Ère du Pasteur Bequel CHERELUS (2003 à aujourd'hui) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-slate-50 border border-slate-200 p-8 sm:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <span className="text-xs uppercase tracking-wider font-bold text-[#D4AF37] bg-[#0F2C59] px-3 py-1 rounded-full">
                Pastorat Actuel
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold font-display text-[#0F2C59]">
                Une ère de maturité spirituelle et d'impact social
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Depuis son installation en 2003, le <strong>Pasteur Bequel CHERELUS</strong> a conduit l'assemblée dans une phase de croissance et de structuration inédite.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="flex items-start gap-2.5">
                  <CheckCircle className="h-4 w-4 text-[#D4AF37] shrink-0 mt-0.5" />
                  <span className="text-xs text-slate-700">Multiplication des membres (passant à 500 - 700 fidèles réguliers)</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle className="h-4 w-4 text-[#D4AF37] shrink-0 mt-0.5" />
                  <span className="text-xs text-slate-700">Création de l'École Professionnelle EPND en 2022</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle className="h-4 w-4 text-[#D4AF37] shrink-0 mt-0.5" />
                  <span className="text-xs text-slate-700">Partenariat avec Compassion International (CDEJ) en 2019 pour 250+ enfants</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle className="h-4 w-4 text-[#D4AF37] shrink-0 mt-0.5" />
                  <span className="text-xs text-slate-700">Projet caprin et développement d'élevage avec la Fondation Digicel en 2026</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col items-center justify-center p-6 bg-white rounded-2xl border border-slate-200 shadow-sm text-center">
              <div className="h-20 w-20 rounded-full bg-[#0F2C59] text-[#D4AF37] flex items-center justify-center mb-3 shadow">
                <Award className="h-10 w-10" />
              </div>
              <h4 className="text-base font-bold font-display text-[#0F2C59]">Pasteur Bequel CHERELUS</h4>
              <span className="text-xs text-slate-500 font-semibold">Pasteur Principal de l'Assemblée</span>
              <p className="text-[11px] text-slate-400 mt-1">Au service de Damé depuis plus de 20 ans</p>
              <button
                onClick={() => onNavigate?.('leadership')}
                className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-[#0F2C59] hover:text-[#D4AF37] transition-colors"
              >
                Voir les membres du conseil <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
