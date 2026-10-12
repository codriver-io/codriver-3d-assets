import * as THREE from 'three';

export const DOME_CENTER=[-.5,.5];
export const GOLD_PROFILE=[[11.43,49.3],[11.43,50],[11.14,51.8],[10.4,53.7],[9.18,55.6],[7.3,57.3],[4.8,58.6],[2.35,59.4],[2.05,59.6]];

export function buildDome(k) {
  const {box,cylinder,lathe,frame,bar,near,put}=k, [cx,cz]=DOME_CENTER;
  // Octagonal crossing pedestal and moulded transition to a tall sixteen-bay drum.
  cylinder('stone',cx,cz,12.4,12.4,28.7,34.8,8);
  cylinder('stone',cx,cz,12.5,11.3,34.8,36,16);
  cylinder('stone',cx,cz,11.5,11.5,36,36.6,32);
  cylinder('stone',cx,cz,8.2,8.2,36.6,47.4,16);
  const apothem=9.85, bays=16, width=2*apothem*Math.tan(Math.PI/bays);
  for(let i=0;i<bays;i++) {
    const a=i*2*Math.PI/bays;
    const f=frame(cx+apothem*Math.cos(a),cz+apothem*Math.sin(a),a);
    f.wall(width,36.6,47.4,[{s:0,y:38,w:1.9,h:6.2},{s:0,y:45.1,w:1.15,h:1.15,arch:true}],.8);
    for(const s of [-width/2+.3,width/2-.3]){
      f.box('stone',s-.2,s+.2,37.1,46.9,-.1,.58);
      f.box('stone',s-.32,s+.32,46.4,47.4,-.1,.8);
    }
    f.box('stone',-width/2,width/2,36.6,37.2,-.2,.7);
    f.box('stone',-width/2,width/2,44.45,44.8,-.1,.25);
    if(near){f.pediment(2.5,44.4,.5,-.05,.32);for(const s of [-1.1,1.1])f.box('stone',s-.12,s+.12,37.2,38,-.05,.45);}
  }
  lathe('stone',[[11,47.4],[11,47.8],[11.65,48.1],[11.65,48.5],[11.2,48.8],[11.43,49.3]],near?32:20);
  // Gold leaf reads warm yellow, never orange. Shaded shell and floodlit ribs share seams.
  // Continuous shell: narrow raised gold strips replace shell faces, rather than overlay them.
  // All seam vertices meet; there is no second surface behind each rib.
  function shellStrip(material,angles,lifts) {
    const positions=[],indices=[],count=angles.length;
    for(const [r,y] of GOLD_PROFILE)for(let j=0;j<count;j++)positions.push(cx+(r+lifts[j])*Math.cos(angles[j]),y,cz+(r+lifts[j])*Math.sin(angles[j]));
    for(let i=1;i<GOLD_PROFILE.length;i++)for(let j=1;j<count;j++){
      const a=(i-1)*count+j-1,b=a+1,c=i*count+j-1,d=c+1;
      indices.push(a,c,b,b,c,d);
    }
    const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));g.setIndex(indices);g.computeVertexNormals();put(g,material);
  }
  const ribs=16, half=.013;
  for(let i=0;i<ribs;i++) {
    const a=i*2*Math.PI/ribs, end=(i+1)*2*Math.PI/ribs;
    shellStrip('lamp',[a-half,a,a+half],[0,.17,0]);
    const segments=near?3:2, angles=[];
    for(let j=0;j<=segments;j++)angles.push(a+half+(end-a-2*half)*j/segments);
    shellStrip('gold',angles,angles.map(()=>0));
  }
  cylinder('stone',cx,cz,2.1,2.1,59.6,60.4,near?24:12);
  cylinder('stone',cx,cz,2.4,2.4,60.4,60.9,near?24:12);
  // Open lantern columns: glazing stays on an inset core, with real silhouette gaps.
  for(let i=0;i<8;i++) {
    const a=i*Math.PI/4;
    cylinder('stone',cx+1.92*Math.cos(a),cz+1.92*Math.sin(a),.23,.21,60.9,64.15,near?8:5);
    const f=frame(cx+1.36*Math.cos(a+Math.PI/8),cz+1.36*Math.sin(a+Math.PI/8),a+Math.PI/8);
    f.wall(2*1.36*Math.tan(Math.PI/8),60.9,64.15,[{s:0,y:61.4,w:.64,h:2.2}],.4);
  }
  cylinder('stone',cx,cz,2.36,2.36,64.15,64.65,near?24:12);
  lathe('lamp',[[2.36,64.65],[2.16,65.25],[1.6,65.85],[.75,66.35],[.58,66.65]],near?24:12);
  cylinder('stone',cx,cz,.66,.66,66.65,67.65,near?12:8);
  // Miss Freedom: white-painted copper, draped robe, raised right torch, lowered sword.
  lathe('stone',[[.72,67.65],[.78,68.1],[.58,69.15],[.45,70.3],[.39,70.65]],near?12:8);
  cylinder('stone',cx,cz,.23,.23,70.6,70.88,near?10:6);
  const head=new THREE.SphereGeometry(.34,near?12:8,near?7:4).translate(cx,71.1,cz);put(head,'stone');
  bar('stone',[cx-.34,70.35,cz],[cx-.8,71.05,cz],.3);
  bar('stone',[cx-.8,71.05,cz],[cx-.78,71.76,cz],.24);
  cylinder('stone',cx-.78,cz,.1,.1,71.5,72.03,near?8:5);
  cylinder('stone',cx-.78,cz,.23,0,72.03,72.34,near?8:5);
  bar('stone',[cx+.32,70.4,cz],[cx+.78,69.55,cz],.28);
  bar('stone',[cx+.78,69.55,cz],[cx+.86,69.17,cz],.21);
  box('stone',cx+.81,cx+.91,67.85,69.28,cz-.06,cz+.06);
}
