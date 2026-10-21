import * as THREE from 'three';
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';

const UP = new THREE.Vector3(0,1,0);
// Canonical front = -Z; real facade faces N 3.54° W. Rotate once at export.
export const plan = (x,y,z) => new THREE.Vector3(x,y,z).applyAxisAngle(UP,SPEC.rotation).toArray();
export const COLUMN_TOP = 15.25;
export const COLUMNS = [
  ...Array.from({length:8},(_,i)=>[-15.75+i*4.5,-47.8]),
  ...[-41.6,-35.6].flatMap(z=>[-15.75,-6.75,6.75,15.75].map(x=>[x,z])),
];

export function create({detail='near'}={}) {
  const near=detail==='near', radial=near?64:24;
  const b=assetBuilder({...SPEC,palette:PALETTES.light},detail);
  const put=(g,mat)=>{g.rotateY(SPEC.rotation);b.put(g,mat);};
  function box(mat,x,y,z,w,h,d,omit=[]) {
    const g=new THREE.BoxGeometry(w,h,d),faces=['east','west','top','bottom','south','north'];
    if(omit.length)g.setIndex([...g.index.array].filter((_,i)=>!omit.includes(faces[Math.floor(i/6)])));
    g.translate(x,y,z);put(g,mat);
  }
  function lathe(mat,profile,x=0,z=0,n=radial) {
    const g=new THREE.LatheGeometry(profile.map(([r,y])=>new THREE.Vector2(r,y)),n);
    g.translate(x,0,z);put(g,mat);
  }
  function mesh(mat,p,idx) {
    const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(p,3));g.setIndex(idx);
    const f=g.toNonIndexed();f.computeVertexNormals();const welded=mergeVertices(f);put(welded,mat);f.dispose();g.dispose();
  }
  function member(mat,a,c,w,d=w) {
    const av=new THREE.Vector3(...a),cv=new THREE.Vector3(...c),dir=cv.clone().sub(av);
    const g=new THREE.BoxGeometry(w,dir.length(),d);
    g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(UP,dir.normalize()));
    g.translate(...av.add(cv).multiplyScalar(.5).toArray());put(g,mat);
  }
  // Exterior wall is tiled around actual recessed arch bands and vent openings.
  // No outer brick face survives behind a recess or a projecting stone course.
  const courses=[[7.4,7.95],[18.7,19.3],[27.65,28.3]];
  const arches=[];
  for(let k=0;k<8;k++) {
    const centre=(k+.5)*Math.PI/4;
    if(Math.cos(centre)<-.65)continue;
    for(const [spring,r] of [[9,5.7],[20.2,3.5]])arches.push({centre,spring,r});
  }
  const angles=Array.from({length:(near?128:64)+1},(_,i)=>i*2*Math.PI/(near?128:64));
  for(const {centre,r} of arches)for(const u of [-r-.48,-r,r,r+.48])angles.push(centre+u/28.7);
  for(let k=0;k<8;k++)for(const dx of [-.475,.475])angles.push((k*Math.PI/4+dx/28.7+Math.PI*2)%(Math.PI*2));
  angles.sort((a,c)=>a-c);
  const surface=(mat,a,c,y0,y1,r0=28.7,r1=r0)=> {
    const v=(r,y,t)=>[r*Math.sin(t),y,r*Math.cos(t)];
    mesh(mat,[...v(r0,y0[0],a),...v(r0,y0[1],c),...v(r1,y1[0],a),...v(r1,y1[1],c)],[0,1,2,1,3,2]);
  };
  for(let i=1;i<angles.length;i++) {
    const a=angles[i-1],c=angles[i],mid=(a+c)/2;
    if(c-a<1e-8)continue;
    const bands=courses.map(([lo,hi])=>({lo:[lo,lo],hi:[hi,hi],radius:29.35,mat:'stone'}));
    for(const ar of arches) {
      if(Math.abs((mid-ar.centre)*28.7)>=ar.r+.48)continue;
      const curve=(r,t)=>ar.spring+Math.sqrt(Math.max(0,r*r-((t-ar.centre)*28.7)**2));
      bands.push({lo:[curve(ar.r,a),curve(ar.r,c)],hi:[curve(ar.r+.48,a),curve(ar.r+.48,c)],radius:27.95,mat:'recess'});
    }
    for(let k=0;k<8;k++) {
      let d=mid-k*Math.PI/4;d=Math.atan2(Math.sin(d),Math.cos(d));
      if(Math.abs(d)<.475/28.7&&Math.cos(k*Math.PI/4)>=-.8)bands.push({lo:[23.8,23.8],hi:[25.8,25.8],radius:27.95,mat:'recess',vent:k});
    }
    bands.sort((a,c)=>a.lo[0]-c.lo[0]);
    let y=[0,0];
    for(const q of bands) {
      surface('brick',a,c,y,q.lo);
      surface(q.mat,a,c,q.lo,q.lo,28.7,q.radius);
      surface(q.mat,a,c,q.lo,q.hi,q.radius);
      surface(q.mat,a,c,q.hi,q.hi,q.radius,28.7);
      y=q.hi;
    }
    surface('brick',a,c,y,[28.3,28.3]);
    // Vent and arch ends close radially into the adjacent wall.
    for(const q of bands)for(const [t,j,reverse] of [[a,0,false],[c,1,true]]) {
      if(q.vent===undefined||Math.abs(Math.abs(Math.atan2(Math.sin(t-q.vent*Math.PI/4),Math.cos(t-q.vent*Math.PI/4)))-.475/28.7)>1e-7)continue;
      const v=(r,y)=>[r*Math.sin(t),y,r*Math.cos(t)];
      mesh(q.mat,[...v(28.7,q.lo[j]),...v(q.radius,q.lo[j]),...v(28.7,q.hi[j]),...v(q.radius,q.hi[j])],reverse?[0,2,1,1,2,3]:[0,1,2,1,3,2]);
    }
  }
  // Inner wall and the annular top meet the dome at y=28.3 exactly.
  lathe('brick',[[28.7,28.3],[20.604,28.3],[21.65,21.65],[21.65,.25]]);
  // Interior floor closes the view through the oculus without filling the dome.
  lathe('stone',[[0,0],[21.65,0],[21.65,.25],[0,.25]],0,0,radial);
  // Low concentric concrete/lead step rings hide the lower hemisphere in the
  // actual exterior; the visible upper cap is shallow, not a freestanding ball.
  const outer=[[28.7,28.3],[28.7,29.1],[27.8,29.1],[27.8,29.95],
    [26.9,29.95],[26.9,30.8],[26,30.8],[26,31.65],
    [25.1,31.65],[25.1,32.5],[24.2,32.5],[24.2,33.35],[23.3,33.35],[23.3,34.2],
    [22.25,35],[20.4,37],[18.1,38.9],[15.25,40.55],[12.05,41.95],[8.4,43.15],[4.55,43.8],[4.55,44]];
  const inner=[];
  for(let i=0;i<= (near?14:8);i++) {
    const r=4.55+(20.604-4.55)*i/(near?14:8);
    inner.push([r,21.65+Math.sqrt(21.65**2-r*r)]);
  }
  // Separate profile strips keep the sharp risers and horizontal treads crisp.
  for(let i=1;i<=14;i++)lathe('lead',outer.slice(i-1,i+1));
  lathe('lead',[...outer.slice(14),...inner,[28.7,28.3]]);
  // Oculus rim has an unobstructed 9.1m aperture; no disk, glass or black decal.

  // Rear ancient annex/Neptune masonry is inside the multipolygon's south wing.
  // It is deliberately subordinate to the drum; neighbouring houses are excluded.
  box('brick',0,5.9,27.35,47.2,11.8,11.5,['bottom','north','top']);
  for(const x of [-22.6,-11.3,0,11.3,22.6]) box('brick',x,7.0,32.8,1.5,14,1.1,['bottom']);
  box('lead',0,11.8,27.35,47.2,0,11.5,['bottom','east','west','north','south']);

  // The transition walls stop at their shared stone facing, doorway and gable.
  for(const x of [-10.85,10.85])box('brick',x,11.55,-28.5,14.7,22.6,11.4,['bottom','north','top']);
  box('brick',0,16.675,-28.5,7,12.35,11.4,['north','top']);
  box('brick',0,19.05,-34.2,36.4,7.6,0,['south','top','bottom','east','west']);
  // Stone back wall, with real rectangular niche openings in both LODs.
  for(const x of [-10.85,10.85]) {
    const left=x-7.35,right=x+7.35,niche=Math.sign(x)*11.2,lo=niche-1.85,hi=niche+1.85;
    for(const [l,r] of [[left,lo],[hi,right]])box('stone',(l+r)/2,7.75,-34.2,r-l,15,.0,['south','top','bottom','east','west']);
    for(const [l,h] of [[.25,1.75],[11.25,15.25]])box('stone',niche,(l+h)/2,-34.2,3.7,h-l,0,['south','top','bottom','east','west']);
    box('recess',niche,6.5,-33.45,3.7,9.5,0,['south','top','bottom','east','west']);
    for(const xx of [lo,hi])box('stone',xx,6.5,-33.825,0,9.5,.75);
    for(const yy of [1.75,11.25])box('stone',niche,yy,-33.825,3.7,0,.75);
    for(const dx of [-2.2,2.2])box('stone',niche+dx,6.5,-34.4,.55,10.1,.4,['south']);
    box('stone',niche,11.7,-34.4,4.95,.4,.4,['south']);
  }
  box('stone',0,13,-34.2,7,4.5,0,['south','top','bottom','east','west']);
  box('bronze',0,4.015,-33.95,4.45,7.53,.24);
  for(const x of [-2.8,2.8])box('stone',x,5.5,-34.5,.75,10.5,.9,['south','bottom']);
  box('stone',0,10.7,-34.5,6.35,.65,.9,['south']);
  // Grille rods have 0.75m clear depth to the transom backing in both LODs.
  box('recess',0,9.05,-33.3,4.45,2.5,0,['south','top','bottom','east','west']);
  for(const x of [-1.8,-.9,0,.9,1.8])box('bronze',x,9.05,-34.1,.09,2.5,.16);
  if(near)for(const x of [-1.1,1.1])for(const y of [2.2,5.7])box('bronze',x,y,-34.12,1.7,2.85,.12);
  // Upper pediment: the front face, roof slopes and soffit share boundaries.
  const uw=18.2,uy=22.85,ua=28.5,uz0=-34.2,uz1=-22.8;
  mesh('stone',[-uw,uy,uz0,0,ua,uz0,uw,uy,uz0,-uw,uy,uz0+.75,0,ua,uz0+.75,uw,uy,uz0+.75],
    [0,3,1,1,3,4,1,4,2,2,4,5]);
  mesh('lead',[-uw,uy,uz0+.75,0,ua,uz0+.75,uw,uy,uz0+.75,-uw,uy,uz1,0,ua,uz1,uw,uy,uz1],
    [0,3,1,1,3,4,1,4,2,2,4,5]);
  mesh('stone',[-uw,uy,uz0,0,ua,uz0,uw,uy,uz0],[0,1,2]);
  mesh('brick',[-uw,uy,uz1,0,ua,uz1,uw,uy,uz1],[0,2,1]);
  for(const x of [-uw,uw])member('stone',[x,uy,-34.2],[0,ua,-34.2],.4,.65);
  // Present grade nearly covers the ancient seven-step staircase.
  box('stone',0,.125,-41.75,36.4,.25,15.6,['bottom']);

  for(const [x,z] of COLUMNS) {
    // Attic bases, monolithic UNFLUTED Egyptian granite with a slight entasis.
    lathe('stone',[[1.05,.25],[1.05,.47],[.91,.47],[.91,.64],[.82,.76]],x,z,near?16:6);
    lathe('granite',[[.82,.76],[.75,.95],[.77,3.0],[.73,8.0],[.66,12.85]],x,z,near?16:6);
    // Corinthian bell (2.4m), layered acanthus leaves and volutes, square abacus.
    lathe('stone',[[.66,12.85],[.72,13.1],[.82,13.9],[1.00,14.55],[1.05,14.85]],x,z,near?12:6);
    const leaves=near?8:4;
    for(let tier=0;tier<(near?2:1);tier++)for(let i=0;i<leaves;i++) {
      const a=i*2*Math.PI/leaves+(tier?.38:0),cy=13.3+tier*.65;
      const g=new THREE.SphereGeometry(1,near?5:4,near?3:2);g.scale(.16,.48,.14);
      g.rotateY(a);g.translate(x+.73*Math.sin(a),cy,z+.73*Math.cos(a));put(g,'stone');
    }
    for(const dx of [-.73,.73])for(const dz of [-.73,.73]) {
      const g=near?new THREE.SphereGeometry(.24,8,4):new THREE.OctahedronGeometry(.24,0);g.scale(1,.7,1);g.translate(x+dx,14.64,z+dz);put(g,'stone');
    }
    box('stone',x,15.05,z,2.25,.4,2.25,['bottom']);
  }
  // Four longitudinal support lines rest on three ranks of named column capitals.
  for(const x of [-15.75,-6.75,6.75,15.75])box('stone',x,15.65,-41.5,2.25,.8,14.85,['bottom']);
  // Continuous front architrave/frieze/cornice, not floating fascia strips.
  box('stone',0,16.05,-47.8,35.9,1.6,2.25,['bottom']);
  box('stone',0,17.5,-47.8,36.1,1.3,2.5,['bottom']);
  box('stone',0,18.45,-47.8,36.4,.6,2.8,['bottom']);
  for(const x of [-17.05,17.05])box('stone',x,17.5,-41.7,2.3,2.5,12.2,['bottom']);

  // Closed pitched portico roof. Separate triangular stone face; roof slopes and
  // soffit stop there, so no competing lead triangle behind the pediment.
  const w=18.2,y=18.75,apex=24.4,z0=-49.2,z1=-33.8;
  mesh('lead',[-w,y,z0,0,apex,z0,w,y,z0,-w,y,z1,0,apex,z1,w,y,z1],
    [0,3,1,1,3,4,1,4,2,2,4,5,0,2,3,2,5,3,3,5,4]);
  mesh('stone',[-w,y,z0,0,apex,z0,w,y,z0],[0,1,2]);
  for(const x of [-w,w])member('stone',[x,18.9,-49.35],[0,24.55,-49.35],.45,.65);
  box('stone',0,18.95,-49.35,36.4,.4,.65);
  if(near)for(let i=0;i<44;i++)box('stone',-17.5+i*35/43,18.1,-49.25,.28,.32,.4);

  // Original stroke lettering, no font/image/texture dependency.
  const glyphs={
    M:[[[0,0],[0,1],[.45,.45],[.9,1],[.9,0]]], A:[[[0,0],[.45,1],[.9,0]],[[.22,.42],[.69,.42]]],
    G:[[[.85,.85],[.65,1],[.2,1],[0,.8],[0,.2],[.2,0],[.85,0],[.85,.48],[.5,.48]]],
    R:[[[0,0],[0,1],[.65,1],[.85,.8],[.85,.6],[.65,.48],[0,.48]],[[.45,.48],[.9,0]]],
    I:[[[.45,0],[.45,1]],[[.12,0],[.78,0]],[[.12,1],[.78,1]]],
    P:[[[0,0],[0,1],[.65,1],[.85,.8],[.85,.6],[.65,.48],[0,.48]]],
    L:[[[0,1],[0,0],[.8,0]]],F:[[[0,0],[0,1],[.85,1]],[[0,.5],[.65,.5]]],
    C:[[[.85,.85],[.65,1],[.2,1],[0,.8],[0,.2],[.2,0],[.65,0],[.85,.15]]],
    O:[[[.2,0],[0,.2],[0,.8],[.2,1],[.65,1],[.85,.8],[.85,.2],[.65,0],[.2,0]]],
    S:[[[.85,.85],[.65,1],[.2,1],[0,.8],[.15,.55],[.7,.45],[.85,.2],[.65,0],[.2,0],[0,.15]]],
    T:[[[0,1],[.9,1]],[[.45,1],[.45,0]]],E:[[[.85,1],[0,1],[0,0],[.85,0]],[[0,.5],[.65,.5]]],
    V:[[[0,1],[.45,0],[.9,1]]], '·':[[[.4,.45],[.5,.45]]],
  };
  // Raised bronze relief attached to the frieze face (z=-49.05): every stroke is a
  // closed prism whose hidden back sits 2cm inside the stone and whose sides meet
  // the frieze. The face stands 0.12m proud near / 0.14m far, inside the 0.15m
  // cornice projection, so nothing hovers ahead of the entablature. Far shares the
  // eight prism corners (sub-pixel strokes, smooth normals) to stay within 500 KB.
  const text='M·AGRIPPA·L·F·COS·TERTIVM·FECIT',step=.84,h=.63,start=-text.length*step/2;
  const frieze=-49.05,inkZ=frieze-(near?.12:.14),backZ=frieze+.02;
  for(let i=0;i<text.length;i++)for(const path of glyphs[text[i]]||[])for(let j=1;j<path.length;j++) {
    const a=path[j-1],c=path[j],dx=(c[0]-a[0])*h,dy=(c[1]-a[1])*h,len=Math.hypot(dx,dy),r=.027;
    const nx=-dy/len*r,ny=dx/len*r,x=start+i*step+a[0]*h,yy=17.18+a[1]*h;
    const q=[[-x-nx,yy+ny],[-x-dx-nx,yy+dy+ny],[-x-dx+nx,yy+dy-ny],[-x+nx,yy-ny]],idx=[0,2,1,0,3,2];
    for(let k=0;k<4;k++){const n=(k+1)%4;idx.push(k,n,n+4,k,n+4,k+4);}
    const p=[...q.map(([u,v])=>[u,v,inkZ]),...q.map(([u,v])=>[u,v,backZ])].flat();
    if(near)mesh('bronze',p,idx);
    else{const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(p,3));g.setIndex(idx);g.computeVertexNormals();put(g,'bronze');}
  }
  return b.finish();
}
