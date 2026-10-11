# Calgary Tower

Asset `calgary-tower`, 101 9 Avenue SW, Calgary. Original procedural model of the tower as it stands today (the
Husky Tower of 1968, W.G. Milne and A. Dale and Associates): a round concrete shaft that tapers upward, the turret
(ribbed flared soffit, red-clad observation level between dark glazing, brown overhanging rim with railing, white
dome with oval skylights, brown drum), the Olympic cauldron with its flame on a thin mast, and the 1990 glass
rotunda at the foot. Contract: [3d-calgary-landmarks.md](../calgary-landmarks.md). Source:
`src/peregrine/landmarks/calgary/calgary-tower/`.

## Sources

| Fact | Value | Basis |
| --- | --- | --- |
| Height to the tip | 190.8 m | published ([Wikipedia](https://en.wikipedia.org/wiki/Calgary_Tower): 190.8 m / 626 ft) |
| Roof / top floor | 171 m / 157.6 m | published (Wikipedia infobox) |
| Cauldron | natural-gas flame, built October 1987, first lit 13 February 1988, relit for special events | published (Wikipedia, citing Calgary Public Library) |
| Glass rotunda lobby | added 1990 | published (Wikipedia) |
| Glass-floor extension | north side of the observation deck, opened 24 June 2005 | published (Wikipedia); its size and shape are a guess |
| Current colours | red cladding, white/grey concrete (the 1978 red-and-yellow scheme is gone) | photographs 3, 7, 8; Wikipedia's 1978 caption |
| Axis | `[-114.0631348, 51.0443015]` | mapped: centre of the circle fitted to OSM way 25719793 (radius 19.1 m, residual under 0.8 m) |
| Rotunda | 3 levels, cone roof, plan inside the 17.9-19.4 m mapped ring | mapped (OSM `building:levels=3`, `roof:shape=cone` on part 1502697874; `building:shape=tower` on the way) |

Photographs (local, ignored, `tmp/calgary/calgary-tower/refs/N.jpg`, never shipped; "photograph N" below is that file): Tony Hisgett, 'Calgary Tower
(8033515499) straightened 2012' (CC BY 2.0); Thivierr, 'Calgary Tower 1' and 'Calgary Tower with flame 2'
(CC BY-SA 3.0); HordeFTL, 'CalgaryTowerBelow' (public domain); Nxr-at, 'Calgary Tower 1978' (CC BY-SA 4.0);
Benefactor123, 'Calgary - Calgary Tower - Downtown 01' and 'Observation deck 01' (CC BY 3.0); Eternalsleeper,
'Calgarytowershot' (public domain). Titles, authors and licences are in the catalog record.

## Footprint choice

The model owns **way 25719793** (the tower: a circle about 19 m in radius) and its three `building:part` ways
1502697873 (ring wall), 1502697874 (inner disc, cone roof) and 1502697875 (south crescent), all inside that circle.
The surrounding **Tower Centre** mall (way 259692476, five levels) is left to the provider: its outline wraps the
tower's circle on the east and south but is a separate building, and the model does not draw over it. Its
adjoining parts (1502697877, -906, -909, -912) stay provider-owned for the same reason. Below 40 m the model
stays inside the mapped rings (tested with the runtime layer's own ownership test); everything above is within
17.8 m of the axis.

## Dimension table (model vs source)

Calibration of the photographs: the 190.8 m tip and the 171 m roof fix the vertical scale (about 21 px/m in the
enlarged crop of photograph 3, 4.7 px/m in photographs 7 and 8); the same scale gives the turret's width, and the
ground line of photograph 7 comes out where it should (a consistency check on the 31 m).

| Element | Model | Status |
| --- | --- | --- |
| Tip | 190.8 m (red beacon on the mast) | sourced |
| Drum top (roof) | 171.0 m | sourced |
| Observation glazing | 157.3-159.4 m (top floor 157.6 m) | level sourced; band height estimated (photograph 3) |
| Turret | 31 m across at the rim (r 15.5); red cladding r 11.95 at 150.4 m leaning to 13.3 at 161.5 m; soffit 145.4-150.4 m; rim 162.9-164.4 m; dome to 167.8 m; drum 5.5 m radius, 167.8-171 m | estimated from photographs, about +-3% in width, +-2 m in height |
| Shaft | 10 m across under the turret (r 5.0 at 145.4 m), r 6.9 at 30 m, 7.4 at 14 m where the rotunda's cone roof meets it (concave taper, exponent 1.8) | estimated (photographs 3, 7, 8); the 14-15 m foot is the least certain |
| Rotunda | r 17.6 m wall (17.8 m eave and floor bands), 9.6 m to the eave, cone roof to the shaft at 14 m | plan mapped; **heights, mullion rhythm and cone pitch guessed** (no photograph of the base) |
| Cauldron | 4.6 m bowl on a 1.9 m pedestal at 172.9-174.3 m, flame to 175.7 m | estimated (photographs 3 and 8) |
| Mast | 0.34 m radius at the bowl to 0.12 m at 190.2 m | estimated |
| Glass-floor extension | 3.6 m wide, projecting 1.4 m, 156.2-159.4 m, north | **guessed** |
| Aviation lights | tip and three on the drum roof | red beacon on the tip (assumed from aviation practice); the three on the drum roof are a guess |

## Materials

Nine merged materials, one draw each (far: seven, `metal` merges into `white` and `lamp` into `light`):
`concrete` (shaft, rotunda plinth and eave), `white` (soffit, dome), `red` (fluted cladding), `brown` (rim,
drum), `glass` (rotunda glazing, soffit ribs, skylights), `metal` (mullions, railing, rotunda roof, cauldron,
mast), and three self-lit ones: `glow` (the two observation glazing bands and the glass-floor extension: dark
glass by day, warm at night, as the restaurant level is lit), `lamp` (the cauldron flame) and `light` (the red
aviation lights). Light and dark palettes share keys. By day `lamp` takes the bowl's metal tone (`#aeb3b7`), so the
flame does not read as a fire in sunlight; it is orange only in the dark palette (`#ffb347`). In far the flame is
folded into `light`.

## Modelling decisions

- The silhouette is the tower: a thin shaft that gets thicker toward the ground, a turret much wider than the
  shaft with its trumpet-shaped soffit, then a small crown. Everything else is secondary.
- The turret is surfaces of revolution about the axis, split at every hard edge. The red cladding is fluted
  (88 panels, alternate ring vertices inset 0.22 m, ramped in and out so no gap shows from below) and steps in
  by 0.2 m to the glazing, so the two bands overhang it and nothing is coplanar.
- The soffit's radial ribs follow its profile (48, dark, 0.1 m proud, open ends hidden in the joints).
- Near adds the 72 glazing mullions, the 48 rotunda mullions, the railing posts and rail, the ten skylights
  (tilted to the dome's 24 degree slope, sunk 0.15 m so none floats) and the aviation lights on the drum. Far
  keeps the shaft (7 stations), the soffit, the flush bands, the dome, drum, cauldron, mast and rotunda.
- The rotunda is dark glass with metal mullions and two floor bands; the cone roof is metal grey.
- The flame is a small `lamp` cone around the mast: it is shown lit at night, as on Canada Day (the real one burns on
  special occasions only); by day it is drawn in the bowl's metal tone, so no orange dot reads as a burning flame.
- The runtime zone: drawn within 6 km from zoom 12.5 (a 190 m tower in a flat city is read from far away),
  near LOD within 450 m.

## Approximations, honestly

- The turret's diameter (31 m) is derived from the published heights and photographs, not from a drawing; a
  Calgarian may see 1-2 m of difference. The shaft's foot diameter is the least certain number.
- The rotunda is an educated guess from the OSM tags and the 1990 date: its glazing pattern and roof pitch are
  not from a photograph.
- The glass-floor extension is only known to exist on the north side; its size is a guess.
- No window-cleaning cradle, drum windows, dome-edge windows, soffit brackets, shaft access hatches, the 2014
  colour-changing LED lighting (the night model has a lit glazing band and red lights only), interior,
  Tower Centre mall, Plus 15 skyway or signage.
- The Tower Centre mall wraps the rotunda; its extrusion is provider-drawn and its outline touches the circle,
  so a seam of provider geometry will meet the rotunda at ground level.

## Verification

Compared side by side with the photographs at matching camera heights, the turret from the south-east against
photograph 3 (three iterations: the first soffit was a round bowl where the photograph shows a straighter flare,
the glazing and red bands were 0.3 m too narrow near the top, the dome base too small), the whole tower against
photographs 7 and 8 (proportion of shaft and turret, taper, the base flare), the roof, the soffit from below, the
crown and the street-level rotunda. Renders in `tmp/calgary/shots/calgary-tower/`: procedural near light sheet of
all seven views, far dark sheet, the **exported GLBs** near light and dark (`...-glb-near-light-sheet.jpg`,
`...-glb-far-dark-sheet.jpg`, `...-glb-near-dark-sheet.jpg`), a 800 m driver's view of the far GLB
(`...-drive800.png`), a night view at 130 m of the near GLB (`...-night100.png`), photograph comparison
(`cmp-pod.jpg`) and a long-lens plan view over the red footprint rings (`...-plan.png`; the default `--top`
hides the ground rings behind the 31 m turret). What the renders changed: the first sheet showed 30 heavy
soffit ribs (now 48 thin ones), a black glass-floor patch (now smaller and self-lit), a round soffit bowl and
narrow upper bands (re-profiled, above); the dark palette's brown rim was near black (lightened). The plan view
confirmed the rotunda inside the mapped rings and centred on the axis.

`qa-metrics.mjs`: no coplanar overlaps, 0 % back-face hits, nothing below grade, far bounds equal to near.
`calgary-tower.test.js` pins the 190.8 m tip, the turret and cladding radii by raycast, the observation level and
roof heights, the cauldron, flame and mast, the shaft taper, the rotunda and cone roof, the glass-floor bulge,
footprint containment and the GLB round trip. `calgary.test.js` passes for this landmark.

| Case | Status |
| --- | --- |
| Cityscape | not tested yet, integration is checked separately |
| Full 3D world | not tested yet, integration is checked separately; downtown Calgary is flat under the 22 m pad (no `terrainPad` declared), so the pad is expected to take the local grade without sinking the rotunda |

## Cost (exported default scenes)

| LOD | Triangles | Mesh draws | Bytes |
| --- | ---: | ---: | ---: |
| Near | 12,588 | 9 | 397,880 |
| Far | 2,636 | 7 | 66,380 |

Photograph credits are listed above (comparison only, not redistributed).
