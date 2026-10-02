# Casa Loma

Stable asset ID: `casa-loma`. Original procedural model of Sir Henry Pellatt's castle at 1 Austin Terrace, Toronto, **and** the Casa Loma Stables at 330 Walmer Road (with the water tower), for the Toronto Cityscape. Build with `pnpm build:toronto-landmarks casa-loma`; contract in [3d-toronto-landmarks.md](3d-toronto-landmarks.md).

## Identity and version

Casa Loma is the Gothic Revival "castle-style mansion" built 1911-14 for the financier Sir Henry Pellatt by the architect E. J. Lennox, the largest private residence ever built in Canada (98 rooms, 64,700 sq ft). It is a City of Toronto museum, unchanged in silhouette since 1914 (the exterior is under continual stone restoration; scaffolding seen in some photographs is not modelled). The model is the building a driver sees today from Austin Terrace, Spadina Road, Davenport Road and Walmer Road.

The 1905-06 stables (Lennox, brick with limestone dressings) stand about 175 m north-west across Austin Terrace, joined to the castle by a 243 m tunnel. They are a separate mapped building and read from Walmer Road, so they are in the same model.

## Sources

| Source | Used for |
| --- | --- |
| [Wikipedia](https://en.wikipedia.org/wiki/Casa_Loma), [official history](https://casaloma.ca/history/) | Lennox, 1911-14, 98 rooms / 64,700 sq ft, stables and hunting lodge on Walmer Road, tunnel |
| [TCLF](https://www.tclf.org/landscapes/casa-loma), [Toronto Journey 416](https://www.torontojourney416.com/casa-loma/) | 243 m tunnel, terraces, marble conservatory, tower and layout descriptions |
| [Phoenix Restoration](https://www.phoenixrestoration.ca/casa-loma/) | Sandstone walls with cast "Roman stone" dressings |
| [Flickr caption](https://www.flickr.com/photos/57156785@N02/48780842143) | Tallest tower "more than 130 ft / 40 m" from the ground |
| OSM [way 198471666](https://www.openstreetmap.org/way/198471666), [way 198471670](https://www.openstreetmap.org/way/198471670) | The two outlines (232 and 85 nodes), retrieved 2026-09-29 from the OSM map API (a shared Overpass queue was saturated; one bbox request, User-Agent `codriver-dev`) |
| Wikimedia Commons photographs (listed in the catalog record) | Proportions, roof forms, tower tops, materials. Viewed locally only; nothing copied |

## Frame and orientation

- Real metres, +X east, +Y up, +Z south around `origin` `[-79.4100918, 43.6787216]`, the centre of the joint bounding box of the two outlines (castle and stables are ~175 m apart; one origin keeps both inside a 150 m terrain pad, the farthest mapped point is 137 m away).
- **Both outlines are grid-aligned.** Their edges cluster at bearing 72/162 deg (length-weighted: 59.6 m at 72 deg, 41.8 m at 71 deg for the castle, 145.6 m at 73 deg for the stables), which is Toronto's lake-shore grid, not true north/east. The geometry is written in grid plan coordinates `(u, v)` (u along bearing 72 deg, Austin Terrace's direction) and rotated once by 18 deg about +Y (`casa-loma-site.js`, `ANGLE`). Austin Terrace runs along u, 60 m north-north-west of the castle, which is why the north courtyard front faces bearing 342 deg (`frontageBearing`).
- The footprints are the OSM rings verbatim; the model's base slab *is* the castle ring, extruded, so no provider extrusion can peek out.
- `y = 0` is the ground-floor terrace and north courtyard level.

## Dimensions

| Feature | Value | Basis |
| --- | --- | --- |
| Castle outline | 74.7 x 50.2 m in the grid frame, 2,249 m2 | Mapped (OSM) |
| Stables outline | 39 x 95 m, 1,288 m2 | Mapped (OSM) |
| Castle to stables | ~175 m (centre to centre) | Mapped; tunnel 243 m published |
| Round south-east tower | radius 5.8 m at (20.1, 15.2), engaged half-circle | Mapped arc |
| Round west tower | radius 4.8 m at (-30.4, 8.0) | Mapped arc |
| Conservatory apse | radius 4.0 m at (35.2, 1.45), hall 13 x 15 m | Mapped |
| Conical tower | round shaft (r 5.8 m) to 20.4 m, corbelled out to a square battlemented parapet (11 m across, corner pinnacles, to ~24.7 m), a tile skirt, a smaller round drum (r 3.9 m), tile cone tip 35.2 m, finial to 36.3 m | Estimated from photographs; published ">130 ft (40 m)" is measured from the escarpment-side ground, ~4 m below the terrace |
| West tower | shaft 21.4 m, drum and merlons to 25.4 m, open eight-post crown to 29.6 m, pinnacles to ~32 m | Estimated |
| Gatehouse tower | 6.7 x 6.6 m, wall to 23.4 m, merlons and pinnacles to ~27.4 m | Mapped plan, estimated height |
| Porte-cochere | 6.7 m wide, pointed arch 3.5 m wide x ~6.2 m high, projecting 5.2 m from the tower | Mapped plan, estimated arch |
| Base slab | outline extruded to 9.0 m (ground and first floor) | Estimated storey heights (~4.3-4.7 m) |
| Wing parapets | 13.0-13.6 m; main ridge ~19.4 m; NE and centre-east ridges 19.8 / 18.6 m | Estimated |
| Chimneys | 15 slim (1.15 m) cream stacks, tops 18.8-22.8 m, kept below the gatehouse top as in the photographs | Estimated positions |
| Water tower | 5.6 x 5.6 m brick shaft to 22.8 m, four limestone turrets, tallest ~33 m | Estimated |
| Stables eaves / ridges | 5.6-6.2 m / 8.9-11.1 m | Estimated |
| Top of model | 36.8 m (SPEC.height 36) | Estimated |

## Materials

Names are shared by both themes (`PALETTES.light` / `.dark` have the same keys): `stone` (Credit Valley sandstone, grey-tan), `rubble` (darker footing course), `trim` (cream limestone and cast stone: merlons, quoins, string courses, chimneys, the water tower), `roof` (terracotta tile, deep red-brown `#80372c`), `copper` (verdigris finials), `glass` (leaded windows), `glow` (self-lit: the tall north bay, the west crown's lancets, the conservatory dome, the gatehouse oriel and about a third of the first- and second-floor windows; in daylight it is a slightly lighter glass blue, at night warm lamp light), `lead` (flat roofs), `brick` (stables, `#84392d`; both retuned darker after review because the earlier `#a4553f` / `#a34e3b` rendered coral against the photographs). No texture.

## Modelling decisions

- Silhouette first. From the road you read: the grey mass with a cream battlemented skyline, three different tower tops (tile cone, open pinnacled crown, square crenellated gatehouse), red tile roofs broken by cross-gables, a cluster of tall cream chimneys, the blue-grey dome at the east end, and away to the north-west the brick stables with a limestone-crowned tower.
- **Towers are described by shape, not by name.** Public sources swap "Norman" and "Scottish" between the square gatehouse, the round conical tower and the round crown tower; the model does not depend on the naming. Commons "C L 03 - Torre principal" shows the tallest, tile-coned tower is *tiered*: a machicolated, battlemented parapet with corner pinnacles, a tile skirt, then a smaller round battlemented drum and the cone. The model draws that crown as a square parapet corbelled out of the mapped round shaft (the plan shows a round bulge and "C L 22" shows a curved shaft with a square corbelled head); whether the shaft is round or square above the first floor is not settled by the photographs available.
- The north courtyard front is modelled in detail (gatehouse with corbelled crown, porte-cochere arch, hood mould and turrets, canted cream bay, three-arch loggia). The mapped notches of the outline (bays, the portal's round corner turrets, the stepped south front, the crenellated bumps of the west range) are kept exactly, and the upper storeys are stone blocks standing inside the ring.
- Cream quoins run up every convex corner of the outline and two string courses circle the walls and the three round bulges. Merlons crown every block edge that is not buried against a taller part.
- Repeated elements are merged: windows are one cream frame plus one pane box per opening (~24 triangles), merlons are plain boxes; the whole near model is 9 draws (one per material).
- **Far LOD** (~1/3 of near): same footprint slab, blocks, roofs, towers with 12 sides instead of 32, the eight-post open crown with its pinnacles (so it stays see-through), chimneys, turrets and the dome; no windows, no individual merlons, no arch surrounds.
- The west tower's crown is the one open-air structure: eight cream posts, short coping beams between them, dark lancets set inside, a lead floor. A test looks straight down it to keep it open in both LODs and in the exported GLB.

## Site slope (Full 3D world)

Casa Loma stands at about 140 m above sea level on the brow of Davenport Hill, 66 m above Lake Ontario; its south terrace is roughly 20 m above Davenport Road, and the stables sit on the plateau to the north. **None of that is baked in.** The model is rigid: a 1.6 m rubble footing under `y = 0`, no terraces, no retaining walls, no ground. `padM: 150` asks Full 3D world to hold the terrain at one datum over a disc that covers both buildings (farthest mapped point 137 m); on the escarpment side that pad cuts into the hill face and blends back, and the south front will sit on a raised platform rather than the real slope. Refit behaviour, pad edges and entrance heights are checked in the running app, not here.

## Approximations and omissions

- Estimated: every height; roof pitches (the real roofs are more complicated); the number and position of windows, cross-gables and chimneys; the exact tops of the towers.
- The **conservatory** is the weakest inference: it is placed on the mapped east range with the semicircular apse (a marble-floored, stained-glass-domed hall, ground floor, per Wikipedia and TCLF), drawn as a ribbed glass dome on a low drum with a lead roof and a conical apse roof. Its true position relative to the outline is not sourced.
- Omitted: gardens and terraces (skipped by brief), the Austin Terrace and Walmer Road gate piers and low walls, the hunting lodge at 328 Walmer Road (its own mapped building, not replaced), the tunnel, the greenhouses (demolished), interiors, sculpture and carved detail, flags.
- Stone texture and the dark sandstone banding are not modelled; the darker footing and cream courses only suggest it.
- The stables are a simplified brick massing with the correct plan, turrets, stepped east gable and water tower; the tower's plan position inside the north range is estimated.

## Measured costs

| LOD | Triangles | Draws | Bytes |
| --- | --- | --- | --- |
| Near | 27,721 | 9 | 1,641,392 |
| Far | 7,082 | 8 | 428,156 |

Budgets: building near 60,000 / 14 / 2.5 MB, far 12,000 / 8 / 500 KB. Far folds only the 12-triangle porte-cochere opening into the blue-grey `lead` (`FOLD` in `config.js`); its weight came down by dropping hidden floors (the extruded footing, stone course and stables plinth no longer carry a floor cap, and the footing no longer carries a top cap under the stone course) and, in far, the string courses on the short facets that only approximate the curved bays. The lead roof slab is inset 15 cm and the lead plates and blocks sink 10 cm into the base so no two materials share a plane; stable windows are no longer placed on walls that stand against another wing (coplanar overlap 1,909 m2 to 4 m2). Software rendering in headless Chromium only; no Tesla hardware measurement.

## Verification evidence

Screenshots (`local-scratch/casa-loma/shots/` from the procedural source, `local-scratch/shots/casa-loma/` from the exported GLB; ignored by git) were rendered with `shot.mjs` (red = mapped outlines, grid 10 m) and read against the Commons photographs:

- Procedural near, light: overview, facade (north front), roof, structure (south front), stables, gatehouse, crown, scottish, courtyard (eye height, against Commons "2020-09-08 Casa Loma 002" and "006"), road-north (against "... 161"), south-far (against the panoramio view from the south).
- Exported GLB near, light: facade, stables, roof, gatehouse, street-north. Exported GLB far, dark palette: overview, structure. Exported GLB far at ~400 m: far-800m. Near dark (palette recoloured, `glow` emissive): facade.

What the screenshots changed: the first pass showed z-fighting where a brick plinth overlapped the brick base (the plinth now stops at 0.9 m and the brick starts there); the conical tower's cone was too squat against the panorama and the merlon ring poked through its eave (upper drum lowered, cone base lifted, tip now 35.2 m); on review the roof and brick rendered coral (palettes darkened), the gatehouse read short next to heavy 8.5 m chimneys (gatehouse raised 1.4 m, stacks slimmed to 1.15 m and cut to 18.8-22.8 m), and the conical tower's round crown disagreed with "C L 03" (replaced by the square-on-round tiered crown); a giant solid stepped gable read as a cream wall (gables now carry only the stepped coping in cream, over a stone wall); the west tower crown was capped by a solid disc (now open, with a test); the stables' blocks overhung the mapped ring by 6.7 m at the notched north end and the NE wing bay by 2.4 m (blocks re-cut to the ring; all vertices are now within 2.5 m of a mapped ring, and only cornices, the tile-cone eaves and the porte-cochere crest overhang). The plan-derived layout was checked against the photographs (bay to the right and loggia to the left of the gatehouse from the north; cone at the east end and the crown tower at the west end from the south, as in the 1922 photograph).

`node --test src/peregrine/landmarks/toronto/casa-loma/casa-loma.test.js` pins: the two mapped outline sizes and the grid angle; silhouette heights (finial 35.5-37.5 m; crown 30.5-33.5; gatehouse 25-28; water tower 30.5-34.5; ordering cone > crown > gatehouse); a ray through the porte-cochere hitting the dark opening (and the wall beside it hitting stone); the open crown floor in near, far and the exported GLBs; the copper finial and tile cone; the glowing dome; containment within the two rings; brick only in the stables; far LOD bounds within 2% and < 40% of the triangles; palette keys; exported GLB round trip.

| Environment | Status |
| --- | --- |
| Cityscape, flat ground | Not tested yet; integration is checked separately |
| Full 3D world, topography | Not tested yet; integration is checked separately (see "Site slope") |
| Inspector: procedural and exported GLB, near and far, light and dark | Verified (headless Chromium, software GL) |
