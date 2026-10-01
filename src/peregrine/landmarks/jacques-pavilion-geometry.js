import { Shape, ExtrudeGeometry } from 'three';
import alignment from './montreal-alignments.js';

/** Original Art Deco massing, mapped footprint; vertical dimensions estimated.
 * Every facade/tower vertex shares one rigid island base, independent of the
 * roadway's width fit and the terrain pixels under individual corners.
 */
export function addJacquesPavilion(b, profile, detail) {
  const ring = alignment.jacques.pavilion.footprint.map(ll => profile.bridgeLocal(...ll));
  const base = profile.landmarks.island, roof = profile.deckHeight(base) - 1.02;
  const shape = new Shape();
  ring.forEach((p, i) => i ? shape.lineTo(p.x, -p.z) : shape.moveTo(p.x, -p.z));
  const body = new ExtrudeGeometry(shape, { depth: roof, bevelEnabled: false, steps: 1 });
  body.rotateX(-Math.PI / 2); b.put(body, 'concrete', 4, 0, base);
  const yaw = -Math.atan2(ring[17].z - ring[0].z, ring[17].x - ring[0].x);
  for (const [a, c] of [[0,22],[2,3],[10,11],[16,17]]) {
    const x = (ring[a].x + ring[c].x) / 2, z = (ring[a].z + ring[c].z) / 2;
    b.localBox('concrete', [x,15.8,z], [7,31.6,6.8], yaw, 4, 0, base);
    b.localBox('stone', [x,31.8,z], [7.5,.4,7.3], yaw, 4, 0, base);
    b.localBox('concrete', [x,32.5,z], [5.8,1,5.7], yaw, 4, 0, base);
  }
  // Tall paired windows and recessed-looking entrances. Both LODs retain the
  // facade rhythm and four towers; fine sill bands are near-only.
  for (let i = 1; i < ring.length; i++) {
    const a = ring[i-1], c = ring[i], dx = c.x-a.x, dz = c.z-a.z, length = Math.hypot(dx,dz);
    if (length < 10) continue;
    const angle = -Math.atan2(dz,dx), count = Math.floor(length/4.2);
    for (let j = 0; j < count; j++) {
      const t = (j+.5)/count, x = a.x+dx*t, z = a.z+dz*t;
      for (const y of [3,7.5,12,16.5]) {
        b.localBox('glass', [x,y,z], [1.6,2.5,.24], angle, 4, 0, base);
        if (detail === 'near') b.localBox('stone', [x,y-1.3,z], [1.95,.18,.34], angle, 4, 0, base);
      }
    }
    if (length > 25) {
      b.localBox('glass', [(a.x+c.x)/2,3,(a.z+c.z)/2], [3.4,6,.3], angle, 4, 0, base);
      b.localBox('stone', [(a.x+c.x)/2,6.2,(a.z+c.z)/2], [4.1,.45,.55], angle, 4, 0, base);
    }
  }
}
