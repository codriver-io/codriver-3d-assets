# Fort Sumter — Charleston Harbor

Original procedural model of the present-day ruined sea fort and Battery Huger, not a reconstruction of its original three-tier form. The pentagon, low broken wall heights, eastern earth fill, surviving casemates and dark diagonal battery are the recognition features. No imported mesh, photograph, texture, lettering, flag or insignia is embedded.

## Sources and dimensions

[NPS HABS SC-194 measured documentation](https://pubs.nps.gov/eTIC/EVER-GARI/FOSU_392_124634_0001_of_0006.pdf) gives surviving wall and gunroom dimensions. The [NPS National Register inventory](https://npgallery.nps.gov/pdfhost/docs/NRHP/Text/66000101.pdf) describes Battery Huger and its later museum use; the [current NPS battery page](https://home.nps.gov/places/battery-huger.htm) confirms the surviving concrete structure bisecting the fort.

| Feature | Value | Basis |
| --- | ---: | --- |
| Surviving outer wall | about 4.7244 m / 15 ft 6 in above ground | Sourced, HABS; surviving sections vary, not a uniform model height |
| Wall thickness | 1.524 m / 5 ft | Sourced, HABS |
| Typical casemate width / depth | 6.2738 / 6.731 m | Sourced, HABS 20 ft 7 in / 22 ft 1 in; bay spacing simplified |
| Historical side lengths | about 96.62, 51.82, 57.91, 57.91, 51.82 m | Sourced, HABS approximate 317, 170, 190, 190, 170 ft; not used to override the current map |
| Battery Huger historical envelope | 82.296 × 27.432 × 6.7056 m / 270 × 90 × 22 ft | Sourced, NPS inventory; current irregular museum footprint retained from OSM |
| Current wall, island, battery alignment | OSM ways 1356508917, 12353668, 36374994 | Sourced current map, fetched 2026-11-09 |
| Courtyard / raised earth fill | 1.2 / 5.2 m above visual waterline | Estimated relative levels |
| Five curtain top levels | 5.3, 6.0, 3.6, 4.7, 2.7 m | Estimated from current photographs; actual ruins vary continuously |
| Museum roof / main bare pole / small poles | 10 / 24 / 14 m above visual waterline | Estimated |
| Gun embrasures, southern pit, stairs and partition rhythm | Simplified | Estimated from photographs; no measured structural plan |

The present OSM enclosure is approximately 10–20% larger than the HABS approximate historical sides. The model retains the current mapped alignment and explicitly does not claim those sources agree. Historic dimensions describe context and wall thickness; the source distinction prevents false survey precision.

Reference-only photographs, identity and file licence checked: [Methaz, Fort Sumter Aerial View](https://commons.wikimedia.org/wiki/File:Fort_Sumter_Aerial_View.jpg), **CC BY-SA 3.0**, 23 August 2013; [Clynnwersch, Fort Sumter 3](https://commons.wikimedia.org/wiki/File:Fort_Sumter_3.jpg), **CC BY-SA 4.0**, 14 June 2018. Both show this island fort in its present low-wall/museum configuration. The aerial shows the pentagon, Battery Huger and earth fill; the harbor view establishes wall and pole proportions. Local reference files are not committed.

## Frame, footprint and foundation

Origin `[-79.87467,32.75234]`, real metres, +X east, +Y up, +Z south. Mapped vertices are converted once into that frame, with no additional root rotation. Local `y=0` is the visual island waterline; ground and raised fill are relative authored site levels, not an absolute sea level, tide or DEM value. No runtime terrain or Mercator scale is baked in. The island plinth is a rigid authored site feature. A host must place the fort and battery rigidly at its water datum and reconcile surrounding shoreline independently.

[OSM wall 1356508917](https://www.openstreetmap.org/way/1356508917) and [Battery Huger 36374994](https://www.openstreetmap.org/way/36374994) are the provider-replacement footprints. [Island coastline 12353668](https://www.openstreetmap.org/way/12353668) is site coverage only, not a blanket provider-building replacement. © OpenStreetMap contributors, [ODbL 1.0](https://www.openstreetmap.org/copyright). The ferry pier, harbor terrain, channel and neighboring features remain separate.

## Modeling and omissions

Five varied-height curtains have actual open gun embrasures and a through sally port. Preserved casemates have real segmental open arches; ruined partitions retain the low repeated rhythm. Battery Huger follows its irregular mapped footprint with a recessed open pit and a small pitched museum roof. Grass occupies the raised east half and the low parade remains open. Bare poles and a few simplified cannon silhouettes provide scale without insignia. Far retains the pentagon, open arches/embrasures, wall-height variation, battery, fill and poles; it reduces curve facets and low partition density.

No 1861 upper tiers, lettering, flags, exact artillery collection, visitors, ferry pier, submerged foundation, interior museum exhibits, fine brick courses, accurate vaulted interiors or DEM reconstruction. Casemate count, exact ruin profiles, pit and museum roof are recognition approximations.

## Verification

| LOD | Triangles | Draws | Bytes |
| --- | ---: | ---: | ---: |
| near | 2588 | 8 | 72596 |
| far | 1884 | 8 | 58124 |

Mechanical QA: no flags; far bounds equal near bounds. Final contact sheet inspected against the aerial: the pentagon, low uneven brick walls, surviving open casemates, raised earthwork and dark battery remain clear in both LODs. One visual refinement connected stairs, corrected the museum roof footprint and pit placement, and separated grassy island from parade. Hidden base caps and buried ruin partitions were removed instead of retaining layered faces. Evidence: `tmp/landmark-qa/final/fort-sumter.jpg`; metrics: `tmp/landmark-qa/fort-sumter-metrics.json`.

Cityscape: **not tested**. Full 3D world: **not tested**. Human contributor/product permission remains a maintainer process; no legal terms accepted by the agent.
