# Tour des Archives — Rouen

Archive tower on the left bank of Rouen: a slender rectangular concrete shaft, recessed claustra grids, broad roof cap and antenna.

## Sources and rights

- [Identity and documented history](https://fr.wikipedia.org/wiki/Tour_des_Archives_(Rouen))
- [Mapped provider footprint / part, ODbL](https://www.openstreetmap.org/way/65044760)
- [2.jpg | File:Place Carnot (Rouen).JPG | Giogo | CC BY-SA 4.0](https://commons.wikimedia.org/wiki/File:Place_Carnot_(Rouen).JPG)
- [3.jpg | File:Seine et tour des Archives nuit Rouen.JPG | Giogo | CC BY-SA 4.0](https://commons.wikimedia.org/wiki/File:Seine_et_tour_des_Archives_nuit_Rouen.JPG)
- [4.jpg | File:Vue Tour des Archives.JPG | Giogo | CC BY-SA 4.0](https://commons.wikimedia.org/wiki/File:Vue_Tour_des_Archives.JPG)

Photos are local comparison only, no images or textures ship. Original code/docs MIT, model CC BY 4.0, OSM-derived geography ODbL 1.0. No contributor agreement accepted or invented.

## Frame and dimensions

Origin `[1.0919993833333332,49.434787199999995]`, metres +X east, +Y up, +Z south. Local y=0 is the rigid exterior footing; no hill, terrain or scene elevation is baked in. Rotation `0.683523652276114` radians is baked once from OSM controls `[1.0919134,49.4346598]` → `[1.0921728,49.4347972]`. Host must not rotate again. Exact replacement ownership: 65044760; neighbouring structures excluded.

Roof 89 m and antenna 104 m per Rouen tourism and DRAC Normandie; mapped OSM total 104 m. Width and depth follow the mapped footprint. Screen bay counts and recess depth are photo estimates; 27 archive levels are not an asserted structural floor count.

Only the separately mapped archive tower is owned; the adjoining Conseil départemental civic complex is excluded. Fine lattice ornament and animated facade lighting are simplified. Height source: https://en.visiterouen.com/offres/tour-des-archives-rouen-en-4148490/ .

## Evidence and limitations

Exported near/far geometry, footprint plan and night view inspected against the verified exterior photographs. Initial visual review passed: narrow rectangular shaft, concrete claustra grid, projecting 89 m cap and slender 104 m antenna remain legible; dark recessed archive core sits behind real screen openings. Far preserves coarser separate bays. The adjoining civic complex and dynamic LED lighting are deliberately excluded.

| LOD | Triangles | Draws | Bytes |
| --- | ---: | ---: | ---: |
| near | 11088 | 4 | 209744 |
| far | 3900 | 4 | 79940 |

Deterministic QA: no remaining flags; metrics at `tmp/france-northeast/tour-des-archives-rouen/metrics.json`. Exported contact sheet: `tmp/revisions/sheets/tour-des-archives-rouen.jpg`. Red footprint top view and exported far/night evidence: `tmp/france-northeast/shots/tour-des-archives-rouen/`. Focused identity/geometry and registry conformance tests, asset catalog and depth-layer checks pass. Self-review only; independent review remains pending.

Cityscape: **not tested**. Full 3D world: **not tested**. No app server or app-shot run. Independent review and app placement, terrain pad selection, provider replacement, DEM contacts, lifecycle and hardware verification remain later integration work.

The broad Rouen panorama returned by the initial photo search was rejected as tower-detail evidence; verified exterior evidence is Place Carnot, the Seine night view and Vue Tour des Archives.

## Independent review follow-up — 2026-11-11

Reduced the claustra subdivision count to a10-by30 near grid and6-by16 far grid on each broad face, cutting the complete tower from27600/9580 to11088/3900 triangles. All apertures remain genuine holes with the same recessed archive core; narrow-flank service slots,89 m roof and104 m antenna are unchanged. Tests pin the new12k/4k cost envelope and ray-probe the recessed core through both broad faces; paired cardinal views confirm separate grid openings in far.

Fresh exported-GLB sheet: `tmp/revisions/sheets/tour-des-archives-rouen.jpg`. Its paired south, north, east and west views were compared face by face before committing: each facade retains its openings and separate pane/row rhythm, and the changed feature survives in far. The sheet contains a contained reference, matched full-model near/far overview and a plan tile; scratch-only framing changes leave shared tooling untouched.

Landmark tests and focused registry conformance pass; deterministic QA has zero flags and the depth check has zero dropped cycles. Source, exports, manifest and catalog agree. Independent re-review is pending; Cityscape: **not tested**. Full 3D world: **not tested**.
