# Noisette Creek Pedestrian Bridge — North Charleston

Current 2022 Riverfront Park to Battery Park crossing, also called Battery Park Pedestrian Bridge. Original procedural geometry emphasizes the winding deck, two outward-leaning white arches, thin suspended hangers, pale piers and widened viewing platform. It is a pedestrian structure: **no `layer.js`** and no road-fitting behavior.

## Sources and rights

- [Thomas & Hutton project](https://www.thomasandhutton.com/portfolio_page/noisette-creek-pedestrian-bridge-north-charleston-sc/): 800 linear feet, twin 55 ft steel arches and 230 ft span; designer's architecture and structural description.
- [City 2024 annual financial report](https://cms2.revize.com/revize/cityofnorthcharleston/Documents/Finance/FYE%202024%20ACFR%20-%20FINAL%20COPY%20%28DIGITAL%20COPY%29.pdf): opened November 9, 2022; 800 ft long, 55 ft arches and **235 ft** span. The two primary sources disagree on span.
- [CIC / Hubbell railing case study](https://cicpgh.com/noisette-creek-pedestrian-bridge/): 42-inch railing posts, bronze finish, stainless cables and curved viewing-platform seat.
- [OSM bridge outline 1508243093](https://www.openstreetmap.org/way/1508243093), centerline 1508243094, platform path 1508243095: OSM API 2026-11-09. © OpenStreetMap contributors, ODbL 1.0.
- Designer aerials [4.png](https://www.thomasandhutton.com/wp-content/uploads/2023/09/4.png) and [1.png](https://www.thomasandhutton.com/wp-content/uploads/2023/09/1.png), both on the project page: **all rights reserved, reference-only, not redistributed**. Both viewed locally and verified as the completed Noisette structure from its curve, white paired arches, platform and park shoreline. Photos remain in `/tmp/chs2/`; never traced as a texture or plan outline.
- [City of North Charleston Flickr 52490752215](https://www.flickr.com/photos/northcharleston/52490752215): North Charleston, **CC BY-SA 2.0**, verified on its page and Flickr oEmbed license response. Image CDN returned HTTP 403, so this image is not claimed as viewed or used for geometric comparison.

No usable Commons images were located. Coordinator explicitly approved the two designer photographs as comparison-only references. No photograph is committed; no scan, mesh, texture or lettering is imported. Code/docs MIT and original models CC BY 4.0 with precedent commissioned-model credit. No agent accepts contributor terms or fabricates product permission.

## Dimensions and uncertainty

| Element | Model | Basis |
| --- | ---: | --- |
| Complete centerline | 236.10 m | Sourced OSM, 2026-11-09; published 243.84 m / 800 ft may include landings |
| Arch chord | About 71 m | Estimated between mapped support stations; designer 70.104 m / 230 ft versus City 71.628 m / 235 ft |
| Arch rise above foot | 16.764 m | Sourced 55 ft nominal height, used as rise; interpretation and exact exposed datum estimated |
| Alternative figures in task brief | 240 ft / 53 ft | Not independently authenticated; not presented as sourced engineering facts |
| Deck width | About 6 m, wider at platform | Sourced OSM outline; path's width=3 tag describes the route, not the full structural envelope |
| Main deck / landing height | 4.2 / 0.8 m | Estimated from photos, relative to local foot datum |
| Arch feet/crown separation | 6.8 / 13.2 m | Photo-based estimate of outward lean |
| Rail height | 1.067 m (42 in) | Sourced supplier |
| Members, hanger layout, piles and seat | See geometry | Estimated |

Published span figures disagree; the brief also reports 53–55 ft height variants. The verified designer and City pages both say 55 ft, but do not settle whether their datum is deck, springing or surrounding grade. Therefore the exact modeled rise and absolute crown remain a photographic approximation, not a surveyed height.

## Frame, foundation and ownership

Origin `[-79.96899,32.87191]`, metres, +X east / +Y up / +Z south. OSM vertices are converted directly, baking orientation once. North end `[-79.9694622,32.8725766]` and south end `[-79.9679973,32.8709479]` anchor the plan; platform points provide a third control. Local y=0 is the exposed support foot datum. No sea-level height, DEM, Mercator scaling, terrain or water plane is included. The whole mapped bridge ring is authored, including the event platform; unrelated shoreline boardwalks and park buildings remain outside its ownership.

Piers and arch-foot blocks reach y=0; all pier caps contact the underside. Host placement must fit support feet individually while retaining the rigid arch and deck assembly. Approach ends at y=0.8 need host path attachments. Arch springings are at centerline stations 51 and 126 m, with wide foot blocks; intermediate platform piles are separate. This is portable geometry, not terrain validation.

## Modeling and omissions

The slab is a single triangulated mapped polygon with a continuous bottom and fascia; the event platform is not an overlapping slab. Arch tubes follow a parabolic rise and outward bow. Hangers attach to both arch tubes and deck-edge sockets in both LODs. Near uses 48 arch segments and 26 hangers, far 24 segments and 12 hangers. Both retain all support positions, platform, bronze handrail and curved seat. Rail posts are coarser in far; cable infill is omitted there.

Omissions: planting, exact seat profile, benches elsewhere, light fittings, fine cable tensioners, park paths, commemorative signs and any proposed shade structure not visible in the final references. Deck thickness, pier layout, arch lean and detailed hanger fan are estimates. No logos or lettering.

## Measured costs and evidence

| LOD | Triangles | Draws | Bytes |
| --- | ---: | ---: | ---: |
| near | 13648 | 6 | 181660 |
| far | 4844 | 6 | 73300 |

Final metrics: `tmp/landmark-qa/noisette-creek-pedestrian-bridge-metrics.json`, no flags. Final exported contact sheet: `tmp/landmark-qa/final/noisette-creek-pedestrian-bridge.jpg`. Two look rounds; added the terminal railing posts identified by member-end screening. The paired arch rise/lean, curved mapped deck, widened platform, hanger sockets and pier contacts were compared with the two designer aerials. Far retains both arches, a reduced but supported hanger rhythm, all pier contacts and the event platform. No below-grade or layered-face flags.

Cityscape: **not tested**. Full 3D world: **not tested**. Neither a library sheet nor the thumbnail establishes app terrain, provider replacement or path continuity.
