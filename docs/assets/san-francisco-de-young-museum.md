# de Young Museum (San Francisco)

`de-young-museum` · Herzog & de Meuron with Fong + Chan Architects, opened 15 October 2005 · 50 Hagiwara Tea Garden Drive, Golden Gate Park. Part of the [San Francisco landmarks](../san-francisco-landmarks.md); source in `src/peregrine/landmarks/san-francisco/de-young-museum/`.

## Identity and state modelled

The 2005 building as it stands today: a long, low box clad in perforated and dimpled copper, now weathered to a dark brown with green tints; courtyards and gardens cut through it (five holes in OSM, four courts here); its upper volume cantilevered deeply over a recessed, glazed entrance front facing the Music Concourse; and the Hamon Observation Tower (144 ft, nine storeys) at the north-east end. Recognisable at 800 m by the twisting tower above the park, at 100 m by the dark skin and the cantilever. The Music Concourse, the California Academy of Sciences and the Japanese Tea Garden are neighbours and not modelled. The 1895-1989 predecessor buildings are gone and not relevant.

## Sources

| Source | Used for |
| --- | --- |
| OSM relation 1652482 (`building=museum`, `height=13`), outer ways 23867087 + 888799026 | roof outline, bearing, the 13 m roof |
| the relation's inner ways 120480154, 120480157, 888799028, 120480162, 444230153 | the courtyards (the two that share an edge are one court) |
| OSM way 444230154 and building:parts 1418750068-73, 1418972816-17 | tower outline and the eight slab plans (13-51 m) |
| Wikipedia, de Young Museum | 144 ft tower, nine storeys, 15,154 m2 of copper, 2005 opening, copper expected to green |
| Wikimedia Commons photographs (see the catalog provenance) | cantilever, glazing, tower faces, colour: viewed in `tmp/`, not redistributed |

## Dimensions

| Dimension | Value | Basis |
| --- | --- | --- |
| Roof outline | 145 x 76 m, long axis bearing 48 deg (north-east), entrance front facing 138 deg | sourced: OSM outline, two long edges (-41.9 deg from east) |
| Roof height | 13 m | sourced: OSM `height=13`; checked against photographs (about 12-13 m) |
| Courtyards | 4 cut-outs (about 285, 330, 340, 290 m2) | sourced: OSM inner ways |
| Tower height | 44 m (144 ft) | sourced: published figure; OSM stacks its slabs to 51 m, rejected (see below); trunk 13-34.5 m (six storeys of 3.6 m), glazed level 34.5-37 m, lid 37-44 m |
| Tower slabs | eight in OSM (six trunk slabs, glazed level, lid); the six trunk plans keep their order and are spread over 13-34.5 m | slab plans sourced; heights are a decision |
| Tower plan | about 9 x 28 m at the foot, the long faces swinging about 31 deg to about 9 x 33 m under the lid; short faces parallel to the museum throughout; plan area about 254 m2 | sourced: the OSM slab quads (a shear-twist, not a rotation of a rigid rectangle) |
| Observation level / lid | glazed level 31.5 x 8 m (34.5-37 m), lid 33 x 10 m, 7 m deep (37-44 m) | plan sourced (OSM 43-46 and 46-51 m parts); heights re-cut after review: photographs show a deep lid |
| Soffit height / cantilever depth / extent | 6 m / 6 m / 118 m of the 145 m front (u -58 to 60 m), with a 1 m fascia lip standing 0.3 m proud | estimated from photographs |
| Glazing | the whole recessed wall is dark glass (5.4 m high) with mullions every 3.4 m; entrance doors 14 m and cafe window 18 m lit; slit window 2 x 8.5 m, north-west portal 14 m | estimated from photographs |

The tower height discrepancy: OSM's stacked parts give 13 + 38 = 51 m. The museum and Wikipedia say 144 ft (43.9 m), and the photographs agree (measured by eye on the Fastily 2017-04-01 view, the tower rises about 30 m above the roof, so 13 + 31 = 44 m), so 44 m is used and the slab heights are scaled.

## Materials

Eleven names, same keys in light and dark: `copper`, `copperWarm` and `copperDark` (the base tone and the two bay tones, within about 8% of each other; `copperDark` is also the joint colour behind the tiles), `roof`, `roofPanel`, `roofPatina` (darker on purpose: up-facing faces catch the sun), `soffit` (soffit and fascia lip), `tower` (the mesh-covered trunk and lid: a copper-grey close to the body, lightened about 20% toward the copper after the second review), `towerRib` (storey ribs, stair flights, mullions of the glazed level; in far the alternate storey bands), `glass`, `glow` (entrance, cafe and observation level: reads as dark glass by day, lit at night). Far folds `soffit` into `copperDark`, drops `copperWarm` and the roof patches: seven draws. The dark walls were lifted about 25% after review.

## Modelling decisions

- The plan is authored in the building frame (u along the museum, v across it) and rotated once (41.9 deg) into +X east / +Z south, so the orientation on the mapped footprint is baked in. Origin: the area centroid of the outline. `y = 0` is the plaza/garden level.
- Silhouette first: the box with its four cut-out courtyards (walls run to the ground, so they read as negative space at any distance), the recessed ground floor under the overhanging upper volume with its soffit, and the tower.
- The tower is a loft: rings at the six storeys, corners interpolated linearly, the long (warped) faces cut into six columns and each storey into two rows so that no big non-planar quad is split across one diagonal (the first version's dark zig-zag triangles), sealed by a ledge, the mullioned glazed level and a 7 m lid. Storey ribs (0.3 m belts) round all four faces and a zig-zag of stair flights up the north-east long face were added from the photographs; far keeps the twist legible at 800 m with alternating storey bands and a three-column long face. The photographs show the same thing: a narrow foot, long faces that swing and make the creases at each slab, and a lid that overhangs. The first version used rotated rectangles; reading the slab corners showed the real plan is a shear-twist (short faces fixed, long faces swinging), which also made the tower fit the mapped footprint exactly.
- The copper is a calm mauve-brown: bays about 6.8 m wide and 6.5 m tall whose tone varies about 8% from one bay to the next (dark, base, warm), each bay four joint-lined tiles about 3.4 x 3.2 m standing 0.15 m off a darker wall. The isolated green tiles of the first two versions read as stickers and were dropped; the only green left is the sparse roof patches. The first version (3.4 x 1.8 m tiles with large tone steps and 8-10% grey-green tiles) read as pixel camouflage in review. The perforations and dimples are not geometry. No tile overlaps another or a glazing quad; roof patches (8 m, a few tones) avoid the courtyards and the tower foot.
- The cantilever: the recessed ground floor is one dark glass wall (lit doors and cafe window in it) with mullions every 3.4 m and a transom, under a dark soffit and a 1 m fascia lip, and the overhang runs to u = -58 m. At 100 m it now reads as a long dark band under the copper volume (before: a 3 px line).
- Two slit windows on the long faces of the tower trunk are cut into the loft as glass strips, not overlays.
- The tower slab plans are the exact OSM quads; only their heights are re-cut (OSM has them spread 13-43 m under a 5 m lid, which the published 144 ft and the photographs reject).
- Far: same outline, courtyards, soffit and fascia lip, glazing blocks, twisting loft (seven rings, storey bands), glazed level and lid; coarse 11 x 6.5 m bays; no mullions, ribs, stairs, slits or roof patches.

## Approximations and what is missing

Colours are a weathered mauve-brown (the museum photographs show it in sun, near black in shade), not the freshly installed copper. Tiles are tone only: no dimple relief, no perforation shadow. The tower's stair flights are thin diagonal bars on one long face with the ribs as landings, not the real steel-mesh gantries and corner frames; the lid overhangs the glazing by about 1 m only (OSM), less than the gantry frames suggest in photographs. The roof is flat at 13 m (the photographs show it flat). Trees, the Music Concourse and the Japanese Tea Garden are not modelled. The Three Gems skyspace and the interior are not modelled. The cantilever and glazing positions are estimated; the NE end notch is the mapped one.

## Cost

Near 2,723 triangles, 11 draws, about 218 KB. Far 495 triangles, 7 draws, about 45 KB (budgets: 60 000 / 14 / 2.5 MB and 12 000 / 8 / 500 KB). Far is about a fifth of near in triangles and keeps the bounding box to within 0.5 m on every axis. (Before the fix round: 2,513 / 11 / 202 KB and 357 / 7 / 34 KB.)

## Verification evidence

Looked at, procedural source and the exported GLBs (`tmp/san-francisco/shots/de-young-museum/`): top view with the red OSM rings; overview, facade, entrance, roof, tower, rear and street-level (1.7 m, about 100 m) views in near/light; the same in near/dark; far/light and far/dark overview, roof and an 800 m (fov 20) comparison; the exported GLB near/light and dark overview, facade, tower and rear, and far/dark overview and roof. Compared against Tuxyso's 2013 front view, an entrance-facade view, Fastily's 2017 views from the Concourse and the north-east, and BrokenSphere's and Kleinlercher's tower views.

What the renders changed:

1. The first top view and facade showed no recess or glazing: the loop that split the front edge ran on the wrong outline edge (it treated the south-west end as the front). Fixed by matching the edge on its v coordinate.
2. The first palette read as salmon pink on top-facing surfaces and as a pixel camouflage: roof got its own darker materials, wall panels became 3.4 m courses with less contrast and a rarer green tint.
3. The soffit rendered pure black (down-facing, near-zero albedo): lifted to a dark brown so the cantilever reads as an underside.
4. The tower first looked like a slim leaning blade: reading the OSM slab corners showed the plan is a shear-twist, and the V-shaped taper seen from the Concourse side, the creases and the lid then matched the photographs.
5. Containment against the OSM rings found the cap corner 2.5 m outside and the front-right corner 0.9 m outside: the tower now uses the mapped quads and the front line moved to v = 38.0 m.
6. Dark palette brightened (night walls had gone black); glow dimmed.

`node --test` on `san-francisco.test.js` and `de-young-museum.test.js` pins: 44 m top and 13 m roof, 145 x 76 m box and its bearing, every vertex inside the mapped rings (0.8 m slack), courtyards open in near and far, soffit at 6 m with the ground floor recessed 6 m behind the roof edge and the end bays flush, entrance doors lit and storefront glass, a 31 deg tower twist and a 9 to 25 m growth in plan span, the lid overhanging the roof end by more than 10 m over a glazed level, no zero-area triangles, far silhouette and draw budget.

## Fix round (independent review: FIX, art pass 3/5)

Review findings and what changed, each checked in new renders (procedural and exported GLB: 100 m street view and 800 m view in near and far, tower, entrance, dark street and rear):

1. Skin read as pixel camouflage: now bay-level tone steps of about 8%, joint-lined tiles, no isolated green tiles (patina dropped from the walls in the polish pass); palette mauve-brown; dark theme walls lifted about 25%.
2. Cantilever was a 3 px line at 100 m: dark glass wall with mullions every 3.4 m, a darker soffit, a 1 m fascia lip, and the overhang extended from u = -46 to -58 m.
3. Tower: lid thickened from 4 m to 7 m (trunk 13-34.5 m, glazed level 2.5 m, lid 37-44 m); storey ribs on all four faces; zig-zag stair flights; mullioned glazed level; the loft's long faces cut into columns so the dark zig-zag triangles are gone; far keeps the twist legible at 800 m with alternating storey bands.

Tests added: lid depth, storey ribs, mullions and stairs, far storey bands, 30-40 mullions along the recessed wall and an all-glass ground floor, the fascia lip proud of the wall, the soffit reaching u = -55, tone spread within 11% of the base copper, no wall patina, the tower within about 20% of the copper's brightness in both palettes, the night copper at least 80% of day copper.

## Polish pass (re-review: PASS-WITH-NITS, 4/5)

The `tower` material read near-black olive against the warm copper: lightened about 20% and nudged toward the copper in both palettes (`#443f39` to `#554b45` light, `#403a35` to `#51453f` dark; `towerRib` lightened to stay distinct). The wall `patina` tiles that read as stickers were removed (the material is gone from the palettes). Checked in the exported 100 m street and tower views.

## Integration

Cityscape (flat ground reference): not tested yet; integration is checked separately. Full 3D world (topography): not tested yet. The museum is a rigid structure on local `y = 0`; the terrain pad (`padM` 96 m) covers the outline, the tower overhang and the entrance forecourt. The Music Concourse in front is a sunken oval and is not modelled; no relief is baked in.
