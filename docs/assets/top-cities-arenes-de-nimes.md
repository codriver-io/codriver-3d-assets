# Arènes de Nîmes

Original procedural permanent exterior, 2026-11-10.

## Identity and evidence

Roman amphitheatre with sixty genuine open arcades on each of two complete elliptical tiers, engaged columns, continuous cornices and an open stepped seating bowl.

- [City of Nîmes: 133 × 101 m, 21 m high, sixty bays](https://www.nimes.fr/que-faire-a-nimes/patrimoine/les-monuments-romains/les-arenes-de-nimes)
- [Official arena heritage and visitor site](https://www.arenes-nimes.com/)
- [OSM mapped footprint and control points](https://www.openstreetmap.org/way/157160090)
- [Fichier:Nîmes-Arènes-20130923.jpg — Daniel VILLAFRUELA. — CC BY-SA 3.0; comparison only](https://commons.wikimedia.org/wiki/File:N%C3%AEmes-Ar%C3%A8nes-20130923.jpg)
- [File:Arenes de Nimes Alt 1.jpg — Krzysztof Golik, edited by Janke — CC BY-SA 4.0; comparison only](https://commons.wikimedia.org/wiki/File:Arenes_de_Nimes_Alt_1.jpg)

Reference images are comparison-only and retained under ignored `tmp/france-southeast/arenes-de-nimes/refs/`; no photograph, traced mesh, logo or lettering ships. Photos selected: 3, 10. Historical photographs are used only where the permanent exterior is unchanged; temporary scaffolding, event fit-outs and unrelated pictures are excluded.

## Frame and dimensions

Origin: [4.359621349999999, 43.83488965]. Local y=0 is the rigid exterior foundation plane; +X east, +Y up, +Z south, real metres. Rotation 0.55867640 radians is baked once using mapped controls [[4.358908,43.8345776],[4.3603249,43.8352165]] (way 157160090). No terrain or Mercator stretch is authored. OSM ways 157160090 define the provider replacement envelope, not an arbitrary bounding rectangle; nearby roads and buildings are not owned.

| Element | Dimension | Evidence |
| --- | --- | --- |
| Outer ellipse | 133 × 101 m | City of Nîmes |
| Maximum cornice height | 21 m | City of Nîmes |
| Arcades | 60 per tier, two tiers | City of Nîmes |
| Arena floor | approximately 69.6 × 38.4 m | Historic plan approximation |

## Modeling choices and limits

Ellipse follows mapped antipodal control points; bay intervals use equal perimeter spacing. Individual arch and cornice dimensions are simplified from exterior photos, not a masonry survey. Temporary event equipment, fencing and all lettering omitted. Dossier suggestions showing Rome, Pula and Verona were explicitly rejected.



Both LODs keep the identifying silhouette, major openings and facade rhythm. Foundations are rigid, not terrain-draped; any modeled ground surface is at least 0.10 m above the local datum. No app terrain certification is implied.

## Reproduction and QA

- Build: `pnpm build:top-cities-landmarks arenes-de-nimes`.
- Focused test: `node --test src/peregrine/landmarks/top-cities/arenes-de-nimes/arenes-de-nimes.test.js`.
- Metrics: `node .agents/skills/build-3d-city/scripts/qa-metrics.mjs --ids arenes-de-nimes --out tmp/france-southeast/arenes-de-nimes/metrics.json`.
- Exported reference contact sheet: `tmp/france-southeast/sheets/arenes-de-nimes.jpg`.
- Red mapped-footprint top view: `tmp/france-southeast/shots/arenes-de-nimes/`.
- Depth: `node scripts/landmark-depth-layers.mjs --ids arenes-de-nimes --check`.

| LOD | Triangles | Draws | Bytes |
| --- | ---: | ---: | ---: |
| near | 36476 | 2 | 555148 |
| far | 11036 | 2 | 207488 |

Author self-review: identifying features, proportions, palette, near/far openings and foundation contact inspected against the credited exterior references; red-ring mapped plan checked. Deterministic metrics: zero remaining flags; depth graph: no unresolved cycles. Focused structural tests and exported round-trip conformance pass. Model readiness: ready. Independent review is pending; author self-review is not an independent verdict.

**Cityscape: not tested. Full 3D world: not tested.** No app server was started. DEM/pad boundaries, provider lifecycle, live shared shading and hardware performance remain unverified.

