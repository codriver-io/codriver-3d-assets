# LeVeque Tower — Columbus, Ohio

Original procedural model of the cream glazed terra-cotta Art Deco tower opened in 1927 at 50 West Broad Street, designed by C. Howard Crane. The modeled state follows the restored architectural envelope and surviving upper decorations visible in the 2017 references; temporary 2026 street scaffolding is omitted. No photo, texture, external mesh or scan ships with it.

## Sources and dimensions

- [Wikipedia: LeVeque Tower](https://en.wikipedia.org/wiki/LeVeque_Tower): 555 ft 5 in / 169.29 m architectural height, 47 stories, 1927 opening, cream terra cotta, octagonal bartizan, long narrow windows, decorative figures and nighttime floodlighting. OSM's 50 levels counts upper decorative/mechanical levels and is not substituted for the published occupied-story count.
- [OSM way 752671107](https://www.openstreetmap.org/way/752671107), dossier `tmp/top-cities/leveque-tower/osm.json`: L-shaped building envelope and nested parts 374898703/704/705/706/866/917.
- Sixflashphoto: [LeVeque Tower NW 1](https://commons.wikimedia.org/wiki/File:LeVeque_Tower_NW_1.jpg) and [The LeVeque Tower Upper Stories](https://commons.wikimedia.org/wiki/File:The_LeVeque_Tower_Upper_Stories.jpg), CC BY-SA 4.0; daylight massing, narrow arched crown windows, corner turrets, figures and modern antennas.
- Bubba73, [Details (04)](https://commons.wikimedia.org/wiki/File:Details_of_the_LeVeque_Tower_in_Columbus,_OH,_US_(04).jpg), CC BY-SA 3.0; Ɱ, LeVeque Memorial Day 01/02/03, CC BY-SA 4.0; pasa47, Palace Theater, CC BY 2.0. Dossier credits retained under ignored `refs/SOURCES.txt`; no redistribution of images in runtime assets.

| Feature | Model metres | Authority |
| --- | ---: | --- |
| Architectural summit | 169.29 | Published |
| Antenna tip / SPEC.height | 189.29 | Estimated modern antenna, kept separate |
| Shaft plan | approx. 22.7 × 21.9, chamfered northeast corner | OSM mapped |
| Full frontage envelope | approx. 55 × 55 | OSM mapped; published 57 m is nominal historical frontage |
| Wing roof | 77.42 | Photo/OSM level estimate |
| Shaft shoulder / upper square | 128.6 / 147.5 | Photo estimate |
| Octagonal drum / dome | 147.5–163.25 / 163.25–169.29 | Photo estimate |
| Bartizan diameter across corners | 15.1 | OSM/photo estimate |
| Corner figures | 6.9–7.4 | Photo estimate; grouped relief silhouettes |

## Frame, ownership and modeling

Real metres, +X east / +Y up / +Z south, origin `[-83.00209,39.96238]`, local rigid grade y=0. No DEM, altitude or latitude stretch is baked in. Rotation 8.3° is exported once: control points from part 374898704's south edge run `[5.61,14.83]` to `[37.78,10.13]` in dossier east/south metres; part 374898703's long west edge independently confirms the perpendicular street alignment. Frontage faces bearing 188.3°.

Mapped L-shaped wings and central tower replace the listed envelope and every tower building-part; separate Palace Theatre auditorium way 494888221 remains provider-owned because its roof/interior volume is not authored here. The theatre entrance marquee projects about 1.6 m beyond the east-wing frontage at y≈5.3 m; base vertices remain inside the mapped envelope. No ground pad crosses adjacent streets.

Merged facade shells have real window openings, glass recessed 34 cm behind its channel in near, and flush disjoint glass within recessed channels in far. Recess jambs and head/sill surfaces have outward winding; there is no solid backing wall behind the glass. Far combines rows/bays into a coarser grid of separate quads while retaining the shoulder, four turrets, long arched upper slots, octagonal drum, dome, figures and antenna. Crown stone uses `lamp` for warm night floodlighting; occasional `glow` windows are lit at night. Copper terrace roofs are subdued green. Geometry merges into eight material draws, including muted shadow-tone `recess` for the deep shaft channels.

Small carved swags, masonry joints, individual heraldic anatomy, exact radio hardware and theatre lettering are simplified. Upper reliefs use robe, shoulder, arms and head groups rather than carved replicas. Uniform warm crown lighting represents one ordinary lighting state; holiday RGB schemes are not reproduced. No Tesla hardware performance benchmark.

## Review b8a corrections and verification

Review b8a finding 1: the y=7.2–112 m shaft now has continuous projecting stone piers at +0.50 m and recessed bay channels at −0.16 m, with outward-wound return surfaces and individual windows. A subdued shadow-tone stone material keeps the vertical rhythm legible with shared unlit shading. Finding 2: shoulder gables are supported projecting prisms instead of buried triangles; the upper shoulder recedes behind them. Four corner turrets have stepped collars, and the octagonal drum and summit have stepped cornices and medallions in both LODs. Gables meet the shaft roof and shoulder, collars meet their columns, and cornices meet the drums.

| Export | Triangles | Draws | Bytes | KiB |
| --- | ---: | ---: | ---: | ---: |
| near | 37,932 | 8 | 2,028,464 | 1980.9 |
| far | 8,934 | 8 | 485,620 | 474.2 |

Final judged evidence: `tmp/top-cities/shots/leveque-tower/review-fix-final/comparison.jpg`, with attributed dossier references above exported near-light, far-light and far-dark four-view sheets. Two look-fix iterations were used; no additional reference downloads or footprint changes were needed. LeVeque views cover overview, opposite side, street and crown; Library Square views cover overview, facade, opposite side and roof. Night lighting remains a simplified architectural representation.

Both models pass deterministic QA and generated depth checking with zero cycle edges dropped. The 13 own-landmark tests pass, including new regressions for shaft relief / gables / cornices and identical tower-row elevations with bounded single-storey glass and glow heights. The requested combined registry run passes all 616 tests; log: `tmp/top-cities/leveque-tower/review-fix-tests.txt`. Catalog validation passes at 336 entries / 616 variants, and `pnpm assets:preview` succeeds. Earlier transient missing MuCEM documentation resolved without edits to another builder’s files.

Cityscape: **revised exports not tested in app**. Full 3D world: **revised exports not tested in app**. Pre-fix static app evidence exists at `tmp/next-200/qa/b8/app/{city,world}/leveque-tower-*.png`; independent b8a review found visible base contacts acceptable. Library Square also has four-bearing evidence in both modes establishing nearby white towers as neighbours, so no provider ownership expansion is warranted. Those shots do not establish corrected exports, terrain arrival, replacement lifecycle or hardware performance. The lead owns fresh both-mode app captures and independent re-review. Only the authorized generated depth table was changed outside the owned asset files.
