import * as THREE from 'three';

// Original parameterized geometry in longitudinal u / transverse v.
export function buildConcertgebouw(b, near, plan, mid) {
  const N = near ? 12 : 6, proud = near ? .28 : .56;
  const box = (mat, u, y, v, du, dy, dv) => b.box(mat, [u,y,v], [du,dy,dv]);
  const put = (g, mat) => b.put(g, mat);
  function extrusion(mat, ring, low, high) {
    const s = new THREE.Shape(ring.map(([u,v]) => new THREE.Vector2(u,-v)));
    const g = new THREE.ExtrudeGeometry(s, { depth: high-low, bevelEnabled: false, steps: 1 });
    g.rotateX(-Math.PI/2); g.translate(0,low,0); put(g,mat);
  }
  function triangle(mat, a, c, d, up = false) {
    if (up && new THREE.Vector3(...c).sub(new THREE.Vector3(...a)).cross(new THREE.Vector3(...d).sub(new THREE.Vector3(...a))).y < 0) [c,d] = [d,c];
    const g = new THREE.BufferGeometry(); g.setAttribute('position',new THREE.Float32BufferAttribute([...a,...c,...d],3));
    g.computeVertexNormals(); put(g,mat);
  }
  function pyramid(mat, ring, low, high, center) {
    for(let i=0;i<ring.length;i++) { const j=(i+1)%ring.length; triangle(mat,[ring[i][0],low,ring[i][1]],[ring[j][0],low,ring[j][1]],[center[0],high,center[1]],true); }
  }
  function hip(u,v,w,d,low,high,topW=2.6,topD=2.6) {
    const a=[[u-w/2,v-d/2],[u+w/2,v-d/2],[u+w/2,v+d/2],[u-w/2,v+d/2]];
    const c=[[u-topW/2,v-topD/2],[u+topW/2,v-topD/2],[u+topW/2,v+topD/2],[u-topW/2,v+topD/2]];
    for(let i=0;i<4;i++) { const j=(i+1)%4; triangle('roof',[a[i][0],low,a[i][1]],[a[j][0],low,a[j][1]],[c[j][0],high,c[j][1]],true); triangle('roof',[a[i][0],low,a[i][1]],[c[j][0],high,c[j][1]],[c[i][0],high,c[i][1]],true); }
    box('stone',u,high+.25,v,topW+.4,.5,topD+.4);
  }
  function gable(mat,u0,u1,v0,v1,eave,ridge) {
    const shape=new THREE.Shape([new THREE.Vector2(-v0,eave),new THREE.Vector2(-v1,eave),new THREE.Vector2(-(v0+v1)/2,ridge)]);
    const g=new THREE.ExtrudeGeometry(shape,{depth:u1-u0,bevelEnabled:false,steps:1});
    g.rotateY(Math.PI/2);g.translate(u0,0,0);put(g,mat);
  }
  const mapping = (side,at,s,y) => side[0]==='u' ? [at,y,s] : [s,y,at];
  function surface(mat,side,at,points,holes=[]) {
    const coords=[...points,...holes.flat()].map(([s,y])=>mapping(side,at,s,y));
    const desired=new THREE.Vector3(side==='u+'?1:side==='u-'?-1:0,0,side==='v+'?1:side==='v-'?-1:0);
    const pos=[], faces=THREE.ShapeUtils.triangulateShape(points.map(([x,y])=>new THREE.Vector2(x,y)),holes.map(r=>r.map(([x,y])=>new THREE.Vector2(x,y))));
    for(let [i,j,k] of faces) { const norm=new THREE.Vector3(...coords[j]).sub(new THREE.Vector3(...coords[i])).cross(new THREE.Vector3(...coords[k]).sub(new THREE.Vector3(...coords[i]))); if(norm.dot(desired)<0)[j,k]=[k,j];pos.push(...coords[i],...coords[j],...coords[k]); }
    const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.computeVertexNormals();put(g,mat);
  }
  const rect=(mat,side,at,s,y,w,h)=>surface(mat,side,at,[[s-w/2,y-h/2],[s+w/2,y-h/2],[s+w/2,y+h/2],[s-w/2,y+h/2]]);
  function archPoints(s,base,w,h) {
    const radius=w/2, spring=base+h-radius, pts=[[s-radius,base],[s+radius,base]];
    for(let i=0;i<=N;i++){const a=i*Math.PI/N;pts.push([s+radius*Math.cos(a),spring+radius*Math.sin(a)]);}
    return pts;
  }
  function archFrame(side,at,s,base,w,h,t=.22) {
    const r=w/2,spring=base+h-r;
    rect('stone',side,at,s-r-t/2,(base+spring)/2,t,spring-base);
    rect('stone',side,at,s+r+t/2,(base+spring)/2,t,spring-base);
    for(let i=0;i<N;i++){const a=i*Math.PI/N,c=(i+1)*Math.PI/N;
      surface('stone',side,at,[[s+r*Math.cos(a),spring+r*Math.sin(a)],[s+(r+t)*Math.cos(a),spring+(r+t)*Math.sin(a)],[s+(r+t)*Math.cos(c),spring+(r+t)*Math.sin(c)],[s+r*Math.cos(c),spring+r*Math.sin(c)]]);
    }
  }
  function window(side,wall,s,base,w,h,arched=false,pediment=false) {
    const sign=side.endsWith('+')?1:-1,at=wall+sign*proud;
    if(arched) {surface('light',side,at,archPoints(s,base,w,h));archFrame(side,at+.04*sign,s,base,w,h);}
    else {rect('light',side,at,s,base+h/2,w,h);for(const x of [-1,1])rect('stone',side,at+.04*sign,s+x*(w/2+.13),base+h/2,.26,h+.35);rect('stone',side,at+.04*sign,s,base-.13,w+.5,.26);rect('stone',side,at+.04*sign,s,base+h+.13,w+.5,.26);}
    if(near) {rect('stone',side,at+.065*sign,s,base+h*.45,w,.12);rect('stone',side,at+.07*sign,s,base+h/2,.13,h);}
    if(pediment) surface('stone',side,at+.09*sign,[[s-w/2-.45,base+h+.48],[s+w/2+.45,base+h+.48],[s,base+h+1.5]]);
  }
  function cornice(u0,u1,v0,v1,y,h=.5) {
    // Perimeter profiles, not a solid pale slab over the roof.
    for(const v of [v0,v1])box('stone',(u0+u1)/2,y,v,u1-u0+.55,h,.58);
    for(const u of [u0,u1])box('stone',u,y,(v0+v1)/2,.58,h,v1-v0+.55);
  }
  function cylinder(mat,u,v,y,height,r0,r1=r0,segments=near?10:6) {
    const g=new THREE.CylinderGeometry(r1,r0,height,segments);g.translate(u,y+height/2,v);put(g,mat);
  }
  function beam(mat,a,c,w=.24) {b.bar(mat,a,c,w);}
  function flutedColumn(u,v) {
    // Alternating radial ridges make real relief, including the coarse far shaft.
    const count=near?32:16, positions=[],indices=[];
    for(const [y,scale] of [[6.22,1],[14.3,.87]])for(let i=0;i<count;i++) {
      const a=i*2*Math.PI/count,r=(i%2?.63:.76)*scale;
      positions.push(u+r*Math.cos(a),y,v+r*Math.sin(a));
    }
    for(let i=0;i<count;i++) {const j=(i+1)%count;indices.push(i,count+i,j,j,count+i,count+j);}
    const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));g.setIndex(indices);g.computeVertexNormals();put(g,'stone');
  }
  function masonry(side,wall,s0,s1,bays) {
    // Cut each stone course around the actual lower openings; no glazing overlay
    // sits on a stone slab. The red joints are gaps between courses, not paint.
    const sign=side.endsWith('+')?1:-1,at=wall+sign*(near?.16:.08);
    for(let y=.4;y<5.15;y+=.62) {
      const lo=y,hi=Math.min(y+.48,5.15);
      let spans=[[s0,s1]];
      for(const s of bays)if(hi>.72&&lo<3.8)spans=spans.flatMap(([a,c])=>[[a,Math.min(c,s-1.56)],[Math.max(a,s+1.56),c]].filter(([a,c])=>c>a));
      for(const [a,c] of spans)rect('stone',side,at,(a+c)/2,(lo+hi)/2,c-a,hi-lo);
    }
    for(const s of [s0+.55,s1-.55])for(let y=5.95;y<13.4;y+=.85)
      rect('stone',side,at,s,y,.95,.36);
  }

  // The original side range behind the glass is partitioned at the pavilion wall.
  // This removes coincident historic and new exterior glazing surfaces.
  extrusion('brick',[[-26.65,-22.84],[-15.03,-22.88],[-15.04,-34.14],[37.4,-34.28],[37.46,18.33],[29.85,18.36],[29.85,8.1],[-26.55,8.17]],0,14);
  extrusion('brick',plan[754269605],0,10.2);
  pyramid('roof',plan[754269605],10.2,13,[-26.6,-7.8]);
  extrusion('brick',plan[754269604],10.2,22);
  pyramid('roof',plan[754269604],22,24,[-26.6,-7.8]);
  extrusion('stone',plan[46696080],0,.38);
  box('brick',10.8,15,-7.7,45.7,2,28.1);
  gable('roof',-12.05,33.85,-21.85,6.5,16,24);
  for(const u of [-12.08,33.9]) {
    const side=u>0?'u+':'u-';
    surface('brick',side,u,[[-21.7,16],[6.35,16],[mid,23.5]]);
    const at=u+(u>0?.12:-.12);
    beam('stone',[at,16,-22],[at,24,mid],.5);
    beam('stone',[at,24,mid],[at,16,6.3],.5);
  }
  for(const y of [1.0,3.6,5.6,13.5,14.25]) cornice(-14.8,37.3,-34.05,18.1,y,y===5.6?.72:.38);
  const front=37.46;
  masonry('u+',front,-34.05,mid-8.9,[-31,-22.8]);
  masonry('u+',front,mid+8.9,18.1,[7.1,14.4]);
  for(const v of [-34,-27,-17,2,10.8,17.8])for(let y=6.05;y<13.4;y+=.75)
    rect('stone','u+',front+(near?.17:.08),v,y,1,.35);
  for(const v of [-31,-22.8,7.1,14.4]) {window('u+',front,v,6.7,2.65,5.1,false,true);window('u+',front,v,.9,2.55,2.7);}
  for(const v of [-31,-22.8,7.1,14.4]) {
    // Substantial window jambs and sill shoulders kept in both LODs.
    for(const sign of [-1,1])box('stone',front+.28,9.25,v+sign*1.62,.48,5.6,.4);
    box('stone',front+.28,6.42,v,.55,.38,3.65);
    box('stone',front+.28,12.05,v,.55,.4,3.6);
  }
  for(const side of ['v-','v+']) {
    const wall=side==='v-'?-34.18:18.36;
    if(side==='v-')masonry(side,wall,-14.65,37.2,Array.from({length:6},(_,i)=>-9+i*6.7));
    for(let u=-9;u<31;u+=6.7) {
      if(side==='v-') {window(side,wall,u,6.7,2.6,5.1,false,true);window(side,wall,u,.9,2.6,2.7);}
      if(side==='v-') {for(const y of [7.0,8.7,10.4,12.1])rect('stone',side,wall-(near?.17:.08),u+3.2,y,.85,.34);}
    }
  }
  const towers=[[-11.7,-30.1],[-11.65,14.82],[33.9,-30.35],[33.95,14.55]];
  for(const [u,v] of towers) {
    cornice(u-4,u+4,v-3.8,v+3.8,14.8,.65);
    hip(u,v,7.8,7.4,15.15,22.8,3.7,3.4);
    box('stone',u,23.22,v,4.2,.34,3.9);
    for(const sign of [-1,1]) {
      const faceU=u+sign*3.3, side=sign>0?'u+':'u-';
      box('stone',u+sign*2.9,18.25,v,.9,4.9,3.1);
      window(side,faceU,v,16.2,1.55,3.2,true);
      surface('stone',side,faceU+sign*.18,[[v-1.95,19.8],[v+1.95,19.8],[v,21.0]]);
    }
    for(const du of [-1.7,1.7])for(const dv of [-1.55,1.55]) {
      cylinder('stone',u+du,v+dv,23.39,.7,.16,.12);
      cylinder('metal',u+du,v+dv,24.09,.75,.07,.025,5);
    }
    if(near) for(let k=-2;k<=2;k++) {
      cylinder('metal',u+k*.7,v-1.7,23.39,.8,.045,.045,5);
      cylinder('metal',u+k*.7,v+1.7,23.39,.8,.045,.045,5);
    }
  }
  box('brick',37.6,7.75,mid,8.1,15.5,17.3);
  // Stone portico backing with true cut-outs; the window infill is behind the
  // shafts, and the doors stay distinct even in far rather than a pale slab.
  const portals=[mid-4.55,mid,mid+4.55];
  for(const [low,high,base,w,h] of [[.1,5.3,.38,2.55,4.3],[5.72,15.08,6.1,2.95,7.5]])
    surface('stone','u+',41.76,[[mid-8.64,low],[mid+8.64,low],[mid+8.64,high],[mid-8.64,high]],portals.map(v=>archPoints(v,base,w,h)));
  for(const y of [1,3.6,5.5])box('stone',38.05,y,mid,8.9,.4,17.9);
  for(const v of [mid-4.55,mid,mid+4.55]) {
    window('u+',41.65,v,.38,2.55,4.3,true);window('u+',41.65,v,6.1,2.95,7.5,true);
  }
  for(const v of [mid-6.95,mid-2.32,mid+2.32,mid+6.95]) {
    const u=42.45;
    box('stone',u,5.6,v,1.65,.65,1.65);
    cylinder('stone',u,v,5.925,.3,.84,.76);
    flutedColumn(u,v);
    cylinder('stone',u,v,14.3,.32,.78,.83);
    box('stone',u,14.85,v,1.7,.46,1.7);
    for(const dv of [-.62,.62])cylinder('stone',u,v+dv,14.57,.28,.2,.24,near?8:5);
  }
  box('stone',39.65,15.45,mid,7.2,.74,18.8);
  box('stone',39.65,16.13,mid,7.5,.62,19.2);
  gable('stone',40.8,42.95,mid-9.4,mid+9.4,16.5,21.25);
  beam('stone',[43.1,16.6,mid-9.6],[43.1,21.45,mid],.47);
  beam('stone',[43.1,21.45,mid],[43.1,16.6,mid+9.6],.47);
  for(let i=-4;i<=4;i++) {
    const v=mid+i*1.65, y=17.05, h=2.7-Math.abs(i)*.4;
    const torso=new THREE.CylinderGeometry(.18,.36,h*.58,near?7:4);torso.translate(43.08,y+h*.37,v);put(torso,'stone');
    const head=new THREE.SphereGeometry(.24,near?8:5,near?6:4);head.translate(43.08,y+h*.76,v);put(head,'stone');
    for(const sign of [-1,1])beam('stone',[43.08,y+.1,v+sign*.22],[43.08,y+h*.39,v+sign*.12],.18);
    if(near)for(const sign of [-1,1])beam('stone',[43.08,y+h*.5,v],[43.08,y+h*.33,v+sign*.52],.16);
  }
  if(near) for(let v=mid-8.8;v<mid+8.9;v+=.6) box('stone',43.15,16.49,v,.2,.25,.22);
  // Open gilded lyre bowl, curling horns, crossbar and separate strings.
  const lyreU=33.6,base=24.15;
  box('stone',lyreU,24.07,mid,1.4,.4,1.7);
  box('gold',lyreU,base+.18,mid,.4,.42,1.1);
  const curve=[[-.48,.27],[-.91,.52],[-1.0,1.02],[-.84,1.65],[-.91,2.25],[-.65,2.55],[-.35,2.35]];
  for(const sign of [-1,1])for(let i=0;i<curve.length-1;i++)beam('gold',[lyreU,base+curve[i][1],mid+sign*curve[i][0]],[lyreU,base+curve[i+1][1],mid+sign*curve[i+1][0]],near?.19:.24);
  beam('gold',[lyreU,base+1.96,mid-.89],[lyreU,base+1.96,mid+.89],.18);
  for(const dv of [-.5,-.25,0,.25,.5])beam('gold',[lyreU,base+.44,mid+dv*.65],[lyreU,base+1.97,mid+dv],near?.06:.09);
  cylinder('gold',lyreU,mid,base+2.48,.26,.13,.03,6);
  // Glass side pavilion; ground glazing, steel mullions and pitched glass roof.
  extrusion('glass',plan[754276797],0,9.7);
  gable('glass',-26.35,29.8,8.3,18.45,9.7,13.7);
  for(let u=-25;u<=29;u+=near?2.45:4.9) {
    box('metal',u,4.4,18.82,.18,8.8,.3);
    if(near)beam('metal',[u,9.9,18.7],[u,13.85,13.35],.12);
  }
  box('metal',1.7,5.8,18.78,56.4,.5,.5);
  box('metal',1.7,9.9,18.72,56.4,.25,.5);
  box('metal',1.7,13.85,13.35,56.4,.25,.25);
  const tail=[[-35.7,18.8],[-42.1,18.8],[-35,33.0],[-14.3,22.15],[-26.4,18.75]];
  extrusion('brick',tail,0,4.9);extrusion('roof',tail,4.9,5.5);
  for(const id of [754276795,754276796])extrusion('stone',plan[id],0,5);
  const ring=plan[754269604];
  for(let i=0;i<ring.length;i++) {
    const a=ring[i],c=ring[(i+1)%ring.length],u=(a[0]+c[0])/2,v=(a[1]+c[1])/2;
    const tangent=new THREE.Vector3(c[0]-a[0],0,c[1]-a[1]).normalize(),radial=new THREE.Vector3(u+26.6,0,v+7.8).normalize();
    // Lower rear range keeps a separate window cadence and masonry belt.
    if(u < -28) {
      const lowCenter=new THREE.Vector3(u,5.3,v).addScaledVector(radial,proud);
      const lowG=new THREE.PlaneGeometry(1.6,3.1);lowG.rotateY(Math.atan2(radial.x,radial.z));lowG.translate(...lowCenter.toArray());put(lowG,'light');
    }
    const width=Math.min(2.3,Math.hypot(c[0]-a[0],c[1]-a[1])*.48);
    const center=new THREE.Vector3(u,17.1,v).addScaledVector(radial,proud);
    const verts=[center.clone().addScaledVector(tangent,-width/2).add(new THREE.Vector3(0,-2.4,0)),center.clone().addScaledVector(tangent,width/2).add(new THREE.Vector3(0,-2.4,0)),center.clone().addScaledVector(tangent,width/2).add(new THREE.Vector3(0,2.4,0)),center.clone().addScaledVector(tangent,-width/2).add(new THREE.Vector3(0,2.4,0))];
    let idx=[0,1,2,0,2,3];if(tangent.clone().cross(new THREE.Vector3(0,1,0)).dot(radial)<0)idx=[0,2,1,0,3,2];
    const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(verts.flatMap(v=>v.toArray()),3));g.setIndex(idx);g.computeVertexNormals();put(g,'light');
  }
}
