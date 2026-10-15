# Wembley Stadium, London

Original procedural model of the stadium opened in 2007, designed jointly by Foster + Partners and HOK Sport (now Populous), replacing the former twin-towered stadium. Its identifying feature is the white circular-section space-truss arch leaning over the north stand, with roof-support hangers and stays. The rounded stadium bowl has silver-grey metal cladding, glazed corner stair bays, a partially open roof, three red seating tiers and a visible football pitch.

## Sources and geographic frame

- [Wembley official stats and facts](https://help.wembleystadium.com/support/solutions/articles/7000028145-stats-and-facts): 133 m arch crown, 315 m clear span, 7.4 m tubular lattice diameter, 52 m roof and the north/south roof support role.
- [Populous project](https://populous.com/showcases/wembley-stadium): joint architectural authorship and 2007 identity.
- [OSM stadium relation 912489](https://www.openstreetmap.org/relation/912489): outer ways 116587436, 963609749, 963609748, 963608732; roof ways 116537666 and 377915368, plus arch building way 27784957 (134 m provider extrusion). The courtyard/pitch inner member 377913373 is not a provider building extrusion and is not masked separately. Outer stadium envelope about 294 × 284 m. The prebuilt dossier omitted relation-member geometry; the shared Overpass request failed, so the single relation/full OSM API response supplied the original node coordinates.
- [Cmglee London Wembley aerial](https://commons.wikimedia.org/wiki/File:Cmglee_London_Wembley_aerial.jpg), Cmglee, CC BY-SA 4.0: silhouette, roof opening and arch placement.
- [All In 2024 at Wembley Stadium](https://commons.wikimedia.org/wiki/File:All_In_2024_at_Wembley_Stadium.jpg), McPhail, CC0: exterior glazing and perimeter framing.
- Interior seating/roof photos, checked in the provided reference sheet: Hullian111, *2023 Challenge Cup Seconds From Start*, CC BY-SA 4.0; Radoslaw Zak, *BVB-Fans in Wembley*, CC BY-SA 3.0; Ian Hughes, *Adele Live 2017 – The FINALE*, CC BY 2.0. The sheet also contains Neil Theasby's rugby statue detail, CC BY-SA 2.0; the statue is omitted. Full photo links and licences are in the catalog record and ignored dossier SOURCES.txt.

Origin `[-0.2796038, 51.55606635]` is the midpoint of the mapped bowl envelope. Units are real metres; +X east, +Y up, +Z south; y=0 is rigid local grade. The mapped north-roof long edge is approximately bearing 93°; its two controls `[-0.2796576,51.5564996]` and `[-0.2789746,51.5564794]` define a 47.3 m roof edge at bearing 92.72°, rounded to a 3° skew. Geometry bakes that skew into pitch, roof opening and arch; the host must not rotate it again. No terrain, altitude or Mercator stretching is baked in.

| Element | Model | Basis |
| --- | --- | --- |
| Arch crown | 133 m near / 132.8 m far | Official 133 m, finite member radii included |
| Arch span | 315 m between springing centre lines | Official |
| Circular lattice diameter | approximately 7.4 m including main chords | Official; six longitudinal chords near, four far |
| Arch inclination | 22° from vertical | Published structural descriptions; visually consistent with aerial |
| Roof outer/inner edge | 52 / 48 m | Official outer height; estimated slope |
| Stadium envelope | about 294 × 284 m | Mapped OSM ring, geometry inset 0.8% |
| Roof opening | about 194 × 132 m, rounded rectangle | Estimated partially open state; preserves central negative space |
| Pitch | 105 × 68 m with 6.5 / 6 m runoff | Conventional pitch dimensions; photo-based location |
| Seating | three tiers reaching 42 m | Estimated; continuous tier surfaces and two dark concourse breaks |
| Arch feet, member gauges, bays, stays | Photo-based simplified arrangement | Estimated; physical contacts tested |

## Authoring and approximation

The outer shell follows radial intersections with the stitched OSM outline rather than a generic ellipse. Glazing cells replace metal cells, avoiding layered faces; larger glazed corner bays retain separate floor rows and vertical mullions. The open roof is a sloped annulus with a closed inner lip and soffit. Exposed perimeter diagonal framing sits proud of the top glazing band. The pitch and its near-only markings are geometry. Muted silver, grey-blue glazing, red seating and green turf approximate the reference colours.

The arch is a physical circular space truss: 64 longitudinal segments / six chords near, 32 / four far, with complete polygonal hoops and diagonal lattice members. It is not a flat ribbon. Curved arch chords use the centreline tangent and two perpendicular cross-section vectors, retaining depth at every bearing. Both terminal hoops are enclosed by grounded solid shoes. Every hanger connects to a real hoop node; the opposite end is raycast onto the actual authored roof triangles. Corner hanger targets move inward if the first position falls outside the roof. Those anchor targets are an approximation of the real cable arrangement, not an engineering reconstruction.

Both arch shoes extend slightly beyond the stadium provider outline and have their own small authored footprint rings, with no additional provider IDs. Elevated arch members may project outside the bowl close to the springings; this is an intentional structural overhang, not permission to erase surrounding buildings. No surrounding plaza, adjacent buildings, external approach ramps, branding, statue, individual seats or stadium interior rooms are included. Roof retractability is represented by a fixed partially open state. Night uses dimmer body colours and a lit arch; no animated illumination.

## Review correction (g15ar, 2026-10-15)

Review g15a found that the far arch became a faint dotted thread, the exterior had short office-like windows and a dark plinth, and the street evidence was inside the bowl. The near six-chord lattice geometry is retained. Far keeps a real circular space truss with four 1.5 m diameter longitudinal chords, coarse hoops and diagonals; its chord centres sit on a 5.9 m diameter circle so the total tube envelope remains approximately the official 7.4 m. This intentional distant gauge exaggeration preserves the silhouette and the open lattice rather than flattening it into a band. The daytime arch is white (`#f4f5f3`).

Facade glazing now fills taller separate bays between silver-grey fins, retaining continuous corner glazing and mullions. The base is concrete grey, the roof is metal grey, and the darker underside/inner roof lip remains. Scratch app inspection exposed tall white sheets beside both arch feet: provider building way 27784957 encodes the arch as a 134 m extrusion. Its exact ring and ID are now owned, in addition to the bowl and roof ways. Nearby apartments and car parks stay outside the owned rings. Lattice, roof hanger and grounded shoe contacts remain tested in both LODs; the deliberate shortened-member negative case still fails as intended. A new geometry test measures the far chord radius and white material directly.

| Detail | Before triangles / draws / bytes | After triangles / draws / bytes |
| --- | --- | --- |
| Near | 20,092 / 9 / 1,010,560 | 19,492 / 9 / 963,760 |
| Far | 6,474 / 8 / 389,320 | 6,938 / 8 / 388,260 |

Evidence is in `tmp/top-cities/wembley-stadium/fix-g15ar/`: exported near/light and far/light/dark sheets (overview, facade, roof, exterior street and lattice detail); `metrics.json`; focused tests and the requested complete `top-cities.test.js` run in `tests.log`; and `app/{city,world}/{far,near,street}.png` with camera/load reports. The final app captures use an independent `/tmp/codriver-g15ar-*` bundle on slot I, never the shared `public/peregrine.js`. The street view approaches from Olympic Way north of the stadium, outside the bowl; the far view is approximately 800 m and reports the far LOD active.

QA metrics: no issues, no layered/coplanar faces, no below-grade vertices, back-face sweep within tolerance, and no dropped depth-cycle edges. Both landmark geometry suites pass (17 tests total). Catalog and preview validation are recorded in the worker report. Cityscape and Full 3D world appearance are captured separately; provider/lifecycle/terrain arrival and refinement certification still belong to the lead. A static screenshot does not verify the full placement matrix. Independent re-review remains required.

Validation outcome for g15ar: all 17 own geometry tests pass; requested combined registry run completed with 897/898 passing, the sole failure being sibling `edificio-inteligente-epm` catalog readiness changing during its build. Catalog validation subsequently passed (425 records / 820 variants), and `pnpm assets:preview` passed. A later targeted registry retry was blocked at module import by sibling `pantheon-rome/views.js` importing an absent `plan` export while that asset was being rewritten. Neither sibling was edited. Final depth generation/check for both assigned landmarks passed with zero cycle edges; the shared generated table may be overwritten by parallel exports and should be regenerated for all batch IDs by the lead.
