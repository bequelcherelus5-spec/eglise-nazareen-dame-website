/**
 * Cloudflare Pages Function — POST /api/newsletter/subscribe
 */
import { handleSubscribe, onRequestOptions, PagesContext } from './index';

export { onRequestOptions };

export async function onRequestPost(context: PagesContext): Promise<Response> {
  const payload = (await context.request.json().catch(() => ({}))) as Record<string, unknown>;
  return handleSubscribe(context, payload);
}
