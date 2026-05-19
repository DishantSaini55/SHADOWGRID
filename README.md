# ShadowGrid

ShadowGrid is a defensive security research and education platform built as a monorepo with a polished React frontend and a Node.js backend for session capture, scoring, and admin visibility.

![Frontend](https://img.shields.io/badge/Frontend-React%2018%20%2B%20Vite-61DAFB?logo=react&logoColor=0b0f16)
![Backend](https://img.shields.io/badge/Backend-Node.js%20%2B%20Express-339933?logo=node.js&logoColor=white)
![Database](https://img.shields.io/badge/Database-MongoDB%20%2B%20Mongoose-47A248?logo=mongodb&logoColor=white)
![Realtime](https://img.shields.io/badge/Realtime-Socket.io-010101?logo=socketdotio&logoColor=white)
![Auth](https://img.shields.io/badge/Auth-JWT%20%2B%20bcrypt-1f2937)

## Overview

The repository contains two applications:

- `nexacorp/` for the public-facing frontend experience
- `server/` for the Express API, scoring engine, and admin authentication

The project is intended for authorized research, controlled demonstrations, and security awareness workflows.

## Repository Layout

```text
SHADOWGRID/
  nexacorp/
    src/
    index.html
    package.json
  server/
    index.js
    routes/
    models/
    utils/
    package.json
    .env.example
```

## Getting Started

### Frontend

```bash
cd nexacorp
npm install
npm run dev
```

Default local URL: `http://localhost:3000`

### Backend

```bash
cd server
npm install
copy .env.example .env
npm run dev
```

Default API port: `http://localhost:5000`

## Environment Variables

Use the provided templates and keep real secrets out of version control.

- `server/.env.example` documents the backend configuration
- Create a local `server/.env` for private values
- Do not commit API keys, tokens, database credentials, or production secrets

## Security and Privacy

This repository is configured to keep confidential files private by default.

- `.env` files are ignored by Git
- Only example environment files are tracked
- `node_modules/`, build output, and local editor files are excluded
- The repository is intended for lawful, authorized use only

## Backend Features

- Session capture endpoint for monitored login flows
- Threat scoring and attacker classification
- MongoDB persistence for captured events
- Socket.io events for live admin dashboards
- JWT-protected admin routes
- Geo and VPN enrichment for session analysis

## Frontend Features

- Premium multi-page React UI
- Login flow with staged interaction capture
- Terminal and dashboard engagement pages
- Transparent in-memory analytics export
- Responsive layout and accessibility-friendly styling

## Available Scripts

### Frontend

- `npm run dev` - start the Vite development server
- `npm run build` - create a production build
- `npm run preview` - preview the production build locally

### Backend

- `npm run dev` - start the Express server with nodemon
- `npm start` - run the Express server in production mode

## Notes

If you add new credentials, service tokens, or research artifacts, keep them in local environment files or secure storage and update `.gitignore` before committing.
