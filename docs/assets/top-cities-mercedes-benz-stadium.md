# Mercedes-Benz Stadium, Atlanta

Original texture-free procedural model of the stadium at 1 AMB Drive NW, opened 26 August 2017. The exported state is a static mid-travel roof pose: eight triangular ETFE blades have strongly skewed pinwheel seams around an open octagonal aperture. The pose is an estimate of the documented linear-track motion, not a surveyed operating instant. It includes the unequal folded silver facade wings, recessed ground concourse and glazed panel grid, an interior stepped bowl, field and supported halo display. The demolished Georgia Dome in dossier photograph 1 and the pedestrian bridge in photograph 2 are excluded, as are plazas, trees and neighbouring buildings.

## Sources and frame

- [HOK project](https://www.hok.com/projects/view/mercedes-benz-stadium/): eight 220-foot petals, linear travel along 16 tracks, alternating metal/ETFE falcon-wing facade, 2017 stadium architecture.
- [Uni-Systems Engineering](https://www.uni-engineer.com/portfolio/mercedes-benz-stadium-atlanta-georgia/): eight triangular steel petals clad in ETFE, approximately 200-foot cantilever, roof mechanization and the opening state.
- [OSM way 536744534](https://www.openstreetmap.org/way/536744534): complete stadium envelope and `height=93`; dossier extract from the lead, ODbL 1.0.
- [Wikipedia](https://en.wikipedia.org/wiki/Mercedes-Benz_Stadium): identity, opening and address, cross-checked against the supplied dossier.

The origin `[-84.4008481722, 33.7554148380]` is the footprint area centroid, replacing the stub's approximate point 83 m east and 16 m north. Real metres, +X east / +Y up / +Z south; local y=0 is rigid flat-map grade. The actual mapped polygon is stored in `mercedes-benz-stadium-plan.js`; angular facade stations intersect this ring directly, so its rotation is already baked into both GLBs. No scene datum or latitude stretch is baked in. Two geographic controls on the south edge are `[-84.4012964,33.7542764]` and `[-84.4006283,33.7542597]`, an approximately 92-degree bearing. Provider replacement owns only stadium way 536744534; its complete ring is in `footprint.js`.

## Dimensions and approximations

| Item | Model / reference | Evidence |
| --- | --- | --- |
| Maximum roof elevation | 93 m | OSM height tag; not an independent survey |
| Full mapped envelope | about 300.7 × 257.3 m; 59,999 m² | OSM polygon |
| Authored facade envelope | about 275.6 × 246.0 m | mapped radial inset, measured geometry |
| Roof petal count / type | 8, skewed segmented ETFE surfaces | HOK and Uni-Systems |
| Published petal length | 220 ft / 67.1 m; cantilever about 200 ft / 61 m | HOK / Uni-Systems; not treated as the plan radius |
| Outer fixed deck / inner aperture | 182 × 146 m / 56 × 44 m | photo estimates; partly open state |
| Facade upper folds | about 64–82 m; inverted tips 9–22 m | photo estimates |
| Bowl / display | bowl to 52 m; display 65–77 m | estimates, simplified interior |
| Pitch | 106 × 69 m, surface y=1 m | approximate sports field, generic painted markings |

Eight unequal folded metal wings vary in mapped bearing, projection, top height and lower tip height. A recessed nine-metre glazed concourse forms a continuous ground-level frontage; wing folds join its upper boundary, and panel gutters provide coarse upright/bay rhythm in both LODs. The irregular upper facade ring is the exact fixed-deck boundary. A triangulated fixed deck closes the space to the roof's octagonal rim, avoiding missing radial triangles. Eight triangular ETFE blades with clockwise-shifted tips meet triangular metal heels to form a camera-aperture pinwheel. A broad in-plane frame strip outlines each blade; smaller triangular ETFE cells partition each blade, with no backing plane or coplanar overlay. The aperture and main blade seams are identical in near/far.

Metal panel courses, ETFE subdivisions, aperture dimensions, roof pose and interior geometry are estimates rather than surveyed fabrication detail. Text, branded logos, seat instances and roof moving machinery are omitted. ETFE and glass use opaque muted colours for the shared renderer; no transparency sorting or textures. The luminous inward display is a neutral placeholder without advertising. The night palette is stylized.

## Geometry and verification

Panel faces and their frame gutters partition each surface in plane; no backing face sits behind an inset panel. Eight structural ties connect the halo cap to the roof soffit. Landmark tests measure both named support contacts while excluding the frame/tie mesh, raycast the ties themselves and reject deliberately shortened free ends. Both LODs retain the eight facade folds, open aperture and coarse separate glazing panels.

The b1a review identified radial trapezoidal roof sectors and a repeated round-drum facade. Two look-fix iterations replaced these with triangular skewed blades, stronger main blade outlines, unequal projecting wings and the recessed concourse; the second look confirmed the pinwheel in near/far top and roof views and the clean grounded wing silhouette from both opposing and driver-height viewpoints. Final exported day evidence: `tmp/top-cities/shots/mercedes-benz-stadium/review-fix-2/contact.jpg`, assembled from `mercedes-benz-stadium-glb-{near,far}-light-sheet.jpg` in that folder. Near includes overview, facade, back, roof, entrance, detail and top; far includes overview, facade, roof and top. Driver-height facade/entrance presets now include the base and roofline at setback rather than extreme wall closeups. Night evidence uses the corresponding dark sheets in the same folder.

Compared against the supplied `refs-sheet.jpg`, especially exterior photographs 3–6; photograph 1's Georgia Dome and photograph 2's pedestrian bridge are excluded. The existing HOK roof-inspiration and Uni-Systems roof-underside images are rights-reserved reference only, kept in ignored scratch. [HOK](https://www.hok.com/projects/view/mercedes-benz-stadium/) and [Uni-Systems](https://www.uni-engineer.com/portfolio/mercedes-benz-stadium-atlanta-georgia/) describe the camera-aperture effect, eight triangular ETFE petals and straight-line movement; they do not establish this exact estimated mid-travel pose.

| Export | Triangles | Draws | Bytes | KiB |
| --- | --- | --- | --- | --- |
| Near | 22,126 | 8 | 1,732,904 | 1692.3 |
| Far | 5,446 | 8 | 431,816 | 421.7 |

Before review fixes: near 21,898 / 8 / 1,715,088 bytes; far 5,498 / 8 / 435,844 bytes. Both remain inside the building budgets. Geometry QA reports no issues, zero coplanar overlap pairs, no layered edges or material cycles and no retained bridge-lift bytes; see `tmp/top-cities/mercedes-benz-stadium/review-fix-metrics.json`. Depth regeneration and `--check` pass with zero dropped cycle edges. Six landmark tests validate grade/height/envelope, outside-in closure at multiple heights including the concourse, varied wing tips, roof opening and closed transitions, eight distinct planar skewed ETFE blades, all eight named halo tie contacts with a shortened-end negative case, and matching far silhouette/window rhythm. The requested conformance run is logged in `tmp/top-cities/mercedes-benz-stadium/review-fix-tests.log`; final counts are in the fix report.

## Delivery and integration

Rebuild with `pnpm build:top-cities-landmarks mercedes-benz-stadium --no-check`. Runtime files are `public/models/buildings/mercedes-benz-stadium-{near,far}.glb` and `mercedes-benz-stadium.json`. Catalog record is `prototypes/assets3d/catalog.d/mercedes-benz-stadium.json`, with seven inspection presets.

Cityscape: the prior b1ra review found a clean facade in `tmp/next-200/qa/b1r/app/city-b90/mercedes-benz-stadium-near.png`; the current export's application recapture is **not tested yet**. Full 3D world: **not verified**, pending new app evidence and independent re-review of b1ra's edge teeth and projecting base strips. Inspector sheets and the numerical DEM checks below do not certify app shading, terrain arrival, mode switching, road contacts or runtime lifecycle. No shared app bundle, app server or deployment was run. No shared files needed except the explicitly allowed generated depth-layer table.

Prior b1a review-fix checks: **406/406** requested conformance plus both landmark tests passed; catalog/assets check validated 266 entries / 472 GLB variants, and `pnpm assets:preview` built the local ignored catalog. Historical fix report: `tmp/top-cities/mercedes-benz-stadium/review-fix-report.md`.

## b1ra terrain and footing repair

The formerly independent floor polygon used a 0.898 OSM inset, extending beyond the concourse's sixteen-station 0.885 perimeter. The floor now terminates exactly at those grounded wall stations in both LODs, removing projecting dark plate strips. All vertices remain at or above y=0 and inside the owned OSM envelope; the roof, pinwheel blades, facade wings and panel rhythm are unchanged.

The terrain pad is distinct from provider ownership: `FOOTPRINTS` still replaces only stadium way 536744534. Its median datum retains the five original interior references. The pad includes a halo derived from `latticeStep(NEAR_LATTICE_Z)` plus every far-TIN node supporting the footprint perimeter, including cells crossed between OSM vertices. A 0.2 m numerical margin keeps those nodes inside the pad after geographic conversion; an 18 m feather reconnects it to the site's sloping DEM. There are no authored off-grade site terraces, so one rigid datum covers the stadium. The wider pad's approach-road and outer feather appearance remains an app-review gate.

The pad envelope is approximately 508.8 × 388.1 m, reflecting the coarse 127.1 m TIN cells rather than a surveyed stadium plaza; only the original OSM ring suppresses provider buildings. Inspect these widened terrain edges in the lead's recapture, especially the uphill western approach.

Measured using the same Mapzen/AWS Terrarium source as the b1r world captures, with the repository's `DemMosaic`, median-zone and `HeightField` implementations. The z13 interior reference heights are 307.48, 315.90, 308.37, 308.16 and 315.21 m; median 308.3651 m. The sixteen concourse footings sample raw DEM heights 307.93–318.46 m. Maximum absolute terrain-minus-foundation residuals:

| Lattice / DEM zoom | Real cell width | Previous pad | Current pad |
| --- | --- | --- | --- |
| z14 / z13, resident near terrain | 31.78 m | 0.547 m | < 0.000001 m |
| z15 / z13, finer check | 15.89 m | 0 m | 0 m |
| z12 / z12, coarse terrain arrival | 127.10 m | 4.405 m | < 0.000001 m |

The coarse DEM median is 308.2234 m; both terrain and rigid foundation refine together to the near datum. Reproduce with `node --preserve-symlinks-main tmp/top-cities/mercedes-benz-stadium/terrain-check.mjs`; source tiles and all footing samples are recorded in `terrain-residuals.json` beside it. These are actual DEM-backed numerical checks, not recaptured world screenshots.

One exported look iteration inspected `tmp/top-cities/shots/mercedes-benz-stadium/terrain-fix/mercedes-benz-stadium-glb-{near,far}-light-sheet.jpg`: clean grounded concourse, preserved roof/facade silhouette and retained far glazing rhythm. Costs changed from near 22,130 / 8 / 1,733,216 bytes to 22,126 / 8 / 1,732,904 bytes, and far 5,450 / 8 / 432,128 bytes to 5,446 / 8 / 431,816 bytes. Geometry metrics and depth check pass with zero material cycles. Eight stadium tests pass, including floor-to-wall contacts, a projecting-floor negative case and lattice-node coverage on a slope. The requested combined test run passed 404/406; its only failures are another worker's Westerkerk far triangle budget and stale near export bounds, unrelated to this stadium. Catalog and assets checks pass (266 entries / 486 variants), and local assets preview builds. The lead must recapture world b0/b90, pad edges and Cityscape before clearing the visible defect.
