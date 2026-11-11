# Tour Royale de Toulon

Original procedural permanent exterior, 2026-11-10.

## Identity and evidence

Low circular Renaissance cannon fort, with a battered sea-facing base, open gun ports, a lower southern terrace, higher northern half-ring and small terracotta-roofed accommodation.

- [City of Toulon: 60 m diameter and 7 m walls](https://toulon.fr/patrimoine-de-caractere)
- [Var Provence Cruise Club: approximately 20 m maximum height](https://www.varprovence-cruise.com/cultural-heritage/la-tour-royale/)
- [Regional heritage inventory, architecture and historical plans](https://dossiersinventaire.maregionsud.fr/dossier/IA83001612)
- [OSM mapped footprint and control points](https://www.openstreetmap.org/way/27087402)
- [Fichier:Tour Royale Toulon 1.JPG — SiefkinDR — CC BY-SA 3.0; comparison only](https://commons.wikimedia.org/wiki/File:Tour_Royale_Toulon_1.JPG)
- [Fichier:Tour royale.jpg — author not supplied by Commons metadata — CC BY-SA 2.0 fr; comparison only](https://commons.wikimedia.org/wiki/File:Tour_royale.jpg)

Reference images are comparison-only and retained under ignored `tmp/france-southeast/tour-royale-toulon/refs/`; no photograph, traced mesh, logo or lettering ships. Photos selected: 2, 4. Historical photographs are used only where the permanent exterior is unchanged; temporary scaffolding, event fit-outs and unrelated pictures are excluded.

## Frame and dimensions

Origin: [5.925788799999999, 43.10272485]. Local y=0 is the rigid exterior foundation plane; +X east, +Y up, +Z south, real metres. Rotation 0.00238194 radians is baked once using mapped controls [[5.9254438,43.1027075],[5.9261338,43.1027087]] (way 27087402). No terrain or Mercator stretch is authored. OSM ways 27087402 define the provider replacement envelope, not an arbitrary bounding rectangle; nearby roads and buildings are not owned.

| Element | Dimension | Evidence |
| --- | --- | --- |
| Nominal outer diameter | 60 m | City of Toulon |
| Wall thickness | approximately 7 m | City of Toulon |
| Highest fortification | approximately 20 m | Official cruise tourism description |

## Modeling choices and limits

Mapped outer ring is approximately 56 × 54 m while published nominal diameter is 60 m; the model uses a 60 m battered base and mapped east-west control alignment. Terrace and roof subdivisions are visual estimates. The rigid y=0 datum is the lowest exterior masonry footing, not sea level; no water or surrounding terrain is baked.



Both LODs keep the identifying silhouette, major openings and facade rhythm. Foundations are rigid, not terrain-draped; any modeled ground surface is at least 0.10 m above the local datum. No app terrain certification is implied.

## Reproduction and QA

- Build: `pnpm build:top-cities-landmarks tour-royale-toulon`.
- Focused test: `node --test src/peregrine/landmarks/top-cities/tour-royale-toulon/tour-royale-toulon.test.js`.
- Metrics: `node .agents/skills/build-3d-city/scripts/qa-metrics.mjs --ids tour-royale-toulon --out tmp/france-southeast/tour-royale-toulon/metrics.json`.
- Exported reference contact sheet: `tmp/france-southeast/sheets/tour-royale-toulon.jpg`.
- Red mapped-footprint top view: `tmp/france-southeast/shots/tour-royale-toulon/`.
- Depth: `node scripts/landmark-depth-layers.mjs --ids tour-royale-toulon --check`.

| LOD | Triangles | Draws | Bytes |
| --- | ---: | ---: | ---: |
| near | 3596 | 4 | 68916 |
| far | 2540 | 4 | 52532 |

Author self-review: identifying features, proportions, palette, near/far openings and foundation contact inspected against the credited exterior references; red-ring mapped plan checked. Deterministic metrics: zero remaining flags; depth graph: no unresolved cycles. Focused structural tests and exported round-trip conformance pass. Model readiness: ready. Independent review is pending; author self-review is not an independent verdict.

**Cityscape: not tested. Full 3D world: not tested.** No app server was started. DEM/pad boundaries, provider lifecycle, live shared shading and hardware performance remain unverified.

