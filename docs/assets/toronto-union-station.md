# Union Station

Asset `union-station`, 65 Front Street West, Toronto. Original procedural model of the
station as it stands in 2026: the 1927 Beaux-Arts headhouse (Ross & Macdonald, with the CPR's
Hugh Jones and John M. Lyle), the train sheds behind it and the Zeidler glass atrium over the
central platforms. Contract: [3d-toronto-landmarks.md](3d-toronto-landmarks.md). No scan, traced mesh,
photograph or texture is in the repository or the GLBs.

## Identity and what a driver sees

From Front Street at 100 m: a long, low, horizontal building of buff limestone, 228 m
long, its middle a deep loggia of round Tuscan columns under a lettered frieze ("UNION STATION"), a
plain attic above it and, set back, the Great Hall's stone walls under a low green copper hip. Either
side, the 17 m wings (four window rows, 14 bays west / 13 east) end in slightly projecting pavilions with
arched ground-floor windows and a low copper pyramid roof. In front of the wings a sunken moat, glass-roofed since the
2010s, behind a low stone parapet. From 800 m the silhouette is the copper hip over the central block
with the long, level wings and the flat shed roofs and pale atrium vaults behind.

## Sources and dimension table

The single most useful source is the mapped 3D data: OSM way 14744491 (the outline) carries about
sixty `building:part` polygons for the headhouse, with heights, roof shapes and every column. The
model's plan, bearing and heights are read from them (OSM map API, fetched 2026-09-29; no Overpass call).
Prose and photographs were used for everything OSM does not say.

| Feature | Value | Basis |
| --- | --- | --- |
| Headhouse length, pavilion to pavilion | 228.4 m (model 228.4; cornices overhang ~0.7 m) | OSM parts 290168044 / 290168047; Wikipedia 229 m |
| Axis bearing (Front Street) | 73.65 deg true | least-squares over the long edges of the OSM outline (73.25-73.9) |
| Columns | 24 shafts, 12 m tall (OSM height=12; Wikipedia 40 ft), 22 + 2 larger junction columns, pitch 4.4 m | OSM `building:part=column`; positions used as mapped |
| Column base diameter | 1.75 m (OSM hexagons 1.46 m) | estimated from photographs and the 75 t weight |
| Entablature / attic parapet | 12 -> 19 m | OSM part 951328327 (min_height 12, height 19) |
| Porch step-outs | 12 -> 15 m, 1.8 m proud | OSM parts 951328329 / 951328341 |
| Loggia depth | 3.9 m behind the entablature line, back wall at v = -14.9 | OSM parts 290168028, 951328331 |
| Wings and pavilion walls | 17 m | OSM `min_height 17` on the pavilion parts |
| Pavilion roofs | copper pyramid, roof:height 2.8, apex 19.5 m, colour `#527F76` | OSM parts 290168044 / 290168047 (pyramidal, copper) |
| Great Hall walls | 26.5 m; hip 26.5 -> 32.5 m (roof:height 6), 76 x 25 m footprint | OSM parts 290168050 / 290168042; Wikipedia hall 76 m x 27 m high inside |
| Light courts | west 52 x 13 m, east 18 x 13 m, roofs at 5 m | OSM parts 290168040 / 290168038 (+ skylights 290168035 / 951328326) |
| Moat glass roofs | 12 m wide, y = 0.2-0.55 | OSM parts 951328324 / 951328325 |
| Wing window rows, bay counts | 4 rows, 14 / 13 bays at the 4.4 m column pitch | estimated (photographs); the pitch is measured |
| Great arches | 8.6 m clear, crown 13.2 m, centred behind the porches | estimated from photographs; centres from OSM porch parts |
| Cornice profiles, plinth, dentils, roundels, dormers | see geometry | estimated |
| Rear range, shed roofs, atrium | 5.5 m, 6.5 m, vaults 7.5 -> 10.5 m | plans measured (OSM roofs 1550729284 / 1550729285 / 300884212), heights estimated |

The mapped outline is not symmetric about the pavilion midpoint (the central block sits ~1.9 m east of
it and the wings differ by ~4.7 m); the model follows the data.

## Frame, origin and rotation

Real metres, +X east, +Y up, +Z south. `origin` is the middle of the headhouse along Front Street and 8 m
behind the pavilion fronts. The model is authored in a facade frame (u along Front Street, v away from
it) and rotated once by `ROTATION = 90 deg - 73.65 deg` about y (`union-station-site.js`), so the plan sits
in its footprint. `y = 0` is Front Street pavement; nothing is baked for terrain, sea level or latitude. The
sheds and atrium also stand at y = 0, although the real platforms lie a few metres below the street:
the datum choice keeps a rigid base under a single pad (`padM` 215 m covers the farthest shed corner).

## Materials

Eleven named materials (`stone` is a light limestone toward OSM's `building:colour` `#EEDFCC`, a little darker so the layer's vertex shading lands near it), same keys in light and dark: `stone` (Indiana / Queenston limestone, `#e4d6bc` light), `base`
(darker plinth and coping), `copper` (verdigris, OSM `#527F76`), `roof` (gravel and membrane), `glass`,
`bronze` (the arches' verdigris grilles), `metal` (mullions, lettering, seams), `brick`, `shed` (white
membrane), `atrium` (glass vaults and the moat roofs) and `glow` (unshaded: the great arches, pavilion
arches and Great Hall clerestory, which the night palette lights warm).

## Modelling decisions

- Walls with windows are slabs with the openings punched through (`union-station-kit.js` `wallU`/`wallV`),
  the mass behind starts where the slab ends, and one glass strip per window row is tucked into the back of the
  slab. A wall of 60 windows therefore costs four boxes, no coplanar sheets, and the reveal is real. The slab's
  back cap lies against the mass behind it and the glass, so `wallU` / `wallV` drop it (about a third of the
  slab's triangles, and the stone-over-glass coplanar overlap of 1,479 m2).
- Cornices are stacked slabs whose projecting sides are chosen per block, so adjoining blocks never overlap
  same-facing tops. Column shafts are lathed with entasis, echinus and separate plinth / abacus.
- The lettering is block strokes built from boxes (no font); it reads left to right from Front Street.
- The shed roofs carry alternating 13.8 m strips (double width in the far model) with a seam between them, after the roof photograph; a few boxes, no extra draw.
- Lathed columns have no pole caps (the plinth and abacus close them), which removed 864 degenerate and 36 inside-out triangles; a test now asserts none remain.
- The far model keeps every punched window bay (as bands would have turned the wings into dark glass), the
  columns as tapered lathes, the moat, cornices, hip, sheds and vaults; it drops muntins, dentils, roundels,
  dormers, grilles, lettering and seams, and leaves the two rear ranges (facing the rail corridor) without
  window holes.
- **Draw budget** (`FOLD` in `config.js`): near keeps all eleven materials. Far folds the granite plinth (`base`) and the
  shed roof (`shed`) into `roof`, which is the same grey in both themes, and the dark steel seams (`metal`) into
  `glass`, which leaves seven draws and 425 KB. Overlap fixes: shed-roof seams are sunk into the roof, the moat glass
  roof ends inside the plinth and the moat pier caps start inside the coping (coplanar overlap 1,981 m2 to 2 m2).

## Approximations

Estimates are listed in the table. Not modelled: interiors, the Bush shed's smoke ducts and platform canopies,
the Skywalk and Bay Street connections (left to the provider), coffering under the loggia, sculpture and
heraldry, the stair down to the moat, street furniture. The provider's separate extrusions for the sheds and
courts are removed with the outline ring and re-drawn by the model.

## Footprints replaced

Five OSM rings (`footprint.js`): outline 14744491; entablature strip 951328327 and the two porch step-outs
951328329 / 951328341 (which stand 0.5-2.6 m outside the outline and cover the 24 column parts, each of which is
below the conformance test's 4 m^2 floor); and the atrium roof 300884212, which runs 8 m past the outline. A test
pins that every model vertex is within 1.2 m of these rings (cornice overhang, parapet coping).

## Costs (exported default scenes)

| LOD | Triangles | Mesh draws | Bytes |
| --- | ---: | ---: | ---: |
| Near | 28,159 | 11 | 1,284,020 |
| Far | 7,045 | 7 | 425,252 |

## Verification

Rendered with `local-scratch/shot.mjs` (headless Chromium, red OSM footprint rings) and compared with the
Commons photographs listed in the catalog record (front three-quarter views of the porch and colonnade, the
pavilion corner, the 1927 postcard, the night rooftop view, the train-shed roof view). Screenshots judged
(`local-scratch/shots/union-station/`, not committed): procedural near light `facade`, `colonnade`, `pavilion`,
`overview`, `roof`, `structure`, `shed`, a 100 m street view and a top-down footprint view; far light street
views at 100 m and 800 m; far dark `overview` and `facade`; and the exported GLB near light `facade` /
`overview` and far dark `facade`.

What the screenshots changed: the first massing had a blank 40 m pavilion end wall (added the end walls with
arches and window bays); the pavilion and rear walls were plain (added the four-row window walls and rear
rows); the first far model used window bands and read as dark glass (now punched bays); black roof-light boxes
on the hip were removed and replaced by small copper dormers; the porch columns' plinths and the entablature
cornice ends overhung the mapped rings by 1.25 m (trimmed); the hip colour was brighter than OSM's `#527F76`.

Review fixes (independent review, PASS-WITH-NITS): the pavilions had a hidden roof; they now build the mapped pyramid (test: apex 19.5 m in both LODs); stone was khaki, now paler; degenerate/inside-out lathe triangles removed; shed roofs articulated.

Tests: `node --test src/peregrine/landmarks/toronto/union-station/union-station.test.js` pins the length,
ridge height and bearing; every mapped column (round, at its mapped position, porch 2 m proud of the central
row); the open colonnade in both LODs (a ray between columns reaches the glazing); the bronze-and-glow arches;
about twenty lettering strokes on the frieze; the 17 / 19 / 32.5 m roof steps by vertical rays; footprint
containment; and that the far bounds match the near within 0.5 m at under 40% of the triangles.

Cityscape verified in the running app: not tested yet, integration is checked separately. Full 3D world
(terrain): not tested yet, integration is checked separately.

## Build

`pnpm build:toronto-landmarks union-station` writes `public/models/buildings/union-station-{near,far}.glb`
and `union-station.json`.
