# Grand Hôtel-Dieu — Lyon

Long pale-stone Rhône facade and eight real courtyard openings,with Soufflot central dome,Pascalon mansard bell tower and smaller Four-Rangs dome.

## Sources and rights

- [Operator:two-level250 m facade and32 m interior dome keystone](https://www.grand-hotel-dieu.com/en/page/flaner-au-grand-hotel-dieu)
- [Operator2026 site plan:Grand Dome,Pascalon,Four-Rangs and courtyard ownership](https://www.grand-hotel-dieu.com/medias/uploads/site/map/grand-hotel-dieu-plan-2026-10-08-v2.pdf)
- [Ville de Lyon:400 m facade rounded,larger-scope figure](https://www.lyon.fr/lieu/moderne-17eme-18eme/grand-hotel-dieu)
- [Identity and published dimensions](https://en.wikipedia.org/wiki/Hôtel-Dieu_de_Lyon)
- [OSM way 654805094: mapped plan, © OSM contributors, ODbL 1.0](https://www.openstreetmap.org/way/654805094)
- [OSM way 42975441: mapped plan, © OSM contributors, ODbL 1.0](https://www.openstreetmap.org/way/42975441)
- [OSM way 42975443: mapped plan, © OSM contributors, ODbL 1.0](https://www.openstreetmap.org/way/42975443)
- [OSM way 42975444: mapped plan, © OSM contributors, ODbL 1.0](https://www.openstreetmap.org/way/42975444)
- [OSM way 42975439: mapped plan, © OSM contributors, ODbL 1.0](https://www.openstreetmap.org/way/42975439)
- [OSM way 42975447: mapped plan, © OSM contributors, ODbL 1.0](https://www.openstreetmap.org/way/42975447)
- [OSM way 42975445: mapped plan, © OSM contributors, ODbL 1.0](https://www.openstreetmap.org/way/42975445)
- [OSM way 42975442: mapped plan, © OSM contributors, ODbL 1.0](https://www.openstreetmap.org/way/42975442)
- [OSM way 584690873: mapped plan, © OSM contributors, ODbL 1.0](https://www.openstreetmap.org/way/584690873)
- [Reference photograph: File:Façade detail of Hôtel-Dieu de Lyon, Lyon, France julesvernex2.jpg — Jules Verne Times Two — CC BY-SA 4.0](https://commons.wikimedia.org/wiki/File:Fa%C3%A7ade_detail_of_H%C3%B4tel-Dieu_de_Lyon,_Lyon,_France_julesvernex2.jpg)
- [Reference photograph: Lyon riverfront (52164665586) — Kent Wang — CC BY-SA 2.0](https://commons.wikimedia.org/wiki/File:Lyon_(52164665586).jpg)

Reference images are comparison-only, checked against this structure, retained in ignored `tmp/france/grand-hotel-dieu-lyon/refs/` with author and actual licence metadata. No photographs, logos, lettering, textures or third-party meshes ship. Original geometry commissioned for Codriver, models CC BY 4.0, source/docs MIT; mapped outlines © OpenStreetMap contributors, ODbL 1.0. No contributor declaration signed or inferred.

## Dimensions and frame

| Feature | Metres | Basis |
| --- | ---: | --- |
| Main body eaves | 18 | Photo estimate |
| Hip roof ridges | 22 | Photo estimate |
| Grand dome incl lantern | 46 | Photo estimate;32 m published is interior |
| Pascalon /Four-Rangs | 43/34 | Photo estimates |
| Courtyards | 8 | OSM relation300128 inner rings |
| Frontage | mapped envelope about280 m north/south | Source250/375/400 m scope discrepancies |

Origin `[4.83642732, 45.75874406]`; real metres +X east, +Y up, +Z south. Local y=0 is the rigid exterior grade, without baked DEM, sea-level offset or Mercator scale. Literal OSM rings fix the bearing in source and exports once; the first two distinct ring points are mapped control points, with long-edge checks in the top view. Ownership is restricted to modeled footprints; neighbours are excluded. No app placement, terrain footing or provider replacement claim is made.

## Modeling and approximations

Eight exact OSM inner rings remain empty through the body and the roof. The irregular full outer envelope fixes bearing and neighbouring exclusions;it is not stretched to match inconsistent published250/375/400 m facade descriptions. Repeated pale stone bays,arched ground openings,rectangular upper windows and continuous cornices establish the very long river frontage. A clipped height-field roof forms hipped wings around the courtyards. Three separate slate profiles,Soufflot central river dome,Pascalon southern bell tower and smaller northern Four-Rangs,are placed at mapped court junctions and cross-checked with the operator plan;their centres and vertical profiles are estimates,not surveyed roof footprints. Main46 m exterior crest deliberately differs from the published32 m interior vault keystone. All three have genuinely open lantern posts and retained finials. Two current exterior references show facade rhythm and full river silhouette;initial interior and fine sculpture images were rejected. No river,quay,plaza,court floor,trees,logos or neighbouring chapel extension is added.

Mapped relation300128 outer and8 inner rings retained. Body18 m/hip roofs22 m,grand dome46 m incl lantern,Pascalon43 m and Four-Rangs34 m are photo estimates. Operator32 m is interior keystone,not exterior crest. Facade figures250/375/400 m differ in scope; mapped envelope governs dimensions. Dome centres calibrated to operator site plan and mapped court junctions. No quay,river,plaza or surrounding buildings.

## Verification

Exported default-scene costs (measured, not hardware timings):

| LOD | Triangles | Draws | Bytes |
| --- | ---: | ---: | ---: |
| near | 30359 | 6 | 463448 |
| far | 10893 | 6 | 177188 |

Deterministic metrics: `tmp/france/grand-hotel-dieu-lyon/metrics.json`, no unresolved flags. Exported near/far reference comparison: `tmp/france/sheets/grand-hotel-dieu-lyon.jpg`. Mapped orientation/top check: `tmp/france/shots/grand-hotel-dieu-lyon/grand-hotel-dieu-lyon-glb-near-light-top.png`. Landmark identity tests, focused top-cities conformance, catalog validation and depth check passed; no dropped depth-cycle edges. Independent review remains a later batched stage. Cityscape: **not tested**. Full 3D world: **not tested**.


Closed-ring triangulation regression fixed: duplicate terminal vertices are removed before flattening roof-hole indices. More than800 actual-scene probes per LOD now reject any main-roof triangle inside the8 court apertures; both LODs pass,with no new metrics/depth flags.

## Independent review follow-up — 2026-11-10

Removed per-triangle tan/slate selection from all low wing roof slopes and welded their smooth normals, using one consistent muted tile material. Contrasting slate remains on the three domes. Preserved all eight open courts and all dome profiles without adding triangles; GLB bytes decreased.

Fresh exported comparison: `tmp/france/fixes/sheets/grand-hotel-dieu-lyon.jpg`; deterministic metrics `tmp/france/fixes/grand-hotel-dieu-lyon-metrics.json` have no unresolved flags. Focused identity/conformance tests and depth check passed; no dropped cycle edges. Builder compared the new sheet to its reference; independent re-review is still required. Cityscape: **not tested**. Full 3D world: **not tested**.

## 2026-11-10 application-finding diagnosis

Relation 300128 still has outer 654805094 and eight inner court ways; the runtime already uses only the complete outer, with the inner rings kept in the authoring plan. The pale courtyard surfaces remain when both provider building groups are hidden and disappear when ground/road groups are hidden. They are flat provider paving/paths rather than retained building extrusions; no mask enlargement or approved geometry change is justified. Both-mode final captures and the mode verdicts are recorded in `docs/batches/2026-11-10-app-verification-fixes.md`; diagnostic layer visibility overrides are not acceptance screenshots.
