import React from 'react';
import { SOCIAL_PROJECTS } from '../../data/churchData';
import { 
  HeartHandshake, 
  Sparkles, 
  CheckCircle2, 
  Heart, 
  TrendingUp, 
  Users, 
  Building2,
  ArrowRight
} from 'lucide-react';

interface SocialProjectsViewProps {
  onOpenDonationModal: () => void;
}

export const SocialProjectsView: React.FC<SocialProjectsViewProps> = ({
  onOpenDonationModal
}) => {
  return (
    <div className="space-y-16 pb-16">
      {/* Header */}
      <section className="bg-[#0F2C59] text-white py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center max-w-3xl">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#D4AF37]/20 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#D4AF37] mb-3">
            <HeartHandshake className="h-3.5 w-3.5" />
            Amour en Action & Développement
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-display">
            Projets Sociaux & Impact Communautaire
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-200 leading-relaxed">
            Pour l'Église du Nazaréen de Damé, la foi sans les œuvres est vaine. Nous travaillons activement pour l'épanouissement des enfants démunis, des familles vulnérables et l'autonomie de notre terroir.
          </p>
        </div>
      </section>

      {/* Projects List */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {SOCIAL_PROJECTS.map((project, idx) => {
          const isDigicel = project.id === 'elevage-caprin';
          return (
            <div
              key={project.id}
              className={`rounded-3xl border overflow-hidden transition-all ${
                isDigicel 
                  ? 'border-[#D4AF37] bg-gradient-to-br from-white via-amber-50/20 to-white shadow-md' 
                  : 'border-slate-200 bg-white shadow-sm'
              }`}
            >
              <div className="p-8 sm:p-10 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase ${
                        project.status === 'Nouveau' 
                          ? 'bg-[#D4AF37] text-[#0F2C59]' 
                          : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {project.status} • {project.year}
                      </span>
                      {project.partner && (
                        <span className="text-xs font-semibold text-slate-500">
                          Partenaire : <strong className="text-slate-800">{project.partner}</strong>
                        </span>
                      )}
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-bold font-display text-slate-900">
                      {project.title}
                    </h3>
                  </div>

                  <button
                    onClick={onOpenDonationModal}
                    className="inline-flex items-center gap-2 rounded-xl bg-[#0F2C59] px-5 py-2.5 text-xs font-bold text-white hover:bg-[#1A3D73] transition-colors self-start sm:self-auto shrink-0 shadow-sm"
                  >
                    Soutenir ce projet
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>

                <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-4xl">
                  {project.description}
                </p>

                {/* Metrics Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
                  {project.impactMetrics.map((metric, mIdx) => (
                    <div key={mIdx} className="rounded-xl bg-slate-50 p-4 border border-slate-200 text-center">
                      <div className="text-xl sm:text-2xl font-black text-[#0F2C59] font-display">
                        {metric.value}
                      </div>
                      <div className="text-xs text-slate-500 font-medium mt-1">
                        {metric.label}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Key Objectives */}
                <div className="pt-4 border-t border-slate-100 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                    Objectifs et Réalisations Concrètes :
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {project.keyObjectives.map((obj, oIdx) => (
                      <div key={oIdx} className="flex items-start gap-2 text-xs text-slate-700">
                        <CheckCircle2 className="h-4 w-4 text-[#D4AF37] shrink-0 mt-0.5" />
                        <span>{obj}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </section>

      {/* Callout Partners */}
      <section className="bg-slate-50 py-12 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <span className="text-xs uppercase tracking-widest text-slate-400 font-bold">
            Partenariats Stratégiques Reconnus
          </span>
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-16 grayscale hover:grayscale-0 transition-all opacity-80">
            <div className="font-display font-bold text-lg sm:text-xl text-slate-700">
              Compassion International <span className="text-xs block text-slate-400 font-sans font-normal">(CDEJ depuis 2019)</span>
            </div>
            <div className="font-display font-bold text-lg sm:text-xl text-slate-700">
              Fondation Digicel <span className="text-xs block text-slate-400 font-sans font-normal">(Élevage Caprin 2026)</span>
            </div>
            <div className="font-display font-bold text-lg sm:text-xl text-slate-700">
              Église du Nazaréen <span className="text-xs block text-slate-400 font-sans font-normal">(Région Méso-Amérique / Haïti)</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
