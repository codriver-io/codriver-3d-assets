import * as THREE from 'three';
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';
import { polygon, archPoints, openingPoints, prism, facadeMatrix, hipRoof, gableRoof } from './old-orange-county-courthouse-solids.js';

// Authoring x is along the frontage, z towards Santa Ana Boulevard. The small
// OSM skew is baked into every vertex at the end. Current roof, no lost tower.
const PLAN = [[11.23,-9.72],[11.23,-12.77],[21.29,-12.77],[21.29,13.91],
  [11.23,13.91],[11.23,11.26],[-10.82,11.26],[-10.82,14.01],
  [-21.52,14.01],[-21.52,-12.60],[-10.82,-12.60],[-10.82,-9.72],
  [-5.56,-9.72],[-5.56,-14.03],[5.46,-14.03],[5.46,-9.72]];

export function create({ detail = 'near' } = {}) {
  const near = detail === 'near', seg = near ? 8 : 4;
  const b = assetBuilder({ ...SPEC, palette: PALETTES.light }, detail);
  const put = (g,m) => b.put(g,m);
  const box = (m,x0,x1,y0,y1,z0,z1) => b.box(m,[(x0+x1)/2,(y0+y1)/2,(z0+z1)/2],[x1-x0,y1-y0,z1-z0]);
  const roofPut = (g,m) => put(stripCaps(g,(_x,y)=>y<-.9),m);
  const stripCaps = (g,predicate) => {
    if (g.index) g=g.toNonIndexed();
    const p=g.attributes.position,n=g.attributes.normal,out=[],norm=[];
    for(let i=0;i<p.count;i+=3) {
      if(predicate(n.getX(i),n.getY(i),n.getZ(i))) continue;
      for(let j=0;j<3;j++) {out.push(p.getX(i+j),p.getY(i+j),p.getZ(i+j));norm.push(n.getX(i+j),n.getY(i+j),n.getZ(i+j));}
    }
    const h=new THREE.BufferGeometry();h.setAttribute('position',new THREE.Float32BufferAttribute(out,3));h.setAttribute('normal',new THREE.Float32BufferAttribute(norm,3));g.dispose();return h;
  };
  // Continuous granite foundation, not a plaza slab. Shape uses -z as y in
  // its extrusion plane so the +90-degree rotation puts its cap upwards.
  const base=prism(polygon(PLAN.map(([x,z])=>[x,-z])),SPEC.graniteM,SPEC.graniteM);
  base.rotateX(-Math.PI/2); // shape y=-z maps to +z, extrusion maps to +y
  put(stripCaps(base,(_x,y)=>y<-.9),'granite');

  // Detailed facade shells with genuine recessed openings. PLAN is CCW in
  // x/z: reverse the tangent so local +z points out of the building.
  for(let i=0;i<PLAN.length;i++) {
    const p=PLAN[i],q=PLAN[(i+1)%PLAN.length],dx=p[0]-q[0],dz=p[1]-q[1];
    const length=Math.hypot(dx,dz),cx=(p[0]+q[0])/2,cz=(p[1]+q[1])/2;
    const angle=Math.atan2(-dz,dx),M=facadeMatrix(angle,cx,cz);
    const at=(g,m)=>{g.applyMatrix4(M);put(g,m);};
    const wb=(m,s0,s1,y0,y1,d0,d1,dropBack=false)=> {
      let g=new THREE.BoxGeometry(s1-s0,y1-y0,d1-d0);
      g.translate((s0+s1)/2,(y0+y1)/2,(d0+d1)/2);
      if(!near && !['wood','iron'].includes(m))g=stripCaps(g,(_x,_y,z)=>z<.9);
      else if(dropBack)g=stripCaps(g,(_x,_y,z)=>z<-.9);
      else if(m==='trim')g=stripCaps(g,(x)=>Math.abs(x)>.9);
      else if(m==='wood')g=stripCaps(g,(_x,y)=>y<-.9);
      at(g,m);
    };
    const windows=[];
    const win=(c,y,w,h,arch=false,door=false)=>windows.push({c,y,w,h,arch,door});
    const south=Math.cos(angle)>.9,north=Math.cos(angle)<-.9;
    const main=south&&Math.abs(cz-11.26)<.15&&length>20;
    const side=length>25;
    if(main) {
      // Three round portals and five tall central second-storey windows.
      for(const c of [-2.8,0,2.8])win(c,2.76,2.15,4.35,true,true);
      for(const c of [-3.6,-1.8,0,1.8,3.6])win(c,10.05,1.28,3.65,true);
      for(const c0 of [-8.1,8.1])for(const d of [-1.45,0,1.45]) {
        win(c0+d,3.8,d===0?1.45:.84,3.5);
        win(c0+d,10.05,d===0?1.45:.84,3.65);
      }
    } else if(length>8) {
      const groups = side ? [-8.6,0,8.6] : [0];
      for(const c0 of groups)for(const d of [-1.95,0,1.95]) {
        win(c0+d,3.8,1.38,3.5);
        win(c0+d,10.05,1.38,3.65,true);
      }
      // Rear projecting stair block: a broad grouped window on each level.
      if(north&&cz< -13.5)for(const w of windows)w.arch=false;
    } else if(length>3.5) {
      win(0,3.8,1.32,3.5);win(0,10.05,1.32,3.65,true);
    }
    const shape=polygon([[-length/2,2.7],[length/2,2.7],[length/2,15.35],[-length/2,15.35]]);
    for(const w of windows)shape.holes.push(new THREE.Path(openingPoints(w,seg).map(([s,y])=>new THREE.Vector2(s,y))));
    at(stripCaps(prism(shape,.65),(_x,y)=>Math.abs(y)>.9),'sandstone');

    // Plinth, interstorey band, corbel table, deeply profiled eave.
    wb('trim',-length/2-.04,length/2+.04,2.62,2.88,-.20,.18);
    wb('trim',-length/2,length/2,8.6,8.84,-.12,.16);
    wb('sandstone',-length/2,length/2,14.25,14.6,-.1,.2);
    wb('trim',-length/2-.14,length/2+.14,15.05,15.38,-.2,.35);
    wb('trim',-length/2-.25,length/2+.25,15.38,15.62,-.24,.46);
    if(near)for(let s=-length/2+.6;s<length/2-.3;s+=.9) {
      wb('trim',s-.16,s+.16,14.66,15.07,-.1,.28);
      wb('sandstone',s-.12,s+.12,14.48,14.73,-.08,.20);
    }

    for(let wi=0;wi<windows.length;wi++) {
      const w=windows[wi],pts=openingPoints(w,seg);
      // The entry has a 1.3 m recess; ordinary glazing is 0.65 m back.
      const back=w.door?-1.32:-.67;
      const panel=new THREE.ShapeGeometry(polygon(pts));panel.translate(0,0,back);at(panel,w.door?'wood':'glass');
      if(w.door) {
        // Recessed jamb returns and soffit preserve the portal's depth.
        const recess=polygon(pts);
        const shell=prism(recess,.72,-.60);
        at(stripCaps(shell,(_x,_y,z)=>Math.abs(z)>.9),'sandstone');
        wb('wood',w.c-.06,w.c+.06,w.y,w.y+3.1,back,back+.15);
        wb('glass',w.c-.70,w.c+.70,w.y+2.1,w.y+3.1,back+.05,back+.20);
      }
      // Stone sill and lintel, jambs; arched heads have individual voussoirs.
      const r=w.w/2, spring=w.y+w.h-r;
      if(!w.door)wb('trim',w.c-r-.17,w.c+r+.17,w.y-.16,w.y-.03,-.10,.22);
      if(w.arch) {
        const thick=w.door?.34:.20, outer=r+thick;
        for(let k=0;k<seg;k++) {
          const a=k*Math.PI/seg+.007,c=(k+1)*Math.PI/seg-.007;
          const v=[[w.c+r*Math.cos(a),spring+r*Math.sin(a)],[w.c+outer*Math.cos(a),spring+outer*Math.sin(a)],
            [w.c+outer*Math.cos(c),spring+outer*Math.sin(c)],[w.c+r*Math.cos(c),spring+r*Math.sin(c)]];
          const head=near?prism(polygon(v),.23,.20):new THREE.ShapeGeometry(polygon(v)).translate(0,0,.20);
          at(head,'trim');
        }
        for(const d of [-1,1]) {
          const c=w.c+d*(r+thick/2);
          wb('trim',c-thick/2,c+thick/2,w.y,spring,-.08,.16);
          wb('trim',c-thick*.85,c+thick*.85,spring-.18,spring+.06,-.05,.28);
        }
      } else {
        wb('trim',w.c-r-.15,w.c+r+.15,w.y+w.h+.02,w.y+w.h+.27,-.07,.19);
      }
      if(near&&!w.door) {
        for(const d of [-1,1])wb('wood',w.c+d*(r-.06)-.055,w.c+d*(r-.06)+.055,w.y+.06,w.y+w.h-(w.arch?r:0)-.03,-.62,-.23);
        const top=w.y+w.h-(w.arch?r*.88:0);
        wb('wood',w.c-.045,w.c+.045,w.y+.05,top,-.58,-.25);
        for(const y of [w.y+1.65,w.y+w.h-(w.arch?r:0)-.08])wb('wood',w.c-r+.04,w.c+r-.04,y-.045,y+.045,-.57,-.25);
        if(wi%7===2)wb('glow',w.c-r+.15,w.c-.12,w.y+.17,w.y+1.55,-.66,-.55);
      } else if(!near&&!w.door&&wi%7===2) {
        wb('glow',w.c-r+.10,w.c+r-.10,w.y+.1,w.y+w.h-(w.arch?r:0)-.1,-.66,-.55);
      }
    }

    // Rusticated ashlar in relief. Stones that cross an opening or a band
    // are omitted, rather than painting masonry over glass or arch mouths.
    if(near) {
      for(let row=0,y=3.03;y<14.1;y+=.54,row++) {
        if(Math.abs(y-8.7)<.35)continue;
        for(let s=-length/2+(row%2?-.8:0);s<length/2;s+=1.6) {
          const lo=Math.max(s+.04,-length/2+.035),hi=Math.min(s+1.56,length/2-.035);
          if(hi-lo<.16)continue;
          if(windows.some(w=>hi>w.c-w.w/2-.32&&lo<w.c+w.w/2+.32&&y+.43>w.y-.22&&y<w.y+w.h+.28))continue;
          const depth=.07+((row+Math.round(s*2))%3+3)%3*.012;
          wb('ashlar',lo,hi,y,y+.43,-.04,depth,true);
        }
      }
      // Granite basement joints and squared blocks under the upper courses.
      for(let y=.1;y<2.5;y+=.61)for(let s=-length/2+.02;s<length/2-.1;s+=1.75) {
        wb('granite',s,Math.min(s+1.65,length/2-.02),y,Math.min(y+.53,2.55),-.03,.11,true);
      }
    }
    if(length>5)for(let s=-length/2+1.05;s<length/2-.6;s+=2.75) {
      // Shallow basement lights in dark metal wells.
      wb('glass',s-.43,s+.43,.48,1.91,.13,.21);
      if(near)for(const d of [-.23,0,.23])wb('iron',s+d-.018,s+d+.018,.48,1.91,.21,.27);
    }
  }

  // Main hipped corner/side ranges and lower cross ridge. Slight roof-wall
  // penetration closes eaves without coincident top surfaces.
  roofPut(hipRoof(-21.82,-10.53,-12.91,14.32,15.56,5.14,5.35),'roof');
  roofPut(hipRoof(10.94,21.59,-13.08,14.22,15.56,5.14,5.35),'roof');
  roofPut(gableRoof(-10.83,11.24,-9.93,11.49,15.56,4.7),'roof');
  roofPut(hipRoof(-5.83,5.73,-14.25,-8.5,15.55,3.2,2.86),'roof');

  // Central south pediment rises above the cross roof; its back pitched
  // section meets the ridge. Smaller round-arched corner dormers are visible
  // from the road even at far LOD.
  const gable=(angle,x,z,width,rise,dormer=false)=> {
    const M=facadeMatrix(angle,x,z),at=(g,m)=>{g.applyMatrix4(M);put(g,m);};
    const y=15.55,top=y+rise;
    const pts=dormer? [[-width/2,y],[width/2,y],[width/2,y+rise*.43],[0,top],[-width/2,y+rise*.43]] : [[-width/2,y],[width/2,y],[0,top]];
    const sh=polygon(pts),opening={c:0,y:y+(dormer?.35:1.05),w:dormer?1.45:3.12,h:dormer?2.18:1.52,arch:dormer};
    sh.holes.push(new THREE.Path(openingPoints(opening,seg).map(([s,v])=>new THREE.Vector2(s,v))));
    at(stripCaps(prism(sh,.55,.18),(_x,y)=>y<-.9),'trim');
    at(new THREE.ShapeGeometry(polygon(openingPoints(opening,seg))).translate(0,0,-.42),'glass');
    if(!dormer) {
      const vent=prism(polygon([[-.3,top-2.7],[.3,top-2.7],[.3,top-1.6],[-.3,top-1.6]]),.06,.26);at(vent,'wood');
      if(near)for(let s=-1.4;s<1.5;s+=.28) { const g=new THREE.BoxGeometry(.045,1.45,.17);g.translate(s,y+1.81,-.23);at(g,'wood'); }
    } else {
      const spring=opening.y+opening.h-opening.w/2;
      const out=polygon(archPoints(0,opening.y-.16,opening.w+.5,opening.h+.41,seg));
      out.holes.push(new THREE.Path(openingPoints(opening,seg).map(([s,v])=>new THREE.Vector2(s,v))));
      at(prism(out,.22,.40),'sandstone');
      if(near){const g=new THREE.BoxGeometry(.07,spring-opening.y,.2);g.translate(0,(spring+opening.y)/2,-.25);at(g,'wood');}
    }
    const baseRise=dormer?rise*.43:0;
    for(const d of [-1,1]) {
      const a=new THREE.Vector3(d*width/2,y+baseRise,.32),c=new THREE.Vector3(0,top+.12,.32),dir=c.clone().sub(a);
      const g=new THREE.BoxGeometry(.20,dir.length(),.29);g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0),dir.normalize()));g.translate(...a.add(c).multiplyScalar(.5).toArray());at(g,'sandstone');
    }
    // Dormer roof closed on every side, overlapping its host hip in depth.
    const depth=dormer?2.8:5.4;
    let roof=gableRoof(-depth,.08,-width/2,width/2,y+baseRise,rise-baseRise-.10);
    roof=stripCaps(roof,(x,y)=>x>.9||y<-.9);
    roof.rotateY(-Math.PI/2);at(roof,'roof');
    const finial=new THREE.ConeGeometry(.14,.50,near?8:4);finial.translate(0,top+.34,.16);at(finial,'trim');
  };
  gable(0,0,11.31,8.2,7.15);
  // Four corner dormers, plus the mid-side gables that appear in oblique views.
  for(const x of [-16.17,16.26]) {gable(0,x,x<0?14.06:13.96,3.4,4.3,true);gable(Math.PI,x,-12.79,3.4,4.3,true);}
  gable(-Math.PI/2,-21.57,.6,7.5,6.1);
  gable(Math.PI/2,21.34,.6,7.5,6.1);

  // Stone stair and landing, 2.7 m high, with closed granite cheek walls.
  box('granite',-4.45,4.45,0,2.7,11.20,13.2);
  for(let i=0;i<14;i++) {
    const top=(14-i)*2.7/14,z=13.2+i*.37;
    box('granite',-4.15,4.15,0,top,z-.035,z+.37);
  }
  for(const x of [-4.48,4.48]) {
    // Sloping cheek follows stair pitch; polygon is in z/y then rotated.
    const cheek=prism(polygon([[11.7,0],[18.48,0],[18.48,.45],[13.15,3.05],[11.7,3.05]]),.48,.24);
    cheek.rotateY(-Math.PI/2);cheek.translate(x,0,0);put(cheek,'granite');
    b.bar('iron',[x,3.68,12.7],[x,1.04,18.45],.065,.065);
    for(let i=0;i<5;i++){const z=13.2+i*1.23,y=3.40-i*.61;b.bar('iron',[x,y-.95,z],[x,y,z],.04,.04);}
  }
  // Small stone cap blocks and roof ridge tiles touch their roof supports.
  for(const x of [-16.17,16.26]) {
    b.bar('roof',[x,20.75,-7.50],[x,20.75,8.95],.20,.20);
    if(near)for(let z=-7.3;z<8.8;z+=.55)box('trim',x-.09,x+.09,20.63,20.83,z-.10,z+.10);
  }
  // Near roof tile ribs: shallow, on the visible pitched planes, no textures.
  if(near)for(const [x0,x1,z0,z1] of [[-21.82,-10.53,-12.91,14.32],[10.94,21.59,-13.08,14.22]]) {
    const mid=(x0+x1)/2;
    for(let z=z0+5.6;z<z1-5.4;z+=.65)for(const d of [-1,1]) {
      b.bar('roof',[mid,20.74,z],[d<0?x0:x1,15.59,z],.035,.04);
    }
  }
  const root=b.finish(),a=THREE.MathUtils.degToRad(SPEC.rotationDeg);
  root.traverse(o=>{
    if(!o.isMesh)return;
    o.geometry.deleteAttribute('bridgeLift');o.geometry.rotateY(a);
    o.geometry=mergeVertices(o.geometry,1e-4);o.geometry.computeBoundingBox();o.geometry.computeBoundingSphere();
  });
  root.userData.elevationDatum=MANIFEST_DATUM;
  return root;
}
const MANIFEST_DATUM='Rigid granite foundation at local grade y=0; orientation baked from OSM.';
