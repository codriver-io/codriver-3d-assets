# Walt Disney Concert Hall, Los Angeles

Original procedural representation of Frank Gehry’s hall at 111 South Grand Avenue, opened 23 October 2003. The recognizable exterior is a layered ensemble of curved stainless-steel sails over a stone base, with dark glazed folds and the broad low Grand Avenue ribbon. The model preserves nine distinct curved shells in both LODs.

## References and rights

- [LA Philharmonic venue page](https://www.laphil.com/about-us/our-venues/about-walt-disney-concert-hall): architect Frank Gehry, stainless-steel curves, 2,265 seats and 3.6-acre complex. Its current “Built: 2023” line conflicts with the documented 2003 opening; this model uses the established 2003 building.
- [Wikipedia](https://en.wikipedia.org/wiki/Walt_Disney_Concert_Hall): address, opening 23 October 2003 and construction 1999–2003.
- [OSM relation 6333150](https://www.openstreetmap.org/relation/6333150): 36.7 m height, outer way 425993488. The dossier omitted the relation members, so one small shared-helper query supplied the actual ring in `tmp/top-cities/walt-disney-concert-hall/relation.json`.
- Dossier `refs-sheet.jpg` and `refs/SOURCES.txt`: exterior images by Carol M. Highsmith (public domain), jjron (GFDL 1.2), Lando47 (CC BY-SA 4.0), Tuxyso (CC BY-SA 3.0), and Geographer (CC BY-SA 2.5); interior by Daniel Hartwig (CC BY 2.0). Exact Commons pages and credits are in the catalog record and were checked.
- The finished Musée des Confluences source/doc was studied for merged geometry, fold closure and small draw budgets, without copying geometry.

All geometry is original procedural work. No photograph, texture, third-party mesh or scan is shipped. Geographic data © OpenStreetMap contributors, ODbL 1.0. Photos remain in ignored reference storage.

## Dimensions and geographic frame

| Feature | Value | Evidence |
| --- | --- | --- |
| Highest sail | 36.7 m | OSM height tag; not a surveyed primary-source measurement |
| Grand Avenue ribbon | About 68 m wide, sloping 22–14 m crest | Photo estimate |
| Other tall sails | About 31–45 m wide, 24–36.7 m high | Photo estimates |
| Auditorium shoulders | 14–18 m | Photo estimate |
| Stone base | 0.65 m outer grade edge, recessed occupied base to 3.2 m | Photo estimate |
| Garden canopy | 8–8.5 m | Photo estimate |
| Origin | [-118.25, 34.05528] | Dossier geographic anchor |
| Frontage/outward bearing | 37° / 127° | Mapped control points |

The two long rear outline controls [-118.2507686,34.0551862] and [-118.2500233,34.0559773] establish the NE frontage alignment (about 38°). The procedural frontage vector is [0.6,-0.8] in east/south coordinates, about 37°, with outward normal [0.8,0.6]. Rotation is baked once into the vertices; the host must not rotate again. Axes are east/up/south in real metres, and y=0 is local flat entrance grade. No altitude, terrain or Mercator stretch is baked in.

Four footprint rings replace the full hall outer way 425993488 and garden parts 319307757, 319307763 and 319307760. The relation’s small inner garden hole is retained as mapping context; the contract uses the outer replacement envelope. Nearby Broad Museum, Colburn School, garage, Grand development and condominiums are excluded. The low grade plinth covers the owned cadastral outline, while slight shell overhangs are constrained to that outline. Every vertex is checked against the rings with 0.8 m provider slack.

## Modeling and approximations

Each sail has a hand-authored width, unequal crest heights, plan bow, vertical billow, flare, lean and twist. The three high sails have broad overlapping faces and restrained vertical curl. The Grand Avenue billow slopes from 22 m to 14 m and tapers at its ends; its stone frontage is recessed behind entrance glazing. A closed front/back loft tapers from a thick footing to a narrow top edge. Smooth indexed normals preserve curved steel rather than a faceted box or single blob. The nine shells are merged into one steel draw, without losing their independent geometry or editable definitions.

Near adds narrow horizontal steel panel joints; far drops subpixel joints while retaining every shell and deep fold. Opaque separate entrance panes, six-row glazed slots between high sails, stone service walls, a closed auditorium roof, entrance steps and garden canopy establish the secondary features. The entrance header contacts two named stone posts. Canopy columns extend to grade. Light/dark palettes share material names, with warm night entrance panes.

Sail topology and placement are photograph estimates rather than construction drawings. The full 12,500-panel seam network, vertical panel joints, signs, interior, organ and landscaping are omitted. The low ribbon and rear wall simplify more complex real curves. The cadastral podium represents the rigid base and simplifies the real sloping garden/terraces. Glazing is opaque; no Tesla hardware performance was measured.

## Review b7a corrections and verification — 2026-10-13

Finding 1: rebuilt west-high, central-high and east-high widths/profiles, reduced uniform vertical curl, added unequal twist and overlapping crests, and lowered auditorium shoulders so the exposed central box no longer dominates. Deep glazing folds remain separate geometry in both LODs. Finding 2: rebuilt grand-ribbon as a broad sloping billow with tapered ends, reduced the exterior grade slab from 3.2 m to 0.65 m and recessed the occupied stone base behind entrance glazing.

Compared dossier reference photos with exported near/far and light/dark contact sheets in `tmp/top-cities/shots/walt-disney-concert-hall/review-fix-2/`, covering overview, facade, rear, above, entrance and detail. Initial comparison is in `review-fix-1/`; exactly two look-fix iterations were used. The final source and exported GLBs retain consistent silhouettes and window/fold rhythm. No new external reference was fetched.

| LOD | Triangles | Draws | Bytes | KiB |
| --- | ---: | ---: | ---: | ---: |
| near | 26,473 | 6 | 695,676 | 679.4 |
| far | 4,878 | 5 | 191,560 | 187.1 |

Targeted landmark tests verify supported contacts, geographic ownership, LOD dimensions and the revised observable silhouette/relief. Depth regeneration plus targeted check pass with zero dropped cycle edges. Exported QA reports no issues for either LOD. Shared test run: 605/606 pass, including all six conformance checks for these two landmarks and all 15 focused tests; the only failure is unrelated Charles Bridge polygon validity. Catalog validation and `pnpm assets:check` pass (336 entries / 592 variants); `pnpm assets:preview` builds the ignored local inspector. Full log: `tmp/top-cities/walt-disney-concert-hall/review-tests.txt`.

Cityscape: **not tested for this revision**. Full 3D world: **not tested for this revision**. Supplied b7 baseline app views showed no obvious provider penetration or exposed footing, but they predate these geometry changes and do not measure DEM residuals. The lead recaptures app views and independent re-review after handoff; hillside datum, resident lattice coverage, uphill/downhill approaches, terrain lifecycle and hardware remain unverified. No app server, runtime bundle, deployment or git write was performed in the shared tree.
