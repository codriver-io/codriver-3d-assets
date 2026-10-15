# Capitol Records Building

Original procedural model of the 1956 Louis Naidorf / Welton Becket tower at 1750 North Vine Street, Hollywood, Los Angeles. Identity: circular office floors, projecting white porcelain-enamel eyelid sunshades, narrowed lower level over the studio plinth, repeated rooftop CAPITOL RECORDS name and triangular aluminum beacon spire. No external mesh, font, texture or photograph is embedded.

## Sources and dimensions

[City heritage description, pages 8–11](https://files.ceqanet.lci.ca.gov/221458-6/attachment/HV9fmf-NegNTvETyrp0ezg0tNfGpzrU-0ItBY2jJanJy207mPWnCSux0FlMnKynfH2TusXXBJE-qIMlz0) gives the 150-foot tower, 78/92-foot floor diameters, twelve exposed tower levels, twelve piers, sloping enamel shades, repeated internally lit lettering and 82-foot rooftop spire. [Los Angeles Conservancy](https://www.laconservancy.org/learn/historic-places/capitol-records-tower/) confirms 1956, the circular form and Morse beacon, but describes a 90-foot spire. [Wikipedia](https://en.wikipedia.org/wiki/Capitol_Records_Building) labels 46 m as antenna height while its prose describes the 150-foot zoning limit. The model follows the detailed City heritage description; these conflicting height labels are not silently combined.

| Element | Model | Evidence |
| --- | --- | --- |
| Circular roof slab datum | 45.72 m (150 ft) | City heritage description |
| Spire above roof to beacon tip | 24.994 m (82 ft) | City heritage description; Conservancy says 90 ft |
| Highest point | 70.714 m | Sum of adopted dimensions |
| Upper floor diameter | 28.0416 m (92 ft) | City heritage description |
| Narrow first exposed floor diameter | 23.7744 m (78 ft) | City heritage description |
| Sunshade outer diameter | 30.8 m | OSM outline / photo estimate |
| Studio plinth | 5.4 m | Estimate, mapped footprint |
| Crown | diameter 19.8 m, top 49.05 m | Photo estimate |
| Floor pitch | 3.36 m | Estimated, fitted to sourced roof datum |
| Shade projection and slope | 1.379 m, about 37 degrees | Photo estimate, City description says 40 degrees |

Mapped control: dossier OSM way 907834019; circular envelope extrema locate axis at `[-118.32636885,34.10315525]`. The north studio edge goes from `[-118.326511,34.1033602]` to `[-118.3261436,34.1033622]`, bearing about 89.6 degrees, and the west frontage is approximately north–south. Mapped outlines are baked in east/up/south metres; y=0 is rigid local grade. No terrain or Mercator stretch is baked in. Exact replacement ways: 422141102 (outline), 907834019 (tower), 907834020 (studio podium and north link). Adjacent Gogerty building 422141151 and nearby Argyle House remain provider-owned.

## Geometry and materials

Circular surfaces are split into separate material patches for panes, mullions, piers and spandrels; no glazing sheet sits over a solid backing cylinder. Both LODs retain twelve shade rings, every window row, the narrowed first level, name drum and spire. Near has six panes per pier bay, far three; far reduces radial subdivisions. Thin sloping annuli replace thick discs. The first shade has a continuous soffit bridging to the narrow lower level. The mapped studio wing has a recessed Vine Street vestibule. Seven merged named materials: warm white sunshades, light gray wall, dark desaturated glass, aluminum, gray roof/crown, self-lit lettering and red beacon. Dark palette dims the building and retains lettering/beacon illumination.

Approximations: podium height, interior, exact facade panel divisions, crown height and proportions, doorway size, sunshade section, and spire taper are estimated. The jazz mural, flag, tiny roof equipment, landscaping, subterranean echo chambers and interiors are omitted. The beacon is static geometry; the real light spells HOLLYWOOD in Morse code. The envelope follows OSM, while structural diameters follow the heritage survey. This is an authored modern tower, without the winter Christmas-tree decoration.

## Verification

Compared the dossier reference sheet and photographs by Downtowngal (CC BY-SA 3.0), Kevin D. Hartnell (CC BY-SA 3.0) and RgtmPnoMn (CC BY-SA 4.0), with credits/links in the catalog. Photos remain under ignored scratch and are not redistributed. First procedural contact sheet: `tmp/top-cities/shots/capitol-records-building/capitol-records-building-procedural-near-light-sheet.jpg`, overview/back/roof/entrance/detail. This exposed a missing transition soffit and hidden doorway; the soffit was closed and the entrance recessed. Far radial tessellation was reduced after measuring initial costs.

Final judged contact sheet: `tmp/top-cities/shots/capitol-records-building/comparison-sheet.jpg` places the three attributed photos beside exported GLBs: near/light overview, Vine facade, back, roof, entrance and detail; far/light overview and roof; far/dark facade and detail; near/dark overview and entrance; and a final near/light overhead plan with the red footprint rings. Also judged the standalone `capitol-records-building-glb-far-dark-sheet.jpg`; all four LOD/theme sheets are in that directory. The white fin silhouette and narrow glazed understorey survive far detail. The studio base remains deliberately simpler than the real decorated frontage. The final footprint test caught one HVAC box extending off the north roof, which was moved inward; final plan and roof views show it supported. Pane material intervals were made contiguous to avoid tiny gaps at pier boundaries.

Final checks (2026-10-15): requested registry plus landmark test invocation passed (833 tests, dot reporter, exit 0; log `tmp/top-cities/capitol-records-building/test-final.txt`); landmark-specific tests pass 7/7 in about 0.25 s. Tests pin roof/tip heights, 78/92-foot diameters by raycast, all twelve sunshades, every glazed upper row from four directions, spire-to-roof contact with a shortened-root negative control, exact provider ownership, footprint containment, LOD bounds and GLB round trips. `node scripts/asset-catalog.mjs` passed (406 entries / 782 GLB variants); `pnpm assets:preview` passed. Depth table regeneration and `--ids capitol-records-building --check` passed, zero material cycles. The only shared file changed is the explicitly permitted generated `depth-layers.js`.

`qa-metrics.mjs --ids capitol-records-building` reports **no issues**: zero coplanar overlap pairs, zero unresolved layered area in either LOD, zero removable bridgeLift bytes, no unsupported-member candidates, near back-face sweep 0.8% (below the 2% cap), retained far window rhythm. Metrics report: `tmp/top-cities/capitol-records-building/qa-metrics.json`. An earlier transient catalog failure was Wrigley Building's missing documentation during its build; the final shared check passed.

| Export | Triangles | Draws | Bytes | KiB rounded |
| --- | ---: | ---: | ---: | ---: |
| Near | 15,430 | 7 | 496,504 | 485 |
| Far | 6,274 | 7 | 235,176 | 230 |

These are exported default-scene costs, not measured device performance. Independent reviewer approval remains pending.

Cityscape: **not tested yet, integration is checked separately**. Full 3D world: **not tested yet, integration is checked separately**. The lead owns app screenshots, terrain/provider replacement checks and independent visual review. A contact sheet establishes asset inspection only.
