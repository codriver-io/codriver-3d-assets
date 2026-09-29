# Humber Bay Arch Bridge

Asset `humber-bay-arch-bridge`, the Martin Goodman Trail's foot and cycle bridge over the mouth of the Humber River, Toronto (1994). Original procedural model, free-standing (`footprintless`, `kind: 'bridge'`): it carries no road, so the Toronto layer draws it like a building and never touches roads. Contract: [3d-toronto-landmarks.md](3d-toronto-landmarks.md). Source: `src/peregrine/landmarks/toronto/humber-bay-arch-bridge/`. Rebuild: `pnpm build:toronto-landmarks humber-bay-arch-bridge`.

## Identity and version

The bridge as it stands today (2026): two white steel-pipe arch ribs that lean in towards each other, a slender deck hung from stainless rods, board-formed concrete abutments with a pair of square pylons at each end. It is not a road bridge and not a predecessor of anything; there is one Humber Bay Arch Bridge. A Torontonian recognises it from the twin, rising white arcs against the water; from the deck, by the "Thunderbird" steel between the ribs.

## Sources

- [Wikipedia](https://en.wikipedia.org/wiki/Humber_Bay_Arch_Bridge): 139 m overall, 100 m clear span, two 1 200 mm steel pipes bent into twin arches rising 21.3 m above grade, 44 stainless hangers of 50 mm, designed 1994 by Montgomery Sisam Architects with Delcan, built by Sonterlan.
- [Montgomery Sisam project page](https://www.montgomerysisam.com/project/humber-bicycle-and-pedestrian-bridge/): two parabolically curved steel ribs; post-tensioned concrete deck on steel beams suspended by stainless rods; oversized concrete abutments; the steel between the ribs is patterned as an abstract Thunderbird.
- [blogTO](https://www.blogto.com/city/2019/08/humber-bay-arch-bridge-toronto/): double-ribbed steel pipe arches, 44 hangers, triangular patterns.
- [OSM way 691705308](https://www.openstreetmap.org/way/691705308) (`man_made=bridge`, `bridge:structure=arch`): the mapped outline, about 102 m long, 6.7 m wide at mid-span and flaring to 12.4 m at the springings. Its mid-point is the model origin `[-79.471266, 43.63187]` and its principal axis is bearing 31.6 deg (north-north-east). [OSM way 33398082](https://www.openstreetmap.org/way/33398082) is the trail line on the bridge (about 131 m), drawn by the provider itself. Fetched 2026-09-29 through the shared queue; ODbL.
- Photographs (Wikimedia Commons; downloaded to ignored `local-scratch/humber-bay-arch-bridge/refs/` only, to compare; none is in the repository or the GLB): Chicken4War, *Humber Bay Arch Bridge, Toronto 2026*, *...from slightly up north, Toronto 2026*, *Palace Pier and Humber Bay Arch Bridge, Toronto 2026*, *On the Humber Bay Arch Bridge, Toronto 2026* (CC BY-SA 4.0); Paul dexxus, *Humber Bay Arch Bridge.jpg* (CC BY 2.0); Taxiarchos228, *Toronto - ON - Humber Bay Arch Bridge1/2.jpg* (Free Art License); Johnathan Nightingale, *Humber river arch detail.jpg* (CC BY-SA 2.0); Michael Gil, *Humber Bay Arch Bridge in 2011 -a.jpg* (CC BY 2.0).

## Dimensions

Frame: local metres, +X east, +Y up, +Z south; `y = 0` is the flat-map datum (water level). The bridge is authored along its own axis (u along the deck, v across it) and rotated once onto bearing 31.6 deg.

| Quantity | Value | Basis |
| --- | --- | --- |
| Overall length, pylon to pylon | 139 m | sourced (Wikipedia) |
| Clear span between abutment faces | 100 m | sourced |
| Rib pipes | 2, 1.2 m diameter, parabolic in elevation | sourced |
| Rise of the pipe top above the paving | 21.3 m | sourced ("above grade", read as the trail grade at the abutments) |
| Hangers | 44 (22 a rib), 50 mm | sourced; even 4.06 m spacing over the middle 85 m is estimated |
| Deck surface above the flat datum | 4.5 m | estimated from photographs; so the top of the model is 25.8 m |
| Rib lean | centre lines 11.0 m apart at the springings, 3.3 m at the crown, in tilted planes | estimated; the OSM outline (half width 6.2 m at the springings, 3.4 m mid-span) fixes the springing stance |
| Deck | 5.4 m between rails, slab 0.3 m, dark edge beams 0.62 m deep, white tapered cross beams every hanger, out to 3.35 m | estimated (OSM outline 6.7 m wide at mid-span) |
| Central spine | 0.9 m wide, 1.2 m deep, 0.5 m below the rib line, X-braced frame every 2.2 m along the arch | estimated from the end-on photographs |
| Abutment ends | level to 69.5 m from mid-span, two 3.6 x 4 m pylons, 2.9 m above the paving, at each end | pylon shape from photographs, position from the 139 m overall length |
| Ramps to the ground | 30 m each end, 4.5 m to 0 | flat-map adaptation, not surveyed (see below) |

## Materials

`paint` white steel (ribs, spine, wings, fins, cross beams), `concrete` board-formed abutments, pylons and rib shoes, `deck` pale paving, `steel` stainless hangers, rails, brackets and the pylon medallions, `girder` dark edge beams and pylon recesses. Five materials, five draws in both LODs, same keys in the light and dark palettes; dark dims the white steel and concrete. Nothing is self-lit: the bridge has no lighting worth modelling from the photographs.

## Modelling decisions

- **Ribs** are smooth 14-sided (near) or 6-sided (far) tubes swept along the parabola in planes tilted inwards, ending in concrete shoes beside the deck. Where the pipe crosses the deck level it stands about 2 m outside the rails.
- **The Thunderbird** is what makes it this bridge, not any arch: a spine of small X-braced frames down the middle, and flat white triangular wings fanning from each rib bay to the spine, with a cross bar at every station. Seen end-on it is a column of X cells between two ribs with triangles either side; from the side it reads as a ladder. It begins where the ribs are 4.6 m above the paving so walkers and riders pass under it.
- **Hangers** are 5-sided rods (3-sided and thicker in far, so they survive at distance) from the tip of a small white triangular fin under each rib to the tip of the cross beam outside the rail.
- **Deck** is a slab between two dark edge beams with white tapered cross beams and silver brackets at each hanger foot, stainless top rail, three cable rails and posts every 2.5 m.
- **Abutments** are solid concrete masses with 1.1 m parapets, square pylons with panel joints, a recessed slot and a medallion (near only).
- **Ramps**: a deck 4.5 m above a flat map cannot meet the ground, so each end has a 30 m closed wedge to y = 0 with parapets that follow it. On the real site the trail climbs gradually over parkland; the slope here (15 percent) is a flat-map adaptation and is the model's least faithful part. Foundations, shoes and ramp toes rest on y = 0; nothing is below grade.
- **Far LOD** keeps the two ribs, the deck, all 44 hangers (thicker), the cross bars as negative-space rungs, the abutments and pylons; it drops the spine, wings, fins, cable rails, joints and medallions. 2 528 triangles against 13 744 near; identical bounds.

## Approximations, honestly

Deck height above water, deck width, rib stance and lean, the spine's dimensions and frame spacing, the wing layout, fin sizes, pylon sizes and the ramp are estimates from photographs and the OSM outline, not a survey. The Thunderbird is interpreted from end-on and side photographs and may differ in member count and orientation. The colour brief mentioned red; every 2026 photograph is white, so it is white. The rib planes are straight tilts, while the OSM outline suggests the lean flattens near the crown. No lighting is modelled. No Tesla hardware measurement.

## Verification evidence

Screenshots read (all in ignored `local-scratch/shots/humber-bay-arch-bridge/`, 1280x800, procedural and exported `--source glb`), each against the Commons references above:

- Elevation from the shore (`overview`, `facade`, `structure`, near, light) against Chicken4War and Taxiarchos228: the parabola, the 1:4.7 rise over span, hanger fan and rails match. Changed: rise checked by measurement against a cyclist in the 2011 photo (about 20 m).
- End-on from the abutment (`end` and a photograph-matched camera at the pylons) against Taxiarchos228 and *Palace Pier*: an A of two ribs with a central column of X cells and triangular wings. Changed: the first ladder (rungs and diagonals in one plane) was replaced by the spine and wings after reading the end-on crop; the rib stance was widened from 8.6 to 11.0 m after the OSM outline; pylon slot and medallion shrunk.
- From the deck (`deck`, near, light and dark) against Chicken4War's deck view: rails, hanger curtain, wings and spine.
- Under the deck (`under`, `detail`, exported near): fins, cross beams, brackets, rib shoe.
- Above (`roof`): the flare of the ribs and the sawtooth wings. Far LOD, light and dark, exported (`facade`, `overview`, `end`): silhouette and open ladder survive.
- Dark palette rendered with the palette recolour used by the layer (`shot-pal.mjs`, scratch): dimmer steel and concrete, no black or self-lit surfaces.
- Tests: `humber-bay-arch-bridge.test.js` raycasts the paving height, the 21.3 m rise, the 100 m clear span, the 139 m overall length, pipe diameter and lean, shoes under the rib feet, 44 hanger rods at their predicted places (source and export), open air between hangers and through the spine, pylons and ramps meeting the ground, no triangle wound against its normal, near/far bounds within 0.5 m.

Cityscape: not tested yet, integration is checked separately. Full 3D world: not tested yet, integration is checked separately.

## Cost

Near 13 744 triangles, 5 draws, 1 066 424 bytes; far 2 528 triangles, 5 draws, 202 680 bytes (uncompressed GLB, scene mesh draws). Budgets: 160 000 / 48 and 45 000 / 14.
