# Haney House — Maple Ridge

Haney House in its restored white and forest-green scheme, with the projecting front gable, cross roof, northern service ell, open veranda and upper balcony, white diamond railings and two brick chimneys.

## Sources, rights and exact version

- [Identity and architectural context (published dimensions distinguished from estimates)](https://www.mapleridge.ca/explore-maple-ridge/about-maple-ridge/explore-our-heritage/haney-house-museum)
- [Owned OSM way 629546183](https://www.openstreetmap.org/way/629546183)
- [Haney House restored March 2018  —  Maple Ridge Museum gallery, photographer uncredited  —  All rights reserved; comparison only](https://mapleridgemuseum.org/drafts/restorationupdates/)
- [City 2024 Haney House Museum exterior  —  City of Maple Ridge, photographer uncredited  —  All rights reserved; comparison only](https://www.mapleridge.ca/explore-maple-ridge/about-maple-ridge/explore-our-heritage/haney-house-museum)
- [Museum: Haney family home and 1883 construction](https://mapleridgemuseum.org/about-us/the-museums/)

Original editable procedural geometry created for Codriver, 2026-11-10. No scans, imported meshes, textures, logos or lettering. OSM main API extracts used as an explicit fallback after broad serialized Overpass queries timed out. Geographic data © OpenStreetMap contributors, ODbL-1.0. Photo references are comparison-only and remain in ignored tmp. 1.jpg | Haney House restored March 2018 | Maple Ridge Museum gallery, photographer uncredited | All rights reserved; comparison only | https://mapleridgemuseum.org/drafts/restorationupdates/; 2.jpg | City 2024 Haney House Museum exterior | City of Maple Ridge, photographer uncredited | All rights reserved; comparison only | https://www.mapleridge.ca/explore-maple-ridge/about-maple-ridge/explore-our-heritage/haney-house-museum

Photos are viewed only for comparison, never committed, traced or embedded in exports. Original procedural geometry uses real metres and no textures, logos, lettering, third-party meshes or surveyed terrain. Source/docs MIT; original models CC BY 4.0; geographic data ODbL 1.0. No contributor or license acceptance is made by this task.

## Dimensions and construction

| Feature | Metres | Basis |
| --- | ---: | --- |
| Width in model axes | 13.23 | OSM outline envelope |
| Depth in model axes | 23.61 | OSM outline envelope |
| Highest point | 10.2 | photo estimate for the two chimney tops; gable ridge 9.1 m, not surveyed |

Mapped footprint is the actual Haney House above Port Haney, distinct from the brickworks manager house used as Maple Ridge Museum. Museum and City give 1883, superseding OSM start_date 1878. Gable and veranda arrangement follow checked restoration and current City photos; all heights, roof slopes and rear ell height estimated. Current photograph supplies unwrapped chimneys and restored windows; temporary 2018 wrapping and plywood excluded. No garden, signs, lettering or terrain; main raised deck top 0.60 m.

Silhouette and distinguishing features are authored individually. Facade windows partition wall faces rather than lying over backing polygons; far retains the silhouette and a separate coarser grid of window bays. Repeated elements are merged by material. Small decorative detail is simplified at map scale; the model is an exterior and has no interior-use claim.

## Geographic frame and ownership

Origin `[-122.60205625,49.213058000000004]`; +X east, +Y up, +Z south. Local y=0 is one rigid exterior foundation plane. Mapped controls `[[-122.6021096,49.2131657],[-122.6021232,49.213039]]` yield baked yaw -4.0110 degrees; the host must not rotate again. OSM way 629546183 define the owned provider outlines; adjacent structures are excluded. Terrain padding uses the owned rings and a median datum as authoring handoff, without a claim that it has been tested against a DEM. No sea-level or Mercator scale is baked in.

## Measured export costs and verification

| LOD | Triangles | Draws | Bytes |
| --- | ---: | ---: | ---: |
| near | 2072 | 6 | 37536 |
| far | 1540 | 6 | 30784 |

Deterministic metrics: `tmp/batch/haney-house-metrics.json`. No remaining QA flags.

Evidence: `tmp/landmark-qa/sheets/haney-house.jpg` (exported near/far and opposite facades against the checked exterior reference); `tmp/landmarks/shots/haney-house/` (north-up footprint overlay). Source/GLB bounds and recognizable feature probes are pinned by the landmark-specific and registry conformance tests. Visual review notes: Two look rounds against the current City and restoration photos: four upper sash windows, two-storey open porch, diamond railing and hanging white fan brackets retained; brick chimneys, cross roof and northern ell remain distinct. Rear heights are estimates, app modes not tested.

Cityscape: **not tested**. Full 3D world: **not tested**. No app server, application screenshot, provider replacement, DEM contact, runtime lifecycle or hardware performance verification was performed; these belong to the later batched integration stage.
