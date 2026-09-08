import React, { useState, useEffect } from 'react';
import { 
  Gamepad2, 
  Trophy, 
  Timer, 
  Sparkles, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  ArrowRight, 
  Award, 
  Brain, 
  BookOpen, 
  Zap, 
  MapPin, 
  Calculator,
  HelpCircle,
  Star
} from 'lucide-react';

export type GradeLevel = '1af' | '2af' | '3af' | '4af' | '5af' | '6af' | '7af' | '8af' | '9af';

interface Question {
  id: string;
  subject: 'Maths' | 'Français' | 'Sciences' | 'Histoire-Géo' | 'Civisme';
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

interface SpeedMathQuestion {
  question: string;
  answer: number;
  options: number[];
}

const GRADE_LABELS: Record<GradeLevel, { title: string; cycle: string; badge: string }> = {
  '1af': { title: '1ère Année Fondamentale', cycle: '1er Cycle (CI)', badge: 'Éveil & Bases' },
  '2af': { title: '2ème Année Fondamentale', cycle: '1er Cycle (CP)', badge: 'Calcul & Lecture' },
  '3af': { title: '3ème Année Fondamentale', cycle: '2ème Cycle (CE1)', badge: 'Tables & Vocabulaire' },
  '4af': { title: '4ème Année Fondamentale', cycle: '2ème Cycle (CE2)', badge: 'Sciences & Grammaire' },
  '5af': { title: '5ème Année Fondamentale', cycle: '2ème Cycle (CM1)', badge: 'Fractions & Histoire' },
  '6af': { title: '6ème Année Fondamentale', cycle: '2ème Cycle (CM2)', badge: 'Fin de Cycle Primaire' },
  '7af': { title: '7ème Année Fondamentale', cycle: '3ème Cycle', badge: 'Collège Fondamental' },
  '8af': { title: '8ème Année Fondamentale', cycle: '3ème Cycle', badge: 'Algèbre & Analyse' },
  '9af': { title: '9ème Année Fondamentale', cycle: '3ème Cycle (Brevet d’État)', badge: 'Examen d’État' },
};

// Rich curriculum questions for each grade from 1ère to 9ème AF
const QUESTIONS_BY_GRADE: Record<GradeLevel, Question[]> = {
  '1af': [
    {
      id: '1af-1',
      subject: 'Maths',
      question: 'Combien font 4 + 3 ?',
      options: ['6', '7', '8', '9'],
      correctIndex: 1,
      explanation: '4 plus 3 font bien 7 ! Bravo !'
    },
    {
      id: '1af-2',
      subject: 'Français',
      question: 'Quelle est la première lettre de l’alphabet ?',
      options: ['B', 'E', 'A', 'O'],
      correctIndex: 2,
      explanation: 'L’alphabet commence par la lettre A.'
    },
    {
      id: '1af-3',
      subject: 'Sciences',
      question: 'Avec quel organe entendons-nous les sons ?',
      options: ['Les oreilles', 'Les yeux', 'Le nez', 'La bouche'],
      correctIndex: 0,
      explanation: 'Les oreilles sont les organes de l’ouïe.'
    },
    {
      id: '1af-4',
      subject: 'Civisme',
      question: 'Quelle est la capitale de la République d’Haïti ?',
      options: ['Cap-Haïtien', 'Port-au-Prince', 'Gonaïves', 'Port-de-Paix'],
      correctIndex: 1,
      explanation: 'Port-au-Prince est la capitale d’Haïti.'
    }
  ],
  '2af': [
    {
      id: '2af-1',
      subject: 'Maths',
      question: 'Quel est le double de 6 ?',
      options: ['10', '12', '14', '16'],
      correctIndex: 1,
      explanation: 'Le double de 6 est 6 + 6 = 12.'
    },
    {
      id: '2af-2',
      subject: 'Français',
      question: 'Dans la phrase « Le chat dort », quel est le verbe ?',
      options: ['Le', 'chat', 'dort', 'aucun'],
      correctIndex: 2,
      explanation: '« dort » est le verbe (verbe dormir au présent).'
    },
    {
      id: '2af-3',
      subject: 'Sciences',
      question: 'De quoi une plante a-t-elle besoin pour pousser ?',
      options: ['D’eau et de lumière', 'De chocolat', 'D’huile', 'De glace'],
      correctIndex: 0,
      explanation: 'La plante a besoin d’eau, de terre et de lumière solaire.'
    },
    {
      id: '2af-4',
      subject: 'Histoire-Géo',
      question: 'Quelles sont les deux couleurs du drapeau d’Haïti ?',
      options: ['Bleu et Rouge', 'Vert et Blanc', 'Jaune et Noir', 'Bleu et Blanc'],
      correctIndex: 0,
      explanation: 'Le bicolore haïtien est Bleu et Rouge.'
    }
  ],
  '3af': [
    {
      id: '3af-1',
      subject: 'Maths',
      question: 'Combien font 7 × 8 ?',
      options: ['54', '56', '58', '64'],
      correctIndex: 1,
      explanation: '7 × 8 = 56.'
    },
    {
      id: '3af-2',
      subject: 'Français',
      question: 'Quel est le pluriel du mot « cheval » ?',
      options: ['Chevaux', 'Chevals', 'Chevales', 'Chevalz'],
      correctIndex: 0,
      explanation: 'Les mots en -al font généralement leur pluriel en -aux : des chevaux.'
    },
    {
      id: '3af-3',
      subject: 'Histoire-Géo',
      question: 'Dans quel département d’Haïti se situe la commune de Môle-Saint-Nicolas et Damé ?',
      options: ['Nord-Ouest', 'Artibonite', 'Grand’Anse', 'Nord'],
      correctIndex: 0,
      explanation: 'Damé et Môle-Saint-Nicolas se trouvent dans le département du Nord-Ouest.'
    },
    {
      id: '3af-4',
      subject: 'Sciences',
      question: 'Quel gaz les êtres humains respirent-ils principalement pour vivre ?',
      options: ['L’oxygène', 'Le dioxyde de carbone', 'L’azote', 'Le méthane'],
      correctIndex: 0,
      explanation: 'L’oxygène est indispensable à notre respiration.'
    }
  ],
  '4af': [
    {
      id: '4af-1',
      subject: 'Maths',
      question: 'Quel est le périmètre d’un carré de 5 cm de côté ?',
      options: ['15 cm', '20 cm', '25 cm', '10 cm'],
      correctIndex: 1,
      explanation: 'Périmètre du carré = côté × 4 = 5 cm × 4 = 20 cm.'
    },
    {
      id: '4af-2',
      subject: 'Français',
      question: 'Quel est le contraire (antonyme) du mot « courageux » ?',
      options: ['Fier', 'Poltron / Peureux', 'Fort', 'Vaillant'],
      correctIndex: 1,
      explanation: 'Le contraire de courageux est peureux ou lâche.'
    },
    {
      id: '4af-3',
      subject: 'Histoire-Géo',
      question: 'En quelle année Christophe Colomb a-t-il abordé au Môle-Saint-Nicolas en Haïti ?',
      options: ['1492', '1504', '1804', '1915'],
      correctIndex: 0,
      explanation: 'Le 6 décembre 1492, Christophe Colomb a débarqué dans la baie du Môle-Saint-Nicolas.'
    },
    {
      id: '4af-4',
      subject: 'Sciences',
      question: 'À quelle température l’eau pure bout-elle au niveau de la mer ?',
      options: ['50 °C', '80 °C', '100 °C', '120 °C'],
      correctIndex: 2,
      explanation: 'L’eau se transforme en vapeur à 100 °C.'
    }
  ],
  '5af': [
    {
      id: '5af-1',
      subject: 'Maths',
      question: 'Quelle est la fraction simplifiée de 4/8 ?',
      options: ['1/4', '1/2', '2/3', '3/4'],
      correctIndex: 1,
      explanation: '4 divisé par 4 = 1, et 8 divisé par 4 = 2, donc 4/8 = 1/2.'
    },
    {
      id: '5af-2',
      subject: 'Français',
      question: 'Conjuguez le verbe avoir au futur simple avec « nous » :',
      options: ['Nous avions', 'Nous aurons', 'Nous aurions', 'Nous avons'],
      correctIndex: 1,
      explanation: 'Au futur simple : j’aurai, tu auras, il aura, nous aurons.'
    },
    {
      id: '5af-3',
      subject: 'Histoire-Géo',
      question: 'Quel héros a proclamé l’Indépendance d’Haïti le 1er janvier 1804 aux Gonaïves ?',
      options: ['Jean-Jacques Dessalines', 'Toussaint Louverture', 'Alexandre Pétion', 'Henri Christophe'],
      correctIndex: 0,
      explanation: 'Jean-Jacques Dessalines a proclamé l’indépendance de la première république noire le 1er janvier 1804.'
    },
    {
      id: '5af-4',
      subject: 'Sciences',
      question: 'Quel est l’organe central qui pompe le sang dans tout le corps humain ?',
      options: ['Les poumons', 'Le foie', 'Le cœur', 'Les reins'],
      correctIndex: 2,
      explanation: 'Le cœur est le muscle qui propulse le sang dans tout l’organisme.'
    }
  ],
  '6af': [
    {
      id: '6af-1',
      subject: 'Maths',
      question: 'Une chemise coûte 400 Gourdes. Elle est soldée avec un rabais de 25%. Quel est le nouveau prix ?',
      options: ['300 Gourdes', '320 Gourdes', '350 Gourdes', '280 Gourdes'],
      correctIndex: 0,
      explanation: 'Rabais = 400 × 0.25 = 100 G. Nouveau prix = 400 - 100 = 300 Gourdes.'
    },
    {
      id: '6af-2',
      subject: 'Français',
      question: 'Dans « Les mangues que Marie a mangées sont mûres », pourquoi « mangées » s’accorde-t-il ?',
      options: [
        'Parce qu’il est après le sujet',
        'Parce que le COD « que » (les mangues) est placé avant le verbe avec avoir',
        'Il ne doit pas s’accorder',
        'C’est un adjectif'
      ],
      correctIndex: 1,
      explanation: 'Le participe passé employé avec avoir s’accorde avec le COD si celui-ci est placé devant le verbe.'
    },
    {
      id: '6af-3',
      subject: 'Histoire-Géo',
      question: 'Quelle bataille décisive du 18 novembre 1803 a scellé la victoire de l’armée indigène ?',
      options: ['Bataille de la Crête-à-Pierrot', 'Bataille de Vertières', 'Bataille de Ravine-à-Couleuvres', 'Bataille de Santo Domingo'],
      correctIndex: 1,
      explanation: 'La glorieuse Bataille de Vertières du 18 novembre 1803 a vaincu l’armée expéditionnaire française.'
    },
    {
      id: '6af-4',
      subject: 'Sciences',
      question: 'Quel est le processus par lequel les plantes vertes fabriquent leur nourriture grâce à la lumière ?',
      options: ['La photosynthèse', 'La transpiration', 'La fermentation', 'L’évaporation'],
      correctIndex: 0,
      explanation: 'La photosynthèse permet la synthèse de matière organique sous l’action de la chlorophylle et du soleil.'
    }
  ],
  '7af': [
    {
      id: '7af-1',
      subject: 'Maths',
      question: 'Résolvez l’équation : 3x + 5 = 20. Que vaut x ?',
      options: ['3', '5', '7', '15'],
      correctIndex: 1,
      explanation: '3x = 20 - 5 = 15. Donc x = 15 / 3 = 5.'
    },
    {
      id: '7af-2',
      subject: 'Français',
      question: 'Quelle est la nature de « qui » dans « L’élève qui travaille réussit » ?',
      options: ['Pronom relatif', 'Conjonction de subordination', 'Adjectif indéfini', 'Préposition'],
      correctIndex: 0,
      explanation: '« qui » est un pronom relatif qui a pour antécédent « L’élève ».'
    },
    {
      id: '7af-3',
      subject: 'Histoire-Géo',
      question: 'Quel est le plus long fleuve d’Haïti ?',
      options: ['Le fleuve Artibonite', 'La Rivière Grise', 'La Rivière Massacre', 'Les Trois Rivières'],
      correctIndex: 0,
      explanation: 'L’Artibonite est le plus long fleuve de l’île d’Haïti (environ 320 km).'
    },
    {
      id: '7af-4',
      subject: 'Sciences',
      question: 'Quel est le rôle des globules blancs dans le sang ?',
      options: ['Transporter l’oxygène', 'Défendre l’organisme contre les infections', 'Coaguler le sang', 'Donner la couleur rouge'],
      correctIndex: 1,
      explanation: 'Les globules blancs (leucocytes) constituent notre système immunitaire défensif.'
    }
  ],
  '8af': [
    {
      id: '8af-1',
      subject: 'Maths',
      question: 'Quelle est l’aire d’un triangle dont la base mesure 10 cm et la hauteur 6 cm ?',
      options: ['60 cm²', '30 cm²', '16 cm²', '40 cm²'],
      correctIndex: 1,
      explanation: 'Aire = (Base × Hauteur) / 2 = (10 × 6) / 2 = 30 cm².'
    },
    {
      id: '8af-2',
      subject: 'Français',
      question: 'Dans quelle phrase trouve-t-on une proposition subordonnée circonstancielle de cause ?',
      options: [
        'Il réussit parce qu’il travaille sérieusement.',
        'Quand le maître entre, les élèves se lèvent.',
        'Je pense que tu as raison.',
        'La maison où j’habite est grande.'
      ],
      correctIndex: 0,
      explanation: '« parce qu’il travaille sérieusement » exprime la cause (pourquoi il réussit).'
    },
    {
      id: '8af-3',
      subject: 'Histoire-Géo',
      question: 'Combien de départements géographiques compte la République d’Haïti ?',
      options: ['5', '9', '10', '14'],
      correctIndex: 2,
      explanation: 'Haïti compte 10 départements administratifs.'
    },
    {
      id: '8af-4',
      subject: 'Sciences',
      question: 'Comment appelle-t-on le passage de l’état solide à l’état liquide pour l’eau ?',
      options: ['La fusion', 'La vaporisation', 'La condensation', 'La solidification'],
      correctIndex: 0,
      explanation: 'La fusion est le passage de la glace (solide) à l’eau (liquide).'
    }
  ],
  '9af': [
    {
      id: '9af-1',
      subject: 'Maths',
      question: 'D’après le Théorème de Pythagore, si un triangle rectangle a des côtés de l’angle droit de 3 cm et 4 cm, quelle est l’hypoténuse ?',
      options: ['5 cm', '6 cm', '7 cm', '25 cm'],
      correctIndex: 0,
      explanation: 'Hypoténuse² = 3² + 4² = 9 + 16 = 25. √25 = 5 cm.'
    },
    {
      id: '9af-2',
      subject: 'Français',
      question: 'Mettez à la voix passive : « Le cyclone ravage la région. »',
      options: [
        'La région est ravagée par le cyclone.',
        'La région a ravagé le cyclone.',
        'La région ravageait le cyclone.',
        'Le cyclone fut ravagé par la région.'
      ],
      correctIndex: 0,
      explanation: 'À la voix passive : « La région est ravagée par le cyclone. »'
    },
    {
      id: '9af-3',
      subject: 'Histoire-Géo',
      question: 'Quel est le point culminant de la République d’Haïti ?',
      options: ['Le Morne de la Selle (2680 m)', 'Le Morne Macaya', 'La Montagne Noire', 'Le Bonnet à l’Évêque'],
      correctIndex: 0,
      explanation: 'Le Pic la Selle (Morne de la Selle) s’élève à 2 680 mètres d’altitude.'
    },
    {
      id: '9af-4',
      subject: 'Sciences',
      question: 'Quel est le symbole chimique de l’eau ?',
      options: ['CO2', 'H2O', 'NaCl', 'O2'],
      correctIndex: 1,
      explanation: 'H2O représente deux atomes d’hydrogène liés à un atome d’oxygène.'
    },
    {
      id: '9af-5',
      subject: 'Civisme',
      question: 'Quelle est la devise nationale de la République d’Haïti inscrite sur les armoiries ?',
      options: [
        'L’Union Fait la Force',
        'Liberté, Égalité, Fraternité',
        'Ordre et Progrès',
        'Dieu et Patrie'
      ],
      correctIndex: 0,
      explanation: '« L’Union Fait la Force » est la devise nationale d’Haïti.'
    }
  ]
};

// Helper for generating dynamic Speed Math challenges
function generateSpeedMathQuestion(grade: GradeLevel): SpeedMathQuestion {
  const isElementary = ['1af', '2af'].includes(grade);
  const isMiddle = ['3af', '4af', '5af', '6af'].includes(grade);

  let qText = '';
  let correct = 0;

  if (isElementary) {
    const a = Math.floor(Math.random() * 12) + 2;
    const b = Math.floor(Math.random() * 10) + 1;
    const isAdd = Math.random() > 0.3;
    if (isAdd) {
      qText = `${a} + ${b}`;
      correct = a + b;
    } else {
      const high = Math.max(a, b);
      const low = Math.min(a, b);
      qText = `${high} - ${low}`;
      correct = high - low;
    }
  } else if (isMiddle) {
    const ops = ['+', '-', '×'];
    const op = ops[Math.floor(Math.random() * ops.length)];
    if (op === '×') {
      const a = Math.floor(Math.random() * 8) + 2;
      const b = Math.floor(Math.random() * 8) + 2;
      qText = `${a} × ${b}`;
      correct = a * b;
    } else if (op === '+') {
      const a = Math.floor(Math.random() * 45) + 10;
      const b = Math.floor(Math.random() * 45) + 5;
      qText = `${a} + ${b}`;
      correct = a + b;
    } else {
      const a = Math.floor(Math.random() * 50) + 20;
      const b = Math.floor(Math.random() * 20) + 5;
      qText = `${a} - ${b}`;
      correct = a - b;
    }
  } else {
    // 7th to 9th grade (includes algebra basics and multiplications)
    const type = Math.floor(Math.random() * 3);
    if (type === 0) {
      // 2x = 24
      const xVal = Math.floor(Math.random() * 12) + 2;
      const coeff = Math.floor(Math.random() * 4) + 2;
      qText = `${coeff}x = ${coeff * xVal} → x = ?`;
      correct = xVal;
    } else if (type === 1) {
      const a = Math.floor(Math.random() * 12) + 4;
      const b = Math.floor(Math.random() * 12) + 4;
      qText = `${a} × ${b}`;
      correct = a * b;
    } else {
      const a = Math.floor(Math.random() * 8) + 2;
      qText = `${a}² (carré de ${a})`;
      correct = a * a;
    }
  }

  // Generate 4 options
  const optionsSet = new Set<number>();
  optionsSet.add(correct);
  while (optionsSet.size < 4) {
    const offset = (Math.floor(Math.random() * 7) + 1) * (Math.random() > 0.5 ? 1 : -1);
    const candidate = Math.max(0, correct + offset);
    optionsSet.add(candidate);
  }

  const options = Array.from(optionsSet).sort(() => Math.random() - 0.5);
  return { question: qText, answer: correct, options };
}

export const NazarethEduGames: React.FC = () => {
  const [selectedGrade, setSelectedGrade] = useState<GradeLevel>('6af');
  const [activeTab, setActiveTab] = useState<'quiz' | 'speedmath' | 'haiti'>('quiz');

  // Quiz State
  const questions = QUESTIONS_BY_GRADE[selectedGrade] || QUESTIONS_BY_GRADE['1af'];
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  // Speed Math State
  const [mathActive, setMathActive] = useState(false);
  const [mathTimer, setMathTimer] = useState(30);
  const [mathScore, setMathScore] = useState(0);
  const [mathBestScore, setMathBestScore] = useState(0);
  const [currentMathQ, setCurrentMathQ] = useState<SpeedMathQuestion | null>(null);

  // Reset quiz when grade changes
  useEffect(() => {
    setCurrentQIndex(0);
    setSelectedOption(null);
    setShowExplanation(false);
    setScore(0);
    setQuizFinished(false);
  }, [selectedGrade]);

  // Speed math timer
  useEffect(() => {
    let interval: any = null;
    if (mathActive && mathTimer > 0) {
      interval = setInterval(() => {
        setMathTimer((prev) => prev - 1);
      }, 1000);
    } else if (mathTimer === 0 && mathActive) {
      setMathActive(false);
      if (mathScore > mathBestScore) {
        setMathBestScore(mathScore);
      }
    }
    return () => clearInterval(interval);
  }, [mathActive, mathTimer, mathScore, mathBestScore]);

  const handleSelectQuizOption = (index: number) => {
    if (selectedOption !== null) return;
    setSelectedOption(index);
    setShowExplanation(true);
    if (index === questions[currentQIndex].correctIndex) {
      setScore(s => s + 1);
    }
  };

  const handleNextQuizQuestion = () => {
    if (currentQIndex < questions.length - 1) {
      setCurrentQIndex(c => c + 1);
      setSelectedOption(null);
      setShowExplanation(false);
    } else {
      setQuizFinished(true);
    }
  };

  const handleRestartQuiz = () => {
    setCurrentQIndex(0);
    setSelectedOption(null);
    setShowExplanation(false);
    setScore(0);
    setQuizFinished(false);
  };

  const startSpeedMath = () => {
    setMathActive(true);
    setMathTimer(30);
    setMathScore(0);
    setCurrentMathQ(generateSpeedMathQuestion(selectedGrade));
  };

  const handleAnswerSpeedMath = (chosen: number) => {
    if (!currentMathQ || !mathActive) return;
    if (chosen === currentMathQ.answer) {
      setMathScore(s => s + 1);
    }
    setCurrentMathQ(generateSpeedMathQuestion(selectedGrade));
  };

  const activeQ = questions[currentQIndex] || questions[0];

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-[#081B36] via-[#0F2C59] to-[#163B72] text-white p-6 sm:p-8 shadow-xl border-2 border-[#D4AF37]/30">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 px-3.5 py-1 text-xs font-bold text-[#D4AF37] uppercase tracking-wider">
            <Gamepad2 className="h-4 w-4" />
            École Fondamentale Nazareth • Jeux Éducatifs
          </div>
          <h2 className="text-2xl sm:text-3xl font-black font-display tracking-tight text-white">
            Jeux Éducatifs de la 1ère à la 9ème Année Fondamentale
          </h2>
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
            Apprendre en s'amusant selon le programme fondamental haïtien : Mathématiques, Français, Sciences expérimentales, Histoire et Géographie d'Haïti !
          </p>
          <div className="pt-1 flex items-center gap-2 text-[11px] text-[#D4AF37]">
            <Star className="h-3.5 w-3.5 fill-[#D4AF37]" />
            <span>« Instruis l’enfant selon la voie qu’il doit suivre; et quand il sera vieux, il ne s’en détournera pas. » (Proverbes 22:6)</span>
          </div>
        </div>
      </div>

      {/* Grade Selector (1ère AF à 9ème AF) */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs uppercase font-extrabold tracking-wider text-slate-500">
            Choisissez la classe de l'élève :
          </span>
          <span className="text-xs font-bold text-[#0F2C59] bg-[#D4AF37]/20 px-3 py-1 rounded-full">
            {GRADE_LABELS[selectedGrade].title} ({GRADE_LABELS[selectedGrade].cycle})
          </span>
        </div>

        {/* 9 Class Badges Grid */}
        <div className="grid grid-cols-3 sm:grid-cols-9 gap-2">
          {(['1af', '2af', '3af', '4af', '5af', '6af', '7af', '8af', '9af'] as GradeLevel[]).map((grade) => (
            <button
              key={grade}
              onClick={() => setSelectedGrade(grade)}
              className={`py-3 px-2 rounded-2xl text-center border font-bold transition-all cursor-pointer flex flex-col items-center justify-center ${
                selectedGrade === grade
                  ? 'bg-[#0F2C59] text-white border-[#D4AF37] shadow-md scale-102 ring-2 ring-[#D4AF37]/50'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
              }`}
            >
              <span className={`text-xs uppercase ${selectedGrade === grade ? 'text-[#D4AF37]' : 'text-slate-500'}`}>
                {grade.toUpperCase()}
              </span>
              <span className="text-[10px] font-normal leading-tight mt-0.5 opacity-80">
                {grade === '9af' ? 'Brevet' : grade.replace('af', 'e AF')}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Game Mode Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => setActiveTab('quiz')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs transition-all ${
            activeTab === 'quiz'
              ? 'bg-[#0F2C59] text-white shadow'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <BookOpen className="h-4 w-4 text-[#D4AF37]" />
          <span>Quiz du Programme ({GRADE_LABELS[selectedGrade].title})</span>
        </button>

        <button
          onClick={() => setActiveTab('speedmath')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs transition-all ${
            activeTab === 'speedmath'
              ? 'bg-[#0F2C59] text-white shadow'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Zap className="h-4 w-4 text-[#D4AF37]" />
          <span>Défi Calcul Mental Éclair (30s)</span>
        </button>

        <button
          onClick={() => setActiveTab('haiti')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs transition-all ${
            activeTab === 'haiti'
              ? 'bg-[#0F2C59] text-white shadow'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <MapPin className="h-4 w-4 text-[#D4AF37]" />
          <span>Patrimoine d’Haïti & Nord-Ouest</span>
        </button>
      </div>

      {/* TAB 1: QUIZ DU PROGRAMME */}
      {activeTab === 'quiz' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md">
          {!quizFinished ? (
            <div className="space-y-6">
              {/* Progress & Subject */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-[#0F2C59] text-[#D4AF37] px-3 py-1 text-xs font-bold uppercase">
                    Matière : {activeQ.subject}
                  </span>
                  <span className="text-xs text-slate-500 font-semibold">
                    Question {currentQIndex + 1} / {questions.length}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-xs font-bold text-[#0F2C59]">
                  <Trophy className="h-4 w-4 text-[#D4AF37]" />
                  <span>Score : {score} point{score > 1 ? 's' : ''}</span>
                </div>
              </div>

              {/* Question Text */}
              <div className="py-2">
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">
                  {activeQ.question}
                </h3>
              </div>

              {/* Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {activeQ.options.map((option, idx) => {
                  let btnStyle = 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-800';
                  if (selectedOption !== null) {
                    if (idx === activeQ.correctIndex) {
                      btnStyle = 'border-emerald-500 bg-emerald-50 text-emerald-900 font-bold ring-2 ring-emerald-500/40';
                    } else if (idx === selectedOption) {
                      btnStyle = 'border-rose-400 bg-rose-50 text-rose-900';
                    } else {
                      btnStyle = 'border-slate-200 bg-white opacity-40';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectQuizOption(idx)}
                      disabled={selectedOption !== null}
                      className={`p-4 rounded-2xl border text-left text-xs sm:text-sm transition-all flex items-center justify-between cursor-pointer ${btnStyle}`}
                    >
                      <span>{option}</span>
                      {selectedOption !== null && idx === activeQ.correctIndex && (
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 ml-2" />
                      )}
                      {selectedOption === idx && idx !== activeQ.correctIndex && (
                        <XCircle className="h-4 w-4 text-rose-500 shrink-0 ml-2" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Explanation & Next Button */}
              {showExplanation && (
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-3">
                  <div className="flex items-start gap-2 text-xs text-amber-900">
                    <Sparkles className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="font-bold">Explication pédagogique : </strong>
                      {activeQ.explanation}
                    </div>
                  </div>
                  <div className="text-right">
                    <button
                      onClick={handleNextQuizQuestion}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-[#0F2C59] px-4 py-2 text-xs font-bold text-white hover:bg-[#163B72] transition-colors"
                    >
                      <span>{currentQIndex < questions.length - 1 ? 'Question suivante' : 'Voir mon résultat'}</span>
                      <ArrowRight className="h-3.5 w-3.5 text-[#D4AF37]" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Quiz Results */
            <div className="text-center py-8 space-y-4 max-w-md mx-auto">
              <div className="h-16 w-16 mx-auto rounded-3xl bg-[#0F2C59] text-[#D4AF37] flex items-center justify-center shadow-lg">
                <Award className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-bold font-display text-[#0F2C59]">
                Bravo ! Défi {GRADE_LABELS[selectedGrade].title} Terminé
              </h3>
              <p className="text-sm text-slate-600">
                Vous avez obtenu <strong className="text-[#0F2C59] font-bold text-lg">{score} sur {questions.length}</strong> bonnes réponses.
              </p>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700">
                {score === questions.length ? (
                  <span className="text-emerald-700 font-bold">
                    🌟 Excellent ! Score parfait ! Vous maîtrisez parfaitement les notions de cette classe.
                  </span>
                ) : score >= questions.length / 2 ? (
                  <span className="text-[#0F2C59] font-semibold">
                    👍 Très bon travail ! Recommencez pour obtenir un score sans faute !
                  </span>
                ) : (
                  <span className="text-amber-800">
                    📖 Bon effort ! Révisez les explications et réessayez pour progresser.
                  </span>
                )}
              </div>

              <div className="pt-2 flex items-center justify-center gap-3">
                <button
                  onClick={handleRestartQuiz}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#0F2C59] px-5 py-2.5 text-xs font-bold text-white hover:bg-[#163B72]"
                >
                  <RotateCcw className="h-4 w-4 text-[#D4AF37]" />
                  Recommencer le quiz
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: DÉFI CALCUL MENTAL (SPEED MATH) */}
      {activeTab === 'speedmath' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md">
          {!mathActive && mathTimer === 30 ? (
            <div className="text-center max-w-md mx-auto space-y-5 py-6">
              <div className="h-16 w-16 mx-auto rounded-3xl bg-[#0F2C59] text-[#D4AF37] flex items-center justify-center shadow">
                <Calculator className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-bold font-display text-[#0F2C59]">
                Calcul Mental Éclair (30 Secondes)
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Opérations rapides adaptées au niveau <strong className="text-[#0F2C59]">{GRADE_LABELS[selectedGrade].title}</strong>. Répondez à un maximum de calculs avant la fin du temps !
              </p>
              {mathBestScore > 0 && (
                <div className="inline-flex items-center gap-2 rounded-full bg-amber-50 border border-amber-200 px-4 py-1.5 text-xs font-bold text-amber-900">
                  <Trophy className="h-4 w-4 text-[#D4AF37]" />
                  Record actuel : {mathBestScore} calculs réussis
                </div>
              )}
              <div>
                <button
                  onClick={startSpeedMath}
                  className="rounded-2xl bg-[#0F2C59] px-8 py-3 text-sm font-bold text-[#D4AF37] hover:bg-[#163B72] transition-colors shadow-lg cursor-pointer"
                >
                  Lancer le compte à rebours ⏱️
                </button>
              </div>
            </div>
          ) : mathActive && currentMathQ ? (
            <div className="space-y-6 max-w-lg mx-auto py-4">
              {/* Header Timer and Score */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2 text-xs font-bold text-rose-600">
                  <Timer className="h-5 w-5 animate-spin" />
                  <span className="text-base font-mono">{mathTimer}s</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#0F2C59]">
                  <Zap className="h-4 w-4 text-[#D4AF37]" />
                  <span>Score : {mathScore} calculs</span>
                </div>
              </div>

              {/* Math Question Display */}
              <div className="text-center py-6 bg-slate-50 rounded-2xl border border-slate-200">
                <span className="text-xs uppercase tracking-widest text-slate-400 font-bold">
                  Combien font :
                </span>
                <div className="text-3xl sm:text-4xl font-extrabold text-[#0F2C59] mt-2 font-mono">
                  {currentMathQ.question}
                </div>
              </div>

              {/* 4 Choices */}
              <div className="grid grid-cols-2 gap-3">
                {currentMathQ.options.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleAnswerSpeedMath(opt)}
                    className="p-4 rounded-2xl bg-white hover:bg-[#0F2C59] hover:text-[#D4AF37] border-2 border-slate-200 text-lg sm:text-xl font-bold font-mono transition-all text-center cursor-pointer shadow-xs active:scale-95"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* Time Up View */
            <div className="text-center max-w-md mx-auto space-y-4 py-6">
              <div className="h-16 w-16 mx-auto rounded-3xl bg-amber-500 text-white flex items-center justify-center shadow">
                <Trophy className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-bold font-display text-slate-900">
                Temps écoulé !
              </h3>
              <p className="text-sm text-slate-600">
                Score obtenu : <strong className="text-2xl text-[#0F2C59] font-mono">{mathScore}</strong> calculs réussis en 30 secondes.
              </p>
              <button
                onClick={startSpeedMath}
                className="rounded-xl bg-[#0F2C59] text-white px-6 py-2.5 text-xs font-bold hover:bg-[#163B72]"
              >
                Rejouer pour battre votre record
              </button>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: PATRIMOINE D'HAÏTI & NORD-OUEST */}
      {activeTab === 'haiti' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md space-y-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0F2C59] text-[#D4AF37]">
              <MapPin className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold font-display text-[#0F2C59]">
                Connaissances Clés : Damé, Môle-Saint-Nicolas et Haïti
              </h3>
              <p className="text-xs text-slate-500">
                Repères historiques et géographiques indispensables pour tout élève de l'École Nazareth.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="text-[10px] uppercase font-bold text-[#D4AF37] bg-[#0F2C59] px-2 py-0.5 rounded">
                Histoire Locale
              </span>
              <h4 className="text-sm font-bold text-slate-800">Baie du Môle-Saint-Nicolas</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Le 6 décembre 1492, la flotte de Christophe Colomb toucha la terre d’Ayiti en entrant dans la baie du Môle-Saint-Nicolas, qu'il nomma ainsi en l'honneur de la Saint-Nicolas.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="text-[10px] uppercase font-bold text-[#D4AF37] bg-[#0F2C59] px-2 py-0.5 rounded">
                Géographie
              </span>
              <h4 className="text-sm font-bold text-slate-800">3ème Section Rurale Damé</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Damé est la 3ème section communale de Môle-Saint-Nicolas dans le Nord-Ouest. Elle se distingue par son agriculture, son élevage et son esprit de solidarité communautaire.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="text-[10px] uppercase font-bold text-[#D4AF37] bg-[#0F2C59] px-2 py-0.5 rounded">
                Éducation Nazareth
              </span>
              <h4 className="text-sm font-bold text-slate-800">École Fondamentale (1985)</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Fondée au sein de l'Église du Nazaréen pour former les enfants de Damé, alliant rigueur académique et valeurs bibliques de sanctification et d'intégrité.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
