import { assetBuilder } from '../../asset-geometry.js';
import { lngToMercX, latToMercY, mercStretch } from '../../../facade/geo.js';
import { SPEC, PALETTES } from './config.js';
import { Surface, polar, strip, ROOF_RING } from './tour-part-dieu-parts.js';

export function create({ detail = 'near' } = {}) {
  const near = detail === 'near', b = assetBuilder({ ...SPEC, palette: PALETTES.light }, detail);
  const M = Object.fromEntries(Object.keys(PALETTES.light).map(k => [k, new Surface()]));
  const N = near ? 71 : 48, rows = near ? 40 : 20;
  const R = SPEC.radius, inset = 0.38, pitch = (140.5 - 5.4) / rows;
  // 71 narrow perimeter piers; far groups the glazed bays into 48.
  for (let j = 0; j < N; j++) {
    const a = Math.PI + (j - 2.5) * Math.PI * 2 / N;
    const c = a + Math.PI * 2 / N;
    const halfPier = (near ? 0.20 : 0.27) / R, u = a + halfPier, v = c - halfPier;
    strip(M.rib, a - halfPier, a + halfPier, R, 0, 140.5);
    const normal = [Math.cos((a+c)/2), 0, Math.sin((a+c)/2)];
    // Double-height dark lobby with a recessed western entrance.
    const entry = j >= 1 && j <= 3;
    const lobbyR = entry ? R - 1.35 : R - inset;
    strip(M.glass, u, v, lobbyR, 0, 5.4);
    for (const [angle, sign] of [[u,1],[v,-1]]) {
      const inward = [-Math.sin(angle)*sign,0,Math.cos(angle)*sign];
      M.bronze.face([polar(angle,R,0),polar(angle,lobbyR,0),polar(angle,lobbyR,5.4),polar(angle,R,5.4)], inward);
      // Continuous jambs join each glazed bay to its pier; no far-LOD cracks.
      M.rib.face([polar(angle,R,5.4),polar(angle,R-inset,5.4),polar(angle,R-inset,140.5),polar(angle,R,140.5)], inward);
    }
    if (entry) {
      b.bar('bronze', polar((u+v)/2,lobbyR+0.1,0.07),polar((u+v)/2,lobbyR+0.1,4.0),0.12,0.12);
      b.bar('bronze', polar(u,lobbyR+0.1,3.9),polar(v,lobbyR+0.1,3.9),0.14,0.12);
    }
    for (let f = 0; f < rows; f++) {
      const y = 5.4 + f * pitch, sill = near ? 0.76 : 1.24;
      const w0 = y + sill, w1 = y + pitch - 0.22;
      strip(M.terracotta, u, v, R, f === 0 ? y : y - 0.22, w0);
      if (f === rows-1) strip(M.terracotta,u,v,R,w1,140.5);
      // Hashed occupancy avoids artificial diagonal strings of illuminated windows.
      let h = Math.imul(j + 1, 0x45d9f3b) ^ Math.imul(f + 7, 0x27d4eb2d);
      h = Math.imul(h ^ (h >>> 16), 0x45d9f3b);
      const lit = ((h ^ (h >>> 16)) >>> 0) / 4294967296 < 0.16;
      strip(M[lit ? 'glow' : 'glass'], u, v, R - inset, w0, w1);
      if (near) {
        M.rib.face([polar(u,R,w0),polar(v,R,w0),polar(v,R-inset,w0),polar(u,R-inset,w0)],[0,1,0]);
        M.terracotta.face([polar(u,R,w1),polar(v,R,w1),polar(v,R-inset,w1),polar(u,R-inset,w1)],[0,-1,0]);
        const mid = (u+v)/2;
        strip(M.metal,mid-0.025/R,mid+0.025/R,R-inset+0.06,w0,w1);
      }
    }
    strip(M.rib, a-halfPier, c-halfPier, R, 140.5, 141.9);
    M.roof.face([[0,141.88,0],polar(a,R,141.88),polar(c,R,141.88)],[0,1,0]);
  }
  // Four planar glass faces: mapped square, not a circular cone.
  const k = mercStretch(SPEC.origin[1]);
  const corners = ROOF_RING.map(([lng,lat]) => [(lngToMercX(lng)-lngToMercX(SPEC.origin[0]))/k,141.9,(-latToMercY(lat)+latToMercY(SPEC.origin[1]))/k]);
  const apex = [corners.reduce((s,p)=>s+p[0],0)/4,165,corners.reduce((s,p)=>s+p[2],0)/4];
  const mix = (a,c,t) => a.map((v,i)=>v+(c[i]-v)*t);
  for (let f = 0; f < 4; f++) {
    const a = corners[f], c = corners[(f+1)%4];
    const outward = [(a[0]+c[0])/2,12,(a[2]+c[2])/2];
    M.roof.face([a,c,apex],outward);
    const len = Math.hypot(...outward), offset = p => p.map((v,i)=>v+outward[i]/len*(near?0.045:0.08));
    const levels = near ? 14 : 6;
    for (let h = 0; h < levels; h++) {
      const t = h / levels;
      b.bar('metal',offset(mix(a,apex,t)),offset(mix(c,apex,t)),near?0.10:0.16);
    }
    const divisions = near ? 10 : 4;
    for (let j=0;j<=divisions;j++) b.bar('metal',offset(mix(a,c,j/divisions)),offset(mix(mix(a,c,j/divisions),apex,0.985)),near?0.10:0.16);
  }
  for (const [name,s] of Object.entries(M)) if (s.i.length) b.put(s.geometry(),name);
  const root = b.finish();
  root.traverse(o => { if(o.isMesh) o.geometry.deleteAttribute('bridgeLift'); });
  return root;
}
