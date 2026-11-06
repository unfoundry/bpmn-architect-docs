# BPMN Architect Documentation Portal

> Interactive VitePress documentation portal for the BPMN Architect 2.0 collaborative modeling platform.

Part of the **BPMN Architect Suite**:
- **[bpmn-architect-ui](https://github.com/unfoundry/bpmn-architect-ui)**: Client web application, process modeler, and embeddable viewer.
- **[bpmn-architect-service](https://github.com/unfoundry/bpmn-architect-service)**: Headless Python FastAPI microservice (soft-locks, dual-save persistence, Kroki SVG renderer, and administrative governance).
- **[bpmn-architect-docs](https://github.com/unfoundry/bpmn-architect-docs)**: Comprehensive VitePress documentation and deployment guides (this repository).

---

## Features

- **Built with VitePress**: Fast, lightweight static site generator powered by Vite and Vue.
- **Offline Client-Side Search**: Built-in full-text local search provider.
- **Interactive Architecture & Diagrams**: Mermaid sequence, state, and flowcharts.
- **Complete Enterprise Coverage**:
  - Introduction, concepts, and getting started.
  - End-to-end user and modeler guides.
  - Architecture overview, dual-save persistence, and static storage resilience.
  - Cooperative soft-lock broker and presence tracking.
  - Hardened security pipeline (XXE mitigation and SVG XSS sanitization).
  - Headless microservice guide and REST API specification.
  - Administrative governance console (`/admin`).
  - Production deployment guides for Windows Server (IIS ARR) and Linux (Nginx).

---

## Development & Build

### Prerequisites
- Node.js 18+ (tested on Node.js 22)
- npm 9+

### Commands

```bash
# 1. Install dependencies
npm install

# 2. Run local development server
npm run docs:dev

# 3. Build production static HTML
npm run docs:build

# 4. Preview production build locally
npm run docs:preview
```

The dev server will start at `http://localhost:5173/` with hot-module replacement (HMR).

---

## Deployment to GitHub Pages

This repository includes an automated GitHub Actions workflow at `.github/workflows/deploy.yml` that builds and publishes the documentation to GitHub Pages on every push to `main`:

1. In GitHub, go to **Settings** &rarr; **Pages**.
2. Under **Build and deployment** &rarr; **Source**, select **GitHub Actions**.
3. Pushes to `main` (or manual triggers via the **Actions** tab) will build and publish the site to `https://<org>.github.io/bpmn-architect-docs/`.

---

## License

Apache-2.0. Copyright &copy; 2026 BPMN Architect / Unfoundry.
