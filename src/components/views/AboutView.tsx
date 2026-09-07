import React, { useState } from 'react';
import { PageTab } from '../../types';
import { CHURCH_INFO, ARTICLES_OF_FAITH } from '../../data/churchData';
import { CHURCH_ASSETS } from '../../data/churchMedia';
import { ImageModal } from '../ImageModal';
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
  Maximize2
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
  const [modalSealOpen, setModalSealOpen] = useState(false);
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
            L'Église du Nazaréen de Damé est une communauté chrétienne évangélique dédiée à la proclamation de la sainteté biblique, à l'édification spirituelle et au service fraternel dans le District Bas Nord-Ouest d'Haïti.
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

      {/* Sceau & Identité Institutionnelle */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border-2 border-[#D4AF37]/40 bg-white p-6 sm:p-10 shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Logo Seal */}
            <div className="lg:col-span-4 flex flex-col items-center text-center">
              <div 
                className="relative h-44 w-44 rounded-3xl bg-[#081B36] p-4 border-4 border-[#D4AF37] shadow-2xl group cursor-pointer overflow-hidden flex items-center justify-center transition-transform hover:scale-105"
                onClick={() => setModalSealOpen(true)}
              >
                <img 
                  src="/images/logo.svg" 
                  alt="Sceau Église du Nazaréen de Damé" 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-semibold gap-1">
                  <Maximize2 className="h-4 w-4 text-[#D4AF37]" />
                  Agrandir le Sceau
                </div>
              </div>
              <span className="mt-4 text-xs font-bold uppercase tracking-widest text-[#0F2C59]">
                Sceau Officiel d'Identification
              </span>
              <p className="text-xs text-slate-500 max-w-xs mt-1">
                Devise séculaire gravée : « Sainteté à l’Éternel »
              </p>
            </div>

            {/* Identity details */}
            <div className="lg:col-span-8 space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#D4AF37] bg-[#0F2C59] px-3 py-1 rounded-full">
                Appartenance & Structure
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold font-display text-[#0F2C59]">
                Une Église enracinée dans la foi nazaréenne mondiale
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                L'Église de Damé est membre à part entière de la dénomination mondiale de l'<strong>Église du Nazaréen</strong> (siège mondial à Lenexa, Kansas, USA et Région Méso-Amérique / Caraïbes). Au niveau national, elle est rattachée au <strong>District Bas Nord-Ouest d'Haïti</strong>.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3">
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                  <span className="text-xs text-slate-400 font-bold block uppercase">Caractère 1</span>
                  <h4 className="text-sm font-bold text-[#0F2C59] mt-0.5">Chrétiens</h4>
                  <p className="text-xs text-slate-600 mt-1">Confession historique trinitaire et confession universelle du Christ ressuscité.</p>
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                  <span className="text-xs text-slate-400 font-bold block uppercase">Caractère 2</span>
                  <h4 className="text-sm font-bold text-[#0F2C59] mt-0.5">Évangéliques</h4>
                  <p className="text-xs text-slate-600 mt-1">Autorité suprême de la Bible et impératif de la proclamation du salut par la foi.</p>
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                  <span className="text-xs text-slate-400 font-bold block uppercase">Caractère 3</span>
                  <h4 className="text-sm font-bold text-[#0F2C59] mt-0.5">Sainteté</h4>
                  <p className="text-xs text-slate-600 mt-1">Doctrine wesleyenne de l'entière sanctification et du parfait amour purifiant le cœur.</p>
                </div>
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
                Faire des disciples à l'image du Christ dans la 3ème Section Damé et le District Bas Nord-Ouest, en proclamant l'Évangile intégral qui transforme les cœurs, restaure les familles et élève la communauté par la sanctification.
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

      {/* Modal Seal Zoom */}
      <ImageModal
        isOpen={modalSealOpen}
        onClose={() => setModalSealOpen(false)}
        image={{
          src: '/images/logo.svg',
          alt: 'Sceau Officiel Église du Nazaréen de Damé',
          title: 'Sceau Officiel de l\'Église du Nazaréen de Damé',
          caption: 'Emblème officiel de l\'assemblée représentant la croix, le livre ouvert de la Parole, et la devise « Sainteté à l’Éternel » dans le District Bas Nord-Ouest d\'Haïti.'
        }}
      />
    </div>
  );
};
