# Headless Microservice Guide

`bpmn-architect-service` is the headless Python application handling backend persistence, security validation, cooperative locks, and administrative governance.

---

## 1. Core Architecture

The microservice is built using **FastAPI** on **Uvicorn**:
- **Async Event Loop**: Native async non-blocking handlers for cooperative lock heartbeats and pings.
- **File-Backed Persistence**: Pure disk persistence (`STORAGE_DIR`) eliminates external database dependencies.
- **Embedded Templates**: Lightweight Jinja2 status and admin portals served without complex server frameworks.
- **Mounted Static Assets**: Internal branding logos and favicons served directly from `/static/img/`.

---

## 2. Public Status Board (`/`)

Visiting the root URL (`http://localhost:8002/`) renders the live **Status Board**:
- **Operational Banner**: Live uptime counter and service version.
- **Metric Tiles**: Total hosted diagrams, active editing locks, storage engine directory, and active authentication strategy.
- **Platform Core Capabilities**: Visual status of the Dual-Save engine, Kroki SVG renderer, Cooperative lock broker, and Security pipeline.
- **Administrative Portal Gateway**: Secure callout linking to `/admin`.
- **Developer Documentation**: Quick links to OpenAPI Swagger UI, ReDoc, and JSON health checks.

---

## 3. Storage Directory Layout

The service manages a configured folder (`STORAGE_DIR`):
- `{id}.bpmn`: Process definitions in XML.
- `{id}.svg`: Pre-rendered vector graphics.
- `{id}.json`: Metadata and lifecycle records.

### Cleanup of Temporary Files
If a server reboot occurs during an active save, temporary `.tmp` files are automatically superseded on subsequent saves.

