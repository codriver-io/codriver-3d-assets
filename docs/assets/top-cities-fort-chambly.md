# Fort Chambly

Chambly, Canada. Current permanent exterior, authored 2026-11-10.

Present restored stone Fort Chambly, completed in 1711: four tall corner bastions, two-level musket slits, western gate with pediment and projecting sentry boxes, open quadrangle and pitched courtyard barracks roofs. OSM wall envelope approximately 54 × 54 m; 17.2 m maximum, wall/bastion heights and roof construction are photographic estimates. No moat, river, terrain embankment or surrounding park is authored. Geographic yaw baked from the western curtain controls.

## Geographic frame and dimensions

Origin: [-73.27694, 45.44949]. Real metres, +X east, +Y up, +Z south. Local y=0 is rigid foundation grade; no DEM, sea-level height, terrain exaggeration or Mercator stretch is baked into the asset. Rotation 87.05794° is baked once into the vertices; the runtime must not rotate again. Mapped source IDs: way/109746492, way/1567580550.

Two-point controls and median foundation references are retained in SPEC.terrainPad.refs. The pad is a bounded placement handoff, not terrain verification. Footprints name only the structures actually authored; surrounding provider buildings and roads remain outside ownership.

| Dimension | Value | Evidence |
| --- | --- | --- |
| Envelope | about 54 × 54 m | OSM perimeter way 109746492 |
| Curtain walls | 12.2 m | Photographic estimate |
| Bastions | 15.0 m | Photographic estimate |
| Sentry roofs | 17.2 m | Photographic estimate |
| Courtyard paving top | 0.16 m | Authored clearance above local grade |

## References and rights

- [Parks Canada: present 1711 stone square, four bastions and two-level slits](https://parks.canada.ca/lhn-nhs/qc/fortchambly/culture/architecture/batiments-buildings/fort-de-pierre-stone-fort)
- [Hayden Soloviev, Fort Chambly 5 (current aerial exterior), CC BY 4.0; comparison only](https://commons.wikimedia.org/wiki/File:Fort_Chambly_5.jpg)
- [Cephas, Fort Chambly 2 (gate and bastions), CC BY-SA 3.0; comparison only](https://commons.wikimedia.org/wiki/File:Fort_Chambly_2.jpg)
- [Hayden Soloviev, Fort Chambly 2.0 (current overhead), CC BY 4.0; comparison only](https://commons.wikimedia.org/wiki/File:Fort_Chambly_2.0.jpg)
- [Mapped geographic source © OpenStreetMap contributors (ODbL 1.0)](https://www.openstreetmap.org/way/109746492)

OSM geographic data © OpenStreetMap contributors, ODbL 1.0. Geometry is original procedural work for Codriver. No scan, traced mesh, photograph, logo, lettering or texture is shipped. Copyright reference imagery is used only for comparison in ignored scratch. Published heights that disagree are treated as estimates; mapped heights are not a survey.

## Modeling and approximations

The four hollow stone bastions, two levels of musket slits, recessed western gate/pediment, pale projecting sentry boxes and courtyard arcades identify the present restored 1711 fort. The courtyard is genuinely open to the sky. Individual arcades and musket slits are real wall cutouts with recessed dark backing where the reference shows unlit rooms or glazing. Roof strips slope toward the courtyard and retain dormers in both LODs. The model excludes surrounding river, park, moat and terrain. Masonry coursing, artillery, flags, lettering and fine gate relief are omitted; roof/dormer construction is simplified rather than a conservation survey.

Muted named material palettes support day/night; repeated elements are merged by material. Far preserves the main silhouette, openings and separate facade rhythm while reducing curve/segment samples. Structural foundations reach local grade. Paving, where included, has its upper surface at least 0.10 m above grade. No terrain or absolute altitude is baked into either GLB.

## Measured exports and verification

| LOD | Triangles | Draws | Bytes |
| --- | ---: | ---: | ---: |
| near | 7616 | 5 | 136672 |
| far | 5966 | 5 | 111904 |

Build: `pnpm build:top-cities-landmarks fort-chambly`. Identity tests: `src/peregrine/landmarks/top-cities/fort-chambly/fort-chambly.test.js`; both LODs test dimensions, mapped envelope and landmark-specific surfaces/openings. Top-cities conformance and catalog validation cover exported metrics/material/bounds agreement. Depth ordering generated and checked with `node scripts/landmark-depth-layers.mjs --ids fort-chambly --check`; no material-cycle edges are dropped. Deterministic QA: `tmp/r4/fort-chambly/metrics.json`.

Inspected exported contact sheet: `tmp/r4/sheets/final/fort-chambly.jpg`. Red-ring procedural plan: `tmp/r4/shots/fort-chambly/fort-chambly-procedural-near-light-top.png` (or the -final directory for corrected looks). Exported far/dark: `tmp/r4/dark/fort-chambly/fort-chambly-glb-far-dark-sheet.jpg`. One visual correction: darkened the recessed courtyard arches and gate to match the photographed unlit interiors. The final sheet, mapped overhead and exported far/dark preserve the open quadrangle, four bastions, slate roof ring, dormers and gate. Deterministic checks first exposed a paving-to-wall contact cycle; reducing the paving edge resolved it without dropped depth edges.

Cityscape: **not tested**. Full 3D world: **not tested**. No app server or app-shot was run. These inspector captures establish export appearance only; placement, provider replacement, DEM contacts, mode/lifecycle transitions and Tesla hardware performance remain for the later independent batched review.
