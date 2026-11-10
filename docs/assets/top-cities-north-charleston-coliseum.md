# North Charleston Coliseum — North Charleston

Original procedural exterior of the 1993 arena: oval brick bowl, pale diagonal diamond masonry, small square window rhythm and shallow peaked silver roof. The model includes the entrance wings in the current arena footprint. **The attached Performing Arts Center and Convention Center are excluded**; they are separately mapped and outside this model's ownership.

## Sources and rights

- [Official technical guide](https://www.northcharlestoncoliseumpac.com/assets/doc/Facility-Info-COL-8-1-17-724a70448c.pdf), section 1.14: 18 ft concourse, 53 ft last row, 69 ft catwalk, 83 ft end-stage grid and 97 ft open steel, all above arena floor. These are interior elevations; none is silently treated as exterior crown height.
- [Official operator site](https://www.northcharlestoncoliseumpac.com/): venue identity and current use.
- [OSM way 190679013](https://www.openstreetmap.org/way/190679013), fetched from OSM API 2026-11-09: whole arena footprint and entrance wings; © OpenStreetMap contributors, ODbL 1.0. Excludes PAC way 190679212 and Convention Center way 190679211.
- [North Charleston Coliseum Aug2010.jpg](https://commons.wikimedia.org/wiki/File:North_Charleston_Coliseum_Aug2010.jpg): Chris Pruitt, **CC BY-SA 3.0**, verified on Commons. Viewed and verified as the arena's oval diamond-patterned brick exterior and pale roof; predates later entrance improvements, so current wing plans come from OSM.
- [Darius Rucker Blvd unveiled (9500164219).jpg](https://commons.wikimedia.org/wiki/File:Darius_Rucker_Blvd_unveiled_(9500164219).jpg): North Charleston, photograph by Ryan Johnson, **CC BY-SA 2.0**, verified on Commons. This is an **interior** event image at the coliseum from August 12, 2013, verified by page description and venue context; used only to check glazing/white structure character, not to infer the exterior footprint or claim a second exterior angle. No interior is modeled.

`North Charleston Coliseum.jpeg` on Commons was rejected as a logo, not a building photograph. Photos are comparison-only and kept in `/tmp/chs2/`, never committed. Geometry is original, procedural and texture-free. No signage lettering, logos, sports branding or imported mesh. Source/docs MIT, original models CC BY 4.0 with the precedent's truthful commissioned-model credit. No agent accepts legal terms; separate product permission is a maintainer review.

## Dimensions

| Feature | Model | Basis |
| --- | ---: | --- |
| Complete footprint bounds | about 136 × 151 m | Sourced OSM; includes entrance wings |
| Main bowl | about 119 × 87 m | Sourced OSM main envelope after separating wing lobes |
| Interior open steel | 29.5656 m (97 ft) above floor | Sourced operator; contextual only |
| Exterior roof crown | 32.2 m above local grade | Estimated; floor-to-exterior datum not surveyed |
| Main eave | 26 m | Photo estimate |
| North/south/east wing roofs | 9.8 / 9.2 / 8.5 m | Estimated; OSM supplies plan, not heights |
| Diamond width/height | 3.2 / 2.9 m near; double in far | Estimated visual rhythm, simplified for map scale |
| Small window row | 7.2–9.4 m | Photo estimate |
| Doors, glazing bays and roof equipment | See generator | Estimated |

## Frame and rigid foundation

Origin `[-80.02243,32.865585]`, real metres with +X east, +Y up, +Z south. The actual OSM footprint is converted directly; geographic rotation is already baked in. East entrance controls `[-80.0216198,32.8656016]` and `[-80.0216679,32.8658027]` fix that frontage. North wing corners `[-80.0222143,32.8662747]` and `[-80.022718,32.8662433]` independently fix the building skew. No terrain elevation, sea-level offset or Mercator stretch is baked in.

Local y=0 is a single rigid exterior foundation plane. The host must choose a rigid datum or a bounded pad covering the owned footprint, without bending the arena facade over terrain. External plaza terraces, landscaping, parking and inter-building connector bridges are omitted. No replacement is authorized beyond OSM 190679013; adjoining PAC, Convention Center, parking structure and hotels remain separate.

## Modeling decisions and omissions

The arena wall follows a rounded, mapped bowl ring. Diamond brick tiles and pale mortar strips are adjoining coplanar partitions, not layered overlays; roof and facade materials remain separate. Small windows have their own wall openings and pale borders. Far uses a coarser diamond pattern and glazing grid while preserving all entrance wings, bowl proportions and roof crown. The pale roof is a shallow peaked membrane with a continuous eave, not a black slab. Mapped entrance wings have separate glazing bays, opaque piers, horizontal floor divisions and simple flat roofs. Wall portions concealed by those wings are omitted.

The exterior roof profile and wing heights are approximate. Individual bricks, roof fastening/seams, HVAC beyond small ridge vents, event interiors, stairs, plaza artworks, signage and connecting canopies to excluded buildings are omitted. The 2010 reference is reliable for the bowl and roof; current wing facade details remain less certain than their mapped footprints. No terrain or host integration result is claimed.

## Measured costs and evidence

| LOD | Triangles | Draws | Bytes |
| --- | ---: | ---: | ---: |
| near | 18197 | 7 | 227688 |
| far | 6360 | 6 | 88664 |

Metrics: `tmp/landmark-qa/north-charleston-coliseum-metrics.json`, no flags. Final exported near/far comparison: `tmp/landmark-qa/final/north-charleston-coliseum.jpg`. Two look rounds; removed degenerate clipped facade polygons that could leave small gaps in the diamond pattern. Bowl, roof silhouette, diamond masonry, separate square windows, back, roof and entrance wings inspected. Far retains the mapped plan and coarser pattern/openings; bounds agree within 0.33 m vertically, including near-only roof vents.

Cityscape: **not tested**. Full 3D world: **not tested**. Library inspection only, with no provider replacement, DEM footing or hardware performance claim.
