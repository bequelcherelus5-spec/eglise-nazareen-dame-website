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

export type SubmissionStatus = 
  | 'En attente' 
  | 'En cours' 
  | 'Approuvée' 
  | 'Refusée' 
  | 'Terminée' 
  | 'New' 
  | 'In progress' 
  | 'Completed' 
  | 'Archived';

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
  firstName?: string;
  lastName?: string;
  email: string;
  phone?: string;
  subscribedAt: string;
  status: 'Active' | 'Unsubscribed';
  source?: string;
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

export type PublicationStatus = 'Brouillon' | 'En attente' | 'Publiée' | 'Archivée';

export interface ChurchPublication {
  id: string;
  title: string;
  content: string;
  summary: string;
  image: string;
  category: string;
  author: string;
  date: string;
  status: PublicationStatus;
  createdAt: string;
  updatedAt?: string;
}

export type EventStatus = 'Brouillon' | 'Publié' | 'Terminé' | 'Annulé';

export interface ChurchEvent {
  id: string;
  title: string;
  description: string;
  image: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  organizer: string;
  category: string;
  status: EventStatus;
  createdAt: string;
  highlight?: boolean;
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
const PUBLICATIONS_FILE = path.join(DATA_DIR, 'publications.json');
const EVENTS_FILE = path.join(DATA_DIR, 'events.json');

// Ensure directory and files exist
function initDb() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (!fs.existsSync(SUBMISSIONS_FILE)) {
    const seedSubmissions: FormSubmission[] = [
      {
        id: 'sub-1001',
        name: 'Jean-Baptiste Saint-Juste',
        email: 'jb.stjuste@example.com',
        phone: '+509 3812 4578',
        message: 'Demande urgente de certificat de baptême pour dossier de mariage civil.',
        dateReceived: new Date(Date.now() - 3600000 * 2).toISOString(),
        category: 'Document Requests',
        status: 'En attente',
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
        status: 'En cours',
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
        status: 'Approuvée',
        details: {
          documentType: 'Attestation de membre',
          membershipYears: 'Depuis 2018'
        },
        notes: 'Signé par le secrétariat, prêt à la remise.'
      },
      {
        id: 'sub-1004',
        name: 'Guerline Dumesle',
        email: 'guerline.d@example.com',
        phone: '+509 4233 1188',
        message: 'Inscription au programme de formation en couture de l’École Professionnelle EPND.',
        dateReceived: new Date(Date.now() - 3600000 * 48).toISOString(),
        category: 'Event Registration',
        status: 'Terminée',
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
        status: 'Terminée',
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
        firstName: 'Dieudonné',
        lastName: 'Pierre',
        email: 'dieudonne.p@example.com',
        subscribedAt: new Date(Date.now() - 86400000 * 15).toISOString(),
        status: 'Active',
        source: 'Newsletter du site'
      },
      {
        id: 'sub-nl-2',
        name: 'Esther Augustin',
        firstName: 'Esther',
        lastName: 'Augustin',
        email: 'esther.aug@example.com',
        subscribedAt: new Date(Date.now() - 86400000 * 7).toISOString(),
        status: 'Active',
        source: 'Newsletter du site'
      },
      {
        id: 'sub-nl-3',
        name: 'Roseline Chery',
        firstName: 'Roseline',
        lastName: 'Chery',
        email: 'roseline.chery@example.com',
        subscribedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
        status: 'Active',
        source: 'Newsletter du site'
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

  // Initialize Publications File
  if (!fs.existsSync(PUBLICATIONS_FILE)) {
    const seedPublications: ChurchPublication[] = [
      {
        id: 'pub-1',
        title: '47 Ans de Grâce Divine et de Mission à Damé (1979 - 2026)',
        summary: 'Retour sur les origines bénies de l’Église du Nazaréen de Damé, fondée par Saurel ALCINÉ et fortifiée par le Pasteur Bequel CHERELUS.',
        content: 'Depuis sa fondation le 23 décembre 1979 sous la direction de Saurel ALCINÉ, l’Église du Nazaréen de Damé s’est affirmée comme un phare spirituel, éducatif et communautaire incontournable au sein du District Bas Nord-Ouest d’Haïti. Aujourd’hui guidée avec ferveur par le Pasteur Bequel CHERELUS, elle poursuit sa vocation : sanctification, éducation chrétienne et compassion pour chaque famille de notre communauté.',
        image: '/images/dame_facade.jpg',
        category: 'Histoire & Foi',
        author: 'Pasteur Bequel CHERELUS',
        date: '2026-03-01',
        status: 'Publiée',
        createdAt: new Date(Date.now() - 86400000 * 7).toISOString()
      },
      {
        id: 'pub-2',
        title: 'Rentrée Académique de l’École Nazareth & de l’EPND',
        summary: 'Nos élèves de la 1ère à la 9ème Année Fondamentale et nos étudiants des filières techniques reprennent leurs activités.',
        content: 'L’éducation est au cœur de l’engagement chrétien de notre paroisse. L’École Nazareth accueille plus de 450 élèves avec un encadrement rigoureux et des cours bibliques, tandis que l’École Professionnelle EPND forme les jeunes en couture, électricité, informatique et maçonnerie.',
        image: '/images/photo2.jpg',
        category: 'Éducation',
        author: 'Direction Pédagogique',
        date: '2026-02-15',
        status: 'Publiée',
        createdAt: new Date(Date.now() - 86400000 * 20).toISOString()
      },
      {
        id: 'pub-3',
        title: 'Projet Caprin & Soutien Agricole aux Familles Vulnérables',
        summary: 'Bilan de notre initiative de solidarité et d’autonomisation économique en faveur des cultivateurs et veuves de Damé.',
        content: 'Grâce au partenariat avec nos bienfaiteurs et la mobilisation du Conseil Paroissial, plus de 60 familles ont reçu des têtes de bétail pour renforcer la sécurité alimentaire de notre localité.',
        image: '/images/photo1.jpg',
        category: 'Solidarité',
        author: 'Comité de Secours et de Développement',
        date: '2026-01-28',
        status: 'Publiée',
        createdAt: new Date(Date.now() - 86400000 * 40).toISOString()
      }
    ];
    fs.writeFileSync(PUBLICATIONS_FILE, JSON.stringify(seedPublications, null, 2), 'utf-8');
  }

  // Initialize Events File
  if (!fs.existsSync(EVENTS_FILE)) {
    const seedEvents: ChurchEvent[] = [
      {
        id: 'evt-1',
        title: 'Célébration Anniversaire de la Fondation (1979 - 2026)',
        description: 'Grand culte d\'action de grâce commémorant la fondation de l\'Église par Saurel ALCINÉ le 23 décembre 1979. Témoignages, chorales d\'hommes et prédication de sainteté.',
        image: '/images/dame_facade.jpg',
        date: '2026-12-23',
        startTime: '08:00',
        endTime: '13:00',
        location: 'Sanctuaire Principal, Rue Cimetière Damé',
        organizer: 'Conseil Paroissial & Pasteur Bequel CHERELUS',
        category: 'Anniversaire & Héritage',
        status: 'Publié',
        highlight: true,
        createdAt: new Date(Date.now() - 86400000 * 15).toISOString()
      },
      {
        id: 'evt-2',
        title: 'Campagne d\'Évangélisation & Réveil Spirituel de Pâques',
        description: 'Quatre soirées de proclamation évangélique, de prière de délivrance et de chants avec les chorales du District Bas Nord-Ouest.',
        image: '/images/photo1.jpg',
        date: '2026-04-10',
        startTime: '18:00',
        endTime: '20:30',
        location: 'Cour paysagère de l\'Église & Sanctuaire',
        organizer: 'Comité d\'Évangélisation & Jeunesse JNI',
        category: 'Évangélisation',
        status: 'Publié',
        highlight: false,
        createdAt: new Date(Date.now() - 86400000 * 10).toISOString()
      },
      {
        id: 'evt-3',
        title: 'Convention Annuelle du District Bas Nord-Ouest',
        description: 'Rassemblement des pasteurs, délégués laïcs et membres des églises nazaréennes de tout le Nord-Ouest pour la formation et le rapport de district.',
        image: '/images/pasteur_bequel.jpg',
        date: '2026-07-15',
        startTime: '09:00',
        endTime: '16:00',
        location: 'Môle-Saint-Nicolas / Damé',
        organizer: 'Surintendance de District & Conseil',
        category: 'District Nazaréen',
        status: 'Publié',
        highlight: false,
        createdAt: new Date(Date.now() - 86400000 * 5).toISOString()
      },
      {
        id: 'evt-4',
        title: 'Retraite Spirituelle & Camp de Jeunesse JNI',
        description: 'Temps fort de formation biblique, d\'ateliers de leadership et d\'édification chrétienne pour les jeunes de la région sous la direction de Jimmy Cherelus.',
        image: '/images/photo2.jpg',
        date: '2026-08-20',
        startTime: '08:00',
        endTime: '17:00',
        location: 'Complexe Nazareth & Église de Damé',
        organizer: 'Comité JNI de Damé',
        category: 'Jeunesse (JNI)',
        status: 'Publié',
        highlight: false,
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
      }
    ];
    fs.writeFileSync(EVENTS_FILE, JSON.stringify(seedEvents, null, 2), 'utf-8');
  }
}

// Generate valid WAV audio tone for built-in sample sermons
function generateSampleWavAudio(): string {
  const sampleRate = 8000;
  const numSamples = sampleRate * 3;
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

function normalizeSubmissionStatus(status?: string): SubmissionStatus {
  if (!status) return 'En attente';
  if (status === 'New' || status === 'Nouvelle demande') return 'En attente';
  if (status === 'In progress' || status === 'En traitement') return 'En cours';
  if (status === 'Completed' || status === 'Document prêt') return 'Terminée';
  if (status === 'Archived') return 'Refusée';
  return status as SubmissionStatus;
}

// Submissions API
export const dbSubmissions = {
  getAll: (filters?: { category?: string; status?: string; search?: string; sort?: 'recent' | 'oldest' }): FormSubmission[] => {
    let items = readJson<FormSubmission[]>(SUBMISSIONS_FILE);
    
    // Normalize existing status for backward compatibility
    items = items.map(item => ({
      ...item,
      status: normalizeSubmissionStatus(item.status)
    }));

    if (filters?.category && filters.category !== 'All' && filters.category !== 'Toutes') {
      items = items.filter(i => i.category === filters.category);
    }

    if (filters?.status && filters.status !== 'All' && filters.status !== 'Tous') {
      items = items.filter(i => i.status === filters.status);
    }

    if (filters?.search) {
      const q = filters.search.toLowerCase();
      items = items.filter(i => 
        i.name.toLowerCase().includes(q) ||
        i.email.toLowerCase().includes(q) ||
        (i.phone && i.phone.toLowerCase().includes(q)) ||
        i.message.toLowerCase().includes(q) ||
        (i.notes && i.notes.toLowerCase().includes(q))
      );
    }

    if (filters?.sort === 'oldest') {
      return items.sort((a, b) => new Date(a.dateReceived).getTime() - new Date(b.dateReceived).getTime());
    }
    return items.sort((a, b) => new Date(b.dateReceived).getTime() - new Date(a.dateReceived).getTime());
  },

  getById: (id: string): FormSubmission | undefined => {
    const items = readJson<FormSubmission[]>(SUBMISSIONS_FILE);
    const item = items.find(i => i.id === id);
    if (!item) return undefined;
    return {
      ...item,
      status: normalizeSubmissionStatus(item.status)
    };
  },

  create: (item: Omit<FormSubmission, 'id' | 'dateReceived' | 'status'> & { status?: SubmissionStatus }): FormSubmission => {
    const items = readJson<FormSubmission[]>(SUBMISSIONS_FILE);
    const newSubmission: FormSubmission = {
      ...item,
      id: `sub-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      dateReceived: new Date().toISOString(),
      status: normalizeSubmissionStatus(item.status),
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
    
    if (updates.status) {
      updates.status = normalizeSubmissionStatus(updates.status);
    }

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
    const items = readJson<FormSubmission[]>(SUBMISSIONS_FILE).map(i => ({
      ...i,
      status: normalizeSubmissionStatus(i.status)
    }));
    const subscribers = readJson<NewsletterSubscriber[]>(SUBSCRIBERS_FILE);
    const publications = readJson<ChurchPublication[]>(PUBLICATIONS_FILE);
    const events = readJson<ChurchEvent[]>(EVENTS_FILE);
    const podcasts = readJson<ChurchPodcast[]>(PODCASTS_FILE);

    return {
      totalMessages: items.length,
      newRequests: items.filter(i => i.status === 'En attente' || i.status === 'New').length,
      inProgressRequests: items.filter(i => i.status === 'En cours' || i.status === 'In progress').length,
      completedRequests: items.filter(i => i.status === 'Terminée' || i.status === 'Completed').length,
      
      // Explicit French stats for secretariat dashboard
      demandesEnAttente: items.filter(i => i.status === 'En attente' || i.status === 'New').length,
      demandesEnCours: items.filter(i => i.status === 'En cours' || i.status === 'In progress').length,
      demandesApprouvees: items.filter(i => i.status === 'Approuvée').length,
      demandesRefusees: items.filter(i => i.status === 'Refusée' || i.status === 'Archived').length,
      demandesTerminees: items.filter(i => i.status === 'Terminée' || i.status === 'Completed').length,

      prayerRequests: items.filter(i => i.category === 'Prayer Requests').length,
      documentRequests: items.filter(i => i.category === 'Document Requests').length,
      newDocumentRequests: items.filter(i => i.category === 'Document Requests' && (i.status === 'En attente' || i.status === 'New')).length,
      
      newsletterSubscribers: subscribers.filter(s => s.status === 'Active').length,
      totalSubscribers: subscribers.length,

      totalEvents: events.length,
      publishedEvents: events.filter(e => e.status === 'Publié').length,

      publicationsEnAttente: publications.filter(p => p.status === 'En attente' || p.status === 'Brouillon').length,
      publicationsPubliees: publications.filter(p => p.status === 'Publiée').length,
      podcastsCount: podcasts.length,

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
  getAll: (search?: string): NewsletterSubscriber[] => {
    let items = readJson<NewsletterSubscriber[]>(SUBSCRIBERS_FILE);
    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      items = items.filter(s => 
        s.name.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q) ||
        (s.phone && s.phone.toLowerCase().includes(q))
      );
    }
    return items.sort((a, b) => new Date(b.subscribedAt).getTime() - new Date(a.subscribedAt).getTime());
  },

  getById: (id: string): NewsletterSubscriber | undefined => {
    const items = readJson<NewsletterSubscriber[]>(SUBSCRIBERS_FILE);
    return items.find(s => s.id === id);
  },

  add: (
    fullName: string, 
    email: string, 
    phone?: string,
    firstName?: string,
    lastName?: string
  ): { subscriber: NewsletterSubscriber; isNew: boolean; reactivated: boolean; alreadyActive: boolean } => {
    const items = readJson<NewsletterSubscriber[]>(SUBSCRIBERS_FILE);
    const cleanEmail = email.trim().toLowerCase();
    const existing = items.find(s => s.email.toLowerCase() === cleanEmail);
    
    if (existing) {
      if (existing.status === 'Unsubscribed') {
        existing.status = 'Active';
        if (fullName && (!existing.name || existing.name === 'Abonné Paroisse')) existing.name = fullName.trim();
        if (phone && !existing.phone) existing.phone = phone.trim();
        writeJson(SUBSCRIBERS_FILE, items);
        return { subscriber: existing, isNew: false, reactivated: true, alreadyActive: false };
      }
      return { subscriber: existing, isNew: false, reactivated: false, alreadyActive: true };
    }

    const trimmedName = fullName.trim() || [firstName, lastName].filter(Boolean).join(' ').trim() || 'Abonné Paroisse';

    const newSub: NewsletterSubscriber = {
      id: `nl-${Date.now()}`,
      name: trimmedName,
      firstName: firstName ? firstName.trim() : undefined,
      lastName: lastName ? lastName.trim() : undefined,
      email: cleanEmail,
      phone: phone ? phone.trim() : undefined,
      subscribedAt: new Date().toISOString(),
      status: 'Active',
      source: 'Newsletter du site'
    };
    items.unshift(newSub);
    writeJson(SUBSCRIBERS_FILE, items);

    // Also register as a submission for secretary tracking
    dbSubmissions.create({
      name: newSub.name,
      email: newSub.email,
      phone: newSub.phone,
      message: `Nouvel abonnement à la newsletter paroissiale : ${newSub.email}${newSub.phone ? ` (${newSub.phone})` : ''}`,
      category: 'Newsletter Subscribers',
      status: 'En attente',
      details: { email: newSub.email, phone: newSub.phone, source: 'Newsletter du site' }
    });

    return { subscriber: newSub, isNew: true, reactivated: false, alreadyActive: false };
  },

  updateStatus: (id: string, status: 'Active' | 'Unsubscribed'): NewsletterSubscriber | null => {
    const items = readJson<NewsletterSubscriber[]>(SUBSCRIBERS_FILE);
    const idx = items.findIndex(s => s.id === id);
    if (idx === -1) return null;
    items[idx].status = status;
    writeJson(SUBSCRIBERS_FILE, items);
    return items[idx];
  },

  delete: (id: string): boolean => {
    const items = readJson<NewsletterSubscriber[]>(SUBSCRIBERS_FILE);
    const filtered = items.filter(s => s.id !== id);
    if (filtered.length === items.length) return false;
    writeJson(SUBSCRIBERS_FILE, filtered);
    return true;
  },

  exportCsv: (): string => {
    const items = readJson<NewsletterSubscriber[]>(SUBSCRIBERS_FILE);
    const header = 'ID,Nom,Email,Téléphone,Date Inscription,Statut,Source\n';
    const rows = items.map(i => `"${i.id}","${i.name}","${i.email}","${i.phone || ''}","${i.subscribedAt}","${i.status}","${i.source || 'Newsletter du site'}"`).join('\n');
    return header + rows;
  }
};

// Publications API
export const dbPublications = {
  getAll: (includeDrafts: boolean = true, category?: string, search?: string): ChurchPublication[] => {
    let items = readJson<ChurchPublication[]>(PUBLICATIONS_FILE);
    if (!includeDrafts) {
      items = items.filter(p => p.status === 'Publiée');
    }
    if (category && category !== 'Toutes') {
      items = items.filter(p => p.category === category);
    }
    if (search && search.trim()) {
      const q = search.toLowerCase().trim();
      items = items.filter(p => 
        p.title.toLowerCase().includes(q) ||
        p.summary.toLowerCase().includes(q) ||
        p.content.toLowerCase().includes(q) ||
        p.author.toLowerCase().includes(q)
      );
    }
    return items.sort((a, b) => new Date(b.date || b.createdAt).getTime() - new Date(a.date || a.createdAt).getTime());
  },

  getById: (id: string): ChurchPublication | undefined => {
    const items = readJson<ChurchPublication[]>(PUBLICATIONS_FILE);
    return items.find(p => p.id === id);
  },

  create: (pub: Omit<ChurchPublication, 'id' | 'createdAt'>): ChurchPublication => {
    const items = readJson<ChurchPublication[]>(PUBLICATIONS_FILE);
    const newPub: ChurchPublication = {
      ...pub,
      id: `pub-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    items.unshift(newPub);
    writeJson(PUBLICATIONS_FILE, items);
    return newPub;
  },

  update: (id: string, updates: Partial<ChurchPublication>): ChurchPublication | null => {
    const items = readJson<ChurchPublication[]>(PUBLICATIONS_FILE);
    const idx = items.findIndex(p => p.id === id);
    if (idx === -1) return null;
    items[idx] = { 
      ...items[idx], 
      ...updates, 
      updatedAt: new Date().toISOString() 
    };
    writeJson(PUBLICATIONS_FILE, items);
    return items[idx];
  },

  delete: (id: string): boolean => {
    const items = readJson<ChurchPublication[]>(PUBLICATIONS_FILE);
    const filtered = items.filter(p => p.id !== id);
    if (filtered.length === items.length) return false;
    writeJson(PUBLICATIONS_FILE, filtered);
    return true;
  }
};

// Events API
export const dbEvents = {
  getAll: (includeDrafts: boolean = true, category?: string, search?: string): ChurchEvent[] => {
    let items = readJson<ChurchEvent[]>(EVENTS_FILE);
    if (!includeDrafts) {
      items = items.filter(e => e.status === 'Publié');
    }
    if (category && category !== 'Toutes' && category !== 'all') {
      items = items.filter(e => e.category === category);
    }
    if (search && search.trim()) {
      const q = search.toLowerCase().trim();
      items = items.filter(e => 
        e.title.toLowerCase().includes(q) ||
        e.description.toLowerCase().includes(q) ||
        e.location.toLowerCase().includes(q) ||
        e.organizer.toLowerCase().includes(q)
      );
    }
    // Sort upcoming events first
    return items.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  },

  getById: (id: string): ChurchEvent | undefined => {
    const items = readJson<ChurchEvent[]>(EVENTS_FILE);
    return items.find(e => e.id === id);
  },

  create: (event: Omit<ChurchEvent, 'id' | 'createdAt'>): ChurchEvent => {
    const items = readJson<ChurchEvent[]>(EVENTS_FILE);
    const newEvent: ChurchEvent = {
      ...event,
      id: `evt-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    items.unshift(newEvent);
    writeJson(EVENTS_FILE, items);
    return newEvent;
  },

  update: (id: string, updates: Partial<ChurchEvent>): ChurchEvent | null => {
    const items = readJson<ChurchEvent[]>(EVENTS_FILE);
    const idx = items.findIndex(e => e.id === id);
    if (idx === -1) return null;
    items[idx] = { ...items[idx], ...updates };
    writeJson(EVENTS_FILE, items);
    return items[idx];
  },

  delete: (id: string): boolean => {
    const items = readJson<ChurchEvent[]>(EVENTS_FILE);
    const filtered = items.filter(e => e.id !== id);
    if (filtered.length === items.length) return false;
    writeJson(EVENTS_FILE, filtered);
    return true;
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
