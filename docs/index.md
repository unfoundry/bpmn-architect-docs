---
layout: home

hero:
  name: "BPMN Architect"
  text: "Collaborative BPMN 2.0 Process Modeler & Gateway"
  tagline: "Decoupled client-side static web modeler with headless Python persistence, cooperative soft-locking, and Kroki-style SVG rendering."
  image:
    src: /logo.svg
    alt: BPMN Architect Logo
  actions:
    - theme: brand
      text: Getting Started
      link: /getting-started
    - theme: alt
      text: System Architecture
      link: /architecture
    - theme: alt
      text: Explore REST API
      link: /developer-guide

features:
  - title: Zero-Backend Static UI
    details: Fully decoupled client web platform. Runs on any static file server (IIS, Nginx, GitHub Pages) without server-side execution runtimes.
  - title: Dual-Save Persistence
    details: Atomically writes both validated BPMN 2.0 XML and pre-rendered vector SVG to disk, enabling high-availability static rendering.
  - title: Kroki-Style SVG Rendering
    details: Direct SVG image endpoint (GET /api/diagram/{id}/svg) for seamless embedding into wikis, Confluence, and Jira.
  - title: Cooperative Soft-Locking
    details: Real-time collaborator presence tracking, automated heartbeats, and graceful handoff negotiation to prevent file collisions.
  - title: Hardened Security Pipeline
    details: DefusedXML entity expansion protection against XXE attacks, SVG script & event handler stripping, and strict 5MB payload ceilings.
  - title: Administrative Governance
    details: Dedicated /admin portal for session lock overrides, soft-delete recovery, and disk bundle audits grouped by ID with pagination.
---

## The BPMN Architect Ecosystem

BPMN Architect is modularized into three independent repositories designed to scale cleanly across enterprise intranet environments:

```mermaid
flowchart TD
    Client["bpmn-architect-ui<br/>(Client Static Modeler)"] -->|Dual-Save & Lock APIs| Service["bpmn-architect-service<br/>(Headless Python Microservice)"]
    Client -.->|Static Fallback Read| Storage[("Diagram Filestore<br/>({id}.bpmn & {id}.svg)")]
    Service -->|Atomic Disk Writes| Storage
    ThirdParty["External Systems<br/>(Wikis, Jira, Markdown)"] -->|GET /api/diagram/{id}/svg| Service
    Docs["bpmn-architect-docs<br/>(VitePress Portal)"] -.->|Documentation| Client
    Docs -.->|Documentation| Service
```

- **[bpmn-architect-ui](https://github.com/unfoundry/bpmn-architect-ui)**: Clean, responsive client web application featuring Bootswatch Lumen styling, fixed 320px sidebar with scrollable description boxes, and dedicated routes (`/`, `/view/`, `/edit/`, `/embed/`).
- **[bpmn-architect-service](https://github.com/unfoundry/bpmn-architect-service)**: Headless, high-performance FastAPI microservice handling validation, security sanitization, persistence, soft-lock coordination, and administrative governance.
- **[bpmn-architect-docs](https://github.com/unfoundry/bpmn-architect-docs)**: Interactive, searchable VitePress documentation portal with complete operational and deployment specifications.

