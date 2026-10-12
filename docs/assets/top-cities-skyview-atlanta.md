# SkyView Atlanta

Original procedural model of the white Bussink R60 wheel beside Centennial Olympic Park at 168 Luckie Street NW. No photograph, mesh or texture is shipped.

## Sources and dimensions

- [Operator](https://www.skyviewatlanta.com/): address and approximately 200 ft height.
- [Operator study guide](https://www.skyviewatlanta.com/s/TKE_Skyview_Study-Guide_FINAL_11618.pdf): 200 ft height, 166 ft diameter, 42 gondolas and 21 sectors.
- [Bussink](https://www.bussink.com/observation-wheels): SkyView Atlanta R60 / 2013.
- [OSM way 1292668916](https://www.openstreetmap.org/way/1292668916): narrow elevated wheel outline; height=61 and min_height=5 do not establish boarding grade.
- Dossier exterior photos refs/2.jpg, refs/7.jpg and refs/8.jpg, credited in the catalog: [Michael Rivera, CC BY-SA 3.0](https://commons.wikimedia.org/wiki/File:SkyView_Atlanta_closest_12313.JPG), [Thomson200, CC0](https://commons.wikimedia.org/wiki/File:SkyView_Atlanta,_July_2018.jpg), [Mcooney1, CC BY-SA 4.0](https://commons.wikimedia.org/wiki/File:Skyview_Atlanta.jpg).

| Dimension | Model | Basis |
| --- | ---: | --- |
| Overall height | 60.96 m | Published 200 ft |
| Gondolas / truss sectors | 42 / 21 | Published and photos |
| Outer rim diameter | 50.5968 m | Published 166 ft, including tube thickness |
| Rim centreline radius / tube radius | 25.0984 / 0.2 m | Published diameter minus estimated tube radius |
| Hub height | 35.6616 m | Overall height minus outer rim radius |
| Loading deck top | 1.0 m | Street-reference estimate |
| Capsule width / depth | 2.2 / 2.1 m | Photo estimate |
| Support spread | 24 × 20 m | Photo estimate |
| Wheel-plane bearing | 41.4202° | Mapped control points |

The b4rb re-review rejected the earlier photo-estimated 57.16 m rim. This repair restores the operator-cited 166 ft outer diameter and 200 ft overall height. The rim tube centreline, scaled hub radius, spoke roots/web bays and all 42 gondola attachment stations share the corrected wheel frame. The boarding deck remains fixed at 1 m with a short 2.4 m stair run, independently of wheel dimensions. Combining those dimensions places the lowest static capsule floor at 8.0032 m; the low deck is an access-area approximation, not a simulated boarding interface. Exact machinery and the real boarding configuration remain outside this static landmark model. The source study-guide URL returned 404 during this repair; the supplied review and existing recorded source establish the cited dimensions.

## Frame, provider ownership and model

Origin [-84.391851775,33.758831225]; real metres east/up/south, foundation grade y=0. Control points [-84.392023,33.7586545] and [-84.3916622,33.7589945] establish the bearing, baked once into the GLBs. Only way 1292668916 is replaced; Landmark Builders 773652980 and Tabernacle 192795412 remain provider-owned. The narrow elevated ring is distinct from the open-ground support envelope. The corrected rim fits the mapped approximately 50.47 m longitudinal envelope within 0.1 m; capsules extend roughly 1 m beyond either end over open ground. No adjacent building mask is broadened.

Two white tubular rims and 21 paired radial trusses remain open. Each frame has two wider chords and eight connected zigzag bays near; far keeps both chords and two coarse bays. Every chord ends at the named hub/rim and every web at its chord, proved against triangle surfaces in both LODs with a shortened-member negative case. Six legs meet grade footings. Forty-two opaque glazed capsules remain upright. Near retains rim diagonals and capsule mullions; far drops those details and uses a 63-segment rim. Five merged materials.

The low deck retains short supported piers, grounded continuous stair blocks and open rails. Focused regression measures the actual deck top, every structural contact and far web retention. Exact queue canopies, machinery, sign, animation, changing light shows and terrain relief are omitted.

## Review-fix verification (2026-10-12)

Inspected exported GLB seven-view near/light and far/light sheets (overview, facade, back, roof, detail, entrance, plan), plus far/dark facade, entrance and detail sheets in `tmp/top-cities/shots/skyview-atlanta/diameter-fix/`, named `skyview-atlanta-glb-<lod>-<theme>-sheet.jpg`. One look-fix iteration after independent b4rb re-review: the wheel is narrower, radial frames remain connected and readable, capsules stay upright, and the low deck and grounded feet remain intact. Compared against dossier refs/7.jpg. No app captures or runtime changes were made.

| LOD | Triangles | Draws | Bytes | KiB |
| --- | ---: | ---: | ---: | ---: |
| Near | 27,288 | 5 | 1,245,812 | 1216.61 |
| Far | 8,688 | 5 | 496,592 | 484.95 |

All **4/4** SkyView tests pass, including triangle-measured published diameter/height, fixed deck top, 42 upright cabins, all named member contacts and the shortened-spoke negative case in both LODs. All **3/3** SkyView registry checks pass. The required registry run passes **469/471**, with unrelated failures in high-museum-of-art (76,308 near triangles over budget) and granville-street-bridge (catalog readiness); log: `tmp/top-cities/skyview-atlanta/diameter-fix-registry-tests.log`. Focused QA metrics have no issues, no layered/coplanar flags and 0% near backface hits; `tmp/top-cities/skyview-atlanta/diameter-fix-metrics.json`. Depth generation and `--check` pass with **zero dropped cycle edges**. `node scripts/asset-catalog.mjs`, `pnpm assets:check` and `pnpm assets:preview` encounter another worker's unregistered `/models/buildings/high-museum-of-art-far.glb`; no unrelated record was changed. Near cost is unchanged; far saves 24 bytes.

Cityscape and Full 3D world: b4rb app evidence verified the previous low deck, grounded legs and readable trusses in both modes, while holding the enlarged diameter as FIX. These newly corrected exports are **not tested in app yet**; the lead recaptures both modes and requests independent re-review. Provider lifecycle, regional-to-street transitions, DEM refinement and footing residuals remain separate integration gates. No app server, application bundle build, deployment or git write was performed.
