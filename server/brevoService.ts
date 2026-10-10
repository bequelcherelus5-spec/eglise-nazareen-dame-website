/**
 * Service d'intégration Brevo (ex-Sendinblue) API v3
 * Église du Nazaréen de Damé — www.eglisedunazareendedame.org
 *
 * SÉCURITÉ :
 * - La clé API `BREVO_API_KEY` est lue exclusivement depuis `process.env.BREVO_API_KEY` côté serveur.
 * - Elle n'est jamais exposée ni renvoyée au client / frontend.
 */

const BREVO_API_BASE = 'https://api.brevo.com/v3';
const DEFAULT_SENDER_EMAIL = 'eglisedunazareendedame@gmail.com';
const DEFAULT_SENDER_NAME = 'Église du Nazaréen de Damé';

export interface BrevoContactInput {
  email: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  listIds?: number[];
}

export interface BrevoSyncResult {
  synced: boolean;
  mode: 'brevo' | 'local';
  contactId?: number;
  error?: string;
}

export interface BrevoSendEmailInput {
  title?: string;
  subject: string;
  content: string;
  recipients: { email: string; name?: string }[];
  testEmail?: string;
}

export interface BrevoSendResult {
  success: boolean;
  mode: 'brevo' | 'local-simulation';
  messageId?: string;
  sentCount: number;
  warning?: string;
  error?: string;
}

function getBrevoApiKey(overrideKey?: string): string | null {
  const raw = overrideKey || process.env.BREVO_API_KEY;
  if (!raw) return null;
  const trimmed = raw.trim();
  if (!trimmed || trimmed === 'MY_BREVO_API_KEY' || trimmed === 'YOUR_BREVO_API_KEY') {
    return null;
  }
  return trimmed;
}

export function isBrevoConfigured(overrideKey?: string): boolean {
  return getBrevoApiKey(overrideKey) !== null;
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || '').trim());
}

export function sanitizeText(input: string, maxLength = 200): string {
  return String(input || '').replace(/[<>]/g, '').trim().slice(0, maxLength);
}

export function getBrevoSender(): { email: string; name: string; listId: number } {
  const email = (process.env.BREVO_SENDER_EMAIL || DEFAULT_SENDER_EMAIL).trim();
  const name = (process.env.BREVO_SENDER_NAME || DEFAULT_SENDER_NAME).trim();
  const listId = Number(process.env.BREVO_LIST_ID || '2') || 2;
  return { email, name, listId };
}

export function getBrevoStatus() {
  const sender = getBrevoSender();
  return {
    configured: isBrevoConfigured(),
    provider: 'Brevo API v3',
    senderEmail: sender.email,
    senderName: sender.name,
    listId: sender.listId,
  };
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function buildChurchNewsletterHtml(params: {
  title?: string;
  subject: string;
  content: string;
  recipientName?: string;
}): string {
  const heading = escapeHtml(params.title || params.subject);
  const greeting = params.recipientName
    ? `Bien-aimé(e) ${escapeHtml(params.recipientName)},`
    : 'Bien-aimés frères, sœurs et amis dans le Seigneur,';

  const paragraphs = params.content
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map(
      (p) =>
        `<p style="margin:0 0 16px 0;line-height:1.65;color:#1e293b;font-size:15px;">${escapeHtml(p).replace(/\n/g, '<br/>')}</p>`,
    )
    .join('');

  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(params.subject)}</title>
</head>
<body style="margin:0;padding:0;background-color:#f1f5f9;font-family:Georgia,'Times New Roman',serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#f1f5f9;padding:24px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="max-width:600px;width:100%;background-color:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e2e8f0;">
          <tr>
            <td style="background-color:#1B2A4A;padding:28px 32px;text-align:center;border-bottom:4px solid #9A7B2F;">
              <p style="margin:0;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#E3C878;font-family:Arial,sans-serif;font-weight:bold;">
                Sainteté à l’Éternel
              </p>
              <h1 style="margin:8px 0 4px 0;font-size:24px;color:#ffffff;font-weight:bold;">
                Église du Nazaréen de Damé
              </h1>
              <p style="margin:0;font-size:13px;color:#cbd5e1;font-family:Arial,sans-serif;">
                Pasteur Bequel CHERELUS · Damé, Môle-Saint-Nicolas, Haïti
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:32px;font-family:Arial,Helvetica,sans-serif;">
              <h2 style="margin:0 0 16px 0;font-size:20px;color:#1B2A4A;font-family:Georgia,serif;">
                ${heading}
              </h2>
              <p style="margin:0 0 16px 0;font-size:15px;color:#334155;font-weight:600;">
                ${greeting}
              </p>
              ${paragraphs}
              <div style="margin-top:28px;padding-top:20px;border-top:1px solid #e2e8f0;font-size:14px;color:#475569;">
                <p style="margin:0 0 4px 0;font-weight:bold;color:#1B2A4A;">Pasteur Bequel CHERELUS</p>
                <p style="margin:0;color:#64748b;font-size:13px;">Secrétariat de l’Église du Nazaréen de Damé</p>
              </div>
            </td>
          </tr>
          <tr>
            <td style="background-color:#f8fafc;padding:20px 32px;text-align:center;border-top:1px solid #e2e8f0;font-family:Arial,sans-serif;font-size:12px;color:#64748b;">
              <p style="margin:0 0 6px 0;">
                <strong>Église du Nazaréen de Damé</strong> · Rue Cimetière, 3ème Section Damé, Haïti
              </p>
              <p style="margin:0;">
                Tél : +509 48596089 · <a href="https://www.eglisedunazareendedame.org" style="color:#9A7B2F;text-decoration:none;font-weight:bold;">www.eglisedunazareendedame.org</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/**
 * Crée ou met à jour un contact dans Brevo (API v3 /contacts).
 */
export async function syncContactToBrevo(contact: BrevoContactInput): Promise<BrevoSyncResult> {
  const apiKey = getBrevoApiKey();
  if (!apiKey) {
    return { synced: false, mode: 'local' };
  }

  const cleanEmail = contact.email.trim().toLowerCase();
  const sender = getBrevoSender();
  const fullName = (contact.name || '').trim();
  const parts = fullName.split(/\s+/).filter(Boolean);
  const firstName = contact.firstName || parts[0] || '';
  const lastName = contact.lastName || (parts.length > 1 ? parts.slice(1).join(' ') : '');

  const attributes: Record<string, string> = {};
  if (firstName) {
    attributes.PRENOM = firstName;
    attributes.FIRSTNAME = firstName;
  }
  if (lastName) {
    attributes.NOM = lastName;
    attributes.LASTNAME = lastName;
  }
  if (contact.phone) {
    attributes.SMS = contact.phone.trim();
  }

  const listIds = contact.listIds && contact.listIds.length > 0 ? contact.listIds : [sender.listId];

  try {
    const response = await fetch(`${BREVO_API_BASE}/contacts`, {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        'api-key': apiKey,
      },
      body: JSON.stringify({
        email: cleanEmail,
        attributes,
        listIds,
        updateEnabled: true,
      }),
    });

    if (response.status === 204) {
      return { synced: true, mode: 'brevo' };
    }

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      const errMsg = (data as any)?.message || `Erreur Brevo (${response.status})`;
      console.warn('[Brevo] Contact sync warning:', errMsg);
      return { synced: false, mode: 'brevo', error: errMsg };
    }

    return {
      synced: true,
      mode: 'brevo',
      contactId: typeof (data as any)?.id === 'number' ? (data as any).id : undefined,
    };
  } catch (err: any) {
    console.error('[Brevo] Network error syncing contact:', err?.message || err);
    return {
      synced: false,
      mode: 'brevo',
      error: err?.message || 'Erreur réseau lors de la synchronisation Brevo.',
    };
  }
}

/**
 * Supprime ou désabonne un contact dans Brevo.
 */
export async function removeContactFromBrevo(email: string): Promise<boolean> {
  const apiKey = getBrevoApiKey();
  if (!apiKey) return false;

  try {
    const response = await fetch(
      `${BREVO_API_BASE}/contacts/${encodeURIComponent(email.trim().toLowerCase())}`,
      {
        method: 'DELETE',
        headers: {
          accept: 'application/json',
          'api-key': apiKey,
        },
      },
    );
    return response.ok || response.status === 404;
  } catch (err) {
    console.warn('[Brevo] Error removing contact:', err);
    return false;
  }
}

/**
 * Envoie une newsletter ou un e-mail transactionnel via Brevo (POST /v3/smtp/email).
 */
export async function sendNewsletterViaBrevo(input: BrevoSendEmailInput): Promise<BrevoSendResult> {
  const subject = (input.subject || '').trim();
  const content = (input.content || '').trim();

  if (!subject || !content) {
    return {
      success: false,
      mode: isBrevoConfigured() ? 'brevo' : 'local-simulation',
      sentCount: 0,
      error: 'L’objet et le contenu du message sont obligatoires.',
    };
  }

  const targetRecipients = input.testEmail
    ? [{ email: input.testEmail.trim().toLowerCase(), name: 'Destinataire Test' }]
    : input.recipients.filter((r) => Boolean(r.email && r.email.includes('@')));

  if (targetRecipients.length === 0) {
    return {
      success: false,
      mode: isBrevoConfigured() ? 'brevo' : 'local-simulation',
      sentCount: 0,
      error: 'Aucun destinataire actif valide trouvé pour cet envoi.',
    };
  }

  const apiKey = getBrevoApiKey();
  const sender = getBrevoSender();
  const htmlContent = buildChurchNewsletterHtml({
    title: input.title || subject,
    subject,
    content,
    recipientName: targetRecipients.length === 1 ? targetRecipients[0].name : undefined,
  });

  if (!apiKey) {
    return {
      success: true,
      mode: 'local-simulation',
      messageId: `local-${Date.now()}`,
      sentCount: targetRecipients.length,
      warning:
        'Envoi enregistré localement (ajoutez BREVO_API_KEY dans les variables d’environnement serveur pour activer l’expédition SMTP Brevo en direct).',
    };
  }

  try {
    // Brevo accepte jusqu'à 99 destinataires par appel SMTP transactionnel
    const batch = targetRecipients.slice(0, 95).map((r) => ({
      email: r.email.trim().toLowerCase(),
      name: r.name?.trim() || 'Membre & Ami de l’Église',
    }));

    const payload: Record<string, unknown> = {
      sender: {
        name: sender.name,
        email: sender.email,
      },
      replyTo: {
        name: sender.name,
        email: sender.email,
      },
      subject,
      htmlContent,
      textContent: content,
    };

    if (batch.length === 1) {
      payload.to = batch;
    } else {
      payload.to = [{ email: sender.email, name: sender.name }];
      payload.bcc = batch;
    }

    const response = await fetch(`${BREVO_API_BASE}/smtp/email`, {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        'api-key': apiKey,
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const errMsg =
        (data as any)?.message ||
        `Erreur lors de l'envoi Brevo (code HTTP ${response.status}). Vérifiez votre clé BREVO_API_KEY et l'expéditeur autorisé.`;
      return {
        success: false,
        mode: 'brevo',
        sentCount: 0,
        error: errMsg,
      };
    }

    return {
      success: true,
      mode: 'brevo',
      messageId: (data as any)?.messageId || `brevo-${Date.now()}`,
      sentCount: batch.length,
    };
  } catch (err: any) {
    console.error('[Brevo] Error sending newsletter email:', err);
    return {
      success: false,
      mode: 'brevo',
      sentCount: 0,
      error: err?.message || 'Erreur réseau lors de la communication avec le serveur Brevo.',
    };
  }
}

/* ────────────────────────────── Helpers compatibles Cloudflare Pages Functions ────────────────────────────── */

export async function syncSubscriberToBrevo(
  contact: BrevoContactInput,
  overrideApiKey?: string,
  overrideListId?: string
): Promise<BrevoSyncResult> {
  const apiKey = getBrevoApiKey(overrideApiKey);
  if (!apiKey) {
    return { synced: false, mode: 'local' };
  }
  const listIdNum = Number(overrideListId || process.env.BREVO_LIST_ID || '2') || 2;
  return syncContactToBrevo({ ...contact, listIds: [listIdNum] });
}

export async function updateSubscriberStatusInBrevo(
  email: string,
  status: 'Active' | 'Unsubscribed',
  overrideApiKey?: string
): Promise<{ synced: boolean }> {
  const apiKey = getBrevoApiKey(overrideApiKey);
  if (!apiKey) return { synced: false };
  try {
    const response = await fetch(
      `${BREVO_API_BASE}/contacts/${encodeURIComponent(email.trim().toLowerCase())}`,
      {
        method: 'PUT',
        headers: {
          accept: 'application/json',
          'content-type': 'application/json',
          'api-key': apiKey,
        },
        body: JSON.stringify({ emailBlacklisted: status === 'Unsubscribed' }),
      }
    );
    return { synced: response.ok || response.status === 204 };
  } catch {
    return { synced: false };
  }
}

export async function deleteSubscriberFromBrevo(
  email: string,
  overrideApiKey?: string
): Promise<{ synced: boolean }> {
  const apiKey = getBrevoApiKey(overrideApiKey);
  if (!apiKey) return { synced: false };
  const ok = await removeContactFromBrevo(email);
  return { synced: ok };
}

export async function fetchSubscribersFromBrevo(
  overrideApiKey?: string
): Promise<{
  synced: boolean;
  contacts: Array<{ email: string; name: string; subscribedAt: string; status: 'Active' | 'Unsubscribed' }>;
}> {
  const apiKey = getBrevoApiKey(overrideApiKey);
  if (!apiKey) return { synced: false, contacts: [] };
  try {
    const response = await fetch(`${BREVO_API_BASE}/contacts?limit=200&offset=0`, {
      method: 'GET',
      headers: {
        accept: 'application/json',
        'api-key': apiKey,
      },
    });
    if (!response.ok) return { synced: false, contacts: [] };
    const data: any = await response.json().catch(() => ({}));
    const rawContacts = Array.isArray(data?.contacts) ? data.contacts : [];
    return {
      synced: true,
      contacts: rawContacts.map((c: any) => ({
        email: String(c?.email || ''),
        name:
          [c?.attributes?.FIRSTNAME || c?.attributes?.PRENOM, c?.attributes?.LASTNAME || c?.attributes?.NOM]
            .filter(Boolean)
            .join(' ')
            .trim() || 'Abonné Paroisse',
        subscribedAt: c?.createdAt || new Date().toISOString(),
        status: c?.emailBlacklisted ? 'Unsubscribed' : 'Active',
      })),
    };
  } catch {
    return { synced: false, contacts: [] };
  }
}

export async function sendCampaignViaBrevo(
  campaign: { title: string; subject: string; content: string; imageUrl?: string; targetAudience?: string },
  recipients: Array<{ email: string; name?: string }>,
  options?: { apiKey?: string; senderEmail?: string; senderName?: string }
): Promise<{
  success: boolean;
  brevoSynced: boolean;
  recipientCount: number;
  messageId?: string;
  error?: string;
}> {
  const res = await sendNewsletterViaBrevo({
    title: campaign.title,
    subject: campaign.subject,
    content: campaign.content,
    recipients,
  });
  return {
    success: res.success,
    brevoSynced: res.mode === 'brevo' && res.success,
    recipientCount: res.sentCount,
    messageId: res.messageId,
    error: res.error,
  };
}
