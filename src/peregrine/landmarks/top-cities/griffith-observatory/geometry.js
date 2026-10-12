import * as THREE from 'three';
import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES, local } from './config.js';
import { FOOTPRINTS } from './footprint.js';
import { walls, lid, quad, circle, cylinder, dome } from './griffith-observatory-parts.js';
export function create({detail='near'}={}){
  const near=detail==='near',b=assetBuilder({...SPEC,palette:PALETTES.light},detail),ring=FOOTPRINTS[0].slice(0,-1).map(local).filter(p=>!(Math.abs(p[0])<1&&p[1]<0));
  walls(b,ring,0,7.8,near,(a,c,len)=>{
    if(Math.abs((a[0]+c[0])/2)<1&&a[1]<0&&c[1]<0&&len>8)return {count:1,width:4.3,y0:.8,y1:6.9};
    return len>8?Math.max(1,Math.floor(len/3.8)):(len>1.8&&(a[1]+c[1])/2>34?1:0);
  });
  for(let i=0;i<ring.length;i++){
    const a=ring[i],c=ring[(i+1)%ring.length],len=Math.hypot(c[0]-a[0],c[1]-a[1]);
    if(len>.2)b.bar('concrete',[a[0],8.15,a[1]],[c[0],8.15,c[1]],.65,.55);
    if(near&&((a[1]+c[1])/2<11))for(let y=1.1;y<7.5;y+=.65){if(len>8&&((y>1.3&&y<5.7)||(Math.abs((a[0]+c[0])/2)<1)))continue;b.bar('concrete',[a[0],y,a[1]],[c[0],y,c[1]],.075,.14);}
  }
  for(const x of [-29.65,29.12]){
    const z=3.25,r=6.25,n=near?32:16;
    walls(b,circle(x,z,r,n),7.8,9.5,near);cylinder(b,'concrete',x,z,r+.15,9.5,9.85,n);
    cylinder(b,'copper',x,z,4.572,9.85,10.7,n);dome(b,x,z,4.572,10.7,4.572,near);
    if(near)for(let j=0;j<16;j++){const t0=j*Math.PI/16,t1=(j+1)*Math.PI/16,p=t=>[x,10.7+4.63*Math.sin(t),z+4.63*Math.cos(t)];b.bar('copper',p(t0),p(t1),.23,.12);}
  }
  const r=12.4,z=32.3,n=near?48:24;
  walls(b,circle(0,z,r,n),7.8,11.8,near);cylinder(b,'concrete',0,z,r+.08,11.8,12.1,n);dome(b,0,z,r,12.1,11.1,near);
  for(let k=0;k<16;k++){
    const t=k*Math.PI/8,x=(r+.05)*Math.cos(t),zz=z+(r+.05)*Math.sin(t);b.box('concrete',[x,9.7,zz],[.7,4,.45],-t+Math.PI/2);
  }
  walls(b,circle(0,4.2,6.25,8,Math.PI/8),7.8,10.6,near);
  cylinder(b,'patina',0,4.2,6.25,10.6,11.5,8,5.75);dome(b,0,4.2,5.75,11.5,2.1,near,'patina');
  for(const x of [-7.5,7.5]){b.box('concrete',[x,4.6,-4.6],[5.4,9.2,3]);b.box('concrete',[x,9.45,-4.6],[5.8,.5,3.4]);}
  b.box('concrete',[0,8.4,-4.2],[9.8,2.5,2.1]);
  for(const x of [-2.1,2.2])quad(b,'bronze',[[x-.08,.8,-4.2],[x+.08,.8,-4.2],[x+.08,6.9,-4.2],[x-.08,6.9,-4.2]],[0,0,-1]);
  quad(b,'bronze',[[-2.18,6.82,-4.2],[2.28,6.82,-4.2],[2.28,6.98,-4.2],[-2.18,6.98,-4.2]],[0,0,-1]);
  if(near){quad(b,'bronze',[[-.03,.8,-3.96],[.07,.8,-3.96],[.07,6.9,-3.96],[-.03,6.9,-3.96]],[0,0,-1]);for(let k=0;k<5;k++)b.box('concrete',[0,7.8+k*.26,-5.36],[8.3-k*.5,.12,.15]);}
  for(let i=0;i<ring.length;i++){
    const a=ring[i],c=ring[(i+1)%ring.length],len=Math.hypot(c[0]-a[0],c[1]-a[1]);
    if(!(a[1]<-2.8&&c[1]<-2.8&&len>15))continue;
    const count=Math.floor(len/3.8);
    for(let k=1;k<count;k++){const t=k/count,x=a[0]+(c[0]-a[0])*t,z=a[1]+(c[1]-a[1])*t;b.box('concrete',[x,4.1,z-.16],[.7,7.4,.65]);b.box('concrete',[x,7.95,z-.16],[1.2,.3,.85]);}
  }
  b.box('terrace',[0,.4,-5.12],[4.5,.8,2]);
  for(let k=0;k<4;k++)b.box('terrace',[0,.1*(k+1),-7.35+k*.35],[9.7,.2*(k+1),.35]);
  const promenade=circle(0,32.3,15.1,near?48:24).filter(p=>p[1]>=32.3-.01);promenade.push([15.1,32.3]);
  walls(b,promenade,0,.45,near,undefined,'terrace');
  const mz=-28.8;
  cylinder(b,'terrace',0,mz,2.7,0,.32,near?24:12);cylinder(b,'concrete',0,mz,1.9,.32,1.2,6);
  cylinder(b,'concrete',0,mz,1.42,1.2,4.2,6);cylinder(b,'concrete',0,mz,1.05,4.2,10.668,6,.28);
  for(let k=0;k<6;k++){
    const t=k*Math.PI/3,x=1.22*Math.cos(t),zz=mz+1.22*Math.sin(t);cylinder(b,'concrete',x,zz,.32,1.2,3.35,near?8:5,.39);
    const head=new THREE.SphereGeometry(.3,near?8:5,near?6:3);head.translate(x,3.62,zz);b.put(head,'concrete');
    b.bar('concrete',[x-.18*Math.sin(t),2.9,zz+.18*Math.cos(t)],[.85*Math.cos(t),2.15,mz+.85*Math.sin(t)],.22);
  }
  cylinder(b,'bronze',0,mz,.13,10.668,10.95,8);
  for(const angle of [0,Math.PI/2,Math.PI/4]){const torus=new THREE.TorusGeometry(.58,.045,near?6:4,near?24:12);torus.rotateY(angle);torus.translate(0,11.5,mz);b.put(torus,'bronze');}
  const model=b.finish();model.traverse(o=>{if(o.isMesh)o.geometry.deleteAttribute('bridgeLift');});return model;
}
