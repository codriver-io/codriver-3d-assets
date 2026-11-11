# Stade des Alpes

Original procedural permanent exterior, 2026-11-10.

## Identity and evidence

Rounded rectangular football and rugby stadium with a continuous upward-curving pale glass canopy, open central field, bowl of individual seat terraces, radial roof ribs and horizontal timber-toned outer cladding.

- [Stadium operator: permanent venue identity](https://stadedesalpes.fr/)
- [Wikipedia stadium identity and photo sources](https://fr.wikipedia.org/wiki/Stade_des_Alpes)
- [OSM stadium building multipolygon, height 23 m](https://www.openstreetmap.org/relation/80400)
- [OSM mapped footprint and control points](https://www.openstreetmap.org/way/25532413)
- [File:Stade des Alpes @ Grenoble (7979263247).jpg — Guilhem Vellut from Annecy, France — CC BY 2.0; comparison only](https://commons.wikimedia.org/wiki/File:Stade_des_Alpes_@_Grenoble_(7979263247).jpg)
- [File:Fort Bastille, Grenoble - 3.jpg — Nanzig — CC BY-SA 4.0; comparison only](https://commons.wikimedia.org/wiki/File:Fort_Bastille,_Grenoble_-_3.jpg)

Reference images are comparison-only and retained under ignored `tmp/france-southeast/stade-des-alpes/refs/`; no photograph, traced mesh, logo or lettering ships. Photos selected: 5, 6. Historical photographs are used only where the permanent exterior is unchanged; temporary scaffolding, event fit-outs and unrelated pictures are excluded.

## Frame and dimensions

Origin: [5.74012715, 45.18743405]. Local y=0 is the rigid exterior foundation plane; +X east, +Y up, +Z south, real metres. Rotation 0.50971337 radians is baked once using mapped controls [[5.7399081,45.1866092],[5.7403787,45.1867946]] (way 25532413). No terrain or Mercator stretch is authored. OSM ways 25532413 define the provider replacement envelope, not an arbitrary bounding rectangle; nearby roads and buildings are not owned.

| Element | Metres | Basis |
| --- | ---: | --- |
| Rotated outer envelope | about 190 × 143 | OSM outer ring |
| Maximum roof | 23 | OSM height |
| Field | 105 × 68 | Regulation playing field; local estimate of placement |
| Roof outer spring / crown | 11 / 23 | Photo estimate |

## Modeling choices and limits

Roof section, seating rake, gate spacing and glazing rhythm estimated against exterior and aerial references; no as-built structural claim. Canopy uses muted opaque glass-like panels rather than a photograph or runtime-dependent transparency. Seat rows are terraces, not individually modeled seats; signs, logos, crowds, temporary equipment and surrounding park omitted.

The roof opening remains a true hole in both LODs. Both LODs keep the rolled eaves, radial grid, separate entrance bays, timber-toned lower band and stepped seat bowl. The mapped outer ring, rather than a generic ellipse, sets the perimeter. Relation 80400 shares its outer ring with leisure way 25532413; inner way 25532414 is retained in geographic provenance, not used as an ownership exclusion that would expose provider extrusions.

Both LODs keep the identifying silhouette, major openings and facade rhythm. Foundations are rigid, not terrain-draped; any modeled ground surface is at least 0.10 m above the local datum. No app terrain certification is implied.

## Reproduction and QA

- Build: `pnpm build:top-cities-landmarks stade-des-alpes`.
- Focused test: `node --test src/peregrine/landmarks/top-cities/stade-des-alpes/stade-des-alpes.test.js`.
- Metrics: `node .agents/skills/build-3d-city/scripts/qa-metrics.mjs --ids stade-des-alpes --out tmp/france-southeast/stade-des-alpes/metrics.json`.
- Exported reference contact sheet: `tmp/france-southeast/sheets/stade-des-alpes.jpg`.
- Red mapped-footprint top view: `tmp/france-southeast/shots/stade-des-alpes/`.
- Depth: `node scripts/landmark-depth-layers.mjs --ids stade-des-alpes --check`.

| LOD | Triangles | Draws | Bytes |
| --- | ---: | ---: | ---: |
| near | 33988 | 7 | 539176 |
| far | 10036 | 7 | 178276 |

Author self-review: identifying features, proportions, palette, near/far openings and foundation contact inspected against the credited exterior references; red-ring mapped plan checked. Deterministic metrics: zero remaining flags; depth graph: no unresolved cycles. Focused structural tests and exported round-trip conformance pass. Model readiness: ready. Independent review is pending; author self-review is not an independent verdict.

**Cityscape: not tested. Full 3D world: not tested.** No app server was started. DEM/pad boundaries, provider lifecycle, live shared shading and hardware performance remain unverified.


## Independent-review correction, 2026-11-11

Darkened and neutralized the opaque glass-like canopy palette from #a3b4b5 to #8e9b9a (dark #5c6564); the curved grid, roof opening, exterior glazing and both near/far canopy rhythms are unchanged.

These photographic authoring targets are estimates, not surveyed dimensions. Re-exported both LODs; focused structural tests, deterministic metrics (zero remaining flags) and depth check pass. Fresh contact sheet: `tmp/batch/fixes/sheets/stade-des-alpes.jpg`. Author compared the corresponding SW and NE near/far faces: silhouette, openings, window/arcade rows and structural contacts are retained without blank replacement facades. Independent re-review remains pending; **Cityscape: not tested; Full 3D world: not tested**.

