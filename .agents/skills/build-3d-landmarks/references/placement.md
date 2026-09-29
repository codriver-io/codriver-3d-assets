# Flat and terrain placement

A local model is independent of its host. Document y=0 and anchors rather than baking a DEM or global vertical datum.

- Cityscape: verify the local flat ground, building base and bridge approach profile.
- Full 3D world: verify a rigid building datum or pad and its edge; bridge abutments and piers need ground-aware contacts while the deck spans the valley. Generic tunnel roads follow a portal-to-portal datum below the hill.
- The host applies terrain ground and scene-origin compensation once. Exaggerating terrain must not silently scale the asset’s physical height or structural clearance.
- Missing terrain is unknown, not zero elevation. Late data and mode changes must refit from original vertices and invalidate affected navigation surfaces.
- Preserve unrelated roads and restore host geometry on model failure/disable/unload. A successful load precedes road/building replacement.

For this collection, see `docs/adr/0002-cityscape-and-topography.md` for the full evidence matrix. The public viewer does not verify either driving mode; mark app integration not tested unless you have actual evidence.

For host terrain QA, include a regional-to-street zoom and both mode switches. A first, coarse DEM sample must not become a permanent foundation altitude; refine it when better resolution arrives and preserve the best datum on zoom-out. Select reference samples and datum policy for the actual site, keeping landmark dimensions independent of terrain exaggeration.
