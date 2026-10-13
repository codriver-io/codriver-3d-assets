# CEC Palace — Bucharest

Original procedural exterior of the 1900 savings-bank palace at **Calea Victoriei 13**, Bucharest, Romania. Paul Gottereau designed the project and Ion Socolescu supervised construction. The identity is the central glass-and-metal dome and lantern, four Renaissance corner domes, and the monumental arched entrance carried by two pairs of composite columns. All remain separate readable features in near and far detail.

## Sources and rights

The supplied dossier contains the OSM extract and three exterior Commons photographs; all were inspected in `tmp/top-cities/cec-palace/refs-sheet.jpg`. Reference pages and their stated licences were checked on 2026-10-13. No scan, mesh, texture or photo is included in the source or exports.

- [CEC Palace history and architectural description](https://en.wikipedia.org/wiki/CEC_Palace): completion 1900, architects, bank use, glass-and-metal main dome, four Renaissance corner domes and paired-column arch.
- [OSM outer outline, way 973712798](https://www.openstreetmap.org/way/973712798), supplied `osm.json`: measured plan and unsurveyed building-part heights/materials. OSM-derived geographic data © OpenStreetMap contributors, ODbL 1.0.
- [Diego Delso, Palacio CEC, 2016-05-29, DD 91–93 HDR](https://commons.wikimedia.org/wiki/File:Palacio_CEC,_Bucarest,_Ruman%C3%ADa,_2016-05-29,_DD_91-93_HDR.jpg), CC BY-SA 4.0: front and night silhouette.
- [Tiberiu Neag, Palatul Casei de Depuneri, Consemnațiuni și Economie Bucuresti](https://commons.wikimedia.org/wiki/File:Palatul_Casei_de_Depuneri,_Consemna%C8%9Biuni_%C8%99i_Economie_Bucuresti.jpg), CC BY-SA 3.0 Romania: entrance and glazing.
- [Sailko, Bucarest, palazzo della cassa di risparmio, 01](https://commons.wikimedia.org/wiki/File:Bucarest,_palazzo_della_cassa_di_risparmio,_01.JPG), CC BY-SA 3.0: oblique frontage, corner dome and pilasters.

Original geometry by Codriver (2026-10-13); model CC BY 4.0, code/docs MIT. The photo credits describe visual references only; those images remain in ignored scratch. No outside contributed asset or contributor consent is claimed.

## Dimensions and frame

| Feature | Authored value | Basis |
| --- | ---: | --- |
| Frontage body length | about 60.6 m | Measured from OSM outline |
| Main body depth | about 39.7 m | Measured from OSM outline; entrance projects to local z=24.02 m |
| Main wall cornice | 17.5 m | Unsurveyed OSM building-part tags |
| Main dome diameter | 17 m | OSM plan and photo estimate |
| Main dome roof / lantern | 34.8 / 37.5 m | OSM 35 / 37.5 m parts, adjusted to photo profile |
| Main finial tip | 40 m | Photo estimate, not a published surveyed height |
| Corner cap / finial | 27.7 / 32.5 m | OSM 27.5 / 32.5 m parts; photo calibration shortens unsurveyed 35 m corner finial tags |
| Entrance arch outer span / crown | 16.3 / 28.4 m | Photo estimate fitted to mapped projection |
| Facade outward bearing | 102° | Mapped front edge; rounded within about 1° |

Origin `[26.096458, 44.432026]` sits within the palace outline. Coordinates are real metres **east/up/south**, with rigid grade at `y=0`. The authored facade-local +Z points east-southeast; rotation **78°** is baked exactly once in the generator/GLBs. Mapped controls `[26.0967442,44.432175]` and `[26.0966652,44.431911]` confirm the frontage direction. No DEM altitude, latitude stretch or runtime code is imported.

`footprint.js` preserves the exact 37-point OSM outer ring (including its repeated closing point), and names the outer provider way plus 154 palace building-part ways. The entrance projection is an open stepped portico instead of a solid extrusion. Tests check every vertex against the actual footprint with the contract's 0.8 m cornice tolerance; surrounding garden, street, fences, lights and neighbouring buildings are excluded. The 39 m pad radius bounds the rigid building footprint, but DEM/pad fitting is **not tested** here.

## Geometry and materials

The near shell has punched rectangular window holes with recessed dark panels and two storeys of distinct bays. Far retains the same holes and window rows, with simpler outward wall surfaces. Both keep all four columns, the open approach to three transoms and oak entrance, the round tympanum/oculus, five domes, corner pediments and small rooftop glazed volumes. Near adds window surrounds, mullions, pediments, pilasters, rustication lines, cornice dentils and grouped head/torso/limb reliefs. Repeated elements merge into six named material meshes.

`stone` is subdued pale limestone/plaster, `roof` grey metal with ribs, `glass` muted blue-grey dome/skylight glazing, `window` dark individual facade panels, `wood` oak doors/mullions, and `glow` the small entrance oculus. Night dims stone and glazing, with a warm self-lit oculus; the real facade's dramatic floodlighting is not simulated. All surfaces are opaque geometry without textures.

The roof and lantern profiles are original abstractions. Carving, heraldic motifs and composite capitals are simplified masses; inscription lettering, banners, flags, the garden, interiors and basement are omitted. Rear facade ornament and the low roof skylights are inferred from the mapped parts because all supplied photos favour the frontage. This is a readable landmark exterior, not a measured conservation replica. Full device performance and facade lighting remain unverified.

## Export and verification

Repeatable export: `pnpm build:top-cities-landmarks cec-palace --no-check`. Runtime exports are `public/models/buildings/cec-palace-{near,far}.glb` and `cec-palace.json`. `SPEC.ready = true` describes completed asset exports; integration remains separately gated.

| LOD | Triangles | Draws | Bytes | KiB |
| --- | ---: | ---: | ---: | ---: |
| Near | 37,940 | 6 | 1,768,464 | 1727.0 |
| Far | 8,512 | 6 | 420,284 | 410.4 |

Both fit the building caps (60k / 14 / 2.5 MB near, 12k / 8 / 500 KB far). Source and exported near/far bounds are identical. Asset cost is not measured Tesla hardware performance.

### Evidence actually inspected

- Dossier references: `tmp/top-cities/cec-palace/refs-sheet.jpg`.
- First procedural facade/back/roof/street/detail sheet: `tmp/top-cities/shots/cec-palace/iteration-1/cec-palace-procedural-near-light-sheet.jpg`. It exposed thin excessive corner finials and duplicate entrance window rhythms. The correction shortened the corner crown/finials, enlarged column shafts and aligned the three recessed transoms with real wall openings. Hidden roof bottom faces and submerged skylight bars were removed; far wall thickness and dome segmentation were reduced to meet the byte cap.
- Final reference/export comparison: **`tmp/top-cities/shots/cec-palace/final/comparison-sheet.jpg`**, opened and judged. Row 1 shows the three reference photos and exported top view with the red footprint; row 2 near-light facade/back/roof/street; row 3 near-light entrance detail plus far-light facade/back/roof; row 4 near-dark facade/detail plus far-dark facade/back. The same dome/arch identity and individual windows remain in far; the footprint orientation fits, no floating or inverted exterior faces were visible, and exported geometry matches the procedural shape. The simplified rear, heraldic carving and dim night lighting are visible approximation limits.

### Checks

- `node --test src/peregrine/landmarks/top-cities/top-cities.test.js src/peregrine/landmarks/top-cities/cec-palace/cec-palace.test.js`: **609/609 pass**, including 13 palace-specific tests; saved output `tmp/top-cities/cec-palace/tests.txt`.
- Palace-specific raycasts pin all four column contacts, open bays/recessed transoms, arch crown, central glass dome, four lower metal caps/finials, named-support contacts at every main and corner dome rib terminal (excluding each rib material and including deliberately detached negative cases), individual two-storey window bays, full footprint containment, grade, top and orientation.
- `node scripts/asset-catalog.mjs`: **valid, 336 entries / 602 GLB variants** at final check; output `tmp/top-cities/cec-palace/catalog-result.txt`.
- `node .agents/skills/build-3d-city/scripts/qa-metrics.mjs --ids cec-palace --out tmp/top-cities/cec-palace/metrics.json`: **ok**; no coplanar pairs, 0% back-face hits across 338 intersecting rays, no removable bridgeLift bytes, no layered-face or window-rhythm issues.
- `node scripts/landmark-depth-layers.mjs --ids cec-palace` generated the allowed shared depth table with **zero cycle edges dropped**; `--check` passes.
- No persistent app server, full suite, install, git mutation, shared registry edit or app bundle build was run.

### Integration handoff

**Cityscape: not tested yet, integration is checked separately. No runtime-layer or rollout changes were made. The only shared file regenerated was `src/peregrine/landmarks/depth-layers.js`; regenerate all ids during the coordinated commit as specified by the batch contract.
