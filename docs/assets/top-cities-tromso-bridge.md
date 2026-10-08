# Tromsø Bridge (Tromsøbrua)

Original procedural model of the permanent 1960 cantilever concrete bridge across Tromsøysundet, from Tromsøya to Tromsdalen. Aas-Jakobsen designed the structure with architect Erling Viksjø. This asset depicts the historic 8.3 m cross-section and the safety fencing visible in the supplied 2008 and later photographs. The 2026 cycleway widening, temporary closure, scaffolding and worksite traffic controls are excluded. The Arctic Cathedral is a separate landmark and is not modelled.

## Evidence and dimensions

The supplied dossier was used directly: `osm.json`, `facts.txt`, `refs-sheet.jpg`, and all six attributed reference photographs. No additional photos were fetched and no new Overpass query was needed. OSM road way 38705387 provides the continuous alignment, reversed to run west to east. Outline way 467000219 provides the footprint. Original procedural source and texture-free GLBs are the deliverables; no photographs, scanned mesh or third-party geometry are shipped.

| Quantity | Value | Evidence / status |
| --- | ---: | --- |
| Completion | 1960 | [UiT architecture guide](https://arkitekturguide.uit.no/items/show/805) |
| Structural length | 1,036 m | UiT; mapped roadway is 1,043.24 m, preserved without rescaling |
| Historic deck width | 8.3 m | UiT; road surface estimated at 6 m with two 1.15 m walkways |
| Main navigation span | 80 m | [Wikipedia dossier](https://en.wikipedia.org/wiki/Troms%C3%B8_Bridge) and [Tenk Tromsø project](https://www.tenktromso.no/prosjekter/utvidelse-av-sykkelveien-pa-tromsobrua) |
| Navigation clearance | 38 m | Same sources; UiT instead reports 36 m middle height, an unresolved datum/source discrepancy |
| Bays | 58 | Wikipedia dossier; model has 58 intervals with approximate support stations |
| Main pier stations | 430 / 510 m | Photographic estimate from mapped western end; 80 m gap |
| Crest station / road height | 470 m / 39.25 m | Estimated slab depth of 1.25 m above sourced maximum clearance |
| Haunch depth | 1.25–4.75 m | Estimated from underside photographs, paired concrete girder webs |
| Paired shafts | 0.65 m square; main 1.15 × 0.95 m | Estimated; 4.4 m between centres |
| Fence / lamp heights | 2.85 / 8.35 m above deck | Photographic estimates; upper rods curve inward |
| Overall envelope | 47.64 m | Export measurement, includes lamp arms |

The [2026 project source](https://www.tenktromso.no/prosjekter/utvidelse-av-sykkelveien-pa-tromsobrua) describes widening underway from April to November; the OSM dossier also records temporary vehicle restrictions. This model is explicitly the permanent historic state, not a claim that traffic is currently permitted.

Photo titles, authors, licences and checked Commons URLs are recorded in the catalog. References: Federació d'Escacs Valls d'Andorra, *20140731 Arribada a Tromsø* (CC BY 2.0); Kagee, *Tromsøbrua suicide prevention fence 2008-06-28* (public domain); Zairon, *Tromsö Tromsöbrücke 6* and *4* (CC BY-SA 3.0); Andreas Rümpel, *Tromsø Bridge* (CC BY-SA 3.0); Lars Tiede, *Tromsøsund bridge* (CC BY-SA 2.0). Reference images stay in ignored scratch.

## Model and shared road frame

Source lives in `src/peregrine/landmarks/top-cities/tromso-bridge/`. Origin is `[18.97813, 69.6513]`; axes are east/up/south, real metres. Station increases west to east and positive lateral offset is to the right. The OSM straight section bears about 123°; the eastern end curves south toward Bruvegen. Rotation is baked into both exports, without latitude or DEM heights in vertices.

One profile supplies geometry, pavement, route, car and camera heights. Both shores rise toward the high hump with 35 m entrance vertical curves, constant grades and a 200 m crest curve. Flat-map crest runs are 470 m west and 573.24 m east; maximum grades are 9.75% and 7.76%. Full 3D world uses `absolute-deck`: loaded shore DEM datums change the approach ends while the 39.25 m crest remains fixed; supports are fitted separately from their immutable authoring coordinates using `bridgeLift` weights (footings 0, shafts interpolated, cap/deck 1).

All piers outside the shipping gap retain separate shafts and open space. Two main protection platforms remain; finer platform posts are near only. The low ramp toes use the asphalt slab and kerbs until the deeper structure starts 30 m inside each end; no faces collapse at grade and no overlapping coplanar material faces remain. Near geometry batches into four station chunks × six materials; far merges to three materials. Far retains every visible support, both haunches, the hump, curvature, safety-fence outline and lamp envelope while reducing rods and dropping paint and fine platform fittings.

Material names: `concrete`, `asphalt`, `rail`, `paint`, `yellow`, `lamp`. Concrete is muted weathered grey; asphalt dark grey; fencing grey steel; road centre paint yellow. Night uses darker concrete and pavement with amber self-lit lamp heads. Wire mesh, exact fence attachment plates, signs, underwater foundations, fine cantilever construction joints and surveyed support spacing are not reproduced.

`layer.js` uses the existing `createRegistryBridgeLayer` factory. `clipStandardEnds` prevents the simplified provider road crossing an abutment from surviving as a duplicate. A 4 m ownership margin includes the separately mapped cycleway/footway beneath the historic model, without widening vehicle height ownership. No shared renderer files were changed.

## Measured delivery

| LOD | Triangles | Mesh draws | GLB bytes | KiB |
| --- | ---: | ---: | ---: | ---: |
| near | 63,856 | 24 | 3,984,940 | 3891.5 |
| far | 13,144 | 3 | 818,972 | 799.8 |

Both LODs have identical bounds, retain `_bridgelift`, named materials and finite normals through the GLB round trip. No texture or decoder dependency is present. Near/far remain below the 120k/40/4.5 MB and 30k/10/1.2 MB bridge limits; counts exclude app terrain/road overlay costs.

## Visual and deterministic verification

Images were opened and judged against the reference contact sheet. Evidence under ignored `tmp/top-cities/shots/tromso-bridge/`:

- `iteration1/tromso-bridge-procedural-near-light-sheet.jpg`: front/back/above, driving deck, underside, main pier and curved approach; confirmed the hump, haunches and open twin supports, then reduced fence samples for budget headroom.
- `iteration2/tromso-bridge-glb-near-light-sheet.jpg`: source/export comparison; adjusted weathered concrete colour and wide camera framing.
- `final-near-light/`, `final-near-dark/`, `final-far-light/`, `final-far-dark/`: exported contact sheets and individual front/back/roof/deck/underside/tower/approach views. Wide silhouette views show the narrow bridge at real scale; close main-pier and approach views are more legible.
- `final-reference-comparison.jpg` and `final-reference-detail-comparison.jpg`: exported near/far, light/dark alongside supplied reference photographs. Far preserves the opening and curved soffit; fencing is deliberately sparse at that distance.

QA metrics: `tmp/top-cities/tromso-bridge/metrics.json`, zero overlapping coplanar material faces, zero outside-in back-face hits in the 17-ray sweep, no below-grade parts and no budget issues. An earlier flagged asphalt/concrete overlap at the grade-clipped toes was removed by stopping deeper structural ribbons inside each approach; collapsed toe cap triangles were removed explicitly. The sweep is coarse and is supported by underside/front/back image inspection.

Focused command passed all 213 tests (including three Tromsø conformance tests and four landmark tests):

```sh
node --test src/peregrine/landmarks/top-cities/top-cities.test.js src/peregrine/landmarks/top-cities/tromso-bridge/tromso-bridge.test.js
node scripts/asset-catalog.mjs
pnpm assets:check
pnpm assets:preview
```

The landmark tests raycast actual deck, soffit, open shipping channel, twin columns, kerbs and cap contacts in both LODs; check the footprint envelope, eastern bend, below-grade geometry, navigation ownership, maximum grade and GLB attachment attributes. The catalog passes with 198 entries / 356 GLB variants. No full test suite ran.

## Local app evidence

Local servers used slot B, ports 3274 (Cityscape) and 3276 (world), with Protomaps/OSM tiles and Terrarium DEM. `pnpm build:peregrine` succeeded; generated bundles are excluded from this landmark commit and the lead rebuilds them after merging. `app-shot.mjs --ids tromso-bridge --shots far,near,street` loaded both LODs in each mode. The app-shot initialization and settle logic was reused in ignored `app-fit.mjs` and `app-approaches.mjs` to inspect both shores in both directions and capture height queries. The synthetic local QA grant did not change production gates.

Evidence under `tmp/top-cities/tromso-bridge/`: `app-city/`, `app-world/`, `fit-city/`, `fit-world/`, `approaches-city/`, `approaches-world/`, `app-sheet.jpg`, `fit-sheet.jpg`, `approaches-sheet.jpg`. Approach files are `spot-{west,east}-{forward,reverse}-street.png`; each directory retains `height-report.json`. The real bridge is active in all four approach captures per mode (custom spot rows in ordinary app-shot's report say active=false because no layer has the spot's name; the accompanying fit report checks the actual Tromsø layer).

Cityscape verified for local placement, standard-road replacement, both LODs and approaches: no vertical step at the road ends, no doubled provider bridge/path remaining in the final `fit-sheet.jpg`. Full 3D world verified for the same cases: both shore climbs meet the terrain, piers reach the river and the crest keeps its independent datum. On the loaded DEM, west/east foot elevations are 4.790 / 18.181 m. The app API returns height *above local ground*, so absolute deck = query height + ground at the river/bridge samples; the world endpoint queries correctly return zero.

| Station m | Cityscape deck/API m | World absolute deck m | World ground m | World API m |
| --- | ---: | ---: | ---: | ---: |
| 0 | 0.000 | 4.790 | 4.790 | 0.000 |
| 35 | 1.707 | 6.288 | 3.690 | 2.598 |
| 100 | 8.045 | 11.853 | 0.723 | 11.130 |
| 430 | 38.470 | 38.565 | 0.000 | 38.565 |
| 470 | 39.250 | 39.250 | 0.000 | 39.250 |
| 510 | 38.629 | 38.917 | 0.000 | 38.917 |
| 900 | 9.759 | 23.419 | 5.328 | 18.091 |
| 1008.24 | 1.358 | 18.910 | 14.349 | 4.561 |
| 1043.24 | 0.000 | 18.181 | 18.181 | 0.000 |

`window.__map.landmarks.heightAt(lng, lat, heading)` agrees in forward and reverse headings at all 11 sampled stations in both modes; crossing headings and points 20 m beside the roadway return null. These are navigation-surface checks, not a live vehicle traversal. Route/car/camera use this same shared surface but moving traffic, halo, picking, lifecycle transitions, late/missing terrain, reanchor stress, Tesla hardware and HD pavement/paint toggles remain **not tested**. The local `/osm-lanes` endpoint returns 503 with no Redis, and all fit reports have zero HD sections. Standard roads were verified; no claim of HD dash/lane continuity is made. Guest API/CORS errors are recorded in the local app reports and did not prevent model/terrain loading.

Independent reviewer acceptance and coordinated merge/release remain with the lead. This work does not deploy staging or publish inspection tools.
