import React, { useState, useEffect } from 'react';
import { CHURCH_INFO } from '../../data/churchData';
import { CHURCH_ASSETS } from '../../data/churchMedia';
import { ImageModal } from '../ImageModal';
import { OfficialPhoto } from '../OfficialPhoto';
import { apiService } from '../../services/apiService';
import { SubmissionCategory } from '../../types';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  Send, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  Heart, 
  GraduationCap, 
  MessageSquare,
  Maximize2,
  Trees
} from 'lucide-react';

const STORAGE_CONTACT_DRAFT = 'dame_contact_form_draft';
const STORAGE_CONTACT_SUBMISSIONS = 'dame_contact_submissions';

export const ContactView: React.FC = () => {
  const [requestType, setRequestType] = useState<'general' | 'prayer' | 'epnd'>('general');
  const [modalCourOpen, setModalCourOpen] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    subject: '',
    message: '',
    epndCourse: 'couture',
    prayerCategory: 'Santé & Guérison'
  });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    try {
      const draft = localStorage.getItem(STORAGE_CONTACT_DRAFT);
      if (draft) {
        setFormData(JSON.parse(draft));
      }
    } catch {
      // Ignore
    }
  }, []);

  const handleChange = (field: string, val: string) => {
    const updated = { ...formData, [field]: val };
    setFormData(updated);
    try {
      localStorage.setItem(STORAGE_CONTACT_DRAFT, JSON.stringify(updated));
    } catch {
      // Ignore
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName.trim() || !formData.message.trim()) return;

    let category: SubmissionCategory = 'Contact Messages';
    if (requestType === 'prayer') category = 'Prayer Requests';
    if (requestType === 'epnd') category = 'Event Registration';

    try {
      await apiService.submitForm({
        name: formData.fullName.trim(),
        email: formData.email.trim() || undefined,
        phone: formData.phone.trim() || undefined,
        category,
        message: formData.subject ? `[${formData.subject}] ${formData.message.trim()}` : formData.message.trim(),
        details: {
          requestType,
          subject: formData.subject,
          epndCourse: requestType === 'epnd' ? formData.epndCourse : undefined,
          prayerCategory: requestType === 'prayer' ? formData.prayerCategory : undefined
        }
      });
      localStorage.removeItem(STORAGE_CONTACT_DRAFT);
    } catch {
      // Ignore fallback handled by apiService
    }

    setSubmitted(true);
  };

  const resetForm = () => {
    setSubmitted(false);
    setFormData({
      fullName: '',
      phone: '',
      email: '',
      subject: '',
      message: '',
      epndCourse: 'couture',
      prayerCategory: 'Santé & Guérison'
    });
  };

  return (
    <div className="space-y-16 pb-16">
      {/* Page Header */}
      <section className="bg-[#0F2C59] text-white py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center max-w-3xl">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#D4AF37]/20 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#D4AF37] mb-3">
            <MapPin className="h-3.5 w-3.5" />
            Accès & Correspondance
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-display">
            Contact & Requêtes
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-200 leading-relaxed">
            Nous sommes à votre disposition pour toute demande d'information, prière pastorale, admission à l'École EPND ou partenariat pour la 3ème Section Damé.
          </p>
        </div>
      </section>

      {/* Main Grid: Details + Map + Multi-use Form */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column (Coordonnées & Carte) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Contact details box */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#D4AF37]">
                  Fiche Technique Officielle
                </span>
                <h3 className="text-xl font-bold font-display text-[#0F2C59] mt-1">
                  {CHURCH_INFO.name}
                </h3>
                <p className="text-xs text-slate-500 font-semibold">{CHURCH_INFO.motto}</p>
              </div>

              <ul className="space-y-4 text-xs sm:text-sm text-slate-600">
                <li className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-[#0F2C59] shrink-0 mt-0.5" />
                  <span className="leading-relaxed">
                    <strong>Adresse :</strong><br />
                    {CHURCH_INFO.address}
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-[#0F2C59] shrink-0" />
                  <div>
                    <strong>Téléphone :</strong><br />
                    <a href={`tel:${CHURCH_INFO.phone}`} className="text-[#0F2C59] font-bold hover:underline">
                      {CHURCH_INFO.phone}
                    </a>
                  </div>
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-[#0F2C59] shrink-0" />
                  <div>
                    <strong>Email officiel :</strong><br />
                    <a href={`mailto:${CHURCH_INFO.email}`} className="text-[#0F2C59] font-semibold hover:underline break-all">
                      {CHURCH_INFO.email}
                    </a>
                  </div>
                </li>
                <li className="flex items-center gap-3">
                  <Globe className="h-5 w-5 text-[#0F2C59] shrink-0" />
                  <div>
                    <strong>Domaine :</strong><br />
                    <span>{CHURCH_INFO.domain}</span>
                  </div>
                </li>
              </ul>

              <div className="pt-4 border-t border-slate-100 text-xs text-slate-500 space-y-1.5">
                <div>District ecclésial : <strong className="text-slate-800">{CHURCH_INFO.district}</strong></div>
                <div>Fondateur : <strong className="text-slate-800">{CHURCH_INFO.founder}</strong></div>
                <div>Pasteur Principal : <strong className="text-slate-800">{CHURCH_INFO.leadPastor}</strong></div>
                <div>Effectif paroissial : <strong className="text-slate-800">{CHURCH_INFO.membership}</strong></div>
              </div>
            </div>

            {/* Vue Réelle : Cour & Sanctuaire à Fond Damé */}
            <div 
              onClick={() => setModalCourOpen(true)}
              className="group rounded-3xl border border-slate-200 bg-white overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer"
            >
              <div className="relative aspect-16/9 w-full bg-slate-100 overflow-hidden">
                <OfficialPhoto
                  src={CHURCH_ASSETS.courPaysage.src}
                  alt={CHURCH_ASSETS.courPaysage.alt}
                  fallbackCandidates={CHURCH_ASSETS.courPaysage.candidates ? [...CHURCH_ASSETS.courPaysage.candidates] : []}
                  title={CHURCH_ASSETS.courPaysage.title}
                  caption={CHURCH_ASSETS.courPaysage.caption}
                  badge="Cour & Sanctuaire"
                  aspectRatioClass="aspect-16/9"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
                <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded-full bg-[#081B36]/85 backdrop-blur-md px-2.5 py-1 text-[11px] font-bold text-white border border-white/20 shadow">
                  <Trees className="h-3.5 w-3.5 text-emerald-400" />
                  Cour & Sanctuaire
                </div>
                <div className="absolute top-3 right-3 h-8 w-8 rounded-full bg-black/60 backdrop-blur-md text-white flex items-center justify-center opacity-80 group-hover:opacity-100 hover:bg-[#D4AF37] hover:text-[#0F2C59] transition-all">
                  <Maximize2 className="h-4 w-4" />
                </div>
                <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-white text-[11px]">
                  <span className="inline-flex items-center gap-1 font-medium">
                    <MapPin className="h-3.5 w-3.5 text-[#D4AF37]" />
                    Fond Damé • Rue Cimetière
                  </span>
                  <span className="text-[#D4AF37] font-semibold text-[10px]">Agrandir la photo</span>
                </div>
              </div>
              <div className="p-4">
                <h4 className="text-sm font-bold font-display text-slate-900 group-hover:text-[#0F2C59] transition-colors">
                  Le Sanctuaire & l'Enceinte Communautaire
                </h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  L'espace paisible de l'Église du Nazaréen et de l'École Nazareth, entouré de verdure et de palmiers à Fond Damé.
                </p>
              </div>
            </div>

            {/* Interactive OpenStreetMap Embed Iframe */}
            <div className="rounded-3xl border border-slate-200 bg-white overflow-hidden shadow-sm">
              <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold text-[#0F2C59] flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 text-[#D4AF37]" />
                  Localisation cartographique (Môle-Saint-Nicolas / Damé)
                </span>
                <span className="text-[10px] text-slate-400">OpenStreetMap</span>
              </div>
              <div className="h-64 w-full relative bg-slate-100">
                <iframe
                  title="Carte Église du Nazaréen de Damé"
                  className="w-full h-full border-0"
                  loading="lazy"
                  src="https://www.openstreetmap.org/export/embed.html?bbox=-73.42,19.78,-73.34,19.85&layer=mapnik&marker=19.805,-73.385"
                />
              </div>
              <div className="p-3 text-[11px] text-slate-500 text-center bg-white border-t border-slate-100">
                Rue Cimetière, 3ème Section Damé, Commune Môle-Saint-Nicolas, Nord-Ouest, Haïti.
              </div>
            </div>
          </div>

          {/* Right Column (Formulaire multi-usage dynamique) */}
          <div className="lg:col-span-7">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-10 shadow-sm space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#0F2C59]">
                  Formulaire Multi-Usage Dynamique
                </span>
                <h3 className="text-2xl font-bold font-display text-slate-900 mt-1">
                  Envoyer un message ou une requête
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Sélectionnez l'objet de votre démarche pour adapter les champs requis.
                </p>
              </div>

              {/* Selector for request type */}
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'general', label: 'Contact Général', icon: <MessageSquare className="h-4 w-4" /> },
                  { id: 'prayer', label: 'Demande de Prière', icon: <Heart className="h-4 w-4" /> },
                  { id: 'epnd', label: 'Inscription EPND', icon: <GraduationCap className="h-4 w-4" /> }
                ].map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setRequestType(t.id as any)}
                    className={`p-3 rounded-xl border text-xs font-bold transition-all flex flex-col items-center justify-center gap-1.5 ${
                      requestType === t.id
                        ? 'border-[#0F2C59] bg-[#0F2C59] text-white shadow'
                        : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {t.icon}
                    <span>{t.label}</span>
                  </button>
                ))}
              </div>

              {submitted ? (
                <div className="py-12 text-center space-y-4">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                    <CheckCircle2 className="h-10 w-10" />
                  </div>
                  <h4 className="text-xl font-bold text-[#0F2C59] font-display">
                    Message transmis avec succès !
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-600 max-w-sm mx-auto leading-relaxed">
                    Merci pour votre message. Le secrétariat de l'Église du Nazaréen de Damé prendra connaissance de votre demande dans les plus brefs délais.
                  </p>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="rounded-xl bg-[#0F2C59] px-6 py-2.5 text-xs font-semibold text-white hover:bg-[#1A3D73] transition-colors"
                  >
                    Envoyer une autre requête
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold uppercase tracking-wider text-slate-700 mb-1">
                        Nom complet <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Ex : Jean-Claude Moïse"
                        value={formData.fullName}
                        onChange={(e) => handleChange('fullName', e.target.value)}
                        className="w-full rounded-xl border border-slate-300 p-2.5 text-sm focus:border-[#0F2C59] focus:outline-none focus:ring-1 focus:ring-[#0F2C59]"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold uppercase tracking-wider text-slate-700 mb-1">
                        Téléphone / WhatsApp <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="+509 ..."
                        value={formData.phone}
                        onChange={(e) => handleChange('phone', e.target.value)}
                        className="w-full rounded-xl border border-slate-300 p-2.5 text-sm focus:border-[#0F2C59] focus:outline-none focus:ring-1 focus:ring-[#0F2C59]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold uppercase tracking-wider text-slate-700 mb-1">
                      Adresse Email <span className="text-slate-400 font-normal">(Optionnel)</span>
                    </label>
                    <input
                      type="email"
                      placeholder="nom@exemple.com"
                      value={formData.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      className="w-full rounded-xl border border-slate-300 p-2.5 text-sm focus:border-[#0F2C59] focus:outline-none focus:ring-1 focus:ring-[#0F2C59]"
                    />
                  </div>

                  {/* Contextual fields depending on requestType */}
                  {requestType === 'prayer' && (
                    <div>
                      <label className="block font-semibold uppercase tracking-wider text-slate-700 mb-1">
                        Catégorie de prière
                      </label>
                      <select
                        value={formData.prayerCategory}
                        onChange={(e) => handleChange('prayerCategory', e.target.value)}
                        className="w-full rounded-xl border border-slate-300 p-2.5 text-sm focus:border-[#0F2C59] focus:outline-none focus:ring-1 focus:ring-[#0F2C59]"
                      >
                        <option value="Santé & Guérison">Santé & Guérison</option>
                        <option value="Famille & Foyer">Famille & Foyer</option>
                        <option value="Délivrance & Sanctification">Délivrance & Sanctification</option>
                        <option value="Action de Grâce">Action de Grâce</option>
                      </select>
                    </div>
                  )}

                  {requestType === 'epnd' && (
                    <div>
                      <label className="block font-semibold uppercase tracking-wider text-slate-700 mb-1">
                        Filière de formation EPND
                      </label>
                      <select
                        value={formData.epndCourse}
                        onChange={(e) => handleChange('epndCourse', e.target.value)}
                        className="w-full rounded-xl border border-slate-300 p-2.5 text-sm focus:border-[#0F2C59] focus:outline-none focus:ring-1 focus:ring-[#0F2C59]"
                      >
                        <option value="couture">Couture & Modélisme (9 mois)</option>
                        <option value="maconnerie">Maçonnerie Parasismique (10 mois)</option>
                        <option value="musique">Musique & Solfège (6 mois)</option>
                        <option value="anglais">Anglais Pratique & Professionnel (6 mois)</option>
                      </select>
                    </div>
                  )}

                  <div>
                    <label className="block font-semibold uppercase tracking-wider text-slate-700 mb-1">
                      {requestType === 'prayer' ? 'Votre requête détaillée' : 'Votre message ou demande'} <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      required
                      rows={5}
                      placeholder="Écrivez votre message ici avec autant de détails que nécessaire..."
                      value={formData.message}
                      onChange={(e) => handleChange('message', e.target.value)}
                      className="w-full rounded-xl border border-slate-300 p-3 text-sm focus:border-[#0F2C59] focus:outline-none focus:ring-1 focus:ring-[#0F2C59]"
                    />
                  </div>

                  <div className="rounded-xl bg-slate-50 p-3 border border-slate-200 text-slate-500 text-[11px] flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <ShieldCheck className="h-4 w-4 text-[#D4AF37]" />
                      Brouillon sauvegardé automatiquement sur cet appareil
                    </span>
                    <button
                      type="submit"
                      className="inline-flex items-center gap-2 rounded-xl bg-[#0F2C59] px-6 py-2.5 text-xs font-bold text-white hover:bg-[#1A3D73] transition-colors shadow-sm"
                    >
                      <Send className="h-4 w-4" />
                      Envoyer la demande
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      <ImageModal
        image={modalCourOpen ? CHURCH_ASSETS.courPaysage : null}
        onClose={() => setModalCourOpen(false)}
      />
    </div>
  );
};
