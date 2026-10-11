import * as THREE from 'three';
import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES, MANIFEST } from './config.js';
import { localRing, MAPPED, THETA } from './abbaye-aux-hommes-plan.js';
import { kit } from './abbaye-aux-hommes-kit.js';

const rect=(u0,u1,v0,v1)=>[[u0,v0],[u1,v0],[u1,v1],[u0,v1]];
export function create({detail='near'}={}) {
 const near=detail==='near', b=assetBuilder({...SPEC,palette:PALETTES.light},detail),k=kit(b,near);
 const ring=id=>localRing(id), center=r=>[r.reduce((s,p)=>s+p[0],0)/r.length,r.reduce((s,p)=>s+p[1],0)/r.length];
 function cornice(r,y,w=.24){const area=r.reduce((s,p,i)=>{const q=r[(i+1)%r.length];return s+p[0]*q[1]-q[0]*p[1]},0);const sign=area>0?1:-1;const n=(a,c)=>{let l=Math.hypot(c[0]-a[0],c[1]-a[1]);return [sign*(c[1]-a[1])/l,-sign*(c[0]-a[0])/l];};const expanded=r.map((p,i)=>{let n0=n(r[(i+r.length-1)%r.length],p),n1=n(p,r[(i+1)%r.length]);let scale=.14/Math.max(.3,1+n0[0]*n1[0]+n0[1]*n1[1]);return [p[0]+(n0[0]+n1[0])*scale,p[1]+(n0[1]+n1[1])*scale];});k.loft('trim',expanded,[[y,1],[y+w,1]]);}
 function facade(r,levels,spacing=4.2,pointed=false){k.edges(r,({p,q,l,nx,nz})=>{if(l<3.8)return;const count=Math.max(1,Math.floor(l/spacing));for(let i=0;i<count;i++){const t=(i+.5)/count,x=p[0]+(q[0]-p[0])*t,z=p[1]+(q[1]-p[1])*t;for(const [y,h,w,mat='glass'] of levels){if(pointed==='civic'&&x>39.5&&x<40.6&&z>63&&z<75)continue;k.window(x,y,z,nx,nz,w,h,pointed==='civic'?(h<4?'rect':false):pointed,mat,near);}}});}
 // The lower church envelope is the exact mapped aisle/chapel perimeter.
 const church=ring(155629129), main=ring(399129268), choir=ring(398948452);
 k.solid('stone',church,0,10.6);
 k.loft('roof',church,[[10.6,1],[13.1,.73]]);
 k.solid('stone',main,10.55,24.5);
 // Preserve the sourced 27.3 m west-screen gable, then rise behind it to the photo-estimated nave ridge.
 k.gable('roof',rect(-29.98,-22.7,-7.9,3.35),24.5,p=>2.8+8*(p[0]+29.98)/7.28,1);
 k.gable('roof',rect(-22.7,26.85,-7.9,3.35),24.5,10.8,1);
 // The transverse roofs terminate at the two mapped transept ends.
 for(const r of [rect(27.1,40.1,-22.85,-8.9),rect(27.45,40.1,3.6,18.0)])k.gable('roof',r,24.5,11.5,0);
 k.solid('stone',choir,10.55,15.9);
 k.loft('roof',choir,[[15.9,1],[18.7,.84]]);
 
 // Mapped choir core, rounded polygon at the eastern termination.
 const choirCore=[[40.42,-9.25],[58.2,-9.25],[62.65,-8.82],[65.42,-7.0],[66.08,-4.9],[66.08,-2.05],[64.25,.4],[62.1,1.95],[40.42,2.2]];
 k.solid('stone',choirCore,24.4,27.4);k.gable('roof',choirCore,27.4,5.8,1);
 cornice(main,23.85);cornice(choir,15.3);
 facade(church,[[1.6,6.4,2.3]],5.7,true);
 // Nave Romanesque clerestory: seven regular bays with paired blind arcatures.
 for(let u=-16.3;u<26;u+=5.7)for(const [v,nz] of [[-7.9+(u+30.3)*(-.9)/57.2,-1],[4.0+(u+30.5)*(-.6)/57.5,1]]){
  k.window(u,16.6,v,0,nz,2.3,5.1,false,'glow',true);
  if(near)for(const d of [-2.0,2.0])k.frame(u+d,16.5,v,0,nz,.8,5.0,false,.11);
 }
 // Large transept-end openings remain legible from the opposite street.
 for(const [v,nz] of [[-23.15,-1],[18.35,1]])for(const u of [30.15,33.5,36.85])k.window(u,14.8,v,0,nz,2.15,7.8,true,'glow',true);
 // West screen: three doors, three tiers of openings, four strong vertical piers.
 k.solid('stone',rect(-30.15,-28.7,-7.65,3.7),0,24.5);
 k.gable('stone',rect(-30.15,-28.7,-7.65,3.7),24.5,2.8,1);
 for(const v of [-11.8,-2.1,7.8])k.window(-30.55,.05,v,-1,0,v===-2.1?3.2:2.0,v===-2.1?6.1:4.0,false,'recess',true);
 for(const y of [9.5,17])for(const v of [-5.25,-2.0,1.25])k.window(-30.63,y,v,-1,0,1.75,4.5,false,'recess',true);
 for(const v of [-14.9,-8.65,4.6,11.1])k.box('trim',-30.24,12.2,v,.40,24.4,.6);
 // Twin western towers. Square Romanesque shafts, pierced Gothic belfries and eight clochetons.
 for(const [id,height] of [[398948450,82],[398948451,80]]){
  const r=ring(id),[u,v]=center(r);k.solid('stone',r,.0,42);for(const y of [24.4,30.8,36.4,41.3])cornice(r,y,.35);
  k.edges(r,({p,q,l,nx,nz})=>{const tiers=[[9.5,4.5,1,1.8],[17,4.5,1,1.8],[25.4,4.8,7,.58],[32,3.8,5,.83],[37.5,3.0,4,1.2]];
   for(const [y,h,n,w] of tiers)for(let i=0;i<n;i++){let t=(i+.5)/n,x=p[0]+(q[0]-p[0])*t,z=p[1]+(q[1]-p[1])*t;k.window(x,y,z,nx,nz,w,h,false,y>31?'recess':'stone',near);}
   for(const t of [.045,.955])k.box('trim',p[0]+(q[0]-p[0])*t,20.7,p[1]+(q[1]-p[1])*t,.29,41.4,.29);
  });
  const oct=Array.from({length:8},(_,i)=>[u+3.48*Math.cos(Math.PI/8+i*Math.PI/4),v+3.48*Math.sin(Math.PI/8+i*Math.PI/4)]);
  // Masonry octagonal pillars leave real through-openings in the belfry.
  oct.forEach(([x,z])=>k.cylinder('trim',x,z,41.95,53.2,.27,near?6:4));
  k.edges(oct,({p,q,l,nx,nz})=>{const x=(p[0]+q[0])/2,z=(p[1]+q[1])/2;k.arcade(x,42.0,z,nx,nz,l-1.0,9.4,l,11.8);k.frame(x,43.0,z,nx,nz,l-1.0,9.4,true,.17);if(near)k.bar('trim',[x,42,z],[x,51.8,z],.18,.18);});
  k.loft('stone',oct,[[52.8,1],[54.0,1]]);
  k.cone('stone',u,v,53.8,height,3.38,8);
  for(let i=0;i<8;i++){let a=i*Math.PI/4+Math.PI/8,x=u+3.53*Math.cos(a),z=v+3.53*Math.sin(a);k.cylinder('trim',x,z,41.8,53.2,.31,near?6:4);k.cone('stone',x,z,53.0,61.8,.53,near?8:4);}
  if(near){for(let i=0;i<8;i++){let a=i*Math.PI/4+Math.PI/8;k.bar('trim',[u+3.38*Math.cos(a),54.05,v+3.38*Math.sin(a)],[u+.04*Math.cos(a),height-.2,v+.04*Math.sin(a)],.10,.10);}}
 }
 // Crossing lantern: its mapped octagonal wall sits over the transept, under a slate pyramid.
 const lantern=ring(398949880);k.solid('stone',lantern,24.4,39.8);cornice(lantern,34.5,.36);cornice(lantern,39.3,.4);
 facade(lantern,[[29.1,4.8,1.85],[35.2,3.8,1.6]],4.5,false);k.loft('roof',lantern,[[39.8,1],[54.0,.015]]);
 // Four Gothic chevet turrets, exactly on the mapped parts, with limestone needle roofs.
 for(const id of [399297063,399297064,399297065,399297066]){const r=ring(id),[u,v]=center(r);k.solid('stone',r,0,31.8);cornice(r,27.5);facade(r,[[24.3,6.2,.95]],2.5,true);k.cone('stone',u,v,31.8,44.5,1.45,8);}
 // Flying buttresses: air remains below the sloping flyers, with outer ground piers.
 for(const u of [46.5,52.7,58.0,64.0])for(const [v,sgn] of [[-18.3,-1],[12.4,1]]){
  k.box('stone',u,9.15,v,.85,18.3,.85);k.cone('trim',u,v,18.1,22.8,.60,4);
  const innerV=sgn<0?-9.2:2.3;k.flyer([u,17.8,v],[u,25.0,innerV],1.05,1.4,1.75);
 }
 // Eastern radial flyers, terminating on the mapped rounded ambulatory.
 for(const a of [-.9,-.45,0,.45,.9]){const x=62+15*Math.cos(a),z=-4+15*Math.sin(a);k.box('stone',x,6.0,z,.6,12,.65);k.cone('trim',x,z,11.9,17.3,.49,4);k.flyer([x,11.9,z],[62+5*Math.cos(a),25.8,-4+5*Math.sin(a)],.9,1.3,2.1);}
 // Chevet clerestory and chapel rhythm on the polygonal east-facing bays.
 facade(choirCore,[[19,6.0,2.4,'glow']],4.4,true);
 // Continuous blind arcaded gallery below the apse roof, between narrow horizontal strings.
 cornice(choirCore,25.2,.17);cornice(choirCore,27.12,.20);
 k.edges(choirCore,({p,q,l,nx,nz})=>{const n=Math.max(1,Math.floor(l/1.65));for(let i=0;i<n;i++){const t=(i+.5)/n;k.window(p[0]+(q[0]-p[0])*t,25.58,p[1]+(q[1]-p[1])*t,nx,nz,.78,1.25,false,'recess',true);}});
 // Radiating chapel windows and piers follow actual intersections of the mapped outer ring.
 for(let a=-1.28;a<=1.3;a+=.36){let dx=Math.cos(a),dz=Math.sin(a),best=Infinity;
  for(let i=0;i<church.length;i++){let p=church[i],q=church[(i+1)%church.length],ex=q[0]-p[0],ez=q[1]-p[1],det=dx*ez-dz*ex;if(Math.abs(det)<1e-7)continue;let px=p[0]-62,pz=p[1]+4,t=(px*ez-pz*ex)/det,s=(px*dz-pz*dx)/det;if(t>0&&s>=0&&s<=1)best=Math.min(best,t);}
  if(!Number.isFinite(best))continue;const x=62+dx*best,z=-4+dz*best;k.window(x,1.1,z,dx,dz,2.2,7.4,true,'glass',true);
  k.box('trim',x-dz*1.48,5.3,z+dx*1.48,.35,10.6,.35);
 }
 // Low cloister galleries: four open arcades around the mapped empty court.
 const outer=ring(1432566826), inner=ring(1432566827);
 const cloisterShape=new THREE.Shape(outer.map(([u,v])=>new THREE.Vector2(u,-v)));
 cloisterShape.holes.push(new THREE.Path(inner.map(([u,v])=>new THREE.Vector2(u,-v))));
 const slab=new THREE.ExtrudeGeometry(cloisterShape,{depth:1.25,bevelEnabled:false});slab.rotateX(-Math.PI/2);slab.translate(0,4.8,0);k.put(slab,'stone');
 const cap=new THREE.ExtrudeGeometry(cloisterShape,{depth:.22,bevelEnabled:false});cap.rotateX(-Math.PI/2);cap.translate(0,6.05,0);k.put(cap,'roof');
 k.edges(inner,({p,q,l,nx,nz})=>{const n=Math.round(l/4.6);for(let i=0;i<n;i++){const t=(i+.5)/n,x=p[0]+(q[0]-p[0])*t,z=p[1]+(q[1]-p[1])*t;k.arcade(x,.0,z,-nx,-nz,l/n-.5,4.25,l/n,4.9);}});
 // Eighteenth-century municipal wings: exact OSM parts, pale Caen stone, slate mansards.
 for(const id of [288308852,288308843,288308845,288308848,288308850,288308851]){
  const r=ring(id),[u,v]=center(r);k.solid('stone',r,0,18.1);cornice(r,6.5,.22);cornice(r,12.6,.22);cornice(r,17.6,.42);
  k.loft('roof',r,[[18.1,1],[22.0,.78,.88],[23.6,.28,.74]]);
  facade(r,[[.65,5.4,2.0],[7.55,3.6,1.6],[13.5,3.15,1.5]],4.2,'civic');
  if(near){k.edges(r,({p,q,l,nx,nz})=>{if(l<8)return;let n=Math.floor(l/7);for(let i=0;i<n;i++){let t=(i+.5)/n,x=p[0]+(q[0]-p[0])*t-nx*.65,z=p[1]+(q[1]-p[1])*t-nz*.65;k.box('stone',x,19.3,z,1.55,2.4,1.2);k.window(x,18.8,z,nx,nz,.85,1.6,false,'glass',false);k.cone('roof',x,z,20.45,21.3,1.13,4);}});}
 }
 // The east wing's taller central entrance is a pediment pavilion.
 const pavilion=ring(288308849);k.solid('stone',pavilion,0,22.1);k.gable('roof',pavilion,22.1,3.2,1);facade(pavilion,[[.7,6.0,2.7],[8.4,8.1,3.5,'glass']],5,false);
 // Medieval Salle des gardes, attached at the southern end and slightly skewed.
 const guards=ring(288308842);k.solid('stone',guards,0,12.5);k.gable('roof',guards,12.5,6.0,0);facade(guards,[[2.0,7.5,2.1]],5.5,true);
 // Detached Palais Ducal (photo 3): Gothic hall with buttresses, roses and tile roof.
 for(let id=1432516140;id<=1432516148;id++){
  const r=ring(id),tag=MAPPED[id].tags,h=id===1432516147?13.6:id===1432516140?14:tag['building:levels']==='2'?8.2:12.6;
  k.solid('stone',r,0,h);cornice(r,h-.35,.25);const flat=tag['roof:shape']==='flat',tile=tag['roof:material']==='roof_tiles';
  if(flat)k.loft('roof',r,[[h,1],[h+.28,.98]]);else k.gable(tile?'tile':'roof',r,h,tile?5.2:4.1,id===1432516147?0:1);
  facade(r,[[1.0,3.3,1.9],[5.5,6.5,2.3,'glow']],4.4,true);
  if(id===1432516147)k.edges(r,({p,q,l,nx,nz})=>{if(l<10)return;let n=Math.floor(l/5);for(let i=0;i<n;i++){let t=(i+.5)/n,x=p[0]+(q[0]-p[0])*t,z=p[1]+(q[1]-p[1])*t;k.box('trim',x,6.7,z,.42,13.4,.42);const g=new THREE.RingGeometry(.49,.66,near?16:8);g.rotateY(Math.atan2(nx,nz));g.translate(x+nx*.10,12.3,z+nz*.10);k.put(g,'trim');}});
 }
 const root=b.finish();root.traverse(o=>{if(o.isMesh){o.geometry.deleteAttribute('bridgeLift');o.geometry.rotateY(THETA);o.geometry.computeBoundingBox();o.geometry.computeBoundingSphere();}});root.userData.elevationDatum=MANIFEST.elevationDatum;return root;
}
