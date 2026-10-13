import * as THREE from 'three';
import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';

// Aligned eastward barrel axis; the 8.6° yaw is baked into every final vertex.
// The slight taper reproduces the nonparallel nineteenth-century shell.
export const SHELL = [[-26,-19], [26.8,-17.95], [29,17.5], [-26.25,18.7]];
export const ROOF = { west: -23.3, east: 26.3, center: -.4, radius: 17.9, rise: 20, base: 22 };
export const MUSES = Array.from({length:8},(_,i)=>-16.55+i*4.62);
export function world([x,y,z]) {
  const a=SPEC.gridAngle; return [x*Math.cos(a)+z*Math.sin(a),y,-x*Math.sin(a)+z*Math.cos(a)];
}
export function create({detail='near'}={}) {
  const near=detail==='near', b=assetBuilder({...SPEC,palette:PALETTES.light},detail);
  function mesh(mat,points,indices) {
    const g=new THREE.BufferGeometry(); g.setAttribute('position',new THREE.Float32BufferAttribute(points.flat(),3));
    g.setIndex(indices);g.computeVertexNormals();b.put(g,mat);
  }
  function quad(mat,p) { mesh(mat,p,[0,1,2,0,2,3]); }
  function solid(mat,ring,lo,hi) {
    const pts=ring.map(p=>[p[0],lo,p[1]]).concat(ring.map(p=>[p[0],hi,p[1]])),n=ring.length,idx=[];
    for(let i=0;i<n;i++){const j=(i+1)%n;idx.push(i,n+i,j,j,n+i,n+j);}
    const cap=THREE.ShapeUtils.triangulateShape(ring.map(p=>new THREE.Vector2(...p)),[]);
    for(const [a,c,d] of cap) idx.push(a,c,d,n+a,n+d,n+c);
    mesh(mat,pts,idx);
  }
  // Three open peristyle faces enclose a recessed glazed lobby, with no stone
  // infill hiding the arch voids. Upper walls are cut out around every window.
  solid('glass',[[-22.7,-15.9],[24.2,-14.9],[25.2,14.7],[-22.7,15.5]],0,21.8);
  const N=near?12:5;
  const outline=(cx,width,bottom,spring,top)=>{
    const r=width/2, p=[[cx-r,bottom],[cx+r,bottom],[cx+r,spring]];
    for(let j=1;j<=N;j++){const a=j*Math.PI/N;p.push([cx+r*Math.cos(a),spring+(top-spring)*Math.sin(a)]);}
    return p;
  };
  // Faces are mapped into each real trapezoid edge, positive depth points inward.
  function facade(a,c,bays,front=false,rear=false) {
    const dx=c[0]-a[0],dz=c[1]-a[1],L=Math.hypot(dx,dz),tx=dx/L,tz=dz/L,nx=tz,nz=-tx;
    const p=(s,y,d=0)=>[a[0]+tx*s-nx*d,y,a[1]+tz*s-nz*d];
    const rect=(mat,s0,s1,y0,y1,d)=>quad(mat,[p(s0,y0,d),p(s1,y0,d),p(s1,y1,d),p(s0,y1,d)].reverse());
    function panel(s0,s1,lo,hi,hole,mat='stone',depth=.85) {
      const shape=new THREE.Shape();shape.moveTo(s0,lo);shape.lineTo(s1,lo);shape.lineTo(s1,hi);shape.lineTo(s0,hi);shape.closePath();
      if(hole){const path=new THREE.Path();path.moveTo(...hole[0]);for(const v of hole.slice(1))path.lineTo(...v);path.closePath();shape.holes.push(path);}
      const g=new THREE.ExtrudeGeometry(shape,{depth,bevelEnabled:false,curveSegments:N,steps:1});
      const pos=g.attributes.position;
      for(let i=0;i<pos.count;i++){const q=p(pos.getX(i),pos.getY(i),pos.getZ(i));pos.setXYZ(i,...q);}
      g.computeVertexNormals();b.put(g,mat);
    }
    const pitch=L/bays;
    for(let i=0;i<bays;i++) {
      const s0=i*pitch,s1=(i+1)*pitch,cx=(s0+s1)/2,w=front?3.45:3.1;
      const ground=outline(cx,w,.35,5.45,7.05);
      if(rear){panel(s0,s1,0,9.15,[[cx-1,.35],[cx+1,.35],[cx+1,4.5],[cx-1,4.5]]);rect('shutter',cx-1,cx+1,.35,4.5,.40);}
      else panel(s0,s1,0,9.15,ground);
      const window=outline(cx,front?3.2:2.9,11.25,17.45,18.9);
      panel(s0,s1,9.15,20.15,window);
      // Window panes close only the upper holes, set back behind stone reveals.
      const pane=window.map(([s,y])=>p(s,y,.4)),faces=THREE.ShapeUtils.triangulateShape(window.map(v=>new THREE.Vector2(...v)),[]);
      mesh(front?'glass':'shutter',pane,faces.flatMap(([a,b,c])=>[a,c,b]));
      if(near) {
        const l=front?3.2:2.9;
        rect('steel',cx-.04,cx+.04,11.3,17.65,.12);
        for(let y=12;y<17.5;y+=front?2.4:.58)rect('steel',cx-l/2+.03,cx+l/2-.03,y,y+.07,.12);
      }
      // Arch moulding and a restrained pilaster capital, all stone-family
      // surfaces; no glazing over an uncut background facade.
      for(const [bottom,spring,top,width] of [[.35,5.45,7.05,w],[11.25,17.45,18.9,front?3.2:2.9]]) {
        const r=width/2,th=.17;
        for(let j=0;j<N;j++) {
          const q=j*Math.PI/N,t=(j+1)*Math.PI/N;
          quad('stone',[
            p(cx+(r+th)*Math.cos(q),spring+(top-spring+th)*Math.sin(q),-.13),
            p(cx+(r+th)*Math.cos(t),spring+(top-spring+th)*Math.sin(t),-.13),
            p(cx+r*Math.cos(t),spring+(top-spring)*Math.sin(t),-.13),
            p(cx+r*Math.cos(q),spring+(top-spring)*Math.sin(q),-.13),
          ].reverse());
        }
      }
      if(near){
        const s=s0+.36;panel(s-.22,s+.22,11,19.65,null,'stone',.3);
        rect('stone',s-.42,s+.42,19.35,19.68,-.26);
        if(!rear)rect('stone',s0,s1,5.18,5.42,-.20);
      }
    }
    // Cornice belts stay thick enough to read at driving distance.
    for(const [lo,hi,d] of [[8.6,9.15,.20],[9.15,9.7,.36],[19.8,20.25,.28],[21.5,22,.30]]) {
      const ring=[p(0,0,-d),p(L,0,-d),p(L,0,.85),p(0,0,.85)].map(v=>[v[0],v[2]]);
      solid('stone',ring,lo,hi);
    }
    panel(0,L,20.25,21.5,null,'stone');
    if(near)for(let i=0;i<bays;i++){
      const cx=(i+.5)*pitch;
      rect('stone',cx-1.1,cx+1.1,20.55,21.15,-.14);
      if(front){ // grouped relief ovals, not a texture or lettering.
        for(const d of [-.8,.8]) {const g=new THREE.SphereGeometry(.24,6,4);g.scale(.6,1,.5);g.translate(...p(cx+d,20.86,-.25));b.put(g,'stone');}
      }
    }
  }
  facade(SHELL[0],SHELL[1],13);
  facade(SHELL[1],SHELL[2],7,false,true);
  facade(SHELL[2],SHELL[3],13);
  facade(SHELL[3],SHELL[0],7,true);
  // A closed roof deck seals the top of the shell and grounds the statues.
  solid('stone',SHELL,21.95,22);
  // Continuous roof-seat cornices bridge the slight nonparallelism between
  // the nineteenth-century walls and the constant-radius Nouvel vault.
  for(const side of [-1,1])b.box('stone',[(ROOF.west+ROOF.east)/2,21.75,ROOF.center+side*(ROOF.radius+.10)],[ROOF.east-ROOF.west+.6,.5,.6]);
  // Eight original human silhouettes: draped torso, head, shoulders and arms
  // supported by a low rectangular pedestal on the western parapet.
  for(let i=0;i<MUSES.length;i++){
    const v=MUSES[i],u=-25.9;
    b.box('stone',[u,22.16,v],[.85,.32,1]);
    const skirt=new THREE.CylinderGeometry(.22,.42,1.65,near?7:5);skirt.scale(.75,1,1);skirt.translate(u,23.13,v);b.put(skirt,'stone');
    const torso=new THREE.SphereGeometry(.38,near?8:5,near?5:3);torso.scale(.65,1.3,.85);torso.translate(u,23.98,v);b.put(torso,'stone');
    const head=new THREE.SphereGeometry(.22,near?8:5,near?5:3);head.translate(u,24.65,v);b.put(head,'stone');
    const shoulder=[u,24.16,v+.27],hand=[u-.2,23.8,v+.62];
    b.bar('stone',shoulder,hand,.16,.16);b.bar('stone',[u,24.17,v-.27],[u-.12,24.4+(i%2)*.2,v-.50],.15);
  }
  const r=ROOF,steps=near?40:24;
  const surface=(u,t,off=0)=>[u,r.base+(r.rise+off)*Math.sin(t),r.center+(r.radius+off)*Math.cos(t)];
  for(let j=0;j<steps;j++) {
    const a=j*Math.PI/steps,c=(j+1)*Math.PI/steps;
    quad('glass',[surface(r.west,a),surface(r.east,a),surface(r.east,c),surface(r.west,c)]);
  }
  // Tympana are filled semicircles; west is glazed, east perforated steel.
  for(const [u,mat,reverse] of [[r.west,'glass',false],[r.east,'shutter',true]]) {
    const points=[[u,r.base,r.center]];for(let j=0;j<=steps;j++)points.push(surface(u,j*Math.PI/steps));
    const idx=[];for(let j=1;j<=steps;j++)idx.push(...(reverse?[0,j+1,j]:[0,j,j+1]));mesh(mat,points,idx);
  }
  // End rims are geometrically separated from the glass, including far LOD.
  // The round arches terminate in the supporting stone roof deck at y=22.
  for(let i=0;i<=(near?24:12);i++){
    const u=r.west+(r.east-r.west)*i/(near?24:12),wide=(i===0||i===(near?24:12))?.6:near?.15:.22;
    for(let j=0;j<steps;j++){
      const a=j*Math.PI/steps,c=(j+1)*Math.PI/steps;
      quad('steel',[surface(u-wide/2,a,.16),surface(u+wide/2,a,.16),surface(u+wide/2,c,.16),surface(u-wide/2,c,.16)]);
    }
  }
  // Red night purlin lights on the curved roof: the palette handles theme,
  // while day retains the subdued gray-black roof-screen character.
  for(let j=1;j<(near?25:13);j++){
    const t=j*Math.PI/(near?25:13),dt=near?.0035:.006;
    quad('glow',[surface(r.west+.4,t-dt,.22),surface(r.east-.4,t-dt,.22),surface(r.east-.4,t+dt,.22),surface(r.west+.4,t+dt,.22)]);
  }
  // Front grid is bounded by the ellipse: each horizontal slat meets its
  // peripheral rim, with vertical posts running down into the stone shell.
  for(let y=24;y<41;y+=near?1.55:3.1){
    const w=r.radius*Math.sqrt(1-((y-r.base)/r.rise)**2);
    b.box('steel',[r.west-.33,y,r.center],[.23,near?.18:.26,w*2]);
  }
  for(let v=-15;v<=15;v+=near?3:6){
    const top=r.base+r.rise*Math.sqrt(1-((v-r.center)/r.radius)**2);
    b.box('steel',[r.west-.35,(22+top)/2,v],[.22,top-22,.12]);
  }
  const root=b.finish();
  for(const m of root.children){m.geometry.rotateY(SPEC.gridAngle);m.geometry.computeBoundingBox();m.geometry.computeBoundingSphere();}
  return root;
}
