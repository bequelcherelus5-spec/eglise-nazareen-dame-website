export interface EduQuestion {
  id: string;
  gradeLevel: number; // 1 to 9 (1ère AF to 9ème AF)
  gradeLabel: string; // "1ère AF", "2ème AF", etc.
  cycle: 1 | 2 | 3;
  subject: 'Mathématiques' | 'Français' | 'Sciences' | 'Histoire-Géo Haïti' | 'Civisme';
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  hint?: string;
}

export interface EduRiddle {
  id: string;
  title: string;
  gradeRange: string;
  clues: string[];
  answer: string;
  theme: 'Histoire d\'Haïti' | 'Géographie' | 'Nature & Sciences' | 'Vocabulaire' | 'Sagesse';
}

export const GRADE_LEVELS = [
  { level: 1, label: '1ère AF', cycle: 1, name: '1ère Année Fondamentale', age: '6-7 ans', color: 'from-blue-500 to-cyan-500' },
  { level: 2, label: '2ème AF', cycle: 1, name: '2ème Année Fondamentale', age: '7-8 ans', color: 'from-cyan-500 to-teal-500' },
  { level: 3, label: '3ème AF', cycle: 2, name: '3ème Année Fondamentale', age: '8-9 ans', color: 'from-emerald-500 to-green-600' },
  { level: 4, label: '4ème AF', cycle: 2, name: '4ème Année Fondamentale', age: '9-10 ans', color: 'from-green-600 to-amber-500' },
  { level: 5, label: '5ème AF', cycle: 2, name: '5ème Année Fondamentale', age: '10-11 ans', color: 'from-amber-500 to-orange-500' },
  { level: 6, label: '6ème AF', cycle: 2, name: '6ème Année Fondamentale (Fin 2e cycle)', age: '11-12 ans', color: 'from-orange-500 to-rose-500' },
  { level: 7, label: '7ème AF', cycle: 3, name: '7ème Année Fondamentale', age: '12-13 ans', color: 'from-purple-500 to-indigo-600' },
  { level: 8, label: '8ème AF', cycle: 3, name: '8ème Année Fondamentale', age: '13-14 ans', color: 'from-indigo-600 to-blue-700' },
  { level: 9, label: '9ème AF', cycle: 3, name: '9ème AF (Brevet d\'État)', age: '14-15+ ans', color: 'from-[#0F2C59] to-[#D4AF37]' },
];

export const EDU_QUESTIONS: EduQuestion[] = [
  // ================= 1ère ANNÉE FONDAMENTALE (1ère AF) =================
  {
    id: 'q1-1',
    gradeLevel: 1,
    gradeLabel: '1ère AF',
    cycle: 1,
    subject: 'Mathématiques',
    question: 'Combien font 5 + 3 ?',
    options: ['7', '8', '9', '6'],
    correctIndex: 1,
    explanation: '5 + 3 = 8. Si tu as 5 mangues et que tu en cueilles 3 autres, tu as 8 mangues au total !',
    hint: 'Compte 3 doigts après 5 : 6, 7, 8.'
  },
  {
    id: 'q1-2',
    gradeLevel: 1,
    gradeLabel: '1ère AF',
    cycle: 1,
    subject: 'Français',
    question: 'Quelle est la première lettre de l\'alphabet ?',
    options: ['B', 'Z', 'A', 'M'],
    correctIndex: 2,
    explanation: 'La première lettre de l\'alphabet français est la lettre A (comme dans Ananas ou Ami).',
    hint: 'C\'est la lettre qui commence "Arbre" ou "Avion".'
  },
  {
    id: 'q1-3',
    gradeLevel: 1,
    gradeLabel: '1ère AF',
    cycle: 1,
    subject: 'Sciences',
    question: 'Quel organe de notre corps nous permet d\'entendre les sons et la musique ?',
    options: ['Les yeux', 'Le nez', 'Les oreilles', 'La bouche'],
    correctIndex: 2,
    explanation: 'Ce sont les oreilles qui nous permettent d\'écouter la cloche de l\'école Nazareth et les cantiques.',
    hint: 'Nous en avons deux, placées de chaque côté de la tête.'
  },
  {
    id: 'q1-4',
    gradeLevel: 1,
    gradeLabel: '1ère AF',
    cycle: 1,
    subject: 'Histoire-Géo Haïti',
    question: 'Quelles sont les deux couleurs du drapeau national d\'Haïti ?',
    options: ['Bleu et Rouge', 'Vert et Blanc', 'Jaune et Noir', 'Rouge et Vert'],
    correctIndex: 0,
    explanation: 'Le drapeau haïtien est Bleu et Rouge, créé à l\'Arcahaie par Jean-Jacques Dessalines et Catherine Flon en mai 1803.',
    hint: 'Le bleu en haut, le rouge en bas avec les armoiries au centre.'
  },

  // ================= 2ème ANNÉE FONDAMENTALE (2ème AF) =================
  {
    id: 'q2-1',
    gradeLevel: 2,
    gradeLabel: '2ème AF',
    cycle: 1,
    subject: 'Mathématiques',
    question: 'Quel est le double de 6 ?',
    options: ['10', '12', '14', '16'],
    correctIndex: 1,
    explanation: 'Le double d\'un nombre, c\'est ce nombre multiplié par 2 (ou additionné avec lui-même) : 6 + 6 = 12.',
    hint: 'Fais 6 + 6.'
  },
  {
    id: 'q2-2',
    gradeLevel: 2,
    gradeLabel: '2ème AF',
    cycle: 1,
    subject: 'Français',
    question: 'Quel est le pluriel du mot « le livre » ?',
    options: ['Les livrent', 'Les livres', 'La livre', 'Des livress'],
    correctIndex: 1,
    explanation: 'En règle générale, pour former le pluriel d\'un nom, on ajoute un « s » : le livre -> les livres.',
    hint: 'L\'article "le" devient "les" et on met un "s" à la fin.'
  },
  {
    id: 'q2-3',
    gradeLevel: 2,
    gradeLabel: '2ème AF',
    cycle: 1,
    subject: 'Sciences',
    question: 'De quoi une plante a-t-elle absolument besoin pour grandir ?',
    options: ['D\'eau et de soleil', 'De soda et de sel', 'De vent et d\'obscurité', 'De bonbons'],
    correctIndex: 0,
    explanation: 'Les plantes de nos jardins à Damé ont besoin de terre fertile, d\'eau et de la lumière du soleil pour vivre.',
    hint: 'Pense à ce que la pluie et le ciel apportent au maïs.'
  },
  {
    id: 'q2-4',
    gradeLevel: 2,
    gradeLabel: '2ème AF',
    cycle: 1,
    subject: 'Histoire-Géo Haïti',
    question: 'Dans quelle commune et quel département se trouve la localité de Damé ?',
    options: ['Môle-Saint-Nicolas (Nord-Ouest)', 'Port-de-Paix (Artibonite)', 'Cap-Haïtien (Nord)', 'Les Cayes (Sud)'],
    correctIndex: 0,
    explanation: 'Damé est la 3ème section communale de la commune historique de Môle-Saint-Nicolas, dans le département du Nord-Ouest d\'Haïti.',
    hint: 'C\'est la pointe Nord-Ouest de notre presqu\'île.'
  },

  // ================= 3ème ANNÉE FONDAMENTALE (3ème AF) =================
  {
    id: 'q3-1',
    gradeLevel: 3,
    gradeLabel: '3ème AF',
    cycle: 2,
    subject: 'Mathématiques',
    question: 'Combien font 7 x 8 ?',
    options: ['54', '56', '64', '58'],
    correctIndex: 1,
    explanation: '7 x 8 = 56. Une table de multiplication indispensable à connaître par cœur pour toute la scolarité !',
    hint: '5 x 8 = 40, plus 2 x 8 (16) = 56.'
  },
  {
    id: 'q3-2',
    gradeLevel: 3,
    gradeLabel: '3ème AF',
    cycle: 2,
    subject: 'Français',
    question: 'Dans la phrase « Les élèves chantent avec joie », quel est le verbe conjugué ?',
    options: ['Les élèves', 'Chantent', 'Avec', 'Joie'],
    correctIndex: 1,
    explanation: '« Chantent » est le verbe chanter conjugué au présent de l\'indicatif à la 3e personne du pluriel (ils / elles chantent).',
    hint: 'C\'est l\'action que font les enfants.'
  },
  {
    id: 'q3-3',
    gradeLevel: 3,
    gradeLabel: '3ème AF',
    cycle: 2,
    subject: 'Sciences',
    question: 'Quels sont les trois états physiques de l\'eau dans la nature ?',
    options: ['Solide, liquide et gazeux', 'Chaud, froid et tiède', 'Lourd, léger et moyen', 'Terre, mer et ciel'],
    correctIndex: 0,
    explanation: 'L\'eau peut être solide (glace), liquide (eau que l\'on boit) ou gazeuse (vapeur d\'eau qui s\'évapore dans l\'air).',
    hint: 'Pense aux glaçons, à l\'eau du seau et à la vapeur de la casserole.'
  },
  {
    id: 'q3-4',
    gradeLevel: 3,
    gradeLabel: '3ème AF',
    cycle: 2,
    subject: 'Histoire-Géo Haïti',
    question: 'Quelle femme courageuse a cousu le premier drapeau haïtien en 1803 ?',
    options: ['Sanite Bélair', 'Catherine Flon', 'Marie-Jeanne Lamartinière', 'Suzanne Louverture'],
    correctIndex: 1,
    explanation: 'Catherine Flon est la marraine du drapeau haïtien ; elle a réuni le bleu et le rouge au Congrès de l\'Arcahaie le 18 mai 1803.',
    hint: 'Son nom commence par un C et son prénom est Catherine.'
  },

  // ================= 4ème ANNÉE FONDAMENTALE (4ème AF) =================
  {
    id: 'q4-1',
    gradeLevel: 4,
    gradeLabel: '4ème AF',
    cycle: 2,
    subject: 'Mathématiques',
    question: 'Quel est le périmètre d\'un rectangle de longueur 12 cm et de largeur 5 cm ?',
    options: ['17 cm', '60 cm', '34 cm', '24 cm'],
    correctIndex: 2,
    explanation: 'Périmètre = (Longueur + Largeur) x 2 = (12 + 5) x 2 = 17 x 2 = 34 cm. (L\'aire serait 12 x 5 = 60 cm²).',
    hint: 'Additionne la longueur et la largeur, puis multiplie le résultat par 2.'
  },
  {
    id: 'q4-2',
    gradeLevel: 4,
    gradeLabel: '4ème AF',
    cycle: 2,
    subject: 'Français',
    question: 'Quel est le participe passé du verbe « choisir » ?',
    options: ['Choisi', 'Choisit', 'Choisissant', 'Choisie'],
    correctIndex: 0,
    explanation: 'Le participe passé du verbe choisir (2e groupe) est « choisi ». Exemple : « Il a choisi d\'étudier sérieusement. »',
    hint: 'Les verbes du 2e groupe finissent leur participe passé par -i.'
  },
  {
    id: 'q4-3',
    gradeLevel: 4,
    gradeLabel: '4ème AF',
    cycle: 2,
    subject: 'Sciences',
    question: 'Quel gaz essentiel les êtres humains inspirent-ils pour respirer ?',
    options: ['L\'oxygène (O₂)', 'Le dioxyde de carbone', 'L\'azote pur', 'Le méthane'],
    correctIndex: 0,
    explanation: 'Nos poumons absorbent l\'oxygène présent dans l\'air et rejettent le dioxyde de carbone (gaz carbonique).',
    hint: 'C\'est le gaz que les arbres et les plantes produisent en plein jour.'
  },
  {
    id: 'q4-4',
    gradeLevel: 4,
    gradeLabel: '4ème AF',
    cycle: 2,
    subject: 'Histoire-Géo Haïti',
    question: 'Combien de départements géographiques compte la République d\'Haïti ?',
    options: ['5', '8', '10', '12'],
    correctIndex: 2,
    explanation: 'Haïti compte 10 départements : Nord, Nord-Est, Nord-Ouest, Artibonite, Centre, Ouest, Sud-Est, Sud, Grand\'Anse, Nippes.',
    hint: 'Deux fois le nombre de doigts d\'une seule main.'
  },

  // ================= 5ème ANNÉE FONDAMENTALE (5ème AF) =================
  {
    id: 'q5-1',
    gradeLevel: 5,
    gradeLabel: '5ème AF',
    cycle: 2,
    subject: 'Mathématiques',
    question: 'Que vaut 3/4 + 1/4 sous forme de nombre entier ?',
    options: ['4/8', '1', '2', '0.5'],
    correctIndex: 1,
    explanation: '3/4 + 1/4 = 4/4 = 1. Quatre quarts forment une unité complète.',
    hint: 'Si tu manges 3 parts sur 4 d\'un pain, puis la dernière part restante, tu as mangé tout le pain.'
  },
  {
    id: 'q5-2',
    gradeLevel: 5,
    gradeLabel: '5ème AF',
    cycle: 2,
    subject: 'Français',
    question: 'Dans la phrase « Paul envoie une lettre à sa mère », quelle est la fonction de « une lettre » ?',
    options: ['Sujet', 'Complément d\'Objet Direct (COD)', 'Complément d\'Objet Indirect (COI)', 'Attribut du sujet'],
    correctIndex: 1,
    explanation: '« Une lettre » répond à la question : Paul envoie QUOI ? C\'est donc le Complément d\'Objet Direct (COD). (« à sa mère » est le COI).',
    hint: 'Pose la question : Paul envoie quoi ?'
  },
  {
    id: 'q5-3',
    gradeLevel: 5,
    gradeLabel: '5ème AF',
    cycle: 2,
    subject: 'Sciences',
    question: 'Comment s\'appelle le phénomène par lequel les plantes fabriquent leur matière grâce au soleil ?',
    options: ['La respiration', 'La photosynthèse', 'La digestion', 'L\'évaporation'],
    correctIndex: 1,
    explanation: 'La photosynthèse permet aux plantes vertes, grâce à la chlorophylle et au soleil, de transformer le dioxyde de carbone et l\'eau en nutriments et oxygène.',
    hint: 'Le mot contient "photo" qui signifie lumière en grec.'
  },
  {
    id: 'q5-4',
    gradeLevel: 5,
    gradeLabel: '5ème AF',
    cycle: 2,
    subject: 'Histoire-Géo Haïti',
    question: 'En quelle année Christophe Colomb a-t-il débarqué sur l\'île d\'Haïti au Môle-Saint-Nicolas ?',
    options: ['1492', '1804', '1791', '1502'],
    correctIndex: 0,
    explanation: 'Christophe Colomb a débarqué le 6 décembre 1492 sur la presqu\'île du Môle-Saint-Nicolas, tout près de Damé, et a baptisé l\'île « Hispaniola ».',
    hint: 'C\'était à la fin du 15ème siècle.'
  },

  // ================= 6ème ANNÉE FONDAMENTALE (6ème AF - Fin 2e Cycle) =================
  {
    id: 'q6-1',
    gradeLevel: 6,
    gradeLabel: '6ème AF',
    cycle: 2,
    subject: 'Mathématiques',
    question: 'Un sac d\'engrais de 50 kg coûte 1 500 gourdes. Quel est le prix de 3 sacs identiques ?',
    options: ['3 000 gourdes', '4 500 gourdes', '4 000 gourdes', '5 000 gourdes'],
    correctIndex: 1,
    explanation: 'Situation de proportionnalité : 1 500 x 3 = 4 500 gourdes.',
    hint: 'Multiplie le prix unitaire par 3.'
  },
  {
    id: 'q6-2',
    gradeLevel: 6,
    gradeLabel: '6ème AF',
    cycle: 2,
    subject: 'Français',
    question: 'Conjugue le verbe « partir » au futur simple avec le pronom « Nous » :',
    options: ['Nous partirons', 'Nous partons', 'Nous partirions', 'Nous partîmes'],
    correctIndex: 0,
    explanation: 'Au futur simple, le verbe partir donne : je partirai, tu partiras, il partira, nous partirons, vous partirez, ils partiront.',
    hint: 'La terminaison du futur pour "nous" est toujours -ons.'
  },
  {
    id: 'q6-3',
    gradeLevel: 6,
    gradeLabel: '6ème AF',
    cycle: 2,
    subject: 'Histoire-Géo Haïti',
    question: 'Quel événement héroïque a eu lieu le 18 novembre 1803 en Haïti ?',
    options: ['La Bataille de Vertières', 'Le serment du Bois-Caïman', 'La mort de Toussaint Louverture', 'La fondation de Damé'],
    correctIndex: 0,
    explanation: 'La Bataille de Vertières le 18 novembre 1803 fut la victoire décisive de l\'Armée Indigène conduite par Jean-Jacques Dessalines et François Capois (la Mort) contre les troupes coloniales françaises de Rochambeau.',
    hint: 'Elle s\'est déroulée près du Cap-Haïtien et a ouvert la voie à l\'indépendance de 1804.'
  },
  {
    id: 'q6-4',
    gradeLevel: 6,
    gradeLabel: '6ème AF',
    cycle: 2,
    subject: 'Sciences',
    question: 'Quel est le plus long fleuve d\'Haïti qui traverse le plateau central pour irriguer la grande plaine ?',
    options: ['Le fleuve Artibonite', 'La rivière Grise', 'La rivière Massacre', 'La rivière des Barres'],
    correctIndex: 0,
    explanation: 'Le fleuve Artibonite est le plus long cours d\'eau de l\'île d\'Haïti (environ 320 km) ; il alimente le barrage de Péligre et irrigue la vallée agricole.',
    hint: 'Il donne son nom au 5ème département de notre pays.'
  },

  // ================= 7ème ANNÉE FONDAMENTALE (7ème AF - Début 3e Cycle) =================
  {
    id: 'q7-1',
    gradeLevel: 7,
    gradeLabel: '7ème AF',
    cycle: 3,
    subject: 'Mathématiques',
    question: 'Résous l\'équation du premier degré : 2x + 6 = 20. Quelle est la valeur de x ?',
    options: ['x = 7', 'x = 10', 'x = 8', 'x = 14'],
    correctIndex: 0,
    explanation: '2x + 6 = 20 => 2x = 20 - 6 => 2x = 14 => x = 14 / 2 => x = 7. Vérification : (2 x 7) + 6 = 14 + 6 = 20.',
    hint: 'Isole 2x en soustrayant 6 à 20, puis divise par 2.'
  },
  {
    id: 'q7-2',
    gradeLevel: 7,
    gradeLabel: '7ème AF',
    cycle: 3,
    subject: 'Français',
    question: 'Dans la phrase « La maison que mon oncle a construite est solide », quelle est la nature de « que mon oncle a construite » ?',
    options: ['Proposition subordonnée relative', 'Proposition subordonnée complétive', 'Proposition indépendante', 'Groupe nominal prépositionnel'],
    correctIndex: 0,
    explanation: 'Elle est introduite par le pronom relatif « que » qui a pour antécédent le nom « maison » : c\'est une proposition subordonnée relative.',
    hint: 'Elle complète le nom antécédent "la maison" grâce au pronom "que".'
  },
  {
    id: 'q7-3',
    gradeLevel: 7,
    gradeLabel: '7ème AF',
    cycle: 3,
    subject: 'Sciences',
    question: 'Quelle est l\'unité de base structurale et fonctionnelle de tous les êtres vivants ?',
    options: ['La cellule', 'L\'atome', 'Le tissu', 'L\'organe'],
    correctIndex: 0,
    explanation: 'Tous les organismes vivants (animaux, plantes, bactéries) sont composés d\'une ou plusieurs cellules.',
    hint: 'Elle possède généralement une membrane, un cytoplasme et un noyau.'
  },
  {
    id: 'q7-4',
    gradeLevel: 7,
    gradeLabel: '7ème AF',
    cycle: 3,
    subject: 'Histoire-Géo Haïti',
    question: 'Quelle date marque la proclamation officielle de l\'Indépendance d\'Haïti aux Gonaïves ?',
    options: ['1er janvier 1804', '18 mai 1803', '14 août 1791', '17 octobre 1806'],
    correctIndex: 0,
    explanation: 'Le 1er janvier 1804 aux Gonaïves, Jean-Jacques Dessalines et les généraux de l\'armée indigène ont proclamé la naissance de la première République noire libre du monde.',
    hint: 'C\'est le jour du Nouvel An qui est aussi notre fête nationale de l\'Indépendance (soupe au giraumon) !'
  },

  // ================= 8ème ANNÉE FONDAMENTALE (8ème AF) =================
  {
    id: 'q8-1',
    gradeLevel: 8,
    gradeLabel: '8ème AF',
    cycle: 3,
    subject: 'Mathématiques',
    question: 'Dans un triangle rectangle, les côtés de l\'angle droit mesurent 3 cm et 4 cm. Quelle est la longueur de l\'hypoténuse ?',
    options: ['5 cm', '7 cm', '12 cm', '6 cm'],
    correctIndex: 0,
    explanation: 'D\'après le Théorème de Pythagore : Hypoténuse² = 3² + 4² = 9 + 16 = 25. La racine carrée de 25 est 5 cm.',
    hint: 'Calcule 3² + 4² puis prends la racine carrée.'
  },
  {
    id: 'q8-2',
    gradeLevel: 8,
    gradeLabel: '8ème AF',
    cycle: 3,
    subject: 'Français',
    question: 'Quelle figure de style compare deux éléments sans utiliser de mot comparatif (« comme », « tel que ») ?',
    options: ['La métaphore', 'La comparaison', 'L\'hyperbole', 'L\'oxymore'],
    correctIndex: 0,
    explanation: 'La métaphore assimile directement deux réalités (ex : « Cet homme est un roc ») contrairement à la comparaison qui utilise un outil de comparaison (ex : « fort comme un roc »).',
    hint: 'On l\'appelle aussi une comparaison implicite.'
  },
  {
    id: 'q8-3',
    gradeLevel: 8,
    gradeLabel: '8ème AF',
    cycle: 3,
    subject: 'Sciences',
    question: 'Quelle formule relie la tension électrique (U en Volts), la résistance (R en Ohms) et l\'intensité (I en Ampères) ? (Loi d\'Ohm)',
    options: ['U = R x I', 'I = U x R', 'R = U x I', 'U = R / I'],
    correctIndex: 0,
    explanation: 'La Loi d\'Ohm fondamentale en électricité est U = R x I (la tension est égale au produit de la résistance par l\'intensité).',
    hint: 'Tension (U) = Résistance (R) multipliée par Courant (I).'
  },
  {
    id: 'q8-4',
    gradeLevel: 8,
    gradeLabel: '8ème AF',
    cycle: 3,
    subject: 'Civisme',
    question: 'Selon la Constitution haïtienne, quels sont les trois pouvoirs qui gouvernent l\'État ?',
    options: [
      'Pouvoir Législatif, Pouvoir Exécutif, Pouvoir Judiciaire',
      'Pouvoir Militaire, Pouvoir Religieux, Pouvoir Municipal',
      'Pouvoir Syndical, Pouvoir Économique, Pouvoir Citoyen',
      'Pouvoir Pastoral, Pouvoir Scolaire, Pouvoir Familial'
    ],
    correctIndex: 0,
    explanation: 'La séparation des pouvoirs est le principe de la démocratie haïtienne : le Législatif (Parlement), l\'Exécutif (Présidence et Gouvernement) et le Judiciaire (Tribunaux et Cours de justice).',
    hint: 'Faire les lois, exécuter les lois, juger selon les lois.'
  },

  // ================= 9ème ANNÉE FONDAMENTALE (9ème AF - Brevet d'État) =================
  {
    id: 'q9-1',
    gradeLevel: 9,
    gradeLabel: '9ème AF',
    cycle: 3,
    subject: 'Mathématiques',
    question: 'Développe et réduis l\'expression algébrique : (x + 5)²',
    options: ['x² + 25', 'x² + 10x + 25', 'x² + 5x + 25', '2x + 10'],
    correctIndex: 1,
    explanation: 'Identité remarquable : (a + b)² = a² + 2ab + b². Ici (x + 5)² = x² + (2 x x x 5) + 5² = x² + 10x + 25.',
    hint: 'N\'oublie pas le double produit 2ab.'
  },
  {
    id: 'q9-2',
    gradeLevel: 9,
    gradeLabel: '9ème AF',
    cycle: 3,
    subject: 'Mathématiques',
    question: 'Un commerçant de Môle-Saint-Nicolas accorde une réduction de 15% sur un article valant 2 000 gourdes. Quel est le montant payé ?',
    options: ['1 700 gourdes', '1 850 gourdes', '1 500 gourdes', '1 600 gourdes'],
    correctIndex: 0,
    explanation: 'Montant de la réduction : 2 000 x 0,15 = 300 gourdes. Prix final = 2 000 - 300 = 1 700 gourdes (ou 2 000 x 0,85 = 1 700 gourdes). Question type des examens officiels.',
    hint: '10% de 2000 = 200 gourdes, 5% = 100 gourdes. La réduction totale est de 300 gourdes.'
  },
  {
    id: 'q9-3',
    gradeLevel: 9,
    gradeLabel: '9ème AF',
    cycle: 3,
    subject: 'Français',
    question: 'Dans quelle phrase le participe passé est-il correctement accordé ?',
    options: [
      'Les lettres qu\'il a écrites sont bien rédigées.',
      'Les lettres qu\'il a écrit sont bien rédigé.',
      'Les lettres qu\'il a écris sont bien rédigée.',
      'Les lettres qu\'il ont écrite sont bien rédigé.'
    ],
    correctIndex: 0,
    explanation: 'Règle officielle : Avec l\'auxiliaire "avoir", le participe passé s\'accorde en genre et en nombre avec le COD s\'il est placé avant le verbe. Le COD "que" (mis pour "les lettres", féminin pluriel) est placé avant "a écrites", donc accord : "écrites".',
    hint: 'Le COD "les lettres" est placé AVANT le verbe avoir.'
  },
  {
    id: 'q9-4',
    gradeLevel: 9,
    gradeLabel: '9ème AF',
    cycle: 3,
    subject: 'Sciences',
    question: 'Quelle est la vitesse approximative de propagation de la lumière dans le vide ?',
    options: ['300 000 km/s', '340 m/s', '150 000 km/h', '1 000 km/s'],
    correctIndex: 0,
    explanation: 'La lumière voyage à environ 300 000 kilomètres par seconde (3 x 10⁸ m/s). Le son, lui, ne voyage qu\'à environ 340 mètres par seconde dans l\'air.',
    hint: 'C\'est 300 000 km en une seule seconde !'
  },
  {
    id: 'q9-5',
    gradeLevel: 9,
    gradeLabel: '9ème AF',
    cycle: 3,
    subject: 'Histoire-Géo Haïti',
    question: 'Quel chef historique a proclamé la Constitution impériale d\'Haïti en 1805 et est surnommé le « Père de la Patrie » ?',
    options: ['Jean-Jacques Dessalines', 'Henri Christophe', 'Alexandre Pétion', 'Toussaint Louverture'],
    correctIndex: 0,
    explanation: 'Jean-Jacques Dessalines (Jacques 1er), vainqueur de Vertières et fondateur d\'Haïti, a proclamé l\'Indépendance en 1804 et la Constitution de 1805 garantissant la liberté inaliénable du peuple.',
    hint: 'Le premier chef suprême et empereur d\'Haïti.'
  },
  {
    id: 'q9-6',
    gradeLevel: 9,
    gradeLabel: '9ème AF',
    cycle: 3,
    subject: 'Histoire-Géo Haïti',
    question: 'Quel est le point culminant (la plus haute montagne) de la République d\'Haïti ?',
    options: ['Le Pic la Selle (2 680 m)', 'Le Pic Macaya (2 347 m)', 'La Montagne Noire', 'Le Morne Jean'],
    correctIndex: 0,
    explanation: 'Le Pic la Selle culmine à 2 680 mètres d\'altitude dans la chaîne de la Selle (Sud-Est/Ouest). Le Pic Macaya est le deuxième sommet le plus élevé (2 347 m).',
    hint: 'Il se trouve dans le massif de la Selle.'
  }
];

export const EDU_RIDDLES: EduRiddle[] = [
  {
    id: 'rid-1',
    title: 'Le Géant de la Terre d\'Haïti',
    gradeRange: '3ème à 9ème AF',
    theme: 'Histoire d\'Haïti',
    clues: [
      'Je suis né sur l\'habitation Breda dans le Nord.',
      'On m\'appelait le Premier des Noirs ou le Centaure de la Savane.',
      'J\'ai réorganisé l\'agriculture et promulgué la constitution autonomiste de 1801.',
      'Emprisonné au Fort de Joux en France, j\'ai dit : « En me renversant, on n\'a abattu à Saint-Domingue que le tronc de l\'arbre de la liberté des noirs ; il repoussera par les racines... »'
    ],
    answer: 'Toussaint Louverture',
  },
  {
    id: 'rid-2',
    title: 'La Baie Historique du Nord-Ouest',
    gradeRange: '1ère à 9ème AF',
    theme: 'Géographie',
    clues: [
      'Je suis une rade stratégique et abritée située au bout de la presqu\'île du Nord-Ouest.',
      'C\'est sur mes côtes que Christophe Colomb a planté une croix le 6 décembre 1492.',
      'Je suis la commune dont dépend notre 3ème section Damé.',
      'Mes anciens forts coloniaux sont classés patrimoine historique national.'
    ],
    answer: 'Le Môle-Saint-Nicolas',
  },
  {
    id: 'rid-3',
    title: 'L\'Usine Verte de la Nature',
    gradeRange: '4ème à 9ème AF',
    theme: 'Nature & Sciences',
    clues: [
      'Je donne ma belle couleur verte aux feuilles des bananiers et des manguiers de Damé.',
      'Je capte l\'énergie des rayons du soleil.',
      'Grâce à moi, les végétaux produisent du glucose et rejettent de l\'oxygène pur.',
      'Sans moi, la photosynthèse ne pourrait pas exister.'
    ],
    answer: 'La Chlorophylle',
  },
  {
    id: 'rid-4',
    title: 'La Forteresse Imprenable',
    gradeRange: '5ème à 9ème AF',
    theme: 'Histoire d\'Haïti',
    clues: [
      'Je suis bâtie au sommet du Bonnet à l\'Évêque à 900 mètres d\'altitude à Milot.',
      'Le Roi Henri Christophe m\'a ordonnée pour défendre Haïti contre un éventuel retour des troupes coloniales.',
      'Je possède 365 canons de bronze et des murailles gigantesques.',
      'Je suis reconnue comme la 8ème merveille du monde et inscrite au patrimoine mondial de l\'UNESCO.'
    ],
    answer: 'La Citadelle Laferrière',
  },
  {
    id: 'rid-5',
    title: 'La Règle d\'Or de notre École',
    gradeRange: '1ère à 9ème AF',
    theme: 'Sagesse',
    clues: [
      'Je commence par la crainte de l\'Éternel selon le livre des Proverbes.',
      'Je permets à l\'enfant de Damé d\'acquérir des connaissances utiles et des compétences durables.',
      'Je suis la mission première de l\'École Fondamentale Nazareth et de l\'EPND.',
      'Nelson Mandela disait de moi : « Je suis l\'arme la plus puissante pour changer le monde. »'
    ],
    answer: 'L\'Éducation (L\'Instruction)',
  }
];
