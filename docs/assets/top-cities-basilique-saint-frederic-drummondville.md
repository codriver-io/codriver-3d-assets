# Basilique Saint-Frédéric

Drummondville, Canada. Current permanent exterior, authored 2026-11-10.

Present Saint-Frédéric basilica after the 2025 tower restoration: asymmetric Gothic facade, 7.32 m square main tower with black louvred belfry and green needle, 4.3 m minor tower carrying a statue, large traceried centre window, three portals and broad stairs. Published main tip 45.72 m and minor tower 21.34 m; church length is reported as 57.3 or 58 m, so horizontal fit follows the mapped envelope and both lengths are approximate. The large attached presbytery/connection in the mapped way is clipped out of replacement ownership. Front is architectural +Z toward the square (bearing about 38°), with yaw baked once; y=0 is the bottom stair/pavement datum.

## Geographic frame and dimensions

Origin: [-72.48899, 45.88409]. Real metres, +X east, +Y up, +Z south. Local y=0 is rigid foundation grade; no DEM, sea-level height, terrain exaggeration or Mercator stretch is baked into the asset. Rotation 141.83572° is baked once into the vertices; the runtime must not rotate again. Mapped source IDs: way/817554941.

Two-point controls and median foundation references are retained in SPEC.terrainPad.refs. The pad is a bounded placement handoff, not terrain verification. Footprints name only the structures actually authored; surrounding provider buildings and roads remain outside ownership.

| Dimension | Value | Evidence |
| --- | --- | --- |
| Main tower base / tip | 7.32 × 7.32 m / 45.72 m | Published architecture description |
| Minor tower base / top | 4.3 × 4.3 m / 21.34 m | Published architecture description |
| Church body length | 57.3 or 58 m reported | Conflicting rounded descriptions; map fit adopted |
| Main needle | 32.0–43.8 m, 5.4 m base diameter | Photographic estimate calibrated to restored 2025 exterior |
| Approach stairs | 0.18–1.80 m tread tops | Photographic estimate; separate authored ground-pad ring |

## References and rights

- [Québec heritage authority: present church completed 1923, inventory 2003-17-042](https://www.patrimoine-culturel.gouv.qc.ca/rpcq/detail.do?methode=consulter&id=98830&type=bien)
- [Organ/architecture history: 57.3 m, 7.3 m tower base, 45.7 m top and 21.3 m minor tower](https://www.musiqueorguequebec.ca/orgues/quebec/drummondsf.html)
- [Diocese of Nicolet: basilica identity and address](https://www.diocesenicolet.qc.ca/eglise/basilique-saint-frederic/)
- [CPRQ front exterior 2003, © Conseil du patrimoine religieux du Québec; all rights reserved; comparison only](https://www.lieuxdeculte.qc.ca/icono/detail/17/2003-17-042-01-02.jpg)
- [CPRQ opposite/rear exterior 2003, © CPRQ; all rights reserved; comparison only](https://www.lieuxdeculte.qc.ca/icono/detail/17/2003-17-042-06-01.jpg)
- [Éric Beaupré / Vingt55, restored tower December 2025; all rights reserved; current-version comparison only](https://vingt55.ca/la-basilique-saint-frederic-retrouve-tout-son-charme-le-retrait-de-lechafaudage-marque-une-etape-majeure-de-la-restauration-du-clocher/)
- [Mapped geographic source © OpenStreetMap contributors (ODbL 1.0)](https://www.openstreetmap.org/way/817554941)

OSM geographic data © OpenStreetMap contributors, ODbL 1.0. Geometry is original procedural work for Codriver. No scan, traced mesh, photograph, logo, lettering or texture is shipped. Copyright reference imagery is used only for comparison in ignored scratch. Published heights that disagree are treated as estimates; mapped heights are not a survey.

## Modeling and approximations

The restored 2025 exterior is identified by its asymmetrical towers, narrow copper needle above a dark louvred belfry, small statue tower, large Gothic tracery window, three portals and broad stepped approach. Four simplified joined stone saint figures are retained. The big tower uses its published 7.32 m base and 45.72 m total; the small tower remains 21.34 m. Actual pointed wall cutouts, louvre slats and inset tracery remain in far. The mapped way combines church/presbytery, so ownership clips out the presbytery and connector; the architectural front is +Z toward the square. The stairs have SPEC.stairFootprint and a separate terrain-pad ring, extending beyond the building mask without deleting provider geometry there. The lowest tread top is 0.18 m. Fine carvings, crockets, inscriptions, individual stone colours and interior are omitted. Roof, floor and stage splits remain estimates.

Muted named material palettes support day/night; repeated elements are merged by material. Far preserves the main silhouette, openings and separate facade rhythm while reducing curve/segment samples. Structural foundations reach local grade. Paving, where included, has its upper surface at least 0.10 m above grade. No terrain or absolute altitude is baked into either GLB.

## Measured exports and verification

| LOD | Triangles | Draws | Bytes |
| --- | ---: | ---: | ---: |
| near | 9969 | 7 | 167340 |
| far | 6727 | 7 | 117260 |

Build: `pnpm build:top-cities-landmarks basilique-saint-frederic-drummondville`. Identity tests: `src/peregrine/landmarks/top-cities/basilique-saint-frederic-drummondville/basilique-saint-frederic-drummondville.test.js`; both LODs test dimensions, mapped envelope and landmark-specific surfaces/openings. Top-cities conformance and catalog validation cover exported metrics/material/bounds agreement. Depth ordering generated and checked with `node scripts/landmark-depth-layers.mjs --ids basilique-saint-frederic-drummondville --check`; no material-cycle edges are dropped. Deterministic QA: `tmp/r4/basilique-saint-frederic-drummondville/metrics.json`.

Inspected exported contact sheet: `tmp/r4/sheets/final2/basilique-saint-frederic-drummondville.jpg`. Red-ring procedural plan: `tmp/r4/shots/basilique-saint-frederic-drummondville/basilique-saint-frederic-drummondville-procedural-near-light-top.png` (or the -final directory for corrected looks). Exported far/dark: `tmp/r4/dark/basilique-saint-frederic-drummondville/basilique-saint-frederic-drummondville-glb-far-dark-sheet.jpg`. One visual correction narrowed the main needle from an over-wide cap to the photographed 5.4 m base, added minor-tower pinnacles and muted the copper. The final exported sheet was compared with Éric Beaupré’s December 2025 restored facade and CPRQ opposite exterior; mapped top and far/dark were inspected. The published tower hierarchy, Gothic centre glazing, belfry, minor statue tower and stairs survive far. All material cycles, including tiny below-threshold pedestal contacts, were resolved.

Cityscape: **not tested**. Full 3D world: **not tested**. No app server or app-shot was run. These inspector captures establish export appearance only; placement, provider replacement, DEM contacts, mode/lifecycle transitions and Tesla hardware performance remain for the later independent batched review.
