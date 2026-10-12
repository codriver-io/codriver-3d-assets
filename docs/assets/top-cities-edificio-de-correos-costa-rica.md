# Edificio de Correos — San José, Costa Rica

Original texture-free procedural exterior of the 1917 central post and telegraph building at Calle 2, San José. Source owns only this landmark; provider replacement is OSM way 264142839, excluding Banco Nacional, Club Unión and the street.

## Sources and dimensions

The [official postal history](https://correos.go.cr/edificio-central-de-correos-y-telegrafos-fiel-testigo-de-la-construccion-de-la-democracia/) identifies architect Luis Llach Llagostera, October 1917 inauguration and French neo-Renaissance influences; the broader eclectic exterior has baroque ornament. The supplied dossier photos 2–7 establish pale ochre/cream-gold masonry, paired columns, long arcade, balustrades, CORREOS Y TELÉGRAFOS central attic and curved pavilion pediments. Photo 1 shows stamps and was ignored. Full title/author/licence credits are in the catalog record; reference files remain ignored under `tmp/top-cities/edificio-de-correos-costa-rica/refs/` and are not distributed.

[OSM way 264142839](https://www.openstreetmap.org/way/264142839) has `building=yes` but no height/storey tag. Geometry is from the supplied cached dossier; no new Overpass request was required. Origin `[-84.07998335, 9.9354046]` is the mapped diagonal midpoint. Control points on the long east edge are `[-84.0798102,9.9357478]` and `[-84.0798724,9.9350373]`. The façade normal is bearing 94.93°; +85.07° Y rotation is baked into vertices exactly once. Real metres, east/up/south, rigid grade y=0; no DEM, altitude or Mercator scale baked in.

| Feature | Metres | Evidence |
| --- | ---: | --- |
| Outer envelope | 79.39 × 31.28 | Derived from OSM, not a survey |
| Walls | 76.4 × 29.45 | Inset within mapped envelope |
| Main cornice | 17.4 | Photo estimate |
| Central attic top | 22 | Photo estimate |
| Pavilion curved crown | 19.8 | Photo estimate |
| Corner finial | 20.58 | Photo estimate |
| Ground arches | 6.05 high, 1.85–2.65 wide | Photo estimate |
| Upper main / mezzanine glazing | 3.65 / 2.2 high | Photo estimate; two large façade tiers with upper split |
| Entrance stair | 1.15 rise, five steps | Photo estimate, within footprint |
| Terrain pad radius | 43 | Covers mapped half-diagonal; app/DEM validation pending |

## Model and approximations

Both LODs retain all 17 recessed ground arches, paired engaged columns, two upper window rows, cornices, open sill/roof balustrades, four curved pediments, low corner domes and the raised central crest. Near retains original geometric Spanish inscription, fanlight spokes, iron bars, Ionic-like capital volutes and abstract relief rosettes. Far uses a single pale front surface for the curved inscription ribbon, removes text and ironwork, uses square balusters and simpler column profiles; all window bays and roof masses remain. Seven palette keys are available, six are used; light/dark dim masonry and glass rather than inventing glowing office windows. Walls are ochre, trims pale cream, rear roof subdued grey. No green paint is modeled.

The chief limitations are estimated heights, rear/side window arrangement and the concealed roof (no aerial or unobstructed rear photo in the supplied set). Domes are deliberately low and subordinate to curved front pediments, matching the photographed skyline; they are not oversized hemispheres. Relief/crest is an original abstract representation, not a carved sculpture reproduction. Interiors, flag poles, vegetation, temporary street furniture and neighbours are excluded. Actual device cost and app shading are unmeasured.

## Export and verification

Build: `pnpm build:top-cities-landmarks edificio-de-correos-costa-rica --no-check`. Focused tests: `node --test src/peregrine/landmarks/top-cities/top-cities.test.js src/peregrine/landmarks/top-cities/edificio-de-correos-costa-rica/edificio-de-correos-costa-rica.test.js`. Catalog and depth ordering are checked with repository tools. Final measured costs and inspection evidence follow.

Cityscape: **not tested yet, integration is checked separately**. Full 3D world: **not tested yet, integration is checked separately**. The lead owns provider replacement/lifecycle, shared runtime shading, regional-to-street zoom and DEM/entrance/pad validation; catalog readiness is export readiness only.

| Exported default scene | Triangles | Draws | Bytes | KiB |
| --- | ---: | ---: | ---: | ---: |
| Near | 43,495 | 6 | 1,514,032 | 1478.5 |
| Far | 11,501 | 6 | 472,148 | 461.1 |

Final local evidence is `tmp/top-cities/shots/edificio-de-correos-costa-rica/exported-reference-contact-sheet.jpg`, opened and compared directly with dossier reference photos 2 and 6. It combines exported near/light overview, façade, roof, back, entrance, detail and plan with near/dark, far/light and far/dark overview, façade, roof, back, entrance and detail. All four exported `*-sheet.jpg` files and full PNGs remain beside it. The plan image shows the red OSM ring and the baked geographic alignment; corners, steps and cornices stay inside the exact mapped ring. The frontage faces Club Unión to the east across Calle 2; the [Club Unión's own history](https://www.clubunion.com/wp-content/uploads/2021/07/Boletin_Club_Union_Costa_Rica_21_Junio_15.pdf) confirms that the club is directly opposite Correos. No extra reference photographs were fetched.

The first exported sheet showed overly deep upper glazing and ground door recesses. These were reduced to 0.5–0.65 m and the central relief panels added. Far detail was reduced by removing inscription/iron fanlights and simplifying balusters and column profiles. Contact checks then caught insufficient plinth coverage and incomplete upper entablature support: the plinth was extended while retaining the five-step central opening, column pairs moved inside their corresponding projected bays, and a continuous entablature was added. Hidden bottom faces of attic/pavilion crowns were removed to resolve a material-order cycle. The final sheet shows consistent lower arches, divided upper windows, clear crest and subdued ochre colouring in both LODs/palettes; dark is a dim material approximation, not a measured illumination model.

All seven dedicated tests passed in under 1 second: dimensions, grade, separate openings/windows, column/plinth/entablature and stair contacts including deliberately shortened-end negative cases, exact footprint containment, far silhouette/cost and GLB/source normals/bounds/metrics. This landmark's three shared conformance checks also passed. The final requested combined command passed **391/391 tests**. An earlier run had one transient failure in another builder's in-progress `helsinki-cathedral` spec/views check; it cleared without changing other worker files. Full-app tests and app servers were not run.

`node scripts/asset-catalog.mjs` passed: 266 entries / 460 GLB variants. `node scripts/landmark-depth-layers.mjs --ids edificio-de-correos-costa-rica --check` passed. The generated depth table is the sole shared file regenerated; its cycle report had zero dropped edges. Deterministic exported QA at `tmp/top-cities/edificio-de-correos-costa-rica/qa-metrics.json` is clean: no budget/silhouette issues, zero layered/coplanar candidates, zero back-face hits over 448 rays, no below-grade structure apart from negligible float rounding, and no removable bridge attributes. Independent review and unobstructed Cityscape/Full 3D world app evidence remain the lead's next steps.

## Independent review fixes — 2026-10-12

Review fix 2026-10-12: curved inscription ribbon, rounded attic shoulders and stronger wreath/scroll crest replace the flat angular centre. Ochre walls, pale trims, arcade, paired columns, window rows and low domes retained. Near inscription follows the curved band; far retains its pale single-surface mass and omits lettering to avoid depth cycles. Heights and rear/side details estimated; provider way 264142839 retained. Independent re-review and lead app recaptures in both modes pending.

The curved ribbon tracks the photo inscription arch rather than a straight baseline; both attic shoulders are curved and the wreath, side scrolls and leaf masses project more strongly. Near keeps raised lettering; far uses one front-facing pale ribbon in the trim batch and drops lettering and hidden ribbon faces. This resolves the material cycle between crest/trim and the volumetric ribbon; the final depth pass reports zero dropped edges.

Opened and judged exported near/light facade, street/entrance, detail and roof sheet `tmp/top-cities/shots/edificio-de-correos-costa-rica/review-fix-1/edificio-de-correos-costa-rica-glb-near-light-sheet.jpg` and final far/dark equivalents `tmp/top-cities/shots/edificio-de-correos-costa-rica/review-fix-2/edificio-de-correos-costa-rica-glb-far-dark-sheet.jpg`. Broad sculpture/crest survives far; openings, windows and grade remain unchanged. No third visual look-fix iteration was used. The app evidence in `tmp/next-200/qa/b1/` predates these changes; lead must recapture and obtain independent re-review.

Final combined dedicated and shared top-cities conformance tests pass **409/409**, including 18 dedicated cases, against the final exports. Final deterministic QA metrics are clean for both landmarks. Depth tables regenerated and checked current for both models, with zero cycles. Global catalog validation passed: **266 entries / 472 GLB variants**; an earlier transient missing document in another worker's in-progress record cleared without editing its files. All costs above now reflect the revised exports.
