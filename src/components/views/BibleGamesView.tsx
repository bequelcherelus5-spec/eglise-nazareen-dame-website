import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  GameType, 
  GameDifficulty, 
  GameAudience, 
  QuizQuestion, 
  PlayerScore, 
  GameSessionResult 
} from '../../types';
import { BIBLE_QUESTIONS_POOL, MEMORY_CARDS_PAIRS } from '../../data/bibleGamesData';
import { sounds } from '../../utils/soundEffects';
import { 
  Gamepad2, 
  Trophy, 
  Clock, 
  Users, 
  Sparkles, 
  RotateCcw, 
  CheckCircle2, 
  XCircle, 
  Award, 
  HelpCircle, 
  Volume2, 
  VolumeX, 
  Flame, 
  ArrowRight,
  ShieldAlert,
  Ship,
  Waves,
  Scroll,
  Mountain,
  Crown,
  Sun,
  UserCheck,
  Shield,
  Cross
} from 'lucide-react';

const STORAGE_LEADERBOARD_KEY = 'dame_bible_games_leaderboard';

export const BibleGamesView: React.FC = () => {
  // Game Setup State
  const [gameMode, setGameMode] = useState<'lobby' | 'playing' | 'gameover'>('lobby');
  const [gameType, setGameType] = useState<GameType>('quiz');
  const [difficulty, setDifficulty] = useState<GameDifficulty>('moyen');
  const [audience, setAudience] = useState<GameAudience>('jeunesse');
  
  // Players configuration (1 to 10 players)
  const [playerCount, setPlayerCount] = useState<number>(1);
  const [playerNames, setPlayerNames] = useState<string[]>(['Joueur 1', 'Joueur 2']);
  const [currentPlayerIdx, setCurrentPlayerIdx] = useState<number>(0);
  const [playersScores, setPlayersScores] = useState<PlayerScore[]>([]);

  // Sound toggle
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Question / Game session state
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<any>(null);
  const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);
  const [clueRevealedCount, setClueRevealedCount] = useState<number>(1);

  // Timer
  const [timeLeft, setTimeLeft] = useState<number>(20);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Memory Game state
  const [memoryCards, setMemoryCards] = useState<any[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matchedCardIds, setMatchedCardIds] = useState<number[]>([]);
  const [memoryMoves, setMemoryMoves] = useState<number>(0);

  // Leaderboard saved sessions
  const [leaderboard, setLeaderboard] = useState<GameSessionResult[]>([]);

  // Toggle sound
  const handleToggleSound = () => {
    sounds.enabled = !soundEnabled;
    setSoundEnabled(!soundEnabled);
  };

  // Load Leaderboard on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_LEADERBOARD_KEY);
      if (saved) {
        setLeaderboard(JSON.parse(saved));
      }
    } catch {
      // Ignore
    }
  }, []);

  // Update player names array when count changes
  const handlePlayerCountChange = (count: number) => {
    setPlayerCount(count);
    const newNames = [...playerNames];
    for (let i = newNames.length; i < count; i++) {
      newNames.push(`Joueur ${i + 1}`);
    }
    setPlayerNames(newNames.slice(0, count));
  };

  const handlePlayerNameChange = (idx: number, name: string) => {
    const updated = [...playerNames];
    updated[idx] = name;
    setPlayerNames(updated);
  };

  // Start the game
  const startGame = () => {
    sounds.playClick();

    // Initialize player scores
    const initialScores: PlayerScore[] = Array.from({ length: playerCount }).map((_, i) => ({
      name: playerNames[i]?.trim() || `Joueur ${i + 1}`,
      score: 0,
      correctAnswers: 0,
      totalQuestions: 0,
      timeSpentSeconds: 0
    }));
    setPlayersScores(initialScores);
    setCurrentPlayerIdx(0);

    if (gameType === 'memoire') {
      // Setup memory game: take 6 pairs (12 cards) and shuffle
      const pairCount = difficulty === 'facile' ? 4 : difficulty === 'moyen' ? 6 : 6;
      const selectedPairs = MEMORY_CARDS_PAIRS.slice(0, pairCount * 2);
      const shuffled = [...selectedPairs].sort(() => Math.random() - 0.5);
      setMemoryCards(shuffled);
      setFlippedCards([]);
      setMatchedCardIds([]);
      setMemoryMoves(0);
      setGameMode('playing');
      return;
    }

    // Filter questions by type and match criteria, fallback to general pool
    let pool = BIBLE_QUESTIONS_POOL.filter(q => q.type === gameType);
    if (pool.length === 0) pool = BIBLE_QUESTIONS_POOL;

    // Filter with preference for audience / difficulty
    let matched = pool.filter(q => q.difficulty === difficulty && q.audience === audience);
    if (matched.length < 3) {
      matched = pool.filter(q => q.difficulty === difficulty);
    }
    if (matched.length < 3) {
      matched = pool;
    }

    const shuffled = [...matched].sort(() => Math.random() - 0.5).slice(0, 5);
    setQuestions(shuffled);
    setCurrentQuestionIdx(0);
    setSelectedAnswer(null);
    setIsAnswerRevealed(false);
    setClueRevealedCount(1);
    setTimeLeft(difficulty === 'facile' ? 25 : difficulty === 'moyen' ? 20 : 15);
    setGameMode('playing');
  };

  // Memory card click
  const handleMemoryCardClick = (index: number) => {
    if (flippedCards.length === 2 || flippedCards.includes(index)) return;
    sounds.playClick();

    const newFlipped = [...flippedCards, index];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      setMemoryMoves(prev => prev + 1);
      const card1 = memoryCards[newFlipped[0]];
      const card2 = memoryCards[newFlipped[1]];

      if (card1.pairId === card2.pairId) {
        // Matched!
        sounds.playCorrect();
        setMatchedCardIds(prev => [...prev, card1.pairId]);
        setFlippedCards([]);

        // Award points to current player
        setPlayersScores(prev => {
          const updated = [...prev];
          updated[currentPlayerIdx].score += 150;
          updated[currentPlayerIdx].correctAnswers += 1;
          return updated;
        });

        // Check if all pairs matched
        const totalPairs = memoryCards.length / 2;
        if (matchedCardIds.length + 1 >= totalPairs) {
          setTimeout(() => {
            finishGame();
          }, 800);
        }
      } else {
        // Not matched
        sounds.playWrong();
        setTimeout(() => {
          setFlippedCards([]);
          // Switch player in multiplayer
          if (playerCount > 1) {
            setCurrentPlayerIdx(prev => (prev + 1) % playerCount);
          }
        }, 1100);
      }
    }
  };

  // Handle question answer submit
  const handleAnswerClick = (option: any) => {
    if (isAnswerRevealed) return;
    if (timerRef.current) clearInterval(timerRef.current);

    setSelectedAnswer(option);
    setIsAnswerRevealed(true);

    const currentQ = questions[currentQuestionIdx];
    const isCorrect = String(option).trim().toLowerCase() === String(currentQ.correctAnswer).trim().toLowerCase();

    if (isCorrect) {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
    }

    // Calculate points: base 100 + time bonus (10 pts per sec remaining)
    const pointsWon = isCorrect ? 100 + Math.max(0, timeLeft * 8) : 0;

    setPlayersScores(prev => {
      const copy = [...prev];
      copy[currentPlayerIdx].score += pointsWon;
      if (isCorrect) copy[currentPlayerIdx].correctAnswers += 1;
      copy[currentPlayerIdx].totalQuestions += 1;
      return copy;
    });
  };

  // Move to next question or switch player
  const handleNextQuestion = () => {
    sounds.playClick();
    if (currentQuestionIdx + 1 < questions.length) {
      setCurrentQuestionIdx(prev => prev + 1);
      setSelectedAnswer(null);
      setIsAnswerRevealed(false);
      setClueRevealedCount(1);
      setTimeLeft(difficulty === 'facile' ? 25 : difficulty === 'moyen' ? 20 : 15);
      
      // Advance to next player in multiplayer turn
      if (playerCount > 1) {
        setCurrentPlayerIdx(prev => (prev + 1) % playerCount);
      }
    } else {
      finishGame();
    }
  };

  // Timer effect for questions
  useEffect(() => {
    if (gameMode !== 'playing' || gameType === 'memoire' || isAnswerRevealed) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          handleAnswerClick('TEMPS ÉCOULÉ');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameMode, gameType, isAnswerRevealed, currentQuestionIdx]);

  // Finish game & save leaderboard session
  const finishGame = () => {
    sounds.playVictory();
    setGameMode('gameover');

    // Find winner
    const sorted = [...playersScores].sort((a, b) => b.score - a.score);
    const winner = sorted[0]?.name || 'Joueur 1';

    const session: GameSessionResult = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString('fr-FR'),
      gameType,
      difficulty,
      audience,
      players: playersScores,
      winnerName: winner
    };

    try {
      const updated = [session, ...leaderboard].slice(0, 10);
      setLeaderboard(updated);
      localStorage.setItem(STORAGE_LEADERBOARD_KEY, JSON.stringify(updated));
    } catch {
      // Ignore
    }
  };

  // Helper memory card icon
  const renderMemoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Ship': return <Ship className="h-6 w-6" />;
      case 'Waves': return <Waves className="h-6 w-6" />;
      case 'Scroll': return <Scroll className="h-6 w-6" />;
      case 'Mountain': return <Mountain className="h-6 w-6" />;
      case 'Crown': return <Crown className="h-6 w-6" />;
      case 'Sun': return <Sun className="h-6 w-6" />;
      case 'UserCheck': return <UserCheck className="h-6 w-6" />;
      case 'Shield': return <Shield className="h-6 w-6" />;
      case 'Cross': return <Cross className="h-6 w-6" />;
      default: return <Sparkles className="h-6 w-6" />;
    }
  };

  return (
    <div className="space-y-12 pb-16">
      {/* Header */}
      <section className="bg-gradient-to-r from-[#0F2C59] via-[#081B36] to-[#0F2C59] text-white py-12 px-4 sm:px-6 lg:px-8 border-b-4 border-[#D4AF37]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-[#D4AF37]/20 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#D4AF37] mb-2">
              <Gamepad2 className="h-4 w-4" />
              Espace Ludo-Éducatif Chrétien
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold font-display">
              Jeux Bibliques Interactifs
            </h1>
            <p className="text-xs sm:text-sm text-slate-200 mt-1 max-w-xl">
              Méditez la Parole de Dieu en vous amusant : Quiz, Versets, Devinettes, Textes à trous, Vrai/Faux et Défi Mémoire.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleToggleSound}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/20 transition-colors"
            >
              {soundEnabled ? <Volume2 className="h-4 w-4 text-[#D4AF37]" /> : <VolumeX className="h-4 w-4 text-slate-400" />}
              {soundEnabled ? 'Son Activé' : 'Muet'}
            </button>
            {gameMode !== 'lobby' && (
              <button
                onClick={() => setGameMode('lobby')}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#D4AF37] text-[#0F2C59] text-xs font-bold hover:bg-[#B38E22] transition-colors shadow"
              >
                <RotateCcw className="h-4 w-4" />
                Retour au salon
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Main Container */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* --- 1. LOBBY CONFIGURATION --- */}
        {gameMode === 'lobby' && (
          <div className="space-y-8">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-10 shadow-sm space-y-8">
              {/* Type of Game */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">
                  1. Choisissez le type de jeu :
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    { id: 'quiz', label: 'Quiz Biblique', desc: 'Questions à choix multiples' },
                    { id: 'verset', label: 'Trouver le Verset', desc: 'Retrouvez les passages sacrés' },
                    { id: 'qui-suis-je', label: 'Qui suis-je ?', desc: 'Devinettes de personnages' },
                    { id: 'completer', label: 'Compléter le texte', desc: 'Mémorisation des versets' },
                    { id: 'vrai-faux', label: 'Vrai ou Faux', desc: 'Doctrine & faits bibliques' },
                    { id: 'memoire', label: 'Défi Mémoire', desc: 'Retrouvez les paires cachées' },
                  ].map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setGameType(t.id as GameType)}
                      className={`p-4 rounded-2xl border text-left transition-all ${
                        gameType === t.id
                          ? 'border-[#0F2C59] bg-[#0F2C59]/5 ring-2 ring-[#0F2C59] shadow-sm'
                          : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                      }`}
                    >
                      <h4 className="text-sm font-bold text-slate-900 font-display">{t.label}</h4>
                      <p className="text-[11px] text-slate-500 mt-1">{t.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Difficulty & Audience */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    2. Niveau de difficulté :
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'facile', label: 'Facile' },
                      { id: 'moyen', label: 'Moyen' },
                      { id: 'difficile', label: 'Difficile' }
                    ].map((d) => (
                      <button
                        key={d.id}
                        type="button"
                        onClick={() => setDifficulty(d.id as GameDifficulty)}
                        className={`py-2.5 rounded-xl text-xs font-bold border transition-all ${
                          difficulty === d.id
                            ? 'bg-[#0F2C59] text-white border-[#0F2C59]'
                            : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        {d.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    3. Public cible :
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'enfants', label: 'Enfants' },
                      { id: 'jeunesse', label: 'Jeunesse' },
                      { id: 'adultes', label: 'Adultes' }
                    ].map((a) => (
                      <button
                        key={a.id}
                        type="button"
                        onClick={() => setAudience(a.id as GameAudience)}
                        className={`py-2.5 rounded-xl text-xs font-bold border transition-all ${
                          audience === a.id
                            ? 'bg-[#0F2C59] text-white border-[#0F2C59]'
                            : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        {a.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Mode Multijoueur Local (1 à 10 joueurs) */}
              <div className="border-t border-slate-100 pt-6">
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    4. Joueurs locaux (1 à 10 participants) :
                  </label>
                  <span className="text-xs font-semibold text-[#0F2C59]">
                    {playerCount === 1 ? 'Mode Solo' : `${playerCount} Joueurs (Tour par tour)`}
                  </span>
                </div>

                {/* Player count selector buttons */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-2">
                  {[1, 2, 3, 4, 5, 6, 8, 10].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => handlePlayerCountChange(num)}
                      className={`h-9 w-9 rounded-lg text-xs font-bold shrink-0 transition-colors ${
                        playerCount === num
                          ? 'bg-[#D4AF37] text-[#0F2C59]'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>

                {/* Player names inputs */}
                {playerCount > 1 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 mt-3 animate-fade-in">
                    {Array.from({ length: playerCount }).map((_, pIdx) => (
                      <input
                        key={pIdx}
                        type="text"
                        placeholder={`Joueur ${pIdx + 1}`}
                        value={playerNames[pIdx] || ''}
                        onChange={(e) => handlePlayerNameChange(pIdx, e.target.value)}
                        className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs focus:outline-none focus:border-[#0F2C59]"
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Start Button */}
              <div className="pt-4 flex justify-center">
                <button
                  id="start-bible-game-btn"
                  onClick={startGame}
                  className="inline-flex items-center gap-2.5 rounded-2xl bg-gradient-to-r from-[#0F2C59] to-[#1A3D73] px-10 py-4 text-base font-bold text-white shadow-xl hover:shadow-2xl hover:scale-105 transition-all"
                >
                  <Gamepad2 className="h-5 w-5 text-[#D4AF37]" />
                  Commencer la Partie
                </button>
              </div>
            </div>

            {/* Leaderboard Table (stored in localStorage) */}
            {leaderboard.length > 0 && (
              <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-[#D4AF37]" />
                    <h3 className="text-base font-bold font-display text-slate-900">
                      Tableau des Meilleurs Scores (Historique Local)
                    </h3>
                  </div>
                  <button
                    onClick={() => {
                      localStorage.removeItem(STORAGE_LEADERBOARD_KEY);
                      setLeaderboard([]);
                    }}
                    className="text-[11px] text-slate-400 hover:text-red-500 transition-colors"
                  >
                    Effacer l'historique
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-100 text-slate-400">
                        <th className="py-2.5 font-semibold">Date</th>
                        <th className="py-2.5 font-semibold">Jeu</th>
                        <th className="py-2.5 font-semibold">Gagnant</th>
                        <th className="py-2.5 font-semibold">Score</th>
                        <th className="py-2.5 font-semibold">Joueurs</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {leaderboard.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50">
                          <td className="py-2.5 text-slate-500">{item.date}</td>
                          <td className="py-2.5 font-bold uppercase text-[#0F2C59]">{item.gameType}</td>
                          <td className="py-2.5 font-semibold text-slate-800">{item.winnerName}</td>
                          <td className="py-2.5 font-bold text-[#D4AF37]">{item.players[0]?.score || 0} pts</td>
                          <td className="py-2.5 text-slate-500">{item.players.length} participant(s)</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* --- 2. ACTIVE GAME PLAYING (QUESTIONS) --- */}
        {gameMode === 'playing' && gameType !== 'memoire' && (
          <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-10 shadow-lg space-y-6 animate-fade-in">
            {/* Top Game Bar: Player Turn, Question Counter, Timer */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-5">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0F2C59] text-white font-bold text-xs">
                  {currentQuestionIdx + 1}/{questions.length}
                </span>
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                    {gameType.toUpperCase()} • {difficulty.toUpperCase()}
                  </span>
                  <h4 className="text-sm font-bold text-[#0F2C59]">
                    Tour de : <span className="text-[#D4AF37]">{playersScores[currentPlayerIdx]?.name}</span>
                  </h4>
                </div>
              </div>

              {/* Timer & Current Score */}
              <div className="flex items-center gap-4">
                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs ${
                  timeLeft <= 5 ? 'bg-red-100 text-red-700 animate-pulse' : 'bg-slate-100 text-slate-700'
                }`}>
                  <Clock className="h-4 w-4" />
                  <span>{timeLeft}s</span>
                </div>
                <div className="rounded-xl bg-[#0F2C59] px-3.5 py-1.5 text-xs font-bold text-white">
                  Score : {playersScores[currentPlayerIdx]?.score || 0} pts
                </div>
              </div>
            </div>

            {/* Question Text */}
            {questions[currentQuestionIdx] && (
              <div className="space-y-6">
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                  <h3 className="text-lg sm:text-xl font-bold font-display text-slate-900 leading-snug">
                    {questions[currentQuestionIdx].question}
                  </h3>

                  {/* Clues progressive reveal for "Qui suis-je ?" */}
                  {questions[currentQuestionIdx].clues && (
                    <div className="mt-4 space-y-2">
                      <div className="text-xs font-bold text-[#0F2C59] uppercase tracking-wider">
                        Indices dévoilés ({clueRevealedCount}/{questions[currentQuestionIdx].clues?.length}) :
                      </div>
                      {questions[currentQuestionIdx].clues?.slice(0, clueRevealedCount).map((clue, cIdx) => (
                        <div key={cIdx} className="p-3 rounded-lg bg-white border border-slate-200 text-xs text-slate-700 flex items-start gap-2">
                          <span className="font-bold text-[#D4AF37]">{cIdx + 1}.</span>
                          <span>{clue}</span>
                        </div>
                      ))}
                      {clueRevealedCount < (questions[currentQuestionIdx].clues?.length || 0) && !isAnswerRevealed && (
                        <button
                          type="button"
                          onClick={() => setClueRevealedCount(prev => prev + 1)}
                          className="mt-2 text-xs font-bold text-[#0F2C59] hover:underline"
                        >
                          + Révéler un indice supplémentaire
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* Options List */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {questions[currentQuestionIdx].options?.map((option, idx) => {
                    const isSelected = selectedAnswer === option;
                    const isCorrect = String(option).trim().toLowerCase() === String(questions[currentQuestionIdx].correctAnswer).trim().toLowerCase();
                    
                    let btnStyle = 'border-slate-200 bg-white hover:border-[#0F2C59] text-slate-800';
                    if (isAnswerRevealed) {
                      if (isCorrect) {
                        btnStyle = 'border-emerald-500 bg-emerald-50 text-emerald-900 font-bold ring-2 ring-emerald-500';
                      } else if (isSelected) {
                        btnStyle = 'border-red-500 bg-red-50 text-red-900 font-bold';
                      } else {
                        btnStyle = 'border-slate-200 bg-slate-50 text-slate-400 opacity-60';
                      }
                    }

                    return (
                      <button
                        key={idx}
                        disabled={isAnswerRevealed}
                        onClick={() => handleAnswerClick(option)}
                        className={`p-4 rounded-xl border text-left text-xs sm:text-sm font-semibold transition-all flex items-center justify-between ${btnStyle}`}
                      >
                        <span>{option}</span>
                        {isAnswerRevealed && isCorrect && <CheckCircle2 className="h-5 w-5 text-emerald-600" />}
                        {isAnswerRevealed && isSelected && !isCorrect && <XCircle className="h-5 w-5 text-red-600" />}
                      </button>
                    );
                  })}
                </div>

                {/* Answer Explanation & Scripture Reference */}
                {isAnswerRevealed && (
                  <div className="rounded-2xl bg-amber-50/70 border border-amber-200 p-5 space-y-2 animate-fade-in">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-[#0F2C59]">
                        Référence : {questions[currentQuestionIdx].scriptureReference}
                      </span>
                      <span className="text-xs font-semibold text-amber-900">
                        Réponse : {String(questions[currentQuestionIdx].correctAnswer)}
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed">
                      {questions[currentQuestionIdx].explanation}
                    </p>

                    <div className="pt-3 flex justify-end">
                      <button
                        id="next-question-btn"
                        onClick={handleNextQuestion}
                        className="inline-flex items-center gap-2 rounded-xl bg-[#0F2C59] px-6 py-2.5 text-xs font-bold text-white hover:bg-[#1A3D73] transition-colors shadow"
                      >
                        {currentQuestionIdx + 1 < questions.length ? 'Question suivante' : 'Terminer la session'}
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* --- 3. ACTIVE GAME PLAYING (DÉFI MÉMOIRE) --- */}
        {gameMode === 'playing' && gameType === 'memoire' && (
          <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-10 shadow-lg space-y-6 animate-fade-in">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#D4AF37]">Défi Mémoire Biblique</span>
                <h3 className="text-base font-bold text-[#0F2C59]">
                  Retrouvez les paires cachées • Coups : {memoryMoves}
                </h3>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-slate-700">
                  Joueur actif : <strong className="text-[#0F2C59]">{playersScores[currentPlayerIdx]?.name}</strong>
                </span>
                <span className="rounded-xl bg-[#0F2C59] px-3.5 py-1 text-xs font-bold text-white">
                  Score : {playersScores[currentPlayerIdx]?.score || 0} pts
                </span>
              </div>
            </div>

            {/* Memory Cards Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {memoryCards.map((card, idx) => {
                const isFlipped = flippedCards.includes(idx) || matchedCardIds.includes(card.pairId);
                const isMatched = matchedCardIds.includes(card.pairId);

                return (
                  <button
                    key={idx}
                    type="button"
                    disabled={isFlipped}
                    onClick={() => handleMemoryCardClick(idx)}
                    className={`h-32 rounded-2xl border-2 transition-all transform flex flex-col items-center justify-center p-3 text-center ${
                      isMatched
                        ? 'border-emerald-500 bg-emerald-50 opacity-90 scale-95'
                        : isFlipped
                        ? 'border-[#0F2C59] bg-white shadow-md'
                        : 'border-[#0F2C59]/30 bg-gradient-to-br from-[#0F2C59] to-[#081B36] text-[#D4AF37] hover:scale-105 shadow'
                    }`}
                  >
                    {isFlipped ? (
                      <div className="space-y-1 text-slate-800">
                        <div className="flex justify-center text-[#0F2C59] mb-1">
                          {renderMemoryIcon(card.icon)}
                        </div>
                        <h4 className="text-xs font-bold font-display">{card.title}</h4>
                        <p className="text-[10px] text-slate-500">{card.subtitle}</p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center space-y-1">
                        <Cross className="h-6 w-6 text-[#D4AF37]" />
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300">Damé</span>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* --- 4. GAME OVER / RESULTS VIEW --- */}
        {gameMode === 'gameover' && (
          <div className="rounded-3xl border border-slate-200 bg-white p-8 sm:p-12 shadow-xl text-center space-y-8 animate-fade-in">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#D4AF37]/20 text-[#D4AF37] shadow">
              <Trophy className="h-10 w-10" />
            </div>

            <div>
              <span className="text-xs uppercase tracking-widest text-[#D4AF37] font-bold">Félicitations</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-[#0F2C59] mt-1">
                Session terminée !
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                « Ta parole est une lampe à mes pieds, et une lumière sur mon sentier. » — Psaume 119:105
              </p>
            </div>

            {/* Scores summary table */}
            <div className="max-w-md mx-auto rounded-2xl bg-slate-50 p-5 border border-slate-200 space-y-3 text-left text-xs">
              <h4 className="font-bold text-[#0F2C59] uppercase tracking-wider mb-2">Classement de la partie :</h4>
              {[...playersScores].sort((a, b) => b.score - a.score).map((p, pIdx) => (
                <div key={pIdx} className="flex items-center justify-between py-2 border-b border-slate-200 last:border-none">
                  <div className="flex items-center gap-2">
                    <span className={`flex h-6 w-6 items-center justify-center rounded-full font-bold text-[11px] ${
                      pIdx === 0 ? 'bg-[#D4AF37] text-[#0F2C59]' : 'bg-slate-200 text-slate-600'
                    }`}>
                      {pIdx + 1}
                    </span>
                    <span className="font-bold text-slate-800">{p.name}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-[#0F2C59]">{p.score} pts</span>
                    <span className="text-[10px] text-slate-400 block">{p.correctAnswers} bonne(s) réponse(s)</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Restart CTAs */}
            <div className="flex flex-wrap items-center justify-center gap-4">
              <button
                onClick={startGame}
                className="inline-flex items-center gap-2 rounded-xl bg-[#0F2C59] px-6 py-3 text-xs font-bold text-white hover:bg-[#1A3D73] transition-colors shadow-md"
              >
                <RotateCcw className="h-4 w-4" />
                Rejouer la même configuration
              </button>
              <button
                onClick={() => setGameMode('lobby')}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Changer de jeu / Configuration
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
