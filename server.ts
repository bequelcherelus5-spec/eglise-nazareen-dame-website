import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import dotenv from 'dotenv';
import { dbSubmissions, dbSubscribers, dbCampaigns, dbPodcasts, SubmissionCategory, SubmissionStatus } from './server/db';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const app = express();
const PORT = 3000;

// Body parser with support for audio files in base64 data URLs
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Admin credentials & Security configuration
const ADMIN_RECOVERY_EMAIL = 'eglisedunazareendedame@gmail.com';
const DEFAULT_ADMIN_PASSCODE = '123456';
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
  '123456',
  'Bequel1974',
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
