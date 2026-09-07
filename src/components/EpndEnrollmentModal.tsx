import React, { useState, useEffect } from 'react';
import { X, GraduationCap, Send, CheckCircle2 } from 'lucide-react';
import { EPND_COURSES } from '../data/churchData';
import { apiService } from '../services/apiService';

interface EpndEnrollmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedCourseId?: string;
}

const STORAGE_EPND_DRAFT = 'dame_epnd_enroll_draft';
const STORAGE_EPND_SUBMISSIONS = 'dame_epnd_submissions';

export const EpndEnrollmentModal: React.FC<EpndEnrollmentModalProps> = ({
  isOpen,
  onClose,
  preselectedCourseId
}) => {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    age: '',
    gender: 'M',
    courseId: preselectedCourseId || 'couture',
    educationLevel: 'Secondaire',
    comments: ''
  });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (preselectedCourseId) {
      setFormData((prev) => ({ ...prev, courseId: preselectedCourseId }));
    }
  }, [preselectedCourseId]);

  useEffect(() => {
    try {
      const draft = localStorage.getItem(STORAGE_EPND_DRAFT);
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
      localStorage.setItem(STORAGE_EPND_DRAFT, JSON.stringify(updated));
    } catch {
      // Ignore
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName.trim() || !formData.phone.trim()) return;

    const courseObj = EPND_COURSES.find(c => c.id === formData.courseId);
    const courseTitle = courseObj ? courseObj.title : formData.courseId;

    try {
      await apiService.submitForm({
        name: formData.fullName.trim(),
        phone: formData.phone.trim(),
        category: 'Event Registration',
        message: `[Inscription EPND — ${courseTitle}] Niveau: ${formData.educationLevel}, Âge: ${formData.age || 'N/A'}, Sexe: ${formData.gender}. Précisions: ${formData.comments || 'Aucune'}`,
        details: {
          program: courseTitle,
          educationLevel: formData.educationLevel,
          age: formData.age,
          gender: formData.gender,
          comments: formData.comments
        }
      });
      localStorage.removeItem(STORAGE_EPND_DRAFT);
    } catch {
      // Ignore
    }

    setSubmitted(true);
  };

  if (!isOpen) return null;

  return (
    <div id="epnd-modal-backdrop" className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fade-in">
      <div 
        id="epnd-modal-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="epnd-modal-title"
        className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl border border-slate-100 max-h-[90vh] flex flex-col"
      >
        <div className="bg-[#0F2C59] p-6 text-white relative shrink-0">
          <button
            id="close-epnd-modal-btn"
            onClick={onClose}
            className="absolute right-4 top-4 rounded-full p-2 text-white/80 hover:bg-white/10 hover:text-white transition-colors"
            aria-label="Fermer"
          >
            <X className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-3 mb-1">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#D4AF37]/20 text-[#D4AF37]">
              <GraduationCap className="h-5 w-5" />
            </span>
            <div>
              <span className="text-xs uppercase tracking-widest text-[#D4AF37] font-semibold">École Professionnelle (EPND)</span>
              <h3 id="epnd-modal-title" className="text-xl font-bold font-display">Inscription aux Formations</h3>
            </div>
          </div>
          <p className="text-xs text-slate-200">
            Damé, Commune Môle-Saint-Nicolas — Bâtir des compétences d'avenir
          </p>
        </div>

        <div className="p-6 overflow-y-auto">
          {submitted ? (
            <div className="py-8 text-center space-y-4">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                <CheckCircle2 className="h-10 w-10" />
              </div>
              <h4 className="text-xl font-bold text-[#0F2C59] font-display">Pré-inscription enregistrée !</h4>
              <p className="text-sm text-slate-600 max-w-sm mx-auto leading-relaxed">
                Votre dossier a été enregistré au secrétariat de l'EPND. Le responsable de filière vous contactera au numéro fourni ({formData.phone}) pour l'entretien d'orientation.
              </p>
              <button
                onClick={() => {
                  setSubmitted(false);
                  onClose();
                }}
                className="w-full rounded-lg bg-[#0F2C59] py-3 text-white text-sm font-semibold hover:bg-[#1A3D73] transition-colors"
              >
                Fermer
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold uppercase tracking-wider text-slate-700 mb-1">
                  Nom & Prénom <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex : Jean-Baptiste Pierre"
                  value={formData.fullName}
                  onChange={(e) => handleChange('fullName', e.target.value)}
                  className="w-full rounded-lg border border-slate-300 p-2.5 text-sm focus:border-[#0F2C59] focus:outline-none focus:ring-1 focus:ring-[#0F2C59]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
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
                    className="w-full rounded-lg border border-slate-300 p-2.5 text-sm focus:border-[#0F2C59] focus:outline-none focus:ring-1 focus:ring-[#0F2C59]"
                  />
                </div>
                <div>
                  <label className="block font-semibold uppercase tracking-wider text-slate-700 mb-1">
                    Âge du candidat
                  </label>
                  <input
                    type="number"
                    min="14"
                    max="80"
                    placeholder="Ex: 22"
                    value={formData.age}
                    onChange={(e) => handleChange('age', e.target.value)}
                    className="w-full rounded-lg border border-slate-300 p-2.5 text-sm focus:border-[#0F2C59] focus:outline-none focus:ring-1 focus:ring-[#0F2C59]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold uppercase tracking-wider text-slate-700 mb-1">
                  Filière demandée <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.courseId}
                  onChange={(e) => handleChange('courseId', e.target.value)}
                  className="w-full rounded-lg border border-slate-300 p-2.5 text-sm focus:border-[#0F2C59] focus:outline-none focus:ring-1 focus:ring-[#0F2C59]"
                >
                  {EPND_COURSES.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title} ({c.duration})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold uppercase tracking-wider text-slate-700 mb-1">
                  Niveau d'études antérieur
                </label>
                <select
                  value={formData.educationLevel}
                  onChange={(e) => handleChange('educationLevel', e.target.value)}
                  className="w-full rounded-lg border border-slate-300 p-2.5 text-sm focus:border-[#0F2C59] focus:outline-none focus:ring-1 focus:ring-[#0F2C59]"
                >
                  <option value="Fondamental (Primaire)">Fondamental (Primaire)</option>
                  <option value="Secondaire 1 - 4">Secondaire (Secondaire 1 à NS4)</option>
                  <option value="Baccalauréat">Bacc / Fin d'études secondaires</option>
                  <option value="Universitaire ou Autre">Universitaire ou Autre</option>
                  <option value="Autodidacte">Autodidacte / Alphabétisation</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold uppercase tracking-wider text-slate-700 mb-1">
                  Remarques ou demande d'aide financière (Bourse solidaire)
                </label>
                <textarea
                  rows={3}
                  placeholder="Mentionnez toute motivation ou situation particulière..."
                  value={formData.comments}
                  onChange={(e) => handleChange('comments', e.target.value)}
                  className="w-full rounded-lg border border-slate-300 p-2.5 text-sm focus:border-[#0F2C59] focus:outline-none focus:ring-1 focus:ring-[#0F2C59]"
                />
              </div>

              <div className="pt-2 flex items-center justify-between">
                <span className="text-slate-400 italic">Brouillon sauvé localement</span>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-lg bg-[#0F2C59] px-6 py-2.5 font-semibold text-white hover:bg-[#1A3D73] transition-colors shadow-sm"
                >
                  <Send className="h-4 w-4" />
                  Valider la pré-inscription
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
