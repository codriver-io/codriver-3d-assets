# Bridge of Peace, Tbilisi

Original procedural, texture-free model of the Bridge of Peace (Mshvidobis khidi), the pedestrian bridge over the Kura (Mtkvari) linking Rike Park with the Old Town. Designed by Michele De Lucchi and opened in May 2010; 150 m long, steel and glass, lit by LEDs. Locals call it the "Always bridge" after the shape of its roof. This is the current structure; no earlier bridge on the site is modelled. Free-standing: no vehicle road layer.

Sources: [Wikipedia](https://en.wikipedia.org/wiki/Bridge_of_Peace) (150 m, architect, Kura crossing, 2010), OSM [roof outline 1207561125](https://www.openstreetmap.org/way/1207561125) and the canopy outline [440933580](https://www.openstreetmap.org/way/440933580), [pedestrian axis 125589004](https://www.openstreetmap.org/way/125589004) / [784030759](https://www.openstreetmap.org/way/784030759) and the four stair ways [77984293](https://www.openstreetmap.org/way/77984293), [1047664365](https://www.openstreetmap.org/way/1047664365), [77984294](https://www.openstreetmap.org/way/77984294), [1047664416](https://www.openstreetmap.org/way/1047664416) (48 steps each). Reference photos, kept only in ignored scratch and used to compare: Vyacheslav Argenberg, *Tbilisi at night, Bridge of Peace, Georgia.jpg* (CC-BY-4.0); ako-aleko, *Mtkvari - panoramio.jpg* (CC BY-SA 3.0); Dudva, *Bridge of Peace, Tbilisi.jpg* (CC-BY-SA-4.0). Licences are those shown on the Commons/Wikipedia file pages. Nothing photographic is shipped.

## What makes it this landmark

A wavy, leaning, glass-roofed lens over a slim deck: sheared elliptical white ribs, a crest tube and a free glazing hem that swings up and down the open south flank (the S-curve visible in every side photo), a diamond lattice that glows green at night, glazing on the long north flank only, two A-frame piers and two V-shaped stair landings.

## Dimensions

| Quantity | Value | Basis |
| --- | --- | --- |
| Length | 149.2 m mapped (roof axis), 150 m published | OSM / Wikipedia |
| Axis bearing | 87.4 deg from north (heading slightly north of east) | OSM roof way, two end nodes |
| Stair feet and apexes | OSM stair ways | OSM |
| Canopy rise above the deck | 15 m at mid-span (+-7 % ripple), tapering to grade at both landings | estimate from photos |
| Overall height above grade | 20.6 m | derived |
| Deck height above flat-map grade | 5.6 m mid-river, ramps 46 m (west) and 40 m (east) to grade | estimate (48-step stairs, photos) |
| Deck width | 7.6 m between parapets mid-river, 4.4 m at the landings | estimate |
| Lean of the crest towards +south | up to 0.63 of the rise, waving along the span | estimate |
| Piers | two A-frames at 38 m and 37 m from the ends, round legs 0.42 m | estimate (two piers per Wikipedia, positions guessed) |
| Stair width / rise | 3.2 m; rise = deck level at the apex, 0.15 m risers | estimate |

## Frame and orientation

Local metres, +x east, +y up, +z south; origin is the middle of the mapped roof axis, `[44.8080558, 41.6929765]` (`[lng, lat]`, the mean of the two roof tips in `bridge-of-peace-tbilisi-parts.js`). The axis is baked in at 87.4 deg; `y = 0` is the flat-map grade of the landings and stair feet. The river is not modelled and no terrain, sea level or latitude stretch is baked in (the Mercator constants are used once, in the parts module). Terrain pad: a 3.2 m disc under each landing, stair foot and pier foot, median datum, 4 m feather. This is declared but not tested in the app.

## Materials

`steel` and `tube` (white painted steel: ribs / crest, hem and edge tubes; two names, one colour, so tests can tell a joint from a support), `deck` (girder), `walk`, `stair`, `glass` (canopy glazing and parapets), `rail`, `glow` (the diamond lattice, self-lit: pale by day, green `#6fe8b6` at night) and `lamp` (warm LED lines under the girder edges). Nine draws in both LODs. The glazing is two thin sheets 4 cm apart (outer facing out, inner facing in), which keeps the roof solid from the road and from beneath and the outside-in back-face sweep at 0 %.

## Modelling decisions

* The canopy is a surface family, not a hand-placed set of bars: `ribPoint(s, u)` gives the centre line of a sheared ellipse at every station, so ribs, longitudinal tubes, the hem, the lattice and the glazing all share exact nodes. Only the part above the deck leans, so both rib feet touch the girder fascia.
* The lattice is a checkerboard of diagonals between neighbouring nodes, producing diamonds; near 48 stations x 18 arc points, far 16 x 10.
* The glazing is inward-offset quads (0.4 m clear of the tubes), double-sided in near, between the hem wave and the north foot. The south flank is left as open lattice, as in the photos.
* The girder is a lofted flat-shaded prism clamped to grade at the landings; faces that collapse there are dropped.
* Stairs are solid single prisms (treads, risers, side walls), 36-ish risers in near and 6-9 in far.
* Parapets are 1.1 m glass with a handrail, interrupted where the four flights come up.

## Approximations and omissions

Deck level, ramp lengths, pier positions, canopy rise/lean/wave and stair width are estimates. The two stair V's use the OSM stairs as written; their lower ends rest on flat-map grade, although the real feet may be at a different level near the quays. The glazing is opaque pale teal (the shared material path has no transparency), whereas the real glass is clear. No escalators, people, boats, lights on poles or river. Underside bracing of the real structure is simplified to the A-frame piers.

## Cost

Near 24,880 triangles / 9 draws / 1,516 KB; far 4,056 triangles / 9 draws / 310 KB (budgets: bridge near 120 k / 40 / 4.5 MB, far 30 k / 10 / 1.2 MB). Bounds in both LODs: x -74.9..74.9, y 0..20.6, z -21.6..17.6 m.

## Verification

Looked at, with the three reference photographs beside them: `tmp/top-cities/shots/bridge-of-peace-tbilisi/` `p1`..`p3` (procedural sheets, three look-fix rounds), `top/` (plan view over the red OSM roof ring), `g-near-light`, `g-near-dark`, `g-far-light`, `g-far-dark` and `f-near-light`, `f-far-dark` (exported GLB: overview, facade, back, roof, deck, underside, detail, stairs). Changes made because of them: the first canopy read as a low closed tube, so the rise went 12 -> 15 m with a fuller envelope, the lean increased, and the free glazing hem with its S-curve was added; the ramps were shortened so the deck no longer looks like a wedge; the glaze "holes" that read as white patches were removed; a rib-foot offset (north feet hanging 0.45 m outside the girder) was found by the joint test and fixed; collapsed girder faces at the landings were dropped (they exported zero-area normals).

`node --test src/peregrine/landmarks/top-cities/top-cities.test.js src/peregrine/landmarks/top-cities/bridge-of-peace-tbilisi/bridge-of-peace-tbilisi.test.js` and `node scripts/asset-catalog.mjs` pass (only another landmark's `library-of-congress-jefferson` tests were red in the shared tree while it was being built); `qa-metrics.mjs --ids bridge-of-peace-tbilisi` reports no coplanar, layered-face or back-face issue, and one far `window-rhythm` candidate that is the glass roof and glowing lattice, not a facade. The landmark test pins length, crest height, deck level, landing heights, deck width by raycast, the glazing on the north flank only and the hem wave, the four stair flights from grade to the deck edge, the two piers on plinths, the roof-ring footprint, and every canopy member's terminals either joined to another member or anchored on the girder, in both LODs, with a deliberately shortened lattice member and a lifted rib foot proving the check can fail. Depth table regenerated with `--ids bridge-of-peace-tbilisi`: zero cycle edges dropped. Cityscape and Full 3D world integration: not tested yet.

## Review fix (g1a, 2026-10-14): provider ownership

The independent review found a tall white provider extrusion filling the canopy envelope in Cityscape and Full 3D world and hiding almost the whole bridge. Cause: besides the 2 m sliver 1207561125 (the only roof outline in the first dossier) OSM carries **way 440933580** (`building=roof`, `roof:shape=round`, `roof:material=glass`, `height=20`, `min_height=8`, `layer=2`), the glazed canopy's own ~100 m x 15 m outline, which the provider extruded as a solid 20 m lens. Found by decoding the z14 tile the app draws (`tiles.codriver.io/14/10231/6100.mvt`, building feature with `layer 2, height 20`) and matching it to the live OSM way. It is now in `FOOTPRINTS` (second ring, the 32 exact OSM nodes) and `OSM_WAYS` (`[1207561125, 440933580]`); the geometry and both GLBs are unchanged (near 24,880 / 9 / 1,516 KB, far 4,056 / 9 / 310 KB). The landmark test pins both rings (the lens lies on the axis over stations 37-149 and encloses it; a point outside it is not owned). Recaptured far/near/street in both modes (`tmp/next-200/fix/g1a/bridge-of-peace-tbilisi/{city,world}`): the extrusion is gone and the glazed canopy, deck, piers and stairs read cleanly. The app bundle used for the shots was built in a scratch copy; the lead rebuilds the committed `public/peregrine.js`.
