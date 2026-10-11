import * as THREE from 'three';
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';
import { PARTS, ANGLE } from './bc-parliament-buildings-site.js';
import { kit } from './bc-parliament-buildings-kit.js';

// Original procedural exterior. Detailed OSM parts establish geography; facade surfaces,
// arch openings, roof lofts, cupolas and sculpture are authored, texture-free geometry.
export function create({detail='near'}={}) {
  const near=detail==='near', b=assetBuilder({...SPEC,palette:PALETTES.light},detail),k=kit(b,near);
  const parts=PARTS.map(p=>({...p,ring:k.ring(p.ring)}));
  const body=parts.filter(p=>p.roof!=='dome'&&p.id!==256936029);
  const height=p=>p.id===256936110?29:p.h-p.rise;
  const inside=(r,u,v)=>{let q=false;for(let i=0,j=r.length-1;i<r.length;j=i++){const a=r[i],c=r[j];if((a[1]>v)!==(c[1]>v)&&u<(c[0]-a[0])*(v-a[1])/(c[1]-a[1])+a[0])q=!q;}return q;};
  const occupied=(id,u,y,v)=>body.some(p=>p.id!==id&&y>p.min+.03&&y<height(p)-.05&&inside(p.ring,u,v));
  const center=p=>{const xs=p.ring.map(q=>q[0]),zs=p.ring.map(q=>q[1]);return [(Math.min(...xs)+Math.max(...xs))/2,(Math.min(...zs)+Math.max(...zs))/2];};
  // Exposed wall edges are split by actual neighbouring parts before ornamenting.
  function decorate(p,h) {
    const r=k.ring(p.ring);
    for(let i=0;i<r.length;i++){
      const a=r[i],c=r[(i+1)%r.length],dx=c[0]-a[0],dz=c[1]-a[1],len=Math.hypot(dx,dz);
      if(len<2.4)continue;
      const nx=dz/len,nz=-dx/len,angle=Math.atan2(nx,nz);
      const pos=(t,out=.12)=>[a[0]+dx*t+nx*out,a[1]+dz*t+nz*out];
      // Three clear tiers, keeping arched upper windows on both LODs.
      const floors=h>23?[3.0,8.5,14,20,25]:h>18?[2.1,7.3,12.5,17.8]:[1.8,6.7,11.4];
      const count=Math.max(1,Math.floor((len-.9)/(near?3.15:6.3)));
      for(const y of floors){if(y+2.8>h-.6||y<p.min)continue;for(let j=0;j<count;j++){
        const [u,v]=pos((j+.5)/count);if(occupied(p.id,u,y+1.4,v))continue;
        if(p.id===256936040&&v<-33&&Math.abs(u)<4.4)continue;
        if(p.id===256935996&&v>66&&Math.abs(u)<4.5)continue;
        k.window(u,y,v,Math.min(1.5,len/count*.52),2.7,angle,y>=6.5);
      }}
      for(const y of (near?[1.2,6,11,h-.65]:[h-.65])){if(y<p.min||y>h)continue;const slices=Math.ceil(len/(near?1.7:6));for(let j=0;j<slices;j++){
        const t=(j+.5)/slices,[u,v]=pos(t);if(occupied(p.id,u,y+.1,v))continue;
        k.put(k.wall(new THREE.PlaneGeometry(len/slices+.035,.24),u,y+.12,v+.0,angle),y===1.2?'foundation':'trim');
      }}
      if(near)for(let j=0;j<Math.ceil(len/1.2);j++){const [u,v]=pos((j+.5)/Math.ceil(len/1.2),.25);if(!occupied(p.id,u,h-.2,v))k.put(k.wall(new THREE.PlaneGeometry(.20,.32),u,h-.22,v,angle),'trim');}
      // Continuous small night outline strips offset beyond the cornice.
      const slices=Math.ceil(len/(near?4:8));for(let j=0;j<slices;j++){
        if(!near&&len<6)continue;
        const [u,v]=pos((j+.5)/slices,.28);if(!occupied(p.id,u,h+.3,v))k.put(k.wall(new THREE.PlaneGeometry(len/slices+.01,.20),u,h+.12,v,angle),'light');
      }
    }
  }
  for(const p of body){
    if([256936061,256936075,256936006].includes(p.id))continue; // true open arcades below
    const h=height(p),r=k.ring(p.ring);
    // Ceremonial arch is an actual recess, rather than a decal on the stone front.
    const entrance=(a,c)=>p.id===256936040&&a[1]<-34&&c[1]<-34;
    k.shell('stone',r,near&&p.min===0?1.15:p.min,h,entrance);
    if(near&&p.min===0)k.shell('foundation',r,0,1.15);
    if(p.id===256936040){
      b.box('stone',[-.2,19.8,-32.62],[11.05,5.6,3.2]);
      b.box('trim',[-.2,22.65,-32.62],[11.5,.45,3.6]);
      for(const x of [-3.7,-1.25,1.25,3.7])k.window(x,12.4,-34.3,1.6,3.1,Math.PI,true);
      k.openingWall(-.2,-34.22,11.05,17,Math.PI,[[0,2,5.9,8.5]]);
      k.put(k.wall(new THREE.ShapeGeometry(k.arch(5.9,8.5)).translate(0,0,.1),-.2,2,-31.9,Math.PI),'glass');
      for(const x of [-3.4,3.4])b.box('trim',[x,5.2,-34.42],[.48,6.4,.55]);
      for(let i=0;i<10;i++)b.box('foundation',[-.2,(2-i*.2)/2,-34.25-(i+.5)*.52],[8.4,2-i*.2,.54]);
      k.archRim(-.2,2,-34.34,6.7,8.9,Math.PI,.45);
      k.archRim(-.2,2,-34.55,6.9,9.0,Math.PI,.16,'light');
      if(near)for(const x of [-3.7,-1.25,1.25,3.7]){
        k.put(k.wall(new THREE.CircleGeometry(.8,12),x,18.7,-34.4,Math.PI),'glass');
        k.put(k.wall(new THREE.TorusGeometry(.92,.17,4,12),x,18.7,-34.55,Math.PI),'trim');
      }
    }
    const [u,v]=center(p);
    if(p.rise){
      const shrink=p.roof==='mansard'?.24:.5;
      const top=r.map(([x,z])=>[u+(x-u)*shrink,v+(z-v)*shrink]);
      k.loft('roof',r,top,h,p.h);
      if(near&&Math.max(...r.map(q=>q[0]))-Math.min(...r.map(q=>q[0]))>8){
        for(const [x,z]of r.filter((_,i)=>i%2===0))b.bar('roof',[x,h+.08,z],[u+(x-u)*shrink,p.h+.08,v+(z-v)*shrink],.14);
      }
    }else k.cap('roof',r,h+.07);
    if(h>10)decorate(p,h);
  }
  // Two low arcades join the eastern/western annexes, retaining real negative space.
  for(const side of [-1,1]){
    const u=side*49.6,v=-21.15;
    k.openingWall(u,v,12.7,7,Math.PI,[[-4.7,.4,1.7,4.7],[-2.35,.4,1.7,4.7],[0,.4,1.7,4.7],[2.35,.4,1.7,4.7],[4.7,.4,1.7,4.7]]);
    k.openingWall(u,-17.4,12.7,7,0,[[-4.7,.4,1.7,4.7],[-2.35,.4,1.7,4.7],[0,.4,1.7,4.7],[2.35,.4,1.7,4.7],[4.7,.4,1.7,4.7]]);
    b.box('roof',[u,6.61,-19.25],[12.7,.7,3.2]);
    b.box('trim',[u,7.06,-19.25],[12.8,.15,3.85]);
    b.box('light',[u,7.22,-21.26],[12.9,.07,.07]);
  }
  // Copper dome family; 33 roof domes in the official description, including small cupolas.
  for(const p of PARTS.filter(p=>p.roof==='dome')){
    if([256936103,256936105].includes(p.id))continue;
    const [u,v]=center(p),r=(Math.max(...p.ring.map(q=>q[0]))-Math.min(...p.ring.map(q=>q[0])))/2;
    const base=p.h-p.rise;
    if(p.min)k.cylinder('stone',u,v,p.min,base,r*.95);
    else k.cylinder('stone',u,v,base-2.5,base,r*.95);
    if(near&&r>1.5)for(let i=0;i<8;i++){let a=i*Math.PI/4;k.window(u+Math.sin(a)*r*.96,base-1.7,v+Math.cos(a)*r*.96,.48,1.25,a,false);}
    k.dome(u,v,base,r,p.rise||1);
    // Finials touch the crown; full outline retained in far.
    k.cylinder('copper',u,v,p.h,p.h+.65,.10,5);
    k.put((near?new THREE.SphereGeometry(.19,6,4):new THREE.ConeGeometry(.19,.32,4)).translate(u,p.h+.65,v),'copper');
  }
  // Octagonal main dome: eight structural lobes, engaged pilasters and an open lantern.
  const u=-.57,v=-18.25,base=29,r=6.65,h=8;
  k.dome(u,v,base,r,h,true);
  for(let i=0;i<8;i++){
    const a=i*Math.PI/4,ux=u+Math.sin(a)*7.45,vz=v+Math.cos(a)*7.45;
    k.window(ux,24.3,vz,1.7,3.4,a,true);
    if(near)for(const d of [-.95,.95]){let px=ux+Math.cos(a)*d,pz=vz-Math.sin(a)*d;k.cylinder('trim',px,pz,23.8,28.7,.22,6);}
  }
  k.cylinder('copper',u,v,37,37.4,1.23,8);
  for(let i=0;i<8;i++){const a=i*Math.PI/4;k.cylinder('copper',u+Math.sin(a)*1.04,v+Math.cos(a)*1.04,37.4,39,.12,5);}
  k.dome(u,v,39,1.23,.6,false);
  // Vancouver: two legs, frock coat, head and one outstretched arm, 2 m overall.
  k.cylinder('gold',u,v,39.6,39.75,.29,8);
  for(const dx of [-.14,.14])b.bar('gold',[u+dx,39.75,v],[u+dx*.7,40.45,v],.16);
  k.put(new THREE.CylinderGeometry(.22,.32,.75,near?8:5).translate(u,40.53,v),'gold');
  k.put(new THREE.SphereGeometry(.18,near?8:5,near?6:3).translate(u,41.25,v),'gold');
  b.box('gold',[u,41.52,v],[.46,.15,.30]);
  b.bar('gold',[u-.21,40.78,v],[u-.42,40.3,v],.13);
  b.bar('gold',[u+.21,40.78,v],[u+.65,41.05,v-.12],.13);
  b.bar('gold',[u-.3,40.8,v],[u-.3,41.6,v],.05);
  // Coat of arms: paired supporters and a shield, intentionally stylised geometry.
  if(near){b.box('trim',[-.2,21.8,-34.6],[2.2,2.2,.45]);for(const s of [-1,1]){
    k.put(new THREE.SphereGeometry(.55,8,6).scale(1,1.8,.5).translate(-.2+s*1.7,21.8,-34.9),'trim');
    b.bar('copper',[-.2+s*1.7,22.5,-34.9],[-.2+s*2.1,23.5,-34.9],.12);
  }}
  // Rear library entrance: column portico (the mapped U-shaped part is open).
  const porch=parts.find(p=>p.id===256936006);
  k.shell('foundation',porch.ring,0,1.8);
  k.shell('stone',porch.ring,10.75,11.5);
  k.cap('stone',porch.ring,10.75,true); // visible soffit above the open portico
  k.cap('roof',porch.ring,11.58);
  for(const x of [-8.5,-5.1,-1.7,1.7,5.1,8.5]){
    k.cylinder('trim',x,68.9,1.8,2.35,.65,near?10:6);
    k.cylinder('stone',x,68.9,2.35,10.1,.45,near?10:6);
    k.cylinder('trim',x,68.9,10.1,10.8,.68,near?10:6);
  }
  for(let i=0;i<8;i++)b.box('foundation',[.75,(1.8-i*.225)/2,69.8+(i+.5)*.40],[11,1.8-i*.225,.42]);
  for(const x of [-4.1,-1.4,1.4,4.1]){
    k.window(x,12.4,67.36,1.7,3.1,0,true);
    k.window(x,17.5,67.36,1.7,4.1,0,false);
    if(near)k.cylinder('trim',x+.99,67.55,17.3,21.9,.15,6);
  }
  if(near){
    // The library's historical figures stand on wall brackets, not detached roof ornaments.
    const figures=[[-8.3,61.75,0],[8.1,61.75,0],[-10.8,43, -Math.PI/2],[-9.45,47,-Math.PI/2],[-9.45,51,-Math.PI/2],[-9.45,55,-Math.PI/2],[-10.8,59,-Math.PI/2],[10.55,43,Math.PI/2],[9.15,47,Math.PI/2],[9.15,51,Math.PI/2],[9.15,55,Math.PI/2],[11.05,59,Math.PI/2],[-8.3,40.2,Math.PI],[8.1,40.2,Math.PI]];
    for(const [x,z,a]of figures){
      const y=17.0,dx=Math.sin(a)*.12,dz=Math.cos(a)*.12;
      b.box('trim',[x,y+.15,z],[.85,.30,.85]);
      k.put(k.wall(new THREE.CylinderGeometry(.24,.42,1.9,6).scale(1,1,.65).translate(0,1.29,.12),x,y,z,a),'trim');
      k.put(new THREE.SphereGeometry(.26,6,4).translate(x+dx,y+2.48,z+dz),'trim');
    }
  }
  const model=b.finish();model.rotation.y=-ANGLE;model.updateMatrixWorld(true);
  // Bake orientation into buffers, leaving the runtime with an identity transform.
  for(const mesh of model.children){mesh.geometry.applyMatrix4(model.matrixWorld);mesh.geometry.normalizeNormals();mesh.geometry=mergeVertices(mesh.geometry);mesh.geometry.computeBoundingBox();mesh.geometry.computeBoundingSphere();}
  model.rotation.y=0;model.updateMatrixWorld(true);return model;
}
