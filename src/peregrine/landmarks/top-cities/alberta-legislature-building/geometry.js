import * as THREE from 'three';
import { assetBuilder } from '../../asset-geometry.js';
import { lngToMercX, latToMercY, mercStretch } from '../../../facade/geo.js';
import { SPEC, PALETTES } from './config.js';
import { FOOTPRINTS } from './footprint.js';

// Original parametric Beaux-Arts architecture; mapped perimeter is geographic data.
export function create({ detail = 'near' } = {}) {
  const near = detail === 'near', seg = near ? 32 : 16;
  const b = assetBuilder({ ...SPEC, palette: PALETTES.light }, detail);
  const rotation = SPEC.rotationDeg * Math.PI / 180;
  // Discard downward caps at stacked architectural joints. Their upward support face remains.
  const withoutBottom = (g) => {
    const n=g.attributes.normal,idx=g.index?.array??Array.from({length:g.attributes.position.count},(_,i)=>i),keep=[];
    for(let i=0;i<idx.length;i+=3)if(!(n.getY(idx[i])<-.99 && n.getY(idx[i+1])<-.99 && n.getY(idx[i+2])<-.99))keep.push(idx[i],idx[i+1],idx[i+2]);
    const remap=new Map(),pos=[],norm=[],compact=[],p=g.attributes.position;
    for(const j of keep){if(!remap.has(j)){remap.set(j,remap.size);pos.push(p.getX(j),p.getY(j),p.getZ(j));norm.push(n.getX(j),n.getY(j),n.getZ(j));}compact.push(remap.get(j));}
    g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setAttribute('normal',new THREE.Float32BufferAttribute(norm,3));g.deleteAttribute('uv');g.setIndex(compact);return g;
  };
  const put = (g, m) => { g.rotateY(rotation); b.put(g, m); };
  const box = (m, x, y, z, w, h, d, a = 0) => {
    const g = new THREE.BoxGeometry(w,h,d); g.rotateY(a); g.translate(x,y,z); put(g,m);
  };
  const bar = (m, a, c, w, d=w) => {
    const av=new THREE.Vector3(...a), cv=new THREE.Vector3(...c), v=cv.clone().sub(av);
    const g=new THREE.BoxGeometry(w,v.length(),d);
    g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0),v.normalize()));
    g.translate(...av.add(cv).multiplyScalar(.5).toArray()); put(g,m);
  };
  const cylinder = (m,x,z,y0,y1,r0,r1=r0,n=near?10:5) => {
    const g=new THREE.CylinderGeometry(r1,r0,y1-y0,n,1);g.translate(x,(y0+y1)/2,z);put(withoutBottom(g),m);
  };
  const lathe = (m,x,z,profile,n=seg) => {
    const g=new THREE.LatheGeometry(profile.map(([r,y])=>new THREE.Vector2(r,y)),n);g.translate(x,0,z);put(g,m);
  };
  const k=mercStretch(SPEC.origin[1]), ox=lngToMercX(SPEC.origin[0]), oz=-latToMercY(SPEC.origin[1]);
  // Unrotate the mapped outline so repeated facades and mapped mass share one baked frame.
  const plan=FOOTPRINTS[0].slice(0,-1).map(([lon,lat])=>{
    const x=(lngToMercX(lon)-ox)/k,z=(-latToMercY(lat)-oz)/k;
    return [x*Math.cos(rotation)-z*Math.sin(rotation),x*Math.sin(rotation)+z*Math.cos(rotation)];
  });
  const body=plan.map(([x,z])=>[x,z < -14 && Math.abs(x)<14 ? -14 : z]);
  const extrusion = (m,ring,y,h,scale=1,hole=false) => {
    // Constant-width plan offset: radial scaling would leave trim coplanar at inner T corners.
    const area=ring.reduce((sum,[x,z],i)=>{const [nx,nz]=ring[(i+1)%ring.length];return sum+x*nz-nx*z;},0);
    const pad=(scale-1)*35;
    const points=ring.map(([x,z],i)=>{
      const [px,pz]=ring[(i+ring.length-1)%ring.length],[nx,nz]=ring[(i+1)%ring.length];
      const normal=(dx,dz)=>{const l=Math.hypot(dx,dz)||1;return area>0?[dz/l,-dx/l]:[-dz/l,dx/l];};
      const a=normal(x-px,z-pz),c=normal(nx-x,nz-z),den=Math.max(.25,1+a[0]*c[0]+a[1]*c[1]);
      return new THREE.Vector2(x+pad*(a[0]+c[0])/den,-z-pad*(a[1]+c[1])/den);
    });
    const s=new THREE.Shape(points);
    if(hole) s.holes.push(new THREE.Path(ring.map(([x,z])=>new THREE.Vector2(x,-z)).reverse()));
    const g=new THREE.ExtrudeGeometry(s,{depth:h,bevelEnabled:false,curveSegments:near?12:4,steps:1});
    g.rotateX(-Math.PI/2);g.translate(0,y,0);put(y>0?withoutBottom(g):g,m);
  };
  extrusion('granite',plan,0,3.4);
  extrusion('stone',body,3.4,18.0);
  extrusion('trim',body,21.4,.65,1.009);
  extrusion('roof',body,22.05,.18,.998);
  extrusion('trim',body,22.05,1.1,1.007,true);
  extrusion('trim',body,3.4,.28,1.005);
  extrusion('trim',body,8.4,.26,1.003);
  extrusion('trim',body,19.95,.35,1.006);

  // Facade frame: u along wall, q positive outward; x/z transformed from the normal.
  function facade(cx,cz,a) {
    // Project every low facade element onto the actual mapped wall, including its slight skew.
    // Nearby q intersections only: ornaments on the round drum never use this wall projection.
    const edgeQ=(u)=>{
      const x=cx+u*Math.cos(a),z=cz-u*Math.sin(a),nx=Math.sin(a),nz=Math.cos(a),qs=[];
      for(let i=0;i<body.length;i++){
        const [ax,az]=body[i], [bx,bz]=body[(i+1)%body.length],dx=bx-ax,dz=bz-az;
        const den=nx*dz-nz*dx;if(Math.abs(den)<1e-8)continue;
        const q=((ax-x)*dz-(az-z)*dx)/den;
        const t=((ax-x)*nz-(az-z)*nx)/den;
        if(t>=0 && t<=1 && Math.abs(q)<1.8)qs.push(q);
      }
      return qs.length?qs.sort((v,w)=>Math.abs(v)-Math.abs(w))[0]:0;
    };
    const p=(u,y,q)=>{const v=q+(y<22?edgeQ(u):0);return [cx+u*Math.cos(a)+v*Math.sin(a),y,cz-u*Math.sin(a)+v*Math.cos(a)];};
    const rect=(m,u,y,q,w,h,d=.13)=>{const g=new THREE.PlaneGeometry(w,h,1,1);g.rotateY(a);g.translate(...p(u,y,q+d/2));put(g,m);};
    const arch=(m,u,y,q,w,h)=>{
      const r=w/2, spring=h-r, s=new THREE.Shape();s.moveTo(-r,0);s.lineTo(r,0);s.lineTo(r,spring);
      s.absarc(0,spring,r,0,Math.PI,false);s.lineTo(-r,0);
      const g=new THREE.ShapeGeometry(s,near?10:4);g.rotateY(a);g.translate(...p(u,y,q));put(g,m);
    };
    const archTrim=(u,y,q,w,h,t=.18)=>{
      const r=w/2, spring=h-r;
      rect('trim',u-r-t/2,y+spring/2,q,t,spring);
      rect('trim',u+r+t/2,y+spring/2,q,t,spring);
      const n=near?12:4;
      for(let i=0;i<n;i++){
        const a0=i*Math.PI/n,a1=(i+1)*Math.PI/n;
        bar('trim',p(u+(r+t/2)*Math.cos(a0),y+spring+(r+t/2)*Math.sin(a0),q),p(u+(r+t/2)*Math.cos(a1),y+spring+(r+t/2)*Math.sin(a1),q),t,.18);
      }
      rect('trim',u,y-.12,q,w+.4,.2,.28);
    };
    function window(u,y,w,h,arched=false,lit=false){
      if(arched)arch(lit?'light':'glass',u,y,.075,w,h);
      else rect(lit?'light':'glass',u,y+h/2,.075,w,h,.035);
      if(near){
        if(arched)archTrim(u,y,.16,w,h);
        else {
          rect('trim',u,y+h+.1,.13,w+.46,.3,.21);
          rect('trim',u-w/2-.12,y+h/2,.13,.18,h,.16);
          rect('trim',u+w/2+.12,y+h/2,.13,.18,h,.16);
          rect('trim',u,y-.1,.13,w+.48,.23,.3);
        }
        rect('trim',u,y+h/2,.19,.09,h,.1);
        rect('trim',u,y+h*.46,.19,w,.09,.1);
        if(h>3)rect('trim',u,y+h*.72,.19,w,.09,.1);
      }
    }
    function rhythm(us){
      for(const [i,u] of us.entries()){
        window(u,1.15,1.5,1.25);
        window(u,4.7,1.7,3.1,true,i%3===0);
        window(u,10.1,1.65,3.25,false,i%4===0);
        window(u,15.4,1.65,3.25);
        if(near)rect('trim',u,20.92,.15,1.3,.42,.22);
      }
      if(near) for(let y=.6;y<8.2;y+=.75)rect('granite',0,y,.015,Math.max(...us)-Math.min(...us)+3,.055,.035);
    }
    return {p,rect,arch,archTrim,window,rhythm};
  }
  // North wings: five bays on each inner wing and four in the projecting end pavilions.
  for(const sign of [-1,1]){
    const f=facade(sign<0?-22.7:21.8,-13.25,Math.PI);
    f.rhythm([-7,-3.5,0,3.5,7]);
    const end=facade(sign<0?-39.6:38.7,-15.2,Math.PI);
    end.rhythm([-5.4,-1.8,1.8,5.4]);
    for(const u of [-7.1,7.1])end.rect('trim',u,12.7,.13,.64,15.2,.28);
    // Rear wings have shorter inner elevations because the chamber stem projects south.
    facade(sign<0?-22.5:21.8,5.05,0).rhythm([-6.8,-3.4,0,3.4,6.8]);
    facade(sign<0?-39.2:38.7,12.5,0).rhythm([-5.4,-1.8,1.8,5.4]);
  }
  facade(-52,-1.7,-Math.PI/2).rhythm([-4.1,0,4.1]);
  facade(50.4,-1.5,Math.PI/2).rhythm([-4.1,0,4.1]);
  // Stem sides: stepped wall faces from the surveyed T-plan.
  facade(-13.05,15.6,-Math.PI/2).rhythm([-7,-3.5,0,3.5,7]);
  facade(10.4,17.6,Math.PI/2).rhythm([-5.2,-1.7,1.7,5.2]);
  facade(-15.0,35.6,-Math.PI/2).rhythm([-7,-3.5,0,3.5,7]);
  facade(14.1,34.8,Math.PI/2).rhythm([-7,-3.5,0,3.5,7]);
  facade(-.6,53.05,0).rhythm([-7,-3.5,0,3.5,7]);

  // Raised entrance: basement footprint becomes the stylobate, stairs stop at its wall.
  for(let i=0;i<10;i++)box('granite',-.7,(i+1)*.17,-29.0+i*.47,22,(i+1)*.34,.48);
  box('trim',-.7,3.1,-23,24,.7,2);
  const entrance=facade(-.7,-14.06,Math.PI);
  for(const u of [-7,-2.3,2.3,7]){
    entrance.window(u,3.7,1.9,3.5,true,true);
    entrance.window(u,9.4,2.0,4.3,false,true);
    entrance.window(u,15.6,2.0,4.3);
    if(near)entrance.archTrim(u,9.4,.15,2,4.3);
  }
  const cols=[-10.4,-6.2,-2.1,2.1,6.2,10.4];
  for(const x of cols){
    cylinder('trim',x-.7,-22.45,3.4,3.95,.95);
    cylinder('trim',x-.7,-22.45,3.95,4.3,.78,.69);
    cylinder('trim',x-.7,-22.45,4.3,21.7,.69,.56,near?12:6);
    cylinder('trim',x-.7,-22.45,21.7,22.35,.76);
    box('trim',x-.7,22.5,-22.45,1.85,.4,1.85);
    if(near){
      // Abstract Corinthian capital scrolls and collars, still connected to the shaft.
      for(const sx of [-1,1])for(const sz of [-1,1])cylinder('trim',x-.7+sx*.51,-22.45+sz*.51,21.95,22.38,.23,.27,6);
      for(let a=0;a<12;a++){
        const theta=a*Math.PI/6;
        bar('stone',[x-.7+.68*Math.sin(theta),4.6,-22.45+.68*Math.cos(theta)],[x-.7+.555*Math.sin(theta),21.4,-22.45+.555*Math.cos(theta)],.042,.04);
      }
    }
  }
  box('trim',-.7,23.08,-19.2,26.4,.76,8.4);
  box('stone',-.7,23.78,-19.2,25.7,.64,7.9);
  box('trim',-.7,24.35,-19.2,27,.5,8.6);
  if(near)for(let x=-13;x<12.5;x+=.86)box('trim',x,22.9,-23.5,.35,.32,.4);
  // Triangular pediment prism, front north; extrude with correct outward winding.
  const ps=new THREE.Shape();ps.moveTo(-14,24.6);ps.lineTo(12.6,24.6);ps.lineTo(-.7,29);ps.closePath();
  const pg=new THREE.ExtrudeGeometry(ps,{depth:8.2,bevelEnabled:false});pg.translate(0,0,-23.5);put(pg,'stone');
  for(const sg of [-1,1])bar('trim',[-.7,29.1,-23.66],[-.7+sg*13.7,24.55,-23.66],.4,.38);
  box('trim',-.7,24.72,-23.66,27.8,.32,.38);
  if(near){
    // Heraldic relief: an abstract central shield and scrollwork rather than an invented inscription.
    box('trim',-.7,26.2,-23.6,1.4,1.9,.35);
    for(const sg of [-1,1])bar('trim',[-.7+sg*.7,26.9,-23.7],[-.7+sg*2,25.5,-23.7],.28,.28);
  }

  // Rotunda attic, balustrade, octagonal drum with paired external columns and tall arched lights.
  cylinder('stone',-1,-1,22,26.3,11.0,10.9,8);
  cylinder('trim',-1,-1,26.3,26.9,11.5,11.5,seg);
  cylinder('stone',-1,-1,26.9,35.9,8.45,8.45,seg);
  for(let i=0;i<8;i++){
    const a=i*Math.PI/4;
    const f=facade(-1+8.48*Math.sin(a),-1+8.48*Math.cos(a),a);
    f.arch('light',0,28.2,.09,2.0,6.1);f.archTrim(0,28.2,.18,2,6.1,.22);
    if(near){f.rect('trim',0,31,.21,.12,5.5); for(const y of [29.5,31,32.5])f.rect('trim',0,y,.21,1.9,.11);}
    for(const delta of [-.14,.14]){
      const theta=a+Math.PI/8+delta, x=-1+9.45*Math.sin(theta),z=-1+9.45*Math.cos(theta);
      cylinder('trim',x,z,27,27.45,.53);
      cylinder('trim',x,z,27.45,34.8,.38,.31);
      cylinder('trim',x,z,34.8,35.3,.53);
    }
    if(near){
      const theta=a+Math.PI/8;
      cylinder('trim',-1+10.8*Math.sin(theta),-1+10.8*Math.cos(theta),27,27.8,.29,.17,8);
      cylinder('trim',-1+10.8*Math.sin(theta),-1+10.8*Math.cos(theta),27.8,28.1,.32,.05,8);
    }
  }
  cylinder('trim',-1,-1,35.3,36.0,10.0,10.7,seg);
  cylinder('terra',-1,-1,36.0,36.5,10.7,10.6,seg);
  const profile=[[0,36.5],[10.6,36.5],[10.4,38],[9.8,40],[8.7,42],[7.0,44],[4.9,45.7],[2.5,46.8],[0,46.8]];
  lathe('terra',-1,-1,profile);
  for(let i=0;i<8;i++){
    const a=i*Math.PI/4+Math.PI/8;
    for(let j=1;j<profile.length-2;j++){
      const [r,y]=profile[j], [r1,y1]=profile[j+1];
      bar('trim',[-1+(r+.12)*Math.sin(a),y,-1+(r+.12)*Math.cos(a)],[-1+(r1+.12)*Math.sin(a),y1,-1+(r1+.12)*Math.cos(a)],j<4?.42:.3,.26);
    }
    const f=facade(-1+10.65*Math.sin(i*Math.PI/4),-1+10.65*Math.cos(i*Math.PI/4),i*Math.PI/4);
    // Eight oculi and scrolling springing reliefs around the crown band.
    const g=new THREE.TorusGeometry(.51,.13,near?6:4,near?12:6);g.rotateY(i*Math.PI/4);g.translate(...f.p(0,37.3,.13));put(g,'trim');
    if(near){f.rect('glass',0,37.3,.08,.64,.68,.03); for(const sg of [-1,1])bar('trim',f.p(sg*.9,36.5,.22),f.p(sg*1.55,37.9,.22),.22,.2);}
  }
  // Eight broad scallops dress the dome springing. The continuous skirt and its
  // rounded wave moulding survive far LOD; top returns meet the original shell.
  const skirtN=near?128:64,skirtPos=[],skirtIdx=[],wave=[];
  const domeRadius=y=>y<=36.5?10.6:10.6-(y-36.5)*(0.2/1.5);
  for(let i=0;i<=skirtN;i++){
    const a=i*Math.PI*2/skirtN,y=37.0+Math.cos(8*a),top=38.2;
    const xyz=(r,h)=>[-1+r*Math.sin(a),h,-1+r*Math.cos(a)];
    skirtPos.push(...xyz(domeRadius(y)+.12,y),...xyz(domeRadius(top)+.12,top),...xyz(domeRadius(top)-.015,top));
    wave.push(new THREE.Vector3(...xyz(domeRadius(y)+.12,y)));
    if(i){const k=(i-1)*3,j=i*3;skirtIdx.push(k,j,k+1,j,j+1,k+1,k+1,j+1,k+2,j+1,j+2,k+2);}
  }
  const skirt=new THREE.BufferGeometry();skirt.setAttribute('position',new THREE.Float32BufferAttribute(skirtPos,3));skirt.setIndex(skirtIdx);skirt.computeVertexNormals();put(skirt,'terra');
  const wavePath=new THREE.CatmullRomCurve3(wave.slice(0,-1),true,'centripetal');
  put(new THREE.TubeGeometry(wavePath,skirtN,.17,near?6:4,true),'trim');
  lathe('trim',-1,-1,[[0,46.6],[2.65,46.6],[2.65,46.95],[2.9,46.95],[2.9,47.22],[2.6,47.22],[2.6,47.55],[0,47.55]],seg);
  // Open lantern: no opaque central cylinder. Its columns and rings remain in far.
  for(let i=0;i<8;i++){
    const a=i*Math.PI/4;
    const x=-1+1.9*Math.sin(a),z=-1+1.9*Math.cos(a);
    cylinder('terra',x,z,47.55,52.2,.36,.30,near?8:4);
    for(const delta of [-.16,.16])cylinder('terra',-1+1.9*Math.sin(a+delta),-1+1.9*Math.cos(a+delta),47.55,52.2,.14,.12,near?6:4);
    cylinder('trim',x,z,47.55,47.85,.48,.4,near?8:4);
    cylinder('trim',x,z,52.2,52.85,.48,.55,near?8:4);
  }
  lathe('trim',-1,-1,[[0,52.85],[2.6,52.85],[2.6,53.02],[2.95,53.02],[2.95,53.25],[2.75,53.25],[2.75,53.5],[2.4,53.5],[0,53.5]],seg);
  for(let i=0;i<8;i++){const a=i*Math.PI/4;cylinder('trim',-1+2.0*Math.sin(a),-1+2.0*Math.cos(a),53.4,54.15,.18,.07,near?6:4);}
  lathe('terra',-1,-1,[[0,53.4],[2.4,53.4],[2.25,54.0],[1.8,54.8],[.9,55.4],[.2,55.7],[0,55.7]],seg);
  cylinder('metal',-1,-1,55.6,56.8,.14,.09,near?8:4);
  cylinder('trim',-1,-1,56.8,57,.21,.02,near?8:4);
  // Rear chamber saucer dome: mapped radius 10.5 m, rises 7 m above roof.
  cylinder('stone',-1.2,35.4,22.15,23.4,10.3,10.3,seg);
  lathe('terra',-1.2,35.4,[[0,23.4],[10.4,23.4],[9.7,25],[7.6,26.5],[4.4,27.6],[1.5,28],[0,28]],seg);
  cylinder('trim',-1.2,35.4,28,28.5,1.5,1.35,seg);
  cylinder('terra',-1.2,35.4,28.5,29.2,1.35,.02,seg);
  if(near){
    for(let i=0;i<12;i++){
      const a=i*Math.PI/6;
      for(const [r0,y0,r1,y1] of [[10.4,23.4,9.7,25],[9.7,25,7.6,26.5],[7.6,26.5,4.4,27.6],[4.4,27.6,1.5,28]])bar('trim',[-1.2+(r0+.07)*Math.sin(a),y0,35.4+(r0+.07)*Math.cos(a)],[-1.2+(r1+.07)*Math.sin(a),y1,35.4+(r1+.07)*Math.cos(a)],.17,.15);
    }
    // Rooftop balustrade over portico and parapet rhythm without per-element draws.
    for(let i=0;i<64;i++){
      const a=i*Math.PI/32;
      cylinder('trim',-1+11.05*Math.sin(a),-1+11.05*Math.cos(a),26.9,28,.115,.115,6);
    }
    lathe('trim',-1,-1,[[10.85,28],[11.25,28],[11.25,28.2],[10.85,28.2],[10.85,28]],seg);
  }
  return b.finish();
}
