import React from 'react';
import { Shield, Lock, Eye, CheckCircle2, Mail, MapPin, Globe, ExternalLink, AlertCircle } from 'lucide-react';
import { CHURCH_INFO } from '../../data/churchData';
import { PageTab } from '../../types';

interface PrivacyPolicyViewProps {
  onNavigate?: (tab: PageTab) => void;
}

export const PrivacyPolicyView: React.FC<PrivacyPolicyViewProps> = ({ onNavigate }) => {
  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      {/* Header Banner */}
      <section className="bg-[#0F2C59] text-white py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#D4AF37]/20 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#D4AF37]">
            <Shield className="h-3.5 w-3.5" />
            Transparence & Protection des Données
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-display">
            Politique de Confidentialité
          </h1>
          <p className="text-sm sm:text-base text-slate-200 max-w-2xl mx-auto leading-relaxed">
            Engagement de l'Église du Nazaréen de Damé pour la protection de votre vie privée, la gestion des cookies et l'utilisation transparente des services partenaires tels que Google AdSense et Mailchimp.
          </p>
          <div className="text-xs text-slate-300 font-mono pt-2">
            Dernière mise à jour : 1er Mars 2026
          </div>
        </div>
      </section>

      {/* Main Content Container */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-10 space-y-10 text-slate-700 leading-relaxed text-sm sm:text-base">

          {/* 1. Introduction & Responsable du traitement */}
          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold font-display text-[#0F2C59] flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#0F2C59]/10 text-xs font-bold text-[#0F2C59]">1</span>
              Responsable du Traitement des Données
            </h2>
            <p>
              La présente Politique de Confidentialité s'applique au site officiel de l'<strong>{CHURCH_INFO.name}</strong>, accessible à l'adresse <code>{CHURCH_INFO.domain}</code>.
            </p>
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 text-xs sm:text-sm space-y-1.5">
              <p><strong>Entité :</strong> Église du Nazaréen de Damé (Institution religieuse et éducative)</p>
              <p><strong>Représentant légal :</strong> Pasteur Bequel CHERELUS, Pasteur Principal</p>
              <p><strong>Adresse :</strong> {CHURCH_INFO.address}</p>
              <p><strong>Téléphone :</strong> {CHURCH_INFO.phone}</p>
              <p><strong>E-mail officiel :</strong> {CHURCH_INFO.email}</p>
            </div>
          </section>

          {/* 2. Données personnelles collectées */}
          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold font-display text-[#0F2C59] flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#0F2C59]/10 text-xs font-bold text-[#0F2C59]">2</span>
              Données Personnelles Collectées et Finalités
            </h2>
            <p>
              Nous collectons uniquement les informations strictement nécessaires à la communion fraternelle, aux requêtes spirituelles et à la délivrance des services de l'Église :
            </p>
            <ul className="list-disc pl-6 space-y-2 text-slate-600">
              <li><strong>Formulaires de Demande de Prière :</strong> Prénom, nom, e-mail, téléphone (facultatif) et intention spirituelle afin de permettre au collège pastoral et aux cellules d'intercession de prier pour vos besoins.</li>
              <li><strong>Inscriptions et Formations (École EPND) :</strong> Coordonnées, niveau d'études et filière souhaitée pour la constitution des promotions académiques.</li>
              <li><strong>Demandes administratives de documents :</strong> Informations relatives aux attestations de baptême, certificats de mariage ou transferts de membres.</li>
              <li><strong>Lettre Pastorale & Newsletter :</strong> Adresse e-mail pour l'envoi régulier des prédications et nouvelles paroissiales via notre partenaire Mailchimp.</li>
            </ul>
          </section>

          {/* 3. Google AdSense & Cookies Tiers (Crucial pour conformité AdSense) */}
          <section className="space-y-4 bg-amber-50/50 rounded-2xl p-6 sm:p-7 border border-amber-200/80">
            <h2 className="text-xl sm:text-2xl font-bold font-display text-amber-950 flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-200 text-xs font-bold text-amber-900">3</span>
              Google AdSense, Cookies Publicitaires & Fournisseurs Tiers
            </h2>
            <p className="text-amber-900 font-medium">
              Afin de soutenir les œuvres éducatives et sociales de l'Église, notre site participe au programme publicitaire <strong>Google AdSense</strong> (Identifiant Éditeur : <code>pub-7382968203880435</code>).
            </p>
            
            <div className="space-y-3 text-slate-700 text-xs sm:text-sm">
              <p>
                <strong>Fonctionnement des cookies publicitaires de Google :</strong>
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Des fournisseurs tiers, y compris Google, utilisent des cookies pour diffuser des annonces pertinentes sur notre site web en fonction des visites antérieures des internautes sur ce site ou sur d'autres sites web.
                </li>
                <li>
                  Grâce aux cookies publicitaires (notamment les cookies DART ou identifiants publicitaires mobiles), Google et ses partenaires adaptent les annonces diffusées auprès de nos visiteurs en fonction de leur navigation sur notre site et/ou d'autres sites Internet.
                </li>
                <li>
                  Les utilisateurs peuvent choisir de désactiver la publicité personnalisée dans les <a href="https://adssettings.google.com/" target="_blank" rel="noopener noreferrer" className="text-[#0F2C59] font-bold underline inline-flex items-center gap-1">Paramètres des annonces Google <ExternalLink className="h-3 w-3" /></a>.
                </li>
                <li>
                  Vous pouvez également désactiver les cookies d'un fournisseur tiers relatifs à la publicité personnalisée en consultant le portail indépendant <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer" className="text-[#0F2C59] font-bold underline inline-flex items-center gap-1">www.aboutads.info <ExternalLink className="h-3 w-3" /></a> ou pour les visiteurs européens <a href="https://www.youronlinechoices.eu/" target="_blank" rel="noopener noreferrer" className="text-[#0F2C59] font-bold underline inline-flex items-center gap-1">Your Online Choices <ExternalLink className="h-3 w-3" /></a>.
                </li>
              </ul>
            </div>

            <div className="mt-4 p-4 rounded-xl bg-white border border-amber-200 text-xs text-amber-900 space-y-2">
              <p className="font-bold flex items-center gap-1.5">
                <AlertCircle className="h-4 w-4 text-amber-600" />
                Sanctuarisation des espaces sacrés et ludo-éducatifs
              </p>
              <p>
                Conformément aux règles éditoriales les plus strictes de Google et à la décence pastorale, <strong>aucune annonce publicitaire</strong> n'est affichée dans nos fenêtres d'intercession de prière, nos formulaires de dîmes et dons, ni dans les examens et jeux éducatifs destinés aux enfants.
              </p>
            </div>
          </section>

          {/* 4. Gestion des Cookies et Stockage Local */}
          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold font-display text-[#0F2C59] flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#0F2C59]/10 text-xs font-bold text-[#0F2C59]">4</span>
              Technologies de Stockage Local (IndexedDB & LocalStorage)
            </h2>
            <p>
              Pour vous garantir une expérience fluide même avec une connexion Internet instable en Haïti :
            </p>
            <ul className="list-disc pl-6 space-y-2 text-slate-600">
              <li><strong>IndexedDB (`dame_church_audio_db`) :</strong> Utilisé pour stocker temporairement sur votre appareil les prédications audio du Podcast de l'Église que vous écoutez, évitant ainsi de recharger inutilement les données mobiles.</li>
              <li><strong>LocalStorage :</strong> Mémorise vos préférences de navigation, l'avancement dans les quiz bibliques et sauvegarde temporairement vos brouillons de messages pour éviter toute perte en cas de coupure de réseau.</li>
            </ul>
          </section>

          {/* 5. Vos droits (Accès, Rectification, Suppression) */}
          <section className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold font-display text-[#0F2C59] flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#0F2C59]/10 text-xs font-bold text-[#0F2C59]">5</span>
              Vos Droits et Exercice des Recours
            </h2>
            <p>
              Conformément aux principes internationaux de protection des données (RGPD / CCPA et réglementations caribéennes), vous disposez à tout moment :
            </p>
            <ul className="list-disc pl-6 space-y-1.5 text-slate-600">
              <li>Du droit d'accès à l'ensemble de vos données enregistrées par l'Église.</li>
              <li>Du droit de rectification de vos informations (ex: mise à jour d'un numéro de téléphone de membre).</li>
              <li>Du droit à l'effacement définitif de vos demandes de prière ou inscriptions.</li>
              <li>Du droit de désabonnement immédiat de la lettre pastorale via le lien situé en bas de chaque e-mail Mailchimp.</li>
            </ul>
            <p className="pt-2">
              Pour exercer ces droits, adressez simplement un message au secrétariat de l'Église par e-mail à : <strong>{CHURCH_INFO.email}</strong>.
            </p>
          </section>

          {/* Contact Footer */}
          <div className="pt-6 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4">
            <div className="text-xs text-slate-500">
              © 1979 - 2026 Église du Nazaréen de Damé • « Sainteté à l’Éternel »
            </div>
            <button
              onClick={() => onNavigate?.('contact')}
              className="px-4 py-2 rounded-xl bg-[#0F2C59] text-white text-xs font-bold hover:bg-[#184282] transition-colors"
            >
              Contacter le Secrétariat de l'Église
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
