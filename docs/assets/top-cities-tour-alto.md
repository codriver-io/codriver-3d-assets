# Tour Alto — Courbevoie

Flared vase-shaped glass tower with a narrow rounded base, broad asymmetrical top and staggered silver glass scales.

## Sources and rights

- [Paris La Défense: Alto,2020,38 floors,150 m and3800 glass scales](https://www.parisladefense.com/fr/territoire/tours-batiments/alto)
- [Identity and published dimensions](https://en.wikipedia.org/wiki/Tour_Alto)
- [OSM way 758211634: mapped plan, © OSM contributors, ODbL 1.0](https://www.openstreetmap.org/way/758211634)
- [Reference photograph: File:La Défense depuis l'Arc de Triomphe Janvier 2023.jpg — Arthur Weidmann — CC BY-SA 4.0](https://commons.wikimedia.org/wiki/File:La_D%C3%A9fense_depuis_l%27Arc_de_Triomphe_Janvier_2023.jpg)
- [Reference photograph: File:Tour Alto Paris La Défense.jpg — McSyl — CC0](https://en.wikipedia.org/wiki/File:Tour_Alto_Paris_La_D%C3%A9fense.jpg)

Reference images are comparison-only, checked against this structure, retained in ignored `tmp/france/tour-alto/refs/` with author and actual licence metadata. No photographs, logos, lettering, textures or third-party meshes ship. Original geometry commissioned for Codriver, models CC BY 4.0, source/docs MIT; mapped outlines © OpenStreetMap contributors, ODbL 1.0. No contributor declaration signed or inferred.

## Dimensions and frame

| Feature | Metres | Basis |
| --- | ---: | --- |
| Envelope | 160 | OSM/CTBUH; district source150 m, unresolved datum |
| Base to top plan ratio | 0.62 | Photo estimate |
| Storeys | 40 near /20 far facade rows | Visual rhythm estimate;38 published |
| Base offset | 2 m east/west and north/south | Photo estimate |

Origin `[2.25116688, 48.88938502]`; real metres +X east, +Y up, +Z south. Local y=0 is the rigid exterior grade, without baked DEM, sea-level offset or Mercator scale. Literal OSM rings fix the bearing in source and exports once; the first two distinct ring points are mapped control points, with long-edge checks in the top view. Ownership is restricted to modeled footprints; neighbours are excluded. No app placement, terrain footing or provider replacement claim is made.

## Modeling and approximations

A literal mapped rounded upper ring contracts to a narrower footing and gradually flares with height. This is a lofted vase, not a straight extrusion. Staggered slightly slanted curtain-wall cells evoke the3800 glass scales without textures or panel boxes; frame and glass adjoin. The upper roof is closed. Far coarsens cells while keeping asymmetry, full flare and separate panes. Three construction-era photos were rejected; the completed McSyl view and2023 skyline are the two references. Small roof terraces and the entrance canopy are omitted.

Completed2020 Alto. OSM/CTBUH160 m versus district operator150 m:160 m is the selected envelope estimate, with measurement datums unresolved. Literal mapped upper envelope, base at62% plan scale, progressive flare and staggered glass scales. Base ratio, small offset, panel dimensions and colours estimated. Two planted roof terraces, entrance canopy, logos, interiors and plaza omitted.

## Verification

Exported default-scene costs (measured, not hardware timings):

| LOD | Triangles | Draws | Bytes |
| --- | ---: | ---: | ---: |
| near | 17812 | 4 | 297404 |
| far | 4492 | 4 | 88524 |

Deterministic metrics: `tmp/france/tour-alto/metrics.json`, no unresolved flags. Exported near/far reference comparison: `tmp/france/sheets/tour-alto.jpg`. Mapped orientation/top check: `tmp/france/shots/tour-alto/tour-alto-glb-near-light-top.png`. Landmark identity tests, focused top-cities conformance, catalog validation and depth check passed; no dropped depth-cycle edges. Independent review remains a later batched stage. Cityscape: **not tested**. Full 3D world: **not tested**.

