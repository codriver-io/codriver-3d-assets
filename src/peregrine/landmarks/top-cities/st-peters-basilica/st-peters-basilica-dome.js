import * as THREE from 'three';
export function dome(k,near) {
  const {box,cylinder,lathe,line,column,arch,put}=k;
  box('stone',0,51.5,0,59.4,9.0,59.4);
  cylinder('trim',0,0,55,58,30.25);
  cylinder('stone',0,0,58,77.4,24.7);
  cylinder('trim',0,0,76.5,79.0,28.0);
  cylinder('trim',0,0,79,81.0,26.7);
  for(let i=0;i<16;i++) {
    const a=i*Math.PI/8, r=26.5, s=Math.sin(a),c=Math.cos(a);
    // Windows are placed against the polygonal drum, columns in pairs on either side.
    const w=new THREE.PlaneGeometry(3.0,12.6).rotateY(a).translate(s*24.84,67.3,c*24.84);put(w,'light');
    for(const offset of [-1.35,1.35])column(s*r+c*offset,c*r-s*offset,59.0,76.7,.77,near);
    if(near) {
      const g=new THREE.BoxGeometry(3.8,.55,.6).rotateY(a).translate(s*25.35,74,c*25.35);put(g,'trim');
      for(const v of [-1,1])line('trim',[s*25.3+c*v*1.7,60.7,c*25.3-s*v*1.7],[s*25.3+c*v*1.7,73.7,c*25.3-s*v*1.7],.25);
    }
  }
  // Ogival double-shell exterior. Sixteen ribs, not an interchangeable hemisphere.
  const profile=[[25.7,81],[25.55,85],[24.85,89],[23.65,93],[21.8,97],[19.3,101],[16.3,105],[12.7,109],[8.7,112.4],[5.6,114.5],[0,114.5]];
  lathe('dome',0,0,profile,near?48:24);
  for(let j=0;j<16;j++) {
    const a=j*Math.PI/8, s=Math.sin(a),c=Math.cos(a);
    const ribs=near?profile:profile.filter((v,i)=>i%2===0||i===profile.length-2);
    for(let i=0;i<ribs.length-2;i++) {
      const [r,y]=ribs[i],[r1,y1]=ribs[i+1];
      line('trim',[s*(r+.16),y,c*(r+.16)],[s*(r1+.16),y1,c*(r1+.16)],near?.48:.55);
    }
    if(near) {
      for(const [r,y] of [[24.9,89.8],[21.9,97.3],[15.6,105.8]]) {
        const g=new THREE.BoxGeometry(1.8,2.1,.7).rotateY(a).translate(s*(r+.2),y,c*(r+.2));put(g,'trim');
        const q=new THREE.PlaneGeometry(.85,1.0).rotateY(a).translate(s*(r+.61),y,c*(r+.61));put(q,'glass');
      }
    }
  }
  cylinder('trim',0,0,114.25,116.0,5.8);
  cylinder('light',0,0,116,125.0,3.6,3.5,near?16:8);
  for(let i=0;i<8;i++) {
    const a=i*Math.PI/4;
    column(Math.sin(a)*4.6,Math.cos(a)*4.6,116,125.8,.38,false);
  }
  cylinder('trim',0,0,125.6,127.1,5.1,4.8);
  lathe('dome',0,0,[[4.8,127],[4.5,128],[3.6,129.4],[2.2,130.6],[.65,131.4],[0,131.4]],near?24:12);
  cylinder('lamp',0,0,131.25,132.6,.5,.34,8);
  put(new THREE.SphereGeometry(.7,near?12:6,near?6:4).translate(0,132.9,0),'lamp');
  box('lamp',0,135.185,0,.26,2.77,.26);
  box('lamp',0,135.35,0,.28,.25,1.7);
  // Four lower corner domes: OSM positions and diameters rather than decorative turrets.
  for(const [x,z,r] of [[-36.9,-37.8,8.8],[36.6,-37.8,9.1],[-37.7,36.8,8.6],[36.6,36.8,8.6]]) {
    cylinder('stone',x,z,45.5,52.8,r+1.0);
    cylinder('trim',x,z,52.4,54.1,r+1.4);
    lathe('dome',x,z,[[r,54],[r*.93,55.8],[r*.75,57.7],[r*.43,59.2],[.65,60],[0,60]],near?24:12);
    for(let i=0;i<(near?8:4);i++) {
      const a=i*Math.PI/(near?4:2);
      line('trim',[x+Math.sin(a)*r,54,z+Math.cos(a)*r],[x+Math.sin(a)*r*.75,57.7,z+Math.cos(a)*r*.75],.24);
      line('trim',[x+Math.sin(a)*r*.75,57.7,z+Math.cos(a)*r*.75],[x+Math.sin(a)*.65,60,z+Math.cos(a)*.65],.24);
    }
    cylinder('trim',x,z,59.8,61.3,.75,.3,near?8:4);
    if(near)for(let j=0;j<8;j++) {
      const a=j*Math.PI/4;
      put(new THREE.PlaneGeometry(1.4,3.8).rotateY(a).translate(x+Math.sin(a)*(r+1.07),49.9,z+Math.cos(a)*(r+1.07)),'glass');
    }
  }
}
