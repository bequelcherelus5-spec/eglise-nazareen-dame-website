import React, { useState, useEffect, useCallback } from 'react';
import { ChurchFaqItem } from '../../types';
import { apiService } from '../../services/apiService';
import { 
  PlusCircle, 
  Search, 
  Filter, 
  Edit3, 
  Trash2, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  Clock, 
  HelpCircle, 
  X, 
  RefreshCw, 
  Sparkles,
  ArrowUpDown,
  Tag,
  MessageSquare,
  AlertCircle
} from 'lucide-react';

interface FaqManagerProps {
  onFaqChanged?: () => void;
}

export const FaqManager: React.FC<FaqManagerProps> = ({ onFaqChanged }) => {
  const [faqs, setFaqs] = useState<ChurchFaqItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  // Form & modal state
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingFaq, setEditingFaq] = useState<ChurchFaqItem | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Form inputs
  const [formData, setFormData] = useState({
    question: '',
    answer: '',
    category: 'Général',
    customCategory: '',
    order: 1,
    published: true
  });

  const categoryPresets = [
    'Général',
    'Cultes & Célébrations',
    'Documents Administratifs',
    'École EPND',
    'Dons & Projets',
    'Jeunesse & JNI',
    'Vie Spirituelle & Prière'
  ];

  const loadFaqs = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiService.getFaqs(true);
      setFaqs(data);
    } catch (err) {
      console.warn('[FaqManager] Erreur chargement FAQ:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadFaqs();
  }, [loadFaqs]);

  const handleOpenCreate = () => {
    setEditingFaq(null);
    setFormData({
      question: '',
      answer: '',
      category: 'Général',
      customCategory: '',
      order: faqs.length + 1,
      published: true
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (faq: ChurchFaqItem) => {
    setEditingFaq(faq);
    const isPreset = categoryPresets.includes(faq.category);
    setFormData({
      question: faq.question,
      answer: faq.answer,
      category: isPreset ? faq.category : 'Autre',
      customCategory: isPreset ? '' : faq.category,
      order: faq.order || 1,
      published: faq.published
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.question.trim() || !formData.answer.trim()) {
      setFeedbackMsg({ type: 'error', text: 'La question et la réponse sont obligatoires.' });
      return;
    }

    setSubmitting(true);
    setFeedbackMsg(null);

    const effectiveCategory = (formData.category === 'Autre' && formData.customCategory.trim()) 
      ? formData.customCategory.trim() 
      : formData.category;

    try {
      if (editingFaq) {
        const updated = await apiService.updateFaq(editingFaq.id, {
          question: formData.question.trim(),
          answer: formData.answer.trim(),
          category: effectiveCategory,
          order: Number(formData.order) || 1,
          published: formData.published
        });

        if (updated) {
          setFaqs(prev => prev.map(f => f.id === editingFaq.id ? updated : f));
          setFeedbackMsg({ type: 'success', text: 'Question fréquente mise à jour avec succès.' });
          setIsModalOpen(false);
          if (onFaqChanged) onFaqChanged();
        }
      } else {
        const created = await apiService.createFaq({
          question: formData.question.trim(),
          answer: formData.answer.trim(),
          category: effectiveCategory,
          order: Number(formData.order) || (faqs.length + 1),
          published: formData.published
        });

        if (created) {
          setFaqs(prev => [...prev, created]);
          setFeedbackMsg({ type: 'success', text: 'Nouvelle question fréquente enregistrée et mise en ligne.' });
          setIsModalOpen(false);
          if (onFaqChanged) onFaqChanged();
        }
      }
    } catch (err) {
      console.error('Erreur enregistrement FAQ:', err);
      setFeedbackMsg({ type: 'error', text: 'Erreur lors de l’enregistrement de la question fréquente.' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette question fréquente ?')) return;

    try {
      const ok = await apiService.deleteFaq(id);
      if (ok) {
        setFaqs(prev => prev.filter(f => f.id !== id));
        setFeedbackMsg({ type: 'success', text: 'Question fréquente supprimée.' });
        if (onFaqChanged) onFaqChanged();
      }
    } catch (err) {
      console.error('Erreur suppression FAQ:', err);
    }
  };

  const handleTogglePublish = async (faq: ChurchFaqItem) => {
    try {
      const updated = await apiService.updateFaq(faq.id, { published: !faq.published });
      if (updated) {
        setFaqs(prev => prev.map(f => f.id === faq.id ? updated : f));
        if (onFaqChanged) onFaqChanged();
      }
    } catch (err) {
      console.error('Erreur changement statut FAQ:', err);
    }
  };

  // Filtered FAQs
  const filteredFaqs = faqs.filter(f => {
    const matchesCategory = categoryFilter === 'All' || f.category === categoryFilter;
    const matchesStatus = statusFilter === 'All' || 
      (statusFilter === 'published' && f.published) || 
      (statusFilter === 'draft' && !f.published);
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q || 
      f.question.toLowerCase().includes(q) ||
      f.answer.toLowerCase().includes(q) ||
      (f.category && f.category.toLowerCase().includes(q));
    return matchesCategory && matchesStatus && matchesSearch;
  });

  return (
    <div id="faq-manager-root" className="space-y-6">
      {/* Feedback banner */}
      {feedbackMsg && (
        <div className={`p-4 rounded-xl flex items-center justify-between text-xs font-semibold ${
          feedbackMsg.type === 'success'
            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
            : 'bg-rose-50 text-rose-800 border border-rose-200'
        }`}>
          <div className="flex items-center gap-2">
            {feedbackMsg.type === 'success' ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            ) : (
              <AlertCircle className="h-4 w-4 text-rose-600" />
            )}
            <span>{feedbackMsg.text}</span>
          </div>
          <button onClick={() => setFeedbackMsg(null)} className="text-slate-400 hover:text-slate-600">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Header Toolbar */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-2 bg-amber-50 text-amber-900 rounded-xl">
              <HelpCircle className="w-5 h-5 text-[#0F2C59]" />
            </span>
            <h2 className="text-xl font-bold font-display text-slate-900">
              Gestion de la FAQ (Foire Aux Questions)
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Gérez les questions fréquentes affichées en mode accordéon sur la page « Contact » pour renseigner les membres et visiteurs.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-4 py-2.5 bg-[#0F2C59] hover:bg-[#1A365D] text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition-colors cursor-pointer self-start md:self-auto shrink-0"
        >
          <PlusCircle className="h-4 w-4 text-[#D4AF37]" />
          <span>Nouvelle Question Fréquente</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col lg:flex-row gap-3 items-center justify-between">
        <div className="relative w-full lg:w-80">
          <Search className="h-4 w-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Rechercher par mot-clé, question, réponse..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0F2C59] focus:bg-white"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
          {/* Category filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:ring-2 focus:ring-[#0F2C59] outline-none"
          >
            <option value="All">Toutes les catégories</option>
            {categoryPresets.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:ring-2 focus:ring-[#0F2C59] outline-none"
          >
            <option value="All">Tous les statuts</option>
            <option value="published">Publiées en ligne</option>
            <option value="draft">Brouillons (masquées)</option>
          </select>

          <button
            onClick={loadFaqs}
            className="p-2 text-slate-500 hover:text-slate-800 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors"
            title="Rafraîchir"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* FAQ Items List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
        {loading ? (
          <div className="py-12 flex flex-col items-center justify-center text-slate-400">
            <RefreshCw className="h-8 w-8 animate-spin text-[#0F2C59] mb-2" />
            <p className="text-xs">Chargement des questions fréquentes...</p>
          </div>
        ) : filteredFaqs.length === 0 ? (
          <div className="py-12 text-center text-slate-400 space-y-2">
            <HelpCircle className="h-10 w-10 mx-auto text-slate-300" />
            <p className="text-sm font-bold text-slate-700">Aucune question fréquente trouvée.</p>
            <p className="text-xs text-slate-400">Cliquez sur « Nouvelle Question Fréquente » pour en créer une.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredFaqs.map((faq, index) => (
              <div
                key={faq.id}
                className="p-4 rounded-xl border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50/50 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-[#0F2C59]/10 text-[#0F2C59] font-bold font-mono text-xs flex items-center justify-center shrink-0 mt-0.5">
                    #{faq.order || (index + 1)}
                  </div>

                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-100 text-amber-900 border border-amber-200">
                        {faq.category || 'Général'}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        faq.published 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : 'bg-slate-200 text-slate-700'
                      }`}>
                        {faq.published ? 'Visible en ligne' : 'Masquée (Brouillon)'}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-slate-900 leading-snug">
                      {faq.question}
                    </h4>

                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                  <button
                    onClick={() => handleTogglePublish(faq)}
                    className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors border cursor-pointer ${
                      faq.published
                        ? 'border-slate-200 bg-white hover:bg-slate-100 text-slate-700'
                        : 'border-emerald-300 bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                    }`}
                    title={faq.published ? 'Masquer du site' : 'Publier sur le site'}
                  >
                    {faq.published ? (
                      <>
                        <EyeOff className="h-3.5 w-3.5 text-slate-500" />
                        <span>Masquer</span>
                      </>
                    ) : (
                      <>
                        <Eye className="h-3.5 w-3.5 text-emerald-600" />
                        <span>Mettre en ligne</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => handleOpenEdit(faq)}
                    className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:text-[#0F2C59] hover:bg-slate-100 transition-colors cursor-pointer"
                    title="Modifier la question"
                  >
                    <Edit3 className="h-4 w-4" />
                  </button>

                  <button
                    onClick={() => handleDelete(faq.id)}
                    className="p-2 rounded-xl border border-slate-200 text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                    title="Supprimer la question"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Add / Edit FAQ */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200 flex flex-col">
            
            {/* Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-xs z-10">
              <div className="flex items-center gap-2.5">
                <HelpCircle className="h-5 w-5 text-[#D4AF37]" />
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {editingFaq ? 'Modifier la Question Fréquente' : 'Ajouter une Question Fréquente'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Affichage automatique dans l'accordéon de la page Contact
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Question fréquente <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex : Quels sont les horaires des cultes à l’Église ?"
                  value={formData.question}
                  onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#0F2C59] outline-none font-medium text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Réponse détaillée du secrétariat <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={6}
                  placeholder="Rédigez une réponse claire, bienveillante et informative..."
                  value={formData.answer}
                  onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#0F2C59] outline-none leading-relaxed text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Catégorie
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#0F2C59] outline-none text-xs"
                  >
                    {categoryPresets.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                    <option value="Autre">Autre catégorie personnalisée...</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Ordre d'affichage (priorité)
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#0F2C59] outline-none text-xs font-mono"
                  />
                </div>
              </div>

              {formData.category === 'Autre' && (
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Nom de la catégorie personnalisée
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex : Mariages, Chorale..."
                    value={formData.customCategory}
                    onChange={(e) => setFormData({ ...formData, customCategory: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#0F2C59] outline-none text-xs"
                  />
                </div>
              )}

              <div className="pt-2 flex items-center gap-2">
                <input
                  type="checkbox"
                  id="faq-published-toggle"
                  checked={formData.published}
                  onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                  className="w-4 h-4 rounded text-[#0F2C59] focus:ring-[#0F2C59] cursor-pointer"
                />
                <label htmlFor="faq-published-toggle" className="font-semibold text-slate-800 cursor-pointer select-none">
                  Publier immédiatement cette question sur la page Contact (visible aux visiteurs)
                </label>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold hover:bg-slate-50 cursor-pointer"
                >
                  Annuler
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-xl bg-[#0F2C59] hover:bg-[#1A365D] text-white font-bold flex items-center gap-2 cursor-pointer shadow-sm disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      <span>Enregistrement...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-4 w-4 text-[#D4AF37]" />
                      <span>{editingFaq ? 'Mettre à jour la question' : 'Enregistrer la question'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
