# Tustin South Airship Hangar — Tustin

Surviving Tustin South Hangar No. 2: vast elliptical timber roof, two continuous daylight bands, six-leaf rolling doors at both ends, paired concrete portal towers and deep overhead guides, with a narrow ridge walkway and wind indicator.

## Sources, rights and exact version

- [Identity and architectural context (published dimensions distinguished from estimates)](https://en.wikipedia.org/wiki/Marine_Corps_Air_Station_Tustin)
- [Owned OSM way 143173532](https://www.openstreetmap.org/way/143173532)
- [File:Tustin Blimp Hangar No 2.jpg  —  Lordkinbote at English Wikipedia (Robert A. Estremo)  —  CC BY-SA 2.0](https://commons.wikimedia.org/wiki/File:Tustin_Blimp_Hangar_No_2.jpg)
- [File:20140726-0167 Marine Corps Air Station Tustin.JPG  —  Nandaro  —  CC BY-SA 3.0](https://commons.wikimedia.org/wiki/File:20140726-0167_Marine_Corps_Air_Station_Tustin.JPG)
- [City: South No. 2 survives, North No. 1 fire and demolition](https://www.tustinca.org/765/Tustin-Hangars)
- [City and county official history: dimensions, six leaves and 145 ft concrete towers (pp. 21 and 38)](https://bos.ocgov.com/legacy3/newsletters/pdf/the_tustin_hangars.pdf)

Original editable procedural geometry created for Codriver, 2026-11-10. No scans, imported meshes, textures, logos or lettering. OSM main API extracts used as an explicit fallback after broad serialized Overpass queries timed out. Geographic data © OpenStreetMap contributors, ODbL-1.0. Photo references are comparison-only and remain in ignored tmp. 1.jpg | File:Tustin Blimp Hangar No 2.jpg | Lordkinbote at English Wikipedia (Robert A. Estremo) | CC BY-SA 2.0 | https://commons.wikimedia.org/wiki/File:Tustin_Blimp_Hangar_No_2.jpg; 2.jpg | File:20140726-0167 Marine Corps Air Station Tustin.JPG | Nandaro | CC BY-SA 3.0 | https://commons.wikimedia.org/wiki/File:20140726-0167_Marine_Corps_Air_Station_Tustin.JPG

Photos are viewed only for comparison, never committed, traced or embedded in exports. Original procedural geometry uses real metres and no textures, logos, lettering, third-party meshes or surveyed terrain. Source/docs MIT; original models CC BY 4.0; geographic data ODbL 1.0. No contributor or license acceptance is made by this task.

## Dimensions and construction

| Feature | Metres | Basis |
| --- | ---: | --- |
| Width in model axes | 90.96 | OSM outline envelope |
| Depth in model axes | 323.73 | OSM outline envelope |
| Highest point | 57.6 | adopted estimate: official 178 ft (54.25 m) roof plus 11 ft (3.35 m) wind indicator; OSM says 55 m, common secondary account says 192 ft/59 m overall |

South Hangar No. 2 alone, the surviving Warner Avenue structure; North No. 1 burned in November 2023 and is excluded. Official city/county history reports 1088 by 297 ft and roof 178 ft plus 11 ft indicators, while OSM has 55 m and secondary captions 1072 by 292 by 192 ft. Horizontal envelope follows mapped way, adopted roof 54.25 m and indicator 57.6 m are estimates distinguishing height points. Door leaves 120 by 37 ft and towers 145 ft are published; curved shell, bands, portal beam depth and indicator location estimated from checked photos. No surrounding paving, signage, logos, antennas borrowed from North Hangar, or terrain.

Silhouette and distinguishing features are authored individually. Facade windows partition wall faces rather than lying over backing polygons; far retains the silhouette and a separate coarser grid of window bays. Repeated elements are merged by material. Small decorative detail is simplified at map scale; the model is an exterior and has no interior-use claim.

## Geographic frame and ownership

Origin `[-117.8239401,33.70295405]`; +X east, +Y up, +Z south. Local y=0 is one rigid exterior foundation plane. Mapped controls `[[-117.8229174,33.7017063],[-117.8255944,33.7035764]]` yield baked yaw 409.9793 degrees; the host must not rotate again. OSM way 143173532 define the owned provider outlines; adjacent structures are excluded. Terrain padding uses the owned rings and a median datum as authoring handoff, without a claim that it has been tested against a DEM. No sea-level or Mercator scale is baked in.

## Measured export costs and verification

| LOD | Triangles | Draws | Bytes |
| --- | ---: | ---: | ---: |
| near | 16426 | 7 | 227128 |
| far | 5346 | 7 | 83200 |

Deterministic metrics: `tmp/batch/tustin-south-hangar-metrics.json`. No remaining QA flags.

Evidence: `tmp/landmark-qa/sheets/tustin-south-hangar.jpg` (exported near/far and opposite facades against the checked exterior reference); `tmp/landmarks/shots/tustin-south-hangar/` (north-up footprint overlay). Source/GLB bounds and recognizable feature probes are pinned by the landmark-specific and registry conformance tests. Visual review notes: Two exterior photographs identified explicitly as South No. 2 were checked for the curved roof, daylight bands, six leaves, 145 ft towers and deep concrete guide beam. The destroyed North No. 1 is excluded.

Cityscape: **not tested**. Full 3D world: **not tested**. No app server, application screenshot, provider replacement, DEM contact, runtime lifecycle or hardware performance verification was performed; these belong to the later batched integration stage.

## Independent-review follow-up

Added a named end-portal inspection preset and framed the portal in near and far contact-sheet tiles; geometry/exports remain byte-identical.

Near: 16426 triangles / 7 draws / 227128 bytes. Far: 5346 triangles / 7 draws / 83200 bytes. Asset tests, qa-metrics (zero flags) and depth check pass. One revised exported contact sheet: tustin-south-hangar.jpg. Independent re-review is pending; Cityscape: not tested; Full 3D world: not tested.
