import * as THREE from 'three';
import { SPEC } from './config.js';

export function buildTower(k) {
  const {near,put,box,plane,hip,column}=k;
  // The 59-ft tower shaft, with true apertures and recessed glazing.
  const w=59*.3048,half=w/2,y0=23,y1=72;
  box('glow',0,(y0+y1)/2,0,w-1,y1-y0,w-1);
  const cols=[-3.25,0,3.25],rows=Array.from({length:20},(_,i)=>25.4+i*2.25),pw=1.23,ph=1.63;
  const xs=[-half,...cols.flatMap(x=>[x-pw/2,x+pw/2]),half];
  const ys=[y0,...rows.flatMap(y=>[y-ph/2,y+ph/2]),y1];
  function wallQuad(mat,a,u0,u1,v0,v1,d) {
    const c=Math.cos(a),s=Math.sin(a),xyz=(u,v,f)=>[c*u+s*f,v,-s*u+c*f];
    const p=[...xyz(u0,v0,d),...xyz(u1,v0,d),...xyz(u1,v1,d),...xyz(u0,v1,d)];
    const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(p,3));g.setIndex([0,1,2,0,2,3]);g.computeVertexNormals();put(g,mat);
  }
  for(let face=0;face<4;face++) {
    const a=face*Math.PI/2,c=Math.cos(a),s=Math.sin(a);
    for(let i=0;i<xs.length-1;i++)for(let j=0;j<ys.length-1;j++) {
      if(i%2===1&&j%2===1)continue; // actual window holes
      wallQuad('glow',a,xs[i],xs[i+1],ys[j],ys[j+1],half);
    }
    for(const x of cols)for(const y of rows) {
      const d=half-.32;
      if(near) {
        // Four separate panes retain stone mullion gaps without layered trim.
        for(const sx of [-1,1])for(const sy of [-1,1])wallQuad('light',a,x+sx*pw/4-pw*.21,x+sx*pw/4+pw*.21,y+sy*ph/4-ph*.21,y+sy*ph/4+ph*.21,d);
      } else wallQuad('light',a,x-pw/2,x+pw/2,y-ph/2,y+ph/2,d);
      // Closed jamb/reveal surfaces joining the facade to the glazing plane.
      const p=(u,v,f)=>[c*u+s*f,v,-s*u+c*f];
      const q=(pts)=>{const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pts.flat(),3));g.setIndex([0,1,2,0,2,3]);g.computeVertexNormals();put(g,'glow');};
      const l=x-pw/2,r=x+pw/2,b=y-ph/2,t=y+ph/2;
      q([p(l,b,half),p(l,b,d),p(l,t,d),p(l,t,half)]);
      q([p(r,b,d),p(r,b,half),p(r,t,half),p(r,t,d)]);
      q([p(l,t,half),p(l,t,d),p(r,t,d),p(r,t,half)]);
      q([p(l,b,d),p(l,b,half),p(r,b,half),p(r,b,d)]);
    }
  }
  // The shaft's top slab and subtle projecting corner pilasters.
  box('glow',0,71.8,0,w,.4,w);
  for(const x of [-half+.18,half-.18])for(const z of [-half+.18,half-.18])
    box('glow',x,47.5,z,.5,49,.5);
  // Broad classical cornice / observation gallery, then receding clock stage.
  for(const [y,ww,h] of [[72.25,19.5,.5],[73.0,20.1,1.0],[74.05,19.2,1.1],[75.05,18.2,.9]])box('glow',0,y,0,ww,h,ww);
  box('glow',0,77.3,0,13.0,4.5,13.0);
  box('glow',0,79.95,0,11.5,.8,11.5);
  box('glow',0,80.65,0,9.3,.6,9.3);
  // Gallery corner plinths and parapets keep the distinct stepped silhouette.
  for(const x of [-7.7,7.7])for(const z of [-7.7,7.7])box('glow',x,76.25,z,1.65,2.4,1.65);
  for(let face=0;face<4;face++) {
    const a=face*Math.PI/2,c=Math.cos(a),s=Math.sin(a);
    const local=(g,mat,d)=>{g.rotateY(a);g.translate(s*d,0,c*d);put(g,mat);};
    // Four 3.8m gold-rimmed clocks, larger than the documented twelve feet.
    const faceG=new THREE.CircleGeometry(1.71,near?48:24);faceG.translate(0,77.4,0);local(faceG,'lamp',6.83);
    const rim=new THREE.RingGeometry(1.72,1.96,near?48:24);rim.translate(0,77.4,0);local(rim,'gold',6.84);
    for(let j=0;j<12;j++) {
      const t=j*Math.PI/6,x=1.4*Math.sin(t),y=77.4+1.4*Math.cos(t);
      const tick=new THREE.PlaneGeometry(.13,j%3===0?.39:.23);tick.rotateZ(-t);tick.translate(x,y,0);local(tick,'gold',6.99);
    }
    for(const [t,len,wide] of [[-.45,1.15,.14],[2.0,.86,.19]]) {
      const hand=new THREE.PlaneGeometry(wide,len);hand.translate(0,len/2,0);hand.rotateZ(-t);hand.translate(0,77.4,0);local(hand,'gold',7.04);
    }
    const hub=new THREE.CircleGeometry(.19,near?12:8);hub.translate(0,77.4,0);local(hub,'gold',7.07);
    // Observation gallery slots below the clocks, as individual recessed bays.
    for(let j=-3;j<=3;j++)plane('light',c*j*2.3+s*9.68,74.15,-s*j*2.3+c*9.68,.75,.55,a);
    if(near)for(let j=-3;j<=3;j++) {
      const g=new THREE.PlaneGeometry(.4,.28);g.translate(j*2.3,73.1,0);local(g,'gold',10.09);
    }
  }
  // Open four-sided colonnaded carillon. Recessed core stays behind the bays.
  box('glow',0,81.0,0,9.5,.7,9.5);
  box('shadow',0,85.9,0,5.3,8.6,5.3); // dark recessed carillon, separate from red tile cap
  for(let face=0;face<4;face++) {
    const a=face*Math.PI/2,c=Math.cos(a),s=Math.sin(a);
    for(const u of [-3.75,-1.25,1.25])column(c*u+s*3.75,-s*u+c*3.75,81.3,90.8);
  }
  box('glow',0,91.15,0,9.5,.9,9.5);
  box('glow',0,91.85,0,10.05,.5,10.05);
  // Shallow tile cap, mostly hidden by the stepped stone crown in the photos.
  hip('roof',0,0,8.8,8.8,92.1,93.1,5.3,5.3);
  box('glow',0,93.3,0,6.0,.4,6.0);
  box('glow',0,(93.5+SPEC.height)/2,0,4.8,SPEC.height-93.5,4.8);
}
