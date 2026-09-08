import React, { useState, useEffect } from 'react';
import { ChurchPublication } from '../../types';
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
  BookOpen, 
  Calendar, 
  User, 
  X, 
  RefreshCw, 
  Sparkles,
  ExternalLink,
  Image as ImageIcon
} from 'lucide-react';

interface PublicationsManagerProps {
  onPublicationsChanged?: () => void;
}

export const PublicationsManager: React.FC<PublicationsManagerProps> = ({ onPublicationsChanged }) => {
  const [publications, setPublications] = useState<ChurchPublication[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  // Modal / Form state
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingPub, setEditingPub] = useState<ChurchPublication | null>(null);
  const [previewPub, setPreviewPub] = useState<ChurchPublication | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Form fields
  const [formData, setFormData] = useState({
    title: '',
    category: 'Actualité Paroissiale',
    summary: '',
    content: '',
    author: 'Secrétariat Paroissial',
    date: new Date().toISOString().split('T')[0],
    image: '/images/dame_facade.jpg',
    status: 'Publiée' as 'Publiée' | 'Brouillon' | 'Archivée'
  });

  const categories = [
    'Actualité Paroissiale',
    'Message Pastoral',
    'Enseignement & Foi',
    'Jeunesse & JNI',
    'École Professionnelle (EPND)',
    'Événement & Célébration',
    'Témoignage'
  ];

  const loadPublications = async () => {
    setLoading(true);
    try {
      const data = await apiService.getPublications(true);
      setPublications(data);
    } catch (err) {
      console.error('Error fetching publications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPublications();
  }, []);

  const handleOpenCreate = () => {
    setEditingPub(null);
    setFormData({
      title: '',
      category: 'Actualité Paroissiale',
      summary: '',
      content: '',
      author: 'Secrétariat Paroissial',
      date: new Date().toISOString().split('T')[0],
      image: '/images/dame_facade.jpg',
      status: 'Publiée'
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (pub: ChurchPublication) => {
    setEditingPub(pub);
    setFormData({
      title: pub.title,
      category: pub.category,
      summary: pub.summary || '',
      content: pub.content,
      author: pub.author,
      date: pub.date,
      image: pub.image || '/images/dame_facade.jpg',
      status: pub.status === 'Archivée' ? 'Archivée' : pub.status === 'Brouillon' ? 'Brouillon' : 'Publiée'
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) {
      setFeedbackMsg({ type: 'error', text: 'Le titre et le contenu sont obligatoires.' });
      return;
    }

    setSubmitting(true);
    setFeedbackMsg(null);

    try {
      if (editingPub) {
        const updated = await apiService.updatePublication(editingPub.id, {
          title: formData.title.trim(),
          category: formData.category,
          summary: formData.summary.trim() || formData.content.slice(0, 150) + '...',
          content: formData.content.trim(),
          author: formData.author.trim() || 'Secrétariat Paroissial',
          date: formData.date,
          image: formData.image,
          status: formData.status
        });
        if (updated) {
          setPublications(prev => prev.map(p => p.id === editingPub.id ? updated : p));
          setFeedbackMsg({ type: 'success', text: 'Publication mise à jour avec succès.' });
          setIsModalOpen(false);
          if (onPublicationsChanged) onPublicationsChanged();
        }
      } else {
        const created = await apiService.createPublication({
          title: formData.title.trim(),
          category: formData.category,
          summary: formData.summary.trim() || formData.content.slice(0, 150) + '...',
          content: formData.content.trim(),
          author: formData.author.trim() || 'Secrétariat Paroissial',
          date: formData.date,
          image: formData.image,
          status: formData.status
        });
        if (created) {
          setPublications(prev => [created, ...prev]);
          setFeedbackMsg({ type: 'success', text: 'Nouvelle publication enregistrée avec succès.' });
          setIsModalOpen(false);
          if (onPublicationsChanged) onPublicationsChanged();
        }
      }
    } catch (err: any) {
      setFeedbackMsg({ type: 'error', text: err.message || 'Erreur lors de l’enregistrement.' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (pub: ChurchPublication) => {
    const nextStatus = pub.status === 'Publiée' ? 'Brouillon' : 'Publiée';
    try {
      const updated = await apiService.updatePublication(pub.id, { status: nextStatus });
      if (updated) {
        setPublications(prev => prev.map(p => p.id === pub.id ? updated : p));
        if (onPublicationsChanged) onPublicationsChanged();
      }
    } catch (err) {
      console.error('Error toggling publication status:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Voulez-vous vraiment supprimer définitivement cette publication ?')) return;
    try {
      const ok = await apiService.deletePublication(id);
      if (ok) {
        setPublications(prev => prev.filter(p => p.id !== id));
        if (onPublicationsChanged) onPublicationsChanged();
      }
    } catch (err) {
      console.error('Error deleting publication:', err);
    }
  };

  const filtered = publications.filter(p => {
    if (categoryFilter !== 'All' && p.category !== categoryFilter) return false;
    if (statusFilter !== 'All' && p.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return p.title.toLowerCase().includes(q) || 
             p.content.toLowerCase().includes(q) || 
             p.author.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Alert banner */}
      {feedbackMsg && (
        <div className={`p-4 rounded-xl flex items-center justify-between shadow-xs ${
          feedbackMsg.type === 'success' 
            ? 'bg-emerald-50 text-emerald-900 border border-emerald-200' 
            : 'bg-rose-50 text-rose-900 border border-rose-200'
        }`}>
          <div className="flex items-center gap-2.5">
            {feedbackMsg.type === 'success' ? (
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
            ) : (
              <X className="h-5 w-5 text-rose-600" />
            )}
            <p className="text-xs font-semibold">{feedbackMsg.text}</p>
          </div>
          <button 
            onClick={() => setFeedbackMsg(null)}
            className="p-1 hover:opacity-75 text-xs"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Header card */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-[#D4AF37]" />
            <h3 className="text-base font-bold font-display text-slate-900">
              Publications & Actualités Paroissiales ({publications.length})
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Gérez les articles, communiqués officiels, enseignements et nouvelles de la communauté.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-4 py-2.5 rounded-xl bg-[#0F2C59] hover:bg-[#1A365D] text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-colors cursor-pointer shadow-xs"
        >
          <PlusCircle className="h-4 w-4 text-[#D4AF37]" />
          <span>Nouvelle Publication</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="h-4 w-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Rechercher par titre, contenu ou auteur..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-[#0F2C59] outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-700 focus:bg-white focus:ring-2 focus:ring-[#0F2C59] outline-none"
          >
            <option value="All">Toutes les catégories</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-700 focus:bg-white focus:ring-2 focus:ring-[#0F2C59] outline-none"
          >
            <option value="All">Tous les statuts</option>
            <option value="Publiée">Publiées</option>
            <option value="Brouillon">Brouillons</option>
            <option value="Archivée">Archivées</option>
          </select>
        </div>
      </div>

      {/* Publications List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400">
            <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2" />
            <span className="text-xs">Chargement des publications...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center">
            <BookOpen className="h-10 w-10 text-slate-300 mx-auto mb-2" />
            <p className="text-xs text-slate-500 font-medium">Aucune publication ne correspond à vos critères.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filtered.map((pub) => (
              <div key={pub.id} className="p-5 hover:bg-slate-50/80 transition-colors flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-start gap-4 min-w-0">
                  {/* Image thumbnail */}
                  <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-slate-200 bg-slate-100">
                    <img
                      src={pub.image || '/images/dame_facade.jpg'}
                      alt={pub.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/images/dame_facade.jpg';
                      }}
                    />
                  </div>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-100 text-slate-800 border border-slate-200">
                        {pub.category}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        pub.status === 'Publiée' 
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                          : 'bg-amber-100 text-amber-800 border border-amber-200'
                      }`}>
                        {pub.status}
                      </span>
                      <span className="text-[11px] text-slate-400">•</span>
                      <span className="text-[11px] text-slate-500 flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {pub.date}
                      </span>
                      <span className="text-[11px] text-slate-400">•</span>
                      <span className="text-[11px] text-slate-500 flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {pub.author}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-slate-900 truncate">
                      {pub.title}
                    </h4>
                    <p className="text-xs text-slate-600 line-clamp-2 mt-1">
                      {pub.summary || pub.content}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                  {/* Toggle publish */}
                  <button
                    onClick={() => handleToggleStatus(pub)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border ${
                      pub.status === 'Publiée'
                        ? 'border-slate-200 bg-white hover:bg-slate-100 text-slate-700'
                        : 'border-emerald-300 bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                    }`}
                    title={pub.status === 'Publiée' ? 'Dépublier (passer en brouillon)' : 'Mettre en ligne'}
                  >
                    {pub.status === 'Publiée' ? (
                      <>
                        <EyeOff className="h-3.5 w-3.5 text-slate-500" />
                        <span>Dépublier</span>
                      </>
                    ) : (
                      <>
                        <Eye className="h-3.5 w-3.5 text-emerald-600" />
                        <span>Publier</span>
                      </>
                    )}
                  </button>

                  {/* Preview */}
                  <button
                    onClick={() => setPreviewPub(pub)}
                    className="p-2 rounded-xl border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
                    title="Aperçu de la publication"
                  >
                    <Eye className="h-4 w-4" />
                  </button>

                  {/* Edit */}
                  <button
                    onClick={() => handleOpenEdit(pub)}
                    className="p-2 rounded-xl border border-slate-200 text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                    title="Modifier la publication"
                  >
                    <Edit3 className="h-4 w-4" />
                  </button>

                  {/* Delete */}
                  <button
                    onClick={() => handleDelete(pub.id)}
                    className="p-2 rounded-xl border border-slate-200 text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                    title="Supprimer la publication"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Publication Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 flex flex-col">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-xs z-10">
              <div className="flex items-center gap-2.5">
                <BookOpen className="h-5 w-5 text-[#D4AF37]" />
                <h3 className="text-base font-bold text-slate-900 font-display">
                  {editingPub ? 'Modifier la Publication' : 'Créer une Nouvelle Publication'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Titre de la publication <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex : Grande Convocation Paroissiale de Pâques..."
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#0F2C59] outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Catégorie
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#0F2C59] outline-none"
                  >
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Statut de diffusion
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#0F2C59] outline-none"
                  >
                    <option value="Publiée">Publiée (visible immédiatement par tous)</option>
                    <option value="Brouillon">Brouillon (non visible sur le site)</option>
                    <option value="Archivée">Archivée</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Date de publication
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#0F2C59] outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Auteur ou Département
                  </label>
                  <input
                    type="text"
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    placeholder="Secrétariat Paroissial, Pasteur, etc."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#0F2C59] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Image illustrative (URL ou chemin d'accès)
                </label>
                <input
                  type="text"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="/images/dame_facade.jpg"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#0F2C59] outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Résumé court (accroche affichée sur la carte)
                </label>
                <textarea
                  rows={2}
                  value={formData.summary}
                  onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                  placeholder="Bref résumé en 1 ou 2 phrases..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#0F2C59] outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Contenu complet de la publication <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={7}
                  required
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Rédigez l'intégralité du texte ou communiqué paroissial ici..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#0F2C59] outline-none leading-relaxed font-sans"
                />
              </div>

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
                  className="px-6 py-2.5 rounded-xl bg-[#0F2C59] hover:bg-[#1A365D] text-white font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer disabled:opacity-50 shadow-sm"
                >
                  {submitting ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      <span>Enregistrement...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-4 w-4 text-[#D4AF37]" />
                      <span>{editingPub ? 'Mettre à jour' : 'Enregistrer la publication'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Publication Preview Modal */}
      {previewPub && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
            <div className="relative h-48 sm:h-64 bg-slate-900 overflow-hidden">
              <img
                src={previewPub.image || '/images/dame_facade.jpg'}
                alt={previewPub.title}
                className="w-full h-full object-cover"
                onError={(e) => { (e.target as HTMLImageElement).src = '/images/dame_facade.jpg'; }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <button
                onClick={() => setPreviewPub(null)}
                className="absolute top-4 right-4 p-2 bg-black/50 text-white rounded-full hover:bg-black/80"
              >
                <X className="h-5 w-5" />
              </button>
              <div className="absolute bottom-4 left-6 right-6 text-white">
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-[#D4AF37] text-slate-950 inline-block mb-2">
                  {previewPub.category}
                </span>
                <h3 className="text-lg sm:text-xl font-bold font-display leading-tight">
                  {previewPub.title}
                </h3>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-500 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-[#D4AF37]" />
                  <span>{previewPub.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-[#D4AF37]" />
                  <span>{previewPub.author}</span>
                </div>
              </div>

              {previewPub.summary && (
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 italic">
                  {previewPub.summary}
                </div>
              )}

              <div className="text-xs sm:text-sm text-slate-800 whitespace-pre-wrap leading-relaxed">
                {previewPub.content}
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <button
                  onClick={() => setPreviewPub(null)}
                  className="px-5 py-2 rounded-xl bg-[#0F2C59] text-white text-xs font-bold uppercase tracking-wider"
                >
                  Fermer l'aperçu
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
