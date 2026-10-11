# Cinesphere and the Ontario Place pods

Asset `cinesphere`, 955 Lake Shore Boulevard West, Toronto. An original procedural
model of Eberhard Zeidler's Ontario Place (1971) as it stands today: the
Cinesphere, the five steel-and-glass Pods hung from four white masts each, and the
216 m glazed walkway that carries them out over the lagoon to the sphere. No scan,
mesh, texture or photograph is in the repository or in the GLBs. It follows the
[Toronto landmark contract](3d-toronto-landmarks.md).

## Identity and version

- The 2011-renovated Cinesphere (opened 22 May 1971, first permanent IMAX theatre,
  closed for works in 2026) and the Pods, which are closed but standing. The
  West Island around them was cleared in 2025 for the Therme redevelopment
  ([photo, May 2026](https://commons.wikimedia.org/wiki/File:Ontario_Place_West_Island,_May_2026.jpg)):
  the model draws only the structures, never the lawns, forum or waterslide towers.
- The OSM buildings east of the dome (ways 889959049-889959055, four levels and a
  long diagonal strip) are not modelled and stay with the provider. Their use is
  not documented anywhere I could find, so inventing a lobby there would be a guess.

## Sources

| Fact | Value | Source |
| --- | --- | --- |
| Sphere footprint | 37.0 x 36.8 m circle, centre 43.62776 N 79.41817 W | [OSM way 188989522](https://www.openstreetmap.org/way/188989522) (mapped `height=25` disagrees with photographs and is not used) |
| Sphere diameter | 37 m | [Triodetic](https://triodetic.com/project/ontario-place-cinesphere/) |
| Width / radii | 35 m wide, 19 m outer, 17 m inner radius, steel and aluminium tubes | [Wikipedia](https://en.wikipedia.org/wiki/Cinesphere) |
| Cladding | aluminium frame carrying porcelain-enamel panels; lights fixed at the hubs glow at night | Triodetic, [Future of Ontario Place](https://www.futureofontarioplace.org/explore/site) |
| Pod plan | 27 m (88 ft) sides, 743 m2 per floor, three storeys, four pipe columns 105 ft (32 m) above the lake | [Wikipedia](https://en.wikipedia.org/wiki/Ontario_Place), [Structurae](https://structurae.net/en/structures/ontario-place-pods) |
| Pod outlines, links, walkway | five rings ~26-29 m square with chamfers and stair bumps; four link outlines; a 216 m x ~5 m walkway, `min_height=6` | OSM ways 1553285103-111, 888802172, 149476928 |
| Mast columns | 20 x 0.8 m circles, `height=32`, 3.5 m square cluster at each pod centre | OSM ways 888735825-844 |

Overpass was reached only through the shared queue on 2026-09-29; the rings are in
`footprint.js`, the mast centres in `cinesphere-site.js`.

## Dimensions: sourced or estimated

| Item | Model | Status |
| --- | --- | --- |
| Sphere diameter at the hub caps | 37.0 m (tube centre radius 18.1, caps 18.5, cladding 17.2) | mapped and sourced |
| Geodesic frequency | 7 near (2.4-3.3 m struts), 5 far | estimated from photographs (struts read ~2.7 m) |
| Sphere cut below the equator | 40 deg, base plane 1.2 m above the lake, drum radius ~14 m | estimated (photographs of the base) |
| Crown height | 31.3 m | derived from the cut; pod masts and crown match in photographs |
| Mast height | 32.0 m | sourced (OSM, Wikipedia) |
| Pod outline | the mapped ring, extruded | mapped |
| Pod underside / roof | 7.5 m / 21 m | estimated (OSM: 5 levels, first 3 empty; photographs) |
| Walkway deck | 6.5 m, canopy 10.1 m | deck from OSM `min_height=6`, canopy estimated |
| Cables, rods, stair cores | 12 stays per pod, tension rods, stair towers on the mapped bumps | estimated from photographs |

## Materials (light / dark)

`panel` (porcelain white), `frame` (aluminium), `white` (painted steel), `glass`,
`concrete` (base drum and roofs), `deck` (walkway slab), `cable`, `glow` (the hub
lights, drawn unshaded, warm in the night palette). Both palettes use the same keys.

## Modelling decisions

- The complex is one landmark: origin at the centre of the mapped envelope
  (43.62867 N, 79.41787 W) with `padM` 155, so the terrain pad and range checks cover
  the pods and the walkway rather than only the sphere.
- Sphere: a class-I geodesic (icosahedron, vertex at the zenith) whose edges become
  round tubes, a flat cladding triangle inside each face, a light cap at each hub, clipped at the
  cut plane and set on a 2.4 m battered concrete pedestal (radius 13.9 at the top, 14.7 at the lake; the
  ball overhangs it, as in the photographs). Author-time helpers in `cinesphere-dome.js`.
- Pods: open frames on the mapped ring. Four floor plates, posts every ~3 m and
  spandrels round the outline, glazing in most bays of the two upper storeys with a vertical open bay
  in every third, the lowest storey open apart from its end bays so the dark core, interior posts and
  floors show through, solid chamfer and stair-bump faces; long tension rods, a roof deck with rails,
  the four mapped mast pipes with ring braces and a head platform, stay cables in both axes, a 3x3 grid
  of support pipes, stair towers on the mapped bumps, and two trussed stair ramps (one storey each, on
  pipe feet) up the long face that looks toward the other pods. Nothing is translucent: "see-through" is
  real negative space, the glazed bays stay opaque.
- Walkway: centre line from the paired vertices of the mapped outline, cut where it
  crosses a pod, warren-truss diagonals, glazed tube, canopy, paired pipe supports every 15 m;
  short links from their own outlines. The mapped walkway ends ~5 m short of the sphere's mapped ring, so a
  3.6 m connector of the same kind turns from that end straight to the cladding (its last ~5 m lies outside
  every mapped ring, on open water) and ends in a door frame; the walkway deck stays within 6.5 m of a mapped
  outline (tested). An earlier draft ran the spine 20 m past its mapped end; that was wrong.
- Far LOD: same silhouette (5-frequency lattice, glazed bays, masts and stays, fewer supports) without
  mullions, rods, rails, stairs or hub lights. To meet the far budget (12,000 triangles / 500 KB; it was 16,661 /
  871 KB) the lattice is drawn as flat outward-facing ribbons (2 triangles a strut, not a 3-sided tube's 6), each pod
  face is one glazed run and two posts per ~20 m with the open bays closed, only the lowest and the roof plate are
  drawn, mast and support pipes are open-ended, and walkways and ramps keep deck, canopy, glazing and top chords but
  no truss diagonals, sill chords or lower chords.

## Approximations and known gaps

- Rooftop pavilions, interiors and the dome's own entrance ramp are omitted. The pod ramps are one pair per
  pod on the face toward the complex, not the photographed West Island arrangement; pod glazing follows one pattern
  on all five and the upper storeys are mostly glazed, not the fully open steel frames of the real pods.
- The frame frequency and pod heights are eyeballed from photographs, not surveyed.
- The dark palette is dimmer, and the hub `glow` caps are the only self-lit parts; the pods
  themselves do not light up.
- Flat lake grade y=0 everywhere; nothing is baked in for terrain (Full 3D world untested).

## Costs (exported default scenes)

| LOD | Triangles | Draws | Bytes |
| --- | ---: | ---: | ---: |
| Near | 46,533 | 8 | 2,262,000 |
| Far | 8,553 | 7 | 480,112 |

## Verification evidence

Rendered with `node local-scratch/shot.mjs cinesphere` (screenshots are ignored local files in
`local-scratch/shots/cinesphere/`), procedural and exported GLB, near and far:

- top-down with the red OSM rings: the pods, links and walkway sit inside the outlines; the
  dome hub caps reach the 37 m circle. Two errors found this way: sphere radius first at 19 m (now 18.5,
  matching the ring) and the first draft included the east annex rings (dropped, not modelled).
- aerial from the north-east (`overview`), pod from the lake edge (`facade`), the ball from the
  south-west (`structure`), roof (`roof`), walkway (`spine`); compared with the Commons photographs
  in the catalog record. Review pass: walkway stub, solid pod boxes and thin base disc fixed (`sphereEast`, `facade`,
  `ramp` renders). First pass: strut tubes too heavy (0.13 m radius to 0.11), glass too dark
  (lightened), roofs too dark (now concrete), far pods a single glass slab (now three bands).
- exported GLB near (dark lighting) and far: same silhouette and bounds as the source.

Cityscape: not tested yet, integration is checked separately. Full 3D world: not tested yet,
integration is checked separately.
