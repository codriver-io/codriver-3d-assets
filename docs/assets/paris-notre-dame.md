# Notre-Dame de Paris — `paris-notre-dame`

Original texture-free geometry commissioned for Codriver in 2026. The [cathedral plan](https://www.notredamedeparis.fr/en/understand/architecture/plans/) publishes 127 m length, 48 m width, 69 m towers and 43 m under the nave roof. The [spire page](https://www.notredamedeparis.fr/en/understand/architecture/the-spire/) gives 96 m. The model depicts the permanent restored exterior after the cathedral's [2024 reopening](https://www.notredamedeparis.fr/en/relive-the-ceremonies/), without scaffolding. Buttress rhythm, portal recesses, roofing and window details are visual estimates.

Origin [2.3499095, 48.8529723] is the computed centroid of [OSM way 201611261](https://www.openstreetmap.org/way/201611261), retrieved 2026-09-29. Approximate -2.1286 rad rotation puts the west towers toward the forecourt. Local y=0 is a rigid foundation plane, in east/up/south metres without terrain height. The 48 × 127 m envelope is published, while this exterior outline is simplified. © OpenStreetMap contributors, ODbL 1.0.

Build: `pnpm build:paris-icons`. [Inspect source and GLBs](/asset-preview.html?asset=paris-notre-dame), including roof and opposite facade; measured costs are in `public/models/buildings/paris-notre-dame.json`. Host Cityscape: not tested here. Host Full 3D world: not tested here. Hardware timing is unmeasured.

Visual comparison: [Wikimedia west-façade photograph](https://commons.wikimedia.org/wiki/File:Notre-Dame_de_Paris_2013-07-24.jpg), supplemented by the cathedral's current spire information. No reference pixels are redistributed. [GLB façade](../../docs/screenshots/paris-icons/paris-notre-dame-near-glb-facade.png) · [source façade](../../docs/screenshots/paris-icons/paris-notre-dame-near-source-facade.png) · [far roof/night](../../docs/screenshots/paris-icons/paris-notre-dame-far-glb-roof-night.png).

## Street-level revision — 29 September 2026

43.5 m west facade, 9.7 m west rose, 13.1 m transept roses, open belfries, narrower nave and two tiers of flying buttresses.

See the [refinement notes](../paris-street-level-refinement.md) for references, remaining approximations and separate host-mode status. Earlier screenshot links show the initial collection; the current GLB costs are in the manifest.

Current revision: [near GLB facade/support](../screenshots/paris-refinement/paris-notre-dame.png) · [near GLB roof/structure](../screenshots/paris-refinement/paris-notre-dame-roof-or-structure.png).


## Geographic registration revision

The source and GLBs now include the mapped origin, facade bearing and documented horizontal fit. Heights remain unchanged; the host must apply only geographic scale and its ground datum. See [Paris registration](../paris/placement.md) for reference coordinates, partial-palace scope and approximation limits. Host Cityscape and Full 3D world were checked in the desktop renderer with live map data; this is not vehicle-hardware or authenticated-session evidence.
