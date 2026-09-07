import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Clock, 
  Calendar, 
  User, 
  Radio, 
  Search, 
  Filter, 
  Download, 
  Share2, 
  RotateCcw, 
  RotateCw,
  Sparkles,
  BookmarkCheck,
  Headphones,
  Check
} from 'lucide-react';
import { ChurchPodcast, PodcastCategory } from '../../types';
import { apiService } from '../../services/apiService';

interface PodcastViewProps {
  onNavigate?: (tab: string) => void;
}

export const PodcastView: React.FC<PodcastViewProps> = ({ onNavigate }) => {
  const [podcasts, setPodcasts] = useState<ChurchPodcast[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('Tous');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Audio Player State
  const [currentPodcast, setCurrentPodcast] = useState<ChurchPodcast | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.85);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const categories: { label: string; value: string }[] = [
    { label: 'Tous les messages', value: 'Tous' },
    { label: 'Prédications', value: 'Prédication' },
    { label: 'Études bibliques', value: 'Étude biblique' },
    { label: 'Enseignements', value: 'Enseignement' },
    { label: 'Témoignages', value: 'Témoignage' },
  ];

  useEffect(() => {
    loadPodcasts();
  }, []);

  const loadPodcasts = async () => {
    setLoading(true);
    try {
      const data = await apiService.getPodcasts();
      setPodcasts(data);
      if (data.length > 0 && !currentPodcast) {
        // Set first podcast as ready in player
        setCurrentPodcast(data[0]);
      }
    } catch (err) {
      console.error('Failed to load podcasts:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle Play/Pause
  const handleTogglePlay = (podcast: ChurchPodcast) => {
    if (currentPodcast?.id === podcast.id) {
      if (isPlaying) {
        audioRef.current?.pause();
        setIsPlaying(false);
      } else {
        audioRef.current?.play();
        setIsPlaying(true);
      }
    } else {
      setCurrentPodcast(podcast);
      setIsPlaying(true);
      // Wait for state & ref to update
      setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.currentTime = 0;
          audioRef.current.play().catch(e => console.log('Audio autoplay prevented:', e));
        }
      }, 50);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      if (audioRef.current.duration && !isNaN(audioRef.current.duration)) {
        setDuration(audioRef.current.duration);
      }
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const targetTime = parseFloat(e.target.value);
    setCurrentTime(targetTime);
    if (audioRef.current) {
      audioRef.current.currentTime = targetTime;
    }
  };

  const handleSkip = (seconds: number) => {
    if (audioRef.current) {
      const newTime = Math.max(0, Math.min(duration || 100, audioRef.current.currentTime + seconds));
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (audioRef.current) {
      audioRef.current.volume = val;
      setIsMuted(val === 0);
    }
  };

  const handleToggleMute = () => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.volume = volume || 0.85;
        setIsMuted(false);
      } else {
        audioRef.current.volume = 0;
        setIsMuted(true);
      }
    }
  };

  const handleSpeedToggle = () => {
    const speeds = [1, 1.25, 1.5, 1.75];
    const nextIdx = (speeds.indexOf(playbackRate) + 1) % speeds.length;
    const nextSpeed = speeds[nextIdx];
    setPlaybackRate(nextSpeed);
    if (audioRef.current) {
      audioRef.current.playbackRate = nextSpeed;
    }
  };

  const handleShare = (podcast: ChurchPodcast) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`${window.location.origin}/podcast#${podcast.id}`);
      setCopiedId(podcast.id);
      setTimeout(() => setCopiedId(null), 2500);
    }
  };

  const formatSeconds = (sec: number) => {
    if (!sec || isNaN(sec)) return '00:00';
    const mins = Math.floor(sec / 60);
    const remainderSecs = Math.floor(sec % 60);
    return `${mins.toString().padStart(2, '0')}:${remainderSecs.toString().padStart(2, '0')}`;
  };

  // Filtered Podcasts
  const filteredPodcasts = podcasts.filter(p => {
    const matchesCategory = selectedCategory === 'Tous' || p.category === selectedCategory;
    const matchesSearch = 
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.preacher.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-24">
      {/* Hidden Audio Element */}
      {currentPodcast && (
        <audio
          ref={audioRef}
          src={currentPodcast.audioUrl}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={() => setIsPlaying(false)}
        />
      )}

      {/* Header Banner */}
      <div className="bg-slate-900 text-white relative overflow-hidden border-b border-slate-800">
        <div className="absolute inset-0 bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:20px_20px] opacity-10 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-18 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[#D4AF37] text-xs font-semibold uppercase tracking-wider mb-4">
              <Radio className="h-3.5 w-3.5 animate-pulse text-[#D4AF37]" />
              <span>Messages Audio & Prédications</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight font-display text-white mb-4">
              Podcast de l’Église de Damé
            </h1>
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-sans mb-6">
              Écoutez la Parole de Dieu, les exhortations pastorales et les enseignements bibliques dispensés à l’Église du Nazaréen de Damé. Nourriture spirituelle accessible où que vous soyez.
            </p>
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
              <span className="flex items-center gap-1.5 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
                <BookmarkCheck className="h-3.5 w-3.5 text-[#D4AF37]" />
                Devise : « Sainteté à l’Éternel »
              </span>
              <span className="flex items-center gap-1.5 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
                <Headphones className="h-3.5 w-3.5 text-[#D4AF37]" />
                {podcasts.length} messages disponibles
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20">
        
        {/* Sticky / Primary Active Player Deck */}
        {currentPodcast && (
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200/80 p-5 sm:p-7 mb-10 transition-all">
            <div className="flex flex-col lg:flex-row items-center gap-6">
              
              {/* Cover Art Thumbnail */}
              <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden shadow-md shrink-0 bg-slate-900 border border-slate-200">
                <img 
                  src={currentPodcast.coverImage || '/images/pasteur_bequel.jpg'} 
                  alt={currentPodcast.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-2 left-2 right-2 flex justify-center">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-black/70 text-[#D4AF37] backdrop-blur-xs">
                    {currentPodcast.category}
                  </span>
                </div>
              </div>

              {/* Title & Info */}
              <div className="flex-1 text-center lg:text-left min-w-0">
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 mb-1">
                  <span className="text-xs font-semibold text-[#D4AF37] uppercase tracking-wide">
                    En lecture actuelle
                  </span>
                  <span className="text-slate-300">•</span>
                  <span className="text-xs text-slate-500 flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {currentPodcast.date}
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 truncate font-display mb-1">
                  {currentPodcast.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 flex items-center justify-center lg:justify-start gap-1.5">
                  <User className="h-3.5 w-3.5 text-slate-400" />
                  <span className="font-semibold text-slate-800">{currentPodcast.preacher}</span>
                </p>

                {/* Progress Scrubber */}
                <div className="mt-4">
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 mb-1">
                    <span>{formatSeconds(currentTime)}</span>
                    <span>{duration ? formatSeconds(duration) : currentPodcast.duration || '25:00'}</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={duration || 100}
                    value={currentTime}
                    onChange={handleSeek}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#D4AF37]"
                  />
                </div>
              </div>

              {/* Player Controls */}
              <div className="flex flex-col items-center gap-3 shrink-0">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleSkip(-10)}
                    title="Reculer de 10s"
                    className="p-2 rounded-full hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer"
                  >
                    <RotateCcw className="h-4 w-4" />
                  </button>

                  <button
                    onClick={() => handleTogglePlay(currentPodcast)}
                    className="w-14 h-14 rounded-full bg-[#D4AF37] hover:bg-[#c59f2a] text-slate-950 flex items-center justify-center shadow-lg transition-transform active:scale-95 cursor-pointer"
                    title={isPlaying ? 'Pause' : 'Lire'}
                  >
                    {isPlaying ? (
                      <Pause className="h-6 w-6 fill-current" />
                    ) : (
                      <Play className="h-6 w-6 fill-current ml-0.5" />
                    )}
                  </button>

                  <button
                    onClick={() => handleSkip(30)}
                    title="Avancer de 30s"
                    className="p-2 rounded-full hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer"
                  >
                    <RotateCw className="h-4 w-4" />
                  </button>
                </div>

                {/* Secondary controls: Volume & Speed */}
                <div className="flex items-center gap-3 text-xs text-slate-500">
                  <button
                    onClick={handleSpeedToggle}
                    className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 font-mono font-semibold transition-colors cursor-pointer"
                    title="Changer la vitesse"
                  >
                    {playbackRate}x
                  </button>

                  <div className="flex items-center gap-1.5">
                    <button onClick={handleToggleMute} className="hover:text-slate-700 cursor-pointer">
                      {isMuted || volume === 0 ? (
                        <VolumeX className="h-4 w-4 text-slate-400" />
                      ) : (
                        <Volume2 className="h-4 w-4 text-slate-600" />
                      )}
                    </button>
                    <input
                      type="range"
                      min={0}
                      max={1}
                      step={0.05}
                      value={isMuted ? 0 : volume}
                      onChange={handleVolumeChange}
                      className="w-16 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#D4AF37]"
                    />
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* Filters & Search Toolbar */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl shadow-sm border border-slate-200 mb-8 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          
          {/* Categories */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            {categories.map(cat => {
              const active = selectedCategory === cat.value;
              return (
                <button
                  key={cat.value}
                  onClick={() => setSelectedCategory(cat.value)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                    active 
                      ? 'bg-slate-900 text-white shadow-sm' 
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Search */}
          <div className="relative min-w-[260px]">
            <Search className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher par titre, prédicateur..."
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#D4AF37] focus:bg-white outline-none transition-all"
            />
          </div>

        </div>

        {/* Podcast Cards Grid */}
        {loading ? (
          <div className="py-20 text-center">
            <div className="w-10 h-10 border-3 border-[#D4AF37] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs text-slate-500 font-medium">Chargement des messages audio...</p>
          </div>
        ) : filteredPodcasts.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-md mx-auto">
            <Radio className="h-10 w-10 text-slate-300 mx-auto mb-3" />
            <h4 className="text-base font-bold text-slate-800 mb-1">Aucun message trouvé</h4>
            <p className="text-xs text-slate-500 mb-4">
              Aucun podcast ne correspond à vos critères de recherche.
            </p>
            <button
              onClick={() => { setSelectedCategory('Tous'); setSearchQuery(''); }}
              className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold cursor-pointer"
            >
              Réinitialiser les filtres
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPodcasts.map((podcast) => {
              const isThisPlaying = isPlaying && currentPodcast?.id === podcast.id;
              const isThisSelected = currentPodcast?.id === podcast.id;

              return (
                <div
                  key={podcast.id}
                  id={`podcast-${podcast.id}`}
                  className={`bg-white rounded-2xl border transition-all duration-200 flex flex-col overflow-hidden hover:shadow-lg ${
                    isThisSelected 
                      ? 'border-[#D4AF37] ring-2 ring-[#D4AF37]/20 shadow-md' 
                      : 'border-slate-200/80 hover:border-slate-300'
                  }`}
                >
                  {/* Top Cover Banner */}
                  <div className="relative h-44 w-full bg-slate-900 overflow-hidden group">
                    <img
                      src={podcast.coverImage || '/images/pasteur_bequel.jpg'}
                      alt={podcast.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent" />
                    
                    {/* Category Tag */}
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-900/80 backdrop-blur-xs text-[#D4AF37] border border-[#D4AF37]/30">
                        {podcast.category}
                      </span>
                    </div>

                    {/* Quick Duration */}
                    <div className="absolute top-3 right-3">
                      <span className="flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-black/60 text-white backdrop-blur-xs">
                        <Clock className="h-3 w-3" />
                        {podcast.duration || '25:00'}
                      </span>
                    </div>

                    {/* Center Hover Play Button */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <button
                        onClick={() => handleTogglePlay(podcast)}
                        className={`w-14 h-14 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-xl ${
                          isThisPlaying
                            ? 'bg-[#D4AF37] text-slate-950 scale-105'
                            : 'bg-white/90 hover:bg-[#D4AF37] text-slate-900 hover:text-slate-950 group-hover:scale-105'
                        }`}
                        title={isThisPlaying ? 'Mettre en pause' : 'Écouter maintenant'}
                      >
                        {isThisPlaying ? (
                          <Pause className="h-6 w-6 fill-current" />
                        ) : (
                          <Play className="h-6 w-6 fill-current ml-1" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Meta: Preacher & Date */}
                      <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                        <span className="flex items-center gap-1 font-semibold text-slate-700">
                          <User className="h-3.5 w-3.5 text-[#D4AF37]" />
                          {podcast.preacher}
                        </span>
                        <span className="flex items-center gap-1 text-[11px]">
                          <Calendar className="h-3 w-3" />
                          {podcast.date}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="font-bold text-base text-slate-900 mb-2 leading-snug line-clamp-2 hover:text-[#D4AF37] transition-colors">
                        {podcast.title}
                      </h3>

                      {/* Description */}
                      <p className="text-xs text-slate-600 leading-relaxed line-clamp-3 mb-4 font-sans">
                        {podcast.description}
                      </p>
                    </div>

                    {/* Bottom Action Row */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                      <button
                        onClick={() => handleTogglePlay(podcast)}
                        className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                          isThisPlaying
                            ? 'bg-slate-900 text-[#D4AF37]'
                            : 'bg-[#D4AF37]/15 text-slate-900 hover:bg-[#D4AF37] hover:text-slate-950'
                        }`}
                      >
                        {isThisPlaying ? (
                          <>
                            <Pause className="h-3.5 w-3.5 fill-current" />
                            <span>En cours de lecture</span>
                          </>
                        ) : (
                          <>
                            <Play className="h-3.5 w-3.5 fill-current" />
                            <span>▶ Écouter maintenant</span>
                          </>
                        )}
                      </button>

                      {/* Share */}
                      <button
                        onClick={() => handleShare(podcast)}
                        title="Partager ce message"
                        className="p-2.5 rounded-xl border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-colors cursor-pointer shrink-0"
                      >
                        {copiedId === podcast.id ? (
                          <Check className="h-4 w-4 text-emerald-600" />
                        ) : (
                          <Share2 className="h-4 w-4" />
                        )}
                      </button>

                      {/* Download link */}
                      <a
                        href={podcast.audioUrl}
                        download={`${podcast.title.replace(/\s+/g, '_')}.wav`}
                        title="Télécharger l'audio"
                        className="p-2.5 rounded-xl border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-colors cursor-pointer shrink-0"
                      >
                        <Download className="h-4 w-4" />
                      </a>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}

        {/* Bottom Callout */}
        <div className="mt-14 bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl p-8 text-white border border-slate-700 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-1.5 text-xs text-[#D4AF37] font-semibold uppercase tracking-wider mb-2">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Partage & Édification</span>
            </div>
            <h3 className="text-xl font-bold font-display text-white mb-2">
              Vous avez besoin d'une prière ou d'un conseil pastoral ?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Le pasteur Bequel CHERELUS et le conseil paroissial de Damé sont à votre disposition pour vous accompagner dans la prière et la foi.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {onNavigate && (
              <button
                onClick={() => onNavigate('priere')}
                className="px-5 py-2.5 rounded-xl bg-[#D4AF37] hover:bg-[#c59f2a] text-slate-950 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
              >
                Demande de Prière
              </button>
            )}
            {onNavigate && (
              <button
                onClick={() => onNavigate('contact')}
                className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
              >
                Nous Contacter
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
export default PodcastView;
