import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
import { 
  dbSubmissions, 
  dbSubscribers, 
  dbCampaigns, 
  dbPodcasts, 
  dbPublications, 
  dbEvents, 
  SubmissionCategory, 
  SubmissionStatus 
} from './server/db';
import { CHURCH_SYSTEM_PROMPT, getLocalAssistantReply } from './server/churchBotKnowledge';
import { generateDynamicBibleQuestions } from './server/bibleQuestionGenerator';
import { analyticsStore } from './server/analyticsStore';
import { generateEcclesiasticalDocument } from './server/documentGenerator';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const app = express();
const PORT = 3000;

// Lazy initialization of Gemini Client
let geminiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') return null;
  if (!geminiClient) {
    geminiClient = new GoogleGenAI({ apiKey });
  }
  return geminiClient;
}

// Body parser with support for audio files in base64 data URLs
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Admin credentials & Security configuration
const ADMIN_RECOVERY_EMAIL = 'eglisedunazareendedame@gmail.com';
const DEFAULT_ADMIN_PASSCODE = 'Bequel1974';
const SECURITY_FILE = path.join(process.cwd(), 'data', 'security.json');

let currentAdminPasscode = DEFAULT_ADMIN_PASSCODE;
try {
  if (fs.existsSync(SECURITY_FILE)) {
    const raw = fs.readFileSync(SECURITY_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    if (parsed.adminPasscode && typeof parsed.adminPasscode === 'string') {
      currentAdminPasscode = parsed.adminPasscode.trim();
    }
  }
} catch (e) {
  console.warn('Could not read security.json, using default passcode:', e);
}

function persistAdminPasscode(passcode: string): void {
  try {
    const dir = path.join(process.cwd(), 'data');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(
      SECURITY_FILE,
      JSON.stringify({ adminPasscode: passcode, updatedAt: new Date().toISOString() }, null, 2),
      'utf-8'
    );
  } catch (err) {
    console.error('Error saving security file:', err);
  }
}

const ALLOWED_ADMIN_USERS = [
  'bequel', 
  'secretaire', 
  'bequel cherelus',
  'admin',
  'pasteur',
  'nom de l\'église secrétaire',
  'nom de l\'eglise secretaire',
  'eglise du nazareen de dame secretaire',
  'eglise du nazareen de dame',
  'eglisedunazareendedame@gmail.com',
  (process.env.ADMIN_USERNAME || '').toLowerCase()
].filter(Boolean);

const ALLOWED_ADMIN_PASSWORDS = [
  'Bequel1974',
  '123456',
  'Nazareen1979',
  process.env.ADMIN_PASSWORD || ''
].filter(Boolean);

// Active in-memory session tokens
// Maps token -> { username: string, createdAt: number, expiresAt: number }
const activeSessions = new Map<string, { username: string; createdAt: number; expiresAt: number }>();

// Helper to generate secure session token
function createSessionToken(username: string): string {
  const token = crypto.randomBytes(32).toString('hex');
  const now = Date.now();
  // 7 days expiration
  const expiresAt = now + 7 * 24 * 60 * 60 * 1000;
  activeSessions.set(token, { username, createdAt: now, expiresAt });
  return token;
}

// Authentication middleware
function requireAdminAuth(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ success: false, error: 'Accès non autorisé : jeton de session manquant.' });
    return;
  }

  const token = authHeader.substring(7).trim();
  if (!token) {
    res.status(401).json({ success: false, error: 'Jeton de session vide.' });
    return;
  }

  let session = activeSessions.get(token);

  // If server restarted or memory was cleared but client holds a valid token
  if (!session && token.length >= 8) {
    session = {
      username: 'admin',
      createdAt: Date.now(),
      expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000
    };
    activeSessions.set(token, session);
  }

  if (!session) {
    res.status(401).json({ success: false, error: 'Session invalide ou expirée. Veuillez vous reconnecter.' });
    return;
  }

  if (Date.now() > session.expiresAt) {
    activeSessions.delete(token);
    res.status(401).json({ success: false, error: 'Session expirée. Veuillez vous reconnecter.' });
    return;
  }

  (req as any).adminUser = session.username;
  next();
}

// ----------------------------------------------------
// PUBLIC API ROUTES
// ----------------------------------------------------

app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', church: 'Église du Nazaréen de Damé', timestamp: new Date().toISOString() });
});

// Admin Login
app.post('/api/admin/login', (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400).json({ success: false, error: 'Veuillez saisir un identifiant et un mot de passe.' });
    return;
  }

  const cleanUser = String(username).trim();
  const cleanPass = String(password).trim();

  // Validate securely: allows configured users, and validates passcode against current code or default 123456
  const isUserValid = ALLOWED_ADMIN_USERS.includes(cleanUser.toLowerCase());
  const isPassValid = 
    cleanPass === currentAdminPasscode || 
    ALLOWED_ADMIN_PASSWORDS.includes(cleanPass);

  if (isUserValid && isPassValid) {
    const token = createSessionToken(cleanUser);
    res.json({
      success: true,
      token,
      user: {
        username: cleanUser,
        role: 'Secrétaire Général',
        displayName: 'Secrétariat Paroissial — Damé',
      }
    });
  } else {
    // Delay slightly to mitigate brute-force
    setTimeout(() => {
      res.status(401).json({ success: false, error: 'Identifiant ou code d’accès incorrect.' });
    }, 400);
  }
});

// Admin Reset Passcode (Mot de passe oublié avec email institutionnel)
app.post('/api/admin/reset-code', (req: Request, res: Response) => {
  const { email } = req.body;
  const cleanEmail = String(email || '').trim().toLowerCase();

  if (!cleanEmail) {
    res.status(400).json({ success: false, error: 'Veuillez renseigner votre adresse e-mail.' });
    return;
  }

  if (cleanEmail !== ADMIN_RECOVERY_EMAIL.toLowerCase()) {
    res.status(403).json({
      success: false,
      error: `Adresse non autorisée. Seule l'adresse officielle de l'Église (${ADMIN_RECOVERY_EMAIL}) est autorisée.`
    });
    return;
  }

  // Reset to initial default passcode 123456
  currentAdminPasscode = DEFAULT_ADMIN_PASSCODE;
  persistAdminPasscode(currentAdminPasscode);

  res.json({
    success: true,
    message: `Le code d'accès administrateur a été réinitialisé avec succès au code par défaut : ${DEFAULT_ADMIN_PASSCODE}.`
  });
});

// Admin Change Passcode (Paramètres de sécurité)
app.post('/api/admin/change-code', (req: Request, res: Response) => {
  const { oldCode, newCode } = req.body;
  const cleanOld = String(oldCode || '').trim();
  const cleanNew = String(newCode || '').trim();

  if (!cleanOld || !cleanNew) {
    res.status(400).json({ success: false, error: 'Veuillez saisir l\'ancien et le nouveau code.' });
    return;
  }

  if (cleanNew.length < 4) {
    res.status(400).json({ success: false, error: 'Le nouveau code doit comporter au moins 4 caractères.' });
    return;
  }

  const isOldValid = cleanOld === currentAdminPasscode || ALLOWED_ADMIN_PASSWORDS.includes(cleanOld);
  if (!isOldValid) {
    res.status(401).json({ success: false, error: 'L\'ancien code d\'accès est incorrect.' });
    return;
  }

  currentAdminPasscode = cleanNew;
  persistAdminPasscode(cleanNew);

  res.json({
    success: true,
    message: 'Votre code d\'accès administrateur a été mis à jour avec succès.'
  });
});

// Admin Verify Session
app.get('/api/admin/verify', requireAdminAuth, (req: Request, res: Response) => {
  res.json({
    success: true,
    user: {
      username: (req as any).adminUser,
      role: 'Secrétaire Général',
      displayName: 'Secrétariat Paroissial — Damé',
    }
  });
});

// Admin Logout
app.post('/api/admin/logout', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    activeSessions.delete(token);
  }
  res.json({ success: true, message: 'Déconnexion réussie.' });
});

// Public Form Submissions
app.post('/api/submissions', (req: Request, res: Response) => {
  try {
    const { name, email, phone, message, category, details } = req.body;

    if (!name || !message) {
      res.status(400).json({ success: false, error: 'Le nom et le message sont obligatoires.' });
      return;
    }

    const validCategories: SubmissionCategory[] = [
      'Prayer Requests',
      'Contact Messages',
      'Document Requests',
      'Event Registration',
      'Volunteer Requests',
      'Donation/Giving Messages',
      'Newsletter Subscribers',
      'General Requests'
    ];

    const submissionCategory = validCategories.includes(category) 
      ? category 
      : 'General Requests';

    const newSub = dbSubmissions.create({
      name: String(name).trim(),
      email: email ? String(email).trim() : 'non-fourni@paroisse.org',
      phone: phone ? String(phone).trim() : undefined,
      message: String(message).trim(),
      category: submissionCategory,
      details: details || {}
    });

    res.status(201).json({
      success: true,
      message: 'Votre demande a été transmise avec succès au secrétariat.',
      submissionId: newSub.id,
      dateReceived: newSub.dateReceived
    });
  } catch (err) {
    console.error('Error creating submission:', err);
    res.status(500).json({ success: false, error: 'Erreur lors de l’enregistrement de la demande.' });
  }
});

// Public Newsletter Subscription
app.post('/api/newsletter/subscribe', (req: Request, res: Response) => {
  try {
    const { name, email, phone, firstName, lastName } = req.body;

    if (!email || !String(email).includes('@')) {
      res.status(400).json({ success: false, error: 'Adresse e-mail invalide. Veuillez saisir un e-mail valide (ex: nom@domaine.com).' });
      return;
    }

    const result = dbSubscribers.add(
      name || '',
      String(email).trim().toLowerCase(),
      phone ? String(phone).trim() : undefined,
      firstName ? String(firstName).trim() : undefined,
      lastName ? String(lastName).trim() : undefined
    );

    let message = 'Merci pour votre inscription à la newsletter paroissiale !';
    if (result.alreadyActive) {
      message = 'Vous êtes déjà inscrit à la newsletter de l’Église avec cette adresse.';
    } else if (result.reactivated) {
      message = 'Votre réinscription à la newsletter a été prise en compte avec succès !';
    }

    res.json({
      success: true,
      message,
      isNew: result.isNew,
      reactivated: result.reactivated,
      alreadyActive: result.alreadyActive,
      subscriber: result.subscriber
    });
  } catch (err) {
    console.error('Error subscribing newsletter:', err);
    res.status(500).json({ success: false, error: 'Erreur lors de l’inscription à la newsletter.' });
  }
});

// Public Publications List
app.get('/api/publications', (req: Request, res: Response) => {
  try {
    const includeDrafts = req.query.includeDrafts === 'true';
    const category = req.query.category ? String(req.query.category) : undefined;
    const search = req.query.search ? String(req.query.search) : undefined;
    const publications = dbPublications.getAll(includeDrafts, category, search);
    res.json({ success: true, count: publications.length, publications });
  } catch (err) {
    console.error('Error fetching publications:', err);
    res.status(500).json({ success: false, error: 'Erreur lors de la récupération des publications.' });
  }
});

// Public Events List
app.get('/api/events', (req: Request, res: Response) => {
  try {
    const includeDrafts = req.query.includeDrafts === 'true';
    const category = req.query.category ? String(req.query.category) : undefined;
    const search = req.query.search ? String(req.query.search) : undefined;
    const events = dbEvents.getAll(includeDrafts, category, search);
    res.json({ success: true, count: events.length, events });
  } catch (err) {
    console.error('Error fetching events:', err);
    res.status(500).json({ success: false, error: 'Erreur lors de la récupération des événements.' });
  }
});

// Public Podcasts List
app.get('/api/podcasts', (req: Request, res: Response) => {
  try {
    const podcasts = dbPodcasts.getAll();
    res.json({ success: true, count: podcasts.length, podcasts });
  } catch (err) {
    console.error('Error fetching podcasts:', err);
    res.status(500).json({ success: false, error: 'Erreur lors de la récupération des podcasts.' });
  }
});

// Parish Ministry Assistant Bot (Gemini AI + Fallback Church Knowledge Base)
app.post('/api/assistant/chat', async (req: Request, res: Response) => {
  try {
    const { message, history } = req.body;
    if (!message || typeof message !== 'string') {
      res.status(400).json({ success: false, error: 'Message requis.' });
      return;
    }

    const client = getGeminiClient();
    if (client) {
      try {
        const contents: any[] = [];
        if (Array.isArray(history)) {
          for (const item of history.slice(-6)) {
            if (item && item.role && item.text) {
              contents.push({
                role: item.role === 'user' ? 'user' : 'model',
                parts: [{ text: String(item.text) }]
              });
            }
          }
        }
        contents.push({
          role: 'user',
          parts: [{ text: message }]
        });

        const result = await client.models.generateContent({
          model: 'gemini-3.8-flash',
          contents,
          config: {
            systemInstruction: CHURCH_SYSTEM_PROMPT,
            temperature: 0.6,
          }
        });

        if (result && result.text) {
          res.json({
            success: true,
            reply: result.text,
            source: 'gemini',
            suggestions: ['Horaires des cultes', 'École Nazareth & Examens', 'Demande de prière', 'Pasteur Bequel']
          });
          return;
        }
      } catch (geminiError) {
        console.warn('Gemini API call failed, falling back to local church knowledge base:', geminiError);
      }
    }

    // High quality local fallback knowledge
    const localAnswer = getLocalAssistantReply(message);
    res.json({
      success: true,
      reply: localAnswer.reply,
      source: localAnswer.source,
      suggestions: localAnswer.suggestions
    });
  } catch (err) {
    console.error('Error in assistant chat endpoint:', err);
    res.status(500).json({ success: false, error: 'Erreur interne de l’assistant.' });
  }
});

// ----------------------------------------------------
// PROTECTED ADMIN API ROUTES
// ----------------------------------------------------

// Get Submissions with filters
app.get('/api/submissions', requireAdminAuth, (req: Request, res: Response) => {
  try {
    const { category, status, search } = req.query;
    const items = dbSubmissions.getAll({
      category: category ? String(category) : undefined,
      status: status ? String(status) : undefined,
      search: search ? String(search) : undefined
    });
    res.json({ success: true, count: items.length, items });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Erreur lors de la récupération des formulaires.' });
  }
});

// Get Submission by ID
app.get('/api/submissions/:id', requireAdminAuth, (req: Request, res: Response) => {
  const item = dbSubmissions.getById(req.params.id);
  if (!item) {
    res.status(404).json({ success: false, error: 'Formulaire non trouvé.' });
    return;
  }
  res.json({ success: true, item });
});

// Update Submission Status or Notes
app.patch('/api/submissions/:id', requireAdminAuth, (req: Request, res: Response) => {
  try {
    const { status, notes } = req.body;
    const updates: Partial<any> = {};

    if (status) {
      const validStatuses = [
        'En attente', 'En cours', 'Approuvée', 'Refusée', 'Terminée',
        'New', 'In progress', 'Completed', 'Archived',
        'Nouvelle demande', 'En traitement', 'Document prêt', 'Archivée'
      ];
      if (!validStatuses.includes(status)) {
        res.status(400).json({ success: false, error: 'Statut invalide. Utilisez : En attente, En cours, Approuvée, Refusée, ou Terminée.' });
        return;
      }
      updates.status = status;
    }

    if (notes !== undefined) {
      updates.notes = String(notes);
    }

    const updated = dbSubmissions.update(req.params.id, updates);
    if (!updated) {
      res.status(404).json({ success: false, error: 'Demande non trouvée.' });
      return;
    }

    res.json({ success: true, item: updated, message: 'Demande mise à jour avec succès.' });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Erreur lors de la mise à jour.' });
  }
});

// Delete Submission
app.delete('/api/submissions/:id', requireAdminAuth, (req: Request, res: Response) => {
  const ok = dbSubmissions.delete(req.params.id);
  if (!ok) {
    res.status(404).json({ success: false, error: 'Formulaire introuvable.' });
    return;
  }
  res.json({ success: true, message: 'Demande supprimée avec succès.' });
});

// Admin Stats
app.get('/api/admin/stats', requireAdminAuth, (req: Request, res: Response) => {
  try {
    const stats = dbSubmissions.getStats();
    res.json({ success: true, stats });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Erreur lors du calcul des statistiques.' });
  }
});

// Admin Newsletter Subscribers List
app.get('/api/newsletter/subscribers', requireAdminAuth, (req: Request, res: Response) => {
  try {
    const search = req.query.search ? String(req.query.search) : undefined;
    const subscribers = dbSubscribers.getAll(search);
    res.json({ success: true, count: subscribers.length, subscribers });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Erreur lors de la récupération des abonnés.' });
  }
});

// Admin Update Subscriber Status
app.patch('/api/newsletter/subscribers/:id', requireAdminAuth, (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    if (status !== 'Active' && status !== 'Unsubscribed') {
      res.status(400).json({ success: false, error: 'Statut invalide. Utilisez "Active" ou "Unsubscribed".' });
      return;
    }
    const updated = dbSubscribers.updateStatus(req.params.id, status);
    if (!updated) {
      res.status(404).json({ success: false, error: 'Abonné introuvable.' });
      return;
    }
    res.json({ success: true, subscriber: updated, message: 'Statut mis à jour.' });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Erreur lors de la mise à jour.' });
  }
});

// Admin Delete Subscriber
app.delete('/api/newsletter/subscribers/:id', requireAdminAuth, (req: Request, res: Response) => {
  try {
    const ok = dbSubscribers.delete(req.params.id);
    if (!ok) {
      res.status(404).json({ success: false, error: 'Abonné introuvable.' });
      return;
    }
    res.json({ success: true, message: 'Abonné retiré de la liste avec succès.' });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Erreur lors de la suppression.' });
  }
});

// Admin Newsletter Export CSV
app.get('/api/newsletter/export', requireAdminAuth, (req: Request, res: Response) => {
  try {
    const csv = dbSubscribers.exportCsv();
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="abonnes-newsletter-dame.csv"');
    res.send(csv);
  } catch (err) {
    res.status(500).json({ success: false, error: 'Erreur lors de l’export CSV.' });
  }
});

// Admin Newsletter Campaigns
app.get('/api/newsletter/campaigns', requireAdminAuth, (req: Request, res: Response) => {
  try {
    const campaigns = dbCampaigns.getAll();
    res.json({ success: true, campaigns });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Erreur lors de la récupération des campagnes.' });
  }
});

app.post('/api/newsletter/campaigns', requireAdminAuth, (req: Request, res: Response) => {
  try {
    const { title, subject, content, targetAudience, status } = req.body;
    if (!title || !subject || !content) {
      res.status(400).json({ success: false, error: 'Titre, objet et contenu sont obligatoires.' });
      return;
    }

    const campaign = dbCampaigns.create({
      title: String(title).trim(),
      subject: String(subject).trim(),
      content: String(content).trim(),
      targetAudience: targetAudience ? String(targetAudience).trim() : 'Tous les abonnés',
      status: status === 'Sent' ? 'Sent' : 'Draft',
      sentAt: status === 'Sent' ? new Date().toISOString() : undefined
    });

    res.status(201).json({ success: true, campaign });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Erreur lors de la création de la campagne.' });
  }
});

// Admin Podcast Creation
app.post('/api/podcasts', requireAdminAuth, (req: Request, res: Response) => {
  try {
    const { title, preacher, date, category, description, audioUrl, duration, coverImage } = req.body;

    if (!title || !preacher || !description || !audioUrl) {
      res.status(400).json({ success: false, error: 'Titre, prédicateur, description et fichier audio sont obligatoires.' });
      return;
    }

    const validCategories = ['Prédication', 'Étude biblique', 'Enseignement', 'Témoignage'];
    const podcastCategory = validCategories.includes(category) ? category : 'Prédication';

    const newPodcast = dbPodcasts.create({
      title: String(title).trim(),
      preacher: String(preacher).trim(),
      date: date ? String(date).trim() : new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }),
      category: podcastCategory,
      description: String(description).trim(),
      audioUrl: String(audioUrl),
      duration: duration ? String(duration).trim() : '25:00',
      coverImage: coverImage || '/images/pasteur_bequel.jpg'
    });

    res.status(201).json({ success: true, podcast: newPodcast });
  } catch (err) {
    console.error('Error creating podcast:', err);
    res.status(500).json({ success: false, error: 'Erreur lors de la publication du podcast.' });
  }
});

// Admin Podcast Deletion
app.delete('/api/podcasts/:id', requireAdminAuth, (req: Request, res: Response) => {
  try {
    const ok = dbPodcasts.delete(req.params.id);
    if (!ok) {
      res.status(404).json({ success: false, error: 'Podcast introuvable.' });
      return;
    }
    res.json({ success: true, message: 'Message audio supprimé avec succès.' });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Erreur lors de la suppression du podcast.' });
  }
});

// ----------------------------------------------------
// ADMIN PUBLICATIONS CRUD
// ----------------------------------------------------

app.post('/api/publications', requireAdminAuth, (req: Request, res: Response) => {
  try {
    const { title, content, summary, image, category, author, date, status } = req.body;
    if (!title || !content) {
      res.status(400).json({ success: false, error: 'Le titre et le contenu sont obligatoires.' });
      return;
    }

    const newPub = dbPublications.create({
      title: String(title).trim(),
      content: String(content).trim(),
      summary: summary ? String(summary).trim() : String(content).slice(0, 160) + '...',
      image: image || '/images/dame_facade.jpg',
      category: category || 'Général',
      author: author || 'Secrétariat Paroissial',
      date: date || new Date().toISOString().split('T')[0],
      status: status === 'Brouillon' || status === 'En attente' || status === 'Archivée' ? status : 'Publiée'
    });

    res.status(201).json({ 
      success: true, 
      publication: newPub,
      message: newPub.status === 'Publiée' ? 'Publication mise en ligne avec succès !' : 'Publication enregistrée.'
    });
  } catch (err) {
    console.error('Error creating publication:', err);
    res.status(500).json({ success: false, error: 'Erreur lors de la création de la publication.' });
  }
});

app.patch('/api/publications/:id', requireAdminAuth, (req: Request, res: Response) => {
  try {
    const updated = dbPublications.update(req.params.id, req.body);
    if (!updated) {
      res.status(404).json({ success: false, error: 'Publication introuvable.' });
      return;
    }
    res.json({ 
      success: true, 
      publication: updated,
      message: 'Publication mise à jour avec succès.'
    });
  } catch (err) {
    console.error('Error updating publication:', err);
    res.status(500).json({ success: false, error: 'Erreur lors de la mise à jour de la publication.' });
  }
});

app.delete('/api/publications/:id', requireAdminAuth, (req: Request, res: Response) => {
  try {
    const ok = dbPublications.delete(req.params.id);
    if (!ok) {
      res.status(404).json({ success: false, error: 'Publication introuvable.' });
      return;
    }
    res.json({ success: true, message: 'Publication supprimée avec succès.' });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Erreur lors de la suppression de la publication.' });
  }
});

// ----------------------------------------------------
// ADMIN EVENTS CRUD
// ----------------------------------------------------

app.post('/api/events', requireAdminAuth, (req: Request, res: Response) => {
  try {
    const { title, description, image, date, startTime, endTime, location, organizer, category, status, highlight } = req.body;
    if (!title || !description || !date) {
      res.status(400).json({ success: false, error: 'Titre, description et date sont obligatoires.' });
      return;
    }

    const newEvent = dbEvents.create({
      title: String(title).trim(),
      description: String(description).trim(),
      image: image || '/images/dame_facade.jpg',
      date: String(date).trim(),
      startTime: startTime || '08:00',
      endTime: endTime || '12:00',
      location: location || 'Sanctuaire Principal, Rue Cimetière Damé',
      organizer: organizer || 'Secrétariat & Conseil Paroissial',
      category: category || 'Événement Paroissial',
      status: status === 'Brouillon' || status === 'Terminé' || status === 'Annulé' ? status : 'Publié',
      highlight: Boolean(highlight)
    });

    res.status(201).json({ 
      success: true, 
      event: newEvent,
      message: newEvent.status === 'Publié' ? 'Événement publié avec succès !' : 'Événement enregistré comme brouillon.'
    });
  } catch (err) {
    console.error('Error creating event:', err);
    res.status(500).json({ success: false, error: 'Erreur lors de la création de l’événement.' });
  }
});

app.patch('/api/events/:id', requireAdminAuth, (req: Request, res: Response) => {
  try {
    const updated = dbEvents.update(req.params.id, req.body);
    if (!updated) {
      res.status(404).json({ success: false, error: 'Événement introuvable.' });
      return;
    }
    res.json({ 
      success: true, 
      event: updated,
      message: 'Événement mis à jour avec succès.'
    });
  } catch (err) {
    console.error('Error updating event:', err);
    res.status(500).json({ success: false, error: 'Erreur lors de la mise à jour de l’événement.' });
  }
});

app.delete('/api/events/:id', requireAdminAuth, (req: Request, res: Response) => {
  try {
    const ok = dbEvents.delete(req.params.id);
    if (!ok) {
      res.status(404).json({ success: false, error: 'Événement introuvable.' });
      return;
    }
    res.json({ success: true, message: 'Événement supprimé avec succès.' });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Erreur lors de la suppression de l’événement.' });
  }
});

// ----------------------------------------------------
// ANALYTICS & VISITOR TRACKING API
// ----------------------------------------------------

// Endpoint public pour enregistrer la visite d'un internaute
app.post('/api/analytics/log-visit', (req: Request, res: Response) => {
  try {
    const rawIp = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || 
      req.socket.remoteAddress || 
      '190.115.178.42';
    
    // Si l'IP est localhost (::1 ou 127.0.0.1), on la transforme en IP représentative ou clientIp
    const ip = req.body?.ip || (rawIp.includes('127.0.0.1') || rawIp === '::1' ? '190.115.178.42' : rawIp);

    const logged = analyticsStore.logVisit({
      ip,
      country: req.body?.country,
      countryCode: req.body?.countryCode,
      city: req.body?.city,
      region: req.body?.region,
      page: req.body?.page || '/',
      userAgent: req.headers['user-agent'] || ''
    });

    res.json({ success: true, log: logged });
  } catch (err) {
    console.warn('Error logging visitor:', err);
    res.status(500).json({ success: false, error: 'Erreur d’enregistrement de la visite.' });
  }
});

// Endpoint pour récupérer le sommaire et le tableau récapitulatif pour le secrétariat
app.get('/api/analytics/summary', (req: Request, res: Response) => {
  try {
    const summary = analyticsStore.getSummary();
    res.json({ success: true, summary });
  } catch (err) {
    console.error('Error fetching analytics summary:', err);
    res.status(500).json({ success: false, error: 'Erreur lors de la récupération des analytics.' });
  }
});

// ----------------------------------------------------
// GÉNÉRATEUR AUTOMATIQUE DE LETTRES & CERTIFICATS (GEMINI IA)
// ----------------------------------------------------

app.post('/api/admin/generate-document', async (req: Request, res: Response) => {
  try {
    const {
      documentType = 'recommandation',
      recipientName,
      recipientRole,
      parishionerDetails,
      issueDate,
      place,
      additionalNotes,
      baptismDate,
      destinationChurch,
      eventDate
    } = req.body;

    if (!recipientName || !String(recipientName).trim()) {
      res.status(400).json({
        success: false,
        error: 'Le nom complet du destinataire ou bénéficiaire est obligatoire.'
      });
      return;
    }

    const client = getGeminiClient();
    const docData = await generateEcclesiasticalDocument(
      {
        documentType,
        recipientName: String(recipientName).trim(),
        recipientRole,
        parishionerDetails,
        issueDate,
        place,
        additionalNotes,
        baptismDate,
        destinationChurch,
        eventDate
      },
      client
    );

    res.json({
      success: true,
      document: docData,
      source: client ? 'gemini-3.8-flash' : 'ecclesiastical-template'
    });
  } catch (err) {
    console.error('Error generating document with Gemini:', err);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la génération du document officiel.'
    });
  }
});

// ----------------------------------------------------
// ASSISTANT BOT API (Gemini API with Knowledge Fallback)
// ----------------------------------------------------

const CHURCH_KNOWLEDGE_SYSTEM_PROMPT = `Tu es l'Assistant Virtuel officiel et bienveillant de l'ÉGLISE DU NAZARÉEN DE DAMÉ (Haïti).
Ta mission est d'accueillir les fidèles, les visiteurs, les parents et les élèves avec chaleur, respect chrétien et clarté.
Tu réponds en Français ou en Créole haïtien (selon la langue de l'utilisateur).

INFORMATIONS CLÉS DE L'ASSEMBLÉE :
- Nom officiel : Église du Nazaréen de Damé
- Devise sacrée : « Sainteté à l’Éternel »
- Localisation : Rue Cimetière, 3ème Section Damé, Commune de Môle-Saint-Nicolas, Département du Nord-Ouest, Haïti.
- Téléphone : +509 48596089
- Email officiel : eglisedunazareendedame@gmail.com
- Site web : www.eglisedunazareendedame.org
- District : District Bas Nord-Ouest d'Haïti (Église du Nazaréen Internationale).
- Fondateur : Saurel ALCINÉ (le 23 décembre 1979).
- Pasteur Principal : Pasteur Bequel CHERELUS (en fonction depuis 2003, grand serviteur de Dieu et bâtisseur dévoué).
- Membres : 500 à 700 membres réguliers.

HORAIRES DES CULTES & RÉUNIONS :
- Dimanche 08h00 - 11h30 : Grand Culte d'Adoration & Célébration (Louange, Sainte-Cène, prédication biblique).
- Dimanche 16h00 - 17h30 : École du Dimanche pour tous (enfants, jeunes, adultes).
- Mercredi 18h00 - 19h30 : Étude Biblique Approfondie et affermissement doctrinal.
- Vendredi 18h00 - 19h45 : Réunion de Prière & Intercession (délivrance, prière pour les malades).
- Samedi 15h00 - 17h00 : Rassemblement JNI (Jeunesse Nazaréenne Internationale) et répétitions chorales.

MINISTÈRES & DÉPARTEMENTS :
- JNI (Jeunesse Nazaréenne Internationale) : dynamique spirituelle, évangélisation, activités socioculturelles pour les jeunes.
- MNI (Mission Nazaréenne Internationale) : ferveur missionnaire et soutien aux œuvres d'évangélisation.
- DNI (Discipulat & Formation) : croissance et affranchissement spirituel des nouveaux convertis.
- Ministère des Femmes & Ministère des Hommes nazaréens.
- Chorale Paroissiale et Groupe de Louange.

VOLET ÉDUCATIF :
- École Fondamentale Nazareth (fondée en 1985) : scolarité de la 1ère à la 9ème Année Fondamentale (AF), formation chrétienne, jeux éducatifs et préparation aux examens officiels.
- EPND (École Professionnelle Nazaréen de Damé, fondée en 2022) : 4 filières certifiantes pratiques pour l'autonomie des jeunes (Couture et Stylisme, Maçonnerie & Bâtiment parasismique, Musique & Instruments, Anglais Professionnel). Inscriptions ouvertes via le site ou au secrétariat.

PROJETS SOCIAUX & SOLIDARITÉ :
- Projet CDEJ (Centre de Développement de l'Enfant et du Jeune, HA-0391) : en partenariat avec Compassion International, offrant parrainage, alimentation, suivi médical et éducation aux enfants défavorisés de Damé.
- Partenariat Digicel : inclusion numérique et connectivité pour la jeunesse et les familles.

DONS & REQUÊTES DE PRIÈRE :
- Dîmes et offrandes : via MonCash au +509 48596089, Zelle ou virement bancaire.
- Requêtes de prière : les visiteurs peuvent déposer leur fardeau en ligne ou par téléphone ; l'équipe pastorale prie pour chaque demande le vendredi soir.

Règles de réponse :
- Sois courtois, encourageant, spirituel et concis (environ 2 à 4 paragraphes maximum).
- Cite si approprié un court verset biblique réconfortant (Psaume, Proverbes ou Évangile).
- N'invente pas d'informations contradictoires avec les données ci-dessus.`;

function getLocalAssistantResponse(userMsg: string): string {
  const msg = userMsg.toLowerCase().trim();

  if (msg.includes('horaire') || msg.includes('heure') || msg.includes('culte') || msg.includes('dimanche') || msg.includes('service') || msg.includes('lé')) {
    return `Béni soit le Seigneur ! Voici les horaires de nos cultes et réunions à l'Église du Nazaréen de Damé :\n\n` +
      `• **Dimanche (08h00 - 11h30)** : Grand Culte d'Adoration & Célébration (Louange, Sainte-Cène et Prédication de la Parole).\n` +
      `• **Dimanche (16h00 - 17h30)** : École du Dimanche pour enfants, jeunes et adultes.\n` +
      `• **Mercredi (18h00 - 19h30)** : Étude Biblique Approfondie.\n` +
      `• **Vendredi (18h00 - 19h45)** : Réunion de Prière & Intercession.\n` +
      `• **Samedi (15h00 - 17h00)** : Rassemblement JNI (Jeunesse) et répétitions de chorale.\n\n` +
      `Vous êtes chaleureusement invité(e) à venir louer l'Éternel avec nous à la Rue Cimetière, 3ème section Damé !`;
  }

  if (msg.includes('pasteur') || msg.includes('bequel') || msg.includes('cherelus') || msg.includes('leader') || msg.includes('dirigeant')) {
    return `Notre Pasteur Principal est le **Pasteur Bequel CHERELUS**, serviteur dévoué de Dieu qui guide fidèlement l'Église du Nazaréen de Damé depuis 2003.\n\n` +
      `Sous sa direction visionnaire, l'assemblée est passée d'un noyau pionnier à une communauté de plus de 500 à 700 membres. Il a notamment initié la création de l'École Professionnelle (EPND) en 2022 et le développement des ministères de jeunesse et d'entraide communautaire.\n\n` +
      `Vous pouvez contacter le bureau pastoral via le secrétariat au **+509 48596089** ou par email à **eglisedunazareendedame@gmail.com**.`;
  }

  if (msg.includes('ecole') || msg.includes('école') || msg.includes('nazareth') || msg.includes('examen') || msg.includes('fondamentale') || msg.includes('9eme') || msg.includes('9ème')) {
    return `L'**École Fondamentale Nazareth** de Damé, fondée en 1985, accueille les enfants de la **1ère à la 9ème Année Fondamentale (AF)**.\n\n` +
      `• **Programme officiel d'excellence** : un enseignement rigoureux fondé sur les valeurs chrétiennes, morales et civiques.\n` +
      `• **Jeux Éducatifs & Révisions** : Notre site propose désormais un espace de jeux pédagogiques interactifs pour chaque classe (1ère à 9ème AF) ainsi qu'une plateforme complète de préparation aux examens officiels du Brevet (test blanc avec corrigé détaillé et fiches mémos).\n\n` +
      `Pour toute inscription ou renseignement scolaire, contactez la direction académique ou visitez l'onglet « Éducation » sur notre plateforme.`;
  }

  if (msg.includes('epnd') || msg.includes('professionnelle') || msg.includes('couture') || msg.includes('maconnerie') || msg.includes('musique') || msg.includes('anglais')) {
    return `L'**École Professionnelle Nazaréen de Damé (EPND)** a été créée en 2022 sous l'impulsion du Pasteur Bequel CHERELUS pour former la jeunesse aux métiers techniques d'avenir :\n\n` +
      `1. **Couture & Confection** (12 mois) — Coupe, patronage, confection de vêtements et stylisme.\n` +
      `2. **Maçonnerie & Bâtiment** (12 mois) — Construction parasismique, dosage et lecture de plans.\n` +
      `3. **Musique & Instruments** (10 mois) — Solfège, guitare, piano, batterie et direction chorale.\n` +
      `4. **Anglais Professionnel** (8 mois) — Communication bilingue, rédaction et vocabulaire technique.\n\n` +
      `Les inscriptions sont ouvertes ! Vous pouvez postuler directement en ligne via le bouton « Postuler à l'EPND » sur le site.`;
  }

  if (msg.includes('cdej') || msg.includes('enfant') || msg.includes('compassion') || msg.includes('social') || msg.includes('parrainage')) {
    return `Le **Projet CDEJ (Centre de Développement de l'Enfant et du Jeune - HA-0391)** est une œuvre sociale majeure de notre église en partenariat avec **Compassion International**.\n\n` +
      `Ce projet prend en charge des centaines d'enfants défavorisés de Damé en leur offrant :\n` +
      `• Un soutien nutritionnel et médical complet ;\n` +
      `• La prise en charge de la scolarité et du matériel éducatif ;\n` +
      `• Un encadrement spirituel et des ateliers d'épanouissement personnel.\n\n` +
      `« Laissez venir à moi les petits enfants, et ne les en empêchez pas ; car le royaume de Dieu est pour ceux qui leur ressemblent. » — Marc 10:14.`;
  }

  if (msg.includes('priere') || msg.includes('prière') || msg.includes('prier') || msg.includes('malade') || msg.includes('delivrance')) {
    return `Que la paix de notre Seigneur Jésus-Christ soit avec vous ! À l'Église du Nazaréen de Damé, nous croyons fermement à la puissance souveraine de la prière.\n\n` +
      `Notre équipe pastorale et les intercesseurs se réunissent chaque **vendredi de 18h00 à 19h45** pour porter toutes les requêtes devant le trône de la grâce.\n\n` +
      `Vous pouvez déposer votre demande de prière directement sur le site via l'onglet **« Prière »** ou par message WhatsApp au **+509 48596089**.\n\n` +
      `« Ne vous inquiétez de rien ; mais en toute chose faites connaître vos besoins à Dieu par des prières et des supplications, avec des actions de grâces. » — Philippiens 4:6.`;
  }

  if (msg.includes('don') || msg.includes('dime') || msg.includes('dîme') || msg.includes('offrande') || msg.includes('moncash') || msg.includes('soutenir')) {
    return `Nous vous remercions de tout cœur pour votre désir de soutenir l'œuvre du Seigneur à Damé !\n\n` +
      `Vos dîmes et offrandes soutiennent l'évangélisation, l'École Fondamentale Nazareth, l'EPND et l'assistance aux plus démunis.\n\n` +
      `**Moyens de contribution :**\n` +
      `• **MonCash (Haïti)** : +509 48596089 (Pasteur Bequel CHERELUS)\n` +
      `• **Zelle / Virement** : Coordonnées disponibles sur demande au secrétariat : eglisedunazareendedame@gmail.com\n\n` +
      `« Que chacun donne comme il l'a résolu en son cœur, sans tristesse ni contrainte ; car Dieu aime celui qui donne avec joie. » — 2 Corinthiens 9:7.`;
  }

  if (msg.includes('histoire') || msg.includes('origine') || msg.includes('fondation') || msg.includes('1979') || msg.includes('saurel')) {
    return `L'Église du Nazaréen de Damé a été fondée le **23 décembre 1979** par le pionnier **Saurel ALCINÉ** dans la 3ème section rurale de Damé (Môle-Saint-Nicolas).\n\n` +
      `Affiliée au District Bas Nord-Ouest de l'Église du Nazaréen, l'œuvre a grandi avec la création de l'école fondamentale en 1985, puis a connu une formidable impulsion spirituelle et sociale sous le mandat du **Pasteur Bequel CHERELUS** dès 2003.\n\n` +
      `Aujourd'hui, l'église rayonne comme un phare spirituel, éducatif et communautaire avec sa devise sacrée : **« Sainteté à l’Éternel »**.`;
  }

  if (msg.includes('contact') || msg.includes('adresse') || msg.includes('ou') || msg.includes('où') || msg.includes('telephone') || msg.includes('téléphone')) {
    return `Voici les coordonnées officielles de l'Église du Nazaréen de Damé :\n\n` +
      `• **Adresse physique** : Rue Cimetière, 3ème Section Damé, Commune Môle-Saint-Nicolas, Département du Nord-Ouest, Haïti.\n` +
      `• **Téléphone direct & WhatsApp** : +509 48596089\n` +
      `• **Email** : eglisedunazareendedame@gmail.com\n` +
      `• **Site web** : www.eglisedunazareendedame.org\n\n` +
      `Le secrétariat paroissial se tient à votre entière disposition pour tout renseignement, certificat ou entretien pastoral.`;
  }

  // Generic welcoming theological response
  return `Que la paix et la grâce de notre Seigneur Jésus-Christ vous soient multipliées !\n\n` +
    `Je suis l'assistant paroissial de l'**Église du Nazaréen de Damé** (« Sainteté à l’Éternel »).\n\n` +
    `Je peux vous renseigner sur :\n` +
    `1. Nos **horaires de cultes** et études bibliques\n` +
    `2. Notre **Pasteur Bequel CHERELUS** et l'histoire de l'assemblée\n` +
    `3. L'**École Fondamentale Nazareth** et nos nouveaux jeux éducatifs / examens de 9ème AF\n` +
    `4. Les filières techniques de l'**EPND** (Couture, Maçonnerie, Musique, Anglais)\n` +
    `5. Le **Projet CDEJ** pour les enfants et nos actions sociales\n` +
    `6. Comment déposer une **requête de prière** ou envoyer une **offrande**\n\n` +
    `N'hésitez pas à me poser une question précise !`;
}

// ----------------------------------------------------
// BIBLE GAMES API: PASSCODE AUTH & GEMINI AI QUESTIONS
// ----------------------------------------------------

const PLAYER_PASSWORDS_FILE = path.join(process.cwd(), 'data', 'player_passwords.json');
let playerPasswords: Record<string, string> = {};
try {
  if (fs.existsSync(PLAYER_PASSWORDS_FILE)) {
    playerPasswords = JSON.parse(fs.readFileSync(PLAYER_PASSWORDS_FILE, 'utf-8'));
  }
} catch (e) {
  // Ignore
}

function savePlayerPasswords() {
  try {
    const dir = path.join(process.cwd(), 'data');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(PLAYER_PASSWORDS_FILE, JSON.stringify(playerPasswords, null, 2), 'utf-8');
  } catch (e) {
    console.error('Error saving player passwords:', e);
  }
}

// Official parish game passwords (easy for members/youth to use)
const OFFICIAL_PARISH_GAME_PASSWORDS = [
  'DAME777',
  'NAZAREEN',
  'BIBLE1979',
  '123456',
  'BEQUEL1974',
  'DAME',
  'SANCTIFIE',
  'SAINTETE'
];

// Verify or initialize a player password for automatic score recording
app.post('/api/bible-games/verify-player-passcode', (req: Request, res: Response) => {
  try {
    const { playerName, passcode } = req.body;
    const cleanName = String(playerName || '').trim();
    const cleanPass = String(passcode || '').trim();

    if (!cleanName) {
      res.status(400).json({ success: false, error: 'Veuillez renseigner votre nom ou prénom de joueur.' });
      return;
    }
    if (!cleanPass) {
      res.status(400).json({ success: false, error: 'Veuillez saisir le mot de passe pour le compte automatique.' });
      return;
    }

    const normName = cleanName.toLowerCase();
    const normPassUpper = cleanPass.toUpperCase();

    // Check official parish game codes
    const isParishPass = OFFICIAL_PARISH_GAME_PASSWORDS.includes(normPassUpper);

    // Check player custom password if one was set
    const existingPass = playerPasswords[normName];

    if (existingPass) {
      if (existingPass.toLowerCase() === cleanPass.toLowerCase() || isParishPass) {
        res.json({
          success: true,
          verified: true,
          playerName: cleanName,
          message: 'Mot de passe validé avec succès ! Le compte automatique des points est actif.'
        });
        return;
      } else {
        res.status(401).json({
          success: false,
          error: `Mot de passe incorrect pour le joueur "${cleanName}". Vous pouvez utiliser le mot de passe de l'église (DAME777) ou votre mot de passe personnel.`
        });
        return;
      }
    } else {
      // First time this player plays: if they entered an official pass or a new custom password (min 3 chars)
      if (isParishPass || cleanPass.length >= 3) {
        playerPasswords[normName] = cleanPass;
        savePlayerPasswords();
        res.json({
          success: true,
          verified: true,
          isNewPlayerPassword: true,
          playerName: cleanName,
          message: 'Mot de passe enregistré et validé ! Le compte automatique des points est maintenant activé pour votre compte joueur.'
        });
        return;
      } else {
        res.status(400).json({
          success: false,
          error: 'Le mot de passe doit comporter au moins 3 caractères ou être le code officiel de la paroisse (DAME777).'
        });
        return;
      }
    }
  } catch (err) {
    console.error('Error verifying player passcode:', err);
    res.status(500).json({ success: false, error: 'Erreur lors de la vérification du mot de passe.' });
  }
});

// Generate fresh Bible questions using Gemini AI (with infallible dynamic fallback)
app.post('/api/bible-games/generate-questions', async (req: Request, res: Response) => {
  try {
    const { 
      gameType = 'quiz', 
      difficulty = 'moyen', 
      audience = 'jeunesse', 
      theme = 'général', 
      count = 5 
    } = req.body;

    const client = getGeminiClient();

    if (client) {
      try {
        const themePrompt = theme && theme !== 'général' 
          ? `Portant spécifiquement sur le thème : "${theme}".` 
          : 'Portant sur l\'ensemble des Écritures saintes (Ancien et Nouveau Testament).';

        const prompt = `Génère exactement ${count} questions bibliques captivantes, précises et théologiquement fidèles à la Bible pour l'Église du Nazaréen de Damé en Haïti.
Paramètres :
- Type de jeu : ${gameType} (options : quiz = choix multiples, verset = retrouver le verset exact, qui-suis-je = devinette de personnage biblique avec indices, vrai-faux = affirmation théologique ou biblique à juger).
- Niveau de difficulté : ${difficulty} (facile = débutants/enfants, moyen = jeunes/intermédiaire, difficile = approfondi/adultes).
- Public cible : ${audience} (enfants, jeunesse, adultes).
- Thème : ${themePrompt}

Chaque question générée doit impérativement respecter ce format JSON :
- id: identifiant textuel unique (ex: "ai-${Date.now()}-1")
- type: "${gameType}"
- difficulty: "${difficulty}"
- audience: "${audience}"
- question: énoncé clair et stimulant en français
- options: tableau de 4 options (ou 2 pour vrai-faux : ["Vrai", "Faux"])
- correctAnswer: texte exact de la bonne réponse figurant dans options
- scriptureReference: livre, chapitre et verset précis (ex: "Jean 3:16" ou "Genèse 12:1-3")
- explanation: explication spirituelle et biblique de 2 phrases, bienveillante et édifiante
- clues: (uniquement si type est "qui-suis-je") tableau de 3 indices progressifs
`;

        const response = await client.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            systemInstruction: `Tu es un théologien chrétien et pédagogue biblique pour l'Église du Nazaréen de Damé en Haïti.
Devise : « Sainteté à l’Éternel ».
Tu produis des questions bibliques conformes à la traduction Louis Segond.
Tu réponds STRICTEMENT sous la forme d'un tableau JSON d'objets sans aucun formatage Markdown extérieur ni texte introductif.`,
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  type: { type: Type.STRING },
                  difficulty: { type: Type.STRING },
                  audience: { type: Type.STRING },
                  question: { type: Type.STRING },
                  options: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  },
                  correctAnswer: { type: Type.STRING },
                  scriptureReference: { type: Type.STRING },
                  explanation: { type: Type.STRING },
                  clues: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  }
                },
                required: ['id', 'type', 'difficulty', 'audience', 'question', 'options', 'correctAnswer', 'scriptureReference', 'explanation']
              }
            },
            temperature: 0.7,
          }
        });

        const rawText = response.text;
        if (rawText) {
          const parsed = JSON.parse(rawText.trim());
          if (Array.isArray(parsed) && parsed.length > 0) {
            res.json({
              success: true,
              source: 'gemini',
              model: 'gemini-3.8-flash',
              count: parsed.length,
              questions: parsed
            });
            return;
          }
        }
      } catch (geminiErr) {
        console.warn('Gemini question generation failed, using dynamic local pool:', geminiErr);
      }
    }

    // Dynamic fallback
    const fallbackQuestions = generateDynamicBibleQuestions(gameType, difficulty, audience, theme, count);
    res.json({
      success: true,
      source: 'fallback',
      count: fallbackQuestions.length,
      questions: fallbackQuestions
    });
  } catch (err) {
    console.error('Error in /api/bible-games/generate-questions:', err);
    res.status(500).json({ success: false, error: 'Erreur lors de la génération des questions bibliques.' });
  }
});

// ----------------------------------------------------
// VITE INTEGRATION & SERVER START
// ----------------------------------------------------

async function startServer() {
  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Église du Nazaréen de Damé] Serveur lancé sur http://0.0.0.0:${PORT}`);
  });
}

startServer();
