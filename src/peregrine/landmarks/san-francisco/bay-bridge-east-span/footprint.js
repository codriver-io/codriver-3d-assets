// A road-carrying bridge is fitted to the provider's OWN roads by the road layer (layer.js), not to a
// footprint. One building extrusion stands where the model does: OSM maps the SAS tower as
// building=tower, height=160 (way 237735191). Its ring is listed here and passed to the bridge layer as
// spec.buildingFootprints, which masks the extrusion once the model is visible. OSM_WAYS records the
// mapped ways the alignment, separation, tower, crossbeams, trail and ramps came from.
// Derived data © OpenStreetMap contributors, ODbL 1.0; https://www.openstreetmap.org/copyright
import alignment from './bay-bridge-east-span-alignment.js';

export const FOOTPRINTS = [alignment.tower.ring];
export const OSM_WAYS = [
  ...alignment.road.eastbound.ways, ...alignment.road.westbound.ways, alignment.trail.way, alignment.tower.way,
  ...alignment.crossbeams.map((b) => b.way), ...alignment.links.map((l) => l.way),
].map((id) => `way/${id}`);
