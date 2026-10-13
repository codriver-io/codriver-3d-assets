# NEMO Science Museum — Amsterdam

Original procedural exterior of Renzo Piano's 1997 museum at Oosterdok 2, above the IJ tunnel entrance. The green oxidised-copper hull and its rising public roof are the identity. The roof represents the redeveloped square opened in May 2025, rather than the former water-play terrace. Asset `nemo-science-museum`.

## Sources and rights

Consulted 2026-10-13:

- [NEMO identity](https://en.wikipedia.org/wiki/NEMO_(museum)): Renzo Piano, 1997, five exhibition floors, Oosterdok 2.
- [Arcam architecture guide](https://arcam.nl/architectuur-gids/nemo/): Renzo Piano, 1997, Oosterdok.
- [NEMO official 2025 rooftop announcement](https://www.nemosciencemuseum.nl/en/press/rooftop-square-nemo-open-to-the-public): redeveloped planted roof opened May 2025, more than 75 plant species. Official building reference photo by **DigiDaan**; publication requires photographer credit. Retained only in ignored `tmp/`.
- [Official rooftop venue page](https://www.nemosciencemuseum.nl/en/venue-hire/rooftop-square): viewed drone image of central wooden stairs, side planting, upper solar field and white conservatory. Photographer not established; image is reference-only and is not redistributed.
- [Armsterdam - panoramio.jpg](https://commons.wikimedia.org/wiki/File:Armsterdam_-_panoramio.jpg), **pj soans, CC BY-SA 3.0**: curved leaning copper prow, cladding seams, three sparse window rows and ground glazing. Commons licence/author checked. Dossier interior picture was excluded as an exterior reference.
- [OSM/BAG main envelope](https://www.openstreetmap.org/way/57856769), height `32.57`, skillion roof, 1997 start date, BAG `0363100012164988`. All ten mapped building parts `1390692763` through `1390692772` are included as separate replacement rings; houseboats, adjacent service building and footbridge are excluded. Dossier was reused without new Overpass traffic.

No third-party mesh, texture, photograph or traced architectural drawing is shipped. Editable geometry and mesh helper are original; mapped coordinates are derived OSM data, © OpenStreetMap contributors, ODbL 1.0.

## Frame and dimensions

Real metres east/up/south at origin `[4.91235,52.37408]`, local waterfront grade `y=0`. Mapped orientation is already baked into the exports; no host rotation or terrain/latitude scale is included. The eastern side controls `[4.9126225,52.3741204]` and `[4.9126081,52.3739535]` run approximately 183.0° towards the south. The corresponding west-facing frontage is approximately 273°. No horizontal scaling is applied.

| Feature | Metres | Basis |
| --- | ---: | --- |
| Highest copper edge | 32.57 | OSM/BAG tag, actual exported 32.563 |
| North/south envelope | 117.286 | Mapped main footprint |
| East/west envelope | 44.732 | Mapped main footprint |
| Main public roof | 12.34–21.20 | Estimated rising terrace profile |
| Northern roof/prow | about 22–30.56, plus 2 m lip | Estimated profile fitted to mapped maximum |
| Northern glazed base | 4.2 | Photograph estimate |
| White conservatory high roof | 25.7 | Estimate; mapped part height 26.5 |
| Brick services tower | 22.4 | OSM part height |
| Central stair zone | 24 wide; 52 near / 26 far bands in main wing | Estimated simplified layout |

Heights between mapped endpoints, copper hull inclination, windows, cladding module, terrace configuration and pavilion dimensions are estimates, not surveyed architectural measurements.

## Model and approximations

The two rising copper wings are separated by a five-metre deep slot with recessed glass. The rounded north prow inclines outward from a smaller glazed base. The long main wing follows the curved mapped west edge and skewed south end. Both LODs retain the hull curvature, slot, leaning prow, three rows of sparse recessed square bays, roof stairs, planted side bands, upper dark solar field, white conservatory and brick services tower.

Near cladding uses thin geometric seams and subdued copper/patina variation, partitioned into adjacent faces rather than coplanar overlays. Recessed windows have 0.22 m reveals. Repeated geometry is merged by material (eight near, six far); there are no freestanding rails, cables or unsupported members. Solar field lies directly in the stepped roof surface. All roof bands have physical risers; no smooth coplanar ramp is underneath.

The 2025 planting is represented as olive roof surfaces, not individual botanical geometry. Furniture, doors, interiors, signage, neighbouring footbridge, IJ tunnel roads and water are omitted. The pavilion is simplified, and exact copper panel/window spacing is approximate. Roof access remains a raised building feature, with no authored exterior road ramp.

## Verification

First exported near-light sheet exposed inverted shell winding and excessive panel subdivisions. Those were corrected; the near export was reduced from 62,631 to 16,575 triangles, and floating panel overlays were replaced with the fitted rooftop solar surface. The second exported near-light sheet shows the complete outward-facing hull. Focused tests then exposed a north-base taper which crossed the central slot; the taper was anchored to the slot edge, restoring the physical recess and keeping every vertex inside its owned envelope. Conservatory glazing now reaches the stepped terrace beneath its canopy.

Cityscape: **not tested yet, integration is checked separately**. Full 3D world: **not tested yet, integration is checked separately**. Catalog readiness and export QA do not establish provider replacement, runtime shading, terrain contacts or independent reviewer acceptance. The 78 m flat-site pad needs waterfront DEM checks to avoid a water sample lowering the base; the lead owns both application modes and release review.

Final exported scenes:

| Variant | Triangles | Draws | Bytes | KiB |
| --- | ---: | ---: | ---: | ---: |
| near | 16,577 | 8 | 1,300,792 | 1270.3 |
| far | 4,531 | 6 | 359,212 | 350.8 |

Viewed evidence, all in ignored `tmp/top-cities/shots/nemo-science-museum/`:

- `iteration-1/nemo-science-museum-glb-near-light-sheet.jpg`: overview, facade, roof, back, street, detail and top; exposed winding and subdivision defects.
- `iteration-2/nemo-science-museum-glb-near-light-sheet.jpg`: corrected full shell and sparse window bays, compared with waterfront photos.
- `final/nemo-science-museum-glb-{near,far}-{light,dark}-sheet.jpg`: all seven views, exported GLBs with mapped red footprint overlays, after all fixes.
- `final/nemo-reference-comparison.jpg`: the three used exterior references above the four final exported GLB sheets; actually opened and judged. Curved leaning copper prow, two rising wings, central shell break, muted green patina and roof identity match the references. Fine roof furnishings and botanical detail remain intentionally omitted.

All seven focused landmark tests pass in about 0.6 seconds: actual mapped dimensions/bearing, near/far silhouette, raycast horizontal treads and riser rise, leaning hull over recessed glazing, central physical slot, visible recessed window bays, vertex containment in owned provider rings, pavilion/solar roof contacts, source/export bounds and texture-free palette names.

`qa-metrics.mjs --ids nemo-science-museum` passes: zero layered/coplanar face area, 0.5% back-face hits on 402 rays, no window-rhythm or member-end flags, no removable bridge attributes, matching LOD bounds and budgets. The generated material-depth entry is current, with **zero dropped cycle edges**. Audit: `tmp/top-cities/nemo-science-museum/qa-metrics.json`.

The exact combined top-cities and landmark test command finished with **593/594 passing**: all seven NEMO-specific tests and all three NEMO conformance tests passed; the only failure was another builder’s `tower-of-the-americas` unfinished footprint (`footprint is a real polygon`). Full output is ignored `tmp/top-cities/nemo-science-museum/final-tests.log`. Whole-catalog validation and `pnpm assets:check` / `pnpm assets:preview` initially encountered another builder’s missing Tower of the Americas document (and an earlier unfinished LeVeque record). Those files arrived before handoff: final `node scripts/asset-catalog.mjs` and `pnpm assets:check` pass, **336 entries / 584 GLB variants**, and `pnpm assets:preview` builds the local inspector successfully. No other landmark files were altered to make shared checks pass. The sole shared test failure at the recorded test checkpoint remains the Tower of the Americas footprint; NEMO has no unresolved check or geometry defect.
