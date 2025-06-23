# Y.AI

A modern AI-powered web application built with React, Vite, Tailwind CSS, and a Node.js backend for AI/chat features.

## Features
- Interactive chatbot and personality tests (MBTI, TKI)
- Modern UI components (Radix UI, custom UI library)
- Responsive design and fast performance

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+ recommended)
- [pnpm](https://pnpm.io/) (recommended) or npm/yarn

### Installation
Clone the repository and install dependencies for both frontend and backend:

```bash
pnpm install
cd server && pnpm install
```

### Development
Start the backend API server:

```bash
cd server
pnpm start
```

In a separate terminal, start the frontend development server:

```bash
pnpm dev
```

The app will be available at `http://localhost:5173` and will proxy API requests to the backend.

### Building for Production
To build the frontend app for production:

```bash
pnpm build
```

The output will be in the `dist/` directory.

### Linting
To lint the codebase:

```bash
pnpm lint
```

## Deployment on DigitalOcean App Platform

### 1. Push to GitHub
Make sure all changes are committed and pushed to your repository.

### 2. Set Up on DigitalOcean
- Go to the [DigitalOcean App Platform](https://cloud.digitalocean.com/apps).
- Click **"Create App"** and connect your GitHub repository.
- Add two components:
  - **Static Site:**
    - Source: root directory
    - Build command: `pnpm build`
    - Output directory: `dist`
  - **Backend/API Service:**
    - Source: `server/` directory
    - Run command: `pnpm start` or `node index.js`
    - Expose endpoints under `/api`
- Set any required environment variables in the DigitalOcean dashboard.

### 3. API Integration
- The frontend calls the backend using relative paths (e.g., `/api/gemini`).
- No CORS issues if both components are on the same domain.

### 4. Custom Domain (Optional)
- Add a custom domain in the DigitalOcean App Platform dashboard if desired.

## Project Structure
- `src/` — Main source code (components, hooks, assets, utils)
- `public/` — Static assets
- `vite.config.js` — Vite configuration
- `package.json` — Project metadata and scripts
- `server/` — Node.js backend API for AI/chat features

## Environment Variables
If you need to add environment variables, create a `.env` file in the root or in `server/`. See [Vite Env Docs](https://vitejs.dev/guide/env-and-mode.html).

## Contributing
Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## License
[MIT](LICENSE)

