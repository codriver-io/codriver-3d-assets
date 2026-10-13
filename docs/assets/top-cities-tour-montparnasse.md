# Tour Montparnasse, Paris

Original procedural model of the dark bronze-glass tower completed in 1973 at 33 Avenue du Maine. This depicts the familiar original exterior, not a proposed refurbishment. The recognizable features are its two bowed long faces, shallow concave end rebates, dense dark vertical mullions, fine horizontal window rows, flat open observation terrace and slender antenna. No scan, third-party mesh, photo or texture ships.

Sources checked 2026-10-13: [Wikipedia](https://en.wikipedia.org/wiki/Tour_Montparnasse) gives 1973 completion, 210 m roof and 59 occupied floors (60 in the infobox); [OSM tower way 16406633](https://www.openstreetmap.org/way/16406633) gives the footprint, glass, 210 m and 59 levels. Reference imagery remains in ignored dossier storage. The unrelated La Défense skyline and interior shopping photo were excluded from exterior modeling.

| Dimension | Model | Basis |
| --- | --- | --- |
| Roof slab / terrace deck | 210 m | Published roof height; OSM agrees |
| Highest antenna point | 214 m | Estimated 4 m above deck; SPEC.height includes mast |
| Shaft / lobby top | 209.2 / 5.6 m | Estimated roof collar and double-height lobby |
| Long plan envelope | 61 m | OSM about 62 m, allowing trim inside ownership |
| Midshaft / end width | 38.4 / 25 m | OSM approximately 39 / 26 m |
| End concavity | 4 m | OSM end rebates |
| Window rows | 58 near / 29 grouped far | Estimated facade grouping; lobby separate |
| Perimeter bays | 84 near / 44 far | Estimated mullion pitch, not a published count |
| Terrace rail / access enclosure | 1.4 / 1.2 m above roof | Photo-informed approximations |

Origin `[2.32197945,48.842112875]`, real metres +X east / +Y up / +Z south. Local y=0 is rigid flat grade. Two end control points `[2.3222448,48.84232825]` and `[2.3217141,48.84189625]` are midpoints of the mapped end corners, establishing approximately 39 degrees east of north. Rotation is baked once. The plan uses parabolic convex sides and recessed short ends fitted inside the OSM envelope; it preserves the tower's lens identity without tracing a photograph. Only way 16406633 is replaced: Maine Montparnasse shopping complex, detached kiosks and surrounding buildings stay provider-owned.

The facade is built from disjoint glass quads, bronze floor spandrels and projecting dark ribs with closed side returns. There is no overlapping backing shell. Shared mitered rib corners close the edges; a rim closes the roof slab. Sparse hashed illuminated panes use `glow`, with a subdued daytime colour and warm night occupancy. Far retains curved silhouette, roof members, antenna and separate coarser window rows/bays. Roof posts bear on the slab and rails join their heads. The roof hut, antenna arrangement, exact entrance placement and rail density are approximations. No terrain heights or latitude stretch are baked into the GLBs.

Build: `pnpm build:top-cities-landmarks tour-montparnasse --no-check`. Focused tests pin roof height, mast, bowed plan, glass/spandrel rows, projecting ribs, terrace supports (including a shortened-post negative case), footprint containment, LOD envelope and GLB round trip. Depth-table regeneration/check and deterministic QA accompany export; measured costs and judged screenshot paths are recorded below after final verification.

Cityscape: **not tested yet, integration is checked separately**. Full 3D world: **not tested yet, integration is checked separately**. Static export evidence does not certify either mode or Tesla performance.

Measured final exports (uncompressed default scene):

| Variant | Triangles | Draws | Bytes | KiB (rounded) |
| --- | --- | --- | --- | --- |
| Near | 24,080 | 6 | 1,310,564 | 1,280 |
| Far | 7,008 | 6 | 386,716 | 378 |

Judged the final exported GLB sheets at `tmp/top-cities/shots/tour-montparnasse/tour-montparnasse-glb-{near,far}-{light,dark}-sheet.jpg`, and `reference-export-comparison.jpg` with the two exterior reference photographs beside near/far and light/dark exports. Near light includes overview, back, roof, street, facade detail, entrance and plan; the other three sheets include overview, back, roof and detail. The dark monolith, curved plan and finer near window rhythm agree with the exterior references; the far grid is deliberately grouped. The first review led to closing rib corner seams with shared miters and roof-rim faces, rotating the entrance lintel along the long axis, and widening the rear camera to show the complete shaft. Final plan view sits inside the red mapped ring. The original bronze glass is subdued; sunrise reflection in the June reference is not modeled as a gold facade. Roof equipment and entry details remain simplified estimates.

Verification: eight landmark-specific tests pass in about 0.45 s, including every terrace rail endpoint against a named post, every post foot against the roof excluding the post, mast against pedestal, and negative shortened-member checks. Catalog validation passed (336 entries / 628 GLB variants at that checkpoint). Depth regeneration/check passed with zero dropped cycle edges. Deterministic QA reports no issues, 0% back-face hits, no layered or coplanar conflicts, no removable attributes, and within-budget LODs. `tmp/top-cities/tour-montparnasse/metrics.json` holds the detailed measurements. The requested combined top-cities plus landmark test command passed 614/615 at the shared-tree checkpoint: the sole failure was another builder's **Concertgebouw catalog status vs SPEC.ready** mismatch; all Tour Montparnasse checks passed. No shared runtime source was edited; only the permitted generated depth table was regenerated.
