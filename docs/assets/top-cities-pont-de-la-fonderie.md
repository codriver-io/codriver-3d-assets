# Pont de la Fonderie, Caen

Original procedural road-fitted model of the current steel swing bridge in its closed position. The bridge joins Avenue de Tourville to the Presqu’île at the canal entrance beside Bassin Saint-Pierre. The delivered finish is red following the September 2023 restoration, not the older blue graffiti-covered finish in the supplied dossier.

## Identity and sources

[Ports de Normandie](https://portsdenormandie.fr/fr/node/961) dates the current structure to 1952; [Caen la mer](https://caenlamer.fr/actualites/pont-de-la-fonderie-travaux-de-renovation) says in service 1951. These are recorded as a one-year discrepancy, not silently reconciled. The lead’s 1854 date refers to the historic crossing, not a substantiated construction date for this steel structure. The [municipal Caen Mag 230](https://caen.fr/sites/default/files/2023-11/CAENmag230_planches.pdf) confirms red repaint and reopening on 29 September 2023. An unchanged bridge surviving 1944 and six daily openings are not asserted for the current structure: the operator lists three regular departures and a seasonal additional opening.

The provided Commons contact sheet was inspected: Jérémy Qtn, “Pont de la fonderie.jpg”, CC BY-SA 4.0, supplies the older silhouette; Viault, “Port de Caen 382.JPG”, CC BY-SA 3.0, shows port context, not this bridge. Two [2023 restoration photos](https://portsdenormandie.fr/fr/actualites/port-de-caen-ouistreham-repose-du-pont-de-la-fonderie), © Ports de Normandie / © Eric Destable, were downloaded only to ignored reference scratch. No redistribution licence is assumed for those photos and no photo, texture or third-party mesh ships. Those photos establish red plate-girder sides, stepped counterweight tail, stiffener/rivet rhythm, underside floorbeam/X-bracing and the bank-side circular slewing bearing. The supplied “central pivot” wording is interpreted as the central bearing under the deck width; the photos show it on the NW bank side along the span, not a channel-obstructing mid-channel pier.

## Dimensions and frame

| Parameter | Value | Basis |
| --- | --- | --- |
| Current road span | 22.775 m | OSM way 234575726, measured without rescaling |
| Structural deck width | about 9.96 m; authored 9.85 m inside outline | OSM outline 234575732, slight skew |
| Orientation | about 126.8° NW to SE | mapped road endpoints |
| Road lanes / markings | 2 / no markings | OSM tags; authored road width 6 m estimated |
| Navigation channel | 12 m tagged | OSM seamark:bridge:clearance_width; approximate open geometry 12.54 m |
| Deck in flat Cityscape | 1.55 m | photographic estimate / flat-map compromise |
| Solid main girder | 1.55 m above deck, 0.49 m below | photographic estimate |
| Counterweight tail | 3.1 m long, top 0.64 m above deck | photographic estimate |
| Pivot station / bearing diameter | 5 m from NW structural end / 7.70 m | photographic estimate |
| Highest safety rail | 3.555 m | photographic estimate |
| Approach ramps | 22 m at both ends; maximum grade 7.38% | mapped approach length / constant grade with 1 m vertical curves |

Origin `[-0.35227315, 49.18295345]` is the midpoint of the mapped structural road endpoints. Real metres, +X east, +Y up, +Z south; y=0 is local grade. Orientation is baked once. Original OSM extract is retained in ignored `tmp/top-cities/pont-de-la-fonderie/osm-alignment.json`; attributed roadway/approach coordinates are in the landmark-owned alignment module. The outline is skewed laterally by approximately 0.5 m across the span; deck edges follow that skew. FOOTPRINTS contains only the original bridge outline, no neighbouring buildings. Full-width bank approaches extend beyond it as part of the road surface, including their concrete walks. They maintain the authored 9.85 m deck width for the inner 14 m and smoothly blend to the six-metre road over the outer eight metres; their endpoint locations and mapped bends are unchanged. No absolute elevation is baked in; `terrainPolicy: bank-fit` avoids flattening the canal and separately grounds supports.

## Model and delivery

Seven merged semantic materials: red steel, darker red edge straps, charcoal iron, grey stone, light concrete, asphalt and red rail. Night dims these surfaces; no decorative self-lighting is invented. Near adds hexagonal rivets, denser stiffeners/floorbeams and stone joints; far retains solid stepped sides, open upper safety rails, both bank supports, counterweight, turntable and under-deck bracing. No photo graffiti, construction cranes, temporary footbridge, port buildings or opening animation is included.

The profile and `createRegistryBridgeLayer` own structure fitting, standard-road masking, live HD pavement retention and route/car/camera deck heights through the existing shared contract. No shared-file change is needed. Bank sizes, signal housings, rivet spacing, girder sections and every vertical dimension remain approximate; this is a visual model, not a survey.

## Independent review fixes

The independent review in `tmp/top-cities/review/pont-de-la-fonderie/REVIEW.md` requested four changes. No second review or Prepare command was supplied; preparation was rerun with `qa-metrics.mjs --ids pont-de-la-fonderie --out tmp/top-cities/review/pont-de-la-fonderie/metrics.json` and `qa-sheet.mjs --ids pont-de-la-fonderie --out tmp/top-cities/review/pont-de-la-fonderie`. The sheet reference cache now contains the current 2023 red photo rather than an absent Wikipedia image. Two geometry look/fix iterations were used.

- Pivot and counterweight: the partly hidden 5.76 m × 0.22 m bearing becomes an exposed 7.70 m × 0.35 m charcoal iron disc above lowered NW bank wings. The low tail gains a 0.16 m deep charcoal cap and dark end plate. Its station, deck contact and open channel remain unchanged. Both dimensions remain photographic estimates chosen to make the swing mechanism read; the inspection camera now looks below the girder at the bearing.
- Approaches: the six-metre grey planks become full 9.85 m asphalt foundations carrying continuous concrete walks, with rounded width transitions to the six-metre live road. Mitered cross-sections at the mapped bends remove the tapered corner wedge; structural endpoints use the span tangent. Both closed endpoint caps meet y=0. The walks are inset 0.06 m from the asphalt shoulder and their underside is separated to eliminate cross-material coincident faces.
- Steel sides: main plates rise from 1.30 m to 1.55 m above the deck, matching the taller panels in the red restoration photo; the main top flange deepens from 0.07 m to 0.11 m. Safety rails move up with the plate, preserving their open silhouette. The short low counterweight step remains 0.64 m.
- Ramp profile: the full-rise smoothstep peak of 10.57% becomes a 7.38% tangent grade with one-metre parabolic vertical curves. Both 22 m lengths, mapped roadway joins, 1.55 m flat deck and runtime endpoint datums are preserved. The shared heading/corridor/road-width acceptance is reused; no shared bridge module is changed. Tests now use the actual endpoint travel headings and explicitly require numeric height results, including nonzero live bank datums.

## Verification evidence

Built with `pnpm build:top-cities-landmarks pont-de-la-fonderie --no-check`. The requested `node --test src/peregrine/landmarks/top-cities/top-cities.test.js src/peregrine/landmarks/top-cities/pont-de-la-fonderie/pont-de-la-fonderie.test.js` passes all 293 tests, including seven landmark-specific tests. The landmark-only run takes approximately 0.16 seconds. `node scripts/asset-catalog.mjs` passes: 222 records / 414 GLB variants; `pnpm assets:preview` builds the local inspector into ignored `tmp/champlain-preview/`.

| LOD | Triangles | Draws | Bytes | KiB (build output calls these KB) |
| --- | ---: | ---: | ---: | ---: |
| Near | 26,912 | 7 | 1,254,308 | 1,225 |
| Far | 5,804 | 7 | 174,192 | 170 |

`qa-metrics.mjs --ids pont-de-la-fonderie`: zero cross-material coplanar overlaps, zero back-face hits in 168 exterior-hit rays, lowest point −0.045 m (thin road underside at the flat ramp endpoint), maximum 3.555 m, matching near/far bounds. Custom deck/foundation attachment weights survive GLB round-trip; no textures or decoders. Tests observe the mapped girder length/orientation, tail step, two solid red sides, raised walks, six-metre road, exposed circular bearing, unobstructed channel, support contacts, grade joins, heading rejection, footprint containment and exports.

Initial delivery sheets and supplied Commons references were inspected before review. For this revision, looked at the newly prepared `tmp/top-cities/review/pont-de-la-fonderie/pont-de-la-fonderie.jpg` and `tmp/top-cities/shots/pont-de-la-fonderie/review/export-reference-contact-sheet.jpg`: exported near/far and light/dark facade, back, plan and pivot, plus near deck, underside and rivet detail beside both red 2023 photographs. Main sides now read taller; the tail cap is clearly charcoal and the dark circular bearing is exposed below the girder. Far retains those features and the open safety rail. Broad approaches follow the mapped turn and taper into the road; the first review look's walk/asphalt overlap was removed before the final sheet. The final metrics report has zero coplanar overlaps, zero back-face hits and no issue flags. Pivot diameter, approach bank details and understructure remain estimates rather than surveyed geometry.

Revision app checks use feature baseline `61435cc8`, rebuilt Peregrine stamp `4cd5066d9eb8`, Protomaps standard tiles from `tiles.codriver.io`, Cityscape port 3278 and Terrarium DEM world port 3280. `app-shot.mjs --ids pont-de-la-fonderie --shots far,near,street` reports active far / near / near in both modes. Ad-hoc checks at NW `[-0.3524413126592204,49.18303723020661]` bearings 130.15° / 310.15° and SE `[-0.3520969073597201,49.182880945538535]` bearings 278.05° / 98.05°, zoom 20.1 / pitch 76, cover both approaches in both directions. The latest `tmp/top-cities/shots/pont-de-la-fonderie/review/app-contact-sheet.jpg` was looked at: far/near/street and all four approach views per mode; no visible road endpoint step, gap or duplicated generic deck.

Cityscape **verified locally** for active near/far, approach continuity, standard-road replacement and height agreement. Full 3D world **verified locally** for the same cases on Terrarium DEM with active bank-fit ground; the canal is not flattened. These checks do not establish surveyed vertical accuracy. Both modes' `height-verification.json` retain ten centerline samples in both travel directions, active state, ground availability and masks. Both directions return identical heights; off-corridor d=8 m and transverse heading 36.8° return null. Twenty-three standard-road triangles are masked in each sampled scene; no HD overlays are present.

Actual rendered asphalt was measured in model metres after subtracting world ground once. Maximum pavement/query residual is below 0.001 mm in Cityscape and 9.45 mm in world (terrain interpolation near the SE ramp); at the two outer road joins it is below 0.001 mm in both modes. The wider walks do not alter central lane ownership or navigation queries.

| Station from NW ramp end (m) | Cityscape height (m) | World height relative to ground (m) | World pavement minus query (mm) |
| ---: | ---: | ---: | ---: |
| 0.000 | 0.000000 | 0.000000 | 0.000 |
| 1.000 | 0.036905 | 0.036905 | 0.000 |
| 21.000 | 1.513095 | 1.513095 | 0.000 |
| 22.000 | 1.550000 | 1.550000 | 1.437 |
| 27.000 | 1.550000 | 1.575503 | -0.000 |
| 33.388 | 1.550000 | 1.552878 | 0.000 |
| 44.775 | 1.550000 | 1.550000 | -1.094 |
| 45.775 | 1.513095 | 1.513326 | -9.449 |
| 65.775 | 0.036905 | 0.035868 | -0.813 |
| 66.775 | 0.000000 | 0.000000 | -0.000 |

HD pavement/paint **not tested**: local `/osm-lanes` returns 503 without Redis; standard roads and authored fallback asphalt were checked. Actual GPS car, live traffic, route rendering, halo/camera motion, paint toggles, missing/late terrain, failed load, lifecycle/reanchor stress and Tesla hardware **not tested**. Height API agreement supports their shared deck contract without claiming those flows were driven. Ordinary unauthenticated API CORS/401/404 messages are separate from successful static landmark loading. No shared-file extension, rollout change or online deployment was needed.
