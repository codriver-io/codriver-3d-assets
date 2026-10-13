# Atomium — Brussels

Original procedural model of the post-2006 stainless-steel Atomium on the Heysel plateau, opened for Expo 58 in 1958; André Waterkeyn, André and Jean Polak. Sources checked 2026-10-13. Source: `src/peregrine/landmarks/top-cities/atomium/`; repeatable export: `pnpm build:top-cities-landmarks atomium --no-check`. No scanned/traced mesh, texture, retained photograph or external runtime authoring dependency.

## Dimensions and references

| Feature | Model value | Source / qualification |
| --- | --- | --- |
| Height | 102 m | [Atomium operator](https://atomium.be/the_atomium_in_figures) |
| Spheres | Nine, 18 m diameter | Same primary source |
| Tubes | Twenty, 3.3 m diameter | Same primary source |
| Clear sphere-to-sphere edge span | 29 m | Same primary source; centre spacing derived as 29 + 18 = 47 m |
| Cube edge / body diagonal | 47 / 81.406 m | Derived exact regular body-centred crystal geometry |
| Base pavilion diameter | 26 m | Same primary source |
| Lowest sphere centre | 11.594 m | Derived from 102 m overall height, 9 m radius and body diagonal |
| Lower / upper lateral centres | 38.729 / 65.865 m | Exact corner-up cube projection |
| Pavilion roof | 2.6 m | Estimated to meet the lowest sphere without interpenetration |
| Bipod spread / rail thickness | 10.2 m at grade, 4.6 m at sphere / 1.8 m | Photo-estimated |
| Windows / lamps | Sparse triangular shell panes / individual light points | Representative photo-inspired layout, not an as-built panel survey |

[Identity and renovation](https://en.wikipedia.org/wiki/Atomium) supports the current stainless-steel version. Viewed the provided `tmp/top-cities/atomium/refs-sheet.jpg`: exterior twilight overview by Pierre Blaché (CC0), sphere close-up by Trougnouf / Benoit Brummer (CC BY-SA 4.0), support/exterior stair views by Storyteller23 (CC BY-SA 4.0), with interiors by Axel Kirch and Storyteller23 (CC BY-SA 4.0). Added one missing daylight opposite view: [Atomium 07-2016](https://commons.wikimedia.org/wiki/File:Atomium_07-2016.jpg), Umberto NURS, CC BY-SA 4.0, saved only as ignored `refs/7.jpg`. Titles/credits/licences and checked links are in the catalog and dossier `refs/SOURCES.txt`. No reference imagery ships.

## Geographic frame and ownership

Origin `[4.34151995, 50.894925]` is the mapped central/top/bottom sphere axis, replacing the inaccurate dossier stub origin about 37 m southwest. +X east, +Y up, +Z south, real metres, rigid local grade y=0. No DEM, absolute altitude or latitude scaling is baked into exports. The second mapped control is the western lower sphere `[4.34095415,50.8949186]`; its local west vector is 1.02 degrees south of west. The three lower spheres follow this vector at 120-degree intervals; upper lateral spheres are their antipodes. Rotation is baked into source and exports once.

[OSM relation 19189218](https://www.openstreetmap.org/relation/19189218) supplies the complete star-shaped provider outer mask (way 1390675374), preserving open space geometrically in the authored model. `OSM_WAYS` lists its outline members and modeled stepped sphere/tube/support/lift/pavilion parts; tiny provider part rings are consolidated into the parent mask so no sub-4-square-metre mask slivers are shipped. Upper pole/flag provider parts are suppressed with the structure, although their detail is omitted. Nearby retail way 388842414, service ways 253872187/442102754, retail part 1390675662 and miniature 629397137 are excluded. These small annexes are not modeled. Provider replacement must still be independently checked in-app.

## Modeling and materials

An exact regular cube projects its [111] body diagonal vertically. Eight corner spheres plus one central sphere retain smooth radial normals in both LODs. Twelve edge tubes and eight centre-to-corner half-diagonal tubes terminate 0.22 m inside their named sphere shells. Three open bipods have six tapered inclined rails, three pairs of grade footings and four stair landings each. The low round pavilion and central ground lift meet the bottom sphere; no blanket ground box is used.

Subdued silver steel has metallic PBR response and low roughness. Pale tube cladding, grey supports, concrete, opaque blue-grey glazing and tiny self-lit lamps use six merged material draws. Triangular windows replace actual sphere triangles rather than overlaying a second shell; the pavilion wall is partitioned into individual panes. Far reduces spherical and tube tessellation while keeping every sphere, tube, bipod, landing and opening. Metal shine uses lights and normals only; no environment/photographic reflection texture. The app uses shared vertex shading, so inspector highlights are not a runtime approval claim.

Approximations: exact window distribution, steel panel joints, support stairs/rails and pavilion height; no internal exhibitions, full stair flights, detailed entry canopy, flag/pole, branding or timed light shows. The regular cube uses authoritative 29 m tube clearance rather than following OSM's oversized/irregular stepped sphere meshes. Modeled silhouette is 94.74 × 102 × 85.15 m. Night lighting is a representative sparse network of lamps.

## Costs and verification

| Export | Triangles | Draws | Bytes | KiB |
| --- | --- | --- | --- | --- |
| near | 16,464 | 6 | 588,412 | 574.6 |
| far | 7,776 | 6 | 296,080 | 289.1 |

Both LOD bounds are identical. Source tests measure actual batched vertices and sphere centres, 47 m edges/81.406 m diagonal, 18 m spheres, 102 m top and open gaps; all twenty tubes, six bipod rails, twelve landings and the ground lift have named support-surface endpoint checks in both LODs. A deliberately shortened tube fails its sphere contact, proving the check can detect a free end. Ground and ownership envelope tests retain neighbour exclusions.

Deterministic GLB QA: `tmp/top-cities/atomium/qa-metrics.json`, no issues; 0 depth cycles/dropped edges after `node scripts/landmark-depth-layers.mjs --ids atomium`, and `--check` current. Source-only Atomium tests: seven pass in about 0.24 s. Complete required conformance, catalog, preview and screenshot inspection results are recorded below after final validation.

Cityscape **not tested yet**; Full 3D world **not tested yet**, integration is checked separately. Shared shading, exact provider ownership, rigid footing/DEM residuals, pad boundaries, late terrain/failed loading, LOD/theme/reanchor lifecycle and independent app review remain with the lead. No app server, deployment, git write command, full test suite or dependency install was requested/run by the builder.

## Inspected evidence and final handoff

Looked at `tmp/top-cities/shots/atomium/atomium-final-comparison.jpg`: the supplied twilight photograph, added opposite daylight photograph, sphere-window detail and support detail sit beside all four exported near/far light/dark contact sheets. Each sheet includes overview, facade/front, back/opposite, roof/above, street/entrance and close support/sphere detail. Also viewed `atomium-glb-near-light-top.png` for the mapped cube azimuth, mask silhouette and sphere projections, and the procedural near-light sheet for source/export agreement. All image paths are under `tmp/top-cities/shots/atomium/`. The photos established open rectangular bipods rather than solid cylinders, small separate triangular windows rather than a dark continuous belt, and round steel spheres in far detail; these decisions were incorporated before the first export. The judged first export required no visual fix round. Inspection confirms a recognizable regular crystal and continuous support contacts in both LODs; stainless reflections are simplified because there is no environment texture, night points are representative and panel seams are omitted.

The required two-file conformance run in `tmp/top-cities/atomium/conformance.log` finished with **585 passes and one unrelated failure**: `uspenski-cathedral` far GLB is 0.56 MB against its 0.5 MB cap. All seven Atomium-specific tests and all three Atomium registry/source/export checks pass. Catalog and preview initially failed solely because another builder had not yet created `docs/3d-top-cities-uspenski-cathedral.md`; the final retry result is recorded below. No other builder's files were edited. The only permitted shared output written is the generated `src/peregrine/landmarks/depth-layers.js`; the lead should regenerate all assets at commit time. Independent GLB review and both-mode app captures are pending lead handoff, rather than implied by `SPEC.ready`.

Final retry: `pnpm assets:check` / `node scripts/asset-catalog.mjs` and `pnpm assets:preview` remain blocked only by the missing Uspenski Cathedral documentation above; Atomium's record, linked documentation, source and measured manifests exist and its own conformance checks pass. Final `node scripts/landmark-depth-layers.mjs --ids atomium --check` passes (current, one model); Atomium's depth generation previously reported zero dropped edges. The shared cycles report may be overwritten by simultaneous workers; Atomium-specific QA is preserved in its own scratch folder. These unrelated shared failures are handed off without waiting or editing another asset.
