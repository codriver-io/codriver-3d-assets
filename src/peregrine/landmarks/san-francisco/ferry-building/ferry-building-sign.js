// "PORT OF" and "SAN FRANCISCO": the two roof signs of the bay side, block letters on steel frames. They read left to
// right from the bay, so "PORT OF" stands at the south-south-east end of the nave (low u) and "SAN FRANCISCO" at the
// north-north-west end (high u); seen from Market Street the letters are mirrored, as on the real building.
// Each glyph is a 4 x 5 grid of cells; a '#' cell is a block.
const GLYPHS = {
  P: ['###.', '#..#', '###.', '#...', '#...'],
  O: ['.##.', '#..#', '#..#', '#..#', '.##.'],
  R: ['###.', '#..#', '###.', '#.#.', '#..#'],
  T: ['####', '.##.', '.##.', '.##.', '.##.'],
  F: ['####', '#...', '###.', '#...', '#...'],
  S: ['.###', '#...', '.##.', '...#', '###.'],
  A: ['.##.', '#..#', '####', '#..#', '#..#'],
  N: ['#..#', '##.#', '#.##', '#..#', '#..#'],
  C: ['.###', '#...', '#...', '#...', '.###'],
  I: ['####', '.##.', '.##.', '.##.', '####'],
};

export const SIGN = {
  v: 2.0,           // plane of the letters, on the nave roof (est.)
  yBase: 18.9,      // underside of the letters (est.: ridge 17.5 m, steel frames 1.4 m high)
  height: 3.0,      // letter height (est. ~3 m from the bay-side photographs)
  pitch: 2.2,       // advance per character
  width: 1.7,       // letter width
  depth: 0.35,
  words: [{ text: 'PORT OF', u0: -25.2 }, { text: 'SAN FRANCISCO', u0: 11.9 }],
};

/** Letter blocks of one word as boxes [u0, u1, y0, y1] in the facade frame (v and depth are the caller's). */
export function wordBoxes(text, u0, y0 = SIGN.yBase, pitch = SIGN.pitch, width = SIGN.width, height = SIGN.height) {
  const out = [], cw = width / 4, ch = height / 5;
  [...text].forEach((c, i) => {
    const g = GLYPHS[c];
    if (!g) return;
    const x0 = u0 + i * pitch;
    g.forEach((row, r) => {
      const yTop = y0 + height - r * ch;
      for (let k = 0; k < 4; k++) {
        if (row[k] !== '#') continue;
        let e = k; while (e + 1 < 4 && row[e + 1] === '#') e++;
        out.push([x0 + k * cw, x0 + (e + 1) * cw, yTop - ch, yTop]);
        k = e;
      }
    });
  });
  return out;
}
export const wordLength = (text) => (text.length - 1) * SIGN.pitch + SIGN.width;
