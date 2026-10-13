import * as THREE from 'three';
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';
import { MAIN_ARC, SPIRAL_ARC, CORE, UPPER_CORE, BASE, TOWER_PARTS } from './vancouver-public-library-plan.js';

// Split precast walls at each opening; glazing is recessed in real holes.
export function create({ detail = 'near' } = {}) {
  const near = detail === 'near';
  const b = assetBuilder({ ...SPEC, palette: PALETTES.light }, detail);
  const batches = new Map();
  function quad(mat, a, c, d, e, normal) {
    const cross = new THREE.Vector3().subVectors(new THREE.Vector3(...c), new THREE.Vector3(...a))
      .cross(new THREE.Vector3().subVectors(new THREE.Vector3(...d), new THREE.Vector3(...a)));
    if(d.every((v,i)=>v===e[i])){
      if(cross.lengthSq()<1e-12)return;
      if(cross.dot(new THREE.Vector3(...normal))<0)[c,d]=[d,c];
      if(!batches.has(mat))batches.set(mat,{p:[],idx:[]});
      const q=batches.get(mat),i=q.p.length/3;q.p.push(...a,...c,...d);q.idx.push(i,i+1,i+2);return;
    }
    if (cross.dot(new THREE.Vector3(...normal)) < 0) [c, e] = [e, c];
    if (!batches.has(mat)) batches.set(mat, { p: [], idx: [] });
    const q = batches.get(mat), i = q.p.length / 3;
    q.p.push(...a, ...c, ...d, ...e); q.idx.push(i, i + 1, i + 2, i, i + 2, i + 3);
  }
  function cap(mat, ring, y) {
    const faces = THREE.ShapeUtils.triangulateShape(ring.map(([x,z]) => new THREE.Vector2(x,z)), []);
    for (const f of faces) {
      const p = f.map(i => [ring[i][0], y, ring[i][1]]);
      quad(mat, p[0], p[1], p[2], p[2], [0,1,0]);
    }
  }
  function wallFace(mat, a, c, y0, y1, outward) {
    quad(mat,[a[0],y0,a[1]],[c[0],y0,c[1]],[c[0],y1,c[1]],[a[0],y1,a[1]],outward);
  }
  function edgeBox(mat, a, c, y0, y1, width, inset = 0, nHint) {
    const len = Math.hypot(c[0]-a[0], c[1]-a[1]);
    if (len < 0.01 || y1-y0 < 0.01) return;
    const n = nHint || [(c[1]-a[1])/len, -(c[0]-a[0])/len];
    const p = [a[0]-n[0]*inset, a[1]-n[1]*inset], q = [c[0]-n[0]*inset,c[1]-n[1]*inset];
    const r = [q[0]-n[0]*width,q[1]-n[1]*width], s = [p[0]-n[0]*width,p[1]-n[1]*width];
    wallFace(mat,p,q,y0,y1,[n[0],0,n[1]]); wallFace(mat,r,s,y0,y1,[-n[0],0,-n[1]]);
    // Far keeps both wall skins. Bay-to-bay hidden end faces are omitted.
    if ((!near && mat === 'stone') || mat === 'frame') return;
    wallFace(mat,s,p,y0,y1,[-(c[0]-a[0]),0,-(c[1]-a[1])]);
    wallFace(mat,q,r,y0,y1,[(c[0]-a[0]),0,(c[1]-a[1])]);
    quad(mat,[p[0],y1,p[1]],[q[0],y1,q[1]],[r[0],y1,r[1]],[s[0],y1,s[1]],[0,1,0]);
    quad(mat,[s[0],y0,s[1]],[r[0],y0,r[1]],[q[0],y0,q[1]],[p[0],y0,p[1]],[0,-1,0]);
  }
  const lerp = (a,c,t) => [a[0]+(c[0]-a[0])*t,a[1]+(c[1]-a[1])*t];
  function glass(mat,a,c,lo,hi,n,depth=1.05,twoSided=true) {
    const p=[a[0]-n[0]*depth,a[1]-n[1]*depth],q=[c[0]-n[0]*depth,c[1]-n[1]*depth];
    wallFace(mat,p,q,lo,hi,[n[0],0,n[1]]);
    if(twoSided){
      const r=[q[0]-n[0]*.12,q[1]-n[1]*.12],s=[p[0]-n[0]*.12,p[1]-n[1]*.12];
      wallFace(mat,r,s,lo,hi,[-n[0],0,-n[1]]);
      if(near){
        wallFace(mat,s,p,lo,hi,[p[0]-q[0],0,p[1]-q[1]]);
        wallFace(mat,q,r,lo,hi,[q[0]-p[0],0,q[1]-p[1]]);
        for(const y of [lo,hi])quad(mat,[p[0],y,p[1]],[q[0],y,q[1]],[r[0],y,r[1]],[s[0],y,s[1]],[0,y===lo?-1:1,0]);
      }
    }
  }
  function resample(path, count) {
    const dist=[0]; for(let i=1;i<path.length;i++) dist.push(dist[i-1]+Math.hypot(path[i][0]-path[i-1][0],path[i][1]-path[i-1][1]));
    return Array.from({length:count+1},(_,i)=>{
      const s=dist.at(-1)*i/count; let j=1; while(j<dist.length-1&&dist[j]<s)j++;
      return lerp(path[j-1],path[j],(s-dist[j-1])/(dist[j]-dist[j-1]));
    });
  }
  // Four double-height colonnade orders and tiny spandrel lights, like the photo.
  function arcade(path, rows, bays, gallery) {
    const ps=resample(path,bays), supports=[];
    for(let i=0;i<bays;i++){
      const a=ps[i],c=ps[i+1],len=Math.hypot(c[0]-a[0],c[1]-a[1]);
      const mid=lerp(a,c,.5),n=[(c[1]-a[1])/len,-(c[0]-a[0])/len];
      const p=lerp(a,c,.14),q=lerp(a,c,.86);
      for(let row=0;row<rows;row++){
        const y0=.2+row*10, y1=y0+10;
        edgeBox('stone',a,p,y0,y1,.85,0,n); edgeBox('stone',q,c,y0,y1,.85,0,n);
        edgeBox('stone',p,q,y0,y0+.65,.85,0,n);
        edgeBox('stone',p,q,y0+7.25,y0+8.1,.85,0,n);
        const l=lerp(p,q,.37),r=lerp(p,q,.63);
        edgeBox('stone',p,l,y0+8.1,y0+9.25,.85,0,n);
        edgeBox('stone',r,q,y0+8.1,y0+9.25,.85,0,n);
        edgeBox('stone',p,q,y0+9.25,y1,.85,0,n);
        glass('glow',l,r,y0+8.1,y0+9.25,n,1.0);
        if(gallery || row>0) glass('glass',p,q,y0+.65,y0+7.25,n,gallery?3.25:1.15);
        if(near){
          const mm=lerp(p,q,.5);
          edgeBox('frame',lerp(mm,q,-.03),lerp(mm,q,.03),y0+.65,y0+7.25,.10,gallery?3.15:1.05,n);
          edgeBox('frame',p,q,y0+3.8,y0+3.94,.1,gallery?3.15:1.05,n);
        }
      }
      for(let row=1;row<=rows;row++) edgeBox('stone',a,c,row*10-.05,row*10+.2,gallery?3.5:.85,0,n);
      supports.push({a,c,n,mid});
    }
    return supports;
  }
  cap('stone',BASE,.2);
  for(let i=0;i<BASE.length;i++) wallFace('stone',BASE[i],BASE[(i+1)%BASE.length],0,.2,[BASE[(i+1)%BASE.length][1]-BASE[i][1],0,BASE[i][0]-BASE[(i+1)%BASE.length][0]]);
  arcade(MAIN_ARC,4,near?38:25,true);
  const canopy=arcade(SPIRAL_ARC,3,near?23:13,false);
  const sp=resample(SPIRAL_ARC,23);
  const spiral=sp.slice(0,-1).map((a,i)=>{const c=sp[i+1],len=Math.hypot(c[0]-a[0],c[1]-a[1]);return {a,c,mid:lerp(a,c,.5),n:[(c[1]-a[1])/len,-(c[0]-a[0])/len]};});

  // Recessed facade grid; no backing slab behind the panes, in either LOD.
  function inside(p,ring){let yes=false;for(let i=0,j=ring.length-1;i<ring.length;j=i++){const a=ring[i],c=ring[j];if((a[1]>p[1])!==(c[1]>p[1])&&p[0]<(c[0]-a[0])*(p[1]-a[1])/(c[1]-a[1])+a[0])yes=!yes;}return yes;}
  function building(ring,height,storeys,allGlass=false,baseY=.2,partId=null){
    let area=0; for(let i=0;i<ring.length;i++){const a=ring[i],c=ring[(i+1)%ring.length];area+=a[0]*c[1]-c[0]*a[1];}
    for(let i=0;i<ring.length;i++){
      const a=ring[i],c=ring[(i+1)%ring.length],len=Math.hypot(c[0]-a[0],c[1]-a[1]);
      const n=area>0?[(c[1]-a[1])/len,-(c[0]-a[0])/len]:[-(c[1]-a[1])/len,(c[0]-a[0])/len];
      const bays=Math.max(1,Math.round(len/(near?5.5:18))),h=(height-baseY)/storeys;
      const mid=lerp(a,c,.5),outer=[mid[0]+n[0]*.35,mid[1]+n[1]*.35];
      // Adjacent tower parts share walls. Draw only the exposed height above them.
      const hiddenTo=partId?Math.max(baseY,...TOWER_PARTS.filter(p=>p.id!==partId&&inside(outer,p.ring)).map(p=>p.height)):baseY;
      const skin=(mat,p,q,lo,hi)=>{if(hi<=lo)return;wallFace(mat,p,q,lo,hi,[n[0],0,n[1]]);};
      const reveals=(p,q,lo,hi)=>{
        if(!near)return;
        const a=[p[0]-n[0]*.72,p[1]-n[1]*.72],c=[q[0]-n[0]*.72,q[1]-n[1]*.72];
        wallFace(allGlass?'frame':'stone',p,a,lo,hi,[q[0]-p[0],0,q[1]-p[1]]);
        wallFace(allGlass?'frame':'stone',c,q,lo,hi,[p[0]-q[0],0,p[1]-q[1]]);
        for(const y of [lo,hi])quad(allGlass?'frame':'stone',[p[0],y,p[1]],[q[0],y,q[1]],[c[0],y,c[1]],[a[0],y,a[1]],[0,y===lo?1:-1,0]);
      };
      for(let k=0;k<bays;k++){
        const p=lerp(a,c,k/bays),q=lerp(a,c,(k+1)/bays),l=lerp(p,q,.15),r=lerp(p,q,.85);
        // Far simplifies jambs into continuous flat skins, keeping every real floor.
        if(!near){skin(allGlass?'frame':'stone',p,l,hiddenTo,height);skin(allGlass?'frame':'stone',r,q,hiddenTo,height);}
        for(let j=0;j<storeys;j++){
          const lo=Math.max(hiddenTo,baseY+j*h),hi=baseY+(j+1)*h;
          if(hi<=lo)continue;
          if(near){skin(allGlass?'frame':'stone',p,l,lo,hi); skin(allGlass?'frame':'stone',r,q,lo,hi);}
          if(near){skin(allGlass?'frame':'stone',l,r,lo,Math.min(hi,lo+.7)); skin(allGlass?'frame':'stone',l,r,Math.max(lo,hi-.5),hi);}
          else skin(allGlass?'frame':'stone',l,r,Math.max(hiddenTo,baseY+j*h-.5),Math.min(hi,lo+.7));
          if(hi-lo>1.3){
            reveals(l,r,lo+.7,hi-.5);
            const lit=(j*3+k+i*2+(partId||0))%7===0;
            if(lit&&!near){
              // A coarse bay can span several offices: light one office only.
              const left=lerp(l,r,.3),right=lerp(l,r,.7);
              glass('glass',l,left,lo+.7,hi-.5,n,0,false);
              glass('glow',left,right,lo+.7,hi-.5,n,0,false);
              glass('glass',right,r,lo+.7,hi-.5,n,0,false);
            }else glass(lit?'glow':'glass',l,r,lo+.7,hi-.5,n,near?.72:0,false);
          }
        }
        if(!near)skin(allGlass?'frame':'stone',l,r,Math.max(hiddenTo,height-.5),height);
      }
    }
    cap('roof',ring,height);
  }
  building(CORE,34,7);
  building(UPPER_CORE,38,1,false,34);
  const uv=(u,v,y)=>[(u+v)/Math.SQRT2,y,(v-u)/Math.SQRT2];
  // Roof planting is a low solid skin, paving borders remain explicit.
  for(const u of [-24,-8,8,20]){
    b.box('stone',uv(u,-6,38.2),[9,.4,3],Math.PI/4);
    if(near)b.box('garden',uv(u,-6,38.45),[8.4,.1,2.4],Math.PI/4);
    else {
      // Far keeps visible planting tops, dropping concealed thin-box faces.
      const points=[[-4.2,-1.2],[4.2,-1.2],[4.2,1.2],[-4.2,1.2]].map(([du,dv])=>uv(u+du,-6+dv,38.5));
      quad('garden',...points,[0,1,0]);
    }
  }
  const insetSpiral=SPIRAL_ARC.map((p,i)=>{const a=SPIRAL_ARC[Math.max(0,i-1)],c=SPIRAL_ARC[Math.min(SPIRAL_ARC.length-1,i+1)],l=Math.hypot(c[0]-a[0],c[1]-a[1]);return [p[0]-(c[1]-a[1])*.95/l,p[1]+(c[0]-a[0])*.95/l];});
  const roofRing=[...insetSpiral,MAIN_ARC[0],[-9.4,39.5],[33.8,-3.9],MAIN_ARC.at(-1)];
  const cells=THREE.ShapeUtils.triangulateShape(roofRing.map(([x,z])=>new THREE.Vector2(x,z)),[]);
  // Loft the canopy from the lower wall crown to the core roof edge.
  const roofY=p=>insetSpiral.includes(p)?30.2:34;
  for(const f of cells){
    const p=f.map(i=>[roofRing[i][0],roofY(roofRing[i]),roofRing[i][1]]);
    quad('glass',p[0],p[1],p[2],p[2],[0,1,0]);
    const back=p.map(a=>[a[0],a[1]-.12,a[2]]);
    quad('glass',back[2],back[1],back[0],back[0],[0,-1,0]);
  }
  for(let i=0;i<roofRing.length;i++){
    const a=roofRing[i],c=roofRing[(i+1)%roofRing.length],ya=roofY(a),yc=roofY(c);
    quad('glass',[a[0],ya,a[1]],[c[0],yc,c[1]],[c[0],yc-.12,c[1]],[a[0],ya-.12,a[1]],[c[1]-a[1],0,a[0]-c[0]]);
  }
  for(let i=1;i<canopy.length-1;i+=near?1:2){
    const {mid}=canopy[i],u=(mid[0]-mid[1])/Math.SQRT2,v=(mid[0]+mid[1])/Math.SQRT2;
    if(v<23||u< -33||u>26) continue;
    b.bar('frame',[mid[0],30.2,mid[1]],uv(u,21.1,34),.22,.22);
  }
  // Grounded triangular concrete fins, attached at lower colonnade floors.
  for(let i=2;i<spiral.length-2;i++){
    const {a,c,n}=spiral[i],t=lerp(a,c,.02),p=lerp(a,c,.17),d=5.5;
    for(const [lo,hi] of [[.2,10.2],[10.2,20.2]]){
      const A=[t[0],hi,t[1]],B=[t[0]+n[0]*d,lo,t[1]+n[1]*d],C=[t[0],lo,t[1]];
      const D=[p[0],hi,p[1]],E=[p[0]+n[0]*d,lo,p[1]+n[1]*d],F=[p[0],lo,p[1]];
      const tangent=[c[0]-a[0],0,c[1]-a[1]];
      quad('stone',A,B,C,C,tangent.map(x=>-x)); quad('stone',D,F,E,E,tangent);
      quad('stone',A,D,E,B,[n[0],1,n[1]]);
      quad('stone',C,B,E,F,[0,-1,0]);
    }
  }
  for(const part of TOWER_PARTS) building(part.ring,part.height,Math.round(part.height/4.1),part.glass,.2,part.id);
  for(const [mat,{p,idx}] of batches){
    const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(p,3));g.setIndex(idx);g.computeVertexNormals();
    const compact=mergeVertices(g,1e-4);g.dispose();b.put(compact,mat);
  }
  return b.finish();
}
