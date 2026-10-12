# Griffith Observatory

Original procedural Art Deco observatory, Los Angeles, 2800 East Observatory Road, as restored after the 2002–2006 expansion. Source: `src/peregrine/landmarks/top-cities/griffith-observatory/`. Three large copper domes, central octagonal green cupola, warm-white concrete wings with recessed bronze-grilled windows, stepped portal, rear promenade, and six-figure Astronomers Monument.

## Sources and frame

The [official restoration account](https://griffithobservatory.lacity.gov/about/observatory-history/renovation-and-expansion/renovation/) establishes cast-in-place concrete, Art Deco/Moderne/Greek vocabulary, warm-white coating, copper roofs, green octagonal cupola, bronze doors and iron window grilles. [West telescope](https://griffithobservatory.lacity.gov/exhibits/telescopes/coelostat-solar-telescopes/) publishes its 30 ft dome diameter. [Planetarium history](https://griffithobservatory.lacity.gov/about/observatory-history/about-the-samuel-oschin-planetarium/) publishes 75 ft for the internal projection dome, not the exterior. [Astronomers Monument](https://griffithobservatory.lacity.gov/exhibits/exterior-exhibits/astronomers-monument-sundial/) specifies six astronomers and approximately 35 ft of concrete. Identity and 1935 opening: [Wikipedia](https://en.wikipedia.org/wiki/Griffith_Observatory).

Mapped outer envelope: [OSM way 422130705](https://www.openstreetmap.org/way/422130705), supplied dossier dated 2026-10-12; exact replacement outline and id retained. The small northern outbuildings 481608931 and 422131197 are untouched. A supplemental building-part/monument query through the shared helper failed (fetch failed); no additional part geometry was obtained.

Origin `[-118.3003684, 34.1184]`: centre of the north portal. Real metres east/up/south; y=0 at north entrance footing. North cornice controls `[-118.300702,34.1184279] → [-118.3004807,34.1184277]` and `[-118.3002558,34.1184283] → [-118.3000571,34.1184286]` establish the nearly cardinal frontage. Mapped walls use coordinates directly; rotation is already baked. No terrain or absolute altitude is embedded.

| Dimension | Model | Basis |
| --- | --- | --- |
| Main footprint envelope | approximately 71.5 × 53.7 m | mapped OSM |
| West telescope dome diameter | 9.144 m (30 ft) | official; same size estimated for east dome |
| Exterior planetarium dome diameter | 24.8 m | photo estimate; interior 22.86 m is sourced |
| Highest roof above entrance | 23.2 m plus narrow seam relief | photo estimate; OSM 35.9 m has unspecified datum and is not adopted |
| Main wings / telescope drums | 7.8 / 9.85 m | photo estimates |
| Monument concrete / armillary top | 10.668 / 12.125 m | concrete height sourced, sphere estimated |
| South promenade step | 0.45 m | photo estimate |

## Model and approximations

Six merged material draws: concrete, terrace, subdued brown copper, greener patina, bronze and glow. Glow is muted glass by day and warm illuminated glazing at night. Main dome is behind the octagonal rotunda; two smaller closed telescope domes flank the north entrance. The entire mapped mass is preserved, including the south semicircular base. Windows are actual facade cutouts with recessed glass and jamb/sill/head closures in both LODs. Near adds bronze muntins and concrete horizontal courses; far retains the window bays, all four roof silhouettes and the monument.

Concrete silhouettes represent six robed astronomers rather than likenesses. Dome seam relief, roof parapets, portal trims, and pier proportions are simplified estimates. No underground exhibition floor, interiors, murals, landscaping, lawn surface, site hill, external access ramps or sign lettering is modeled. Monument position is estimated from the north-lawn photographs; its separate footprint covers the footing only. Entrance steps and cornices extend up to 1.5 m outside the provider ring, as shallow architectural trim rather than expanded building ownership.

Full 3D world has a proposed explicit median datum sampled at three north-entrance points, with bounded entrance and south-promenade aprons to prevent the lowest-slope disc problem. Structure stays rigid, both apron ground levels are y=0 and promenade paving is a 0.45 m step. No DEM residual or lattice-node coverage has been verified.

## Evidence

Reference-only dossier photographs: `tmp/top-cities/griffith-observatory/refs-sheet.jpg` and photos 1–5; title/author/license links are preserved in the catalog. The front dusk image (Pedro Szekely, CC BY-SA 2.0), hillside south image (dconvertini, CC BY-SA 2.0), promenade night image (Atomic Taco, CC BY-SA 2.0), historic monument image (Los Angeles Times, CC BY 4.0), and roof-to-lawn view (kl91711, CC BY 3.0) were compared. None is shipped as a model texture.

First procedural sheet: `tmp/top-cities/shots/griffith-observatory/griffith-observatory-procedural-near-light-sheet.jpg`, facade/rear/roof/entrance/detail/monument. It exposed missing horizontal concrete courses and south-base window rhythm; both were added. Depth analysis identified a concrete/glow cycle at the portal; the doorway was changed from an overlay into a real recess and its bronze frame embedded in the reveals.

Final exported contact sheet **looked at against the reference photographs**: `tmp/top-cities/shots/griffith-observatory/griffith-observatory-final-contact.jpg`. It places the dusk north reference and hillside reference beside exported near facade/rear/roof/entry/dome/monument, near dark facade, far light facade, and far dark facade/rear. Additional exported sheets: `griffith-observatory-glb-near-light-sheet.jpg`, `griffith-observatory-glb-near-dark-sheet.jpg`, `griffith-observatory-glb-far-light-sheet.jpg`, `griffith-observatory-glb-far-dark-sheet.jpg` in that same directory. Far keeps all four roof silhouettes and all separate windows; day/night glass changes remain coherent. No visible missing faces, floating structural parts or inside-out faces identified in this review. Telescope domes are smoother/simpler than their riveted originals, sculpture is schematic, and main dome color is a muted dark brown copper approximation.

Material ordering corrections also removed courses crossing windows, aligned pilasters between the actual bays, changed portal bronze frames to planar trim and omitted portal courses that intersected the trim. Final depth generation has **zero dropped cycle edges**; final `--ids griffith-observatory --check` passes. `qa-metrics.mjs --ids griffith-observatory --out tmp/top-cities/griffith-observatory/metrics.json` reports no issues, zero coplanar area, zero unresolved layered area, zero back-face hits, no removable attributes, and unchanged window rhythm.

| Export | Triangles | Draws | Bytes | KiB rounded |
| --- | --- | --- | --- | --- |
| near | 28,650 | 6 | 1,322,492 | 1,291 |
| far | 4,724 | 6 | 200,844 | 196 |

Bounds: near `[-36.506,0,-31.5]` to `[35.782,23.273,47.952]`; far identical except max y=23.200. Both satisfy building budgets with headroom.

Ten dedicated tests pass: telescope/main/cupola dimensions, north/south glazing by raycast, monument concrete height and six figures, armillary sphere, continuous stairs/landing, grade and horizontal envelope, grille endpoints against concrete surfaces with a deliberately shortened negative case, and far window/silhouette retention. The required combined command completed **401/403 tests passing**: all ten dedicated tests and all three Griffith conformance/export checks passed; unrelated `notre-dame-de-la-garde` and `att-stadium` catalog/spec status checks failed during concurrent work. Log: `tmp/top-cities/griffith-observatory/tests.log`.

Whole-catalog validation and `pnpm assets:preview` were attempted; both were blocked by another builder's missing `docs/3d-top-cities-att-stadium.md`. No shared file was edited to bypass this. Independent review is pending.

Cityscape: **not tested**. Full 3D world: **not tested**. Inspector images establish asset geometry only.

## Independent-review refinement — 2026-10-12

Uniform green major domes: warmed and darkened copper to brown (#66594c light, #443d36 dark); the small octagonal entrance cupola retains its existing green patina. Geometry, terrace placement and scene costs are unchanged.

Opened and judged `tmp/top-cities/shots/griffith-observatory/review-fix/griffith-observatory-glb-near-light-sheet.jpg` and the matching `-far-light-sheet.jpg` against the supplied dossier/reference and reviewer findings. This was one look-fix iteration. All 437 combined dedicated and top-cities conformance tests pass; catalog validation passes (266 entries / 488 GLB variants), and the five-asset depth generation/check passes with zero dropped cycle edges.

| LOD | Before triangles / draws / bytes | After triangles / draws / bytes |
| --- | --- | --- |
| near | 28,650 / 6 / 1,322,492 | 28,650 / 6 / 1,322,492 |
| far | 4,724 / 6 / 200,844 | 4,724 / 6 / 200,844 |

Both remain within building budgets. The reviewer found the pictured footing/provider replacement acceptable for Vulcan, Griffith and Notre-Dame; this worker made no terrain or footprint changes and captured no new app shots.

Post-refinement deterministic QA: **ok**, no reported issues; `tmp/top-cities/freedom-tower-miami/review-fix-qa.json`. The ignored local catalog and inspector preview rebuilt successfully with `pnpm assets:preview`.
