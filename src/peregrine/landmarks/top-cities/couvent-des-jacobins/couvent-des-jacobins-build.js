import { FOOTPRINTS } from './footprint.js';
import { SPEC } from './config.js';
import { THETA,TOWER,BAY_U } from './couvent-des-jacobins-plan.js';
const rect=(w,h)=>[[-w/2,0],[w/2,0],[w/2,h],[-w/2,h]];
const shifted=(p,x,y)=>p.map(([a,b])=>[a+x,b+y]);
const W={x:-40.65,z:0.7,angle:-Math.PI/2};
const S={x:0,z:11.65,angle:0};
const N={x:0,z:-10.45,angle:Math.PI};

function tallWindow(k,f,a,y,w,h,offset=-.68) {
  k.panel('glass',k.pointed(w,h),f,a,y,offset);
  k.arch('trim',w+.32,h+.17,.18,f,a,y-.06,offset+.12);
  for(const x of [-w/6,w/6]) k.faceBar('trim',f,a+x,y+(h-.7*w)/2,offset+.2,.12,h-.7*w);
  if(k.near){
    for(let dy=1;dy<h-.8*w;dy+=1.1)k.faceBar('recess',f,a,y+dy,offset+.31,w-.14,.055,.16);
    // Two subdivided lights and a small tracery wheel below the arch tip.
    for(const x of [-w/4,w/4])k.arch('trim',w*.44,w*.9,.10,f,a+x,y+h-w*.9-.4,offset+.2);
    k.ring('trim',.20,.29,f,a,y+h-.58,offset+.23);
  }
}
function sideWall(k,f,sign) {
  const center=-6.825, width=67.65;
  const holes=BAY_U.map(u=>shifted(k.pointed(7.45,17.0),u*sign,9.35));
  k.solid('brick',rect(width,28),1.1,f,sign*center,0,0,holes.map(p=>p.map(([x,y])=>[x-sign*center,y])));
  for(const u of BAY_U){
    const a=sign*u;
    k.panel('brick',k.pointed(7.43,16.97),f,a,9.36,-.92);
    k.arch('trim',7.49,17.03,.23,f,a,9.34,.12);
    tallWindow(k,f,a,11.1,3.65,12.4,-.72);
    k.panel('recess',k.pointed(1.8,5.4),f,a,2.25,.065);
    if(k.near)k.arch('trim',2.06,5.57,.18,f,a,2.21,.17);
    k.faceBar('trim',f,a,4.4,.21,.14,4.15);
    k.circle('recess',.42,f,a,27.22,.07);
    if(k.near)k.ring('trim',.42,.59,f,a,27.22,.12);
  }
  // Tapered buttresses step inward at the mid-height weatherings.
  for(let i=0;i<=7;i++){
    const u=-40.4+i*9.4;
    const v=sign===1?12.42:-11.42;
    k.box('brick',u,4.4,v,1.17,8.8,1.56);
    k.box('brick',u,17.85,v-sign*.22,1.03,18.1,1.12);
    k.box('trim',u,9.075,v-sign*.03,1.22,.25,1.42);
    k.box('trim',u,26.85,v-sign*.15,1.15,.24,1.10);
    k.cone('roof',u,v-sign*.2,27,29.5,.72,4);
    if(k.near)for(let y=1.15;y<26;y+=.46)k.panel('trim',rect(1.08,.024),f,sign*u,y,.82);
  }
  k.faceBar('trim',f,center*sign,28.12,.23,width,.3,.4);
}
function westFront(k) {
  const h=28.85;
  k.solid('brick',rect(22.1,h),1.5,W,0,0,0,[-5.4,5.4].map(a=>shifted(k.pointed(8.7,20.4),a,6.25)));
  for(const a of [-5.4,5.4]){
    k.panel('brick',k.pointed(8.68,20.38),W,a,6.26,-1.15);
    k.arch('trim',8.72,20.43,.28,W,a,6.24,.11);
    tallWindow(k,W,a,8.8,2.9,5.7,-.93);
    k.circle('glow',1.25,W,a,20.9,-.92);
    k.ring('trim',1.25,1.51,W,a,20.9,-.71);
    const count=k.near?12:6;
    for(let i=0;i<count;i++){
      const t=i*Math.PI*2/count;
      // rose spokes in the west-facing plane
      k.bar('trim',[-41.50,20.9+Math.cos(t)*.25,.7+a+Math.sin(t)*.25],[-41.50,20.9+Math.cos(t)*1.23,.7+a+Math.sin(t)*1.23],.09,.10);
    }
    k.circle('recess',.43,W,a,27.7,.07);
    if(k.near)k.ring('trim',.43,.61,W,a,27.7,.13);
  }
  k.panel('recess',k.pointed(3.5,5.6),W,0,0,.07);
  for(let i=0;i<3;i++)k.arch('trim',3.8+i*.40,5.85+i*.18,.17,W,0,0,.17+i*.11);
  k.faceBar('brick',W,0,17.8,.47,1.18,22.0,1.0);
  for(const a of [-10.5,0,10.5]){
    if(a)k.faceBar('brick',W,a,14.6,.38,1.0,29.2,.9);
    // Octagonal turret shafts and eight-sided tile spires, visible in both LODs.
    const u=-40.65,v=a+.7,flat=a?.90:1.00,top=a?32.4:34.0;
    const radius=flat/Math.cos(Math.PI/8);
    const oct=Array.from({length:8},(_,i)=>{const t=Math.PI/8+i*Math.PI/4;return [u+radius*Math.sin(t),v+radius*Math.cos(t)];});
    k.prism('brick',oct,a?27.7:28.4,top);
    for(let i=0;i<8;i++){
      const angle=i*Math.PI/4;
      const f={x:u+Math.sin(angle)*flat,z:v+Math.cos(angle)*flat,angle};
      k.panel('recess',k.pointed(.43,1.92),f,0,top-2.3,.065);
      k.arch('trim',.57,2.06,.075,f,0,top-2.34,.17);
      k.faceBar('trim',f,0,top-.10,.10,2*flat*Math.tan(Math.PI/8),.15,.16);
    }
    k.cone('roof',u,v,top-.015,a?36.5:38.5,radius+.035,8);
  }
  k.faceBar('trim',W,0,28.97,.29,22.1,.32,.55);
  // Open-looking corbel frieze: deeply contrasting apertures at the roofline.
  for(let i=0;i<28;i++){
    const a=-9.9+i*.735;
    k.panel('recess',k.pointed(.34,.54),W,a,28.12,.065);
    if(k.near)k.faceBar('trim',W,a,27.95,.16,.19,.18);
  }
}
function apse(k) {
  const ring=[[27,-10.3],[31.9,-8.0],[35.0,-9.9],[38.65,-5.2],[39.15,.5],[38.55,6.0],[35.0,11.45],[32.3,9.8],[27,11.65]];
  // Each polygon face has the same deep lancet rhythm as the long nave.
  for(let i=0;i<ring.length-1;i++){
    const [a,b]=[ring[i],ring[i+1]],dx=b[0]-a[0],dz=b[1]-a[1];
    const w=Math.hypot(dx,dz),angle=Math.atan2(dz,-dx);
    const f={x:(a[0]+b[0])/2,z:(a[1]+b[1])/2,angle};
    const ww=Math.min(4.8,w-1.3);
    k.solid('brick',rect(w,28),1.0,f,0,0,0,[shifted(k.pointed(ww,17),0,9.35)]);
    k.panel('brick',k.pointed(ww-.02,16.98),f,0,9.36,-.86);
    k.arch('trim',ww+.08,17.03,.23,f,0,9.34,.10);
    tallWindow(k,f,0,9.65,Math.min(2.7,w-1.8),15,-.65);
    k.circle('recess',.40,f,0,27.2,.07);
    if(k.near)k.ring('trim',.4,.56,f,0,27.2,.12);
    k.faceBar('trim',f,0,28.12,.17,w,.3,.38);
  }
  for(const [x,z] of ring.slice(1,-1)){
    k.box('brick',x,13.75,z,.83,27.5,.84);k.cone('roof',x,z,27.5,29.6,.56,4);
  }
  k.fan('roof',ring,28.3,[27,32,.60]);
  // Small eastern annex, retained in the church relation; its domed roof is an estimate.
  k.prism('brick',[[39.0,-4.4],[43.45,-4.4],[43.8,3.8],[39.0,3.8]],0,8.9);
  const dome=[];for(let i=0;i<8;i++){let t=i*Math.PI/4;dome.push([41.35+Math.cos(t)*2.05,-.3+Math.sin(t)*3.9]);}
  k.fan('roof',dome,9.0,[41.35,12.8,-.3]);
  k.cyl('stone',41.35,-.3,12.8,13.7,.33,6);k.cone('roof',41.35,-.3,13.7,14.25,.55,6);
}
function tower(k) {
  const {u,v,flat}=TOWER;const r=flat/Math.cos(Math.PI/8);
  const poly=Array.from({length:8},(_,i)=>{const a=Math.PI/8+i*Math.PI/4;return [u+r*Math.sin(a),v+r*Math.cos(a)];});
  k.prism('brick',poly,0,19.98);
  for(let tier=0;tier<4;tier++){
    const tierFlat=[3.74,3.65,3.55,3.44][tier];
    const side=2*tierFlat*Math.tan(Math.PI/8);
    const tierPoly=poly.map(([x,z])=>[u+(x-u)*tierFlat/flat,v+(z-v)*tierFlat/flat]);
    const base=20+tier*5.5;
    k.prism('brick',tierPoly,base+.035,base+.25);
    for(let i=0;i<8;i++){
      const angle=i*Math.PI/4;
      const f={x:u+Math.sin(angle)*tierFlat,z:v+Math.cos(angle)*tierFlat,angle};
      const holes=[-.75,.75].map(a=>shifted(k.pointed(1.12,3.92,true),a,.55));
      k.solid('brick',rect(side,5.48),.52,f,0,base,0,holes);
      for(const a of [-.75,.75]){
        k.arch('trim',1.48,4.14,.18,f,a,base+.51,.16,true);
        if(k.near)k.arch('trim',1.16,3.94,.065,f,a,base+.55,-.16,true);
        k.faceBar('trim',f,a,base+.57,.24,1.45,.16,.23);
      }
      k.faceBar('trim',f,0,base+5.28,.16,side+.12,.22,.30);
      // Projecting corner ribs join the cornices instead of floating separately.
      k.faceBar('trim',f,-side/2+.07,base+2.9,.16,.14,5.22,.26);
      if(k.near){
        k.faceBar('recess',f,0,base+4.78,.065,.30,.25);
        for(const a of [-side*.34,side*.34])k.faceBar('trim',f,a,base+5.04,.23,.14,.29,.28);
      }
    }
  }
  const crownFlat=3.98,crownRadius=crownFlat/Math.cos(Math.PI/8),side=2*crownFlat*Math.tan(Math.PI/8);
  const crownPoly=poly.map(([x,z])=>[u+(x-u)*crownFlat/flat,v+(z-v)*crownFlat/flat]);
  // Broad corbelled crown returns outward above the tapering four tiers.
  k.frustum('brick',u,v,41.55,42.10,3.44,crownFlat);
  for(let i=0;i<8;i++){
    const a=i*Math.PI/4;const f={x:u+Math.sin(a)*crownFlat,z:v+Math.cos(a)*crownFlat,angle:a};
    k.solid('brick',rect(side,1.20),.34,f,0,42.10,0,[-1.0,0,1.0].map(x=>shifted(k.pointed(.64,1.04),x,.025)));
    k.faceBar('trim',f,0,43.32,.15,side,.18,.35);
    const [px,pz]=crownPoly[i],x=u+(px-u)*.96,z=v+(pz-v)*.96;
    k.box('trim',x,43.56,z,.46,.78,.46);k.cone('trim',x,z,43.93,45,.48,8);
  }

}
export function buildChurch(k) {
  sideWall(k,S,1);sideWall(k,N,-1);westFront(k);apse(k);tower(k);
  k.roof('roof',-40.5,27,-10.42,11.62,28.3,32);
  // Low chapel aisle is continuous along the road, with pointed windows at every bay.
  k.box('brick',-5.4,4.42,12.75,64.0,8.84,1.32);
  for(const u of BAY_U.slice(0,6)){
    const f={x:0,z:13.43,angle:0};
    k.panel('recess',k.pointed(2.1,4.45),f,u,2.8,.065);if(k.near)k.arch('trim',2.38,4.61,.18,f,u,2.76,.17);
  }
  k.roof('roof',-37.35,26.6,12.04,13.42,8.92,9.35);
  if(k.near){
    // Raised tile seam relief reads across the enormous roof, without a texture.
    for(let u=-39.6;u<26.6;u+=1.06){
      k.bar('roof',[u,28.44,-10.32],[u,32.10,.6],.058);
      k.bar('roof',[u,32.10,.6],[u,28.44,11.52],.058);
    }
  }
}
function mappedRing(index){const c=Math.cos(THETA),s=Math.sin(THETA),k=111319.49,lon=k*Math.cos(SPEC.origin[1]*Math.PI/180);return FOOTPRINTS[index].slice(0,-1).map(([lng,lat])=>{const x=(lng-SPEC.origin[0])*lon,z=-(lat-SPEC.origin[1])*k;return [x*c-z*s,x*s+z*c];});}
function hall(k,idx,y,ridge){const ring=mappedRing(idx);k.prism('brick',ring,0,y);const us=ring.map(p=>p[0]),vs=ring.map(p=>p[1]);const u0=Math.min(...us),u1=Math.max(...us),v0=Math.min(...vs),v1=Math.max(...vs);
  // Fan roofs stay inside irregular apses and mapped outlying buttresses.
  k.fan('roof',ring,y+.07,[(u0+u1)/2,ridge,(v0+v1)/2]);
  for(let j=1;j<6;j++){const vv=v0+(v1-v0)*j/6;const f={x:u0-.01,z:0,angle:-Math.PI/2};k.panel('recess',k.pointed(1.2,y*.62),f,vv,2,.055);k.arch('trim',1.45,y*.62+.15,.16,f,vv,1.97,.15);}
}
function gallery(k,u0,u1,v0,v1,axis){
  // 20 bays with pairs of marble colonnettes per side = the documented 160 shafts.
  const bays=k.near?20:10;
  const length=axis==='u'?u1-u0:v1-v0,step=length/bays;
  const across=(t)=>axis==='u'?[u0+t,(v0+v1)/2]:[(u0+u1)/2,v0+t];
  k.box('brick',(u0+u1)/2,.33,(v0+v1)/2,u1-u0,.66,v1-v0);
  for(let i=0;i<bays;i++){
    const [x,z]=across(i*step);
    for(const shift of [-.19,.19]){
      const xx=axis==='u'?x:x+shift,zz=axis==='u'?z+shift:z;
      k.cyl('stone',xx,zz,.66,3.6,k.near?.10:.105,k.near?8:4);
      if(k.near){k.box('stone',xx,.77,zz,.31,.22,.31);k.box('stone',xx,3.55,zz,.33,.28,.34);}
    }
    const f=axis==='u'?{x:0,z:(v0+v1)/2+.43,angle:0}:{x:(u0+u1)/2+.43,z:0,angle:Math.PI/2};
    const a=axis==='u'?x:-z;
    // Arch spans between pair stations; cut out the passage, including the lower edge.
    k.solid('brick',rect(step,1.37),.86,f,a+(axis==='u'?1:-1)*step*.5,3.58,0,[k.pointed(step-.24,1.12)]);
    k.arch('trim',step-.04,1.26,.08,f,a+(axis==='u'?1:-1)*step*.5,3.58,.065);
  }
  // Shed over the four walkways; geometry includes its soffit and end caps.
  k.box('trim',(u0+u1)/2,5.05,(v0+v1)/2,u1-u0,.22,v1-v0);
  (axis==='u'?k.roof:k.roofV)('roof',u0,u1,v0,v1,5.2,6.5);
}
export function buildConvent(k) {
  gallery(k,-45.0,-39.2,-50.8,-12.0,'v');
  gallery(k,-10.4,-4.8,-50.8,-13.5,'v');
  gallery(k,-39.2,-10.4,-18.5,-12.3,'u');
  gallery(k,-39.2,-10.4,-51.1,-45.5,'u');
  hall(k,3,8.4,11.8);hall(k,4,8.7,11.7);hall(k,5,10.8,14.2);hall(k,6,10.2,13.8);
  // Refectory: the mapped enclosure is 51 m; the source's 55 m is an interior historical description.
  const r=mappedRing(7);k.prism('brick',r,0,12.4);
  k.fan('roof',r,12.46,[-5.9,16.0,-77.8]);
  const westA=r[10],westB=r[11],wx=westB[0]-westA[0],wz=westB[1]-westA[1];
  const wf={x:(westA[0]+westB[0])/2,z:(westA[1]+westB[1])/2,angle:Math.atan2(wz,-wx)};
  for(let i=0;i<8;i++){
    const vv=-57.0-i*5.8,a=-(vv-wf.z)/Math.sin(wf.angle);
    k.panel('recess',k.pointed(1.5,6.3),wf,a,3.2,.15);
    k.arch('trim',1.78,6.5,.16,wf,a,3.14,.27);
  }
  const northA=r[11],northB=r[0],nx=northB[0]-northA[0],nz=northB[1]-northA[1];
  const nf={x:(northA[0]+northB[0])/2,z:(northA[1]+northB[1])/2,angle:Math.atan2(nz,-nx)};
  for(const a of [-3.5,0,3.5]){
    k.panel('recess',k.pointed(1.5,6.8),nf,a,3.2,.15);
    k.arch('trim',1.78,7,.16,nf,a,3.14,.27);
  }
  const a0=r[0],a1=r[6];const dx=a1[0]-a0[0],dz=a1[1]-a0[1];
  const f={x:(a0[0]+a1[0])/2,z:(a0[1]+a1[1])/2,angle:Math.atan2(dz,-dx)};
  for(let i=0;i<10;i++){const v=-56.5-i*4.5,a=-(v-f.z)/Math.sin(f.angle);k.panel('glass',k.pointed(1.1,7.4),f,a,3.9,.18);k.arch('trim',1.35,7.58,.17,f,a,3.86,.29);}
}
