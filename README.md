# EduCenter Schedule

A React application for managing an education center's class schedule across 4 tracks: Python, JavaScript, Flutter, and English.

## Features

- **4 Tracks**: Independent schedule grids for each track without page reloads.
- **Shared Rooms**: 3 physical rooms and an "Online" location shared across all tracks.
- **Interactive Grid**: Click on empty time slots to create classes, or existing classes to edit them.
- **Cross-Track Free Room Finder**: Check room availability across all 4 tracks at once to avoid overlaps.
- **Local Storage**: All data is saved automatically and persists across sessions.
- **Responsive**: Works on desktop and mobile devices.

## Tech Stack

- React (Vite)
- SCSS for styling (CSS Modules)
- `lucide-react` for icons
- Data storage: `localStorage`

## Getting Started

### Prerequisites
- Node.js

### Installation

1. Clone or download the repository.
2. Install the dependencies:
   ```bash
   npm install
   ```

### Running Locally

Start the development server:
```bash
npm run dev
```

### Building for Production

To create a production build:
```bash
npm run build
```

## Deployment to Vercel

This project is a standard Vite React application and can be easily deployed to Vercel:

1. Push the code to a GitHub/GitLab/Bitbucket repository.
2. Log into [Vercel](https://vercel.com/) and click "Add New... > Project".
3. Import your repository.
4. Vercel will automatically detect that it's a Vite project. The default build settings (`npm run build` and `dist` output directory) are correct.
5. Click "Deploy".
