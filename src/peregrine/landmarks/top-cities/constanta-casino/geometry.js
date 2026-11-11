import polygonClipping from 'polygon-clipping';
import * as THREE from 'three';
import { SPEC, PALETTES } from './config.js';
import { LOCAL_RINGS } from './footprint.js';
import { builder } from './constanta-casino-parts.js';
export function create({detail='near'}={}) {
 const {near,b,face,cap,frame,patch,walls,prism,rect,block,spin,cyl,hip,rows,finish}=builder(SPEC,PALETTES,detail);
const poly=(mat,r,hs,z,out=1)=>{const p=r.map(v=>new THREE.Vector2(...v)),holes=hs.map(h=>h.map(v=>new THREE.Vector2(...v))),a=[...p,...holes.flat()];for(const t of THREE.ShapeUtils.triangulateShape(p,holes))face(mat,t.map(j=>[a[j].x,a[j].y,z]),[0,0,out]);};
const ellipse=(x,y,rx,ry,n=near?36:20)=>Array.from({length:n},(_,j)=>[x+rx*Math.cos(j*2*Math.PI/n),y+ry*Math.sin(j*2*Math.PI/n)]);
const arch=(x,w,base,spring,rise)=>[[x-w/2,base],[x+w/2,base],...Array.from({length:(near?16:8)+1},(_,j)=>{const a=j*Math.PI/(near?16:8);return[x+w/2*Math.cos(a),spring+rise*Math.sin(a)]})];
const panel=(x,z,w,lo,hi,windows,mat='stone',out=1)=>{poly(mat,[[x-w/2,lo],[x+w/2,lo],[x+w/2,hi],[x-w/2,hi]],windows,z,out);for(const h of windows)poly('glass',h,[],z,out);};
const tube=(mat,a,c,r)=>{const v=new THREE.Vector3(...c).sub(new THREE.Vector3(...a)),g=new THREE.CylinderGeometry(r,r,v.length(),near?8:6);g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0),v.clone().normalize()));g.translate(...a.map((v,i)=>(v+c[i])/2));b.put(g,mat);};
// The mapped full perimeter belongs to a low rigid plinth, never promenade paving.
prism(LOCAL_RINGS[0],0,.8,'base','base');
// Lower enclosed rooms stop behind the open landward veranda.
const back=LOCAL_RINGS[0].map(([x,z])=>[x,Math.min(z,7.4)]);back.forEach((a,i)=>{const f=frame(back,i);if(f.l<.01||Math.abs(a[1]-7.4)<.001&&Math.abs(back[(i+1)%back.length][1]-7.4)<.001)return;const n=Math.max(1,Math.round(f.l/(near?4.6:7))),step=f.l/n;patch('stone',f,0,f.l,.8,1.5);patch('stone',f,0,f.l,5.9,7.2);for(let j=0;j<n;j++){patch('stone',f,j*step,j*step+step*.42,1.5,5.9);patch('glass',f,j*step+step*.42,(j+1)*step,1.5,5.9);}});cap('roof',back,7.2);
// Tall hall, with an actual shell-shaped glazed partition rather than a painted motif.
const main=rect(0,-2,27,23),shell=[[-5.5,9.15],[5.5,9.15],[8.5,12.1],...Array.from({length:(near?32:20)+1},(_,j)=>{const a=j*Math.PI/(near?32:20);return[8.5*Math.cos(a),12.1+6.65*Math.sin(a)]}),[-8.5,12.1]];
panel(0,9.5,27,8.5,22.8,[shell]);
for(const z of [-13.5])panel(0,z,27,7.2,22.8,[-8.5,0,8.5].map(x=>arch(x,5.8,9.2,16.2,3.4)),'stone',-1);
for(const x of [-13.5,13.5]){const f={l:23,p:(u,y)=>[x,y,-13.5+u],out:[Math.sign(x),0,0]};patch('stone',f,0,23,7.2,22.8);}
// Shell mullions radiate from the scallop's foot; horizontal arcs retain the fan at far LOD.
const z=9.53,N=near?16:10;for(let j=0;j<=N;j++){const a=j*Math.PI/N,end=[8.5*Math.cos(a),12.1+6.65*Math.sin(a),z];tube('frame',[0,9.2,z],end,near?.065:.095);}for(const t of [.55,.8,1])for(let j=0;j<N;j++){const a=j*Math.PI/N,c=(j+1)*Math.PI/N,P=q=>[8.5*t*Math.cos(q),9.2+t*(2.9+6.65*Math.sin(q)),z];tube('frame',P(a),P(c),t===1?.16:.08);}tube('frame',[-5.5,9.2,z],[5.5,9.2,z],.12);
// The fan's heavy carved hood follows its arch, not the full rectangular panel.
for(let j=0;j<(near?36:20);j++){const a=j*Math.PI/(near?36:20),c=(j+1)*Math.PI/(near?36:20),P=(q,r)=>[r*Math.cos(q),12.1+(r/8.5)*6.65*Math.sin(q),9.66];face('stone',[P(a,8.65),P(c,8.65),P(c,9.2),P(a,9.2)],[0,0,1]);}
// Shallow dark mansard running back from the tall central facade.
block(0,-2,27,23,22.8,23.2,'stone','roof');{const e=rect(0,-2,26.2,22.2),r=rect(0,-2,22,18.8);for(let j=0;j<4;j++){const k=(j+1)%4;face('roof',[[e[j][0],23.2,e[j][1]],[e[k][0],23.2,e[k][1]],[r[k][0],25.15,r[k][1]],[r[j][0],25.15,r[j][1]]],[0,1,0]);}cap('roof',r,25.15);}
// Lower flanking salons, with scalloped pediments and large arched windows.
for(const x of [-20.25,20.25]){const w=13.5,holes=[arch(x,4.9,9.2,13.7,2.15)];panel(x,7.4,w,7.2,17.4,holes);const wing=polygonClipping.intersection([LOCAL_RINGS[0]],[rect(x,-2.5,w,19.8)])[0][0].slice(0,-1);wing.forEach((a,i)=>{const c=wing[(i+1)%wing.length],f=frame(wing,i);if(Math.abs(a[1]-7.4)<.01&&Math.abs(c[1]-7.4)<.01||Math.abs(a[0]-Math.sign(x)*13.5)<.01&&Math.abs(c[0]-Math.sign(x)*13.5)<.01)return;const n=Math.max(1,Math.round(f.l/5.2)),step=f.l/n;for(let j=0;j<n;j++){const h=arch((j+.5)*step,step*.58,9.3,13.2,1.8),outer=[[j*step,7.2],[(j+1)*step,7.2],[(j+1)*step,17.4],[j*step,17.4]],pts=outer.map(v=>new THREE.Vector2(...v)),holes=[h.map(v=>new THREE.Vector2(...v))],a=[...pts,...holes.flat()];for(const t of THREE.ShapeUtils.triangulateShape(pts,holes))face('stone',t.map(k=>f.p(a[k].x,a[k].y)),f.out);for(const t of THREE.ShapeUtils.triangulateShape(h.map(v=>new THREE.Vector2(...v)),[]))face('glass',t.map(k=>f.p(h[k][0],h[k][1])),f.out);}});for(let j=0;j<wing.length;j++){const a=wing[j],c=wing[(j+1)%wing.length];face('roof',[[a[0],17.4,a[1]],[c[0],17.4,c[1]],[x,18.2,-1]],[0,1,0]);}
const top=[[-w/2,17.4],[-w/2,17.8],[-4.8,17.9],[-3.5,18.4],[-2.3,18.6],[-1.1,19.1],[0,19.35],[1.1,19.1],[2.3,18.6],[3.5,18.4],[4.8,17.9],[w/2,17.8],[w/2,17.4]].map(([u,y])=>[x+u,y]);poly('stone',top,[],7.42);}
// Front veranda: eight true arches, their soffits extend to the glass doors behind.
const stations=[-19.8,-14.8,-9.8,-4.8,.2,5.2,10.2,15.2,20.2],frontZ=13.76,backZ=7.4;
for(let j=0;j<stations.length-1;j++){const x=(stations[j]+stations[j+1])/2,w=stations[j+1]-stations[j]-.75,h=arch(x,w,.8,4.5,1.55),r=[[stations[j],.8],[stations[j+1],.8],[stations[j+1],7.2],[stations[j],7.2]];poly('stone',r,[h],frontZ,1);for(let k=1;k<h.length;k++){const a=h[k],c=h[(k+1)%h.length];face('stone',[[a[0],a[1],frontZ],[c[0],c[1],frontZ],[c[0],c[1],backZ],[a[0],a[1],backZ]],[(x-(a[0]+c[0])/2),-1,0]);}panel(x,backZ,5,.8,6.8,[arch(x,3.7,1.1,4.3,1.3)]);}
block(.2,(frontZ+backZ)/2,40,frontZ-backZ,7.2,7.65,'stone','stone');
// Squat balustrade, not a solid parapet; grounded on the veranda slab.
block(.2,13.72,40.4,.45,7.65,7.85,'stone','stone');block(.2,13.72,40.4,.5,8.6,8.82,'stone','stone');for(let j=0;j<=(near?66:34);j++)block(-19.8+j*40/(near?66:34),13.72,.18,.25,7.85,8.6,'stone','stone');
// Twin tall corner pylons and Art Nouveau crests give the roof its recognisable silhouette.
for(const x of [-12.45,12.45]){block(x,9.65,1.7,1.3,8.82,24,'stone','stone');block(x,9.65,2.15,1.7,22.5,23,'stone','stone');block(x,9.65,2.6,2,24,24.45,'stone','stone');spin([[1.2,24.45],[.95,24.7],[.75,25.5],[.2,26.5]],'stone',x,9.65,near?20:12);const ring=ellipse(x,25.25,.7,.85,near?24:16);poly('stone',ring,[],10.7);poly('stone',ellipse(x,25.25,.36,.48,near?20:12),[],10.72);}
for(const x of [-12.45,12.45]){for(const side of [-1,1]){const r=ellipse(x+side*.8,24.65,.7,.8,near?24:14);poly('stone',r,[],10.3);}for(const dx of [-.55,0,.55]){const r=ellipse(x+dx,25.7-Math.abs(dx)*.3,.36,.5,near?18:10);poly('stone',r,[],10.32);}for(const yy of [11,17.7,20.2])block(x,9.7,2.1,1.5,yy,yy+.5,'stone','stone');}
for(const x of [-20.25,20.25]){for(const dx of [-5.7,5.7])block(x+dx,7.55,.65,.6,8.8,18,'stone','stone');for(const dx of [-1,0,1])poly('stone',ellipse(x+dx,18.45+(.8-Math.abs(dx))*.35,.6,.35,near?18:10),[],7.45);}
// Frieze teeth and two tiers of pilaster capitals are geometric rhythm, no inscriptions.
for(let j=0;j<(near?30:16);j++)block(-12+j*24/((near?30:16)-1),9.65,.18,.35,21.1,21.7,'stone','stone');block(0,9.7,25,.65,22.1,22.8,'stone','stone');

return finish();
}
