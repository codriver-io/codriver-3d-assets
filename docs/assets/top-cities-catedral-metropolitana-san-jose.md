# Catedral Metropolitana de San José

Original procedural exterior at Calle Central Alfredo Volio between Avenues 2 and 4, San José, Costa Rica, facing Parque Central. The exterior follows the **round green cupola caps in the February 2023 photograph**, also present in the January 2011 facade reference. The older pointed white tower caps in the dossier are not combined with that state. The model does not assert a field inspection in October 2026.

Source: `src/peregrine/landmarks/top-cities/catedral-metropolitana-san-jose/`, including the original geometry kit and six focused geometry tests. Build: `pnpm build:top-cities-landmarks catedral-metropolitana-san-jose --no-check`. Near/far GLBs and manifest are in `public/models/buildings/`. This is an authored approximation, not a surveyed architectural reconstruction.

## Evidence and geographic frame

- [OpenStreetMap way 264042444](https://www.openstreetmap.org/way/264042444): complete cathedral polygon, cathedral name/address, `building=cathedral`, `building:levels=4`; no height or roof tags. Dossier geometry was reused and the exact way fetched through the shared Overpass helper. The neighboring Curia Metropolitana (625816289) and Palacio Arzobispal are excluded.
- [Bernard Gagnon exterior, February 11, 2023, CC0](https://commons.wikimedia.org/wiki/File:Metropolitan_Cathedral_of_San_Jos%C3%A9,_Costa_Rica.jpg): gray cream stone, pale trim, round green tower caps, side cupola and facade proportions. File page and license checked.
- [Andy Rusch facade, January 9, 2011, CC BY 2.0](https://commons.wikimedia.org/wiki/File:Metropolitan_Cathedral_in_San_Jose,_Costa_Rica.jpg): six porch columns, three arched entrances, shallow porch pediment, urns, clock and broken attic crest. File page and license checked.
- [Dossier identity summary](https://en.wikipedia.org/wiki/Metropolitan_Cathedral_of_San_Jos%C3%A9): location on Calle Central and Avenues 2/4; original 1802 church destroyed by an earthquake. No published height was found in the supplied facts; no number below is presented as an authoritative vertical dimension.

All reference images remain in ignored `tmp/top-cities/catedral-metropolitana-san-jose/`. Additional dossier images on `refs-sheet.jpg` were inspected for comparison only; all titles/authors/licenses are preserved in catalog provenance. Museum chair and interior are not modelled. No downloaded photo, third-party mesh or texture enters source or exports.

Origin `[-84.07872089647573, 9.932770976079796]` is the mapped polygon area centroid. +X east, +Y up, +Z south, real metres; y=0 is the flat local pavement. Building axes have x across the frontage toward the south and z toward the west porch. Rotation **−95° about Y** is baked into every vertex. The facade faces bearing 275°. Two long mapped wall controls `[-84.0791222, 9.9328957]` and `[-84.0788022, 9.9328667]` give the nave direction about 96° eastward; rear side controls `[-84.0783693, 9.9329650]` and `[-84.0784006, 9.9325861]` confirm the roughly 5° cross-axis skew. 95° is the rounded compromise across the slightly irregular outline. No host rotation or latitude scale is needed.

## Dimensions

| Component | Model | Evidence |
| --- | --- | --- |
| Cathedral envelope length | about 82 m | mapped OSM polygon, including porch and rear wings |
| West frontage | about 27 m | mapped OSM west wall/porch |
| Rear envelope width | about 42 m | mapped polygon; not a claim about nave width |
| Highest tower crosses | 34.5 m | **estimated** from exterior proportions, not published |
| Porch shaft and order | shaft 2.35–10.3 m; cornice 12.9 m | estimated; six columns counted in facade photo |
| Stair | five rises to 1.2 m | estimated |
| Nave wall / ridge | 10.8 / 14.4 m | estimated |
| Front attic / crest | clock center 23.1 m; curved crest about 28.1 m | estimated |
| Belfry open stage | 21.3–29 m; clear arch width 2.65 m | estimated |
| Tower cupolas | radius 2.25 m; spring 31.13 m; crown 32.58 m | estimated |
| Side chapel cupolas | radius 3.6 m; spring 16.7 m; crown 19.7 m | estimated, with locations guided by the two mapped side projections |
| Plain pad radius | 53 m | covers the mapped envelope; rigid grade datum |

## Modelling and limitations

The mapped cathedral body is a polygon extrusion, cut back at the west to create an actual open portico. Recognition comes from the six fluted columns with bases and abstracted scroll capitals, broad layered cornices and urns, three round-headed entrances, central clock with hands/ticks, broken crest with a curved center, and the two square belfries. Every belfry has four arch holes, a crossbeam and suspended bell, retained in both detail levels. Each has a stepped parapet, louvered low drum, low round green cap and cross. Side windows have arched trims, mullions and engaged pilasters. Gray nave/aisle roofs contrast with green chapel and tower caps.

Near has genuine modeled shaft flutes, thin dome ribs, door panels, clock ticks and trim depth. Far drops those details, uses lower-segment domes/columns and front-only arch trims, while retaining silhouette, all six column gaps, belfry negative space, clock and crosses. Geometry is merged by eight named palette materials: stone, trim, shade, copper, roof, glass, bronze, glow. Night stone/metal is dimmed and nave windows are subdued warm self-lit faces; actual night lighting has not been surveyed.

Rear ancillary volumes, roof subdivisions and window distribution are inferred from the footprint and repeated vocabulary because the dossier has no clear rear photo. Side chapel proportions are estimated; the entry pediments and relief are simplified. Detailed sculpture, exact capital foliage, fences, trees, utility cables, street furniture, inscriptions and interior are omitted. Vertical accuracy should be treated as approximately ±2 m, not a few-percent published-dimension guarantee. The geographic body follows its polygon; cornices, engaged orders and relief can project up to 1 m beyond it, guarded by the vertex-distance test.

## Verification

The reference contact sheet was viewed, then two procedural near/light sheets at `tmp/top-cities/shots/catedral-metropolitana-san-jose/catedral-metropolitana-san-jose-procedural-near-light-sheet.jpg` were compared across facade, overview, street, portico, rear, roof, detail and top views. The first revealed side windows behind the irregular wall surfaces and excessively tall plain chapel bases. Window/trim planes were moved onto the exterior, chapel drums lowered, rear wing fenestration added, and rear roof articulation improved. The second established visible side rhythms and a clearer relationship of the low chapel domes to the tall facade; the attic then gained the curved broken crest instead of a plain triangle. Geometry checks also tightened south cornice and chapel-entry projection to within 1 m of the mapped ring.

Final GLB sheets and costs are recorded below. The concealed roof/facade junction was also trimmed after deterministic QA located coincident internal roof faces; the final run has zero coplanar pairs. The independent reviewer will judge these exports separately; author inspection is not that review.

## Placement handoff

Cityscape: **not tested yet, integration is checked separately**. Full 3D world: **not tested yet, integration is checked separately**. Flat rigid grade and a 53 m plain pad are used, with no DEM, exaggeration or scene heights baked into geometry. The central urban site is expected to be approximately level; a footprint/entrance DEM survey, neighboring road/pad-edge inspection and live lifecycle checks are still required. No shared runtime files or app rollout changed.

## Exported costs and final evidence

| LOD | Triangles | Draws | Bytes | KiB |
| --- | --- | --- | --- | --- |
| Near | 32,571 | 8 | 1,513,824 | 1,478 |
| Far | 6,379 | 8 | 290,328 | 284 |

Far is about 20% of near by triangles. Both fit the 60,000 / 14 / 2.5 MB near and 12,000 / 8 / 500 KB far caps, with matching bounds. These are exported default-scene costs, not measured Tesla performance.

The final comparison sheet **viewed by the author** is `tmp/top-cities/shots/catedral-metropolitana-san-jose/export-reference-comparison.jpg`: four rows of exported near/light, near/dark, far/light, far/dark, each next to the exterior reference, showing facade, street, rear, roof and belfry detail. The near/light GLB sheet additionally includes portico and top plan; an overview PNG is also available. Individual files follow `catedral-metropolitana-san-jose-glb-{near,far}-{light,dark}-{view}.png`, with four corresponding `-sheet.jpg` files. The final exports retain the twin low green caps, curved crest, clock, porch gaps and side-window rhythm in both palettes/LODs. The rear roof remains an explicitly inferred approximation; exact sculptural and lighting fidelity is outside this model.

`tmp/top-cities/catedral-metropolitana-san-jose/qa-metrics.json`: zero coplanar pairs, no removable bridgeLift, grade at zero, top 34.5 m, identical near/far envelope, 0.3% back-face hits in 305 hit rays (under the 2% gate). Focused tests cover the mapped length and orientation, height/grade/bounds, every porch shaft and gap, physical belfry openings and bells, clock/cupola materials, every vertex within the polygon plus 1 m cornice allowance, and far reduction. Shared conformance verifies exported metrics, material names and source/GLB bounds.

Final acceptance command: `node --test src/peregrine/landmarks/top-cities/top-cities.test.js src/peregrine/landmarks/top-cities/catedral-metropolitana-san-jose/catedral-metropolitana-san-jose.test.js` passed **127/127**, including all three cathedral conformance cases and six cathedral-specific tests; the six own geometry tests complete in about 0.3 s. `node scripts/asset-catalog.mjs` passed: 164 entries and 316 GLB variants at check time. Logs are under the landmark dossier as `focused-tests.log` and `catalog-check.log`. `SPEC.ready = true` and the catalog record is ready; independent review and live integration remain pending. Task constraints prohibit shared/runtime changes and dev-server workflows, so verification used the focused export, catalog and screenshot tools only.
