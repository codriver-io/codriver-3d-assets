# Truist Park — Cumberland, Georgia

Original procedural model of the Atlanta Braves' 2017 open-air ballpark at 755 Battery Avenue SE, using the current Truist identity. The Battery's hotels, offices and retail blocks are excluded. No third-party mesh, scan, photo or texture ships.

## Sources and geographic frame

- [Atlanta Braves official ballpark guide](https://www.mlb.com/braves/ballpark/information/guide): left-field corner 335 ft, centre 400 ft, right-field corner 325 ft.
- [Populous project](https://populous.com/showcases/atlanta-braves-ballpark): 2017 opening, unusually large canopy and the intimate seating bowl.
- [Walter P Moore](https://www.walterpmoore.com/projects/truist-park): 108,000 square foot canopy (context only; the procedural roof area is not a measured replica).
- [OSM relation 9051237](https://www.openstreetmap.org/relation/9051237), outer way **483842488**, pitch/hole **559996049**, and Chop House building part **561604015**. OSM © contributors, ODbL 1.0. The shared Overpass helper failed; the two missing ring geometries were obtained with individual OSM API `/way/id/full.json` calls. No neighbouring Battery ways are owned.
- Dossier reference sheet and CC0 Commons photographs: *SunTrust Park view behind home plate, May 2017*, *SunTrust Park near 3B, May 2017*, *SunTrust Park batter's eye, May 2017*, *The Battery Atlanta high rises viewed from SunTrust Park, May 2017* by Thomson200; *Truist Park 2025* by TarheelBornBred. Titles and direct file-page links are in the catalog record. Statue photograph unused.

Origin **[-84.46778356706986, 33.8907186522273]**. Real metres, +X east, +Y up, +Z south, rigid local grade y=0; no absolute altitude, terrain height or Mercator stretch. The orientation is baked into the mesh. The mapped home-backstop arc near old dossier coordinates [10,-140] and centre-field edge near [60,-14] establish the southeast field axis. Home plate is northwest of centre field, facing approximately 155 degrees, correcting the dispatch's southwest description. Ground ownership is the mapped outer stadium ring; its pitch hole contains no provider building and is represented by the authored field.

| Feature | Model | Basis |
| --- | --- | --- |
| Stadium envelope | about 275.9 m east–west × 242.6 m north–south | mapped OSM outer ring |
| LF / CF / RF distances | 102.108 / 121.92 / 99.06 m | official 335 / 400 / 325 ft; CF field boundary simplified from OSM |
| Base spacing | 27.432 m | regulation 90 ft |
| Four main seating tiers | tops 12 / 22 / 31 / 40 m | estimated from photos |
| Canopy | inner 42.5 m, outer 48 m, 0.18 m skin | estimated outward-rising horseshoe profile |
| Floodlight top | 55 m | estimate, not a surveyed building height |
| Left-field board | 35 × 23 m | photo estimate |
| Chop House | mapped plan, 10.5 m roof plus canopy | plan mapped; height estimated |

## Construction and review repairs

Four stepped teal seating tiers wrap the open baseball field; the outfield stands and brick wall remain lower toward the Chop House. The playing surface keeps the regulation corner lines, broad infield dirt arc, grass diamond, mound, bases and warning track. The left-field video board uses a dark abstract screen surrounded by a separate 60 cm steel frame, with no broadcast image or lettering. Surrounding Battery buildings are excluded.

The review repair replaces the slab-like canopy with a closed 18 cm skin rising from 42.5 m inward to 48 m at the rear. Complete top/bottom chords and diagonal webs lie underneath, meeting named ground columns and the roof; detached on-top stubs are gone. Brick dominates the street facade, with larger spaced dark-tinted openings, an open upper gallery, and three white steel stair towers visible through gate cuts. Three full-height outfield lattice lights have wide two-row, eight-lamp banks attached to steel crossheads and vertical lamp rails. They stand on saddles on the 12 m concourse. The three short home-side canopy light stubs and their concrete pads are omitted in this scoped repair; no replacement home-side towers are claimed.

The g7r repair removes all per-row concrete aisle cheeks. Each aisle side and covered/uncovered tier end instead uses one continuous low teal face per tier, matching the stands; the shallow closed tier undersides and ordinary concrete seating risers remain. Rear tier caps and inward-facing brick/glass linings close the surfaces exposed by the gates. The clockwise mapped perimeter determines wall normals even at concave notches. Near uses 96 radial sectors and 39 main rows; far uses 32 sectors and 12 coarser main rows while keeping every tier level, individual facade openings, roof structure, field, board and pavilion. Eight merged materials remain in both LODs. Detail dimensions and the facade bay pattern are photo estimates, not a measured reconstruction; no individual chairs, fine brick courses, logo, crowd, statue, hotel or office is reproduced.

## Export costs and verification

| LOD | Triangles | Draws | Bytes | KiB |
| --- | ---: | ---: | ---: | ---: |
| Near | 27,025 | 8 | 1,465,184 | 1430.8 |
| Far | 8,101 | 8 | 442,680 | 432.3 |

Final scoped g7r evidence is under `tmp/next-200/fix/g7r/truist-park/`: exported near/far GLB six-view contact sheets (overview, facade, rear/back, roof, field and board detail), and `city/` / `world/` near and street screenshots with active-layer reports. Both sheets and all four app screenshots were inspected against the dossier reference sheet. The light stubs are absent, the dark screen has its own steel frame, and the old bright per-row aisle sides are replaced by continuous teal faces. Two exported look iterations were used: the first bright board frame introduced a material cycle, resolved by using steel for the frame in the final export. The uniform exterior bay pattern is retained under the explicit “change nothing else” scope.

Near costs fell from 32,857 triangles / 8 draws / 1,780,640 bytes to 27,025 / 8 / 1,465,184; far fell from 8,913 / 8 / 487,004 to 8,101 / 8 / 442,680. The shared `public/peregrine.js` was never rebuilt. Static app views establish appearance/loading in each mode, not full terrain or lifecycle certification.

The seven focused landmark tests pass, including unchanged mapped bounds, field and canopy contacts, full-height concourse light supports, shortened-end negative controls, LOD silhouette and four-sided board frame raycasts in both LODs. Exported QA reports no issues. The requested complete registry test run passed 802/804, including all three Truist checks; its only failures are the unrelated Palais Bourbon missing-footprint and missing-manifest checks. Catalog validation passes with 406 entries / 736 GLB variants, and `pnpm assets:preview` builds the ignored local inspector. Full logs are in the g7r evidence folder.

Cityscape: static near/street appearance and successful loading verified in the captured app views. Full 3D world: static near/street appearance and successful loading verified in the captured app views. Terrain arrival/eviction, pad-edge stress cases, failed loads, day/night transitions and origin shifts are not tested in this repair; no terrain rollout or deployment is claimed.
