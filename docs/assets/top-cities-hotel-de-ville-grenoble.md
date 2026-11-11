# Hôtel de Ville de Grenoble

Original procedural permanent exterior, 2026-11-10.

## Identity and evidence

Novarina’s modernist civic complex: broad concrete courtyard podium, glazed office blade and deep cantilevered roof cap.

- [Grenoble heritage: Novarina modernist city hall](https://www.grenoble-patrimoine.fr/element/173/595-hotel-de-ville.htm)
- [Historical description and dimensional estimates](https://fr.wikipedia.org/wiki/Hôtel_de_ville_de_Grenoble)
- [OSM mapped footprint and control points](https://www.openstreetmap.org/way/4814132)
- [OSM mapped footprint and control points](https://www.openstreetmap.org/way/31342336)
- [OSM mapped footprint and control points](https://www.openstreetmap.org/way/236256896)
- [Fichier:Hôtel de ville de Grenoble depuis La Bastille.jpg — Jean-Paul Corlin — CC BY-SA 4.0; comparison only](https://commons.wikimedia.org/wiki/File:H%C3%B4tel_de_ville_de_Grenoble_depuis_La_Bastille.jpg)
- [File:City hall of Grenoble - Hôtel de ville de Grenoble.jpg — Sami Mlouhi — CC BY-SA 4.0; comparison only](https://commons.wikimedia.org/wiki/File:City_hall_of_Grenoble_-_H%C3%B4tel_de_ville_de_Grenoble.jpg)

Reference images are comparison-only and retained under ignored `tmp/france-southeast/hotel-de-ville-grenoble/refs/`; no photograph, traced mesh, logo or lettering ships. Photos selected: 1, 3. Historical photographs are used only where the permanent exterior is unchanged; temporary scaffolding, event fit-outs and unrelated pictures are excluded.

## Frame and dimensions

Origin: [5.7364411, 45.18644215]. Local y=0 is the rigid exterior foundation plane; +X east, +Y up, +Z south, real metres. Rotation -1.05899614 radians is baked once using mapped controls [[5.7367634,45.1868414],[5.7370924,45.1864286]] (way 4814132). No terrain or Mercator stretch is authored. OSM ways 4814132, 31342336, 236256896 define the provider replacement envelope, not an arbitrary bounding rectangle; nearby roads and buildings are not owned.

| Element | Dimension | Evidence |
| --- | --- | --- |
| Overall tower | 46.5 m | OSM building part 236256896; published overall-height estimate |
| Podium | 9.5 m | Two monumental exterior levels, photo estimate; aggregate OSM level tags ambiguous |
| Footprint and open courtyard | OSM surveyed plan | Outer way 4814132 and inner way 31342336 |

## Modeling choices and limits

Published descriptions disagree between about 40 m for the tower volume and 46.5 m overall; 46.5 m is adopted as the OSM estimated total, not a survey. Podium two-level height 9.5 m follows the exterior photos rather than the ambiguous aggregate five-level OSM tag; glazing and roof overhangs are photo-calibrated approximations.



Both LODs keep the identifying silhouette, major openings and facade rhythm. Foundations are rigid, not terrain-draped; any modeled ground surface is at least 0.10 m above the local datum. No app terrain certification is implied.

## Reproduction and QA

- Build: `pnpm build:top-cities-landmarks hotel-de-ville-grenoble`.
- Focused test: `node --test src/peregrine/landmarks/top-cities/hotel-de-ville-grenoble/hotel-de-ville-grenoble.test.js`.
- Metrics: `node .agents/skills/build-3d-city/scripts/qa-metrics.mjs --ids hotel-de-ville-grenoble --out tmp/france-southeast/hotel-de-ville-grenoble/metrics.json`.
- Exported reference contact sheet: `tmp/france-southeast/sheets/hotel-de-ville-grenoble.jpg`.
- Red mapped-footprint top view: `tmp/france-southeast/shots/hotel-de-ville-grenoble/`.
- Depth: `node scripts/landmark-depth-layers.mjs --ids hotel-de-ville-grenoble --check`.

| LOD | Triangles | Draws | Bytes |
| --- | ---: | ---: | ---: |
| near | 13068 | 3 | 253292 |
| far | 4992 | 3 | 98844 |

Author self-review: identifying features, proportions, palette, near/far openings and foundation contact inspected against the credited exterior references; red-ring mapped plan checked. Deterministic metrics: zero remaining flags; depth graph: no unresolved cycles. Focused structural tests and exported round-trip conformance pass. Model readiness: ready. Independent review is pending; author self-review is not an independent verdict.

**Cityscape: not tested. Full 3D world: not tested.** No app server was started. DEM/pad boundaries, provider lifecycle, live shared shading and hardware performance remain unverified.


## Independent-review correction, 2026-11-11

Reduced far detail from 9,280 to 4,992 triangles using single outward-facing recessed window panes, seven separate window bays on each of all twelve office rows, coarser podium bays and removal of a hidden roof slab; both broad facades, open court, portico and cantilevered cap survive. Near geometry and the documented 40/46.5 m height estimate are unchanged.

These photographic authoring targets are estimates, not surveyed dimensions. Re-exported both LODs; focused structural tests, deterministic metrics (zero remaining flags) and depth check pass. Fresh contact sheet: `tmp/batch/fixes/sheets/hotel-de-ville-grenoble.jpg`. Author compared the corresponding SW and NE near/far faces: silhouette, openings, window/arcade rows and structural contacts are retained without blank replacement facades. Independent re-review remains pending; **Cityscape: not tested; Full 3D world: not tested**.

## Courtyard winding regression closure, 2026-11-11

Corrected only the far courtyard panes: triangle winding and normals now point into the court on all four inner walls. Each wall has two coarse panes / four front-facing glass triangles, verified both in procedural source and the decoded exported GLB using front-face-only rays from the courtyard center. The same test confirms all twelve rows and seven two-triangle panes per row on both broad tower faces. Near geometry is byte-identical; far stays at 4,992 triangles / 3 draws / 98,844 bytes.

The regression test first failed on the previous export (no front-facing courtyard glass) and now passes for source and exported far GLB. Focused and registry tests, deterministic metrics (zero issues), depth check and assets:check pass. Exactly one new contact sheet was rendered and corresponding near/far faces inspected: `tmp/batch/courtyard/sheets/hotel-de-ville-grenoble.jpg`. The passing test and measured counts satisfy the lead-specified standalone-review closure evidence; **Cityscape: not tested; Full 3D world: not tested**. No other landmark changed.

