# Vancouver Public Library — Library Square

Original procedural model of the 1995 Central Library at 350 West Georgia Street, Vancouver, designed by Moshe Safdie with Downs Archambault & Partners, including the adjoining Federal Office Tower and present roof terrace. The identity is the sandstone-coloured elliptical colonnade enclosing a rectangular library, with a lower spiral wall, concrete fins and glazed public concourse. This is not the Carnegie, Kitsilano or Kensington branch; those photographs in the dossier were excluded.

## Sources and frame

[Safdie Architects’ project page](https://www.safdiearchitects.com/projects/vancouver-library-square) identifies the nine-storey rectilinear library, wrapping colonnade, glass-roofed concourse, sandstone-coloured precast concrete, federal office tower and its glazed northeast bay. [VPL’s architectural history](https://www.vpl.ca/guides/vancouver-library-square-architectural-guide/history-and-specifics) records the May 26, 1995 opening and later upper-floor expansion. The exterior architectural photo shows **rectangular** apertures with strong piers and lintels, rather than semicircular Roman arches. The model follows that observed modern construction while preserving the Colosseum-like curved massing.

The supplied dossier OSM response was retained as geographic authority. The complete provider outline is way **37111640**; every modeled part **360440468–360440480** is listed separately in `OSM_WAYS` and `FOOTPRINTS`, including the narrow tower support and stepped tower roofs. The Centre theatre, CBC, adjacent apartments and road surfaces are excluded. Raw geographic rings are preserved in `footprint.js`; literal local metre control points are in `vancouver-public-library-plan.js`. No second network footprint query was needed.

Origin is `[-123.11563, 49.27975]`. Axes are east/up/south, with rigid local grade y=0. The library’s mapped upper core controls `[-123.116105,49.279622]` and `[-123.115520,49.280010]` (rounded; authoritative full precision is in way 360440472’s ring) establish the approximately **45°** long-axis bearing. Rotation is already baked into the local OSM coordinate literals and GLBs; the host must not rotate again. The core is approximately 61 × 43 m at 34 m and 61 × 31 m at 38 m. The main curved facade follows three mapped wall arcs rather than an ideal symmetric ellipse; the southeast gap opens onto the spiral concourse. Estimated fins project outside the detailed stepped provider ring by less than 6 m; the original mask is not enlarged to claim neighbours.

## Dimensions

| Feature | Model | Basis |
| --- | --- | --- |
| Library orders / core program | four colonnade orders; simplified core facade grid | nine-storey program sourced from architect; exposed facade and order splits estimated |
| Main colonnade | 40.2 m crown | OSM three wall parts tagged 40 m; 0.2 m foundation allowance |
| Rectangular core / upper setback | 34 / 38 m | OSM parts 360440480 / 360440472 |
| Lower spiral wall | 30.2 m | OSM part 360440471 tagged 30 m plus foundation |
| Main curved envelope | roughly 94 × 69 m ideal ellipse, interrupted southeast | mapped arc envelope; ellipse dimensions estimated |
| Office tower roofs | 60 / 70 / 80 / 86 m | exact part heights from OSM; not a surveyed architect height |
| Large opening height | 6.6 m | estimated within each ten-metre order |
| Gallery glazing recess | 3.25 m | estimated from deep reading galleries |
| Main bays, near / far | 38 / 25 over surviving arc | estimated; far coarsens repetition |
| Spiral bays, near / far | 23 / 13 | estimated; no loss of the lower wall silhouette |
| Fins | 5.5 m projection, two ten-metre slopes | estimated; grounded and attached at floor levels |
| Foundation | 0.2 m, original mapped outline | authored rigid grade; no terrain baked |

## Geometry, materials and simplifications

Six merged materials: muted warm `stone`, cool dark `glass`, neutral `frame`, grey `roof`, subdued `garden` and night-lit `glow`. Light and dark palettes share keys. No external mesh, photograph, UV texture, decoder or compression is shipped. The main walls contain real apertures, deep gallery glass, small spandrel lights, floor returns and near mullions. The lower spiral wall retains true ground openings and attached triangular fins. Its glazed concourse canopy connects to the core, with transverse frames supported at the spiral crown and the core roof. The roof terrace has low paving borders and planted beds.

Tower wall skins are split into opaque grid panels and inset individual window panes; shared walls below adjacent tower parts are removed. The glazed northeast bay and mapped stepped roofs remain. Both LODs retain about four-metre office rows and all seven core rows. Far broadens horizontal bays, uses flat separate panes and continuous jamb skins, and omits reveals. Glow panes occupy isolated portions of single storeys with opaque gaps at every floor. Far colonnade wall skins omit concealed end faces and near mullions. No lettering, chairs, interior furniture, individual plants or small facade joints are modeled. The canopy grid and roof landscaping are simplified; it is an architectural likeness, not a fabrication survey.

## Review b8a corrections and verification

Review b8a finding 1: far now retains all seven core rows and the exact near office-floor elevations. Savings come from continuous flat jamb skins, single inter-floor gap panels, fewer horizontal bay subdivisions, omitted reveals and planting tops instead of concealed thin-box faces. Finding 2: spatially varied lighting avoids aligned luminous rows across neighbouring tower parts. Far glow panes occupy only the middle of a coarse bay, with ordinary glass on each side and dark opaque gaps at every actual floor. No floors are combined vertically. The ellipse, gallery orders, spiral fins, canopy and mapped ownership are retained.

| Export | Triangles | Draws | Bytes | KiB |
| --- | ---: | ---: | ---: | ---: |
| near | 50,650 | 6 | 2,205,508 | 2153.8 |
| far | 10,444 | 6 | 479,352 | 468.1 |

Final judged evidence: `tmp/top-cities/shots/vancouver-public-library/review-fix-final/comparison.jpg`, with attributed dossier references above exported near-light, far-light and far-dark four-view sheets. Two look-fix iterations were used; no additional reference downloads or footprint changes were needed. LeVeque views cover overview, opposite side, street and crown; Library Square views cover overview, facade, opposite side and roof. Night lighting remains a simplified architectural representation.

Both models pass deterministic QA and generated depth checking with zero cycle edges dropped. The 13 own-landmark tests pass, including new regressions for shaft relief / gables / cornices and identical tower-row elevations with bounded single-storey glass and glow heights. The requested combined registry run passes all 616 tests; log: `tmp/top-cities/leveque-tower/review-fix-tests.txt`. Catalog validation passes at 336 entries / 616 variants, and `pnpm assets:preview` succeeds. Earlier transient missing MuCEM documentation resolved without edits to another builder’s files.

Cityscape: **revised exports not tested in app**. Full 3D world: **revised exports not tested in app**. Pre-fix static app evidence exists at `tmp/next-200/qa/b8/app/{city,world}/vancouver-public-library-*.png`; independent b8a review found visible base contacts acceptable. Library Square also has four-bearing evidence in both modes establishing nearby white towers as neighbours, so no provider ownership expansion is warranted. Those shots do not establish corrected exports, terrain arrival, replacement lifecycle or hardware performance. The lead owns fresh both-mode app captures and independent re-review. Only the authorized generated depth table was changed outside the owned asset files.
