# Platform Features & Capabilities

BPMN Architect 2.0 represents a complete modernization from legacy monolith architectures to an enterprise-grade, high-availability platform.

---

## Core Feature Comparison

| Capability | Legacy BPMN Architect | Modernized BPMN Architect 2.0 |
| :--- | :--- | :--- |
| **Architecture** | Monolithic Python backend with bundled templates | Decoupled 3-tier suite (Static UI, Headless Microservice, Docs) |
| **Offline Resilience** | Completely down if Python process stops | Viewers continue reading `.bpmn` and `.svg` directly from static storage |
| **Persistence Model** | Single XML file writes | Atomic **dual-save** (validated XML + pre-rendered vector SVG) |
| **Image Rendering** | Client-side export only | Server-side **Kroki-like** direct SVG endpoint (`GET /api/diagram/{id}/svg`) |
| **Soft-Locking** | Abrupt timeouts, stuck locks | Cooperative broker with heartbeats, handoff requests, and admin force unlock |
| **Security Pipeline** | Basic XML parsing | `defusedxml` XXE mitigation, SVG XSS script stripping, 5MB upload ceiling |
| **Administrative Governance** | Direct database manipulation | Dedicated `/admin` console with soft-delete, recovery, and bundle audits |
| **Asset Delivery** | Dependent on external CDNs | 100% offline local vendor assets (Bootswatch Lumen, bpmn-js, SweetAlert2) |
| **Design & Layout** | Stretched sidebars with long text | Rigid 320px sidebar with `.description-box` word-wrapping & relative timestamps |

---

## Detailed Capabilities

### 1. Dual-Save Storage Engine
Every save operation atomically writes:
1. `{id}.bpmn`: Normalized, validated BPMN 2.0 XML definitions.
2. `{id}.svg`: Pre-rendered vector SVG image exported by the modeler canvas and sanitized by the backend.
3. `{id}.json`: Process metadata (friendly name, project category, author, timestamps).

Files are written to temporary sibling files (`.tmp`) before replacing the destination via `os.replace`. This eliminates partial writes or corrupted diagrams caused by interrupted uploads.

### 2. Kroki-Like Direct SVG Image Rendering
The microservice exposes:
```http
GET /api/diagram/{diagram_id}/svg
```
- Direct vector image rendering with `image/svg+xml` content type.
- Cached on HTTP clients with `Cache-Control: public, max-age=60`.
- Can be directly embedded into Markdown:
  ```markdown
  ![Order Processing Flow](http://bpmn-service.corp/api/diagram/A2nX5VOZAp1W/svg)
  ```

### 3. Cooperative Soft-Locking & Collaborator Presence
- **Single-Editor Guarantee**: Only one user holds the edit lock for a diagram at any given time.
- **Heartbeat Coordination**: Active editors send lightweight pings every 15 seconds (`LOCK_HEARTBEAT_SEC=15`).
- **Graceful Handoff Requests**: If User B attempts to edit while User A is active, User B can send a handoff request. User A receives a gentle notification to yield or save.
- **Administrative Override**: Administrators can force release any locked session via `/admin` or `POST /api/diagram/{id}/unlock`.

### 4. Hardened Security Architecture
- **XXE Injection Blocking**: All XML streams are validated using `defusedxml.ElementTree` to prevent external entity injection, billion laughs quadratic blowout, and SSRF attacks.
- **SVG XSS Sanitization**: Strips dangerous `<script>` elements, event handlers (`onload`, `onerror`, `onclick`), and foreign URI schemas (`javascript:`) before persistence.
- **Payload Size Limits**: Strict 5MB ceiling enforced via `MAX_PAYLOAD_SIZE_MB`.

### 5. Administrative Console (`/admin`)
- Accessible via the service host at `/admin`.
- Authenticated via the configured provider (`master-key`, `iis-header`, `ldap`, or `none`).
- Features:
  - Inventory listing of all active and soft-deleted diagrams.
  - One-click **Force Unlock** for stuck sessions.
  - **Soft-Delete** with SweetAlert2 confirmation dialogs.
  - **Restore** for recovering deleted processes.
  - Physical disk bundle activity audit grouped by Diagram ID with real-time search and pagination.

