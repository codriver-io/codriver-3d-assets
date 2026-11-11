import * as THREE from 'three';
import {assetBuilder} from '../../asset-geometry.js';
// Flat mutually adjacent facade tiles: glass replaces wall rather than overlaying it.
export function tools(spec,palettes,detail){
 const near=detail==='near',b=assetBuilder({...spec,palette:palettes.light},detail),acc={};
 function face(mat,pts,out){
  const clean=pts.filter((p,i)=>p.some((v,k)=>Math.abs(v-pts[(i+pts.length-1)%pts.length][k])>1e-7));if(clean.length<3)return;
  let normal;for(let j=1;j<clean.length-1;j++){normal=new THREE.Vector3(...clean[j]).sub(new THREE.Vector3(...clean[0])).cross(new THREE.Vector3(...clean[j+1]).sub(new THREE.Vector3(...clean[0])));if(normal.lengthSq()>1e-10)break;}if(normal.lengthSq()<1e-10)return;
  const f=acc[mat]??={p:[],i:[]},k=f.p.length/3,rev=normal.dot(new THREE.Vector3(...out))<0;f.p.push(...clean.flat());for(let i=1;i<clean.length-1;i++)f.i.push(...(rev?[k,k+i+1,k+i]:[k,k+i,k+i+1]));
 }
 function cap(mat,r,y,up=1){for(const t of THREE.ShapeUtils.triangulateShape(r.map(p=>new THREE.Vector2(...p)),[]))face(mat,t.map(i=>[r[i][0],y,r[i][1]]),[0,up,0]);}
 function solid(r,y0,y1,mat,roof=mat,win=null){
  const area=r.reduce((s,a,i)=>{const c=r[(i+1)%r.length];return s+a[0]*c[1]-c[0]*a[1]},0),sign=Math.sign(area);
  r.forEach((a,i)=>{const c=r[(i+1)%r.length],len=Math.hypot(c[0]-a[0],c[1]-a[1]);if(len<1e-5||win?.skipEdges?.includes(i))return;const ux=(c[0]-a[0])/len,uz=(c[1]-a[1])/len,out=[sign*uz,0,-sign*ux],p=(s,y)=>[a[0]+s*ux,y,a[1]+s*uz];const patch=(m,s,t,lo,hi)=>{if(t-s>1e-5&&hi-lo>1e-5)face(m,[p(s,lo),p(t,lo),p(t,hi),p(s,hi)],out);};
   if(!win||win.solidOnly||len<(win?.minWallLen??3)){patch(mat,0,len,y0,y1);return;}
   const bottom=win.bottom??1,top=win.top??y1-1,dy=win.dy??3.5,rows=Math.max(1,Math.floor((top-bottom)/dy)),count=Math.max(1,Math.floor(len/(win.pitch??(near?3.8:7)))),pitch=len/count;
   let cursor=y0;for(let row=0;row<rows;row++){const lo=bottom+row*dy,hi=Math.min(top,lo+(win.h??dy*.56));patch(mat,0,len,cursor,lo);for(let j=0;j<count;j++){const s=j*pitch,t=(j+1)*pitch,m=(s+t)/2,w=pitch*(win.ratio??.53);patch(mat,s,m-w/2,lo,hi);if(win.shape==='pointed'){const a=m-w/2,c=m+w/2,sp=lo+(hi-lo)*.65;patch(win.mat??'glass',a,c,lo,sp);face(win.mat??'glass',[p(a,sp),p(c,sp),p(m,hi)],out);face(mat,[p(a,sp),p(m,hi),p(a,hi)],out);face(mat,[p(m,hi),p(c,sp),p(c,hi)],out);}else patch(win.mat??'glass',m-w/2,m+w/2,lo,hi);patch(mat,m+w/2,t,lo,hi);}cursor=hi;}patch(mat,0,len,cursor,y1);
  });cap(roof,r,y1);cap(mat,r,y0,-1);
 }
 function loft(profile,mat,n=near?24:12,closed=true){
  const rings=profile.map(p=>Array.from({length:n},(_,i)=>{const a=2*Math.PI*i/n+(p.angle??0);return [(p.x??0)+Math.cos(a)*(p.rx??p.r),(p.z??0)+Math.sin(a)*(p.rz??p.r)]}));
  for(let j=0;j<rings.length-1;j++)for(let i=0;i<n;i++){const k=(i+1)%n,a=rings[j][i],c=rings[j][k],d=rings[j+1][k],e=rings[j+1][i];face(profile[j].mat??mat,[[a[0],profile[j].y,a[1]],[c[0],profile[j].y,c[1]],[d[0],profile[j+1].y,d[1]],[e[0],profile[j+1].y,e[1]]],[Math.cos((i+.5)*2*Math.PI/n),0,Math.sin((i+.5)*2*Math.PI/n)]);}
  if(closed){cap(mat,rings[0],profile[0].y,-1);cap(mat,rings.at(-1),profile.at(-1).y);}
 }
 const rect=(x,z,w,d,ang=0)=>[[-w/2,-d/2],[w/2,-d/2],[w/2,d/2],[-w/2,d/2]].map(([a,c])=>[x+a*Math.cos(ang)-c*Math.sin(ang),z+a*Math.sin(ang)+c*Math.cos(ang)]);
 function gable(r,eave,peak,mat){const a=r[0],c=r[1],d=r[2],e=r[3],u=[(a[0]+c[0])/2,(a[1]+c[1])/2],v=[(d[0]+e[0])/2,(d[1]+e[1])/2];face(mat,[[...a.slice(0,1),eave,a[1]],[u[0],peak,u[1]],[v[0],peak,v[1]],[e[0],eave,e[1]]],[0,1,0]);face(mat,[[c[0],eave,c[1]],[d[0],eave,d[1]],[v[0],peak,v[1]],[u[0],peak,u[1]]],[0,1,0]);const vec=[u[0]-v[0],0,u[1]-v[1]];face(mat,[[a[0],eave,a[1]],[c[0],eave,c[1]],[u[0],peak,u[1]]],vec);face(mat,[[d[0],eave,d[1]],[e[0],eave,e[1]],[v[0],peak,v[1]]],vec.map(v=>-v));}
 function finish(angle=0,offset=[0,0]){for(const[mat,f]of Object.entries(acc)){if(!f.p.every(Number.isFinite))throw Error('Non-finite '+mat+' authoring coordinates');const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(f.p,3));g.setIndex(f.i);g.computeVertexNormals();b.put(g,mat);}const root=b.finish();root.traverse(o=>{if(o.isMesh){o.geometry.deleteAttribute('bridgeLift');if(angle)o.geometry.rotateY(angle);o.geometry.translate(offset[0],0,offset[1]);o.geometry.computeBoundingBox();}});return root;}
 return {near,face,cap,solid,loft,rect,gable,box:b.box,bar:b.bar,finish};
}
