# Tour Paradis

Teardrop-plan blue glass finance tower with a curved rising crown, open technical-roof lattice,136m antenna and a three-storey lower podium.

Version: exterior standing on 2026-11-10, Liège, Belgium. Original procedural geometry; reference photos are comparison-only and remain in ignored scratch. No logos or lettering.

## Dimensions and frame

Owner Régie des Bâtiments gives118m roof and136m including antenna,28storeys; Greisch rounds the office tower to120m. Model uses118/136m. Mapped plan is approximately33by51m. Curved sloping roof: estimated96m at broad rear to118m pointed crown; glass ends4m below open crown frame. Lower podium12m is an estimate consistent with three-storey architect description.

Origin 5.5720408500000005,50.626670000000004; +X east/+Y up/+Z south, y=0 local exterior grade. Rotation 2.962610664314651 radians is baked from the two mapped control points [[5.5722268,50.6264326],[5.5717894,50.6264828]]; the host must not rotate again. Footprints replace only OSM ways 368951511, 402139088. The twelve mapped perimeter control vertices are smoothly interpolated along the rounded sides; the broad straight rear face is retained. Maximum small interpolation deviations are authoring estimates, not a measured survey. Fixed4m storey heights clip against the curved roof; uniform blue panes, continuous pale vertical mullions and0.16m storey bands replace wall cells. No image textures, lettering or signage. y=0 exterior podium grade. The technical crown remains open in both LODs.

## Sources and rights

- [Landmark identity and architectural context](https://en.wikipedia.org/wiki/Tour_Paradis)
- [OSM mapped footprint](https://www.openstreetmap.org/way/368951511)
- [OSM mapped footprint](https://www.openstreetmap.org/way/402139088)
- [Owner:118m roof/136m antenna and28floors](https://www.regiedesbatiments.be/fr/projects/tour-des-finances)
- [Architect:two-building composition and facade rhythm](https://www.jaspers-eyers.be/p/paradis-tower.html)
- [Greisch structural engineering:rounded120m figure](https://www.greisch.com/en/projet/finance-tower-liege/)
- [File:Paradis-toren Luik 23-08-2018 11-41-01.jpg — Paul Hermans — CC BY 4.0](https://commons.wikimedia.org/wiki/File:Paradis-toren_Luik_23-08-2018_11-41-01.jpg)
- [File:Tour des Finances in Luik.jpg — Smiley.toerist — CC BY-SA 4.0](https://commons.wikimedia.org/wiki/File:Tour_des_Finances_in_Luik.jpg)

Original code/docs MIT; original commissioned model CC BY 4.0; OSM geographic data ODbL 1.0. Photographs retain their listed independent rights and are never shipped.

## Verification

Self-reviewed exported near/far contact sheet: `tmp/benelux/sheets/tour-paradis-liege.jpg`; mapped overhead: `tmp/benelux/tour-paradis-liege/qa/tour-paradis-liege-procedural-near-light-top.png`; dark exported far overview/facade: `tmp/benelux/tour-paradis-liege/dark/tour-paradis-liege-glb-far-dark-sheet.jpg`. Two exterior reference photographs were identified and compared before authoring. Deterministic QA: zero remaining flags; no material cycles; source identity tests and focused conformance passed. Compared completed exterior photos1 and4; construction photos2/3 excluded. First look prompted a three-storey glazed base and irregular pane colours in place of diagonal bands. Technical crown posts touch the actual roof mesh with a shortened-post negative case; mast,136m top and both exported LOD silhouettes pass.

| LOD | Triangles | Draws | Bytes |
| --- | --- | --- | --- |
| near | 22623 | 4 | 252232 |
| far | 9603 | 4 | 116224 |

Readiness covers the authored export. An independent reviewer and both-mode app verification remain later gates.

Cityscape: not tested. Full 3D world: not tested. Independent application and terrain verification belongs to a later batch.

## Independent-review follow-up — 2026-11-10

Author follow-up sheet: PASS; independent re-review pending. Removed random pane hashing entirely: the facade uses uniform blue glazing, with the spare dark-glass palette calibrated within15percent relative luminance. Added continuous pale0.16m storey bands at the existing4m levels and retained vertical mullions, curved taper, inclined roof and open technical crown. Far curve sampling was simplified to32 intervals to pay for the clearer storey rhythm; the single new sheet passes without pixel camouflage.

Fresh exported contact sheet: `tmp/followup/sheets/tour-paradis-liege.jpg`. Deterministic QA: zero flags; source identity/contact and focused registry conformance passed; depth table current with no material cycles.

| LOD | Triangles | Draws | Bytes |
| --- | --- | --- | --- |
| near | 22623 | 4 | 252232 |
| far | 9603 | 4 | 116224 |

Cityscape: not tested. Full 3D world: not tested.
