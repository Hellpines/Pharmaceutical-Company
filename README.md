# Pharmaceutical Company Dashboard

A modern internal dashboard for a pharmaceutical company that helps manage tests, track status, review documentation, and monitor laboratory workflows.

## Features

- Dashboard with summary cards and charts
- Test management and filtering
- Detailed test information page
- Documentation section for internal guidance
- Firebase-based authentication
- Interactive WebSocket chat panel
- Dark mode support
- Responsive layout for desktop and smaller screens

## Tech Stack

### Core
- React 19
- TypeScript
- Vite
- Tailwind CSS

### UI and Data
- @tanstack/react-router
- @tanstack/react-query
- @tanstack/react-table
- Recharts
- Lucide React

### Additional Services
- Firebase Authentication
- Leaflet / react-leaflet
- WebSocket echo chat via wss://ws.ifelse.io

## Project Structure

```text
src/
  components/
  context/
  data/
  hooks/
  pages/
  services/
  types/
  App.tsx
  main.tsx
  router.tsx
```

## Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd Pharmaceutical-Company
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

The application will run on the local Vite URL shown in the terminal.

## Production Build

To generate a production build:

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

## Environment Variables

This project uses Firebase variables that must be defined in a local `.env` file.

Create a `.env` file in the project root based on `.env.example`:

```bash
cp .env.example .env
```

Then fill in your real Firebase values:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

## Deployment

Deployment link: [deployment](https://hellpines.github.io/Pharmaceutical-Company)
