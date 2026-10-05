import * as THREE from 'three';
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';
import { FOOTPRINTS } from './footprint.js';
import { lngToMercX, latToMercY, mercStretch } from '../../../facade/geo.js';
import { ANGLE, missionKit } from './mission-inn-kit.js';
const circle=(u,v,r,n=32)=>Array.from({length:n},(_,i)=>[u+Math.cos(i*2*Math.PI/n)*r,v+Math.sin(i*2*Math.PI/n)*r]);
const rectangle=(a,b,c,d)=>[[a,c],[b,c],[b,d],[a,d]];
export const COURTS={spanish:[8,-31,34,24],rotunda:[-31,-43,11.5]};
function mappedPlan(ring){
 const k=mercStretch(SPEC.origin[1]),ox=lngToMercX(SPEC.origin[0]),oz=latToMercY(SPEC.origin[1]);
 return ring.map(([lng,lat])=>{const x=(lngToMercX(lng)-ox)/k,z=(oz-latToMercY(lat))/k;return [x*Math.cos(ANGLE)-z*Math.sin(ANGLE),x*Math.sin(ANGLE)+z*Math.cos(ANGLE)];});
}
export function create({detail='near'}={}){
 const near=detail==='near',b=assetBuilder({...SPEC,palette:PALETTES.light},detail),k=missionKit(b,near);
 // Two deep internal voids plus the mapped U-shaped entrance court survive far LOD.
 k.poly('stone',mappedPlan(FOOTPRINTS[0]),0,14,[rectangle(-9,25,-43,-19),circle(-31,-43,11.5,near?40:20)]);
 k.box('stone',-22.25,0,-1.6,5.5,3.38,7.5);k.box('stone',-9.15,0,-1.6,5.6,3.38,7.5);k.poly('stone',mappedPlan(FOOTPRINTS[2]),0,3.57);
 k.hip(-25,-6,-5.3,2.1,3.48,1.25);k.hip(-4.3,3.3,-2.7,2.5,3.67,1.2);
 // International Rotunda: open well and concentric galleries, never a solid roof disc.
 k.poly('stone',circle(-31,-43,15.4,near?48:16),13.8,6.6,[circle(-31,-43,11.5,near?48:16)]);
 for(const y of (near?[5.0,9.3,13.6,17.9]:[17.9])){
  k.poly('trim',circle(-31,-43,11.65,near?48:16),y,.18,[circle(-31,-43,10.6,near?48:16)]);
  const n=near?24:8;
  for(let i=0;i<n;i++){const a=i*2*Math.PI/n,u=-31+11.05*Math.cos(a),v=-43+11.05*Math.sin(a);k.box('trim',u,y+.18,v,.25,1.15,.25);if(near)k.window(-31+11.45*Math.cos(a),-43+11.45*Math.sin(a),y+.5,1.2,Math.min(2.8,20.25-y-.5),-a-Math.PI/2,i%6===0);}
 }
 if(near)for(let i=0;i<80;i++){const a=i*Math.PI*3.8/80,u=-31+10.15*Math.cos(a),v=-43+10.15*Math.sin(a);k.box('trim',u,.25+i*.195,v,1.1,.16,.64,-a);}
 k.poly('trim',circle(-31,-43,15.6,near?48:16),20.3,.35,[circle(-31,-43,11.5,near?48:16)]);
 // Open Mission wing verandas: load-bearing arch bands and a supported tiled roof.
 function arcade(u0,u1,v,y,angle=0,depth=2.6,pitch=3.3){
  const n=Math.max(1,Math.floor((u1-u0)/pitch)),step=(u1-u0)/n;
  for(let i=0;i<n;i++){const u=u0+(i+.5)*step,x=angle?v:u,z=angle?u:v;k.arch('trim',x,z,y,step-.56,3.25,.27,.4,angle);}
  if(!angle)k.box('trim',(u0+u1)/2,y+3.52,v,u1-u0,.45,depth);else k.box('trim',v,y+3.52,(u0+u1)/2,depth,.45,u1-u0);
 }
 arcade(-25,32,-12.2,14.0,0,3.5);k.hip(-28,33,-16.8,-10.5,17.95,1.45);
 arcade(-23,34,-32.2,14.0,Math.PI/2,3.7);k.hip(-46.6,-30.9,-24,37.3,17.95,2.3);
 arcade(-18,30,34.8,14.0,Math.PI/2,3);k.hip(32.6,47.4,-24,30.6,17.95,2.2);
 k.hip(-48.5,5,-63,-52.5,14.1,2.0);k.hip(5,49.5,-60.6,-51.5,14.1,2.0);k.hip(35.6,51,-51.5,-27.5,14.1,2.0);
 // Spanish Wing: deep brick piers and pointed stone crowns frame the open Gothic gallery.
 k.box('stone',8,13.8,-48.5,36,4.4,8.6);
 for(let u=-7;u<26;u+=3.3){
  k.box('masonry',u,18.1,-44.45,1.02,4.35,1.8);
  // Deep splayed arch spandrels; the centre remains a real opening at both LODs.
  const s=new THREE.Shape([new THREE.Vector2(-1.2,0),new THREE.Vector2(1.2,0),new THREE.Vector2(1.2,2.36),new THREE.Vector2(0,3.85),new THREE.Vector2(-1.2,2.36)]);
  const h=new THREE.Path([new THREE.Vector2(-.95,0),new THREE.Vector2(.95,0),new THREE.Vector2(.95,2.29),new THREE.Vector2(0,3.44),new THREE.Vector2(-.95,2.29)]);s.holes.push(h);k.shape('masonry',s,u+1.65,-43.68,18.05,.9,0,true);
  k.box('trim',u,22.4,-44.45,1.15,.28,1.9);
  k.box('trim',u,22.66,-44.38,.76,1.0,.9);k.cyl('trim',u,-44.38,23.65,2.35,.58,0,4);
  if(near){
   for(const y of [19.0,20.45,21.7])k.box('trim',u,y,-43.49,1.18,.16,.2);
   for(const y of [24.0,24.55,25.05]){k.box('trim',u,y,-44.38,.7,.16,.7);}
  }
 }
 k.hip(-10,26.5,-53,-44.5,22.47,1.5);k.box('trim',8,17.78,-43.86,36.4,.3,.55);
 // Carillon tower: open pillared belfry and visible bells under a broad hip.
 k.box('stone',-39,13.8,15,8,9.2,8);k.box('trim',-39,22.8,15,8.5,.5,8.5);
 for(const u of [-42.3,-39,-35.7])for(const v of [11.7,18.3])k.box('trim',u,23.3,v,.55,4.4,.55);
 for(const v of [13.9,16.1])for(const u of [-42.3,-35.7])k.box('trim',u,23.3,v,.55,4.4,.55);
 for(const u of [-40.5,-37.5]){k.cyl('iron',u,15,24,1.25,.66,.25,near?12:6);k.bar('iron',[u,25.25,15],[u,26.7,15],.14);}
 k.hip(-43.5,-34.5,10.5,19.5,27.7,1.8);k.bar('iron',[-39,29.5,15],[-39,30.2,15],.1);
 for(const v of [11,19])k.rail(-43,v,-35,v,23.35);for(const u of [-43,-35])k.rail(u,11,u,19,23.35);
 for(const y of [16,19.2])k.window(-39,19.02,y,.7,1.65);
 function dome(u,v,base,r,rise,m){const count=near?12:6,profile=Array.from({length:count},(_,i)=>{const t=i/(count-1)*Math.PI/2;return [Math.max(.04,r*Math.cos(t)),base+rise*Math.sin(t)];});profile.push([0,base+rise]);k.lathe(m,u,v,profile,near?32:16);}
 // Northwest Amistad dome: octagonal stone base, blue glazed crown and lantern.
 k.cyl('stone',-43.4,-54.8,14,7.2,6.2,6.2,8);k.cyl('trim',-43.4,-54.8,21.05,.4,6.35,6.35,8);dome(-43.4,-54.8,21.45,5.8,4,'tile');
 if(near)for(let i=0;i<16;i++){const a=i*2*Math.PI/16;for(let j=0;j<4;j++){const t0=j*Math.PI/8,t1=(j+1)*Math.PI/8;k.bar('trim',[-43.4+5.85*Math.cos(t0)*Math.cos(a),21.49+4.02*Math.sin(t0),-54.8+5.85*Math.cos(t0)*Math.sin(a)],[-43.4+5.85*Math.cos(t1)*Math.cos(a+.06),21.49+4.02*Math.sin(t1),-54.8+5.85*Math.cos(t1)*Math.sin(a+.06)],.14);}}
 for(let i=0;i<8;i++){const a=i*Math.PI/4;k.box('trim',-43.4+1.45*Math.cos(a),25.45,-54.8+1.45*Math.sin(a),.32,1.65,.32);}
 k.cyl('trim',-43.4,-54.8,27.1,.22,1.7,1.7,8);dome(-43.4,-54.8,27.32,1.5,1.2,'tile');k.cyl('trim',-43.4,-54.8,28.52,1,.4,0,8);
 for(const u of [-48.1,-38.7])for(const v of [-59.5,-50.1])k.pinnacle(u,v,21.2,2.8);
 for(const y of [2,6.3,10.6,15.3]){k.window(-43.4,-60.58,y,3.1,3.4,Math.PI,y===6.3);k.window(-49.18,-54.8,y,3.1,3.4,-Math.PI/2,y===10.6);}
 // Carmel tower: tall arched octagonal drum, projecting corner pinnacles and elongated tile dome.
 k.cyl('stone',44,-54,14,5.7,5.8,5.8,8);
 k.cyl('trim',44,-54,19.55,.3,6,6,8);
 for(let i=0;i<8;i++){
  const a=(i+.5)*Math.PI/4,nx=Math.sin(a),nz=Math.cos(a);
  k.arch('trim',44+5.40*nx,-54+5.40*nz,19.7,3.3,4.45,.24,.55,a);
  const c=i*Math.PI/4;
  k.box('stone',44+5.8*Math.sin(c),19.65,-54+5.8*Math.cos(c),.7,4.9,.7);
 }
 k.cyl('trim',44,-54,24.38,.35,6,6,8);
 dome(44,-54,24.7,5.5,7.2,'roof');
 for(let i=0;i<8;i++){const a=i*Math.PI/4;k.pinnacle(44+5.85*Math.cos(a),-54+5.85*Math.sin(a),24.5,2.7);}
 k.cyl('trim',44,-54,31.9,.7,.43,.13,8);
 // Smaller roof court pavilion, directly supported on a terrace within the courtyard.
 k.cyl('stone',15,-32,0,10.7,4.1,4.1,near?24:12);
 for(let i=0;i<8;i++){const a=i*Math.PI/4;k.window(15+4.06*Math.cos(a),-32+4.06*Math.sin(a),7,1.1,2.6,-a-Math.PI/2,i%3===0);}
 dome(15,-32,10.7,4.5,2.8,'roof');k.cyl('trim',15,-32,13.5,.7,.5,.35,8);dome(15,-32,14.2,.7,.8,'tile');
 // Window rhythm and supported balconies on the exterior and Spanish Patio.
 function facade(u0,u1,v,angle=0,step=4){let i=0;for(let u=u0;u<=u1;u+=step,i++)for(let row=0;row<3;row++){
  const x=angle?v:u,z=angle?u:v,y=1.6+row*4.1;k.window(x,z,y,1.8,2.8,angle,(i+row)%5===0,near||(row===1&&i%2===0));
  if(near&&row===1&&i%2===0){const nx=Math.sin(angle),nz=Math.cos(angle),tx=Math.cos(angle),tz=-Math.sin(angle);k.box('trim',x+nx*.48,y-.25,z+nz*.48,2.6,.22,1.15,angle);k.rail(x+nx*.98-tx*1.25,z+nz*.98-tz*1.25,x+nx*.98+tx*1.25,z+nz*.98+tz*1.25,y);k.bar('trim',[x,y-1,z],[x+nx*.8,y-.3,z+nz*.8],.3);}
 }}
 // Attach each window to its actual mapped edge, including skew and shallow setbacks.
 const ring=mappedPlan(FOOTPRINTS[0]);let area=0;for(let i=1;i<ring.length;i++)area+=ring[i-1][0]*ring[i][1]-ring[i][0]*ring[i-1][1];
 for(let i=1;i<ring.length;i++){
  const [a,c]=[ring[i-1],ring[i]],du=c[0]-a[0],dv=c[1]-a[1],len=Math.hypot(du,dv);if(len<6)continue;
  const nx=(area>0?1:-1)*dv/len,nz=(area>0?-1:1)*du/len,angle=Math.atan2(nx,nz),count=Math.floor(len/5);
  for(let j=0;j<count;j++)for(let row=0;row<3;row++){
   if(!near&&j%2===1)continue;
   const t=(j+.5)/count,x=a[0]+du*t+nx*.07,z=a[1]+dv*t+nz*.07,y=1.6+row*4.1;
   const courtFront=Math.abs(z+9.6)<1.2||(x>-32&&x<-29&&z>0)||(x>30&&x<35&&z>0);
   k.window(x,z,y,1.8,2.8,angle,(j+row)%5===0,near&&courtFront);
   if(near&&row===1&&j%3===0){const tx=Math.cos(angle),tz=-Math.sin(angle);k.box('trim',x+nx*.48,y-.25,z+nz*.48,2.6,.22,1.15,angle);k.rail(x+nx*.98-tx*1.25,z+nz*.98-tz*1.25,x+nx*.98+tx*1.25,z+nz*.98+tz*1.25,y);k.bar('trim',[x,y-1,z],[x+nx*.8,y-.3,z+nz*.8],.3);}
  }
 }
 facade(-6,22,-43.1,0,3.5);facade(-40,-22,25.1,-Math.PI/2);
 // Projecting two-storey Spanish Patio walkways and individual east-side balconies.
 for(const y of [5.65,9.75]){
  k.box('trim',8,y-.32,-42.4,33,.28,1.45);
  k.rail(-8.4,-41.73,24.4,-41.73,y,'iron');
  for(const u of [-7.7,.4,8.5,16.6,23.8]){
   k.bar('trim',[u,y-1.4,-43.04],[u,y-.35,-41.8],.3);
   if(!near)k.box('iron',u,y,-41.73,.07,1,.07);
  }
 }
 for(const v of [-38.6,-30.6,-22.6])for(const y of [5.65,9.75]){
  k.box('trim',24.42,y-.32,v,1.45,.28,2.7);
  k.rail(23.74,v-1.3,23.74,v+1.3,y);
  if(near){k.rail(23.74,v-1.3,25.0,v-1.3,y);k.rail(23.74,v+1.3,25.0,v+1.3,y);}
  k.bar('trim',[25.02,y-1.4,v],[23.85,y-.35,v],.3);
 }

 for(let u=-6;u<25;u+=3.5)k.window(u,-44.12,14.6,1.5,2.6,0,u===8,near||Math.abs(u-8)<2);
 // Entrance court fronts have the same projecting balcony rhythm, visible from the avenue.
 for(const y of (near?[5.65,9.75]:[9.75])){
  k.box('trim',1.6,y-.32,-9.15,55,.28,1.0);
  k.rail(-25.8,-8.61,29.0,-8.61,y,'iron',1.2);
  for(const u of [-25.4,-8,10,28.5]){
   if(near)k.bar('trim',[u,y-1.4,-9.75],[u,y-.35,-8.7],.28);
   else k.box('iron',u,y,-8.61,.07,1,.07);
  }
 }
 // Scalloped mission entrance screen with three pierced bell openings and a full-height gateway.
 const gate=new THREE.Shape();gate.moveTo(-9,0);gate.lineTo(9,0);gate.lineTo(9,4.0);gate.lineTo(5,4.0);gate.lineTo(4.1,5.6);gate.lineTo(2.5,5.6);gate.absarc(0,5.6,2.5,0,Math.PI,false);gate.lineTo(-4.1,5.6);gate.lineTo(-5,4.0);gate.lineTo(-9,4.0);gate.closePath();
 const door=k.archShape(5.8,3.5);gate.holes.push(new THREE.Path(door.getPoints(8)));
 for(const [x,y] of [[-6.7,2.9],[6.7,2.9],[0,5.1]]){const h=k.archShape(1.2,1.65);gate.holes.push(new THREE.Path(h.getPoints(6).map(p=>p.add(new THREE.Vector2(x,y)))));}
 k.shape('stone',gate,-16,2.55,0,.6);
 for(const [x,y]of [[-22.7,3.4],[-9.3,3.4],[-16,5.6]]){k.cyl('iron',x,2.2,y,.65,.4,.18,near?10:6);k.bar('iron',[x,y+.65,2.2],[x,y+1.05,2.2],.08);}

 for(const y of [4.9,9,13.65]){k.box('trim',-23.7,y,-63.43,53.4,.2,.3);k.box('trim',27.5,y,-61.0,43,.2,.3);k.box('trim',-47.2,y,6.3,.3,.2,61.5);k.box('trim',49.2,y,2.5,.3,.2,54.8);}
 for(let v=-50;v<-28;v+=4.3){k.box('stone',51.45,0,v,.8,7,.8);k.box('stone',51.32,7,v,.55,4,.7);k.box('trim',51.32,10.95,v,.6,.22,.8);}
 if(near){
  for(let v=-22;v<34;v+=.8){k.bar('roof',[-46.2,18.03,v],[-38.75,20.30,v],.15);k.bar('roof',[-38.75,20.30,v],[-31.3,18.03,v],.15);}
  for(let u=-25;u<31;u+=.8){k.bar('roof',[u,17.99,-16.6],[u,19.4,-13.65],.15);k.bar('roof',[u,19.4,-13.65],[u,17.99,-10.7],.15);}
  for(let u=-47;u<3;u+=1.15)k.box('wood',u,13.4,-63.6,.18,.5,.45);for(let u=7;u<49;u+=1.15)k.box('wood',u,13.4,-61.0,.18,.5,.45);
 }
 const model=b.finish();model.traverse(o=>{
  if(!o.isMesh)return;
  o.geometry.deleteAttribute('bridgeLift');
  // Reuse identical exported position/normal tuples; triangles and flat/sharp normals stay intact.
  const original=o.geometry;o.geometry=mergeVertices(original,1e-7);original.dispose();
 });return model;
}
