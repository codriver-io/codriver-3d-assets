# Fairmont Palliser Hotel

Asset `fairmont-palliser`, 133 9 Avenue SW, Calgary. Original procedural model of the hotel as it stands in 2026:
the Canadian Pacific Railway's Edwardian hotel of 1914 (Edward and William S. Maxwell, with Lawrence Gotch), which
had eight storeys when it opened and was raised by four floors in 1929. Contract:
[3d-calgary-landmarks.md](../calgary-landmarks.md). No scan, traced mesh, photograph or texture is in the repository
or the GLBs. The Calgary Tower and its parkade next door are separate; nothing of them is drawn or removed here.

## Identity and what a driver sees

From 9 Avenue at 100 m: a 70 m wide, 60 m tall block of buff brick on a grey-buff stone base that stands on a dark
granite band. The base is a 7 m ground storey of tall windows between pilasters (with a pale loggia of arched
lights above its cornice) and carries the shaft: regular bays of narrow windows, a heavy projecting cornice one
storey under the roof, one more row of attic windows above it and a 1 m projecting cornice and parapet at the
roofline. The centre of the front steps up (12, 13, 14 levels) to a dark slate penthouse
roof with the "PALLISER" sign (pale grey by day, lit at night), and a dark teal canopy with a row of lamps shelters the entrance in a recess
of the podium. From 800 m, and from the Calgary Tower side, what reads is the E-shaped plan: three 12-level arms
(west wing, central stem, east wing) running north from the 9 Avenue block, with two 2-storey roof courts
between them, all under flat roofs with heavy cornices, and the stem rising in steps to the sign.

## Sources and dimension table

The plan and the levels come from OSM (Overpass through the shared helper, 2026-10-02): the outline (way 213930558,
`height=60`, `level=12`) and eleven `building:part` ways (1502697839 to 1502697849). Photographs (Wikimedia Commons,
listed in the catalog record; downloaded to ignored `tmp/calgary/fairmont-palliser/refs/` only to compare) informed
the facade rhythm, the base, the cornice, the entrance and the roof sign. The lobby photograph was not used.

| Feature | Model | Basis |
| --- | --- | --- |
| Overall height to the top of the penthouse roof | 60.0 m | **sourced**: OSM `height=60` on the outline; the 15-level part is the highest |
| Storeys | 12 at the arms, 13 / 14 / 15 along the stem | **sourced**: Wikipedia (12 storeys: 8 in 1914 plus 4 in 1929) and OSM `building:levels` per part |
| Plan, outline and eleven parts | 70 m along 9 Avenue, 52 m deep, axis 2.7 deg clockwise of east | **mapped**: OSM ways listed above (rings used as they are: the model sits exactly in its footprint) |
| Ground storey | 7.2 m | **photo estimate** (entrance photograph) |
| Storey height above it | 3.77 m, so 12 levels reach 48.7 m, 13 levels 52.5 m, 14 levels 56.2 m and 15 levels 60 m | **derived**: OSM's 60 m spread over 15 levels |
| Court infills, north between the arms | 2 levels, 11.0 m | **mapped** (`building:levels=2`) |
| 9 Avenue podium and entrance recess | 1 level, 7.2 m; the 6 m wide entrance bay is recessed 3 m between two flanks | **mapped** plan; height from the level count |
| Stone base to a belt course | to 11 m (the top of level 2), brick above; a dark granite band 1.9 m high at its foot | photo estimate |
| Window | 1.05 x 1.8 m, 2.75 m bay pitch, paired lights and balconettes in the central bay of long walls; 1.55 x 3.5 m tall windows (sill 2.1 m, above the base band) on the ground storey of 9 Avenue | photo estimate |
| Cornice | 1.3 m projection, 1.65 m deep, one storey under the roof | photo estimate |
| Roofline cornice | on the 12 / 13 / 14-level parts: a stepped shelf 1.0 m out (0.45 m under it) from 0.9 m below the roof edge, with a 0.75 m parapet 0.3 m out standing on it; the courts and podium keep a plain parapet | photo estimate (the photographs show a deep cornice at the top of the shaft) |
| Penthouse | brick to 58 m, slate mansard 58 to 60 m, 2 m inset | OSM plan of the 15-level part, roof form **estimated** |
| Sign | "PALLISER", 1.7 m letters, about 13 m wide, on the south slope | word inferred from the visible "..ER" in a 2010s photograph; size and letter forms **estimated** |
| Entrance canopy | 6 to 10 m wide, reaches 5.8 m out of the recess (2.7 m past the podium front), 6.7 m high at the wall, 5.4 m at the front | photo estimate |

## Materials (light / dark)

`brick` (buff shaft), `stone` (grey-buff base, belts, cornices, parapets, surrounds, quoins), `plinth` (the dark
granite band at the foot, 1.9 m), `glass` (dark panes), `glow` (30 % of panes: the same colour as `glass` by day, warm lit yellow at
night; drawn unshaded), `roof` (grey gravel), `slate` (penthouse roof), `panel` (the pale blue-grey spandrel behind
the second-storey arches), `canopy` (dark teal ironwork), `sign` (lettering, self-lit: pale grey `#c9cac6` by day, warm `#ffd979` at night) and `lamp` (the bulbs
on the canopy edge, self-lit). Eleven materials, so eleven near draws; the far model drops `plinth`, `panel`,
`lamp` and the near `stone` detail and keeps eight.

## Modelling decisions

* **The plan is the mapped plan, unrotated.** Every part is the OSM ring, so the 2.7 degree grid angle is already
  baked in (`fairmont-palliser-site.js` derives the model-metre rings and the hotel's own U / V axes from
  `SPEC.origin`, the area centroid of the outline). Where two parts meet, the wall of the lower one is not drawn and
  the higher one's wall starts at the lower roof (`exposedWalls`), so there are no buried or coplanar internal faces.
* **Base and roofline.** A 1.9 m dark `plinth` band (0.3 m proud) carries the two-storey stone base; the ground
  windows and pilasters start above it. The tall parts (12 / 13 / 14 levels) end in a 1 m stepped cornice with the
  parapet on its shelf (a 10-point section extruded along each wall, `roofCorniceSection`; its top sits 5 cm above the
  roof plane and nothing else shares its planes), in near and far. The first pass drew only the cornice one storey
  below the roof and a plain 0.3 m coping.
* **Detail is geometry, and is merged.** Windows are flat quads proud of the wall by at least 0.12 m (a pale stone
  surround quad under a 0.2 m glass quad, a mullion quad at 0.27 m): no boxes, no hidden faces. Cornices, belts,
  parapets and quoins are closed prisms extruded along the wall from a (depth, height) section
  (`fairmont-palliser-facade.js`), one quad strip per face.
* **The sign is stroke lettering** (`fairmont-palliser-sign.js`): 31 bars raised 0.2 m off the slate slope, each a
  front face and its two long sides (6 triangles; the 0.28 m ends are sub-pixel), so nothing floats: 186 triangles,
  half of the first pass's 380, by cutting the strokes of the S, P and R and the I's serifs. The far model keeps one
  band in the same material.
* **Far LOD** keeps every wall, cornice and parapet, the open courts, the stepped roofs, the penthouse and the
  canopy, and replaces the window grid with one dark slot per two bays cut into three-storey blocks (a third lit
  at night). The slots are 1.0 m wide, so the far windows cover 19 % of a north bay against the near 17 % (the first
  pass drew them 2.1 m wide: twice as dark, and striped). 2,283 triangles against 10,003.
* **Night.** `glow` panes are scattered with a fixed seed (30 %), so a dark-theme hotel is speckled with lit rooms,
  the sign and the canopy lamps glow, and by day `glow` and `glass` are the same colour.

## Approximations and limits

* Facade detail is read from photographs and is not a survey: window sizes, bay pitch, floor pitch, the base
  height and the cornice profiles are plausible, not counted. Ornament (carved cartouches, balusters, dentils, the
  flags over the entrance, lamp standards) and the base's rustication are absent: the base reads heavy through the
  dark band and the stone colour only.
* The eight-storey 1914 building and its 1929 additions are not distinguished: the shaft is one continuous brick
  facade, as it is today.
* The 1930s cupola on the old postcards is gone; the roof here is the OSM penthouse with a plain slate mansard.
* The 9 Avenue podium is mapped at one level; the arched loggia above it is drawn on the block behind, as in the
  photographs. The east skybridge parts (OSM ways 1502697850 to 1502697852, 1502697857) and the Tower parkade
  belong to the provider.
* The canopy is a rigid dark-teal slab with a lamp row; its curved ironwork and glazing are not modelled.

## Cityscape and Full 3D world

Cityscape: **not tested yet, integration is checked separately.** Full 3D world: **not tested yet, integration is
checked separately.** Downtown Calgary is nearly flat under the footprint (the Bow River bank is 400 m to the
north), so no `terrainPad` is declared and `padM` is 54 m, just covering the hotel (the farthest corner is
46 m from the origin). The model is a rigid structure on local y = 0; in Full 3D world the default pad takes the
lowest DEM sample under its disc, so the hotel should sit at the street level of its lowest corner with a few
decimetres of the ground showing at the others; check in the app.

## Costs

| | triangles | draws | bytes |
| --- | --- | --- | --- |
| near | 10,003 | 11 | 500 KB (512,064 B) |
| far | 2,283 | 8 | 114 KB (116,972 B) |

First pass: 9,747 / 11 / 492 KB near and 1,833 / 8 / 96 KB far. The review fix added about 450 triangles of cornice
(near and far) and removed 194 from the sign.

Budget (building): near 60,000 / 14 / 2.5 MB, far 12,000 / 8 / 500 KB. Cost reference: the Fairmont Royal York
(near 44,634 / far 5,665 triangles) on the Toronto budgets.

## Verification evidence

* `node --test src/peregrine/landmarks/calgary/fairmont-palliser/fairmont-palliser.test.js` pins what makes this the
  Palliser: 60 m to the penthouse roof; the 70 m front on 9 Avenue; stepped roofs at 48.7 / 52.5 / 56.2 / 60 m, the
  2-storey courts and the 1-level podium by raycast from above; stone to the 11 m belt and brick above; a cornice
  1.3 m proud of the wall with an attic row above it; the window bays and their count on a wall; the entrance
  (glazed door set back, canopy reaching past the podium front, lamp row, loggia lights); the sign in the `sign`
  material on the slate slope; footprint containment; and the far LOD's bounds, roofs and cornice.
* Screenshots judged (`tmp/calgary/shots/fairmont-palliser/`, procedural source and exported GLB): overview, facade
  (9 Avenue), roof, entrance, sign, north, east and west contact sheet in near / light; the same four of five views
  in far / light and near / dark; a plan view; a street-level view at 100 m; close-ups of the entrance, the south
  west corner, the cornices and the sign. What looking changed: the first sheet showed the canopy too small and
  thin (widened to 10 m, thickened); the far model's lit slots were full-height stripes (cut into three-storey
  blocks); the bays were too sparse against the photographs (3.1 m to 2.75 m); the sign lettering floated 0.18 m
  off the slate (now raised bars standing on it); balconettes and quoins were added.
* `pnpm build:calgary-landmarks fairmont-palliser --no-check`; the shared `calgary.test.js` conformance checks for this
  landmark (spec, palettes, footprints, budgets, exported GLBs against the manifest and the catalog record) pass.
  `qa-metrics.mjs` on the exported GLBs: no budget issue, no coplanar overlap, 1.1 % back-face hits in 440 outside-in
  rays (the shared script could not load the whole catalog while other landmarks were mid-edit, so it was run on a copy
  that reads only these two GLBs). The first run found 219 coplanar pairs of `stone` surrounds on the `panel` spandrel
  (79 m²); the panel now stands 0.06 m off the wall and the surrounds 0.12 m.

### Review fix pass (2026-10-02, independent review: PASS-WITH-NITS, recognisability 3/5)

The review found a facade that read as a uniform window grid in cream-yellow stone. Changed: the roofline cornice
(1 m, stepped, with the parapet on it) and the 1.9 m dark base band; `stone` `#d8cfbb` to `#bdb6a8` (desaturated and
about 12 % darker; the night value `#8c8676` to `#7a766b`) and, as a judgment call because the brick shaft is the
dominant surface in every render, `brick` `#bfae8d` to `#b8ab92` (about 5 % less saturated); the sign kept, recoloured
from amber `#e0b64d` to pale grey `#c9cac6` by day (the night colour stays warm) and halved from 380 to 186
triangles; far window slots thinned from 2.1 to 1.0 m. `qa-metrics` after the pass: 10,003 / 11 / 500 KB near and
2,283 / 8 / 114 KB far, no budget issue, 0 coplanar pairs, 1.4 % back-face hits in 440 rays (1.1 % before; under the
2 % limit). One contact sheet was read: the cornice, grey-buff base and thinner far slots show, and the sign is a pale
inscription on the slate. The sign test now expects 120 to 230 triangles; new tests pin the cornice
(1.0 m shelf, 0.45 m step, 0.3 m parapet), the dark band (below 1.9 m only), the pale-grey sign and the near/far
window coverage (within 20 to 25 %).
