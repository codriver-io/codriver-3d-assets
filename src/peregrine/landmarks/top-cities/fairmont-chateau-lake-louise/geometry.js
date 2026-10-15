import * as THREE from 'three';
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';
import { RING, WINGS, roofFrame } from './fairmont-chateau-lake-louise-site.js';
import { surfaces } from './fairmont-chateau-lake-louise-mesh.js';
export function create({detail='near'}={}) {
 const near=detail==='near',b=assetBuilder({...SPEC,palette:PALETTES.light},detail),s=surfaces(b);
 // Entire mapped outline is the stone podium, curved retail arcade and parkade.
 walls(RING,0,6.5,'base',true);s.cap('roof',RING,6.5);
 for(const wing of WINGS){
  walls(wing.ring,6.5,wing.eave,'stone',true);s.cap('stone',wing.ring,wing.eave);
  const f=roofFrame(wing),{at,L,v}=f,w=wing.width/2,hip=Math.min(w,L/3),mat=wing.copper?'copper':'roof';
  const corners=wing.corners?wing.corners.map(p=>[p[0],wing.eave,p[1]]):[at(0,wing.eave,-w),at(L,wing.eave,-w),at(L,wing.eave,w),at(0,wing.eave,w)],r0=at(hip,wing.top,0),r1=at(L-hip,wing.top,0);
  for(const p of [[corners[0],corners[1],r1,r0],[corners[2],corners[3],r0,r1],[corners[3],corners[0],r0],[corners[1],corners[2],r1]])s.face(mat,p,[0,1,0]);
  if(wing.eave>20){
   const count=Math.floor((L-hip*2)/3.5);
   for(const side of [-1,1])for(let i=0;i<count;i++){
    const t=hip+(i+.5)*(L-hip*2)/count;
    dormer(at,t,wing.eave,side,w,mat,v);
   }
  }
 }
 // Projecting octagonal lakefront bays: grounded, tall, with steep copper caps.
 for(const [x,z,r,h]of [[-59,-31.3,4,31.8],[-8,23,4.7,32],[4,71,6,33]]){
  const ring=Array.from({length:8},(_,i)=>[x+r*Math.cos(Math.PI/8+i*Math.PI/4),z+r*Math.sin(Math.PI/8+i*Math.PI/4)]);
  walls(ring,0,h,'stone',true);
  for(let i=0;i<8;i++)s.face('copper',[[...ring[i].slice(0,1),h,ring[i][1]],[ring[(i+1)%8][0],h,ring[(i+1)%8][1]],[x,h+6,z]],[0,1,0]);
 }
 // Two small embedded entrance gables at the inward curve, no floating canopy.
 for(const [x,z]of [[20,-2],[108,-22]]){
  const ring=[[x-3,z-2],[x+3,z-2],[x+3,z+2],[x-3,z+2]];
  walls(ring,0,9,'stone',true);for(let i=0;i<4;i++)s.face('copper',[[ring[i][0],9,ring[i][1]],[ring[(i+1)%4][0],9,ring[(i+1)%4][1]],[x,13,z]],[0,1,0]);
 }
 s.flush();const root=b.finish();root.traverse(o=>{if(o.isMesh){const g=o.geometry;g.deleteAttribute('bridgeLift');o.geometry=mergeVertices(g,1e-4);g.dispose();}});return root;
 function walls(ring,y0,y1,mat,windows){
  let area=0;for(let i=0;i<ring.length;i++){const p=ring[i],q=ring[(i+1)%ring.length];area+=p[0]*q[1]-q[0]*p[1];}
  for(let k=0;k<ring.length;k++){
   const p=ring[k],q=ring[(k+1)%ring.length],L=Math.hypot(q[0]-p[0],q[1]-p[1]);if(L<.01)continue;
   const t=[(q[0]-p[0])/L,(q[1]-p[1])/L],n=area>0?[t[1],-t[0]]:[-t[1],t[0]],at=(u,y,d=0)=>[p[0]+t[0]*u+n[0]*d,y,p[1]+t[1]*u+n[1]*d];
   const quad=(m,a,c,lo,hi,d=0)=>{if(c-a>.001&&hi-lo>.001)s.face(m,[at(a,lo,d),at(c,lo,d),at(c,hi,d),at(a,hi,d)],[n[0],0,n[1]]);};
   const count=Math.floor(L/(near?3.0:4.8)),rows=[];
   if(windows&&count>0){if(y0===0)rows.push([1.4,4.9]);else for(let y=8.4;y+1.8<y1;y+=3.25)rows.push([y,y+1.85]);}
   let previous=y0;
   for(let row=0;row<rows.length;row++){
    const [lo,hi]=rows[row];quad(mat,0,L,previous,lo);let last=0;
    for(let c=0;c<count;c++){
     const mid=(c+.5)*L/count,w=Math.min(near?1.25:1.8,L/count*.52),a=mid-w/2,e=mid+w/2,depth=near?.22:.55;
     quad(mat,last,a,lo,hi);
     const paneMat=(c+row+k)%7===0?'glow':'glass';
     if(y0===0){
      const r=(e-a)/2,cy=hi-r,steps=near?6:4,shape=[[a,lo],[e,lo],[e,cy]];
      for(let j=1;j<=steps;j++)shape.push([mid+r*Math.cos(j*Math.PI/steps),cy+r*Math.sin(j*Math.PI/steps)]);
      s.face(paneMat,shape.map(p=>at(...p,-depth)),[n[0],0,n[1]]);
      for(let j=2;j<shape.length-1;j++)s.face(mat,[at(...shape[j]),at(...shape[j+1]),at(shape[j+1][0],hi),at(shape[j][0],hi)],[n[0],0,n[1]]);
     }else quad(paneMat,a,e,lo,hi,-depth);
     if(near){for(const [u,hint]of [[a,t],[e,t.map(v=>-v)]])s.face(mat,[at(u,lo),at(u,hi),at(u,hi,-depth),at(u,lo,-depth)],[hint[0],0,hint[1]]);s.face(mat,[at(a,lo),at(e,lo),at(e,lo,-depth),at(a,lo,-depth)],[0,1,0]);s.face(mat,[at(a,hi),at(e,hi),at(e,hi,-depth),at(a,hi,-depth)],[0,-1,0]);}
     last=e;
    }quad(mat,last,L,lo,hi);previous=hi;
   }quad(mat,0,L,previous,y1);
  }
 }
 function dormer(at,t,eave,side,w,mat,v){
  const half=near?.85:1.0,front=side*(w-.75),back=side*(w-3.3),y=eave+.55,top=eave+3.9;
  const a=at(t-half,y,front),c=at(t+half,y,front),tip=at(t,top,front),n=[side*v[0],0,side*v[1]];
  // Roof-colored cheeks merge with parent roof; a cut front has no wall behind the pane.
  const paneBottom=y+.2,paneTop=y+1.95,paneHalf=half*.58;
  const quad=(u0,u1,lo,hi,m,d=front)=>s.face(m,[at(u0,lo,d),at(u1,lo,d),at(u1,hi,d),at(u0,hi,d)],n);
  quad(t-half,t+half,y,paneBottom,mat);quad(t-half,t-paneHalf,paneBottom,paneTop,mat);quad(t+paneHalf,t+half,paneBottom,paneTop,mat);quad(t-paneHalf,t+paneHalf,paneBottom,paneTop,'glass',front-side*.22);
  s.face(mat,[at(t-half,paneTop,front),at(t+half,paneTop,front),tip],n);
  for(const d of [-1,1])s.face(mat,[at(t+d*half,y,front),tip,at(t,top,back),at(t+d*half,y,back)],[0,1,0]);
  s.face(mat,[at(t-half,y,back),at(t+half,y,back),at(t,top,back)],n.map(v=>-v));
  s.face(mat,[a,c,at(t+half,y,back),at(t-half,y,back)],[0,-1,0]);
  const inset=front-side*.22;
  for(const u of [t-paneHalf,t+paneHalf])s.face(mat,[at(u,paneBottom,front),at(u,paneTop,front),at(u,paneTop,inset),at(u,paneBottom,inset)],[u<t?facing(v):facing(v).map(v=>-v)] .flat());
  function facing(v){return [v[1],0,-v[0]];}
  s.face(mat,[at(t-paneHalf,paneBottom,front),at(t+paneHalf,paneBottom,front),at(t+paneHalf,paneBottom,inset),at(t-paneHalf,paneBottom,inset)],[0,1,0]);
  s.face(mat,[at(t-paneHalf,paneTop,front),at(t+paneHalf,paneTop,front),at(t+paneHalf,paneTop,inset),at(t-paneHalf,paneTop,inset)],[0,-1,0]);
 }
}
