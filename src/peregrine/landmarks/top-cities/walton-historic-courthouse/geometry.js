import * as THREE from 'three';
import {assetBuilder} from '../../asset-geometry.js';
import {SPEC,PALETTES} from './config.js';
import {tools} from './walton-historic-courthouse-parts.js';
export function create({detail='near'}={}){
 const near=detail==='near',b=assetBuilder({...SPEC,palette:PALETTES.light},detail),t=tools(b,near);

 const{rect,ellipse,prism,loft,cap,wall,face,cyl,flush}=t,core=[[-10.3,-14.43],[15.61,-14.43],[15.61,-5.04],[11.35,-5.03],[11.34,7.36],[14.86,7.37],[14.86,15.29],[-10.3,15.29]];
 // Grounded brick core; omit its front skin so arch windows are cut in exactly once.
 for(let i=0;i<core.length-1;i++){wall(core[i],core[i+1],0,.7,'stone');wall(core[i],core[i+1],.7,13.4,'brick',{floors:2,margin:.24,trim:'stone'});}cap(core,13.4,'roof');
 function arch(cx,y,w,h){const n=near?18:10;return[[cx-w/2,y],[cx+w/2,y],...Array.from({length:n+1},(_,i)=>{const a=i*Math.PI/n;return[cx+w/2*Math.cos(a),y+h-w/2+w/2*Math.sin(a)];})];}
 function panel(outer,holes,mat,fn,out){const all=[...outer,...holes.flat()];for(const tri of THREE.ShapeUtils.triangulateShape(outer.map(p=>new THREE.Vector2(...p)),holes.map(r=>r.map(p=>new THREE.Vector2(...p)))))face(mat,tri.map(i=>fn(...all[i])),out);}
 const holes=[...[-4.5,0,4.5].map(z=>arch(z,8.4,3.2,7.4)),...[-11,11].flatMap(z=>[arch(z,1.5,1.6,4.7),arch(z,8.2,1.6,4.2)]),...[-4.5,0,4.5].map(z=>arch(z,1.3,2,4.7))];
 panel([[-14.43,0],[15.29,0],[15.29,13.4],[7.7,13.4],[7.7,17],[-7.7,17],[-7.7,13.4],[-14.43,13.4]],holes,'brick',(z,y)=>[-10.3,y,z],[-1,0,0]);for(const h of holes){const c=(h[0][0]+h[1][0])/2,Y=h[0][1],inside=h.map(([z,y])=>[c+(z-c)*.88,Y+.13+(y-Y)*.94]);const middle=h.map(([z,y])=>[c+(z-c)*.94,Y+.065+(y-Y)*.97]);panel(h,[middle],'stone',(z,y)=>[-10.3,y,z],[-1,0,0]);panel(middle,[inside],'trim',(z,y)=>[-10.3,y,z],[-1,0,0]);face('glass',inside.map(([z,y])=>[-10.3,y,z]),[-1,0,0]);b.bar('trim',[-10.3,Y+.2,c],[-10.3,Math.max(...h.map(p=>p[1]))-.3,c],.09);b.bar('trim',[-10.3,Y+2,c-(h[1][0]-h[0][0])*.4],[-10.3,Y+2,c+(h[1][0]-h[0][0])*.4],.09);}
 // Central gable and the two steep slate mansards are distinct roof masses.
 const tri=[[-7.7,17],[7.7,17],[0,20.4]],inTri=tri.map(([z,y])=>[z*.86,17.3+(y-17)*.84]);for(const x of[-10.5,-10.25]){panel(tri,[inTri],'stone',(z,y)=>[x,y,z],[x< -10.3?-1:1,0,0]);face('brick',inTri.map(([z,y])=>[x,y,z]),[x< -10.3?-1:1,0,0]);}
 loft([rect(22,14, .5,.4),rect(11,5,.5,.4)],[17,18.5],'roof');
 for(const z of[-10.55,11.15]){loft([rect(27.2,8.7,2.3,z),rect(20,4.8,2.3,z)],[13.4,17.3],'roof');prism(rect(28,9.2,2.3,z),13.15,13.5,'stone');
 // Front dormer has a little white gable and a dark actual pane.
 const outer=[[-.8,14.2],[.8,14.2],[.8,15.6],[0,16.5],[-.8,15.6]],hole=[[-.45,14.4],[.45,14.4],[.45,15.6],[0,16.1],[-.45,15.6]];panel(outer,[hole],'trim',(Z,y)=>[-10.8,y,Z+z],[-1,0,0]);face('glass',hole.map(([Z,y])=>[-10.8,y,Z+z]),[-1,0,0]);}
 for(const z of[-7,7])wall([-10.3,z],[11.35,z],13.4,17,'brick',{},z>0?-1:1);
 // Tall end dormers retain the circular oculus visible down Monroe streets.
 for(const side of[-1,1]){const z=side<0?-14.7:15.55,tri=[[-3.5,14.2],[3.5,14.2],[2.1,17.6],[0,19.1],[-2.1,17.6]],circle=ellipse(.8,.8,near?32:16).map(([x,y])=>[x,y+17.1]);panel(tri,[circle],'stone',(x,y)=>[x,y,z],[0,0,side]);face('glass',circle.map(([x,y])=>[x,y,z]),[0,0,side]);for(const x of[-2.1,2.1])b.bar('stone',[x,17.6,z],[0,19.1,z],.22);}
 // Open six-post bracketed porch. Thin arch spandrels meet both posts and the balcony beam.
 prism(rect(4.5,22,-12.55,0),0,1,'brick');for(let i=0;i<4;i++)prism(rect(.45,5,-15.025-i*.45,0),0,1-i*.22,'stone');
 for(const z of[-10,-6,-2,2,6,10]){prism(rect(.38,.38,-14.5,z),1,6.5,'trim',{bottom:false});prism(rect(.65,.65,-14.5,z),1,1.35,'stone',{top:false});cap(rect(.65,.65,-14.5,z),1.35,'stone',true,[rect(.38,.38,-14.5,z)]);}
 b.box('trim',[-12.55,6.8,0],[4.5,.6,22]);for(const z of[-10,-6,-2,2,6,10])b.bar('trim',[-14.5,5.7,z],[-13.7,6.5,z],.16);
 for(let j=0;j<5;j++){const z=-8+j*4,h=arch(z,1.35,3.6,5.15),o=[[z-2,1.35],[z+2,1.35],[z+2,6.5],[z-2,6.5]];for(const x of[-14.68,-14.3])panel(o,[h],'trim',(z,y)=>[x,y,z],[x< -14.5?-1:1,0,0]);for(let i=0;i<h.length;i++){const a=h[i],c=h[(i+1)%h.length];face('trim',[[-14.68,a[1],a[0]],[-14.3,a[1],a[0]],[-14.3,c[1],c[0]],[-14.68,c[1],c[0]]],[0,a[0]-c[0],c[1]-a[1]]);}}
 function rail(a,c,y){b.bar('trim',[a[0],y+.8,a[1]],[c[0],y+.8,c[1]],.14);const n=Math.ceil(Math.hypot(c[0]-a[0],c[1]-a[1])/(near?.65:1.3));for(let i=0;i<=n;i++){const f=i/n,x=a[0]+(c[0]-a[0])*f,z=a[1]+(c[1]-a[1])*f;b.bar('trim',[x,y,z],[x,y+.8,z],.11);}}
 rail([-14.7,-11],[-14.7,11],7.1);for(const z of[-11,11])rail([-14.7,z],[-10.3,z],7.1);
 // Current white tower: lower paired windows, big clock and louver stage, flat hipped crown.
 const tx=1,tz=.4;prism(rect(6.5,6.5,tx,tz),13.4,18.3,'brick',{floors:0});prism(rect(6.5,6.5,tx,tz),18.3,22.4,'trim',{floors:1,bays:2,margin:.22,glass:'glass',roof:'trim'});prism(rect(7.2,7.2,tx,tz),22.4,22.8,'trim');
 for(let k=0;k<4;k++){const a=k*Math.PI/2,fn=(x,y,z=3.2)=>[tx+x*Math.cos(a)+z*Math.sin(a),y,tz-x*Math.sin(a)+z*Math.cos(a)],out=[Math.sin(a),0,Math.cos(a)],clock=ellipse(1.1,1.1,near?40:24).map(([x,y])=>[x,y+27.7]),louver=[[-1.3,23.6],[1.3,23.6],[1.3,25.5],[-1.3,25.5]];panel([[-3.2,22.8],[3.2,22.8],[3.2,30.4],[-3.2,30.4]],[clock,louver],'trim',(x,y)=>fn(x,y),out);face('clock',clock.map(([x,y])=>fn(x,y)),out);face('clock',louver.map(([x,y])=>fn(x,y,2.6)),out);for(let y=23.7;y<25.5;y+=near?.23:.46)face('trim',[fn(-1.3,y,2.7),fn(1.3,y,2.7),fn(1.3,y+.1,2.7),fn(-1.3,y+.1,2.7)],out);
 for(const x of[-2.75,2.75]){b.bar('trim',fn(x,22.8,3.3),fn(x,30.4,3.3),.32);}
 for(let i=0;i<12;i++){const a=i*Math.PI/6;face('trim',[[.82,-.035],[1.02,-.035],[1.02,.035],[.82,.035]].map(([r,w])=>fn(r*Math.sin(a)+w*Math.cos(a),27.7+r*Math.cos(a)-w*Math.sin(a))),out);}b.bar('trim',fn(0,27.7,3.21),fn(-.55,28.2,3.21),.07);b.bar('trim',fn(0,27.7,3.21),fn(.2,28.55,3.21),.06);
 }
 prism(rect(5.1,5.1,tx,tz),22.8,30.4,'clock');prism(rect(7.3,7.3,tx,tz),30.4,31.1,'trim');loft([rect(7.3,7.3,tx,tz),rect(5,5,tx,tz)],[31.1,32.1],'roof');const r=rect(5.1,5.1,tx,tz);for(let i=0;i<4;i++)rail(r[i],r[(i+1)%4],32.1);cyl('iron',tx,tz,.04,32.1,33.5,.02,near?8:6);
 for(const[x,z]of[[-4,-9],[-4,10],[8,-9],[8,10]])prism(rect(.8,.8,x,z),13.4,19.5,'brick');
 const root=flush(7.9*Math.PI/180);root.traverse(m=>{if(!m.isMesh)return;const g=m.geometry;g.rotateY(-7.9*Math.PI/180);const p=g.attributes.position;for(let i=0;i<p.count;i++){let x=p.getX(i),y=p.getY(i),z=p.getZ(i);if(y>=18.299&&Math.abs(x-1)<4&&Math.abs(z-.4)<4){x=1+(x-1)*.88;z=.4+(z-.4)*.88;}p.setXYZ(i,x,y*27.8/33.5,z);}g.rotateY(7.9*Math.PI/180);g.computeVertexNormals();});return root;
}
