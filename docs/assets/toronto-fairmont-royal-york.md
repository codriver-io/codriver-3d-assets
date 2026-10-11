# Fairmont Royal York

Asset `fairmont-royal-york`, 100 Front Street West, Toronto. Original procedural model of the hotel as it
stands in 2026: the 1929 Chateau-style Canadian Pacific hotel (Ross and Macdonald with Sproatt and Rolph),
its 1930s east extension included, across Front Street from Union Station. Contract:
[3d-toronto-landmarks.md](3d-toronto-landmarks.md). No scan, traced mesh, photograph or texture is in the
repository or the GLBs. Union Station is a separate landmark ([3d-toronto-union-station.md](3d-toronto-union-station.md)); nothing of it is drawn or removed here.

## Identity and what a driver sees

From Front Street at 100 m: a long buff-limestone block, 149 m along the street, whose 25 m podium carries
the Concert Hall arcade (eight tall pointed arches over a balcony) and a row of maroon awnings; behind and
above it the 67 m shoulders (a west wing, a spine, an east wing) and, rising from the spine, the 87 m tower
face with a loggia of five round arches. On top, a stepped crown: a small arcaded setback block, the crown
storeys with copper-capped corner turrets, a steep verdigris hipped roof with dormers, the lit
"Fairmont / ROYAL YORK" sign across its south slope, and a square stone stack ending in a pinnacled parapet, a copper pyramid, a lantern and a finial, 124 m in all.
From 800 m the recognisable things are the stepped limestone mass, the pale green crown roof and stack, and
the comb plan (three fingers and a west wing, roof terraces between them, opening north). Every roof edge
carries a thin verdigris coping.

## Sources and dimension table

The plan and slab heights come from OSM `building:part` ways (Overpass through the shared helper, 2026-09-29).
Photographs (Wikimedia Commons, listed below; downloaded to ignored `local-scratch/fairmont-royal-york/refs/`
only to compare) informed the facade rhythm, arcades, crown and sign. The stone is Indiana limestone over a
steel frame; the brief's "brick" is not right and is not modelled.

| Feature | Model | Basis |
| --- | --- | --- |
| Overall height to the top of the finial | 124.0 m | **sourced**: 124 m / 407 ft (Wikipedia, Historic Hotels of America) |
| Storeys | 28 | **sourced** (Wikipedia). The model draws about 20 window rows plus two arcaded crown bands: the floor pitch (about 3.5 m) is estimated and the storeys are not counted one for one |
| Plan, comb of five slabs | 149 m long along Front Street, 62 m deep, axis 16.6 deg north of east | **mapped**: OSM ways 177879879 (outline), 31728160, 290194023, 290194022, 231977103, 231977104 |
| Podium | 0 to 25 m | **mapped** (way 177879879 `height=25`) |
| Shoulders: west wing, spine, three north fingers, east wing | 25 to 67 m | **mapped** (way 31728160) |
| Tower spine | 67 to 87 m, 66 x 23 m | **mapped** (way 290194023) |
| Setback block under the crown | 87 to 94 m, 30.5 x 17.7 m | **mapped** (way 290194022) |
| Crown storeys | 94 to 100.4 m, 27.3 x 14 m | **mapped** (way 231977103, walls to 109 - 8.7 = 100.3 m) |
| Hipped roof | eave 100.1 m, ridge 110.6 m | OSM `roof:height` 8.7 m; the model rises 10.2 m over the overhang, **estimated** |
| Stone stack and its crown | 3.2 x 4.1 m shaft to 117.6 m, corbelled parapet with four corner pinnacles to 118.4 m, copper pyramid to 120.6 m, stone lantern with a copper spirelet to 123 m, finial to 124 m | plan **mapped** (way 231977104, `height=114`); the parapet, pyramid, lantern and finial are **estimated** so the model reaches the published 124 m as a crown, not a needle |
| Concert Hall arcade | 8 pointed arches, 26.7 m long, springing 16.2 m | length **mapped** (the recessed Front Street segment), arch count and size **photo estimate** |
| West-face podium arcade | 12 pointed arches on 61 m | photo estimate (Wikipedia: "row of pointed arches on the third story") |
| Loggia under the crown | 5 round arches, 4.3 m pitch, y 72 to 79 m | photo estimate |
| Window grid | pane 1.7 x 2.25 m with a central mullion (paired lights), 3.4 m bays, about 3.5 m floors, 30 % lit at night; about 32 % of each wall is glazed | photo estimate |
| Sign | ~19 m wide, two lines of stroke lettering, parallel to the south slope and clear of the turrets and dormers | photo estimate; layout of the letters is ours |

## Materials (light / dark)

`limestone` (warm buff, dimmer at night), `plinth` (dark granite base), `glass` (dark window panes), `glow`
(30 % of panes: the same colour as `glass` by day, warm lit yellow at night; drawn unshaded), `copper`
(verdigris roofs, copings, turrets, dormers, stack cap), `roof` (grey gravel), `awning` (maroon), `metal`
(marquee, finial, sign struts), `sign` (white-pink lettering, self-lit). Nine materials, so nine draw calls.

## Modelling decisions

* **The plan is the mapped plan, unrotated.** Every slab is a mapped ring extruded between its mapped
  heights; the hotel's 16.6 degree grid angle is already in the rings, so the model lies exactly in its
  footprint (`fairmont-royal-york-site.js` derives the model-metre rings and the hotel's own U / V axes from
  `SPEC.origin`, the area centroid of the outline). Walls of slab i are only drawn between its own levels,
  so no two walls overlap and nothing z-fights; a cap under each slab is hidden by the slab above.
* **Only the mapped shapes are extruded.** The comb plan (fingers, terraces, the recessed arcade segment, the
  projecting entrance pavilion) is what makes the hotel readable from the air, and it costs nothing.
* **Detail is geometry, and is merged.** All windows, arches, cornices, piers, awnings, dormers and the
  lettering are flat-shaded quads with an explicit outward normal (`fairmont-royal-york-mesh.js`), merged
  per material. Arch openings are recessed glass in a limestone frame with reveals, mullions and transoms.
  Belts sit on the boundaries between window rows, never across a pane. A window pane is one quad 0.16 m proud of
  the wall and its mullion a slender quad 7 cm in front of it (no boxes: the sides of a 0.2 m reveal are sub-pixel);
  `flush` welds vertices that share a position and a normal, so a quad costs four vertices, not six.
* **The sign is stroke lettering** (`fairmont-royal-york-sign.js`), not a plate: about 95 square-section bars. The south slope carries only the sign: the two south dormers stand outboard of it and the secondary turrets are on the north side only.
* **Far LOD** keeps every slab, cornice and copper coping, the arcades, the whole crown (roof, turrets, stack,
  finial) and replaces the window grid with one dark slot per two bays cut around the arcades. The sign
  becomes two light bands. 5,665 triangles against 44,634.
* **Night.** `glow` panes are scattered with a fixed seed (30 %), so a dark-theme hotel is speckled with lit
  rooms and the crown sign glows; by day `glow` and `glass` are the same colour.

## Approximations and limits

* Facade detail is read from photographs and is not a survey: window sizes, bay pitch, floor pitch, arch
  counts, piers and belts are plausible, not counted. Ornament (griffin grotesques, tracery, balustrades,
  corbelling, the heraldic panels) is absent.
* The tower spine, wings and fingers use the OSM slab heights; the real setbacks are subtler than five clean steps.
* The 1959 east addition is not distinguished from the 1930 wing.
* OSM ends the stack at 114 m and photographs show a stack with a plain cap and at most a small finial, so
  the top 10 m (parapet, pyramid, lantern, finial) is interpretation, shaped as a crown to reach the published 124 m.
* Street furniture is limited to awnings and the entrance marquee. No flags, signs, doors or trees.
* Union Station's colonnade and roofs, across Front Street, are not part of this model or its footprints.
* The night sign is one colour; the real neon is pink and white.
* Front Street is not part of the model: the marquee reaches 3.9 m past the mapped outline over the sidewalk.

## Costs (exported GLBs)

| | Triangles | Draw calls | Bytes |
| --- | --- | --- | --- |
| Near | 23,062 | 9 | 1,122,584 |
| Far | 5,665 | 7 | 294,132 |

Weight pass (2026-10-01): near was 44,634 triangles / 3.62 MB (window boxes, six vertices a quad, the roof boxes' top drawn twice
which also left 449 m2 of coplanar overlap); the quad windows, welded vertices and single roof caps cut it to 23,062 / 1.12 MB with
the same silhouette, crown, arcades, sign and colours. Far is unchanged in triangles.

Budgets: near 160,000 / 48, far 45,000 / 14 (the San Francisco budgets, 60,000 / 14 / 2.5 MB near and 12,000 / 8 / 500 KB far, also hold). Costs describe scene meshes and uncompressed bytes, not
measured Tesla performance. Bounds: x -80.9 to 80.7, y 0 to 124, z -50.5 to 51.6 m around the origin
(-79.3815238, 43.6459096).

## Verification evidence

Screenshots were rendered with `local-scratch/shot.mjs` (headless Chromium on the GPU, red OSM footprint rings
and a 10 m grid) and read against the references. Files are in ignored `local-scratch/shots/fairmont-royal-york/`.

* **Procedural, near, light:** `overview`, `facade` (Front Street, from the south), `sw` (a SW corner view
  matching the DXR photograph), `se` (a view matching the Hisgett photograph), `street` (the Concert Hall
  arcade from the sidewalk), `west` (podium arcade and the tall slender arches), `north` (the back, the
  terraces between the fingers), `east`, `crown` (roof, dormers, turrets, stack, sign), `roof` and
  `structure` (from above, showing the comb plan inside the footprint rings).
* **Exported GLBs (`--source glb`):** near light `overview`, `sw`, `crown`, `street`, `north`; far dark
  `overview`, `facade`, `sw`. The far model keeps the stepped silhouette, roof, stack and terraces.
* **Runtime look:** an unlit emulation of `building-layer.js` (baked shading from the normal, palette by
  theme, `glow` and `sign` unshaded) was rendered for light and dark, near, to check the night lit windows
  and sign, which the standard shot does not show.

What was changed because of them: the loggia was first placed at 54 to 63 m and moved to 72 to 79 m after
comparing the floors above it with the photographs; belts that cut through windows (z-fighting dashes) were
moved onto row boundaries; windows were narrowed (2.05 to 1.95 m tall, 1.45 to 1.25 m wide); ground floors,
awnings and the marquee were added after the first blank base; the sign was enlarged, then narrowed to fit
the roof; the far model's west face was blank because slots skipped whole arcade walls, so slots are now cut
around the arcades; the origin moved 1.7 m after a cancellation error in the first centroid.

After independent review (pass with nits): the sign read "RJYAL YORK" because the secondary south turrets and the
dormers stood in the lettering, so those were moved or removed and the lettering slightly reduced; the
stack ended in a thin 5 m mast that looked like an antenna, so it now ends in a pinnacled parapet, copper
pyramid, lantern and short finial (124 m unchanged); the 25 to 67 m walls read as blank cream with small
windows, so panes grew from 1.25 x 1.95 m to 1.7 x 2.25 m and gained a mullion (near +10,800 triangles).
The crown, facade and SE views were re-rendered and read after the change; the GLB was re-exported and
rendered (crown, facade).

Cityscape: not tested yet, integration is checked separately. Full 3D world: not tested yet, integration is
checked separately.

## References and rights

* Wikipedia: <https://en.wikipedia.org/wiki/Fairmont_Royal_York> (height, storeys, architects, materials).
* Historic Hotels of America: <https://www.historichotels.org/hotels-resorts/fairmont-royal-york/history.php>.
* Heritage Toronto, Rail Lands: <https://www.heritagetoronto.org/explore/toronto-rail-lands-history-tour/royal-york-hotel-history/>.
* OSM ways 177879879, 31728160, 290194023, 290194022, 231977103, 231977104 (© OpenStreetMap contributors, ODbL 1.0).
* Photographs compared, not shipped (Wikimedia Commons): DXR, "Fairmont Royal York, Toronto, Southwest view
  20170417 1" (CC BY-SA 4.0); Tony Hisgett, "Royal York Hotel Toronto (7974338007)" (CC BY 2.0); Taxiarchos228,
  "Toronto - ON - Royal York Hotel" (FAL); Rrburke, "Royal York Hotel 0859" (CC BY-SA 3.0); shankar s.,
  "Fairmont Royal York Hotel, Toronto (27823283571)" (CC BY 2.0); Paulo O, "Royal York, Toronto
  (36084032150)" (CC BY 2.0); Spudgun67, "The Royal York Hotel - 100 Front Street West" (CC BY-SA 4.0);
  Canada Postcard Co., "Postcard of the Royal York Hotel in Toronto, 1929" (public domain); "Royal York Hotel
  and Front Street 1930" (public domain).

Rebuild: `pnpm build:toronto-landmarks fairmont-royal-york`. Tests:
`node --test src/peregrine/landmarks/toronto/toronto.test.js src/peregrine/landmarks/toronto/fairmont-royal-york/fairmont-royal-york.test.js`.
