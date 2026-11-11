# Building structure

Begin with mapped footprint/orientation, total height, massing and roof profile. Identify the feature that makes the building recognizable: a geodesic lattice, offset housing modules, a dome, a sloping tower or a sign. Keep negative space rather than replacing open structures with opaque shells.

Separate the main rigid building from site terraces, retaining walls and detached features. Record the foundation plane, footprint and estimated site relief. Do not bend walls or roof to fit terrain; a host can select a rigid datum, pad or explicit stepped foundations. Neighboring generic buildings may need reversible replacement in the host, but do not bake that behavior into the asset.

Roofs, eaves and attached details follow their supports:

- A hip or gable helper runs its ridge along the footprint's long axis, or takes an explicit axis; test it on a footprint long in X and one long in Z.
- Eaves rest on wall, parapet or pier tops in both LODs. Compare every eave height with the mapped wall height; a gallery roof 1 m above its wall floats.
- Dormers, lucarnes and roof ornaments take their height from the parent roof at their own position (the same hip parameters), never a fixed offset. Their panes stand above the slope, and nothing is buried inside the roof.
- Close every recess, cutaway, open bay and crown: cheeks face the notch, an open bay shows an interior or glazing, a tower top has its ceiling. See the construction defects in [quality](quality.md).

Match facade rhythm at useful viewing distances; combine repeated elements into a small number of meshes/materials. The far model may omit fittings while retaining roofline, silhouette, key openings and window rows/bays as coarser separate quads; compare far and near at matching framing, rejecting full-height dark stripes, giant bands and blank slabs. Relief/statue groups need grouped human silhouettes; crown/lantern/belfry tier proportions stay within ~8 %. Calibrate muted colours to references, avoiding toy saturation and patchwork. Check back/side/roof views, entrance clearance, outward normals and plausible bounds. Use the Biosphère, Habitat 67 and Clock Tower generators as different structural examples, not one universal template.


Verify geographic placement with at least two mapped control points. Record the authoring center, facade bearing and any horizontal fit separately from height. State whether the GLB already includes the geographic rotation so a host cannot apply it twice. A footprint can include steps and building parts beyond the published facade dimensions.

Record exact provider way/part ids for every replaced component, including forecourt structures and annex roofs. Keep an inventory of separately mapped components, such as a palace's entrance pyramid. Host replacement must cover the provider's upper building envelope and attached parts, even where the model has open arches or legs; replacement must remain bounded to the authored portion of a larger complex. A terrain pad can include open ground without turning it into building geometry. Verify unobstructed host shots for provider blocks intersecting the model; a neighbour between camera and model is occlusion, not overlap. Contact sheets cannot establish replacement or host shading.
