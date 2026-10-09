import * as THREE from 'three';
import { SPEC } from './config.js';
const angle = (SPEC.boosterBearing - 90) * Math.PI / 180;
// Design frame: x follows the southeast booster baseline, z points to the southwest mast.
export const at = (x,y,z) => [x*Math.cos(angle)-z*Math.sin(angle), y, x*Math.sin(angle)+z*Math.cos(angle)];
export function parts(b, near) {
  const seg = near ? 48 : 20;
  const mastShift=SPEC.mastCenterZ-10.5, mastFront=SPEC.mastCenterZ-SPEC.mastDepth/2;
  const box = (m,x,y,z,w,h,d) => b.box(m,at(x,y,z),[w,h,d],-angle);
  const surfaceBox=(m,dx,y,side,cx,cz,r,w,h,d=.18)=>{
    const t=Math.asin(dx/r),theta=side>0?t:Math.PI-t;
    b.box(m,at(cx+dx,y,cz+side*r*Math.cos(t)),[w,h,d],theta-angle);
  };
  const bar = (m,a,c,w,d=w) => b.bar(m,at(...a),at(...c),w,d);
  function lathe(m, profile, x=0,z=0,n=seg) {
    const g = new THREE.LatheGeometry(profile.map(([r,y])=>new THREE.Vector2(r,y)),n);
    g.translate(x,0,z); g.rotateY(-angle); b.put(g,m);
  }
  const drum=(m,x,z,r,a,c)=>lathe(m,[[0,a],[r,a],[r,c],[0,c]],x,z);
  // Compact plinths, not a park-sized ground plate. Base is just above grade.
  drum('metal',0,0,2.68,0,0.38);
  for (const [x,z] of [[4.55,-.34],[-4.67,-.18]]) drum('metal',x,z,1.64,0,.38);
  // Main Vulcain nozzle: open throat and a thick lip; green equipment pods flank it.
  lathe('metal',[[1.12,.38],[1.28,.55],[.65,2.6],[.55,3.0],[.43,3.0],[.52,2.6],[1.1,.55],[1.12,.38]]);
  lathe('white',[[1.67,1.1],[1.8,1.1],[2.7,4.1]]);
  lathe('ivory',[[2.7,4.1],[2.7,31.4]]);
  // The ogival fairing has a full cylinder below a smooth pointed shoulder, not a cone.
  lathe('white',[[2.7,31.4],[2.7,45.1],[2.67,46.1],[2.53,47.2],[2.31,48.3],[1.99,49.4],[1.55,50.5],[1.02,51.6],[.48,52.5],[0,53]]);
  for(const x of [-1.75,1.75]) {
    drum('green',x,0,.56,1.5,3.3);
    bar('metal',[x,1.6,0],[x*.7,4.8,0],.16);
  }
  for(const x of [-1.95,1.95]) for(const z of [-1.2,1.2]) bar('white',[x,.38,z],[x*.9,5.1,z*.9],.23);
  // Thermal cladding patch rhythm: slightly proud curved quads, no textures or coplanar panels.
  if(near) for(let row=0;row<13;row++) for(let col=0;col<24;col++) {
    if((col+row*3)%5!==0) continue;
    const a=col*Math.PI/12, w=Math.PI/12*.88, y=6.4+row*1.84;
    const g=new THREE.LatheGeometry([new THREE.Vector2(2.765,y),new THREE.Vector2(2.765,y+1.7)],2,a,w);
    g.rotateY(-angle);b.put(g,(row+col)%3===0?'white':'ivory');
  }
  // Boosters: circular base, nozzle, white motor case, characteristic flange joints and conical noses.
  for (const [x,z] of [[4.55,-.34],[-4.67,-.18]]) {
    drum('white',x,z,1.4,.38,1.15);
    lathe('white',[[.85,2.3],[.95,2.3],[1.7,5.6],[1.525,5.8],[1.525,26.5]],x,z);
    lathe('metal',[[1.17,1.15],[1.26,1.35],[.65,3.3],[.55,3.3],[1.09,1.4],[1.17,1.15]],x,z);
    lathe('white',[[1.525,26.5],[1.5,27.2],[1.37,28.1],[1.05,29.4],[.68,30.7],[.3,31.65],[0,32.3]],x,z);
    for(const y of [5.65,11.9,18.8,25.9,26.55]) {
      lathe('metal',[[1.525,y-.06],[1.59,y-.06],[1.59,y+.06],[1.525,y+.06]],x,z);
    }
    // Tie rods physically connect the cases to the core at the attachment levels.
    const s=Math.sign(x);
    for(const y of [6.3,25.4]) bar('ivory',[s*2.45,y,z],[x-s*1.38,y,z],.25);
    if(near) {
      for(let i=0;i<12;i++) {
        const t=i*Math.PI/6;
        bar('white',[x+1.06*Math.sin(t),2.8,z+1.06*Math.cos(t)],[x+1.68*Math.sin(t),5.6,z+1.68*Math.cos(t)],.08);
      }
      // Raised longitudinal cable conduit on the outward face.
      bar('white',[x+s*1.5,5.8,z],[x+s*1.5,26,z],.13,.18);
    }
    // ESA/CNES blue marks and compact grids of European flags on both readable sides.
    for(const side of [-1,1]) {
      const face=z+side*1.58;
      for(const y of [8.2,22.3]) surfaceBox('blue',0,y,side,x,z,1.565,.53,.65,.20);
      for(const base of [16.9,24.2]) for(let row=0;row<4;row++) for(let col=0;col<3;col++) {
        const mat=['blue','red','gold','green'][(row+col)%4];
        surfaceBox(mat,(col-1)*.33,base-row*.37,side,x,z,1.565,.25,.24,.20);
      }
    }
  }
  // Full-height mapped umbilical mast: rectangular slab, open slender ties, splayed sloping foot.
  const mast=new THREE.BoxGeometry(SPEC.mastWidth,49,SPEC.mastDepth);
  const mi=Array.from(mast.index.array);mast.setIndex([...mi.slice(0,18),...mi.slice(24)]); // omit hidden grade face
  mast.rotateY(-angle);mast.translate(...at(-.22,24.5,SPEC.mastCenterZ));b.put(mast,'tan');
  // Buttress extruded along x. Its slope ends against the mast at y=17.
  const verts=[[-4.1,0,9.53],[4.35,0,9.53],[4.35,0,14.18],[-4.1,0,14.18],[-2.02,17,9.3],[1.58,17,9.3],[1.58,17,10.5],[-2.02,17,10.5]];
  const faces=[0,2,1,0,3,2,4,5,6,4,6,7,0,1,5,0,5,4,1,2,6,1,6,5,2,3,7,2,7,6,3,0,4,3,4,7];
  const wedge=new THREE.BufferGeometry();wedge.setAttribute('position',new THREE.Float32BufferAttribute(verts.map(([x,y,z])=>[x,y,z+mastShift]).flat(),3));wedge.setIndex(faces.slice(6).flatMap((v,i)=>i%3===0?[faces[i+6],faces[i+8],faces[i+7]]:[]));wedge.computeVertexNormals();wedge.rotateY(-angle);b.put(wedge,'tan');
  for(const y of [17,32.2,43.5]) bar('metal',[-.22,y,mastFront+.08],[-.22,y,2.65],.26);
  if(near) {
    // Mast seams and small top lightning points; landing panels set clear of its broad face.
    for(const y of [10,17,24,31,38,45]) box('ivory',-.22,y,mastFront-.02,3.54,.07,.10);
    for(const x of [-1.45,1.0]) bar('metal',[x,49,SPEC.mastCenterZ],[x,49.6,SPEC.mastCenterZ],.07);
    for(let i=0;i<14;i++) {
      const y=.4+i*.24; box('metal',2.3,y,13.6-i*.18+mastShift,.9,.12,.28);
    }
    // Landing and side rail at the mast's base, touching the buttress.
    bar('metal',[2.24,.1,13.6+mastShift],[2.24,3.8,11.7+mastShift],.07);
    bar('metal',[3.55,.1,13.6+mastShift],[3.55,3.8,11.7+mastShift],.07);
  }
  // Local-language fairing title as original small geometric stencil strokes.
  const letters={C:['111','100','100','100','111'],I:['111','010','010','010','111'],T:['111','010','010','010','010'],E:['111','100','110','100','111'],D:['110','101','101','101','110'],L:['100','100','100','100','111'],S:['111','100','111','001','111'],P:['110','101','110','100','100'],A:['010','101','111','101','101']};
  if(near) for(const [title,y] of [['CITE',41.9],['DE',40.6],["L'ESPACE",39.3]]) {
    const step=.105, width=title.length*4*step;
    [...title].forEach((c,i)=>{if(c==="'"){surfaceBox('blue',width/2-i*4*step,y,-1,0,0,2.74,.07,.18,.20);return;}
      letters[c]?.forEach((row,j)=>[...row].forEach((v,k)=>{if(v==='1')surfaceBox('blue',width/2-i*4*step-k*step,y-j*step,-1,0,0,2.74,.086,.086,.20);}));
    });
  }
  // Blue orbit/device marks are geometry rings, not photographic decals.
  for(const side of [-1,1]) {
    const g=new THREE.TorusGeometry(.7,.10,near?6:4,near?28:12);g.scale(1.25,.75,1);g.rotateZ(.3);const pos=g.attributes.position;
    for(let i=0;i<pos.count;i++)pos.setZ(i,side*(Math.sqrt(2.7**2-pos.getX(i)**2)+.025)+pos.getZ(i));
    g.computeVertexNormals();g.translate(0,37.5,0);g.rotateY(-angle);b.put(g,'blue');
    surfaceBox('blue',0,33.6,side,0,0,2.73,.8,.28,.22);
  }
}
