import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES, MANIFEST } from './config.js';
import { PLAN, THETA } from './westminster-abbey-plan.js';
import { parts } from './westminster-abbey-parts.js';

export function create({detail='near'}={}) {
  const b=assetBuilder({...SPEC,palette:PALETTES.light},detail),k=parts(b,detail==='near');
  const {box,bar,window,rose,gable,pinnacle}=k,members=[];
  k.volume(PLAN,0,.5);
  // Low eastern chapel walls follow the outline; west portals remain unobstructed.
  const eastPlan=[];
  for(let i=0;i<PLAN.length;i++){
    const a=PLAN[i-1<0?PLAN.length-1:i-1],p=PLAN[i];
    if((a[0]>=49)!==(p[0]>=49)){const t=(49-a[0])/(p[0]-a[0]);eastPlan.push([49,a[1]+(p[1]-a[1])*t]);}
    if(p[0]>=49)eastPlan.push(p);
  }
  k.volume(eastPlan,.5,12);
  box('stone',[-27,11.5,3.3],[72,23,25.4]);
  box('roof',[-27,23.4,3.3],[71.5,.6,25]);
  box('stone',[-26,28.3,3.3],[65,10.6,13.2]);
  gable(-57.8,6.2,-3.3,9.9,33.6,43);
  // Low crossing lantern, below the west towers.
  box('stone',[12.7,29.75,3.3],[13.2,34.5,13.2]);
  gable(6.1,19.3,-3.3,9.9,47,51);
  for(const [z0,z1,end,axis] of [[-26.4,-3.3,-26.4,'N'],[9.9,33.2,33.2,'S']]) {
    box('stone',[12.7,11.3,(z0+z1)/2],[25.5,22.6,z1-z0]);
    box('roof',[12.7,23.2,(z0+z1)/2],[25.1,.6,z1-z0-.2]);
    box('stone',[12.7,28.3,(z0+z1)/2],[13.2,10.6,z1-z0]);
    gable(-z1,-z0,6.1,19.3,33.6,43,true);
    gable(axis==='N'?-end:-end-.6,axis==='N'?-end+.6:-end,6.1,19.3,33.6,43,true,'stone');
    rose(axis,12.7,28.1,end+(axis==='N'?-.6:.6),5.1);
    for(const x of [5.4,20]){box('stone',[x,19,end],[1.7,38,2.1]);pinnacle(x,end,38,47,.85);}
    for(const x of [1.4,24]){box('stone',[x,13,end],[1.8,26,2]);pinnacle(x,end,26,37,.85);}
    for(const x of [5,12.7,20.4])window(axis,x,.8,end+(axis==='N'?-.85:.85),5.3,10,'recess',k.near?1:0);
    for(const x of [6.8,9.8,12.7,15.6,18.6])window(axis,x,13.3,end+(axis==='N'?-.65:.65),1.6,4.1,'recess',0);
  }
  for(const x of [5,12.7,20.4]) {
    box('stone',[x,2.6,-28.4],[7.3,5.2,3.8]);
    gable(26.5,30.3,x-3.7,x+3.7,5.2,10.1,true,'stone');
    window('N',x,.6,-30.85,4.7,5.8,'recess',0);
  }
  // Polygonal choir apse and the lower Henry VII Lady Chapel.
  box('stone',[35.1,11.5,3.3],[31.8,23,25]);
  box('roof',[35.1,23.4,3.3],[31.4,.6,24.6]);
  k.volume([[19.3,-3.3],[36,-3.3],[44.3,1],[44.3,5.6],[36,9.9],[19.3,9.9]],23.7,9.9);
  gable(19.4,36,-3.3,9.9,33.6,43);
  k.volume([[36,-3.3],[44.3,1],[44.3,5.6],[36,9.9]],33.6,2.8,'roof');
  box('stone',[66.5,18.75,3.3],[34,12.5,13]);
  gable(49.5,80,-3.2,9.8,25,27);
  k.volume([[80,-3.2],[85,0],[85,6.6],[80,9.8]],12.5,12.5);
  gable(80,85,-3.2,9.8,25,27);
  for(const x of [51,57,63,69,75,81])for(const side of [-1,1]) {
    const z=3.3+side*8.1;box('stone',[x,15,z],[1.1,30,2.3]);pinnacle(x,z,30,31,.7);
    window(side<0?'N':'S',x,14,3.3+side*7.4,3.3,8,'glass',k.near?2:1);
  }
  for(const side of [-1,1])for(const x of [-52,-46.3,-40.6,-34.9,-29.2,-23.5,-17.8,-12.1,-6.4,-.7,26,32]) {
    const z=3.3+side*13.3;
    box('stone',[x,14.8,z],[1.2,29.6,2.2]);pinnacle(x,z,29.6,36,.7);
    window(side<0?'N':'S',x+2.5,25,3.3+side*7.5,3.1,7.7,'glass',1);
    if(k.near||x<7)window(side<0?'N':'S',x+2.5,12.8,3.3+side*13.5,3.1,8.6,'glass',k.near?2:1);
    const m=k.flying(x,z,3.3+side*6.35,27.8,32);
    members.push({...m,pier:{x,z,halfX:.6,halfZ:1.1,top:29.6},wall:{z0:-3.3,z1:9.9,y0:23,y1:33.6}});
  }
  // Hawksmoor twin west towers, stepped counterforts, eight 69 m corner pinnacles.
  for(const z of [-7.1,13.1]) {
    box('stone',[-63.4,29.5,z],[8,59,8]);
    for(const x of [-67.6,-59.2])for(const dz of [-4.2,4.2]) {
      box('stone',[x,17,z+dz],[2.6,34,2.6]);box('stone',[x,42,z+dz],[2,16,2]);
      box('stone',[x,55,z+dz],[1.5,10,1.5]);pinnacle(x,z+dz,60,69,.85);
    }
    for(const y of [16,34,39,50,59])box('stone',[-63.4,y,z],[10.2,.8,10.2]);
    for(const dz of [-4,4])for(const x of [-66.8,-65.1,-63.4,-61.7,-60])box('stone',[x,60,z+dz],[.6,1.5,.6]);
    for(const axis of ['W','E','N','S']) {
      const u=axis==='W'||axis==='E'?z:-63.4,p=axis==='W'?-68.35:axis==='E'?-58.45:axis==='N'?z-4.95:z+4.95;
      window(axis,u,40,p,5.2,13.7,'recess',k.near?2:1);
      if(k.near)for(let y=40.5;y<50;y+=.75)bar('stone',k.xyz(axis,u-2.4,y,p),k.xyz(axis,u+2.4,y,p),.12);
      window(axis,u,17.2,p,4.8,13,'recess',k.near?2:1);
      if(k.near)for(const du of [-3.7,3.7])bar('stone',k.xyz(axis,u+du,39.5,p),k.xyz(axis,u+du,58,p),.25);
    }
  }
  rose('W',-7.1,36.5,-69.05,2.4,'clock');
  bar('stone',[-69.08,36.5,-7.1],[-69.08,38.2,-7.1],.12);
  bar('stone',[-69.08,36.5,-7.1],[-69.08,36.1,-8.7],.12);
  rose('W',13.1,36.5,-69.05,2.4,'recess');
  box('stone',[-66.9,17.8,3],[3.2,35.6,11.8]);
  window('W',3,11,-69.5,9.2,22,'glass',k.near?5:3);
  window('W',3,.35,-69.15,6.7,8.6,'recess',0);
  gable(-69,-65,-2.9,8.9,35.6,43.8,false,'stone');
  for(const z of [-2.8,8.8]){box('stone',[-69.2,16,z],[1.1,32,1.1]);pinnacle(-69.2,z,32,36,.6);}
  if(k.near)for(const z of [-1.8,0,1.8,3.6,5.4,7.2]) {
    box('stone',[-69.45,9.6,z],[.32,1.4,.42]);pinnacle(-69.45,z,10.3,11.3,.25);
  }
  const root=b.finish();
  root.traverse(o=>{if(!o.isMesh)return;const old=o.geometry;old.deleteAttribute('bridgeLift');o.geometry=mergeVertices(old,1e-4);old.dispose();o.geometry.rotateY(THETA);o.geometry.computeBoundingBox();o.geometry.computeBoundingSphere();});
  root.userData.flyingButtresses=members;root.userData.elevationDatum=MANIFEST.elevationDatum;return root;
}
