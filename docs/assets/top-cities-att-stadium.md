# AT&T Stadium — Arlington, Texas

Original procedural exterior of the Dallas Cowboys stadium at 1 AT&T Way, opened in 2009; roof and retractable end doors closed. The model keeps the two monumental steel box-truss arches, four ground-rooted thrust blocks, outward-canted curtain wall, silver roof wings, pale central retractable panels and five-panel end glazing. No captured mesh, texture or photograph is shipped.

## Sources and dimensions

| Element | Model | Basis |
| --- | --- | --- |
| Arch bearing span | 373.38 m (1,225 ft) | [Walter P Moore, structural engineer](https://www.walterpmoore.com/projects/att-stadium) |
| Arch box width / maximum depth | 5.029 / 10.668 m (16.5 / 35 ft) | Walter P Moore |
| Arch crest above playing field | 89.002 m (292 ft) | [Birdair, membrane supplier](https://www.birdair.com/birdair-portfolio/cowboys-stadium/) |
| Playing field depression below street | 15.24 m (50 ft) | Walter P Moore |
| Highest point above model grade | about 73.71 m, SPEC 73.8 m | Published field crest minus depression; chord thickness included |
| Each end door | 54.864 × 36.576 m, five panels | Walter P Moore: 180 × 120 ft |
| Main roof envelope | about 302 × 233 m | [OSM roof part 126702664](https://www.openstreetmap.org/way/126702664) |
| Roof central aperture | 135 × 91 m | OSM retractable roof part 126702663; closed-panel shape from photos |
| Grade thrust-block height | 13 m | Estimated from exterior photos; subsurface foundation omitted |
| Arch axes | v = ±41.5 m | Four mapped foot structures; estimated symmetric fit |
| Roof field, cant, facade grid | 70.5 m crown, about 8% side expansion | Estimated from reference photos, not surveyed |

The engineer describes the moving panels as 256 × 410 ft each, while the mapped visible aperture differs. The procedural model follows the visible mapped aperture and does not assert a surveyed mechanism size. Arch curvature is reconstructed as a parabola; box depth tapers into the feet. The real engineered chord curvature and pin bearings are more complex.

## Frame and ownership

Real metres, +X east / +Y up / +Z south. Origin `[-97.09284, 32.74785]`; y=0 is street/plaza grade. The playing field and subsurface foundation are omitted. No DEM, altitude or Mercator stretch is baked into the mesh. Rotation is baked once: long axis at bearing 69°, equivalent to 21° north of east. OSM controls `[-97.0930752,32.7482030]` and `[-97.0923482,32.7484411]` on the aperture establish this bearing; the four long arch-foot strips independently agree.

Owned provider ways: 47086748 (stadium), 126702663 (retractable roof), 126702664 (fixed roof), 126704934 / 126704935 / 126704936 / 126705089 (four arch-foot structures). Their exact rings remain in `footprint.js`. Nearby buildings and parking facilities are excluded. The mapped bowl and roof stay within those ownership rings; finite-width steel and block corners can extend less than 3 m beyond the narrow foot outlines, explicitly tested. The four apron members run down to grade and meet their thrust blocks.

## Geometry and materials

The roof triangulates the concave mapped outline and clips every triangle on a shared planar grid before lifting it to the curved surface. Grid cuts include both moving-panel boundaries and the physical centre seam, so fixed roof, membrane panels and fascia use identical edge samples. The roof shoulders meet below the lower arch chords with clearance for the coarser far chords; the end glazing is partitioned against the exact piecewise-linear lower fascia edge in each LOD, with no inverted header or backing panes behind doors/jambs. Far drops header/side-pane borders while retaining door rows and side-wall rhythm. Every exterior curtain-wall cell consists of a pane and disjoint border quads in the same surface, avoiding backing-face overlap. End doors retain five broad panel divisions and separate rows in far. Near uses finer panes and 32 arch subdivisions; far uses coarser outline, panes and 12 arch subdivisions. Upper/lower chords, posts, diagonals and cross-members share one steel draw. Every terminal names a separate support; the test checks closest surface contact and verifies that shortening a cross-member produces a failing free end.

Eight named materials in both palettes: concrete, glass, door, steel, roof, membrane, seam and glow. Light colours are subdued grey metal and smoky blue-grey glass. Dark colours dim the envelope and light scattered ground-floor bays. Glass is opaque for deterministic low-cost rendering. No interior, seating, event graphics, roof logo or AT&T lettering is modelled. The broad roof profile and exposed thrust-block profiles are approximations; detailed glazing reflection, bearing hardware and roof machinery are omitted.

## Export costs

| LOD | Triangles | Draws | Bytes | KB (1024 bytes) |
| --- | ---: | ---: | ---: | ---: |
| near | 29,963 | 8 | 1,628,784 | 1590.6 |
| far | 7,818 | 8 | 431,924 | 421.8 |

Measured from exported default GLB scenes. Both are below the building limits (60k / 14 / 2.5 MB near; 12k / 8 / 500 KB far). Far and near bounds agree within 1.5 m. These metrics are geometry costs, not Tesla hardware timing.

## References and visual verification

Reference-only images live under ignored `tmp/top-cities/att-stadium/refs/`: `1.jpg`, Michael Barera, *Arlington June 2020 4 (AT&T Stadium)*, CC BY-SA 4.0; `2.jpg`, Murphpics, *ATT Stadium Parking*, CC BY-SA 4.0; `3.jpg`, Mbrstooge, *MDA Muscle Walk DFW 2013*, CC BY-SA 3.0; `aerial.jpeg`, *AT&T Stadium Aerial*, CC BY-SA 4.0, uploader XXBuilderXx (Commons leaves the author unspecified). The aerial is comparison-only and is not redistributed. File-page links are in the catalog record. `refs-sheet.jpg` was inspected alongside the rendered sheets.

Exported GLB contact sheets inspected at `tmp/top-cities/shots/att-stadium/att-stadium-glb-{near,far}-{light,dark}-sheet.jpg`: overview, glazed front, opposite end, roof, street-level doors and exposed arch-foot detail (plus near side elevation). A combined comparison sheet is `tmp/top-cities/shots/att-stadium/att-stadium-final-comparison.jpg`. Earlier comparisons led to replacing a generic oval with the concave mapped end notches, strengthening the five door jambs, closing the curved end headers, brightening the side glass, and simplifying far repetition. The same arch supports and closed roof silhouette survive far detail; ground-level views show the arch tails seated in the concrete blocks. Flat inspector renders establish export quality only.

## Checks and handoff

Nine focused landmark tests pin crest, span, doors, facade cant, sealed roof, named terminal contacts (including a failing shortened control), exact OSM ownership with bounded member relief, GLB round-trip budgets/material names, and zero layered faces in source and exported GLBs **without depth ranks**. The regression also raycasts the previously overlapping end-wall regions to reject stacked materials. All nine pass; the stadium's three registry checks pass. The complete registry run reports 409/412 passing with three unrelated concurrent-build failures (London Eye triangle budget/source-export mismatch and People's Salvation Cathedral incomplete footprint). Catalog validation was attempted and retried but is blocked by another builder's missing Cologne Cathedral documentation; the stadium-only QA fallback validates its exports. Asset-specific depth-layer regeneration/check passes with zero material-cycle edges. Final deterministic QA (`tmp/top-cities/att-stadium/b2r-fix-metrics.json`) reports **ok**: zero coplanar pairs, zero raw close layered faces in both LODs, 0.3% back-face hits (one of 319 rays; below the 2% threshold), and no window-rhythm flags. The generic member scanner does not select steel material names; the explicit named-support test covers every chord, post, diagonal and cross-member in both LODs.

Cityscape: **not tested**. Full 3D world: **not tested**. Integration is checked separately by the lead; no app server, renderer bundle or deployment was started. The lead still needs app screenshots in both modes, provider replacement and lifecycle checks, rigid pad/DEM footing and entrance checks, and independent visual review. No shared runtime code was edited; only the generated depth table is regenerated for this asset.

## Independent review fixes — 2026-10-12

Review b2b identified cracks caused by independently subdivided curved roof triangles and a roof profile burying most of the box-truss depth. Shared grid cuts now replace recursive subdivision, including both membrane boundaries and the outer fascia. A welded-edge incidence test checks the actual roof triangles and rejects any unmatched interior edge in near and far. The revised shoulders leave the lower chords visibly continuous from crown to their supported end legs; raycasts independently verify clearance in both LODs. End glazing closes to the new roof height, and zero-area faces are discarded. Arch span, crest, member contacts, footprint ownership and five-panel doors are unchanged.

Judged exported sheets: `tmp/top-cities/shots/att-stadium/review-fix/att-stadium-glb-{near,far}-light-sheet.jpg` (first iteration), and `tmp/top-cities/shots/att-stadium/review-fix-final/att-stadium-glb-near-light-sheet.jpg` and `att-stadium-glb-far-dark-sheet.jpg` (second and final iteration). They include overview, end facade, reverse end, roof, street, side and support detail. The final street preset uses a 1.6 m camera outside the end facade, framing the doors and both feet rather than cropping the roof. The lead recaptures app shots in both modes; inspector images do not verify application rendering or terrain.

Near cost changed from 29,915 triangles / 8 draws / 1795.0 KiB to 23,879 / 8 / 1269.8 KiB; far changed from 7,264 / 8 / 433.0 KiB to 6,786 / 8 / 367.5 KiB. All eight dedicated stadium tests, eleven museum tests and all 399 registry tests pass. Catalog validation passes (266 records / 488 variants); depth regeneration/check reports zero material-cycle edges for these two assets. Remaining: lead app recapture, provider/terrain lifecycle verification and independent re-review, with both mode labels kept **not tested** until those gates close.

## End-glazing regression fix — b2r, 2026-10-12

Lead QA found near roof/glass, door/glass and steel/glass overlap after the sealed-header fix (86 m² close layered faces and 72 coplanar pairs); far had 58 m² of layered faces. The old header started at the published door height even where the lowered roof shoulders fell below it, producing inverted polygons; broad header polygons also crossed the sampled fascia and door perimeter. The new end-wall envelope takes its top vertices from actual exported roof-cell boundaries, then clips it into disjoint regions for glass, doors and jambs. Borders fill only pane margins; no backing quad remains. Near retains fine door and header grids; far retains five major door divisions and separate rows, and drops the fine glass-header borders. Roof skin, lower-chord clearance, arch contacts, ownership and driver-height view presets are preserved.

Judged exported sheets (one look-fix iteration): `tmp/top-cities/shots/att-stadium/b2r-fix/att-stadium-glb-near-light-sheet.jpg` and `att-stadium-glb-far-dark-sheet.jpg`, each with overview, both ends, roof, street, side and support detail. They show sealed end shoulders, clean door/header boundaries and continuous roof/arches. Near changed from 23,879 triangles / 8 draws / 1269.8 KiB to 29,963 / 8 / 1590.6 KiB; far from 6,786 / 8 / 367.5 KiB to 7,818 / 8 / 421.8 KiB. Both remain within hard budgets. App screenshots, both-mode provider/terrain/lifecycle verification and independent re-review remain the lead's separate gates; the mode labels above remain not tested.
