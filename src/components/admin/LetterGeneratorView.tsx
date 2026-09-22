import React, { useState } from 'react';
import { EcclesiasticalDocumentType, GeneratedDocumentData } from '../../types';
import { exportDocumentToWord, exportDocumentToPdf } from '../../utils/documentExporter';
import { CHURCH_ASSETS } from '../../data/churchMedia';
import { 
  FileText, 
  Sparkles, 
  Download, 
  Upload, 
  Printer, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  User, 
  Calendar, 
  MapPin, 
  Award, 
  ShieldCheck, 
  Copy, 
  Edit3,
  Feather
} from 'lucide-react';

const DOCUMENT_TYPES: { type: EcclesiasticalDocumentType; label: string; icon: string; desc: string }[] = [
  {
    type: 'recommandation',
    label: 'Lettre de Recommandation',
    icon: '📜',
    desc: 'Pour un membre transférant vers une autre église ou pour une mission'
  },
  {
    type: 'bapteme',
    label: 'Certificat de Baptême',
    icon: '🕊️',
    desc: 'Attestation solennelle d\'immersion dans l\'eau au nom de Jésus'
  },
  {
    type: 'membre',
    label: 'Attestation de Membre',
    icon: '⛪',
    desc: 'Preuve officielle d\'appartenance régulière et active à l\'assemblée'
  },
  {
    type: 'invitation',
    label: 'Lettre d’Invitation Officielle',
    icon: '✉️',
    desc: 'Pour convier un prédicateur invité, chorale ou conférencier'
  },
  {
    type: 'benevolat',
    label: 'Attestation de Dévouement',
    icon: '🤝',
    desc: 'Reconnaissance de service chrétien et bénévolat communautaire'
  }
];

export const LetterGeneratorView: React.FC = () => {
  const [documentType, setDocumentType] = useState<EcclesiasticalDocumentType>('recommandation');
  const [recipientName, setRecipientName] = useState<string>('');
  const [recipientRole, setRecipientRole] = useState<string>('Membre régulier et engagé');
  const [parishionerDetails, setParishionerDetails] = useState<string>('Membre actif de la JNI, exemplaire dans la foi');
  const [issueDate, setIssueDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [place, setPlace] = useState<string>('Damé, Môle-Saint-Nicolas (Haïti)');
  const [additionalNotes, setAdditionalNotes] = useState<string>('');
  const [baptismDate, setBaptismDate] = useState<string>('');
  const [destinationChurch, setDestinationChurch] = useState<string>('');
  const [eventDate, setEventDate] = useState<string>('');

  // Signature et Sceau
  const [signatureImage, setSignatureImage] = useState<string | null>(null);
  const [sealImage, setSealImage] = useState<string | null>(CHURCH_ASSETS.logo.src);

  // Document généré
  const [generatedDoc, setGeneratedDoc] = useState<GeneratedDocumentData | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generationSource, setGenerationSource] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Gestion de l'upload de signature
  const handleSignatureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMsg('Veuillez choisir un fichier image (PNG, JPG ou JPEG).');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setSignatureImage(reader.result as string);
      setSuccessMsg('Signature importée avec succès !');
      setTimeout(() => setSuccessMsg(null), 3000);
    };
    reader.readAsDataURL(file);
  };

  // Gestion de l'upload de sceau
  const handleSealUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setSealImage(reader.result as string);
      setSuccessMsg('Sceau officiel mis à jour !');
      setTimeout(() => setSuccessMsg(null), 3000);
    };
    reader.readAsDataURL(file);
  };

  // Appel de génération avec Gemini
  const handleGenerate = async () => {
    if (!recipientName.trim()) {
      setErrorMsg('Veuillez saisir le nom complet du destinataire ou bénéficiaire.');
      return;
    }

    setErrorMsg(null);
    setIsGenerating(true);

    try {
      const response = await fetch('/api/admin/generate-document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documentType,
          recipientName: recipientName.trim(),
          recipientRole: recipientRole.trim(),
          parishionerDetails: parishionerDetails.trim(),
          issueDate: new Date(issueDate).toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
          }),
          place,
          additionalNotes: additionalNotes.trim(),
          baptismDate,
          destinationChurch,
          eventDate
        })
      });

      const data = await response.json();
      if (data.success && data.document) {
        setGeneratedDoc(data.document);
        setGenerationSource(data.source === 'gemini-3.8-flash' ? 'Intelligence Artificielle Gemini' : 'Formulation Pastorale Officielle');
        setSuccessMsg('Document rédigé et prêt à l\'exportation !');
        setTimeout(() => setSuccessMsg(null), 4000);
      } else {
        throw new Error(data.error || 'Erreur inconnue');
      }
    } catch (err: any) {
      console.error('Erreur génération document:', err);
      setErrorMsg(err.message || 'Impossible de générer le document. Veuillez réessayer.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Export Word (.docx)
  const handleExportWord = async () => {
    if (!generatedDoc) return;
    try {
      await exportDocumentToWord(generatedDoc, signatureImage || undefined, sealImage || undefined);
    } catch (err) {
      console.error('Erreur export Word:', err);
      setErrorMsg('Erreur lors de la génération du fichier Word.');
    }
  };

  // Export PDF
  const handleExportPdf = async () => {
    if (!generatedDoc) return;
    try {
      await exportDocumentToPdf(generatedDoc, signatureImage || undefined, sealImage || undefined);
    } catch (err) {
      console.error('Erreur export PDF:', err);
      setErrorMsg('Erreur lors de la génération du fichier PDF.');
    }
  };

  // Impression
  const handlePrint = () => {
    window.print();
  };

  return (
    <div id="letter-generator-module" className="space-y-6">
      {/* En-tête du module */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-6 rounded-2xl shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-1.5 bg-amber-500/20 text-amber-300 rounded-lg text-xs font-semibold uppercase tracking-wider flex items-center gap-1 border border-amber-500/30">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Propulsé par Gemini AI</span>
              </span>
              <span className="text-xs text-blue-200">Secrétariat Paroissial</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight">
              Générateur Automatique de Lettres & Documents Officiels
            </h2>
            <p className="text-sm text-blue-100 max-w-2xl mt-1">
              Rédigez en quelques secondes des lettres de recommandation, certificats de baptême et attestations officielles de l'Église du Nazaréen de Damé, avec signature et export PDF ou Word (.docx).
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs bg-white/10 px-3 py-1.5 rounded-xl border border-white/20 text-white/90">
              « Sainteté à l’Éternel »
            </span>
          </div>
        </div>
      </div>

      {/* Messages de statut */}
      {errorMsg && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl flex items-center gap-3 text-sm">
          <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}
      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl flex items-center gap-3 text-sm">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Disposition principale 2 colonnes */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Colonne de gauche : Formulaire de configuration */}
        <div className="lg:col-span-5 space-y-5">
          {/* Sélection du type de document */}
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">
              1. Type de Document Ecclésiastique
            </label>
            <div className="grid grid-cols-1 gap-2">
              {DOCUMENT_TYPES.map((dt) => (
                <button
                  key={dt.type}
                  type="button"
                  onClick={() => setDocumentType(dt.type)}
                  className={`p-3 rounded-xl border text-left flex items-start gap-3 transition-all ${
                    documentType === dt.type
                      ? 'border-indigo-600 bg-indigo-50/50 ring-2 ring-indigo-500/20'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <span className="text-xl">{dt.icon}</span>
                  <div>
                    <p className={`font-semibold text-sm ${documentType === dt.type ? 'text-indigo-950' : 'text-gray-900'}`}>
                      {dt.label}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">{dt.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Formulaire des informations bénéficiaire */}
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-4">
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">
              2. Informations du Bénéficiaire
            </label>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Nom et Prénom du Bénéficiaire *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Ex: Frère Jean Baptiste PIERRE"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Rôle ou Qualité au sein de l'Église
              </label>
              <input
                type="text"
                placeholder="Ex: Membre régulier, Diacre, Moniteur d'École du Dimanche..."
                value={recipientRole}
                onChange={(e) => setRecipientRole(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
              />
            </div>

            {/* Champs contextuels selon le type de document */}
            {documentType === 'bapteme' && (
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Date du Baptême (si connue)
                </label>
                <input
                  type="text"
                  placeholder="Ex: Dimanche 12 Août 2024"
                  value={baptismDate}
                  onChange={(e) => setBaptismDate(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                />
              </div>
            )}

            {documentType === 'recommandation' && (
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Église Destinataire ou Ville de Destination
                </label>
                <input
                  type="text"
                  placeholder="Ex: Église du Nazaréen de Port-de-Paix / Miami"
                  value={destinationChurch}
                  onChange={(e) => setDestinationChurch(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                />
              </div>
            )}

            {documentType === 'invitation' && (
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Date de l'Événement ou Culte Prévu
                </label>
                <input
                  type="text"
                  placeholder="Ex: Dimanche 25 Octobre 2026 à 08h00"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                />
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Date d'Émission
                </label>
                <input
                  type="date"
                  value={issueDate}
                  onChange={(e) => setIssueDate(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Lieu
                </label>
                <input
                  type="text"
                  value={place}
                  onChange={(e) => setPlace(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Précisions ou Directives Pastorales Supplémentaires
              </label>
              <textarea
                rows={2}
                placeholder="Ex: Mentionner son dévouement lors de la construction du sanctuaire, sa fidélité aux dîmes..."
                value={additionalNotes}
                onChange={(e) => setAdditionalNotes(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
              />
            </div>

            {/* Bouton de génération avec IA Gemini */}
            <button
              type="button"
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full py-3 px-4 bg-gradient-to-r from-blue-700 via-indigo-600 to-indigo-800 hover:from-blue-800 hover:to-indigo-900 text-white font-semibold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span>Régénération théologique en cours...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 text-amber-300" />
                  <span>Générer avec l'IA Gemini</span>
                </>
              )}
            </button>
          </div>

          {/* Upload Signature et Sceau */}
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-4">
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 flex items-center gap-2">
              <Feather className="w-4 h-4 text-indigo-600" />
              <span>3. Sceau Officiel & Signature Digitale</span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Sceau */}
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 flex flex-col items-center text-center">
                <p className="text-xs font-semibold text-gray-700 mb-2">Sceau Paroissial</p>
                <div className="w-16 h-16 rounded-full border border-gray-300 bg-white flex items-center justify-center overflow-hidden mb-2 shadow-sm">
                  {sealImage ? (
                    <img src={sealImage} alt="Sceau" className="w-full h-full object-cover" />
                  ) : (
                    <ShieldCheck className="w-8 h-8 text-amber-600" />
                  )}
                </div>
                <label className="cursor-pointer text-xs font-medium text-indigo-600 hover:text-indigo-700 underline">
                  Changer le sceau
                  <input type="file" accept="image/*" onChange={handleSealUpload} className="hidden" />
                </label>
              </div>

              {/* Signature */}
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 flex flex-col items-center text-center">
                <p className="text-xs font-semibold text-gray-700 mb-2">Signature Pastorale</p>
                <div className="w-24 h-16 rounded-lg border border-gray-300 bg-white flex items-center justify-center overflow-hidden mb-2 p-1">
                  {signatureImage ? (
                    <img src={signatureImage} alt="Signature" className="max-h-full object-contain" />
                  ) : (
                    <span className="text-[11px] text-gray-400 italic">Signature par défaut</span>
                  )}
                </div>
                <label className="cursor-pointer text-xs font-medium text-indigo-600 hover:text-indigo-700 underline">
                  {signatureImage ? 'Modifier signature' : 'Téléverser signature'}
                  <input type="file" accept="image/*" onChange={handleSignatureUpload} className="hidden" />
                </label>
              </div>
            </div>
            <p className="text-[11px] text-gray-400 text-center">
              Le sceau et la signature s'intégreront automatiquement au bas du document exporté.
            </p>
          </div>
        </div>

        {/* Colonne de droite : Aperçu officiel du document papier et actions d'export */}
        <div className="lg:col-span-7 space-y-4">
          {/* Barre d'action supérieure */}
          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="p-2 bg-indigo-50 text-indigo-700 rounded-xl">
                <FileText className="w-4 h-4" />
              </span>
              <div>
                <h3 className="font-bold text-gray-900 text-sm">
                  Aperçu du Document Officiel
                </h3>
                {generationSource && (
                  <span className="text-[11px] text-emerald-600 font-medium">
                    {generationSource}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleExportWord}
                disabled={!generatedDoc}
                className="px-3.5 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors disabled:opacity-40"
                title="Télécharger en Word (.docx)"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Word (.docx)</span>
              </button>

              <button
                type="button"
                onClick={handleExportPdf}
                disabled={!generatedDoc}
                className="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors disabled:opacity-40"
                title="Télécharger en PDF"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export PDF</span>
              </button>

              <button
                type="button"
                onClick={handlePrint}
                disabled={!generatedDoc}
                className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs transition-colors disabled:opacity-40"
                title="Imprimer"
              >
                <Printer className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Papier à en-tête institutionnel interactif */}
          <div 
            id="ecclesiastical-document-paper"
            className="bg-white rounded-2xl border-2 border-gray-200 shadow-lg p-8 sm:p-12 relative overflow-hidden font-serif"
            style={{ minHeight: '650px' }}
          >
            {/* Filigrane d'arrière-plan */}
            <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none select-none">
              <span className="text-8xl font-black uppercase text-blue-900 tracking-widest rotate-[-25deg]">
                NAZARÉEN DAMÉ
              </span>
            </div>

            {/* Cadre institutionnel intérieur */}
            <div className="border border-blue-900/20 p-6 sm:p-8 rounded-lg relative bg-white/90">
              {/* En-tête officiel */}
              <div className="text-center border-b-2 border-blue-900 pb-4 mb-6">
                <div className="flex items-center justify-center gap-3 mb-2">
                  {sealImage && (
                    <img 
                      src={sealImage} 
                      alt="Logo Église" 
                      className="w-14 h-14 object-contain rounded-full shadow-sm" 
                    />
                  )}
                  <div>
                    <h1 className="text-xl sm:text-2xl font-black text-blue-950 uppercase tracking-tight font-serif">
                      ÉGLISE DU NAZARÉEN DE DAMÉ
                    </h1>
                    <p className="text-xs text-gray-600 uppercase font-sans tracking-wide">
                      District Bas Nord-Ouest d’Haïti — Fondée en 1979
                    </p>
                  </div>
                </div>

                <p className="text-sm font-bold text-amber-700 italic tracking-wider">
                  « Sainteté à l’Éternel »
                </p>
                <p className="text-[11px] text-gray-500 font-sans mt-1">
                  Rue Cimetière, 3ème Section Damé, Commune de Môle-Saint-Nicolas, Haïti
                </p>
                <p className="text-[11px] text-gray-500 font-sans">
                  Tél : +509 48596089 | Email : eglisedunazareendedame@gmail.com
                </p>
              </div>

              {/* Référence et Date */}
              <div className="flex items-center justify-between text-xs text-gray-600 mb-6 font-sans">
                <span className="font-semibold text-gray-900">
                  Réf : {generatedDoc?.referenceNumber || 'END-2026/09-042'}
                </span>
                <span className="italic">
                  {generatedDoc ? `${generatedDoc.place}, le ${generatedDoc.issueDate}` : 'Damé, le 21 Septembre 2026'}
                </span>
              </div>

              {/* Titre du document */}
              <div className="text-center my-6">
                <h2 className="text-lg sm:text-xl font-black text-blue-900 uppercase underline decoration-2 underline-offset-4 tracking-wide font-serif">
                  {generatedDoc?.title || DOCUMENT_TYPES.find(d => d.type === documentType)?.label.toUpperCase()}
                </h2>
              </div>

              {/* Verset Biblique */}
              {(generatedDoc?.biblicalVerse || !generatedDoc) && (
                <div className="my-5 p-3 bg-amber-50/60 border-l-4 border-amber-500 rounded-r-lg text-center">
                  <p className="text-xs italic text-gray-700 leading-relaxed font-serif">
                    {generatedDoc?.biblicalVerse || '« Allez, faites de toutes les nations des disciples, les baptisant au nom du Père, du Fils et du Saint-Esprit... » — Matthieu 28:19'}
                  </p>
                </div>
              )}

              {/* Corps de texte du document */}
              <div className="my-6 space-y-4 text-justify leading-relaxed text-gray-900 text-sm sm:text-base">
                {generatedDoc ? (
                  <div className="space-y-4">
                    {generatedDoc.bodyContent.split('\n').filter(p => p.trim()).map((p, idx) => (
                      <p key={idx} className="indent-6">
                        {p}
                      </p>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center text-gray-400 bg-gray-50/50 rounded-xl border border-dashed border-gray-200">
                    <FileText className="w-10 h-10 mx-auto text-gray-300 mb-2" />
                    <p className="font-medium text-gray-600 text-sm">
                      Aucun document généré pour le moment
                    </p>
                    <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">
                      Remplissez les informations du destinataire à gauche et cliquez sur « Générer avec l'IA Gemini ».
                    </p>
                  </div>
                )}
              </div>

              {/* Signatures officielles */}
              <div className="mt-12 pt-6 border-t border-gray-200 grid grid-cols-2 gap-6 text-xs font-sans">
                {/* Secrétariat */}
                <div>
                  <p className="font-bold text-gray-800">Pour le Secrétariat Paroissial :</p>
                  <div className="h-14 flex items-end">
                    <div className="w-32 border-b border-gray-400 border-dashed mb-2"></div>
                  </div>
                  <p className="font-medium text-gray-700">Secrétaire Général</p>
                  <p className="text-[10px] text-gray-500 italic">Archiviste & Registres</p>
                </div>

                {/* Pasteur Principal */}
                <div className="text-right flex flex-col items-end">
                  <p className="font-bold text-gray-800">Pour le Corps Pastoral :</p>
                  <div className="h-14 flex items-center justify-end">
                    {signatureImage ? (
                      <img src={signatureImage} alt="Signature Pasteur" className="h-12 object-contain" />
                    ) : (
                      <span className="text-amber-800 font-serif italic text-sm pr-2">Pasteur B. Cherelus</span>
                    )}
                  </div>
                  <p className="font-bold text-gray-900">
                    {generatedDoc?.pastorName || 'Pasteur Bequel CHERELUS'}
                  </p>
                  <p className="text-[10px] text-gray-500 italic">Pasteur Principal & Bâtisseur</p>
                </div>
              </div>
            </div>
          </div>

          {/* Édition directe du texte généré */}
          {generatedDoc && (
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-700 flex items-center gap-1.5">
                  <Edit3 className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Ajuster ou Personnaliser le Texte Généré</span>
                </label>
                <span className="text-xs text-gray-400">Édition en direct avant impression</span>
              </div>
              <textarea
                rows={6}
                value={generatedDoc.bodyContent}
                onChange={(e) => setGeneratedDoc({ ...generatedDoc, bodyContent: e.target.value })}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-sans leading-relaxed"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
