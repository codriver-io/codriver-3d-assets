# Toronto: Prince Edward Viaduct (Bloor Street Viaduct)

Original procedural model of the **Don Valley section** of the Prince Edward Viaduct, the 1918 steel-arch road bridge that carries Bloor Street East across the Don Valley into Danforth Avenue, with the TTC Line 2 subway on its lower deck. It is the one Toronto landmark that carries a road, so it is a **road-fitted bridge** like Pont Victoria and Pont Jacques-Cartier: an alignment profile from the OSM roadway, geometry built with `bridgeBuilder`, and a layer made with `createBridgeLayer`. See [3d-toronto-landmarks.md](3d-toronto-landmarks.md) for the folder contract and [3d-montreal-landmarks.md](3d-montreal-landmarks.md) for the bridge machinery it reuses.

Build: `pnpm build:toronto-landmarks prince-edward-viaduct`. Tests: `node --test src/peregrine/landmarks/toronto/prince-edward-viaduct/ src/peregrine/landmarks/toronto/toronto.test.js`. Inspect: `/asset-preview.html?asset=prince-edward-viaduct&view=crossing` (also `overview`, `facade`, `roof`, `underside`, `arches`, `veil`, `approach`, `east`, `structure`).

## Identity

The Don section only: opened 18 October 1918 (bridge and Luminous Veil as they stand today, 2026). It is **not** the separate Rosedale section (177 m, one arch, west of Parliament Street) nor the 1966 Rosedale Valley Bridge. Five steel three-pinned crescent arches (a braced ribbed deck arch) on six stone-clad concrete piers, an upper deck for Bloor Street (three eastbound and two westbound lanes with a bike lane each way and two sidewalks) and a lower deck that has carried Line 2 since 1966. Since 2003 a stainless-rod suicide barrier, the Luminous Veil, stands along both edges. What a driver sees: a very long level cream deck with two leaning silver fences, and, from the valley, the black crescent arches between buff piers.

## Sources

| Fact | Source |
| --- | --- |
| Length 494 m (1,620 ft) incl. approaches, 40 m above the Don Valley, three-hinged concrete-steel arch, opened 1918, subway lower deck 1966, Veil 2003 (9,000 rods 12.7 cm apart, 5 m high), lighting 2015 | [Wikipedia](https://en.wikipedia.org/wiki/Prince_Edward_Viaduct) |
| Spans 85.8 m central, 73.6 m flanking x2, 48.2 m end x2; total 493.8 m with approaches; three pins (abutments and crown) | [CSCE historic site](https://legacy.csce.ca/en/historic-site/prince-edward-viaduct/) |
| Five arches over the river and Parkway; Rosedale section 177 m | [Toronto Journey 416](https://www.torontojourney416.com/prince-edward-viaduct/) |
| "Thirty-eight metres above the Don River", five-arch Don section | [Ontario Construction News](https://ontarioconstructionnews.com/foundations-of-construction-precise-engineering-of-prince-edward-viaduct) |
| Steel and concrete arch, lower railway platform installed for a future subway | [The Canadian Encyclopedia](https://www.thecanadianencyclopedia.ca/en/article/toronto-feature-bloor-viaduct) |
| Roadway (way 4282643: `bridge=viaduct`, `lanes=5`, 3 forward / 2 backward, `cycleway=lane`), deck outline (way 195248139, `man_made=bridge`, 65 nodes with pier notches), sidewalks (43654690, 43654691), subway tracks (5134874, 195244983), the Don Valley Parkway, Bayview Avenue, trails, GO rail and the river below | [OpenStreetMap](https://www.openstreetmap.org/way/4282643), retrieved 2026-09-29 through the OSM API (ODbL); geometry in `prince-edward-viaduct-alignment.js` |

Reference photographs were downloaded to the ignored `local-scratch/prince-edward-viaduct/refs/` to compare proportions; none is in the repository or the GLB. Wikimedia Commons: Prince Edward Viaduct panorama (Óðinn, CC BY-SA 2.5 ca); Prince Edward Viaduct Toronto (Doug Kerr, CC BY-SA 2.0); Looking up at the viaduct from the valley and Subway in viaduct (Perry Quan, CC BY-SA 2.0); Bloor viaduct (paul bica, CC BY 2.0); Prince Edward Viaduct (Jess, CC BY-SA 2.0); Prince Edward Viaduct, July 23 2025 (Dillan Payne, CC BY-SA 4.0); Prince Edward Viaduct (Vladislav Litvinov, CC0); Prince Edward viaduct, King's Highway 5 (Doug Kerr, CC BY-SA 2.0); Luminous veil sunset (The City of Toronto, CC BY 2.0); PEV2 (IRT.BMT.IND, CC BY-SA 3.0); OHQ Bloor viaduct (Toronto Public Library Special Collections, CC BY 2.0); and two City of Toronto Archives photographs of the 1918 opening (public domain).

## Frame

Real metres, +X east, +Y up, +Z south. Origin `[-79.3635537, 43.6753015]`: the centre of the 85.8 m arch on the mapped roadway (262.6 m from the west end of the mapped bridge), about 8 m from the Don River. `y = 0` is the flat-map grade, which stands for the valley floor. The bridge runs 74.7 degrees east of north (`frontageBearing`). **Station** `s` runs west to east along the alignment: 90 m of mapped Bloor Street East, the OSM roadway (469.5 m, `STRUCTURE_START` to `STRUCTURE_END`), then 148 m of mapped Danforth Avenue (708 m in all); **lateral** `d` is positive to the right of travel (south). Both the geometry and the runtime read the one profile in `prince-edward-viaduct-profile.js` (`createBridgeProfile`), so the model, the car, the route, the camera and the HD pavement share one surface. Latitude stretch is applied once, by the layer.

## Dimensions

| Quantity | Model | Basis |
| --- | --- | --- |
| Mapped structure length | 469.5 m | OSM roadway way. The published 494 m includes ~24 m of approach beyond the mapped bridge end; the model does not stretch to it. |
| Deck above valley floor | 40 m, level between the ramps | Sourced (Wikipedia 40 m; 38 m elsewhere) |
| Arch pin spans | 48.2, 73.6, 85.8, 73.6, 48.2 m (symmetric) | The published spans exactly (CSCE); the piers are centred on the middle arch and spaced by span + a 7 m pier base |
| Pier centres (P0..P5), along the mapped bridge | 80.4, 135.6, 216.2, 308.8, 389.4, 444.6 m | Within 2.7 m of the notches in the OSM deck outline for P0..P4 (80.2, 136.0, 215.2, 310.0, 392.1); P5 mirrors P0 (the outline ends 24.9 m past it) |
| Deck width | 26.2 m, lateral -12.0 .. +14.2 about the OSM roadway | Mapped outline |
| Roadway kerb to kerb | 20.4 m (-9.2 .. +11.2): 3 eastbound lanes, 2 westbound, 1.5 m bike lanes | Lane counts sourced; lane widths estimated |
| Sidewalks, parapet | 2.4 m, 15 cm above the road; 1.05 m stone parapet, 2 m concrete edge beam | Estimated from photographs |
| Luminous Veil | top rail 5.65 m above the sidewalk, masts every 4.4 m leaning 0.95 m outward, thin ribbons every 0.62 m | Height sourced (5-5.5 m); post spacing, lean and rod spacing estimated (the real rods are 12.7 cm apart; ribbons here are 4.5 cm wide and sparser so they read) |
| Arch ribs | two, 12.6 m apart; crescent depth 7.5 % of the span at the crown, 0.9 m at the hinges; chords 1.45 x 1.2 m and 1.3 x 1.05 m (thickened after review to match the heavy riveted trusses in the photographs); crown touches the underside of the subway deck 8.2 m below the road | Estimated from photographs |
| Subway room | floor 7.4 m below the road, 11.8 m wide, inboard of the ribs, dark steel sides, lamps | Estimated; the viaduct does carry the TTC on a lower deck |
| Piers | stone shaft 7.0 m long at the base tapering to 6.4 m, 22.4 to 20.6 m across, capital 28.2 m across (the outline steps out ~1 m at each pier), 1.6 m concrete footing | Plan estimated; capital width from the outline |
| Approaches beyond the arches | a solid concrete girder on concrete piers about 19 m apart while the ramp is higher than 12 m, then a solid ramp on fill down to the approach road | Estimated (published data give only the total length) |
| Height (top of lamp standards) | 49.8 m | 40 + Veil + 9.2 m lamp standards (estimated) |

## Flat-map convention (read this)

The basemap has no valley: roads on both banks are at `y = 0`. Like Victoria and Jacques-Cartier, the deck is authored at its published clearance (40 m) and **eases down to the approach datum at both ends** (`'start'`/`'end'` knots, measured from the loaded HD road at run time). The ramps are `RAMP = 170 m` at both ends (symmetric), **starting on the mapped approach roads**: the alignment runs 90 m out along Bloor Street East and 148 m out along Danforth Avenue beyond the mapped abutments (`EXT_WEST`, `EXT_EAST`), so the deck is level from the first pier to the last (all five arches at full height) and the steepest grade is 1.5 x 40 / 170 = 35 % (it was 97 % on a 62 m east ramp before review). Beyond the arches the deck is a concrete girder on piers while it is high and a solid ramp on fill below 12 m; there is no Veil or subway room there. The ramp shape is a visual choice, not survey. The terrain flatten corridor (`terrainFootprint`) is the whole alignment. `RAMP` and the approach constants are at the top of `prince-edward-viaduct-profile.js` for the lead to tune in the app. The east approach stops 45 m short of Broadview Avenue; the Bayview-Bloor ramps that merge into Bloor Street East west of the bridge are outside the deck corridor or run at an angle to it, and the tests pin that they are not claimed.

## Modelling decisions

- **Recognition feature**: the five crescent arches, each two braced ribs (extrados and intrados chords, web posts and diagonals, spandrel columns rising to the road slab, spandrel bracing, cross bracing between the ribs, hinge shoes on the piers) with the first and last shallower. Members are built with an explicit frame (`member()`), not the builder's `beam`, which twists on a skewed bridge. Pin spans are the published ones exactly.
- Deck: slab between two edge beams (inset so no faces are coplanar; its top and the approach girder's sit 18 cm under the road layers), stone parapets with a 16 cm projecting cornice, sidewalks, asphalt (recoloured at run time to the map's pavement), lane paint and a yellow centre line in near.
- Lower deck: a dark steel room under the roadway, inboard of the ribs so the columns read in front of it, with lamps on its side (near).
- Piers are lofted octagonal rings (footing, tapered shaft, flared capital) with a lighter arched niche on each long face (near). Shafts are weighted so the footing stays on the valley floor and the shaft stretches to the deck when the road is fitted (`bridgeLift`); arch members are weighted by height.
- **Luminous Veil**: modelled, because it is the second thing a driver sees. Top rail (both LODs), leaning masts with a diagonal arm and a stone pilaster each (near), stainless rods as thin double-sided ribbons (near only, a lighter `veil` material). The 2015 colour-changing LED lighting is not modelled; the dark palette lightens the rods instead.
- Lamp standards: davit arms alternating sides every 30 m (near only).
- Far LOD: same deck, edge beams, parapets, room, piers, arches (chords, spandrel columns, half the panels) and Veil rail; no rods, masts are 13 m apart, no bracing, paint or lamps. The lamp standards (every 30 m, alternating sides) stay as bare 9.75 m posts (the tallest part, 49.8 m above the valley floor), so the far silhouette height matches the near one.
- Materials (both themes): `concrete`, `stone`, `steel`, `asphalt`, `paint`, `yellow`, `rail`, `veil`, `lamp`.

## Cost

| | Triangles | Draws | Bytes |
| --- | ---: | ---: | ---: |
| Near | 48,580 | 17 | 2,041,760 |
| Far | 20,228 | 7 | 580,912 |

Budgets: near 160,000 / 48, far 45,000 / 14. The deck is meshed every 2 m so its chords stay under the HD pavement overlay (a 5 m step sagged 0.14 m); that, and the 238 m of approach, are most of the far model. Overlay draws are added at run time by the shared bridge factory.

## Road fitting (the contract the tests pin)

`prince-edward-viaduct.test.js` (14 tests) pins: the structure is the OSM way and starts/ends on its nodes, with the mapped Bloor Street East and Danforth Avenue running out beyond it; pier stations sit within 3 m of the outline notches; spans equal the published ones (48.2/73.6/85.8/73.6/48.2 m); deck 40 m / 26.2 m wide; the model's asphalt is at `deckHeight(s)` at sampled stations and lanes (ray casts), the Veil rail, subway floor and fascia are where stated; `bridgeRoadHeight` returns the deck for both travel directions and `null` for a perpendicular road, beside the deck, and past the abutment; every mapped crossing (Don Valley Parkway twice, Bayview Avenue, Bayview Multi-Use Trail, Lower Don River Trail, GO Bala Subdivision, Rosedale Siding, the Don River) is refused at 200+ sample points under the deck and passes under an arch, never a pier, with at least 6 m of clearance for the Parkway; standard-road replacement removes a deck triangle and keeps a Parkway triangle beneath it and restores exactly; the ramps and links beside the ends (Bayview-Bloor ramps) are not owned, the approach roads meet the mapped deck exactly at its ends and are themselves the ramp (deck height = the profile there, no step anywhere, steepest slope below 1.5 x 40 / 170); deck height meets any approach pair `[a, b]` exactly with no step; end kerbs follow measured HD footprints and the sidewalks and Veil move rigidly with them; exports keep `_bridgelift` weights, foundations do not move, repeated fits restart from the authored vertices; chords stay under the overlay for approaches `[0,0]`, `[5,5]`, `[10,3]` in both LODs; the runtime layer loads lazily from `/models/bridges/`, uses the far LOD when `lowDetail`, cannot be revived after disposal, and gives the car, route ribbon (+12 cm) and camera the same height.

`layer.js` exports `ROAD_LAYER = { Layer, profile }`. The shared `createBridgeLayer` requests `/models/landmarks/<id>-<detail>.glb` (the Montréal directory) but Toronto exports go to `/models/bridges/`, so `layer.js` subclasses the factory and redirects that one URL. A cleaner fix (a `dir` argument to `createBridgeLayer`) would touch a shared file and is left to the lead.

## Verification

Looked at (procedural source unless marked): near, light: overview, facade (side elevation), roof (from above), crossing (driver's eye on the deck), underside, arches, veil (close detail), structure (subway room), approach (west ramp), east (last arch and ramp). After the review pass, re-read: facade, east, arches, approach. Far, dark: arches. **Exported GLB**: near dark overview, far light overview. Compared against the panorama, the underside and Parkway-side photographs, the deck and Veil photographs and the 1918 archive photographs. Changes made because of what was seen: the first overview was cropped and the crossing view floated 30 m above the deck (presets now deck-relative); the dark subway wall stood in front of the ribs and hid the columns (moved inboard); edge beam, slab and parapet z-fought on the fascia (slab inset, parapet lengthened); the piers were moved to the mapped notches and then re-spaced so that the arches carry the published spans exactly (7 m pier base); after review: the 62 m east ramp (97 % grade) became a 170 m ramp on the mapped approach roads, the pin spans were made exactly the published ones, and the ribs were thickened; the OSM search first centred 700 m from the bridge (the stub origin was wrong) and was redone; the first deck mesh sagged 0.14 m under the HD overlay (2 m step); the pier faces were blank (niches added).

| Mode | Status |
| --- | --- |
| Inspector, near/far, light/dark, procedural and GLB | Verified (screenshots above; `local-scratch/shots/prince-edward-viaduct/`) |
| Cityscape (flat ground) in the running app | Not tested yet; the road fit is checked by the lead in the app |
| Full 3D world (terrain) | Not tested yet; integration is checked separately. The flat-map ramps and `terrainFootprint` corridor are the assumptions to test. |
| HD pavement/paint draping, both directions | Not tested in the app; covered only by the synthetic tests above |
| MCU2/MCU3 performance | Not measured |

The inspector cannot show: the real HD pavement and paint, the `approaches`/`joins` fitting from the loaded roads, the car and route riding the deck, the camera, or the standard/HD road replacement. It has no station slider or drive view for this bridge (`src/asset-preview.js` only knows the Montréal profiles), so `crossing` is a fixed preset; that is a limitation of the shared inspector, which was not edited.

## Known approximations

- The mapped structure is 469.5 m, not the published 494 m (the model follows the map); pier stations are within 2.7 m of the mapped notches and the arch spans are the published ones.
- Approach spans, the pier plan, rib depth and web pattern, the subway room, lamp positions and the Veil geometry are estimates from photographs.
- No subway train, tracks, portal openings through the piers, pier fluting or rivets.
- The 170 m ramps on the mapped approach roads are a flat-map convention; the deck is level (40 m) only from the first pier to the last, and the approach girder/fill is not surveyed.
- The pier notch at P5 is inferred (symmetry).
