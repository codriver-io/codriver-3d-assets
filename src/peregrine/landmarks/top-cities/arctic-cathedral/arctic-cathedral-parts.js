import * as THREE from 'three';
export const ROT = 35.5 * Math.PI / 180;
export const xyz = (u, y, s) => [Math.cos(ROT) * u + Math.sin(ROT) * s, y, -Math.sin(ROT) * u + Math.cos(ROT) * s];
export const BAYS = [
  [0.85,5.37,13.9,12.7,35],[5.37,9.57,11.72,11.0,32.5],
  [9.57,14,10.76,10.02,30],[14,18.24,9.79,9.12,27.5],
  [18.24,22.33,8.88,8.24,25],[22.33,26.64,8,7.31,22.5],
  [26.64,30.87,7.03,6.48,20],[30.87,35,6.17,6.17,17.5],
  [35,39.27,6.38,7.02,20],[39.27,43.64,7.34,8.03,22.5],
  [43.64,48.7,8.37,8.94,25],
].map(([s0,s1,w0,w1,h]) => ({s0,s1,w0,w1,h,
  // A single high tip on the exposed end, never a level ridge across the bay.
  // The 1.1 m ridge fall is estimated from the key oblique reference photo.
  // East bays expose their pointed western tips above the saddle too.
  h0:h, h1:h-1.1,
}));

// Closed loft with flat normals at the folds; no texture coordinates.
export function prism(a,c,s0,s1,lean=0) {
  const n=a.length, positions=[],indices=[], ymax=Math.max(...a.map(p=>p[1]));
  for(const [ring,s,tilt] of [[a,s0,lean],[c,s1,0]]) for(const [x,y] of ring) positions.push(x,y,s+tilt*y/ymax);
  const triangles=THREE.ShapeUtils.triangulateShape(a.map(p=>new THREE.Vector2(...p)),[]);
  const signed=a.reduce((sum,p,i)=>{const q=a[(i+1)%n];return sum+p[0]*q[1]-q[0]*p[1];},0);
  for(let i=0;i<n;i++){
    const j=(i+1)%n,face=[i,j,n+j,i,n+j,n+i];
    if(signed<0)for(let k=0;k<face.length;k+=3)[face[k+1],face[k+2]]=[face[k+2],face[k+1]];
    indices.push(...face);
  }
  for(const [i,j,k] of triangles){
    const cross=(a[j][0]-a[i][0])*(a[k][1]-a[i][1])-(a[j][1]-a[i][1])*(a[k][0]-a[i][0]);
    const t=cross>0?[i,j,k]:[i,k,j];indices.push(t[0],t[2],t[1],...t.map(v=>v+n));
  }
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));g.setIndex(indices);
  const flat=g.toNonIndexed();flat.computeVertexNormals();return flat;
}
export function quad(a,b,c,d){
  const g=new THREE.BufferGeometry();
  g.setAttribute('position',new THREE.Float32BufferAttribute([...a,...b,...c,...a,...c,...d,...c,...b,...a,...d,...c,...a],3));
  g.computeVertexNormals();return g;
}
