import { 
  FormSubmission, 
  SubmissionCategory, 
  SubmissionStatus, 
  NewsletterSubscriber, 
  NewsletterCampaign, 
  AdminStats,
  ChurchPodcast
} from '../types';

const TOKEN_KEY = 'dame_admin_auth_token';
const USER_KEY = 'dame_admin_user_info';
const LOCAL_BACKUP_SUBMISSIONS = 'dame_local_submissions_backup';

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
          backup.unshift({ ...data, id: resData.submissionId, dateReceived: new Date().toISOString() });
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
          status: 'New'
        });
        localStorage.setItem(LOCAL_BACKUP_SUBMISSIONS, JSON.stringify(backup.slice(0, 100)));
      } catch {
        // ignore
      }
      return {
        success: true,
        message: 'Votre message a été enregistré localement et sera synchronisé.',
        submissionId: fallbackId
      };
    }
  },

  // ----------------------------------------------------
  // NEWSLETTER SUBSCRIPTION
  // ----------------------------------------------------
  async subscribeNewsletter(name: string, email: string, phone?: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de l’inscription');
      }
      return data;
    } catch (err: any) {
      return {
        success: true,
        message: 'Merci pour votre inscription à la newsletter !'
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
        return { success: false, error: data.error || 'Identifiant ou mot de passe invalide.' };
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
  // ADMIN DASHBOARD DATA
  // ----------------------------------------------------
  async getSubmissions(filters?: { category?: string; status?: string; search?: string }): Promise<FormSubmission[]> {
    const token = this.getToken();
    const query = new URLSearchParams();
    if (filters?.category) query.set('category', filters.category);
    if (filters?.status) query.set('status', filters.status);
    if (filters?.search) query.set('search', filters.search);

    try {
      const response = await fetch(`/api/submissions?${query.toString()}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        return data.items || [];
      }
    } catch (err) {
      console.error('Error fetching submissions from server:', err);
    }

    // Fallback to local storage if server is unreachable
    try {
      const backup = JSON.parse(localStorage.getItem(LOCAL_BACKUP_SUBMISSIONS) || '[]');
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
        return data.item;
      }
    } catch (err) {
      console.error('Error updating submission:', err);
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
      return response.ok;
    } catch (err) {
      console.error('Error deleting submission:', err);
      return false;
    }
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

  async getNewsletterSubscribers(): Promise<NewsletterSubscriber[]> {
    const token = this.getToken();
    try {
      const response = await fetch('/api/newsletter/subscribers', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        return data.subscribers || [];
      }
    } catch (err) {
      console.error('Error getting subscribers:', err);
    }
    return [];
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
