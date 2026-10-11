import * as THREE from 'three';
import { makeKit } from './abbaye-aux-dames-kit.js';
import { PARTS, CONVENT_ANGLE, toConvent } from './abbaye-aux-dames-plan.js';
import polygonClipping from 'polygon-clipping';

export function buildConvent(parent) {
  const b=parent.b,near=parent.near;
  const owned=polygonClipping.union(...[50073918,50073922,226268608,226268614,226268615].map(id=>[PARTS[id].map(toConvent)]));
  const accept=(u,v)=>owned.some(p=>distance([u,v],p[0])<.25);
  // The convent's regular axes are 12.3° off the church axis, measured independently.
  const cb={
    accept,
    clip(ring){return polygonClipping.intersection([ring],owned).map(p=>p[0].slice(0,-1));},
    // Reuse the existing pale material so the far campus stays at eight draws.
    put(g,mat){g.rotateY(-CONVENT_ANGLE);b.put(g,mat==='stone'?'weather':mat);},
    box(mat,center,size,angle=0){if(mat==='trim'&&!accept(center[0],center[2]))return;const g=new THREE.BoxGeometry(...size);g.rotateY(angle);g.translate(...center);this.put(g,mat);},
    bar(mat,a,c,width,depth=width){
      if(mat==='trim'&&(!accept(a[0],a[2])||!accept(c[0],c[2])))return;
      const av=new THREE.Vector3(...a),cv=new THREE.Vector3(...c),dir=cv.clone().sub(av),g=new THREE.BoxGeometry(width,dir.length(),depth);
      g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0),dir.normalize()));g.translate(...av.add(cv).multiplyScalar(.5).toArray());this.put(g,mat);
    },
  };
  const k=makeKit(cb,near),outline=PARTS[50073918].map(toConvent);
  // Solid upper floor follows the actual whole outline; ground floor is separated
  // into wall ribbons, leaving a real 3 m-deep open gallery inside the cloister.
  k.solid('stone',outline,6.85,14.0);
  const wings=[[-1.9,11.7,-32.7,37.7],[11.7,62.6,23.1,37.7],[62.6,76.0,-32.7,37.7]];
  for(let i=0;i<wings.length;i++){
    const [u0,u1,v0,v1]=wings[i];
    // Courtyard faces: left/right flank and the connecting wing.
    const face=i===0?[u1,(v0+23.1)/2,1,0,23.1-v0]:i===2?[u0,(v0+23.1)/2,-1,0,23.1-v0]:[(u0+u1)/2,v0,0,-1,u1-u0];
    const [fu,fv,nx,nz,len]=face,count=Math.round(len/3.9),spacing=len/count;
    const holes=Array.from({length:count},(_,j)=>({x:(j-(count-1)/2)*spacing,y:.16,w:spacing*.68,h:5.65}));
    k.face('stone',fu,fv,0,nx,nz,len,6.85,holes,.63);
    // Rear gallery wall is an occupied building wall, not an opaque arch backing.
    if(i===0){cb.box('stone',[(u0+u1-3.5)/2,3.425,(v0+23.1)/2],[u1-u0-3.5,6.85,23.1-v0]);}
    else if(i===2){cb.box('stone',[(u0+3.5+u1)/2,3.425,(v0+23.1)/2],[u1-u0-3.5,6.85,23.1-v0]);}
    else cb.box('stone',[(u0+u1)/2,3.425,(v0+3.5+v1)/2],[u1-u0,6.85,v1-v0-3.5]);
    for(const h of holes){
      const uu=fu+nz*h.x,vv=fv-nx*h.x;
      if(near)k.arch('trim',h.w+.22,h.h+.12,.11,uu,vv,.12,nx,nz,.14,.16);
      // Upper windows sit above every arcade in both LODs.
      k.window(uu,vv,8.45,nx,nz,1.42,3.5,{mat:'glass',mullions:true,frame:near});
      if(near){
        cb.box('trim',[uu+nx*.09,12.65,vv+nz*.09],[.27,.36,.27]);
        k.window(uu-nx*3.55,vv-nz*3.55,1.1,nx,nz,1.5,4.7,{mat:'glass',frame:false,mullions:true});
      }
    }
    cb.bar('trim',[fu-nz*len/2+nx*.08,7.65,fv+nx*len/2+nz*.08],[fu+nz*len/2+nx*.08,7.65,fv-nx*len/2+nz*.08],.30,.3);
    k.hip('roof',u0,u1,v0,v1,14.16,21.5);
    buildExteriorWindows(k,cb,u0,u1,v0,v1);
    buildDormers(k,cb,u0,u1,v0,v1);
  }
  // End pavilions are broader than the flank wings and keep their tall hipped caps.
  const pavilions=[[-9.7,11.7,27.0,42.9],[62.6,79.0,27.1,43.0],[-4.6,11.7,-47.7,-32.7],[62.6,79.0,-47.4,-31.7]];
  for(const [u0,u1,v0,v1] of pavilions){
    // End blocks touch the wings; original footprint supplies the upper walls.
    k.solid('stone',[[u0,v0],[u1,v0],[u1,v1],[u0,v1]],0,6.85);
    k.hip('roof',u0,u1,v0,v1,14.16,23.0);
    buildExteriorWindows(k,cb,u0,u1,v0,v1);
    const u=(u0+u1)/2;
    // Monumental pediment dormer on the court-facing ends.
    dormer(k,cb,u,v0+2.1,0,-1,17.0,4.15,4.2,true);
    if(near)for(const edge of [u0+.25,u1-.25])for(let y=.5;y<14;y+=.6)cb.box('trim',[edge,y,v1-.1],[.55,.27,.26]);
  }
  // Clock-front vestibule projection toward the courtyard.
  cb.box('stone',[37.25,3.42,18.7],[12.45,6.84,8.8]);
  k.hip('roof',31.02,43.48,14.35,23.1,14.16,19.3);
  for(const u of [33.15,37.25,41.35]){
    k.window(u,14.33,.65,0,-1,2.5,5.5,{mat:'glass',mullions:near});
    k.window(u,14.33,8.4,0,-1,1.8,3.4,{mat:'glass',mullions:true,frame:near});
  }
  dormer(k,cb,37.25,15.9,0,-1,16.4,3.8,3.7,true);
  const clock=new THREE.CircleGeometry(.7,near?20:10);k.put(k.place(clock,37.25,15.6,18.5,0,-1,.13),'trim');
  cb.bar('iron',[37.25,18.5,15.35],[37.25,19.05,15.35],.055);
  cb.bar('iron',[37.25,18.5,15.35],[37.62,18.26,15.35],.055);
  // Mapped northeast extension, not a neighbouring apartment block.
  const northeast=PARTS[50073919].map(toConvent);
  k.solid('stone',northeast,0,14.0);
  k.hip('roof',-33.0,-19.3,-63.0,-32.8,14.2,21.5);
  k.hip('roof',-19.3,-4.65,-46.5,-32.8,14.2,20.8);
  buildExteriorWindows(k,cb,-33.0,-19.3,-63.0,-32.8);
  // Long Sainte-Anne wing and the open nineteenth-century connecting portico.
  const anne=PARTS[50073922].map(toConvent);
  k.solid('stone',anne,0,11.2);k.hip('roof',-81.9,-72.5,-33.5,27.5,11.35,16.7);
  k.hip('roof',-81.7,-72.3,-41.55,-30.4,11.35,17.0);
  buildExteriorWindows(k,cb,-81.9,-72.5,-33.5,27.5,11.2);
  const gallery=PARTS[226268608].map(toConvent);
  k.solid('stone',gallery,5.85,6.35);
  k.hip('roof',-72.5,-2.0,22.55,27.4,6.5,8.3);
  const slots=Array.from({length:17},(_,i)=>({x:(i-8)*4.05,y:.1,w:2.62,h:5.4}));
  for(const [v,nz] of [[22.6,-1],[27.4,1]])k.face('stone',-37.25,v,0,0,nz,70.5,5.85,slots,.5);
  for(const id of [226268614,226268615]){
    const ring=PARTS[id].map(toConvent);k.solid('stone',ring,0,7.9);
    const u0=Math.min(...ring.map(p=>p[0])),u1=Math.max(...ring.map(p=>p[0])),v0=Math.min(...ring.map(p=>p[1])),v1=Math.max(...ring.map(p=>p[1]));
    k.loft('roof',ring,()=>8.05);
    for(let u=u0+1.6;u<u1-1;u+=3.4)k.window(u,v1,1.1,0,1,1.5,4.7,{mat:'glass',mullions:near,frame:near});
  }
}

function distance(p,ring){
 let inside=false,best=Infinity;for(let i=0,j=ring.length-1;i<ring.length;j=i++){
  const a=ring[j],c=ring[i];if((a[1]>p[1])!==(c[1]>p[1])&&p[0]<(c[0]-a[0])*(p[1]-a[1])/(c[1]-a[1])+a[0])inside=!inside;
  const du=c[0]-a[0],dv=c[1]-a[1],len=du*du+dv*dv,t=len?Math.max(0,Math.min(1,((p[0]-a[0])*du+(p[1]-a[1])*dv)/len)):0;best=Math.min(best,Math.hypot(p[0]-a[0]-t*du,p[1]-a[1]-t*dv));
 }return inside?0:best;
}

function buildExteriorWindows(k,b,u0,u1,v0,v1,height=14) {
  // Exterior openings are surfaces offset from masonry by >5 cm; repetitive
  // small muntins are omitted in far while the window rhythm remains.
  for(const [u,v,nx,nz,len] of [[(u0+u1)/2,v0,0,-1,u1-u0],[(u0+u1)/2,v1,0,1,u1-u0],[u0,(v0+v1)/2,-1,0,v1-v0],[u1,(v0+v1)/2,1,0,v1-v0]]){
    const count=Math.max(1,Math.floor(len/4.5));
    for(let i=0;i<count;i++){
      const x=(i-(count-1)/2)*len/(count+.3),uu=u+nz*x,vv=v-nx*x;
      // Courtyard arcades are handled independently; avoid closing their openings.
      const inner=(Math.abs(uu-11.7)<.1&&vv<23.15&&vv>-32.75)||(Math.abs(uu-62.6)<.1&&vv<23.15&&vv>-32.75)||(Math.abs(vv-23.1)<.1&&uu>11.7&&uu<62.6);
      if(inner)continue;
      for(const y of height<13?[1.4,7.0]:[1.1,8.45])k.window(uu,vv,y,nx,nz,1.65,height<13?2.8:y<5?4.7:3.5,{mat:'glass',mullions:true,frame:k.near});
    }
    b.bar('trim',[u-nz*len/2+nx*.07,height-.35,v+nx*len/2+nz*.07],[u+nz*len/2+nx*.07,height-.35,v-nx*len/2+nz*.07],.24,.25);
  }
}

function buildDormers(k,b,u0,u1,v0,v1) {
  if(v1-v0>u1-u0){
    for(const [u,nx] of [[u0+2.35,-1],[u1-2.35,1]])for(let v=v0+9;v<v1-6;v+=k.near?4.8:9.6)dormer(k,b,u,v,nx,0,16.7,1.45,2.4);
  }else for(const [v,nz] of [[v0+2.35,-1],[v1-2.35,1]])for(let u=u0+8;u<u1-5;u+=k.near?4.8:9.6)dormer(k,b,u,v,0,nz,16.7,1.45,2.4);
  if(k.near){
    const u=(u0+u1)/2,v=(v0+v1)/2;
    b.box('stone',[u,21.35,v],[1.3,3.4,1.2]);b.box('trim',[u,23.12,v],[1.5,.23,1.4]);
  }
}

function dormer(k,b,u,v,nx,nz,y,w,h,pediment=false) {
  // A supported shallow box intersects the roof slope at its bottom.
  b.box('stone',[u-nx*.32,y+h/2,v-nz*.32],[nx?w*.95:w,h,nx?w:w*.95]);
  k.window(u+nx*w*.475,v+nz*w*.475,y+.30,nx,nz,w*.64,h-.7,{mat:'glass',mullions:true,frame:k.near});
  const fu=u+nx*w*.50,fv=v+nz*w*.50;
  k.panel('trim',[[-w*.62,0],[w*.62,0],[0,pediment?1.3:.65]],fu,fv,y+h,nx,nz,.08);
  if(pediment){
    b.bar('weather',[fu-nz*w*.63,y+h,fv+nx*w*.63],[fu,y+h+1.3,fv],.16);
    b.bar('weather',[fu+nz*w*.63,y+h,fv-nx*w*.63],[fu,y+h+1.3,fv],.16);
  }
  // Closed little slate cap, including rear slope, never a floating front triangle.
  const capHeight=pediment?1.3:.65,cap=new THREE.ConeGeometry(w*.82,capHeight,4);
  cap.rotateY(Math.PI/4);cap.translate(u,y+h+capHeight/2,v);k.put(cap,'roof');
}
