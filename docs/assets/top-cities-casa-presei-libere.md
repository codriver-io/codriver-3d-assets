# Casa Presei Libere

Casa Presei Libere (House of the Free Press), Piața Presei Libere, north Bucharest. Built 1952–1957 as Casa Scînteii, a Stalinist wedding-cake modelled on Moscow State University and squatter than the Seven Sisters. The present building keeps the television antenna and has no roof star. This original procedural exterior follows the mapped OSM parts: a 50 m central block, a stepped tower, a spire, four corner pavilions, and symmetrical wings around three open courts.

## Sources and frame

English Wikipedia (House of the Free Press) and Romanian Wikipedia (Casa Scânteii) supply the published figures. OSM relation 15922160 supplies the outline, part heights and the three courts (outer way 1177639752; courts 1177639753, 1177639754, 1177639755). Licensed comparison photographs stay in `tmp/top-cities/casa-presei-libere/refs/` and are not textures: Fortepan 84528 (CC BY-SA 3.0), Alexandru Panoiu (CC BY 2.0), Tiia Monto (CC BY-SA 4.0), Paul Chiorean roundel (CC BY 2.0).

Origin: 26.07121, 44.48093, the dossier anchor. Real metres, east / up / south, local y = 0 at the flat grade of the old hippodrome. The ceremonial south front faces Șoseaua Kiseleff and the square at bearing 160.28°, taken from the long south edge of the central part. Authoring boxes use `rotateY(-2.797694)` so local +X lies along that wall. No DEM, absolute altitude or Mercator scale is baked.

| Element | Final value | Evidence |
| --- | --- | --- |
| Antenna tip | 104 m | Wikipedia: 91.6 m shoulder + 12.4 m antenna |
| Spire shoulder | 91.6 m | Same source (Dicționarul Enciclopedic Romîn, 1962) |
| Foundation | About 280 × 260 m | Wikipedia; oriented OSM outer ring measures about 280 × 262 m |
| Floor area / volume | 32,000 m² / 735,000 m³ | Wikipedia; not modelled as interiors |
| Central block | 0–50 m | OSM part height |
| Tower stages | 50–57.8, 57.8–64.3, 64.3–70 m | OSM tower part is 50–70 m; the two setbacks are estimated |
| Spire shaft to shoulder | 70–91.6 m | OSM spire part is tagged to 104 m; the narrow lantern and tapering needle are estimated from the reference photos |
| Corner pavilions | Shaft to 55.3 m, pyramid to 59.3 m, needle 62.6 m | OSM roof 57 m; the extra pinnacle is estimated |
| Wings | 24 m, with end tempiettos to 36.2 m | OSM wing height; lanterns are estimated where the photos show them |
| Low links | 5–16 m | OSM part heights |
| Portico | Six columns, entablature about 8.4–9.55 m | Visual estimate on the south edge |
| Architects | Horia Maicu; Nicolae Bădescu (RO); engineer Panaite C. Mazilu | Wikipedia |

## Massing and facade

Each OSM part except the tower, spire and four turrets is a stone prism to its mapped height, with an inset courtyard wall so the courts read as rooms. The tower carries a broad vertical belvedere to 70 m. Above it are a narrow square lantern with corner turrets, a smaller transition, a tapering needle to 91.6 m, and a square metal mast with three pairs of crossarms to 104 m. Corner pavilions carry a pyramid and a needle. Six wing ends carry full-size pavilions and lanterns. The south front has a ground arcade, a six-column portico and, in the near LOD, plain discs where the carved star-and-grape roundels sit. Near windows are two panes with a mullion; far keeps one pane per double bay, still a grid, plus the arches. Pilasters and cornices use a visibly lighter cream than the grey-cream wall stone.

Five materials, the same keys in light and dark: stone `#d2d0c7` / `#828584`, base `#b6b4aa` / `#646a68`, trim `#f1eadb` / `#acaea6`, glow `#5e686c` (day glass) / `#e8c27a` (night windows), metal `#8a9094` / `#5c6368`. Glow, and only glow, is unshaded. Windows stand 0.40 m proud near and 0.72 m proud far, outside the depth gap. Cornice ends use the trim material so a stone end cap does not share a plane with the neighbouring cornice.

The removed roof star, tenant billboards, the Wings monument and the former Lenin statue are omitted on purpose.

## Export costs and verification

| LOD | Triangles | Draws | Bytes | KiB |
| --- | --- | --- | --- | --- |
| Near | 22,419 | 5 | 1,204,260 | 1,176 |
| Far | 8,118 | 5 | 437,084 | 427 |

Hard caps are 60,000 / 14 draws / 2.5 MB near and 12,000 / 8 draws / 500,000 bytes far. Both exports are inside those caps, and the near file is under the 1.5 MB aim. Near and far share the 104 m tip and a matching bounding box. Min y is 0.

`pnpm build:top-cities-landmarks casa-presei-libere --no-check` wrote the GLBs. `node scripts/landmark-depth-layers.mjs --ids casa-presei-libere` regenerated the depth table for this id and dropped 0 cycle edges. Landmark tests pin the 104 m mast, the 50 m podium, the 24 m wing, the corner needle, an empty court, the south window rows in both LODs, and footprint overhang under 2.8 m.

## Visual evidence

Judged against `tmp/top-cities/casa-presei-libere/refs-sheet.jpg` (wide south front, closer south front with the antenna, historical Lenin view, star-and-grape roundel):

- Exported near, light: `tmp/top-cities/shots/casa-presei-libere/casa-presei-libere-glb-near-light-sheet.jpg` (overview, south facade, portico detail).
- Exported far, light: `casa-presei-libere-glb-far-light-sheet.jpg` (overview, south facade). Windows stay separate quads; arches and the portico remain.
- Exported near, dark: `casa-presei-libere-glb-near-dark-sheet.jpg`. Stone dims; windows are warm.
- Exported far, dark: `casa-presei-libere-glb-far-dark-sheet.jpg`.
- Plan and north side, procedural near light (massing unchanged by the later window-depth pass): `casa-presei-libere-procedural-near-light-top.png`, `…-roof.png`, `…-back.png`. The model sits in the red rings. The three courts are open. Orange +X and blue +Z match the facade axes.

The silhouette is this building: stepped central tower, spire and crossarm antenna, long symmetrical wings, corner pinnacles, cream stone, arched ground floor. Weaknesses left on purpose: roundels are plain discs; the columns are thin; carved ornament and the hammer-and-sickle reliefs are omitted.

## Approximations and placement

Storey pitch, bay width, cornice depth, the portico, the plain roundels, the corner needles above 57 m, and the wing-end tempiettos are visual estimates. The two side U-blocks follow OSM, including the wings that project farther south than the central block. A mapped 5 m part sits outside the outer ring and is included in `FOOTPRINTS`. Portico and cornices overhang the rings by at most about 2.4 m.

`terrainPad` is `{ rings: FOOTPRINTS, datum: 'median', featherM: 18 }`. The site is the old hippodrome and is treated as flat. Static Cityscape and Full 3D world captures are recorded below; lifecycle and terrain-refinement cases remain not tested. Catalog readiness and these inspector sheets do not certify app placement.

## g4b review correction (2026-10-15)

The broad belvedere now stays vertical to 70 m; a 6.2 m square upper lantern
with corner turrets supports a 3.8 m transition and a slender taper from 81.1
to the 91.6 m antenna shoulder. This removes the five-step ziggurat. All crown
proportions remain photo estimates. The needle and mast share a closed cap.

Wall removal now clips only the height buried by each adjoining lower wing.
The west flank above the lower links keeps the same separate window rows
and lighter pilasters as the front. All six end pavilions fit at a full
12.5 × 11 m instead of shrinking to polygon corners; their 9 × 7.9 m lantern
shafts rise above the 24 m wings and their needles reach 36.2 m. Grey-cream
walls and lighter cream trim replace the sandy palette.

Final exported near/far daylight and far night sheets, including crown and
west-flank views, are under `tmp/next-200/fix/g4b/casa-presei-libere/`, alongside
the dossier reference sheet. Focused rays verify the upper lantern width,
slender needle, west-flank windows and the width/height of all six end towers
in both LODs. Metrics find no layered/coplanar faces, back-face sweep flags,
below-grade parts, window rhythm loss or unsupported-member flags; the depth
check reports zero dropped cycle edges.

Measured final exports: near 22,419 triangles / 5 draws / 1,204,260 bytes; far 8,118 triangles / 5 draws / 437,084 bytes.

## g4b app evidence and limits

Cityscape: verified static far/near/street views on 2026-10-15 using Protomaps from tiles.codriver.io, isolated scratch bundle 4a6d5eaf149c on slot J; Full 3D world: verified static far/near/street views with AWS Terrarium DEM z15, same bundle and slot. Evidence: tmp/next-200/fix/g4b/casa-presei-libere/app/{city,world}/; clean central base and end wings, no duplicate provider block observed. These static captures do not verify terrain arrival/refinement, mode changes, reanchoring, failure/disposal or device performance; those remain not tested. Roads and navigation unchanged.

Validation: 15 landmark-specific tests and all six matching top-cities
conformance tests pass; asset-catalog and assets:preview pass; near/far QA
metrics are clean and depth --check reports no cycles. The initial whole
top-cities run encountered unrelated unfinished palais-bourbon metadata and
exports; targeted conformance for these two assets is green.
