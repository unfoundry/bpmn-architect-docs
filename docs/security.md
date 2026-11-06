# Security Pipeline (XXE & XSS)

Because BPMN files are XML-based documents and vector diagrams are rendered via SVG, diagram platforms are notoriously vulnerable to **XML External Entity (XXE)** injection and **Cross-Site Scripting (XSS)**. 

BPMN Architect 2.0 incorporates a **defense-in-depth security pipeline** inside `service/components/security.py`.

---

## 1. Threat Matrix

| Threat Vector | Mechanism | Risk | BPMN Architect Mitigation |
| :--- | :--- | :--- | :--- |
| **XXE Injection** | Malicious `<!DOCTYPE>` with external entities (`file:///etc/passwd` or HTTP SSRF) | High | Defensive parsing via `defusedxml.ElementTree` |
| **Billion Laughs / Entity Expansion** | Exponential entity expansion causing quadratic CPU blowout | High | `defusedxml` entity expansion limits |
| **SVG Stored XSS** | Embedded `<script>` tags, foreign objects, or `onload`/`onerror` attributes in SVG | High | Whitelist tag/attribute sanitizer |
| **Denial of Service (DoS)** | Giant multi-gigabyte payloads designed to exhaust server RAM | Medium | 5MB upload ceiling enforced via `MAX_PAYLOAD_SIZE_MB` |
| **Path Traversal** | Diagram IDs containing `../` or special path escape characters | High | Strict regex whitelist `^[a-zA-Z0-9_\-]+$` |

---

## 2. BPMN XML Validation (`validate_bpmn_xml`)

When BPMN XML is uploaded or saved:
1. **Size Verification**: Rejects payloads exceeding `config.MAX_PAYLOAD_SIZE_BYTES` (default 5MB).
2. **DefusedXML Parsing**:
   ```python
   import defusedxml.ElementTree as SafeET
   root = SafeET.fromstring(xml_bytes)
   ```
   - Automatically rejects DTD definitions and external entity expansions.
   - Raises `defusedxml.common.DefusedXmlException` if entity manipulation is detected.
3. **BPMN 2.0 Namespace & Root Element Verification**:
   - Ensures the root tag is `<definitions>` belonging to standard BPMN 2.0 namespaces (`http://www.omg.org/spec/BPMN/20100524/MODEL`).
   - Ensures diagram structures are genuine BPMN 2.0 documents, not arbitrary XML files.

---

## 3. SVG Vector Image Sanitization (`validate_and_sanitize_svg`)

The dual-save endpoint accepts client-rendered SVG graphics for Kroki-style previews. Before saving:
1. **Defused XML Parsing**: The SVG stream is parsed using `defusedxml`.
2. **Element Whitelisting**:
   - Permitted: `<svg>`, `<g>`, `<path>`, `<rect>`, `<circle>`, `<text>`, `<tspan>`, `<defs>`, `<marker>`, `<line>`, `<polyline>`, `<polygon>`.
   - **Stripped / Rejected**: `<script>`, `<foreignObject>`, `<embed>`, `<object>`, `<iframe>`, `<applet>`.
3. **Attribute Sanitization**:
   - Every attribute is inspected.
   - Strips event handlers matching `^on.*$` (`onload`, `onerror`, `onclick`, `onmouseover`, etc.).
   - Strips dangerous URI attributes (`href`, `xlink:href`) containing `javascript:`, `data:`, or `vbscript:` URI schemas.
4. **Clean Serialization**:
   - Post-sanitization serialization uses `xml.etree.ElementTree` with `register_namespace("", "http://www.w3.org/2000/svg")` to generate compliant, injection-free SVG vector graphics.

---

## 4. Path Traversal & Identifier Hardening

Every endpoint accepting a `diagram_id` parameter executes `sanitize_diagram_id()`:
```python
ID_PATTERN = re.compile(r"^[a-zA-Z0-9_\-]+$")

def sanitize_diagram_id(diagram_id: str) -> str:
    cleaned = diagram_id.strip()
    if not cleaned or not ID_PATTERN.match(cleaned) or ".." in cleaned:
        raise ValueError(f"Invalid diagram ID '{diagram_id}'.")
    return cleaned
```
This guarantees that files on disk can never escape the configured `STORAGE_DIR`.

