# Stade Mayol

Original procedural permanent exterior, 2026-11-10.

## Identity and evidence

Dense city-centre rugby ground with four rectangular stands, open playing field, pale concrete cantilever roofs, external inclined rakers and corner floodlights.

- [Official visitor guide: four named stands](https://www.provencemed.com/en/toulon-la-seyne/our-must-haves/rugby-at-stade-mayol/)
- [Official club access plan](https://rctoulon.com/wp-content/uploads/2020/12/RCT20_21_Acce%CC%80s_Loges.pdf)
- [OSM mapped footprint and control points](https://www.openstreetmap.org/way/145362031)
- [OSM mapped footprint and control points](https://www.openstreetmap.org/way/145379585)
- [OSM mapped footprint and control points](https://www.openstreetmap.org/way/372051008)
- [OSM mapped footprint and control points](https://www.openstreetmap.org/way/1357788059)
- [OSM mapped footprint and control points](https://www.openstreetmap.org/way/1357788060)
- [OSM mapped footprint and control points](https://www.openstreetmap.org/way/1357788061)
- [OSM mapped footprint and control points](https://www.openstreetmap.org/way/1357788063)
- [OSM mapped footprint and control points](https://www.openstreetmap.org/way/1357788064)
- [OSM mapped footprint and control points](https://www.openstreetmap.org/way/1357788065)
- [Fichier:Stade Mayol Toulon 6.jpg — Chabe01 — CC BY-SA 4.0; comparison only](https://commons.wikimedia.org/wiki/File:Stade_Mayol_Toulon_6.jpg)
- [Fichier:Stade mayol.jpg — 474D6F756C617264 — CC BY-SA 3.0; comparison only](https://commons.wikimedia.org/wiki/File:Stade_mayol.jpg)

Reference images are comparison-only and retained under ignored `tmp/france-southeast/stade-mayol-toulon/refs/`; no photograph, traced mesh, logo or lettering ships. Photos selected: 1, 4. Historical photographs are used only where the permanent exterior is unchanged; temporary scaffolding, event fit-outs and unrelated pictures are excluded.

## Frame and dimensions

Origin: [5.93652225, 43.1190014]. Local y=0 is the rigid exterior foundation plane; +X east, +Y up, +Z south, real metres. Rotation -2.36268811 radians is baked once using mapped controls [[5.9374,43.1191494],[5.9363087,43.1183631]] (way 26811055). No terrain or Mercator stretch is authored. OSM ways 145362031, 145379585, 372051008, 1357788059, 1357788060, 1357788061, 1357788063, 1357788064, 1357788065 define the provider replacement envelope, not an arbitrary bounding rectangle; nearby roads and buildings are not owned.

| Element | Dimension | Evidence |
| --- | --- | --- |
| Outer stand geometry | Nine OSM stand and loge ways | Includes mapped corner extensions |
| Playing surface | approximately 126 × 75 m | Mapped pitch extent, not regulation-line survey |
| Roof / floodlight tops | approximately 23 / 42 m | Exterior photo estimates |

## Modeling choices and limits

Stand heights and 42 m floodlight tips are visual estimates; no published surveyed height found. Current OSM stand/corner geometry is used rather than an obsolete oval bowl. All club branding, lettering and advertising omitted.



Both LODs keep the identifying silhouette, major openings and facade rhythm. Foundations are rigid, not terrain-draped; any modeled ground surface is at least 0.10 m above the local datum. No app terrain certification is implied.

## Reproduction and QA

- Build: `pnpm build:top-cities-landmarks stade-mayol-toulon`.
- Focused test: `node --test src/peregrine/landmarks/top-cities/stade-mayol-toulon/stade-mayol-toulon.test.js`.
- Metrics: `node .agents/skills/build-3d-city/scripts/qa-metrics.mjs --ids stade-mayol-toulon --out tmp/france-southeast/stade-mayol-toulon/metrics.json`.
- Exported reference contact sheet: `tmp/france-southeast/sheets/stade-mayol-toulon.jpg`.
- Red mapped-footprint top view: `tmp/france-southeast/shots/stade-mayol-toulon/`.
- Depth: `node scripts/landmark-depth-layers.mjs --ids stade-mayol-toulon --check`.

| LOD | Triangles | Draws | Bytes |
| --- | ---: | ---: | ---: |
| near | 4748 | 7 | 97632 |
| far | 2804 | 7 | 64860 |

Author self-review: identifying features, proportions, palette, near/far openings and foundation contact inspected against the credited exterior references; red-ring mapped plan checked. Deterministic metrics: zero remaining flags; depth graph: no unresolved cycles. Focused structural tests and exported round-trip conformance pass. Model readiness: ready. Independent review is pending; author self-review is not an independent verdict.

**Cityscape: not tested. Full 3D world: not tested.** No app server was started. DEM/pad boundaries, provider lifecycle, live shared shading and hardware performance remain unverified.

