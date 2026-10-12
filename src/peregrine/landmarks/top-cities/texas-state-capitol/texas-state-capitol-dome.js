import * as THREE from 'three';
export const DOME_PROFILE=[[14.05,64.8],[14,66],[13.65,68],[13,70],[12.05,72],[10.7,74],[8.95,76],[6.9,77.8],[4.3,79.1],[2.8,79.5]];
export function shellRadius(y) {
  for(let i=1;i<DOME_PROFILE.length;i++){const a=DOME_PROFILE[i-1],b=DOME_PROFILE[i];if(y<=b[1])return a[0]+(b[0]-a[0])*(y-a[1])/(b[1]-a[1]);}
  return 2.8;
}
export function buildDome(k) {
  const {near,put,box,bar,cylinder,lathe,window,column}=k;
  // Cylindrical drum stands above the central attic; open colonnade surrounds a recessed core.
  cylinder('stone',0,0,13.4,34.7,43,13.4,near?48:24);
  for(let j=0;j<24;j++){const a=(j+.5)*Math.PI/12,r=near?13.6:13.95;window('light',r*Math.sin(a),37.1,r*Math.cos(a),1.4,3.5,a);}
  cylinder('stone',0,0,15.05,42.5,44.2,15.05,near?48:24);
  cylinder('stone',0,0,11.6,44,56.4,11.6,near?48:24);
  cylinder('stone',0,0,15.15,56.1,57.6,15.15,near?48:24);
  for(let j=0;j<24;j++) {
    const a=j*Math.PI/12,x=13.95*Math.sin(a),z=13.95*Math.cos(a);
    column(x,z,44.1,56.2,.48);
    // Recessed windows between columns: one arch plus a smaller lower opening.
    const t=a+Math.PI/24;
    window('light',11.8*Math.sin(t),48,11.8*Math.cos(t),1.3,4.2,t,true);
    window('light',11.8*Math.sin(t),45.3,11.8*Math.cos(t),1.15,1.5,t);
    if(near) {
      const b=a+Math.PI/24;
      bar('stone',[14.55*Math.sin(b),43.7,14.55*Math.cos(b)],[14.55*Math.sin(b),45.6,14.55*Math.cos(b)],.2,.2);
    }
  }
  // Circular balcony handrail remains supported by the closed parapet/base.
  lathe('stone',[[14.45,43.9],[14.45,44.2],[14.55,44.2],[14.55,45.8],[14.35,45.8],[14.35,45.5],[14.25,45.5],[14.25,43.9]],near?48:24);
  cylinder('stone',0,0,13.85,57.5,64.9,13.85,near?48:24);
  cylinder('stone',0,0,14.4,64.4,65.3,14.4,near?48:24);
  for(let j=0;j<24;j++) {
    const a=(j+.5)*Math.PI/12,r=near?14.05:14.45;
    window('light',r*Math.sin(a),59,r*Math.cos(a),1.55,3.85,a,true);
    if(near)column(13.95*Math.sin(j*Math.PI/12),13.95*Math.cos(j*Math.PI/12),57.8,64.4,.23);
  }
  lathe('stone',DOME_PROFILE,near?48:24);
  // Twenty-four raised cast-iron ribs and oval dormers preserve the shell's distinctive rhythm.
  for(let j=0;j<24;j++) {
    const a=j*Math.PI/12,steps=near?10:5;
    for(let s=0;s<steps;s++) {
      const y0=65.3+s*13.9/steps,y1=65.3+(s+1)*13.9/steps;
      // Centre ribs on the shell so their inner half embeds, including the steep crown.
      bar('stone',[shellRadius(y0)*Math.sin(a),y0,shellRadius(y0)*Math.cos(a)],[shellRadius(y1)*Math.sin(a),y1,shellRadius(y1)*Math.cos(a)],near?.38:.44,.7);
    }
    const t=a+Math.PI/24,y=68.65,r=shellRadius(y)+.55;
    // Oval dark aperture facing tangent to the shell (twelve-sided near / eight-sided far).
    const pts=[...Array(near?16:8)].map((_,i,arr)=>new THREE.Vector2(.56*Math.cos(i*Math.PI*2/arr.length),1.18*Math.sin(i*Math.PI*2/arr.length)));
    const g=new THREE.ShapeGeometry(new THREE.Shape(pts));g.rotateY(t);g.translate(r*Math.sin(t),y,r*Math.cos(t));put(g,'light');
  }
  lathe('stone',[[shellRadius(73.2)+.18,73.2],[shellRadius(73.5)+.18,73.5]],near?48:24);
  cylinder('stone',0,0,3.6,79.1,80,3.6,near?24:12);
  // Lantern beneath the white Goddess: six open supports around a smaller glazed cylinder.
  cylinder('lamp',0,0,1.55,80,84.25,1.55,near?16:8);
  for(let j=0;j<8;j++) {
    const a=j*Math.PI/4;column(2.7*Math.sin(a),2.7*Math.cos(a),79.9,84.4,.21);
  }
  cylinder('stone',0,0,3.15,84.25,84.8,3.15,near?24:12);
  lathe('stone',[[3.0,84.8],[2.5,85.5],[1.5,86.1],[.85,86.4],[.85,87.4]],near?20:12);
  // Original robed human silhouette, raised right arm bearing a five-point star.
  lathe('statue',[[.82,87.35],[.85,88.1],[.62,89.35],[.42,90.0],[.54,90.65],[.22,90.8]],near?10:6);
  const head=new THREE.SphereGeometry(.32,near?10:6,near?8:4);head.translate(0,91.06,0);put(head,'statue');
  bar('statue',[-.4,90.1,0],[-.82,89.6,.04],.25);
  bar('statue',[-.82,89.6,.04],[-.82,88.45,.04],.18);
  bar('statue',[.4,90.1,0],[.88,90.9,0],.22);
  bar('statue',[.88,90.9,0],[1.05,91.63,0],.17);
  const star=new THREE.Shape();
  for(let i=0;i<10;i++) {const t=Math.PI/2+i*Math.PI/5,r=i%2?.22:.48;const x=1.05+r*Math.cos(t),y=91.7647+r*Math.sin(t);if(!i)star.moveTo(x,y);else star.lineTo(x,y);}
  star.closePath();const sg=new THREE.ExtrudeGeometry(star,{depth:.12,bevelEnabled:false});sg.translate(0,0,-.06);put(sg,'statue');
}
