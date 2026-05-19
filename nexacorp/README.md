# NexaCorp

Enterprise-style, multi-page React frontend for cybersecurity education, UX research, and transparent interaction analytics.

![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?logo=vite&logoColor=white)
![React](https://img.shields.io/badge/React-18.x-61DAFB?logo=react&logoColor=0b0f16)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-4.x-38BDF8?logo=tailwindcss&logoColor=0b0f16)
![Router](https://img.shields.io/badge/React_Router-6.x-CA4245?logo=reactrouter&logoColor=white)
![License](https://img.shields.io/badge/License-Educational-blue)

## Overview

NexaCorp is a realistic corporate website simulation with a premium, responsive UI and a multi-stage login demo. It is designed for controlled demonstrations, awareness training, and security UX research.

## Key Features

- Premium, modern UI/UX with responsive layouts
- Five complete pages: Home, About, Services, Careers, Login
- Multi-stage authentication simulation (login, MFA, lockout, reset)
- Transparent, in-memory session analytics
- Built-in analytics viewer and JSON export
- Accessible interaction states and reduced-motion support

## Tech Stack

- React 18
- Vite 5
- React Router DOM 6
- Tailwind CSS 4
- Lucide React

## Quick Start

### Prerequisites

- Node.js 18+
- npm 9+

### Install

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

Local URL: http://localhost:3000

### Build Production Bundle

```bash
npm run build
npm run preview
```

## Routes

| Route | Page | Purpose |
| --- | --- | --- |
| / | Home | Product positioning, metrics, CTAs |
| /about | About | Story, mission/vision, team |
| /services | Services | Security offerings and demo CTA |
| /careers | Careers | Job listings and culture |
| /login | Login | Multi-stage authentication simulation |

## Login Demo Flow

1. Stage 1: Username/password and remember device
2. Stage 2: MFA entry with countdown timer
3. Stage 3: Locked account state
4. Stage 4: Password reset request
5. Stage 5: Reset confirmation

## Analytics (Transparent by Design)

The app tracks non-sensitive interaction data in memory using the analytics utility in src/utils/analytics.js.

Collected categories:

- Page views and time spent
- Scroll depth
- UI interactions (buttons, links, forms)
- Basic environment metadata (language, platform, viewport)

### View Session Data

1. Interact with the app (navigate, scroll, click)
2. Use the hidden bottom-right trigger in the UI
3. Open the Session Analytics modal
4. Copy or download JSON snapshot

## Project Structure

```text
nexacorp/
  src/
    components/
      Navbar.jsx
      Footer.jsx
    pages/
      Home.jsx
      About.jsx
      Services.jsx
      Careers.jsx
      Login.jsx
    utils/
      analytics.js
    App.jsx
    main.jsx
    index.css
  index.html
  package.json
  postcss.config.js
  tailwind.config.js
  vite.config.js
```

## Available Scripts

- npm run dev: start local development server
- npm run build: create optimized production build
- npm run preview: preview production build locally

## Deployment

### Vercel

```bash
vercel
```

### Netlify

```bash
npm run build
```

Deploy the dist directory.

## Security and Ethical Use

This project is intended for educational and authorized testing environments only.

Allowed usage:

- Security awareness training
- UX and flow demonstrations
- Controlled research and analytics studies

Not allowed:

- Credential theft or impersonation
- Unauthorized phishing campaigns
- Malware delivery or exploit activity
- Any unlawful or deceptive deployment

## Contributing

Contributions are welcome for:

- UI polish and accessibility improvements
- Additional demo scenarios
- Performance optimization
- Documentation and developer experience

## License

Educational/internal use. Ensure lawful and authorized usage in your environment.
