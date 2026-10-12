import * as THREE from 'three';
import polygonClipping from 'polygon-clipping';
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';
import { PARTS, WORLD } from './palacio-de-cibeles-plan.js';

const closed = r => [...r,r[0]];
const area = r => r.reduce((s,a,i)=>{const c=r[(i+1)%r.length];return s+a[0]*c[1]-c[0]*a[1];},0)/2;
const clean = r => r.slice(0,-1);
const union = ps => ps.length ? polygonClipping.union(...ps.map(p=>[closed(p.ring)])) : [];
function putFace(b,mat,pts,normal) {
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pts.flat(),3));
  const a=new THREE.Vector3(...pts[1]).sub(new THREE.Vector3(...pts[0])),c=new THREE.Vector3(...pts[2]).sub(new THREE.Vector3(...pts[0]));
  const flip=a.cross(c).dot(new THREE.Vector3(...normal))<0;
  const ix=[];for(let i=1;i<pts.length-1;i++)ix.push(...(flip?[0,i+1,i]:[0,i,i+1]));g.setIndex(ix);g.computeVertexNormals();b.put(g,mat);
}
function plane(b,mat,polys,point,normal) {
  for(const poly of polys){const outer=clean(poly[0]),holes=poly.slice(1).map(clean),all=[outer,...holes].flat();
    const tris=THREE.ShapeUtils.triangulateShape(outer.map(p=>new THREE.Vector2(...p)),holes.map(r=>r.map(p=>new THREE.Vector2(...p))));
    for(const t of tris)putFace(b,mat,t.map(i=>point(...all[i])),normal);
  }
}
function cylinder(b,x,z,y,h,r1,r2,n,mat='stone'){
  const g=new THREE.CylinderGeometry(r2,r1,h,n);g.translate(x,y+h/2,z);b.put(g,mat);
}
function spire(b,x,z,y,h,near,r=.42){
  cylinder(b,x,z,y,h*.35,r,r*.7,near?8:4);
  cylinder(b,x,z,y+h*.28,h*.25,r*1.15,r*.85,near?8:4);
  cylinder(b,x,z,y+h*.48,h*.52,r*.65,0,near?8:4);
}
function ornament(b,p,near){
  // Abstract stone mask: head, shoulders and spreading leafy wings, embedded in the wall.
  const g=new THREE.SphereGeometry(.32,near?8:4,near?3:2);g.scale(1,1.3,.65);g.translate(...p);b.put(g,'stone');
  for(const sign of [-1,1])b.bar('stone',[p[0],p[1]-.2,p[2]],[p[0]+sign*.72,p[1]-.4,p[2]],.28,.24);
}
function wall(b,a,c,y0,y1,near,outer=true){
  const dx=c[0]-a[0],dz=c[1]-a[1],length=Math.hypot(dx,dz);if(length<.03)return;
  const t=[dx/length,dz/length],n=[t[1],-t[0]];
  const point=(s,y,depth=0)=>[a[0]+t[0]*s+n[0]*depth,y,a[1]+t[1]*s+n[1]*depth];
  const fancy=outer&&n[0]<.4&&n[1]<.3&&y1<=40&&Math.min(a[0],c[0])<40;
  const slots=y0>=49&&y1>=61;
  const pitch=slots?1.25:fancy?3.65:4.0;
  const count=Math.max(length>3.0?1:0,Math.floor(length/(near||slots?pitch:pitch*2.2))); const step=length/Math.max(1,count);
  const apertures=[];
  // Cut the monumental loggia out of every backing facade before adding its glazing.
  const uAxis=[Math.sin(38*Math.PI/180),-Math.cos(38*Math.PI/180)],vAxis=[-Math.cos(38*Math.PI/180),-Math.sin(38*Math.PI/180)];
  const ua=a[0]*uAxis[0]+a[1]*uAxis[1],va=a[0]*vAxis[0]+a[1]*vAxis[1],du=t[0]*uAxis[0]+t[1]*uAxis[1];
  const loggiaFace=outer&&n[0]*vAxis[0]+n[1]*vAxis[1]>.85&&va>3.5&&va<10&&Math.abs(du)>.8;
  let loggia=[];
  if(loggiaFace){const r=[[-.9,34.8],[7.5,34.8],[7.5,37]];for(let j=1;j<=(near?16:8);j++){const q=j*Math.PI/(near?16:8);r.push([3.3+4.2*Math.cos(q),37+4.2*Math.sin(q)]);}
    loggia=polygonClipping.intersection([[closed(r.map(([u,y])=>[(u-ua)/du,y]))]],[[[0,y0],[length,y0],[length,y1],[0,y1],[0,y0]]]);}

  const portal=WORLD(3.3,0,16.5),ps=(portal[0]-a[0])*t[0]+(portal[2]-a[1])*t[1];
  const portalFace=outer&&length>8&&ps>2.6&&ps<length-2.6&&Math.abs((portal[0]-a[0])*n[0]+(portal[2]-a[1])*n[1])<.6;
  if(portalFace&&y0<11.9){const ring=[[ps-2.5,.3],[ps+2.5,.3],[ps+2.5,9.4]];for(let j=1;j<=(near?12:6);j++){const q=j*Math.PI/(near?12:6);ring.push([ps+Math.cos(q)*2.5,9.4+Math.sin(q)*2.5]);}const clipped=polygonClipping.intersection([[closed(ring)]],[[[0,y0],[length,y0],[length,y1],[0,y1],[0,y0]]]);for(const q of clipped)apertures.push({ring:clean(q[0]),lo:0,centre:ps,w:5,portal:true});}

  const rows=slots?[[51,61]]:[[1.2,7.8],[11.1,16.4],[20.1,24.0],[27.0,30.2],[33.3,36.7],[40,46.2]];
  for(let i=0;i<count;i++){
    const centre=(i+.5)*step,w=Math.min(step*.53,slots?1.1:near?2.15:2.8);
    for(const [lo,hi] of rows){if(portalFace&&lo<12&&Math.abs(centre-ps)<3.6)continue;let low=Math.max(y0,lo),high=Math.min(y1,hi);if(high-low<.3)continue;
      const arched=(fancy&&(lo===1.2||near&&lo===33.3))||slots;
      let ring=[[centre-w/2,low],[centre+w/2,low]];
      if(arched&&high===hi){const spring=hi-w/2;ring.push([centre+w/2,Math.max(low,spring)]);for(let j=1;j<=(near?8:4);j++){const q=j*Math.PI/(near?8:4);ring.push([centre+Math.cos(q)*w/2,Math.max(low,spring)+Math.sin(q)*w/2]);}}
      else ring.push([centre+w/2,high],[centre-w/2,high]);
      const clipped=loggia.length?polygonClipping.difference([[closed(ring)]],loggia):[[closed(ring)]];for(const q of clipped)apertures.push({ring:clean(q[0]),lo,centre,w});
    }
  }
  const rect=[[[0,y0],[length,y0],[length,y1],[0,y1],[0,y0]]];
  const holes=[...apertures.map(v=>[closed(v.ring)]),...loggia];
  const stone=holes.length?polygonClipping.difference(rect,...holes):[rect];
  plane(b,'stone',stone,(s,y)=>point(s,y),[n[0],0,n[1]]);
  for(const hole of apertures){
    const recess=hole.portal?(near?1.0:.75):near?(slots?.55:.40):0;const poly=[[closed(hole.ring)]];
    plane(b,hole.portal?'iron':hole.lo===11.1?'glow':'glass',poly,(s,y)=>point(s,y,-recess),[n[0],0,n[1]]);
    // Reveal surfaces leave a real recess, not a glass decal over a solid wall.
    for(let i=0;(near||hole.portal)&&i<hole.ring.length;i++){const p=hole.ring[i],q=hole.ring[(i+1)%hole.ring.length];const pts=[point(...p),point(...q),point(...q,-recess),point(...p,-recess)];const mid=[hole.centre,(p[1]+q[1])/2];
      putFace(b,'stone',pts,[t[0]*(mid[0]-(p[0]+q[0])/2),mid[1]-(p[1]+q[1])/2+.001,t[1]*(mid[0]-(p[0]+q[0])/2)]);
    }
    if(near&&highEnough(hole.ring)&&hole.lo<33){
      const bottom=hole.ring[0][1],top=Math.max(...hole.ring.map(v=>v[1]));
      putFace(b,'iron',[point(hole.centre-.035,bottom,-recess+.03),point(hole.centre+.035,bottom,-recess+.03),point(hole.centre+.035,top,-recess+.03),point(hole.centre-.035,top,-recess+.03)],[n[0],0,n[1]]);
      if(fancy&&hole.lo===11.1){b.bar('stone',point(hole.centre-hole.w/2-.16,top+.12,.17),point(hole.centre+hole.w/2+.16,top+.12,.17),.32,.40);if(hole.centre/step%2<1)ornament(b,point(hole.centre,top+.48,.28),near);}
    }
  }
  const relief=(s0,s1,lo,hi,d=.3)=>putFace(b,'stone',[point(s0,lo,d),point(s1,lo,d),point(s1,hi,d),point(s0,hi,d)],[n[0],0,n[1]]);
  // Deep stone surrounds on the principal upper bays remain readable in far.
  if(fancy)for(const h of apertures){if(h.portal||h.lo<20||h.lo>33.3||h.ring.length!==4||!near&&h.lo<33.3)continue;
    const low=Math.min(...h.ring.map(p=>p[1])),high=Math.max(...h.ring.map(p=>p[1]));
    for(const side of [-1,1]){const s=h.centre+side*(h.w/2+.20);relief(s-.20,s+.20,low,high,.40);}
    for(const y of [low-.12,high+.12])relief(h.centre-h.w/2-.4,h.centre+h.w/2+.4,y-.20,y+.20,.45);
  }
  // Projecting orders and mouldings share stone, avoiding cross-material depth cycles.
  for(const y of near?[9.2,18.5,25.5,31.9,38.1,48.7,63.9]:[9.2,31.9,63.9])if(y>y0+.2&&y<y1-.05){if(near)b.bar('stone',point(.02,y,.18),point(length-.02,y,.18),fancy?.6:.33,.50);else putFace(b,'stone',[point(.02,y-.2,.15),point(length-.02,y-.2,.15),point(length-.02,y+.2,.15),point(.02,y+.2,.15)],[n[0],0,n[1]]);}
  if(fancy&&length>5){
    for(let i=0;i<=count;i++){const s=i*step;if(s<.25||s>length-.25)continue;
      const lo=Math.max(y0,9.8),hi=Math.min(y1,31.5);if(hi>lo){for(const d of [-.30,.30]){if(near)b.bar('stone',point(s+d,lo,.35),point(s+d,hi,.35),.28,.85);else relief(s+d-.14,s+d+.14,lo,hi,.55);}if(near)b.bar('stone',point(s-.58,hi-.2,.38),point(s+.58,hi-.2,.38),.55,.70);}
    }
    if(near&&y1>=31.5&&y0<31.5)for(let s=.5;s<length-.3;s+=near?1.35:2.7){const p=point(s,32.4,.15);b.box('stone',p,[.30,1.2,.3]);}
  }
}
const highEnough = r => Math.max(...r.map(v=>v[1]))<49;
export function create({detail='near'}={}){
  const near=detail==='near',b=assetBuilder({...SPEC,palette:PALETTES.light},detail);
  const parts=PARTS.filter(p=>!p.roofOnly).map(p=>({...p,ring:p.ring}));
  const lantern=parts.find(p=>p.id===331693281);
  lantern.ring=Array.from({length:8},(_,i)=>{const a=(22.5+i*45)*Math.PI/180;return [2.3+5.15*Math.cos(a),-2.1+5.15*Math.sin(a)];});
  const levels=[0,...new Set(parts.map(p=>p.height))].sort((a,c)=>a-c);
  for(let k=0;k<levels.length-1;k++){
    const lo=levels[k],hi=levels[k+1],active=parts.filter(p=>p.height>lo+.01),poly=union(active);
    for(const p of poly)for(let r=0;r<p.length;r++){let ring=clean(p[r]);if((area(ring)>0)!==(r===0))ring=ring.slice().reverse();for(let i=0;i<ring.length;i++)wall(b,ring[i],ring[(i+1)%ring.length],lo,hi,near,r===0);}
    const above=union(parts.filter(p=>p.height>hi+.01));const caps=above.length?polygonClipping.difference(poly,above):poly;
    plane(b,'stone',caps,(x,z)=>[x,hi,z],[0,1,0]);
  }
  // Lead-grey mansards at the lower main ranges. The mapped glass gallery remains hollow beneath its shell.
  for(const p of PARTS.filter(p=>p.roofOnly)){
    const ring=p.ring,c=ring.reduce((s,q)=>[s[0]+q[0]/ring.length,s[1]+q[1]/ring.length],[0,0]);
    const gallery=p.id===331693280,base=gallery?19:p.height-3,rise=gallery?2:3;
    const inner=ring.map(q=>[c[0]+(q[0]-c[0])*.72,c[1]+(q[1]-c[1])*.72]);
    for(let i=0;i<ring.length;i++){const j=(i+1)%ring.length;putFace(b,gallery?'roof':'roof',[[...ring[i].slice(0,1),base,ring[i][1]],[ring[j][0],base,ring[j][1]],[inner[j][0],base+rise,inner[j][1]],[inner[i][0],base+rise,inner[i][1]]],[0,1,0]);}
    plane(b,'roof',[[closed(inner)]],(x,z)=>[x,base+rise,z],[0,1,0]);
    if(gallery){for(let i=0;i<ring.length;i+=near?1:2){const j=(i+1)%ring.length;b.bar('stone',[ring[i][0],base+.03,ring[i][1]],[inner[i][0],base+rise+.03,inner[i][1]],.09,.09);b.bar('stone',[inner[i][0],base+rise+.03,inner[i][1]],[inner[j][0],base+rise+.03,inner[j][1]],.09,.09);}}
  }
  // Pinnacle forest: mapped tiny roof parts are the named supporting tower corners.
  for(const p of PARTS.filter(p=>[331666174,331693278].includes(p.id))){
    const r=p.ring,c=r.reduce((s,q)=>[s[0]+q[0]/r.length,s[1]+q[1]/r.length],[0,0]);
    cylinder(b,c[0],c[1],p.height-.2,1.8,4.0,4.0,near?10:5);
    for(let i=0;i<r.length;i++){const q=r[i],v=r[(i+1)%r.length];
      b.bar('stone',[q[0],39.7,q[1]],[v[0],39.7,v[1]],.65,.65);
      b.bar('stone',[q[0],32.1,q[1]],[q[0],40.7,q[1]],.43,.43);
      if(near)for(let j=1;j<=3;j++){const t=j/4;b.box('stone',[q[0]+(v[0]-q[0])*t,41.9,q[1]+(v[1]-q[1])*t],[.3,1,.3]);}
      spire(b,c[0]+(q[0]-c[0])*.82,c[1]+(q[1]-c[1])*.82,41.4,4.5,near,.33);
    }
  }
  for(let i=0;i<8;i++){const a=(22.5+i*45)*Math.PI/180;spire(b,2.3+4.55*Math.cos(a),-2.1+4.55*Math.sin(a),64.3,i%2?4.4:5.7,near,.52);}
  // Smaller crenellated crowns along the two street wings.
  for(const p of parts.filter(p=>[331693273,464810798,464810797,331666170,331693272].includes(p.id))){const c=p.ring.reduce((s,q)=>[s[0]+q[0]/p.ring.length,s[1]+q[1]/p.ring.length],[0,0]);for(let i=0;i<4;i++){const a=(45+i*90)*Math.PI/180;spire(b,c[0]+2.5*Math.cos(a),c[1]+2.5*Math.sin(a),p.height-.2,4.2,near,.27);}}
  // Octagonal lantern cornice and vertical corner ribs.
  for(let i=0;i<8;i++){const a=(22.5+i*45)*Math.PI/180,c=(22.5+(i+1)*45)*Math.PI/180;
    b.bar('stone',[2.3+5.15*Math.cos(a),63.5,-2.1+5.15*Math.sin(a)],[2.3+5.15*Math.cos(c),63.5,-2.1+5.15*Math.sin(c)],.95,.95);
    b.bar('stone',[2.3+5.15*Math.cos(a),49,-2.1+5.15*Math.sin(a)],[2.3+5.15*Math.cos(a),63.4,-2.1+5.15*Math.sin(a)],.72,.72);
    for(const y of [49.5,50.6,61.6])b.bar('stone',[2.3+5.15*Math.cos(a),y,-2.1+5.15*Math.sin(a)],[2.3+5.15*Math.cos(c),y,-2.1+5.15*Math.sin(c)],.48,.78);
    b.box('stone',[2.3+4.55*Math.cos(a),64.35,-2.1+4.55*Math.sin(a)],[1.05,1.25,1.05]);
  }
  const clock=WORLD(3.3,44,7.2),face=new THREE.Vector3(-Math.cos(38*Math.PI/180),0,-Math.sin(38*Math.PI/180));
  const disk=new THREE.CircleGeometry(1.7,near?24:12);disk.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,0,1),face));disk.translate(...clock);b.put(disk,'clock');
  for(let i=0;i<12;i+=near?1:3){const a=i*Math.PI/6;const p=WORLD(3.3+1.35*Math.sin(a),44+1.35*Math.cos(a),7.28);b.box('iron',p,[.12,.22,.12]);}
  b.bar('iron',WORLD(3.3,44,7.3),WORLD(3.3,45.1,7.3),.1,.1);b.bar('iron',WORLD(3.3,44,7.3),WORLD(4.05,44.4,7.3),.1,.1);
  // Monumental semicircular loggia beneath the clock: deep glazing, carved arch and piers.
  const steps=near?16:8,upper=[];
  for(let i=0;i<=steps;i++){const a=i*Math.PI/steps;upper.push([3.3+4.2*Math.cos(a),37+4.2*Math.sin(a)]);}
  const glazing=[[3.3-4.2,34.8],[3.3+4.2,34.8],...upper];
  plane(b,'glass',[[closed(glazing)]],(u,y)=>WORLD(u,y,7.4),face.toArray());
  for(let i=0;i<steps;i++){
    const a=i*Math.PI/steps,c=(i+1)*Math.PI/steps;
    const pts=[[3.3+4.2*Math.cos(a),37+4.2*Math.sin(a)],[3.3+5.0*Math.cos(a),37+5.0*Math.sin(a)],[3.3+5.0*Math.cos(c),37+5.0*Math.sin(c)],[3.3+4.2*Math.cos(c),37+4.2*Math.sin(c)]];
    putFace(b,'stone',pts.map(p=>WORLD(...p,8.65)),face.toArray());
    putFace(b,'stone',[WORLD(...pts[0],8.65),WORLD(...pts[3],8.65),WORLD(...pts[3],7.4),WORLD(...pts[0],7.4)],[0,-1,0]);
  }
  for(const u of [-1.3,7.9]){b.bar('stone',WORLD(u,34.7,8.55),WORLD(u,37.15,8.55),.85,.85);}
  for(const u of [1.4,3.3,5.2])b.bar('stone',WORLD(u,34.9,7.65),WORLD(u,37+Math.sqrt(4.2**2-(u-3.3)**2),7.65),.24,.24);
  // Stepped Neo-Plateresque gable, supported on the main cornice.
  for(const sign of [-1,1]){for(const d of [-.25,.25])b.bar('stone',WORLD(3.3+sign*5.45+d,34.5,8.55),WORLD(3.3+sign*5.45+d,42.1,8.55),.38,.50);const p=WORLD(3.3+sign*5.45,42.25,8.55);b.box('stone',p,[1.4,.65,1.4]);spire(b,p[0],p[2],42.4,2.5,near,.32);}
  // Original abstract heraldic shield and leaf clusters above the plaza door.
  for(const sign of [-1,1])ornament(b,WORLD(3.3+sign*1.95,12.3,16.7),near);
  const group=b.finish();group.traverse(o=>{if(o.isMesh){const old=o.geometry;o.geometry=mergeVertices(old,1e-4);old.dispose();}});return group;
}
