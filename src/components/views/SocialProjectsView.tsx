import React, { useState, useEffect, useCallback } from 'react';
import { SOCIAL_PROJECTS } from '../../data/churchData';
import { ChurchPublication } from '../../types';
import { apiService, HONNOLD_SOLAR_PROJECT } from '../../services/apiService';
import { DEFAULT_CHURCH_IMAGE } from '../../utils/imageOptimizer';
import { AdSenseUnit } from '../ads/AdSenseUnit';
import { 
  HeartHandshake, 
  Sparkles, 
  CheckCircle2, 
  Heart, 
  TrendingUp, 
  Users, 
  Building2,
  ArrowRight,
  DollarSign,
  Target,
  Calendar,
  User,
  Briefcase,
  RefreshCw,
  Clock,
  Layers,
  Code2,
  ExternalLink,
  Quote,
  Sun
} from 'lucide-react';

interface SocialProjectsViewProps {
  onOpenDonationModal: () => void;
}

export const SocialProjectsView: React.FC<SocialProjectsViewProps> = ({
  onOpenDonationModal
}) => {
  // Initialisation directe avec les données statiques du projet pour affichage immédiat sans dépendance au localStorage
  const [dynamicProjects, setDynamicProjects] = useState<ChurchPublication[]>([HONNOLD_SOLAR_PROJECT]);
  const [loading, setLoading] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const fetchProjects = useCallback(async (isManualRefresh: boolean = false) => {
    if (isManualRefresh) setRefreshing(true);
    try {
      // Récupérer les publications de type projet publiées depuis le backend / API
      const pubs = await apiService.getProjects(false);
      if (pubs && pubs.length > 0) {
        setDynamicProjects(pubs);
      }
    } catch (err) {
      console.warn('[SocialProjectsView] Erreur lors du chargement des projets publiés:', err);
    } finally {
      setLoading(false);
      if (isManualRefresh) setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();

    // Réactivité en temps réel : écouter les publications depuis le secrétariat
    const handlePublicationUpdate = () => {
      fetchProjects();
    };

    window.addEventListener('dame_publications_updated', handlePublicationUpdate);
    window.addEventListener('storage', handlePublicationUpdate);

    return () => {
      window.removeEventListener('dame_publications_updated', handlePublicationUpdate);
      window.removeEventListener('storage', handlePublicationUpdate);
    };
  }, [fetchProjects]);

  return (
    <div className="space-y-16 pb-16">
      {/* 1. Header Hero */}
      <section className="bg-[#0F2C59] text-white py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center max-w-3xl">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#D4AF37]/20 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#D4AF37] mb-3">
            <HeartHandshake className="h-3.5 w-3.5" />
            Amour en Action & Développement Paroissial
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-display">
            Nos Projets & Impact Communautaire
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-200 leading-relaxed">
            Pour l'Église du Nazaréen de Damé, la foi sans les œuvres est vaine (Jacques 2:17). Nous agissons au quotidien pour l'autonomie des familles vulnérables, l'éducation de nos enfants et le rayonnement solidaire de notre localité.
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => fetchProjects(true)}
              disabled={refreshing}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold backdrop-blur-xs transition-colors cursor-pointer border border-white/20"
              title="Actualiser la liste des projets"
            >
              <RefreshCw className={`h-3.5 w-3.5 text-[#D4AF37] ${refreshing ? 'animate-spin' : ''}`} />
              <span>{refreshing ? 'Mise à jour...' : 'Actualiser les projets'}</span>
            </button>

            <button
              onClick={onOpenDonationModal}
              className="inline-flex items-center gap-2 rounded-xl bg-[#D4AF37] px-5 py-2 text-xs font-bold text-[#0F2C59] hover:bg-[#B38E22] transition-all shadow-sm"
            >
              <Heart className="h-3.5 w-3.5 fill-current" />
              <span>Faire un don pour un projet</span>
            </button>
          </div>
        </div>
      </section>

      {/* 2. Section des Projets Publiés depuis le Secrétariat */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-emerald-100 text-emerald-800 rounded-lg">
                <Briefcase className="w-4 h-4" />
              </span>
              <span className="text-xs uppercase tracking-widest text-emerald-800 font-bold">
                Initiatives Paroissiales & Récentes
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-display text-slate-900 mt-1">
              Projets Communautaires en Direct
            </h2>
          </div>
          <span className="text-xs text-slate-500 font-medium">
            {dynamicProjects.length} initiative(s) publiée(s) par le Secrétariat
          </span>
        </div>

        {loading ? (
          <div className="py-12 flex flex-col items-center justify-center text-slate-400">
            <RefreshCw className="h-8 w-8 animate-spin text-[#0F2C59] mb-2" />
            <p className="text-xs">Chargement des projets communautaires...</p>
          </div>
        ) : dynamicProjects.length > 0 ? (
          <div className="space-y-8">
            {dynamicProjects.map((pub) => {
              const statusBadgeClass = 
                pub.projectStatus === 'Terminé' 
                  ? 'bg-emerald-100 text-emerald-800 border-emerald-300' 
                  : pub.projectStatus === 'En cours' 
                    ? 'bg-blue-100 text-blue-900 border-blue-300' 
                    : 'bg-amber-100 text-amber-900 border-amber-300';

              const hasImage = Boolean(pub.hasCustomImage !== false && pub.image && pub.image.trim() !== '');

              return (
                <article
                  key={pub.id}
                  className="rounded-3xl border border-slate-200 bg-white overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col lg:flex-row"
                >
                  {/* Image optionnelle du projet */}
                  {hasImage && (
                    <div className="lg:w-1/3 min-h-[220px] lg:min-h-full bg-slate-100 relative overflow-hidden shrink-0">
                      <img
                        src={pub.image}
                        alt={pub.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = DEFAULT_CHURCH_IMAGE;
                        }}
                      />
                      <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-[#0F2C59] text-white shadow-xs">
                          {pub.category || 'Projet Paroissial'}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Contenu du projet */}
                  <div className={`p-6 sm:p-8 flex-1 flex flex-col justify-between space-y-6 ${!hasImage ? 'lg:w-full' : ''}`}>
                    <div className="space-y-4">
                      {/* Métadonnées & Badges statut/budget */}
                      <div className="flex flex-wrap items-center gap-2">
                        {pub.projectStatus && (
                          <span className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase border ${statusBadgeClass}`}>
                            {pub.projectStatus}
                          </span>
                        )}

                        {pub.category && (
                          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold uppercase bg-[#0F2C59]/10 text-[#0F2C59]">
                            {pub.category}
                          </span>
                        )}

                        {pub.budget && (
                          <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full text-xs font-semibold">
                            <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Budget / Partenaire : <strong>{pub.budget}</strong></span>
                          </span>
                        )}

                        {pub.targetGoal && (
                          <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-800 border border-blue-200 rounded-full text-xs font-semibold">
                            <Target className="w-3.5 h-3.5 text-blue-600" />
                            <span>Objectif : <strong>{pub.targetGoal}</strong></span>
                          </span>
                        )}

                        <span className="text-xs text-slate-400 flex items-center gap-1 ml-auto">
                          <Calendar className="w-3.5 h-3.5" />
                          {pub.date}
                        </span>
                      </div>

                      {/* Titre */}
                      <h3 className="text-2xl sm:text-3xl font-bold font-display text-slate-900 leading-snug">
                        {pub.title}
                      </h3>

                      {/* Résumé d'accroche */}
                      {pub.summary && (
                        <p className="text-sm font-medium text-slate-700 italic border-l-3 border-[#D4AF37] pl-3 py-0.5">
                          {pub.summary}
                        </p>
                      )}

                      {/* Impact & Métriques Clés */}
                      {pub.impactMetrics && pub.impactMetrics.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                          {pub.impactMetrics.map((metric, idx) => (
                            <div key={idx} className="rounded-2xl bg-amber-50/50 border border-amber-200/60 p-3.5 text-center shadow-xs">
                              <div className="text-xl sm:text-2xl font-black text-[#0F2C59] font-display">
                                {metric.value}
                              </div>
                              <div className="text-xs text-slate-600 font-semibold mt-0.5">
                                {metric.label}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Citation pastorale officielle */}
                      {pub.pastorQuote && (
                        <blockquote className="my-3 p-4 sm:p-5 rounded-2xl bg-amber-50/70 border-l-4 border-[#D4AF37] space-y-2">
                          <div className="flex items-start gap-2.5">
                            <Quote className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" />
                            <p className="text-sm font-medium italic text-slate-800 leading-relaxed">
                              « {typeof pub.pastorQuote === 'string' ? pub.pastorQuote : pub.pastorQuote.text} »
                            </p>
                          </div>
                          {typeof pub.pastorQuote === 'object' && pub.pastorQuote.author && (
                            <p className="text-xs font-bold text-[#0F2C59] pl-7">
                              — {pub.pastorQuote.author}
                            </p>
                          )}
                        </blockquote>
                      )}

                      {/* Rendu du contenu : mode HTML personnalisé ou mode texte formatté */}
                      {pub.editorMode === 'html' ? (
                        <div 
                          className="prose prose-sm max-w-none text-slate-700 leading-relaxed pt-2"
                          dangerouslySetInnerHTML={{ __html: pub.content }}
                        />
                      ) : (
                        <div className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap pt-2">
                          {pub.content}
                        </div>
                      )}

                      {/* Bouton vers le lien officiel externe */}
                      {pub.externalUrl && (
                        <div className="pt-2">
                          <a
                            href={pub.externalUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-[#0F2C59] border border-[#D4AF37]/60 text-xs font-bold transition-all shadow-xs group"
                          >
                            <Sun className="w-4 h-4 text-[#D4AF37]" />
                            <span>Consulter la page officielle du partenariat sur Honnold Foundation</span>
                            <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-[#0F2C59]" />
                          </a>
                        </div>
                      )}
                    </div>

                    {/* Footer de la carte */}
                    <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <User className="w-3.5 h-3.5 text-[#D4AF37]" />
                        <span>Porté par : <strong className="text-slate-700">{pub.author || 'Secrétariat de l\'Église'}</strong></span>
                      </div>

                      <div className="flex flex-wrap items-center gap-3">
                        {pub.externalUrl && (
                          <a
                            href={pub.externalUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-[#0F2C59] hover:text-[#B38E22] hover:underline"
                          >
                            <span>Lien externe officiel</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}

                        <button
                          onClick={onOpenDonationModal}
                          className="inline-flex items-center gap-2 rounded-xl bg-[#0F2C59] px-5 py-2.5 text-xs font-bold text-white hover:bg-[#1A3D73] transition-colors self-start sm:self-auto shrink-0 shadow-sm cursor-pointer"
                        >
                          <Heart className="h-3.5 w-3.5 text-[#D4AF37]" />
                          <span>Soutenir ce projet</span>
                          <ArrowRight className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="p-8 rounded-2xl bg-slate-50 border border-dashed border-slate-200 text-center space-y-2">
            <Briefcase className="h-8 w-8 text-slate-400 mx-auto" />
            <p className="text-sm font-semibold text-slate-700">Aucun projet dynamique n'est encore publié.</p>
            <p className="text-xs text-slate-500">Les nouveaux projets publiés depuis l'Espace Secrétariat s'afficheront directement ici.</p>
          </div>
        )}
      </section>

      {/* 3. Projets Historiques & Partenariats Stratégiques */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="border-b border-slate-200 pb-4">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-blue-100 text-[#0F2C59] rounded-lg">
              <Building2 className="w-4 h-4" />
            </span>
            <span className="text-xs uppercase tracking-widest text-[#0F2C59] font-bold">
              Programmes Sociaux Fondateurs
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-display text-slate-900 mt-1">
            Partenariats Humanitaires & Développement
          </h2>
        </div>

        {SOCIAL_PROJECTS.map((project) => {
          const isDigicel = project.id === 'elevage-caprin';
          const isHonnold = project.id === 'energie-solaire-honnold';
          return (
            <div
              key={project.id}
              className={`rounded-3xl border overflow-hidden transition-all ${
                isHonnold
                  ? 'border-[#D4AF37] bg-gradient-to-br from-white via-amber-50/30 to-white shadow-md'
                  : isDigicel 
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

                  <div className="flex flex-wrap items-center gap-3 self-start sm:self-auto shrink-0">
                    {project.externalUrl && (
                      <a
                        href={project.externalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-xl border border-[#D4AF37]/60 bg-amber-50/80 px-4 py-2.5 text-xs font-bold text-[#0F2C59] hover:bg-amber-100 transition-colors shadow-xs"
                      >
                        <Sun className="h-3.5 w-3.5 text-[#D4AF37]" />
                        <span>Fiche officielle</span>
                        <ExternalLink className="h-3.5 w-3.5 text-slate-500" />
                      </a>
                    )}

                    <button
                      onClick={onOpenDonationModal}
                      className="inline-flex items-center gap-2 rounded-xl bg-[#0F2C59] px-5 py-2.5 text-xs font-bold text-white hover:bg-[#1A3D73] transition-colors shadow-sm cursor-pointer"
                    >
                      Soutenir ce projet
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-4xl">
                  {project.description}
                </p>

                {/* Citation pastorale si disponible */}
                {project.pastorQuote && (
                  <blockquote className="p-4 sm:p-5 rounded-2xl bg-amber-50/80 border-l-4 border-[#D4AF37] space-y-2">
                    <div className="flex items-start gap-2.5">
                      <Quote className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" />
                      <p className="text-sm font-medium italic text-slate-800 leading-relaxed">
                        « {project.pastorQuote.text} »
                      </p>
                    </div>
                    <p className="text-xs font-bold text-[#0F2C59] pl-7">
                      — {project.pastorQuote.author}
                    </p>
                  </blockquote>
                )}

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

                {/* Lien externe Honnold Foundation */}
                {project.externalUrl && (
                  <div className="pt-2">
                    <a
                      href={project.externalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-xs font-bold text-[#0F2C59] hover:text-[#B38E22] hover:underline"
                    >
                      <span>Visiter la page partenaire sur HonnoldFoundation.org</span>
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Emplacement publicitaire Google AdSense sur projet communautaire */}
        <AdSenseUnit slot="7382968203" format="auto" />
      </section>

      {/* 4. Callout Partners */}
      <section className="bg-slate-50 py-12 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <span className="text-xs uppercase tracking-widest text-slate-400 font-bold">
            Partenariats Stratégiques Reconnus
          </span>
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-16 grayscale hover:grayscale-0 transition-all opacity-80">
            <div className="font-display font-bold text-lg sm:text-xl text-slate-700">
              Honnold Foundation <span className="text-xs block text-slate-400 font-sans font-normal">(Énergie Solaire 2026)</span>
            </div>
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
