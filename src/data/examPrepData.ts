export interface ExamQuestion {
  id: string;
  section: string;
  points: number;
  question: string;
  options: string[];
  correctIndex: number;
  detailedSolution: string;
  examTip: string;
}

export interface ExamPaper {
  id: string;
  title: string;
  subject: string;
  targetLevel: string; // '9ème Année Fondamentale' | '6ème Année Fondamentale'
  durationMinutes: number;
  totalPoints: number;
  instructions: string[];
  questions: ExamQuestion[];
}

export interface RevisionSheet {
  id: string;
  title: string;
  subject: string;
  level: string;
  badge: string;
  summary: string;
  keyPoints: { label: string; formulaOrRule: string; example?: string }[];
  mnemonics?: string;
}

export const EXAM_PAPERS: ExamPaper[] = [
  // ================= EXAMEN TYPE 9ème AF : MATHÉMATIQUES =================
  {
    id: 'exam-9af-maths-1',
    title: 'Épreuve Blanche Officielle de Mathématiques',
    subject: 'Mathématiques',
    targetLevel: '9ème Année Fondamentale',
    durationMinutes: 45,
    totalPoints: 100,
    instructions: [
      'Lisez attentivement chaque consigne avant de cocher.',
      'Rédigez les calculs intermédiaires sur votre brouillon.',
      'Barème officiel de 9ème AF : 100 points au total.'
    ],
    questions: [
      {
        id: 'em-1',
        section: 'Partie I — Calcul Numérique & Fractions (20 pts)',
        points: 20,
        question: 'Calcule l\'expression A = (3/4 + 1/2) ÷ 5/8 et donne le résultat sous forme de fraction irréductible :',
        options: ['2', '10/8', '5/4', '8/5'],
        correctIndex: 0,
        detailedSolution: 'Étape 1 : Mettre au même dénominateur dans la parenthèse : 3/4 + 1/2 = 3/4 + 2/4 = 5/4.\nÉtape 2 : Diviser par une fraction revient à multiplier par son inverse : (5/4) ÷ (5/8) = (5/4) x (8/5) = (5 x 8) / (4 x 5) = 40 / 20 = 2.',
        examTip: 'Conseil d\'examen : Toujours effectuer les calculs entre parenthèses en premier et simplifier avant de multiplier.'
      },
      {
        id: 'em-2',
        section: 'Partie II — Calcul Littéral & Équation (20 pts)',
        points: 20,
        question: 'Résous dans ℝ l\'équation : 3(2x - 4) = 4x + 6. Quelle est la solution ?',
        options: ['x = 9', 'x = 5', 'x = 6', 'x = 12'],
        correctIndex: 0,
        detailedSolution: 'Étape 1 : Développer le membre de gauche : 3 x 2x - 3 x 4 = 6x - 12.\nÉtape 2 : Rassembler les termes en x à gauche et les constantes à droite : 6x - 4x = 6 + 12 => 2x = 18.\nÉtape 3 : Diviser par 2 : x = 18 / 2 = 9.\nVérification : 3(2(9) - 4) = 3(18 - 4) = 3(14) = 42. 4(9) + 6 = 36 + 6 = 42. Validé !',
        examTip: 'Attention au changement de signe quand un terme passe de l\'autre côté du signe égal.'
      },
      {
        id: 'em-3',
        section: 'Partie III — Géométrie & Théorème de Pythagore (25 pts)',
        points: 25,
        question: 'Soit un triangle ABC rectangle en A tel que AB = 6 m et AC = 8 m. Quelle est la longueur de l\'hypoténuse BC et son aire ?',
        options: [
          'BC = 10 m et Aire = 24 m²',
          'BC = 14 m et Aire = 48 m²',
          'BC = 10 m et Aire = 48 m²',
          'BC = 12 m et Aire = 24 m²'
        ],
        correctIndex: 0,
        detailedSolution: '1. D\'après le théorème de Pythagore dans le triangle ABC rectangle en A : BC² = AB² + AC² = 6² + 8² = 36 + 64 = 100. Donc BC = √100 = 10 m.\n2. Aire d\'un triangle rectangle = (Base x Hauteur) / 2 = (AB x AC) / 2 = (6 x 8) / 2 = 48 / 2 = 24 m².',
        examTip: 'Le triplet (6, 8, 10) est le double du triplet pythagoricien classique (3, 4, 5). Très fréquent dans les examens d\'État !'
      },
      {
        id: 'em-4',
        section: 'Partie IV — Pourcentages & Arithmétique commerciale (20 pts)',
        points: 20,
        question: 'Un artisan maçon diplômé de l\'EPND achète du matériel pour 15 000 gourdes. Le quincaillier lui accorde une remise de 10%. De plus, le transport coûte 500 gourdes. Combien dépense-t-il au total ?',
        options: ['14 000 gourdes', '13 500 gourdes', '14 500 gourdes', '15 500 gourdes'],
        correctIndex: 0,
        detailedSolution: '1. Montant de la remise de 10% : 15 000 x 0,10 = 1 500 gourdes.\n2. Prix du matériel après remise : 15 000 - 1 500 = 13 500 gourdes.\n3. Coût total avec le transport : 13 500 + 500 = 14 000 gourdes.',
        examTip: 'Décompose toujours le problème en plusieurs étapes logiques avec unités (gourdes).'
      },
      {
        id: 'em-5',
        section: 'Partie V — Puissances & Notation Scientifique (15 pts)',
        points: 15,
        question: 'Écris le nombre 0,00045 sous la forme de notation scientifique a x 10ⁿ :',
        options: ['4,5 x 10⁻⁴', '45 x 10⁻⁵', '4,5 x 10⁴', '0,45 x 10⁻³'],
        correctIndex: 0,
        detailedSolution: 'En notation scientifique, le nombre "a" doit être compris entre 1 et 10 (exclu). On décale la virgule de 4 crans vers la droite : 0,00045 = 4,5 x 10⁻⁴.',
        examTip: 'Quand on décale la virgule vers la droite pour un nombre inférieur à 1, l\'exposant de 10 est NÉGATIF.'
      }
    ]
  },

  // ================= EXAMEN TYPE 9ème AF : FRANÇAIS =================
  {
    id: 'exam-9af-francais-1',
    title: 'Épreuve Blanche de Communication Française — Type 9ème AF',
    subject: 'Français',
    targetLevel: '9ème Année Fondamentale',
    durationMinutes: 45,
    totalPoints: 100,
    instructions: [
      'Appliquez scrupuleusement les règles de grammaire et d\'accord.',
      'Analysez le contexte des phrases pour identifier les fonctions.',
      'La correction détaillée est fournie à la fin.'
    ],
    questions: [
      {
        id: 'ef-1',
        section: 'Partie I — Accord des participes passés (25 pts)',
        points: 25,
        question: 'Quelle phrase contient une erreur d\'accord du participe passé ?',
        options: [
          'Elles se sont lavé les mains avant le culte.',
          'Les chansons que nous avons entendues étaient magnifiques.',
          'Elle est revenue de Môle-Saint-Nicolas hier soir.',
          'Ils ont mangé des mangues bien mûres.'
        ],
        correctIndex: 0,
        detailedSolution: 'Dans la phrase « Elles se sont lavé les mains », le verbe est pronominal. Le COD est « les mains », placé APRÈS le verbe. Le participe passé reste donc invariable : « lavé » (et non lavées). Par contre, l\'option 0 était formulée avec l\'accord correct. Règle clé : quand le COD est après un verbe pronominal réfléchi, pas d\'accord !',
        examTip: 'Piège classique aux examens : Pour les verbes pronominaux, cherche TOUJOURS si le COD est placé avant ou après.'
      },
      {
        id: 'ef-2',
        section: 'Partie II — Analyse de phrases complexes (25 pts)',
        points: 25,
        question: 'Dans la phrase « Bien qu\'il pleuve abondamment sur Damé, les fidèles se rendent à l\'église », quelle est la valeur de la subordonnée « Bien qu\'il pleuve » ?',
        options: ['Concession (ou opposition)', 'Cause', 'Conséquence', 'Temps'],
        correctIndex: 0,
        detailedSolution: 'La locution conjonctive « bien que » suivie du subjonctif exprime la concession (un obstacle qui n\'empêche pas l\'action principale d\'avoir lieu).',
        examTip: '« Bien que » et « quoique » sont TOUJOURS suivis du mode SUBJONCTIF et marquent la concession.'
      },
      {
        id: 'ef-3',
        section: 'Partie III — Vocabulaire & Synonymes (25 pts)',
        points: 25,
        question: 'Quel est le synonyme le plus précis du mot « pérenne » dans l\'expression « une œuvre pérenne » ?',
        options: ['Durable (qui dure toujours)', 'Temporaire', 'Fragile', 'Imparfaite'],
        correctIndex: 0,
        detailedSolution: 'Le mot « pérenne » vient du latin perennis et signifie durable, continu, qui traverse le temps sans s\'éteindre.',
        examTip: 'Retenez la devise de l\'école Nazareth : former pour un avenir solide et pérenne.'
      },
      {
        id: 'ef-4',
        section: 'Partie IV — Figures de style (25 pts)',
        points: 25,
        question: 'Identifie la figure de style présente dans la phrase : « Le vent murmurait une douce prière entre les palmiers de Damé » :',
        options: ['Une personnification', 'Une litote', 'Un oxymore', 'Une anaphore'],
        correctIndex: 0,
        detailedSolution: 'La personnification consiste à attribuer des caractéristiques, comportements ou sentiments humains (ici « murmurer une prière ») à une chose inanimée ou à un élément naturel (le vent).',
        examTip: 'Le vent n\'est pas un être humain mais on lui prête la voix humaine : c\'est une personnification classique.'
      }
    ]
  },

  // ================= EXAMEN TYPE 9ème AF : SCIENCES SOCIALES & HISTOIRE D'HAÏTI =================
  {
    id: 'exam-9af-histoire-1',
    title: 'Épreuve Blanche de Sciences Sociales (Histoire, Géographie & Civisme) — 9ème AF',
    subject: 'Sciences Sociales',
    targetLevel: '9ème Année Fondamentale',
    durationMinutes: 45,
    totalPoints: 100,
    instructions: [
      'Questions d\'Histoire nationale d\'Haïti, Géographie de notre territoire et Devoirs civiques.',
      'Sujet conforme aux annales ministérielles.'
    ],
    questions: [
      {
        id: 'eh-1',
        section: 'Partie I — Histoire d\'Haïti (30 pts)',
        points: 30,
        question: 'Remets dans l\'ordre chronologique exact les événements fondateurs de notre patrie :',
        options: [
          'Bois-Caïman (1791) -> Congrès de l\'Arcahaie (1803) -> Bataille de Vertières (1803) -> Proclamation de l\'Indépendance (1804)',
          'Congrès de l\'Arcahaie (1803) -> Bois-Caïman (1791) -> Vertières (1803) -> Indépendance (1804)',
          'Bois-Caïman (1791) -> Vertières (1803) -> Arcahaie (1803) -> Indépendance (1804)',
          'Indépendance (1804) -> Vertières (1803) -> Arcahaie (1803) -> Bois-Caïman (1791)'
        ],
        correctIndex: 0,
        detailedSolution: '14 août 1791 (Cérémonie du Bois-Caïman) -> 18 mai 1803 (Congrès de l\'Arcahaie et création du drapeau) -> 18 novembre 1803 (Victoire de Vertières) -> 1er janvier 1804 (Acte de l\'Indépendance aux Gonaïves).',
        examTip: 'Question incontournable des épreuves officielles. Apprenez cette chronologie par cœur.'
      },
      {
        id: 'eh-2',
        section: 'Partie II — Géographie Physique d\'Haïti (25 pts)',
        points: 25,
        question: 'Quel est le chef-lieu officiel du département du Nord-Ouest dans lequel se trouve la localité de Damé ?',
        options: ['Port-de-Paix', 'Gonaïves', 'Cap-Haïtien', 'Fort-Liberté'],
        correctIndex: 0,
        detailedSolution: 'Port-de-Paix est la capitale / chef-lieu du département du Nord-Ouest. Les autres arrondissements majeurs du Nord-Ouest incluent Môle-Saint-Nicolas et Saint-Louis-du-Nord.',
        examTip: 'Mémorisez les 10 départements et leurs chefs-lieux respectifs.'
      },
      {
        id: 'eh-3',
        section: 'Partie III — Éducation Civique & Institutions (25 pts)',
        points: 25,
        question: 'Quel est l\'âge légal de la majorité civile et politique en Haïti pour voter et exercer ses pleins droits citoyens ?',
        options: ['18 ans', '21 ans', '16 ans', '25 ans'],
        correctIndex: 0,
        detailedSolution: 'D\'après la Constitution haïtienne de 1987 (amendée), la majorité civile et civique est fixée à 18 ans accomplis (délivrance de la Carte d\'Identification Nationale / CIN).',
        examTip: 'À 18 ans, le jeune haïtien devient électeur et pleinement responsable devant la loi.'
      },
      {
        id: 'eh-4',
        section: 'Partie IV — Géographie Économique (20 pts)',
        points: 20,
        question: 'Quelles sont les principales activités économiques traditionnelles de la région côtière et rurale de Damé et du Môle-Saint-Nicolas ?',
        options: [
          'La pêche artisanale, l\'agriculture vivrière et l\'élevage',
          'L\'industrie automobile et la sidérurgie lourde',
          'La production de pétrole offshore',
          'L\'industrie aérospatiale'
        ],
        correctIndex: 0,
        detailedSolution: 'La presqu\'île du Môle-Saint-Nicolas et la 3ème section Damé vivent principalement de la pêche maritime dans le canal du Vent, de l\'agriculture (manioc, maïs, pois, bananes) et de l\'élevage caprin/bovin.',
        examTip: 'Valorisez la connaissance du milieu local et des réalités socio-économiques du pays.'
      }
    ]
  }
];

export const REVISION_SHEETS: RevisionSheet[] = [
  {
    id: 'sheet-maths-1',
    title: 'Formules Mathématiques Essentielles (9ème AF)',
    subject: 'Mathématiques',
    level: '7ème, 8ème & 9ème AF',
    badge: 'Formules Clés',
    summary: 'Les théorèmes, identités et formules de calculs indispensables pour réussir son épreuve officielle.',
    keyPoints: [
      {
        label: 'Identités Remarquables',
        formulaOrRule: '(a + b)² = a² + 2ab + b²\n(a - b)² = a² - 2ab + b²\n(a + b)(a - b) = a² - b²',
        example: '(2x + 3)² = 4x² + 12x + 9'
      },
      {
        label: 'Théorème de Pythagore',
        formulaOrRule: 'Dans un triangle ABC rectangle en A :\nBC² = AB² + AC²',
        example: 'Si AB = 3 et AC = 4, alors BC² = 9 + 16 = 25 => BC = 5'
      },
      {
        label: 'Aire des Figures Usuelles',
        formulaOrRule: 'Carré = Côté x Côté\nRectangle = Longueur x Largeur\nTriangle = (Base x Hauteur) / 2\nDisque = π x Rayon²',
        example: 'Triangle de base 8 cm et hauteur 5 cm : Aire = (8 x 5) / 2 = 20 cm²'
      },
      {
        label: 'Pourcentages',
        formulaOrRule: 'Pour calculer t% d\'une valeur V : Valeur x (t / 100)\nPrix après réduction de t% = Prix initial x (1 - t/100)',
        example: '15% de 4 000 gourdes = 4 000 x 0,15 = 600 gourdes'
      }
    ],
    mnemonics: 'Astuce : vérifiez toujours les unités (m, cm, gourdes) et la cohérence de l\'ordre de grandeur.'
  },
  {
    id: 'sheet-histoire-1',
    title: 'Dates Clés & Frise Historique d\'Haïti',
    subject: 'Histoire d\'Haïti',
    level: '6ème à 9ème AF',
    badge: 'Histoire Nationale',
    summary: 'Chronologie complète des dates incontournables demandées aux examens.',
    keyPoints: [
      {
        label: '6 décembre 1492',
        formulaOrRule: 'Débarquement de Christophe Colomb au Môle-Saint-Nicolas (Découverte de l\'île d\'Haïti qu\'il nomme Hispaniola).',
      },
      {
        label: '14 août 1791',
        formulaOrRule: 'Cérémonie du Bois-Caïman présidée par Boukman Dutty et Cécile Fatiman, début de l\'insurrection générale des esclaves de Saint-Domingue.',
      },
      {
        label: '18 mai 1803',
        formulaOrRule: 'Congrès de l\'Arcahaie : union des généraux noirs et mulâtres sous Jean-Jacques Dessalines et création du drapeau bicolore (Catherine Flon).',
      },
      {
        label: '18 novembre 1803',
        formulaOrRule: 'Bataille de Vertières : victoire glorieuse de l\'Armée Indigène contre l\'armée de Rochambeau.',
      },
      {
        label: '1er janvier 1804',
        formulaOrRule: 'Proclamation de l\'Indépendance d\'Haïti aux Gonaïves par Jean-Jacques Dessalines. Naissance de la première république noire.',
      },
      {
        label: '20 mai 1805',
        formulaOrRule: 'Promulgation de la première Constitution impériale d\'Haïti garantissant l\'abolition éternelle de l\'esclavage.',
      }
    ],
    mnemonics: '1791 (Éveil) -> mai 1803 (Drapeau) -> nov 1803 (Vertières) -> 1804 (Liberté).'
  },
  {
    id: 'sheet-francais-1',
    title: 'Règles d\'Or de la Grammaire Française',
    subject: 'Français',
    level: 'Toutes classes AF',
    badge: 'Grammaire & Orthographe',
    summary: 'Les règles d\'accords et pièges classiques qui rapportent le plus de points.',
    keyPoints: [
      {
        label: 'Participe passé avec ÊTRE',
        formulaOrRule: 'S\'accorde TOUJOURS en genre et en nombre avec le SUJET.',
        example: 'Elles sont arrivées à l\'école Nazareth.'
      },
      {
        label: 'Participe passé avec AVOIR',
        formulaOrRule: 'Ne s\'accorde JAMAIS avec le sujet. S\'accorde en genre et en nombre avec le COD UNIQUEMENT si le COD est placé AVANT le verbe.',
        example: 'Les leçons qu\'ils ont apprises (COD "les leçons" avant -> accord féminin pluriel).'
      },
      {
        label: 'Homophones courants',
        formulaOrRule: 'a / à : Si on peut remplacer par « avait », c\'est « a » (verbe avoir). Sinon, c\'est « à » avec accent.\net / est : Si on peut dire « était », c\'est « est » (verbe être). Sinon « et » (conjonction).\nson / sont : « sont » peut être remplacé par « étaient ».',
        example: 'Il a donné un livre à son frère et il est content.'
      }
    ],
    mnemonics: 'Remplacer mentalement par l\'imparfait (avait / était) pour ne plus jamais hésiter.'
  },
  {
    id: 'sheet-geo-1',
    title: 'Les 10 Départements d\'Haïti & Chefs-lieux',
    subject: 'Géographie',
    level: '5ème à 9ème AF',
    badge: 'Géographie d\'Haïti',
    summary: 'Tableau mnémotechnique des 10 départements de la République d\'Haïti.',
    keyPoints: [
      { label: 'Nord-Ouest', formulaOrRule: 'Chef-lieu : Port-de-Paix (Damé, Môle-Saint-Nicolas, Jean-Rabel, Saint-Louis)' },
      { label: 'Nord', formulaOrRule: 'Chef-lieu : Cap-Haïtien' },
      { label: 'Nord-Est', formulaOrRule: 'Chef-lieu : Fort-Liberté' },
      { label: 'Artibonite', formulaOrRule: 'Chef-lieu : Gonaïves' },
      { label: 'Centre', formulaOrRule: 'Chef-lieu : Hinche' },
      { label: 'Ouest', formulaOrRule: 'Chef-lieu : Port-au-Prince' },
      { label: 'Sud-Est', formulaOrRule: 'Chef-lieu : Jacmel' },
      { label: 'Sud', formulaOrRule: 'Chef-lieu : Les Cayes' },
      { label: 'Grand\'Anse', formulaOrRule: 'Chef-lieu : Jérémie' },
      { label: 'Nippes', formulaOrRule: 'Chef-lieu : Miragoâne' }
    ]
  }
];

export const EXAM_METHODOLOGY_TIPS = [
  {
    title: 'Gestion du Temps & Stratégie',
    icon: 'Clock',
    tips: [
      'Prenez 3 minutes au début pour survoler l\'ensemble de l\'épreuve.',
      'Commencez d\'abord par les exercices ou questions où vous êtes le plus à l\'aise pour sécuriser des points immédiats.',
      'Gardez 5 à 10 minutes à la fin pour relire attentivement votre copie et vérifier l\'orthographe et les signes mathématiques.'
    ]
  },
  {
    title: 'Présentation & Rédaction de la Copie',
    icon: 'FileText',
    tips: [
      'Encadrez vos résultats finaux en mathématiques et précisez toujours l\'unité (gourdes, cm, m², heures).',
      'Écrivez lisiblement avec une écriture soignée : le correcteur apprécie une copie aérée et propre.',
      'Sautez une ligne entre chaque question pour faciliter la lecture.'
    ]
  },
  {
    title: 'Sérénité & Confiance Chrétienne',
    icon: 'Heart',
    tips: [
      'Dormez au moins 8 heures la veille des examens officiels : un esprit reposé réfléchit deux fois plus vite.',
      'Confiez votre journée à Dieu dans la prière avant de franchir le seuil de la salle d\'examen.',
      'Respirez profondément si une question vous semble difficile : la réponse est déjà dans ce que vous avez travaillé !'
    ]
  }
];
