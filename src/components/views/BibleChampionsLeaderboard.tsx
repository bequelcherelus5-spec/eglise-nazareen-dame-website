import React, { useState, useEffect } from 'react';
import { 
  Trophy, 
  Medal, 
  Award, 
  Crown, 
  Share2, 
  Copy, 
  Check, 
  ExternalLink, 
  Facebook, 
  Youtube, 
  Sparkles, 
  Filter, 
  Users, 
  Flame, 
  ShieldCheck, 
  Heart,
  Send,
  Gamepad2
} from 'lucide-react';
import { GameType, GameAudience } from '../../types';

export interface ChampionEntry {
  id: string;
  name: string;
  score: number;
  accuracy: number; // percentage, e.g. 96
  gameType: GameType | 'global';
  gameLabel: string;
  audience: GameAudience;
  audienceLabel: string;
  titleBadge: string;
  date: string;
  isUserSubmission?: boolean;
}

const STORAGE_CHAMPIONS_KEY = 'dame_bible_champions_v2';

const DEFAULT_CHURCH_CHAMPIONS: ChampionEntry[] = [
  {
    id: 'champ-1',
    name: 'Jean-Baptiste M.',
    score: 1450,
    accuracy: 100,
    gameType: 'quiz',
    gameLabel: 'Quiz Biblique',
    audience: 'adultes',
    audienceLabel: 'Adultes',
    titleBadge: 'Maître des Écritures',
    date: '08/03/2026'
  },
  {
    id: 'champ-2',
    name: 'Ruth C.',
    score: 1320,
    accuracy: 96,
    gameType: 'memoire',
    gameLabel: 'Défi Mémoire',
    audience: 'jeunesse',
    audienceLabel: 'Jeunesse JNI',
    titleBadge: 'Mémoire d’Or',
    date: '07/03/2026'
  },
  {
    id: 'champ-3',
    name: 'Samuel E.',
    score: 1210,
    accuracy: 94,
    gameType: 'qui-suis-je',
    gameLabel: 'Qui suis-je ?',
    audience: 'jeunesse',
    audienceLabel: 'Jeunesse JNI',
    titleBadge: 'Explorateur Biblique',
    date: '06/03/2026'
  },
  {
    id: 'champ-4',
    name: 'Esther P.',
    score: 1100,
    accuracy: 90,
    gameType: 'quiz',
    gameLabel: 'Quiz Biblique',
    audience: 'jeunesse',
    audienceLabel: 'Jeunesse JNI',
    titleBadge: 'Cœur Sanctifié',
    date: '05/03/2026'
  },
  {
    id: 'champ-5',
    name: 'David N.',
    score: 980,
    accuracy: 88,
    gameType: 'vrai-faux',
    gameLabel: 'Vrai ou Faux',
    audience: 'adultes',
    audienceLabel: 'Adultes',
    titleBadge: 'Disciple Zélé',
    date: '04/03/2026'
  },
  {
    id: 'champ-6',
    name: 'Marie-Josée F.',
    score: 940,
    accuracy: 86,
    gameType: 'completer',
    gameLabel: 'Textes à trous',
    audience: 'enfants',
    audienceLabel: 'École du Dimanche',
    titleBadge: 'Petite Étoile de Damé',
    date: '03/03/2026'
  },
  {
    id: 'champ-7',
    name: 'Jonathan T.',
    score: 890,
    accuracy: 84,
    gameType: 'memoire',
    gameLabel: 'Défi Mémoire',
    audience: 'jeunesse',
    audienceLabel: 'Jeunesse JNI',
    titleBadge: 'Flambeau de la Foi',
    date: '02/03/2026'
  },
  {
    id: 'champ-8',
    name: 'Naomi S.',
    score: 850,
    accuracy: 82,
    gameType: 'verset',
    gameLabel: 'Versets Clés',
    audience: 'adultes',
    audienceLabel: 'Adultes',
    titleBadge: 'Servante Dévouée',
    date: '01/03/2026'
  }
];

interface BibleChampionsLeaderboardProps {
  isDark: boolean;
  isSepia: boolean;
  onPlayAgain?: () => void;
  recentScore?: {
    playerName: string;
    score: number;
    gameType: GameType;
    audience: GameAudience;
    correctAnswers: number;
    totalQuestions: number;
  };
}

export const BibleChampionsLeaderboard: React.FC<BibleChampionsLeaderboardProps> = ({
  isDark,
  isSepia,
  onPlayAgain,
  recentScore
}) => {
  const [champions, setChampions] = useState<ChampionEntry[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_CHAMPIONS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // Ignore
    }
    return DEFAULT_CHURCH_CHAMPIONS;
  });

  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [hasSavedRecentScore, setHasSavedRecentScore] = useState(false);
  const [submissionSuccessMsg, setSubmissionSuccessMsg] = useState('');

  // Social Share states
  const [copiedLink, setCopiedLink] = useState(false);

  // Sync to localStorage
  const saveChampionsToStorage = (list: ChampionEntry[]) => {
    try {
      localStorage.setItem(STORAGE_CHAMPIONS_KEY, JSON.stringify(list));
    } catch {
      // Ignore
    }
  };

  // Register recent score into leaderboard
  const handleRegisterRecentScore = () => {
    if (!recentScore || hasSavedRecentScore) return;

    const gameLabels: Record<string, string> = {
      quiz: 'Quiz Biblique',
      verset: 'Versets Clés',
      'qui-suis-je': 'Qui suis-je ?',
      completer: 'Textes à trous',
      'vrai-faux': 'Vrai ou Faux',
      memoire: 'Défi Mémoire'
    };

    const audienceLabels: Record<string, string> = {
      enfants: 'École du Dimanche',
      jeunesse: 'Jeunesse JNI',
      adultes: 'Adultes'
    };

    const accuracy = recentScore.totalQuestions > 0 
      ? Math.round((recentScore.correctAnswers / recentScore.totalQuestions) * 100) 
      : 90;

    let badge = 'Disciple de Damé';
    if (recentScore.score >= 1200) badge = 'Érudit de la Parole';
    else if (recentScore.score >= 800) badge = 'Flambeau Zélé';
    else if (recentScore.score >= 500) badge = 'Ami de la Bible';

    const newEntry: ChampionEntry = {
      id: 'champ-' + Date.now(),
      name: recentScore.playerName || 'Membre de Damé',
      score: recentScore.score,
      accuracy,
      gameType: recentScore.gameType,
      gameLabel: gameLabels[recentScore.gameType] || 'Jeu Biblique',
      audience: recentScore.audience,
      audienceLabel: audienceLabels[recentScore.audience] || 'Tous',
      titleBadge: badge,
      date: new Date().toLocaleDateString('fr-FR'),
      isUserSubmission: true
    };

    const updated = [...champions, newEntry].sort((a, b) => b.score - a.score);
    setChampions(updated);
    saveChampionsToStorage(updated);
    setHasSavedRecentScore(true);
    setSubmissionSuccessMsg(`Gloire à Dieu ! Votre score de ${recentScore.score} pts a été inscrit au Tableau des Champions.`);
  };

  // Filter champions
  const filteredChampions = champions.filter((c) => {
    if (selectedFilter === 'all') return true;
    return c.gameType === selectedFilter;
  });

  // Top 3 Podium
  const topThree = filteredChampions.slice(0, 3);
  const remainingList = filteredChampions.slice(3);

  // Social sharing helpers
  const challengeUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/#jeux-bibliques` 
    : 'https://www.eglisedunazareendedame.org/#jeux-bibliques';

  const shareText = `🕊️ Défi Jeux Bibliques — Église du Nazaréen de Damé : J'ai relevé le défi de la Parole de Dieu ! Peux-tu battre les meilleurs scores au Tableau des Champions ? Rejoins-nous : ${challengeUrl}`;

  const handleCopyLink = () => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(challengeUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 3000);
    }
  };

  const handleShareWhatsApp = () => {
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleShareFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(challengeUrl)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // Surface stylings
  const cardBgClass = isDark
    ? 'bg-[#132238] border-slate-700/80 text-slate-100 shadow-xl'
    : isSepia
    ? 'bg-[#FDFBF7] border-[#E2D8CC] text-[#2C2416] shadow-sm'
    : 'bg-white border-slate-200 text-slate-800 shadow-sm';

  const boxBgClass = isDark
    ? 'bg-[#182942] border-slate-700 text-slate-100'
    : isSepia
    ? 'bg-[#F7F2E7] border-[#DFD3C3] text-[#241C10]'
    : 'bg-slate-50 border-slate-200 text-slate-900';

  return (
    <div className="space-y-8 animate-fade-in">
      {/* 1. Header Banner of Tableau des Champions */}
      <div className={`rounded-3xl border p-6 sm:p-8 transition-colors ${cardBgClass}`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-700/30">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#D4AF37]/20 px-3 py-1 text-xs font-bold text-[#D4AF37]">
              <Trophy className="h-3.5 w-3.5" />
              Compétition Fraternelle & Amicale
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-display">
              Tableau des Champions Bibliques
            </h2>
            <p className={`text-xs sm:text-sm ${isDark ? 'text-slate-300' : isSepia ? 'text-[#5C4D3B]' : 'text-slate-600'}`}>
              Célébrons la diligence des membres et enfants de l'Église de Damé qui scrutent et mémorisent les Saintes Écritures.
            </p>
          </div>

          {/* Prompt to register recent score if available */}
          {recentScore && !hasSavedRecentScore && recentScore.score > 0 && (
            <div className="shrink-0">
              <button
                type="button"
                onClick={handleRegisterRecentScore}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#D4AF37] hover:bg-[#c49e29] text-slate-950 font-bold text-xs shadow-lg transition-transform hover:scale-105 cursor-pointer"
              >
                <Sparkles className="h-4 w-4" />
                <span>Inscrire mon score ({recentScore.score} pts)</span>
              </button>
            </div>
          )}
        </div>

        {submissionSuccessMsg && (
          <div className="mt-4 p-3.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-fade-in">
            <Check className="h-4 w-4 shrink-0 text-emerald-400" />
            <span>{submissionSuccessMsg}</span>
          </div>
        )}

        {/* Filters by Game Type */}
        <div className="mt-6 flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#D4AF37] mr-2">
            <Filter className="h-3.5 w-3.5" />
            <span>Filtrer :</span>
          </div>
          {[
            { id: 'all', label: 'Tous les Jeux' },
            { id: 'quiz', label: 'Quiz Biblique' },
            { id: 'qui-suis-je', label: 'Qui suis-je ?' },
            { id: 'memoire', label: 'Défi Mémoire' },
            { id: 'verset', label: 'Versets Clés' },
            { id: 'vrai-faux', label: 'Vrai ou Faux' },
            { id: 'completer', label: 'Textes à trous' }
          ].map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setSelectedFilter(f.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                selectedFilter === f.id
                  ? 'bg-[#D4AF37] text-slate-950 font-bold shadow-xs'
                  : isDark
                  ? 'bg-slate-800/80 hover:bg-slate-700 text-slate-300'
                  : isSepia
                  ? 'bg-[#EAE0D3] hover:bg-[#DFD3C3] text-[#4A3926]'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* 2. Top 3 Champions Podium */}
        {topThree.length > 0 && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* 2nd Place */}
            {topThree[1] && (
              <div className={`order-2 md:order-1 rounded-2xl p-5 border text-center relative flex flex-col justify-between ${boxBgClass} border-slate-300/60 dark:border-slate-700`}>
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-slate-300 dark:bg-slate-600 text-slate-900 dark:text-white px-3 py-0.5 rounded-full text-[11px] font-extrabold flex items-center gap-1 shadow">
                  <Medal className="h-3.5 w-3.5 text-slate-200" />
                  <span>2ème Place</span>
                </div>
                <div className="pt-3 space-y-1">
                  <div className="h-12 w-12 mx-auto rounded-full bg-slate-400/20 flex items-center justify-center text-slate-300 font-bold text-base mb-2">
                    🥈
                  </div>
                  <h3 className="font-bold text-sm sm:text-base font-display">{topThree[1].name}</h3>
                  <span className="inline-block px-2 py-0.5 rounded-md bg-[#D4AF37]/15 text-[#D4AF37] text-[10px] font-bold">
                    {topThree[1].titleBadge}
                  </span>
                  <p className="text-xs text-slate-400">{topThree[1].gameLabel} • {topThree[1].audienceLabel}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-700/40">
                  <span className="text-lg font-extrabold text-[#D4AF37] block">{topThree[1].score} pts</span>
                  <span className="text-[11px] text-slate-400">{topThree[1].accuracy}% de réussite</span>
                </div>
              </div>
            )}

            {/* 1st Place (Center / Highlighted) */}
            {topThree[0] && (
              <div className={`order-1 md:order-2 rounded-2xl p-6 border-2 text-center relative flex flex-col justify-between ${
                isDark 
                  ? 'bg-gradient-to-b from-[#1E2E4A] to-[#122038] border-[#D4AF37]' 
                  : isSepia
                  ? 'bg-gradient-to-b from-[#FFFDF8] to-[#F5ECE0] border-[#D4AF37]'
                  : 'bg-gradient-to-b from-amber-50/50 to-white border-[#D4AF37]'
              } shadow-xl scale-102`}>
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#D4AF37] text-slate-950 px-4 py-1 rounded-full text-xs font-extrabold flex items-center gap-1.5 shadow-md">
                  <Crown className="h-4 w-4 text-slate-950" />
                  <span>Grand Champion</span>
                </div>
                <div className="pt-3 space-y-1.5">
                  <div className="h-14 w-14 mx-auto rounded-full bg-[#D4AF37]/25 border-2 border-[#D4AF37] flex items-center justify-center text-xl mb-2 shadow-inner">
                    🥇
                  </div>
                  <h3 className="font-extrabold text-base sm:text-lg font-display text-[#D4AF37]">
                    {topThree[0].name}
                  </h3>
                  <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#D4AF37] text-slate-950 text-[11px] font-extrabold shadow-xs">
                    {topThree[0].titleBadge}
                  </span>
                  <p className="text-xs text-slate-300 font-medium">
                    {topThree[0].gameLabel} • {topThree[0].audienceLabel}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-[#D4AF37]/40">
                  <span className="text-2xl font-black text-[#D4AF37] block tracking-wide">
                    {topThree[0].score} pts
                  </span>
                  <span className="text-xs font-semibold text-emerald-400">
                    ★ {topThree[0].accuracy}% de précision
                  </span>
                </div>
              </div>
            )}

            {/* 3rd Place */}
            {topThree[2] && (
              <div className={`order-3 rounded-2xl p-5 border text-center relative flex flex-col justify-between ${boxBgClass} border-amber-700/40`}>
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-700/80 text-white px-3 py-0.5 rounded-full text-[11px] font-extrabold flex items-center gap-1 shadow">
                  <Award className="h-3.5 w-3.5 text-amber-200" />
                  <span>3ème Place</span>
                </div>
                <div className="pt-3 space-y-1">
                  <div className="h-12 w-12 mx-auto rounded-full bg-amber-700/20 flex items-center justify-center text-amber-600 font-bold text-base mb-2">
                    🥉
                  </div>
                  <h3 className="font-bold text-sm sm:text-base font-display">{topThree[2].name}</h3>
                  <span className="inline-block px-2 py-0.5 rounded-md bg-[#D4AF37]/15 text-[#D4AF37] text-[10px] font-bold">
                    {topThree[2].titleBadge}
                  </span>
                  <p className="text-xs text-slate-400">{topThree[2].gameLabel} • {topThree[2].audienceLabel}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-700/40">
                  <span className="text-lg font-extrabold text-[#D4AF37] block">{topThree[2].score} pts</span>
                  <span className="text-[11px] text-slate-400">{topThree[2].accuracy}% de réussite</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 3. Full Ranking Table */}
        <div className="mt-8 space-y-3">
          <h4 className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : isSepia ? 'text-[#5C4D3B]' : 'text-slate-500'}`}>
            Classement Général ({filteredChampions.length} champions) :
          </h4>

          <div className="overflow-x-auto rounded-2xl border border-slate-700/40">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className={`border-b ${isDark ? 'bg-[#182942] text-slate-300 border-slate-700' : isSepia ? 'bg-[#EDE4D6] text-[#4A3926] border-[#DFD3C3]' : 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                  <th className="py-3 px-4 font-bold">Rang</th>
                  <th className="py-3 px-4 font-bold">Disciple / Joueur</th>
                  <th className="py-3 px-4 font-bold">Jeu Biblique</th>
                  <th className="py-3 px-4 font-bold">Catégorie</th>
                  <th className="py-3 px-4 font-bold">Titre Honorifique</th>
                  <th className="py-3 px-4 font-bold text-right">Score</th>
                  <th className="py-3 px-4 font-bold text-right">Précision</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isDark ? 'divide-slate-800' : isSepia ? 'divide-[#E8DDD0]' : 'divide-slate-200'}`}>
                {filteredChampions.map((c, idx) => (
                  <tr 
                    key={c.id} 
                    className={`transition-colors ${
                      c.isUserSubmission 
                        ? isDark ? 'bg-amber-500/10' : 'bg-amber-50' 
                        : isDark ? 'hover:bg-slate-800/60' : isSepia ? 'hover:bg-[#FAF4EB]' : 'hover:bg-slate-50'
                    }`}
                  >
                    <td className="py-3 px-4 font-bold">
                      <span className={`inline-flex items-center justify-center h-6 w-6 rounded-full text-xs font-extrabold ${
                        idx === 0 
                          ? 'bg-[#D4AF37] text-slate-950' 
                          : idx === 1 
                          ? 'bg-slate-300 text-slate-900' 
                          : idx === 2 
                          ? 'bg-amber-700 text-white' 
                          : isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-200 text-slate-700'
                      }`}>
                        {idx + 1}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-bold">
                      <div className="flex items-center gap-1.5">
                        <span>{c.name}</span>
                        {c.isUserSubmission && (
                          <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded font-bold">
                            Vous
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-400 font-medium">{c.gameLabel}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full bg-slate-700/40 text-[11px] font-semibold">
                        {c.audienceLabel}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-[11px] text-[#D4AF37] font-semibold">
                        {c.titleBadge}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-extrabold text-[#D4AF37] text-sm">
                      {c.score} pts
                    </td>
                    <td className="py-3 px-4 text-right font-semibold text-emerald-400">
                      {c.accuracy}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 4. Social Sharing & Official Community Channels Section */}
      <div className={`rounded-3xl border p-6 sm:p-8 transition-colors ${cardBgClass}`}>
        <div className="flex items-center gap-2 mb-2">
          <Share2 className="h-5 w-5 text-[#D4AF37]" />
          <h3 className="text-lg sm:text-xl font-bold font-display">
            Partage Social & Défi Fraternel
          </h3>
        </div>
        <p className={`text-xs sm:text-sm mb-6 ${isDark ? 'text-slate-300' : isSepia ? 'text-[#5C4D3B]' : 'text-slate-600'}`}>
          Partagez vos victoires et invitez votre famille, vos amis et les jeunes de votre communauté à découvrir la richesse de la Bible !
        </p>

        {/* Share buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
          {/* WhatsApp Share */}
          <button
            type="button"
            onClick={handleShareWhatsApp}
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs font-bold transition-all shadow-md cursor-pointer group"
            title="Défier des amis sur WhatsApp"
          >
            <Send className="h-4 w-4 group-hover:scale-110 transition-transform" />
            <span>Partager sur WhatsApp</span>
          </button>

          {/* Facebook Share */}
          <button
            type="button"
            onClick={handleShareFacebook}
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-[#1877F2] hover:bg-[#1464cc] text-white text-xs font-bold transition-all shadow-md cursor-pointer group"
            title="Partager sur Facebook"
          >
            <Facebook className="h-4 w-4 group-hover:scale-110 transition-transform" />
            <span>Partager sur Facebook</span>
          </button>

          {/* Copy Link */}
          <button
            type="button"
            onClick={handleCopyLink}
            className={`flex items-center justify-center gap-2 px-4 py-3 rounded-2xl border text-xs font-bold transition-all shadow-sm cursor-pointer ${
              copiedLink 
                ? 'bg-emerald-600 text-white border-emerald-600' 
                : isDark 
                ? 'bg-slate-800 hover:bg-slate-700 text-slate-100 border-slate-700' 
                : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300'
            }`}
            title="Copier le lien direct vers les jeux"
          >
            {copiedLink ? <Check className="h-4 w-4 text-white" /> : <Copy className="h-4 w-4 text-[#D4AF37]" />}
            <span>{copiedLink ? 'Lien copié dans le presse-papiers !' : 'Copier le lien du défi'}</span>
          </button>
        </div>

        {/* Official Church Channels Cards */}
        <div className="pt-6 border-t border-slate-700/40">
          <div className="flex items-center gap-2 mb-3">
            <Heart className="h-4 w-4 text-[#D4AF37]" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Canaux Officiels de l'Église du Nazaréen de Damé :
            </h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Facebook Card */}
            <a
              href="https://www.facebook.com/profile.php?id=61586834645549"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-4 rounded-2xl bg-[#1877F2]/10 hover:bg-[#1877F2]/20 border border-[#1877F2]/30 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-[#1877F2] text-white flex items-center justify-center shadow">
                  <Facebook className="h-5 w-5" />
                </div>
                <div>
                  <h5 className="font-bold text-xs sm:text-sm text-white group-hover:text-blue-200 transition-colors">
                    Page Facebook Officielle
                  </h5>
                  <p className="text-[11px] text-slate-400">
                    Annonces paroissiales, photos des cultes et actualités
                  </p>
                </div>
              </div>
              <ExternalLink className="h-4 w-4 text-[#1877F2] shrink-0 group-hover:translate-x-0.5 transition-transform" />
            </a>

            {/* YouTube Card */}
            <a
              href="https://www.youtube.com/@EgliseduNazareenDeDame"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-4 rounded-2xl bg-[#FF0000]/10 hover:bg-[#FF0000]/20 border border-[#FF0000]/30 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-[#FF0000] text-white flex items-center justify-center shadow">
                  <Youtube className="h-5 w-5" />
                </div>
                <div>
                  <h5 className="font-bold text-xs sm:text-sm text-white group-hover:text-rose-200 transition-colors">
                    Chaîne YouTube Officielle
                  </h5>
                  <p className="text-[11px] text-slate-400">
                    Prédications en ligne, louange et diffusions cultuelles
                  </p>
                </div>
              </div>
              <ExternalLink className="h-4 w-4 text-[#FF0000] shrink-0 group-hover:translate-x-0.5 transition-transform" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
