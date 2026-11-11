# Église Saint-Lambert

Saint-Lambert, Canada. Current permanent exterior, authored 2026-11-10.

Gaston Gagnier’s present 1936–1938 stone church on avenue Lorne: steep front gable with cruciform window, offset octagonal green steeple, long roof and lower transepts. Mapped envelope about 21.5 × 42.5 m; overall 35.8 m, roof and tower stage heights are photographic estimates, not a survey. Presbytery and adjacent school are outside ownership. Geographic yaw is baked once.

## Geographic frame and dimensions

Origin: [-73.513704, 45.500037]. Real metres, +X east, +Y up, +Z south. Local y=0 is rigid foundation grade; no DEM, sea-level height, terrain exaggeration or Mercator stretch is baked into the asset. Rotation 0.91158° is baked once into the vertices; the runtime must not rotate again. Mapped source IDs: way/28301108.

Two-point controls and median foundation references are retained in SPEC.terrainPad.refs. The pad is a bounded placement handoff, not terrain verification. Footprints name only the structures actually authored; surrounding provider buildings and roads remain outside ownership.

| Dimension | Value | Evidence |
| --- | --- | --- |
| Outer envelope | about 21.5 × 42.5 m | OSM way 28301108 |
| Roof ridge | 22.1 m | Photographic estimate |
| Steeple including cross | 35.8 m | Photographic estimate; no surveyed height found |
| Octagonal spire | 27.1–34.9 m | Photographic proportion estimate |

## References and rights

- [Québec heritage authority: identity, 1936–1938, Gaston Gagnier and current stone exterior](https://www.patrimoine-culturel.gouv.qc.ca/rpcq/detail.do?methode=consulter&id=125915&type=bien)
- [CPRQ exterior front/side/detail 2003, © Conseil du patrimoine religieux du Québec; all rights reserved, comparison only](https://www.lieuxdeculte.qc.ca/fiche.php?LIEU_CULTE_ID=71386)
- [CPRQ front exterior 2003, all rights reserved, comparison only](https://www.lieuxdeculte.qc.ca/icono/detail/16/2003-16-377-02-01.jpg)
- [CPRQ opposite side exterior 2003, all rights reserved, comparison only](https://www.lieuxdeculte.qc.ca/icono/detail/16/2003-16-377-07-01.jpg)
- [Mapped geographic source © OpenStreetMap contributors (ODbL 1.0)](https://www.openstreetmap.org/way/28301108)

OSM geographic data © OpenStreetMap contributors, ODbL 1.0. Geometry is original procedural work for Codriver. No scan, traced mesh, photograph, logo, lettering or texture is shipped. Copyright reference imagery is used only for comparison in ignored scratch. Published heights that disagree are treated as estimates; mapped heights are not a survey.

## Modeling and approximations

The steep stone gable, cruciform glazed recess and off-centre octagonal campanile with copper needle distinguish the 1936–1938 church. Actual apertures replace wall faces; the long stone mullion and crossbar stand inside the cruciform recess. Five individual lancet bays survive on each long wall in far, along with the louvres, cross and needle. Fine stone tooling, carvings, interior, adjacent school and presbytery are omitted. Uniform grey stone is calibrated to the reference instead of inventing a masonry patchwork.

Muted named material palettes support day/night; repeated elements are merged by material. Far preserves the main silhouette, openings and separate facade rhythm while reducing curve/segment samples. Structural foundations reach local grade. Paving, where included, has its upper surface at least 0.10 m above grade. No terrain or absolute altitude is baked into either GLB.

## Measured exports and verification

| LOD | Triangles | Draws | Bytes |
| --- | ---: | ---: | ---: |
| near | 3938 | 6 | 72536 |
| far | 2800 | 6 | 55972 |

Build: `pnpm build:top-cities-landmarks eglise-saint-lambert`. Identity tests: `src/peregrine/landmarks/top-cities/eglise-saint-lambert/eglise-saint-lambert.test.js`; both LODs test dimensions, mapped envelope and landmark-specific surfaces/openings. Top-cities conformance and catalog validation cover exported metrics/material/bounds agreement. Depth ordering generated and checked with `node scripts/landmark-depth-layers.mjs --ids eglise-saint-lambert --check`; no material-cycle edges are dropped. Deterministic QA: `tmp/r4/eglise-saint-lambert/metrics.json`.

Inspected exported contact sheet: `tmp/r4/sheets/final2/eglise-saint-lambert.jpg`. Red-ring procedural plan: `tmp/r4/shots/eglise-saint-lambert/eglise-saint-lambert-procedural-near-light-top.png` (or the -final directory for corrected looks). Exported far/dark: `tmp/r4/dark/eglise-saint-lambert/eglise-saint-lambert-glb-far-dark-sheet.jpg`. Two look rounds: replaced intersecting front window loops with one cruciform cutout, then removed a misleading side-portal approximation and strengthened the stepped buttress rhythm. The final sheet uses padded camera bounds to avoid the shared close-framing crop. Front/opposite/roof, near/far silhouette, cross window, green needle and footprint envelope were inspected; no remaining visible export finding.

Cityscape: **not tested**. Full 3D world: **not tested**. No app server or app-shot was run. These inspector captures establish export appearance only; placement, provider replacement, DEM contacts, mode/lifecycle transitions and Tesla hardware performance remain for the later independent batched review.

## Independent-review correction — 2026-11-11

Applied the inexpensive colour nit: darkened the main stone and shifted the copper from pale mint toward muted aged green, including a restrained darker night copper. Geometry, material count and all named features are unchanged.

Before commit the exported FAR was compared with NEAR at matching SW/NE camera positions, covering every exterior face: Front cruciform glazing, offset belfry, separate return and rear windows and steep roof match face by face exactly; both exports use the corrected palette. No geometry or opening was removed.

New contact sheet: `tmp/followup/sheets/eglise-saint-lambert.jpg`. Identity/conformance tests passed; `tmp/followup/eglise-saint-lambert-metrics.json` has zero QA flags; generated depth has zero dropped cycle edges and the depth check is current. 

This is the author’s correction, pending fresh independent exported-GLB re-review. Cityscape: **not tested**. Full 3D world: **not tested**.
