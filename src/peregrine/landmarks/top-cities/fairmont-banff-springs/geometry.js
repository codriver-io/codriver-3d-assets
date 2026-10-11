import * as THREE from 'three';
import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';
import { FOOTPRINTS } from './footprint.js';
import { BLOCKS, world, local, surfaces } from './fairmont-banff-springs-parts.js';

export function create({detail='near'}={}) {
 const near=detail==='near',b=assetBuilder({...SPEC,palette:PALETTES.light},detail),k=surfaces(b);
 const ring=FOOTPRINTS[0].slice(0,-1).map(local);
 let area=0;for(let i=0;i<ring.length;i++){const p=ring[i],q=ring[(i+1)%ring.length];area+=p[0]*q[1]-q[0]*p[1];}
 const box=(m,u,y,v,w,h,d)=>{const g=new THREE.BoxGeometry(w,h,d);g.rotateY(-Math.PI/2+29*Math.PI/180);g.translate(...world(u,y,v));b.put(g,m);};
 const covered=(u,v,y,skip)=>BLOCKS.some((r,i)=>i!==skip&&u>r[0]-.01&&u<r[1]+.01&&v>r[2]-.01&&v<r[3]+.01&&y<r[4]);
 const window=(p,t,n,s,y,w=1.5,h=2.25,seed=0)=>{
  if(near){
   // Four stone jamb/lintel strips, dark panes and recessed cross muntin.
   k.panel('trim',p,t,n,s-w/2-.18,s-w/2,y-.18,y+h+.18,.12);
   k.panel('trim',p,t,n,s+w/2,s+w/2+.18,y-.18,y+h+.18,.12);
   k.panel('trim',p,t,n,s-w/2,s+w/2,y-.18,y,.12);
   k.panel('trim',p,t,n,s-w/2,s+w/2,y+h,y+h+.18,.12);
  }
  k.panel(seed%7<2?'glow':'glass',p,t,n,s-w/2,s+w/2,y,y+h,.21);
  if(near){k.panel('trim',p,t,n,s-.055,s+.055,y,y+h,.29);k.panel('trim',p,t,n,s-w/2,s+w/2,y+h*.65-.05,y+h*.65+.05,.29);}
 };
 const facade=(p,q,y0,y1,n,skip=-1)=>{
  const L=Math.hypot(q[0]-p[0],q[1]-p[1]),t=[(q[0]-p[0])/L,(q[1]-p[1])/L];
  k.quad('stone',[p[0],y0,p[1]],[q[0],y0,q[1]],[q[0],y1,q[1]],[p[0],y1,p[1]],[n[0],0,n[1]]);
  const pitch=3.6,cols=Math.floor(L/pitch);const step=near?3.6:7.2;
  for(let y=Math.max(y0+2,2);y+2.6<y1;y+=step)for(let i=0;i<cols;i++){
   const s=(i+.5)*L/cols,u=p[0]+t[0]*s+n[0]*.3,v=p[1]+t[1]*s+n[1]*.3;
   if(!covered(u,v,y+1,skip))window(p,t,n,s,y,near?1.5:1.25,near?2.25:3.8,i+Math.round(y));
  }
  if(near)for(let y=y0+.7;y<y1-.6;y+=1.05)for(let i=0;i<Math.floor(L/2.5);i++){
   const s=(i+.5+(Math.round(y)%2)*.28)*2.5;if(s>L-1)continue;
   const u=p[0]+t[0]*s+n[0]*.35,v=p[1]+t[1]*s+n[1]*.35;
   if(!covered(u,v,y,skip)&&((i+Math.round(y*2))%5===0))k.panel('ashlar',p,t,n,s-.72,s+.72,y,y+.38,.055);
  }
  for(const y of [y1-.6,Math.min(y1-1,7.8)])if(y>y0){
   // Belts are suppressed where another block covers this face.
   for(let s=0;s<L;s+=2){const mid=s+Math.min(2,L-s)/2;if(!covered(p[0]+t[0]*mid+n[0]*.3,p[1]+t[1]*mid+n[1]*.3,y,skip))k.panel('trim',p,t,n,s,Math.min(L,s+2),y,y+.3,.18);}
  }
 };
 // The complete mapped lower envelope, rather than a rectangular site slab.
 for(let i=0;i<ring.length;i++){
  const p=ring[i],q=ring[(i+1)%ring.length],L=Math.hypot(q[0]-p[0],q[1]-p[1]);if(L<.01)continue;
  const sign=Math.sign(area),n=[sign*(q[1]-p[1])/L,-sign*(q[0]-p[0])/L];facade(p,q,0,7,n);
 }k.cap('roof',ring,7);
 const roof=(r,idx)=>{
  const [a,c,d,f,h,rise,dir]=r,midU=(a+c)/2,midV=(d+f)/2;
  if(dir==='u'){
   const inset=Math.min((c-a)/4,5),l=a+inset,rr=c-inset;
   k.quad('roof',[a,h,d],[c,h,d],[rr,h+rise,midV],[l,h+rise,midV],[0,1,-1]);
   k.quad('roof',[a,h,f],[c,h,f],[rr,h+rise,midV],[l,h+rise,midV],[0,1,1]);
   k.tri('roof',[a,h,d],[a,h,f],[l,h+rise,midV],[-1,1,0]);k.tri('roof',[c,h,d],[c,h,f],[rr,h+rise,midV],[1,1,0]);
  }else{
   k.quad('roof',[a,h,d],[a,h,f],[midU,h+rise,f-4],[midU,h+rise,d+4],[-1,1,0]);
   k.quad('roof',[c,h,d],[c,h,f],[midU,h+rise,f-4],[midU,h+rise,d+4],[1,1,0]);
   for(const [v,n] of [[d,-1],[f,1]]){
    k.tri('roof',[a,h,v],[c,h,v],[midU,h+rise-1,v],[0,0,n]);
    k.tri('roof',[a,h,v],[midU,h+rise-1,v],[midU,h+rise,v-n*4],[0,1,n]);
    k.tri('roof',[c,h,v],[midU,h+rise-1,v],[midU,h+rise,v-n*4],[0,1,n]);
    // Two-tiered gable windows, edging and apex finial.
    for(const du of [-3,3]){const center=(c-a)/2+du; k.panel('stone',[a,v],[1,0],[0,n],center-1.55,center+1.55,h+.4,h+4.7,.07);window([a,v],[1,0],[0,n],center,h+1.2,2.1,2.7,idx);k.tri('trim',[a+center-1.6,h+4.7,v+n*.12],[a+center+1.6,h+4.7,v+n*.12],[a+center,h+6.1,v+n*.12],[0,0,n]);}
    k.panel('stone',[a,v],[1,0],[0,n],(c-a)/2-1.3,(c-a)/2+1.3,h+6.5,h+9.2,.075);window([a,v],[1,0],[0,n],(c-a)/2,h+6.9,1.5,1.9,idx+1);
    for(const u of [a,c])b.bar('trim',world(u,h,v),world(midU,h+rise-1,v),.32);
    box('metal',midU,h+rise-.15,v-n*3.5,.16,.3,.16);
   }
  }
  // Dormers share a deterministic roof profile; retain every second one far.
  const along=dir==='u'?c-a:f-d,across=dir==='u'?f-d:c-a;
  const spacing=near?4.7:9.4;
  for(let s=6;s<along-5;s+=spacing)for(const side of [-1,1]){
   const off=across*.29,base=h+rise*(1-2*off/across),u=dir==='u'?a+s:midU+side*off,v=dir==='u'?midV+side*off:d+s;
   const p=dir==='u'?[u-1.05,v]:[u,v-1.05],t=dir==='u'?[1,0]:[0,1],n=dir==='u'?[0,side]:[side,0];
   window(p,t,n,1.05,base+.1,1.4,1.6,Math.round(s));
   // Closed cheek/roof wedge embedded in the slope.
   const pt=(x,y,z)=>[p[0]+t[0]*x+n[0]*z,y,p[1]+t[1]*x+n[1]*z];
   k.quad('roof',pt(0,base+1.9,.25),pt(2.1,base+1.9,.25),pt(2.1,base+2.3,-1.8),pt(0,base+2.3,-1.8),[0,1,0]);
   k.quad('stone',pt(0,base,.25),pt(0,base+1.9,.25),pt(0,base+2.3,-1.8),pt(0,base,-1.8),[-t[0],0,-t[1]]);
   k.quad('stone',pt(2.1,base,.25),pt(2.1,base+1.9,.25),pt(2.1,base+2.3,-1.8),pt(2.1,base,-1.8),[t[0],0,t[1]]);
   k.panel('stone',p,t,n,0,2.1,base,base+1.9,.1);
  }
 };
 BLOCKS.forEach((r,i)=>{
  const [a,c,d,f,h]=r;
  facade([a,d],[c,d],7,h,[0,-1],i);facade([c,d],[c,f],7,h,[1,0],i);facade([c,f],[a,f],7,h,[0,1],i);facade([a,f],[a,d],7,h,[-1,0],i);roof(r,i);
  if(near&&i<5){for(const u of [a+.18,c-.18])for(const v of [d+.18,f-.18])for(let y=8;y<h-1;y+=1.6)box('trim',u,y,v,.48,.6,.48);}
 });
 for(const idx of [2,3,4]){const [a,c,d,f,h,rise]=BLOCKS[idx];for(const side of [-1,1])for(let v=d+10;v<f-7;v+=near?6:12){const u=(a+c)/2+side*(c-a)*.15, y=h+rise*.7;const p=[u,v-1],t=[0,1],n=[side,0];k.panel('stone',p,t,n,0,2,y,y+1.7,.1);window(p,t,n,1,y+.1,1.3,1.4,idx);k.quad('roof',[u,y+1.8,v-1],[u,y+1.8,v+1],[u-side*1.6,y+2.5,v+1],[u-side*1.6,y+2.5,v-1],[0,1,0]);}}
 // Corbelled polygonal turrets on the three dominant pavilion shoulders.
 for(const idx of [2,3,4]){
  const [a,c,d,f,h]=BLOCKS[idx];
  for(const u of [a+1.6,c-1.6])for(const v of [d+1.6,f-1.6]){
   const seg=near?10:6,r=1.5,shaftTop=h+3.3;
   const g=new THREE.CylinderGeometry(r,r*.72,6.3,seg);g.translate(...world(u,shaftTop-3.15,v));b.put(g,'stone');
   // The rotated cylinder must also translate in the baked frame.
   const cap=new THREE.ConeGeometry(r+0.1,5,seg);cap.rotateY(.1);cap.translate(...world(u,shaftTop+2.5,v));b.put(cap,'roof');
  }
 }
 // Chimneys penetrate slopes rather than hovering above them.
 for(const u of [-51,-35,-20,20,35,52]){box('stone',u,36,-1,1.5,7,2);box('trim',u,39.5,-1,1.9,.4,2.4);}
 // Main tower pinnacle fixes the published height.
 box('metal',0,59.1,-29,.18,.8,.18);
 // Open porte-cochere: columns and raised canopy, actual drivable void underneath.
 for(const u of [-5,5])for(const v of [-35,-40])box('trim',u,2.65,v,.65,5.3,.65);
 box('roof',0,5.5,-37.5,12,.4,7);
 // Wide arched ground-floor windows in the ballroom spur.
 if(near)for(let u=102;u<132;u+=4)window([99,18],[1,0],[0,-1],u-99,8,2,2.5,Math.round(u));
 k.flush();return b.finish();
}
