# Bryggen, Bergen

The front row of Hanseatic wooden tenements on the east side of Vågen, the view from the quay and the harbour. UNESCO World Heritage since 1979. Also called Tyskebryggen. This model is that front row only: sixteen gabled houses in one unbroken line, painted and of uneven height.

## Sources

OSM ways, north-west to south-east: 488690084, 331274578, 331274560, 331274567, 292320260, 292320261, 331274562, 331274574, 331274575, 331274541, 331274582, 488690088, 488690087, 292320275, 292320266. One more gable, between 292320261 and 331274562, has no waterfront polygon; it is an authored closure so the quay reads as one line. `height` is the ridge and `roof:height` is the roof above the eave. Wall colours follow the quay panoramas (oxblood, white, ochre, one pink) rather than the beige and orange tags. Wikipedia and the UNESCO list (site 59) identify the wharf; stiftelsenbryggen.no is the foundation site named in the Wikipedia infobox. Comparison photos are Commons files listed in the catalog (Delso, TimOve, Mueller, Balou46, Stch2022). None of them are shipped.

## Dimensions

| Way | Paint | Ridge | Roof above eave | Notes |
| --- | --- | ---: | ---: | --- |
| 488690084 | brown | 16 m | 6 m | Grey-brown roof; sheared outline, about 6° |
| 331274578 | ochre | 16 m | 6 m | |
| 331274560 | red | 13 m | 3 m | Shallow roof |
| 331274567 | brown | 16 m | 7 m | Steepest roof |
| 292320260 | white | 14 m | 5 m | |
| 292320261 | white | 14 m | 5 m | |
| (none) | ochre | 14 m | 5 m | Estimated closure of the unmapped quay gap |
| 331274562 | red | 15 m | 5 m | Estimated: no height or colour tag |
| 331274574 | pink | 13 m | 5 m | About 11 m deep; the one pink gable |
| 331274575 | red | 13 m | 4 m | Estimated ridge; quay mass only, about 7 m deep |
| 331274541 | brown | 12 m | 4 m | Grey-brown roof; about 11 m deep |
| 331274582 | ochre | 14 m | 5 m | |
| 488690088 | white | 13 m | 4 m | |
| 488690087 | white | 13 m | 4 m | |
| 292320275 | red | 13 m | 4 m | |
| 292320266 | red | 14 m | 5 m | Grey-brown roof |

The row is about 130 m along the quay. Origin stays the mercator centroid of the original fourteen rings, `[5.323184, 60.397329]`; the two added gables sit inside that span. Gables face the harbour at bearing 219.1°. The tallest point is the 16 m ridge plus a cap, declared height 16.25 m.

## Materials

Day paint is slightly strong so ACES at exposure 1.2 does not wash it out: oxblood `red`, `ochre`, `white`, dark `brown`, one `pink`, dark red-brown tile (`roof`, `#7a3b2a`), grey-brown tile (`roofDark` on 488690084, 331274541 and 292320266), pale trim, dark timber, glass, and warm `glow` for shop doors and a scatter of upper windows. Night uses the same names, dimmer, with glow left bright. Far merges pink into red, roofDark into roof, and timber into brown, which keeps the draw count at 8.

## Modelling

Each house is a separate gabled box on its own outline, in a quay frame (along the wharf, inland, up). The ground floor is set 0.82 m back so the upper floors jetty over the shops. Eaves cross the mapped front by about 0.24 m; that overhang is above grade and is called out here rather than pulled inside the ring. Side walls run the full height so the recess is a pocket. White bargeboards follow the rakes. Near LOD adds weatherboards, window mullions, shop piers and brackets. The quay frontage is continuous: the gap south of 292320261 is the estimated ochre gable, and the gap between 331274574 and 331274541 is way 331274575. A few shorter houses carry a chimney that stays under the 16 m ridge.

The south continuation of the wharf and the tenements behind this row are not modelled. 331274574 and 331274541 really are shallow in OSM, and 331274575 is only its quay block (the outline steps inland), so the roof plan is shorter there. The gable line itself does not break.

## Cost

Near: 22,218 triangles, 11 draws, 1,703 KB (1,744,308 bytes). Far: 6,092 triangles, 8 draws, 472 KB (483,564 bytes). Far keeps the quay windows, the shopfronts and a simpler inland window grid, and drops side-lane windows. Bounds match between the two.

## Verification

Looked at `tmp/top-cities/review/bryggen/bryggen.jpg` after the review fix (quay, gables, roof plan, near and far). The row is one line, roofs are dark red-brown with three grey-brown houses, and the walls are oxblood, white, ochre and one pink, with the shop floor still recessed. Cityscape and Full 3D world: not tested yet, integration is checked separately. The quay does not need a terrain pad.

## Placement

`padM` 90. No `terrainPad`. Footprints are the fifteen mapped front buildings plus the one authored closure the mesh replaces.
