import * as THREE from 'three';
import { FOOTPRINTS } from './footprint.js';
import { SPEC } from './config.js';
const A=14*Math.PI/180,C=Math.cos(A),S=Math.sin(A);
export const worldPoint=(u,y,v)=>[u*C-v*S,y,u*S+v*C];
export const localPoint=(x,y,z)=>[x*C+z*S,y,-x*S+z*C];
const box=(b,m,u,y,v,w,h,d,a=0)=>b.box(m,worldPoint(u,y,v),[w,h,d],-A+a);
function put(b,g,m,u=0,y=0,v=0,a=0){g.rotateY(a-A);g.translate(...worldPoint(u,y,v));b.put(g,m);}
function round(b,m,u,y,v,rb,rt,h,n){put(b,new THREE.CylinderGeometry(rt,rb,h,n,1),m,u,y,v);}
function ellipsoid(b,m,u,y,v,sx,sy,sz,near){const g=new THREE.SphereGeometry(1,near?12:8,near?8:5);g.scale(sx,sy,sz);put(b,g,m,u,y,v);}
function beam(b,m,a,c,w,d=w){b.bar(m,worldPoint(...a),worldPoint(...c),w,d);}

export function terrace(b,near){
  const shape=new THREE.Shape(),kx=111319.49*Math.cos(SPEC.origin[1]*Math.PI/180),kz=111319.49;
  const p=FOOTPRINTS[0].slice(0,-1).map(([lng,lat])=>localPoint((lng-SPEC.origin[0])*kx,0,(SPEC.origin[1]-lat)*kz));
  // Stair flights are exterior notches, not holes touching the outer boundary.
  const stairRing=[];
  for(const [u,,v] of p){
    stairRing.push([u,v]);
    if(u>42&&u<43&&v>40) stairRing.push([39.5,v],[39.5,22.9],[25.5,22.9],[25.5,v]);
    if(u < -25 && u > -26 && v > 40) stairRing.push([-25.5,v],[-25.5,22.8],[-39.5,22.8],[-39.5,v]);
  }
  stairRing.forEach(([u,v],i)=>i?shape.lineTo(u,-v):shape.moveTo(u,-v));shape.closePath();
  const notch=new THREE.Shape(),cut=stairRing.findIndex(([u,v])=>u>21&&u<22&&v>47);
  stairRing.forEach(([u,v],i)=>{i?notch.lineTo(u,-v):notch.moveTo(u,-v);if(i===cut){notch.lineTo(12,-v);notch.lineTo(12,-39.2);notch.lineTo(-12,-39.2);notch.lineTo(-12,-47.58);}});notch.closePath();
  const extrude=(s,h,y)=>{const g=new THREE.ExtrudeGeometry(s,{depth:h,bevelEnabled:false,steps:1,curveSegments:1});g.rotateX(-Math.PI/2);put(b,g,'stone',0,y,0);};
  extrude(notch,4.6,0);extrude(shape,2,4.6);
  box(b,'glass',0,2.25,39.28,23.8,4.4,0.18);
  for(let u=-10;u<=10;u+=2)box(b,'bronze',u,2.2,39.42,0.09,4.35,0.12);
  box(b,'trim',0,5,47.56,25,0.25,0.3);
  box(b,'trim',0,6.72,26,20,0.24,15);box(b,'glass',0,6.94,26,18.8,0.2,13.8);
  for(let u=-9;u<=9;u+=near?1.5:3)box(b,'roof',u,7.09,26,0.065,0.09,13.85);
  for(let v=19.3;v<=32.8;v+=near?1.5:3)box(b,'roof',0,7.09,v,18.9,0.09,0.065);
  for(const u of [-32.5,32.5])for(let i=0;i<18;i++)box(b,'trim',u,(i+1)*0.18,40.7-i,13.8,(i+1)*0.36,1.01);
  for(const u of [-73,72.6])box(b,'trim',u,7.1,0,0.6,1,30);
  for(const side of [-1,1]){box(b,'trim',side*52,7.1,-15.9,42,1,0.65);box(b,'trim',side*57,7.1,21.8,29,1,0.65);}
  if(near){for(let y=0.7;y<6;y+=0.72){box(b,'joint',0,y,-22.78,60,0.028,0.035);for(const u of [-32,32])box(b,'joint',u,y,41.25,16,0.028,0.04);}for(let u=-28;u<=28;u+=3)box(b,'joint',u,3.1,-22.8,0.025,5.8,0.035);}
}

export function tower(b,near){
  const y0=SPEC.courtyardY,n=near?64:32;
  round(b,'trim',0,y0+0.22,0,5.72,5.72,0.44,n);
  round(b,'stone',0,y0+32.45,0,5.4864,4.34,64.5,n);
  for(let i=0;i<4;i++){const a=i*Math.PI/2,r=4.75,g=new THREE.CylinderGeometry(0.54,0.72,54,near?10:6,1);g.scale(1,1,1.4);put(b,g,'trim',Math.sin(a)*r,y0+27.4,Math.cos(a)*r,-a);guardian(b,a,near);}
  round(b,'trim',0,y0+64.72,0,4.34,4.2672,0.72,n);
  round(b,'joint',0,y0+65.38,0,4.2672,4.2672,0.6,n);
  round(b,'stone',0,y0+65.74,0,4.2672,4.2672,0.18,n);
  const rail=new THREE.TorusGeometry(4.15,0.075,4,n);rail.rotateX(Math.PI/2);put(b,rail,'bronze',0,y0+66.02,0);
  for(let i=0;i<(near?48:24);i++){const a=i*2*Math.PI/(near?48:24);box(b,'bronze',4.15*Math.sin(a),y0+65.75,4.15*Math.cos(a),0.065,0.55,0.065);}
  round(b,'glow',0,y0+65.88,0,1.35,1.1,0.32,near?24:12);
  round(b,'stone',0,y0+66.1116,0,1.12,1.12,0.06,near?24:12);
  if(near)for(let j=1;j<62;j++){const y=y0+j*0.95,r=5.4864-(y-y0)/64.9*1.1464+0.021,tor=new THREE.TorusGeometry(r,0.015,3,32);tor.rotateX(Math.PI/2);put(b,tor,'joint',0,y,0);}
  box(b,'bronze',0,y0+1.9,5.37,1.8,3.05,0.28);box(b,'trim',0,y0+3.53,5.5,2.1,0.24,0.35);
}

function guardian(b,a,near){
  // Original abstract winged figures; 12.192 m toe-to-wingtip, as published.
  const radial=(t,y,r)=>[Math.cos(a)*t+Math.sin(a)*r,y+5.0,-Math.sin(a)*t+Math.cos(a)*r];
  const p=radial(0,61.35,4.42),robe=new THREE.CylinderGeometry(0.62,0.9,7.6,near?10:6,1);robe.scale(1,1,0.52);put(b,robe,'trim',...p,a);
  ellipsoid(b,'trim',...radial(0,65.76,4.5),0.48,0.63,0.36,near);
  for(const s of [-1,1]){
    const wing=new THREE.Shape();wing.moveTo(s*0.48,60.6);wing.lineTo(s*1.45,62.3);wing.lineTo(s*1.9,67.45);wing.lineTo(s*0.8,65.35);wing.closePath();
    const g=new THREE.ExtrudeGeometry(wing,{depth:0.36,bevelEnabled:false});put(b,g,'trim',Math.sin(a)*4.2,5.0,Math.cos(a)*4.2,a);
    if(near)for(let j=0;j<9;j++)beam(b,'stone',radial(s*(0.87+j*0.1),61.9+j*0.18,4.55),radial(s*(1.07+j*0.1),65+j*0.22,4.55),0.065,0.08);
    beam(b,'trim',radial(s*0.45,63.5,4.72),radial(s*0.78,59.8,4.72),0.32,0.26);
  }
  beam(b,'bronze',radial(0,59.7,4.85),radial(0,54.9,4.85),0.09,0.07);
  beam(b,'trim',radial(-0.42,57.95,4.38),radial(-0.42,55.2584,4.38),0.32,0.28);beam(b,'trim',radial(0.42,57.95,4.38),radial(0.42,55.2584,4.38),0.32,0.28);
}

export function hall(b,u,v,w,d,near){
  const y=SPEC.courtyardY,h=9.6;
  box(b,'stone',u,y+h/2,v,w,h,d);box(b,'trim',u,y+0.25,v,w+0.18,0.7,d+0.18);
  box(b,'trim',u,y+8.85,v,w+0.28,0.32,d+0.28);box(b,'trim',u,y+9.7,v,w+0.42,0.28,d+0.42);box(b,'roof',u,y+9.87,v,w-1.35,0.12,d-1.35);
  for(const sign of [-1,1]){
    box(b,'stone',u,y+10.1,v+sign*(d/2-0.27),w+0.3,0.54,0.55);
    for(let i=0;i<6;i++){
      const x=u+(i-2.5)*3.45,z=v+sign*(d/2+0.08);
      box(b,'glass',x,y+5,z,1.32,4.8,0.18);
      for(const s of [-1,1])box(b,'trim',x+s*0.83,y+5,z+sign*0.08,0.26,5.2,0.18);
      box(b,'trim',x,y+2.42,z+sign*0.1,1.85,0.24,0.34);box(b,'trim',x,y+7.62,z+sign*0.1,1.85,0.3,0.32);
      if(near){for(let j=0;j<5;j++)box(b,'bronze',x,y+3.1+j*0.85,z+sign*0.12,1.25,0.075,0.08);box(b,'bronze',x,y+5,z+sign*0.12,0.07,4.7,0.08);}
    }
    box(b,'glass',u,y+8.18,v+sign*(d/2+0.07),w-1.4,0.56,0.15);
    if(near)for(let i=0;i<38;i++)box(b,'bronze',u-w/2+1.3+i*(w-2.6)/37,y+8.18,v+sign*(d/2+0.18),0.07,0.12,0.04);
  }
  for(const s of [-1,1]){
    const x=u+s*(w/2+0.09);box(b,'bronze',x,y+3,v,0.18,4.8,2.8);box(b,'trim',x+s*0.12,y+5.65,v,0.3,0.35,3.8);
    for(const side of [-1,1]){box(b,'trim',x+s*0.12,y+3.1,v+side*1.77,0.32,5.15,0.48);round(b,'stone',u+s*(w/2-0.1),y+0.4,v+side*4.7,0.85,0.85,0.8,near?12:8);round(b,'trim',u+s*(w/2-0.1),y+1.6,v+side*4.7,0.42,0.8,1.6,near?16:8);round(b,'trim',u+s*(w/2-0.1),y+2.52,v+side*4.7,0.8,0.62,0.3,near?16:8);}
  }
  if(near){for(let i=0;i<Math.floor(w/0.62);i++)for(const s of [-1,1])box(b,'trim',u-w/2+0.5+i*0.62,y+9.26,v+s*(d/2+0.13),0.28,0.28,0.33);for(let row=1;row<12;row++)for(const s of [-1,1])box(b,'joint',u,y+row*0.7,v+s*(d/2+0.06),w-0.2,0.02,0.02);}
}

export function sphinx(b,u,v,sign,near){
  const y=SPEC.courtyardY;box(b,'trim',u,y+0.35,v,9.5,0.7,5.5);box(b,'stone',u,y+1,v,8.7,0.75,4.8);
  ellipsoid(b,'trim',u,y+2.25,v,3.8,1.35,1.9,near);ellipsoid(b,'trim',u+sign*2.1,y+3.3,v,1.25,2.3,1.5,near);
  for(const s of [-1,1]){
    const wing=new THREE.Shape();wing.moveTo(-3.1,0.9);wing.lineTo(-1.5,2.3);wing.quadraticCurveTo(0.1,3,1.4,5.2);wing.quadraticCurveTo(2.4,5.8,2.9,4.1);wing.lineTo(3.65,1.25);wing.closePath();
    const g=new THREE.ExtrudeGeometry(wing,{depth:0.45,bevelEnabled:false,curveSegments:near?10:4});if(sign<0)g.rotateY(Math.PI);put(b,g,'trim',u,y,v+s*1.45);
    if(near)for(let j=0;j<8;j++)beam(b,'stone',[u-sign*2.6+sign*j*0.6,y+1.2,v+s*1.94],[u+sign*(0.6+j*0.17),y+3+j*0.18,v+s*1.94],0.08,0.08);
  }
}

export function frieze(b,near){
  // North wall's sourced 148 x 18 ft frieze; abstract figures, no traced artwork.
  box(b,'joint',0,3.34,-22.72,45.11,5.4864,0.14);
  for(const s of [-1,1])box(b,'trim',s*23.05,3.35,-22.84,0.55,5.7,0.23);
  for(const y of [0.48,6.21])box(b,'trim',0,y,-22.84,46.6,0.25,0.23);
  const count=near?25:13;
  for(let i=0;i<count;i++){
    const x=(i-(count-1)/2)*(42/(count-1)),y=2.95+0.16*Math.sin(i);box(b,'stone',x,y,-22.89,0.8,2.5,0.23);ellipsoid(b,'trim',x,y+1.6,-23.02,0.36,0.44,0.19,near);
    for(const s of [-1,1]){beam(b,'trim',[x+s*0.28,y-1.2,-23],[x+s*0.65,y-2,-23],0.25,0.18);beam(b,'trim',[x+s*0.4,y+0.6,-23],[x+s*0.95,y+0.15,-23],0.23,0.2);}
  }
}
