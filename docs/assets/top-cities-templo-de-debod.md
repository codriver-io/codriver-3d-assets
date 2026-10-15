# Templo de Debod — Madrid

Original procedural model of the reconstructed Egyptian temple in Parque de la Montaña / Parque del Oeste, Madrid. The identifiable sequence is the low honey sandstone sanctuary, its cavetto cornice and four upper facade openings, followed east-northeast by two freestanding open gateways, all on a stone island surrounded by a shallow rectangular pool. This represents the Madrid reconstruction, not a reconstruction of the complete original Nubian temple.

## Evidence and dimensions

The dossier was read first: `tmp/top-cities/templo-de-debod/{facts.txt,osm.txt,osm.json,refs-sheet.jpg}`. Additional exact relation member geometry is retained in `outline.json`, obtained through the shared Overpass helper. The supplied exterior photographs 1–5 and interior reference 6 were inspected in the supplied sheet; exterior 4 was also inspected at full size. No reference photograph or texture is shipped.

[Official Madrid tourism](https://www.esmadrid.com/en/tourist-information/temple-debod) and [Wikipedia](https://en.wikipedia.org/wiki/Temple_of_Debod) establish the early second-century BC origin, donation in 1968, reconstruction in 1970–1972 and opening in 1972. Wikipedia describes a 12 × 15 m ancient temple core; this is not the current complete outer enclosure. The dossier's 2026 exterior photographs show the basin drained. The authored version shows the familiar filled reflecting pool requested in the task; it does not claim a live water condition.

| Quantity | Model | Basis |
| --- | ---: | --- |
| Origin | −3.71778, 40.42405 | Supplied geographic anchor, near sanctuary |
| Reconstructed sanctuary enclosure | about 19.9 × 12.6 m | OSM relation 6432785 outer way 37055943 |
| South annex | 4.4 × 5.87 m | Same OSM stepped outline |
| Processional bearing | 77.5° | Two gate centers and sanctuary edge control points |
| Inner / outer gateway station | 38.77 / 59.13 m | OSM ways 49135021 / 49135022, origin-relative rotated frame |
| Gateway width / thickness | 3.58 / 2.40 m; 3.94 / 3.06 m | Mapped transverse and axial dimensions |
| Gateway height above island | 6.2 / 6.5 m | Review/photo estimate; intentionally supersedes the low OSM height=5 |
| Sanctuary apex above basin | 6.52 m | Photo estimate; 12 m stub was inconsistent with mapped gate heights and photos |
| Island / basin | 73 × 22 / 84 × 34 m, plus a 2 m esplanade | Estimated bounded site envelope; not a surveyed pool outline |
| Basin / island datum | 0 / 0.50 m | Estimated local site construction, no absolute altitude |

Coordinates are real metres east/up/south. `plan(u,y,v)` bakes a 0.2176 rad rotation: +u follows the ENE processional axis and +v points toward the south side. Rotation must not be reapplied by the host. Structural heights do not include terrain or Mercator stretch.

## Authoring and ownership

`geometry.js` uses merged named-material geometry only. Near masonry has fine block courses and small beveled course joints; far uses larger solid course cells. A restrained unified sandstone material, flat roof, curved-section Egyptian cornices, flared capitals and genuine portal/pronaos voids remain in both LODs. Capitals, jambs and lintels connect; no black rectangle substitutes for the detached gate openings. Interior walls and bronze door are schematic; hieroglyphs, reliefs, original lost pronaos, trees, people and railings are omitted. Stone weathering is deliberately restrained and all surfaces are texture-free. The reflecting water is an opaque matte surface, not an optical reflection simulation. Individual stones and cornice profiles are estimates, not archaeological survey geometry.

`FOOTPRINTS` contains only the exact three OSM building replacement outlines. `OSM_WAYS` additionally lists sanctuary part 344003613 and all six portal pier/lintel parts 432765272/273/274/275/277/279. Relations are 6432785 and 7875419; their outer member ids are included. Cornice overhangs use less than 0.9 m beyond these outlines. The authored pool/island is a separate non-building site envelope, so no large pool-sized provider building deletion ring is introduced. `SITE_RING` supplies that bounded rigid site pad with median datum and 8 m feather. Full terrain coverage, entrance contacts and surrounding lattice samples still require app verification.

## Review correction (g15ar, 2026-10-15)

Review g15a found a crate-like sanctuary, weak cornice and batter, squat gateways, and a raised-tray basin rim. Both LODs now have an 8 cm/m inward sanctuary wall batter, four genuine upper openings more than 1.2 m deep with a dark chamber surface, two full proud columns plus the short middle column above the entrance lintel, and flared capitals supporting the front lintel. The east front reads as an open pronaos screen. Rear stone/interior details remain schematic.

The main concave cavetto projects 0.8 m beyond its neck, with rounded torus rolls at its base and a lighter top face. Cornice flanks and mouldings share integral stone material; only the top uses the lighter material, avoiding depth-order cycles. The portals rise to 6.7/7.0 m above the basin (6.2/6.5 m above the island), with wider 1.65/1.75 m clear openings and 0.48 m projecting cornices. Their mapped positions and widths remain. The south annex keeps a smaller cornice. Basin coping is now approximately flush with the 0.19 m water surface (0.20 m coping), and a 2 m paved esplanade band extends the basin footprint. The stone island remains raised at 0.50 m as in the photographs.

| LOD | Before triangles / draws / bytes | After triangles / draws / bytes |
| --- | --- | --- |
| Near | 18,048 / 5 / 978,028 | 19,004 / 6 / 1,019,760 |
| Far | 2,444 / 5 / 135,964 | 2,840 / 6 / 152,068 |

Build with `pnpm build:top-cities-landmarks templo-de-debod --no-check`, then regenerate/check depth layers. The final exported GLB near/light and far/dark sheets are in `tmp/top-cities/templo-de-debod/fix-g15ar/`, covering the front sanctuary, reverse side, roof, street and gates. These were inspected against the dossier sheet: deeper dark openings and full columns, concave cornices/torus, tall open portals and flush basin edge all survive far. Fine hieroglyphs, archaeological irregularities and optical reflections remain omitted. Heights and profiles are photo estimates rather than survey dimensions.

Both LODs retain matching site bounds and exact provider ownership; the structural cornice envelope stays within the tested 0.9 m allowance. Updated ray tests check 8% batter, actual openings, roof/gate heights, bronze doorway, named jamb/capital support contacts with an unsupported negative case, and the enlarged paved site envelope. Five own tests pass; both landmark suites total 17 passes. QA metrics have no issues, no layered or coplanar faces, zero back-face sweep hits and nothing below grade. Depth regeneration/check has zero dropped cycle edges.

App captures and camera/load reports are in `tmp/top-cities/templo-de-debod/fix-g15ar/app/{city,world}/`, taken from the independent slot I `/tmp` bundle. Cityscape and Full 3D world appearance are captured independently; the lead still owns full provider/lifecycle, terrain arrival/refinement, surrounding lattice and placement certification. Independent re-review remains required. Catalog/preview validation and the requested registry test run are recorded in the worker report.

## Reference credits

Photographs are reference-only in ignored scratch: *2026-09-03 - Temple of Debod in Madrid Spain 01/02/03/04*, Matt Joseph, CC BY-SA 4.0; [*Templo de Debod, Madrid, España, 2023-01-03, DD 89-91 HDR*](https://commons.wikimedia.org/wiki/File:Templo_de_Debod,_Madrid,_Espa%C3%B1a,_2023-01-03,_DD_89-91_HDR.jpg), Diego Delso, CC BY-SA 4.0; [*Moncloa-Aravaca - Temple of Debod - 20171027130942*](https://commons.wikimedia.org/wiki/File:Moncloa-Aravaca_-_Temple_of_Debod_-_20171027130942.jpg), Oliver Gargan, CC BY-SA 4.0. Exact individual links and attributions are in the catalog record and dossier `refs/SOURCES.txt`. Mapped geographic data © OpenStreetMap contributors, ODbL 1.0. Mesh/source are original procedural work by Codriver; no traced mesh, capture, scan or photograph is embedded.

Validation outcome for g15ar: all 17 own geometry tests pass; requested combined registry run completed with 897/898 passing, the sole failure being sibling `edificio-inteligente-epm` catalog readiness changing during its build. Catalog validation subsequently passed (425 records / 820 variants), and `pnpm assets:preview` passed. A later targeted registry retry was blocked at module import by sibling `pantheon-rome/views.js` importing an absent `plan` export while that asset was being rewritten. Neither sibling was edited. Final depth generation/check for both assigned landmarks passed with zero cycle edges; the shared generated table may be overwritten by parallel exports and should be regenerated for all batch IDs by the lead.
