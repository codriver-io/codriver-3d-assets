import * as THREE from 'three';
import {assetBuilder} from '../../asset-geometry.js';
import {SPEC,PALETTES,MANIFEST} from './config.js';
// Small radial sculpture, original procedural profiles; no compass rotation needed.
export function create({detail='near'}={}){
 const near=detail==='near',b=assetBuilder({...SPEC,palette:PALETTES.light},detail),n=near?64:32;
 const put=(g,m)=>b.put(g,m);
 function lathe(mat,p,seg=n){const g=new THREE.LatheGeometry(p.map(v=>new THREE.Vector2(...v)),seg);put(g,mat);}
 function mesh(mat,ps,ix){const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(ps.flat(),3));g.setIndex(ix);const flat=g.toNonIndexed();flat.computeVertexNormals();put(flat,mat);g.dispose();}
 // Low circular perimeter and recessed water, rather than a model-wide context disc.
 lathe('basin',[[5.03,0],[5.28,0],[5.28,.26],[5.06,.34],[4.95,.27],[4.95,.04],[5.03,0]]);
 // Grounded central pedestal supports both bowls.
 lathe('bronze',[[0,0],[.75,0],[.75,.3],[.52,.5],[.44,1.58],[.65,1.72],[.40,1.9],[.35,2.30],[0,2.30]],near?24:12);
 // The water surface has a true hole for the pedestal and ends inside the basin rim.
 const water=new THREE.RingGeometry(.75,4.94,n);water.rotateX(-Math.PI/2);water.translate(0,.14,0);put(water,'pool');
 function bowl(y,R,petals){
  // Closed bowl profile; the leaf-like scallop is part of the actual rim geometry.
  const profile=[[.45,y-.36],[R*.62,y-.30],[R*.91,y-.16],[R,y],[R,y+.1],[R*.93,y+.18],[R*.76,y-.04],[.45,y-.12]],steps=near?petals*2:petals;
  const ps=[],ix=[];
  for(let j=0;j<profile.length;j++)for(let i=0;i<=steps;i++){
   const a=i*2*Math.PI/steps,[r,yy]=profile[j],bump=j>=2&&j<=5?(near?.08*(1-Math.cos(a*petals))/2:.045):0;
   ps.push([(r+bump)*Math.sin(a),yy,(r+bump)*Math.cos(a)]);
  }
  for(let j=0;j<profile.length;j++)for(let i=0;i<steps;i++){
   const jj=(j+1)%profile.length,a=j*(steps+1)+i,c=jj*(steps+1)+i;ix.push(a,c,a+1,a+1,c,c+1);
  }
  // Reverse profile direction so the outside lower bowl faces outwards.
  for(let i=0;i<ix.length;i+=3)[ix[i+1],ix[i+2]]=[ix[i+2],ix[i+1]];
  mesh('bronze',ps,ix);
 }
 bowl(1.10,3.25,near?40:20);bowl(2.0,2.12,near?30:15);
 // Full ovoid, clear of the upper bowl. The diamond relief IS the skin:
 // adjacent raised diamond pyramids share boundary vertices, with no background
 // lathe or overlapping plaques. Dimensions are photographic estimates.
 const bottom=2.16,top=3.94,rows=near?10:6,cols=near?20:12,step=2*Math.PI/cols;
 const radius=y=>.95*Math.sqrt(Math.max(.085,1-((y-(bottom+top)/2)/((top-bottom)/2))**2));
 const point=(a,y,relief=0)=>[(radius(y)+relief)*Math.sin(a),y,(radius(y)+relief)*Math.cos(a)];
 const height=j=>bottom+(top-bottom)*j/rows;
 for(let j=1;j<rows;j++)for(let i=0;i<cols;i++){
  const a=(i+(j%2)*.5)*step,y=height(j);
  const corners=[point(a,height(j-1)),point(a+step/2,y),point(a,height(j+1)),point(a-step/2,y)];
  const center=point(a,y,near?.055:.05);
  for(let face=0;face<4;face++){
   const points=[corners[face],corners[(face+1)%4],center];
   const u=new THREE.Vector3(...points[1]).sub(new THREE.Vector3(...points[0]));
   const v=new THREE.Vector3(...points[2]).sub(new THREE.Vector3(...points[0]));
   const out=new THREE.Vector3(Math.sin(a),0,Math.cos(a));
   if(u.cross(v).dot(out)<0)[points[1],points[2]]=[points[2],points[1]];
   mesh(face%2===0?'fruit':'bronze',points,[0,1,2]);
  }
 }
 // Complete the two boundary half-diamond rows and closed neck/foot caps.
 for(const [j,adj,up] of [[0,1,false],[rows,rows-1,true]])for(let i=0;i<cols;i++){
  const a=(i+.5)*step,ps=[point(a,height(j)),point(a+step,height(j)),point(a+step/2,height(adj))];
  const normal=new THREE.Vector3(...ps[1]).sub(new THREE.Vector3(...ps[0])).cross(new THREE.Vector3(...ps[2]).sub(new THREE.Vector3(...ps[0])));
  if(normal.dot(new THREE.Vector3(Math.sin(a+step/2),0,Math.cos(a+step/2)))<0)[ps[1],ps[2]]=[ps[2],ps[1]];
  mesh('fruit',ps,[0,1,2]);
  const cap=[[0,height(j),0],point(a,height(j)),point(a+step,height(j))];
  mesh('fruit',cap,up?[0,1,2]:[0,2,1]);
 }
 // Crown of curled lanceolate leaves: every leaf root embeds in the fruit neck.
 function leaf(a,base,endR,rise,width){
  const seg=near?5:3,ps=[],ix=[];
  for(let j=0;j<=seg;j++){
   const t=j/seg,r=.23+(endR-.23)*t,y=base+rise*Math.sin(t*Math.PI/2),w=Math.max(.009,width*Math.sin(Math.PI*Math.min(.95,t+.08)));
   for(const [side,th] of [[-1,-.025],[1,-.025],[-1,.025],[1,.025]]){
    const x=r*Math.sin(a)+side*w*Math.cos(a),z=r*Math.cos(a)-side*w*Math.sin(a);ps.push([x,y+th,z]);
   }
   if(j){const p=(j-1)*4,q=j*4;ix.push(p,p+1,q,p+1,q+1,q,p+2,q+2,p+3,p+3,q+2,q+3,p,q,p+2,p+2,q,q+2,p+1,p+3,q+1,p+3,q+3,q+1);}
  }
  ix.push(0,2,1,1,2,3);const p=seg*4;ix.push(p,p+1,p+2,p+1,p+3,p+2);mesh('patina',ps,ix);
 }
 for(let i=0;i<8;i++)leaf(i*Math.PI/4,3.82,.88,.35,.15);
 for(let i=0;i<8;i++)leaf((i+.45)*Math.PI/4,3.85,.72,.82,.17);
 for(let i=0;i<6;i++)leaf((i+.2)*Math.PI/3,3.90,.34,1.215,.14);
 // Static representative flow: thin separate falling streams leave negative space.
 function stream(a,r,y,r1,endY){
  const points=[];for(let j=0;j<=4;j++){const t=j/4,rr=r+(r1-r)*t;points.push(new THREE.Vector3(rr*Math.sin(a),y-(y-endY)*t*t,rr*Math.cos(a)));}
  const curve=new THREE.CatmullRomCurve3(points);put(new THREE.TubeGeometry(curve,near?5:3,near?.022:.026,near?4:3,false),'water');
 }
 const count=near?32:16;
 for(let i=0;i<count;i++){const a=i*2*Math.PI/count;stream(a,3.23,1.17,3.47,.15);stream(a+.08,2.08,2.08,2.39,1.07);}
 for(let i=0;i<(near?16:8);i++)stream(i*2*Math.PI/(near?16:8),.87,3.50,1.25,1.95);
 // Small crown plume terminates within the leaf cup; it is not a tall invented geyser.
 lathe('water',[[0,3.89],[.10,3.89],[.14,4.96],[.07,5.12],[0,5.12]],near?8:6);
 const root=b.finish();root.traverse(o=>{if(o.isMesh)o.geometry.deleteAttribute('bridgeLift');});root.userData.elevationDatum=MANIFEST.elevationDatum;return root;
}
