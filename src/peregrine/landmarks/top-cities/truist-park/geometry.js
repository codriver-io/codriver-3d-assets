import * as THREE from 'three';
import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';
import { OUTER, PITCH, CHOP } from './footprint.js';
const DEG = Math.PI / 180, R = 6378137;
export function local([lng,lat]) {
 return [(lng-SPEC.origin[0])*DEG*R*Math.cos(SPEC.origin[1]*DEG), (SPEC.origin[1]-lat)*DEG*R];
}
export const OUTLINE = OUTER.map(local), FIELD = PITCH.map(local);
export const HOME = [-11,-45];
// OSM home-backstop and centre-field control points establish the SSE axis.
export function fieldPoint(u,v,y=0) { return [HOME[0]+u*0.9063078+v*0.4226183,y,HOME[1]-u*0.4226183+v*0.9063078]; }
function radius(ring,a) {
 const d=[Math.cos(a),Math.sin(a)]; let best=Infinity;
 for(let i=0;i<ring.length;i++) {const p=ring[i],q=ring[(i+1)%ring.length],e=[q[0]-p[0],q[1]-p[1]],cross=d[0]*e[1]-d[1]*e[0];
 if(Math.abs(cross)<1e-8)continue;
 const r=(p[0]*e[1]-p[1]*e[0])/cross,t=(p[0]*d[1]-p[1]*d[0])/cross;
 if(r>0&&t>=0&&t<=1)best=Math.min(best,r);
 } return best;
}
export function at(a,t,y=0) {const ri=radius(FIELD,a),ro=radius(OUTLINE,a),r=ri+(ro-ri)*t;return [r*Math.cos(a),y,r*Math.sin(a)];}
const gateAngles=[-2.7,-1.65,-.65];
const gateOpening=a=>gateAngles.some(g=>Math.abs(Math.atan2(Math.sin(a-g),Math.cos(a-g)))<.055);
function inOutline(p){let yes=false;for(let i=0,j=OUTLINE.length-1;i<OUTLINE.length;j=i++){const a=OUTLINE[j],b=OUTLINE[i];if((a[1]>p[2])!==(b[1]>p[2])&&p[0]<(b[0]-a[0])*(p[2]-a[1])/(b[1]-a[1])+a[0])yes=!yes;}return yes;}
export const covered = a => Math.sin(a)<0.14;
export function create({detail='near'}={}) {
 const near=detail==='near', b=assetBuilder({...SPEC,palette:PALETTES.light},detail);
 const contacts=[];
 function face(mat,p,normal) {
  const n=new THREE.Vector3().crossVectors(new THREE.Vector3().subVectors(new THREE.Vector3(...p[1]),new THREE.Vector3(...p[0])),new THREE.Vector3().subVectors(new THREE.Vector3(...p[2]),new THREE.Vector3(...p[0])));
  const ix=n.dot(new THREE.Vector3(...normal))<0?[0,2,1,0,3,2]:[0,1,2,0,2,3];
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(p.flat(),3));g.setIndex(ix);g.computeVertexNormals();b.put(g,mat);
 }
 function polygon(mat,ring,y,holes=[]) {
  const triangles=THREE.ShapeUtils.triangulateShape(ring.map(p=>new THREE.Vector2(...p)),holes.map(h=>h.map(p=>new THREE.Vector2(...p))));
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute([...ring,...holes.flat()].flatMap(p=>[p[0],y,p[1]]),3));
  g.setIndex(triangles.flatMap(t=>[t[0],t[2],t[1]]));g.computeVertexNormals();
  if(g.attributes.normal.getY(0)<0){const ix=g.index.array;for(let i=0;i<ix.length;i+=3)[ix[i+1],ix[i+2]]=[ix[i+2],ix[i+1]];g.computeVertexNormals();} b.put(g,mat);
 }
 function prism(mat,ring,y0,y1) {
  polygon(mat,ring,y1);
  for(let i=0;i<ring.length;i++){const p=ring[i],q=ring[(i+1)%ring.length],c=[(p[0]+q[0])/2,0,(p[1]+q[1])/2]; face(mat,[[p[0],y0,p[1]],[q[0],y0,q[1]],[q[0],y1,q[1]],[p[0],y1,p[1]]],c);}
 }
 function shellFace(mat,p,n){
  face(mat,p,n);
  const len=Math.hypot(n[0],n[2]),v=n.map(x=>x/len);
  face(mat,p.map(q=>{const c=[q[0]-v[0]*.25,q[1],q[2]-v[2]*.25];return inOutline(c)?c:q;}),v.map(x=>-x));
 }
 // The playing surface remains open. No roof or underside cap crosses the field.
 const infield = [[-4,-4],[4,-4],[23,17],[28,27],[28,32],[24,39],[16,45],[0,47.4],[-16,45],[-24,39],[-28,32],[-28,27],[-23,17]].map(([u,v])=>{const p=fieldPoint(u,v);return[p[0],p[2]];});
 const diamond=[[0,3],[16.1,19.4],[0,35.5],[-16.1,19.4]].map(([u,v])=>{const p=fieldPoint(u,v);return [p[0],p[2]];});
 const mound=Array.from({length:near?20:10},(_,i)=>{const a=i*2*Math.PI/(near?20:10),p=fieldPoint(Math.cos(a)*2.8,18.44+Math.sin(a)*2.8);return[p[0],p[2]];});
 const turf=FIELD.map(([x,z])=>{const r=Math.hypot(x,z);return[x*(r-3)/r,z*(r-3)/r];});
 polygon('dirt',FIELD,0.2,[turf]);polygon('grass',turf,0.2,[infield]);
 polygon('dirt',infield,0.2,[diamond]);polygon('grass',diamond,0.2,[mound]);polygon('dirt',mound,0.2);
 for(const [u,v] of [[0,0],[19.398,19.398],[0,38.795],[-19.398,19.398]]) {const p=fieldPoint(u,v,0.55);b.box('roof',p,[0.65,0.18,0.65]);}
 // Foul lines meet real MLB corner distances: 335 ft left, 325 ft right.
 for(const [s,L] of [[1,102.108],[-1,99.06]]) {
  b.bar('roof',fieldPoint(s*0.8,0.8,0.55),fieldPoint(s*L/Math.SQRT2,L/Math.SQRT2,0.55),0.22,0.2);
 }
 const sectors=near?96:32, angle=i=>i*2*Math.PI/sectors;
 // Four seating tiers. Every row is a solid wedge with a teal tread and concrete riser.
 // Coarse far rows preserve all deck divisions and the open seating bowl.
 for(let i=0;i<sectors;i++) {
  const a=angle(i),c=angle(i+1),mid=(a+c)/2,high=covered(mid),normal=[Math.cos(mid),0,Math.sin(mid)];
  const tiers=high?[[0.02,0.39,0.9,12,near?15:5],[0.44,0.58,17,22,near?7:2],[0.66,0.79,26,31,near?7:2],[0.80,0.97,32,40,near?10:3]]:[[0.02,0.65,1,12,near?13:5]];
  for(const [ta,tb,ya,yb,rows] of tiers){
   const gap=(near&&i%4===0)?0.007:0;
   // One dark, continuous face per tier closes each aisle and exposed tier end.
   // Per-row concrete cheeks formed a bright sawtooth comb from the street.
   if((near && (gap||(i+1)%4===0)) || (high && (!covered(mid-2*Math.PI/sectors)||!covered(mid+2*Math.PI/sectors)))){
    const bottom=Math.max(0,ya-1),top=ya+(yb-ya)/rows;
    face('seat',[at(a+gap,ta,bottom),at(a+gap,ta,top),at(a+gap,tb,yb),at(a+gap,tb,yb-1)],[Math.sin(a),0,-Math.cos(a)]);
    face('seat',[at(c-gap,ta,bottom),at(c-gap,tb,yb-1),at(c-gap,tb,yb),at(c-gap,ta,top)],[-Math.sin(c),0,Math.cos(c)]);
   }
   for(let row=0;row<rows;row++) {
   const t0=ta+(tb-ta)*row/rows,t1=ta+(tb-ta)*(row+1)/rows,y0=ya+(yb-ya)*row/rows,y1=ya+(yb-ya)*(row+1)/rows;
   const p=at(a+gap,t0,y1),q=at(c-gap,t0,y1),r=at(c-gap,t1,y1),s=at(a+gap,t1,y1);
   face('seat',[p,q,r,s],[0,1,0]);
   face('concrete',[at(a+gap,t0,y0),at(c-gap,t0,y0),q,p],[-normal[0],0,-normal[2]]);
   if(row===0){const bottom=ta===0.02?0:(ya===17?12:ya===26?22:31);face('concrete',[at(a+gap,t0,bottom),at(c-gap,t0,bottom),at(c-gap,t0,y0),at(a+gap,t0,y0)],[-normal[0],0,-normal[2]]);}
   const bottom0=Math.max(0,y0-1),bottom1=Math.max(0,y1-1);
   // Closed shallow tier undersides remain under the stepped seating.
   face('concrete',[at(a+gap,t0,bottom0),at(a+gap,t1,bottom1),at(c-gap,t1,bottom1),at(c-gap,t0,bottom0)],[0,-1,0]);
   if(row===rows-1)face('concrete',[at(a+gap,t1,bottom1),at(c-gap,t1,bottom1),r,s],normal);
   }
  }
  // Wide concourses divide the decks, connected to the opaque base ring.
  for(const [ta,tb,y] of high?[[0.39,0.44,12],[0.58,0.66,22],[0.79,0.80,31]]:[[0.65,1,12]]) face('concrete',[at(a,ta,y),at(c,ta,y),at(c,tb,y),at(a,tb,y)],[0,1,0]);
  if(high && !gateOpening(mid)){
   // Brick rear gallery with large separated dark openings; the upper deck
   // stays open to the exposed roof structure instead of a blue glazed belt.
   for(const [y0,y1,mat] of [[24,27,'brick'],[27,32,'glow'],[32,35,'brick']]){
    const left=a+(c-a)*.25,right=c-(c-a)*.25;
    shellFace('brick',[at(a,.97,y0),at(left,.97,y0),at(left,.97,y1),at(a,.97,y1)],normal);
    shellFace(mat,[at(left,.97,y0),at(right,.97,y0),at(right,.97,y1),at(left,.97,y1)],normal);
    shellFace('brick',[at(right,.97,y0),at(c,.97,y0),at(c,.97,y1),at(right,.97,y1)],normal);
   }
  }
  // Thin outward-rising horseshoe canopy with full cantilever trusses below.
  if(high) {
   const inner=0.61,outer=0.99,yin=42.5,yout=48.0;
   const p=at(a,inner,yin),q=at(c,inner,yin),r=at(c,outer,yout),s=at(a,outer,yout);
   face('roof',[p,q,r,s],[0,1,0]);face('roof',[p.map((v,j)=>v-(j===1?0.18:0)),s.map((v,j)=>v-(j===1?0.18:0)),r.map((v,j)=>v-(j===1?0.18:0)),q.map((v,j)=>v-(j===1?0.18:0))],[0,-1,0]);
   face('roof',[at(a,inner,yin-0.18),at(c,inner,yin-0.18),q,p],[-normal[0],0,-normal[2]]);
   face('roof',[s,r,at(c,outer,yout-0.18),at(a,outer,yout-0.18)],normal);
   if(i%(near?4:3)===0 && inOutline(at(mid,.94,0)) && inOutline(at(mid,.99,0)) && inOutline(at(a,.99,0).map((n,k)=>(n+at(c,.99,0)[k])/2))) {
    // Interpolate the exported canopy facet, including angular corners.
    const trussAt=(t,y)=>{const u=at(a,t,y),v=at(c,t,y);return u.map((n,k)=>(n+v[k])/2);};
    const roofY=t=>yin+(yout-yin)*(t-inner)/(outer-inner)-.3;
    const top=trussAt(.94,roofY(.94));
    b.box('steel',trussAt(.94,top[1]/2),[.8,top[1],.8]);
    const end=trussAt(inner+.002,roofY(inner+.002)),rear=trussAt(outer,roofY(outer));
    b.bar('steel',end,rear,.32);
    const lower=t=>trussAt(t,roofY(t)-1.8*(t-inner)/(outer-inner));
    b.bar('steel',end,lower(outer),.32);
    const steps=near?4:2;
    for(let j=0;j<steps;j++){
      const t0=inner+(outer-inner)*j/steps,t1=inner+(outer-inner)*(j+1)/steps;
      b.bar('steel',trussAt(t0,roofY(t0)),lower(t1),.22);
      b.bar('steel',lower(t1),trussAt(t1,roofY(t1)),.22);
    }
    contacts.push({column:trussAt(.94,0),start:top,end});
   }
   // Close the canopy's two ends at the cut, avoiding an open shell.
   if(!covered(angle((i-1+sectors)%sectors)+Math.PI/sectors))face('roof',[p,s,at(a,outer,yout-0.18),at(a,inner,yin-0.18)],[Math.sin(a),0,-Math.cos(a)]);
   if(!covered(angle(i+1)+Math.PI/sectors))face('roof',[q,at(c,inner,yin-0.18),at(c,outer,yout-0.18),r],[-Math.sin(c),0,Math.cos(c)]);
  }
 }
 // Brick street facade follows the mapped envelope. Windows replace wall cells,
 // rather than lying on a second face. Separate bays survive in far detail.
 for(let i=0;i<OUTLINE.length;i++) {
  const p=OUTLINE[i],q=OUTLINE[(i+1)%OUTLINE.length],dx=q[0]-p[0],dz=q[1]-p[1],L=Math.hypot(dx,dz);if(L<0.7)continue;
  const a=Math.atan2((p[1]+q[1])/2,(p[0]+q[0])/2),h=covered(a)?24:8,n=Math.max(1,Math.ceil(L/(near?14:20)));
  // OSM ring is clockwise; its left normal stays outward at concave gates.
  const out=[-dz,0,dx];
  for(let j=0;j<n;j++)for(let k=0;k<h/8;k++){
   const bayAngle=Math.atan2(p[1]+dz*(j+.5)/n,p[0]+dx*(j+.5)/n);
   if(gateOpening(bayAngle))continue;
   const point=(f,y)=>[p[0]+dx*f,y,p[1]+dz*f];const f0=j/n,f1=(j+1)/n,y=k*8;
   const cuts=[[f0,f0+(f1-f0)*0.28,'brick'],[f0+(f1-f0)*0.28,f1-(f1-f0)*0.28,'glow'],[f1-(f1-f0)*0.28,f1,'brick']];
   shellFace('brick',[point(f0,y),point(f1,y),point(f1,y+2.2),point(f0,y+2.2)],out);
   for(const [f,g,mat]of cuts)shellFace(mat,[point(f,y+2.2),point(g,y+2.2),point(g,y+6.0),point(f,y+6.0)],out);
   shellFace('brick',[point(f0,y+6.0),point(f1,y+6.0),point(f1,y+8),point(f0,y+8)],out);
  }
 }
 // Chop House: mapped, low brick pavilion with dark glazing and two terraces.
 const chop=CHOP.map(local);prism('brick',chop,0,10.5);polygon('steel',chop,10.8);
 const cx=chop.reduce((s,p)=>s+p[0],0)/chop.length,cz=chop.reduce((s,p)=>s+p[1],0)/chop.length;
 b.box('glow',[cx,6,cz],[17,3.8,7],-0.45);b.box('roof',[cx,11.2,cz],[23,0.8,11],-0.45);
 // Left-field board above the low outfield stands (screen directed toward home).
 const board=[84,0,29],angleBoard=-0.45;
 b.box('steel',[board[0],29.5,board[2]],[35,23,2.4],angleBoard);
 const front=[-Math.sin(angleBoard),0,-Math.cos(angleBoard)];
 const tangent=[Math.cos(angleBoard),0,-Math.sin(angleBoard)];
 const screen=(u,y)=>[board[0]+tangent[0]*u+front[0]*1.5,y,board[2]+tangent[2]*u+front[2]*1.5];
 face('glow',[screen(-16,20),screen(16,20),screen(16,39),screen(-16,39)],front);
 // Flush, disjoint frame strips surround the dark screen, 30 cm off the backing.
 for(const [u0,u1,y0,y1]of [[-16.6,-16,19.4,39.6],[16,16.6,19.4,39.6],[-16,16,19.4,20],[-16,16,39,39.6]])
  face('steel',[screen(u0,y0),screen(u1,y0),screen(u1,y1),screen(u0,y1)],front);
 for(const u of [-12,12]){const p=screen(u,0);b.box('brick',[p[0],9,p[2]+1.5],[4,18,4]);}
 // White steel gate stair towers connect street grade and upper galleries.
 for(const a of gateAngles){
  const p=at(a,.91,0),tangent=[-Math.sin(a),0,Math.cos(a)];
  const atGate=(u,y,v=0)=>[p[0]+tangent[0]*u+Math.cos(a)*v,y,p[2]+tangent[2]*u+Math.sin(a)*v];
  for(const u of [-3,3])for(const v of [-1.6,1.6])b.bar('roof',atGate(u,0,v),atGate(u,38,v),.4);
  b.box('roof',atGate(-3,.4),[2,.8,4],-a);
  for(let y=0;y<36;y+=6){
   b.bar('roof',atGate(-3,y+.8),atGate(3,y+6),.5,1.8);
   b.box('roof',atGate(0,y+6),[7,.35,4],-a);
  }
 }
 // Retain the full-height outfield lattice lights on the 12 m concourse.
 // The three short home-side canopy stubs are omitted.
 const lightContacts=[];
 for(const [a,t,base]of [[.45,.75,12],[1.1,.75,12],[2.1,.75,12]]){
  const half=covered(a)?.65:1.15,top=52;
  // Tangential tower width, rear/inside feet land on a named gallery shelf.
  const support=at(a,t,base);
  b.box('concrete',[support[0],base-.2,support[2]],[3,.4,3]);
  const centre=[support[0],support[2]];
  const tp=(u,y)=>[centre[0]-Math.sin(a)*u,y,centre[1]+Math.cos(a)*u];
  // Rear roof saddles intersect the roof shell and carry both lattice legs.

  for(const u of [-half,half])b.bar('steel',tp(u,base),tp(u,top),.28);
  for(let y=base;y<top;y+=(near?4:8)){const y1=Math.min(top,y+(near?4:8));b.bar('steel',tp(-half,y),tp(half,y1),.2);b.bar('steel',tp(half,y),tp(-half,y1),.2);b.bar('steel',tp(-half,y1),tp(half,y1),.2);}
  b.bar('steel',tp(-4.2,53.1),tp(4.2,53.1),.45);
  for(const u of [-3,-1,1,3])b.bar('steel',tp(u,52.05),tp(u,54.9),.16);
  for(const u of [-3,-1,1,3])for(const y of [52.7,54.35])b.box('roof',tp(u,y),[1.25,1.3,.65],-a);
  // Crosshead is held by the lattice legs, not free at lamp height.
  for(const u of [-half,half])b.bar('steel',tp(u,top),tp(u,54.8),.28);
  lightContacts.push({base:tp(0,base),feet:[tp(-half,base),tp(half,base)],height:top});
 }
 b.root.userData.canopyContacts=contacts; b.root.userData.lightContacts=lightContacts;
 return b.finish();
}
