# Tour Saint-Aubin — Angers

Isolated Romanesque belfry with a tall blind stone base, twin arcaded lower bell bays, single upper bell bays, four slender turret spires and a curved slate pavilion roof.

## Frame and sources

Origin [-0.55365625, 47.468969], real metres +X east/+Y up/+Z south. Local y=0 is street foundation grade; rotation 40.891° is baked once from mapped controls [[-0.553665, 47.468868], [-0.553501, 47.468964]]. Exact provider ownership: 126916680. The bounded median pad is placement metadata for later host validation; no terrain datum or stretch is baked in.

54 m overall from Destination Angers and OSM. Mapped square plan and bearing; storey splits, bay and louvre dimensions, roof curvature and spires are photograph estimates. Standing detached tower only; adjacent former abbey and memorial plaques excluded.

- [Identity and history](https://fr.wikipedia.org/wiki/Abbaye_Saint-Aubin_d%27Angers)
- [Mapped footprint 126916680](https://www.openstreetmap.org/way/126916680)
- [Destination Angers: 54 m tower](https://www.destination-angers.com/tourisme/organiser-son-sejour/activites-a-faire-a-angers/sites-visites-angers/la-tour-saint-aubin-angers-fr-6742941/)
- [Fichier:P1020199 Angers Tour Saint-Aubin reductwk.JPG — Mbzt, CC BY 3.0](https://commons.wikimedia.org/wiki/File:P1020199_Angers_Tour_Saint-Aubin_reductwk.JPG)
- [File:Angers - tour Saint-Aubin 05.jpg — Fab5669, CC0](https://commons.wikimedia.org/wiki/File:Angers_-_tour_Saint-Aubin_05.jpg)

All listed reference photographs were checked for identity in the dossier and remain comparison-only in ignored scratch. Original model © 2026 Codriver, CC BY 4.0; source code MIT; OSM data ODbL. No external mesh, scan, texture, logo or lettering ships.

Cityscape: **not tested**. Full 3D world: **not tested**. Inspector evidence does not establish terrain placement, provider masking or hardware performance.

Export: `pnpm build:top-cities-landmarks tour-saint-aubin-angers`. Measured deterministic QA: no flags, no depth cycles, near back-face sweep 0%. Source/GLB conformance and landmark-specific dimensions/openings/contact probes pass in both LODs. Exported sheet `tmp/r3-france-west-overseas/sheets/final2/tour-saint-aubin-angers.jpg` was inspected against the reference; top view `tmp/r3-france-west-overseas/shots/tour-saint-aubin-angers/tour-saint-aubin-angers-glb-near-light-top.png` was inspected over the footprint rings. Photo review shortened the blind base to 24 m and set the curved roof spring at 45 m, preserving the 54 m summit; every lower and upper louvre end is tested against its named masonry jamb with a shortened negative control. Near/far retain silhouette and characteristic openings. Independent review and app placement remain pending.

| LOD | Triangles | Draws | Bytes |
| --- | ---: | ---: | ---: |
| near | 8448 | 5 | 102992 |
| far | 2848 | 5 | 47324 |


## Supplementary inspector review

Procedural near/day and exported far/night were inspected together in `tmp/r3-france-west-overseas/supplement/roundtrip-1.jpg`; silhouette and characteristic openings remain coherent. Orthographic top projection with a visible red footprint overlay is `tmp/r3-france-west-overseas/supplement/tour-saint-aubin-angers/tour-saint-aubin-angers-glb-near-light-orthographic.png` (batch sheet `tmp/r3-france-west-overseas/supplement/orthographic-1.jpg`). The ignored local copy of `shot.mjs` uses an orthographic camera and depth-independent outline only for this inspection, avoiding the perspective parallax and roof occlusion of ground-level rings; shipped geometry and shared tools are unchanged. Cityscape: not tested; Full 3D world: not tested.

## Independent-review follow-up — 2026-11-11

Coarsened far louvres to1.9m stations, retained a single coarse concentric archivolt per opening and kept every paired/single bell bay distinct. Far now meets the optional3000triangle target; near is unchanged. Contact tests cover every remaining louvre end, with the existing shortened-member negative control. Four elevations of the freshly exported near and far models were compared face by face in the single new sheet `tmp/followup/sheets/tour-saint-aubin-angers.jpg`. Landmark tests and focused source/export conformance pass, deterministic QA has zero issues, depth generation drops no cycle edges and its check is current. Cityscape: not tested; Full 3D world: not tested. Independent re-review of the FIX remains a later coordinator gate.
