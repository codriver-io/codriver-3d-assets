# Casino de Montréal

Landmark id `casino-de-montreal`. Original procedural model of the Casino de Montréal, 1 avenue du Casino, Île Notre-Dame, in its form since the 2013-2017 expansion. It occupies two Expo 67 pavilions and a newer link between them, which OpenStreetMap maps as two building ways and a driver sees as one complex:

- the **Pavillon de la France** (Jean Faugeron, 1967; casino since 1993, Faugeron and André Blouin): a drum of flared and vertical aluminium ribs over lit glazing, with a glazed lantern; a cascade of terraces with a mast on its west side; a stack of concrete shafts on the north apron; the north-east entrance canopy with a mushroom umbrella;
- the **Pavillon du Québec**: a box of gold-tinted glass on a recessed glazed ground floor, with white tapered corner posts and a white louvred roof band;
- the **link**: a low two-storey block and a 10 m corridor, plus a long ramp-and-stairs wedge on the south-east side.

Source: `src/peregrine/landmarks/quebec/casino-de-montreal/` (`config.js`, `footprint.js`, `geometry.js`, `views.js`, `casino-de-montreal-site.js`, `-mesh.js`, `-drum.js`, `-wings.js`, `-quebec.js`, `casino-de-montreal.test.js`). Build: `pnpm build:quebec-landmarks casino-de-montreal`. Exports: `public/models/buildings/casino-de-montreal{-near,-far}.glb` and `.json`. Contract: [3d-quebec-landmarks.md](../quebec-landmarks.md).

## Frame

Real metres, +X east, +Y up, +Z south. Origin `[-73.525794, 45.50554]` is the centre of the drum, fitted to the two mapped rim arcs (circle fits: radius 32.0 m on the north-west, 39.7 m on the east, centres 0.8 m apart). `y = 0` is the entrance grade on the made ground of the island. Nothing is rotated: every plan polygon in `casino-de-montreal-site.js` is a mapped OSM outline expressed in the model frame, so the real orientation is in the numbers (the Québec pavilion's edges bear 91.9, 180.4, 271.7 and 2.5 degrees, a 1.7 degree skew from the grid). The layer must not rotate the model.

## Dimensions

| Feature | Model | Basis |
| --- | --- | --- |
| Drum rim | circle r 31.4 m round the origin on the west and north, flaring to 39.7 m on the east and south-east wing | mapped: NW arc fit 32.0 m (the mapped rim wanders 30.5 to 32.9 m, so the model uses 31.4 m to stay inside it), east arc fit 39.7 m |
| Fan of flared ribs | 120 ribs, 9.6 m to 20.0 m, leaning out 6.5 m | estimated from photographs (Commons 4, 6, 7); count and lean estimated |
| Ring beam | 20.0 to 21.2 m | estimated |
| Louvre drum | 120 vertical ribs 21.2 to 31.6 m at r 30.6 m in front of lit glazing at r 29.4 m, roof 30.4 m, two slab edges at 24.2 and 27.4 m | estimated |
| Glazed lantern | r 12 m, 30.4 to 33.2 m, conical cap to 35.0 m | estimated (Commons 4) |
| Link and corridor | 9.0 m (two storeys), 5.3 m glazed ground floor, white fascia; corridor 9.7 m wide, 29 m long | plan mapped; heights estimated |
| West terrace tower | six decks from 8 m, 3.4 m apart, 1.1 m thick, each stepping 1/6 of the way in; top deck 25 m | outline of the lowest deck mapped (OSM 439917766); heights estimated (Commons 1, 4, 7) |
| Mast | 4-sided taper, 30.4 to 44.0 m | estimated; the model's highest point |
| Shaft stack | four stepped concrete shafts 36, 31, 27.5 and 22 m, antennas to 41 m | footprint region mapped (the stepped bump of OSM 439917766); heights estimated (Commons 6, 7) |
| Entrance canopy | slab 8.8 to 9.8 m on the mapped north-east triangle (about 35 m on its long edge), lit leading edge, triangular fin wall at the tip, columns | plan mapped; heights estimated (Commons 2) |
| Mushroom umbrella | column 5.4 m, 12.4 m umbrella at 6.3 to 7.5 m, 8 ribs | estimated (Commons 4) |
| South-east wedge | solid ramp from the 9 m podium to grade at its tip, 58 m long, with stair nosings every 2 m | plan mapped; slope estimated |
| Pavillon du Québec | mapped 48 x 48 m square at 6 m; gold body to 28.4 m, leaning in 10 per cent; roof band box to 31.9 m; ground floor recessed 3.4 m under the overhang | plan mapped; heights, lean and recess estimated (Commons 3, 8) |

No published heights exist for either pavilion (Wikipedia gives only the six storeys and the dates), so every height is an estimate from photographs calibrated on doors, stairs and railings.

## Materials

`alu` (ribs, louvres, canopy slab, mast, mullions, corner posts, roof band, the white piers of the link), `concrete` (ring beam, fascia, link walls, shafts, terraces), `glass` (ground-floor glazing, windows, umbrella: a light blue-grey `#7f9ca7` by day, the first version `#4d6772` read as opaque teal slabs), `glow` (the lit glazing behind the ribs, lantern, canopy edge: unshaded, pale glass by day and warm light at night), `gold` (the Québec pavilion's glass in near: a deeper bronze-gold `#a98a42`, about 15 % deeper than the first pale yellow), `goldMid` (far only: the near wall's average of gold and its white mullion and spandrel bars, `#b49c6e`, so far does not read darker than near), `roof` (flat roofs and deck tops). Light and dark palettes share the keys; dark dims everything, warms `alu` and `concrete` slightly (the casino is floodlit) and turns `glow` orange. Six draws in near and far (far swaps `gold` for `goldMid`).

## Modelling decisions

- The drum is a body of revolution whose top-ring radius depends on the angle: 31.4 m round most of it and 39.7 m on a wing from 8 to 80 degrees (east to south), where the ribs flare the most, as in the mapped outline and the photographs. The fan, the ring beam, the fascia and the ground-floor glazing all follow that radius, so the wing is one continuous sweep.
- Ribs are 0.85 m blades with about 1 m gaps (near: 120 + 120; far: 60 + 60 and no ledges), standing in front of an unshaded cone and cylinder, so the gaps read as lit glazing at night (Commons 2) and as pale glass by day.
- The terrace tower is six deck prisms, each outline the lowest deck's mapped outer edge pulled toward the drum by k/6, closed by an arc on the rim, with a dark glazed ground floor, thin parapets and columns that stand on the deck below.
- The link block and the corridor are glazed arcades under a white band: the 5.3 m of glass has a white pier (a flat 0.6 m strip standing 0.12 m proud, `alu`) about every 6 m, under the concrete band up to the 9 m podium roof, so the 9 m wall reads as glazing between white piers and not as a teal slab (about 130 triangles near and far).
- The Québec pavilion's gold body starts at the mapped square (the overhang), its walls lean 10 per cent toward the centre, and a dark glazed ground floor stands 3.4 m behind. Corner posts are tapered white strips on both walls of each corner; mullions and spandrel joints are fine bars 0.04 m proud of the glass (near only).
- Hidden faces are not drawn (ground-floor glass where the link or the terrace tower covers it, the drum's ribs' inner faces, bottoms). Overlapping solids (decks through the ring beam, the corridor through the pavilion's wall) are not coplanar; `qa-metrics` finds no coplanar pair and no back-face hit.

## Approximations and what is left out

Every height, the rib counts and flare, the deck count, the shaft heights, the canopy and umbrella, and the ramp slope are estimates. The placement of the terrace tower (west), the shaft stack (north apron) and the entrance canopy (north-east) relative to the drum is inferred from the mapped outline and four photographs taken from different sides; the real arrangement may differ in detail (the 1967 and 2019 photographs agree on the order terrace tower, ribbed drum, shafts, but not on which compass side each stands). The wedge is a solid ramp (the real one carries stairs and landings), the mushroom canopy is a single umbrella, the shaft windows are slits. Not modelled: lettering and signs, the pennants along the drum crown, the fountain under the canopy, the outdoor stairs, the waterfront and quay, the flower clock, the hotel announced for 2028. The mapped rim is not a perfect circle; the drum is, at 31.4 m. Cityscape and Full 3D world: not tested yet, integration is checked separately. The model is rigid on local `y = 0`.

For Full 3D world the spec declares an explicit pad: both OSM rings flattened to their median ground with a 10 m feather, rather than a 140 m disc (the complex runs 63 m north and 132 m south of the drum centre and the island edge may be inside such a disc). The island is made ground and expected flat; the lead should check the Québec pavilion's quay side and the south-east ramp tip in `--mode world`.

## Cost

Near 7 612 triangles, 6 draws, 586 KB (was 7 520 / 6 / 579). Far 2 720 triangles, 6 draws, 213 KB (was 2 628 / 6 / 206). Budget for a building: 60 000 / 14 / 2.5 MB near, 12 000 / 8 / 500 KB far. Far keeps the drum, the half-density ribs, the terraces, mast, shafts, canopy, wedge and the gold box; its bounding box matches near.

## Verification

Looked at (renders in `tmp/quebec/shots/casino-de-montreal/` and `.../glb/`, ignored by git): procedural near light overview, east-south-east facade, roof, canopy, terraces, Québec pavilion, link, back and a top view over the red footprint rings; near dark overview, facade, canopy and Québec; far light overview, facade, roof and back; street-level views at about 100 m from the drop-off side, the east wing and the Québec pavilion; the exported GLBs near light (all views), near dark street view at the canopy, far light and dark from 800 m, and low views under the fan, under the canopy and from the west. Compared against Commons photographs 1 to 4 (drum, terraces, entrance, canopy at night, gold box), 6 (1967 French pavilion) and 7 and 8 (2019, drum with shafts and stairs, Québec pavilion on its quay). Changed because of them: the shaft stack moved from the north-east drum rim (where it hid the drum from the drop-off side) to the north apron; the Québec pavilion gained its recessed glazed ground floor and overhang, a concrete ledge and tapered white corner posts after photo 8, with a finer mullion grid and a smaller lean (10 per cent instead of 20); the canopy slab went up 0.2 m (it was coplanar with the fascia, found by `qa-metrics`); the drum radius went from the fitted 32.0 m to 31.4 m so the rim stays inside the mapped outline (worst overhang 0.46 m); the canopy's fin wall became a triangle in elevation and its lit edge was shortened to stay inside the slab corners; stair nosings were added to the ramp.

Review fix (regions batch): the podium and link glass read as opaque teal slabs 9 m tall (now lighter glass with white piers every 6 m), and the Québec pavilion gold was a pale yellow with a far wall darker than near (now deeper gold near and one averaged colour far). Checked on the `qa-sheet.mjs` contact sheet. The terrace tower, shaft stack and canopy sides stay flagged as inferred.

## Tests

`casino-de-montreal.test.js` (0.9 s): heights (mast 44 m near and far, drum roof 30.4 m, lantern cap, shaft steps 36, 31, 27.5 and 22 m), rib and lit-glazing alternations round the drum at two heights (near and far), the flare of the fan on the wing and on the rim side against the mapped radii, six distinct terrace deck tops, the canopy's thickness and the umbrella under it, the Québec pavilion's roof levels, lean, recessed ground floor, east wall on the mapped square and mullion grid, link, corridor and ramp heights, containment in the mapped outlines (worst overhang under 0.8 m), nothing below grade, and the Québec corners being mapped vertices; the link's white piers every ~6 m between pale glass under a white band, and the near gold against the far `goldMid`. `quebec.test.js` passes for the landmark.

## Sources

Wikipedia "Montreal Casino" and "Casino de Montréal" (two former Expo 67 pavilions, Jean Faugeron, opened 9 October 1993, six storeys, Faugeron and André Blouin, Pavillon du Québec added by the 2013-2017 expansion); Casino de Montréal official site (Loto-Québec); OSM ways 26698931 and 439917766, read 2026-10-03. Photographs (Wikimedia Commons, outside the repository): Andrijko Z. "Casino de Montréal 2.JPG" (CC BY-SA 3.0); Igor Galx "Casino De Montreal (219955723).jpeg" (CC BY-SA 3.0); Idej Elixe "Casino de Montréal, pavillon du Québec.jpg" (CC BY-SA 3.0); Benoit Rochon "Casino de Montréal (entrée).jpg" and "(horloge fleurie).jpg" (CC BY-SA 2.5 ca); Laurent Bélanger "Expo 67, pavillon de la France.jpg" (CC BY-SA 3.0); Ryan Hodnett "Montreal Casino - Montreal, Quebec 2019-05-12 (04).jpg" and "(03).jpg" (CC BY-SA 4.0).
