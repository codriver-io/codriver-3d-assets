# Conciergerie · Paris

Original procedural model commissioned for Codriver in September 2026. Source: `src/peregrine/landmarks/paris-historic-geometry.js`; export with `pnpm build:paris-historic`, then `pnpm models:license`. Code/docs MIT; GLBs CC BY 4.0. Model copyright © 2026 9570-6198 Québec inc. (Codriver). Approximate alignment uses OpenStreetMap geographic data, © contributors, ODbL 1.0.

The [Centre des monuments nationaux history](https://www.paris-conciergerie.fr/decouvrir/histoire-de-la-conciergerie) identifies the César and Argent towers, medieval halls, later Seine facade and clock tower; its [tower guide](https://www.paris-conciergerie.fr/enseignants/ressources-pedagogiques/documents/livret-facile-a-lire-et-a-comprendre-falc-conciergerie) names the four river towers. The generated silhouette was compared with [this actual Seine frontage photograph](https://commons.wikimedia.org/wiki/File:Paris_Conciergerie_265.jpg). River range length (~166 m), depth (~39 m), tower positions and roof heights are visual/map estimates. The model excludes the Palais de Justice, Sainte-Chapelle and river wall beyond the Conciergerie.

Origin `[2.34582,48.85591]` approximates the center of the north-facing range. Local metres use east/up/south; the authored river facade faces north. `y=0` is a host-selected rigid foundation plane; the export has no riverbed height or terrain warp.

| Detail | Triangles | Draws | Bytes |
| --- | ---: | ---: | ---: |
| Near | 2,740 | 5 | 146,008 |
| Far | 1,156 | 5 | 62,200 |

Inspect [river facade](/asset-preview.html?asset=paris-conciergerie&view=facade), [roof/towers](/asset-preview.html?asset=paris-conciergerie&view=roof), and [procedural source](/asset-preview.html?asset=paris-conciergerie&view=facade&source=procedural). [Near river facade](../screenshots/paris-conciergerie-near-facade.png) and [far roof/night](../screenshots/paris-conciergerie-far-roof-night.png) show labeled exported views. Masonry, Gothic tracery and internal vaults are schematic; both LODs keep towers. Cityscape and terrain results require host-app evidence.

## Street-level revision — 29 September 2026

Distinct western crenellated tower, closer twin central towers, Gothic bays and gilded eastern clock.

See the [refinement notes](../paris-street-level-refinement.md) for references, remaining approximations and separate host-mode status. Earlier screenshot links show the initial collection; the current GLB costs are in the manifest.

Current revision: [near GLB facade/support](../screenshots/paris-refinement/paris-conciergerie.png) · [near GLB roof/structure](../screenshots/paris-refinement/paris-conciergerie-roof-or-structure.png).


## Geographic registration revision

The source and GLBs now include the mapped origin, facade bearing and documented horizontal fit. Heights remain unchanged; the host must apply only geographic scale and its ground datum. See [Paris registration](../paris/placement.md) for reference coordinates, partial-palace scope and approximation limits. Host Cityscape and Full 3D world were checked in the desktop renderer with live map data; this is not vehicle-hardware or authenticated-session evidence.

## QA pass — October 2026

Reviewed against reference photographs and checked with `qa-metrics.mjs` (budgets, far-LOD silhouette, grade, coplanar faces, back faces). steep slate hip roof, tall dormers and slender conical tower roofs about 24 m high; near minY is now 0. Exported cost: near 5,282 triangles / 7 draws / 257,016 bytes; far 1,615 / 7 / 78,104.
