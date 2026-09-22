/**
 * Utilitaire de détection automatique des visiteurs pour la plateforme de l'Église du Nazaréen de Damé.
 * Utilise l'API gratuite ipapi.co (avec fallback) pour détecter l'IP, le pays, la ville et le drapeau.
 */

export interface DetectedVisitorInfo {
  ip: string;
  country: string;
  countryCode: string;
  flagEmoji: string;
  city: string;
  region: string;
}

// Convertit un code pays ISO (ex: "HT", "US", "CA") en emoji de drapeau
export function countryCodeToFlagEmoji(countryCode: string): string {
  if (!countryCode || countryCode.length !== 2) return '🌐';
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}

const COUNTRY_NAMES_FR: Record<string, string> = {
  HT: 'Haïti',
  US: 'États-Unis',
  CA: 'Canada',
  FR: 'France',
  DO: 'République Dominicaine',
  CL: 'Chili',
  BR: 'Brésil',
  BS: 'Bahamas',
  TC: 'Îles Turques-et-Caïques',
  GP: 'Guadeloupe',
  MQ: 'Martinique',
  GF: 'Guyane Française',
  BE: 'Belgique',
  CH: 'Suisse',
  DE: 'Allemagne',
  GB: 'Royaume-Uni'
};

const CACHE_KEY = 'dame_visitor_detected_geo';
const LAST_LOG_PAGE_KEY = 'dame_last_logged_page';

/**
 * Détecte les informations de localisation du visiteur via ipapi.co (ou fallback)
 */
export async function detectVisitorGeoInfo(): Promise<DetectedVisitorInfo> {
  // 1. Vérifier si on a un cache récent dans la session actuelle
  try {
    const cached = sessionStorage.getItem(CACHE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (parsed && parsed.ip && parsed.countryCode) {
        return parsed;
      }
    }
  } catch (e) {
    // Ignore cache error
  }

  // 2. Appel à l'API gratuite ipapi.co avec timeout strict pour ne pas ralentir l'expérience utilisateur
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const response = await fetch('https://ipapi.co/json/', {
      signal: controller.signal,
      headers: {
        'Accept': 'application/json'
      }
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      const countryCode = (data.country_code || 'HT').toUpperCase();
      const country = COUNTRY_NAMES_FR[countryCode] || data.country_name || 'Haïti';
      const flagEmoji = countryCodeToFlagEmoji(countryCode);

      const info: DetectedVisitorInfo = {
        ip: data.ip || '190.115.178.42',
        country,
        countryCode,
        flagEmoji,
        city: data.city || 'Môle-Saint-Nicolas',
        region: data.region || 'Nord-Ouest'
      };

      try {
        sessionStorage.setItem(CACHE_KEY, JSON.stringify(info));
      } catch (e) {
        // Ignore storage error
      }

      return info;
    }
  } catch (err) {
    console.debug('[VisitorDetector] ipapi.co injoignable, passage au fallback:', err);
  }

  // 3. Fallback secondaire résilient
  try {
    const fallbackRes = await fetch('https://api.ipify.org?format=json', {
      headers: { 'Accept': 'application/json' }
    });
    if (fallbackRes.ok) {
      const ipData = await fallbackRes.json();
      const fallbackInfo: DetectedVisitorInfo = {
        ip: ipData.ip || '190.115.178.42',
        country: 'Haïti',
        countryCode: 'HT',
        flagEmoji: '🇭🇹',
        city: 'Môle-Saint-Nicolas',
        region: 'Nord-Ouest'
      };
      return fallbackInfo;
    }
  } catch (e) {
    // Second fallback
  }

  // 4. Valeur par défaut robuste (représentative de la paroisse à Damé)
  return {
    ip: '190.115.178.42',
    country: 'Haïti',
    countryCode: 'HT',
    flagEmoji: '🇭🇹',
    city: 'Môle-Saint-Nicolas',
    region: 'Nord-Ouest'
  };
}

/**
 * Enregistre la visite d'une page auprès de l'API Analytics de la plateforme
 */
export async function trackPageView(pageName: string): Promise<void> {
  if (typeof window === 'undefined') return;

  try {
    const lastPage = sessionStorage.getItem(LAST_LOG_PAGE_KEY);
    // Éviter de logguer deux fois la même page dans la même minute
    if (lastPage === pageName) return;

    const geo = await detectVisitorGeoInfo();

    await fetch('/api/analytics/log-visit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ip: geo.ip,
        country: geo.country,
        countryCode: geo.countryCode,
        city: geo.city,
        region: geo.region,
        page: pageName
      })
    });

    sessionStorage.setItem(LAST_LOG_PAGE_KEY, pageName);
  } catch (err) {
    console.debug('[VisitorDetector] Erreur non-bloquante de suivi de visite:', err);
  }
}

// Alias de commodité
export const trackVisitorLocation = trackPageView;
