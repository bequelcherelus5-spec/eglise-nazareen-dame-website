import fs from 'fs';
import path from 'path';

export type SubmissionCategory = 
  | 'Prayer Requests'
  | 'Contact Messages'
  | 'Document Requests'
  | 'Event Registration'
  | 'Volunteer Requests'
  | 'Donation/Giving Messages'
  | 'Newsletter Subscribers'
  | 'General Requests';

export type SubmissionStatus = 'New' | 'In progress' | 'Completed' | 'Archived';

export interface FormSubmission {
  id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  dateReceived: string; // ISO date
  category: SubmissionCategory;
  status: SubmissionStatus;
  details?: Record<string, any>;
  notes?: string;
}

export interface NewsletterSubscriber {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subscribedAt: string;
  status: 'Active' | 'Unsubscribed';
}

export interface NewsletterCampaign {
  id: string;
  title: string;
  subject: string;
  content: string;
  targetAudience: string;
  status: 'Draft' | 'Sent';
  createdAt: string;
  sentAt?: string;
}

export type PodcastCategory = 'Prédication' | 'Étude biblique' | 'Enseignement' | 'Témoignage';

export interface ChurchPodcast {
  id: string;
  title: string;
  preacher: string;
  date: string;
  category: PodcastCategory;
  description: string;
  audioUrl: string;
  duration?: string;
  coverImage?: string;
  createdAt: string;
}

const DATA_DIR = path.join(process.cwd(), 'data');
const SUBMISSIONS_FILE = path.join(DATA_DIR, 'submissions.json');
const SUBSCRIBERS_FILE = path.join(DATA_DIR, 'subscribers.json');
const CAMPAIGNS_FILE = path.join(DATA_DIR, 'campaigns.json');
const PODCASTS_FILE = path.join(DATA_DIR, 'podcasts.json');

// Ensure directory and files exist
function initDb() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (!fs.existsSync(SUBMISSIONS_FILE)) {
    // Seed with realistic church secretary data
    const seedSubmissions: FormSubmission[] = [
      {
        id: 'sub-1001',
        name: 'Jean-Baptiste Saint-Juste',
        email: 'jb.stjuste@example.com',
        phone: '+509 3812 4578',
        message: 'Demande urgente de certificat de baptême pour dossier de mariage civil.',
        dateReceived: new Date(Date.now() - 3600000 * 2).toISOString(),
        category: 'Document Requests',
        status: 'New',
        details: {
          documentType: 'Certificat de baptême',
          approxBaptismYear: '2014'
        },
        notes: ''
      },
      {
        id: 'sub-1002',
        name: 'Marie Nicole Faustin',
        email: 'mn.faustin@example.com',
        phone: '+509 4678 9012',
        message: 'Prière pour ma mère hospitalisée à Port-de-Paix pour une crise d’hypertension.',
        dateReceived: new Date(Date.now() - 3600000 * 8).toISOString(),
        category: 'Prayer Requests',
        status: 'In progress',
        details: {
          confidential: true,
          category: 'Santé & Guérison'
        },
        notes: 'Transmis au Pasteur Bequel pour la prière du vendredi soir.'
      },
      {
        id: 'sub-1003',
        name: 'Claudel Joseph',
        email: 'claudel.j@example.com',
        phone: '+509 3456 7890',
        message: 'Demande d’attestation de membre régulier pour admission académique.',
        dateReceived: new Date(Date.now() - 3600000 * 24).toISOString(),
        category: 'Document Requests',
        status: 'In progress',
        details: {
          documentType: 'Attestation de membre',
          membershipYears: 'Depuis 2018'
        },
        notes: 'En cours de signature par le secrétariat.'
      },
      {
        id: 'sub-1004',
        name: 'Guerline Dumesle',
        email: 'guerline.d@example.com',
        phone: '+509 4233 1188',
        message: 'Inscription au programme de formation en couture de l’École Professionnelle EPND.',
        dateReceived: new Date(Date.now() - 3600000 * 48).toISOString(),
        category: 'Event Registration',
        status: 'Completed',
        details: {
          program: 'Couture Industrielle',
          session: 'Session 2026'
        },
        notes: 'Dossier validé, frais d’inscription enregistrés.'
      },
      {
        id: 'sub-1005',
        name: 'Wilfrid Saint-Fleur',
        email: 'w.saintfleur@example.com',
        phone: '+509 3788 9900',
        message: 'Proposition de bénévolat pour l’animation musicale des jeunes JNI.',
        dateReceived: new Date(Date.now() - 3600000 * 72).toISOString(),
        category: 'Volunteer Requests',
        status: 'Completed',
        details: {
          competence: 'Guitare & Chorale'
        },
        notes: 'Entretien réalisé avec Jimmy Cherelus.'
      }
    ];
    fs.writeFileSync(SUBMISSIONS_FILE, JSON.stringify(seedSubmissions, null, 2), 'utf-8');
  }

  if (!fs.existsSync(SUBSCRIBERS_FILE)) {
    const seedSubscribers: NewsletterSubscriber[] = [
      {
        id: 'sub-nl-1',
        name: 'Dieudonné Pierre',
        email: 'dieudonne.p@example.com',
        subscribedAt: new Date(Date.now() - 86400000 * 15).toISOString(),
        status: 'Active'
      },
      {
        id: 'sub-nl-2',
        name: 'Esther Augustin',
        email: 'esther.aug@example.com',
        subscribedAt: new Date(Date.now() - 86400000 * 7).toISOString(),
        status: 'Active'
      },
      {
        id: 'sub-nl-3',
        name: 'Roseline Chery',
        email: 'roseline.chery@example.com',
        subscribedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
        status: 'Active'
      }
    ];
    fs.writeFileSync(SUBSCRIBERS_FILE, JSON.stringify(seedSubscribers, null, 2), 'utf-8');
  }

  if (!fs.existsSync(CAMPAIGNS_FILE)) {
    const seedCampaigns: NewsletterCampaign[] = [
      {
        id: 'camp-1',
        title: 'Bulletin Mensuel — Février 2026',
        subject: 'Nouvelles de l’Église du Nazaréen de Damé & Projets en cours',
        content: 'Chers frères et sœurs en Christ, voici les nouvelles récentes de notre paroisse, l’avancement du projet caprin et le calendrier des cultes...',
        targetAudience: 'Tous les membres et sympathisants',
        status: 'Sent',
        createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
        sentAt: new Date(Date.now() - 86400000 * 9).toISOString()
      }
    ];
    fs.writeFileSync(CAMPAIGNS_FILE, JSON.stringify(seedCampaigns, null, 2), 'utf-8');
  }

  if (!fs.existsSync(PODCASTS_FILE)) {
    const sampleAudio = generateSampleWavAudio();
    const seedPodcasts: ChurchPodcast[] = [
      {
        id: 'pod-1',
        title: 'La Sainteté de Dieu et la Sanctification du Croyant',
        preacher: 'Pasteur Bequel CHERELUS',
        date: 'Dimanche 1 Mars 2026',
        category: 'Prédication',
        description: 'Message dominical d’édification sur le thème d’Hébreux 12:14. Comment marcher chaque jour dans la sainteté et la fidélité selon la doctrine nazaréenne.',
        audioUrl: sampleAudio,
        duration: '28:15',
        coverImage: '/images/pasteur_bequel.jpg',
        createdAt: new Date(Date.now() - 86400000 * 5).toISOString()
      },
      {
        id: 'pod-2',
        title: 'L’Héritage Spirituel de Damé : Fidélité et Compassion',
        preacher: 'Pasteur Saurel ALCINÉ & Pasteur Bequel CHERELUS',
        date: 'Dimanche 15 Février 2026',
        category: 'Enseignement',
        description: 'Rappel des fondements historiques de notre paroisse fondée en 1979 à Damé, et l’importance de l’amour pratique à travers nos œuvres éducatives et sociales.',
        audioUrl: sampleAudio,
        duration: '34:40',
        coverImage: '/images/dame_facade.jpg',
        createdAt: new Date(Date.now() - 86400000 * 18).toISOString()
      },
      {
        id: 'pod-3',
        title: 'Les Béatitudes : Vivre le Royaume de Dieu au Quotidien',
        preacher: 'Frère Jimmy CHERELUS (Jeunesse JNI)',
        date: 'Mercredi 25 Février 2026',
        category: 'Étude biblique',
        description: 'Étude doctrinale de Matthieu 5:1-12 avec les jeunes de la JNI de Damé. Une foi active et persévérante au cœur des réalités d’Haïti.',
        audioUrl: sampleAudio,
        duration: '24:20',
        coverImage: '/images/photo1.jpg',
        createdAt: new Date(Date.now() - 86400000 * 9).toISOString()
      },
      {
        id: 'pod-4',
        title: 'Témoignage de Grâce et de Délivrance à Damé',
        preacher: 'Comité des Dames & Conseil Paroissial',
        date: 'Dimanche 8 Février 2026',
        category: 'Témoignage',
        description: 'Action de grâce pour les bénédictions divines, la guérison et le soutien apporté aux familles et aux enfants de l’école Nazareth.',
        audioUrl: sampleAudio,
        duration: '19:50',
        coverImage: '/images/photo2.jpg',
        createdAt: new Date(Date.now() - 86400000 * 26).toISOString()
      }
    ];
    fs.writeFileSync(PODCASTS_FILE, JSON.stringify(seedPodcasts, null, 2), 'utf-8');
  }
}

// Generate valid WAV audio tone for built-in sample sermons
function generateSampleWavAudio(): string {
  const sampleRate = 8000;
  const numSamples = sampleRate * 3; // 3 seconds preview tone
  const buffer = Buffer.alloc(44 + numSamples * 2);

  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + numSamples * 2, 4);
  buffer.write('WAVE', 8);
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20); // PCM
  buffer.writeUInt16LE(1, 22); // mono
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(sampleRate * 2, 28);
  buffer.writeUInt16LE(2, 32);
  buffer.writeUInt16LE(16, 34);
  buffer.write('data', 36);
  buffer.writeUInt32LE(numSamples * 2, 40);

  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    const envelope = Math.exp(-t * 0.9);
    const sample = Math.sin(2 * Math.PI * 261.63 * t) * 0.4 +
                   Math.sin(2 * Math.PI * 329.63 * t) * 0.3 +
                   Math.sin(2 * Math.PI * 392.00 * t) * 0.3;
    const val = Math.floor(sample * envelope * 20000);
    buffer.writeInt16LE(Math.max(-32768, Math.min(32767, val)), 44 + i * 2);
  }

  return `data:audio/wav;base64,${buffer.toString('base64')}`;
}

initDb();

function readJson<T>(filePath: string): T {
  try {
    const raw = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    return [] as unknown as T;
  }
}

function writeJson<T>(filePath: string, data: T): void {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing to DB file:', filePath, err);
  }
}

// Submissions API
export const dbSubmissions = {
  getAll: (filters?: { category?: string; status?: string; search?: string }): FormSubmission[] => {
    let items = readJson<FormSubmission[]>(SUBMISSIONS_FILE);
    if (filters?.category && filters.category !== 'All') {
      items = items.filter(i => i.category === filters.category);
    }
    if (filters?.status && filters.status !== 'All') {
      items = items.filter(i => i.status === filters.status);
    }
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      items = items.filter(i => 
        i.name.toLowerCase().includes(q) ||
        i.email.toLowerCase().includes(q) ||
        (i.phone && i.phone.toLowerCase().includes(q)) ||
        i.message.toLowerCase().includes(q)
      );
    }
    // Sort most recent first
    return items.sort((a, b) => new Date(b.dateReceived).getTime() - new Date(a.dateReceived).getTime());
  },

  getById: (id: string): FormSubmission | undefined => {
    const items = readJson<FormSubmission[]>(SUBMISSIONS_FILE);
    return items.find(i => i.id === id);
  },

  create: (item: Omit<FormSubmission, 'id' | 'dateReceived' | 'status'> & { status?: SubmissionStatus }): FormSubmission => {
    const items = readJson<FormSubmission[]>(SUBMISSIONS_FILE);
    const newSubmission: FormSubmission = {
      ...item,
      id: `sub-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      dateReceived: new Date().toISOString(),
      status: item.status || 'New',
      notes: item.notes || ''
    };
    items.unshift(newSubmission);
    writeJson(SUBMISSIONS_FILE, items);
    return newSubmission;
  },

  update: (id: string, updates: Partial<FormSubmission>): FormSubmission | null => {
    const items = readJson<FormSubmission[]>(SUBMISSIONS_FILE);
    const idx = items.findIndex(i => i.id === id);
    if (idx === -1) return null;
    items[idx] = { ...items[idx], ...updates };
    writeJson(SUBMISSIONS_FILE, items);
    return items[idx];
  },

  delete: (id: string): boolean => {
    const items = readJson<FormSubmission[]>(SUBMISSIONS_FILE);
    const filtered = items.filter(i => i.id !== id);
    if (filtered.length === items.length) return false;
    writeJson(SUBMISSIONS_FILE, filtered);
    return true;
  },

  getStats: () => {
    const items = readJson<FormSubmission[]>(SUBMISSIONS_FILE);
    const subscribers = readJson<NewsletterSubscriber[]>(SUBSCRIBERS_FILE);

    return {
      totalMessages: items.length,
      newRequests: items.filter(i => i.status === 'New').length,
      inProgressRequests: items.filter(i => i.status === 'In progress').length,
      completedRequests: items.filter(i => i.status === 'Completed').length,
      prayerRequests: items.filter(i => i.category === 'Prayer Requests').length,
      documentRequests: items.filter(i => i.category === 'Document Requests').length,
      newDocumentRequests: items.filter(i => i.category === 'Document Requests' && i.status === 'New').length,
      newsletterSubscribers: subscribers.filter(s => s.status === 'Active').length,
      byCategory: {
        prayer: items.filter(i => i.category === 'Prayer Requests').length,
        contact: items.filter(i => i.category === 'Contact Messages').length,
        documents: items.filter(i => i.category === 'Document Requests').length,
        events: items.filter(i => i.category === 'Event Registration').length,
        volunteers: items.filter(i => i.category === 'Volunteer Requests').length,
        donations: items.filter(i => i.category === 'Donation/Giving Messages').length,
        general: items.filter(i => i.category === 'General Requests').length,
      }
    };
  }
};

// Subscribers API
export const dbSubscribers = {
  getAll: (): NewsletterSubscriber[] => {
    return readJson<NewsletterSubscriber[]>(SUBSCRIBERS_FILE);
  },

  add: (name: string, email: string, phone?: string): { subscriber: NewsletterSubscriber; isNew: boolean } => {
    const items = readJson<NewsletterSubscriber[]>(SUBSCRIBERS_FILE);
    const cleanEmail = email.trim().toLowerCase();
    const existing = items.find(s => s.email.toLowerCase() === cleanEmail);
    if (existing) {
      if (existing.status === 'Unsubscribed') {
        existing.status = 'Active';
      }
      if (phone && !existing.phone) {
        existing.phone = phone.trim();
      }
      writeJson(SUBSCRIBERS_FILE, items);
      return { subscriber: existing, isNew: false };
    }

    const newSub: NewsletterSubscriber = {
      id: `nl-${Date.now()}`,
      name: name.trim() || 'Abonné Paroisse',
      email: cleanEmail,
      phone: phone ? phone.trim() : undefined,
      subscribedAt: new Date().toISOString(),
      status: 'Active'
    };
    items.unshift(newSub);
    writeJson(SUBSCRIBERS_FILE, items);

    // Also register as a submission in form management
    dbSubmissions.create({
      name: newSub.name,
      email: newSub.email,
      phone: newSub.phone,
      message: `Nouvel abonnement à la newsletter paroissiale : ${newSub.email}${newSub.phone ? ` (${newSub.phone})` : ''}`,
      category: 'Newsletter Subscribers',
      status: 'New',
      details: { email: newSub.email, phone: newSub.phone }
    });

    return { subscriber: newSub, isNew: true };
  },

  exportCsv: (): string => {
    const items = readJson<NewsletterSubscriber[]>(SUBSCRIBERS_FILE);
    const header = 'ID,Nom,Email,Téléphone,Date Inscription,Statut\n';
    const rows = items.map(i => `"${i.id}","${i.name}","${i.email}","${i.phone || ''}","${i.subscribedAt}","${i.status}"`).join('\n');
    return header + rows;
  }
};

// Campaigns API
export const dbCampaigns = {
  getAll: (): NewsletterCampaign[] => {
    return readJson<NewsletterCampaign[]>(CAMPAIGNS_FILE);
  },

  create: (item: Omit<NewsletterCampaign, 'id' | 'createdAt'>): NewsletterCampaign => {
    const items = readJson<NewsletterCampaign[]>(CAMPAIGNS_FILE);
    const newCampaign: NewsletterCampaign = {
      ...item,
      id: `camp-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    items.unshift(newCampaign);
    writeJson(CAMPAIGNS_FILE, items);
    return newCampaign;
  }
};

// Podcasts API
export const dbPodcasts = {
  getAll: (): ChurchPodcast[] => {
    const items = readJson<ChurchPodcast[]>(PODCASTS_FILE);
    return items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  getById: (id: string): ChurchPodcast | undefined => {
    const items = readJson<ChurchPodcast[]>(PODCASTS_FILE);
    return items.find(p => p.id === id);
  },

  create: (podcast: Omit<ChurchPodcast, 'id' | 'createdAt'>): ChurchPodcast => {
    const items = readJson<ChurchPodcast[]>(PODCASTS_FILE);
    const newPodcast: ChurchPodcast = {
      ...podcast,
      id: `pod-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    items.unshift(newPodcast);
    writeJson(PODCASTS_FILE, items);
    return newPodcast;
  },

  delete: (id: string): boolean => {
    const items = readJson<ChurchPodcast[]>(PODCASTS_FILE);
    const filtered = items.filter(p => p.id !== id);
    if (filtered.length === items.length) return false;
    writeJson(PODCASTS_FILE, filtered);
    return true;
  }
};
