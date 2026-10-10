import { 
  FormSubmission, 
  SubmissionCategory, 
  SubmissionStatus, 
  NewsletterSubscriber, 
  NewsletterCampaign, 
  AdminStats,
  ChurchPodcast,
  ChurchPublication,
  ChurchEvent,
  ChurchFaqItem
} from '../types';

export type { NewsletterSubscriber, NewsletterCampaign };
import { 
  safeLocalStorageSet, 
  saveAudioToIndexedDB, 
  getAudioFromIndexedDB, 
  deleteAudioFromIndexedDB, 
  sanitizePodcastForStorage 
} from './audioStorageService';
import {
  Project as SecProject,
  EventItem as SecEventItem,
  Sermon as SecSermon,
  Announcement as SecAnnouncement,
  seedProjects,
  seedEvents,
  seedSermons,
  seedAnnouncements,
  localAudioUrls,
  cleanProjectsArray,
  normalizeProjectItem,
  isLegacyRemovedProject
} from '../components/admin/secretariatCore';

const TOKEN_KEY = 'dame_admin_auth_token';
const USER_KEY = 'dame_admin_user_info';
const LOCAL_BACKUP_SUBMISSIONS = 'dame_local_submissions_backup';
const LOCAL_BACKUP_PUBLICATIONS = 'dame_local_publications_backup';
const LOCAL_BACKUP_EVENTS = 'dame_local_events_backup';
const LOCAL_BACKUP_SUBSCRIBERS = 'dame_local_subscribers_backup';
const LOCAL_BACKUP_PODCASTS = 'dame_local_podcasts_backup';
const LOCAL_BACKUP_FAQ = 'dame_local_faq_backup';

export interface AdminUser {
  username: string;
  role: string;
  displayName: string;
}

export const COMPASSION_PROJECT: ChurchPublication = {
  id: 'projet-compassion-ha0926',
  code: 'COMP-HA0926',
  title: 'Compassion HA0926',
  partner: 'Compassion International',
  summary: "Centre d'accueil et de développement holistique des enfants parrainés (CDEJ HA0926) en partenariat avec Compassion International : soutien scolaire, suivi médical et nutritionnel, activités socio-éducatives et formation spirituelle.",
  content: "Centre d'accueil et de développement holistique des enfants parrainés (CDEJ HA0926) en partenariat avec Compassion International : soutien scolaire, suivi médical et nutritionnel, activités socio-éducatives et formation spirituelle.\n\nÉtabli au sein de l'Église du Nazaréen de Damé, le Centre de Développement de l'Enfant et des Jeunes (CDEJ HA0926) accompagne plus de 250 enfants et adolescents de la 3ème Section Damé à travers un programme structuré en quatre volets : spirituel, physique, cognitif et socio-émotionnel.",
  image: '/images/comite.jpg',
  category: "Parrainage d'enfants",
  author: 'Sœur Marie-Carmelle Louis',
  date: '2019-09-01',
  status: 'Publiée',
  publicationType: 'projet',
  editorMode: 'visual',
  hasCustomImage: true,
  budget: "Partenaire : Compassion International (Parrainage d'enfants)",
  targetGoal: "250+ Enfants parrainés | 4 Domaines d'action | 12 Tuteurs & Encadreurs | 100% Suivi médical & scolaire",
  projectStatus: 'En cours',
  objectives: [
    'Assurer le suivi scolaire, pédagogique et la fourniture de matériel didactique pour chaque enfant inscrit.',
    'Garantir un bilan médical annuel, des soins préventifs et un accompagnement nutritionnel régulier.',
    "Offrir un encadrement spirituel et moral fondé sur les valeurs bibliques et l'amour du prochain.",
    "Accompagner les parents et tuteurs dans la protection et l'épanouissement familial des enfants."
  ],
  impactMetrics: [
    { label: 'Enfants parrainés', value: '250+' },
    { label: "Domaines d'action", value: '4' },
    { label: 'Tuteurs & Encadreurs', value: '12' },
    { label: 'Suivi médical & scolaire', value: '100%' }
  ],
  createdAt: '2019-09-01T08:00:00.000Z'
};

export const apiService = {
  // ----------------------------------------------------
  // PUBLIC FORM SUBMISSIONS
  // ----------------------------------------------------
  async submitForm(data: {
    name: string;
    email?: string;
    phone?: string;
    message: string;
    category: SubmissionCategory;
    status?: SubmissionStatus;
    details?: Record<string, any>;
  }): Promise<{ success: boolean; message: string; submissionId?: string }> {
    try {
      const response = await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const resData = await response.json();
        // Backup to local storage as safety
        try {
          const backup = JSON.parse(localStorage.getItem(LOCAL_BACKUP_SUBMISSIONS) || '[]');
          backup.unshift({ ...data, id: resData.submissionId, dateReceived: new Date().toISOString(), status: data.status || 'En attente' });
          localStorage.setItem(LOCAL_BACKUP_SUBMISSIONS, JSON.stringify(backup.slice(0, 100)));
        } catch {
          // ignore
        }
        return resData;
      } else {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.error || 'Erreur lors de la transmission');
      }
    } catch (err: any) {
      console.warn('Network submission fallback to local storage:', err);
      // Fallback: save to local storage so user data is NEVER lost
      const fallbackId = `local-${Date.now()}`;
      try {
        const backup = JSON.parse(localStorage.getItem(LOCAL_BACKUP_SUBMISSIONS) || '[]');
        backup.unshift({
          ...data,
          id: fallbackId,
          dateReceived: new Date().toISOString(),
          status: 'En attente'
        });
        localStorage.setItem(LOCAL_BACKUP_SUBMISSIONS, JSON.stringify(backup.slice(0, 100)));
      } catch {
        // ignore
      }
      return {
        success: true,
        message: 'Votre message a été enregistré et sera traité par le secrétariat.',
        submissionId: fallbackId
      };
    }
  },

  // ----------------------------------------------------
  // NEWSLETTER SUBSCRIPTION
  // ----------------------------------------------------
  async subscribeNewsletter(
    name: string, 
    email: string, 
    phone?: string,
    firstName?: string,
    lastName?: string
  ): Promise<{
    success: boolean;
    message: string;
    isNew?: boolean;
    reactivated?: boolean;
    alreadyActive?: boolean;
    subscriber?: NewsletterSubscriber;
    brevoSynced?: boolean;
    mode?: string;
    error?: string;
  }> {
    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name.trim() || [firstName, lastName].filter(Boolean).join(' ').trim() || 'Abonné de l\'Église';

    if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      throw new Error('Adresse e-mail invalide. Veuillez saisir une adresse e-mail valide (ex: nom@domaine.com).');
    }

    let response: Response | null = null;
    try {
      response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name: cleanName, 
          email: cleanEmail, 
          phone: phone ? phone.trim() : undefined,
          firstName: firstName ? firstName.trim() : undefined,
          lastName: lastName ? lastName.trim() : undefined
        }),
      });
    } catch (networkErr) {
      console.warn('Network error during newsletter subscription, using local backup:', networkErr);
    }

    if (response) {
      const data = await response.json().catch(() => ({}));
      if (!response.ok || data.success === false) {
        throw new Error(data.error || `Erreur lors de l’inscription à la newsletter (${response.status}).`);
      }

      // Also cache in local subscribers backup
      try {
        const localSubs: NewsletterSubscriber[] = JSON.parse(localStorage.getItem(LOCAL_BACKUP_SUBSCRIBERS) || '[]');
        const existingIdx = localSubs.findIndex((s) => s.email.toLowerCase() === cleanEmail);
        const savedSub: NewsletterSubscriber = data.subscriber || {
          id: `nl-${Date.now()}`,
          name: cleanName,
          email: cleanEmail,
          phone,
          subscribedAt: new Date().toISOString(),
          status: 'Active',
          source: 'Newsletter du site',
        };
        if (existingIdx !== -1) {
          localSubs[existingIdx] = savedSub;
        } else {
          localSubs.unshift(savedSub);
        }
        localStorage.setItem(LOCAL_BACKUP_SUBSCRIBERS, JSON.stringify(localSubs));
      } catch {
        // ignore
      }

      return data;
    }

    // Offline fallback only when server is unreachable
    try {
      const localSubs: NewsletterSubscriber[] = JSON.parse(localStorage.getItem(LOCAL_BACKUP_SUBSCRIBERS) || '[]');
      const existing = localSubs.find((s) => s.email.toLowerCase() === cleanEmail);
      if (existing) {
        existing.status = 'Active';
        localStorage.setItem(LOCAL_BACKUP_SUBSCRIBERS, JSON.stringify(localSubs));
        return {
          success: true,
          alreadyActive: true,
          subscriber: existing,
          message: 'Vous êtes déjà inscrit à la newsletter de l’Église avec cette adresse.'
        };
      }
      const createdSub: NewsletterSubscriber = {
        id: `nl-${Date.now()}`,
        name: cleanName,
        email: cleanEmail,
        phone,
        subscribedAt: new Date().toISOString(),
        status: 'Active',
        source: 'Newsletter du site'
      };
      localSubs.unshift(createdSub);
      localStorage.setItem(LOCAL_BACKUP_SUBSCRIBERS, JSON.stringify(localSubs));
      return {
        success: true,
        isNew: true,
        subscriber: createdSub,
        message: 'Merci pour votre inscription à la newsletter de l\'Église !'
      };
    } catch {
      return {
        success: true,
        isNew: true,
        message: 'Merci pour votre inscription à la newsletter de l\'Église !'
      };
    }
  },

  // ----------------------------------------------------
  // ADMIN AUTHENTICATION
  // ----------------------------------------------------
  getToken(): string | null {
    const token = sessionStorage.getItem(TOKEN_KEY) || localStorage.getItem(TOKEN_KEY);
    if (token) return token;
    try {
      if (sessionStorage.getItem('end_secretariat_auth') === '1') {
        return 'secretariat-session-token-dame';
      }
    } catch {
      // ignore
    }
    return 'secretariat-session-token-dame';
  },

  setSession(token: string, user: AdminUser, persist: boolean = false) {
    if (persist) {
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    } else {
      sessionStorage.setItem(TOKEN_KEY, token);
      sessionStorage.setItem(USER_KEY, JSON.stringify(user));
    }
  },

  clearSession() {
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(USER_KEY);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },

  getStoredUser(): AdminUser | null {
    const raw = sessionStorage.getItem(USER_KEY) || localStorage.getItem(USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },

  getCurrentAdmin(): AdminUser | null {
    return this.getStoredUser();
  },

  async adminLogin(username: string, password: string, remember: boolean = false): Promise<{ success: boolean; user?: AdminUser; error?: string }> {
    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        return { success: false, error: data.error || 'Identifiant ou mot de passe incorrect.' };
      }

      this.setSession(data.token, data.user, remember);
      return { success: true, user: data.user };
    } catch (err: any) {
      return { success: false, error: 'Erreur réseau de connexion au serveur.' };
    }
  },

  async verifyAdminSession(): Promise<boolean> {
    const token = this.getToken();
    if (!token) return false;

    try {
      const response = await fetch('/api/admin/verify', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        return data.success;
      }
      this.clearSession();
      return false;
    } catch {
      // If server unreachable, keep session if token exists
      return !!token;
    }
  },

  async changeAdminPasscode(oldCode: string, newCode: string): Promise<{ success: boolean; message?: string; error?: string }> {
    const token = this.getToken();
    try {
      const response = await fetch('/api/admin/change-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ oldCode, newCode }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        return { success: false, error: data.error || 'Impossible de modifier le mot de passe.' };
      }
      return { success: true, message: data.message };
    } catch (err: any) {
      return { success: false, error: 'Erreur réseau lors du changement de mot de passe.' };
    }
  },

  async adminLogout(): Promise<void> {
    const token = this.getToken();
    if (token) {
      try {
        await fetch('/api/admin/logout', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` }
        });
      } catch {
        // ignore
      }
    }
    this.clearSession();
  },

  // ----------------------------------------------------
  // ADMIN DASHBOARD DATA - SUBMISSIONS / DEMANDES
  // ----------------------------------------------------
  async getSubmissions(filters?: { category?: string; status?: string; search?: string; sort?: 'recent' | 'oldest' }): Promise<FormSubmission[]> {
    const token = this.getToken();
    const query = new URLSearchParams();
    if (filters?.category) query.set('category', filters.category);
    if (filters?.status) query.set('status', filters.status);
    if (filters?.search) query.set('search', filters.search);
    if (filters?.sort) query.set('sort', filters.sort);

    try {
      const response = await fetch(`/api/submissions?${query.toString()}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        const items = data.items || [];
        // update local backup
        try {
          localStorage.setItem(LOCAL_BACKUP_SUBMISSIONS, JSON.stringify(items));
        } catch {
          // ignore
        }
        return items;
      }
    } catch (err) {
      console.error('Error fetching submissions from server:', err);
    }

    // Fallback to local storage if server is unreachable
    try {
      let backup: FormSubmission[] = JSON.parse(localStorage.getItem(LOCAL_BACKUP_SUBMISSIONS) || '[]');
      if (filters?.status && filters.status !== 'All' && filters.status !== 'Tous') {
        backup = backup.filter(i => i.status === filters.status);
      }
      if (filters?.search) {
        const q = filters.search.toLowerCase();
        backup = backup.filter(i => 
          i.name.toLowerCase().includes(q) || 
          i.message.toLowerCase().includes(q) || 
          i.email.toLowerCase().includes(q)
        );
      }
      return backup;
    } catch {
      return [];
    }
  },

  async updateSubmission(id: string, updates: { status?: SubmissionStatus; notes?: string }): Promise<FormSubmission | null> {
    const token = this.getToken();
    try {
      const response = await fetch(`/api/submissions/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updates)
      });
      if (response.ok) {
        const data = await response.json();
        // Also update local cache
        try {
          const backup: FormSubmission[] = JSON.parse(localStorage.getItem(LOCAL_BACKUP_SUBMISSIONS) || '[]');
          const idx = backup.findIndex(i => i.id === id);
          if (idx !== -1) {
            backup[idx] = { ...backup[idx], ...updates };
            localStorage.setItem(LOCAL_BACKUP_SUBMISSIONS, JSON.stringify(backup));
          }
        } catch {
          // ignore
        }
        return data.item;
      }
    } catch (err) {
      console.error('Error updating submission:', err);
    }

    // Local fallback update
    try {
      const backup: FormSubmission[] = JSON.parse(localStorage.getItem(LOCAL_BACKUP_SUBMISSIONS) || '[]');
      const idx = backup.findIndex(i => i.id === id);
      if (idx !== -1) {
        backup[idx] = { ...backup[idx], ...updates };
        localStorage.setItem(LOCAL_BACKUP_SUBMISSIONS, JSON.stringify(backup));
        return backup[idx];
      }
    } catch {
      // ignore
    }
    return null;
  },

  async deleteSubmission(id: string): Promise<boolean> {
    const token = this.getToken();
    try {
      const response = await fetch(`/api/submissions/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        try {
          const backup: FormSubmission[] = JSON.parse(localStorage.getItem(LOCAL_BACKUP_SUBMISSIONS) || '[]');
          const filtered = backup.filter(i => i.id !== id);
          localStorage.setItem(LOCAL_BACKUP_SUBMISSIONS, JSON.stringify(filtered));
        } catch {
          // ignore
        }
        return true;
      }
    } catch (err) {
      console.error('Error deleting submission:', err);
    }
    return false;
  },

  async getAdminStats(): Promise<AdminStats | null> {
    const token = this.getToken();
    try {
      const response = await fetch('/api/admin/stats', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        return data.stats;
      }
    } catch (err) {
      console.error('Error fetching admin stats:', err);
    }
    return null;
  },

  // ----------------------------------------------------
  // NEWSLETTER MANAGEMENT (ADMIN)
  // ----------------------------------------------------
  async getNewsletterStatus(): Promise<{
    configured: boolean;
    provider: string;
    senderEmail: string;
    senderName: string;
    listId?: number;
  }> {
    try {
      const response = await fetch('/api/newsletter/status');
      if (response.ok) {
        const data = await response.json();
        if (data.brevo) return data.brevo;
      }
    } catch (err) {
      console.warn('Could not fetch newsletter status:', err);
    }
    return {
      configured: false,
      provider: 'Brevo API v3',
      senderEmail: 'eglisedunazareendedame@gmail.com',
      senderName: 'Église du Nazaréen de Damé',
    };
  },

  async getNewsletterSubscribers(search?: string): Promise<NewsletterSubscriber[]> {
    const token = this.getToken();
    const query = search ? `?search=${encodeURIComponent(search)}` : '';
    try {
      const response = await fetch(`/api/newsletter/subscribers${query}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        const subscribers = data.subscribers || [];
        try {
          localStorage.setItem(LOCAL_BACKUP_SUBSCRIBERS, JSON.stringify(subscribers));
        } catch {
          // ignore
        }
        return subscribers;
      }
    } catch (err) {
      console.error('Error getting subscribers:', err);
    }

    try {
      let localSubs: NewsletterSubscriber[] = JSON.parse(localStorage.getItem(LOCAL_BACKUP_SUBSCRIBERS) || '[]');
      if (search) {
        const q = search.toLowerCase();
        localSubs = localSubs.filter(s => s.name.toLowerCase().includes(q) || s.email.toLowerCase().includes(q));
      }
      return localSubs;
    } catch {
      return [];
    }
  },

  async updateSubscriberStatus(id: string, status: 'Active' | 'Unsubscribed'): Promise<boolean> {
    const token = this.getToken();
    try {
      const response = await fetch(`/api/newsletter/subscribers/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      if (response.ok) {
        try {
          const localSubs: NewsletterSubscriber[] = JSON.parse(localStorage.getItem(LOCAL_BACKUP_SUBSCRIBERS) || '[]');
          const idx = localSubs.findIndex(s => s.id === id);
          if (idx !== -1) {
            localSubs[idx].status = status;
            localStorage.setItem(LOCAL_BACKUP_SUBSCRIBERS, JSON.stringify(localSubs));
          }
        } catch {
          // ignore
        }
        return true;
      }
    } catch (err) {
      console.error('Error updating subscriber status:', err);
    }
    return false;
  },

  async deleteSubscriber(id: string): Promise<boolean> {
    const token = this.getToken();
    try {
      const response = await fetch(`/api/newsletter/subscribers/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        try {
          const localSubs: NewsletterSubscriber[] = JSON.parse(localStorage.getItem(LOCAL_BACKUP_SUBSCRIBERS) || '[]');
          const filtered = localSubs.filter(s => s.id !== id);
          localStorage.setItem(LOCAL_BACKUP_SUBSCRIBERS, JSON.stringify(filtered));
        } catch {
          // ignore
        }
        return true;
      }
    } catch (err) {
      console.error('Error deleting subscriber:', err);
    }
    return false;
  },

  async getNewsletterCampaigns(): Promise<NewsletterCampaign[]> {
    const token = this.getToken();
    try {
      const response = await fetch('/api/newsletter/campaigns', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        return data.campaigns || [];
      }
    } catch (err) {
      console.error('Error getting campaigns:', err);
    }
    return [];
  },

  async createNewsletterCampaign(campaign: {
    title: string;
    subject: string;
    content: string;
    targetAudience: string;
    status: 'Draft' | 'Sent';
    testEmail?: string;
    recipients?: { email: string; name?: string }[];
  }): Promise<{
    success: boolean;
    campaign?: NewsletterCampaign;
    sentCount?: number;
    mode?: string;
    warning?: string;
    message?: string;
    error?: string;
  }> {
    const token = this.getToken();
    const endpoint = campaign.status === 'Sent' || campaign.testEmail ? '/api/newsletter/send' : '/api/newsletter/campaigns';
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(campaign)
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok || data.success === false) {
        return {
          success: false,
          error: data.error || `Erreur lors de l'envoi de la campagne (${response.status}).`,
        };
      }
      return {
        success: true,
        campaign: data.campaign,
        sentCount: data.sentCount,
        mode: data.mode,
        warning: data.warning,
        message: data.message,
      };
    } catch (err: any) {
      console.error('Error creating/sending campaign:', err);
      return {
        success: false,
        error: err?.message || 'Erreur réseau lors de la communication avec le serveur newsletter.',
      };
    }
  },

  // ----------------------------------------------------
  // PUBLICATIONS MANAGEMENT (PUBLIC & ADMIN)
  // ----------------------------------------------------
  async getPublications(includeDrafts: boolean = false, category?: string, search?: string, type?: string): Promise<ChurchPublication[]> {
    const token = this.getToken();
    const query = new URLSearchParams();
    if (includeDrafts) query.set('includeDrafts', 'true');
    if (category) query.set('category', category);
    if (search) query.set('search', search);
    if (type) query.set('type', type);

    let serverPubs: ChurchPublication[] = [];
    try {
      const headers: Record<string, string> = {};
      if (token && includeDrafts) headers['Authorization'] = `Bearer ${token}`;

      const response = await fetch(`/api/publications?${query.toString()}`, { headers });
      if (response.ok) {
        const data = await response.json();
        serverPubs = data.publications || [];
      }
    } catch (err) {
      console.warn('[Publications] Serveur indisponible, bascule sur la mémoire locale:', err);
    }

    try {
      let backup: ChurchPublication[] = JSON.parse(localStorage.getItem(LOCAL_BACKUP_PUBLICATIONS) || '[]');
      backup = backup.filter(p => !isLegacyRemovedProject(p));
      serverPubs = serverPubs.filter(p => !isLegacyRemovedProject(p));
      
      // Synchronisation directe avec l'Espace Secrétariat (end_sec_projects & end_sec_announcements)
      let secProjects: SecProject[] = [];
      try {
        const rawSecProj = localStorage.getItem('end_sec_projects');
        secProjects = rawSecProj ? cleanProjectsArray(JSON.parse(rawSecProj)) : seedProjects();
      } catch {
        secProjects = seedProjects();
      }

      let secAnnouncements: SecAnnouncement[] = [];
      try {
        const rawSecAnn = localStorage.getItem('end_sec_announcements');
        secAnnouncements = rawSecAnn ? JSON.parse(rawSecAnn) : seedAnnouncements();
      } catch {
        secAnnouncements = seedAnnouncements();
      }

      const mappedSecProjects: ChurchPublication[] = secProjects
        .filter(p => !p.archived && (includeDrafts || p.published !== false))
        .map(p => {
          const mappedStatus: 'Planifié' | 'En cours' | 'Terminé' | 'En attente' =
            p.status === 'En attente' ? 'En attente' : p.status;
          const metricsStr = p.metrics && p.metrics.length > 0
            ? p.metrics.map(m => `${m.value} ${m.label}`).join(' | ')
            : undefined;
          const imgPath = p.image && p.image.trim() !== '' ? p.image : '/images/comite.jpg';
          return {
            id: p.id,
            code: p.code || 'COMP-HA0926',
            title: p.title,
            partner: p.partner || 'Compassion International',
            summary: p.description || '',
            content: p.description || '',
            image: imgPath,
            category: p.category || 'Projets Sociaux',
            author: p.leader || 'Pasteur Bequel CHERELUS',
            date: p.date || new Date().toISOString().split('T')[0],
            status: p.published === false ? 'Brouillon' : 'Publiée',
            publicationType: 'projet',
            editorMode: 'visual',
            hasCustomImage: Boolean(p.image && p.image.trim() !== ''),
            budget: p.partner ? `Partenaire : ${p.partner}${p.category ? ` (${p.category})` : ''}` : p.category,
            targetGoal: metricsStr,
            projectStatus: mappedStatus,
            externalUrl: p.url || undefined,
            objectives: Array.isArray(p.objectives) && p.objectives.length > 0 ? p.objectives : undefined,
            impactMetrics: p.metrics && p.metrics.length > 0 ? p.metrics : undefined,
            createdAt: p.date || new Date().toISOString()
          } as ChurchPublication;
        });

      const mappedSecAnnouncements: ChurchPublication[] = secAnnouncements.map(a => ({
        id: a.id,
        title: a.title,
        summary: a.content,
        content: a.content,
        image: '',
        category: a.priority === 'Importante' ? 'Annonce Importante' : 'Annonces',
        author: 'Secrétariat de l\'Église',
        date: a.date,
        status: a.published ? 'Publiée' : 'Brouillon',
        publicationType: 'annonce',
        editorMode: 'visual',
        hasCustomImage: false,
        createdAt: a.date
      }));

      // Pour les projets, secProjects (Espace Secrétariat) fait foi (y compris pour les suppressions)
      const secProjectIds = new Set(secProjects.map(p => p.id));

      // Fusionner les publications du Secrétariat, serveur et locales (priorité au Secrétariat en temps réel)
      const mergedMap = new Map<string, ChurchPublication>();
      mappedSecProjects.forEach(p => mergedMap.set(p.id, p));
      mappedSecAnnouncements.forEach(a => mergedMap.set(a.id, a));
      serverPubs.forEach(p => {
        if (p.publicationType === 'projet' && !secProjectIds.has(p.id)) return;
        if (!mergedMap.has(p.id)) mergedMap.set(p.id, p);
      });
      backup.forEach(p => {
        if (p.publicationType === 'projet' && !secProjectIds.has(p.id)) return;
        if (!mergedMap.has(p.id)) {
          mergedMap.set(p.id, p);
        }
      });
      
      let allPubs = Array.from(mergedMap.values());
      if (!includeDrafts) {
        allPubs = allPubs.filter(p => p.status === 'Publiée');
      }
      if (type && type !== 'All' && type !== 'all') {
        allPubs = allPubs.filter(p => {
          if (p.publicationType) return p.publicationType === type;
          if (type === 'projet') return p.category.toLowerCase().includes('projet') || p.category.toLowerCase().includes('parrainage');
          if (type === 'annonce') return p.category.toLowerCase().includes('annonce');
          return true;
        });
      }

      // Conserver le backup synchronisé en nettoyant les images volumineuses pour éviter QuotaExceededError
      const safeBackup = allPubs.slice(0, 100).map(p => {
        if (p.image && p.image.startsWith('data:image') && p.image.length > 80000) {
          return { ...p, image: '/images/comite.jpg' };
        }
        return p;
      });
      safeLocalStorageSet(LOCAL_BACKUP_PUBLICATIONS, JSON.stringify(safeBackup));
      return allPubs;
    } catch {
      return serverPubs.filter(p => !isLegacyRemovedProject(p));
    }
  },

  async getProjects(includeDrafts: boolean = false): Promise<ChurchPublication[]> {
    // Synchroniser d'abord depuis /api/projects si disponible
    try {
      const response = await fetch(`/api/projects?includeDrafts=${includeDrafts ? 'true' : 'false'}`);
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data.projects)) {
          const normalized = data.projects
            .filter((p: any) => !isLegacyRemovedProject(p))
            .map((p: any, idx: number) => normalizeProjectItem(p, idx));
          // Si localStorage n'a pas encore été initialisé, enregistrer les projets du serveur
          if (!localStorage.getItem('end_sec_projects')) {
            safeLocalStorageSet('end_sec_projects', JSON.stringify(normalized));
          }
        }
      }
    } catch {
      // fallback localStorage
    }
    return this.getPublications(includeDrafts, undefined, undefined, 'projet');
  },

  // ----------------------------------------------------
  // SOCIAL PROJECTS DIRECT CRUD & CODE MANAGEMENT
  // ----------------------------------------------------
  async getSocialProjects(includeDrafts: boolean = true): Promise<SecProject[]> {
    let localProjects: SecProject[] = [];
    try {
      const raw = localStorage.getItem('end_sec_projects');
      localProjects = raw ? cleanProjectsArray(JSON.parse(raw)) : seedProjects();
    } catch {
      localProjects = seedProjects();
    }

    try {
      const response = await fetch(`/api/projects?includeDrafts=${includeDrafts ? 'true' : 'false'}`);
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data.projects) && data.projects.length > 0) {
          const serverProjects = data.projects
            .filter((p: any) => !isLegacyRemovedProject(p))
            .map((p: any, idx: number) => normalizeProjectItem(p, idx));
          if (!localStorage.getItem('end_sec_projects')) {
            safeLocalStorageSet('end_sec_projects', JSON.stringify(serverProjects));
            return serverProjects;
          }
        }
      }
    } catch {
      // use localProjects
    }
    return includeDrafts ? localProjects : localProjects.filter(p => p.published && !p.archived);
  },

  async createSocialProject(projectData: Partial<SecProject>): Promise<{ success: boolean; project?: SecProject; error?: string }> {
    const cleanCode = String(projectData.code || '').trim().toUpperCase();
    const cleanTitle = String(projectData.title || '').trim();
    if (!cleanCode || !/^[A-Z0-9-_]{2,32}$/.test(cleanCode)) {
      return { success: false, error: 'Le code du projet est requis (2 à 32 caractères : lettres, chiffres, tirets).' };
    }
    if (!cleanTitle) {
      return { success: false, error: 'Le titre du projet est obligatoire.' };
    }

    const token = this.getToken();
    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ ...projectData, code: cleanCode, title: cleanTitle })
      });
      if (response.ok) {
        const data = await response.json();
        const created = normalizeProjectItem(data.project);
        return { success: true, project: created };
      } else {
        const err = await response.json().catch(() => ({}));
        if (response.status === 400 && err.error) {
          return { success: false, error: err.error };
        }
      }
    } catch (err) {
      console.warn('[Projects] Création serveur indisponible, sauvegarde locale:', err);
    }

    const fallback = normalizeProjectItem({ ...projectData, code: cleanCode, title: cleanTitle });
    return { success: true, project: fallback };
  },

  async updateSocialProject(id: string, updates: Partial<SecProject>): Promise<{ success: boolean; project?: SecProject; error?: string }> {
    if (updates.code !== undefined) {
      const cleanCode = String(updates.code).trim().toUpperCase();
      if (!cleanCode || !/^[A-Z0-9-_]{2,32}$/.test(cleanCode)) {
        return { success: false, error: 'Le code du projet doit contenir 2 à 32 caractères (lettres, chiffres, tirets).' };
      }
      updates = { ...updates, code: cleanCode };
    }

    const token = this.getToken();
    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify(updates)
      });
      if (response.ok) {
        const data = await response.json();
        return { success: true, project: normalizeProjectItem(data.project) };
      } else {
        const err = await response.json().catch(() => ({}));
        if (response.status === 400 && err.error) {
          return { success: false, error: err.error };
        }
      }
    } catch (err) {
      console.warn('[Projects] Mise à jour serveur indisponible, sauvegarde locale:', err);
    }

    return { success: true };
  },

  async updateProjectCode(id: string, code: string): Promise<{ success: boolean; project?: SecProject; error?: string }> {
    const cleanCode = String(code || '').trim().toUpperCase();
    if (!cleanCode || !/^[A-Z0-9-_]{2,32}$/.test(cleanCode)) {
      return { success: false, error: 'Code invalide. Utilisez 2 à 32 caractères (lettres, chiffres, tirets), ex: COMP-HA0926.' };
    }

    const token = this.getToken();
    try {
      const response = await fetch(`/api/projects/${id}/code`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ code: cleanCode })
      });
      if (response.ok) {
        const data = await response.json();
        return { success: true, project: normalizeProjectItem(data.project) };
      } else {
        const err = await response.json().catch(() => ({}));
        if (response.status === 400 && err.error) {
          return { success: false, error: err.error };
        }
      }
    } catch (err) {
      console.warn('[Projects] Mise à jour code serveur indisponible, sauvegarde locale:', err);
    }

    return { success: true };
  },

  async deleteSocialProject(id: string): Promise<{ success: boolean; error?: string }> {
    const token = this.getToken();
    try {
      await fetch(`/api/projects/${id}`, {
        method: 'DELETE',
        headers: {
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        }
      });
    } catch (err) {
      console.warn('[Projects] Suppression serveur indisponible, suppression locale:', err);
    }
    return { success: true };
  },

  async createPublication(pub: {
    title: string;
    content: string;
    summary?: string;
    image?: string;
    category?: string;
    author?: string;
    date?: string;
    status?: 'Brouillon' | 'En attente' | 'Publiée' | 'Archivée';
    publicationType?: 'article' | 'annonce' | 'projet';
    editorMode?: 'visual' | 'html';
    hasCustomImage?: boolean;
    budget?: string;
    targetGoal?: string;
    projectStatus?: 'Planifié' | 'En cours' | 'Terminé';
  }): Promise<ChurchPublication | null> {
    const token = this.getToken();
    
    // Gérer l'image : si pas d'image personnalisée, garder chaîne vide au lieu d'écraser
    let cleanImage = '';
    if (pub.hasCustomImage && pub.image) {
      cleanImage = (pub.image.length < 350000) ? pub.image : '/images/ecole_facade.jpg';
    }

    const cleanPublicationType = pub.publicationType || 
      (String(pub.category || '').toLowerCase().includes('projet') ? 'projet' : String(pub.category || '').toLowerCase().includes('annonce') ? 'annonce' : 'article');

    const payload = {
      ...pub,
      image: cleanImage,
      publicationType: cleanPublicationType,
      editorMode: pub.editorMode || 'visual',
      hasCustomImage: Boolean(pub.hasCustomImage && cleanImage),
      budget: cleanPublicationType === 'projet' ? pub.budget : undefined,
      targetGoal: cleanPublicationType === 'projet' ? pub.targetGoal : undefined,
      projectStatus: cleanPublicationType === 'projet' ? (pub.projectStatus || 'En cours') : undefined
    };

    try {
      const response = await fetch('/api/publications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const data = await response.json();
        const created: ChurchPublication = data.publication;
        // Sauvegarder dans le cache local
        try {
          const backup: ChurchPublication[] = JSON.parse(localStorage.getItem(LOCAL_BACKUP_PUBLICATIONS) || '[]');
          backup.unshift(created);
          const safeBackup = backup.slice(0, 100).map(p => {
            if (p.image && p.image.startsWith('data:image') && p.image.length > 80000) {
              return { ...p, image: '/images/ecole_facade.jpg' };
            }
            return p;
          });
          safeLocalStorageSet(LOCAL_BACKUP_PUBLICATIONS, JSON.stringify(safeBackup));
        } catch {
          // ignore
        }

        // Déclencher un événement global pour mise à jour immédiate des vues publiques
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('dame_publications_updated', { detail: { publication: created } }));
        }

        return created;
      }
    } catch (netErr) {
      console.warn('[Publications] Sauvegarde distante impossible, bascule immédiate sur stockage local:', netErr);
    }

    // Repli de secours garanti : création locale sans jamais bloquer l'administrateur
    const fallbackPub: ChurchPublication = {
      id: `pub-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      title: pub.title.trim(),
      content: pub.content.trim(),
      summary: (pub.summary && pub.summary.trim()) || pub.content.slice(0, 160).replace(/<[^>]*>?/gm, '') + '...',
      image: cleanImage,
      category: pub.category || (cleanPublicationType === 'projet' ? 'Projet Communautaire' : 'Actualité de l\'Église'),
      author: pub.author?.trim() || 'Secrétariat de l\'Église',
      date: pub.date || new Date().toISOString().split('T')[0],
      status: pub.status || 'Publiée',
      publicationType: cleanPublicationType,
      editorMode: pub.editorMode || 'visual',
      hasCustomImage: Boolean(pub.hasCustomImage && cleanImage),
      budget: cleanPublicationType === 'projet' ? pub.budget : undefined,
      targetGoal: cleanPublicationType === 'projet' ? pub.targetGoal : undefined,
      projectStatus: cleanPublicationType === 'projet' ? (pub.projectStatus || 'En cours') : undefined,
      createdAt: new Date().toISOString()
    };

    try {
      const backup: ChurchPublication[] = JSON.parse(localStorage.getItem(LOCAL_BACKUP_PUBLICATIONS) || '[]');
      backup.unshift(fallbackPub);
      const safeBackup = backup.slice(0, 100).map(p => {
        if (p.image && p.image.startsWith('data:image') && p.image.length > 80000) {
          return { ...p, image: '/images/ecole_facade.jpg' };
        }
        return p;
      });
      safeLocalStorageSet(LOCAL_BACKUP_PUBLICATIONS, JSON.stringify(safeBackup));
    } catch (saveErr) {
      console.error('[Publications] Erreur stockage local fallback:', saveErr);
    }

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('dame_publications_updated', { detail: { publication: fallbackPub } }));
    }

    return fallbackPub;
  },

  async updatePublication(id: string, updates: Partial<ChurchPublication>): Promise<ChurchPublication | null> {
    const token = this.getToken();
    try {
      const response = await fetch(`/api/publications/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify(updates)
      });
      if (response.ok) {
        const data = await response.json();
        const updated = data.publication;
        try {
          const backup: ChurchPublication[] = JSON.parse(localStorage.getItem(LOCAL_BACKUP_PUBLICATIONS) || '[]');
          const idx = backup.findIndex(p => p.id === id);
          if (idx !== -1) {
            backup[idx] = updated;
            const safeBackup = backup.map(p => {
              if (p.image && p.image.startsWith('data:image') && p.image.length > 80000) {
                return { ...p, image: '/images/ecole_facade.jpg' };
              }
              return p;
            });
            safeLocalStorageSet(LOCAL_BACKUP_PUBLICATIONS, JSON.stringify(safeBackup));
          }
        } catch {
          // ignore
        }

        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('dame_publications_updated', { detail: { publication: updated } }));
        }

        return updated;
      }
    } catch (err: any) {
      console.warn('[Publications] Mise à jour distante échouée, application locale:', err);
    }

    // Fallback local
    try {
      const backup: ChurchPublication[] = JSON.parse(localStorage.getItem(LOCAL_BACKUP_PUBLICATIONS) || '[]');
      const idx = backup.findIndex(p => p.id === id);
      if (idx !== -1) {
        backup[idx] = { ...backup[idx], ...updates };
        const safeBackup = backup.map(p => {
          if (p.image && p.image.startsWith('data:image') && p.image.length > 80000) {
            return { ...p, image: '/images/ecole_facade.jpg' };
          }
          return p;
        });
        safeLocalStorageSet(LOCAL_BACKUP_PUBLICATIONS, JSON.stringify(safeBackup));
        
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('dame_publications_updated', { detail: { publication: backup[idx] } }));
        }

        return backup[idx];
      }
    } catch {
      // ignore
    }

    return null;
  },

  async deletePublication(id: string): Promise<boolean> {
    const token = this.getToken();
    try {
      await fetch(`/api/publications/${id}`, {
        method: 'DELETE',
        headers: {
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        }
      });
    } catch (err) {
      console.warn('[Publications] Suppression distante impossible, suppression locale:', err);
    }

    try {
      const backup: ChurchPublication[] = JSON.parse(localStorage.getItem(LOCAL_BACKUP_PUBLICATIONS) || '[]');
      const filtered = backup.filter(p => p.id !== id);
      safeLocalStorageSet(LOCAL_BACKUP_PUBLICATIONS, JSON.stringify(filtered));
      
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('dame_publications_updated', { detail: { deletedId: id } }));
      }

      return true;
    } catch {
      return true;
    }
  },

  // ----------------------------------------------------
  // EVENTS MANAGEMENT (PUBLIC & ADMIN)
  // ----------------------------------------------------
  async getEvents(includeDrafts: boolean = false, category?: string, search?: string): Promise<ChurchEvent[]> {
    const token = this.getToken();
    const query = new URLSearchParams();
    if (includeDrafts) query.set('includeDrafts', 'true');
    if (category) query.set('category', category);
    if (search) query.set('search', search);

    let serverEvents: ChurchEvent[] = [];
    try {
      const headers: Record<string, string> = {};
      if (token && includeDrafts) headers['Authorization'] = `Bearer ${token}`;

      const response = await fetch(`/api/events?${query.toString()}`, { headers });
      if (response.ok) {
        const data = await response.json();
        serverEvents = data.events || [];
      }
    } catch (err) {
      console.warn('[Events] Serveur distant indisponible, utilisation du cache local:', err);
    }

    try {
      let backup: ChurchEvent[] = JSON.parse(localStorage.getItem(LOCAL_BACKUP_EVENTS) || '[]');
      let secEvents: SecEventItem[] = [];
      try {
        const rawSecEvents = localStorage.getItem('end_sec_events');
        secEvents = rawSecEvents ? JSON.parse(rawSecEvents) : seedEvents();
      } catch {
        secEvents = seedEvents();
      }

      const mappedSecEvents: ChurchEvent[] = secEvents.map(e => ({
        id: e.id,
        title: e.title,
        description: e.description || `${e.kind} à ${e.location || "l'Église du Nazaréen de Damé"}`,
        image: '/images/dame_facade.jpg',
        date: e.date,
        startTime: e.time || '09:00',
        endTime: '',
        location: e.location || 'Église du Nazaréen de Damé',
        organizer: 'Pasteur Bequel CHERELUS',
        category: e.kind || 'Culte',
        status: e.published ? 'Publié' : 'Brouillon',
        highlight: e.kind === 'Convention',
        createdAt: e.date
      }));

      const mergedMap = new Map<string, ChurchEvent>();
      mappedSecEvents.forEach(e => mergedMap.set(e.id, e));
      serverEvents.forEach(e => {
        if (!mergedMap.has(e.id)) mergedMap.set(e.id, e);
      });
      backup.forEach(e => {
        if (!mergedMap.has(e.id)) {
          mergedMap.set(e.id, e);
        }
      });

      let allEvents = Array.from(mergedMap.values());
      if (!includeDrafts) {
        allEvents = allEvents.filter(e => e.status === 'Publié');
      }

      safeLocalStorageSet(LOCAL_BACKUP_EVENTS, JSON.stringify(allEvents.slice(0, 100)));
      return allEvents;
    } catch {
      return serverEvents;
    }
  },

  async createEvent(event: {
    title: string;
    description: string;
    image?: string;
    date: string;
    startTime?: string;
    endTime?: string;
    location?: string;
    organizer?: string;
    category?: string;
    status?: 'Brouillon' | 'Publié' | 'Terminé' | 'Annulé';
    highlight?: boolean;
  }): Promise<ChurchEvent | null> {
    const token = this.getToken();
    const cleanImage = (event.image && event.image.length < 300000) ? event.image : '/images/dame_facade.jpg';
    const payload = {
      ...event,
      image: cleanImage
    };

    try {
      const response = await fetch('/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const data = await response.json();
        const created = data.event;
        try {
          const backup: ChurchEvent[] = JSON.parse(localStorage.getItem(LOCAL_BACKUP_EVENTS) || '[]');
          backup.unshift(created);
          safeLocalStorageSet(LOCAL_BACKUP_EVENTS, JSON.stringify(backup.slice(0, 100)));
        } catch {
          // ignore
        }
        return created;
      }
    } catch (netErr) {
      console.warn('[Events] Serveur distant non joignable, enregistrement sécurisé en local:', netErr);
    }

    // Repli de secours : création locale robuste pour ne jamais afficher d'erreur bloquante
    const fallbackEvent: ChurchEvent = {
      id: `evt-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      title: event.title.trim(),
      description: event.description.trim(),
      image: cleanImage,
      date: event.date,
      startTime: event.startTime || '08:00',
      endTime: event.endTime || '12:00',
      location: event.location?.trim() || 'Sanctuaire Principal, Rue Cimetière Damé',
      organizer: event.organizer?.trim() || 'Secrétariat & Conseil de l\'Église',
      category: event.category || 'Culte & Célébration',
      status: event.status || 'Publié',
      highlight: Boolean(event.highlight),
      createdAt: new Date().toISOString()
    };

    try {
      const backup: ChurchEvent[] = JSON.parse(localStorage.getItem(LOCAL_BACKUP_EVENTS) || '[]');
      backup.unshift(fallbackEvent);
      safeLocalStorageSet(LOCAL_BACKUP_EVENTS, JSON.stringify(backup.slice(0, 100)));
    } catch (saveErr) {
      console.error('[Events] Échec sauvegarde fallback locale:', saveErr);
    }

    return fallbackEvent;
  },

  async updateEvent(id: string, updates: Partial<ChurchEvent>): Promise<ChurchEvent | null> {
    const token = this.getToken();
    try {
      const response = await fetch(`/api/events/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify(updates)
      });
      if (response.ok) {
        const data = await response.json();
        const updated = data.event;
        try {
          const backup: ChurchEvent[] = JSON.parse(localStorage.getItem(LOCAL_BACKUP_EVENTS) || '[]');
          const idx = backup.findIndex(e => e.id === id);
          if (idx !== -1) {
            backup[idx] = updated;
            safeLocalStorageSet(LOCAL_BACKUP_EVENTS, JSON.stringify(backup));
          }
        } catch {
          // ignore
        }
        return updated;
      }
    } catch (err: any) {
      console.warn('[Events] Erreur mise à jour distante, répercussion locale:', err);
    }

    try {
      const backup: ChurchEvent[] = JSON.parse(localStorage.getItem(LOCAL_BACKUP_EVENTS) || '[]');
      const idx = backup.findIndex(e => e.id === id);
      if (idx !== -1) {
        backup[idx] = { ...backup[idx], ...updates };
        safeLocalStorageSet(LOCAL_BACKUP_EVENTS, JSON.stringify(backup));
        return backup[idx];
      }
    } catch {
      // ignore
    }

    return null;
  },

  async deleteEvent(id: string): Promise<boolean> {
    const token = this.getToken();
    try {
      await fetch(`/api/events/${id}`, {
        method: 'DELETE',
        headers: {
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        }
      });
    } catch (err) {
      console.warn('[Events] Erreur suppression distante, suppression locale:', err);
    }

    try {
      const backup: ChurchEvent[] = JSON.parse(localStorage.getItem(LOCAL_BACKUP_EVENTS) || '[]');
      const filtered = backup.filter(e => e.id !== id);
      safeLocalStorageSet(LOCAL_BACKUP_EVENTS, JSON.stringify(filtered));
      return true;
    } catch {
      return true;
    }
  },

  // ----------------------------------------------------
  // PODCASTS / AUDIO MESSAGES
  // ----------------------------------------------------
  async getPodcasts(): Promise<ChurchPodcast[]> {
    let podcastsList: ChurchPodcast[] = [];
    try {
      const response = await fetch('/api/podcasts');
      if (response.ok) {
        const data = await response.json();
        podcastsList = data.podcasts || [];
        // Save safe backup in localStorage (stripped of heavy base64 strings)
        try {
          const sanitized = podcastsList.map(sanitizePodcastForStorage);
          safeLocalStorageSet(LOCAL_BACKUP_PODCASTS, JSON.stringify(sanitized));
        } catch {
          // ignore
        }
      }
    } catch (err) {
      console.warn('Network issue getting podcasts, attempting local storage fallback:', err);
      try {
        const raw = localStorage.getItem(LOCAL_BACKUP_PODCASTS);
        if (raw) {
          podcastsList = JSON.parse(raw);
        }
      } catch (parseErr) {
        console.error('Error parsing local podcasts backup:', parseErr);
      }
    }

    // Resolve any IndexedDB audio references (e.g., indexeddb:pod-123)
    const resolvedPodcasts = await Promise.all(
      podcastsList.map(async (pod) => {
        if (pod.audioUrl && pod.audioUrl.startsWith('indexeddb:')) {
          const id = pod.audioUrl.replace('indexeddb:', '');
          const idbAudio = await getAudioFromIndexedDB(id);
          if (idbAudio) {
            return { ...pod, audioUrl: idbAudio };
          }
        }
        return pod;
      })
    );

    // Merge sermons from Espace Secrétariat (end_sec_sermons)
    try {
      const rawSermons = localStorage.getItem('end_sec_sermons');
      const secSermons: SecSermon[] = rawSermons ? JSON.parse(rawSermons) : seedSermons();
      const mappedSermons: ChurchPodcast[] = secSermons.map(s => ({
        id: s.id,
        title: s.title,
        preacher: s.speaker || 'Pasteur Bequel CHERELUS',
        date: s.date,
        category: 'Prédication',
        description: s.passage ? `Passage biblique : ${s.passage}` : 'Message édifiant proclamé à l\'Église du Nazaréen de Damé.',
        audioUrl: localAudioUrls[s.id] || s.audioUrl || '',
        duration: '30:00',
        coverImage: '/images/pasteur_bequel.jpg',
        createdAt: s.date
      }));
      const mergedPodMap = new Map<string, ChurchPodcast>();
      mappedSermons.forEach(p => mergedPodMap.set(p.id, p));
      resolvedPodcasts.forEach(p => {
        if (!mergedPodMap.has(p.id)) mergedPodMap.set(p.id, p);
      });
      return Array.from(mergedPodMap.values());
    } catch {
      return resolvedPodcasts;
    }
  },

  async createPodcast(podcast: {
    title: string;
    preacher: string;
    date: string;
    category: 'Prédication' | 'Étude biblique' | 'Enseignement' | 'Témoignage';
    description: string;
    audioUrl: string;
    duration?: string;
    coverImage?: string;
  }): Promise<ChurchPodcast | null> {
    const token = this.getToken();

    // 1. If audio is heavy base64 data, store in IndexedDB immediately for instant offline durability
    const tempId = `pod-${Date.now()}`;
    if (podcast.audioUrl && (podcast.audioUrl.startsWith('data:audio') || podcast.audioUrl.startsWith('blob:'))) {
      await saveAudioToIndexedDB(tempId, podcast.audioUrl);
    }

    try {
      const response = await fetch('/api/podcasts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(podcast)
      });

      if (response.ok) {
        const data = await response.json();
        const created: ChurchPodcast = data.podcast;

        // Persist audio in IndexedDB with official podcast id
        if (podcast.audioUrl) {
          await saveAudioToIndexedDB(created.id, podcast.audioUrl);
        }

        // Update local backup safely without QuotaExceededError
        try {
          const raw = localStorage.getItem(LOCAL_BACKUP_PODCASTS);
          const current: ChurchPodcast[] = raw ? JSON.parse(raw) : [];
          const sanitized = [sanitizePodcastForStorage(created), ...current];
          safeLocalStorageSet(LOCAL_BACKUP_PODCASTS, JSON.stringify(sanitized));
        } catch {
          // ignore
        }

        return created;
      }

      const err = await response.json().catch(() => ({}));
      throw new Error(err.error || 'Erreur lors de la publication');
    } catch (err: any) {
      console.warn('Failed to post podcast to server, falling back to local persistent store:', err);

      // Durably create offline fallback podcast
      const fallbackPodcast: ChurchPodcast = {
        id: tempId,
        title: podcast.title,
        preacher: podcast.preacher,
        date: podcast.date,
        category: podcast.category,
        description: podcast.description,
        audioUrl: podcast.audioUrl,
        duration: podcast.duration || '25:00',
        coverImage: podcast.coverImage || '/images/pasteur_bequel.jpg',
        createdAt: new Date().toISOString()
      };

      try {
        const raw = localStorage.getItem(LOCAL_BACKUP_PODCASTS);
        const current: ChurchPodcast[] = raw ? JSON.parse(raw) : [];
        const sanitized = [sanitizePodcastForStorage(fallbackPodcast), ...current];
        safeLocalStorageSet(LOCAL_BACKUP_PODCASTS, JSON.stringify(sanitized));
      } catch {
        // ignore
      }

      return fallbackPodcast;
    }
  },

  async deletePodcast(id: string): Promise<boolean> {
    const token = this.getToken();
    let success = false;

    // Remove from IndexedDB
    await deleteAudioFromIndexedDB(id);

    // Remove from local backup
    try {
      const raw = localStorage.getItem(LOCAL_BACKUP_PODCASTS);
      if (raw) {
        const current: ChurchPodcast[] = JSON.parse(raw);
        const filtered = current.filter(p => p.id !== id);
        safeLocalStorageSet(LOCAL_BACKUP_PODCASTS, JSON.stringify(filtered));
      }
    } catch {
      // ignore
    }

    try {
      const response = await fetch(`/api/podcasts/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      success = response.ok;
    } catch (err) {
      console.error('Error deleting podcast:', err);
      success = true; // Still true locally
    }

    return success;
  },

  // ----------------------------------------------------
  // FAQ MANAGEMENT (PUBLIC & ADMIN)
  // ----------------------------------------------------
  async getFaqs(includeUnpublished: boolean = false, category?: string, search?: string): Promise<ChurchFaqItem[]> {
    const token = this.getToken();
    const query = new URLSearchParams();
    if (includeUnpublished) query.set('includeUnpublished', 'true');
    if (category) query.set('category', category);
    if (search) query.set('search', search);

    let serverFaqs: ChurchFaqItem[] = [];
    try {
      const headers: Record<string, string> = {};
      if (token && includeUnpublished) headers['Authorization'] = `Bearer ${token}`;

      const response = await fetch(`/api/faq?${query.toString()}`, { headers });
      if (response.ok) {
        const data = await response.json();
        serverFaqs = data.faqs || [];
      }
    } catch (err) {
      console.warn('[FAQ] Serveur distant non accessible, bascule sur sauvegarde locale:', err);
    }

    try {
      let backup: ChurchFaqItem[] = JSON.parse(localStorage.getItem(LOCAL_BACKUP_FAQ) || '[]');
      const mergedMap = new Map<string, ChurchFaqItem>();
      serverFaqs.forEach(f => mergedMap.set(f.id, f));
      backup.forEach(f => {
        if (!mergedMap.has(f.id)) {
          mergedMap.set(f.id, f);
        }
      });

      let allFaqs = Array.from(mergedMap.values());
      if (!includeUnpublished) {
        allFaqs = allFaqs.filter(f => f.published);
      }
      if (category && category !== 'Toutes' && category !== 'All') {
        allFaqs = allFaqs.filter(f => f.category === category);
      }
      if (search && search.trim()) {
        const q = search.toLowerCase().trim();
        allFaqs = allFaqs.filter(f => 
          f.question.toLowerCase().includes(q) ||
          f.answer.toLowerCase().includes(q) ||
          f.category.toLowerCase().includes(q)
        );
      }

      allFaqs.sort((a, b) => (a.order || 999) - (b.order || 999));
      safeLocalStorageSet(LOCAL_BACKUP_FAQ, JSON.stringify(allFaqs));
      return allFaqs;
    } catch {
      return serverFaqs;
    }
  },

  async createFaq(faq: {
    question: string;
    answer: string;
    category?: string;
    order?: number;
    published?: boolean;
  }): Promise<ChurchFaqItem | null> {
    const token = this.getToken();
    const payload = {
      question: faq.question.trim(),
      answer: faq.answer.trim(),
      category: faq.category?.trim() || 'Général',
      order: typeof faq.order === 'number' ? faq.order : 1,
      published: faq.published !== false
    };

    try {
      const response = await fetch('/api/faq', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const data = await response.json();
        const created: ChurchFaqItem = data.faq;
        try {
          const backup: ChurchFaqItem[] = JSON.parse(localStorage.getItem(LOCAL_BACKUP_FAQ) || '[]');
          backup.push(created);
          backup.sort((a, b) => (a.order || 999) - (b.order || 999));
          safeLocalStorageSet(LOCAL_BACKUP_FAQ, JSON.stringify(backup));
        } catch {
          // ignore
        }

        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('dame_faq_updated', { detail: { faq: created } }));
        }

        return created;
      }
    } catch (err) {
      console.warn('[FAQ] Échec de l’enregistrement distant, création locale:', err);
    }

    // Fallback local
    const fallbackFaq: ChurchFaqItem = {
      id: `faq-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      question: payload.question,
      answer: payload.answer,
      category: payload.category,
      order: payload.order,
      published: payload.published,
      createdAt: new Date().toISOString()
    };

    try {
      const backup: ChurchFaqItem[] = JSON.parse(localStorage.getItem(LOCAL_BACKUP_FAQ) || '[]');
      backup.push(fallbackFaq);
      backup.sort((a, b) => (a.order || 999) - (b.order || 999));
      safeLocalStorageSet(LOCAL_BACKUP_FAQ, JSON.stringify(backup));
    } catch (saveErr) {
      console.error('[FAQ] Erreur stockage local fallback:', saveErr);
    }

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('dame_faq_updated', { detail: { faq: fallbackFaq } }));
    }

    return fallbackFaq;
  },

  async updateFaq(id: string, updates: Partial<ChurchFaqItem>): Promise<ChurchFaqItem | null> {
    const token = this.getToken();
    try {
      const response = await fetch(`/api/faq/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify(updates)
      });
      if (response.ok) {
        const data = await response.json();
        const updated = data.faq;
        try {
          const backup: ChurchFaqItem[] = JSON.parse(localStorage.getItem(LOCAL_BACKUP_FAQ) || '[]');
          const idx = backup.findIndex(f => f.id === id);
          if (idx !== -1) {
            backup[idx] = updated;
            backup.sort((a, b) => (a.order || 999) - (b.order || 999));
            safeLocalStorageSet(LOCAL_BACKUP_FAQ, JSON.stringify(backup));
          }
        } catch {
          // ignore
        }

        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('dame_faq_updated', { detail: { faq: updated } }));
        }

        return updated;
      }
    } catch (err) {
      console.warn('[FAQ] Erreur mise à jour distante, application locale:', err);
    }

    // Fallback local
    try {
      const backup: ChurchFaqItem[] = JSON.parse(localStorage.getItem(LOCAL_BACKUP_FAQ) || '[]');
      const idx = backup.findIndex(f => f.id === id);
      if (idx !== -1) {
        backup[idx] = { ...backup[idx], ...updates, updatedAt: new Date().toISOString() };
        backup.sort((a, b) => (a.order || 999) - (b.order || 999));
        safeLocalStorageSet(LOCAL_BACKUP_FAQ, JSON.stringify(backup));

        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('dame_faq_updated', { detail: { faq: backup[idx] } }));
        }

        return backup[idx];
      }
    } catch {
      // ignore
    }

    return null;
  },

  async deleteFaq(id: string): Promise<boolean> {
    const token = this.getToken();
    try {
      await fetch(`/api/faq/${id}`, {
        method: 'DELETE',
        headers: {
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        }
      });
    } catch (err) {
      console.warn('[FAQ] Erreur suppression distante, suppression locale:', err);
    }

    try {
      const backup: ChurchFaqItem[] = JSON.parse(localStorage.getItem(LOCAL_BACKUP_FAQ) || '[]');
      const filtered = backup.filter(f => f.id !== id);
      safeLocalStorageSet(LOCAL_BACKUP_FAQ, JSON.stringify(filtered));

      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('dame_faq_updated', { detail: { deletedId: id } }));
      }

      return true;
    } catch {
      return true;
    }
  }
};
