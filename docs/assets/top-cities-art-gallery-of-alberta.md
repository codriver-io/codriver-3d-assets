# Art Gallery of Alberta — Edmonton

Original procedural model of Randall Stout’s 2010 building at 2 Sir Winston Churchill Square, retaining its brushed stainless-steel Borealis ribbon, glazed southwest atrium and zinc gallery volumes.

## Sources and dimensions

- [AGA official building page](https://www.youraga.ca/about/building): Randall Stout, 2010 opening, 190 m ribbon, three exhibition floors and 7,900 m² total floor area. The 190 m includes interior continuations; it is not the length of the three exterior model lofts.
- [Zahner fabricator](https://azahner.com/projects/art-gallery-of-alberta/): stainless-steel Borealis and preweathered zinc cladding.
- [DeSimone structural engineer](https://www.desimone.com/projects/art-gallery-of-alberta): three storeys, 2010 completion and hybrid steel framing supporting the ribbon.
- [OSM way 221525672](https://www.openstreetmap.org/way/221525672): complete provider envelope, 2,372 m² mapped area. No height tag. Dossier includes surrounding parts; all belong to neighbours and are excluded.
- Dossier refs-sheet.jpg and reference photos 3–6 were compared; credits and licences are in the catalog. IQRemix and Mack Male photos: CC BY-SA 2.0; Darren Kirby construction photo: CC BY-SA 3.0. Only reference storage contains photographs; no textures or external meshes ship.

| Feature | Model | Basis |
| --- | --- | --- |
| Highest rear crest | 31 m | Photo estimate, not surveyed |
| Gallery volumes | 13–22 m | Photo estimates |
| Atrium summit | 26.35 m | Photo estimate |
| Corner frontage | 38 m | Mapped/photo estimate |
| Ribbon sheet thickness | 0.32 m | Representational estimate |
| Ribbon real developed length | 190 m | AGA official; includes interior |
| Local base | y=0 | Entrance-grade rigid datum |

## Frame, modeling and ownership

Origin [-113.48869,53.54491]; metres, +X east/+Y up/+Z south. Two mapped east-edge controls [-113.488155,53.5450613] and [-113.4881069,53.5447998] establish a north/south street axis near 174°; transverse grid is approximately 96.2°. Rotation is baked once. Southwest frontage outward bearing approximately 231°. Exact OSM outer ring owns the whole gallery; surrounding Chancery Hall, Century Place, City Hall, Law Courts and shelters are excluded. Slight ribbon overhangs are projected inward to this envelope.

Connected closed original lofts describe the lower entrance wave with a deep descending right tip, upper oval return around the glass, and rear high crest. They approximate the continuous interior/exterior Borealis rather than reproduce its construction surface. The west lower rail now enters the zinc box continuously; the upper return and rear crest share the full junction rail. The atrium has two canted planar fronts meeting at a pointed 26.35 m entrance summit, a vertical entrance bay and individual panes/frame bars in both LODs. Cool silver steel has darker reverse skins and modest PBR sheen; the app uses the palette and normal shading. Sheet thickness follows the actual surface normal so folded back skins cannot face outward. Near adds zinc panel joints. Restrained light/dark palettes use warm lower panes at night. Foundation is a shallow mapped rigid plinth, with a footprint-limited median terrain pad; no elevation or Mercator stretch is baked in.

Interiors, changing exhibition graphics, fine steel panel seams, exact steel substructure and detailed rear service apertures are omitted. Glazing is opaque. No hardware performance measured.

## Validation and integration

Initial procedural near/light sheet: tmp/top-cities/shots/art-gallery-of-alberta/iteration-1/art-gallery-of-alberta-procedural-near-light-sheet.jpg, six views (overview, facade, rear, roof, entrance, detail). Inspection prompted replacing the flat atrium top with a pointed summit to expose the upper loop. Final exported near/far light/dark contact sheets were compared beside dossier photos 5 and 6 in `tmp/top-cities/shots/art-gallery-of-alberta/final/export-reference-comparison.jpg`. Each sheet covers overview, facade, rear, roof, entrance and detail; full sheets are in `final/{near-light,far-light,near-dark,far-dark}/art-gallery-of-alberta-glb-{detail}-{theme}-sheet.jpg`. Final correction made every transom follow the curved glass summit. The exported model retains the three steel gestures and consistent silhouette in both LODs. The simplified opaque glass, smooth unpanelled steel, schematic rear service facade and approximate continuous ribbon remain modeling limits, not measured construction geometry.

Cityscape: **visible placement verified in g13ar captures**. Full 3D world: **visible rigid placement verified in g13ar captures with terrain enabled**. Full integration lifecycle remains not tested. App evidence is from scratch /tmp copies only; no shared app bundle, deployment or git write performed.

## Export costs and checks — 2026-10-15

| LOD | Triangles | Draws | Bytes | KiB |
| --- | ---: | ---: | ---: | ---: |
| near | 13,432 | 8 | 364,204 | 355.7 |
| far | 3,360 | 7 | 118,572 | 115.8 |

Both GLBs are texture-free and self-contained; no decoder extensions, removable bridgeLift attributes or below-grade parts. Identical near/far bounds; all vertices stay within the owned envelope including 0.8 m provider tolerance. Nine focused tests cover ownership, grade/height, upper oval and entrance opening, descending tip, pane rhythm, portal jamb contacts, every upright footing/top, all transom endpoints with named upright supports, deliberately unsupported negative examples, and exported bounds/normals/material round trips. Focused tests run in less than 0.5 s.

`qa-metrics.mjs --ids art-gallery-of-alberta`: no issues. `landmark-depth-layers.mjs --ids art-gallery-of-alberta` regeneration and `--check`: pass, zero cycle edges dropped. Catalog validation: 406 entries, 800 GLB variants; local asset preview build passes. Initial shared-catalog failure was another worker’s temporarily missing Parthenon Nashville document, now resolved. Final shared top-cities conformance plus all nine focused tests passed **844/844**, recorded in `tmp/top-cities/art-gallery-of-alberta/tests-final.txt`.

## Review repair g13ar — 2026-10-15

The independent review identified plaster-like steel, the west fish-tail cusp, a drum-like atrium and disconnected upper/rear lofts. Replaced the clipped west curl with a broad embedded return, flattened the lower cross-section, joined the rear sweep to the upper rail, changed steel to cool silver (#c9ccd0) with darker reverse surfaces, and faceted the pointed atrium. Two exported look rounds were used: `tmp/next-200/fix/g13ar/art-gallery-of-alberta/iteration-1/` and `final/{near,far}/`. Final geometry QA then caught reverse-skin exposure on the folded roof: offsetting thickness along the surface normal corrected this without another look-fix round. Final QA: 0.9% back-face hits, no coplanar/layered faces or material cycles. All nine landmark assertions pass, including all pane/mullion roof and plinth contacts, and texture-free export round trips. Steel sheen in app remains a palette/normal approximation, since runtime shading is unlit.

App evidence uses a dedicated /tmp bundle on slot K, never the shared public renderer. `tmp/next-200/fix/g13ar/art-gallery-of-alberta/app/{city,world}/{far,near,street,rear}.png` and the adjacent reports record visible placement, LOD and terrain state. These views check the visible model and provider replacement; full terrain-arrival/lifecycle and hardware tests remain unverified.

Current review checks: both assigned landmarks pass their focused conformance checks (6 registry/export assertions) and all 14 combined landmark tests; catalog validation and assets preview pass. Required full top-cities conformance completed 834/835 with one unrelated `palais-du-luxembourg` exported near `trim` material mismatch; see `tmp/next-200/fix/g13ar/conformance.log`. No edits were made to that landmark.

The upper/rear junction is exported as one manifold shell, removing coincident cap faces visible as a dotted seam in app shots; final both-mode app captures were refreshed after that closure repair. Final geometry costs above supersede the two look-round sheets; the final app images show the actual latest export.
