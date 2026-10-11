import * as THREE from 'three';
import { PARTS, CHURCH_V as V } from './abbaye-aux-dames-plan.js';
import polygonClipping from 'polygon-clipping';

export function buildChurch(k) {
  const {b,near}=k;
  // Actual masonry envelope, including the narrow buttresses and curved chevet.
  k.solid('stone',PARTS[155702894],0,8.4);
  k.solid('stone',PARTS[398955969],8.4,18.2);
  k.gable('roof',-23.55,24.45,55.55,67.42,18.2,23.65);
  k.gable('roof',35.15,48.25,56.6,67.25,18.2,23.3);
  // Transept roof, ridge across the nave, interrupted by the crossing tower.
  for(const [u0,u1] of [[24.45,29.8],[29.8,35.15]])
    k.loft('roof',[[u0,45.9],[u1,45.9],[u1,77.6],[u0,77.6]],(u)=>18.2+4.7*(1-Math.abs(u-29.8)/5.35));
  const apse=PARTS[398955969].slice(0,17),centre=[48.25,61.7];
  for(let i=0;i<apse.length-1;i++)k.loft('roof',[apse[i],apse[i+1],centre],(u,v)=>Math.max(18.2,23.3-Math.hypot(u-centre[0],v-centre[1])*.75));
  // Low lean-to aisles under the clerestory, not a second full-width roof.
  const lowerRoof=polygonClipping.intersection(polygonClipping.difference([PARTS[155702894]],[PARTS[398955969]]),[[[-16.5,45], [57,45], [57,80], [-16.5,80]]]);
  for(const polygon of lowerRoof){
    const ring=polygon[0].slice(0,-1),area=Math.abs(ring.reduce((a,p,i)=>a+p[0]*ring[(i+1)%ring.length][1]-ring[(i+1)%ring.length][0]*p[1],0))/2;
    if(area<1.5)continue;
    k.loft('roof',ring,(u,v)=>8.65+3.15*Math.max(0,1-distance([u,v],PARTS[398955969])/4.4));
  }
  // Nave facade rhythm: one aisle arch and paired blind clerestory arches per bay.
  for(const sign of [-1,1]){
    for(let u=-12.3;u<23;u+=5.45){
      const outer=wallAt(PARTS[155702894],u,sign),upper=wallAt(PARTS[398955969],u,sign);
      k.window(u,outer,1.7,0,sign,1.75,4.7);
      k.window(u,upper,12.5,0,sign,1.6,3.45);
      if(near)for(const dx of [-1.75,1.75])k.arch('trim',1.43,3.5,.09,u+dx,upper,12.45,0,sign,.09,.10);
      b.box('trim',[u+2.7,13.7,upper+sign*.07],[.28,9,.35]);
      if(near)for(let y=1.1;y<8;y+=1.05)b.box('iron',[u+2.7,y,outer+sign*.065],[.62,.11,.11]);
    }
    const upper=wallAt(PARTS[398955969],4,sign);
    b.box('trim',[4,17.85,upper+sign*.12],[39.7,.38,.54]);
    for(let u=-15;u<24;u+=near?.85:1.7)b.box('trim',[u,17.42,wallAt(PARTS[398955969],u,sign)+sign*.22],[.30,.48,.48]);
  }
  // Transept end windows and buttresses follow the visible cross arms.
  for(const nz of [-1,1]){
    for(const u of [26.6,32.9]){
      k.window(u,wallAt(PARTS[155702894],u,nz),2.3,0,nz,2.0,4.6,{offset:.16});
      k.window(u,wallAt(PARTS[398955969],u,nz),11.3,0,nz,1.8,4.5,{offset:.16});
    }
    for(const u of [24.65,29.8,34.9])b.box('trim',[u,8.8,wallAt(PARTS[155702894],u,nz)-nz*.03],[.4,17.6,.25]);
  }
  // Place relief on the actual polygon, rather than an assumed circle hidden
  // behind its asymmetric walls. Four broad pilaster strips frame the east bays.
  for(let i=0;i<7;i++){
    const a=-Math.PI/2+(i+.5)*Math.PI/7;
    for(const [ring,y,w] of [[PARTS[155702894],3,1.32],[PARTS[398955969],12.2,1.5]]){
      const {u,v,nx,nz}=radialWall(ring,a);
      k.window(u,v,y,nx,nz,w,3.7,{offset:.17});
    }
  }
  for(const i of [2,3,4,5]){
    const {u,v,nx,nz}=radialWall(PARTS[398955969],-Math.PI/2+i*Math.PI/7);
    b.box('trim',[u+nx*.12,9.08,v+nz*.12],[.64,18.04,.48],Math.atan2(nx,nz));
  }
  for(let i=0;i<apse.length-1;i++){
    const a=apse[i],c=apse[i+1],du=c[0]-a[0],dv=c[1]-a[1],length=Math.hypot(du,dv);
    if(length<.1)continue;
    b.box('trim',[(a[0]+c[0])/2,17.88,(a[1]+c[1])/2],[length+.06,.40,.55],-Math.atan2(dv,du));
  }
  // Rounded transept chapels and small east appendage already included in the ground envelope.
  buildWestFront(k);buildCrossing(k);
}

function buildWestFront(k) {
  const {b,near}=k,front=-23.90;
  // The central facade has two triple arcades and a small round-headed gable opening.
  b.box('stone',[-20.0,9.15,V],[7.5,18.3,12.4]);
  for(const y of [8.5,13.8])for(const v of [V-3.15,V,V+3.15]){
    k.window(front,v,y,-1,0,2.2,y===8.5?4.2:3.25);
    if(near)k.arch('stone',2.9,y===8.5?4.7:3.7,.13,front,v,y-.04,-1,0,.22,.18);
  }
  for(const y of [8,13.55,18.0])b.box('trim',[front-.13,y,V],[.36,.28,12.8]);
  for(let v=V-5.7;v<V+6;v+=near?.8:1.6)b.box('trim',[front-.22,17.52,v],[.52,.46,.30]);
  b.box('stone',[front-.09,18.36,V],[.40,.34,12.7]);
  b.box('trim',[front-.12,18.62,V],[.42,.19,12.2]);
  k.panel('stone',[[-6.3,0],[6.3,0],[0,5.25]],front,V,18.2,-1,0,.08);
  for(const sign of [-1,1])b.bar('trim',[front-.16,18.3,V+sign*6.3],[front-.16,23.7,V],.2,.22);
  k.window(front,V,18.6,-1,0,.72,1.65);
  b.bar('iron',[front,23.45,V],[front,24.35,V],.10);
  b.bar('iron',[front,23.98,V-.35],[front,23.98,V+.35],.08);
  // Triple west portal, burgundy doors and deeply layered concentric archivolts.
  for(const [v,w,h] of [[V,5.85,7.0],[53.85,3.4,5.3],[69.55,3.4,5.3]]){
    const pf=v===V?front:v<V?-24.70:-24.88;
    k.window(pf,v,.08,-1,0,w,h,{frame:false});
    k.panel('door',[[-w*.28,0],[w*.28,0],[w*.28,h*.6],[-w*.28,h*.6]],pf,v,.10,-1,0,.12);
    const layers=near?(w>4?4:3):2;
    for(let i=0;i<layers;i++)k.arch(i%2?'stone':'trim',w+.42+i*.48,h+.18+i*.25,.18,pf,v,.05,-1,0,.28+i*.13,.2);
    if(w>4){
      b.box('trim',[front-.30,2.0,v],[.48,4, .38]);
      k.panel('iron',k.archPoints(3.8,1.5),front,v,4.12,-1,0,.20);
      if(near){
        for(const dv of [-1.05,0,1.05]){k.cylinder('trim',front-.28,v+dv,.21,4.4,4.95,8);b.box('trim',[front-.30,4.36,v+dv],[.3,.55,.38]);}
        for(let j=0;j<17;j++){const a=(j+.5)*Math.PI/17;b.box('iron',[front-.77,4.18+Math.sin(a)*3.0,v+Math.cos(a)*3.0],[.13,.19,.18]);}
      }
    }
  }
  // Each west tower is a square masonry shaft, with recessed belfry slots and a pierced crown.
  for(const id of [398955971,398955972]){
    const ring=PARTS[id],umin=Math.min(...ring.map(p=>p[0])),umax=Math.max(...ring.map(p=>p[0])),vmin=Math.min(...ring.map(p=>p[1])),vmax=Math.max(...ring.map(p=>p[1]));
    const u=(umin+umax)/2,v=(vmin+vmax)/2,w=umax-umin,d=vmax-vmin;
    k.solid('stone',ring,0,20.0);
    k.solid('stone',ring,29.7,32.46);
    const faces=[[umin,v,-1,0,d],[umax,v,1,0,d],[u,vmin,0,-1,w],[u,vmax,0,1,w]];
    // Solid dark core prevents a view straight through the belfry; exterior voids remain real.
    b.box('recess',[u,24.4,v],[w-1.5,8.8,d-1.5]);
    for(const [fu,fv,nx,nz,width] of faces){
      const holes=Array.from({length:5},(_,i)=>({x:(i-2)*width/5.6,y:.6,w:width/11.6,h:7.55}));
      k.face('stone',fu,fv,20,nx,nz,width,9.7,holes,.5);
      for(const hole of holes)k.arch('trim',hole.w+.15,hole.h+.09,.075,fu+nz*hole.x,fv-nx*hole.x,20.55,nx,nz,.13,.15);
      // Middle tier of three wider blind arcades and a single lower slit.
      for(const x of [-width*.31,0,width*.31])k.window(fu+nz*x,fv-nx*x,13.65,nx,nz,width*.21,4.55,{mat:'iron'});
      for(let i=0;i<5;i++){
        const x=(i-2)*width/5.6;
        k.window(fu+nz*x,fv-nx*x,18.55,nx,nz,width/7.5,1.04,{mat:'iron',frame:near});
      }
      k.window(fu,fv,8.75,nx,nz,.75,2.1);
      const circles=near?6:4;
      for(let i=0;i<circles;i++)k.window(fu+nz*(i-(circles-1)/2)*width/(circles+.5),fv-nx*(i-(circles-1)/2)*width/(circles+.5),30.1,nx,nz,.52,.75,{frame:false});
      const crown=Array.from({length:near?8:6},(_,i)=>({x:(i-(near?7:5)/2)*width/(near?8.7:6.7),y:.26,w:.42,h:.93,arch:false}));
      k.face('trim',fu,fv,32.4,nx,nz,width,1.35,crown,.22);
      b.bar('stone',[fu+nz*(-width/2),33.87,fv-nx*(-width/2)],[fu+nz*width/2,33.87,fv-nx*width/2],.26,.27);
      if(near)for(let x=-width/2+.35;x<width/2;x+=.7){
        b.box('trim',[fu+nz*x+nx*.13,31.95,fv-nx*x+nz*.13],[.3,.6,.3]);
        b.bar('trim',[fu+nz*x+nx*.12,31.6,fv-nx*x+nz*.12],[fu+nz*x+nx*.40,32.2,fv-nx*x+nz*.40],.15);
      }
    }
    for(const y of [8.15,13.05,19.9,29.95,32.35])b.box('trim',[u,y,v],[w+.24,.27,d+.24]);
    b.box('roof',[u,32.3,v],[w-.48,.12,d-.48]);
    // Engaged round stair turret, at the rear/outer corner (not a western spire).
    const tv=id===398955971?vmin+.45:vmax-.45,tu=umax-.45;
    k.cylinder('stone',tu,tv,1.3,0,32.55,near?16:10);
    for(const y of [13.1,19.9,29.9,32.55])k.cylinder('trim',tu,tv,1.4,y-.13,y+.13,near?16:10);
    const nz=id===398955971?-1:1;
    for(const y of [5,10,16,23,28])k.window(tu+.92,tv+nz*.92,y,Math.SQRT1_2,nz*Math.SQRT1_2,.30,1.4,{frame:false});
    if(near)for(let y=.9;y<20;y+=.85){
      for(const [fu,fv,nx,nz,width] of faces)k.panel('iron',[[-width/2,0],[width/2,0],[width/2,.045],[-width/2,.045]],fu,fv,y,nx,nz,.055);
    }
    for(const [uu,vv] of [[umin,vmin],[umin,vmax],[umax,vmin],[umax,vmax]]){
      b.box('stone',[uu,14.85,vv],[.65,29.7,.65]);
      b.box('trim',[uu,1.23,vv],[.86,2.34,.86]);
    }
  }
}

function buildCrossing(k) {
  const {b,near}=k,u=29.8,v=61.55,w=10.35;
  b.box('stone',[u,21.85,v],[w,7.3,w]);
  b.box('recess',[u,26.1,v],[w-1.4,5.4,w-1.4]);
  for(const [fu,fv,nx,nz] of [[u-w/2,v,-1,0],[u+w/2,v,1,0],[u,v-w/2,0,-1],[u,v+w/2,0,1]]){
    const holes=Array.from({length:3},(_,i)=>({x:(i-1)*2.4,y:.55,w:1.22,h:4.8}));
    k.face('stone',fu,fv,23.4,nx,nz,w,5.6,holes,.5);
    for(const h of holes)k.arch('trim',h.w+.28,h.h+.12,.13,fu+nz*h.x,fv-nx*h.x,23.92,nx,nz,.15,.18);
    if(near)for(let x=-4.8;x<5;x+=.8)b.box('trim',[fu+nz*x+nx*.07,28.82,fv-nx*x+nz*.07],[.23,.3,.24]);
  }
  b.box('trim',[u,29.15,v],[10.65,.4,10.65]);
  const cone=new THREE.ConeGeometry(7.43,6.4,4);cone.rotateY(Math.PI/4);cone.translate(u,32.5,v);k.put(cone,'roof');
  b.bar('iron',[u,35.58,v],[u,35.95,v],.10);
  b.bar('iron',[u-.27,35.79,v],[u+.27,35.79,v],.08);
}

function wallAt(ring,u,sign){
 const hits=[];for(let i=0;i<ring.length;i++){const a=ring[i],c=ring[(i+1)%ring.length];if(u<Math.min(a[0],c[0])||u>Math.max(a[0],c[0])||Math.abs(c[0]-a[0])<1e-5)continue;hits.push(a[1]+(c[1]-a[1])*(u-a[0])/(c[0]-a[0]));}return sign<0?Math.min(...hits):Math.max(...hits);
}
function radialWall(ring,angle){
  const origin=[49.9,61.6],dx=Math.cos(angle),dz=Math.sin(angle);let result,best=-Infinity;
  for(let i=0;i<ring.length;i++){
    const a=ring[i],c=ring[(i+1)%ring.length],sx=c[0]-a[0],sz=c[1]-a[1],cross=dx*sz-dz*sx;
    if(Math.abs(cross)<1e-7)continue;
    const ax=a[0]-origin[0],az=a[1]-origin[1],t=(ax*sz-az*sx)/cross,s=(ax*dz-az*dx)/cross;
    if(t<0||s<0||s>1||t<best)continue;
    const len=Math.hypot(sx,sz),direction=(sz*dx-sx*dz)>0?1:-1;
    best=t;result={u:origin[0]+t*dx,v:origin[1]+t*dz,nx:direction*sz/len,nz:-direction*sx/len};
  }
  if(!result)throw new Error('Missing apse wall intersection');return result;
}
function distance(p,ring){
 let best=Infinity;for(let i=0;i<ring.length;i++){const a=ring[i],c=ring[(i+1)%ring.length],du=c[0]-a[0],dv=c[1]-a[1],len=du*du+dv*dv,t=len?Math.max(0,Math.min(1,((p[0]-a[0])*du+(p[1]-a[1])*dv)/len)):0;best=Math.min(best,Math.hypot(p[0]-a[0]-t*du,p[1]-a[1]-t*dv));}return best;
}
