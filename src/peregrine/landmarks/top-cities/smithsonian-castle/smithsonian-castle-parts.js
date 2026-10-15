import * as THREE from 'three';

// Reusable pieces of the Castle: flat-shaded triangle soups (windows, gables), roofs, crenellations and
// the octagonal / square towers. Everything is in model metres (+X east, +Y up, +Z south).

export class Soup {
  constructor() { this.p = []; }
  tri(a, b, c) { this.p.push(...a, ...b, ...c); }
  quad(a, b, c, d) { this.tri(a, b, c); this.tri(a, c, d); }
  // A triangle / quad wound so its normal points along `dir` (so no winding has to be reasoned out by hand).
  triFacing(a, b, c, dir) {
    const n = new THREE.Vector3(...b).sub(new THREE.Vector3(...a)).cross(new THREE.Vector3(...c).sub(new THREE.Vector3(...a)));
    if (n.x * dir[0] + n.y * dir[1] + n.z * dir[2] < 0) this.tri(a, c, b); else this.tri(a, b, c);
  }
  quadFacing(a, b, c, d, dir) { this.triFacing(a, b, c, dir); this.triFacing(a, c, d, dir); }
  fan(pts) { for (let i = 1; i < pts.length - 1; i++) this.tri(pts[0], pts[i], pts[i + 1]); }
  get empty() { return !this.p.length; }
  geometry() {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(this.p, 3));
    g.computeVertexNormals();
    return g;
  }
}

// A round-headed window (rectangle + semicircle) lying in a wall plane, proud of it by `off`.
// (cx, cz) is the centre of its sill on the wall, (nx, nz) the wall's outward normal. `pointed` makes a lancet head.
export function arch(soup, cx, cz, nx, nz, y0, w, h, near, off = 0.16, pointed = false) {
  const ux = nz, uz = -nx, spring = h - (pointed ? w * 0.9 : w / 2), steps = near ? 8 : 4;
  const at = (u, y) => [cx + ux * u + nx * off, y, cz + uz * u + nz * off];
  const pts = [at(-w / 2, y0), at(w / 2, y0), at(w / 2, y0 + spring)];
  if (pointed) pts.push(at(0, y0 + h));
  else for (let i = 1; i < steps; i++) { const a = (i / steps) * Math.PI; pts.push(at((w / 2) * Math.cos(a), y0 + spring + (w / 2) * Math.sin(a))); }
  pts.push(at(-w / 2, y0 + spring));
  soup.fan(pts);
}

// A window with a paler surround: the trim head sits 0.12 m off the wall, the dark glass 0.26 m.
export function framed(trim, glass, cx, cz, nx, nz, y0, w, h, near, pointed = false) {
  if (near) arch(trim, cx, cz, nx, nz, Math.max(0, y0 - 0.2), w + 0.5, h + 0.4, near, 0.12, pointed);
  if (!near) { arch(glass,cx,cz,nx,nz,y0,w,h,false,0.16,pointed); return; }
  const off = 0.26;
  // Separate lower panes expose the sandstone mullion and transom behind the glazing.
  const at = (u, y) => [cx + nz*u + nx*off, y, cz - nx*u + nz*off];
  const split = h > 4.5 && near, mid = y0 + h * 0.48;
  const pane = (a, c, lo, hi) => glass.quadFacing(at(a,lo),at(c,lo),at(c,hi),at(a,hi),[nx,0,nz]);
  for (const [a,c] of [[-w/2,-0.055],[0.055,w/2]]) {
    if (split) { pane(a,c,y0,mid-0.06); pane(a,c,mid+0.06,y0+h-w/2-0.08); }
    else pane(a,c,y0,y0+h-w/2-0.08);
  }
  arch(glass,cx,cz,nx,nz,y0+h-w/2,w,w/2,near,off,pointed);
}

// Repeated small sandstone consoles held by the wall, ending against its cornice.
export function corbels(b, a, c, cz, nx, nz, y, near, cx = null) {
  if (!near) return;
  const count = Math.max(2, Math.round((c-a)/(near ? 0.75 : 1.5)));
  for (let i=0;i<count;i++) {
    const u=a+(c-a)*(i+0.5)/count;
    const x=cx === null ? u : cx+nz*u, z=cx === null ? cz : cz-nx*u;
    b.box('stone',[x+nx*0.16,y+0.95,z+nz*0.16],[0.36,0.75,0.36]);
  }
}

// Slim octagon corner shafts under the crown, with grounded lower buttress blocks.
export function ribs(b,cx,cz,apo,y0,y1,near) {
  const R=apo/Math.cos(Math.PI/8);
  for(let i=0;i<8;i++) {
    const a=(i+0.5)*Math.PI/4, x=cx+R*Math.cos(a), z=cz+R*Math.sin(a);
    b.box('stone',[x,(y0+y1)/2,z],[0.38,y1-y0,0.38]);
    b.box('stone',[x,y1-0.22,z],[0.58,0.44,0.58]);
    if(near) b.box('stone',[x,3.5,z],[0.7,7,0.7]);
  }
}

// Clock hands and rose spokes occupy gaps between dark sectors: no overlay/material cycle.
export function roundel(trim,glass,cx,cy,cz,nx,nz,r,near,kind) {
  const count=near?32:16, inner=r*0.8;
  const at=(rr,a,off=0.24)=>[cx+nz*rr*Math.cos(a)+nx*off,cy+rr*Math.sin(a),cz-nx*rr*Math.cos(a)+nz*off];
  for(let i=0;i<count;i++) {
    const a=i*Math.PI*2/count,c=(i+1)*Math.PI*2/count;
    trim.quadFacing(at(inner,a),at(r,a),at(r,c),at(inner,c),[nx,0,nz]);
  }
  if(kind==='rose') {
    const n=near?12:8;
    for(let i=0;i<n;i++) {
      const a=(i+0.08)*Math.PI*2/n,c=(i+0.92)*Math.PI*2/n;
      glass.quadFacing(at(inner*.2,a),at(inner*.85,a),at(inner*.85,c),at(inner*.2,c),[nx,0,nz]);
    }
  } else {
    // A pale dial with dark rim, hour ticks and hands showing 10:05.
    disc(trim,cx,cy,cz,nx,nz,inner,count,0.12);
    const line=(a,c,width)=>{
      const dx=c[0]-a[0],dy=c[1]-a[1],len=Math.hypot(dx,dy),ux=-dy/len*width/2,uy=dx/len*width/2;
      const P=(u,v)=>[cx+nz*u+nx*.26,cy+v,cz-nx*u+nz*.26];
      glass.quadFacing(P(a[0]+ux,a[1]+uy),P(c[0]+ux,c[1]+uy),P(c[0]-ux,c[1]-uy),P(a[0]-ux,a[1]-uy),[nx,0,nz]);
    };
    for(let i=0;i<12;i++) {const a=i*Math.PI/6;line([inner*.82*Math.cos(a),inner*.82*Math.sin(a)],[inner*.96*Math.cos(a),inner*.96*Math.sin(a)],.07);}
    line([0,0],[-inner*.5,inner*.32],.12);line([0,0],[inner*.35,inner*.65],.09);
  }
}

// Rows of windows along a wall that runs east-west at z, facing north (nz = -1) or south (nz = +1).
// Returns the x of every bay boundary (where a pilaster stands).
export function facadeRows(glass, trim, x0, x1, z, nz, rows, pitch, near, skips = []) {
  const bays = Math.max(1, Math.round((x1 - x0) / pitch)), step = (x1 - x0) / bays, edges = [];
  for (let i = 0; i < bays; i++) {
    const cx = x0 + step * (i + 0.5);
    if (i > 0) edges.push(x0 + step * i);
    if (skips.some(([a, b]) => cx > a - 0.9 && cx < b + 0.9)) continue;
    for (const [y0, w, h] of rows) framed(trim, glass, cx, z, 0, nz, y0, w, h, near);
  }
  return edges.filter((x) => !skips.some(([a, b]) => x > a - 0.6 && x < b + 0.6));
}

// Same along a wall that runs north-south at x, facing east (nx = +1) or west (nx = -1).
export function sideRows(glass, trim, z0, z1, x, nx, rows, pitch, near, skips = []) {
  const bays = Math.max(1, Math.round((z1 - z0) / pitch)), step = (z1 - z0) / bays;
  for (let i = 0; i < bays; i++) {
    const cz = z0 + step * (i + 0.5);
    if (skips.some(([a, b]) => cz > a - 0.9 && cz < b + 0.9)) continue;
    for (const [y0, w, h] of rows) framed(trim, glass, x, cz, nx, 0, y0, w, h, near);
  }
}

// A gabled slate roof over a rectangle. Ridge along x or z; end gables are stone triangles in the wall plane.
// The slope passes exactly through the wall tops, so the slate never overlaps the gable face.
export function gableRoof(b, stone, x0, x1, z0, z1, yE, yR, axis = 'x', ov = 0.35, gables = [true, true]) {
  const alongA = axis === 'x' ? x0 : z0, alongB = axis === 'x' ? x1 : z1;
  const acrossA = axis === 'x' ? z0 : x0, acrossB = axis === 'x' ? z1 : x1, mid = (acrossA + acrossB) / 2, half = (acrossB - acrossA) / 2;
  const yEo = yE - (yR - yE) * ov / half;
  const P = (along, across, y) => axis === 'x' ? [along, y, across] : [across, y, along];
  const D = (along, across) => axis === 'x' ? [along, 0, across] : [across, 0, along];
  const a0 = alongA + 0.05, a1 = alongB - 0.05, cA = acrossA - ov, cB = acrossB + ov;
  const roof = new Soup();
  // Slope normals tilt outward from the ridge; the underside faces down; the ends face along the ridge.
  const up = (c) => { const o = D(0, c < mid ? -1 : 1); return [o[0], half / Math.max(1e-6, (yR - yE)), o[2]]; };
  roof.quadFacing(P(a0, cA, yEo), P(a1, cA, yEo), P(a1, mid, yR), P(a0, mid, yR), up(cA));
  roof.quadFacing(P(a1, cB, yEo), P(a0, cB, yEo), P(a0, mid, yR), P(a1, mid, yR), up(cB));
  roof.quadFacing(P(a0, cA, yEo), P(a0, cB, yEo), P(a1, cB, yEo), P(a1, cA, yEo), [0, -1, 0]);
  roof.triFacing(P(a0, cB, yEo), P(a0, cA, yEo), P(a0, mid, yR), D(-1, 0));
  roof.triFacing(P(a1, cA, yEo), P(a1, cB, yEo), P(a1, mid, yR), D(1, 0));
  b.put(roof.geometry(), 'slate');
  const ends = new Soup();
  if (gables[0]) ends.triFacing(P(alongA, acrossA, yE), P(alongA, acrossB, yE), P(alongA, mid, yR), D(-1, 0));
  if (gables[1]) ends.triFacing(P(alongB, acrossA, yE), P(alongB, acrossB, yE), P(alongB, mid, yR), D(1, 0));
  if (!ends.empty) b.put(ends.geometry(), stone);
}

// Regular prism / pyramid with `sides` faces whose flats face the axes (4: square, 8: octagon). `apo` is the apothem.
export function prism(b, mat, cx, cz, sides, apo, y0, y1, open = false) {
  const R = apo / Math.cos(Math.PI / sides), g = new THREE.CylinderGeometry(R, R, y1 - y0, sides, 1, open);
  g.rotateY(Math.PI / sides); g.translate(cx, (y0 + y1) / 2, cz);
  b.put(g, mat);
}
export function pyramid(b, mat, cx, cz, sides, apo, y0, y1, apexApo = 0) {
  const roof = new Soup(), radius = apo / Math.cos(Math.PI / sides);
  const profile = [[0,1],[0.18,0.65],[0.48,0.30],[0.78,0.1],[1,apexApo/apo]];
  for(let j=0;j<profile.length-1;j++) for(let i=0;i<sides;i++) {
    const a=(i+0.5)*Math.PI*2/sides,c=(i+1.5)*Math.PI*2/sides;
    const at=(p,t)=>[cx+radius*p[1]*Math.cos(t),y0+(y1-y0)*p[0],cz+radius*p[1]*Math.sin(t)];
    roof.quadFacing(at(profile[j],a),at(profile[j],c),at(profile[j+1],c),at(profile[j+1],a),[Math.cos((a+c)/2),1,Math.sin((a+c)/2)]);
  }
  const tip=profile.at(-1);
  const pts=Array.from({length:sides},(_,i)=>{const a=(i+.5)*Math.PI*2/sides;return [cx+radius*tip[1]*Math.cos(a),y1,cz+radius*tip[1]*Math.sin(a)];});
  for(let i=1;i<sides-1;i++) roof.triFacing(pts[0],pts[i],pts[i+1],[0,1,0]);
  b.put(roof.geometry(),mat);
}

// Crenellated parapet around a rectangle (outward merlons only), standing on y.
export function crenels(b, stone, x0, x1, z0, z1, y, near, merlon = 1.2, tall = 1.1) {
  const t = 0.5, pitch = near ? 1.9 : 3.8, w = near ? merlon : merlon * 2, h = near ? tall : tall * 1.1;
  // A continuous low parapet course under the merlons, 0.5 m thick.
  const low = 0.7;
  b.box(stone, [(x0 + x1) / 2, y + low / 2, z0 + t / 2], [x1 - x0, low, t]);
  b.box(stone, [(x0 + x1) / 2, y + low / 2, z1 - t / 2], [x1 - x0, low, t]);
  b.box(stone, [x0 + t / 2, y + low / 2, (z0 + z1) / 2], [t, low, z1 - z0 - 2 * t]);
  b.box(stone, [x1 - t / 2, y + low / 2, (z0 + z1) / 2], [t, low, z1 - z0 - 2 * t]);
  // Merlons stand on the low course.
  const y0 = y + low;
  const merl = (cx, cz, sx, sz) => b.box(stone, [cx, y0 + h / 2, cz], [sx, h, sz]);
  const nx = Math.max(1, Math.round((x1 - x0) / pitch)), sx = (x1 - x0) / nx;
  for (let i = 0; i < nx; i++) { const cx = x0 + sx * (i + 0.5); merl(cx, z0 + t / 2, w, t); merl(cx, z1 - t / 2, w, t); }
  const nz = Math.max(1, Math.round((z1 - z0) / pitch)), sz = (z1 - z0) / nz;
  for (let i = 1; i < nz - 0; i++) { const cz = z0 + sz * (i + 0.0); if (cz > z0 + 0.9 && cz < z1 - 0.9) { merl(x0 + t / 2, cz, t, w); merl(x1 - t / 2, cz, t, w); } }
  return y0 + h;
}

// A disc lying in a vertical wall plane (the clock), `n` segments, facing (nx, nz).
export function disc(soup, cx, cy, cz, nx, nz, r, n, off) {
  const ux = nz, uz = -nx, at = (a) => [cx + ux * r * Math.cos(a) + nx * off, cy + r * Math.sin(a), cz + uz * r * Math.cos(a) + nz * off];
  const pts = []; for (let i = 0; i < n; i++) pts.push(at((i / n) * Math.PI * 2));
  soup.fan(pts);
}
