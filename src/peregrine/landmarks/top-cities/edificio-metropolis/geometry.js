import * as THREE from 'three';
import polygonClipping from 'polygon-clipping';
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';
import { FOOTPRINTS, COURTYARD } from './footprint.js';

export const ROTUNDA = [14.8, -4.45];
const C = ROTUNDA;
const k = 111319.49079327358;
const local = ([lng,lat]) => [(lng-SPEC.origin[0])*k*Math.cos(SPEC.origin[1]*Math.PI/180), -(lat-SPEC.origin[1])*k];
const outline = FOOTPRINTS[0].map(local), court=COURTYARD.map(local);
const closed = r => [...r,r[0]];
const area = r => r.reduce((s,a,i)=>{const c=r[(i+1)%r.length];return s+a[0]*c[1]-c[0]*a[1];},0)/2;
const ccw = r => area(r)>0?r:[...r].reverse();
const POLY = [closed(ccw(outline)),closed([...ccw(court)].reverse())];
function face(b,mat,points,normal) {
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(points.flat(),3));
  const cross=new THREE.Vector3(...points[1]).sub(new THREE.Vector3(...points[0])).cross(new THREE.Vector3(...points[2]).sub(new THREE.Vector3(...points[0])));
  const reverse=cross.dot(new THREE.Vector3(...normal))<0,ix=[];
  for(let i=1;i<points.length-1;i++)ix.push(...(reverse?[0,i+1,i]:[0,i,i+1]));g.setIndex(ix);g.computeVertexNormals();b.put(g,mat);
}
function plane(b,mat,polys,point,normal) {
  for(const p of polys){const r=p.map(q=>q.slice(0,-1)),all=r.flat();const ix=THREE.ShapeUtils.triangulateShape(r[0].map(q=>new THREE.Vector2(...q)),r.slice(1).map(h=>h.map(q=>new THREE.Vector2(...q))));for(const t of ix)face(b,mat,t.map(i=>point(...all[i])),normal);}
}
function cyl(b,mat,x,z,y,h,r,rt,n) {const g=new THREE.CylinderGeometry(rt,r,h,n);g.translate(x,y+h/2,z);b.put(g,mat);}
function ellipsoid(b,mat,p,scale,near) {const g=new THREE.SphereGeometry(1,near?8:5,near?5:3);g.scale(...scale);g.translate(...p);b.put(g,mat);}
const radial = (a,r,y) => [C[0]+r*Math.cos(a),y,C[1]+r*Math.sin(a)];
function torus(b,mat,y,r,t,n){const g=new THREE.TorusGeometry(r,t,4,n);g.rotateX(Math.PI/2);g.translate(C[0],y,C[1]);b.put(g,mat);}
function wall(b,a,c,y0,y1,near,outer=true) {
  const dx=c[0]-a[0],dz=c[1]-a[1],len=Math.hypot(dx,dz);if(len<.05)return;
  const t=[dx/len,dz/len],n=[t[1],-t[0]],P=(s,y,d=0)=>[a[0]+t[0]*s+n[0]*d,y,a[1]+t[1]*s+n[1]*d];
  const round=Math.min(a[0],c[0])>9, fancy=outer&&(round||n[1]<-.6||n[1]>.6);
  const count=Math.max(0,Math.floor(len/(round?2.5:near?3.5:4.8))),pitch=len/Math.max(1,count),holes=[];
  const rows=[[.75,6.6],[9.0,12.1],[14.0,17.8],[20.1,23.6]];
  for(let i=0;i<count;i++)for(const [lo,hi] of rows){const bottom=Math.max(lo,y0),top=Math.min(hi,y1);if(top-bottom<.4)continue;
    const s=(i+.5)*pitch,w=Math.min(round?1.8:2,pitch*.58),r=[[s-w/2,bottom],[s+w/2,bottom],[s+w/2,top],[s-w/2,top]];holes.push({r,s,w,bottom,top,mat:lo===14.0?'glow':'glass'});
  }
  const rect=[[[0,y0],[len,y0],[len,y1],[0,y1],[0,y0]]];
  const panels=holes.length?polygonClipping.difference(rect,...holes.map(h=>[closed(h.r)])):[rect];
  plane(b,'stone',panels,(s,y)=>P(s,y),[n[0],0,n[1]]);
  for(const h of holes){const recess=near?.30:.12;plane(b,h.mat,[[closed(h.r)]],(s,y)=>P(s,y,-recess),[n[0],0,n[1]]);
    for(let i=0;i<4;i++){const p=h.r[i],q=h.r[(i+1)%4];face(b,'stone',[P(...p),P(...q),P(...q,-recess),P(...p,-recess)],[(h.s-(p[0]+q[0])/2)*t[0],(h.bottom+h.top-p[1]-q[1])/2+.001,(h.s-(p[0]+q[0])/2)*t[1]]);}
    if(near){b.bar('stone',P(h.s-h.w/2-.13,h.top+.18,.18),P(h.s+h.w/2+.13,h.top+.18,.18),.28,.38);if(fancy&&h.bottom>8){b.bar('stone',P(h.s-h.w/2-.13,h.bottom,.13),P(h.s-h.w/2-.13,h.top,.13),.22,.28);b.bar('stone',P(h.s+h.w/2+.13,h.bottom,.13),P(h.s+h.w/2+.13,h.top,.13),.22,.28);}}
  }
  for(const y of [7.9,13.0,19.1,25.4])if(y>y0&&y<y1)b.bar('stone',P(0,y,.17),P(len,y,.17),y===25.4?.8:.42,.45);
  if(near&&fancy&&!round&&len>6)for(let s=pitch;s<len-.3;s+=pitch){b.bar('stone',P(s,8.3,.15),P(s,24.8,.15),.45,.42);b.box('stone',P(s,24.5,.2),[.7,.6,.7]);}
}
function sculpt(b,x,z,y,near,scale=1,mat='stone'){
  // Seated, draped allegories: broad lap, bent knees, torso and distinct head.
  // All additions are near-only; far retains its established dome/Victory envelope.
  cyl(b,mat,x,z,y,1.25*scale,.48*scale,.28*scale,near?7:4);
  ellipsoid(b,mat,[x,y+1.55*scale,z],[.42*scale,.60*scale,.31*scale],near);
  ellipsoid(b,mat,[x,y+2.22*scale,z],[.25*scale,.29*scale,.25*scale],near);
  for(const s of [-1,1])b.bar(mat,[x+s*.3*scale,y+1.85*scale,z],[x+s*.68*scale,y+1.15*scale,z+.20*scale],.23*scale,.23*scale);
  if(near){
    const a=Math.atan2(z-C[1],x-C[0]),P=(u,h,d)=>[x+Math.cos(a)*d-Math.sin(a)*u,y+h*scale,z+Math.sin(a)*d+Math.cos(a)*u];
    ellipsoid(b,mat,P(0,.85,.12),[.60*scale,.35*scale,.50*scale],near);
    for(const sign of [-1,1]){
      b.bar(mat,P(sign*.27*scale,1.15,.10),P(sign*.34*scale,.72,.45),.30*scale,.34*scale);
      b.bar(mat,P(sign*.34*scale,.72,.45),P(sign*.31*scale,.16,.44),.26*scale,.26*scale);
      ellipsoid(b,mat,P(sign*.31*scale,.15,.50),[.19*scale,.15*scale,.32*scale],near);
    }
    // Fold ridges meet the flared skirt and lap, rather than separate knobs.
    for(const u of [-.24,0,.24])b.bar(mat,P(u*scale,.20,.33),P(u*scale,.82,.38),.10*scale,.12*scale);
  }
}
function victory(builder,near){
  // Wing spread faces the Alcalá/Gran Vía junction to the east.
  const turn=([x,y,z])=>[C[0]+z-C[1],y,C[1]-x+C[0]];
  const b={ put(g,mat){g.translate(-C[0],0,-C[1]);g.rotateY(Math.PI/2);g.translate(C[0],0,C[1]);builder.put(g,mat);}, bar(mat,a,c,w,d){builder.bar(mat,turn(a),turn(c),w,d);} };
  // Present-day bronze Victory. Wing membranes are original polygon silhouettes,
  // swept thick and divided into long flight feathers; both wings root at the torso.
  const y=41.3,x=C[0],z=C[1];
  cyl(b,'bronze',x,z,y,1.45,.38,.26,near?8:5);
  ellipsoid(b,'bronze',[x,y+1.62,z],[.40,.61,.29],near);
  ellipsoid(b,'bronze',[x,y+2.42,z],[.24,.28,.24],near);
  b.bar('bronze',[x-.28,y+1.9,z],[x-.78,y+2.55,z+.10],.20,.20);
  b.bar('bronze',[x-.78,y+2.55,z+.10],[x-.65,44.92,z+.12],.16,.16);
  b.bar('bronze',[x+.28,y+1.9,z],[x+.85,y+1.5,z+.28],.20,.20);
  for(const sign of [-1,1]){
    const shape=new THREE.Shape(); const r=[[.20,1.6],[.48,2.2],[1.4,2.7],[3.25,3.3],[2.95,2.72],[2.3,2.35],[1.65,1.87],[.8,1.4]];
    r.forEach((p,i)=>i?shape.lineTo(sign*p[0],p[1]):shape.moveTo(sign*p[0],p[1]));shape.closePath();
    const g=new THREE.ExtrudeGeometry(shape,{depth:.20,bevelEnabled:false,curveSegments:2});g.translate(x,y,z-.32);b.put(g,'bronze');
    if(near)for(let i=0;i<5;i++){const s=.85+i*.40; b.bar('bronze',[x+sign*s,y+2.48+i*.11,z-.25],[x+sign*(s+.33),y+1.82+i*.16,z-.25],.13,.23);}
  }
}
export function create({detail='near'}={}){
  const near=detail==='near',b=assetBuilder({...SPEC,palette:PALETTES.light},detail),N=near?32:16;
  // Original mapped wedge with a real open central court. No neighbouring mass is included.
  const upper=outline.map((p,i)=>{if(i<3||i>21)return p; const r=Math.hypot(p[0]-C[0],p[1]-C[1]);return [C[0]+(p[0]-C[0])*5.65/r,C[1]+(p[1]-C[1])*5.65/r];}).filter((p,i)=>i<3||i>21||[3,6,9,13,16,19,21].includes(i));
  const lower=outline.filter((p,i)=>i<3||i>21||[3,6,9,13,16,19,21].includes(i));
  const ring=ccw(lower),high=ccw(upper),hole=[...ccw(court)].reverse();
  for(const [r,lo,hi,outer] of [[ring,0,8,true],[high,8,26,true],[hole,0,26,false]])for(let i=0;i<r.length;i++)wall(b,r[i],r[(i+1)%r.length],lo,hi,near,outer);
  plane(b,'stone',polygonClipping.difference([POLY],[[closed(ccw(upper)),closed(hole)]]),(x,z)=>[x,8,z],[0,1,0]);
  const circle=closed(Array.from({length:N},(_,i)=>[C[0]+6.8*Math.cos(i*2*Math.PI/N),C[1]+6.8*Math.sin(i*2*Math.PI/N)]));
  const wing=polygonClipping.difference([POLY],[circle]);
  plane(b,'stone',wing,(x,z)=>[x,26,z],[0,1,0]);
  // Slate mansard strips along the two long street wings, supported on their cornices.
  for(const idx of [0,1,22,23]){
    const a=outline[idx],c=outline[(idx+1)%outline.length],dx=c[0]-a[0],dz=c[1]-a[1],len=Math.hypot(dx,dz),n=[-dz/len,dx/len];
    const inner=[a[0]+n[0]*3.0,a[1]+n[1]*3.0],last=[c[0]+n[0]*3.0,c[1]+n[1]*3.0];
    face(b,'slate',[[a[0],26,a[1]],[c[0],26,c[1]],[last[0],29.3,last[1]],[inner[0],29.3,inner[1]]],[0,1,0]);
    // Close roof ends in stone, with small stone dormers containing cut dark apertures.
    for(const [p,q] of [[a,inner],[c,last]])face(b,'stone',[[p[0],26,p[1]],[q[0],26,q[1]],[q[0],29.3,q[1]]],[dx,0,dz]);
    const t=[dx/len,dz/len],count=Math.floor(len/(near?4.1:6.0));
    for(let i=0;i<count;i++){const s=(i+.5)*len/count,P=[a[0]+t[0]*s+n[0]*1.65,a[1]+t[1]*s+n[1]*1.65];
      const da=[P[0]-t[0]*.7,P[1]-t[1]*.7],db=[P[0]+t[0]*.7,P[1]+t[1]*.7];// A dormer front is a cut panel; no second solid face sits behind its glass.
      const point=(u,y)=>[P[0]+t[0]*u-n[0]*.32,y,P[1]+t[1]*u-n[1]*.32];
      const frame=[[[ -.8,27.4],[.8,27.4],[.8,29.5],[-.8,29.5],[-.8,27.4]]];const opening=[[[ -.48,27.7],[.48,27.7],[.48,29.1],[-.48,29.1],[-.48,27.7]]];
      plane(b,'stone',polygonClipping.difference(frame,opening),point,[-n[0],0,-n[1]]);plane(b,'glass',[opening],point,[-n[0],0,-n[1]]);
      b.bar('stone',point(-.9,29.5),point(.9,29.5),.25,.38);
    }
    if(near)for(let s=.7;s<len-.4;s+=1.3){const p=[a[0]+t[0]*s,30.0,a[1]+t[1]*s];b.box('stone',p,[.20,.7,.20]);}
    b.bar('stone',[inner[0]+t[0],29.65,inner[1]+t[1]],[last[0]-t[0],29.65,last[1]-t[1]],.6,.55);
  }
  // Closed inward-sloping mansard shell around the genuine courtyard opening.
  const inset=outline.map(([x,z])=>[x*.83,z*.83]);
  for(let i=0;i<outline.length;i++){const j=(i+1)%outline.length;if(i>=3&&i<=20)continue;const a=outline[i],c=outline[j],u=inset[i],v=inset[j];face(b,'slate',[[a[0],26,a[1]],[c[0],26,c[1]],[v[0],29.35,v[1]],[u[0],29.35,u[1]]],[0,1,0]);}
  const roof=polygonClipping.difference([[closed(ccw(inset)),closed(hole)]],[circle]);plane(b,'slate',roof,(x,z)=>[x,29.35,z],[0,1,0]);
  for(let i=0;i<hole.length;i++)wall(b,hole[i],hole[(i+1)%hole.length],26,29.35,near,false);
  // Rotunda: giant paired Corinthian columns rise across the three upper storeys.
  const angular=Array.from({length:7},(_,i)=>(-110+i*35)*Math.PI/180);
  for(const a of angular)for(const off of [-.075,.075]){
    const p=radial(a+off,6.62,0);cyl(b,'stone',p[0],p[2],8.0,.65,.45,.45,near?8:5);cyl(b,'stone',p[0],p[2],8.6,15.1,.32,.26,near?8:5);cyl(b,'stone',p[0],p[2],23.6,.65,.51,.51,near?8:5);
    if(near){const q=radial(a+off,6.62,24.35);b.box('stone',q,[.9,.32,.9]);}
  }
  cyl(b,'stone',C[0],C[1],24.3,1.4,7.1,7.1,N);
  cyl(b,'stone',C[0],C[1],25.7,.6,7.3,7.3,N);
  // Upper cylindrical drum is a cut-window shell, not glass over a solid cylinder.
  const drum=ccw(Array.from({length:near?16:12},(_,i)=>[C[0]+6.25*Math.cos(i*2*Math.PI/(near?16:12)),C[1]+6.25*Math.sin(i*2*Math.PI/(near?16:12))]));
  for(let i=0;i<drum.length;i++){
    const a=drum[i],c=drum[(i+1)%drum.length],dx=c[0]-a[0],dz=c[1]-a[1],len=Math.hypot(dx,dz),t=[dx/len,dz/len],n=[t[1],-t[0]],P=(u,y)=>[a[0]+t[0]*u,y,a[1]+t[1]*u];
    const aperture=[[[len*.28,27.0],[len*.72,27.0],[len*.72,30.0],[len*.28,30.0],[len*.28,27.0]]];
    const rect=[[[0,26.3],[len,26.3],[len,33.2],[0,33.2],[0,26.3]]];
    plane(b,'stone',polygonClipping.difference(rect,aperture),P,[n[0],0,n[1]]);plane(b,'glass',[aperture],P,[n[0],0,n[1]]);
    const archR=len*.27,segments=near?8:4;
    for(let j=0;j<segments;j++){const a=j*Math.PI/segments,c=(j+1)*Math.PI/segments;b.bar('stone',P(len*.5+archR*Math.cos(a),30+archR*Math.sin(a)),P(len*.5+archR*Math.cos(c),30+archR*Math.sin(c)),.26,.32);}
    if(near&&i>1&&i<drum.length-2){const p=P(len*.5,31.7);ellipsoid(b,'stone',p,[.45,.50,.45],near);}
  }
  for(const a of angular.filter((_,i)=>i%2===0)){const p=radial(a,6.7,26.2);sculpt(b,p[0],p[2],p[1],near,.9);}
  // Junction-facing METROPOLIS plaque: original line glyphs, pale stone on inset slate.
  const glyphs={M:[[0,0,0,1],[0,1,.5,.45],[.5,.45,1,1],[1,1,1,0]],E:[[0,0,0,1],[0,1,1,1],[0,.5,.8,.5],[0,0,1,0]],T:[[0,1,1,1],[.5,1,.5,0]],R:[[0,0,0,1],[0,1,1,1],[1,1,1,.5],[1,.5,0,.5],[.45,.5,1,0]],O:[[0,0,0,1],[0,1,1,1],[1,1,1,0],[1,0,0,0]],P:[[0,0,0,1],[0,1,1,1],[1,1,1,.5],[1,.5,0,.5]],L:[[0,1,0,0],[0,0,1,0]],I:[[0,1,1,1],[.5,1,.5,0],[0,0,1,0]],S:[[1,1,0,1],[0,1,0,.5],[0,.5,1,.5],[1,.5,1,0],[1,0,0,0]]};
  // A standalone stone surround supports a thick plaque; lettering stands .22 m proud.
  b.box('stone',[C[0]+6.12,32.0,C[1]],[.65,1.20,5.25]);
  const text='METROPOLIS',pitch=.46,ink=[];
  for(let i=0;i<text.length;i++)for(const [u,v,a,c] of glyphs[text[i]]){
    const start=[-2.25+i*pitch+u*.30,31.66+v*.65],end=[-2.25+i*pitch+a*.30,31.66+c*.65],dx=end[0]-start[0],dy=end[1]-start[1],l=Math.hypot(dx,dy),nx=-dy/l*.028,ny=dx/l*.028;
    ink.push([closed([[start[0]+nx,start[1]+ny],[end[0]+nx,end[1]+ny],[end[0]-nx,end[1]-ny],[start[0]-nx,start[1]-ny]])]);
  }
  const letters=polygonClipping.union(...ink),panel=[[[ -2.525,31.51],[2.525,31.51],[2.525,32.49],[-2.525,32.49],[-2.525,31.51]]];
  const point=(z,y)=>[C[0]+6.68,y,C[1]+z];
  plane(b,'slate',polygonClipping.difference(panel,letters),point,[1,0,0]);plane(b,'stone',letters,point,[1,0,0]);
  const corners=panel[0].slice(0,-1);for(let i=0;i<4;i++){const p=corners[i],q=corners[(i+1)%4];face(b,'slate',[[C[0]+6.445,p[1],C[1]+p[0]],point(...p),point(...q),[C[0]+6.445,q[1],C[1]+q[0]]],[0,(p[1]+q[1])/2-32,(p[0]+q[0])/2]);}
  // Visible annular crown above the drum. Gold ornament stands clear of slate.
  cyl(b,'stone',C[0],C[1],33.2,.65,6.5,6.7,N);
  cyl(b,'gold',C[0],C[1],33.85,.30,6.1,6.1,N);
  const profile=[[6.0,34.15],[5.95,34.7],[5.55,35.8],[4.95,37.0],[4.05,38.25],[2.85,39.2],[1.72,39.75],[1.28,40.1]];
  const g=new THREE.LatheGeometry(profile.map(([r,y])=>new THREE.Vector2(r,y)),N);g.translate(C[0],0,C[1]);b.put(g,'slate');
  torus(b,'gold',35.0,6.08,.13,N);torus(b,'gold',39.3,2.95,.16,N);
  for(let i=0;i<(near?16:8);i++){
    const a=i*2*Math.PI/(near?16:8);
    for(let j=0;j<(near?3:2);j++){const y=35.25+j*.38,r=5.98-j*.10,p=radial(a,r+.24,y);ellipsoid(b,'gold',p,[.19,.30,.19],near);}
    const p=radial(a,3.14,39.35);ellipsoid(b,'gold',p,[.25,.36,.25],near);
  }
  const domeR=y=>{for(let j=1;j<profile.length;j++)if(y<=profile[j][1]){const [ra,ya]=profile[j-1],[rb,yb]=profile[j];return ra+(rb-ra)*(y-ya)/(yb-ya);}return 1.28;};
  for(let i=0;i<8;i++)for(let j=0;j<(near?8:4);j++){
    const steps=near?8:4,t=j/steps,u=(j+1)/steps,a=i*Math.PI/4+t*Math.PI/4,c=i*Math.PI/4+u*Math.PI/4;
    const y=39.2-.95*Math.sin(t*Math.PI),v=39.2-.95*Math.sin(u*Math.PI);
    b.bar('gold',radial(a,domeR(y)+.28,y),radial(c,domeR(v)+.28,v),near?(.19+.06*Math.sin(t*Math.PI)):.14,near?.22:.14);
    if(near&&j%2===1){const q=(t+u)/2,angle=i*Math.PI/4+q*Math.PI/4,h=39.2-.95*Math.sin(q*Math.PI);ellipsoid(b,'gold',radial(angle,domeR(h)+.28,h),[.25,.28,.25],near);}
    if(near&&j===4){const p=radial((a+c)/2,domeR((y+v)/2)+.29,(y+v)/2-.22);ellipsoid(b,'gold',p,[.27,.48,.27],near);}
  }
  // Oculi sit on the dome's outer surface with gold frames; dark centers are open discs.
  for(let i=0;i<8;i++){
    const a=i*Math.PI/4,p=radial(a,5.43,36.65),normal=new THREE.Vector3(Math.cos(a),.34,Math.sin(a)).normalize(),q=new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,0,1),normal);
    const rim=new THREE.TorusGeometry(.46,.095,4,near?16:8);rim.applyQuaternion(q);rim.translate(...p);b.put(rim,'gold');
  }
  cyl(b,'gold',C[0],C[1],40.1,.40,1.36,1.06,N);
  cyl(b,'bronze',C[0],C[1],40.5,.80,1.06,.45,N);
  victory(b,near);
  const root=b.finish();root.traverse(o=>{if(o.isMesh){const old=o.geometry;o.geometry=mergeVertices(old,1e-4);old.dispose();}});return root;
}
