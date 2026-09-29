# Hôtel de Ville de Paris

Original procedural model commissioned for Codriver in September 2026. Source: `src/peregrine/landmarks/paris-historic-geometry.js`; export with `pnpm build:paris-historic`, then `pnpm models:license`. Code/docs MIT; GLBs CC BY 4.0. Model copyright © 2026 9570-6198 Québec inc. (Codriver). Approximate placement uses OpenStreetMap geographic data, © contributors, ODbL 1.0.

[Ville de Paris](https://www.paris.fr/pages/l-hotel-de-ville-abrite-cinq-lieux-insolites-7659) reports the clock campanile at 50 m, and its [history](https://www.paris.fr/pages/l-histoire-de-l-hotel-de-ville-en-sept-dates-marquantes-7667) describes the 1873–1882 Ballu–Deperthes rebuilding. The long Renaissance Revival facade and steep roofscape were checked against the [City of Paris exterior image](https://www.paris.fr/lieux/hotel-de-ville-19154). The 148 m by roughly 100 m perimeter, wing lengths, pavilion spacing and window rhythm are map/photo estimates, not survey measurements. The court remains open and the western public square is outside the model. No third-party image or mesh is included.

Origin `[2.35253,48.85643]` is the rounded center of the OSM civic-palace envelope. Local metres use east/up/south; the main frontage faces west. `y=0` is a rigid foundation plane; host terrain placement supplies elevation once.

| Detail | Triangles | Draws | Bytes |
| --- | ---: | ---: | ---: |
| Near | 1,969,668 bytes · 42,404 triangles · 7 draws | 6 | 149,036 |
| Far | 825,944 bytes · 17,912 triangles · 7 draws | 6 | 73,828 |

Inspect [front](/asset-preview.html?asset=paris-hotel-de-ville&view=facade), [roof/court](/asset-preview.html?asset=paris-hotel-de-ville&view=roof), and [procedural source](/asset-preview.html?asset=paris-hotel-de-ville&view=facade&source=procedural). [Near facade](../screenshots/paris-hotel-de-ville-near-facade.png) and [far roof/night](../screenshots/paris-hotel-de-ville-far-roof-night.png) show labeled exported views. Sculptures, dormers and clock mechanics are simplified. Cityscape and terrain claims require host-app evidence.

## Street-level revision — 29 September 2026

Mansard roofs, visible gabled dormers, detailed clock face, façade pilasters, balustrade and side/rear bays.

See the [refinement notes](../paris-street-level-refinement.md) for references, remaining approximations and separate host-mode status. Earlier screenshot links show the initial collection; the current GLB costs are in the manifest.

First refinement: [near GLB facade/support](../screenshots/paris-refinement/paris-hotel-de-ville.png) · [near GLB roof/structure](../screenshots/paris-refinement/paris-hotel-de-ville-roof-or-structure.png).


## Second architectural pass

Second pass: projecting pavilions, chimney stacks, cross-mullioned windows, pediments, statue niches, roof cresting and a two-level open octagonal campanile. Sculptures remain abstract original silhouettes.

See [references and validation](../paris-second-pass.md).

Current second pass: [near GLB façade](../screenshots/paris-second-pass/paris-hotel-de-ville.png) · [near GLB roof](../screenshots/paris-second-pass/paris-hotel-de-ville-roof.png).
