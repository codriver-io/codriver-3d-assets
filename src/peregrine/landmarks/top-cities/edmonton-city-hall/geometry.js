import * as THREE from 'three';
import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';
import { FOOTPRINTS } from './footprint.js';

// Original metre-space architecture: no external mesh, texture or runtime dependency.
const angle = SPEC.rotationDeg * Math.PI / 180, C = Math.cos(angle), S = Math.sin(angle);
export const world = ([u, y, v]) => [C * u + S * v, y, -S * u + C * v];
export const local = ([x, y, z]) => [C * x - S * z, y, S * x + C * z];
const metre = 111319.49079327358, latScale = Math.cos(SPEC.origin[1] * Math.PI / 180);
export const plan = (ring) => ring.slice(0, -1).map(([lng, lat]) => {
  const [u,,v] = local([(lng - SPEC.origin[0]) * metre * latScale, 0, (SPEC.origin[1] - lat) * metre]);
  return [u, v];
});
export const MAIN_APEX = [-2.65, 43, -10];
export const SMALL_APEX = [-2.65, 30, -43];
export const TOWER = { u0: 20.79, u1: 26.09, v0: 42.23, v1: 47.22, shaft: 48.0, top: 60.96 };

export function create({ detail = 'near' } = {}) {
  const near = detail === 'near', b = assetBuilder({ ...SPEC, palette: PALETTES.light }, detail);
  const put = (g, m) => { g.applyMatrix4(new THREE.Matrix4().makeRotationY(angle)); b.put(g, m); };
  const box = (m, u0, u1, y0, y1, v0, v1) => {
    const g = new THREE.BoxGeometry(u1-u0, y1-y0, v1-v0);
    g.translate((u0+u1)/2,(y0+y1)/2,(v0+v1)/2); put(g,m);
  };
  const polygon = (m, pts, normal) => {
    const vs=pts.map(p=>new THREE.Vector3(...p));
    const n=new THREE.Vector3().crossVectors(vs[1].clone().sub(vs[0]),vs[2].clone().sub(vs[0]));
    const rev=normal && n.dot(new THREE.Vector3(...normal))<0;
    const idx=[]; for(let i=1;i<pts.length-1;i++) idx.push(...(rev?[0,i+1,i]:[0,i,i+1]));
    const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pts.flat(),3));g.setIndex(idx);g.computeVertexNormals();put(g,m);
  };
  const prism = (ring, y0, y1, material) => {
    // Extrude a planar Shape in xy, then map it to metre-space u/up/v.
    const sh = new THREE.Shape(ring.map(([u,v])=>new THREE.Vector2(u,-v)));
    const g = new THREE.ExtrudeGeometry(sh,{depth:y1-y0, bevelEnabled:false,steps:1});
    g.rotateX(-Math.PI/2);g.translate(0,y0,0);put(g,material);
  };
  const strip = (m, A, B, w) => b.bar(m,world(A),world(B),w,w);
  // The mapped west cornice has narrow decorative tabs; trim these to the
  // supported garden-walk wall face instead of exporting loose plates.
  const body=plan(FOOTPRINTS[0]).map(([u,v])=>[v>=23?Math.max(u,-41.13):u,v]);
  prism(body,0,0.22,'stone');
  prism(body,13.8,15,'stone');
  // Most walls are bay grids with true cutouts, rather than glass on a solid box.
  // Quads tile the same plane edge-to-edge; zero coplanar material overlays.
  function wall(A,B,height=13.8,rows=3,glazed=false) {
    const dx=B[0]-A[0], dz=B[1]-A[1], L=Math.hypot(dx,dz), n=[dz/L,0,-dx/L];
    const P=(s,y)=>[A[0]+dx*s/L,y,A[1]+dz*s/L];
    const rect=(m,s0,s1,y0,y1)=>polygon(m,[P(s0,y0),P(s1,y0),P(s1,y1),P(s0,y1)],n);
    const cols=Math.max(1,Math.round(L/(glazed?3.8:3.4))), pitch=L/cols;
    const rowH=(height-0.22)/rows;
    for(let j=0;j<rows;j++) {
      const y0=0.22+j*rowH,y1=y0+rowH;
      const side=glazed?0.12:0.5, sill=glazed?0.12:0.85, head=glazed?0.12:0.65;
      rect('stone',0,L,y0,y0+sill);rect('stone',0,L,y1-head,y1);
      const lo=y0+sill,hi=y1-head;
      for(let i=0;i<=cols;i++) {
        const mid=i*pitch;
        rect('stone',Math.max(0,mid-side),Math.min(L,mid+side),lo,hi);
        if(i===cols)continue;
        const a=mid+side,c=(i+1)*pitch-side;
        if(near) {
          const centre=(a+c)/2;
          rect('glass',a,centre-0.055,lo,hi);rect('metal',centre-0.055,centre+0.055,lo,hi);rect('glass',centre+0.055,c,lo,hi);
        } else rect('glass',a,c,lo,hi);
      }
    }
  }
  // OSM way winding: this ring is clockwise in east/south, so the right normal is outward.
  for(let i=0;i<body.length;i++) {
    const A=body[i],B=body[(i+1)%body.length],v=(A[1]+B[1])/2;
    if(v>20) continue; // the south portico and garden walkway are OPEN below their cornice
    wall(A,B);
  }
  // Glazed city-room walls, recessed behind the double row of monumental square columns.
  wall([14.57,17.25],[-20,17.25],13.8,3,true);
  // The atrium side glazing, visible from the small west courtyard and east approach.
  wall([-20,17.25],[-20,-26.2],13.8,3,true);
  wall([14.57,-26.2],[14.57,17.25],13.8,3,true);
  // Two rows: each column lands on the base and directly supports the continuous roof slab.
  for(const v of [19.9,23.4]) for(let u=-39.7;u<36;u+=6.2) {
    if(v===19.9 && (u < -37 || u > 33)) continue; // mapped cornice has end notches here
    box('trim',u-0.6,u+0.6,0.22,13.8,v-0.65,v+0.65);
  }
  // Covered southwest garden walk: narrower, paired rows of supports under the mapped wing.
  for(const u of [-39.8,-26.5]) for(let v=29;v<=72;v+=7.1)
    box('stone',u-0.55,u+0.55,0.22,13.8,v-0.65,v+0.65);
  // End crosswall: grounded return closes the canopy end, not the open side bays.
  box('stone',-35.0,-30,0.22,13.8,76,80.9);

  // Diamond glazing: a triangular face is tiled in barycentric rhombi. Each
  // pane is surrounded by nonoverlapping frame quads in the SAME surface.
  // Unlike stacked bars, this needs no polygon offsets and cannot depth-cycle.
  function glassFace(A,B,D,N) {
    const A3=new THREE.Vector3(...A),B3=new THREE.Vector3(...B),D3=new THREE.Vector3(...D);
    const n=new THREE.Vector3().crossVectors(B3.clone().sub(A3),D3.clone().sub(A3));
    if(n.y<0) {const t=B; B=D;D=t;}
    const at=(i,j)=>A.map((a,k)=>a+(B[k]-a)*i/N+(D[k]-a)*j/N);
    for(let i=0;i<N;i++)for(let j=0;j<N-i;j++) {
      const outer=[at(i,j),at(i+1,j)];
      if(i+j<N-1)outer.push(at(i+1,j+1));
      outer.push(at(i,j+1));
      const centre=outer[0].map((_,k)=>outer.reduce((s,p)=>s+p[k],0)/outer.length);
      const inset=near?0.055:0.065;
      const inner=outer.map(p=>p.map((v,k)=>centre[k]+(v-centre[k])*(1-inset)));
      polygon('glass',inner,[0,1,0]);
      for(let k=0;k<outer.length;k++)polygon('metal',[outer[k],outer[(k+1)%outer.length],inner[(k+1)%outer.length],inner[k]],[0,1,0]);
    }
  }
  function pyramid(ring,apex,N) {
    for(let i=0;i<ring.length;i++) {
      const A=ring[i],B=ring[(i+1)%ring.length];
      glassFace(apex,[A[0],15,A[1]],[B[0],15,B[1]],N);
    }
  }
  pyramid(plan(FOOTPRINTS[7]),MAIN_APEX,near?18:9);
  pyramid(plan(FOOTPRINTS[8]),SMALL_APEX,near?10:5);
  // Five mapped subsidiary skylights, retained as low gables in both LODs.
  for(let i=2;i<=6;i++) {
    const r=plan(FOOTPRINTS[i]), us=r.map(p=>p[0]),vs=r.map(p=>p[1]);
    const u0=Math.min(...us),u1=Math.max(...us),v0=Math.min(...vs),v1=Math.max(...vs),uc=(u0+u1)/2;
    polygon('glass',[[u0,15,v0],[u0,15,v1],[uc,16.2,v1],[uc,16.2,v0]],[-1,1,0]);
    polygon('glass',[[u1,15,v1],[u1,15,v0],[uc,16.2,v0],[uc,16.2,v1]],[1,1,0]);
    polygon('metal',[[u0,15,v0],[uc,16.2,v0],[u1,15,v0]],[0,0,-1]);
    polygon('metal',[[u1,15,v1],[uc,16.2,v1],[u0,15,v1]],[0,0,1]);
  }

  // Detached Friendship Tower: four corner posts keep the carillon open
  // and legible from every bearing. Each face has two columns by six cells.
  const T=TOWER,uc=(T.u0+T.u1)/2,vc=(T.v0+T.v1)/2;
  box('tower',T.u0,T.u1,0,T.shaft,T.v0,T.v1);
  const us=[T.u0+0.3,T.u1-0.3],vs=[T.v0+0.3,T.v1-0.3];
  const crownY=(u,k)=>T.shaft+0.3+k*2+(u-us[0])/(us[1]-us[0])*0.5;
  for(const u of us)for(const v of vs)
    box('metal',u-0.18,u+0.18,T.shaft,u<uc?60.46:T.top,v-0.18,v+0.18);
  for(let k=0;k<=6;k++) {
    for(const v of vs)strip('metal',[us[0],crownY(us[0],k),v],[us[1],crownY(us[1],k),v],0.24);
    for(const u of us)strip('metal',[u,crownY(u,k),vs[0]],[u,crownY(u,k),vs[1]],0.24);
    if(k===0)continue;
    // Interior transverse bearers terminate at front/back crossbars. Bell
    // crowns meet short hangers; no bell or bearer ends unsupported in space.
    for(const u of [uc-1.05,uc+1.05]) {
      const y=crownY(u,k);
      strip('metal',[u,y,vs[0]],[u,y,vs[1]],0.16);
      for(const v of [vc-1,vc+1]) {
        if(k===6 && u>uc && v>vc)continue; // 23 simplified bell silhouettes
        const g=new THREE.CylinderGeometry(near?0.18:0.22,0.36,0.65,near?8:5);
        g.translate(u,y-0.44,v);put(g,'roof');
        box('metal',u-0.07,u+0.07,y-0.15,y,v-0.07,v+0.07);
      }
    }
  }
  for(const v of vs)strip('metal',[uc,crownY(uc,0),v],[uc,crownY(uc,6),v],0.13);
  for(const u of us)strip('metal',[u,crownY(u,0),vc],[u,crownY(u,6),vc],0.13);
  // Four green diamond clocks, geometrically inlaid faces with projecting hands.
  function clock(u,v,axis,out) {
    const P=(s,y,d)=>axis==='u'?[u+out*d,y,v+s]:[u+s,y,v+out*d];
    const n=axis==='u'?[out,0,0]:[0,0,out];
    const d=0.15,cy=35.5,r=2.5;
    polygon('clock',[P(-r,cy,d),P(0,cy+r,d),P(r,cy,d),P(0,cy-r,d)],n);
    strip('roof',P(0,cy,0.3),P(0.4,cy+1.35,0.3),0.13);
    strip('roof',P(0,cy,0.3),P(-1.2,cy-0.2,0.3),0.13);
  }
  clock(uc,T.v1,'v',1);clock(uc,T.v0,'v',-1);
  clock(T.u1,vc,'u',1);clock(T.u0,vc,'u',-1);
  const root=b.finish();root.userData.description='1992 Edmonton City Hall; twin glazed pyramids, open colonnade, detached four-post box-frame carillon.';
  return root;
}
