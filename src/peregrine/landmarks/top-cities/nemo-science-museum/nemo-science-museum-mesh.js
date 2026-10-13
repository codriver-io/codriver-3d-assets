import * as THREE from 'three';
// Small original surface accumulator; surfaces have explicit outward winding.
export function meshKit(builder) {
  const batches = new Map();
  const face = (mat, points, out) => {
    if(points.length<3)return;
    const normal=new THREE.Vector3(...out).normalize(), o=new THREE.Vector3(...points[0]);
    const u=new THREE.Vector3(...points[1]).sub(o).normalize(), v=normal.clone().cross(u);
    const project=p=>{const q=new THREE.Vector3(...p).sub(o);return new THREE.Vector2(q.dot(u),q.dot(v));};
    if(!batches.has(mat))batches.set(mat,[]);
    for(const tri of THREE.ShapeUtils.triangulateShape(points.map(project),[])) {
      let [a,b,c]=tri.map(i=>points[i]);
      const n=new THREE.Vector3(...b).sub(new THREE.Vector3(...a)).cross(new THREE.Vector3(...c).sub(new THREE.Vector3(...a)));
      if(n.lengthSq()<1e-10)continue;
      if(n.dot(normal)<0)[b,c]=[c,b];
      batches.get(mat).push(...a,...b,...c);
    }
  };
  return {face, finish(){for(const [mat,ps] of batches){const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(ps,3));g.computeVertexNormals();builder.put(g,mat);}}};
}
export function clip(poly, axis, value, less=true) {
  const out=[],d=p=>(less?1:-1)*(value-p[axis]);
  for(let i=0;i<poly.length;i++) {
    const a=poly[i],b=poly[(i+1)%poly.length],da=d(a),db=d(b);
    if(da>=-1e-8)out.push(a);
    if((da>=0)!==(db>=0)){const t=da/(da-db);out.push(a.map((v,j)=>v+(b[j]-v)*t));}
  }
  return out;
}
export const slab=(poly,axis,lo,hi)=>clip(clip(poly,axis,lo,false),axis,hi);
