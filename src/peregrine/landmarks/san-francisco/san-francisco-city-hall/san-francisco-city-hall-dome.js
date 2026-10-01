import * as THREE from 'three';

// The rotunda: round stage on the central block, the colonnaded drum, the slate dome with its
// twenty-four gilded ribs, the gilded lantern and the spire. Heights are metres above local grade.
export const DOME = {
  blockTop: 33.0, // cornice of the square block under the drum
  stageBase: 32.2,
  stageTop: 40.4, // round rusticated stage
  plinthTop: 42.0, // balustrade course under the colonnade
  colonnadeTop: 51.6, // coupled-column drum
  corniceTop: 54.0,
  atticTop: 59.0, // dome springs here (OSM part: 60 m)
  radius: 13.9, // dome base radius (OSM part: 13.7 m)
  rise: 15.4, // semi-axis of the dome's ellipse: crown at about 73.6 m
  crownRadius: 4.4, // where the lantern base closes the dome
  tip: 93.7, // 307.5 ft to the finial
};

export const dome = {
  /** point on the dome's outer surface at parameter t (radians up from the springing) */
  surface(t) { return { r: DOME.radius * Math.cos(t), y: DOME.atticTop + DOME.rise * Math.sin(t) }; },
  get tMax() { return Math.acos(DOME.crownRadius / DOME.radius); },
  get crownY() { return DOME.atticTop + DOME.rise * Math.sin(this.tMax); },
};

// A triangular-section gilded rib along one meridian, standing proud of the dome surface.
function ribGeometry(angle, steps, width, height) {
  const pos = [], idx = [], tMax = dome.tMax;
  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * tMax, { r, y } = dome.surface(t);
    const nr = Math.cos(t) / DOME.radius, ny = Math.sin(t) / DOME.rise, nl = Math.hypot(nr, ny);
    const peak = { r: r + (nr / nl) * height, y: y + (ny / nl) * height };
    const half = Math.min(width / 2, r * 0.9) / Math.max(r, 1e-3); // angular half-width
    for (const [rr, yy, da] of [[r, y, -half], [peak.r, peak.y, 0], [r, y, half]]) pos.push(rr * Math.sin(angle + da), yy, rr * Math.cos(angle + da));
  }
  for (let i = 0; i < steps; i++) { const a = i * 3, c = (i + 1) * 3; idx.push(a, a + 1, c, a + 1, c + 1, c, a + 1, a + 2, c + 1, a + 2, c + 2, c + 1); }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setIndex(idx); g.computeVertexNormals();
  return g;
}

/**
 * Builds the rotunda about the vertical axis through (cx, cz).
 * `kit` is makeKit(...); `near` selects the detail level.
 */
export function buildRotunda(kit, near, cx = 0, cz = 0) {
  const { lathe, prism, wbox, bar, frame, put } = kit;
  const D = DOME, SEG = near ? 24 : 12, tMax = dome.tMax;
  const at = (r, a) => [cx + r * Math.cos(a), cz + r * Math.sin(a)]; // polar -> (x, z); angle from +x toward +z

  // Round stage, balustrade course, coupled-column drum, cornice, attic.
  prism('stone', cx, cz, 18.2, near ? 24 : 12, D.stageBase, D.stageTop, 0);
  if (near) for (let y = D.stageBase + 5.4; y < D.stageTop - 0.3; y += 1.2) prism('stone2', cx, cz, 18.27, 24, y, y + 0.14, 0); // rustication joints
  prism('stone', cx, cz, 18.9, near ? 24 : 12, D.stageTop, D.plinthTop, 0);
  const SIDES = 16, core = 15.8, apothem = core * Math.cos(Math.PI / SIDES);
  prism('stone', cx, cz, core, SIDES, D.plinthTop - 0.2, D.colonnadeTop + 0.2, Math.PI / SIDES);
  prism('stone', cx, cz, 18.3, SIDES, D.colonnadeTop, D.corniceTop, Math.PI / SIDES);
  prism('stone', cx, cz, 15.2, near ? 24 : 12, D.corniceTop, D.atticTop + 0.2, 0);

  // Windows on the sixteen facets, coupled columns and urns at the sixteen corners.
  // CylinderGeometry corners sit at angle k*22.5 deg from +z; after the half-step phase the
  // facets face 0, 22.5, ... from +z, which is also from +x for a regular 16-gon.
  for (let k = 0; k < SIDES; k++) {
    const a = (k * 2 * Math.PI) / SIDES; // outward direction of the facet
    const [fx, fz] = at(apothem + 0.06, a);
    const w = frame(fx, fz, a); // phi = angle of outward normal in the (x, z) plane
    w.quad('glass', -1.2, 1.2, D.plinthTop + 1.3, D.plinthTop + 7.0, 0);
    w.box('stone', -1.5, 1.5, D.plinthTop + 7.0, D.plinthTop + 7.5, -0.05, 0.25); // lintel
    if (near) w.box('stone', -1.4, 1.4, D.plinthTop + 0.6, D.plinthTop + 1.0, -0.05, 0.3); // sill
    const corner = a + Math.PI / SIDES; // coupled columns at the polygon's corner
    const [px, pz] = at(core + 1.45, corner);
    const c = frame(px, pz, corner);
    if (near) { for (const s of [-0.8, 0.8]) c.col('stone', s, 0.35, D.plinthTop, D.colonnadeTop, 0.5); c.box('stone', -1.4, 1.4, D.plinthTop, D.colonnadeTop, -1.45, -0.2); }
    else c.box('stone', -1.4, 1.4, D.plinthTop, D.colonnadeTop, -1.45, 0.9);
    const [ux, uz] = at(16.4, corner);
    bar('stone', [ux, D.corniceTop, uz], [ux, D.corniceTop + 3.2, uz], 0.9, 0.9);
  }

  // Dome: slate-blue shell with a short vertical rim, then the gilded ribs and band.
  const steps = near ? 9 : 5, profile = [[D.radius, D.atticTop - 0.2], [D.radius, D.atticTop]];
  for (let i = 1; i <= steps; i++) { const { r, y } = dome.surface((i / steps) * tMax); profile.push([r, y]); }
  lathe('dome', cx, cz, profile, SEG);
  for (let k = 0; k < SEG; k++) put(ribGeometry((k * 2 * Math.PI) / SEG, near ? 9 : 5, near ? 0.5 : 1.0, near ? 0.22 : 0.45).translate(cx, 0, cz), 'lamp');
  prism('lamp', cx, cz, D.radius + 0.25, SEG, D.atticTop, D.atticTop + 0.45, 0);
  if (near) for (let k = 0; k < SEG; k += 2) { // gilded cartouches between the ribs, a third of the way up
    const a = ((k + 0.5) * 2 * Math.PI) / SEG, t = 0.5, p = dome.surface(t);
    const nr = Math.cos(t) / D.radius, ny = Math.sin(t) / D.rise, nl = Math.hypot(nr, ny);
    const n = new THREE.Vector3((nr / nl) * Math.sin(a), ny / nl, (nr / nl) * Math.cos(a));
    const up = new THREE.Vector3(-ny / nl * Math.sin(a), nr / nl, -ny / nl * Math.cos(a)); // along the meridian, upward
    const side = new THREE.Vector3().crossVectors(up, n);
    const g = new THREE.BoxGeometry(1.5, 1.7, 0.35).applyMatrix4(new THREE.Matrix4().makeBasis(side, up, n));
    g.translate(cx + p.r * Math.sin(a) + n.x * 0.12, p.y + n.y * 0.12, cz + p.r * Math.cos(a) + n.z * 0.12);
    put(g, 'lamp');
  }

  // Lantern and spire.
  const y0 = dome.crownY;
  prism('stone2', cx, cz, 5.7, near ? 12 : 8, y0 - 0.3, y0 + 0.5, 0);
  prism('light', cx, cz, 3.1, 8, y0 + 0.5, y0 + 5.9, Math.PI / 8);
  for (let k = 0; k < 8; k++) {
    const [lx, lz] = at(3.45, (k * Math.PI) / 4 + Math.PI / 8);
    bar('lamp', [lx, y0 + 0.5, lz], [lx, y0 + 6.1, lz], 0.45, 0.45);
    if (near) { const [px, pz] = at(5.0, (k * Math.PI) / 4); bar('lamp', [px, y0 + 0.5, pz], [px, y0 + 3.4, pz], 0.5, 0.5); }
  }
  prism('lamp', cx, cz, 4.3, 8, y0 + 5.9, y0 + 6.7, Math.PI / 8);
  prism('lamp', cx, cz, 1.9, 8, y0 + 6.7, y0 + 10.1, Math.PI / 8);
  prism('lamp', cx, cz, 2.6, 8, y0 + 10.1, y0 + 10.7, Math.PI / 8);
  if (near) for (let k = 0; k < 4; k++) { const [px, pz] = at(2.9, (k * Math.PI) / 2 + Math.PI / 4); bar('lamp', [px, y0 + 6.7, pz], [px, y0 + 9.0, pz], 0.4, 0.4); }
  const spireBase = y0 + 10.7, spireTop = D.tip - 2.2;
  prism('dome', cx, cz, 1.3, 8, spireBase, spireTop, 0, 0.1);
  bar('lamp', [cx, spireTop - 0.1, cz], [cx, D.tip - 0.4, cz], 0.3, 0.3);
  prism('lamp', cx, cz, 0.45, 6, D.tip - 0.8, D.tip, 0, 0.02);
}
