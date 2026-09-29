import * as THREE from 'three';

// The Bank of Montreal wordmark and roundel as real geometry. They are a
// landmark feature: from the CN Tower and the 401 the tower is a white slab
// with a red dot and a blue "BMO" at the top of each face. Glyph outlines are
// drawn on a unit-height grid (x right, y up), original block-serif shapes, not
// a font and not the trademark artwork traced: only the silhouette that reads at
// a distance (a bold B, M and O and a round red badge with a light chevron mark).

const poly = (pts) => new THREE.Shape(pts.map(([x, y]) => new THREE.Vector2(x, y)));
const hole = (shape, pts) => { shape.holes.push(new THREE.Path(pts.map(([x, y]) => new THREE.Vector2(x, y)))); return shape; };

function ellipsePts(cx, cy, rx, ry, n, reverse = false) {
  const pts = [];
  for (let i = 0; i < n; i++) { const a = (i / n) * Math.PI * 2 * (reverse ? -1 : 1); pts.push([cx + Math.cos(a) * rx, cy + Math.sin(a) * ry]); }
  return pts;
}

export const GLYPH_WIDTH = { B: 0.70, M: 1.02, O: 0.86 };
export const GLYPH_GAP = 0.08;
export const WORD_ADVANCE = GLYPH_WIDTH.B + GLYPH_WIDTH.M + GLYPH_WIDTH.O + GLYPH_GAP * 2;

export function glyphShape(letter) {
  if (letter === 'B') {
    const outer = poly([[0, 0], [0.36, 0], [0.54, 0.05], [0.66, 0.16], [0.68, 0.30], [0.60, 0.42], [0.50, 0.47], [0.60, 0.53], [0.66, 0.64], [0.64, 0.80], [0.54, 0.93], [0.38, 1], [0, 1]]);
    hole(outer, [[0.17, 0.10], [0.34, 0.10], [0.46, 0.17], [0.48, 0.31], [0.38, 0.39], [0.17, 0.39]]);
    hole(outer, [[0.17, 0.57], [0.33, 0.57], [0.43, 0.65], [0.44, 0.78], [0.35, 0.88], [0.17, 0.88]]);
    return outer;
  }
  if (letter === 'M') {
    return poly([[0, 0], [0.16, 0], [0.16, 0.70], [0.47, 0], [0.55, 0], [0.86, 0.70], [0.86, 0], [1.02, 0], [1.02, 1], [0.84, 1], [0.51, 0.22], [0.18, 1], [0, 1]]);
  }
  // O
  const o = poly(ellipsePts(0.43, 0.5, 0.43, 0.5, 20));
  hole(o, ellipsePts(0.43, 0.5, 0.24, 0.33, 16, true));
  return o;
}

export function wordGeometry(text, height, depth) {
  const parts = [];
  let x = 0;
  for (const letter of text) {
    const g = new THREE.ExtrudeGeometry(glyphShape(letter), { depth: 1, bevelEnabled: false, curveSegments: 6 });
    g.scale(height, height, depth); g.translate(x * height, 0, 0);
    parts.push(g); x += GLYPH_WIDTH[letter] + GLYPH_GAP;
  }
  return { parts, width: (x - GLYPH_GAP) * height };
}

export function roundelGeometry(diameter, depth, near) {
  const disc = new THREE.CylinderGeometry(diameter / 2, diameter / 2, depth, near ? 24 : 12, 1, false);
  disc.rotateX(Math.PI / 2); // axis along +z, facing outward
  disc.translate(0, 0, depth / 2);
  return disc;
}

// The light mark inside the badge: a stylised M (two peaks and a valley) over a bar.
// Original simplified outline, not the trademark artwork; it only has to read as a
// pale glyph on the red disc.
export function markGeometry(diameter, depth) {
  const k = diameter;
  const m = poly([[-.30, -.08], [-.30, .28], [-.12, .28], [0, .10], [.12, .28], [.30, .28], [.30, -.08], [.17, -.08], [.17, .11], [.07, -.03], [-.07, -.03], [-.17, .11], [-.17, -.08]].map(([x, y]) => [x * k, y * k]));
  const bar = poly([[-.30, -.24], [.30, -.24], [.30, -.15], [-.30, -.15]].map(([x, y]) => [x * k, y * k]));
  return [m, bar].map((shape) => new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: false }));
}
