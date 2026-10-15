# Bromo-Seltzer Tower, Baltimore

Original procedural present-day Bromo-Seltzer Arts Tower (Emerson Tower), 21 South Eutaw Street, Baltimore. This asset models the surviving tower, without the revolving bottle removed in 1936. Source lives in `src/peregrine/landmarks/top-cities/bromo-seltzer-tower/`; reproducible export: `pnpm build:top-cities-landmarks bromo-seltzer-tower --no-check`.

## Sources and dimensions

| Feature | Value | Basis |
| --- | --- | --- |
| Highest masonry / battlement | 88 m | [Published tower description](https://en.wikipedia.org/wiki/Emerson_Bromo-Seltzer_Tower) and OSM height |
| Storeys, construction | 15; 1907–1911; Joseph Evans Sperry | Published description; OSM 15 levels |
| Four clock faces | 24 ft = 7.3152 m | [Official floor explorer](https://bromoseltzertower.com/about/virtual-tour) |
| Lettered dial identity | BROMO above, SELTZER below; smaller Roman indices | [Official tower history](https://bromoseltzertower.com/about) and reference detail photograph |
| Mapped outer envelope | about 12.85 × 12.97 m | [OSM way 338029366](https://www.openstreetmap.org/way/338029366); geographic outline, not surveyed shaft width |
| Origin | [-76.6206228, 39.287666825] | Average of four mapped tower vertices |
| Model shaft / plinth / widest cornice | 10.6 / 11.5 / 12.8 m | Photographic estimates fitted inside mapped envelope |
| Clock centre / chamber | 66.6 m / 61.65–72.5 m | Estimated from photographs |
| Corbel cornice / terrace | 72.5–76.8 m / 76.8–79.36 m | Photographic estimates |
| Octagonal crown | 3.9 m apothem, top 88 m | Photographic estimate; actual arch openings on eight facets |
| Shaft windows | Four bays, thirteen main rows plus base and upper niches | Photographic approximation, no surveyed floor elevations |

Photo references actively used: [Bromo-Seltzer Tower MD1.jpg](https://commons.wikimedia.org/wiki/File:Bromo-Seltzer_Tower_MD1.jpg) (full tower) and [MD2.jpg](https://commons.wikimedia.org/wiki/File:Bromo-Seltzer_Tower_MD2.jpg) (clock/corbel/crown detail), both Acroterion, CC BY-SA 4.0; Commons licences checked 2026-10-15. The supplied dossier contact sheet was also compared for overall silhouette. Photos remain exclusively under ignored `tmp/top-cities/bromo-seltzer-tower/refs/`. The mesh is original, texture-free and contains no imported capture. Geographic outline © OpenStreetMap contributors, ODbL 1.0.

## Frame and ownership

Local +X east, +Y up, +Z south; y=0 means flat pavement and the base is rigid. No terrain height, latitude stretch or scene datum is baked into geometry. Two south-edge control points [-76.6206939,39.2876061] and [-76.6205450,39.2876112] give a 2.5339° rotation, baked once in both exported LODs. West frontage bearing is 267.47°.

Only way 338029366 is replaced. The neighbouring Steadman fire station (way 338029317), roads and other buildings remain provider-owned. No plaza or unowned annex geometry is authored. The widest projecting cornice fits the mapped tower envelope within the provider tolerance; a vertex test measures the actual residual. Ground pad radius is a bounded 15 m declaration, not a claim of validated terrain placement.

## Model decisions and approximations

A slender weathered yellow-brown brick shaft has four separate window columns on every side, recessed into actual cut apertures; near adds sills and sash bars. The clock chamber contains four real circular apertures with pale self-lit annuli, dark inner dials, geometry BROMO/SELTZER lettering, subordinate Roman indices and static hands. The projecting cornice has a closed tapered metal casing, corbel ribs and a square crenellated terrace. The upper octagon has eight genuine arched sightlines, blind-arch ornament and separated merlons, including in far.

Seven merged materials: brick, stone, trim, glass, glow, ink, metal. The night palette dims masonry and windows while retaining illuminated clock faces. No brick mortar, complete interiors, historical bottle, adjacent factory/firehouse, temporary maintenance scaffolding, aerials or every thin railing. Ornament, profiles and hand pose are simplified. Individual far windows preserve the near rhythm; far reduces curve samples, tick count and shaft trim rather than merging windows into bands.

## Verification and handoff

The procedural near-light contact sheet was inspected against the supplied reference sheet and the MD2 detail. Its open gaps beneath the balcony were incorrect; a closed tapered cornice casing was added before exported inspection. Focused tests pin the full 88 m height, mapped frame, tower-only ownership, individual window visibility, all four lettered dials, O counters, eight open belfry sightlines, crown gaps and merlons, corbel support contacts with a shortened-end negative case, grade and near/far silhouette.

Cityscape: **not tested yet**. Full 3D world: **not tested yet**. Integration is checked separately by the lead, including default extrusion replacement, terrain refinement, rigid foundation/pad behaviour, runtime shared material shading, lifecycle and Tesla performance. Independent visual approval remains separate from this builder's asset QA. No app server, runtime bundle, git write or online deployment is part of this asset delivery.

Export metrics, final screenshot evidence and deterministic results are appended after final validation.

## Final asset evidence — 2026-10-15

| Detail | Triangles | Draws | Bytes | KiB |
| --- | ---: | ---: | ---: | ---: |
| Near | 17,170 | 7 | 776,548 | 758.3 |
| Far | 10,064 | 7 | 454,252 | 443.6 |

The above costs are measured from the exported default scenes, not performance estimates. Both LODs have identical bounds and an 88 m maximum; their widest projected corners differ from the mapped outline by less than 0.30 m. `SPEC.ready = true` and the catalog record is ready for independent exported-asset review. No runtime integration is claimed.

Judged the final exported contact sheet `tmp/top-cities/shots/bromo-seltzer-tower/bromo-seltzer-tower-export-reference-contact.jpg`, showing references beside near/far daylight overview and detail, opposite facade, roof, street, night near/far overview and detail, night street and the mapped footprint top view. Underlying near/far × light/dark sheets are `bromo-seltzer-tower-glb-{near,far}-{light,dark}-sheet.jpg` in the same folder; the plan image is `bromo-seltzer-tower-glb-near-light-top.png`. This is an actual visual comparison, including the exported GLB, not a test-only sign-off.

Two visual correction rounds: the procedural sheet exposed open voids under the cornice, corrected with a closed taper; the exported comparison then exposed the casing masking the ribs, corrected by setting back that casing, lightening the grey metal and retaining distinct corbels/slots. The final comparison preserves lettering, clock annuli/hands, belfry openings, battlements and individual window rhythm in both LODs. Separate mechanical QA removed hidden band caps that caused depth cycles, removed an invisible interior shaft skin, closed the crown with an interior-sized cap, and corrected corbel face winding.

Deterministic evidence under `tmp/top-cities/bromo-seltzer-tower/`:

- `qa-metrics.json`: no issues, no coplanar overlaps, zero unresolved layered faces, 0.4% back-face sweep hits (below 2% gate), no below-grade components, no removable bridge attributes or unsupported-member flags.
- `depth-verification.json`: both LODs, zero dropped cycle edges; generated depth ranks checked current.
- `landmark-tests-final.log`: all 10 landmark tests pass in under 1 second on the final geometry.
- `conformance-final.log`: all three Bromo-Seltzer conformance tests pass against the final GLBs.
- `tests-final.log`: requested combined top-cities + landmark command ran; 839 passed / 1 unrelated failure in `cathedrale-saint-jean-lyon` (near GLB/source bounds changed during concurrent work). All Bromo-Seltzer checks passed. An earlier full run also passed all 840 checks.
- `catalog-final.log`: catalog valid, 406 entries / 790 GLB variants; earlier transient missing `gare-de-lyon-clock-tower` documentation resolved without edits here.

Only this landmark's authoring folder, catalog fragment, this document and three exports were changed, plus the explicitly authorized generated `src/peregrine/landmarks/depth-layers.js`. No other landmark or shared source module was edited. The lead still owns independent review and unobstructed Cityscape / Full 3D world application captures; both modes remain **not tested yet**.

Final catalog workflow also passed `pnpm assets:check` (406 entries / 790 variants) and `pnpm assets:preview`, producing the ignored local catalog at `tmp/champlain-preview/asset-catalog.html`; no server or publication was started. A concurrent writer replaced the generated depth table during this shared-tree build, so the Bromo-Seltzer entry was regenerated once more before final handoff; the lead should regenerate all delivered ids together when committing the batch.
