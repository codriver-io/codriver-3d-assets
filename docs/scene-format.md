# Portable scene format

The Jacques-Cartier pilot uses `codriver-scene` version 1. Download the ZIP from
the model's library entry or `/scenes.html`. It is an experimental portable scene,
independent of the original model downloads and their application placement.

The root `scene.json` declares a geographic origin, local metres, east/up/south
axes, vertical datum, original LODs, terrain/road inputs, source surface records,
separate Cityscape/world preset GLBs, notices and SHA-256 hashes for every file.
Each preset has its own application validation state. The current pilot records
both as **not tested**; exported geometry and offline loading are verified.

Original `near.glb` and `far.glb` retain the model's metric authoring geometry.
The assembled `cityscape.glb` and `world.glb` include placement and surfaces;
world ground comes from the archived DEM with the bounded pavilion foundation.
Road geometry comes from the authored shared bridge profile. These are visual
scenes, without engine-specific driving physics or captured live HD lane meshes.

`inputs/osm-roads.json` retains the bounded road capture. Its canonical chain
decisions are in `inputs/road-snapshot.json`, bound to a content revision. The two
DEM PNGs, source alignment and metadata allow offline inspection. Models, OSM
and terrain retain separate notices in `NOTICES.json`; the preset GLBs also carry
scope-specific credits in their asset metadata. See the source's
[terrain attribution](https://github.com/tilezen/joerd/blob/master/docs/attribution.md).

With this repository's Node tooling, verify an extracted package using:

```sh
node scripts/verify-scene.mjs /path/to/extracted-scene
```

Verification checks all dependency hashes, path containment, separate modes,
default-scene topology and external GLB resources. `pnpm check` also validates
the distributed ZIP checksum and file list, extracts it into a fresh directory,
reverifies its contents and checks source notices. Original procedural source
and generators remain available separately in this repository.

Internal authoring comparisons are maintained in the Codriver app repository's
`docs/world-scene-pipeline.md`. They are not deployed as library pages.
