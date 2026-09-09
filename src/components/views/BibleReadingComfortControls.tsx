import React from 'react';
import { 
  Sun, 
  Moon, 
  BookOpen, 
  Type, 
  Eye, 
  Check, 
  RotateCcw, 
  SlidersHorizontal,
  X,
  Sparkles
} from 'lucide-react';

export type ReadingTheme = 'light' | 'dark' | 'sepia';
export type ReadingFontSize = 'normal' | 'large' | 'xlarge';

export interface BibleReadingPreferences {
  theme: ReadingTheme;
  fontSize: ReadingFontSize;
  relaxedSpacing: boolean;
}

interface BibleReadingComfortControlsProps {
  prefs: BibleReadingPreferences;
  onChangePrefs: (newPrefs: BibleReadingPreferences) => void;
  isOpen: boolean;
  onToggleOpen: () => void;
}

export const BibleReadingComfortControls: React.FC<BibleReadingComfortControlsProps> = ({
  prefs,
  onChangePrefs,
  isOpen,
  onToggleOpen
}) => {
  const setTheme = (theme: ReadingTheme) => {
    onChangePrefs({ ...prefs, theme });
  };

  const setFontSize = (fontSize: ReadingFontSize) => {
    onChangePrefs({ ...prefs, fontSize });
  };

  const toggleRelaxedSpacing = () => {
    onChangePrefs({ ...prefs, relaxedSpacing: !prefs.relaxedSpacing });
  };

  const handleReset = () => {
    onChangePrefs({
      theme: 'light',
      fontSize: 'normal',
      relaxedSpacing: false
    });
  };

  // Quick toggle dark theme in 1 click
  const handleQuickToggleTheme = () => {
    if (prefs.theme === 'dark') {
      setTheme('light');
    } else {
      setTheme('dark');
    }
  };

  // Quick font size step
  const handleNextFontSize = () => {
    if (prefs.fontSize === 'normal') setFontSize('large');
    else if (prefs.fontSize === 'large') setFontSize('xlarge');
    else setFontSize('normal');
  };

  const isDark = prefs.theme === 'dark';
  const isSepia = prefs.theme === 'sepia';

  return (
    <div className="relative z-30">
      {/* Quick Access Floating / Embedded Toolbar */}
      <div 
        className={`flex flex-wrap items-center justify-between gap-3 p-3 sm:px-4 sm:py-2.5 rounded-2xl border transition-all shadow-sm ${
          isDark
            ? 'bg-[#132238] border-slate-700/80 text-slate-100'
            : isSepia
            ? 'bg-[#FDFBF7] border-[#E2D8CC] text-[#2C2416]'
            : 'bg-white border-slate-200 text-slate-800'
        }`}
      >
        {/* Left: Indicator & Main Title */}
        <div className="flex items-center gap-2.5">
          <div className={`p-2 rounded-xl flex items-center justify-center shrink-0 ${
            isDark 
              ? 'bg-[#D4AF37]/20 text-[#D4AF37]' 
              : isSepia
              ? 'bg-[#8C6D37]/15 text-[#8C6D37]'
              : 'bg-[#0F2C59]/10 text-[#0F2C59]'
          }`}>
            <Eye className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold font-display tracking-wide">
                Lecture Confortable
              </span>
              {/* Active Badges */}
              {isDark && (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-800">
                  <Moon className="h-2.5 w-2.5" />
                  Mode Nuit
                </span>
              )}
              {isSepia && (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#EADCC8] text-[#4A3922]">
                  <BookOpen className="h-2.5 w-2.5" />
                  Sépia
                </span>
              )}
              {prefs.fontSize !== 'normal' && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#D4AF37]/20 text-[#D4AF37]">
                  {prefs.fontSize === 'large' ? 'Police +18%' : 'Police +35%'}
                </span>
              )}
            </div>
            <p className={`text-[11px] hidden sm:block ${
              isDark ? 'text-slate-400' : isSepia ? 'text-[#7D6B57]' : 'text-slate-500'
            }`}>
              Ajustez la police et activez le thème sombre pour ménager vos yeux lors de la méditation.
            </p>
          </div>
        </div>

        {/* Right: Quick Action Controls */}
        <div className="flex items-center gap-2">
          {/* Quick Font Size Step Button */}
          <div className="flex items-center rounded-xl p-0.5 border border-slate-200/60 dark:border-slate-700 bg-slate-100/60 dark:bg-slate-800/60">
            <button
              type="button"
              onClick={() => setFontSize('normal')}
              className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all ${
                prefs.fontSize === 'normal'
                  ? 'bg-[#0F2C59] text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
              }`}
              title="Taille de texte normale"
            >
              A
            </button>
            <button
              type="button"
              onClick={() => setFontSize('large')}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                prefs.fontSize === 'large'
                  ? 'bg-[#0F2C59] text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
              }`}
              title="Grande taille de texte (+18%)"
            >
              A+
            </button>
            <button
              type="button"
              onClick={() => setFontSize('xlarge')}
              className={`px-2.5 py-1 text-sm font-extrabold rounded-lg transition-all ${
                prefs.fontSize === 'xlarge'
                  ? 'bg-[#0F2C59] text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
              }`}
              title="Très grande taille de texte (+35%)"
            >
              A++
            </button>
          </div>

          {/* Quick Dark Mode Toggle */}
          <button
            type="button"
            onClick={handleQuickToggleTheme}
            className={`p-2 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              isDark
                ? 'bg-amber-500/20 border-amber-500/40 text-amber-300 hover:bg-amber-500/30'
                : 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700'
            }`}
            title={isDark ? 'Passer au thème clair' : 'Activer le thème sombre pour lecture prolongée'}
          >
            {isDark ? (
              <>
                <Sun className="h-4 w-4 text-amber-400" />
                <span className="hidden md:inline">Clair</span>
              </>
            ) : (
              <>
                <Moon className="h-4 w-4 text-indigo-600" />
                <span className="hidden md:inline">Thème Sombre</span>
              </>
            )}
          </button>

          {/* Full Settings Drawer Toggle */}
          <button
            type="button"
            onClick={onToggleOpen}
            className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              isOpen
                ? 'bg-[#D4AF37] text-slate-950 shadow-sm font-extrabold'
                : isDark
                ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
            }`}
            title="Personnaliser les options de lecture confortable"
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Options</span>
          </button>
        </div>
      </div>

      {/* Expanded Customization Modal / Panel */}
      {isOpen && (
        <div 
          className={`mt-3 p-5 sm:p-6 rounded-3xl border transition-all animate-fade-in shadow-xl ${
            isDark
              ? 'bg-[#111D30] border-slate-700 text-slate-100'
              : isSepia
              ? 'bg-[#FAF6EE] border-[#DED4C5] text-[#2C2416]'
              : 'bg-white border-slate-200 text-slate-800'
          }`}
        >
          <div className="flex items-center justify-between pb-4 border-b border-slate-200/40 dark:border-slate-700">
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-[#D4AF37]" />
              <div>
                <h4 className="text-sm font-bold font-display">
                  Paramètres de Lecture Confortable & Prolongée
                </h4>
                <p className={`text-[11px] ${isDark ? 'text-slate-400' : isSepia ? 'text-[#7D6B57]' : 'text-slate-500'}`}>
                  Conçu spécialement pour la méditation des Écritures et les sessions d'étude biblique sans fatigue oculaire.
                </p>
              </div>
            </div>
            
            <button
              type="button"
              onClick={onToggleOpen}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
              title="Fermer le panneau"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-5">
            {/* 1. Theme Selection */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-2.5 opacity-80">
                1. Ambiance visuelle (Thème) :
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                {/* Light */}
                <button
                  type="button"
                  onClick={() => setTheme('light')}
                  className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                    prefs.theme === 'light'
                      ? 'border-[#0F2C59] ring-2 ring-[#0F2C59] bg-white text-slate-900 shadow-sm font-bold'
                      : 'border-slate-200 bg-white/70 text-slate-600 hover:bg-white'
                  }`}
                >
                  <Sun className="h-5 w-5 text-amber-500" />
                  <span className="text-xs">Clair</span>
                  <span className="text-[10px] text-slate-400 font-normal">Standard</span>
                </button>

                {/* Dark Theme */}
                <button
                  type="button"
                  onClick={() => setTheme('dark')}
                  className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                    prefs.theme === 'dark'
                      ? 'border-[#D4AF37] ring-2 ring-[#D4AF37] bg-[#1A2C46] text-white shadow-sm font-bold'
                      : 'border-slate-700 bg-[#16253B] text-slate-300 hover:bg-[#1A2C46]'
                  }`}
                >
                  <Moon className="h-5 w-5 text-indigo-400" />
                  <span className="text-xs">Sombre</span>
                  <span className="text-[10px] text-slate-400 font-normal">Nuit & Repos</span>
                </button>

                {/* Sepia */}
                <button
                  type="button"
                  onClick={() => setTheme('sepia')}
                  className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                    prefs.theme === 'sepia'
                      ? 'border-[#8C6D37] ring-2 ring-[#8C6D37] bg-[#F7F1E5] text-[#2C2416] shadow-sm font-bold'
                      : 'border-[#E2D8CC] bg-[#FAF6EE] text-[#5C4D3B] hover:bg-[#F7F1E5]'
                  }`}
                >
                  <BookOpen className="h-5 w-5 text-[#8C6D37]" />
                  <span className="text-xs">Sépia</span>
                  <span className="text-[10px] text-[#7D6B57] font-normal">Papier Bible</span>
                </button>
              </div>
            </div>

            {/* 2. Font Size Selection */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-2.5 opacity-80">
                2. Taille de la police :
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                {/* Normal */}
                <button
                  type="button"
                  onClick={() => setFontSize('normal')}
                  className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center ${
                    prefs.fontSize === 'normal'
                      ? 'border-[#0F2C59] dark:border-[#D4AF37] ring-2 ring-[#0F2C59] dark:ring-[#D4AF37] font-bold shadow-sm'
                      : 'border-slate-200 dark:border-slate-700 opacity-75 hover:opacity-100'
                  }`}
                >
                  <span className="text-sm font-bold">A</span>
                  <span className="text-xs mt-1">Normale</span>
                  <span className="text-[10px] opacity-60">100%</span>
                </button>

                {/* Large */}
                <button
                  type="button"
                  onClick={() => setFontSize('large')}
                  className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center ${
                    prefs.fontSize === 'large'
                      ? 'border-[#0F2C59] dark:border-[#D4AF37] ring-2 ring-[#0F2C59] dark:ring-[#D4AF37] font-bold shadow-sm'
                      : 'border-slate-200 dark:border-slate-700 opacity-75 hover:opacity-100'
                  }`}
                >
                  <span className="text-base font-bold">A+</span>
                  <span className="text-xs mt-1">Grande</span>
                  <span className="text-[10px] opacity-60">118%</span>
                </button>

                {/* Extra Large */}
                <button
                  type="button"
                  onClick={() => setFontSize('xlarge')}
                  className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center ${
                    prefs.fontSize === 'xlarge'
                      ? 'border-[#0F2C59] dark:border-[#D4AF37] ring-2 ring-[#0F2C59] dark:ring-[#D4AF37] font-bold shadow-sm'
                      : 'border-slate-200 dark:border-slate-700 opacity-75 hover:opacity-100'
                  }`}
                >
                  <span className="text-lg font-extrabold">A++</span>
                  <span className="text-xs mt-1">Très Grande</span>
                  <span className="text-[10px] opacity-60">135%</span>
                </button>
              </div>

              {/* Relaxed spacing toggle */}
              <div className="mt-3 flex items-center justify-between p-2.5 rounded-xl border border-slate-200/50 dark:border-slate-700/60 bg-black/5 dark:bg-white/5">
                <span className="text-xs font-semibold">
                  Interligne aéré (confort de lecture)
                </span>
                <button
                  type="button"
                  onClick={toggleRelaxedSpacing}
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                    prefs.relaxedSpacing ? 'bg-[#0F2C59] dark:bg-[#D4AF37]' : 'bg-slate-300 dark:bg-slate-700'
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                      prefs.relaxedSpacing ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* 3. Live Preview Card */}
          <div className="mt-6 pt-5 border-t border-slate-200/40 dark:border-slate-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider opacity-70 flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-[#D4AF37]" />
                Aperçu instantané des textes bibliques :
              </span>
              <button
                type="button"
                onClick={handleReset}
                className="text-[11px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 flex items-center gap-1 transition-colors"
              >
                <RotateCcw className="h-3 w-3" />
                Rétablir par défaut
              </button>
            </div>

            <div 
              className={`p-4 rounded-2xl border transition-all ${
                isDark 
                  ? 'bg-[#182840] border-slate-700 text-slate-100' 
                  : isSepia 
                  ? 'bg-[#F5EFE4] border-[#DCD0C0] text-[#2C2416]' 
                  : 'bg-slate-50 border-slate-200 text-slate-900'
              }`}
            >
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-[#D4AF37]/20 text-[#D4AF37]">
                  Psaume 119:105
                </span>
                <span className={`text-[11px] ${isDark ? 'text-slate-400' : isSepia ? 'text-[#7D6B57]' : 'text-slate-500'}`}>
                  Écriture Sainte
                </span>
              </div>

              <p 
                className={`font-display font-medium ${
                  prefs.fontSize === 'xlarge'
                    ? 'text-lg sm:text-xl'
                    : prefs.fontSize === 'large'
                    ? 'text-base sm:text-lg'
                    : 'text-sm sm:text-base'
                } ${prefs.relaxedSpacing ? 'leading-relaxed tracking-wide' : 'leading-snug'}`}
              >
                « Ta parole est une lampe à mes pieds, et une lumière sur mon sentier. »
              </p>

              <p className={`text-[11px] mt-2 italic ${isDark ? 'text-slate-400' : isSepia ? 'text-[#7D6B57]' : 'text-slate-500'}`}>
                Révélation divine pour guider chaque pas du croyant dans la sanctification.
              </p>
            </div>
          </div>

        </div>
      )}
    </div>
  );
};
