import * as THREE from 'three';
import {assetBuilder} from '../../asset-geometry.js';
import {SPEC,PALETTES} from './config.js';
import {tools} from './athens-city-hall-parts.js';
export function create({detail='near'}={}){
 const near=detail==='near',b=assetBuilder({...SPEC,palette:PALETTES.light},detail),t=tools(b,near);

 const{rect,ellipse,prism,loft,cap,wall,cyl,sphere,face,flush}=t;
 const w=16.3,d=34.4;
 // The core is separate from all three open porches; basement is a grounded rigid plinth.
 prism(rect(w,d),0,3,'base',{floors:1,bays:7,margin:.3,roof:'base',top:false,bottom:false});
 function arch(cx,y,w,h,n=near?16:8){return[[cx-w/2,y],[cx+w/2,y],...Array.from({length:n+1},(_,i)=>{const a=i*Math.PI/n;return[cx+w/2*Math.cos(a),y+h-w/2+w/2*Math.sin(a)];})];}
 function flatPanel(outer,holes,mat,fn,out){const all=[...outer,...holes.flat()];for(const tri of THREE.ShapeUtils.triangulateShape(outer.map(p=>new THREE.Vector2(...p)),holes.map(r=>r.map(p=>new THREE.Vector2(...p)))))face(mat,tri.map(i=>fn(...all[i])),out);}
 // Two long facades: round-headed lower windows and taller rectangular upper windows, flush frames.
 for(const side of[-1,1]){const x=side*w/2,out=[side,0,0],fn=(z,y)=>[x,y,z],zs=[-13.6,-8.15,-2.7,2.7,8.15,13.6],holes=[];for(const z of zs){const h=arch(z,3.7,2.3,4.1);holes.push(h);holes.push([[z-1.15,9],[z+1.15,9],[z+1.15,12.2],[z-1.15,12.2]]);}flatPanel([[-d/2,3],[d/2,3],[d/2,13.2],[-d/2,13.2]],holes,'stone',fn,out);for(const h of holes){const mx=(h[0][0]+h[1][0])/2,my=Math.min(...h.map(p=>p[1])),inside=h.map(([z,y])=>[mx+(z-mx)*.86,my+.14+(y-my)*.92]);flatPanel(h,[inside],'trim',fn,out);face('glass',inside.map(p=>fn(...p)),out);b.bar('trim',fn(mx,my+.2),fn(mx,Math.max(...h.map(p=>p[1]))-.2),.09);const cross=my>8?10.7:6.6;b.bar('trim',fn(mx-1.02,cross),fn(mx+1.02,cross),.1);}}
 for(const z of[-d/2,d/2])wall([-w/2,z],[w/2,z],3,13.2,'stone',{floors:2,bays:4,margin:.24,trim:'trim'},z>0?-1:1);
 prism(rect(w+.55,d+.55),13.2,13.6,'trim');loft([rect(w,d),rect(3,d-8)],[13.6,15.3],'roof');
 for(const x of[-8.3,8.3])for(const z of[-16.4,16.4])for(let y=3.3;y<13;y+=.7)b.box('stone',[x,y,z],[.4,.6,1.1]);
 // Roof balustrade is a real open rail, with a few simplified balusters retained at far distance.
 function rail(a,c,y,mat='trim'){b.bar(mat,[a[0],y+.85,a[1]],[c[0],y+.85,c[1]],.17);const L=Math.hypot(c[0]-a[0],c[1]-a[1]),n=Math.ceil(L/(near?.75:1.5));for(let i=0;i<=n;i++){const f=i/n,x=a[0]+(c[0]-a[0])*f,z=a[1]+(c[1]-a[1])*f;b.bar(mat,[x,y,z],[x,y+.85,z],.12);}}
 const rr=rect(w+.2,d+.2);for(let i=0;i<3;i++)rail(rr[i],rr[(i+1)%4],13.6);rail(rr[3],[-8.25,7.35],13.6);rail([-8.25,-7.35],rr[0],13.6);
 // Deep west portico and limestone stair fit the mapped projection.
 prism(rect(5.0,11.4,-10.65,.4),0,3,'stone');for(let i=0;i<12;i++)prism(rect(.44,10,-13.37-i*.44,.4),0,3-i*.235,'stone');
 for(const x of[-12.65,-8.7])for(const z of[-4.3,5.1]){cyl('trim',x,z,.58,3,3.45);cyl('stone',x,z,.44,3.45,8.65,.36,near?16:8);cyl('trim',x,z,.63,8.65,9.05);}
 b.box('trim',[-10.65,9.35,.4],[5, .6,11.4]);rail([-13.15,-5.3],[-13.15,6.1],9.65,'iron');for(const z of[-5.3,6.1])rail([-13.15,z],[-8.15,z],9.65,'iron');
 // End porches repeat the published three-entrance composition, smaller than the main stair.
 for(const side of[-1,1]){prism(rect(8,3,0,side*18.7),0,3,'stone');for(const x of[-3.1,3.1]){cyl('stone',x,side*19.3,.36,3,8.8,.3,near?12:8);cyl('trim',x,side*19.3,.5,8.8,9.05);}b.box('trim',[0,9.3,side*18.7],[8,.5,3]);rail([-4,side*20.2],[4,side*20.2],9.55,'iron');for(let i=0;i<8;i++)prism(rect(7,.4,0,side*(20.4+i*.4)),0,3-i*.35,'stone');}
 // Pediment over the front balcony, with a recessed semicircular fanlight cut into its panel.
 const tri=[[-7.2,13.6],[7.2,13.6],[0,16.8]],fan=[[-1.5,13.7],[1.5,13.7],...Array.from({length:near?17:9},(_,i)=>{const a=i*Math.PI/(near?16:8);return[1.5*Math.cos(a),13.7+1.5*Math.sin(a)];})];flatPanel(tri,[fan],'stone',(z,y)=>[-8.5,y,z],[-1,0,0]);face('glass',fan.map(([z,y])=>[-8.5,y,z]),[-1,0,0]);for(const z of[-7.2,7.2])b.bar('trim',[-8.6,13.6,z],[-8.6,16.8,0],.28);
 // Seven-metre belfry on the mapped tower, three louvered lights on every face.
 prism(rect(7.4,7.4),14.2,15,'trim');
 for(let k=0;k<4;k++){const a=k*Math.PI/2,fn=(x,y,z=3.5)=>[x*Math.cos(a)+z*Math.sin(a),y,-x*Math.sin(a)+z*Math.cos(a)],out=[Math.sin(a),0,Math.cos(a)],holes=[-1.85,0,1.85].map(x=>arch(x,15.5,1.1,3.1));flatPanel([[-3.5,15],[3.5,15],[3.5,19.4],[-3.5,19.4]],holes,'trim',(x,y)=>fn(x,y),out);for(const h of holes){face('clock',h.map(([x,y])=>fn(x,y,2.9)),out);for(let y=15.6;y<17.9;y+=near?.24:.48)face('copper',[fn(h[0][0],y,3),fn(h[1][0],y,3),fn(h[1][0],y+.1,3),fn(h[0][0],y+.1,3)],out);for(let i=0;i<h.length;i++){const a=h[i],c=h[(i+1)%h.length];face('trim',[fn(...a,3.5),fn(...c,3.5),fn(...c,2.9),fn(...a,2.9)],[c[1]-a[1],a[0]-c[0],0]);}}
 const ped=[[-3.1,23.65],[3.1,23.65],[0,24.7]];for(const z of[2.85,3.0])face('trim',ped.map(([x,y])=>fn(x,y,z)),out.map(v=>v*(z===3?1:-1)));for(let j=0;j<3;j++){const a=ped[j],c=ped[(j+1)%3];face('trim',[fn(...a,2.85),fn(...c,2.85),fn(...c,3),fn(...a,3)],[0,1,0]);}
 // Clock faces are cut into the square stage rather than projected decals.
 const clock=Array.from({length:near?40:24},(_,i)=>{const a=i*2*Math.PI/(near?40:24);return[1.05*Math.cos(a),21.8+1.05*Math.sin(a)];});flatPanel([[-2.8,20],[2.8,20],[2.8,24],[-2.8,24]],[clock],'trim',(x,y)=>fn(x,y,2.8),out);face('clock',clock.map(([x,y])=>fn(x,y,2.8)),out);for(let i=0;i<12;i++){const a=i*Math.PI/6;face('trim',[[.8,-.035],[.96,-.035],[.96,.035],[.8,.035]].map(([r,w])=>fn(r*Math.sin(a)+w*Math.cos(a),21.8+r*Math.cos(a)-w*Math.sin(a),2.8)),out);}b.bar('trim',fn(0,21.8,2.81),fn(-.55,22.2,2.81),.06);b.bar('trim',fn(0,21.8,2.81),fn(.25,22.5,2.81),.06);
 }
 prism(rect(7.9,7.9),19.4,20,'trim');prism(rect(5.2,5.2),15,24,'clock');
 // Copper dome and three diminishing lantern tiers, constrained to the published total height.
 const rings=[],ys=[];for(let i=0;i<= (near?10:6);i++){const a=i*Math.PI/2/(near?10:6);rings.push(ellipse(Math.max(.28,2.9*Math.cos(a)),Math.max(.28,2.9*Math.cos(a)),near?40:24));ys.push(24+3.6*Math.sin(a));}loft(rings,ys,'copper');cyl('copper',0,0,1.0,27.6,28.1,.8,near?24:12);cyl('copper',0,0,.62,28.1,28.6,.5,near?20:12);cyl('copper',0,0,.72,28.6,28.9,.45,near?20:12);cyl('copper',0,0,.36,28.9,29.5,.12,near?16:8);
 // Original low-poly eagle: body, head, hooked beak, tail and feathered outspread wings.
 sphere('iron',0,29.75,0,.18,.8,1.3,1.05);sphere('iron',0,30.05,-.16,.125);const beak=new THREE.ConeGeometry(.07,.19,near?8:5);beak.rotateX(-Math.PI/2);beak.translate(0,30.02,-.32);b.put(beak,'iron');
 for(const side of[-1,1]){const poly=[[.1,29.75,0],[.45,29.9,-.13],[1.2192,30.0,.03],[1.12,29.85,.13],[.96,29.83,.26],[.76,29.78,.34],[.40,29.68,.32]];for(const dz of[-.035,.035])face('iron',poly.map(([x,y,z])=>[side*x,y,z+dz]),[0,0,Math.sign(dz)]);for(let i=0;i<poly.length;i++){const a=poly[i],c=poly[(i+1)%poly.length];face('iron',[[side*a[0],a[1],a[2]-.035],[side*c[0],c[1],c[2]-.035],[side*c[0],c[1],c[2]+.035],[side*a[0],a[1],a[2]+.035]],[side*(a[1]-c[1]),c[0]-a[0],0]);}}b.bar('iron',[0,29.65,0],[0,29.5,.4],.12);
 return flush(17.6*Math.PI/180);
}
