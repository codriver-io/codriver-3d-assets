# Texas State Capitol — Austin, Texas

Original procedural model of Elijah E. Myers’s 1888 Italian Renaissance Revival Capitol at Congress Avenue and 11th Street, including the current white 1986 Goddess of Liberty replica. This represents its unobstructed historic exterior, without temporary roof-restoration scaffolding. The underground 1993 extension and detached grounds structures are outside the model’s ownership. Authoring date: 12 October 2026.

## Sources, dimensions and present finish

The prepared dossier was the starting point: `tmp/top-cities/texas-state-capitol/{osm.txt,osm.json,facts.txt,refs-sheet.jpg}`. Its six-photo contact sheet was read before authoring. No additional photo downloads or Overpass requests were needed. The United States Capitol source and documentation were studied for open colonnades, staged dome profiles and material batching; its geometry was not copied.

Checked sources:

- [State Preservation Board architecture gallery](https://www.tspb.texas.gov/prop/tc/tc-architecture/index.html): exterior dome of sheet metal and cast iron with columns and balconies; official rounded overall height of 302 feet.
- [SPB restoration portfolio](https://www.tspb.texas.gov/prop/projects/tc-projects.html): dome painted in 2010 to match Texas Sunset Red granite; ongoing roof replacement and historic north porch. The task’s white-dome description conflicts with the present finish and the reference photographs, so the model follows the granite-coloured painted dome.
- [SPB Goddess history](https://tspb.texas.gov/prop/tc/tc-history/goddess/index.html): nearly sixteen-foot statue, white since 1939, aluminum replica installed in 1986.
- [SPB Capitol brochure](https://tspb.texas.gov/plan/brochures/doc/in_print/capitol/capitol_brochure.pdf): 1888 completion, Sunset Red granite, published dimensions over 566 by 288 feet.
- [Texas State Capitol](https://en.wikipedia.org/wiki/Texas_State_Capitol): more precise 302.64-foot overall height and identity; this precision is secondary-source information, while SPB rounds the height.
- [OSM way 25758443](https://www.openstreetmap.org/way/25758443): current mapped building envelope and sixteen overlapping provider outlines/parts from the dossier.

| Feature | Model / reference value | Basis |
| --- | --- | --- |
| South-grade to star tip | 302.64 ft = 92.2447 m | Published secondary value; SPB rounds to 302 ft |
| Overall architectural-frame width | Approximately 167 m, including cornice relief | Mapped OSM envelope; not forced to the historic 566-ft dimension |
| Architectural-frame north–south depth | Approximately 90 m | Mapped outline; published 288-ft dimension uses a different envelope |
| Wing wall height | 26.2 m; corner roofs to 32.5 m and finials to 34.4 m | Photo estimates informed by OSM 28/32/35-m parts |
| Central wall / pediment summit | 35 / 42.2 m | Estimated from photographs |
| Outer peristyle cornice diameter | 30.3 m | Mapped dome ring and photographic estimate |
| Peristyle / attic / shell | Columns 44.1–56.2 m; attic to 65.3 m; shell to 79.5 m | Estimated intermediate stages within sourced overall height |
| Goddess and raised star | Approximately 4.9 m, from 87.35 to 92.2447 m | SPB nearly 16 ft, simplified original silhouette |
| Peristyle / lantern / north porch supports | 24 / 8 / 6 | Photo estimates, not a surveyed column count |

## Geographic frame and provider replacement

Metres; +X east, +Y up, +Z south. Origin `[-97.740348684, 30.274671156]` is the mean of the mapped dome ring. Local y=0 is south-front entrance ground grade. No sea-level datum, latitude stretch, DEM elevation or world-scene origin is baked into the GLBs.

Two successive south-front outline controls, `[-97.7402209,30.2744828]` and `[-97.7402494,30.2744063]`, give approximately 197.835° south-facing bearing. The model uses a rounded 198° frontage; the wing axis is approximately 108°. A −18° Three.js Y rotation is baked once. `texas-state-capitol-plan.js` stores local measured outline coordinates before that rotation. The final exported top view was read against the red OSM rings.

`footprint.js` includes the main outline and all fifteen mapped Capitol parts: ways 25758443, 516187625, 1364720761, 734639131, 1364720762, 1364720759, 734639130, 734639134, 734639133, 952130542, 952130555, 734639132, 1364720760, 734639135, 734639136 and 734639137. North extension skylights, the Texas Supreme Court Building and neighbouring buildings remain outside ownership. Every model vertex fits the mapped main ring within 0.85 m of cornice/glazing relief; tests check actual vertices independently of the generator formulas.

The rigid building declares a bounded median terrain pad using the main envelope and four site reference points, with a 12 m feather. This is authoring metadata only.

## Structure, materials and approximations

The model keeps the wings’ mapped setbacks, rusticated basement rhythm, four rows of separate window apertures, four raised corner pavilions with dark mansard roofs and small supported finials. The south front has a deep giant arched recess, inner balcony levels, four engaged giant-order columns, triangular pediment, round oculus and six small geometric state-seal roundels. The opposite side has a six-column porch with real open bays.

The dome has a windowed lower drum, twenty-four separate supports around a recessed windowed core, circular balcony, arched attic windows, curved shell with twenty-four embedded raised ribs and oval apertures, open eight-support lantern and a white robed human silhouette holding a five-point star. Rib centrelines are embedded in the shell, including the steep crown, rather than suspended outside it. Each dome support is tested against actual podium and entablature triangles with column faces excluded; a deliberately shortened endpoint fails the same support assertion.

Six merged materials: subdued pink `stone`, grey-green metal `roof`, dark daytime / warm nighttime window `light`, pale `statue`, lantern `lamp`, blue-grey `seal`. The painted dome follows stone. Night glazing and lantern use the runtime’s self-lit material names; granite becomes dimmer and warmer. Night lighting is a stylised uniformly lit-window treatment, not a survey of room occupancy or simulated facade floodlights.

Fine Corinthian carving, rustication joints, pediment sculpture, accurate seals, window hardware, balusters and the Goddess’s facial detail are abbreviated. The shell and mansards are estimated profiles rather than architectural scans. Roof surfaces show the historic shape without temporary works or detailed equipment. Interiors, flags, site monuments, trees and the underground extension are omitted. Near has paired glazing and window lintels/sills; far keeps all facade rows and the dome/porch openings while dropping fine trim and reducing curved segments. Glazing relief uses generated material depth order; no unresolved layered faces or material cycle remains.

## Exports and verification

Exported normally with `pnpm build:top-cities-landmarks texas-state-capitol --no-check`.

| LOD | Triangles | Draws | GLB bytes | KiB |
| --- | ---: | ---: | ---: | ---: |
| near | 34,602 | 6 | 1,681,336 | 1,641.9 |
| far | 10,090 | 6 | 490,900 | 479.4 |

Independent review b2a identified a weak drum colonnade and flattened south/wing order. Recessed the drum backing from radius 11.6 m to 10.5 m, moving its windows together, and enlarged all 24 column shafts from radius 0.48 m to 0.76 m including their bases/capitals. Both LODs retain stepped balcony/entablature courses and more than 3.5 m of visible depth from the column fronts to the backing windows. The peristyle remains open, and all column ends meet the original named podium/entablature.

The south giant-order columns have larger shafts and capitals, the arch has a continuous curved projecting surround, and both south facade and wings retain strong projecting cornices and corner pilasters. Pavilion capitals sit above the upper window heads, avoiding reversed stone/window depth ordering. A corner-envelope check trimmed the added relief without changing the replacement footprint. Far retains the complete individual window grid, column bays and cornice/arch silhouette; its hidden rib backs are omitted using joined two-slope ridges embedded into the dome. Those surfaces preserve rib projection while recovering enough space for the architecture below 500 KB.

Two review look/fix rounds were used. Final exported GLB sheets were inspected at `tmp/top-cities/shots/texas-state-capitol/review-fix-2/texas-state-capitol-glb-{near,far}-{light,dark}-sheet.jpg`: overview, front, opposite facade, roof, dome and entrance by day; overview/front/dome by night. The deeper column order is visible in both LODs and the southern arch stays recessed. Fine stone carving and the Goddess remain simplified. Dome paint remains matched to Sunset Red granite, consistent with the dossier photos and the cited State Preservation Board restoration record; the Goddess is white.

Eight Texas tests pass, covering published 302.64 ft height, star, dome depth/open bays, south arch/steps/seals, north porch/lantern openings, ribs/finials, mapped envelope, far rhythm and named column contacts with a negative case. Final combined focused test log is `tmp/top-cities/helsinki-cathedral/review-fix-tests.txt`; it passes 416/416, including all nine Helsinki tests and the top-cities registry. Selected metrics at `tmp/top-cities/helsinki-cathedral/review-fix-metrics.json` are clean; depth regeneration and check have zero material cycles. Catalog validation passes. The temporary unrelated AT&T Stadium syntax error was resolved before this normal repository export; no isolated exporter is used for these final artifacts.

Cityscape: **not tested after this revision**. Full 3D world: **not tested after this revision**. The lead owns app recapture, rigid-ground/terrain and provider/lifecycle checks and independent re-review. No app server or shared renderer was changed.

## Reference image attribution

No photo pixels or external mesh are shipped. Dossier attribution, retained in the catalog:

- Michael Barera, [Texas State Capitol August 2019 11](https://commons.wikimedia.org/wiki/File:Texas_State_Capitol_August_2019_11.jpg), CC BY-SA 4.0 — south facade and dome stages.
- Daniel Mayer, [Texas Ranger monument in front of Texas State Capitol](https://commons.wikimedia.org/wiki/File:Texas_Ranger_monument_in_front_of_Texas_State_Capitol.JPG), CC BY-SA 3.0 — entrance/pediment detail; monument itself excluded.
- Kumar Appaiah, [Texas State Capitol (4195756025)](https://commons.wikimedia.org/wiki/File:Texas_State_Capitol_(4195756025).jpg), CC BY-SA 2.0 — night silhouette.
- Kumar Appaiah, [Texas State Capitol – North Side (3208303879)](https://commons.wikimedia.org/wiki/File:Texas_State_Capitol_-_North_Side_(3208303879).jpg), CC BY-SA 2.0 — opposite frontage and wings; file-page licence checked.
- Tim Wilson, [Texas State Capitol (3484195881)](https://commons.wikimedia.org/wiki/File:Texas_State_Capitol_(3484195881).jpg), CC BY 2.0 — south entrance axis.
- aswinkb, [Texas capitol](https://commons.wikimedia.org/wiki/File:Texas_capitol.jpg), CC BY-SA 2.0 — street angle and painted dome colour.

Mapped data © OpenStreetMap contributors, ODbL 1.0. Geometry is original procedural work, with no traced or copied third-party mesh.
