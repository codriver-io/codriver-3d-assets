// Plan data in the building's own frame: X along the long axis (bearing 60 deg), Z toward the south front (bearing 150 deg),
// metres from the model origin. The mapped cross-shaped outline (way/178593785) rotated by -30 deg and snapped to a rectilinear plan.
export const ROT = Math.PI / 6; // authoring frame -> world (+x east, +z south): x = X cos + Z sin, z = -X sin + Z cos
// Heights above ground (m). The main floor sits on a tall granite basement, as on the 1895 postcard.
export const H = { basement: 4.3, wing: 20.5, central: 27, tower: 59 };
export const WING_W = { x0: 18, x1: 34.8 }; // east wing 17.8..34.7, west wing -35..-18
export const CENTRAL = [[-18, 14.3], [-12.4, 14.3], [-12.4, 23.55], [12.5, 23.55], [12.5, 14.3], [18, 14.3], [18, -12.55], [12.6, -12.55], [12.6, -22.4], [-12.3, -22.4], [-12.3, -12.6], [-18, -12.6]];
export const WEST_WING = [[-35, -14.1], [-18, -14.1], [-18, 16], [-35, 16]];
export const EAST_WING = [[18, -14.1], [34.8, -14.1], [34.7, 15.5], [18, 15.5]];
export const SIDE_E = [[34.7, -3.2], [37, -3.2], [37, 5.5], [34.7, 5.5]];
export const SIDE_W = [[-39.4, -3.7], [-35, -3.7], [-35, 5], [-39.4, 5]];
// South portico and the (deeper) north portico: x half-width, wall plane and front edge of the porch, |Z| metres.
export const PORTICO = { x: 8.4, south: { zWall: 23.55, zFront: 25.55 }, north: { zWall: 22.4, zFront: 25.65 } };
export const TOWER = { x: 0, z: 0.6 };
export const DOME = { x: 26.2, z: 0.7 }; // copper dome over the east wing
export const inside = (ring, x, z) => { let c = false; for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) { const [xi, zi] = ring[i], [xj, zj] = ring[j]; if ((zi > z) !== (zj > z) && x < (xj - xi) * (z - zi) / (zj - zi) + xi) c = !c; } return c; };
export const area = (ring) => ring.reduce((a, p, i) => { const q = ring[(i + 1) % ring.length]; return a + p[0] * q[1] - q[0] * p[1]; }, 0);
