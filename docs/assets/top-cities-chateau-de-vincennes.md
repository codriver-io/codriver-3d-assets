# Château de Vincennes — Vincennes, France

Original procedural model of the present-day royal fortress: square donjon, its separate walled enclosure with a covered wall-walk, at-grade dry moats, rectangular outer curtain, nine perimeter gate/corner towers, Sainte-Chapelle and the palace/service wings. The eight truncated outer towers are deliberately low; the Tour du Village remains tall. No third-party mesh, scan, texture or photograph is embedded.

## Sources and dimensions

The supplied dossier (`tmp/top-cities/chateau-de-vincennes/`) contains OSM footprints, Wikipedia facts and six Commons references. The [CMN history](https://www.chateau-de-vincennes.fr/en/discover/history-of-the-chateau-de-vincennes) establishes the medieval donjon/chapel and later palace ensemble. [OSM keep](https://www.openstreetmap.org/way/83817983), [gate](https://www.openstreetmap.org/way/110188224) and LiDAR-derived chapel/palace parts provide mapped positions and heights. The expanded shared Overpass request did not answer promptly, so a single OSM API map extract supplied the perimeter tower and scarp plans; retained in the ignored dossier.

| Feature | Value | Basis |
| --- | ---: | --- |
| Donjon height | 52 m | OSM height and published CMN description |
| Keep square core / corner diameter | 16.5 / 6.6 m | Published dimensions; photographed massing, adjusted within mapped ring |
| Keep enceinte | about 55 × 54 m, wall 11.5 m | Mapped outline and published wall height; covered wall-walk eave 12.6 m on parapet piers and ridge about 14 m estimated from the reference photo |
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

Provider replacement rings name each modeled building and overhanging part, including chapel pinnacles, palace roofs, keep galleries and portico. Small pinnacle parts are covered by the chapel outline; broad replacement over empty courtyard/moat is avoided. The moat and curtain walls extend beyond building masks by design: they are landscape/boundary structures, not provider building replacements. Nearby houses and Fort Neuf are not owned. The long walls are simplified between mapped controls. Both dry moats are drawn at grade over their mapped areas (ways 138303744 and 138576131, the latter minus the enceinte): a dark surface 0.15 m above y=0, edged by a 0.8 m counterscarp parapet whose footing reaches y=-0.3 m; walls, towers and the enceinte form the inner scarp. Nothing else lies below y=0. No host terrain cut is requested.

Five merged near materials: pale weathered limestone (`stone`), small dressed trim, dark slate roof, dark window glass and subdued moat surface. Dark palette dims all surfaces; no invented night lighting. The near keep has circular corner turrets, cornice bands, corbels, narrow separate windows and a low slate cap within the parapet. Chapel sides retain individual pointed bays, staged buttresses, conical pinnacles, polygonal apse, a north oratory and nested west-front gables with rose tracery. The western gable is stone, not a slate triangle. Both outer gates keep a genuine through-passage. Six portico columns support a lintel and roof. Far preserves all main volumes, round turrets, gate openings, window rows, chapel buttresses and the wall-walk piers (5 m rhythm instead of 2.5 m), while dropping tracery, dormers and tiny corbels.

Approximations: no individual statues, Gothic crockets, interior, masonry texture, drawbridge mechanism or full restoration-grade tracery. Pavilion and barrack roofs use continuous pitched slate forms rather than every historical mansard break. Ridges are photo estimates up to 34.7 m, raised from the former shallow caps to maintain at least 45-degree side pitches. This intentionally prioritizes a clear roof silhouette over the previous OSM roof-height approximation. The moat is an at-grade reading only: ditch depth, scarp walls and the two gate bridges are not modeled, and the dark surface continues beneath the bridge positions where the parapet opens.

## Review fixes (g16ar)

The white keep-side block was Châtelet relation 1559341. Exact outer ways **83815599 / 110191518** now form a joined replacement ring, including the porch omitted by the three small building-part rings; paired porch turrets, supported lintel and slate cap replace it. The apparent north-curtain provider strips were ways **110191516 / 110188220**; these now have exact ownership and low barrack solids. Previously omitted gate and queen-roof parts are also enumerated. Neighbouring houses remain provider-owned.

The combined barrack block now has three separate steep gabled roofs from mapped parts 1458508973–1458508975. Palace/service roofs have pitched ridges and steep sides instead of broad dark plateaux. Below-grade moat floors and scarps reach -2.9 m; the dark grade mouth is deliberate where flat/uncut host ground hides excavation. Far scarp heads are recessed, removing the stone/moat layered-face flag. (Moat superseded by the 2026-10-21 fixes below.)

## Review fixes (2026-10-21)

Five findings were measured on the exported GLBs before and after the fix (scratch scripts and sheets in `/tmp/landmark-fixes/vincennes/`, not retained).

- **Roof shading.** `hip()` and the chapel roof shared vertices between slopes and the closing base, so averaged normals pointed eaves downward: 341 of 601 upward near roof triangles (125 of 289 far) had a vertex normal more than 60° off the face. `faces()` is now flat-shaded and bases are kept only where an eave overhangs open space (galleries, châtelet, porch, oratory, dormers, portico, chapel). Now 0 of 601 near and 0 of 289 far. Dropping the hidden wing-roof bases also cleared the near stone-on-roof layered/coplanar flags at the dormers.
- **Ridge axis.** `hip()` always ran its ridge along Z. The 55 × 2.8 m north/south keep galleries had a 0.8 m ridge across the gallery, the Tour du Bois (21 × 11 m) a 7 m ridge and the portico (23.7 × 6.2 m) a 2.2 m ridge, all across the short side. The ridge now follows the long side, and `hip()` takes an optional yaw. Gallery ridges now run along each gallery: 49–53 m on the north, south and west galleries and 18 m on each east segment. The Tour du Bois ridge is 17 m and the portico ridge 19.7 m, both along X. The other callers are unchanged because their footprints are square or long in Z.
- **Floating gallery roofs.** The 12.6 m eaves sat 1.1 m above the 11.5 m mapped wall. Near-only merlons carried only the north and south galleries. The west and east roofs had 52.5 m and 17 m unsupported runs, and in far all four floated. The old north gallery was axis-aligned while the mapped wall is skewed, so at its west end it sat entirely off the wall, over the moat. The galleries now follow the mapped wall midline, and the corner turrets now sit on the wall corners. In both LODs the roofs stand on parapet piers from the wall top to the eave, at 2.5 m spacing in near and 5 m in far. The longest open bay is 1.75 m in near and 3.5 m in far, except the north end of the east gallery, which runs into the châtelet block. The reference photo shows the slate wall-walk roof over the crenellated parapet.
- **Moat.** An opaque, upward-facing plane 2 cm above grade covered the 2.9 m-deep floor and all but 0.28 m of the near scarps. The far scarps were entirely hidden. The 15 m and 9 m strips were centred on every mapped edge, so they spilled into the courtyard and left gaps mid-moat. In both LODs, `simplify()` of the closed ring also dropped the south-west outer corner, cutting 6,300 m². All below-grade geometry is removed. The mapped moat areas are now filled at y=+0.15 m with the parapet described above, and minY rises from −2.9 to −0.3 m. Near moat/stone triangles drop from 868 + 5,208 to 229 + 516.

- **Far barracks cap.** The far `solid()` simplification tested each vertex against its neighbours round by round. That eroded the rounded inner corner of the L-shaped north barracks (way 110188220) into a chord: a 1,310 m² roof-cap triangle across the courtyard at 7.8 m. That ring's area grew from 2,579 to 4,154 m², a 19.6 m deviation, and way 110191516 deviated by 2.3 m. Far now uses a Douglas–Peucker ring simplification that keeps every mapped vertex within 0.35 m of the outline (worst ring 0.34 m). The far barracks cap area now equals near at 4,123 m² (it was 5,767 m²), and the largest far stone triangle falls from 1,310 to 1,017 m², a wing cap inside its own footprint.

Cityscape and Full 3D world: **not re-tested** after these fixes; the app captures below predate them. Not addressed, pre-existing: far `layeredFaces` reports 581 m² of chapel glass-on-stone (586 m² before).

## Verification

| Export | Triangles | Draws | Bytes | KiB |
| --- | ---: | ---: | ---: | ---: |
| Near | 12,661 | 5 | 584,488 | 570.8 |
| Far | 6,944 | 4 | 318,332 | 310.9 |

Costs are the 2026-10-21 rebuild as printed by the build (before license stamping). All exports fit the building limits. The remaining paragraphs describe the g16ar round. Focused tests for these two landmarks: **24/24 pass**, including roof slopes, moat floor, longitudinal chapel ridge/apse, open courts, far window rhythm, gate/portico support contacts and grade-level basins; no test asserts `SPEC.ready`. Final mechanical metrics have no issue flags, and generated depth ordering has zero dropped material-cycle edges. Logs and full metrics: `tmp/top-cities/chateau-de-vincennes/review-fix/`.

Exported sheets were inspected in two fix iterations: `tmp/top-cities/shots/chateau-de-vincennes/review-fix-near/` (near/light, before final refinements) and `review-fix-far/` (final far/dark). Final near appearance is checked in the app captures. No further look-fix iteration was taken.

Cityscape: **visual placement verified** in the scratch app (Protomaps/OSM tile provider), with far/near/street captures at `tmp/top-cities/chateau-de-vincennes/review-fix/final-app/city/`. Full 3D world: **visual placement verified**, equivalent captures at `final-app/world/`. Scratch bundle built in `/tmp`, on reserved slot J (3306/3308); shared `public/peregrine.js` was not rebuilt. These captures check shared shading, visible replacement and gross footing, not DEM arrival/refinement, transition/lifecycle or hardware performance; those remain **not tested**. No terrain excavation is claimed. Independent re-review remains required.

Catalog validation, `pnpm assets:check`, and `pnpm assets:preview`: **pass**, 425 records / 832 GLB variants at check time. Full unfiltered conformance run: **883/887 pass**; unrelated union-station-kansas-city and marche-atwater ready/catalog mismatches, pavillon-roger-gaudry far triangle budget, and a stale Versailles source/GLB bounds comparison because the process imported its pre-basin source before the final export. Fresh final conformance restricted to the two assigned IDs: **6/6 pass**, superseding that stale comparison.

Subsequent global catalog/preview retries encountered another worker’s unfinished `tour-1000-de-la-gauchetiere` export/doc after the successful 425-record pass; these unrelated files were not changed. Final app comparison: `tmp/top-cities/chateau-de-vincennes/review-fix/final-app-sheet.jpg`.
