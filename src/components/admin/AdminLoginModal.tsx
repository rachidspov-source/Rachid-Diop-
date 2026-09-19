import React, { useState, useEffect } from 'react';
import { 
  checkIfAnyAdminExists, 
  loginAdmin, 
  registerFirstSuperAdmin 
} from '../../services/adminAuth';
import { AdminUser } from '../../types/burger';
import { Lock, UserCheck, ShieldAlert, ArrowLeft, Loader2, Sparkles } from 'lucide-react';

interface AdminLoginProps {
  onSuccess: (admin: AdminUser) => void;
  onClose: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginProps> = ({ onSuccess, onClose }) => {
  const [hasSuperAdmin, setHasSuperAdmin] = useState<boolean | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  // Formulaire
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');

  useEffect(() => {
    const checkState = async () => {
      setLoading(true);
      try {
        const exists = await checkIfAnyAdminExists();
        setHasSuperAdmin(exists);
      } catch (e) {
        console.error('Error checking admin status:', e);
        setHasSuperAdmin(false);
      } finally {
        setLoading(false);
      }
    };
    checkState();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const admin = await loginAdmin(email.trim(), password);
      onSuccess(admin);
    } catch (err: any) {
      setError(err.message || 'Identifiants invalides.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleFirstRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    if (password.length < 6) {
      setError('Le mot de passe doit comporter au moins 6 caractères.');
      setSubmitting(false);
      return;
    }

    try {
      const superAdmin = await registerFirstSuperAdmin(
        email.trim(), 
        password, 
        displayName.trim() || 'Super Admin'
      );
      onSuccess(superAdmin);
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la création du Super Administrateur.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-zinc-950 border border-zinc-800 rounded-3xl w-full max-w-md p-6 sm:p-8 shadow-2xl relative">
        
        {/* Bouton retour */}
        <button
          onClick={onClose}
          className="absolute top-6 left-6 text-zinc-400 hover:text-white transition flex items-center gap-1.5 text-xs font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Retour au site</span>
        </button>

        <div className="text-center pt-8 pb-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-400/10 border border-amber-400/30 text-amber-400 flex items-center justify-center mx-auto mb-4">
            <Lock className="w-7 h-7" />
          </div>

          {loading ? (
            <div className="py-8 flex flex-col items-center justify-center">
              <Loader2 className="w-8 h-8 text-amber-400 animate-spin mb-2" />
              <p className="text-xs text-zinc-400">Vérification de la sécurité système...</p>
            </div>
          ) : !hasSuperAdmin ? (
            /* Mode Premier Administrateur */
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 bg-amber-400/20 text-amber-400 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Initialisation Système</span>
              </div>
              <h3 className="text-2xl font-black text-white uppercase tracking-tight">
                Premier Utilisateur = Super Administrateur
              </h3>
              <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                Aucun administrateur n'a encore été créé. Le compte que vous créez maintenant sera automatiquement promu <strong className="text-amber-400 font-bold">SUPER ADMINISTRATEUR</strong> avec tous les privilèges.
              </p>
            </div>
          ) : (
            /* Mode Connexion Administrateur normal */
            <div className="space-y-2">
              <h3 className="text-2xl font-black text-white uppercase tracking-tight">
                Espace Administration
              </h3>
              <p className="text-xs text-zinc-400">
                Connectez-vous pour gérer le menu, les galeries et les paramètres de Burger & Co.
              </p>
            </div>
          )}
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-950/50 border border-red-800/80 rounded-xl text-red-200 text-xs flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        {!loading && (
          <div>
            {!hasSuperAdmin ? (
              /* FORMULAIRE PREMIER SUPER ADMIN */
              <form onSubmit={handleFirstRegistration} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-300 mb-1">
                    Nom ou Identifiant Administrateur *
                  </label>
                  <input
                    type="text"
                    required
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Ex: Direction Burger & Co"
                    className="w-full bg-zinc-900 border border-zinc-700 focus:border-amber-400 rounded-xl px-4 py-3 text-sm text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-300 mb-1">
                    Email de connexion *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@burgerandco.sn"
                    className="w-full bg-zinc-900 border border-zinc-700 focus:border-amber-400 rounded-xl px-4 py-3 text-sm text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-300 mb-1">
                    Mot de passe sécurisé (min. 6 car.) *
                  </label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-zinc-900 border border-zinc-700 focus:border-amber-400 rounded-xl px-4 py-3 text-sm text-white focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  id="btn-create-first-superadmin"
                  className="w-full py-3.5 bg-amber-400 hover:bg-amber-300 text-black font-black rounded-xl text-sm transition shadow-lg shadow-amber-400/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {submitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <UserCheck className="w-4 h-4" />
                  )}
                  <span>Créer mon compte Super Admin</span>
                </button>
              </form>
            ) : (
              /* FORMULAIRE CONNEXION ADMIN */
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-300 mb-1">
                    Email administrateur
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@burgerandco.sn"
                    className="w-full bg-zinc-900 border border-zinc-700 focus:border-amber-400 rounded-xl px-4 py-3 text-sm text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-300 mb-1">
                    Mot de passe
                  </label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-zinc-900 border border-zinc-700 focus:border-amber-400 rounded-xl px-4 py-3 text-sm text-white focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  id="btn-submit-admin-login"
                  className="w-full py-3.5 bg-amber-400 hover:bg-amber-300 text-black font-black rounded-xl text-sm transition shadow-lg shadow-amber-400/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {submitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Lock className="w-4 h-4" />
                  )}
                  <span>Se connecter à l'espace Admin</span>
                </button>

                <p className="text-center text-[11px] text-zinc-500 pt-2">
                  Inscriptions publiques fermées. Seul le Super Administrateur peut inviter des collaborateurs.
                </p>
              </form>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
