import * as THREE from 'three';
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { assetBuilder } from '../../asset-geometry.js';
import { SPEC, PALETTES } from './config.js';
import { FOOTPRINTS } from './footprint.js';
import { kit, mappedPlan, archShape, rectangle, insetRing } from './the-alamo-parts.js';
export function create({detail='near'}={}){
  const near=detail==='near',b=assetBuilder({...SPEC,palette:PALETTES.light},detail),k=kit(b,near);
  const church=mappedPlan(FOOTPRINTS[0]),barrack=mappedPlan(FOOTPRINTS[1]);
  for(let i=0;i<church.length-1;i++){
    const a=church[i],c=church[i+1];if(Math.max(Math.abs(a[1]),Math.abs(c[1]))<.05)continue;
    const len=Math.hypot(c[0]-a[0],c[1]-a[1]),opens=[];
    if(len>7)for(let j=0;j<Math.floor(len/5);j++)opens.push({t:(j+.5)*len/Math.floor(len/5),y:4.8,w:.8,h:1.1});
    k.wall(a,c,7.3,opens,.65);
  }
  k.poly('roof',insetRing(church,.72),7.08,.16);
  // Present concrete barrel roof behind the rounded crest.
  const vault=new THREE.Shape();vault.moveTo(-4.10,7.25);vault.lineTo(4.10,7.25);vault.lineTo(4.10,7.35);
  const ns=near?32:12;for(let i=1;i<=ns;i++){const t=Math.PI*i/ns;vault.lineTo(4.10*Math.cos(t),7.35+1.35*Math.sin(t));}vault.closePath();k.shape('roof',vault,0,0,1.1,30.3);
  const facade=new THREE.Shape();facade.moveTo(-9.24,0);facade.lineTo(9.71,0);facade.lineTo(9.71,7.6);facade.lineTo(5.2,7.6);facade.lineTo(5.2,8.1);
  facade.bezierCurveTo(3.9,8.1,2.4,8.55,1.4,9.0);facade.lineTo(1.2,9.0);facade.bezierCurveTo(1.1,9.42,.65,9.8,0,9.8);facade.bezierCurveTo(-.65,9.8,-1.1,9.42,-1.2,9.0);facade.lineTo(-1.4,9.0);facade.bezierCurveTo(-2.4,8.55,-3.9,8.1,-4.87,8.1);facade.lineTo(-4.87,7.6);facade.lineTo(-9.24,7.6);facade.closePath();
  const openings=[{u:0,y:.08,w:2.15,h:3.35,arch:true,mat:'wood'},...[-6.7,6.95].flatMap(u=>[3.0,6.12].map(y=>({u,y,w:.78,h:1.14,mat:'iron'}))),{u:0,y:5.3,w:1.03,h:1.55,mat:'iron'},...[-2.65,2.65].flatMap(u=>[1.9,5.23].map(y=>({u,y,w:.72,h:y>5?1.52:1.65,arch:true,mat:'mortar'})))];
  for(const o of openings){const s=o.arch?archShape(o.w,o.h):rectangle(0,0,o.w,o.h);facade.holes.push(new THREE.Path(s.getPoints(near?12:6).map(p=>p.add(new THREE.Vector2(o.u,o.y)))));k.face(o.mat,s,o.u,o.y,.73);}k.shape('stone',facade,0,0,0,.95);
  const arch=archShape(2.65,3.58);arch.holes.push(new THREE.Path(archShape(2.15,3.35).getPoints(near?12:6)));k.shape('trim',arch,0,.08,-.35,.4,true);
  for(const u of [-3.62,-1.63,1.63,3.62]){
    k.box('trim',u,0,-.3,.72,.92,.8,true);k.box('trim',u,.92,-.3,.61,.23,.76,true);k.cyl('trim',u,1.15,-.27,2.82,.205,.19);k.box('trim',u,3.97,-.3,.66,.24,.78,true);k.box('trim',u,4.21,-.28,.59,.3,.73,true);
    if(near){for(const y of [1.3,1.48,3.56,3.75])k.cyl('trim',u,y,-.27,.10,.25);for(let j=0;j<8;j++){const a=j*Math.PI/4;k.cyl('trim',u+.185*Math.cos(a),1.6,-.27+.185*Math.sin(a),1.86,.026);}}
  }
  k.box('trim',0,4.51,-.24,8.15,.22,.65,true);k.box('trim',0,4.73,-.32,8.45,.22,.9,true);k.box('trim',0,4.95,-.20,7.9,.12,.6,true);
  for(const u of [-2.65,2.65]){const ring=archShape(.94,1.79);ring.holes.push(new THREE.Path(archShape(.72,1.65).getPoints(near?12:6)));k.shape('trim',ring,u,1.9,-.21,.25,true);k.box('trim',u,1.71,-.2,1.01,.19,.5,true);for(const side of [-1,1])k.box('trim',u+side*.47,5.17,-.12,.17,1.61,.30,true);if(near){k.box('trim',u,3.8,-.15,1.15,.19,.4,true);k.box('trim',u,1.36,-.15,.88,.26,.4,true);}}
  const shield=new THREE.Shape([new THREE.Vector2(-.28,0),new THREE.Vector2(0,-.48),new THREE.Vector2(.28,0),new THREE.Vector2(.23,.35),new THREE.Vector2(-.23,.35)]);k.shape('trim',shield,0,3.98,-.40,.43,true);
  if(near){for(const u of [-.75,-.25,.25,.75])for(const y of [.35,1.0,1.65,2.30])k.box('wood',u,y,.59,.32,.47,.11);for(const u of [-.38,0,.38])k.box('iron',u,5.31,.57,.04,1.53,.07);for(const y of [5.65,6.05,6.45])k.box('iron',0,y,.57,1.02,.035,.07);for(const o of openings.filter(o=>o.mat==='iron'&&o.u!==0))for(const s of [-1,0,1])k.box('iron',o.u+s*.2,o.y,.59,.028,o.h,.05);}
  // Irregular quiet masonry joints, clipped to the actual curved facade.
  const outline=facade.getPoints(48),inside=(x,y)=>{let c=false;for(let i=0,j=outline.length-1;i<outline.length;j=i++)if((outline[i].y>y)!==(outline[j].y>y)&&x<(outline[j].x-outline[i].x)*(y-outline[i].y)/(outline[j].y-outline[i].y)+outline[i].x)c=!c;return c;};
  const courseHeights=[.29,.43,.34,.51,.31,.38],stoneWidths=[.67,1.31,.89,1.56,.76,1.08];
  if(near){let row=0;for(let y=.22;y<9.8;row++){
    const height=courseHeights[row%courseHeights.length];let col=0;
    for(let u=-9.20;u<9.65;col++){
      const width=stoneWidths[(col*3+row*5)%stoneWidths.length],mid=u+width/2,jointY=y+((col+row)%3-1)*.026;
      u+=width;
      if(!inside(mid-width/2,jointY+height)||!inside(mid+width/2,jointY+height)||Math.abs(mid)<4.25&&y<5.13)continue;
      if(openings.some(o=>Math.abs(mid-o.u)<o.w/2+width/2+.12&&jointY>o.y-.1&&jointY<o.y+o.h+.1))continue;
      k.face('mortar',rectangle(0,0,width-.07,.014),mid,jointY,-.115);
      if((col+row)%3!==0)k.face('mortar',rectangle(0,0,.013,height-.05),mid+width/2-.04,jointY,-.116);
    }y+=height;
  }}
  for(let i=0;i<barrack.length-1;i++){
    const a=barrack[i],c=barrack[i+1],len=Math.hypot(c[0]-a[0],c[1]-a[1]),n=Math.floor(len/6.5),opens=[];
    for(let j=0;j<n;j++)opens.push({t:(j+.5)*len/n,y:j===Math.floor(n/2)&&len>20?0:1.45,w:j===Math.floor(n/2)&&len>20?1.15:.93,h:j===Math.floor(n/2)&&len>20?2.65:1.35});
    const {angle}=k.wall(a,c,4.1,opens,.6);
    if(near){let row=0;for(let y=.3;y<4.0;row++){
      const height=courseHeights[(row+2)%courseHeights.length];let col=0;
      for(let t=.15;t<len-.7;col++){
        const width=stoneWidths[(col*3+row*5)%stoneWidths.length],mid=t+width/2;t+=width;
        if(mid+width/2>len-.12||opens.some(o=>Math.abs(mid-o.t)<o.w/2+width/2+.12&&y>=o.y-.1&&y<=o.y+o.h+.1))continue;
        const g=new THREE.PlaneGeometry(width-.08,.015);g.rotateY(Math.PI);g.translate(mid,y+((row+col)%3-1)*.025,-.11);g.rotateY(angle);g.translate(a[0],0,a[1]);k.put(g,'mortar');
      }y+=height;
    }}
  }
  k.poly('roof',insetRing(barrack,.69),3.84,.16);
  const model=b.finish();model.traverse(o=>{if(o.isMesh){o.geometry.deleteAttribute('bridgeLift');const g=o.geometry;o.geometry=mergeVertices(g,1e-7);g.dispose();}});return model;
}
