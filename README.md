# Burger & Co — Guide de Configuration & Déploiement

Ce document résume l'architecture, la configuration de sécurité et les étapes de déploiement de la plateforme **Burger & Co** (@burger_and_co_sn).

---

## 1. Fonctionnalités Implémentées

- **Identité Visuelle** : Palette dominante Jaune (#FBBF24 / amber-400), Noir (#09090B), Blanc et Gris subtil. Design premium gourmand et contrasté.
- **Site Vitrine Public** :
  - Header sticky avec bouton d'action direct WhatsApp et bouton discret de connexion admin.
  - Section Hero percutante et responsive avec badge, call-to-action et visuel smash burger.
  - Section Menu interactif avec filtrage par catégorie, barre de recherche, badges (Best-seller, Spécial Chef, Nouveau) et commande WhatsApp 1-clic.
  - Section À Propos & Savoir-faire avec statistiques et engagements fraîcheur.
  - Galerie Photos masonry avec visionneuse lightbox plein écran.
  - Section Instagram dédiée à `@burger_and_co_sn` avec bouton d'accès direct.
  - Section Localisation avec intégration Google Maps, itinéraire et horaires détaillés.
  - Section Contact & WhatsApp avec formulaire interactif pré-remplissant la commande.
  - Footer complet avec navigation, horaires et accès administratif discret.
- **Espace Administrateur Sécurisé (`/admin`)** :
  - **Règle Premier Utilisateur = SUPER ADMINISTRATEUR** : Si aucun compte n'existe encore, le premier utilisateur qui s'inscrit devient automatiquement Super Administrateur avec le rôle `superadmin`.
  - **Protection contre l'escalade de privilèges** : Dès qu'un Super Admin existe, les inscriptions publiques sont immédiatement verrouillées. Seul le Super Admin peut inviter ou gérer les autres administrateurs.
  - **Gestion des Administrateurs** : Invitation d'administrateurs, modification de rôle (`admin` ou `superadmin`), activation/désactivation et suppression de comptes.
  - **CMS Intégral du Menu** : Ajout, modification, suppression, changement de prix, photos, badges, et masquage temporaire de produits sans supprimer.
  - **CMS Galerie** : Ajout d'images, légendes, modification de l'ordre d'affichage (monter / descendre) et suppression.
  - **CMS Textes & Coordonnées** : Modification des titres, slogans, textes d'accueil, adresse, coordonnées, lien Instagram, numéro WhatsApp et logo.
  - **Upload d'Images Hybride** : Compatible Cloud Storage et compression optimisée WebP pour prévisualisation et affichage immédiat.

---

## 2. Configuration Firebase (Facultatif ou Production)

Le projet intègre un moteur hybride réactif avec persistance locale automatique et support complet pour Firebase Authentication, Cloud Firestore et Firebase Storage.

### Variables d'environnement (`.env.local`) :

```env
VITE_FIREBASE_API_KEY="AIzaSy..."
VITE_FIREBASE_AUTH_DOMAIN="votre-projet.firebaseapp.com"
VITE_FIREBASE_PROJECT_ID="votre-projet"
VITE_FIREBASE_STORAGE_BUCKET="votre-projet.appspot.com"
VITE_FIREBASE_MESSAGING_SENDER_ID="123456789"
VITE_FIREBASE_APP_ID="1:123456789:web:abcdef"
```

Les règles de sécurité Firestore sont prêtes dans `firestore.rules` et les règles de stockage dans `storage.rules`.

---

## 3. Commandes de développement et production

- **Démarrage local** : `npm run dev` (disponible sur http://localhost:3000)
- **Vérification TypeScript & Lint** : `npm run lint`
- **Build de production** : `npm run build`
