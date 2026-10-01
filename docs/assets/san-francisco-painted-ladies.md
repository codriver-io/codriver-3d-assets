# Painted Ladies (Postcard Row), 710–722 Steiner Street

Landmark id `painted-ladies` · source `src/peregrine/landmarks/san-francisco/painted-ladies/` · contract [3d-san-francisco-landmarks.md](../san-francisco-landmarks.md).

## What is modelled

The seven houses on the east side of Steiner Street facing Alamo Square, as they stand today: the six gabled "Painted Ladies" **710, 712, 714, 716, 718, 720** (built 1892–1896 by developer Matthew Kavanaugh, "Postcard Row", the "Seven Sisters") and the hipped corner mansion **722** (Kavanaugh's own 1892 house). Each house is its own mapped outline, paint scheme (body colour plus contrasting accent trim) and bay/porch arrangement. The fronts face **west by south** (compass bearing 261°): the Steiner Street grid is rotated 9.05° from north, so the model is built in a street frame (`u` along Steiner toward the south, `w` toward the park) and rotated into model metres once, inside the geometry. The apartment house at 700 Steiner, the Hayes/Grove Street buildings and 650–655 Steiner are *not* part of the model and stay provider extrusions. The trees in front, cars and sidewalks are not modelled.

Note: the brief said the fronts face east; the OSM outlines, the street numbering and every photograph (the downtown skyline stands behind the row) show they face west toward the park, which lies west of Steiner.

## Sources

| Fact | Value | Source |
| --- | --- | --- |
| Outlines | 7 rings, OSM ways 261412887 (722), 261412899 (720), 261412879 (718), 261412894 (716), 261412900 (714), 261412895 (712), 261412896 (710) | OpenStreetMap, ODbL; read 2026-10-01 via the shared Overpass queue (the same geometry was cross-read once from the OSM map API for a 130 m bbox while the queue was busy) |
| Heights | 12 m (gabled), 13 m (722 hipped); `roof:height` 3 m / 4 m; roof shapes gabled / hipped | OSM tags |
| Dates, row name, 710–720 + 722 | built 1892–1896 by Matthew Kavanaugh | [Wikipedia, Painted ladies](https://en.wikipedia.org/wiki/Painted_ladies) |
| Row length / house width / depth | 52.5 m / 6.2–7.0 m (722: 9.1 m) / 15–16.5 m | measured on the OSM rings |
| Street grid rotation | 9.05° (front edges of all seven outlines, 8.97–9.2°) | measured on the OSM rings |
| Storeys, layout, colours, gable ornament | garage level, two painted storeys, attic gable | photographs (see Provenance in the catalog record) |

## Dimensions

| Quantity | Model | Basis |
| --- | --- | --- |
| Ridge, 710–720 | 12.5 m above each house's terrace | OSM 12 m; photographs give ~12.5–13 m above the sidewalk (estimate) |
| Ridge, 722 | 13.0 m | OSM 13 m |
| Garage level / floor 1 / floor 2 / eave | 2.7 / 5.65 / 8.9 m above the street level of the house | estimated from photographs, ±0.3 m |
| Gable | 3.45 m rise over 6.2–6.9 m width, 47° pitch | estimated |
| Canted bay | 3.95 m wide at the wall, 0.95 m deep, two storeys (720, 716, 710) | estimated |
| Entry stair | 1.1 m wide, 13 steps, 2.6 m past the mapped line | estimated |
| Row steps | 0.25 m per house toward the south, 1.5 m in all | estimated from roofline stepping in photographs |
| Overall | 24.7 × 15.1 × 54.3 m (E–W × height × N–S, including stairs and chimneys) | model |

Sourced: footprints, row length, 12/13 m heights, orientation. Estimated: everything else, including the stepping and each house's bay/porch layout.

## Frame and datum

Real metres, +X east, +Y up, +Z south around `SPEC.origin` (the area centroid of the seven outlines). `y = 0` is the local flat-map grade at the lowest house (722). The street rises toward the south, so each house stands on its own stucco terrace (`yb` = 0, 0.25, … 1.5 m) whose foundation reaches `y = 0`; nothing hangs below grade and no terrain is baked in. Rotation is baked into the geometry; the red footprint rings in the top view agree with the model.

## Materials (13 near, 8 far) and paint schemes

`navy` (722), `sage` (720), `celadon` (718), `yellow` (716), `rose` (714), `blue` (712), `cream` (710), `brick` (the red gable panels of 716 and the rust roof of 714), `trim` (cream-white paint), `roof`, `base` (stucco terraces, stairs, chimneys), `glass`, `glow` (lit windows, unshaded at night). Each house's accent trim (cornice frieze, brackets, base and belt mouldings, balcony deck or canopy, window hoods and sills) and gable panels reuse these materials, so the schemes add no draw call and no vertex colours (the app's building layer overwrites the `color` attribute): 722 navy + `blue`; 720 olive `sage` + dark `roof` trim, `rose` corner panels; 718 grey-green `celadon` + `cream` gable + `rose` trim; 716 `yellow` + `brick`; 714 `rose` + `cream`, `brick` roof; 712 `blue` + `navy`; 710 `cream` + `sage`. Window frames, mullions, columns, balusters, rake boards and stair rails stay `trim`. Far merges `celadon` into `blue` (cool grey-green, so 718 does not read as 720's olive), `brick` into `rose`, `cream` and `base` into `trim`, unlit `glass` into `roof`; `glow` stays, so lamplit windows survive in the far model. Light and dark palettes carry the same keys.

## Modelling decisions

* Each house is a closed shell on its mapped rectangle: terrace, painted walls, a hollow A-section roof (so the rake overhangs and the gable wall shows in body colour), barge boards, finial, chimney, rear gable and rear windows.
* **Fronts:** attic window and two corner panels in the gable; bracketed frieze; either a two-storey canted bay (720, 716, 710: base moulding, belt course, frieze ring, three windows a floor) beside a canopied entry, or a flat second storey with three windows over a columned porch with a balustraded balcony (718, 714, 712). Windows are a trim frame with a recessed pane, mullion and transom, plus an accent sill and hood, built from visible faces only (about 50 triangles each; about 40 % of the panes are `glow`). Entry doors, garage doors with glazing strip, and an open stair: two stringer beams on thin posts with thin treads, rails and newel posts.
* **722:** hip roof with ridge cap and two chimneys, a one-storey square bay with a balustraded roof, a two-storey canted bay, entry between them, windows on the north flank. Its body follows the mapped outline, which is 0.85 m narrower at the south front.
* Repeated geometry (windows, balusters, treads) is merged per material and built from the faces that can be seen: boxes drop their back (on the wall plane), bottom (on the ground or a rail) and top (between rails) faces, quads are indexed. This took the near model from 13 330 to 10 160 triangles and `trim` from 9.7 k to about 5.5 k.
* Far LOD keeps every outline, gable, bay, stair, chimney and finial (same bounding box within 0.15 m) and drops mouldings, balusters, mullions and rear detail.
* Same-facing coplanar overlaps were hunted with a throwaway script (`tmp/.../zfight.mjs`): remaining reports are inward-facing faces hidden inside walls.

## Approximations and weaknesses

* Per-house layouts (bay vs balcony, which side the entry is on, gable ornament) are a plausible reading of the photographs, not a survey; 720's and 718's fronts are the least certain (trees hide them).
* Roofs behind the gables are single gables/hips; the real roofs have cross gables and dormers. Rear and side walls are plain.
* Decorative trim is suggested (brackets, hoods, panels), not reproduced; paint colours are reduced to 13 named materials, so adjacent greens share one hue.
* The 1.5 m terrace stepping is estimated and visible as a stucco plinth under the garage doors of the southern houses.
* 718 is 0.3 m wider at the back than its outline (the outline widens behind a notch); stairs lie outside the outlines by design.

## Costs

Near 10 160 triangles / 13 draws / 561 KB; far 2 506 triangles / 8 draws / 151 KB (budget 60 000 / 14 / 2.5 MB and 12 000 / 8 / 500 KB). Desktop numbers only; no in-car benchmark.

## Verification (inspector renders, 1280×800, headless Chromium)

Procedural and exported GLB, near and far, light and dark, in `tmp/san-francisco/shots/painted-ladies/`:
`painted-ladies-glb-near-light-{postcard,overview,facade,gables,roof}.png`, `painted-ladies-glb-near-dark-postcard.png`, `painted-ladies-glb-far-light-{postcard,overview}.png`, `painted-ladies-glb-far-dark-postcard.png`, `painted-ladies-glb-near-light-mansionglb.png`, `painted-ladies-glb-near-dark-{overview,north}.png`, `painted-ladies-glb-far-dark-{overview,facade,north}.png`, `painted-ladies-procedural-near-light-{overview,facade,gables,bay,roof,north,rear,street100,southback,under,mansion}.png`, `painted-ladies-procedural-far-light-{overview,facade,far800}.png`, plus the plan view.

Compared with the Highsmith (LoC), Rabich and Another Believer photographs: the row of seven gables with bays in pastel colours, the navy hipped 722 at the north end and the climbing roofline read the same at 100 m and 800 m. Fix round after the independent review (PASS-WITH-NITS, recognisability 5/5): per-house accent trim and a more distinct 720/718, visible-faces-only windows and balusters, open stringer-and-tread stairs; a `postcard` inspector view was added. Changes made after looking in the first round: foundation walls recoloured from stucco to the house paint (the beige podium dominated the 100 m view); the 714 roof from a bright sunlit orange to a darker rust; window hoods attached to their backing boards (they floated 3 cm); solid balcony end panels replaced by real balustrades; coplanar trims separated; zero-area cap triangles removed; 722's body pulled in to its mapped outline; far lit windows kept.

Tests: `node --test src/peregrine/landmarks/san-francisco/painted-ladies/painted-ladies.test.js` (≈1 s): per-house accent and gable colours by raycast, a cost ceiling, an open stair, outlines, bearing, row length, ridge heights and stepping, gable pitch, bays/balconies/doors/attic windows by raycast, paint by raycast, closed shells and stairs, containment in the outlines, palette keys, extruder winding, exported GLB agreement.

## Integration

Cityscape: not tested yet, integration is checked separately. Full 3D world: not tested yet, integration is checked separately (the row is a rigid structure on local `y = 0` with `padM` 34 m; the 1.5 m terrace stepping is the only relief it carries).
