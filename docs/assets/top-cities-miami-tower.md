# Miami Tower

Original procedural model of the completed **1987 Miami Tower**, formerly CenTrust / Bank of America Tower, at **100 SE 2nd Street, Miami, Florida**. The three receding quarter-curved glass tiers, fine white horizontal aluminium spandrels, large parking podium and floodlit night facade are the identity. The modeled night state is magenta; the actual programmable LEDs use many colours.

## Sources and dimensions

Research began with the supplied `tmp/top-cities/miami-tower/` dossier, including OSM geometry, facts and the six-photo reference sheet. No additional images, third-party meshes or Overpass requests were needed. References checked on 2026-10-13:

- [Official Miami Tower site](https://www.miamitower.net/): I. M. Pei design, 47 stories, glass tiers, colour-changing lighting, integrated parking garage, on-site Metromover station and sky terrace.
- [Miami Tower history and dimensions](https://en.wikipedia.org/wiki/Miami_Tower): 1987 completion, 625 ft roof, three dramatic tiers, ten-story garage and Knight Center station. The dossier retains the factual extract.
- [OSM tower way 300232867](https://www.openstreetmap.org/way/300232867): geographical envelope and 191 m rounded height. Adjoining garage ways 300232868/300232869 and parts 1105085928–1105085932 are also owned; neighboring Courtyard hotel, mall and Knight Center complex are excluded.

| Dimension | Model | Basis |
| --- | ---: | --- |
| Roof height | 190.5 m | Published 625 ft, converted exactly; OSM rounds to 191 m |
| Principal setbacks | 74 / 115 m | OSM part heights, treated as approximate |
| Main curved tower plan | approximately 53 × 56 m | Mapped outline, no arbitrary grid rotation |
| Total tower/garage envelope | 78.39 × 78.19 m | Derived mapped east/south bounds |
| Garage roof | 36 m | Photo estimate for ten parking levels; adjacent OSM outline has 11-level tag |
| Tower facade pitch / white band | 3.4 / 1.02 m | Photo estimates, not a surveyed elevation schedule |
| Garage facade pitch | 3.6 m | Photo estimate |
| Near / far glazed bays | approximately 1.8 / 5.5 m | Visual module and LOD estimates |
| Pavilion / station frontage | 4.6 m above garage / 9–12 m above grade | Photo estimates; architectural representation only |
| Terrain pad radius | 60 m | Bounded rigid-site placement handoff; terrain not verified |

## Geographic frame and owned structure

`origin = [-80.19143, 25.77219]` is a central structural/site anchor. Units are real metres, +X east, +Y up and +Z south. Local y=0 is rigid flat-map grade. No DEM, absolute altitude or latitude stretch is baked in. Orientation is already exported.

The mapped rear chamfer controls `[-80.1918012,25.7723084]` and `[-80.1915884,25.7725087]` set its roughly 44-degree edge bearing from north; the outward curved frontage faces approximately 134 degrees southeast. Literal metre rings derived from these OSM controls define the source geometry. Longitude uses the local cosine scale; its difference from exact local Mercator projection across this small site is negligible and tested with a 15 cm boundary tolerance.

The replacement footprint lists **all eight exact provider ways**: 300232867, 300232868, 300232869, 1105085928, 1105085929, 1105085930, 1105085931 and 1105085932. The helipad part and minor top strips are subsumed within the authored top-tier shell. No neighboring buildings, guideway, external elevated highway or forecourt roads are modeled or masked.

The generator has only Three.js, the shared asset builder and its own modules as dependencies. Three.js ShapeUtils triangulates caps. A single garage perimeter shell meets the first tower tier at 36 m; exposed garage roof polygons and two mapped crescent terraces provide only exposed caps. The highest shell is closed at the published height. OSM's narrow 173/180 m roof strips are consolidated into the third principal tier to preserve the three-tier architectural identity; rooftop helipad equipment is omitted.

Facade glass, reflection panes, mullions and spandrels **partition** each surface instead of using backing walls with thin overlays. Material quads meet edge to edge, avoiding depth fights. Near keeps fine vertical mullions; far drops them, retains every horizontal floor band, all three curved tiers, coarser separate glass panes, the station frontage and sky pavilion. The pavilion is an open-bottom shell supported directly by the garage roof; its glazing/parapet meet without stacked cap faces. Materials are merged into seven near / six far draws. `light` provides white daytime spandrels and unshaded magenta night bands; `glow` gives the embedded blue station frontage.

## Reference rights

Photographs are comparison references only, retained under ignored `tmp/top-cities/miami-tower/refs/`; no photo, texture, scan or mesh is committed or embedded in the GLBs. The inspected dossier contact sheet contains:

- [Miami Tower cropped](https://commons.wikimedia.org/wiki/File:Miami_Tower_cropped.jpg), B137, CC BY-SA 4.0: low-angle facade bands and crown.
- [Bank of America Tower Miami red](https://commons.wikimedia.org/wiki/File:Bank_of_America_Tower_Miami_red.jpg), Averette, CC BY 3.0: illuminated silhouette.
- [Miamifireworks](https://commons.wikimedia.org/wiki/File:Miamifireworks.jpg), Averette, public domain: skyline illumination.
- [Bank of America Miami 20100206](https://commons.wikimedia.org/wiki/File:Bank_of_America_Miami_20100206.jpg), Averette, CC BY 3.0: full daylight tower, garage and station.
- [Miami Tower 20101212](https://commons.wikimedia.org/wiki/File:Miami_Tower_20101212.jpg), Averette, CC BY 3.0: curved tiers and coloured lighting.
- [Miamiatnightpink](https://commons.wikimedia.org/wiki/File:Miamiatnightpink.jpg), Marc Averette, public domain: chosen magenta night state.

Original procedural geometry is authored for Codriver. Geographic data independently retains © OpenStreetMap contributors, ODbL 1.0 attribution.

## Visual verification

Personally opened `tmp/top-cities/miami-tower/refs-sheet.jpg` and the full daylight `refs/4.jpg`. The initial `tmp/top-cities/shots/miami-tower/miami-tower-procedural-near-light-sheet.jpg` showed vertical mullions competing with horizontal bands; their contrast was reduced, white bands widened, and missing upper arc endpoints corrected. A subsequent footprint-containment assertion identified a small omitted garage notch; the actual mapped perimeter vertex was restored rather than expanding ownership.

The final exported GLBs were compared with the dossier photos in `tmp/top-cities/shots/miami-tower/export-reference-contact-sheet.jpg`. It combines `miami-tower-glb-{near,far}-{light,dark}-sheet.jpg` (overview, street facade, opposite side, above, entrance and tier detail), the reference sheet, and `miami-tower-glb-near-light-top.png` with mapped footprint. Both LODs retain the tiers and horizontal white/magenta rhythm; the plan stays inside the mapped replacement boundary. No rendered geometry extends into the adjacent hotel or road. The contact sheets verify source/export appearance, not renderer integration.

## Checks and measured export costs

Export with `pnpm build:top-cities-landmarks miami-tower --no-check`. Acceptance uses the required two-file Node test command, `node scripts/asset-catalog.mjs`, and `node scripts/landmark-depth-layers.mjs --ids miami-tower --check`. Source tests pin published height, all three exposed roof heights by downward raycasts, full mapped-envelope containment, far silhouette, horizontal spandrel rhythm, neighboring-road exclusion and named garage-roof contact for the sky pavilion; a deliberately shortened pavilion footing proves that contact assertion fails for floating geometry.

The deterministic QA report is `tmp/top-cities/miami-tower/qa-metrics.json`: zero layered faces, zero coplanar overlaps, zero removable attributes, zero depth-cycle edges, zero unsupported-member candidates and zero back-face hits. Coarse far window modules retain rhythm. No standalone beams, rails, cables or walkways are authored, so their end-contact checks are N/A.

| Export | Triangles | Draws | Bytes | KiB |
| --- | ---: | ---: | ---: | ---: |
| Near | 27,451 | 7 | 1,486,920 | 1452.1 |
| Far | 6,745 | 6 | 367,796 | 359.2 |

Both LODs fit all building budgets with headroom. Far has identical source bounds; source/export round-trip agreement is checked by the city conformance tests. Catalog validation and local asset preview build pass; depth layers are current with no cycles. The four landmark-specific tests pass in approximately 0.25 seconds. The final required two-file run passes all 626 tests with zero failures (about 40 seconds), recorded in `tmp/top-cities/miami-tower/acceptance-tests.txt`; all three Miami registry checks pass.

## Limitations and integration handoff

Intermediate setbacks, garage/pavilion heights, floor and window modules, station opening and material reflectance are estimates. The Metromover station is represented by an embedded glazed frontage, without track, vehicles, exact operating entrances or platforms; no extra guideway is truncated in mid-air. The pavilion approximates sky-lobby amenity massing, without garden planting or furnishings. Roof helipad equipment, interiors, signs, exact reflective skyline and programmable LED animation are omitted. Night illumination is geometric colour, without bloom or scene floodlight simulation.

**Cityscape: not tested yet, integration is checked separately. Full 3D world: not tested yet, integration is checked separately.** Provider masking, shared app unlit shading, pad/DEM fit, terrain refinement, mode switches, late loads, lifecycle restoration and Tesla hardware costs remain for the lead. No app server, deployment, dependency installation, shared registry or git-write command was used.
