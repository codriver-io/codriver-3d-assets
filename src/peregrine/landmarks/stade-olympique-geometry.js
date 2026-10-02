import * as THREE from 'three';
import { assetBuilder } from './asset-geometry.js';
import { STADE, STADE_PALETTES, stadePoint as p } from './stade-olympique-config.js';

// Original authored surfaces. No source photography, scans or textures in exports.
// A dated March 2026 construction state: the central opening MUST remain empty.
export function createStadeOlympique({ detail = 'near' } = {}) {
  const b = assetBuilder(STADE, detail), near = detail === 'near', n = near ? 152 : 76;
  const rx = STADE.width / 2, rz = STADE.length / 2;
  const e = (a, r, y) => p(Math.sin(a) * rx * r, y, Math.cos(a) * rz * r);
  const beam = (mat, a, z, w, d = w) => b.bar(mat, p(...a), p(...z), w, d, 0, false, 0);
  // Every authored surface faces a stated way (the app shades from normals and culls back faces):
  // winding is flipped as a whole when its area-weighted normals oppose the hint.
  const UP = new THREE.Vector3(0, 1, 0);
  const FACING = {
    out: c => new THREE.Vector3(c.x, 0, c.z).normalize().add(UP.clone().multiplyScalar(0.5)),
    in: c => new THREE.Vector3(-c.x, 0, -c.z).normalize().add(UP.clone().multiplyScalar(0.5)),
    up: () => UP,
  };
  function orient(pos, idx, facing) {
    const hint = typeof facing === 'function' ? facing : FACING[facing];
    const a = new THREE.Vector3(), c = new THREE.Vector3(), d = new THREE.Vector3(), mid = new THREE.Vector3();
    let score = 0;
    for (let i = 0; i < idx.length; i += 3) {
      a.fromArray(pos, idx[i] * 3); c.fromArray(pos, idx[i + 1] * 3); d.fromArray(pos, idx[i + 2] * 3);
      mid.copy(a).add(c).add(d).multiplyScalar(1 / 3);
      score += c.sub(a).cross(d.sub(a)).dot(hint(mid));
    }
    if (score < 0) for (let i = 0; i < idx.length; i += 3) [idx[i + 1], idx[i + 2]] = [idx[i + 2], idx[i + 1]];
  }
  function surface(mat, rows, facing, segments = n, start = 0, end = Math.PI * 2) {
    const pos = [], idx = [];
    for (let j = 0; j < rows.length; j++) for (let i = 0; i <= segments; i++) {
      const a = start + (end - start) * i / segments;
      pos.push(...rows[j](a));
      if (j && i) {
        const v = j * (segments + 1) + i, prev = v - segments - 1;
        idx.push(prev - 1, v - 1, prev, prev, v - 1, v);
      }
    }
    orient(pos, idx, facing);
    const g = new THREE.BufferGeometry();g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));g.setIndex(idx);g.computeVertexNormals();
    b.put(g, mat, 0, 0);
  }
  const ellipse = (r, y) => a => e(a, r, typeof y === 'function' ? y(a) : y);
  // Grounded plinth with recessed glazing. No citywide elevation or road surface.
  surface('concrete', [ellipse(1.025, -0.6), ellipse(1.025, 2), ellipse(0.995, 2)], 'out');
  surface('glass', [ellipse(0.975, 2), ellipse(0.975, 12)], 'out');
  surface('concrete', [ellipse(1, 11), ellipse(1, 16), ellipse(0.965, 19)], 'out');
  // Convex ribbed shell. Green roof strips stop before the exposed ring works.
  const shell = [[1,16],[0.97,24],[0.90,34],[0.80,42],[0.73,46]];
  surface('roof', shell.map(([r,y]) => ellipse(r, a => y + 2 * Math.cos(a))), 'out');
  // A substantial rim, inner bowl, and open upper concourse, seen through roof gap.
  surface('concrete', [ellipse(0.705,43),ellipse(0.705,49)], 'in');
  surface('concrete', [ellipse(0.705,49),ellipse(0.755,49)], 'up');
  surface('concrete', [ellipse(0.755,49),ellipse(0.755,43)], 'out');
  surface('glass', [ellipse(0.693,38),ellipse(0.693,43)], 'in');
  surface('concrete', [ellipse(0.45,1),ellipse(0.45,3),ellipse(0.70,37),ellipse(0.705,43)], 'in');
  const levels = near ? 20 : 7;
  for (let j = 0; j < levels; j++) {
    const t=j/levels, t1=(j+1)/levels, r=0.46+0.22*t, r1=0.46+0.22*t1, y=5+32*t, y1=5+32*t1;
    surface('museum', [ellipse(r,y),ellipse(r1,y),ellipse(r1,y1)], 'in', near ? 114 : 76);
  }
  // March work floor, rather than a grass pitch or a completed rigid roof.
  const floor = new THREE.CylinderGeometry(1,1,0.4,near?76:38);
  floor.scale(rx*0.45,1,rz*0.45);floor.rotateY(-STADE.bearing*Math.PI/180);floor.translate(0,0.2,0);b.put(floor,'asphalt',0,0);
  // 34 full consoles + 4 shortened consoles at tower end. Keep all 38 at far LOD.
  for (let i=0;i<38;i++) {
    const a=(i+0.5)*Math.PI*2/38, truncated=Math.cos(a)>0.945;
    const points = truncated ? [[0.76,46],[0.84,40],[0.96,24]] : [[1.027,0],[1.025,9],[1,18],[0.964,27],[0.89,37],[0.79,46],[0.705,50]];
    for(let k=1;k<points.length;k++){
      const [r0,y0]=points[k-1],[r1,y1]=points[k];
      // The 2 m tilt must not push the foot of a console below the esplanade.
      b.bar('concrete',e(a,r0,Math.max(0,y0+2*Math.cos(a))),e(a,r1,Math.max(0,y1+2*Math.cos(a))),near?3.3:3.8,near?2.3:2.8,0,false,0);
    }
    // Exposed replacement ring: black steel top chords and sectional braces.
    const a1=a+Math.PI*2/38;
    for(const [r,y] of [[0.702,51.3],[0.748,51.3],[0.702,48]]) b.bar('steel',e(a,r,y),e(a1,r,y),near?0.5:0.8,0.65,0,false,0);
    b.bar('steel',e(a,0.702,48),e(a1,0.702,51.3),0.45,0.45,0,false,0);
    if(near){
      b.bar('rail',e(a,0.702,51.3),e(a,0.748,51.3),0.5,0.5,0,false,0);
      for(const r of [0.51,0.59,0.67])b.bar('glass',e(a,r,5+(r-0.46)/0.22*32+0.25),e(a,r+0.035,5+(r+0.035-0.46)/0.22*32+0.25),1.8,0.4,0,false,0);
    }
  }
  // Tower: concave flared foot, narrowing waist, then inclined upper steel shaft.
  // Cross sections are [elevation, half-width, front-v, rear-v] in local metres.
  const sections = [[0,58,127,239],[15,45,128,225],[35,32,128,210],[60,22,123,190],[87,15,108,165],[115,14,87,140],[143,19,64,116],[160,25,49,104],[165,26,47,102]];
  // Faces look away from the shaft's centre line at their own elevation (the shaft leans, so
  // the stadium-side face looks down and forward).
  const towerAxis = y => {
    let k = 1; while (k < sections.length - 1 && sections[k][0] < y) k++;
    const [y0, , f0, b0] = sections[k - 1], [y1, , f1, b1] = sections[k], t = Math.min(1, Math.max(0, (y - y0) / (y1 - y0)));
    return new THREE.Vector3(...p(0, y, ((f0 + b0) + ((f1 + b1) - (f0 + b0)) * t) / 2));
  };
  const awayFromShaft = c => c.clone().sub(towerAxis(c.y));
  function towerStrip(mat, side, f0, f1, rows=sections) {
    const pos=[],ids=[];
    for(const [y,w,vf,vb] of rows){
      // side 0: forward face; side 1/2: side surfaces; side 3: rear face.
      const at=f=>side===0?p((f*2-1)*w,y,vf):side===3?p((1-f*2)*w,y,vb):p((side===1?1:-1)*w,y,side===1?vf+(vb-vf)*f:vb-(vb-vf)*f);
      pos.push(...at(f0),...at(f1));
      if(pos.length>6){const k=pos.length/3-2;ids.push(k-2,k-1,k,k-1,k+1,k);}
    }
    orient(pos,ids,awayFromShaft);
    const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setIndex(ids);g.computeVertexNormals();b.put(g,mat,0,0);
  }
  // Pale concrete throughout; only narrow dark glazed slits recess into the lower stadium-side face.
  for(let side=0;side<4;side++){
    towerStrip('concrete',side,0,0.19);towerStrip('concrete',side,0.81,1);
    if(side===0){
      towerStrip('concrete',side,0.43,0.57);
      for(const [l,r] of [[0.19,0.43],[0.57,0.81]]){
        const c=(l+r)/2;
        towerStrip('concrete',side,l,c-0.05);towerStrip('concrete',side,c+0.05,r);
        towerStrip('glass',side,c-0.05,c+0.05,sections.slice(0,5));
        towerStrip('concrete',side,c-0.05,c+0.05,sections.slice(4));
      }
    }else towerStrip('concrete',side,0.19,0.81);
  }
  // Roof cap and observation glazing stay at the official 165 m tower height.
  const cap=new THREE.BoxGeometry(52,1,55);cap.rotateY(-STADE.bearing*Math.PI/180);cap.translate(...p(0,164.5,74.5));b.put(cap,'concrete',0,0);
  for(const y of [151,155,159]){
    const t=(y-143)/17,w=19+6*t,vf=64-15*t,vb=116-12*t;
    beam('glass',[-w+2,y,vf-0.1],[w-2,y,vf-0.1],1.6,1.2);
    if(near)for(const side of [-1,1])beam('rail',[side*w,y,vf+6],[side*w,y,vb-6],0.6);
  }
  // Rear funicular guideway curves down to the ground station (cab omitted during works).
  const track=[[0,1,324],[0,10,279],...sections.slice(2,-1).map(([y,w,vf,vb])=>[0,y,vb+0.6])];
  for(let i=1;i<track.length;i++) for(const u of [-2.1,2.1])beam('rail',[u,track[i-1][1],track[i-1][2]],[u,track[i][1],track[i][2]],near?0.65:1.1);
  // Glazed, low sports-centre shell beneath tower, within the mapped complex.
  for(const side of [-1,1]){
    const rows=[];
    for(let k=0;k<=8;k++){
      const t=k/8, v=239+61*t, w=45*(1-t)+9*t, y=5+12*Math.sin(Math.PI*t);
      rows.push(a=>p(side*(9+(w-9)*a/Math.PI),y+3*Math.sin(a),v));
    }
    surface('glass',rows,'up',near?16:8,0,Math.PI);
    // Follow the glazing crown so the ribs stay continuously above its surface.
    for(let k=0;k<8;k++){
      const t=k/8,v=239+61*t,w=45*(1-t)+9*t,y=5+12*Math.sin(Math.PI*t),steps=near?8:4;
      const rib=a=>[side*(9+(w-9)*a/Math.PI),y+3*Math.sin(a)+0.65,v];
      for(let j=0;j<steps;j++)beam('concrete',rib(j*Math.PI/steps),rib((j+1)*Math.PI/steps),1.1,1.1);
    }
    const outward=new THREE.Vector3(...p(side,0,0));
    surface('concrete',[a=>{const t=a/Math.PI;return p(side*(45*(1-t)+9*t),-0.5,239+61*t);},a=>{const t=a/Math.PI;return p(side*(45*(1-t)+9*t),5+12*Math.sin(Math.PI*t),239+61*t);}],()=>outward,8,0,Math.PI);
  }
  // Hanging cable bundles in March photos: NOT the old fan connected to a membrane.
  // Symbolic 24 temporary vertical lines; their ends hang over the work floor.
  beam('concrete',[-8,157,50],[8,157,50],1.6,1.6);
  for(const u of [-7,7])beam('concrete',[u,157,49.5],[u,157,60],1.6,1.6);
  for(let i=0;i<24;i++){
    const u=(i%8-3.5)*1.6,v=50+Math.floor(i/8)*3;
    beam('rail',[u,157,v],[u,8+(i%3)*2,v],near?0.12:0.22);
  }
  const model=b.finish();
  model.userData.modeledState=STADE.modeledState;
  model.traverse(o=>{if(o.isMesh){o.geometry.deleteAttribute('bridgeLift');o.material.color.set(STADE_PALETTES.light[o.material.name]);o.material.side=THREE.DoubleSide;}});
  return model;
}
