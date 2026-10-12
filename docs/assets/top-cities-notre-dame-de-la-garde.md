# Notre-Dame de la Garde — Marseille

Original procedural reconstruction of the permanent Romano-Byzantine basilica, excluding temporary restoration scaffolds. The model represents the banded basilica, tower, gilded Virgin and Child, ribbed octagonal cupola, lower crypt/fort terrace and mapped northeast annex. Reference images are comparison material in ignored tmp only.

Sources: [Marseille Tourism](https://www.marseille-tourisme.com/en/discover-marseille/culture-heritage/discover-the-sites-and-monuments-in-marseille/notre-dame-de-la-garde-basilica/), [Diocese of Marseille](https://diocese-marseille.fr/notre-dame-de-la-garde/), [dimensional architectural description](https://en.wikipedia.org/wiki/Notre-Dame_de_la_Garde), and OSM dossier. Photo authors/licences and exact links are in the catalog record; Earth777's 2020 aerial (CC BY-SA 4.0) supplements the dossier's kallerna 2024 exterior and Robert Valette/Chabe01 dome details. Unrelated Étretat photo and city-only views were rejected.

## Frame and dimensions

Origin `[5.371, 43.2841]`; metres east/up/south. Geometry includes the 131° southeast nave bearing (northwest front 311°); no host rotation. Two wall controls `[5.3711555,43.2840943]` and `[5.3712066,43.2840614]` establish the mapped bearing. Main OSM envelope about 52 × 17 m, square tower about 8 m. Ownership covers ways 69137913, 1324841042, 69134510 and 69140037, including the separate bell-tower part and the northeast annex; neighboring buildings remain provider-owned.

| Feature | Model | Basis |
| --- | ---: | --- |
| Square tower datum | 41 m | Published architectural description |
| Cylindrical pedestal | 12.5 m, to 53.5 m | Published |
| Virgin and Child | 11.2 m, to 64.7 m | Published |
| Hill summit | 149 m above sea level | Context only; never baked into mesh |
| Upper parvis | 5 m above lower fort footing | Photo estimate |
| Nave eave / ridge | 22.35 / 26 m | Photo estimate |
| Cupola drum / cap / cross | 25–32 / 37.6 / 39.8 m | Photo estimate |
| Northeast annex roof | 5.05–7.2 m | Photo estimate |

`y=0` is the lowest authored fort footing, not absolute elevation. The upper promenade is at y=5; published stage totals are aligned to the tower's lower datum. Site relief is an architectural estimate, independent of the 149 m hill. Exact crypt/fort relief is not surveyed.

## Construction

Seven material batches: pale limestone `stone`, subdued green sandstone `green`, warmer carved `trim`, grey roof, dark glass, muted pink/red granite and gilded `gold`. No textures, meshes, fonts or image-derived vertex colours. Wall courses are physically partitioned around arched recesses. Near has five-bay blind tower arcades, louver blades, cornices, parapets, small corbel arches, sculpture groups, sixteen cupola ribs and sixteen pedestal columns. Far preserves the complete silhouette and arched window rhythm, open belfry and pedestal, with fewer ribs, coarser alternating courses and reduced balusters. Fine sculpture is abstract; interiors, mosaics and the full fort outside the bounded owned site are omitted.

## Verification and placement

Initial source sheet `tmp/top-cities/shots/notre-dame-de-la-garde/iteration1/notre-dame-de-la-garde-procedural-near-light-sheet.jpg` was opened: the roof gap beneath the dome was fixed, while the bell tower, dome and contrasting courses established recognition. Hidden course faces and small ornament were reduced for size.

Cityscape: **not tested yet, integration is checked separately**. Full 3D world: **not tested yet, integration is checked separately**. An explicit median lower fort pad uses three lower-site references; a separate +5 m terrace matches the raised upper promenade. No DEM samples or application screenshots have been captured by this worker. No hill is authored and no runtime feature gate changed.

## Final exported evidence — 2026-10-12

| LOD | Triangles | Draws | Bytes | Size (KiB) |
| --- | ---: | ---: | ---: | ---: |
| Near | 45,445 | 7 | 2,065,952 | 2,018 |
| Far | 10,631 | 7 | 459,200 | 448 |

Both variants fit their 60k/14/2.5 MB and 12k/8/500 kB limits. Their bounds are identical (top 64.7 m, minimum grade approximately zero); bytes are measured from exported default scenes. These are scene costs, not device performance measurements.

Actually opened and judged `tmp/top-cities/shots/notre-dame-de-la-garde/final/notre-dame-de-la-garde-export-reference-contact-sheet.jpg`: four rows near/light, near/dark, far/light, far/dark; six columns overview, entrance facade, back, roof, street and tower/statue detail; four reference photographs below. Full PNGs and separate variant sheets are alongside it. Earlier source/GLB sheets informed the roof closure and removal of overlapping pier/cap geometry. Final review confirms a slender square tower, open belfry, cylindrical columned pedestal, gold mother-and-child silhouette, banded nave, arched individual lights, ribbed octagonal cupola and stepped fort platform in both LODs. Night palettes dim the stone, sandstone and glazing; exact architectural floodlighting is not simulated. Statue/angel anatomy and fine relief remain abstract, while the fortress is a bounded simplified site rather than the complete hill. The far stripes are intentionally broader and the rib count reduced; individual arched windows remain separate.

Validation passed:

- Combined `node --test .../top-cities.test.js .../notre-dame-de-la-garde.test.js`: **403/403 passed**, including eight landmark-specific tests in well under three seconds.
- `node scripts/asset-catalog.mjs`: **266 records / 480 GLB variants valid** at validation time.
- `pnpm assets:preview`: built the ignored local catalog and inspector.
- `node scripts/landmark-depth-layers.mjs --ids notre-dame-de-la-garde --check`: current, **zero dropped cycle edges** for this landmark.
- Deterministic QA metrics: **ok**, zero coplanar overlap flags, zero unresolved layered-face issues, no below-grade geometry, no removable lift attribute and no far window-rhythm flags.

A geometric support test detected that the first optimized far cupola's twelve-sided shell did not meet every eight-rib foot. Changed its shell to sixteen radial segments and matched rib subdivision to the shell, then re-exported and rechecked the contacts. The test checks both endpoints against the named roof/drum and crown supports, excluding the ribs from support selection, and a deliberately shortened end fails. Further tests pin the 64.7 m top, open belfry/columns, five separate side lights per facade, two gold heads, continuous two-flight stairs and landings, mapped envelope and LOD bounds.

Shared-tree note: interim catalog/depth/metrics runs encountered the other worker's unfinished `docs/3d-top-cities-att-stadium.md`; the final combined checks succeeded after that file arrived. No other landmark or shared runtime module was edited. No git writes, app server, app bundle, deployment, full test suite or photo/texture commit was performed.

## Independent-review refinement — 2026-10-12

Post-like gold silhouette: gave the robe a wider hem, defined waist/shoulders and asymmetric connected mantle; offset the Child body/head and blessing hand outward and extended the supporting arm to match. Both LODs retain the 11.2 m statue, 64.7 m crown and two distinct heads; the existing sculpture ray/contact test now samples the revised Child position.

Opened and judged `tmp/top-cities/shots/notre-dame-de-la-garde/review-fix/notre-dame-de-la-garde-glb-near-light-sheet.jpg` and the matching `-far-light-sheet.jpg` against the supplied dossier/reference and reviewer findings. This was one look-fix iteration. All 437 combined dedicated and top-cities conformance tests pass; catalog validation passes (266 entries / 488 GLB variants), and the five-asset depth generation/check passes with zero dropped cycle edges.

| LOD | Before triangles / draws / bytes | After triangles / draws / bytes |
| --- | --- | --- |
| near | 45,257 / 7 / 2,062,520 | 45,445 / 7 / 2,065,952 |
| far | 10,563 / 7 / 457,928 | 10,631 / 7 / 459,200 |

Both remain within building budgets. The reviewer found the pictured footing/provider replacement acceptable for Vulcan, Griffith and Notre-Dame; this worker made no terrain or footprint changes and captured no new app shots.

Post-refinement deterministic QA: **ok**, no reported issues; `tmp/top-cities/freedom-tower-miami/review-fix-qa.json`. The ignored local catalog and inspector preview rebuilt successfully with `pnpm assets:preview`.
