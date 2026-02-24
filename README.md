# Pixel Meow 🐱

Pixel Meow est un canevas de pixel art collaboratif en temps réel inspiré par le "r/place" de Reddit. Construit avec React, Vite, Firebase Auth, Supabase et Docker !

## Instructions d'Installation

1. **Démarrer l'application avec Docker** :
Nous recommandons de lancer le projet via Docker Compose :
```bash
docker-compose up --build
```

2. **Configuration de Supabase** :
Exécutez le script `supabase/schema.sql` dans l'éditeur SQL (SQL Editor) de votre projet Supabase pour créer les tables nécessaires, les vues, les déclencheurs (triggers) et la sécurité d'accès aux lignes (RLS).

3. **Variables d'Environnement** :
Créez un fichier `.env` à la racine contenant les clés trouvées dans le code source de l'application (Firebase et Supabase).

## Git & Déploiement GitHub

Pour envoyer ce projet sur GitHub en utilisant votre Personal Access Token (PAT), exécutez les commandes suivantes. Assurez-vous de remplacer `<VOTRE_PSEUDO>` et `<VOTRE_REPO>` par les informations de votre dépôt cible.

```bash
git init
git add .
git commit -m "Initial commit pour Pixel Meow"
git branch -M main

# Utilisation de votre PAT pour l'authentification :
git remote add origin https://<VOTRE_GITHUB_TOKEN>@github.com/<VOTRE_PSEUDO>/<VOTRE_REPO>.git

git push -u origin main
```

## Accès
Une fois le conteneur Docker en cours d'exécution, vous pouvez accéder à l'application via `http://localhost:6278` (ou `https://pixel.al1x0.fr`).
