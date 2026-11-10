import * as THREE from 'three';
import {assetBuilder} from '../../asset-geometry.js';
import {SPEC,PALETTES,AXIS,LENGTH} from './config.js';
export const SPAN=75.2856, HALF=LENGTH/2;
export const point=(s,d,y)=>[s*Math.cos(AXIS)-d*Math.sin(AXIS),y,s*Math.sin(AXIS)+d*Math.cos(AXIS)];
export const height=s=>Math.abs(s)<=SPAN/2?11.8:11.8-8.8*((Math.abs(s)-SPAN/2)/(HALF-SPAN/2))**1.3;
export function create({detail='near'}={}){
 const near=detail==='near',b=assetBuilder({...SPEC,palette:PALETTES.light},detail),faces={};
 const box=(m,s,d,y,l,w,h)=>b.box(m,point(s,d,y),[l,h,w],-AXIS);
 const bar=(m,a,c,w,depth=w)=>b.bar(m,point(...a),point(...c),w,depth);
 function quad(m,ps,out){const f=faces[m]??={p:[],ix:[]},k=f.p.length/3,n=new THREE.Vector3(...ps[1]).sub(new THREE.Vector3(...ps[0])).cross(new THREE.Vector3(...ps[2]).sub(new THREE.Vector3(...ps[0])));const tri=ps[2].every((v,i)=>v===ps[3][i]);f.p.push(...(tri?ps.slice(0,3):ps).flat());const ids=n.dot(new THREE.Vector3(...out))>=0?[k,k+1,k+2,k,k+2,k+3]:[k,k+2,k+1,k,k+3,k+2];f.ix.push(...(tri?ids.slice(0,3):ids));}
 function strip(m,a,c,l,r,off,depth=0,top=true){const n=Math.ceil((c-a)/(near?8:16));for(let i=0;i<n;i++){
 const s=a+(c-a)*i/n,t=a+(c-a)*(i+1)/n,p=(u,v,o)=>point(u,v,height(u)+o);
 if(top)quad(m,[p(s,l,off),p(t,l,off),p(t,r,off),p(s,r,off)],[0,1,0]);
 if(depth){quad(m,[p(s,l,off-depth),p(t,l,off-depth),p(t,r,off-depth),p(s,r,off-depth)],[0,-1,0]);for(const v of [l,r])quad(m,[p(s,v,off),p(t,v,off),p(t,v,off-depth),p(s,v,off-depth)],[-Math.sin(AXIS)*Math.sign(v),0,Math.cos(AXIS)*Math.sign(v)]);}}
 if(depth)for(const u of [a,c])quad(m,[point(u,l,height(u)+off),point(u,r,height(u)+off),point(u,r,height(u)+off-depth),point(u,l,height(u)+off-depth)],[(u===a?-1:1)*Math.cos(AXIS),0,(u===a?-1:1)*Math.sin(AXIS)]);
 }
 // Separate disjoint pavement, sidewalk and concrete shell; harbor-side walk is 5.5 ft.
 strip('concrete',-HALF,HALF,-6.5,5.5,0,.45,false);strip('asphalt',-HALF,HALF,-4.267,4.267,0);
 strip('concrete',-HALF,HALF,-6.5,-4.8,.2,.2);strip('concrete',-HALF,HALF,4.267,5.5,0);strip('concrete',-HALF,HALF,-4.8,-4.267,0);
 for(const d of [-4.8,4.8])strip('steel',-HALF,HALF,d-.2,d+.2,-.45,1.55);
 // Six simple plate-girder approach spans on each bank.
 for(const side of [-1,1])for(let i=0;i<=6;i++){
 const s=side*(SPAN/2+(HALF-SPAN/2)*i/6),top=height(s)-2;
 for(const d of [-3.4,3.4])box('concrete',s,d,top/2,1.25,1.25,top);
 box('concrete',s,0,top+.15,2.2,11.6,.7);
 }
 // Central cylindrical pivot, bearing table and transverse swing-span frame.
 const cylinder=new THREE.CylinderGeometry(3.3,3.9,9.4,near?24:12);cylinder.translate(0,4.7,0);b.put(cylinder,'concrete');
 box('steel',0,0,9.9,8.0,11.8,1);box('steel',0,0,10.5,4.6,11.9,.4);
 const pitch=SPAN/8,us=Array.from({length:9},(_,i)=>-SPAN/2+i*pitch),tops=[11.65,18.6,20,21,21,21,20,18.6,11.65];
 for(const d of [-4.55,4.55])for(let i=0;i<8;i++){
 const a=us[i],c=us[i+1];bar('steel',[a,d,11.2],[c,d,11.2],.38,.58);bar('steel',[a,d,tops[i]],[c,d,tops[i+1]],.34,.4);
 if(i>0)bar('steel',[a,d,11.2],[a,d,tops[i]],.23,.29);
 if(i>0&&i<7)bar('steel',i<4?[a,d,tops[i]]:[a,d,11.2],i<4?[c,d,11.2]:[c,d,tops[i+1]],.2,.25);
 }
 for(let i=0;i<9;i++){
 const s=us[i];bar('steel',[s,-6.5,11.2],[s,5.5,11.2],.36,.7);
 if(i>0&&i<8){bar('steel',[s,-4.55,tops[i]],[s,4.55,tops[i]],.23,.3);
 if(near&&i<7){bar('steel',[s,-4.55,tops[i]],[us[i+1],4.55,tops[i+1]],.12);bar('steel',[s,4.55,tops[i]],[us[i+1],-4.55,tops[i+1]],.12);}}
 }
 // Tender house: solid parapet and separate window bays. Top chord supports the whole cabin.
 box('steel',0,0,21,4.4,4.2,.32);
 for(const side of [-1,1]){
 quad('cabin',[point(-2.2,side*2.1,21.16),point(2.2,side*2.1,21.16),point(2.2,side*2.1,22.3),point(-2.2,side*2.1,22.3)],[-Math.sin(AXIS)*side,0,Math.cos(AXIS)*side]);
 quad('cabin',[point(side*2.2,-2.1,21.16),point(side*2.2,2.1,21.16),point(side*2.2,2.1,22.3),point(side*2.2,-2.1,22.3)],[Math.cos(AXIS)*side,0,Math.sin(AXIS)*side]);
 }
 for(const side of [-1,1]){
 for(let i=0;i<3;i++){const s=-2.2+i*4.4/3;
 quad('glass',[point(s+.12,side*2.1,22.3),point(s+4.4/3-.12,side*2.1,22.3),point(s+4.4/3-.12,side*2.1,24),point(s+.12,side*2.1,24)],[-Math.sin(AXIS)*side,0,Math.cos(AXIS)*side]);
 box('cabin',s+.06,side*2.1,23.15,.12,.18,1.7);}
 box('cabin',2.14,side*2.1,23.15,.12,.18,1.7);
 quad('glass',[point(side*2.2,-1.95,22.3),point(side*2.2,1.95,22.3),point(side*2.2,1.95,24),point(side*2.2,-1.95,24)],[Math.cos(AXIS)*side,0,Math.sin(AXIS)*side]);
 }
 box('cabin',0,0,24.12,4.6,4.4,.24);
 for(const side of [-1,1])quad('roof',[point(-2.7,side*2.6,24.3),point(2.7,side*2.6,24.3),point(1.2,0,25.5),point(-1.2,0,25.5)],[0,1,0]);
 for(const side of [-1,1])quad('roof',[point(side*2.7,-2.6,24.3),point(side*2.7,2.6,24.3),point(side*1.2,0,25.5),point(side*1.2,0,25.5)],[0,1,0]);
 bar('steel',[0,0,25.5],[0,0,26.5],.065);
 // Supported outer railings. Closed gaps across approach/swing joints are intentionally simplified.
 const n=Math.ceil(LENGTH/(near?3.5:7));
 for(const d of [-6.36,5.35])for(let i=0;i<=n;i++){
 const s=-HALF+LENGTH*i/n;box('rail',s,d,height(s)+.75,.09,.09,1.5);
 if(i){const a=s-LENGTH/n;for(const y of near?[.6,1.45]:[1.45])bar('rail',[a,d,height(a)+y],[s,d,height(s)+y],near?.07:.09);}
 }
 // Pivot protective fender: connected timber piles and three horizontal walers.
 for(const s of [-5.5,5.5])for(let j=0;j<=8;j++)box('timber',s,-14+j*3.5,2.1,.32,.32,4.2);
 for(const s of [-5.5,5.5])for(const y of [1,2.3,3.6])bar('timber',[s,-14,y],[s,14,y],.24);
 for(const d of [-14,14])for(const y of [1,2.3,3.6])bar('timber',[-5.5,d,y],[5.5,d,y],.24);
 for(const [m,f]of Object.entries(faces)){const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(f.p,3));g.setIndex(f.ix);g.computeVertexNormals();b.put(g,m);}
 const root=b.finish();root.traverse(o=>{if(o.isMesh)o.geometry.deleteAttribute('bridgeLift');});return root;
}
