import React, { useState, useEffect } from 'react';
import { X, Send, Heart, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { apiService } from '../services/apiService';

interface PrayerRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const STORAGE_DRAFT_KEY = 'dame_church_prayer_draft';
const STORAGE_REQUESTS_KEY = 'dame_church_prayer_submissions';

export const PrayerRequestModal: React.FC<PrayerRequestModalProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    category: 'Santé & Guérison',
    confidentiality: 'pasteur-only',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  // Load draft from localStorage
  useEffect(() => {
    try {
      const savedDraft = localStorage.getItem(STORAGE_DRAFT_KEY);
      if (savedDraft) {
        setFormData(JSON.parse(savedDraft));
      }
    } catch {
      // Ignore storage errors
    }
  }, []);

  // Save draft on changes
  const handleChange = (field: string, value: string) => {
    const updated = { ...formData, [field]: value };
    setFormData(updated);
    try {
      localStorage.setItem(STORAGE_DRAFT_KEY, JSON.stringify(updated));
    } catch {
      // Ignore
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.message.trim()) return;

    try {
      await apiService.submitForm({
        name: formData.name.trim() || 'Fidèle de la Paroisse (Anonyme)',
        phone: formData.phone.trim() || undefined,
        category: 'Prayer Requests',
        message: `[${formData.category}] ${formData.message.trim()}`,
        details: {
          category: formData.category,
          confidentiality: formData.confidentiality
        }
      });
      localStorage.removeItem(STORAGE_DRAFT_KEY);
    } catch {
      // Ignore
    }

    setSubmitted(true);
  };

  const handleReset = () => {
    setSubmitted(false);
    setFormData({
      name: '',
      phone: '',
      category: 'Santé & Guérison',
      confidentiality: 'pasteur-only',
      message: ''
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div id="prayer-modal-backdrop" className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fade-in">
      <div 
        id="prayer-modal-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="prayer-modal-title"
        className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl border border-slate-100"
      >
        {/* Header with Church Theme */}
        <div className="bg-[#0F2C59] p-6 text-white relative">
          <button
            id="close-prayer-modal-btn"
            onClick={onClose}
            className="absolute right-4 top-4 rounded-full p-2 text-white/80 hover:bg-white/10 hover:text-white transition-colors"
            aria-label="Fermer"
          >
            <X className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-3 mb-2">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#D4AF37]/20 text-[#D4AF37]">
              <Heart className="h-5 w-5" />
            </span>
            <div>
              <span className="text-xs uppercase tracking-widest text-[#D4AF37] font-semibold">Intercession Fraternelle</span>
              <h3 id="prayer-modal-title" className="text-xl font-bold font-display">Demander une Prière</h3>
            </div>
          </div>
          <p className="text-xs text-slate-200">
            « Ne vous inquiétez de rien; mais en toute chose faites connaître vos besoins à Dieu par des prières et des supplications. » — Phil. 4:6
          </p>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[80vh] overflow-y-auto">
          {submitted ? (
            <div id="prayer-success-view" className="py-6 text-center space-y-4">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                <CheckCircle2 className="h-10 w-10" />
              </div>
              <h4 className="text-xl font-bold text-[#0F2C59] font-display">Votre requête a été transmise</h4>
              <p className="text-sm text-slate-600 max-w-sm mx-auto leading-relaxed">
                Le Pasteur Bequel CHERELUS et le groupe d'intercession de l'Église du Nazaréen de Damé porteront fidèlement votre sujet dans la prière.
              </p>
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs text-slate-500">
                Sauvegardé localement sur votre appareil. Que la paix de Dieu garde votre cœur.
              </div>
              <button
                id="finish-prayer-btn"
                onClick={handleReset}
                className="w-full rounded-lg bg-[#0F2C59] py-3 text-white font-medium hover:bg-[#1A3D73] transition-colors"
              >
                Fermer
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                  Votre Nom ou Initiales <span className="text-slate-400 font-normal">(Optionnel pour l'anonymat)</span>
                </label>
                <input
                  id="prayer-name-input"
                  type="text"
                  placeholder="Ex : Frère Jean ou Anonyme"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-[#0F2C59] focus:outline-none focus:ring-1 focus:ring-[#0F2C59]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                    Téléphone / WhatsApp
                  </label>
                  <input
                    id="prayer-phone-input"
                    type="tel"
                    placeholder="+509 ..."
                    value={formData.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-[#0F2C59] focus:outline-none focus:ring-1 focus:ring-[#0F2C59]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                    Sujet principal
                  </label>
                  <select
                    id="prayer-category-select"
                    value={formData.category}
                    onChange={(e) => handleChange('category', e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-[#0F2C59] focus:outline-none focus:ring-1 focus:ring-[#0F2C59]"
                  >
                    <option value="Santé & Guérison">Santé & Guérison</option>
                    <option value="Famille & Foyer">Famille & Foyer</option>
                    <option value="Délivrance & Sanctification">Délivrance & Sanctification</option>
                    <option value="Travail & Finances">Travail & Finances</option>
                    <option value="Action de Grâce">Action de Grâce</option>
                    <option value="Autre requête">Autre requête</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
                  Détail de votre requête <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="prayer-message-input"
                  required
                  rows={4}
                  placeholder="Partagez vos fardeaux, vos épreuves ou vos louanges en toute confiance..."
                  value={formData.message}
                  onChange={(e) => handleChange('message', e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-[#0F2C59] focus:outline-none focus:ring-1 focus:ring-[#0F2C59]"
                />
              </div>

              {/* Confidentiality Toggle */}
              <div className="rounded-lg bg-slate-50 border border-slate-200 p-3 space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-[#0F2C59]">
                  <ShieldCheck className="h-4 w-4 text-[#D4AF37]" />
                  Confidentialité pastorale garantie
                </div>
                <div className="space-y-1 text-xs">
                  <label className="flex items-center gap-2 text-slate-700 cursor-pointer">
                    <input
                      type="radio"
                      name="confidentiality"
                      value="pasteur-only"
                      checked={formData.confidentiality === 'pasteur-only'}
                      onChange={(e) => handleChange('confidentiality', e.target.value)}
                      className="text-[#0F2C59] focus:ring-[#0F2C59]"
                    />
                    Strictement réservé au Pasteur Bequel CHERELUS
                  </label>
                  <label className="flex items-center gap-2 text-slate-700 cursor-pointer">
                    <input
                      type="radio"
                      name="confidentiality"
                      value="team"
                      checked={formData.confidentiality === 'team'}
                      onChange={(e) => handleChange('confidentiality', e.target.value)}
                      className="text-[#0F2C59] focus:ring-[#0F2C59]"
                    />
                    Partageable à l'équipe des intercesseurs de Damé
                  </label>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between gap-3">
                <span className="text-xs text-slate-400 italic">Brouillon conservé sur cet appareil</span>
                <button
                  id="submit-prayer-form-btn"
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-lg bg-[#D4AF37] px-5 py-2.5 text-sm font-semibold text-[#0F2C59] hover:bg-[#B38E22] transition-colors shadow-sm"
                >
                  <Send className="h-4 w-4" />
                  Envoyer la requête
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
