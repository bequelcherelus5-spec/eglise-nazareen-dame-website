import { QuizQuestion, GameType, GameDifficulty, GameAudience } from '../types';

export const BIBLE_QUESTIONS_POOL: QuizQuestion[] = [
  // --- 1. QUIZ BIBLIQUE ---
  {
    id: "q-1",
    type: "quiz",
    difficulty: "facile",
    audience: "enfants",
    question: "Qui a construit l'arche pour échapper au déluge avec sa famille et les animaux ?",
    options: ["Abraham", "Noé", "Moïse", "David"],
    correctAnswer: "Noé",
    scriptureReference: "Genèse 6:13-14",
    explanation: "Dieu ordonna à Noé de bâtir une arche de bois de gopher pour préserver la vie pendant le déluge."
  },
  {
    id: "q-2",
    type: "quiz",
    difficulty: "facile",
    audience: "enfants",
    question: "Dans quelle ville Jésus est-il né ?",
    options: ["Nazareth", "Jérusalem", "Bethléem", "Jéricho"],
    correctAnswer: "Bethléem",
    scriptureReference: "Matthieu 2:1",
    explanation: "Jésus est né à Bethléem en Judée, accomplissant la prophétie de Michée 5:2."
  },
  {
    id: "q-3",
    type: "quiz",
    difficulty: "facile",
    audience: "jeunesse",
    question: "Quel jeune berger a vaincu le géant Goliath avec une fronde et une pierre ?",
    options: ["Salomon", "David", "Saül", "Jonathan"],
    correctAnswer: "David",
    scriptureReference: "1 Samuel 17:49-50",
    explanation: "David marcha contre Goliath au nom de l'Éternel des armées et le terrassa d'une seule pierre."
  },
  {
    id: "q-4",
    type: "quiz",
    difficulty: "moyen",
    audience: "jeunesse",
    question: "Quel apôtre a renié Jésus trois fois avant que le coq ne chante ?",
    options: ["Jean", "Pierre", "Jacques", "Thomas"],
    correctAnswer: "Pierre",
    scriptureReference: "Luc 22:60-61",
    explanation: "Pierre a affirmé ne pas connaître Jésus à trois reprises, puis il se souvint de la parole du Seigneur et pleura amèrement."
  },
  {
    id: "q-5",
    type: "quiz",
    difficulty: "moyen",
    audience: "adultes",
    question: "Quelle est la devise doctrinale fondamentale portée par l'Église du Nazaréen ?",
    options: ["La foi sans les œuvres", "Sainteté à l’Éternel", "La justice des hommes", "L'abondance matérielle"],
    correctAnswer: "Sainteté à l’Éternel",
    scriptureReference: "Exode 28:36 / 1 Pierre 1:16",
    explanation: "« Sainteté à l’Éternel » exprime le cœur théologique du mouvement wesleyen et nazaréen appelant à l'entière sanctification."
  },
  {
    id: "q-6",
    type: "quiz",
    difficulty: "difficile",
    audience: "adultes",
    question: "Quel roi d'Israël a succédé à David et a demandé la sagesse à Dieu plutôt que la richesse ?",
    options: ["Roboam", "Salomon", "Ézéchias", "Josias"],
    correctAnswer: "Salomon",
    scriptureReference: "1 Rois 3:9-12",
    explanation: "Salomon demanda un cœur intelligent pour juger le peuple et discerner le bien du mal."
  },
  {
    id: "q-7",
    type: "quiz",
    difficulty: "difficile",
    audience: "adultes",
    question: "Sur quelle montagne Moïse a-t-il reçu les tables des Dix Commandements ?",
    options: ["Mont Carmel", "Mont Sinaï (Horeb)", "Mont Nébo", "Mont des Oliviers"],
    correctAnswer: "Mont Sinaï (Horeb)",
    scriptureReference: "Exode 19:20 - 20:1",
    explanation: "L'Éternel descendit sur le mont Sinaï et proclama les commandements gravés sur les tables de pierre."
  },

  // --- 2. TROUVER LE VERSET ---
  {
    id: "v-1",
    type: "verset",
    difficulty: "facile",
    audience: "enfants",
    question: "Quel verset déclare : « Car Dieu a tant aimé le monde qu'il a donné son Fils unique, afin que quiconque croit en lui ne périsse point, mais qu'il ait la vie éternelle » ?",
    options: ["Jean 3:16", "Genèse 1:1", "Psaume 23:1", "Romains 8:28"],
    correctAnswer: "Jean 3:16",
    scriptureReference: "Jean 3:16",
    explanation: "C'est le résumé fondamental de l'Évangile et de l'amour rédempteur de Dieu pour l'humanité."
  },
  {
    id: "v-2",
    type: "verset",
    difficulty: "facile",
    audience: "jeunesse",
    question: "Quel verset célèbre commence par : « L'Éternel est mon berger : je ne manquerai de rien » ?",
    options: ["Psaume 1:1", "Psaume 23:1", "Psaume 91:1", "Psaume 119:105"],
    correctAnswer: "Psaume 23:1",
    scriptureReference: "Psaume 23:1",
    explanation: "Le Psaume 23 est le cantique de David exprimant la confiance absolue en la providence divine."
  },
  {
    id: "v-3",
    type: "verset",
    difficulty: "moyen",
    audience: "jeunesse",
    question: "« Ta parole est une lampe à mes pieds, et une lumière sur mon sentier. » De quel Psaume s'agit-il ?",
    options: ["Psaume 19:8", "Psaume 119:105", "Psaume 121:1", "Psaume 46:1"],
    correctAnswer: "Psaume 119:105",
    scriptureReference: "Psaume 119:105",
    explanation: "Le Psaume 119, le plus long de la Bible, célèbre la perfection et la clarté de la Parole de Dieu."
  },
  {
    id: "v-4",
    type: "verset",
    difficulty: "moyen",
    audience: "adultes",
    question: "« Recherchez la paix avec tous, et la sanctification, sans laquelle personne ne verra le Seigneur. » Où se trouve cette injonction ?",
    options: ["Romains 12:1", "Hébreux 12:14", "1 Thessaloniciens 5:23", "Jacques 1:22"],
    correctAnswer: "Hébreux 12:14",
    scriptureReference: "Hébreux 12:14",
    explanation: "Ce verset clé souligne que la sanctification est essentielle pour vivre dans la présence intime de Dieu."
  },
  {
    id: "v-5",
    type: "verset",
    difficulty: "difficile",
    audience: "adultes",
    question: "« Je puis tout par celui qui me fortifie. » Quelle est la référence exacte ?",
    options: ["Philippiens 4:13", "Éphésiens 3:20", "Colossiens 1:11", "Galates 2:20"],
    correctAnswer: "Philippiens 4:13",
    scriptureReference: "Philippiens 4:13",
    explanation: "L'apôtre Paul témoigne de la puissance du Christ qui lui permet de faire face à toutes les situations."
  },

  // --- 3. QUI SUIS-JE ? ---
  {
    id: "qsi-1",
    type: "qui-suis-je",
    difficulty: "facile",
    audience: "enfants",
    question: "Devinez qui je suis grâce aux indices suivants :",
    clues: [
      "J'ai été jeté dans une fosse aux lions pour avoir prié mon Dieu trois fois par jour.",
      "Dieu a envoyé son ange pour fermer la gueule des lions féroces.",
      "J'ai interprété les songes du roi Nebucadnetsar à Babylone."
    ],
    options: ["Joseph", "Daniel", "Samson", "Jonas"],
    correctAnswer: "Daniel",
    scriptureReference: "Daniel 6:16-22",
    explanation: "Daniel est resté inébranlable dans sa fidélité à Dieu malgré le décret royal babylonien."
  },
  {
    id: "qsi-2",
    type: "qui-suis-je",
    difficulty: "facile",
    audience: "jeunesse",
    question: "Devinez qui je suis :",
    clues: [
      "J'ai refusé d'aller prêcher à Ninive et j'ai pris la fuite en bateau vers Tarsis.",
      "Une violente tempête s'est levée et les marins m'ont jeté à la mer.",
      "J'ai passé trois jours et trois nuits dans le ventre d'un grand poisson."
    ],
    options: ["Élie", "Jonas", "Jérémie", "Zacharie"],
    correctAnswer: "Jonas",
    scriptureReference: "Jonas 1:17",
    explanation: "Jonas a finalement obéi à l'Éternel et a proclamé le message de repentance à Ninive."
  },
  {
    id: "qsi-3",
    type: "qui-suis-je",
    difficulty: "moyen",
    audience: "jeunesse",
    question: "Devinez qui je suis :",
    clues: [
      "Jeune femme juive devenue reine de Perse.",
      "Mon cousin Mardochée m'a prévenue du complot d'Haman contre mon peuple.",
      "J'ai risqué ma vie en disant : « Si je dois périr, je périrai ! »"
    ],
    options: ["Ruth", "Esther", "Débora", "Anne"],
    correctAnswer: "Esther",
    scriptureReference: "Esther 4:16",
    explanation: "La reine Esther a jeûné avec son peuple et a obtenu la délivrance des Juifs menacés d'extermination."
  },
  {
    id: "qsi-4",
    type: "qui-suis-je",
    difficulty: "difficile",
    audience: "adultes",
    question: "Devinez qui je suis :",
    clues: [
      "J'étais pharisien persécuteur des premiers chrétiens, présent lors de la lapidation d'Étienne.",
      "Une lumière éclatante venue du ciel m'a terrassé sur le chemin de Damas.",
      "Je suis devenu l'apôtre des nations et j'ai rédigé treize épîtres du Nouveau Testament."
    ],
    options: ["Pierre", "Barnabas", "Paul (Saul de Tarse)", "Apollos"],
    correctAnswer: "Paul (Saul de Tarse)",
    scriptureReference: "Actes 9:3-6",
    explanation: "Transformé par le Christ ressuscité, Paul a prêché l'Évangile dans tout le monde gréco-romain."
  },

  // --- 4. COMPLÉTER LE TEXTE ---
  {
    id: "c-1",
    type: "completer",
    difficulty: "facile",
    audience: "enfants",
    question: "Complétez le verset : « Au commencement, Dieu créa les cieux et la _______. »",
    options: ["terre", "mer", "lune", "forêt"],
    correctAnswer: "terre",
    scriptureReference: "Genèse 1:1",
    explanation: "Genèse 1:1 ouvre l'Écriture par la création du cosmos par Dieu Tout-Puissant."
  },
  {
    id: "c-2",
    type: "completer",
    difficulty: "moyen",
    audience: "jeunesse",
    question: "« Mais le fruit de l'Esprit, c'est l'amour, la joie, la paix, la patience, la bonté, la bienveillance, la foi, la douceur, la _______. »",
    options: ["colère", "richesse", "maîtrise de soi", "force physique"],
    correctAnswer: "maîtrise de soi",
    scriptureReference: "Galates 5:22-23",
    explanation: "La maîtrise de soi (ou tempérance) couronne la liste des vertus produites par le Saint-Esprit."
  },
  {
    id: "c-3",
    type: "completer",
    difficulty: "moyen",
    audience: "adultes",
    question: "« Vous serez saints, car je suis _______, dit l'Éternel. »",
    options: ["juste", "saint", "grand", "miséricordieux"],
    correctAnswer: "saint",
    scriptureReference: "Lévitique 19:2 / 1 Pierre 1:16",
    explanation: "C'est l'appel fondamental à la sainteté personnelle et communautaire qui fonde la doctrine nazaréenne."
  },
  {
    id: "c-4",
    type: "completer",
    difficulty: "difficile",
    audience: "adultes",
    question: "« Car le salaire du péché, c'est la mort ; mais le don gratuit de Dieu, c'est la _______ en Jésus-Christ notre Seigneur. »",
    options: ["vie éternelle", "prospérité", "paix passagère", "gloire terrestre"],
    correctAnswer: "vie éternelle",
    scriptureReference: "Romains 6:23",
    explanation: "L'apôtre Paul oppose le châtiment inévitable du péché au cadeau immérité du salut éternel."
  },

  // --- 5. VRAI / FAUX ---
  {
    id: "vf-1",
    type: "vrai-faux",
    difficulty: "facile",
    audience: "enfants",
    question: "Vrai ou Faux : Jésus a nourri une foule de 5 000 hommes avec seulement cinq pains et deux poissons.",
    options: ["Vrai", "Faux"],
    correctAnswer: "Vrai",
    scriptureReference: "Jean 6:9-11",
    explanation: "Vrai ! Jésus a rendu grâces et a multiplié les pains et les poissons pour rassasier la foule avec des restes abondants."
  },
  {
    id: "vf-2",
    type: "vrai-faux",
    difficulty: "facile",
    audience: "jeunesse",
    question: "Vrai ou Faux : L'arche de l'alliance a été construite par le roi Hérode pour orner son palais.",
    options: ["Vrai", "Faux"],
    correctAnswer: "Faux",
    scriptureReference: "Exode 25:10",
    explanation: "Faux ! L'arche de l'alliance a été fabriquée sur ordre de Dieu au désert par Moïse et Betsaleel pour le Tabernacle."
  },
  {
    id: "vf-3",
    type: "vrai-faux",
    difficulty: "moyen",
    audience: "adultes",
    question: "Vrai ou Faux : Dans la théologie nazaréenne, l'entière sanctification est une œuvre de la grâce divine reçue par la foi.",
    options: ["Vrai", "Faux"],
    correctAnswer: "Vrai",
    scriptureReference: "Articles de foi de l'Église du Nazaréen",
    explanation: "Vrai ! L'entière sanctification n'est pas obtenue par les efforts humains mais purifiée par le Saint-Esprit reçu par la foi."
  },
  {
    id: "vf-4",
    type: "vrai-faux",
    difficulty: "difficile",
    audience: "adultes",
    question: "Vrai ou Faux : L'apôtre Jean a été le premier des douze apôtres à subir le martyre en mourant décapité à Jérusalem.",
    options: ["Vrai", "Faux"],
    correctAnswer: "Faux",
    scriptureReference: "Actes 12:2",
    explanation: "Faux ! C'est Jacques, frère de Jean, qui a été le premier apôtre martyr, exécuté sous Hérode Agrippa. Jean est mort d'âge avancé à Éphèse."
  },

  // --- 6. DÉFI MÉMOIRE (Paires bibliques) ---
  {
    id: "mem-1",
    type: "memoire",
    difficulty: "facile",
    audience: "enfants",
    question: "Retrouvez les paires bibliques associées :",
    options: ["David - Goliath", "Noé - L'Arche", "Moïse - Les Dix Commandements", "Jonas - Le Grand Poisson"],
    correctAnswer: "4 paires",
    scriptureReference: "Histoires fondamentales de l'Ancien Testament",
    explanation: "Associez chaque personnage historique à l'événement marquant de sa vie."
  },
  {
    id: "mem-2",
    type: "memoire",
    difficulty: "moyen",
    audience: "jeunesse",
    question: "Associez les apôtres et disciples avec leur appel ou attribut :",
    options: ["Pierre - Les Clés du Royaume", "Paul - L'Apôtre des Nations", "Jean - Le Disciple Bien-Aimé", "Matthieu - L'Ancien Péager"],
    correctAnswer: "4 paires",
    scriptureReference: "Évangiles et Actes",
    explanation: "Les disciples du Seigneur ont chacun répondu à une vocation spécifique."
  }
];

export const MEMORY_CARDS_PAIRS = [
  { id: '1a', pairId: 1, title: 'Noé', subtitle: 'Patriarche fidèle', icon: 'Ship' },
  { id: '1b', pairId: 1, title: "L'Arche", subtitle: 'Salut sur les eaux', icon: 'Waves' },
  { id: '2a', pairId: 2, title: 'Moïse', subtitle: 'Guide d’Israël', icon: 'Scroll' },
  { id: '2b', pairId: 2, title: 'Mont Sinaï', subtitle: 'Dix Commandements', icon: 'Mountain' },
  { id: '3a', pairId: 3, title: 'David', subtitle: 'Roi berger', icon: 'Crown' },
  { id: '3b', pairId: 3, title: 'Goliath', subtitle: 'Géant philistin', icon: 'ShieldAlert' },
  { id: '4a', pairId: 4, title: 'Jésus-Christ', subtitle: 'Le Bon Berger', icon: 'Cross' },
  { id: '4b', pairId: 4, title: 'La Résurrection', subtitle: 'Victoire sur la mort', icon: 'Sun' },
  { id: '5a', pairId: 5, title: 'Daniel', subtitle: 'Fidèle en prière', icon: 'UserCheck' },
  { id: '5b', pairId: 5, title: 'La Fosse aux Lions', subtitle: 'Délivrance miraculeuse', icon: 'Shield' },
  { id: '6a', pairId: 6, title: 'Sainteté', subtitle: '« À l’Éternel »', icon: 'Sparkles' },
  { id: '6b', pairId: 6, title: 'Église du Nazaréen', subtitle: 'Damé (1979)', icon: 'Church' },
];
