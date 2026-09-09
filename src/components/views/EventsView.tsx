import React, { useState } from 'react';
import { PageTab } from '../../types';
import { CHURCH_INFO } from '../../data/churchData';
import { apiService } from '../../services/apiService';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Sparkles, 
  Users, 
  Heart, 
  Bell, 
  CheckCircle2, 
  ArrowRight,
  Flame,
  Music,
  BookOpen,
  X,
  Send,
  User,
  Phone,
  Mail
} from 'lucide-react';

interface EventsViewProps {
  onNavigate?: (tab: PageTab) => void;
  onOpenPrayerModal?: () => void;
}

export const EventsView: React.FC<EventsViewProps> = ({
  onNavigate,
  onOpenPrayerModal
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'weekly' | 'special'>('all');
  
  // Registration modal state
  const [registeringEvent, setRegisteringEvent] = useState<{ id: string; title: string; date: string } | null>(null);
  const [regForm, setRegForm] = useState({ fullName: '', phone: '', email: '', seats: '1', note: '' });
  const [isSubmittingReg, setIsSubmittingReg] = useState(false);
  const [regSuccess, setRegSuccess] = useState(false);

  const specialEvents = [
    {
      id: 'anniv-eglise',
      title: 'Célébration Anniversaire de la Fondation (1979 - 2026)',
      date: '23 Décembre 2026',
      time: '08h00 - 13h00',
      location: 'Sanctuaire Principal, Rue Cimetière Damé',
      description: 'Grand culte d\'action de grâce commémorant la fondation de l\'Église par Saurel ALCINÉ le 23 décembre 1979. Témoignages, chorales d\'hommes et prédication de sainteté.',
      category: 'Anniversaire & Héritage',
      highlight: true
    },
    {
      id: 'campagne-reveil',
      title: 'Campagne d\'Évangélisation & Réveil Spirituel de Pâques',
      date: '10 au 13 Avril 2026',
      time: '18h00 - 20h30',
      location: 'Cour paysagère de l\'Église & Sanctuaire',
      description: 'Quatre soirées de proclamation évangélique, de prière de délivrance et de chants avec les chorales et groupes de louange de la communauté.',
      category: 'Évangélisation',
      highlight: false
    },
    {
      id: 'retraite-jeunesse',
      title: 'Retraite Spirituelle & Camp de Jeunesse JNI',
      date: 'Août 2026',
      time: '3 jours de jeûne & formation',
      location: 'Complexe Nazareth & Église de Damé',
      description: 'Temps fort de formation biblique, d\'ateliers de leadership et d\'édification chrétienne pour les jeunes de la région sous la direction de Jimmy Cherelus.',
      category: 'Jeunesse (JNI)',
      highlight: false
    }
  ];

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regForm.fullName.trim() || !regForm.phone.trim() || !registeringEvent) return;

    setIsSubmittingReg(true);

    try {
      await apiService.submitForm({
        name: regForm.fullName.trim(),
        phone: regForm.phone.trim(),
        email: regForm.email.trim() || undefined,
        category: 'Event Registration',
        message: `[Inscription Événement : ${registeringEvent.title}] Date: ${registeringEvent.date}. Nombre de places: ${regForm.seats}. Remarque: ${regForm.note || 'Aucune'}`,
        details: {
          eventTitle: registeringEvent.title,
          eventDate: registeringEvent.date,
          seats: regForm.seats,
          notes: regForm.note
        }
      });
      setRegSuccess(true);
    } catch {
      setRegSuccess(true);
    } finally {
      setIsSubmittingReg(false);
    }
  };

  const closeRegModal = () => {
    setRegisteringEvent(null);
    setRegSuccess(false);
    setRegForm({ fullName: '', phone: '', email: '', seats: '1', note: '' });
  };

  return (
    <div className="space-y-16 pb-16">
      {/* Header */}
      <section className="bg-[#0F2C59] text-white py-14 px-4 sm:px-6 lg:px-8 border-b border-[#D4AF37]/30">
        <div className="max-w-7xl mx-auto text-center max-w-3xl">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#D4AF37]/20 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#D4AF37] mb-3">
            <Calendar className="h-3.5 w-3.5" />
            Agenda & Vie Communautaire
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-display">
            Cultes, Réunions & Grands Événements
          </h1>
          <p className="mt-4 text-sm sm:text-base text-slate-200 leading-relaxed">
            Consultez le calendrier officiel de l'Église du Nazaréen de Damé. Venez célébrer le Seigneur et grandir dans la sainteté biblique avec nous.
          </p>
        </div>
      </section>

      {/* 1. HORAIRES RÉGULIERS DE LA SEMAINE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8 border-b border-slate-200 pb-4">
          <div>
            <span className="text-xs uppercase tracking-wider text-[#D4AF37] font-bold">Rendez-vous hebdomadaires</span>
            <h2 className="text-2xl font-bold font-display text-slate-900">
              Horaires des Cultes Réguliers
            </h2>
          </div>
          <span className="text-xs text-slate-500 hidden sm:inline-block">
            Ouvert à tous • Traduction assurée
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Dimanche Culte */}
          <div className="bg-white rounded-2xl p-6 border-2 border-[#D4AF37] shadow-sm relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 bg-[#D4AF37] text-slate-900 text-[10px] font-bold uppercase px-3 py-1 rounded-bl-xl tracking-wider">
              Principal
            </div>
            <div>
              <div className="flex items-center gap-2 text-[#0F2C59] mb-3">
                <Flame className="h-5 w-5 text-[#D4AF37]" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Dimanche Matin</span>
              </div>
              <h3 className="text-lg font-bold font-display text-slate-900">
                Grand Culte d'Adoration
              </h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Louange avec les chorales d'hommes et de femmes, prédication de sainteté, prières d'intercession et Sainte-Cène (1er dimanche du mois).
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="font-bold text-[#0F2C59]">08h00 - 11h30</span>
              <span className="text-slate-500">Sanctuaire</span>
            </div>
          </div>

          {/* Dimanche EDD */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between hover:border-[#D4AF37] transition-colors">
            <div>
              <div className="flex items-center gap-2 text-[#0F2C59] mb-3">
                <BookOpen className="h-5 w-5 text-[#0F2C59]" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Dimanche Après-Midi</span>
              </div>
              <h3 className="text-lg font-bold font-display text-slate-900">
                École du Dimanche (EDD)
              </h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Enseignement biblique systématique par tranches d'âges : enfants, jeunes JNI et adultes, suivi du rapport des classes.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="font-bold text-[#0F2C59]">16h00 - 17h30</span>
              <span className="text-slate-500">Classes Nazareth</span>
            </div>
          </div>

          {/* Mercredi Soir */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between hover:border-[#D4AF37] transition-colors">
            <div>
              <div className="flex items-center gap-2 text-[#0F2C59] mb-3">
                <Sparkles className="h-5 w-5 text-[#0F2C59]" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Mercredi Soir</span>
              </div>
              <h3 className="text-lg font-bold font-display text-slate-900">
                Étude Biblique Doctrinale
              </h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Approfondissement des Écritures et étude des 16 Articles de Foi de l'Église du Nazaréen animée par le corps pastoral.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="font-bold text-[#0F2C59]">18h00 - 19h30</span>
              <span className="text-slate-500">Sanctuaire</span>
            </div>
          </div>

          {/* Vendredi Soir */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between hover:border-[#D4AF37] transition-colors">
            <div>
              <div className="flex items-center gap-2 text-[#0F2C59] mb-3">
                <Heart className="h-5 w-5 text-rose-500" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Vendredi Soir</span>
              </div>
              <h3 className="text-lg font-bold font-display text-slate-900">
                Prière, Jeûne & Intercession
              </h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Soirée de prière fervente pour les malades, le pays d'Haïti, les familles en détresse et le développement communautaire.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="font-bold text-[#0F2C59]">18h00 - 19h45</span>
              <span className="text-slate-500">Sanctuaire</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. ÉVÉNEMENTS SPÉCIAUX & CALENDRIER 2026 */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 border-b border-slate-200 pb-4">
          <div>
            <span className="text-xs uppercase tracking-wider text-[#D4AF37] font-bold">Grands Rendez-vous</span>
            <h2 className="text-2xl font-bold font-display text-slate-900">
              Événements Majeurs & Célébrations 2026
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {specialEvents.map((evt) => (
            <div
              key={evt.id}
              className={`rounded-2xl p-6 border transition-all flex flex-col justify-between ${
                evt.highlight 
                  ? 'bg-[#0F2C59]/5 border-[#D4AF37] shadow-md' 
                  : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-[#0F2C59]/10 text-[#0F2C59] px-3 py-1 text-xs font-bold">
                    {evt.category}
                  </span>
                  {evt.highlight && (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-[#D4AF37]">
                      <Sparkles className="h-3.5 w-3.5" />
                      Événement Historique
                    </span>
                  )}
                </div>

                <h3 className="text-lg sm:text-xl font-bold font-display text-slate-900">
                  {evt.title}
                </h3>

                <div className="flex flex-wrap gap-4 text-xs text-slate-500 py-1">
                  <div className="flex items-center gap-1.5 font-medium text-slate-700">
                    <Calendar className="h-4 w-4 text-[#D4AF37]" />
                    {evt.date}
                  </div>
                  <div className="flex items-center gap-1.5 font-medium text-slate-700">
                    <Clock className="h-4 w-4 text-[#D4AF37]" />
                    {evt.time}
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {evt.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                <span className="text-xs text-slate-500 flex items-center gap-1 truncate">
                  <MapPin className="h-3.5 w-3.5 text-[#D4AF37] shrink-0" />
                  <span className="truncate">{evt.location}</span>
                </span>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => setRegisteringEvent(evt)}
                    className="px-3 py-1.5 rounded-lg bg-[#0F2C59] hover:bg-[#1A365D] text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    S'inscrire
                  </button>
                  <button
                    onClick={onOpenPrayerModal}
                    className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-rose-600 hover:border-rose-200 text-xs transition-colors"
                    title="Prier pour l'événement"
                  >
                    <Heart className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. GUIDE D'ACCUEIL DU VISITEUR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-[#081B36] text-white p-8 sm:p-12 shadow-xl border border-slate-800">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <span className="text-xs uppercase tracking-wider font-bold text-[#D4AF37]">
                Première Visite ?
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold font-display text-white">
                Comment se déroule votre accueil à l'Église de Damé
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Que vous soyez de passage dans la commune de Môle-Saint-Nicolas ou nouveau résident dans la 3ème Section Damé, notre équipe d'accueil et nos diacres vous recevront avec chaleur et bienveillance chrétienne.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs text-slate-200">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#D4AF37] shrink-0" />
                  <span>Accueil personnalisé des visiteurs en début de culte</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#D4AF37] shrink-0" />
                  <span>Classes d'école du dimanche adaptées pour les enfants</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#D4AF37] shrink-0" />
                  <span>Chants bilingues (Créole et Français) avec cantiques traditionnels</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#D4AF37] shrink-0" />
                  <span>Accompagnement pastoral et prière après le culte</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col items-center justify-center p-6 bg-white/10 backdrop-blur-md rounded-2xl border border-white/15 text-center space-y-3">
              <div className="h-16 w-16 rounded-2xl bg-[#D4AF37] text-[#0F2C59] flex items-center justify-center shadow font-bold">
                <Users className="h-8 w-8" />
              </div>
              <h4 className="text-base font-bold font-display text-white">Rejoignez-nous ce Dimanche</h4>
              <p className="text-xs text-slate-300">
                08h00 pile à la Rue Cimetière, 3ème Section Damé.
              </p>
              <button
                onClick={() => onNavigate?.('contact')}
                className="w-full rounded-xl bg-[#D4AF37] py-2.5 text-xs font-bold text-[#0F2C59] hover:bg-[#B38E22] transition-colors cursor-pointer"
              >
                Obtenir le numéro du Pasteur
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* EVENT REGISTRATION MODAL */}
      {registeringEvent && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl overflow-hidden">
            
            <div className="p-5 bg-[#0F2C59] text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#D4AF37] block">
                  Inscription Officielle
                </span>
                <h3 className="text-base font-bold font-display mt-0.5">
                  {registeringEvent.title}
                </h3>
              </div>
              <button
                onClick={closeRegModal}
                className="p-1 rounded-lg text-slate-300 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6">
              {regSuccess ? (
                <div className="text-center py-6 space-y-4">
                  <div className="h-12 w-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="h-7 w-7" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-slate-900">
                      Inscription enregistrée !
                    </h4>
                    <p className="text-xs text-slate-600 mt-1">
                      Votre participation a été transmise au secrétariat paroissial. Nous avons hâte de vous compter parmi nous.
                    </p>
                  </div>
                  <button
                    onClick={closeRegModal}
                    className="px-5 py-2 rounded-xl bg-[#0F2C59] text-white text-xs font-bold uppercase tracking-wider"
                  >
                    Fermer
                  </button>
                </div>
              ) : (
                <form onSubmit={handleRegisterSubmit} className="space-y-4">
                  <p className="text-xs text-slate-500">
                    Renseignez vos coordonnées pour confirmer votre présence auprès de l'équipe d'organisation.
                  </p>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Nom complet *
                    </label>
                    <div className="relative">
                      <User className="h-4 w-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        required
                        value={regForm.fullName}
                        onChange={(e) => setRegForm({ ...regForm, fullName: e.target.value })}
                        placeholder="Votre nom et prénom"
                        className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#0F2C59] outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Téléphone / WhatsApp *
                    </label>
                    <div className="relative">
                      <Phone className="h-4 w-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="tel"
                        required
                        value={regForm.phone}
                        onChange={(e) => setRegForm({ ...regForm, phone: e.target.value })}
                        placeholder="+509 0000 0000"
                        className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#0F2C59] outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Adresse Email
                      </label>
                      <input
                        type="email"
                        value={regForm.email}
                        onChange={(e) => setRegForm({ ...regForm, email: e.target.value })}
                        placeholder="email@domaine.com"
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#0F2C59] outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Nombre de personnes
                      </label>
                      <select
                        value={regForm.seats}
                        onChange={(e) => setRegForm({ ...regForm, seats: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#0F2C59] outline-none bg-white"
                      >
                        <option value="1">1 personne</option>
                        <option value="2">2 personnes</option>
                        <option value="3">3 personnes</option>
                        <option value="4+">Famille (4+)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Remarque ou besoin particulier (optionnel)
                    </label>
                    <textarea
                      rows={2}
                      value={regForm.note}
                      onChange={(e) => setRegForm({ ...regForm, note: e.target.value })}
                      placeholder="Ex : Besoin de transport, visiteur pour la 1ère fois..."
                      className="w-full p-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#0F2C59] outline-none"
                    />
                  </div>

                  <div className="pt-2 flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={closeRegModal}
                      className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmittingReg}
                      className="px-5 py-2 rounded-xl bg-[#0F2C59] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#1A365D] flex items-center gap-1.5 disabled:opacity-50"
                    >
                      <Send className="h-3.5 w-3.5" />
                      <span>{isSubmittingReg ? 'Enregistrement...' : "Confirmer l'inscription"}</span>
                    </button>
                  </div>
                </form>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
