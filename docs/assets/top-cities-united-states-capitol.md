# United States Capitol — Washington, D.C.

Original procedural model of the present Capitol on Capitol Hill, east of the National Mall: the House (south) and Senate (north) extensions, the 1958–1962 East Front extension, and Thomas U. Walter's white cast-iron dome with the bronze Statue of Freedom. This represents the completed exterior, without temporary scaffolding. The original partial source was retained where sound, with the dome attic/profile, wing galleries, metal roofs, grounded contacts and facade coverage completed here. The San Francisco City Hall asset was studied for batching and readable dome detail; none of its geometry was copied.

## Sources and dimensions

Primary dimensions: [Architect of the Capitol, building](https://www.aoc.gov/explore-capitol-campus/buildings-grounds/capitol-building), [Dome by the numbers](https://www.aoc.gov/what-we-do/projects/dome-restoration-project/by-the-numbers), and [Statue of Freedom](https://www.aoc.gov/explore-capitol-campus/art/statue-freedom). Official pages checked during authoring. The AOC dimensions establish the overall envelope; intermediate vertical stages are photographic estimates rather than a measured architectural survey.

| Feature | Published / mapped value | Model | Basis |
| --- | --- | --- | --- |
| Overall height above East Front baseline | 288 ft = 87.7824 m | 87.783 m | AOC |
| North–south extent | 751 ft 4 in = 229.0064 m | 228.879 m near | AOC |
| Greatest width including approaches | 350 ft = 106.68 m | 105.469 m | AOC; model follows OSM terraces |
| Dome exterior diameter at peristyle cornice | 135 ft = 41.148 m | 41.148 m | AOC; skirt moulding projects beyond it |
| Peristyle columns | 36 | 36 in both LODs | AOC |
| Tholos columns | 12 | 12 in both LODs | AOC |
| Tholos balcony | 210 ft = 64.008 m | 64.01 m lower slab | AOC |
| Statue / pedestal heights | 19.5 / 18.5 ft | roughly 5.94 / 5.64 m | AOC; globe/pedestal split estimated |
| Wing wall height | 24.2 m | 24.2 m | OSM part tags |
| Porch width/depth, bay rhythm, capitals, attic and dome profile | No survey used | Explicit editable source parameters | Estimated from current photographs and mapped envelope |

Mapped geometry is the prepared `osm.json` dossier, obtained with the shared Overpass helper. Source outline [way 66418809](https://www.openstreetmap.org/way/66418809) and 22 overlapping parts are registered in `footprint.js`. The origin `[-77.0090014, 38.8898134]` is the outline's area centroid; the dome sits 6.1 m west and 0.85 m south of it. The Statue of Freedom ring is expanded concentrically by approximately 0.5 m for replacement slack; it is not relocated to the outline centroid. The west lawn terrace and detached Visitor Center skylights are intentionally outside ownership.

Real metres, +X east/+Y up/+Z south, local y=0 at the East Front baseline. Rotation is baked once: approximately 0.12° east of north, an approximate fit to the mapped near-cardinal walls. Two control points on the north wing west wall are `[-77.0095260,38.8904611]` and `[-77.0095243,38.8907608]`, giving a representative edge bearing of about 0.25°; the minor difference reflects the simplified straight-sided model and irregular mapped outline. All vertices fit the outline with less than 0.5 m trim tolerance, independently tested and checked in the top view. No Mercator scale, scene altitude or DEM elevation is baked into the asset.

## Photographic references and rights

The supplied `refs-sheet.jpg` was read first. Its historical inauguration/snow photographs predate the present East Front; its interior painting cannot establish an exterior silhouette. Current reference photographs actually used for the exterior comparison:

- [Ted Eytan, 2020.09.19 Grieving for Ruth Bader Ginsburg](https://commons.wikimedia.org/wiki/File:2020.09.19_Grieving_for_Ruth_Bader_Ginsburg,_Washington,_DC_USA263_66239_(50360217701).jpg), CC BY-SA 2.0: painted dome, stages, ribs and windows.
- [Bernini123, Facade of Senate chamber](https://commons.wikimedia.org/wiki/File:Facade_of_Senate_chamber.jpg), CC0: column shafts, pediment and staircase.
- [Carol M. Highsmith, aerial view 04492v, crop by Cristiano Tomás](https://commons.wikimedia.org/wiki/File:Aerial_view,_United_States_Capitol_building_04492v_(cropped).jpg), public domain per Highsmith's Library of Congress dedication: west-front massing, wing galleries and metal roofs.
- [Emw, East Front panorama, 2013-10-06](https://commons.wikimedia.org/wiki/File:US_Capitol_during_government_shutdown;_east_side,_panorama;_Washington,_DC;_2013-10-06.JPG), CC BY-SA 3.0: present east frontage, galleries and dome proportions.

The two additional photos fill the dossier's missing unobstructed full facade/aerial angles. Their file pages were checked for author/licence. All photos and downloaded reference HTML remain in ignored `tmp/top-cities/united-states-capitol/refs/`; no photograph, texture, scan or external mesh is shipped. Source and GLBs are original procedural geometry. Mapped geometry © OpenStreetMap contributors, ODbL 1.0.

## Structure, materials and approximations

Six named merged materials: warm white marble/painted iron `stone`, recessed or rusticated `stone2`, blue-grey metal `roof`, bronze statue `bronze`, window `light`, and tholos glazing `lamp`. Day windows are dark; night windows/lantern are warm and self-lit. The night stone remains lighter than an unlit wall to suggest floodlighting, but there is no actual lighting simulation or measured luminance. The glass surfaces represent glazing rather than interior rooms.

Separate grounded wing/waist/centre masses preserve the stepped outline. The eight-column central east rank, return ranks, west rank and wing galleries have real gaps between supports. Both LODs retain 36 dome supports, 12 tholos supports, the windowed attic, curved shell, ribs, cupola and statue. Near adds cornice/window trim, capitals, roof balusters, 18-step flights and simplified pediment relief; far uses fewer cylinder/shell segments, simplified column mouldings and five-step flights. Ground faces buried at y=0 are omitted, and adjacent visible trim has positive offsets.

Limitations: sculpture and Corinthian capitals are abbreviated geometric relief; the statue is an original approximate robed silhouette, not a sculptural reconstruction; metal roofs are closed hipped masses with simplified link monitors, without light courts or skylights. Roof-mounted equipment, flags, handrails, fine rustication and interior rooms are omitted. Porch counts/depths outside the sourced dome are estimates. Olmsted's descending lawn terraces and the underground Visitor Center are excluded. The street-visible silhouette and facade rhythm are the intended level of fidelity, not restoration drawings.

Capitol Hill relief is handled by a bounded median `SPEC.terrainPad` over the building/approach envelope with four sample references and a 10 m feather, avoiding the default lowest-sample disc. The geometry remains rigid at local grade. This is placement metadata only; actual east/west entrance levels, terrace transitions, coarse-to-fine DEM arrival, nearby road preservation and pad feather require app review.

## Export costs and verification

Build: `pnpm build:top-cities-landmarks united-states-capitol --no-check`.

| LOD | Default-scene triangles | Draws | Bytes | KiB |
| --- | --- | --- | --- | --- |
| near | 32,580 | 6 | 1,577,704 | 1540.7 |
| far | 6,738 | 6 | 320,020 | 312.5 |

Both exports are self-contained, texture-free GLB 2.0 without compression/decoder extensions; no removable `bridgeLift` attribute remains. These are export costs, not a Tesla hardware measurement. Far retains the measured near bounds within 0.5 m while using less than one quarter of its triangles.

Visual evidence read (three look rounds):

1. `tmp/top-cities/shots/united-states-capitol/initial/united-states-capitol-procedural-near-light-sheet.jpg`: the shallow attic, cylindrical dome silhouette, blank wing facades and white flat roofs were apparent.
2. `tmp/top-cities/shots/united-states-capitol/revised/united-states-capitol-procedural-near-light-sheet.jpg`: inspected the corrected dome stages/ribs, windowed attic, wing galleries and hipped metal roofs; extended camera distances to show both ends of the facade.
3. `tmp/top-cities/shots/united-states-capitol/verified/capitol-export-reference-contact-sheet.jpg`: READ the final exported GLBs beside the four current reference photographs, seven views each in near/far and light/dark (overview, east front, west front, roof, street, dome detail, entrance). Also READ `verified/united-states-capitol-glb-near-light-top.png` against the red mapped outline. The dome, stage changes, colonnade gaps, grounded stairs, roof bounds and both facades remain legible in far; sculpture detail and fine railings simplify visibly.

Deterministic export QA: `tmp/top-cities/united-states-capitol/metrics.json`, no budget/bounds issues, zero different-material coplanar overlaps and 0% back-facing first hits across 246 successful near rays. Fixes included removing buried foundation faces, offsetting basement ends and stair contacts, corrected rib winding/normal direction, and grounding roof and column stages.

Focused tests: seven landmark tests plus three Capitol registry checks pass (dimensions, bronze summit, all 36 open peristyle bays, twelve tholos supports/lantern openings, porch and wing column gaps, stairs, footprint containment, LOD bounds and GLB source agreement). The prescribed two-file test run is also recorded; any failures belonging to concurrently authored landmarks are outside this asset's ownership. `node scripts/asset-catalog.mjs` passed at the completed-catalog checkpoint (164 entries, 270 GLB variants), and `pnpm assets:preview` successfully built the local inspector at `tmp/champlain-preview/asset-catalog.html`. The latest prescribed two-file run (`tmp/top-cities/united-states-capitol/focused-tests.txt`) passed all ten Capitol checks but failed on concurrently changing Old Orange County Courthouse readiness and Palace of the Parliament far bytes; the later catalog retry was blocked by the missing Fourvière documentation file. No other landmark/shared files were edited to make global checks pass.

Cityscape: **not tested yet, integration is checked separately.** Full 3D world: **not tested yet, integration is checked separately.** Independent review remains with the coordinator; authored/inspected/catalogued status does not establish runtime replacement, terrain integration, publication or deployment.
