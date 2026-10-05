import * as THREE from 'three';
export const ANGLE = 17 * Math.PI / 180;
export function world([x,y,z]) { return [x*Math.cos(ANGLE)+z*Math.sin(ANGLE),y,-x*Math.sin(ANGLE)+z*Math.cos(ANGLE)]; }
export function localRing(ring) { return ring.map(([lng,lat])=>{const x=(lng-12.4831)*111319.49*Math.cos(41.8947*Math.PI/180),z=(41.8947-lat)*111319.49;return [x*Math.cos(ANGLE)-z*Math.sin(ANGLE),x*Math.sin(ANGLE)+z*Math.cos(ANGLE)];}); }
export function kit(b, near) {
  const put=(g,m)=>b.put(g,m);
  const box=(m,x,y,z,w,h,d)=>b.box(m,[x,y,z],[w,h,d]);
  function slab(ring,y,h,m='stone') {
    const shape=new THREE.Shape(ring.map(([x,z])=>new THREE.Vector2(x,-z)));
    const g=new THREE.ExtrudeGeometry(shape,{depth:h,bevelEnabled:false});g.rotateX(-Math.PI/2);g.translate(0,y,0);put(g,m);
  }
  function cylinder(m,x,y,z,r,h,rt=r,n=near?12:4) {const g=new THREE.CylinderGeometry(rt,r,h,n);g.translate(x,y+h/2,z);put(g,m);}
  function ellipsoid(m,x,y,z,rx,ry,rz,cap=false) {const g=new THREE.SphereGeometry(1,cap?6:(near?6:4),cap?3:(near?5:3));g.scale(rx,ry,rz);g.translate(x,y,z);put(g,m);}
  function column(x,z,y,h,r=1.08) {
    if(near){cylinder('trim',x,y,z,r*1.4,.5);cylinder('stone',x,y+.5,z,r*1.2,.5);}else cylinder('trim',x,y,z,r*1.4,1,r);
    // Fluting is geometric, a shallow scalloped section, with tapered shaft and entasis.
    const n=near?32:6, positions=[],idx=[],prof=near?[[1,r],[3,r*1.03],[h-2.2,r*.85],[h-1.7,r*.84]]:[[1,r],[h-1.7,r*.84]];
    for(const [dy,rr] of prof)for(let i=0;i<n;i++){const a=i*2*Math.PI/n,f=near?1-.07*(1-Math.cos(i*Math.PI/2)):1;positions.push(x+Math.cos(a)*rr*f,y+dy,z+Math.sin(a)*rr*f);}
    for(let j=0;j<prof.length-1;j++)for(let i=0;i<n;i++){const a=j*n+i,c=j*n+(i+1)%n;idx.push(a,a+n,c,c,a+n,c+n);}
    const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));g.setIndex(idx);g.computeVertexNormals();put(g,'stone');
    if(near){cylinder('trim',x,y+h-1.75,z,r*.87,.4,r*1.03);cylinder('trim',x,y+h-1.35,z,r*1.03,.95,r*1.5);}else cylinder('trim',x,y+h-1.7,z,r*.84,1.3,r*1.5);
    box('trim',x,y+h-.2,z,r*3.05,.4,r*3.05);
    if(near)for(let j=0;j<4;j++){const a=j*Math.PI/2;ellipsoid('trim',x+Math.cos(a)*r*1.15,y+h-.9,z+Math.sin(a)*r*1.15,.3,.6,.3,true);}
  }
  function figure(m,x,y,z,h,winged=false,wingWidth=.9) {
    cylinder(m,x,y,z,.25*h,.15*h,.22*h,near?6:4);
    cylinder(m,x,y+.13*h,z,.22*h,.47*h,.13*h,near?6:4);
    if(near)ellipsoid(m,x,y+.67*h,z,.16*h,.23*h,.12*h);else cylinder(m,x,y+.60*h,z,.13*h,.22*h,.09*h,4);
    ellipsoid(m,x,y+.91*h,z,.105*h,.105*h,.105*h);
    if(near||winged)for(const s of [-1,1])b.bar(m,[x+s*.13*h,y+.76*h,z],[x+s*.34*h,y+.48*h,z-.05*h],.08*h);
    if(winged)for(const s of [-1,1]){const sh=new THREE.Shape([new THREE.Vector2(0,0),new THREE.Vector2(s*h*wingWidth,h*.35),new THREE.Vector2(s*h*wingWidth*.61,-h*.22)]);const g=new THREE.ExtrudeGeometry(sh,{depth:.16*h,bevelEnabled:false});g.translate(x,y+.75*h,z+.08*h);put(g,m);}
  }
  function horse(x,y,z,scale=1,angle=0) {
    const s=scale,c=Math.cos(angle),sn=Math.sin(angle);
    const H=(a,h,d)=>[x+(a*c+d*sn)*s,y+h*s,z+(-a*sn+d*c)*s];
    const E=(a,h,d,rx,ry,rz)=>{const g=new THREE.SphereGeometry(1,near?6:4,near?5:3);g.scale(rx*s,ry*s,rz*s);g.rotateY(angle);g.translate(...H(a,h,d));put(g,'bronze');};
    const limb=(a,v,w)=>b.bar('bronze',H(...a),H(...v),w*s);
    E(0,2.8,0,2.15,1.05,.65);E(-1.65,3.8,0,.65,1.2,.5);E(-2.15,4.7,0,.8,.4,.43);
    for(const d of [-.48,.48])for(const a of [-1.2,1.3]){limb([a,2.6,d],[a+.25,1.15,d],.28);limb([a+.25,1.15,d],[a,0,d],.22);}
    limb([1.8,3.2,0],[2.55,1.5,0],.25);
    if(near)limb([-2,4,0],[-.15,3.6,0],.09);
  }
  function pediment(x,y,z,w,rise,depth,m='trim') {const sh=new THREE.Shape([new THREE.Vector2(-w/2,0),new THREE.Vector2(w/2,0),new THREE.Vector2(0,rise)]);const g=new THREE.ExtrudeGeometry(sh,{depth,bevelEnabled:false});g.translate(x,y,z);put(g,m);}
  return {put,box,slab,cylinder,ellipsoid,column,figure,horse,pediment};
}
