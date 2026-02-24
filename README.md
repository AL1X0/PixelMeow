# Pixel Meow 🐱

Pixel Meow is a real-time collaborative pixel art canvas inspired by Reddit's r/place. Build using React, Vite, Firebase Auth, Supabase, and Docker!

## Setup Instructions

1. **Start the application with Docker**:
We recommend running this via Docker Compose:
```bash
docker-compose up --build
```

2. **Supabase Setup**:
Execute the `supabase/schema.sql` script in your Supabase project's SQL Editor to create the necessary tables, views, triggers, and Row Level Security (RLS) policies.

3. **Environment Variables**:
Create a `.env` file at the root tracking the keys found in the source code.

## Git & GitHub Deployment

To push this project to GitHub using your Personal Access Token (PAT), run the following commands. Make sure to replace `<YOUR_GITHUB_USERNAME>` and `<YOUR_REPO_NAME>` with your actual target repository details.

```bash
git init
git add .
git commit -m "Initial commit for Pixel Meow"
git branch -M main

# Using your PAT for authentication:
git remote add origin https://<YOUR_GITHUB_TOKEN>@github.com/<YOUR_GITHUB_USERNAME>/<YOUR_REPO_NAME>.git

git push -u origin main
```

## Access
Once the Docker container is running, access the app at `http://localhost:6278` (or `https://pixel.al1x0.fr`).
