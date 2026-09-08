import React, { useState, useEffect } from 'react';
import { ChurchEvent, FormSubmission } from '../../types';
import { apiService } from '../../services/apiService';
import { 
  PlusCircle, 
  Search, 
  Edit3, 
  Trash2, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  MapPin, 
  User, 
  X, 
  RefreshCw, 
  Star,
  Users
} from 'lucide-react';

interface EventsManagerProps {
  eventSubmissions?: FormSubmission[];
  onEventsChanged?: () => void;
}

export const EventsManager: React.FC<EventsManagerProps> = ({ eventSubmissions = [], onEventsChanged }) => {
  const [events, setEvents] = useState<ChurchEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [activeSubTab, setActiveSubTab] = useState<'events' | 'registrations'>('events');

  // Modal / Form state
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingEvent, setEditingEvent] = useState<ChurchEvent | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Form fields
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: '/images/dame_facade.jpg',
    date: new Date().toISOString().split('T')[0],
    startTime: '08:00',
    endTime: '12:00',
    location: 'Sanctuaire Principal, Rue Cimetière Damé',
    organizer: 'Secrétariat & Conseil Paroissial',
    category: 'Culte & Célébration',
    status: 'Publié' as 'Publié' | 'Brouillon' | 'Terminé' | 'Annulé',
    highlight: false
  });

  const categories = [
    'Culte & Célébration',
    'Conférence & Séminaire',
    'Jeunesse & JNI',
    'École Professionnelle (EPND)',
    'Évangélisation & Mission',
    'Concert & Louange',
    'Jeûne & Prière'
  ];

  const loadEvents = async () => {
    setLoading(true);
    try {
      const data = await apiService.getEvents(true);
      setEvents(data);
    } catch (err) {
      console.error('Error fetching events:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const handleOpenCreate = () => {
    setEditingEvent(null);
    setFormData({
      title: '',
      description: '',
      image: '/images/dame_facade.jpg',
      date: new Date().toISOString().split('T')[0],
      startTime: '08:00',
      endTime: '12:00',
      location: 'Sanctuaire Principal, Rue Cimetière Damé',
      organizer: 'Secrétariat & Conseil Paroissial',
      category: 'Culte & Célébration',
      status: 'Publié',
      highlight: false
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (evt: ChurchEvent) => {
    setEditingEvent(evt);
    setFormData({
      title: evt.title,
      description: evt.description,
      image: evt.image || '/images/dame_facade.jpg',
      date: evt.date,
      startTime: evt.startTime || '08:00',
      endTime: evt.endTime || '12:00',
      location: evt.location || 'Sanctuaire Principal, Rue Cimetière Damé',
      organizer: evt.organizer || 'Secrétariat & Conseil Paroissial',
      category: evt.category || 'Culte & Célébration',
      status: evt.status as any || 'Publié',
      highlight: Boolean(evt.highlight)
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.description.trim() || !formData.date.trim()) {
      setFeedbackMsg({ type: 'error', text: 'Titre, description et date sont obligatoires.' });
      return;
    }

    setSubmitting(true);
    setFeedbackMsg(null);

    try {
      if (editingEvent) {
        const updated = await apiService.updateEvent(editingEvent.id, {
          title: formData.title.trim(),
          description: formData.description.trim(),
          image: formData.image,
          date: formData.date,
          startTime: formData.startTime,
          endTime: formData.endTime,
          location: formData.location.trim(),
          organizer: formData.organizer.trim(),
          category: formData.category,
          status: formData.status,
          highlight: formData.highlight
        });
        if (updated) {
          setEvents(prev => prev.map(ev => ev.id === editingEvent.id ? updated : ev));
          setFeedbackMsg({ type: 'success', text: 'Événement mis à jour avec succès.' });
          setIsModalOpen(false);
          if (onEventsChanged) onEventsChanged();
        }
      } else {
        const created = await apiService.createEvent({
          title: formData.title.trim(),
          description: formData.description.trim(),
          image: formData.image,
          date: formData.date,
          startTime: formData.startTime,
          endTime: formData.endTime,
          location: formData.location.trim(),
          organizer: formData.organizer.trim(),
          category: formData.category,
          status: formData.status,
          highlight: formData.highlight
        });
        if (created) {
          setEvents(prev => [created, ...prev]);
          setFeedbackMsg({ type: 'success', text: 'Nouvel événement créé avec succès.' });
          setIsModalOpen(false);
          if (onEventsChanged) onEventsChanged();
        }
      }
    } catch (err: any) {
      setFeedbackMsg({ type: 'error', text: err.message || 'Erreur lors de l’enregistrement.' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (evt: ChurchEvent) => {
    const nextStatus = evt.status === 'Publié' ? 'Brouillon' : 'Publié';
    try {
      const updated = await apiService.updateEvent(evt.id, { status: nextStatus });
      if (updated) {
        setEvents(prev => prev.map(e => e.id === evt.id ? updated : e));
        if (onEventsChanged) onEventsChanged();
      }
    } catch (err) {
      console.error('Error toggling event status:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Voulez-vous vraiment supprimer cet événement ?')) return;
    try {
      const ok = await apiService.deleteEvent(id);
      if (ok) {
        setEvents(prev => prev.filter(e => e.id !== id));
        if (onEventsChanged) onEventsChanged();
      }
    } catch (err) {
      console.error('Error deleting event:', err);
    }
  };

  const filteredEvents = events.filter(e => {
    if (statusFilter !== 'All' && e.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return e.title.toLowerCase().includes(q) || 
             e.description.toLowerCase().includes(q) || 
             e.location?.toLowerCase().includes(q);
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
          <button onClick={() => setFeedbackMsg(null)} className="p-1 hover:opacity-75 text-xs">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Header toolbar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-[#D4AF37]" />
            <h3 className="text-base font-bold font-display text-slate-900">
              Gestion des Événements & Calendrier Paroissial
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Planifiez, publiez et modifiez les cultes solennels, conventions, retraites et séminaires.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="bg-slate-100 p-1 rounded-xl flex items-center gap-1 text-xs">
            <button
              onClick={() => setActiveSubTab('events')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                activeSubTab === 'events' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Événements ({events.length})
            </button>
            <button
              onClick={() => setActiveSubTab('registrations')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                activeSubTab === 'registrations' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Inscriptions reçues ({eventSubmissions.length})
            </button>
          </div>

          <button
            onClick={handleOpenCreate}
            className="px-4 py-2.5 rounded-xl bg-[#0F2C59] hover:bg-[#1A365D] text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-colors cursor-pointer shadow-xs"
          >
            <PlusCircle className="h-4 w-4 text-[#D4AF37]" />
            <span>Créer un Événement</span>
          </button>
        </div>
      </div>

      {activeSubTab === 'events' ? (
        <>
          {/* Search bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="h-4 w-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Rechercher un événement par titre, lieu ou description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-[#0F2C59] outline-none"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-700 focus:bg-white focus:ring-2 focus:ring-[#0F2C59] outline-none w-full sm:w-auto"
            >
              <option value="All">Tous les statuts</option>
              <option value="Publié">Publiés</option>
              <option value="Brouillon">Brouillons</option>
              <option value="Terminé">Terminés</option>
              <option value="Annulé">Annulés</option>
            </select>
          </div>

          {/* Events list */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            {loading ? (
              <div className="p-12 text-center text-slate-400">
                <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2" />
                <span className="text-xs">Chargement des événements...</span>
              </div>
            ) : filteredEvents.length === 0 ? (
              <div className="p-12 text-center">
                <Calendar className="h-10 w-10 text-slate-300 mx-auto mb-2" />
                <p className="text-xs text-slate-500 font-medium">Aucun événement enregistré.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {filteredEvents.map((evt) => (
                  <div key={evt.id} className="p-5 hover:bg-slate-50/80 transition-colors flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="flex items-start gap-4 min-w-0">
                      {/* Date Badge */}
                      <div className="w-16 h-16 rounded-2xl bg-[#0F2C59] text-white flex flex-col items-center justify-center shrink-0 border border-[#D4AF37]/30 shadow-xs">
                        <span className="text-[10px] uppercase font-bold text-[#D4AF37]">
                          {new Date(evt.date).toLocaleDateString('fr-FR', { month: 'short' })}
                        </span>
                        <span className="text-lg font-bold font-display leading-tight">
                          {new Date(evt.date).getDate()}
                        </span>
                      </div>

                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-100 text-slate-800 border border-slate-200">
                            {evt.category}
                          </span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            evt.status === 'Publié' 
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                              : 'bg-amber-100 text-amber-800 border border-amber-200'
                          }`}>
                            {evt.status}
                          </span>
                          {evt.highlight && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#D4AF37]/20 text-[#8c7423] border border-[#D4AF37]/40 flex items-center gap-1">
                              <Star className="h-2.5 w-2.5 fill-current" />
                              À la une
                            </span>
                          )}
                          <span className="text-[11px] text-slate-400">•</span>
                          <span className="text-[11px] text-slate-500 flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {evt.startTime} - {evt.endTime}
                          </span>
                        </div>

                        <h4 className="text-sm font-bold text-slate-900 truncate">
                          {evt.title}
                        </h4>
                        <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                          <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                          <span className="truncate">{evt.location}</span>
                        </p>
                        <p className="text-xs text-slate-600 line-clamp-1 mt-1 font-sans">
                          {evt.description}
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                      <button
                        onClick={() => handleToggleStatus(evt)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border ${
                          evt.status === 'Publié'
                            ? 'border-slate-200 bg-white hover:bg-slate-100 text-slate-700'
                            : 'border-emerald-300 bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                        }`}
                        title={evt.status === 'Publié' ? 'Dépublier' : 'Mettre en ligne'}
                      >
                        {evt.status === 'Publié' ? (
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

                      <button
                        onClick={() => handleOpenEdit(evt)}
                        className="p-2 rounded-xl border border-slate-200 text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                        title="Modifier l'événement"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>

                      <button
                        onClick={() => handleDelete(evt.id)}
                        className="p-2 rounded-xl border border-slate-200 text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Supprimer l'événement"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      ) : (
        /* Event submissions list */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Inscriptions du Public aux Événements ({eventSubmissions.length})
            </span>
          </div>

          {eventSubmissions.length === 0 ? (
            <div className="p-12 text-center">
              <Users className="h-10 w-10 text-slate-300 mx-auto mb-2" />
              <p className="text-xs text-slate-500">Aucune inscription reçue via le formulaire pour le moment.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-100/70 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                    <th className="py-3 px-4">Participant</th>
                    <th className="py-3 px-4">Contact</th>
                    <th className="py-3 px-4">Événement ciblé</th>
                    <th className="py-3 px-4">Date de demande</th>
                    <th className="py-3 px-4">Statut</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {eventSubmissions.map((sub) => (
                    <tr key={sub.id} className="hover:bg-slate-50">
                      <td className="py-3 px-4 font-bold text-slate-900">{sub.name}</td>
                      <td className="py-3 px-4">
                        <div className="font-mono text-slate-600">{sub.email}</div>
                        {sub.phone && <div className="text-[11px] text-slate-400">{sub.phone}</div>}
                      </td>
                      <td className="py-3 px-4 text-slate-700">{sub.message}</td>
                      <td className="py-3 px-4 text-slate-500">
                        {new Date(sub.dateReceived).toLocaleDateString('fr-FR')}
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
                          {sub.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Event Edit / Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 flex flex-col">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-xs z-10">
              <div className="flex items-center gap-2.5">
                <Calendar className="h-5 w-5 text-[#D4AF37]" />
                <h3 className="text-base font-bold text-slate-900 font-display">
                  {editingEvent ? 'Modifier l’Événement' : 'Créer un Nouvel Événement'}
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
                  Nom / Titre de l'événement <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex : Grande Convocation de Pentecôte & Réveil Spirituel"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#0F2C59] outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Date de l'événement <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#0F2C59] outline-none"
                  />
                </div>

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
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Heure de début
                  </label>
                  <input
                    type="time"
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#0F2C59] outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Heure de fin
                  </label>
                  <input
                    type="time"
                    value={formData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#0F2C59] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Lieu
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="Sanctuaire Principal, Damé"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#0F2C59] outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Organisateur / Responsable
                  </label>
                  <input
                    type="text"
                    value={formData.organizer}
                    onChange={(e) => setFormData({ ...formData, organizer: e.target.value })}
                    placeholder="Secrétariat, Pasteur, JNI..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#0F2C59] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Description détaillée de l'événement <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Programme, intervenants, détails et invitations..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#0F2C59] outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Statut de diffusion
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#0F2C59] outline-none"
                  >
                    <option value="Publié">Publié (visible sur le site)</option>
                    <option value="Brouillon">Brouillon (privé)</option>
                    <option value="Terminé">Terminé</option>
                    <option value="Annulé">Annulé</option>
                  </select>
                </div>

                <div className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    id="highlight-checkbox"
                    checked={formData.highlight}
                    onChange={(e) => setFormData({ ...formData, highlight: e.target.checked })}
                    className="h-4 w-4 rounded border-slate-300 text-[#0F2C59] focus:ring-[#0F2C59]"
                  />
                  <label htmlFor="highlight-checkbox" className="font-semibold text-slate-700 cursor-pointer select-none">
                    Mettre en avant sur la page d'accueil
                  </label>
                </div>
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
                      <span>{editingEvent ? 'Mettre à jour' : 'Enregistrer l’événement'}</span>
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
