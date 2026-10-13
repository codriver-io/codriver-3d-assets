# Belém Tower — Lisbon

Original procedural model of the Tower of Saint Vincent as seen today, on the Tagus shore at Avenida de Brasília. The recognizable structure is a pale lioz-limestone square keep above an irregular hexagonal bastion, with projecting ribbed-cupola bartizans, shield parapets and the river-facing seven-arch veranda. No reference photograph, texture, external mesh or terrain height is shipped.

## Sources and rights

The supplied dossier at `tmp/top-cities/belem-tower/` was the starting point; no new Overpass request or photo download was needed. References checked on 2026-10-13:

- [UNESCO monument record](https://whc.unesco.org/en/list/263): monument identity, Portuguese maritime fortification and Manueline character.
- [Wikipedia architecture description](https://en.wikipedia.org/wiki/Bel%C3%A9m_Tower): four storeys, approximately 30 m, lioz material, irregular hexagonal bastion, seven river-veranda arches and 17 cannon embrasures.
- [Torre Belém April 2009-4a](https://commons.wikimedia.org/wiki/File:Torre_Bel%C3%A9m_April_2009-4a.jpg), Alvesgaspar, CC BY-SA 3.0: overall massing, limestone colour and tower/bastion relationship.
- [Lisbon Torre de Belém BW 2018-10-03 16-34-03](https://commons.wikimedia.org/wiki/File:Lisbon_Torre_de_Bel%C3%A9m_BW_2018-10-03_16-34-03.jpg), Berthold Werner, CC BY-SA 4.0: corbel gallery, upper windows and roof parapet.
- [Tour de Belem detail 1 082006](https://commons.wikimedia.org/wiki/File:Tour_de_Belem_detail_1_082006.JPG), Patrick Clenet, CC BY-SA 3.0: ribbed cupola, staged corbel and finial.
- [Lisbon holiday (18798806522)](https://commons.wikimedia.org/wiki/File:Lisbon_holiday_(18798806522).jpg), Bryn Pinzgauer, CC BY 2.0: interior reference only; interior vaults are omitted.
- [Belem.Torre09](https://commons.wikimedia.org/wiki/File:Belem.Torre09.jpg) and [Belem.Torre04](https://commons.wikimedia.org/wiki/File:Belem.Torre04.jpg), Georges Jansoone, CC BY 2.5: sunken court, stone balustrade and bastion turrets.

Photographs stay in ignored scratch. Original source/mesh by Codriver; mapped data © OpenStreetMap contributors, ODbL 1.0. The OSM web page was unavailable through the browser, but exact geometry and tags were supplied in the dossier.

## Frame, dimensions and ownership

Real metres, +X east, +Y up, +Z south. Origin `[-9.2159, 38.6917215]` is the average of the four mapped keep corners. Local y=0 is the lowest water-level masonry footing; it is not a sea-level altitude. The local tower east edge uses mapped control points `[-9.2159569,38.6917843]` and `[-9.21582,38.6917664]`, giving 9.510° south of east. That rotation is baked into geometry and GLBs, never applied again by the host. River facade bearing is 170.49°.

| Feature | Model dimension | Status |
| --- | ---: | --- |
| Keep including upper finials | 30 m | Published approximate height; dossier/Wikipedia |
| Square keep core | 12.1 × 12.1 m | Mapped OSM way 1386962089 |
| Entire base length / width in tower frame | about 44.5 / 28.1 m | Mapped base way 1386969006 |
| Lowest slab top | 1.2 m | OSM tagged height |
| Court floor | 3.24 m | OSM tagged inner platform |
| Bastion terrace / merlon top | 5.7 / 7.475 m | Photo estimates |
| Bastion turret finials | 11.7 m | Photo estimate |
| Keep wall / roof coping | 26.2 / 27.665 m | Photo estimates |
| Seven veranda arches | 1.38 m clear width, 2.15 m height | Photo estimates; count sourced |
| Veranda floor / roof high edge | 12.72 / 16.9 m | Photo estimates |
| Court outline | approximately 6 × 11.4 m | Mapped way 1386962088 |

Eleven exact provider way IDs are recorded in `footprint.js`: 24341353, 1386962089, 118490305, 1386969006, 1386962088, 1386969007, 1386969008, 1466504958 and the three detail parts 1466520766/67/68. The three detail rings are smaller than the shared conformance minimum of 4 m², so their containing tower ring supplies coverage while retaining their IDs. Eight rings include the full slab, keep, balcony and northeast entrance annex; neighbouring cafes and bunkers are excluded.

## Modelling decisions

The generator is self-contained and uses Three.js plus `assetBuilder`. Two merged materials, `stone` and `recess`, share names in both palettes. Day limestone is `#b7ad99`, night `#736e60`; opening backs are dark stone shadows, not emissive glass. All facade arches and embrasures are holes cut into thick stone walls with recessed backs, rather than applied dark stripes. The court remains open down to its floor. Roof and bastion battlements, ten turret silhouettes, seven veranda arches and paired window rhythm survive in far.

Near adds integral lobed cupola ribs, more corbels, shield crosses and small side balconies. Far reduces curved segments and drops secondary balcony details. The tower remains a rigid building; there is no road or walkway ownership. The modern shoreline access bridge is omitted. Shields, finials and Manueline tracery are geometric approximations; no heraldic inscriptions, sculptural beasts, weathering texture or interior vaults. Bastion dimensions and orientation are mapped; terrace and architectural tier heights are estimates, not a measured conservation model.

## Verification

Final exported default-scene metrics:

| Variant | Triangles | Draws | Bytes | KiB |
| --- | ---: | ---: | ---: | ---: |
| Near | 17,909 | 2 | 777,296 | 759 |
| Far | 7,667 | 2 | 382,768 | 374 |

The near/far bounds are identical, about 35.05 × 30 × 48.55 m in the geographic frame. Both budgets have headroom. `qa-metrics.mjs --ids belem-tower` reports no issues, zero coplanar pairs, zero layered-face area, no below-grade geometry and 0% back-face hits in 262 near rays. Its generic window/member heuristic does not classify `recess` or `stone`; the explicit geometry tests and visual comparison cover those features.

Required focused test command passed **630/630** tests, including eight landmark-specific tests. These pin the 30 m top and water-level base, mapped envelope, square core, all seven veranda openings, open courtyard, ten turret crowns, and court coping contacts to named first/last stone piers in both LODs. A deliberately shortened coping endpoint fails the support-distance condition. Source/GLB bounds and materials are also checked by shared conformance.

`node scripts/asset-catalog.mjs` passed with 336 entries / 654 variants; `pnpm assets:preview` built the ignored local inspector successfully. The initial catalog errors concerned other builders' unfinished records; the final run passed. Depth layers were regenerated with `--ids belem-tower`, the subsequent `--check` passed, and no cycle edges were dropped.

I looked at `tmp/top-cities/shots/belem-tower/export-reference-comparison.jpg`, which places the reference photographs above these final exported sheets:

- `belem-tower-glb-near-light-sheet.jpg`: overview, facade, back, roof, entrance and close detail.
- `belem-tower-glb-far-light-sheet.jpg`: overview, facade, back and roof.
- `belem-tower-glb-near-dark-sheet.jpg`: overview and close detail.
- `belem-tower-glb-far-dark-sheet.jpg`: overview and river facade.

The first sheet exposed reversed dark window backs, which were corrected; it also prompted the northeast gate. Geometry QA then exposed an overlapping court cap, which was removed. Final sheets show visible arched recesses, the open court, cupolas and separated battlements in both LODs. Stone relief remains smoother and less ornate than the photos.

## Integration handoff

Cityscape: **not tested yet**. Full 3D world: **not tested yet**; integration is checked separately. The declared bounded median pad uses the mapped slab as its reference and feathers 3 m; its water/shore datum, lattice coverage, entrance contacts and DEM residuals require app verification. No app server, runtime layer, provider mask implementation or rollout gate was changed. Independent exported-asset review and unobstructed app shots in both modes remain with the lead. The only shared source file touched is the authorized generated `depth-layers.js`.
