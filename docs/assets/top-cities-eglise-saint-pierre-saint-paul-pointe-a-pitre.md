# Église Saint-Pierre-et-Saint-Paul — Pointe-à-Pitre

Broad ochre and cream neoclassical front with three arched fretwork windows, concave scroll shoulders and side-door pediments; long iron-framed nave and offset rear metal clock campanile.

## Frame and sources

Origin [-61.53442379839752, 16.238998243302536], real metres +X east/+Y up/+Z south. Local y=0 is street foundation grade; rotation 68.893° is baked once from mapped controls [[-61.5343938, 16.2387126], [-61.5342017, 16.2391904]]. Exact provider ownership: 65831534. The bounded median pad is placement metadata for later host validation; no terrain datum or stretch is baked in.

The single OSM outline measures about57.0 ×28.9m for the hall and includes the4.3 ×5.1m offset rear campanile projection. Adopted35m campanile height is an unsurveyed published approximate figure, not a measured elevation; the21m front pediment and intermediate levels are photo/footprint estimates. The two Commons exteriors identify the same permanent façade and rear metal tower; the city and current diocesan restoration reports were checked, including June8 2026 roof repairs. Model represents the permanent exterior, excludes temporary construction equipment, and does not assume a completed2027 restoration or recolouring. Local y=0 is foundation grade; steps/floor finish are0.15m or more above grade; no plaza/fountain/terrain is included.

- [Identity and history](https://fr.wikipedia.org/wiki/%C3%89glise_Saint-Pierre-et-Saint-Paul_de_Pointe-%C3%A0-Pitre)
- [Mapped footprint 65831534](https://www.openstreetmap.org/way/65831534)
- [City monument identity and metal construction](https://pointeapitre.fr/fr/explorer-la-ville/48-eglise-saint-pierre-et-saint-paul)
- [Culture ministry restoration account](https://www.culture.gouv.fr/regions/dac-guadeloupe/actualites/Plan-de-relance-l-eglise-St-Pierre-St-Paul)
- [Diocese: June8 2026 roof work; not a future completed restoration](https://www.catholique-guadeloupe.org/78-les-actualites.htm?view=actualite&view_id=97101098)
- [Monument inventory IA97100213](https://pop.culture.gouv.fr/notice/merimee/IA97100213)
- [File:Eglise Saint Pierre et Saint Paul - PA00105864 04.JPG — Aristoi, CC BY-SA 3.0](https://commons.wikimedia.org/wiki/File:Eglise_Saint_Pierre_et_Saint_Paul_-_PA00105864_04.JPG)
- [File:Eglise Saint Pierre et Saint Paul - PA00105864 14.JPG — Aristoi, CC BY-SA 3.0](https://commons.wikimedia.org/wiki/File:Eglise_Saint_Pierre_et_Saint_Paul_-_PA00105864_14.JPG)

All listed reference photographs were checked for identity in the dossier and remain comparison-only in ignored scratch. Original model © 2026 Codriver, CC BY 4.0; source code MIT; OSM data ODbL. No external mesh, scan, texture, logo or lettering ships.

Cityscape: **not tested**. Full 3D world: **not tested**. Inspector evidence does not establish terrain placement, provider masking or hardware performance.

Export: `pnpm build:top-cities-landmarks eglise-saint-pierre-saint-paul-pointe-a-pitre`. Measured deterministic QA: no flags, no depth cycles, near back-face sweep 0.4%. Source/GLB conformance and landmark-specific dimensions/openings/contact probes pass in both LODs. Exported sheet `tmp/r3-france-west-overseas/sheets/final2/eglise-saint-pierre-saint-paul-pointe-a-pitre.jpg` was inspected against the reference; top view `tmp/r3-france-west-overseas/shots/eglise-saint-pierre-saint-paul-pointe-a-pitre/eglise-saint-pierre-saint-paul-pointe-a-pitre-glb-near-light-top.png` was inspected over the footprint rings. The visual pass lightened the metal campanile enamel to the muted cream/beige exterior reference; concave shoulders, three upper fretwork arches and the offset rear crown remain distinct at far distance. Buried cornice backs and aisle-roof end caps were removed; all shoulder cornice terminals contact the named masonry and have a failing raised-end negative control. Near/far retain silhouette and characteristic openings. Independent review and app placement remain pending.

| LOD | Triangles | Draws | Bytes |
| --- | ---: | ---: | ---: |
| near | 6692 | 7 | 111196 |
| far | 4147 | 7 | 77200 |


## Supplementary inspector review

Procedural near/day and exported far/night were inspected together in `tmp/r3-france-west-overseas/supplement/roundtrip-2.jpg`; silhouette and characteristic openings remain coherent. Orthographic top projection with a visible red footprint overlay is `tmp/r3-france-west-overseas/supplement/eglise-saint-pierre-saint-paul-pointe-a-pitre/eglise-saint-pierre-saint-paul-pointe-a-pitre-glb-near-light-orthographic.png` (batch sheet `tmp/r3-france-west-overseas/supplement/orthographic-2.jpg`). The ignored local copy of `shot.mjs` uses an orthographic camera and depth-independent outline only for this inspection, avoiding the perspective parallax and roof occlusion of ground-level rings; shipped geometry and shared tools are unchanged. Cityscape: not tested; Full 3D world: not tested.

## Independent-review follow-up — 2026-11-11

Strengthened the three upper arch frames from0.13m to0.19m tube radius and widened their adjoining light pilasters from0.38m to0.48m in both LODs. The coarse fretwork remains unchanged and reads inside a clearer light frame; no extra geometry count, material or decorative lettering was added. Four elevations of the freshly exported near and far models were compared face by face in the single new sheet `tmp/followup/sheets/eglise-saint-pierre-saint-paul-pointe-a-pitre.jpg`. Landmark tests and focused source/export conformance pass, deterministic QA has zero issues, depth generation drops no cycle edges and its check is current. Cityscape: not tested; Full 3D world: not tested. Independent re-review of the FIX remains a later coordinator gate.
