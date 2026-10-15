# Stade de France — Saint-Denis

Original procedural reconstruction of the 1998 stadium in its unbranded football configuration, authored 2026-10-15. The defining feature is the thin suspended oval roof ring on eighteen needle masts, floating above the open stands. Three stepped seating tiers, tinted inner skylight, open concourse bays and eighteen monumental stair flights remain in both LODs.

## Sources and dimensions

| Quantity | Source / interpretation | Model |
| --- | --- | --- |
| Roof area | [VINCI construction](https://www.vinci-construction-projets.com/fr/realisations/stade-de-france-2/): 6 ha total, 5 ha opaque and 1 ha glazed | Mapped annulus, approximately 6 ha; inner 18.5% radial strip tinted |
| Needle count and height | [Official stadium history](https://www.stadefrance.com/fr/le-stade/notre-histoire): 18, 61 m from pitch datum | All eighteen mapped positions; tips 50 m above parvis, using estimated 11 m pitch depression |
| Roof elevation | [Parrains du Stade](https://www.parrains-stadefrance.fr/stade-de-france): 35 m above parvis, 46 m above pitch; official history and [Saint-Denis](https://www.saintdenis.fr/stade-de-france) instead quote 42 m above pitch | Top 35 m, soffit 33.4 m; discrepancy explicitly retained rather than treating all published heights as grade-relative |
| Envelope / orientation | OSM outer [way 64003104](https://www.openstreetmap.org/way/64003104), aperture 86922720; relation 3009843 | Approximately 281 × 324 m in stadium axes; long axis about 170° clockwise from north |
| Upper stand | OSM bowl parts height 29 m; exterior photographs | Seating 28 m, concrete rim 29 m, clear roof gap 4.4 m |
| Capacity | Official history / VINCI | Approximately 80,000; rows represented, individual chairs omitted |
| Monumental stairs | Official history: 18 | Eighteen estimated radial flights with continuous slabs and intermediate piers |

OSM data retrieved with the shared Overpass helper, saved in ignored `tmp/top-cities/stade-de-france/osm-full.json` and `osm-outline.json`. The dossier's 110 m query missed most masts and the relation's outer way; the supplemental queries cover them. The two opposite control points near `[2.3602003,48.9259293]` and `[2.360009,48.9230105]`, plus the complete mapped aperture, establish the north/south ends. Orientation is baked into metric vertices from mapped samples, not reapplied by the layer. Origin `[2.36013,48.92447]`; +X east, +Y up, +Z south; y=0 is rigid local parvis grade. Ownership includes outer way 64003104 and all 26 contained mast/bowl building parts, with one full outer replacement ring; aperture way is not a building extrusion. Neighbouring offices, ticket booths, detached roofs and the training ground remain outside ownership.

## Materials and construction

Self-contained Three.js source uses `assetBuilder`, with one mesh per named material. Radial profiles interpolate between independently sampled mapped inner/outer rings; they preserve the unusual rounded rectangle within the elliptical outer disk. The opaque roof and glazing adjoin with their buried interface faces removed. Roof underside channels occur only in near detail. The three stand profiles contain real stair-step surfaces and closed sloping backs, leaving the central aperture open. Every mast is grounded and tapers to a point; all 72 stays meet its shaft and the named roof or glazing slab. Stair ends reach ground and the upper concourse, with two intermediate piers each.

Subdued grey concrete, pale metal roof, blue-grey seats and desaturated green pitch follow the supplied photographs. Dark palettes dim the structure and light the near roof-edge lamps. Far retains all masts, stays, stairs, tiers, concourse bays, and the full aperture, with coarser curves and steps. No external mesh, scan, photograph, texture, logo or lettering is shipped.

Photographs inspected: the dossier reference sheet, especially Guilhem Vellut's `Stade de France @ Saint-Denis (28359861273)` (CC BY 2.0), Chris93's canal-side exterior (CC BY 4.0), Like tears in rain's 2024 Olympic rugby interior crop (CC BY-SA 4.0), and Claude Shoshany's distant Fort de l'Est view (public domain). Titles/credits are in dossier `refs/SOURCES.txt`; its Lille construction photograph is unrelated and was excluded. Two additional VINCI exterior/underside images, `ss-1-780x460.jpeg` and `1-5.jpeg`, are rights reserved and retained only as local visual references; neither is redistributed. They clarified the thin roof lip, concentric soffit channels and open gap.

## Approximations and mode status

The 11 m pitch depression is inferred from the published 35/46 m roof datums. The display pitch is raised to y=0.15; host terrain excavation is not implemented. Concourse levels, 1.6 m roof thickness, mast taper, four-stay routing, stair positions/shape and the blue-grey seating bands are visual estimates, not structural survey data. The real monumental stairs have more complex angular circulation than these straight radial flights. Upper stand height is simplified rather than reproducing its slight wave. No adjacent plaza or roads are authored.

Cityscape: **not tested yet, integration is checked separately**. Full 3D world: **not tested yet, integration is checked separately**. Lead must verify provider replacement, terrain footing/pad edges, delayed loads, reanchor, LOD transitions and shared unlit runtime shading in both modes. Contact sheets establish export geometry only; actual MCU hardware cost is unmeasured.

## Verification

Initial geometry review corrected terraced face winding and replaced isolated stair treads with a closed stair slab; the first GLB contact sheet then confirmed the thin roof silhouette, clear gap and visible bowl. Budget inspection reduced curve/step sampling while retaining all structural needles and stays. Depth analysis found coincident concrete/seat faces at the upper rim; floors and rim were moved outside the seating profile before final export. Adjacent roof/glazing interface faces were removed. Final evidence and measured costs follow.

| Export | Triangles | Draws | Bytes | KiB (rounded) |
| --- | ---: | ---: | ---: | ---: |
| Near | 31,908 | 9 | 1,816,468 | 1,774 |
| Far | 7,716 | 8 | 470,332 | 459 |

Judged final contact sheet: `tmp/top-cities/shots/stade-de-france/final-comparison.jpg`, showing four photo references beside exported near overview/back/street/detail, far roof/overview, far dark street, and near dark overview. Individual GLB sheets are `stade-de-france-glb-{near,far}-{light,dark}-sheet.jpg` in the same directory; near light also includes front facade and roof. The independent automatic eight-view export sheet is `stade-de-france.jpg`; its street and opposite views preserve the overhang, needles and bowl in both LODs. Source overview was rendered separately as `stade-de-france-procedural-near-light-overview.png`; export metrics and bounds match the procedural source. These are ignored local inspection artifacts, not published app pages.

- Nine landmark tests pass (12 checks pass when combined with the three id-filtered shared conformance tests): all 18 needle tips, mapped containment, grade, open aperture, sourced-area range, roof thickness/underside, seating gap, 72 stays and 18 stair terminal contacts with named supports, shortened-stay negative control, exterior winding, ownership and near/far bounds.
- The requested two-file command ran 822 tests: 820 passed, with two unrelated `palais-bourbon` failures (small footprint polygon and its missing export manifest during another builder's work); all Stade de France tests and three shared conformance checks passed.
- `qa-metrics.mjs --ids stade-de-france`: no issues; both variants 0% backface sweep, no coplanar overlaps, no layered-face candidates, no unsupported stay-end candidates, no below-grade geometry and no removable lift bytes.
- Depth table regenerated for this id; `--check` passed with zero dropped cycle edges. This generated table is the sole shared source-file change.
- `node scripts/asset-catalog.mjs`, `pnpm assets:check` and `pnpm assets:preview` passed (406 entries / 754 GLB variants at time checked).
- Source, GLBs, catalog and docs ready for lead review; app integration in both modes remains untested.
