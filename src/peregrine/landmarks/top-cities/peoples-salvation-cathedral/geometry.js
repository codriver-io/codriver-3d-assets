import * as THREE from 'three';
import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';
import { PARTS } from './peoples-salvation-cathedral-plan.js';
const R=SPEC.rotation*Math.PI/180;
export const plan=(x,y,z)=>[x*Math.cos(R)+z*Math.sin(R),y,-x*Math.sin(R)+z*Math.cos(R)];
export const unplan=(x,z)=>[x*Math.cos(R)-z*Math.sin(R),x*Math.sin(R)+z*Math.cos(R)];
export function create({detail='near'}={}) {
  const near=detail==='near',N=near?32:16,b=assetBuilder({...SPEC,palette:PALETTES.light},detail);
  function put(g,m,x=0,y=0,z=0,a=0){g.rotateY(a);g.translate(x,y,z);g.rotateY(R);b.put(g,m);}
  function box(m,x,y,z,w,h,d,a=0){put(new THREE.BoxGeometry(w,h,d),m,x,y,z,a);}
  function bar(m,a,c,w,d=w){b.bar(m,plan(...a),plan(...c),w,d);}
  function prism(m,ring,y,h){const s=new THREE.Shape(ring.map(([x,z])=>new THREE.Vector2(x,-z)));const g=new THREE.ExtrudeGeometry(s,{depth:h,bevelEnabled:false});g.rotateX(-Math.PI/2);put(g,m,0,y,0);}
  function cyl(m,x,z,y,h,r,n=N){put(new THREE.CylinderGeometry(r,r,h,n),m,x,y+h/2,z);}
  function lathe(m,x,z,p,n=N){put(new THREE.LatheGeometry(p.map(v=>new THREE.Vector2(...v)),n),m,x,0,z);}
  function archShape(w,h){const r=w/2,s=new THREE.Shape();s.moveTo(-r,0);s.lineTo(r,0);s.lineTo(r,h-r);s.absarc(0,h-r,r,0,Math.PI,false);s.closePath();return s;}
  function arch(m,x,y,z,w,h,a=0){put(new THREE.ShapeGeometry(archShape(w,h),near?6:3),m,x,y,z,a);}
  function archFrame(x,y,z,w,h,a=0,th=.35){
    const t=[Math.cos(a),-Math.sin(a)],n=[Math.sin(a),Math.cos(a)];
    if(near)for(const sg of [-1,1])box('stone',x+sg*(w/2+th/2)*t[0],y+(h-w/2)/2,z+sg*(w/2+th/2)*t[1],th,h-w/2,near?.7:.85,a);
    const ro=w/2+th,ri=w/2,positions=[],indices=[],segments=near?12:6;
    for(let i=0;i<=segments;i++){const v=i*Math.PI/segments;positions.push(ro*Math.cos(v),ro*Math.sin(v),0,ri*Math.cos(v),ri*Math.sin(v),0);if(i){const k=(i-1)*2;indices.push(k,k+2,k+1,k+1,k+2,k+3);}}
    const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));g.setIndex(indices);g.computeVertexNormals();put(g,'stone',x,y+h-w/2,z,a);
    if(near)box('stone',x,y-.18,z,w+2*th,.36,.7,a);
  }
  function window(x,y,z,w,h,a=0,m='glass'){
    // Geometric arched panes, proud enough to receive one-way depth ordering; no photo textures.
    arch(m,x,y,z,w,h,a);if(near)archFrame(x,y,z,w,h,a);
    if(near){const t=[Math.cos(a),-Math.sin(a)],n=[Math.sin(a),Math.cos(a)];
      bar('stone',[x+n[0]*.32,y,z+n[1]*.32],[x+n[0]*.32,y+h-.18,z+n[1]*.32],.09);
      for(const yy of [h*.3,h*.6])bar('stone',[x-t[0]*w*.45+n[0]*.32,y+yy,z-t[1]*w*.45+n[1]*.32],[x+t[0]*w*.45+n[0]*.32,y+yy,z+t[1]*w*.45+n[1]*.32],.09);
    }
  }
  function facades(ring,rows,spacing=5.2,skipFront=false,skipCrest=false){
    let area=0;for(let i=0;i<ring.length;i++){const p=ring[i],q=ring[(i+1)%ring.length];area+=p[0]*q[1]-q[0]*p[1];}
    for(let i=0;i<ring.length;i++){const p=ring[i],q=ring[(i+1)%ring.length],dx=q[0]-p[0],dz=q[1]-p[1],L=Math.hypot(dx,dz);if(L<3)continue;
      const a=Math.atan2(-dz,dx)+(area>0?Math.PI:0),n=[Math.sin(a),Math.cos(a)],count=Math.max(1,Math.floor(L/spacing));
      if(skipFront&&p[0]<-50&&q[0]<-50)continue;
      if(skipCrest&&p[0]<-55&&q[0]<-55)continue;
      for(let j=0;j<count;j++){const t=(j+.5)/count,x=p[0]+dx*t+n[0]*(near?.26:.6),z=p[1]+dz*t+n[1]*(near?.26:.6);
        for(const [y,h,w] of rows){if(skipFront&&y<14&&x>-31.1&&x<-9.1)continue;if(L<6)arch('glass',x,y,z,w,h,a);else window(x,y,z,w,h,a);}
        if(near&&L>=6){put(new THREE.CircleGeometry(.65,12),'stone',x+n[0]*.18,20.5,z+n[1]*.18,a);}
      }
      if(near&&L>=6)for(const y of [3,16.8,33.6,50.9])box('stone',(p[0]+q[0])/2+n[0]*.13,y,(p[1]+q[1])/2+n[1]*.13,L,.34,.4,a);
    }
  }
  function cornice(ring,y){prism('stone',ring,y,.7);}
  function insetRing(ring,x,z,scale){return ring.map(([u,v])=>[x+(u-x)*scale,z+(v-z)*scale]);}
  function shoulder(ring,x,z,y,top,scale,upper=null){
    // Roof shoulders end at masonry. Hidden horizontal caps are omitted.
    const positions=[],indices=[],n=ring.length;
    for(const [u,v] of ring)positions.push(u,y,v);
    for(const [u,v] of upper||insetRing(ring,x,z,scale))positions.push(u,top,v);
    let area=0;for(let i=0;i<n;i++){const a=ring[i],c=ring[(i+1)%n];area+=a[0]*c[1]-c[0]*a[1];}
    for(let i=0;i<n;i++){const j=(i+1)%n;indices.push(...(area>0?[i,n+i,j,j,n+i,n+j]:[i,j,n+i,j,n+j,n+i]));}
    const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));g.setIndex(indices);g.computeVertexNormals();put(g,'gold');
  }
  function dome(x,z,r,y,h,crossH=3,n=N){
    const p=[[0,y],[r,y],[r,y+.6],[r*.96,y+h*.16],[r*.84,y+h*.46],[r*.61,y+h*.76],[r*.29,y+h*.94],[.4,y+h],[0,y+h]];
    lathe('gold',x,z,p,n);
    // Raised standing seams follow the dome; same gold material avoids reciprocal depth layers.
    if(near)for(let i=0;i<n/2;i++){const a=i*4*Math.PI/n;for(let j=3;j<p.length-1;j++){const u=p[j-1],v=p[j];bar('gold',[x+(u[0]+.09)*Math.sin(a),u[1],z+(u[0]+.09)*Math.cos(a)],[x+(v[0]+.09)*Math.sin(a),v[1],z+(v[0]+.09)*Math.cos(a)],.13);}}
    cyl('gold',x,z,y+h-.1,.8,.45,near?12:6);
    if(crossH){box('gold',x,y+h+.65+crossH/2,z,.25,crossH,.25);box('gold',x,y+h+.65+crossH*.68,z,crossH*.58,.25,.25);}
  }
  // Rigid parent envelope; front 5 m becomes a genuinely open seven-bay porch.
  const body=PARTS[232332568].map(([x,z])=>[Math.max(x,-51.7),z]);
  const lower=body.map(([x,z])=>[x,(x>-31.1&&x<-9.1)?Math.max(-21.0,Math.min(16.5,z)):z]);
  prism('stone',lower,0,14.8);prism('stone',body,14.8,36.9);cornice(body,51.7);
  facades(body,[[3.5,7.3,2.5],[22.1,8.5,2.7],[39.1,7.3,2.5]],5.5,true);
  // Golden low eaves and nave barrel roof. Its mapped width stays below the side towers.
  const nave=PARTS[1282747246];
  prism('gold',nave,52.45,.55);
  const xs=[-31.3,41.1],zs=[-17.35,17.2],s=new THREE.Shape();s.moveTo(zs[0],52.8);
  for(let i=0;i<= (near?24:10);i++){const t=i/(near?24:10);s.lineTo(zs[0]+(zs[1]-zs[0])*t,52.8+10*Math.sin(Math.PI*t));}s.lineTo(zs[1],52.8);s.closePath();
  const roof=new THREE.ExtrudeGeometry(s,{depth:xs[1]-xs[0],bevelEnabled:false});roof.rotateY(Math.PI/2);put(roof,'gold',xs[0],0,0);
  // Upper octagonal crossing plinth and sixteen-arched drum.
  const crossing=PARTS[1282747249];prism('stone',crossing,52.9,18.2);cornice(crossing,71.1);
  facades(crossing,[[57.5,5.7,2.1]],5.2);
  const cx=17.35,cz=.45,dr=14.25;
  cyl('stone',cx,cz,71.8,25.3,dr,16);lathe('stone',cx,cz,[[dr,71.8],[dr+.45,71.8],[dr+.45,73.4],[dr,73.8]],16);
  for(let i=0;i<16;i++){const a=(i+.5)*2*Math.PI/16,faceR=dr*Math.cos(Math.PI/16),n=[Math.sin(a),Math.cos(a)];
    window(cx+(faceR+(near?.28:.62))*n[0],77.4,cz+(faceR+(near?.28:.62))*n[1],2.1,15,a);
    if(near){const aa=i*2*Math.PI/16; cyl('stone',cx+(dr+.2)*Math.sin(aa),cz+(dr+.2)*Math.cos(aa),76.5,17.5,.42,8);}
  }
  lathe('stone',cx,cz,[[0,96.7],[14.4,96.7],[14.8,97.2],[14.8,98.1],[13.7,98.6],[13.7,102.8],[14.3,103.2],[14.3,103.8],[0,103.8]],16);
  for(let i=0;i<16;i++){const a=(i+.5)*2*Math.PI/16;window(cx+13.75*Math.cos(Math.PI/16)*Math.sin(a),99.2,cz+13.75*Math.cos(Math.PI/16)*Math.cos(a),1.2,2.5,a);}
  dome(cx,cz,14.2,103.8,12,0);
  lathe('gold',cx,cz,[[0,115.7],[3.2,115.7],[3.2,117.5],[2.6,119],[.5,120],[0,120]],16);
  box('gold',cx,123.45,cz,.30,7.1,.30);box('gold',cx,124.6,cz,4.1,.3,.3);
  // Western belfry: a distinct broad drum, dome and cross, lower than the central tower.
  const bell=PARTS[1282739666],bx=-43.8,bz=-2.75;
  prism('stone',bell,52.45,10.8);cornice(bell,63.25);facades(bell,[[54.3,6.9,2.3]],4.7,false,true);
  for(const z of [-13.8,7.8])window(near?-56.25:-56.6,54.3,z,2.3,6.9,-Math.PI/2);
  // Stepped base belts and returning corners break up the broad west frontage.
  for(const y of [17.6,33.6,50.9]){
    box('stone',-52.0,y,-3,1.05,.65,28.7);
    for(const z of [-17.25,11.25])box('stone',-49.9,y,z,4.4,.65,1.05);
  }
  for(const z of [-16.8,10.8]){
    box('stone',-52.12,33.65,z,.85,34.1,.75);
    box('stone',-50.9,33.65,z,2.1,34.1,.5);
  }
  const oct=Array.from({length:8},(_,i)=>[bx+12*Math.sin((i+.5)*Math.PI/4),bz+12*Math.cos((i+.5)*Math.PI/4)]);
  const shoulders=oct.map(([x,z])=>{const dx=x-bx,dz=z-bz,t=Math.min(12.05/Math.abs(dx),14.5/Math.abs(dz));return [bx+dx*t,bz+dz*t];});
  shoulder(shoulders,bx,bz,63.95,65.35,1,oct);
  prism('stone',oct,63.95,14.05);cornice(oct,78);
  facades(oct,[[66,10,2.3]],3.9);dome(bx,bz,12,78.7,12.1,4.4,near?24:16);
  // Four prominent smaller domed towers: west pair and north/south transept pair.
  for(const [id,rid] of [[1282739667,1283287481],[1282747245,1283287482],[1282747247,1283287484],[1282747248,1283287483]]){
    const ring=PARTS[id],roofring=PARTS[rid];
    const x=roofring.reduce((s,p)=>s+p[0],0)/roofring.length,z=roofring.reduce((s,p)=>s+p[1],0)/roofring.length;
    prism('stone',ring,52.5,.7);cornice(ring,53.2);
    shoulder(ring,x,z,53.9,55.7,.78);
    const upper=insetRing(ring,x,z,.78);prism('stone',upper,55.7,2.8);cornice(upper,58.5);
    // Strong plinth belts and corner returns survive the far silhouette.
    for(const y of [56.1,57.8])prism('stone',upper,y,.35);
    const r=5.5;cyl('stone',x,z,59.2,10.2,r,8);
    for(let i=0;i<8;i++){const a=(i+.5)*Math.PI/4;window(x+(r*Math.cos(Math.PI/8)+.3)*Math.sin(a),61,z+(r*Math.cos(Math.PI/8)+.3)*Math.cos(a),1.1,6.5,a);}
    lathe('stone',x,z,[[0,69.2],[5.5,69.2],[5.85,69.7],[5.85,70.3],[0,70.3]],8);dome(x,z,5.7,70.3,6.8,2.4,near?16:8);
  }
  // Four slender flanking turrets and their crosses are retained even in far.
  for(const id of [1283287485,1283287486,1283287487,1283287488]){
    const ring=PARTS[id],x=ring.reduce((s,p)=>s+p[0],0)/ring.length,z=ring.reduce((s,p)=>s+p[1],0)/ring.length;
    cyl('stone',x,z,52.5,10.8,3.5,8);
    for(let i=0;i<8;i++){const a=(i+.5)*Math.PI/4;window(x+3.55*Math.cos(Math.PI/8)*Math.sin(a),55,z+3.55*Math.cos(Math.PI/8)*Math.cos(a),.9,6.3,a);}
    dome(x,z,3.9,63.3,6.2,2.5,near?16:8);
  }
  // Eastern curved sanctuary and north/south apsidal half-caps, shaped from their mapped rings.
  {
    const ring=PARTS[1283287489],positions=[],indices=[],stages=[[1,53.5],[.98,54.4],[.85,56.3],[.58,58.3],[.03,60]],L=ring.length;
    for(const [scale,y] of stages)for(const [x,z] of ring)positions.push(45.5+(x-45.5)*scale,y,-3.5+(z+3.5)*scale);
    for(let k=0;k<stages.length-1;k++)for(let i=0;i<L;i++){const j=(i+1)%L,a=k*L+i,c=k*L+j;indices.push(a,c,(k+1)*L+i,c,(k+1)*L+j,(k+1)*L+i);}
    const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));g.setIndex(indices);g.computeVertexNormals();put(g,'gold');
    prism('stone',ring,52.5,1);
  }
  // Open north/south nave arcades. Their rear wall is inset; masonry above forms real spandrels.
  for(const [z,backz,a] of [[19.45,16.5,0],[-23.85,-21,Math.PI]]){
    box('stone',-20.0,.45,(z+backz)/2,21,.9,Math.abs(z-backz));
    const supports=Array.from({length:7},(_,i)=>-30.0+i*3.4);
    for(const x of supports){cyl('stone',x,z,.9,10.6,.40,near?10:6);box('stone',x,11.7,z,.95,.4,.95);}
    for(let i=0;i<6;i++){const x=(supports[i]+supports[i+1])/2,r=1.22,base=11.8,top=14.8,shape=new THREE.Shape();shape.moveTo(-1.7,top);shape.lineTo(-1.7,base);shape.lineTo(-r,base);shape.absarc(0,base,r,Math.PI,0,true);shape.lineTo(1.7,base);shape.lineTo(1.7,top);shape.closePath();put(new THREE.ExtrudeGeometry(shape,{depth:.85,bevelEnabled:false,curveSegments:near?8:3}),'stone',x,0,z-(a===0?.5:-.5),a);}
  }
  // West porch: seven clear arches, stone columns/capitals and recessed mosaic silhouettes.
  const porchZ=Array.from({length:8},(_,i)=>-16.25+i*3.75),px=-56.0;
  box('stone',-54,1.0,-3.125,5.1,2,29.1);
  for(const z of porchZ){box('stone',px,2.25,z,1.05,.5,1.05);cyl('stone',px,z,2.5,9.0,.39,near?12:6);box('stone',px,11.7,z,.95,.6,.95);}
  // Masonry spandrels between arch curve and horizontal soffit; no solid box behind the bays.
  for(let i=0;i<7;i++){const z=(porchZ[i]+porchZ[i+1])/2,r=1.48,base=11.6,top=15.0,shape=new THREE.Shape();shape.moveTo(-1.875,top);shape.lineTo(-1.875,base);shape.lineTo(-r,base);shape.absarc(0,base,r,Math.PI,0,true);shape.lineTo(1.875,base);shape.lineTo(1.875,top);shape.closePath();put(new THREE.ExtrudeGeometry(shape,{depth:1.15,bevelEnabled:false,curveSegments:near?12:5}),'stone',px-.5,0,z,-Math.PI/2);
    box('mosaic',-51.85,7.1,z,near?.25:.6,8.7,2.45);
    if(i===1||i===5){arch('glow',-52.02,3.4,z,1.7,5.3,-Math.PI/2);if(near){put(new THREE.SphereGeometry(.32,8,6),'rib',-52.25,7.9,z);box('rib',-52.24,6.35,z,.22,2.3,.65);}}
  }
  box('stone',-54.05,15.2,-3.1,5.1,.55,29.8);box('gold',-54.05,16.2,-3.1,5.0,1.4,29.4);
  // Giant west arched window, rose window and molded portal crest.
  window(-52.32,20.1,-3.0,8.4,23.5,-Math.PI/2);
  for(const [w,depth] of [[9.4,-52.45],[10.7,-52.6],[12.0,-52.75]])archFrame(depth,20.1,-3,w,23.5+(w-8.4)/2,-Math.PI/2,.44);
  for(const [r,xx] of [[4.8,-52.55],[5.5,-52.7],[6.2,-52.85]]){
    put(new THREE.TorusGeometry(r,.3,near?6:3,near?24:10,Math.PI),'stone',xx,39.4,-3,-Math.PI/2);
    for(const sg of [-1,1])box('stone',xx,29.7,-3+sg*r,.6,19.4,.6);
  }
  // Raised arched gable: masonry is supported by the body below, with gold
  // edging on its outer roof profile rather than a rose pasted on a flat wall.
  const crest=new THREE.Shape();crest.moveTo(-9.0,51.7);crest.lineTo(9.0,51.7);crest.lineTo(9.0,53.0);crest.lineTo(7.6,53.0);crest.lineTo(7.6,56.4);crest.absarc(0,56.4,7.6,0,Math.PI,false);crest.lineTo(-7.6,53.0);crest.lineTo(-9.0,53.0);crest.closePath();
  const roseHole=new THREE.Path();roseHole.absarc(0,56.4,3.8,0,Math.PI*2,true);crest.holes.push(roseHole);
  const crestGeometry=new THREE.ExtrudeGeometry(crest,{depth:1.35,bevelEnabled:false,curveSegments:near?16:4});crestGeometry.translate(0,0,-1.35);
  if(!near){
    // Replace the masonry curved roof faces with gold, instead of overlaying
    // a torus against the far facade and creating reciprocal depth layers.
    const normals=crestGeometry.attributes.normal,keep=[];
    for(let i=0;i<normals.count;i+=3)if(!(Math.abs(normals.getZ(i))<.001&&normals.getY(i)>.001))keep.push(i,i+1,i+2);
    crestGeometry.setIndex(keep);
  }
  put(crestGeometry,'stone',-56.4,0,-3,-Math.PI/2);
  for(const [r,xx] of [[6.65,-56.6],[7.05,-56.45],[7.45,-56.3]]){
    put(new THREE.TorusGeometry(r,.16,near?4:3,near?24:12,Math.PI),'stone',xx,56.4,-3,-Math.PI/2);
    for(const sg of [-1,1])box('stone',xx,54.7,-3+sg*r,.32,3.4,.32);
  }
  // Gold shoulder line runs down to the horizontal cornices at both ends.
  if(near)put(new THREE.TorusGeometry(7.8,.2,4,24,Math.PI),'gold',-56.3,56.4,-3,-Math.PI/2);
  else{
    const positions=[],indices=[],segments=8;
    for(let i=0;i<=segments;i++){
      const a=i*Math.PI/segments;for(const x of [-56.6,-55.05])positions.push(x,56.4+7.6*Math.sin(a),-3+7.6*Math.cos(a));
      if(i){const k=(i-1)*2;indices.push(k,k+1,k+2,k+1,k+3,k+2);}
    }
    const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));g.setIndex(indices);g.computeVertexNormals();put(g,'gold');
  }
  for(const sg of [-1,1]){
    if(near)box('gold',-56.3,54.8,-3+sg*7.8,.4,3.2,.4);
    for(const y of [51.7,52.4,53.0])box('stone',-56.15,y,-3+sg*10,.65,.35,4.4);
  }
  put(new THREE.CircleGeometry(3.8,near?24:12),'glass',-56.9,56.4,-3,-Math.PI/2);
  put(new THREE.TorusGeometry(4.25,.46,near?5:3,near?32:16),'stone',-57.0,56.4,-3,-Math.PI/2);
  if(near)for(let i=0;i<12;i++){const a=i*2*Math.PI/12;bar('stone',[-57.1,56.4,-3],[-57.1,56.4+3.8*Math.sin(a),-3+3.8*Math.cos(a)],.09);}
  // Relief icon panel above the porch, grouped heads and robes, not a texture.
  box('stone',-52.2,18.1,-3.1,.55,3.2,5.5);box('glow',-52.53,18.1,-3.1,.2,2.5,4.6);
  for(const z of [-4.4,-3.1,-1.8]){put(new THREE.SphereGeometry(.20,near?8:5,near?5:3),'rib',-52.7,18.72,z);box('rib',-52.67,17.8,z,.15,1.25,.5);}
  // A handful of shallow entrance treads stay inside the mapped frontage.
  for(let i=0;i<4;i++)box('stone',-56.5+i*.5,.15+i*.2,-3.125,1.8,.3+i*.4,28.2);
  const out=b.finish();out.traverse(o=>{if(o.isMesh&&o.material.name==='gold'){o.material.metalness=.32;o.material.roughness=.55;}});return out;
}
