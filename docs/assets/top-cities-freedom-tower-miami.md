# Freedom Tower, Miami

Original texture-free procedural exterior of the 1925 Schultze & Weaver building at 600 Biscayne Boulevard, now Miami Dade College's Freedom Tower museum. This is Miami's Spanish Renaissance Revival tower inspired by the Giralda, with yellow cream stucco, an elaborate square stone crown, slender octagonal belvedere, copper dome and beacon, a three-storey printing-house podium and red-tiled raised roof wings. The east entrance has paired engaged columns, a broken scroll pediment and geometric medallions. Sculpture, heraldry and fine lettering are simplified or omitted.

Sources checked 2026-10-12:

- [MDC official museum](https://freedomtower.mdc.edu/about/): identity and present-day museum use; the restored building reopened after its centennial renovation.
- [Wikipedia](https://en.wikipedia.org/wiki/Freedom_Tower_(Miami)): 1925 construction, Schultze & Weaver, Giralda precedent and nominal 255 ft / 78 m height.
- [OSM outer way 290629021](https://www.openstreetmap.org/way/290629021): geographic envelope; dossier `tmp/top-cities/freedom-tower-miami/osm.json` contains all eight nested parts.
- [Southeast view, DXR](https://commons.wikimedia.org/wiki/File:Freedom_Tower,_Miami,_Southeast_view_20160709_1.jpg), CC BY-SA 4.0: whole-building proportions and shaft window rows.
- [Cupola detail, Radomianin](https://commons.wikimedia.org/wiki/File:Freedom_Tower_Miami_(top),_NE_view.jpg), photograph CC BY-SA 4.0: tier proportions, pinnacles, arched niches and dome. The dossier incorrectly called the photograph public domain; that declaration applies to the architectural object only.
- [Wing and portal, Phillip Pessar](https://commons.wikimedia.org/wiki/File:Freedom_Tower_Downtown_Miami_(38075844515).jpg), CC BY 2.0: entrance silhouette and low wings.

Only original Three.js geometry ships; references stay in ignored scratch. Source/code and model licensing follow the repository's MIT / CC BY 4.0 pipeline, with separate OSM contributor credit and ODbL geographic attribution. The model captures the established exterior, using pre-renovation reference photographs; it is not a measured restoration survey.

| Dimension | Model | Basis |
| --- | --- | --- |
| Overall height | 78 m including finial | Published nominal 255 ft; inconsistent OSM overall 84.5 m is not adopted |
| Provider outer envelope | about 54 × 38 m | Mapped OSM polygon, all jogs retained |
| Shaft plan | 12 × 13.4 m | Mapped tower part 1105391705, rounded for clean facade rhythm |
| Shaft cornice | 53.3 m | Photo estimate; conflicting OSM part heights not treated as surveyed |
| Square crown cap | 61 m | Photo estimate |
| Belvedere body | 62.05–70.15 m | Photo estimate; octagonal 7.44 m across corners |
| Dome | 71.58–74.5 m | Photo estimate; 6.3 m base diameter |
| Lantern / finial | 74.5–78 m | Photo estimate |
| Podium cornice | 17.6 m | Photo estimate; three visible storeys |

The frame is east/up/south in real metres. Origin `[-80.189510,25.780299]` anchors the tower; y=0 is rigid local grade. No DEM, sea level or Mercator stretch is baked in. The main outline's north edge uses controls `[-80.1899850,25.7804421]` and `[-80.1895812,25.7804505]`; its eastward vector trends north by 1.33 degrees, baked into every authored component. The east street facade therefore faces 88.67 degrees. The provider outline owns all nested parts: 290629021, 1105391703, 1105391704, 1548989032, 1105391705, 1105391706, 1105391707, 1548934816 and 1548934817. Tiny dome/finial rings are covered by the outer envelope rather than separately masking sub-4 m² polygons. Cornices and the east portal project at most about 1.5 m beyond the mapped wall edge; no adjacent building or road is owned.

Seven merged named materials serve both LODs. Near has punched wall apertures with inset glass and narrow mullions; far retains every shaft row/bay, crown arch and tier while dropping aperture returns and most small ornament. The belvedere's tall recesses are cream architectural niches with small upper portholes, not black full-height glazing. Night uses a dimmer body and warm floodlit cupola (`lamp`); temporary red event lighting is omitted. These are inspector palettes; shared runtime shading awaits app QA.

The first procedural sheet revealed a plain entrance pediment and overly dark belvedere slots. The revised model adds scrolls, relief medallions and attached crown corner turrets, and backs the belvedere niches with stone. Roof intersections caught by depth analysis were removed by dividing the T-shaped tile roof into adjacent non-overlapping sections. Ground-facing duplicate surfaces were removed to resolve stone/stucco ordering.

Verification evidence and final metrics are recorded below after export. Cityscape: **not tested**. Full 3D world: **not tested**. Lead-owned app bundle, provider replacement, terrain footing/pad checks and independent visual review remain separate release gates. No app server, git mutation or online deployment was performed by this builder.

Final export verification (2026-10-12):

| LOD | Triangles | Draws | Bytes | KiB |
| --- | ---: | ---: | ---: | ---: |
| Near | 24,385 | 7 | 1,029,328 | 1,005.3 |
| Far | 8,039 | 7 | 368,668 | 293.6 |

Both bounds are identical: `[-48.1134,0,-18.8391]` to `[8.0362,78,20.2260]`. Exports have no texture, decoder or unused bridgeLift payload. Deterministic QA reports zero issues, zero coplanar overlap area, zero unresolved layered surfaces, no window-rhythm warning, and 0% near outside-in backface hits. Depth regeneration reports zero dropped cycle edges; `--check` passes. Beacon posts have tests against their named lower iron collar and upper copper roof, excluding post faces; a deliberately shortened top fails the contact assertion. Local tests also pin height, mapped ownership, grade, exact near/far bounds, all eleven shaft window rows and the central crown arches.

Looked at `tmp/top-cities/freedom-tower-miami/refs-sheet.jpg`, then `tmp/top-cities/shots/freedom-tower-miami/freedom-tower-miami-procedural-near-light-sheet.jpg`. Final exported GLB evidence inspected in that same shots folder:

- `freedom-tower-miami-glb-near-light-sheet.jpg`
- `freedom-tower-miami-glb-far-light-sheet.jpg`
- `freedom-tower-miami-glb-near-dark-sheet.jpg`
- `freedom-tower-miami-glb-far-dark-sheet.jpg`
- `freedom-tower-miami-reference-comparison.jpg` places two actual reference photos beside near/far facade, back, roof, entrance and cupola tiles in light/dark themes.

Each LOD/theme sheet shows overview, east facade, opposite facade, roof, street entrance, cupola detail and plan. The window rhythm and silhouette survive far; dome ribs, small mullions, facade frames and aperture returns simplify. Portal and crown relief remain architectural approximations rather than a close-range carving reproduction. The roof is partitioned into adjacent low hip sections to avoid intersecting material layers.

The requested combined node tests passed **391/391**, including all seven Freedom Tower conformance/identity tests. `node scripts/asset-catalog.mjs` passed (266 entries / 464 variants at that checkpoint). Standard targeted export was initially blocked by another builder's missing Texas Capitol helper; an ignored isolated copy of the standard exporter produced valid outputs, and the normal `pnpm build:top-cities-landmarks freedom-tower-miami --no-check` subsequently passed with identical metrics. `pnpm assets:preview` was attempted but hit another in-progress asset: unregistered `texas-state-capitol-far.glb`; no other landmark was changed. Independent review and both app modes remain lead-owned and untested.

## Independent-review refinement — 2026-10-12

Sparse Giralda crown relief: added grouped panels and medallions below the side arches, stepped pilaster capitals, lower crown cornice, and belvedere foot/capital profiles in the existing stone/lamp batches. Coarse panels and stepped profiles remain in far; cupola tier heights and the 78 m top are unchanged.

Opened and judged `tmp/top-cities/shots/freedom-tower-miami/review-fix/freedom-tower-miami-glb-near-light-sheet.jpg` and the matching `-far-light-sheet.jpg` against the supplied dossier/reference and reviewer findings. This was one look-fix iteration. All 437 combined dedicated and top-cities conformance tests pass; catalog validation passes (266 entries / 488 GLB variants), and the five-asset depth generation/check passes with zero dropped cycle edges.

| LOD | Before triangles / draws / bytes | After triangles / draws / bytes |
| --- | --- | --- |
| near | 22,453 / 7 / 952,648 | 24,385 / 7 / 1,029,328 |
| far | 6,779 / 7 / 300,624 | 8,039 / 7 / 368,668 |

Both remain within building budgets. The reviewer found the pictured footing/provider replacement acceptable for Vulcan, Griffith and Notre-Dame; this worker made no terrain or footprint changes and captured no new app shots.

Post-refinement deterministic QA: **ok**, no reported issues; `tmp/top-cities/freedom-tower-miami/review-fix-qa.json`. The ignored local catalog and inspector preview rebuilt successfully with `pnpm assets:preview`.
