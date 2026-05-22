# POC_SSS Frontend

This repository contains the frontend application built with React, Vite, and Tailwind CSS.

## What this app uses

- React 19
- React DOM 19
- Vite for fast development and build
- Tailwind CSS 4 for styling
- React Router DOM 7 for routing
- Axios for HTTP requests
- lucide-react for icons

## Prerequisites

- Node.js installed (recommended version `18.x` or newer)
- npm installed (comes with Node.js)

## Setup

1. Open a terminal.
2. Navigate to the frontend folder:

```bash
cd frontend
```

3. Install dependencies:

```bash
npm install
```

## Run the app locally

Start the Vite development server:

```bash
npm run dev
```

4. Open the URL shown in the terminal, typically:

```text
http://localhost:5173
```

## Build for production

To create a production build:

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

## Notes

- If you see any issues with package installation, try removing `node_modules` and reinstalling:

```bash
rm -rf node_modules package-lock.json
npm install

