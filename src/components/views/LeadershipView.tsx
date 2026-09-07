import React, { useState } from 'react';
import { CHURCH_INFO, CHURCH_COUNCIL, DEPARTMENT_LEADERS } from '../../data/churchData';
import { CHURCH_ASSETS } from '../../data/churchMedia';
import { ImageModal } from '../ImageModal';
import { OfficialPhoto } from '../OfficialPhoto';
import { 
  Users, 
  Sparkles, 
  Award, 
  Briefcase, 
  Music, 
  Heart, 
  Shield, 
  Zap,
  Mail,
  Phone,
  Maximize2,
  CheckCircle2,
  MapPin,
  GraduationCap
} from 'lucide-react';

export const LeadershipView: React.FC = () => {
  const [modalImageOpen, setModalImageOpen] = useState(false);
  const leadPastor = CHURCH_COUNCIL[0];
  const councilMembers = CHURCH_COUNCIL.slice(1);

  const getDepartmentIcon = (dept: string) => {
    if (dept.includes('JNI') || dept.includes('Jeunesse')) return <Zap className="h-5 w-5 text-amber-500" />;
    if (dept.includes('Femmes')) return <Heart className="h-5 w-5 text-rose-500" />;
    if (dept.includes('Hommes')) return <Shield className="h-5 w-5 text-blue-500" />;
    if (dept.includes('Chorale') || dept.includes('Musique')) return <Music className="h-5 w-5 text-purple-500" />;
    return <Briefcase className="h-5 w-5 text-slate-500" />;
  };

  return (
    <div className="space-y-16 pb-16">
      {/* Page Header */}
      <section className="bg-[#0F2C59] text-white py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center max-w-3xl">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#D4AF37]/20 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#D4AF37] mb-3">
            <Users className="h-3.5 w-3.5" />
            Serviteurs & Administration
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-display">
            Leadership & Organisation
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-200 leading-relaxed">
            Une gouvernance collégiale, transparente et sanctifiée au service des fidèles et des œuvres de l'Église du Nazaréen de Damé.
          </p>
        </div>
      </section>

      {/* 0. PHOTO OFFICIELLE : DIRECTION DE L'ÉCOLE NAZARETH ET COMITÉ DE L'ÉGLISE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border-2 border-[#D4AF37]/40 bg-white overflow-hidden shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            {/* Image Column */}
            <div 
              className="lg:col-span-7 relative bg-slate-950 group cursor-pointer overflow-hidden min-h-[340px]"
              onClick={() => setModalImageOpen(true)}
            >
              <OfficialPhoto
                src={CHURCH_ASSETS.comite.src}
                alt={CHURCH_ASSETS.comite.alt}
                fallbackCandidates={CHURCH_ASSETS.comite.candidates ? [...CHURCH_ASSETS.comite.candidates] : []}
                title={CHURCH_ASSETS.comite.title}
                caption={CHURCH_ASSETS.comite.caption}
                badge="Direction & Comité"
                aspectRatioClass="aspect-16/9"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
              <div className="absolute top-4 left-4 flex items-center gap-2 rounded-full bg-[#081B36]/90 backdrop-blur-md px-3 py-1 text-xs font-bold text-[#D4AF37] border border-[#D4AF37]/50 shadow-md">
                <Sparkles className="h-3.5 w-3.5" />
                Photo Officielle du Corps Dirigeant
              </div>
              <div className="absolute top-4 right-4 h-9 w-9 rounded-full bg-black/60 backdrop-blur-md text-white flex items-center justify-center opacity-80 group-hover:opacity-100 hover:bg-[#D4AF37] hover:text-[#0F2C59] transition-all">
                <Maximize2 className="h-4 w-4" />
              </div>
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white text-xs">
                <span className="inline-flex items-center gap-1.5 font-medium">
                  <MapPin className="h-4 w-4 text-[#D4AF37]" />
                  Fond Damé • Devant l'École Nazareth
                </span>
                <span className="text-[#D4AF37] font-semibold text-xs">Agrandir la photo</span>
              </div>
            </div>

            {/* Description & Context Column */}
            <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between bg-gradient-to-b from-white to-slate-50">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-1.5 rounded-full bg-[#0F2C59]/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#0F2C59]">
                  <GraduationCap className="h-3.5 w-3.5 text-[#D4AF37]" />
                  Église & École Nazareth
                </div>
                <h2 className="text-xl sm:text-2xl font-bold font-display text-slate-900 leading-tight">
                  Notre Direction de l'École Nazareth & Notre Comité de l'Église
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Le corps pastoral, la direction de l'École Nazareth de Fond Damé et les membres du conseil de l'Église du Nazaréen réunis sur le parvis scolaire. Une équipe unie dans la prière, le dévouement spirituel et l'instruction de la jeunesse à Damé.
                </p>
                <div className="pt-2 space-y-2 text-xs text-slate-700">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#D4AF37] shrink-0 mt-0.5" />
                    <span><strong>Direction pastorale :</strong> Pasteur Bequel Cherelus (en costume bleu royal).</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#D4AF37] shrink-0 mt-0.5" />
                    <span><strong>Direction académique :</strong> Responsables pédagogiques de l'École Nazareth (préscolaire à la 9ème AF).</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#D4AF37] shrink-0 mt-0.5" />
                    <span><strong>Comité d'Église :</strong> Diaconat, secrétariat, trésorerie et intendance communautaire.</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
                <span>Rue Cimetière, 3ème Section Damé</span>
                <span className="font-semibold text-[#0F2C59]">« Sainteté à l'Éternel »</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 1. Pasteur Principal Spotlight */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-slate-200 bg-white overflow-hidden shadow-lg">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            {/* Pastoral Visual Column */}
            <div className="lg:col-span-4 bg-gradient-to-br from-[#0F2C59] to-[#081B36] p-8 text-white flex flex-col justify-between items-center text-center">
              <div className="space-y-4">
                <div className="relative mx-auto flex h-32 w-32 items-center justify-center rounded-full bg-white/10 border-4 border-[#D4AF37]/50 shadow-inner">
                  <Award className="h-16 w-16 text-[#D4AF37]" />
                </div>
                <div>
                  <span className="rounded-full bg-[#D4AF37] px-3 py-1 text-xs font-extrabold text-[#0F2C59] uppercase tracking-wider">
                    Pasteur Principal
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold font-display text-white mt-3">
                    {leadPastor.name}
                  </h3>
                  <p className="text-xs text-slate-300 font-medium">À la tête de l'assemblée depuis 2003</p>
                </div>
              </div>

              <div className="pt-6 w-full border-t border-white/10 text-xs text-slate-300 space-y-1">
                <p>District Bas Nord-Ouest • Haïti</p>
                <p className="text-[#D4AF37] font-semibold">{CHURCH_INFO.motto}</p>
              </div>
            </div>

            {/* Pastoral Bio & Responsibilities */}
            <div className="lg:col-span-8 p-8 sm:p-10 space-y-6 flex flex-col justify-center">
              <div>
                <span className="text-xs uppercase tracking-widest text-[#0F2C59] font-bold">Direction Spirituelle</span>
                <h3 className="text-2xl font-bold font-display text-slate-900 mt-1">
                  Ministère & Vision Pastorale
                </h3>
              </div>

              <p className="text-sm text-slate-600 leading-relaxed">
                {leadPastor.bio}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="rounded-xl bg-slate-50 p-4 border border-slate-200">
                  <h4 className="text-xs font-bold uppercase text-[#0F2C59] mb-1">Champs d'intervention</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Prédication de la Parole, cure d'âme et accompagnement des familles, supervision de l'École EPND et coordination des partenariats (Compassion International, Fondation Digicel).
                  </p>
                </div>
                <div className="rounded-xl bg-slate-50 p-4 border border-slate-200">
                  <h4 className="text-xs font-bold uppercase text-[#0F2C59] mb-1">Permanence pastorale</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Entretiens spirituels sur rendez-vous le mardi et le jeudi après-midi au presbytère de l'Église.
                  </p>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap gap-4 text-xs text-slate-500">
                <span className="inline-flex items-center gap-1.5 font-medium">
                  <Phone className="h-3.5 w-3.5 text-[#0F2C59]" />
                  {CHURCH_INFO.phone}
                </span>
                <span className="inline-flex items-center gap-1.5 font-medium">
                  <Mail className="h-3.5 w-3.5 text-[#0F2C59]" />
                  {CHURCH_INFO.email}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Conseil d'Église (Board) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs uppercase tracking-widest text-[#0F2C59] font-bold bg-[#0F2C59]/10 px-3 py-1 rounded-full">
            Gouvernance
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold font-display text-[#0F2C59] mt-3">
            Le Conseil d'Église
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-2">
            Les officiers élus veillant à l'administration, aux finances et à la bonne marche de l'assemblée paroissiale.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {councilMembers.map((member, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-[#0F2C59] mb-4">
                  <Briefcase className="h-6 w-6" />
                </div>
                <span className="rounded-md bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold uppercase text-slate-700">
                  {member.role}
                </span>
                <h3 className="text-base font-bold font-display text-slate-900 mt-2">
                  {member.name}
                </h3>
                <p className="text-xs text-[#0F2C59] font-medium mt-0.5">
                  {member.department}
                </p>
                <p className="text-xs text-slate-500 mt-3 leading-relaxed">
                  {member.bio}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-400">
                Statut : <span className="text-slate-700 font-semibold">{member.period}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Responsables des Départements */}
      <section className="bg-slate-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs uppercase tracking-widest text-[#0F2C59] font-bold">
              Animation Pastorale
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-display text-[#0F2C59] mt-2">
              Responsables des Départements
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-2">
              Des leaders dévoués coordonnant les groupes d'âge et les expressions liturgiques de notre paroisse.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {DEPARTMENT_LEADERS.map((leader, idx) => (
              <div
                key={idx}
                className="rounded-2xl bg-white p-6 shadow-sm border border-slate-200 flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50 border border-slate-100 mb-4">
                    {getDepartmentIcon(leader.department || '')}
                  </div>
                  <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">
                    {leader.department}
                  </span>
                  <h3 className="text-base font-bold font-display text-slate-900 mt-1">
                    {leader.name}
                  </h3>
                  <p className="text-xs font-semibold text-[#0F2C59] mt-0.5">
                    {leader.role}
                  </p>
                  <p className="text-xs text-slate-600 mt-3 leading-relaxed">
                    {leader.bio}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-[#D4AF37]" />
                  <span>Damé, Haïti</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      <ImageModal
        image={modalImageOpen ? CHURCH_ASSETS.comite : null}
        onClose={() => setModalImageOpen(false)}
      />
    </div>
  );
};
