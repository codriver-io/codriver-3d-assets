import * as THREE from 'three';
export function facade(k,near) {
  const {box,arch,plaque,column,pediment,statue,put,line}=k;
  const half=114.69/2, openings=[[-48,8],[-12,6],[0,7],[12,6],[48,8]];
  // The porch is recessed 10 m behind the external giant order.
  box('recess',121.3,16.2,0,2.6,32.4,114.69);
  let from=-half;
  for(const [z,w] of openings) {
    const to=z-w/2;
    box('stone',131.8,10.25,(from+to)/2,4.2,20.5,to-from);
    arch('stone',129.7,z,w,0,11,4.2,true);
    const capBottom=11+w/2+.25;
    box('stone',131.8,(20.5+capBottom)/2,z,4.2,20.5-capBottom,w);
    arch('glass',122.67,z,w*.85,1.25,9.2,.18);
    if(near) for(const dz of [-w*.27,0,w*.27])line('lamp',[122.83,1.3,z+dz],[122.83,10.4,z+dz],.075);
    from=z+w/2;
  }
  box('stone',131.8,10.25,(from+half)/2,4.2,20.5,half-from);
  // Continuous upper order with actual front windows inset against its shaded wall.
  box('stone',131.8,26.75,0,4.2,12.5,114.69);
  for(const z of [-48,-35,-24,-12,0,12,24,35,48]) {
    arch('glass',133.99,z,5.0,21.0,26.2,.16);
    plaque('trim',134.25,z,20.7,6.2,.55);
    if(near) {
      for(const s of [-1,1])box('trim',134.3,24.1,z+s*2.85,.5,7.2,.45);
      plaque('trim',134.3,z,18.5,5.8,.7);
      box('recess',134.1,16.9,z,.2,2.1,4.4);
      pediment(134.4,z,7.6,29.5,1.3,.4,z===0?'trim':'stone');
    }
  }
  // Eight detached Corinthian giant-order columns; outer bays use pilasters.
  for(const z of [-31,-27,-18,-6,6,18,27,31])column(135.1,z,1.0,29.4,1.2);
  for(const z of [-56,-43,-39,39,43,56]) {
    box('trim',134.25,15.7,z,1.0,27.8,1.9);
    box('trim',134.35,28.8,z,1.2,1.2,2.7);
    if(near)for(const dz of [-.55,0,.55])box('stone',134.83,15.4,z+dz,.18,24,.15);
  }
  // Narrow niches and sculptures between the colonnade and outer arches.
  for(const z of [-36,36]) {
    arch('recess',134.0,z,4.2,2.7,9.0,.12);
    statue(134.7,z,3.1,6.0);
    if(near)plaque('trim',134.55,z,12.0,5.6,.5);
  }
  // Entablature, attic, balustraded roofline and central pediment.
  box('trim',132.5,30.6,0,7.0,1.3,115.15);
  box('recess',132.3,32.05,0,6.4,1.5,114.1);
  box('trim',132.3,33.35,0,7.3,1.1,115.15);
  box('stone',130.9,39.3,0,5.8,10.6,114.1);
  box('trim',131.3,44.4,0,7.3,.85,115.15);
  box('trim',132.3,45.275,0,5.3,.55,115.15);
  for(const z of [-48,-35,-24,-12,12,24,35,48]) {
    plaque('recess',133.92,z,38.9,4.7,5.8);
    plaque('trim',134.15,z,41.9,5.6,.45);
    for(const s of [-1,1])box('trim',134.15,38.9,z+s*2.62,.3,6.2,.32);
  }
  for(const z of [-55,-41,-29,-17,17,29,41,55])box('trim',134.1,39.1,z,.4,9.4,.9);
  pediment(135.0,0,35.6,34.0,6.6,1.6);
  if(near) {
    // A shield and crossed-key relief, kept geometric without unreadable letters.
    const g=new THREE.SphereGeometry(1.4,10,6).scale(.2,1.15,.8).translate(136.03,36.2,0);put(g,'trim');
    for(const s of [-1,1])line('trim',[136.13,35.4,s*2],[136.13,37.0,-s*1],.23);
    // Roof balusters occupy their own plane, clear of the cornice.
    for(let z=-55;z<=55;z+=2.25)box('trim',130.8,45.1,z,.6,.8,.55);
  }
  for(let i=0;i<13;i++)statue(132.3,(i-6)*8.3,45.55,i===6?6.1:5.7,i%3===0);
  // Valadier's clocks and scroll-like stone surrounds at the two end pavilions.
  for(const z of [-49,49]) {
    const disk=(r,x,m)=>put(new THREE.CylinderGeometry(r,r,.28,near?24:12).rotateZ(-Math.PI/2).translate(x,46.2,z),m);
    disk(2.75,134.7,'trim');disk(2.2,134.9,'glass');disk(1.98,135.08,'stone');
    line('glass',[135.26,46.2,z],[135.26,47.6,z-.55],.16);
    line('glass',[135.26,46.2,z],[135.26,46.1,z+1.5],.16);
    for(const s of [-1,1]) {
      put(new THREE.TorusGeometry(1.15,.27,4,near?12:6).rotateY(Math.PI/2).translate(134.8,44.4,z+s*3.8),'trim');
      line('trim',[134.8,45,z+s*5.7],[134.8,48.1,z+s*2.1],.4);
    }
  }
  // Grade remains zero; shallow entrance stair is within the owned front strip.
  for(let i=0;i<4;i++)box('stone',135.3+i*.23,(i+1)*.15,0,.55,(i+1)*.3,111.0);
}
