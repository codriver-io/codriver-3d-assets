import * as THREE from 'three';
import { SPEC } from './config.js';
import { lngToMercX, latToMercY, mercStretch } from '../../../facade/geo.js';

const angle = SPEC.rotationDeg * Math.PI / 180;
export function world(x, y, z) {
  return [x * Math.cos(angle) + z * Math.sin(angle), y, -x * Math.sin(angle) + z * Math.cos(angle)];
}
export function localRing(ring) {
  const k = mercStretch(SPEC.origin[1]), ox = lngToMercX(SPEC.origin[0]), oz = -latToMercY(SPEC.origin[1]);
  return ring.slice(0, -1).map(([lng, lat]) => {
    const x = (lngToMercX(lng) - ox) / k, z = (-latToMercY(lat) - oz) / k;
    return [x * Math.cos(angle) - z * Math.sin(angle), x * Math.sin(angle) + z * Math.cos(angle)];
  });
}

export function kit(b, near) {
  const put = (g, m) => { g.rotateY(angle); b.put(g, m); };
  const box = (m, x, y, z, w, h, d) => b.box(m, world(x, y, z), [w, h, d], angle);
  function quad(m, a, c, d, e) {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute([...a, ...c, ...d, ...e], 3));
    g.setIndex([0, 1, 2, 0, 2, 3]); g.computeVertexNormals(); put(g, m);
  }
  // A facade is a real perforated wall, with inset glass and closed reveals.
  // q increases to the right when seen from outside; normal is right cross up.
  function facade(center, right, normal, width, y0, y1, cols, rows, windowW = 1.5, windowH = 2.25, glass = 'glass', arched = false) {
    const p = (q, y, inset = 0) => [center[0] + right[0] * q - normal[0] * inset, y, center[1] + right[1] * q - normal[1] * inset];
    const rect = (m, a, c, bot, top, inset = 0) => quad(m, p(a, bot, inset), p(c, bot, inset), p(c, top, inset), p(a, top, inset));
    if (!cols || !rows) { rect('stone', -width / 2, width / 2, y0, y1); return; }
    const pitch = width / cols, rh = (y1 - y0) / rows, ww = Math.min(windowW, pitch * 0.62), wh = Math.min(windowH, rh * 0.72);
    const inset = near ? 0.28 : 0.65;
    for (let r = 0; r < rows; r++) {
      const bot = y0 + r * rh, top = bot + rh, low = bot + (rh - wh) / 2, high = low + wh;
      rect('stone', -width / 2, width / 2, bot, low);
      rect('stone', -width / 2, width / 2, high, top);
      for (let c = 0; c < cols; c++) {
        const a = -width / 2 + c * pitch, end = a + pitch, l = a + (pitch - ww) / 2, h = l + ww;
        rect('stone', a, l, low, high); rect('stone', h, end, low, high);
        if (arched) {
          const seg = near ? 10 : 6, radius = ww / 2, spring = high - radius;
          for (let i = 0; i < seg; i++) {
            const qa = l + ww * i / seg, qb = l + ww * (i + 1) / seg;
            const ya = spring + Math.sqrt(Math.max(0, radius * radius - (qa - (l+h)/2) ** 2));
            const yb = spring + Math.sqrt(Math.max(0, radius * radius - (qb - (l+h)/2) ** 2));
            quad(glass, p(qa,low,inset),p(qb,low,inset),p(qb,yb,inset),p(qa,ya,inset));
            quad('stone',p(qa,ya),p(qb,yb),p(qb,high),p(qa,high));
            quad('stone',p(qa,ya),p(qa,ya,inset),p(qb,yb,inset),p(qb,yb));
          }
        } else rect(glass, l, h, low, high, inset);
        quad('stone', p(l, low), p(l, low, inset), p(l, high, inset), p(l, high));
        quad('stone', p(h, high), p(h, high, inset), p(h, low, inset), p(h, low));
        if (!arched) quad('stone', p(l, high), p(l, high, inset), p(h, high, inset), p(h, high));
        quad('stone', p(h, low), p(h, low, inset), p(l, low, inset), p(l, low));
        if (near && wh < 4 && !arched) {
          // One mullion wholly inside the aperture, no layered wall face.
          const mid = (l + h) / 2;
          rect('trim', mid - 0.04, mid + 0.04, low, high, inset - 0.12);
        }
      }
    }
  }
  function block(x0, x1, z0, z1, y0, y1, cols, rows, ww = 1.5, wh = 2.25, top = true) {
    facade([x1, (z0 + z1) / 2], [0, -1], [1, 0], z1 - z0, y0, y1, cols, rows, ww, wh);
    facade([x0, (z0 + z1) / 2], [0, 1], [-1, 0], z1 - z0, y0, y1, cols, rows, ww, wh);
    facade([(x0 + x1) / 2, z1], [1, 0], [0, 1], x1 - x0, y0, y1, cols, rows, ww, wh);
    facade([(x0 + x1) / 2, z0], [-1, 0], [0, -1], x1 - x0, y0, y1, cols, rows, ww, wh);
    if (top) quad('stone', [x0, y1, z0], [x0, y1, z1], [x1, y1, z1], [x1, y1, z0]);
  }
  function loft(m, x, z, w0, d0, y0, w1, d1, y1) {
    const a = [[x-w0/2,y0,z-d0/2],[x+w0/2,y0,z-d0/2],[x+w0/2,y0,z+d0/2],[x-w0/2,y0,z+d0/2]];
    const c = [[x-w1/2,y1,z-d1/2],[x+w1/2,y1,z-d1/2],[x+w1/2,y1,z+d1/2],[x-w1/2,y1,z+d1/2]];
    for (let i=0;i<4;i++) { const j=(i+1)%4; quad(m,a[i],c[i],c[j],a[j]); }
    quad(m,c[0],c[3],c[2],c[1]);
  }
  return { box, put, quad, facade, block, loft };
}
