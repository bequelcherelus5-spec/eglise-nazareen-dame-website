import React, { useEffect, useState } from 'react';
import { visitorCounterService, VisitorStats } from '../services/visitorCounterService';
import { 
  Users, 
  Activity, 
  Globe2, 
  HeartHandshake, 
  Radio, 
  Sparkles,
  TrendingUp,
  MapPin
} from 'lucide-react';

interface CommunityEngagementCounterProps {
  variant?: 'hero' | 'compact' | 'full';
  className?: string;
  onNavigateTab?: (tab: string) => void;
}

export const CommunityEngagementCounter: React.FC<CommunityEngagementCounterProps> = ({
  variant = 'full',
  className = '',
  onNavigateTab
}) => {
  const [stats, setStats] = useState<VisitorStats>({
    totalVisits: 1485,
    onlineNow: 4,
    isLive: false
  });
  const [hasIncremented, setHasIncremented] = useState<boolean>(false);

  useEffect(() => {
    // 1. Enregistrer la visite pour cette session
    visitorCounterService.registerVisit();

    // 2. S'abonner aux mises à jour en direct depuis Firestore
    const unsubscribe = visitorCounterService.subscribe((updatedStats) => {
      setStats(prev => {
        if (prev.totalVisits !== updatedStats.totalVisits && prev.totalVisits > 0) {
          setHasIncremented(true);
          setTimeout(() => setHasIncremented(false), 2000);
        }
        return updatedStats;
      });
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // Formatage francophone des nombres (ex: 1 486)
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('fr-FR').format(num);
  };

  if (variant === 'compact') {
    return (
      <div className={`inline-flex items-center gap-3 rounded-full bg-[#081B36]/80 backdrop-blur-md px-4 py-2 border border-[#D4AF37]/30 text-white text-xs shadow-lg ${className}`}>
        <div className="flex items-center gap-1.5">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-emerald-400 font-bold uppercase tracking-wider text-[10px]">En direct</span>
        </div>
        <div className="h-3 w-px bg-white/20" />
        <div className="flex items-center gap-1.5">
          <Globe2 className="h-3.5 w-3.5 text-[#D4AF37]" />
          <span className="font-semibold">{formatNumber(stats.totalVisits)} visites</span>
        </div>
        <div className="h-3 w-px bg-white/20" />
        <div className="flex items-center gap-1.5 text-slate-300">
          <Users className="h-3.5 w-3.5 text-sky-400" />
          <span>{stats.onlineNow} connectés</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`rounded-3xl border border-slate-200/80 bg-white/90 backdrop-blur-md shadow-xl overflow-hidden transition-all ${className}`}>
      {/* Header Bar */}
      <div className="bg-gradient-to-r from-[#081B36] via-[#0F2C59] to-[#173B75] px-6 py-4 text-white flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37]">
            <Radio className="h-5 w-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-widest text-[#D4AF37]">
                Engagement & Rayonnement
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-300 border border-emerald-500/30">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
                Temps Réel
              </span>
            </div>
            <h3 className="text-lg font-bold font-display text-white">
              Activité de la Communauté à Damé & en Diaspora
            </h3>
          </div>
        </div>

        <div className="text-right text-xs text-slate-300 hidden sm:block">
          <p className="flex items-center gap-1 justify-end font-medium">
            <MapPin className="h-3.5 w-3.5 text-[#D4AF37]" />
            3ème Section Damé, Môle-Saint-Nicolas
          </p>
          <p className="text-[11px] text-slate-400">
            Synchronisation Firebase Firestore active
          </p>
        </div>
      </div>

      {/* Stats Counter Grid */}
      <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Compteur de visites en temps réel */}
        <div className="relative rounded-2xl p-4 bg-gradient-to-br from-amber-50/80 to-amber-100/30 border border-amber-200/70 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-amber-900 flex items-center gap-1.5">
              <Globe2 className="h-4 w-4 text-[#D4AF37]" />
              Visites Totales
            </span>
            <span className="text-[10px] uppercase font-bold text-[#D4AF37] bg-white px-2 py-0.5 rounded-full border border-amber-200 shadow-2xs">
              Vérifié
            </span>
          </div>
          
          <div className="flex items-baseline gap-2">
            <span className={`text-3xl font-black font-display tracking-tight text-slate-900 transition-transform duration-300 ${hasIncremented ? 'scale-110 text-[#D4AF37]' : ''}`}>
              {formatNumber(stats.totalVisits)}
            </span>
            <span className="text-xs font-semibold text-emerald-600 flex items-center gap-0.5">
              <TrendingUp className="h-3 w-3" /> +1
            </span>
          </div>
          
          <p className="text-[11px] text-slate-500 mt-1 leading-snug">
            Visiteurs et pèlerins accueillis sur la plateforme officielle de Damé.
          </p>
        </div>

        {/* Metric 2: Personnes en ligne en ce moment */}
        <div className="rounded-2xl p-4 bg-gradient-to-br from-emerald-50/80 to-emerald-100/30 border border-emerald-200/70 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-emerald-900 flex items-center gap-1.5">
              <Activity className="h-4 w-4 text-emerald-600" />
              Connectés en Direct
            </span>
            <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-white px-2 py-0.5 rounded-full border border-emerald-200 shadow-2xs">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
              Live
            </span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black font-display tracking-tight text-slate-900">
              {stats.onlineNow}
            </span>
            <span className="text-xs text-slate-500 font-medium">fidèles & visiteurs</span>
          </div>

          <p className="text-[11px] text-slate-500 mt-1 leading-snug">
            En communion spirituelle simultanée sur notre portail chrétien.
          </p>
        </div>

        {/* Metric 3: Membres & Congrégation active */}
        <div className="rounded-2xl p-4 bg-gradient-to-br from-blue-50/80 to-blue-100/30 border border-blue-200/70 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-blue-900 flex items-center gap-1.5">
              <Users className="h-4 w-4 text-[#0F2C59]" />
              Congrégation de Damé
            </span>
            <span className="text-[10px] uppercase font-bold text-[#0F2C59] bg-white px-2 py-0.5 rounded-full border border-blue-200 shadow-2xs">
              Paroisse
            </span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black font-display tracking-tight text-slate-900">
              350+
            </span>
            <span className="text-xs text-[#0F2C59] font-medium">membres actifs</span>
          </div>

          <p className="text-[11px] text-slate-500 mt-1 leading-snug">
            Âmes engagées dans les cultes, l'école Nazareth, l'EPND et la JNI.
          </p>
        </div>

        {/* Metric 4: Impact & Foi (47 ans d'histoire) */}
        <div className="rounded-2xl p-4 bg-gradient-to-br from-purple-50/80 to-purple-100/30 border border-purple-200/70 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-purple-900 flex items-center gap-1.5">
              <HeartHandshake className="h-4 w-4 text-purple-700" />
              Héritage & Foi
            </span>
            <span className="text-[10px] uppercase font-bold text-purple-800 bg-white px-2 py-0.5 rounded-full border border-purple-200 shadow-2xs">
              Depuis 1979
            </span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black font-display tracking-tight text-slate-900">
              47 ans
            </span>
            <span className="text-xs text-purple-700 font-medium">d'impact local</span>
          </div>

          <p className="text-[11px] text-slate-500 mt-1 leading-snug">
            Évangélisation, sanctification et secours aux familles de la 3ème Section.
          </p>
        </div>
      </div>

      {/* Subtle footer strip with interactive CTA */}
      <div className="bg-slate-50 border-t border-slate-200/80 px-6 py-3 flex flex-wrap items-center justify-between text-xs text-slate-600 gap-3">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-[#D4AF37]" />
          <span>Chaque visite honore le travail de Dieu accompli à Damé depuis le 23 Décembre 1979.</span>
        </div>
        {onNavigateTab && (
          <button
            onClick={() => onNavigateTab('contact')}
            className="font-bold text-[#0F2C59] hover:text-[#D4AF37] transition-colors flex items-center gap-1"
          >
            Localiser le Sanctuaire à Damé &rarr;
          </button>
        )}
      </div>
    </div>
  );
};
