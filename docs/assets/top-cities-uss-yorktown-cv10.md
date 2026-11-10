# USS Yorktown (CV-10) — Patriots Point, Mount Pleasant

Original procedural museum ship in the building registry, following the Saturn V precedent for a non-building landmark. This is CV-10 after the angled-deck conversion, not Yorktown CV-5 or the later cruiser CG-48. No third-party mesh, scanned hull, photograph, texture, logo, hull number or lettering is embedded.

## Sources and dimensions

[Patriots Point, the operator](https://www.patriotspoint.org/things-to-do/uss-yorktown), distinguishes the 1943 and 1956 lengths. The [US Navy DANFS history](https://www.history.navy.mil/content/history/nhhc/research/histories/ship-histories/danfs/y/yorktown-cv-10-iv.html) describes the original Essex-class dimensions; those earlier values are not used as the present envelope.

| Feature | Value | Basis |
| --- | ---: | --- |
| Present length | 270.6624 m / 888 ft | Sourced, Patriots Point, post-1956 |
| Original length | 265.7856 m / 872 ft | Sourced, operator and Navy, historical only |
| Mapped envelope | about 274.87 × 65.66 m including projections | Sourced, OSM way 39010151 |
| Authored deck envelope | 270.66 × 64 m | Estimated simplification inside the mapped ship outline, using published length |
| Hull beam | 33 m | Estimated current museum shape; not the original 93 ft beam |
| Flight deck / island crown / mast | 17 / 39.7 / 58 m | Estimated from the two museum profile photographs |
| Heading | about 0.398° | Sourced, mapped bow/stern centre controls |
| Hull flare, galleries, bay grid and aircraft | Estimated | Original low-cost geometric interpretation of photographs |

Reference photos, both file licences and ship identity verified: [Something Original, USS Yorktown (CVS-10) panorama 2012](https://commons.wikimedia.org/wiki/File:USS_Yorktown_(CVS-10)_panorama_2012.jpg), **CC BY-SA 3.0**, photographed in March 2011; [RebelAt, Present Day Profile](https://commons.wikimedia.org/wiki/File:Present_Day_Profile_View_of_the_USS_Yorktown.jpg), **CC BY-SA 3.0**, 2010. Both show the museum berth, angled deck, post-conversion island and mast; both stay in local scratch only.

## Frame, footprint and waterline

Origin `[-79.9085309,32.7904047]`; metres east/up/south. Longitudinal authoring +Z points aft/south, +X is starboard/east. Two mapped centre controls `[-79.908533,32.7892]` and `[-79.908513,32.79162]` establish the near-north heading; −0.00695 rad Y rotation is baked once. `y=0` is the visual waterline, with the submerged hull deliberately omitted. A host places the entire ship rigidly at its water datum; the ship must not follow bottom topography or land terrain. No absolute tide/sea-level altitude, DEM or Mercator scale is baked in.

Exact [OSM way 39010151](https://www.openstreetmap.org/way/39010151), fetched via OSM API 2026-11-09, retained as `FOOTPRINTS`. © OpenStreetMap contributors, [ODbL 1.0](https://www.openstreetmap.org/copyright). Own only this ship’s envelope; shoreside museum way 38978420, pier and USS Laffey way 166144208 remain separate. The mapped `height=17` appears to represent the flight deck, not the mast, and is not used as the total height.

## Geometry, LOD and omissions

Raked bow and tapered above-water hull, broad asymmetric angled deck, hangar-side recesses with retained bay rhythm, stacked starboard island and open mast silhouette. Seven materials, with small separate island panes and geometric deck markings only. Generic unmarked aircraft are original simple silhouettes on landing supports; they do not reproduce proprietary meshes or identify a specific aircraft exhibit. Far reduces hull fittings and bay/aircraft tessellation while keeping the deck, island, mast, all broad openings and supports.

No hull numerals, lettering, ensigns, insignia, flight-deck exhibit labels, gangway, visitors, dock piles, underwater hull, propellers, interior galleries, exact rigging or working weapons. The modeled broad deck and side platforms are approximate; this is a recognition model, not a shipbuilding survey.

## Verification

| LOD | Triangles | Draws | Bytes |
| --- | ---: | ---: | ---: |
| near | 4388 | 7 | 61264 |
| far | 2902 | 7 | 48740 |

Mechanical QA: no flags. Near/far contact sheet inspected: retained angled deck, recognizable starboard island/mast, individual hangar bays, flared bow and aircraft silhouettes. One refinement cut platform faces around the island core and tuned the muted blue-gray hull. The painted flight deck uses the explicit `deckPaint` material semantic; thin paint markings are intentional surface markings handled by the checker’s paint exception. Evidence: `tmp/landmark-qa/final/uss-yorktown-cv10.jpg`; metrics: `tmp/landmark-qa/uss-yorktown-cv10-metrics.json`. Padded framing keeps the full hull and mast visible.

Cityscape: **not tested**. Full 3D world: **not tested**. Human contributor/product permission remains a maintainer process; no legal terms accepted by the agent.
