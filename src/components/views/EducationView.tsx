import React, { useState } from 'react';
import { PageTab } from '../../types';
import { EPND_COURSES } from '../../data/churchData';
import { CHURCH_ASSETS, ChurchRealImage } from '../../data/churchMedia';
import { ImageModal } from '../ImageModal';
import { OfficialPhoto } from '../OfficialPhoto';
import { NazarethEduGames } from '../education/NazarethEduGames';
import { ExamPrepPlatform } from '../education/ExamPrepPlatform';
import { 
  GraduationCap, 
  BookOpen, 
  CheckCircle2, 
  Sparkles, 
  Clock, 
  ArrowRight, 
  Users, 
  ShieldCheck, 
  Maximize2,
  Calendar,
  Award,
  Gamepad2,
  FileText
} from 'lucide-react';

interface EducationViewProps {
  onNavigate?: (tab: PageTab) => void;
  onOpenEpndEnrollModal: (courseId?: string) => void;
}

export const EducationView: React.FC<EducationViewProps> = ({
  onNavigate,
  onOpenEpndEnrollModal
}) => {
  const [modalImage, setModalImage] = useState<ChurchRealImage | null>(null);
  const [selectedCourseId, setSelectedCourseId] = useState<string>('couture');

  const activeCourse = EPND_COURSES.find(c => c.id === selectedCourseId) || EPND_COURSES[0];

  return (
    <div className="space-y-16 pb-16">
      {/* Header */}
      <section className="bg-gradient-to-b from-[#081B36] to-[#0F2C59] text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center max-w-3xl space-y-4">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#D4AF37]/20 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#D4AF37]">
            <GraduationCap className="h-4 w-4" />
            Pôle Éducatif & Formation Pratique
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-display">
            Éducation Chrétienne & Métiers
          </h1>
          <p className="text-sm sm:text-base text-slate-200 leading-relaxed max-w-2xl mx-auto">
            De l'école fondamentale Nazareth à l'École Professionnelle EPND : former l'intelligence, fortifier la foi et qualifier les mains pour l'autonomie à Damé.
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => onOpenEpndEnrollModal()}
              className="inline-flex items-center gap-2 rounded-xl bg-[#D4AF37] px-6 py-3 text-xs sm:text-sm font-bold text-[#0F2C59] hover:bg-[#B38E22] transition-colors shadow-lg"
            >
              <GraduationCap className="h-4 w-4" />
              S'inscrire à une formation EPND
            </button>
            <a
              href="#jeux-educatifs"
              className="inline-flex items-center gap-2 rounded-xl bg-white/10 hover:bg-white/20 text-white px-4 py-3 text-xs sm:text-sm font-semibold transition-colors border border-white/20"
            >
              <Gamepad2 className="h-4 w-4 text-[#D4AF37]" />
              Jeux Éducatifs (1ère - 9ème AF)
            </a>
            <a
              href="#preparation-examens"
              className="inline-flex items-center gap-2 rounded-xl bg-white/10 hover:bg-white/20 text-white px-4 py-3 text-xs sm:text-sm font-semibold transition-colors border border-white/20"
            >
              <FileText className="h-4 w-4 text-[#D4AF37]" />
              Préparation Examens MENFP
            </a>
          </div>
        </div>
      </section>

      {/* Les Deux Piliers Éducatifs */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Pilier 1: École Fondamentale Nazareth */}
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0F2C59] text-[#D4AF37] font-bold">
                  <BookOpen className="h-6 w-6" />
                </div>
                <span className="rounded-full bg-slate-100 text-slate-700 px-3 py-1 text-xs font-bold">
                  Fondée en 1985
                </span>
              </div>
              <h3 className="text-2xl font-bold font-display text-[#0F2C59]">
                École Fondamentale Nazareth
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Créée pour répondre à l'urgence éducative de la 3ème section Damé, l'École Nazareth accueille les enfants du cycle fondamental (1ère à 9ème année fondamentale).
              </p>
              <div className="space-y-2 text-xs text-slate-700 pt-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Cycle fondamental complet agréé par le MENFP</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Éducation aux valeurs morales, bibliques et civiques</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Cadre sécurisé avec cour de récréation verdoyante</span>
                </div>
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <span className="text-xs font-semibold text-[#0F2C59]">
                Devise : « Préparer l’enfant à devenir un adulte responsable »
              </span>
              <div className="flex flex-wrap gap-2">
                <a
                  href="#jeux-educatifs"
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#0F2C59] text-[#D4AF37] hover:bg-[#1A365D] text-xs font-bold transition-colors shadow-sm"
                >
                  <Gamepad2 className="h-3.5 w-3.5" />
                  <span>Jeux Éducatifs (1ère-9ème AF)</span>
                </a>
                <a
                  href="#preparation-examens"
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#D4AF37] text-[#0F2C59] hover:bg-[#B38E22] text-xs font-bold transition-colors shadow-sm"
                >
                  <GraduationCap className="h-3.5 w-3.5" />
                  <span>Examens MENFP</span>
                </a>
              </div>
            </div>
          </div>

          {/* Pilier 2: EPND */}
          <div className="rounded-3xl border-2 border-[#D4AF37] bg-gradient-to-br from-[#081B36] to-[#0F2C59] text-white p-8 shadow-xl flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#D4AF37] text-[#0F2C59] font-bold">
                  <GraduationCap className="h-6 w-6" />
                </div>
                <span className="rounded-full bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40 px-3 py-1 text-xs font-bold uppercase">
                  Créée en 2022
                </span>
              </div>
              <h3 className="text-2xl font-bold font-display text-white">
                École Professionnelle Nazaréen de Damé (EPND)
              </h3>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                Sous l'initiative du Pasteur Bequel CHERELUS, l'EPND donne aux jeunes et adultes de Damé des compétences techniques pratiques pour s'insérer sur le marché du travail ou entreprendre.
              </p>
              <div className="space-y-2 text-xs text-slate-300 pt-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#D4AF37] shrink-0" />
                  <span>4 filières certifiantes adaptées à l'économie locale</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#D4AF37] shrink-0" />
                  <span>Apprentissage 70% pratique et ateliers d'application</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#D4AF37] shrink-0" />
                  <span>Diplômes délivrés lors de cérémonies de graduation solennelles</span>
                </div>
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
              <span className="text-xs font-bold text-[#D4AF37]">Inscriptions ouvertes toute l'année</span>
              <button
                onClick={() => onOpenEpndEnrollModal()}
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#D4AF37] px-3.5 py-1.5 text-xs font-bold text-[#0F2C59] hover:bg-[#B38E22]"
              >
                Postuler <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Photo Officielle de la Façade de l'École Nazareth */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-slate-200 bg-white overflow-hidden shadow-lg">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            <div 
              className="lg:col-span-7 relative bg-slate-900 group cursor-pointer overflow-hidden min-h-[300px]"
              onClick={() => setModalImage(CHURCH_ASSETS.ecoleFacade)}
            >
              <OfficialPhoto
                src={CHURCH_ASSETS.ecoleFacade.src}
                alt={CHURCH_ASSETS.ecoleFacade.alt}
                fallbackCandidates={CHURCH_ASSETS.ecoleFacade.candidates ? [...CHURCH_ASSETS.ecoleFacade.candidates] : []}
                title={CHURCH_ASSETS.ecoleFacade.title}
                caption={CHURCH_ASSETS.ecoleFacade.caption}
                badge="Bâtiment Scolaire"
                aspectRatioClass="aspect-16/9"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-4 right-4 h-9 w-9 rounded-full bg-black/60 text-white flex items-center justify-center opacity-80 group-hover:opacity-100 hover:bg-[#D4AF37] hover:text-[#0F2C59] transition-all">
                <Maximize2 className="h-4 w-4" />
              </div>
            </div>

            <div className="lg:col-span-5 p-8 flex flex-col justify-between space-y-4">
              <div>
                <span className="text-xs uppercase tracking-wider font-bold text-[#0F2C59] bg-[#0F2C59]/10 px-3 py-1 rounded-full">
                  Infrastructure
                </span>
                <h3 className="text-xl sm:text-2xl font-bold font-display text-slate-900 mt-2">
                  Bâtiments de l'École Nazareth & EPND
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                  Situé dans l'enceinte de l'Église à la Rue Cimetière, cet édifice abrite les salles de classe de l'école fondamentale le matin, et accueille les ateliers de l'École Professionnelle en après-midi et week-end.
                </p>
                <div className="pt-4 space-y-2 text-xs text-slate-500">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-[#D4AF37]" />
                    <span>Cadre propre, aéré et propice aux études</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-[#D4AF37]" />
                    <span>Enseignants et instructeurs qualifiés</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setModalImage(CHURCH_ASSETS.ecoleFacade)}
                className="inline-flex items-center gap-2 text-xs font-bold text-[#0F2C59] hover:underline"
              >
                Agrandir la photo officielle <Maximize2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Section 1 Demandée : Jeux Éducatifs pour École Nazareth (1ère à 9ème AF) */}
      <section id="jeux-educatifs" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-20">
        <NazarethEduGames />
      </section>

      {/* Section 2 Demandée : Plateforme de Préparation aux Examens Officiels (MENFP) */}
      <section id="preparation-examens" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-20">
        <ExamPrepPlatform />
      </section>

      {/* Les 4 Filières de l'EPND en Détail */}
      <section id="formations-epnd" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-20">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs uppercase tracking-widest text-[#0F2C59] font-bold bg-[#0F2C59]/10 px-3 py-1 rounded-full">
            Filières EPND
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold font-display text-[#0F2C59] mt-3">
            Programmes de Formation Professionnelle
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-2">
            Choisissez un métier porteur et formez-vous sur place à Damé avec un encadrement sérieux.
          </p>
        </div>

        {/* Course Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {EPND_COURSES.map((course) => (
            <button
              key={course.id}
              onClick={() => setSelectedCourseId(course.id)}
              className={`p-4 rounded-2xl text-left border transition-all ${
                selectedCourseId === course.id
                  ? 'border-[#0F2C59] bg-[#0F2C59] text-white shadow-md'
                  : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-800'
              }`}
            >
              <span className={`text-[10px] font-bold uppercase tracking-wider block ${selectedCourseId === course.id ? 'text-[#D4AF37]' : 'text-slate-400'}`}>
                Filière
              </span>
              <h4 className="text-sm font-bold font-display mt-1">
                {course.title}
              </h4>
              <span className={`text-[11px] block mt-1 ${selectedCourseId === course.id ? 'text-slate-200' : 'text-slate-500'}`}>
                {course.duration}
              </span>
            </button>
          ))}
        </div>

        {/* Selected Course Card */}
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-md">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <div className="flex items-center gap-3">
                <span className="rounded-full bg-[#D4AF37] px-3 py-1 text-xs font-bold text-[#0F2C59] uppercase">
                  {activeCourse.level}
                </span>
                <span className="flex items-center gap-1.5 text-xs text-slate-500">
                  <Clock className="h-4 w-4 text-[#D4AF37]" />
                  Durée : {activeCourse.duration}
                </span>
              </div>
              <h3 className="text-2xl font-bold font-display text-[#0F2C59]">
                {activeCourse.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {activeCourse.description}
              </p>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Compétences acquises :
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {activeCourse.competencies.map((comp, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-slate-700">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                      <span>{comp}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 text-xs text-slate-500 flex flex-wrap gap-4">
                <div>Instructeur : <strong className="text-slate-800">{activeCourse.instructor}</strong></div>
                <div>Horaires : <strong className="text-slate-800">{activeCourse.schedule}</strong></div>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col items-center justify-center p-6 bg-slate-50 rounded-2xl border border-slate-200 text-center space-y-3">
              <div className="h-16 w-16 rounded-2xl bg-[#0F2C59] text-[#D4AF37] flex items-center justify-center shadow">
                <Award className="h-8 w-8" />
              </div>
              <h4 className="text-sm font-bold text-[#0F2C59]">Certificat de Fin de Cycle</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Délivré par la Direction de l'EPND et le Comité Pastoral de l'Église.
              </p>
              <button
                onClick={() => onOpenEpndEnrollModal(activeCourse.id)}
                className="w-full rounded-xl bg-[#D4AF37] py-2.5 text-xs font-bold text-[#0F2C59] hover:bg-[#B38E22] transition-colors shadow"
              >
                Postuler pour {activeCourse.title}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Modal image */}
      <ImageModal
        isOpen={!!modalImage}
        onClose={() => setModalImage(null)}
        image={modalImage || undefined}
      />
    </div>
  );
};
