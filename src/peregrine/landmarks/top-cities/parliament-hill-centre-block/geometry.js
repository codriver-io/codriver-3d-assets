import * as THREE from 'three';
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';
import { ANGLE, PARTS } from './parliament-hill-centre-block-site.js';
import { kit } from './parliament-hill-centre-block-kit.js';
import { WINGS, COURTS, REPLACED_PARTS, roofPart, completeRoof } from './parliament-hill-centre-block-roofs.js';

export const worldPoint=([u,y,v])=>[u*Math.sin(ANGLE)+v*Math.cos(ANGLE),y,-u*Math.cos(ANGLE)+v*Math.sin(ANGLE)];
export function create({detail='near'}={}) {
  const near=detail==='near',b=assetBuilder({...SPEC,palette:PALETTES.light},detail),k=kit(b,near);
  const inside=(r,u,v)=>{let yes=false;for(let i=0,j=r.length-1;i<r.length;j=i++){const a=r[i],c=r[j];if((a[1]>v)!==(c[1]>v)&&u<(c[0]-a[0])*(v-a[1])/(c[1]-a[1])+a[0])yes=!yes;}return yes;};
  const rect=(u,v,w,d)=>[[u-w/2,v-d/2],[u+w/2,v-d/2],[u+w/2,v+d/2],[u-w/2,v+d/2]];
  const center=r=>[(Math.min(...r.map(p=>p[0]))+Math.max(...r.map(p=>p[0])))/2,(Math.min(...r.map(p=>p[1]))+Math.max(...r.map(p=>p[1])))/2];
  const body=[...PARTS.filter(p=>{const [u,v]=center(p.ring);return v>-76&&!(Math.abs(u)<8&&v>-9)&&p.h>2&&!REPLACED_PARTS.has(p.id);}),...WINGS.map(roofPart),...COURTS.map(roofPart)].map(p=>({...p,min:p.min===29?0:p.min,ring:k.ring(p.ring)}));
  const occupied=(id,u,y,v)=>body.some(p=>p.id!==id&&y>p.min+.01&&y<p.h-p.rise-.05&&inside(p.ring,u,v));
  // Foundation follows actual wall volumes, rather than the larger provider envelope.
  for(const p of body)if(p.min===0)k.shell('foundation',p.ring,0,1.05,false);
  for(const p of body){
    const r=p.ring,h=p.h-p.rise,[u,v]=center(r),w=Math.max(...r.map(q=>q[0]))-Math.min(...r.map(q=>q[0]));
    k.shell('stone',r,Math.max(1,p.min),h,false);
    const material=p.material||([352599208,352602438,352602439,352602441,352602442].includes(p.id)?'slate':'copper');
    if(p.rise){
      if(p.roof==='complete-hip'){
        completeRoof(k,p);
      } else if(p.roof==='skillion'){
        const a=(p.direction-59.0967933347)*Math.PI/180,proj=r.map(([x,z])=>x*Math.sin(a)-z*Math.cos(a)),lo=Math.min(...proj),hi=Math.max(...proj);
        const ys=proj.map(t=>p.h-p.rise*(t-lo)/(hi-lo));
        const g=new THREE.BufferGeometry(),verts=r.map(([x,z],i)=>[x,ys[i],z]);
        const ix=THREE.ShapeUtils.triangulateShape(r.map(([x,z])=>new THREE.Vector2(x,-z)),[]).flat();
        g.setAttribute('position',new THREE.Float32BufferAttribute(verts.flat(),3));g.setIndex(ix);k.put(g,material);
        for(let i=0;i<r.length;i++){const j=(i+1)%r.length;k.face(material,[[r[i][0],h,r[i][1]],[r[i][0],ys[i],r[i][1]],[r[j][0],ys[j],r[j][1]],[r[j][0],h,r[j][1]]]);}
      } else {
        const top=r.map(([x,z])=>[u+(x-u)*.48,v+(z-v)*.48]);k.loft(material,r,top,h,p.h);
        if(near)for(const [x,z]of r)b.bar(material,[x,h+.08,z],[u+(x-u)*.48,p.h+.08,v+(z-v)*.48],.09);
      }
    } else k.cap('copper',r,h+.08);
    // Interior infill roofs close the courts below the surrounding main ridge.
    if(COURTS.some(c=>c.id===p.id))continue;
    // Ornament only exposed edges.
    for(let i=0;i<r.length;i++){
      const a=r[i],c=r[(i+1)%r.length],dx=c[0]-a[0],dz=c[1]-a[1],len=Math.hypot(dx,dz);if(len<2.1)continue;
      const nx=dz/len,nz=-dx/len,angle=Math.atan2(nx,nz),pos=t=>[a[0]+dx*t+nx*.05,a[1]+dz*t+nz*.05];
      const floors=h>=18?[2.3,7.7,13.1,17.3,22.5,28.0]:[2,7.5,11.2];
      const count=Math.max(1,Math.floor(len/(near?3.5:5.4)));
      for(const y of floors){if(y+2.4>h-.5||y<p.min)continue;for(let j=0;j<count;j++){
        const [x,z]=pos((j+.5)/count);if(occupied(p.id,x+nx*.25,y+1,z+nz*.25))continue;
        k.window(x,y,z,Math.min(1.65,len/count*.56),y===17.3?1.7:3.4,angle,near&&(y===2.3||y===13.1));
      }}
      for(const y of near?[1.6,6.8,12.3,h-.3]:[h-.3]){if(y<=p.min)continue;const n=Math.ceil(len/3);for(let j=0;j<n;j++){
        const [x,z]=pos((j+.5)/n);if(occupied(p.id,x+nx*.3,y,z+nz*.3))continue;
        k.put(k.wall(new THREE.PlaneGeometry(len/n+.01,.22).translate(0,0,.30),x,y,z,angle),'trim');
      }}
      if(near&&h>18){const n=Math.ceil(len/6);for(let j=0;j<=n;j++){const [x,z]=pos((j+.18)/(n+.36));if(occupied(p.id,x+nx*.4,h-.3,z+nz*.4))continue;b.box('stone',[x+nx*.17,h/2,z+nz*.17],[.45,h-1,.45]);k.pinnacle(x+nx*.17,z+nz*.17,h-1,2,.22);}}
    }
    // Pavilion corner turrets and tall masonry chimneys animate the low roofline.
    if(typeof p.id==='number'&&material==='slate')for(const [x,z]of rect(u,v,w*.85,w*.85)){
      k.cylinder('stone',x,z,1,p.h-p.rise+1,.45,near?8:4);k.pinnacle(x,z,p.h-p.rise+.4,1.8,.27);
    }
  }
  // Solid dormers, with a glazed front instead of a pane laid onto a coplanar wall.
  // All cheeks and roof slopes embed in the supporting roof, including the far cadence.
  for(const p of WINGS){
    const [u0,u1,v0,v1]=p.bounds,alongU=u1-u0>v1-v0;
    const span=alongU?u1-u0:v1-v0,depth=alongU?v1-v0:u1-u0;
    const n=Math.max(1,Math.floor(span/(near?5:9)));
    for(const side of [-1,1])for(let i=0;i<n;i++){
      const t=(i+.5)/n;
      const x=alongU?u0+t*span:(u0+u1)/2+side*depth*.31;
      const z=alongU?(v0+v1)/2+side*depth*.31:v0+t*span;
      if(Math.abs(x)<8&&z>-24)continue;
      const a=alongU?(side>0?0:Math.PI):(side>0?Math.PI/2:-Math.PI/2);
      const y=p.h-p.rise+p.rise*.40,w=near?1.35:1.65,hh=1.65,d=1.65;
      const put=(g,m)=>k.put(k.wall(g,x,y,z,a),m);
      // The front itself is glass, avoiding layered far overlays.
      put(new THREE.PlaneGeometry(w,hh).translate(0,hh/2,d/2),'glass');
      put(new THREE.PlaneGeometry(d,hh).rotateY(Math.PI/2).translate(w/2,hh/2,0),p.material);
      put(new THREE.PlaneGeometry(d,hh).rotateY(-Math.PI/2).translate(-w/2,hh/2,0),p.material);
      const shape=new THREE.Shape([[-w/2,0],[w/2,0],[0,.85]].map(q=>new THREE.Vector2(...q)));
      put(new THREE.ExtrudeGeometry(shape,{depth:d,bevelEnabled:false}).translate(0,hh,-d/2),p.material);
    }
    // Chimneys are continuous masonry down through the roof; fewer survive in far.
    if(alongU)for(let u=u0+4;u<u1-2;u+=near?9:18){
      if(Math.abs(u)<8&&v1>-24)continue;
      const v=(v0+v1)/2;
      b.box('stone',[u,p.h-1,v],[.75,6,.9]);
      if(near)b.box('trim',[u,p.h+2.1,v],[.95,.25,1.1]);
    }
  }
  // Peace Tower: genuine entrance passage, four buttressed elevations and clock stage.
  k.opening(0,5.2,10.2,11.5,0,5.5,7.6);
  k.opening(0,-4.8,10.2,11.5,Math.PI,5.5,7.6);
  for(const side of [-1,1])b.box('stone',[side*4.7,5.75,.2],[.8,11.5,10]);
  b.box('stone',[0,35.3,.2],[9.4,47.6,10]);
  for(const u of [-5.5,5.5])for(const v of [-5.1,5.3]){
    k.cylinder('stone',u,v,0,60.5,.74,near?8:5);
    for(const y of [12,27,43,59.5])k.cylinder('trim',u,v,y,y+.4,.86,near?8:5);
    k.pinnacle(u,v,60.5,8.4,.63);
  }
  for(const a of [0,Math.PI/2,Math.PI,Math.PI*1.5]){
    const at=(x,y,out=5.23)=>[Math.cos(a)*x+Math.sin(a)*out,y,.2-Math.sin(a)*x+Math.cos(a)*out];
    for(const [y,h]of [[13,11],[29,9],[44,8]])for(const x of [-2.1,0,2.1]){const [u,yy,v]=at(x,y);k.window(u,yy,v,1.38,h,a);}
    for(const x of [-2.8,-.9,.9,2.8]){const [u,y,v]=at(x,53);k.window(u,y,v,1.05,5.8,a);if(near)for(let yy=54;yy<58;yy+=.55)k.put(k.wall(new THREE.PlaneGeometry(.85,.12).translate(0,0,.4),u,yy,v,a),'trim');}
    const [u,y,v]=at(0,63.5,4.4);
    k.put(k.wall(new THREE.CircleGeometry(2.38,near?32:16).translate(0,0,.24),u,y,v,a),'light');
    k.put(k.wall(new THREE.RingGeometry(2.38,2.62,near?32:16).translate(0,0,.34),u,y,v,a),'trim');
    for(let n=0;n<12;n++){
      const t=n*Math.PI/6;const g=new THREE.PlaneGeometry(.13,.38).rotateZ(-t).translate(Math.sin(t)*2.02,Math.cos(t)*2.02,.38);k.put(k.wall(g,u,y,v,a),'glass');
    }
    for(const [ang,l]of [[-.55,1.8],[2.1,1.25]]){const g=new THREE.PlaneGeometry(.18,l).translate(0,l/2,0).rotateZ(ang).translate(0,0,.41);k.put(k.wall(g,u,y,v,a),'glass');}
    // Projecting gargoyles are stone cantilevers rooted in the corner cornice.
    if(near)for(const x of [-5.4,5.4]){const p=at(x,59.8,5.3),q=at(x*1.10,60.2,7);b.bar('stone',p,q,.25);}
  }
  b.box('stone',[0,63.6,.2],[8.3,9,8.3]);
  for(const y of [59.1,67.9])b.box('trim',[0,y,.2],[9.1,.5,9.1]);
  k.loft('copper',rect(0,.2,8.6,8.6),rect(0,.2,.9,.9),68.2,86.1);
  k.cylinder('foundation',0,.2,86.1,92.2,.09,near?6:4);
  // Canadian flag: red bars, white centre and a geometric maple-leaf silhouette.
  const flag=(mat,x0,x1)=>{k.face(mat,[[x0,91.85,.2],[x0,90.5,.2],[x1,90.65,.35],[x1,92,.35]]);k.face(mat,[[x1,92,.35],[x1,90.65,.35],[x0,90.5,.2],[x0,91.85,.2]]);};
  flag('red',.05,.75);flag('light',.75,2.0);flag('red',2,2.7);
  const leaf=new THREE.Shape([[-.12,-.5],[.12,-.5],[.12,-.22],[.45,-.05],[.25,.08],[.35,.28],[.12,.21],[0,.48],[-.12,.21],[-.35,.28],[-.25,.08],[-.45,-.05],[-.12,-.22]].map(p=>new THREE.Vector2(...p)));
  // One leaf on each side of the white band, mirrored about its z at the leaf centre:
  // +z leaf 0.12m in front, -z-facing leaf 0.12m behind, so each shows from its own side.
  const bandZ=.2+.15*(1.37-.75)/1.25,lg=k.shape(leaf).translate(1.37,91.3,.39);
  k.put(lg,'red');k.put(lg.clone().rotateY(Math.PI).translate(2.74,0,2*bandZ),'red');
  // Entrance staircase runs continuously from grade into the open tower portal.
  for(let i=0;i<10;i++)b.box('foundation',[0,(1.5-i*.15)/2,5.5+(i+.5)*.58],[16+i*.7,1.5-i*.15,.6]);
  // Library of Parliament: polygonal buttressed drum and two steep conical roof tiers.
  const lib=PARTS.find(p=>p.id===948592488),r=k.ring(lib.ring),[lu,lv]=center(r);
  k.shell('stone',r,0,10,false);
  for(let i=0;i<r.length;i++){
    const a=r[i],c=r[(i+1)%r.length],dx=c[0]-a[0],dz=c[1]-a[1],len=Math.hypot(dx,dz);if(len<3)continue;
    const angle=Math.atan2(dz/len,-dx/len);k.window((a[0]+c[0])/2,2,(a[1]+c[1])/2,Math.min(2.8,len*.55),6.5,angle);
  }
  const drum=PARTS.find(p=>p.id===948592487).ring.map(([x,z])=>[lu+(x-lu)*.84,lv+(z-lv)*.84]);k.shell('stone',drum,10,33,false);
  k.loft('copper',r,r.map(([x,z])=>[lu+(x-lu)*.70,lv+(z-lv)*.70]),10,23.3);
  k.loft('copper',k.ring(drum),k.ring(drum).map(([x,z])=>[lu+(x-lu)*.04,lv+(z-lv)*.04]),33,50);
  k.cylinder('copper',lu,lv,49.8,57.6,.35,near?8:5);
  k.pinnacle(lu,lv,57.5,.5,.19,'copper');
  const count=near?16:12,rad=13.3;
  for(let i=0;i<count;i++){
    const a=i*2*Math.PI/count,u=lu+Math.sin(a)*rad,v=lv+Math.cos(a)*rad;
    k.window(u,24.1,v,2.1,7.6,a,near);
    const x=lu+Math.sin(a)*19.8,z=lv+Math.cos(a)*19.8;
    k.cylinder('stone',x,z,0,14.2,.65,near?7:4);k.pinnacle(x,z,14.2,3.6,.5);
    if(near)b.bar('stone',[x,9.4,z],[u,30.8,v],.38);
    b.bar('copper',[u,33.1,v],[lu,50,lv],near?.10:.08);
    // Tall pointed gables around the library lantern drum.
    const g=new THREE.Shape([[-1.5,0],[1.5,0],[0,4.5]].map(p=>new THREE.Vector2(...p)));
    k.put(k.wall(k.shape(g).translate(0,0,.10),u,31.6,v,a),'trim');
  }
  // Centennial Flame, OSM way 296732958: geographic centroid converted to u/v.
  // Fountain is not a building extrusion; its tiny base is separate from the provider masks.
  const fu=1.678,fv=139.158;
  k.cylinder('foundation',fu,fv,0,.50,3.8,12);
  k.cylinder('stone',fu,fv,.5,.8,3.6,12);
  k.cylinder('stone',fu,fv,.8,.83,3.1,12);
  k.cylinder('stone',fu,fv,.83,1.2,.9,12);
  k.put(new THREE.ConeGeometry(.36,1.0,near?7:4).translate(fu,1.7,fv),'light');
  const model=b.finish();
  // Bake the mapped 59.0968-degree facade axis into exported vertices once.
  const rot=new THREE.Matrix4().makeRotationY(Math.PI/2-ANGLE);
  for(const mesh of model.children){mesh.geometry.applyMatrix4(rot);mesh.geometry=mergeVertices(mesh.geometry);mesh.geometry.computeBoundingBox();mesh.geometry.computeBoundingSphere();}
  return model;
}
