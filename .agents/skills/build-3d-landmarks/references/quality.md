# Quality, size and review

## Budgets

| kind | near triangles / draws / bytes | far triangles / draws / bytes |
| --- | --- | --- |
| building | ≤ 60 000 / 14 / 2.5 MB (aim 5–30 k, ≤ 1 MB) | ≤ 12 000 / 8 / 500 KB (aim 1–6 k) |
| bridge | ≤ 120 000 / 40 / 4.5 MB | ≤ 30 000 / 10 / 1.2 MB |

The far model keeps the near silhouette (bounds within 5 % or 1.5 m) and its negative space and window rhythm as coarser separate quads, never full-height dark stripes, giant bands or blank slabs. The San Francisco collection is the reference: median 10.5 k near / 2.5 k far triangles; the Golden Gate Bridge is 52 k / 12.5 k.

How to stay small without losing the look: one merged mesh per material (5–10 materials); segments where the silhouette is read (columns 6–8 sides, domes 16–24) and few elsewhere; windows, joints and mullions as flat quads slightly proud of the wall, not 12-triangle boxes; no hidden faces (bottoms on the ground, faces against another solid, end caps nobody sees); far drops sub-pixel members (truss diagonals, rails, lamp heads) but keeps arches, colonnades and colour.

## Common defects

- **Layered faces can flicker without touching**: near overlays ≥ 10 cm proud and verified host depth ordering; far overlays inset or dropped rather than stacked. `layeredFaces` screens parallel different-material gaps < 20 cm near / < 50 cm far. These conservative model-metre thresholds are not a precision guarantee for every camera. Use host polygon offsets where needed, regenerate/check any host depth table after every export, and resolve material cycles (A on B and B on A). Never stack boxes with a shared face.
- **Holes and inside-out faces** appear from low angles; double-sided materials hide them in viewers but not in every host. Check winding after mirroring.
- Every cable/stay/hanger/rail/walkway/beam ends at an anchor, saddle, deck, pier or ground in both LODs; do not truncate at an asset boundary in mid-air. Test terminal points against **named support surfaces**, excluding the member itself, and include a shortened-end negative case. Nothing far below `y = 0`.
- Reliefs/statue groups should read as grouped human silhouettes, not slabs or Y-shaped sticks. Crowns, lanterns and belfry tiers stay within ~8 % of reference proportions. Calibrate colours to photos; avoid toy saturation and camouflage patchwork. The San Francisco collection sets the recognition bar.
- Keep vertex normals; give lit night elements (signs, windows) a separate material so a host can draw them unshaded.

## Check and review

- `node .agents/skills/build-3d-landmarks/scripts/qa-metrics.mjs --ids <id>`: budgets, removable bytes, far-vs-near bounds, parts below grade, layered/coplanar different-material faces, back-face hits, window-rhythm and unsupported member-end candidates. Details and model-metre locations are in JSON. No LLM needed.
- `node .agents/skills/build-3d-landmarks/scripts/qa-sheet.mjs --ids <id>` (no server needed): one contact sheet of the exported GLBs (near 3/4 views, street level, plan, far LOD) beside a reference photograph fetched for local comparison only (never commit it).
- For a shareable before/after, render both versions with `--no-ref --tag Before|After --bounds <json>` (a name tile instead of the photo, identical framing).
- An independent reviewer compares far tiles with near and the photo: recognisability 1–5, proportions (~8 % tolerance), distinctive features, artifacts, window rhythm and weight. A visible defect, misplaced model or budget overrun is **FIX**, even if documented. Fix and re-export; independently re-review every fix. Two look-fix rounds, then lead judgement. Host app shots in **both flat and terrain modes** are mandatory to claim integration: inspect shading, provider blocks and ground contacts from an unobstructed camera.

## Geometry-check limits

`windowRhythm` compares vertical window/glass/glow faces in eight bearing bins (near ≥ 32 faces / ≥ 10 m²). It flags coverage < 15 %, or face count < 35 % combined with median height > max(6 m, 3× near), width > max(10 m, 4× near), or window area share > max(45 %, 2.5× near). Count reduction alone passes: a coarser grid is valid. Semantic names and exposed geometry matter; hidden glazing, procedural shading and material renames need visual comparison.

`memberEnds` welds same-material triangles into components, including members merged for export. It examines cable/stay/hanger/suspender/rail/beam/girder/walkway names, length ≥ 4 m, radius ≤ 1.5 m and aspect ≥ 12. Principal-axis cap centres above local grade need another component within max(0.75 m, 1.5× radius). Findings are review candidates with material and coordinates: curved/branched/thick members, unnamed steel, deep embedment, open shells and host terrain contact need named-support tests and visual review. A clean result is not proof of complete support or facade rhythm.

## Working with an AI agent cheaply

Agents re-read their whole context on every turn, so images are the main cost: look at one contact sheet per iteration instead of many single renders, run export + checks in one command, and query large JSON files instead of reading them whole.

Locating a defect costs more than fixing it. A coplanar flag from `qa-metrics.mjs` reads `small-material on big-material <area> at [x, y, z]` (model-space metres): search the source for the part at that position instead of hunting through renders, and use matching fresh evidence for independent re-review.
