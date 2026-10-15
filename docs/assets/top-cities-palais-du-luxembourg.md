# Palais du Luxembourg (Sénat), Paris

Original procedural model of the present palace at 15 rue de Vaugirard, including the garden extension, the open cour d’honneur, six principal slate-roofed pavilions, the street entrance, two axial domes, and the short attached west return. The neighboring Petit Luxembourg, garden basin, garden furniture and interiors are excluded.

The [Sénat’s official history](https://www.senat.fr/connaitre-le-senat/patrimoine/lhistoire-du-palais-du-luxembourg.html) dates the Salomon de Brosse project for Marie de Médicis to 1615–1631 and explains Gisors’s nineteenth-century extension of the south façade by thirty metres. The [Wikipedia overview](https://en.wikipedia.org/wiki/Luxembourg_Palace) describes the Florentine/Pitti influence, later alterations and Senate use. The model represents this enlarged palace rather than the seventeenth-century engraving alone.

## Frame and measurements

Real metres, east/up/south, rigid local y=0. Origin `[2.33722,48.84833]`. Palace axes are baked 2° into the geometry, with the central garden axis approximately 5 m east of that origin. The layer must not rotate the GLB again. The two mapped garden-front control points `[2.3375985,48.8478732]` and `[2.3378781,48.8478667]` give a façade direction approximately 92°, hence the south normal at 182°. Projection uses WGS84 spherical Mercator divided by local latitude stretch before export.

| Feature | Metres | Basis |
| --- | ---: | --- |
| Great pavilion eaves / roof | 23.6 / 31.2 | OSM building parts |
| Street corner roof | 30.8 | OSM building parts |
| Street dome / lantern | 25.7 / 28.8 | OSM building parts |
| Garden dome / lantern | 28.2 / 31.4 | OSM building parts |
| Mast / tallest chimney top | 33.8 / 34.595 | Photo estimates; chimneys raised 2 m after review |
| Garden front width | about 90 | Mapped OSM envelope |
| Main palace depth | about 150 | Mapped OSM envelope |
| Main façade bay spacing | about 5.8–6.5 | Photo estimate |

Ownership is OSM [relation 975955](https://www.openstreetmap.org/relation/975955), outer way 62848446, plus every roof, column and `building:part` way enumerated in `footprint.js`. The outer ring is retained exactly, including the west street return; the neighboring Petit Luxembourg is outside ownership. The large cour d’honneur is open; the two small service lightwells are simplified with the surrounding roof ranges. A median bounded terrain pad is declared, with separate live verification pending.

## Authored geometry

Pale warm stone is deliberately subdued, slate is blue-grey, windows are dark desaturated glass; a small repeated subset becomes warm at night. Window panes are separate outward faces in both LODs. Near has arched ground openings, framed upper windows, mullions, rusticated piers, stone string courses, dormers, chimney crowns, lead meridians, clock faces and grouped draped allegorical figures. Far removes fine relief and mullions while retaining all primary roofs, the open courtyard, domes and lanterns, portal recess and discrete window rows. Compatible elements are batched into seven materials in both LODs, including a slightly lighter ashlar trim colour.

The source is original and self-contained. Roof geometry, façade rows, clocks, sculpture gestures and chimney positions are estimates based on photographs; the allegories and heraldry are intentionally simplified, not reproductions of specific sculpted faces. Small service/lightwell details are simplified. No photo, texture, scan or third-party mesh is exported. The clock hands are approximate and flag cloth is omitted.

## Reference rights

Reference-only files remain in ignored `tmp/top-cities/palais-du-luxembourg/refs/`. The catalog lists checked Commons source pages and credits: JLPC, *Paris Palais du Luxembourg façade s printemps 2014*, CC BY-SA 3.0; xiquinhosilva, *Palais du Luxembourg, Paris (38453204755) (cropped)*, CC BY 2.0; Bretwa, *Luxembourg Palace - 2018-04-07*, CC BY-SA 4.0; Benh LIEU SONG / Sanchezn, *Palais Luxembourg Sunset Edit*, CC BY-SA 3.0; Pierre Lepautre, historical palace engraving, public domain; and Faxa, *Palais du Luxembourg entrée rue de Vaugirard*, CC BY-SA 3.0. The dossier’s interior clock photo is not an exterior design source. Mapped data © OpenStreetMap contributors, ODbL 1.0.

## Verification evidence

The dossier `refs-sheet.jpg` and the additional street-entry photo `refs/7.jpg` were visually inspected. The first procedural sheet at `tmp/top-cities/shots/palais-du-luxembourg/first/palais-du-luxembourg-procedural-near-light-sheet.jpg` exposed blank north pavilion façades caused by finely stepped mapped wall segments, and excessive repeated trim cost. Pavilion walls were regularized slightly inside their mapped outlines, full three-bay window fronts added, vertical orders given return faces, and far trim simplified without removing window rows.

The final comparison sheet was visually judged at `tmp/top-cities/shots/palais-du-luxembourg/final/export-reference-contact.jpg`: reference photos next to exported near/light garden front, north front, roof, street entrance and garden detail; near/dark front and entrance; far/light front, north and roof; far/dark front, north and entrance. The roof silhouette, pale stone/slate balance, recessed entry and open courtyard remain consistent between LODs; fine classical carving is simplified. The final mechanical corrections cut two overlapping central window grids, separated glazing mullions into their own material, moved the clock clear of a cornice, and brought the portico columns and octagonal entry cap inside the replacement envelope plus its provider tolerance. Every vertex is inside the mapped ring or within the existing 0.8 m provider slack (maximum 0.782 m near, 0.607 m far). Cityscape: **not tested yet**. Full 3D world: **not tested yet**. Inspector sheets establish asset appearance only; shared vertex-shaded app rendering, provider replacement, terrain refinement, mode/lifecycle changes and real hardware are for the lead’s separate integration pass. No shared runtime modules were edited.

## Current measured costs and checks

| Export | Triangles | Draws | Bytes | KiB |
| --- | ---: | ---: | ---: | ---: |
| Near | 47,110 | 7 | 2,287,284 | 2,234 |
| Far | 7,036 | 7 | 315,888 | 308 |

- `node --test src/peregrine/landmarks/top-cities/top-cities.test.js src/peregrine/landmarks/top-cities/palais-du-luxembourg/palais-du-luxembourg.test.js`: **841 passed, zero failed**; the landmark-specific six tests take under one second. They pin six pavilion heights, both domed axes, courtyard voids, recessed portal, separate garden window bays, both lanterns’ named plinth/cap contacts with a deliberately shortened-end rejection, grade, footprint slack and matching LOD bounds.
- `node scripts/asset-catalog.mjs`: **valid, 406 entries / 800 GLB variants** at verification time.
- `qa-metrics.mjs --ids palais-du-luxembourg --out tmp/top-cities/palais-du-luxembourg/metrics.json`: **ok**, zero layered-face area, zero coplanar pairs and no member/window-rhythm flags; near exterior back-face sweep 1.4% (below the 2% screen).
- `node scripts/landmark-depth-layers.mjs --ids palais-du-luxembourg`: **zero dropped cycle edges**; `--ids palais-du-luxembourg --check` also passed. The shared generated file may be rewritten by concurrent builders; the lead should regenerate all finished IDs before committing.

The sole shared-file change is the authorized generated `src/peregrine/landmarks/depth-layers.js`. Public exports are texture-free GLB 2.0 with no decoder extensions; all authored modules import only Three.js, the shared asset builder and files in this landmark folder. Independent visual review and unobstructed app captures in both modes remain pending with the lead.

## Review corrections — g14ar, 2026-10-15

The g14a review identified the narrow round garden drum, weak French-window proportions and classical relief, missing pavilion attic pediments and short chimneys, and dark slate. The garden drum and its hip were replaced by four curved slate faces on an approximately 11.5 × 9.2 m square-plan/rectangular shell, springing at the central pavilion's 21.1 m eaves and reaching 28.2 m. A broad segmental stone pediment and pale clock dial now sit below it; the garden facade has three distinct bays. The smaller street-side circular drum remains as in the reference. Upper panes are now approximately 1.9 × 4.8 m on the principal storeys and 1.5 × 2.8 m on the low attic rows. Pavilion pilasters have projecting rusticated blocks, with up to 0.73 m total relief; storey courses project 0.58 m in near. Their subtly lighter trim and return faces preserve visible articulation. All six great pavilions receive triangular attic pediments and paired chimney stacks raised 2 m. Slate is now #5d6873.

Two exported look iterations were judged against the dossier sheet. Final GLB sheets are `tmp/top-cities/shots/palais-du-luxembourg/g14ar-2/palais-du-luxembourg-glb-{near,far}-{light,dark}-sheet.jpg`; they cover the garden front/detail, north front, roof and street entry. The broad dome, taller window rhythm, attic pediments and lighter roof now survive the far view. Mechanical depth fixes removed duplicate central facade trims and separated the glazing bars from their stone surrounds by 0.21 m after QA found two near-coplanar contacts. The metric window median includes individual arch fan triangles; the observable pane sizes above and the raycast test establish the tall upper windows.

Cityscape: **verified for static near/street appearance and visible replacement/ground contact only**. Full 3D world: **verified for static near/street appearance and visible replacement/ground contact only**. Evidence: `tmp/top-cities/palais-du-luxembourg/g14ar/app/{city,world}/palais-du-luxembourg-{near,street}.png` and adjacent `report.json`; all four report loaded/active near geometry with no outstanding tile downloads. Both captures use Protomaps tiles from tiles.codriver.io, with Terrarium DEM enabled in world, from an independent `/tmp/codriver-palais-g14ar-*` bundle on slot L (baseline commit `d2ca2e0d98c92bf53524bc011833e97f17036363`, uncommitted landmark corrections, source hash `43ab15f3c442`, captured 2026-10-15). The shared public app bundles were not rebuilt. Servers were stopped by their recorded PIDs. Terrain refinement, lifecycle, failures, reanchoring, night app rendering and hardware remain **not tested**; independent visual re-review remains required. Sculpture likenesses and fine heraldic carving remain approximations to hold the budget.

Current asset QA: `tmp/top-cities/palais-du-luxembourg/g14ar-metrics.json`; no issue flags, no layered faces, no depth-cycle drops. The new regression raycasts distinguish the four broad curved dome corners from the removed circular cap, check tall French panes and tall chimneys in both LODs, and retain the courtyard, portal and named lantern contacts. Catalog validation, `pnpm assets:check` and `pnpm assets:preview` passed; local preview output is ignored. The authorized generated depth table must be regenerated for all completed IDs by the lead before committing.
