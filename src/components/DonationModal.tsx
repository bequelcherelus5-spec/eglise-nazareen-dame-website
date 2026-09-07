import React, { useState } from 'react';
import { X, Gift, Phone, Building, Copy, Check } from 'lucide-react';
import { CHURCH_INFO } from '../data/churchData';

interface DonationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DonationModal: React.FC<DonationModalProps> = ({ isOpen, onClose }) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [selectedCause, setSelectedCause] = useState('general');

  if (!isOpen) return null;

  const copyToClipboard = (text: string, fieldId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldId);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div id="donation-modal-backdrop" className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fade-in">
      <div 
        id="donation-modal-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="donation-modal-title"
        className="relative w-full max-w-xl overflow-hidden rounded-2xl bg-white shadow-2xl border border-slate-100 max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="bg-[#0F2C59] p-6 text-white relative shrink-0">
          <button
            id="close-donation-modal-btn"
            onClick={onClose}
            className="absolute right-4 top-4 rounded-full p-2 text-white/80 hover:bg-white/10 hover:text-white transition-colors"
            aria-label="Fermer"
          >
            <X className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-3 mb-2">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#D4AF37]/20 text-[#D4AF37]">
              <Gift className="h-5 w-5" />
            </span>
            <div>
              <span className="text-xs uppercase tracking-widest text-[#D4AF37] font-semibold">Générosité & Partenariat</span>
              <h3 id="donation-modal-title" className="text-xl font-bold font-display">Soutenir la Mission à Damé</h3>
            </div>
          </div>
          <p className="text-xs text-slate-200">
            « Chacun donne comme il l'a résolu en son cœur, sans tristesse ni contrainte; car Dieu aime celui qui donne avec joie. » — 2 Cor. 9:7
          </p>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Cause Selection */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
              Affectation de votre don
            </label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {[
                { id: 'general', label: 'Culte & Évangélisation générale' },
                { id: 'epnd', label: 'École Professionnelle (EPND)' },
                { id: 'elevage', label: 'Projet Élevage Caprin (2026)' },
                { id: 'cdej', label: 'Secours Enfants & CDEJ' }
              ].map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setSelectedCause(c.id)}
                  className={`p-3 rounded-lg border text-left transition-all ${
                    selectedCause === c.id
                      ? 'border-[#0F2C59] bg-[#0F2C59]/5 font-semibold text-[#0F2C59]'
                      : 'border-slate-200 hover:border-slate-300 text-slate-700'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* Payment Methods */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
              Canaux officiels de versement
            </h4>

            {/* MonCash Haïti */}
            <div className="rounded-xl border border-rose-200 bg-rose-50/40 p-4 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-600 text-white font-bold text-xs">
                    MC
                  </div>
                  <div>
                    <h5 className="text-sm font-bold text-slate-800">MonCash (Haïti)</h5>
                    <p className="text-xs text-slate-500">Paiement mobile instantané Digicel</p>
                  </div>
                </div>
                <button
                  onClick={() => copyToClipboard(CHURCH_INFO.phone, 'moncash')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md bg-white border border-rose-200 text-rose-700 hover:bg-rose-100 transition-colors"
                >
                  {copiedField === 'moncash' ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  {copiedField === 'moncash' ? 'Copié !' : 'Copier'}
                </button>
              </div>
              <div className="rounded bg-white p-2.5 text-xs font-mono border border-slate-200 flex justify-between items-center">
                <span>Numéro officiel : <strong>{CHURCH_INFO.phone}</strong></span>
                <span className="text-slate-500 text-[11px]">(Pasteur Bequel CHERELUS)</span>
              </div>
            </div>

            {/* Virement Bancaire Haïti */}
            <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0F2C59] text-white">
                    <Building className="h-4 w-4" />
                  </div>
                  <div>
                    <h5 className="text-sm font-bold text-slate-800">Virement Bancaire (Haïti)</h5>
                    <p className="text-xs text-slate-500">Unibank / Sogebank (HTG & USD)</p>
                  </div>
                </div>
              </div>
              <div className="bg-white p-3 rounded border border-slate-200 text-xs space-y-1">
                <div>Bénéficiaire : <strong>ÉGLISE DU NAZARÉEN DE DAMÉ</strong></div>
                <div>Numéro de compte : <span className="font-mono text-amber-800 font-semibold">[À COMPLÉTER]</span></div>
                <div className="text-slate-500 text-[11px]">Veuillez contacter le trésorier Jean Tamara pour l'acheminement précis du bordereau.</div>
              </div>
            </div>

            {/* Diaspora & Soutien International */}
            <div className="rounded-xl border border-amber-200 bg-amber-50/30 p-4 space-y-2">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#D4AF37] text-[#0F2C59]">
                  <Phone className="h-4 w-4" />
                </div>
                <div>
                  <h5 className="text-sm font-bold text-slate-800">Diaspora & Partenaires Internationaux</h5>
                  <p className="text-xs text-slate-500">Zelle, Western Union, MoneyGram, Virements SWIFT</p>
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Pour tout envoi depuis les États-Unis, le Canada ou la France, communiquez directement avec le secrétariat pastoral au <span className="font-semibold">{CHURCH_INFO.phone}</span> ou par email à <span className="font-semibold">{CHURCH_INFO.email}</span> afin d'obtenir les coordonnées de l'intermédiaire agréé du District.
              </p>
            </div>
          </div>

          {/* Transparency note */}
          <div className="text-center bg-slate-50 p-3 rounded-lg border border-slate-200">
            <p className="text-xs text-slate-500 leading-relaxed">
              La gestion financière de l'assemblée est sous la supervision du Trésorier <strong>Jean Tamara</strong> et vérifiée par le Conseil d'Église présidé par <strong>Césaire FAUBLAS</strong>.
            </p>
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-[#0F2C59] text-white text-xs font-semibold hover:bg-[#1A3D73] transition-colors"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};
