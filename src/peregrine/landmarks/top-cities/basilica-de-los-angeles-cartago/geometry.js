import * as THREE from 'three';
import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';
import { FOOTPRINTS } from './footprint.js';
import { parts, local } from './basilica-de-los-angeles-cartago-parts.js';

export function create({detail='near'}={}) {
  const near=detail==='near',b=assetBuilder({...SPEC,palette:PALETTES.light},detail);
  const k=parts(b,near),{box,bar,plan,hip,lathe,face,dome,column,angel}=k;
  // The lower envelope follows the mapped outer wall; the south porch is cut back.
  const ring=FOOTPRINTS[0].slice(0,-1).map(local);
  for(let i=15;i<=25;i++)ring[i][1]=Math.min(ring[i][1],18.4);
  plan('stone',ring,0,10.8);plan('roof',ring,10.8,.3);
  // Windows are distributed on actual wall segments, never on a full-height strip.
  for(let i=0;i<ring.length;i++){
    const a=ring[i],c=ring[(i+1)%ring.length],dx=c[0]-a[0],dz=c[1]-a[1],len=Math.hypot(dx,dz);
    if(len<6||a[1]>18||c[1]>18)continue;
    const f=face((a[0]+c[0])/2,(a[1]+c[1])/2,Math.atan2(-dz,dx)+Math.PI);
    const count=Math.max(1,Math.floor(len/6));
    for(let j=0;j<count;j++){const s=(j-(count-1)/2)*len/count;f.arch('glow',s,2.6,2.5,5.4);f.trim(s,2.6,2.5,5.4,.2);f.box('trim',s-.055,s+.055,2.65,7.1,.32,.42);f.box('trim',s-1.18,s+1.18,4.8,4.9,.32,.42);}
    f.box('trim',-len/2,len/2,10.1,10.45,.12,.4);
    
  }
  // Cross-shaped upper nave and shallow zinc hips, with continuous clerestory bays.
  box('stone',2,15.05,-2,17,8.5,35);hip(2,-2,18,36,19.3,25.2);
  for(const [x,a]of [[-6.5,-Math.PI/2],[10.5,Math.PI/2]]){const f=face(x,-2,a);for(let s=-14;s<=14;s+=3.5){f.arch('glow',s,15.3,1.2,2.6);f.trim(s,15.3,1.2,2.6,.12);}f.box('trim',-17.5,17.5,18.5,18.85,.1,.4);}
  for(const [x,w,d,z]of [[-26,25,19,-.5],[23,20,16,-1]]){hip(x,z,w,d,11.25,15.8);}
  // Front stone aisle wings expose four tall windows and two dark side entrances.
  for(const x of [-20.5,24]){const ff=face(x,18.4);ff.arch('glow',0,2.1,2.65,6.3);ff.trim(0,2.1,2.65,6.3,.24);ff.box('trim',-.055,.055,2.1,7.2,.34,.45);}
  for(const [x,z]of [[-9.5,25.5],[13.5,23.9]]){const ff=face(x,18.4);for(const s of [-3.4,0,3.4])ff.arch('glass',s,.8,s===0?2.4:1.7,s===0?8.5:7.2,.22);}
  // Three-tier Byzantine central drum, round windows, ribbed dome and small finial.
  lathe('trim',2,-3,[[7.2,23.8],[7.2,25.6],[6.7,25.9]],near?32:16);lathe('trim',2,-3,[[6.7,31.9],[7,32.3]],near?32:16);
  for(let i=0;i<8;i++){const a=i*Math.PI/4,f=face(2+6.19*Math.sin(a),-3+6.19*Math.cos(a),a);f.circleWall('trim',5.15,25.9,31.95,29.3,1.22);f.circle('glass',0,29.3,1.1,.18);f.ring(0,29.3,1.23,.13,.3);for(let j=0;j<8;j++){const q=j*Math.PI/4;f.bar('trim',[0,29.3,.38],[Math.sin(q)*1.08,29.3+Math.cos(q)*1.08,.38],.075);}f.box('shade',-1.8,1.8,31.65,31.9,.12,.24);}
  dome(2,-3,7,32.3,7.3);lathe('trim',2,-3,[[.45,39.6],[.45,40.8],[.26,41],[0,41.2]],near?12:6);bar('bronze',[2,40.8,-3],[2,42,-3],.075);
  // Smaller scalloped side cupolas behind the facade.
  for(const x of [-13,17]){
    box('stone',x,14.7,11,9,7.8,10);hip(x,11,10,11,18.65,21.9);
    lathe('trim',x,11,[[3.45,20.2],[3.45,24.2]],near?24:12);
    for(let i=0;i<6;i++){const a=i*Math.PI/3,f=face(x+3.48*Math.sin(a),11+3.48*Math.cos(a),a);f.circle('glass',0,22.35,.57);f.ring(0,22.35,.58,.1);}
    dome(x,11,3.6,24.2,3.3);box('trim',x,27.7,11,.12,.7,.12);
  }
  // Square corner bell turrets retain their paired open arches in both LODs.
  for(const x of [-27.2,27]){
    const z=-1.2,w=5.3;box('trim',x,17.1,z,w,9.4,w);
    for(const a of [0,Math.PI/2,Math.PI,-Math.PI/2]){const f=face(x+Math.sin(a)*w/2,z+Math.cos(a)*w/2,a);f.wall('trim',w,21.8,26.4,[[-1.15,22.1,1.65,3.9],[1.15,22.1,1.65,3.9]],.35);for(const s of [-1.15,1.15])f.trim(s,22.1,1.65,3.9,.12,.18);}
    box('shade',x,26.65,z,5.7,.5,5.7);dome(x,z,2.6,26.9,1.6);
    lathe('trim',x,z,[[.85,28.5],[.85,30.3]],near?12:8);for(let i=0;i<4;i++){const a=i*Math.PI/2,f=face(x+.86*Math.sin(a),z+.86*Math.cos(a),a);f.arch('glass',0,28.65,.5,1.35,.08);}dome(x,z,.9,30.3,.8);box('trim',x,31.3,z,.1,.5,.1);
  }
  // Central facade: broad arched portal, paired traceried windows and a seven-bay belfry.
  const cx=2,front=22.5;box('stone',cx,12.4,19.8,10.4,24.8,5.4);
  const f=face(cx,front);
  f.arch('glass',0,1,5.1,8.9,.24);f.trim(0,1,5.1,8.9,.43,.35);
  for(const x of [-4.5,-3.65,3.65,4.5]){column(cx+x,front+.38,.9,12.4,.32);column(cx+x,front+.38,12.5,24.1,.27);}
  f.box('trim',-5.5,5.5,12.2,12.7,.12,.5);
  for(const s of [-2.5,2.5]){
    f.arch('glass',s,14.1,3.65,9.2,.23);f.trim(s,14.1,3.65,9.2,.22,.32);
    for(const d of [-1.15,0,1.15])f.box('trim',s+d-.075,s+d+.075,14.1,21,.34,.49);
    for(const y of [16.2,18.4,20.4])f.box('trim',s-1.7,s+1.7,y,y+.1,.34,.49);
    for(const d of [-.75,.75])f.ring(s+d,21.9,.37,.075,.38);
  }
  f.arch('trim',0,10.2,2.3,2.1,.23);angel(cx,front+.45,10.3,1.65,false);
  f.box('trim',-5.6,5.6,23.8,24.4,.12,.48);
  if(near)for(let x=-5;x<=5;x+=.6)f.box('shade',x-.15,x+.15,24.45,24.95,.18,.37);
  box('trim',cx,25.0,19.8,11.2,.65,6.2);
  for(const a of [0,Math.PI/2,Math.PI,-Math.PI/2]){
    const w=(Math.abs(Math.sin(a))>.5)?5.5:10.4,depth=(Math.abs(Math.sin(a))>.5)?5.2:2.7;
    const ff=face(cx+Math.sin(a)*depth,19.8+Math.cos(a)*depth,a),holes=[];
    const count=w>8?7:3;for(let i=0;i<count;i++)holes.push([(i-(count-1)/2)*1.3,25.55,.87,2.5]);
    ff.wall('trim',w,25.3,28.3,holes,.75,'shade');for(const [s,y,hw,hh]of holes)ff.trim(s,y,hw,hh,.11,.2);
  }
  box('shade',cx,28.6,19.8,11.1,.55,6.1);
  // Broken triangular clock crest: an individual silhouette rather than a roof box.
  const crest=new THREE.Shape([new THREE.Vector2(-3.8,28.9),new THREE.Vector2(7.8,28.9),new THREE.Vector2(6.4,29.5),new THREE.Vector2(4,31.2),new THREE.Vector2(2,31.5),new THREE.Vector2(0,31.2),new THREE.Vector2(-2.4,29.5)]);
  const clockHole=new THREE.Path();clockHole.absarc(2,30.2,.88,0,Math.PI*2,true);crest.holes.push(clockHole);
  k.put(new THREE.ExtrudeGeometry(crest,{depth:.5,bevelEnabled:false}).translate(0,0,22.35),'trim');
  const clock=face(cx,22.86);clock.circle('glass',0,30.2,.83,.1);clock.ring(0,30.2,.87,.12,.23);clock.bar('trim',[0,30.2,.28],[.1,30.8,.28],.08);clock.bar('trim',[0,30.2,.28],[.51,30.03,.28],.08);
  for(const [a,c]of [[[-3.8,29.05,22.95],[-.4,31.35,22.95]],[[-.4,31.35,22.95],[2,31.65,22.95]],[[2,31.65,22.95],[4.4,31.35,22.95]],[[4.4,31.35,22.95],[7.8,29.05,22.95]]])bar('shade',a,c,.16);
  angel(cx,20.5,31.3,3.0);bar('trim',[cx-.8,32.7,20.5],[cx-.8,35,20.5],.1);
  // Flanking rose-window walls stand on genuine three-arch porches.
  for(const [x,z]of [[-9.5,25.5],[13.5,23.9]]){
    const w=10.4,side=face(x,z);
    side.wall('stone',w,.5,10.3,[[-3.4,1.05,1.7,7.2],[0,1.05,2.4,8.5],[3.4,1.05,1.7,7.2]],.55);
    box('stone',x,16.1,z-.85,w,11.6,1.7);
    for(const s of [-3.4,0,3.4])side.trim(s,1.05,s===0?2.4:1.7,s===0?8.5:7.2,.22,.26);
    for(const s of [-4.95,-1.95,1.95,4.95])column(x+s,z+.35,.5,10.3,.26);
    side.box('trim',-5.3,5.3,10.1,10.6,.1,.43);
    side.circle('glass',0,15.65,2.05,.25);side.ring(0,15.65,2.12,.24,.36);side.ring(0,15.65,1.83,.09,.46);
    for(let i=0;i<12;i++){const a=i*Math.PI/6;side.bar('trim',[Math.sin(a)*.38,15.65+Math.cos(a)*.38,.5],[Math.sin(a)*1.8,15.65+Math.cos(a)*1.8,.5],.13);}side.circle('trim',0,15.65,.38,.53);
    for(const s of [-4.8,4.8]){side.box('trim',s-.27,s+.27,10.6,22.4,.12,.4);side.box('trim',s-.45,s+.45,20.4,20.9,.14,.48);}
    side.box('trim',-5.5,5.5,21.8,22.3,.08,.5);
    if(near)for(let s=-4.9;s<=4.9;s+=.65)side.arch('shade',s,20.8,.31,.7,.25);
    for(const s of [-4.8,4.8]){box('trim',x+s,23.2,z,.48,2,.48);angel(x+s,z,24.2,2.1,true);}
    for(let i=0;i<4;i++)box('trim',x,.075*(i+1),z+.85-i*.14,8.5,.15*(i+1),1.2-i*.28);
  }
  // Grounded central stair and panelled oak door; no plaza or neighbor ownership.
  for(let i=0;i<4;i++)box('trim',cx,.075*(i+1),23.3-i*.14,9.8,.15*(i+1),1.4-i*.28);
  f.box('bronze',-.06,.06,.8,7.5,.27,.39);
  if(near)for(const s of [-1.3,1.3])for(const y of [2.2,4.7])f.box('bronze',s-.8,s+.8,y,y+1.7,.28,.37);
  return b.finish();
}
