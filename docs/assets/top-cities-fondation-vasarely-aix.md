# Fondation Vasarely

Original procedural permanent exterior, 2026-11-10.

## Identity and evidence

Sixteen-cell honeycomb museum with an open hexagonal courtyard, fourteen faceted pyramidal skylights, low glazed base and alternating black/cream circles within square façade panels; original geometry, no artwork textures or signage.

- [Foundation architectural project: sixteen 14 m hexagons, 87 × 40 m, fourteen pyramidal skylights](https://www.fondationvasarely.org/le-centre-architectonique/un-projet-de-fondation/)
- [Restoration-conservation research: 9 m external alvéoles versus 11 m internal volume description](https://cdn.reseau-canope.fr/archivage/valid/contenus-associes-fondation-vasarely-N-16945-32442.pdf)
- [OSM exterior and courtyard multipolygon](https://www.openstreetmap.org/relation/3934665)
- [OSM mapped footprint and control points](https://www.openstreetmap.org/way/295843622)
- [OSM mapped footprint and control points](https://www.openstreetmap.org/way/295843765)
- [Fichier:Fondation Vasarely avec bassin.jpg — Ugo V — CC BY-SA 4.0; comparison only](https://commons.wikimedia.org/wiki/File:Fondation_Vasarely_avec_bassin.jpg)
- [File:Kyriad Prestige Hotel - Aix-en-Provence - view of Foundation Vasarely from my room (5768149006).jpg — Elliott Brown from Birmingham, United Kingdom — CC BY 2.0; comparison only](https://commons.wikimedia.org/wiki/File:Kyriad_Prestige_Hotel_-_Aix-en-Provence_-_view_of_Foundation_Vasarely_from_my_room_(5768149006).jpg)

Reference images are comparison-only and retained under ignored `tmp/france-southeast/fondation-vasarely-aix/refs/`; no photograph, traced mesh, logo or lettering ships. Photos selected: 2, 7. Historical photographs are used only where the permanent exterior is unchanged; temporary scaffolding, event fit-outs and unrelated pictures are excluded.

## Frame and dimensions

Origin: [5.4248642, 43.5213935]. Local y=0 is the rigid exterior foundation plane; +X east, +Y up, +Z south, real metres. Rotation 1.46622795 radians is baked once using mapped controls [[5.424792,43.521268],[5.424803,43.521344]] (way 295843765). No terrain or Mercator stretch is authored. OSM ways 295843622, 295843765 define the provider replacement envelope, not an arbitrary bounding rectangle; nearby roads and buildings are not owned.

| Element | Dimension | Evidence |
| --- | --- | --- |
| Published envelope | 87 × 40 m | Foundation description |
| Cell width | 14 m published; mapped grid approximately 14.7 m | OSM footprint retained without non-metre scaling |
| Façade / skylight apex | 9 / 11.4 m | 9 m restoration research; skylight rise estimated |
| Cells / pyramidal skylights | 16 / 14 | Foundation |

## Modeling choices and limits

The foundation describes 11 m interior volumes while restoration research describes 9 m external alvéoles; this model uses 9 m façades and an estimated 2.4 m skylight rise, not an asserted survey. OSM mapped lattice is approximately 5% larger than the published 14 m cell width, so the mapped exterior is retained and the disagreement is recorded. The distant 2011 photograph is a secondary confirmation of the same unchanged circle-panel layout seen in the more recent front photograph; restoration did not change this massing. Dossier painting, unrelated Gordes sculpture, concert and construction-stage images were rejected. No reflecting pool, plaza or terrain is modelled; y=0 is the rigid exterior wall foundation plane.



Both LODs keep the identifying silhouette, major openings and facade rhythm. Foundations are rigid, not terrain-draped; any modeled ground surface is at least 0.10 m above the local datum. No app terrain certification is implied.

## Reproduction and QA

- Build: `pnpm build:top-cities-landmarks fondation-vasarely-aix`.
- Focused test: `node --test src/peregrine/landmarks/top-cities/fondation-vasarely-aix/fondation-vasarely-aix.test.js`.
- Metrics: `node .agents/skills/build-3d-city/scripts/qa-metrics.mjs --ids fondation-vasarely-aix --out tmp/france-southeast/fondation-vasarely-aix/metrics.json`.
- Exported reference contact sheet: `tmp/france-southeast/sheets/fondation-vasarely-aix.jpg`.
- Red mapped-footprint top view: `tmp/france-southeast/shots/fondation-vasarely-aix/`.
- Depth: `node scripts/landmark-depth-layers.mjs --ids fondation-vasarely-aix --check`.

| LOD | Triangles | Draws | Bytes |
| --- | ---: | ---: | ---: |
| near | 13738 | 4 | 216692 |
| far | 8064 | 4 | 134436 |

Author self-review: identifying features, proportions, palette, near/far openings and foundation contact inspected against the credited exterior references; red-ring mapped plan checked. Deterministic metrics: zero remaining flags; depth graph: no unresolved cycles. Focused structural tests and exported round-trip conformance pass. Model readiness: ready. Independent review is pending; author self-review is not an independent verdict.

**Cityscape: not tested. Full 3D world: not tested.** No app server was started. DEM/pad boundaries, provider lifecycle, live shared shading and hardware performance remain unverified.

