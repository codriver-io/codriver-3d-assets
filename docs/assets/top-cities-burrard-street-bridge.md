# Burrard Street Bridge, Vancouver

Original procedural model of the 1932 Art Deco Burrard Street Bridge across False Creek, with the 2017 walking and protected cycling arrangement. Source: `src/peregrine/landmarks/top-cities/burrard-street-bridge/`. The two gallery portals and polygonal steel through-truss are retained in both LODs; the model is road-fitted through the existing registry bridge layer.

## Identity, dimensions and sources

[SEABC / IABSE, Notable Structures in Vancouver and Beyond (2017), printed p. 2](https://www.seabc.ca/wordpress/files/notable_structures/Vancouver_Notable_Structures_IABSE_SEABC_2017.pdf) identifies the original structure, its marine spans, concrete approach spans and sculptural architect Charles Marega. [City of Vancouver / TAC renewal report](https://www.tac-atc.ca/wp-content/uploads/burard_complete.pdf) describes the protected lanes, 2017 north-end widening, replacement railings, safety fencing and restored lights. [Vancouver Heritage Foundation](https://www.heritagesitefinder.ca/location/burrard-street-bridge/) documents the memorial braziers and their restored lighting.

| Element | Model / reference value | Evidence |
| --- | --- | --- |
| Original bridge length | 836 m published; 865.0 m mapped | SEABC; OSM roadway 23188868 + 849900149 |
| Fitting corridor including north streets | 1,042.83 m | OSM 74094190, 50844353, 123986646 added to the bridge |
| Marine spans, southwest to northeast | 56.8 / 70.7 / 96.2 / 70.7 / 56.3 m | SEABC engineering reference |
| Main span discrepancy | Dossier/Wikipedia 89.6 m versus SEABC 96.2 m | Different measurement conventions possible; unresolved; SEABC used for support spacing |
| Portal stations | 524.6 / 620.8 m from southwest mapped road endpoint | Published span registered within 6 m of the OSM outline's portal bays |
| Ordinary deck width | 26.7 m, plus 7 cm cornice projection | Mapped outline approximately 26.3–27.3 m; model cornice exceeds it by at most 0.42 m in the tested marine section |
| Vehicle pavement | 13.6 m / four fallback lanes | Width estimated; renewal report's current arrangement; OSM still tags five vehicle lanes |
| Protected bicycle lanes | 2.5 m each, plus 0.45 m divider | Renewal report; divider width estimated |
| Footways | 2.6 m each | Dossier / photograph proportions |
| Deck / maximum point | 24.0 / 40.475 m above authored grade | Estimated photographic proportions, not survey or certified navigation clearance |
| Truss rise / deck-truss depth | 13.1 / 5.2 m | Photographic estimates |
| Portal roadway soffit / pedestrian arch crown | Deck + 6.925 / + 5.7 m | Photographic estimates |

The supplied Commons dossier was studied as references only: two panoramas by Diego Delso (CC BY-SA 4.0), fog view by DougVancouver (CC BY 3.0), night view by Eduardo (CC BY-SA 3.0), northeast approach by Alethe~commonswiki (the Commons author field says “self”; CC BY-SA 3.0), and figurehead detail by Luke.Ernz (CC BY-SA 4.0). Individual titles and links are in the catalog record. No photograph, texture, scan or third-party mesh is included in source or exports.

Mapped data © OpenStreetMap contributors, ODbL 1.0. The lead's `osm.json` was reused; one cached shared-helper query supplied the north approach streets. Control points and the bridge outline are retained in `burrard-street-bridge-mapped.js`, with collinear structural knots and samples around approach bends. No direct Overpass requests were used.

## Geographic and surface contract

Origin `[-123.1368002926185, 49.275523599305906]` is the midpoint of the two portals on the roadway. Metres, east/up/south; orientation is baked once. The main bearing is about 64.4° from north; station increases from Kitsilano toward downtown and positive lateral points toward False Creek. Source geometry, fallback pavement, provider overlay and bidirectional navigation share `PROFILE`.

Flat Cityscape uses two smooth ramps: southwest 397.1 m (peak grade 9.07%) and northeast 351.33 m (peak grade 10.25%). The 24 m central deck is level between stations 397.1 and 691.5; the outer northeast deck-truss span follows the descending ramp. This is a flat-map compromise, not the real street elevation survey. The modeled fitting ramps continue outside the mapped bridge outline along the mapped roadway, with estimated repeated trestles; detailed widened intersections and branching approach lanes are omitted. Structural envelope is up to 30.8 m at portals. `FOOTPRINTS` lists only the mapped bridge outline; the dossier contained no building extrusions on the bridge. The same outline is supplied as `buildingFootprints` for conservative replacement if provider data includes one.

`terrainPolicy: 'absolute-deck'` keeps the structure on its authored datum, blends approaches to the shared DEM and adapts footings/support shafts without flattening the river corridor. Footings carry attachment weight 0; deck, railings, gallery and truss carry 1; designated shafts interpolate. Ground and latitude stretch remain runtime operations. Main marine pier positions beyond the two portals come from published spans, not surveyed pier coordinates.

## Modeling decisions and limits

The two pairs of portal towers have open round-headed pedestrian passages, overhead windowed galleries, a blue-green geometric mosaic frieze, gabled tile roof geometry, pilasters, cornices and dentils. Each tower has caged lanterns, a stylized ship prow/bust relief and a memorial brazier. Facial likenesses, sculpted initials, full coat-of-arms figures and detailed hull carving are simplified; no lettering is asserted. Concrete and stone use warm grey/cream tones; steel uses muted grey-green; glass/mosaic and bronze/tile materials contrast at the gallery. Dark palettes dim the structure; lantern/brazier material is self-lit. There is no light-baked texture or real floodlight illumination.

The through-truss uses polygonal top chords, inward Pratt diagonals, verticals, transverse roof bracing and knee braces. Side spans retain open Warren webs in far LOD. Near adds angle edges, gussets, rivets, under-deck cross members, roof ribs, mosaic squares, lantern cages, railing infill and restored small lamps. Repetition is merged into two station chunks, per material; far merges minor finishes into seven materials and reduces fencing and lamp density. Original fallback lane markings remain available when HD lanes are absent.

## Export and inspection evidence

| Variant | Triangles | Draws | Bytes | KB (1024 bytes) |
| --- | ---: | ---: | ---: | ---: |
| Near | 82,144 | 18 | 4,081,036 | 3,985 |
| Far | 23,636 | 7 | 956,548 | 934 |

Both LODs have identical bounds and a 40.475 m top. Minimum y is -2.093 m in the approach slab/girders, hidden below flat grade; foundations otherwise meet local grade. Budgets pass (near 120k / 40 / 4.5 MB; far 30k / 10 / 1.2 MB). GLB export retains `_BRIDGELIFT`; load restores `_bridgelift`. Normals, named materials and bounds survive the round trip. Triangle check found zero degenerate faces. Export QA: 0 coplanar overlap pairs, 0% back-face hits among 27 outside-in ray hits; the ray sweep is sparse on this long thin asset, so it complements visual inspection and targeted opening/contact raycasts.

Actually looked at:

- `tmp/top-cities/shots/burrard-street-bridge/iteration1/burrard-street-bridge-procedural-near-light-sheet.jpg`: overview, both sides, roof, driving portal, underside, tower detail and southwest trestles, against the dossier photo sheet.
- `tmp/top-cities/shots/burrard-street-bridge/final/exports-vs-references.jpg`: supplied photo sheet next to exported near-light, far-dark, near-dark and far-light contact sheets. Near-light and far-dark include overview, both sides, roof, deck, underside, tower and north approach; the other themes include both sides, deck and tower.
- `tmp/top-cities/shots/burrard-street-bridge/app-modes.jpg`: real app Cityscape and world, each far/near/street.
- `tmp/top-cities/shots/burrard-street-bridge/app-approaches/sheet.jpg` and `app-world-approaches/sheet.jpg`: both mapped fitting endpoints, both driving directions, real Cityscape and world app. World north-street screenshots also show floating provider traffic symbols; these are outside the authored bridge and the shared renderer was not changed.

Corrections after inspection/checks: reduced subpixel railing density and ramp tessellation to stay within budget; extended trestle support under the north fitting ramp; replaced cylindrical bust heads with faceted heads; inserted actual profile knots and close bend samples after the far pavement chord test caught sag across a missed transition. Both LOD surfaces now follow the shared navigation deck within 6 cm at tested samples. Final rendered portal openings, truss silhouette and support contacts are retained in the far exports. Independent review is pending; no independent PASS is claimed.

Focused tests cover both portal openings, pedestrian arches, through-truss clearance and crown, pier/bearing contacts, walking/cycling surfaces, mapped footprint envelope with documented 0.5 m cornice allowance, published span spacing, ramp grade, both travel directions, crossing/off-road rejection, pavement chord clearance and GLB attachment attributes. `node --test src/peregrine/landmarks/top-cities/top-cities.test.js src/peregrine/landmarks/top-cities/burrard-street-bridge/burrard-street-bridge.test.js` passes; `pnpm assets:check`, `node scripts/asset-catalog.mjs` and `pnpm assets:preview` pass.

## Application integration evidence

Real local app bundle `85f76f87fb6b`, slot B ports 3274 / 3276, Protomaps/OSM SD roads; world server configured for AWS Terrarium tiles. The main bridge loads and swaps far/near normally in both mode screenshots. Cityscape endpoint sheets show pavement meeting the at-grade streets and a single recognizable custom structure. The ad-hoc app-shot report's `active: false` refers to the synthetic `spot-*` id, not the landmark; the custom bridge is visibly loaded in those screenshots.

Cityscape: **verified locally for SD placement, both approach directions and accepted navigation heights**. Full 3D world: **verified locally for loaded terrain, rigid central span/support placement and accepted navigation heights**; the wider runtime lifecycle and HD matrix remain not tested.

`tmp/top-cities/burrard-street-bridge/app-probe.json` records 69 alignment/structural samples per mode. Every sample answers in both travel directions, with no nulls or direction mismatches; all 69 perpendicular headings and an off-bridge point return null. Cityscape approach offsets are `[0,0]`; world has `_terrainReady=true`, a live ground sampler and endpoint DEM elevations 17.272 / 34.326 m. World `heightAt` values below are **offsets above the shared local ground**, not absolute elevations.

| Station m | Cityscape forward/reverse m | World forward/reverse m |
| --- | --- | --- |
| 0 | 0 / 0 | 0 / 0 |
| 100 | 3.799 / 3.799 | 5.130 / 5.130 |
| 200 | 12.131 / 12.131 | 7.608 / 7.608 |
| 300 | 20.397 / 20.397 | 13.996 / 13.996 |
| 524.6 (southwest portal) | 24 / 24 | 24 / 24 |
| 620.8 (northeast portal) | 24 / 24 | 23.187 / 23.187 |
| 1042.83 (north fitting endpoint) | 0 / 0 | 0 / 0 |

These API samples verify the surface consumed by navigation; an actual tracked car/route was not driven. World footings use their sampled ground rather than a bridge-wide flattened corridor. The real elevation of the authored central deck remains an estimate. Both approach directions were also captured in world in `tmp/top-cities/shots/burrard-street-bridge/app-world-approaches/sheet.jpg`.

HD `/osm-lanes` responds 503 without local Redis; provider HD lane count, paint phase and draping are not verified live. The authored fallback has four lanes, but OSM five-lane metadata may produce a live HD mismatch that must be checked separately. Route/car/traffic/halo/camera share the bridge layer's accepted surface API; actual tracked driving, lifecycle failure/toggle/reanchor matrix and Tesla hardware performance are not verified in this task. Guest/account CORS errors and unavailable local auth/HD endpoints are visible in app-shot reports. No shared renderer files were changed, no generated runtime bundle is delivered, and no staging deployment was made. Local servers were stopped after QA; all 13 owned deliverable files remain uncommitted for coordinator review.
