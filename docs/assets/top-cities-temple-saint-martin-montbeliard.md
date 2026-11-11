# Temple Saint-Martin — Montbéliard

Schickhardt’s Renaissance Protestant hall: long limestone rectangle, rhythm of tall pedimented windows, steep terracotta roof and square clock turret with slate needle.

## Sources and rights

- [Identity and documented history](https://fr.wikipedia.org/wiki/Temple_Saint-Martin_de_Montbéliard)
- [Mapped provider footprint / part, ODbL](https://www.openstreetmap.org/way/32428650)
- [1.jpg | Fichier:Temple Saint-Martin.jpg | Raphaël Georgy | CC BY-SA 4.0](https://commons.wikimedia.org/wiki/File:Temple_Saint-Martin.jpg)
- [7.jpg | File:Temple Saint-Martin 0007.jpg | Arnaud 25 | CC BY-SA 3.0](https://commons.wikimedia.org/wiki/File:Temple_Saint-Martin_0007.jpg)
- [8.jpg | File:Porte latérale du temple saint Martin.jpg | Espirat | CC BY-SA 4.0](https://commons.wikimedia.org/wiki/File:Porte_lat%C3%A9rale_du_temple_saint_Martin.jpg)

Photos are local comparison only, no images or textures ship. Original code/docs MIT, model CC BY 4.0, OSM-derived geography ODbL 1.0. No contributor agreement accepted or invented.

## Frame and dimensions

Origin `[6.7973495,47.510170825]`, metres +X east, +Y up, +Z south. Local y=0 is the rigid exterior footing; no hill, terrain or scene elevation is baked in. Rotation `0.364` radians is baked once from OSM controls `[6.7971472,47.5100293]` → `[6.7976402,47.5101563]`. Host must not rotate again. Exact replacement ownership: 32428650; neighbouring structures excluded.

| Feature | Model | Basis |
| --- | ---: | --- |
| Hall masonry | 37.8 × 16.4 m | OSM plan, published 37 × 16 m hall dimensions |
| Interior ceiling | 11 m | Published, contextual; exterior cornice is estimated 13 m |
| Roof ridge / clock case / needle | 21 / 26 / 31.5 m | Exterior photo estimates, not surveyed |

Current exterior, modelled without trees, surrounding square, inscriptions or interior. Long hall, triangular pedimented bays and roof-mounted clock belfry retained in both LODs. Sources 1 and 7 show opposite current exterior angles; source 8 details the side entrance. Organ, maquette, interior paintings and unrelated Paris glass rejected. Exterior heights are estimates; published 11 m ceiling is not silently used as exterior eave.

## Evidence and limitations

Exported near/far geometry, footprint plan and night view inspected against the verified exterior photographs. One visual fix round: removed hidden roof end caps behind gable apertures and added the side portal with its round oculus. Verified pale pilasters, separate tall panes, steep roof, gable rhythm and four clock dials; corrected the clock probe to avoid its deliberately modelled hand. Carved inscriptions, interior and individual roof tiles omitted; wall/roof heights remain photo estimates.

| LOD | Triangles | Draws | Bytes |
| --- | ---: | ---: | ---: |
| near | 3034 | 7 | 64572 |
| far | 2290 | 7 | 52424 |

Deterministic QA: no remaining flags; metrics at `tmp/france-northeast/temple-saint-martin-montbeliard/metrics.json`. Exported contact sheet: `tmp/revisions/sheets/temple-saint-martin-montbeliard.jpg`. Red footprint top view and exported far/night evidence: `tmp/france-northeast/shots/temple-saint-martin-montbeliard/`. Focused identity/geometry and registry conformance tests, asset catalog and depth-layer checks pass. Self-review only; independent review remains pending.

Cityscape: **not tested**. Full 3D world: **not tested**. No app server or app-shot run. Independent review and app placement, terrain pad selection, provider replacement, DEM contacts, lifecycle and hardware verification remain later integration work.

Frontage metadata: 159.1443° clockwise from north, toward the modelled local +Z principal face. The mapped rotation is already baked; this bearing is descriptive and must not be applied as a second rotation.

## Independent review follow-up — 2026-11-11

Strengthened both end fronts with deeper pilasters and small cornice-colour capitals, and increased the existing perforated gable relief from0.50 to0.85 m. Hall dimensions, recessed tall windows, portals, roof pitch and clock turret are unchanged; both LODs retain the same end-front relief. Actual end-front probes pin the projecting pilasters and gables without blocking their window bays.

Fresh exported-GLB sheet: `tmp/revisions/sheets/temple-saint-martin-montbeliard.jpg`. Its paired south, north, east and west views were compared face by face before committing: each facade retains its openings and separate pane/row rhythm, and the changed feature survives in far. The sheet contains a contained reference, matched full-model near/far overview and a plan tile; scratch-only framing changes leave shared tooling untouched.

Landmark tests and focused registry conformance pass; deterministic QA has zero flags and the depth check has zero dropped cycles. Source, exports, manifest and catalog agree. Independent re-review is pending; Cityscape: **not tested**. Full 3D world: **not tested**.
