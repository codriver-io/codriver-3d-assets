# Albert Bridge (`albert-bridge-london`)

Original procedural model of the present-day Albert Bridge, the A3031 crossing of the Thames between Chelsea Embankment and Battersea, London. It was opened in 1873 as an Ordish–Lefeuvre stayed bridge (Rowland Mason Ordish). Joseph Bazalgette added suspension chains in 1884–87, and the GLC added two concrete central piers in 1973. The model shows the 1992 pastel paint scheme. These features are kept in both LODs: four octagonal cast-iron columns with open lanterns and slender needles on cylindrical iron piers; lattice-arched portals; 32 flat-bar stays fanning into both spans; the eyebar chains with hangers; pink girders; the concrete central piers; and the four octagonal toll booths at the two entrances.

Source: `src/peregrine/landmarks/top-cities/albert-bridge-london/`. Catalog: `prototypes/assets3d/catalog.d/albert-bridge-london.json`. Exports: `public/models/bridges/albert-bridge-london-{near,far}.glb` and `albert-bridge-london.json`. Rebuild: `pnpm build:top-cities-landmarks albert-bridge-london --no-check`.

## Sources

- [Wikipedia, *Albert Bridge, London*](https://en.wikipedia.org/wiki/Albert_Bridge,_London), wikitext read 2026-10-15, with its cited sources (Cookson 2006, Matthews 2008, Davenport 2006, Tilly 2002). It gives: 710 ft (216.4 m) long, 41 ft (12.5 m) wide, a roadway "only 27 ft" (8.2 m), a central span of 384 ft 9 in (117.3 m) before 1973 and 185 ft after, height 66 ft (20.1 m), clearance 37 ft 9 in (11.5 m) at lowest astronomical tide, 32 inclined stays from four octagonal cast-iron columns standing *outside* the deck on cast-iron piers, two concrete central piers (1973), octagonal toll booths at each entrance (London's last), and the 1992 conspicuity colour scheme lit by about 4,000 LEDs.
- OpenStreetMap (© OpenStreetMap contributors, ODbL 1.0). From the prepared dossier (`tmp/top-cities/albert-bridge-london/osm.json`) and one query through the shared Overpass helper (`notes/buildings.json`):
  - the A3031 ways in `albert-bridge-london-alignment.js`;
  - the `man_made=bridge` outline [378295023](https://www.openstreetmap.org/way/378295023), whose pier circles locate the 1973 piers;
  - the four tower piers, mapped as `building=yes man_made=tower height=20`: 1385662670, 1385662671, 857860925, 857860926;
  - the four toll booths, mapped as `building=yes` with the description "originally toll booths": 378295025, 378295026, 250356517, 250356518.
- Reference photographs: the dossier's six Commons images (credits in the catalog record), kept only in ignored scratch. No image, texture, scan or third-party mesh is shipped.

## Dimensions

| Dimension | Model | Basis |
| --- | ---: | --- |
| Tower pier centres | 121.90 m | Mapped (both tower rings average). Published 384 ft 9 in (117.3 m) is the clear span: 121.9 − 4.6 m pier = 117.3 ✓ |
| Overall, abutment to abutment | 216.4 m | Published 710 ft. Side spans (47.25 m each) take what the mapped main span leaves |
| Toll booths | stations 17.6 / 236.7 m, ±7.4 m | Mapped octagons, within 1.6 m of the abutments |
| Deck over the girders / roadway | 12.8 / 8.2 m | Published 41 ft deck and 27 ft roadway; 1.9 m footways and 0.4 m girders are estimates |
| Column / pier centres | ±8.5 m from the road centre | Mapped tower rings (±8.1–8.8 m) |
| Pier diameter | 4.4–4.6 m | Mapped rings (r ≈ 2.1–2.3 m) |
| Column, pier top to capital | 20.1 m | Published "height 66 ft", read as the cast-iron column. The photographic estimate agrees (≈ 18.5 m above the roadway) |
| Lantern / spire / finial above the roadway | 21.0 / 23.6 / 28.4 m | Estimated: side-on photograph (*from Chelsea Embankment*) scaled by the mapped span gives ≈ 23.6 m lantern top and ≈ 29 m finial |
| 1973 central piers | Two Ø 4.8 m cylinders at ±8.6 m plus a crosshead | Mapped outline circles (±9.2 m); section estimated |
| Stays | 32: 4 per column into each span, anchors 12–48 m (river) and 10.5–42 m (bank) from the tower | Count published; anchor stations measured from the side-on photograph |
| Chains | Main chain from the column heads to the girder at mid-span; side chains to the abutments; hangers every ~3 m | Layout from photographs; sag estimated |
| Flat-map roadway | 4.6 m at the towers, 5.42 m at mid-span (2.7 % camber) | Cityscape compromise (see below) |

## Geometry and placement

The model is in real metres, east/up/south, with rotation baked in. The origin `[-0.1666947, 51.4822574]` is the midpoint of the mapped 1973 central piers. Station s runs along the mapped A3031 from the north split (Chelsea Embankment junction mouth, s = 0) to the end of way 591291850 short of the Battersea Park cycle crossing (s = 264.09 m), at a bearing of 162.9°. Lateral d is right of travel (west). The profile (`albert-bridge-london-profile.js`) is shared by the GLB, the runtime registry bridge layer, the HD pavement, the car, the route and the camera. The stays, chains and hangers come from one layout module (`albert-bridge-london-members.js`) that both the geometry and the tests use.

- **Columns:** an octagonal plinth, a pale-green core (`glow`, so it lights at night like the real LED-lit columns), four pale-blue colonnettes, five white bands, a flared capital, an eight-post open lantern with a small internal lamp, a narrow rim and four corner pinnacles, a short weather cap, eight tapered crown ribs and a slender needle.
- **Portals:** a lattice girder and an elliptical arch between the column heads, with spandrel lattice, cresting and a central finial. The roadway is open under both portals in both directions.
- **Deck:** asphalt, raised footways, pink outer girders/parapets with a white cap, white stiffeners and gilded roundels (outer face every 2.4 m, inner face every 4.8 m), an iron floor and cross girders, and an LED string on the cap. White brackets tie the columns to the girders.
- **Supports:** the iron tower piers with caps, the concrete central piers and crosshead, and masonry abutments. The octagonal toll booths have a dark base, lime walls, blue pilasters, pink panels, dark windows, a white cornice and a slate roof.
- **Lamps:** eight ornamental lamp standards per side.
- **Far LOD:** keeps the columns (6-sided cores), open lanterns, crown ribs, corner pinnacles and needles, the portal girder and arch, all 32 stays, the chains (10/6 segments) and every other hanger, plus the girders, piers and booths. It drops the colonnettes, roundels, stiffeners, lamps, cross girders and LED strings. Booth windows and pink panels remain as recessed faces in a split facade. Minor materials merge (`blue`→`glow`, `paving`/`concrete`→`stone`, `light`→`white`).

**Flat Cityscape.** The basemap has no river, so the deck rises from both approach roads: constant grades of 8.22 % (north, over 66 m to the tower) and 6.99 % (south, over 76 m), joined by 14 m vertical curves at the street and 10 m curves into the 2.7 % main-span camber. The steepest grade is 8.2 %. Both ends are at 0 m, and there is no step at the joins. The real deck stands well above high water. The flat-map ramp leaves the side spans sloping and the abutments low; that is the compromise.

**Landings.** On land the carriageway eases from the rigid 8.2 m to the streets it joins: 10.8 m at the Chelsea Embankment junction mouth and 9.0 m to Albert Bridge Road. The footways follow it, and stone skirts close the ramp down to grade. The pink parapets start at the abutments, where the toll booths stand, which is where they end on the real bridge. `fittedLateral` is identity: the iron deck keeps its authored width.

**Full 3D world (`terrainPolicy: 'absolute-deck'`).** The ramps start at the DEM at the alignment ends. The span is lifted to 1.8 m above the higher bank (`deckHeight(s, approaches)`: tower deck = max(4.6, max(bank) + 1.8)). In Cityscape the approaches are [0, 0] and nothing changes. In the app the Terrarium banks read 4.33 m (north) and 5.27 m (south). That puts the deck at 7.07 m above datum at the towers and 7.90 m at mid-span: it humps over both embankments as the real deck does. It is probably 1–1.5 m lower than the real deck: the published 11.5 m clearance at lowest astronomical tide implies about 9 m, but that tide datum is itself an estimate. Pier feet keep `bridgeLift` 0 and reach the ground; everything at deck level and above moves with the deck.

**Provider masking.** `FOOTPRINTS` = the bridge outline plus the eight extruded buildings (four `height=20` towers and four booths). The last eight are also `buildingFootprints`, so the provider boxes vanish once the model is visible.

## Materials

| Material | Use |
| --- | --- |
| `asphalt` | Roadway |
| `paving` | Footways and connected booth aprons |
| `stone` | Skirts and abutments |
| `pink` | Girders and parapets |
| `white` | Paint: columns, stays, portals, hangers |
| `chain` | The eyebar chains; same white, kept separate so hanger contact is testable |
| `glow` | Column cores: pale green by day, self-lit warm at night |
| `blue` | Colonnettes and booth pilasters |
| `gold` | Roundels |
| `iron` | Piers, floor and cross girders |
| `concrete` | 1973 piers |
| `booth` | Lime booth walls |
| `roof` | Booth bases and roofs, dark windows, lamp poles |
| `light` | Self-lit: lantern cores, lamps, LED strings |

Dark keeps the structure readable and lights the columns, lanterns, lamps and the LED strings on the chains and parapet.

## Approximations

- The column cross-section, lantern, spire, portal lattice, cresting and chain section are interpretations from photographs.
- The stay anchor stations and chain sag are measured from one side-on photograph.
- The real chains are eyebar chains with wire-rope stays. Here every member is a simple bar, and stays reach the column centre.
- There are no rivets, lettering, notices, coats of arms, kerb paint or individual LED bulbs.
- Booth details are simplified to panels, windows and pilasters. The approach footways widen around each booth with a level seat blended into the neighbouring pavement and ground-fitted outer abutment skirts; there are no separate cylindrical booth plinths.
- The real 1973 piers sit under the deck; here they are placed at the mapped circles, slightly outboard.
- Night lighting is a stylised treatment. Colours are calibrated to the 2012 and 2023 photographs.

## Costs

| LOD | Triangles | Draws | KB |
| --- | ---: | ---: | ---: |
| Near | 32,814 | 14 | 1,669 |
| Far | 10,554 | 9 | 596 |

That is within the bridge caps (120 k / 40 / 4.5 MB near and 30 k / 10 / 1.2 MB far) with wide headroom. Far bounds equal near bounds: y = 0 to 33.0 m.

## Verification

`node --test src/peregrine/landmarks/top-cities/top-cities.test.js src/peregrine/landmarks/top-cities/albert-bridge-london/albert-bridge-london.test.js` passes 798/798. The landmark test asserts:

- the mapped clear span (121.9 − 4.6 = 117.3 m), the 216.4 m overall length and the 162.9° bearing;
- tower and booth rings under the modelled members;
- finials at 28.4 m above the roadway, piers on grade and column plinths on the pier caps;
- the concrete crosshead meeting the floor;
- the roadway open under both portals in both directions at 0.6 m and 4.5 m;
- asphalt facing up;
- every stay head inside its column and every stay foot in the girder; every chain end in a column or girder, with the main chain meeting the girder at mid-span; and every hanger touching its chain and girder, in both LODs. Negative cases fail: a stay cut 3 m short and a hanger cut 1.5 m short;
- the deck inside the mapped outline envelope and attachment weights in [0, 1];
- the far LOD keeping the silhouette;
- flat-map grades under 8.5 %, `bridgeRoadHeight` in both headings, null for a crossing heading and 20 m off the road, and world lift above the banks;
- a GLB round trip: bounds, `_bridgelift`, materials.

`node scripts/landmark-depth-layers.mjs --ids albert-bridge-london` reports 0 cycles. The first export had two: a column bracket poking into the girder, and a land-skirt end face coplanar with the footway end. Both were fixed. `--check` reports the layers as current. `node scripts/asset-catalog.mjs`: valid.

Screenshots I inspected:

- **First look** (`tmp/top-cities/shots/albert-bridge-london/r1/`): the procedural near light sheet, the top view and the far dark sheet, plus a long-lens side elevation compared against *Albert Bridge from Chelsea Embankment*. The tower height to span ratio is 0.224 against 0.236 in the photograph. I changed three things: the central piers moved out to the mapped circles, the booth plinths were slimmed, and the overview and facade cameras moved closer.
- **Exported GLB** (`r2/`): near and far sheets, light and dark (overview, facade, back, above, deck, underside, tower, booth). The deck view matches *Albert Bridge at night* (portal arch, booths, lamp standards, parapets). Far keeps the spires, portals, stays and chains. At night the columns, lanterns and LED strings glow.

## Mode verification

Protomaps tiles. Both servers were stopped afterwards. The generated bundles are not committed.

**Cityscape: verified locally.** I looked at:

- the prescribed far / near / street app shots;
- street-level shots at both landings, looking onto the bridge and off it: `north-to-s`, `north-to-n`, `south-to-n`, `south-to-s`;
- a context view of the south junction.

Sheet: `tmp/top-cities/shots/albert-bridge-london/app-cityscape/cityscape-sheet.jpg`, with singles in `app-cityscape/` and `app-cityscape-landings/`. The near GLB loads close up and the far GLB at the far zoom. The provider's `height=20` tower boxes and booth boxes are masked, and there is no generic second deck. The pavement meets the deck at 0 m with no step at either end. The taper to the Chelsea Embankment junction mouth reads, and the booths frame both entrances.

South of the deck end, the A3031 into the Battersea junction draws in the same pale grey as the surrounding junction area. The replacement removes only provider triangles whose three centres all project onto the alignment, so a segment crossing the end at s = 264 is kept. This is provider styling, not our mask. I could not toggle the layer off in the page to prove it visually.

**Full 3D world: verified locally for standard roads and terrain fitting.** I looked at the same shots in world mode: `app-world/world-sheet.jpg` and singles. The approach ramps start on the DEM at both ends, the piers and booth plinths reach the ground and riverbed, and the span humps 1.8 m above the higher bank.

`window.__map.landmarks.heightAt(lng, lat, heading)` was sampled along the alignment (`tmp/top-cities/albert-bridge-london/probe.mjs`; numbers in `app-*/probes.json`). Southbound and northbound always agree. A crossing heading (+90°) and a point 20 m off the road return `null` at every station in both modes.

| Station m | Cityscape heightAt, southbound / northbound | World ground m | World heightAt, S / N | World absolute deck m |
| ---: | ---: | ---: | ---: | ---: |
| 0 | 0.000 / 0.000 | 4.325 | 0.000 / 0.000 | 4.325 |
| 10 | 0.293 / 0.293 | 3.312 | 1.185 / 1.185 | 4.497 |
| 19.09 | 0.994 / 0.994 | 2.135 | 2.772 / 2.772 | 4.907 |
| 40 | 2.711 / 2.711 | -0.137 | 6.049 / 6.049 | 5.913 |
| 66.34 | 4.600 / 4.600 | -1.249 | 8.323 / 8.323 | 7.074 |
| 100 | 5.258 / 5.258 | -1.270 | 9.002 / 9.002 | 7.732 |
| 127.29 | 5.423 / 5.423 | -1.258 | 9.155 / 9.155 | 7.897 |
| 160 | 5.186 / 5.186 | -0.463 | 8.123 / 8.123 | 7.660 |
| 188.25 | 4.600 / 4.600 | 0.762 | 6.312 / 6.312 | 7.074 |
| 220 | 2.594 / 2.594 | 2.617 | 3.625 / 3.625 | 6.241 |
| 235.49 | 1.510 / 1.510 | 3.839 | 1.998 / 1.998 | 5.837 |
| 250 | 0.496 / 0.496 | 4.877 | 0.582 / 0.582 | 5.459 |
| 264.09 | 0.000 / 0.000 | 5.274 | 0.000 / 0.000 | 5.274 |

World `heightAt` is relative to the ground under the car; absolute = ground + heightAt.

**Not verified:**

- HD lane paint and lateral fitting: there is no Redis or `/osm-lanes` locally, so the deck shows the shared pavement colour and no lane markings.
- Route and car playback, the mode/failure/re-anchor lifecycle, and dark-theme app shots.
- Performance on Tesla hardware.

## Review fix (g5, 2026-10-15)

1. **Solid castle-like tower tops → open cast-iron lanterns.** Both LODs now retain eight slender lantern posts, a small internal lamp instead of an opaque core, four delicate corner pinnacles, a 0.45 m weather cap instead of the 5.55 m solid cone, eight tapered crown ribs and a thin needle. The crown ribs end 23.6 m above the tower roadway; the needle retains the 28.4 m finial height. Every post, rib and needle meets a named support, tested with the member excluded and a shortened-post negative case. Rays pass through the lantern and crown bays in both LODs.
2. **Bare cylindrical booth pedestals → connected approach footways.** The approach walks flare from 6 m to about 9.65 m from the road centre around each booth. A level seat over the booth's plan blends into the adjoining walk over 5 m; stone outer skirts reach the local ground. The booth's dark base sits directly on this continuous paving. Raycasts verify paving under each base and across its connection to the ordinary walk in both LODs. Far booths also keep the window and pink-panel rhythm as recessed faces, without overlaid coplanar wall panels.
3. **Local world landing dips.** On the current production Mapterhorn terrain the first landing probes exposed up to 0.137 m of burial near a street end. The existing absolute-deck terrain clamp is enabled with 0.10 m clearance (`lateralBankFit.terrainClamp`), so pavement, booth aprons and heightAt share the local ground correction. The span keeps its original profile and rigid width. A synthetic local rise missed by the bank samples exercises this case in near/far tests.

Opened exported GLB sheets: `tmp/top-cities/shots/albert-bridge-london/g5-glb-near/albert-bridge-london-glb-near-light-sheet.jpg` and `g5-glb-far-final/albert-bridge-london-glb-far-light-sheet.jpg` (overview, deck, tower, booth), compared against dossier photographs 4 and 6. Both near and far lanterns have visible negative space; both near and far booths meet broad continuous pavement instead of isolated plinths.

Evidence: `tmp/top-cities/shots/albert-bridge-london/g5-verified/{cityscape,world}/` (both street ends in both directions and far), plus `g5-details/{cityscape,world}/` (close booth aprons; unobstructed forward views). Reports include heightAt along the alignment in both headings and transverse-heading refusals. These g5 captures supersede the older Terrarium datum measurements for the current source. HD lanes, driven car/route playback and hardware performance remain not tested.

Costs (tris / draws / KiB), before → after: near 27,752 / 14 / 1,482 → 32,814 / 14 / 1,669; far 6,840 / 9 / 381 → 10,554 / 9 / 596. Added far detail preserves the openwork and booth window rhythm with unchanged draws. Export depth check: zero cycles, current table. Focused landmark tests cover the open bays, support contacts, paving connections and world clamp, with no SPEC.ready assertion. The landmark tests (18/18), full folder-registry run (835/835 including the landmark), and asset catalog checks pass.

The lead authorized one focused approach tessellation follow-up after the two GLB look-fix rounds. Interior vertices now subdivide the road top into 12/6 lateral strips near/far and the footways into 4/2, with extra shared longitudinal keys at both street ends. This removes the north-world pale patch caused by terrain rising above the chord between the two road edges. A fitted-mesh raycast now verifies the actual centre of a synthetic lateral crest against heightAt in both LODs; the old two-edge top fails this check. Fresh final world captures in both directions plus a close-up are in `tmp/top-cities/shots/albert-bridge-london/g5-north-paving/world/` (the patch is gone); these supersede earlier north-world pavement views. The added vertices retain 14/9 draws and stay within the bridge budgets.
