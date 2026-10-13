# Cambie Bridge — Vancouver (1985)

Original editable, texture-free procedural model of the current Cambie Bridge,
not the 1891 timber crossing or the 1911 Connaught swing bridge. The principal
features are twin tan concrete spine/box girders with shallow midspan soffits,
slender flared pier pairs, long low approaches, asymmetric raised paths, and the
north fork into Nelson and Smithe Streets. `SPEC.ready = true` gates the two
exported LODs. Independent batch review and publication remain separate.

## Sources and measured frame

The [SEABC/IABSE 2017 engineering brochure, printed page 3](https://seabc.ca/wordpress/files/notable_structures/Vancouver_Notable_Structures_IABSE_SEABC_2017.pdf)
identifies the 1985 structure, twin prestressed concrete girders, 1,100 m
structural length, 33–84 m spans, 14 m marine clearance, and 4.3 m/1.8 m paths.
Its construction aerial establishes the twin spine arrangement and cantilevered
wings. The [1985 TAC design abstract](https://trid.trb.org/View/290128) describes
the spine-and-wing structural system. These references are not survey drawings.
[Wikipedia](https://en.wikipedia.org/wiki/Cambie_Bridge) supplies chronology;
the dossier's historic fire/Connaught images were explicitly excluded.

Reference-only photographs inspected:

- [Spyglass Dock underside, trougnouf / Benoit Brummer, CC BY 4.0](https://commons.wikimedia.org/wiki/File:Cambie_Street_bridge_viewed_from_the_Spyglass_Dock_in_Vancouver,_BC_(DSCF7465).jpg): tan girders, flared shafts, rail rhythm and blue waterline sections.
- [Cambie Bridge 2018, Wpcpey, CC BY-SA 4.0](https://commons.wikimedia.org/wiki/File:Cambie_Bridge_2018.jpg): side silhouette, marine support spacing and plain concrete palette.
- [Cambie Bridge plaque, Ds13, CC BY-SA 3.0](https://commons.wikimedia.org/wiki/File:Cambie_Bridge_plaque.jpg): current bridge identity.
- Brochure images credited to City of Vancouver Archives / Alan J. Ingram and Raya Smertina, viewed under ignored `tmp/` only.

All geometry is original; no reference photo, texture, scan or third-party mesh
is in the exports. The supplied OSM dossier was reused, with the exact road
controls saved in `cambie-bridge-mapped.js` and the extract in
`tmp/top-cities/cambie-bridge/alignment-osm.json`. Geographic data remains ODbL,
© OpenStreetMap contributors. No new Overpass query was necessary.

Origin `[-123.1149, 49.27201]`; local metres +X east, +Y up, +Z south.
Rotation is baked into the mapped roadway coordinates; Mercator latitude scale
is applied once by the runtime. No terrain heights are baked into geometry.

| Dimension | Value | Basis |
| --- | ---: | --- |
| Total structural length | 1,100 m | SEABC published; excludes some road continuations |
| Authored SB/Nelson alignment | 1,125.73 m | OSM; includes a tapered continuation onto Nelson |
| Authored NB/Smithe alignment | 1,029.00 m | OSM; to the connected Smithe street |
| Published span range | 33–84 m | SEABC |
| Three marine bays per spine | 83.54 / 83.55 m | Estimated geographic registration within published range |
| Approach support spacing | 33 m | Estimate, using lower end of published range |
| Marine clearance | 14 m | SEABC; water-level datum not a surveyed export datum |
| Marine deck height | 18.5 m | Visual estimate above flat/water grade |
| Marine girder depth | 2.2–4.3 m | Visual estimate; varies smoothly through the bays |
| Spine upper/bottom widths | 8.4/7.2 m SB, 10.0/8.8 m NB | Photo interpretation |
| East multi-use / west sidewalk | 4.3 / 1.8 m | SEABC published widths |
| Main deck envelope | approximately 31 m | OSM outer outline transverse measurement, including paths/barriers |
| Motor carriageways | 6.6 m SB, 10.2 m NB | Map/photo estimates, current two/three lanes |
| West cycle lane | 2.6 m | Map/photo estimate; replaces the original sixth motor lane |
| Flared shafts | 3.5–5.1 m transverse, 2.3 m along | Visual estimate |
| Top including lamps | 26.45 m | Authored geometry, declared 26.5 m |

Original six-lane capacity describes the structure; current OSM has five motor
lanes and a west protected cycle lane. The original broad envelope is retained.
Individual pier registrations, girder thickness, barriers, foundations, rail
pitch, lamp shape and waterline bands are approximations. Minor interchange
ramps, detached spiral/stair access, and the south heat utility stay with the
provider; the model does not claim to reconstruct them.

## Structure, landings and runtime

`cambie-bridge-profile.js` supplies independent mapped station axes for the two
carriageways. A single centreline cannot follow both the curved Nelson ramp and
the straighter Smithe ramp. `layer.js` composes two unchanged
`createRegistryBridgeLayer` instances; each selects its own spine/wing group
from the same GLB and uses the shared road replacement, GLB loading, terrain,
normal-shaded unlit materials and navigation surface. No shared bridge file was
extended. The two near/far asset budgets include both groups and their draws.

The marine spans retain rigid width. Only the outer 85 m at each of the four
landings taper the slab, pavement, paths, kerbs and dividers to their connected
carriageway. Standard Protomaps joins track the live zoom-dependent primary
road ribbon; HD retains the existing measured-edge path. Pavement colours blend
into the standard road palette at the toes. Near paint is 12 cm proud; far paint
is dropped. Rail termini contact named end posts on the slab; path termini
reach street grade. Girders stop beneath the slab rather than at an airborne
asset boundary. Blue waterline faces replace shaft sections rather than overlay
concrete faces.

The flat profile uses constant grades with 25 m vertical curves. South ramps
are 533.61 m SB / 532.49 m NB; north ramps are 341.50 m SB / 245.87 m NB.
Steepest flat grades are 5.85% SB and 8.38% NB. Both use
`terrainPolicy: 'absolute-deck'` with the existing lateral terrain clamp: in
world mode, support feet meet local DEM, each endpoint meets its own bank,
and the marine deck remains absolute. There is no corridor flattening.

## Export and visual verification

| LOD | Triangles | Mesh draws | GLB KiB |
| --- | ---: | ---: | ---: |
| Near | 77,108 | 34 | 3,758 |
| Far | 26,760 | 8 | 977 |

Full byte counts and bounds are in `/models/bridges/cambie-bridge.json`.
The far model preserves every pier, both spine girder profiles, the two northern
branches, paths, coarse rails and lamp height. Costs include both carriageways;
no HD overlay cost or Tesla hardware timing is claimed.

Images actually read and judged, all under `tmp/top-cities/shots/cambie-bridge/`:

- `source/cambie-bridge-procedural-near-light-sheet.jpg`: overview, side/front, opposite side, above, and close detail.
- `{near-light,near-dark,far-light,far-dark}/cambie-bridge-glb-*-sheet.jpg`: exported LOD/theme contact sheets, including deck/underside and north/south approaches in near light.
- `reference-lod-sheet.jpg`: the two current-bridge photographs next to exported near/far light/dark side views.
- `app-overviews-sheet.jpg`: real Cityscape and world far/near/street views, with normal app roads/buildings enabled.
- `city-approaches/` and `world-approaches/`: initial exact-endpoint captures in both headings; some downtown views had foreground-building occlusion, prompting closer, higher-angle captures.
- `final-city/` and `final-world/`: eight endpoint/heading captures per mode at zoom 19.2/pitch 35, plus probes; the final contact sheet is `final-approaches-sheet.jpg`. Both directions show connected narrow toes without broad square slab ends.

The first export exposed a material-order cycle at a collapsed street toe. The
slab top now stays 20 cm below the pavement while its shoulders/thickness taper;
buried thin toe undersides are omitted. Re-exported checks report zero cycle
edges dropped, zero unresolved layered/coplanar faces, zero back-face sweep hits,
and zero unsupported member-end candidates. The contact tests separately check
actual named rail/post, lamp/arm, spine/slab and shaft/footing supports in both
LODs, excluding each member, with a shortened floating pole as a negative case.
Every geometry vertex is inside its own geographically registered envelope.

## Application verification and height probes

Local base revision `718cf7c4`; capture renderer build `7db36e5f261e`.

Terrarium DEM (`elevation-tiles-prod`, max zoom 15, tile size 256).
These labels cover the recorded placement/approach/height evidence, not the
remaining lifecycle/driving/HD matrix. No online deployment occurred.

All four landings are captured in both camera headings:

| Carriageway/end | Longitude, latitude |
| --- | --- |
| SB south | -123.114855, 49.2660133 |
| SB north / Nelson | -123.1172919, 49.2754853 |
| NB south | -123.1147379, 49.2660179 |
| NB north / Smithe | -123.1146122, 49.2752574 |

`height-probes.json` queries all mapped controls and named ramp/river stations
in both directions: 120 queries per mode, no on-road nulls, and null at the
independent off-bridge control `[-123.112,49.27201]`. `heightAt` is an offset
above the app's query-ground datum in world mode, not an absolute altitude.
It therefore differs from 18.5 m where the DEM contains nonzero bank/shore
samples. Representative bidirectional values follow; forward/reverse match.

| Profile/station | Cityscape heightAt m | World heightAt m |
| --- | ---: | ---: |
| SB 0 / 1125.73 | 0 / 0 | 0 / 0 |
| NB 0 / 1029.00 | 0 / 0 | 0 / 0 |
| SB 533.61 (south marine support) | 18.5 | 14.904516 |
| SB 734.68 (mapped marine control) | 18.5 | 16.240374 |
| SB 784.23 (north marine support) | 18.5 | 11.093087 |
| NB 532.49 (south marine support) | 18.5 | 13.947878 |
| NB 761.03 (mapped marine control) | 18.5 | 13.310496 |
| NB 783.13 (north marine support) | 18.5 | 11.118831 |

The world bank datums were 15.8483/11.3189 m SB and 14.6303/11.1826 m NB.
`footing-probes.json` checks all 1,056 fixed-foot vertices against the loaded
DEM, after subtracting the original authored footing height. Maximum residual
was below 0.000001 m; this verifies fitting to the resident DEM, not survey
accuracy. The per-footing measurements follow (ordered fixed-foot boxes, 24 vertices per footing).

| Spine / footing station m | DEM min–max m | Maximum residual m |
| --- | ---: | ---: |
| SB 104.61 | 10.820–11.417 | 4.48e-7 |
| SB 137.61 | 12.376–13.033 | 4.58e-7 |
| SB 170.61 | 11.868–12.214 | 4.60e-7 |
| SB 203.61 | 9.675–9.932 | 4.62e-7 |
| SB 236.61 | 8.955–9.208 | 3.80e-7 |
| SB 269.61 | 8.235–8.441 | 3.70e-7 |
| SB 302.61 | 7.756–7.952 | 4.00e-7 |
| SB 335.61 | 7.316–7.384 | 1.11e-7 |
| SB 368.61 | 7.195–7.201 | 2.21e-7 |
| SB 401.61 | 7.199–7.200 | 2.32e-7 |
| SB 434.61 | 7.196–7.200 | 2.04e-7 |
| SB 467.61 | 7.203–7.219 | 2.36e-7 |
| SB 500.61 | 6.223–6.713 | 2.30e-7 |
| SB 533.61 | 3.095–4.096 | 2.23e-7 |
| SB 617.15 | 0.000–0.000 | 0.00e+0 |
| SB 700.69 | 0.000–0.156 | 1.47e-8 |
| SB 784.23 | 7.242–7.565 | 4.48e-7 |
| SB 817.23 | 8.532–8.766 | 3.80e-7 |
| SB 850.23 | 9.179–9.186 | 4.60e-7 |
| SB 883.23 | 9.258–9.369 | 3.66e-7 |
| SB 916.23 | 9.183–9.189 | 4.74e-7 |
| SB 949.23 | 9.194–9.212 | 4.52e-7 |
| SB 982.23 | 8.749–8.990 | 3.13e-7 |
| SB 1015.23 | 9.190–10.030 | 4.22e-7 |
| NB 103.49 | 12.024–12.550 | 4.34e-7 |
| NB 136.49 | 11.692–12.286 | 3.55e-7 |
| NB 169.49 | 9.410–9.645 | 4.69e-7 |
| NB 202.49 | 8.928–9.122 | 4.00e-7 |
| NB 235.49 | 8.191–8.308 | 4.24e-7 |
| NB 268.49 | 7.695–7.837 | 4.56e-7 |
| NB 301.49 | 7.234–7.290 | 2.00e-7 |
| NB 334.49 | 7.197–7.201 | 2.30e-7 |
| NB 367.49 | 7.199–7.200 | 2.14e-7 |
| NB 400.49 | 7.197–7.201 | 2.18e-7 |
| NB 433.49 | 7.203–7.212 | 1.75e-7 |
| NB 466.49 | 6.511–6.911 | 2.14e-7 |
| NB 499.49 | 4.032–5.073 | 2.15e-7 |
| NB 532.49 | 0.000–0.000 | 0.00e+0 |
| NB 616.04 | 0.000–0.040 | 1.42e-8 |
| NB 699.59 | 7.028–7.547 | 4.68e-7 |
| NB 783.13 | 8.284–8.538 | 4.68e-7 |
| NB 816.13 | 8.709–8.996 | 3.91e-7 |
| NB 849.13 | 9.240–9.403 | 4.11e-7 |
| NB 882.13 | 9.764–9.899 | 4.06e-7 |

Focused landmark plus registry tests pass (585 tests, including nine Cambie-specific tests). Asset catalog/check and local preview pass; depth generation/check pass with no cycles. Deterministic geometry QA reports zero issues. Generated renderer bundles and the shared depth table are excluded from the landmark commit; the lead must regenerate depth ranks and the bundle after cherry-picking.

HD lane overlays/crossfall, paint toggles, tracked route/car/traffic motion, failed/late loading, lifecycle stress, exaggerated terrain, and Tesla hardware are **not tested**. The shared per-lane bank/crossfall limitation is not certified by standard-road screenshots. Fine pier geometry/registration and decorative lamp/banner details remain visual approximations. Independent batch review remains pending.

Both local server processes were stopped by their recorded PIDs after captures. Unauthenticated local account/CORS/API warnings did not prevent tiles, both GLB groups, or terrain from loading.
