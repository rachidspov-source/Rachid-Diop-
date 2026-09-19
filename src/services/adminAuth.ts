import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { 
  doc, 
  getDoc, 
  setDoc, 
  getDocs, 
  collection, 
  updateDoc, 
  deleteDoc, 
  serverTimestamp 
} from 'firebase/firestore';
import { auth, db, isFirebaseConfigured } from './firebase';
import { AdminUser, Role } from '../types/burger';

const STORAGE_ADMINS_KEY = 'burger_and_co_admins_store_v1';
const STORAGE_CURRENT_ADMIN_KEY = 'burger_and_co_current_admin_v1';

// Helpers pour le mode local
export function getLocalAdmins(): AdminUser[] {
  try {
    const raw = localStorage.getItem(STORAGE_ADMINS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveLocalAdmins(admins: AdminUser[]) {
  localStorage.setItem(STORAGE_ADMINS_KEY, JSON.stringify(admins));
}

export function getLocalCurrentAdmin(): AdminUser | null {
  try {
    const raw = localStorage.getItem(STORAGE_CURRENT_ADMIN_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveLocalCurrentAdmin(admin: AdminUser | null) {
  if (admin) {
    localStorage.setItem(STORAGE_CURRENT_ADMIN_KEY, JSON.stringify(admin));
  } else {
    localStorage.removeItem(STORAGE_CURRENT_ADMIN_KEY);
  }
}

/**
 * Vérifie si le système a déjà au moins un administrateur enregistré
 */
export async function checkIfAnyAdminExists(): Promise<boolean> {
  if (isFirebaseConfigured && db) {
    try {
      const snap = await getDocs(collection(db, 'admins'));
      return !snap.empty;
    } catch (err) {
      console.warn('Firestore read error, checking local fallback:', err);
    }
  }
  const local = getLocalAdmins();
  return local.length > 0;
}

/**
 * Inscription du tout premier administrateur (SUPERADMIN)
 * Règle stricte: S'il existe déjà un compte, cette méthode échoue avec erreur de sécurité.
 */
export async function registerFirstSuperAdmin(
  email: string,
  pass: string,
  displayName: string
): Promise<AdminUser> {
  const alreadyExists = await checkIfAnyAdminExists();
  if (alreadyExists) {
    throw new Error("Opération interdite : un super-administrateur existe déjà dans le système.");
  }

  if (isFirebaseConfigured && auth && db) {
    const cred = await createUserWithEmailAndPassword(auth, email, pass);
    const newSuperAdmin: AdminUser = {
      id: cred.user.uid,
      email: cred.user.email || email,
      displayName: displayName || 'Super Admin',
      role: 'superadmin',
      createdAt: new Date().toISOString(),
      active: true
    };

    await setDoc(doc(db, 'admins', cred.user.uid), {
      ...newSuperAdmin,
      serverCreatedAt: serverTimestamp()
    });

    // Marquer l'initialisation du système
    await setDoc(doc(db, 'siteSettings', 'system'), {
      initialized: true,
      superAdminId: cred.user.uid,
      createdAt: serverTimestamp()
    });

    return newSuperAdmin;
  } else {
    // Mode local de secours hautement fonctionnel
    const newSuperAdmin: AdminUser = {
      id: 'superadmin-' + Date.now(),
      email,
      displayName: displayName || 'Super Administrateur',
      role: 'superadmin',
      createdAt: new Date().toISOString(),
      active: true
    };
    saveLocalAdmins([newSuperAdmin]);
    saveLocalCurrentAdmin(newSuperAdmin);
    return newSuperAdmin;
  }
}

/**
 * Connexion administrateur
 */
export async function loginAdmin(email: string, pass: string): Promise<AdminUser> {
  if (isFirebaseConfigured && auth && db) {
    const cred = await signInWithEmailAndPassword(auth, email, pass);
    const adminDoc = await getDoc(doc(db, 'admins', cred.user.uid));
    
    if (!adminDoc.exists()) {
      await firebaseSignOut(auth);
      throw new Error("Accès refusé. Vous n'avez pas de compte administrateur.");
    }
    
    const adminData = adminDoc.data() as AdminUser;
    if (!adminData.active) {
      await firebaseSignOut(auth);
      throw new Error("Ce compte administrateur a été désactivé par le Super Admin.");
    }

    // Mettre à jour lastLogin
    await updateDoc(doc(db, 'admins', cred.user.uid), {
      lastLogin: new Date().toISOString()
    });

    return {
      ...adminData,
      id: cred.user.uid,
      lastLogin: new Date().toISOString()
    };
  } else {
    // Mode fallback
    const admins = getLocalAdmins();
    const found = admins.find(a => a.email.toLowerCase() === email.toLowerCase());
    if (!found) {
      throw new Error("Identifiants incorrects ou compte introuvable.");
    }
    if (!found.active) {
      throw new Error("Ce compte administrateur a été désactivé.");
    }
    found.lastLogin = new Date().toISOString();
    saveLocalAdmins(admins);
    saveLocalCurrentAdmin(found);
    return found;
  }
}

/**
 * Déconnexion
 */
export async function logoutAdmin(): Promise<void> {
  if (isFirebaseConfigured && auth) {
    await firebaseSignOut(auth);
  }
  saveLocalCurrentAdmin(null);
}

/**
 * Récupère tous les administrateurs (Réservé au Super Admin)
 */
export async function fetchAllAdmins(): Promise<AdminUser[]> {
  if (isFirebaseConfigured && db) {
    try {
      const snap = await getDocs(collection(db, 'admins'));
      return snap.docs.map(d => ({ ...(d.data() as AdminUser), id: d.id }));
    } catch (err) {
      console.error('Failed to fetch admins from firestore:', err);
    }
  }
  return getLocalAdmins();
}

/**
 * Créer un nouvel administrateur invité (Seul le Super Admin a le droit)
 */
export async function inviteOrAddAdmin(
  currentUser: AdminUser,
  newAdminData: { email: string; displayName: string; role: Role; initialPassword?: string }
): Promise<AdminUser> {
  if (currentUser.role !== 'superadmin') {
    throw new Error("Action non autorisée : seul le Super Administrateur peut gérer les accès.");
  }

  const newAdmin: AdminUser = {
    id: 'admin-' + Math.random().toString(36).substring(2, 9),
    email: newAdminData.email.trim(),
    displayName: newAdminData.displayName.trim(),
    role: newAdminData.role,
    createdAt: new Date().toISOString(),
    active: true,
    invitedBy: currentUser.displayName || currentUser.email
  };

  if (isFirebaseConfigured && db) {
    // Sauvegarder la fiche admin dans Firestore
    await setDoc(doc(db, 'admins', newAdmin.id), newAdmin);
  }

  const existing = getLocalAdmins();
  existing.push(newAdmin);
  saveLocalAdmins(existing);

  return newAdmin;
}

/**
 * Modifier le rôle ou l'état actif d'un administrateur
 */
export async function updateAdminUser(
  currentUser: AdminUser,
  targetAdminId: string,
  updates: Partial<Pick<AdminUser, 'role' | 'active' | 'displayName'>>
): Promise<void> {
  if (currentUser.role !== 'superadmin') {
    throw new Error("Seul le Super Administrateur peut modifier un compte.");
  }

  if (currentUser.id === targetAdminId && updates.active === false) {
    throw new Error("Vous ne pouvez pas désactiver votre propre compte Super Administrateur.");
  }

  if (isFirebaseConfigured && db) {
    await updateDoc(doc(db, 'admins', targetAdminId), updates);
  }

  const existing = getLocalAdmins();
  const idx = existing.findIndex(a => a.id === targetAdminId);
  if (idx !== -1) {
    existing[idx] = { ...existing[idx], ...updates };
    saveLocalAdmins(existing);
  }
}

/**
 * Supprimer un administrateur
 */
export async function deleteAdminUser(currentUser: AdminUser, targetAdminId: string): Promise<void> {
  if (currentUser.role !== 'superadmin') {
    throw new Error("Seul le Super Administrateur peut supprimer un compte.");
  }

  if (currentUser.id === targetAdminId) {
    throw new Error("Vous ne pouvez pas supprimer votre propre compte Super Administrateur.");
  }

  if (isFirebaseConfigured && db) {
    await deleteDoc(doc(db, 'admins', targetAdminId));
  }

  const existing = getLocalAdmins();
  const filtered = existing.filter(a => a.id !== targetAdminId);
  saveLocalAdmins(filtered);
}
