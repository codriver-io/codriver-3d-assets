# Centre Street Bridge (Calgary)

`centre-street-bridge` — a road-fitted **double-deck** bridge: Centre Street over the Bow River and Memorial Drive, opened 18 December 1916, designed by John F. Green. Folder: `src/peregrine/landmarks/calgary/centre-street-bridge/`.

## Identity and sources

The 1916 reinforced-concrete arch bridge that replaced the MacArthur steel truss (lost in the 1915 flood). Upper deck: four lanes of Centre Street on three open-spandrel arches, cantilevered balconies, ornamental balustrades and lamp standards, and four cast lions (replicas since the 2001 restoration) on two pairs of pavilions at the ends. Lower deck: an I-girder roadway between the arch ribs, two reversible lanes from Riverfront Avenue (Chinatown) to Memorial Drive, 2.7 m clearance.

- Wikipedia, [Centre Street Bridge (Calgary)](https://en.wikipedia.org/wiki/Centre_Street_Bridge_(Calgary)): upper deck 178 m x 15 m, lower deck 150 m x 5.5 m, 2.7 m clearance, lions and pavilions.
- OpenStreetMap (ODbL), extracted through the shared Overpass queue on 2026-10-02: upper roadway 467412727 / 4637525 / 1323929195 / 55364903, lower roadway 172273337 / 420030805 / 238136415 / 420067812, bridge outline 1323929179 (its pier bays), sidewalks 1472523831 / 1472523832, crossing roads (Riverfront Avenue, Memorial Drive and its underpass 298687480). `centre-street-bridge-derive.mjs` regenerates `-alignment.js` (runtime: the two roadways) and `-mapped.js` (authoring: outline, bays, sidewalks, crossings).
- Wikimedia Commons photographs (study only, ignored folder): Cszmurlo (CC BY 2.5); Ryan L. C. Quan (CC BY-SA 3.0); Sean Esopenko (CC BY-SA 2.0); three by "Thank you for visiting my page from Canada" (CC BY 2.0). Titles in the catalog record.

## Dimensions

| Item | Value | Source |
| --- | --- | --- |
| Mapped bridge way (upper deck) | 230.5 m | OSM 4637525 + 1323929195 (published 178 m = the original structure) |
| Lower deck chain | 153 m (lower roadway 3.8–5.5 m east of the upper one) | OSM 420030805 + 238136415; published 150 m |
| Arched section, pier A to pier D | 151.4 m, spans 50.2 / 50.7 / 50.4 m | the four mapped pier bays (piers within 0.4 m of every bay) |
| Pier skew | 22 deg (tan 0.40) off square, with the Bow's flow | the mapped bays (east bay ~9.5 m south of the west) |
| Upper deck | 15 m deck (roadway 13.4 m, estimate) + balconies to 21.2 m | published 15 m; outline 21.3 m |
| Upper road surface (flat map) | 9.0 m | estimate: provider's 5 m lower deck + 2.7 m clearance + 1.3 m floor |
| Arches | clear span 45.4 m, crown intrados 6.8 m, ring 1.2–1.9 m deep, 3 arcade openings per haunch (2.8 m) | estimated from photographs |
| Lamp standards | 7 m posts, globes; 14 per side | estimated |
| Pavilions | 4.6 x 3.4 m, 5.25 m to the lion's plinth; lions 2.8 m long | estimated from photographs |
| Lower deck (ours) | slab top 4.0 m, 4.8 m wide, two I-girders 0.85 m, hangers every 8.4 m | estimate; sits under the provider's 5 m road |

## Coordinate frame and heights

Origin `[-114.0625491, 51.0528614]`, mid-river 1 m east of the mapped upper roadway; +X east, +Y up, +Z south. Station s runs south to north along the mapped upper roadway (s = 0 at the 2 Avenue SE junction, L = 424.6 m at the 1 Street NE link); lateral d is positive east.

**Flat Cityscape.** The basemap has no river channel or escarpment, and the provider (osm-lanes.js) draws the lower deck at 5 m (layer 1) and the upper at 10 m. The upper road is level at 9.0 m from s 106 (7 m south of the lower deck, over the Riverfront Avenue junction) to s 281 (past Memorial Drive), with constant-grade ramps and parabolic vertical curves onto the mapped approaches:

| Ramp | Length | Tangent grade (SD, ends at 0 m) | HD estimate (provider ends ~6.8 / 3.6 m) |
| --- | --- | --- | --- |
| South, 2 Avenue SE junction → s 106 | 106 m (64.9 m on fill, then the end span) | 9.2 % | 2.3 % |
| North, s 281 → 1 Street NE link | 143 m (the Centre Street N embankment, with an opening over Memorial Drive NW) | 6.7 % | 4.0 % |

Clearance: upper road minus the provider's lower road ≥ 3.95 m over the lower deck (2.65 m under the floor beams; published 2.7 m) and ≥ 3.6 m at the Riverfront and Memorial junctions, where the provider's covered approaches ramp at 5 % (tested).

**Full 3D world.** `terrainPolicy: 'absolute-deck'` (no corridor flattening, so no trench through the Crescent Heights escarpment; the registry stands the group at baked 0; supports reach their own ground). On its own it treats y = 0 as sea level, which suits the Bay Bridge, not a deck at 1,045 m, so `layer.js` overrides `_surface()`: the flat-map profile rides on a datum through the DEM at six alignment vertices (the alignment ends, the bridge-way ends, and the lower-deck chain ends, where the provider takes its own lower-deck HD datum). The upper deck therefore stays 4 m above the provider's lower deck in both modes, and the ramps meet the terrain roads. The north ramp is nearly level in world mode (the escarpment rises 9 m to meet it). `bank-fit` was not used: the registry places only `absolute-deck` bridges at baked 0 (a bank-fit registry bridge would be lifted by the pad datum a second time).

## Integration: the stacked decks

Position and heading cannot tell the decks apart (the lower roadway is mapped 3.8–5.5 m east of the upper one, under its east lanes, and both carry both directions), so the lower roadway's own band (its mapped centreline ± 2.6 m, Riverfront Avenue junction to Memorial Drive junction) is left to the provider:

- `bridgeRoadHeight` (the profile's, as Bay Bridge East overrides its own) returns null there: the HD car tracker keeps the car on the provider's lower deck; the route and traffic keep their HD heights.
- `PROFILE.ownsPoint(x, z, h)` refuses HD triangles in that band below 7.5 m, so the provider's lower pavement, walls and piers stay unclaimed. This needed one shared change: `bridge-roads.js` passes the triangle's mean height above its ground as an optional third argument (commit `feat(bridges): ownsPoint receives the HD triangle's mean height`, test `bridge-owns-height.test.js`; two-argument predicates and profiles without one are unchanged; Montréal, Paris, Toronto, Champlain, Mercier and Bay Bridge tests pass).
- While the followed car is on the lower roadway the upper road, paint, slab and its draped HD pavement fade (`spec.upperDeck`, `layer.js`).
- In Standard (SD) roads the shared `prepareStandard` removes the lower roadway's flat ribbon inside the corridor (it has no ownership hook); our lower deck slab stands in for it and a car there reads the ground (null), like any SD provider bridge.

## In-app evidence (local, bundle `4697ff1ab56b`, ports 3270 / 3272)

`tmp/calgary/centre-street-bridge/probe.mjs` reads `window.__map.landmarks.heightAt` every ~5 m along both mapped roadways, northbound (1.4°) and southbound (181.4°):

| Mode | Upper roadway (86 points, each direction) | Lower roadway (39 points, each direction) | Riverfront / Memorial crossings |
| --- | --- | --- | --- |
| Cityscape | 0 nulls; 0 → 2.92 → 6.62 → 9.00 (s 113–266) → 8.81 → 6.40 → 3.76 → 1.12 → 0 | all null | null / null |
| Full 3D world | 0 nulls; relative to local ground 0 → 2.96 → 6.49 → 9.29 → 10.87 → 10.99 → 10.02 → 8.81 → 6.13 → 3.40 → 0.61; datum 1046.96 / 1045.91 / 1045.26 / 1050.83 / 1053.26 / 1062.37 m | all null | null / null |

Screenshots: `tmp/calgary/shots/centre-street-bridge/app-{cityscape,world}-light-approach/sheet.jpg` (both approaches, both directions, both lower-deck portals: the deck meets the provider road at grade with no step), `app-cityscape-{light,dark}-sides/sheet.jpg` (arches, arcades, lamps at night). HD lanes (`/osm-lanes`) answer 503 locally: the HD pavement draping and the lower-deck exclusion are covered by unit tests only.

## Modelling decisions and approximations

- One shared station/lateral frame for geometry, deck surface, car, route and camera; the bridge chord's mid-river vertex is 0.04 m off straight.
- Faces: each arch face is two extrusions sheared with the pier skew: the body (ring, spandrel and three round-headed openings per haunch, the darker `spandrel` tone, also the soffit) set back 0.25 m, and the ring's own 0.25 m face in the light `concrete`, standing proud, so the arch rings read against the infill; pilasters project 0.3 m; bays widen the balconies at every pier (to 12.6 m under the pavilions). `spandrel` is deliberately not `deck`: `deck` is in the profile's `upperDeck` fade set and the arches must not fade with the road when the car is on the lower deck.
- Approach-fill retaining walls (`sideWalls`) are wound outward on both sides (they were inward: the near wall vanished from outside, 3.2 % back-face hits).
- The structure is symmetric about the mapped roadway; the mapped outline is centred 0.8 m east of it (our balconies are 0.7 m outside it on the west, 0.8 m inside on the east).
- End spans are girder spans on two bents (south, either side of Riverfront Avenue) and one span over Memorial Drive; the approaches run on retained fill (vertical walls, not the real sloped embankment).
- Lions are simplified (lofted body, faceted mane and head, paws); no banners on the lamps; no lettering.
- Far LOD: same silhouette and openings (3-segment arcs), solid balustrade, boxed lions and pavilions, no paint, floor beams, consoles or hangers.

## Costs

Near 29,440 triangles / 22 draws / 1,651 KB; far 7,828 / 9 / 391 KB (budget 120 k / 40 / 4.5 MB and 30 k / 10 / 1.2 MB). `qa-metrics.mjs`: 0 % back-face hits, coplanar overlaps 2 m² (limit 5 m²), min y -0.32 m.

## Verification

Looked at (procedural and exported GLB): overview, facade, roof, deck, underside, tower, lion, lower, south, north; near light and far dark. Changes from them: closer inspector views; lion mane and head refined; cornice band, consoles and bay buttresses moved so no face is shared; colours lightened toward the photographs' cream concrete; arches sprung lower (0.3 m) for a taller rise. Independent review fixes: retaining walls rewound outward, arch ring thickened to 1.2 m at the crown (1.9 m at the springing, so the crown intrados is 0.3 m lower) with a proud pale ring face over a darker spandrel and soffit (a west elevation and a south-west three-quarter view of the exported GLB), lamp bases lifted 3 cm clear of the balustrade post feet. Tests: `node --test src/peregrine/landmarks/calgary/calgary.test.js src/peregrine/landmarks/calgary/centre-street-bridge/centre-street-bridge.test.js` (alignment, pier bays, open arches and arcades in both LODs, profile grades and clearances, stacked-deck heightAt both directions, HD ownership, lions and lamps, runtime flat/world/fade, registry placement).

Cityscape: verified locally (SD roads). Full 3D world: verified locally (terrain server, `heightAt` and screenshots); HD lanes not tested (unavailable locally). No Tesla hardware measurements.
