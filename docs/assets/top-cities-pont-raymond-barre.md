# Pont Raymond-Barre — Lyon

Original procedural model of Alain Spielmann / Setec's white steel bridge across the Rhône at Confluence, completed in September 2013, carrying tram T1 from February 2014, pedestrians and cycles. Two outward-canted box arches flank the tramway over **one main span**; they are not two consecutive arched spans. The downstream cantilever carries a timber promenade, cycle route, belvedere and red seating. No motor road, road layer, HD pavement fitting or navigation override is authored.

## Sources and dimensions

Primary technical reference: [AFGC Rhône-Alpes visit, Bulletin 16, January 2014, pages 48–54](https://www.afgc.asso.fr/app/uploads/2014/06/04-Pont-Raymond-Barre-Lyon.pdf). Also [Setec ALS](https://als.setec.fr/realisations/pont-raymond-barre), [regional heritage inventory](https://patrimoine.auvergnerhonealpes.fr/dossier/IA69001578) and [architect's project](https://spielmann-chirino.com/pont-raymond-barre-a-lyon/).

| Feature | Reference | Authored interpretation |
| --- | --- | --- |
| Structural length | 260 m in summary, 262.60 m between abutment axes in AFGC detailed design | 72.6 m west approach, 150 m arch, about 38 m east structural approach, then mapped platform extension |
| Spans | 72 / 150 / 38 m summary; AFGC detailed description distinguishes 50.8 m plus 27.4 m triangulated zone, 145 m under arches and 36.9 m | Published nominal 150 m arch span retained; no false claim of engineering as-built fidelity |
| Arch crown | 17.5 m above deck | 17.5 m outer crown rise; total model top y=25 m |
| Lean | 10° outwards | 10° in each arch plane |
| Arch section | Crown 2.5 × 1.15 m | Crown 2.5 m vertical × 1.15 m lateral, tapered to 1.6 m at ends |
| Deck width | Useful 17.5 m | Actual OSM outside edge, roughly 16.8 m at central station; width varies at banks and belvedere |
| Track platform | 7.25 m | Two track centres 3.2 m apart, four rails of 1.435 m gauge |
| Hangers | 55/75 mm closed cables at 8 m spacing | 75 mm near, 130 mm far; 8 m / 16 m spacing, radial end shift estimated |
| Main box ties | 1.5 m wide, 1.5–1.8 m deep | 1.5 m wide, about 1.5 m deep |
| River supports | Broad P1 cap, triangulated knees/backslope; paired inclined P2 shafts | Simplified closed steel knees and concrete cap/shafts; footing dimensions estimated |
| Main deck datum | No surveyed elevation authored | Flat-map y=7.5 m; feet y=0, bank tips y=0.55 m; illustrative ramp profile |

The sloping approaches are a flat-map convention rather than the real 3.4/3.8% longitudinal gradients and central vertical curve described by AFGC. Supports, end blocks, furniture, lights and wire layout are visual estimates. The exported model is a landmark, not a survey or structural model.

## Geographic frame and ownership

Local metres +X east, +Y up, +Z south around `[4.82013,45.73273]`. Main crossing bearing **138.5583°**, derived from T1 [way 193465144](https://www.openstreetmap.org/way/193465144), shifted 1.6 m towards the other track to obtain the pair's centre. Curved bank alignment is read from adjoining T1 ways 1499609203 and 1499609202. Rotation is baked exactly once.

`FOOTPRINTS` and `OSM_WAYS` preserve the complete [bridge/platform way 249574877](https://www.openstreetmap.org/way/249574877), not neighbouring Pont Pasteur or the Musée des Confluences. The deck is lofted between actual polygon intersections at each station, including every mapped edge vertex. The approximately **319.9 m projected station envelope** includes bank platform beyond the nominal 260 m structure; it is not used to rescale the main span. Rails follow the curved mapped track centre. Narrow mast/beam projections can exceed the polygon slightly; the deck envelope itself is pinned by a test.

Two small 8 m bank pads with median reference samples avoid a river-spanning default disc. No DEM or absolute NGF height enters the mesh.

## Geometry, materials and provenance

Closed procedural box-arch lofts, merged radial hangers, separate tram rails, white box ties and cantilever beams, asymmetric P1 support, paired P2 shafts, open guardrails, leaning overhead-line masts, wire spans and red benches. Near has 72 segments per arch; far has 24 and keeps the arch openings, supports, rails, sparse hangers and guardrail rhythm. Far omits benches and coarsens deck subdivision. Materials are named and texture-free, with paired light/dark palettes; small `lamp` heads represent lighting without a copied emissive photograph.

All geometry is original. Geographic data © OpenStreetMap contributors, ODbL 1.0. The dossier's Commons photos were inspected: Daniel CULSAN's `Pont Raymond-Barre à Lyon.jpg` and Babsy's `Tram Passerelle Raymond Barre.JPG` (CC BY-SA 4.0), Tibidibtibo's `PontRaymondBarre Lyon Citadis.jpg` (CC BY-SA 3.0), plus construction views by Otourly and Pom445 (CC BY-SA 3.0). Links and credit are in the catalog record. The extra completed-bridge photograph from [Dillinger](https://en.dillinger.de/references/dillinger-heavy-plate-for-the-bow-string-bridge-raymond-barre-in-lyon/?id=8079) is copyright Dillinger, reference only, kept in ignored scratch with no redistribution claim. A Structurae download returned HTML and was not used. No photograph, texture, scan or third-party mesh is committed or embedded.

## Verification

The first procedural contact sheet at `tmp/top-cities/shots/pont-raymond-barre/pont-raymond-barre-procedural-near-light-sheet.jpg` was inspected against the supplied `refs-sheet.jpg` and the Dillinger completed-bridge view. It shows the low elongated twin arches, broad downstream deck and asymmetric support. The support-contact test prompted lowering the P1 back-knee terminal into the tie's underside. Material ordering then prompted separating the under-deck steel material from above-deck arches/curb, so the same material is not simultaneously in front of and behind the tram surface.

Dedicated tests pin the 150 m span, 17.5 m rise, outward lean, genuine negative space under both arches, track and walk materials, four rails, support bodies, mapped deck containment and near/far bounds. Every authored hanger, knee, crossbeam, rail, guardrail, mast and overhead-wire member records its named support terminals; tests measure their nearest support triangles while excluding the member itself. A deliberately shortened hanger proves the check fails on an unsupported free end. These tests are geometric checks, not proof of real structural engineering.

Export costs, final exported visual evidence and check results are appended below after final export.

## Integration status

| Case | Status |
| --- | --- |
| Procedural geometry and GLB round trip | Verified locally |
| Near/far, light/dark inspection | Export review recorded below |
| Cityscape app placement/provider replacement/shading | Not tested yet; integration is checked separately |
| Full 3D world, bank pads/DEM feet/approach continuity | Not tested yet; integration is checked separately |
| Road/HD pavement/car-route fitting | N/A: tram, pedestrian and cycle bridge |
| Mode changes, lifecycle/load fallback, reanchor | Not tested |
| Tesla/device performance | Not tested |

Rebuild: `pnpm build:top-cities-landmarks pont-raymond-barre --no-check`. No server, full test suite, install, git write or deployment was run by this builder.

## Final exports and evidence (2026-10-15)

| LOD | Triangles | Draws | Bytes | KiB |
| --- | ---: | ---: | ---: | ---: |
| Near | 33,246 | 9 | 1,797,576 | 1,755.4 |
| Far | 10,642 | 8 | 581,136 | 567.5 |

Both are well below bridge budgets. Costs describe default-scene geometry, not device performance. Normals, bounds and named materials pass the registry GLB round trip. Both LODs preserve exactly the same bounds, and the main deck/arch opening and crown dimensions pass independent geometry queries.

Looked at **`tmp/top-cities/shots/pont-raymond-barre/final/reference-export-sheet.jpg`**, which places the supplied photo sheet and completed Dillinger bridge photo beside exported near/light (overview, front, back, above, deck, underside and detail), far/dark (overview, front, back, deck and underside), near/dark (overview and deck), and far/light (overview and front). Individual PNGs and the four theme/LOD sheets are in the same `final/` folder. The low white arches, clear opening, twin tracks and downstream promenade remain readable in far/night. After the initial source inspection, the final export check confirmed the knee terminal change and capped overhead mast arms. Two look/fix rounds were used; no further geometry iteration was necessary.

Final `tmp/top-cities/pont-raymond-barre/metrics.json`: empty issues list, zero near coplanar pairs, zero near/far layered-face edges, zero back-face sweep hits, and zero unsupported member-end candidates (214 near / 132 far components screened). Named support tests independently cover the merged geometry and verify that both longitudinal tie ends meet local grade. A shortened hanger is rejected in each LOD.

Passed: eight dedicated landmark tests; all three Pont Raymond-Barre conformance checks in the prescribed combined registry invocation; `node scripts/asset-catalog.mjs`; `pnpm assets:check`; `pnpm assets:preview`; depth-table regeneration and `node scripts/landmark-depth-layers.mjs --ids pont-raymond-barre --check`, with **zero dropped cycle edges**. The only shared source written was the authorized generated `src/peregrine/landmarks/depth-layers.js` entry.

The prescribed combined invocation finished **812/814 passing**: the two failures belonged to the concurrently authored `palais-bourbon` (ready/catalog disagreement and missing `public/models/buildings/palais-bourbon.json` at the time of the run). No other landmark was edited. Full log: `tmp/top-cities/pont-raymond-barre/final-tests.log`. Palais Bourbon work subsequently ceased blocking catalog validation.
