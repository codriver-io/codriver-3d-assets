import * as THREE from 'three';
import {assetBuilder} from '../../asset-geometry.js';
import {SPEC,PALETTES} from './config.js';
import {tools} from './coolray-field-parts.js';
export function create({detail='near'}={}){
 const near=detail==='near',b=assetBuilder({...SPEC,palette:PALETTES.light},detail),t=tools(b,near);

 const {rect,ellipse,prism,wall,cap,cyl,face,flush}=t;
 const envelope=[[79.25364660783274,81.71913094694186],[90.05647541178456,77.01756380505927],[81.80836998614437,34.85906809310022],[66.30405004436406,4.481067286599469],[79.00843423767955,-7.152953580474772],[69.22926652697574,-13.004967254569097],[77.92707287450368,-25.223593010179613],[30.449870857705193,-55.60319336542013],[32.78560468060047,-59.47096339664889],[17.78263567078004,-68.59694774587302],[20.95826779096645,-73.19224344578392],[4.415025800914663,-84.09360161020719],[-27.670753114665732,-36.897967817723284],[-20.330216165046572,-31.771379605194245],[-37.795630245843476,-16.044498359160706],[-41.06783428547901,-18.610208599864748],[-82.61438766991057,44.62035562890382],[-72.97445946070627,55.178474873383905],[-60.68240292352367,42.291446709317825],[-56.81066314592763,42.613230981929135],[-55.807821528599085,58.013131449852025],[-42.17583384681884,48.684449355513706],[-39.7532791002602,36.38950557473002],[-28.298978362245954,20.178152053141115],[0.9586922827802034,-6.452077358937285],[17.34426001924868,-5.63485845098606],[52.27321376206631,42.087070760739124],[55.396740675119105,54.55407761139312]],pitch=[[79.25364660783274,81.71913094694186],[55.396740675119105,54.55407761139312],[54.059636689975726,53.03001721787282],[52.27321376206631,42.087070760739124],[17.34426001924868,-5.63485845098606],[0.9586922827802034,-6.452077358937285],[-28.298978362245954,20.178152053141115],[-39.7532791002602,36.38950557473002],[-42.17583384681884,48.684449355513706],[-55.807821528599085,58.013131449852025],[-69.20873323614092,71.94648431102749],[-62.483595806312174,90.5303959223838],[-46.59903637181612,110.18665941403569],[-19.651609226031226,125.48828655141074],[11.004764082940255,129.01469794147226],[36.832583021330905,121.31700272005756],[60.39029101298989,106.30136715229958]],inner=[[-55.807821528599085,58.013131449852025],[-42.17583384681884,48.684449355513706],[-39.7532791002602,36.38950557473002],[-28.298978362245954,20.178152053141115],[0.9586922827802034,-6.452077358937285],[17.34426001924868,-5.63485845098606],[52.27321376206631,42.087070760739124],[55.396740675119105,54.55407761139312],[79.25364660783274,81.71913094694186]];
 // Adjacent coplanar ground regions: no dirt/grass decals laid over a second surface.
 const dirt=[[0,12],...Array.from({length:near?33:17},(_,i)=>{const a=-Math.PI/4+i*Math.PI/2/(near?32:16);return[55*Math.sin(a),12+55*Math.cos(a)];})],diamond=[[0,18],[14,32],[0,46],[-14,32]],mound=ellipse(2.7,2.7,near?20:12,0,30.44);
 cap(pitch,.15,'turf',true,[dirt]);cap(dirt,.15,'dirt',true,[diamond]);cap(diamond,.15,'turf',true,[mound]);cap(mound,.15,'dirt');
 for(const[x,z]of [[19.397,31.397],[0,50.795],[-19.397,31.397]])b.box('stone',[x,.21,z],[.39,.12,.39]);
 // Piecewise mapped infield edge. The outward ray stops at the actual outer stadium envelope.
 const lengths=[0];for(let i=1;i<inner.length;i++)lengths.push(lengths.at(-1)+Math.hypot(inner[i][0]-inner[i-1][0],inner[i][1]-inner[i-1][1]));
 function at(t){const s=t*lengths.at(-1);let i=1;while(i<lengths.length-1&&lengths[i]<s)i++;const f=(s-lengths[i-1])/(lengths[i]-lengths[i-1]),a=inner[i-1],c=inner[i],dx=c[0]-a[0],dz=c[1]-a[1],l=Math.hypot(dx,dz),p=[a[0]+dx*f,a[1]+dz*f];const normal=k=>{const A=inner[Math.max(0,k-1)],C=inner[Math.min(inner.length-1,k+1)],dx=C[0]-A[0],dz=C[1]-A[1],L=Math.hypot(dx,dz);return[dz/L,-dx/L];},na=normal(i-1),nc=normal(i);let n=[na[0]*(1-f)+nc[0]*f,na[1]*(1-f)+nc[1]*f];const N=Math.hypot(...n);n=n.map(v=>v/N);if(n[0]*p[0]+n[1]*(p[1]-60)<0)n=n.map(x=>-x);let available=Infinity;
  for(let j=0;j<envelope.length;j++){const a=envelope[j],c=envelope[(j+1)%envelope.length],vx=c[0]-a[0],vz=c[1]-a[1],det=n[0]*vz-n[1]*vx;if(Math.abs(det)<1e-8)continue;const ax=a[0]-p[0],az=a[1]-p[1],u=(ax*vz-az*vx)/det,v=(ax*n[1]-az*n[0])/det;if(u>.2&&v>=0&&v<=1)available=Math.min(available,u);}
  if(!Number.isFinite(available))available=30;const width=Math.max(1,Math.min(20,available*.58));return{p,n,width,available,point:(r,y)=>[p[0]+n[0]*r,y,p[1]+n[1]*r]};
 }
 const count=near?72:36,samples=Array.from({length:count+1},(_,i)=>at(.018+.964*i/count)),rows=near?18:9;
 for(let i=0;i<count;i++){const a=samples[i],c=samples[i+1];
  for(let row=0;row<rows;row++){const f=row/rows,g=(row+1)/rows,ya=.8+10*f,yc=.8+10*g,aisle=i%(near?12:6)===0;face(aisle?'stone':'seat',[a.point(a.width*f,ya),c.point(c.width*f,ya),c.point(c.width*g,ya),a.point(a.width*g,ya)],[0,1,0]);face('seat',[a.point(a.width*g,ya),c.point(c.width*g,ya),c.point(c.width*g,yc),a.point(a.width*g,yc)],[-a.n[0],0,-a.n[1]]);}
  const A=a.point(a.width,0),C=c.point(c.width,0);wall([A[0],A[2]],[C[0],C[2]],0,10.8,'brick',{},1);face('stone',[a.point(0,0),c.point(0,0),c.point(0,.8),a.point(0,.8)],[-a.n[0],0,-a.n[1]]);face('stone',[a.point(0,0),a.point(a.width,0),c.point(c.width,0),c.point(0,0)],[0,-1,0]);
 }
 for(const i of[0,count]){const a=samples[i];face('brick',[a.point(0,0),a.point(a.width,0),a.point(a.width,10.8),a.point(0,.8)],i===0?[-1,0,0]:[1,0,0]);}
 // Covered suite ribbon and roof are kept on the broader central portion of the grandstand.
 for(let i=0;i<count;i++){const s=.018+.964*(i+.5)/count;if(s<.12||s>.88)continue;const a=samples[i],c=samples[i+1],ra=Math.min(a.available-.5,a.width+10),rc=Math.min(c.available-.5,c.width+10),fa=Math.max(a.width-8,1),fc=Math.max(c.width-8,1);
  face('metal',[a.point(a.width,10.8),c.point(c.width,10.8),c.point(c.width,11.5),a.point(a.width,11.5)],[-a.n[0],0,-a.n[1]]);
  const A=a.point(a.width,0),C=c.point(c.width,0),B=a.point(ra,0),D=c.point(rc,0);wall([A[0],A[2]],[C[0],C[2]],11.5,18.8,'metal',{floors:1,bays:1,margin:.10},-1);wall([D[0],D[2]],[B[0],B[2]],0,18.8,'brick',{floors:2,bays:1,margin:.28},-1);
  face('roof',[a.point(fa,20.3),c.point(fc,20.3),c.point(rc,21),a.point(ra,21)],[0,1,0]);face('roof',[a.point(fa,19.95),a.point(ra,20.65),c.point(rc,20.65),c.point(fc,19.95)],[0,-1,0]);face('roof',[a.point(fa,19.95),c.point(fc,19.95),c.point(fc,20.3),a.point(fa,20.3)],[-a.n[0],0,-a.n[1]]);face('roof',[a.point(ra,20.65),a.point(ra,21),c.point(rc,21),c.point(rc,20.65)],[a.n[0],0,a.n[1]]);
  for(const [q,f,r] of [[a,fa,ra],[c,fc,rc]])face('roof',[q.point(f,19.95),q.point(r,20.65),q.point(r,21),q.point(f,20.3)],[q.n[1],0,-q.n[0]]);
  if(i%(near?6:3)===0){b.bar('metal',a.point(ra,0),a.point(ra,20.65),.3);b.bar('metal',a.point(ra,20.5),a.point(fa,20.1),.32);}
 }
 // Low masonry entry pavilion with the distinctive pair of overlapping sloping roofs, not an invented tower.
 prism(rect(24,16,12,-57),0,13,'brick',{floors:2,bays:6,margin:.22,trim:'stone',bottom:false,roof:'roof'});
 function plane(cx,cz,y){const r=rect(24,20,cx,cz),top=r.map(([x,z])=>[x,y+(x-(cx-12))*.0625,z]),bottom=top.map(([x,y,z])=>[x,y-.35,z]);face('roof',top,[0,1,0]);face('roof',bottom,[0,-1,0]);for(let i=0;i<4;i++){const j=(i+1)%4;face('roof',[bottom[i],bottom[j],top[j],top[i]],[r[j][1]-r[i][1],0,r[i][0]-r[j][0]]);}for(const[x,z]of r)b.bar('metal',[x,0,z],[x,y+(x-cx+12)*.0625-.35,z],.28);}
 plane(10,-57,15.5);plane(16,-51,16.7);
 // Six founded poles with crossarms contacting every floodlight head.
 const poleFeet=[... [.10,.35,.65,.90].map(t=>{const a=at(t),p=a.point(Math.min(a.available-1,a.width+7),0);return[p[0],p[2]];}),[-50,120],[50,128]];
 for(const[x,z]of poleFeet){b.box('stone',[x,.2,z],[1.7,.4,1.7]);cyl('metal',x,z,.33,.4,33.3,.18,near?10:6);b.box('metal',[x,33.5,z],[8,.4,.45]);const n=near?6:4;for(let i=0;i<n;i++)b.box('stone',[x-3.5+i*7/(n-1),34.3,z],[.9,1.2,.5]);}
 // Blank outfield video board on named, ground-connected posts. No logos or screen image.
 for(const x of[22,38])b.box('metal',[x,8,132],[.7,16,.7]);b.box('metal',[30,16,132],[19,10,1]);b.box('glass',[30,16,130.85],[17.8,8.8,.7]);
 return flush(1.1344640137963142);
}
