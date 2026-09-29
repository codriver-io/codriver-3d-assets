# Panthéon · Paris

Original procedural model commissioned for Codriver in September 2026. Source: `src/peregrine/landmarks/paris-historic-geometry.js`; export with `pnpm build:paris-historic`, then `pnpm models:license`. Code/docs MIT; GLBs CC BY 4.0. Model copyright © 2026 9570-6198 Québec inc. (Codriver). Geographic placement uses OpenStreetMap, © contributors, ODbL 1.0.

The [Centre des monuments nationaux teaching dossier](https://www.paris-pantheon.fr/enseignants/ressources-pedagogiques/documents/dossier-enseignant-le-pantheon) gives the nearly square 100 m main mass, 42 m portico, 22 Corinthian columns of 2 m diameter and 20 m height, 32 drum columns and 82 m lantern summit. The western facade and dome were compared to [this actual facade photograph](https://commons.wikimedia.org/wiki/File:Facade_of_the_Panth%C3%A9on_de_Paris,_18_July_2009.jpg). OpenStreetMap [way 16407465](https://www.openstreetmap.org/way/16407465) locates the footprint. The 82 m crown is a published dimension; cross-arm width, roof pitches, column spacing and portico projection are visual estimates. No reference pixels are in the model.

Origin `[2.34607,48.84619]` is the rounded center of the OSM footprint. Local metres are east/up/south; authoring rear points east, front west, rotated +90° about Y. `y=0` is the host-selected rigid foundation plane, not sea level. The cruciform mass and steps occupy a bounded footprint; the surrounding hill is not encoded in the GLB.

| Detail | Triangles | Draws | Bytes |
| --- | ---: | ---: | ---: |
| Near | 5,784 | 5 | 227,780 |
| Far | 3,056 | 4 | 134,892 |

Inspect [facade GLB](/asset-preview.html?asset=paris-pantheon&view=facade), [roof](/asset-preview.html?asset=paris-pantheon&view=roof), and [procedural facade](/asset-preview.html?asset=paris-pantheon&view=facade&source=procedural). [Near facade](../screenshots/paris-pantheon-near-facade.png) and [far roof/night](../screenshots/paris-pantheon-far-roof-night.png) show labeled exported views. Columns and drum rhythm remain in far detail. Facade relief, statuary and stone carving are simplified. Standalone inspection does not establish Cityscape or Full 3D world behavior.

## Street-level revision — 29 September 2026

Column bases/capitals, stepped portico approach, curved dome ribs, nave bays and pilasters.

See the [refinement notes](../paris-street-level-refinement.md) for references, remaining approximations and separate host-mode status. Earlier screenshot links show the initial collection; the current GLB costs are in the manifest.

Current revision: [near GLB facade/support](../screenshots/paris-refinement/paris-pantheon.png) · [near GLB roof/structure](../screenshots/paris-refinement/paris-pantheon-roof-or-structure.png).
