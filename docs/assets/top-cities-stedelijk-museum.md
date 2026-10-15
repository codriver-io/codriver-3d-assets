# Stedelijk Museum

Weissman's 1895 brick museum and the 2012 bathtub, side by side on Museumplein. Cityscape and Full 3D world are not tested yet; integration is checked separately. The site is flat, so there is no terrain pad (`padM` 95 m covers the outline).

## Sources

The dossier contact sheet mixes Kazimir Malevich, Theo van Doesburg, and the former Stedelijk Museum CS (Post CS, way outside this outline). Those were not used. Massing comes from OSM way 44508819 and the `building:part` ways in `footprint.js`, plus four exterior photographs: Mark Ahsmann, the letter wall (CC BY-SA 3.0); John Lewis Marshall, the new wing at night (CC BY-SA 4.0); Sergé Technau / Rijksdienst voor het Cultureel Erfgoed, the Paulus Potterstraat gable (CC BY-SA 4.0); Aarnout2007, the wing in 2012 before the screen was installed (CC BY-SA 3.0). The glass box and Albert Heijn in that last photograph are neighbours and are not in the model. An interior escalator photograph (Emily Schuit) was not used for the mass.

Published facts: A. W. Weissman, 1895, red brick with white stone bands; Benthem Crouwel Architects, opened 23 September 2012; the white extension cantilevers about 40 m at the old cornice and narrows toward a glazed lobby. The extension is partly underground; nothing below grade is modelled.

## Dimensions

| Measure | Model | Source | Status |
| --- | --- | --- | --- |
| Origin | 4.8798417, 52.3579018 | Centroid of way 44508819 | mapped |
| Frontage | 156.4° | Outward normal of the south wall, the Museumplein side | mapped |
| Historic block | 95.6 m × 33.9 m, eaves 14 m | Way 754299893, long edge bearing 66.4° | mapped |
| Corner turrets | 24 m | Ways 754299894–897, `roof:height` 10 | tagged |
| North spire | 28 m | Way 754299889, `roof:height` 14, the risalit | tagged; modelled as a gable and open lantern, not a solid pyramid |
| Slate ridge | 20.6 m | none tagged; under the 24 m turrets | estimated from the Paulus Potterstraat photograph |
| Canopy | 41.0 m from the south wall, deck at 13.62 m | published "about 40 m"; way 754299892 is the roof ring | measured on the ring |
| Lobby hem | 3.9 m mid-edge, 5.5 m at the corners | the curve is not published | estimated |
| Letter screen | 17 m, about 15.5 m wide | way 754299890 is tagged `height` 17 on the glass part | the tag is read as the screen, not a 17 m curtain |

## Materials

`brick` #9a4636 by day and #54281f at night, `stone` #efe4d2, `slate` #3e4854, `white` #f6f3ec (the tub stays light at night, #e9e4da), `glass` #546068 by day and #93a3ad at night, `light` #3a4248 by day and #ffd2a4 at night (unshaded, the lobby), `mesh` #2a2e32 for the perforated screen, `sign` #f4f4f2 (unshaded letters). The palette still names `soffit`, and the mesh does not emit it: the cheek and the roof are one `white` material on both LODs, so near and far are 8 draws.

## Modelling

The mesh is in metres, +X east, +Y up, +Z south, origin at the outline centroid, rotation baked in. Grade is y = 0. The 1895 block is the brick prism to 14 m with a slate hip, stone bands, and a window bay about every 4.8 m on the north, east and west. The south wall is left blank because the bathtub stands in front of it. Four turrets rise on their OSM footprints to 24 m: a steep slate roof with an eave flare, an open stone lantern, and a slate spike whose top is exactly 24 m. The north risalit carries a crow-stepped gable, a clock, a stone tablet and an open lantern; the needle tip is exactly 28 m.

The bathtub is one closed white volume. Its roof is the OSM ring, pulled 0.7 m into the brick so the joint is buried, and notched for the letter screen. The cheek shares that roof edge and stays on the outer plan for most of the drop, so the street sees a deep white wall rather than a thin fascia. Only the last metre tucks back to the glass. The hem sits near 3.9 m and rises about 0.35 m at the corners. The east screen is a 17 m mesh wall with block letters reading STEDELIJK / MUSEUM / AMSTERDAM, the K and the last M kicked out the way the Thonik cloud is.

## Approximations

The ridge, the hem curve, the gable steps and the letter positions are judged from the photographs. The composite skin is seamless in the building and is seamless here; there is no panel grid. The clock is a ring and two hands, not a carved dial. The lantern is four posts and a needle, not the iron weather vane in full. Quoins are the stone bands. The glass part's 17 m tag is the screen; the lobby glass follows the hem, about 4–6 m. Neighbours (Van Gogh Museum, the Conservatorium, the Albert Heijn block) stay with the map provider.

## Cost

| LOD | Triangles | Draws | GLB |
| --- | --- | --- | --- |
| near | 11,898 | 8 | 549,752 bytes (537 KB) |
| far | 5,276 | 8 | 267,624 bytes (261 KB) |

Budgets are 60,000 / 14 / 2.5 MB near and 12,000 / 8 / 500 KB far.

## Verification

Judged the exported GLB sheets `tmp/top-cities/shots/stedelijk-museum/stedelijk-museum-glb-near-light-sheet.jpg`, `stedelijk-museum-glb-near-dark-sheet.jpg`, `stedelijk-museum-glb-far-light-sheet.jpg` and `stedelijk-museum-glb-far-dark-sheet.jpg` against refs 4, 5, 7 and 8. The letter wall closes the east tip and the words read left to right. The north face is a trapgevel with the slate roof on either side. A south ray at 1.6 m hits the lobby glass and a ray at 8 m hits the white cheek, which overhangs the glass; a ray at 18 m does not. `qa-metrics` reported no issues. `stedelijk-museum.test.js` passed (5), and the three `top-cities.test.js` cases for this id passed. The combined run also failed two `san-fernando-cathedral` cases (catalog status versus `ready`, and a missing manifest); that landmark is another builder's and was left alone. `node scripts/asset-catalog.mjs` passed (406 entries). `node scripts/landmark-depth-layers.mjs --ids stedelijk-museum --check` passed with 0 cycle edges dropped. The white volume and the brick block with its towers were active in both modes and meet the ground. A neighbouring map block hides the glazed hem in the street frame. No route, HD pavement or car pass was run. World used the AWS Terrarium tiles.
