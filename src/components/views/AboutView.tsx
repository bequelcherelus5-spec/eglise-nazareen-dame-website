import React, { useState } from 'react';
import { PageTab } from '../../types';
import { CHURCH_INFO, ARTICLES_OF_FAITH } from '../../data/churchData';
import { CHURCH_ASSETS } from '../../data/churchMedia';
import { 
  Sparkles, 
  Compass, 
  Shield, 
  CheckCircle, 
  BookOpen, 
  Heart, 
  Users, 
  ShieldCheck, 
  ArrowRight,
  Globe2,
  Church
} from 'lucide-react';

interface AboutViewProps {
  onNavigate?: (tab: PageTab) => void;
  onOpenPrayerModal?: () => void;
  onOpenDonationModal?: () => void;
}

export const AboutView: React.FC<AboutViewProps> = ({
  onNavigate,
  onOpenPrayerModal,
  onOpenDonationModal
}) => {
  const [activeArticleIndex, setActiveArticleIndex] = useState<number>(0);

  return (
    <div className="space-y-16 pb-16">
      {/* Page Header */}
      <section className="bg-gradient-to-b from-[#081B36] to-[#0F2C59] text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center max-w-3xl space-y-4">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#D4AF37]/20 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#D4AF37]">
            <Sparkles className="h-4 w-4" />
            Identité, Vision & Doctrine
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-display">
            À Propos de Notre Église
          </h1>
          <p className="text-sm sm:text-base text-slate-200 leading-relaxed max-w-2xl mx-auto">
            L'Église du Nazaréen de Damé est une communauté chrétienne évangélique dédiée à la proclamation de la sainteté biblique, à l'édification spirituelle et au service fraternel dans la région de Damé (Môle-Saint-Nicolas, Haïti).
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => onNavigate?.('histoire')}
              className="inline-flex items-center gap-2 rounded-xl bg-[#D4AF37] px-5 py-2.5 text-xs sm:text-sm font-bold text-[#0F2C59] hover:bg-[#B38E22] transition-colors shadow-md"
            >
              <BookOpen className="h-4 w-4" />
              Consulter Notre Histoire (1979 - 2026)
            </button>
            <button
              onClick={() => onNavigate?.('leadership')}
              className="inline-flex items-center gap-2 rounded-xl bg-white/10 hover:bg-white/20 text-white px-5 py-2.5 text-xs sm:text-sm font-semibold transition-colors border border-white/20"
            >
              <Users className="h-4 w-4 text-[#D4AF37]" />
              Découvrir le Conseil Pastoral
            </button>
          </div>
        </div>
      </section>

      {/* Identité Institutionnelle & Enracinement (Sans sceau) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border-2 border-[#D4AF37]/40 bg-white p-6 sm:p-10 shadow-xl">
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-5">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-2xl bg-[#0F2C59] text-[#D4AF37] flex items-center justify-center shadow-md">
                  <Church className="h-6 w-6" />
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#D4AF37] bg-[#0F2C59] px-3 py-1 rounded-full">
                    Appartenance & Structure Mondiale
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-bold font-display text-[#0F2C59] mt-1">
                    Une Église enracinée dans la foi nazaréenne universelle
                  </h2>
                </div>
              </div>
              <div className="hidden sm:flex items-center gap-2 rounded-full bg-amber-50 border border-amber-200/80 px-4 py-1.5 text-xs font-semibold text-amber-900">
                <Globe2 className="h-4 w-4 text-[#D4AF37]" />
                <span>Région Méso-Amérique & Caraïbes</span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed max-w-4xl">
              L'Église du Nazaréen de Damé est membre à part entière de la communion mondiale de l'<strong>Église du Nazaréen</strong> (siège mondial à Lenexa, Kansas, USA). Fondée sur la 3ème Section Rurale de Môle-Saint-Nicolas, elle unit fidélité biblique, engagement diaconal pour l'éducation des enfants à travers l'École Nazareth, formation professionnelle avec l'EPND et ferveur de sanctification.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-2">
              <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 hover:shadow-md transition-shadow">
                <span className="text-[11px] text-[#D4AF37] font-black uppercase tracking-wider block">Pilier 1</span>
                <h4 className="text-base font-bold text-[#0F2C59] mt-1">Chrétiens</h4>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Confession historique trinitaire, fidélité aux credos apostoliques et célébration vivante du Christ Seigneur et Sauveur.
                </p>
              </div>
              <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 hover:shadow-md transition-shadow">
                <span className="text-[11px] text-[#D4AF37] font-black uppercase tracking-wider block">Pilier 2</span>
                <h4 className="text-base font-bold text-[#0F2C59] mt-1">Évangéliques</h4>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Autorité plénière de la Bible comme règle de foi et pratique, et mandat impératif d'évangélisation envers toute créature.
                </p>
              </div>
              <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 hover:shadow-md transition-shadow">
                <span className="text-[11px] text-[#D4AF37] font-black uppercase tracking-wider block">Pilier 3</span>
                <h4 className="text-base font-bold text-[#0F2C59] mt-1">Sainteté</h4>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Doctrine wesleyenne de l'entière sanctification : la grâce de Dieu purifie le cœur et le remplit de parfait amour pour Dieu et le prochain.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission, Vision, Valeurs */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs uppercase tracking-widest text-[#0F2C59] font-bold bg-[#0F2C59]/10 px-3 py-1 rounded-full">
            Piliers Stratégiques
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold font-display text-[#0F2C59] mt-3">
            Mission, Vision & Valeurs
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-2">
            Notre cap spirituel et notre boussole pour impacter Damé, le Môle et Haïti.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Mission */}
          <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#0F2C59] text-[#D4AF37] mb-4 shadow">
                <Compass className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold font-display text-[#0F2C59] mb-2">Notre Mission</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Faire des disciples à l'image du Christ dans la 3ème Section Damé et ses environs, en proclamant l'Évangile intégral qui transforme les cœurs, restaure les familles et élève la communauté par la sanctification.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs font-semibold text-[#0F2C59]">
              <CheckCircle className="h-4 w-4 text-[#D4AF37]" />
              Matthieu 28:19-20
            </div>
          </div>

          {/* Vision */}
          <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#D4AF37] text-[#0F2C59] mb-4 shadow">
                <Sparkles className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold font-display text-[#0F2C59] mb-2">Notre Vision</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Être une église sainte, dynamique et solidaire, modèle d'excellence spirituelle et de développement humain durable à travers l'éducation chrétienne (EPND & École Nazareth), le soutien aux enfants démunis (CDEJ) et l'autonomie communautaire.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs font-semibold text-[#0F2C59]">
              <CheckCircle className="h-4 w-4 text-[#D4AF37]" />
              Éphésiens 4:11-16
            </div>
          </div>

          {/* Valeurs */}
          <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#5C4033] text-white mb-4 shadow">
                <Shield className="h-6 w-6 text-[#D4AF37]" />
              </div>
              <h3 className="text-lg font-bold font-display text-[#0F2C59] mb-2">Nos Valeurs Clés</h3>
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
                  <span><strong>Amour fraternel & Entraide sociale</strong></span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-[#D4AF37] shrink-0" />
                  <span><strong>Excellence et intégrité morale</strong></span>
                </li>
              </ul>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs font-semibold text-[#0F2C59]">
              <CheckCircle className="h-4 w-4 text-[#D4AF37]" />
              1 Pierre 1:15-16
            </div>
          </div>
        </div>
      </section>

      {/* Confession de Foi : 16 Articles de Foi */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-[#081B36] text-white p-8 sm:p-12 shadow-xl border border-slate-800">
          <div className="max-w-3xl mb-8">
            <span className="text-xs uppercase tracking-widest text-[#D4AF37] font-bold">
              Doctrine & Fondements
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-display mt-2">
              Articles Fondamentaux de la Foi Nazaréenne
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-2">
              La confession théologique de notre foi, centrée sur la grâce de Dieu et l'entière sanctification.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Article selector list */}
            <div className="lg:col-span-5 space-y-1.5 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
              {ARTICLES_OF_FAITH.map((art, idx) => (
                <button
                  key={art.num}
                  onClick={() => setActiveArticleIndex(idx)}
                  className={`w-full text-left p-3 rounded-xl text-xs font-semibold transition-all flex items-center justify-between ${
                    activeArticleIndex === idx
                      ? 'bg-[#D4AF37] text-[#0F2C59] font-bold shadow-md'
                      : 'bg-white/5 hover:bg-white/10 text-slate-300'
                  }`}
                >
                  <span className="truncate mr-2">
                    {art.num}. {art.title}
                  </span>
                  <span className="text-[10px] shrink-0 opacity-80 font-mono">
                    Art. {art.num}
                  </span>
                </button>
              ))}
            </div>

            {/* Article detailed preview */}
            <div className="lg:col-span-7 bg-white/10 backdrop-blur-md rounded-2xl p-6 sm:p-8 border border-white/15 flex flex-col justify-between">
              {(() => {
                const current = ARTICLES_OF_FAITH[activeArticleIndex] || ARTICLES_OF_FAITH[0];
                return (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-white/15 pb-3">
                      <span className="text-xs font-bold uppercase tracking-widest text-[#D4AF37]">
                        Article {current.num}
                      </span>
                      <span className="text-xs text-slate-300">
                        Confession Nazaréenne
                      </span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold font-display text-white">
                      {current.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-light">
                      {current.desc}
                    </p>
                    <div className="pt-4 border-t border-white/10">
                      <span className="text-xs text-slate-400 font-semibold block mb-1">
                        Fondement doctrinal :
                      </span>
                      <p className="text-xs text-[#D4AF37]">
                        « Sainteté à l’Éternel » • Manuel de l'Église du Nazaréen
                      </p>
                    </div>
                  </div>
                );
              })()}

              <div className="pt-6 mt-6 border-t border-white/10 flex items-center justify-between">
                <button
                  onClick={() => setActiveArticleIndex(prev => Math.max(0, prev - 1))}
                  disabled={activeArticleIndex === 0}
                  className="px-3 py-1.5 rounded-lg bg-white/10 text-xs text-white disabled:opacity-30 hover:bg-white/20 transition-colors"
                >
                  ← Précédent
                </button>
                <span className="text-xs text-slate-400">
                  {activeArticleIndex + 1} sur {ARTICLES_OF_FAITH.length}
                </span>
                <button
                  onClick={() => setActiveArticleIndex(prev => Math.min(ARTICLES_OF_FAITH.length - 1, prev + 1))}
                  disabled={activeArticleIndex === ARTICLES_OF_FAITH.length - 1}
                  className="px-3 py-1.5 rounded-lg bg-white/10 text-xs text-white disabled:opacity-30 hover:bg-white/20 transition-colors"
                >
                  Suivant →
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
