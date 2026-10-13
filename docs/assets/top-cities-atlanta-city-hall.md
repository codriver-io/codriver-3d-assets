# Atlanta City Hall

Original procedural model of G. Lloyd Preacher’s 1930 Atlanta City Hall, Mitchell Street, with the attached 1989 Trinity Avenue annex. The cream terra-cotta tower, olive spandrels, pronounced setbacks, pointed entrances and tracery-concealed green pyramidal roof define the landmark. No image, texture, scan or third-party mesh is shipped.

Build: `pnpm build:top-cities-landmarks atlanta-city-hall --no-check`. Source folder: `src/peregrine/landmarks/top-cities/atlanta-city-hall/`; catalog record: `prototypes/assets3d/catalog.d/atlanta-city-hall.json`.

## Sources and dimensions

- [City of Atlanta preservation description](https://www.atlantaga.gov/government/departments/city-planning/historic-preservation/property-district-information/atlanta-city-hall): cream and olive terra cotta, setback architecture, concealed shallow pyramidal roof and 1989 annex; page indexed but direct fetch returned 403.
- [HABS GA-2166](https://tile.loc.gov/storage-services/master/pnp/habshaer/ga/ga0400/ga0460/data/ga0460data.pdf): historic 15-floor description and tower measurements; historic dimensions are not treated as a current surveyed OSM envelope.
- [Wikipedia](https://en.wikipedia.org/wiki/Atlanta_City_Hall): 1930 completion, G. Lloyd Preacher, current building and later annex.
- [OSM outline 113041909](https://www.openstreetmap.org/way/113041909), plus all three provider parts 883956342, 883956343, 883956344: dossier Overpass geometry and height, checked 2026-10-13. Exact geographic rings are preserved.
- [Front photograph](https://commons.wikimedia.org/wiki/File:Atlanta_City_Hall_(223).jpg), Atlantacitizen, public domain; [side/ornament photograph](https://commons.wikimedia.org/wiki/File:Atlanta_City_Hall,_Atlanta,_GA_(46751455774).jpg), Warren LeMay, CC0. Checked licence pages, used only as reference. Dossier NARA panoramic photograph, unknown author, public domain, establishes historic broader base. Other dossier images are a map and obsolete city hall, excluded. A second fetched photo proved to be an interior event and was excluded.

| Quantity | Model | Evidence |
| --- | --- | --- |
| Maximum height | 66.6 m | OSM tower/outline; published summaries often round to 65 m |
| Storeys | 3 base + 9 shaft + 2 setback + attic | photographic/historic 15-floor interpretation; OSM lists 17 |
| Historic base | approximately 47 × 45 m including connector | mapped composite outline |
| Main shaft | 22.5 × 20.9 m | fitted within current OSM tower ring |
| Shoulder levels | 49.2 / 58 / 64 m | photographic estimates |
| Upper setbacks | 17.2 × 17.6 / 13.4 × 14.2 m | photographic estimates |
| Pyramid | 12.2 × 13 m, 2.25 m rise | photo/official description, estimated |
| Annex roof | 19.5 m | mapped six storeys, estimated height |
| Bays, tracery and entrance proportions | repeated procedural apertures | photographic estimates, not survey detail |

## Frame and decisions

Origin `[-84.39028,33.74889]` is a nearby tower anchor from the supplied dossier. Real metres, +X east, +Y up, +Z south. Rigid flat pavement is y=0; no DEM, absolute elevation or latitude stretch is baked in. Tower control points `[-84.3904456,33.7489443]` and `[-84.3903191,33.7491028]` establish the approximately 34° northeast direction; its perpendicular facade runs approximately 124°. Rotation −34° is baked once, and the Mitchell Street front faces 34°.

The provider ownership includes the entire outer envelope and all three parts: historic tower, U-shaped base and six-storey annex with rounded Trinity Avenue entrance. Nearby courthouse, apartments, church and other government buildings remain unowned. Historic lower walls use the union outline; the podium roof keeps the upper tower clear. The annex uses the complete mapped notched ring. There is no plaza slab over streets, and the internal shared connection has no duplicate outward wall below the historic roof.

Cream `stone`, white marble `marble`, dark `glass`, olive `spandrel`, muted `trim`, subdued green `roof`, and sparsely lit `light` windows use matching day/night palettes. Apertures are actual holes with closed reveals, recessed 0.30 m near and 0.65 m far. White piers and olive spandrels occupy disjoint facade cells. Near adds casement mullions and pointed parapet perforations; far retains separate window bays/rows, all setbacks, the shallow pyramid and solid parapet profile. Tiny reliefs, flags, exact tracery motifs, interior, landscape and garden are omitted. The modern annex facade and crown dimensions are approximations.

## Verification

Measured default exported scenes:

| LOD | Triangles | Draws | Bytes | KiB |
| --- | ---: | ---: | ---: | ---: |
| near | 32,639 | 7 | 1,502,132 | 1,467 |
| far | 9,633 | 6 | 442,476 | 432 |

The focused landmark tests pass 6/6; the three selected conformance tests pass 3/3. The requested combined test command completes with 623 passing / 1 failing: only the unrelated Washington National Cathedral far export (0.51 MB against the 0.5 MB cap). Both Atlanta bounds are identical, with grade 0 and top 66.6 m. `qa-metrics.mjs --ids atlanta-city-hall` reports no issues: zero coplanar/layered conflicts, 0% back-face hits, no window-rhythm or member-end warnings and no removable lift attributes. `landmark-depth-layers.mjs --ids atlanta-city-hall` generates zero dropped cycle edges, and its selected-id freshness check passes. Only the allowed generated depth table was changed outside the landmark’s owned files.

I looked at `tmp/top-cities/shots/atlanta-city-hall/atlanta-city-hall-final-comparison.jpg`: reference photographs beside exported GLBs, front/back/roof/entrance/crown in both near/far and light/dark. I also inspected `atlanta-city-hall-glb-near-light-top.png` in that directory for orientation and red footprint containment, and the procedural near/light contact sheet before corrections. First inspection exposed reversed facade winding, which was corrected and raycast-tested; subsequent comparison prompted replacement of fence-like crown rails with continuous tracery parapets and correction of excessive portal bay counts on the shorter front segments. Final comparison preserves the vertical pale shaft, olive panels, setbacks, crown and separate far windows. Exact relief motifs, marble portal sculpting, annex facade details and night lighting remain simplified estimates; no known geometry defects remain.

The regular batch exporter initially hit other workers’ missing UT Tower/MuCEM helper modules; it subsequently completed successfully for this landmark and generated the final files above. Catalog validation was attempted twice more than a minute apart, and `pnpm assets:preview` was attempted; both remain blocked solely by another builder’s missing `docs/3d-top-cities-ut-tower.md`. The selected-id QA/depth tools validate Atlanta’s own catalog/exports through their built-in fallback.

Cityscape: **not tested yet, integration is checked separately**. Full 3D world: **not tested yet, integration is checked separately**. Provider replacement, runtime unlit/vertex shading, terrain pad edges, DEM footing residuals and lifecycle require the lead’s app shots and independent review. No app server or deployment was started.
