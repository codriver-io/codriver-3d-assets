import * as THREE from 'three';

// Original Gothic primitives: closed walls pierced by real pointed openings.
export function pointed(w, h, segments = 4) {
  const rise = w * 0.85, spring = h - rise;
  const out = [[-w / 2, 0], [w / 2, 0], [w / 2, spring]];
  for (let i = 1; i <= segments; i++) {
    const t = i / segments;
    out.push([w / 2 * (1 - t * t), spring + rise * t]);
  }
  for (let i = segments - 1; i >= 0; i--) {
    const t = i / segments;
    out.push([-w / 2 * (1 - t * t), spring + rise * t]);
  }
  return out;
}
const path = (pts, Type = THREE.Shape) => new Type(pts.map(p => new THREE.Vector2(...p)));
export function kit(b, near) {
  const seg = near ? 5 : 1;
  function put(g, mat = 'stone') { g.computeVertexNormals(); b.put(g, mat); }
  function place(g, face, across, y, plane, thickness = 0) {
    if (face === 'W') { g.rotateY(-Math.PI / 2); g.translate(plane + thickness, y, across); }
    else if (face === 'E') { g.rotateY(Math.PI / 2); g.translate(plane - thickness, y, across); }
    else if (face === 'N') { g.rotateY(Math.PI); g.translate(across, y, plane + thickness); }
    else g.translate(across, y, plane - thickness);
    return g;
  }
  const fp = (face, a, y, plane) => face === 'W' || face === 'E' ? [plane, y, a] : [a, y, plane];
  function panel(mat, points, face, a, y, plane) {
    put(place(new THREE.ShapeGeometry(path(points)), face, a, y, plane), mat);
  }
  function wall(face, a, plane, width, height, holes = [], y0 = 0) {
    const s = path([[-width / 2, 0], [width / 2, 0], [width / 2, height], [-width / 2, height]]);
    for (const h of holes) {
      const pts = pointed(h.w, h.h, seg).map(([x, y]) => [x + (h.x || 0), y + h.y]);
      s.holes.push(path(pts.slice().reverse(), THREE.Path));
      // Glass closes the opening inside the reveal, without an opaque wall behind it.
      const inset = face === 'W' || face === 'N' ? 0.68 : -0.68;
      panel(h.mat || 'glass', pts, face, a, y0, plane + inset);
      if (h.mullions !== false) {
        const outer = face === 'W' || face === 'N' ? -0.13 : 0.13;
        const count = near ? (h.w > 6 ? 3 : 1) : 1;
        for (let j = 0; j < count; j++) {
          const x = (j - (count - 1) / 2) * h.w / (count + 1);
          b.bar('stone', fp(face, a + (h.x || 0) + x, y0 + h.y - 0.1, plane + outer), fp(face, a + (h.x || 0) + x, y0 + h.y + h.h - 0.05, plane + outer), near ? 0.23 : 0.34);
        }
      }
    }
    if (near) put(place(new THREE.ExtrudeGeometry(s, { depth: 0.9, bevelEnabled: false, curveSegments: 1 }), face, a, y0, plane, 0.9));
    else put(place(new THREE.ShapeGeometry(s), face, a, y0, plane));
  }
  function arch(face, a, y, plane, w, h, border = 0.55) {
    if (!near && w < 8) return; // pointed wall openings already retain the bay shape
    const outside = path(pointed(w, h, seg));
    outside.holes.push(path(pointed(w - border * 2, h - border, seg).reverse(), THREE.Path));
    if (near) put(place(new THREE.ExtrudeGeometry(outside, { depth: 0.38, bevelEnabled: false }), face, a, y, plane, 0.12));
    else put(place(new THREE.ShapeGeometry(outside), face, a, y, plane));
  }
  function cone(u, v, y0, y1, radius, mat = 'stone', n = 4) {
    const g = new THREE.ConeGeometry(radius, y1 - y0, n);
    g.rotateY(Math.PI / 4); g.translate(u, (y0 + y1) / 2, v); put(g, mat);
  }
  function cylinder(u, v, y0, y1, r0, r1 = r0, mat = 'stone', n = 8) {
    const g = new THREE.CylinderGeometry(r1, r0, y1 - y0, n);
    g.translate(u, (y0 + y1) / 2, v); put(g, mat);
  }
  function gable(u0, u1, v0, v1, eave, ridge, across = false) {
    // A triangular prism, fully closed, with correctly wound outside surfaces.
    const pts = [[u0,eave,v0],[u0,eave,v1],[u0,ridge,(v0+v1)/2],[u1,eave,v0],[u1,eave,v1],[u1,ridge,(v0+v1)/2]];
    if (across) for (const p of pts) [p[0],p[2]] = [p[2],p[0]];
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pts.flat(), 3));
    const idx = [0,1,2,3,5,4,0,2,5,0,5,3,1,4,5,1,5,2,0,3,4,0,4,1];
    if (across) for(let i=0;i<idx.length;i+=3) [idx[i+1],idx[i+2]]=[idx[i+2],idx[i+1]];
    g.setIndex(idx); put(g, 'roof');
  }
  function pinnacle(u, v, base, tip, radius = 0.55) {
    if (!near) { cone(u,v,base,tip,radius*1.15); return; }
    cylinder(u,v,base,tip-3,radius,radius,'stone',4);
    cone(u,v,tip-3,tip,radius*1.4);
  }
  function gableFrame(face, a, y, plane, w, rise) {
    if (!near && w < 3) return; // sub-metre statue canopy mouldings
    const p = fp(face,a,y+rise,plane), l=fp(face,a-w/2,y,plane), r=fp(face,a+w/2,y,plane);
    b.bar('stone',l,p,0.6); b.bar('stone',p,r,0.6);
    if (near) for(let j=1;j<=2;j++) for(const s of [-1,1]) {
      const t=j/3; const q=fp(face,a+s*w/2*(1-t),y+rise*t,plane);
      b.box('stone',[q[0],q[1]+0.24,q[2]],[0.45,0.75,0.45]);
    }
  }
  return { near, seg, put, place, fp, panel, wall, arch, cone, cylinder, gable, pinnacle, gableFrame, box: b.box, bar: b.bar };
}
