# Linux Nginx Reverse Proxy Deployment

This guide covers deploying the BPMN Architect suite on Ubuntu/Debian or RHEL/CentOS systems using **Nginx** and **systemd**.

---

## 1. System Layout

```
/var/www/bpmn-ui/             # Static UI frontend assets
/opt/bpmn-service/            # Headless Python microservice
/var/data/bpmn-storage/       # Physical diagram storage directory
```

---

## 2. Setting Up the Systemd Service

Create `/etc/systemd/system/bpmn-service.service`:

```ini
[Unit]
Description=BPMN Architect Headless Microservice
After=network.target

[Service]
Type=simple
User=www-data
Group=www-data
WorkingDirectory=/opt/bpmn-service
Environment="PATH=/opt/bpmn-service/.venv/bin:/usr/bin"
EnvironmentFile=/opt/bpmn-service/.env
ExecStart=/opt/bpmn-service/.venv/bin/uvicorn main:app --host 127.0.0.1 --port 8002 --workers 4
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
```

Enable and start the service:
```bash
sudo systemctl daemon-reload
sudo systemctl enable --now bpmn-service
sudo systemctl status bpmn-service
```

---

## 3. Nginx Server Configuration

Create `/etc/nginx/sites-available/bpmn.conf`:

```nginx
server {
    listen 80;
    server_name bpmn.company.org;

    # Maximum payload size (matches MAX_PAYLOAD_SIZE_MB in service)
    client_max_body_size 10M;

    # 1. Static UI Web Application
    location / {
        root /var/www/bpmn-ui;
        index index.html;
        try_files $uri $uri/ /index.html;
        expires 1h;
    }

    # 2. High-Availability Static Diagram Storage
    # Allows viewers to read .bpmn and .svg directly even if the Python service is offline
    location /diagram_storage/ {
        alias /var/data/bpmn-storage/;
        autoindex off;
        expires 1h;
        add_header Cache-Control "public, max-age=3600";
    }

    # 3. Microservice Proxy (API, Admin, Docs, Health)
    location ~ ^/(api|admin|health|docs|redoc|static)/ {
        proxy_pass http://127.0.0.1:8002;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # WebSocket support for lock presence and collaborative updates
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

Enable the configuration:
```bash
sudo ln -s /etc/nginx/sites-available/bpmn.conf /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

