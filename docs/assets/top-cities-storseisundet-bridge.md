# Storseisundet Bridge, Atlantic Ocean Road

Original procedural model of Storseisundbrua between Averøy and Hustadvika, Norway: the three-span concrete cantilever bridge built in 1988 on the Atlantic Road, which opened in 1989. Its steep, sideways-curving hump makes the roadway appear to end in midair when approached. Two rectangular piers, a variable-depth box girder, slim galvanized guardrails and engineered rock-fill approaches retain that silhouette in both exported LODs. Source lives in `src/peregrine/landmarks/top-cities/storseisundet-bridge/`; no scan, traced mesh, photograph or texture ships.

## Sources and dimensions

[Riksantikvaren's Atlantic Road protection dossier](https://riksantikvaren.no/content/uploads/2022/11/Vedlegg-29.16-Atlanterhavsvegen.pdf) identifies a 260 m, three-span concrete free-cantilever bridge, built in 1988, with about 23 m sailing clearance and a sharp curve over the bridge hump. The supplied [Wikipedia dossier](https://en.wikipedia.org/wiki/Storseisundet_Bridge) gives the 130 m main span and 1989 road opening. These are structural references, not a surveyed vertical alignment. The lead's supplied OSM extract was reused, not re-fetched; no Overpass/network queue request was needed.

| Feature | Authored / reference value | Basis |
| --- | --- | --- |
| Published structural length | 260 m | Riksantikvaren, supplied dossier |
| Mapped structural length | 264.259 m | OSM roadway 123498061, retained without rescaling; 1.64% longer |
| Main support-centre span | 130 m | Supplied main-span fact; positions registered around mapped bridge midpoint |
| Side support-centre spans | 67.130 / 67.130 m | Remaining mapped length divided equally, estimate |
| Fitting corridor | 624.259 m | Mapped bridge plus 180 m of roadway at each end |
| Structural / vehicle width | 7.4 / 6.3 m | OSM outline and two-lane photographic proportions; estimate |
| Central soffit clearance | 23.0 m above authored grade | About 23 m published sailing clearance interpreted at the central soffit |
| Road crest / rail top | 25.2 / 26.35 m | Crest includes estimated 2.2 m slab/box depth; not a published road elevation |
| Abutment road height | 13.0 m | Photograph-based flat-map compromise, not survey |
| Box depth at pier root / crown | 7.4 / 2.05 m below the flange top | Photo estimates, plus 0.15 m flange datum below pavement |
| Pier shaft / footing | 2.7 × 4.9–5.5 m / 5.3 × 6.1 × 0.8 m | Photo estimates; no underwater pile model |
| Approach peak grade | 10.83%, two 180 m ramps | Shared smooth profile from grade to abutments |
| Central hump peak grade | 13.85% | Shared smooth profile, 12.2 m rise in 132.13 m on each side |
| Rock-fill slope | About 0.65 m outward per metre of height | Engineered support approximation; surrounding islands/terrain omitted |

The four dossier photographs were actually studied: [Storseisundet bridge.jpg](https://commons.wikimedia.org/wiki/File:Storseisundet_bridge.jpg), Iwoelbern, public domain; [Storseisundet Bridge 2.jpg](https://commons.wikimedia.org/wiki/File:Storseisundet_Bridge_2.jpg), Ernst Vikne, CC BY-SA 2.0; [Atlantic Ocean Road.jpg](https://commons.wikimedia.org/wiki/File:Atlantic_Ocean_Road.jpg), CHG, CC BY 3.0; and [Storseisundbrua, Atlanterhavsveien, Norway 20170531.jpg](https://commons.wikimedia.org/wiki/File:Storseisundbrua,_Atlanterhavsveien,_Norway_20170531.jpg), dconvertini, CC BY-SA 2.0. Commons reference pages and licensing fields were checked. All reference files remain in ignored dossier scratch, outside delivered source and exports.

## Frame, road fitting and construction

Origin `[7.3545931, 63.0167825]` is an OSM roadway control point near the structural midpoint. Geometry is metric east/up/south; station increases west to east. OSM ways 123498060, 123498061 and 751715045 supply the winding road, including approaches. Structural endpoints are `[7.3522021,63.0165475]` and `[7.3571739,63.017251]`, approximately bearing 65° overall. The centreline's lateral curve is retained; rotation is baked into the geometry once. The immutable mapped points and outline are in `storseisundet-bridge-mapped.js`; a copy of the original extract is in ignored `tmp/top-cities/storseisundet-bridge/osm.json`.

`FOOTPRINTS` contains OSM bridge outline 1159266079; the same ring is passed as `buildingFootprints`. No building or building-part way was present in the supplied extract. Bridge geometry is checked against that mapped envelope with 0.65 m tolerance for rails/support edges. The rock-fill fitting approaches lie along roadway outside the structural ring; they are engineered fill, not building footprints or baked DEM terrain.

`PROFILE` is shared by the girder, fallback road, provider road fitting and navigation in both directions. The standard `createRegistryBridgeLayer` owns GLB loading, LOD swaps, provider structure replacement and accepted road heights. `clipStandardEnds` is enabled. The `'absolute-deck'` terrain policy preserves the bridge's authored deck, blends fitting endpoints into the live ground and adapts individual foundations/shafts. No shared bridge module was changed.

The girder is a closed loft with a projecting top flange, beveled web shoulders and a narrow bottom box; its depth increases quadratically toward each pier. This is a cantilever haunch, not a separate load-bearing arch. Shafts contact the girder roots; the navigation channel is open beneath the 130 m main span. Near includes W-section galvanized barriers, upper parapet rails, closely spaced posts/base plates/reflectors and embedded faceted fill stones. Far retains the same box profile, piers, curve, hump and parapet outline, with fewer posts and simpler rail sections. Repetition is merged by material. Closed surface lofts discard degenerate triangles and merge vertices with identical normals; ground-hidden fill bottoms are omitted to avoid coplanar overlap.

Material palettes use weathered grey concrete, darker bearings/soffit trim, grey asphalt, galvanized rail, white edges and yellow centre dashes, and grey-green fill. Dark palettes dim these materials; no invented floodlights are added. Provider pavement determines the application's fallback asphalt colour. Near uses eight draws; far folds minor rock and line finishes into six. Fixed feet carry attachment weight 0, deck/rails carry 1, shafts and fill interpolate; the GLBs retain `_BRIDGELIFT` (loader `_bridgelift`).

## Export, tests and visual evidence

| Variant | Triangles | Mesh draws | Bytes | KB (1024 bytes) |
| --- | ---: | ---: | ---: | ---: |
| Near | 47,668 | 8 | 3,072,324 | 3,000.32 |
| Far | 13,212 | 6 | 751,324 | 733.71 |

Both are within the bridge caps with headroom. Maximum y is 26.35 m in each; near minimum y is -0.202 m from embedded rock vertices hidden below grade, far minimum is zero within floating-point tolerance. The near/far geographic bounds agree. QA reports zero different-material coplanar overlap pairs and 0% back-face hits among 47 outside-in rays; that sparse sweep complements targeted raycasts and visual inspection, and is not a proof of every surface.

Actually looked at these local artifacts against the dossier reference photos:

- `tmp/top-cities/shots/storseisundet-bridge/iteration1/storseisundet-bridge-procedural-near-light-sheet.jpg`: overview, both sides, above, both roadway approaches, underside, pier detail and railing detail.
- `tmp/top-cities/shots/storseisundet-bridge/final/exports-vs-references.jpg` and `exports-vs-references-compact.jpg`: reference photographs beside exported near-light, far-dark, near-dark and far-light views. Full initial near-light/far-dark sheets include all nine views; the final near-light recapture includes six views; alternate themes include both sides, road and pier.
- `tmp/top-cities/shots/storseisundet-bridge/app-modes.jpg`: real application Cityscape and world, far/near/street views.
- `tmp/top-cities/shots/storseisundet-bridge/app-approaches.jpg`: both fitting endpoints, both directions, Cityscape and world.

The first inspection exposed a curb-to-slab gap; the curb now overlaps the flange. Flat decorative rock panels were replaced with embedded faceted stones. Deterministic QA then found overlapping hidden slab/fill bottoms, which were removed; reflector placement was adjusted, degenerate endpoint triangles removed and loft vertices merged. Final exports preserve the distinctive curving hump, open channel and deep support-root haunches. Surrounding vegetation, rocks/islands and exact signs are omitted; abutment elevations, pier geometry and rail sections remain estimates. Independent reviewer PASS is pending.

`node --test src/peregrine/landmarks/top-cities/top-cities.test.js src/peregrine/landmarks/top-cities/storseisundet-bridge/storseisundet-bridge.test.js` passes all 210 tests in about 8.8 s; the five dedicated tests take less than 0.7 s. They pin measured geometry: crest and 23 m soffit, the open channel, pier/box contacts, both LOD pavement chords within 6.5 cm of navigation, mapped containment, sourced span spacing, grade limits, crossing/off-road rejection, named materials/normals and GLB attachment weights. `node scripts/asset-catalog.mjs`, `pnpm assets:check`, `pnpm assets:preview` and focused `qa-metrics.mjs --ids storseisundet-bridge` pass. Bundle `ac8c333e8e5e` was built for local app verification; generated application bundles are excluded from the delivered change.

## Application integration evidence and remaining matrix

Local slot B, ports 3274 / 3276, Protomaps/OSM standard roads; world uses AWS Terrarium 256 px tiles, maximum zoom 15. `app-shot.mjs --ids storseisundet-bridge --shots far,near,street` successfully loaded far and near GLBs in both modes. Additional `--at` captures cover both fitting endpoints in both directions. The ad-hoc reports' `active: false` describes each synthetic `spot-*` id, not the visible bridge; the bridge's own reports and probes show `active: true`. Endpoint sheets show the fallback surface meeting the at-grade streets; no duplicate generic deck is visible.

Cityscape: **verified locally for standard-road placement, both fitting endpoints/directions and navigation height API**. Full 3D world: **verified locally for live terrain, rigid central span, support placement and navigation height API**. The broader lifecycle/HD matrix remains not tested. Terrain is not flattened along the bridge corridor; the real bank terrain hides much of the approximate authored fill and some embedded stones at its edges, so exact bank/fill-edge appearance is not certified.

The scratch `app-probe-cityscape.json` and `app-probe-world.json` record 38 stations per mode. Every forward/reverse sample answered identically, with no nulls; all 38 perpendicular headings and an off-road point returned null. Cityscape approach offsets are zero. World had `_terrainReady=true`, a live ground sampler and endpoint ground elevations 2.925 / 3.710 m. In world, `heightAt` returns height above shared local ground; the central structure remains fixed above its authored datum.

| Station | Cityscape forward / reverse (m) | World forward / reverse above ground (m) |
| --- | ---: | ---: |
| 0, west fitting endpoint | 0 / 0 | 0 / 0 |
| 180.00, west abutment | 13.000 / 13.000 | 2.823 / 2.823 |
| 247.13, west pier | 19.247 / 19.247 | 19.108 / 19.108 |
| 312.13, crest | 25.200 / 25.200 | 25.197 / 25.197 |
| 377.13, east pier | 19.247 / 19.247 | 15.973 / 15.973 |
| 444.26, east abutment | 13.000 / 13.000 | 0.423 / 0.423 |
| 624.26, east fitting endpoint | 0 / 0 | 0 / 0 |

These probes verify the surface consumed by navigation; an actual followed car/route was not driven. HD lane pavement/paint is **not tested**: local `/osm-lanes` returns 503 without Redis. Lane count, dash phase, HD overlay clearance, actual car/traffic/halo/camera driving, paint switches, terrain late/missing/replaced/negative/exaggerated cases, 2D/mode toggles, failure/load restoration, leave/return, reanchor and hardware cost are not verified. A terrain endpoint sheet exposed fill crest vertices using partial deck weights; these now carry full deck attachment while the base stays on ground, with an additional fitted-contact regression test and fresh world captures. The local account/entitlement CORS errors are recorded in app-shot reports. No rollout gate or shared renderer was changed, and no online deployment was made. Local servers are stopped after capture; deliverables remain uncommitted for coordinator review.
