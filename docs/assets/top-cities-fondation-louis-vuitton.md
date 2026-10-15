# Fondation Louis Vuitton, Paris

Original procedural model of Frank Gehry's Louis Vuitton Foundation (opened October 2014, 8 avenue du Mahatma-Gandhi, Bois de Boulogne): twelve curved glass sails of different heights and lean wrapping faceted white fibre-concrete "icebergs", the exposed-timber roof sail on top, steel struts, and the stepped water basin along the south side. The present building is represented.

## Sources and rights

- [Wikipedia](https://en.wikipedia.org/wiki/Fondation_Louis_Vuitton) (architect, opening, location) and the dossier `tmp/top-cities/fondation-louis-vuitton/facts.txt`.
- Mapped outline: OSM way [309626332](https://www.openstreetmap.org/way/309626332) (`building=yes`, `start_date=2014-10-24`; no height or level tags), © OpenStreetMap contributors, ODbL 1.0. The two 4 m² cadastre fragments (83059099, 83059183, about 85 m west) and the Kiosque roof (83059208, about 100 m north-east) are not part of the building and are not drawn over.
- Reference photographs, compared in ignored `tmp/top-cities/fondation-louis-vuitton/refs/`, never committed: piotr iłowiecki (CC-BY-SA-2.0), Moktarama (CC BY 3.0), Gerda Arendt (CC0), Yann Caradec (CC BY-SA 2.0); credits in the catalog record.

No scan, traced mesh, photograph or texture is shipped. The finished Musée des Confluences model was studied for the soup-per-material, oriented-triangle build and LOD discipline, without copying it.

## Dimensions and frame

| Feature | Value | Basis |
| --- | --- | --- |
| Top of the building | 46.1 m near, 46.1 m far (`SPEC.height` 46) | Commonly cited ~46 m; the roof sail's prow is set to it (estimate) |
| Mapped outline | about 122 × 57 m, 4 057 m², longest edge 36 m at bearing 108° | OSM way 309626332 |
| Origin | [2.26333, 48.87667] | Rounded centre of the mapped outline |
| Orientation | geometry authored directly in east/up/south on the mapped ring; no host rotation | OSM outline, two control points (-40.4, -27.0) and (-6.3, -15.7) m, longest edge 36 m at bearing 108° |
| Terrace | 2.2 m, exactly the mapped ring | Estimate |
| Iceberg blocks | 6 convex blocks, planar sloping tops 9–32 m | Photo estimate |
| Sails | 12 shells, 17–36 m high, 18–32 m wide at the base | Photo estimate |
| Basin | stepped water + rim + step, about 10 m wide along the south arc (outside the outline) | Photo estimate; its exact position is not sourced |

`y = 0` is local terrace/plaza grade. No terrain or latitude stretch is baked in; no terrain pad is declared because the site is flat.

## Modelling decisions

- **Sails are broad, overlapping curved shells** (review fix 2026-10-15): each is a quadrilateral with four authored corners and a dome bulge pushed to its outer side, with only a slight edge bow (`fondation-louis-vuitton-parts.js#sailPoint`). They are 34-46 m wide at the base, 17-34 m high, differ in height, lean, skew and top-edge tilt, and each shares about a fifth of its width with its neighbours, so the icebergs read as wrapped by glass and not ringed by loose strips. The great roof sail is larger and steeper (its prow is the 46 m top) and the tallest glass sails stop at 34 m (the front one, s4, at 29 m) so it stays the crown. A silver (metal) sail stands behind the glass ones, as in the photographs.
- **Each sail is one thin closed solid**: an outer skin facing the convex side, a separate inner skin 0.35 m behind it facing inward (the sails are seen from inside the atrium and the layer draws single-sided) and flat edge returns joining them. The earlier pair of coincident, opposite-wound skins is gone, and so are the dark reverse surfaces it exposed. A rhomboid lattice of two crossing diagonal families plus purlins (`frame`, 12-18 cm proud) follows every shell, coarse (2 + 2 diagonals, one purlin) in far, where `frame` keeps its own draw so the lattice survives.
- **White icebergs** are faceted convex blocks with sloping planar tops (steps in height, no coplanar overlaps), standing on a 2.2 m terrace that is the mapped ring itself. Their wall quads used to be wound toward the block centre (inward-facing from outside, which drove the near back-face metric to 30.7 %); they now face outward (9.3 % then 0 flagged after the sail rebuild). Gallery slits stand 30 cm off the walls.
- **Roof sail** (g4a2 round, 2026-10-15) is a steep, pointed shell (about 55° up, 40 m wide at the foot, 15 m at the prow, bulge 5.5 m) whose exposed glulam grid is built from box-section beams standing on the LOCAL shell normal, base sunk 5 cm into the glass, so every beam bears on it (60 cm high near, 90 cm far; heavier 90 cm / 1 m edge beams round the whole sail, as in the photographs). The previous grid used one global normal and floated off the curved shell. The roof sail's 46 m prow is the building's top; a test checks that sampled timber vertices sit within a beam height of the glass in both LODs and that a member lifted 3 m is detected. (g4a3) The longitudinal beams run the full length of the sail, t = 0.005 to 0.995, so both ends seat in the top and bottom edge beams (they stopped at t = 0.06 / 0.94 before, leaving blunt ends); a test probes inside each beam beyond the old end in both LODs and shows a gap between beams reads empty.
- **Struts** (13) run from a point on each supported sail down to a point inside the iceberg that carries it; endpoints are computed from the shell and the block top plane, and the test measures contact in both LODs.
- **Night**: a few gallery slits on the iceberg faces are `glow` (self-lit); glass, metal and water are dimmed in the dark palette.
- **Far LOD**: the same corners and bulge on a 5 × 7 grid, no slits, a coarse lattice in `frame` (steel folded into it), same silhouette and timber prow.

## Materials

`ice` (white fibre-concrete), `stone` (terrace, basin rim), `glass`, `metal` (silver sail), `frame` (lattice, both LODs), `steel` (struts, near only; folded into `frame` in far), `timber`, `water`, `glow`. Light/dark palettes share these keys.

## Approximations and open problems

- Sail layout, corner positions, bulge and the iceberg blocks are estimates from photographs; the real sails are doubly curved and more irregular, and the real building has a stepped cascade/grotto that is not modelled.
- Glass is opaque shaded colour; the real glass is translucent, so the structure seen through it is not shown.
- The water basin lies outside the mapped outline and its precise position is an estimate; the sails overhang the outline on the south side.
- The model is a reading of the building at 100 m to 800 m, not a survey.

## Costs

| LOD | Triangles | Draws | Size |
| --- | --- | --- | --- |
| near | 12 795 | 9 | 571 KB |
| far | 3 707 | 8 | 189 KB |

## Verification evidence

- `shot.mjs` contact sheets looked at (procedural and exported GLB): near light (overview, facade/south, rear/north, roof, west, entrance, detail, distant), near dark, far light, top view over the red outline. Files in `tmp/top-cities/shots/fondation-louis-vuitton/`.
- Changes after looking: the first pass read as eggs (closed lens-shaped sails), so the sails became corner-defined shells; second pass added height/lean/tilt variety, more bulge and bow, gallery slits, and lowered the sail feet to grade so none floats over the terrace edge; struts were restricted to blocks within 22 m and to feet strictly inside a block.
- Compared with the four reference photographs: silhouette of tall overlapping sails over white volumes with a timber roof is recognisable; the real sails are larger, rounder and more irregular.
- Tests: `fondation-louis-vuitton.test.js` (46 m top, nothing below grade, twelve curved sails, iceberg vertices inside the mapped outline, timber roof, strut contacts both LODs with a deliberately short strut, far silhouette, exported GLB round trip).
- Review fix g4a (2026-10-15): the reviewer read isolated upright curled strips around exposed boxy icebergs, a subordinate roof sail, opaque glass with a sparse lattice and 30.7 % near back-face hits. Rebuilt the sails (above), enlarged the roof sail, added the diagonal lattice in both LODs, closed each sail as a thin solid and re-wound the iceberg walls. Looked at: `tmp/next-200/fix/g4a/fondation-louis-vuitton/{look1,look2,look3,look3f,glb-near,glb-far}`. Struts' contact test now measures the exact closest distance to the sail skins (a free end 4 m short fails it).
- Cityscape and Full 3D world: recaptured by the lead after this fix.

- Review fix g4a2 (2026-10-15): reviewer saw the crown timber floating above the glass and the roof as a shallow canopy above a bowl. Re-seated the timber on the local normal (above), made the roof sail steeper and pointed, and lowered the front sail s4 from 34 to 28 m so the roof rises above it. Looked at: `tmp/next-200/fix/g4a2/fondation-louis-vuitton/{base,i1,i2,i3,glb-near,glb-far,app}`. Near 12.8k tris / 9 draws / 601 KB (was 12.8k / 9 / 571 KB); far 3.8k / 8 / 200 KB (was 3.7k / 8 / 189 KB).
