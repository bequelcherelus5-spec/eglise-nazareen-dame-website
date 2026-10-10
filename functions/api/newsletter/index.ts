/**
 * Cloudflare Pages Function — /api/newsletter
 * Église du Nazaréen de Damé — www.eglisedunazareendedame.org
 *
 * SÉCURITÉ :
 * - BREVO_API_KEY est lue exclusivement depuis les variables d'environnement serveur (context.env.BREVO_API_KEY).
 * - La clé n'est jamais exposée au client.
 */

export interface Env {
  BREVO_API_KEY?: string;
  BREVO_SENDER_EMAIL?: string;
  BREVO_SENDER_NAME?: string;
  BREVO_LIST_ID?: string;
}

export interface PagesContext {
  request: Request;
  env: Env;
  params: Record<string, string | string[]>;
}

const BREVO_API_BASE = 'https://api.brevo.com/v3';
const DEFAULT_SENDER_EMAIL = 'eglisedunazareendedame@gmail.com';
const DEFAULT_SENDER_NAME = 'Église du Nazaréen de Damé';

const CORS_HEADERS: Record<string, string> = {
  'Content-Type': 'application/json; charset=utf-8',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

function jsonResponse(body: Record<string, unknown>, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: CORS_HEADERS,
  });
}

function getApiKey(env?: Env): string | null {
  const raw =
    env?.BREVO_API_KEY ||
    (typeof process !== 'undefined' && process.env ? process.env.BREVO_API_KEY : undefined);
  if (!raw) return null;
  const trimmed = String(raw).trim();
  if (!trimmed || trimmed === 'MY_BREVO_API_KEY' || trimmed === 'YOUR_BREVO_API_KEY') {
    return null;
  }
  return trimmed;
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export async function onRequestOptions(): Promise<Response> {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}

export async function onRequestGet(context: PagesContext): Promise<Response> {
  const apiKey = getApiKey(context.env);
  const senderEmail = context.env?.BREVO_SENDER_EMAIL || DEFAULT_SENDER_EMAIL;
  const senderName = context.env?.BREVO_SENDER_NAME || DEFAULT_SENDER_NAME;
  const listId = Number(context.env?.BREVO_LIST_ID || '2') || 2;

  return jsonResponse({
    success: true,
    brevo: {
      configured: Boolean(apiKey),
      provider: 'Brevo API v3',
      senderEmail,
      senderName,
      listId,
    },
  });
}

export async function onRequestPost(context: PagesContext): Promise<Response> {
  try {
    const payload = (await context.request.json().catch(() => ({}))) as Record<string, unknown>;
    const action = String(payload.action || 'subscribe').toLowerCase();

    if (action === 'send') {
      return await handleSendNewsletter(context, payload);
    }

    return await handleSubscribe(context, payload);
  } catch (err: any) {
    return jsonResponse(
      {
        success: false,
        error: err?.message || 'Erreur interne du service newsletter.',
      },
      500,
    );
  }
}

export async function handleSubscribe(
  context: PagesContext,
  payload: Record<string, unknown>,
): Promise<Response> {
  const email = String(payload.email || '').trim().toLowerCase();
  const name = String(payload.name || '').trim();
  const phone = payload.phone ? String(payload.phone).trim() : undefined;
  const firstName = payload.firstName ? String(payload.firstName).trim() : undefined;
  const lastName = payload.lastName ? String(payload.lastName).trim() : undefined;

  if (!email || !isValidEmail(email)) {
    return jsonResponse(
      {
        success: false,
        error: 'Adresse e-mail invalide. Veuillez saisir une adresse valide (ex: nom@domaine.com).',
      },
      400,
    );
  }

  const apiKey = getApiKey(context.env);
  const listId = Number(context.env?.BREVO_LIST_ID || '2') || 2;

  const subscriber = {
    id: `nl-${Date.now()}`,
    name: name || [firstName, lastName].filter(Boolean).join(' ') || 'Abonné Paroisse',
    firstName,
    lastName,
    email,
    phone,
    subscribedAt: new Date().toISOString(),
    status: 'Active' as const,
    source: 'Newsletter du site',
  };

  if (!apiKey) {
    return jsonResponse({
      success: true,
      isNew: true,
      brevoSynced: false,
      mode: 'local',
      message: 'Merci pour votre inscription à la newsletter paroissiale !',
      subscriber,
    });
  }

  const parts = subscriber.name.split(/\s+/).filter(Boolean);
  const resolvedFirst = firstName || parts[0] || '';
  const resolvedLast = lastName || (parts.length > 1 ? parts.slice(1).join(' ') : '');

  const attributes: Record<string, string> = {};
  if (resolvedFirst) {
    attributes.PRENOM = resolvedFirst;
    attributes.FIRSTNAME = resolvedFirst;
  }
  if (resolvedLast) {
    attributes.NOM = resolvedLast;
    attributes.LASTNAME = resolvedLast;
  }
  if (phone) {
    attributes.SMS = phone;
  }

  const brevoRes = await fetch(`${BREVO_API_BASE}/contacts`, {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
      'api-key': apiKey,
    },
    body: JSON.stringify({
      email,
      attributes,
      listIds: [listId],
      updateEnabled: true,
    }),
  });

  if (!brevoRes.ok && brevoRes.status !== 204) {
    const errData = (await brevoRes.json().catch(() => ({}))) as Record<string, unknown>;
    return jsonResponse(
      {
        success: false,
        error:
          typeof errData.message === 'string'
            ? errData.message
            : `Erreur Brevo lors de l'inscription (${brevoRes.status}).`,
      },
      brevoRes.status >= 400 && brevoRes.status < 600 ? brevoRes.status : 502,
    );
  }

  return jsonResponse({
    success: true,
    isNew: true,
    brevoSynced: true,
    mode: 'brevo',
    message: 'Merci pour votre inscription à la newsletter de l’Église du Nazaréen de Damé !',
    subscriber,
  });
}

export async function handleSendNewsletter(
  context: PagesContext,
  payload: Record<string, unknown>,
): Promise<Response> {
  const subject = String(payload.subject || '').trim();
  const content = String(payload.content || '').trim();
  const title = String(payload.title || subject).trim();
  const testEmail = payload.testEmail ? String(payload.testEmail).trim().toLowerCase() : undefined;
  const rawRecipients = Array.isArray(payload.recipients) ? payload.recipients : [];

  if (!subject || !content) {
    return jsonResponse(
      {
        success: false,
        error: 'L’objet et le contenu de la newsletter sont obligatoires.',
      },
      400,
    );
  }

  if (testEmail && !isValidEmail(testEmail)) {
    return jsonResponse(
      {
        success: false,
        error: 'L’adresse e-mail de test est invalide.',
      },
      400,
    );
  }

  const recipients: { email: string; name?: string }[] = testEmail
    ? [{ email: testEmail, name: 'Destinataire Test' }]
    : rawRecipients
        .map((r: any) => ({
          email: String(r?.email || r || '').trim().toLowerCase(),
          name: r?.name ? String(r.name).trim() : 'Membre & Ami de l’Église',
        }))
        .filter((r) => isValidEmail(r.email));

  if (recipients.length === 0) {
    return jsonResponse(
      {
        success: false,
        error: 'Aucun destinataire actif valide trouvé pour cet envoi.',
      },
      400,
    );
  }

  const apiKey = getApiKey(context.env);
  const senderEmail = context.env?.BREVO_SENDER_EMAIL || DEFAULT_SENDER_EMAIL;
  const senderName = context.env?.BREVO_SENDER_NAME || DEFAULT_SENDER_NAME;

  const campaign = {
    id: `camp-${Date.now()}`,
    title,
    subject,
    content,
    targetAudience: testEmail ? `Test (${testEmail})` : `Abonnés actifs (${recipients.length})`,
    status: 'Sent' as const,
    createdAt: new Date().toISOString(),
    sentAt: new Date().toISOString(),
  };

  if (!apiKey) {
    return jsonResponse({
      success: true,
      mode: 'local-simulation',
      sentCount: recipients.length,
      campaign,
      warning:
        'Envoi enregistré localement (configurez BREVO_API_KEY dans les variables d’environnement pour activer l’envoi Brevo en direct).',
      message: `Campagne enregistrée avec succès pour ${recipients.length} destinataire(s).`,
    });
  }

  const batch = recipients.slice(0, 95);
  const emailPayload: Record<string, unknown> = {
    sender: { name: senderName, email: senderEmail },
    replyTo: { name: senderName, email: senderEmail },
    subject,
    textContent: content,
    htmlContent: `<div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;"><div style="background:#1B2A4A;color:#fff;padding:24px;text-align:center;border-bottom:4px solid #9A7B2F;"><p style="margin:0;color:#E3C878;font-size:11px;text-transform:uppercase;letter-spacing:2px;">Sainteté à l’Éternel</p><h1 style="margin:6px 0 0;font-size:22px;">Église du Nazaréen de Damé</h1></div><div style="padding:28px;font-family:Arial,sans-serif;color:#1e293b;line-height:1.6;"><h2 style="color:#1B2A4A;margin-top:0;">${title}</h2><p style="white-space:pre-line;">${content}</p><hr style="border:none;border-top:1px solid #e2e8f0;margin:24px 0;"/><p style="font-size:12px;color:#64748b;margin:0;">Pasteur Bequel CHERELUS · www.eglisedunazareendedame.org</p></div></div>`,
  };

  if (batch.length === 1) {
    emailPayload.to = batch;
  } else {
    emailPayload.to = [{ email: senderEmail, name: senderName }];
    emailPayload.bcc = batch;
  }

  const brevoRes = await fetch(`${BREVO_API_BASE}/smtp/email`, {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
      'api-key': apiKey,
    },
    body: JSON.stringify(emailPayload),
  });

  const data = (await brevoRes.json().catch(() => ({}))) as Record<string, unknown>;
  if (!brevoRes.ok) {
    return jsonResponse(
      {
        success: false,
        error:
          typeof data.message === 'string'
            ? data.message
            : `Erreur Brevo lors de l'envoi (${brevoRes.status}).`,
      },
      brevoRes.status >= 400 && brevoRes.status < 600 ? brevoRes.status : 502,
    );
  }

  return jsonResponse({
    success: true,
    mode: 'brevo',
    messageId: data.messageId || `brevo-${Date.now()}`,
    sentCount: batch.length,
    campaign,
    message: `Newsletter envoyée avec succès via Brevo à ${batch.length} destinataire(s) !`,
  });
}
