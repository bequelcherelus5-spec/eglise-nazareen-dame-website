import { PageTab } from '../types';

export interface ViewSeoData {
  title: string;
  description: string;
  keywords: string;
}

export const VIEW_SEO_CONFIG: Record<PageTab, ViewSeoData> = {
  accueil: {
    title: "Église du Nazaréen de Damé — « Sainteté à l’Éternel » (Haïti)",
    description: "Site officiel de l'Église du Nazaréen de Damé (Môle-Saint-Nicolas, Haïti). Horaires de culte, enseignements bibliques, école professionnelle EPND et communauté vivante.",
    keywords: "Église du Nazaréen, Damé, Môle Saint Nicolas, Haïti, culte chrétien, sainteté à l'Éternel, pasteur Bequel Cherelus"
  },
  'a-propos': {
    title: "À Propos & Doctrine de Foi — Église du Nazaréen de Damé",
    description: "Découvrez notre confession de foi nazaréenne, nos croyances fondées sur les Écritures et notre engagement pour la sanctification entière et le salut en Jésus-Christ.",
    keywords: "doctrine nazaréenne, confession de foi, sanctification, sainteté, valeurs chrétiennes, église évangélique haïti"
  },
  histoire: {
    title: "Histoire de l'Assemblée (depuis 1979) — Église du Nazaréen de Damé",
    description: "L'histoire inspirante de l'Église du Nazaréen de Damé depuis sa fondation en 1979, les pionniers de la foi et la construction du temple au Môle-Saint-Nicolas.",
    keywords: "histoire église Damé, fondation 1979, pionniers évangéliques, District Bas Nord-Ouest Haïti, témoignage historique"
  },
  leadership: {
    title: "Corps Pastoral & Conseil d'Église — Église du Nazaréen de Damé",
    description: "Faites la connaissance du Pasteur Principal Bequel CHERELUS, du conseil d'administration et des responsables des différents départements paroissiaux.",
    keywords: "Pasteur Bequel Cherelus, conseil d'église, diacres, leadership chrétien, direction spirituelle Damé"
  },
  ministeres: {
    title: "Départements & Ministères Vivants — Église du Nazaréen de Damé",
    description: "Explorez nos ministères actifs : Jeunesse Nazaréenne (JNI), Société Missionnaire (MINI), École du Dimanche (MIED), chorale d'adoration et évangélisation.",
    keywords: "ministères église, JNI jeunesse nazaréenne, MINI missions, MIED école dimanche, chorale évangélique"
  },
  education: {
    title: "École Professionnelle EPND — Église du Nazaréen de Damé",
    description: "Formations certifiées à l'École Professionnelle du Nazaréen de Damé (EPND) : électricité, carrelage, plomberie, informatique et coupe-couture pour la jeunesse.",
    keywords: "EPND, école professionnelle Damé, formation technique Haïti, électricité, carrelage, métiers d'avenir Môle"
  },
  'jeux-educatifs': {
    title: "Espace Jeux Éducatifs (1ère à 9ème AF) — Église de Damé",
    description: "Plateforme interactive d'apprentissage ludique pour enfants et adolescents de la 1ère à la 9ème année fondamentale : mathématiques, français et sciences.",
    keywords: "jeux éducatifs Haïti, enseignement fondamental, révision scolaire, apprentissage interactif Damé"
  },
  examens: {
    title: "Préparation aux Examens d'État Haïti (9ème AF & Bac) — Église de Damé",
    description: "Modules de révision et quiz d'entraînement aux examens officiels du MENFP en Haïti pour réussir la 9ème Année Fondamentale et le Baccalauréat.",
    keywords: "examens d'État MENFP, préparation brevet 9ème AF, baccalauréat Haïti, révision examens officiels Damé"
  },
  galerie: {
    title: "Galerie Photos & Vie Paroissiale — Église du Nazaréen de Damé",
    description: "Retrouvez en images les baptêmes, célébrations festives, conventions de jeunesse, travaux de construction et la communion fraternelle à Damé.",
    keywords: "photos église Damé, galerie baptême, culte en images, assemblée nazaréenne Haïti"
  },
  evenements: {
    title: "Calendrier des Événements & Retraites — Église du Nazaréen de Damé",
    description: "Consultez l'agenda des cultes spéciaux, conférences annuelles, veillées de prière, croisades d'évangélisation et camps de jeunesse à Damé.",
    keywords: "événements église, croisade évangélisation, conférence chrétienne, veillée prière Damé Haïti"
  },
  priere: {
    title: "Demande de Prière & Intercession — Église du Nazaréen de Damé",
    description: "Partagez votre intention ou sujet de prière. Notre équipe d'intercession et le pasteur prient fidèlement pour vos besoins spirituels et matériels.",
    keywords: "demande de prière, intercession spirituelle, soutien prière, foi en Dieu, prière pasteur Damé"
  },
  documents: {
    title: "Demande de Documents Ecclésiastiques — Secrétariat de Damé",
    description: "Service en ligne du secrétariat paroissial pour demander un certificat de baptême, une lettre de recommandation ou une attestation de membre officielle.",
    keywords: "certificat de baptême, lettre de recommandation pastorale, attestation membre église, secrétariat nazaréen"
  },
  projets: {
    title: "Projets Sociaux & Développement Communautaire — Église de Damé",
    description: "Nos actions humanitaires concrètes : adduction d'eau potable, réfection des toitures, soutien agricole et projets d'entraide pour la population de Damé.",
    keywords: "projets communautaires, eau potable Damé, aide humanitaire Môle Saint Nicolas, développement social chrétien"
  },
  actualites: {
    title: "Actualités, Sermons & Communiqués — Église du Nazaréen de Damé",
    description: "Restez informé des dernières nouvelles de la paroisse, résumés des prédications dominicales, annonces officielles et communiqués du secrétariat.",
    keywords: "actualités église Damé, sermons dominicaux, prédications pastorales, communiqués officiels"
  },
  medias: {
    title: "Médias & Publications Paroissiales — Église du Nazaréen de Damé",
    description: "Articles, sermons, enregistrements et documents multimédias édités par l'Église du Nazaréen de Damé.",
    keywords: "médias chrétiens, publications évangéliques, ressources spirituelles Damé"
  },
  'jeux-bibliques': {
    title: "Jeux Bibliques Interactifs (Quiz & Aventure IA) — Église de Damé",
    description: "Testez et enrichissez votre culture biblique avec des quiz captivants, des énigmes scripturaires et des questions générées par Intelligence Artificielle.",
    keywords: "jeux bibliques, quiz chrétien, culture biblique interactive, questions bible IA, éducation chrétienne"
  },
  contact: {
    title: "Contact, Coordonnées & Plan d'Accès — Église du Nazaréen de Damé",
    description: "Prenez contact avec le pasteur Bequel CHERELUS et le secrétariat : téléphone, WhatsApp, e-mail et plan d'accès à la Rue Cimetière, 3ème Section Damé.",
    keywords: "contact église Damé, téléphone pasteur Cherelus, adresse église Môle Saint Nicolas, plan d'accès"
  },
  podcast: {
    title: "Podcasts & Prédications Audio — Église du Nazaréen de Damé",
    description: "Écoutez les prédications dominicales, enseignements bibliques et messages spirituels du Pasteur Bequel CHERELUS en streaming haute qualité.",
    keywords: "podcast chrétien, prédications audio MP3, messages pastoraux, écoute culte en ligne Haïti"
  },
  confidentialite: {
    title: "Politique de Confidentialité — Église du Nazaréen de Damé",
    description: "Politique de respect de la vie privée, protection des données personnelles et règles d'utilisation conformes aux standards Google AdSense et Web.",
    keywords: "politique de confidentialité, respect des données, protection privée église Damé"
  },
  conditions: {
    title: "Conditions Générales d'Utilisation — Plateforme Église de Damé",
    description: "Conditions et règles régissant l'utilisation de la plateforme web de l'Église du Nazaréen de Damé (Haïti).",
    keywords: "conditions utilisation, mentions légales, plateforme web église"
  },
  admin: {
    title: "Espace Secrétariat & Administration — Église du Nazaréen de Damé",
    description: "Tableau de bord de gestion paroissiale : formulaires, lettres officielles, suivi de l'audience et publications.",
    keywords: "administration église, secrétariat paroissial, gestion documents"
  },
  secretariat: {
    title: "Espace Secrétariat & Administration — Église du Nazaréen de Damé",
    description: "Tableau de bord de gestion paroissiale : formulaires, lettres officielles, suivi de l'audience et publications.",
    keywords: "administration église, secrétariat paroissial, gestion documents"
  },
  'admin-login': {
    title: "Connexion Secrétariat — Église du Nazaréen de Damé",
    description: "Accès sécurisé pour l'administration et le secrétariat paroissial de l'Église du Nazaréen de Damé.",
    keywords: "connexion admin, accès secrétariat église"
  }
};

/**
 * Met à jour dynamiquement la balise title, meta description, og:tags et keywords
 */
export function applyViewSeo(view: PageTab): void {
  const seo = VIEW_SEO_CONFIG[view] || VIEW_SEO_CONFIG.accueil;

  // Title
  document.title = seo.title;

  // Meta description
  let metaDesc = document.querySelector('meta[name="description"]');
  if (!metaDesc) {
    metaDesc = document.createElement('meta');
    metaDesc.setAttribute('name', 'description');
    document.head.appendChild(metaDesc);
  }
  metaDesc.setAttribute('content', seo.description);

  // Open Graph Title
  let ogTitle = document.querySelector('meta[property="og:title"]');
  if (ogTitle) {
    ogTitle.setAttribute('content', seo.title);
  }

  // Open Graph Description
  let ogDesc = document.querySelector('meta[property="og:description"]');
  if (ogDesc) {
    ogDesc.setAttribute('content', seo.description);
  }

  // Keywords
  let metaKeywords = document.querySelector('meta[name="keywords"]');
  if (!metaKeywords) {
    metaKeywords = document.createElement('meta');
    metaKeywords.setAttribute('name', 'keywords');
    document.head.appendChild(metaKeywords);
  }
  metaKeywords.setAttribute('content', seo.keywords);
}
