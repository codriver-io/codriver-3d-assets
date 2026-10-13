# Washington National Cathedral

Original procedural exterior of the Cathedral Church of Saint Peter and Saint Paul, 3101 Wisconsin Avenue NW, Washington, D.C. The completed 1990 Neo-Gothic building is represented without temporary restoration scaffolding. No third-party mesh, photo or texture is shipped.

Sources: [official figures](https://cathedral.org/discover/fun-facts/), [official tour guide](https://cathedral.org/wp-content/uploads/2024/02/Tour-Guide-English-.pdf), [mapped cathedral](https://www.openstreetmap.org/relation/2682714), [west facade by S E Brendel, CC BY 3.0](https://commons.wikimedia.org/wiki/File:Washington_National_Cathedral_Front.jpg), [aerial by Duane Lempke, CC0](https://commons.wikimedia.org/wiki/File:Washington_National_Cathedral_Looking_SE.jpg). References remain in the ignored dossier only.

| Feature | Basis | Model |
| --- | --- | --- |
| Gloria in Excelsis tower | Official 301 ft | 91.7448 m |
| West towers | Official 234 ft | 71.3232 m |
| North rose | Official 26 ft | 7.9248 m |
| Length / width | Dossier 518 / 158 ft | Mapped plan, including projecting transepts and cloister |
| Material | Official Indiana limestone | Muted grey limestone; grey metal roofs |
| Roof ridge and eaves | Photo estimate | 45.7 m / approximately 36 m |
| Buttresses, tracery and low annexes | OSM and photo estimates | Repeated procedural profiles |

Real metres, east/up/south, origin `[-77.07083,38.93056]`, rigid pavement grade y=0. The mapped longitudinal axis is 20.17 degrees north of east; rotation is baked once into source and GLB. The outer cathedral way 67829238 and parts 1176354409–1176354412 are owned; neighbouring Virginia Mae Center and Church House are excluded. The cloister court remains open. No terrain altitude, latitude stretch or renderer offset is baked into geometry.

Both Cityscape and Full 3D world are **not tested yet; integration is checked separately**. A bounded median terrain pad proposes three pavement reference points across Mount St Alban; this is not DEM certification. The lead must verify hillside entrance residuals, lattice-node coverage, feathering, provider replacement, regional-to-street terrain refinement and mode/lifecycle transitions before terrain approval.

The exterior retains the dominant crossing tower, paired west belfries, pointed portals and Creation rose, eight-bay nave and five-bay choir, flying buttresses, pinnacles, transept roses and open cloister. Windows are holes in masonry with inset glass, and named support contacts are tested in both LODs. Far removes minor stone crockets and alternate parapet teeth while retaining windows and the silhouette. Individual carvings, stained-glass pictures, interiors and temporary scaffolds are omitted; relief and architectural profiles are estimates.

Export and final checks/evidence are recorded below after the focused run.

## Review fixes and measured exports — 2026-10-13

The b9b reviewer requested deeper west-front architecture and a petal rose. The west towers now have actual paired blind-arch apertures with continuous shaded limestone backs more than 1.3 m inside the outer wall, rather than decorative strokes over a filled wall. Nested solid archivolts project into the recess in near; far retains a thick intrados and the principal pointed surround. Removed overlapping original window holes which invalidated the masonry triangulation, and the spurious full-height mullions across the open rose vault. The southern buttress moved clear of its blind bay, within the mapped footprint, and figure plinths now connect into their supporting piers.

The west gallery has seven 1.25 m-wide recessed lancets, 1.72 m bay pitch, projecting 0.44 m divisions and small gabled heads. Both LODs retain all seven openings. Rose tracery uses closed petal loops plus a lobed centre in merged stone, with twelve petals near and eight far, instead of radial spokes. The shaded recessed backing is a subdued estimate of architectural shadow, not a photographic texture. Rear wall caps facing the closed interior and secondary far moulding tiers are omitted to hold the far byte budget.

| Detail | Triangles | Draws | Bytes | KiB |
| --- | ---: | ---: | ---: | ---: |
| Near before → after | 29,289 → 30,581 | 4 → 5 | 1,406,216 → 1,485,760 | 1,373.3 → 1,450.9 |
| Far before → after | 10,439 → 9,602 | 4 → 5 | 494,412 → 486,332 | 482.8 → 474.9 |

Two look-fix rounds used exported near/light sheets in `tmp/top-cities/shots/washington-national-cathedral/review-fix-{1,2}/`, with facade, entrance, overview, back, roof and detail. The first exposed the overlapping window cuts; the second made their correction visible. The final far/light sheet in `review-fix-2/` confirms the seven-bay gallery, recessed blind arches and petal rose remain legible as geometry. That far sheet also includes the final shadow-backing and mullion cleanup; the earlier near sheet predates those final mechanical corrections. No third look-fix round was run. Reference comparison used `tmp/top-cities/washington-national-cathedral/refs/front.jpg` and `refs-sheet.jpg`.

Seven focused tests pass, including all gallery openings, recessed blind backs, official tips, flying-arch named support contacts with negative cases, and every distinct horizontal vertex inside the owned ring within the existing 0.8 m provider slack. Exported deterministic QA is clean; scoped depth generation/check reports no material cycles. Only the two owned landmark test files and the mandated top-cities conformance file were run, with results recorded in `tmp/top-cities/yerevan-cascade/review-fix-tests.txt`; unrelated builders' conformance/catalog races are recorded in the worker report.

The b9 app review found clean old Cityscape/world footing and provider replacement. **Post-fix Cityscape and Full 3D world verification remain pending the lead's app recapture**, particularly west-front reading at 100–300 m. Exact sculptural likeness, stained-glass pictures, interiors, terrain lifecycle and hardware performance remain outside these export checks.

Final combined conformance checkpoint: **638/638 pass** in 42.3 s (`tmp/top-cities/yerevan-cascade/review-fix-tests-final.txt`), including all 16 owned tests. Earlier unrelated Miami Tower record failures cleared after its builder completed the record. The shared catalog and local preview subsequently pass (336 records / 654 GLB variants), and scoped depth metadata is current with zero cycles. The durable handoff is `tmp/top-cities/yerevan-cascade/REVIEW-FIX-REPORT.md`.
