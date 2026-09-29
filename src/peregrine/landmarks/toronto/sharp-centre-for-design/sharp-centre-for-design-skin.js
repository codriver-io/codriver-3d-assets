// The tabletop's pixelated skin: a grid of ~1 m modules, each white aluminium, a black
// "pixel" or a window. The pattern is pseudo-random with a fixed seed (the real layout
// is Alsop's own composition, not surveyed), with the density and module size measured
// from photographs: a ~0.75 m module (12 rows on the 9 m wall), walls ~13 % black in
// mostly 1 x 1 pixels with occasional pairs and bars, ~13 % windows of 2 x 2 to 4 x 2
// modules kept off the top and bottom row; the soffit ~13 % black with larger 2 x 2 to
// 4 x 3 patches. The pattern is DATA: it
// decides which cells become geometry, so the split between white and black is a real
// material split, never a texture.
export const WHITE = 0, BLACK = 1, WINDOW = 2;

export function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const pick = (list, r) => { let x = r(), acc = 0; for (const s of list) { acc += s[2]; if (x < acc) return s; } return list[list.length - 1]; };

const WALL_BLACK = [[1, 1, 0.82], [2, 1, 0.07], [1, 2, 0.06], [2, 2, 0.02], [3, 1, 0.015], [1, 3, 0.015]];
const WALL_WINDOWS = [[3, 2, 0.34], [2, 2, 0.26], [3, 3, 0.16], [4, 2, 0.1], [2, 3, 0.1], [2, 1, 0.04]];
const SOFFIT_BLACK = [[1, 1, 0.44], [2, 1, 0.14], [1, 2, 0.13], [2, 2, 0.11], [3, 2, 0.05], [2, 3, 0.05], [3, 3, 0.05], [4, 3, 0.03]];

function fits(cells, nu, nv, i, j, w, h) {
  if (i < 0 || j < 0 || i + w > nu || j + h > nv) return false;
  for (let y = j; y < j + h; y++) for (let x = i; x < i + w; x++) if (cells[y * nu + x] !== WHITE) return false;
  return true;
}
function fill(cells, nu, i, j, w, h, value) {
  for (let y = j; y < j + h; y++) for (let x = i; x < i + w; x++) cells[y * nu + x] = value;
}

/**
 * @param {{nu:number, nv:number, seed:number, kind:'wall'|'soffit'}} o
 * @returns {{nu:number, nv:number, cells:Uint8Array, windows:{i:number,j:number,w:number,h:number}[]}}
 */
export function pixelPattern({ nu, nv, seed, kind }) {
  const r = rng(seed), cells = new Uint8Array(nu * nv), windows = [];
  const total = nu * nv;
  if (kind === 'wall') {
    // Windows first, off the top and bottom rows, so the black pixels wrap them as in the photos.
    let want = total * 0.13, tries = 0;
    while (want > 0 && tries++ < total * 6) {
      const [w, h] = pick(WALL_WINDOWS, r), i = Math.floor(r() * (nu - w + 1)), j = 1 + Math.floor(r() * Math.max(1, nv - 2 - h + 1));
      if (j + h > nv - 1 || !fits(cells, nu, nv, i, j, w, h)) continue;
      fill(cells, nu, i, j, w, h, WINDOW); windows.push({ i, j, w, h }); want -= w * h;
    }
  }
  const sizes = kind === 'wall' ? WALL_BLACK : SOFFIT_BLACK;
  let want = total * (kind === 'wall' ? 0.13 : 0.13), tries = 0;
  while (want > 0 && tries++ < total * 8) {
    const [w, h] = pick(sizes, r), i = Math.floor(r() * (nu - w + 1)), j = Math.floor(r() * (nv - h + 1));
    if (!fits(cells, nu, nv, i, j, w, h)) continue;
    fill(cells, nu, i, j, w, h, BLACK); want -= w * h;
  }
  return { nu, nv, cells, windows };
}

/** Coarser copy for the far model: point-sampled so density and speckle survive. */
export function resample(p, nu, nv) {
  const cells = new Uint8Array(nu * nv);
  for (let j = 0; j < nv; j++) for (let i = 0; i < nu; i++) {
    cells[j * nu + i] = p.cells[Math.min(p.nv - 1, Math.floor((j + 0.5) * p.nv / nv)) * p.nu + Math.min(p.nu - 1, Math.floor((i + 0.5) * p.nu / nu))];
  }
  return { nu, nv, cells, windows: [] };
}

export const coverage = (p) => {
  let b = 0, w = 0; for (const c of p.cells) { if (c === BLACK) b++; else if (c === WINDOW) w++; }
  return { black: b / p.cells.length, window: w / p.cells.length };
};
