import { QuizQuestion, GameType, GameDifficulty, GameAudience } from '../src/types';

export interface GenerateQuestionsParams {
  gameType: GameType;
  difficulty: GameDifficulty;
  audience: GameAudience;
  theme?: string;
  count?: number;
}

export const FALLBACK_BIBLE_AI_POOL: QuizQuestion[] = [
  // --- Évangiles & Vie de Jésus ---
  {
    id: "ai-ev-1",
    type: "quiz",
    difficulty: "facile",
    audience: "enfants",
    question: "Où Jésus a-t-il accompli son tout premier miracle en changeant l'eau en vin ?",
    options: ["À Jérusalem", "Aux noces de Cana", "À Capernaüm", "À Béthanie"],
    correctAnswer: "Aux noces de Cana",
    scriptureReference: "Jean 2:1-11",
    explanation: "C'est à Cana en Galilée que Jésus manifesta pour la première fois sa gloire divine en transformant l'eau en vin lors d'un festin de noces."
  },
  {
    id: "ai-ev-2",
    type: "quiz",
    difficulty: "moyen",
    audience: "jeunesse",
    question: "Qui est monté sur un sycomore pour réussir à apercevoir Jésus parmi la foule à Jéricho ?",
    options: ["Nicodème", "Bartimée", "Zachée", "Lazare"],
    correctAnswer: "Zachée",
    scriptureReference: "Luc 19:1-10",
    explanation: "Zachée, chef des collecteurs d'impôts de petite taille, grimpa sur un sycomore. Jésus le vit et logea chez lui, amenant le salut dans sa maison."
  },
  {
    id: "ai-ev-3",
    type: "quiz",
    difficulty: "difficile",
    audience: "adultes",
    question: "Combien de corbeilles pleines de morceaux de pain ont été ramassées après la première multiplication des 5 pains et 2 poissons ?",
    options: ["7 corbeilles", "10 corbeilles", "12 corbeilles", "3 corbeilles"],
    correctAnswer: "12 corbeilles",
    scriptureReference: "Matthieu 14:20",
    explanation: "Tous mangèrent et furent rassasiés, et l'on emporta douze corbeilles pleines des morceaux qui restaient, symbolisant la plénitude pour les 12 tribus d'Israël."
  },
  {
    id: "ai-ev-4",
    type: "verset",
    difficulty: "facile",
    audience: "enfants",
    question: "Quel verset proclame : « Je suis le chemin, la vérité, et la vie. Nul ne vient au Père que par moi » ?",
    options: ["Jean 14:6", "Jean 10:10", "Matthieu 28:19", "Marc 16:15"],
    correctAnswer: "Jean 14:6",
    scriptureReference: "Jean 14:6",
    explanation: "Jésus répondit à Thomas en affirmant son identité unique comme le seul accès au salut et à la communion éternelle avec le Père céleste."
  },
  {
    id: "ai-ev-5",
    type: "qui-suis-je",
    difficulty: "moyen",
    audience: "jeunesse",
    question: "Qui suis-je ? J'ai été ressuscité par Jésus après avoir passé quatre jours dans le tombeau à Béthanie.",
    options: ["Jaïrus", "Lazare", "Siméon", "Étienne"],
    correctAnswer: "Lazare",
    scriptureReference: "Jean 11:43-44",
    explanation: "Frère de Marthe et Marie à Béthanie, Lazare est sorti du sépulcre lié de bandes lorsque Jésus a crié d'une voix forte : « Lazare, sors ! ».",
    clues: [
      "J'habitais le village de Béthanie avec mes deux sœurs Marthe et Marie.",
      "J'étais déjà enseveli depuis quatre jours lorsque le Seigneur est arrivé.",
      "Jésus a pleuré devant mon sépulcre avant de m'ordonner de sortir vivant."
    ]
  },
  {
    id: "ai-ev-6",
    type: "vrai-faux",
    difficulty: "facile",
    audience: "enfants",
    question: "Vrai ou Faux : Jésus a marché sur les eaux de la mer de Galilée en pleine tempête.",
    options: ["Vrai", "Faux"],
    correctAnswer: "Vrai",
    scriptureReference: "Matthieu 14:25-27",
    explanation: "Vrai. À la quatrième veille de la nuit, Jésus s'avança vers les disciples marchant sur la mer agitée en disant : « Rassurez-vous, c'est moi ; n'ayez pas peur ! »."
  },

  // --- Ancien Testament & Foi des Héros ---
  {
    id: "ai-at-1",
    type: "quiz",
    difficulty: "facile",
    audience: "enfants",
    question: "Dans quel fleuve le bébé Moïse a-t-il été déposé dans une corbeille d'ébénier garnie de bitume ?",
    options: ["Le Jourdain", "Le Nil", "L'Euphrate", "Le Tigre"],
    correctAnswer: "Le Nil",
    scriptureReference: "Exode 2:3",
    explanation: "Sa mère Yokébed le cacha trois mois, puis le plaça au milieu des roseaux sur la rive du Nil où la fille de Pharaon le découvrit."
  },
  {
    id: "ai-at-2",
    type: "quiz",
    difficulty: "moyen",
    audience: "jeunesse",
    question: "Combien de jours et de nuits le prophète Jonas a-t-il passés dans le ventre du grand poisson ?",
    options: ["7 jours et 7 nuits", "3 jours et 3 nuits", "40 jours et 40 nuits", "1 jour et 1 nuit"],
    correctAnswer: "3 jours et 3 nuits",
    scriptureReference: "Jonas 1:17 (ou Jonas 2:1)",
    explanation: "L'Éternel fit venir un grand poisson pour engloutir Jonas ; Jonas demeura dans les entrailles du poisson trois jours et trois nuits avant de prier avec ferveur."
  },
  {
    id: "ai-at-3",
    type: "quiz",
    difficulty: "difficile",
    audience: "adultes",
    question: "Sur quel mont le prophète Élie a-t-il défié les 450 prophètes de Baal et fait descendre le feu du ciel ?",
    options: ["Le Mont Sinaï", "Le Mont Carmel", "Le Mont Horeb", "Le Mont Sion"],
    correctAnswer: "Le Mont Carmel",
    scriptureReference: "1 Rois 18:19-38",
    explanation: "Sur le mont Carmel, Élie restaura l'autel de l'Éternel et pria. Le feu de Dieu tomba, consuma l'holocauste et tout le peuple s'écria : « C'est l'Éternel qui est Dieu ! »."
  },
  {
    id: "ai-at-4",
    type: "qui-suis-je",
    difficulty: "facile",
    audience: "enfants",
    question: "Qui suis-je ? J'ai été jeté dans la fosse aux lions parce que je priais mon Dieu trois fois par jour malgré l'interdiction royale.",
    options: ["Daniel", "Joseph", "Néhémie", "Josué"],
    correctAnswer: "Daniel",
    scriptureReference: "Daniel 6:16-22",
    explanation: "Daniel resta fidèle à l'Éternel. Dieu envoya son ange fermer la gueule des lions et il sortit de la fosse indemne.",
    clues: [
      "J'étais gouverneur et sage à la cour de Babylone et de Perse.",
      "J'ouvrais les fenêtres de ma chambre tournées vers Jérusalem pour prier.",
      "Mon Dieu a envoyé son ange fermer la gueule des bêtes féroces."
    ]
  },
  {
    id: "ai-at-5",
    type: "verset",
    difficulty: "moyen",
    audience: "adultes",
    question: "Complétez le verset de Proverbes 3:5 : « Confie-toi en l'Éternel de tout ton cœur, et... »",
    options: [
      "ne t'appuie pas sur ta propre sagesse",
      "cherche l'approbation des grands",
      "ne crains pas le lendemain",
      "travaille pour amasser des trésors"
    ],
    correctAnswer: "ne t'appuie pas sur ta propre sagesse",
    scriptureReference: "Proverbes 3:5-6",
    explanation: "« Confie-toi en l'Éternel de tout ton cœur, et ne t'appuie pas sur ta propre sagesse ; reconnais-le dans toutes tes voies, et il aplanira tes sentiers. »"
  },

  // --- Actes des Apôtres & Première Église ---
  {
    id: "ai-act-1",
    type: "quiz",
    difficulty: "facile",
    audience: "enfants",
    question: "Le jour de la Pentecôte à Jérusalem, que s'est-il posé sur les apôtres réunis dans la chambre haute ?",
    options: ["Des colombes blanches", "Des langues semblables à des langues de feu", "Des couronnes d'or", "De l'huile parfumée"],
    correctAnswer: "Des langues semblables à des langues de feu",
    scriptureReference: "Actes 2:3",
    explanation: "Des langues, semblables à des langues de feu, leur apparurent, séparées les unes des autres, et se posèrent sur chacun d'eux. Et ils furent tous remplis du Saint-Esprit."
  },
  {
    id: "ai-act-2",
    type: "quiz",
    difficulty: "moyen",
    audience: "jeunesse",
    question: "Sur le chemin de quelle ville Saul de Tarse a-t-il été entouré d'une éclatante lumière céleste et a-t-il entendu la voix de Jésus ?",
    options: ["Damas", "Antioche", "Alexandrie", "Rome"],
    correctAnswer: "Damas",
    scriptureReference: "Actes 9:3-5",
    explanation: "Comme il était en chemin et qu'il approchait de Damas, une lumière resplendit autour de lui et Jésus lui dit : « Saul, Saul, pourquoi me persécutes-tu ? »."
  },
  {
    id: "ai-act-3",
    type: "qui-suis-je",
    difficulty: "moyen",
    audience: "jeunesse",
    question: "Qui suis-je ? J'étais diacre, rempli de grâce et de puissance spirituelle, et je fus le premier martyr chrétien lapidé à Jérusalem.",
    options: ["Philippe", "Barnabas", "Étienne", "Silas"],
    correctAnswer: "Étienne",
    scriptureReference: "Actes 7:55-60",
    explanation: "Étienne, les yeux fixés au ciel, vit la gloire de Dieu et Jésus debout à la droite de Dieu, pardonnant à ses bourreaux avant de s'endormir dans le Seigneur.",
    clues: [
      "J'ai été choisi parmi les sept hommes de bon témoignage pour le service des tables.",
      "Mon visage parut aux juges du sanhédrin comme celui d'un ange.",
      "En mourant sous les pierres, j'ai prié : « Seigneur, ne leur impute pas ce péché ! »."
    ]
  },
  {
    id: "ai-act-4",
    type: "vrai-faux",
    difficulty: "moyen",
    audience: "adultes",
    question: "Vrai ou Faux : C'est dans la ville d'Antioche que les disciples de Jésus reçurent pour la première fois le nom de « chrétiens ».",
    options: ["Vrai", "Faux"],
    correctAnswer: "Vrai",
    scriptureReference: "Actes 11:26",
    explanation: "Vrai. Pendant toute une année, Paul et Barnabas s'assemblèrent avec l'Église d'Antioche, et ce fut à Antioche que les disciples furent pour la première fois appelés chrétiens."
  },

  // --- Sainteté & Doctrine Nazaréenne ---
  {
    id: "ai-naz-1",
    type: "quiz",
    difficulty: "moyen",
    audience: "adultes",
    question: "D'après 1 Pierre 1:16 et Lévitique 19:2, quel appel solennel le Seigneur adresse-t-il à son peuple ?",
    options: [
      "« Soyez saints, car je suis saint »",
      "« Soyez puissants devant les nations »",
      "« Amassez pour les jours mauvais »",
      "« Cherchez la gloire terrestre »"
    ],
    correctAnswer: "« Soyez saints, car je suis saint »",
    scriptureReference: "1 Pierre 1:15-16",
    explanation: "L'apôtre Pierre rappelle la vocation sainte des croyants : « Mais, puisque celui qui vous a appelés est saint, vous aussi soyez saints dans toute votre conduite. »"
  },
  {
    id: "ai-naz-2",
    type: "verset",
    difficulty: "facile",
    audience: "jeunesse",
    question: "Quel texte de Galates 5:22 énumère les vertus du fruit de l'Esprit ?",
    options: [
      "Amour, joie, paix, patience, bonté, bienveillance, foi, douceur, maîtrise de soi",
      "Argent, succès, gloire, réputation, autorité",
      "Jeûne, sacrifices, règles strictes, ascétisme",
      "Science, éloquence, prophétie sans amour"
    ],
    correctAnswer: "Amour, joie, paix, patience, bonté, bienveillance, foi, douceur, maîtrise de soi",
    scriptureReference: "Galates 5:22-23",
    explanation: "Le fruit de l'Esprit est l'expression visible d'un cœur purifié et sanctifié par l'Esprit de Dieu."
  }
];

export function generateDynamicBibleQuestions(
  gameType: GameType,
  difficulty: GameDifficulty,
  audience: GameAudience,
  theme?: string,
  count: number = 5
): QuizQuestion[] {
  let matched = FALLBACK_BIBLE_AI_POOL.filter(q => {
    if (gameType && q.type !== gameType) return false;
    return true;
  });

  if (matched.length < count) {
    matched = FALLBACK_BIBLE_AI_POOL;
  }

  // Shuffle and pick
  const shuffled = [...matched].sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, count);

  return selected.map((q, idx) => ({
    ...q,
    id: `ai-gen-${Date.now()}-${idx + 1}`,
    difficulty: difficulty || q.difficulty,
    audience: audience || q.audience
  }));
}
