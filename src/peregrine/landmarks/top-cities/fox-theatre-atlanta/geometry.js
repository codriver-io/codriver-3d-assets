import * as THREE from 'three';
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { assetBuilder } from '../../asset-geometry.js';
import { SPEC,PALETTES } from './config.js';
import { FOOTPRINTS,OSM_WAYS } from './footprint.js';
import { foxKit,mapped } from './fox-theatre-atlanta-kit.js';
export const FEATURES={dome:[5.14,12.24,24.6,5.04,7.7],minarets:[[48.6,4.4,29.0],[49.7,-9.8,26.3],[-56.5,14.25,32.2]],sign:[53.4,8.5,12.3,30.5]};
export function create({detail='near'}={}){
 const near=detail==='near',b=assetBuilder({...SPEC,palette:PALETTES.light},detail),k=foxKit(b,near),ring=id=>mapped(FOOTPRINTS[OSM_WAYS.indexOf(id)]);
 // Mapped volumes abut instead of filling the whole theater with one generic box.
 for(const [id,h]of [[1341948188,23.8],[1341948189,16.2],[1341948190,16.2],[1341948186,9.3],[1341948182,8.2],[1341948185,6.4],[208355679,5.4]])k.poly('stone',ring(id),0,h);
 // Front wall removed from temple mass; patterned courses are explicitly pierced by the entrance.
 const r=ring(1341948187);k.poly('stone',r,0,22.4,(a,c,len)=>a[1]>17.5&&c[1]>17.5&&len>20);
 const frontZ=x=>17.98-(x+5.89)*.00932,angle=.00932;
 const holes=[{x:-2.6,w:2.5,h:5.9,y:0},{x:1.75,w:1.6,h:5.5,y:0},{x:5.45,w:4.6,h:7.9,y:0},{x:9.15,w:1.6,h:5.5,y:0},{x:13.1,w:2.5,h:5.9,y:0}];
 function extent(h,y){if(y<h.y||y>h.y+h.h)return 0;const rr=h.w/2,spring=h.y+h.h-rr;return y<=spring?rr:Math.sqrt(Math.max(0,rr*rr-(y-spring)**2));}
 const ys=new Set([0,22.4]);for(let y=0;y<22.4;y+=.4)ys.add(Math.min(y,22.4));for(const h of holes){ys.add(h.h-h.w/2);ys.add(h.h);}
 const levels=[...ys].sort((a,c)=>a-c);
 for(let j=0;j<levels.length-1;j++){
  const y=levels[j],top=levels[j+1],active=holes.filter(h=>extent(h,(y+top)/2)>0);let left=-5.89,lt=left;
  for(const h of [...active,{x:16.65,w:0,h:0,y:100}]){
   const a=h.x-extent(h,y),c=h.x-extent(h,top),mat=Math.floor((y+.001)/.8)%3===2?'brick':'stone';
   if(a-left>.02||c-lt>.02)k.surface(mat,[[left,y,frontZ(left)],[a,y,frontZ(a)],[c,top,frontZ(c)],[lt,top,frontZ(lt)]]);
   left=h.x+extent(h,y);lt=h.x+extent(h,top);
  }
 }
 // Deep door recesses and arched pale voussoirs; the large entry remains a real 3 m deep void.
 for(const h of holes){k.arch('trim',h.x,h.y,frontZ(h.x)+(near?.4:.65),h.w+.65,h.h+.45,.32,angle);k.window(h.x,.1,14.2,h.w-.3,h.h-.4,angle,true);}
 k.arch('trim',5.45,0,frontZ(5.45)+.78,11.4,19.3,.66,angle);
 // Temple central upper balcony and paired clerestory lights, not a giant dark stripe.
 for(const x of [-3.7,-1.45,11.95,14.2]){k.window(x,10.9,frontZ(x)+.32,1.3,3.4,angle,true);for(const dx of [-.12,.12])if(near)b.box('trim',[x+dx,12.25,frontZ(x)+.58],[.07,2.7,.07]);}
 for(const x of [-3.7,-1.5,11.95,14.2])k.window(x,16.9,frontZ(x)+.32,.58,1.7,angle,true);
 for(const x of [3.35,4.75,6.15,7.55])k.window(x,10.8,frontZ(x)+.35,1.05,2.55,angle,true);
 b.box('trim',[5.45,10.35,18.65],[7.8,.42,1.5],angle);
 for(const x of [2.0,3.2,4.4,5.6,6.8,8.0,9.0])b.box('trim',[x,11.15,19.2],[.14,1.2,.16]);
 b.box('trim',[5.45,11.82,19.2],[7.3,.18,.24]);
 for(const x of [-2.65,12.95]){k.cyl('stone',x,14.75,22.4,.85,2.85,2.85,8);k.dome(x,14.75,23.25,2.7,1.7);}
 const [dx,dz,dy,dr,dh]=FEATURES.dome;k.cyl('trim',dx,dz,22.4,2.2,5.04,5.04,near?24:12);k.dome(dx,dz,dy,dr,dh,'tile',true);
 // Interlacing pale ribs on the glazed onion dome, geometry only. Far keeps the diamond pattern.
 const domeR=t=>t<.19?dr*(.87+t/.19*.13):t<.42?dr*(1-(t-.19)/.23*.09):t<.65?dr*(.91-(t-.42)/.23*.26):t<.87?dr*(.65-(t-.65)/.22*.39):dr*.26*(1-(t-.87)/.13);
 const count=near?16:10,steps=near?12:6;
 for(let i=0;i<count;i++)for(const twist of [-1,1])for(let j=0;j<steps;j++){
  const t=j/steps*.97,u=(j+1)/steps*.97,a=i*2*Math.PI/count+twist*t*2.3,c=i*2*Math.PI/count+twist*u*2.3;
  b.bar('trim',[dx+(domeR(t)+.12)*Math.sin(a),dy+dh*t,dz+(domeR(t)+.12)*Math.cos(a)],[dx+(domeR(u)+.12)*Math.sin(c),dy+dh*u,dz+(domeR(u)+.12)*Math.cos(c)],near?.13:.17);
 }
 k.cyl('trim',dx,dz,32.3,.5,.18,.04,8);
 // Peachtree's pair of octagonal minarets, plus the mapped west corner tower.
 for(const [x,z,top]of FEATURES.minarets){const base=x<0?23.8:9.3,radius=x<0?1.62:1.85,shaftTop=top-6.4;
  k.poly('stone',Array.from({length:8},(_,i)=>[x+radius*Math.sin(i*Math.PI/4),z+radius*Math.cos(i*Math.PI/4)]),base,shaftTop-base);
  k.cyl('trim',x,z,shaftTop,.55,radius+ .65,radius+.65,8);
  // Eight piers support an open arched lantern, leaving visible sky through the drum.
  for(let i=0;i<8;i++){const a=i*Math.PI/4;const px=x+radius*.79*Math.sin(a),pz=z+radius*.79*Math.cos(a);b.box('stone',[px,shaftTop+2.4,pz],[.43,3.7,.43],a);}
  k.cyl('trim',x,z,shaftTop+4.25,.3,radius,radius,8);k.dome(x,z,shaftTop+4.55,radius,1.85,'roof',true);
  if(near)for(let i=0;i<8;i++){const a=i*Math.PI/4;k.arch('trim',x+(radius*.82+.15)*Math.sin(a),shaftTop+.75,z+(radius*.82+.15)*Math.cos(a),1.05,2.65,.2,a);}
 }
 // Low storefront arcade wrapping both street fronts. In far every bay survives.
 function frontage(a,c,y,h,pitch,angle){const len=Math.hypot(c[0]-a[0],c[1]-a[1]),n=Math.floor(len/pitch),nx=Math.sin(angle),nz=Math.cos(angle);
  for(let i=0;i<n;i++){const t=(i+.5)/n,x=a[0]+(c[0]-a[0])*t,z=a[1]+(c[1]-a[1])*t,off=near?.32:.62;
   const largeArch=Math.abs(angle)<.1&&(i===0||i===n-1);
   k.window(x+nx*off,y,z+nz*off,len/n-1,h,angle,largeArch);if(largeArch)k.arch('trim',x+nx*(off+.3),y,z+nz*(off+.3),len/n-.6,h+.3,.23,angle);
   if(!largeArch)for(let j=0;j<4;j++){const u=(j-1.5)*(len/n-1)/4,tx=Math.cos(angle),tz=-Math.sin(angle);k.window(x+tx*u+nx*off,y+h+.35,z+tz*u+nz*off,(len/n-1)/4-.14,1.65,angle,true);}
   if(near&&largeArch)for(const u of [-.65,.65]){const tx=Math.cos(angle),tz=-Math.sin(angle);k.window(x+tx*u+nx*.55,y+h+.55,z+tz*u+nz*.55,1.05,1.75,angle,true);}
  }
 }
 // Ponce wing is a low hall in front of the higher mapped eastern volume.
 const lowRing=[[16.65,17.81],[50.43,17.49],[51.05,9.3],[24.0,8.6],[17.3,8.15]];k.poly('stone',lowRing,0,9.3);
 frontage([17.6,17.8],[49.3,17.5],.35,6.0,7,.00932);
 frontage([50.6,16.8],[54.3,-29],.3,5.1,4.2,Math.PI/2+.0806);
 // Narrow windows on the mapped upper masses and rear service elevations.
 for(const [id,h]of [[1341948188,23.8],[1341948187,22.4],[1341948189,16.2],[1341948190,16.2]]){
  const r=ring(id);let area=THREE.ShapeUtils.area(r.map(p=>new THREE.Vector2(...p)));
  for(let i=0;i<r.length;i++){const a=r[i],c=r[(i+1)%r.length],vx=c[0]-a[0],vz=c[1]-a[1],len=Math.hypot(vx,vz);if(len<7||a[1]>8&&c[1]>8)continue;
   const nx=(area>0?1:-1)*vz/len,nz=(area>0?-1:1)*vx/len,ang=Math.atan2(nx,nz),n=Math.floor(len/4.8);
   for(let j=0;j<n;j++)for(let y=3.0;y<h-3;y+=5.1){const t=(j+.5)/n;const off=near?.3:.6;k.window(a[0]+vx*t+nx*off,y,a[1]+vz*t+nz*off,1.25,2.35,ang,true);}
  }
 }
 // Crenellations on the retail parapets and auditorium south roofline.
 for(let x=-43;x<-6;x+=3.3)b.box('stone',[x,24.35,11.5],[1.3,1.1,.8]);
 for(let z=-25;z<17;z+=3.4)b.box('stone',[51.25-(z-8)*.08,9.8,z],[.8,1,1.25]);
 // Attached marquee with a closed illuminated underside; no floating canopy supports.
 b.box('red',[52.9,6.2,6.3],[6.5,1.6,10.6],.0806);
 b.box('sign',[53.0,5.3,6.3],[6.2,.18,10.3],.0806);
 b.box('sign',[56.3,6.25,6.3],[.18,.22,9.8],.0806);
 b.box('sign',[53.0,6.25,11.6],[6,.22,.18],.0806);
 if(near)for(let z=1.7;z<11;z+=.55)for(let x=50.3;x<55.8;x+=.7){const g=new THREE.SphereGeometry(.085,5,3);g.translate(x,5.12,z);b.put(g,'sign');}
 // Two-sided red blade with legible F/O/X geometry, shaped crown and gold border.
 b.box('red',[53.4,21.4,8.5],[3.1,17.8,.68]);
 for(const z of [8.95,8.05]){
  for(const x of [51.98,54.82])b.box('sign',[x,21.4,z],[.13,17.35,.1]);
  for(const y of [12.72,30.05])b.box('sign',[53.4,y,z],[2.9,.15,.1]);
  const y=25.65;b.box('sign',[52.7,y,z],[.42,3.1,.13]);b.box('sign',[53.45,y+1.35,z],[1.55,.4,.13]);b.box('sign',[53.34,y+.25,z],[1.35,.4,.13]);
  const s=new THREE.Shape();s.absellipse(0,0,.95,1.6,0,Math.PI*2,false);const hole=new THREE.Path();hole.absellipse(0,0,.53,1.18,0,Math.PI*2,true);s.holes.push(hole);k.shape('sign',s,53.4,21.2,z,z<8.5?Math.PI:0);
  b.bar('sign',[52.5,15.3,z],[54.3,18.6,z],.43,.13);b.bar('sign',[54.3,15.3,z],[52.5,18.6,z],.43,.13);
 }
 k.dome(53.4,8.5,30.3,1.53,1.2,'red',true);
 // Two diagonal structural sign brackets terminate inside the masonry and blade.
 for(const y of [13.3,24.3])b.bar('roof',[48.6,y-3,4.4],[53.1,y,8.5],.23);
 // Restrained rooftop service units sit on their actual roofs.
 if(near)for(const [x,z]of [[-35,-25],[-22,-27],[14,-22],[37,-9]]){b.box('roof',[x,x<0?24.35: x<25?22.95:9.85,z],[3,1.1,2]);}
 const root=b.finish();root.children.forEach(m=>{const g=m.geometry,p=g.attributes.position,idx=g.index,out=[],a=new THREE.Vector3(),c=new THREE.Vector3(),d=new THREE.Vector3();for(let i=0;i<idx.count;i+=3){a.fromBufferAttribute(p,idx.getX(i));c.fromBufferAttribute(p,idx.getX(i+1));d.fromBufferAttribute(p,idx.getX(i+2));if(c.sub(a).cross(d.sub(a)).lengthSq()>1e-12)out.push(idx.getX(i),idx.getX(i+1),idx.getX(i+2));}g.setIndex(out);g.normalizeNormals();m.geometry=mergeVertices(g,1e-6);m.geometry.computeBoundingBox();m.geometry.computeBoundingSphere();});root.userData.triangles=root.children.reduce((n,m)=>n+m.geometry.index.count/3,0);return root;
}
