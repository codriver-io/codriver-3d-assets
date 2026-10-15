import * as THREE from 'three';

// All dimensions in metres. Original surfaces and lattice; no mesh or texture input.
export function buildParts(detail = 'near') {
  const near = detail === 'near', n = near ? 64 : 32, parts = [], members = [];
  const add = (name, material, geometry) => { parts.push({ name, material, geometry }); return name; };
  const shell = (name, mat, profile, segments = n, start = 0, sweep = Math.PI * 2) => add(name, mat, new THREE.LatheGeometry(profile.map(([r,y]) => new THREE.Vector2(r,y)), segments, start, sweep));
  const beam = (name, mat, a, c, w, supports) => {
    const av = new THREE.Vector3(...a), cv = new THREE.Vector3(...c), d = cv.clone().sub(av);
    const g = new THREE.BoxGeometry(w,d.length(),w);
    g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0), d.normalize()));
    g.translate(...av.add(cv).multiplyScalar(0.5).toArray()); add(name, mat, g);
    if (supports) members.push({ name, ends: [a,c], supports });
  };
  const ring = (name,mat,r,y,t=0.07) => {
    const g = new THREE.TorusGeometry(r,t,near?6:4,n);g.rotateX(Math.PI/2);g.translate(0,y,0);add(name,mat,g);
  };
  const at = (r,y,t) => [r*Math.sin(t),y,r*Math.cos(t)];
  // Gently concave parabolic shaft, rather than a straight cone. No visible footing block.
  const R = (y) => 2.52+2.88*(1-y/138)**1.75;
  const profile = Array.from({length:(near?24:8)+1},(_,i) => {const y=138*i/(near?24:8);return [R(y),y];});
  shell('shaft','concrete',profile);
  shell('shaft-base','concrete',[[0,0],[5.4,0]]);
  // The shell is an edge-to-edge surface, partitioned into opaque bands and window bays.
  // No cylinder behind the windows and no proud mullion overlays.
  const P = [[2.52,138],[4.7,138],[5.9,138.3],[6.5,138.8],[6.8,139.3],[7.15,142],[7.4,145],[7.5,147.7],[7.48,149.2],[7.2,149.8],[6.95,150]];
  const radius = (y) => {
    for(let i=1;i<P.length;i++) if(P[i][1]>P[i-1][1] && y<=P[i][1]) {const a=P[i-1],b=P[i];return a[0]+(b[0]-a[0])*(y-a[1])/(b[1]-a[1]);}
    return 6.95;
  };
  shell('cabin-soffit','dark',P.slice(0,4));
  const rows = [[139.35,140.65],[142.1,143.55],[144.9,146.45],[147.6,149.15]];
  let last=138.8;
  for(let row=0;row<rows.length;row++) {
    const [lo,hi]=rows[row];
    shell(`fascia-${row}`,'aluminium',[[radius(last),last],[radius(lo),lo]]);
    const count=near?64:32, step=Math.PI*2/count;
    for(let i=0;i<count;i++) {
      const start=i*step;
      shell(`window-${row}-${i}`,'glow',[[radius(lo),lo],[radius(hi),hi]],1,start,step*0.88);
      shell(`mullion-${row}-${i}`,'dark',[[radius(lo),lo],[radius(hi),hi]],1,start+step*0.88,step*0.12);
    }
    last=hi;
  }
  shell('roof-fascia','aluminium',[[radius(last),last],[7.2,149.8],[6.95,150],[3.0,150]]);
  // Lower observation platform is the roof of the basket; upper is smaller and open.
  shell('deck-parapet','aluminium',[[7.0,150],[7.0,151.2],[6.7,151.2],[6.7,150],[3,150]]);
  shell('upper-core','concrete',[[3,150],[3,157.5],[2.65,160.4],[1.3,161],[0,161]]);
  shell('upper-deck','aluminium',[[3,152.5],[4.6,152.5],[4.6,153],[3,153]]);
  ring('upper-rail','steel',4.5,154.15,0.08);
  const posts=near?40:20;
  for(let i=0;i<posts;i++) {
    const t=i*Math.PI*2/posts;
    beam(`deck-post-${i}`,'steel',at(4.5,152.98,t),at(4.5,154.15,t),near?0.065:0.10,['upper-deck','upper-rail']);
  }
  // Roof equipment dishes mounted directly to the narrowing concrete head.
  for(const [i,t] of [0.8,3.8].entries()) {
    const g=new THREE.CylinderGeometry(0.75,0.65,0.35,near?20:10);g.rotateZ(Math.PI/2);g.rotateY(-t);g.translate(...at(2.75,158.2,t));
    add(`dish-${i}`,'aluminium',g);
  }
  // Open square riveted lattice mast. All diagonals terminate in the four full-height chords.
  const levels=[161,193,212], widths=[1.9,1.29], corners=[[-1,-1],[-1,1],[1,1],[1,-1]];
  // Transition plates connect the narrower upper section to the lower section.
  add('mast-transition','steel',new THREE.BoxGeometry(2.1,0.30,2.1).translate(0,193,0));
  add('mast-cap','steel',new THREE.BoxGeometry(1.5,0.25,1.5).translate(0,212,0));
  for(let section=0;section<2;section++) {
    const lo=levels[section],hi=levels[section+1],r=widths[section]/2, bays=near?(section?10:16):(section?5:8);
    for(let c=0;c<4;c++) {
      const [x,z]=corners[c], mat=section?'aluminium':'steel';
      beam(`chord-${section}-${c}`,mat,[x*r,lo,z*r],[x*r,hi,z*r],0.13,section?['mast-transition','mast-cap']:['upper-core','mast-transition']);
    }
    for(let j=0;j<bays;j++) {
      const y0=lo+(hi-lo)*j/bays,y1=lo+(hi-lo)*(j+1)/bays,mat=Math.floor((y0-161)/6)%2?'aluminium':'red';
      for(let c=0;c<4;c++) {
        const a=corners[c],q=corners[(c+1)%4];
        const sa=`chord-${section}-${c}`,sb=`chord-${section}-${(c+1)%4}`;
        beam(`diagonal-${section}-${j}-${c}`,mat,[a[0]*r,y0,a[1]*r],[q[0]*r,y1,q[1]*r],near?0.075:0.11,[sa,sb]);
        beam(`rung-${section}-${j}-${c}`,mat,[a[0]*r,y0,a[1]*r],[q[0]*r,y0,q[1]*r],0.075,[sa,sb]);
      }
    }
  }
  shell('tip','aluminium',[[0.23,211.9],[0.23,214],[0.13,216.75],[0.04,216.9]],near?12:6);
  add('tip-beacon','light',new THREE.SphereGeometry(0.10,near?12:6,6).translate(0,216.9,0));
  // Red-and-white broad panels at the lower antenna start; segmented perimeter, no overlays.
  for(let k=0;k<3;k++) {
    const y=161+k*1.1,mat=k===1?'aluminium':'red';
    shell(`mast-foot-${k}`,mat,[[1.1,y],[1.1,y+1.1]],near?16:8);
  }
  return { parts, members };
}
