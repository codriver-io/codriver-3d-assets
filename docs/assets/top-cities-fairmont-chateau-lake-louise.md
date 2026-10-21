# Fairmont Chateau Lake Louise

Original procedural, texture-free model of the CPR resort at 111 Lake Louise Drive, Lake Louise, Alberta. The model includes the Painter/Barott lakeshore elevation, Glacier return, Mount Temple wing and the low curved retail/parkade connection. Lake Louise, Victoria Glacier, mountains, landscaping, detached newer spa and neighboring service buildings belong to the basemap and are excluded. `SPEC.ready = true` describes exported asset readiness, not in-app certification.

## Identity and sources

Sources checked 2026-10-15:

- [Fairmont official history](https://www.chateau-lake-louise.com/about-us/our-history/): CPR railway-hotel identity, Painter's surviving concrete wing, Barott replacement and later expansions.
- [Fairmont official property page](https://www.fairmont.com/en/hotels/lake-louise/fairmont-chateau-lake-louise.html): location, lake/glacier setting and named Mount Temple accommodation.
- [Chateau Lake Louise](https://en.wikipedia.org/wiki/Chateau_Lake_Louise): eight floors; Painter 1913, Barott 1925 following the 1924 fire, Mount Temple 2004. The task's “1925 Painter” label is corrected here: 1925 is Barott.
- [Fairmont property and hotel map, 2023](https://thewcd.ca/Content/ExternalSite/Events/PR2023/cll-hotel-map-2023.pdf): wing identities, Glacier return, curved parkade/retail connection, arrival court and Mount Temple ballroom. Read both rendered pages (`tmp/top-cities/fairmont-chateau-lake-louise/property-{1,2}.png`); used for reference only.
- [OSM hotel multipolygon 18238906](https://www.openstreetmap.org/relation/18238906), outer ways [260945633](https://www.openstreetmap.org/way/260945633) and [1329996412](https://www.openstreetmap.org/way/1329996412): geographic outline. The dossier identified a relation without member geometry; one shared-helper query retrieved its two outer members, saved in `tmp/top-cities/fairmont-chateau-lake-louise/osm-full.json`.

The member ways are open polylines that join into one closed ring, not two independent buildings. Both exact provider way IDs are retained in `OSM_WAYS`; the separate way 128099235 southeast of the hotel is not modeled or owned. No survey height or reliable published metric roof height was available: vertical dimensions below are explicitly photographic estimates.

## Dimensions and geographic frame

| Property | Value | Evidence |
| --- | --- | --- |
| Origin | -116.21705, 51.41768 | Dossier anchor, retained near historic hotel |
| Complete owned envelope | 306.84 m east-west × 159.80 m north-south | Measured from joined mapped outline and exported bounds |
| Barott lakefront control A | -116.2178131, 51.4179033 | OSM ring vertex 55 |
| Barott lakefront control B | -116.2172083, 51.4174561 | OSM ring vertex 54 |
| Control-edge length / axis bearing | about 65.1 m / 140.2° | Derived from A/B; geographic frame test |
| Lakefront outward bearing | 230.2°, southwest | Perpendicular to mapped Barott control edge; faces lake to west/southwest |
| Historic hotel floors | 8 | Dossier/Wikipedia; individual wings differ |
| Barott eave / highest roof ridge | 31.5 m / 40 m | Photographic estimate |
| Painter eave / ridge | 28.5 m / 36 m | Photographic estimate |
| Glacier eave / ridge | 31.5 m / 39 m | Photographic estimate |
| Mount Temple eave / ridge | 22 m / 31 m | Photographic estimate |
| Curved connection roof | 6.5 m | Photographic/property-map estimate |
| Roof dormers and window dimensions | Parameterized estimates | Reference images; no survey claims |

Units are real metres, +X east, +Y up, +Z south; y=0 is the flat local foundation. Source transforms longitude/latitude using the spherical Mercator frame divided by origin stretch; no app runtime code is imported. Geographic rotation is baked into the GLBs once. No absolute altitude, DEM or latitude scale is baked into vertical coordinates. A bounded `terrainPad` follows the full hotel outline, with three in-footprint reference points, median datum and 12 m feather. `padM: 60` satisfies the shared spec/fallback contract; the explicit ring takes precedence in `building-layer.js`. Terrain behavior remains untested.

## Modeling decisions

The complete outline provides a grounded low stone podium and curved rear roof, with separately parameterized tall hotel wings. Upper facade planes are cut around individual recessed panes rather than backed by coplanar wall faces. Ground-floor openings have round heads. Rows remain separate at far detail, with wider bay spacing, reduced arch segmentation and omitted ordinary window reveals; far panes sit flush in their cut-outs, so no far recess is see-through. Both LODs retain the steep hipped roof silhouette, gabled dormers, octagonal lakefront projections and arrival court opening.

Original indexed surfaces carry explicit outward normals and merge by six material names: warm cream `stone`, subdued sandstone `base`, muted verdigris `copper`, charcoal `roof`, dark `glass` and a restrained fixed subset of night `glow` panes. No texture, retained mesh, scan, external geometry package or photograph ships. The model contains no free-ended beam/cable/walkway or separate canopy; those terminal-support tests are N/A. Roofs and bays meet the grounded wall volumes.

Photographic approximations include exact dormer arrangement, pane counts, entrance geometry, cream roof-edge ledges, roof pitch and wing heights. Upper wings are simplified planar massings; carved detail, precise cornices, lettering, chimneys, interiors, subtle wall setbacks and newer works are omitted. The single rigid grade does not claim to reproduce the site's actual foundation levels. One attached lakefront bay projects at most 0.96 m beyond the coarse mapped edge; tests pin that bounded allowance (`ownTolM: 1`). The model's monochrome dormer cheeks simplify the photos' light stone surrounds. Fine ornament and night illumination need independent likeness review.

## Export costs

Measured default-scene GLBs, without compression or textures:

| LOD | Triangles | Draw calls | Bytes | KiB rounded |
| --- | ---: | ---: | ---: | ---: |
| Near | 29,095 | 6 | 1,448,388 | 1,414 |
| Far | 8,879 | 6 | 413,316 | 404 |

Bounds are identical in both LODs: x -116.256 to 190.587, y 0 to 40, z -80.062 to 79.738 m. Costs fit the 60k/14/2.5 MB and 12k/8/500 KB caps. No removable `bridgeLift` data remains. These are scene counts, not measured Tesla hardware performance.

## Visual evidence and checks

Read the dossier `refs-sheet.jpg`, the numbered footprint plan and the two property-map pages. Then inspected the exported near/light contact sheet, fixed the skewed Barott roof corner and an upper-wall spur, closed dormer backs, added arched lower openings and re-exported. Final comparisons, each containing reference photographs beside all six rendered views, were read at:

- `tmp/top-cities/shots/fairmont-chateau-lake-louise/final/near-comparison.jpg`
- `tmp/top-cities/shots/fairmont-chateau-lake-louise/final/far-comparison.jpg`

Each comparison covers lakefront facade, opposite/back side, roof/above, arrival entrance and close roof/facade detail in light and dark. Final individual sheets are `fairmont-chateau-lake-louise-glb-{near,far}-{light,dark}-sheet.jpg` in that directory. Also read `fairmont-chateau-lake-louise-procedural-near-light-sheet.jpg`; source and export appearance agree. Roof views include the mapped red footprint overlay; the geographic-envelope test independently checks all mesh vertices.

`qa-metrics.mjs --ids fairmont-chateau-lake-louise` reports **ok**, including zero near coplanar pairs, 0% near backface hits over 230 intersecting rays, no layered-face issues, preserved far window rhythm, no unsupported-member candidates and no byte/bounds violations. Durable own QA: `tmp/top-cities/fairmont-chateau-lake-louise/qa.json`. Depth generation reports zero dropped cycle edges; the final sequential regeneration/check passed “Depth layers current (1 models)”.

The five landmark tests assert mapped provider ownership/bearing, 40 m maximum, grade and every-vertex envelope, identical near/far bounds, stepped wing/roof heights, genuinely open arrival court, low curved connection, discrete far pane rows/dormer caps and in-footprint terrain references. A focused pattern run passed all eight own checks (five landmark and three shared-conformance checks), recorded in `tmp/top-cities/fairmont-chateau-lake-louise/own-tests.log`. The combined top-cities test result is recorded in `tmp/top-cities/fairmont-chateau-lake-louise/focused-tests.log`; the final run passed **886/887**, with only the unrelated in-progress `edificio-inteligente-epm` failing because its catalog ready status differed from the spec snapshot. All eight Lake Louise tests passed; no other landmark files were changed. Earlier transient Wembley/Templo source/export mismatches were absent from the final run. Catalog validation passed 425 records / 818 variants, and `pnpm assets:preview` built the ignored local catalog. Independent visual review is still required.

Repeatable commands:

```sh
pnpm build:top-cities-landmarks fairmont-chateau-lake-louise --no-check
node scripts/landmark-depth-layers.mjs --ids fairmont-chateau-lake-louise
node scripts/landmark-depth-layers.mjs --ids fairmont-chateau-lake-louise --check
node --test src/peregrine/landmarks/top-cities/top-cities.test.js src/peregrine/landmarks/top-cities/fairmont-chateau-lake-louise/fairmont-chateau-lake-louise.test.js
node scripts/asset-catalog.mjs
node .agents/skills/build-3d-city/scripts/qa-metrics.mjs --ids fairmont-chateau-lake-louise
```

## Review fixes (2026-10-21)

The window code assumed that any wall starting at grade was the podium, so each octagonal lakefront bay got only one arched pane per facet, at 1.4–4.9 m, and nothing above it. In far, `floor(3.06–4.59 / 4.8) = 0` left the bays with no panes at all. `walls()` now takes explicit row options instead of keying on `y0 === 0`: the podium and entrance gables keep the arched `arcade` row, and the wings keep the 3.25 m `storeys` rhythm from 8.4 m. The bays get both, so their storey rows match the adjacent wings. A narrow bay facet keeps one 1.25 m pane per row in both LODs, so far no longer drops them.

Checked against the mapped outline, the bays stand mostly inside it: their centres are 3.6–7.0 m inside, and most facets lie within the podium and the Painter, Barott or Glacier wing volumes. A pane is kept when at least half its width (five samples 0.3 m outside the wall) faces open air rather than the podium, a wing block or a wing's hipped roof. On a partly buried facet, a lone pane slides to its most exposed position. This removed 24 near arched panes that were hidden inside the podium. The visible results:

- Barott/Glacier corner bay, both faces of the 0.95 m wedge that projects beyond the mapped edge: an arched pane plus 7 storey panes over the full 32 m height, previously blank above 4.9 m.
- Painter/Barott bay and Glacier end bay: a top-storey row in the stubs above the wing eaves.

That gives 26 visible bay panes in both near and far, up from 0 exposed panes in either. Seven facets are exposed only 0.3–0.5 m above an eave, too little for a 1.85 m row, and stay plain.

Window recesses no longer let rays through, in either LOD:

- Far panes in `walls()` and on the wing dormers sit flush in their cut-outs; the old 0.55 m reveal-less recesses were see-through.
- Near arched panes now fill the whole boxed recess, so no gap opens behind the stone arch head.

Angled rays (30° and 50°) from open air into every pane opening:

| Rays seeing through | Before | After |
| --- | ---: | ---: |
| Far, bay panes | none existed | 0/820 |
| Far, wing and dormer panes | 10,017/46,970 | 0/46,993 |
| Near, bay panes | none exposed | 0/820 |

The closed arch-head gap was the only route by which any old bay arcade pane was reached from outside: just 2 of 3,150 rays, on the Painter/Barott bay's southeast-facing facet. So the arcade row still gets no pane on bay facets that lie 3–8 m inside the podium; their open-air share is 0.

Remaining near leaks are pre-existing and outside the bay work: 118 rays clip the tops of wing dormer panes, which rise past the dormer cheeks, and 24 rays leak at a few facade window edges.

The bays still sit almost entirely inside the mapped outline, unlike the clearly projecting towers in the photos. Moving them outward would exceed the 1 m ownership tolerance and is not part of this fix. `qa-metrics.mjs` still reports **ok**, with no layered or coplanar faces, 0% near backface hits and unchanged bounds. These exports come from a `CODRIVER_ASSET_BATCH=1` build without license stamping, so the license metadata has not yet been re-applied and the published byte counts will change slightly when it is. Cityscape and Full 3D world were not re-tested after this change.

## Placement and integration handoff

Cityscape: **not tested yet, integration is checked separately**. Full 3D world: **not tested yet, integration is checked separately**. No runtime layer, provider mask implementation, app server or deployment was changed. A local contact sheet does not certify either mode.

## Reference rights

Compared only, retained in ignored `tmp/top-cities/fairmont-chateau-lake-louise/refs/`:

- Mack Male, [“Lake Louise (32555551383)”](https://commons.wikimedia.org/wiki/File:Lake_Louise_(32555551383).jpg), CC BY-SA 2.0. Modern facade, snow and roof contrast; Commons license page checked.
- G. Lamar, [“Late in the Evening at the Chateau (50005960142)”](https://commons.wikimedia.org/wiki/File:Late_in_the_Evening_at_the_Chateau_(50005960142).jpg), CC BY 2.0. Evening facade/arrival and tall end-bay silhouette; Commons license page checked.
- The Coast Publishing Co., [“Lake Louise Chateau, Canadian Rockies”](https://commons.wikimedia.org/wiki/File:Lake_Louise_Chateau,_Canadian_Rockies.jpg), public domain per dossier. Historical proportions only, not current roof state.
- BrettA343, [“Lake Louise area from Ski Louise”](https://commons.wikimedia.org/wiki/File:Lake_Louise_area_from_Ski_Louise.jpg), CC BY-SA 4.0 per dossier. Setting only; no building detail derived.

Original procedural model/source by Codriver. Mapped geographic data © OpenStreetMap contributors, ODbL 1.0. No outside creator mesh or image is redistributed; Fairmont map is reference-only. All reference URLs and declared licenses are in the catalog record.
