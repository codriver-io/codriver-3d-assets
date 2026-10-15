# Pont de l’Alma — Paris

Original procedural model of the present 1974 steel crossing. The supplied dossier’s 153 m dimension belongs to the preceding bridge; [AFGC engineering heritage](https://www.afgc.asso.fr/history-heritage/pont-de-lalma-a-paris/) identifies the current 142.5 m structure, with 110 m and 31.5 m continuous spans, four variable-depth steel caissons and 42 m width.

| Quantity | Model | Basis |
| --- | ---: | --- |
| Overall structural length | 142.5 m | AFGC |
| Spans | 110 / 31.5 m | AFGC, nominal support axes |
| Width | 42 m | AFGC; IGN aerial ~42 ±1 m |
| Carriageways / walks / median | 2 × 14 / 2 × 6 / 2 m | AFGC; aerial cross-check |
| Deck at both quays | +0.10 m | Live street/quay datum, both modes |
| Caisson soffit below quay datum | −1.35 → −4.35 m at pier | Photo-estimated section |
| Zouave figure / plinth | about 5.2 / 1.83 m | Dossier/photo proportions |
| Highest lamp above quay | 6.75 m | Photo estimate |
| Lowest authored support | −7.90 m | Buried support depth; not surveyed |

Alignment is the mean of OSM carriageways 17066884 and 683970965, extended to the engineering length. The model now ends at its two abutments: Avenue Rapp, Avenue Bosquet, Place de la Résistance, Place de l’Alma and Avenue George V remain ordinary provider streets with no landmark height override. Origin `[2.30175495,48.863436325]`, local metres east/up/south, y=0 at the upper quay/street. The single pier is at station 110.5; bearing axes at 0.5 and 142.0 give the asymmetric 110/31.5 m spans. OSM envelope way 183589443 remains in FOOTPRINTS and the exact road/cycle/footway ids remain attributed in OSM_WAYS. The engineering envelope differs by about 3 m at the ends from the cadastral inner-bank outline; the statue plinth is estimated from photographs. No building or building:part occurs in the dossier’s 300 m query.

IGN Géoplateforme BD ORTHO (Licence Ouverte 2.0) is retained only in ignored `tmp/top-cities/pont-de-l-alma/ign-aerial.jpg`; the URL/scale are in `ign-source.json`. The 400 Mercator-metre square represents 263.15 ground metres here, about 0.257 m/pixel: deck ~164 px (~42 m), traffic bands ~54 px (~14 m). Supplied photos by Guilhem Vellut (CC BY 2.0), Dom (CC BY-SA 4.0), Florian Pépellin (CC BY-SA 4.0), Tangopaso (public domain) and Ibex73 (CC BY-SA 4.0) remain credited in the catalog. No reference photographs or textures ship.

Four variable-depth steel caissons meet the eccentric stone pier and terminal bearing blocks. Both LODs retain the open spans, rail end posts, raised walks, tulip lamps and original low-poly Zouave silhouette. The statue has trousers, gaiters, sash, jacket/cape, folded arms, beard and fez, with no carved facial detail or inscriptions. Far uses coarser curves/statue tessellation and fewer rail uprights. Named materials, normals and bridgeLift attachments survive export.

## Review correction

The g11c review rejected the former 110 m approach ribbons and 8 m deck: they floated over the quays and places. Those ramps and their mint walk edges are removed. All authoring now lies on the 142.5 m crossing. The flat deck is +0.10 m; world uses `bank-fit` with live DEM controls only at the two quay ends, with 16 m lateral mouth crossfall blending and rigid authored width (`fittedLateral` identity). Riverbed heights do not set the deck datum, and there is no terrain corridor flattening or baked absolute elevation.

The steel caissons, stone supports and Zouave hang below the deck. `layer.js` hides their wholly below-grade materials in Cityscape, where flat ground writes no depth, following Pont Royal/Fonderie; it restores them in world, including after asynchronous near/far loads and repeated mode changes. Buried feet retain their authored depth below the sampled terrain; they are not claimed to be surveyed riverbed contacts. The green caisson webs remain exposed under the walk overhang in world and the low inspection views.

The teal road slab came from the steel material’s generated depth bias showing through asphalt in world. The local layer now orders asphalt ahead of steel, then fallback paint ahead of asphalt, while preserving the shared live pavement colour. This is tested for both LODs and themes; no shared depth solver or renderer source was changed. Near-only fallback four-lane paint is an approximation; live HD remains authoritative when available.

| LOD | Before triangles / draws / bytes | After triangles / draws / bytes | After KiB |
| --- | --- | --- | ---: |
| Near | 14,560 / 12 / 569,880 | 13,688 / 8 / 527,888 | 515.52 |
| Far | 7,048 / 7 / 291,796 | 6,396 / 7 / 256,112 | 250.11 |

## Verification

Exported near/light sheet: `tmp/top-cities/shots/pont-de-l-alma/fix-1/pont-de-l-alma-glb-near-light-sheet.jpg`; exported far/dark sheet: `fix-2/pont-de-l-alma-glb-far-dark-sheet.jpg`. The scratch inspector’s ground is lowered below the hanging structure so it can show its soffit and Zouave; this does not change runtime terrain. Two look-fix rounds only. The first sheet confirms removed ramps, supported rail/lamp ends and visible asymmetric caisson curves.

Required focused landmark and registry tests pass (844 tests before the final material-order regression; 18 dedicated tests after that correction). They cover named terminal contacts and negative cases, four caissons, single eccentric pier, original statue feet, bounds/width, GLB round trip, rigid width, exact mapped crossing vertices in both directions, cross/off-bridge rejection, immutable fitting, missing/replaced terrain, mode-dependent visibility and material order. No SPEC.ready assertions were added. Depth generation/check report zero material cycles. QA reports zero layered faces, zero coplanar overlaps and 0% back-face hits; its generic below-grade warning is intentional for this hang-under low bridge and is declared by `SPEC.belowGradeM` and hidden appropriately in Cityscape. Catalog validation and local asset preview build are required delivery checks.

## Application placement

Final local evidence: `tmp/top-cities/shots/pont-de-l-alma/final-fix-{cityscape,world}/`, including far/near/street plus both landings at 356.4° and 176.4°. Each screenshot has a numeric `*-measure.json` recording the actual active bridge, mapped vertices, both bands, both directions, camera height and visibility. Spot report rows show active:false because synthetic spot ids are not registry ids; the accompanying numeric records query the real Pont de l’Alma layer.

The current renderer is built to `/tmp/alma-fix/` and supplied by the test browser; committed public/peregrine*.js files are untouched. Product gates and settings are unchanged. The material-correction capture bundle stamp is `45679d71afbd`.

Cityscape and Full 3D world: **verified locally** for standard-road placement, near/far, both landing directions and the shared vehicle/camera height API. Both ends and both directional bands return +0.10 m above their own queried ground in both modes; forward, reverse and camera agree (maximum endpoint error 0 in Cityscape and 1.73e−10 m in world). The final `landings-sheet.jpg` in each mode was read back alongside the full-size near/landing PNGs: no floating approach ribbons or teal road bleed-through remains. The world deck spans bank to bank, about 2.6 m above the coarse DEM in mid-river, instead of adding the previous 8 m lift. The 10 retained exact mapped roadway vertices belong to the crossing; ordinary approach vertices are deliberately excluded from landmark ownership. All visible materials use the shared unlit conversion.

HD pavement/paint, actual driving/traffic, the complete lifecycle matrix, lane-count/dash phase and Tesla hardware are **not tested**: `/osm-lanes` returns503 and remote account endpoints have localhost CORS failures. Redis/Overpass warm-up is not enabled for these captures. The Zouave remains a deliberately low-poly silhouette. Independent lead review of final likeness and application evidence remains required before release; no online environment is deployed.

Generated depth table and app bundles are excluded from the landmark commit. After integrating this branch, regenerate `node scripts/landmark-depth-layers.mjs --ids pont-de-l-alma`, check it, then rebuild the normal renderer.
