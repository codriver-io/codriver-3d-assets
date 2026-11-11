# Tour T1 (Engie) — Courbevoie

A folded glass leaf with curved northern roofline, rounded prow and open silver crown lattice.

## Sources and rights

- [Valode & Pistre: completed 2008 T1, folded glass leaf, 185 m architectural height](https://v-p.com/en/projet/tour-t1-engie-headquarters/)
- [Identity and published dimensions](https://en.wikipedia.org/wiki/Tour_T1)
- [OSM way 82486329: mapped plan, © OSM contributors, ODbL 1.0](https://www.openstreetmap.org/way/82486329)
- [Reference photograph: File:La Défense depuis l'Arc de Triomphe Janvier 2023.jpg — Arthur Weidmann — CC BY-SA 4.0](https://commons.wikimedia.org/wiki/File:La_D%C3%A9fense_depuis_l%27Arc_de_Triomphe_Janvier_2023.jpg)
- [Reference photograph: File:Gecina - Tour T1.jpg — Gecina — CC-BY-SA-4.0](https://en.wikipedia.org/wiki/File:Gecina_-_Tour_T1.jpg)

Reference images are comparison-only, checked against this structure, retained in ignored `tmp/france/tour-t1/refs/` with author and actual licence metadata. No photographs, logos, lettering, textures or third-party meshes ship. Original geometry commissioned for Codriver, models CC BY 4.0, source/docs MIT; mapped outlines © OpenStreetMap contributors, ODbL 1.0. No contributor declaration signed or inferred.

## Dimensions and frame

| Feature | Metres | Basis |
| --- | ---: | --- |
| Roof high point | 169 | Published roof; OSM and Wikipedia |
| Architectural screen | 185 | Architect published height |
| South roof / screen | 138 / 145 | Photo estimate |
| Curtain-wall pitch | 3.8 near / 7.6 far | Estimate |

Origin `[2.23980428, 48.89538392]`; real metres +X east, +Y up, +Z south. Local y=0 is the rigid exterior grade, without baked DEM, sea-level offset or Mercator scale. Literal OSM rings fix the bearing in source and exports once; the first two distinct ring points are mapped control points, with long-edge checks in the top view. Ownership is restricted to modeled footprints; neighbours are excluded. No app placement, terrain footing or provider replacement claim is made.

## Modeling and approximations

The horseshoe-like mapped plan supplies its rounded prow and folded leaf. A curved roof rises northward to 169 m; a genuinely open supported lattice continues to 185 m. Each crown post foot intersects the roof, and ribs terminate on named posts, retained in far. Near and far use adjoining curtain-wall tiles with broad pale horizontal divisions. The adjacent T2/IDEMIA block is excluded. Screen rise and leaf profile are visual approximations; no signage or commercial rebranding is represented.

2008 Valode & Pistre folded glass leaf, legacy Engie/T1 name (commercial rebranding excluded). Published roof 169 m and architectural screen 185 m; the architect describes a 185 m tower, while OSM tags only the roof. Curved roof fall, screen lattice pitch, glass colour and curtain-wall spacing are estimates. No logo, interior, adjoining lower block or terrain modeled.

## Verification

Exported default-scene costs (measured, not hardware timings):

| LOD | Triangles | Draws | Bytes |
| --- | ---: | ---: | ---: |
| near | 15784 | 3 | 244948 |
| far | 5614 | 3 | 92732 |

Deterministic metrics: `tmp/france/tour-t1/metrics.json`, no unresolved flags. Exported near/far reference comparison: `tmp/france/sheets/tour-t1.jpg`. Mapped orientation/top check: `tmp/france/shots/tour-t1/tour-t1-glb-near-light-top.png`. Landmark identity tests, focused top-cities conformance, catalog validation and depth check passed; no dropped depth-cycle edges. Independent review remains a later batched stage. Cityscape: **not tested**. Full 3D world: **not tested**.

