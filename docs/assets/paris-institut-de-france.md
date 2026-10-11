# Institut de France · Paris

Original procedural model commissioned for Codriver in September 2026. Source: `src/peregrine/landmarks/paris-historic-geometry.js`; export with `pnpm build:paris-historic`, then `pnpm models:license`. Code/docs MIT; GLBs CC BY 4.0. Model copyright © 2026 9570-6198 Québec inc. (Codriver). Approximate placement uses OpenStreetMap geographic data, © contributors, ODbL 1.0.

The [Institut's palace history](https://www.institutdefrance.fr/decouvrir-le-palais/) describes Louis Le Vau's half-moon Seine frontage, terminal pavilions, chapel and double dome. Its [2026 brochure](https://www.institutdefrance.fr/wp-content/uploads/2026/01/Brochure-Institut-de-France.pdf) publishes a 44 m dome height. Exterior imagery on the [official palace page](https://www.institutdefrance.fr/decouvrir-le-palais/) informed the curved wing rhythm. Only the dome height is published here; wing span (~170 m), segmented curvature, depths, bay spacing and roof pitches are visual/map estimates. No source image or mesh is embedded.

Origin `[2.33757,48.85720]` approximates the palace center. Local metres use east/up/south; the half-moon opens toward the Seine to the north. `y=0` is the host-selected rigid foundation plane. The semi-open frontage and rear courtyards are not terrain-warped.

| Detail | Triangles | Draws | Bytes |
| --- | ---: | ---: | ---: |
| Near | 4,024 | 6 | 162,932 |
| Far | 1,608 | 5 | 74,404 |

Inspect [Seine facade](/asset-preview.html?asset=paris-institut-de-france&view=facade), [roof and wings](/asset-preview.html?asset=paris-institut-de-france&view=roof), and [procedural source](/asset-preview.html?asset=paris-institut-de-france&view=facade&source=procedural). [Near Seine facade](../screenshots/paris-institut-de-france-near-facade.png) and [far roof/night](../screenshots/paris-institut-de-france-far-roof-night.png) show labeled exported views. Fine masonry and interiors are omitted; far detail retains the wings and dome. Cityscape and terrain require host-app evidence.

## Street-level revision — 29 September 2026

Tangent-aligned curved-wing bays, cornices, entrance order, radial drum openings and curved dome ribs.

See the [refinement notes](../paris-street-level-refinement.md) for references, remaining approximations and separate host-mode status. Earlier screenshot links show the initial collection; the current GLB costs are in the manifest.

Current revision: [near GLB facade/support](../screenshots/paris-refinement/paris-institut-de-france.png) · [near GLB roof/structure](../screenshots/paris-refinement/paris-institut-de-france-roof-or-structure.png).


## Geographic registration revision

The source and GLBs now include the mapped origin, facade bearing and documented horizontal fit. Heights remain unchanged; the host must apply only geographic scale and its ground datum. See [Paris registration](../paris/placement.md) for reference coordinates, partial-palace scope and approximation limits. Host Cityscape and Full 3D world were checked in the desktop renderer with live map data; this is not vehicle-hardware or authenticated-session evidence.

## QA pass — October 2026

Reviewed against reference photographs and checked with `qa-metrics.mjs` (budgets, far-LOD silhouette, grade, coplanar faces, back faces). each wing is one continuous curved ribbon (facade, cornice, roof); stepped chapel with cornices and pilasters. Exported cost: near 16,481 triangles / 6 draws / 839,204 bytes; far 4,013 / 6 / 164,316.
