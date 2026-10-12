import * as THREE from 'three';
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';
import { PARTS } from './tower-of-london-plan.js';
import { masonry, edges, frame } from './tower-of-london-masonry.js';
import { stairParts } from './tower-of-london-stair.js';

const part = id => PARTS.find(p => p.id === id);
export const MOAT_RINGS = [
  [[-131,26],[-168,-68],[-148,-77],[-115,24]],
  [[-83,-120],[-68,-142],[30,-149],[104,-91],[116,-79],[93,-93],[28,-125]],
  [[107,-70],[124,-72],[115,99],[100,97]],
];
export const WHITE_TURRETS = [717251841,717251843,717251844,717251842];
const WALLS = new Set([369135032,369135042,369135044,369139031,369139034,369139035,369142727,369142729,369143069,369143089,369143426,369143427,370868090,370868091,370870742,370870743,370870747,933942623,933942624,936720730,936720732]);

export function create({ detail = 'near' } = {}) {
  const near = detail === 'near', b = assetBuilder({ ...SPEC, palette: PALETTES.light }, detail), k = masonry();
  whiteTower(k,b,near); waterloo(k,b,near);
  for (const original of PARTS.filter(p => !p.part && ![369135772,369135775,369136185,369135041,369143430].includes(p.id))) {
    const p=near ? original : {...original,ring:simplify(original.ring,.45)};
    if (p.id === 370870740) { traitorsGate(k,b,p,near); continue; }
    if (WALLS.has(p.id)) { curtain(k,b,p,near); continue; }
    const tower = p.tags.man_made === 'tower' || /Tower|Mount/.test(p.name);
    const ruin = p.tags.building === 'ruins', house = p.tags.building === 'house', brick = [369137116,369136791].includes(p.id);
    const h = Number(p.tags.height) || (tower ? (p.id === 369125627 ? 18 : p.id === 59213567 ? 13 : 12) : ruin ? 4 : house ? 8 : p.id === 369136658 ? 7 : 13);
    const mat = brick ? 'brick' : house ? 'pale' : 'stone';
    if(ruin) k.solid(mat,p.ring,0,h);
    else facade(k,p.ring,h,mat,near,tower ? 1 : h>10 ? 3 : 2,tower ? 5 : 4,!house);
    if(tower) { k.cap('lead',p.ring,h-.15); crenellate(b,p.ring,h,near,mat,2.6); }
    else if(!ruin) pitchedRoof(k,p.ring,h,h+(house ? 2.8 : 3.5),mat);
  }
  for(const r of MOAT_RINGS) k.cap('grass',r,.025);
  k.flush(b);
  const root=b.finish();
  for(const mesh of root.children) {const g=mergeVertices(mesh.geometry,.0001);mesh.geometry.dispose();mesh.geometry=g;g.computeBoundingBox();g.computeBoundingSphere();}
  root.userData.whiteTowerBattlementsM=27; root.userData.moat='Dry grass strips; terrain trench depth not baked';
  return root;
}

function facade(k,ring,h,mat,near,rows,pitch,round) {
  for(const e of edges(ring)) {
    if(e.L<3.6) { k.panel(mat,e,0,e.L,0,h); continue; }
    const bays=Math.max(1,Math.floor(e.L/(pitch*(near ? 1 : mat==='pale' ? (h>=25 ? 1.8 : 2.8) : 3))));
    for(let row=0;row<rows;row++) {
      const y0=row*h/rows,y1=(row+1)*h/rows;
      for(let i=0;i<bays;i++) {
        const u0=i*e.L/bays,u1=(i+1)*e.L/bays;
        const winH=Math.min(2.3,h/rows*.36),winW=Math.min(round ? 1.2 : 1.4,(u1-u0)*.43);
        const doorU=(-11-e.p[0])/e.t[0];
        const door=mat==='pale' && h===25.5 && row===0 && e.n[1]>.8 && doorU>u0+1 && doorU<u1-1;
        k.opening(mat,e,u0,u1,y0,y1,door ? doorU : (u0+u1)/2,door ? 5.45 : y0+Math.min(1.5,h/rows*.25),door ? 1.5 : winW,door ? 1.9 : winH,near,round && (near || mat==='pale')); 
      }
    }
  }
}

function crenellate(b,ring,y,near,mat,pitch=2.7,merlonH=1.05,outwardOnly=false,farScale=5.5) {
  for(const e of edges(simplify(ring,near ? .025 : .9))) {
    if(e.L<.7) continue;
    if(outwardOnly && e.n[0]*(e.p[0]+e.q[0])/2+e.n[1]*(e.p[1]+e.q[1])/2<0) continue;
    const n=Math.max(1,Math.round(e.L/(pitch*(near ? 1 : farScale)))),step=e.L/n,angle=-Math.atan2(e.t[1],e.t[0]);
    // The parent wall already reaches y: it is the continuous parapet support.
    for(let i=0;i<n;i++) {
      const u=(i+.5)*step;
      const m=masonry(), center=[e.p[0]+u*e.t[0]-e.n[0]*.30,e.p[1]+u*e.t[1]-e.n[1]*.30], w=(near ? step*.55 : Math.min(step*.55,pitch*.55))/2,d=.30;
      const ring=[[-w,-d],[w,-d],[w,d],[-w,d]].map(([a,c])=>[center[0]+e.t[0]*a+e.n[0]*c,center[1]+e.t[1]*a+e.n[1]*c]);
      m.solid(mat,ring,y,y+merlonH);m.flush(b);
    }
  }
}

function whiteTower(k,b,near) {
  const body=part(932808903).ring;
  facade(k,body,25.5,'pale',near,3,5,true); k.cap('lead',body,23.3);
  crenellate(b,body,25.5,near,'pale',2,1.5,false,2);
  for(const id of [932980671,932980672]) pitchedRoof(k,part(id).ring,23.3,24.6,'pale');
  if(near) for(const e of edges(body).filter(e=>e.L>12)) {
    const n=Math.round(e.L/5),a=-Math.atan2(e.t[1],e.t[0]);
    for(let i=1;i<n;i++) b.box('pale',[e.p[0]+e.t[0]*e.L*i/n+e.n[0]*.14,12.5,e.p[1]+e.t[1]*e.L*i/n+e.n[1]*.14],[.6,25,.28],a);
  }
  for(const id of WHITE_TURRETS) {
    const r=part(id).ring,F=frame(r),c=F.at((F.u0+F.u1)/2,(F.v0+F.v1)/2,0),x=c[0],z=c[2];
    const circular=id===717251842,shaft=circular ? 31 : 30.4;
    facade(k,r,shaft,'pale',near,5,6,true); k.cap('pale',r,shaft);
    if(circular) dome(k,x,z,3.15,shaft,33.5,near);
    else for(const e of edges(r)) k.tri('lead',[e.p[0]+e.n[0]*.12,shaft,e.p[1]+e.n[1]*.12],[e.q[0]+e.n[0]*.12,shaft,e.q[1]+e.n[1]*.12],[x,32,z],[e.n[0],.5,e.n[1]]);
    const y=circular ? 33.5 : 32,top=circular ? 35 : 34.2;
    b.bar('lead',[x,y,z],[x,top,z],.12);
    b.box(near ? 'trim' : 'lead',[x,top-.42,z],[.80,.22,.12]);
    if(near) b.box('trim',[x+.30,top-.27,z],[.32,.30,.12]);
  }
  // First-floor entrance access: grounded stair treads and supported landing.
  for(const p of stairParts(near?'near':'far'))b.put(p.geometry,'timber');
}

function dome(k,x,z,rad,y0,y1,near) {
  const sides=near ? 20 : 10,profile=[[0,1],[.25,.94],[.65,.64],[.9,.25],[1,.025]];
  for(let j=0;j<profile.length-1;j++) for(let i=0;i<sides;i++) {
    const point=(s,p)=>{const a=s*2*Math.PI/sides;return [x+Math.cos(a)*rad*p[1],y0+(y1-y0)*p[0],z+Math.sin(a)*rad*p[1]];};
    const a=i*2*Math.PI/sides;
    k.quad('lead',point(i,profile[j]),point(i+1,profile[j]),point(i+1,profile[j+1]),point(i,profile[j+1]),[Math.cos(a),.7,Math.sin(a)]);
  }
}

// Gable roof clipped into two planar halves at the mapped longitudinal ridge.
function pitchedRoof(k,ring,eave,ridge,mat='stone') {
  const F=frame(ring),vm=(F.v0+F.v1)/2;
  const input=ring.map(p=>[p[0]*F.t[0]+p[1]*F.t[1],p[0]*F.n[0]+p[1]*F.n[1]]);
  for(const sign of [-1,1]) {
    const out=[];
    for(let i=0;i<input.length;i++) {
      const a=input[i],c=input[(i+1)%input.length],da=sign*(a[1]-vm),dc=sign*(c[1]-vm);
      if(da>=0)out.push(a);
      if((da<0)!==(dc<0)){const t=da/(da-dc);out.push([a[0]+(c[0]-a[0])*t,vm]);}
    }
    if(out.length<3)continue;
    const den=sign<0 ? vm-F.v0 : F.v1-vm,height=v=>ridge-(ridge-eave)*Math.abs(v-vm)/den;
    const pts=out.map(([u,v])=>F.at(u,v,height(v)));
    // Custom cap triangulation handles concave half-polygons too.
    const plan=pts.map(p=>[p[0],p[2]]);
    // Planar roof fan is safe for the rectangular main ranges; each mapped wing
    // uses a clipped fan without extra floating ridge or chimney geometry.
    for(const ids of THREE.ShapeUtils.triangulateShape(plan.map(p=>new THREE.Vector2(...p)),[])) k.tri('lead',...ids.map(i=>pts[i]),[0,1,0]);
  }
  for(const e of edges(ring)) {
    const val=p=>p[0]*F.n[0]+p[1]*F.n[1],a=val(e.p),c=val(e.q);
    const h=v=>ridge-(ridge-eave)*Math.abs(v-vm)/(v<vm ? vm-F.v0 : F.v1-vm);
    const positions=[[e.p[0],eave,e.p[1]],[e.q[0],eave,e.q[1]],[e.q[0],h(c),e.q[1]]];
    if((a<vm)!==(c<vm)){const t=(vm-a)/(c-a);positions.push([e.p[0]+t*(e.q[0]-e.p[0]),ridge,e.p[1]+t*(e.q[1]-e.p[1])]);}
    positions.push([e.p[0],h(a),e.p[1]]);
    for(let i=1;i<positions.length-1;i++)k.tri(mat,positions[0],positions[i],positions[i+1],[e.n[0],0,e.n[1]]);
  }
}

function waterloo(k,b,near) {
  const body=part(932849975).ring;
  facade(k,body,14,'pale',near,3,3.8,false); pitchedRoof(k,part(932849974).ring,14,18,'pale'); crenellate(b,body,14,near,'pale',2.4);
  for(const id of [932849976,932849977,932849972,932849973]) {
    const r=part(id).ring; facade(k,r,20,'pale',near,4,6,true); k.cap('lead',r,19.5); crenellate(b,r,20,near,'pale',2.5);
  }
  const gate=part(932849970).ring; k.solid('pale',gate,14,18,false); k.cap('lead',gate,18);
}

function curtain(k,b,p,near) {
  const outer=[370868090,936720730,936720732].includes(p.id),h=outer ? 6.3 : Number(p.tags.height)||6;
  k.solid('stone',p.ring,0,h); crenellate(b,p.ring,h,near,'stone',outer ? 3 : 2.7,.9,!near);
}

function traitorsGate(k,b,p,near) {
  const r=simplify(p.ring,.04),candidates=edges(r).filter(e=>e.L>14&&e.n[1]>.5),front=candidates.sort((a,c)=>c.L-a.L)[0];
  for(const e of edges(r)) {
    if(e.p===front?.p)continue;
    k.panel('stone',e,0,e.L,0,9);
  }
  if(front) {
    const u=front.L/2,w=9,spring=3,radius=w/2,a=u-radius,c=u+radius;
    k.panel('stone',front,0,a,0,9); k.panel('stone',front,c,front.L,0,9);
    for(let i=0;i<(near ? 12 : 6);i++) {
      const n=near ? 12 : 6,t0=i*Math.PI/n,t1=(i+1)*Math.PI/n;
      const x0=u+radius*Math.cos(t0),x1=u+radius*Math.cos(t1),y0=spring+radius*Math.sin(t0),y1=spring+radius*Math.sin(t1);
      k.quad('stone',k.at(front,x0,y0),k.at(front,x1,y1),k.at(front,x1,9),k.at(front,x0,9),[front.n[0],0,front.n[1]]);
      k.quad('trim',k.at(front,x0,y0),k.at(front,x1,y1),k.at(front,x1,y1,-1.8),k.at(front,x0,y0,-1.8),[0,-1,0]);
    }
    for(let i=0;i<=12;i+=(near ? 1 : 3)){const q=k.at(front,a+i*w/12,.02,-2),s=k.at(front,a+i*w/12,3.05,-2);b.bar('timber',q,s,.13);}
  }
  pitchedRoof(k,r,9,12); crenellate(b,r,9,near,'stone',2.6,.7);
}

// Remove nearly collinear mapping points; far arc faceting stays within 0.55 m.
function simplify(input,tol) {
  const r=[...input]; let changed=true;
  while(changed && r.length>4) {
    changed=false;
    for(let i=0;i<r.length;i++) {
      const a=r[(i+r.length-1)%r.length],c=r[(i+1)%r.length],p=r[i],dx=c[0]-a[0],dz=c[1]-a[1],len=Math.hypot(dx,dz);
      if(len && Math.abs(dx*(p[1]-a[1])-dz*(p[0]-a[0]))/len<tol) {r.splice(i,1);changed=true;break;}
    }
  }
  return r;
}
