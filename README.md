# Y.AI

A modern AI-powered web application built with React, Vite, and Tailwind CSS.

## Features
- Interactive chatbot and personality tests (MBTI, TKI)
- Modern UI components (Radix UI, custom UI library)
- Responsive design and fast performance

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+ recommended)
- [pnpm](https://pnpm.io/) (recommended) or npm/yarn

### Installation
Clone the repository and install dependencies:

```bash
pnpm install
# or
npm install
```

### Development
Start the development server:

```bash
pnpm dev
# or
npm run dev
```

The app will be available at `http://localhost:5173` (default Vite port).

### Building for Production
To build the app for production:

```bash
pnpm build
# or
npm run build
```

The output will be in the `dist/` directory.

### Preview Production Build
To locally preview the production build:

```bash
pnpm preview
# or
npm run preview
```

### Linting
To lint the codebase:

```bash
pnpm lint
# or
npm run lint
```

## Deployment

### GitHub Pages
This project is configured for deployment to GitHub Pages.

1. Set the `homepage` field in `package.json` to your repository URL (already set).
2. Build and deploy:
   ```bash
   pnpm run deploy
   # or
   npm run deploy
   ```
   This will build the app and push the `dist/` folder to the `gh-pages` branch.

### Other Static Hosts
You can deploy the contents of the `dist/` folder to any static hosting provider (e.g., Netlify, Vercel, Firebase Hosting).

## Project Structure
- `src/` — Main source code (components, hooks, assets, utils)
- `public/` — Static assets
- `vite.config.js` — Vite configuration
- `package.json` — Project metadata and scripts

## Environment Variables
If you need to add environment variables, create a `.env` file in the root. See [Vite Env Docs](https://vitejs.dev/guide/env-and-mode.html).

## Contributing
Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## License
[MIT](LICENSE)

