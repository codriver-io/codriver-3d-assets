# Puerta de Alcalá

Asset `puerta-de-alcala`, Plaza de la Independencia, Madrid. Francesco Sabatini's gate for Charles III,
built 1769–1778, as it stands after the 2022–2023 restoration. Original procedural model. Contract:
[3d-top-cities-landmarks.md](../top-cities-landmarks.md). No scan, traced mesh, photograph or texture is
in the repository or the GLBs.

## Identity and what a driver sees

From Calle de Alcalá at about 100 m, looking west: a grey granite triumphal arch, five openings (a wide
central arch, two side arches, two rectangular doors), fluted Ionic columns in pairs beside the centre
and singly beside the side arches, a white tablet reading REGE CAROLO III / ANNO / MDCCLXXVIII, a
triangular pediment, and military trophies along the attic. From the city side the wall is smooth, round
columns stand only beside the central arch, and the tablet is a blank cartouche. From 800 m the silhouette
is the long cornice, the higher central attic and pediment, and the sculpture tip.

## Sources and dimension table

| Feature | Value | Basis |
| --- | --- | --- |
| Tip height | 23.79 m, model apex 23.79 m | Ayuntamiento restoration survey (includes the sculpture). Wikipedia's 19.50 m is the lower figure. OSM `height` on way 174805987 is 21.946 m |
| Width | published anchura 43.07 m (Wikipedia 43 m). Model wall 42.30 m | Restoration survey. The mapped outline is chamfered, so a 43.07 m rectangle would leave the footprint |
| Depth | published 11.74 m. Model nose-to-nose about 11.1 m | Restoration survey. The 7.0 m body is the wall; the extra depth is the central pedestals |
| Openings | doors 6.10 m (survey). Model spring 10.05 m, side crown 12.63 m, central crown 13.35 m | Survey side opening is 9.28 m. Keeping that crown under the OSM cornice left a blank belt the elevation does not show. The model arches are semicircles on one spring, with the central crown just under the architrave |
| Cornice / attic | cornice top 16.60 m; side attic 18.20 m; pediment base 19.72 m, apex 22.62 m; tip 23.79 m | OSM parts put a cornice near 15.24 m and a central block at 20.1 m. The model cornice is higher so the order, not the attic, is the mass. Above the cornice is 7.19 m, 30% of the tip |
| Plan | along-axis bearing 170.4°, through-axis (east front) 80.4°. Origin is the vertex centroid of way 174805987 | OSM way 174805987 and parts 323039763, 323039764, 323039766, 323039769, 323039771, 323039772 |
| Materials | Segovia granite mass; Colmenar limestone tablet and sculpture | Wikipedia / the restoration account of Gutiérrez and Michel's stone |

## Frame, origin and orientation

Real metres, +X east, +Y up, +Z south. The gate is authored in its own plan (s along the facades toward
south, t through the arches toward the inscribed east front) and baked with that frame. `y = 0` is the
plaza grade. Nothing is baked for terrain or sea level. `padM` 30 m covers the outline (about 22 m out).
The circle is level, so there is no `terrainPad`.

Cityscape and Full 3D world: not tested yet, integration is checked separately. On Full 3D world the
plaza should stay near one grade; the model does not carry a hillside pad.

## Materials

Three named materials, same keys in light and dark: `granite` (Segovia grey `#9c978c`, night `#6a655c`),
`graniteDark` (rustication, the recessed frieze, relief fields, the tympanum and the cut letters), `limestone` (the east tablet and the sculpture only). Night
is warm floodlighting on the stone, not an event wash. The far model folds `graniteDark` into `granite`,
so it draws two materials. No unshaded lamp.

## Modelling decisions

- One pierced extrusion is the whole passage: three semicircular arches and two rectangular doors, so a
  ray through an opening misses both fronts. The wall stops at the architrave. Columns, east and west,
  run up to that line.
- East carries eight fluted Ionic columns. The four beside the central arch stand on the mapped pedestal
  bulge. The side and corner columns are engaged, because the outline is straight there. West has four
  smooth columns on that same bulge and pilasters everywhere else.
- The inscription is block-letter geometry on a framed east tablet, with pilasters beside it. Far keeps
  the blank tablet. The west attic is a darker cartouche, not a second inscription.
- Door and side-arch reliefs are recessed granite panels with a darker field. They are not limestone.
- The attic is a closed stone roof: flat caps on the wings, a taller central block, then one pediment
  that projects about 0.85 m past each attic face, with a darker tympanum. Each front carries a stacked
  coat of arms (narrow shield, two supporters, slope trophies, crown) whose finial is the 23.79 m tip,
  plus trophy piles and end-pier flames. The same masses are on both LODs. Far keeps the projecting
  Ionic pairs and the two round columns beside the west central arch.

## Approximations and what is not modelled

Column diameters, the Ionic volutes, archivolt profiles, keystone masks, door and spandrel plaques, and
the sculpture are block masses read from photographs, not surveyed carving. The end piers are the solid
wall the outline allows; they read heavier than the real ashlar. Rustication is a joint line, not a
drafted block. Arch crowns follow the photographed order (central crown at 80% of the cornice height);
they are not the survey's 9.28 m side opening. A semicircular arch of this width cannot also put the
impost at 45% of the cornice and the attic at 25% of the tip, so the impost sits at 10.05 m (61% of the
cornice) and the attic-to-tip band is 30%. The WorldPride rainbow lighting is not the model.
Coffers inside the arches, the iron fence and the garden are not modelled.

## Costs (exported)

| | triangles | draw calls | bytes |
| --- | --- | --- | --- |
| near | 6 936 | 3 | 354 KB (362 640 bytes) |
| far | 2 436 | 2 | 124 KB (126 764 bytes) |

Budget for a building: near ≤ 60 000 / 14 / 2.5 MB, far ≤ 12 000 / 8 / 500 KB. Far bounds match near.

## Verification

Compared the procedural contact sheet and the exported GLBs with Diego Delso's east elevation (Commons
DD 14) and pediment (DD 13), Fernando Pascullo's 2025 view, and kallerna's oblique. The first sheet had
the inscription mirrored and the two stone colours too close; letters now read REGE CAROLO III / ANNO /
MDCCLXXVIII from the east, the tablet is limestone on darker granite, and the west front has no
inscription and columns only at the centre. A later review sheet showed the arches stopped under a tall
blank belt, a shallow pediment and white relief patches. The arches and column shafts now meet the
architrave, the pediment projects with a dark tympanum, the crest is a narrow stacked shield, and the
reliefs are stone-coloured frames. Checked on `tmp/top-cities/review/puerta-de-alcala/puerta-de-alcala.jpg`
(near and far, both fronts). qa-metrics reports no issue: coplanar pairs 0, back-face hits 0. The plan
view sits inside the red OSM rings. Shots: `tmp/top-cities/shots/puerta-de-alcala/`.
