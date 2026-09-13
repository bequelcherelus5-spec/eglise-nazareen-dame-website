import React, { useEffect, useState } from 'react';
import { Mail, Send, CheckCircle2, ShieldCheck, Sparkles, ExternalLink } from 'lucide-react';
import { apiService } from '../services/apiService';

/**
 * Composant officiel d'intégration Mailchimp pour l'Église du Nazaréen de Damé.
 * 
 * Intègre le script officiel Mailchimp Connected / Embedded Form :
 * Users ID : 13b1200976be723f2e377ba7c
 * Form ID : 7ddfdff34a3fa1b177eeff889
 */
export const MailchimpNewsletter: React.FC = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [status, setStatus] = useState<{ loading: boolean; message: string; success: boolean } | null>(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);

  useEffect(() => {
    // Vérifier ou injecter le script Mailchimp officiel
    const existingScript = document.getElementById('mcjs');
    if (!existingScript) {
      const script = document.createElement('script');
      script.id = 'mcjs';
      script.async = true;
      script.src = 'https://chimpstatic.com/mcjs-connected/js/users/13b1200976be723f2e377ba7c/7ddfdff34a3fa1b177eeff889.js';
      script.onload = () => setScriptLoaded(true);
      document.body.appendChild(script);
    } else {
      setScriptLoaded(true);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus({ loading: true, message: '', success: false });

    try {
      // Enregistre l'abonné dans le système d'abonnés de l'église (synchronisé Mailchimp)
      const res = await apiService.subscribeNewsletter(name.trim(), email.trim());
      setStatus({
        loading: false,
        message: res.message || 'Merci pour votre inscription à la newsletter pastorale !',
        success: true
      });
      setEmail('');
      setName('');
    } catch (err: any) {
      setStatus({
        loading: false,
        message: err.message || 'Erreur lors de l’inscription. Veuillez réessayer.',
        success: false
      });
    }
  };

  return (
    <div id="mc_embed_shell" className="w-full">
      <div 
        id="mc_embed_signup" 
        className="bg-white/5 border border-white/10 rounded-2xl p-5 sm:p-6 backdrop-blur-md shadow-xl text-slate-200"
      >
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37]">
              <Mail className="h-4 w-4" />
            </div>
            <span className="text-xs font-bold text-white tracking-wide uppercase">
              Newsletter & Lettre Pastorale (Mailchimp)
            </span>
          </div>

          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[10px] text-emerald-300 font-medium">
            <ShieldCheck className="h-3 w-3 text-emerald-400" />
            Mailchimp Connecté
          </span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed mb-4">
          Inscrivez-vous gratuitement pour recevoir par email les annonces de culte, les nouvelles de l'EPND et les lettres pastorales de l'Église.
        </p>

        {status && (
          <div 
            className={`p-3 rounded-xl text-xs flex items-center gap-2.5 mb-3 transition-all ${
              status.success 
                ? 'bg-emerald-900/60 text-emerald-200 border border-emerald-600' 
                : 'bg-rose-900/60 text-rose-200 border border-rose-600'
            }`}
          >
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
            <span>{status.message}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div>
              <label htmlFor="mce-FNAME" className="block text-[11px] font-medium text-slate-300 mb-1">
                Prénom & Nom
              </label>
              <input
                id="mce-FNAME"
                type="text"
                name="FNAME"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Jean Baptiste"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-xs text-white placeholder-slate-400 focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent outline-none transition-all"
              />
            </div>

            <div>
              <label htmlFor="mce-EMAIL" className="block text-[11px] font-medium text-slate-300 mb-1">
                Adresse Email <span className="text-[#D4AF37]">*</span>
              </label>
              <input
                id="mce-EMAIL"
                type="email"
                name="EMAIL"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre.email@exemple.com"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-xs text-white placeholder-slate-400 focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent outline-none transition-all"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-700/50">
            <span className="text-[11px] text-slate-400 flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-[#D4AF37]" />
              Désabonnement en 1 clic à tout moment.
            </span>

            <button
              type="submit"
              disabled={status?.loading}
              className="px-5 py-2.5 rounded-xl bg-[#D4AF37] hover:bg-[#c59f2a] text-slate-950 text-xs font-bold uppercase tracking-wider transition-all transform active:scale-95 shadow-md flex items-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              <Send className="h-3.5 w-3.5" />
              <span>{status?.loading ? 'Connexion Mailchimp...' : "S'abonner"}</span>
            </button>
          </div>
        </form>

        {/* Mailchimp Badge & Embed container */}
        <div className="mt-3 text-center">
          <span className="text-[10px] text-slate-400">
            Formulaire propulsé par Mailchimp Connected • Église du Nazaréen de Damé
          </span>
        </div>
      </div>
    </div>
  );
};
