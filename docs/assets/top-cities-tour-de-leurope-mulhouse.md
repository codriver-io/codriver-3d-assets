# Tour de l’Europe — Mulhouse

Mulhouse skyline tower with three concave residential faces, full-height concrete corner blades, open ground level and a circular rooftop restaurant.

## Sources and rights

- [Identity and documented history](https://fr.wikipedia.org/wiki/Tour_de_l'Europe_(Mulhouse))
- [Mapped provider footprint / part, ODbL](https://www.openstreetmap.org/way/27942080)
- [1.jpg | Fichier:Tour de l'Europe (Mulhouse) (1).jpg | Gzen92 | CC BY-SA 4.0](https://commons.wikimedia.org/wiki/File:Tour_de_l%27Europe_(Mulhouse)_(1).jpg)
- [2.jpg | Fichier:Tour de l Europe incendie Mulhouse20100116.JPG | MlibFR | CC BY-SA 3.0](https://commons.wikimedia.org/wiki/File:Tour_de_l_Europe_incendie_Mulhouse20100116.JPG)

Photos are local comparison only, no images or textures ship. Original code/docs MIT, model CC BY 4.0, OSM-derived geography ODbL 1.0. No contributor agreement accepted or invented.

## Frame and dimensions

Origin `[7.340494692592593,47.74993445185187]`, metres +X east, +Y up, +Z south. Local y=0 is the rigid exterior footing; no hill, terrain or scene elevation is baked in. Rotation `-0.1374194908978273` radians is baked once from OSM controls `[7.3402696,47.7498631]` → `[7.3403266,47.7498578]`. Host must not rotate again. Exact replacement ownership: 27942080, 1159140864, 1158800219, 1158800220, 1158800221; neighbouring structures excluded.

CTBUH architectural maximum100 m, occupied height97 m; 112 m to antenna is separately reported by secondary sources. OSM stages92/95/98/100 m are preserved. Twenty-seven grouped residential bay rows between9.5 and92 m and the open lower support level are photo estimates; 31 mapped levels describe the whole building. Exact concave main outline and separately mapped restaurant, neck and central roof cap are owned.

Antennas are not included in the 100 m architectural roof height. The tower alone is modelled; Porte Jeune shopping centre, tramway, plaza and surrounding low buildings are excluded. Both reference photographs show the same concrete/concave facade design; the 2010 fire-response view is used only to clarify lower supports. CTBUH: https://www.skyscrapercenter.com/building/tour-de-leurope/29977 ; PSS: https://www.pss-archi.eu/immeubles/FR-68224-643.html .

## Evidence and limitations

Exported near/far geometry, footprint plan and night view inspected against the verified exterior photographs. One visual fix round reduced pane contrast and widened the sheet frame; the reference was letterboxed to retain the complete tower. Three mapped concave faces, grounded corner blades, open undercroft, separately glazed circular restaurant and distinct 100 m roof / 112 m antenna survive far. Corner service polygons close inside the body to avoid self-intersections; lower supports and restaurant stages pass independent ray probes. No surrounding shopping-centre roof or plaza is included.

| LOD | Triangles | Draws | Bytes |
| --- | ---: | ---: | ---: |
| near | 10509 | 4 | 175236 |
| far | 7349 | 4 | 122284 |

Deterministic QA: no remaining flags; metrics at `tmp/france-northeast/tour-de-leurope-mulhouse/metrics.json`. Exported contact sheet: `tmp/revisions/sheets/tour-de-leurope-mulhouse.jpg`. Red footprint top view and exported far/night evidence: `tmp/france-northeast/shots/tour-de-leurope-mulhouse/`. Focused identity/geometry and registry conformance tests, asset catalog and depth-layer checks pass. Self-review only; independent review remains pending.

Cityscape: **not tested**. Full 3D world: **not tested**. No app server or app-shot run. Independent review and app placement, terrain pad selection, provider replacement, DEM contacts, lifecycle and hardware verification remain later integration work.

Corner service-blade tops at98.8 m and the 9.3 m undercroft floor are photo estimates; they do not replace the published100 m architectural maximum. Window bays are grouped with a few alternating muted panes, avoiding per-apartment decoration.

## Independent review follow-up — 2026-11-11

Strengthened the white residential balcony-tier bands from0.33 to0.58 m in both LODs without adding triangles. All27 separate residential rows, three concave faces, corner blades, open undercroft, circular restaurant and100 m roof/112 m antenna are unchanged. Ray probes on each of the three faces verify the stronger concrete tier and the separate glazing above it, and matched near/far views retain the same band rhythm.

Fresh exported-GLB sheet: `tmp/revisions/sheets/tour-de-leurope-mulhouse.jpg`. Its paired south, north, east and west views were compared face by face before committing: each facade retains its openings and separate pane/row rhythm, and the changed feature survives in far. The sheet contains a contained reference, matched full-model near/far overview and a plan tile; scratch-only framing changes leave shared tooling untouched.

Landmark tests and focused registry conformance pass; deterministic QA has zero flags and the depth check has zero dropped cycles. Source, exports, manifest and catalog agree. Independent re-review is pending; Cityscape: **not tested**. Full 3D world: **not tested**.
