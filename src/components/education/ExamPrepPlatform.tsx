import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  CheckCircle2, 
  XCircle, 
  Timer, 
  Award, 
  BookOpen, 
  Clock, 
  RotateCcw, 
  ArrowRight, 
  AlertCircle, 
  Download, 
  Printer, 
  Sparkles,
  ChevronRight,
  GraduationCap
} from 'lucide-react';

interface ExamQuestion {
  id: string;
  subject: 'Maths' | 'Français' | 'Sciences' | 'Histoire-Géo';
  text: string;
  context?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  points: number;
}

const EXAM_SUBJECTS = [
  { id: 'maths', name: 'Mathématiques', coef: 'Coeff. 3', duration: 15, questionsCount: 5 },
  { id: 'francais', name: 'Communication Française', coef: 'Coeff. 3', duration: 15, questionsCount: 5 },
  { id: 'sciences', name: 'Sciences Expérimentales (SVT)', coef: 'Coeff. 2', duration: 12, questionsCount: 5 },
  { id: 'sociales', name: 'Sciences Sociales (Histoire-Géo)', coef: 'Coeff. 2', duration: 12, questionsCount: 5 },
];

const EXAM_QUESTIONS_POOL: Record<string, ExamQuestion[]> = {
  maths: [
    {
      id: 'm-1',
      subject: 'Maths',
      text: 'Dans un triangle ABC rectangle en A, AB = 6 cm et AC = 8 cm. Quelle est la longueur de l’hypoténuse BC ?',
      options: ['10 cm', '14 cm', '12 cm', '48 cm'],
      correctIndex: 0,
      explanation: 'D’après le Théorème de Pythagore : BC² = AB² + AC² = 6² + 8² = 36 + 64 = 100. Donc BC = √100 = 10 cm.',
      points: 20
    },
    {
      id: 'm-2',
      subject: 'Maths',
      text: 'Résolvez l’équation dans R : 4x - 7 = 2x + 9.',
      options: ['x = 8', 'x = 1', 'x = -8', 'x = 16'],
      correctIndex: 0,
      explanation: '4x - 2x = 9 + 7 => 2x = 16 => x = 16 / 2 = 8.',
      points: 20
    },
    {
      id: 'm-3',
      subject: 'Maths',
      text: 'Une marchandise affichée à 1 500 Gourdes subit une remise de 20%. Quel montant paye le client ?',
      options: ['1 200 Gourdes', '1 300 Gourdes', '1 350 Gourdes', '1 400 Gourdes'],
      correctIndex: 0,
      explanation: 'Montant de la remise = 1 500 × 0.20 = 300 Gourdes. Prix payé = 1 500 - 300 = 1 200 Gourdes.',
      points: 20
    },
    {
      id: 'm-4',
      subject: 'Maths',
      text: 'Quel est le volume d’un pavé droit (parallélépipède) de longueur 5 m, largeur 3 m et hauteur 2 m ?',
      options: ['30 m³', '10 m³', '60 m³', '25 m³'],
      correctIndex: 0,
      explanation: 'Volume = Longueur × Largeur × Hauteur = 5 × 3 × 2 = 30 m³.',
      points: 20
    },
    {
      id: 'm-5',
      subject: 'Maths',
      text: 'Quelle est la valeur simplifiée de l’expression (3/4) + (2/5) ?',
      options: ['23/20', '5/9', '11/20', '1'],
      correctIndex: 0,
      explanation: 'Dénominateur commun = 20. (3×5)/20 + (2×4)/20 = 15/20 + 8/20 = 23/20.',
      points: 20
    }
  ],
  francais: [
    {
      id: 'f-1',
      subject: 'Français',
      text: 'Dans quelle phrase le participe passé est-il correctement accordé ?',
      options: [
        'Les lettres que nous avons reçues sont émouvantes.',
        'Les lettres que nous avons reçu sont émouvantes.',
        'Les lettres que nous avons reçus sont émouvantes.',
        'Les lettres que nous sommes reçues sont émouvantes.'
      ],
      correctIndex: 0,
      explanation: 'Avec l’auxiliaire avoir, le participe passé s’accorde avec le COD « que » (mis pour les lettres, féminin pluriel) placé avant le verbe : « reçues ».',
      points: 20
    },
    {
      id: 'f-2',
      subject: 'Français',
      text: 'Quelle est la fonction du groupe de mots entre guillemets : « Le soir venu », les enfants rentrent au village.',
      options: [
        'Complément circonstanciel de temps',
        'Sujet du verbe rentrent',
        'Complément d’objet direct',
        'Attribut du sujet'
      ],
      correctIndex: 0,
      explanation: '« Le soir venu » indique à quel moment a lieu l’action : c’est une proposition participiale en fonction de complément circonstanciel de temps.',
      points: 20
    },
    {
      id: 'f-3',
      subject: 'Français',
      text: 'Complétez correctement la phrase : « Quoiqu’il ____ fatigué, cet élève poursuit ses devoirs. »',
      options: ['soit (subjonctif)', 'est (indicatif)', 'serait (conditionnel)', 'fusse'],
      correctIndex: 0,
      explanation: 'La conjonction de subordination « quoique » (concession) exige obligatoirement le mode subjonctif : « Quoiqu’il soit fatigué ».',
      points: 20
    },
    {
      id: 'f-4',
      subject: 'Français',
      text: 'Identifiez la figure de style dans : « Haïti, perle des Antilles, brille au milieu des Caraïbes. »',
      options: ['Une métaphore / antonomase', 'Un oxymore', 'Une antiphrase', 'Une litote'],
      correctIndex: 0,
      explanation: 'Désigner Haïti sous le nom de « perle des Antilles » est une métaphore poétique élogieuse.',
      points: 20
    },
    {
      id: 'f-5',
      subject: 'Français',
      text: 'Choisissez l’orthographe exacte des homophones : « ____ livre appartient à Paul, mais ____ cahiers sont à Marie. »',
      options: ['Ce / ses', 'Se / ces', 'Ce / ces', 'Se / ses'],
      correctIndex: 0,
      explanation: '« Ce » est le déterminant démonstratif singulier, et « ses » est le possessif pluriel (les cahiers de Paul).',
      points: 20
    }
  ],
  sciences: [
    {
      id: 's-1',
      subject: 'Sciences',
      text: 'Quels vaisseaux sanguins transportent le sang riche en oxygène du cœur vers l’ensemble des organes ?',
      options: ['Les artères', 'Les veines', 'Les capillaires lymphatiques', 'Les bronches'],
      correctIndex: 0,
      explanation: 'Les artères (notamment l’aorte) partent du ventricule gauche et transportent le sang oxygéné vers tout le corps.',
      points: 20
    },
    {
      id: 's-2',
      subject: 'Sciences',
      text: 'Quel phénomène géologique provoque les séismes (tremblements de terre) comme celui qui a touché Haïti en 2010 et 2021 ?',
      options: [
        'Le mouvement brusque des failles tectoniques',
        'Les marées océaniques',
        'La déforestation uniquement',
        'Le réchauffement de l’air'
      ],
      correctIndex: 0,
      explanation: 'Haïti est située à la frontière entre la plaque caraïbe et la plaque nord-américaine; le glissement le long des failles produit les séismes.',
      points: 20
    },
    {
      id: 's-3',
      subject: 'Sciences',
      text: 'Lors de la photosynthèse, quelle substance gazeuse les plantes absorbent-elles principalement ?',
      options: ['Le dioxyde de carbone (CO2)', 'L’oxygène pur (O2)', 'L’azote pur', 'L’hélium'],
      correctIndex: 0,
      explanation: 'La plante absorbe le dioxyde de carbone (CO2) et rejette de l’oxygène grâce à l’énergie lumineuse.',
      points: 20
    },
    {
      id: 's-4',
      subject: 'Sciences',
      text: 'Quel nutriment essentiel apporte l’énergie principale à l’organisme humain ?',
      options: ['Les glucides (sucres lents/rapides)', 'Les vitamines seules', 'L’eau pure', 'Les sels minéraux'],
      correctIndex: 0,
      explanation: 'Les glucides constituent le principal carburant énergétique des cellules de notre organisme.',
      points: 20
    },
    {
      id: 's-5',
      subject: 'Sciences',
      text: 'Quelle couche protectrice de l’atmosphère filtre les rayons ultraviolets (UV) dangereux émis par le soleil ?',
      options: ['La couche d’ozone', 'La troposphère inférieure', 'La magnétosphère', 'L’ionosphère'],
      correctIndex: 0,
      explanation: 'La couche d’ozone (dans la stratosphère) absorbe la majorité des rayons ultraviolets nocifs pour la vie.',
      points: 20
    }
  ],
  sociales: [
    {
      id: 'h-1',
      subject: 'Histoire-Géo',
      text: 'À quelle date et par qui l’Acte de l’Indépendance de la République d’Haïti a-t-il été proclamé ?',
      options: [
        'Le 1er janvier 1804 par Jean-Jacques Dessalines aux Gonaïves',
        'Le 18 novembre 1803 par Toussaint Louverture au Cap',
        'Le 14 août 1791 par Boukman au Bois-Caïman',
        'Le 6 décembre 1492 par Christophe Colomb au Môle'
      ],
      correctIndex: 0,
      explanation: 'Le 1er janvier 1804 aux Gonaïves, Jean-Jacques Dessalines et les généraux de l’armée indigène ont proclamé l’indépendance d’Haïti.',
      points: 20
    },
    {
      id: 'h-2',
      subject: 'Histoire-Géo',
      text: 'Dans quel département d’Haïti se trouvent la ville de Port-de-Paix, la commune de Môle-Saint-Nicolas et Damé ?',
      options: [
        'Département du Nord-Ouest',
        'Département du Nord',
        'Département de l’Artibonite',
        'Département de l’Ouest'
      ],
      correctIndex: 0,
      explanation: 'Damé, Môle-Saint-Nicolas, Jean-Rabel, Saint-Louis du Nord et Port-de-Paix font partie du département du Nord-Ouest.',
      points: 20
    },
    {
      id: 'h-3',
      subject: 'Histoire-Géo',
      text: 'Quel était le titre officiel de Toussaint Louverture avant sa capture en 1802 ?',
      options: [
        'Gouverneur Général à vie de Saint-Domingue',
        'Empereur de toute l’île',
        'Président constitutionnel',
        'Roi du Nord'
      ],
      correctIndex: 0,
      explanation: 'Par la Constitution de 1801, Toussaint Louverture fut nommé Gouverneur Général à vie de Saint-Domingue.',
      points: 20
    },
    {
      id: 'h-4',
      subject: 'Histoire-Géo',
      text: 'Quel fleuve forme une frontière naturelle partielle entre la République d’Haïti et la République Dominicaine au Nord-Est ?',
      options: ['La Rivière Massacre', 'Le Fleuve Artibonite', 'La Rivière Blanche', 'Les Trois Rivières'],
      correctIndex: 0,
      explanation: 'La Rivière Massacre (au niveau de Ouanaminthe / Dajabón) délimite la frontière nord-est.',
      points: 20
    },
    {
      id: 'h-5',
      subject: 'Histoire-Géo',
      text: 'Combien de sections communales compte la commune de Môle-Saint-Nicolas ?',
      options: [
        '3 sections (Côtes de Fer, Mare Rouge, Damé)',
        '1 seule section',
        '5 sections',
        '8 sections'
      ],
      correctIndex: 0,
      explanation: 'Môle-Saint-Nicolas compte 3 sections : 1ère Côtes-de-Fer, 2ème Mare-Rouge, 3ème Damé.',
      points: 20
    }
  ]
};

export const ExamPrepPlatform: React.FC = () => {
  const [activeView, setActiveView] = useState<'simulator' | 'fiches' | 'conseils'>('simulator');
  const [selectedSubject, setSelectedSubject] = useState<string>('maths');
  
  // Simulator State
  const [isExamRunning, setIsExamRunning] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(15 * 60); // in seconds
  const [currentExamIndex, setCurrentExamIndex] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [examSubmitted, setExamSubmitted] = useState<boolean>(false);

  const questions = EXAM_QUESTIONS_POOL[selectedSubject] || EXAM_QUESTIONS_POOL.maths;

  // Countdown timer for exam mode
  useEffect(() => {
    let timer: any = null;
    if (isExamRunning && !examSubmitted && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) {
            setExamSubmitted(true);
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isExamRunning, examSubmitted, timeLeft]);

  const handleStartExam = (subjectId: string) => {
    setSelectedSubject(subjectId);
    setIsExamRunning(true);
    setExamSubmitted(false);
    setUserAnswers({});
    setCurrentExamIndex(0);
    const subj = EXAM_SUBJECTS.find(s => s.id === subjectId);
    setTimeLeft((subj?.duration || 15) * 60);
  };

  const handleSelectAnswer = (qIndex: number, optionIndex: number) => {
    if (examSubmitted) return;
    setUserAnswers(prev => ({ ...prev, [qIndex]: optionIndex }));
  };

  const calculateResults = () => {
    let totalPoints = 0;
    let earnedPoints = 0;
    let correctCount = 0;

    questions.forEach((q, idx) => {
      totalPoints += q.points;
      if (userAnswers[idx] === q.correctIndex) {
        earnedPoints += q.points;
        correctCount++;
      }
    });

    const scorePercentage = Math.round((earnedPoints / totalPoints) * 100);
    let mention = 'À consolider';
    let mentionColor = 'text-rose-600 bg-rose-50 border-rose-200';

    if (scorePercentage >= 90) {
      mention = 'Lauréat • Mention Très Bien';
      mentionColor = 'text-emerald-700 bg-emerald-50 border-emerald-300';
    } else if (scorePercentage >= 75) {
      mention = 'Mention Bien';
      mentionColor = 'text-[#0F2C59] bg-blue-50 border-blue-200';
    } else if (scorePercentage >= 60) {
      mention = 'Mention Assez Bien (Admis)';
      mentionColor = 'text-teal-700 bg-teal-50 border-teal-200';
    } else if (scorePercentage >= 50) {
      mention = 'Mention Passable (Admis)';
      mentionColor = 'text-amber-700 bg-amber-50 border-amber-200';
    }

    return { totalPoints, earnedPoints, correctCount, scorePercentage, mention, mentionColor };
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const results = examSubmitted ? calculateResults() : null;

  return (
    <div className="space-y-8">
      {/* Platform Header */}
      <div className="rounded-3xl bg-gradient-to-r from-[#0F2C59] via-[#163B72] to-[#0F2C59] text-white p-6 sm:p-8 shadow-xl border-2 border-[#D4AF37]">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 px-3.5 py-1 text-xs font-bold text-[#D4AF37] uppercase">
              <GraduationCap className="h-4 w-4" />
              Plateforme de Réussite Académique
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-white">
              Préparation aux Examens d'État & Fondamentaux
            </h2>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
              Spécialement conçue pour les élèves de l'École Fondamentale Nazareth et de Damé préparant les épreuves officielles (9ème AF, 6ème AF et contrôles d'examen).
            </p>
          </div>

          <div className="flex items-center gap-2 bg-white/10 p-3 rounded-2xl border border-white/20 text-center">
            <Award className="h-8 w-8 text-[#D4AF37] shrink-0" />
            <div className="text-left text-xs">
              <div className="font-bold text-white">Programme Officiel d'Examens</div>
              <div className="text-[11px] text-slate-300">Haïti • District Bas Nord-Ouest</div>
            </div>
          </div>
        </div>
      </div>

      {/* Sub-Navigation */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => setActiveView('simulator')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs transition-all ${
            activeView === 'simulator'
              ? 'bg-[#0F2C59] text-white shadow'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Timer className="h-4 w-4 text-[#D4AF37]" />
          <span>Simulateur d'Examen Blanc (Minuté)</span>
        </button>

        <button
          onClick={() => setActiveView('fiches')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs transition-all ${
            activeView === 'fiches'
              ? 'bg-[#0F2C59] text-white shadow'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <FileText className="h-4 w-4 text-[#D4AF37]" />
          <span>Fiches de Révision Express (Mémento)</span>
        </button>

        <button
          onClick={() => setActiveView('conseils')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs transition-all ${
            activeView === 'conseils'
              ? 'bg-[#0F2C59] text-white shadow'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Sparkles className="h-4 w-4 text-[#D4AF37]" />
          <span>Conseils & Stratégies pour le Jour J</span>
        </button>
      </div>

      {/* VIEW 1: SIMULATEUR D'EXAMEN */}
      {activeView === 'simulator' && (
        <div className="space-y-6">
          {!isExamRunning ? (
            /* Subject Selection Cards */
            <div>
              <div className="mb-4">
                <h3 className="text-lg font-bold font-display text-[#0F2C59]">
                  Choisissez une épreuve d'examen blanc à passer :
                </h3>
                <p className="text-xs text-slate-500">
                  Chaque épreuve contient 5 questions représentatives des examens officiels avec compte à rebours et corrigé commenté.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {EXAM_SUBJECTS.map((subj) => (
                  <div
                    key={subj.id}
                    className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase text-[#D4AF37] bg-[#0F2C59] px-2.5 py-0.5 rounded-full">
                          {subj.coef}
                        </span>
                        <span className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          {subj.duration} min
                        </span>
                      </div>
                      <h4 className="text-base font-bold text-slate-900 font-display">
                        {subj.name}
                      </h4>
                      <p className="text-xs text-slate-500">
                        {subj.questionsCount} questions d'entraînement avec barème sur 100 points.
                      </p>
                    </div>

                    <button
                      onClick={() => handleStartExam(subj.id)}
                      className="mt-5 w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#0F2C59] py-2.5 text-xs font-bold text-white hover:bg-[#163B72] transition-colors"
                    >
                      <span>Lancer l’épreuve</span>
                      <ArrowRight className="h-3.5 w-3.5 text-[#D4AF37]" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : !examSubmitted ? (
            /* Active Exam in Progress */
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-lg space-y-6">
              {/* Header Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <span className="rounded-full bg-[#0F2C59] text-white px-3 py-1 text-xs font-bold uppercase">
                    Épreuve : {EXAM_SUBJECTS.find(s => s.id === selectedSubject)?.name}
                  </span>
                  <span className="text-xs text-slate-500 font-semibold">
                    Question {currentExamIndex + 1} sur {questions.length}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-mono text-xs font-bold ${
                    timeLeft < 180 ? 'bg-rose-50 text-rose-600 border border-rose-200 animate-pulse' : 'bg-slate-100 text-slate-700'
                  }`}>
                    <Timer className="h-4 w-4" />
                    <span>Temps restant : {formatTimer(timeLeft)}</span>
                  </div>

                  <button
                    onClick={() => setExamSubmitted(true)}
                    className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-1.5 text-xs font-bold transition-colors"
                  >
                    Valider & Corriger
                  </button>
                </div>
              </div>

              {/* Progress Indicator */}
              <div className="flex gap-2">
                {questions.map((_, qIdx) => (
                  <button
                    key={qIdx}
                    onClick={() => setCurrentExamIndex(qIdx)}
                    className={`flex-1 h-2 rounded-full transition-all ${
                      currentExamIndex === qIdx
                        ? 'bg-[#D4AF37]'
                        : userAnswers[qIdx] !== undefined
                        ? 'bg-[#0F2C59]'
                        : 'bg-slate-200'
                    }`}
                    title={`Aller à la question ${qIdx + 1}`}
                  />
                ))}
              </div>

              {/* Question Text */}
              <div className="space-y-2 py-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#D4AF37] bg-[#0F2C59] px-2.5 py-0.5 rounded">
                  Question {currentExamIndex + 1} ({questions[currentExamIndex].points} points)
                </span>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed pt-1">
                  {questions[currentExamIndex].text}
                </h3>
              </div>

              {/* 4 Choices */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {questions[currentExamIndex].options.map((option, optIdx) => {
                  const isSelected = userAnswers[currentExamIndex] === optIdx;
                  return (
                    <button
                      key={optIdx}
                      onClick={() => handleSelectAnswer(currentExamIndex, optIdx)}
                      className={`p-4 rounded-2xl border text-left text-xs sm:text-sm transition-all flex items-center justify-between cursor-pointer ${
                        isSelected
                          ? 'border-[#0F2C59] bg-[#0F2C59] text-white shadow'
                          : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-800'
                      }`}
                    >
                      <span>{option}</span>
                      {isSelected && (
                        <CheckCircle2 className="h-4 w-4 text-[#D4AF37] shrink-0 ml-2" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Navigation Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <button
                  onClick={() => setCurrentExamIndex(c => Math.max(0, c - 1))}
                  disabled={currentExamIndex === 0}
                  className="px-4 py-2 rounded-xl text-xs font-bold border border-slate-300 text-slate-600 disabled:opacity-30"
                >
                  Question précédente
                </button>

                {currentExamIndex < questions.length - 1 ? (
                  <button
                    onClick={() => setCurrentExamIndex(c => c + 1)}
                    className="px-5 py-2 rounded-xl text-xs font-bold bg-[#0F2C59] text-white hover:bg-[#163B72]"
                  >
                    Question suivante
                  </button>
                ) : (
                  <button
                    onClick={() => setExamSubmitted(true)}
                    className="px-6 py-2 rounded-xl text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 shadow"
                  >
                    Terminer et voir la note finale
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* Results & Complete Explanations */
            results && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-lg space-y-8">
                {/* Result Hero */}
                <div className="text-center max-w-lg mx-auto space-y-4">
                  <div className="h-16 w-16 mx-auto rounded-3xl bg-[#0F2C59] text-[#D4AF37] flex items-center justify-center shadow">
                    <Award className="h-8 w-8" />
                  </div>
                  <div>
                    <span className={`inline-block px-4 py-1 rounded-full text-xs font-bold border ${results.mentionColor}`}>
                      {results.mention}
                    </span>
                    <h3 className="text-3xl sm:text-4xl font-black font-display text-[#0F2C59] mt-2">
                      Note : {results.scorePercentage} / 100
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 mt-1">
                      {results.correctCount} bonnes réponses sur {questions.length} questions.
                    </p>
                  </div>

                  <div className="flex justify-center gap-3 pt-1">
                    <button
                      onClick={() => handleStartExam(selectedSubject)}
                      className="inline-flex items-center gap-2 rounded-xl bg-[#0F2C59] px-4 py-2 text-xs font-bold text-white hover:bg-[#163B72]"
                    >
                      <RotateCcw className="h-3.5 w-3.5 text-[#D4AF37]" />
                      Recommencer l’épreuve
                    </button>
                    <button
                      onClick={() => setIsExamRunning(false)}
                      className="inline-flex items-center gap-2 rounded-xl bg-slate-100 hover:bg-slate-200 px-4 py-2 text-xs font-bold text-slate-700"
                    >
                      Choisir une autre matière
                    </button>
                  </div>
                </div>

                {/* Detailed Questions Review */}
                <div className="space-y-4 pt-4 border-t border-slate-100">
                  <h4 className="text-base font-bold text-[#0F2C59] flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-[#D4AF37]" />
                    Corrigé détaillé et explications pas-à-pas :
                  </h4>

                  <div className="space-y-4">
                    {questions.map((q, idx) => {
                      const userChoice = userAnswers[idx];
                      const isCorrect = userChoice === q.correctIndex;
                      return (
                        <div
                          key={q.id}
                          className={`p-5 rounded-2xl border ${
                            isCorrect ? 'bg-emerald-50/40 border-emerald-200' : 'bg-rose-50/40 border-rose-200'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <h5 className="text-xs sm:text-sm font-bold text-slate-900">
                              Question {idx + 1} : {q.text}
                            </h5>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                              isCorrect ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                            }`}>
                              {isCorrect ? `+${q.points} pts (Réussi)` : '0 pt (Erreur)'}
                            </span>
                          </div>

                          <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                            <div>
                              <span className="text-slate-500 font-semibold block text-[11px]">Votre réponse :</span>
                              <div className={`p-2 rounded-xl border mt-0.5 font-medium ${
                                userChoice === undefined 
                                  ? 'bg-slate-100 text-slate-500 border-slate-200' 
                                  : isCorrect 
                                  ? 'bg-emerald-100 text-emerald-900 border-emerald-300' 
                                  : 'bg-rose-100 text-rose-900 border-rose-300'
                              }`}>
                                {userChoice !== undefined ? q.options[userChoice] : 'Non répondue'}
                              </div>
                            </div>

                            <div>
                              <span className="text-slate-500 font-semibold block text-[11px]">Bonne réponse officielle :</span>
                              <div className="p-2 rounded-xl border mt-0.5 font-medium bg-emerald-100 text-emerald-900 border-emerald-300">
                                {q.options[q.correctIndex]}
                              </div>
                            </div>
                          </div>

                          <div className="mt-3 p-3 rounded-xl bg-white border border-slate-200 text-xs text-slate-700 leading-relaxed">
                            <strong className="text-[#0F2C59]">Rappel de cours & explication : </strong>
                            {q.explanation}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      )}

      {/* VIEW 2: FICHES DE RÉVISION EXPRESS (MÉMENTO) */}
      {activeView === 'fiches' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold font-display text-[#0F2C59]">
                Fiches de Synthèse & Formules Indispensables
              </h3>
              <p className="text-xs text-slate-500">
                Révisez l'essentiel en un clin d'œil pour aborder les épreuves d'examen avec confiance.
              </p>
            </div>
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              <Printer className="h-3.5 w-3.5" />
              Imprimer les fiches
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Fiche Maths */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-[#0F2C59]">
                <div className="h-8 w-8 rounded-lg bg-[#0F2C59] text-[#D4AF37] flex items-center justify-center font-bold">
                  ∑
                </div>
                <h4 className="font-bold font-display text-base">Mémento Mathématiques</h4>
              </div>

              <div className="space-y-2.5 text-xs text-slate-700">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <strong className="text-[#0F2C59] block">1. Théorème de Pythagore (Triangle rectangle) :</strong>
                  <span className="font-mono text-sm text-[#D4AF37] font-bold block mt-0.5">BC² = AB² + AC²</span>
                  <p className="text-[11px] text-slate-500 mt-0.5">Le carré de l’hypoténuse est égal à la somme des carrés des deux autres côtés.</p>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <strong className="text-[#0F2C59] block">2. Formules d'Aires Indispensables :</strong>
                  <ul className="list-disc pl-4 space-y-0.5 text-[11px] mt-1">
                    <li>Carré : <span className="font-mono font-bold">Côté × Côté</span></li>
                    <li>Rectangle : <span className="font-mono font-bold">Longueur × Largeur</span></li>
                    <li>Triangle : <span className="font-mono font-bold">(Base × Hauteur) / 2</span></li>
                    <li>Cercle : <span className="font-mono font-bold">π × r²</span> (π ≈ 3,14)</li>
                  </ul>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <strong className="text-[#0F2C59] block">3. Pourcentages et Vitesse :</strong>
                  <p className="text-[11px] text-slate-600">
                    Vitesse = Distance / Temps (V = d/t). Pour une remise de x% sur un prix P : Remise = (P × x) / 100.
                  </p>
                </div>
              </div>
            </div>

            {/* Fiche Français */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-[#0F2C59]">
                <div className="h-8 w-8 rounded-lg bg-[#0F2C59] text-[#D4AF37] flex items-center justify-center font-bold">
                  Aa
                </div>
                <h4 className="font-bold font-display text-base">Règles d'Or en Français</h4>
              </div>

              <div className="space-y-2.5 text-xs text-slate-700">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <strong className="text-[#0F2C59] block">1. Accord du participe passé :</strong>
                  <ul className="list-disc pl-4 space-y-0.5 text-[11px] mt-1">
                    <li>Avec l’auxiliaire <strong className="text-[#0F2C59]">Être</strong> : s’accorde toujours avec le sujet (ex: <em>Elles sont parties</em>).</li>
                    <li>Avec l’auxiliaire <strong className="text-[#0F2C59]">Avoir</strong> : s’accorde avec le COD seulement s’il est placé avant (ex: <em>Les mangues qu’il a mangées</em>).</li>
                  </ul>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <strong className="text-[#0F2C59] block">2. Homophones grammaticaux fréquents :</strong>
                  <ul className="list-disc pl-4 space-y-0.5 text-[11px] mt-1">
                    <li><strong className="text-[#0F2C59]">a / à</strong> : « a » = verbe avoir (on peut dire « avait »), « à » = préposition accentuée.</li>
                    <li><strong className="text-[#0F2C59]">et / est</strong> : « et » = conjonction d’addition, « est » = verbe être (on peut dire « était »).</li>
                    <li><strong className="text-[#0F2C59]">son / sont</strong> : « sont » = verbe être (« étaient »), « son » = déterminant possessif (« mon »).</li>
                  </ul>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <strong className="text-[#0F2C59] block">3. Le Subjonctif Présent :</strong>
                  <p className="text-[11px] text-slate-600">
                    S’utilise après : <em>il faut que, afin que, bien que, pour que, avant que</em> (terminaisons : -e, -es, -e, -ions, -iez, -ent).
                  </p>
                </div>
              </div>
            </div>

            {/* Fiche Histoire d'Haïti */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-[#0F2C59]">
                <div className="h-8 w-8 rounded-lg bg-[#0F2C59] text-[#D4AF37] flex items-center justify-center font-bold">
                  🇭🇹
                </div>
                <h4 className="font-bold font-display text-base">Chronologie Clé d'Haïti</h4>
              </div>

              <div className="space-y-2 text-xs text-slate-700">
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                  <span className="font-bold font-mono text-[#0F2C59]">6 décembre 1492</span>
                  <span className="text-[11px] text-slate-600">Arrivée de Christophe Colomb au Môle-Saint-Nicolas</span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                  <span className="font-bold font-mono text-[#0F2C59]">14 août 1791</span>
                  <span className="text-[11px] text-slate-600">Cérémonie du Bois-Caïman (début de l'insurrection)</span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                  <span className="font-bold font-mono text-[#0F2C59]">18 novembre 1803</span>
                  <span className="text-[11px] text-slate-600">Bataille de Vertières (victoire de l'armée indigène)</span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                  <span className="font-bold font-mono text-[#0F2C59]">1er janvier 1804</span>
                  <span className="text-[11px] text-slate-600">Proclamation de l'Indépendance par Jean-Jacques Dessalines</span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                  <span className="font-bold font-mono text-[#0F2C59]">18 mai 1803</span>
                  <span className="text-[11px] text-slate-600">Création du bicolore bleu et rouge au Congrès de l'Arcahaie</span>
                </div>
              </div>
            </div>

            {/* Fiche Sciences */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-[#0F2C59]">
                <div className="h-8 w-8 rounded-lg bg-[#0F2C59] text-[#D4AF37] flex items-center justify-center font-bold">
                  🔬
                </div>
                <h4 className="font-bold font-display text-base">Sciences & SVT Essentielles</h4>
              </div>

              <div className="space-y-2.5 text-xs text-slate-700">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <strong className="text-[#0F2C59] block">1. L’Appareil Circulatoire :</strong>
                  <p className="text-[11px] text-slate-600">
                    Cœur = pompe à 4 cavités (2 oreillettes, 2 ventricules). Artères transportent le sang oxygéné; veines ramènent le sang vers le cœur.
                  </p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <strong className="text-[#0F2C59] block">2. La Photosynthèse :</strong>
                  <p className="text-[11px] text-slate-600">
                    Eau + Dioxyde de carbone (CO2) + Lumière solaire → Matière organique (glucose) + Oxygène (O2).
                  </p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <strong className="text-[#0F2C59] block">3. États de la matière pour l'eau :</strong>
                  <p className="text-[11px] text-slate-600">
                    Glace (solide) → Eau (liquide) = <em>Fusion</em>. Eau → Vapeur (gaz) = <em>Vaporisation</em>. Vapeur → Eau = <em>Condensation</em>.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 3: CONSEILS MÉTHODOLOGIQUES */}
      {activeView === 'conseils' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0F2C59] text-[#D4AF37]">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold font-display text-[#0F2C59]">
                5 Règles d'Or pour Réussir son Examen d'État
              </h3>
              <p className="text-xs text-slate-500">
                Conseils méthodologiques des enseignants de l'École Nazareth pour maximiser vos points.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#0F2C59] text-[#D4AF37] text-xs font-bold">
                  1
                </span>
                <h4 className="text-sm font-bold text-slate-900">Lire le sujet en entier</h4>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Prenez 5 à 10 minutes au début pour parcourir toutes les questions. Commencez par celles dont vous êtes sûr à 100% pour sécuriser vos premiers points.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#0F2C59] text-[#D4AF37] text-xs font-bold">
                  2
                </span>
                <h4 className="text-sm font-bold text-slate-900">Gérer son temps avec une montre</h4>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Ne restez jamais bloqué plus de 5 minutes sur un seul problème. Marquez-le au brouillon et avancez. Vous y reviendrez à la fin.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#0F2C59] text-[#D4AF37] text-xs font-bold">
                  3
                </span>
                <h4 className="text-sm font-bold text-slate-900">Soigner la présentation et la rédaction</h4>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Encadrez vos résultats finaux en mathématiques. En français, écrivez lisiblement sans ratures. Les correcteurs apprécient une copie propre et aérée.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#0F2C59] text-[#D4AF37] text-xs font-bold">
                  4
                </span>
                <h4 className="text-sm font-bold text-slate-900">Relecture obligatoire (15 minutes)</h4>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Conservez toujours les 15 dernières minutes pour traquer les fautes d'inattention, les oublis d'unités (cm, m³, Gourdes) et les accords de verbes.
              </p>
            </div>
          </div>

          {/* Spiritual Encouragement */}
          <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-3 text-amber-900">
            <Award className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs leading-relaxed">
              <strong className="font-bold">Confiance et prière : </strong>
              Avant d’entrer dans la salle d’examen, respirez calmement et remettez vos efforts au Seigneur : « Je puis tout par celui qui me fortifie » (Philippiens 4:13). Travaillez avec sérieux, Dieu bénira votre persévérance !
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
