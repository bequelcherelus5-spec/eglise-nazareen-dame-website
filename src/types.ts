export type PageTab = 
  | 'accueil' 
  | 'a-propos' 
  | 'histoire'
  | 'leadership' 
  | 'ministeres' 
  | 'education' 
  | 'jeux-educatifs'
  | 'examens'
  | 'galerie'
  | 'evenements'
  | 'actualites' 
  | 'medias'
  | 'podcast'
  | 'priere'
  | 'documents'
  | 'projets' 
  | 'jeux-bibliques' 
  | 'contact'
  | 'admin'
  | 'secretariat'
  | 'admin-login';

export interface ChurchTimelineEvent {
  year: number;
  title: string;
  subtitle?: string;
  description: string;
  iconName: string;
  badge?: string;
}

export interface ChurchLeader {
  name: string;
  role: string;
  department?: string;
  bio: string;
  period?: string;
}

export interface Ministry {
  id: string;
  name: string;
  targetAudience: string;
  leader: string;
  schedule: string;
  description: string;
  activities: string[];
  icon: string;
}

export interface EpndCourse {
  id: string;
  title: string;
  duration: string;
  level: string;
  description: string;
  competencies: string[];
  instructor: string;
  schedule: string;
}

export interface SocialProject {
  id: string;
  title: string;
  partner?: string;
  year?: string;
  status: 'En cours' | 'Actif' | 'Nouveau';
  description: string;
  impactMetrics: { label: string; value: string }[];
  keyObjectives: string[];
}

export interface NewsArticle {
  id: string;
  title: string;
  category: 'Spiritualité' | 'Communauté' | 'Éducation' | 'Annonces' | 'Jeunesse';
  date: string;
  author: string;
  readTime: string;
  summary: string;
  content: string[];
  imageUrl: string;
  relatedIds?: string[];
}

export interface MediaItem {
  id: string;
  title: string;
  type: 'photo' | 'audio' | 'video';
  date: string;
  speaker?: string;
  duration?: string;
  category: string;
  thumbnailUrl: string;
  mediaUrl?: string;
  description: string;
}

// Bible Games types
export type GameType = 
  | 'quiz' 
  | 'verset' 
  | 'qui-suis-je' 
  | 'completer' 
  | 'vrai-faux' 
  | 'memoire';

export type GameDifficulty = 'facile' | 'moyen' | 'difficile';
export type GameAudience = 'enfants' | 'jeunesse' | 'adultes';

export interface QuizQuestion {
  id: string;
  type: GameType;
  difficulty: GameDifficulty;
  audience: GameAudience;
  question: string;
  options?: string[];
  correctAnswer: string | number | boolean;
  scriptureReference: string;
  explanation: string;
  clues?: string[]; // for "qui-suis-je"
  missingWords?: string[]; // for "completer"
}

export interface PlayerScore {
  name: string;
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  timeSpentSeconds: number;
}

export interface GameSessionResult {
  id: string;
  date: string;
  gameType: GameType;
  difficulty: GameDifficulty;
  audience: GameAudience;
  players: PlayerScore[];
  winnerName: string;
}

// ----------------------------------------------------
// FORM SUBMISSIONS & ADMIN TYPES
// ----------------------------------------------------

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
  dateReceived: string;
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

export interface NewsletterCampaign {
  id: string;
  title: string;
  subject: string;
  content: string;
  targetAudience: string;
  status: 'Draft' | 'Scheduled' | 'Sent';
  createdAt: string;
  sentAt?: string;
}

export interface AdminStats {
  totalMessages: number;
  newRequests: number;
  inProgressRequests: number;
  completedRequests: number;
  prayerRequests: number;
  documentRequests: number;
  newDocumentRequests: number;
  newsletterSubscribers: number;
  totalSubscribers: number;
  demandesEnAttente: number;
  demandesApprouvees: number;
  demandesEnCours: number;
  demandesRefusees: number;
  demandesTerminees: number;
  totalEvents: number;
  publishedEvents: number;
  publicationsEnAttente: number;
  publicationsPubliees: number;
  podcastsCount: number;
  byCategory: {
    prayer: number;
    contact: number;
    documents: number;
    events: number;
    volunteers: number;
    donations: number;
    general: number;
  };
}

export type DocumentTypeRequested = 
  | 'Certificat de baptême'
  | 'Certificat de mariage'
  | 'Lettre de recommandation'
  | 'Attestation de membre'
  | 'Document administratif'
  | 'Autre demande';

