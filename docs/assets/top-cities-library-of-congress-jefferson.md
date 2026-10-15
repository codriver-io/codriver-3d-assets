# Library of Congress, Thomas Jefferson Building — Washington, D.C.

Original procedural model of the 1897 Beaux-Arts Thomas Jefferson Building on First Street SE, facing the United States Capitol. The read is a long granite block, a copper-green dome with the gilt Flame of Knowledge, four corner pavilions, a projecting west portico with three arched bronze portals, a split stair, and the Court of Neptune at street level. The United States Capitol landmark was studied for batching, dome ribs and catalog shape. None of its geometry was copied.

## Sources and dimensions

The dome height is the figure Wikipedia records for the exterior Edward Pearce Casey and Bernard Green built: 195 ft, which is 59.436 m to the Flame of Knowledge. The copper was gilded until the 1930s; the flame is still gold leaf. The building opened on 1 November 1897. The west front faces the Capitol. Those facts are from the [Wikipedia article](https://en.wikipedia.org/wiki/Thomas_Jefferson_Building), checked during authoring. Storey heights, bay pitch, the dome profile between the roof and that tip, hip pitch and the grouped fountain figures are estimates from the mapped outline and the photographs below.

| Feature | Published / mapped value | Model | Basis |
| --- | --- | --- | --- |
| Flame of Knowledge | 195 ft = 59.436 m | 59.436 m, both LODs | Wikipedia |
| Plan | OSM relation 1029374, outer way 42363196 | one outer ring, origin at its area centroid | OpenStreetMap |
| Origin | centroid of way 42363196 | −77.0047094, 38.8886833 | measured from the dossier |
| Wall yaw | south edge about 0.171° north of east | baked +0.171° | mapped wall, not a survey |
| Open courts | two inner ways, 42363192 and 42363198 | two light courts, regularized rectangles | OSM holes; aerial |
| West stair and fountain | inside the First Street bulge | clipped to the outline | OSM; the real plaza runs onto the sidewalk |

The Architect of the Capitol describes four courtyards in the original hollow-rectangle plan. The mapped building and Carol Highsmith's aerial show two large open light courts, north and south of the dome, and those are the courts in the mesh. The north OSM hole is smaller and more irregular than the south one; both courts are drawn as a matching pair over those holes. That is an estimate, stated as such.

Mapped geometry came from the dossier `osm.json` (shared Overpass helper). Real metres, +X east, +Y up, +Z south. Local y=0 is the First Street sidewalk. No Mercator scale, scene altitude or DEM is baked in. There is no `terrainPad`. Vertices sit inside the outer ring with under 0.6 m of slack, checked in the landmark test and in the top view. The sidewalk stair beyond the mapped bulge is not modelled.

## Photographic references and rights

`tmp/top-cities/library-of-congress-jefferson/refs-sheet.jpg` was read first, then the exterior frames and the aerial.

- [USCapitol, west front from the Capitol](https://commons.wikimedia.org/wiki/File:Flickr_-_USCapitol_-_Library_of_Congress_Thomas_Jefferson_Building_(1).jpg), public domain: distant massing, dome colour, corner pavilions.
- [William Henry Jackson, c. 1902](https://commons.wikimedia.org/wiki/File:Library_of_Congress,_Washington,_D.C._-_c._1902.jpg), public domain: historic west front. The dome was still gilded then; the model uses today's oxidized copper.
- [Carol M. Highsmith, west stair and portico](https://commons.wikimedia.org/wiki/File:Exterior_view._View_of_approaches_from_the_west_fa%C3%A7ade_of_the_Jefferson_Building._Library_of_Congress_Thomas_Jefferson_Building,_Washington,_D.C._(LOC).jpg), public domain: triple arches, paired columns, oculi, split stair.
- [Carol M. Highsmith, Torch of Learning](https://commons.wikimedia.org/wiki/File:Exterior_view._Torch_of_Learning,_cupola,_and_dome._Library_of_Congress_Thomas_Jefferson_Building,_Washington,_D.C._LOC_7562154230.jpg), public domain: ribbed copper and the gilt lantern.
- [Carol M. Highsmith, aerial](https://commons.wikimedia.org/wiki/File:Thomas_Jefferson_Building_Aerial_by_Carol_M._Highsmith.jpg), public domain: two courts, hipped metal roofs, east pavilion, dome west of the centroid.

Interior frames on the sheet (Ad Meskens, CC BY-SA 3.0; David Wilson, CC BY 2.0) were not used for the exterior. No photograph, texture or scan is shipped. Mapped geometry © OpenStreetMap contributors, ODbL 1.0.

## Structure, materials and approximations

Eight merged materials: cool granite `stone`, darker base and court floors `stone2`, dark blue-grey metal `roof` (`#3c5160` day, `#2c3d4a` night), oxidized copper `copper`, darker ribs and lantern drum `patina`, gilt cup and flame `gold`, window `light`, and bronze doors plus the fountain figures `bronze`. `light` is unshaded. Day glass is dark; night glass is warm. The dome stays green in both themes, and the flame stays gold. No ninth material: far is already at the 8-draw cap.

The shell is a ring of ranges around two courts, plus a reading-room spine under the dome, four corner pavilions and a stepped east pavilion. Corner pavilions have raised dark metal stages with separate framed window bays under low hip crowns. Both LODs keep the stage and its window rhythm. The copper is a shallow saucer: it tapers continuously inward from 13.5 m radius at y=41.05 to 8.2 m at y=47.32, meeting a dark windowed cupola and a small dome. The gilt Flame of Knowledge is a faceted cone with shorter tongues; its tip is 59.436 m. The west portico has three bronze arches with stone jambs and an archivolt, paired columns, oculi and a split stair. Ground-floor bays on the wings are arches, with pilasters on both LODs. The Court of Neptune is a west-opening semicircle between the ramps, with a grouped Neptune, trident and two flanking figures, not a sculptural scan. Near adds mullions, dentils, balcony posts and bust discs. Far keeps the window rhythm, the three arches, the green saucer and the gilt lantern, with coarser columns and fewer ribs.

## Export costs and verification

Build: `pnpm build:top-cities-landmarks library-of-congress-jefferson --no-check`.

| LOD | Triangles | Draws | Bytes | KB |
| --- | --- | --- | --- | --- |
| near | 20,597 | 8 | 1,026,504 | 1002 |
| far | 8,905 | 8 | 453,960 | 443 |

Both files are texture-free GLB 2.0. Far stays inside the near silhouette (well under the 5% / 1.5 m gate). These are export costs, not a car measurement.

Sheets that were read:

1. `tmp/landmarks/shots/library-of-congress-jefferson/library-of-congress-jefferson-procedural-near-light-sheet.jpg`, next to the reference sheet and the aerial. The first pass had a mint dome, olive doors and a peg-sized fountain. Corner faces that had used world coordinates as facade offsets were pulled back inside the ring before this sheet.
2. `tmp/landmarks/shots/library-of-congress-jefferson/r2/library-of-congress-jefferson-r2-sheet.jpg` (near and far, light and dark, plus the top view) and `r2/library-of-congress-jefferson-procedural-near-light-top.png` against the red ring. The dome reads green with a gilt flame in the far view. The split stair, bronze arches, paired columns, two courts, corner pavilions and east spur sit on the outline. The fountain is a grouped silhouette in the notch between the ramps.
3. `tmp/landmarks/shots/library-of-congress-jefferson/glb/library-of-congress-jefferson-glb-sheet.jpg`, the exported GLBs (near and far, light and dark: overview, west front, entrance, dome). Same read as the procedural model: green dome, gilt flame, window quads and bronze arches survive in the far GLB, and the night dome stays green.

The model was active in both modes, the green saucer and gilt tip read at street distance, and the base meets the ground. No route, HD pavement or car pass was run. World used the AWS Terrarium tiles.

## g3a correction (2026-10-15)

The g2r review found an outward-returning lower dome shoulder and white pavilion attic boxes. Removed the dome's return so its profile decreases in radius at every rising key; preserved the existing enlarged windowed cupola, copper green and gilt tip. Replaced all four white attic stages with dark raised metal stages, framed individual windows and low hip crowns in near and far. The two open light courts are unchanged.

Judged `tmp/next-200/fix/g3a/library-of-congress-jefferson/glb-{near,far}/library-of-congress-jefferson-glb-<LOD>-light-sheet.jpg` directly beside the dossier exterior reference sheet. The lower dome slopes inward into the cupola; the pavilion stages now contrast with the granite in both LODs. No second geometry correction was needed. Added geometry ray tests for the inward taper and dark stages, and counted actual far stage window vertices. Focused tests pass; exported QA reports 0% back-face hits, zero layered faces and no depth material cycles. App evidence and limits follow below.

Current Cityscape and Full 3D world captures are `tmp/next-200/fix/g3a/library-of-congress-jefferson/app-{city,world}/library-of-congress-jefferson-{far,near,street}.png`, summarized in `app-sheet.jpg`; the model is active and the reports confirm far/near LODs. Compared all six views. Both show a green inward-tapering dome with the gilt lantern, dark raised windowed pavilion stages, open courts and a clean west frontage. Visible stairs/fountain/base meet the ground; no owned provider extrusion is apparent. These are visual placement checks, not a full terrain/lifecycle certification: no routes, car pass, missing/late DEM, reanchor, exaggerated terrain or hardware tests were run. AWS Terrarium is the world DEM; OSM/Protomaps tiles are from tiles.codriver.io. Scratch runtime build stamp: `3c7e0f4a8393`; no shared bundle was changed. The software GLB night sheet is in `final-dark/`.
