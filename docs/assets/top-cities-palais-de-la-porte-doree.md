# Palais de la Porte Dorée — Paris

Long1931 Art Deco palace with a genuine deep colonnade, stepped centre canopy, broad entrance stair and ochre stone-relief facade.

## Sources and rights

- [Operator:13 m high90 m wide facade; Pascal Lemaitre current exterior ©Palais/ADAGP2018 comparison-only](https://monument.palais-portedoree.fr/en/the-decors/janniot-s-bas-relief)
- [Operator:3 m wide portico,13 m maximum columns](https://monument.palais-portedoree.fr/en/the-palais-des-colonies/the-architectural-instructions-for-the-palais-de-la-porte-doree)
- [Identity and published dimensions](https://en.wikipedia.org/wiki/Palais_de_la_Porte_Dorée)
- [OSM way 62819702: mapped plan, © OSM contributors, ODbL 1.0](https://www.openstreetmap.org/way/62819702)
- [Reference photograph: File:Palasi Porte Doree Entree.jpg — AlSepPhoenix — CC BY-SA 4.0](https://commons.wikimedia.org/wiki/File:Palasi_Porte_Doree_Entree.jpg)
- [Reference photograph: Current full colonnaded facade — Pascal Lemaitre ©Palais de la Porte Dorée ©ADAGP Paris 2018 — All rights reserved; comparison-only](https://monument.palais-portedoree.fr/en/the-decors/janniot-s-bas-relief)

Reference images are comparison-only, checked against this structure, retained in ignored `tmp/france/palais-de-la-porte-doree/refs/` with author and actual licence metadata. No photographs, logos, lettering, textures or third-party meshes ship. Original geometry commissioned for Codriver, models CC BY 4.0, source/docs MIT; mapped outlines © OpenStreetMap contributors, ODbL 1.0. No contributor declaration signed or inferred.

## Dimensions and frame

| Feature | Metres | Basis |
| --- | ---: | --- |
| Mapped frontage | 88.35 | OSM controls; operator rounds relief width90 |
| Columns and relief | 13 | Operator dimensions |
| Portico depth | 3 | Operator brief |
| Roof crest | 18.5 | Photo estimate |
| Entrance platform | 3.2 | Photo estimate |
| Portico columns | 26 | Photo-count approximation |

Origin `[2.40947221, 48.83537604]`; real metres +X east, +Y up, +Z south. Local y=0 is the rigid exterior grade, without baked DEM, sea-level offset or Mercator scale. Literal OSM rings fix the bearing in source and exports once; the first two distinct ring points are mapped control points, with long-edge checks in the top view. Ownership is restricted to modeled footprints; neighbours are excluded. No app placement, terrain footing or provider replacement claim is made.

## Modeling and approximations

Mapped frontage controls establish the90 m-class Art Deco composition. The actual enclosed building is inset3 m from26 slender rectangular columns,leaving real air in every bay. Continuous entablature bears on the column tops and steps upward at the centre. Twelve broad entrance treads meet the plinth. The relief uses original grouped heads, torsos, limbs and quadrupeds with0.30 m physical depth rather than traced artwork; the enclosing facade has true low-level door openings and coarse small rear windows and21 approximate rooflights. All LODs retain every portico opening,central roof step and stair. Interior,caribou and aquarium dossier images were rejected;the operator facade and Commons entrance show the same current exterior. Basins and surrounding landscape are outside scope.

88.35 m mapped frontage;13 m columns and facade relief supported by operator. Overall18.5 m and stair3.2 m are photo estimates. Original grouped figures and animals project0.30 m from the stone frieze,without copying specific Janniot figures or any text. No plaza or water basin. Current facade compared with2 exterior references.

## Verification

Exported default-scene costs (measured, not hardware timings):

| LOD | Triangles | Draws | Bytes |
| --- | ---: | ---: | ---: |
| near | 6043 | 5 | 110804 |
| far | 3897 | 5 | 76724 |

Deterministic metrics: `tmp/france/palais-de-la-porte-doree/metrics.json`, no unresolved flags. Exported near/far reference comparison: `tmp/france/sheets/palais-de-la-porte-doree.jpg`. Mapped orientation/top check: `tmp/france/shots/palais-de-la-porte-doree/palais-de-la-porte-doree-glb-near-light-top.png`. Landmark identity tests, focused top-cities conformance, catalog validation and depth check passed; no dropped depth-cycle edges. Independent review remains a later batched stage. Cityscape: **not tested**. Full 3D world: **not tested**.


## Independent review follow-up — 2026-11-10

Added six original groups of articulated human and quadruped silhouettes, 2.3–3.3 m high and 0.30 m deep, with the background partitioned around them rather than overlapped. Far keeps the groups and three rear rows of separately divided windows. Near is lighter; the far increase from 2974 to 3897 triangles is necessary for the requested physical figurative relief.

Fresh exported comparison: `tmp/france/fixes/sheets/palais-de-la-porte-doree.jpg`; deterministic metrics `tmp/france/fixes/palais-de-la-porte-doree-metrics.json` have no unresolved flags. Focused identity/conformance tests and depth check passed; no dropped cycle edges. Builder compared the new sheet to its reference; independent re-review is still required. Cityscape: **not tested**. Full 3D world: **not tested**.
