import * as THREE from 'three';
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES, MANIFEST } from './config.js';
import { PLANS } from './chateau-de-vincennes-plan.js';
import { kit } from './chateau-de-vincennes-parts.js';

// Fortress axis from mapped tower corners: north bearing 7.5°. Chapel has its own 91° axis.
export const ROTATION = -7.5 * Math.PI/180;
const C=Math.cos(ROTATION),S=Math.sin(ROTATION);
const local=([x,z])=>[C*x-S*z,S*x+C*z];
export const toWorld=([x,y,z])=>[C*x+S*z,y,-S*x+C*z];
const plan=id=>PLANS[id].map(local);
function simplify(r,tol) {
  // Drop a closing duplicate first: otherwise both copies look collinear and the real corner is lost.
  let out=r.length>1&&r[0][0]===r.at(-1)[0]&&r[0][1]===r.at(-1)[1]?r.slice(0,-1):r.slice();
  for(let round=0;round<4;round++) {
    const next=[];
    for(let i=0;i<out.length;i++) {
      const a=out[(i+out.length-1)%out.length],p=out[i],c=out[(i+1)%out.length];
      const dx=c[0]-a[0],dz=c[1]-a[1],len=Math.hypot(dx,dz);
      const distance=len?Math.abs(dx*(a[1]-p[1])-(a[0]-p[0])*dz)/len:0;
      if(distance>tol || out.length<6)next.push(p);
    }
    if(next.length<4)break;out=next;
  }
  return out;
}
function bounds(r){return {x:(Math.min(...r.map(p=>p[0]))+Math.max(...r.map(p=>p[0])))/2,z:(Math.min(...r.map(p=>p[1]))+Math.max(...r.map(p=>p[1])))/2,w:Math.max(...r.map(p=>p[0]))-Math.min(...r.map(p=>p[0])),d:Math.max(...r.map(p=>p[1]))-Math.min(...r.map(p=>p[1]))};}
export const KEEP = { x:-81.8,z:18.7,core:16.5,turretRadius:3.3,top:52 };

function fortress(k) {
  const {box,bar,hip,cylinder,panel,solid,near}=k;
  function wall(x,z,w,d,h=11){box('stone',[x,h/2,z],[w,h,d]);box('stone',[x,h+.3,z],[w+.35,.6,d+.35]);}
  // Existing curtain walls, with northern and southern gate apertures left open.
  wall(-73.5,-100.5,2.4,135);wall(-73.5,121,2.4,94);
  wall(99.4,-.2,2.4,335.8);
  wall(-35.5,-167.5,76,2.4);wall(63.4,-167.5,73,2.4);
  wall(-35.5,168,76,2.4);wall(61.5,168,76,2.4);
  const towers=[110188215,110188217,110188221,110188223,110188225,110188230,110188232];
  for(const id of towers){
    const r=plan(id),q=bounds(r),h=id===110188225?9.8:11;
    solid('stone',r,0,h);
    box('stone',[q.x,h+.25,q.z],[q.w,.5,q.d]);
    for(const x of [-.27,.27])panel('glass',q.x+x*q.w,5.6,q.z+q.d/2+.25, .55,1.7);
  }
  // Low grass-roofed barracks backing the north curtain are owned whole.
  for(const id of [110191516,110188220])solid('stone',plan(id),0,7.8);
  // Mapped dry moats, drawn at grade. Host ground (the flat Cityscape plane or uncut terrain)
  // covers everything below local y=0, so no below-grade floor or scarps ship. Each mapped moat
  // area is a dark ditch surface 15 cm proud of grade, edged by a low stone counterscarp parapet;
  // curtain walls, towers and the keep enceinte form the inner scarp. No terrain is excavated.
  const v2=([x,z])=>new THREE.Vector2(x,-z);
  function moat(ring,holes,edges){
    const shape=new THREE.Shape(simplify(ring,near?.4:1.0).map(v2));
    for(const h of holes)shape.holes.push(new THREE.Path(h.map(v2)));
    const g=new THREE.ShapeGeometry(shape);g.rotateX(-Math.PI/2);g.translate(0,.15,0);k.put(g,'moat');
    // Parapet centred on the mapped outer edge: 0.8 m above grade, footing 0.3 m into host ground.
    for(const edge of edges)for(let i=1;i<edge.length;i++){
      const a=edge[i-1],c=edge[i],len=Math.hypot(c[0]-a[0],c[1]-a[1]);
      if(len<.5)continue;
      box('stone',[(a[0]+c[0])/2,.25,(a[1]+c[1])/2],[len+.5,1.1,.6],-Math.atan2(c[1]-a[1],c[0]-a[0]));
    }
  }
  // Enclosure moat ring: vertices 8–293 trace the curtain walls/towers (inner scarp, no parapet);
  // the rest is the outer edge plus the two edges facing the keep moat. The parapet opens at the
  // mapped gate-bridge landings (300–303 north, 312–320 south); the bridges themselves are not modeled.
  const outer=plan(138303744);
  moat(outer,[],[outer.slice(293,301),outer.slice(303,313),outer.slice(320).concat(outer.slice(1,9))]);
  // Keep's own 50 m enceinte. Model the mapped narrow wall polygon, preserving its hollow courtyard.
  const ring=plan(1416530512),mid=(i,j)=>[(ring[i][0]+ring[j][0])/2,(ring[i][1]+ring[j][1])/2];
  // Keep moat: mapped square minus the enceinte's outer face (ring 2–8, closed across the châtelet);
  // its parapet opens at the courtyard landing facing the châtelet porch (vertices 16–18).
  const keepMoat=plan(138576131);
  moat(keepMoat,[ring.slice(2,9)],[keepMoat.slice(18).concat(keepMoat.slice(1,17))]);
  solid('stone',ring,0,11.5);
  // Covered wall-walk: slate roofs over the crenellated parapet (eave 12.6 m, ridge ~14 m) follow
  // the mapped wall midline and stand on parapet piers rising from the 11.5 m wall top in both LODs
  // (near 2.5 m merlon rhythm, far 5 m). Corbelled corner turrets sit on the mapped wall corners.
  const NW=mid(5,13),NE=mid(7,11),SE=mid(3,16),SW=mid(4,14);
  // [from, to, first/last pier clearance]: 2.2 m clears a turret; the east gallery breaks at the
  // mapped châtelet gap, running 5.8 m into the châtelet block to the north and ending free at the wall end to the south.
  for(const [a,c,c0,c1] of [[NW,NE,2.2,2.2],[SW,SE,2.2,2.2],[NW,SW,2.2,2.2],[NE,mid(8,10),2.2,6.3],[mid(2,0),SE,.6,2.2]]){
    const dx=c[0]-a[0],dz=c[1]-a[1],len=Math.hypot(dx,dz),angle=-Math.atan2(dz,dx);
    hip('roof',(a[0]+c[0])/2,(a[1]+c[1])/2,len,2.8,12.6,14,1,{angle});
    const n=Math.max(1,Math.round((len-c0-c1)/(near?2.5:5)));
    for(let i=0;i<=n;i++){
      const t=(c0+i*(len-c0-c1)/n)/len;
      box('stone',[a[0]+dx*t,12.1,a[1]+dz*t],[near?1.1:2.2,1.4,1.5],angle);
    }
  }
  for(const [cx,cz] of [NW,NE,SE,SW]){
    cylinder('stone',cx,cz,1.7,9,15);cylinder('roof',cx,cz,1.9,15,18,0);
  }
  // Châtelet east of keep: open portal between two piers, tall office block and bell turret.
  const gx=-53.8,gz=16;
  box('stone',[gx,3.5,gz-5],[5.2,7,5]);box('stone',[gx,3.5,gz+5],[5.2,7,5]);
  box('stone',[gx,12,gz],[5.2,10,15]);hip('roof',gx,gz,6,16,17,19,2);
  cylinder('stone',gx+2,gz+1,1.5,15,22);cylinder('roof',gx+2,gz+1,1.8,22,26,0);
  panel('glass',gx+2.9,12,gz-3,1.1,2.6,Math.PI/2);
  // Courtward Châtelet porch: paired supported piers/turrets and open portal.
  for(const z of [16.7,24.7]){cylinder('stone',-46.8,z,1.35,0,9.5);cylinder('roof',-46.8,z,1.5,9.5,12.0,0);}
  box('stone',[-48.8,8.5,20.7],[7.6,3.0,8.0]);hip('roof',-48.8,20.7,8.0,8.4,10,12,2);
  // Massive central keep. Circular corner turrets remain unroofed at the parapets in today's state.
  const {x,z}=KEEP;
  box('stone',[x,24.5,z],[16.5,49,16.5]);
  hip('roof',x,z,15.8,15.8,48.7,49.4,5.5,{base:false});
  for(const dx of [-6.7,6.7])for(const dz of [-6.7,6.7]){
    cylinder('stone',x+dx,z+dz,3.3,0,50.8);
    cylinder('stone',x+dx,z+dz,3.55,12,13.1);
    cylinder('stone',x+dx,z+dz,3.55,39.4,40.5);
    cylinder('stone',x+dx,z+dz,3.52,50.6,52);
    cylinder('roof',x+dx,z+dz,2.95,51.7,51.8);
    // Flat-topped rim, no invented conical crowns.
  }
  // Fifth latrine/stair projection north-west of core.
  box('stone',[x-6.3,24.3,z-12],[4.4,48.6,5.2]);
  for(const y of [12.7,39.9,48.2]){
    box('stone',[x,y,z],[17.2,.65,17.2]);
    if(near)for(const dx of [-6.8,-3.4,0,3.4,6.8])for(const dz of [-8.6,8.6])box('stone',[x+dx,y-.7,z+dz],[.45,1.4,.8]);
  }
  for(const y of [7.5,17,26,35,44])for(const side of [-1,1]){
    panel('glass',x,y,z+side*8.5,.8,y===17?2.8:1.6,side===1?0:Math.PI);
    panel('glass',x+side*8.5,y,z,.8,1.7,side*Math.PI/2);
    if(near)for(const q of [-6.7,6.7])panel('glass',x+q,y,z+side*10.1,.3,1.3,side===1?0:Math.PI);
  }
  // Tour du Village: 34 m gate, true through-passage, twin cylindrical corner stair turrets.
  const q=bounds(plan(110188224)),vx=q.x,vz=q.z;
  box('stone',[vx-8,4.3,vz],[8,8.6,13]);box('stone',[vx+8,4.3,vz],[8,8.6,13]);
  box('stone',[vx,19.7,vz],[24,22.2,13]);
  for(const side of [-1,1]){
    box('stone',[vx,30.7,vz+side*6.6],[25.4,1.4,.8]);
    for(const dx of [-9.8,9.8])cylinder('stone',vx+dx,vz+side*4.7,2,8.3,31.5);
    panel('glass',vx,23.5,vz+side*6.8,1.4,4,side===1?0:Math.PI);
    for(const dx of [-7,6])panel('glass',vx+dx,12,vz+side*6.8,.7,1.7,side===1?0:Math.PI);
  }
  for(const dx of [-9.8,9.8])for(const dz of [-4.7,4.7]){
    cylinder('stone',vx+dx,vz+dz,2,31,34);
    cylinder('roof',vx+dx,vz+dz,1.55,33.5,33.6);
  }
  box('roof',[vx,30.7,vz],[20,.15,10]);
  // South Tour du Bois with an open passage.
  const sq=bounds(plan(110188226));
  box('stone',[sq.x-7,4,sq.z],[7,8,11]);box('stone',[sq.x+7,4,sq.z],[7,8,11]);
  box('stone',[sq.x,10.9,sq.z],[21,5.8,11]);hip('roof',sq.x,sq.z,21,11,13.8,15.2,2,{base:false});
}

function chapel(k) {
  // Chapel is authored in absolute east/south coordinates, then converted into fortress local frame.
  // Long axis bearing ~91°; a 40m-long vessel with a polygonal eastern apse.
  const angle=-1.1*Math.PI/180;
  const cv=([u,y,v])=>{
    const x=26.1+u*Math.cos(angle)+v*Math.sin(angle),z=50.05-u*Math.sin(angle)+v*Math.cos(angle);
    const [a,b]=local([x,z]);return[a,y,b];
  };
  const bx=(mat,u,y,v,w,h,d)=>{
    const p=cv([u,y,v]);k.box(mat,p,[w,h,d],angle-ROTATION);
  };
  const bar=(mat,a,b,w)=>k.bar(mat,cv(a),cv(b),w);
  function lancet(u,v,w,lo,hi,front=false){
    const p=cv([u,0,v]),ang=front?angle-ROTATION-Math.PI/2:angle-ROTATION+(v<0?Math.PI:0);
    k.lancet(p[0],p[2],w,lo,hi,ang);
  }
  // Sides formed by wall strips between individual pointed windows; recessed backing lies behind the facade.
  for(const side of [-1,1]){
    bx('stone',17,3.4,side*6.95,34,6.8,.8);
    bx('stone',17,23.7,side*6.95,34,2.6,.8);
    for(let i=0;i<5;i++){
      const u=3.7+i*6.2;
      // upper facade window dark backing and stone pointed spandrels
      const points=[[-2.35,6.8],[2.35,6.8],[2.35,19.3],[0,22.4],[-2.35,19.3]];
      const v=side*7.38,vertices=points.map(([a,y])=>cv([u+a,y,v]));
      const tri=side===1?[[0,1,2],[0,2,3],[0,3,4]]:[[0,2,1],[0,3,2],[0,4,3]];
      k.faces('glass',vertices,tri);
      bx('stone',u-2.9,14.8,side*6.95,1.1,16,.8);
      bx('stone',u+2.9,14.8,side*6.95,1.1,16,.8);
      // Stone above pointed arch, excluding the glass opening.
      k.faces('stone',[cv([u-2.35,19.3,side*7.4]),cv([u-2.35,22.5,side*7.4]),cv([u,22.4,side*7.4]),cv([u+2.35,22.5,side*7.4]),cv([u+2.35,19.3,side*7.4])],side===1?[[0,2,1],[2,4,3]]:[[0,1,2],[2,3,4]]);
      if(k.near){
        for(const du of [-1.5,0,1.5])bar('stone',[u+du,6.8,side*7.5],[u+du,20.3,side*7.5],.15);
        bar('stone',[u-2.35,14.8,side*7.5],[u+2.35,14.8,side*7.5],.14);
        for(const sg of [-1,1])bar('stone',[u+sg*2.35,19.3,side*7.5],[u,22.4,side*7.5],.18);
      }
    }
    for(let i=0;i<=5;i++){
      const u=.6+i*6.2;
      bx('stone',u,7,side*8.1,1.15,14,3.1);
      bx('stone',u,18.4,side*7.9,.9,8.8,2.7);
      bx('stone',u,24.2,side*7.6,.8,2.8,2.1);
      const p=cv([u,0,side*7.8]);k.cylinder('stone',p[0],p[2],.66,25.5,30.4,0,4);
      if(k.near)for(const y of [27,28,29])bx('stone',u,y,side*7.8,1.1,.18,1.1);
    }
  }
  // Polygonal apse walls with their own windows and radial buttresses.
  const apse=[[34,-6.95],[38.7,-4.7],[40.5,-2],[40.5,2],[38.7,4.7],[34,6.95]];
  for(let i=1;i<apse.length;i++){
    const [a,c]=[apse[i-1],apse[i]],dx=c[0]-a[0],dz=c[1]-a[1],len=Math.hypot(dx,dz);
    const pa=cv([a[0],0,a[1]]),pb=cv([c[0],0,c[1]]),yaw=-Math.atan2(pb[2]-pa[2],pb[0]-pa[0]);
    k.box('stone',[(pa[0]+pb[0])/2,12.3,(pa[2]+pb[2])/2],[len,24.6,.9],yaw);
    const mid=[(a[0]+c[0])/2,0,(a[1]+c[1])/2],p=cv(mid),normal=[dz/len,-dx/len];
    const glasspos=cv([mid[0]+normal[0]*.6,0,mid[2]+normal[1]*.6]);
    k.lancet(glasspos[0],glasspos[2],Math.max(1.1,len-1),7,22.2,Math.atan2(normal[0],normal[1])-ROTATION);
    const foot=cv([c[0]*1.003,0,c[1]*1.14]);k.cylinder('stone',foot[0],foot[2],.7,0,26);k.cylinder('stone',foot[0],foot[2],.7,26,30.4,0,4);
  }
  // Tall steep slate roof with a hipped polygonal east end.
  const verts=[[0,25,-7.35],[0,25,7.35],[34,25,7.35],[40.8,25,2],[40.8,25,-2],[34,25,-7.35],[0,38.8,0],[33.5,38.8,0]].map(cv);
  k.faces('roof',verts,[[0,6,5],[5,6,7],[1,2,6],[2,7,6],[2,3,7],[3,4,7],[4,5,7],[0,1,6],[0,5,1],[1,5,2],[2,5,3],[3,5,4]]);
  // West front: pierced-looking pointed doorway, tall window and three ascending Gothic gables.
  bx('stone',0,12.2,0,1.2,24.4,14.7);
  const wp=cv([-.75,0,0]);k.lancet(wp[0],wp[2],8.5,8.8,23,-Math.PI/2-ROTATION+angle);
  const dp=cv([-.95,0,0]);k.lancet(dp[0],dp[2],4.3,0,8,-Math.PI/2-ROTATION+angle);
  // Large roof gable and the nested open tracery triangles (not a full second roof).
  k.faces('stone',[cv([-.65,24.4,-7.35]),cv([-.65,24.4,7.35]),cv([-.65,38.8,0])],[[0,1,2]]);
  for(const [half,bottom,top] of [[7,24.6,38.6],[5.5,21.8,30.6],[3.2,7.2,13.4]])for(const s of [-1,1])bar('stone',[-1.2,bottom,s*half],[-1.2,top,0],.32);
  if(k.near){
    // Rose and Flamboyant tracery in the large west lancet.
    const p=cv([-.95,17.4,0]);const g=new THREE.TorusGeometry(3.15,.12,4,24);g.rotateY(-Math.PI/2-ROTATION+angle);g.translate(...p);k.put(g,'stone');
    for(let i=0;i<10;i++){
      const a=i*Math.PI/5;bar('stone',[-1.1,17.4,0],[-1.1,17.4+3.1*Math.sin(a),3.1*Math.cos(a)],.12);
    }
    for(const v of [-2.8,-1.4,0,1.4,2.8])bar('stone',[-1.1,9.1,v],[-1.1,17.4,v],.14);
  }
  for(const v of [-7.45,7.45]){
    bx('stone',-.2,12.8,v,2.3,25.6,2.1);
    const p=cv([-.2,0,v]);k.cylinder('stone',p[0],p[2],1.1,25.5,29.5);k.cylinder('stone',p[0],p[2],1.15,29.5,37.2,0,6);
  }
  const p=cv([0,0,0]);k.cylinder('stone',p[0],p[2],.3,38.7,40.2,0,4);
  // North oratory and paired small side towers; all mapped within the chapel outline.
  bx('stone',35,10,-13.1,7,20,7);const or=cv([35,0,-13.1]);k.hip('roof',or[0],or[2],7.5,7.5,20,25.9,2);
  const st=cv([30,0,-17]);k.cylinder('stone',st[0],st[2],1.5,0,25.2);k.cylinder('roof',st[0],st[2],1.7,25.2,28.5,0);
}

function wings(k){
  // Mapped secondary structures carry the court's scale; the modern surroundings stay provider-owned.
  for(const [id,eave,top] of [[83819059,21,29.7],[1458069802,20,25.6],[1458069805,20,25.4],[110188229,13,19.4],[1250045954,5.9,8.5],[83817177,8.5,11.1],[83820290,15.7,17.7],[180595315,4.9,9.2]]){
    const r=plan(id),q=bounds(r);k.solid('stone',r,0,eave);
    // Roof follows the building's narrow mapped roof parts instead of one
    // shallow cap over the combined barracks. Pavilions retain a steep
    // continuous ridge; revised roof heights are photo estimates.
    const w=q.w*.97,d=q.d*.98;
    if(id===83817177){
      for(const part of [1458508973,1458508974,1458508975]){const a=bounds(plan(part));k.hip('roof',a.x,a.z,a.w,a.d,eave,eave+a.w*.52,0,{base:false});}
    }else {
      // Photo-estimated slate profiles: a true ridge and >=45 degree sides.
      // Give the full footprint a pitched form, rather than a broad plateau.
      k.hip('roof',q.x,q.z,w,d,eave,Math.max(top,eave+w*.52),Math.min(w*.5,d*.3),{base:false});
    }
    const rows=eave>19?[4.5,10.2,16.2]:eave>12?[3.5,8,12.8]:[3.5,6.5].filter(y=>y<eave-1);
    const step=5.6;
    for(const y of rows)for(let z=q.z-d/2+3;z<q.z+d/2-1;z+=step)for(const s of [-1,1]){
      // Separate small windows, including far. Offset beyond mapped articulation to avoid layered faces.
      k.panel('glass',q.x+s*(q.w/2+.3),y,z,1.25,eave>19?2.4:1.65,s*Math.PI/2);
    }
    if(k.near){
      for(const y of rows)k.box('stone',[q.x,y-1.55,q.z],[q.w+.1,.24,q.d]);
      if(eave>19)for(let z=q.z-d/2+5;z<q.z+d/2-4;z+=11.2){
        for(const s of [-1,1]){
          k.box('stone',[q.x+s*w*.32,eave+1.1,z],[1.8,2.2,2]);
          k.hip('roof',q.x+s*w*.32,z,2.2,2.4,eave+2.2,eave+3.3,.6);
        }
      }
    }
  }
  // Le Vau portico: freestanding columns and supported lintel, no floating slab.
  const q=bounds(plan(1416533435));
  for(let i=0;i<6;i++){
    const x=q.x-q.w/2+1+i*(q.w-2)/5;
    k.cylinder('stone',x,q.z, .45,0,6.6, .45,6);
  }
  k.box('stone',[q.x,7,q.z],[q.w, .8,5.5]);k.hip('roof',q.x,q.z,q.w,6.2,7.4,8.8,2);
}

export function create({detail='near'}={}){
  const b=assetBuilder({...SPEC,palette:PALETTES.light},detail),k=kit(b,detail==='near');
  fortress(k);chapel(k);wings(k);
  const root=b.finish();
  root.traverse(o=>{if(!o.isMesh)return;const old=o.geometry;old.deleteAttribute('bridgeLift');o.geometry=mergeVertices(old,1e-4);old.dispose();o.geometry.rotateY(ROTATION);o.geometry.computeBoundingBox();o.geometry.computeBoundingSphere();});
  root.userData.elevationDatum=MANIFEST.elevationDatum;return root;
}
