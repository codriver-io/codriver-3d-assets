# Walter Reed Bethesda tower

Bethesda’s historic white Naval Hospital tower: long dark vertical window stacks, a projecting front shaft and rising stepped crown above two low L-shaped pavilions facing Rockville Pike.

## Identity and sources

Current exterior at Bethesda, United States; researched 2026-11-10. Original procedural geometry and no redistributed reference imagery.

- [Identity and dimensions (published values distinguished from estimates below)](https://en.wikipedia.org/wiki/Walter_Reed_National_Military_Medical_Center)
- [Mapped replacement footprint 1011330679](https://www.openstreetmap.org/way/1011330679)
- [Officialcampusmasterplan:264ft historicBuilding1](https://www.montgomerycountymd.gov/brac/resources/files/master_plan-filetwo-082608.pdf)
- [NationalRegister: mainblock, L-shapedwings, quartzcladding and verticalfenestration](https://apps.mht.maryland.gov/medusa/PDF/NR_PDFs/NR-417.pdf)
- [Owner:historic tower and campusidentity](https://walterreed.tricare.mil/About-Us)
- [CTBUH:80.5m,19floors](https://www.skyscrapercenter.com/building/national-naval-medical-center/22204)
- [File:Walter Reed National Military Medical Center.jpg · United States Army · Public domain](https://commons.wikimedia.org/wiki/File:Walter_Reed_National_Military_Medical_Center.jpg)
- [File:WalterReedSW.jpg · Duane Lempke · CC0](https://commons.wikimedia.org/wiki/File:WalterReedSW.jpg)
- [File:WalterReedEast.jpg · Duane Lempke · CC0](https://commons.wikimedia.org/wiki/File:WalterReedEast.jpg)

## Frame and dimensions

Local rigid exterior footing plane y=0; real metres, +X east, +Y up, +Z south. Mapped rotation is baked once; no DEM, sea-level or Mercator scale. Origin: -77.094111,39.001825. Replacement OSM ways: 1011330679. The exact mapped polygon is retained in footprint.js.

|Dimension|Metres|Basis|
|---|---|---|
|Historic tower|80.4672| Published264ft, officialcampusmasterplan |
|Mapped PresidentZone|approx93×114| OSM1011330679 |
|Front shaft/main shoulder|62.5/66| Photo estimates |
|Upper crown shoulder/top|66/80.4672| Photo estimates |
|Base pavilions/parapet|16.8/17.6| Photo estimates,3–4historicstoreys |

Mapped orientation controls are LOCAL_RINGS[0][13] [-77.0942203,39.002351] and LOCAL_RINGS[0][14] [-77.094752,39.0023507]. The working-frame angle is atan2(Δsouth, Δeast) minus 180°; its inverse is baked back into east/up/south geometry. No extra placement rotation is required.

## Modelling and limits

This is the Bethesda historic tower and original PresidentZone base block, not the former WalterReedArmyMedicalCenter inWashington. The footprint supplies the projecting west entrance/tower stem, two L-shaped pavilions and low eastconnector. The tower’s higher masses are fitted within those mapped controls; their subdivisions are photo estimates. The1977NationalRegister description identifies a20storey tower and3/4storey pavilions; CTBUH gives19floors, while earlier accounts use other counts. This model records the disagreement and does not claim a surveyed floor schedule.264ft(80.4672m) is the officialcampusmasterplanheight. Bronze sash/serpentine spandrels form continuous darkverticals against offwhite quartz/concrete, as described in the register and confirmed by currentpost2011exteriorphotos1/3. Photo2 is a widercampuscontext view. New hospitalconstruction, detached modernmedicalblocks, roads, forecourt, flags, seals and lettering are omitted. All feet at a single localrigid y0; no terrainbaked. Source readiness does not establish RockvillePike or campusgrade fitting in eitherappmode. Wall and glass facade tiles adjoin without overlays; near/far retain the distinguishing profile and separate window bays. Colours were calibrated to the checked exterior photographs. No terrain is baked.

## Verification

Measured exports: near: 6296 triangles / 4 draws / 69336 bytes; far: 4856 triangles / 4 draws / 56336 bytes. Focused identity tests and registry conformance pass. Deterministic QA: zero flags; depth check: zero cycle edges. Visual comparison checked the exported near/far sheet against the two exterior photographs, the mapped source plan and exported far dark overview. Evidence: tmp/east/sheets/walter-reed-tower-bethesda.jpg and tmp/east/walter-reed-tower-bethesda/shots/. Both app modes remain untested.

Cityscape: not tested. Full 3D world: not tested.

## Independent review follow-up

Lightened floor spandrels to #adaf9f daylight / #879da7 dark. Main shaft bays retain 13 separate rows and the front stem 14 rows in both LODs; separators are at least 0.6 m tall and over 40/255 grayscale lighter than glass. The white piers, front projection and stepped crown retain their dimensions.

Re-exported both LODs; identity and regression tests, focused registry conformance, deterministic QA and depth check passed. New evidence: tmp/fixes/sheets/walter-reed-tower-bethesda.jpg. Independent re-review pending. Cityscape: not tested. Full 3D world: not tested.
