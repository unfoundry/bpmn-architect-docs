# System Architecture Overview

BPMN Architect is built upon a **decoupled, three-tier architecture** designed for high reliability, enterprise security compliance, and independent horizontal scaling.

---

## High-Level Topology

```mermaid
flowchart TD
    subgraph ClientTier ["Client Web Tier (bpmn-architect-ui)"]
        Browser["Modern Browser<br/>(Lumen Theme, Vanilla JS)"]
        LocalCache[("Browser Cache<br/>localStorage")]
        Browser <--> LocalCache
    end

    subgraph GatewayTier ["Reverse Proxy / Web Server"]
        Proxy["Nginx or IIS ARR Gateway"]
    end

    subgraph ServiceTier ["Application Microservice (bpmn-architect-service)"]
        FastAPI["FastAPI Engine"]
        SecPipeline["Security Pipeline<br/>(DefusedXML + SVG Sanitizer)"]
        LockMgr["Cooperative Lock Broker"]
        FastAPI --> SecPipeline
        FastAPI --> LockMgr
    end

    subgraph StorageTier ["Shared Physical Storage Layer"]
        DiskStore[("Physical Disk Storage<br/>{id}.bpmn, {id}.svg, {id}.json")]
    end

    Browser -->|Static HTML/JS/CSS Assets| Proxy
    Browser -->|API Requests (/api/*)| Proxy
    Proxy -->|Static Diagram Fallback| DiskStore
    Proxy -->|REST API Proxy| FastAPI
    SecPipeline -->|Atomic File Replace| DiskStore
```

---

## 1. Client Web Platform (`bpmn-architect-ui`)

The frontend layer is completely isolated from the backend application logic:
- **Zero-Backend Execution**: Served as static assets. There are no server-side Node.js runtimes, PHP scripts, or Python templating dependencies required to run the frontend.
- **Client-Side Manifest**: Maintains a lightweight list of recently visited diagrams (`bpmn_recent_diagrams`) in the browser's `localStorage`.
- **High-Availability Fallback**:
  - The client API module (`api-client.js`) checks the microservice endpoint (`serviceUrl`).
  - If the service is unreachable (network timeout or service offline), it transparently attempts to fetch `{id}.bpmn` and `{id}.json` directly from the static directory (`dataStaticServeUrl`).
  - Viewers can continue exploring and inspecting diagrams uninterrupted.

---

## 2. Headless Microservice (`bpmn-architect-service`)

The backend layer is an event-driven Python microservice powered by **FastAPI** and **Uvicorn**:
- **Stateless Operations**: Diagram state is stored directly on the filesystem as `{id}.bpmn`, `{id}.svg`, and `{id}.json`. This eliminates external database dependencies like PostgreSQL or MySQL for core diagram persistence.
- **Dual-Save Atomic Writes**:
  - The service persists incoming BPMN 2.0 XML and pre-rendered SVG simultaneously.
  - Files are written to temporary sibling files (`.tmp`) and swapped atomically using `os.replace`.
- **Cooperative Soft-Lock Broker**:
  - In-memory lock state tracked by `LockManager` with automated expirations.
  - Supports cooperative handoff negotiation, ping presence tracking, and administrator force unlocks.
- **Direct SVG Image Serving**:
  - Directly serves vector SVGs (`GET /api/diagram/{id}/svg`) with HTTP caching headers (`Cache-Control: public, max-age=60`).

---

## 3. Storage Layer & File Structure

The storage layer organizes all diagram assets in a single directory configured via `STORAGE_DIR`:

```
diagram_storage/
├── A2nX5VOZAp1W.bpmn       # Validated BPMN 2.0 XML definitions
├── A2nX5VOZAp1W.svg        # Pre-rendered vector SVG graphic
├── A2nX5VOZAp1W.json       # Descriptive metadata & lifecycle state
├── 6EaJLIOae5rz.bpmn
├── 6EaJLIOae5rz.svg
└── 6EaJLIOae5rz.json
```

### Metadata JSON Schema (`{id}.json`):
```json
{
  "id": "A2nX5VOZAp1W",
  "friendly_name": "Invoice Approval Flow",
  "project_name": "Finance Operations",
  "project_description": "End-to-end multi-tier invoice approval procedure.",
  "author": "a.taylor",
  "last_edited_by": "j.doe",
  "created_at": "2026-11-06T13:07:57.903461+00:00",
  "updated_at": "2026-11-06T14:31:20.245605+00:00",
  "is_deleted": false
}
```

---

## 4. Decoupling Advantages

1. **Failure Domain Isolation**: A failure or reboot of the Python microservice does not break the web application. Users can continue navigating the library, viewing existing diagrams, and exporting SVGs.
2. **Simplified Maintenance**: The frontend and backend can be deployed, scaled, and upgraded independently.
3. **Enterprise Compliance**: The static frontend can live in a locked-down DMZ or static hosting zone, while the Python microservice lives within the internal application network.

