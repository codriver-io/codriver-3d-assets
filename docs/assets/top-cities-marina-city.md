# Marina City

Asset `marina-city`, 300 North State Street, Chicago. Bertrand Goldberg, 1964–68.
Two identical corncob towers on the north bank of the Chicago River: a cylinder of
scalloped balconies over an open spiral garage, with the House of Blues saddle roof
and the river restaurants at their feet. Contract:
[3d-top-cities-landmarks.md](../top-cities-landmarks.md). Source:
`src/peregrine/landmarks/top-cities/marina-city/`.

## Sources

| Fact | Value | Basis |
| --- | --- | --- |
| Architect, dates | Bertrand Goldberg, completed 1964–68 | [Wikipedia](https://en.wikipedia.org/wiki/Marina_City) |
| Roof | 587 ft = 178.9 m; OSM top 179.2 m | published; OSM `height` |
| Floors | 65 | published. The model uses 19 garage decks plus 40 apartment floors, lobby and penthouse |
| Cores | west (−31.83, 3.96), east (22.66, −24.29), 61.4 m apart | centres of the mapped h=169 circles |
| Balcony plan | 16 lobes. West radii 16.90–20.18 m, east 16.90–19.68 m | OSM petal ways, pulled in at the cusp so the ring stays inside the polygon |
| Parking drum | west 18.87 m, east 19.05 m | inscribed circle of each parking way |
| Replaced outlines | tower parts, House of Blues (1177923721), Legal Sea Foods (1177925119), Smith & Wollensky (1177925118) | OSM ways named in `footprint.js` |

## Dimension table (model vs source)

| Element | Model | Status |
| --- | --- | --- |
| Beacon | 179.2 m, red in both themes | sourced (OSM top). Published roof is 0.3 m lower |
| Balcony ring | mapped radius at each tip and cusp; 40 floors, 2.85 m pitch, 0.64 m slab with approximately 1 m curved upturn at each cusp | plan sourced; floor pitch estimated |
| Windows | full-width petal-back glazing in every bay in both LODs, at r 16.15 m, 2/11 lit (`glow`) | estimated rhythm |
| Garage | 19 stacked decks from 6.1 m to 52.4 m, 24 bays, semicircular fascia, crown thickness 0.46 m | deck count and pitch estimated. Photographs show a denser bay ring |
| Core / penthouse | garage back wall r 13.6 m up to the roof, penthouse r 5.12 m from 168.7 to 177.9 m | estimated. The wall sits just inside the parked cars so the drum is not a see-through tube |
| Theatre | saddle `y = 10 + 7.5·u·v` (corners 2.5 and 17.5 m) over the mapped rectangle | plan sourced; roof shape estimated from photographs |
| Pavilions | 3.1 m, glass band, with the part inside each parking drum removed | plan sourced; height estimated |
| Boats | four hulls in the river | placed, not mapped. Slips are absent from the extract |

## Materials

Ten merged materials in the near model, seven in the far model (no cars): `concrete`
(balconies, garage fascia, lobby and theatre walls), `concreteDark` (cores, balcony and garage soffits), `glass`,
`glow` (lit panes: dark glass by day, warm at night), `metal` (mast), `lamp` (red
beacon, unshaded), `roof` (saddle and pavilion tops), and `carLight` / `carDark` /
`carRed`. Light and dark palettes share keys. Concrete is a weathered warm gray,
not the saturated OSM colour `#FEF0C9`.

## Modelling decisions

- The identity is the twin cylinders and the 16-petal rhythm. Each balcony ring
  passes through the mapped tips and the mapped cusps, so a chord cannot bridge a
  one-sample dent.
- The garage fascia is a semicircle sampled six times per bay near. Near decks
  have dark top and soffit surfaces; their thickness is 0.18 m. Outer bays stack in columns. The real spiral is the inner
  aisle and does not show on the outside.
- Behind the cars a concrete wall (r 13.6 m) closes the drum. Without it the
  tower was a tube and rays through the arches struck the far side from inside.
  Cars are muted silver/grey boxes with roughly one red car per deck, nose-out
  on half the bays, supported on the deck tops. They stop one deck below the belt.
- Near keeps all 96 mapped samples for rounded petal shoulders. Concave annuli
  are triangulated around a coarse inner hole, without crossed cusp triangles.
  Far keeps every tip and cusp, the same crown and pier heights, and every
  full-width petal-back window. It does not have the quarter-points of an arch, so a distant bay is a V.
  It retains complete slab tops and fascias on alternate apartment floors plus the
  terminal roof slab (21 rings), with all 39 window rows kept. Far slab tops use
  32 tip/cusp outer vertices and 16 inner vertices, reaching behind the glazing
  so the lips are supported. This approved tradeoff keeps far below 12k triangles.
  The bounding box matches the near model.
- The theatre is one saddle surface, roof material only, with a glass south wall.
  Pavilion triangles that enter a parking drum are dropped.

## Approximations

- 24 bays, not the 28–32 visible in the parking photograph. The count is what puts
  a vertex on every pier.
- Far garage arches are the crown-to-pier chord. The round opening is the near model.
- The saddle reads clearly in plan and from the side; from a high roof camera the
  15 m of relief is a low twist.
- No marina slips, no bridgehouses, no 330 North Wabash, no hotel towers. Those
  outlines are not this landmark.
- Cityscape placement is flat local grade. Static Full 3D world views are recorded below; terrain lifecycle remains not tested.

## Cost

Near 58,565 triangles, 10 draws, 1,958,636 bytes. Far 11,477 triangles, 7 draws, 415,188 bytes.
Budgets are 60,000 / 14 / 2.5 MB and 12,000 / 8 / 500 KB.

## Verification

Compared with the ignored references in `tmp/top-cities/marina-city/refs/`,
especially the south night view (2) and the parking close-up (5). The first
garage rings were downward teeth; the fascia is now a semicircle. A hollow drum
failed the back-face sweep, so the shipped model puts a wall behind the cars
(`marina-city-procedural-near-light-parking.png`). Exported GLBs were rendered
near and far, light and dark (overview, south facade, roof, parking, north)
under `tmp/top-cities/shots/marina-city/`. Corncob petals, twin beacons and the
open bays are the read. Cars stay boxes. The theatre saddle is a shallow hypar.

## g4b review correction (2026-10-15)

The pale drum with narrow punched panes became full-width dark petal recesses;
slabs have a curved approximately 1 m upturn at their cusps and dark undersides.
The near ring uses 96 samples and a coarse inner annulus to retain rounded
shoulders within budget. Garage soffits are dark, cars use mostly muted grey
and silver, and the car bottoms meet the deck tops.

Exported near/far daylight and far night sheets are under
`tmp/next-200/fix/g4b/marina-city/`, alongside the dossier reference sheet.
Metrics: no layered faces, coplanar overlaps, back-face sweep flags, removable
attributes, below-grade parts, window rhythm loss or unsupported-member flags.
Depth regeneration/check reports zero dropped cycle edges. Ray tests pin the
turned-up cusp and the breadth of the glass bay in both LODs.

## g4b app evidence and limits

Cityscape: verified static far/near/street views on 2026-10-15 using Protomaps from tiles.codriver.io, isolated scratch bundle 4a6d5eaf149c on slot J; Full 3D world: verified static far/near/street views with AWS Terrarium DEM z15, same bundle and slot. Final across-river captures at tmp/next-200/fix/g4b/marina-city/app/{city,world}-final/ show clear twin bases, the saddle theatre and river pavilion edge; due-south earlier frames are diagnostic foreground occlusion, not integration evidence. These static captures do not verify terrain arrival/refinement, mode changes, reanchoring, failure/disposal or device performance; those remain not tested. Roads and navigation unchanged.

The final far and near cameras stand about 497 m and 320 m south of the
landmark; the closer street view is across the river near the State Street
bridge. `app-final-sheet.jpg` compares Cityscape (top) and world (bottom),
far/near/street/base from left to right. The north theatre is visible between
the parking drums in the street view; the river-side pavilion edge meets grade.
No provider mask was widened to remove a foreground neighbour.

Validation: 15 landmark-specific tests and all six matching top-cities
conformance tests pass; asset-catalog and assets:preview pass; near/far QA
metrics are clean and depth --check reports no cycles. The initial whole
top-cities run encountered unrelated unfinished palais-bourbon metadata and
exports; targeted conformance for these two assets is green.

## g4br scoped correction (2026-10-15)

Far balcony lips now have concrete top annuli connected back into the glazed
cylinder.
roof slab to meet the 12k cap; no isolated fascias remain, and all 39 glass/glow
rows retain the same material split as near. The near tower geometry is unchanged.
The theatre's three solid walls now use pale concrete, and its saddle coefficient
is 7.5 m rather than 6.5 m, giving 15 m of corner relief. Garage tessellation is
unchanged by the lead's explicit scope; far arches remain crown-to-pier chords.
The coarser far slab spacing still reads darker than near in close inspection;
this is the approved budget tradeoff, not identical LOD appearance.

Evidence: `tmp/next-200/fix/g4br/marina-city/glb/near-far-comparison.jpg`
places near (left) and far (right) at identical overview, petal-detail and north
cameras. One look-fix iteration was used. The slab tops and pale theatre saddle
were inspected. App far views in `app/{city,world}-final/far.png` use z16.45,
pitch 45°, bearing 0°, center −87.62876/41.8885. Both reports confirm active far
LOD, zero downloads and resident provider tiles; adjacent foreground buildings
partly occlude the bases, so theatre shape is established by the GLB north views.
Cityscape and Full 3D world static far appearance are verified; lifecycle and
terrain transition behavior remain not tested.

The app ran only from `/tmp/codriver-marina-g4br-xql72X`, bundle `f27403ba4a47`,
slot J ports 3306/3308, using Protomaps and AWS Terrarium z15 in world mode.
Servers were stopped by their recorded PIDs and the scratch copy removed;
shared `public/peregrine.js` was not rebuilt.

Validation: nine landmark tests and all three Marina City conformance tests pass;
full `top-cities.test.js` ran and had only the two existing Palais Bourbon
footprint/missing-export failures. Catalog validation and preview generation pass.
Fresh `metrics.json` has no issues, layered faces, coplanar overlaps, lost window
rhythm or unsupported member flags; depth regeneration/check drops zero cycle edges.
