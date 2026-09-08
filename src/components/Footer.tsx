import React, { useState } from 'react';
import { CHURCH_INFO } from '../data/churchData';
import { PageTab } from '../types';
import { apiService } from '../services/apiService';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Sparkles, 
  ChevronRight, 
  ShieldCheck, 
  Heart,
  Globe,
  FileText,
  Lock,
  Send,
  CheckCircle2
} from 'lucide-react';

interface FooterProps {
  onNavigate?: (tab: PageTab, payload?: any) => void;
  onSelectTab?: (tab: PageTab) => void;
  onOpenPrayerModal: () => void;
  onOpenDonationModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigate,
  onSelectTab,
  onOpenPrayerModal,
  onOpenDonationModal
}) => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterName, setNewsletterName] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState<{ loading: boolean; message: string; success: boolean } | null>(null);

  const handleNav = (tab: PageTab) => {
    if (onNavigate) {
      onNavigate(tab);
    } else if (onSelectTab) {
      onSelectTab(tab);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;

    setNewsletterStatus({ loading: true, message: '', success: false });

    try {
      const res = await apiService.subscribeNewsletter(newsletterName.trim(), newsletterEmail.trim());
      setNewsletterStatus({
        loading: false,
        message: res.message || 'Merci pour votre inscription à la newsletter !',
        success: true
      });
      setNewsletterEmail('');
      setNewsletterName('');
    } catch {
      setNewsletterStatus({
        loading: false,
        message: 'Inscription enregistrée.',
        success: true
      });
    }
  };

  const navLinks: { tab: PageTab; label: string }[] = [
    { tab: 'accueil', label: 'Accueil' },
    { tab: 'a-propos', label: 'À Propos (Foi & Doctrine)' },
    { tab: 'histoire', label: 'Histoire de Damé (1979 - 2026)' },
    { tab: 'leadership', label: 'Direction & Conseil Pastoral' },
    { tab: 'ministeres', label: 'Ministères & Départements' },
    { tab: 'education', label: 'Éducation (École Nazareth & EPND)' },
    { tab: 'galerie', label: 'Galerie Photos & Patrimoine' },
    { tab: 'evenements', label: 'Cultes, Horaires & Événements' },
    { tab: 'podcast', label: 'Podcasts & Messages Audio' },
    { tab: 'documents', label: 'Demande de Documents Officiels' },
    { tab: 'priere', label: 'Demande de Prière & Intercession' },
    { tab: 'projets', label: 'Projets Sociaux (CDEJ & Digicel)' },
    { tab: 'contact', label: 'Contact, Accès & Secrétariat' },
  ];

  return (
    <footer className="bg-[#081B36] text-slate-300 border-t-4 border-[#D4AF37]">
      {/* Top Pre-footer Call to Action & Newsletter */}
      <div className="bg-[#0F2C59] py-10 px-4 sm:px-6 lg:px-8 border-b border-slate-700/50">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <div className="lg:col-span-6 space-y-2">
            <span className="text-xs uppercase tracking-widest text-[#D4AF37] font-bold">Communion & Fraternité</span>
            <h3 className="text-2xl font-bold text-white font-display">
              Vous êtes toujours bienvenu à l'Église de Damé
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
              Recevez les annonces paroissiales, les dates des baptêmes et les nouvelles de nos œuvres éducatives et sociales directement par email.
            </p>
          </div>

          {/* Newsletter Input Box */}
          <div className="lg:col-span-6">
            <form onSubmit={handleNewsletterSubmit} className="bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-5 space-y-3 backdrop-blur-xs">
              <span className="text-xs font-bold text-white flex items-center gap-2">
                <Mail className="h-4 w-4 text-[#D4AF37]" />
                Lettre Pastorale & Newsletter Paroissiale
              </span>

              {newsletterStatus && (
                <div className={`p-2.5 rounded-xl text-xs flex items-center gap-2 ${
                  newsletterStatus.success 
                    ? 'bg-emerald-900/60 text-emerald-200 border border-emerald-700' 
                    : 'bg-rose-900/60 text-rose-200 border border-rose-700'
                }`}>
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                  <span>{newsletterStatus.message}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <input
                  type="text"
                  value={newsletterName}
                  onChange={(e) => setNewsletterName(e.target.value)}
                  placeholder="Votre prénom et nom"
                  className="w-full px-3 py-2 rounded-xl bg-slate-900/80 border border-slate-700 text-xs text-white placeholder-slate-400 focus:ring-2 focus:ring-[#D4AF37] outline-none"
                />
                <input
                  type="email"
                  required
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Votre adresse email *"
                  className="w-full px-3 py-2 rounded-xl bg-slate-900/80 border border-slate-700 text-xs text-white placeholder-slate-400 focus:ring-2 focus:ring-[#D4AF37] outline-none"
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                <span className="text-[11px] text-slate-400">
                  Inscription libre et respectueuse de votre vie privée.
                </span>
                <button
                  type="submit"
                  disabled={newsletterStatus?.loading}
                  className="px-4 py-2 rounded-xl bg-[#D4AF37] hover:bg-[#c59f2a] text-slate-950 text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>{newsletterStatus?.loading ? 'Inscription...' : "S'abonner"}</span>
                </button>
              </div>
            </form>
          </div>

        </div>
      </div>

      {/* Main Footer Links & Info */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Col 1: Identity */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img 
                src="/images/logo.svg" 
                alt="Logo Église de Damé" 
                className="h-12 w-12 object-contain bg-white/10 p-1.5 rounded-xl border border-white/20"
              />
              <div>
                <h4 className="font-bold text-white text-sm font-display tracking-wide">
                  {CHURCH_INFO.name}
                </h4>
                <p className="text-xs text-[#D4AF37] font-medium">District Bas Nord-Ouest • Haïti</p>
              </div>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Une communauté engagée depuis 1979 dans l'adoration, l'éducation par l'École Nazareth & l'EPND, et la compassion chrétienne à Damé.
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs">
              <button
                onClick={() => handleNav('documents')}
                className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-[#D4AF37] border border-[#D4AF37]/30 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <FileText className="h-3.5 w-3.5" />
                <span>Demande de Documents</span>
              </button>
            </div>
          </div>

          {/* Col 2: Navigation Rapide */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-b border-slate-700 pb-2">
              Navigation Rapide
            </h4>
            <ul className="space-y-2 text-xs">
              {navLinks.slice(0, 8).map((link) => (
                <li key={link.tab}>
                  <button
                    onClick={() => handleNav(link.tab)}
                    className="flex items-center gap-2 hover:text-white transition-colors py-0.5 group text-left w-full"
                  >
                    <ChevronRight className="h-3 w-3 text-slate-500 group-hover:text-[#D4AF37] shrink-0" />
                    <span className="truncate">{link.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Horaires des Services */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-b border-slate-700 pb-2 flex items-center gap-2">
              <Clock className="h-4 w-4 text-[#D4AF37]" />
              Cultes & Réunions
            </h4>
            <div className="space-y-3 text-xs">
              <div className="bg-slate-800/60 p-2.5 rounded-lg border border-slate-700/50">
                <span className="text-[#D4AF37] font-bold block">Dimanche Matin (08h00 - 11h30)</span>
                <span className="text-slate-300">Culte d'Adoration & Prédication</span>
              </div>
              <div className="bg-slate-800/60 p-2.5 rounded-lg border border-slate-700/50">
                <span className="text-[#D4AF37] font-bold block">Dimanche Après-midi (16h00)</span>
                <span className="text-slate-300">École du Dimanche pour Tous</span>
              </div>
              <div className="bg-slate-800/60 p-2.5 rounded-lg border border-slate-700/50">
                <span className="text-[#D4AF37] font-bold block">Mercredi (18h00 - 19h30)</span>
                <span className="text-slate-300">Étude Biblique Doctrinale</span>
              </div>
              <div className="bg-slate-800/60 p-2.5 rounded-lg border border-slate-700/50">
                <span className="text-[#D4AF37] font-bold block">Vendredi (18h00 - 19h45)</span>
                <span className="text-slate-300">Prière & Intercession</span>
              </div>
            </div>
          </div>

          {/* Col 4: Coordonnées & District */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-b border-slate-700 pb-2">
              Siège & Coordonnées
            </h4>
            <ul className="space-y-3 text-xs">
              <li className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 text-[#D4AF37] shrink-0 mt-0.5" />
                <span className="leading-relaxed">
                  {CHURCH_INFO.address}
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 text-[#D4AF37] shrink-0" />
                <a href={`tel:${CHURCH_INFO.phone}`} className="hover:text-white transition-colors">
                  {CHURCH_INFO.phone}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-[#D4AF37] shrink-0" />
                <a href={`mailto:${CHURCH_INFO.email}`} className="hover:text-white transition-colors break-all">
                  {CHURCH_INFO.email}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Globe className="h-4 w-4 text-[#D4AF37] shrink-0" />
                <span>{CHURCH_INFO.domain}</span>
              </li>
            </ul>

            <div className="pt-2 border-t border-slate-700/60 text-[11px] text-slate-400">
              <span className="block font-semibold text-slate-300">District Bas Nord-Ouest</span>
              <span>Église du Nazaréen Région Caraïbe</span>
            </div>
          </div>
        </div>

        {/* Bottom Legal bar */}
        <div className="mt-12 pt-6 border-t border-slate-800 text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-[#D4AF37]" />
            <span>
              © 1979 - 2026 {CHURCH_INFO.name}. Tous droits réservés.
            </span>
          </div>
          
          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <span>Devise : « Sainteté à l’Éternel »</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
