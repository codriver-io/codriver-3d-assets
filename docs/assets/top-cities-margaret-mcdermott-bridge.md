# Margaret McDermott Bridge, Dallas

Original procedural representation of the current I-30 Trinity River crossing, not the nearby Margaret Hunt Hill Bridge. Two white thrust arches support the pedestrian/cycle bridges outside a separate concrete freeway and frontage roads. Construction photographs in the dossier are reference studies of the permanent steelwork; construction cranes and temporary falsework are omitted.

## Sources and dimensions

| Feature | Model | Basis |
| --- | ---: | --- |
| Arch span | 342.9 m / 1,125 ft | [Huitt-Zollars, project engineer](https://www.huitt-zollars.com/projects/bridges/margaret-mcdermott-pedestrian-bridge) and [Texas Shafts, foundation contractor](https://texas-shafts.com/project/margaret-mcdermott-bridge/) |
| Crown from ground/water convention | 106.68 m / 350 ft | Texas Shafts; datum approximate, not surveyed |
| Rise above pedestrian deck | 86.868 m / 285 ft | Huitt-Zollars |
| Pedestrian/cycle deck width | 6.1976 m / 20 ft 4 in | Huitt-Zollars; 7 ft raised walking lane, 11 ft bicycle lanes |
| Authored deck | 19.812 m | Difference between published crown/rise, interpreted as local grade; estimate |
| Alignment bearing | 76.6° eastbound | Mean of mapped straight cycle-path segments, OSM |
| Straight cycle spans | 337.49 m | OSM path controls; published arch feet extend about 2.7 m each side |
| Arch lateral planes | ±61.3 m | Mapped cycle-path separation |
| Model/road-fit extent | 1,000 m | Straight station corridor through the mapped approaches; estimate |
| Freeway and frontage bands | [-55.5,-43.5], [-42,-2], [2,42], [43.5,55.5] m | Photographic cross-section, mapped OSM road positions; approximate rather than surveyed |
| Flat ramps | 250 m each; maximum 11.89% | Cubic profile from flat approach roads to deck, a Cityscape compromise |
| World river datum | 118 m above sea level | Initial approximate datum; terrain verification recorded below |

OSM source: dossier extract copied to ignored `tmp/top-cities/margaret-mcdermott-bridge/osm.json`. Relevant attributed road/path polylines are retained in `margaret-mcdermott-bridge-alignment.js`; IDs in `footprint.js`. No building extrusion belongs to this bridge, so `FOOTPRINTS` is empty. The road layer owns roadway replacement, not the `man_made=bridge` outline as a building.

Reference photographs (visual study only; no image or texture in the exports): [20160730-DSC 9933](https://commons.wikimedia.org/wiki/File:20160730-DSC_9933.jpg), Ryanussery, CC BY-SA 4.0; [MMB Dallas Nima2](https://commons.wikimedia.org/wiki/File:MMB_Dallas_Nima2.jpg), Nightryder84, CC BY-SA 4.0; [Margaret-McDermott-bridge](https://commons.wikimedia.org/wiki/File:Margaret-McDermott-bridge.jpg), Art davis, CC BY-SA 4.0. The supplied reference sheet was opened and compared with the render sheets.

## Geometry and placement

Metres east/up/south around `[-96.817955425,32.77028005]`, midpoint of the two mapped cycle spans. Rotation is baked into geometry through the shared profile; no stretch or terrain height is baked into GLBs. A separate absolute-deck runtime profile interprets the estimated 118 m world datum, with DEM-fitted ends and supports. Concrete footings have zero lift, shafts interpolate to deck attachment, steel above deck follows the fitted deck. No shared renderer changes.

The arch bands have actual through holes in both forked feet, a large open throat, and paired inclined cable planes anchored to the pedestrian edge boxes. The independent concrete freeway has a central slot, narrow frontage-road slots, barriers, underside I girders, repeated cap bents and dual columns. Near adds dense guardrail posts, raised sidewalk strip, lane paint, cable anchor blocks and freeway lamps. Far retains the arch openings and silhouette, reduces cable/column/post spacing, and simplifies girders. Three station chunks near; one batch per material far.

Palette: warm white painted steel, light grey cables, weathered concrete, darker girder undersides and grey asphalt; night dims structural materials and makes lamp heads emissive in the renderer. This is a visual approximation of nighttime lighting, not a photometric simulation.

Known approximations: arch parabola and fork-slot dimensions, girder and column dimensions/spacing, roadway band widths and fallback lane count, lamp spacing, approach straightening and vertical curves. Provider pavement/paint remains authoritative in HD mode. Slab ends extend 1.32 m below flat grade to bury the ramp toes; exposed girders stop before the toes. No footing hangs below grade.

## Costs and checks

| Export | Triangles | Draws | Uncompressed size |
| --- | ---: | ---: | ---: |
| Near | 66,108 | 22 | 3,040,012 bytes / 2,969 KiB |
| Far | 18,104 | 7 | 708,508 bytes / 692 KiB |

Both variants fit the 120k/40/4.5 MB and 30k/10/1.2 MB budgets. No textures, compression extension or decoder. GLB round-trip tests preserve support attachment attributes and material names. Conformance tests compare exact source/export bounds, palettes, finite geometry, costs and far silhouette. Specific tests raycast the two crowns, arch throat and fork holes, probe pedestrian deck width and open side gaps, constrain the ownership envelope, and check both travel directions, approaches and rejected transverse/off-bridge points.

Visual evidence in ignored `tmp/top-cities/shots/margaret-mcdermott-bridge/`: `procedural/*-sheet.jpg` (overview/front/back/above/deck/underside/fork detail); `glb-near-light/*-sheet.jpg`; `glb-far-dark/*-sheet.jpg`. All sheets were opened. The first export exposed excessive triangle cost in densely sampled repeated girders; reduced approach sampling and simplified far underside, preserving the silhouette and foot openings. Final exported near/far, light/dark sheets are in `final-near-light/`, `final-near-dark/`, `final-far-light/`, and `final-far-dark/`; the combined `final-reference-comparison.jpg` places those views beside all three supplied reference photos and was opened. A subsequent mechanical QA correction removed eight hidden, ground-level arch-cap triangles overlapping the footings; no visible silhouette changed. `qa-metrics.json` reports no issues, 0% near backface hits and only 0.1 m² minor rail-to-path contacts. The final focused command passed all 103 tests (four landmark-specific); `node scripts/asset-catalog.mjs`, `pnpm assets:check`, `pnpm assets:preview` and the bundle build passed. Independent visual reviewer signoff is pending the coordinator's review.

## Integration evidence

Cityscape: **verified for local model loading, near/far rendering, approach continuity and height queries** on port 3270 with Protomaps standard roads from `tiles.codriver.io`; HD pavement/paint not tested. Full 3D world: **verified for model loading, DEM fitting and height queries**, with a west-toe placement limitation below; full terrain/HD rollout certification remains not tested. Terrain port 3272 uses AWS Terrarium tiles, tile size 256, maximum zoom 15. No product gate or shared renderer changes.

The bundle used for these checks was built locally (stamp `03783345932d`). `app-shot.mjs` captured far/near/street at the bridge plus both approaches in both directions, with the exact approach centres `[-96.8222146289,32.7694202964]` and `[-96.8136962211,32.7711397953]`, bearings 76.6° and 256.6°. `app-modes-sheet.jpg` and `approaches-sheet.jpg` were opened. The bridge is visible in both LODs, its fallback decks meet the mapped approach area without a visible vertical discontinuity in Cityscape, and no duplicate generic elevated deck is visible. The standard-provider road widths differ from the authored fallback cross-section; complete lane-width/paint continuity requires the unavailable HD provider. Ad-hoc `spot-*` reports intentionally cannot identify a layer by their custom camera label, so their `active:false` field does not mean the visible bridge is unloaded; the dedicated bridge reports and surface checks confirm it is active.

Live `window.__map.landmarks.heightAt(lng,lat,heading)` samples, west-to-east stations in metres, tested at lateral -28/+30 m in both directions:

| Station | Cityscape, both lanes | World, north lane | World, south lane |
| --- | ---: | ---: | ---: |
| 0 | 0 | 1.09624 | 0.29516 |
| 125 | 9.906 | 5.90922 | 4.77343 |
| 250 | 19.812 | 13.32210 | 13.79075 |
| 500 | 19.812 | 16.72098 | 16.54715 |
| 750 | 19.812 | 18.64981 | 18.87451 |
| 875 | 9.906 | 7.41495 | 7.11468 |
| 1000 | 0 | -0.00034 | 0.00036 |

These API values are **height above the local rendered terrain** in world mode, not absolute elevations. Terrain is resident, `_ground` exists, `_terrainReady` is true, and the fitted approach datums are 128.309091/122.978011 m. The river deck is 137.812 m absolute under the estimated datum. Heading reversal produces the same height for each point. The central gap and lateral 80 m return null in both modes. Full JSON evidence is in `app-cityscape/surface-check.json` and `app-world/surface-check.json`.

The west toe inherits an up-to-1.10 m lateral terrain offset because the shared absolute-deck approach is transverse-level while local DEM height varies across the 130 m corridor. This is an explicit world placement limitation, not a claimed seamless terrain endpoint. No shared-file extension was made. Actual HD paint, real route/car motion, paint toggles, lifecycle failure injection and MCU device performance remain not tested.

The runtime layer uses `createRegistryBridgeLayer`, so loading, LOD, road clipping, height queries, fitted HD overlays and reversible masks use the existing shared bridge lifecycle. A custom `_surface` tags terrain surfaces to select the separate world datum. Catalog readiness establishes asset delivery, not terrain certification. Local `/osm-lanes` lacks Redis (503), so actual HD paint and MCU hardware behavior cannot be certified by this local run.
