# Institut de France · Paris

Original procedural model commissioned for Codriver in September 2026. Source: `src/peregrine/landmarks/paris-historic-geometry.js`; export with `pnpm build:paris-historic`, then `pnpm models:license`. Code/docs MIT; GLBs CC BY 4.0. Model copyright © 2026 9570-6198 Québec inc. (Codriver). Approximate placement uses OpenStreetMap geographic data, © contributors, ODbL 1.0.

The [Institut's palace history](https://www.institutdefrance.fr/decouvrir-le-palais/) describes Louis Le Vau's half-moon Seine frontage, terminal pavilions, chapel and double dome. Its [2026 brochure](https://www.institutdefrance.fr/wp-content/uploads/2026/01/Brochure-Institut-de-France.pdf) publishes a 44 m dome height. Exterior imagery on the [official palace page](https://www.institutdefrance.fr/decouvrir-le-palais/) informed the curved wing rhythm. Only the dome height is published here; wing span (~170 m), segmented curvature, depths, bay spacing and roof pitches are visual/map estimates. No source image or mesh is embedded.

Origin `[2.33757,48.85720]` approximates the palace center. Local metres use east/up/south; the half-moon opens toward the Seine to the north. `y=0` is the host-selected rigid foundation plane. The semi-open frontage and rear courtyards are not terrain-warped.

| Detail | Triangles | Draws | Bytes |
| --- | ---: | ---: | ---: |
| Near | 4,024 | 6 | 162,932 |
| Far | 1,608 | 5 | 74,404 |

Inspect [Seine facade](/asset-preview.html?asset=paris-institut-de-france&view=facade), [roof and wings](/asset-preview.html?asset=paris-institut-de-france&view=roof), and [procedural source](/asset-preview.html?asset=paris-institut-de-france&view=facade&source=procedural). [Near Seine facade](../screenshots/paris-institut-de-france-near-facade.png) and [far roof/night](../screenshots/paris-institut-de-france-far-roof-night.png) show labeled exported views. Fine masonry and interiors are omitted; far detail retains the wings and dome. Cityscape and terrain require host-app evidence.
