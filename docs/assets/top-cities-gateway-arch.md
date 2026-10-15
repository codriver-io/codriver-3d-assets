# Gateway Arch — St. Louis

Original procedural model of Eero Saarinen’s completed 1965 monument in Gateway Arch National Park, Missouri. The stainless triangular shell, weighted catenary, broad tapered feet, open void and tiny crown windows distinguish it at street and regional distance. No imported mesh, texture, photograph or scan is included.

## Sources and dimensions

Research checked 2026-10-15. Primary sources: [NPS fact sheet](https://www.nps.gov/jeff/planyourvisit/gateway-arch-fact-sheet.htm), [NPS mathematical equation](https://www.nps.gov/jeff/planyourvisit/mathematical-equation.htm), [materials and techniques](https://www.nps.gov/jeff/planyourvisit/materials-and-techniques.htm), [NPS window FAQ](https://www.nps.gov/jeff/faqs.htm). The mathematical diagram was downloaded and read at `tmp/top-cities/gateway-arch/equation.jpg`; dossier facts and photos were reused.

| Feature | Model | Source/status |
| --- | --- | --- |
| Exterior height / width | approximately 192.024 m / 192.024 m (630 ft) | NPS; finite polygon/ground-cut tolerance below 0.2 m |
| Centreline | y = (693.8597 − 68.7672 cosh(0.0100333 x)) ft | NPS equation, x in feet; sampled in metre geometry |
| Centreline crown | 625.0925 ft / 190.5282 m | Published equation; exterior apex adds triangular circumgeometry |
| Triangular section side | 54 ft / 16.4592 m at base; 17 ft / 5.1816 m at crown | NPS, equilateral section |
| Cross-section taper | area linear in vertical drop below the centroid crown | NPS diagram: Qb=1262.6651 ft², Qt=125.1406 ft² |
| Crown windows | 16 east + 16 west; 0.6858 × 0.1778 m | NPS 27 × 7 in; spacing and precise vertical position estimated |
| Axis | 17.4° east of north; frontage 107.4° | Mapped from two base control edges; baked into geometry |
| Park | flat 156 × 32 m muted lawn, two 4 m grade paths and compact triangular foot plazas | Bounded landscape approximation; wider park and trees supplied by the map |

## Geographic frame and ownership

Origin `[-90.18496865, 38.6246122]` is the centre of the mapped arch envelope. East/up/south, real metres; y=0 is local park/plaza grade. Rotation is already baked. No Mercator scale or absolute elevation is exported.

The dossier contains all 32 upper `building:part` ways, ids **1419494392–1419494423**, and relation **12813920**. Its outer way **951594314** was fetched once through the shared Overpass helper and retained in `tmp/top-cities/gateway-arch/outline.json`. `FOOTPRINTS` includes its complete envelope and all part rings; `OSM_WAYS` includes all 33 ways, avoiding a surviving generic span over the void. [OSM relation](https://www.openstreetmap.org/relation/12813920). © OpenStreetMap contributors, ODbL 1.0.

Mapped south outer edge endpoints `[-90.1852300,38.6237695]` and `[-90.1853884,38.6238091]`, and north outer edge endpoints `[-90.1847311,38.6254549]` and `[-90.1845489,38.6254116]`, establish the longitudinal bearing. The model uses sourced dimensions rather than stretching to centimetre precision against OSM; a 2 m mapped-envelope tolerance is tested. Ground landscape extends beyond the structural replacement footprint and masks no additional buildings.

An explicit bounded median terrain pad covers the two foot aprons and west lawn, with five reference samples and 12 m feather. It proposes one rigid level foundation, without modifying the catenary. Actual DEM resolution, contact residuals, surrounding lattice coverage and pad edges remain untested. The pad does not extend to the Mississippi or nearby roads.

## Geometry, materials and LOD

The generator samples the published weighted catenary, builds orthogonal equilateral triangular sections and interpolates section area with height. Foot triangles are clipped against y=0; the reusable shell contains no below-grade steel. Three longitudinal faces preserve hard triangular corners with smoothly varying normals along the curve. Crown windows are glazing patches in the steel tessellation, with the backing steel removed: there are no stacked window faces or polygon-offset dependency.

Bright neutral silver facets (`steel` #e4e8ea, inner #f0f1ef, outer shade #9b9e9f) preserve triangular ridge contrast in both LODs. Steel uses low roughness 0.18 and metalness 0.10: the texture-free inspector has no reflection environment, so a high metalness incorrectly darkens the shell. Runtime silver relies on palette and normals in the shared vertex-shaded renderer. The dark palette remains a floodlit silver interpretation.

Six merged draws per LOD: three steel facets, glass, paving and lawn. The former saturated lawn lens and four toy trees were removed. The flat low-saturation park strip fills the space between the legs; its parallel paths and compact triangular grey foot plazas replace the circular sand discs. Ground surfaces are disjoint and 10 cm above the local datum for depth clearance, with no raised mound. All landscape dimensions are approximate, rather than a surveyed park reconstruction. Far keeps the complete park outline, silver facet contrast, windows and open void.

Estimated: window station layout and vertical offset, material response/colours, paving and lawn extent. Omitted: underground museum/visitor centre, interior structure, trams, plaque lettering, fine weld lines, full park and ponds. Reflection highlights are stylized without an environment texture; changing reflected imagery is outside the texture-free export.

## Costs and verification

Review fix g11c, 2026-10-15: corrected the lawn/trees, foot paving and matte blue-grey steel findings. Published NPS catenary and dimensions, all 32 true crown glazing patches, complete OSM ownership and grounded shell feet are preserved.

| LOD | Before tris / draws / bytes | After tris / draws / bytes |
| --- | --- | --- |
| Near | 2738 / 8 / 192236 | 2130 / 6 / 172316 |
| Far | 1206 / 8 / 89488 | 918 / 6 / 77764 |

References personally inspected: `tmp/top-cities/gateway-arch/refs-sheet.jpg` (MrsTimmo, Jim Bowen and Dougtone; licence credits in the catalog). No new reference imagery was fetched. Final exported near/far sheets and photo comparison are in `tmp/next-200/fix/g11c/gateway-arch/`; app far/near/street evidence is under `app/{city,world}/`. The silver facet contrast, unchanged silhouette and removed lawn blob are the review targets. See `tmp/next-200/fix/g11c/REPORT.md` for final capture/check results.

Focused geometry tests pin height, span, triangular taper, weighted-catenary shoulder, open void, all crown windows, provider ownership and named ground contacts with a raised-foot negative control. Exports and the depth table are regenerated after the fix. No git writes or shared app-bundle rebuild were performed; app QA uses a scratch bundle under `/tmp` on slot L (3314/3316).

Both modes require independent re-review of the fresh captures. DEM contact residuals, lattice coverage, late terrain/provider loading, lifecycle transitions and Tesla hardware performance remain unverified; visual captures alone do not certify those gates.
