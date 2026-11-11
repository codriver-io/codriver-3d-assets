// Geometry helpers copied into the owning landmark folder; no runtime shared module.
// Polygon faces share edges rather than stacking facade overlays.
export function kit(b,THREE){
 const acc={};
 function face(mat,pts,out){
  pts=pts.filter((p,i)=>p.some((v,j)=>Math.abs(v-pts[(i+pts.length-1)%pts.length][j])>1e-7));
  if(pts.length<3)return;
  const n=new THREE.Vector3(...pts[1]).sub(new THREE.Vector3(...pts[0])).cross(new THREE.Vector3(...pts[2]).sub(new THREE.Vector3(...pts[0])));
  if(n.lengthSq()<1e-12)return;
  const f=acc[mat]??={p:[],i:[]},k=f.p.length/3,rev=n.dot(new THREE.Vector3(...out))<0;
  f.p.push(...pts.flat());for(let j=1;j<pts.length-1;j++)f.i.push(...(rev?[k,k+j+1,k+j]:[k,k+j,k+j+1]));
 }
 function panel(mat,a,c,y0,y1,out){face(mat,[[a[0],y0,a[1]],[c[0],y0,c[1]],[c[0],y1,c[1]],[a[0],y1,a[1]]],out);}
 function cap(mat,ring,y,up=true){for(const t of THREE.ShapeUtils.triangulateShape(ring.map(p=>new THREE.Vector2(...p)),[]))face(mat,t.map(i=>[ring[i][0],y,ring[i][1]]),[0,up?1:-1,0]);}
 const area=r=>r.reduce((s,p,i)=>s+p[0]*r[(i+1)%r.length][1]-r[(i+1)%r.length][0]*p[1],0);
 function prism(mat,ring,lo,hi,roof=mat){const sign=Math.sign(area(ring));ring.forEach((a,i)=>{const c=ring[(i+1)%ring.length];panel(mat,a,c,lo,hi,[sign*(c[1]-a[1]),0,sign*(a[0]-c[0])]);});cap(roof,ring,hi);cap(mat,ring,lo,false);}
 // A closed radial shell from [height,radius] stations, with optional segmented glazing.
 function radial(stations,n,mat,cx=0,cz=0){for(let k=0;k<stations.length-1;k++){const [y,r]=stations[k],[v,s]=stations[k+1];for(let j=0;j<n;j++){const t=j*2*Math.PI/n,u=(j+1)*2*Math.PI/n;face(typeof mat==='function'?mat(k,j):mat,[[cx+r*Math.cos(t),y,cz+r*Math.sin(t)],[cx+r*Math.cos(u),y,cz+r*Math.sin(u)],[cx+s*Math.cos(u),v,cz+s*Math.sin(u)],[cx+s*Math.cos(t),v,cz+s*Math.sin(t)]],[Math.cos((t+u)/2),(r-s)/(v-y||1),Math.sin((t+u)/2)]);}}
 const [y0,r0]=stations[0],[y1,r1]=stations.at(-1);if(r0)cap(typeof mat==='function'?mat(0,0):mat,Array.from({length:n},(_,i)=>[cx+r0*Math.cos(i*2*Math.PI/n),cz+r0*Math.sin(i*2*Math.PI/n)]),y0,false);if(r1)cap(typeof mat==='function'?mat(stations.length-2,0):mat,Array.from({length:n},(_,i)=>[cx+r1*Math.cos(i*2*Math.PI/n),cz+r1*Math.sin(i*2*Math.PI/n)]),y1);
 }
 function flush(){for(const[mat,f]of Object.entries(acc)){const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(f.p,3));g.setIndex(f.i);g.computeVertexNormals();b.put(g,mat);}}
 return{face,panel,cap,prism,radial,flush,area};
}
