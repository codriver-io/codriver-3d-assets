import * as THREE from 'three';
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';
import { PROFILE as P, DECK_H, WALK_H, TOWER_S, CENTRE_S, ABUTMENT_S, STRUCTURE_START, STRUCTURE_END } from './tower-bridge-profile.js';

// Original architectural interpretation. Station s follows the mapped road north to south;
// lateral d is right (west). Geometry and navigation use precisely the same frame.
export function create({ detail = 'near' } = {}) {
  const near = detail === 'near';
  const b = assetBuilder({ ...SPEC, palette: PALETTES.light }, detail);
  const xyz = (s,d,y) => { const q=P.bridgePoint(s,d,y); return [q.x,q.y,q.z]; };
  const lift = y => Math.max(0, Math.min(1, y / DECK_H));
  const box = (mat,s,d,y,along,across,tall,attach=1) => {
    const q=P.bridgePoint(s,d,y); b.box(mat,[q.x,q.y,q.z],[along,tall,across],-Math.atan2(q.tz,q.tx),0,attach);
  };
  const beam = (mat,a,c,w,dep=w) => b.bar(mat,xyz(...a),xyz(...c),w,dep);
  const put = (g,mat,attach=1) => {
    g.deleteAttribute('uv');
    const indexed=mergeVertices(g,1e-6); g.dispose(); b.put(indexed,mat,0,attach);
  };
  function reverse(g) {
    if(g.index){const a=g.index.array;for(let i=0;i<a.length;i+=3)[a[i+1],a[i+2]]=[a[i+2],a[i+1]];}
    else {const p=g.attributes.position;for(let i=0;i<p.count;i+=3){const a=[p.getX(i+1),p.getY(i+1),p.getZ(i+1)];p.setXYZ(i+1,p.getX(i+2),p.getY(i+2),p.getZ(i+2));p.setXYZ(i+2,...a);}}
    return g;
  }
  function transform(g,s,d=0) {
    const a=g.attributes.position;
    for(let i=0;i<a.count;i++) { const q=xyz(s+a.getZ(i),d+a.getX(i),a.getY(i)); a.setXYZ(i,...q); }
    reverse(g); g.computeVertexNormals(); return g;
  }
  function polygon(mat,points,s,depth,attach=1) {
    const shape=new THREE.Shape(points.map(v=>new THREE.Vector2(...v)));
    const g=new THREE.ExtrudeGeometry(shape,{depth,bevelEnabled:false,curveSegments:near?16:8});
    g.translate(0,0,-depth/2); put(transform(g,s),mat,attach);
  }
  // Solid arch spandrel, with a genuine open roadway. Outline follows the arch soffit;
  // it is not a dark rectangle painted onto a closed tower.
  function portal(s,base,top,half,depth,r=5.2) {
    const spring=base+5.4, pts=[[-half,base],[-r,base],[-r,spring]];
    const n=near?24:12;
    for(let i=1;i<=n;i++){const t=Math.PI-i*Math.PI/n;pts.push([r*Math.cos(t),spring+r*Math.sin(t)]);}
    pts.push([r,base],[half,base],[half,top],[-half,top]);
    polygon('stone',pts,s,depth,lift);
    // Radial voussoirs follow the open soffit on BOTH faces.
    for(const face of [-1,1]) {
      const n2=near?24:12;
      for(let i=0;i<n2;i++) {
        const t0=i*Math.PI/n2,t1=(i+1)*Math.PI/n2;
        const rad=(rr,t)=>[rr*Math.cos(t),spring+rr*Math.sin(t)];
        polygon('trim',[rad(r,t0),rad(r,t1),rad(r+0.65,t1),rad(r+0.65,t0)],s+face*(depth/2+0.10),0.18);
      }
    }
  }
  // Hard-edged, closed ribbon with per-face normals. Sample ramps finely in both LODs
  // so far pavement also stays beneath the live HD overlay after datum fitting.
  function ribbon(mat,a,c,left,right,top,bottom,attach=1,step=near?4:8) {
    const stations=new Set([a,c]);
    for(let s=a+step;s<c;s+=step)stations.add(s);
    for(const q of P.ALIGNMENT)if(q.s>a&&q.s<c)stations.add(q.s);
    const ss=[...stations].sort((a,c)=>a-c), pos=[];
    const quad=(a,c,d,e)=>pos.push(...a,...c,...d,...a,...d,...e);
    const y=(f,s)=>typeof f==='function'?f(s):f;
    for(let i=1;i<ss.length;i++) {
      const u=ss[i-1],v=ss[i];
      const A=xyz(u,left,y(top,u)),B=xyz(u,right,y(top,u)),C=xyz(v,right,y(top,v)),D=xyz(v,left,y(top,v));
      const E=xyz(u,left,y(bottom,u)),F=xyz(u,right,y(bottom,u)),G=xyz(v,right,y(bottom,v)),H=xyz(v,left,y(bottom,v));
      quad(A,D,C,B); if(y(bottom,u)>0.001 || y(bottom,v)>0.001)quad(E,F,G,H);quad(A,E,H,D);quad(B,C,G,F);
      if(i===1)quad(A,B,F,E);if(i===ss.length-1)quad(D,H,G,C);
    }
    const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));reverse(g);g.computeVertexNormals();put(g,mat,attach);
  }
  const h=s=>P.deckHeight(s);
  // Slab ends taper to grade, so no negative faces or transverse curb at either join.
  ribbon('asphalt',0,P.BRIDGE_LENGTH,-4.2,4.2,h,s=>Math.max(0,h(s)-0.25));
  ribbon('steel',STRUCTURE_START,STRUCTURE_END,-8.25,8.25,s=>h(s)-0.28,s=>Math.max(0,h(s)-0.9));
  for(const o of [-1,1]) {
    const lo=o<0?-8.25:4.35,hi=o<0?-4.35:8.25;
    ribbon('trim',0,P.BRIDGE_LENGTH,lo,hi,s=>h(s)+0.14,s=>Math.max(0,h(s)-0.22));
    ribbon('steel',STRUCTURE_START,STRUCTURE_END,o*8.15-0.10,o*8.15+0.10,s=>h(s)+1.25,s=>h(s)+1.08);
    ribbon('steel',STRUCTURE_START,STRUCTURE_END,o*8.15-0.10,o*8.15+0.10,s=>h(s)+0.35,s=>h(s)+0.18);
    for(let s=STRUCTURE_START;s<STRUCTURE_END;s+=near?1.9:7.6)box('steel',s,o*8.15,h(s)+0.71,0.12,0.12,1.04);
  }
  // The closed bascule pair has its own deep floor beams and a narrow centre seam.
  const leafEnds=[TOWER_S[0]+5.5,CENTRE_S-0.06,CENTRE_S+0.06,TOWER_S[1]-5.5];
  for(const [a,c] of [[leafEnds[0],leafEnds[1]],[leafEnds[2],leafEnds[3]]]) {
    for(const d of [-7.6,7.6])ribbon('steel',a,c,d-0.22,d+0.22,7.58,6.4);
    if(near)for(let s=a+1.8;s<c;s+=4)box('steel',s,0,7.0,0.3,15.2,0.6);
  }
  box('roof',CENTRE_S,0,8.515,0.12,8.4,0.02);
  if(near)for(let s=5;s<P.BRIDGE_LENGTH-5;s+=10)ribbon('white',s,s+3,-0.065,0.065,k=>h(k)+0.025,k=>h(k)+0.015,1,4);
  // Side-span chains: blue double chords with open white lattice webs, hangers
  // and deck girders; there are deliberately NO suspension cables across the bascules.
  for(let side=0;side<2;side++) {
    const outer=ABUTMENT_S[side];
    // inner = outer face of each main tower.
    const towerFace=TOWER_S[side]+(side?5.5:-5.5);
    const samples=near?28:12;
    const low=h(outer)+4.2,high=43.8;
    const y=t=>low+(high-low)*t*t;
    for(const d of [-7.25,7.25]) {
      for(let i=0;i<samples;i++) {
        const t=i/samples,u=(i+1)/samples,s=outer+(towerFace-outer)*t,q=outer+(towerFace-outer)*u;
        beam('steel',[s,d,y(t)],[q,d,y(u)],0.75,0.42);
        beam('white',[s,d,y(t)-2.2],[q,d,y(u)-2.2],0.32);
        if(near || i%2===0)beam('white',[s,d,y(t)-2.2],[q,d,y(u)],0.14);
        if(i>0 && (near || i%2===0))beam('white',[s,d,h(s)+0.1],[s,d,y(t)-2.2],near?0.14:0.21);
      }
      if(near)for(let s=Math.min(outer,towerFace)+3;s<Math.max(outer,towerFace)-2;s+=5) {
        box('steel',s,d,h(s)-1.1,0.35,0.65,1.6);
        box('white',s,d,h(s)+0.15,0.16,0.6,0.18);
      }
    }
  }
  // Tapered, pointed river piers supporting the twin Gothic towers.
  for(const s of TOWER_S) {
    const outline=[[-5.8,-12.0],[-5.8,-14.0],[0,-17.2],[5.8,-14.0],[5.8,12.0],[0,17.2],[-5.8,14.0]];
    const sh=new THREE.Shape(outline.map(v=>new THREE.Vector2(...v)));
    const g=new THREE.ExtrudeGeometry(sh,{depth:8.0,bevelEnabled:false});
    // The shape's x/y are along/across; extrusion is height.
    const a=g.attributes.position;
    for(let i=0;i<a.count;i++){const q=xyz(s+a.getX(i),a.getY(i),a.getZ(i));a.setXYZ(i,...q);}
    reverse(g);g.computeVertexNormals();put(g,'stone',lift);
    box('trim',s,0,8.15,12.0,28.0,0.3);
    portal(s,DECK_H,52.0,9.5,11.0);
    // Projecting corner buttresses and string courses; main mass remains thin along the road.
    for(const d of [-8.7,8.7])for(const u of [-4.8,4.8]) {
      box('trim',s+u,d,30.55,2.0,2.0,43.9);
      box('stone',s+u,d,53.2,2.7,2.7,3.0);
    }
    for(const y of [22,30,38.5,46,52.2]) {
      box('trim',s,0,y,11.5,19.6,0.55);
      if(near)for(const o of [-1,1])for(let u=-4.2;u<5;u+=1.4)box('stone',s+u,o*9.95,y-0.7,0.35,0.4,0.9);
    }
    // Narrow paired Gothic windows on all four facades, with 8 cm relief.
    for(const y of near?[25.4,33.8,41.5,49]:[33.8,49]) {
      for(const face of [-1,1])for(const d of [-5.2,-2.0,2.0,5.2]) {
        box('glass',s+face*5.58,d,y,0.12,1.12,2.7);
        if(near){for(const v of [-0.68,0.68])box('trim',s+face*5.70,d+v,y,0.20,0.16,3.0);box('trim',s+face*5.70,d,y-1.55,0.2,1.6,0.24);}
      }
      for(const face of [-1,1])for(const u of [-2.2,2.2]) {
        box('glass',s+u,face*9.59,y,1.2,0.12,2.7);
        if(near)for(const v of [-0.76,0.76])box('trim',s+u+v,face*9.72,y,0.18,0.20,3.0);
      }
    }
    if(near)for(const face of [-1,1]) {
      polygon('trim',[[-2.0,47.4],[0,50.2],[2.0,47.4]],s+face*5.73,0.22);
      polygon('stone',[[-1.65,47.6],[0,49.8],[1.65,47.6]],s+face*5.88,0.12);
      for(const y of [25.4,33.8,41.5])for(const d of [-5.2,-2,2,5.2]) {
        polygon('trim',[[d-0.75,y+1.5],[d,y+2.35],[d+0.75,y+1.5]],s+face*5.73,0.16);
        polygon('glass',[[d-0.47,y+1.45],[d,y+2.1],[d+0.47,y+1.45]],s+face*5.84,0.08);
      }
    }
    // Battlement crown with corner octagonal turrets and steep slate pyramids.
    for(const face of [-1,1]) {
      box('stone',s,face*9.1,53.3,10,0.8,2.0);
      for(let u=-4.5;u<=4.5;u+=1.5)box('trim',s+u,face*9.1,54.8,0.8,1.0,1.0);
    }
    // Central hipped roof, retained identically in far.
    const roofPts=[[-7.3,53.2],[-7.3,55.0],[0,62.2],[7.3,55.0],[7.3,53.2]];
    polygon('roof',roofPts,s,7.0);
    beam('gold',[s-3.5,0,62.2],[s+3.5,0,62.2],0.20);
    for(const d of [-8.4,8.4])for(const u of [-4.3,4.3]) {
      const shaft=new THREE.CylinderGeometry(1.25,1.45,4.0,near?8:6);shaft.translate(0,56,0);put(transform(shaft,s+u,d),'stone');
      const cone=new THREE.ConeGeometry(1.85,6.4,near?8:6);cone.translate(0,61.2,0);put(transform(cone,s+u,d),'roof');
      box('gold',s+u,d,64.5,0.16,0.16,1.0);
      if(near)for(const o of [-1,1])box('glass',s+u+o*1.28,d,56.1,0.08,0.48,1.5);
    }
    if(near)for(const d of [-5.9,5.9])for(const face of [-1,1])box('light',s+face*5.72,d,21.1,0.16,0.6,0.3);
  }
  // Two separated high walkways: open transverse gap and white diagonal lattice.
  const start=TOWER_S[0]+5.3,end=TOWER_S[1]-5.3;
  for(const d of [-7.1,7.1]) {
    box('steel',(start+end)/2,d,WALK_H-0.25,end-start,3.2,0.5);
    box('roof',(start+end)/2,d,45.6,end-start,3.55,0.45);
    for(const edge of [-1,1]) {
      const lateral=d+edge*1.55;
      beam('white',[start,lateral,42.1],[end,lateral,42.1],0.30);
      beam('white',[start,lateral,45.1],[end,lateral,45.1],0.25);
      const n=near?24:12;
      for(let i=0;i<n;i++) {
        const a=start+(end-start)*i/n,c=start+(end-start)*(i+1)/n;
        beam('white',[a,lateral,42.25],[c,lateral,44.9],near?0.13:0.20);
        if(near)beam('white',[a,lateral,44.9],[c,lateral,42.25],0.13);
        box('steel',a,lateral,43.65,0.12,0.15,3.0);
      }
    }
    // Golden central medallion / coat of arms is a low-resolution geometry cue.
    const med=new THREE.CylinderGeometry(1.0,1.0,0.18,near?12:8);med.rotateX(Math.PI/2);med.translate(0,43.6,0);
    put(transform(med,CENTRE_S,d+Math.sign(d)*1.7),'gold');
    if(near)beam('light',[start,d+Math.sign(d)*1.75,45.1],[end,d+Math.sign(d)*1.75,45.1],0.06);
  }
  // Low abutment gateways at the ends of each suspension span.
  for(const s of ABUTMENT_S) {
    const base=h(s)+0.14;
    for(const d of [-8.4,8.4])box('stone',s,d,base/2,10.5,3.4,base,lift);
    portal(s,base,base+14.0,10,5.6,5.2);
    box('trim',s,0,base+14.25,6.3,20.7,0.5);
    polygon('roof',[[-7.3,base+14.5],[0,base+18.0],[7.3,base+14.5]],s,4.5);
    for(const o of [-1,1])for(let d=-9;d<=9;d+=1.8)box('trim',s+o*2.8,d,base+14.9,0.8,1,0.9);
  }
  // Solid approach retaining wedges, fixed ground foot and fitted top.
  for(const [a,c] of [[0,STRUCTURE_START],[STRUCTURE_END,P.BRIDGE_LENGTH]])for(const o of [-1,1]) {
    ribbon('stone',a,c,o<0?-8.2:7.5,o<0?-7.5:8.2,s=>Math.max(0.01,h(s)-0.3),0,lift);
  }
  // Traditional lamp posts outside the carriageway.
  if(near)for(let s=STRUCTURE_START+8;s<STRUCTURE_END;s+=21) {
    if([...TOWER_S,...ABUTMENT_S].some(q=>Math.abs(q-s)<9))continue;
    for(const d of [-6.2,6.2]) {
      box('roof',s,d,h(s)+2.4,0.16,0.16,4.5);
      box('roof',s,d,h(s)+4.55,0.6,0.6,0.14);
      box('light',s,d,h(s)+4.88,0.38,0.38,0.5);
      const cap=new THREE.ConeGeometry(0.4,0.35,4);cap.translate(0,h(s)+5.3,0);put(transform(cap,s,d),'roof');
    }
  }
  return b.finish();
}
