# Tour Elithis — Dijon

Rounded Dijon energy tower with a separate copper sun screen, horizontal glazed bays and a broad photovoltaic roof visor.

## Sources and rights

- [Identity and documented history](https://fr.wikipedia.org/wiki/Tour_Elithis_(Dijon))
- [Mapped provider footprint / part, ODbL](https://www.openstreetmap.org/way/115666860)
- [1.jpg | Fichier:Tour-Elithis-Dijon-01.JPG | Alchemica (d) | Image non libre](https://fr.wikipedia.org/wiki/Fichier:Tour-Elithis-Dijon-01.JPG)
- [8.jpg | © Olivier Dancy / Arte Charpentier; all rights reserved, comparison only](https://www.arte-charpentier.com/wp-content/uploads/2021/10/image-principale-Dijon-Elithis-%C2%A9-Olivier-Dancy-39.jpg)
- [9.jpg | © Olivier Dancy / Arte Charpentier; all rights reserved, comparison only](https://www.arte-charpentier.com/wp-content/uploads/2021/10/Dijon-Elithis-%C2%A9-Olivier-Dancy-23.jpg)

Photos are local comparison only, no images or textures ship. Original code/docs MIT, model CC BY 4.0, OSM-derived geography ODbL 1.0. No contributor agreement accepted or invented.

## Frame and dimensions

Origin `[5.052551735714287,47.328895825000004]`, metres +X east, +Y up, +Z south. Local y=0 is the rigid exterior footing; no hill, terrain or scene elevation is baked in. Rotation `-1.370964875650444` radians is baked once from OSM controls `[5.0524134,47.328961]` → `[5.0524336,47.3288934]`. Host must not rotate again. Exact replacement ownership: 115666860; neighbouring structures excluded.

Ten mapped levels; 33.5 m published roof maximum from the architect, versus rounded OSM33 m. Footprint follows way115666860; 3.8 m masonry base, estimated upper glazed bands and pitched visor are proportioned to the two architect photographs. The copper screen covers the southwest side rather than the entire tower.

Original geometry uses the mapped rounded boundary. Copper mesh is represented by open grouped louvers; no texture, lettering, logos or photovoltaic branding. Ground plaza and neighbouring Auditorium/CPAM are excluded. Official source: https://www.arte-charpentier.com/fr/projets/tour-elithis/ .

## Evidence and limitations

Exported near/far geometry, footprint plan and night view inspected against the verified exterior photographs. One visual fix round increased the copper screen density, added two crossing facet-following silver ties and widened the contact-sheet frame. Every tie endpoint meets the separate copper mesh in both LODs, with displaced negative controls; no unsupported ends or material cycles remain. Rounded footprint, separate glazing bands, open southwest screen and sloping 33.5 m solar visor survive far. Fine woven copper strands and individual photovoltaic cells are grouped.

| LOD | Triangles | Draws | Bytes |
| --- | ---: | ---: | ---: |
| near | 7812 | 7 | 143916 |
| far | 3690 | 7 | 75220 |

Deterministic QA: no remaining flags; metrics at `tmp/france-northeast/tour-elithis-dijon/metrics.json`. Exported contact sheet: `tmp/revisions/sheets/tour-elithis-dijon.jpg`. Red footprint top view and exported far/night evidence: `tmp/france-northeast/shots/tour-elithis-dijon/`. Focused identity/geometry and registry conformance tests, asset catalog and depth-layer checks pass. Self-review only; independent review remains pending.

Cityscape: **not tested**. Full 3D world: **not tested**. No app server or app-shot run. Independent review and app placement, terrain pad selection, provider replacement, DEM contacts, lifecycle and hardware verification remain later integration work.

## Independent review follow-up — 2026-11-11

Reduced weight from26538/10840 to7812/3690 triangles, under the requested8000/4000 caps. Continuous full-height mullions replace repeated per-pane frame sides; closed copper blades and gap rails remove repeated perforation walls and hidden junction caps, with fewer louver subdivisions and simple tie cross-sections. The rounded open southwest screen, both crossing ties, tilted33.5 m solar visor and separate glazing rows on every facade survive in both LODs, confirmed in all four paired cardinal views.

Fresh exported-GLB sheet: `tmp/revisions/sheets/tour-elithis-dijon.jpg`. Its paired south, north, east and west views were compared face by face before committing: each facade retains its openings and separate pane/row rhythm, and the changed feature survives in far. The sheet contains a contained reference, matched full-model near/far overview and a plan tile; scratch-only framing changes leave shared tooling untouched.

Landmark tests and focused registry conformance pass; deterministic QA has zero flags and the depth check has zero dropped cycles. Source, exports, manifest and catalog agree. Independent re-review is pending; Cityscape: **not tested**. Full 3D world: **not tested**.
