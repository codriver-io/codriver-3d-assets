import * as THREE from 'three';
import { PLAN } from './ut-tower-plan.js';

export function buildMain(k) {
  const {near,put,box,bar,polygon,plane,hip}=k;
  const ring=PLAN['27397894'];
  // The lower south centre is recessed for the open nine-bay entrance loggia.
  const lower=ring.map(([x,z],i)=>[x,i>=11&&i<=15?51.8:z]);
  polygon('stone',lower,0,6.4);
  polygon('stone',ring,6.4,17);
  // Windowed 23m book-stack base and front four-storey pavilion.
  polygon('stone',PLAN['516187631'],17,23);
  polygon('stone',PLAN['516187635'],17,23.1);
  for(const [x,z,w,d] of [[-25.45,29.6,14.0,80.8],[31.5,10.2,15.1,42],[26.9,49.5,13.3,40.8]]) {
    hip('roof',x,z,w,d,17.3,19.1,w*.57,d-6);
    box('stone',x,17.1,z,w+.35,.35,d+.35);
  }
  hip('roof',-.5,45.7,43.1,20.5,23.25,25.25,36.6,12.5);
  box('stone',.3,23.05,0,22.1,.4,20.1);
  // Front arcade: true arched voids, with doors more than five metres behind.
  const count=9,pitch=4.2,first=-16.65,z=57.35,r=1.48,spring=3.6;
  for(let j=0;j<count;j++) {
    const x=first+j*pitch;
    const shape=new THREE.Shape();shape.moveTo(-pitch/2,6.4);shape.lineTo(pitch/2,6.4);
    shape.lineTo(pitch/2,0);shape.lineTo(r,0);shape.lineTo(r,spring);
    const n=near?16:8;
    for(let i=0;i<=n;i++){const a=i*Math.PI/n;shape.lineTo(r*Math.cos(a),spring+r*Math.sin(a));}
    shape.lineTo(-r,0);shape.lineTo(-pitch/2,0);shape.closePath();
    const g=new THREE.ExtrudeGeometry(shape,{depth:5.5,bevelEnabled:false,steps:1});
    g.translate(x,0,z-5.5);put(g,'stone');
    plane('light',x,2.45,52.12,2.55,4.6);
    if(near) {
      // Arch ring and impost blocks are stone, continuous with the piers.
      const border=new THREE.Shape();
      for(let i=0;i<=n;i++){const a=i*Math.PI/n;const u=1.7*Math.cos(a),v=spring+1.7*Math.sin(a);i?border.lineTo(u,v):border.moveTo(u,v);}
      for(let i=n;i>=0;i--){const a=i*Math.PI/n;border.lineTo(r*Math.cos(a),spring+r*Math.sin(a));}
      const rim=new THREE.ExtrudeGeometry(border,{depth:.3,bevelEnabled:false,steps:1});rim.translate(x,0,z-.12);put(rim,'stone');
      for(const s of [-1,1])box('stone',x+s*1.65,spring-.1,z+.05,.55,.35,.5);
    }
  }
  // Horizontal cornices, tall reading-room windows and giant-order pilasters.
  for(const y of [6.35,16.2,17.0])box('stone',.4,y,56.9,40.4,.45,1.5);
  for(let j=0;j<9;j++) {
    const x=first+j*pitch;
    const gap=near?.28:.6;
    if(near)for(const s of [-1,1])plane('light',x+s*.55,11.2,57.5+gap,.95,6.3);
    else plane('light',x,11.2,57.5+gap,2.0,6.3);
    box('stone',x,7.85,57.6,2.7,.35,.6);
    box('stone',x,14.65,57.6,2.7,.4,.65);
    if(near) {
      box('stone',x,15.22,57.65,1.45,.55,.4);
      // Low-relief scroll plaque: original abstract carving, not copied seals.
      for(const s of [-1,1])box('stone',x+s*.85,15.25,57.67,.4,.4,.42);
    }
    if(j<8) {
      const px=x+pitch/2;
      box('stone',px,11.6,57.7,.68,8.7,.55);
      box('stone',px,15.7,57.7,1.08,.6,.7);
    }
  }
  // Front attic with ochre inset panels, regular windows and terrace balustrade.
  for(let j=0;j<11;j++) {
    const x=-19.5+j*3.8;
    plane('brick',x,20.8,56.45,2.7,3.3);
    plane('light',x,20.7,56.75,1.3,2.3);
    box('stone',x,19.2,56.55,1.6,.2,.5);
    box('stone',x,22.4,56.55,1.75,.35,.65);
    if(near)for(const s of [-1,1])box('stone',x+s*.91,20.75,56.55,.15,2.7,.3);
  }
  box('stone',-.6,18.0,56.9,43.0,.3,.8);
  box('stone',-.6,18.9,56.9,43.0,.28,.8);
  if(near)for(let j=0;j<87;j++)box('stone',-21.6+j*.49,18.45,56.9,.15,.8,.25);
  else for(let j=0;j<29;j++)box('stone',-21.3+j*1.47,18.45,56.9,.24,.8,.3);
  // Discrete windows on all exposed sides, including the north court fronts.
  const area=ring.reduce((v,p,i)=>{const q=ring[(i+1)%ring.length];return v+p[0]*q[1]-q[0]*p[1];},0);
  for(let i=0;i<ring.length;i++) {
    const [ax,az]=ring[i],[bx,bz]=ring[(i+1)%ring.length];
    const dx=bx-ax,dz=bz-az,len=Math.hypot(dx,dz);
    if(len<5 || [1,2,3].includes(i) || (az>52&&bz>52&&ax>-19&&bx<21))continue;
    const nx=dz/len*Math.sign(area),nz=-dx/len*Math.sign(area),a=Math.atan2(nx,nz);
    const n=Math.max(1,Math.floor(len/4.0));
    for(let j=0;j<n;j++) {
      const t=(j+.5)/n,x=ax+dx*t,z=az+dz*t,offset=near?.3:.6;
      for(const [y,h] of [[2.9,3.9],[11.1,5.1]]) {
        if(near)for(const s of [-1,1])plane('light',x+nx*offset+s*.47*Math.cos(a),y,z+nz*offset-s*.47*Math.sin(a),.82,h,a);
        else plane('light',x+nx*offset,y,z+nz*offset,1.7,h,a);
      }
      if(near)bar('stone',[x-.95*Math.cos(a)+nx*.12,14,z+.95*Math.sin(a)+nz*.12],[x+.95*Math.cos(a)+nx*.12,14,z-.95*Math.sin(a)+nz*.12],.28,.45);
    }
    bar('stone',[ax+nx*.12,16.7,az+nz*.12],[bx+nx*.12,16.7,bz+nz*.12],.5,.6);
  }
  // North book-stack: four storeys, gilded alphabet motifs only at near detail.
  for(let face=0;face<4;face++)for(let j=0;j<7;j++)for(const y of [3.6,8.5,13.4,19.7]) {
    if(face===0&&y<19)continue;
    const a=face*Math.PI/2,u=-8.75+j*3,d=face%2?11.7:10.85;
    plane('light',Math.cos(a)*u+Math.sin(a)*d,y,-Math.sin(a)*u+Math.cos(a)*d,1.25,y===19.7?3.1:3.7,a);
  }
  if(near)for(let j=0;j<7;j++)plane('gold',-8.75+j*3,16.25,-10.82,.45,.7,Math.PI);
  // Short entrance stair contained by the provider outline, not a plaza slab.
  for(let j=0;j<4;j++)box('stone',.15,(j+1)*.085,57.3-j*.2,35.8,(j+1)*.17,.4);
}
