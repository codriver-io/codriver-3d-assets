# Liberty Memorial, Kansas City

Original procedural model of the 1926 Liberty Memorial and National WWI Museum, 2 Memorial Drive, Kansas City. H. Van Buren Magonigle’s Egyptian Revival composition includes a tapered limestone tower, four Guardian Spirits, Exhibit Hall west, Memory Hall east, two veiled Assyrian sphinxes and the north Great Frieze. The modern south entrance and roof skylight represent the museum expansion visible in the dossier aerial photograph.

## Sources and dimensional frame

[National WWI Museum: elements](https://www.theworldwar.org/explore/elements-museum-and-memorial), checked 2026-10-05, supplies dimensions and identities. Mapped geometry is the supplied 2026-10-04 Overpass dossier, ways 587083043, 466820799, 537927800 and 537927801, © OpenStreetMap contributors, ODbL 1.0. No new Overpass requests were needed.

| Feature | Metres | Basis |
| --- | ---: | --- |
| Tower above courtyard | 66.1416 | Official 217 ft |
| Tower base/top diameter | 10.9728 / 8.5344 | Official 36 / 28 ft |
| Guardian Spirit toe–wingtip | 12.192 | Official 40 ft; abstract figure profile |
| Great Frieze | 45.1104 × 5.4864 | Official 148 × 18 ft |
| Memorial courtyard above entrance | 6.6 | Photo estimate, not a survey |
| Hall wall height above courtyard | 9.6 | Photo estimate; parapet reaches 10.37 |
| Hall plan | approximately 27.5 × 13.8 | OSM hall outlines, small inset for trim |
| Highest structural point | 72.7416 | Entrance datum + sourced tower height |

Origin is the tower axis `[-94.585953,39.081066]`; +X east, +Y up, +Z south. Two Exhibit Hall mapped control points `[-94.5867135,39.0812771]` → `[-94.5864048,39.0812153]` yield the 104° long-edge bearing. Local hall u runs east/south, v south/west. Rotation is baked into geometry/GLBs. All four outlines are registered; the OSM tower ring appears to describe the narrower top, while the sourced base remains inside the larger memorial envelope. Fine north relief and cornice projections are allowed up to 0.9 m outside the envelope, tested.

`y=0` is the lower south museum entrance footing. No hill or absolute height is baked in. The courtyard is rigid at y=6.6. A bounded median terrain pad uses lower entrance reference points and 8 m feather; it is a provisional integration handoff. The real north lawn is 51 ft below the courtyard, per the official 268 ft tower height from that lawn; that park relief is deliberately not fabricated as an asset.

## Geometry and materials

Seven merged material batches: beige limestone, pale trim, darker mortar, dark glass, bronze, muted green roof and a small self-lit orange night flame outlet. Near has shaft course joints, wing feathers, hall glazing bars, cornice dentils, sky mosaic strips with geometric stars, urns and north relief figures. Far retains four sculptural crown profiles, engaged piers, six tall windows per hall long facade, both sphinxes, recessed portal, stair flights, skylight and frieze rhythm. No texture, scan or photo-derived mesh.

Photo references used: [aerial](https://commons.wikimedia.org/wiki/File:National_World_War_I_Museum_and_Memorial_aerial.jpg), National WWI Museum, CC0; [south facade](https://commons.wikimedia.org/wiki/File:Liberty_Memorial_2008.jpg), Charvex, public domain; [frieze](https://commons.wikimedia.org/wiki/File:Kansascitylibertymemorialsculpture.jpg), Edmond Amateis sculpture / Matthew Field photo, public domain in the US as labeled on the checked Commons page. All photos stay in ignored `tmp/top-cities/liberty-memorial/refs/`. Sculptures are original abstract approximations, not carved replicas. Inscriptions, changing steam flame, interiors, tree planting, flags and remote dedication wall are omitted. The museum portal glazing is 8 m behind a genuine geometric opening; stair flights descend through exterior notches in the rigid base.

## Verification

Initial source sheet `tmp/top-cities/shots/liberty-memorial/liberty-memorial-procedural-near-light-sheet.jpg` was opened alongside dossier `refs-sheet.jpg`: overview, south front, north back, roof, entrance, crown detail and hall. This exposed Guardian Spirits below the intended crown and stairs incorrectly rising above the terrace; both were corrected. Near shaft course ring segments were reduced to retain visible detail with fewer triangles.

Final exported contact sheets opened against the dossier: `tmp/top-cities/shots/liberty-memorial/liberty-memorial-glb-near-light-sheet.jpg`, `liberty-memorial-glb-near-dark-sheet.jpg`, `liberty-memorial-glb-far-light-sheet.jpg` and `liberty-memorial-glb-far-dark-sheet.jpg` in that directory, each with overview/front/back/roof/entrance/crown/hall views. The assembled `export-reference-comparison.jpg` was also opened with reference photos next to all four sheets. `liberty-memorial-glb-near-light-top.png` was opened to check the 104° bearing against red footprint rings. Near and far preserve the skyline, entrance void, sphinx profiles and separated halls; night darkens stone and glazing and retains the crown outlet. Sculptures remain deliberately abstract, and the missing park relief makes the base appear more exposed than the reference aerial.

The final technical cleanup moved buried hall trim bottoms off the wall-bottom plane, shortened the hidden core end beneath the crown cap and offset facade course joints. `tmp/top-cities/liberty-memorial/qa-metrics.json` reports zero coplanar overlap pairs, 0% backfaces (164 successful rays), zero removable attributes and no issues. Source and GLB bounds agree through the shared conformance test.

| Export | Triangles | Draws | Bytes | KiB |
| --- | ---: | ---: | ---: | ---: |
| Near | 34,932 | 7 | 1,318,456 | 1,287.6 |
| Far | 7,996 | 7 | 390,840 | 381.7 |

Focused command passed **116/116 tests**, including all three Liberty Memorial conformance checks and its four landmark tests; its own tests finish in about 0.23 s. Tests pin height/taper, museum portal depth, descending flights, six hall windows, four crown figures, sphinx massing and footprint containment. Shared catalog validation was run twice: both attempts failed exclusively on the other worker’s unregistered `/models/buildings/torre-colpatria-far.glb`; no Liberty Memorial errors were reported, and its record/manifest/exports passed focused conformance and QA validation. Standalone asset inspection only; no app, staging or public deployment.

Cityscape: **not tested yet, integration is checked separately**. Full 3D world: **not tested yet, integration is checked separately**. North hillside/pad edges, both entrance elevations, replacement lifecycle and hardware performance need separate app validation. Independent reviewer acceptance remains with the coordinator.

Rebuild: `pnpm build:top-cities-landmarks liberty-memorial --no-check`. Focused tests: `node --test src/peregrine/landmarks/top-cities/top-cities.test.js src/peregrine/landmarks/top-cities/liberty-memorial/liberty-memorial.test.js`.
