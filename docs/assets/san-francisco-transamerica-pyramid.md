# Transamerica Pyramid

Asset `transamerica-pyramid`, 600 Montgomery Street, San Francisco (William Pereira, 1972). Original procedural
model of the tower as it stands today: a straight four-sided pyramid, the four-storey base with its A-frame
arcade over a glazed lobby, 44 rows of precast window pockets, the two vertical wings on the east and west faces,
and the aluminium spire with its louvres and glass crown. Contract:
[3d-san-francisco-landmarks.md](../san-francisco-landmarks.md). Source:
`src/peregrine/landmarks/san-francisco/transamerica-pyramid/`.

## Sources

| Fact | Value | Basis |
| --- | --- | --- |
| Height, floors | 260 m (853 ft), 48 floors | published ([Wikipedia](https://en.wikipedia.org/wiki/Transamerica_Pyramid), OSM `height=260`, `building:levels=48`) |
| Base | 175 ft (53.3 m) square; 16,000 yd3 of concrete in the four-storey base | published (Wikipedia; OSM outline is 54.4 m square) |
| Spire | top 212 ft (65 m), aluminium panels, hollow, glass pyramid cap with the beacon | published (Wikipedia) |
| Wings | one for the elevator shafts on the east, one for the stair and smoke tower on the west; they start about the 29th floor | published (Wikipedia, user brief); start height checked against OSM (outer face 13.95 m from the axis) |
| Windows | 3,678, most pivot 360 degrees | published (Wikipedia) |
| Axis | `[-122.4027858, 37.7951663]` | mapped: centre of the 46 m square, OSM way 451336902 (also the centre of the 54 m base and of the wing footprint) |
| Rotation | faces at bearings 80.78 / 170.78 / 260.78 / 350.78, i.e. the Financial District grid is 9.2 degrees off true north, not cardinal | mapped: the four edges of OSM way 451336902 (45.99 m each) and the `roof:direction` of the four base skillions (80.8 / 170.8 / 260.8 / 350.8) |
| Pyramid part | 46 m square at 30 m, apex 260 m | mapped (OSM way 451336902, `min_height=30`, `roof:shape=pyramidal`) |
| Base outline | 54.4 m square at grade | mapped (OSM way 24222973 and the four skillion parts, `height=30`) |
| Wing footprint | 27.9 m x 6.5 m centred on the axis, `height=215`, roof 5 m | mapped (OSM way 136615987) |
| Front | Montgomery Street, west face (bearing 260.8) | OSM `addr:street`, the block's streets |

Redwood Park (east side) and the glass pavilion attached to the east base (OSM way 1316030009) are not modelled and
not in the footprint list; the provider keeps them.

## Dimension table (model vs source)

| Element | Model | Status |
| --- | --- | --- |
| Tip | 260.0 m (the spire body ends at 254 m, 2.4 m wide; the glass crown tapers to a 0.4 m flat at 260 m) | sourced |
| Faces | one straight slope `half(y) = 26.65 (1 - y / 266)`: 53.3 m at grade, 47.3 m at 30 m (mapped 46.0), 14.0 m at 196 m, 2.4 m at 254 m | base sourced; 3% wider than the mapped 46 m square at 30 m (the published base wins); one continuous taper is read from the Columbus Avenue photograph (the real spire may steepen slightly) |
| Base | A-frame arcade 0-11 m (four bays a face, 3.0 m legs, one zig-zag polygon), lobby glass set back 4.3 m, corner piers, fascia 11-13.8 m, recessed strip 13.8-16 m with three piers, thick band 16-20.4 m | estimated from the Commons base photographs; the 20.4 m height to the first window row is a fit (four storeys, 48 floors in 260 m) |
| Window rows | 44 rows, 4.0 m floor, 20.4 to 196.0 m; 1.37 m module, 0.22 m pier. The lowest 14 rows (to 76 m) are recessed pockets 0.5 m deep with a 2.0 m opening over a 1.6 m sloped sill and a 0.4 m frame above; above 76 m each window is a flat dark pane 0.15 m proud of a plain wall | module fitted so the count lands near the published 3,678 (model counts 3,632); pocket proportions estimated from photographs (the opening is 50% of the floor, about 40% as seen through the 0.5 m recess) |
| Wings | outer face 13.83 m from the axis (mapped 13.95), 6.5 m wide (mapped), from 128 m to an eave at 209.5 m, pitched top rising to 214.5 m at the face, raised panel joints every floor | width and face mapped; start (about the 29th floor, 128 m) and top estimated |
| Spire | aluminium from 196.4 m to 254 m on the same slope, two louvre slots a face at 216.8-219.8 m | published length 65 m; louvres estimated from the Columbus Avenue photograph |
| Crown | glass frustum 254-260 m, 2.4 m to 0.4 m wide | estimated |

## Materials

Seven merged materials, one draw each: `quartz` (the crushed-quartz precast: wall bands, piers, sills, wings), `shade`
(jambs, soffits and pocket heads, a darker tone that fakes the depth shadow), `concrete` (the arcade legs and corner
piers, slightly greyer), `glass` (the bronze-black glazing: the core seen through the pockets, the upper panes and the
lobby wall), `light` (lit windows and the spire louvres: unshaded, bronze-black glass by day, warm light at night), `aluminium` (the spire) and `glow` (the
crown, unshaded). Light and dark palettes share keys; at night the precast drops to a floodlit grey, about a fifth of
the windows and the louvres light up, and the crown glows.

## Modelling decisions

- The lowest 14 rows are a dark glass core with a precast grid in front of it, not a box with holes: the core is four
  quads, the grid is wall bands (front and soffit), narrow piers with two jambs each, and one sloped sill strip per row
  that the piers hide between the windows. A recessed window costs 3 quads (pier front, two jambs) and about 0.3 of a
  lit-glass quad. Above 76 m the recess is dropped: a flat wall quad per row and one pane quad per window (a lit window
  is the same quad in `light`), which is what halves the near cost; the pocket detail is below a pixel past about
  100 m.
- No T-junction cracks: pier fronts and jambs sit 3 cm behind the bands, the glass and the sill they meet and run 3 cm
  past them, and the arcade piers and A-frames sit 3 cm behind the fascia and 5 cm up under it, so two surfaces that
  must seal overlap instead of touching along an edge with mismatched vertices. Beside the wings the wall runs 4 cm
  into the wing's solid.
- Everything is authored on the building's own axes (faces +X east, +Z south, -X west, -Z north) and rotated once by
  9.22 degrees into the mapped footprint; the layer must not rotate it again.
- The wings emerge exactly on a wall band (128 m): the vertical face meets the sloping face along a line, two triangular
  side faces close the wedge, and the grid beside it is closed back to the core so nothing can be seen through.
- The arcade is a single zig-zag polygon (no overlapping fronts) extruded 2.6 m: the shared feet, the A apexes under the
  fascia and the V notches between the frames all read from the street, and a ray through an opening reaches the lobby
  glass, not the sky.
- Far keeps the same envelope, the full arcade and wings, the spire and crown. Each floor is one wall-and-sill band with a
  1.2 m dark opening, a pier every fourth window and a few lit strips; a diagonal partition closes the notch behind the
  openings at each corner so a grazing view along a face cannot see into the next.
- Nothing is below grade (min y = 0). Every surface stands on the hull; the louvres and lit panes are offset 0.15 m from
  surfaces larger than 50 m.

## Costs

| LOD | Triangles | Draws | Bytes |
| --- | ---: | ---: | ---: |
| near | 17,088 | 7 | 932,556 (911 KB) |
| far | 2,970 | 7 | 170,392 |

Budget (building): near 60,000 / 14 / 2.5 MB, far 12,000 / 8 / 500 KB. Desktop numbers only; in-car timing is a separate
check.

## Placement

`y = 0` is the pavement at the lobby, the flat Peregrine grade; no terrain or sea-level offset is baked in. The model
sits inside the mapped 54.4 m base outline (tested with the runtime layer's ownership test: every vertex is owned) and
`padM` 42 m covers the outline's corners (38 m) and the arcade. Cityscape: the layer removes the provider extrusion
inside the seven listed rings. Full 3D world: not tested yet, integration is checked separately; the site is flat
Financial District fill (OSM `ele=5`), so a rigid pad at the lobby level is the expected host behaviour.

## Approximations, honestly

- The window pockets (lowest 14 rows) are straight boxes with a sloped sill; above 76 m the windows are flat panes in a flat wall, a visible change of texture from the street at close range. The real pockets are shield-shaped (the sill narrows toward the
  bottom with bevelled corners) and the frame between them is a 0.2-0.3 m bevelled rib. A tapered version was built and
  dropped: it added 14,000 triangles for a detail that is invisible beyond about 40 m. Recessing every row cost 26,700
  near triangles (1.45 MB); the independent review asked for about half.
- The arcade is a clean zig-zag of A frames; the real base has a second, X-braced layer of soffit beams under the fascia
  and a lighter inner frame between the legs.
- One straight slope runs from the base to the crown. The 65 m spire is modelled as the continuation of the pyramid.
- Wing tops follow the OSM `roof:shape=gabled`, 5 m, as a single pitched plane; the exact crown of each wing is not known.
- The window count is 3,632 against the published 3,678 (the module is a fit).
- No Redwood Park trees, fountain or sculptures, no cameras on the spire, no interior.

## Verification

Compared side by side with Commons photographs (local, ignored, `tmp/san-francisco/transamerica-pyramid/refs/`; licences in
the catalog record). Renders in `tmp/san-francisco/shots/transamerica-pyramid/` (procedural source and the exported GLB,
near and far, light and dark: overview, facade, roof, base, wings, west, plus corner, wing-join, arcade, top and back
views):

- Round 1 (overview and facade): the pocket windows read as small dashes in white walls; against the south-face photograph
  the real windows are 40% of a floor and the sloped sill 50%, with only a 0.4 m frame between rows. Rebuilt with a
  3.6 m pocket (1.6 m opening, 2.0 m sill) and a 0.4 m frame, darker `shade` jambs and soffits.
- Round 2 (base): the first arcade used 2.2 m legs, thin in the street view; widened to 3.0 m.
- Round 3 (wings and west): the wing now starts on a band at 128 m and its side wedges close against the grid; raised joints
  added to its face after the west view looked blank next to the photograph.
- A hole check (random outside rays, both sides pickable, first hit must face the viewer; 7,400 rays a LOD) found a real
  leak in round 2, the triangle beside each sloped sill left open when the jamb was cut short, and a see-through notch at the
  far corners; both fixed, now zero back-facing first hits near and far.
- Review fix round (independent review: PASS-WITH-NITS, recognisability 5/5): near cost halved (recess only on the lowest
  14 rows; 26,726 to 17,088 triangles, 1.45 to 0.91 MB, the normals stay); openings taller (opening 1.6 to 2.0 m, panes
  1.65 m) and the day glazing changed from slate-blue `#2b3540` to bronze-black `#2b2622` (lit panes `#3b332c`); the
  hairline dotted seams along the fascia and band edges closed by the 3 cm tuck above (checked in a close render of the
  fascia, the strip and two rows); the stale MANIFEST text (wing face 13.6 m, 0.6 m pockets, 1.4 m module) replaced by the
  same numbers as this document. Re-rendered the exported GLB at 800 m (near light and dark, far light) and at the
  street (`glb800`, `glbstreet` shots); the leak check (8,000 rays near, 5,000 far) still reports no back-facing first hit.
- Top view with the red footprint rings: the base sits inside the 54.4 m outline and the faces are parallel to its edges.
- Exported GLBs were rendered (overview, facade, wings, base; far dark overview and wings; near dark roof and overview) and
  match the source.

Tests: `src/peregrine/landmarks/san-francisco/transamerica-pyramid/transamerica-pyramid.test.js` (9 tests, 0.5 s) pin the
tip height and base width by raycast, the straight faces, the 44 window rows, the wings' width, start, position and pitched
top, the spire and louvres and crown, the open arcade (in both LODs), far silhouette and cost, outline containment and the
exported GLBs.
