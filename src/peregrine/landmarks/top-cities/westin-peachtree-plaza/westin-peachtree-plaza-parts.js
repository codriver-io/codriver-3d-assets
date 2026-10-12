import * as THREE from 'three';

// Flat faceted normals. Every pane occupies its own portion of the shell,
// never an overlay on a backing cylinder.
export class Surface {
  positions = []; indices = [];
  quad(a, b, c, d) {
    const i = this.positions.length / 3;
    this.positions.push(...a, ...b, ...c, ...d);
    this.indices.push(i, i + 1, i + 2, i, i + 2, i + 3);
  }
  triangle(a, b, c) {
    const i = this.positions.length / 3;
    this.positions.push(...a, ...b, ...c); this.indices.push(i, i + 1, i + 2);
  }
  geometry() {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(this.positions, 3));
    g.setIndex(this.indices); g.computeVertexNormals(); return g;
  }
}
export const ringPoint = (r, t, y, cx = 0, cz = 0) => [cx + r * Math.cos(t), y, cz + r * Math.sin(t)];
export function panel(m, r, a, c, y0, y1, cx = 0, cz = 0) {
  m.quad(ringPoint(r, a, y0, cx, cz), ringPoint(r, a, y1, cx, cz), ringPoint(r, c, y1, cx, cz), ringPoint(r, c, y0, cx, cz));
}
export function cap(m, r, y, count, cx = 0, cz = 0, up = true) {
  for (let i = 0; i < count; i++) {
    const a = ringPoint(r, i * Math.PI * 2 / count, y, cx, cz), c = ringPoint(r, (i + 1) * Math.PI * 2 / count, y, cx, cz);
    m.triangle([cx, y, cz], ...(up ? [c, a] : [a, c]));
  }
}
export function drum(m, r, y0, y1, count, cx = 0, cz = 0) {
  for (let i = 0; i < count; i++) panel(m, r, i * Math.PI * 2 / count, (i + 1) * Math.PI * 2 / count, y0, y1, cx, cz);
}
export function curtain(m, { radius, bottom, top, bays, rows, cx = 0, cz = 0, shaft = false }) {
  const pitch = (top - bottom) / rows, step = Math.PI * 2 / bays;
  const mullion = (shaft ? 0.12 : 0.10) / radius, band = shaft ? 0.09 : 0.13;
  for (let j = 0; j < bays; j++) {
    const a = j * step, c = a + step;
    // At the same radial facet plane: interpolation makes adjoining edges
    // exactly coincide instead of two slightly different circular chords.
    const p = (t, y) => {
      const f = (t-a)/step, u=ringPoint(radius,a,y,cx,cz), v=ringPoint(radius,c,y,cx,cz);
      return u.map((value,index)=>value+(v[index]-value)*f);
    };
    const tile = (mat, ta, tc, y0, y1) => mat.quad(p(ta,y0),p(ta,y1),p(tc,y1),p(tc,y0));
    tile(m.frame, a, a + mullion, bottom, top);
    for (let k = 0; k < rows; k++) {
      const y = bottom + k * pitch;
      tile(m.frame, a + mullion, c, y, y + band);
      const lit = !shaft && (j * 13 + k * 19) % 67 < 3;
      const mat = shaft ? m.elevatorGlass : lit ? m.glow : j >= bays * 0.48 && j < bays * 0.62 ? m.glassShade : m.glass;
      tile(mat, a + mullion, c, y + band, y + pitch);
    }
  }
}
