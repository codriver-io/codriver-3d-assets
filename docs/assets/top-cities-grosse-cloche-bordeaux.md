# Grosse Cloche — Bordeaux

Original procedural exterior of the standing twin-turret city gate and belfry, without adjoining Saint-Éloi church. Frame: local real metres, +X east, +Y up, +Z south; y=0 is street grade. Geographic rotation is baked once from the north facade OSM controls in config.js. The exact mapped gate ring owns way 80032457; church and neighboring houses are excluded.

OSM gives 40 m overall, adopted as an unsurveyed estimate. The mapped plan is about 20 × 9 m; stages, bell diameter, clock and lantern dimensions are photograph estimates. Slate cones, great exposed bell, open upper arch and lantern, clocks and real street passage are retained in both LODs. The small weather vane is simplified to a pin; relief sculpture, lettering, clock numerals and interiors are omitted.

References: [identity](https://fr.wikipedia.org/wiki/Grosse_cloche_de_Bordeaux), [mapped outline](https://www.openstreetmap.org/way/80032457). Grand Parc’s full exterior (CC BY 2.0), Orikrin1998’s bell and opposite views (CC BY 3.0), Guiguilacagouille’s opposite clock view (CC BY-SA 3.0), and Franck-fnba’s street exterior (CC BY-SA 4.0) were checked in the dossier reference sheet; full links are in the catalog. The unrelated plaque photograph is excluded. Photos remain comparison-only in ignored scratch. Original geometry © 2026 Codriver, models CC BY 4.0, code MIT, mapped data ODbL.

Cityscape: **not tested**. Full 3D world: **not tested**. Terrain placement, provider masking and hardware performance require later app verification. Bounded median pad metadata is a handoff, not verification.

Export: `pnpm build:top-cities-landmarks grosse-cloche-bordeaux`. Final deterministic QA: no flags, no layered faces, no coplanar pairs, 0.5% back-face hits and no depth cycles. Focused tests pin 40 m height, paired roof contacts, street/belfry/lantern daylight and bell-crosshead suspension with a shortened negative control. The final contact sheet `tmp/r3-france-west-overseas/sheets/final/grosse-cloche-bordeaux.jpg` was inspected against the reference photo, plus the exported top view over footprint rings `tmp/r3-france-west-overseas/shots/grosse-cloche-bordeaux/grosse-cloche-bordeaux-glb-near-light-top.png`. First look added turret slits and stone cornices; padded bounds fix shared framing for this narrow tower. Near/far preserve the recognizable silhouette and openings. Independent review remains pending.

| LOD | Triangles | Draws | Bytes |
| --- | ---: | ---: | ---: |
| near | 3712 | 7 | 50320 |
| far | 2584 | 7 | 41584 |


## Supplementary inspector review

Procedural near/day and exported far/night were inspected together in `tmp/r3-france-west-overseas/supplement/roundtrip-1.jpg`; silhouette and characteristic openings remain coherent. Orthographic top projection with a visible red footprint overlay is `tmp/r3-france-west-overseas/supplement/grosse-cloche-bordeaux/grosse-cloche-bordeaux-glb-near-light-orthographic.png` (batch sheet `tmp/r3-france-west-overseas/supplement/orthographic-1.jpg`). The ignored local copy of `shot.mjs` uses an orthographic camera and depth-independent outline only for this inspection, avoiding the perspective parallax and roof occlusion of ground-level rings; shipped geometry and shared tools are unchanged. Cityscape: not tested; Full 3D world: not tested.

## Independent-review follow-up — 2026-11-11

Both clock faces now use a3.696m dial against the3.36m bell mouth (ratio1.10), and a4.9896m square backing (1.35times dial,1.485times bell mouth), with muted brown casing, a plain border and readable hands in both LODs; no numerals or lettering. Numeric ratios are at the centre of the requested ranges, with no photographic precision claim beyond the review target. Four elevations of the freshly exported near and far models were compared face by face in the single new sheet `tmp/followup/sheets/grosse-cloche-bordeaux.jpg`. Landmark tests and focused source/export conformance pass, deterministic QA has zero issues, depth generation drops no cycle edges and its check is current. Cityscape: not tested; Full 3D world: not tested. Independent re-review of the FIX remains a later coordinator gate.
