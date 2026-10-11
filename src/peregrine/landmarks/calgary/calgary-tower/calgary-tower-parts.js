// Calgary Tower: the five things a driver reads from the road, each a function of the builder.
// shaft() the tapering concrete column, base() the glass rotunda at its foot, pod() the turret (ribbed
// soffit, red-clad observation level, brown rim, white dome, drum), crown() the cauldron and the mast.
// Numbers live in calgary-tower-shape.js. `ctx.near` selects the detail; `ctx.m(name)` merges the minor
// far materials into their neighbours (metal -> white, lamp -> light) so the far model stays at 7 draws.
import { lathe, beams, lamp, skylight, at, tangent } from './calgary-tower-mesh.js';
import { SHAFT, shaftRadius, ROTUNDA, POD, CROWN, ROOF, TIP } from './calgary-tower-shape.js';

const range = (n, fn) => Array.from({ length: n }, (_, i) => fn(i));

/** The tapering column: ~15 m across at the foot, ~10 m under the pod, concave flare near the ground. */
export function shaft(b, { near }) {
  const n = near ? 14 : 7, seg = near ? 32 : 16;
  const rows = range(n + 1, (i) => { const h = ROTUNDA.roofTop + (SHAFT.hTop - ROTUNDA.roofTop) * Math.pow(i / n, 1.3); return [shaftRadius(h), h]; });
  lathe(b, 'concrete', rows, seg);
}

/** The glass rotunda: plinth, glazed wall with mullions and floor bands, eave, shallow cone roof meeting the shaft. */
export function base(b, { near, m }) {
  const R = ROTUNDA, seg = near ? 48 : 24;
  if (near) {
    lathe(b, 'concrete', [[R.rEave, 0], [R.rEave, R.plinth], [R.r, R.plinth]], seg);      // plinth wall and its ledge
    for (const h of R.floors) lathe(b, 'concrete', [[R.r, h - 0.2], [R.rEave, h - 0.2], [R.rEave, h + 0.2], [R.r, h + 0.2]], seg);
    const list = range(48, (i) => ({ from: at(i * 7.5, R.r, R.plinth), to: at(i * 7.5, R.r, R.wallTop), side: tangent(i * 7.5), width: 0.14, thick: 0.24 }));
    beams(b, 'metal', list, { caps: false });
  }
  lathe(b, 'glass', [[R.r, near ? R.plinth : 0], [R.r, R.wallTop]], seg);
  lathe(b, 'concrete', [[R.r, R.wallTop], [R.rEave, R.wallTop], [R.rEave, R.eaveTop]], seg);   // eave: soffit and fascia
  lathe(b, m('metal'), [[R.rEave, R.eaveTop], [shaftRadius(R.roofTop), R.roofTop]], seg);        // the cone roof
}

/** The turret. */
export function pod(b, { near, m }) {
  const P = POD, seg = near ? 72 : 36, flutes = near ? P.panels * 2 : seg, g = near ? P.flute : 0;
  const fluted = (rows, depth) => rows.map(([r, h, f]) => [r, h, f ? depth : 0]);

  lathe(b, 'white', P.soffit, seg);
  lathe(b, 'red', fluted(P.redLow, g), flutes);
  lathe(b, 'glow', P.obs, seg);
  lathe(b, 'red', fluted(P.redUp, near ? 0.18 : 0), flutes);
  lathe(b, 'glow', P.clerestory, seg);
  lathe(b, 'brown', P.rim, seg);
  lathe(b, 'white', P.dome, seg);
  lathe(b, 'brown', P.drum, seg);
  lathe(b, 'brown', [[P.drum[1][0], ROOF], [CROWN.pedestal.r, ROOF]], seg);   // the drum's flat roof

  // the glass-floor extension on the north side of the observation deck (opened 2005)
  const F = P.glassFloor, rc = (12.2 + 12.7 + F.out) / 2, depth = 12.7 + F.out - 12.2;
  b.box('glow', at(F.bearing, rc, (F.h0 + F.h1) / 2), [F.width, F.h1 - F.h0, depth], -F.bearing * Math.PI / 180);

  if (!near) return;

  // radial ribs under the soffit, following its profile (proud 0.1 m, ends left open: they are hidden in the joints)
  const ribs = [];
  for (let i = 0; i < 48; i++) {
    const bearing = i * 7.5 + 3.75;
    for (let k = 0; k < P.soffit.length - 1; k++) {
      const [r0, h0] = P.soffit[k], [r1, h1] = P.soffit[k + 1];
      ribs.push({ from: at(bearing, r0, h0), to: at(bearing, r1, h1), side: tangent(bearing), width: 0.13, thick: 0.2 });
    }
  }
  beams(b, 'glass', ribs, { caps: false });

  // mullions across the two glazed bands
  for (const [[r0, h0], [r1, h1]] of [P.obs, P.clerestory]) {
    beams(b, 'metal', range(36, (i) => ({ from: at(i * 10, r0, h0), to: at(i * 10, r1, h1), side: tangent(i * 10), width: 0.14, thick: 0.26 })), { caps: false });
  }

  // railing on the rim: posts and a top rail
  const Rl = P.railing;
  beams(b, 'metal', range(Rl.posts, (i) => ({ from: at(i * 360 / Rl.posts, Rl.r, Rl.post0), to: at(i * 360 / Rl.posts, Rl.r, Rl.post1), side: tangent(i * 360 / Rl.posts), width: 0.08, thick: 0.08 })), { caps: false });
  lathe(b, 'metal', [[Rl.r - 0.06, Rl.rail[0]], [Rl.r + 0.06, Rl.rail[0]], [Rl.r + 0.06, Rl.rail[1]], [Rl.r - 0.06, Rl.rail[1]], [Rl.r - 0.06, Rl.rail[0]]], 72);

  // the oval skylights on the dome
  const S = P.skylights;
  for (let i = 0; i < S.n; i++) skylight(b, 'glass', (i + 0.5) * 360 / S.n, S.r, S.h, S.tilt);
}

/** The crown: pedestal, silver cauldron with its flame, the mast and the red aviation lights. */
export function crown(b, { near, m }) {
  const C = CROWN, seg = near ? 16 : 8;
  lathe(b, m('metal'), [[C.pedestal.r, ROOF], [C.pedestal.r, C.pedestal.h1]], seg);
  lathe(b, m('metal'), [...C.bowl.under, ...C.bowl.lip.slice(1), ...C.bowl.floor.slice(1)], seg * 2);
  lathe(b, m('lamp'), C.flame, seg);
  lathe(b, m('metal'), [[C.mast.r0, C.mast.h0], [(C.mast.r0 + C.mast.r1) / 2 + 0.02, (C.mast.h0 + C.mast.h1) / 2], [C.mast.r1, C.mast.h1]], near ? 8 : 6);
  lamp(b, 'light', [0, C.beacon.h, 0], C.beacon.r);
  if (near) for (const bearing of [0, 120, 240]) lamp(b, 'light', at(bearing, 4.2, ROOF + 0.15), 0.3);
}
