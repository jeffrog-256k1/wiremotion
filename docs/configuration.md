# Configuration v1

The input is a JSON object, up to 16 KiB in the editor and CLI. Unknown fields are rejected to surface spelling mistakes. Text is drawn on Canvas, never interpreted as HTML or code. Labels must be single-line strings.

| Field      | Allowed values                                 | Default    |
| ---------- | ---------------------------------------------- | ---------- |
| `version`  | `1`, required                                  | —          |
| `title`    | 1–52 Unicode code points, required             | —          |
| `subtitle` | 0–96 code points                               | empty      |
| `layout`   | `pipeline`, `branch`, `hub`, required          | —          |
| `theme`    | `dark`, `light`                                | `dark`     |
| `accent`   | `#` plus six hex digits                        | `#ff5938`  |
| `duration` | `4`, `6` seconds                               | `6`        |
| `width`    | `960`, `1280` pixels, always 16:9              | `1280`     |
| `seed`     | Integer, 0–2147483647                          | `7`        |
| `nodes`    | Objects with `id`, `label`, optional `detail`  | required   |
| `edges`    | Objects with `from`, `to`, optional `label`    | required   |
| `sequence` | Every node ID exactly once, in highlight order | node order |

Node IDs are unique, 1–24 ASCII letters, digits, underscores or hyphens. Node labels are 1–26 code points; optional details are at most 42. Edge labels are optional and at most 16. Control characters are rejected. Choose a contrasting accent color: custom colors are not automatically corrected for contrast.

## Connection rules

**Pipeline:** 2–5 nodes. Each node connects to the next node in array order. Provide exactly `nodes.length - 1` edges. Reversed, skipped, or duplicate steps are rejected.

**Branch:** 3–5 nodes. The first is the root. Connect each other node to the root once, in either direction. Leaf-to-leaf connections are rejected.

**Hub:** 3–6 nodes. The first is the center. Connect each spoke to the center once, in either direction. Spoke-to-spoke connections are rejected.

`sequence` changes the order in which boxes are highlighted. It does not change the physical layout or individual signal speed. `seed` changes the static halftone field. These are illustrations of a process, not a simulation of actual execution or timing.

## Rendering

The renderer uses a 1280×720 design space scaled uniformly to the chosen output. The templates reserve room for the title, diagram, and footer. Long text scales down, then uses a grapheme-safe ellipsis if it still does not fit. The original text remains in the JSON. System fonts determine glyph coverage; font embedding and external font URLs are not supported.

GIF frames run at 15 fps with an exact 4- or 6-second loop. Centisecond frame delays repeat 70/60/70 ms. The export uses a shared 128-color palette sampled from the still frame. The still image is captured at 38% of the loop. There is no guarantee that every custom diagram stays under a particular hosting size limit; the playground shows the exported size.

The playground honors reduced motion by starting paused. Export remains an explicit user action. Include the generated PNG alongside the GIF and use the README `picture` snippet to provide a reduced-motion fallback.
