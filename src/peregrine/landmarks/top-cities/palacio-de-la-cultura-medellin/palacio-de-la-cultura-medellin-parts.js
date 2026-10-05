import * as THREE from 'three';

// Original profile/surface construction; no photographs, textures or imported mesh.
export function palaceParts(b, near) {
  const put = (g, mat) => b.put(g, mat, 0, 0);
  const box = (mat, u, y, v, w, h, d) => b.box(mat, [u, y, v], [w, h, d], 0, 0, 0);
  const bar = (mat, a, c, w, d = w) => {
    if(near)return b.bar(mat,a,c,w,d,0,false,0);
    // Far ribs meet their dome surfaces: omit the buried end caps, retain all
    // four outward faces and their normals so the ribs read from every side.
    const av=new THREE.Vector3(...a),cv=new THREE.Vector3(...c),delta=cv.clone().sub(av),L=delta.length();
    if(L<1e-5)return;
    const g=new THREE.BoxGeometry(w,L,d),idx=[];
    for(let i=0;i<g.index.count;i+=3){if(Math.abs(g.attributes.normal.getY(g.index.getX(i)))>0.5)continue;idx.push(g.index.getX(i),g.index.getX(i+1),g.index.getX(i+2));}
    g.setIndex(idx);g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0),delta.normalize()));
    g.translate(...av.add(cv).multiplyScalar(0.5).toArray());put(g,mat);
  };
  const cyl = (mat, u, v, y0, y1, r, rt = r, seg = near ? 16 : 8) => {
    const g = new THREE.CylinderGeometry(rt, r, y1 - y0, seg);
    g.translate(u, (y0 + y1) / 2, v); put(g, mat);
  };
  const wall = (p, t, n) => new THREE.Matrix4().set(t[0], 0, n[0], p[0], 0, 1, 0, 0, t[1], 0, n[1], p[1], 0, 0, 0, 1);
  const at = (M, g, mat) => { g.applyMatrix4(M); put(g, mat); };
  const rect = (M, mat, x, y, w, h, z = 0.08) => at(M, new THREE.PlaneGeometry(w, h).translate(x, y, z), mat);
  const slab = (M, mat, x, y, w, h, d, z = 0.18) => {
    if(!near) return rect(M,mat,x,y,w,h,z+d/2);
    const g=new THREE.BoxGeometry(w,h,d);const idx=[];
    // The rear face is buried; retaining front and edge normals provides depth.
    for(let i=0;i<g.index.count;i+=3){const vi=g.index.getX(i);if(g.attributes.normal.getZ(vi)<-0.5)continue;idx.push(g.index.getX(i),g.index.getX(i+1),g.index.getX(i+2));}
    g.setIndex(idx);g.translate(x,y,z);at(M,g,mat);
  };
  const beam = (M, mat, a, c, w) => {
    // Flat trim ribbons at offset depths, with no buried back faces.
    const dx=c[0]-a[0],dy=c[1]-a[1],L=Math.hypot(dx,dy);
    if(L<0.001)return;
    const ox=-dy/L*w/2,oy=dx/L*w/2,z=(a[2]+c[2])/2;
    const points=[[a[0]+ox,a[1]+oy,z],[a[0]-ox,a[1]-oy,z],[c[0]-ox,c[1]-oy,z],[c[0]+ox,c[1]+oy,z]];
    const pos=points.flat(),idx=[0,1,2,0,2,3];
    const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setIndex(idx);g.computeVertexNormals();at(M,g,mat);
  };
  const arc = (x, y, w, h, seg = near ? 8 : 4) => {
    const r = w / 2, spring = y + h - r, points = [[x - r, y], [x + r, y]];
    for (let i = 0; i <= seg; i++) { const a = i / seg * Math.PI; points.push([x + r * Math.cos(a), spring + r * Math.sin(a)]); }
    return points;
  };
  const panel = (M, mat, x, y, w, h, z = 0.14) => {
    const s = new THREE.Shape(arc(x, y, w, h).map(p => new THREE.Vector2(...p)));
    at(M, new THREE.ShapeGeometry(s).translate(0, 0, z), mat);
  };
  const frame = (M, x, y, w, h, thick = 0.19, z = 0.3) => {
    const points = arc(x, y, w, h);
    for (let i = 0; i < points.length; i++) beam(M, 'cream', [...points[i], z], [...points[(i + 1) % points.length], z], thick);
  };
  function window(M, x, y, w, h, { glow = false, door = false } = {}) {
    panel(M, glow ? 'glow' : door ? 'wood' : 'glass', x, y, w, h);
    if (near || h > 5 || glow || door) frame(M, x, y, w, h, near ? 0.16 : 0.12);
    const spring = y + h - w / 2;
    beam(M, 'cream', [x, y, 0.31], [x, spring, 0.31], 0.13);
    for (const sy of near ? [y + h * 0.35, y + h * 0.7] : [y + h * 0.5]) slab(M, 'cream', x, sy, w, 0.13, 0.13, 0.3);
    if (near && h > 5) {
      for (const dx of [-w / 3, w / 3]) beam(M, 'cream', [x + dx, y, 0.31], [x + dx, spring, 0.31], 0.12);
      // Traceried fan below the enclosing arch; kept geometrically separate.
      for (const angle of [Math.PI / 6, Math.PI / 3, 2 * Math.PI / 3, 5 * Math.PI / 6]) beam(M, 'cream', [x, spring, 0.33], [x + w * 0.44 * Math.cos(angle), spring + w * 0.44 * Math.sin(angle), 0.33], 0.10);
    }
    slab(M, 'cream', x, y - 0.16, w + 0.42, 0.22, 0.4, 0.15);
  }
  function mass(ring, hole, top) {
    const shape = new THREE.Shape(ring.map(([u, v]) => new THREE.Vector2(u, -v)));
    shape.holes.push(new THREE.Path(hole.map(([u, v]) => new THREE.Vector2(u, -v))));
    const g = new THREE.ExtrudeGeometry(shape, { depth: top, bevelEnabled: false, steps: 1 });
    g.rotateX(-Math.PI / 2); put(g, 'stone');
  }
  function facade(p, q, top, { plain = false, inner = false } = {}) {
    const L = Math.hypot(q[0] - p[0], q[1] - p[1]), t = [(q[0] - p[0]) / L, (q[1] - p[1]) / L], n = [-t[1], t[0]], M = wall(p, t, n);
    const count = Math.max(1, Math.round((L - 2.3) / (plain && !inner ? 8.4 : 4.3))), pitch = (L - 2.3) / count;
    const windows = [];
    for (let i = 0; i < count; i++) {
      const x = 1.15 + (i + 0.5) * pitch;
      const u=p[0]+t[0]*x,v=p[1]+t[1]*x;
      if (L<3.4) continue; // narrow returns carry masonry, not oversize unsupported window/sill strips
      if (!plain && u>23 && v>-15.7 && v<-3.1) continue; // authored entrance replaces the generic bays
      if (plain && !inner) windows.push([x, 1.05, 0.9, 2.9], [x, 7.0, 1.15, 12.8]);
      else windows.push([x, 1.05, 1.7, 2.9], [x, 5.8, 1.95, 4.1], [x, 11.5, plain ? 1.95 : 2.8, 8.3]);
    }
    if (plain) rect(M, 'cream', L / 2, top / 2, L, top);
    else {
      // Alternating ashlar laid as separated exterior quads; coarser far courses
      // retain the contrasting masonry instead of reducing it to a tinted wall.
      const bw = near ? 1.05 : 1.8, bh = near ? 0.5 : 1.1;
      for (let row = 0; row * bh < top - 0.5; row++) {
        const y = row * bh + bh / 2;
        for (let col = 0; col * bw < L; col++) {
          if ((row + col) % 2) continue;
          const x0 = col * bw + 0.025, x1 = Math.min(L - 0.025, (col + 1) * bw - 0.025), x = (x0 + x1) / 2;
          if (x1 <= x0 || windows.some(([wx, wy, ww, wh]) => Math.abs(wx - x) < ww / 2 + bw / 2 + 0.13 && y > wy - bh / 2 && y < wy + wh + bh / 2)) continue;
          rect(M, 'cream', x, y, x1 - x0, bh - 0.05, 0.08);
        }
      }
    }
    for (const [x, y, w, h] of windows) window(M, x, y, w, h);
    for (const y of [0.5, 4.6, 10.6, 20.5, 22.35]) {
      slab(M, 'cream', L / 2, y, L, y > 22 ? 0.35 : 0.24, y > 20 ? 0.6 : 0.34, 0.08);
    }
    if (!plain) {
      // Thin engaged piers, ornate capitals and framed panels between bays.
      for (let i = 0; i <= count; i++) {
        const x = 1.15 + i * pitch;
        slab(M, 'cream', x, 15.7, 0.27, 9.0, 0.42, 0.14);
        slab(M, 'cream', x, 20.0, 0.6, 0.25, 0.5, 0.17);
        // Friezes belong BETWEEN consecutive piers: the final pier has no
        // following bay. This also keeps every small carved disk on its wall.
        if (near && i<count && pitch>1.0) for (const y of [5.1, 10.9, 21.3]) {
          rect(M, 'stone', x + pitch / 2, y, Math.min(1.5, pitch * 0.5), 0.45, 0.31);
          for (const d of [-0.4, 0, 0.4]) {
            const g = new THREE.CircleGeometry(0.13, 6); g.translate(x + pitch / 2 + d, y, 0.38); at(M, g, 'cream');
          }
        }
      }
      // Continuous parapet, with genuine daylight slots between balusters.
      slab(M, 'cream', L / 2, 22.9, L, 0.2, 0.55, 0.02);
      for (let x = 0.25; x < L; x += near ? 0.72 : 1.45) slab(M, 'cream', x, 22.66, 0.16, 0.42, 0.26, 0.02);
      // Stepped masonry pinnacles sit directly on the parapet, in both LODs.
      if(L>8)for(let i=0;i<=count;i++){
        const x=1.15+i*pitch,u=p[0]+t[0]*x,v=p[1]+t[1]*x;
        if(u>23 && v>-19 && v<1)continue; // the taller entrance and turret pair own this interval
        streetPinnacle(u+n[0]*0.10,v+n[1]*0.10,22.92);
      }
    }
  }
  function solid(vertices, faces, mat) {
    const center = new THREE.Vector3(); for (const p of vertices) center.add(new THREE.Vector3(...p)); center.multiplyScalar(1 / vertices.length);
    const pos = [], indices = [];
    for (let f of faces) {
      const a = new THREE.Vector3(...vertices[f[0]]), c = new THREE.Vector3(...vertices[f[1]]), d = new THREE.Vector3(...vertices[f[2]]);
      if (c.clone().sub(a).cross(d.clone().sub(a)).dot(a.clone().sub(center)) < 0) f = [...f].reverse();
      const start = pos.length / 3; for (const i of f) pos.push(...vertices[i]);
      for (let i = 1; i + 1 < f.length; i++) indices.push(start, start + i, start + i + 1);
    }
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setIndex(indices); g.computeVertexNormals(); put(g, mat);
  }
  function hip(u0, u1, v0, v1, eave, ridge) {
    const uc = (u0 + u1) / 2, vc = (v0 + v1) / 2, dv = Math.min((u1 - u0) / 2, (v1 - v0) * 0.3);
    const vertices = [[u0,eave,v0],[u1,eave,v0],[u1,eave,v1],[u0,eave,v1],[uc,ridge,v0+dv],[uc,ridge,v1-dv]];
    solid(vertices, [[0,1,4],[1,2,5,4],[2,3,5],[3,0,4,5]], 'roof');
    bar('iron', [uc, ridge + 0.08, v0 + dv], [uc, ridge + 0.08, v1 - dv], 0.16);
    if (near) for (const v of [v0 + dv + 3, v1 - dv - 3]) {
      box('stone', uc, ridge + 0.9, v, 1.0, 1.8, 1.2);
      box('cream', uc, ridge + 1.9, v, 1.22, 0.2, 1.4);
    }
  }
  function rose(M, x, y, r) {
    at(M, new THREE.CircleGeometry(r, near ? 24 : 12).translate(x,y,0.15), 'glow');
    at(M, new THREE.TorusGeometry(r + 0.08, 0.11, near ? 4 : 3, near ? 24 : 10).translate(x,y,0.3), 'cream');
    for (let i = 0; i < (near ? 8 : 4); i++) {
      const a = i * Math.PI / (near ? 4 : 2);
      beam(M, 'cream', [x,y,0.32], [x+r*Math.cos(a),y+r*Math.sin(a),0.32], 0.08);
    }
    if (near) at(M, new THREE.TorusGeometry(r * 0.32, 0.07, 4, 12).translate(x,y,0.33), 'cream');
  }
  function crest(M){
    // A shallow opaque tympanum and original heraldic relief, read from the
    // station photograph. Relief is an approximation, not a traced sculpture.
    const relief=(points,material,z,depth=0.12)=>{
      const shape=new THREE.Shape(points.map(q=>new THREE.Vector2(...q)));
      const g=near?new THREE.ExtrudeGeometry(shape,{depth,bevelEnabled:false}):new THREE.ShapeGeometry(shape);
      g.translate(0,0,near?z:z+depth);at(M,g,material);
    };
    // The arched plate fills the former wheel's whole tympanum; its edges meet
    // the enclosing masonry reveal. No glazing or radial spokes remain here.
    relief(arc(0,20.6,7.6,5.7,near?12:6),'cream',0.22,0.16);
    const shield=[[-0.82,24.3],[0.82,24.3],[0.71,22.85],[0,22.18],[-0.71,22.85]];
    relief(shield,'stone',0.30,0.15);
    relief(shield.map(([x,y])=>[x*0.80,23.3+(y-23.3)*0.86]),'cream',0.38,0.13);
    // Balanced raised acanthus/laurel lobes flank the shield. Their bases are
    // embedded in the stone plate, and far keeps the opaque heraldic shape.
    for(const side of [-1,1])for(let i=0;i<(near?4:3);i++){
      const x=side*(0.98+0.12*Math.sin(i*1.2)),y=21.85+i*0.67;
      const leaf=[[x,y-0.25],[x+side*0.66,y+0.10],[x+side*0.40,y+0.58],[x-side*0.12,y+0.30]];
      relief(leaf,'stone',0.30,0.12);
      if(near)relief(leaf.map(([px,py])=>[x+(px-x)*0.78,y+(py-y)*0.78]),'cream',0.36,0.12);
    }
    const crown=[[-0.72,24.5],[-0.88,25.05],[-0.29,24.80],[0,25.22],[0.29,24.80],[0.88,25.05],[0.72,24.5]];
    relief(crown,'stone',0.30,0.12);
    if(near)relief(crown.map(([x,y])=>[x*0.82,24.72+(y-24.72)*0.80]),'cream',0.36,0.12);
    relief([[-1.12,21.70],[1.12,21.70],[0.86,21.94],[-0.86,21.94]],'stone',0.30,0.12);
    // Small central raised figure abstracts the sculpted arms; no wheel motif.
    const headShape=new THREE.Shape();headShape.absarc(0,23.72,0.16,0,Math.PI*2,false);
    const head=near?new THREE.ExtrudeGeometry(headShape,{depth:0.14,bevelEnabled:false,curveSegments:5}):new THREE.ShapeGeometry(headShape,3);
    head.translate(0,0,near?0.44:0.58);at(M,head,'stone');
    relief([[-0.12,23.60],[0.12,23.60],[0.27,22.62],[-0.27,22.62]],'stone',0.44,0.14);
    if(near){beam(M,'stone',[-0.05,23.45,0.60],[-0.47,23.15,0.60],0.10);beam(M,'stone',[0.05,23.45,0.60],[0.47,23.65,0.60],0.10);}
  }
  function gable(p, t, n, width, base, rise) {
    const M = wall(p,t,n), s = new THREE.Shape([new THREE.Vector2(-width/2,base),new THREE.Vector2(width/2,base),new THREE.Vector2(0,base+rise)]);
    at(M, new THREE.ExtrudeGeometry(s, { depth: 0.55, bevelEnabled: false }).translate(0,0,-0.55), 'stone');
    const bh = near ? 0.5 : 1.0, bw = near ? 1.1 : 1.8;
    for (let row = 0; row * bh < rise; row++) {
      const y = base + (row+0.5)*bh, half = width/2 * (1 - ((row+1)*bh)/rise);
      for (let col = -Math.floor(half/bw); col <= Math.floor(half/bw); col++) if ((row + col) % 2 === 0 && Math.abs(col*bw)+bw/2 < half) rect(M,'cream',col*bw,y,bw-0.08,bh-0.07,0.08);
    }
    beam(M,'cream',[-width/2,base,0.22],[0,base+rise,0.22],0.35);
    beam(M,'cream',[width/2,base,0.22],[0,base+rise,0.22],0.35);
    for (const x of [-2.6,2.6]) window(M,x,base+0.35,1.5,2.5);
    rose(M,0,base+3.6,1.0);
    const apex = new THREE.Vector3(0,base+rise,0).applyMatrix4(M);
    pinnacle(apex.x,apex.z,base+rise,base+rise+2.1);
  }
  function profile(u,v,ys,rs,mat,segments = near ? 24 : 12) {
    // Closed rotational solid; lathe profile normals point outward.
    const pts = [new THREE.Vector2(0,ys[0]), ...ys.map((y,i)=>new THREE.Vector2(rs[i],y)), new THREE.Vector2(0,ys.at(-1))];
    const g = new THREE.LatheGeometry(pts,segments);
    if(!near){
      // Lathe cap rings include triangles collapsed to the axis. These consume
      // far export budget while contributing no face or silhouette at all.
      const p=g.attributes.position,idx=g.index,keep=[],a=new THREE.Vector3(),c=new THREE.Vector3(),d=new THREE.Vector3();
      for(let i=0;i<idx.count;i+=3){
        const ids=[idx.getX(i),idx.getX(i+1),idx.getX(i+2)];
        a.fromBufferAttribute(p,ids[0]);c.fromBufferAttribute(p,ids[1]);d.fromBufferAttribute(p,ids[2]);
        if(c.sub(a).cross(d.sub(a)).lengthSq()>1e-12)keep.push(...ids);
      }
      g.setIndex(keep);
    }
    g.translate(u,0,v);put(g,mat);
  }
  function pinnacle(u,v,y0,y1) {
    cyl('cream',u,v,y0,y0+0.55,0.35,0.35,6);
    cyl('cream',u,v,y0+0.55,y1-0.35,0.19,0.1,6);
    cyl('iron',u,v,y1-0.35,y1,0.07,0.01,5);
    if (near) { bar('iron',[u-0.22,y1-0.3,v],[u+0.22,y1-0.3,v],0.065); }
  }
  function streetPinnacle(u,v,y){
    // Four-sided stepped profile gives the reference's substantial stone shaft,
    // shoulders, cap and pyramidal crown instead of a needle-thin pole.
    const ys=[y,y+0.60,y+0.60,y+2.05,y+2.05,y+2.35,y+2.35,y+3.55];
    const rs=[0.71,0.71,0.42,0.42,0.60,0.60,0.46,0.10];
    profile(u,v,ys,rs,'cream',4);
    cyl('iron',u,v,y+3.55,y+4.45,0.065,0.025,4);
    if(near)bar('iron',[u-0.22,y+4.14,v],[u+0.22,y+4.14,v],0.07);
  }
  function entranceBay(p,t,n){
    const M=wall(p,t,n),w=11.6,base=23.4,top=33.6;
    const outline=[[-w/2,0],[w/2,0],[w/2,base],[0,top],[-w/2,base]];
    const s=new THREE.Shape(outline.map(q=>new THREE.Vector2(...q)));
    s.holes.push(new THREE.Path(arc(0,6.3,7.6,20.0,near?12:6).map(q=>new THREE.Vector2(...q))));
    at(M,new THREE.ExtrudeGeometry(s,{depth:0.65,bevelEnabled:false}).translate(0,0,-0.65),'stone');
    const bw=near?1.1:1.8,bh=near?0.5:1.0;
    for(let row=0;row*bh<top;row++){
      const y=(row+0.5)*bh,half=y<base?w/2:w/2*(top-(row+1)*bh)/(top-base);
      for(let col=-Math.floor(half/bw);col<=Math.floor(half/bw);col++){
        if((row+col)%2 || Math.abs(col*bw)+bw/2>half)continue;
        if(Math.abs(col*bw)<3.8+bw/2 && y>6.1-bh/2 && y<26.5+bh/2)continue;
        rect(M,'cream',col*bw,y,bw-0.07,bh-0.05,0.08);
      }
    }
    // The openings sit 0.52 m behind the facade plate, with a layered arch.
    const inset=M.clone().multiply(new THREE.Matrix4().makeTranslation(0,0,-0.52));
    panel(inset,'glass',0,6.3,7.6,20.0,0.14);
    frame(M,0,6.3,7.6,20.0,0.38,0.22);
    frame(M,0,6.2,8.4,20.6,0.22,0.33);
    for(const x of [-1.27,1.27])beam(inset,'cream',[x,6.3,0.30],[x,22.0,0.30],0.24);
    for(const y of [12.5,19.8])slab(inset,'cream',0,y,7.6,0.33,0.18,0.31);
    // Deep continuous sill/frieze divides the two tall mullioned levels.
    slab(M,'cream',0,12.65,9.3,0.55,0.58,0.03);
    slab(M,'cream',0,20.0,8.9,0.42,0.52,0.04);
    for(const x of [-4.95,4.95]){
      slab(M,'cream',x,13.2,0.36,18.1,0.52,0.08);
      slab(M,'cream',x,22.0,0.85,0.55,0.75,0.12);
    }
    crest(inset); // opaque stone tympanum, never self-lit rose glazing
    for(const x of [-0.66,0.66])window(M,x,28.2,0.9,2.55);
    beam(M,'cream',[-w/2,base,0.29],[0,top,0.29],0.43);
    beam(M,'cream',[w/2,base,0.29],[0,top,0.29],0.43);
    // Coping includes side shoulders and carved-panel abstractions in near.
    if(near)for(const x of [-3.2,0,3.2]){
      rect(M,'stone',x,13.15,1.45,0.33,0.35);
      for(const a of [0,Math.PI/2,Math.PI,3*Math.PI/2]){
        const g=new THREE.CircleGeometry(0.15,6);g.translate(x+0.18*Math.cos(a),13.15+0.10*Math.sin(a),0.44);at(M,g,'cream');
      }
    }
    const apex=new THREE.Vector3(0,top,0).applyMatrix4(M);
    pinnacle(apex.x,apex.z,top,36.0);
    portal(p,t,n);
  }
  function turret(u,v,r,bodyTop,top) {
    cyl('stone',u,v,0,bodyTop,r);
    const segments=near?16:10;
    for(let i=0;i<segments;i++) {
      const a=(i+0.5)*Math.PI*2/segments,t=[Math.cos(a),-Math.sin(a)],n=[Math.sin(a),Math.cos(a)],p=[u+n[0]*r,v+n[1]*r],M=wall(p,t,n);
      const bw=2*r*Math.tan(Math.PI/segments)*0.8;
      for(let row=0;row<(near?42:18);row++) if((row+i)%2===0) rect(M,'cream',0,(row+0.5)*bodyTop/(near?42:18),bw,bodyTop/(near?42:18)*0.77,0.05);
    }
    for (const y of [0.5,4.6,10.6,20.5,bodyTop]) cyl('cream',u,v,y-0.16,y+0.16,r+0.17,r+0.17);
    for (const a of [Math.PI/2,0,Math.PI]) {
      const n=[Math.sin(a),Math.cos(a)],t=[Math.cos(a),-Math.sin(a)],M=wall([u+n[0]*(r+0.05),v+n[1]*(r+0.05)],t,n);
      for (const [y,h] of [[1.1,2.9],[5.8,4.1],[11.5,8.3]]) window(M,0,y,1.1,h);
    }
    // Substantial projecting cornice and elongated, ribbed metal dome.
    profile(u,v,[bodyTop-0.3,bodyTop-0.1,bodyTop+0.1,bodyTop+0.35],[r+0.10,r+0.33,r+0.33,r+0.24],'cream',near?16:10);
    const domeY=[bodyTop+0.35,bodyTop+1.1,top-3.6,top-2.1,top-0.85,top];
    const domeR=[r+0.24,r+0.17,r*0.92,r*0.73,r*0.40,0.16];
    profile(u,v,domeY,domeR,'roof',near?24:12);
    for(let i=0;i<8;i++) {
      const a=i*Math.PI/4;
      for(let j=1;j<domeY.length;j++)bar('cream',[u+(domeR[j-1]+0.04)*Math.sin(a),domeY[j-1],v+(domeR[j-1]+0.04)*Math.cos(a)],[u+(domeR[j]+0.04)*Math.sin(a),domeY[j],v+(domeR[j]+0.04)*Math.cos(a)],near?0.11:0.14);
    }
    pinnacle(u,v,top,top+2.0);
  }
  function assembly(u,v,r) {
    // Polygonal drum follows the angled south-east assembly-hall frontage.
    cyl('stone',u,v,21.8,27.0,r,r,8);
    cyl('cream',u,v,22.5,22.85,r+0.18,r+0.18,8);
    cyl('cream',u,v,26.8,27.2,r+0.15,r+0.15,8);
    const apothem=r*Math.cos(Math.PI/8),side=2*r*Math.sin(Math.PI/8);
    for(let i=0;i<8;i++) {
      const a=(i+0.5)*Math.PI/4,n=[Math.sin(a),Math.cos(a)],t=[Math.cos(a),-Math.sin(a)],p=[u+n[0]*apothem,v+n[1]*apothem],M=wall(p,t,n);
      for(let row=0;row<(near?8:4);row++) for(let c=-2;c<=2;c++) if((row+c)%2===0)rect(M,'cream',c*side/5,23+(row+0.5)*4/(near?8:4),side/5-0.08,4/(near?8:4)-0.07,0.08);
      window(M,0,23.2,side*0.72,3.25,{glow:true});
      // Triangular dormer crown on every drum face; fanlights and coping.
      const s=new THREE.Shape([new THREE.Vector2(-side/2,26.9),new THREE.Vector2(side/2,26.9),new THREE.Vector2(0,30.5)]);
      at(M,new THREE.ExtrudeGeometry(s,{depth:0.35,bevelEnabled:false}).translate(0,0,-0.3),'stone');
      beam(M,'cream',[-side/2,26.9,0.22],[0,30.5,0.22],0.22);beam(M,'cream',[side/2,26.9,0.22],[0,30.5,0.22],0.22);
      rose(M,0,28.25,0.66);
      // Corner pinnacles stand on the octagonal drum and frame the roof dormers.
      const corner=[u+r*Math.sin(i*Math.PI/4),v+r*Math.cos(i*Math.PI/4)];
      pinnacle(corner[0],corner[1],27.2,31.8);
    }
    const ys=[27.1,28.4,30.5,32.5,34.1,35.1,35.6],rs=[r*0.94,r*0.91,r*0.79,r*0.61,r*0.40,r*0.23,r*0.16];
    profile(u,v,ys,rs,'lamp',near?32:16);
    for(let i=0;i<8;i++) {
      const a=i*Math.PI/4;
      for(let j=1;j<ys.length;j++)bar('cream',[u+(rs[j-1]+0.05)*Math.sin(a),ys[j-1],v+(rs[j-1]+0.05)*Math.cos(a)],[u+(rs[j]+0.05)*Math.sin(a),ys[j],v+(rs[j]+0.05)*Math.cos(a)],near?0.12:0.16);
    }
    // Lantern slats are separate shafts; the slots remain daylight openings.
    cyl('cream',u,v,35.6,35.85,1.58,1.58,8);
    for(let i=0;i<8;i++) {
      const a=i*Math.PI/4;
      cyl('cream',u+1.2*Math.sin(a),v+1.2*Math.cos(a),35.85,37.1,0.13,0.13,5);
    }
    cyl('cream',u,v,37.1,37.35,1.55,1.55,8);
    profile(u,v,[37.35,37.7,38.2,38.55],[1.55,1.3,0.65,0.16],'roof',8);
    pinnacle(u,v,38.55,40.0);
  }
  function portal(p,t,n){
    const M=wall(p,t,n);
    panel(M,'wood',0,0.12,2.5,4.25,0.22);
    frame(M,0,0.12,2.5,4.25,0.24,0.4);
    frame(M,0,0.15,3.0,4.7,0.22,0.34);
    beam(M,'iron',[0,0.2,0.44],[0,3.5,0.44],0.10);
    for(const y of [1.1,2.4,3.4])slab(M,'iron',0,y,2.35,0.09,0.07,0.43);
  }
  return {mass,facade,hip,gable,turret,assembly,pinnacle,portal,entranceBay};
}
