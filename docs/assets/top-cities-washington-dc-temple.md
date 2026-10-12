# Washington D.C. Temple — original procedural asset

Washington D.C. Temple, 9900 Stoneybrook Drive, Kensington, Maryland. This models the 1974 white-marble exterior after the 2022 renovation, for the distant Capital Beltway silhouette and closer approach views. The defining features are six gold needles in two three-tower clusters, the tallest eastern central tower with Moroni, diamond corner buttresses, narrow marble facade blades and slit windows, and the low northern entrance pavilion with seven portico fins and an upper courtyard.

## Sources and rights

Started from the supplied dossier in `tmp/top-cities/washington-dc-temple/`: `osm.json`, `osm.txt`, `facts.txt`, `refs-sheet.jpg` and `refs/SOURCES.txt`. No further OSM query or reference photo download was needed. The official [2022 renovation fact sheet](https://newsroom.churchofjesuschrist.org/multimedia/file/english-dc-press-kit-2022.pdf) gives a total height of 288 ft including Moroni, six gold spires and Alabama marble. The church's [Moroni account](https://www.churchofjesuschrist.org/study/ensign/2000/01/i-saw-another-angel-fly?lang=eng) documents the 18 ft statue. The footprint is mapped from [OSM way 87324809](https://www.openstreetmap.org/way/87324809) and its nested tower parts; geographic data remains © OpenStreetMap contributors, ODbL 1.0.

Judged the dossier's photographs: Warren K. Leffler, *Washington Temple 1974* (public domain); Carol M. Highsmith, *Washdctemplehighsmith13341u* and aerial *Washdctemplehighsmithabove17320u* (public domain); Joe Ravi, *Washington D.C. Temple At Dusk* (CC BY-SA 3.0); MamaGeek, *Festival of Lights* (CC BY-SA 4.0); and *Model of the Interior of the WashingtonDC LDS Temple* (CC0, author absent from dossier). Their actual Commons page links and credits are in the catalog fragment. The reference sheet, entrance photograph, dusk photograph and sectional model photograph were opened during authoring. All photographs remain in ignored scratch. This is an original texture-free procedural mesh, with no scanned/traced third-party geometry or photographic material in the GLB.

## Dimensions and geographic frame

| Measure | Model value | Basis |
| --- | ---: | --- |
| Highest point, including Moroni | 87.7824 m / 288 ft | Official published dimension |
| Moroni vertical envelope | 5.4864 m / 18 ft | Official published dimension; human form estimated |
| Main footprint envelope | about 76.2 × 41.5 m | OSM outline, including projecting corner bases |
| Main wall / roof | 40 m | Photo estimate; OSM's 44 m is not treated as survey evidence |
| Eastern central marble cap | 61 m | Photo estimate |
| Western central marble cap / spire tip | 59 / 81 m | Photo estimate |
| Eastern side caps / tips | 57 / 77.5 m | Photo estimate |
| Western side caps / tips | 55.5 / 75.5 m | Photo estimate |
| Gold needle base radius | 0.74 m | Photo estimate, long square/octagonal taper |
| Lower entrance pavilion / upper ring | 4.5 / 8.2 m | Mapped plans, estimated heights |
| Enclosed entrance link | 7 m wide, 4.4 m high | Estimated connector; no building way in dossier |

OSM has a conflicting tallest part at 100 m and other spires at 88 m. Those values are rejected for the published total height. Lesser tier heights remain estimates rather than uniformly scaling inconsistent OSM tags.

Origin `[-77.0656083, 39.014052]` is the main body's structural center, approximately the midpoint of its extrema. Units are real metres, +X east / +Y up / +Z south. Local y=0 is the rigid flat footing, with no sea level, DEM or Mercator stretch baked into the asset. The geometry uses the exact projected mapped outline and shaft polygons, so its rotation is already baked. Northern wall control points `[-77.0657512,39.0141925]` and `[-77.0654668,39.0141936]` establish an approximately 89.72° wall bearing / 359.72° outward frontage bearing. No additional runtime rotation is intended.

All 22 building / part ways in the dossier belonging to the temple and entrance pavilion are listed in `OSM_WAYS`; nested parts each retain their mapped authoring polygon, while replacement masks use the enclosing temple and pavilion outlines instead of redundant sub-4 m² spire masks. The unrelated industrial way 121679614 is excluded. A separately identified estimated ring owns only the enclosed connector between the two mapped buildings. Marble blades and portico fins stay within the provider's 0.8 m slack, asserted across every source vertex in both LODs. The authored envelope contains no landscaping, fountain, roadway or large site slab.

## Geometry and palettes

`geometry.js` uses `assetBuilder`, closed triangulated polygon shells and batched surfaces. Window panes replace wall patches, with stone divisions separating their vertical rows; they are not overlays on an opaque backing. All six shaft positions and their real diagonal planes come from mapped polygons. Each gold tip begins on its named marble cap. The upper pavilion is a true courtyard ring, with an exposed lower roof below the open center. Seven grade-supported front fins retain the distinctive entrance rhythm.

Near retains close folded marble flutes, tower joints, entrance bronze joints and a more faceted human form. Far uses wider folded marble flute spacing and simpler spire / statue segmentation, while preserving all tower tips, four rows per slit, the pavilion glazing, courtyard and connected passage. Repeated geometry is merged by material. The original Moroni representation has a robe, torso, head, raised forearm, trumpet and book; it is an approximate silhouette rather than a detailed copy of Fairbanks' sculpture.

The light palette uses subdued ivory marble, gray roof, muted pale glazing, bronze joints and warm gold. Gold uses the shared `lamp` material name to remain legible at night; entrance glazing uses `glow`. The dark palette dims the marble and roof while preserving warm entrance light and gold needles. Marble veins, inscriptions, detailed stained-glass designs, interior, seasonal lighting, trees and the fountain are omitted. Actual floodlighting is approximated by the theme colors, with no dynamic scene lights baked in.

## Reviewed facade relief fix

The independent b4b review found the original 0.34 m proud thin boxes unreadable on broad marble walls. Replaced the wall skin itself with a connected trapezoidal flute profile, calibrated against refs/1.jpg and refs/4.jpg: 0.50 m relief, roughly 0.7 m near pitch and 1.4 m far pitch on long faces. Flute slopes have subdued darker marble material `flute`, ensuring legibility under the shared material path. Faces partition the facade with no buried backing, stacked overlay or reciprocal depth cycle. Narrow four-row windows sit in profile valleys. Flute ends close at lintels and roof; small parapet teeth continue the crests.

Measured ray regressions require over 0.40 m relief and repeated raised blades in both LODs. Far coarser sampling changes the western extremum by 0.153 m, within a 0.25 m silhouette tolerance and the existing 0.8 m provider ownership slack; gold tips, Moroni, courtyard, grounded front fins and total height remain. Shaded side faces add one material draw, retaining ample budget headroom.

## Review-fix verification (2026-10-12)

Inspected exported GLB six-view near/light and far/light sheets plus far/dark facade, entrance and detail sheets in `tmp/top-cities/shots/washington-dc-temple/review-fix/`, named `washington-dc-temple-glb-<lod>-<theme>-sheet.jpg`. These are the first look-fix round after the independent b4b review; no app captures or runtime changes were made.

| LOD | Triangles | Draws | Bytes | KiB |
| --- | ---: | ---: | ---: | ---: |
| Near | 8,438 | 7 | 546,316 | 533.51 |
| Far | 5,262 | 6 | 355,788 | 347.45 |

The three owned landmark suites pass **17/17**; all nine owned registry conformance checks pass. The required combined run is **474/477**, with unrelated failures in the-alamo (stale GLB bounds), edificio-metropolis (catalog readiness) and high-museum-of-art (near triangle budget). Log: `tmp/top-cities/skyview-atlanta/review-fix-tests.log`. Deterministic metrics for all three: `tmp/top-cities/skyview-atlanta/review-fix-metrics.json`, all budgets clear and no QA issues. Depth table generation and `--check` pass, with **zero dropped cycle edges**. The initial catalog run was blocked by another worker's missing Edificio Metrópolis document; later `node scripts/asset-catalog.mjs`, `pnpm assets:check` and `pnpm assets:preview` were blocked by another worker's unregistered `/models/buildings/high-museum-of-art-far.glb`. No unrelated record was changed.

Cityscape and Full 3D world: the previous independent app review found FIX defects; these revised exports are **not tested in app yet**. The lead recaptures both modes and requests independent re-review. Provider lifecycle, regional-to-street transitions, DEM refinement and footing residuals remain separate integration gates. No app server, application bundle build, deployment or git write was performed.
