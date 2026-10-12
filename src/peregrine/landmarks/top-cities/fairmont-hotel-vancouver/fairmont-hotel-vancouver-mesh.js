import * as THREE from 'three';
// Original indexed surfaces; every face carries an outward normal hint.
export function surfaces(builder) {
  const batches=new Map();
  function face(mat, points, hint) {
    const a=new THREE.Vector3(...points[0]), b=new THREE.Vector3(...points[1]), c=new THREE.Vector3(...points[2]);
    const n=b.clone().sub(a).cross(c.clone().sub(a));
    if(n.length()<1e-8)return;
    if(n.dot(new THREE.Vector3(...hint))<0){points=[...points].reverse();n.negate();}
    n.normalize();let data=batches.get(mat);
    if(!data)batches.set(mat,data={p:[],n:[],i:[]});
    const start=data.p.length/3;
    for(const p of points){data.p.push(...p);data.n.push(...n.toArray());}
    for(let i=1;i<points.length-1;i++)data.i.push(start,start+i,start+i+1);
  }
  function cap(mat, polygon, y) {
    const rings=polygon.map(r=>r.slice(0,-1)), pts=rings.flat();
    const tris=THREE.ShapeUtils.triangulateShape(rings[0].map(p=>new THREE.Vector2(...p)),rings.slice(1).map(r=>r.map(p=>new THREE.Vector2(...p))));
    for(const t of tris)face(mat,t.map(i=>[pts[i][0],y,pts[i][1]]),[0,1,0]);
  }
  function flush(){for(const [mat,d]of batches){const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(d.p,3));g.setAttribute('normal',new THREE.Float32BufferAttribute(d.n,3));g.setIndex(d.i);builder.put(g,mat);}}
  return {face,cap,flush};
}
