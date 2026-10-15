# Château de Vincennes — Vincennes, France

Original procedural model of the present-day royal fortress: square donjon, its separate walled enclosure, dry-moat outline, rectangular outer curtain, nine perimeter gate/corner towers, Sainte-Chapelle and the palace/service wings. The eight truncated outer towers are deliberately low; the Tour du Village remains tall. No third-party mesh, scan, texture or photograph is embedded.

## Sources and dimensions

The supplied dossier (`tmp/top-cities/chateau-de-vincennes/`) contains OSM footprints, Wikipedia facts and six Commons references. The [CMN history](https://www.chateau-de-vincennes.fr/en/discover/history-of-the-chateau-de-vincennes) establishes the medieval donjon/chapel and later palace ensemble. [OSM keep](https://www.openstreetmap.org/way/83817983), [gate](https://www.openstreetmap.org/way/110188224) and LiDAR-derived chapel/palace parts provide mapped positions and heights. The expanded shared Overpass request did not answer promptly, so a single OSM API map extract supplied the perimeter tower and scarp plans; retained in the ignored dossier.

| Feature | Value | Basis |
| --- | ---: | --- |
| Donjon height | 52 m | OSM height and published CMN description |
| Keep square core / corner diameter | 16.5 / 6.6 m | Published dimensions; photographed massing, adjusted within mapped ring |
| Keep enceinte | about 55 × 54 m, wall 11.5 m | Mapped outline and published wall height; roof ridge about 14 m estimated |
| Enclosure | about 175 × 340 m between tower centres | Mapped tower corners; published 330 × 175 m excludes tower projections |
| Tour du Village | 34 m | OSM `height=34`, modern standing height |
| Main axis / chapel axis | bearings 7.5° / 91° | Mapped northern tower corner controls and chapel roof edge |
| Chapel ridge | 38.8 m | OSM way 1457750846, IGN LiDAR HD height/roof tags |
| Chapel buttress pinnacles / west turrets | 30.4 / 37.2 m | Mapped chapel part heights |
| Palace roofs | OSM 29.7 / 25.6 m; authored up to 34.7 m | OSM eaves retained; revised steep roof ridges are visual estimates |
| Cornices, windows, buttresses and roof subdivisions | estimated | Photos; not a measured conservation survey |

Reference photographs: DXR, *Sainte Chapelle, Vincennes, South-West View 140308 1* and chapel interior (CC BY-SA 3.0); Chabe01, *Sainte Chapelle Château Vincennes ... 17* and two interior views (CC BY-SA 4.0); Selbymay, *Vincennes - Chateau 02* (CC BY-SA 3.0). Additional plan: Chabe01, *Plan Château de Vincennes - 2021.svg* (CC BY-SA 4.0); gate: Thesupermat, *Vincennes - Tour du village - PA00079920 - 012* (CC BY-SA 3.0). Exact Commons source links are in the catalog. References were inspected and stay only in ignored scratch.

## Frame, ownership and construction

Origin `[2.43583, 48.84278]`; metres east/up/south; y=0 is courtyard grade. The fortress's −7.5° rotation is baked into vertices once. Two northern tower corners provide the enclosure bearing; the chapel keeps its own mapped bearing. `chateau-de-vincennes-plan.js` contains editable OSM-derived plan literals; generators import only Three.js and the public assetBuilder.

Provider replacement rings name each modeled building and overhanging part, including chapel pinnacles, palace roofs, keep galleries and portico. Small pinnacle parts are covered by the chapel outline; broad replacement over empty courtyard/moat is avoided. The moat and curtain walls extend beyond building masks by design: they are landscape/boundary structures, not provider building replacements. Nearby houses and Fort Neuf are not owned. The long walls and scarp bands are simplified between mapped controls. Moat geometry descends 2.9 m below grade; a dark surface mouth remains where host ground occludes the ditch. No host terrain cut is requested.

Five merged near materials: pale weathered limestone (`stone`), small dressed trim, dark slate roof, dark window glass and subdued moat floor. Dark palette dims all surfaces; no invented night lighting. The near keep has circular corner turrets, cornice bands, corbels, narrow separate windows and a low slate cap within the parapet. Chapel sides retain individual pointed bays, staged buttresses, conical pinnacles, polygonal apse, a north oratory and nested west-front gables with rose tracery. The western gable is stone, not a slate triangle. Both outer gates keep a genuine through-passage. Six portico columns support a lintel and roof. Far preserves all main volumes, round turrets, gate openings, window rows and chapel buttresses, while dropping tracery, dormers, tiny corbels and minor scarp articulation.

Approximations: no individual statues, Gothic crockets, interior, masonry texture, drawbridge mechanism or full restoration-grade tracery. Pavilion and barrack roofs use continuous pitched slate forms rather than every historical mansard break. Ridges are photo estimates up to 34.7 m, raised from the former shallow caps to maintain at least 45-degree side pitches. This intentionally prioritizes a clear roof silhouette over the previous OSM roof-height approximation. The moat has a 2.9 m below-grade floor/scarp; flat Cityscape and the uncut terrain hide it, so the dark grade mouth is the supported fallback.

## Review fixes (g16ar)

The white keep-side block was Châtelet relation 1559341. Exact outer ways **83815599 / 110191518** now form a joined replacement ring, including the porch omitted by the three small building-part rings; paired porch turrets, supported lintel and slate cap replace it. The apparent north-curtain provider strips were ways **110191516 / 110188220**; these now have exact ownership and low barrack solids. Previously omitted gate and queen-roof parts are also enumerated. Neighbouring houses remain provider-owned.

The combined barrack block now has three separate steep gabled roofs from mapped parts 1458508973–1458508975. Palace/service roofs have pitched ridges and steep sides instead of broad dark plateaux. Below-grade moat floors and scarps reach -2.9 m; the dark grade mouth is deliberate where flat/uncut host ground hides excavation. Far scarp heads are recessed, removing the stone/moat layered-face flag.

## Verification

| Export | Triangles | Draws | Bytes | KiB |
| --- | ---: | ---: | ---: | ---: |
| Near | 17,644 | 5 | 842,116 | 822.4 |
| Far | 7,392 | 4 | 336,948 | 329.1 |

All exports fit the building limits. Focused tests for these two landmarks: **24/24 pass**, including roof slopes, moat floor, longitudinal chapel ridge/apse, open courts, far window rhythm, gate/portico support contacts and grade-level basins; no test asserts `SPEC.ready`. Final mechanical metrics have no issue flags, and generated depth ordering has zero dropped material-cycle edges. Logs and full metrics: `tmp/top-cities/chateau-de-vincennes/review-fix/`.

Exported sheets were inspected in two fix iterations: `tmp/top-cities/shots/chateau-de-vincennes/review-fix-near/` (near/light, before final refinements) and `review-fix-far/` (final far/dark). Final near appearance is checked in the app captures. No further look-fix iteration was taken.

Cityscape: **visual placement verified** in the scratch app (Protomaps/OSM tile provider), with far/near/street captures at `tmp/top-cities/chateau-de-vincennes/review-fix/final-app/city/`. Full 3D world: **visual placement verified**, equivalent captures at `final-app/world/`. Scratch bundle built in `/tmp`, on reserved slot J (3306/3308); shared `public/peregrine.js` was not rebuilt. These captures check shared shading, visible replacement and gross footing, not DEM arrival/refinement, transition/lifecycle or hardware performance; those remain **not tested**. No terrain excavation is claimed. Independent re-review remains required.

Catalog validation, `pnpm assets:check`, and `pnpm assets:preview`: **pass**, 425 records / 832 GLB variants at check time. Full unfiltered conformance run: **883/887 pass**; unrelated union-station-kansas-city and marche-atwater ready/catalog mismatches, pavillon-roger-gaudry far triangle budget, and a stale Versailles source/GLB bounds comparison because the process imported its pre-basin source before the final export. Fresh final conformance restricted to the two assigned IDs: **6/6 pass**, superseding that stale comparison.

Subsequent global catalog/preview retries encountered another worker’s unfinished `tour-1000-de-la-gauchetiere` export/doc after the successful 425-record pass; these unrelated files were not changed. Final app comparison: `tmp/top-cities/chateau-de-vincennes/review-fix/final-app-sheet.jpg`.
