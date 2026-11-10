# United States Custom House, Charleston

Original procedural present-day exterior of the completed 1879 Custom House, 200 East Bay Street, with east and west Roman Corinthian temple fronts. This represents the current building without the proposed dome, not the earlier Old Exchange. The [GSA owner’s history and architecture](https://www.gsa.gov/real-estate/explore-historic-buildings/find-a-historic-federal-building/us-custom-house-charleston-sc) confirms the cross plan, three stories including rusticated basement, broad steps, colossal porticoes, engaged side order and balustrade over a low roof.

## Sources and dimensions

| Feature | Model metres | Basis |
| --- | ---: | --- |
| Mapped masonry cross | 56.3 × 39.8 | Sourced OSM way 37594690 |
| Stair-inclusive long envelope | 76.7 | Estimated, consistent with historic 249 ft / 75.90 m description; no survey claim |
| Historic short cross arm | 152 ft / 46.33 m | Sourced NPS nomination’s historic description, differs from mapped 39.8 m footprint; not silently substituted |
| Highest pediment | 23 | Estimated from photo and unsurveyed OSM height tag |
| Podium / capital / frieze top | 3.65 / 18.5 / 19.95 | Estimated photographic proportions |
| Front columns | Six each, eight-sided shafts; 1.28 m lower diameter | Sourced photographic count, estimated dimensions |
| Portico depth / front width | 6.4 / 24 | Estimated to mapped envelope |
| Stair run / width | 10.2 / 20.6 | Estimated |

[NPS National Register nomination](https://npgallery.nps.gov/pdfhost/docs/nrhp/text/74001834.PDF) gives the old 249 × 152 ft cross-plan description and explicitly notes the dome was never built; the associated 160 ft proposal height is **not** the current building height. Height, stair dimensions, columns and stage split are estimates, not measured construction drawings. Mapped footprint and alignment were fetched 2026-11-09 from OSM 0.6 map API; data © OpenStreetMap contributors, ODbL 1.0.

Two Commons reference photos: [US-custom-house-charleston-sc1](https://commons.wikimedia.org/wiki/File:US-custom-house-charleston-sc1.jpg), Brian Stansberry, **CC BY 3.0**; [United States Custom House](https://commons.wikimedia.org/wiki/File:United_States_Custom_House.jpg), Diligent Terrier, **CC BY-SA 4.0** selected from offered licences. File-page descriptions verify Charleston identity and licences were checked. The first shows six free columns and the stair flight; the second file’s caption confirms the same building. Reference images are local comparison only, with no copied mesh, scan, photograph, texture, logo or lettering in delivery. Second image download was initially rate limited.

## Frame and foundation

Origin `[-79.926472,32.780822]`; real metres +X east/+Y up/+Z south, y=0 at stair feet. Mapped south-eastern controls `[-79.9261592,32.7807484]` and `[-79.9263373,32.7807311]` fix the long arm’s 6.64° north-of-east orientation; yaw is baked once, west frontage 263.36°. The exact cross outline of way 37594690 is retained. No separately mapped building parts appeared in the extract. Nearby Custom House grounds, parking, fences, East Bay and Concord streets remain outside ownership.

Podium and body remain rigid, with attached stairs descending continuously to pavement. One bounded foundation ring with three mapped controls and a 3 m feather is placement handoff metadata. Stairs extend beyond the provider building outline; host replacement must keep ground infrastructure separate. No terrain elevation, sea-level or Mercator scale is baked into exports. Cityscape and terrain fitting still require host validation.

## Modeling choices and omissions

Open six-column porches at both ends, monumental grounded stairs, triangular pediments, pierced two-tier window walls, engaged shafts around the cruciform sides, low inset roof and open balustrade. Capitals use original abstract leaf lobes near and enlarged eight-sided blocks far. Columns are eight-sided in both LODs. Far retains every free column, opening, window bay, stair sequence and parapet, reducing tiny ornaments and tread count. Roof, masonry, glazing and bronze doors are muted; no saturated patchwork or black roof cap.

Fine fluting, faithful acanthus carving, inscriptions, wall rustication, lamp sculptures, interior cortile, fences, landscaping and parking are omitted. The rear/east matches the documented symmetrical temple front rather than a detailed survey. Rebuild with `node scripts/build-top-cities-landmarks.mjs us-custom-house-charleston` through the repository’s meshopt plus quantization exporter.

Cityscape: **not tested**. Full 3D world: **not tested**. Library appearance and tests cannot establish integration or in-car performance.

## Measured export and evidence

| LOD | Triangles | Draws | Bytes |
| --- | ---: | ---: | ---: |
| near | 15230 | 4 | 175728 |
| far | 8062 | 4 | 104992 |

Metrics: `tmp/charleston-3/custom-metrics.json`, no flags, zero back-face hits, layered/coplanar faces, below-grade or member-end findings. Two contact-sheet rounds inspected together against the west-portico reference; final `tmp/charleston-3/sheets/final/us-custom-house-charleston.jpg` uses padded framing and shows full stair/temple silhouette in both overview LODs. Final roof is partitioned into a masonry perimeter and disjoint recessed roof surface, eliminating the original roof/wall coplanar overlap. Both porticoes remain open; pediment, columns and window rhythm persist far. Independent coordinator review is pending.

