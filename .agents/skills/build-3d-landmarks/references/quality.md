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

## Construction defects to prevent

Each of these shipped in a release and was caught only by a later review. Build them right from the start; the named `qa-metrics` check locates most of them.

- **Every face faces where a viewer can be.** Recess cheeks, notch sides, soffits and crowns face the open air they are seen from. A cheek facing into the core is culled and leaves a see-through slot; an open crown shows the hollow tower from above. Check winding after every mirror or rotation (`back-face hits`, now on both LODs, with locations).
- **Caps where a strip ends, nowhere else.** Every extruded strip, box, girder or fill is capped at each exposed end; seams between consecutive strips stay open. Test the end condition on a strip that starts and ends mid-model as well as one spanning the asset; an inverted test caps only the hidden seams.
- **Recesses need reveals.** A pane set back in its wall needs side, sill and head faces, or sits flush/proud with no hole; a recess without reveals is a see-through slit from an angle.
- **Openings in single-sided shells** (cutaways, open bays, arcades, gate passages) look onto an inward-facing interior (back wall, floor, soffit) or glazing, never through the shell to the sky behind.
- **Flat-shade planar parts.** Give each slope or face its own vertices (non-indexed or split) before computing normals; never share vertices across a hard edge or with a hidden face. A shared bottom face turns pitched roofs into dark, rounded loaves (`vertex normals behind their faces`).
- **Attach details to their surface.** Inscriptions, reliefs, plaques and dormers have their back embedded in, or their height computed from, the parent surface. Never move a detail off its surface to clear the layered-face screen: a QA heuristic never justifies a visible defect, so document the check's limitation instead.
- **Both sides of a thin panel.** On flags and signs each side's decal stays in front of its own face; check with rays from both sides.
- **Generator data stays out of the GLB.** Supports, contacts and other QA-only data go on non-enumerable `userData` (`Object.defineProperty(root.userData, 'contacts', { value: contacts })`). Enumerable `userData` is exported into node extras that every host parses and keeps (`GLB extras`); one release shipped 370 KB of it in a 1.9 MB model.
- **Simplification keeps negative space.** A far outline must not bridge a courtyard or notch: simplify with an outline-preserving method (Douglas–Peucker with a metre tolerance) and compare far with near in plan (`far covers … the near model leaves open`).
- **Rules key on explicit flags, counts never round to zero.** Give rings and facades explicit options (a podium flag, not `y0 === 0`); repeat counts on narrow facets use `max(1, floor(width / spacing))` so a far facade keeps its rhythm.
- **Nothing is buried.** A detail entirely inside another solid (dormers under a roof slope, letters inside a frieze) is invisible cost: check each detail's top against the surface it belongs to.
- **Verification rays start outside the model's bounds.** A ray that starts inside a hollow wing reports false back-face hits.

## Check and review

- `node .agents/skills/build-3d-landmarks/scripts/qa-metrics.mjs --ids <id>`: budgets, removable bytes, far-vs-near bounds, parts below grade, layered/coplanar different-material faces, back-face hits on both LODs, window-rhythm and unsupported member-end candidates, GLB extras, smooth-shading skew, faces on host grade and far faces over ground the near model leaves open. Details and model-metre locations are in JSON. No LLM needed.
- `node .agents/skills/build-3d-landmarks/scripts/qa-sheet.mjs --ids <id>` (no server needed): one contact sheet of the exported GLBs (near 3/4 views, street level, plan, far LOD) beside a reference photograph fetched for local comparison only (never commit it).
- For a shareable before/after, render both versions with `--no-ref --tag Before|After --bounds <json>` (a name tile instead of the photo, identical framing).
- An independent reviewer compares far tiles with near and the photo: recognisability 1–5, proportions (~8 % tolerance), distinctive features, artifacts, window rhythm and weight. A visible defect, misplaced model or budget overrun is **FIX**, even if documented. Fix and re-export; independently re-review every fix. Two look-fix rounds, then lead judgement. Host app shots in **both flat and terrain modes** are mandatory to claim integration: inspect shading, provider blocks and ground contacts from an unobstructed camera.

## Geometry-check limits

`windowRhythm` compares vertical window/glass/glow faces in eight bearing bins (near ≥ 32 faces / ≥ 10 m²). It flags coverage < 15 %, or face count < 35 % combined with median height > max(6 m, 3× near), width > max(10 m, 4× near), or window area share > max(45 %, 2.5× near). Count reduction alone passes: a coarser grid is valid. Semantic names and exposed geometry matter; hidden glazing, procedural shading and material renames need visual comparison.

`memberEnds` welds same-material triangles into components, including members merged for export. It examines cable/stay/hanger/suspender/rail/beam/girder/walkway names, length ≥ 4 m, radius ≤ 1.5 m and aspect ≥ 12. Principal-axis cap centres above local grade need another component within max(0.75 m, 1.5× radius). Findings are review candidates with material and coordinates: curved/branched/thick members, unnamed steel, deep embedment, open shells and host terrain contact need named-support tests and visual review. A clean result is not proof of complete support or facade rhythm.

The checks added after the October 2026 review (`LIMITS` in `qa-metrics.mjs`) were calibrated on the whole catalog: each fired on the defects that review found and is clean on their fixes.

- `back-face hits` above 0.5 % of 500 outside-in rays, per LOD, with the first hit locations; a see-through slot or open recess shows as a fraction of a percent.
- `GLB extras` above 4 KB, outside `asset.extras` (license metadata), listing the largest keys.
- `vertex normals behind their faces` when one material has 10 m² or more of faces with a vertex normal more than 90° from the face normal. Smoothed box edges stay under 90°; a normal behind its face is wrong on any surface.
- `faces on host grade`: 10 m² or more of up-facing faces within 5 cm of y = 0 on a building, road surfaces exempt; bridge approach decks meet grade by design and are fitted by the host.
- `far covers … the near model leaves open`: 100 m² or more of far up-facing faces over plan cells (1 m, one cell of tolerance) with no near roof, deck or ground.

On the October 2026 catalog these also list a backlog for later review: 72 assets above the back-face threshold, 22 with GLB extras, 99 with normals behind their faces, 16 buildings with faces on grade and 2 far LODs over open ground besides the fixed one. Intended at-grade water or paving can be a candidate without being a defect; judge it on the contact sheet and record the decision.

## Working with an AI agent cheaply

Agents re-read their whole context on every turn, so images are the main cost: look at one contact sheet per iteration instead of many single renders, run export + checks in one command, and query large JSON files instead of reading them whole.

Locating a defect costs more than fixing it. A coplanar flag from `qa-metrics.mjs` reads `small-material on big-material <area> at [x, y, z]` (model-space metres): search the source for the part at that position instead of hunting through renders, and use matching fresh evidence for independent re-review.
