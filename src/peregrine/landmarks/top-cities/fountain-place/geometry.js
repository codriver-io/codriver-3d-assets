import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';
import { shellBuilder } from './fountain-place-surfaces.js';

// A double-square diagonal in plan and section: q=u/a+2v/b.
// Upper crown is two crisp planes; two longer wing planes descend to 46 m.
// Opposite lower corners are carved away up to the published 60-foot arcade.
export function create({ detail = 'near' } = {}) {
  const b = assetBuilder({ ...SPEC, palette: PALETTES.light }, detail);
  const s = shellBuilder(b), near = detail === 'near';
  const a = SPEC.halfWidth, d = SPEC.halfDepth, h = SPEC.height;
  const shoulder = SPEC.shoulderM, low = SPEC.lowFacetM, base = SPEC.arcadeM;
  for (const sign of [-1, 1]) {
    const P = (u,y,v) => [sign*u,y,sign*v];
    // Two opposite side faces, each with an asymmetric three-segment roofline.
    s.face([P(a,0,-d),P(a,0,0),P(a,base,d),P(a,low,d),P(a,shoulder,0),P(a,shoulder,-d)], [sign,0,0], near, 'glass', sign+2);
    s.face([P(-a,0,d),P(0,0,d),P(a,base,d),P(a,low,d),P(-a,shoulder,d)], [0,0,sign], near, 'glass', sign+4);
    // Short ridge across the diagonal band; triangular gable end facets.
    // Architect plans narrow the upper floors on u rather than on v.
    const crownN = [sign*(h-shoulder)/a, 1, 0];
    s.face([P(a,shoulder,-d),P(a,shoulder,0),P(0,h,d/2),P(0,h,-d/2)], crownN, near, 'facet', sign+6);
    s.face([P(-a,shoulder,d),P(a,shoulder,0),P(0,h,d/2)], [sign/a,0,sign*2/d], near, 'glass', sign+12);
    const wingN = [sign*(shoulder-low)/(2*a),1,sign*(shoulder-low)/d];
    s.face([P(-a,shoulder,d),P(a,shoulder,0),P(a,low,d)], wingN, near, 'facet', sign+8);
    const underN = [sign*base/(2*a),-1,sign*base/d];
    s.face([P(-a,0,d),P(a,0,0),P(a,base,d)], underN, near, 'facet', sign+10);
  }
  // Grade closure only on the central half-footprint; the lower corner carvings stay open.
  s.emit('glass', [[-a,0,d],[-a,0,0],[a,0,-d],[a,0,0]], [0,-1,0]);
  const panels = s.finish(), model = b.finish();
  model.traverse(o => { if (o.isMesh) { o.geometry.deleteAttribute('bridgeLift'); o.material.roughness = 0.36; o.material.metalness = 0.22; } });
  model.userData.panels = panels;
  return model;
}
