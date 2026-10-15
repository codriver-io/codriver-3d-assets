# Catedral de Alajuela

Original procedural exterior of Catedral de Nuestra Señora del Pilar, east of Parque Central in Alajuela, Costa Rica. This represents the photographed modern exterior of the cathedral completed in 1863, including the retained red-metal crossing dome, white porticoes and twin white bell turrets.

## Evidence and frame

- [Municipality architectural history](https://munialajuela.go.cr/servicios/desarrollo-social/sitios-arquitectonicos): completion in 1863, location and neoclassical character.
- [Parish history](https://catedral-alajuela.org/diocesisdealajuela/historia-de-nuestra-parroquia): work begun in 1854, blessed December 1863, dome begun February 1878.
- [OSM way 391297577](https://www.openstreetmap.org/way/391297577): the full cathedral footprint, transepts and apse; four levels, no published height. No neighboring ownership or extra building parts appear in the supplied extract.
- [Domo de la Catedral de Alajuela 2011](https://commons.wikimedia.org/wiki/File:Domo_de_la_Catedral_de_Alajuela_2011.jpg), Marlon OB, CC BY-SA 3.0: red drum, arched windows and dome profile.
- [Catedral de Alajuela1](https://commons.wikimedia.org/wiki/File:Catedral_de_Alajuela1.jpg), Lex.mercurio, CC BY-SA 2.0: side portico, roof and window proportions.
- [Church, Alajuela, Costa Rica](https://commons.wikimedia.org/wiki/File:Church,_Alajuela,_Costa_Rica.jpg), Donar Reiskoffer, CC BY 3.0: bell turret tiers.
- [La Iglesia Central de Alajuela](https://commons.wikimedia.org/wiki/File:La_Iglesia_Central_de_Alajuela.jpg), Richie D., CC BY 2.0: added frontal comparison, columns, clock and twin bell turrets. Its camera geotag is inconsistent; the actual façade agrees with the other reference and mapped location.

Photos are comparison references in ignored scratch only. No image, external mesh, texture or scan is shipped. Original editable geometry is self-contained, using Three.js and assetBuilder only.

Origin `[-84.21302806,10.01673469]`; metre axes east/up/south, rigid local grade y=0. Rotation −74° is baked once. The long north nave edge runs from `[-84.213385,10.0167675]` to `[-84.2129281,10.0168968]`, approximately 74°; the perpendicular west entry faces 254°. The footprint is the exact mapped ring, including both transepts and the eastern apse. Cornices may project less than 1.5 m beyond it; no plaza slab is claimed.

| Dimension | Value | Basis |
| --- | --- | --- |
| Overall plan length | about 74 m | OSM control points |
| Nave width | about 28.3 m | OSM outline |
| Transept envelope | about 53.5 m | OSM outline |
| Dome diameter | 22.7 m | Photo estimate fitted inside crossing |
| Dome spring / shell rise | 21 / 10.5 m | Photo estimate |
| Maximum height | 35.55 m at turret crosses | Photo estimate; not published |
| Nave wall / upper roof | 9.2 / 15.4 m | Photo estimate |
| White turret crosses | 35.55 m | Two-stage belfries estimated from front/side photos |
| Terrain pad radius | 40 m | Placement handoff, not terrain certification |

## Model and review repairs

The neoclassical white facade retains its genuinely open columned portico and clock pediment. The review repair adds the missing approximately 6 m square belfry stage with real arched openings and corner pilasters, a balustrade, an octagonal upper belfry and a stepped bell cupola. Crosses now reach 35.55 m, approximately 1.6 times the pediment apex. Engaged second-order columns, an entablature and a central arched upper-facade window replace the blank central slab. Near adds the drum's round oculi.

The broad red dome remains 22.7 m across, springing at 21 m and rising to 31.5 m. Seventy-two tiny round seam tubes were replaced with 24 broad flat darker-red colour bands that share the shell surface, eliminating floating relief and distance speckling. Far drops the seams and keeps the clean red shell, twelve separate arched drum windows, the open porches, two-stage turrets, clock and facade rhythm. Near/far are six/five merged materials. Rear facade subdivisions and minor ornament remain inferred; interiors, fence, plaza and statuary are omitted. The dark palette is subdued unlit masonry, red metal and glass.

## Export costs and verification

| LOD | Triangles | Draws | Bytes | KiB |
| --- | ---: | ---: | ---: | ---: |
| Near | 30,887 | 6 | 1,481,096 | 1446.4 |
| Far | 8,539 | 5 | 425,984 | 416.0 |

Final g7 repair evidence is under `tmp/next-200/fix/g7/catedral-de-alajuela/`: `reference-photos.jpg`, exported near/far GLB six-view contact sheets (overview, facade, rear/back, roof, street/field, detail), and `city/` / `world/` far, near and street screenshots plus active-layer reports. Photos remain ignored comparison references only. Static app views establish appearance/loading in each mode, not full terrain or lifecycle certification.

Focused landmark tests pass 14/14, including named canopy-column/roof contacts, lighting saddle contacts, shortened-end negative controls, roof thickness/slope, grade, footprint containment, true cathedral belfry openings and LOD silhouette. Final scoped registry checks pass 6/6. The requested complete registry run passed 815/817, with only unrelated Palais Bourbon missing-footprint/missing-manifest failures. Catalog validates 406 entries / 734 GLB variants. Final scoped exported QA has no issues: zero layered/coplanar conflicts or member-end flags; near back-face sweep 0%. Depth regeneration dropped zero cycle edges and `--check` passes.

Cityscape: static far/near/street appearance and successful loading verified in the captured app views. Full 3D world: static far/near/street appearance and successful loading verified in the captured app views. Terrain arrival/eviction, pad-edge stress cases, failed loads, day/night transitions and origin shifts are not tested in this repair; no terrain rollout or deployment is claimed.
