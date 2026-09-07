import React, { useState } from 'react';
import { PageTab } from '../../types';
import { CHURCH_INFO } from '../../data/churchData';
import { apiService } from '../../services/apiService';
import { 
  Heart, 
  Sparkles, 
  Send, 
  CheckCircle2, 
  ShieldCheck, 
  Clock, 
  Phone, 
  Lock, 
  BookOpen,
  ArrowRight
} from 'lucide-react';

interface PrayerRequestViewProps {
  onNavigate?: (tab: PageTab) => void;
}

export const PrayerRequestView: React.FC<PrayerRequestViewProps> = ({ onNavigate }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    category: 'Santé & Guérison',
    isAnonymous: false,
    isConfidential: true,
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    'Santé & Guérison',
    'Famille, Foyer & Enfants',
    'Épreuves Financières & Travail',
    'Protection Spirituelle & Délivrance',
    'Études, Examens & Projets',
    'Action de Grâce & Témoignage'
  ];

  const biblicalPromises = [
    {
      verse: "« Ne vous inquiétez de rien; mais en toute chose faites connaître vos besoins à Dieu par des prières et des supplications, avec des actions de grâces. Et la paix de Dieu, qui surpasse toute intelligence, gardera vos cœurs et vos pensées en Jésus-Christ. »",
      ref: "Philippiens 4:6-7"
    },
    {
      verse: "« La prière de la foi sauvera le malade, et le Seigneur le relèvera; et s'il a commis des péchés, il lui sera pardonné. Confessez donc vos péchés les uns aux autres, et priez les uns pour les autres, afin que vous soyez guéris. »",
      ref: "Jacques 5:15-16"
    },
    {
      verse: "« Si deux d'entre vous s'accordent sur la terre pour demander une chose quelconque, elle leur sera accordée par mon Père qui est dans les cieux. Car là où deux ou trois sont assemblés en mon nom, je suis au milieu d'eux. »",
      ref: "Matthieu 18:19-20"
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await apiService.submitForm({
        name: formData.isAnonymous ? 'Anonyme (Fidèle de Damé)' : (formData.fullName || 'Fidèle de Damé'),
        phone: formData.phone || undefined,
        email: formData.email || undefined,
        category: 'Prayer Requests',
        message: `[${formData.category}] ${formData.message}`,
        details: {
          category: formData.category,
          isAnonymous: formData.isAnonymous,
          isConfidential: formData.isConfidential
        }
      });
    } catch {
      // Local fallback handled by apiService
    }

    setIsSubmitting(false);
    setSubmitted(true);
  };

  return (
    <div className="space-y-16 pb-16">
      {/* Header */}
      <section className="bg-gradient-to-b from-[#081B36] to-[#0F2C59] text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center max-w-3xl space-y-4">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#D4AF37]/20 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#D4AF37]">
            <Heart className="h-4 w-4 text-rose-400" />
            Intercession & Soutien Spirituel
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-display">
            Demande de Prière & Intercession
          </h1>
          <p className="text-sm sm:text-base text-slate-200 leading-relaxed max-w-2xl mx-auto">
            Vous traversez une épreuve, une maladie ou un fardeau ? Le Pasteur Bequel CHERELUS et le comité d'intercession de l'Église du Nazaréen de Damé prient fidèlement pour vous.
          </p>
        </div>
      </section>

      {/* Main Content Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Form Column */}
          <div className="lg:col-span-7">
            <div className="rounded-3xl border border-slate-200 bg-white p-8 sm:p-10 shadow-lg">
              {submitted ? (
                <div className="text-center py-12 space-y-4">
                  <div className="h-16 w-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow">
                    <CheckCircle2 className="h-8 w-8" />
                  </div>
                  <h3 className="text-2xl font-bold font-display text-slate-900">
                    Votre requête a été reçue
                  </h3>
                  <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                    Elle sera portée dans la prière par le corps pastoral et lors de la réunion d'intercession du vendredi soir. Que la paix de Dieu garde votre cœur.
                  </p>
                  <div className="pt-4">
                    <button
                      onClick={() => {
                        setSubmitted(false);
                        setFormData({
                          fullName: '',
                          phone: '',
                          email: '',
                          category: 'Santé & Guérison',
                          isAnonymous: false,
                          isConfidential: true,
                          message: ''
                        });
                      }}
                      className="rounded-xl bg-[#0F2C59] px-6 py-2.5 text-xs font-bold text-white hover:bg-[#1A3D73]"
                    >
                      Déposer une autre requête
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#D4AF37] bg-[#0F2C59] px-3 py-1 rounded-full">
                      Formulaire de Prière
                    </span>
                    <h2 className="text-2xl font-bold font-display text-[#0F2C59] mt-3">
                      Partagez votre fardeau avec l'Église
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">
                      Les requêtes confidentielles ne sont lues que par le Pasteur Principal.
                    </p>
                  </div>

                  {/* Anonymous Toggle */}
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-slate-800 block">Souhaitez-vous garder l'anonymat ?</span>
                      <span className="text-[11px] text-slate-500">Votre nom ne sera mentionné nulle part</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.isAnonymous}
                        onChange={(e) => setFormData({ ...formData, isAnonymous: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#D4AF37]"></div>
                    </label>
                  </div>

                  {!formData.isAnonymous && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Nom & Prénom
                        </label>
                        <input
                          type="text"
                          required={!formData.isAnonymous}
                          placeholder="Ex: Frère Jean Baptiste"
                          value={formData.fullName}
                          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                          className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-xs text-slate-800 focus:border-[#0F2C59] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Téléphone (WhatsApp / SMS)
                        </label>
                        <input
                          type="tel"
                          placeholder="+509 XXXX XXXX"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-xs text-slate-800 focus:border-[#0F2C59] focus:outline-none"
                        />
                      </div>
                    </div>
                  )}

                  {/* Category Selector */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-2">
                      Sujet ou Motif Principal de la Prière
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {categories.map((cat) => (
                        <button
                          type="button"
                          key={cat}
                          onClick={() => setFormData({ ...formData, category: cat })}
                          className={`p-2.5 rounded-xl text-xs font-semibold text-left transition-all border ${
                            formData.category === cat
                              ? 'bg-[#0F2C59] text-[#D4AF37] border-[#0F2C59] shadow-sm'
                              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Detailed message */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Votre Message & Détails de la Requête *
                    </label>
                    <textarea
                      rows={5}
                      required
                      placeholder="Décrivez votre situation en toute confiance. Nous croyons que Dieu entend et répond à la prière faite avec foi..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full rounded-xl border border-slate-300 px-4 py-3 text-xs text-slate-800 focus:border-[#0F2C59] focus:outline-none"
                    ></textarea>
                  </div>

                  {/* Confidentiality check */}
                  <div className="flex items-start gap-2.5 text-xs text-slate-600">
                    <input
                      type="checkbox"
                      id="confidentiality"
                      checked={formData.isConfidential}
                      onChange={(e) => setFormData({ ...formData, isConfidential: e.target.checked })}
                      className="mt-0.5 rounded border-slate-300 text-[#0F2C59] focus:ring-[#0F2C59]"
                    />
                    <label htmlFor="confidentiality" className="cursor-pointer">
                      <strong>Requête confidentielle :</strong> transmise uniquement au Pasteur Principal Bequel CHERELUS.
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#D4AF37] py-3.5 text-xs sm:text-sm font-bold text-[#0F2C59] hover:bg-[#B38E22] transition-colors shadow-md disabled:opacity-50"
                  >
                    <Send className="h-4 w-4" />
                    {isSubmitting ? 'Envoi en cours...' : 'Envoyer ma requête de prière'}
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Right Column: Biblical Promises & Worship Hours */}
          <div className="lg:col-span-5 space-y-6">
            {/* Pastoral note card */}
            <div className="rounded-3xl bg-[#081B36] text-white p-7 shadow-lg border border-slate-800 space-y-4">
              <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#D4AF37] text-[#0F2C59] font-bold shadow">
                  <Clock className="h-6 w-6" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#D4AF37]">Moments Clés</span>
                  <h3 className="text-base font-bold font-display">Soirée d'Intercession</h3>
                </div>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Chaque <strong>Vendredi soir de 18h00 à 19h45</strong>, le comité d'intercession et les fidèles se réunissent au sanctuaire pour prier nominativement pour chaque requête reçue.
              </p>
              <div className="pt-2 text-xs text-slate-400 space-y-1">
                <div>Permanence Pastorale : <strong className="text-white">+509 48596089</strong></div>
                <div>Lieu : <strong className="text-white">Rue Cimetière, 3ème Section Damé</strong></div>
              </div>
            </div>

            {/* Biblical promises */}
            <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#0F2C59]">
                <BookOpen className="h-4 w-4 text-[#D4AF37]" />
                Promesses de Dieu pour vous
              </div>

              <div className="space-y-4">
                {biblicalPromises.map((p, idx) => (
                  <div key={idx} className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-1.5">
                    <p className="text-xs text-slate-700 italic leading-relaxed">
                      {p.verse}
                    </p>
                    <span className="text-[11px] font-bold text-[#0F2C59] block text-right">
                      — {p.ref}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
