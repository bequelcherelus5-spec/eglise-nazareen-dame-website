import React from 'react';
import { PageTab } from '../../types';
import { CHURCH_INFO, CHURCH_TIMELINE, NEWS_ARTICLES, SOCIAL_PROJECTS } from '../../data/churchData';
import { ChurchPhotoGallery } from '../ChurchPhotoGallery';
import { CHURCH_ASSETS } from '../../data/churchMedia';
import heroLogoImg from '../../assets/images/regenerated_image_1788797096407.jpg';
import { 
  Sparkles, 
  Clock, 
  Calendar, 
  Heart, 
  Gift, 
  BookOpen, 
  Gamepad2, 
  GraduationCap, 
  Users, 
  ArrowRight, 
  ChevronRight,
  ShieldAlert,
  Flame,
  ShieldCheck
} from 'lucide-react';

interface HomeViewProps {
  onNavigate: (tab: PageTab, payload?: any) => void;
  onOpenPrayerModal: () => void;
  onOpenDonationModal: () => void;
  onOpenEpndModal?: (courseId?: string) => void;
  onSelectArticle?: (articleId: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onNavigate,
  onOpenPrayerModal,
  onOpenDonationModal,
  onOpenEpndModal,
  onSelectArticle
}) => {
  const onSelectTab = (tab: PageTab) => onNavigate(tab);
  const handleArticleClick = (articleId: string) => {
    if (onSelectArticle) {
      onSelectArticle(articleId);
    } else {
      onNavigate('actualites', { articleId });
    }
  };
  return (
    <div className="space-y-16 pb-12">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#081B36] via-[#0F2C59] to-[#173B75] text-white pt-12 pb-20 lg:py-24">
        {/* Subtle decorative background elements */}
        <div className="absolute inset-0 opacity-15 pointer-events-none">
          <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-[#D4AF37] blur-3xl" />
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-[#1E4682] blur-3xl" />
          <div className="absolute inset-0 bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:24px_24px] opacity-20" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-8 space-y-6">
              {/* Badge Devise */}
              <div className="inline-flex items-center gap-2 rounded-full bg-[#D4AF37]/15 px-4 py-1.5 border border-[#D4AF37]/30 text-[#D4AF37] text-xs sm:text-sm font-semibold tracking-wider uppercase">
                <Sparkles className="h-4 w-4" />
                Devise officielle : {CHURCH_INFO.motto}
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold font-display tracking-tight text-white leading-tight">
                ÉGLISE DU NAZARÉEN <br />
                <span className="text-[#D4AF37] drop-shadow-sm">DE DAMÉ</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-200 max-w-2xl leading-relaxed font-light">
                Bienvenue sur la plateforme officielle de notre communauté de foi à Damé (Môle-Saint-Nicolas, Haïti). Depuis 1979, nous marchons dans la grâce, l'amour du prochain et le témoignage vivant de l'entière sanctification.
              </p>

              {/* Pastoral greeting snippet */}
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 sm:p-5 border border-white/15 max-w-2xl flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#D4AF37] text-[#0F2C59] font-bold shadow-md">
                  <Flame className="h-6 w-6" />
                </div>
                <div className="text-xs sm:text-sm space-y-1">
                  <p className="italic text-slate-100">
                    « Que la paix du Seigneur repose sur votre foyer. Que vous soyez membre de longue date, fils ou fille de Damé dans la diaspora, ou ami découvrant notre communauté, recevez notre chaleureuse bénédiction fraternelle. »
                  </p>
                  <p className="text-[#D4AF37] font-semibold text-xs pt-1">
                    — {CHURCH_INFO.leadPastor}
                  </p>
                </div>
              </div>

              {/* CTAs Rapides */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  id="hero-cta-join-service"
                  onClick={() => {
                    const el = document.getElementById('horaires-services');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#D4AF37] px-6 py-3.5 text-sm font-bold text-[#0F2C59] hover:bg-[#B38E22] transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  <Calendar className="h-4 w-4" />
                  Rejoindre un culte
                </button>

                <button
                  id="hero-cta-history"
                  onClick={() => onSelectTab('a-propos')}
                  className="inline-flex items-center gap-2 rounded-xl bg-white/15 hover:bg-white/25 text-white px-5 py-3.5 text-sm font-semibold backdrop-blur-md transition-all border border-white/20"
                >
                  <BookOpen className="h-4 w-4 text-[#D4AF37]" />
                  Notre Histoire
                </button>

                <button
                  id="hero-cta-prayer"
                  onClick={onOpenPrayerModal}
                  className="inline-flex items-center gap-2 rounded-xl bg-white/15 hover:bg-white/25 text-white px-5 py-3.5 text-sm font-semibold backdrop-blur-md transition-all border border-white/20"
                >
                  <Heart className="h-4 w-4 text-rose-400" />
                  Demander une prière
                </button>

                <button
                  id="hero-cta-donate"
                  onClick={onOpenDonationModal}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#5C4033] hover:bg-[#7A5645] text-white px-5 py-3.5 text-sm font-semibold transition-all shadow-md"
                >
                  <Gift className="h-4 w-4 text-[#D4AF37]" />
                  Faire un don
                </button>
              </div>
            </div>

            {/* Right Card: Quick Identity & Stats with Official Seal */}
            <div className="lg:col-span-4">
              <div className="rounded-2xl bg-white/10 backdrop-blur-lg border border-white/20 p-6 shadow-2xl text-white space-y-5">
                {/* Official Logo Display */}
                <div className="flex items-center gap-4 border-b border-white/15 pb-4">
                  <div className="relative h-16 w-16 shrink-0 rounded-2xl bg-[#081B36] p-1 border-2 border-[#D4AF37] shadow-lg overflow-hidden">
                    <img
                      src={heroLogoImg}
                      alt="Sceau Officiel Église du Nazaréen de Damé"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-contain rounded-xl"
                    />
                  </div>
                  <div>
                    <span className="text-[11px] uppercase tracking-widest text-[#D4AF37] font-bold">
                      Sceau & Identité
                    </span>
                    <h3 className="text-base font-bold font-display leading-snug">
                      « Sainteté à l'Éternel »
                    </h3>
                    <p className="text-[11px] text-slate-300">
                      District Bas Nord-Ouest • Haïti
                    </p>
                  </div>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="flex items-center justify-between py-1.5 border-b border-white/10">
                    <span className="text-slate-300">Fondation</span>
                    <span className="font-semibold text-white">23 Décembre 1979</span>
                  </div>
                  <div className="flex items-center justify-between py-1.5 border-b border-white/10">
                    <span className="text-slate-300">Fondateur</span>
                    <span className="font-semibold text-white">Saurel ALCINÉ</span>
                  </div>
                  <div className="flex items-center justify-between py-1.5 border-b border-white/10">
                    <span className="text-slate-300">Pasteur Principal</span>
                    <span className="font-semibold text-[#D4AF37]">Pasteur Bequel CHERELUS</span>
                  </div>
                  <div className="flex items-center justify-between py-1.5 border-b border-white/10">
                    <span className="text-slate-300">Éducation</span>
                    <span className="font-semibold text-white">École Nazareth & EPND</span>
                  </div>
                  <div className="flex items-center justify-between py-1.5">
                    <span className="text-slate-300">Effectif membre</span>
                    <span className="font-semibold text-white">{CHURCH_INFO.membership}</span>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => onSelectTab('jeux-bibliques')}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#E6C65C] py-3 text-[#0F2C59] font-bold text-xs hover:shadow-lg transition-all"
                  >
                    <Gamepad2 className="h-4 w-4" />
                    Jouer aux Jeux Bibliques
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 1.5 GALERIE PATRIMOINE VIVANT (Photos Authentiques) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ChurchPhotoGallery onNavigateToTab={onSelectTab} />
      </section>

      {/* 2. HORAIRES DES SERVICES & CULTES */}
      <section id="horaires-services" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs uppercase tracking-widest text-[#0F2C59] font-bold bg-[#0F2C59]/10 px-3 py-1 rounded-full">
            Vie d'Église
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold font-display text-[#0F2C59] mt-3">
            Horaires des Services & Célébrations
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-2">
            Rendez-vous dans le sanctuaire à la Rue Cimetière, 3ème Section Damé pour vivre des moments forts de louange et de communion.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CHURCH_INFO.openingHours.map((hour, idx) => (
            <div
              key={idx}
              className={`rounded-2xl border p-6 transition-all hover:shadow-md ${
                idx === 0 
                  ? 'border-[#0F2C59] bg-[#0F2C59]/5 ring-1 ring-[#0F2C59]' 
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#0F2C59]">
                  <Clock className="h-4 w-4 text-[#D4AF37]" />
                  {hour.day}
                </span>
                <span className="rounded-full bg-[#0F2C59] px-2.5 py-0.5 text-xs font-bold text-white">
                  {hour.time}
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900 font-display mb-1.5">
                {hour.title}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {hour.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. APERÇU MINISTÈRES & FORMATION EPND */}
      <section className="bg-slate-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-xs uppercase tracking-widest text-[#0F2C59] font-bold">
                Édification & Métiers
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold font-display text-[#0F2C59] mt-1">
                Ministères & Formation Professionnelle
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl">
                Un engagement holistique : former le cœur par la Parole et les mains par des métiers valorisants.
              </p>
            </div>
            <button
              onClick={() => onSelectTab('ministeres')}
              className="inline-flex items-center gap-2 text-xs font-bold text-[#0F2C59] hover:text-[#1A3D73] self-start md:self-auto"
            >
              Découvrir tous les départements
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: JNI */}
            <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-200 space-y-3 flex flex-col justify-between">
              <div>
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-100 text-amber-800 mb-3">
                  <Users className="h-6 w-6" />
                </div>
                <span className="text-xs text-slate-400 font-semibold uppercase">Département Clé</span>
                <h3 className="text-lg font-bold font-display text-slate-900 mt-0.5">
                  Jeunesse Nazaréenne (JNI)
                </h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Sous la direction de Jimmy CHERELUS. Rassemblements le samedi après-midi, tournois bibliques et formation de la relève de Damé.
                </p>
              </div>
              <button
                onClick={() => onSelectTab('ministeres')}
                className="text-xs font-bold text-[#0F2C59] flex items-center gap-1 hover:underline pt-2"
              >
                En savoir plus <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Card 2: EPND Formation */}
            <div className="rounded-2xl bg-gradient-to-br from-[#0F2C59] to-[#081B36] text-white p-6 shadow-md border border-[#D4AF37]/30 space-y-3 flex flex-col justify-between">
              <div>
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#D4AF37] text-[#0F2C59] mb-3">
                  <GraduationCap className="h-6 w-6" />
                </div>
                <span className="text-xs text-[#D4AF37] font-semibold uppercase">Créée en 2022</span>
                <h3 className="text-lg font-bold font-display text-white mt-0.5">
                  École Professionnelle EPND
                </h3>
                <p className="text-xs text-slate-200 mt-2 leading-relaxed">
                  Formations concrètes : Couture, Maçonnerie parasismique, Musique / Clavier et Anglais professionnel.
                </p>
              </div>
              <button
                onClick={() => onSelectTab('education')}
                className="text-xs font-bold text-[#D4AF37] flex items-center gap-1 hover:underline pt-2"
              >
                Inscriptions & Filières <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Card 3: CDEJ / Compassion & Digicel */}
            <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-200 space-y-3 flex flex-col justify-between">
              <div>
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800 mb-3">
                  <Heart className="h-6 w-6" />
                </div>
                <span className="text-xs text-slate-400 font-semibold uppercase">Impact Communautaire</span>
                <h3 className="text-lg font-bold font-display text-slate-900 mt-0.5">
                  Projets Sociaux & CDEJ
                </h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Partenariat avec Compassion International (2019) pour 250+ enfants, et nouveau projet caprin avec la Fondation Digicel (2026).
                </p>
              </div>
              <button
                onClick={() => onSelectTab('projets')}
                className="text-xs font-bold text-[#0F2C59] flex items-center gap-1 hover:underline pt-2"
              >
                Voir les réalisations <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 4. ACTUALITÉS RÉCENTES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs uppercase tracking-widest text-[#0F2C59] font-bold bg-[#0F2C59]/10 px-3 py-1 rounded-full">
              Actualités & Enseignements
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-display text-[#0F2C59] mt-3">
              Dernières Publications
            </h2>
          </div>
          <button
            onClick={() => onSelectTab('actualites')}
            className="inline-flex items-center gap-2 text-xs font-bold text-[#0F2C59] hover:underline"
          >
            Toutes les publications & Médias
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {NEWS_ARTICLES.slice(0, 3).map((article) => (
            <article
              key={article.id}
              onClick={() => handleArticleClick(article.id)}
              className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                  <img
                    src={article.imageUrl}
                    alt={article.title}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                  <span className="absolute top-3 left-3 rounded-full bg-[#0F2C59] px-2.5 py-1 text-[10px] font-bold uppercase text-white shadow">
                    {article.category}
                  </span>
                </div>
                <div className="p-5 space-y-2">
                  <div className="flex items-center gap-2 text-[11px] text-slate-400">
                    <span>{article.date}</span>
                    <span>•</span>
                    <span>{article.author}</span>
                  </div>
                  <h3 className="text-sm font-bold font-display text-slate-900 group-hover:text-[#0F2C59] transition-colors line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-xs text-slate-600 line-clamp-2">
                    {article.summary}
                  </p>
                </div>
              </div>
              <div className="p-5 pt-0">
                <span className="text-xs font-bold text-[#0F2C59] group-hover:text-[#D4AF37] flex items-center gap-1">
                  Lire l'article complet <ChevronRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* 5. CALLOUT JEUX BIBLIQUES INTERACTIFS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-[#0F2C59] to-[#081B36] p-8 sm:p-12 text-white shadow-xl relative overflow-hidden border border-[#D4AF37]/30">
          <div className="relative z-10 max-w-2xl space-y-4">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#D4AF37]/20 px-3.5 py-1 text-xs font-bold uppercase text-[#D4AF37]">
              <Gamepad2 className="h-4 w-4" />
              Module Interactif Éducatif
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-display leading-tight">
              Testez vos connaissances avec les Jeux Bibliques de Damé
            </h2>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
              Quiz, Trouver le verset, Qui suis-je ?, Compléter le texte, Vrai/Faux et Défi Mémoire. Jouez en solo ou rassemblez jusqu'à 10 joueurs pour une compétition amicale avec classement en temps réel !
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={() => onSelectTab('jeux-bibliques')}
                className="inline-flex items-center gap-2 rounded-xl bg-[#D4AF37] px-6 py-3 text-xs sm:text-sm font-bold text-[#0F2C59] hover:bg-[#B38E22] transition-colors shadow-lg"
              >
                <Gamepad2 className="h-4 w-4" />
                Lancer une partie maintenant
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
