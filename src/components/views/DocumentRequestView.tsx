import React, { useState } from 'react';
import { PageTab, DocumentTypeRequested } from '../../types';
import { CHURCH_INFO } from '../../data/churchData';
import { apiService } from '../../services/apiService';
import { 
  FileText, 
  Send, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  AlertCircle, 
  Calendar, 
  User, 
  Mail, 
  Phone, 
  Info,
  Sparkles,
  ArrowRight,
  DownloadCloud,
  HelpCircle
} from 'lucide-react';

interface DocumentRequestViewProps {
  onNavigate?: (tab: PageTab) => void;
}

const DOCUMENT_OPTIONS: { id: DocumentTypeRequested; label: string; desc: string; delay: string }[] = [
  {
    id: 'Certificat de baptême',
    label: 'Certificat de baptême',
    desc: 'Attestation certifiant le baptême par immersion célébré au sein de la paroisse.',
    delay: '2 à 4 jours ouvrés'
  },
  {
    id: 'Certificat de mariage',
    label: 'Certificat de mariage chrétien',
    desc: 'Copie certifiée conforme du registre paroissial pour mariage religieux ou civil.',
    delay: '3 à 5 jours ouvrés'
  },
  {
    id: 'Lettre de recommandation',
    label: 'Lettre de recommandation pastorale',
    desc: 'Recommandation signée par le Pasteur pour études, voyage, transfert d’église ou emploi.',
    delay: '48 heures'
  },
  {
    id: 'Attestation de membre',
    label: 'Attestation de membre régulier',
    desc: 'Preuve officielle d’appartenance et d’engagement actif à l’assemblée de Damé.',
    delay: '24 à 48 heures'
  },
  {
    id: 'Document administratif',
    label: 'Document administratif / Juridictionnel',
    desc: 'Extraits de délibérations du conseil d’église, pièces d’état civil ou courriers d’institution.',
    delay: '3 à 5 jours ouvrés'
  },
  {
    id: 'Autre demande',
    label: 'Autre demande particulière',
    desc: 'Toute requête documentaire spécifique nécessitant l’examen du secrétariat général.',
    delay: 'Variable selon l’objet'
  }
];

export const DocumentRequestView: React.FC<DocumentRequestViewProps> = ({ onNavigate }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    documentType: 'Certificat de baptême' as DocumentTypeRequested,
    approximateYear: '',
    urgency: 'Normale',
    deliveryMethod: 'Retrait au secrétariat paroissial',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submissionReceipt, setSubmissionReceipt] = useState<{ id: string; date: string } | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const selectedDocConfig = DOCUMENT_OPTIONS.find(d => d.id === formData.documentType) || DOCUMENT_OPTIONS[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!formData.fullName.trim()) {
      setErrorMessage('Veuillez renseigner votre nom complet.');
      return;
    }
    if (!formData.phone.trim() && !formData.email.trim()) {
      setErrorMessage('Veuillez fournir au moins un moyen de contact (Téléphone / WhatsApp ou Email).');
      return;
    }
    if (!formData.message.trim()) {
      setErrorMessage('Veuillez préciser l’objet ou les détails de votre demande.');
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await apiService.submitForm({
        name: formData.fullName.trim(),
        email: formData.email.trim() || undefined,
        phone: formData.phone.trim() || undefined,
        category: 'Document Requests',
        message: `[${formData.documentType}] ${formData.message.trim()}`,
        details: {
          documentType: formData.documentType,
          approximateYear: formData.approximateYear,
          urgency: formData.urgency,
          deliveryMethod: formData.deliveryMethod,
          requestDate: new Date().toISOString()
        }
      });

      if (result.success) {
        setSubmissionReceipt({
          id: result.submissionId || `DOC-${Date.now().toString().slice(-6)}`,
          date: new Date().toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })
        });
        setSubmitted(true);
      } else {
        setErrorMessage(result.message || 'Erreur lors de la transmission.');
      }
    } catch (err: any) {
      setErrorMessage('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    setSubmissionReceipt(null);
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      documentType: 'Certificat de baptême',
      approximateYear: '',
      urgency: 'Normale',
      deliveryMethod: 'Retrait au secrétariat paroissial',
      message: ''
    });
  };

  return (
    <div className="space-y-12 pb-16">
      {/* Page Header */}
      <section className="bg-[#0F2C59] text-white py-14 px-4 sm:px-6 lg:px-8 border-b border-[#D4AF37]/30">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 px-4 py-1 text-xs font-bold uppercase tracking-wider text-[#D4AF37] mb-3">
            <FileText className="h-3.5 w-3.5" />
            Secrétariat Paroissial & Greffe
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-display">
            Demande de Documents Officiels
          </h1>
          <p className="mt-4 text-sm sm:text-base text-slate-200 max-w-2xl mx-auto leading-relaxed">
            Formulez en ligne votre demande de certificat, d’attestation de membre ou de lettre pastorale auprès du secrétariat de l'Église du Nazaréen de Damé.
          </p>
        </div>
      </section>

      {/* Main Container */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Form */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
              {submitted && submissionReceipt ? (
                <div className="text-center py-8 space-y-6">
                  <div className="h-16 w-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600 shadow-inner">
                    <CheckCircle2 className="h-9 w-9" />
                  </div>

                  <div className="space-y-2">
                    <span className="text-xs font-bold uppercase tracking-widest text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                      Demande enregistrée avec succès
                    </span>
                    <h2 className="text-2xl font-bold font-display text-slate-900">
                      Votre dossier est entre les mains du secrétariat
                    </h2>
                    <p className="text-sm text-slate-600 max-w-md mx-auto">
                      Un numéro de dossier officiel a été attribué à votre demande. Le secrétariat paroissial vérifie les registres et vous contactera dès que le document sera établi.
                    </p>
                  </div>

                  {/* Receipt Summary Card */}
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 text-left max-w-md mx-auto space-y-3">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-200 text-xs">
                      <span className="text-slate-500 font-medium">Numéro de suivi :</span>
                      <span className="font-mono font-bold text-[#0F2C59] bg-white px-2.5 py-0.5 rounded border border-slate-300">
                        {submissionReceipt.id}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500 font-medium">Document :</span>
                      <span className="font-semibold text-slate-800">{formData.documentType}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500 font-medium">Demandeur :</span>
                      <span className="font-semibold text-slate-800">{formData.fullName}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500 font-medium">Statut initial :</span>
                      <span className="inline-flex items-center gap-1 font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded text-[11px] border border-amber-200">
                        <Clock className="h-3 w-3" />
                        Nouvelle demande
                      </span>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-slate-200 text-xs text-slate-500">
                      <span>Date de soumission :</span>
                      <span>{submissionReceipt.date}</span>
                    </div>
                  </div>

                  <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                    <button
                      onClick={handleReset}
                      className="w-full sm:w-auto px-6 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      Déposer une autre demande
                    </button>
                    {onNavigate && (
                      <button
                        onClick={() => onNavigate('contact')}
                        className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#0F2C59] text-xs font-bold text-white hover:bg-[#1A365D] transition-colors"
                      >
                        Contacter le secrétariat
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="border-b border-slate-100 pb-4">
                    <h2 className="text-xl font-bold font-display text-slate-900">
                      Formulaire officiel de demande
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">
                      Les champs précédés d’une étoile (*) sont indispensables au traitement de votre acte.
                    </p>
                  </div>

                  {errorMessage && (
                    <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  {/* 1. Type of document */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Type de document sollicité *
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {DOCUMENT_OPTIONS.map((opt) => (
                        <button
                          type="button"
                          key={opt.id}
                          onClick={() => setFormData({ ...formData, documentType: opt.id })}
                          className={`p-3 rounded-xl text-left border transition-all text-xs flex flex-col justify-between ${
                            formData.documentType === opt.id
                              ? 'border-[#0F2C59] bg-[#0F2C59]/5 text-[#0F2C59] ring-2 ring-[#0F2C59]/20 font-bold shadow-sm'
                              : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                          }`}
                        >
                          <span className="font-semibold text-slate-900 block mb-1">
                            {opt.label}
                          </span>
                          <span className="text-[11px] text-slate-500 font-normal line-clamp-2">
                            {opt.desc}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Selected Document Info Banner */}
                  <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-3.5 text-xs text-amber-900 flex items-start gap-3">
                    <Info className="h-4 w-4 text-amber-700 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold">Délai indicatif d'instruction : </span>
                      <span>{selectedDocConfig.delay}. Vérification auprès des registres paroissiaux de Damé.</span>
                    </div>
                  </div>

                  {/* 2. Applicant Identification */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Nom complet du demandeur *
                      </label>
                      <div className="relative">
                        <User className="h-4 w-4 text-slate-400 absolute left-3 top-3" />
                        <input
                          type="text"
                          required
                          value={formData.fullName}
                          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                          placeholder="Ex : Joseph Wilfrid Chery"
                          className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#0F2C59] focus:border-transparent outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Téléphone / WhatsApp *
                      </label>
                      <div className="relative">
                        <Phone className="h-4 w-4 text-slate-400 absolute left-3 top-3" />
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="Ex : +509 3800 0000"
                          className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#0F2C59] focus:border-transparent outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Adresse Email (optionnelle)
                      </label>
                      <div className="relative">
                        <Mail className="h-4 w-4 text-slate-400 absolute left-3 top-3" />
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="votre.email@domaine.com"
                          className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#0F2C59] focus:border-transparent outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Année de baptême / admission (approximative)
                      </label>
                      <div className="relative">
                        <Calendar className="h-4 w-4 text-slate-400 absolute left-3 top-3" />
                        <input
                          type="text"
                          value={formData.approximateYear}
                          onChange={(e) => setFormData({ ...formData, approximateYear: e.target.value })}
                          placeholder="Ex : 2016 ou « Sous le Pasteur Cherelus »"
                          className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#0F2C59] focus:border-transparent outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 3. Delivery Method */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Mode de transmission souhaité
                      </label>
                      <select
                        value={formData.deliveryMethod}
                        onChange={(e) => setFormData({ ...formData, deliveryMethod: e.target.value })}
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#0F2C59] outline-none bg-white"
                      >
                        <option value="Retrait au secrétariat paroissial">Retrait sur place (Paroisse Damé)</option>
                        <option value="Transmission numérique (PDF signé par Email)">Transmission PDF signé par Email</option>
                        <option value="Transmission par WhatsApp">Copie numérique via WhatsApp</option>
                        <option value="Envoi par courrier postal / messagerie">Envoi vers autre ville d'Haïti</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Niveau d’urgence
                      </label>
                      <select
                        value={formData.urgency}
                        onChange={(e) => setFormData({ ...formData, urgency: e.target.value })}
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#0F2C59] outline-none bg-white"
                      >
                        <option value="Normale">Normale (Délais habituels)</option>
                        <option value="Prioritaire">Prioritaire (Départ imminent / Tribunal)</option>
                        <option value="Urgent">Très urgent (Moins de 48h)</option>
                      </select>
                    </div>
                  </div>

                  {/* 4. Precisions / Message */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Message, précisions ou motifs de la demande *
                    </label>
                    <textarea
                      rows={4}
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Précisez le nom des parents pour un certificat de baptême, le destinataire pour une lettre de recommandation, ou toute précision utile..."
                      className="w-full p-3 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#0F2C59] focus:border-transparent outline-none resize-y"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 px-6 rounded-xl bg-[#0F2C59] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#1A365D] transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Transmission au secrétariat en cours...</span>
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        <span>Envoyer la demande de document</span>
                      </>
                    )}
                  </button>

                  <p className="text-[11px] text-center text-slate-400">
                    Vos données sont confidentielles et traitées exclusivement par le secrétariat officiel de l'Église du Nazaréen de Damé.
                  </p>
                </form>
              )}
            </div>
          </div>

          {/* Right Column: Information & Guidelines */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Procedure Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-[#0F2C59]">
                <ShieldCheck className="h-5 w-5 text-[#D4AF37]" />
                <h3 className="text-base font-bold font-display text-slate-900">
                  Procédure de délivrance officielle
                </h3>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                Toutes les attestations et tous les certificats sont délivrés conformément aux dispositions du <em>Manuel de l’Église du Nazaréen</em> et aux registres tenus sous l’autorité pastorale.
              </p>

              <ol className="space-y-3.5 text-xs text-slate-700">
                <li className="flex items-start gap-3">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#0F2C59] text-[10px] font-bold text-[#D4AF37]">
                    1
                  </span>
                  <div>
                    <span className="font-bold text-slate-900 block">Soumission du formulaire</span>
                    <span className="text-slate-500">Remplissez l’ensemble des rubriques requises avec vos coordonnées exactes.</span>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#0F2C59] text-[10px] font-bold text-[#D4AF37]">
                    2
                  </span>
                  <div>
                    <span className="font-bold text-slate-900 block">Examen dans les archives</span>
                    <span className="text-slate-500">Le greffe paroissial recherche votre dossier dans les registres physiques de Damé.</span>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#0F2C59] text-[10px] font-bold text-[#D4AF37]">
                    3
                  </span>
                  <div>
                    <span className="font-bold text-slate-900 block">Signature pastorale & Sceau</span>
                    <span className="text-slate-500">Le Pasteur Principal appose la signature officielle et le sceau paroissial authentifié.</span>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#0F2C59] text-[10px] font-bold text-[#D4AF37]">
                    4
                  </span>
                  <div>
                    <span className="font-bold text-slate-900 block">Délivrance ou retrait</span>
                    <span className="text-slate-500">Le document vous est remis en mains propres ou transmis sous forme sécurisée.</span>
                  </div>
                </li>
              </ol>
            </div>

            {/* Secretariat Office Hours Card */}
            <div className="bg-[#0F2C59] text-white rounded-2xl p-6 shadow-sm space-y-4">
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#D4AF37]">
                Permanences du Secrétariat
              </span>
              <h3 className="text-lg font-bold font-display">
                Bureau Paroissial de Damé
              </h3>
              <p className="text-xs text-slate-200 leading-relaxed">
                Pour les demandes urgentes ou les retraits en main propre, le bureau paroissial est ouvert aux fidèles et au public :
              </p>

              <div className="space-y-2 text-xs border-t border-white/10 pt-3">
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-slate-300 font-medium">Mercredi après-midi :</span>
                  <span className="font-bold text-[#D4AF37]">14h00 - 17h30</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-slate-300 font-medium">Vendredi :</span>
                  <span className="font-bold text-[#D4AF37]">14h00 - 17h00</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-300 font-medium">Dimanche (sur rendez-vous) :</span>
                  <span className="font-bold text-[#D4AF37]">Après le culte</span>
                </div>
              </div>

              <div className="pt-2 text-xs text-slate-300 flex items-center gap-2">
                <Phone className="h-4 w-4 text-[#D4AF37]" />
                <span>Contact direct : <strong>{CHURCH_INFO.phone}</strong></span>
              </div>
            </div>

            {/* Quick FAQ */}
            <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 text-xs text-slate-700 space-y-2.5">
              <div className="flex items-center gap-1.5 font-bold text-slate-900">
                <HelpCircle className="h-4 w-4 text-[#0F2C59]" />
                <span>Frais d'émission & légalisation</span>
              </div>
              <p className="text-slate-600 leading-relaxed">
                L’établissement des attestations de membre et des certificats de baptême est généralement gratuit pour les membres de l’Église. Une contribution modique peut être demandée pour les formalités administratives juridiques externes.
              </p>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
