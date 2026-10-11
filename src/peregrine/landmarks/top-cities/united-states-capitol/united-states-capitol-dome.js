import * as THREE from 'three';
import { DX, DZ, TIP, Y, DOME_R, DOME_PROFILE, PERISTYLE, THOLOS, domeRadius } from './united-states-capitol-plan.js';

// Thomas U. Walter's cast-iron dome (1855–1866), painted to match the marble:
// a 36-column peristyle, a ribbed outer shell, a 12-column tholos and the bronze
// Statue of Freedom. The shell is white stone, not gilded.

function ribGeometry(angle, steps, width, rise) {
  const pos = [], idx = [];
  const y0 = DOME_PROFILE[0][1], y1 = DOME_PROFILE[DOME_PROFILE.length - 1][1];
  for (let i = 0; i <= steps; i++) {
    const y = y0 + ((y1 - y0) * i) / steps;
    const r = domeRadius(y);
    const yb = Math.min(y1, y + 0.35), ya = Math.max(y0, y - 0.35);
    const nr = (domeRadius(ya) - domeRadius(yb)) / (yb - ya || 1);
    const nl = Math.hypot(nr, 1);
    const peakR = r + (1 / nl) * rise, peakY = y + (nr / nl) * rise;
    const half = Math.min(width / 2, r * 0.45) / Math.max(r, 0.4);
    for (const [rr, yy, da] of [[r + 0.04, y, -half], [peakR, peakY, 0], [r + 0.04, y, half]]) {
      pos.push(DX + rr * Math.cos(angle + da), yy, DZ + rr * Math.sin(angle + da));
    }
  }
  for (let i = 0; i < steps; i++) {
    const a = i * 3, c = (i + 1) * 3;
    idx.push(a, c, a + 1, a + 1, c, c + 1, a + 1, c + 1, a + 2, a + 2, c + 1, c + 2);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setIndex(idx);
  g.computeVertexNormals();
  return g;
}

export function buildDome(kit) {
  const { prism, lathe, bar, quad, put, near } = kit;
  const seg = near ? 36 : 24;
  const ribs = near ? 36 : 18;
  const colSides = near ? 8 : 5;

  // Circular podium on the centre roof, then the peristyle.
  const podiumR = DOME_R + 0.55;
  prism('stone', DX, DZ, podiumR, seg, 24.55, 28.4, 0);
  prism('stone', DX, DZ, DOME_R + 0.15, seg, 28.25, 31.6, 0);
  prism('stone2', DX, DZ, 16.15, seg, 31.35, 42.65, 0); // wall behind the columns
  prism('stone', DX, DZ, DOME_R, seg, 42.25, 44.4, 0); // entablature
  prism('stone', DX, DZ, 16.8, seg, 44.2, 51.65, 0); // attic the shell springs from

  const colR = 18.55, colRad = 0.62;
  for (let k = 0; k < PERISTYLE; k++) {
    const a = (k * 2 * Math.PI) / PERISTYLE;
    const x = DX + colR * Math.cos(a), z = DZ + colR * Math.sin(a);
    // Shaft 32.3–45.15, base and capital overlapping the podium and the entablature.
    if (near) {
    const g = new THREE.CylinderGeometry(colRad, colRad * 1.05, 10.65, colSides, 1, true);
    g.translate(x, 37.325, z);
    put(g, 'stone');
    const base = new THREE.CylinderGeometry(colRad * 1.35, colRad * 1.5, 0.55, colSides, 1, false);
    base.translate(x, 31.8, z);
    put(base, 'stone');
    const cap = new THREE.CylinderGeometry(colRad * 1.55, colRad * 1.2, 0.85, colSides, 1, false);
    cap.translate(x, 42.1, z);
    put(cap, 'stone');
    } else {
      prism('stone', x, z, colRad, 4, 31.5, 42.55);
    }
    // window in the bay, on the drum, just outside the stone2 core
    if (near || k % 2 === 0) {
      const wa = a + Math.PI / PERISTYLE;
      const wr = 16.32;
      quad('light',
        new THREE.Vector3(DX + wr * Math.cos(wa), 36.9, DZ + wr * Math.sin(wa)),
        new THREE.Vector3(Math.cos(wa), 0, Math.sin(wa)),
        near ? 1.35 : 1.7, 6.0);
    }
  }

  // Attic windows, one per column bay.
  {
    for (let k = 0; k < PERISTYLE; k++) {
      const a = ((k + 0.5) * 2 * Math.PI) / PERISTYLE;
      quad('light',
        new THREE.Vector3(DX + 16.97 * Math.cos(a), 47.7, DZ + 16.97 * Math.sin(a)),
        new THREE.Vector3(Math.cos(a), 0, Math.sin(a)),
        1.05, 4.2);
    }
  }

  // Balustrade under the columns and above the entablature: a rail in both LODs, posts near.
  prism('stone', DX, DZ, podiumR + 0.08, seg, 30.85, 31.55, 0, podiumR - 0.35);
  prism('stone', DX, DZ, DOME_R - 0.25, seg, 44.25, 45.05, 0, DOME_R - 0.55);
  if (near) {
    for (let k = 0; k < PERISTYLE; k++) {
      const a = ((k + 0.5) * 2 * Math.PI) / PERISTYLE;
      bar('stone',
        [DX + (podiumR - 0.15) * Math.cos(a), 28.35, DZ + (podiumR - 0.15) * Math.sin(a)],
        [DX + (podiumR - 0.15) * Math.cos(a), 30.95, DZ + (podiumR - 0.15) * Math.sin(a)],
        0.38, 0.38);
    }
  }

  lathe('stone', DX, DZ, DOME_PROFILE, seg);
  const ribSteps = near ? 8 : 5;
  for (let k = 0; k < ribs; k++) {
    put(ribGeometry((k * 2 * Math.PI) / ribs, ribSteps, near ? 0.55 : 0.95, near ? 0.28 : 0.42), 'stone');
  }
  // Two mouldings splitting the shell into the three bands a driver reads.
  prism('stone', DX, DZ, domeRadius(56.4) + 0.22, seg, 56.15, 56.7, 0);
  prism('stone', DX, DZ, domeRadius(60.6) + 0.2, seg, 60.35, 60.85, 0);

  if (near) {
    for (const y of [53.6]) {
      const r = domeRadius(y) + 0.16;
      for (let k = 0; k < ribs; k++) {
        const a = ((k + 0.5) * 2 * Math.PI) / ribs;
        quad('light',
          new THREE.Vector3(DX + r * Math.cos(a), y, DZ + r * Math.sin(a)),
          new THREE.Vector3(Math.cos(a), 0, Math.sin(a)),
          0.85, 1.65);
      }
    }
  }

  // Tholos: observation balcony at 210 ft, twelve columns, a glowing core, a small cupola.
  prism('stone', DX, DZ, 6.7, near ? 18 : 12, 64.01, 65.55, 0);
  prism('lamp', DX, DZ, 3.15, 10, 65.4, 71.35, 0);
  prism('stone', DX, DZ, 5.15, near ? 16 : 10, 70.9, 72.55, 0);
  const tholosR = 4.55;
  for (let k = 0; k < THOLOS; k++) {
    const a = (k * 2 * Math.PI) / THOLOS;
    const x = DX + tholosR * Math.cos(a), z = DZ + tholosR * Math.sin(a);
    const g = new THREE.CylinderGeometry(0.32, 0.36, 5.85, near ? 6 : 4, 1, true);
    g.translate(x, 68.3, z);
    put(g, 'stone');
  }
  lathe('stone', DX, DZ, [[4.3, 72.3], [4.15, 73.1], [3.5, 74.3], [2.45, 75.35], [1.55, 76.15]], near ? 16 : 10);

  // Pedestal (white) and the bronze globe the figure stands on.
  prism('stone', DX, DZ, 2.15, near ? 12 : 8, 76.05, 79.15, 0, 1.85);
  const globe = new THREE.SphereGeometry(1.28, near ? 12 : 8, near ? 10 : 6);
  globe.translate(DX, 80.4, DZ);
  put(globe, 'bronze');
  prism('bronze', DX, DZ, 1.05, 8, 81.35, 81.95, 0);

  // Robed figure. A lathe reads as the statue at 800 m; the eagle-crest spikes are the silhouette.
  const robe = [
    [1.15, 81.6], [1.42, 82.6], [1.28, 84.2], [0.72, 85.35], [0.95, 86.15], [0.38, 86.45], [0.46, 87.0], [0.16, 87.12],
  ];
  lathe('bronze', DX, DZ, robe, near ? 10 : 6);
  for (let i = -3; i <= 3; i++) {
    const t = i / 3;
    const h = TIP - Math.abs(i) * 0.13;
    bar('bronze', [DX, 86.95, DZ], [DX + 0.05, h, DZ + t * 0.34], i === 0 ? 0.1 : 0.06);
  }
  // Wreath arm toward the east, so the figure has a front.
  if (near) {
    bar('bronze', [DX + 0.15, 85.5, DZ], [DX + 0.85, 85.15, DZ + 0.35], 0.14, 0.1);
    bar('bronze', [DX + 0.1, 85.4, DZ], [DX + 0.45, 84.2, DZ - 0.15], 0.12, 0.1);
  }
}
