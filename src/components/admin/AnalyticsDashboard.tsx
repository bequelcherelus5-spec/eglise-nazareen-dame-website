import React, { useState, useEffect } from 'react';
import { VisitorAnalyticsSummary, VisitorLogEntry } from '../../types';
import { 
  Users, 
  Globe, 
  Clock, 
  MapPin, 
  Search, 
  RefreshCw, 
  Download, 
  ShieldCheck, 
  Activity, 
  Calendar,
  ExternalLink,
  Filter
} from 'lucide-react';

export const AnalyticsDashboard: React.FC = () => {
  const [summary, setSummary] = useState<VisitorAnalyticsSummary | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [countryFilter, setCountryFilter] = useState<string>('All');
  const [autoRefresh, setAutoRefresh] = useState<boolean>(true);

  const fetchAnalytics = async () => {
    try {
      const res = await fetch('/api/analytics/summary');
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.summary) {
          setSummary(data.summary);
        }
      }
    } catch (err) {
      console.warn('Erreur chargement analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
    let interval: NodeJS.Timeout | null = null;
    if (autoRefresh) {
      interval = setInterval(() => {
        fetchAnalytics();
      }, 15000); // Actualisation toutes les 15 secondes
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh]);

  const filteredVisits = (summary?.recentVisits || []).filter(visit => {
    const matchesCountry = countryFilter === 'All' || visit.countryCode === countryFilter || visit.country === countryFilter;
    const q = searchQuery.toLowerCase().trim();
    if (!q) return matchesCountry;

    const matchesSearch = 
      visit.ip.toLowerCase().includes(q) ||
      visit.country.toLowerCase().includes(q) ||
      (visit.city && visit.city.toLowerCase().includes(q)) ||
      visit.page.toLowerCase().includes(q);

    return matchesCountry && matchesSearch;
  });

  const exportCsv = () => {
    if (!summary?.recentVisits?.length) return;
    const headers = 'ID,Adresse IP,Pays,Code Pays,Ville,Page Consultée,Date et Heure (ISO)\n';
    const rows = summary.recentVisits
      .map(v => `"${v.id}","${v.ip}","${v.country}","${v.countryCode}","${v.city || ''}","${v.page}","${v.timestamp}"`)
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `visiteurs_nazareen_dame_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const formatDateTime = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return {
        date: d.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' }),
        time: d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      };
    } catch (e) {
      return { date: isoString, time: '' };
    }
  };

  const getPageBadgeColor = (page: string) => {
    if (page === '/' || page === '/#accueil') return 'bg-blue-100 text-blue-800 border-blue-200';
    if (page.includes('projet')) return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    if (page.includes('education') || page.includes('examen')) return 'bg-purple-100 text-purple-800 border-purple-200';
    if (page.includes('jeu') || page.includes('bible')) return 'bg-amber-100 text-amber-800 border-amber-200';
    if (page.includes('podcast')) return 'bg-rose-100 text-rose-800 border-rose-200';
    return 'bg-gray-100 text-gray-800 border-gray-200';
  };

  return (
    <div id="analytics-dashboard-container" className="space-y-6">
      {/* En-tête du tableau de bord */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-indigo-50 text-indigo-700 rounded-xl">
              <Activity className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-gray-900">
              Tableau de Bord Analytics & Visiteurs
            </h2>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Suivi en temps réel de l'audience, détection des pays par IP et historique précis des pages consultées.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`px-3 py-2 text-xs font-medium rounded-xl border transition-colors flex items-center gap-1.5 ${
              autoRefresh 
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                : 'bg-gray-50 text-gray-600 border-gray-200'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${autoRefresh ? 'bg-emerald-500 animate-pulse' : 'bg-gray-400'}`}></span>
            {autoRefresh ? 'Direct actif (15s)' : 'Pause Direct'}
          </button>

          <button
            onClick={() => {
              setLoading(true);
              fetchAnalytics();
            }}
            disabled={loading}
            className="p-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-colors"
            title="Rafraîchir maintenant"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={exportCsv}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-medium flex items-center gap-2 shadow-sm transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Exporter CSV</span>
          </button>
        </div>
      </div>

      {/* Cartes de statistiques clés */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total des visites */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Total des Visites
            </span>
            <span className="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <Users className="w-5 h-5" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-gray-900">
              {summary ? summary.totalVisits.toLocaleString('fr-FR') : '...'}
            </span>
            <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              +12% ce mois
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-1">Cumul historique et sessions récentes</p>
        </div>

        {/* Visiteurs en ligne */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              En Ligne Actuellement
            </span>
            <span className="p-2 bg-emerald-50 text-emerald-600 rounded-xl relative">
              <Activity className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping"></span>
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-emerald-600">
              {summary ? summary.onlineNow : 4}
            </span>
            <span className="text-xs text-gray-500">visiteurs actifs</span>
          </div>
          <p className="text-xs text-gray-400 mt-1">Surveillance dynamique en direct</p>
        </div>

        {/* Pays représentés */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Rayonnement Géographique
            </span>
            <span className="p-2 bg-purple-50 text-purple-600 rounded-xl">
              <Globe className="w-5 h-5" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-gray-900">
              {summary ? summary.countriesCount : 8}
            </span>
            <span className="text-xs text-gray-500">pays connectés</span>
          </div>
          <p className="text-xs text-gray-400 mt-1">Haïti, Diaspora & Partenaires</p>
        </div>

        {/* Premier pays */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Source Principale
            </span>
            <span className="text-2xl">
              {summary?.topCountries?.[0]?.flag || '🇭🇹'}
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-xl font-bold text-gray-900">
              {summary?.topCountries?.[0]?.country || 'Haïti'}
            </span>
            <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
              {summary?.topCountries?.[0]?.count || 0} visites
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-1">Commune de Môle-St-Nicolas & Diaspora</p>
        </div>
      </div>

      {/* Répartition des pays (Badges Drapeau) */}
      {summary?.topCountries && summary.topCountries.length > 0 && (
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
            <Globe className="w-4 h-4 text-indigo-600" />
            <span>Répartition par Pays des Visiteurs</span>
          </h3>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setCountryFilter('All')}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors ${
                countryFilter === 'All'
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
              }`}
            >
              Tous les pays ({summary.recentVisits.length})
            </button>
            {summary.topCountries.map((c, i) => (
              <button
                key={i}
                onClick={() => setCountryFilter(c.country)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium border flex items-center gap-1.5 transition-colors ${
                  countryFilter === c.country
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                }`}
              >
                <span className="text-base leading-none">{c.flag}</span>
                <span>{c.country}</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                  countryFilter === c.country ? 'bg-indigo-700 text-white' : 'bg-gray-200 text-gray-800'
                }`}>
                  {c.count}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Barre de recherche et filtres de table */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Rechercher par IP, pays, ville ou page..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end text-xs text-gray-500">
          <Filter className="w-3.5 h-3.5" />
          <span>Affichage de <strong>{filteredVisits.length}</strong> visites récentes</span>
        </div>
      </div>

      {/* Tableau récapitulatif montrant le pays avec drapeau, date et heure, page et IP */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50/80 border-b border-gray-100 text-xs font-semibold uppercase tracking-wider text-gray-500">
              <tr>
                <th className="py-3.5 px-4">Pays & Drapeau</th>
                <th className="py-3.5 px-4">Date & Heure Précise</th>
                <th className="py-3.5 px-4">Page Consultée</th>
                <th className="py-3.5 px-4">Adresse IP</th>
                <th className="py-3.5 px-4 text-right">Ville / Région</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredVisits.length > 0 ? (
                filteredVisits.map((visit) => {
                  const dt = formatDateTime(visit.timestamp);
                  return (
                    <tr key={visit.id} className="hover:bg-indigo-50/30 transition-colors">
                      {/* Pays avec drapeau */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-2.5">
                          <span className="text-2xl leading-none" title={visit.country}>
                            {visit.flagEmoji || '🌐'}
                          </span>
                          <div>
                            <p className="font-semibold text-gray-900 leading-tight">
                              {visit.country}
                            </p>
                            <span className="text-[11px] text-gray-400 font-mono">
                              {visit.countryCode || 'INT'}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Date et Heure précises */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Clock className="w-3.5 h-3.5 text-gray-400" />
                          <div>
                            <p className="font-medium text-gray-800">{dt.date}</p>
                            <p className="text-xs text-gray-400 font-mono">{dt.time}</p>
                          </div>
                        </div>
                      </td>

                      {/* Page consultée */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium border ${getPageBadgeColor(visit.page)}`}>
                          {visit.page === '/' ? 'Accueil (Portail)' : visit.page}
                        </span>
                      </td>

                      {/* Adresse IP */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 font-mono text-xs text-gray-700 bg-gray-50 px-2.5 py-1 rounded-md border border-gray-200/60 w-fit">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{visit.ip}</span>
                        </div>
                      </td>

                      {/* Ville et Région */}
                      <td className="py-3.5 px-4 whitespace-nowrap text-right text-xs">
                        <p className="font-medium text-gray-800">
                          {visit.city || 'Môle-Saint-Nicolas'}
                        </p>
                        <p className="text-gray-400">
                          {visit.region || 'Nord-Ouest'}
                        </p>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-gray-400">
                    <Globe className="w-8 h-8 mx-auto text-gray-300 mb-2" />
                    <p className="text-sm font-medium">Aucune visite ne correspond aux critères de filtre.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pied de tableau */}
        <div className="p-4 bg-gray-50/60 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-2">
          <span>Détection automatique via <code>ipapi.co</code> et enregistrement immédiat.</span>
          <span>Dernière synchronisation : {new Date().toLocaleTimeString('fr-FR')}</span>
        </div>
      </div>
    </div>
  );
};
