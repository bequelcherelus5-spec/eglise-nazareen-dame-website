import React, { useState } from 'react';
import { apiService, AdminUser } from '../../services/apiService';
import { CHURCH_INFO } from '../../data/churchData';
import { CHURCH_ASSETS } from '../../data/churchMedia';
import { 
  adminSecurityService, 
  DEFAULT_ADMIN_PASSCODE, 
  ADMIN_RECOVERY_EMAIL 
} from '../../services/adminSecurityService';
import { 
  Lock, 
  User, 
  Key, 
  ShieldCheck, 
  ArrowRight, 
  AlertCircle, 
  CheckCircle2,
  Eye,
  EyeOff,
  Mail,
  RotateCcw,
  ArrowLeft,
  Info
} from 'lucide-react';

interface AdminLoginProps {
  onLoginSuccess: (user: AdminUser) => void;
  onBackToWebsite: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess, onBackToWebsite }) => {
  const [username, setUsername] = useState('Bequel');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Password Recovery ("Mot de passe oublié ?") state
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [recoveryLoading, setRecoveryLoading] = useState(false);
  const [recoveryError, setRecoveryError] = useState('');
  const [recoverySuccess, setRecoverySuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!username.trim() || !password.trim()) {
      setErrorMessage('Veuillez renseigner votre identifiant et votre code d’accès.');
      return;
    }

    setLoading(true);

    try {
      // 1. Try server login
      const res = await apiService.adminLogin(username.trim(), password.trim(), rememberMe);
      if (res.success && res.user) {
        onLoginSuccess(res.user);
        return;
      }

      // 2. Client fallback verification with current local passcode
      const isCodeValidLocally = adminSecurityService.verifyCode(password.trim());
      const normalizedUser = username.trim().toLowerCase();
      const isKnownUser = [
        'bequel', 
        'secretaire', 
        'admin', 
        'pasteur', 
        'bequel cherelus',
        'nom de l\'église secrétaire',
        'nom de l\'eglise secretaire',
        'eglise du nazareen de dame secretaire',
        'eglise du nazareen de dame',
        'secretaire dame',
        'eglisedunazareendedame@gmail.com'
      ].includes(normalizedUser);

      if (isCodeValidLocally && isKnownUser) {
        const isBequel = normalizedUser.includes('bequel');
        const fallbackUser: AdminUser = {
          username: username.trim(),
          role: isBequel ? 'Direction Pastorale & Secrétariat' : 'Secrétaire Général',
          displayName: isBequel ? 'Pasteur Bequel CHERELUS' : 'Secrétariat Paroissial — Damé',
        };
        apiService.setSession('dame-session-' + Date.now(), fallbackUser, rememberMe);
        onLoginSuccess(fallbackUser);
        return;
      }

      setErrorMessage(res.error || 'Identifiant ou code d’accès incorrect.');
    } catch (err) {
      // In case of network error, verify locally
      const isCodeValidLocally = adminSecurityService.verifyCode(password.trim());
      if (isCodeValidLocally) {
        const normalizedUser = username.trim().toLowerCase();
        const isBequel = normalizedUser.includes('bequel');
        const fallbackUser: AdminUser = {
          username: username.trim(),
          role: isBequel ? 'Direction Pastorale & Secrétariat' : 'Secrétaire Général',
          displayName: isBequel ? 'Pasteur Bequel CHERELUS' : 'Secrétariat Paroissial — Damé',
        };
        apiService.setSession('dame-session-' + Date.now(), fallbackUser, rememberMe);
        onLoginSuccess(fallbackUser);
      } else {
        setErrorMessage('Une erreur de connexion est survenue. Code d\'accès incorrect ou problème réseau.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRecoverySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRecoveryError('');
    setRecoverySuccess('');

    if (!recoveryEmail.trim()) {
      setRecoveryError('Veuillez saisir votre adresse e-mail d\'administration.');
      return;
    }

    setRecoveryLoading(true);

    try {
      const result = await adminSecurityService.recoverPasscode(recoveryEmail);
      if (result.success) {
        setRecoverySuccess(result.message);
        // Pre-fill password on the login form with the default reset code
        setPassword(DEFAULT_ADMIN_PASSCODE);
        if (!username) {
          setUsername('Secretaire');
        }
        setSuccessMessage(`Code d'accès réinitialisé avec succès : ${DEFAULT_ADMIN_PASSCODE}.`);
      } else {
        setRecoveryError(result.message);
      }
    } catch (err) {
      setRecoveryError('Erreur lors de la réinitialisation. Veuillez réessayer.');
    } finally {
      setRecoveryLoading(false);
    }
  };

  return (
    <div id="admin-login" className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 opacity-15 pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-[#D4AF37] blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-[#0F2C59] blur-3xl" />
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        {/* Church Seal & Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex p-3 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-md shadow-xl">
            <img 
              src={CHURCH_ASSETS.logo.src || "/images/logo.png"} 
              alt="Logo Église du Nazaréen de Damé" 
              className="h-16 w-16 object-contain"
            />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold font-display text-white tracking-wide uppercase">
              Espace Secrétariat
            </h1>
            <p className="text-xs text-[#D4AF37] font-semibold mt-1 tracking-wider uppercase">
              {CHURCH_INFO.name} • Portail Sécurisé
            </p>
          </div>
        </div>

        {/* Card: Either Password Recovery or Login Form */}
        <div className="mt-8 bg-slate-800/95 backdrop-blur-xl border border-slate-700/80 rounded-2xl shadow-2xl p-6 sm:p-8">
          
          {!isForgotModalOpen ? (
            /* MAIN LOGIN FORM */
            <>
              <div className="mb-6 flex items-center justify-between pb-4 border-b border-slate-700">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-[#D4AF37]" />
                  <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                    Connexion au Secrétariat
                  </h2>
                </div>
                <span className="text-[10px] text-[#D4AF37] font-mono bg-slate-900 px-2.5 py-1 rounded-full border border-slate-700">
                  Accès protégé
                </span>
              </div>

              {/* Discreet security notice */}
              <div className="mb-4 p-2.5 rounded-xl bg-slate-900/80 border border-slate-700/70 text-[11px] text-slate-300 flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-[#D4AF37] shrink-0" />
                <span>
                  Portail confidentiel • Réservé au Secrétariat et à la Direction Pastorale.
                </span>
              </div>

              {errorMessage && (
                <div className="mb-4 p-3 rounded-xl bg-rose-950/80 border border-rose-800 text-xs text-rose-200 flex items-center gap-2.5">
                  <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {successMessage && (
                <div className="mb-4 p-3 rounded-xl bg-emerald-950/80 border border-emerald-800 text-xs text-emerald-200 flex items-center gap-2.5">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                  <span>{successMessage}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Identifiant administrateur
                  </label>
                  <div className="relative">
                    <User className="h-4 w-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      autoComplete="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="ex: Bequel"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-semibold text-slate-300">
                      Code d'accès secret
                    </label>
                    <button
                      type="button"
                      id="forgot-password-link"
                      onClick={() => {
                        setIsForgotModalOpen(true);
                        setRecoveryError('');
                        setRecoverySuccess('');
                      }}
                      className="text-[11px] text-[#D4AF37] hover:text-[#f3cd57] hover:underline cursor-pointer transition-colors"
                    >
                      Mot de passe oublié ?
                    </button>
                  </div>

                  <div className="relative">
                    <Key className="h-4 w-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Code d'accès secret"
                      className="w-full pl-9 pr-10 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent outline-none transition-all font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-200 cursor-pointer"
                      title={showPassword ? "Masquer" : "Afficher"}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs py-1">
                  <label className="flex items-center gap-2 text-slate-400 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded border-slate-700 bg-slate-900 text-[#D4AF37] focus:ring-0"
                    />
                    <span>Mémoriser cette session</span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 rounded-xl bg-[#D4AF37] text-slate-950 text-xs font-bold uppercase tracking-wider hover:bg-[#c59f2a] transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 mt-2 cursor-pointer"
                >
                  {loading ? (
                    <>
                      <div className="h-4 w-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                      <span>Vérification des accès...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="h-4 w-4" />
                      <span>Accéder au Tableau de Bord</span>
                    </>
                  )}
                </button>
              </form>
            </>
          ) : (
            /* MOT DE PASSE OUBLIÉ - RECOVERY VIEW */
            <div id="forgot-password-section" className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-700">
                <div className="flex items-center gap-2">
                  <RotateCcw className="h-5 w-5 text-[#D4AF37]" />
                  <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                    Récupération du Code d'Accès
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setIsForgotModalOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700/50 transition-colors"
                  title="Fermer"
                >
                  <ArrowLeft className="h-4 w-4" />
                </button>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                Pour réinitialiser le code d'accès administrateur, veuillez saisir l'adresse e-mail administrative officielle de la paroisse (<span className="text-[#D4AF37] font-semibold">{ADMIN_RECOVERY_EMAIL}</span>).
              </p>

              {recoveryError && (
                <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-800 text-xs text-rose-200 flex items-center gap-2.5">
                  <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
                  <span>{recoveryError}</span>
                </div>
              )}

              {recoverySuccess && (
                <div className="p-4 rounded-xl bg-emerald-950/90 border border-emerald-700 text-xs text-emerald-200 space-y-2">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-400 mt-0.5" />
                    <div>
                      <p className="font-bold text-emerald-100">Réinitialisation réussie !</p>
                      <p className="mt-1 leading-relaxed">
                        Le code d'accès administrateur a été restauré sur le code par défaut initial : <strong className="text-[#D4AF37] font-mono text-sm tracking-wider">123456</strong>.
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setIsForgotModalOpen(false);
                      setRecoverySuccess('');
                    }}
                    className="w-full mt-2 py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
                  >
                    <span>Se connecter avec 123456</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}

              {!recoverySuccess && (
                <form onSubmit={handleRecoverySubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Adresse e-mail d'administration
                    </label>
                    <div className="relative">
                      <Mail className="h-4 w-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="email"
                        required
                        autoComplete="email"
                        value={recoveryEmail}
                        onChange={(e) => setRecoveryEmail(e.target.value)}
                        placeholder="eglisedunazareendedame@gmail.com"
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent outline-none transition-all"
                      />
                    </div>
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      Seule l'adresse {ADMIN_RECOVERY_EMAIL} est habilitée à réinitialiser le code.
                    </span>
                  </div>

                  <button
                    type="submit"
                    disabled={recoveryLoading}
                    className="w-full py-2.5 px-4 rounded-xl bg-[#D4AF37] hover:bg-[#c59f2a] text-slate-950 font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
                  >
                    {recoveryLoading ? (
                      <>
                        <div className="h-4 w-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                        <span>Vérification en cours...</span>
                      </>
                    ) : (
                      <>
                        <RotateCcw className="h-4 w-4" />
                        <span>Réinitialiser le code à 123456</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsForgotModalOpen(false)}
                    className="w-full py-2 text-xs text-slate-400 hover:text-white transition-colors cursor-pointer text-center"
                  >
                    ← Annuler et revenir à la connexion
                  </button>
                </form>
              )}
            </div>
          )}

          <div className="mt-6 pt-4 border-t border-slate-700 text-center">
            <button
              type="button"
              onClick={onBackToWebsite}
              className="text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              ← Retour au site public de l'Église
            </button>
          </div>
        </div>

        <p className="mt-6 text-center text-[11px] text-slate-500">
          Système sécurisé d'administration — Église du Nazaréen de Damé (Môle-Saint-Nicolas, Haïti).
        </p>
      </div>
    </div>
  );
};
