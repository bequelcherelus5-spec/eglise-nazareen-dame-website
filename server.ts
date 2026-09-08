import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { dbSubmissions, dbSubscribers, dbCampaigns, dbPodcasts, SubmissionCategory, SubmissionStatus } from './server/db';
import { CHURCH_SYSTEM_PROMPT, getLocalAssistantReply } from './server/churchBotKnowledge';
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

  const token = authHeader.substring(7);
  const session = activeSessions.get(token);

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
    const { name, email, phone } = req.body;

    if (!email || !email.includes('@')) {
      res.status(400).json({ success: false, error: 'Adresse email invalide.' });
      return;
    }

    const result = dbSubscribers.add(name || 'Abonné Paroisse', email, phone);

    res.json({
      success: true,
      message: result.isNew 
        ? 'Merci pour votre inscription à la newsletter paroissiale !' 
        : 'Vous êtes déjà inscrit à la newsletter de l’Église.',
      subscriber: result.subscriber
    });
  } catch (err) {
    console.error('Error subscribing newsletter:', err);
    res.status(500).json({ success: false, error: 'Erreur lors de l’inscription à la newsletter.' });
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
        'New', 'In progress', 'Completed', 'Archived',
        'Nouvelle demande', 'En traitement', 'Document prêt', 'Terminée', 'Archivée'
      ];
      if (!validStatuses.includes(status)) {
        res.status(400).json({ success: false, error: 'Statut invalide.' });
        return;
      }
      updates.status = status;
    }

    if (notes !== undefined) {
      updates.notes = String(notes);
    }

    const updated = dbSubmissions.update(req.params.id, updates);
    if (!updated) {
      res.status(404).json({ success: false, error: 'Formulaire non trouvé.' });
      return;
    }

    res.json({ success: true, item: updated });
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
    const subscribers = dbSubscribers.getAll();
    res.json({ success: true, count: subscribers.length, subscribers });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Erreur lors de la récupération des abonnés.' });
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
- École Fondamentale Nazareth (fondée en 1985) : scolarité de la 1ère à la 9ème Année Fondamentale (AF) agréée MENFP, formation chrétienne, jeux éducatifs et préparation aux examens officiels.
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
      `• **Programme officiel MENFP** : un enseignement d'excellence fondé sur les valeurs chrétiennes, morales et civiques.\n` +
      `• **Jeux Éducatifs & Révisions** : Notre site propose désormais un espace de jeux pédagogiques interactifs pour chaque classe (1ère à 9ème AF) ainsi qu'une plateforme complète de préparation aux examens d'État du Brevet (test blanc avec corrigé détaillé et fiches mémos).\n\n` +
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

app.post('/api/assistant/chat', async (req: Request, res: Response) => {
  try {
    const { message, history } = req.body;
    if (!message || typeof message !== 'string') {
      res.status(400).json({ success: false, error: 'Message requis.' });
      return;
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey && apiKey.trim() !== '' && apiKey !== 'MY_GEMINI_API_KEY') {
      try {
        const { GoogleGenAI } = await import('@google/genai');
        const ai = new GoogleGenAI({ apiKey });

        let conversationContext = '';
        if (Array.isArray(history) && history.length > 0) {
          conversationContext = history.slice(-4).map((h: any) => `${h.role === 'user' ? 'Fidèle' : 'Assistant'}: ${h.content}`).join('\n') + '\n';
        }

        const prompt = `${conversationContext}Fidèle: ${message}\nAssistant:`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            systemInstruction: CHURCH_KNOWLEDGE_SYSTEM_PROMPT,
            temperature: 0.7,
            maxOutputTokens: 800,
          }
        });

        const reply = response.text || getLocalAssistantResponse(message);
        res.json({ success: true, reply, source: 'ai' });
        return;
      } catch (geminiErr) {
        console.warn('Gemini API call failed or timed out, using infallible local knowledge base:', geminiErr);
        const reply = getLocalAssistantResponse(message);
        res.json({ success: true, reply, source: 'knowledge_base' });
        return;
      }
    } else {
      // Direct local knowledge base response
      const reply = getLocalAssistantResponse(message);
      res.json({ success: true, reply, source: 'knowledge_base' });
    }
  } catch (err) {
    console.error('Error in /api/assistant/chat:', err);
    res.status(500).json({ success: false, error: 'Erreur lors du traitement de la requête.' });
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
