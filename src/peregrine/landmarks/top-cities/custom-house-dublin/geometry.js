import * as THREE from 'three';
import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';
import { OUTER, COURTYARDS } from './footprint.js';

// Metric geographic conversion: WGS84 spherical Mercator scale at the anchor.
const R = 6378137, D = Math.PI / 180, K = 1 / Math.cos(SPEC.origin[1] * D);
export const local = ([lng, lat]) => [(lng - SPEC.origin[0]) * D * R / K,
  -(Math.log(Math.tan(Math.PI / 4 + lat * D / 2)) - Math.log(Math.tan(Math.PI / 4 + SPEC.origin[1] * D / 2))) * R / K];
export const DOME = { x: 1.03, z: 25.3, radius: 4.15, base: 18.1, cornice: 29.3, crown: 35.2, top: 40 };
export const PORTICO = { xs: [-5.0, -0.97, 3.06, 7.09], z: 31.0, base: 0.85, shaftTop: 14.3, capitalTop: 14.9 };

export function create({ detail = 'near' } = {}) {
  const near = detail === 'near', n = near ? 24 : 16;
  const b = assetBuilder({ ...SPEC, palette: PALETTES.light }, detail);
  const soups = new Map();
  function tri(mat, a, c, d, normal) {
    if (new THREE.Vector3().crossVectors(new THREE.Vector3().subVectors(new THREE.Vector3(...c),new THREE.Vector3(...a)),new THREE.Vector3().subVectors(new THREE.Vector3(...d),new THREE.Vector3(...a))).dot(new THREE.Vector3(...normal)) < 0) [c,d]=[d,c];
    if (!soups.has(mat)) soups.set(mat, []); soups.get(mat).push(...a,...c,...d);
  }
  function quad(m,a,c,d,e,N) { tri(m,a,c,d,N); tri(m,a,d,e,N); }
  function cylinder(m,x,z,r0,r1,y0,y1,segments=near?12:8) {
    const g = new THREE.CylinderGeometry(r1,r0,y1-y0,segments); g.translate(x,(y0+y1)/2,z); b.put(g,m);
  }
  function lathe(m,x,z,points,segments=n) {
    const g=new THREE.LatheGeometry(points.map(([r,y])=>new THREE.Vector2(r,y)),segments);g.translate(x,0,z);b.put(g,m);
  }
  function sphere(m,x,y,z,r,scale=[1,1,1]) { const g=new THREE.SphereGeometry(r,near?8:5,near?6:4);g.scale(...scale);g.translate(x,y,z);b.put(g,m); }
  function prism(m,pts,y0,y1,holes=[]) {
    const rings=[pts,...holes];
    for(let h=0;h<rings.length;h++) {const ring=rings[h];let area=0;for(let i=0;i<ring.length;i++){const a=ring[i],c=ring[(i+1)%ring.length];area+=a[0]*c[1]-c[0]*a[1];}
      for(let i=0;i<ring.length;i++){let a=ring[i],c=ring[(i+1)%ring.length];const sign=(area>0?1:-1)*(h? -1:1);quad(m,[a[0],y0,a[1]],[c[0],y0,c[1]],[c[0],y1,c[1]],[a[0],y1,a[1]],[(c[1]-a[1])*sign,0,(a[0]-c[0])*sign]);}}
    const vec=pts.map(p=>new THREE.Vector2(...p)), hs=holes.map(r=>r.map(p=>new THREE.Vector2(...p))), flat=[...pts,...holes.flat()];
    for(const ids of THREE.ShapeUtils.triangulateShape(vec,hs)){const q=ids.map(i=>flat[i]);tri(m,...q.map(p=>[p[0],y1,p[1]]),[0,1,0]);tri(m,...q.map(p=>[p[0],y0,p[1]]),[0,-1,0]);}
  }
  // Four outer ranges and the central spine keep the real courtyard voids.
  let outer=OUTER.slice(0,-1).map(local), holes=COURTYARDS.map(r=>r.slice(0,-1).map(local));
  // Recess the central porch rear wall; the mapped frontage is its steps/columns.
  outer.splice(18,4,[9.8,30.7],[9.8,26.1],[-7.6,26.1],[-7.6,30.7]);
  prism('stone',outer,0,15.6,holes);
  // Real two-storey elevation: continuous cornice, low parapet, corner pavilions.
  const rect=(m,x0,x1,z0,z1,y0,y1)=>b.box(m,[(x0+x1)/2,(y0+y1)/2,(z0+z1)/2],[x1-x0,y1-y0,z1-z0]);
  for(const [x0,x1,z0,z1] of [[-55.5,-42,18,31.55],[43.8,59.4,18,31.6],[-19.0,21.2,18.2,30.6],[-55.5,-42,-31.4,-20],[43.8,59.4,-31.4,-20]]) {
    // Central volume stops behind the open porch.
    if(x0===-19.0){rect('stone',x0,x1,z0,25.9,15.55,18);rect('stone',x0,-7.6,25.9,z1,15.55,18);rect('stone',9.8,x1,25.9,z1,15.55,18);}
    else rect('stone',x0,x1,z0,z1,15.55,18.2);
  }
  // Parapet cornices and small baluster silhouettes, all in the stone batch.
  function facade(a,c,bays,front=false,arch=false,fullHeight=15.6) {
    const dx=c[0]-a[0],dz=c[1]-a[1],L=Math.hypot(dx,dz),u=[dx/L,dz/L],N=[-u[1],0,u[0]];
    const q=(t,y,o=0)=>[a[0]+u[0]*t+N[0]*o,y,a[1]+u[1]*t+N[2]*o];
    const off=near?.22:.56;
    // Thin horizontal mouldings; same material as supporting walls, no depth cycle.
    for(const y of [0.55,8.4,15.3,16.9]){
      const g=new THREE.BoxGeometry(L,.32,near?.45:.65);g.rotateY(-Math.atan2(u[1],u[0]));g.translate(...q(L/2,y,.10));b.put(g,'stone');
    }
    if(near)for(let t=.6;t<L;t+=1.5){const p=q(t,16.1);b.box('stone',p,[.18,1.25,.25]);}
    for(let i=0;i<bays;i++) {
      const t=(i+.5)*L/bays, w=front?2.05:1.5;
      if(front && Math.abs(q(t,0)[0]-1.03)<8.7)continue;
      for(const [yb,h] of [[1.15,5.65],[10.05,3.7]]) {
        const arched=arch&&yb<2;
        if(arched){const r=w/2,cy=yb+h-r,shape=[[-r,yb],[r,yb],[r,cy]];for(let j=1;j<=(near?10:5);j++){const an=j*Math.PI/(near?10:5);shape.push([Math.cos(an)*r,cy+Math.sin(an)*r]);}const base=q(t,yb,off);for(let j=1;j<shape.length-1;j++)tri('glass',q(t+shape[0][0],shape[0][1],off),q(t+shape[j][0],shape[j][1],off),q(t+shape[j+1][0],shape[j+1][1],off),N);
          if(near)for(let j=0;j<10;j++){const aa=j*Math.PI/10,bb=(j+1)*Math.PI/10;quad('stone',q(t+Math.cos(aa)*r,cy+Math.sin(aa)*r,.10),q(t+Math.cos(bb)*r,cy+Math.sin(bb)*r,.10),q(t+Math.cos(bb)*(r+.3),cy+Math.sin(bb)*(r+.3),.10),q(t+Math.cos(aa)*(r+.3),cy+Math.sin(aa)*(r+.3),.10),N);}
        } else quad('glass',q(t-w/2,yb,off),q(t+w/2,yb,off),q(t+w/2,yb+h,off),q(t-w/2,yb+h,off),N);
        if(near){ // Sash bars use their own batch strictly in front of glass.
          const vv=(x0,x1,y0,y1)=>quad('frame',q(t+x0,y0,off+.12),q(t+x1,y0,off+.12),q(t+x1,y1,off+.12),q(t+x0,y1,off+.12),N);
          vv(-.045,.045,yb,yb+h-(arched?w/2:0));for(const y of [yb+h/3,yb+2*h/3])vv(-w/2,w/2,y,y+.07);
          if(yb>9&&front){tri('stone',q(t-1.25,yb+h+.5,.16),q(t+1.25,yb+h+.5,.16),q(t,yb+h+1.2,.16),N);}
        }
      }
    }
  }
  // Tall corner-pavilion pilasters frame three bays across both storeys.
  for(const xx of [-55.1,-51.8,-46.1,-42.5,44.2,47.7,55.5,58.5]) {
    rect('stone',xx-.4,xx+.4,31.55,32.05,.6,15.1);
    rect('stone',xx-.62,xx+.62,31.45,32.15,14.6,15.2);
  }
  // Wings: seven arched bays on each side; three tall pavilion bays at ends.
  facade([-42,29.85],[-19,29.85],7,true,true);
  facade([21.2,29.85],[43.8,29.85],7,true,true);
  facade([-55.5,31.6],[-42,31.6],3,true,false);
  facade([43.8,31.6],[59.4,31.6],3,true,false);
  facade([-19,30.7],[-7.6,30.7],2,true,false);facade([9.8,30.7],[21.2,30.7],2,true,false);
  facade([59.4,-31.4],[-55.5,-31.6],25,false,true);
  facade([-55.6,-31.6],[-55.6,-14.1],4,false,true);
  facade([-59.9,-14.1],[-59.9,14.1],7,false,true);
  facade([-55.4,14.1],[-55.4,17.8],1,false,true);
  facade([59,31.5],[59,17.9],3,false,true);
  facade([58.1,14.4],[58.1,-14.3],7,false,true);
  facade([59.5,-18.1],[59.5,-31.4],3,false,true);
  // Courtyard facade rhythm in both LODs.
  for(const ring of holes)for(let i=0;i<ring.length;i++){let a=ring[i],c=ring[(i+1)%ring.length];if(Math.hypot(c[0]-a[0],c[1]-a[1])>7)facade(c,a,Math.max(2,Math.round(Math.hypot(c[0]-a[0],c[1]-a[1])/4)));}
  // Low lead/copper roofs recessed behind parapets, leaving courts open.
  function hip(x0,x1,z0,z1,y=16.0,rise=1.2){const mid=(z0+z1)/2;quad('roof',[x0,y,z0],[x1,y,z0],[x1-2,y+rise,mid],[x0+2,y+rise,mid],[0,1,-1]);quad('roof',[x0,y,z1],[x1,y,z1],[x1-2,y+rise,mid],[x0+2,y+rise,mid],[0,1,1]);tri('roof',[x0,y,z0],[x0,y,z1],[x0+2,y+rise,mid],[-1,1,0]);tri('roof',[x1,y,z0],[x1,y,z1],[x1-2,y+rise,mid],[1,1,0]);}
  hip(-41,-20,18.7,28.6);hip(22,43,18.7,28.6);hip(-54,-43,-20,17);hip(45,58,-20,17);hip(-54,58,-30.5,-23);hip(-18,20,-22,17);
  // Portico with four freestanding Doric columns, shallow platform and gable.
  const steps=near?5:3;
  for(let i=0;i<steps;i++)rect('stone',-7.8,9.9,26.1,32.5-i*.15,i*.85/steps,(i+1)*.85/steps);
  PORTICO.xs.forEach(x=>{lathe('stone',x,PORTICO.z,[[0,.85],[.66,.85],[.66,1.15],[.5,1.4],[.46,14.1],[.65,14.35],[.68,14.7],[0,14.7]],near?12:6);rect('stone',x-.78,x+.78,30.2,31.8,14.7,14.95);});
  rect('stone',-8.1,10.2,25.8,32.1,14.95,16.15);
  prism('stone',[[-8.1,25.8],[10.2,25.8],[10.2,32.1],[-8.1,32.1]],16.15,16.3);
  // Closed triangular pediment solid, with dark tympanum inset and stone raking edges.
  const gable=(m,z,w,y,apex)=>tri(m,[-w+1.03,y,z],[w+1.03,y,z],[1.03,apex,z],[0,0,1]);
  gable('stone',32.1,9.15,16.15,19.4);gable('drum',32.26,7.5,16.55,18.95);
  b.bar('stone',[-8.3,16.2,32.2],[1.03,19.55,32.2],.34,.4);b.bar('stone',[1.03,19.55,32.2],[10.35,16.2,32.2],.34,.4);
  quad('roof',[-8.3,16.5,25.8],[-8.3,16.5,32.1],[1.03,19.55,32.1],[1.03,19.55,25.8],[-1,1,0]);quad('roof',[10.35,16.5,25.8],[10.35,16.5,32.1],[1.03,19.55,32.1],[1.03,19.55,25.8],[1,1,0]);gable('stone',25.8,9.15,16.15,19.4);
  for(const x of [-3,1.03,5.06])rect('glass',x-.65,x+.65,26.42,26.52,.9,6.6);
  // Drum is deliberately darker Ardbraccan stone than the Portland frontage.
  const {x,z}=DOME;
  rect('drum',x-5.6,x+5.6,z-5.6,z+5.6,18,21.4);
  cylinder('drum',x,z,4.45,4.45,21.4,22.25,n);
  cylinder('glass',x,z,3.62,3.62,22.25,28.25,n);
  // Open colonnaded drum: columns stand free of its recessed dark core.
  for(let i=0;i<12;i++){const a=i*Math.PI/6,xx=x+4.05*Math.cos(a),zz=z+4.05*Math.sin(a);lathe('drum',xx,zz,[[0,22.2],[.40,22.2],[.32,22.6],[.28,27.9],[.45,28.2],[.45,28.5],[0,28.5]],near?8:5);}
  cylinder('drum',x,z,4.68,4.68,28.5,29.15,n);
  cylinder('drum',x,z,4.25,4.25,29.15,30.0,n);
  lathe('copper',x,z,[[0,29.9],[4.25,29.9],[4.25,30.5],[4.05,31.8],[3.5,33.2],[2.55,34.4],[1.15,35.15],[.4,35.3],[0,35.3]],n);
  if(near)for(let i=0;i<24;i++){const a=i*Math.PI/12;const pts=[[4.25,30.4],[4.05,31.8],[3.5,33.2],[2.55,34.4],[1.15,35.15]];for(let j=0;j<pts.length-1;j++){const [r,y]=pts[j],[rr,yy]=pts[j+1];b.bar('copper',[x+r*Math.cos(a),y,z+r*Math.sin(a)],[x+rr*Math.cos(a),yy,z+rr*Math.sin(a)],.045,.045);}}
  // Commerce: connected draped torso, two legs, head, raised arm and an anchor.
  cylinder('drum',x,z,.65,.55,35.15,35.65,near?12:8);
  lathe('drum',x,z,[[0,35.6],[.48,35.6],[.5,36.1],[.32,37.1],[.46,38.3],[.24,38.65],[0,38.65]],near?10:6);
  sphere('drum',x,39.05,z,.35,[.83,1.13,.9]);
  b.bar('drum',[x-.34,38.1,z],[x-.7,38.85,z],.18,.22);b.bar('drum',[x-.7,38.85,z],[x-.48,39.9,z],.13,.15);
  sphere('drum',x-.48,39.92,z,.08);
  b.bar('drum',[x+.32,38.2,z],[x+.9,37.65,z],.18,.22);b.bar('drum',[x+.9,37.65,z],[x+.85,36,z+.15],.10,.13);
  b.bar('drum',[x+.25,36,z+.15],[x+1.3,36,z+.15],.12,.12);
  // Roof statues and pedestal groups at the end pavilions, retained far.
  function figure(xx,yy,zz,s=1){rect('stone',xx-.55*s,xx+.55*s,zz-.5*s,zz+.5*s,yy,yy+.5*s);lathe('stone',xx,zz,[[0,yy+.45*s],[.4*s,yy+.45*s],[.25*s,yy+1.2*s],[.34*s,yy+1.8*s],[0,yy+1.9*s]],near?8:5);sphere('stone',xx,yy+2.15*s,zz,.23*s);b.bar('stone',[xx-.2*s,yy+1.7*s,zz],[xx-.55*s,yy+1.0*s,zz],.16*s,.16*s);b.bar('stone',[xx+.2*s,yy+1.7*s,zz],[xx+.6*s,yy+1.15*s,zz],.16*s,.16*s);}
  for(const xx of [-49,52]){figure(xx,18.2,28.9,1.15);if(near){figure(xx-1.45,18.2,28.9,.7);figure(xx+1.45,18.2,28.9,.7);}}
  for(const xx of [-7.4,9.4])figure(xx,18,26.5,.78);
  for(const [m,p] of soups){const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(p,3));g.computeVertexNormals();b.put(g,m);}
  return b.finish();
}
