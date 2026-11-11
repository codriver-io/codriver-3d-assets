# Baltimore World Trade Center

Baltimore’s tall pentagonal concrete harbour tower, with five broad horizontal window stacks, heavy corner piers, recessed tall lobby glazing and a blank roof parapet.

## Identity and sources

Current exterior at Baltimore, United States; researched 2026-11-10. Original procedural geometry and no redistributed reference imagery.

- [Identity and dimensions (published values distinguished from estimates below)](https://en.wikipedia.org/wiki/Baltimore_World_Trade_Center)
- [Mapped replacement footprint 178328410](https://www.openstreetmap.org/way/178328410)
- [Renovation engineer STV:405ft,31storeys and current exterior](https://stvinc.com/project/baltimore-world-trade-center-tenant-improvements-2/)
- [File:WTCmemorial.jpg · Don Woods · CC BY-SA 3.0](https://commons.wikimedia.org/wiki/File:WTCmemorial.jpg)
- [File:Baltimore World Trade Center Jan. 18 2025.jpg · Jonmallard · CC BY 4.0](https://commons.wikimedia.org/wiki/File:Baltimore_World_Trade_Center_Jan._18_2025.jpg)
- [File:Baltimore World Trade Center 1.jpg · Smash the Iron Cage · CC BY-SA 4.0](https://commons.wikimedia.org/wiki/File:Baltimore_World_Trade_Center_1.jpg)
- [File:Baltimore World Trade Center (1973, Pei Cobb Freed & Partners), 401 E. Pratt Street, Baltimore, MD 21202 (35412068176).jpg · Baltimore Heritage from Baltimore, MD, USA · CC0](https://commons.wikimedia.org/wiki/File:Baltimore_World_Trade_Center_(1973,_Pei_Cobb_Freed_%26_Partners),_401_E._Pratt_Street,_Baltimore,_MD_21202_(35412068176).jpg)

## Frame and dimensions

Local rigid exterior footing plane y=0; real metres, +X east, +Y up, +Z south. Mapped rotation is baked once; no DEM, sea-level or Mercator scale. Origin: -76.60965833,39.28601667. Replacement OSM ways: 178328410. The exact mapped polygon is retained in footprint.js.

| Dimension | Metres | Basis |
|---|---|---|
| Roof |123.5| Published405ft, also OSM |
| Pentagon span |approx43×42| OSM mapped vertices |
| Tall lobby band |11.4| Photo estimate |
| Blank crown depth |4.7| Photo estimate |
| Office window rows |27 plus lobby | Facade interpretation; published30 storeys versus OSM29levels |

Mapped orientation controls are LOCAL_RINGS[0][0] [-76.6094171,39.2859606] and LOCAL_RINGS[0][1] [-76.6096599,39.2858094]. Each pentagonal facade is constructed directly between mapped vertices; no additional runtime yaw is applied.

## Modelling and limits

Pentagonal sides and street-facing point are retained from OSM, including the provider’s intermediate collinear vertices. Reference5 is a2025 street view,7 is a full-height harbour view,8 confirms the five-sided mass and tall glazed base,2 confirms the lobby material. References1/3/4 mostly show wetland exhibits or views from the tower and6 shows the Hyatt; they are not tower geometry sources. Published counts of28,30,31and32storeys and OSM29levels disagree; the facade uses27office rows plus the tall lobby and service crown without claiming a surveyed floor schedule. All band heights other than total roof height are estimates. No memorial, plaza, lettering or adjacent aquarium is authored. Wall and glass facade tiles adjoin without overlays; near/far retain the distinguishing profile and separate window bays. Colours were calibrated to the checked exterior photographs. No terrain is baked.

## Verification

Measured exports: near: 8166 triangles / 4 draws / 105836 bytes; far: 3996 triangles / 4 draws / 60228 bytes. Focused identity tests and registry conformance pass. Deterministic QA: zero flags; depth check: zero cycle edges. Visual comparison checked the exported near/far sheet against the two exterior photographs, the mapped source plan and exported far dark overview. Evidence: tmp/east/sheets/baltimore-world-trade-center.jpg and tmp/east/baltimore-world-trade-center/shots/. Both app modes remain untested.

Cityscape: not tested. Full 3D world: not tested.

## Independent review follow-up

Nit: warmed the pale concrete toward the reference tan (#b1a58c daylight) while retaining the pentagonal plan, recessed harbour arcade and all 27 separated office window rows in both LODs.

Re-exported both LODs; identity and regression tests, focused registry conformance, deterministic QA and depth check passed. New evidence: tmp/fixes/sheets/baltimore-world-trade-center.jpg. Independent re-review pending. Cityscape: not tested. Full 3D world: not tested.
