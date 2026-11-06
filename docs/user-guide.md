# User & Modeler Guide

This guide covers everyday interactions within the **BPMN Architect UI**, from exploring the process library to designing collaborative business process diagrams.

---

## 1. Process Library (`/`)

The Process Library serves as the home dashboard:

- **Search & Filter**: Real-time client-side search across diagram friendly names, project categories, and descriptions.
- **Process Cards**:
  - Displays a high-resolution preview of the pre-rendered SVG directly from storage.
  - Shows friendly title, project category, and author.
  - Displays relative timestamps (`Last Edited: 5m ago`, `2h ago`) with hover tooltips displaying the exact date and time.
  - Lock indicators (`Locked by [User]` or `Available`).
- **Create Process**:
  - Modal with flow name, project category, description, and optional `.bpmn` file upload.
  - Pre-packaged templates:
    - *Blank Process*: Clean canvas with start event.
    - *Approval Workflow*: Multi-tier manager review flow.
    - *Service Integration*: Automated microservice orchestrations.
    - *Linear Sequential Pipeline*: Sequential stages with milestone checkpoints.
- **Offline / Static Storage Banner**:
  - If the backend microservice is offline, a prominent banner informs users that recent diagrams are being served directly from the static filestore.
  - Individual items can be removed from personal recent manifests using the `[x]` button.

---

## 2. Dedicated Process Viewer (`/view/`)

When clicking any diagram from the library, it opens in `/view/?id=[id]` in **safe read-only mode**.

### Why Read-Only by Default?
To prevent accidental lock acquisition. Opening a diagram in read-only mode allows users to inspect, zoom, export, and review processes without blocking other editors.

### Viewer Capabilities:
- **Navigation**:
  - Mouse wheel zoom in/out with auto-centering.
  - Click-and-drag panning.
  - **Auto-Fit** button (`bi-arrows-fullscreen`) to fit diagram to canvas dimensions.
  - **Toggle Grid** button to show/hide architectural alignment grid.
- **Fixed 320px Metadata Sidebar**:
  - Flow Name & Process Category.
  - Long Description displayed inside a scrollable `.description-box` with word-wrapping, preventing layout stretching.
  - Current lock status and active collaborator presence.
  - Relative updated timestamp with hover tooltip.
- **Export Options**:
  - Download raw `.bpmn` XML file.
  - Export vector `.svg` image.
  - Open direct **Embed View**.
- **Prominent Edit Button**:
  - One-click transition to `/edit/?id=[id]`.
  - If the service is offline, subtly displays an `(API service offline)` badge and leaves viewing uninterrupted.

---

## 3. Interactive Process Modeler (`/edit/`)

Clicking **Edit Process** opens the full BPMN 2.0 interactive modeler at `/edit/?id=[id]`.

### Native BPMN Palette & Context Pad
- **Palette**: Left-hand palette for drag-and-drop creation of Start Events, Tasks, Gateways, Intermediate Events, End Events, Pools/Lanes, and Subprocesses.
- **Context Pad**: Clicking any element surfaces radial action buttons to instantly connect gateways, tasks, or modify element types (e.g. changing generic task to User Task or Service Task).

### Custom Extended Tools
In addition to the standard bpmn-js tools, BPMN Architect includes specialized quick tools in the sidebar:
- **Comment Annotation Tool**: One-click creation of a text annotation connected to the active element.
- **User Task & Service Task Shortcuts**: Rapid workflow prototyping without digging through sub-menus.
- **Gateway Split / Join**: Instant divergent and convergent logic branches.

### Dirty-State & Auto-Save
- The top ribbon displays a live indicator:
  - `Saved` (green) when all changes match the server state.
  - `Unsaved Changes` (orange) when local edits have not yet been persisted.
  - `Saving...` (blue) during active dual-save network requests.
- **Safety Exit Warning**: Navigating away with unsaved changes prompts a confirmation dialog to prevent accidental data loss.

### Keyboard Shortcuts
| Shortcut | Action |
| :--- | :--- |
| `Ctrl + Z` / `Cmd + Z` | Undo last canvas operation |
| `Ctrl + Y` / `Cmd + Shift + Z` | Redo canvas operation |
| `Ctrl + S` / `Cmd + S` | Save diagram (dual-save XML + SVG) |
| `Delete` / `Backspace` | Delete selected element |
| `Space + Click-Drag` | Canvas pan mode |
| `Ctrl + Scroll` | Zoom in / out |

---

## 4. Embeddable Viewer (`/embed/`)

The embed view (`/embed/?id=[id]`) is stripped of ribbons and sidebars, optimized for embedding inside `<iframe>` tags in Confluence, Notion, SharePoint, or custom web portals:

```html
<iframe
  src="http://bpmn.company.org/embed/?id=A2nX5VOZAp1W"
  width="100%"
  height="600"
  frameborder="0"
  allowfullscreen>
</iframe>
```

- **Floating Controls**: Auto-fit, Zoom In, Zoom Out.
- **Direct SVG Button**: Links directly to the Kroki-like image endpoint.
- **Open in Modeler Button**: Opens the diagram in the full BPMN Architect UI in a new tab.

