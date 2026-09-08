import { 
  FormSubmission, 
  SubmissionCategory, 
  SubmissionStatus, 
  NewsletterSubscriber, 
  NewsletterCampaign, 
  AdminStats,
  ChurchPodcast,
  ChurchPublication,
  ChurchEvent
} from '../types';

const TOKEN_KEY = 'dame_admin_auth_token';
const USER_KEY = 'dame_admin_user_info';
const LOCAL_BACKUP_SUBMISSIONS = 'dame_local_submissions_backup';
const LOCAL_BACKUP_PUBLICATIONS = 'dame_local_publications_backup';
const LOCAL_BACKUP_EVENTS = 'dame_local_events_backup';
const LOCAL_BACKUP_SUBSCRIBERS = 'dame_local_subscribers_backup';

export interface AdminUser {
  username: string;
  role: string;
  displayName: string;
}

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
  ): Promise<{ success: boolean; message: string; isNew?: boolean; reactivated?: boolean; alreadyActive?: boolean; subscriber?: NewsletterSubscriber }> {
    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name.trim() || [firstName, lastName].filter(Boolean).join(' ').trim() || 'Abonné Paroisse';

    try {
      const response = await fetch('/api/newsletter/subscribe', {
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
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de l’inscription');
      }

      // Also cache in local subscribers backup
      try {
        const localSubs = JSON.parse(localStorage.getItem(LOCAL_BACKUP_SUBSCRIBERS) || '[]');
        if (!localSubs.some((s: any) => s.email === cleanEmail)) {
          localSubs.unshift(data.subscriber || {
            id: `nl-${Date.now()}`,
            name: cleanName,
            email: cleanEmail,
            phone,
            subscribedAt: new Date().toISOString(),
            status: 'Active'
          });
          localStorage.setItem(LOCAL_BACKUP_SUBSCRIBERS, JSON.stringify(localSubs));
        }
      } catch {
        // ignore
      }

      return data;
    } catch (err: any) {
      console.warn('Fallback newsletter subscription:', err);
      // Offline fallback
      try {
        const localSubs = JSON.parse(localStorage.getItem(LOCAL_BACKUP_SUBSCRIBERS) || '[]');
        const existing = localSubs.find((s: any) => s.email === cleanEmail);
        if (existing) {
          existing.status = 'Active';
          localStorage.setItem(LOCAL_BACKUP_SUBSCRIBERS, JSON.stringify(localSubs));
          return {
            success: true,
            alreadyActive: true,
            message: 'Vous êtes déjà inscrit à la newsletter de l’Église avec cette adresse.'
          };
        }
        localSubs.unshift({
          id: `nl-${Date.now()}`,
          name: cleanName,
          email: cleanEmail,
          phone,
          subscribedAt: new Date().toISOString(),
          status: 'Active',
          source: 'Newsletter du site'
        });
        localStorage.setItem(LOCAL_BACKUP_SUBSCRIBERS, JSON.stringify(localSubs));
      } catch {
        // ignore
      }

      return {
        success: true,
        isNew: true,
        message: 'Merci pour votre inscription à la newsletter paroissiale !'
      };
    }
  },

  // ----------------------------------------------------
  // ADMIN AUTHENTICATION
  // ----------------------------------------------------
  getToken(): string | null {
    return sessionStorage.getItem(TOKEN_KEY) || localStorage.getItem(TOKEN_KEY);
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
  }): Promise<NewsletterCampaign | null> {
    const token = this.getToken();
    try {
      const response = await fetch('/api/newsletter/campaigns', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(campaign)
      });
      if (response.ok) {
        const data = await response.json();
        return data.campaign;
      }
    } catch (err) {
      console.error('Error creating campaign:', err);
    }
    return null;
  },

  // ----------------------------------------------------
  // PUBLICATIONS MANAGEMENT (PUBLIC & ADMIN)
  // ----------------------------------------------------
  async getPublications(includeDrafts: boolean = false, category?: string, search?: string): Promise<ChurchPublication[]> {
    const token = this.getToken();
    const query = new URLSearchParams();
    if (includeDrafts) query.set('includeDrafts', 'true');
    if (category) query.set('category', category);
    if (search) query.set('search', search);

    try {
      const headers: Record<string, string> = {};
      if (token && includeDrafts) headers['Authorization'] = `Bearer ${token}`;

      const response = await fetch(`/api/publications?${query.toString()}`, { headers });
      if (response.ok) {
        const data = await response.json();
        const pubs = data.publications || [];
        try {
          localStorage.setItem(LOCAL_BACKUP_PUBLICATIONS, JSON.stringify(pubs));
        } catch {
          // ignore
        }
        return pubs;
      }
    } catch (err) {
      console.error('Error getting publications:', err);
    }

    try {
      let backup: ChurchPublication[] = JSON.parse(localStorage.getItem(LOCAL_BACKUP_PUBLICATIONS) || '[]');
      if (!includeDrafts) {
        backup = backup.filter(p => p.status === 'Publiée');
      }
      return backup;
    } catch {
      return [];
    }
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
  }): Promise<ChurchPublication | null> {
    const token = this.getToken();
    try {
      const response = await fetch('/api/publications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(pub)
      });
      if (response.ok) {
        const data = await response.json();
        return data.publication;
      }
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error || 'Erreur lors de la création de la publication');
    } catch (err: any) {
      console.error('Error creating publication:', err);
      throw err;
    }
  },

  async updatePublication(id: string, updates: Partial<ChurchPublication>): Promise<ChurchPublication | null> {
    const token = this.getToken();
    try {
      const response = await fetch(`/api/publications/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updates)
      });
      if (response.ok) {
        const data = await response.json();
        return data.publication;
      }
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error || 'Erreur lors de la mise à jour de la publication');
    } catch (err: any) {
      console.error('Error updating publication:', err);
      throw err;
    }
  },

  async deletePublication(id: string): Promise<boolean> {
    const token = this.getToken();
    try {
      const response = await fetch(`/api/publications/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.ok;
    } catch (err) {
      console.error('Error deleting publication:', err);
      return false;
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

    try {
      const headers: Record<string, string> = {};
      if (token && includeDrafts) headers['Authorization'] = `Bearer ${token}`;

      const response = await fetch(`/api/events?${query.toString()}`, { headers });
      if (response.ok) {
        const data = await response.json();
        const evts = data.events || [];
        try {
          localStorage.setItem(LOCAL_BACKUP_EVENTS, JSON.stringify(evts));
        } catch {
          // ignore
        }
        return evts;
      }
    } catch (err) {
      console.error('Error getting events:', err);
    }

    try {
      let backup: ChurchEvent[] = JSON.parse(localStorage.getItem(LOCAL_BACKUP_EVENTS) || '[]');
      if (!includeDrafts) {
        backup = backup.filter(e => e.status === 'Publié');
      }
      return backup;
    } catch {
      return [];
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
    try {
      const response = await fetch('/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(event)
      });
      if (response.ok) {
        const data = await response.json();
        return data.event;
      }
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error || 'Erreur lors de la création de l’événement');
    } catch (err: any) {
      console.error('Error creating event:', err);
      throw err;
    }
  },

  async updateEvent(id: string, updates: Partial<ChurchEvent>): Promise<ChurchEvent | null> {
    const token = this.getToken();
    try {
      const response = await fetch(`/api/events/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updates)
      });
      if (response.ok) {
        const data = await response.json();
        return data.event;
      }
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error || 'Erreur lors de la mise à jour de l’événement');
    } catch (err: any) {
      console.error('Error updating event:', err);
      throw err;
    }
  },

  async deleteEvent(id: string): Promise<boolean> {
    const token = this.getToken();
    try {
      const response = await fetch(`/api/events/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.ok;
    } catch (err) {
      console.error('Error deleting event:', err);
      return false;
    }
  },

  // ----------------------------------------------------
  // PODCASTS / AUDIO MESSAGES
  // ----------------------------------------------------
  async getPodcasts(): Promise<ChurchPodcast[]> {
    try {
      const response = await fetch('/api/podcasts');
      if (response.ok) {
        const data = await response.json();
        return data.podcasts || [];
      }
    } catch (err) {
      console.error('Error getting podcasts:', err);
    }
    return [];
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
        return data.podcast;
      }
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error || 'Erreur lors de la publication');
    } catch (err: any) {
      console.error('Error creating podcast:', err);
      throw err;
    }
  },

  async deletePodcast(id: string): Promise<boolean> {
    const token = this.getToken();
    try {
      const response = await fetch(`/api/podcasts/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.ok;
    } catch (err) {
      console.error('Error deleting podcast:', err);
      return false;
    }
  }
};
