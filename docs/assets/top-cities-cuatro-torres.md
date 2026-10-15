# Cuatro Torres — Madrid

Original procedural model of the four skyscrapers on Paseo de la Castellana 259 plus the shorter Caleido, authored 2026-10-15. The original towers were completed in 2007–2009; Caleido opened in 2021. The Cepsa name in the task/reference photographs refers to the tower now called Moeve. No tenant logo is reproduced.

## Identity and dimensions

| Tower | Height | Source / model decision |
| --- | ---: | --- |
| Moeve / Cepsa | 248.3 m | OSM outline and structural parts; Madrid Tourism rounds to 248 m |
| PwC | 236 m | OSM, CTBUH; curved three-sided shaft and green upper cap |
| Cristal | 249 m | OSM; owner rounds to 250 m; faceted 29 m sloping crown |
| Emperador / Espacio | 230 m | OSM and Madrid Tourism; square bottom transitions to a diagonal lozenge |
| Caleido | 181 m | OSM and ceiling supplier durlum; central thin slab, projecting 150 m wings |

Height is sourced/mapped. Facade module widths, band widths, equal row distribution, garden treatment, crown colours, entrance frames and 4 m low Caleido retail podium are visual estimates. The Caleido north/south podium blocks follow mapped 15 m parts. PwC near/far use 24/12 perimeter samples; Emperador uses 16/16 with a cosine transition matching its architect's geometric description. Fine curtain-wall engineering, interiors, signs, roof machinery and vegetation are omitted.

## Sources and rights

- [Madrid Tourism: Torre Moeve](https://www.esmadrid.com/en/tourist-information/torre-moeve): current identity and rounded height. Foster's old project URL currently returns 404, so it is not relied upon.
- [Cristal owner](https://www.torredecristal.com/): 52 floors, rounded 250 m height and faceted sculptural identity.
- [Pei Cobb Freed: Emperador](https://www.pcf-p.com/projects/torre-espacio/): square-to-lozenge transformation, nonorthogonal envelope and cosine profile.
- [PwC architect](https://rubioarquitectura.com/es/portfolio/torre-pwc/) and [CTBUH](https://www.skyscrapercenter.com/building/id/1039): identity and 236 m height.
- [Caleido project supplier](https://www.durlum.com/fileadmin/02_Projekte/PdM_PDF/PdM-22-07-torre-caleido-madrid-metalceiling-verticalbafflesystem-POLYLAM_EN.pdf): 181 m height.
- Mapped outlines: [Cepsa 188396764](https://www.openstreetmap.org/way/188396764), [PwC 98280725](https://www.openstreetmap.org/way/98280725), [Cristal 979555466](https://www.openstreetmap.org/way/979555466), [Emperador 98280735](https://www.openstreetmap.org/way/98280735), [Caleido 762323937](https://www.openstreetmap.org/way/762323937), plus 84 subsidiary parts; © OpenStreetMap contributors, ODbL 1.0. Complete captured data is in ignored `tmp/top-cities/cuatro-torres/site-osm.json`, converted from one OSM API map response after the shared Overpass helper failed.
- Photographs: dossier `refs-sheet.jpg` and `refs/SOURCES.txt`; Luis García / Zaqarbal, CTBA (Madrid) 36 and 31 (CC BY-SA 3.0); Eurostarshoteles, Cuatro Torres Business Area.JPG (CC BY-SA 3.0); Nd4284, MadridCTBA.jpg (CC BY-SA 4.0); Zarateman, Madrid - Cuatro Torres Business Area (CTBA) 01.JPG (CC0); Xauxa Håkan Svensson, Madrid Cuatro Torres Business Area02.jpg (CC BY-SA 3.0). Commons pages and exact links are in the catalog record. Images 1, 3, 4 and 5 were relied upon; their licence pages were checked.

No reference photograph, third-party mesh, scan, texture, font or logo is committed or embedded in the GLBs. Geometry is original procedural work; mapped geographic data retains its separate attribution.

## Geographic frame and replacement

Origin `[-3.68778,40.47778]`; real metres, +X east/+Y up/+Z south. Local y=0 means common flat entrance grade. Grid rotation 11.85 degrees clockwise from east is baked into the model; the host must not rotate again. One mapped control is the Cristal southern/northern long facade: its outer ring bounds transform to 53.97 × 37.98 m on that grid. A second is Cepsa's lintel: its mapped corners give 30.98 × 23.70 m and the same bearing (about 101.85 degrees from north). The mapped service-core notches are simplified inside the outline.

In the rotated authoring grid, Cepsa centre is [49.58,224.36], PwC [9.34,120.79], Cristal about [12.13,-51.28], Emperador [49.21,-160.83], Caleido central slab [-107.08,36.03] m. All five absolute longitude/latitude rings and all 89 provider way IDs are recorded. Rings include the full Caleido retail podium; intervening roads, separate retail buildings and unrelated plaza restaurants remain outside ownership. The vertex containment test checks the projected envelope.

The rigid asset carries no DEM, sea-level height or latitude stretch. Five bounded footprint pads with median datum are declared instead of a broad flattening disc.

## Geometry and materials

Cepsa has two silver service cores connected by a real lintel above an open 20.4 m crown gap; its three office stacks are separated by mechanical setbacks. PwC has a rounded three-sided mapped plan, three vertical silver seams and a muted green cap. Cristal has six principal facets, an asymmetrically sloped glazed roof and a stylized planted crown zone. Emperador's floor shape evolves from square to a diagonal curved lens. Caleido's black narrow main slab supports the lower projecting wings.

Eight merged materials in both LODs; exposed tiled curtain-wall quads replace one another instead of overlaying a solid wall. Lit offices are small discrete rectangles even within grouped far panes. Near keeps individual floor rows; far groups rows while retaining silhouette, windows, crown opening and setbacks. Geometry uses indexed shared vertices and drops the unused bridgeLift attribute. Local renders use palette light/dark; actual runtime shading still needs app review.

## Verification

The inspected evidence is `tmp/top-cities/shots/cuatro-torres/iteration1/cuatro-torres-procedural-near-light-sheet.jpg` and `tmp/top-cities/shots/cuatro-torres/final/verification-sheet.jpg`. The final sheet puts two dossier photos next to exported GLB front/back, roof, street, crown detail, entrance and plan views, near/far and light/dark. I looked at these sheets: the five-tower spacing, Foster opening/stack setbacks, PwC curve/green cap, Cristal sloped top and shorter black Caleido read in both LODs. Emperador and the Cristal garden remain stylized rather than detailed architectural reconstructions; independent review is still required.

The first look prompted smaller occupied-office rectangles and a joined Caleido wing/slab seam. Deterministic QA then prompted more far rows to preserve the window rhythm and a common Emperador sampling pattern to keep the two skyline envelopes closely aligned. Final near/far horizontal extrema differ by under 0.7 m, with identical grade and height. Final QA reports zero coplanar overlap, zero depth cycles/dropped edges, 0% back-face hits over 200 rays and no window-rhythm or unsupported-member candidates; no bridgeLift bytes remain.

| Export | Triangles | Draws | Bytes | KiB (rounded) |
| --- | ---: | ---: | ---: | ---: |
| Near | 38,279 | 8 | 1,959,164 | 1,913 |
| Far | 8,967 | 8 | 483,284 | 472 |

Repeatable export: `pnpm build:top-cities-landmarks cuatro-torres --no-check`. The far export has about 17 KB of byte headroom against the 500,000-byte cap; retain this limit when adding detail. Metrics are scene costs, not hardware performance.

The seven local tests pass in about 0.4 seconds: five independently raycast tower heights, Foster crown void/service cores/stack setbacks, Cristal slope and skyline gaps, Caleido wing-to-named-slab contacts and Foster lintel-to-service-core contacts (both include deliberately shortened failing controls and exclude the member itself from support measurements), all-vertex provider-envelope containment and LOD/budget checks. All three Cuatro Torres shared conformance checks also pass, including GLB/source bounds and manifest costs. The full requested focused command, before the final extra lintel-contact test was added, ran 807 tests: 805 passed and two unrelated Palais Bourbon checks failed because its ready record did not yet match its spec and its manifest was missing (`public/models/buildings/palais-bourbon.json`); no other landmark files were changed.

`node scripts/asset-catalog.mjs` passes (406 entries / 730 variants at that check). `pnpm assets:preview` passes and writes the local catalog under ignored `tmp/champlain-preview/`. `node scripts/landmark-depth-layers.mjs --ids cuatro-torres --check` passes after regeneration; the only shared owned exception changed is generated `src/peregrine/landmarks/depth-layers.js`. QA details are in `tmp/top-cities/cuatro-torres/qa-metrics.json`, test output in `tmp/top-cities/cuatro-torres/tests.log`.

Cityscape: **not tested yet, integration is checked separately**. Full 3D world: **not tested yet, integration is checked separately**. No runtime bundle, app server, online deployment or Git write was run. Provider replacement lifecycle, terrain refinement, reanchor, failed loads, streets/pad edges and hardware performance remain for integration review.
