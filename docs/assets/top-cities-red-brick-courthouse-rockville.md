# Red Brick Courthouse

Rockville’s1891 red-brick courthouse with its square six-storey entrance tower, round-headed Romanesque windows, tiny clock faces, open belfry and steep slate pyramidal cap.

## Identity and sources

Current exterior at Rockville, United States; researched 2026-11-10. Original procedural geometry and no redistributed reference imagery.

- [Identity and dimensions (published values distinguished from estimates below)](https://en.wikipedia.org/wiki/Montgomery_County_Circuit_Courthouses)
- [Mapped replacement footprint 92809156](https://www.openstreetmap.org/way/92809156)
- [PeerlessRockville: caretaker history and identity](https://peerlessrockville.org/historic-rockville/peerless-places-2/red-brick-courthouse/)
- [City historic buildings catalogue](https://www.rockvillemd.gov/wp-content/uploads/2025/09/Historic-Buildings-Catalog.pdf)
- [MarylandArchives:1891courtbuilding](https://msa.maryland.gov/megafile/msa/speccol/sc2900/sc2908/000001/000545/html/am545--115.html)
- [File:Red Brick Courthouse, Rockville MD.jpg · Eden, Janine and Jim · CC BY 2.0](https://commons.wikimedia.org/wiki/File:Red_Brick_Courthouse,_Rockville_MD.jpg)
- [File:360 degree panorama of Old Rockville court house and fountain Rockville MD 2026-10-09 10-02-05 1.jpg · G. Edward Johnson · CC BY 4.0](https://commons.wikimedia.org/wiki/File:360_degree_panorama_of_Old_Rockville_court_house_and_fountain_Rockville_MD_2026-10-09_10-02-05_1.jpg)
- [File:1redcourthouse.jpg · «Marylandstater» «reply» · Public domain](https://commons.wikimedia.org/wiki/File:1redcourthouse.jpg)

## Frame and dimensions

Local rigid exterior footing plane y=0; real metres, +X east, +Y up, +Z south. Mapped rotation is baked once; no DEM, sea-level or Mercator scale. Origin: -77.15151518333333,39.08357783333333. Replacement OSM ways: 92809156. The exact mapped polygon is retained in footprint.js.

|Dimension|Metres|Basis|
|---|---|---|
|Main mapped plan|approximately18.5×32.6| OSM92809156 |
|Tower width/top|7.2/33.1| Photo estimates |
|Main wall/hipped roof|11.7/16.4| Photo estimates |
|Belfry opening|24.8–27.3| Photo estimate |

Mapped orientation controls are LOCAL_RINGS[0][1] [-77.1515299,39.0837469] and LOCAL_RINGS[0][3] [-77.1513346,39.0836727]. The working-frame angle is atan2(Δsouth, Δeast); its inverse is baked back into east/up/south geometry. No extra placement rotation is required.

## Modelling and limits

The district article and its initial photos included the1931grey courthouse, modern judicialcenter, bank and postoffice. These are excluded. The asset uses mapped building92809156, explicitly tagged RedBrickCourthouse at29CourthouseSquare, and its own mapped center rather than the historicdistrictarticleanchor. Exteriorphotos5and8show the same red tower and pyramidalroof; the October2026panorama6confirms the current location/context but trees obscure the crown, so it is not a crown-proportion source. The1931courthouse92809192 remains a separate unmodelled building. Totalheight and every vertical subdivision are photo estimates; no published surveyedheight was found. The six-storey entrance tower retains its triplet windows, circular clocks and three open belfrybays per face. A small original photo-estimated entrance-stair mask supplements the OSMwall footprint; no plaza/fountain/statue authored. Muted brick, brownstone and slate. Foundationfeet at localstreety0; no terrainbaked. Later appmode ground validation required. Wall and glass facade tiles adjoin without overlays; near/far retain the distinguishing profile and separate window bays. Colours were calibrated to the checked exterior photographs. No terrain is baked.

## Verification

Measured exports: near: 2030 triangles / 6 draws / 36532 bytes; far: 1462 triangles / 6 draws / 30296 bytes. Focused identity tests and registry conformance pass. Deterministic QA: zero flags; depth check: zero cycle edges. Visual comparison checked the exported near/far sheet against the two exterior photographs, the mapped source plan and exported far dark overview. Evidence: tmp/east/sheets/red-brick-courthouse-rockville.jpg and tmp/east/red-brick-courthouse-rockville/shots/. Both app modes remain untested.

Cityscape: not tested. Full 3D world: not tested.

## Independent review follow-up

Muted the masonry to dark red sandstone: daylight brick #84483f and dark palette #70423d, preserving the roof, clock belfry and all geometry. The daylight target matches the reviewer’s starting value without increasing saturation.

Re-exported both LODs; identity and regression tests, focused registry conformance, deterministic QA and depth check passed. New evidence: tmp/fixes/sheets/red-brick-courthouse-rockville.jpg. Independent re-review pending. Cityscape: not tested. Full 3D world: not tested.
