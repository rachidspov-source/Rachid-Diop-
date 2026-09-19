import React, { useState, useEffect } from 'react';
import { AdminUser, Role } from '../../types/burger';
import { 
  fetchAllAdmins, 
  inviteOrAddAdmin, 
  updateAdminUser, 
  deleteAdminUser 
} from '../../services/adminAuth';
import { 
  ShieldCheck, 
  UserPlus, 
  Trash2, 
  UserX, 
  UserCheck, 
  ShieldAlert, 
  Crown, 
  Loader2,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

interface AdminUsersManagerProps {
  currentAdmin: AdminUser;
}

export const AdminUsersManager: React.FC<AdminUsersManagerProps> = ({ currentAdmin }) => {
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Formulaire d'invitation
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState<Role>('admin');
  const [submitting, setSubmitting] = useState(false);

  const loadAdmins = async () => {
    setLoading(true);
    setError('');
    try {
      const list = await fetchAllAdmins();
      setAdmins(list);
    } catch (err: any) {
      setError(err.message || 'Impossible de récupérer la liste des administrateurs.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdmins();
  }, []);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail.trim() || !newName.trim()) return;
    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      await inviteOrAddAdmin(currentAdmin, {
        email: newEmail.trim(),
        displayName: newName.trim(),
        role: newRole
      });
      setSuccess(`Administrateur ${newEmail} ajouté avec succès avec le rôle ${newRole.toUpperCase()}.`);
      setShowInviteModal(false);
      setNewEmail('');
      setNewName('');
      setNewRole('admin');
      await loadAdmins();
    } catch (err: any) {
      setError(err.message || "Erreur lors de l'invitation.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (admin: AdminUser) => {
    setError('');
    setSuccess('');
    try {
      await updateAdminUser(currentAdmin, admin.id, { active: !admin.active });
      setSuccess(`Statut de ${admin.displayName} mis à jour.`);
      await loadAdmins();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleChangeRole = async (admin: AdminUser, role: Role) => {
    setError('');
    setSuccess('');
    try {
      await updateAdminUser(currentAdmin, admin.id, { role });
      setSuccess(`Rôle de ${admin.displayName} changé en ${role}.`);
      await loadAdmins();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDelete = async (admin: AdminUser) => {
    if (!window.confirm(`Confirmez-vous la suppression irréversible de l'administrateur ${admin.displayName} (${admin.email}) ?`)) {
      return;
    }
    setError('');
    setSuccess('');
    try {
      await deleteAdminUser(currentAdmin, admin.id);
      setSuccess(`L'administrateur a été supprimé.`);
      await loadAdmins();
    } catch (err: any) {
      setError(err.message);
    }
  };

  // Sécurité d'accès : seul le superadmin a accès à cette section
  if (currentAdmin.role !== 'superadmin') {
    return (
      <div className="bg-red-950/40 border border-red-800 rounded-2xl p-8 text-center max-w-md mx-auto space-y-3">
        <ShieldAlert className="w-12 h-12 text-red-400 mx-auto" />
        <h3 className="text-xl font-bold text-white">Accès Réservé au Super Administrateur</h3>
        <p className="text-xs text-zinc-400">
          Votre compte possède le rôle <strong>ADMIN</strong> standard. Seul le <strong>SUPER ADMINISTRATEUR</strong> fondateur peut gérer les comptes et permissions.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Crown className="w-5 h-5 text-amber-400" />
            <h3 className="text-white font-black text-lg">Gestion des Administrateurs</h3>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Gérez les accès, invitez des collaborateurs et contrôlez les privilèges de Burger & Co.
          </p>
        </div>

        <button
          onClick={() => setShowInviteModal(true)}
          className="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-black font-black text-xs rounded-xl flex items-center gap-2 transition cursor-pointer self-start sm:self-auto shadow-lg shadow-amber-400/20"
        >
          <UserPlus className="w-4 h-4" />
          <span>Inviter un Administrateur</span>
        </button>
      </div>

      {error && (
        <div className="p-3 bg-red-950 border border-red-800 text-red-300 text-xs rounded-xl flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="p-3 bg-emerald-950 border border-emerald-800 text-emerald-300 text-xs rounded-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {/* Modal Inviter */}
      {showInviteModal && (
        <div className="bg-zinc-900 border border-amber-400/50 rounded-2xl p-6 space-y-4 shadow-2xl">
          <h4 className="text-white font-bold text-sm flex items-center gap-2">
            <UserPlus className="w-4 h-4 text-amber-400" />
            <span>Inviter un nouvel administrateur</span>
          </h4>

          <form onSubmit={handleInvite} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1">Nom complet *</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Ex: Fatou Ndiaye"
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1">Email professionnel *</label>
                <input
                  type="email"
                  required
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="fatou@burgerandco.sn"
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-300 mb-1">Rôle accordé *</label>
              <select
                value={newRole}
                onChange={(e) => setNewRole(e.target.value as Role)}
                className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
              >
                <option value="admin">ADMIN (Gestion du contenu, des burgers et de la galerie)</option>
                <option value="superadmin">SUPER ADMIN (Tous les pouvoirs y compris la gestion des autres admins)</option>
              </select>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowInviteModal(false)}
                className="px-4 py-2 bg-zinc-800 text-zinc-300 text-xs font-bold rounded-xl hover:bg-zinc-700"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-5 py-2 bg-amber-400 text-black text-xs font-black rounded-xl hover:bg-amber-300 flex items-center gap-2"
              >
                {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                <span>Confirmer l'invitation</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tableau des administrateurs */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-zinc-400 text-xs flex flex-col items-center justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-amber-400 mb-2" />
            <span>Chargement des administrateurs...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-zinc-300">
              <thead className="bg-zinc-950 text-zinc-400 uppercase tracking-wider text-[10px] font-bold border-b border-zinc-800">
                <tr>
                  <th className="p-4">Utilisateur</th>
                  <th className="p-4">Rôle</th>
                  <th className="p-4">Statut</th>
                  <th className="p-4">Créé le</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {admins.map((adm) => {
                  const isCurrent = adm.id === currentAdmin.id;
                  return (
                    <tr key={adm.id} className="hover:bg-zinc-850/50 transition">
                      <td className="p-4">
                        <div className="font-bold text-white flex items-center gap-2">
                          <span>{adm.displayName}</span>
                          {isCurrent && (
                            <span className="text-[10px] bg-amber-400/20 text-amber-400 px-1.5 py-0.5 rounded font-bold">
                              Vous
                            </span>
                          )}
                        </div>
                        <div className="text-zinc-500 text-[11px]">{adm.email}</div>
                      </td>

                      <td className="p-4">
                        {adm.role === 'superadmin' ? (
                          <span className="inline-flex items-center gap-1 bg-amber-400 text-black font-black px-2.5 py-0.5 rounded-full text-[10px] uppercase">
                            <Crown className="w-3 h-3" />
                            SUPER ADMIN
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 bg-zinc-800 text-zinc-300 font-bold px-2.5 py-0.5 rounded-full text-[10px] uppercase border border-zinc-700">
                            ADMIN
                          </span>
                        )}
                      </td>

                      <td className="p-4">
                        {adm.active ? (
                          <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold text-[11px]">
                            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                            Actif
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-red-400 font-semibold text-[11px]">
                            <span className="w-2 h-2 rounded-full bg-red-400"></span>
                            Désactivé
                          </span>
                        )}
                      </td>

                      <td className="p-4 text-zinc-400">
                        {new Date(adm.createdAt).toLocaleDateString('fr-FR')}
                      </td>

                      <td className="p-4 text-right space-x-2">
                        {!isCurrent && (
                          <>
                            {/* Toggle Actif / Désactivé */}
                            <button
                              onClick={() => handleToggleStatus(adm)}
                              className={`p-1.5 rounded text-xs font-semibold ${
                                adm.active ? 'hover:bg-red-950 text-red-400' : 'hover:bg-emerald-950 text-emerald-400'
                              }`}
                              title={adm.active ? "Désactiver ce compte" : "Activer ce compte"}
                            >
                              {adm.active ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                            </button>

                            {/* Changer rôle */}
                            <button
                              onClick={() => handleChangeRole(adm, adm.role === 'superadmin' ? 'admin' : 'superadmin')}
                              className="p-1.5 hover:bg-zinc-800 text-amber-400 rounded text-xs"
                              title="Changer rôle"
                            >
                              <ShieldCheck className="w-4 h-4" />
                            </button>

                            {/* Supprimer */}
                            <button
                              onClick={() => handleDelete(adm)}
                              className="p-1.5 hover:bg-red-950 text-zinc-500 hover:text-red-400 rounded text-xs"
                              title="Supprimer définitivement"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};
