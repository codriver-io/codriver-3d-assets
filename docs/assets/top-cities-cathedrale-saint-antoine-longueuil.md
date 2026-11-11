# Co-cathédrale Saint-Antoine-de-Padoue

Longueuil’s asymmetrical Gothic co-cathedral: one high green needle spire, a lower pavilion-roof bell tower, three pointed portals, a large rose and a crossing lantern.

## Identity and sources

Current exterior at Longueuil, Canada; researched 2026-11-10. Original procedural geometry and no redistributed reference imagery.

- [Identity and dimensions (published values distinguished from estimates below)](https://en.wikipedia.org/wiki/Co-Cathedral_of_Saint-Antoine-de-Padoue)
- [Mapped replacement footprint 164722879](https://www.openstreetmap.org/way/164722879)
- [Québec heritage inventory: asymmetrical towers, rose and triple portal](https://www.patrimoine-culturel.gouv.qc.ca/detail.do?id=92963&methode=consulter&type=bien)
- [Parish identity and exterior](https://cocathedrale.ca/divers/eglise-cocathedrale/)
- [File:Co-Cathedrale Saint-Antoine.jpg · JasonParis from Toronto, Canada · CC BY 2.0](https://commons.wikimedia.org/wiki/File:Co-Cathedrale_Saint-Antoine.jpg)
- [File:Stepal of Cathédral St-Antoine de Padoue, Longueuil,Québec.jpg · Mathieu Landretti · CC BY-SA 4.0](https://commons.wikimedia.org/wiki/File:Stepal_of_Cath%C3%A9dral_St-Antoine_de_Padoue,_Longueuil,Qu%C3%A9bec.jpg)
- [File:Rue Saint-Charles - rue Saint-Alexandre, Longueuil 03.jpg · Jeangagnon · CC BY-SA 3.0](https://commons.wikimedia.org/wiki/File:Rue_Saint-Charles_-_rue_Saint-Alexandre,_Longueuil_03.jpg)

## Frame and dimensions

Local rigid exterior footing plane y=0; real metres, +X east, +Y up, +Z south. Mapped rotation is baked once; no DEM, sea-level or Mercator scale. Origin: -73.507931,45.540289. Replacement OSM ways: 164722879. The exact mapped polygon is retained in footprint.js.

| Dimension | Metres | Basis |
| --- | --- | --- |
| Highest spire and cross | 81 | Wikipedia infobox; approximate exterior-grade interpretation |
| Published length / width | 74 / 41 | Wikipedia infobox; mapped full annex envelope is longer |
| Main nave eave / ridge | 19 / 32 | Exterior photo estimates |
| High tower stone / spire spring | 40 / 45 | Photo estimates |
| Lower tower roof and pinnacles | 39–42 | Photo estimates |

Mapped orientation controls are LOCAL_RINGS[0][18] [-73.5083277,45.5402766] and LOCAL_RINGS[0][19] [-73.5080334,45.5401651]. The working-frame angle is atan2(Δsouth, Δeast); its inverse is baked back into east/up/south geometry. No extra placement rotation is required. The long nave axis is measured from mapped vertices; the principal facade faces the northwest road intersection. The taller east tower is on the east side of the front facade.

## Modelling and limits

The primary Québec heritage inventory explicitly describes dissimilar towers, with a high east spire and pavilion west roof. The original batch description of paired spires was corrected after photo review. Spire height is reported as 81 m by the article; secondary heritage descriptions sometimes confuse 74 m length and height, so exterior heights remain approximate. Rose tracery, pointed portal reveals, lancets, buttresses and crossing lantern are simplified original geometry. No lettering or imagery. Historic 1885 illustration was rejected as a current exterior photo. Wall and glass facade tiles adjoin without overlays; near/far retain the distinguishing profile and separate window bays. Colours were calibrated to the checked exterior photographs. No terrain is baked.

## Verification

Measured exports: near: 2669 triangles / 7 draws / 50924 bytes; far: 2053 triangles / 7 draws / 42880 bytes. Focused identity tests and registry conformance pass. Deterministic QA: zero flags; depth check: zero cycle edges. Visual comparison checked the exported near/far sheet against the two exterior photographs, the mapped source plan and exported far dark overview. Evidence: tmp/east/sheets/cathedrale-saint-antoine-longueuil.jpg and tmp/east/cathedrale-saint-antoine-longueuil/shots/. Both app modes remain untested.

Cityscape: not tested. Full 3D world: not tested.

First visual correction: pointed lancets replace the initial rectangular window tops in both LODs, including the eight-sided crossing drum. The slate nave/annex roof now has a separate muted grey palette from the green copper spire and cupola.

Geographic audit: fitted front tower widths and corner pinnacles to the mapped envelope, chamfered the clerestory/roof corners to the actual nave polygon and closed the ceremonial gable connection. Heights and asymmetric silhouette are unchanged. Near/far component containment now has explicit regression tests at the provider’s0.8m slack plus5cm rounding tolerance.

## Independent review follow-up

Nit: strengthened the existing portal, rose surround and belfry trim through a warmer, lighter trim tone against slightly darker stone. Unequal towers, crossing lantern, rose tracery and all geometry are unchanged.

Re-exported both LODs; identity and regression tests, focused registry conformance, deterministic QA and depth check passed. New evidence: tmp/fixes/sheets/cathedrale-saint-antoine-longueuil.jpg. Independent re-review pending. Cityscape: not tested. Full 3D world: not tested.
