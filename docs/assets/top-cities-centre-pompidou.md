# Centre Pompidou, Paris

Original procedural model of the Piano/Rogers/Franchini museum opened in 1977 at 19 rue Beaubourg. Represents the permanent exterior after the 2021 Chenille renovation; temporary 2025–2030 construction coverings are omitted. White exposed steel frames, external gerberette arms, east-side colour-coded services, roof air-handling banks and the west-side stepped diagonal Chenille establish the identity.

## Sources and dimensions

- [Centre Pompidou official architecture](https://www.centrepompidou.fr/en/centre-pompidou-is-transforming-itself/an-iconic-architecture): 166 m length, 60 m width, 42 m height; white structural frame; blue air, green water, yellow electricity, red circulation; 1977 opening and 2021 escalator renovation.
- [OSM way 55503397](https://www.openstreetmap.org/way/55503397), shared-helper dossier `tmp/top-cities/centre-pompidou/osm.json`: 42 m height, glass/silver, complete main museum ring. Geographic data © OpenStreetMap contributors, ODbL 1.0.
- Dossier `refs-sheet.jpg` inspected. Only references 2 (Reinraum, service facade, CC BY-SA 3.0), 3 (ChrisSampson87, Paris south facade, CC BY-SA 4.0) and 6 (Jean-Pol GRANDMONT, Chenille interior, CC BY 4.0) depict this building; photos 1,4,5 excluded.
- Two additional official reference-only photos from the architecture page: aerial © Julien Fromentin (`refs/extra-1.jpg`) and Chenille detail © Manuel Braun, 2018 (`refs/extra-2.jpg`). Copyright reserved; retained only in ignored scratch. No photographs, textures or external meshes shipped.

| Feature | Metres | Basis |
| --- | ---: | --- |
| Overall design | 166 × 60 × 42 | Official published dimensions |
| Fourteen transverse frame stations | 163.6 m between end columns | Photo estimate fitted to OSM envelope |
| Glazed usable body | About 45 × 162 × 38.6 | Estimate; services occupy outside envelope |
| Six principal floor frame heights | 3, 10, 17, 24, 31, 38 | Photo estimate |
| Escalator glass diameter | 3.1 | Photo estimate |
| Roof cowl summit | 42 | Calibrated to official height |

Origin [2.352443,48.860534]. Real metres, east/up/south, y=0 local rigid museum grade. East edge controls [2.3532219,48.8611496] and [2.3524482,48.8597263] establish the approximately 20° longitudinal bearing. Rotation is baked once. Museum-only replacement: way 55503397; piazza, neighbouring buildings, Atelier Brancusi and detached chimneys remain provider-owned. No terrain elevations or latitude stretch are baked in.

## Geometry and handoff

Merged white steel frames and rectangular glazing bays use eight materials in both LODs. The far LOD retains fourteen columns per side, facade beams, coarser X-bracing, the complete segmented escalator tube/red spine, external coloured risers, roof banks and individual glazing bays. Tube glazing is opaque architectural glass. Landings, pipe routing, exact service quantity, frame sections, gerberette profiles, facade glazing and roof plant are approximations, not construction drawings. Interior furnishings, transparent glazing and the sloping piazza are omitted. Escalator brackets run back to structural columns; beams and braces have named column-contact tests with a shortened free-end negative control.

Median footprint terrain pad with 5 m feather supplied for later integration. Cityscape: **not tested yet, integration is checked separately**. Full 3D world: **not tested yet, integration is checked separately**. No app server, runtime bundle, registry or other landmark was edited.

## Export and verification

Build: `pnpm build:top-cities-landmarks centre-pompidou --no-check`. 

| Export | Triangles | Draws | Bytes / KiB |
| --- | ---: | ---: | ---: |
| Near | 29,868 | 8 | 1,183,556 / 1155.8 |
| Far | 11,332 | 8 | 490,832 / 479.3 |

Judged exported GLBs in `tmp/top-cities/shots/centre-pompidou/references-export-comparison.jpg`: the two official exterior references beside `centre-pompidou-glb-{near,far}-{light,dark}-sheet.jpg`, each containing overview, west facade, east services, roof, grade entrance and close Chenille detail. Also inspected `top/centre-pompidou-glb-near-light-top.png` against the red replacement footprint. Initial exported near/light sheet identified hidden interior trusses and overly expensive glazing; these were removed/replaced by separate exterior quads. End-facade X bracing was moved in front of glazing, excess brace height corrected, and far tube hoops/internal crossbeams reduced. Final sheets retain all fourteen frame stations, separate glazing bays and all five diagonal escalator runs. The Chenille glass is less transparent and roof equipment less dense than the photograph; both are declared approximations for independent review.

Eight landmark tests pass: dimensions/grade, glass/red escalator runs, all four service colours, named beam/brace column contacts, 55 named escalator rail/spine/bracket terminal contacts (excluding the tested member), every-vertex containment, LOD fidelity, and GLB round trip. Contact tests include deliberately shortened beam/rail negative cases. Combined top-cities conformance and this landmark suite passed; the earlier combined run passed 607/607 before the additional escalator-contact test; the final combined rerun passed 608/609, failing solely on the concurrently authored Washington National Cathedral far GLB (0.54 MB exceeds 0.5 MB); all eight Pompidou tests and all three Pompidou conformance cases passed. Catalog initially passed (336 entries / 610 GLB variants), and preview generation passed. A later catalog retry failed solely because another in-progress record referenced the absent `docs/3d-top-cities-washington-national-cathedral.md`; no files belonging to that landmark were changed. `qa-metrics.json` reports no issues, 0% outside-in back-face hits and no removable bridgeLift attributes. Small coincident end-cap intersections between red spine and white trim total about 2.3 m² (largest components far below the 5 m² screening threshold); no large layered surfaces are flagged. Generated depth table has zero dropped/cyclic material edges and its check passes.

No app integration or hardware performance claim follows from these inspector captures. Independent visual review remains pending.
