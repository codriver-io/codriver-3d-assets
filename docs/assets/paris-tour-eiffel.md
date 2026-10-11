# Tour Eiffel — `paris-tour-eiffel`

Original texture-free geometry commissioned for Codriver in 2026. The [official monument figures](https://www.toureiffel.paris/fr/le-monument/chiffres-cle) give 330 m total height, a 125 m square base and decks at 57, 115 and 276 m. Those published values set the model's scale. Leg curvature, arch radius, lattice spacing, railings, antenna sections and colours are visual estimates. The permanent daytime structure is modeled; the protected illumination show is outside scope.

Origin [2.2944962, 48.8582620] is the computed centroid of [OSM way 5013364](https://www.openstreetmap.org/way/5013364), retrieved 2026-09-29. Approximate rotation 45° follows the mapped diagonal footprint; it is not a survey. Local y=0 is the plane of four distinct footings. Axes are east/up/south in metres with no terrain datum or Mercator scaling. © OpenStreetMap contributors, ODbL 1.0.

Build: `pnpm build:paris-icons`. The [inspector](/asset-preview.html?asset=paris-tour-eiffel) compares procedural source and exported near/far GLBs; measured costs are in `public/models/buildings/paris-tour-eiffel.json`. Host Cityscape: not tested here. Host Full 3D world: not tested here. Hardware timing is unmeasured.

Visual comparison: [Wikimedia daytime photograph](https://commons.wikimedia.org/wiki/File:Eiffel_Tower_from_Champ-de-Mars_by_Thomas_Depenbusch.jpg). No reference pixels are redistributed. [GLB façade](../../docs/screenshots/paris-icons/paris-tour-eiffel-near-glb-facade.png) · [source façade](../../docs/screenshots/paris-icons/paris-tour-eiffel-near-source-facade.png) · [far roof/night](../../docs/screenshots/paris-icons/paris-tour-eiffel-far-glb-roof-night.png).

## Street-level revision — 29 September 2026

Broader curved lower piers, four-sided X bracing, separate upper shaft, framed floors and connected decorative arches.

See the [refinement notes](../paris-street-level-refinement.md) for references, remaining approximations and separate host-mode status. Earlier screenshot links show the initial collection; the current GLB costs are in the manifest.

First refinement: [near GLB facade/support](../screenshots/paris-refinement/paris-tour-eiffel.png) · [near GLB roof/structure](../screenshots/paris-refinement/paris-tour-eiffel-roof-or-structure.png).


## Second architectural pass

Second pass: curved chords with dense secondary lattice, lift rails, deep platform trusses, glazed observation strips and a two-storey summit gallery. Original architectural geometry only; illumination shows are excluded.

See [references and validation](../paris-second-pass.md).

Current second pass: [near GLB façade](../screenshots/paris-second-pass/paris-tour-eiffel.png) · [near GLB roof](../screenshots/paris-second-pass/paris-tour-eiffel-roof.png).


## Geographic registration revision

The source and GLBs now include the mapped origin, facade bearing and documented horizontal fit. Heights remain unchanged; the host must apply only geographic scale and its ground datum. See [Paris registration](../paris/placement.md) for reference coordinates, partial-palace scope and approximation limits. Host Cityscape and Full 3D world were checked in the desktop renderer with live map data; this is not vehicle-hardware or authenticated-session evidence.

## QA pass — October 2026

Reviewed against reference photographs and checked with `qa-metrics.mjs` (budgets, far-LOD silhouette, grade, coplanar faces, back faces). far LOD uses a 3-sided secondary lattice, one balustrade rail, no lift rails or mullions; duplicate beams removed in both LODs; deck glass neutral grey. Exported cost: near 54,128 triangles / 5 draws / 2,192,032 bytes; far 7,608 / 5 / 297,820.
