# Quality, size and review

## Budgets

| kind | near triangles / draws / bytes | far triangles / draws / bytes |
| --- | --- | --- |
| building | ≤ 60 000 / 14 / 2.5 MB (aim 5–30 k, ≤ 1 MB) | ≤ 12 000 / 8 / 500 KB (aim 1–6 k) |
| bridge | ≤ 120 000 / 40 / 4.5 MB | ≤ 30 000 / 10 / 1.2 MB |

The far model keeps the near silhouette (bounds within 5 % or 1.5 m) and its negative space. The San Francisco collection is the reference: median 10.5 k near / 2.5 k far triangles; the Golden Gate Bridge is 52 k / 12.5 k.

How to stay small without losing the look: one merged mesh per material (5–10 materials); segments where the silhouette is read (columns 6–8 sides, domes 16–24) and few elsewhere; windows, joints and mullions as flat quads slightly proud of the wall, not 12-triangle boxes; no hidden faces (bottoms on the ground, faces against another solid, end caps nobody sees); far drops sub-pixel members (truss diagonals, rails, lamp heads) but keeps arches, colonnades and colour.

## Common defects

- **Coplanar faces flicker**: offset trims, windows and signs ≥ 5 cm (≥ 15 cm on large surfaces); never stack boxes with a shared face.
- **Holes and inside-out faces** appear from low angles; double-sided materials hide them in viewers but not in every host. Check winding after mirroring.
- Nothing floats or overhangs past what holds it; nothing far below `y = 0`.
- Keep vertex normals; give lit night elements (signs, windows) a separate material so a host can draw them unshaded.

## Check and review

- `node .agents/skills/build-3d-landmarks/scripts/qa-metrics.mjs --ids <id>`: budgets, removable bytes, far-vs-near bounds, parts below grade, coplanar overlaps between different materials, and an outside-in ray sweep for back-face hits. No LLM needed.
- `node .agents/skills/build-3d-landmarks/scripts/qa-sheet.mjs --ids <id>` (no server needed): one contact sheet of the exported GLBs (near 3/4 views, street level, plan, far LOD) beside a reference photograph fetched for local comparison only (never commit it).
- For a shareable before/after, render both versions with `--no-ref --tag Before|After --bounds <json>` (a name tile instead of the photo, identical framing).
- Review the sheet against the photo: recognisability 1–5, proportions, distinctive features, artifacts, far LOD, weight. Fix, re-export, look again; two or three iterations are usually enough.

## Working with an AI agent cheaply

Agents re-read their whole context on every turn, so images are the main cost: look at one contact sheet per iteration instead of many single renders, run export + checks in one command, and query large JSON files instead of reading them whole.

Locating a defect costs more than fixing it. A coplanar flag from `qa-metrics.mjs` reads `small-material on big-material <area> at [x, y, z]` (model-space metres): search the source for the part at that position instead of hunting through renders, and skip the contact sheet for such mechanical fixes unless a silhouette changes.
