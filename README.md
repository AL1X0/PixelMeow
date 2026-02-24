# Pixel Meow 🐱

Pixel Meow est un canevas de pixel art collaboratif en temps réel inspiré par le "r/place" de Reddit. Il permet à des centaines d'utilisateurs de dessiner ensemble sur une grille de 500x500 pixels.

## 🛠️ Technologies Utilisées

- **Frontend** : [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) (pour une interface robuste et typée).
- **Build Tool** : [Vite](https://vitejs.dev/) (pour un démarrage et un rechargement instantané).
- **Styling** : [Tailwind CSS v4](https://tailwindcss.com/) (pour un design moderne et responsive).
- **Authentification** : [Firebase Auth](https://firebase.google.com/docs/auth) (Connexion Google SSO sécurisée).
- **Base de Données & Temps Réel** : [Supabase](https://supabase.com/) (PostgreSQL pour le stockage et WebSockets pour la synchronisation en direct).
- **Conteneurisation** : [Docker](https://www.docker.com/) (pour un déploiement facile sur n'importe quel serveur).

---

## 🚀 Configuration et Installation

### 1. Préparation de la Base de Données (Supabase)
1. Créez un projet sur [Supabase](https://supabase.com/).
2. Allez dans l'onglet **SQL Editor**.
3. Copiez et collez le contenu du fichier `supabase/schema.sql`.
4. Cliquez sur **Run**. Cela va créer la table `pixels`, la vue `leaderboard` et les règles de sécurité (RLS).

### 2. Configuration de l'Authentification (Firebase)
1. Créez un projet sur la [Console Firebase](https://console.firebase.google.com/).
    - Allez dans **Authentication** > **Sign-in method**.
    - Activez le fournisseur **Google**.
    - Ajoutez le domaine de votre site (ex: `pixel.al1x0.fr`) dans la liste des "Domaines autorisés".
2. Allez dans les **Paramètres du projet** pour récupérer vos clés API (Web App).

### 3. Variables d'Environnement
Créez un fichier `.env` à la racine du projet avec vos identifiants :
```env
# Firebase
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...

# Supabase
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```

### 4. Lancement avec Docker
Le projet est configuré pour tourner sur le port **6278**.
```bash
docker-compose up --build
```
L'application sera alors disponible sur `http://localhost:6278`.

---

## 🎨 Fonctionnalités Clés

- **Synchronisation en Temps Réel** : Les changements sont répercutés instantanément chez tous les clients via les WebSockets de Supabase.
- **Rendu Optimisé** : Utilisation d'un système de dessin incrémental sur `<canvas>` pour une fluidité maximale (60 FPS).
- **Effet de Survol** : Visualisez instantanément qui a posé quel pixel et à quelles coordonnées grâce à l'info-bulle interactive.
- **Auto-Zoom** : Au chargement, l'application vous centre automatiquement sur la zone la plus active de la grille.
- **Classement (Leaderboard)** : Suivez les 10 meilleurs contributeurs en temps réel.
- **Protection Cooldown** : Un délai de 10 secondes est imposé entre chaque pixel pour garantir l'équilibre du jeu.

---

## 📦 Déploiement Git

Si vous souhaitez pousser vos modifications sur votre propre dépôt :
```bash
git add .
git commit -m "feat: Ajout de nouvelles fonctionnalités"
git push origin main
```
