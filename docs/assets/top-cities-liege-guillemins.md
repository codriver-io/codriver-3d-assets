# Liège-Guillemins station

Open Calatrava station shell with39 fanning white arches, glazed saddle canopy, raised front and rear visors, converging grounded bearings and narrow platform awnings.

Version: exterior standing on 2026-11-10, Liège, Belgium. Original procedural geometry; reference photos are comparison-only and remain in ignored scratch. No logos or lettering.

## Dimensions and frame

Mapped central oval is approximately200by150m, with longer platform canopy extensions. Near39 main arches, far21 aggregates retain the fan and open hall. Model crown40m above entrance grade; inner vault31m. Contractor Wust gives40m while CIT Blaton gives35m, and Calatrava gives200m terminal/145m platform extension. The relative platform/entrance datum is not surveyed; this reconstruction uses40m above flat exterior grade and records the published difference.

Origin 5.567512300000001,50.623865699999996; +X east/+Y up/+Z south, y=0 local exterior grade. Rotation -0.8835762612165416 radians is baked from the two mapped control points [[5.567899,50.6239772],[5.5696605,50.6226155]]; the host must not rotate again. Footprints replace only OSM ways 43683048, 549525400. y=0 exterior entrance grade. Grounded support bearings at both arch convergence points; hall remains open below the shell. Five simplified platform bases start0.10m above grade and platform tops are5m above the exterior entrance datum (estimated reconciliation of the35m/40m published heights). Lower concourse and short escalator housings estimated. Temporary coloured film artwork is omitted; comparison photos show the permanent2009 white steel/glass structure. Railway track geometry and terrain fitting are deferred to application verification. Only the mapped roof and authored concourse sub-footprint replace host geometry; the larger station549525400 outline is reference-only outside those masks. No station names, train liveries or logos.

## Sources and rights

- [Landmark identity and architectural context](https://en.wikipedia.org/wiki/Liège-Guillemins_railway_station)
- [OSM mapped footprint](https://www.openstreetmap.org/way/43683048)
- [OSM mapped footprint](https://www.openstreetmap.org/way/549525400)
- [Architect project overview and axial plan](https://prod.calatrava.com/projects/guillemins-tgv-railway-station-liege.html)
- [Construction contractor:39 arches and40m](https://www.wust.be/fr/projets/liege-gare-des-guillemins)
- [Construction contractor:35m roof](https://citblaton.be/en/projets/gare-sncb-liege-guillemins)
- [File:Liège Luik Lüttich (4411635751).jpg — Bert Kaufmann from Roermond, Netherlands — CC BY 2.0](https://commons.wikimedia.org/wiki/File:Li%C3%A8ge_Luik_L%C3%BCttich_(4411635751).jpg)
- [File:Station Luik-Guillemins 23-08-2018 11-36-01.jpg — Paul Hermans — CC BY 4.0](https://commons.wikimedia.org/wiki/File:Station_Luik-Guillemins_23-08-2018_11-36-01.jpg)

Original code/docs MIT; original commissioned model CC BY 4.0; OSM geographic data ODbL 1.0. Photographs retain their listed independent rights and are never shipped.

## Verification

Self-reviewed exported near/far contact sheet: `tmp/benelux/sheets/liege-guillemins.jpg`; mapped overhead: `tmp/benelux/liege-guillemins/qa/liege-guillemins-procedural-near-light-top.png`; dark exported far overview/facade: `tmp/benelux/liege-guillemins/dark/liege-guillemins-glb-far-dark-sheet.jpg`. Two exterior reference photographs were identified and compared before authoring. Deterministic QA: zero remaining flags; no material cycles; source identity tests and focused conformance passed. The fanning roof and raised visors were compared against both exterior views, including focused road-facing facade and street exports. All arch ends meet bearing tops; the shortened-end negative case fails contact. Awning columns are located from exact mapped roof-strip intersections and each must hit its roof8.5m top in tests; extraneous full-station masking was removed.

| LOD | Triangles | Draws | Bytes |
| --- | --- | --- | --- |
| near | 21804 | 4 | 323120 |
| far | 7100 | 4 | 110616 |

Readiness covers the authored export. An independent reviewer and both-mode app verification remain later gates.

Cityscape: not tested. Full 3D world: not tested. Independent application and terrain verification belongs to a later batch.

## Independent-review follow-up — 2026-11-10

Author follow-up sheet: PASS; independent re-review pending. Raised primary steel-white brightness and darkened the blue-grey glazing in both palettes without adding ribs or triangles. The fresh exported sheet shows clearer shell-edge contrast; whole-site framing remains distant, and the requested normal-distance app view is deferred under the no-app-server rule. Cityscape and Full 3D world remain not tested.

Fresh exported contact sheet: `tmp/followup/sheets/liege-guillemins.jpg`. Deterministic QA: zero flags; source identity/contact and focused registry conformance passed; depth table current with no material cycles.

| LOD | Triangles | Draws | Bytes |
| --- | --- | --- | --- |
| near | 21804 | 4 | 323120 |
| far | 7100 | 4 | 110616 |

Cityscape: not tested. Full 3D world: not tested.
