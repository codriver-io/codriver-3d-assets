import * as THREE from 'three';
import { PARTS as MAPPED_PARTS, TOWER } from './basilique-saint-sernin-plan.js';
import { archOutline } from './basilique-saint-sernin-kit.js';
const centroid=r=>[r.reduce((s,p)=>s+p[0],0)/r.length,r.reduce((s,p)=>s+p[1],0)/r.length];
const clamp=x=>Math.max(0,Math.min(1,x));
function sideAt(ring,axis,value,sign){
  const hits=[];
  for(let i=0;i<ring.length;i++){
    const a=ring[i],c=ring[(i+1)%ring.length];
    if((a[axis]<=value&&c[axis]>=value)||(c[axis]<=value&&a[axis]>=value)){
      const t=(value-a[axis])/(c[axis]-a[axis]);
      if(Number.isFinite(t))hits.push(a[1-axis]+t*(c[1-axis]-a[1-axis]));
    }
  }
  return sign<0?Math.min(...hits):Math.max(...hits);
}

function wallAt(ring,u,sign){
  let area=0;for(let i=0;i<ring.length;i++){const a=ring[i],c=ring[(i+1)%ring.length];area+=a[0]*c[1]-c[0]*a[1];}
  let best;
  for(let i=0;i<ring.length;i++){
    const a=ring[i],c=ring[(i+1)%ring.length];
    if((a[0]<=u&&c[0]>=u)||(c[0]<=u&&a[0]>=u)){
      const t=(u-a[0])/(c[0]-a[0]);if(!Number.isFinite(t))continue;
      const v=a[1]+t*(c[1]-a[1]),len=Math.hypot(c[0]-a[0],c[1]-a[1]),sense=area>0?1:-1;
      if(!best||v*sign>best.v*sign)best={v,nx:(c[1]-a[1])/len*sense,nz:-(c[0]-a[0])/len*sense,room:Math.min(t,1-t)*len};
    }
  }
  return best;
}

export function buildBasilica(k){
  const {b,near}=k;
  // Subpixel OSM edge noise is removed only in far; apse lobes and footprint stay intact.
  const simplify=ring=>{
    const pts=[...ring];let changed=true;
    while(changed&&pts.length>8){changed=false;for(let i=0;i<pts.length;i++){
      const a=pts[(i+pts.length-1)%pts.length],p=pts[i],c=pts[(i+1)%pts.length],dx=c[0]-a[0],dz=c[1]-a[1];
      const t=Math.max(0,Math.min(1,((p[0]-a[0])*dx+(p[1]-a[1])*dz)/(dx*dx+dz*dz)));
      if(Math.hypot(p[0]-a[0]-t*dx,p[1]-a[1]-t*dz)<.08){pts.splice(i,1);changed=true;break;}
    }}return pts;
  };
  const PARTS=near?MAPPED_PARTS:Object.fromEntries(Object.entries(MAPPED_PARTS).map(([id,ring])=>[id,simplify(ring)]));
  // Mapped masonry shell: no stacked coplanar exterior walls.
  k.shell(PARTS[260584870],0,8);
  k.courses(PARTS[260584870],near?[[.45,.9],[1.45,1.8],[2.75,3.1]]:[[.5,1.15]]);
  const aisleH=(u,v)=>8+3*clamp((16.6-Math.abs(v+1.7))/5.8);
  k.roof(PARTS[260584777],aisleH,[[1,-12.5],[1,9.1]],['roof','tile']);
  const naveH=(u,v)=>17+4.1*clamp(1-Math.abs(v+1.9)/10.6);
  k.shell(PARTS[260584771],8,naveH);
  k.roof(PARTS[260584771],naveH,[[1,-1.9]],['roof','tile']);
  const tranH=(u,v)=>16.1+5*clamp(1-Math.abs(u-17.9)/12.3);
  k.shell(PARTS[260584770],8,tranH);
  k.roof(PARTS[260584825],tranH,[[0,17.9]],['roof','tile']);
  const westH=(u,v)=>20+3.1*clamp(1-Math.abs(v+1.65)/17.8);
  k.shell(PARTS[260584889],8,westH);
  k.roof(PARTS[260584854],westH,[[1,-1.65]],['roof','tile']);
  // Layered east chevet: ambulatory, half-round choir and five radiating chapels.
  k.shell(PARTS[260584856],8,9);
  k.pyramid(PARTS[260584856],9,12,[33,-2.2]);
  k.shell(PARTS[260584822],8,15);
  k.pyramid(PARTS[260584821],15,18,[31.9,-2.25]);
  const chapels=[260584781,260584815,260584816,260584817,260584818,260584824,260584832,260584833,260584834];
  for(const id of chapels){
    const ring=PARTS[id],ct=centroid(ring);
    k.pyramid(ring,8,9,ct,'tile');k.courses(ring,near?[[4.2,4.48],[6.45,6.65]]:[[4.2,4.48]]);k.cornice(ring,7.85,'stone',.16);
    // Arched slit toward the outside of the mapped apse.
    const dir=[1,0];
    let edge=ring[0];for(const p of ring)if(p[0]*dir[0]+p[1]*dir[1]>edge[0]*dir[0]+edge[1]*dir[1])edge=p;
    k.window(edge[0],edge[1],2.25,...dir,.8,3.6);
    if(near){
      // Slim engaged shafts follow the curved chapel wall, not detached ground boxes.
      for(let i=0;i<ring.length;i+=Math.max(2,Math.floor(ring.length/5))) {
        const q=ring[i];b.bar('stone',[q[0],.2,q[1]],[q[0],7.7,q[1]],.2);
      }
    }
  }
  // Nave's outer aisles and clerestory rhythm, double stone archivolts.
  for(const sign of [-1,1]){
    const v=sign<0?-18.02:14.62,nz=sign;
    for(let u=-35.3;u<5;u+=4.76){
      const wallV=sideAt(PARTS[260584870],0,u,sign);
      k.window(u,wallV,2.05,0,nz,1.28,3.75);
      if(near){
        for(const yy of [1.25,3.45,5.75])b.box('stone',[u-2.1,yy,v+nz*.04],[.48,.23,.2]);
        b.box('brick',[u-2.25,3.9,v+nz*.15],[.45,7.8,.35]);
      }
    }
    const upperV=sign<0?-12.29:8.40;
    for(let u=-35.4;u<5;u+=4.76){
      k.window(u,sideAt(PARTS[260584771],0,u,sign),12.05,0,nz,1.16,2.65);
      k.panel('recess',archOutline(.65,.8,k.seg),u+1.85,upperV,15.8,0,nz,.08);
      if(near)b.box('brick',[u-2.2,12.1,upperV+nz*.14],[.35,7.8,.32]);
    }
    b.bar('stone',[-38,7.7,v],[5,7.7,v],.21);
    b.bar('stone',[-38,16.65,upperV],[5,16.65,upperV],.2);
    if(near)for(let u=-37;u<6;u+=1.2)b.box('stone',[u,7.53,v],[.23,.26,.3]);
  }
  // Transept ends: all trim is attached to its actual mapped edge, including skewed returns.
  for(const sign of [-1,1]){
    for(const u of [10.1,16.2,22.5]){
      const low=wallAt(PARTS[260584870],u,sign),high=wallAt(PARTS[260584770],u,sign);
      k.window(u,low.v,2.1,low.nx,low.nz,1.75,4.2);
      k.window(u,high.v,10.6,high.nx,high.nz,1.3,3.2);
    }
    for(const u of [6.5,12.1,24.0]){
      const face=wallAt(PARTS[260584770],u,sign);
      // Pilaster bites into the wall instead of standing beyond an assumed facade plane.
      b.box('brick',[u+face.nx*.06,7.9,face.v+face.nz*.06],[.4,15.8,.4]);
    }
    if(near)for(let u=8;u<28;u+=1.5){
      const face=wallAt(PARTS[260584770],u,sign);
      if(face.room>.4)k.panel('recess',archOutline(.65,.8,5),u,face.v,15.1,face.nx,face.nz);
    }
  }
  // Porte Miégeville on south nave: a recessed portal with layered round arches.
  k.window(-22.2,14.91,.3,0,1,3.65,5.7,'recess');
  k.arch('stone',5.25,6.9,.66,-22.2,14.91,.15,0,1,.26);
  b.box('stone',[-22.2,6.55,15.02],[5.3,.38,.32]);
  // West facade: two large round portals, arcaded gallery and monumental rose.
  const west=-56.8;
  for(const v of [-4.28,1.03]){
    k.window(west,v,.25,-1,0,3.4,6.15,'recess');
    k.arch('stone',4.65,6.85,.33,west,v,.2,-1,0,.28);
  }
  for(let v=-7;v<5;v+=2.05)k.window(west,v,8.2,-1,0,1.4,2.1,'recess');
  k.disc('glass',2.85,west,-1.6,15.25,-1,0,.09);
  k.ring('stone',2.9,3.36,west,-1.6,15.25,-1,0,.19);
  // Othoniel's current rose is represented as curved lead lattice, not the old grille.
  const spokeN=near?16:8;
  for(let i=0;i<spokeN;i++){
    const a=i*Math.PI*2/spokeN;
    b.bar('iron',[west-.14,15.25+Math.sin(a)*.28,-1.6+Math.cos(a)*.28],[west-.14,15.25+Math.sin(a)*2.85,-1.6+Math.cos(a)*2.85],near?.09:.13);
  }
  k.ring('iron',1.2,1.29,west,-1.6,15.25,-1,0,.16);
  for(const v of [-12.8,9.5]){
    const wallU=sideAt(PARTS[260584889],1,v,-1);
    b.box('brick',[wallU+.3,10.5,v],[.75,21,1.05]);
    for(const y of [1,2.5,4,5.5])b.box('stone',[wallU-.12,y,v],[.17,.48,1.1]);
  }
  // Large western block's two long sides: high arches and low windows.
  for(const [v,nz] of [[-18.15,-1],[15.52,1]])for(const u of [-52.9,-46.7,-40.8]){
    const wallV=sideAt(PARTS[260584889],0,u,nz);
    k.window(u,wallV,2.3,0,nz,1.4,4.3);
    k.window(u,wallV,11.1,0,nz,1.45,4.5);
  }
  b.bar('roof',[-38.5,21.13,-1.9],[27,21.13,-1.9],.12);
  b.bar('roof',[17.9,21.13,-31.6],[17.9,21.13,27.7],.12);
  buildTower(k);
  buildGate(k);
}

function buildTower(k){
  const {b,near}=k,[u,v]=TOWER;
  // Brick crossing pedestal and solid-backed faceted belfry stages.
  k.drum(u,v,5.05,19.5,22.35);
  const levels=[22.35,28.2,34.1,40,45.9,51.8],flats=[4.72,4.4,4.08,3.78,3.48];
  for(let tier=0;tier<5;tier++){
    const bot=levels[tier],top=levels[tier+1],flat=flats[tier],w=2*flat*Math.tan(Math.PI/8),h=top-bot;
    k.drum(u,v,flat+.12,bot,bot+.23,'stone');
    k.drum(u,v,flat-.65,bot+.23,top-.18,'recess');
    for(let face=0;face<8;face++){
      const a=face*Math.PI/4,nx=Math.sin(a),nz=Math.cos(a);
      const sh=new THREE.Shape([new THREE.Vector2(-w/2,0),new THREE.Vector2(w/2,0),new THREE.Vector2(w/2,h),new THREE.Vector2(-w/2,h)]);
      const wh=w*.255,hh=h-1.5,mitre=tier>=3;
      for(const across of [-w*.225,w*.225]){
        const pts=archOutline(wh,hh,k.seg,mitre).map(([x,y])=>new THREE.Vector2(x+across,y+.55));
        sh.holes.push(new THREE.Path(pts.reverse()));
      }
      if(near){
        const raw=new THREE.ExtrudeGeometry(sh,{depth:.45,bevelEnabled:false});
        // Horizontal ends are buried in the stone stage bands: omit coincident caps.
        const pos=raw.attributes.position,points=[];
        for(let i=0;i<pos.count;i+=3){
          const ys=[pos.getY(i),pos.getY(i+1),pos.getY(i+2)];
          if(ys.every(y=>Math.abs(y)<1e-5)||ys.every(y=>Math.abs(y-h)<1e-5))continue;
          for(let j=0;j<3;j++)points.push(pos.getX(i+j),pos.getY(i+j),pos.getZ(i+j));
        }
        raw.dispose();
        const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(points,3));
        k.put(k.place(g,u,v,bot,nx,nz,flat-.45),'brick');
      }else{
        k.put(k.place(new THREE.ShapeGeometry(sh),u,v,bot,nx,nz,flat),'brick');
      }
      for(const across of [-w*.225,w*.225]){
        const uu=u+Math.cos(a)*across+nx*flat,vv=v-Math.sin(a)*across+nz*flat;
        k.arch('stone',wh+.16,hh+.12,.08,uu,vv,bot+.49,nx,nz,.065,mitre);

      }
      if(near){
        // Crown dentils and stage corbels are only a few triangles each.
        for(let j=-1;j<=1;j++){
          const across=j*w*.3,uu=u+Math.cos(a)*across+nx*(flat+.16),vv=v-Math.sin(a)*across+nz*(flat+.16);
          b.box('brick',[uu,top-.30,vv],[.18,.24,.18]);
        }
      }
    }
    k.drum(u,v,flat+.12,top-.18,top,'stone');
  }
  // Octagonal grey-slate spire and the small cross/finial to the official 65 m.
  const flat=3.18,rad=flat/Math.cos(Math.PI/8);
  const cone=new THREE.ConeGeometry(rad,12.2,8,1,false);cone.rotateY(Math.PI/8);cone.translate(u,57.9,v);k.put(cone,'spire');
  for(let i=0;i<8;i++){
    const a=(i+.5)*Math.PI/4,x=u+Math.sin(a)*rad,z=v+Math.cos(a)*rad;
    b.bar('spire',[x,51.8,z],[u,64,v],near?.10:.13);
    const nx=Math.sin(a),nz=Math.cos(a);
    b.bar('brick',[u+nx*3.7,51.6,v+nz*3.7],[u+nx*3.7,53.05,v+nz*3.7],.23);
    const fin=new THREE.ConeGeometry(.24,.6,near?6:4);fin.translate(u+nx*3.7,53.35,v+nz*3.7);k.put(fin,'stone');
  }
  b.bar('iron',[u,63.95,v],[u,64.93,v],.14);
  b.bar('iron',[u-.4,64.55,v],[u+.4,64.55,v],.1);
}

function buildGate(k){
  const {b,near}=k,u=-25.06,v=27.19;
  // Detached Renaissance abbey gate: real open arch, supported by two mapped jambs.
  b.box('stone',[u-2.87,2.6,v],[1.42,5.2,.54]);b.box('stone',[u+2.87,2.6,v],[1.42,5.2,.54]);
  k.arch('stone',7.08,6.2,1.22,u,v,0,0,1,-.22);
  k.arch('stone',4.6,5.65,.19,u,v,.15,0,1,.02);
  b.box('stone',[u,6.22,v],[7.1,.46,.56]);
  // Relief tympanum above the opening and triangular Renaissance pediment.
  k.panel('stone',archOutline(5.65,1.8,k.seg),u,v,6.3,0,1,.05);
  k.panel('stone',[[-3.53,0],[3.53,0],[0,1.68]],u,v,6.32,0,1,.22);
  for(const sign of [-1,1])b.bar('stone',[u+sign*3.52,6.35,v],[u,8,v],.22);
  if(near)for(const sign of [-1,1]){
    b.box('stone',[u+sign*2.85,.45,v+.19],[1.25,.9,.62]);
    b.bar('stone',[u+sign*2.64,.9,v+.32],[u+sign*2.64,5.9,v+.32],.2);
  }
}
