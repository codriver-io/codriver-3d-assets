import * as THREE from 'three';
import {assetBuilder} from '../../asset-geometry.js';
import {SPEC,PALETTES} from './config.js';
import {FOOTPRINTS,JET_BRIDGES} from './footprint.js';
import {surfaces} from './parts.js';
const lat=SPEC.origin[1]*Math.PI/180;
const LL=ll=>[(ll[0]-SPEC.origin[0])*111320*Math.cos(lat),-(ll[1]-SPEC.origin[1])*111320];
const a=8*Math.PI/180,P=(u,v,y)=>[u*Math.cos(a)-v*Math.sin(a),y,u*Math.sin(a)+v*Math.cos(a)];
export function create({detail='near'}={}){
 const near=detail==='near',b=assetBuilder({...SPEC,palette:PALETTES.light},detail),S=surfaces(b);
 const xyz=(p,y)=>[p[0],y,p[1]];
 const area=ring=>ring.reduce((s,p,i)=>{let q=ring[(i+1)%ring.length];return s+p[0]*q[1]-q[0]*p[1];},0)/2;
 const clean=ring=>ring.slice(0,-1).map(LL);
 function roof(ring,y,mat='roof',up=1){const vs=ring.map(p=>new THREE.Vector2(...p));for(const [i,j,k] of THREE.ShapeUtils.triangulateShape(vs,[]))S.quad(mat,xyz(ring[i],y),xyz(ring[j],y),xyz(ring[k],y),xyz(ring[k],y),[0,up,0]);}
 function face(m,p,q,y0,y1,out){if(y1-y0<.001)return;S.quad(m,xyz(p,y0),xyz(q,y0),xyz(q,y1),xyz(p,y1),out);}
 function pane(p,q,y0,y1,n){
  if(!near){face('glass',p,q,y0,y1,n);return;}
  const inset=.24,pi=[p[0]-n[0]*inset,p[1]-n[2]*inset],qi=[q[0]-n[0]*inset,q[1]-n[2]*inset];
  face('glass',pi,qi,y0,y1,n);
  const tang=[q[0]-p[0],0,q[1]-p[1]],l=Math.hypot(...tang);for(let i=0;i<3;i++)tang[i]/=l;
  S.quad('trim',xyz(p,y0),xyz(pi,y0),xyz(pi,y1),xyz(p,y1),tang);
  S.quad('trim',xyz(qi,y0),xyz(q,y0),xyz(q,y1),xyz(qi,y1),tang.map(x=>-x));
  S.quad('trim',xyz(p,y0),xyz(q,y0),xyz(qi,y0),xyz(pi,y0),[0,1,0]);
  S.quad('trim',xyz(p,y1),xyz(pi,y1),xyz(qi,y1),xyz(q,y1),[0,-1,0]);
 }
 const main=clean(FOOTPRINTS[0]),sg=Math.sign(area(main));
 // Main current envelope, directly from OSM. Individual glazing replaces facade tiles.
 for(let i=0;i<main.length;i++){
  const p=main[i],q=main[(i+1)%main.length],dx=q[0]-p[0],dz=q[1]-p[1],len=Math.hypot(dx,dz),n=[sg*dz/len,0,-sg*dx/len];
  const cells=Math.max(1,Math.round(len/(near?3.8:7.6)));
  for(let k=0;k<cells;k++){
   const t0=k/cells,t1=(k+1)/cells,mix=t=>[p[0]+dx*t,p[1]+dz*t],l=mix(t0),r=mix(t1),margin=Math.min(.20,.35/Math.max(1,len/cells)),pl=mix(t0+margin/cells),pr=mix(t1-margin/cells);
   if(len<2.8){face('wall',l,r,0,9.2,n);continue;}
   face('base',l,r,0,3.6,n);face('wall',l,r,3.6,4.1,n);face('wall',l,r,8.25,9.2,n);
   face('trim',l,pl,4.1,8.25,n);face('trim',pr,r,4.1,8.25,n);
   face('trim',pl,pr,6.0,6.35,n);
   pane(pl,pr,4.1,6.0,n);pane(pl,pr,6.35,8.25,n);
  }
 }
 roof(main,9.2);
 // Raised central hall: 25 feet above passenger floor. Its glass dome is a spherical cap.
 const hall=[P(-11,-27,0),P(11,-27,0),P(11,27,0),P(-11,27,0)].map(p=>[p[0],p[2]]);
 for(let i=0;i<4;i++){
  const p=hall[i],q=hall[(i+1)%4],dx=q[0]-p[0],dz=q[1]-p[1],L=Math.hypot(dx,dz),n=[dz/L,0,-dx/L],count=Math.round(L/(near?3.5:7));
  for(let k=0;k<count;k++){const mix=t=>[p[0]+dx*t,p[1]+dz*t],l=mix(k/count),r=mix((k+1)/count),pl=mix((k+.10)/count),pr=mix((k+.90)/count);face('trim',l,pl,9.2,11.22,n);face('trim',pr,r,9.2,11.22,n);face('trim',pl,pr,9.2,9.6,n);pane(pl,pr,9.6,11.22,n);}
 }
 roof(hall,11.22,'trim');
 const radius=7.2,rise=5.5,R=(radius*radius+rise*rise)/(2*rise),cy=11.22+rise-R,maxTheta=Math.asin(radius/R),segs=near?48:24,rows=near?12:6;
 const D=(theta,phi)=>[R*Math.sin(theta)*Math.cos(phi),cy+R*Math.cos(theta),R*Math.sin(theta)*Math.sin(phi)];
 const phis=near?[...new Set([...Array.from({length:segs+1},(_,k)=>k*Math.PI*2/segs),...Array.from({length:12},(_,k)=>[k*Math.PI/6+.003,(k*Math.PI/6-.003+Math.PI*2)%(Math.PI*2)]).flat()])].sort((a,b)=>a-b):Array.from({length:segs+1},(_,k)=>k*Math.PI*2/segs);
 for(let row=0;row<rows;row++)for(let k=0;k<phis.length-1;k++){
  const t0=maxTheta*row/rows,t1=maxTheta*(row+1)/rows,p0=phis[k],p1=phis[k+1],mid=(p0+p1)/2,dist=Math.abs(Math.sin(mid*6));
  S.quad(near&&dist<.02?'steel':'glass',D(t0,p0),D(t1,p0),D(t1,p1),D(t0,p1),[0,1,0]);
 }
 // Dome meridians and latitude rings sit on the glass, with no separate opaque cap.
 // Narrow rib strips replace dome facets; no stacked material overlay.
 // Linear concourse roof monitors retain the distinctive two-arm layout and clerestory cadence.
 function monitor(ll0,ll1,width){
  const p=LL(ll0),q=LL(ll1),dx=q[0]-p[0],dz=q[1]-p[1],L=Math.hypot(dx,dz),nx=dz/L,nz=-dx/L;
  const V=(t,o,y)=>[p[0]+dx*t+nx*o,y,p[1]+dz*t+nz*o];
  for(const side of [-1,1]){const out=[nx*side,0,nz*side],count=Math.round(L/(near?4:8));
   for(let i=0;i<count;i++){const t0=i/count,t1=(i+1)/count,ta=(i+.12)/count,tb=(i+.88)/count;
    S.quad('trim',V(t0,side*width/2,9.2),V(ta,side*width/2,9.2),V(ta,side*width/2,10.7),V(t0,side*width/2,10.7),out);
    S.quad('glass',V(ta,side*width/2,9.2),V(tb,side*width/2,9.2),V(tb,side*width/2,10.7),V(ta,side*width/2,10.7),out);
    S.quad('trim',V(tb,side*width/2,9.2),V(t1,side*width/2,9.2),V(t1,side*width/2,10.7),V(tb,side*width/2,10.7),out);
   }
   S.quad('roof',V(0,side*width/2,10.7),V(1,side*width/2,10.7),V(1,0,11.5),V(0,0,11.5),[0,1,0]);
  }
  for(const [t,dir] of [[0,-1],[1,1]]){const out=[dx/L*dir,0,dz/L*dir];S.quad('trim',V(t,-width/2,9.2),V(t,width/2,9.2),V(t,width/2,10.7),V(t,-width/2,10.7),out);S.quad('trim',V(t,-width/2,10.7),V(t,width/2,10.7),V(t,0,11.5),V(t,0,11.5),out);}
 }
 monitor([-80.03755,32.88489],[-80.03797,32.88613],9);
 monitor([-80.03635,32.88480],[-80.03582,32.88530],7.5);
 // Mapped covered pedestrian roofs, each carried by columns to the foundation plane.
 for(const raw of FOOTPRINTS.slice(1)){
  const ring=clean(raw),sign=Math.sign(area(ring));roof(ring,7.3,'trim');roof(ring,7.0,'trim',-1);
  for(let i=0;i<ring.length;i++){
   const p=ring[i],q=ring[(i+1)%ring.length],dx=q[0]-p[0],dz=q[1]-p[1],L=Math.hypot(dx,dz);if(L<.01)continue;
   face('trim',p,q,7,7.3,[sign*dz/L,0,-sign*dx/L]);
   if(L>4){const count=Math.ceil(L/13);for(let k=0;k<=count;k++){const x=p[0]+dx*k/count,z=p[1]+dz*k/count;b.bar('steel',[x,0,z],[x,7,z],.28,.28);}}
  }
 }
 // Central covered route has the photographed open triangular end trusses.
 {
  const p=LL([-80.0370246,32.8839779]),q=LL([-80.03708,32.88364]),dx=q[0]-p[0],dz=q[1]-p[1],L=Math.hypot(dx,dz),nx=dz/L,nz=-dx/L,w=6.2;
  const V=(t,o,y)=>[p[0]+dx*t+nx*o,y,p[1]+dz*t+nz*o];
  for(const side of [-1,1]){S.quad('roof',V(0,side*w,7.3),V(1,side*w,7.3),V(1,0,9.6),V(0,0,9.6),[0,1,0]);S.quad('roof',V(0,side*w,7.25),V(0,0,9.55),V(1,0,9.55),V(1,side*w,7.25),[0,-1,0]);}
  for(const t of [0,.5,1]){
   b.bar('steel',V(t,-w,7.3),V(t,0,9.6),.16,.16);b.bar('steel',V(t,0,9.6),V(t,w,7.3),.16,.16);b.bar('steel',V(t,-w,7.3),V(t,w,7.3),.16,.16);b.bar('steel',V(t,0,7.3),V(t,0,9.6),.12,.12);
  }
 }
 // Curbside white overhang follows the southern mapped wall, all posts meet the canopy.
 for(let i=3;i<27;i++){
  const p=main[i],q=main[(i+1)%main.length],dx=q[0]-p[0],dz=q[1]-p[1],L=Math.hypot(dx,dz);if(L<3)continue;
  const n=[sg*dz/L,-sg*dx/L];if(n[1]<.45)continue;
  const po=[p[0]+n[0]*7,p[1]+n[1]*7],qo=[q[0]+n[0]*7,q[1]+n[1]*7];
  S.quad('trim',xyz(p,7.5),xyz(q,7.5),xyz(qo,7.5),xyz(po,7.5),[0,1,0]);
  S.quad('trim',xyz(po,7.2),xyz(qo,7.2),xyz(q,7.2),xyz(p,7.2),[0,-1,0]);face('trim',po,qo,7.2,7.5,[n[0],0,n[1]]);
  for(let k=0;k<=Math.ceil(L/10);k++){let t=k/Math.ceil(L/10);b.bar('steel',[po[0]+(qo[0]-po[0])*t,0,po[1]+(qo[1]-po[1])*t],[po[0]+(qo[0]-po[0])*t,7.2,po[1]+(qo[1]-po[1])*t],.3,.3);}
 }
 // Seventeen mapped enclosed boarding corridors; end cabins have paired apron supports.
 for(const bridge of JET_BRIDGES){
  const path=bridge.path.map(LL);
  for(let i=0;i<path.length-1;i++){
   const p=path[i],q=path[i+1],dx=q[0]-p[0],dz=q[1]-p[1],L=Math.hypot(dx,dz),nx=dz/L,nz=-dx/L,w=1.6;
   const V=(t,o,y)=>[p[0]+dx*t+nx*o,y,p[1]+dz*t+nz*o];
   for(const side of [-1,1]){const n=[nx*side,0,nz*side];S.quad('wall',V(0,side*w,3.6),V(1,side*w,3.6),V(1,side*w,4.15),V(0,side*w,4.15),n);const count=Math.max(1,Math.ceil(L/(near?4:8)));
    for(let k=0;k<count;k++){const t0=k/count,t1=(k+1)/count,tm=(k+.93)/count;S.quad('glass',V(t0,side*w,4.15),V(tm,side*w,4.15),V(tm,side*w,5.85),V(t0,side*w,5.85),n);S.quad('wall',V(tm,side*w,4.15),V(t1,side*w,4.15),V(t1,side*w,5.85),V(tm,side*w,5.85),n);}S.quad('wall',V(0,side*w,5.85),V(1,side*w,5.85),V(1,side*w,6.7),V(0,side*w,6.7),n);}
   S.quad('roof',V(0,-w,6.7),V(1,-w,6.7),V(1,w,6.7),V(0,w,6.7),[0,1,0]);
   S.quad('wall',V(0,-w,3.6),V(1,-w,3.6),V(1,w,3.6),V(0,w,3.6),[0,-1,0]);
   for(const [t,sign] of [[0,-1],[1,1]])S.quad('wall',V(t,-w,3.6),V(t,w,3.6),V(t,w,6.7),V(t,-w,6.7),[dx/L*sign,0,dz/L*sign]);
   if(i===0){for(const side of [-.85,.85])b.bar('steel',V(0,side,0),V(0,side,3.6),.25,.25);}
   if(i<path.length-2)b.bar('steel',V(1,0,0),V(1,0,3.6),.3,.3);
  }
 }
 S.flush();return b.finish();
}
