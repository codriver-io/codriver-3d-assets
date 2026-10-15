# Zaanse Schans windmills, Zaandam

Original procedural group of five mills at their individual mapped positions on the east bank of the Zaan, viewed from the Kalverringdijk and opposite shore. The model represents the present preserved group, not an assertion that all five mills were erected here in the eighteenth century. No river, dyke, landscape, texture or photographic mesh is included.

The official [Zaanse Schans histories](https://www.dezaanseschans.nl/en/discover/windmills/) identify De Huisman (1786, now on Indië’s Welvaren), De Kat (paint mill), De Zoeker (oil mill, relocated here in 1968), De Gekroonde Poelenburg (1869 paltrok, moved here in 1963) and the six-sided Het Jonge Schaap reconstruction, finished in 2007. The [mill owner](https://www.zaanschemolen.nl/en/project/the-young-sheep/) confirms the reconstruction. Their different types and roof colours are retained, rather than repeating one octagonal template.

## Geographic frame and provider ownership

Origin `[4.81715, 52.47470]`; metres east/up/south; y=0 is rigid flat-map grade, with no sea-level, terrain datum or Mercator scale baked in. Mapped ways 285321223 (Huisman), 285317878 (Poelenburg), 285317879 (Kat), 837624418 (Zoeker upper mill), 285317882 (Zoeker attached lower workshop) and 285317884 (Jonge Schaap) are the exact owned provider outlines. The detached northern shed 285319696 and surrounding houses are excluded. Source OSM extracts are in ignored `tmp/top-cities/zaanse-schans-windmills/{mills,annexes}.json`.

The workshop ridge axes derive from their longest mapped edges. Kat control points `[4.8176945,52.4750478]` and `[4.817898,52.4751056]` establish the mapped facade axis; Zoeker’s annex is separately oriented from `[4.817669,52.4759833]` to `[4.8178848,52.4758009]`. Its outline is distinct from the upper mill. Geometry rotation is baked in. All sail planes face a static estimated bearing of 240 degrees; real caps rotate with the wind. The roughly 350 m group spacing follows OSM and is not compressed for presentation.

Provider rings describe buildings, not spinning sail envelopes: sails, galleries, cap crossbeams and eaves deliberately project beyond the walls. They must not mask unrelated houses, paths or the river. Each workshop is polygon-clipped to its own ring; the ground-contact tower bases lie in those rings. `padM=190` is the geographic range of the group, not evidence that a circular terrain pad is appropriate for the river bank.

## Dimensions and materials

| Mill | Hub height | Sail radius | Stage height | Sides |
| --- | ---: | ---: | ---: | ---: |
| De Huisman | 12.2 m | 6.6 m | 5.0 m | 8 |
| De Gekroonde Poelenburg | 12.4 m | 10.3 m | 3.3 m | paltrok buck |
| De Kat | 19.8 m | 11.7 m | 7.2 m | 8 |
| De Zoeker | 18.4 m | 11.2 m | 6.8 m | 8 |
| Het Jonge Schaap | 19.0 m | 11.5 m | 6.5 m | 6 |

Every vertical dimension in this table is a photographic estimate, not a published survey measurement. The plan envelopes/positions are mapped; dates/types above are sourced. Declared overall height 32 m allows for the static cross orientation. Estimated lower workshops have 3–3.4 m eaves and parallel 45-degree dark tarred gables subdivided across wide sheds so every ridge and verge remains at least 0.6 m below its own stage. Individual facade openings, caps, windshaft, gallery widths, green tie poles and sail lattice spacing are simplified photographic interpretations. Day uses subdued green paint, grey-brown thatch, dark tarred timber, green verge boards and cream stocks/rails. Dark uses the same palette keys; six used materials, dimmed; there is no invented night illumination.

## Scoped review g11ar fixes — 2026-10-15

Scoped review g11ar: every shed is divided into parallel 45-degree tarred gables where needed, with the ridge and verge relief below its own gallery by at least 0.6 m. Mill stages, green walls, caps, mapped positions and near/far lattice sails are unchanged; the mills now rise clearly above the sheds. Roof subdivision is a photographic approximation, not a surveyed roof plan.

| LOD | Triangles | Draws | Bytes | KiB |
| --- | ---: | ---: | ---: | ---: |
| near | 11,310 | 6 | 614,272 | 599.9 |
| far | 7,706 | 6 | 426,832 | 416.8 |

Exported near/far GLB sheets beside dossier photos: `tmp/next-200/fix/g11ar/zaanse-schans-windmills/comparison.jpg`. Both sheets were inspected for the scoped fixes. Focused regression tests pin shed ridge clearance/steep roof normals, the broad entrance scoop and continuous clerestory; all 17 tests across these two landmarks pass, including the existing named-support contact tests and shortened negative controls. Deterministic metrics report zero layered faces, zero material cycles and no issues; depth ordering was regenerated and checked.

Cityscape: **visually verified** in far/near/street app captures. Full 3D world: **visually verified** in far/near/street app captures with terrain enabled. Evidence: `tmp/next-200/fix/g11ar/zaanse-schans-windmills/app/{city,world}/` and `app-sheet.jpg`. Lifecycle transitions, per-footing DEM residuals, pad lattice coverage and real-device performance remain **not tested** by this scoped pass.

Shared checks: focused top-cities conformance **6/6 pass** for these two landmarks; the requested complete top-cities file **832/835 pass**, with concurrent Palais du Luxembourg (two checks) and Art Gallery of Alberta (source/GLB bounds) failures. Catalog/check/preview attempts are blocked by other landmarks being authored concurrently (logs in `tmp/next-200/fix/g11ar/{catalog,catalog-retry,assets-check,assets-preview}.log`); their files were left to their owners.
