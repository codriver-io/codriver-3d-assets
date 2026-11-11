# Tour Carpe Diem — Courbevoie

Slender blue glass slab with alternating triangular facade facets and pale zigzag fold lines.

## Sources and rights

- [Paris La Défense: Carpe Diem, 162 m and 38 levels](https://www.parisladefense.com/en/district/towers-buildings/carpe-diem)
- [Identity and published dimensions](https://en.wikipedia.org/wiki/Tour_Carpe_Diem)
- [OSM way 851434516: mapped plan, © OSM contributors, ODbL 1.0](https://www.openstreetmap.org/way/851434516)
- [Reference photograph: File:Tour Carpe Diem.jpg — McSyl — CC0](https://en.wikipedia.org/wiki/File:Tour_Carpe_Diem.jpg)
- [Reference photograph: File:La Défense depuis l'Arc de Triomphe Janvier 2023.jpg — Arthur Weidmann — CC BY-SA 4.0](https://commons.wikimedia.org/wiki/File:La_D%C3%A9fense_depuis_l%27Arc_de_Triomphe_Janvier_2023.jpg)

Reference images are comparison-only, checked against this structure, retained in ignored `tmp/france/tour-carpe-diem/refs/` with author and actual licence metadata. No photographs, logos, lettering, textures or third-party meshes ship. Original geometry commissioned for Codriver, models CC BY 4.0, source/docs MIT; mapped outlines © OpenStreetMap contributors, ODbL 1.0. No contributor declaration signed or inferred.

## Dimensions and frame

| Feature | Metres | Basis |
| --- | ---: | --- |
| Crown high point | 162 | Primary district source; envelope estimate |
| OSM height | 166 | Disagrees by 4 m; not adopted |
| Roof fall | 6 | Photo estimate |
| Zigzag breaks | 8 / 75 / 120 / 162 | Photo estimate |
| Storey pitch | 3.9 near / 7.8 far | Estimate |

Origin `[2.2456659, 48.89146212]`; real metres +X east, +Y up, +Z south. Local y=0 is the rigid exterior grade, without baked DEM, sea-level offset or Mercator scale. Literal OSM rings fix the bearing in source and exports once; the first two distinct ring points are mapped control points, with long-edge checks in the top view. Ownership is restricted to modeled footprints; neighbours are excluded. No app placement, terrain footing or provider replacement claim is made.

## Modeling and approximations

The pale diagonal folds are separate adjoining facade surfaces, cutting across individual curtain-wall panes on the narrow elevations. Alternating triangular glass tones preserve the distinctive facade in far. Windows and frame tessellate the wall with no overlays; the sloping crown is closed by a real cap. Reflections and dihedral depth are simplified; no brand or lettering is represented.

Completed 2013 tower. Primary district source gives 162 m from boulevard, versus OSM 166 m: 162 m is the selected envelope estimate. Mapped plan, high sloping crown and alternating pale diagonal facade folds retained. Fold position, width, glass reflection colours and floor pitch estimated; dihedral relief simplified to adjoining material facets. No logos, lettering, interiors or plaza.

## Verification

Exported default-scene costs (measured, not hardware timings):

| LOD | Triangles | Draws | Bytes |
| --- | ---: | ---: | ---: |
| near | 11518 | 5 | 189836 |
| far | 3300 | 5 | 64160 |

Deterministic metrics: `tmp/france/tour-carpe-diem/metrics.json`, no unresolved flags. Exported near/far reference comparison: `tmp/france/sheets/tour-carpe-diem.jpg`. Mapped orientation/top check: `tmp/france/shots/tour-carpe-diem/tour-carpe-diem-glb-near-light-top.png`. Landmark identity tests, focused top-cities conformance, catalog validation and depth check passed; no dropped depth-cycle edges. Independent review remains a later batched stage. Cityscape: **not tested**. Full 3D world: **not tested**.

