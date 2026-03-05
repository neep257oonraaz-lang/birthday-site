# Birthday Tribute Project - Vishakha

This is a full-stack web application built with React (Vite) and Node.js (Express). It features a private PIN-protected entry, interactive birthday cards, and a silent backend tracking system.

## Features
- **PIN Protection**: Entry code is `0007`.
- **Interactive UI**: Animated card stack with smooth transitions.
- **Background Music**: Soft piano instrumental with interaction-triggered playback and fade-in.
- **Silent Tracking**: User responses are saved to a local SQLite database.
- **Admin Dashboard**: View results at `/api/admin/results`.

## Project Structure
- `src/`: React frontend code.
- `server.ts`: Express backend server.
- `responses.db`: SQLite database file (stores tracking data).
- `package.json`: Project dependencies and scripts.

## How to Run Locally

### 1. Prerequisites
- Node.js (v18 or higher)
- npm

### 2. Installation
Extract the ZIP file, open your terminal in the project folder, and run:
```bash
npm install
```

### 3. Development Mode
To run the app in development mode (with hot reloading):
```bash
npm run dev
```
The app will be available at `http://localhost:3000`.

### 4. Production Build
To build and run the app for production:
```bash
npm run build
npm start
```

## Deployment Notes
- This app uses a local SQLite database (`responses.db`). If you deploy to a platform like Heroku or Vercel, the database file may reset on every deployment unless you use a persistent volume or a managed database.
- Ensure the environment variable `NODE_ENV` is set to `production` on your hosting provider.

## Accessing Results
To view the user responses, visit:
`http://your-domain.com/api/admin/results`
