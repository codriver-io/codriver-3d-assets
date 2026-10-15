import * as THREE from 'three';

// Original block lettering; curved surface quads, no font or copied logo.
const glyphs = {
  A: [[0,0,0.25,1.4],[0.65,0,0.9,1.4],[0.2,1.15,0.7,1.4],[0.2,0.6,0.7,0.82]],
  C: [[0,0,0.23,1.4],[0.2,0,0.9,0.23],[0.2,1.17,0.9,1.4]],
  P: [[0,0,0.23,1.4],[0.2,1.17,0.85,1.4],[0.2,0.65,0.85,0.88],[0.67,0.8,0.9,1.2]],
  I: [[0.15,0,0.75,0.23],[0.35,0.2,0.55,1.2],[0.15,1.17,0.75,1.4]],
  T: [[0.33,0,0.57,1.2],[0,1.17,0.9,1.4]],
  O: [[0,0.15,0.23,1.25],[0.67,0.15,0.9,1.25],[0.15,0,0.75,0.23],[0.15,1.17,0.75,1.4]],
  L: [[0,0,0.23,1.4],[0.2,0,0.9,0.23]],
  R: [[0,0,0.23,1.4],[0.2,1.17,0.85,1.4],[0.2,0.65,0.85,0.88],[0.67,0.8,0.9,1.2],[0.5,0,0.8,0.65]],
  E: [[0,0,0.23,1.4],[0.2,0,0.9,0.23],[0.2,0.6,0.8,0.83],[0.2,1.17,0.9,1.4]],
  D: [[0,0,0.23,1.4],[0.67,0.2,0.9,1.2],[0.2,0,0.75,0.23],[0.2,1.17,0.75,1.4]],
  S: [[0,0.7,0.23,1.25],[0.15,1.17,0.9,1.4],[0.15,0.6,0.75,0.83],[0.67,0.15,0.9,0.7],[0,0,0.75,0.23]],
};
export function lettering(b) {
  const text = 'CAPITOL RECORDS', radius = 10.23;
  for (let repeat = 0; repeat < 3; repeat++) for (let i = 0; i < text.length; i++) {
    if (!glyphs[text[i]]) continue;
    // 0.33 m proud of the drum, with generated material depth ordering.
    for (const [x0,y0,x1,y1] of glyphs[text[i]]) {
      const a = repeat * Math.PI * 2 / 3 + ((i - (text.length - 1) / 2) * 1.12 + x0 - 0.45) / radius;
      const c = a + (x1 - x0) / radius;
      const pos = [radius*Math.sin(a),47.25+y0,radius*Math.cos(a),radius*Math.sin(a),47.25+y1,radius*Math.cos(a),radius*Math.sin(c),47.25+y1,radius*Math.cos(c),radius*Math.sin(c),47.25+y0,radius*Math.cos(c)];
      const g = new THREE.BufferGeometry();
      g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));
      g.setIndex([0,3,1,1,3,2]); g.computeVertexNormals(); b.put(g,'sign');
    }
  }
}
