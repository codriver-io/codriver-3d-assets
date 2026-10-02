# Église de la Madeleine · Paris

Original procedural model commissioned for Codriver in September 2026. Source: `src/peregrine/landmarks/paris-historic-geometry.js`; export with `pnpm build:paris-historic`, then `pnpm models:license`. Code/docs MIT; GLBs CC BY 4.0. Model copyright © 2026 9570-6198 Québec inc. (Codriver). Placement uses [OSM way 54180046](https://www.openstreetmap.org/way/54180046), © OpenStreetMap contributors, ODbL 1.0.

[Ville de Paris](https://www.paris.fr/pages/la-madeleine-n-a-ni-croix-ni-clocher-25919) publishes 108 m length, 43 m width, 30 m height and 52 Corinthian columns of 20 m. Its [restoration page](https://www.paris.fr/pages/debut-des-travaux-pour-l-eglise-de-la-madeleine-18409) shows the continuous peristyle, cella and two monumental stairs. The actual [south facade photograph on the City page](https://www.paris.fr/pages/la-madeleine-n-a-ni-croix-ni-clocher-25919) informed the open portico and pediment. Body and column dimensions are published; cella setback, step rise, capitals and roof geometry are estimates. No photographed texture is used.

Origin `[2.32447,48.87003]` is the rounded center of OSM way 54180046. Local metres use east/up/south; the main entrance faces south. `y=0` is the rigid stylobate foundation plane, with no scene elevation baked.

| Detail | Triangles | Draws | Bytes |
| --- | ---: | ---: | ---: |
| Near | 3,228 | 5 | 154,176 |
| Far | 1,868 | 5 | 90,680 |

Inspect [south portico](/asset-preview.html?asset=paris-madeleine&view=facade), [roof and column ring](/asset-preview.html?asset=paris-madeleine&view=roof), and [procedural source](/asset-preview.html?asset=paris-madeleine&view=facade&source=procedural). [Near portico](../screenshots/paris-madeleine-near-facade.png) and [far roof/night](../screenshots/paris-madeleine-far-roof-night.png) show labeled exported views. The 52 physical column gaps persist in far detail. Interior, relief sculpture and active restoration scaffold are excluded. Cityscape and terrain require host-app evidence.

## Street-level revision — 29 September 2026

52 articulated columns, complete ascending steps, continuous peristyle, entablature and abstract pediment relief.

See the [refinement notes](../paris-street-level-refinement.md) for references, remaining approximations and separate host-mode status. Earlier screenshot links show the initial collection; the current GLB costs are in the manifest.

Current revision: [near GLB facade/support](../screenshots/paris-refinement/paris-madeleine.png) · [near GLB roof/structure](../screenshots/paris-refinement/paris-madeleine-roof-or-structure.png).


## Geographic registration revision

The source and GLBs now include the mapped origin, facade bearing and documented horizontal fit. Heights remain unchanged; the host must apply only geographic scale and its ground datum. See [Paris registration](../paris/placement.md) for reference coordinates, partial-palace scope and approximation limits. Host Cityscape and Full 3D world were checked in the desktop renderer with live map data; this is not vehicle-hardware or authenticated-session evidence.

## QA pass — October 2026

Reviewed against reference photographs and checked with `qa-metrics.mjs` (budgets, far-LOD silhouette, grade, coplanar faces, back faces). recessed tympanum with three relief groups, low gabled roof, shallow side niches; podium and steps widened so columns stand on the podium top. Exported cost: near 15,963 triangles / 4 draws / 536,572 bytes; far 8,693 / 4 / 227,068.
