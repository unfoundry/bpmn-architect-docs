# Administrative Governance Console

The **Administrative Console** at `/admin` provides enterprise governance over diagrams, stuck collaborator sessions, and physical disk storage.

---

## 1. Authentication & Security Gate

When visiting `/admin`:
- **Unauthenticated Users**: Displayed a clean authentication panel reflecting the active `AUTH_METHOD`.
  - In `master-key` mode: Presents a master key input field with visibility toggles. Authenticating sets a secure session cookie (`bpmn_master_key`) and refreshes into the console.
  - In `iis-header` mode: Evaluates `X-Forwarded-User` against `IIS_ADMIN_USERS`.
  - In `ldap` mode: Triggers standard HTTP Basic Auth and verifies `LDAP_ADMIN_GROUP_DN`.
- **Authenticated Admins**: Displays the admin ribbon bar with current identity, auth method badge, refresh, and logout controls.

---

## 2. Diagram Inventory & Governance

The primary table lists all cataloged diagrams with elevated controls:
- **Filter Tabs**:
  - `All`: Full catalog.
  - `Active`: Visible to normal users.
  - `Deleted`: Soft-deleted records.
  - `Locked`: Diagrams currently being edited.
- **Real-Time Search**: Instant filtering by diagram ID, flow name, project category, or author.
- **Client-Side Pagination**: Clean page size selector (`5`, `10`, `25`, `50` per page) and navigation buttons to keep the interface compact.
- **Administrative Actions**:
  - **Force Unlock**: Overrides stuck locks held by collaborators (`POST /api/diagram/{id}/unlock`).
  - **Soft-Delete**: Safely hides diagrams from the user library with SweetAlert2 confirmation dialogs (`POST /api/diagram/{id}/delete`).
  - **Restore**: One-click recovery of soft-deleted diagrams back to active status (`POST /api/diagram/{id}/restore`).
  - **Direct Links**: Direct buttons to preview SVG, view raw BPMN XML, and open in the web viewer.

---

## 3. Physical Storage Activity Audit (Grouped by ID)

To audit disk usage without flooding the page with individual file entries, the Storage Audit table groups files by **Diagram ID**:
- **Bundle Representation**:
  - `.bpmn`: Status badge and file size.
  - `.svg`: Status badge and file size.
  - `.json`: Metadata file size.
  - Extra artifacts: Warns of any unexpected or dangling files.
- **Total Bundle Size**: Combined size of all files belonging to the diagram.
- **Latest Activity**: Modification timestamp of the newest file in the bundle.
- **Search & Pagination**: Dedicated search bar for diagram IDs, page size selector, and pagination controls.
- **Configurable Limits**: Controlled via `STORAGE_AUDIT_LIMIT` and `STORAGE_AUDIT_MAX_DAYS` in `.env`.

