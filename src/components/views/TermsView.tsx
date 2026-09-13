import React from 'react';
import { FileText, ShieldCheck, BookOpen, AlertCircle, Scale, CheckCircle2 } from 'lucide-react';
import { CHURCH_INFO } from '../../data/churchData';
import { PageTab } from '../../types';

interface TermsViewProps {
  onNavigate?: (tab: PageTab) => void;
}

export const TermsView: React.FC<TermsViewProps> = ({ onNavigate }) => {
  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      {/* Header Banner */}
      <section className="bg-[#0F2C59] text-white py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#D4AF37]/20 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#D4AF37]">
            <Scale className="h-3.5 w-3.5" />
            Cadre Réglementaire & Éthique
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-display">
            Conditions Générales d'Utilisation
          </h1>
          <p className="text-sm sm:text-base text-slate-200 max-w-2xl mx-auto leading-relaxed">
            Règles d'utilisation de la plateforme numérique officielle de l'Église du Nazaréen de Damé (Môle-Saint-Nicolas, Haïti).
          </p>
          <div className="text-xs text-slate-300 font-mono pt-2">
            Entrée en vigueur : 1er Janvier 2026
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-10 space-y-10 text-slate-700 leading-relaxed text-sm sm:text-base">

          {/* 1. Présentation */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold font-display text-[#0F2C59] flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#0F2C59]/10 text-xs font-bold text-[#0F2C59]">1</span>
              Objet de la Plateforme Numérique
            </h2>
            <p>
              Le site <code>{CHURCH_INFO.domain}</code> est le portail officiel de l'<strong>{CHURCH_INFO.name}</strong>, communauté ecclésiale évangélique fondée le 23 décembre 1979 et régie par le Manuel international de l'Église du Nazaréen.
            </p>
            <p>
              Ce service web a pour vocation exclusive :
            </p>
            <ul className="list-disc pl-6 space-y-1.5 text-slate-600">
              <li>La diffusion de l'Évangile, des enseignements théologiques et des prédications audio/vidéo d'édification.</li>
              <li>L'information des membres et de la diaspora sur les horaires de culte et les événements spirituels.</li>
              <li>L'inscription aux programmes de formation professionnelle (EPND) et l'accès aux jeux bibliques et éducatifs pour la jeunesse.</li>
              <li>Le recueil des demandes d'intercession spirituelle et la facilitation des démarches administratives.</li>
            </ul>
          </section>

          {/* 2. Propriété intellectuelle */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold font-display text-[#0F2C59] flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#0F2C59]/10 text-xs font-bold text-[#0F2C59]">2</span>
              Propriété Intellectuelle & Droits d'Auteur
            </h2>
            <p>
              L'ensemble des éléments figurant sur le site (textes, sceau officiel de l'Église, photographies patrimoniales, logo EPND, enregistrements audio de prédication et jeux bibliques) sont la propriété exclusive de l'Église du Nazaréen de Damé ou font l'objet d'une autorisation expresse d'utilisation.
            </p>
            <p className="text-xs text-slate-500 bg-slate-50 p-4 rounded-xl border border-slate-200">
              Toute reproduction totale ou partielle à des fins commerciales sans accord écrit préalable de la Direction pastorale est strictement interdite. La reproduction à des fins privées d'édification spirituelle chrétienne ou de partage fraternel est en revanche autorisée avec mention obligatoire de la source.
            </p>
          </section>

          {/* 3. Engagements de l'utilisateur */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold font-display text-[#0F2C59] flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#0F2C59]/10 text-xs font-bold text-[#0F2C59]">3</span>
              Utilisation Éthique & Respectueuse des Services
            </h2>
            <p>
              En accédant au portail de l'Église, chaque internaute s'engage à respecter les principes d'honnêteté et de respect mutuel chrétien. Il est formellement interdit de soumettre de fausses requêtes de prière, des propos diffamatoires, ou de tenter de perturber la sécurité du serveur.
            </p>
          </section>

          {/* 4. Partenaires et Annonces Google AdSense */}
          <section className="space-y-3 bg-slate-50 p-6 rounded-2xl border border-slate-200">
            <h2 className="text-xl sm:text-2xl font-bold font-display text-[#0F2C59] flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#0F2C59]/10 text-xs font-bold text-[#0F2C59]">4</span>
              Services Tiers & Programme Google AdSense
            </h2>
            <p>
              Le site héberge des encarts publicitaires gérés par <strong>Google AdSense</strong> (Éditeur <code>pub-7382968203880435</code>). Ces annonces sont générées par Google selon les technologies de ciblage automatisé conformes aux politiques d'utilisation acceptables de Google.
            </p>
            <p className="text-xs text-slate-600">
              L'Église ne saurait être tenue pour responsable des biens ou prestations proposés par les annonceurs tiers indépendants diffusés par le réseau publicitaire Google. L'utilisateur est invité à consulter notre Politique de Confidentialité pour toute information sur la gestion des cookies publicitaires.
            </p>
          </section>

          {/* 5. Juridiction & Contact */}
          <section className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold font-display text-[#0F2C59] flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#0F2C59]/10 text-xs font-bold text-[#0F2C59]">5</span>
              Droit Applicable et Contact Légal
            </h2>
            <p>
              Les présentes conditions sont soumises au droit haïtien et aux statuts de l'Église du Nazaréen en Haïti. Pour toute question, réclamation ou notification officielle, veuillez contacter le Secrétariat de l'Église :
            </p>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs sm:text-sm space-y-1">
              <p><strong>Secrétariat de l'Église du Nazaréen de Damé</strong></p>
              <p>Rue Cimetière, 3ème Section Damé, Môle-Saint-Nicolas, Nord-Ouest, Haïti</p>
              <p>Téléphone : {CHURCH_INFO.phone} • E-mail : {CHURCH_INFO.email}</p>
            </div>
          </section>

          {/* Navigation Footer */}
          <div className="pt-6 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4">
            <button
              onClick={() => onNavigate?.('confidentialite')}
              className="text-xs font-bold text-[#0F2C59] underline hover:text-[#D4AF37]"
            >
              Consulter la Politique de Confidentialité
            </button>
            <button
              onClick={() => onNavigate?.('accueil')}
              className="px-4 py-2 rounded-xl bg-[#0F2C59] text-white text-xs font-bold hover:bg-[#184282] transition-colors"
            >
              Retour à l'Accueil
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
