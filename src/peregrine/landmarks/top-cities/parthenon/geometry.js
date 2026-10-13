import * as THREE from 'three';
import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';

// Plan +x points to the east porch; +z to the damaged south colonnade.
export const plan = (x,y,z) => new THREE.Vector3(x,y,z).applyAxisAngle(new THREE.Vector3(0,1,0), SPEC.rotation).toArray();
export function create({ detail = 'near' } = {}) {
  const near = detail === 'near', b = assetBuilder({ ...SPEC, palette: PALETTES.light }, detail);
  const put = g => { g.rotateY(SPEC.rotation); b.put(g, 'marble'); };
  const faceNames = ['east','west','top','bottom','south','north'];
  function box(x0,x1,y0,y1,z0,z1,omit=[]) {
    const g = new THREE.BoxGeometry(x1-x0,y1-y0,z1-z0);
    g.setIndex([...g.index.array].filter((_,i)=>!omit.includes(faceNames[Math.floor(i/6)])));
    g.translate((x0+x1)/2,(y0+y1)/2,(z0+z1)/2); put(g);
  }
  function turned(x,z,profile,segments=near?20:8) {
    const g=new THREE.LatheGeometry(profile.map(([r,y])=>new THREE.Vector2(r,y)),segments);
    g.translate(x,0,z); put(g);
  }
  // Shallow base course, then the three marble steps; no model of the hill.
  for (const [hx,hz,y0,y1] of [[36.3,16.7,0,.3],[35.95,16.3,.3,.8],[35.35,15.88,.8,1.3],[34.75,15.44,1.3,1.8]])
    box(-hx,hx,y0,y1,-hz,hz,['bottom']);

  function column(x,z,top=12.23,r=.9525,fluted=true,broken=false) {
    const floor=1.8, shaftTop=broken?top:top-.76, n=near&&fluted?60:10, levels=near?4:2;
    const ringCount=near&&fluted?n:n+1;
    const positions=[], indices=[];
    // Twenty shallow concave flutes and entasis; smooth normals retain stone softness.
    for(let j=0;j<=levels;j++) {
      const t=j/levels, radius=r*(1-.22*t+.035*Math.sin(Math.PI*t));
      for(let i=0;i<ringCount;i++) {
        // Duplicate each flute ridge so normals do not smooth away the concavity.
        const a=near&&fluted?2*Math.PI*(Math.floor(i/3)+(i%3)/2)/20:2*Math.PI*i/n;
        const q=near&&fluted&&i%3===1?radius-.085*r/.9525:radius;
        positions.push(x+q*Math.cos(a),floor+(shaftTop-floor)*t,z+q*Math.sin(a));
        if(j&&i&&(!(near&&fluted)||i%3!==0)) {const p=(j-1)*ringCount+i-1,q=j*ringCount+i-1;indices.push(p,q,p+1,p+1,q,q+1);}
      }
    }
    const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));g.setIndex(indices);g.computeVertexNormals();put(g);
    if(broken) {
      const cap=new THREE.CircleGeometry(r*.78,n);cap.rotateX(-Math.PI/2);cap.translate(x,top,z);put(cap);
      return;
    }
    // Echinus and square abacus are integral supports for the architrave.
    turned(x,z,[[r*.78,shaftTop],[r*.83,shaftTop+.13],[r*1.12,top-.29],[r*1.13,top-.24]],near?20:10);
    box(x-r*1.16,x+r*1.16,top-.24,top,z-r*1.16,z+r*1.16,['bottom']);
  }
  // Original 8 × 17 rhythm (46 perimeter positions); three southern shafts are absent.
  // Surviving/damaged south bays derived from dossier ways 386428585–386428636.
  for(const x of [-33.6,33.6]) for(let i=0;i<8;i++) column(x,-14.25+28.5*i/7);
  for(const z of [-14.25,14.25]) for(let i=1;i<16;i++) {
    if(z>0&&i>=9&&i<=11) continue;
    column(-33.6+67.2*i/16,z,z>0&&i===8?11.33:12.23,.9525,true,z>0&&i===8);
  }
  // East pronaos: six positions, two full, three partially restored; west porch survives.
  for(let i=0;i<6;i++) {
    const z=-9.55+19.1*i/5;
    column(-27.4,z,11.5,.78);
    column(27.4,z,[11.5,7.5,5.3,6.2,11.5,10.1][i],.78,true,i!==0&&i!==4);
  }
  // Fragmentary cella: no solid inner block, no imaginary roof or Athena statue.
  for(const z of [-10.4,10.4]) {
    box(-24,-13,1.8,8.0,z-.55,z+.55,['bottom']);
    box(-13,15,1.8,3.25,z-.55,z+.55,['bottom']);
    box(15,23,1.8,9.3,z-.55,z+.55,['bottom']);
    if(near) for(const [x,h] of [[-13.4,6.7],[-11.7,4.8],[13.7,5.7]]) box(x-.6,x+.6,3.25,h,z-.55,z+.55,['bottom']);
  }
  // Portal jambs have a real central void, with a surviving west cross-wall.
  for(const x of [-23.5,22.8]) for(const s of [-1,1])
    box(x-.6,x+.6,1.8,x<0?10.1:8.6,s<0?-9.85:3.2,s<0?-3.2:9.85,['bottom']);
  box(-17.5,-16.4,1.8,4.6,-9.85,9.85,['bottom']);

  function entablature(x0,x1,z0,z1,axis) {
    box(x0,x1,12.23,13.55,z0,z1);
    box(x0,x1,13.55,13.68,z0,z1,['bottom']);
    box(x0,x1,13.68,14.96,z0,z1,['bottom']);
    box(x0-.18,x1+.18,14.96,15.12,z0-.18,z1+.18,['bottom']);
    box(x0-.3,x1+.3,15.12,15.34,z0-.3,z1+.3,['bottom']);
    // Triglyphs: three narrow ribs in near; far retains separate blocks.
    const a0=axis==='x'?x0:z0,a1=axis==='x'?x1:z1,count=Math.round((a1-a0)/2.1);
    for(let i=0;i<=count;i++) {
      const u=a0+.4+(a1-a0-.8)*i/count;
      for(const d of near?[-.30,0,.30]:[0]) {
        const w=near?.12:.42;
        if(axis==='x') {
          const face=z0<0?z0:z1, s=z0<0?-1:1;
          box(u+d-w,u+d+w,13.68,14.91,Math.min(face,face+s*.16),Math.max(face,face+s*.16),[s<0?'south':'north','bottom']);
        } else {
          const face=x0<0?x0:x1,s=x0<0?-1:1;
          box(Math.min(face,face+s*.16),Math.max(face,face+s*.16),13.68,14.91,u+d-w,u+d+w,[s<0?'east':'west','bottom']);
        }
      }
    }
  }
  entablature(-34.7,34.7,-15.1,-13.35,'x');
  // Blast gap; no unsupported beams across the missing south columns.
  entablature(-34.7,-8.4,13.35,15.1,'x');
  entablature(16.8,34.7,13.35,15.1,'x');
  entablature(-34.7,-32.5,-13.35,13.35,'z');
  entablature(32.5,34.7,-13.35,13.35,'z');
  // Closed irregular prisms preserve broken pediments without an intact pitched roof.
  function pediment(x0,x1,profile) {
    const shape=new THREE.Shape(profile.map(([z,y])=>new THREE.Vector2(z,y)));
    const g=new THREE.ExtrudeGeometry(shape,{depth:x1-x0,steps:1,bevelEnabled:false});
    g.rotateY(-Math.PI/2);g.translate(x1,0,0);put(g);
  }
  pediment(-34.65,-33.65,[[-14.9,15.34],[-14.9,15.54],[-11,16.15],[-8,16.6],[-4.6,17.2],[-3.5,16.85],[-2.0,17.75],[0,18.05],[2.8,17.45],[3.5,17.1],[6.8,16.9],[10.1,16.1],[14.9,15.54],[14.9,15.34]]);
  // Eastern tympanum and ridge have vanished; retain supported low corner wings.
  for(const s of [-1,1]) pediment(33.65,34.65,[[s*14.9,15.34],[s*14.9,15.62],[s*10.1,16.42],[s*9.6,16.08],[s*9.6,15.34]]);
  if(near) for(const [x,z,w,h] of [[-30,-14.2,1.2,.25],[-17,-14.2,1.7,.33],[12,-14.2,1.4,.23],[-24,14.2,1.5,.35],[28,14.2,1.1,.28]])
    box(x-w/2,x+w/2,15.34,15.34+h,z-.6,z+.6,['bottom']);
  return b.finish();
}
