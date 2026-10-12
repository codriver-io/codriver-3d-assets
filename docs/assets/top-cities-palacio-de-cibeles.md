# Palacio de Cibeles, Madrid

`palacio-de-cibeles` is an original, texture-free procedural exterior of the white Neo-Plateresque former communications palace, now Madrid City Hall and CentroCentro, at Plaza de Cibeles 1. It includes the diagonal plaza frontage, central octagonal clock lantern, pentagonal turret masses, pinnacles, paired gable shoulder orders and large arched loggia, ground-floor arched openings, street wings and the covered Galería de Cristal. The Fountain of Cibeles, flags, interiors and adjacent buildings are excluded.

## Sources and rights

- [Madrid municipal heritage record](https://patrimonioypaisaje.madrid.es/portales/monumenta/es/Monumentos-y-Edificios-Singulares/Edificios-singulares/Palacio-de-Comunicaciones-Palacio-de-Cibeles-Ayuntamiento-de-Madrid-/?vgnextchannel=83bc3cb702aa4510VgnVCM1000008a4a900aRCRD&vgnextfmt=default&vgnextoid=4128f7d9560a4510f7d9560a45102e085a0aRCRD): 70 m octagonal tower with a clock, pentagonal towers flanking the principal facade, six main floors, Palacios and Otamendi, 1904–1918 period, and the glass vault over the passage between Montalbán and Alcalá. Six main floors and finer OSM level counts describe different parts; OSM levels are not treated as surveyed metre heights.
- [OpenStreetMap way 16322055](https://www.openstreetmap.org/way/16322055), plus all 75 palace parts in the cached dossier `osm.json`. Geographic data © OpenStreetMap contributors, [ODbL 1.0](https://www.openstreetmap.org/copyright).
- [Palacio de Comunicaciones - 47](https://commons.wikimedia.org/wiki/File:Palacio_de_Comunicaciones_-_47.jpg), Carlos Delgado, CC BY-SA 3.0: principal external proportions, white stone, turret crowns and arcade rhythm. Dossier photo 6.
- Tamorlan's [Fachada 01](https://commons.wikimedia.org/wiki/File:Palacio_de_Comunicaciones_-_Fachada_01.JPG), [02](https://commons.wikimedia.org/wiki/File:Palacio_de_Comunicaciones_-_Fachada_02.JPG), [03](https://commons.wikimedia.org/wiki/File:Palacio_de_Comunicaciones_-_Fachada_03.JPG), CC BY 3.0: masks and leafy reliefs. Dossier photos 3–5.
- [Fachada trasera-Palacio de Comunicaciones-2011](https://commons.wikimedia.org/wiki/File:Fachada_trasera-Palacio_de_Comunicaciones-2011.JPG), Tamorlan, CC BY 3.0: comparatively restrained rear elevation. Added photo 7, licence checked through Commons metadata.
- [MADRID E.U.S. PALACIO DE CIBELES-VISTAS - panoramio (2)](https://commons.wikimedia.org/wiki/File:MADRID_E.U.S._PALACIO_DE_CIBELES-VISTAS_-_panoramio_(2).jpg), Concepcion AMAT ORTA, CC BY 3.0: gallery glass framing and adjacent roof. Added photo 8, licence checked through Commons metadata.

Only original geometry is exported. Reference images and their metadata remain in ignored scratch; no photographic texture, scan or third-party mesh is retained in runtime assets. The two interior-ceiling dossier photos were inspected for disambiguation and were not used for the exterior massing.

## Geographic frame and dimensions

Real metres, +X east, +Y up, +Z south. Origin `[-3.69208, 40.41891]` is the geographic anchor near the central tower. `y=0` is the rigid palace foundation at local flat-map grade. Absolute altitude and DEM exaggeration are not baked into the reusable asset.

All mass rings are authored directly in mapped east/south coordinates, so orientation is already in source and GLBs. The decorative facade frame uses an approximate 38° axial bearing, outward toward 308°. Two control points on central part 331666156, `[-3.6921216,40.4189409]` and `[-3.6921640,40.4188998]`, establish its approximately 38° undirected alignment. The model is never rotated again by its host.

| Feature | Value | Basis |
| --- | --- | --- |
| Highest central pinnacle | 70 m | Madrid municipal heritage figure |
| Palace footprint | about 11,802 m² | OSM outer way, dossier planar area |
| Exported near envelope | 120.13 m east–west × 132.92 m north–south | Measured GLB bounds, including cornices |
| Central lantern body | 49–64.5 m, roughly 10.3 m across opposite polygon vertices | Photo estimate, octagonal plan retained |
| Clock centre / diameter | 44 m / 3.4 m | Photo estimate |
| Main pentagonal turret crown / pinnacle | 41.8 / 45.9 m | Photo estimate |
| Main facade upper stone roof | approximately 32–36 m | Estimated by part / photograph |
| Street wings | generally 23–36.8 m | Photo estimate guided by mapped level tags |
| Main portal | 5 m wide, arch top 11.9 m, door about 1 m behind facade near | Photo estimate |
| Upper loggia | 8.4 m clear span, outer arch top 42 m | Photo estimate |
| Gallery roof | 19 m edge, 21 m raised inner surface | Photo estimate; mapped irregular outline |

`FOOTPRINTS` includes the outer palace ring and 45 substantive part rings. Thirty tiny mapped pinnacle polygons are already enclosed by the outer ring and are not redundant replacement rings; all exact IDs remain in `OSM_WAYS` (76 ways total). The model's largest ornament/cornice projection is within the 1.3 m allowance tested against the mapped envelope. Neighboring apartments, the naval headquarters and Palacio de Linares remain outside ownership. No separate plaza pad or fountain mask is added.

## Authoring and LOD

Owned source: `config.js`, `footprint.js`, `geometry.js`, `views.js`, `palacio-de-cibeles-plan.js`, `palacio-de-cibeles.test.js` in `src/peregrine/landmarks/top-cities/palacio-de-cibeles/`. Export with `pnpm build:top-cities-landmarks palacio-de-cibeles --no-check`.

Original polygon unions produce the exterior of stepped masses at each roof level. Window apertures are cut into the wall surfaces. Near panes sit 0.40 m behind those holes, with stone reveals; the principal door is 1 m deep. Far retains individual rows and bays as coarser flush infill inside actual holes, avoiding overlaid glass on solid walls. The far portal still has a 0.75 m recess. Ornament uses merged simplified masks, columns, entablatures and finials. The upper semicircular loggia has separate deep glazing and a stone archivolt; the visible clock is a geometric disc with ticks and hands.

Six merged material draws: subdued white `stone`, dark `glass`, grey `roof`, selected warm night windows `glow`, ivory `clock`, dark `iron`. Geometry is welded after batching. Near keeps paired pilasters, small parapet posts, window heads and grouped stone masks; far retains coarser pilasters and upper frames while dropping small parapet posts and masks but retains roof masses, long lantern openings, clock, loggia, pinnacles, turret crowns and separate window bays.

| Export | Triangles | Draws | Bytes | KiB |
| --- | ---: | ---: | ---: | ---: |
| Near | 49,864 | 6 | 2,122,752 | 2,073.0 |
| Far | 11,748 | 6 | 439,576 | 429.3 |

Both meet the building limits (60,000 / 14 / 2.5 MB near; 12,000 / 8 / 500 KB far). Bounds differ by less than 1.5 m. No removable bridge attributes, compression extensions or textures. These costs describe the exported default scene, not measured Tesla performance.

## Verification and evidence

Actually inspected the reference dossier sheet, rear photo 7 and roof photo 8, then contact sheets of the exported GLBs. The following initial-authoring history precedes the independent review fix documented below. Evidence under `tmp/top-cities/shots/palacio-de-cibeles/`:

- `palacio-de-cibeles-glb-near-light-sheet.jpg` and `palacio-de-cibeles-glb-far-light-sheet.jpg`: overview, principal facade, opposite/rear side, roof, street-level portal, close tower.
- `palacio-de-cibeles-glb-near-dark-sheet.jpg` and `palacio-de-cibeles-glb-far-dark-sheet.jpg`: facade, rear, portal and tower.
- `palacio-de-cibeles-procedural-near-light-top.png`: source-plan alignment and red mapped ownership rings.
- `final-comparison.jpg`: those exported sheets together with front, rear and roof references; this is the judged final comparison.

First export was too expensive and repetitive. The first fix replaced box mullions with quads, reduced repeated reliefs, welded compatible vertices and simplified far facade detail while preserving window rows. The mapped geometry stayed fixed; the decorative frame was corrected to the measured diagonal bearing. The second fix added the large arched upper loggia, clearer turret entablatures and corner orders, and moved the clock face forward so it is fully visible. The principal portal is now a cut arch with recessed door rather than generic small bays.

Deterministic QA (`tmp/top-cities/palacio-de-cibeles/metrics.json`) passes: zero significant layered faces, zero coplanar material overlaps, 0% backface hits, nothing below grade and no removable attributes. Depth generation reports zero cycle edges dropped; `node scripts/landmark-depth-layers.mjs --ids palacio-de-cibeles --check` passes. The original four specific geometry tests passed before review, including 70 m height, both LOD bounds, outer-ring containment with a deliberately outside negative case, doorway recess by raycast, visible clock, long lantern openings and the raised gallery roof. The focused conformance suite was rerun after redundant tiny footprint rings were removed. Catalog validation and `pnpm assets:preview` pass.

## Approximations and integration handoff

This is an exterior landmark abstraction. Reliefs are grouped masks/leaf silhouettes, not sculptural copies. Roof vaults are faceted and opaque grey; internal gallery steelwork and glazing tessellation are simplified. Repeated window rows are regularized, especially far; minor exterior jogs and rear roof equipment are incomplete. The two pentagonal turrets follow their mapped irregular plans but their moulding and finial profiles are estimates. No surveyed metre heights other than the sourced 70 m tower are claimed. There are no modeled bridge beams, suspended walkways, cables or rails; structural member-end tests are N/A for this building's decorative orders.

Cityscape: **not tested yet, integration is checked separately**. Full 3D world: **not tested yet, integration is checked separately**. `terrainPad` declares a bounded outer-ring median datum with 10 m feather; no DEM sample or terrain footing certification was performed. The lead must review unobstructed app captures using shared runtime materials in both modes, provider replacement and footing, lifecycle transitions, independent recognisability review and hardware limits before release. No app server or runtime bundle was started, no online environment was deployed, and no shared source changed except the permitted generated depth table.

## Independent review correction — 2026-10-12

Review fix: loggia cut through backing walls, with recessed glazing and an unobstructed broad archivolt; competing stepped blocks removed. Paired plaza pilasters, upper-bay stone surrounds and arched near turret bays redirect detail into the frontage. Octagonal lantern has three slots per face, stronger corner ribs, tier cornices and embedded pinnacle bases in both LODs. Far keeps coarse separate bay rhythm and stone orders; exact sculpture remains abstracted.

Inspected exported near/light and far/light contact sheets at `tmp/top-cities/shots/palacio-de-cibeles/review-fix2/palacio-de-cibeles-glb-{near|far}-light-sheet.jpg`. The palace used two look-fix iterations; the museum and Alamo used one. Existing palettes and geographic ownership are unchanged. The initial authoring verification above is historical; current exports are measured in the table above.

Current focused run: **25/25 pass** (16 landmark-specific tests and nine scoped registry cases for these three models). The requested combined registry run reports 476 passes / one unrelated failure: the concurrently authored High Museum near model exceeds its triangle budget. The three-model deterministic audit in `tmp/top-cities/palacio-de-cibeles/review-fix-metrics.json` reports **ok** for both LODs of each landmark. Scoped depth generation and `--check` pass with **zero material-cycle edges dropped**. The global catalog command and `pnpm assets:preview` were run and are blocked by the concurrently authored unregistered `/models/buildings/high-museum-of-art-far.glb`; only the owned records were edited.

The independent pre-fix review found visible footing and no provider intrusion in the supplied Cityscape and Full 3D world stills. **Post-fix Cityscape: not tested; post-fix Full 3D world: not tested**, pending the lead's app recapture and independent re-review. Still-image approval does not certify lifecycle, DEM refinement or hardware performance.
