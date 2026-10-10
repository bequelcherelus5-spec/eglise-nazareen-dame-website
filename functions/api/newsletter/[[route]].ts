/**
 * Cloudflare Pages Function — /functions/api/newsletter/[[route]].ts
 * Intercepte toutes les requêtes /api/newsletter/* sur Cloudflare Pages
 * et communique de manière sécurisée avec l'API Brevo via env.BREVO_API_KEY.
 */
import {
  isValidEmail,
  sanitizeText,
  syncSubscriberToBrevo,
  updateSubscriberStatusInBrevo,
  deleteSubscriberFromBrevo,
  fetchSubscribersFromBrevo,
  sendCampaignViaBrevo,
  isBrevoConfigured,
} from '../../../server/brevoService';

export interface CloudflareNewsletterEnv {
  BREVO_API_KEY?: string;
  BREVO_SENDER_EMAIL?: string;
  BREVO_SENDER_NAME?: string;
  BREVO_LIST_ID?: string;
}

export interface CloudflareEventContext {
  request: Request;
  env: CloudflareNewsletterEnv;
  params: { route?: string | string[] };
}

function jsonResponse(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  });
}

export const onRequest = async (context: CloudflareEventContext): Promise<Response> => {
  const { request, env } = context;
  const url = new URL(request.url);
  const path = url.pathname.replace(/^\/api\/newsletter\/?/, '').replace(/\/$/, '');
  const method = request.method.toUpperCase();

  if (method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  }

  const apiKey = env?.BREVO_API_KEY || '';
  const listId = env?.BREVO_LIST_ID || '';

  // 1. GET /api/newsletter/status
  if (path === 'status' && method === 'GET') {
    return jsonResponse({
      success: true,
      configured: isBrevoConfigured(apiKey),
      provider: 'Brevo API v3 (Cloudflare Function)',
    });
  }

  // 2. POST /api/newsletter/subscribe (Public & Admin)
  if ((path === 'subscribe' || path === 'subscribers') && method === 'POST') {
    try {
      const body: any = await request.json().catch(() => ({}));
      const rawEmail = String(body?.email || '').trim().toLowerCase();
      if (!isValidEmail(rawEmail)) {
        return jsonResponse(
          { success: false, error: 'Adresse e-mail invalide. Veuillez vérifier le format (ex: nom@domaine.com).' },
          400
        );
      }

      const cleanName = sanitizeText(
        body?.name || [body?.firstName, body?.lastName].filter(Boolean).join(' ') || 'Abonné Paroisse',
        120
      );
      const cleanPhone = sanitizeText(body?.phone || '', 40);

      const brevoRes = await syncSubscriberToBrevo(
        {
          email: rawEmail,
          name: cleanName,
          firstName: body?.firstName,
          lastName: body?.lastName,
          phone: cleanPhone,
        },
        apiKey,
        listId
      );

      const subscriber = {
        id: `nl-${Date.now()}`,
        name: cleanName,
        email: rawEmail,
        phone: cleanPhone || undefined,
        subscribedAt: new Date().toISOString(),
        status: 'Active' as const,
        source: body?.source || 'Newsletter du site',
      };

      return jsonResponse({
        success: true,
        isNew: true,
        brevoSynced: brevoRes.synced,
        brevoNotice: brevoRes.error,
        subscriber,
        message: 'Merci pour votre inscription à la newsletter de l’Église du Nazaréen de Damé !',
      });
    } catch (err: any) {
      return jsonResponse(
        { success: false, error: err?.message || 'Erreur lors de l’inscription à la newsletter.' },
        500
      );
    }
  }

  // 3. GET /api/newsletter/subscribers
  if (path === 'subscribers' && method === 'GET') {
    const search = (url.searchParams.get('search') || '').trim().toLowerCase();
    const brevoData = await fetchSubscribersFromBrevo(apiKey);
    let subscribers = brevoData.contacts.map((c, idx) => ({
      id: `brevo-${idx}-${c.email}`,
      name: c.name,
      email: c.email,
      subscribedAt: c.subscribedAt,
      status: c.status,
      source: 'Brevo API',
    }));

    if (search) {
      subscribers = subscribers.filter(
        s => s.name.toLowerCase().includes(search) || s.email.toLowerCase().includes(search)
      );
    }

    return jsonResponse({
      success: true,
      brevoSynced: brevoData.synced,
      count: subscribers.length,
      subscribers,
    });
  }

  // 4. PATCH /api/newsletter/subscribers/:id
  if (path.startsWith('subscribers/') && method === 'PATCH') {
    const body: any = await request.json().catch(() => ({}));
    const status = body?.status === 'Unsubscribed' ? 'Unsubscribed' : 'Active';
    const email = String(body?.email || decodeURIComponent(path.slice('subscribers/'.length))).trim();
    const res = await updateSubscriberStatusInBrevo(email, status, apiKey);
    return jsonResponse({
      success: true,
      brevoSynced: res.synced,
      status,
      message: 'Statut de l’abonné mis à jour.',
    });
  }

  // 5. DELETE /api/newsletter/subscribers/:id
  if (path.startsWith('subscribers/') && method === 'DELETE') {
    const emailParam = url.searchParams.get('email') || decodeURIComponent(path.slice('subscribers/'.length));
    const res = await deleteSubscriberFromBrevo(emailParam, apiKey);
    return jsonResponse({
      success: true,
      brevoSynced: res.synced,
      message: 'Abonné supprimé avec succès.',
    });
  }

  // 6. POST /api/newsletter/campaigns (Création & Envoi d'une campagne via Brevo)
  if (path === 'campaigns' && method === 'POST') {
    try {
      const body: any = await request.json().catch(() => ({}));
      const title = sanitizeText(body?.title || body?.subject || '', 160);
      const subject = sanitizeText(body?.subject || '', 160);
      const content = String(body?.content || '').trim();
      const imageUrl = body?.imageUrl ? String(body.imageUrl).trim() : undefined;
      const targetAudience = sanitizeText(body?.targetAudience || 'Tous les abonnés actifs', 100);
      const requestedStatus = body?.status === 'Draft' ? 'Draft' : 'Sent';

      if (!title || !subject || !content) {
        return jsonResponse(
          { success: false, error: 'Le titre, l’objet du mail et le contenu sont obligatoires.' },
          400
        );
      }

      if (requestedStatus === 'Draft') {
        const draftCampaign = {
          id: `camp-${Date.now()}`,
          title,
          subject,
          content,
          imageUrl,
          targetAudience,
          status: 'Draft',
          recipientCount: 0,
          createdAt: new Date().toISOString(),
        };
        return jsonResponse({ success: true, campaign: draftCampaign }, 201);
      }

      // Déterminer la liste des destinataires (fournie ou récupérée depuis Brevo)
      let recipients: Array<{ email: string; name?: string }> = Array.isArray(body?.recipients)
        ? body.recipients
        : [];

      if (recipients.length === 0) {
        const brevoContacts = await fetchSubscribersFromBrevo(apiKey);
        recipients = brevoContacts.contacts
          .filter(c => c.status === 'Active')
          .map(c => ({ email: c.email, name: c.name }));
      }

      const sendResult = await sendCampaignViaBrevo(
        { title, subject, content, imageUrl, targetAudience },
        recipients,
        {
          apiKey,
          senderEmail: env?.BREVO_SENDER_EMAIL,
          senderName: env?.BREVO_SENDER_NAME,
        }
      );

      const campaign = {
        id: `camp-${Date.now()}`,
        title,
        subject,
        content,
        imageUrl,
        targetAudience,
        status: sendResult.success ? 'Sent' : 'Failed',
        recipientCount: sendResult.recipientCount,
        brevoMessageId: sendResult.messageId,
        errorMessage: sendResult.error,
        createdAt: new Date().toISOString(),
        sentAt: sendResult.success ? new Date().toISOString() : undefined,
      };

      return jsonResponse(
        {
          success: sendResult.success,
          brevoSynced: sendResult.brevoSynced,
          campaign,
          error: sendResult.error,
        },
        sendResult.success ? 201 : 200
      );
    } catch (err: any) {
      return jsonResponse(
        { success: false, error: err?.message || 'Erreur lors de l’envoi de la campagne.' },
        500
      );
    }
  }

  return jsonResponse({ success: false, error: 'Route newsletter introuvable.' }, 404);
};
