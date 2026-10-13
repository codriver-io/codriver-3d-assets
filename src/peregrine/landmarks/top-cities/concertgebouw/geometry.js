import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';
import { ANGLE, MID, PLAN } from './concertgebouw-plan.js';
import { buildConcertgebouw } from './concertgebouw-parts.js';

export function create({ detail = 'near' } = {}) {
  const b = assetBuilder({ ...SPEC, palette: PALETTES.light }, detail);
  buildConcertgebouw(b, detail === 'near', PLAN, MID);
  const model = b.finish();
  // Bake the geographic rotation into positions/normals, exactly once.
  model.traverse(o => { if (o.isMesh) {
    // Grade-facing bottoms are invisible and shared by overlapping foundation parts.
    const g=o.geometry,p=g.attributes.position,idx=g.index,keep=[];
    for(let i=0;i<idx.count;i+=3) {
      const a=idx.getX(i),c=idx.getX(i+1),d=idx.getX(i+2);
      if(Math.abs(p.getY(a))<.001 && Math.abs(p.getY(c))<.001 && Math.abs(p.getY(d))<.001)continue;
      keep.push(a,c,d);
    }
    g.setIndex(keep);
    o.geometry.rotateY(ANGLE); o.geometry.computeBoundingBox(); o.geometry.computeBoundingSphere(); } });
  model.userData.triangles=model.children.reduce((n,o)=>n+o.geometry.index.count/3,0);
  return model;
}
