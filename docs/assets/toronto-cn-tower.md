# CN Tower

Asset `cn-tower`, 290 Bremner Boulevard / 301 Front Street West, Toronto. Original
procedural model of the tower as it stands today: hexagonal concrete core with three
buttress legs and three glazed elevator slots, the round base, the seven-storey main pod
(radome, coffered ring, two glazed public levels, EdgeWalk ledge, sloping dark roof, red-footed
drum), the SkyPod and the three-section broadcast mast. Contract:
[3d-toronto-landmarks.md](3d-toronto-landmarks.md). Source: `src/peregrine/landmarks/toronto/cn-tower/`.

## Sources

| Fact | Value | Basis |
| --- | --- | --- |
| Height to antenna tip | 553.3 m | published ([Wikipedia](https://en.wikipedia.org/wiki/CN_Tower), [IEEE Toronto history](https://ewh.ieee.org/reg/7/millennium/cntower/CN_Tower.pdf): 553.33 m) |
| Concrete shaft / mast | 335 m / 102 m (44 sections) | published |
| Glass floor 342 m, LookOut 346 m, 360 restaurant 351 m, EdgeWalk 356 m, SkyPod 446.5-447 m | levels | published |
| Axis | `[-79.3870872, 43.6425888]` | mapped: centre of OSM way 32742038's antenna/pod parts and of the mapped hexagon |
| Hexagon | circumradius 10.4 m at grade (mapped vertices 9.9-10.8 m), vertices at bearing 16.4 + 60k deg | mapped: OSM part 288273461, best-fit rotation |
| Legs | bearings 46.4 / 166.4 / 286.4, tips 28.5-29.5 m from the axis, 5.85 m wide at the tip, on alternate hexagon faces, crest reaching the core at 330 m | mapped: OSM parts 288273458-60 (`roof:direction` 45/165/285, height 330, skillion) |
| Round base | radius 23.2 m | mapped: the OSM outline is a circle of 23.1-23.2 m plus the three leg tips |
| Pod parts | radome 330-338 m, glazed levels 338-360 m, drum 360-370 m; SkyPod 440-457 m | mapped (heights by the OSM contributor) |
| Elevator glass slots | on the three vertices between the legs (76.4 / 196.4 / 316.4 deg) | photographs (south, north, worm's-eye) |

## Dimension table (model vs source)

| Element | Model | Status |
| --- | --- | --- |
| Tip | 553.3 m | sourced |
| Core circumradius | 10.4 m grade, 8.8 m under the pod, 5.6 m above the pod | grade mapped; taper and the step at the pod estimated (photo: 16.3-17.9 m across under the pod, 10.4-11 m above) |
| Leg crest | `r(h) = a(h) + 20.1 (1 - h/330)^1.4` | tip and top mapped; exponent fitted to the south photograph (rms 0.7 m over ten heights; OSM's straight skillion is exponent 1, rms 2 m) |
| Round base | r 23.2 m, 7.5 m tall, dark flat roof | radius mapped; **height is a guess** |
| Pod | 49.2 m across at the ledge (mapped glass part 46.5 m; photographs 49-49.6 m), drum 36.6 m, radome 46 m; radome 328.6-338.6, glazed levels 342-353, ledge 353.2, cone to 361, drum to 370 | widths and heights estimated from calibrated photographs, +-3 m in height, ~3% in width; levels agree with the published ones |
| SkyPod | 16.9 m across at 445-447 m, bowl 439-446, rim 446-447.3, cone to 452 | estimated (photograph); the OSM part is 23.3 m and was not followed, the photographs (south, north, peak) all give 0.34 of the pod width |
| Mast | 8.8 m to 489 m, 6.3 m to 506 m, 3 m to 551.6 m, red spire; red bands at 490-493, 508-511, 523-527, 543-552 m; dark collars | estimated from the south photograph (section boundaries within 2 m) |
| Roof cabinets, EdgeWalk posts, mullions, brackets, struts | 2-3 boxes, 60 posts, 240 mullions, 12 + 12 | estimated; the real cabinets sit higher on the shaft |

## Materials

Eight merged materials, one draw each: `concrete_dark` (the hexagonal core, in shade in the photographs), `concrete` (legs, base wall, coffered ring, lighter and warmer), `white`
(radome, pod cladding bands, drum, SkyPod, mast), `dark` (sloping roof, soffit, brackets, base roof, collars),
`glass` (level glazing, near-black navy as in the photographs; SkyPod rim; elevator slots), `metal` (roof, ledge, rails, cabinets), `red` (drum stripe, mast bands,
spire) and `glow` (the LED line down each elevator slot; unshaded, a pale glass tone by day and bright
lavender-white in the dark palette, as the tower is lit at night). Light and dark palettes share keys.

## Modelling decisions

- The silhouette is the tower: thin white mast, slim shaft above the pod, the pod with its open dark underside,
  then a shaft that flares into three fins. Everything else (formwork, cabinets, rails) is secondary.
- The fins are built as ruled surfaces sampled by height (26 stations near, 10 far) so the steep crest stays smooth;
  their plan width is the mapped linear taper (about 9.7 m at the face to 5.85 m at the tip), scaled with the core.
- The three glass slots are chamfers cut into the hexagon's vertices (no boolean), so the faces stay planar and flat shaded. They are ~12% of the core wide as in the south photograph (4.4 m at grade narrowing to 2.2 m under the pod, an LED line 0.85 m wide down the middle); the fins' root width was narrowed to 7.0 m so they no longer hide the slot.
- The pod is surfaces of revolution, split at every hard edge; bands are separate runs, never proud rings, so nothing is
  coplanar (an early red ring z-fought at distance and was rebuilt as two runs).
- Far LOD: same hexagon, fins (10 stations), pod and mast profile at 40 segments, no mullions, ribs, rails or corrugation;
  the open pod underside and the fin gaps stay.
- The model stays inside the mapped outline below 40 m (tested with the runtime layer's own ownership test); the pod
  overhangs it by 1.4 m, which only leaves a sliver of the provider's pod extrusion unmasked, hidden inside the model.
- The runtime zone: drawn within 9 km from zoom 12.5 (a 553 m tower is read from far away), near LOD within 650 m.

## Approximations, honestly

- Review round 1: the slot was a hairline (widened, above), the SkyPod bowl was lumpy (now a quarter-ellipse with 9 evenly spaced rows and a smooth cone), and the shaft and pod read tan and white (two concrete tones, darker glass, taller glazed bands 3.5 and 3.1 m against 1.4-1.6 m white bands, dark mullions).
- Pod, SkyPod, mast and taper are read off photographs whose horizontal and vertical scales disagree by up to 15% between
  viewpoints (perspective-corrected images). Heights follow the published levels; widths are the average of the two
  best-behaved photographs and a mapped part, so a Torontonian may see a metre or two of difference in the pod.
- The base is a plain drum; the real base has the entrance pavilion (red glass, white fascia), Ripley's Aquarium and the
  *Audience* sculpture platform, none modelled (they are separate OSM buildings and stay provider-owned).
- The pod interior is empty, the radome's underside and bracket geometry are simplified, no rooftop antennas, no ladder on the
  shaft, no colour-changing night lighting (one LED line per slot).
- OSM data was read from one small-bbox call to the OSM API on 2026-09-29 because the shared Overpass queue was saturated;
  the helper `local-scratch/overpass.mjs` was queued but never answered and was cancelled.

## Verification

Compared side by side with photographs (local, ignored, `local-scratch/cn-tower/refs/`; licences in the catalog record):
the pod from the north at the photograph's own elevation (three iterations: the first pod was a barrel with three glass
bands, a thick red ring and splayed brackets; now two glass levels, a thin stripe, the coffered ring and a wide radome), the
whole tower from bearing 196 deg against the south photograph (this exposed the leg profile: exponent 1.1 gave 3 m too wide a
shaft mid-height, 1.4 fits), the underside, the roof, street-level and the SkyPod. Both LODs and the **exported GLBs** were rendered
(`local-scratch/shots/cn-tower/`: overview, pod, underside, roof, structure, facade, skypod, antenna; procedural and GLB, near and far,
light theme; dark-theme renders only change the harness background, the dark palette is recolour-by-name at runtime).
`cn-tower.test.js` pins the height, pod/SkyPod/mast radii by raycast, the open underside, the three-fold fin/slot symmetry at the
mapped bearings, footprint containment and the GLB round trip. `toronto.test.js` passes for this landmark.

| Case | Status |
| --- | --- |
| Cityscape | not tested yet, integration is checked separately |
| Full 3D world | not tested yet, integration is checked separately |

## Cost (exported default scenes)

| LOD | Triangles | Mesh draws | Bytes |
| --- | ---: | ---: | ---: |
| Near | 14,878 | 8 | 506,252 |
| Far | 4,338 | 8 | 122,040 |

Photograph credits used for comparison only (not redistributed): Taxiarchos228 (Free Art Licence), Wladyslaw Sojka (CC BY 3.0 /
CC BY-SA 3.0), Chris Woodrich (CC BY-SA 4.0), Niabot (CC BY-SA 3.0), Diego Delso (CC BY-SA 3.0), G. Edward Johnson (CC BY 4.0), Dillan Payne
(CC BY-SA 4.0), TheWxResearcher (CC0), Robert Taylor (CC BY 2.0), Ellis Wiley (attribution, 1976 archive).
