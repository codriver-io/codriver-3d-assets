# 555 California Street (San Francisco)

Stable asset ID: `555-california-street`. Original procedural model of **555 California Street**, the former Bank of America Center, as it stands today. Part of the [San Francisco landmarks](../san-francisco-landmarks.md); catalogue record `prototypes/assets3d/catalog.d/555-california-street.json`. Source: `src/peregrine/landmarks/san-francisco/555-california-street/`.

## Identity and version

- Wurster, Bernardi & Emmons with Skidmore, Owings & Merrill, Pietro Belluschi consulting; completed 1969; 52 storeys, 779 ft / 237 m; the tallest building west of the Mississippi until the Transamerica Pyramid (Wikipedia, SOM). Version modelled: the building as it stands (photographs 2021-2023); the 2009-era Carnelian Room closure and tenant changes do not change the shell.
- What a driver sees: the darkest large tower in the Financial District, clad in polished carnelian (dark red) granite and bronze-tinted bay windows, strongly ribbed vertically by the sawtooth bays (about 3,000+ of them), with irregular stepped cutouts near the top ("suggesting the Sierra Nevada") and a smaller crown block above a 226 m shaft with four corner arms.

## Sources and how they were used

| Source | Used for |
| --- | --- |
| OSM [288511106](https://www.openstreetmap.org/way/288511106) | Whole complex outline (`height=226 m`, `building:levels=52`, `building:colour=#ae9a99`), the footprint ring; the sawtooth is mapped as a zigzag with a vertex every ~3 m |
| OSM [1244283836](https://www.openstreetmap.org/way/1244283836) | 52-level shaft (`height=226`) with its four corner arms |
| OSM [1244283832](https://www.openstreetmap.org/way/1244283832), [-3](https://www.openstreetmap.org/way/1244283833), [-4](https://www.openstreetmap.org/way/1244283834), [-5](https://www.openstreetmap.org/way/1244283835) | The four 48-level outer strips (the outer layer of bays) |
| OSM [1243267628](https://www.openstreetmap.org/way/1243267628) | Crown block (`height=237 m`) |
| OSM [1244283830](https://www.openstreetmap.org/way/1244283830) | The 1-level pavilion on the east side |
| [Wikipedia](https://en.wikipedia.org/wiki/555_California_Street) | 237 m / 52 storeys, 1969, bay windows, Sierra-inspired cutouts, carnelian granite plaza and banking hall, "Transcendence" sculpture |
| [SOM](https://www.som.com/projects/555-california-street/) | Faceted bronze-tinted bay windows, polished red carnelian granite, upper-floor setbacks, column-free floors |
| [SkyscraperPage](https://skyscraperpage.com/cities/?buildingID=238) | Roof 779 ft, 52 storeys, footprint 143 x 243 ft (about 44 x 74 m, consistent with the mapped 44.5 x 71.4 m between bay peaks) |
| Wikimedia Commons photographs (Provenance) | Tier structure, cutout stepping, crown, louvre floors, colour, bay pitch; comparison of every screenshot |

Overpass was queried once through the shared helper (`around:130`, building and building:part ways, cached); the extract, the plan-conversion script and the SVG check stay in ignored `tmp/san-francisco/555-california-street/`.

## Frame, orientation and origin

Metres, +X east, +Y up, +Z south; `y = 0` is local flat-map grade, no altitude, no terrain, no latitude stretch baked in.

- `origin = [-122.403774, 37.792105]`, the centroid of the mapped 52-level shaft.
- The plan is the mapped one, rotated as mapped: the long axis runs at **-9.3 degrees** from east (towards the north-east, the street grid of the Financial District), so the California Street face looks toward bearing 351 degrees (`frontageBearing`). No rotation is applied in the layer; all coordinates in `555-california-street-plan.js` are the OSM vertices converted to local metres.
- The footprint ring is the whole complex outline (way 288511106): tower plus pavilion, 3,481 m2.

## Dimensions: sourced against estimated

| Quantity | Model value | Basis |
| --- | --- | --- |
| Crown roof | 237.0 m | **Sourced** (OSM crown part `height=237 m`; Wikipedia 779 ft) |
| Shaft roof / ledge round the crown | 226.0 m | **Sourced** (OSM `height=226`, 52 levels) |
| Roof plant and masts | 239.3 m penthouse, masts to 240 m | **Estimated** (photographs show small plant and two masts) |
| Tower plan between bay peaks | 71.4 x 44.5 m | **Mapped** (SkyscraperPage 74 x 43.6 m is the same shape) |
| Shaft plan / crown plan | 2,263 m2 / 974 m2 | **Mapped** (crown 53 x 28 m, inset about 12 m on every side) |
| Bay (tooth) pitch and depth | about 6.1 m x 2.3 m | **Mapped** (OSM zigzag); the real bay is slightly truncated at its front, the triangle is the mapped shape |
| Outer layer (48 levels) height | 174-207 m, stepping tooth by tooth | **Interpretation**: OSM gives one common 48-level figure (about 208 m); the per-tooth stepping is read from three photographs (south face climbing to the east, north face descending to the east) and is not surveyed |
| Floor pitch / window rows | 4.25 m; 51 typical rows from 9 m, ground lobby band | **Estimated** (237 m / 52 storeys; lobby taller) |
| Louvre floors | rows 11 and 35 (about 58 m and 157 m) | **Estimated** from the same two photographs |
| Pavilion | mapped footprint 477 m2, 11.5 m high | footprint **Mapped** (`building:levels=1`), height **Estimated** |
| Bay spacing / pier width | 0.8 m piers at every tooth vertex | **Estimated** |

## Materials

`granite` (polished carnelian: piers, ledges, risers, pavilion), `spandrel` (the same granite, darker, between windows), `glass` (bronze-tinted), `glow` (about 22% of near window panes and a few lit bands in far, self-lit; in the light palette it is a glass tone), `roof` (crown, penthouse and pavilion roofs), `metal` (plant, masts). Light and dark palettes list the same six keys; dark dims granite and glass and warms the lit panes.

## Modelling decisions

- The sawtooth is the mapped zigzag, extruded as **one prism face per facet** (about 190 facets), not a box per window. Piers are full-height strips at every tooth vertex; windows are one inset panel per facet per floor in near (0.15 m stand-off) and one per three floors in far (0.4 m stand-off, so it cannot z-fight at distance; the far windows are flush-stacked bands with the same rhythm).
- The outer layer is cut into **teeth** (cell boundaries at the mapped valley vertices) and every tooth stops at its own height with a granite ledge and a riser, which is what makes the stepped cutouts read from the street and from above. The shaft wall above each tooth carries its own windows down to the ledge; the shaft's corner arms run unbroken from grade to 226 m.
- Faces buried against the pavilion are not generated: the pavilion's west wall and the tower walls below the pavilion roof are skipped, so nothing is coplanar or hidden-and-drawn. The pavilion shares the tower's mapped zigzag.
- Not modelled and left to the provider: the plaza and steps, the entrance arcade recess, the black granite "Transcendence" sculpture (the plaza is not in the footprint), the lobby, and the pavilion's real galleries.

## Costs (measured by `pnpm build:san-francisco-landmarks 555-california-street`)

| Detail | Triangles | Draw calls | Bytes |
| --- | --- | --- | --- |
| near | 8,490 | 6 | 471,136 |
| far | 1,996 | 6 | 120,424 |

Budgets for buildings: 60,000 / 14 / 2.5 MB near, 12,000 / 8 / 500 KB far. Tesla hardware cost is unmeasured; desktop timing is not in-car performance.

## Verification

Looked at (all under ignored `tmp/san-francisco/shots/555-california-street/`, 1280x800 unless named): procedural and **exported GLB** renders, near and far, light and dark: `overview`, `facade` (street level, looking up the ribbing), `roof` (from above), `cutouts` (eye level at the stepped top), `north` (California Street face), `hall`, a top plan with the red footprint ring, a 100 m street view, and Coit-Tower-like (900 m north) and One-Montgomery-like (400 m south-south-east, 960x1000) views set beside the reference photographs.

What the looking changed: (1) first renders had saturated orange-red granite and black windows; granite was darkened and de-saturated and the glass moved to a bluish bronze so the ribbing and window rows separate like the photographs; (2) a uniform granite wall gave a window-grid look where the photographs show vertical ribbing, so the wall became a dark spandrel with lighter full-height piers at every tooth vertex; (3) one hidden diagonal shaft wall was oriented by the strip direction and rendered black; wall orientation for shaft pieces now tests which side is outside the shaft; (4) the stepped cutouts were too shallow against the One Montgomery photograph, so the tooth heights were spread (174-207 m); (5) far windows originally left a 15 m dark band under the shoulders and no windows on the crown; far now stacks three-floor bands that reach the top; (6) a roof mast stood at 243 m and the penthouse reached 239.9 m, both lowered to the intended 240 m masts; (7) lit-window colour in the light palette was brighter than shaded glass and speckled the day view; it now matches the glass tone. Fix round after independent review (PASS-WITH-NITS): (8) far had no `glow` mesh and read as a black slab at night; it now has lit bands and a lighter dark palette; (9) far was 3,661 triangles (43% of near); merging the window rows into per-facet spans between the louvre floors and keeping one pier per facet brought it to 1,996 (23% of near) with the silhouette, stepped cutouts, louvre gaps and jagged crown unchanged; (10) 0.1 m wide, 19 m tall sliver walls appeared at every cell cut where an inner-chain vertex sat within 0.1 m of the cut; vertices within 0.35 m of a cut are now merged into it and a test forbids vertical walls under 0.3 m wide and over 5 m tall. The dark wedges still visible in a straight-down plan view at the west ends of the north and south strips are the real shaded side walls of the corner arms above the lowest teeth (19 m on the north strip, 52 m on the south strip), seen at a grazing angle; the One Montgomery photograph shows the same dark side wall on the left arm.

Tests: `node --test src/peregrine/landmarks/san-francisco/555-california-street/555-california-street.test.js` (crown 237 m and ledge 226 m by raycast in both LODs, strip tops 170-210 m with six or more distinct heights and 25 m of stepping, corner arms above 224 m, the mapped tooth depth swing along the north face, front-facing walls from four sides, hall roof 11.5 m, containment inside the mapped outline within 0.5 m, nothing below grade, far silhouette and palette keys) and `san-francisco.test.js`.

Cityscape: **not tested** (integration is checked separately). Full 3D world: **not tested**. The standalone render does not establish placement on terrain; the model is a rigid shaft on local `y = 0` and `padM = 62` covers the tower and the pavilion.

## Open points

- The per-tooth cutout heights are an interpretation of photographs; a survey or elevation drawing would settle them.
- Bays are mapped triangles; the real bay has a short flat front. At 100 m the difference is not visible; closer than about 20 m the facets read slightly sharper than the original.
- The ground floor is a plain glazed band; the arcade and plaza are the provider's.

## Provenance

Original geometry; no photograph, scan or texture in the repository or the GLB. Plan derived from OpenStreetMap © OpenStreetMap contributors (ODbL 1.0). Comparison photographs (Wikimedia Commons, kept only in ignored `tmp/`): "555 California Street from Coit Tower" by Supercarwaar (CC BY-SA 4.0); "555 California Street from One Montgomery, San Francisco" by The wub (CC BY-SA 4.0); "555 California Street 2021" and "555 California from ground" by Dead.rabbit (CC BY-SA 4.0); "Perspective view of 555 California Street building, San Francisco, California, USA" by Semiautonomous (CC BY-SA 4.0); "555 California Street Building, San Francisco (TK)" by Tobias Kleinlercher (CC BY-SA 3.0); "City and US Flags in front of 555 California Street in San Francisco" by Ronnie Macdonald (CC BY 2.0); "555 California Street 1 2023-12-29" by Fastily (CC BY-SA 4.0).
