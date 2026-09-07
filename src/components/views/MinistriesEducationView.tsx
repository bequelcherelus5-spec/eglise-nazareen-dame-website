import React, { useState } from 'react';
import { MINISTRIES_LIST, EPND_COURSES } from '../../data/churchData';
import { CHURCH_ASSETS, ChurchRealImage } from '../../data/churchMedia';
import { ImageModal } from '../ImageModal';
import { OfficialPhoto } from '../OfficialPhoto';
import { 
  Users, 
  Baby, 
  Zap, 
  Heart, 
  Shield, 
  Music, 
  Compass, 
  GraduationCap, 
  Clock, 
  Calendar, 
  ArrowRight,
  CheckCircle2,
  Sparkles,
  MapPin,
  Maximize2,
  BookOpen,
  Trees,
  Award
} from 'lucide-react';

interface MinistriesEducationViewProps {
  onOpenEpndEnrollModal: (courseId?: string) => void;
}

export const MinistriesEducationView: React.FC<MinistriesEducationViewProps> = ({
  onOpenEpndEnrollModal
}) => {
  const [selectedMinistryId, setSelectedMinistryId] = useState<string>('jni');
  const [modalImage, setModalImage] = useState<ChurchRealImage | null>(null);

  const getMinistryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Baby': return <Baby className="h-6 w-6" />;
      case 'Zap': return <Zap className="h-6 w-6" />;
      case 'Heart': return <Heart className="h-6 w-6" />;
      case 'Shield': return <Shield className="h-6 w-6" />;
      case 'Music': return <Music className="h-6 w-6" />;
      case 'Compass': return <Compass className="h-6 w-6" />;
      default: return <Users className="h-6 w-6" />;
    }
  };

  const activeMinistry = MINISTRIES_LIST.find((m) => m.id === selectedMinistryId) || MINISTRIES_LIST[0];

  return (
    <div className="space-y-20 pb-16">
      {/* Page Header */}
      <section className="bg-[#0F2C59] text-white py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center max-w-3xl">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#D4AF37]/20 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#D4AF37] mb-3">
            <GraduationCap className="h-3.5 w-3.5" />
            Croissance Spirituelle & Métiers
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-display">
            Ministères & École Professionnelle
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-200 leading-relaxed">
            L'Église du Nazaréen de Damé accompagne chaque étape de la vie : de l'enfance à l'âge adulte, de l'édification dans la Parole à l'apprentissage de métiers pratiques à l'EPND.
          </p>
        </div>
      </section>

      {/* 0. ÉCOLE NAZARETH DE FOND DAMÉ (Enseignement Fondamental & Cadre de Vie) */}
      <section id="ecole-nazareth-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-4">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#0F2C59]/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#0F2C59] mb-2">
                <BookOpen className="h-3.5 w-3.5 text-[#D4AF37]" />
                Enseignement Fondamental & Cadre de Vie
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900">
                École Nazareth de Fond Damé
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mt-1">
                Du Préscolaire à la 9ème Année Fondamentale • Rue Cimetière, 3ème Section Damé, Commune Môle-Saint-Nicolas
              </p>
            </div>
            <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 px-3.5 py-1.5 text-xs font-bold shrink-0">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              Inscriptions Ouvertes 2026-2027
            </span>
          </div>

          {/* 2 Featured Photos Grid: School Facade & Courtyard Landscape */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Card 1: School Facade */}
            <div 
              onClick={() => setModalImage(CHURCH_ASSETS.ecoleFacade)}
              className="group relative rounded-3xl bg-white border border-slate-200 overflow-hidden shadow-md hover:shadow-2xl transition-all cursor-pointer flex flex-col"
            >
              <div className="relative aspect-16/10 w-full overflow-hidden bg-slate-100">
                <OfficialPhoto
                  src={CHURCH_ASSETS.ecoleFacade.src}
                  alt={CHURCH_ASSETS.ecoleFacade.alt}
                  fallbackCandidates={CHURCH_ASSETS.ecoleFacade.candidates ? [...CHURCH_ASSETS.ecoleFacade.candidates] : []}
                  title={CHURCH_ASSETS.ecoleFacade.title}
                  caption={CHURCH_ASSETS.ecoleFacade.caption}
                  badge="École Nazareth"
                  aspectRatioClass="aspect-16/10"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
                <div className="absolute top-4 left-4 flex items-center gap-2 rounded-full bg-[#081B36]/90 backdrop-blur-md px-3 py-1 text-xs font-bold text-white border border-white/20">
                  <GraduationCap className="h-3.5 w-3.5 text-[#D4AF37]" />
                  Bâtiment Scolaire
                </div>
                <div className="absolute top-4 right-4 h-8 w-8 rounded-full bg-black/60 backdrop-blur-md text-white flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-[#D4AF37] hover:text-[#0F2C59] transition-all">
                  <Maximize2 className="h-4 w-4" />
                </div>
                <div className="absolute bottom-3 left-4 right-4 text-white text-xs flex justify-between items-center">
                  <span className="inline-flex items-center gap-1 font-medium">
                    <MapPin className="h-3.5 w-3.5 text-[#D4AF37]" />
                    Façade & Inscriptions Officielles
                  </span>
                  <span className="text-[#D4AF37] font-semibold text-[11px]">Agrandir</span>
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <h3 className="text-lg font-bold font-display text-slate-900 group-hover:text-[#0F2C59] transition-colors">
                    La Façade de l'École Nazareth
                  </h3>
                  <div className="mt-2 rounded-xl bg-amber-50 border border-amber-200/80 p-3 text-xs text-amber-950 font-serif italic">
                    « Préparer l'enfant à devenir un adulte responsable et équilibré car l'éducation est l'arme la plus puissante qu'on puisse utiliser pour sauver le monde »
                  </div>
                  <p className="text-xs text-slate-600 mt-3 leading-relaxed">
                    Bâtiment officiel de l'école fondamentale chrétienne, accueillant les générations montantes de la 3ème Section Damé avec des salles de classe aérées, une équipe pédagogique engagée et un encadrement fondé sur l'amour du prochain.
                  </p>
                </div>
              </div>
            </div>

            {/* Card 2: Courtyard Landscape */}
            <div 
              onClick={() => setModalImage(CHURCH_ASSETS.courPaysage)}
              className="group relative rounded-3xl bg-white border border-slate-200 overflow-hidden shadow-md hover:shadow-2xl transition-all cursor-pointer flex flex-col"
            >
              <div className="relative aspect-16/10 w-full overflow-hidden bg-slate-100">
                <OfficialPhoto
                  src={CHURCH_ASSETS.courPaysage.src}
                  alt={CHURCH_ASSETS.courPaysage.alt}
                  fallbackCandidates={CHURCH_ASSETS.courPaysage.candidates ? [...CHURCH_ASSETS.courPaysage.candidates] : []}
                  title={CHURCH_ASSETS.courPaysage.title}
                  caption={CHURCH_ASSETS.courPaysage.caption}
                  badge="Cour & Paysage"
                  aspectRatioClass="aspect-16/10"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
                <div className="absolute top-4 left-4 flex items-center gap-2 rounded-full bg-[#081B36]/90 backdrop-blur-md px-3 py-1 text-xs font-bold text-white border border-white/20">
                  <Trees className="h-3.5 w-3.5 text-emerald-400" />
                  La Cour & le Paysage
                </div>
                <div className="absolute top-4 right-4 h-8 w-8 rounded-full bg-black/60 backdrop-blur-md text-white flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-[#D4AF37] hover:text-[#0F2C59] transition-all">
                  <Maximize2 className="h-4 w-4" />
                </div>
                <div className="absolute bottom-3 left-4 right-4 text-white text-xs flex justify-between items-center">
                  <span className="inline-flex items-center gap-1 font-medium">
                    <MapPin className="h-3.5 w-3.5 text-[#D4AF37]" />
                    Enceinte Récréative & Verdoyante
                  </span>
                  <span className="text-[#D4AF37] font-semibold text-[11px]">Agrandir</span>
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <h3 className="text-lg font-bold font-display text-slate-900 group-hover:text-[#0F2C59] transition-colors">
                    Le Paysage de la Cour de Récréation
                  </h3>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    Un environnement ouvert, spacieux et arboré de cocotiers et de végétation tropicale. Les élèves y bénéficient d'un cadre sécurisé pour la récréation, l'éducation physique et les rassemblements scolaires et patriotiques sous le ciel clair du Nord-Ouest.
                  </p>
                  <div className="mt-4 grid grid-cols-2 gap-2 text-[11px] text-slate-700">
                    <div className="flex items-center gap-1.5 bg-slate-50 p-2 rounded-lg border border-slate-100">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                      <span>Espace sécurisé & clôturé</span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-slate-50 p-2 rounded-lg border border-slate-100">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                      <span>Ombrage & végétation</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 1. ÉCOLE PROFESSIONNELLE NAZARÉEN DE DAMÉ (EPND) */}
      <section id="epnd-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-br from-[#0F2C59] via-[#081B36] to-[#0F2C59] p-8 sm:p-12 text-white shadow-xl border border-[#D4AF37]/40 mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full bg-[#D4AF37]/20 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#D4AF37]">
                <GraduationCap className="h-4 w-4" />
                Fondée en 2022 • Centre de formation technique
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-display text-white">
                École Professionnelle Nazaréen de Damé (EPND)
              </h2>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed max-w-2xl">
                Créée pour répondre au défi de l'employabilité et de l'autonomie financière des jeunes et des adultes dans la 3ème Section Damé. Nous combinons rigueur technique, éthique chrétienne et apprentissage sur le terrain.
              </p>
              <div className="pt-2 flex flex-wrap gap-4 text-xs text-slate-300">
                <span className="flex items-center gap-1.5 font-medium">
                  <CheckCircle2 className="h-4 w-4 text-[#D4AF37]" />
                  4 filières certifiantes
                </span>
                <span className="flex items-center gap-1.5 font-medium">
                  <CheckCircle2 className="h-4 w-4 text-[#D4AF37]" />
                  Ateliers pratiques & outillage
                </span>
                <span className="flex items-center gap-1.5 font-medium">
                  <CheckCircle2 className="h-4 w-4 text-[#D4AF37]" />
                  Bourses d'études disponibles
                </span>
              </div>
            </div>

            <div className="lg:col-span-4 bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 text-center space-y-4">
              <span className="text-xs uppercase font-bold text-[#D4AF37]">Inscriptions Session 2026</span>
              <p className="text-xs text-slate-200">
                Places limitées pour garantir un suivi pratique de qualité par formateur.
              </p>
              <button
                onClick={() => onOpenEpndEnrollModal()}
                className="w-full rounded-xl bg-[#D4AF37] hover:bg-[#B38E22] py-3 text-xs font-bold text-[#0F2C59] transition-all shadow-md"
              >
                Formulaire de Pré-inscription
              </button>
            </div>
          </div>
        </div>

        {/* Grille des 4 Filières EPND */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {EPND_COURSES.map((course) => (
            <div
              key={course.id}
              className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-7 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="rounded-full bg-[#0F2C59]/10 px-3 py-1 text-xs font-bold text-[#0F2C59]">
                    Durée : {course.duration}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-400">
                    Niveau : {course.level}
                  </span>
                </div>

                <h3 className="text-lg font-bold font-display text-slate-900 mb-2">
                  {course.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  {course.description}
                </p>

                <div className="space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#0F2C59]">
                    Compétences acquises :
                  </span>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-slate-600">
                    {course.competencies.map((comp, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <CheckCircle2 className="h-3.5 w-3.5 text-[#D4AF37] shrink-0 mt-0.5" />
                        <span>{comp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="text-slate-500">
                  <span>Horaire : <strong className="text-slate-700">{course.schedule}</strong></span>
                </div>
                <button
                  onClick={() => onOpenEpndEnrollModal(course.id)}
                  className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#0F2C59] px-4 py-2 font-semibold text-white hover:bg-[#1A3D73] transition-colors"
                >
                  S'inscrire à ce cours
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 2. MINISTÈRES DE L'ÉGLISE (Cartes Interactives) */}
      <section className="bg-slate-50 py-16 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs uppercase tracking-widest text-[#0F2C59] font-bold bg-white px-3 py-1 rounded-full border border-slate-200 shadow-sm">
              Vie Communautaire
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-display text-[#0F2C59] mt-3">
              Départements & Ministères Pastoraux
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-2">
              Chaque génération et chaque groupe trouve un cadre d'affermissement et de service au sein du corps du Christ.
            </p>
          </div>

          {/* Interactive tabs for ministries */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
            {MINISTRIES_LIST.map((ministry) => {
              const isActive = selectedMinistryId === ministry.id;
              return (
                <button
                  key={ministry.id}
                  onClick={() => setSelectedMinistryId(ministry.id)}
                  className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-[#0F2C59] text-white shadow-md'
                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {getMinistryIcon(ministry.icon)}
                  <span>{ministry.name.split('&')[0]}</span>
                </button>
              );
            })}
          </div>

          {/* Active Ministry Details Card */}
          <div className="max-w-4xl mx-auto rounded-2xl bg-white border border-slate-200 p-8 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6 mb-6">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#0F2C59] text-[#D4AF37]">
                  {getMinistryIcon(activeMinistry.icon)}
                </div>
                <div>
                  <span className="text-xs font-semibold text-[#D4AF37] uppercase">
                    Public cible : {activeMinistry.targetAudience}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold font-display text-slate-900 mt-0.5">
                    {activeMinistry.name}
                  </h3>
                </div>
              </div>
              <div className="sm:text-right space-y-1 text-xs">
                <div>Responsable : <strong className="text-slate-800">{activeMinistry.leader}</strong></div>
                <div>Rassemblement : <strong className="text-[#0F2C59]">{activeMinistry.schedule}</strong></div>
              </div>
            </div>

            <p className="text-sm text-slate-700 leading-relaxed mb-6">
              {activeMinistry.description}
            </p>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-3">
                Activités régulières & Projets clés :
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {activeMinistry.activities.map((act, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700">
                    <Sparkles className="h-4 w-4 text-[#D4AF37] shrink-0 mt-0.5" />
                    <span>{act}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      <ImageModal
        image={modalImage}
        onClose={() => setModalImage(null)}
      />
    </div>
  );
};
