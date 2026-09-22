import React, { useState, useEffect } from 'react';
import { 
  ChurchPublication, 
  PublicationKind, 
  EditorMode, 
  ProjectProgressStatus 
} from '../../types';
import { apiService } from '../../services/apiService';
import { compressImage, PRESET_CHURCH_IMAGES, DEFAULT_CHURCH_IMAGE } from '../../utils/imageOptimizer';
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
  Image as ImageIcon,
  Upload,
  Code2,
  FileText,
  DollarSign,
  Target,
  Layers,
  Megaphone,
  Briefcase
} from 'lucide-react';

interface PublicationsManagerProps {
  onPublicationsChanged?: () => void;
}

export const PublicationsManager: React.FC<PublicationsManagerProps> = ({ onPublicationsChanged }) => {
  const [publications, setPublications] = useState<ChurchPublication[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [typeFilter, setTypeFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  // Modal / Form state
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingPub, setEditingPub] = useState<ChurchPublication | null>(null);
  const [previewPub, setPreviewPub] = useState<ChurchPublication | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [imageCompressing, setImageCompressing] = useState<boolean>(false);
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Form fields
  const [formData, setFormData] = useState({
    title: '',
    publicationType: 'article' as PublicationKind, // 'article' | 'annonce' | 'projet'
    category: 'Actualité de l\'Église',
    summary: '',
    content: '',
    author: 'Secrétariat de l\'Église',
    date: new Date().toISOString().split('T')[0],
    // Image optionnelle
    hasImage: false,
    image: DEFAULT_CHURCH_IMAGE,
    // Mode d'édition
    editorMode: 'visual' as EditorMode, // 'visual' | 'html'
    // Champs spécifiques au Projet
    budget: '',
    targetGoal: '',
    projectStatus: 'En cours' as ProjectProgressStatus,
    status: 'Publiée' as 'Publiée' | 'Brouillon' | 'Archivée'
  });

  const categories = [
    'Actualité de l\'Église',
    'Sermon & Message Pastoral',
    'Annonce Officielle',
    'Projet Communautaire',
    'Enseignement & Foi',
    'Jeunesse & JNI',
    'École Professionnelle (EPND)',
    'Événement & Célébration',
    'Témoignage'
  ];

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageCompressing(true);
    try {
      const compressed = await compressImage(file, 900, 700, 0.75);
      setFormData(prev => ({ ...prev, image: compressed }));
    } catch (err) {
      console.warn('Erreur compression image publication, fallback par défaut:', err);
      setFormData(prev => ({ ...prev, image: DEFAULT_CHURCH_IMAGE }));
    } finally {
      setImageCompressing(false);
    }
  };

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

  const handleOpenCreate = (preselectedType: PublicationKind = 'article') => {
    setEditingPub(null);
    setFormData({
      title: '',
      publicationType: preselectedType,
      category: preselectedType === 'projet' ? 'Projet Communautaire' : preselectedType === 'annonce' ? 'Annonce Officielle' : 'Actualité de l\'Église',
      summary: '',
      content: '',
      author: 'Secrétariat de l\'Église',
      date: new Date().toISOString().split('T')[0],
      hasImage: false,
      image: DEFAULT_CHURCH_IMAGE,
      editorMode: 'visual',
      budget: preselectedType === 'projet' ? '$2,500 USD (MonCash)' : '',
      targetGoal: preselectedType === 'projet' ? 'Bénéficier à 150 familles de la paroisse' : '',
      projectStatus: 'En cours',
      status: 'Publiée'
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (pub: ChurchPublication) => {
    setEditingPub(pub);
    const pubType = pub.publicationType || (pub.category.toLowerCase().includes('projet') ? 'projet' : pub.category.toLowerCase().includes('annonce') ? 'annonce' : 'article');
    const hasImg = Boolean(pub.hasCustomImage || (pub.image && pub.image !== DEFAULT_CHURCH_IMAGE && !pub.image.includes('facade')));

    setFormData({
      title: pub.title,
      publicationType: pubType,
      category: pub.category,
      summary: pub.summary || '',
      content: pub.content,
      author: pub.author,
      date: pub.date,
      hasImage: hasImg,
      image: pub.image || DEFAULT_CHURCH_IMAGE,
      editorMode: pub.editorMode || 'visual',
      budget: pub.budget || '',
      targetGoal: pub.targetGoal || '',
      projectStatus: pub.projectStatus || 'En cours',
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
      let finalImage = formData.hasImage ? (formData.image || DEFAULT_CHURCH_IMAGE) : '';
      if (finalImage.startsWith('data:image') && finalImage.length > 250000) {
        finalImage = await compressImage(finalImage, 900, 700, 0.7);
      }

      const payload: Partial<ChurchPublication> = {
        title: formData.title.trim(),
        category: formData.category,
        summary: formData.summary.trim() || formData.content.slice(0, 150).replace(/<[^>]*>?/gm, '') + '...',
        content: formData.content.trim(),
        author: formData.author.trim() || 'Secrétariat de l\'Église',
        date: formData.date,
        image: finalImage,
        status: formData.status,
        publicationType: formData.publicationType,
        editorMode: formData.editorMode,
        hasCustomImage: formData.hasImage,
        budget: formData.publicationType === 'projet' ? formData.budget.trim() : undefined,
        targetGoal: formData.publicationType === 'projet' ? formData.targetGoal.trim() : undefined,
        projectStatus: formData.publicationType === 'projet' ? formData.projectStatus : undefined
      };

      if (editingPub) {
        const updated = await apiService.updatePublication(editingPub.id, payload as any);
        if (updated) {
          setPublications(prev => prev.map(p => p.id === editingPub.id ? updated : p));
          setFeedbackMsg({ type: 'success', text: 'Publication mise à jour avec succès.' });
          setIsModalOpen(false);
          if (onPublicationsChanged) onPublicationsChanged();
        }
      } else {
        const created = await apiService.createPublication(payload as any);
        if (created) {
          setPublications(prev => [created, ...prev]);
          setFeedbackMsg({ type: 'success', text: 'Nouvelle publication enregistrée avec succès.' });
          setIsModalOpen(false);
          if (onPublicationsChanged) onPublicationsChanged();
        }
      }
    } catch (err: any) {
      console.error('Error saving publication:', err);
      setFeedbackMsg({ type: 'error', text: 'Erreur lors de l’enregistrement de la publication.' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette publication ? Cette action est irréversible.')) return;

    try {
      const ok = await apiService.deletePublication(id);
      if (ok) {
        setPublications(prev => prev.filter(p => p.id !== id));
        setFeedbackMsg({ type: 'success', text: 'Publication supprimée.' });
        if (onPublicationsChanged) onPublicationsChanged();
      }
    } catch (err) {
      console.error('Error deleting publication:', err);
    }
  };

  const handleToggleStatus = async (pub: ChurchPublication) => {
    const newStatus = pub.status === 'Publiée' ? 'Brouillon' : 'Publiée';
    try {
      const updated = await apiService.updatePublication(pub.id, { status: newStatus });
      if (updated) {
        setPublications(prev => prev.map(p => p.id === pub.id ? updated : p));
        if (onPublicationsChanged) onPublicationsChanged();
      }
    } catch (err) {
      console.error('Error toggling publication status:', err);
    }
  };

  // Insertion d'extraits de code HTML rapides
  const insertHtmlSnippet = (tag: string, placeholder: string = 'Texte') => {
    let snippet = '';
    switch (tag) {
      case 'h2':
        snippet = `\n<h2 class="text-xl font-bold text-blue-950 my-3">${placeholder}</h2>\n`;
        break;
      case 'p':
        snippet = `\n<p class="text-gray-700 leading-relaxed my-2">${placeholder}</p>\n`;
        break;
      case 'strong':
        snippet = `<strong>${placeholder}</strong>`;
        break;
      case 'badge':
        snippet = `<span class="inline-block px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">${placeholder}</span>`;
        break;
      case 'alert':
        snippet = `\n<div class="p-4 bg-blue-50 border-l-4 border-blue-900 rounded-r-lg my-3">\n  <p class="font-bold text-blue-950">Avis important :</p>\n  <p class="text-sm text-blue-800">${placeholder}</p>\n</div>\n`;
        break;
      case 'verse':
        snippet = `\n<blockquote class="p-4 my-3 bg-amber-50/70 border-l-4 border-amber-500 rounded-r-lg italic text-amber-950 font-serif text-sm">\n  « ${placeholder} »\n</blockquote>\n`;
        break;
      case 'grid':
        snippet = `\n<div class="grid grid-cols-1 sm:grid-cols-2 gap-4 my-4">\n  <div class="p-3 bg-gray-50 rounded-xl border border-gray-200">\n    <h4 class="font-bold text-sm text-gray-900">Point clé 1</h4>\n    <p class="text-xs text-gray-600">Détails...</p>\n  </div>\n  <div class="p-3 bg-gray-50 rounded-xl border border-gray-200">\n    <h4 class="font-bold text-sm text-gray-900">Point clé 2</h4>\n    <p class="text-xs text-gray-600">Détails...</p>\n  </div>\n</div>\n`;
        break;
      default:
        snippet = `<${tag}>${placeholder}</${tag}>`;
    }
    setFormData(prev => ({
      ...prev,
      content: prev.content + snippet
    }));
  };

  // Filtrage des publications
  const filteredPubs = publications.filter(p => {
    const matchesCategory = categoryFilter === 'All' || p.category === categoryFilter;
    const matchesType = typeFilter === 'All' || 
      (p.publicationType && p.publicationType === typeFilter) ||
      (!p.publicationType && typeFilter === 'article');
    const matchesStatus = statusFilter === 'All' || p.status === statusFilter;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q || (
      p.title.toLowerCase().includes(q) ||
      p.content.toLowerCase().includes(q) ||
      p.author.toLowerCase().includes(q)
    );
    return matchesCategory && matchesType && matchesStatus && matchesSearch;
  });

  return (
    <div id="publications-manager-root" className="space-y-6">
      {/* Messages de feedback */}
      {feedbackMsg && (
        <div className={`p-4 rounded-xl flex items-center justify-between text-sm ${
          feedbackMsg.type === 'success' 
            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
            : 'bg-rose-50 text-rose-800 border border-rose-200'
        }`}>
          <div className="flex items-center gap-2">
            {feedbackMsg.type === 'success' ? <CheckCircle2 className="h-4 w-4 text-emerald-600" /> : <Clock className="h-4 w-4 text-rose-600" />}
            <span>{feedbackMsg.text}</span>
          </div>
          <button onClick={() => setFeedbackMsg(null)} className="text-gray-400 hover:text-gray-600">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* En-tête et Boutons de création rapide */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-2 bg-blue-50 text-blue-900 rounded-xl">
              <BookOpen className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-gray-900">
              Gestion des Publications & Projets
            </h2>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Formulaire universel : Articles & Sermons, Annonces de l'Église et Projets communautaires avec mode visuel ou code HTML personnalisé.
          </p>
        </div>

        {/* Boutons d'action pour publier selon le type */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => handleOpenCreate('article')}
            className="px-3.5 py-2 bg-blue-900 hover:bg-blue-950 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
          >
            <PlusCircle className="h-4 w-4 text-amber-400" />
            <span>Nouvel Article / Sermon</span>
          </button>

          <button
            onClick={() => handleOpenCreate('annonce')}
            className="px-3.5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
          >
            <Megaphone className="h-4 w-4 text-white" />
            <span>Nouvelle Annonce</span>
          </button>

          <button
            onClick={() => handleOpenCreate('projet')}
            className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
          >
            <Briefcase className="h-4 w-4 text-white" />
            <span>Nouveau Projet</span>
          </button>
        </div>
      </div>

      {/* Barre de recherche et filtres de sélection */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col lg:flex-row gap-3 items-center justify-between">
        <div className="relative w-full lg:w-80">
          <Search className="h-4 w-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Rechercher par mot-clé, auteur..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-900 focus:bg-white"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
          {/* Filtre Type */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-900"
          >
            <option value="All">Tous les types</option>
            <option value="article">Articles & Sermons</option>
            <option value="annonce">Annonces & Nouvelles</option>
            <option value="projet">Projets communautaires</option>
          </select>

          {/* Filtre Statut */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-900"
          >
            <option value="All">Tous les statuts</option>
            <option value="Publiée">Publiées</option>
            <option value="Brouillon">Brouillons</option>
            <option value="Archivée">Archivées</option>
          </select>

          <button
            onClick={loadPublications}
            className="p-2 text-gray-500 hover:text-gray-800 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
            title="Rafraîchir"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Liste des publications */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        {loading ? (
          <div className="py-12 flex flex-col items-center justify-center text-gray-400">
            <RefreshCw className="h-8 w-8 animate-spin text-blue-900 mb-2" />
            <p className="text-xs">Chargement des publications...</p>
          </div>
        ) : filteredPubs.length === 0 ? (
          <div className="py-12 text-center text-gray-400">
            <BookOpen className="h-10 w-10 mx-auto text-gray-300 mb-2" />
            <p className="text-sm font-medium text-gray-700">Aucune publication trouvée.</p>
            <p className="text-xs text-gray-400 mt-1">Créez votre première publication via les boutons ci-dessus.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredPubs.map((pub) => {
              const isProject = pub.publicationType === 'projet' || pub.category.toLowerCase().includes('projet');
              const isAnnonce = pub.publicationType === 'annonce' || pub.category.toLowerCase().includes('annonce');

              return (
                <div
                  key={pub.id}
                  className="p-4 rounded-xl border border-gray-200/80 hover:border-blue-900/30 bg-white hover:bg-blue-50/20 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-3.5 flex-1 min-w-0">
                    {/* Miniature image ou icône typographique */}
                    {pub.image && pub.hasCustomImage !== false ? (
                      <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-xl overflow-hidden shrink-0 border border-gray-200 bg-gray-100 shadow-xs">
                        <img
                          src={pub.image}
                          alt={pub.title}
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = DEFAULT_CHURCH_IMAGE;
                          }}
                        />
                      </div>
                    ) : (
                      <div className={`h-16 w-16 sm:h-20 sm:w-20 rounded-xl shrink-0 flex items-center justify-center shadow-xs border ${
                        isProject 
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                          : isAnnonce 
                            ? 'bg-amber-50 text-amber-700 border-amber-200' 
                            : 'bg-blue-50 text-blue-900 border-blue-200'
                      }`}>
                        {isProject ? <Briefcase className="h-7 w-7" /> : isAnnonce ? <Megaphone className="h-7 w-7" /> : <BookOpen className="h-7 w-7" />}
                      </div>
                    )}

                    {/* Données de la publication */}
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-1.5 mb-1">
                        {/* Type */}
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          isProject 
                            ? 'bg-emerald-100 text-emerald-800' 
                            : isAnnonce 
                              ? 'bg-amber-100 text-amber-800' 
                              : 'bg-blue-100 text-blue-900'
                        }`}>
                          {pub.publicationType ? pub.publicationType.toUpperCase() : 'ARTICLE'}
                        </span>

                        {/* Mode Éditeur */}
                        {pub.editorMode === 'html' && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-purple-100 text-purple-800 border border-purple-200 flex items-center gap-1">
                            <Code2 className="w-3 h-3" />
                            <span>HTML</span>
                          </span>
                        )}

                        {/* Statut de diffusion */}
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          pub.status === 'Publiée' 
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}>
                          {pub.status}
                        </span>

                        <span className="text-[11px] text-gray-400">•</span>
                        <span className="text-[11px] text-gray-500 flex items-center gap-1">
                          <Calendar className="h-3 w-3 text-gray-400" />
                          {pub.date}
                        </span>
                        <span className="text-[11px] text-gray-400">•</span>
                        <span className="text-[11px] text-gray-500">{pub.author}</span>
                      </div>

                      <h4 className="text-sm font-bold text-gray-900 truncate">
                        {pub.title}
                      </h4>

                      <p className="text-xs text-gray-500 line-clamp-2 mt-0.5">
                        {pub.summary || pub.content.replace(/<[^>]*>?/gm, '')}
                      </p>

                      {/* Métadonnées Projet (si c'est un projet) */}
                      {isProject && (pub.budget || pub.targetGoal || pub.projectStatus) && (
                        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                          {pub.budget && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-md font-medium">
                              <DollarSign className="w-3 h-3 text-emerald-600" />
                              <span>Budget : {pub.budget}</span>
                            </span>
                          )}
                          {pub.targetGoal && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-800 border border-blue-200 rounded-md font-medium truncate max-w-xs">
                              <Target className="w-3 h-3 text-blue-600" />
                              <span>Objectif : {pub.targetGoal}</span>
                            </span>
                          )}
                          {pub.projectStatus && (
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-md font-semibold text-[10px] ${
                              pub.projectStatus === 'Terminé' 
                                ? 'bg-emerald-100 text-emerald-800' 
                                : pub.projectStatus === 'En cours' 
                                  ? 'bg-blue-100 text-blue-800' 
                                  : 'bg-gray-100 text-gray-700'
                            }`}>
                              Statut : {pub.projectStatus}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5 shrink-0 self-end md:self-center">
                    <button
                      onClick={() => handleToggleStatus(pub)}
                      className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors border cursor-pointer ${
                        pub.status === 'Publiée'
                          ? 'border-gray-200 bg-white hover:bg-gray-100 text-gray-700'
                          : 'border-emerald-300 bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                      }`}
                      title={pub.status === 'Publiée' ? 'Dépublier' : 'Publier'}
                    >
                      {pub.status === 'Publiée' ? (
                        <>
                          <EyeOff className="h-3.5 w-3.5 text-gray-500" />
                          <span>Dépublier</span>
                        </>
                      ) : (
                        <>
                          <Eye className="h-3.5 w-3.5 text-emerald-600" />
                          <span>Publier</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => setPreviewPub(pub)}
                      className="p-2 rounded-xl border border-gray-200 text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                      title="Aperçu"
                    >
                      <Eye className="h-4 w-4" />
                    </button>

                    <button
                      onClick={() => handleOpenEdit(pub)}
                      className="p-2 rounded-xl border border-gray-200 text-gray-600 hover:text-blue-900 hover:bg-blue-50 transition-colors"
                      title="Modifier"
                    >
                      <Edit3 className="h-4 w-4" />
                    </button>

                    <button
                      onClick={() => handleDelete(pub.id)}
                      className="p-2 rounded-xl border border-gray-200 text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Supprimer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal de Création & Modification de Publication */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-gray-200 flex flex-col">
            {/* Entête modal */}
            <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-xs z-10">
              <div className="flex items-center gap-2.5">
                <BookOpen className="h-5 w-5 text-amber-500" />
                <div>
                  <h3 className="text-base font-bold text-gray-900">
                    {editingPub ? 'Modifier la Publication' : 'Formulaire Unique de Publication'}
                  </h3>
                  <p className="text-xs text-gray-500">
                    Église du Nazaréen de Damé — Espace Secrétariat
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-xl hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5 text-xs">
              {/* Sélecteur de type de publication : Article, Annonce, Projet */}
              <div>
                <label className="block font-bold text-gray-700 uppercase tracking-wider text-[11px] mb-2">
                  1. Type de contenu à publier
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, publicationType: 'article' })}
                    className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                      formData.publicationType === 'article'
                        ? 'border-blue-900 bg-blue-50/60 ring-2 ring-blue-900/20 text-blue-950 font-bold'
                        : 'border-gray-200 hover:border-gray-300 text-gray-700 bg-white'
                    }`}
                  >
                    <BookOpen className="w-5 h-5 text-blue-900" />
                    <span>Article / Sermon</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, publicationType: 'annonce' })}
                    className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                      formData.publicationType === 'annonce'
                        ? 'border-amber-600 bg-amber-50/60 ring-2 ring-amber-600/20 text-amber-950 font-bold'
                        : 'border-gray-200 hover:border-gray-300 text-gray-700 bg-white'
                    }`}
                  >
                    <Megaphone className="w-5 h-5 text-amber-600" />
                    <span>Annonce / Nouvelle</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, publicationType: 'projet' })}
                    className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                      formData.publicationType === 'projet'
                        ? 'border-emerald-700 bg-emerald-50/60 ring-2 ring-emerald-700/20 text-emerald-950 font-bold'
                        : 'border-gray-200 hover:border-gray-300 text-gray-700 bg-white'
                    }`}
                  >
                    <Briefcase className="w-5 h-5 text-emerald-700" />
                    <span>Projet Communautaire</span>
                  </button>
                </div>
              </div>

              {/* Titre & Catégorie */}
              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Titre de la publication <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex : Grande Convocation de Pâques / Projet Caprin..."
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 border border-gray-300 text-gray-900 focus:bg-white focus:ring-2 focus:ring-blue-900 outline-none font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">
                    Catégorie
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 border border-gray-300 text-gray-900 focus:bg-white focus:ring-2 focus:ring-blue-900 outline-none"
                  >
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">
                    Statut de diffusion
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 border border-gray-300 text-gray-900 focus:bg-white focus:ring-2 focus:ring-blue-900 outline-none"
                  >
                    <option value="Publiée">Publiée (visible immédiatement en ligne)</option>
                    <option value="Brouillon">Brouillon (invisible aux visiteurs)</option>
                    <option value="Archivée">Archivée</option>
                  </select>
                </div>
              </div>

              {/* Champs spécifiques aux Projets Communautaires */}
              {formData.publicationType === 'projet' && (
                <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl space-y-3">
                  <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs">
                    <Briefcase className="w-4 h-4 text-emerald-700" />
                    <span>Paramètres du Projet Communautaire</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {/* Budget */}
                    <div>
                      <label className="block font-semibold text-gray-700 mb-1">
                        Budget (USD / MonCash HTG)
                      </label>
                      <div className="relative">
                        <DollarSign className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          placeholder="Ex: $5,000 USD ou 250,000 HTG"
                          value={formData.budget}
                          onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                          className="w-full pl-8 pr-3 py-2 bg-white border border-gray-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-700 outline-none"
                        />
                      </div>
                    </div>

                    {/* Objectif */}
                    <div>
                      <label className="block font-semibold text-gray-700 mb-1">
                        Objectif d'impact
                      </label>
                      <div className="relative">
                        <Target className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          placeholder="Ex: 300 familles, 50 têtes de bétail..."
                          value={formData.targetGoal}
                          onChange={(e) => setFormData({ ...formData, targetGoal: e.target.value })}
                          className="w-full pl-8 pr-3 py-2 bg-white border border-gray-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-700 outline-none"
                        />
                      </div>
                    </div>

                    {/* Statut du Projet */}
                    <div>
                      <label className="block font-semibold text-gray-700 mb-1">
                        Statut d'avancement
                      </label>
                      <select
                        value={formData.projectStatus}
                        onChange={(e) => setFormData({ ...formData, projectStatus: e.target.value as any })}
                        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-700 outline-none"
                      >
                        <option value="Planifié">Planifié (en préparation)</option>
                        <option value="En cours">En cours (actif)</option>
                        <option value="Terminé">Terminé (réalisé avec succès)</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Date & Auteur */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">
                    Date de publication
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 border border-gray-300 text-gray-900 focus:bg-white focus:ring-2 focus:ring-blue-900 outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">
                    Auteur ou Département
                  </label>
                  <input
                    type="text"
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    placeholder="Secrétariat de l'Église, Pasteur Bequel CHERELUS..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 border border-gray-300 text-gray-900 focus:bg-white focus:ring-2 focus:ring-blue-900 outline-none"
                  />
                </div>
              </div>

              {/* IMAGE OPTIONNELLE : case à cocher pour afficher le champ */}
              <div className="p-4 bg-gray-50/80 rounded-2xl border border-gray-200 space-y-3">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="has-image-toggle"
                    checked={formData.hasImage}
                    onChange={(e) => setFormData({ ...formData, hasImage: e.target.checked })}
                    className="w-4 h-4 rounded text-blue-900 focus:ring-blue-900 cursor-pointer"
                  />
                  <label htmlFor="has-image-toggle" className="font-semibold text-gray-800 cursor-pointer text-xs select-none">
                    Ajouter une image (Optionnel)
                  </label>
                </div>

                {/* Champ affiché UNIQUEMENT si la case est cochée */}
                {formData.hasImage && (
                  <div className="pt-2 border-t border-gray-200 grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                    <div className="sm:col-span-3 h-20 w-full rounded-xl overflow-hidden border border-gray-200 bg-white relative shadow-inner">
                      <img 
                        src={formData.image || DEFAULT_CHURCH_IMAGE} 
                        alt="Aperçu" 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = DEFAULT_CHURCH_IMAGE;
                        }}
                      />
                    </div>

                    <div className="sm:col-span-9 space-y-2">
                      <div className="flex flex-wrap gap-2">
                        <label className="px-3 py-1.5 rounded-lg bg-blue-900 text-white text-xs font-bold hover:bg-blue-950 cursor-pointer inline-flex items-center gap-1.5 shadow-sm transition-all">
                          <Upload className="h-3.5 w-3.5" />
                          <span>Téléverser une image</span>
                          <input 
                            type="file" 
                            accept="image/*" 
                            className="hidden" 
                            onChange={handleImageFileChange}
                            disabled={imageCompressing}
                          />
                        </label>

                        {PRESET_CHURCH_IMAGES.slice(0, 3).map((img, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => setFormData({ ...formData, image: img.url })}
                            className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                              formData.image === img.url 
                                ? 'bg-amber-100 border-amber-400 text-gray-900 font-bold' 
                                : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-100'
                            }`}
                          >
                            {img.label}
                          </button>
                        ))}
                      </div>

                      <input
                        type="text"
                        value={formData.image}
                        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                        placeholder="URL de l'image..."
                        className="w-full px-3 py-1.5 text-xs rounded-lg bg-white border border-gray-200 text-gray-700 focus:ring-1 focus:ring-blue-900 outline-none"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Résumé court */}
              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Résumé court (accroche affichée sur la carte)
                </label>
                <textarea
                  rows={2}
                  value={formData.summary}
                  onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                  placeholder="Bref aperçu ou accroche en 1 ou 2 phrases..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 border border-gray-300 text-gray-900 focus:bg-white focus:ring-2 focus:ring-blue-900 outline-none"
                />
              </div>

              {/* SÉLECTEUR DE MODE D'ÉDITION : 2 MODES */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-gray-800 uppercase tracking-wider text-[11px]">
                    2. Mode d'édition du contenu
                  </label>
                  {/* Commutateur de mode */}
                  <div className="bg-gray-100 p-1 rounded-xl flex items-center gap-1 border border-gray-200">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, editorMode: 'visual' })}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                        formData.editorMode === 'visual'
                          ? 'bg-white text-blue-950 shadow-xs'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Mode Visuel (Simple)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, editorMode: 'html' })}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                        formData.editorMode === 'html'
                          ? 'bg-purple-900 text-white shadow-xs'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      <Code2 className="w-3.5 h-3.5" />
                      <span>Mode Code HTML</span>
                    </button>
                  </div>
                </div>

                {/* Rendu selon le mode sélectionné */}
                {formData.editorMode === 'visual' ? (
                  // a) Mode Visuel / Éditeur Simple
                  <div>
                    <textarea
                      rows={8}
                      required
                      value={formData.content}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      placeholder="Rédigez l'intégralité du texte ou communiqué ici..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 border border-gray-300 text-gray-900 focus:bg-white focus:ring-2 focus:ring-blue-900 outline-none leading-relaxed font-sans text-sm"
                    />
                  </div>
                ) : (
                  // b) Mode Code HTML (zone de texte avec boutons d'insertion rapide et aperçu dynamique)
                  <div className="space-y-2">
                    {/* Barre d'outils balises rapides */}
                    <div className="flex flex-wrap gap-1.5 p-2 bg-purple-50/70 border border-purple-200 rounded-xl">
                      <span className="text-[10px] font-bold text-purple-900 self-center mr-1">Balises :</span>
                      <button
                        type="button"
                        onClick={() => insertHtmlSnippet('h2', 'Sous-titre')}
                        className="px-2 py-1 bg-white border border-purple-200 rounded text-[11px] font-mono hover:bg-purple-100 text-purple-900"
                      >
                        &lt;h2&gt;
                      </button>
                      <button
                        type="button"
                        onClick={() => insertHtmlSnippet('p', 'Paragraphe de texte')}
                        className="px-2 py-1 bg-white border border-purple-200 rounded text-[11px] font-mono hover:bg-purple-100 text-purple-900"
                      >
                        &lt;p&gt;
                      </button>
                      <button
                        type="button"
                        onClick={() => insertHtmlSnippet('strong', 'Texte en gras')}
                        className="px-2 py-1 bg-white border border-purple-200 rounded text-[11px] font-mono hover:bg-purple-100 text-purple-900"
                      >
                        &lt;strong&gt;
                      </button>
                      <button
                        type="button"
                        onClick={() => insertHtmlSnippet('badge', 'Badge Spécial')}
                        className="px-2 py-1 bg-white border border-purple-200 rounded text-[11px] font-mono hover:bg-purple-100 text-purple-900"
                      >
                        Badge
                      </button>
                      <button
                        type="button"
                        onClick={() => insertHtmlSnippet('verse', 'Jean 3:16')}
                        className="px-2 py-1 bg-white border border-purple-200 rounded text-[11px] font-mono hover:bg-purple-100 text-purple-900"
                      >
                        Citation Biblique
                      </button>
                      <button
                        type="button"
                        onClick={() => insertHtmlSnippet('alert', 'Communiqué important')}
                        className="px-2 py-1 bg-white border border-purple-200 rounded text-[11px] font-mono hover:bg-purple-100 text-purple-900"
                      >
                        Encadré Alerte
                      </button>
                      <button
                        type="button"
                        onClick={() => insertHtmlSnippet('grid', 'Blocs')}
                        className="px-2 py-1 bg-white border border-purple-200 rounded text-[11px] font-mono hover:bg-purple-100 text-purple-900"
                      >
                        Grille 2 colonnes
                      </button>
                    </div>

                    {/* Zone de code HTML */}
                    <textarea
                      rows={10}
                      required
                      value={formData.content}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      placeholder="Collez ou rédigez votre code HTML/CSS personnalisé ici..."
                      className="w-full p-3 rounded-xl bg-slate-950 text-emerald-400 font-mono text-xs border border-purple-900 focus:ring-2 focus:ring-purple-600 outline-none leading-relaxed"
                    />

                    {/* Aperçu en direct du code HTML */}
                    {formData.content.trim() && (
                      <div className="p-4 bg-white rounded-xl border border-gray-200 space-y-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
                          Aperçu interactif du rendu HTML :
                        </span>
                        <div 
                          className="prose prose-sm max-w-none text-gray-800 p-2 border border-dashed border-gray-200 rounded-lg bg-gray-50/50"
                          dangerouslySetInnerHTML={{ __html: formData.content }}
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Boutons d'action */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 cursor-pointer"
                >
                  Annuler
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-xl bg-blue-900 hover:bg-blue-950 text-white font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer disabled:opacity-50 shadow-sm"
                >
                  {submitting ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      <span>Enregistrement...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-4 w-4 text-amber-400" />
                      <span>{editingPub ? 'Mettre à jour' : 'Enregistrer la publication'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal d'Aperçu de la Publication */}
      {previewPub && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200">
            {previewPub.image && previewPub.hasCustomImage !== false ? (
              <div className="relative h-48 sm:h-64 bg-gray-900 overflow-hidden">
                <img
                  src={previewPub.image}
                  alt={previewPub.title}
                  className="w-full h-full object-cover"
                  onError={(e) => { (e.target as HTMLImageElement).src = DEFAULT_CHURCH_IMAGE; }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <button
                  onClick={() => setPreviewPub(null)}
                  className="absolute top-4 right-4 p-2 bg-black/50 text-white rounded-full hover:bg-black/80 cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
                <div className="absolute bottom-4 left-6 right-6 text-white">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-amber-400 text-slate-950 inline-block mb-2">
                    {previewPub.category}
                  </span>
                  <h3 className="text-lg sm:text-xl font-bold leading-tight">
                    {previewPub.title}
                  </h3>
                </div>
              </div>
            ) : (
              <div className="p-6 bg-gradient-to-r from-blue-900 to-indigo-900 text-white relative">
                <button
                  onClick={() => setPreviewPub(null)}
                  className="absolute top-4 right-4 p-2 bg-white/20 text-white rounded-full hover:bg-white/30 cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-amber-400 text-slate-950 inline-block mb-2">
                  {previewPub.category}
                </span>
                <h3 className="text-lg sm:text-xl font-bold leading-tight">
                  {previewPub.title}
                </h3>
              </div>
            )}

            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between text-xs text-gray-500 pb-3 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-amber-500" />
                  <span>{previewPub.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-amber-500" />
                  <span>{previewPub.author}</span>
                </div>
              </div>

              {/* Badges Spécifiques Projet */}
              {(previewPub.budget || previewPub.targetGoal || previewPub.projectStatus) && (
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex flex-wrap gap-2 text-xs">
                  {previewPub.budget && (
                    <span className="font-semibold text-emerald-900">
                      Budget : <strong>{previewPub.budget}</strong>
                    </span>
                  )}
                  {previewPub.targetGoal && (
                    <span className="text-emerald-800">
                      • Objectif : <strong>{previewPub.targetGoal}</strong>
                    </span>
                  )}
                  {previewPub.projectStatus && (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-900 font-bold text-[10px]">
                      {previewPub.projectStatus}
                    </span>
                  )}
                </div>
              )}

              {previewPub.summary && (
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 italic">
                  {previewPub.summary}
                </div>
              )}

              {/* Rendu contenu soit HTML personnalisé soit texte formatté */}
              {previewPub.editorMode === 'html' ? (
                <div 
                  className="prose prose-sm max-w-none text-gray-800 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: previewPub.content }}
                />
              ) : (
                <div className="text-xs sm:text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">
                  {previewPub.content}
                </div>
              )}

              <div className="pt-4 border-t border-gray-100 flex justify-end">
                <button
                  onClick={() => setPreviewPub(null)}
                  className="px-5 py-2 rounded-xl bg-blue-900 text-white text-xs font-bold uppercase tracking-wider cursor-pointer"
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
