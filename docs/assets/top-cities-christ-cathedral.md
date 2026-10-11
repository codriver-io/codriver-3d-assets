# Christ Cathedral, Garden Grove

Original procedural exterior of Philip Johnson and John Burgee's 1980 Crystal Cathedral, rededicated as Christ Cathedral in 2019, and Philip Johnson's detached 1990 Crean Tower. The model covers the glass cathedral and the tower's prayer-chapel base; the Arboretum, Tower of Hope, visitor buildings and shrine remain outside its ownership. The campus address is 13280 Chapman Avenue; the mapped cathedral address is 12141 Lewis Street.

Editable source: `src/peregrine/landmarks/top-cities/christ-cathedral/`. Export with `pnpm build:top-cities-landmarks christ-cathedral --no-check`. Runtime exports are `public/models/buildings/christ-cathedral-near.glb`, `christ-cathedral-far.glb`, and `christ-cathedral.json`. The catalog record is `prototypes/assets3d/catalog.d/christ-cathedral.json`.

## Sources and provenance

Read the coordinator's OSM/facts dossier and six-photo Commons reference sheet first. Checked the exterior photo description/licence pages and the following primary sources on 2026-10-05:

- [Severud Associates, structural engineer](https://www.severud.com/cultural/garden-grove-community-church/): completed 1980, four-point plan, glazed walls and roof, 128-foot triodetic structure.
- [Christ Cathedral parish, cathedral](https://www.christcathedralcalifornia.org/campus-architecture/christ-cathedral/): Johnson/Burgee, 1980, exterior retained through the 2017–2019 restoration, 10,660 mirrored panels. Its listed 120-foot height and 141-foot length disagree with the structural account and map envelope; they are not used as the exterior envelope.
- [Christ Cathedral parish, Crean Tower](https://www.christcathedralcalifornia.org/campus-architecture/crean-tower/): 236-foot stainless-steel spire, completed 1990, 52-bell carillon, circular prayer chapel with 33 marble and 12 white columns.
- [Johnson Fain, renovation architect](https://www.johnsonfain.com/projects/architecture/spiritual-cultural/christ-cathedral/): east/west long axis, south Bishop's Door, completed conversion 2019, internal triangular shades producing evening glow.
- [OSM cathedral way 29280620](https://www.openstreetmap.org/way/29280620) and [tower way 120714044](https://www.openstreetmap.org/way/120714044): full footprints confirmed through the shared Overpass helper, 2026-10-05. Cathedral tagged 40 m, tower 73 m; published dimensions take priority for their heights. No building-part ways in the dossier cover additional authored components.

Photographs were consulted only; none is embedded, traced into a mesh or copied into runtime files. Full titles, author names, licences and checked page links are in the catalog. Exterior comparisons: Farragutful's *2018 Christ Cathedral campus – Garden Grove, California 01* (CC BY-SA 4.0), Wattewyl's *Crystal Cathedral on edge* (CC BY 3.0), and Arnold C/Buchanan-Hermit's *Crys-ext* (Attribution). Interior photographs in the supplied sheet informed the glass/steel structure but no interior is modeled. Geographic data retains OpenStreetMap contributor credit and ODbL terms. Geometry is original Codriver procedural work; no external mesh or texture.

## Frame and dimensions

Real metres, +X east, +Y up, +Z south; origin `[-117.89893, 33.7874]`. Grade y=0 is the flat entrance/plaza foundation. Coordinates are derived directly from mapped vertices using the repository geographic conversion; orientation is already baked and the host must not rotate it.

Two cardinal controls are north tip `[-117.8989106,33.7876837]` and south tip `[-117.8988970,33.7871144]`: the short axis faces 178.86° at the south entrance. West `[-117.8995883,33.7873999]` and east `[-117.8982027,33.7874046]` tips pin the long axis close to 89.77°. The mapped outline is slightly asymmetric; the model preserves this instead of rotating a nominal compass-aligned star. Footprint rings include the small northeast vestibule and separate tower, with no campus-wide replacement mask.

| Feature | Model | Evidence |
| --- | --- | --- |
| Cathedral outer plan | approximately 128 × 63 m | mapped OSM envelope; consistent with the 415 × 207 ft class historic dimensions |
| Glass shell maximum | 38.84 m; rim about 39 m | structural engineer 128 ft = 39.0144 m; 0.17 m clearance for roof frame |
| Crean Tower tip | 71.94 m including beacon | parish 236 ft = 71.9328 m; beacon adds 0.01 m |
| Tower base | mapped 9.2 × 9.7 m envelope | OSM way 120714044 |
| Cathedral concave roof valleys | 24.3 m | photographic estimate; exact steel roof elevations not available |
| Crossing and four tip crests | 38.84 m | estimated folded-roof arrangement under sourced maximum |
| Glazing panel pitch | roughly 1.75 × 1.25 m facade; 1.85 m roof grid | photographic simplification, not a literal 10,660-panel inventory |
| Far facade pitch | roughly 5.25 × 3.75 m | deliberate simplification preserving silver grid and folds |
| Steel spire | 24 triangular reeds at 3.7 m radius, staggered tips 64.7–71.9 m | photograph-based estimate; no fabrication drawing |
| Prayer chapel | 8.7 m diameter, 3.82 m roof; 33 perimeter columns | diameter/height estimated within mapped base; column count parish source |
| Bell cage | seven ranks, 52 simple bell bodies near | count sourced, sizes/placement/supports estimated |

## Geometry and materials

Eight planar roof facets meet on a high crossing, with sharp creases toward the four outer points and concave intermediate valleys. Regular rectangular panels are clipped against each roof triangle, including obtuse facets extending past their edge's projection. Facades similarly clip glazing rectangles against each sloping eave. Outward normals are explicitly oriented; no double-sided material conceals missing surfaces. Mullions sit 0.08–0.09 m proud; trims have independent thickness. Tall dark paired historic glass door bays on the short axis frame small current bronze pedestrian leaves. The cathedral is a closed opaque mirror-glass exterior, with no interior volume.

The Crean Tower has open steel prisms, staggered tapered tips, an open central cage, bell hangers tied to the reeds and a circular columned chapel. Its void remains open in far. Glass surface panels and trims are merged by material using `assetBuilder`; there is no draw per pane or column. Glass uses roughness 0.28/metalness 0.35; steel 0.30/0.65. The daylight palette uses muted blue-grey glass with small tint changes, silver steel, light stone and bronze. The dark palette dims the shell and steel while sparse `glow` panes and a small aircraft beacon represent lighting. This night lighting is illustrative: it approximates light through the renovation's petal liners without modeling those interiors. Far merges deep glass into glass and bronze into shadow, removes bells and inner reed strips, and keeps all tips and the silver grid.

## Approximations and placement

Roof fold depths and ridge arrangement are inferred from oblique photos rather than survey drawings. Glazing grids are coarsened and opaque; reflections are material shading, without environment/photo textures. The spire reed layout and bell shapes are representative; chapel interior and 12 inner white columns are omitted. No organs, shade petals, statues, landscaping, pools, roads, surrounding buildings or underground rooms. Cathedral and tower are rigid on local grade. This campus appears approximately level; no hill or site relief is baked in, and no terrainPad terraces are declared. `padM=69` covers only the immediate modeled extent with normal feathering; actual DEM foundation behavior needs app review.

Cityscape: **not tested yet, integration is checked separately**. Full 3D world: **not tested yet, integration is checked separately**. Duplicate provider removal, failure restoration, terrain arrival, mode transitions and actual Tesla performance are unverified. Independent visual review remains a coordinator/reviewer gate.

## Visual evidence and changes

All evidence stays in ignored scratch `tmp/top-cities/shots/christ-cathedral/`. Looked at the supplied `tmp/top-cities/christ-cathedral/refs-sheet.jpg` before authoring.

1. `christ-cathedral-procedural-near-light-sheet.jpg`: six views (overview, south facade, northwest back, roof, entrance and bell-cage detail). Strong pane colour changes looked too checkerboard-like; radial roof seams looked like a fan rather than the photographed parallel glazing. Reduced tint differences and rebuilt roof seams as a regular clipped planar grid; tuned glass/steel shading.
2. `iteration-2/christ-cathedral-procedural-near-light-sheet.jpg`: same six views; glass and open spire read more convincingly against the photos. Connected bell supports and beacon to the steel structure. The deterministic back-face sweep then located missing strips on obtuse roof facets; extended the clipping domain across the full triangle and added world-grid roof rays to pin closure. No further change to massing or footprint.
3. `final/christ-cathedral-exported-reference-sheet.jpg`: final exported GLBs alongside the three exterior photos, with near light front/back/above/entrance/detail/top plan, near dark overview/facade, far light facade/roof, and far dark overview/spire detail. Near/far silhouettes and ground contact match, red map rings align with both owned structures, and the night window accents remain sparse. These exported images are the review handoff, not evidence of runtime terrain integration.

## Measured exports and focused checks

| LOD | Triangles | Draws | Bytes | KiB |
| --- | ---: | ---: | ---: | ---: |
| Near | 23203 | 9 | 1550652 | 1514.3 |
| Far | 5350 | 7 | 334796 | 326.9 |

Both satisfy building caps 60k/14/2.5 MB and 12k/8/500 KB. `tmp/top-cities/christ-cathedral/qa-metrics.json`: zero coplanar overlaps, zero back-face hits among the seeded outside-in rays, zero removable bridgeLift bytes, minimum y=0 and matching far bounds.

`christ-cathedral.test.js` pins sourced height classes, mapped glass spans, roof tip/valley distinction, outward glazing on every facade, an open tower core, connected chapel and reed presence, both footprints, LOD envelope/cost and closed roof across a world-space ray grid. All six pass. The shared top-cities conformance checks for Christ Cathedral also pass, including GLB/source bounds, material names, manifest/catalog agreement and byte budgets. The final combined focused test run passed all 113 tests; `node scripts/asset-catalog.mjs` passed with 164 entries and 288 GLB variants after other workers' transient records settled. `pnpm assets:preview` built the ignored inspection catalog successfully. No shared file change was needed.
