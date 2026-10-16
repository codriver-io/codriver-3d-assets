# Marché Atwater — Montréal

Original procedural model of the 1933 Art Deco market at 138 avenue Atwater, by the Lachine Canal. Ludger Lemieux designed the building with his son Paul. The long two-storey pale-brick hall, grounded projecting clock tower at the northwestern end, clock/louver faces, fluted pilasters, tall upper windows, vertical ATWATER sign and open perimeter canopies define this asset. No external mesh or texture is used.

## Sources and dimensions

Researched 2026-10-15 from the supplied dossier, then checked the [market operator](https://www.marchespublics-mtl.com/fr/marches/marche-atwater), [municipal history](https://ville.montreal.qc.ca/memoiresdesmontrealais/node/388) and [architectural guide](https://lmlequebec.ca/art-deco-montreal-partie-2-de-3/). The operator confirms Art Deco and 1933; the guide gives the 115 × 18 m main hall and Ludger/Paul Lemieux attribution. The envelope including projecting awnings is independently mapped from [OSM way 121847897](https://www.openstreetmap.org/way/121847897).

| Feature | Model value | Basis |
| --- | --- | --- |
| Main hall | 115 × 18 m | Published architectural guide; excludes awnings |
| Canopy outer envelope | 130 × 35.4 m | Fitted inside the approximately 130.4 × 36.2 m OSM envelope |
| Hall eaves / barrel crown | 13 / 14.45 m | Photo-scaled estimate |
| NW end pavilion | 18 × 13 m, 18.6 m eaves, 20 m stepped crown | Photo-scaled estimate |
| Tower highest point | 36.5 m | Photo-scaled estimate; no surveyed height found |
| Tower main shaft / stepped corners | 5.3 / 5.9 m wide | Photo-scaled estimate |
| Clock dials | two opposite side faces, 3.54 m diameter, center 33.7 m | Photo-scaled estimate; two other faces have dark belfry louvers |
| Upper hall window row | 6.3–11.15 m | Estimated facade rhythm; 28 bays near, 14 broader separate bays far |
| Canopies | underside 3.85 m, top 4.12 m | Photo-scaled estimate |

Visual references checked with their Commons author/licence pages:

- [Marché AtWater (13296795445)](https://commons.wikimedia.org/wiki/File:March%C3%A9_AtWater_(13296795445).jpg), Matias Garabedian, CC BY-SA 2.0: winter facade and tower fluting.
- [AtwaterMarket](https://commons.wikimedia.org/wiki/File:AtwaterMarket.jpg), Colin Rose, CC BY-SA 2.0: long hall, end crown, clock, belfry louvers and open awnings.
- [Marche Atwater 07](https://commons.wikimedia.org/wiki/File:Marche_Atwater_07.jpg), Jeangagnon, CC BY-SA 3.0: open seasonal market canopy context.

The dossier's photo 3 depicts Victoria Coach Station and was excluded. Interior/strawberry photos do not establish exterior dimensions. All photographs stay in ignored scratch; they are visual references only and are absent from source/runtime exports. Original model rights follow ADR-0044; mapped data retains © OpenStreetMap contributors / ODbL 1.0.

## Geographic frame and ownership

Origin `[-73.57680719129334,45.47947131669461]` is near the center of the mapped market envelope. Geometry is authored in real metres, east/up/south, with rigid flat grade y=0. Local u runs northeast and local v southeast along the hall. A single +41° Y rotation is baked into exported vertices; the host must not rotate again. The long axis has bearing 139° true and the northwest end faces 319°.

OSM controls `[-73.5771828,45.4800191]` and `[-73.5767505,45.4796728]` establish the southeast long edge; cross-edge control `[-73.5775317,45.479806]` establishes the canopy width. The exact ring of way 121847897 is retained in footprint.js, including the canopy envelope. It is the only building way replaced. A supplementary 85 m building-part/relation query through the shared Overpass helper returned no additional parts or building relations (OSM base 2026-10-15 21:52 UTC; ignored osm-parts.json). The nearby greenhouse 440260519 and commercial ways 375725626, 35185351 and 60902973 are separate buildings and are excluded. No detached seasonal pavilion is authored or owned.

The main hall is deliberately narrower and shorter than the outer canopy footprint. A rigid floor at y=0 supports the hall; open canopy columns also terminate at y=0. No DEM, sea-level offset or Mercator scaling is baked in. The 70 m pad radius is a placement handoff, not a verified terrain policy; site sampling and surrounding street/pad transitions remain for in-app QA.

## Construction and approximations

Punched masonry walls contain inset individual glazing planes; their window rhythm remains discrete in far. Near adds repeated sash bars, ventilation slots and more pilasters. The long hall roof is a shallow barrel behind a taller northwest end pavilion. The pavilion has four tall front windows, raised side glazing, a flat inset roof and a stepped 19–20 m Art Deco crown; the southeast end retains the low curved parapet. The hollow tower stem is centered across the NW face at local v=-59.8 m, projecting 6.6 m forward from its earlier position. Its wall and corner shafts visibly meet grade ahead of the pavilion, while its rear overlaps the pavilion face. It has a real recessed aperture for the vertical ATWATER sign, four pale masonry fluted faces and stepped corner pilasters. Two side dials use twelve marks and two hands each; the two end faces have inset belfry louvers. Original geometric lettering uses simple connected rectangular strokes, without a font or texture. Neutral pale buff brick follows the winter reference. A distinct light grey-green canopy material contrasts with the darker grey roof, in both light and dark palettes. The NW awning is cut around the tower shaft, leaving its grounded frontage visible. The dark palette dims masonry/glazing and warms the sign; no unsupported whole-building night illumination is claimed.

The canopies remain open on all four sides, with posts, supported perimeter beams and near-only crossbeams. A few fixed low counters suggest stalls without produce clutter. Interiors, brick-by-brick mortar, exact historic metalwork, seasonal tent pavilions and surrounding furniture are omitted. Tower height, roof rise, dial size and detailed elevations are estimates. The source does not claim a surveyed reconstruction.

## Review correction g20ar and verification

The independent g20a review found four visible defects: mirrored ATWATER lettering, a missing raised NW end pavilion, a tower apparently emerging from behind the roof, and an indistinguishable canopy/roof colour. The reviewed photos establish that the tower belongs at the NW end, not in the middle of the long hall. Both LODs now have correctly handed E/R glyphs, a 20 m stepped end pavilion with four tall front windows, a tower projecting ahead of that facade down to grade, and separate canopy/roof materials and elevations. The pavilion roof skin terminates at the inner wall faces; replacing an initial roof box removed its coplanar end-cap cycle. No additional provider footprint is occupied: the complete geometry still fits OSM way 121847897 within the tested 0.5 m fascia tolerance, and the existing parts query found no separate replaced part IDs.

| Detail | Before triangles / draws / bytes | After triangles / draws / bytes | After KiB |
| --- | ---: | ---: | ---: |
| Near | 13,582 / 7 / 803,556 | 13,864 / 8 / 817,072 | 797.9 |
| Far | 5,038 / 7 / 317,856 | 4,990 / 8 / 314,760 | 307.4 |

Measured exported default-scene costs stay within the near 60k/14/2.5 MB and far 12k/8/500 KB budgets. The additional draw is the canopy colour; far remains at the eight-draw ceiling. Both LODs retain the same outer bounds, a 36.5 m tower top and grade y=0; neither carries bridgeLift. No hardware timing is claimed.

Compared the supplied Matias Garabedian winter and Colin Rose summer photographs against two export look rounds. Final judged sheets are `tmp/top-cities/shots/marche-atwater/g20ar/final/marche-atwater-glb-{near,far}-light-sheet.jpg`, containing overview, facade, rear, roof, street and tower-detail views. The final far dark sheet in the same directory checks the changed canopy/roof palette. The tower now has a continuous grounded frontage, the raised end reads separately from the low long hall, and ATWATER reads correctly from the NW. Optional seasonal yellow tents were omitted: they are transient and do not improve the permanent building silhouette enough to justify added geometry.

The eight landmark tests pass against the final exported GLBs. New raycast checks pin the grounded tower, all four elevated pavilion windows, raised crown, handed E/R strokes and distinct awning material in both LODs. Existing tests still verify clocks, louvers, individual windows, open canopies, grade, silhouette, footprint containment, GLB metrics/bounds and named post/wall contact for every canopy beam; a deliberately shortened beam fails the contact threshold. No test asserts SPEC.ready.

Deterministic QA in `tmp/top-cities/marche-atwater/g20ar-metrics.json` reports both variants **ok**, zero layered/coplanar flags, zero near back-face hits and no window-rhythm flags. The final depth table regeneration dropped zero cycle edges; `--check` verifies the current export. Logs are `tmp/top-cities/marche-atwater/g20ar-landmark-tests.log` and `g20ar-registry-focused.log`. `node scripts/asset-catalog.mjs` (the `assets:check` implementation) passes with 425 entries / 836 GLB variants, and `pnpm assets:preview` passes, producing only ignored local inspectors. Catalog/preview logs are `g20ar-catalog.log` and `g20ar-preview.log` in the same directory. The generated depth table is the sole authorized shared generated-file write and should be regenerated by the lead at commit time.

Cityscape: **not tested yet, integration is checked separately**. Full 3D world: **not tested yet, integration is checked separately**. The lead recaptures both-mode app screenshots after this shared-tree fix; provider replacement, shared runtime shading and terrain/pad transitions remain independent integration gates. No app server or shared public/peregrine.js rebuild was used for this correction.

Rebuild with `pnpm build:top-cities-landmarks marche-atwater --no-check`, then regenerate/check `node scripts/landmark-depth-layers.mjs --ids marche-atwater` (add `--check` for validation). Focused tests: `node --test src/peregrine/landmarks/top-cities/top-cities.test.js src/peregrine/landmarks/top-cities/marche-atwater/marche-atwater.test.js`. Catalog and preview: `pnpm assets:check` and `pnpm assets:preview`.
