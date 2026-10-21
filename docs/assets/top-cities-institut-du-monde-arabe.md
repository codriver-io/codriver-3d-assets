# Institut du monde arabe, Paris

Original procedural model of the 1987 Institut du monde arabe at 1 Rue des Fossés Saint-Bernard, by Jean Nouvel, Architecture Studio, Gilbert Lezénès and Pierre Soria. It represents the permanent architecture: silver-grey geometric diaphragm facade, curved river wing, narrow slot, internal patio, rooftop terrace and white spiral book tower. Temporary exhibitions and artworks are excluded.

## Sources and geographic frame

- [Institut du monde arabe, building history](https://www.imarabe.org/fr/batiment-et-son-histoire): primary source for overall dimensions, 240 moucharabiehs, design team, opening and spiral book tower.
- [Ateliers Jean Nouvel project](https://www.jeannouvel.com/projets/institut-du-monde-arabe-ima/): 1981–1987 project and complementary river/end/detail photographs. Two images (2-40 and 5-32, photographer unspecified, rights reserved) consulted in ignored local scratch only; no image is redistributed.
- [OSM way 22870791](https://www.openstreetmap.org/way/22870791): building outline, height=32, building:levels=12. Geographic data © OpenStreetMap contributors, ODbL 1.0.
- Dossier references: Fred Romero, *Paris - Institut du Monde Arabe (27136624340)*, CC BY 2.0 (exterior panel wall); ActuaLitté, *Bibliothèque de l’Institut du monde arabe (33754227425)*, CC BY-SA 2.0 (interior panel mechanisms). The dossier contact sheet also contains Guilhem Vellut's temporary exhibition photograph and Jean-Pierre Dalbéra's performance photograph (both CC BY 2.0); neither is a massing reference. Exact image links and credits are in the catalog and ignored dossier `refs/SOURCES.txt`.

No external mesh, scan, image, texture or tracing of a third-party model is shipped. Source geometry is original, self-contained and uses only Three.js and the authoring asset builder.

| Feature | Value | Basis |
| --- | --- | --- |
| Overall envelope | about 77 × 35 × 32 m | Official IMA dimensions; mapped outline matches |
| Height | 32 m | Official and OSM |
| Main facade mechanisms | 240 | Official; 24 columns × 10 rows is an authored arrangement |
| Provider replacement | way 22870791 | Dossier OSM extract; nearby university parts are outside this model |
| Origin | [2.3572, 48.8489] | Dossier origin, near the mapped building centre |
| Long facade axis | bearing about 136° SE | Mapped endpoints [2.3566947,48.849138] and [2.3574246,48.8486346] |
| Authoring axis | u at bearing 136°, v toward bearing 226° | Rotation baked once; `frontageBearing=224` is rounded from the mapped frontage |
| River wing roof / parapet | 26.6 / 27.5 m | Photo estimate |
| Connector roof | 30.7 m | Estimate |
| Book spiral | radius 3.35 m, 4 turns from 3.3 to 28.8 m | Interpretive photo estimate; not a measured interior survey |

Real metres, +X east, +Y up, +Z south. `y=0` is rigid local plaza grade. No terrain elevations, global vertical datum or Mercator stretch are baked into the assets. A straight facade chord differs from intermediate cadastral points by less than 0.3 m, including parapet half-thickness. The concave replacement ring retains the narrow slot and patio. No extra plaza pad or neighbouring extrusion is owned.

## Modelling decisions and limitations

The river wing follows the mapped faceted curve; the south wing is taller. The entire concave outline is decomposed into those wings and an eastern connector. Roof tessellation preserves the slot and open patio. The terrace has a low solid perimeter parapet following the river curve, bearing directly on its roof.

All 240 diaphragm panels remain separate in both LODs. Near panels have star-shaped central iris surrounds, dark octagonal centres and four smaller corner apertures; the real mechanisms are finer and mechanically complex. Far retains a central diamond aperture in every panel and the same overall grid. The screen is tessellated into mutually exclusive metal, iris and aperture polygons: no stacked facade decals, coplanar material overlays or texture maps. Curtain-wall panes and strips likewise occupy disjoint regions. Identical vertices are indexed before export.

The white book tower is an internal cylinder with a closed helical ribbon rooted on the core and terminating on solid floor landings. Opaque glass cannot reveal an interior, so the west end deliberately has open framed bays to expose the spiral. This is an interpretive cutaway, not a claim that the actual building lacks glazing. Because the shell is single-sided, the void behind the bays is lined with a dark, inward-facing atrium (floor slab at 2 m, soffit at 30 m, north, south and back walls), so views through them end on an interior rather than on culled back faces. The roof otherwise remains closed. The open bays are the only intentional exterior shell openings.

Glass is opaque muted blue-grey; metal is subdued grey. Small ground-floor panes use a dim day/warm night `glow` material. Facade calligraphy, exact iris blades, reflections, rooftop furniture, underground auditorium and interior museum collections are omitted. No hardware performance claim is made.

## Export costs

Measured default-scene GLBs, no textures or compression:

| LOD | Triangles | Draws | Bytes | Decimal KB |
| --- | --- | --- | --- | --- |
| near | 37,122 | 7 | 1,513,356 | 1,513.4 |
| far | 8,474 | 7 | 351,428 | 351.4 |

Export: `pnpm build:top-cities-landmarks institut-du-monde-arabe --no-check`. The manifest is `/models/buildings/institut-du-monde-arabe.json`.

## Verification evidence

The initial exported near/light six-view contact sheet was inspected against the dossier sheet and the architect's river/end photograph. The first plain five-hole panel pattern lacked the geometric iris character; it was replaced by a star-shaped central mechanism. The first export also exceeded size limits; indexed vertices, fewer corner-lens segments and shared continuous wall strips brought both LODs within budget. The river curtain wall gained closer horizontal floor rhythm.

Final exported GLB contact sheets are under `tmp/top-cities/shots/institut-du-monde-arabe/`: `near-light`, `near-dark`, `far-light`, `far-dark`, plus `comparison.jpg` combining them with reference photographs. Each includes front, back, roof, west entrance/cutaway, overview and close mechanism detail. The near-light sheet before the last refinement is superseded by the final one at the same path. A top view confirms the mapped envelope and narrow slot alignment.

Focused tests pin the official envelope, mapped footprint containment, all 240 aperture centres, iris surround, curved wing, open slot and patio, river/south roof heights, visible white spiral and both ribbon ends on their named floor landings (including a deliberately lifted-end negative case). Both GLBs are checked against source bounds, triangle counts, normals and named texture-free materials. Depth-layer generation/check reports no material cycles.

Cityscape: **not tested yet**. Full 3D world: **not tested yet**. App replacement, shared runtime shading, terrain foundation, lifecycle and both-mode screenshots are checked separately by the lead; an asset contact sheet does not verify those integrations.

Deterministic asset QA: no issues, no layered/coplanar overlap candidates, no extra bridge attributes, near back-face sweep 0.6%, matching near/far bounds and no window-rhythm flags. Catalog validation passed (425 entries, 818 variants at verification time).

Final review strengthened the horizontal dark panel borders in both LODs so the far screen reads as 240 cells rather than full-height strips. Final focused checks: all five landmark tests and all three landmark-filtered conformance tests passed; whole top-cities run had 885/887 passing, with unrelated Wuppertal Schwebebahn Sonnborn GLB/source bounds mismatch and Fairmont Château Lake Louise spec validation failures during other builders’ work. No other landmark was edited.

## Review fixes (2026-10-21)

1. **The west cutaway showed straight through the building.** With the glazing left out of rows 1 to M−2 of both west walls (u ≈ −44.5, v −3.9 to 8.2), the single-sided shell had nothing behind the bays: the inner sides of the moucharabieh screen, the north and east walls and the roof are back faces, so a culling renderer drew the sky and plaza beyond. In a fixed sample of 4,000 rays from a 70 m arc west of the building, 78.6 % (near) and 78.5 % (far) of the rays passing the open bays saw through. The real west end is glazed, with the book tower visible behind clear glass, so the bays stay open (the model's opaque glass would hide the spiral). The void behind them is now lined in `aperture` with inward-facing faces only: a floor slab at 2 m and a soffit at 30 m (just outside the lowest and highest open rows), and north, south and back walls. The back wall is at u = −35.2, 1.4 m behind the spiral, and the side walls sit 5 cm inside the shell. The same sample now meets the lining or the spiral every time (0 % see-through in both LODs), and the qa-metrics back-face sweep falls from 0.6 % to 0 %. This adds 12 triangles per LOD and no material or draw.
2. **Some far spiral soffit triangles faced up.** After the lining, 48 of the 4,000 far rays still first met the white helix from behind. On the coarse 64-segment far ribbon, the orientation probe sat about 2 m beside the vertex instead of below it, and on the steep far slope this flipped some soffit triangles. Tread and soffit are now oriented by probes straight above and below their first vertex. Vertex positions and triangle counts are unchanged.

Costs, as the build printed them before → after: near 37,110 → 37,122 triangles, 7 draws, 1,512,816 → 1,513,356 bytes; far 8,462 → 8,474 triangles, 7 draws, 350,860 → 351,428 bytes. qa-metrics reports no issues before or after. Exported near and far GLBs were inspected before and after from the north-west and south-west, along with the standard contact sheet (ignored scratch): the bays now show the white spiral against a dark interior instead of the sky. Cityscape and Full 3D world were **not re-tested** for this change.
