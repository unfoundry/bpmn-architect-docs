# Production Deployment Overview

This document describes recommended production deployment topologies for the BPMN Architect suite.

---

## Architecture Topology

```mermaid
flowchart TD
    subgraph PublicInternet ["Intranet / Public Users"]
        User["Client Browser"]
    end

    subgraph ReverseProxy ["Reverse Proxy (Nginx or IIS)"]
        Gateway["Gateway (Port 80 / 443)"]
    end

    subgraph StaticStorage ["Static Filestore"]
        UI_Files["bpmn-architect-ui Static Assets"]
        Diagram_Storage["Shared Diagram Files<br/>{id}.bpmn & {id}.svg"]
    end

    subgraph ServiceLayer ["Application Backend"]
        FastAPI["bpmn-architect-service<br/>(Port 8002)"]
    end

    User -->|HTTPS| Gateway
    Gateway -->|/ -> Static UI| UI_Files
    Gateway -->|/diagram_storage/ -> Static Files| Diagram_Storage
    Gateway -->|/api/* -> Reverse Proxy| FastAPI
    FastAPI -->|Atomic Save| Diagram_Storage
```

---

## Deployment Options

1. **[Windows IIS & ARR Deployment](/deployment-iis)**:
   - Host `bpmn-architect-ui` as a static IIS site.
   - Run `bpmn-architect-service` via Windows Service or IIS FastCGI / HttpPlatformHandler.
   - Use Windows Integrated Authentication (Kerberos / NTLM) with `AUTH_METHOD=iis-header`.
2. **[Linux Nginx Deployment](/deployment-nginx)**:
   - Serve `bpmn-architect-ui` from `/var/www/bpmn-ui`.
   - Run `bpmn-architect-service` as a systemd service managed by Uvicorn or Gunicorn.
   - Map `/diagram_storage/` alias directly to the physical storage folder for static high availability.

