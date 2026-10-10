/**
 * Cloudflare Pages Function — POST /api/newsletter/send
 */
import { handleSendNewsletter, onRequestOptions, PagesContext } from './index';

export { onRequestOptions };

export async function onRequestPost(context: PagesContext): Promise<Response> {
  const payload = (await context.request.json().catch(() => ({}))) as Record<string, unknown>;
  return handleSendNewsletter(context, payload);
}
