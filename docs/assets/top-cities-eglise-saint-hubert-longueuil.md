# Église Saint-Hubert

Longueuil, Canada. Current permanent exterior, authored 2026-11-10.

Victor Bourgeau’s present 1858–1862 Saint-Hubert church: three Gothic portals, tall central silver needle with open octagonal belfry, four subsidiary lantern pinnacles and stepped stone facade. Main nave approximately 23 × 38 m from OSM; 48.5 m overall and stage heights are photographic estimates. The mapped outer way includes an attached west presbytery wing, which is clipped out of FOOTPRINTS and is not authored or masked. Rear sacristy is retained inside the church envelope. Geographic yaw baked once.

## Geographic frame and dimensions

Origin: [-73.42084829210754, 45.50479055215339]. Real metres, +X east, +Y up, +Z south. Local y=0 is rigid foundation grade; no DEM, sea-level height, terrain exaggeration or Mercator stretch is baked into the asset. Rotation 155.73429° is baked once into the vertices; the runtime must not rotate again. Mapped source IDs: way/77857140.

Two-point controls and median foundation references are retained in SPEC.terrainPad.refs. The pad is a bounded placement handoff, not terrain verification. Footprints name only the structures actually authored; surrounding provider buildings and roads remain outside ownership.

| Dimension | Value | Evidence |
| --- | --- | --- |
| Main nave | 23 × 38 m | OSM way 77857140, church portion |
| Rear sacristy | about 10 × 18 m | Mapped annex, simplified outline |
| Nave ridge | 17.0 m | Photographic estimate |
| Central lantern | 25.3–31.5 m | Photographic estimate |
| Needle and cross top | 48.5 m | Photographic estimate; published survey height not found |

## References and rights

- [Québec heritage authority: Saint-Hubert, Victor Bourgeau, construction 1858–1862](https://www.patrimoine-culturel.gouv.qc.ca/rpcq/detail.do?methode=consulter&id=125789&type=bien)
- [CPRQ front exterior, © Conseil du patrimoine religieux du Québec 2003, all rights reserved; comparison only](https://www.lieuxdeculte.qc.ca/icono/detail/16/2003-16-358-01-01.jpg)
- [CPRQ rear/side exterior, © CPRQ 2003, all rights reserved; comparison only](https://www.lieuxdeculte.qc.ca/icono/detail/16/2003-16-358-04-01.jpg)
- [CPRQ tower detail, © CPRQ 2003, all rights reserved; comparison only](https://www.lieuxdeculte.qc.ca/icono/detail/16/2003-16-358-09-01.jpg)
- [Identity and restoration context](https://fr.wikipedia.org/wiki/Église_Saint-Hubert_de_Longueuil)
- [Mapped geographic source © OpenStreetMap contributors (ODbL 1.0)](https://www.openstreetmap.org/way/77857140)

OSM geographic data © OpenStreetMap contributors, ODbL 1.0. Geometry is original procedural work for Codriver. No scan, traced mesh, photograph, logo, lettering or texture is shipped. Copyright reference imagery is used only for comparison in ignored scratch. Published heights that disagree are treated as estimates; mapped heights are not a survey.

## Modeling and approximations

Three pointed blue portals, three tall lancets, stepped buttresses, open octagonal belfry, silver ribbed needle and four subsidiary open lantern pinnacles distinguish Saint-Hubert. The front is split into nonoverlapping panels with actual holes. The belfry is open through both faces in near and far, pinned by an oblique aperture ray and a solid adjacent pier. Far retains all portal/lancet bays, the belfry openings and subsidiary spires, with fewer curve samples. The connected presbytery is excluded by a documented clip of the mapped outer way. The rear sacristy uses separate hollow walls with individual windows. Fine crockets, statues, stone courses and interiors are omitted.

Muted named material palettes support day/night; repeated elements are merged by material. Far preserves the main silhouette, openings and separate facade rhythm while reducing curve/segment samples. Structural foundations reach local grade. Paving, where included, has its upper surface at least 0.10 m above grade. No terrain or absolute altitude is baked into either GLB.

## Measured exports and verification

| LOD | Triangles | Draws | Bytes |
| --- | ---: | ---: | ---: |
| near | 5733 | 6 | 95868 |
| far | 3705 | 6 | 67788 |

Build: `pnpm build:top-cities-landmarks eglise-saint-hubert-longueuil`. Identity tests: `src/peregrine/landmarks/top-cities/eglise-saint-hubert-longueuil/eglise-saint-hubert-longueuil.test.js`; both LODs test dimensions, mapped envelope and landmark-specific surfaces/openings. Top-cities conformance and catalog validation cover exported metrics/material/bounds agreement. Depth ordering generated and checked with `node scripts/landmark-depth-layers.mjs --ids eglise-saint-hubert-longueuil --check`; no material-cycle edges are dropped. Deterministic QA: `tmp/r4/eglise-saint-hubert-longueuil/metrics.json`.

Inspected exported contact sheet: `tmp/r4/sheets/eglise-saint-hubert-longueuil.jpg`. Red-ring procedural plan: `tmp/r4/shots/eglise-saint-hubert-longueuil/eglise-saint-hubert-longueuil-procedural-near-light-top.png` (or the -final directory for corrected looks). Exported far/dark: `tmp/r4/dark/eglise-saint-hubert-longueuil/eglise-saint-hubert-longueuil-glb-far-dark-sheet.jpg`. Inspected one exported sheet against the CPRQ front/tower photos, mapped top and exported far/dark view. Open belfry and six smaller pinnacles, tall silver needle, three blue portals and window rhythm remain identifiable in both LODs. The plan follows the church portion and excludes the presbytery. No visual correction round was needed after deterministic fixes.

Cityscape: **not tested**. Full 3D world: **not tested**. No app server or app-shot was run. These inspector captures establish export appearance only; placement, provider replacement, DEM contacts, mode/lifecycle transitions and Tesla hardware performance remain for the later independent batched review.
