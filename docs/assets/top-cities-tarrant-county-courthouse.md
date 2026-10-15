# Tarrant County Courthouse — Fort Worth, Texas

Original procedural model of the 1893–95 Tarrant County Courthouse (Gunn & Curtiss, built by Probst Construction of Chicago), the pink Texas granite Renaissance Revival building on the bluff at the north end of Main Street, bounded by Houston, Belknap, Weatherford and Commerce Streets. It closely resembles the Texas State Capitol except for its clock tower. This is the present exterior; the 1958 Civil Courts building, grounds monuments and interior are not modelled. Authoring date: 15 October 2026.

## Sources and dimensions

The lead's dossier (`tmp/top-cities/tarrant-county-courthouse/{osm.txt,osm.json,facts.txt,refs-sheet.jpg}`) was the starting point; its five photographs were read before authoring (north elevation, 1910s south-front postcard, two night views from the Paddock Viaduct and North Houston Street, the NRHP plaque). No further photos or Overpass queries were needed. The Texas State Capitol model was studied as the quality reference (kit/body/dome split, lofted profiles); no geometry was copied.

- [Wikipedia](https://en.wikipedia.org/wiki/Tarrant_County_Courthouse): architects, 1893–95 construction, pink Texas granite, resemblance to the Capitol, 2012 clock-tower renovation, caption "north elevation" for the main reference photograph.
- [OSM way 178593785](https://www.openstreetmap.org/way/178593785): the mapped cross-shaped outline, 42 nodes.

| Feature | Model value | Basis |
| --- | --- | --- |
| Plan | cross, about 76.4 m along the long axis (bearing 60°) by 51.3 m through the porticos | mapped outline |
| Raised basement / main floor | 4.3 m | estimate, from the postcard's entrance stair |
| Wing cornice, hipped roof top | 20.5 m, 24.2 m | estimate (photo ratios) |
| Central block parapet, pediment apex | 27 m, 31 m | estimate |
| Clock tower stages | shaft 27–38 m, balcony 38.4 m, belfry 39–45.4 m, clock stage 46–51 m, dome 51.5–56.8 m | estimate, photographic proportions within ~8 % |
| Overall height | 59 m to finial | estimate (the stub's approximate value, kept) |
| East-wing copper dome | drum 24 m, shell to 31.4 m, lantern and finial to 36 m, 10.4 m across | estimate; east wing only, from the north-elevation and Paddock Viaduct photographs |
| Porticos | four 0.62 m-radius pink columns 4.3–12.8 m, balcony slab, four upper columns, three arched loggia windows | postcard; north porch is deeper (3.25 m vs 2.0 m) as mapped |
| Chimney stacks | two, 2.4 m square, to 34.9 m, flanking the tower | photographs |

## Frame and provider replacement

Metres, +X east, +Y up, +Z south. Origin `[-97.33319122, 32.75748642]` is the centre of the mapped outline's rotated bounding box. Local y = 0 is the ground at the entrance steps; no altitude, DEM or latitude stretch is baked in. The mapped long axis runs at bearing 60° (control points: the 17 m wing/link edges at bearing 60/150 in the dossier); the geometry is authored in the building's own frame (X along the long axis, Z toward the south front at bearing 150°) and rotated once by 30° about Y (`ROT` in `tarrant-county-courthouse-plan.js`). `footprint.js` lists the one owned way, 178593785. The neighbouring mapped buildings (100 and 112 Main Street, the Civil Courts building, the Family Law Center, Wells Fargo Tower) stay provider. The test checks that every model vertex above the stairs lies within 1.3 m of the real mapped ring. Only the two entrance stair flights run beyond it (up to about 8 m, below 4.3 m high), because the real stairs are far longer than the mapped porch.

The spec declares a bounded median terrain pad (60 m, 10 m feather); the bluff's ground residuals, pad coverage and the stair approaches need the lead's Full 3D world review.

## Structure and materials

Eight merged materials: pink granite `stone`, lighter `trim` (cornices, courses, sills), pinker `column`, slate `roof`, green `copper` (east dome), brown `dome` (tower roof, clock hands), window `glass`, and self-lit `glow` (the four clock faces). At night granite dims, windows go dark and the clock faces glow.

- **Wings and central block.** Granite masses with a raised basement, string courses at 4.3 / 9.75 / 14.8 m, window rows (arched main floor), an eaves cornice, hipped slate roofs and pavilion pediments on each wing; the taller central block (27 m) has a low hip, gabled north and south projections with pediments, and two chimney stacks. Windows are paired glazing quads with a granite mullion, sill and lintel; far merges each pair.
- **Porticos.** North and south: stair flight, raised porch, four free pink columns (bays are open to the recessed loggia wall), entablature and balustraded balcony, four coupled upper columns carrying a cornice, three tall arched windows on the loggia wall.
- **End projections.** Basement porch with a balcony, two columns and an entablature on each wing end.
- **Pavilions and pediments (review fix g4a).** Every pediment carries tympanum relief: an inner raking moulding, a stepped oculus (trim ring, then glass) and, near, a row of modillions under the cornice. Near also gets rusticated joints (thin flat trim quads between the window rows, 12 cm proud) and quoin strips at every wall end, a crest and four hip lines on each wing roof, and sixteen dormers (stone box, arched glass, small hipped cap) under the wing eaves, so the slate roofs and pediments are no longer blank planes.
- **Clock tower (reshaped, g4a).** Arched-window shaft, balustraded balcony, belfry with an arch on each face and corner piers, then an octagonal clock stage (chamfered corners) with a lit dial per flat under a small pediment (hands at ten past ten), an octagonal cornice and drum, a tall faceted eight-sided ogee dome, a lantern with arched openings, a small cap and the finial. The old stack of square stages under a squat hemisphere is gone; the 59 m top is unchanged.
- **East dome (taller, g4a).** Drum with a ring of windows, a lathe-turned copper dome 8.3 m high on a 5.3 m radius (was 5.7 m) with twelve raised ribs near, a taller lantern with four arched openings, small copper cap and finial to 39 m. The central cupola stays brown, as in the daytime photograph.

## Approximations

Storey heights, tower stages, window spacing, the chimneys and the east dome's exact position are photographic estimates. Only one copper dome is modelled (east wing); photographs show it from the north and south-west, and the west wing's roof could not be confirmed, so it stays a plain hip. Carved pediment sculpture, window tracery and the real balusters are abbreviated (relief is trim bars and quads, not sculpture). The pink granite colour is calibrated to the daytime photographs; the green floodlighting seen in the night photographs is an event treatment and is not modelled.

## Exports and verification

`pnpm build:top-cities-landmarks tarrant-county-courthouse --no-check`.

| LOD | Triangles | Draws | GLB KB |
| --- | ---: | ---: | ---: |
| near | 18,186 | 8 | 893 |
| far | 4,464 | 8 | 216 |

Evidence: the procedural contact sheet (overview, facade, back, roof, street, tower), `--top` over the red outline (the model covers the ring completely, with no overhang past it except the stairs), then the exported GLB near/light sheets (facade, street, roof, tower, dome, back) and far/dark sheets (overview, facade, back, roof) under `tmp/top-cities/shots/tarrant-county-courthouse/`, compared with the north-elevation photograph and the postcard. Changes made because of the looks: the first chimney stacks reached the belfry and were shortened to 7.9 m above the roof; clock hands were added to the blank clock disc; the north porch and pediment were re-seated on the real, shallower north projection wall. `tarrant-county-courthouse.test.js` pins: 59 m height and grounding in both LODs, far envelope, containment in the mapped outline, the four lit clock faces, belfry arches and finial contact with the dome, open column bays with the balcony resting on the capitals (plus a negative control outside the portico), the east-only copper dome, and the roof levels and chimneys standing on the roof. `landmark-depth-layers.mjs` reports zero dropped cycle edges. Review fix g4a (2026-10-15): the reviewer read stacked square boxes under a squat hemisphere, blank pavilion roofs and pediments, and a low east dome; rebuilt as above and re-looked at `tmp/next-200/fix/g4a/tarrant-county-courthouse/{look1,glb-near,glb-far}`; the tower and dome tests now measure the octagonal dial face at 3.8 m, the lantern on the dome crown and the taller east shell. Cityscape and Full 3D world: recaptured by the lead after this fix.
