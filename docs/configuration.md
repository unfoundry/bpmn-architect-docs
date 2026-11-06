# Configuration Reference

This guide details all configuration options available across `bpmn-architect-ui` and `bpmn-architect-service`.

---

## 1. UI Configuration (`app/config.json`)

The client application is configured via `config.json` in the root of `bpmn-architect-ui`:

```json
{
  "appName": "BPMN Architect",
  "appSubtitle": "Collaborative Enterprise Process Modeler",
  "appRoot": "",
  "appLogoIcon": "assets/img/bpmn-architect-logo.svg",
  "appLogoImage": "assets/img/bpmn-architect.svg",
  "companyName": "Enterprise Operations",
  "supportEmail": "support@enterprise.org",
  "documentationUrl": "docs/README.md",

  "endpoints": {
    "serviceUrl": "http://127.0.0.1:8002",
    "apiKey": "dev-master-key-12345",
    "dataStaticServeUrl": "/diagram_storage",
    "userInfoUrl": "assets/sample-data/user-info.json",
    "templatesRegistryUrl": "templates/templates.json"
  },

  "auth": {
    "masterKey": "dev-master-key-12345"
  },

  "features": {
    "enableLocking": true,
    "enableComments": true,
    "enableDirectSvgExport": true,
    "allowOfflineMode": true,
    "autoSaveDrafts": true
  },

  "sessions": {
    "heartbeatIntervalSec": 15,
    "idleTimeoutMin": 15
  }
}
```

### Endpoints
- `serviceUrl`: Base URL of the `bpmn-architect-service` microservice.
- `apiKey` / `auth.masterKey`: Authorization secret passed via `X-Master-Key` to the microservice.
- `dataStaticServeUrl`: HTTP path where `{id}.bpmn` and `{id}.svg` files are served statically for high-availability offline viewing.
- `userInfoUrl`: Endpoint providing user identity `{ "username": "...", "name": "...", "role": "..." }`.

---

## 2. Microservice Configuration (`service/.env`)

The backend microservice is configured via `.env` in `bpmn-architect-service`:

```ini
# Network & Bindings
SERVICE_HOST=0.0.0.0
SERVICE_PORT=8002
SERVICE_ROOT_PATH=
CORS_ORIGINS=*

# Storage & Size Limits
STORAGE_DIR=../diagram_storage
MAX_PAYLOAD_SIZE_MB=5

# Audit Controls for /admin Console
STORAGE_AUDIT_LIMIT=100
STORAGE_AUDIT_MAX_DAYS=0

# Frontend Integration URL
UI_BASE_URL=http://127.0.0.1:8080

# Authentication Strategy: "none", "master-key", "iis-header", "ldap"
AUTH_METHOD=master-key
MASTER_KEY=dev-master-key-12345

# Windows Auth (IIS ARR) Settings
IIS_HEADER_NAME=X-Forwarded-User
IIS_ADMIN_USERS=admin,CORP\admin

# Active Directory / LDAP Settings
LDAP_SERVER_URL=ldap://127.0.0.1:389
LDAP_BIND_DN=
LDAP_BIND_PASSWORD=
LDAP_BASE_DN=
LDAP_USER_SEARCH_FILTER=(&(objectClass=user)(sAMAccountName={username}))
LDAP_ADMIN_GROUP_DN=

# Soft-Lock Timings
LOCK_HEARTBEAT_SEC=15
LOCK_EXPIRY_PAD_SEC=15
IDLE_TIMEOUT_MIN=15
```

### Setting Details
- `STORAGE_AUDIT_LIMIT`: Number of recent files on disk inspected by the `/admin` storage audit (default 100).
- `STORAGE_AUDIT_MAX_DAYS`: Optional day cutoff for disk file auditing (`0` = all).
- `UI_BASE_URL`: URL where the web app is hosted, used by `/admin` to generate clickable diagram viewer links.

