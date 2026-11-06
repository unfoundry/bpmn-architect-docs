# Developer Guide & REST API Specification

BPMN Architect Service provides a headless, OpenAPI 3.1-compliant REST API for managing diagrams, locks, and rendered images.

---

## 1. Authentication Headers

Depending on `AUTH_METHOD` configured in `service/.env`:

### Method: `master-key`
Send the master key via `X-Master-Key` header or `Authorization: Bearer <key>`:
```http
X-Master-Key: dev-master-key-12345
X-Username: a.taylor
```

### Method: `iis-header`
Windows Authentication reverse proxies inject the identity header:
```http
X-Forwarded-User: CORP\ashley
```

### Method: `ldap`
Standard HTTP Basic Auth:
```http
Authorization: Basic <base64(username:password)>
```

---

## 2. API Endpoints

### System Endpoints

#### `GET /health`
Returns runtime status and configuration parameters.
- **Auth**: None
- **Response**:
```json
{
  "status": "healthy",
  "service": "BPMN Architect Service",
  "version": "2.0.0",
  "auth_method": "master-key",
  "max_payload_size_mb": 5,
  "storage_directory": "/var/data/bpmn-storage"
}
```

#### `GET /`
Operational Status Board (HTML).

#### `GET /admin`
Administrative Governance Console (HTML).

---

### Diagram Endpoints

#### `GET /api/diagrams`
Returns a list of cataloged diagrams with active lock states.
- **Query Params**:
  - `include_deleted` (bool, default `false`)
- **Response**:
```json
[
  {
    "id": "A2nX5VOZAp1W",
    "friendly_name": "Invoice Approval Flow",
    "project_name": "Finance",
    "project_description": "Multi-tier invoice procedure",
    "author": "a.taylor",
    "last_edited_by": "j.doe",
    "created_at": "2026-11-06T13:07:57.903461+00:00",
    "updated_at": "2026-11-06T14:31:20.245605+00:00",
    "is_deleted": false,
    "has_svg": true,
    "locked_by": null,
    "lock_expires_in_sec": 0
  }
]
```

#### `POST /api/diagram/new`
Creates and registers a new BPMN diagram on disk.
- **Request Body**:
```json
{
  "friendly_name": "New Onboarding Flow",
  "project_name": "HR Operations",
  "project_description": "Employee onboarding lifecycle",
  "initial_xml": "<?xml version=\"1.0\" encoding=\"UTF-8\"?>..."
}
```

#### `GET /api/diagram/{id}`
Retrieves metadata and current lock state for a single diagram.

#### `GET /api/diagram/{id}/xml`
Returns raw BPMN 2.0 XML with `application/xml` content type. Open for static reading.

#### `GET /api/diagram/{id}/svg`
Direct Kroki-like image rendering endpoint returning vector SVG with `image/svg+xml`.

#### `POST /api/diagram/{id}/save`
Dual-save endpoint: atomically saves XML definitions and vector SVG image.
- **Request Body**:
```json
{
  "bpmn_xml": "<?xml version=\"1.0\" encoding=\"UTF-8\"?>...",
  "svg_content": "<svg xmlns=\"http://www.w3.org/2000/svg\"...",
  "friendly_name": "Updated Flow Name",
  "project_name": "Finance",
  "project_description": "Updated description"
}
```

#### `POST /api/diagram/{id}/lock`
Cooperative lock actions (`acquire`, `heartbeat`, `release`, `request_handoff`).
- **Request Body**:
```json
{ "action": "acquire" }
```

#### `POST /api/diagram/{id}/delete`
Marks diagram as soft-deleted and releases active locks.
- **Auth**: Diagram Author or Admin

#### `POST /api/diagram/{id}/restore`
Restores a soft-deleted diagram back to active status.
- **Auth**: Admin

#### `POST /api/diagram/{id}/unlock`
Administrative force unlock: forcibly releases an active session lock.
- **Auth**: Admin

---

## 3. Interactive Documentation

When running `bpmn-architect-service`, visit:
- **Swagger UI**: `http://localhost:8002/docs`
- **ReDoc UI**: `http://localhost:8002/redoc`

