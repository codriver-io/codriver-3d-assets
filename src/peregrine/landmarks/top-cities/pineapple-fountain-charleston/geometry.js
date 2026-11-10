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
 lathe('bronze',[[0,0],[.75,0],[.75,.3],[.52,.5],[.44,1.58],[.65,1.72],[0,1.72]],near?24:12);
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
 bowl(.95,3.25,near?40:20);bowl(1.95,2.12,near?30:15);
 // Pineapple body above the second bowl, oval shoulders and tapered neck.
 lathe('bronze',[[0,1.83],[.45,1.83],[.53,2.05],[.70,2.28],[.90,2.50],[.94,2.68],[.82,2.86],[.61,3.01],[.38,3.08],[0,3.08]],near?32:16);
 // Original diamond skin plaques: forty near / eighteen far, same subdued bronze.
 const rows=near?4:3,cols=near?14:8;
 for(let j=0;j<rows;j++)for(let i=0;i<cols;i++){
  const y=2.27+j*.19,a=(i+(j%2)*.5)*2*Math.PI/cols,r=y<2.6?.83+(y-2.27)*.85:1.14-(y-2.6)*.7;
  const u=new THREE.Vector3(Math.cos(a),0,-Math.sin(a)),N=new THREE.Vector3(Math.sin(a),0,Math.cos(a)),C=N.clone().multiplyScalar(r*.82);
  const at=(dx,dy,dr)=>C.clone().addScaledVector(u,dx).addScaledVector(N,dr).add(new THREE.Vector3(0,y+dy,0)).toArray();
  mesh('bronze',[at(-.15,0,0),at(0,-.12,0),at(.15,0,0),at(0,.12,0),at(0,0,.10)],[0,1,4,1,2,4,2,3,4,3,0,4]);
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
 for(let i=0;i<8;i++)leaf(i*Math.PI/4,2.98,.88,.22,.15);
 for(let i=0;i<8;i++)leaf((i+.45)*Math.PI/4,3.02,.72,.62,.17);
 for(let i=0;i<6;i++)leaf((i+.2)*Math.PI/3,3.04,.34,.96,.14);
 // Static representative flow: thin separate falling streams leave negative space.
 function stream(a,r,y,r1,endY){
  const points=[];for(let j=0;j<=4;j++){const t=j/4,rr=r+(r1-r)*t;points.push(new THREE.Vector3(rr*Math.sin(a),y-(y-endY)*t*t,rr*Math.cos(a)));}
  const curve=new THREE.CatmullRomCurve3(points);put(new THREE.TubeGeometry(curve,near?5:3,near?.022:.026,near?4:3,false),'water');
 }
 const count=near?32:16;
 for(let i=0;i<count;i++){const a=i*2*Math.PI/count;stream(a,3.23,1.02,3.47,.15);stream(a+.08,2.08,2.03,2.39,.92);}
 for(let i=0;i<(near?16:8);i++)stream(i*2*Math.PI/(near?16:8),.91,2.72,1.2,1.99);
 // Small crown plume terminates within the leaf cup; it is not a tall invented geyser.
 lathe('water',[[0,3.05],[.10,3.05],[.14,3.84],[.07,4.0],[0,4.0]],near?8:6);
 const root=b.finish();root.traverse(o=>{if(o.isMesh)o.geometry.deleteAttribute('bridgeLift');});root.userData.elevationDatum=MANIFEST.elevationDatum;return root;
}
