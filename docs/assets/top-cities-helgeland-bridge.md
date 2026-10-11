# Helgeland Bridge — Helgelandsbrua

Original procedural model of the current **1991 Fv17 crossing of Leirfjorden**, between Leinesodden in Leirfjord and Alsta in Alstahaug, Nordland, Norway. Its identity comes from two unequal concrete pylons with modified-diamond legs, a deck-level crossbeam and long tapered openings, twin deck-edge stay planes, a slim concrete deck and slender approach piers. The surrounding fjord and mountains belong to the terrain renderer; they are not baked into this reusable asset.

Build: `pnpm build:top-cities-landmarks helgeland-bridge --no-check`.
Inspect: `/asset-preview.html?asset=helgeland-bridge&view=overview`.

## References and dimensions

The supplied OSM/facts dossier and four-photo contact sheet were read first. The checked primary architectural reference is the [University of Tromsø architecture guide](https://arkitekturguide.uit.no/index.php/items/show/1146): it identifies the designer as Aas-Jakobsen / Holger Svensson, describes **modified diamond** towers, gives their unequal **127.5 m and 138 m** heights, and records the 425 m main span, 1,065 m total length and 1989–1991 construction. Thus these are not two identical straight H portals; their deck-level tie and open tapered legs carry the H-like recognition cue in the supplied task.

[The supplied Wikipedia dossier](https://en.wikipedia.org/wiki/Helgeland_Bridge) supplies the 12 m width, two lanes, 12 spans and 45 m navigation clearance. UiT instead gives 43.5 m clearance: those figures are retained as conflicting published references, not treated as a vertical survey. The model uses a visual 46.2 m tower-level roadway and a slight main-span camber. Published dimensions and interpreted details are separated below.

| Quantity | Model | Basis |
| --- | ---: | --- |
| Version / completion | Current 1991 crossing | UiT |
| Total structural length | 1,065.517 m mapped | Published 1,065 m; OSM roadway endpoints |
| Main tower separation | 425 m | UiT published main span, inferred tower stations |
| North / south crown | 138 / 127.5 m | UiT heights; assignment of taller tower to north from dossier NE photo |
| Deck platform width | 12 m | Supplied facts; cross-section interpretation |
| Tower-level road / center peak | 46.2 / 47 m | Visual datum and 0.8 m camber estimate |
| Navigation clearance reference | 45 m; UiT gives 43.5 m | Conflicting published references; not surveyed here |
| Central / outer slab depth | 0.40 / 1.20 m | Visual section interpretation, approximate |
| Side cable section | 177.5 m each | Estimate consistent with mapped ~795 m cable section |
| Stays | 144 near / 80 far | 18 per half-fan near, 10 far; photographic estimate, not a sourced cable inventory |
| Stay radius | 0.115 m near / 0.16 m far | Visual estimate, far visibility concession |
| Pylon along section | 6 m at base / 4.2 m at crown | Photographic estimate |
| Pylon transverse leg center | ±3.4 m at base, ±8.3 m at deck, ±1.1 m at crown | Photographic interpretation |
| Approach blade supports | 10 estimated stations, plus 2 pylons | Simplified visible support rhythm, not a surveyed 12-span schedule |
| Alignment incl. land roads | 1,924.094 m | Mapped Fv17 roadway, distinct from bridge length |
| North / south flat rising lengths | 795.463 / 613.631 m | Flat-map convention, tower-to-45 m endpoint landing |
| Maximum flat grades | 6.1562% / 8.1248% | Constant grades, with 45 m quadratic vertical curves |

Reference-only Commons photographs used for visual comparison:

- [Helgelandsbrua](https://commons.wikimedia.org/wiki/File:Helgelandsbrua.jpg), Heiko Hübscher, CC BY-SA 2.5; author, NE viewpoint and licence checked on the Commons file page.
- [Helgelandsbrua-2006-07-02](https://commons.wikimedia.org/wiki/File:Helgelandsbrua-2006-07-02.JPG), ZorroIII, CC BY 2.5; Commons file page checked.
- 20240720 Helgelandsbrua - 5039, Zinnmann, CC BY-SA 4.0, and Helgelandsbrua & Leirfjorden, Ximonic / Simo Räsänen, CC BY-SA 3.0: licences supplied by the dossier.

No additional photograph was fetched, and no photograph, texture, capture or traced third-party mesh ships in the source or GLBs.

## Geographic and road contract

Local real metres, +X east / +Y up / +Z south, around `[12.72017,66.038]`. Local y=0 represents visual water / flat-map grade; deeply submerged foundations are omitted. Increasing station runs **north mainland to south Alsta**. Positive lateral is west on the main span. Main bearing is approximately 167.9° from true north. Orientation and approach curvature are baked into vertices through `PROFILE.bridgePoint`; runtime applies geographic stretch once.

Mapped Fv17 ways **521526918, 1024141098, 521526917, 25030008, 25155090** form one continuous alignment, including land road at both ends. The original dossier extract is retained as ignored `tmp/top-cities/helgeland-bridge/alignment-osm.json`. No further Overpass request was required. Bridge outline **654218196** supplies the footprint; nearby path 1112092111 is excluded. The dossier contains no building-tagged pylon/pier outline requiring a separate provider-building mask. Physical bridge limits are stations 562.450–1627.968 m. Tower stations are 840.463 / 1265.463 m, inferred from the cable-section boundary and published span; their exact geographic positions are not independently surveyed.

The concrete platform is 12 m wide, with a raised western walkway and an asymmetric vehicle band `[-5.45,3.3]` m. Pylon legs sit outside the lanes. Their footings and the deck-level tie extend beyond the mapped deck outline intentionally: FOOTPRINTS represents mapped provider ownership, not a fabricated wider OSM polygon. The extra flat-map approach roadway extends beyond the structural footprint deliberately. These ramps have no claim to reproduce the physical bank elevations. Both end landings use live approach datums; the main span retains its authored road height and camber.

`ROAD_LAYER = createRegistryBridgeLayer(PROFILE, PALETTES)` uses the shared road replacement, approach fit, HD overlays and navigation API. `terrainPolicy: 'absolute-deck'` avoids flattening a corridor through the fjord banks. World mode keeps the authored main deck, samples local support feet and joins ramp ends to the DEM. It does not drape the bridge through the fjord. Each footing has attachment weight zero; shafts interpolate toward one; deck, rails and cables follow the accepted deck. Shared fitting restores immutable authoring vertices on every revision.

## Geometry and LOD

Two closed chamfered multi-level leg lofts form each modified diamond. The deck-level crossbeam lies below the road. A small crown tie closes the upper aperture while retaining the tall open portal and lower opening in both LODs. Eighteen stays per longitudinal half-fan connect each tower's two legs to deck-edge anchorages. Cable ends overlap concrete and steel landing blocks. Near includes protection sleeves and small stay collars; far preserves outer anchors and the two planes while sampling alternate cables.

The slim slab is a closed six-point transverse section, with a thin middle and deeper edges. A gently cambered central road and densely sampled constant-grade approaches share one surface. Ten simplified blade piers have grade footings, closed shafts and transverse caps in contact with the slab; the 425 m main channel is pier-free. Closely spaced rail posts, walkway separation, yellow fallback centerlines, modest streetlamps and anchorage hardware carry the driving-visible detail. Exact approach span division, pier shapes, stay inventory, crown access hardware and engineering dimensions are approximations.

Near merges repeated members by material and three station chunks; far merges chunks, keeps the diamond openings, deck profile, piers and cable planes, removes rail posts/cable sleeves/collars and reduces cable facets. Materials: `tower`, `concrete`, `cable`, `steel`, `asphalt`, `paint`, `rail`, `lamp`; both palettes use the same names. Night dims the structure and leaves only lamp heads self-lit. No tower floodlighting is invented.

## Export and visual verification

| LOD | Triangles | Draws | Bytes | KiB |
| --- | ---: | ---: | ---: | ---: |
| Near | 65,240 | 20 | 3,009,708 | 2939.2 |
| Far | 16,656 | 7 | 455,788 | 445.1 |

Both variants have matching bounds: x −257.605..347.186 m, y effectively 0..138 m, z −792.202..599.361 m. Measured GLB costs include bridge attachment weights and exclude runtime provider overlays; hardware performance is unmeasured.

Images actually opened and judged, under `tmp/top-cities/shots/helgeland-bridge/`:

- `iteration-1/helgeland-bridge-procedural-near-light-sheet.jpg`: overview, front/back, above, deck, tower, footing detail and underside.
- **`final/reference-and-export-sheet.jpg`**: supplied NE and broadside reference photos beside exported near front/back, above, driving, tower/footing/underside views, and near/far light/dark overview/tower views.
- `app-modes-sheet.jpg`: actual app far, near and street in Cityscape / Full 3D world.

First inspection confirmed the lower and upper diamond openings and slim deck. It exposed an eye below the approach pavement; the driving camera was raised above its sampled road and moved farther back to show roadway, railings and stay fans. Cable daylight tone was darkened slightly for legibility against the inspector's pale background. An approach blade was aligned explicitly to the roadway frame. No geometry was derived by tracing the photos. The near daytime overview remains low-contrast against the grid, while the driver/detail and dark views show the cable structure clearly. Far intentionally reduces cable density, retaining both outer reaches and all large openings. The plan view confirms the mapped orientation; the red outline stops at the physical bridge while the authored road continues onto its approach ramps.

Focused tests: **222 passed**, including ten landmark-specific cases, with `node --test src/peregrine/landmarks/top-cities/top-cities.test.js src/peregrine/landmarks/top-cities/helgeland-bridge/helgeland-bridge.test.js`. Tests raycast tower windows, deck-level tie, apex, planted foundation, road surface, slab soffit and pier cap contacts in both LODs; check sourced heights/span and the mapped structural length; own all mapped roadway vertices in both aligned directions and reject crossing/off-road headings; verify tangent/grade continuity, immutable refits and GLB normals/materials/weights/bounds. The landmark file itself runs in about 1.4 seconds. `node scripts/asset-catalog.mjs` passes (198 entries / 362 variants); `pnpm assets:preview` builds the local inspector. `qa-metrics.json` reports no issues, zero detected different-material coplanar overlaps and 0% back-face hits from 31 successful exterior rays. Independent visual review is pending the coordinator's review.

## App integration

Local bundle `0aa668fc8992`, slot A ports 3270 / 3272, standard Protomaps tiles from `tiles.codriver.io`. Full 3D world uses Terrarium DEM at 256 px / maximum zoom 15. The prescribed app-shot runs load and activate far and near exports in both modes. Actual HD pavement/paint is unavailable locally (`/osm-lanes` returns 503 without Redis); the shared registry layer retains provider overlay behavior when it becomes available. Account API CORS errors in the guest QA session do not prevent static landmark or terrain loading.

Both physical approaches and both grade feet were photographed looking in both directions in **both modes**. `app-approaches-sheet.jpg` was opened and judged: the elevated slab meets the authored ramp continuously, the grade feet meet the ordinary road without an observed vertical step, and no duplicate generic elevated bridge deck was visible. Fallback pavement changes width/colour at the narrow standard-road ribbon; real provider lane widths and paint still require HD verification.

Live `window.__map.landmarks.heightAt(lng,lat,heading)` results are **metres above the queried ground**, identical in both aligned directions. Columns below are lane centers lateral −3.1 / +1.1 m:

| Sample | Cityscape | Full 3D world |
| --- | --- | --- |
| North grade foot | 0 / 0 | 0 / 0 |
| North landing, station 45 m | 0 / 0 | 0 / 0 |
| Physical north abutment | 30.474 / 30.470 | 4.537 / 3.524 |
| North pylon | 46.200 / 46.200 | 46.179 / 46.182 |
| Midspan | 47 / 47 | 47 / 47 |
| South pylon | 46.200 / 46.200 | 46.138 / 46.132 |
| Physical south abutment | 18.575 / 18.565 | 14.375 / 14.328 |
| South landing, 45 m from end | 0 / 0 | 0 / 0 |
| South grade foot | 0 / 0 | 0 / 0 |

All **56 mapped roadway vertices / 112 directional queries** are owned in both modes. Lateral ±20 m and perpendicular headings return null. Raw machine-readable samples, screenshot coordinates and bearings are `tmp/top-cities/helgeland-bridge/app-height-cityscape.json` / `app-height-world.json`.

**World landing correction:** the initial north grade-foot heights were −0.437 / +0.143 m above terrain, and the station-45 landing was −0.363 / +0.133 m. The Helgeland-owned layer now puts both on local transverse ground: **0 / 0 m** in each direction. Both ends follow local ground for the first/last 45 m and use a smooth cosine blend back to the original absolute ramp by 160 m. Navigation and the fitted mesh use that same relative-ground rule. Landing pavement has four lateral columns and at most 8 m near / 16 m far longitudinal samples; the foot remains on the provider datum without terrain being baked into exports. A world-only polygon depth bias prevents coincident landing pavement/terrain interference without moving the driving surface. The same correction applies to newly captured/refitted HD pavement and paint with their ordinary surface biases; a synthetic test verifies both banks, but live HD remains not tested.

The final exported/reference contact sheet was regenerated and opened after this change. Focused tests verify both LODs against synthetic transverse slopes, repeated terrain revisions and bit-exact position restoration to Cityscape, including restoration of original pavement depth state. Source/export normals, bounds and materials remain covered. The final real-app mode sheet and the sixteen physical-approach/grade-foot views were also opened; the northern ground-contact correction is visible in the foot views. No shared bridge source extension was required.

| Environment / case | Status |
| --- | --- |
| Cityscape standard-road load, near/far and approach continuity | Verified locally on slot A |
| Full 3D world load, fixed main deck and local support ground | Verified locally with Terrarium DEM |
| Both approaches / both headings / both lane centers | Verified locally; both grade feet and landings return 0 m above their ground |
| Vehicle/camera common height API and heading ownership | Verified by focused tests and live queries; an actual paired driving session is not tested |
| Route/traffic/picking and lane-paint toggles | Not tested in an active navigation session |
| Live HD pavement/paint | Not tested: local /osm-lanes returns 503 without Redis |
| Repeated terrain revisions and near/far restoration | Focused tests verified; complete app mode/late-load/reanchor/failure matrix not tested |
| MCU2/MCU3 performance | Not measured |

Only this landmark's folder, catalog fragment, document and three exports are retained. Generated renderer bundles are restored before committing; local slot A servers are stopped at completion. Independent visual review, full HD/navigation/lifecycle QA and any release remain the coordinator's separate gates.
