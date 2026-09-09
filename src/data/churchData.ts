import { ChurchLeader, ChurchTimelineEvent, Ministry, EpndCourse, SocialProject, NewsArticle, MediaItem } from '../types';
import culteImg from '../assets/images/regenerated_image_1788671014993.png';

export const CHURCH_INFO = {
  name: "ÉGLISE DU NAZARÉEN DE DAMÉ",
  shortName: "Église du Nazaréen de Damé",
  motto: "« Sainteté à l’Éternel »",
  address: "Rue Cimetière, 3ème Section Damé, Commune Môle-Saint-Nicolas, Département du Nord-Ouest, Haïti",
  phone: "+509 48596089",
  email: "eglisedunazareendedame@gmail.com",
  domain: "www.eglisedunazareendedame.org",
  district: "District Bas Nord-Ouest",
  founder: "Saurel ALCINÉ (23 décembre 1979)",
  leadPastor: "Pasteur Bequel CHERELUS (Depuis 2003)",
  membership: "500 à 700 membres",
  coordinates: {
    lat: 19.805, // Mole-Saint-Nicolas / Damé region
    lng: -73.385,
  },
  social: {
    facebook: "https://www.facebook.com/profile.php?id=61586834645549",
    youtube: "https://www.youtube.com/@EgliseduNazareenDeDame",
  },
  openingHours: [
    { day: "Dimanche", time: "08h00 - 11h30", title: "Culte d'Adoration & Célébration", desc: "Louange, Sainte Cène et prédication de la Parole" },
    { day: "Dimanche", time: "16h00 - 17h30", title: "École du Dimanche pour Tous", desc: "Classes d'études bibliques par tranche d'âge" },
    { day: "Mercredi", time: "18h00 - 19h30", title: "Étude Biblique Approfondie", desc: "Exégèse et affermissement doctrinal" },
    { day: "Vendredi", time: "18h00 - 19h45", title: "Réunion de Prière & Intercession", desc: "Combat spirituel, prières pour les malades et la communauté" },
    { day: "Samedi", time: "15h00 - 17h00", title: "Rassemblement JNI & Répétitions", desc: "Jeunesse Nazaréenne Internationale et chorales" },
  ]
};

export const CHURCH_TIMELINE: ChurchTimelineEvent[] = [
  {
    year: 1979,
    title: "Fondation par Saurel ALCINÉ",
    subtitle: "23 décembre 1979",
    description: "Implantation de l'œuvre à Damé sous la direction de Saurel ALCINÉ, débutant sous forme de station missionnaire pionnière dans le Nord-Ouest.",
    iconName: "Flame",
    badge: "Origines"
  },
  {
    year: 1985,
    title: "Création de l'École Chrétienne",
    subtitle: "L'instruction au service de la foi",
    description: "Ouverture de l'école fondamentale chrétienne de l'assemblée pour répondre au besoin vital d'alphabétisation et d'éducation de base des enfants de Damé.",
    iconName: "BookOpen",
    badge: "Éducation"
  },
  {
    year: 1992,
    title: "Transition Ministérielle",
    subtitle: "Consolidation pastorale",
    description: "Période de transition de leadership ayant permis l'ancrage institutionnel au sein du District Bas Nord-Ouest et la restructuration des départements.",
    iconName: "Users",
    badge: "Croissance"
  },
  {
    year: 2003,
    title: "Prise de charge par le Pasteur Bequel CHERELUS",
    subtitle: "Une nouvelle impulsion spirituelle",
    description: "Installation officielle du Pasteur Bequel CHERELUS à la tête de l'assemblée, amorçant une phase majeure d'expansion numérique (500 à 700 membres) et sociale.",
    iconName: "Award",
    badge: "Leadership"
  },
  {
    year: 2019,
    title: "Partenariat Stratégique avec Compassion International",
    subtitle: "Centre de Développement de l'Enfant et des Jeunes (CDEJ)",
    description: "Établissement du partenariat d'envergure pour parrainer et encadrer holistiquement les enfants démunis sur les plans physique, intellectuel, émotionnel et spirituel.",
    iconName: "HeartHandshake",
    badge: "Impact Social"
  },
  {
    year: 2022,
    title: "Lancement de l'École Professionnelle (EPND)",
    subtitle: "École Professionnelle Nazaréen de Damé",
    description: "Inauguration du centre technique de formation aux métiers manuels et linguistiques (Couture, Maçonnerie, Musique, Anglais) pour lutter contre le chômage des jeunes.",
    iconName: "GraduationCap",
    badge: "Formation"
  },
  {
    year: 2026,
    title: "Projet d'Élevage Caprin avec la Fondation Digicel",
    subtitle: "Autonomisation économique durable",
    description: "Déploiement d'un programme communautaire d'élevage caprin en partenariat avec la Fondation Digicel pour soutenir le revenu des familles vulnérables de la 3ème Section Damé.",
    iconName: "Sparkles",
    badge: "Innovation & Avenir"
  }
];

export const CHURCH_COUNCIL: ChurchLeader[] = [
  {
    name: "Pasteur Bequel CHERELUS",
    role: "Pasteur Principal",
    department: "Direction Spirituelle & Générale",
    bio: "En charge de l'Église du Nazaréen de Damé depuis 2003. Il conduit la vision pastorale, l'enseignement biblique et la coordination générale des œuvres communautaires et éducatives de la paroisse.",
    period: "Depuis 2003"
  },
  {
    name: "Césaire FAUBLAS",
    role: "Président du Conseil d'Église",
    department: "Gouvernance & Administration",
    bio: "Assure la présidence administrative du Conseil d'Église, veille à la saine gestion institutionnelle et à la cohérence des décisions de l'assemblée.",
    period: "Membre actif"
  },
  {
    name: "Nineder CILLAS",
    role: "Secrétaire",
    department: "Secrétariat Général",
    bio: "Supervise la tenue des registres paroissiaux, la correspondance officielle de l'Église et la documentation des procès-verbaux des assemblées.",
    period: "Membre actif"
  },
  {
    name: "Wilmond SILAS",
    role: "2ème Secrétaire",
    department: "Secrétariat & Archives",
    bio: "Appuie le secrétariat général dans l'organisation logistique, les communications administratives et la préservation de la mémoire documentaire.",
    period: "Membre actif"
  },
  {
    name: "Jean Tamara",
    role: "Trésorier",
    department: "Trésorerie & Finances",
    bio: "Responsable de la gérance financière, de la reddition de comptes transparente des dîmes, offrandes et dons pour les chantiers et ministères de l'Église.",
    period: "Membre actif"
  }
];

export const DEPARTMENT_LEADERS: ChurchLeader[] = [
  {
    name: "Jimmy CHERELUS",
    role: "Responsable JNI",
    department: "Jeunesse Nazaréenne Internationale",
    bio: "Mobilise, équipe et encadre la jeunesse de l'Église à travers des séminaires spirituels, des activités sportives, l'engagement civique et les jeux bibliques.",
  },
  {
    name: "Adline PIERRE",
    role: "Responsable Ministère des Femmes",
    department: "Ministère des Femmes",
    bio: "Anime les réunions de prière, les cercles de solidarité féminine, les cellules d'entraide maternelle et les journées de formation chrétienne.",
  },
  {
    name: "Mackson D’OUTILS",
    role: "Responsable Ministère des Hommes",
    department: "Ministère des Hommes",
    bio: "Coordonne les initiatives d'affermissement des chefs de famille, l'entretien des infrastructures ecclésiales et les chantiers communautaires.",
  },
  {
    name: "Carnette DAREUS",
    role: "Responsable Chorale & Musique",
    department: "Louange & Adoration",
    bio: "Dirige les ensembles vocaux, la formation des chantres et assure la louange liturgique au cours de l'ensemble des célébrations dominicales et festives.",
  }
];

export const ARTICLES_OF_FAITH = [
  {
    num: "I",
    title: "Le Dieu Unique : Père, Fils et Saint-Esprit",
    desc: "Nous croyons en un seul Dieu, créateur de toutes choses, éternellement existant en trois personnes : Père, Fils et Saint-Esprit."
  },
  {
    num: "II",
    title: "Jésus-Christ notre Sauveur",
    desc: "Nous croyons en Jésus-Christ, vrai Dieu et vrai homme, mort pour nos péchés sur la croix, ressuscité corporellement et assis à la droite du Père."
  },
  {
    num: "III",
    title: "Le Saint-Esprit",
    desc: "Nous croyons au Saint-Esprit, qui convainc le monde de péché, régénère ceux qui croient et sanctifie les croyants."
  },
  {
    num: "IV",
    title: "Les Saintes Écritures",
    desc: "Nous croyons que la Bible est la Parole inspirée et inerrante de Dieu quant au salut, norme suprême de notre foi et de notre conduite."
  },
  {
    num: "V",
    title: "La Grâce Prévenante & le Libre Arbitre",
    desc: "La grâce de Dieu est offerte à tous les êtres humains, rendant possible la repentance et la foi par l'action de l'Esprit."
  },
  {
    num: "VI",
    title: "L'Entière Sanctification — « Sainteté à l’Éternel »",
    desc: "Cœur théologique de l'Église du Nazaréen : l'acte de grâce par lequel Dieu purifie le cœur du croyant du péché inné et le remplit de son amour parfait."
  }
];

export const MINISTRIES_LIST: Ministry[] = [
  {
    id: "enfants",
    name: "Ministère des Enfants & École du Dimanche",
    targetAudience: "Enfants de 3 à 12 ans",
    leader: "[À COMPLÉTER]",
    schedule: "Dimanche 16h00",
    description: "Transmettre les récits bibliques, l'amour du Christ et les principes de vie chrétienne dès le plus jeune âge dans un environnement pédagogique joyeux et sécurisé.",
    activities: ["Leçons bibliques illustrées", "Mémorisation de versets", "Chants et animations récréatives", "Fêtes bibliques annuelles"],
    icon: "Baby"
  },
  {
    id: "jni",
    name: "Jeunesse Nazaréenne Internationale (JNI)",
    targetAudience: "Jeunes de 13 à 30 ans",
    leader: "Jimmy CHERELUS",
    schedule: "Samedi 15h00",
    description: "Développer des disciples passionnés, bâtir une fraternité solide et former les futurs leaders de l'Église et de la société haïtienne.",
    activities: ["Rassemblements hebdomadaires", "Compétitions de Jeux Bibliques", "Ateliers leadership et orientation", "Évangélisation en plein air"],
    icon: "Zap"
  },
  {
    id: "femmes",
    name: "Ministère des Femmes",
    targetAudience: "Toutes les femmes de l'assemblée",
    leader: "Adline PIERRE",
    schedule: "Mardi & Vendredi 16h00",
    description: "Un espace de ressourcement spirituel, d'intercession et d'autonomisation pour les mères, sœurs et jeunes femmes chrétiennes.",
    activities: ["Groupes d'intercession matinale", "Solidarité mutuelle pour les veuves", "Séminaires sur la famille chrétienne", "Projets d'entraide économique"],
    icon: "Heart"
  },
  {
    id: "hommes",
    name: "Ministère des Hommes",
    targetAudience: "Pères et jeunes adultes",
    leader: "Mackson D’OUTILS",
    schedule: "1er et 3ème Dimanche du mois",
    description: "Équiper les hommes pour être des modèles de sainteté, des soutiens fermes pour leurs foyers et des serviteurs dévoués de l'Église.",
    activities: ["Déjeuners de prière fraternels", "Participation aux travaux d'infrastructure", "Mentorat des jeunes garçons", "Conférences sur l'intégrité"],
    icon: "Shield"
  },
  {
    id: "chorale",
    name: "Chorale & Louange Liturgique",
    targetAudience: "Musiciens, chantres et choristes",
    leader: "Carnette DAREUS",
    schedule: "Mercredi & Samedi après-midi",
    description: "Porter la congrégation dans une adoration pure et sanctifiée, glorifiant l'Éternel par des hymnes traditionnels et cantiques inspirés.",
    activities: ["Répétitions polyphoniques", "Formation vocale et solfège", "Concerts spirituels à Pâques et Noël", "Direction musicale des cultes"],
    icon: "Music"
  },
  {
    id: "evangelisation",
    name: "Ministère d'Évangélisation & Missions",
    targetAudience: "Tous les membres engagés",
    leader: "[À COMPLÉTER]",
    schedule: "Samedi après-midi & Campagnes de réveil",
    description: "Porter la Bonne Nouvelle du salut en Jésus-Christ dans toute la 3ème Section Damé, la commune de Môle-Saint-Nicolas et les localités voisines.",
    activities: ["Porte-à-porte et visites à domicile", "Distribution de Bibles et tracts", "Campagnes d'évangélisation sous tente", "Prière pour les malades"],
    icon: "Compass"
  }
];

export const EPND_COURSES: EpndCourse[] = [
  {
    id: "couture",
    title: "Formation Complète en Couture & Modélisme",
    duration: "9 mois",
    level: "Débutant à Professionnel",
    description: "Apprentissage complet de la coupe, patronage, assemblage sur machines industrielles et confection de vêtements traditionnels et modernes.",
    competencies: ["Prise de mesures précises", "Patronage et coupe sur tissu", "Utilisation de machines industrielles", "Finitions professionnelles et broderie"],
    instructor: "[À COMPLÉTER]",
    schedule: "Lundi, Mercredi, Vendredi (08h00 - 12h00)"
  },
  {
    id: "maconnerie",
    title: "Maçonnerie & Construction Parasismique",
    duration: "10 mois",
    level: "Certificat Technique Pratique",
    description: "Maîtrise des techniques de coffrage, dosage des bétons armés, chaînage parasismique et lecture de plans adaptés au climat haïtien.",
    competencies: ["Dosage sécuritaire mortiers et bétons", "Pose de blocs et chaînage armé", "Normes parasismiques et anticycloniques", "Lecture de plans de fondations"],
    instructor: "[À COMPLÉTER]",
    schedule: "Mardi, Jeudi, Samedi (08h00 - 12h00)"
  },
  {
    id: "musique",
    title: "Solfège, Clavier & Direction Musicale",
    duration: "6 mois (renouvelable)",
    level: "Tous niveaux",
    description: "Enseignement théorique et pratique du clavier, de la guitare, du solfège et de l'harmonie vocale pour le service ecclésial et personnel.",
    competencies: ["Lecture des clés de Sol et de Fa", "Accompagnement rythmique au piano", "Harmonisation des cantiques", "Direction de chœur de base"],
    instructor: "Carnette DAREUS & Intervenants",
    schedule: "Samedi matin (09h00 - 13h00)"
  },
  {
    id: "anglais",
    title: "Anglais Pratique & Professionnel",
    duration: "6 mois",
    level: "Élémentaire à Intermédiaire",
    description: "Perfectionnement linguistique axé sur l'expression orale, la communication internationale, le vocabulaire chrétien et les opportunités professionnelles.",
    competencies: ["Conversation fluide au quotidien", "Compréhension orale et écrite", "Vocabulaire professionnel et technique", "Rédaction administrative de base"],
    instructor: "[À COMPLÉTER]",
    schedule: "Mardi & Jeudi soir (17h00 - 19h00)"
  }
];

export const SOCIAL_PROJECTS: SocialProject[] = [
  {
    id: "cdej",
    title: "Centre de Développement de l'Enfant et des Jeunes (CDEJ)",
    partner: "Compassion International",
    year: "Depuis 2019",
    status: "Actif",
    description: "Programme de parrainage chrétien holistique pour des centaines d'enfants de Damé. Il garantit un suivi médical régulier, un repas nutritif, un soutien scolaire et un apprentissage biblique continu.",
    impactMetrics: [
      { label: "Enfants parrainés et suivis", value: "250+" },
      { label: "Bilans de santé annuels", value: "100%" },
      { label: "Années d'impact continu", value: "7 ans" },
      { label: "Repas nutritifs servis", value: "Plusieurs milliers" }
    ],
    keyObjectives: [
      "Libérer les enfants de la pauvreté au nom de Jésus",
      "Garantir l'accès à la scolarité et aux fournitures scolaires",
      "Fournir des bilans pédiatriques et vaccinations préventives",
      "Former les parents aux pratiques d'hygiène et de nutrition"
    ]
  },
  {
    id: "elevage-caprin",
    title: "Projet d'Élevage Caprin Communautaire",
    partner: "Fondation Digicel",
    year: "Lancement 2026",
    status: "Nouveau",
    description: "Projet économique solidaire octroyant des caprins reproducteurs de race améliorée aux familles de la communauté selon le principe du don rotatif (la première femelle née est transmise à une autre famille).",
    impactMetrics: [
      { label: "Familles bénéficiaires cibles", value: "80+" },
      { label: "Cheptel initial prévu", value: "[À COMPLÉTER]" },
      { label: "Partenaire financier", value: "Fondation Digicel" },
      { label: "Année de déploiement", value: "2026" }
    ],
    keyObjectives: [
      "Générer une source de revenu autonome pour les foyers vulnérables",
      "Former les éleveurs aux soins vétérinaires préventifs",
      "Instituer un mécanisme d'entraide rotatif transparent",
      "Valoriser les ressources agricoles locales de Damé"
    ]
  },
  {
    id: "solidarite-feminine",
    title: "Groupes de Solidarité Féminins & Micro-Crédit Solidaire",
    partner: "Ministère des Femmes",
    year: "En cours",
    status: "Actif",
    description: "Cercles d'épargne et de crédit communautaire (Mutuelle de solidarité) permettant aux femmes de développer de petits commerces vivriers et de subvenir aux dépenses scolaires de leurs enfants.",
    impactMetrics: [
      { label: "Groupes de femmes actifs", value: "4 groupes" },
      { label: "Taux de remboursement", value: "98%" },
      { label: "Bénéficiaires directes", value: "60+ mères" },
      { label: "Fonds solidaire autogéré", value: "Actif" }
    ],
    keyObjectives: [
      "Favoriser l'épargne locale sécurisée",
      "Financer le petit commerce de denrées agricoles et d'artisanat",
      "Créer un réseau fraternel d'assistance en cas de maladie ou de deuil"
    ]
  }
];

export const NEWS_ARTICLES: NewsArticle[] = [
  {
    id: "culte-reconnaissance-2026",
    title: "Culte solennel d'action de grâce : Témoignages de la fidélité de Dieu à Damé",
    category: "Spiritualité",
    date: "1er Février 2026",
    author: "Pasteur Bequel CHERELUS",
    readTime: "4 min",
    summary: "Retour sur un dimanche mémorable où l'assemblée s'est rassemblée pour glorifier l'Éternel et célébrer les bénédictions accordées à l'Église.",
    imageUrl: culteImg,
    content: [
      "L'Église du Nazaréen de Damé a vibré ce dimanche d'une louange fervente et d'une profonde ferveur spirituelle. Rassemblant plusieurs centaines de fidèles vêtus de blanc et aux couleurs de la fête, le culte a été marqué par des prières d'intercession pour notre pays et notre communauté.",
      "Le Pasteur Bequel CHERELUS a exhorté l'assemblée en s'appuyant sur le passage d'Ébène-Ézer (1 Samuel 7:12) : « Jusqu'ici l'Éternel nous a secourus ». Il a rappelé que la force de notre Église réside dans son attachement inaltérable au mandat de la sainteté.",
      "Les témoignages de guérison, de délivrance et de soutien mutuel partagés par les membres ont fortifié la foi des participants. La chorale paroissiale a interprété des cantiques inspirés qui ont transporté la congrégation dans une sainte présence."
    ]
  },
  {
    id: "lancement-projet-elevage-digicel",
    title: "Partenariat d'impact : Lancement du projet d'élevage caprin avec la Fondation Digicel",
    category: "Communauté",
    date: "15 Janvier 2026",
    author: "Conseil d'Administration",
    readTime: "5 min",
    summary: "L'Église officialise son initiative majeure avec la Fondation Digicel pour soutenir 80+ familles par le don rotatif d'animaux d'élevage.",
    imageUrl: "/images/cour_paysage.jpg",
    content: [
      "Dans le cadre de son engagement social en faveur de la 3ème Section Damé, l'Église du Nazaréen annonce fièrement le démarrage des préparatifs pour le projet d'élevage caprin avec le soutien de la Fondation Digicel.",
      "Ce programme vise à fournir à des ménages vulnérables des couples de caprins reproducteurs ainsi qu'une formation technique en santé animale. Le mécanisme communautaire prévoit que le premier chevreau né soit rétrocédé à une autre famille enregistrée, assurant ainsi la pérennité du projet.",
      "Le Pasteur Bequel CHERELUS a souligné : « L'Évangile doit toucher l'esprit, l'âme et le corps. Offrir un moyen de subsistance digne à nos concitoyens participe directement de notre témoignage chrétien »."
    ]
  },
  {
    id: "epnd-inscriptions-nouvelle-promotion",
    title: "École Professionnelle EPND : Inscriptions ouvertes pour la nouvelle session",
    category: "Éducation",
    date: "10 Janvier 2026",
    author: "Direction EPND",
    readTime: "3 min",
    summary: "Les filières de Couture, Maçonnerie, Musique et Anglais accueillent les candidatures des jeunes et adultes pour la session semestrielle.",
    imageUrl: "/images/ecole_facade.jpg",
    content: [
      "L'École Professionnelle Nazaréen de Damé (EPND) annonce le début des inscriptions pour ses quatre filières phares. Conçus pour répondre aux besoins concrets de développement du Môle-Saint-Nicolas, ces programmes durent entre 6 et 10 mois.",
      "Des bourses de scolarité partielle sont accordées aux jeunes en situation de précarité grâce au fonds de solidarité de l'Église. Les places étant limitées afin de garantir la pratique sur les équipements, il est recommandé de s'inscrire dès maintenant en ligne ou au secrétariat paroissial."
    ]
  },
  {
    id: "cdej-bilan-sante-annuel",
    title: "Centre CDEJ / Compassion International : Grand bilan pédiatrique pour 250+ enfants",
    category: "Communauté",
    date: "20 Décembre 2025",
    author: "Équipe Médicale & CDEJ",
    readTime: "4 min",
    summary: "Une équipe soignante a examiné tous les enfants enregistrés au programme de parrainage holistique hébergé au sein de notre paroisse.",
    imageUrl: "/images/comite.jpg",
    content: [
      "Pendant trois journées consécutives, les locaux de l'Église du Nazaréen de Damé ont accueilli les enfants du CDEJ pour leur visite médicale annuelle. Chaque enfant a bénéficié d'une évaluation de la croissance, d'un dépistage des carences et de distributions de vitamines et déparasitants.",
      "Nous remercions chaleureusement les parrains et marraines de Compassion International dont la générosité continue de transformer des vies dans le Nord-Ouest d'Haïti."
    ]
  },
  {
    id: "conference-jeunesse-jni",
    title: "Grand rassemblement JNI : « Une jeunesse consacrée et engagée pour Damé »",
    category: "Jeunesse",
    date: "18 Novembre 2025",
    author: "Jimmy CHERELUS",
    readTime: "3 min",
    summary: "Plus de 200 jeunes ont pris part aux conférences thématiques, compétitions de jeux bibliques et temps de louange intensifs.",
    imageUrl: "/images/logo.svg",
    content: [
      "La Jeunesse Nazaréenne Internationale de notre assemblée a organisé un week-end d'impact sous la direction de son président Jimmy CHERELUS. Entre tournois de mémorisation biblique, louange dynamique et réflexions sur l'avenir, les jeunes ont réaffirmé leur attachement au Christ.",
      "Des trophées ont été remis aux vainqueurs des jeux bibliques, soulignant l'importance de s'enraciner profondément dans les Écritures."
    ]
  }
];

export const MEDIA_GALLERY: MediaItem[] = [
  {
    id: "predication-saintete-2026",
    title: "« La Sainteté dans la Vie Quotidienne » — Prédication dominicale",
    type: "audio",
    date: "Dimanche 22 Février 2026",
    speaker: "Pasteur Bequel CHERELUS",
    duration: "42 min",
    category: "Prédications",
    thumbnailUrl: "/images/logo.svg",
    description: "Une exposition lumineuse de 1 Pierre 1:15-16. Comment refléter la pureté du cœur au milieu des défis économiques et moraux contemporains."
  },
  {
    id: "predication-esperance",
    title: "« Ne crains point, crois seulement » — Message d'encouragement",
    type: "video",
    date: "Dimanche 8 Février 2026",
    speaker: "Pasteur Bequel CHERELUS",
    duration: "35 min",
    category: "Prédications",
    thumbnailUrl: "/images/logo.svg",
    description: "Prédication enregistrée lors du culte matinal, appelant la communauté à garder les yeux fixés sur la puissance de résurrection de Jésus."
  },
  {
    id: "culte-louange-chorale",
    title: "Moments d'adoration avec la Chorale paroissiale",
    type: "audio",
    date: "Janvier 2026",
    speaker: "Chorale dirigée par Carnette DAREUS",
    duration: "28 min",
    category: "Chants & Louange",
    thumbnailUrl: "/images/logo.svg",
    description: "Sélection d'hymnes et cantiques sacrés d'action de grâce interprétés à 4 voix par l'ensemble choral de Damé."
  },
  {
    id: "photo-direction-comite",
    title: "Direction de l'École Nazareth & Comité de l'Église du Nazaréen de Damé",
    type: "photo",
    date: "Photo Officielle",
    category: "Leadership & Éducation",
    thumbnailUrl: "/images/comite.jpg",
    description: "Le corps pastoral présidé par le Pasteur Bequel Cherelus, la direction académique et les membres du conseil réunis devant l'École Nazareth."
  },
  {
    id: "photo-facade-ecole-nazareth",
    title: "Façade Officielle de l'École Nazareth de Fond Damé",
    type: "photo",
    date: "Patrimoine Scolaire",
    category: "Formation & Éducation",
    thumbnailUrl: "/images/ecole_facade.jpg",
    description: "Bâtiment d'instruction fondamentale du préscolaire à la 9ème AF, Rue Cimetière, 3ème Section Damé."
  },
  {
    id: "photo-cour-paysage",
    title: "Le Sanctuaire, la Cour et l'Enceinte Récréative",
    type: "photo",
    date: "Cadre de Vie Paroissial",
    category: "Vie Paroissiale",
    thumbnailUrl: "/images/cour_paysage.jpg",
    description: "Environnement extérieur verdoyant où les fidèles et les enfants de l'école se rassemblent à Fond Damé."
  }
];
