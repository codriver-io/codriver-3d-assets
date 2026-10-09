# Arctic Cathedral — Tromsdalen kirke

Original procedural model of Jan Inge Hovig’s 1965 church at Hans Nilsens vei 41, Tromsdalen, Tromsø. This is the concrete church at the mainland end of Tromsø Bridge, not Tromsø’s wooden cathedral. Its signature features are eleven paired white aluminium-clad concrete slabs, the tall triangular west glass facade with a structural cross, the descending/ascending roof profile, glazed ribbons between overlapping bays, the east stained-glass wall and projecting low sacristy. These features remain in far LOD.

Source: `src/peregrine/landmarks/top-cities/arctic-cathedral/`. Export: `pnpm build:top-cities-landmarks arctic-cathedral --no-check`. Runtime files: `public/models/buildings/arctic-cathedral-near.glb`, `arctic-cathedral-far.glb`, `arctic-cathedral.json`. Catalog: `prototypes/assets3d/catalog.d/arctic-cathedral.json`.

## Sources and frame

The [official church](https://ishavskatedralen.no/en/om-kirken/) confirms Hovig, the 1965 inauguration, eleven aluminium-coated slabs on each side, the west cross and glass facade and the east mosaic installed in 1972. [Store norske leksikon](https://snl.no/Ishavskatedralen) supplies the 35 m west gable, the cross’s structural role, glass slots, two west entrances and the flat-roof sacristy projecting through the east wall. The current exterior and 1972 glass wall are modeled; the organ and furniture are omitted.

Real metres, +X east, +Y up, +Z south. Origin `[18.9871, 69.6482]` is near the west gable, matching the supplied dossier. Local y=0 is the rigid church footing/entrance level. No sea-level, hill or Mercator stretch is baked into geometry. Geometry is authored across/along the nave and rotated 35.5° about Y into the geographic frame; frontage bears 324.5°, towards Tromsø Bridge. Rotation is already in the GLBs.

Mapped controls on OSM way 395045151: `[18.986814,69.648128]` and `[18.9873736,69.6482665]` describe the front transverse edge (approximately 55° bearing); the opposite long edge has the same bearing. The bay centres progress southeast, perpendicular to that edge. The 12 footprint rings cover all eleven structural building parts and the east sacristy, excluding neighboring garages, houses and the detached parish building. The prepared dossier contains their complete geometry. A membership refresh of [relation 21003810](https://www.openstreetmap.org/relation/21003810) through the shared Overpass helper returned HTTP 403, so the complete individual part geometries were used rather than guessing a relation outer ring.

The mapped church stands on a mound. `terrainPad` requests a median datum bounded by the footprint rings, with three interior reference points and 6 m feathering; `padM=56` covers the east end. This is a placement handoff, not evidence of terrain integration. Plaza stairs and the surrounding hill are omitted.

## Dimensions

| Feature | Modeled dimensions | Basis |
| --- | --- | --- |
| Tall west gable | 35 m | Sourced: Store norske leksikon; OSM 395045151 also gives height 35 |
| Paired A-frame bays | 11 | Sourced: official church, confirmed by eleven mapped parts |
| Roof height sequence west to east | 35, 32.5, 30, 27.5, 25, 22.5, 20, 17.5, 20, 22.5, 25 m | OSM height tags, not a surveyed section |
| Main church length | About 49 m | Mapped part stations 0.1–49 m; modeled shell 0.25–48.7 m including west lean |
| Width | About 28 m west, 12.3 m at the saddle, 17.9 m east | Mapped OSM bay envelopes, simplified into linear tapers |
| Shell section | 0.48 m transverse inset, 0.8 m lower inner apex | Estimated from photographs; closed folded section |
| West slab summit lean | 0.6 m towards the entrance | Estimated; source describes outward tilt |
| Cross | 32.6 m tall, 8 m arm at 25.7 m, 0.48 m section | Estimated from reference front elevation; cross structural role sourced |
| West glazing | 33.5 m top, 25.4 m base width | Estimated within mapped roof section |
| East glazing | 23.6 m top, 16.1 m base width | Estimated, fitted inside the 25 m east bay |
| Sacristy | 10.15 × 4.1 m, 5 m high | Plan/height mapped from way 395048138; roof trim estimated |

## Geometry and materials

Closed lofts produce the two inclined sides of each structural bay, preserving a hollow nave rather than filling a triangular prism. The bay widths taper, reproducing the plan’s narrowing and widening fans. Closed glass ribbons occupy the step between successive roofs; steel strips and tie members articulate them. Near uses raised thin sheet-metal joint quads and fine west mullions; far drops joints and uses fewer mullions while retaining every bay and roof ribbon.

The east glass is an original blue/cyan/amber angular colour field built from closed triangular facets with dark joints: 34 tessellation rows near and 10 far. It approximates the window’s appearance, not Victor Sparre’s figures or composition. No photo, texture, scanned geometry or traced artwork is shipped. The low sacristy partly obscures its bottom as described by the architectural source.

Eight merged materials near: `shell`, `edge`, `seam`, `glass`, `frame`, `blue`, `light`, `glow`. Far has six, merging edge into shell and dropping seam. Both palettes use matching names. `light` and `glow` are the self-lit cyan and amber glazing; white aluminium dims to blue-grey at night. Seam quads are raised 0.18 m vertically, at least 0.05 m normal to these steep roof planes. No separate rim is layered over the structural shell. The west cross stands forward of the glass wall, with its horizontal arm meeting the roof slopes.

## Visual evidence and verification

Reference contact sheet: `tmp/top-cities/arctic-cathedral/refs-sheet.jpg`, read before modeling. Compared photographs: Larry Lamsa’s *Tromsø 2015* (CC BY 2.0), Henrik’s *Arctic Cathedral in Tromsoe* (CC BY 2.5), and Evgenii Salganik’s *Tromsdalen Church West*, *organ* and *mosaic* (CC BY-SA 4.0). Titles, credits and page links are in the catalog; photos remain in ignored scratch.

Inspection output: `tmp/top-cities/shots/arctic-cathedral/`. The procedural near/light sheet covers overview, facade, back, roof, entrance, mosaic detail, side and top plan. It established the eleven-bay saddle silhouette and footprint fit. The first cross was partly obscured by the leaning west slab, so it was moved forward; overlapping shell-edge trim was removed. Exported near/light screenshots confirmed the cross, hollow nave, east glazing and sacristy. A final seam offset correction avoids near-coplanar roof joints.

Final inspected exported sheets: `arctic-cathedral-glb-near-light-sheet.jpg` (all eight views), `arctic-cathedral-glb-near-dark-sheet.jpg` (overview, facade, back, detail), `arctic-cathedral-glb-far-light-sheet.jpg` (overview, facade, back, roof), `arctic-cathedral-glb-far-dark-sheet.jpg` (overview, facade, back, detail). `comparison.jpg` places these GLB views beside the supplied photographic sheet. Source and GLB silhouettes match, the cross reads from the west, all bays remain in far, and the east colour field remains legible at night. Independent reviewer approval remains pending.

Near: **12,640 triangles / 8 draws / 930,404 bytes (908.6 KiB)**. Far: **1,900 triangles / 6 draws / 139,392 bytes (136.1 KiB)**. Costs are measured exported default-scene geometry, not hardware timings. Both stay well inside the building budgets with identical principal bounds and a 35 m top. No removable bridgeLift attributes remain.

Focused tests pin the 35 m height, the eleven observed roof stations, far bounds, grade contacts, the cross ahead of glass, both doors, hollow nave, clerestory ribbon, three east glazing colours, sacristy, mapped-footprint containment and exported source round trip. `node --test src/peregrine/landmarks/top-cities/top-cities.test.js src/peregrine/landmarks/top-cities/arctic-cathedral/arctic-cathedral.test.js` passed all 224 tests, including six landmark-specific tests completing in under one second. `node scripts/asset-catalog.mjs` passed with 198 entries and 374 GLB variants. `.agents/skills/build-3d-city/scripts/qa-metrics.mjs --ids arctic-cathedral --out tmp/top-cities/arctic-cathedral/metrics.json` reports no issues. Logs are `tmp/top-cities/arctic-cathedral/tests.txt`, `catalog-check.txt` and `metrics.json`.

Cityscape: **not tested yet, integration is checked separately**. Full 3D world: **not tested yet, integration is checked separately**. Terrain datum refinement, roads/pad edges, provider replacement, lifecycle, actual Tesla performance and independent review require separate checks. The geometric window pattern, panel section, fine joints and mullions are approximations; no interior, flags, lettering, bells, furnishings or ground clutter is modeled.

## Independent review fix — 2026-10-08

Review identified a flat-topped appearance in oblique near/far views and excessive panel grid lines. Each bay now has a pointed transverse A-frame and a single exposed front ridge tip, with the ridge falling 1.1 m to the rear. The eleven maximum heights and the mapped plan remain intact, including the saddle and three rising east bays. The 1.1 m fall is a visual estimate, not a surveyed dimension. Glazed ribbons now fit the two actual roof heights at each joint; the inner apex is 0.8 m below the outer. Linear triangulation of the tapered shell can differ by up to 0.65 m between symmetric transverse samples; it remains a close planar approximation.

Before: dense vertical/horizontal cladding grid. After: only three broad horizontal sheet courses per inclined panel, no dense vertical grid; near cost drops from 14,344 to 12,640 triangles and 1,038 to 909 KiB. Far retains 1,900 triangles, six draws and about 136 KiB; both LODs use the same revised panel profile. West glass, cross, doors, hollow nave, east abstract mosaic and sacristy are retained.

Two look-fix iterations were used. The first 1.8 m ridge fall flattened the saddle into too continuous a V; the final 1.1 m fall preserves more of the stepping. Inspected exported sheets: `tmp/top-cities/arctic-cathedral/review-fix2/arctic-cathedral.jpg` (the same generic QA views as the independent review, including both LODs beside photo 2) and `arctic-cathedral-glb-near-light-sheet.jpg` (overview/front/back/roof/side), plus near/far dark sheets in that folder; the judged combined final reference/light/dark sheet is `tmp/top-cities/arctic-cathedral/review-fix2/final-comparison.jpg`. REVIEW.md contains no Prepare command; the standard `qa-sheet.mjs --ids arctic-cathedral --out tmp/top-cities/arctic-cathedral/review-fix2` was used to regenerate its equivalent sheet. The key photo is Henrik’s oblique reference in dossier `refs/2.jpg`.

Added an observable raycast regression: every bay must have paired inclined sides more than 6 m below its transverse ridge at 3 m off-axis, and its longitudinal ridge must fall by more than 0.65 m between interior samples in both LODs. Existing height/grade/footprint, cross/doors/nave, clerestory/mosaic and GLB round-trip tests remain. Final asset QA reports zero coplanar pairs, 0.5% backface hits (below the 2% gate) and no budget or artifact issues in `tmp/top-cities/arctic-cathedral/review-fix-metrics.json`. Focused test and catalog logs: `review-fix-tests.txt`, `review-fix-catalog.txt`. Independent re-review remains pending; Cityscape and Full 3D world remain not tested yet, integration is checked separately.
