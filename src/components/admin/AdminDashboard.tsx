import React, { useState, useEffect, useMemo } from 'react';
import { 
  FormSubmission, 
  SubmissionCategory, 
  SubmissionStatus, 
  NewsletterSubscriber, 
  NewsletterCampaign, 
  AdminStats,
  ChurchPodcast,
  PodcastCategory
} from '../../types';
import { apiService, AdminUser } from '../../services/apiService';
import { CHURCH_INFO } from '../../data/churchData';
import { CHURCH_ASSETS } from '../../data/churchMedia';
import { 
  adminSecurityService, 
  DEFAULT_ADMIN_PASSCODE, 
  ADMIN_RECOVERY_EMAIL 
} from '../../services/adminSecurityService';
import { 
  LayoutDashboard, 
  FileText, 
  Heart, 
  Mail, 
  Calendar, 
  Users, 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Archive, 
  Trash2, 
  Download, 
  PlusCircle, 
  Send, 
  Eye, 
  EyeOff,
  ExternalLink, 
  LogOut, 
  RefreshCw, 
  Edit3, 
  MessageSquare, 
  ShieldCheck, 
  ChevronRight, 
  X,
  Phone,
  Sparkles,
  Inbox,
  Radio,
  Play,
  Pause,
  Upload,
  Music,
  Key,
  Lock,
  RotateCcw,
  BookOpen
} from 'lucide-react';
import { PublicationsManager } from './PublicationsManager';
import { EventsManager } from './EventsManager';

interface AdminDashboardProps {
  currentUser: AdminUser;
  onLogout: () => void;
  onNavigateToWebsite: () => void;
}

type DashboardTab = 
  | 'overview' 
  | 'forms' 
  | 'documents' 
  | 'prayers' 
  | 'newsletter' 
  | 'events'
  | 'publications'
  | 'podcasts'
  | 'security';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  currentUser,
  onLogout,
  onNavigateToWebsite
}) => {
  const [activeTab, setActiveTab] = useState<DashboardTab>('overview');
  
  // Security settings state
  const [oldPasscode, setOldPasscode] = useState('');
  const [newPasscode, setNewPasscode] = useState('');
  const [confirmPasscode, setConfirmPasscode] = useState('');
  const [showOldPass, setShowOldPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [securityLoading, setSecurityLoading] = useState(false);
  const [securitySuccess, setSecuritySuccess] = useState<string | null>(null);
  const [securityError, setSecurityError] = useState<string | null>(null);
  const [activePasscode, setActivePasscode] = useState<string>(() => adminSecurityService.getPasscode());
  const [showCurrentCode, setShowCurrentCode] = useState(false);

  // Data state
  const [submissions, setSubmissions] = useState<FormSubmission[]>([]);
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([]);
  const [campaigns, setCampaigns] = useState<NewsletterCampaign[]>([]);
  const [podcasts, setPodcasts] = useState<ChurchPodcast[]>([]);
  const [publicationsCount, setPublicationsCount] = useState<number>(0);
  const [eventsCount, setEventsCount] = useState<number>(0);
  const [subscriberSearch, setSubscriberSearch] = useState<string>('');
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  // Podcast state
  const [isAddingPodcast, setIsAddingPodcast] = useState<boolean>(false);
  const [isPublishingPodcast, setIsPublishingPodcast] = useState<boolean>(false);
  const [podcastSuccessMsg, setPodcastSuccessMsg] = useState<string | null>(null);
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);
  const [podcastForm, setPodcastForm] = useState({
    title: '',
    preacher: 'Pasteur Bequel CHERELUS',
    date: new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }),
    category: 'Prédication' as PodcastCategory,
    description: '',
    audioUrl: '',
    duration: '25:00',
    coverImage: '/images/pasteur_bequel.jpg',
    fileName: ''
  });

  // Audio preview element ref
  const [audioPreviewEl, setAudioPreviewEl] = useState<HTMLAudioElement | null>(null);

  // Filters for submissions table
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Selected submission modal
  const [selectedSubmission, setSelectedSubmission] = useState<FormSubmission | null>(null);
  const [editingNotes, setEditingNotes] = useState<string>('');
  const [isSavingNotes, setIsSavingNotes] = useState<boolean>(false);

  // New Campaign state
  const [isCreatingCampaign, setIsCreatingCampaign] = useState<boolean>(false);
  const [campaignForm, setCampaignForm] = useState({
    title: '',
    subject: '',
    content: '',
    targetAudience: 'Tous les membres et abonnés',
    status: 'Draft' as 'Draft' | 'Sent'
  });

  // Load all dashboard data
  const loadData = async () => {
    try {
      const [subs, nls, cmps, pods, st, pubs, evts] = await Promise.all([
        apiService.getSubmissions(),
        apiService.getNewsletterSubscribers(),
        apiService.getNewsletterCampaigns(),
        apiService.getPodcasts(),
        apiService.getAdminStats(),
        apiService.getPublications(true),
        apiService.getEvents(true)
      ]);
      setSubmissions(subs);
      setSubscribers(nls);
      setCampaigns(cmps);
      setPodcasts(pods);
      setStats(st);
      setPublicationsCount(pubs.length);
      setEventsCount(evts.length);
    } catch (err) {
      console.error('Error loading dashboard data:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  // Status badge styling helper
  const getStatusBadge = (status: SubmissionStatus) => {
    switch (status) {
      case 'En attente':
      case 'New':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
            <Clock className="h-3 w-3" />
            En attente
          </span>
        );
      case 'En cours':
      case 'In progress':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">
            <RefreshCw className="h-3 w-3" />
            En cours
          </span>
        );
      case 'Approuvée':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="h-3 w-3" />
            Approuvée
          </span>
        );
      case 'Refusée':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200">
            <X className="h-3 w-3" />
            Refusée
          </span>
        );
      case 'Terminée':
      case 'Completed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-100 text-teal-800 border border-teal-200">
            <CheckCircle2 className="h-3 w-3" />
            Terminée
          </span>
        );
      case 'Archived':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
            <Archive className="h-3 w-3" />
            Archivé
          </span>
        );
    }
  };

  // Category badge styling helper
  const getCategoryBadge = (cat: SubmissionCategory) => {
    switch (cat) {
      case 'Document Requests':
        return <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">Documents</span>;
      case 'Prayer Requests':
        return <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">Prière</span>;
      case 'Contact Messages':
        return <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-sky-50 text-sky-700 border border-sky-200">Contact</span>;
      case 'Event Registration':
        return <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-purple-50 text-purple-700 border border-purple-200">Événement / EPND</span>;
      case 'Volunteer Requests':
        return <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-teal-50 text-teal-700 border border-teal-200">Bénévolat</span>;
      case 'Donation/Giving Messages':
        return <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">Don / Soutien</span>;
      case 'Newsletter Subscribers':
        return <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">Newsletter</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">Général</span>;
    }
  };

  // Update Status
  const handleUpdateStatus = async (id: string, newStatus: SubmissionStatus) => {
    const updated = await apiService.updateSubmission(id, { status: newStatus });
    if (updated) {
      setSubmissions(prev => prev.map(s => s.id === id ? updated : s));
      if (selectedSubmission && selectedSubmission.id === id) {
        setSelectedSubmission(updated);
      }
      loadData();
    }
  };

  // Save Notes
  const handleSaveNotes = async () => {
    if (!selectedSubmission) return;
    setIsSavingNotes(true);
    const updated = await apiService.updateSubmission(selectedSubmission.id, { notes: editingNotes });
    if (updated) {
      setSubmissions(prev => prev.map(s => s.id === selectedSubmission.id ? updated : s));
      setSelectedSubmission(updated);
    }
    setIsSavingNotes(false);
  };

  // Delete submission
  const handleDeleteSubmission = async (id: string) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette demande ?')) return;
    const ok = await apiService.deleteSubmission(id);
    if (ok) {
      setSubmissions(prev => prev.filter(s => s.id !== id));
      if (selectedSubmission?.id === id) setSelectedSubmission(null);
      loadData();
    }
  };

  // Export Newsletter CSV
  const handleExportCsv = () => {
    window.open('/api/newsletter/export', '_blank');
  };

  // Delete Newsletter Subscriber
  const handleDeleteSubscriber = async (id: string) => {
    if (!window.confirm('Voulez-vous supprimer cet abonné de la liste de diffusion ?')) return;
    const ok = await apiService.deleteSubscriber(id);
    if (ok) {
      setSubscribers(prev => prev.filter(s => s.id !== id));
      loadData();
    }
  };

  // Toggle Newsletter Subscriber Status
  const handleToggleSubscriberStatus = async (sub: NewsletterSubscriber) => {
    const nextStatus = sub.status === 'Active' ? 'Unsubscribed' : 'Active';
    const ok = await apiService.updateSubscriberStatus(sub.id, nextStatus);
    if (ok) {
      setSubscribers(prev => prev.map(s => s.id === sub.id ? { ...s, status: nextStatus } : s));
      loadData();
    }
  };

  // Audio File Selection & Processing
  const handleAudioFileSelect = (file: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      
      // Probe duration
      const tempAudio = new Audio(dataUrl);
      tempAudio.onloadedmetadata = () => {
        const sec = Math.floor(tempAudio.duration);
        const mins = Math.floor(sec / 60);
        const remSecs = sec % 60;
        const formattedDuration = `${mins.toString().padStart(2, '0')}:${remSecs.toString().padStart(2, '0')}`;
        setPodcastForm(prev => ({
          ...prev,
          audioUrl: dataUrl,
          duration: formattedDuration,
          fileName: file.name
        }));
      };
      
      setPodcastForm(prev => ({
        ...prev,
        audioUrl: dataUrl,
        fileName: file.name
      }));
    };
    reader.readAsDataURL(file);
  };

  // Submit new Podcast
  const handleCreatePodcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!podcastForm.title || !podcastForm.preacher || !podcastForm.description) {
      alert('Veuillez remplir le titre, le prédicateur et la description.');
      return;
    }
    if (!podcastForm.audioUrl) {
      alert('Veuillez sélectionner un fichier audio (MP3 ou WAV).');
      return;
    }

    setIsPublishingPodcast(true);
    try {
      const newPod = await apiService.createPodcast({
        title: podcastForm.title,
        preacher: podcastForm.preacher,
        date: podcastForm.date || new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }),
        category: podcastForm.category,
        description: podcastForm.description,
        audioUrl: podcastForm.audioUrl,
        duration: podcastForm.duration || '25:00',
        coverImage: podcastForm.coverImage || '/images/pasteur_bequel.jpg'
      });

      if (newPod) {
        setPodcasts(prev => [newPod, ...prev]);
        setIsAddingPodcast(false);
        setPodcastSuccessMsg('Message audio publié avec succès ! Il est maintenant en ligne sur la page publique Podcast.');
        setTimeout(() => setPodcastSuccessMsg(null), 6000);
        // Reset form
        setPodcastForm({
          title: '',
          preacher: 'Pasteur Bequel CHERELUS',
          date: new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }),
          category: 'Prédication',
          description: '',
          audioUrl: '',
          duration: '25:00',
          coverImage: '/images/pasteur_bequel.jpg',
          fileName: ''
        });
      }
    } catch (err: any) {
      alert(err.message || 'Erreur lors de la publication du message audio.');
    } finally {
      setIsPublishingPodcast(false);
    }
  };

  // Delete Podcast
  const handleDeletePodcast = async (id: string) => {
    if (!window.confirm('Voulez-vous vraiment supprimer ce message audio ?')) return;
    const ok = await apiService.deletePodcast(id);
    if (ok) {
      setPodcasts(prev => prev.filter(p => p.id !== id));
      if (playingAudioId === id && audioPreviewEl) {
        audioPreviewEl.pause();
        setPlayingAudioId(null);
      }
    }
  };

  // Toggle mini player in admin
  const handleTogglePlayPodcast = (podcast: ChurchPodcast) => {
    if (playingAudioId === podcast.id) {
      audioPreviewEl?.pause();
      setPlayingAudioId(null);
    } else {
      if (audioPreviewEl) {
        audioPreviewEl.pause();
      }
      const el = new Audio(podcast.audioUrl);
      el.play().catch(e => console.log('Audio preview play prevented', e));
      el.onended = () => setPlayingAudioId(null);
      setAudioPreviewEl(el);
      setPlayingAudioId(podcast.id);
    }
  };

  // Submit new campaign
  const handleCreateCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!campaignForm.title || !campaignForm.content) return;

    const res = await apiService.createNewsletterCampaign(campaignForm);
    if (res) {
      setCampaigns(prev => [res, ...prev]);
      setIsCreatingCampaign(false);
      setCampaignForm({
        title: '',
        subject: '',
        content: '',
        targetAudience: 'Tous les membres et abonnés',
        status: 'Draft'
      });
    }
  };

  // Change Admin Passcode handler
  const handleUpdatePasscode = async (e: React.FormEvent) => {
    e.preventDefault();
    setSecurityError(null);
    setSecuritySuccess(null);

    if (!oldPasscode.trim()) {
      setSecurityError("Veuillez renseigner votre ancien code d'accès actuel.");
      return;
    }

    if (!newPasscode.trim()) {
      setSecurityError("Veuillez renseigner votre nouveau code d'accès.");
      return;
    }

    if (newPasscode.trim().length < 4) {
      setSecurityError("Le nouveau code d'accès doit contenir au moins 4 caractères.");
      return;
    }

    if (newPasscode.trim() !== confirmPasscode.trim()) {
      setSecurityError("La confirmation ne correspond pas au nouveau code d'accès.");
      return;
    }

    setSecurityLoading(true);

    try {
      const res = await adminSecurityService.changePasscode(oldPasscode.trim(), newPasscode.trim());
      if (res.success) {
        setActivePasscode(newPasscode.trim());
        setOldPasscode('');
        setNewPasscode('');
        setConfirmPasscode('');
        setSecuritySuccess(res.message);
      } else {
        setSecurityError(res.message);
      }
    } catch (err: any) {
      setSecurityError(err.message || "Erreur lors de la modification du code d'accès.");
    } finally {
      setSecurityLoading(false);
    }
  };

  // Emergency reset to initial default passcode 123456
  const handleResetToDefaultCode = async () => {
    if (!window.confirm("Voulez-vous vraiment rétablir le code d'accès administrateur au code initial par défaut : 123456 ?")) {
      return;
    }
    setSecurityLoading(true);
    setSecurityError(null);
    setSecuritySuccess(null);
    try {
      const res = await adminSecurityService.recoverPasscode(ADMIN_RECOVERY_EMAIL);
      if (res.success) {
        setActivePasscode(DEFAULT_ADMIN_PASSCODE);
        setOldPasscode('');
        setNewPasscode('');
        setConfirmPasscode('');
        setSecuritySuccess(`Le code d'accès a été réinitialisé au code par défaut : ${DEFAULT_ADMIN_PASSCODE}.`);
      } else {
        setSecurityError(res.message);
      }
    } catch {
      setSecurityError("Erreur lors de la réinitialisation du code.");
    } finally {
      setSecurityLoading(false);
    }
  };

  // Filtered submissions
  const filteredSubmissions = useMemo(() => {
    return submissions.filter(item => {
      // Category filter
      if (categoryFilter !== 'All' && item.category !== categoryFilter) return false;
      // Tab-specific implicit filters
      if (activeTab === 'documents' && item.category !== 'Document Requests') return false;
      if (activeTab === 'prayers' && item.category !== 'Prayer Requests') return false;
      if (activeTab === 'events' && item.category !== 'Event Registration') return false;

      // Status filter
      if (statusFilter !== 'All') {
        if (statusFilter === 'En attente') {
          if (item.status !== 'En attente' && item.status !== 'New') return false;
        } else if (statusFilter === 'En cours') {
          if (item.status !== 'En cours' && item.status !== 'In progress') return false;
        } else if (statusFilter === 'Terminée') {
          if (item.status !== 'Terminée' && item.status !== 'Completed') return false;
        } else {
          if (item.status !== statusFilter) return false;
        }
      }

      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const inName = item.name.toLowerCase().includes(q);
        const inEmail = item.email.toLowerCase().includes(q);
        const inPhone = item.phone && item.phone.toLowerCase().includes(q);
        const inMsg = item.message.toLowerCase().includes(q);
        const inCat = item.category.toLowerCase().includes(q);
        return inName || inEmail || inPhone || inMsg || inCat;
      }

      return true;
    });
  }, [submissions, categoryFilter, statusFilter, searchQuery, activeTab]);

  const pendingCount = submissions.filter(s => s.status === 'New' || s.status === 'En attente').length;
  const pendingDocsCount = submissions.filter(s => s.category === 'Document Requests' && (s.status === 'New' || s.status === 'En attente')).length;

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row font-sans text-slate-900">
      
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-[#0F2C59] text-white flex flex-col justify-between shrink-0 border-r border-[#D4AF37]/20">
        <div>
          {/* Brand Header */}
          <div className="p-5 border-b border-white/10 flex items-center gap-3">
            <img 
              src={CHURCH_ASSETS.logo.src || "/images/logo.png"} 
              alt="Sceau Église de Damé" 
              className="h-10 w-10 object-contain bg-white/10 p-1 rounded-xl"
            />
            <div>
              <h1 className="text-xs font-bold font-display uppercase tracking-wider text-[#D4AF37]">
                Secrétariat Général
              </h1>
              <p className="text-xs text-white font-semibold truncate max-w-[140px]">
                {CHURCH_INFO.name}
              </p>
            </div>
          </div>

          {/* User badge */}
          <div className="px-5 py-3.5 bg-black/20 text-xs flex items-center justify-between border-b border-white/5">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-slate-200 font-medium">{currentUser.username}</span>
            </div>
            <span className="text-[10px] text-[#D4AF37] font-mono uppercase bg-white/10 px-2 py-0.5 rounded">
              {currentUser.role}
            </span>
          </div>

          {/* Nav Items */}
          <nav className="p-3 space-y-1">
            <button
              onClick={() => { setActiveTab('overview'); setCategoryFilter('All'); }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'overview'
                  ? 'bg-[#D4AF37] text-slate-950 font-bold shadow-sm'
                  : 'text-slate-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <LayoutDashboard className="h-4 w-4" />
                <span>Vue d'ensemble</span>
              </div>
              {pendingCount > 0 && (
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  activeTab === 'overview' ? 'bg-slate-900 text-white' : 'bg-rose-500 text-white'
                }`}>
                  {pendingCount}
                </span>
              )}
            </button>

            <button
              onClick={() => { setActiveTab('forms'); setCategoryFilter('All'); }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'forms'
                  ? 'bg-[#D4AF37] text-slate-950 font-bold shadow-sm'
                  : 'text-slate-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Inbox className="h-4 w-4" />
                <span>Tous les Formulaires</span>
              </div>
              <span className="text-[10px] opacity-70 font-mono">
                {submissions.length}
              </span>
            </button>

            <button
              onClick={() => { setActiveTab('documents'); setCategoryFilter('Document Requests'); }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'documents'
                  ? 'bg-[#D4AF37] text-slate-950 font-bold shadow-sm'
                  : 'text-slate-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <FileText className="h-4 w-4" />
                <span>Demandes de Documents</span>
              </div>
              {pendingDocsCount > 0 && (
                <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-400 text-slate-900">
                  {pendingDocsCount}
                </span>
              )}
            </button>

            <button
              onClick={() => { setActiveTab('prayers'); setCategoryFilter('Prayer Requests'); }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'prayers'
                  ? 'bg-[#D4AF37] text-slate-950 font-bold shadow-sm'
                  : 'text-slate-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Heart className="h-4 w-4" />
                <span>Demandes de Prière</span>
              </div>
              <span className="text-[10px] opacity-70 font-mono">
                {submissions.filter(s => s.category === 'Prayer Requests').length}
              </span>
            </button>

            <button
              onClick={() => { setActiveTab('events'); }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'events'
                  ? 'bg-[#D4AF37] text-slate-950 font-bold shadow-sm'
                  : 'text-slate-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Calendar className="h-4 w-4" />
                <span>Événements & Inscriptions</span>
              </div>
              <span className="text-[10px] opacity-70 font-mono">
                {eventsCount || submissions.filter(s => s.category === 'Event Registration').length}
              </span>
            </button>

            <button
              onClick={() => { setActiveTab('publications'); }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'publications'
                  ? 'bg-[#D4AF37] text-slate-950 font-bold shadow-sm'
                  : 'text-slate-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <BookOpen className="h-4 w-4" />
                <span>Publications & Actualités</span>
              </div>
              <span className="text-[10px] opacity-70 font-mono">
                {publicationsCount}
              </span>
            </button>

            <button
              onClick={() => { setActiveTab('newsletter'); setCategoryFilter('Newsletter Subscribers'); }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'newsletter'
                  ? 'bg-[#D4AF37] text-slate-950 font-bold shadow-sm'
                  : 'text-slate-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Mail className="h-4 w-4" />
                <span>Newsletter & Diffusion</span>
              </div>
              <span className="text-[10px] opacity-70 font-mono">
                {subscribers.length}
              </span>
            </button>

            <button
              onClick={() => { setActiveTab('podcasts'); }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'podcasts'
                  ? 'bg-[#D4AF37] text-slate-950 font-bold shadow-sm'
                  : 'text-slate-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Radio className="h-4 w-4" />
                <span>Gestion Podcast</span>
              </div>
              <span className="text-[10px] opacity-70 font-mono">
                {podcasts.length}
              </span>
            </button>

            <button
              onClick={() => { setActiveTab('security'); }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'security'
                  ? 'bg-[#D4AF37] text-slate-950 font-bold shadow-sm'
                  : 'text-slate-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="h-4 w-4" />
                <span>Paramètres de sécurité</span>
              </div>
              <span className="text-[10px] opacity-70 font-mono bg-white/10 px-1.5 py-0.5 rounded">
                Code
              </span>
            </button>
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-white/10 space-y-2">
          <button
            onClick={onNavigateToWebsite}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-white/10 hover:text-white transition-colors"
          >
            <ExternalLink className="h-4 w-4" />
            <span>Voir le site public</span>
          </button>
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-rose-300 hover:bg-rose-950/50 hover:text-rose-200 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            <span>Se déconnecter</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        
        {/* Top Header Bar */}
        <header className="bg-white border-b border-slate-200 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 sticky top-0 z-10 shadow-xs">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold font-display text-slate-900">
                {activeTab === 'overview' && "Tableau de Bord du Secrétariat"}
                {activeTab === 'forms' && "Centre de Gestion des Formulaires"}
                {activeTab === 'documents' && "Gestion des Demandes de Documents"}
                {activeTab === 'prayers' && "Registre des Demandes de Prière & Intercession"}
                {activeTab === 'events' && "Gestion des Événements & Inscriptions"}
                {activeTab === 'publications' && "Gestion des Publications & Actualités"}
                {activeTab === 'newsletter' && "Système d'Abonnements & Newsletter"}
                {activeTab === 'podcasts' && "Gestion des Podcasts & Messages Audio"}
                {activeTab === 'security' && "Paramètres de Sécurité & Code d'Accès"}
              </h2>
              {refreshing && <RefreshCw className="h-4 w-4 animate-spin text-slate-400" />}
            </div>
            <p className="text-xs text-slate-500">
              Paroisse de Damé • « Sainteté à l’Éternel » • District Bas Nord-Ouest
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleRefresh}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
              title="Rafraîchir les données"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? 'animate-spin' : ''}`} />
              <span>Actualiser</span>
            </button>

            <button
              onClick={onNavigateToWebsite}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#0F2C59] hover:bg-[#1A365D] text-white text-xs font-semibold transition-colors"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              <span>Accéder au site</span>
            </button>
          </div>
        </header>

        {/* Content Container */}
        <div className="p-6 space-y-6">

          {/* 1. Statistics Cards (Always visible on Overview, or top banner) */}
          {activeTab !== 'security' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Total Messages */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Total Formulaires
                  </span>
                  <h3 className="text-2xl font-black font-display text-slate-900 mt-1">
                    {stats?.totalMessages ?? submissions.length}
                  </h3>
                  <span className="text-[11px] text-slate-500 mt-1 block">
                    Toutes catégories confondues
                  </span>
                </div>
                <div className="h-12 w-12 rounded-2xl bg-[#0F2C59]/10 text-[#0F2C59] flex items-center justify-center">
                  <Inbox className="h-6 w-6" />
                </div>
              </div>

              {/* Pending Requests */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
                    Demandes en attente
                  </span>
                  <h3 className="text-2xl font-black font-display text-amber-700 mt-1">
                    {stats?.newRequests ?? pendingCount}
                  </h3>
                  <span className="text-[11px] text-slate-500 mt-1 block">
                    À traiter par le secrétariat
                  </span>
                </div>
                <div className="h-12 w-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <Clock className="h-6 w-6" />
                </div>
              </div>

              {/* Document Requests */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                    Documents d'église
                  </span>
                  <h3 className="text-2xl font-black font-display text-indigo-900 mt-1">
                    {stats?.documentRequests ?? submissions.filter(s => s.category === 'Document Requests').length}
                  </h3>
                  <span className="text-[11px] text-indigo-600 font-medium mt-1 block">
                    {pendingDocsCount} nouveau(x) à certifier
                  </span>
                </div>
                <div className="h-12 w-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <FileText className="h-6 w-6" />
                </div>
              </div>

              {/* Newsletter Subscribers */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                    Abonnés Newsletter
                  </span>
                  <h3 className="text-2xl font-black font-display text-emerald-900 mt-1">
                    {stats?.newsletterSubscribers ?? subscribers.length}
                  </h3>
                  <span className="text-[11px] text-slate-500 mt-1 block">
                    Fidèles & sympathisants
                  </span>
                </div>
                <div className="h-12 w-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Mail className="h-6 w-6" />
                </div>
              </div>
            </div>
          )}

          {/* 2. Submissions Table & Filter Controls (for Forms, Documents, Prayers, or Overview) */}
          {activeTab !== 'newsletter' && activeTab !== 'podcasts' && activeTab !== 'security' && activeTab !== 'publications' && activeTab !== 'events' && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
              
              {/* Filter and Search Bar */}
              <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex flex-col md:flex-row items-center justify-between gap-3">
                {/* Search */}
                <div className="relative w-full md:w-80">
                  <Search className="h-4 w-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Rechercher par nom, email, téléphone ou message..."
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-white border border-slate-300 text-xs focus:ring-2 focus:ring-[#0F2C59] outline-none"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>

                {/* Filters */}
                <div className="flex items-center gap-2 w-full md:w-auto flex-wrap">
                  {/* Category Filter (only on 'forms' or 'overview') */}
                  {(activeTab === 'forms' || activeTab === 'overview') && (
                    <select
                      value={categoryFilter}
                      onChange={(e) => setCategoryFilter(e.target.value)}
                      className="px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs focus:ring-2 focus:ring-[#0F2C59] outline-none font-medium"
                    >
                      <option value="All">Toutes les catégories</option>
                      <option value="Document Requests">Demandes de Documents</option>
                      <option value="Prayer Requests">Demandes de Prière</option>
                      <option value="Contact Messages">Messages de Contact</option>
                      <option value="Event Registration">Inscriptions Événements / EPND</option>
                      <option value="Volunteer Requests">Demandes de Bénévolat</option>
                      <option value="Donation/Giving Messages">Promesses de Don</option>
                      <option value="Newsletter Subscribers">Abonnements Newsletter</option>
                      <option value="General Requests">Demandes Générales</option>
                    </select>
                  )}

                  {/* Status Filter */}
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs focus:ring-2 focus:ring-[#0F2C59] outline-none font-medium"
                  >
                    <option value="All">Tous les statuts</option>
                    <option value="En attente">En attente</option>
                    <option value="En cours">En cours</option>
                    <option value="Approuvée">Approuvée</option>
                    <option value="Refusée">Refusée</option>
                    <option value="Terminée">Terminée</option>
                    <option value="Archived">Archivé</option>
                  </select>

                  <span className="text-xs text-slate-500 px-2 font-mono">
                    {filteredSubmissions.length} résultat(s)
                  </span>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-100/70 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                      <th className="py-3 px-4">Date / Réf</th>
                      <th className="py-3 px-4">Demandeur & Coordonnées</th>
                      <th className="py-3 px-4">Catégorie</th>
                      <th className="py-3 px-4">Message / Objet</th>
                      <th className="py-3 px-4">Statut</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    {filteredSubmissions.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-12 text-center text-slate-400">
                          <Inbox className="h-8 w-8 mx-auto mb-2 opacity-40" />
                          <p>Aucun formulaire ne correspond à vos filtres de recherche.</p>
                        </td>
                      </tr>
                    ) : (
                      filteredSubmissions.map((item) => (
                        <tr 
                          key={item.id}
                          className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                          onClick={() => {
                            setSelectedSubmission(item);
                            setEditingNotes(item.notes || '');
                          }}
                        >
                          <td className="py-3 px-4 whitespace-nowrap">
                            <span className="font-mono text-[11px] font-semibold text-slate-500 block">
                              {new Date(item.dateReceived).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: '2-digit' })}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">
                              {new Date(item.dateReceived).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </td>

                          <td className="py-3 px-4">
                            <div className="font-bold text-slate-900">{item.name}</div>
                            <div className="text-slate-500 text-[11px] flex items-center gap-2 mt-0.5">
                              {item.phone && (
                                <span className="flex items-center gap-1 font-mono text-slate-700">
                                  <Phone className="h-3 w-3 text-slate-400" />
                                  {item.phone}
                                </span>
                              )}
                              {item.email && item.email !== 'non-fourni@paroisse.org' && (
                                <span className="text-slate-500 truncate max-w-[140px]">{item.email}</span>
                              )}
                            </div>
                          </td>

                          <td className="py-3 px-4 whitespace-nowrap">
                            {getCategoryBadge(item.category)}
                          </td>

                          <td className="py-3 px-4 max-w-xs">
                            <p className="truncate text-slate-700 font-medium">
                              {item.message}
                            </p>
                            {item.notes && (
                              <span className="text-[10px] text-[#0F2C59] bg-[#0F2C59]/10 px-2 py-0.5 rounded font-mono mt-1 inline-block">
                                Note : {item.notes}
                              </span>
                            )}
                          </td>

                          <td className="py-3 px-4 whitespace-nowrap">
                            {getStatusBadge(item.status)}
                          </td>

                          <td className="py-3 px-4 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                              {/* Quick Mark Completed */}
                              {item.status !== 'Completed' && (
                                <button
                                  onClick={() => handleUpdateStatus(item.id, 'Completed')}
                                  className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 transition-colors"
                                  title="Marquer comme terminé"
                                >
                                  <CheckCircle2 className="h-4 w-4" />
                                </button>
                              )}

                              {/* Quick Archive */}
                              {item.status !== 'Archived' && (
                                <button
                                  onClick={() => handleUpdateStatus(item.id, 'Archived')}
                                  className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors"
                                  title="Archiver"
                                >
                                  <Archive className="h-4 w-4" />
                                </button>
                              )}

                              {/* View detail */}
                              <button
                                onClick={() => {
                                  setSelectedSubmission(item);
                                  setEditingNotes(item.notes || '');
                                }}
                                className="p-1.5 rounded-lg text-[#0F2C59] hover:bg-[#0F2C59]/10 transition-colors"
                                title="Voir les détails"
                              >
                                <Eye className="h-4 w-4" />
                              </button>

                              {/* Delete */}
                              <button
                                onClick={() => handleDeleteSubmission(item.id)}
                                className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 transition-colors"
                                title="Supprimer définitivement"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

            </div>
          )}

          {/* 3. Newsletter Section */}
          {activeTab === 'newsletter' && (
            <div className="space-y-6">
              
              {/* Header Action Bar */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-bold font-display text-slate-900">
                    Diffusion & Abonnés Paroissiaux
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Gérez la liste des membres abonnés à la lettre pastorale et préparez les futures campagnes d'annonces.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={handleExportCsv}
                    className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>Exporter la liste (CSV)</span>
                  </button>

                  <button
                    onClick={() => setIsCreatingCampaign(!isCreatingCampaign)}
                    className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#0F2C59] hover:bg-[#1A365D] text-white text-xs font-semibold transition-colors"
                  >
                    <PlusCircle className="h-3.5 w-3.5" />
                    <span>Rédiger un communiqué</span>
                  </button>
                </div>
              </div>

              {/* Campaign Composer Form Modal */}
              {isCreatingCampaign && (
                <div className="bg-white rounded-2xl border border-[#D4AF37]/40 p-6 shadow-md space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-[#D4AF37]" />
                      <h4 className="text-sm font-bold text-slate-900">
                        Nouveau Message de Diffusion Paroissiale
                      </h4>
                    </div>
                    <button
                      onClick={() => setIsCreatingCampaign(false)}
                      className="text-slate-400 hover:text-slate-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  <form onSubmit={handleCreateCampaign} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Titre interne de la campagne *
                        </label>
                        <input
                          type="text"
                          required
                          value={campaignForm.title}
                          onChange={(e) => setCampaignForm({ ...campaignForm, title: e.target.value })}
                          placeholder="Ex : Annonce Culte Spécial Action de Grâce"
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#0F2C59] outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Objet de l'Email *
                        </label>
                        <input
                          type="text"
                          required
                          value={campaignForm.subject}
                          onChange={(e) => setCampaignForm({ ...campaignForm, subject: e.target.value })}
                          placeholder="Ex : Nouvelles de l'Église du Nazaréen de Damé"
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#0F2C59] outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Audience cible
                      </label>
                      <select
                        value={campaignForm.targetAudience}
                        onChange={(e) => setCampaignForm({ ...campaignForm, targetAudience: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#0F2C59] outline-none bg-white"
                      >
                        <option value="Tous les membres et abonnés">Tous les abonnés inscrits</option>
                        <option value="Jeunesse JNI">Jeunesse Nazaréenne Internationale (JNI)</option>
                        <option value="Étudiants EPND">Étudiants de l'École Professionnelle (EPND)</option>
                        <option value="Responsables et Responsables de départements">Corps pastoral & Conseil</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Contenu du message pastoral *
                      </label>
                      <textarea
                        rows={5}
                        required
                        value={campaignForm.content}
                        onChange={(e) => setCampaignForm({ ...campaignForm, content: e.target.value })}
                        placeholder="Rédigez ici le texte du communiqué paroissial..."
                        className="w-full p-3 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#0F2C59] outline-none"
                      />
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setIsCreatingCampaign(false)}
                        className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                      >
                        Annuler
                      </button>

                      <button
                        type="submit"
                        className="px-5 py-2 rounded-xl bg-[#0F2C59] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#1A365D] flex items-center gap-2"
                      >
                        <Send className="h-3.5 w-3.5" />
                        <span>Enregistrer le projet</span>
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Subscribers List Card */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
                <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                      Liste des Abonnés Enregistrés ({subscribers.length})
                    </span>
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold">
                      {subscribers.filter(s => s.status === 'Active').length} actif(s)
                    </span>
                  </div>

                  {/* Subscriber Search */}
                  <div className="relative w-full sm:w-64">
                    <Search className="h-3.5 w-3.5 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={subscriberSearch}
                      onChange={(e) => setSubscriberSearch(e.target.value)}
                      placeholder="Filtrer par nom ou email..."
                      className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#0F2C59] outline-none"
                    />
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-100/70 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                        <th className="py-3 px-4">Nom</th>
                        <th className="py-3 px-4">Email</th>
                        <th className="py-3 px-4">Date d'inscription</th>
                        <th className="py-3 px-4">Statut</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs">
                      {subscribers
                        .filter(s => {
                          if (!subscriberSearch.trim()) return true;
                          const q = subscriberSearch.toLowerCase();
                          return s.name.toLowerCase().includes(q) || s.email.toLowerCase().includes(q);
                        })
                        .map((s) => (
                        <tr key={s.id} className="hover:bg-slate-50">
                          <td className="py-3 px-4 font-bold text-slate-900">{s.name || 'Anonyme'}</td>
                          <td className="py-3 px-4 font-mono text-slate-600">{s.email}</td>
                          <td className="py-3 px-4 text-slate-500">
                            {new Date(s.subscribedAt).toLocaleDateString('fr-FR')}
                          </td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              s.status === 'Active' 
                                ? 'bg-emerald-100 text-emerald-800' 
                                : 'bg-slate-200 text-slate-700'
                            }`}>
                              {s.status === 'Active' ? 'Actif' : 'Désabonné'}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleToggleSubscriberStatus(s)}
                                className="px-2 py-1 rounded text-[11px] font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                                title={s.status === 'Active' ? 'Désactiver' : 'Réactiver'}
                              >
                                {s.status === 'Active' ? 'Désactiver' : 'Réactiver'}
                              </button>
                              <button
                                onClick={() => handleDeleteSubscriber(s.id)}
                                className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors"
                                title="Supprimer cet abonné"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Past Campaigns */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Historique des Campagnes & Communiqués ({campaigns.length})
                </h4>

                <div className="space-y-3">
                  {campaigns.map((camp) => (
                    <div key={camp.id} className="p-4 rounded-xl border border-slate-200 hover:border-slate-300 space-y-2">
                      <div className="flex items-center justify-between">
                        <h5 className="text-sm font-bold text-slate-900">{camp.title}</h5>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-100 text-slate-700">
                          {camp.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 line-clamp-2">{camp.content}</p>
                      <div className="flex items-center gap-4 text-[11px] text-slate-400 pt-1">
                        <span>Objet : <strong>{camp.subject}</strong></span>
                        <span>Audience : {camp.targetAudience}</span>
                        <span>Date : {new Date(camp.createdAt).toLocaleDateString('fr-FR')}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* 7. PODCASTS TAB */}
          {activeTab === 'podcasts' && (
            <div className="space-y-6">
              
              {/* Success Notification */}
              {podcastSuccessMsg && (
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center justify-between animate-fade-in shadow-xs">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                    <div>
                      <p className="text-xs font-bold">{podcastSuccessMsg}</p>
                      <p className="text-[11px] text-emerald-700">Le podcast est disponible pour tous les visiteurs sur la page /podcast.</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setPodcastSuccessMsg(null)}
                    className="text-emerald-700 hover:text-emerald-900 p-1 text-xs"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}

              {/* Podcasts Header Toolbar */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <Radio className="h-5 w-5 text-[#D4AF37]" />
                    <h3 className="text-base font-bold font-display text-slate-900">
                      Gestion des Podcasts & Prédications ({podcasts.length})
                    </h3>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Diffusez la Parole de Dieu, les exhortations et les enseignements bibliques sur le site officiel.
                  </p>
                </div>

                <div className="flex items-center gap-2.5">
                  <button
                    onClick={() => setIsAddingPodcast(!isAddingPodcast)}
                    className="px-4 py-2.5 rounded-xl bg-[#0F2C59] hover:bg-[#1A365D] text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-colors cursor-pointer shadow-xs"
                  >
                    {isAddingPodcast ? (
                      <>
                        <X className="h-4 w-4" />
                        <span>Fermer le formulaire</span>
                      </>
                    ) : (
                      <>
                        <PlusCircle className="h-4 w-4 text-[#D4AF37]" />
                        <span>Ajouter un nouveau message audio</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Add New Podcast Form */}
              {isAddingPodcast && (
                <div className="bg-white p-6 rounded-2xl border-2 border-[#D4AF37]/50 shadow-md space-y-5 animate-fade-in">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#D4AF37] block">
                        Nouveau Message Audio
                      </span>
                      <h4 className="text-sm font-bold text-slate-900">
                        Formulaire de Publication d'une Prédication ou Enseignement
                      </h4>
                    </div>
                    <span className="text-[11px] text-slate-400">
                      Formats acceptés : MP3, WAV
                    </span>
                  </div>

                  <form onSubmit={handleCreatePodcast} className="space-y-4 text-xs">
                    
                    {/* Row 1: Title & Preacher */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">
                          Titre du message *
                        </label>
                        <input
                          type="text"
                          required
                          value={podcastForm.title}
                          onChange={(e) => setPodcastForm({ ...podcastForm, title: e.target.value })}
                          placeholder="Ex : La Sanctification et la Sainteté du Croyant"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#0F2C59] outline-none"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">
                          Prédicateur / Intervenant *
                        </label>
                        <input
                          type="text"
                          required
                          value={podcastForm.preacher}
                          onChange={(e) => setPodcastForm({ ...podcastForm, preacher: e.target.value })}
                          placeholder="Ex : Pasteur Bequel CHERELUS"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#0F2C59] outline-none"
                        />
                      </div>
                    </div>

                    {/* Row 2: Date, Category & Cover */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">
                          Date du message
                        </label>
                        <input
                          type="text"
                          value={podcastForm.date}
                          onChange={(e) => setPodcastForm({ ...podcastForm, date: e.target.value })}
                          placeholder="Ex : Dimanche 1 Mars 2026"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#0F2C59] outline-none"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">
                          Catégorie *
                        </label>
                        <select
                          value={podcastForm.category}
                          onChange={(e) => setPodcastForm({ ...podcastForm, category: e.target.value as PodcastCategory })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#0F2C59] outline-none bg-white font-medium"
                        >
                          <option value="Prédication">Prédication (Culte Dominical)</option>
                          <option value="Étude biblique">Étude biblique (Mercredi)</option>
                          <option value="Enseignement">Enseignement doctrinal</option>
                          <option value="Témoignage">Témoignage & Action de grâce</option>
                        </select>
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">
                          Image de couverture (Officielle)
                        </label>
                        <select
                          value={podcastForm.coverImage}
                          onChange={(e) => setPodcastForm({ ...podcastForm, coverImage: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#0F2C59] outline-none bg-white font-medium"
                        >
                          <option value="/images/pasteur_bequel.jpg">Pasteur Bequel CHERELUS</option>
                          <option value="/images/dame_facade.jpg">Façade Église de Damé</option>
                          <option value="/images/photo1.jpg">Assemblée des Fidèles</option>
                          <option value="/images/photo2.jpg">Ministère & École Nazareth</option>
                        </select>
                      </div>
                    </div>

                    {/* Description */}
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Description & Résumé du message *
                      </label>
                      <textarea
                        rows={3}
                        required
                        value={podcastForm.description}
                        onChange={(e) => setPodcastForm({ ...podcastForm, description: e.target.value })}
                        placeholder="Précisez le passage biblique, les points principaux du message et l'application pour les fidèles..."
                        className="w-full p-3.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#0F2C59] outline-none leading-relaxed"
                      />
                    </div>

                    {/* Audio File Upload Box */}
                    <div className="p-4 rounded-xl bg-slate-50 border-2 border-dashed border-slate-300">
                      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37] shrink-0">
                            <Music className="h-6 w-6" />
                          </div>
                          <div>
                            <span className="font-bold text-slate-900 block text-xs">
                              Fichier Audio (MP3 ou WAV) *
                            </span>
                            <span className="text-[11px] text-slate-500">
                              {podcastForm.fileName 
                                ? `Sélectionné : ${podcastForm.fileName} (${podcastForm.duration})` 
                                : 'Sélectionnez un fichier audio sur votre appareil (MP3 / WAV)'}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <label className="px-4 py-2 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold cursor-pointer flex items-center gap-1.5 shadow-2xs">
                            <Upload className="h-3.5 w-3.5 text-slate-500" />
                            <span>{podcastForm.fileName ? 'Changer de fichier' : 'Parcourir les fichiers'}</span>
                            <input
                              type="file"
                              accept=".mp3,.wav,audio/mpeg,audio/wav,audio/mp3"
                              onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                  handleAudioFileSelect(e.target.files[0]);
                                }
                              }}
                              className="hidden"
                            />
                          </label>

                          {/* Quick test sample button if secretary wants instant audio preset */}
                          {!podcastForm.audioUrl && (
                            <button
                              type="button"
                              onClick={() => {
                                // Use seed synthesized church audio
                                const sample = 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=';
                                setPodcastForm(prev => ({
                                  ...prev,
                                  audioUrl: sample,
                                  fileName: 'audio_cantique_paroissial.wav',
                                  duration: '22:30'
                                }));
                              }}
                              className="px-3 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 text-[11px] font-medium"
                              title="Utiliser un extrait audio de test"
                            >
                              Générer extrait de test
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Mini Preview Player if audio is loaded */}
                      {podcastForm.audioUrl && (
                        <div className="mt-3 pt-3 border-t border-slate-200 flex items-center gap-3">
                          <span className="text-[11px] text-slate-500 font-semibold">Aperçu :</span>
                          <audio controls src={podcastForm.audioUrl} className="h-8 max-w-sm w-full" />
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setIsAddingPodcast(false)}
                        className="px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
                      >
                        Annuler
                      </button>

                      <button
                        type="submit"
                        disabled={isPublishingPodcast}
                        className="px-6 py-2.5 rounded-xl bg-[#0F2C59] hover:bg-[#1A365D] text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-colors disabled:opacity-50 cursor-pointer shadow-sm"
                      >
                        {isPublishingPodcast ? (
                          <>
                            <RefreshCw className="h-4 w-4 animate-spin" />
                            <span>Publication en cours...</span>
                          </>
                        ) : (
                          <>
                            <Radio className="h-4 w-4 text-[#D4AF37]" />
                            <span>Publier le message audio</span>
                          </>
                        )}
                      </button>
                    </div>

                  </form>
                </div>
              )}

              {/* Podcasts List */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
                <div className="p-4 border-b border-slate-200 bg-slate-50/60 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Messages Audio Publiés ({podcasts.length})
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Visibles immédiatement sur /podcast
                  </span>
                </div>

                {podcasts.length === 0 ? (
                  <div className="p-12 text-center">
                    <Radio className="h-10 w-10 text-slate-300 mx-auto mb-2" />
                    <p className="text-xs text-slate-500 font-medium">Aucun message audio enregistré pour le moment.</p>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {podcasts.map((pod) => {
                      const isThisPlaying = playingAudioId === pod.id;
                      return (
                        <div key={pod.id} className="p-5 hover:bg-slate-50/80 transition-colors flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                          
                          <div className="flex items-start gap-4 min-w-0">
                            {/* Thumbnail */}
                            <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-slate-200 bg-slate-900 relative">
                              <img 
                                src={pod.coverImage || '/images/pasteur_bequel.jpg'} 
                                alt={pod.title}
                                className="w-full h-full object-cover"
                              />
                            </div>

                            {/* Details */}
                            <div className="min-w-0">
                              <div className="flex flex-wrap items-center gap-2 mb-1">
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-100 text-slate-800 border border-slate-200">
                                  {pod.category}
                                </span>
                                <span className="text-[11px] text-slate-400">•</span>
                                <span className="text-[11px] text-slate-500 flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  {pod.date}
                                </span>
                                <span className="text-[11px] text-slate-400">•</span>
                                <span className="text-[11px] text-slate-500 flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {pod.duration || '25:00'}
                                </span>
                              </div>

                              <h4 className="text-sm font-bold text-slate-900 truncate">
                                {pod.title}
                              </h4>
                              <p className="text-xs text-slate-600 mt-0.5">
                                Prédicateur : <span className="font-semibold text-slate-800">{pod.preacher}</span>
                              </p>
                              <p className="text-xs text-slate-500 line-clamp-1 mt-1 font-sans">
                                {pod.description}
                              </p>
                            </div>
                          </div>

                          {/* Controls & Actions */}
                          <div className="flex items-center gap-2.5 self-end md:self-center shrink-0">
                            {/* Mini Player */}
                            <button
                              onClick={() => handleTogglePlayPodcast(pod)}
                              className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                                isThisPlaying
                                  ? 'bg-[#0F2C59] text-white shadow-xs'
                                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                              }`}
                              title={isThisPlaying ? 'Pause' : 'Écouter'}
                            >
                              {isThisPlaying ? (
                                <>
                                  <Pause className="h-3.5 w-3.5 fill-current" />
                                  <span>Pause</span>
                                </>
                              ) : (
                                <>
                                  <Play className="h-3.5 w-3.5 fill-current" />
                                  <span>Écouter</span>
                                </>
                              )}
                            </button>

                            {/* Delete */}
                            <button
                              onClick={() => handleDeletePodcast(pod.id)}
                              className="p-2 rounded-xl border border-slate-200 text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                              title="Supprimer ce message audio"
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

            </div>
          )}

          {/* 5. Paramètres de Sécurité (Security Settings) */}
          {activeTab === 'security' && (
            <div id="admin-security-settings" className="space-y-6 max-w-4xl">
              {/* Alert notifications */}
              {securitySuccess && (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center justify-between shadow-xs">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                    <p className="text-xs font-semibold">{securitySuccess}</p>
                  </div>
                  <button
                    onClick={() => setSecuritySuccess(null)}
                    className="text-emerald-700 hover:text-emerald-900 p-1 text-xs cursor-pointer"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}

              {securityError && (
                <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 flex items-center justify-between shadow-xs">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="h-5 w-5 text-rose-600 shrink-0" />
                    <p className="text-xs font-semibold">{securityError}</p>
                  </div>
                  <button
                    onClick={() => setSecurityError(null)}
                    className="text-rose-700 hover:text-rose-900 p-1 text-xs cursor-pointer"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}

              {/* Header Card */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 rounded-2xl bg-[#0F2C59]/10 text-[#0F2C59] flex items-center justify-center shrink-0">
                    <ShieldCheck className="h-8 w-8 text-[#0F2C59]" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#D4AF37] block">
                      Sécurité & Authentification
                    </span>
                    <h3 className="text-xl font-bold font-display text-slate-900">
                      Paramètres de Sécurité du Secrétariat
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Gestion du code d'accès confidentiel et procédures de récupération d'urgence.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    Session sécurisée active
                  </span>
                </div>
              </div>

              {/* Main Settings Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Form column (2 cols) */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
                  <div className="p-5 border-b border-slate-200 bg-slate-50/60 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Key className="h-4 w-4 text-[#D4AF37]" />
                      <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                        Modifier le code d'accès administrateur
                      </h4>
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono">
                      Sauvegarde locale & serveur
                    </span>
                  </div>

                  <form onSubmit={handleUpdatePasscode} className="p-6 space-y-4">
                    {/* Old passcode */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Ancien code d'accès actuel <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <Lock className="h-4 w-4 text-slate-400 absolute left-3 top-3" />
                        <input
                          type={showOldPass ? "text" : "password"}
                          required
                          value={oldPasscode}
                          onChange={(e) => setOldPasscode(e.target.value)}
                          placeholder="Saisissez votre code actuel (ex: 123456)"
                          className="w-full pl-9 pr-10 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-[#0F2C59] outline-none font-mono"
                        />
                        <button
                          type="button"
                          onClick={() => setShowOldPass(!showOldPass)}
                          className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                          title={showOldPass ? "Masquer" : "Afficher"}
                        >
                          {showOldPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    {/* New passcode */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Nouveau code d'accès secret <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <Key className="h-4 w-4 text-slate-400 absolute left-3 top-3" />
                        <input
                          type={showNewPass ? "text" : "password"}
                          required
                          value={newPasscode}
                          onChange={(e) => setNewPasscode(e.target.value)}
                          placeholder="Minimum 4 caractères"
                          className="w-full pl-9 pr-10 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-[#0F2C59] outline-none font-mono"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPass(!showNewPass)}
                          className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                          title={showNewPass ? "Masquer" : "Afficher"}
                        >
                          {showNewPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    {/* Confirm new passcode */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Confirmer le nouveau code d'accès <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <Key className="h-4 w-4 text-slate-400 absolute left-3 top-3" />
                        <input
                          type={showConfirmPass ? "text" : "password"}
                          required
                          value={confirmPasscode}
                          onChange={(e) => setConfirmPasscode(e.target.value)}
                          placeholder="Répétez exactement le nouveau code"
                          className="w-full pl-9 pr-10 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-[#0F2C59] outline-none font-mono"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPass(!showConfirmPass)}
                          className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                          title={showConfirmPass ? "Masquer" : "Afficher"}
                        >
                          {showConfirmPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={securityLoading}
                        className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#0F2C59] hover:bg-[#1A365D] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-sm disabled:opacity-50"
                      >
                        {securityLoading ? (
                          <>
                            <RefreshCw className="h-4 w-4 animate-spin" />
                            <span>Enregistrement en cours...</span>
                          </>
                        ) : (
                          <>
                            <ShieldCheck className="h-4 w-4 text-[#D4AF37]" />
                            <span>Enregistrer le nouveau code d'accès</span>
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>

                {/* Info & Recovery column (1 col) */}
                <div className="space-y-6">
                  {/* Current status card */}
                  <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
                    <div className="flex items-center gap-2 text-slate-800 font-bold text-xs uppercase tracking-wider">
                      <Lock className="h-4 w-4 text-[#D4AF37]" />
                      <span>État du code d'accès</span>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                      <span className="text-[11px] text-slate-500 block">Code actuellement actif :</span>
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-sm font-bold text-slate-900 tracking-wider">
                          {showCurrentCode ? activePasscode : '••••••••'}
                        </span>
                        <button
                          type="button"
                          onClick={() => setShowCurrentCode(!showCurrentCode)}
                          className="text-xs text-slate-500 hover:text-slate-800 cursor-pointer flex items-center gap-1 font-medium"
                        >
                          {showCurrentCode ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                          <span>{showCurrentCode ? 'Masquer' : 'Révéler'}</span>
                        </button>
                      </div>
                    </div>

                    <div className="text-[11px] text-slate-600 leading-relaxed space-y-1">
                      <p>• Code initial par défaut : <strong className="font-mono text-slate-900">{DEFAULT_ADMIN_PASSCODE}</strong></p>
                      <p>• Enregistré en mémoire permanente (<span className="font-mono text-slate-800">localStorage</span>) pour vos futures connexions.</p>
                    </div>
                  </div>

                  {/* Emergency Recovery info card */}
                  <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-5 shadow-xs space-y-3">
                    <div className="flex items-center gap-2 text-amber-900 font-bold text-xs uppercase tracking-wider">
                      <RotateCcw className="h-4 w-4 text-amber-700" />
                      <span>Récupération d'urgence</span>
                    </div>

                    <p className="text-[11px] text-amber-900/90 leading-relaxed">
                      En cas d'oubli ou de perte de code, l'accès peut être réinitialisé à <strong className="font-mono font-bold">{DEFAULT_ADMIN_PASSCODE}</strong> via le lien « Mot de passe oublié ? » sur la page de connexion, à l'aide de l'e-mail officiel :
                    </p>

                    <div className="p-2.5 rounded-lg bg-white border border-amber-200 text-xs font-mono font-bold text-slate-800 break-all select-all">
                      {ADMIN_RECOVERY_EMAIL}
                    </div>

                    <button
                      type="button"
                      onClick={handleResetToDefaultCode}
                      disabled={securityLoading}
                      className="w-full py-2 px-3 rounded-xl border border-amber-300 hover:bg-amber-100 text-amber-900 text-xs font-semibold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                      <span>Rétablir le code par défaut ({DEFAULT_ADMIN_PASSCODE})</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 8. EVENTS MANAGER TAB */}
          {activeTab === 'events' && (
            <EventsManager 
              eventSubmissions={submissions.filter(s => s.category === 'Event Registration')}
              onEventsChanged={loadData}
            />
          )}

          {/* 9. PUBLICATIONS MANAGER TAB */}
          {activeTab === 'publications' && (
            <PublicationsManager 
              onPublicationsChanged={loadData}
            />
          )}

        </div>
      </main>

      {/* Submission Detail Inspection Modal */}
      {selectedSubmission && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="p-5 bg-[#0F2C59] text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#D4AF37] block">
                  Détail du Dossier • {selectedSubmission.category}
                </span>
                <h3 className="text-lg font-bold font-display mt-0.5">
                  {selectedSubmission.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedSubmission(null)}
                className="p-1 rounded-lg text-slate-300 hover:text-white hover:bg-white/10"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5 overflow-y-auto flex-1 text-xs">
              
              {/* Metadata Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Référence :</span>
                  <span className="font-mono font-bold text-slate-800">{selectedSubmission.id}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Date de réception :</span>
                  <span className="text-slate-700">
                    {new Date(selectedSubmission.dateReceived).toLocaleString('fr-FR')}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Statut actuel :</span>
                  <div className="mt-0.5">{getStatusBadge(selectedSubmission.status)}</div>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Téléphone :</span>
                  <span className="font-mono text-slate-700">{selectedSubmission.phone || 'Non renseigné'}</span>
                </div>
                <div className="sm:col-span-2">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Email :</span>
                  <span className="text-slate-700">{selectedSubmission.email}</span>
                </div>
              </div>

              {/* Status Change Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Modifier le statut de traitement :
                </label>
                <div className="flex flex-wrap gap-2">
                  {(['New', 'In progress', 'Completed', 'Archived'] as SubmissionStatus[]).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => handleUpdateStatus(selectedSubmission.id, st)}
                      className={`px-3 py-1.5 rounded-lg font-semibold text-xs transition-all ${
                        selectedSubmission.status === st
                          ? 'bg-[#0F2C59] text-white shadow-xs'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                    >
                      {st === 'New' && 'Nouveau'}
                      {st === 'In progress' && 'En traitement'}
                      {st === 'Completed' && 'Terminé / Prêt'}
                      {st === 'Archived' && 'Archivé'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Message / Core Content */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Contenu du message ou de la demande :
                </label>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 leading-relaxed whitespace-pre-wrap">
                  {selectedSubmission.message}
                </div>
              </div>

              {/* Extra Details if any (e.g. Document Type, Program, Delivery Method) */}
              {selectedSubmission.details && Object.keys(selectedSubmission.details).length > 0 && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Informations complémentaires :
                  </label>
                  <div className="p-3 bg-amber-50/50 rounded-xl border border-amber-200/80 space-y-1 font-mono text-[11px]">
                    {Object.entries(selectedSubmission.details).map(([key, val]) => (
                      <div key={key} className="flex justify-between">
                        <span className="text-slate-500">{key} :</span>
                        <span className="text-slate-900 font-semibold">{String(val)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Internal Notes */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Notes internes du secrétariat :
                </label>
                <div className="space-y-2">
                  <textarea
                    rows={3}
                    value={editingNotes}
                    onChange={(e) => setEditingNotes(e.target.value)}
                    placeholder="Ajoutez une note interne (ex : Certificat signé par le Pasteur, transmis par WhatsApp le 24/02)..."
                    className="w-full p-3 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#0F2C59] outline-none"
                  />
                  <button
                    onClick={handleSaveNotes}
                    disabled={isSavingNotes}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-white text-xs font-bold hover:bg-slate-900 transition-colors disabled:opacity-50"
                  >
                    {isSavingNotes ? 'Enregistrement...' : 'Enregistrer la note'}
                  </button>
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <button
                onClick={() => handleDeleteSubmission(selectedSubmission.id)}
                className="text-xs font-semibold text-rose-600 hover:text-rose-800 flex items-center gap-1"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Supprimer ce dossier</span>
              </button>

              <button
                onClick={() => setSelectedSubmission(null)}
                className="px-5 py-2 rounded-xl bg-slate-200 text-slate-800 text-xs font-bold hover:bg-slate-300 transition-colors"
              >
                Fermer
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
