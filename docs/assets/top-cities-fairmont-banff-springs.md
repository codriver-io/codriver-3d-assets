# Fairmont Banff Springs

Original texture-free procedural model of the present hotel at 405 Spray Avenue, Banff: Walter Painter's 1914 centre tower and John Orrock's 1928 limestone wings, succeeding Bruce Price's 1888 wooden hotel. Includes the connected southern hall envelope; excludes the detached Rundle building and garden shelters. Source lives in `src/peregrine/landmarks/top-cities/fairmont-banff-springs/`.

The [Parks Canada heritage description](https://www.pc.gc.ca/apps/dfhd/page_nhs_eng.aspx?id=2&lang=en) identifies dark local Rundle limestone, copper roofs, round arches, dormers and paired gable motifs. The [Wikipedia dossier](https://en.wikipedia.org/wiki/Banff_Springs_Hotel) supplies the published 59.5 m overall height and eleven-storey centre-tower history; its 15-floor infobox describes the overall hotel, not fifteen equal facade rows. At 800 m the three rising pavilions and roofs are the identifying features; at 100 m stone window surrounds, roof dormers, corbelled turrets and the entrance canopy give scale.

| Dimension | Model | Basis |
| --- | --- | --- |
| Overall height | 59.5 m to central pinnacle | Published, Wikipedia infobox; exact physical datum not supplied |
| Main axis | 151 degrees east of north | Mapped, OSM way 24823886; two controls (-115.5623759,51.1643434), (-115.5621365,51.1640520) give approximately 152 degrees |
| Complete hotel envelope | About 218 m east-west × 248 m north-south | Mapped complex including connected halls; not the historic main facade alone |
| Main pavilion arrangement | About 130 m along the southeast axis | Photo-informed subdivision of mapped envelope |
| Centre tower | 24 m wide × 44 m deep; eave 45.5 m, roof ridge 58.7 m | Estimated from photographs, not surveyed |
| End pavilions | 13–14 m wide, 39–40 m deep; eave 34 m, roof 49–50 m | Estimated |
| Connecting wings | Eave 31 m, ridge 40 m | Estimated |
| Window / floor pitch | 1.5 × 2.25 m glass; 3.6 m pitch | Estimated; facade count is approximate |
| Porch | 12 × 7 m, canopy 5.3–5.7 m | Photo estimate; supplemental ownership ring because not mapped as an OSM roof |

Frame: origin (-115.56194,51.16444), metres, east/up/south. Geometry starts in coordinates along the mapped southeast hotel axis and toward the northeast river, then transforms once into east/up/south. Rotation is baked in the GLBs. Outer footprint is the entire connected hotel way 24823886, with a small estimated porch ring; nearby roof ways and Rundle are not owned. The lower podium follows the irregular outline; upper roofed blocks are a photographic reconstruction, not an extrusion of the outer outline. Upper blocks simplify small angled edge steps; all vertices are tested within a 3 m projection margin of the detailed mapped rings (the whole envelope, not only its bounding rectangle), including protruding window trim; some internal block joins are approximate.

Seven named materials near, six far: dark warm grey-brown `stone`, lighter `ashlar` patches, pale `trim`, grey-green `roof`, cool `glass`, selective warm nighttime `glow`, and `metal`. Frames, panes and masonry sit at distinct offsets. Repeated details merge by material and indexed flat normals. Far preserves all pavilions, roofs, turrets, two-tier gable windows, porch opening and connected halls, with fewer dormers and simplified facade slots. Copper weathering, stone roughness, carved ornament, round-arch window profiles and signage are simplified; there are no interiors, mountains, trees or photographic textures. The southern annex is deliberately less detailed than the historic main block; its narrow tail is represented as a low flat roof.

Local y=0 is the entrance terrace, not sea level; the reported 1,414 m altitude is not baked in. The building remains rigid in both modes. An explicit `terrainPad` uses the main footprint plus porch with three reference positions at the entrance-side hotel base and a median datum, feathered over 8 m. This avoids a lowest-value circular pad sampling down the Bow/Spray valley. No DEM heights have been measured here: the broad connected halls may require separately measured terrace offsets before approval, so guessed offsets are not encoded. Cityscape: not tested yet, integration is checked separately. Full 3D world: not tested yet, integration is checked separately.

References were inspected in ignored `tmp/top-cities/fairmont-banff-springs/refs-sheet.jpg`, especially Audree's entrance and Kimpayant's river facade, supplemented by [Tony Hisgett's aerial photograph](https://commons.wikimedia.org/wiki/File:Banff_Springs_Hotel_(266360222).jpg), CC BY 2.0. The dossier also contains interior photos (Adam Jones, CC BY-SA 3.0) and a Library of Congress historic exterior (public domain), which do not establish present exterior geometry. Every title, author and licence is recorded in the catalog fragment; none is shipped.

Visual evidence: first procedural contact sheet in `tmp/top-cities/shots/fairmont-banff-springs/iteration1/` (overview, facade, back, roof, entrance, detail) was compared with the reference sheet. It showed overly pale solid gables and a single dormer tier; iteration2 darkened the gable faces, added two-tier framed gable openings and an upper dormer row. Exported GLB near/far light/dark sheets and a footprint plan are recorded below after export. Tests raycast the three pavilions, lower forecourt wing, tower facade and open canopy, and check the mapped frame, grade and equal near/far bounds. App integration and independent reviewer approval remain separate gates.

Rebuild: `pnpm build:top-cities-landmarks fairmont-banff-springs --no-check`.


## Final exported verification

| Variant | Triangles | Draws | Bytes | KiB (rounded) |
| --- | --- | --- | --- | --- |
| Near | 31,876 | 7 | 1,518,052 | 1,482 |
| Far | 8,096 | 6 | 357,316 | 349 |

These are exported default-scene costs; both are below the 60k/14/2.5 MB and 12k/8/500 KB caps. Near/far have identical bounds, y=0 to 59.5 m. `bridgeLift` is absent. Export QA found zero different-material coplanar overlaps; the outside-in double-sided ray sweep reported 2.0% back-face first hits (3 of 152), at the accepted threshold; roof dormers remain simplified small shells rather than individually surveyed details.

The final exported comparison was opened and judged against the actual photographs at `tmp/top-cities/shots/fairmont-banff-springs/final/comparison.jpg`: near light facade/back/roof/entrance/detail, near dark facade/detail, far light facade/back, far dark facade/back/roof/detail. Individual images and their four contact sheets are in that same directory. The exported plan image was also opened: `tmp/top-cities/shots/fairmont-banff-springs/final-plan/fairmont-banff-springs-glb-near-light-top.png`. The third and final look/fix iteration pulled end-pavilion and annex rectangles inward at stepped footprint boundaries and retained the lower mapped envelope; no fourth geometry iteration was performed. Roof gables and frame accents now read substantially closer to the references, although real irregular bays, projecting bowed fronts, stepped gable profiles, round arches and fine masonry remain approximations. The broad hall tail remains low and plain.

The exact required test command passed **166/166** checks, including all three local tests (under one second total) and this landmark's three conformance tests. `node scripts/asset-catalog.mjs` passed: **178 records, 344 GLB variants**. An earlier catalog check caught another worker's in-progress museum export; the final check is clean. QA JSON: `tmp/top-cities/fairmont-banff-springs/qa.json`; test log: `tmp/top-cities/fairmont-banff-springs/tests.txt`. No shared source files were edited. Independent visual reviewer approval and both in-app placement modes remain untested.
