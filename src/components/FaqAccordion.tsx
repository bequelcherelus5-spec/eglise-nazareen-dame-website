import React, { useState, useEffect, useCallback } from 'react';
import { ChurchFaqItem } from '../types';
import { apiService } from '../services/apiService';
import { 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  Search, 
  RefreshCw, 
  MessageSquare, 
  Sparkles,
  CheckCircle2,
  FileQuestion,
  Tag
} from 'lucide-react';

interface FaqAccordionProps {
  onAskQuestion?: () => void;
}

export const FaqAccordion: React.FC<FaqAccordionProps> = ({ onAskQuestion }) => {
  const [faqs, setFaqs] = useState<ChurchFaqItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Toutes');
  const [openIds, setOpenIds] = useState<Record<string, boolean>>({});

  const loadFaqs = useCallback(async () => {
    try {
      const data = await apiService.getFaqs(false);
      setFaqs(data);
      // Auto-open first item if available and no item is opened yet
      if (data.length > 0 && Object.keys(openIds).length === 0) {
        setOpenIds({ [data[0].id]: true });
      }
    } catch (err) {
      console.warn('[FaqAccordion] Erreur lors de la récupération des FAQ:', err);
    } finally {
      setLoading(false);
    }
  }, [openIds]);

  useEffect(() => {
    loadFaqs();

    const handleUpdate = () => {
      loadFaqs();
    };

    window.addEventListener('dame_faq_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      window.removeEventListener('dame_faq_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, [loadFaqs]);

  const toggleItem = (id: string) => {
    setOpenIds(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const categories = ['Toutes', ...Array.from(new Set(faqs.map(f => f.category || 'Général')))];

  const filteredFaqs = faqs.filter(faq => {
    const matchesCategory = selectedCategory === 'Toutes' || faq.category === selectedCategory;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q || 
      faq.question.toLowerCase().includes(q) ||
      faq.answer.toLowerCase().includes(q) ||
      (faq.category && faq.category.toLowerCase().includes(q));
    return matchesCategory && matchesSearch;
  });

  return (
    <section id="faq-section" className="space-y-8 scroll-mt-24">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#D4AF37]/20 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#0F2C59] border border-[#D4AF37]/40">
          <HelpCircle className="h-3.5 w-3.5 text-[#0F2C59]" />
          Foire Aux Questions (FAQ)
        </span>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold font-display text-slate-900 leading-tight">
          Questions Fréquentes sur notre Paroisse
        </h2>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-light">
          Retrouvez les réponses claires du secrétariat concernant nos cultes, les démarches administratives, l'École Professionnelle EPND et les projets de l'Église.
        </p>
      </div>

      {/* Toolbar: Search & Category Pills */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4 max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="h-4 w-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Rechercher une question, mot-clé..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0F2C59] focus:bg-white transition-all"
            />
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <span className="text-xs text-slate-500 font-medium">
              {filteredFaqs.length} question(s) trouvée(s)
            </span>
            <button
              onClick={() => loadFaqs()}
              className="p-2 text-slate-500 hover:text-slate-800 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors"
              title="Rafraîchir les questions"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Category Pills */}
        {categories.length > 2 && (
          <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-100">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#0F2C59] text-white shadow-xs font-bold'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Accordion List */}
      <div className="max-w-4xl mx-auto space-y-3">
        {loading ? (
          <div className="py-12 flex flex-col items-center justify-center text-slate-400">
            <RefreshCw className="h-8 w-8 animate-spin text-[#0F2C59] mb-2" />
            <p className="text-xs">Chargement des questions fréquentes...</p>
          </div>
        ) : filteredFaqs.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-3">
            <FileQuestion className="h-10 w-10 text-slate-300 mx-auto" />
            <p className="text-sm font-bold text-slate-800">Aucune question ne correspond à votre recherche.</p>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Vous pouvez nous contacter directement à l'aide du formulaire ci-dessus pour nous poser votre question.
            </p>
            {onAskQuestion && (
              <button
                onClick={onAskQuestion}
                className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0F2C59] text-white text-xs font-bold hover:bg-[#1A365D] transition-colors"
              >
                <MessageSquare className="h-3.5 w-3.5" />
                <span>Poser une question au secrétariat</span>
              </button>
            )}
          </div>
        ) : (
          filteredFaqs.map((faq, index) => {
            const isOpen = Boolean(openIds[faq.id]);
            return (
              <div
                key={faq.id}
                className={`rounded-2xl border transition-all overflow-hidden bg-white ${
                  isOpen 
                    ? 'border-[#0F2C59]/40 shadow-md ring-1 ring-[#0F2C59]/10' 
                    : 'border-slate-200 hover:border-slate-300 shadow-xs'
                }`}
              >
                {/* Accordion Header / Question Trigger */}
                <button
                  type="button"
                  onClick={() => toggleItem(faq.id)}
                  aria-expanded={isOpen}
                  className="w-full text-left p-5 sm:p-6 flex items-start justify-between gap-4 cursor-pointer focus:outline-none focus:bg-slate-50/50"
                >
                  <div className="space-y-1.5 flex-1 pr-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 border border-amber-200">
                        {faq.category || 'Général'}
                      </span>
                    </div>
                    <h3 className={`text-base sm:text-lg font-bold font-display leading-snug transition-colors ${
                      isOpen ? 'text-[#0F2C59]' : 'text-slate-900'
                    }`}>
                      {faq.question}
                    </h3>
                  </div>

                  <span className={`p-2 rounded-xl shrink-0 transition-transform duration-200 ${
                    isOpen ? 'bg-[#0F2C59] text-white rotate-180' : 'bg-slate-100 text-slate-600'
                  }`}>
                    <ChevronDown className="h-4 w-4" />
                  </span>
                </button>

                {/* Accordion Content / Answer */}
                {isOpen && (
                  <div className="px-5 pb-5 sm:px-6 sm:pb-6 pt-1 text-xs sm:text-sm text-slate-700 leading-relaxed border-t border-slate-100 bg-slate-50/40 animate-fade-in">
                    <div className="whitespace-pre-wrap leading-relaxed space-y-2 font-normal pt-2">
                      {faq.answer}
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-500">
                      <span className="flex items-center gap-1.5">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                        Réponse vérifiée par le Secrétariat Paroissial
                      </span>
                      <span className="font-mono text-[10px] text-slate-400">
                        Réf. #{faq.id.slice(-6)}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Still need help callout */}
      <div className="max-w-4xl mx-auto rounded-3xl bg-gradient-to-r from-[#0F2C59] to-[#1A3D73] p-6 sm:p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md border border-[#D4AF37]/30">
        <div className="space-y-1 text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 text-xs text-[#D4AF37] font-bold uppercase tracking-wider">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Assistance directe & écoute fraternelle</span>
          </div>
          <h4 className="text-lg sm:text-xl font-bold font-display text-white">
            Vous n'avez pas trouvé la réponse à votre question ?
          </h4>
          <p className="text-xs text-slate-200 max-w-lg leading-relaxed font-light">
            Notre secrétariat est à votre entière disposition pour tout renseignement pastoral, certificat ou projet communautaire.
          </p>
        </div>

        {onAskQuestion ? (
          <button
            onClick={onAskQuestion}
            className="px-5 py-2.5 rounded-xl bg-[#D4AF37] hover:bg-[#B38E22] text-[#0F2C59] font-bold text-xs shadow-md transition-colors shrink-0 flex items-center gap-2 cursor-pointer"
          >
            <MessageSquare className="h-4 w-4 fill-current" />
            <span>Écrire au Secrétariat</span>
          </button>
        ) : (
          <a
            href="#contact-form"
            className="px-5 py-2.5 rounded-xl bg-[#D4AF37] hover:bg-[#B38E22] text-[#0F2C59] font-bold text-xs shadow-md transition-colors shrink-0 flex items-center gap-2"
          >
            <MessageSquare className="h-4 w-4 fill-current" />
            <span>Écrire au Secrétariat</span>
          </a>
        )}
      </div>
    </section>
  );
};
