import * as THREE from 'three';
export function surfaces(builder, map=(m)=>m) {
 const buckets=new Map();
 function tri(m,a,b,c){const u=new THREE.Vector3(...b).sub(new THREE.Vector3(...a)),v=new THREE.Vector3(...c).sub(new THREE.Vector3(...a));if(u.cross(v).lengthSq()<1e-12)return;m=map(m);if(!buckets.has(m))buckets.set(m,[]);buckets.get(m).push(...a,...b,...c);}
 function quad(m,a,b,c,d,out){const u=new THREE.Vector3(...b).sub(new THREE.Vector3(...a)),v=new THREE.Vector3(...c).sub(new THREE.Vector3(...a));let n=u.cross(v);if(n.lengthSq()<1e-12)n=new THREE.Vector3(...c).sub(new THREE.Vector3(...a)).cross(new THREE.Vector3(...d).sub(new THREE.Vector3(...a)));if(out&&n.dot(new THREE.Vector3(...out))<0){tri(m,a,d,c);tri(m,a,c,b);}else{tri(m,a,b,c);tri(m,a,c,d);}}
 function flush(){for(const [m,pos] of buckets){const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.computeVertexNormals();builder.put(g,m);}}
 return {quad,tri,flush};
}
