# Fairmont Hotel Vancouver

Original procedural landmark `fairmont-hotel-vancouver`, 900 West Georgia Street, Vancouver, British Columbia; the third Hotel Vancouver, opened May 28, 1939, designed by Archibald and Schofield. This models the permanent limestone Châteauesque exterior; construction scaffolding in a reference photograph is excluded. Contract: [top-cities landmarks](../top-cities-landmarks.md).

## Identity and sources

The dominant identity is the enormous patinated copper hipped roof over a central limestone tower, two stepped side wings, green shoulder turrets, two rows of dormers, Panorama Roof glazing, a stone chimney/lantern, and Renaissance loggia. Near includes approximate crouching gargoyle groups and projecting cornices; far retains the complete roof, dormers, chimney, loggia, canopy and individual window rows/bays.

Sources read: [Wikipedia: Hotel Vancouver](https://en.wikipedia.org/wiki/Hotel_Vancouver), [Fairmont official hotel page](https://www.fairmont.com/en/hotels/vancouver/fairmont-hotel-vancouver.html), and the supplied OSM dossier `tmp/top-cities/fairmont-hotel-vancouver/osm.json`. The published height/storeys/1939 identity are from Wikipedia; OSM dimensions below are mapped rather than surveyed. Reference-only Commons photographs are listed with authors/licences in the catalog record; photos remain in ignored scratch and are never shipped.

## Dimensions and frame

| Feature | Model | Basis |
| --- | --- | --- |
| Overall tip | 112.47 m | Published height |
| Architectural stone top | 110.64 m | Published architectural height; assigned to chimney cap |
| Hotel floors | 17 published | Facade rows approximate floor rhythm, not a surveyed floor plan |
| Podium / low wings / shoulders / tower | 15 / 40 / 60 / 80 m | OSM outline and parts |
| Green main roof ridge | 105 m | OSM part 360433185 height; steep roof rises 25 m from the mapped 80 m tower (OSM roof:height=30 is inconsistent with these levels) |
| Main roof plan | 35.84 × 20.95 m | Mapped roof ring |
| Shoulder roof apex | 72 m; finial 75 m | OSM 72 m apex; finial estimated |
| Window panes | Near 1.65 × 2.45 m typical; far 2.8 × 3.2 m | Photo estimate, coarser far grid |
| Window pitch | Near ~3.4 m bays / 4.15 m rows | Estimated, resets at setbacks |
| Dormers / loggia / canopy | 16 dormers, 7 loggia arches, 9 m wide canopy with 2 columns | Photo reconstruction, counts/dimensions approximate |

Origin `[-123.12096,49.28384]` is the central hotel structural anchor from the dossier. Local +X east, +Y up, +Z south; y=0 is rigid local grade, with no baked terrain/altitude/stretch. The roof's mapped long-edge control points are `[-123.121273, 49.2838548]` and `[-123.1209196, 49.2836301]`; geometry derives its actual SE axis (~134.3° from north) from those points. West Georgia facade faces ~45.7°. Orientation is already baked into the export; do not rotate it again.

Provider replacement includes outline 139571554 plus all fifteen hotel parts: 360433180–185, 361647572–576 and 361655262–265. Cathedral Place, Christ Church Cathedral and nearby offices are excluded. The final footprint ring is an authored canopy extension: up to 2.6 m beyond the Burrard wall, bounded inside its own small envelope. Footprint containment allows the near cornice's <0.5 m projection. No street or broad plaza slab is drawn.

## Construction and materials

Six merged material meshes per LOD: buff limestone `stone`, subdued green `copper`, dark recessed `glass`, deterministic room `glow` (20% warm at night), muted flat `roof`, and dark `bronze` canopy/finials. Both palettes have identical keys. No textures, scans, external mesh, decoders or compression extensions.

Slab outlines are unions of the mapped building parts. Only exposed terrace differences are capped; facade surfaces tessellate around real window openings with 0.24 m near / 0.60 m far recessed panes and stone reveals. Window mullions are near-only. Dormer/frontispiece/Panorama windows also have cut openings rather than a stone backing plane. Near cornices and gargoyles are omitted in far; all landmark roof features and separated window grids remain. Canopy columns meet its underside at 5.7 m and reach y=0. Short pinnacle members connect to their roof or stone cap.

## Costs and validation

| Export | Triangles | Draws | Bytes | KiB |
| --- | --- | --- | --- | --- |
| Near | 23,132 | 6 | 1,172,752 | 1145.3 |
| Far | 9,303 | 6 | 467,020 | 456.1 |

Budgets: 60,000 triangles / 14 draws / 2.5 MB near; 12,000 / 8 / 500,000 bytes far. Far bounds differ by less than 0.6 m from near in either horizontal size; heights match at 112.47 m. Metrics are exported default-scene counts, not a hardware benchmark.

Checks: landmark tests assert provider ownership, mapped bearing, published height, grade, vertex footprint containment, roof ridge/eave raycasts, chimney cap, separated glazing heights and canopy-column contact against a named canopy surface; a deliberately shortened terminal fails the contact assertion. `qa-metrics.mjs --ids fairmont-hotel-vancouver` reports **ok** (no budget, layered-face, backface, coplanar, window-rhythm or member-end issues). Depth regeneration reports zero dropped cycle edges. The focused conformance suite checks source/export bounds and byte metrics; all three Fairmont conformance checks and all five landmark tests passed. The batch run finished 473/475 passing: unrelated in-progress `high-museum-of-art` exceeded the near triangle cap (76,308), and `adam-toren` had a ready-status/catalog mismatch. `node scripts/asset-catalog.mjs`, `pnpm assets:check` and `pnpm assets:preview` were attempted/retried and blocked by the unregistered `high-museum-of-art-far.glb`; no other builder files were changed. The final own-id depth check passed after regeneration (another concurrent generator temporarily overwrote the entry).

Rebuild: `pnpm build:top-cities-landmarks fairmont-hotel-vancouver --no-check`; regenerate/check with `node scripts/landmark-depth-layers.mjs --ids fairmont-hotel-vancouver` and `--check`. Focused tests: `node --test src/peregrine/landmarks/top-cities/top-cities.test.js src/peregrine/landmarks/top-cities/fairmont-hotel-vancouver/fairmont-hotel-vancouver.test.js`.

## Visual evidence and changes

Read the dossier's `refs-sheet.jpg`, then the exported near/far comparisons at `tmp/top-cities/shots/fairmont-hotel-vancouver/near-comparison.jpg` and `far-comparison.jpg`. These put the Ken Walker and Adam Jones reference photographs beside overview, West Georgia facade, back, above, Burrard entrance and crown detail, in light and dark themes. All final images use exported GLBs. Also read `fairmont-hotel-vancouver-glb-near-light-top.png` (mapped footprint/orientation) and `fairmont-hotel-vancouver-procedural-near-light-sheet.jpg` (source overview/detail); source and exported appearance agree.

Changes after inspection: replaced close dormer/frontispiece glass overlays with cut recessed openings to remove a material cycle; added stepped cornices and supported Burrard canopy; corrected overlapping regular windows crossing the loggia arch row; restored the roof glazing ribbon visible in photographs. Far simplifies facade bays/rows and drops cornices to stay under 500 KB. The final loggia shows seven clean arches; the green roof and discrete rows survive distance and night viewing.

## Approximations and remaining gates

Stone carving is reduced to attached geometric animal silhouettes; relief panels, exact gargoyle anatomy, fine roof seams, precise lettering, decorative balustrades and interiors are omitted. Dormer arrangement, window counts and frontispiece dimensions are photo estimates; the roof ribbon is a segmented representation. Wings follow OSM height/plan, which do not encode every subtle setback. Night window illumination is a fixed approximate subset, without real illumination casts. The roof/stone color and silhouette were judged against the photographs; material response in the shared runtime shader still needs app review.

Cityscape: **not tested yet, integration is checked separately**. Full 3D world: **not tested yet, integration is checked separately**. Inspector readiness does not establish provider masking, road clearance, rigid DEM foundation/pad continuity, zoom transitions or load/toggle/reanchor lifecycle. No app server, runtime layer, shared registry or deployment was changed by this worker.

## Reference rights

Compared only: Adam Jones, “Facade of Hotel Vancouver - Vancouver - BC - Canada (37269677994) (2)” (CC BY-SA 2.0); Ken Walker, “Hotel vanc 2007” (CC BY 2.5); Xicotencatl, “Hotel Vancouver 01” (CC BY-SA 4.0); dronepicr, “Luxury Fairmont Hotel in Vancouver (44723867431)” and “Fairmont Hotel Vancouver (42914514460)” (CC BY 2.0); TravelingOtter, “Fairmont Vancouver Hotel (2651640206)” (CC BY-SA 2.0). Exact Commons links are in `prototypes/assets3d/catalog.d/fairmont-hotel-vancouver.json`. Geometry is original; mapped geographic data © OpenStreetMap contributors, ODbL 1.0.

## Independent-review correction, 2026-10-12

Sharpened both dormer rows with tall pointed copper caps and attached sill cornices; replaced the flat triangular frontispiece surface with a closed stepped stone pediment, paired attached pilasters and tiered cornices with copper coping. Both LODs keep the refined outline. Shared vertices are merged locally to recover far byte headroom without removing window rhythm or roof features.

Inspected exported near/light and far/dark sheets at `tmp/top-cities/shots/fairmont-hotel-vancouver/review-fix-final/fairmont-hotel-vancouver-glb-{near-light,far-dark}-sheet.jpg` against the dossier references and b6a review. The sheets show the corrected feature, opposite facades and complete main silhouette; ornament remains a photographic approximation. No more than two look-fix rounds were used.

Current validation supersedes earlier concurrent-build exceptions: the combined registry and four-landmark run passes **506/506 tests**, including the graded-lawn and pointed-dormer regressions. Exported geometry QA reports all four on budget with no issues. Depth regeneration/check passes with **zero dropped cycle edges**; the shared generated table may be overwritten by concurrent workers, so the lead regenerates all IDs before commit. `node scripts/asset-catalog.mjs` validates 286 records / 560 GLB variants and `pnpm assets:preview` builds the ignored local catalog.

Cityscape and Full 3D world remain **not tested by this correction worker**. The independent review inspected pre-correction app captures, but new unobstructed app shots, shared runtime shading, provider ownership and Jefferson's graded perimeter/terrain-pad contact are the lead's required recapture and re-review gates.
