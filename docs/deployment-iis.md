# Windows IIS & ARR Deployment

This guide details configuring **Microsoft Internet Information Services (IIS)** with **Application Request Routing (ARR)** to host the BPMN Architect suite on Windows Server environments.

---

## 1. Prerequisites

- Windows Server with IIS 10+
- IIS Extensions:
  - **URL Rewrite 2.1**
  - **Application Request Routing (ARR) 3.0**
  - **HttpPlatformHandler 1.2** (or Python Windows Service)
- Python 3.10+ installed on the server

---

## 2. Directory Layout on Windows Server

```
C:\inetpub\wwwroot\bpmn-architect\
├── ui\                    # Contents of bpmn-architect-ui
├── service\               # Contents of bpmn-architect-service
└── diagram_storage\       # Shared physical storage folder
```

---

## 3. IIS Site Configuration

### Step 1: Create the Primary Website
1. In IIS Manager, create a new Website:
   - **Site name**: `BPMN-Architect`
   - **Physical path**: `C:\inetpub\wwwroot\bpmn-architect\ui`
   - **Binding**: `http` port `80` (or `https` `443` with SSL)

### Step 2: Configure Virtual Directory for Storage
1. Right-click the `BPMN-Architect` site &rarr; **Add Virtual Directory**.
2. **Alias**: `diagram_storage`
3. **Physical path**: `C:\inetpub\wwwroot\bpmn-architect\diagram_storage`
4. Set permissions to allow `IIS_IUSRS` read access.

### Step 3: Add MIME Types
Ensure IIS recognizes `.bpmn` and `.svg` files:
- `.bpmn` &rarr; `application/xml`
- `.svg` &rarr; `image/svg+xml`
- `.json` &rarr; `application/json`

---

## 4. Run the Python Microservice via HttpPlatformHandler

Inside `C:\inetpub\wwwroot\bpmn-architect\service\web.config`:

```xml
<?xml version="1.0" encoding="utf-8"?>
<configuration>
  <system.webServer>
    <handlers>
      <add name="PythonHandler" path="*" verb="*" modules="httpPlatformHandler" resourceType="Unspecified"/>
    </handlers>
    <httpPlatform processPath="C:\inetpub\wwwroot\bpmn-architect\service\.venv\Scripts\python.exe"
                  arguments="-m uvicorn main:app --port %HTTP_PLATFORM_PORT%"
                  stdoutLogEnabled="true"
                  stdoutLogFile="C:\inetpub\wwwroot\bpmn-architect\service\logs\stdout.log">
      <environmentVariables>
        <environmentVariable name="SERVICE_PORT" value="%HTTP_PLATFORM_PORT%" />
        <environmentVariable name="AUTH_METHOD" value="iis-header" />
        <environmentVariable name="IIS_HEADER_NAME" value="X-Forwarded-User" />
        <environmentVariable name="STORAGE_DIR" value="C:\inetpub\wwwroot\bpmn-architect\diagram_storage" />
        <environmentVariable name="UI_BASE_URL" value="http://bpmn.corp.local" />
      </environmentVariables>
    </httpPlatform>
  </system.webServer>
</configuration>
```

---

## 5. Reverse Proxy Rules in URL Rewrite

Inside `C:\inetpub\wwwroot\bpmn-architect\ui\web.config`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration>
  <system.webServer>
    <rewrite>
      <rules>
        <!-- Reverse proxy API and Admin calls to the FastAPI microservice -->
        <rule name="ReverseProxyToService" stopProcessing="true">
          <match url="^(api|admin|health|docs|redoc)(.*)" />
          <action type="Rewrite" url="http://127.0.0.1:8002/{R:0}" />
          <serverVariables>
            <set name="HTTP_X_FORWARDED_USER" value="{LOGON_USER}" />
          </serverVariables>
        </rule>

        <!-- Static storage fallback bypasses rewrite -->
        <rule name="DiagramStorageStatic" stopProcessing="true">
          <match url="^diagram_storage/(.*)" />
          <action type="None" />
        </rule>
      </rules>
    </rewrite>
  </system.webServer>
</configuration>
```

