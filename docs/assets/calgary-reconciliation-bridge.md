# Calgary: Reconciliation Bridge (Langevin Bridge)

Folder: `src/peregrine/landmarks/calgary/reconciliation-bridge/` · catalog `prototypes/assets3d/catalog.d/reconciliation-bridge.json` · exports `public/models/bridges/reconciliation-bridge{-near,-far}.glb` + `.json` · contract [3d-calgary-landmarks.md](../calgary-landmarks.md).

## Identity

The steel through truss over the Bow River between Bridgeland/Riverside and downtown (East Village), opened in 1910 as the Langevin Bridge and renamed Reconciliation Bridge by City Council in 2017 (ceremony 2018). The trusses standing today are the 1910 riveted steel ones: the City of Calgary heritage inventory dates the superstructure to 1910 (only the street-railway tracks were removed, in the 1950s); no replacement of the trusses is recorded. It is a **two-span Parker camelback through truss** of eight panels per span on one concrete river pier and two abutments, painted silver-grey, with a steel sidewalk and lattice balustrade cantilevered outside each truss, programmable LED lighting on the trusses (2009) and art banners on the verticals.

Traffic: the mapped roadway on the truss (OSM way 257636719, `4 Avenue SE`, `oneway=yes`, `lanes=2`, `maxheight=4.2`) runs **north to south only**: Edmonton Trail / 4 Street NE traffic into downtown. Northbound traffic uses the curved concrete 4th Avenue Flyover 25 to 45 m to the west, which this model does not touch. A driver sees the camelback outline from Memorial Drive and from the 4 Avenue approach, then drives inside the trusses under the laced portals and top struts.

## Sources

| Fact | Source |
| --- | --- |
| 1910; two-span Parker camelback riveted-steel through truss; 116.58 m long, 14.02 m wide; one pier and two abutments; 1.5 m steel sidewalks each side with a lattice balustrade; Canadian Bridge Company / Province of Alberta Public Works | City of Calgary heritage inventory statement of significance, as reproduced on [HistoricBridges.org](https://historicbridges.org/bridges/browser/?bridgebrowser=alberta/langevinbridge/) |
| 8 panels, rivet-connected Parker through truss, main spans 190 ft (57.9 m), structure 382.5 ft (116.6 m), 2 spans | [HistoricBridges.org](https://historicbridges.org/bridges/browser/?bridgebrowser=alberta/langevinbridge/) |
| Opened 1910; carries Edmonton Trail; renamed 2017; 2009 LED lighting (5,600 LEDs in 156 assemblies) | [Wikipedia](https://en.wikipedia.org/wiki/Reconciliation_Bridge) |
| Roadway one-way southbound, 2 lanes, signed clearance 4.2 m; deck outline (-7.7 .. +7.1 m about the roadway); sidewalks mapped as cycleway bridges at -6.4 / +5.45 m; RiverWalk passing under the south span 15 m from its end, Bow River Pathway under the north end | OSM ways 257636719, 1325528737, 172284463, 172284473, 1325528743, 1325528742, 1325528739 (Overpass, OSM base 2026-10-02, ODbL) |
| Photographs (comparison only, kept in ignored `tmp/`) | Qyd, *Reconciliation Bridge-Calgary* (CC BY-SA 3.0); Daniel from Glasgow, *Bridge over the River Bow*, *Bridges over the Bow River*, *Calgary, April 2016 (19)* and *(22)* (CC BY 2.0); Crisco 1492, *4th Ave and Reconciliation Bridge from Calgary Tower* (CC BY-SA 4.0) |

OSM tags the outline `bridge:structure=arch`: wrong, it is a through truss (every photograph).

## Frame

Origin `[-114.0523221, 51.0499241]`: the middle of the mapped roadway, which is the pier centre. Station `s` runs north to south along the alignment (the direction of travel), lateral `d` is positive to the right of travel (west, upstream), `y` up; the alignment is the mapped roadway (115.0 m) plus 5 m of each mapped approach road (4 Street NE to the north, 4 Avenue SE to the south), 125.0 m in all. Bearing 209.1 deg. `y = 0` is the road surface.

## Dimensions

| Quantity | Model | Basis |
| --- | --- | --- |
| Spans | 2 x 57.6 m (8 panels of 7.2 m), 1.2 m gap over the pier | Published 190 ft / 57.9 m, 8 panels (0.5 % short so the panels are round) |
| Trusses out to out | 116.4 m (s 4.3 .. 120.7), within 1 m of the mapped way's end nodes | Published 116.58 m |
| Overall width | 14.0 m at the balustrade rails (measured by a ray in the test) | Published 14.02 m; mapped outline 14.8 m |
| Truss centre lines | 10.0 m apart (C0 +/- 5.0, C0 = 0.3 m east of the mapped road way) | Estimated from width, sidewalks and the mapped sidewalks |
| Carriageway | 8.2 m kerb to kerb, two southbound lanes | OSM lanes=2; width estimated |
| Sidewalks | 1.5 m clear outside each truss, +0.25 m | Published |
| Truss depth (bottom to top chord centre lines) | hips 7.8 m, U2 9.9, U3 10.8, U4 11.0 m (Parker camelback, symmetric) | Estimated: perspective fit of a near side elevation (*Calgary, April 2016 (19)*), ratios 0.71 / 0.92 / 0.99 / 1 |
| Top of structure | 11.2 m above the road (LED strip on the top chord) | From the above |
| Lowest member over the carriageway | 5.18 m (portal knee braces at the kerb); portal girder 5.84 m; struts > 8.9 m | Model choice: >= 5 m (brief) though the signed clearance is 4.2 m |
| Pier | 3.4 x 14.4 m at the cap plus a 2.0 m upstream and 1.2 m downstream cutwater, battered; cap at -1.65 m | Estimated from photographs |

## Modelling decisions

- **Recognition features**: the two camelback outlines (end posts and polygonal top chord as riveted boxes with joint blocks), Pratt main diagonals sloping down to mid-span plus counters in every interior panel (the photographs show an X in each), laced verticals (two channels and zig-zag lacing on both faces, near), slender hip hangers, laced portals under the hips with knee braces kept outside the kerbs, laced top struts with knee braces at U2..U6, top lateral X bracing, the floor beams and stringers, bearings, the cantilevered sidewalks with their rusty fascia and diamond-lattice balustrade, the art banners (near) and the LED strips on the top chords and end posts (`light`: pale steel by day, blue at night).
- Far LOD: same outline, bottom chords, plain verticals, main diagonals, portal plates and struts, deck, sidewalks, rails and posts; no lacing, counters, banners, X bracing, floor beams' brackets or stringers. 5,224 triangles (28 % of near); bounds identical.
- Materials (both themes): `steel`, `concrete`, `asphalt`, `paint`, `deck`, `rail`, `light`, `banner`. One chunk (a 125 m bridge gains nothing from culling chunks). `steel` is a mid-grey (`#9b9fa0` light, `#646e76` dark; the photographs show painted steel darker than the silver first used, 20 % darker than `#c2c7c8` / `#7d8993`). The end floor beam at each outer end of the deck is `concrete`: past the slab it showed as a dark steel line.
- Attachment weights (`bridgeLift`): everything above the road follows the deck (1); the pier and the abutment seats go from 0 at their foot (`y = -2.9`) to 1 at the bearing seat. The abutment backwall under each deck end is authored **2 mm tall** with weight 0 at its foot and its approach-facing end left open, as is the seat's back: the flat map's ground writes no depth, so a buried face shows through the approach road (a 15 m wide pale block at both ends in the first in-app shots); in Full 3D world the foot drops to the bank's ground and the wall fills up to the deck.

## Flat Cityscape and Full 3D world

- **Cityscape**: the real deck is at the level of the banks' streets, and both approaches join at-grade junctions within 15 m of the deck (the primary_link merge 13.3 m north, Riverfront Avenue 14.7 m south), so there is **no flat-map ramp**: profile `[[0, 'start'], [L, 'end']]`, the deck is level with the loaded approach roads and eases between them if they differ (steepest grade 1.5 x their difference / 125 m: 1.0 % for 0.8 m). The floor system, pier and abutment seats hang below `y = 0` (down to -2.9 m), visible only from the river side.
- **Full 3D world**: `terrainPolicy: 'absolute-deck'`: no corridor flattening (a flattened corridor would trench 4 Street NE and 4 Avenue SE); the deck spans between the DEM at the two alignment ends and never dips below the DEM under it; the pier and abutment seats reach their own ground. The tests check this on a synthetic valley (banks 1045 / 1044 m, river 1039 m): deck 1044–1045 m over the river, pier foot on the river bed, heightAt = deck above the bed.

## Cost

| | Triangles | Draws | Bytes |
| --- | ---: | ---: | ---: |
| Near | 18,556 | 8 | 1,128 KB |
| Far | 5,224 | 7 | 320 KB |

Bridge budgets: near 120,000 / 40 / 4.5 MB, far 30,000 / 10 / 1.2 MB. `qa-metrics.mjs`: no coplanar pairs, 2 % back-face hits (the deliberately open, always-buried ends of the abutment seats, backwalls and deck slab; 0.7 % before they were opened), min y -2.9 m.

## Verification

Inspector (`node .agents/skills/build-3d-city/scripts/shot.mjs`, sheets in `tmp/calgary/shots/reconciliation-bridge/`): near light overview/facade/roof/deck/underside/tower (it1), a view matching *Calgary, April 2016 (19)* side by side with the photograph (it1/cmp5.jpg: led to counters in every interior panel, smaller duller banners and a deeper floor system), exported GLB far light, near dark, plan view (it2: led to pale sidewalk plates, a thicker LED strip), exported GLB near light final (it3). The plan view shows the 209 deg bearing on the mapped roadway.

In the running app (bundle built in this worktree, local servers on 3274 Cityscape / 3276 terrain, `app-shot.mjs` and `tmp/calgary/reconciliation-bridge/probe.mjs`; HD lanes answer 503 locally, so the approaches are the standard roads at 0):

| `heightAt(lng, lat, heading)` | Cityscape | Full 3D world (Terrarium, NRCan CDEM) |
| --- | --- | --- |
| Deck, every probe s = 0.5 .. 124.5 m, heading 209.1 and 29.1 | 0.00 | 0.01 (north end) .. 0.65 (s 20) .. 0.40 (pier) .. 0.00 (south end): deck above the local ground |
| Ground under the deck | n/a | 1044.8 m north end, 1044.0 m over the river and south end (the DEM does not resolve the 5 m banks here) |
| Beyond either end, west/east sidewalk, RiverWalk crossing (heading 128), 4th Avenue Flyover (west), Riverfront Avenue junction | null | null |
| Approach datum | [0, 0] | [0, 0] + DEM [1044.81, 1043.99] |

| Mode | Status |
| --- | --- |
| Inspector near/far, light/dark, procedural and GLB | Verified |
| Cityscape, both ends, looking along both directions (north end southbound and northbound, south end northbound and southbound), near LOD, light and dark | Verified: deck level with the approach roads, no step or gap, no doubled deck, the abutment block artefact fixed; the deck asphalt is the HD pavement colour while the local standard road is white (HD lanes unavailable locally) |
| Full 3D world, same four views, far/near/street | Verified on this DEM: deck at grade with both banks' roads, supports underground (the DEM is flat across the river here) |
| HD pavement/paint draping and lateral fit | Not tested in the app (503 locally); covered by the shared bridge tests only |
| MCU2/MCU3 performance | Not measured |

## Known approximations

- Truss depths, member sizes, lacing, portal and sway bracing, floor system, pier plan and cutwaters, abutments, balustrade pattern, LED and banner positions and colours are estimates from photographs; the banners are one muted colour (the real ones are multicoloured art).
- Portal clearance is modelled at >= 5 m over the carriageway; the signed clearance is 4.2 m (real knee braces probably reach lower).
- The deck is level with both banks; any real vertical curve is not modelled. In Full 3D world the coarse DEM puts the river at bank level, so the pier is underground there.
- No rivets, gusset plates, lamp standards, utility pipes, bottom lateral bracing or LED colour programs.
