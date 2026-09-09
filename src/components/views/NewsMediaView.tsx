import React, { useState } from 'react';
import { NEWS_ARTICLES, MEDIA_GALLERY } from '../../data/churchData';
import { NewsArticle, MediaItem } from '../../types';
import { 
  Search, 
  Filter, 
  BookOpen, 
  Play, 
  Pause, 
  Volume2, 
  Image as ImageIcon, 
  Video, 
  X, 
  Clock, 
  Calendar, 
  User, 
  ChevronRight,
  Share2,
  Check
} from 'lucide-react';

interface NewsMediaViewProps {
  initialArticleId?: string | null;
}

export const NewsMediaView: React.FC<NewsMediaViewProps> = ({ initialArticleId }) => {
  const [activeTab, setActiveTab] = useState<'articles' | 'medias'>('articles');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Toutes');
  
  // Article Modal State
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(() => {
    if (initialArticleId) {
      return NEWS_ARTICLES.find(a => a.id === initialArticleId) || null;
    }
    return null;
  });

  // Media Player State
  const [activeMedia, setActiveMedia] = useState<MediaItem | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Filter articles
  const filteredArticles = NEWS_ARTICLES.filter((article) => {
    const matchesSearch = 
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'Toutes' || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Filter media
  const [mediaFilter, setMediaFilter] = useState<'tous' | 'audio' | 'video' | 'photo'>('tous');
  const filteredMedia = MEDIA_GALLERY.filter((item) => {
    if (mediaFilter === 'tous') return true;
    return item.type === mediaFilter;
  });

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: selectedArticle?.title || 'Église du Nazaréen de Damé',
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div className="space-y-12 pb-16">
      {/* Page Header */}
      <section className="bg-[#0F2C59] text-white py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center max-w-3xl">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#D4AF37]/20 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#D4AF37] mb-3">
            <BookOpen className="h-3.5 w-3.5" />
            Ressources & Médias
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-display">
            Actualités, Enseignements & Médias
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-200 leading-relaxed">
            Nourrissez votre foi à travers les comptes-rendus de la vie de notre Église, les prédications audio/vidéo et les reportages de nos œuvres.
          </p>

          {/* Subtabs Articles vs Medias */}
          <div className="mt-8 inline-flex rounded-xl bg-white/10 p-1.5 border border-white/20">
            <button
              onClick={() => setActiveTab('articles')}
              className={`px-6 py-2.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'articles'
                  ? 'bg-[#D4AF37] text-[#0F2C59] shadow'
                  : 'text-white hover:text-[#D4AF37]'
              }`}
            >
              Articles & Actualités ({NEWS_ARTICLES.length})
            </button>
            <button
              onClick={() => setActiveTab('medias')}
              className={`px-6 py-2.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'medias'
                  ? 'bg-[#D4AF37] text-[#0F2C59] shadow'
                  : 'text-white hover:text-[#D4AF37]'
              }`}
            >
              Galerie & Prédications ({MEDIA_GALLERY.length})
            </button>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* --- SECTION ARTICLES --- */}
        {activeTab === 'articles' && (
          <div className="space-y-8">
            {/* Search and Categories Bar */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
              {/* Search input */}
              <div className="relative w-full md:w-80">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Rechercher un article, un auteur..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-[#0F2C59]"
                />
              </div>

              {/* Category pills */}
              <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
                {['Toutes', 'Spiritualité', 'Communauté', 'Éducation', 'Jeunesse'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                      selectedCategory === cat
                        ? 'bg-[#0F2C59] text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Articles Grid */}
            {filteredArticles.length === 0 ? (
              <div className="py-16 text-center text-slate-500 bg-white rounded-2xl border border-slate-200">
                Aucun article ne correspond à votre recherche.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredArticles.map((article) => (
                  <article
                    key={article.id}
                    onClick={() => setSelectedArticle(article)}
                    className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
                  >
                    <div>
                      <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                        <img
                          src={article.imageUrl}
                          alt={article.title}
                          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                          referrerPolicy="no-referrer"
                        />
                        <span className="absolute top-3 left-3 rounded-full bg-[#0F2C59] px-2.5 py-0.5 text-[10px] font-bold uppercase text-white shadow">
                          {article.category}
                        </span>
                      </div>
                      <div className="p-5 space-y-2">
                        <div className="flex items-center gap-2 text-[11px] text-slate-400">
                          <span>{article.date}</span>
                          <span>•</span>
                          <span>{article.readTime}</span>
                        </div>
                        <h3 className="text-base font-bold font-display text-slate-900 group-hover:text-[#0F2C59] transition-colors leading-snug">
                          {article.title}
                        </h3>
                        <p className="text-xs text-slate-600 line-clamp-3">
                          {article.summary}
                        </p>
                      </div>
                    </div>
                    <div className="p-5 pt-0 flex items-center justify-between border-t border-slate-50 mt-4">
                      <span className="text-xs text-slate-500 font-medium">
                        Par {article.author}
                      </span>
                      <span className="text-xs font-bold text-[#0F2C59] group-hover:text-[#D4AF37] flex items-center gap-1">
                        Lire <ChevronRight className="h-3.5 w-3.5" />
                      </span>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        )}

        {/* --- SECTION MÉDIAS (Audio, Vidéo, Photos) --- */}
        {activeTab === 'medias' && (
          <div className="space-y-8">
            {/* Filter Pills */}
            <div className="flex items-center justify-center gap-2">
              {[
                { id: 'tous', label: 'Tout voir' },
                { id: 'audio', label: 'Prédications Audio' },
                { id: 'video', label: 'Vidéos & Cultes' },
                { id: 'photo', label: "Photos de l'Église" }
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setMediaFilter(f.id as any)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    mediaFilter === f.id
                      ? 'bg-[#0F2C59] text-white shadow'
                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Simulated Live Player bar if active */}
            {activeMedia && (
              <div className="rounded-2xl bg-[#081B36] text-white p-5 border border-[#D4AF37]/50 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4 animate-fade-in">
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <div className="h-12 w-12 rounded-xl bg-[#D4AF37] text-[#0F2C59] flex items-center justify-center shrink-0">
                    {activeMedia.type === 'audio' ? <Volume2 className="h-6 w-6" /> : <Video className="h-6 w-6" />}
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] uppercase tracking-wider text-[#D4AF37] font-bold">
                      Lecture en cours • {activeMedia.category}
                    </span>
                    <h4 className="text-sm font-bold truncate text-white">{activeMedia.title}</h4>
                    <p className="text-xs text-slate-300">{activeMedia.speaker || 'Damé, Haïti'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="flex items-center gap-2 rounded-lg bg-[#D4AF37] px-4 py-2 text-xs font-bold text-[#0F2C59] hover:bg-[#B38E22] transition-colors"
                  >
                    {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    {isPlaying ? 'Pause' : 'Écouter'}
                  </button>
                  <button
                    onClick={() => {
                      setActiveMedia(null);
                      setIsPlaying(false);
                    }}
                    className="p-2 text-slate-400 hover:text-white"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>
            )}

            {/* Media Items Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMedia.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div className="relative h-48 w-full overflow-hidden bg-slate-900 group">
                    <img
                      src={item.thumbnailUrl}
                      alt={item.title}
                      className="h-full w-full object-cover opacity-85 group-hover:opacity-100 transition-opacity"
                      referrerPolicy="no-referrer"
                    />
                    <span className="absolute top-3 left-3 rounded-full bg-[#0F2C59]/90 px-2.5 py-0.5 text-[10px] font-bold uppercase text-white backdrop-blur-sm">
                      {item.type.toUpperCase()}
                    </span>

                    {/* Play icon overlay for media */}
                    {item.type !== 'photo' && (
                      <button
                        onClick={() => {
                          setActiveMedia(item);
                          setIsPlaying(true);
                        }}
                        className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/20 transition-colors"
                        aria-label={`Lire ${item.title}`}
                      >
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#D4AF37] text-[#0F2C59] shadow-lg transform group-hover:scale-110 transition-transform">
                          <Play className="h-5 w-5 ml-0.5 fill-current" />
                        </div>
                      </button>
                    )}
                  </div>

                  <div className="p-5 space-y-2">
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span>{item.date}</span>
                      {item.duration && <span>{item.duration}</span>}
                    </div>
                    <h3 className="text-sm font-bold font-display text-slate-900 leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <div className="p-5 pt-0">
                    {item.type !== 'photo' ? (
                      <button
                        onClick={() => {
                          setActiveMedia(item);
                          setIsPlaying(true);
                        }}
                        className="w-full rounded-lg bg-slate-100 hover:bg-[#0F2C59] hover:text-white py-2 text-xs font-semibold text-slate-700 transition-colors flex items-center justify-center gap-1.5"
                      >
                        <Play className="h-3.5 w-3.5" />
                        Lancer l'écoute
                      </button>
                    ) : (
                      <span className="text-[11px] text-slate-400 italic block text-center">
                        Photographie de l'Église archivée
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ARTICLE READER MODAL */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl max-h-[90vh] flex flex-col border border-slate-100">
            {/* Modal Header Bar */}
            <div className="bg-[#0F2C59] text-white p-5 flex items-center justify-between shrink-0">
              <span className="text-xs uppercase font-bold text-[#D4AF37]">
                {selectedArticle.category} • {selectedArticle.date}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleShare}
                  className="p-1.5 text-white/80 hover:text-white rounded-lg hover:bg-white/10"
                  aria-label="Partager"
                >
                  {copiedLink ? <Check className="h-4 w-4 text-[#D4AF37]" /> : <Share2 className="h-4 w-4" />}
                </button>
                <button
                  onClick={() => setSelectedArticle(null)}
                  className="p-1.5 text-white/80 hover:text-white rounded-lg hover:bg-white/10"
                  aria-label="Fermer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Modal Scroll Content */}
            <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
              <h2 className="text-2xl sm:text-3xl font-bold font-display text-slate-900 leading-tight">
                {selectedArticle.title}
              </h2>

              <div className="flex items-center gap-4 text-xs text-slate-500 border-y border-slate-100 py-3">
                <span className="flex items-center gap-1.5 font-medium text-slate-700">
                  <User className="h-3.5 w-3.5 text-[#D4AF37]" />
                  {selectedArticle.author}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" />
                  Lecture : {selectedArticle.readTime}
                </span>
              </div>

              <div className="rounded-xl overflow-hidden shadow-sm">
                <img
                  src={selectedArticle.imageUrl}
                  alt={selectedArticle.title}
                  className="w-full h-64 object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="space-y-4 text-sm text-slate-700 leading-relaxed">
                {selectedArticle.content.map((paragraph, pIdx) => (
                  <p key={pIdx}>{paragraph}</p>
                ))}
              </div>

              {/* Related articles suggestion */}
              <div className="pt-6 border-t border-slate-100">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#0F2C59] mb-3">
                  Articles connexes :
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {NEWS_ARTICLES.filter(a => a.id !== selectedArticle.id).slice(0, 2).map((rel) => (
                    <button
                      key={rel.id}
                      onClick={() => setSelectedArticle(rel)}
                      className="p-3 rounded-xl border border-slate-200 text-left hover:border-[#0F2C59] transition-colors"
                    >
                      <span className="text-[10px] text-[#D4AF37] font-bold uppercase block">{rel.category}</span>
                      <h5 className="text-xs font-bold text-slate-900 line-clamp-1">{rel.title}</h5>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Close footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end shrink-0">
              <button
                onClick={() => setSelectedArticle(null)}
                className="px-5 py-2 rounded-lg bg-[#0F2C59] text-white text-xs font-semibold hover:bg-[#1A3D73]"
              >
                Fermer la lecture
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
