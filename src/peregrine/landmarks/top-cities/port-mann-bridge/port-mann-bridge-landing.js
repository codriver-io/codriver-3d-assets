import { PROFILE as p, LANDING } from './port-mann-bridge-profile.js';

// The flat north landing follows the provider's terrain at each lateral position.
// A C1 blend returns to the accepted absolute ramp within the first 240 metres.
export const NORTH_BLEND_END = 240;
export function northRampWeight(s) {
  const t = Math.max(0, Math.min(1, (s - LANDING) / (NORTH_BLEND_END - LANDING)));
  return t * t * (3 - 2 * t);
}
export function northRoadHeight(s, absolute, terrain, approach = 0) {
  const w = northRampWeight(s);
  return s >= NORTH_BLEND_END ? absolute : terrain + approach + w * (Math.max(terrain + approach, absolute) - terrain - approach);
}

/** Called after the shared immutable refit; weights preserve planted support feet. */
export function fitNorthLanding(model, ground, approaches, roadApproach = 0) {
  let known = true;
  model.traverse(mesh => {
    if (!mesh.isMesh) return;
    const g = mesh.geometry, a = g.attributes.position, source = g.userData.champlainSource;
    if (!source) return;
    const weights = g.attributes._bridgelift || g.attributes.bridgeLift;
    let changed = false;
    for (let i = 0; i < a.count; i++) {
      const s = source.stations[i], weight = weights?.getX(i) ?? 1;
      if (s >= NORTH_BLEND_END || !weight) continue;
      const terrain = ground.vertexGroundAt(a.getX(i), a.getZ(i));
      if (terrain === null) { known = false; continue; }
      const absolute = p.deckHeight(s, approaches) + ground.bankYAt(s) / p.STRETCH;
      const target = northRoadHeight(s, absolute, terrain / p.STRETCH, roadApproach);
      a.setY(i, a.getY(i) + (target - absolute) * weight); changed = true;
    }
    if (!changed) return;
    a.needsUpdate = true; g.computeVertexNormals(); g.computeBoundingBox(); g.computeBoundingSphere();
    const normal = g.attributes.normal, colors = g.attributes.color;
    if (colors) {
      for (let i = 0; i < normal.count; i++) {
        const shade = .62 + .38 * Math.max(0, -.35 * normal.getX(i) + .83 * normal.getY(i) + .44 * normal.getZ(i));
        colors.setXYZ(i, shade, shade, shade);
      }
      colors.needsUpdate = true;
    }
  });
  return known;
}
