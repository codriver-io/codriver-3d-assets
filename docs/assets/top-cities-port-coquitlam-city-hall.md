# Port Coquitlam City Hall — Port Coquitlam

Port Coquitlam City Hall: original Edwardian brick wing with simulated-stone base, projecting entry bay and truncated hip roof, separate 1988 brick wing, and a tall arched glazed atrium joining them.

## Sources, rights and exact version

- [Identity and architectural context (published dimensions distinguished from estimates)](https://www.portcoquitlam.ca/services/city-facilities/city-hall)
- [Owned OSM way 305651077](https://www.openstreetmap.org/way/305651077)
- [City Hall current official exterior (2024 upload)  —  City of Port Coquitlam, photographer not stated  —  All rights reserved; comparison only](https://www.portcoquitlam.ca/services/city-facilities/city-hall)
- [City Hall lighting exterior 01  —  City of Port Coquitlam (gallery photography credit)  —  All rights reserved; comparison only](https://sls-lighting.com/projects/poco-cityhall/)
- [City heritage statement: original Edwardian wing and 1988 addition/atrium](https://www.portcoquitlam.ca/media/file/city-hall-statement-significance-draft)
- [Lighting designer: current facade and credited City photographs](https://sls-lighting.com/projects/poco-cityhall/)

Original editable procedural geometry created for Codriver, 2026-11-10. No scans, imported meshes, textures, logos or lettering. OSM main API extracts used as an explicit fallback after broad serialized Overpass queries timed out. Geographic data © OpenStreetMap contributors, ODbL-1.0. Photo references are comparison-only and remain in ignored tmp. 1.jpg | City Hall current official exterior (2024 upload) | City of Port Coquitlam, photographer not stated | All rights reserved; comparison only | https://www.portcoquitlam.ca/services/city-facilities/city-hall; 2.jpg | City Hall lighting exterior 01 | City of Port Coquitlam (gallery photography credit) | All rights reserved; comparison only | https://sls-lighting.com/projects/poco-cityhall/

Photos are viewed only for comparison, never committed, traced or embedded in exports. Original procedural geometry uses real metres and no textures, logos, lettering, third-party meshes or surveyed terrain. Source/docs MIT; original models CC BY 4.0; geographic data ODbL 1.0. No contributor or license acceptance is made by this task.

## Dimensions and construction

| Feature | Metres | Basis |
| --- | ---: | --- |
| Width in model axes | 26.87 | OSM outline envelope |
| Depth in model axes | 37.02 | OSM outline envelope |
| Highest point | 14.6 | photo estimate for the truncated historic hip roof; both wings and atrium documented as three storeys |

City heritage statement identifies 1914 original and 1988 three-storey addition, separated by a glazed atrium. Selection shorthand describing a white tower was corrected after checking the official exterior and heritage statement: the real landmark is this brick complex. Mapped north/east wing is historic; south/west wing and recessed west-entry atrium are separate masses. Heights, roof truncation, masonry rhythms, stair rise and atrium arch are photo estimates. No neighbouring cenotaph, cafe, public square, radio antenna, heraldry, lettering, flags or signs. Original raised entry stair stands on local y=0.

Silhouette and distinguishing features are authored individually. Facade windows partition wall faces rather than lying over backing polygons; far retains the silhouette and a separate coarser grid of window bays. Repeated elements are merged by material. Small decorative detail is simplified at map scale; the model is an exterior and has no interior-use claim.

## Geographic frame and ownership

Origin `[-122.78056330000001,49.26218285]`; +X east, +Y up, +Z south. Local y=0 is one rigid exterior foundation plane. Mapped controls `[[-122.7805663,49.2619891],[-122.7808363,49.2621012]]` yield baked yaw 147.5354 degrees; the host must not rotate again. OSM way 305651077 define the owned provider outlines; adjacent structures are excluded. Terrain padding uses the owned rings and a median datum as authoring handoff, without a claim that it has been tested against a DEM. No sea-level or Mercator scale is baked in.

## Measured export costs and verification

| LOD | Triangles | Draws | Bytes |
| --- | ---: | ---: | ---: |
| near | 3910 | 6 | 57564 |
| far | 3494 | 6 | 53224 |

Deterministic metrics: `tmp/batch/port-coquitlam-city-hall-metrics.json`. No remaining QA flags.

Evidence: `tmp/landmark-qa/sheets/port-coquitlam-city-hall.jpg` (exported near/far and opposite facades against the checked exterior reference); `tmp/landmarks/shots/port-coquitlam-city-hall/` (north-up footprint overlay). Source/GLB bounds and recognizable feature probes are pinned by the landmark-specific and registry conformance tests. Visual review notes: Two visual looks against the current City and credited night exteriors: three-storey masonry wings count the low base, and the arched atrium crown aligns with the historic cornice. Four simulated-stone strips separate the original entry bays, while the truncated roof, stair and modern rear remain distinct. No event lighting or heraldry baked in.

Cityscape: **not tested**. Full 3D world: **not tested**. No app server, application screenshot, provider replacement, DEM contact, runtime lifecycle or hardware performance verification was performed; these belong to the later batched integration stage.

## Independent-review follow-up

Partitioned heritage-wing window patches into separate upper/lower sash panes with a narrow trim rail in both LODs; no coplanar backing face was added.

Near: 3910 triangles / 6 draws / 57564 bytes. Far: 3494 triangles / 6 draws / 53224 bytes. Asset tests, qa-metrics (zero flags) and depth check pass. One revised exported contact sheet: port-coquitlam-city-hall.jpg. Independent re-review is pending; Cityscape: not tested; Full 3D world: not tested.
