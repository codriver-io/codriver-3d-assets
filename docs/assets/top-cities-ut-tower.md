# University of Texas Tower — Austin, Texas

Original procedural model of Paul Philippe Cret’s 1937 Main Building at 110 Inner Campus Drive, with its limestone tower, four gilded clocks, colonnaded carillon and red tile Main Building roofs. This represents the historic exterior without the temporary scaffolding of the 2024–2027 restoration. Authoring date: 13 October 2026.

## Sources and dimensions

Started with `tmp/top-cities/ut-tower/{osm.txt,osm.json,facts.txt,refs-sheet.jpg}`. The six-photo reference sheet was inspected; no additional photographs, third-party meshes, textures or Overpass requests were used. The finished Texas State Capitol source and notes were studied for procedural construction and merged materials; its geometry was not copied.

Checked references:

- [UT Tower history](https://tower.utexas.edu/history/): Cret’s design, 1937 opening, Indiana limestone, Spanish red roof tiles, gold-leaf clock rims/hands and illumination history.
- [UT News, Dr. Battle’s Tower](https://news.utexas.edu/2025/12/11/dr-battles-tower/): 307-foot height, 59-foot-square shaft, 229 by 262-foot Main Building dimensions and clock faces more than twelve feet across; north-front courts and the south loggia.
- [UT lighting configurations](https://tower.utexas.edu/lightings/): everyday white lighting, orange-top football-win lighting and all-orange lighting for major achievements and celebrations. The dark palette deliberately depicts the all-orange configuration rather than the everyday white configuration.
- [Current restoration](https://tower.utexas.edu/restoration/): work began November 2024 and is expected through summer 2027; temporary works are omitted.
- [Main Building](https://en.wikipedia.org/wiki/Main_Building_(University_of_Texas_at_Austin)): address, identity, 27 floors and carillon.
- [OSM main outline](https://www.openstreetmap.org/way/27397894), plus the six mapped parts in the supplied extract.

| Feature | Model value | Basis |
| --- | --- | --- |
| Highest architectural point | 307 ft = 93.5736 m | UT published overall height; task’s 94 m is rounded |
| Upper shaft width/depth | 59 ft = 17.9832 m square | UT published shaft dimension |
| Main Building outer envelope | Approximately 73 × 82 m before rotation | OSM envelope including its eastern projection; published 229 × 262 ft is a different historic measurement envelope |
| Clock rim diameter | 3.92 m | Estimated; UT specifies more than 12 ft / 3.66 m |
| Lower wings / front attic roof | Walls 17 / 23.1 m; tile ridges 19.1 / 25.25 m | Photo estimate informed by four-storey mapped front part |
| Shaft cornice / clock centre | 72 / 77.4 m | Estimated; mapped parts identify 72 / 78 / 81 m stages |
| Colonnade / roof cap | Supports 81.3–90.8 m; final cap to 93.5736 m | Estimated intermediate proportions within published overall height |
| Repeated details | 20 shaft window rows, 3 columns per face; 12 unique belfry supports; 9 south arches | Photographic approximations, not surveyed counts |

## Frame and provider ownership

Real metres, +X east, +Y up, +Z south. Origin `[-97.7393684,30.2862733]` is the centre of the mapped upper-shaft quadrilateral. Local y=0 is the flat-map entrance grade. Terrain, absolute altitude, Mercator stretch and scene origin are not baked into the models.

The mapped control points `[-97.7392579,30.2861707]` and `[-97.7392393,30.2863577]` establish the approximately 4.9° northward building axis. Frontage is 184.9°, and a −4.9° Three.js Y rotation is baked once into every geometry. `ut-tower-plan.js` contains original mapped local metre rings before rotation. The exported top view was inspected against red footprint rings.

Replacement lists the main outline and **all six** overlapping tower/front-wing parts: ways 27397894, 516187631, 516187635, 1547914109, 1547914110, 1547914111 and 1547914112. Neighbouring Gebauer, Hogg, Flawn and other campus buildings are excluded. Tests independently check every actual vertex against the main mapped polygon, permitting less than 0.85 m of window/cornice relief. The narrow north courts remain open. A rigid median terrain pad follows the main envelope with four site references and a 12 m feather; this is authoring metadata, not verified terrain placement.

## Structure and approximation

The Main Building uses its mapped irregular envelope, tall reading-room windows, cornices and pilasters, a front attic with subdued ochre panels, separate tile hip roofs and an open nine-bay arched loggia. Entrance doors sit more than five metres behind the arches. Short entrance steps remain inside the mapped envelope; the South Mall’s extensive grounds/stairs, statues, trees and roads are excluded.

The narrow shaft has genuine individual window apertures, closed jamb reveals and recessed panes; near uses four panes per aperture, far one. All twenty rows survive in far. Stepped cornices and observation-gallery slots support the clock stage. Each of the four clocks has a circular pale face, gold rim, twelve index marks and two hands. The square carillon has twelve separate tapered columns around a recessed shadow core, with real depth between columns and backing. Column ends are tested against named horizontal podium and entablature triangles, excluding the columns themselves; a deliberately shortened free end fails the same assertion. A low tile cap is mostly hidden by the stepped stone crown.

Eight merged materials: limestone `stone`, floodlit tower `glow`, daytime dark/warm nighttime panes `light`, subdued red tile `roof`, dark carillon backing `shadow`, ochre attic `brick`, clock and alphabet `gold`, pale clock-face `lamp`. The non-emissive shadow core stays dark in both palettes and both LODs; the red tile roof cap is retained independently. Self-lit names follow the runtime contract. Orange night illumination is an artistic palette approximation, without optical light simulation or occupancy patterns. Fine reliefs, alphabet lettering, sculpture, baluster profiles, bells, clock numerals, window hardware and interiors are abbreviated or omitted. North-front details rely more on the mapped outline and UT’s description than the predominantly southern reference photos.

## Export costs and verification

Final exports use the normal repository command `pnpm build:top-cities-landmarks ut-tower --no-check`. Initial attempts were temporarily blocked by another builder’s missing `mucem-fort.js`; an isolated scratch copy of the same exporter enabled preliminary GLB inspection, then the normal exporter succeeded and overwrote both final GLBs. No shared authoring, exporter or renderer code was changed.

| LOD | Triangles | Draws | Bytes | KiB |
| --- | ---: | ---: | ---: | ---: |
| near | 14,270 | 8 | 810,860 | 791.9 |
| far | 8,214 | 8 | 457,996 | 447.3 |

Two look/fix rounds: the first source contact sheet revealed overlapping north book-stack window patterns, which were replaced with one coherent grid. Footprint testing found west-wing roof relief extending into the south forecourt, so that roof was narrowed into its owned envelope. The exported near/far/day/night reference comparison showed the belfry backing glowing like glazing; it was changed to a shadow material so the column gaps remain clear at night.

Inspected evidence: `tmp/top-cities/shots/ut-tower/first/ut-tower-procedural-near-light-sheet.jpg` and final `tmp/top-cities/shots/ut-tower/final/ut-tower-reference-export-comparison.jpg`, containing dossier reference photos alongside exported near/far overview, south facade, north, roof, entrance and crown by day, and overview/facade/crown in both LODs by night; the exported top view checks orientation/ownership. Separate GLB sheets and PNGs are in the same directory.

Eight landmark tests pass, pinning height and shaft width, four clock diameters/hands, all four open carillon fronts, nine arched recesses, window rhythm and LOD silhouette, named column contacts with a negative case, footprint containment and GLB/source/metrics/material round trips. Geometry QA at `tmp/top-cities/ut-tower/metrics.json` is clean: zero coplanar overlaps, zero unresolved layered faces, zero back-face hits, zero window-rhythm/member candidates and zero removable lift bytes. Depth regeneration and the selected check pass with zero cycles. Final combined focused run passes **626/626 tests** (`tmp/top-cities/ut-tower/final-tests.txt`); the selected UT run passes **11/11**, including the three registry conformance tests (`tmp/top-cities/ut-tower/selected-tests.txt`). Catalog validation passes with 336 entries and 646 GLB variants; `pnpm assets:preview` builds successfully. The earlier unrelated Washington National Cathedral far-byte-budget failure was absent from the final run.

Cityscape: **not tested yet; integration is checked separately**. Full 3D world: **not tested yet; integration is checked separately**. Inspector success does not establish these gates; no app server was launched.

## Reference photographs and rights

Photographs stay in ignored scratch; no image pixels or third-party mesh are shipped:

- Michael Barera, [University of Texas at Austin August 2019 39 (Main Building)](https://commons.wikimedia.org/wiki/File:University_of_Texas_at_Austin_August_2019_39_(Main_Building).jpg), CC BY-SA 4.0 — distant silhouette.
- Guðsþegn, [UT Tower – Main Building](https://commons.wikimedia.org/wiki/File:UT_Tower_-_Main_Building.JPG), CC BY-SA 3.0 — south front/crown.
- Guðsþegn, [UT Main Building Burnt Orange 03](https://commons.wikimedia.org/wiki/File:UT_Main_Building_Burnt_Orange_03.JPG), CC BY-SA 3.0 — celebration illumination.
- Kurt Kaiser, [University of Texas Main Building Tower 3](https://commons.wikimedia.org/wiki/File:University_of_Texas_Main_Building_Tower_3.jpg), CC0 — tower lighting/silhouette.
- RG2 / Rebelguys2, [Main Building at The University of Texas at Austin](https://commons.wikimedia.org/wiki/File:Main_Building_at_The_University_of_Texas_at_Austin.jpg), CC BY-SA 3.0 migrated — attic panels/pilasters.
- RG2, *The University of Texas Life Science Library*, CC BY-SA 3.0 per dossier — interior tile seen on the supplied sheet; not used to author this exterior, no interior retained in the model.

External file-page licences were checked for the five exterior references. Geometry is original procedural work for Codriver. Geographic data © OpenStreetMap contributors, ODbL 1.0; https://www.openstreetmap.org/copyright.

## Independent review correction (2026-10-13)

Review `tmp/next-200/review/b11a/REVIEW.md` identified red carillon infill at the recessed 5.3 m core. The core now uses a separate non-emissive `shadow` material (`#292c2b` day, `#171c1d` night) in both LODs. Its 8.6 m height, 5.3 m plan, setback and open column gaps are unchanged; the roof cap keeps `roof`. Rays through all four crown fronts pin the shadow material, recess depth and separate shafts, and a roof ray pins the red cap. No provider envelope or placement change was needed.

Fresh exported evidence personally inspected: `tmp/top-cities/shots/ut-tower/review-fix/export-review.jpg`, assembled from four GLB contact sheets. Near day includes overview, facade, opposite north, roof, entrance and crown; far day and both night LODs include overview and crown. The crown reads as dark open bays with distinct pale/orange columns and a red tile cap. One export look iteration was used for this correction.

Near/far triangles remain 14,270 / 8,214; draws increase 7 / 7 → 8 / 8; bytes increase 809,852 / 456,988 → 810,860 / 457,996. Both remain within budget; far now uses the eight-draw cap. The combined landmark/conformance run passed 638 tests, zero failures (`tmp/top-cities/place-de-la-concorde-obelisk/review-fix-tests.log`). Catalog validation passed 336 entries / 658 variants; local preview built; selected depth regeneration/check reports zero cycles.

The independent reviewer observed a seated unobstructed frontage in both previous app modes. Cityscape after this correction: **not tested**. Full 3D world after this correction: **not tested**. The lead recaptures the app and requests independent re-review; exported-sheet success establishes the material correction, not current runtime acceptance.
