# Palais de Chaillot (Trocadéro), Paris

Original texture-free procedural reconstruction of the **1937 palace**, not the demolished 1878 Palais du Trocadéro. The identity is the two separate curved wings, tall central pavilions with bowed inscription panels, the open parvis looking toward the Eiffel Tower, colonnades, eight gilded figures and descending Warsaw fountain garden. Contemporary event tents in the aerial reference are omitted.

## Sources and rights

- [Palais de Chaillot](https://en.wikipedia.org/wiki/Palais_de_Chaillot): 1937 reconstruction by Louis-Hippolyte Boileau, Jacques Carlu and Léon Azéma; separate curved wings, demolished central hall, eight gilded terrace figures.
- [OSM relation 6826569](https://www.openstreetmap.org/relation/6826569): `height=30`, `building:levels=5`, `start_date=1937`. Exact outer ways **79742852 and 79749386** and roof parts **1214794354–1214794357** are registered in `FOOTPRINTS`/`OSM_WAYS`. Geographic data © OpenStreetMap contributors, [ODbL 1.0](https://www.openstreetmap.org/copyright).
- Dossier `tmp/top-cities/palais-de-chaillot/osm.json` omitted the relation members’ geometry. The shared Overpass helper failed with HTTP 500; the two OSM API `/way/<id>/full.json` single-object responses supplied their node rings. These are retained in ignored scratch, not runtime modules.
- [Modern aerial: Palais de Chaillot - 20150801 16h02 (10625)](https://commons.wikimedia.org/wiki/File:Palais_de_Chaillot_-_20150801_16h02_(10625).jpg), William Crochot / Medium69, **CC BY-SA 4.0**: curvature, pavilion proportions, colonnades, parvis and fountain plan.
- [Paris 75016 Fontaines du Trocadéro 20090815](https://commons.wikimedia.org/wiki/File:Paris_75016_Fontaines_du_Trocad%C3%A9ro_20090815.jpg), Ricce, **public domain**: pale stone, pavilion fronts and fountain jets.
- Dossier historical front, *A 40mm Bofors gun guarding the air…* (Signal Corps Archive, public domain): central pavilion roof profile. The 1900 postcard of the old palace and the temporary 1937 exhibition towers are excluded from massing.

References inspected on 15 October 2026. Photographs remain in ignored scratch only; no textures, third-party meshes, scans or captured geometry enter the source or GLBs. Source is original code for Codriver; original model follows the repository CC BY 4.0 asset policy, independently of OSM attribution.

## Frame and dimensions

Metres, +X east / +Y up / +Z south. Origin `[2.28807,48.86234]` is between the central pavilions. A palace frame has +u toward the north-east and +v toward the Eiffel Tower, bearing 135°. Rotation is baked into every vertex exactly once. Mapped pavilion-side controls `(2.2881413,48.8626872)` and `(2.2885793,48.8624069)` give approximately 134.2°; the simplified plan uses 135° (0.8° approximation).

| Feature | Model | Basis |
| --- | --- | --- |
| Palace structural height | 30 m above parvis | OSM relation height |
| Storeys | five-storey overall organization | OSM; facade proportions simplified |
| Wing envelope | approximately 427 m in u, 136 m in v | mapped rings |
| Central opening | approximately 52 m | mapped pavilion sides |
| Parvis | y=12 m | estimated relative rise above fountain footing |
| Central roof | y=42 m; near relief heads 42.39 m | OSM 30 m + estimated 12 m platform |
| Curved wing roof | y=36.2 m | estimated 24.2 m above parvis |
| Colonnade | y=17–34.4 m, about 5–6 m bay pitch | photograph estimate |
| Central pavilions | about 41 × 43 m | mapped, simplified rectangles within rings |
| End pavilions | about 24 × 21 m | mapped, simplified rectangles |
| Fountain pool | approximately 35 × 117 m, rounded lower end | aerial estimate, not survey |
| Eight gilded figures | about 4.7 m including plinth | silhouette estimate |
| Stairs | 30 treads, rise 10 m, run 51 m | estimated site approach |

`y=0` is the lower fountain basin footing, not sea level. No absolute altitude, latitude stretch or scene datum is baked in; world-only relative site levels are DEM-derived and restore to this original flat frame when terrain is off. Solid foundations reach y=0; elevated palace terraces are intentionally retained in flat Cityscape. The upper building vertices stay within the mapped rings plus 0.8 m trim allowance. Fountain/garden/plaza surfaces extend outside the building rings intentionally and do not claim neighboring provider buildings.

## Geometry and LOD

Source: `src/peregrine/landmarks/top-cities/palais-de-chaillot/` contains config, literal mapped rings, a self-contained plan helper, generator, six cameras and focused tests. Rebuild with `pnpm build:top-cities-landmarks palais-de-chaillot --no-check`.

The curved ranges use closed extruded strips with separate square columns in front of recessed backing walls. Both LODs retain individual window bays in three upper rows and the lower gallery row; the far model never substitutes a continuous dark ribbon. The central pavilions have mostly blank parvis-facing limestone ends with grouped gilded inscription strokes, a windowed rear, smaller raised attics and bowed inscription panels. The silhouette of the open central axis is never bridged by a hall above parvis height. Near adds column bases/capitals, window mullions and simplified attic relief groups. Far retains the columns, open gap, pavilions, eight terrace figures, stairs, pool shapes and jets.

Seven merged materials: pale cream limestone `stone`, grey `roof`, dark `glass`, warm gilding `gold`, pale turquoise `water`, grey-green `garden` and pale opaque `spray` cones. Dark palettes dim the surfaces; windows are not uniformly self-lit. Sculptures are joined legs/torso/head/arms silhouettes, not copied sculpture meshes or faithful individual likenesses. Readable inscription lettering, facade bas-relief subjects, museum interiors, extensive lateral park trees and irregular landscaping are omitted. Jet shapes are static opaque geometry. Windows are offset 0.65 m from backing planes, with the depth table generated from the exported meshes.

## Site and integration — g8a review repair

The original +12 m / +2 m / +1.2 m terrain pads buried the theatre wall and chopped the stairs and terraces. The public AWS Terrarium z15 DEM was sampled at Place du Trocadéro, the parvis, both flanks, mid-garden and the basin. Raw evidence is `tmp/next-200/fix/g8a/palais-de-chaillot/dem-samples.json`; source tiles and the sampler are retained beside it. These are terrain observations, not a survey of architectural or water levels.

Six place/parvis references yield a median about **65.2 m**. Central-axis samples descend from **66.2 m at v55**, through **60.8 at v85**, **55.3 at v105**, **47.3 at v130**, **40.3 at v155**, to **32.4 at v210** and **31.7 at v230**. A shared relative profile interpolates the descending site levels. The whole palace, parvis and figures move rigidly -12 m relative to the sampled parvis datum; only the garden/pool site uses separately leveled parts. `terrainOffsets` are compact GLB metadata consumed by the existing building layer and restored exactly when world terrain is switched off. No absolute altitude, scene stretch, runtime import or new runtime layer enters the reusable generator.

Cityscape keeps its original flat site, including the single long rounded basin. In world, short garden levels and joined water cascade sections follow the measured descent; the upper stairs remain continuous and their feet, gallery front wall and basin foundations extend beneath the supporting TIN. The stepped lower water is a pragmatic approximation of a DEM that slopes across the fountain: it is **not a surveyed reconstruction of the fountain's water levels**. Lateral DEM differences remain simplified to the central relative profile. The live app audit (`terrain-audit.json`, resident z13 DEM / 25.14 m TIN) measures central design-grade residuals **-1.33 to +0.98 m**. Conservative terrain-to-top clearance is **0.27–12.3 m** across the sampled site: the largest recess is deliberately under the 12 m gallery wall, with buried foundations below it. These are not surveyed footing residuals or a claim of a ±1.5 m terrain gap at every surface.

The explicit pad selects only the near TIN vertices holding the modeled wings, parvis, stairs, promenades and basins. Tiny node-centred rings have no feather; there is no disc or broad convex pad over the gardens. Spill is bounded by the intersected TIN triangles (one approximately 25 m real lattice cell). Conservative cuts under the short basin sections prevent terrain breakthrough at both LODs; buried support feet keep the visible terrace walls continuous. The rear road and surrounding provider buildings remain visible in the app evidence. The OSM building ownership rings and exact way ids are unchanged; no new provider building is replaced.

- **Cityscape: verified** in final daytime far / near / street app captures; original flat site restoration also passes both-LOD regression tests.
- **Full 3D world: verified** in final daytime far / near / street and uphill-gardens captures for the reviewed terrain-penetration defect.
- DEM-arrival transitions, missing DEM, failed loads, origin shifts, animated flicker, moving driving and Tesla hardware: **not tested** by this repair. Independent re-review remains required.

## Verification and costs

Final evidence is under `tmp/next-200/fix/g8a/palais-de-chaillot/`:

- `glb/final-near/palais-de-chaillot-glb-near-light-sheet.jpg`: exported overview, facade, back and column detail.
- `glb/final-far/palais-de-chaillot-glb-far-dark-sheet.jpg`: exported far silhouette, openings and window rhythm at night.
- `app/{city,world}/{far,near,street}.png`: actual app shared unlit / vertex-shaded material path, explicit active/detail metadata in each `report.json`.
- `app/world/gardens.png`: view uphill along the Trocadéro garden axis, showing the full parvis wall, planted stair ends and continuous basin/terrace levels.
- `app-comparison.jpg`: Cityscape above Full 3D world, far / near / street columns. These images were visually read, along with both exported sheets.

Two exported look-fix rounds. The first world capture exposed remaining terrain strips between the lower water sections; bounded deeper node cuts, buried solid footing ends and joined cascade faces removed those strips. Central pavilion grids became near-blank inscription ends; stone/gold were lightened; broad pale spray cones replace the impression of thin water sticks. The central gap, eight figures, curved ranges, individual facade bays and rounded fountain plan survive far LOD.

| Variant | Before triangles / draws / KiB | After triangles / draws / bytes (KiB) |
| --- | --- | --- |
| Near | 13,628 / 6 / 740 | **18,050 / 7 / 1,090,668 (1,065)** |
| Far | 6,972 / 6 / 407 | **7,602 / 7 / 486,100 (475)** |

Both remain below the building caps; far byte headroom is about 14 KB against the 500,000-byte QA cap. Far keeps 42% of near triangles. Shared material batching is preserved; no per-window draws.

Checks on 15 October 2026:

- Landmark tests **6/6 pass**, about 0.5 s: identity / sightline, statue support and failed-foot control, stairs / basin, mapped footprint, far silhouette / window rows, plus actual building-layer world offsets and exact Cityscape restoration for both LODs. The terrain regression evaluates the real TIN/pad path and rejects terrain above sampled stair, garden and pool surfaces.
- Requested `top-cities.test.js`: **808/810 pass**; all three Chaillot checks pass. Only the unrelated ongoing Palais Bourbon build fails (a too-small footprint and missing exported manifest). Full log `top-cities-tests.log`.
- `node scripts/asset-catalog.mjs`: **pass**, 406 entries / 748 GLB variants at this checkpoint.
- `landmark-depth-layers.mjs --ids palais-de-chaillot` and `--check`: **pass**, zero material-cycle edges dropped.
- `qa-metrics.mjs --ids palais-de-chaillot`: **no issues**, zero layered faces in both LODs, zero back-face hits in 223 near rays; `metrics.json`.

The shared `public/peregrine.js` was never rebuilt; no shared-tree app server, git write or online deployment was performed. This closes the reviewed daytime visual defects; it does not widen the terrain rollout gate or certify measured basin/terrace construction levels.
