# BC Place, Vancouver

Original procedural landmark `bc-place`, 777 Pacific Boulevard, Vancouver: the stadium after its 2011 renovation, shown with the retractable roof OPEN. The original air-supported dome is absent. The asset owns only the stadium envelope, including the cable roof and mast crown; no neighbouring buildings or roads are changed.

The road-visible features are its oval concrete bowl, recessed teal clerestory, tall white mast crown, bowed upper cables, billowed fixed white membrane annulus and central storage pod. Red terraces and a green pitch are visible through the open centre. All 36 masts, the roof opening and the lit clerestory remain in far LOD.

## Evidence and geographic frame

- [Government of BC, 2 March 2011](https://archive.news.gov.bc.ca/releases/news_releases_2009-2013/2011SU0010-000190.htm): renovation identity, 36 masts, each 50 m long.
- [Tony Hogg Design, roof fabric designer](https://www.tonyhoggdesign.co.uk/site/projects_58.asp?catID=94): 100 × 85 m retractable centre, 36 cushions retracting into the central pod over the scoreboard.
- [Geiger Engineers project account in STRUCTURE](https://www.structuremag.org/article/bc-place-revitalization/): 227 × 186 m clear roof spans; masts rise 47.5 m above the original concrete ringbeam.
- [OSM way 24705904](https://www.openstreetmap.org/way/24705904), elevated part 1415412262 and roof parts 390133855/390133856, dossier snapshot 2026-10-06. Footprints retain all four provider rings. © OpenStreetMap contributors, [ODbL 1.0](https://www.openstreetmap.org/copyright).
- Commons comparison: [BC Place (Vancouver).jpg](https://commons.wikimedia.org/wiki/File:BC_Place_(Vancouver).jpg), Quintin Soloviev, CC BY 4.0; [Canada vs Qatar](https://commons.wikimedia.org/wiki/File:BC_Place_-_Canada_vs_Qatar.jpg), Aeacad, CC0; [BC Place (19186581723) (2)](https://commons.wikimedia.org/wiki/File:BC_Place_(19186581723)_(2).jpg), Nicki Dugan Pogue, CC BY-SA 2.0. Additional dossier interior views: Australia vs Türkiye at BC Place - June 13, 2026, Aeacad, CC0; Group G final match (55364664383), Mafue, CC BY-SA 4.0. The unrelated SkyTrain photograph was excluded.

Source facts and licences were checked; photographs remain only in ignored `tmp/top-cities/bc-place/refs/`. No scan, mesh, texture or photo is shipped. Original mesh authored by Codriver, 2026-10-06.

Origin `[-123.112006654, 49.276698485]` is the area centroid of the OSM outer ring. +X east, +Y up, +Z south; y=0 is local street grade. Principal long axis is 40.85° north of east (bearing 49.15°), baked once into geometry. Two mapped controls: southwest `[-123.1130723,49.2759001]` and northeast `[-123.1106917,49.2773029]` establish the long-axis direction; fitting all ring vertices sets the final principal axis. The radial intersection of each construction sample with the OSM ring keeps the complete crown inside its actual polygon, rather than using an unconstrained ellipse. Rigid base and 125 m pad radius; no terrain or latitude stretch is baked in.

## Dimensions

| Dimension | Model | Basis |
| --- | --- | --- |
| Outer mapped axes | approximately 233 × 194 m | OSM outline, including crown |
| Roof clear span | published 227 × 186 m | engineering source; distinct from mapped outer envelope |
| Masts | 36 | sourced, retained in near and far |
| Mast length / vertical rise | approximately 49 m / 47.5 m | length near sourced 50 m; rise sourced exactly |
| Ringbeam / mast tip | 30 m / approximately 77.6 m | ringbeam estimated; tip derives from sourced rise plus mast radius |
| Retractable aperture | 100 × 85 m | sourced; model ellipse is an approximation of actual rounded opening |
| Fixed fabric profile | 34 m outer edge to 43 m inner edge, shallow billows | estimated from aerial photograph |
| Clerestory | 18.2–27.7 m | estimated |
| Central pod | 20 m diameter, top 50 m | estimated |
| Pitch | 105 × 68 m | conventional soccer configuration, simplified |

OSM elevated part has `height=48`; that cannot represent the published 47.5 m mast rise plus the existing stadium bowl, so it is treated as roof/body metadata rather than crown height.

## Construction and materials

One merged mesh per material, no textures. Concrete drum strips form the exterior and inward bowl; roof is a thin closed membrane with an underside and inner/outer closures. Near has 18 seating terraces, roof pillow segmentation, clerestory mullions and transoms, broad glazed gates, pitch markings and hanger cables. Far has four terraces, fewer roof and cable samples and coarser mast cylinders, with every mast preserved. Mast bases contact the compression ring and cable stays attach to mast tops; radial stays continue across the aperture to the storage pod.

`concrete`, `roof`, `steel`, `cable`, `glass`, `glow`, `seats`, `field`, `shadow`, `paint`: near 10 draws. Far merges glass into glow, shadow into cable and omits paint, giving 8 draws. Dark dims structure and gives the facade `glow` a static pink event-light colour. The app renders this material unshaded; it is teal by day.

Approximations: radial cable-net topology, mast lean/taper, roof billows and transverse seams, gate distribution and bowl profile are photograph-based estimates, not engineering reconstruction. The 2011 opening is simplified to an ellipse. Static night colour does not animate real facade lighting. Individual seats, stair aisles, branding, scoreboards imagery, plaza, landscape and neighbouring stadium complex parts are not modelled. Terrace rings expose more uniform red seating than the real seating pattern. The open-roof view is intentional, not missing membrane geometry.

## Verification

Looked at the dossier `tmp/top-cities/bc-place/refs-sheet.jpg` and the procedural near/light contact sheet in `tmp/top-cities/shots/bc-place/iteration-1/`. The first pass had excessive uniform entrance slots and an open gap below the roof; after comparison, replaced slots with broad glazed gate groups and added the roof clerestory closure. The second comparison sheet `tmp/top-cities/shots/bc-place/iteration-2/comparison.jpg` combines front, back, roof, street, mast detail and plan with the aerial reference. It prompted stronger transverse roof pillow segmentation, while keeping the 36 mast outline. Final exported GLB sheets and measured costs are recorded below.

Focused tests pin every mast sector, crown height, mapped major/minor extents, containment of every vertex, 100 × 85 m roof opening, roof underside, central pod, field, lit band, face areas, outer-face winding, all provider IDs and near/far dimensions. No shared files are changed.

Cityscape: **not tested yet, integration is checked separately**. Full 3D world: **not tested yet, integration is checked separately**. Ground/pad fit, live provider replacement, LOD/theme lifecycle and device performance remain app integration checks. Flat stadium precinct is assumed for the export; exact entrance elevations remain unmeasured.


## Final exported asset inspection and costs

Looked at `tmp/top-cities/shots/bc-place/final/bc-place-export-reference-contact-sheet.jpg`: 20 labelled tiles with the aerial and interior reference photographs next to exported GLBs. It covers near/light overview, facade, back, roof, street and mast detail; near/dark overview, back, roof, street and detail; far/light overview, facade and roof; far/dark overview, back, roof and street. All corresponding PNGs and individual variant sheets are under `final/{near-light,near-dark,far-light,far-dark}/`. Source plan comparison remains in `iteration-2/comparison.jpg`.

The final review shows a recognisable oval bowl and 36-mast crown in both LODs, a genuinely open centre with cable net and supported storage pod, continuous fixed roof, correct mapped plan and a visible night facade band. Roof pillow and cable-net shapes are simplified; near fabric normals are welded to smooth the inflated membrane. Welding retained the silhouette and removed approximately 378 KiB of repeated near vertices and 36 KiB of far vertices. The facade and steel retain their hard edges. No fourth look/fix iteration was used.

| Export | Triangles | Draws | Exact bytes | KiB (1024 bytes) |
| --- | --- | --- | --- | --- |
| near | 41,820 | 10 | 1,858,508 | 1814.9 |
| far | 8,472 | 8 | 423,148 | 413.2 |

Both satisfy hard building caps (60k/14/2,500,000 bytes near; 12k/8/500,000 bytes far). Far costs are 20% of near triangles and 23% of near bytes. Measured costs are scene geometry, not device benchmarks.

Final command `node --test src/peregrine/landmarks/top-cities/top-cities.test.js src/peregrine/landmarks/top-cities/bc-place/bc-place.test.js`: **165 passed, 0 failed**, including all BC Place conformance checks and 8 landmark-specific tests. `node scripts/asset-catalog.mjs`: **valid, 178 records and 332 GLB variants** at verification time. `qa-metrics.mjs --ids bc-place --out tmp/top-cities/bc-place/qa-metrics.json`: **no issues**, 0 coplanar pairs, 0% back-face hits in 318 near rays, no removable attributes, grade and LOD bounds clean. GLB source round-trip bounds agree. The catalog registers six inspection views and `SPEC.ready=true`.

Independent reviewer verdict remains pending the coordinator's review; the author inspection and tests do not substitute for that verdict. Cityscape and Full 3D world remain not tested yet, integration is checked separately. No shared-file changes or blocker.
