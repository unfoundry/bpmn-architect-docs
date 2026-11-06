# Introduction & Getting Started

Welcome to **BPMN Architect**, a modern, decoupled suite for creating, editing, collaborating on, and rendering BPMN 2.0 business process workflows.

---

## Architectural Philosophy: The Decoupled Model

Legacy diagramming platforms often bundle UI rendering, database persistence, and user interfaces into tightly coupled monoliths. When the backend experiences a disruption, the entire viewer goes offline.

BPMN Architect 2.0 introduces a **decoupled, high-availability architecture**:

1. **Client Platform (`bpmn-architect-ui`)**:
   - Zero-backend client web app built with vanilla HTML5, CSS3, and ES6 JavaScript.
   - 100% offline local vendor assets (Bootswatch Lumen, bpmn-js, Bootstrap Icons, SweetAlert2).
   - Dedicated route structure (`/` Library, `/view/` Viewer, `/edit/` Modeler, `/embed/` Embed View).
   - Capable of rendering diagrams purely from static disk storage if the backend microservice is offline.

2. **Headless Microservice (`bpmn-architect-service`)**:
   - Fast, lightweight Python (FastAPI) API server.
   - Implements **dual-save persistence**: whenever a diagram is saved, it writes `{id}.bpmn` (validated XML), `{id}.svg` (pre-rendered vector image), and `{id}.json` (metadata) atomically to disk.
   - Manages cooperative soft-locks and collaborator presence.
   - Provides direct SVG rendering (`GET /api/diagram/{id}/svg`).
   - Hosts the administrative governance console (`/admin`).

3. **Static Storage Layer**:
   - Diagrams live on disk in a standard folder.
   - Because files are standard `.bpmn` and `.svg`, any reverse proxy (Nginx or IIS) can serve them directly, ensuring viewers are never disrupted even during service maintenance.

---

## Quick Start: Running the Complete Stack

### 1. Launch the Backend Microservice

```bash
cd repos/bpmn-architect-service

# Create and activate virtual environment
python3 -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env

# Start microservice on port 8002
python main.py
```

The service will output:
```
Starting BPMN Architect Service on 0.0.0.0:8002...
Uvicorn running on http://0.0.0.0:8002
```

- Operational Status Board: `http://localhost:8002/`
- Administrative Console: `http://localhost:8002/admin`
- Swagger API Docs: `http://localhost:8002/docs`
- Health Endpoint: `http://localhost:8002/health`

### 2. Launch the Web Modeler UI

In a new terminal window:

```bash
cd repos/bpmn-architect-ui

# Any static file server works:
python3 -m http.server 8080
# Or using Node:
# npx serve -l 8080 .
```

Open `http://localhost:8080/` in your web browser.

### 3. Verify Connectivity

1. The **Process Library** will load diagrams from the service at `http://localhost:8002/api/diagrams`.
2. Click **Create Process** or select a sample template (Approval Flow, Service Integration, Linear Pipeline).
3. The diagram will open in `/view/?id=...` (safe read-only viewer).
4. Click **Edit Process** to acquire an edit lock and open the interactive modeler.
5. Make changes and click **Save**. The service atomically writes both the XML and pre-rendered SVG.

---

## Next Steps

- Explore the [User & Modeler Guide](/user-guide) to learn about editing tools, shortcuts, and custom comment annotations.
- Review the [System Architecture](/architecture) to understand data flow, atomic dual-save, and high-availability caching.
- Check the [Developer Guide & REST API](/developer-guide) for automated integration and programmatic diagram management.

