# Église de la Madeleine · Paris

Original procedural model commissioned for Codriver in September 2026. Source: `src/peregrine/landmarks/paris-historic-geometry.js`; export with `pnpm build:paris-historic`, then `pnpm models:license`. Code/docs MIT; GLBs CC BY 4.0. Model copyright © 2026 9570-6198 Québec inc. (Codriver). Placement uses [OSM way 54180046](https://www.openstreetmap.org/way/54180046), © OpenStreetMap contributors, ODbL 1.0.

[Ville de Paris](https://www.paris.fr/pages/la-madeleine-n-a-ni-croix-ni-clocher-25919) publishes 108 m length, 43 m width, 30 m height and 52 Corinthian columns of 20 m. Its [restoration page](https://www.paris.fr/pages/debut-des-travaux-pour-l-eglise-de-la-madeleine-18409) shows the continuous peristyle, cella and two monumental stairs. The actual [south facade photograph on the City page](https://www.paris.fr/pages/la-madeleine-n-a-ni-croix-ni-clocher-25919) informed the open portico and pediment. Body and column dimensions are published; cella setback, step rise, capitals and roof geometry are estimates. No photographed texture is used.

Origin `[2.32447,48.87003]` is the rounded center of OSM way 54180046. Local metres use east/up/south; the main entrance faces south. `y=0` is the rigid stylobate foundation plane, with no scene elevation baked.

| Detail | Triangles | Draws | Bytes |
| --- | ---: | ---: | ---: |
| Near | 3,228 | 5 | 154,176 |
| Far | 1,868 | 5 | 90,680 |

Inspect [south portico](/asset-preview.html?asset=paris-madeleine&view=facade), [roof and column ring](/asset-preview.html?asset=paris-madeleine&view=roof), and [procedural source](/asset-preview.html?asset=paris-madeleine&view=facade&source=procedural). [Near portico](../screenshots/paris-madeleine-near-facade.png) and [far roof/night](../screenshots/paris-madeleine-far-roof-night.png) show labeled exported views. The 52 physical column gaps persist in far detail. Interior, relief sculpture and active restoration scaffold are excluded. Cityscape and terrain require host-app evidence.
