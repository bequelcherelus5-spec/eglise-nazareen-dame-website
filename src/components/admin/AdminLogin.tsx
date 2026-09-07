import React, { useState } from 'react';
import { apiService, AdminUser } from '../../services/apiService';
import { CHURCH_INFO } from '../../data/churchData';
import { 
  Lock, 
  User, 
  Key, 
  ShieldCheck, 
  ArrowRight, 
  AlertCircle, 
  CheckCircle2,
  Eye,
  EyeOff
} from 'lucide-react';

interface AdminLoginProps {
  onLoginSuccess: (user: AdminUser) => void;
  onBackToWebsite: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess, onBackToWebsite }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!username.trim() || !password.trim()) {
      setErrorMessage('Veuillez renseigner votre identifiant et votre mot de passe.');
      return;
    }

    setLoading(true);

    try {
      const res = await apiService.adminLogin(username.trim(), password.trim(), rememberMe);
      if (res.success && res.user) {
        onLoginSuccess(res.user);
      } else {
        setErrorMessage(res.error || 'Identifiant ou mot de passe incorrect.');
      }
    } catch (err) {
      setErrorMessage('Une erreur de connexion est survenue. Veuillez vérifier votre réseau.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
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
              src="/images/logo.svg" 
              alt="Logo Église du Nazaréen de Damé" 
              className="h-16 w-16 object-contain"
            />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold font-display text-white tracking-wide uppercase">
              {CHURCH_INFO.name}
            </h1>
            <p className="text-xs text-[#D4AF37] font-semibold mt-1 tracking-widest uppercase">
              Espace Sécurisé • Secrétariat Paroissial
            </p>
          </div>
        </div>

        {/* Login Form Card */}
        <div className="mt-8 bg-slate-800/90 backdrop-blur-xl border border-slate-700/80 rounded-2xl shadow-2xl p-6 sm:p-8">
          <div className="mb-6 flex items-center justify-between pb-4 border-b border-slate-700">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-[#D4AF37]" />
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                Authentification Administrateur
              </h2>
            </div>
            <span className="text-[10px] text-slate-400 font-mono bg-slate-900 px-2 py-0.5 rounded border border-slate-700">
              Accès réservé
            </span>
          </div>

          {errorMessage && (
            <div className="mb-5 p-3 rounded-xl bg-rose-950/80 border border-rose-800 text-xs text-rose-200 flex items-center gap-2.5">
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
              <span>{errorMessage}</span>
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
                  placeholder="Identifiant"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Mot de passe de session
              </label>
              <div className="relative">
                <Key className="h-4 w-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-10 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-200"
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

          <div className="mt-6 pt-4 border-t border-slate-700 text-center">
            <button
              type="button"
              onClick={onBackToWebsite}
              className="text-xs text-slate-400 hover:text-white transition-colors"
            >
              ← Retour au site public de l'Église
            </button>
          </div>
        </div>

        <p className="mt-6 text-center text-[11px] text-slate-500">
          Système sécurisé d'administration — Église du Nazaréen de Damé (District Bas Nord-Ouest).
        </p>
      </div>
    </div>
  );
};
