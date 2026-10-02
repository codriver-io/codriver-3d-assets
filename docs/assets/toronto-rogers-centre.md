# Rogers Centre (Toronto)

Landmark id `rogers-centre`. Original procedural model of the Rogers Centre (SkyDome until 2005), 1 Blue Jays Way, with the **retractable roof closed**. It follows the [Toronto landmark contract](3d-toronto-landmarks.md) and the [asset catalog](3d-assets.md). Source: `src/peregrine/landmarks/toronto/rogers-centre/`. Build: `pnpm build:toronto-landmarks rogers-centre`.

## What is modelled, and which version

The stadium as it stands after the 2022-24 interior renovation, seen from outside. The roof is drawn **closed**: it is the state most drivers see from the road and the only one that reads as a single silhouette at 800 m. No open or part-open state is drawn. The interior, the field and the seating are not modelled; a closed roof hides them.

A driver sees, and the model has:

- four white roof panels nested so each one further north stands proud of its southern neighbour (fixed north cap, two sliding arches, rotating south cap), their south-facing steps, the longitudinal ribs on the arches and the meridian ribs on the caps;
- the two rail girders and the mid-grey steel wings where the arches land on the east and west walls, with the arch ribs and the joint between the two arches carried across them;
- the 32 m grey concrete ring on the mapped envelope, with pilasters, floor ledges, window strips, louvre panels and lit gate lobbies;
- the low glass canopy that rings the south gates;
- the leaning prows at the south ends of the long walls, each with its blue Blue Jays panel carrying a simplified team mark (white jay's head with a dark beak and eye, red maple leaf), a glazing band and two cantilevered ledges carrying the bronze crowd (Michael Snow's *The Audience*, as simplified leaning spectators: tapered torso, head, cap brim, one arm raised);
- the hotel's stepped glass terraces on the north end (53, 41, 41, 38, 38 m);
- red ROGERS CENTRE lettering, drawn letter by letter as unshaded `sign` geometry on the lake face (two signs) and the west and east walls;
- blue rim lights round the roof edge (`light`).

## Sources

| Fact | Value | Source |
| --- | --- | --- |
| Greatest roof height | 86 m | published (above the field), and the OSM `height` tag on way 7969701 |
| Roof span | 205 m (674 ft) | published |
| Roof panels | four; three move (two slide, one rotates on a circular track), one fixed at the north end | [Wikipedia](https://en.wikipedia.org/wiki/Rogers_Centre), [Globe and Mail](https://www.theglobeandmail.com/sports/retractable-roof-at-rogers-centre-skydome-blue-jays-toronto-mlb-shapiro/article30190945/), [SABR](https://sabr.org/bioproj/park/skydome/) |
| Closed roof shape | fixed quarter-spherical panel at one end, moving quarter-spherical panel at the other, two arching panels between | [US 4,995,203](https://patents.google.com/patent/US4995203) |
| Nesting order | the sliding panels tuck under the fixed one; the rotating one goes under all | Globe and Mail |
| Roof steel | 11,000 t | Globe and Mail, SABR |
| Plan | the whole envelope, 76 vertices | OSM way 7969701 (retrieved 2026-09-29, ODbL 1.0) |
| Ring and terrace heights | 32 m concrete ring, hotel glass parts 53, 41, 41, 38, 38 m, entrance cores 20 m | OSM `building:part` ways (listed in `footprint.js`) |
| Roof outline | circle of radius 97.7-98.5 m (fitted) plus rail wings out to about 104-108 m | OSM way 1104122006 |
| Wall orientation | 16.1 degrees off true north (fitted to the mapped east and west walls) | OSM |
| Hotel at the north (centre-field) end | glass terraces outside the roof circle | OSM parts, photographs |

## Dimensions: sourced against estimated

| Dimension | Model | Status |
| --- | --- | --- |
| Crown height | 86.4 m (86 m surface function, plus rib height) | sourced (published and OSM), see the datum note |
| Roof span, rail to rail | about 209 m over the wings; 198 m roof circle | sourced 205 m; circle radius fitted to OSM |
| Roof length along the rails | about 200 m | mapped |
| Concrete ring height | 32 m | mapped (OSM parts) |
| Roof springing line | 33 m south, east, west; 53 m over the hotel | 33 m estimated; 53 m from the OSM hotel part |
| Roof profile | shallow dome, `k = 0.15` between a parabola and a sphere | estimated (two distant photographs) |
| Panel joints | at 52 m north, at the middle, and 52 m south of the roof centre | estimated (the rails are mapped as about 104 m long) |
| Lap between panels | 4.5 m | estimated (photographs) |
| Facade bay | 10.5 m, five bands of about 6.5 m | estimated |
| Sign | 3.8 m letters, about 34 m long | estimated |
| Origin | [-79.38916, 43.64153]: centre of the fitted roof circle and of the mapped east and west walls | mapped |

**Datum.** `y = 0` is the street and concourse level. The published 86 m is above the playing field, which sits below the street, so height over grade could be a few metres less. Two distant photographs (Toronto Islands, about 2.5 km away, near-orthographic; the CN Tower is the scale bar) put the crown about 55 m above the top of the concrete wall, which with a 32 m ring is 87 m; the model therefore uses 86 m over grade. A close-up photograph gave a lower figure because of perspective and was not used.

## Materials

`concrete`, `concrete_dark` (recesses, ring top, terrace roofs), `louvre`, `glass`, `glass_hotel`, `glow` (lit gate lobbies and some lower windows: dark by day, warm at night), `roof` (white membrane), `roof_seam` (steps, skirts, ribs, wings), `steel` (rails, canopy edge, the dark gap under each step), `sign` (red lettering, unshaded), `bronze`, `jays` (blue panel) and `light` (rim lights, unshaded). Light and dark palettes carry the same keys.

## Modelling decisions

- **Site frame.** Authored in stadium axes (u across, v along toward the lake), rotated 16.1 degrees into east/up/south by `site()` in `rogers-centre-site.js`. All polygons were read from OSM with the facade's own mercator maths, so the model sits in the footprint the screenshot harness draws.
- **Roof as a height field.** `rogers-centre-roof.js` holds one function, `roofHeight(u, v, panel)`, used by the mesh and by the tests. The dome is a shallow profile normalised to the roof circle, with the springing line lifted over the hotel; each panel adds its lap, fading to zero at the edge so all four land on the same line. Steps are single-sided quads facing south, as the real nesting is visible only from the lake side.
- **South wall.** The mapped south arc (radius 104 m) is taken as the outer edge of the glass canopy, and the concrete face stands 4.4 m inside it, where the roof edge lands.
- **Prows.** The top of the ring leans back 9 m at the chamfered corners; the panels and ledges are placed in the slanted plane.
- **Hotel.** The OSM glass parts are extruded from the ring top to their mapped heights and stepped as mapped. Only their outer faces get floor bands and mullions.
- **Far LOD.** Same silhouette, steps and hotel terraces; no ribs, no facade panels or windows, coarser dome, fewer rim lights, no ledge sculptures. About a third of the near triangle count.

## Costs

| | Triangles | Draw calls | Bytes |
| --- | --- | --- | --- |
| Near | 40,618 | 13 | 1,750,988 |
| Far | 9,106 | 8 | 441,552 |

Budgets: building near 60,000 / 14 / 2.5 MB, far 12,000 / 8 / 500 KB. Far is lighter than before because the 3,520 triangles of ROGERS CENTRE strokes (a few pixels at far range) became four red bars per sign (192 triangles in all), and two small materials were folded into the hotel glass (`FOLD` in `config.js`: the 4-triangle `jays` banner and the prow `glass` bands). Window mullions, transoms and posts now overlap the glazing by 6 cm so they share no plane with it (coplanar overlap 111 m2 to 0). Measured from the exported GLBs; these are model primitives, not Tesla hardware timings.

## Approximations and open problems

- The panel joints, laps, profile and rib layout are reconstructed, not surveyed. The real roof has fixed quarter-spherical caps at both ends; the model's caps are circle segments of a single shallow dome.
- The wings where the arches land are simplified to a low steel deck, its ribs and a girder.
- The Audience figures are simplified forms (about 150 triangles each), not portraits; the Blue Jays mark is a hand-drawn polygon simplification, not the trademark artwork.
- The apex entrance block is drawn 20 m high with the gate facade of the ring; the red "ROGERS" canopy over the main gate is not modelled.
- Facade relief (ledges, pilasters, letters) stands up to 0.9 m outside the mapped outline; the far LOD's coarser wings and skirts stay within 1.5 m.
- The rim lights are estimated from night photographs.
- Full 3D world (terrain) and Cityscape integration: not tested yet, integration is checked separately. Only the inspector-style renders below were made.

## Verification

Renders came from `local-scratch/shots/rogers-centre/` (ignored by git) through a copy of the contract's screenshot harness that dresses the model with the runtime's unlit vertex-shaded materials (`building-layer.js`), so the images show what the layer draws, not a lit-scene flattery. Each was compared with a Commons photograph listed in the catalog record.

- Overview, lake end (gate level from the harbour), west wall, east wall, hotel end, roof from above, prow close-up and gate close-up, near LOD, light theme, procedural source. Compared with the harbour photographs (roof arch band and the lens-shaped south cap under it, the two lake-face signs, the wall-to-roof proportion) and the CN Tower aerials (roof set on the ring, hotel end). Changes made because of them: the crown and roof rise were re-measured from two distant photographs; the panel laps were raised from 3 to 4.5 m so the arch band reads as thick as in the photographs; the south wall was moved 4.4 m inside the canopy edge so the roof lands on the wall as it does in the harbour photos; a Z-fighting strip along each step was pushed 7 cm proud. After review the flat white wing decks became mid-grey steel with ribs and a joint line, and the prow crowd and team mark were redrawn as simplified forms.
- Profile check against `harbour-2012b.jpg`: the photo's roof silhouette (left half, crown to foot) was traced and normalised by half-span and rise. At normalised distances 0.19, 0.34, 0.49, 0.63, 0.78 and 0.92 from the crown the photo's height fractions are 0.97, 0.89, 0.77, 0.62, 0.42 and 0.18; the model's profile (`k = 0.15`) gives 0.96, 0.88, 0.76, 0.60, 0.40 and 0.15. Rise over span is 0.22 in the photo against 0.24 for the model, so the dome is not flatter than the photo and its profile was left unchanged.
- Dark theme, near (street view): lit gate lobbies, red signs, and a legible roof.
- Dark theme, far LOD (overview, facade, hotel end): silhouette, steps and terraces hold.
- Exported GLBs, near (overview, street) and far dark (overview, hotel end): match the procedural source.
- Tests: `node --test src/peregrine/landmarks/toronto/rogers-centre/` (crown height, roof span and length, ring height, panel steps by raycast, roof watertight by raycast, hotel terrace heights, signs by raycast, prow lean and figures, containment inside the outline, far/near bounds) and the shared conformance test.

Original work: no scan, no traced mesh, no photograph or texture is in the repository or the GLB. OSM data © OpenStreetMap contributors (ODbL 1.0).
