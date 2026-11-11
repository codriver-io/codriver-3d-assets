import * as THREE from 'three';
import{assetBuilder}from'../../asset-geometry.js';
import{SPEC,PALETTES}from'./config.js';
import{PARTS}from'./footprint.js';
import{kit}from'./bt-tower-london-geometry-kit.js';
export function create({detail='near'}={}){
 const near=detail==='near',b=assetBuilder({...SPEC,palette:PALETTES.light},detail),k=kit(b,THREE),n=near?48:18,cos=Math.cos(SPEC.origin[1]*Math.PI/180);
 const ring=p=>p.ring.slice(0,-1).map(([x,z])=>[(x-SPEC.origin[0])*111320*cos,(SPEC.origin[1]-z)*111320]);
 const solids=PARTS.filter(p=>[192156426,331901546,331901547,331901548,331901549,192156427,331904806,331904913].includes(p.id)).map(p=>({id:p.id,ring:ring(p),lo:p.id===192156426?0:6,hi:p.id===192156426?6:p.height}));
 const inside=(p,r)=>{let yes=false;for(let i=0,j=r.length-1;i<r.length;j=i++){const a=r[i],c=r[j];if((a[1]>p[1])!==(c[1]>p[1])&&p[0]<(c[0]-a[0])*(p[1]-a[1])/(c[1]-a[1])+a[0])yes=!yes;}return yes;};
 const onRing=(p,r)=>r.some((a,i)=>{const c=r[(i+1)%r.length],dx=c[0]-a[0],dz=c[1]-a[1],t=Math.max(0,Math.min(1,((p[0]-a[0])*dx+(p[1]-a[1])*dz)/(dx*dx+dz*dz)));return Math.hypot(p[0]-a[0]-t*dx,p[1]-a[1]-t*dz)<.07;});
 function office(p,lo,hi){const r=ring(p),sign=Math.sign(k.area(r));r.forEach((a,i)=>{const c=r[(i+1)%r.length],len=Math.hypot(c[0]-a[0],c[1]-a[1]),cols=Math.max(1,Math.ceil(len/(near?3.5:10))),rows=Math.max(1,Math.round((hi-lo)/(near?3:6))),levels=[...new Set([lo,hi,...Array.from({length:rows-1},(_,i)=>lo+(hi-lo)*(i+1)/rows),...solids.flatMap(s=>[s.lo,s.hi]).filter(y=>y>lo&&y<hi)])].sort((a,c)=>a-c),out=[sign*(c[1]-a[1]),0,sign*(a[0]-c[0])];const at=(s,y)=>[a[0]+(c[0]-a[0])*s,y,a[1]+(c[1]-a[1])*s];
  for(let j=0;j<cols;j++)for(let v=0;v<levels.length-1;v++){const s=j/cols,t=(j+1)/cols,pad=Math.min(.2/cols,(near?.24:.4)/Math.max(1,len)),y=levels[v],z=levels[v+1],low=y+Math.min(.5,(z-y)*.2),high=z-Math.min(.7,(z-y)*.23);
   for(const[mat,A,C,Y,Z]of[['stone',s,t,y,low],['stone',s,t,high,z],['stone',s,s+pad,low,high],['stone',t-pad,t,low,high],['glass',s+pad,t-pad,low,high]]){const mid=at((A+C)/2,(Y+Z)/2),L=Math.hypot(out[0],out[2]),probe=[mid[0]+out[0]/L*.12,mid[2]+out[2]/L*.12];if(!solids.some(other=>other.id!==p.id&&mid[1]>other.lo&&mid[1]<other.hi&&(inside(probe,other.ring)||(p.id>other.id&&onRing([mid[0],mid[2]],other.ring)))))k.face(mat,[at(A,Y),at(C,Y),at(C,Z),at(A,Z)],out);}
  }
 });k.cap('roof',r,hi);if(lo===0)k.cap('stone',r,0,false);}
 office(PARTS.find(p=>p.id===192156426),0,6);
 for(const id of[331901546,331901547,331901548,331901549,192156427,331904806,331904913]){const p=PARTS.find(p=>p.id===id);office(p,6,p.height);}
 // Continuous stepped shell with adjoining glass/metal strips, never facade overlays.
 const stations=[[0,6.5],[24,6.5],[24,9.4]],mats=['stone','stone'];
 const add=(y,r,mat)=>{stations.push([y,r]);mats.push(mat);};
 const rows=near?19:10;for(let i=0;i<rows;i++){const z=24+76*(i+1)/rows;add(z-(near?.4:.7),9.4,'glass');add(z,9.4,'metal');}
 add(100,6.5,'metal');add(110,6.5,'stone');
 for(let y=110;y<143;y+=near?5.5:8.25){add(y,9.4,'metal');add(y+.55,9.4,'metal');add(y+.55,6.5,'metal');add(Math.min(143,y+(near?5.5:8.25)),6.5,'stone');}
 add(144,7.2,'stone');add(144,9.4,'metal');add(145.1,9.4,'metal');add(151,9.4,'glass');add(152,10,'metal');add(153.1,10,'metal');add(157.1,10,'glass');add(158,10,'metal');add(158,9.4,'metal');add(164.8,9.4,'display');add(166,9.4,'metal');add(166,6.5,'metal');add(170,6.5,'stone');add(170,7.9,'metal');add(174,7.9,'metal');add(174,3.1,'metal');add(177,3.1,'gallery');
 k.radial(stations,n,(v,j)=>mats[v]==='glass'&&j%(near?4:3)===0?'metal':mats[v]);
 for(const part of antennaParts(detail)){if(!part.diagnosticOnly)b.put(part.geometry,'metal');else part.geometry.dispose();}
 k.flush();return b.finish();
}

// Separately named authoring parts make every terminal/support contact observable in tests.
export function antennaParts(detail='near'){
 const near=detail==='near',parts=[],leg=(i,y)=>{const t=i*2*Math.PI/3,r=1.5*(189-y)/12+.1;return[r*Math.cos(t),y,r*Math.sin(t)];};
 function bar(name,a,c,width,supports){const A=new THREE.Vector3(...a),C=new THREE.Vector3(...c),d=C.clone().sub(A),g=new THREE.BoxGeometry(width,d.length(),width);g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0),d.normalize()));g.translate(...A.add(C).multiplyScalar(.5).toArray());parts.push({name,geometry:g,a,c,supports});}
 for(let i=0;i<3;i++)bar('leg'+i,leg(i,176.8),leg(i,188.8),near?.13:.18,['cap','mast']);
 for(let i=0;i<3;i++)for(let y=177;y<187;y+=near?2:4)bar(`brace${i}-${y}`,leg(i,y),leg((i+1)%3,Math.min(188.8,y+(near?2:4))),near?.07:.1,['leg'+i,'leg'+((i+1)%3)]);
 const mast=new THREE.CylinderGeometry(.08,.2,12,near?12:6);mast.translate(0,183,0);parts.push({name:'mast',geometry:mast});
 const cap=new THREE.CylinderGeometry(3.1,3.1,3,near?48:24);cap.translate(0,175.5,0);parts.push({name:'cap',geometry:cap,diagnosticOnly:true});
 return parts;
}
