# Golden Ears Bridge (2009)

Original procedural model of the six-lane Fraser River crossing between Maple Ridge/Pitt Meadows and Langley. Editable source is `src/peregrine/landmarks/top-cities/golden-ears-bridge/`; exports are `public/models/bridges/golden-ears-bridge-{near,far}.glb`.

## Identity and sources

The supplied dossier was the starting point; its three photographs were inspected before authoring. The model represents four paired H-pylon stations (eight individual masts), shallow harped stays, twin-wall lower pier legs inside impact collars, broad composite girders, six vehicle lanes, protected paths on both edges and repeated twin-column approach supports. It does not model adjacent interchange ramps or nearby docks.

[SEABC/IABSE 2017, p39](https://www.seabc.ca/wordpress/files/notable_structures/Vancouver_Notable_Structures_IABSE_SEABC_2017.pdf) gives 968 m main structure, three 242 m main spans, two 121 m shore spans and 1442 m approaches. [Heidelberg Materials](https://www.heidelbergmaterials.com/en/reference-projects/golden-ears-bridge) and the operator round these to 244/122 m and 976 m. We use the structural engineer's 242/121 m values; mapped cycle-path tower recesses agree within about 2 m. [Infrastructure BC](https://www.infrastructurebc.com/project/golden-ears-bridge/) confirms six lanes and over 40 m navigation clearance. The four paired tower stations can also be counted in the dossier photographs. References retain their original licences in the catalog; photos are scratch only, never GLB textures.

## Frame and dimensions

| Quantity | Model | Basis |
| --- | ---: | --- |
| Main crossing | 968 m | SEABC, sourced; 976 m in supplier/operator rounding |
| Main spans | 3 × 242 m | SEABC, sourced |
| Side spans | 2 × 121 m | SEABC, sourced |
| Approach-inclusive published length | 2410 m | SEABC: 968 + 1442 m |
| Modeled alignment | 2310.268 m | Mapped traffic ways, not scaled to publication |
| Deck width | 32.8 m | Measured separation of dossier cycle paths tagged Esri aerial imagery (~32.8 m); not a licensed survey |
| Main road datum / soffit | 44 / 40 m | Estimated local datum; clearance source >40 m |
| Tower rise / crown | 40 / 84 m | [Construction reporting](https://trid.trb.org/View/793173): 40 m above deck, absolute crown estimated; eagle 87.15 m |
| Tower arrangement | Four paired stations, 242 m apart | Sourced structure and photos |
| Near stay fans | Ten stays each side/direction, 160 total | Photographic approximation, not a sourced cable count |
| Ramp maximum grade | 7.662% north / 7.612% south | Flat-map compromise; 55 m flat landings and 40 m vertical curves |

Origin `[-122.666333,49.19901]` is the northern tower pair midpoint. Real metres, +X east, +Y up, +Z south. Bearing ~169.7° comes from OSM traffic lines; rotation is baked once. The mapped model begins on Golden Ears Way and ends on the south approach, leaving the full curved interchange to provider roads. The northernmost 66 m continues the observed carriageway separation; it is an explicit approximation because the southbound dossier starts later. Exact mapped traffic way IDs and geometry are in `golden-ears-bridge-alignment.js`; cycleway/bridge outline IDs are in `footprint.js`. The supplied OSM extract has no building extrusions to mask. A small shared-helper south-extension query returned no elements; no bulk retry was made.

## Review corrections (2026-10-12)

The b3b review found square 32.8 m landing noses and crown eagles reading as gold bars. The river structure remains rigid: four paired tower stations, three 242 m main spans, two 121 m shore spans, 32.8 m deck and six traffic lanes. Over only the outer 180 m at each landing, two independently authored road ribbons taper from their full 11.55 m carriageways to 6 m provider ribbons centred on the mapped traffic ways. These endpoint widths are a visual fit to the standard road style at the reviewed driving zoom, not surveyed lane widths. Standard ribbons use screen-space widths and can vary with zoom.

A single merged `landing` material interpolates continuously between standard-road and HD pavement colours using the active light/dark palettes. The landmark's own layer reapplies this tint after terrain and HD surface refits; no shared renderer changes were necessary. Near paint stands 12 cm above the deck; far drops fallback paint. The median stops before the narrow landings, and kerbs follow the taper. Slabs, girders, cables, tower stations and lane count across the river stay unchanged.

Protected paths keep their separate mapped connections (ways 133593023 and 128363956), taper from 3.4 m to 0.8 m at ground connections, and retain held rail-end posts. The northern path join is at station 68.65 m; the southern east path diverges toward lateral -20.318 m while the west joins at +13.682 m. Exact traffic ways 44380960 and 1275209403 were added to the existing ownership IDs, and separate path envelope rings were added to `FOOTPRINTS`. No provider building parts occur in the supplied extract.

All eight crowns now carry coarse original perched-eagle silhouettes with a faceted body/head, hooked beak, bent raised wings, feet, tail and mast-contacting perch. The same silhouette survives far LOD. Repetition on each mast follows this review task; the dossier's close photo and general reference descriptions document fewer decorative crowns, so this repetition and the 3.15 m sculpture height are explicit artistic approximations. The [operator's eagle symbolism](https://buzzer.translink.ca/2014/06/happy-5th-birthday-golden-ears-bridge/) supports the identifying motif.

| Export | Before tris / draws / KiB | After tris / draws / KiB | After bytes |
| --- | --- | --- | ---: |
| Near | 76,144 / 25 / 3287 | 76,728 / 28 / 3309 | 3,388,828 |
| Far | 22,374 / 8 / 714 | 24,016 / 8 / 796 | 814,612 |

Exported GLB sheets inspected: `tmp/top-cities/shots/golden-ears-bridge/review-fix-near/`, `review-fix-far/`, and the final crown/landing/tower sheet in `review-fix-final/`. These comprise two look-fix rounds; no third round was used. The close crown view shows attached bent wings and the perched body, and the far sheet preserves the four tower pairs and eagles. Depth generation and `--check` report zero material-cycle edges. Final focused and registry checks: 415 passed, zero failures; landmark alone: 20 passed. `pnpm assets:check`, `pnpm assets:preview`, `node scripts/asset-catalog.mjs` and focused GLB QA all pass, with no QA issues. Tests check all named structural terminal contacts in both LODs, a shortened-stay negative case, landing width and ownership, river rigidity, crown retention, provider colours, exported normals/weights/bounds, terrain refit idempotence and exact Cityscape restoration.

## App evidence and limits

World uses Terrarium DEM tiles (256 px, max zoom 15). Approach screenshots were recaptured at north `[-122.6682223763,49.2057263566]` with headings 169.498° / 349.498°, and south `[-122.6643673508,49.1857471639]` with headings 190.172° / 10.172°. The eight images in `tmp/top-cities/shots/golden-ears-bridge/approaches-{cityscape,world}/` were inspected; the square road slab boundary is removed and the pavement blend meets the provider ribbons in both directions. Provider crossings remain visible. These are local QA artifacts.

Live `window.__map.landmarks.heightAt` checks and DEM footing residuals are recorded in `tmp/top-cities/golden-ears-bridge/app-height-{cityscape,world}.json`. The API returns metres above queried ground, rather than absolute elevation. It is checked at every in-range mapped roadway vertex, in both aligned directions and perpendicular headings, plus thirteen cross-section stations. Both modes accept all 40 mapped vertices (80 aligned-direction queries each), with zero null/nonfinite values, zero direction disagreement and 40 perpendicular-heading rejections each. All 912 sampled zero-height, zero-weight support-foot vertices meet the world DEM within 1 cm (residual range -0.00000133 to +0.00000035 m). Main-channel heightAt is approximately 40.789 m above ground, corresponding to the unchanged 44 m authored deck. North endpoint residuals are 0 / +0.065 m; south endpoint residuals are +0.164 / 0 m; south landing residuals remain +0.828 / +0.937 m from the existing bank fit. Physical soffit clearance over the DEM remains an estimated visual datum, not survey certification of the published navigation clearance.

| Live sample (lateral -6 / +6 m) | Cityscape heightAt | World heightAt |
| --- | --- | --- |
| north-foot | 0.000 / 0.000 m | 0.000 / 0.065 m |
| north-landing | 0.000 / 0.000 m | 0.000 / 0.000 m |
| north-ramp | 6.513 / 6.513 m | 4.194 / 4.252 m |
| main-start | 44.000 / 44.000 m | 35.977 / 35.834 m |
| tower-0 | 44.000 / 44.000 m | 40.789 / 40.789 m |
| tower-1 | 44.000 / 44.000 m | 40.789 / 40.789 m |
| tower-2 | 44.000 / 44.000 m | 40.789 / 40.789 m |
| tower-3 | 44.000 / 44.000 m | 40.789 / 40.791 m |
| main-mid | 44.000 / 44.000 m | 40.789 / 40.789 m |
| main-end | 44.000 / 44.000 m | 35.867 / 35.961 m |
| south-ramp | 6.470 / 6.470 m | 6.311 / 6.202 m |
| south-landing | 0.000 / 0.000 m | 0.828 / 0.937 m |
| south-foot | 0.000 / 0.000 m | 0.164 / 0.000 m |

Cityscape standard-road approaches in both directions: **verified locally**. Full 3D world standard-road approaches in both directions: **verified locally**. Actual HD pavement/paint continuity remains **not tested** because the local `/osm-lanes` endpoint lacks Redis and returns 503; a paired navigation/car driving session, full lifecycle matrix and actual MCU hardware performance remain **not tested**. Provider standard-road widths vary with zoom, so the fixed 6 m landing match is the reviewed-view approximation.

The landmark files and exports are committed and pushed on its dedicated branch; generated depth tables and renderer bundles are excluded. Local QA servers are stopped by their recorded PIDs after capture. No online deployment or public publication occurred.
