# Cathédrale Saint-Denis — Saint-Denis (Réunion)

Restored ochre neoclassical cathedral: open three-arch Tuscan porch, two pediments, five reinstated statues and square roof lantern with cross.

## Frame and sources

Origin [55.44879519956839, -20.877134070737682], real metres +X east/+Y up/+Z south. Local y=0 is street foundation grade; rotation 13.004° is baked once from mapped controls [[55.4486105, -20.8772813], [55.4490273, -20.8771913]]. Exact provider ownership: 146917154. The bounded median pad is placement metadata for later host validation; no terrain datum or stretch is baked in.

Current post-2025 yellow ochre façade and five statues are confirmed in both comparison exteriors; the former white/statue-free Commons views were rejected. Parish history confirms the 2022–2025 statue restoration and quotes 45 ×33 ×20 m, whereas OSM measures about49.9 ×23.3 m including the rear sacristy. Height is an unsurveyed 27m photo/footprint estimate to the cross, with nave pediment20.2m and porch13.5m: the published20m may exclude the lantern and is not treated as a surveyed overall height. Only the mapped main church/rear sacristy are owned; the detached modern bell frame and plaza fountain are excluded. Porch floor/steps begin above local grade; no plaza or terrain is authored.

- [Identity and history](https://fr.wikipedia.org/wiki/Cath%C3%A9drale_Saint-Denis_de_Saint-Denis_(La_R%C3%A9union))
- [Mapped footprint 146917154](https://www.openstreetmap.org/way/146917154)
- [Parish history, dimensions and 2022–2025 restoration](https://lacathedrale.re/visiteguidee.html)
- [ACMH monument identity and location](https://www.compagnie-acmh.fr/les-monuments/cathedrale-de-saint-denis-de-la-reunion-saint-denis-de-la-reunion/)
- [September2025 restoration photographs — Pierre Marchal /Anakao Press, all rights reserved (page viewed only)](https://www.zinfos974.com/ocre-et-lumiere-la-renaissance-de-la-cathedrale-en-images/)
- [Cathédrale Saint-Denis restored yellow façade and five statues — Uncredited contributor; publisher Tripadvisor, All rights reserved; no reuse licence identified](https://dynamic-media-cdn.tripadvisor.com/media/photo-o/31/d3/c5/56/cathedrale-saint-denis.jpg?h=1200&s=1&w=1200)
- [Restored cathedral portico and five statues — Uncredited activity-provider photographer; publisher Expedia, All rights reserved; no reuse licence identified](https://mediaim.expedia.com/localexpert/51917635/b615c93d-b70a-4bc5-84ec-cc3bbcea4f4d.jpg)

All listed reference photographs were checked for identity in the dossier and remain comparison-only in ignored scratch. Original model © 2026 Codriver, CC BY 4.0; source code MIT; OSM data ODbL. No external mesh, scan, texture, logo or lettering ships.

Cityscape: **not tested**. Full 3D world: **not tested**. Inspector evidence does not establish terrain placement, provider masking or hardware performance.

Export: `pnpm build:top-cities-landmarks cathedrale-saint-denis-reunion`. Measured deterministic QA: no flags, no depth cycles, near back-face sweep 0%. Source/GLB conformance and landmark-specific dimensions/openings/contact probes pass in both LODs. Exported sheet `tmp/r3-france-west-overseas/sheets/final2/cathedrale-saint-denis-reunion.jpg` was inspected against the reference; top view `tmp/r3-france-west-overseas/shots/cathedrale-saint-denis-reunion/cathedrale-saint-denis-reunion-glb-near-light-top.png` was inspected over the footprint rings. The first visual pass added the upper window lattice and pale clock face; all five restored statues and the open porch remain distinct in both LODs. Flat lower roof surfaces stop at their masonry coping rather than retaining buried end faces. Near/far retain silhouette and characteristic openings. Independent review and app placement remain pending.

| LOD | Triangles | Draws | Bytes |
| --- | ---: | ---: | ---: |
| near | 6815 | 6 | 98356 |
| far | 4338 | 6 | 70280 |


## Supplementary inspector review

Procedural near/day and exported far/night were inspected together in `tmp/r3-france-west-overseas/supplement/roundtrip-2.jpg`; silhouette and characteristic openings remain coherent. Orthographic top projection with a visible red footprint overlay is `tmp/r3-france-west-overseas/supplement/cathedrale-saint-denis-reunion/cathedrale-saint-denis-reunion-glb-near-light-orthographic.png` (batch sheet `tmp/r3-france-west-overseas/supplement/orthographic-2.jpg`). The ignored local copy of `shot.mjs` uses an orthographic camera and depth-independent outline only for this inspection, avoiding the perspective parallax and roof occlusion of ground-level rings; shipped geometry and shared tools are unchanged. Cityscape: not tested; Full 3D world: not tested.

## Independent-review follow-up — 2026-11-11

Strengthened the shallow porch tympanum group with an embedded reclining figure/head mass and two reaching arms joining the existing figures. The freely authored relief is visible as a grouped mass in both LODs without lettering, copied outlines or textures; the five restored rooftop statues, muted ochre and open porch are unchanged. Four elevations of the freshly exported near and far models were compared face by face in the single new sheet `tmp/followup/sheets/cathedrale-saint-denis-reunion.jpg`. Landmark tests and focused source/export conformance pass, deterministic QA has zero issues, depth generation drops no cycle edges and its check is current. Cityscape: not tested; Full 3D world: not tested. Independent re-review of the FIX remains a later coordinator gate.
