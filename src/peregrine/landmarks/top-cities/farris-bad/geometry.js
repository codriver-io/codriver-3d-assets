import * as THREE from 'three';
import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';
import { OUTER, INNER, SOFFIT, ROOF, HEIGHT, PIER, place, ANGLE } from './farris-bad-plan.js';

export function create({ detail = 'near' } = {}) {
  const near = detail === 'near';
  const b = assetBuilder({ ...SPEC, palette: PALETTES.light }, detail);
  const mat = m => !near && m === 'metal' ? 'stone' : m;
  const box = (m, u, y, v, w, h, d) => b.box(mat(m), place(u,y,v), [w,h,d], ANGLE);
  const bar = (m, a, c, w, d=w) => b.bar(mat(m), place(...a), place(...c), w,d);
  const batches = new Map();
  function triangle(m, a, c, d, toward) {
    m = mat(m);
    if (!batches.has(m)) batches.set(m, { points:[], indices:[] });
    const A = new THREE.Vector3(...a), C = new THREE.Vector3(...c), D = new THREE.Vector3(...d);
    if (C.clone().sub(A).cross(D.clone().sub(A)).dot(new THREE.Vector3(...toward)) < 0) [c,d]=[d,c];
    const batch=batches.get(m),i=batch.points.length/3;
    batch.points.push(...a,...c,...d); batch.indices.push(i,i+1,i+2);
  }
  function quad(m, a,c,d,e, normal) {
    const n=place(normal[0],normal[1],normal[2]),zero=place(0,0,0),worldN=n.map((x,i)=>x-zero[i]);
    const ps=[a,c,d,e].map(p=>place(...p));
    m=mat(m);
    if(!batches.has(m)) batches.set(m,{points:[],indices:[]});
    const batch=batches.get(m),i=batch.points.length/3;
    batch.points.push(...ps[0],...ps[1],...ps[2],...ps[3]);
    const p0=new THREE.Vector3(...ps[0]),p1=new THREE.Vector3(...ps[1]),p2=new THREE.Vector3(...ps[2]);
    const forward=p1.sub(p0).cross(p2.sub(p0)).dot(new THREE.Vector3(...worldN))>=0;
    if(forward) batch.indices.push(i,i+1,i+2,i,i+2,i+3);
    else batch.indices.push(i,i+2,i+1,i,i+3,i+2);
  }
  function sheet(m, ring, y, up, holes=[]) {
    const points=ring.concat(...holes);
    const triangles=THREE.ShapeUtils.triangulateShape(ring.map(p=>new THREE.Vector2(...p)),holes.map(h=>h.map(p=>new THREE.Vector2(...p))));
    for (const ids of triangles) triangle(mat(m), ...ids.map(i=>place(points[i][0],y,points[i][1])), [0,up,0]);
  }
  function slab(m, ring, y0,y1, holes=[]) {
    sheet(m,ring,y0,-1,holes); sheet(m,ring,y1,1,holes);
    for(const [i,r] of [ring,...holes].entries()) {
      const area=r.reduce((sum,p,j)=>sum+p[0]*r[(j+1)%r.length][1]-r[(j+1)%r.length][0]*p[1],0);
      for(let j=0;j<r.length;j++) {
        const a=r[j],c=r[(j+1)%r.length],sign=(area>0?1:-1)*(i? -1:1);
        quad(m,[...a.slice(0,1),y0,a[1]],[c[0],y0,c[1]],[c[0],y1,c[1]],[a[0],y1,a[1]],[(c[1]-a[1])*sign,0,-(c[0]-a[0])*sign]);
      }
    }
  }
  // One continuous roof and exposed soffit around a genuinely open courtyard.
  slab('concrete',OUTER,SOFFIT,7.95,[INNER]);
  slab('stone',OUTER,14.18,ROOF,[INNER]);
  // Courtyard faces: quiet two-floor dark-framed curtain walls, not solid fill.
  function curtain(a,c,y0,y1,spacing=1.6,accent=true) {
    const du=c[0]-a[0],dv=c[1]-a[1],L=Math.hypot(du,dv),n=Math.ceil(L/spacing);
    const nu=dv/L,nv=-du/L;
    quad('glass',[a[0],y0,a[1]],[c[0],y0,c[1]],[c[0],y1,c[1]],[a[0],y1,a[1]],[nu,0,nv]);
    // Closed glass: its reverse is visible across the atrium/from under the bridge.
    quad('glass',[a[0]-nu*.07,y0,a[1]-nv*.07],[c[0]-nu*.07,y0,c[1]-nv*.07],[c[0]-nu*.07,y1,c[1]-nv*.07],[a[0]-nu*.07,y1,a[1]-nv*.07],[-nu,0,-nv]);
    for(let j=0;j<=n;j++) {
      const u=a[0]+du*j/n,v=a[1]+dv*j/n;
      bar('frame',[u,y0,v],[u,y1,v],near?.10:.15,.16);
    }
    const floors=[];
    for(let y=y0+1.6;y<y1-.5;y+=1.65) floors.push(y);
    if(!near) floors.splice(0,floors.length,(y0+y1)/2);
    for(const y of floors) bar('frame',[a[0],y,a[1]],[c[0],y,c[1]],.11,.18);
    if(accent) for(let j=0;j<n;j++) {
      if(j%4!==1)continue;
      const u0=a[0]+du*(j+.18)/n,v0=a[1]+dv*(j+.18)/n;
      const u1=a[0]+du*(j+.8)/n,v1=a[1]+dv*(j+.8)/n;
      quad('glow',[u0+nu*.09,y0+.3,v0+nv*.09],[u1+nu*.09,y0+.3,v1+nv*.09],[u1+nu*.09,y0+1.5,v1+nv*.09],[u0+nu*.09,y0+1.5,v0+nv*.09],[nu,0,nv]);
    }
  }
  for(let i=0;i<INNER.length;i++) {
    const a=INNER[i],c=INNER[(i+1)%INNER.length],du=c[0]-a[0],dv=c[1]-a[1],L=Math.hypot(du,dv);
    const n=[dv/L,-du/L];
    curtain([a[0]+n[0]*.12,a[1]+n[1]*.12],[c[0]+n[0]*.12,c[1]+n[1]*.12],7.93,14.2,near?1.5:4.5);
    bar('stone',[a[0],10.98,a[1]],[c[0],10.98,c[1]],.34,.35);
  }
  // Balcony frontages have actual 1.6m recesses, wood room dividers, railings
  // and floor-height sliding aluminium shutters. Their negative space survives far.
  function balconies(a,c,inside, bayWidth=4.1) {
    const du=c[0]-a[0],dv=c[1]-a[1],L=Math.hypot(du,dv),n=Math.round(L/bayWidth),au=du/L,av=dv/L;
    const at=(s,d,y)=>[a[0]+au*s+inside[0]*d,y,a[1]+av*s+inside[1]*d];
    const B=(m,s,d,y,w,h,depth)=>{
      const p=at(s,d,y),angle=ANGLE-Math.atan2(av,au);
      b.box(mat(m),place(...p),[w,h,depth],angle);
    };
    curtain([a[0]+inside[0]*1.65,a[1]+inside[1]*1.65],[c[0]+inside[0]*1.65,c[1]+inside[1]*1.65],7.93,14.2,near?1.35:4.1);
    const ys=[8.02,11.1];
    // Mid-floor slab lands inside both stone edges and the recessed back wall.
    const p=[at(0,-.02,0),at(L,-.02,0),at(L,1.72,0),at(0,1.72,0)].map(p=>[p[0],p[2]]);
    slab('concrete',p,10.89,11.1);
    for(let i=0;i<=n;i++) {
      const s=L*i/n;
      B('stone',s,.22,11.09,.28,6.38,.54);
      B('wood',s,1.10,11.09,.17,6.38,1.34);
    }
    for(let i=0;i<n;i++) {
      const s=L*(i+.5)/n,bay=L/n;
      for(const y of ys) {
        // Glass balcony panel, with thin metal top/bottom rails and posts.
        const a0=at(s-bay/2+.16,.16,y+.16),c0=at(s+bay/2-.16,.16,y+.16);
        quad('glass',a0,c0,[c0[0],y+1.0,c0[2]],[a0[0],y+1.0,a0[2]],[-inside[0],0,-inside[1]]);
        for(const yy of (near?[y+.13,y+.98]:[y+.98])) {
          if(near) bar('frame',at(s-bay/2+.08,.1,yy),at(s+bay/2-.08,.1,yy),.065,.08);
          else quad('frame',at(s-bay/2+.08,.09,yy-.04),at(s+bay/2-.08,.09,yy-.04),at(s+bay/2-.08,.09,yy+.04),at(s-bay/2+.08,.09,yy+.04),[-inside[0],0,-inside[1]]);
        }
        if(near) for(const yy of [y+.37,y+.58,y+.78]) bar('metal',at(s-bay/2+.1,.08,yy),at(s+bay/2-.1,.08,yy),.025,.03);
        if(near) for(const ss of [s-bay/2+.13,s+bay/2-.13]) bar('frame',at(ss,.1,y+.12),at(ss,.1,y+1),.06,.08);
        // Every balcony has a dark grey louvred sliding panel over one half.
        const center=s+bay*.19,w=bay*.39;
        for(const ss of [center-w/2,center+w/2]) {
          if(near) bar('metal',at(ss,-.26,y+.08),at(ss,-.26,y+2.92),.07,.14);
          else quad('metal',at(ss-.04,-.30,y+.08),at(ss+.04,-.30,y+.08),at(ss+.04,-.30,y+2.92),at(ss-.04,-.30,y+2.92),[-inside[0],0,-inside[1]]);
        }
        const rows=near?15:4;
        for(let j=0;j<=rows;j++) {
          const yy=y+.12+j*2.74/rows;
          if(near) {
            const l=center-w/2,r=center+w/2,th=.075;
            quad('metal',at(l,-.35,yy-th/2),at(r,-.35,yy-th/2),at(r,-.35,yy+th/2),at(l,-.35,yy+th/2),[-inside[0],0,-inside[1]]);
            quad('metal',at(l,-.35,yy+th/2),at(r,-.35,yy+th/2),at(r,-.15,yy+th/2),at(l,-.15,yy+th/2),[0,1,0]);
            quad('metal',at(l,-.15,yy-th/2),at(r,-.15,yy-th/2),at(r,-.35,yy-th/2),at(l,-.35,yy-th/2),[0,-1,0]);
            quad('metal',at(l,-.15,yy-th/2),at(l,-.15,yy+th/2),at(r,-.15,yy+th/2),at(r,-.15,yy-th/2),[inside[0],0,inside[1]]);
          } else {
            quad('metal',at(center-w/2,-.35,yy-.05),at(center+w/2,-.35,yy-.05),at(center+w/2,-.35,yy+.05),at(center-w/2,-.35,yy+.05),[-inside[0],0,-inside[1]]);
          }
        }
        if(i%5===1) {
          const q0=at(s-bay*.09,1.51,y+1.45),q1=at(s+bay*.13,1.51,y+1.45);
          quad('glow',q0,q1,[q1[0],y+2.52,q1[2]],[q0[0],y+2.52,q0[2]],[-inside[0],0,-inside[1]]);
        }
        if(near) {
          // Door leaves and warm timber band in the deep shadow of the loggia.
          B('wood',s-bay*.29,1.56,y+1.5,bay*.23,2.85,.14);
          for(const ss of [s-.22,s+.22]) bar('metal',at(ss,1.48,y+1.22),at(ss,1.48,y+1.52),.025,.025);
        }
      }
      if(near) for(const y of [8.12,11.22]) B('glow',s,.96,y+.20,.36,.18,.08);
    }
    bar('stone',at(0,-.04,7.82),at(L,-.04,7.82),.50,.4);
    bar('stone',at(0,-.04,14.35),at(L,-.04,14.35),.5,.4);
  }
  balconies([.13,-57.45],[.13,-.13],[1,0]);
  balconies([.13,-.13],[65.95,-.13],[0,-1]);
  balconies([66.03,-.25],[66.03,-72.05],[-1,0]);
  // Northern end walls and stepped street-front wings, clad in dark Larvikite.
  // The large glazed entrance fills the gap between the two hotel wings.
  for(let i=0;i<OUTER.length;i++) {
    const a=OUTER[i],c=OUTER[(i+1)%OUTER.length];
    if(Math.max(a[1],c[1])> -57.6) continue;
    const du=c[0]-a[0],dv=c[1]-a[1];
    if(Math.abs(du)<.2 && a[0]>60) continue;
    quad('stone',[a[0],7.95,a[1]],[c[0],7.95,c[1]],[c[0],14.2,c[1]],[a[0],14.2,a[1]],[-dv,0,du]);
    if(near) {
      for(let y=8.8;y<14.2;y+=1.0) bar('frame',[a[0],y,a[1]],[c[0],y,c[1]],.035,.045);
    }
  }
  // Landward public floors: full eastern wing and the north return; western
  // spa stops 24m before the single sea-side support (v=-32 vs pier v=-8).
  const bases=[[[45,-1.25],[64.65,-1.25],[64.65,-68.9],[45,-68.9]],
    [[-5.85,-58.0],[16.05,-58.0],[16.05,-74.9],[4.2,-74.9],[4.2,-79.8],[-7.4,-79.8],[-7.4,-66.05],[-5.85,-66.05]],
    [[16.15,-59.75],[45.05,-59.75],[45.05,-69.0],[16.15,-69.0]],
    [[1.55,-32],[15.8,-32],[15.8,-57.95],[1.55,-57.95]]];
  for(const [i,ring] of bases.entries()) {
    slab('stone',ring,0,7.44);
    // Dark upper spandrel is set behind the overhanging room-wing soffit.
    const area=ring.reduce((sum,p,j)=>sum+p[0]*ring[(j+1)%ring.length][1]-ring[(j+1)%ring.length][0]*p[1],0);
    for(let j=0;j<ring.length;j++) {
      const a=ring[j],c=ring[(j+1)%ring.length],du=c[0]-a[0],dv=c[1]-a[1],L=Math.hypot(du,dv),sign=area>0?1:-1;
      const nu=dv/L*sign,nv=-du/L*sign;
      const face=(m,y0,y1,offset)=>quad(m,[a[0]+nu*offset,y0,a[1]+nv*offset],[c[0]+nu*offset,y0,c[1]+nv*offset],[c[0]+nu*offset,y1,c[1]+nv*offset],[a[0]+nu*offset,y1,a[1]+nv*offset],[nu,0,nv]);
      face('frame',6.76,7.41,.06);
      if(i===1) face('wood',5.20,6.02,.09);
    }
  }
  // Public glazing overlays deeply inset openings on the bounded rigid base.
  curtain([64.82,-1.39],[64.82,-68.75],.4,6.7,near?1.4:5);
  curtain([45.0,-1.11],[64.60,-1.11],.4,6.7,near?1.45:4.1);
  curtain([44.86,-16.2],[44.86,-57.8],.4,6.9,near?1.4:4.0);
  curtain([1.40,-32.15],[1.40,-57.6],.45,6.7,near?1.25:3.8);
  curtain([15.91,-32.15],[15.91,-58.1],.45,6.9,near?1.25:3.8);
  curtain([16.95,-69.31],[45.4,-69.31],3.15,14.18,near?1.35:4.1);
  for(let v=-4;v>-68;v-=4.1) box('stone',64.77,3.62,v,.44,6.85,.38);
  for(let v=-33;v>-57;v-=4.1) box('stone',1.44,3.62,v,.38,6.85,.44);
  for(let u=45.7;u<64.3;u+=4.1) box('stone',u,3.62,-1.10,.40,6.85,.34);
  // Beech entrance portal, north/public frontage; three-sided frame around glass doors.
  box('wood',29.1,5.38,-70.45,3.4,4.5,2.3);
  box('glass',29.1,4.96,-71.68,2.35,3.62,.14);
  for(const u of [27.97,29.1,30.23]) bar('frame',[u,3.18,-71.79],[u,6.82,-71.79],.08,.1);
  if(near) for(let y=3.5;y<7.5;y+=.24) bar('stone',[27.49,y,-71.68],[30.71,y,-71.68],.025,.025);
  // Southern common room is timber between the glass and the upper stone wing.
  box('wood',55.9,5.8,-1.28,16.7,2.4,.62);
  curtain([47.65,-.81],[63.35,-.81],4.82,6.7,near?1.25:4,false);
  // One single exposed concrete cylinder carries the sea corner.
  function cylinder(m,u,v,y0,y1,r,seg) {
    const g=new THREE.CylinderGeometry(r,r,y1-y0,seg,1,false);
    g.translate(...place(u,(y0+y1)/2,v)); b.put(g,mat(m));
  }
  cylinder('concrete',PIER[0],PIER[1],0,SOFFIT,1.04,near?20:10);
  // The glazed spa bridge is separate from the suspended room floor above it.
  box('frame',8,3.73,-20,4.05,.30,24.05);
  box('frame',8,6.75,-20,4.05,.22,24.05);
  curtain([5.99,-32],[5.99,-8],3.87,6.68,near?1.15:3.0);
  curtain([10.01,-8],[10.01,-32],3.87,6.68,near?1.15:3.0);
  // VIP spa chamber around the cylinder; deck and roof contact the support.
  box('frame',8,3.69,-8,9.8,.32,9.8);
  box('frame',8,6.79,-8,9.8,.18,9.8);
  for(const [a,c] of [[[3.2,-12.8],[3.2,-3.2]],[[3.2,-3.2],[12.8,-3.2]],[[12.8,-3.2],[12.8,-12.8]],[[12.8,-12.8],[3.2,-12.8]]]) curtain(a,c,3.88,6.7,near?1.2:3.2);
  // Hanging sun deck and shore staircase. No beach, seawater or landscape mesh.
  box('wood',16.0,3.66,-8,6.55,.34,6.7);
  for(const v of [-11.25,-4.75]) {
    bar('metal',[12.85,4.85,v],[19.15,4.85,v],.06);
    for(let u=13;u<19.3;u+=near?1.2:3) bar('metal',[u,3.8,v],[u,4.85,v],.06);
  }
  const steps=near?22:8;
  for(let i=0;i<steps;i++) {
    const u=19.15+(i+.5)*9.5/steps,top=3.8*(1-i/steps);
    box('metal',u,top-.08,-7.8,9.5/steps+.03,.16,1.65);
  }
  bar('frame',[19.2,3.52,-8.6],[28.6,.15,-8.6],.15,.20);
  bar('frame',[19.2,3.52,-7.0],[28.6,.15,-7.0],.15,.20);
  for(const v of [-8.6,-7.0]) {
    bar('metal',[19.1,4.76,v],[28.6,1.03,v],.06);
    for(let i=0;i<= (near?10:3);i++) {
      const f=i/(near?10:3),u=19.1+9.5*f,y=3.8*(1-f);
      bar('metal',[u,y+.05,v],[u,y+1.02,v],.05);
    }
  }
  // Low suites on the NW roof: a narrow setback floor rather than four full storeys.
  const suite=[[4.9,-72.8],[14.5,-72.8],[14.5,-60.4],[4.9,-60.4]];
  slab('stone',suite,14.55,HEIGHT);
  curtain([4.72,-72.5],[4.72,-60.7],14.85,17.42,near?1.4:3.5);
  curtain([5.1,-60.24],[14.35,-60.24],14.85,17.42,near?1.4:3.5);
  // Roof services on the solid northern/eastern arms only.
  for(const [u,v,w,d] of [[56,-56,6,9],[57,-35,5,6],[26,-64,6,3]]) {
    box('frame',u,14.89,v,w,.58,d);
    if(near) for(let j=-w/2+.15;j<w/2;j+=.4) box('metal',u+j,15.22,v,.10,.10,d-.3);
  }
  // Compact white lighthouse: 3.1m shaft, gallery rim, dark lantern, red cap.
  cylinder('pale',78,-7,0,7.55,1.55,near?24:12);
  cylinder('pale',78,-7,7.38,7.62,1.82,near?24:12);
  cylinder('glass',78,-7,7.58,8.29,1.40,near?24:12);
  cylinder('pale',78,-7,8.23,8.40,1.77,near?24:12);
  const cap=new THREE.ConeGeometry(1.95,1.84,near?24:12);
  cap.translate(...place(78,9.30,-7)); b.put(cap,'red');
  cylinder('red',78,-7,10.18,10.56,.23,near?10:6);
  const rail=new THREE.TorusGeometry(1.79,.04,4,near?24:12);
  rail.rotateX(Math.PI/2); rail.translate(...place(78,7.98,-7)); b.put(rail,'pale');
  for(let i=0;i<(near?8:4);i++) {
    const a=i*2*Math.PI/(near?8:4),u=78+1.78*Math.cos(a),v=-7+1.78*Math.sin(a);
    bar('pale',[u,7.53,v],[u,8.01,v],.055);
    const u2=78+1.43*Math.cos(a),v2=-7+1.43*Math.sin(a);
    bar('frame',[u2,7.56,v2],[u2,8.31,v2],.055);
  }
  if(near) {
    for(const y of [1.5,4.5,6.1]) cylinder('concrete',78,-7,y,y+.035,1.62,24);
    // Vertical stone panel joints, beech board rhythms and underside slab seams.
    for(let v=-55;v<-.3;v+=1.5) {
      bar('stone',[.45,7.34,v],[15.8,7.34,v],.025,.035);
    }
    for(let u=1.3;u<65;u+=1.5) bar('stone',[u,7.34,-15.6],[u,7.34,-.4],.025,.035);
    for(let u=49.2;u<65.3;u+=.32) box('wood',u,5.78,-.87,.065,2.15,.08);
  }
  for(const [m,{points,indices}] of batches) {
    const g=new THREE.BufferGeometry();
    g.setAttribute('position',new THREE.Float32BufferAttribute(points,3));
    g.setIndex(indices);
    g.computeVertexNormals(); b.put(g,m);
  }
  return b.finish();
}
