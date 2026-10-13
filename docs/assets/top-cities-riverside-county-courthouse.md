# Riverside County Courthouse — original Main Street range

Original, texture-free procedural model of the present restored Main Street range at 4050 Main Street, Riverside, California. The [official court location page](https://www.riverside.courts.ca.gov/location/riverside-historic-courthouse) identifies it as a 1903 Beaux-Arts classical revival courthouse, restored in 1994–1998. The [official self-guided tour](https://riverside.courts.ca.gov/system/files/2024-06/Historic%20Courthouse%20Self-Guided%20Handout%20%28Final%29.pdf) identifies Franklin Pierce Burnham, the Grand/Petit Palais inspiration, 1903 dedication and June 23, 1904 construction completion. Its four attic sculpture groups inform the modeled three-figure silhouettes; fine iconography is simplified.

## Geographic frame and ownership

Origin `[-117.37557,33.97923]`; real metres, east/up/south, local rigid foundation at y=0. Rotation -119.1° is baked into vertices. No absolute altitude, terrain elevation or Mercator stretch is included. The [mapped original range](https://www.openstreetmap.org/way/118524342), way 118524342, is the sole replaced building. Two control points on its Main Street wall, `[-117.3758964,33.9790436]` and `[-117.3757881,33.9792076]`, give a 28.7° longitudinal axis (individual wall returns vary); -119.1° fits the full long outline. The frontage faces approximately 299.1°.

The complete western historic range, including its rear central stair projection and end pilasters, is modeled. East additions 779436929/779436930 remain provider-owned; encompassing relation 17923242 is not masked wholesale. The second footprint ring covers the modeled entrance stair only. Cornices have up to 0.7 m overhang beyond the mapped walls.

| Feature | Metres / value | Basis |
| --- | --- | --- |
| Main range | approximately 80 × 39 | mapped OSM envelope in rotated authoring frame |
| Main Street orientation | frontage 299.1°, baked rotation -119.1° | mapped wall control points and full outline |
| Plinth / entrance level | 2.2 m | photo estimate |
| Wing cornice | 11.9 m | photo estimate |
| Central cornice | 14.3 m | photo estimate |
| Highest sculpture | approximately 20.7 m | photo estimate; no published elevation found |
| Central portico | six shafts, two inner pairs | present facade photo |
| Central shaft radius | 0.53 m | photo estimate |
| Stair | 11 risers × 0.20 m, 4.4 m run | simplified photo estimate |

## Geometry, materials and references

Cream stone facade shells have actual recessed window/door openings. Main Street wings retain individual tall windows behind slender columns; the central portico remains open behind six shafts, including the two inner pairs. Tapered shafts, Corinthian leaf/volute crowns, stepped entablatures, dentils, continuous balustrades, medallions, four grouped attic sculptures, smaller pier reliefs, urns and a broad stair distinguish this courthouse from a generic rectangular extrusion. Rear two-row windows and roof surfaces are reconstructed from the mapped range, with no dedicated aerial/rear reference.

Near includes flute ridges, capital leaves, mullions, masonry courses and stair rails. Far retains the open colonnade, individual window bays, stair, pylons, statues and balustrades with fewer profile rings and radial segments; stair rails and subpixel courses are dropped. Six material names in both themes: subdued cream stone, dark glass, bronze sash/doors, grey roof, iron and sparse self-lit occupancy panes. Night lighting is illustrative, not a surveyed installation.

Looked at the prepared reference sheet `tmp/top-cities/riverside-county-courthouse/refs-sheet.jpg` and full present facade `refs/5.jpg`. Checked photographic references:

- [Riverside County Court House 1903 2.jpg](https://commons.wikimedia.org/wiki/File:Riverside_County_Court_House_1903_2.jpg), nccmrm97, CC BY-SA 2.0: restored portico, paired shafts, capitals, balustrades and attic sculpture proportions.
- [Exterior view of the Court House in Riverside, ca.1910 (CHS-5280).jpg](https://commons.wikimedia.org/wiki/File:Exterior_view_of_the_Court_House_in_Riverside,_ca.1910_(CHS-5280).jpg), C. C. Pierce, public domain: long wings, end pylons and relative massing.
- Prepared historical postcards: Court House, Riverside, Cal. (pcard-print-pub-pc-38a).jpg, unknown author, public domain; 06873--1906--Brück & Sohn Kunstverlag.jpg, Brück & Sohn, CC0: whole-facade proportions. Interior dossier image was not used to reproduce any interior.

All photographs remain ignored reference scratch. No mesh, scan, image or texture is shipped. Old Orange County Courthouse was studied for batched shell construction and meaningful raycast tests, not copied.

## Verification evidence

The first six-view procedural contact sheet `tmp/top-cities/shots/riverside-county-courthouse/riverside-county-courthouse-procedural-near-light-sheet.jpg` was opened: overview, facade, back, roof, street and close detail. It exposed a 0.47 m gap between central capitals and the entablature; shafts were raised to close it. Seated sculpture torso/head contact was corrected, and far profile rings reduced while retaining silhouettes. Final exported evidence and measured costs follow below.

Cityscape: **not tested yet**. Full 3D world: **not tested yet**. Contact sheets verify authored/exported geometry only. The asset remains rigid at local grade; no app server was started.

The final exported contact sheet `tmp/top-cities/shots/riverside-county-courthouse/export-reference-contact-sheet.jpg` was opened beside the historical oblique and restored front photographs: all six views (overview, facade, back, roof, street, detail) in near/far and light/dark. The separate exported near/light and far/dark six-view sheets were also opened at their full sizes. Central capital contact is now closed, the paired-shaft gaps remain open, and the far export retains the discrete window rhythm and full sculpted roofline. The exported plan `riverside-county-courthouse-glb-near-light-top.png` in that folder was opened to check the mapped skew and red outline against the body and stair. Exact carved foliage, letterforms and sculpture iconography remain stylized; the back and low roof are explicit estimates. No unresolved visible gaps or deterministic geometry defects remain.

The first depth scan found a roof/stone cycle caused by a buried central roof slab. That slab and hidden roof undersides were removed, then the exported scans were rerun: zero dropped cycle edges, zero layered/coplanar issues, zero back-face sweep hits, no unsupported-end or far-window-rhythm flags. The QA artifact is `tmp/top-cities/riverside-county-courthouse/qa-metrics.json`. No bridgeLift attribute remains.

| Export | Triangles | Draws | Bytes | KiB |
| --- | ---: | ---: | ---: | ---: |
| near | 42,892 | 6 | 1,676,044 | 1636.8 |
| far | 9,804 | 5 | 439,604 | 429.3 |

Rebuild: `pnpm build:top-cities-landmarks riverside-county-courthouse --no-check`. Regenerate/check material depths with `node scripts/landmark-depth-layers.mjs --ids riverside-county-courthouse` and `--check`. Landmark-specific tests pin the mapped envelope, grade, sculpture tip, six central shafts, paired gaps, three recessed entrances, wing window bays, actual column-to-entablature contacts in both LODs, stair rail endpoint contact with actual post triangles and a deliberately shortened negative case, and identical near/far bounds. All eight landmark tests pass in approximately 2.1 seconds; all eleven selected landmark/conformance checks pass. The global catalog validates 336 records / 642 variants, and the targeted depth check passes. The exact combined conformance run is recorded in `tmp/top-cities/riverside-county-courthouse/acceptance-test.txt`; final result below.

Final exact acceptance run (2026-10-13): `node --test src/peregrine/landmarks/top-cities/top-cities.test.js src/peregrine/landmarks/top-cities/riverside-county-courthouse/riverside-county-courthouse.test.js` passes **624 / 624 tests**, zero failures, in 89.3 seconds. The global catalog check and targeted depth-table check also pass; earlier transient missing Concorde documentation was completed by its owner and is no longer a blocker. No shared file changes were needed except the explicitly authorized generated depth table.
