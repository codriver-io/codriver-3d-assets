# St. Michael’s Church, Charleston

Original procedural model of the permanent exterior at Broad and Meeting Streets, built 1752–1761; current white finish, excluding temporary restoration apparatus. No imported mesh, texture, logo or lettering.

## Sources and dimensions

| Feature | Model | Basis |
| --- | --- | --- |
| Overall plan | approximately 40.9 × 20.1 m | Sourced mapped envelope, OSM way 39937176; NPS nomination gives 130 × 60 ft (39.624 × 18.288 m), a different envelope |
| Highest point | 56.7 m | Estimated adoption: NPS nomination gives 185 ft (56.388 m), current NPS page 186 ft (56.693 m); no exact vane-datum claim |
| Nave eaves / ridge | 12.6 / 18.5 m | Estimated from photographs and mapped roof tag |
| Square base top | 26.9 m | Estimated |
| Octagon cornices / lantern top | 35.7 / 41.9 / 49 m | Estimated photographic stage proportions |
| Portico | 16.2 m wide, four columns to 11.6 m | Estimated from photographs, fitted to mapped west projection |

Primary sources: [NPS place](https://www.nps.gov/places/st-michael-s-episcopal-church.htm), [NHL nomination](https://npgallery.nps.gov/NRHP/GetAsset/NHLS/66000704_text). The latter explains the diminishing octagons, slate roof and two rows of round-arched windows. [OSM way 39937176](https://www.openstreetmap.org/way/39937176) was fetched through the OSM 0.6 map API on 2026-11-09. Geographic data © OpenStreetMap contributors, ODbL 1.0.

Reference-only Commons photographs by Brian Stansberry: [full exterior](https://commons.wikimedia.org/wiki/File:St-michaels-episcopal-charleston-sc1.jpg), [side/tower](https://commons.wikimedia.org/wiki/File:St-michaels-episcopal-charleston-sc3.jpg), both **CC BY 3.0**, checked on each file page. Initial downloads were rate limited; supplemental full exterior by Warren LeMay is displayed by the [North American Guild of Change Ringers](https://www.nagcr.org/towers-and-bands/charleston-st-michael), and the NPS historic photo corroborates the same portico and lower tower. Photos remain only in ignored scratch and are never distributed with the model.

## Frame and foundation

Origin `[-79.93074,32.776316]`, local metres, +X east/+Y up/+Z south. Local y=0 is pavement at the foundation. The authoring nave points +X toward the altar; +6.94° rotation is baked once, giving west-front bearing 263.06°. Controls `[-79.9308974,32.7762074]` and `[-79.9305386,32.7762442]` locate the long south wall. The portico projects west and the small chancel projects east. The exact ring owns church way 39937176 and its mapped tower/porch parts 1389398216, 1413354220, 1413354221; churchyard, offices, streets and neighbouring buildings are excluded.

The building is rigid on one flat foundation; the bounded ring and three pavement controls are offered as median-datum placement metadata with a 2 m feather. No terrain, absolute altitude or Mercator stretch is baked into the GLBs. The host must independently validate this pad and neighbouring street contact.

## Modeling

White stucco nave, giant four-column Tuscan porch, stepped square base, louvred octagon, clock octagon, genuinely open upper lantern and ribbed needle establish the silhouette. Individual arched panes and louvre apertures are real wall holes with recessed backing. Far preserves all window bays, clock faces, portico and lantern openings, reducing curve, shaft and slat samples. Muted off-white plaster and grey slate avoid an artificial black cap. Original geometry is batched by five materials.

Omissions and estimates: no interior, churchyard, lettering or logos; clock numerals become ticks, capitals and rustication simplified, vane represented by a slender pole/orb, exact masonry and ornament are not a conservation survey. Portico roof pitch, stage splits and rear chancel are estimated. Editable source is in the landmark folder; export with `node scripts/build-top-cities-landmarks.mjs st-michaels-church-charleston` using the shared meshopt and quantization codec.

Cityscape: **not tested**. Full 3D world: **not tested**. Standalone export inspection does not establish host integration or device performance.

## Measured exports and evidence

| LOD | Triangles | Draws | Bytes |
| --- | ---: | ---: | ---: |
| near | 8897 | 5 | 134784 |
| far | 4786 | 5 | 79640 |

Deterministic QA: no flags, zero back-face hits, no layered/coplanar faces, no below-grade members or unsupported member candidates. Report: `tmp/charleston-3/michael-metrics.json`. Final exported contact sheet: `tmp/charleston-3/sheets/final/st-michaels-church-charleston.jpg`; all eight tiles inspected together against the full guild exterior reference. Near/far preserve the complete silhouette, portico columns, separate window rhythm and open lantern. Two look rounds used; padded scratch bounds correct the shared sheet tool’s tall-asset framing. Fine facade rustication and pediment oculus are omitted. Independent coordinator review remains pending.


Mapped tower part 1389398216 carries an unsurveyed 50 m tag; it is not used in place of the NPS 185/186 ft descriptions. Exact tower and porch rings are retained for provider replacement handoff.

Final normal correction: pediment vertices are split at sharp roof edges, matching the corrected temple/church primitive used for the other assets. Bounds and triangle counts are unchanged; final sheet and GLBs were refreshed, and independent coordinator review remains pending.
