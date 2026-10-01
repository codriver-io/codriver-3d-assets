# Palace of Fine Arts

Asset `palace-of-fine-arts`, 3601 Lyon Street, Marina District, San Francisco. Original procedural model of the
monument as it stands in 2026: Bernard Maybeck's 1915 Panama-Pacific Exposition rotunda and colonnades, rebuilt in
concrete 1964-1974, with the curved exhibition hall (the theatre and former Exploratorium) behind. Contract:
[3d-san-francisco-landmarks.md](../san-francisco-landmarks.md). No scan, traced mesh, photograph or texture is in the
repository or the GLBs. The lagoon is not modelled.

## Identity and what a driver sees

From the lagoon side at 100 m: a pale ochre-salmon, open octagonal rotunda 49 m high, eight tall round arches you can see
through, paired fluted Corinthian columns on eight corner piers, a heavy cornice, a low attic of relief panels, and a
round drum carrying a steep pale dome; either side two curving colonnades of paired columns, interrupted every ~22 m by a pylon, a box with
relief panels and a weeping-woman figure at each corner; behind, a long grey shed curving around the rotunda. From 800 m
the silhouette is the low dome on the arched drum with the two open, pylon-studded arms and the hall behind them.

## Sources and dimension table

| Feature | Value | Basis |
| --- | --- | --- |
| Total height | 49.4 m (162 ft); model apex 49.40 m | NRHP / Wikipedia (162 ft); OSM says 48 m (outline) and 51 m (dome part) |
| Rotunda axis | arches at 10 deg + k x 45 deg (front arch bearing 80 deg) | notch centres of OSM way 288371295 fold to 9.2 deg; eight mapped piers at 32.5 deg +- 4; colonnade arms and hall end blocks mirror about it |
| Piers | 8 corner piers, ~25 m from the axis, 36 m (to the entablature + attic block) | OSM `building:part=column` ways 1549377328..345 |
| Arch wall plane | 22.4 m from the axis (notch backs r = 22.2-22.8) | OSM way 288371295 |
| Dome | circle of 16.2 m radius, centre = model origin; steep squashed-superellipse dome, base 41 m, crown 49.4 m | OSM part 456820271; profile estimated |
| Attic, round drum, entablature | entablature ring 25-35 m (model: to 32.4 m); octagonal attic to 36.8 m, round drum (r 17 m) to 40.2 m | OSM parts 456820274 (min 25 / height 40) and 1549377350; the attic is kept low so the dome and drum rise ~25% of the height above its cornice, as in the evening photograph |
| Column pairs (rotunda) | 2 x 2.8 m diameter, ~20 m shafts, capital top 27.2 m, arch crown 25.7 m, arch 11.8 m wide | estimated from photographs (Commons front view scaled to 49.4 m) |
| Hall | sector about a point 59 m east, 12 m eaves, 15 m ridge, a 7-8 m monitor to 17 m, end blocks 17 m; inner radius ~112-116 m, outer ~154-158 m | OSM way 288371302 and parts 1550664400 / 1550664399 / 1550664397 / 1550664401 (`height` includes `roof:height`, so walls are 12 m) |
| Colonnade strips | 3.0-3.1 m wide entablature, centrelines and pylon bulges (6.5-11.5 m wide, ~22 m apart) as mapped; two arms, an arc then a turn and a straight return | OSM roofs 288371306 (20 m) and 288371310 (19 m) |
| Colonnade columns | **pairs** across the strip, 1.24 m diameter, ~9 m shafts, entablature top 12.6 m, spacing 3.7 m | Commons photographs; no column data in OSM |
| Pylons | cluster of heavy columns carrying a box (12.6-17.2 m) and four figures (to 20-21 m) | OSM roofs 19 / 20 / 21 m; shape from photographs |
| Detached pylons | 2 cross-shaped boxes near the colonnade ends | OSM roofs 288371313 / 288371314 (21 m) |
| Colours | ochre-salmon stone, pale cream dome, grey-beige hall | photographs |

## Frame, origin and orientation

Real metres, +X east, +Y up, +Z south. `origin` is the rotunda centre (the dome circle of OSM part 456820271, mapped
through the same Mercator projection the layer uses). The plan is authored directly in that frame; the building's own axis
(10 deg off east) is carried by the geometry and nothing is rotated afterwards. `y = 0` is ground at the foot of the steps
(a 1.6 m podium, columns on 3.4 m plinths); nothing is baked for terrain, sea level or latitude. `padM` 145 m covers the
hall's far end block (139 m out).

## Materials

Seven named materials, same keys in light and dark: `stone` (peach-salmon `#e2ae83`, dim `#a7896f` at night), `stoneDark`
(attic and pylon panels, soffits), `base` (podium), `dome` (pale cream), `hall` (walls), `roof` (hall roofs), `glow` (the
underside of the rotunda, floodlit at night, drawn unshaded). The far model folds `base`, `stoneDark` and `glow` into
`stone`, so it draws four materials.

## Modelling decisions

- The rotunda is **open**: eight 5 m thick arch walls with real arch holes opposite each other, so the eye passes through
  the front and back arches (asserted by rays in the test). Corner piers carry paired shafts, abaci and a projecting
  entablature; a flat glowing soffit closes the interior.
- Columns are the cost: rotunda shafts are 12-fluted (24-vertex) near and 5-sided far; colonnade shafts 6-sided near (plain), 5-sided
  far; capitals are a flared block plus abacus.
- Colonnades follow the mapped strips: one swept entablature per arm (three stacked layers near, one far), column pairs in
  the free intervals, pylons as clusters of columns under a box. They are open at eye level (rays across the arm slip
  between the pairs, near and far).
- The hall is a ring sector sampled from the mapped outline: 12 m walls, a gable to 15 m, a monitor strip, 17 m end blocks.
- Near adds: archivolts, urns on the attic corners, attic relief panels, plinths, rotunda fluting, dark relief panels and corner
  figures on the pylons. Far drops them; far arches use 8 segments so they stay round.

## Approximations and what is not modelled

Capitals, dentils, the Greek-key frieze, relief and the weeping-woman figures are blocks. The dome has no coffers or
lantern; the interior is a flat soffit. The colonnade double row follows photographs although the mapped roof strip is 3 m
wide (it traces the entablature); the 3.7 m column rhythm is estimated. The hall is a plain shed and its end blocks are flat
boxes (the real U-shaped courts are not modelled). The lagoon, trees, steps down to the water and the stage house are not
modelled. The podium and plinths extend up to ~3.5 m beyond the mapped outline in front of the arches (the OSM outline has
notches there); cornices overhang up to 3.6 m.

## Costs (exported, default scene)

| | triangles | draw calls | bytes |
| --- | --- | --- | --- |
| near | 19 140 | 7 | 1.08 MB |
| far | 5 108 | 4 | 0.29 MB |

Budget (building): near <= 60 000 / 14 / 2.5 MB, far <= 12 000 / 8 / 0.5 MB. Far keeps the near bounding box within 1.5 m on
x and exactly on y and z.

## Verification evidence

Shots live in `tmp/san-francisco/shots/palace-of-fine-arts/` (ignored by git). Compared against Commons photographs in
`tmp/san-francisco/palace-of-fine-arts/refs/` (front panorama, colonnade, evening, two colonnade close-ups, two aerials).

1. `...procedural-near-light-facade.png` and `...-street.png` against the front panorama: first pass had corner groups pushed
   too far out (columns at 28.9 m, plinths to 32.6 m, so the silhouette was 62 m wide against 49 m in the photo), a squat
   attic and heavy piers; moved the columns to 25.6 m, widened the attic, slimmed the piers, widened the arch.
2. `...-corner.png`: a sliver of an arch slab poked into the neighbouring opening; shortened the slabs to 16 m so they end
   inside the piers. Column bases were all placed on the bisector; moved to each shaft.
3. `...-colonnade.png` against the two colonnade close-ups: the first build had a single row of columns and solid pylon
   bodies; the photographs show **pairs** of columns and an open cluster of columns under each pylon box. Rebuilt both.
4. `...-top.png`: the red OSM rings show the colonnade pylons, the hall end blocks and the end pylon off by 1-3 m (stale
   coordinates from a different origin) and the end blocks mirrored; re-derived from the projected polygons. The test now
   checks every vertex against the rings.
5. Exported GLBs rendered with `--source glb` (near light: overview, street, facade, corner, colonnade, rear; far dark:
   overview, street; far light at 800 m): no holes, flipped faces or z-fighting seen.

6. Review fix round (independent review: PASS-WITH-NITS 4/5): the dome read small and was hidden behind the attic corner blocks
   from a low lagoon eye, so the attic was lowered (cornice 36.8 m), a round drum and a steeper dome added (a ray from 1.7 m at
   120 m out now sees the crown and the flank); far arches went from 6 to 8 segments; the stone was lifted and desaturated
   in both palettes; colonnade shafts went to 6 sides (near 23.8k to 19.1k triangles) and far folds three materials (7 to 4
   draws, 6.3k to 5.1k triangles). `...-glb-near-light-street.png` and `...-glb-far-light-street.png` re-rendered and read.

Cityscape and Full 3D world in the running app are **not tested**; integration is checked separately.
