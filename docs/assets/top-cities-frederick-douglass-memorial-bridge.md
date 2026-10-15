# Frederick Douglass Memorial Bridge — procedural 2021 landmark

This is the current three-span fixed through-arch bridge carrying South Capitol Street over the Anacostia, opened September 2021. It excludes the demolished 1950 swing bridge. The editable original source and texture-free GLBs use east/up/south metres about `[-77.005612375,38.8684704]`, with a baked OSM bearing of 117.3238°. Geometry, authored pavement, navigation and road replacement share one station/lateral profile.

## Evidence and dimensions

[SYSTRA IBT](https://www.systra.com/ibt/project/frederick-douglass-memorial-bridge-washington-d-c/) supplies span and deck dimensions; [AISC](https://www.aisc.org/bridges/prize-bridges/) describes the varying hexagonal steel arch sections; [AECOM](https://publications.aecom.com/social-infrastructure/projects/frederick-douglass-memorial-bridge/) establishes the arch system, concrete V-piers and end ovals; [NPS](https://www.nps.gov/places/frederick-douglass-memorial-bridge.htm) confirms 2021 completion, six lanes and two shared-use paths. SYSTRA's 2022 completion date describes its project record, while NPS dates public opening to 2021. Published 1,600 ft summaries include approaches; the published individual span lengths sum to 1,445 ft, with slightly differing metric rounding in the project summaries.

| Feature | Source | Model |
| --- | --- | --- |
| Structural length | SYSTRA 1,445 ft / 440.6 m | 440.6392 m |
| Centre span | SYSTRA 540 ft | 164.592 m |
| Side spans | SYSTRA 452 ft 6 in each | 138.0236 m each |
| Normal deck | SYSTRA 122 ft 6 in | 37.338 m |
| Four overlooks | SYSTRA 166 ft maximum width | 50.5968 m across paired bulbs |
| Live lanes | NPS six, future widening noted by SYSTRA | six marked lanes; ~25.8 m including median and margins |
| Deck datum | photographic estimate, not surveyed | 14.6 m central plateau |
| Arch exterior crowns | AISC July 2024 report, 168 ft central and 20 ft lower sides | 45.1104 / 51.2064 / 45.1104 m |
| Rib inclination | photographic estimate | outward 4.6 degrees, independent arches without cross-bracing |
| Arch box | AISC July 2024 report | constant 9½ ft / 2.8956 m width; 6 ft side and 7 ft centre crown depth, 13½–14½ ft base depths |
| Hangers / shared-use paths | AISC July 2024 report | 88 near hangers, 44 far; approximately 18 ft / 5.4864 m paths |
| Model ramp length / maximum grade | flat-map compromise | 200 m each; smoothstep maximum 10.95 percent |
| OSM roadway endpoints | dossier OSM ways 910656490/491 | mean divided centreline, 454.86 m mapped length, plus 50 m on each bank |

Reference sheet inspected from the supplied dossier. Current photos 1 (southwest elevation, G. Edward Johnson, CC BY 4.0) and 5 (Rainclaw7, CC BY-SA 4.0), with photo 2 (Antony-22 construction 2020e, CC BY-SA 4.0) used only for the rib structure. Images 3/4 depict the old bridge; image 6 is a 2017 design rendering. Commons pages and attribution are recorded in the catalog. No reference image ships.

## Modelling and placement

Three independent paired hexagonal ribs with smooth near/far lofts, vertical hangers, two paired longitudinal concrete V-piers, continuous edge girders and open floorbeams. The pedestrian walks widen to four overlook bulbs. Near includes three horizontal rails and dense posts; far keeps the open arch silhouette, every rib and pier, half of the hangers, perimeter rails, lamp heads and lane rhythm. Everything batches by material and three longitudinal near chunks; far uses one batch per material.

Mapped divided approach branch coordinates are literal attributed OSM data in the owned alignment module. Only ordinary-street approaches taper and split into road ribbons; the river structure retains its measured width. Sidewalks narrow into curb connections, rails return into the walk at the outer landings, and pavement changes from pale concrete on the bridge to darker asphalt on the ovals. The whole oval streets remain provider-owned. OSM bridge outline 910656500 is retained for inspection; no surrounding buildings are replaced. The four overlooks and approach walks project outside the simple OSM outline intentionally. No shared bridge files were changed.

Flat Cityscape needs a 200 m ramp at each bank, including the first 143 m of each side span, to represent river clearance on a flat map. This changes the otherwise almost level real deck. Full 3D world uses `absolute-deck` with lateral bank fitting, terrain clamping and immutable source vertices. Foundation weights keep pier feet at terrain; the arch box section, reinforcement, expansion machinery, signage and exact lighting fixtures are approximate. Inspector readiness does not establish world integration.

## Verification

First procedural sheet: `tmp/top-cities/shots/frederick-douglass-memorial-bridge/frederick-douglass-memorial-bridge-procedural-near-light-sheet.jpg` opened and compared with the dossier. It shows overview, both elevations, top/footprint, driving deck, soffit, V-pier and rib detail; the distinctive structure reads clearly. Final exported and application evidence will be appended after checks.

The model uses the rounded 440.6 m structural envelope, extended by 0.04 m to 440.6392 m, and a converted 540 ft centre span; each side differs from the exact 452½ ft conversion by 0.102 m (0.074 percent). This is a geometric approximation, rather than survey precision.

The later [AISC/NSBA July 2024 engineering report, pages 24–26](https://vpn2.modernsteel.com/contentassets/cd8409d0abc449cf871cb6cc8a52cb9b/prizebridge_24.pdf) supplied the crown elevation, rib width/depths, hanger count and path widths. These replace initial photographic estimates. Total deck width minus the published paths sets the road allocation; a low median and kerb/barrier margins occupy the balance. The transverse hexagon is a simplified symmetric section; the exact 15°/30° variable web breaks are approximated. Coloured holiday illumination and commemorative plaques are omitted.

## Final exports and checks

The exported GLBs were opened in `tmp/top-cities/shots/frederick-douglass-memorial-bridge/export-reference-contact-sheet.jpg`, showing overview/front/back/above/deck/underside/pier/rib views for near/far in light/dark next to the two current bridge photographs. `elevation-reference-sheet.jpg` is a compact direct elevation comparison. Both LODs retain all six ribs, V-piers and open hanger bays. The visual and metrics pass prompted correction of inward arch winding, exact surface contacts for hanger tips, grade clipping at curb returns, and removal of hidden upper flanges in far to resolve material cycles. Earlier render sheets represent earlier dimensions; only the final sheets correspond to these costs.

| Variant | Triangles | Draws | Bytes | KiB |
| --- | ---: | ---: | ---: | ---: |
| near | 54,160 | 24 | 2,381,176 | 2325.4 |
| far | 16,584 | 8 | 708,576 | 692.0 |

Focused conformance plus landmark tests pass **771/771**. Named terminal tests enumerate arch ends, 88/44 hangers, V limbs, floorbeam ends, all three near rail runs / one far rail run, rail posts and lamp posts, excluding the tested member; a shortened hanger fails. Tests also pin upward crown exterior winding, real openings, the four overlooks, the 68 m authored corridor envelope, grade, rigid widths, both headings and off/crossing-road rejection. The focused landmark suite takes approximately 2 s. `assets:check`, `assets:preview`, bundle build and depth regeneration/check pass.

Deterministic GLB scan (`tmp/top-cities/frederick-douglass-memorial-bridge/qa-metrics.json`): **0 coplanar overlap pairs, 0 close layered-face issues, 0 percent exterior back-face hits on 64 intersecting rays, 0 unsupported member-end candidates in either LOD, minY 0, and 0 dropped depth edges**. Exported bounds round-trip and match source in conformance tests.

## App and terrain verification

Cityscape: **verified locally for near/far loading, ordinary-road landings in both directions, and the shared height API**. Full 3D world: **verified locally for those same checks with the Terrarium DEM enabled and ready, including fitted foundations**. This is a local renderer check, not independent reviewer approval. The layers use `MeshBasicMaterial` with shared vertex shading for structures and the shared pavement colour path; inspector PBR is not the basis of app verification. Raw probes: `tmp/top-cities/frederick-douglass-memorial-bridge/heights-{cityscape,world}.json`.

The snapshots under `app-cityscape/` and `app-world/` contain far/near/street views; `approaches-cityscape/` and `approaches-world/` contain northwest and southeast landings in forward/reverse directions. `app-modes-sheet.jpg` and `approaches-modes-sheet.jpg` were opened. Ordinary pavement joins the authored approach without a visible height gap or duplicate river deck. The tapered concrete paths meet the ordinary street curb area; exact municipal kerb geometry and the remainder of each traffic oval stay with the provider. The first app pass exposed and fixed the clamped-station error in the oval branches.

The following values are actual `window.__map.landmarks.heightAt(lng,lat,heading)` results, in metres above the current local terrain; both headings 117.3238° and 297.3238° agree to less than 0.0001 m. Each row spans the two carriageway centres.

| Station m | Cityscape m | Full 3D world m |
| ---: | ---: | ---: |
| 0.10 | 0.00001 / 0.00001 | 0.03000 / 0.03000 |
| 57.11 | 2.89172 / 2.89172 | 3.38637 / 3.31146 |
| 125.00 | 9.98047 / 9.98047 | 11.03851 / 11.06467 |
| 195.14 | 14.57451 / 14.57451 | 14.27987 / 14.28155 |
| 277.43 | 14.60000 / 14.60000 | 14.30233 / 14.30586 |
| 359.73 | 14.57451 / 14.57451 | 14.29780 / 14.30454 |
| 497.75 | 2.89172 / 2.89172 | 2.88500 / 2.85356 |
| 554.76 | 0.00001 / 0.00001 | 0.03000 / 0.03000 |

World bank datums at the outer alignment endpoints: **4.68685 / 3.47748 m**. The 256 zero-height, zero-lift foundation vertices were compared against their own lateral DEM samples: maximum residual **0.00000024 m**; this confirms fitting to the DEM, not survey accuracy. Lateral bank fitting and the 0.03 m clamp avoid the ramp cutting into sloped ground. Central deck absolute datum stays approximately 14.6 m; query-relative offsets differ because river DEM samples are approximately 0.3 m. At 40 m lateral offset, 20 m before the profile, and every perpendicular heading, the height API returns null.

**Not tested:** real vehicle/route/traffic movement, repeated mode/failure/late-terrain/reanchor lifecycle, HD lane count and paint phase, MCU2/device performance. Redis was available but the Washington lane-detail tile could not fill from Overpass (HTTP 503, `osm lanes filling` / warm failed), so these are ordinary-road/fallback screenshots and do not establish HD paint continuity. The other tiles, anonymous local account CORS errors and missing auth are QA environment limits.
