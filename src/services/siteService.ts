import { 
  doc, 
  getDoc, 
  setDoc 
} from 'firebase/firestore';
import { 
  ref, 
  uploadBytes, 
  getDownloadURL 
} from 'firebase/storage';
import { db, storage, isFirebaseConfigured } from './firebase';
import { SiteData, MenuItem, GalleryItem, Category, RestaurantInfo, HeroSettings, SEOSettings } from '../types/burger';
import { INITIAL_SITE_DATA } from '../data/initialData';

const STORAGE_SITE_KEY = 'burger_and_co_site_content_v2';

export function getLocalSiteData(): SiteData {
  try {
    const raw = localStorage.getItem(STORAGE_SITE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        ...INITIAL_SITE_DATA,
        ...parsed
      };
    }
  } catch (e) {
    console.error('Failed to parse local site data:', e);
  }
  return INITIAL_SITE_DATA;
}

export function saveLocalSiteData(data: SiteData) {
  try {
    localStorage.setItem(STORAGE_SITE_KEY, JSON.stringify(data));
  } catch (e) {
    console.warn('Storage quota or error saving local data:', e);
  }
}

export function resetToDefaultSiteData(): SiteData {
  saveLocalSiteData(INITIAL_SITE_DATA);
  return INITIAL_SITE_DATA;
}

/**
 * Charge l'ensemble des données du site (Firestore ou local)
 */
export async function loadSiteData(): Promise<SiteData> {
  if (isFirebaseConfigured && db) {
    try {
      const siteDoc = await getDoc(doc(db, 'siteSettings', 'publicContent'));
      if (siteDoc.exists()) {
        const firestoreData = siteDoc.data() as SiteData;
        const merged: SiteData = {
          ...INITIAL_SITE_DATA,
          ...firestoreData
        };
        saveLocalSiteData(merged);
        return merged;
      } else {
        // Initialiser avec les données initiales
        await setDoc(doc(db, 'siteSettings', 'publicContent'), INITIAL_SITE_DATA);
        return INITIAL_SITE_DATA;
      }
    } catch (err) {
      console.warn('Firestore load failed, using local cache:', err);
    }
  }
  return getLocalSiteData();
}

/**
 * Sauvegarde les modifications globales du site
 */
export async function persistSiteData(data: SiteData): Promise<void> {
  saveLocalSiteData(data);

  if (isFirebaseConfigured && db) {
    try {
      await setDoc(doc(db, 'siteSettings', 'publicContent'), data);
    } catch (err) {
      console.error('Failed to persist to Firestore:', err);
    }
  }
}

/**
 * Upload d'image : supporte Firebase Storage si configuré, 
 * ou compression automatique en Data URL WebP pour un affichage immédiat et persistant.
 */
export async function uploadImageFile(file: File, folder: string = 'images'): Promise<string> {
  if (isFirebaseConfigured && storage) {
    try {
      const filename = `${folder}/${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
      const storageRef = ref(storage, filename);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      return url;
    } catch (err) {
      console.warn('Firebase storage upload failed, converting to optimized image:', err);
    }
  }

  // Conversion optimisée côté client via HTML5 Canvas (max 1200px)
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 1200;
        const MAX_HEIGHT = 1200;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(e.target?.result as string);
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        // Format JPEG compressé ou WebP
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        resolve(dataUrl);
      };
      img.onerror = () => reject(new Error("Erreur de chargement de l'image"));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error("Lecture du fichier échouée"));
    reader.readAsDataURL(file);
  });
}
